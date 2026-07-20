'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import type { EurRate } from '@/lib/eurRates';

type SortKey = 'rate' | 'feePct' | 'type';

export default function EurRatesTable({ rates, locale }: { rates: EurRate[]; locale: string }) {
  const isRu = locale === 'ru';
  const [sortKey, setSortKey] = useState<SortKey>('rate');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const bestRate = useMemo(() => (rates.length ? Math.max(...rates.map((r) => r.rate)) : 0), [rates]);

  const sorted = useMemo(() => {
    const copy = [...rates];
    copy.sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1;
      if (sortKey === 'type') return a.type.localeCompare(b.type) * dir;
      return (a[sortKey] - b[sortKey]) * dir;
    });
    return copy;
  }, [rates, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  }

  function SortIcon({ active }: { active: boolean }) {
    if (!active) return <ArrowUpDown size={11} className="text-muted/50" />;
    return sortDir === 'desc' ? <ArrowDown size={11} className="text-accent" /> : <ArrowUp size={11} className="text-accent" />;
  }

  const typeLabel = (t: EurRate['type']) => (t === 'p2p' ? 'P2P' : isRu ? 'Биржа' : 'Exchange');

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <div className="grid grid-cols-[1.6fr_1fr_1fr_1fr] bg-card text-[10.5px] font-bold uppercase tracking-wider text-muted">
        <span className="px-3.5 py-2.5">{isRu ? 'Источник' : 'Source'}</span>
        <button onClick={() => toggleSort('rate')} className="flex items-center gap-1 px-3.5 py-2.5 hover:text-foreground transition-colors">
          {isRu ? 'Курс' : 'Rate'} <SortIcon active={sortKey === 'rate'} />
        </button>
        <button onClick={() => toggleSort('feePct')} className="hidden sm:flex items-center gap-1 px-3.5 py-2.5 hover:text-foreground transition-colors">
          {isRu ? 'Комиссия' : 'Fee'} <SortIcon active={sortKey === 'feePct'} />
        </button>
        <button onClick={() => toggleSort('type')} className="flex items-center gap-1 px-3.5 py-2.5 hover:text-foreground transition-colors">
          {isRu ? 'Тип' : 'Type'} <SortIcon active={sortKey === 'type'} />
        </button>
      </div>
      <div className="divide-y divide-border">
        {sorted.map((r) => (
          <a
            key={`${r.source}-${r.asset}`}
            href={r.url}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className={`grid grid-cols-[1.6fr_1fr_1fr_1fr] items-center text-sm hover:bg-foreground/[0.03] transition-colors ${r.rate === bestRate ? 'bg-positive/5' : ''}`}
          >
            <span className="flex items-center gap-2 px-3.5 py-3 min-w-0">
              <Image src={r.logo} alt="" width={20} height={20} className="rounded-md shrink-0" unoptimized />
              <span className="truncate">
                <span className="font-medium text-foreground">{r.source}</span>
                <span className="text-muted"> · {r.asset}</span>
              </span>
            </span>
            <span className="px-3.5 py-3 font-mono font-bold tabular-nums text-foreground">{r.rate.toFixed(4)}</span>
            <span className="hidden sm:block px-3.5 py-3 text-muted">{r.feePct === 0 ? (isRu ? 'нет' : 'none') : `${r.feePct}%`}</span>
            <span className="px-3.5 py-3">
              {r.rate === bestRate ? (
                <span className="text-[10px] font-bold text-positive bg-positive/10 px-2 py-0.5 rounded-full whitespace-nowrap">
                  {isRu ? 'Лучший' : 'Best'}
                </span>
              ) : (
                <span className="text-xs text-muted">{typeLabel(r.type)}</span>
              )}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
