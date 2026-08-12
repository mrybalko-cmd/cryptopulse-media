import { COIN_REGISTRY, coinMeta } from './coinRegistry';

const UPSTREAM_TIMEOUT_MS = 10_000;

/**
 * How far back the investment calculator can reach.
 *
 * Exactly 365 — not a round number we chose but the ceiling of the free
 * CoinGecko tier: `days=366` already answers 401. The page says so out loud
 * rather than quietly starting the chart wherever the data happens to run out.
 */
export const HISTORY_DAYS = 365;

export interface CoinMarket {
  price: number;
  change24h: number;
  marketCap: number;
  volume24h: number;
  ath: number;
  athChangePct: number;
  circulating: number | null;
  maxSupply: number | null;
  logo: string;
  updatedAt: string;
}

export interface CoinHistoryPoint {
  date: string;
  price: number;
}

/**
 * Every coin's quote in one request.
 *
 * Deliberately batched: asking per page meant 24 requests during a build, and
 * the free tier's rate limit answered the last eight of them with nothing —
 * those pages rendered without a logo, a price or a chart. One request for the
 * whole registry costs the same as one for a single coin.
 */
async function fetchAllMarkets(): Promise<Map<string, CoinMarket>> {
  const ids = [...new Set(Object.values(COIN_REGISTRY).map((m) => m.id))].join(',');
  const out = new Map<string, CoinMarket>();
  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&price_change_percentage=24h&per_page=250`,
      { signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS), next: { revalidate: 900 } }
    );
    if (!res.ok) return out;
    const rows = await res.json();
    if (!Array.isArray(rows)) return out;
    for (const c of rows) {
      if (!c?.id || typeof c.current_price !== 'number') continue;
      out.set(c.id, {
        price: c.current_price,
        change24h: c.price_change_percentage_24h ?? 0,
        marketCap: c.market_cap ?? 0,
        volume24h: c.total_volume ?? 0,
        ath: c.ath ?? 0,
        athChangePct: c.ath_change_percentage ?? 0,
        circulating: c.circulating_supply ?? null,
        maxSupply: c.max_supply ?? null,
        logo: c.image ?? '',
        updatedAt: new Date().toISOString(),
      });
    }
  } catch {
    // a missing quote degrades the page, it does not break it
  }
  return out;
}

/** Live quote plus the logo for one coin, served from the batched request. */
export async function fetchCoinMarket(slug: string): Promise<CoinMarket | null> {
  const meta = coinMeta(slug);
  if (!meta) return null;
  const all = await fetchAllMarkets();
  const hit = all.get(meta.id);
  if (hit) return hit;
  // Single-coin fallback for the case where the batch itself was rate-limited.
  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${meta.id}&price_change_percentage=24h`,
      { signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS), next: { revalidate: 900 } }
    );
    if (!res.ok) return null;
    const [c] = await res.json();
    if (!c || typeof c.current_price !== 'number') return null;
    return {
      price: c.current_price,
      change24h: c.price_change_percentage_24h ?? 0,
      marketCap: c.market_cap ?? 0,
      volume24h: c.total_volume ?? 0,
      ath: c.ath ?? 0,
      athChangePct: c.ath_change_percentage ?? 0,
      circulating: c.circulating_supply ?? null,
      maxSupply: c.max_supply ?? null,
      logo: c.image ?? '',
      updatedAt: new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

/**
 * A year of daily closes — the deepest the free tier serves.
 *
 * This one cannot be batched: the chart endpoint takes a single coin. Twenty-four
 * of them in a row during a build walks straight into the rate limit, so a 429
 * waits and retries rather than silently leaving the page without a chart.
 */
export async function fetchCoinHistory(slug: string): Promise<CoinHistoryPoint[]> {
  const meta = coinMeta(slug);
  if (!meta) return [];
  try {
    const url = `https://api.coingecko.com/api/v3/coins/${meta.id}/market_chart?vs_currency=usd&days=${HISTORY_DAYS}&interval=daily`;
    let res = await fetch(url, { signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS), next: { revalidate: 21_600 } });
    for (let attempt = 0; attempt < 3 && res.status === 429; attempt++) {
      await new Promise((r) => setTimeout(r, 20_000 * (attempt + 1)));
      res = await fetch(url, { signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS), next: { revalidate: 21_600 } });
    }
    if (!res.ok) return [];
    const data = await res.json();
    const prices: [number, number][] = data?.prices ?? [];
    const byDay = new Map<string, number>();
    for (const [ts, p] of prices) {
      if (typeof p === 'number' && p > 0) byDay.set(new Date(ts).toISOString().slice(0, 10), p);
    }
    return [...byDay.entries()]
      .map(([date, price]) => ({ date, price }))
      .sort((a, b) => a.date.localeCompare(b.date));
  } catch {
    return [];
  }
}

