'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpDown, ArrowUp, ArrowDown, ExternalLink } from 'lucide-react';
import type { EurRate } from '@/lib/eurRates';

type SortKey = 'rate' | 'feePct' | 'type';
type Filter = 'all' | 'p2p' | 'cex';

/** Rate is always below 1, so the whole part is a bare "0" — muting the
    decimals here would shrink the only digits that matter. Only the currency
    symbol steps back. */
function Rate({ value }: { value: number }) {
  return (
    <span className="tabular-nums -tracking-[0.025em]">
      <span className="text-[0.76em] text-muted font-bold mr-px">€</span>
      {value.toFixed(4)}
    </span>
  );
}

function SortIcon({ active, dir }: { active: boolean; dir: 'asc' | 'desc' }) {
  if (!active) return <ArrowUpDown size={11} className="text-muted/50" />;
  return dir === 'desc' ? <ArrowDown size={11} className="text-accent" /> : <ArrowUp size={11} className="text-accent" />;
}

/** Venue name links to our own review page; only "Trade" leaves the site. */
function VenueName({
  rate,
  size,
  locale,
  isBest,
  isRu,
}: {
  rate: EurRate;
  size: 'sm' | 'md';
  locale: string;
  isBest: boolean;
  isRu: boolean;
}) {
  const inner = (
    <>
      <Image
        src={rate.logo}
        alt=""
        width={size === 'md' ? 28 : 32}
        height={size === 'md' ? 28 : 32}
        className={`${size === 'md' ? 'w-5 h-5' : 'w-[22px] h-[22px]'} rounded-md shrink-0`}
        unoptimized
      />
      <span className="min-w-0">
        <span className="flex items-center gap-1.5 text-[13px] font-bold text-foreground group-hover:text-accent transition-colors">
          <span className="truncate">{rate.source}</span>
          {isBest && (
            <span className="shrink-0 rounded-full bg-positive/15 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-positive">
              {isRu ? 'лучший' : 'best'}
            </span>
          )}
        </span>
        <span className="block text-[10.5px] text-muted font-semibold mt-px">{rate.asset}</span>
      </span>
    </>
  );

  if (!rate.exchangeSlug) {
    return <span className="flex items-center gap-2.5 min-w-0">{inner}</span>;
  }
  return (
    <Link href={`/${locale}/exchanges/${rate.exchangeSlug}`} className="group flex items-center gap-2.5 min-w-0">
      {inner}
    </Link>
  );
}

function TradeLink({ rate, isRu }: { rate: EurRate; isRu: boolean }) {
  return (
    <a
      href={rate.url}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-[11px] font-extrabold text-foreground hover:border-accent/55 hover:text-accent transition-colors whitespace-nowrap"
    >
      {isRu ? 'Купить' : 'Trade'}
      <ExternalLink size={11} />
    </a>
  );
}

function typeLabel(t: EurRate['type'], isRu: boolean) {
  return t === 'p2p' ? 'P2P' : isRu ? 'Биржа' : 'Exchange';
}

function feeLabel(fee: number, isRu: boolean) {
  return fee ? `${fee}%` : isRu ? 'нет' : 'none';
}

