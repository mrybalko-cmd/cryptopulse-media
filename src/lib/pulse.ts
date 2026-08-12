import { fetchFearGreedIndex } from './feargreed';
import { fetchRecentMarketSnapshots, saveMarketSnapshot } from './sanity';
import {
  PULSE_NORM_DAYS,
  altcoinScore,
  composeScore,
  computeWeekdayFactors,
  growthScore,
  isDollarPegged,
  isPlausibleVolume,
  median,
  volatilityScore,
  volumeScore,
  weekdayOf,
  zoneOf,
  type PulseZone,
} from './pulseMath';

// Re-exported so import sites don't need to know the arithmetic lives in its
// own module.
export {
  PULSE_WEIGHTS,
  PULSE_NORM_DAYS,
  PULSE_ZONES,
  zoneOf,
  zoneMeta,
  volumeScore,
  growthScore,
  volatilityScore,
  altcoinScore,
  composeScore,
  computeWeekdayFactors,
  isDollarPegged,
  isPlausibleVolume,
  median,
} from './pulseMath';
export type { PulseZone } from './pulseMath';

// Server renders wait on these. A third-party API that stalls must not be
// able to hold a page open indefinitely, so every call carries a deadline.
const UPSTREAM_TIMEOUT_MS = 10_000;

/** How many days the widget's bar chart shows. */
export const PULSE_CHART_DAYS = 90;

export interface PulseData {
  /** The reading itself, 0-100 absolute. 50 = normal market conditions. */
  score: number;
  zone: PulseZone;
  components: {
    volume: number;
    growth: number;
    volatility: number;
    fearGreed: number;
    altcoin: number | null;
  };
  /** Raw figures behind the components, so the page can show its work. */
  raw: {
    btcVolume24h: number;
    normVolume: number;
    priceChange24h: number;
    normAbsChange: number;
    altcoinMarginPp: number | null;
    altcoinCoins: number | null;
    weekdayFactor: number;
  };
  /** Where the index has actually been, for honest context on the page. */
  yearStats: { min: number; max: number; median: number; days: number } | null;
  history: { date: string; score: number }[];
  computedAt: string;
}

interface BtcDaily { date: string; price: number; volume: number }

/**
 * A year of Bitcoin daily price and turnover in one request.
 *
 * Bitcoin rather than the whole market because it is the only series with a
 * clean year behind it on the free tier: CoinGecko's /global endpoint has no
 * history, and the global figure correlated with Bitcoin's at only 0.51 over
 * our stored days with their ratio ranging 1.54-4.69 — so the two are not
 * interchangeable and the component is labelled for what it actually is.
 */
