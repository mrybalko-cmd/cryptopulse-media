'use client';

import { useRef, useState } from 'react';
import { textToBlocks, blocksToText, type PortableTextBlock } from '@/lib/admin/portableText';

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
      className="my-3 pl-3.5 border-l-[3px] italic text-[var(--admin-text-secondary)]"
      style={{ borderColor: accent ? 'var(--admin-accent, #06b6d4)' : 'var(--admin-border)' }}
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
        nodes.push(
          <div key={i} className="my-3 h-28 rounded-lg bg-gradient-to-br from-[var(--admin-input)] to-[var(--admin-border)] flex items-center justify-center text-[11px] text-[var(--admin-text-muted)]">
            🖼️ изображение
          </div>
        );
      } else if (block._type === 'youtubeEmbed') {
        nodes.push(
          <div key={i} className="my-3 h-28 rounded-lg bg-[var(--admin-input)] border border-[var(--admin-border)] flex items-center justify-center text-[11px] text-[var(--admin-text-muted)]">
            ▶️ YouTube: {String(block.url ?? '')}
          </div>
        );
      } else if (block._type === 'tweetEmbed') {
        nodes.push(
          <div key={i} className="my-3 p-3 rounded-lg bg-[var(--admin-input)] border border-[var(--admin-border)] text-[11px] text-[var(--admin-text-muted)]">
            🐦 Твит: {String(block.url ?? '')}
          </div>
        );
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
  const nextImageIndex = useRef(0);

  const previewBlocks = textToBlocks(text, originalBlocks);

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
              title="Вставить картинку"
              onClick={() => {
                const idx = addImageSlot();
                if (ref.current) { insertAtCursor(ref.current, `[[img:${idx}]]`); sync(); }
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
              🐦
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
        <input key={idx} type="file" accept="image/*" name={`${name}_image_${idx}`} className="hidden" onChange={sync} />
      ))}

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