export default function EurRatesTable({ rates, locale }: { rates: EurRate[]; locale: string }) {
  const isRu = locale === 'ru';
  const [sortKey, setSortKey] = useState<SortKey>('rate');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [filter, setFilter] = useState<Filter>('all');

  const bestRate = useMemo(() => (rates.length ? Math.max(...rates.map((r) => r.rate)) : 0), [rates]);
  const counts = useMemo(
    () => ({
      all: rates.length,
      p2p: rates.filter((r) => r.type === 'p2p').length,
      cex: rates.filter((r) => r.type === 'cex').length,
    }),
    [rates]
  );

  const sorted = useMemo(() => {
    const copy = filter === 'all' ? [...rates] : rates.filter((r) => r.type === filter);
    copy.sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1;
      if (sortKey === 'type') return a.type.localeCompare(b.type) * dir;
      return (a[sortKey] - b[sortKey]) * dir;
    });
    return copy;
  }, [rates, sortKey, sortDir, filter]);

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  }

  const chip = 'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11.5px] font-bold transition-colors';

  return (
    <div>
      <div className="flex gap-1.5 flex-wrap mb-3">
        {([
          ['all', isRu ? 'Все' : 'All'],
          ['p2p', 'P2P'],
          ['cex', isRu ? 'Биржи' : 'Exchanges'],
        ] as [Filter, string][]).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            aria-pressed={filter === key}
            className={`${chip} ${
              filter === key
                ? 'border-accent/55 bg-accent/10 text-foreground'
                : 'border-border text-muted hover:text-foreground'
            }`}
          >
            {label}
            <span className="text-[10px] text-muted tabular-nums">{counts[key]}</span>
          </button>
        ))}
      </div>

      <div className="rounded-[18px] overflow-hidden border border-[var(--popular-glass-line)] bg-[var(--popular-glass)] shadow-[inset_0_1px_0_var(--popular-glass-line),var(--popular-shadow)]">
        {/* Desktop: full table */}
        <div className="hidden sm:block">
          <div className="grid grid-cols-[1.7fr_.9fr_.8fr_.8fr_100px] text-[9.5px] font-extrabold uppercase tracking-wider text-muted border-b border-border">
            <span className="px-3.5 py-3">{isRu ? 'Источник' : 'Source'}</span>
            <button onClick={() => toggleSort('rate')} className="flex items-center justify-end gap-1 px-3.5 py-3 hover:text-foreground transition-colors">
              {isRu ? 'Курс' : 'Rate'} <SortIcon active={sortKey === 'rate'} dir={sortDir} />
            </button>
            <button onClick={() => toggleSort('feePct')} className="flex items-center justify-end gap-1 px-3.5 py-3 hover:text-foreground transition-colors">
              {isRu ? 'Комиссия' : 'Fee'} <SortIcon active={sortKey === 'feePct'} dir={sortDir} />
            </button>
            <button onClick={() => toggleSort('type')} className="flex items-center justify-end gap-1 px-3.5 py-3 hover:text-foreground transition-colors">
              {isRu ? 'Тип' : 'Type'} <SortIcon active={sortKey === 'type'} dir={sortDir} />
            </button>
            <span className="px-3.5 py-3" />
          </div>

          {sorted.map((r) => (
            <div
              key={`${r.source}-${r.asset}`}
              className={`grid grid-cols-[1.7fr_.9fr_.8fr_.8fr_100px] items-center border-b border-border/60 last:border-b-0 transition-colors hover:bg-[var(--popular-glass)] ${
                r.rate === bestRate ? 'bg-positive/[0.08]' : ''
              }`}
            >
              <span className="px-3.5 py-3 min-w-0">
                <VenueName rate={r} size="md" locale={locale} isBest={r.rate === bestRate} isRu={isRu} />
              </span>
              <span className="px-3.5 py-3 text-right text-[15px] font-extrabold text-foreground">
                <Rate value={r.rate} />
              </span>
              <span className="px-3.5 py-3 text-right text-xs text-muted tabular-nums">{feeLabel(r.feePct, isRu)}</span>
              <span className="px-3.5 py-3 text-right">
                <span
                  className={`inline-block rounded-full px-2 py-1 text-[10px] font-extrabold uppercase tracking-wide ${
                    r.type === 'p2p' ? 'text-[var(--rates-violet-2)] bg-[var(--rates-violet)]/15' : 'text-accent bg-accent/15'
                  }`}
                >
                  {typeLabel(r.type, isRu)}
                </span>
              </span>
              <span className="px-3.5 py-3 text-right">
                <TradeLink rate={r} isRu={isRu} />
              </span>
            </div>
          ))}
        </div>

        {/* Mobile: one card per venue — the fee column used to just disappear */}
        <div className="sm:hidden">
          {sorted.map((r) => (
            <div
              key={`${r.source}-${r.asset}`}
              className={`grid grid-cols-[minmax(0,1fr)_auto] gap-3 items-center px-3.5 py-3 border-b border-border/60 last:border-b-0 ${
                r.rate === bestRate ? 'bg-positive/[0.08]' : ''
              }`}
            >
              <span className="min-w-0">
                <VenueName rate={r} size="sm" locale={locale} isBest={r.rate === bestRate} isRu={isRu} />
                <span className="flex items-center gap-2 mt-1.5">
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wide ${
                      r.type === 'p2p' ? 'text-[var(--rates-violet-2)] bg-[var(--rates-violet)]/15' : 'text-accent bg-accent/15'
                    }`}
                  >
                    {typeLabel(r.type, isRu)}
                  </span>
                  <span className="text-[10.5px] text-muted tabular-nums">
                    {isRu ? 'комиссия' : 'fee'} {feeLabel(r.feePct, isRu)}
                  </span>
                </span>
              </span>
              <span className="text-right shrink-0">
                <span className="block text-[15.5px] font-extrabold text-foreground">
                  <Rate value={r.rate} />
                </span>
                <span className="block mt-1.5">
                  <TradeLink rate={r} isRu={isRu} />
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-[11px] text-muted mt-2.5 leading-relaxed">
        {isRu
          ? 'Нажмите на название площадки, чтобы открыть её обзор на CryptoPulse.'
          : 'Tap a venue name to open our review of that exchange.'}
      </p>
    </div>
  );
}
