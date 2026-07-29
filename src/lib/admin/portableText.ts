// Bidirectional conversion between Sanity Portable Text and a plain
// markdown-ish textarea, used by the admin panel's quick body editors
// (News/Articles/Exchange descriptions).
//
// `block` (paragraph/heading/list/quote), `quoteBlock`, `youtubeEmbed` and
// `tweetEmbed` all round-trip through real text editing — creating a new one
// or editing an existing one both just mean typing/changing the matching
// line. Only `image` can't be represented as text (needs a real file), so it
// stays frozen as a single marker line (`⟦index: description⟧`) — deleting
// that line drops the image, but editing surrounding text never corrupts it.
//
// Syntax summary:
//   # / ## / ### / ####   -> heading levels 1-4
//   > text                 -> blockquote paragraph
//   - text / 1. text       -> bullet / numbered list item (leading "  " pairs = nesting level)
//   **bold** *italic* __underline__ ~~strike~~ `code` {+large+} {-small-}
//   [text](url)            -> dofollow link (default)
//   [text](url "nofollow") -> nofollow link
//   [[quote:author|source|style|text]] -> quoteBlock (author/source/style may be empty)
//   [[youtube:URL]] / [[tweet:URL]]    -> embeds
//   [[img:N]]               -> newly-uploaded image (N = file input slot index)
//   ⟦N: description⟧        -> pre-existing image, preserved untouched

export interface PortableTextBlock {
  _type: string;
  _key?: string;
  [key: string]: unknown;
}

interface Span {
  _type: 'span';
  _key: string;
  text: string;
  marks: string[];
}

interface MarkDef {
  _key: string;
  _type: string;
  href?: string;
  rel?: string;
}

function randomKey(): string {
  return Math.random().toString(36).slice(2, 10);
}

function truncate(s: string, n: number): string {
  return s.length > n ? `${s.slice(0, n)}…` : s;
}

function wrapMarks(span: Span, markDefs: MarkDef[]): string {
  let text = span.text ?? '';
  const marks = span.marks ?? [];
  for (const mark of marks) {
    const def = markDefs.find(d => d._key === mark);
    if (def && def._type === 'link' && def.href) {
      const flag = def.rel === 'nofollow' ? ' "nofollow"' : '';
      text = `[${text}](${def.href}${flag})`;
    }
  }
  if (marks.includes('code')) text = `\`${text}\``;
  if (marks.includes('underline')) text = `__${text}__`;
  if (marks.includes('strike-through')) text = `~~${text}~~`;
  if (marks.includes('em')) text = `*${text}*`;
  if (marks.includes('strong')) text = `**${text}**`;
  if (marks.includes('large')) text = `{+${text}+}`;
  if (marks.includes('small')) text = `{-${text}-}`;
  return text;
}

function quoteBlockToText(block: PortableTextBlock): string {
  const author = String(block.quoteAuthor ?? '');
  const source = String(block.source ?? '');
  const style = String(block.style ?? 'plain');
  const text = String(block.text ?? '');
  return `[[quote:${author}|${source}|${style}|${text}]]`;
}

function blockToParagraph(block: PortableTextBlock): string {
  const children = ((block.children as Span[] | undefined) ?? []).filter(c => c && c._type === 'span');
  const markDefs = (block.markDefs as MarkDef[] | undefined) ?? [];
  let text = children.map(span => wrapMarks(span, markDefs)).join('');
  const listItem = block.listItem as string | undefined;
  const style = block.style as string | undefined;
  const level = Math.max(1, Number(block.level) || 1);
  const indent = '  '.repeat(level - 1);
  if (listItem === 'bullet') text = `${indent}- ${text}`;
  else if (listItem === 'number') text = `${indent}1. ${text}`;
  else if (style === 'h1') text = `# ${text}`;
  else if (style === 'h2') text = `## ${text}`;
  else if (style === 'h3') text = `### ${text}`;
  else if (style === 'h4') text = `#### ${text}`;
  else if (style === 'blockquote') text = `> ${text}`;
  return text;
}

