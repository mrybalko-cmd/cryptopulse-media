'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeftRight, ChevronDown, RefreshCw } from 'lucide-react';
import Sparkline from './Sparkline';
import { FIAT_CURRENCIES, CRYPTO_CURRENCIES } from '@/lib/currencies';

type PriceMap = Record<string, Record<string, number>>;

export interface CoinMeta {
  image?: string;
  sparkline?: number[];
  change7d?: number;
}

/** "c:bitcoin" or "f:usd" — one key space for both sides of the pair. */
type Key = string;

const PRESETS = [1, 10, 100, 1000, 10000];
const TABLE_STEPS = [0.1, 0.5, 1, 5, 10, 100];
const MATRIX_FIAT = ['usd', 'eur', 'gbp', 'pln', 'czk', 'uah', 'try', 'inr'];
const POPULAR: [Key, Key][] = [
  ['c:bitcoin', 'f:usd'],
  ['c:ethereum', 'f:usd'],
  ['c:bitcoin', 'f:eur'],
  ['c:tether', 'f:uah'],
  ['c:solana', 'f:usd'],
  ['c:bitcoin', 'c:ethereum'],
];

const CRYPTO_KEYS = CRYPTO_CURRENCIES.map(c => `c:${c.id}`);
const FIAT_KEYS = FIAT_CURRENCIES.map(f => `f:${f.code}`);

function isCrypto(key: Key): boolean {
  return key.startsWith('c:');
}
function idOf(key: Key): string {
  return key.slice(2);
}
function symbolOf(key: Key): string {
  return isCrypto(key)
    ? (CRYPTO_CURRENCIES.find(c => c.id === idOf(key))?.symbol ?? '')
    : idOf(key).toUpperCase();
}
function nameOf(key: Key, isRu: boolean): string {
  if (isCrypto(key)) {
    const c = CRYPTO_CURRENCIES.find(x => x.id === idOf(key));
    return c ? (isRu ? c.name.ru : c.name.en) : '';
  }
  const f = FIAT_CURRENCIES.find(x => x.code === idOf(key));
  return f ? (isRu ? f.name.ru : f.name.en) : '';
}
function flagOf(key: Key): string {
  return FIAT_CURRENCIES.find(f => f.code === idOf(key))?.flag ?? '';
}

