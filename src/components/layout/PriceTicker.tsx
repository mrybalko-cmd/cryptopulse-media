'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface CoinPrice {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
}

const COINS = ['bitcoin', 'ethereum', 'solana', 'binancecoin', 'ripple', 'cardano', 'avalanche-2', 'polkadot'];

export default function PriceTicker() {
  const [prices, setPrices] = useState<CoinPrice[]>([]);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await fetch(
          `/api/market?ids=${COINS.join(',')}`,
          { next: { revalidate: 60 } }
        );
        if (res.ok) {
          const data = await res.json();
          setPrices(data);
        }
      } catch {}
    };
    fetchPrices();
    const interval = setInterval(fetchPrices, 60000);
    return () => clearInterval(interval);
  }, []);

  if (!prices.length) return (
    <div className="h-9 bg-card border-b border-border flex items-center px-4">
      <span className="text-muted text-xs">Loading prices...</span>
    </div>
  );

  const items = [...prices, ...prices];

  return (
    <div className="h-9 bg-card border-b border-border overflow-hidden flex items-center">
      <div className="flex ticker-animate whitespace-nowrap">
        {items.map((coin, i) => {
          const isPositive = coin.price_change_percentage_24h >= 0;
          return (
            <div key={`${coin.id}-${i}`} className="flex items-center gap-1.5 px-5 border-r border-border">
              <span className="text-xs font-medium text-foreground uppercase tracking-wide">
                {coin.symbol}
              </span>
              <span className="text-xs font-mono text-foreground">
                ${coin.current_price.toLocaleString('en-US', { maximumFractionDigits: 2 })}
              </span>
              <span className={`flex items-center gap-0.5 text-xs font-mono ${isPositive ? 'text-positive' : 'text-negative'}`}>
                {isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                {isPositive ? '+' : ''}{coin.price_change_percentage_24h.toFixed(2)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
