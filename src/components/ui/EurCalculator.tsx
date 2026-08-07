'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';
import type { EurRate } from '@/lib/eurRates';

const PRESETS = [100, 500, 1000, 5000, 10000];

/**
 * Amounts are shown with a large whole part and a muted remainder: at a glance
 * you read "946", not "946.00". Monospace is deliberately avoided here — it
 * reads as a terminal rather than a rate.
 */
function Money({ value, className = '' }: { value: number; className?: string }) {
  const [whole, cents] = value.toFixed(2).split('.');
  return (
    <span className={`tabular-nums ${className}`}>
      <span className="text-[0.5em] text-muted font-bold mr-1.5">€</span>
      {Number(whole).toLocaleString('en-US')}
      <span className="text-[0.46em] text-muted font-bold">.{cents}</span>
    </span>
  );
}

function plain(value: number): string {
  return `€${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatAmount(n: number): string {
  return n.toLocaleString('en-US').replace(/,/g, ' ');
}

/** Accepts "7 500", "7500", "7.5", "7,5" — anything a person actually types. */
function parseAmount(raw: string): number {
  const n = parseFloat(raw.replace(/[^0-9.,]/g, '').replace(/\s/g, '').replace(',', '.'));
  return Number.isFinite(n) && n > 0 ? n : 0;
}

export default function EurCalculator({ rates, locale }: { rates: EurRate[]; locale: string }) {
  const isRu = locale === 'ru';
  const [amount, setAmount] = useState('1 000');
  const [asset, setAsset] = useState<'USDT' | 'USDC'>('USDT');

  const forAsset = useMemo(
    () => rates.filter((r) => r.asset === asset).sort((a, b) => b.rate - a.rate),
    [rates, asset]
  );
  const best = forAsset[0] ?? null;
  const parsed = parseAmount(amount);
  const bestValue = best ? parsed * best.rate : 0;

  const assets: ('USDT' | 'USDC')[] = ['USDT', 'USDC'];

  return (
    <div className="relative overflow-hidden rounded-[20px] border border-[var(--popular-glass-line)] bg-[var(--popular-glass)] shadow-[inset_0_1px_0_var(--popular-glass-line),var(--popular-shadow)] px-5 py-5 sm:px-6">
      {/* Violet glow, the same treatment the calculators page uses */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-1/2 -top-[72%] h-[360px] w-[520px] -translate-x-1/2 blur-[64px]"
        style={{ background: 'radial-gradient(50% 50% at 50% 50%, color-mix(in srgb, var(--rates-violet) 52%, transparent), transparent 70%)' }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -right-[6%] -bottom-[58%] h-[250px] w-[330px] blur-[56px]"
        style={{ background: 'radial-gradient(50% 50% at 50% 50%, color-mix(in srgb, var(--rates-violet-2) 28%, transparent), transparent 72%)' }}
      />

      <div className="relative grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_auto] gap-4 md:gap-6 items-center">
        <div className="min-w-0">
          <span className="block text-[9.5px] font-extrabold uppercase tracking-[0.09em] text-muted">
            {isRu ? 'Вы продаёте' : 'You sell'}
          </span>

          {/* Amount sits on a line, currency is a pill beside it — one is the
              value, the other is what it is measured in. */}
          <div className="flex items-end gap-3.5 mt-2 pb-3 border-b-2 border-border focus-within:border-[var(--rates-violet)] transition-colors">
            <input
              type="text"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              aria-label={isRu ? 'Сумма к продаже' : 'Amount to sell'}
              className="flex-1 min-w-0 border-0 bg-transparent outline-none text-foreground text-[31px] sm:text-[38px] font-extrabold -tracking-[0.04em] tabular-nums leading-none"
            />
            <div className="flex items-center gap-1.5 shrink-0 rounded-full border border-border bg-card px-2.5 py-1.5">
              {assets.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => setAsset(a)}
                  aria-pressed={asset === a}
                  className={`flex items-center gap-1.5 rounded-full px-2 py-1 text-[13px] font-extrabold transition-colors ${
                    asset === a ? 'text-foreground' : 'text-muted hover:text-foreground'
                  }`}
                >
                  <span
                    className="w-[22px] h-[22px] rounded-full flex items-center justify-center text-[11px] font-extrabold text-white"
                    style={{ background: a === 'USDT' ? '#26a17b' : '#2775ca', opacity: asset === a ? 1 : 0.45 }}
                  >
                    {a === 'USDT' ? '₮' : '$'}
                  </span>
                  {a}
                </button>
              ))}
              <ChevronDown size={13} className="text-muted" aria-hidden />
            </div>
          </div>

          <div className="flex gap-1.5 mt-3.5 rounded-xl bg-[var(--rates-inset)] p-1 w-fit max-w-full overflow-x-auto scrollbar-none">
            {PRESETS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setAmount(formatAmount(p))}
                className={`rounded-[9px] px-3 py-1.5 text-xs font-extrabold tabular-nums whitespace-nowrap transition-all ${
                  parsed === p
                    ? 'text-white shadow-[0_2px_10px_color-mix(in_srgb,var(--rates-violet)_45%,transparent)] bg-[linear-gradient(120deg,var(--rates-violet),var(--rates-violet-2))]'
                    : 'text-muted hover:text-foreground'
                }`}
              >
                {formatAmount(p)}
              </button>
            ))}
          </div>
        </div>

        <div className="md:text-right">
          <Money value={bestValue} className="block text-[38px] sm:text-[46px] font-extrabold -tracking-[0.045em] text-foreground leading-[0.95]" />
          {best && (
            <span className="flex md:justify-end items-center gap-2 text-[11px] text-muted mt-2">
              <Image src={best.logo} alt="" width={16} height={16} className="rounded-[5px]" unoptimized />
              {isRu ? 'лучший курс — ' : 'best rate via '}
              <b className="text-foreground">{best.source}</b>
            </span>
          )}
        </div>
      </div>

      {/* What every other venue would pay for the same amount, and how much
          that costs you compared to the best one. */}
      {forAsset.length > 1 && (
        <div className="relative flex flex-col gap-2.5 mt-5 pt-4 border-t border-border">
          {forAsset.slice(0, 5).map((r, i) => {
            const value = parsed * r.rate;
            const diff = bestValue - value;
            return (
              <span key={`${r.source}-${r.asset}`} className="grid grid-cols-[minmax(96px,168px)_minmax(0,1fr)_auto] gap-2.5 sm:gap-3 items-center">
                <span className="flex items-center gap-2 min-w-0 text-[10.5px] sm:text-[11.5px] font-bold text-foreground">
                  <Image src={r.logo} alt="" width={17} height={17} className="rounded-[5px] shrink-0" unoptimized />
                  <span className="truncate">{r.source}</span>
                  {i === 0 && (
                    <span className="shrink-0 rounded-full px-1.5 py-0.5 text-[8.5px] font-black uppercase tracking-wider text-white bg-[linear-gradient(120deg,var(--rates-violet),var(--rates-violet-2))]">
                      {isRu ? 'топ' : 'best'}
                    </span>
                  )}
                </span>
                <span className="block h-2 rounded-md bg-border overflow-hidden">
                  <span
                    className={`block h-full rounded-md transition-[width] duration-300 bg-[linear-gradient(90deg,color-mix(in_srgb,var(--rates-violet)_40%,transparent),var(--rates-violet-2))] ${
                      i === 0 ? 'shadow-[0_0_14px_color-mix(in_srgb,var(--rates-violet-2)_60%,transparent)]' : ''
                    }`}
                    style={{ width: `${((r.rate / forAsset[0].rate) * 100).toFixed(1)}%` }}
                  />
                </span>
                <span className={`text-[11.5px] sm:text-[12.5px] font-extrabold tabular-nums -tracking-[0.02em] whitespace-nowrap ${i === 0 ? 'text-foreground' : 'text-muted'}`}>
                  {plain(value)}
                  {diff > 0.005 && <span className="hidden sm:inline text-[10.5px] font-bold text-muted/70 ml-1.5">−{plain(diff)}</span>}
                </span>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
