'use client';

import { useRef } from 'react';

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

function ToolbarButton({ onClick, title, italic, children }: { onClick: () => void; title: string; italic?: boolean; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`px-2.5 py-1.5 rounded-md border border-[var(--admin-border)] bg-[var(--admin-input)] text-[12px] font-bold text-[var(--admin-text-secondary)] hover:border-cyan-500/50 hover:text-cyan-400 transition-colors ${italic ? 'italic' : ''}`}
    >
      {children}
    </button>
  );
}

export default function RichTextEditor({
  name,
  defaultValue,
  rows = 16,
  simple = false,
}: {
  name: string;
  defaultValue?: string;
  rows?: number;
  /** Hides heading/quote buttons for schemas that don't support them (e.g. exchange descriptions). */
  simple?: boolean;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  return (
    <div>
      <div className="flex gap-1 mb-2 flex-wrap">
        <ToolbarButton title="Жирный" onClick={() => ref.current && wrapSelection(ref.current, '**')}>Ж</ToolbarButton>
        <ToolbarButton title="Курсив" italic onClick={() => ref.current && wrapSelection(ref.current, '*')}>К</ToolbarButton>
        <ToolbarButton title="Код" onClick={() => ref.current && wrapSelection(ref.current, '`')}>{'</>'}</ToolbarButton>
        <ToolbarButton title="Ссылка" onClick={() => ref.current && wrapSelection(ref.current, '[', '](https://)')}>🔗 Ссылка</ToolbarButton>
        {!simple && (
          <>
            <ToolbarButton title="Подзаголовок" onClick={() => ref.current && insertLinePrefix(ref.current, '## ')}>H2</ToolbarButton>
            <ToolbarButton title="Подзаголовок поменьше" onClick={() => ref.current && insertLinePrefix(ref.current, '### ')}>H3</ToolbarButton>
            <ToolbarButton title="Цитата-абзац" onClick={() => ref.current && insertLinePrefix(ref.current, '> ')}>❝ Цитата</ToolbarButton>
          </>
        )}
      </div>
      <textarea
        ref={ref}
        name={name}
        defaultValue={defaultValue}
        rows={rows}
        className="w-full bg-[var(--admin-input)] border border-[var(--admin-border)] rounded-lg px-3.5 py-3 text-[15px] leading-[1.85] font-sans"
      />
    </div>
  );
}
