'use client';

import { useEffect, useRef, useState } from 'react';
import { urlFor } from '@/lib/sanityImage';
import { textToBlocks, blocksToText, type PortableTextBlock } from '@/lib/admin/portableText';

// Recommended dimensions/format shown on the inline-image picker — kept in one
// place so the toolbar prompt and the "Картинки в тексте" panel say the same.
const INLINE_IMAGE_HINT = 'Рекомендуется: ширина ≥ 1200 px, JPG или WebP, до ~1 МБ.';

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /youtube\.com\/watch\?v=([\w-]{11})/,
    /youtu\.be\/([\w-]{11})/,
    /youtube\.com\/embed\/([\w-]{11})/,
    /youtube\.com\/shorts\/([\w-]{11})/,
  ];
  for (const re of patterns) {
    const m = url.match(re);
    if (m) return m[1];
  }
  return null;
}

// The textarea stays an uncontrolled DOM node (only `defaultValue` + a plain
// `onInput` listener for the preview) specifically so these helpers can just
// mutate `el.value`/selection directly — no fighting with React's controlled-
// input value tracking, which doesn't reliably pick up a bare `.value =`
// assignment. Each toolbar button re-syncs the preview itself afterwards by
// calling the passed `onChange(el.value)`.
function wrapSelection(el: HTMLTextAreaElement, before: string, after: string = before) {
  const start = el.selectionStart;
  const end = el.selectionEnd;
  const value = el.value;
  const selected = value.slice(start, end);
  el.value = value.slice(0, start) + before + selected + after + value.slice(end);
  el.focus();
  el.selectionStart = start + before.length;
  el.selectionEnd = start + before.length + selected.length;
}

function insertLinePrefix(el: HTMLTextAreaElement, prefix: string) {
  const start = el.selectionStart;
  const value = el.value;
  const lineStart = value.lastIndexOf('\n', start - 1) + 1;
  el.value = value.slice(0, lineStart) + prefix + value.slice(lineStart);
  el.focus();
  el.selectionStart = el.selectionEnd = start + prefix.length;
}

function insertAtCursor(el: HTMLTextAreaElement, text: string) {
  const start = el.selectionStart;
  const end = el.selectionEnd;
  const value = el.value;
  const needsNewlineBefore = start > 0 && value[start - 1] !== '\n';
  const insert = `${needsNewlineBefore ? '\n\n' : ''}${text}\n\n`;
  el.value = value.slice(0, start) + insert + value.slice(end);
  el.focus();
  const pos = start + insert.length;
  el.selectionStart = el.selectionEnd = pos;
}

function ToolbarButton({ onClick, title, className = '', children }: { onClick: () => void; title: string; className?: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`px-2.5 py-1.5 rounded-md border border-[var(--admin-border)] bg-[var(--admin-input)] text-[12px] font-bold text-[var(--admin-text-secondary)] hover:border-cyan-500/50 hover:text-cyan-400 transition-colors ${className}`}
    >
      {children}
    </button>
  );
}

function Sep() {
  return <div className="w-px h-5 bg-[var(--admin-border)] mx-1" />;
}

function PreviewSpan({ span, markDefs }: { span: { text: string; marks: string[] }; markDefs: { _key: string; _type: string; href?: string; rel?: string }[] }) {
  let node: React.ReactNode = span.text;
  const marks = span.marks ?? [];
  if (marks.includes('code')) node = <code className="bg-[var(--admin-border)] px-1 rounded text-[0.9em]">{node}</code>;
  if (marks.includes('strike-through')) node = <s>{node}</s>;
  if (marks.includes('underline')) node = <u>{node}</u>;
  if (marks.includes('em')) node = <em>{node}</em>;
  if (marks.includes('strong')) node = <strong>{node}</strong>;
  if (marks.includes('large')) node = <span style={{ fontSize: '1.3em' }}>{node}</span>;
  if (marks.includes('small')) node = <span style={{ fontSize: '0.8em' }}>{node}</span>;
  for (const mark of marks) {
    const def = markDefs.find(d => d._key === mark);
    if (def?._type === 'link' && def.href) {
      node = (
        <a href={def.href} className="text-cyan-400 underline" title={def.rel === 'nofollow' ? 'nofollow' : 'dofollow'}>
          {node}
          {def.rel === 'nofollow' && <sup className="text-[9px] text-[var(--admin-text-dim)] no-underline">nf</sup>}
        </a>
      );
    }
  }
  return <>{node}</>;
}

