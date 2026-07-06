'use client';

import { useState } from 'react';
import RegulationMap, { CountryList, RegulationStats } from './RegulationMap';
import type { RegStatus } from '@/lib/regulationData';

export default function RegulationClient({ locale }: { locale: string }) {
  const [filter, setFilter] = useState<RegStatus | 'all'>('all');

  return (
    <>
      <RegulationStats locale={locale} />
      <RegulationMap locale={locale} filter={filter} onFilterChange={setFilter} />
      <CountryList locale={locale} filter={filter} />
    </>
  );
}
