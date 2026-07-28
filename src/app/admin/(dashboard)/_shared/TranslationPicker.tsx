'use client';

import { useMemo, useState } from 'react';

interface TranslationCandidate {
  _id: string;
  title: string;
  coverImage: string | null;
}

const MAX_RESULTS = 5;

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

export default function TranslationPicker({
  candidates,
  defaultValue,
}: {
  candidates: TranslationCandidate[];
  defaultValue?: string;
}) {
  const [selectedId, setSelectedId] = useState(defaultValue ?? '');
  const [searching, setSearching] = useState(!defaultValue);
  const [query, setQuery] = useState('');

  const selected = candidates.find(c => c._id === selectedId);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.trim().toLowerCase();
    return candidates.filter(c => c.title.toLowerCase().includes(q)).slice(0, MAX_RESULTS);
  }, [query, candidates]);

  const totalMatches = useMemo(() => {
    if (!query.trim()) return 0;
    const q = query.trim().toLowerCase();
    return candidates.filter(c => c.title.toLowerCase().includes(q)).length;
  }, [query, candidates]);

  function choose(id: string) {
    setSelectedId(id);
    setSearching(false);
    setQuery('');
  }

  return (
    <div>
      <input type="hidden" name="translationRefId" value={selectedId} />

      {!searching && (
        <div className="flex items-center gap-2.5 bg-[var(--admin-input)] border border-cyan-500/40 rounded-lg px-2.5 py-2">
          {selected ? (
            <>
              <Thumb url={selected.coverImage} />
              <span className="flex-1 min-w-0 text-[12.5px] font-bold truncate">{selected.title}</span>
            </>
          ) : (
            <span className="flex-1 text-[12.5px] text-[var(--admin-text-muted)]">— нет связанного перевода —</span>
          )}
          <button
            type="button"
            onClick={() => setSearching(true)}
            className="text-[11px] font-bold text-cyan-400 whitespace-nowrap shrink-0"
          >
            {selected ? 'изменить ✕' : 'привязать'}
          </button>
        </div>
      )}

      {searching && (
        <div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              autoFocus
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Начните печатать заголовок…"
              className="flex-1 bg-[var(--admin-input)] border border-[var(--admin-border)] rounded-lg px-3 py-2 text-[12.5px]"
            />
            {selected && (
              <button
                type="button"
                onClick={() => { setSearching(false); setQuery(''); }}
                className="text-[11px] font-bold text-[var(--admin-text-muted)] whitespace-nowrap shrink-0"
              >
                Отмена
              </button>
            )}
          </div>

          {query.trim() && (
            <div className="border border-[var(--admin-border)] rounded-lg mt-2 overflow-hidden">
              {results.length === 0 ? (
                <div className="px-3 py-2.5 text-[12px] text-[var(--admin-text-muted)]">Ничего не найдено</div>
              ) : (
                <>
                  {results.map(c => (
                    <button
                      key={c._id}
                      type="button"
                      onClick={() => choose(c._id)}
                      className="w-full flex items-center gap-2.5 px-2.5 py-2 border-b border-[var(--admin-border)] last:border-b-0 hover:bg-[var(--admin-input)] transition-colors text-left"
                    >
                      <Thumb url={c.coverImage} />
                      <span className="flex-1 min-w-0 text-[12px] text-[var(--admin-text-secondary)] truncate">{c.title}</span>
                    </button>
                  ))}
                  <div className="px-3 py-1.5 text-[10.5px] text-[var(--admin-text-dim)]">
                    {totalMatches > MAX_RESULTS
                      ? `Показано ${MAX_RESULTS} из ${totalMatches} — печатайте точнее, чтобы сузить`
                      : `${totalMatches} совпадени${totalMatches === 1 ? 'е' : totalMatches < 5 ? 'я' : 'й'}`}
                  </div>
                </>
              )}
              {selectedId && (
                <button
                  type="button"
                  onClick={() => choose('')}
                  className="w-full px-3 py-2 text-[11.5px] font-bold text-red-400 border-t border-[var(--admin-border)] hover:bg-[var(--admin-input)] transition-colors text-left"
                >
                  ✕ Убрать связку
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
