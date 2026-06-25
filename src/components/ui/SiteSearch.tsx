'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Search, X } from 'lucide-react';

interface SearchResult {
  _type: 'article' | 'news';
  title: string;
  slug: string;
  publishedAt: string;
}

export default function SiteSearch({ locale }: { locale: string }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const runSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&locale=${locale}`);
      const data = await res.json();
      setResults(data.results || []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-card text-muted text-xs hover:text-foreground hover:border-accent/40 transition-colors"
      >
        <Search size={13} />
        {locale === 'ru' ? 'Поиск по сайту' : 'Site search'}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm flex items-start justify-center pt-24 px-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-card border border-border rounded-xl p-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={runSearch} className="flex items-center gap-2">
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={locale === 'ru' ? 'Название материала...' : 'Article title...'}
                className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-accent/50"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-accent text-background text-sm font-medium hover:bg-accent/90 transition-colors shrink-0"
              >
                {locale === 'ru' ? 'Поиск' : 'Search'}
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-2 text-muted hover:text-foreground shrink-0"
                aria-label={locale === 'ru' ? 'Закрыть' : 'Close'}
              >
                <X size={18} />
              </button>
            </form>

            <div className="mt-4 max-h-96 overflow-y-auto">
              {loading && (
                <p className="text-sm text-muted text-center py-6">
                  {locale === 'ru' ? 'Поиск...' : 'Searching...'}
                </p>
              )}
              {!loading && results !== null && results.length === 0 && (
                <p className="text-sm text-muted text-center py-6">
                  {locale === 'ru' ? 'Ничего не найдено' : 'No results'}
                </p>
              )}
              {!loading && results && results.length > 0 && (
                <div className="flex flex-col gap-1">
                  {results.map((r) => (
                    <Link
                      key={`${r._type}-${r.slug}`}
                      href={`/${locale}/${r._type === 'article' ? 'articles' : 'news'}/${r.slug}`}
                      onClick={() => setOpen(false)}
                      className="px-3 py-2.5 rounded-lg hover:bg-background transition-colors"
                    >
                      <p className="text-sm font-medium text-foreground leading-snug">{r.title}</p>
                      <span className="text-xs text-muted">
                        {r._type === 'article'
                          ? locale === 'ru' ? 'Статья' : 'Article'
                          : locale === 'ru' ? 'Новость' : 'News'}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
