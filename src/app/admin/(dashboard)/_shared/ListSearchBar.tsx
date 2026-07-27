import Link from 'next/link';

export default function ListSearchBar({
  basePath,
  query,
  lang,
  filter,
}: {
  basePath: string;
  query?: string;
  lang?: string;
  /** Preserves the currently-active status filter tab across a search/lang change. */
  filter?: string;
}) {
  function buildUrl(overrides: { lang?: string }) {
    const params = new URLSearchParams();
    if (filter && filter !== 'all') params.set('filter', filter);
    if (query) params.set('q', query);
    const nextLang = overrides.lang !== undefined ? overrides.lang : lang;
    if (nextLang) params.set('lang', nextLang);
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  }

  return (
    <div className="flex items-center gap-2 mb-5">
      <form action={basePath} method="get" className="flex-1 max-w-xs">
        {filter && filter !== 'all' && <input type="hidden" name="filter" value={filter} />}
        {lang && <input type="hidden" name="lang" value={lang} />}
        <input
          type="search"
          name="q"
          defaultValue={query}
          placeholder="Поиск по заголовку…"
          className="w-full bg-[var(--admin-input)] border border-[var(--admin-border)] rounded-lg px-3 py-2 text-[12.5px]"
        />
      </form>
      <div className="flex gap-1 bg-[var(--admin-input)] border border-[var(--admin-border)] rounded-lg p-1">
        {[
          { key: '', label: 'Все' },
          { key: 'ru', label: 'RU' },
          { key: 'en', label: 'EN' },
        ].map(l => (
          <Link
            key={l.key}
            href={buildUrl({ lang: l.key || undefined })}
            className={`text-[11px] font-bold px-2.5 py-1.5 rounded-md transition-colors ${
              (lang ?? '') === l.key ? 'bg-[var(--admin-border)] text-[var(--admin-text)]' : 'text-[var(--admin-text-muted)]'
            }`}
          >
            {l.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