function QuotePreview({ block }: { block: PortableTextBlock }) {
  const text = String(block.text ?? '');
  const author = block.quoteAuthor ? String(block.quoteAuthor) : null;
  const source = block.source ? String(block.source) : null;
  const style = String(block.style ?? 'plain');
  const accent = style === 'accent';
  return (
    <div
      className={`my-3 pl-3.5 py-2 border-l-[3px] italic text-[var(--admin-text-secondary)] ${accent ? 'rounded-r-lg' : ''}`}
      style={{
        borderColor: accent ? 'var(--admin-focus, #06b6d4)' : 'var(--admin-border)',
        background: accent ? 'color-mix(in srgb, var(--admin-focus, #06b6d4) 10%, transparent)' : 'transparent',
      }}
    >
      “{text}”
      {(author || source) && (
        <div className="not-italic text-[11px] text-[var(--admin-text-muted)] mt-1">
          — {[author, source].filter(Boolean).join(', ')}
        </div>
      )}
    </div>
  );
}

// Preview card for an embedded image (both freshly-picked and pre-existing) —
// shows the real picture, mirroring how quotes/embeds already render, so the
// editor's preview matches what the article page will show.
function ImagePreview({ block }: { block: PortableTextBlock }) {
  const alt = block.alt ? String(block.alt) : '';
  const previewUrl = block._previewUrl; // string = picked, null = awaiting file, undefined = existing
  let src: string | null = null;
  if (typeof previewUrl === 'string') src = previewUrl;
  else if ((block.asset as { _ref?: string } | undefined)?._ref) {
    try { src = urlFor(block as { asset?: { _ref?: string } }).width(680).url(); } catch { src = null; }
  }
  return (
    <figure className="my-3">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        // Match the live site (RichText.tsx): full column width, natural height,
        // no letterbox background — so the preview shows exactly what ships.
        <img src={src} alt={alt} className="w-full h-auto rounded-lg" />
      ) : (
        <div className="h-28 rounded-lg border border-dashed border-[var(--admin-border)] bg-[var(--admin-input)] flex items-center justify-center text-[11px] text-[var(--admin-text-dim)] px-3 text-center">
          Файл ещё не выбран — картинка появится здесь после выбора
        </div>
      )}
      {alt ? (
        <figcaption className="text-[11px] text-[var(--admin-text-muted)] text-center mt-1 italic">{alt}</figcaption>
      ) : (
        <figcaption className="text-[11px] text-amber-500 text-center mt-1">⚠ alt-текст не задан (важно для SEO и доступности)</figcaption>
      )}
    </figure>
  );
}

