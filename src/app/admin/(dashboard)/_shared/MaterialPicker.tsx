'use client';

import { useMemo, useState } from 'react';
import type { MaterialOption } from '@/lib/admin/data';

function Thumb({ url }: { url: string | null }) {
  return (
    <div className="w-8 h-8 rounded-md overflow-hidden bg-gradient-to-br from-[var(--admin-input)] to-[var(--admin-border)] shrink-0">
      {url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={`${url}?w=64&h=64&fit=crop`} alt="" className="w-full h-full object-cover" />
      )}
    </div>
  );
}

// Same chip + search pattern as TranslationPicker, controlled (value/onChange)
// instead of managing its own selection — the parent needs the picked id to
// re-render its live preview and to reset it when the row's author changes.
// Unlike a capped "top N" list, the results panel shows every one of the
// author's materials (already recency-sorted by the data layer) in a
// scrollable container — search narrows the same list live instead of
// switching between a "recent" view and a hard-capped search view.
export default function MaterialPicker({
  name,
  candidates,
  value,
  onChange,
  locale = 'ru',
}: {
  name: string;
  candidates: MaterialOption[];
  value: string;
  onChange: (id: string) => void;
  locale?: 'ru' | 'en';
}) {
  const isRu = locale === 'ru';
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState('');

  const selected = candidates.find(c => c._id === value);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return candidates;
    return candidates.filter(c => c.title.toLowerCase().includes(q));
  }, [query, candidates]);

  const isFiltering = query.trim().length > 0;

  function choose(id: string) {
    onChange(id);
    setSearching(false);
    setQuery('');
  }

  return (
    <div className="min-w-0">
      <input type="hidden" name={name} value={value} />

      {!searching && (
        <button
          type="button"
          onClick={() => setSearching(true)}
          className="w-full min-w-0 flex items-center gap-2 bg-[var(--admin-input)] border border-cyan-500/40 rounded-lg px-2.5 py-2 text-left"
        >
          {selected ? (
            <>
              <Thumb url={selected.coverImage} />
              <span className="flex-1 min-w-0 text-[12px] font-bold truncate">{selected.title}</span>
              <span className="text-[11px] font-bold text-cyan-400 whitespace-nowrap shrink-0">{isRu ? 'изменить ✕' : 'change ✕'}</span>
            </>
          ) : (
            <>
              <span className="flex-1 text-[12px] text-[var(--admin-text-muted)]">{isRu ? '— нет материала —' : '— no material —'}</span>
              <span className="text-[11px] font-bold text-cyan-400 whitespace-nowrap shrink-0">{isRu ? 'выбрать' : 'choose'}</span>
            </>
          )}
        </button>
      )}

      {searching && (
        <div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              autoFocus
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={isRu ? 'Начните печатать заголовок…' : 'Start typing a title…'}
              className="flex-1 bg-[var(--admin-input)] border border-[var(--admin-border)] rounded-lg px-3 py-2 text-[12px]"
            />
            <button
              type="button"
              onClick={() => { setSearching(false); setQuery(''); }}
              className="text-[11px] font-bold text-[var(--admin-text-muted)] whitespace-nowrap shrink-0"
            >
              {isRu ? 'Отмена' : 'Cancel'}
            </button>
          </div>

          <div className="border border-[var(--admin-border)] rounded-lg mt-2 overflow-hidden">
            <div className="px-2.5 py-1.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-[var(--admin-text-dim)]">
              {isFiltering ? (isRu ? 'Найдено' : 'Found') : (isRu ? 'Материалы автора' : "Author's materials")}
              <span className="px-1.5 py-0.5 rounded-full bg-[var(--admin-input)] normal-case tracking-normal">{results.length}</span>
            </div>

            <div className="max-h-[260px] overflow-y-auto">
              {results.length === 0 ? (
                <div className="px-3 py-2.5 text-[12px] text-[var(--admin-text-muted)]">
                  {isRu ? 'Ничего не найдено' : 'Nothing found'}
                </div>
              ) : (
                results.map(c => (
                  <button
                    key={c._id}
                    type="button"
                    onClick={() => choose(c._id)}
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 border-b border-[var(--admin-border)] last:border-b-0 hover:bg-[var(--admin-input)] transition-colors text-left"
                  >
                    <Thumb url={c.coverImage} />
                    <span className="flex-1 min-w-0 text-[12px] text-[var(--admin-text-secondary)] truncate">{c.title}</span>
                  </button>
                ))
              )}
            </div>

            {value && (
              <button
                type="button"
                onClick={() => choose('')}
                className="w-full px-3 py-2 text-[11.5px] font-bold text-red-400 border-t border-[var(--admin-border)] hover:bg-[var(--admin-input)] transition-colors text-left"
              >
                {isRu ? '✕ Убрать материал' : '✕ Remove'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
