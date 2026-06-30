'use client';

import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import type { GlossaryTerm } from '@/lib/glossary';

interface Props {
  terms: GlossaryTerm[];
  locale: string;
}

export default function GlossaryFilter({ terms, locale }: Props) {
  const [query, setQuery] = useState('');
  const isRu = locale === 'ru';

  const sorted = useMemo(
    () => [...terms].sort((a, b) => a.term[locale as 'ru' | 'en'].localeCompare(b.term[locale as 'ru' | 'en'], locale)),
    [terms, locale]
  );

  const letters = useMemo(
    () => [...new Set(sorted.map((t) => t.term[locale as 'ru' | 'en'][0].toUpperCase()))],
    [sorted, locale]
  );

  const q = query.trim().toLowerCase();
  const matches = (t: GlossaryTerm) =>
    !q ||
    t.term[locale as 'ru' | 'en'].toLowerCase().includes(q) ||
    t.definition[locale as 'ru' | 'en'].toLowerCase().includes(q);

  return (
    <div>
      <div className="relative mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={isRu ? 'Поиск по глоссарию...' : 'Search the glossary...'}
          className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-card border border-border text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-accent transition-colors"
        />
      </div>

      <nav className="flex flex-wrap gap-1.5 mb-8" aria-label={isRu ? 'Алфавитный указатель' : 'Alphabetical index'}>
        {letters.map((letter) => (
          <a
            key={letter}
            href={`#letter-${letter}`}
            className="w-7 h-7 flex items-center justify-center rounded bg-card border border-border text-xs font-medium text-muted hover:text-accent hover:border-accent/40 transition-colors"
          >
            {letter}
          </a>
        ))}
      </nav>

      <div className="space-y-8">
        {letters.map((letter) => {
          const group = sorted.filter((t) => t.term[locale as 'ru' | 'en'][0].toUpperCase() === letter);
          const visible = group.filter(matches);
          if (visible.length === 0) return null;
          return (
            <section key={letter} id={`letter-${letter}`} className="scroll-mt-24">
              <h2 className="text-xs font-bold uppercase tracking-widest text-accent mb-3">{letter}</h2>
              <div className="space-y-2">
                {visible.map((t) => (
                  <details
                    key={t.slug}
                    id={t.slug}
                    className="group bg-card border border-border rounded-lg px-4 py-3 open:border-accent/40 scroll-mt-24"
                  >
                    <summary className="cursor-pointer list-none flex items-center justify-between gap-3 text-sm font-semibold text-foreground">
                      {t.term[locale as 'ru' | 'en']}
                      <span className="text-muted text-xs group-open:rotate-180 transition-transform">▾</span>
                    </summary>
                    <p className="text-muted text-sm leading-relaxed mt-2">{t.definition[locale as 'ru' | 'en']}</p>
                  </details>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