function EmbedPreview({ block }: { block: PortableTextBlock }) {
  const url = String(block.url ?? '');
  if (block._type === 'youtubeEmbed') {
    const id = extractYouTubeId(url);
    return (
      <div className="my-3 rounded-lg overflow-hidden border border-[var(--admin-border)]">
        <div className="relative aspect-video bg-black">
          {id && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" className="absolute inset-0 w-full h-full object-cover" />
          )}
          <span className="absolute inset-0 flex items-center justify-center bg-black/30">
            <span className="flex items-center justify-center w-12 h-12 rounded-full bg-red-600 shadow-lg">
              <span className="text-white text-[18px] ml-0.5">▶</span>
            </span>
          </span>
        </div>
        <div className="px-3 py-1.5 text-[10.5px] text-[var(--admin-text-muted)] truncate">Видео YouTube · {url}</div>
      </div>
    );
  }
  const isFacebook = block._type === 'facebookEmbed';
  return (
    <div className="my-3 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-input)] p-3">
      <div className="flex items-center gap-2 mb-1.5">
        <span
          className="flex items-center justify-center w-7 h-7 rounded-full text-white text-[13px] font-bold shrink-0"
          style={{ background: isFacebook ? '#1877F2' : '#0f172a' }}
        >
          {isFacebook ? 'f' : 'X'}
        </span>
        <span className="text-[11px] text-[var(--admin-text-muted)] font-semibold">
          {isFacebook ? 'Пост Facebook' : 'Пост X / Twitter'}
        </span>
      </div>
      <div className="text-[11px] text-[var(--admin-text-dim)] truncate">{url}</div>
    </div>
  );
}

function PreviewBlocks({ blocks }: { blocks: PortableTextBlock[] }) {
  const nodes: React.ReactNode[] = [];
  let listBuffer: { items: PortableTextBlock[]; type: string } | null = null;

  const flushList = (key: string) => {
    if (!listBuffer) return;
    const Tag = listBuffer.type === 'number' ? 'ol' : 'ul';
    nodes.push(
      <Tag key={key} className={Tag === 'ol' ? 'list-decimal pl-5 my-2' : 'list-disc pl-5 my-2'}>
        {listBuffer.items.map((item, i) => {
          const level = Math.max(1, Number(item.level) || 1);
          return (
            <li key={i} style={{ marginLeft: (level - 1) * 18 }}>
              {((item.children as { text: string; marks: string[] }[]) ?? []).map((span, si) => (
                <PreviewSpan key={si} span={span} markDefs={(item.markDefs as { _key: string; _type: string; href?: string }[]) ?? []} />
              ))}
            </li>
          );
        })}
      </Tag>
    );
    listBuffer = null;
  };

  blocks.forEach((block, i) => {
    if (block._type !== 'block') {
      flushList(`list-${i}`);
      if (block._type === 'image') {
        nodes.push(<ImagePreview key={i} block={block} />);
      } else if (block._type === 'youtubeEmbed' || block._type === 'tweetEmbed' || block._type === 'facebookEmbed') {
        nodes.push(<EmbedPreview key={i} block={block} />);
      } else if (block._type === 'quoteBlock') {
        nodes.push(<QuotePreview key={i} block={block} />);
      } else {
        nodes.push(
          <div key={i} className="my-2 text-[11px] text-[var(--admin-text-muted)] italic">⟦{describeUnknown(block)}⟧</div>
        );
      }
      return;
    }
    const listItem = block.listItem as string | undefined;
    if (listItem === 'bullet' || listItem === 'number') {
      if (!listBuffer || listBuffer.type !== listItem) {
        flushList(`list-${i}`);
        listBuffer = { items: [], type: listItem };
      }
      listBuffer.items.push(block);
      return;
    }
    flushList(`list-${i}`);
    const children = (block.children as { text: string; marks: string[] }[]) ?? [];
    const markDefs = (block.markDefs as { _key: string; _type: string; href?: string }[]) ?? [];
    const content = children.map((span, si) => <PreviewSpan key={si} span={span} markDefs={markDefs} />);
    const style = block.style as string | undefined;
    if (style === 'h1') nodes.push(<h1 key={i} className="text-[20px] font-bold mt-4 mb-2">{content}</h1>);
    else if (style === 'h2') nodes.push(<h2 key={i} className="text-[17px] font-bold mt-4 mb-2">{content}</h2>);
    else if (style === 'h3') nodes.push(<h3 key={i} className="text-[15px] font-bold mt-3 mb-1.5">{content}</h3>);
    else if (style === 'h4') nodes.push(<h4 key={i} className="text-[13.5px] font-bold mt-2.5 mb-1">{content}</h4>);
    else if (style === 'blockquote') {
      nodes.push(
        <blockquote key={i} className="border-l-[3px] pl-3.5 my-2.5 italic text-[var(--admin-text-muted)]" style={{ borderColor: 'var(--admin-focus)' }}>
          {content}
        </blockquote>
      );
    } else {
      nodes.push(<p key={i} className="my-2">{content}</p>);
    }
  });
  flushList('list-final');

  return <>{nodes}</>;
}

