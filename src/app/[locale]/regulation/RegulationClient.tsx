'use client';

import { useState } from 'react';
import RegulationSpread from './RegulationSpread';
import CountryIndex from './CountryIndex';
import type { RegStatus } from '@/lib/regulationData';
import type { RegCountry } from '@/lib/regulation';

/**
 * The two interactive halves of the page: the map spread, and the index of all
 * countries beneath it.
 *
 * The index stays even though the spread can show any country, because every
 * one of the 46 needs its text in the HTML — that is what the search engines
 * read, and the spread renders only the selected one.
 */
export default function RegulationClient({
  locale,
  countries,
}: {
  locale: string;
  countries: RegCountry[];
}) {
  const [filter, setFilter] = useState<RegStatus | 'all'>('all');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <>
      <RegulationSpread locale={locale} countries={countries} />
      <CountryIndex
        countries={countries}
        locale={locale}
        filter={filter}
        query={query}
        selected={selected}
        onSelect={setSelected}
      />
    </>
  );
}
