'use client';

import { useMemo, useState } from 'react';
import type { EurRate } from '@/lib/eurRates';

// Own graphite/silver gradient, same tokens as the homepage's Author
// Columns — deliberately separate from --card so the calculator and the
// rates table below it read as their own distinct "tool" surface rather
// than blending into every other bordered card on the page.
const bg = 'linear-gradient(135deg, var(--author-bg-1), var(--author-bg-2))';
const border = 'var(--author-border)';

export default function EurCalculator({ rates, locale }: { rates: EurRate[]; locale: string }) {
  const isRu = locale === 'ru';
  const [amount, setAmount] = useState('1000');
  const [asset, setAsset] = useState<'USDT' | 'USDC'>('USDT');

  const best = useMemo(() => {
    const forAsset = rates.filter((r) => r.asset === asset);
    if (forAsset.length === 0) return null;
    return forAsset.reduce((a, b) => (b.rate > a.rate ? b : a));
  }, [rates, asset]);

  const parsedAmount = Number(amount.replace(/[^\d.]/g, '')) || 0;
  const result = best ? parsedAmount * best.rate : 0;

  return (
    <div
      className="rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-5"
      style={{ background: bg, border: `1px solid ${border}` }}
    >
      <div className="flex-1 flex items-center gap-2">
        <input
          type="text"
          inputMode="decimal"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="flex-1 min-w-0 px-3 py-2.5 text-base bg-background/40 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-accent transition-shadow"
          style={{ border: `1px solid ${border}` }}
        />
        <select
          value={asset}
          onChange={(e) => setAsset(e.target.value as 'USDT' | 'USDC')}
          className="px-3 py-2.5 text-sm bg-background/40 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-accent transition-shadow"
          style={{ border: `1px solid ${border}` }}
        >
          <option value="USDT">USDT</option>
          <option value="USDC">USDC</option>
        </select>
      </div>

      <div className="text-muted text-lg font-light shrink-0 hidden sm:block">=</div>

      <div className="flex-1 text-left sm:text-right">
        <div className="font-mono text-3xl font-extrabold text-accent tabular-nums leading-none">
          {result ? `€${result.toLocaleString(isRu ? 'ru-RU' : 'en-US', { maximumFractionDigits: 2 })}` : '—'}
        </div>
        <div className="text-xs text-muted mt-1.5">
          {best
            ? isRu
              ? `лучший курс — ${best.source}`
              : `best rate — ${best.source}`
            : isRu
              ? 'курсы временно недоступны'
              : 'rates temporarily unavailable'}
        </div>
      </div>
    </div>
  );
}
