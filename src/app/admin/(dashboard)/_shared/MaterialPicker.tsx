'use client';

import { useMemo, useState } from 'react';
import type { MaterialOption } from '@/lib/admin/data';

const MAX_RESULTS = 5;
const RECENT_COUNT = 3;

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
// The one addition: while the search box is empty, it shows the author's 3
// most recent materials instead of an empty list, since `candidates` is
// already pre-filtered to just this row's author.
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
  const recent = useMemo(() => candidates.slice(0, RECENT_COUNT), [candidates]);

  const filtered = useMemo(() => {
    if (!query.trim()) return null;
    const q = query.trim().toLowerCase();
    return candidates.filter(c => c.title.toLowerCase().includes(q));
  }, [query, candidates]);

  const results = filtered ? filtered.slice(0, MAX_RESULTS) : recent;

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
            {!filtered && (
              <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wide text-[var(--admin-text-dim)]">
                {isRu ? 'Последние материалы автора' : "Author's recent materials"}
              </div>
            )}
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
            {filtered && filtered.length > MAX_RESULTS && (
              <div className="px-3 py-1.5 text-[10.5px] text-[var(--admin-text-dim)]">
                {isRu
                  ? `Показано ${MAX_RESULTS} из ${filtered.length} — печатайте точнее, чтобы сузить`
                  : `Showing ${MAX_RESULTS} of ${filtered.length} — type more to narrow`}
              </div>
            )}
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
