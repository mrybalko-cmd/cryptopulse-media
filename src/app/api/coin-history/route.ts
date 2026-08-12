import { NextRequest, NextResponse } from 'next/server';
import { coinMeta } from '@/lib/coinRegistry';
import { HISTORY_DAYS } from '@/lib/coinMarket';

/**
 * A year of daily closes for one coin, proxied and cached.
 *
 * This exists to keep the price history off the build path. Fetching it during
 * static generation meant 24 upstream calls in a burst, the free tier's rate
 * limit swallowed most of them, and the attempt to wait it out pushed pages
 * past Vercel's per-page build budget and failed the deployment. The chart and
 * the regular-purchase mode both sit below the fold, so the client can ask for
 * this after the page has painted — and the answer is cached for six hours, so
 * one visitor's request serves everyone else's.
 */
export const revalidate = 21_600;

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get('slug');
  if (!slug) return NextResponse.json({ error: 'slug required' }, { status: 400 });

  const meta = coinMeta(slug);
  if (!meta) return NextResponse.json({ error: 'unknown coin' }, { status: 404 });

  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/coins/${meta.id}/market_chart?vs_currency=usd&days=${HISTORY_DAYS}&interval=daily`,
      { signal: AbortSignal.timeout(12_000), next: { revalidate: 21_600 } }
    );
    if (!res.ok) {
      // Upstream said no — say so plainly and let the client leave the chart
      // out rather than draw something invented.
      return NextResponse.json({ history: [] }, { status: 200, headers: shortCache() });
    }
    const data = await res.json();
    const prices: [number, number][] = data?.prices ?? [];
    const byDay = new Map<string, number>();
    for (const [ts, p] of prices) {
      if (typeof p === 'number' && p > 0) byDay.set(new Date(ts).toISOString().slice(0, 10), p);
    }
    const history = [...byDay.entries()]
      .map(([date, price]) => ({ date, price }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return NextResponse.json({ history }, { headers: longCache() });
  } catch {
    return NextResponse.json({ history: [] }, { status: 200, headers: shortCache() });
  }
}

/** A good answer is worth holding for six hours: daily closes change once a day. */
function longCache() {
  return { 'Cache-Control': 'public, s-maxage=21600, stale-while-revalidate=86400' };
}

/** A failed one is worth holding for a minute, so a rate limit does not turn
 *  into an empty chart for the rest of the day. */
function shortCache() {
  return { 'Cache-Control': 'public, s-maxage=60' };
}
