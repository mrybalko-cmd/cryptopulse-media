import { NextRequest, NextResponse } from 'next/server';
import { COIN_REGISTRY } from '@/lib/coinRegistry';
import { saveCoinQuotes, type StoredCoinQuote } from '@/lib/sanity';

/**
 * Stores the last good quote for every coin we publish a page for.
 *
 * One upstream call, on a schedule, instead of a burst during every build. The
 * pages prefer live data and fall back to this when the free tier refuses them
 * — which is what left several coin pages with no price at all.
 */
export async function GET(request: NextRequest) {
  const auth = request.headers.get('authorization');
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const ids = [...new Set(Object.values(COIN_REGISTRY).map((m) => m.id))].join(',');
  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&price_change_percentage=24h&per_page=250`,
      { signal: AbortSignal.timeout(15_000), cache: 'no-store' }
    );
    if (!res.ok) {
      return NextResponse.json({ ok: false, status: res.status }, { status: 502 });
    }
    const rows = await res.json();
    if (!Array.isArray(rows)) return NextResponse.json({ ok: false }, { status: 502 });

    const quotes: StoredCoinQuote[] = rows
      .filter((c) => c?.id && typeof c.current_price === 'number')
      .map((c) => ({
        coinId: c.id,
        price: c.current_price,
        change24h: c.price_change_percentage_24h ?? 0,
        marketCap: c.market_cap ?? 0,
        volume24h: c.total_volume ?? 0,
        ath: c.ath ?? 0,
        athChangePct: c.ath_change_percentage ?? 0,
        circulating: c.circulating_supply ?? null,
        maxSupply: c.max_supply ?? null,
        logo: c.image ?? '',
      }));

    await saveCoinQuotes(quotes);
    return NextResponse.json({ ok: true, stored: quotes.length });
  } catch {
    return NextResponse.json({ ok: false }, { status: 502 });
  }
}
