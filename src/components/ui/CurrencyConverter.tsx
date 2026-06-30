'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowRightLeft, RefreshCw } from 'lucide-react';
import { FIAT_CURRENCIES, CRYPTO_CURRENCIES } from '@/lib/currencies';

type PriceMap = Record<string, Record<string, number>>;

const QUICK_AMOUNTS = [100, 1000, 10000];

function formatFiat(n: number, code: string, locale: string) {
  try {
    return new Intl.NumberFormat(locale === 'ru' ? 'ru-RU' : 'en-US', {
      style: 'currency',
      currency: code.toUpperCase(),
      maximumFractionDigits: 2,
    }).format(n);
  } catch {
    return `${n.toLocaleString(locale === 'ru' ? 'ru-RU' : 'en-US', { maximumFractionDigits: 2 })} ${code.toUpperCase()}`;
  }
}

function formatCrypto(n: number, locale: string) {
  const digits = n >= 1000 ? 2 : n >= 1 ? 4 : 8;
  return new Intl.NumberFormat(locale === 'ru' ? 'ru-RU' : 'en-US', {
    maximumFractionDigits: digits,
  }).format(n);
}

export default function CurrencyConverter({ locale }: { locale: string }) {
  const isRu = locale === 'ru';
  const [amount, setAmount] = useState('1000');
  const [fiatCode, setFiatCode] = useState('usd');
  const [cryptoId, setCryptoId] = useState('bitcoin');
  const [direction, setDirection] = useState<'fiatToCrypto' | 'cryptoToFiat'>('fiatToCrypto');
  const [prices, setPrices] = useState<PriceMap>({});
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchPrices = async () => {
    try {
      setError(false);
      const ids = CRYPTO_CURRENCIES.map((c) => c.id).join(',');
      const vs = FIAT_CURRENCIES.map((c) => c.code).join(',');
      const res = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=${vs}`,
        { cache: 'no-store' }
      );
      if (!res.ok) throw new Error('bad response');
      const data = await res.json();
      setPrices(data);
      setUpdatedAt(new Date());
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 60000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const price = prices[cryptoId]?.[fiatCode];
  const amountNum = parseFloat(amount) || 0;

  const result = useMemo(() => {
    if (!price || amountNum <= 0) return 0;
    return direction === 'fiatToCrypto' ? amountNum / price : amountNum * price;
  }, [price, amountNum, direction]);

  const fromCurrency = direction === 'fiatToCrypto' ? fiatCode : cryptoId;
  const fromLabel = direction === 'fiatToCrypto'
    ? FIAT_CURRENCIES.find((c) => c.code === fiatCode)
    : CRYPTO_CURRENCIES.find((c) => c.id === cryptoId);

  const swap = () => {
    setDirection((d) => (d === 'fiatToCrypto' ? 'cryptoToFiat' : 'fiatToCrypto'));
    setAmount(result > 0 ? String(Number(result.toFixed(8))) : amount);
  };

  const selectClass =
    'bg-card border border-border rounded-lg px-3 py-2.5 text-sm text-foreground outline-none focus:border-accent/50 w-full';

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-3 items-end">
        {/* From */}
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="text-xs text-muted uppercase tracking-wide mb-2">{isRu ? 'Из' : 'From'}</p>
          {direction === 'fiatToCrypto' ? (
            <select value={fiatCode} onChange={(e) => setFiatCode(e.target.value)} className={selectClass}>
              {FIAT_CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.code.toUpperCase()} — {isRu ? c.name.ru : c.name.en}
                </option>
              ))}
            </select>
          ) : (
            <select value={cryptoId} onChange={(e) => setCryptoId(e.target.value)} className={selectClass}>
              {CRYPTO_CURRENCIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.symbol} — {isRu ? c.name.ru : c.name.en}
                </option>
              ))}
            </select>
          )}
          <input
            type="number"
            min={0}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-transparent text-2xl font-bold text-foreground outline-none mt-3"
            placeholder="0"
          />
          <div className="flex gap-1.5 mt-2">
            {QUICK_AMOUNTS.map((q) => (
              <button
                key={q}
                onClick={() => setAmount(String(q))}
                className="text-xs px-2 py-1 rounded bg-background border border-border text-muted hover:text-accent hover:border-accent/40 transition-colors"
              >
                {q.toLocaleString(isRu ? 'ru-RU' : 'en-US')}
              </button>
            ))}
          </div>
        </div>

        {/* Swap */}
        <button
          onClick={swap}
          aria-label={isRu ? 'Поменять местами' : 'Swap'}
          className="hidden sm:flex w-10 h-10 rounded-full border border-border bg-card items-center justify-center text-muted hover:text-accent hover:border-accent/40 transition-colors mb-1 self-center"
        >
          <ArrowRightLeft size={16} />
        </button>
        <button
          onClick={swap}
          aria-label={isRu ? 'Поменять местами' : 'Swap'}
          className="sm:hidden flex items-center justify-center gap-2 w-full py-2 rounded-lg border border-border bg-card text-muted text-xs"
        >
          <ArrowRightLeft size={14} />
          {isRu ? 'Поменять местами' : 'Swap'}
        </button>

        {/* To */}
        <div className="rounded-2xl border border-accent/30 bg-gradient-to-br from-card to-background p-4">
          <p className="text-xs text-muted uppercase tracking-wide mb-2">{isRu ? 'В' : 'To'}</p>
          {direction === 'fiatToCrypto' ? (
            <select value={cryptoId} onChange={(e) => setCryptoId(e.target.value)} className={selectClass}>
              {CRYPTO_CURRENCIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.symbol} — {isRu ? c.name.ru : c.name.en}
                </option>
              ))}
            </select>
          ) : (
            <select value={fiatCode} onChange={(e) => setFiatCode(e.target.value)} className={selectClass}>
              {FIAT_CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.code.toUpperCase()} — {isRu ? c.name.ru : c.name.en}
                </option>
              ))}
            </select>
          )}
          <p className="text-2xl font-bold text-accent mt-3 font-mono break-all">
            {loading
              ? '—'
              : direction === 'fiatToCrypto'
              ? formatCrypto(result, locale)
              : formatFiat(result, fiatCode, locale)}
          </p>
        </div>
      </div>

      {/* Rate + status */}
      <div className="flex items-center justify-between flex-wrap gap-2 text-xs text-muted">
        <span>
          {error
            ? isRu
              ? 'Не удалось загрузить курсы. Попробуй обновить.'
              : "Couldn't load rates. Try refreshing."
            : price
            ? isRu
              ? `1 ${CRYPTO_CURRENCIES.find((c) => c.id === cryptoId)?.symbol} ≈ ${formatFiat(price, fiatCode, locale)}`
              : `1 ${CRYPTO_CURRENCIES.find((c) => c.id === cryptoId)?.symbol} ≈ ${formatFiat(price, fiatCode, locale)}`
            : isRu
            ? 'Загружаем курсы...'
            : 'Loading rates...'}
          {updatedAt && !error && (
            <>
              {' · '}
              {isRu ? 'обновлено' : 'updated'}{' '}
              {updatedAt.toLocaleTimeString(isRu ? 'ru-RU' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
            </>
          )}
        </span>
        <button
          onClick={() => { setLoading(true); fetchPrices(); }}
          className="flex items-center gap-1 hover:text-accent transition-colors"
        >
          <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
          {isRu ? 'Обновить' : 'Refresh'}
        </button>
      </div>
    </div>
  );
}
