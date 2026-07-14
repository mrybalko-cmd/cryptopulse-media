import Link from 'next/link';
import { TrendingUp, TrendingDown, Coins } from 'lucide-react';
import { COINS, fetchTopAssetPrices } from '@/lib/coins';

// Compact live-price panel, also used on the homepage as a grid cell that's
// meant to match a sibling row's height exactly (see page.tsx: it sits next
// to row 2's compact cards with `h-full`, so the grid's own stretch makes
// this card exactly as tall as that row, no taller/shorter) — `flex flex-col`
// plus `mt-auto` on the closing link keeps it pinned to the bottom instead
// of floating right under the last price row when there's extra height.
// `slugs` picks which coins to show and in what order.
export default async function TopAssetsWidget({
  slugs,
  locale,
  className = '',
}: {
  slugs: string[];
  locale: string;
  className?: string;
}) {
  const coins = slugs.map(slug => COINS.find(c => c.slug === slug)).filter((c): c is NonNullable<typeof c> => !!c);
  const prices = await fetchTopAssetPrices(coins.map(c => c.coingeckoId));
  const isRu = locale === 'ru';

  return (
    <div className={`bg-card border border-border rounded-lg p-4 flex flex-col ${className}`}>
      <h2 className="flex items-center gap-2 text-sm font-bold text-foreground mb-4">
        <Coins size={18} className="text-accent" />
        {isRu ? 'Курсы криптовалют' : 'Crypto Prices'}
      </h2>
      <div className="flex flex-col gap-3">
        {coins.map(coin => {
          const snapshot = prices[coin.coingeckoId];
          const isPositive = (snapshot?.price_change_percentage_24h ?? 0) >= 0;
          return (
            <Link
              key={coin.slug}
              href={`/${locale}/assets/${coin.slug}`}
              className="group flex items-center justify-between gap-2"
            >
              <span className="flex items-center gap-2 min-w-0">
                <span className="text-base font-bold text-accent shrink-0 w-5 text-center">{coin.icon}</span>
                <span className="text-xs font-semibold text-foreground group-hover:text-accent transition-colors truncate">
                  {coin.symbol}
                </span>
              </span>
              {snapshot ? (
                <span className="flex items-center gap-1.5 shrink-0">
                  <span className="text-xs font-mono text-foreground">
                    ${snapshot.current_price.toLocaleString('en-US', { maximumFractionDigits: snapshot.current_price < 1 ? 4 : 2 })}
                  </span>
                  <span className={`flex items-center gap-0.5 text-[10px] font-mono ${isPositive ? 'text-positive' : 'text-negative'}`}>
                    {isPositive ? <TrendingUp size={9} /> : <TrendingDown size={9} />}
                    {isPositive ? '+' : ''}{snapshot.price_change_percentage_24h.toFixed(1)}%
                  </span>
                </span>
              ) : (
                <span className="text-[10px] text-muted shrink-0">—</span>
              )}
            </Link>
          );
        })}
      </div>
      <Link
        href={`/${locale}/assets`}
        className="block text-xs text-accent hover:underline mt-auto pt-3 border-t border-border"
      >
        {isRu ? 'Все крипто-активы →' : 'All crypto assets →'}
      </Link>
    </div>
  );
}