function describeUnknown(block: PortableTextBlock): string {
  return String(block._type);
}

interface ImageMarker {
  pos: number;
  kind: 'new' | 'existing';
  slot: number;
  alt: string;
  raw: string;
}

// Every image marker in the body, in document order, so the manager panel can
// list them with thumbnails and act on the exact marker in the textarea.
function collectImageMarkers(text: string): ImageMarker[] {
  const items: ImageMarker[] = [];
  let m: RegExpExecArray | null;
  const reNew = /\[\[img:(\d+)(?:\|([\s\S]*?))?\]\]/g;
  while ((m = reNew.exec(text)) !== null) {
    items.push({ pos: m.index, kind: 'new', slot: Number(m[1]), alt: m[2] ?? '', raw: m[0] });
  }
  const reOld = /⟦(\d+):image:([\s\S]*?)⟧/g;
  while ((m = reOld.exec(text)) !== null) {
    items.push({ pos: m.index, kind: 'existing', slot: Number(m[1]), alt: m[2] ?? '', raw: m[0] });
  }
  return items.sort((a, b) => a.pos - b.pos);
}

export default function RichTextEditor({
  name,
  originalBlocks,
  rows = 16,
  simple = false,
  hidePreview = false,
}: {
  name: string;
  /** Original Portable Text blocks — supplies both the initial text (via
   * blocksToText) and resolves preserved ⟦N:…⟧ markers in the live preview. */
  originalBlocks?: PortableTextBlock[];
  rows?: number;
  /** Hides list/embed/image buttons for schemas that don't support them (e.g. exchange descriptions). */
  simple?: boolean;
  /** Hides the rendered-preview panel below the textarea. */
  hidePreview?: boolean;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [text, setText] = useState(() => blocksToText(originalBlocks));
  const [imageSlots, setImageSlots] = useState<number[]>([]);
  // slot index -> object URL of the picked file, so both the live preview and
  // the manager panel can show the real picture before it's uploaded on save.
  const [imageFiles, setImageFiles] = useState<Record<number, string>>({});
  const nextImageIndex = useRef(0);
  const objectUrls = useRef<string[]>([]);

  // Free every object URL we ever created when the editor unmounts.
  useEffect(() => () => { objectUrls.current.forEach(URL.revokeObjectURL); }, []);

  const previewBlocks = textToBlocks(text, originalBlocks, undefined, imageFiles);
  const markers = collectImageMarkers(text);

  function addImageSlot() {
    const idx = nextImageIndex.current++;
    setImageSlots(prev => [...prev, idx]);
    // Let React render the new file input, then open its picker.
    requestAnimationFrame(() => {
      const input = document.querySelector<HTMLInputElement>(`input[name="${name}_image_${idx}"]`);
      input?.click();
    });
    return idx;
  }

  function sync() {
    if (ref.current) setText(ref.current.value);
  }

  // Panel/textarea live in sync: the textarea is uncontrolled, so writes go to
  // the DOM node first, then state re-renders the preview + panel from it.
  function applyText(next: string) {
    if (ref.current) ref.current.value = next;
    setText(next);
  }

  function onPickFile(idx: number, file: File | null) {
    setImageFiles(prev => {
      const next = { ...prev };
      if (file) {
        const url = URL.createObjectURL(file);
        objectUrls.current.push(url);
        next[idx] = url;
      } else {
        delete next[idx];
      }
      return next;
    });
  }

  function removeMarker(raw: string) {
    const paras = text.split(/\n\s*\n/);
    const idx = paras.findIndex(p => p.trim() === raw);
    if (idx >= 0) {
      paras.splice(idx, 1);
      applyText(paras.join('\n\n'));
    } else {
      applyText(text.replace(raw, ''));
    }
  }

  function moveMarker(raw: string, dir: -1 | 1) {
    const paras = text.split(/\n\s*\n/);
    const idx = paras.findIndex(p => p.trim() === raw);
    const j = idx + dir;
    if (idx >= 0 && j >= 0 && j < paras.length) {
      [paras[idx], paras[j]] = [paras[j], paras[idx]];
      applyText(paras.join('\n\n'));
    }
  }

  function setMarkerAlt(marker: ImageMarker, newAlt: string) {
    const replacement =
      marker.kind === 'new'
        ? `[[img:${marker.slot}${newAlt ? `|${newAlt}` : ''}]]`
        : `⟦${marker.slot}:image:${newAlt}⟧`;
    if (replacement !== marker.raw) applyText(text.replace(marker.raw, replacement));
  }

  function thumbFor(marker: ImageMarker): string | null {
    if (marker.kind === 'new') return imageFiles[marker.slot] ?? null;
    const original = originalBlocks?.[marker.slot] as { asset?: { _ref?: string } } | undefined;
    if (original?.asset?._ref) {
      try { return urlFor(original).width(160).height(160).url(); } catch { return null; }
    }
    return null;
  }

  return (
    <div>
      <div className="flex gap-1 mb-2 flex-wrap">
        <ToolbarButton title="Жирный" onClick={() => { if (ref.current) { wrapSelection(ref.current, '**'); sync(); } }}>Ж</ToolbarButton>
        <ToolbarButton title="Курсив" className="italic" onClick={() => { if (ref.current) { wrapSelection(ref.current, '*'); sync(); } }}>К</ToolbarButton>
        <ToolbarButton title="Подчёркнутый" className="underline" onClick={() => { if (ref.current) { wrapSelection(ref.current, '__'); sync(); } }}>U</ToolbarButton>
        <ToolbarButton title="Зачёркнутый" className="line-through" onClick={() => { if (ref.current) { wrapSelection(ref.current, '~~'); sync(); } }}>S</ToolbarButton>
        <ToolbarButton title="Код" onClick={() => { if (ref.current) { wrapSelection(ref.current, '`'); sync(); } }}>{'</>'}</ToolbarButton>
        <Sep />
        <ToolbarButton title="Крупнее" onClick={() => { if (ref.current) { wrapSelection(ref.current, '{+', '+}'); sync(); } }}>A+</ToolbarButton>
        <ToolbarButton title="Мельче" onClick={() => { if (ref.current) { wrapSelection(ref.current, '{-', '-}'); sync(); } }}>A-</ToolbarButton>
        <Sep />
        <ToolbarButton
          title="Ссылка (со спросом про nofollow)"
          onClick={() => {
            if (!ref.current) return;
            const url = window.prompt('Ссылка (URL):');
            if (!url) return;
            const nofollow = window.confirm('Пометить ссылку как nofollow?\nOK — nofollow, Отмена — обычная (dofollow)');
            const suffix = nofollow ? ` "nofollow"` : '';
            wrapSelection(ref.current, '[', `](${url.trim()}${suffix})`);
            sync();
          }}
        >
          🔗
        </ToolbarButton>
        {!simple && (
          <>
            <ToolbarButton title="Заголовок H1" onClick={() => { if (ref.current) { insertLinePrefix(ref.current, '# '); sync(); } }}>H1</ToolbarButton>
            <ToolbarButton title="Подзаголовок H2" onClick={() => { if (ref.current) { insertLinePrefix(ref.current, '## '); sync(); } }}>H2</ToolbarButton>
            <ToolbarButton title="Подзаголовок H3" onClick={() => { if (ref.current) { insertLinePrefix(ref.current, '### '); sync(); } }}>H3</ToolbarButton>
            <ToolbarButton title="Подзаголовок H4" onClick={() => { if (ref.current) { insertLinePrefix(ref.current, '#### '); sync(); } }}>H4</ToolbarButton>
            <ToolbarButton title="Цитата-абзац (простая)" onClick={() => { if (ref.current) { insertLinePrefix(ref.current, '> '); sync(); } }}>❝</ToolbarButton>
            <ToolbarButton title="Маркированный список (Tab-отступ — вложенность)" onClick={() => { if (ref.current) { insertLinePrefix(ref.current, '- '); sync(); } }}>≡</ToolbarButton>
            <ToolbarButton title="Нумерованный список" onClick={() => { if (ref.current) { insertLinePrefix(ref.current, '1. '); sync(); } }}>1.</ToolbarButton>
            <Sep />
            <ToolbarButton
              title={`Вставить картинку. ${INLINE_IMAGE_HINT}`}
              onClick={() => {
                const alt = window.prompt(`Alt-текст картинки (для доступности и SEO, можно оставить пустым).\n\n${INLINE_IMAGE_HINT}`) || '';
                const idx = addImageSlot();
                if (ref.current) { insertAtCursor(ref.current, `[[img:${idx}${alt ? `|${alt}` : ''}]]`); sync(); }
              }}
            >
              🖼️
            </ToolbarButton>
            <ToolbarButton
              title="Вставить видео YouTube"
              onClick={() => {
                const url = window.prompt('Ссылка на видео YouTube:');
                if (url && ref.current) { insertAtCursor(ref.current, `[[youtube:${url.trim()}]]`); sync(); }
              }}
            >
              ▶️
            </ToolbarButton>
            <ToolbarButton
              title="Вставить твит (X/Twitter)"
              onClick={() => {
                const url = window.prompt('Ссылка на твит:');
                if (url && ref.current) { insertAtCursor(ref.current, `[[tweet:${url.trim()}]]`); sync(); }
              }}
            >
              𝕏
            </ToolbarButton>
            <ToolbarButton
              title="Вставить пост Facebook"
              onClick={() => {
                const url = window.prompt('Ссылка на пост Facebook:');
                if (url && ref.current) { insertAtCursor(ref.current, `[[facebook:${url.trim()}]]`); sync(); }
              }}
            >
              f
            </ToolbarButton>
            <ToolbarButton
              title="Вставить карточку-цитату (текст + автор + источник)"
              onClick={() => {
                const quoteText = window.prompt('Текст цитаты:');
                if (!quoteText) return;
                const author = window.prompt('Автор (необязательно):') || '';
                const source = window.prompt('Источник (необязательно, например: интервью Bloomberg, 2026):') || '';
                const accent = window.confirm('Акцентный стиль оформления?\nOK — акцентная, Отмена — обычная');
                const style = accent ? 'accent' : (author ? 'attributed' : 'plain');
                if (ref.current) {
                  insertAtCursor(ref.current, `[[quote:${author}|${source}|${style}|${quoteText}]]`);
                  sync();
                }
              }}
            >
              “”
            </ToolbarButton>
          </>
        )}
      </div>

      <textarea
        ref={ref}
        name={name}
        defaultValue={text}
        onInput={e => setText(e.currentTarget.value)}
        onKeyDown={e => {
          // Tab indents (Shift+Tab outdents) the current line by one "  " step —
          // this is how list nesting level is expressed in the markdown syntax.
          if (e.key !== 'Tab') return;
          e.preventDefault();
          const el = e.currentTarget;
          const start = el.selectionStart;
          const value = el.value;
          const lineStart = value.lastIndexOf('\n', start - 1) + 1;
          if (e.shiftKey) {
            if (value.slice(lineStart, lineStart + 2) === '  ') {
              el.value = value.slice(0, lineStart) + value.slice(lineStart + 2);
              el.selectionStart = el.selectionEnd = Math.max(lineStart, start - 2);
            }
          } else {
            el.value = value.slice(0, lineStart) + '  ' + value.slice(lineStart);
            el.selectionStart = el.selectionEnd = start + 2;
          }
          setText(el.value);
        }}
        rows={rows}
        className="w-full bg-[var(--admin-input)] border border-[var(--admin-border)] rounded-lg px-3.5 py-3 text-[15px] leading-[1.85] font-sans"
      />

      {imageSlots.map(idx => (
        <input
          key={idx}
          type="file"
          accept="image/*"
          name={`${name}_image_${idx}`}
          className="hidden"
          onChange={e => { onPickFile(idx, e.target.files?.[0] ?? null); sync(); }}
        />
      ))}

      {!simple && markers.length > 0 && (
        <div className="mt-3">
          <div className="text-[10px] uppercase tracking-wide text-[var(--admin-text-muted)] font-bold mb-1.5">
            Картинки в тексте ({markers.length})
          </div>
          <div className="text-[11px] text-[var(--admin-text-dim)] mb-2">{INLINE_IMAGE_HINT}</div>
          <div className="flex flex-col gap-2">
            {markers.map((marker, mi) => {
              const thumb = thumbFor(marker);
              return (
                <div
                  key={`${marker.kind}-${marker.slot}`}
                  className="flex items-center gap-3 border border-[var(--admin-border)] rounded-lg p-2 bg-[var(--admin-input)]"
                >
                  <div className="w-14 h-14 rounded-md overflow-hidden bg-[var(--admin-border)] shrink-0 flex items-center justify-center text-[10px] text-[var(--admin-text-dim)]">
                    {thumb ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={thumb} alt="" className="w-full h-full object-cover" />
                    ) : (
                      'нет файла'
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--admin-border)] text-[var(--admin-text-muted)]">
                        {marker.kind === 'new' ? 'новая' : 'из статьи'}
                      </span>
                      {!marker.alt && <span className="text-[10px] text-amber-500">⚠ нет alt</span>}
                    </div>
                    <input
                      key={`${marker.kind}-${marker.slot}-alt-${marker.alt}`}
                      defaultValue={marker.alt}
                      placeholder="alt-текст (описание картинки)"
                      onBlur={e => setMarkerAlt(marker, e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); (e.target as HTMLInputElement).blur(); } }}
                      className="w-full bg-[var(--admin-bg,transparent)] border border-[var(--admin-border)] rounded px-2 py-1 text-[12px]"
                    />
                  </div>
                  <div className="flex flex-col gap-1 shrink-0">
                    <button type="button" title="Выше" disabled={mi === 0} onClick={() => moveMarker(marker.raw, -1)} className="px-2 py-0.5 rounded border border-[var(--admin-border)] text-[11px] disabled:opacity-30 hover:border-cyan-500/50">↑</button>
                    <button type="button" title="Ниже" disabled={mi === markers.length - 1} onClick={() => moveMarker(marker.raw, 1)} className="px-2 py-0.5 rounded border border-[var(--admin-border)] text-[11px] disabled:opacity-30 hover:border-cyan-500/50">↓</button>
                  </div>
                  <button type="button" title="Удалить картинку" onClick={() => removeMarker(marker.raw)} className="px-2 py-1 rounded border border-[var(--admin-border)] text-[11px] text-red-400 hover:border-red-500/50 shrink-0">✕</button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {!hidePreview && (
        <div className="mt-3">
          <div className="text-[10px] uppercase tracking-wide text-[var(--admin-text-muted)] font-bold mb-1.5">Предпросмотр</div>
          <div className="border border-[var(--admin-border)] rounded-lg px-4 py-3 text-[14px] leading-[1.75] text-[var(--admin-text-secondary)] min-h-[80px]">
            {text.trim() ? <PreviewBlocks blocks={previewBlocks} /> : <span className="text-[var(--admin-text-dim)] text-[12.5px]">Начните печатать — здесь появится предпросмотр</span>}
          </div>
        </div>
      )}
    </div>
  );
}