async function fetchBtcYear(): Promise<BtcDaily[]> {
  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=${PULSE_NORM_DAYS}&interval=daily`,
      { signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS), next: { revalidate: 21_600 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    const prices: [number, number][] = data?.prices ?? [];
    const volumes: [number, number][] = data?.total_volumes ?? [];
    if (prices.length === 0) return [];

    const volByDay = new Map<string, number>();
    for (const [ts, v] of volumes) volByDay.set(new Date(ts).toISOString().slice(0, 10), v);

    const byDay = new Map<string, BtcDaily>();
    for (const [ts, p] of prices) {
      const date = new Date(ts).toISOString().slice(0, 10);
      byDay.set(date, { date, price: p, volume: volByDay.get(date) ?? 0 });
    }
    return [...byDay.values()].sort((a, b) => a.date.localeCompare(b.date));
  } catch {
    return [];
  }
}

/**
 * Median 30-day outperformance of the typical altcoin versus Bitcoin, in
 * percentage points, from the same markets request the Altcoin Season page
 * already makes — no extra API cost.
 */
async function fetchAltcoinMargin(): Promise<{ marginPp: number; coins: number } | null> {
  try {
    const res = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=150&page=1&sparkline=false&price_change_percentage=24h,30d',
      { signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS), next: { revalidate: 21_600 } }
    );
    if (!res.ok) return null;
    const raw = await res.json();
    if (!Array.isArray(raw)) return null;

    const btc = raw.find((c) => c?.id === 'bitcoin');
    const btc30 = btc?.price_change_percentage_30d_in_currency;
    if (typeof btc30 !== 'number') return null;

    const margins: number[] = [];
    for (const c of raw) {
      if (c?.id === 'bitcoin') continue;
      const ch30 = c?.price_change_percentage_30d_in_currency;
      const ch24 = c?.price_change_percentage_24h_in_currency;
      if (typeof ch30 !== 'number') continue;
      if (isDollarPegged(c?.current_price, ch30, ch24)) continue;
      margins.push(ch30 - btc30);
      if (margins.length === 100) break;
    }
    if (margins.length < 30) return null;
    return { marginPp: Math.round(median(margins) * 100) / 100, coins: margins.length };
  } catch {
    return null;
  }
}

/**
 * Runs once a day from the cron route.
 *
 * Everything is anchored to a rolling year fetched fresh each run, so the
 * meaning of "normal" tracks the market rather than our own recording window.
 */
export async function computeAndStorePulse(): Promise<PulseData | null> {
  const [fg, btcYear, alt] = await Promise.all([
    fetchFearGreedIndex(),
    fetchBtcYear(),
    fetchAltcoinMargin(),
  ]);
  if (!fg || btcYear.length < 30) return null;

  const today = btcYear[btcYear.length - 1];
  const prev = btcYear[btcYear.length - 2];
  if (!today || !prev || !(prev.price > 0)) return null;

  const normVolume = median(btcYear.map((d) => d.volume).filter((v) => v > 0));
  // A glitched reading must not be published as a market state.
  if (!isPlausibleVolume(today.volume, normVolume)) return null;
  const factors = computeWeekdayFactors(btcYear.map((d) => ({ date: d.date, btcVolume24h: d.volume })));
  const weekdayFactor = factors[weekdayOf(today.date)] || 1;

  const changes = btcYear.slice(1).map((d, i) => (d.price / btcYear[i].price - 1) * 100);
  const normAbsChange = median(changes.map(Math.abs));
  const priceChange24h = Math.round(((today.price / prev.price - 1) * 100) * 100) / 100;

  const components = {
    volume: volumeScore(today.volume, weekdayFactor, normVolume),
    growth: growthScore(priceChange24h),
    volatility: volatilityScore(priceChange24h, normAbsChange),
    fearGreed: fg.value,
    altcoin: alt ? altcoinScore(alt.marginPp) : null,
  };
  const score = composeScore(components);
  const computedAt = new Date().toISOString();

  await saveMarketSnapshot({
    date: today.date,
    btcVolume24h: today.volume,
    normVolume,
    weekdayFactor: Math.round(weekdayFactor * 1000) / 1000,
    priceChange24h,
    normAbsChange: Math.round(normAbsChange * 1000) / 1000,
    altcoinMarginPp: alt?.marginPp ?? null,
    altcoinCoins: alt?.coins ?? null,
    volumeScore: components.volume,
    growthScore: components.growth,
    volatilityScore: components.volatility,
    fearGreedValue: components.fearGreed,
    altcoinScoreValue: components.altcoin,
    pulseScore: score,
    pulseZone: zoneOf(score),
    computedAt,
  });

  const history = await fetchRecentMarketSnapshots(PULSE_NORM_DAYS);
  return buildData(score, components, {
    btcVolume24h: today.volume,
    normVolume,
    priceChange24h,
    normAbsChange,
    altcoinMarginPp: alt?.marginPp ?? null,
    altcoinCoins: alt?.coins ?? null,
    weekdayFactor,
  }, history, computedAt);
}

function buildData(
  score: number,
  components: PulseData['components'],
  raw: PulseData['raw'],
  history: Awaited<ReturnType<typeof fetchRecentMarketSnapshots>>,
  computedAt: string
): PulseData {
  const scores = history.map((s) => s.pulseScore).filter((v): v is number => typeof v === 'number');
  return {
    score,
    zone: zoneOf(score),
    components,
    raw,
    yearStats: scores.length >= 30
      ? { min: Math.min(...scores), max: Math.max(...scores), median: Math.round(median(scores)), days: scores.length }
      : null,
    history: history
      .filter((s) => typeof s.pulseScore === 'number')
      .slice(0, PULSE_CHART_DAYS)
      .map((s) => ({ date: s.date, score: s.pulseScore }))
      .reverse(),
    computedAt,
  };
}

/** The reading every surface renders — reads the stored snapshot, no recompute. */
export async function fetchLatestPulse(): Promise<PulseData | null> {
  const history = await fetchRecentMarketSnapshots(PULSE_NORM_DAYS);
  const [latest] = history;
  if (!latest || typeof latest.pulseScore !== 'number') return null;

  return buildData(
    latest.pulseScore,
    {
      volume: latest.volumeScore ?? 50,
      growth: latest.growthScore ?? 50,
      volatility: latest.volatilityScore ?? 50,
      fearGreed: latest.fearGreedValue ?? 50,
      altcoin: latest.altcoinScoreValue ?? null,
    },
    {
      btcVolume24h: latest.btcVolume24h ?? 0,
      normVolume: latest.normVolume ?? 0,
      priceChange24h: latest.priceChange24h ?? 0,
      normAbsChange: latest.normAbsChange ?? 0,
      altcoinMarginPp: latest.altcoinMarginPp ?? null,
      altcoinCoins: latest.altcoinCoins ?? null,
      weekdayFactor: latest.weekdayFactor ?? 1,
    },
    history,
    latest.computedAt
  );
}