/** Accepts "7 500", "7500", "7.5", "7,5" — whatever a person actually types. */
function parseAmount(raw: string): number {
  const n = parseFloat(raw.replace(/[^0-9.,]/g, '').replace(/\s/g, '').replace(',', '.'));
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

export default function CurrencyConverter({
  locale,
  meta = {},
  initialFrom = 'f:usd',
  initialTo = 'c:bitcoin',
  initialAmount = '1000',
  initialPrices = {},
}: {
  locale: string;
  /** Logos and weekly price lines, fetched once on the server. */
  meta?: Record<string, CoinMeta>;
  /** Resolved on the server from the query string, so a shared link renders
      the right pair in the HTML rather than snapping to it after hydration. */
  initialFrom?: string;
  initialTo?: string;
  initialAmount?: string;
  /** First quotes, rendered server-side so the figures ship inside the HTML. */
  initialPrices?: PriceMap;
}) {
  const isRu = locale === 'ru';
  const intl = isRu ? 'ru-RU' : 'en-US';

  const [amount, setAmount] = useState(initialAmount);
  const [from, setFrom] = useState<Key>(initialFrom);
  const [to, setTo] = useState<Key>(initialTo);
  const [open, setOpen] = useState<'from' | 'to' | null>(null);
  const [prices, setPrices] = useState<PriceMap>(initialPrices);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const fetchPrices = useCallback(async () => {
    try {
      setError(false);
      const ids = CRYPTO_CURRENCIES.map(c => c.id).join(',');
      const vs = FIAT_CURRENCIES.map(c => c.code).join(',');
      const res = await fetch(`/api/price?ids=${ids}&vs_currencies=${vs}&include_24hr_change=true`, {
        cache: 'no-store',
      });
      if (!res.ok) throw new Error('bad response');
      setPrices(await res.json());
      setUpdatedAt(new Date());
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  // Prices arrive from the server already rendered; this only keeps them warm.
  useEffect(() => {
    const interval = setInterval(fetchPrices, 60_000);
    return () => clearInterval(interval);
  }, [fetchPrices]);

  // A pair in the URL survives a bookmark, a share and a reload. The initial
  // value arrives as a prop from the server; this only writes changes back,
  // with replaceState so it never stacks history entries.
  useEffect(() => {
    const untouched = from === initialFrom && to === initialTo && amount === initialAmount;
    // Nothing chosen yet means nothing to record — otherwise every visit would
    // rewrite the clean URL into a parameterised one it never asked for.
    if (untouched && !window.location.search) return;
    const sp = new URLSearchParams();
    sp.set('from', from);
    sp.set('to', to);
    sp.set('amount', String(parseAmount(amount)));
    window.history.replaceState(null, '', `${window.location.pathname}?${sp}`);
  }, [from, to, amount, initialFrom, initialTo, initialAmount]);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(null);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  /** USD for one unit. Fiat is derived from bitcoin's own two quotes, which
      puts every pair — including crypto→crypto — on one piece of arithmetic. */
  const usdPer = useCallback(
    (key: Key): number => {
      if (isCrypto(key)) return prices[idOf(key)]?.usd ?? 0;
      const btcUsd = prices.bitcoin?.usd;
      const btcLocal = prices.bitcoin?.[idOf(key)];
      return btcUsd && btcLocal ? btcUsd / btcLocal : 0;
    },
    [prices]
  );

  const rate = useMemo(() => {
    const a = usdPer(from);
    const b = usdPer(to);
    return a > 0 && b > 0 ? a / b : 0;
  }, [usdPer, from, to]);

  const amountNum = parseAmount(amount);
  const result = rate * amountNum;
  const ready = rate > 0;

  const format = useCallback(
    (n: number, key: Key): string => {
      if (!Number.isFinite(n) || n === 0) return '0';
      const digits = !isCrypto(key) ? 2 : n >= 1000 ? 2 : n >= 1 ? 4 : 8;
      return n.toLocaleString(intl, { minimumFractionDigits: Math.min(digits, 2), maximumFractionDigits: digits });
    },
    [intl]
  );

  // The coin drives the chart, the table and the matrix, whichever side it is
  // on — nobody looks up "0.1 USD in BTC", everybody looks up "0.5 BTC to USD".
  const coinKey = isCrypto(from) ? from : isCrypto(to) ? to : null;
  const quoteKey = coinKey === from ? to : from;
  const coinMeta = coinKey ? meta[idOf(coinKey)] : undefined;
  const coinRate = coinKey && ready ? usdPer(coinKey) / usdPer(quoteKey) : 0;
  const change24 = isCrypto(to)
    ? prices[idOf(to)]?.[`${isCrypto(from) ? 'usd' : idOf(from)}_24h_change`]
    : isCrypto(from)
      ? prices[idOf(from)]?.[`${idOf(to)}_24h_change`]
      : undefined;

  function swap() {
    setFrom(to);
    setTo(from);
    setOpen(null);
  }

  const menuFor = (side: 'from' | 'to') => (
    <div
      className={`absolute z-30 top-[calc(100%+8px)] right-0 w-[250px] max-h-[262px] overflow-auto rounded-2xl border border-[var(--glass-line)] bg-background p-1.5 shadow-[0_18px_44px_rgba(0,0,0,0.4)] ${
        open === side ? 'block' : 'hidden'
      }`}
      role="listbox"
    >
      {([
        [isRu ? 'Криптовалюты' : 'Crypto', CRYPTO_KEYS],
        [isRu ? 'Валюты' : 'Fiat', FIAT_KEYS],
      ] as [string, Key[]][]).map(([group, keys]) => (
        <div key={group}>
          <span className="block px-2.5 pt-2 pb-1.5 text-[9px] font-black uppercase tracking-[0.1em] text-muted">
            {group}
          </span>
          {keys.map(key => (
            <button
              key={key}
              type="button"
              onClick={() => {
                if (side === 'from') setFrom(key);
                else setTo(key);
                setOpen(null);
              }}
              className="flex w-full items-center gap-2.5 rounded-[9px] px-2.5 py-[7px] text-[13px] font-bold text-foreground hover:bg-[var(--glass-hover)] transition-colors"
            >
              <CurrencyIcon keyName={key} meta={meta} size={20} />
              {symbolOf(key)}
              <span className="ml-auto text-[11px] font-semibold text-muted truncate">{nameOf(key, isRu)}</span>
            </button>
          ))}
        </div>
      ))}
    </div>
  );

  const pickerButton = (side: 'from' | 'to') => {
    const key = side === 'from' ? from : to;
    return (
      <span className="relative shrink-0">
        <button
          type="button"
          onClick={() => setOpen(o => (o === side ? null : side))}
          aria-expanded={open === side}
          aria-label={isRu ? 'Выбрать валюту' : 'Choose currency'}
          className="flex items-center gap-2 rounded-full border border-border bg-card py-1.5 pl-[7px] pr-[11px] text-[13.5px] font-extrabold text-foreground whitespace-nowrap hover:border-accent/50 transition-colors"
        >
          <CurrencyIcon keyName={key} meta={meta} size={22} />
          {symbolOf(key)}
          <ChevronDown size={12} className="text-muted" />
        </button>
        {menuFor(side)}
      </span>
    );
  };

  return (
    <div ref={rootRef} className="relative">
      {/* Halo bleeding from behind the panel's top edge */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-[2%] -top-[46px] h-[200px] w-[420px] blur-[52px]"
        style={{ background: 'radial-gradient(50% 50% at 50% 50%, var(--halo-violet), transparent 72%)' }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute right-[2%] -top-[34px] h-[170px] w-[320px] blur-[52px]"
        style={{ background: 'radial-gradient(50% 50% at 50% 50%, var(--halo-cyan), transparent 72%)' }}
      />

      <div className="relative rounded-[20px] border border-[var(--glass-line)] bg-[image:var(--glass-fill)] shadow-[inset_0_1px_0_var(--glass-hi),var(--glass-shadow)] p-4 sm:p-5">
        <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] gap-3 sm:gap-4 items-end">
          <div className="min-w-0">
            <span className="block text-[9.5px] font-extrabold uppercase tracking-[0.09em] text-muted">
              {isRu ? 'Отдаёте' : 'You have'}
            </span>
            <div className="flex items-end gap-3 mt-2 pb-2.5 border-b-2 border-border focus-within:border-[var(--violet)] transition-colors">
              <input
                type="text"
                inputMode="decimal"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                aria-label={isRu ? 'Сумма' : 'Amount'}
                className="flex-1 min-w-0 border-0 bg-transparent outline-none text-foreground text-[26px] sm:text-[32px] font-extrabold -tracking-[0.04em] tabular-nums leading-[1.05]"
              />
              {pickerButton('from')}
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="button"
              onClick={swap}
              aria-label={isRu ? 'Поменять местами' : 'Swap'}
              className="flex h-[38px] w-[38px] items-center justify-center rounded-full border border-border bg-card text-muted hover:text-[var(--violet-2)] hover:border-[var(--violet)]/55 hover:rotate-180 transition-all duration-200"
            >
              <ArrowLeftRight size={15} />
            </button>
          </div>

          <div className="min-w-0">
            <span className="block text-[9.5px] font-extrabold uppercase tracking-[0.09em] text-muted">
              {isRu ? 'Получаете' : 'You get'}
            </span>
            <div className="flex items-end gap-3 mt-2 pb-2.5 border-b-2 border-border">
              <output
                className="flex-1 min-w-0 truncate text-[26px] sm:text-[32px] font-black -tracking-[0.04em] tabular-nums leading-[1.05] bg-[linear-gradient(90deg,var(--violet),var(--violet-2))] bg-clip-text text-transparent"
              >
                {ready ? format(result, to) : '—'}
              </output>
              {pickerButton('to')}
            </div>
          </div>
        </div>

        <div className="flex gap-1.5 mt-3 w-fit max-w-full overflow-x-auto scrollbar-none rounded-xl bg-[var(--rates-inset)] p-1">
          {PRESETS.map(p => (
            <button
              key={p}
              type="button"
              onClick={() => setAmount(String(p))}
              className={`rounded-[9px] px-3 py-1.5 text-xs font-extrabold tabular-nums whitespace-nowrap transition-all ${
                amountNum === p
                  ? 'text-white bg-[linear-gradient(120deg,var(--violet),var(--violet-2))] shadow-[0_2px_10px_color-mix(in_srgb,var(--violet)_45%,transparent)]'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              {p.toLocaleString(intl)}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2.5 flex-wrap mt-4 pt-3.5 border-t border-[var(--glass-line)] text-xs text-muted">
          {error ? (
            <span>{isRu ? 'Не удалось загрузить курсы.' : 'Could not load rates.'}</span>
          ) : ready ? (
            <>
              <span>
                1 {symbolOf(from)} = <b className="font-extrabold text-foreground tabular-nums">{format(rate, to)} {symbolOf(to)}</b>
              </span>
              <span className="opacity-40">·</span>
              <span>
                1 {symbolOf(to)} = <b className="font-extrabold text-foreground tabular-nums">{format(1 / rate, from)} {symbolOf(from)}</b>
              </span>
              {typeof change24 === 'number' && (
                <span
                  className={`rounded-full px-[7px] py-0.5 text-[11.5px] font-extrabold tabular-nums ${
                    change24 >= 0 ? 'text-positive bg-positive/15' : 'text-negative bg-negative/15'
                  }`}
                >
                  {change24 >= 0 ? '+' : ''}
                  {change24.toFixed(2)}%
                </span>
              )}
            </>
          ) : (
            <span>{isRu ? 'Загружаем курсы…' : 'Loading rates…'}</span>
          )}

          <button
            type="button"
            onClick={() => { setLoading(true); fetchPrices(); }}
            className="ml-auto flex items-center gap-1.5 text-[11px] hover:text-accent transition-colors"
          >
            <RefreshCw size={11} className={loading ? 'animate-spin' : ''} />
            {updatedAt && !error
              ? `${isRu ? 'обновлено' : 'updated'} ${updatedAt.toLocaleTimeString(intl, { hour: '2-digit', minute: '2-digit' })}`
              : isRu ? 'Обновить' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Popular pairs */}
      <div className="flex gap-1.5 flex-wrap mt-3.5">
        {POPULAR.map(([f, t]) => {
          const active = from === f && to === t;
          return (
            <button
              key={`${f}-${t}`}
              type="button"
              onClick={() => { setFrom(f); setTo(t); setOpen(null); }}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11.5px] font-extrabold transition-colors ${
                active
                  ? 'border-[var(--violet)]/55 bg-[var(--violet)]/10 text-foreground'
                  : 'border-border text-muted hover:text-foreground hover:border-[var(--violet)]/55'
              }`}
            >
              <CurrencyIcon keyName={f} meta={meta} size={15} />
              {symbolOf(f)} → {symbolOf(t)}
            </button>
          );
        })}
      </div>

      {coinKey && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mt-3.5">
            {coinMeta?.sparkline && coinMeta.sparkline.length > 1 && (
              <div className="rounded-2xl border border-[var(--glass-line)] bg-[image:var(--glass-fill)] p-4">
                <div className="flex items-baseline justify-between gap-2.5 mb-2.5">
                  <span className="text-[9.5px] font-extrabold uppercase tracking-[0.09em] text-muted">
                    {symbolOf(coinKey)} · {isRu ? '7 дней' : '7 days'}
                  </span>
                  {typeof coinMeta.change7d === 'number' && (
                    <span
                      className={`rounded-full px-[7px] py-0.5 text-[11.5px] font-extrabold tabular-nums ${
                        coinMeta.change7d >= 0 ? 'text-positive bg-positive/15' : 'text-negative bg-negative/15'
                      }`}
                    >
                      {coinMeta.change7d >= 0 ? '+' : ''}
                      {coinMeta.change7d.toFixed(2)}%
                    </span>
                  )}
                </div>
                <Sparkline points={coinMeta.sparkline} positive={(coinMeta.change7d ?? 0) >= 0} height={96} />
                {ready && (
                  <div className="flex gap-5 mt-3 pt-3 border-t border-[var(--glass-line)]">
                    {[
                      [isRu ? 'минимум' : 'low', Math.min(...coinMeta.sparkline)],
                      [isRu ? 'максимум' : 'high', Math.max(...coinMeta.sparkline)],
                    ].map(([label, value]) => (
                      <span key={label as string} className="text-[11px] text-muted">
                        {label}
                        <b className="block text-[13.5px] font-extrabold text-foreground tabular-nums mt-0.5">
                          {format((value as number) * (usdPer('f:usd') / usdPer(quoteKey)), quoteKey)} {symbolOf(quoteKey)}
                        </b>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Ready-made amounts: the exact figures people search for */}
            <div className="rounded-2xl border border-[var(--glass-line)] bg-[image:var(--glass-fill)] overflow-hidden">
              <div className="grid grid-cols-2 border-b border-[var(--glass-line)] text-[9.5px] font-extrabold uppercase tracking-[0.09em] text-muted">
                <span className="px-3.5 py-2.5">{symbolOf(coinKey)}</span>
                <span className="px-3.5 py-2.5">{symbolOf(quoteKey)}</span>
              </div>
              {TABLE_STEPS.map(step => (
                <div key={step} className="grid grid-cols-2 border-b border-[var(--glass-line)] last:border-b-0 text-[13px] hover:bg-[var(--glass-hover)] transition-colors">
                  <span className="px-3.5 py-[9px] font-bold text-muted tabular-nums">
                    {step} {symbolOf(coinKey)}
                  </span>
                  <span className="px-3.5 py-[9px] font-extrabold text-foreground tabular-nums">
                    {ready ? `${format(step * coinRate, quoteKey)} ${symbolOf(quoteKey)}` : '—'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* One coin against every currency our readers actually use */}
          <div className="rounded-2xl border border-[var(--glass-line)] bg-[image:var(--glass-fill)] overflow-hidden mt-3">
            {MATRIX_FIAT.map(code => {
              const value = prices[idOf(coinKey)]?.[code];
              const delta = prices[idOf(coinKey)]?.[`${code}_24h_change`];
              return (
                <div
                  key={code}
                  className="grid grid-cols-[minmax(0,1fr)_auto] sm:grid-cols-[minmax(0,1fr)_150px_100px] items-center border-b border-[var(--glass-line)] last:border-b-0 text-[13px] hover:bg-[var(--glass-hover)] transition-colors"
                >
                  <span className="flex items-center gap-2.5 px-3.5 py-2.5 font-bold text-foreground">
                    <span className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-[var(--rates-inset)] text-xs">
                      {flagOf(`f:${code}`)}
                    </span>
                    1 {symbolOf(coinKey)} → {code.toUpperCase()}
                  </span>
                  <span className="px-3.5 py-2.5 text-right font-extrabold text-foreground tabular-nums">
                    {value ? value.toLocaleString(intl, { maximumFractionDigits: 2 }) : '—'}
                  </span>
                  <span className="hidden sm:block px-3.5 py-2.5 text-right">
                    {typeof delta === 'number' && (
                      <span
                        className={`rounded-full px-[7px] py-0.5 text-[11.5px] font-extrabold tabular-nums ${
                          delta >= 0 ? 'text-positive bg-positive/15' : 'text-negative bg-negative/15'
                        }`}
                      >
                        {delta >= 0 ? '+' : ''}
                        {delta.toFixed(2)}%
                      </span>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        </>
      )}

      <div className="flex items-center gap-3 flex-wrap mt-3 rounded-2xl border border-[var(--glass-line)] bg-[image:var(--glass-fill)] px-4 py-3.5 text-[12.5px] text-muted">
        <span className="min-w-0">
          <b className="text-foreground">{isRu ? 'Курс биржи будет другим.' : 'An exchange will quote you differently.'}</b>{' '}
          {isRu
            ? 'Здесь справочный рыночный курс без комиссий.'
            : 'This is the clean market rate, before anyone’s fees.'}
        </span>
        <Link
          href={`/${locale}/rates`}
          className="ml-auto shrink-0 rounded-[9px] border border-accent/40 px-3 py-[7px] text-[11.5px] font-extrabold text-accent hover:bg-accent/10 transition-colors"
        >
          {isRu ? 'Сравнить курсы' : 'Compare real rates'} →
        </Link>
      </div>
    </div>
  );
}

function CurrencyIcon({ keyName, meta, size }: { keyName: Key; meta: Record<string, CoinMeta>; size: number }) {
  if (!isCrypto(keyName)) {
    return (
      <span
        className="flex shrink-0 items-center justify-center rounded-full bg-[var(--rates-inset)]"
        style={{ width: size, height: size, fontSize: size * 0.55 }}
      >
        {flagOf(keyName)}
      </span>
    );
  }
  const image = meta[idOf(keyName)]?.image;
  if (!image) {
    return (
      <span
        className="flex shrink-0 items-center justify-center rounded-full bg-[var(--rates-inset)] text-[9px] font-black text-muted"
        style={{ width: size, height: size }}
      >
        {symbolOf(keyName).slice(0, 2)}
      </span>
    );
  }
  return (
    <Image src={image} alt="" width={size} height={size} className="rounded-full shrink-0" style={{ width: size, height: size }} unoptimized />
  );
}
