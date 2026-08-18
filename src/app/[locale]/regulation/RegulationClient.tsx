'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import StatusScale from './StatusScale';
import WorldMap from './WorldMap';
import CountryIndex from './CountryIndex';
import { STATUS_META, type RegStatus } from '@/lib/regulationData';
import type { RegCountry } from '@/lib/regulation';
import { flag } from './CountryDetail';

/**
 * Holds the three pieces of state the whole widget shares: the status filter,
 * the search query and the selected country. Everything below is presentational.
 */
export default function RegulationClient({
  locale,
  countries,
}: {
  locale: string;
  countries: RegCountry[];
}) {
  const isRu = locale === 'ru';
  const [filter, setFilter] = useState<RegStatus | 'all'>('all');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<string | null>(null);

  const q = query.trim().toLowerCase();
  const picked = countries.find(c => c.iso2 === selected) ?? null;
  const filtered = filter !== 'all' || q !== '';

  return (
    <>
      <StatusScale countries={countries} locale={locale} filter={filter} onFilterChange={setFilter} />

      <WorldMap
        countries={countries}
        locale={locale}
        filter={filter}
        query={q}
        selected={selected}
        onSelect={setSelected}
      />

      {picked && (
        <div className="glass-panel mb-3 !px-0 !py-0 overflow-hidden relative">
          <div className="flex items-center gap-3 px-4 pt-3.5 pb-3 pr-14 border-b border-border">
            <span className="text-[25px] leading-none">{flag(picked.iso2)}</span>
            <div className="flex-1 min-w-0">
              <b className="block text-[15.5px] font-bold tracking-[-0.01em]">{isRu ? picked.name.ru : picked.name.en}</b>
              <span className="text-[11px] text-muted font-mono">{picked.iso2}</span>
            </div>
            <span
              className="text-[10px] font-bold rounded-full px-2.5 py-1.5 whitespace-nowrap border"
              style={{
                color: STATUS_META[picked.status].color,
                background: `${STATUS_META[picked.status].color}29`,
                borderColor: `${STATUS_META[picked.status].color}66`,
              }}
            >
              {isRu ? STATUS_META[picked.status].labelRu : STATUS_META[picked.status].labelEn}
            </span>
          </div>
          {/* The same paragraphs already exist in the index below; this copy is
              for readers who arrived via the map and should not have to hunt. */}
          <div className="text-[12.5px]">
            {isRu ? picked.summary.ru : picked.summary.en}
            <div className="px-4 pb-4 pt-2 text-muted leading-relaxed">{isRu ? picked.details.ru : picked.details.en}</div>
          </div>
          <button
            type="button"
            onClick={() => setSelected(null)}
            aria-label={isRu ? 'Закрыть' : 'Close'}
            className="tap-target absolute top-3 right-3 w-8 h-8 grid place-items-center rounded-lg border border-border bg-card text-muted hover:text-foreground"
          >
            ✕
          </button>
        </div>
      )}

      <div className="glass-panel mb-3 flex gap-2 items-center flex-wrap">
        <label className="flex-1 min-w-[180px] relative flex items-center">
          <Search size={15} className="absolute left-3 text-muted pointer-events-none" />
          <input
            type="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={isRu ? 'Найти страну…' : 'Find a country…'}
            aria-label={isRu ? 'Поиск по странам' : 'Search countries'}
            className="w-full h-11 rounded-xl pl-9 pr-3 bg-card border border-border text-[13.5px] text-foreground placeholder:text-muted focus:outline-none focus:border-accent"
          />
        </label>
        {filtered && (
          <button
            type="button"
            onClick={() => { setFilter('all'); setQuery(''); }}
            className="tap-target h-11 px-4 rounded-xl border border-border bg-card text-[12.5px] font-semibold text-muted hover:text-foreground"
          >
            {isRu ? 'Сбросить фильтр' : 'Clear filter'}
          </button>
        )}
      </div>

      <CountryIndex
        countries={countries}
        locale={locale}
        filter={filter}
        query={q}
        selected={selected}
        onSelect={setSelected}
      />
    </>
  );
}
