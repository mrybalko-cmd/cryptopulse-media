'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import StatusScale from './StatusScale';
import WorldMap from './WorldMap';
import CountryIndex from './CountryIndex';
import type { RegStatus } from '@/lib/regulationData';
import type { RegCountry } from '@/lib/regulation';

/**
 * Holds the three pieces of state the widget shares: status filter, search
 * query and selected country.
 *
 * There used to be a detail panel here, under the map, showing the selected
 * country — while the index below showed the same paragraphs again. Two copies
 * of one text read as a bug, and the panel also overlapped the tile grid, which
 * is what produced the clipped element in the corner. The country now lives in
 * one place: picking it on the map opens it in the index and scrolls there.
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
  const filtered = filter !== 'all' || q !== '';

  /** Picking on the map has to move the reader to where the text actually is. */
  const selectFromMap = (iso2: string | null) => {
    setSelected(iso2);
    if (!iso2) return;
    const country = countries.find(c => c.iso2 === iso2);
    if (!country) return;
    // wait for the index to re-render with the region and tile open
    requestAnimationFrame(() => {
      document.getElementById(country.slug)?.scrollIntoView({ block: 'center', behavior: 'smooth' });
    });
  };

  return (
    <>
      <StatusScale countries={countries} locale={locale} filter={filter} onFilterChange={setFilter} />

      <WorldMap
        countries={countries}
        locale={locale}
        filter={filter}
        query={q}
        selected={selected}
        onSelect={selectFromMap}
      />

      <div className="glass-panel mb-3 flex gap-2 items-center flex-wrap">
        <label className="flex-1 min-w-[180px] relative flex items-center">
          <Search size={15} className="absolute left-3 text-foreground/50 pointer-events-none" />
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
