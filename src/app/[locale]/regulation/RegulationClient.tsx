'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { CountryList, RegulationStats } from './RegulationMap';
import type { RegStatus } from '@/lib/regulationData';

const RegulationMap = dynamic(() => import('./RegulationMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[420px] rounded-xl border border-border bg-[#0f172a] flex items-center justify-center">
      <span className="text-muted text-sm animate-pulse">Загрузка карты…</span>
    </div>
  ),
});

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
