// Bidirectional conversion between Sanity Portable Text and a plain
// markdown-ish textarea, used by the admin panel's quick body editors
// (News/Articles/Exchange descriptions).
//
// Only `block` (paragraph) entries round-trip through real text editing.
// Non-text blocks (image, quoteBlock, youtubeEmbed, tweetEmbed) can't be
// authored from plain text, so they're kept completely untouched and shown
// as a single marker line (`⟦index: description⟧`) — deleting that line
// drops the block, but editing surrounding text never corrupts it. Complex
// embeds still need to be added/edited in Sanity Studio (/studio).

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
}

function randomKey(): string {
  return Math.random().toString(36).slice(2, 10);
}

function truncate(s: string, n: number): string {
  return s.length > n ? `${s.slice(0, n)}…` : s;
}

function describeNonTextBlock(block: PortableTextBlock): string {
  switch (block._type) {
    case 'image':
      return 'изображение (редактируется в /studio)';
    case 'quoteBlock':
      return `цитата — "${truncate(String(block.text ?? ''), 50)}"`;
    case 'youtubeEmbed':
      return `YouTube — ${block.url ?? ''}`;
    case 'tweetEmbed':
      return `твит — ${block.url ?? ''}`;
    default:
      return String(block._type);
  }
}

function wrapMarks(span: Span, markDefs: MarkDef[]): string {
  let text = span.text ?? '';
  const marks = span.marks ?? [];
  for (const mark of marks) {
    const def = markDefs.find(d => d._key === mark);
    if (def && def._type === 'link' && def.href) {
      text = `[${text}](${def.href})`;
    }
  }
  if (marks.includes('code')) text = `\`${text}\``;
  if (marks.includes('em')) text = `*${text}*`;
  if (marks.includes('strong')) text = `**${text}**`;
  return text;
}

function blockToParagraph(block: PortableTextBlock): string {
  const children = ((block.children as Span[] | undefined) ?? []).filter(c => c && c._type === 'span');
  const markDefs = (block.markDefs as MarkDef[] | undefined) ?? [];
  let text = children.map(span => wrapMarks(span, markDefs)).join('');
  const style = block.style as string | undefined;
  if (style === 'h2') text = `## ${text}`;
  else if (style === 'h3') text = `### ${text}`;
  else if (style === 'blockquote') text = `> ${text}`;
  return text;
}

export function blocksToText(blocks: PortableTextBlock[] | undefined): string {
  if (!blocks || blocks.length === 0) return '';
  return blocks
    .map((block, i) => (block._type === 'block' ? blockToParagraph(block) : `⟦${i}: ${describeNonTextBlock(block)}⟧`))
    .join('\n\n');
}

const INLINE_RE = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`/g;

function parseInline(content: string): { spans: Span[]; markDefs: MarkDef[] } {
  const markDefs: MarkDef[] = [];
  const spans: Span[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  INLINE_RE.lastIndex = 0;
  while ((match = INLINE_RE.exec(content)) !== null) {
    if (match.index > lastIndex) {
      spans.push({ _type: 'span', _key: randomKey(), text: content.slice(lastIndex, match.index), marks: [] });
    }
    if (match[1] !== undefined) {
      const key = randomKey();
      markDefs.push({ _key: key, _type: 'link', href: match[2] });
      spans.push({ _type: 'span', _key: randomKey(), text: match[1], marks: [key] });
    } else if (match[3] !== undefined) {
      spans.push({ _type: 'span', _key: randomKey(), text: match[3], marks: ['strong'] });
    } else if (match[4] !== undefined) {
      spans.push({ _type: 'span', _key: randomKey(), text: match[4], marks: ['em'] });
    } else if (match[5] !== undefined) {
      spans.push({ _type: 'span', _key: randomKey(), text: match[5], marks: ['code'] });
    }
    lastIndex = INLINE_RE.lastIndex;
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
  let content = para;
  if (content.startsWith('### ')) {
    style = 'h3';
    content = content.slice(4);
  } else if (content.startsWith('## ')) {
    style = 'h2';
    content = content.slice(3);
  } else if (content.startsWith('> ')) {
    style = 'blockquote';
    content = content.slice(2);
  }
  const { spans, markDefs } = parseInline(content);
  return { _type: 'block', _key: randomKey(), style, markDefs, children: spans };
}

export function textToBlocks(text: string, originalBlocks: PortableTextBlock[] | undefined): PortableTextBlock[] {
  const paragraphs = text
    .split(/\n\s*\n/)
    .map(p => p.trim())
    .filter(Boolean);
  const result: PortableTextBlock[] = [];
  for (const para of paragraphs) {
    const markerMatch = para.match(/^⟦(\d+):/);
    if (markerMatch) {
      const original = originalBlocks?.[Number(markerMatch[1])];
      if (original && original._type !== 'block') result.push(original);
      continue;
    }
    result.push(paragraphToBlock(para));
  }
  return result;
}
