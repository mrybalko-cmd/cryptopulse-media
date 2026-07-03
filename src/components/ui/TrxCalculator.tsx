'use client';

import { useEffect, useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { TRX_INVESTMENT_REFERENCE, INVESTMENT_AMOUNTS } from '@/lib/trxData';

export default function TrxCalculator({ locale }: { locale: string }) {
  const isRu = locale === 'ru';
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [selectedAmount, setSelectedAmount] = useState(1000);
  const [customAmount, setCustomAmount] = useState('');
  const [useCustom, setUseCustom] = useState(false);

  useEffect(() => {
    fetch('/api/price?ids=tron&vs_currencies=usd')
      .then(r => r.json())
      .then(d => setCurrentPrice(d?.tron?.usd ?? null))
      .catch(() => {});
  }, []);

  const amount = useCustom ? (parseFloat(customAmount) || 0) : selectedAmount;

  const fmt = (n: number) => {
    if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
    if (n >= 1_000) return `$${n.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
    return `$${n.toFixed(2)}`;
  };

  const fmtTokens = (n: number) => {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return n.toLocaleString('en-US', { maximumFractionDigits: 0 });
    return n.toFixed(0);
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-1">
        <TrendingUp size={20} className="text-accent" />
        <h2 className="text-xl font-bold text-foreground">
          {isRu ? 'Что если бы я купил TRX...' : 'What if I had bought TRX...'}
        </h2>
      </div>
      <p className="text-sm text-muted mb-6">
        {isRu ? 'Текущая цена TRX: ' : 'Current TRX price: '}
        <span className="font-semibold text-foreground">
          {currentPrice ? `$${currentPrice.toFixed(4)}` : '…'}
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {TRX_INVESTMENT_REFERENCE.map(ref => {
          const trxBought = amount > 0 ? amount / ref.price : 0;
          const currentValue = currentPrice && amount > 0 ? trxBought * currentPrice : null;
          const profit = currentValue !== null ? currentValue - amount : null;
          const multiple = currentValue !== null && amount > 0 ? currentValue / amount : null;
          const isLoss = profit !== null && profit < 0;

          return (
            <div key={ref.yearsAgo} className="bg-background border border-border rounded-xl p-4 flex flex-col">
              <p className="text-xs font-semibold text-accent mb-0.5">{ref.label[isRu ? 'ru' : 'en']}</p>
              <p className="text-xs text-muted mb-3">{ref.note[isRu ? 'ru' : 'en']}</p>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <p className="text-xs text-muted">{isRu ? 'Цена тогда' : 'Price then'}</p>
                  <p className="text-sm font-semibold text-foreground">${ref.price.toFixed(3)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted">{isRu ? 'Получено TRX' : 'TRX received'}</p>
                  <p className="text-sm font-semibold text-foreground">
                    {amount > 0 ? fmtTokens(trxBought) : '—'} TRX
                  </p>
                </div>
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
          ? '* Расчёт приблизительный. Исторические цены: 2019 г. — ~$0.025, 2021 г. — ~$0.065 (данные CoinMarketCap). Не является финансовой рекомендацией.'
          : '* Approximate calculation. Historical prices: 2019 — ~$0.025, 2021 — ~$0.065 (CoinMarketCap data). Not financial advice.'}
      </p>
    </div>
  );
}