export function blocksToText(blocks: PortableTextBlock[] | undefined): string {
  if (!blocks || blocks.length === 0) return '';
  return blocks
    .map((block, i) => {
      if (block._type === 'block') return blockToParagraph(block);
      if (block._type === 'quoteBlock') return quoteBlockToText(block);
      if (block._type === 'youtubeEmbed') return `[[youtube:${block.url ?? ''}]]`;
      if (block._type === 'tweetEmbed') return `[[tweet:${block.url ?? ''}]]`;
      // Image asset/crop can't be re-authored from plain text, but the alt
      // text can — the marker carries it so editing the line updates just
      // that field on save while the original asset reference is preserved.
      if (block._type === 'image') return `⟦${i}:image:${String(block.alt ?? '')}⟧`;
      return `⟦${i}: ${String(block._type)}⟧`;
    })
    .join('\n\n');
}

// Order matters: longer/more-specific tokens (**, __, ~~, {+ {-) must be
// tried before the single-char ones (*) that could otherwise match first.
// Link group is now 3 captures (text, url, optional nofollow/dofollow flag)
// so every mark group below it shifts up by one vs. the pre-nofollow version.
const INLINE_RE = /\[([^\]]+)\]\(([^()\s]+)(?:\s+"(nofollow|dofollow)")?\)|\*\*([^*]+)\*\*|__([^_]+)__|~~([^~]+)~~|\{\+([^}]+)\+\}|\{-([^}]+)-\}|\*([^*]+)\*|`([^`]+)`/g;

function parseInline(content: string): { spans: Span[]; markDefs: MarkDef[] } {
  const markDefs: MarkDef[] = [];
  const spans: Span[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  // A fresh regex instance per call — not the shared module-level INLINE_RE —
  // because large/small now recurse into parseInline() below. Sharing one
  // stateful `g`-flag regex across the outer loop and a recursive inner call
  // means the inner call's own `lastIndex = 0` reset corrupts the outer
  // loop's position, which without care turns into an infinite loop.
  const re = new RegExp(INLINE_RE.source, INLINE_RE.flags);
  while ((match = re.exec(content)) !== null) {
    if (match.index > lastIndex) {
      spans.push({ _type: 'span', _key: randomKey(), text: content.slice(lastIndex, match.index), marks: [] });
    }
    if (match[1] !== undefined) {
      const key = randomKey();
      markDefs.push({ _key: key, _type: 'link', href: match[2], ...(match[3] === 'nofollow' ? { rel: 'nofollow' } : {}) });
      spans.push({ _type: 'span', _key: randomKey(), text: match[1], marks: [key] });
    } else if (match[4] !== undefined) {
      spans.push({ _type: 'span', _key: randomKey(), text: match[4], marks: ['strong'] });
    } else if (match[5] !== undefined) {
      spans.push({ _type: 'span', _key: randomKey(), text: match[5], marks: ['underline'] });
    } else if (match[6] !== undefined) {
      spans.push({ _type: 'span', _key: randomKey(), text: match[6], marks: ['strike-through'] });
    } else if (match[7] !== undefined) {
      // large/small are wrapper marks that commonly wrap other inline markup
      // (most often a link, e.g. a "quote source" caption) — recurse so that
      // nested syntax like [text](url) still becomes a real link mark instead
      // of surviving as literal "[text](url)" text with only the large/small
      // mark applied.
      const inner = parseInline(match[7]);
      for (const s of inner.spans) spans.push({ ...s, marks: [...s.marks, 'large'] });
      markDefs.push(...inner.markDefs);
    } else if (match[8] !== undefined) {
      const inner = parseInline(match[8]);
      for (const s of inner.spans) spans.push({ ...s, marks: [...s.marks, 'small'] });
      markDefs.push(...inner.markDefs);
    } else if (match[9] !== undefined) {
      spans.push({ _type: 'span', _key: randomKey(), text: match[9], marks: ['em'] });
    } else if (match[10] !== undefined) {
      spans.push({ _type: 'span', _key: randomKey(), text: match[10], marks: ['code'] });
    }
    lastIndex = re.lastIndex;
  }
  if (lastIndex < content.length) {
    spans.push({ _type: 'span', _key: randomKey(), text: content.slice(lastIndex), marks: [] });
  }
  if (spans.length === 0) {
    spans.push({ _type: 'span', _key: randomKey(), text: '', marks: [] });
  }
  return { spans, markDefs };
}

function paragraphToBlock(para: string): PortableTextBlock {
  let style = 'normal';
  let listItem: string | undefined;
  let level = 1;
  let content = para;

  if (content.startsWith('#### ')) {
    style = 'h4';
    content = content.slice(5);
  } else if (content.startsWith('### ')) {
    style = 'h3';
    content = content.slice(4);
  } else if (content.startsWith('## ')) {
    style = 'h2';
    content = content.slice(3);
  } else if (content.startsWith('# ')) {
    style = 'h1';
    content = content.slice(2);
  } else if (content.startsWith('> ')) {
    style = 'blockquote';
    content = content.slice(2);
  } else {
    const bulletMatch = content.match(/^( *)-\s([\s\S]*)$/);
    const numberMatch = content.match(/^( *)\d+\.\s([\s\S]*)$/);
    if (bulletMatch) {
      listItem = 'bullet';
      level = Math.floor(bulletMatch[1].length / 2) + 1;
      content = bulletMatch[2];
    } else if (numberMatch) {
      listItem = 'number';
      level = Math.floor(numberMatch[1].length / 2) + 1;
      content = numberMatch[2];
    }
  }

  const { spans, markDefs } = parseInline(content);
  return {
    _type: 'block',
    _key: randomKey(),
    style,
    ...(listItem ? { listItem, level } : {}),
    markDefs,
    children: spans,
  };
}

function imageField(assetId: string) {
  return { _type: 'image' as const, asset: { _type: 'reference' as const, _ref: assetId } };
}

const QUOTE_STYLES = ['plain', 'accent', 'attributed'];

export function textToBlocks(
  text: string,
  originalBlocks: PortableTextBlock[] | undefined,
  newImageAssetIds?: Record<number, string>
): PortableTextBlock[] {
  // Trim only surrounding newlines/trailing whitespace here, not leading
  // spaces — those encode list-nesting level and must survive into
  // paragraphToBlock's indent detection below.
  const paragraphs = text
    .split(/\n\s*\n/)
    .map(p => p.replace(/^\n+/, '').replace(/\s+$/, ''))
    .filter(Boolean);
  const result: PortableTextBlock[] = [];
  for (const para of paragraphs) {
    const imageAltMatch = para.match(/^⟦(\d+):image:([\s\S]*)⟧$/);
    if (imageAltMatch) {
      const original = originalBlocks?.[Number(imageAltMatch[1])];
      if (original && original._type === 'image') result.push({ ...original, alt: imageAltMatch[2] || undefined });
      continue;
    }
    const preserveMatch = para.match(/^⟦(\d+):/);
    if (preserveMatch) {
      const original = originalBlocks?.[Number(preserveMatch[1])];
      if (original && original._type !== 'block') result.push(original);
      continue;
    }
    const imageMatch = para.match(/^\[\[img:(\d+)(?:\|([\s\S]*))?\]\]$/);
    if (imageMatch) {
      const assetId = newImageAssetIds?.[Number(imageMatch[1])];
      const alt = imageMatch[2];
      if (assetId) result.push({ _key: randomKey(), ...imageField(assetId), ...(alt ? { alt } : {}) });
      continue;
    }
    const youtubeMatch = para.match(/^\[\[youtube:(.+)\]\]$/);
    if (youtubeMatch) {
      result.push({ _type: 'youtubeEmbed', _key: randomKey(), url: youtubeMatch[1].trim() });
      continue;
    }
    const tweetMatch = para.match(/^\[\[tweet:(.+)\]\]$/);
    if (tweetMatch) {
      result.push({ _type: 'tweetEmbed', _key: randomKey(), url: tweetMatch[1].trim() });
      continue;
    }
    const quoteMatch = para.match(/^\[\[quote:([^|]*)\|([^|]*)\|([^|]*)\|([\s\S]*)\]\]$/);
    if (quoteMatch) {
      const [, author, source, styleRaw, quoteText] = quoteMatch;
      const style = QUOTE_STYLES.includes(styleRaw) ? styleRaw : 'plain';
      result.push({
        _type: 'quoteBlock',
        _key: randomKey(),
        text: quoteText,
        ...(author ? { quoteAuthor: author } : {}),
        ...(source ? { source } : {}),
        style,
      });
      continue;
    }
    result.push(paragraphToBlock(para));
  }
  return result;
}
