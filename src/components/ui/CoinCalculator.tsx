'use client';

import { useEffect, useState } from 'react';
import { TrendingUp } from 'lucide-react';

export interface InvestmentReference {
  yearsAgo: number;
  year: number;
  price: number;
  label: { ru: string; en: string };
  note: { ru: string; en: string };
}

export const INVESTMENT_AMOUNTS = [100, 500, 1000, 2000, 5000];

// Generic version of BitcoinCalculator, parametrized by coin — same "what if
// I had bought X" mechanic, reused across every /assets/[slug] guide instead
// of duplicating the component per coin.
export default function CoinCalculator({
  locale,
  coingeckoId,
  symbol,
  reference,
}: {
  locale: string;
  coingeckoId: string;
  symbol: string;
  reference: InvestmentReference[];
}) {
  const isRu = locale === 'ru';
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [selectedAmount, setSelectedAmount] = useState(1000);
  const [customAmount, setCustomAmount] = useState('');
  const [useCustom, setUseCustom] = useState(false);

  useEffect(() => {
    fetch(`/api/price?ids=${coingeckoId}&vs_currencies=usd`)
      .then(r => r.json())
      .then(d => setCurrentPrice(d?.[coingeckoId]?.usd ?? null))
      .catch(() => {});
  }, [coingeckoId]);

  const amount = useCustom ? (parseFloat(customAmount) || 0) : selectedAmount;

  const fmt = (n: number) => {
    if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
    if (n >= 1_000) return `$${n.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
    return `$${n.toFixed(2)}`;
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-1">
        <TrendingUp size={20} className="text-accent" />
        <h2 className="text-xl font-bold text-foreground">
          {isRu ? `Что если бы я купил ${symbol}...` : `What if I had bought ${symbol}...`}
        </h2>
      </div>
      <p className="text-sm text-muted mb-6">
        {isRu ? `Текущая цена ${symbol}: ` : `Current ${symbol} price: `}
        <span className="font-semibold text-foreground">
          {currentPrice ? `$${currentPrice.toLocaleString('en-US', { maximumFractionDigits: currentPrice < 1 ? 4 : 2 })}` : '…'}
        </span>
      </p>

      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-widest text-muted mb-3">
          {isRu ? 'Сумма инвестиции' : 'Investment amount'}
        </p>
        <div className="flex flex-wrap gap-2">
          {INVESTMENT_AMOUNTS.map(amt => (
            <button
              key={amt}
              onClick={() => { setSelectedAmount(amt); setUseCustom(false); }}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                !useCustom && selectedAmount === amt
                  ? 'border-accent bg-accent/10 text-accent'
                  : 'border-border text-muted hover:text-foreground'
              }`}
            >
              ${amt.toLocaleString()}
            </button>
          ))}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm pointer-events-none">$</span>
            <input
              type="number"
              min="1"
              placeholder={isRu ? 'Своя сумма' : 'Custom'}
              value={customAmount}
              onChange={e => { setCustomAmount(e.target.value); setUseCustom(true); }}
              className="pl-7 pr-3 py-1.5 rounded-lg text-sm border border-border bg-background text-foreground w-32 focus:outline-none focus:border-accent transition-colors"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {reference.map(ref => {
          const bought = amount > 0 ? amount / ref.price : 0;
          const currentValue = currentPrice && amount > 0 ? bought * currentPrice : null;
          const profit = currentValue !== null ? currentValue - amount : null;
          const multiple = currentValue !== null && amount > 0 ? currentValue / amount : null;
          const isLoss = profit !== null && profit < 0;

          return (
            <div key={ref.yearsAgo} className="bg-background border border-border rounded-xl p-4 flex flex-col">
              <p className="text-xs font-semibold text-accent mb-0.5">
                {ref.label[isRu ? 'ru' : 'en']}
              </p>
              <p className="text-xs text-muted mb-3">{ref.note[isRu ? 'ru' : 'en']}</p>

              <div className="mb-2">
                <p className="text-xs text-muted">{isRu ? 'Цена тогда' : 'Price then'}</p>
                <p className="text-sm font-semibold text-foreground">
                  ${ref.price < 1 ? ref.price.toFixed(4) : ref.price.toLocaleString()}
                </p>
              </div>

              <div className="mb-3">
                <p className="text-xs text-muted">{isRu ? `Получено ${symbol}` : `${symbol} received`}</p>
                <p className="text-sm font-semibold text-foreground">
                  {amount > 0
                    ? bought < 0.001
                      ? bought.toFixed(6)
                      : bought.toFixed(4)
                    : '—'} {symbol}
                </p>
              </div>

              <div className="mt-auto pt-3 border-t border-border">
                <p className="text-xs text-muted mb-1">{isRu ? 'Стоимость сейчас' : 'Value now'}</p>
                {currentValue !== null ? (
                  <>
                    <p className={`text-2xl font-extrabold ${isLoss ? 'text-negative' : 'text-positive'}`}>
                      {fmt(currentValue)}
                    </p>
                    <p className="text-xs text-muted mt-1">
                      {isLoss ? '' : '+'}{fmt(profit!)}
                      {multiple !== null && (
                        <span className={`ml-2 font-bold ${isLoss ? 'text-negative' : 'text-positive'}`}>
                          ×{multiple.toFixed(1)}
                        </span>
                      )}
                    </p>
                  </>
                ) : (
                  <p className="text-2xl font-extrabold text-muted">…</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-muted mt-4 leading-relaxed">
        {isRu
          ? '* Расчёт приблизительный. Историческая цена — среднее значение за соответствующий период по данным CoinMarketCap/CoinGecko. Не является финансовой рекомендацией.'
          : '* Approximate calculation based on average historical price for the period (CoinMarketCap/CoinGecko data). Not financial advice.'}
      </p>
    </div>
  );
}