export interface DcaRun {
  /** First purchase date, YYYY-MM-DD. */
  from: string;
  purchases: number;
  invested: number;
  valueNow: number;
  changePct: number;
  /** The day the position was furthest underwater, and how far. This is the
   *  number the widget exists to show: every calculator of this kind reports
   *  the happy ending, and the ending is only reachable by someone who held
   *  through this day. */
  worst: { date: string; invested: number; value: number; pct: number } | null;
  /** Same money committed in one go on `from`, for comparison. */
  lumpValueNow: number;
  /** Sampled for the chart: invested-to-date against what it was worth. */
  series: { date: string; invested: number; value: number }[];
}

/** First available trading day of each month in the window. */
export function monthlyBuyDates(history: CoinHistoryPoint[]): string[] {
  const firsts = new Map<string, string>();
  for (const h of history) {
    const key = h.date.slice(0, 7);
    if (!firsts.has(key)) firsts.set(key, h.date);
  }
  return [...firsts.values()].sort();
}

/**
 * Simulate buying `perMonth` on the first available day of every month from
 * `from` onwards. Purely arithmetic over the fetched series — no assumptions,
 * no smoothing, and fees are not modelled (the page says so).
 */
export function simulateDca(
  history: CoinHistoryPoint[],
  from: string,
  perMonth: number,
  maxPoints = 80
): DcaRun | null {
  if (history.length < 30 || perMonth <= 0) return null;
  const priceOn = new Map(history.map((h) => [h.date, h.price]));
  const buys = monthlyBuyDates(history).filter((d) => d >= from);
  if (buys.length === 0) return null;

  const window = history.filter((h) => h.date >= buys[0]);
  const nowPrice = window[window.length - 1]?.price;
  if (!nowPrice) return null;

  let invested = 0;
  let coins = 0;
  let next = 0;
  const full: DcaRun['series'] = [];
  let worst: DcaRun['worst'] = null;

  for (const point of window) {
    while (next < buys.length && buys[next] <= point.date) {
      const p = priceOn.get(buys[next])!;
      invested += perMonth;
      coins += perMonth / p;
      next++;
    }
    const value = coins * point.price;
    full.push({ date: point.date, invested, value });
    if (invested > 0) {
      const pct = ((value - invested) / invested) * 100;
      if (!worst || pct < worst.pct) {
        worst = { date: point.date, invested, value: Math.round(value * 100) / 100, pct: Math.round(pct * 10) / 10 };
      }
    }
  }

  const valueNow = coins * nowPrice;
  const step = Math.max(1, Math.ceil(full.length / maxPoints));
  const series = full.filter((_, i) => i % step === 0);
  if (series[series.length - 1] !== full[full.length - 1]) series.push(full[full.length - 1]);

  return {
    from: buys[0],
    purchases: buys.length,
    invested,
    valueNow: Math.round(valueNow * 100) / 100,
    changePct: Math.round(((valueNow - invested) / invested) * 1000) / 10,
    worst,
    lumpValueNow: Math.round((invested / priceOn.get(buys[0])!) * nowPrice * 100) / 100,
    series: series.map((s) => ({
      date: s.date,
      invested: s.invested,
      value: Math.round(s.value * 100) / 100,
    })),
  };
}

/** Start options offered in the widget: every other month back to the limit. */
export function startOptions(history: CoinHistoryPoint[]): string[] {
  const months = monthlyBuyDates(history);
  // Two months is the shortest run worth simulating; below that a "regular"
  // purchase is just one purchase with extra steps.
  const usable = months.slice(0, Math.max(1, months.length - 2));
  const picked = usable.filter((_, i) => i % 2 === 0);
  if (picked[0] !== usable[0]) picked.unshift(usable[0]);
  return picked.slice(0, 6);
}
