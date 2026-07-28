'use client';

import { useState } from 'react';

export default function TagChipsInput({
  name,
  defaultValue,
  placeholder = 'Добавить и нажать Enter',
  minRecommended,
}: {
  name: string;
  defaultValue?: string[];
  placeholder?: string;
  /** Shows a live counter/warning below the input (e.g. the editorial "at least 10 SEO keywords" rule). */
  minRecommended?: number;
}) {
  const [tags, setTags] = useState<string[]>(defaultValue ?? []);
  const [draft, setDraft] = useState('');

  function addTag() {
    const t = draft.trim();
    if (t && !tags.includes(t)) setTags(prev => [...prev, t]);
    setDraft('');
  }

  return (
    <div>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {tags.map(t => (
            <span
              key={t}
              className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-md bg-[var(--admin-input)] border border-[var(--admin-border)] text-[var(--admin-text-secondary)]"
            >
              <input type="hidden" name={name} value={t} />
              {t}
              <button type="button" onClick={() => setTags(prev => prev.filter(x => x !== t))} className="text-[var(--admin-text-muted)] hover:text-red-400">
                ×
              </button>
            </span>
          ))}
        </div>
      )}
      <input
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTag();
          }
        }}
        onBlur={addTag}
        placeholder={placeholder}
        className="w-full bg-[var(--admin-input)] border border-[var(--admin-border)] rounded-lg px-3 py-2 text-[12.5px]"
      />
      {minRecommended !== undefined && (
        <div className={`text-[11px] font-semibold mt-1.5 ${tags.length >= minRecommended ? 'text-green-400' : 'text-amber-400'}`}>
          {tags.length >= minRecommended
            ? `✓ ${tags.length} / ${minRecommended} ключевых слов`
            : `${tags.length} / ${minRecommended} ключевых слов — добавьте ещё ${minRecommended - tags.length}`}
        </div>
      )}
    </div>
  );
}
