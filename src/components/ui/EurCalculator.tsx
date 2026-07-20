'use client';

import { useMemo, useState } from 'react';
import { ArrowUpDown } from 'lucide-react';
import type { EurRate } from '@/lib/eurRates';

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
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center gap-2">
        <input
          type="text"
          inputMode="decimal"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="flex-1 min-w-0 px-3 py-2.5 text-base bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-accent transition-colors"
        />
        <select
          value={asset}
          onChange={(e) => setAsset(e.target.value as 'USDT' | 'USDC')}
          className="px-3 py-2.5 text-sm bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-accent transition-colors"
        >
          <option value="USDT">USDT</option>
          <option value="USDC">USDC</option>
        </select>
      </div>

      <div className="flex justify-center my-2 text-muted">
        <ArrowUpDown size={16} />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="text"
          readOnly
          value={result ? result.toLocaleString(isRu ? 'ru-RU' : 'en-US', { maximumFractionDigits: 2 }) : '—'}
          className="flex-1 min-w-0 px-3 py-2.5 text-base bg-background border border-border rounded-lg text-muted"
        />
        <span className="px-3 py-2.5 text-sm bg-background border border-border rounded-lg text-muted">EUR</span>
      </div>

      <div className="text-center pt-4 mt-4 border-t border-dashed border-border">
        <div className="font-mono text-3xl font-extrabold text-accent tabular-nums">
          {result ? `€${result.toLocaleString(isRu ? 'ru-RU' : 'en-US', { maximumFractionDigits: 2 })}` : '—'}
        </div>
        <div className="text-xs text-muted mt-1">
          {best
            ? isRu
              ? `по лучшему курсу — ${best.source}`
              : `at the best rate — ${best.source}`
            : isRu
              ? 'курсы временно недоступны'
              : 'rates temporarily unavailable'}
        </div>
      </div>
    </div>
  );
}
