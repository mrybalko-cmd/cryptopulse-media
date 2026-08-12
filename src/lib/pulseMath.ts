// Pure arithmetic behind the Pulse index — no imports, no I/O.
//
// Isolated from pulse.ts so scripts/backfill-pulse.ts can import it directly
// under plain Node without pulling in Next's data layer. A historical row and
// a fresh one therefore go through literally the same functions rather than
// two implementations that drift apart.
//
// ── What this index means ───────────────────────────────────────────────────
// One absolute 0-100 number: how active is the crypto market today. 50 is
// normal market conditions, 100 is a market running hot, 0 is a market that
// has stopped. Every component is measured against the market's own long-run
// norm (a rolling year), NOT against our own recorded history — an earlier
// version ranked each day against 23 stored days, which made the quietest
// week of a quiet month look like a surge.
//
// The number describes ACTIVITY, not direction. A crash on record volume
// scores high (06.02.2026 = 67) and so does a rally (13.10.2025 = 89); the
// growth component and the summary sentence carry the direction. That is why
// no zone name may imply "up" — 20 of the 62 days in the 60-79 band over the
// past year were falling days.

export const PULSE_WEIGHTS = {
  volume: 0.40,
  growth: 0.20,
  volatility: 0.20,
  fearGreed: 0.10,
  altcoin: 0.10,
} as const;

/** Rolling window used to define "normal" volume and volatility. */
export const PULSE_NORM_DAYS = 365;

/** Volume this many times the norm reads as 100 (and 1/N of it as 0). */
const VOLUME_SPAN = 3;
/** Same idea for the size of the daily move. */
const VOLATILITY_SPAN = 4;
/** Daily price change of this size reads as 100 (and its negative as 0). */
const GROWTH_FULL_PCT = 5;
/** Median altcoin outperformance of this many points reads as 100. */
const ALTCOIN_FULL_PP = 20;

const MIN_OBSERVATIONS_PER_WEEKDAY = 4;
const FACTOR_MIN = 0.6;
const FACTOR_MAX = 1.6;

export type PulseZone = 'frozen' | 'quiet' | 'normal' | 'busy' | 'peak';

// Named for activity only. "Оживление"/"Разгон" would be a claim about
// direction that a one-dimensional activity number cannot support.
export const PULSE_ZONES: {
  zone: PulseZone; min: number; max: number; color: string;
  ru: string; en: string; ruDesc: string; enDesc: string;
}[] = [
  { zone: 'frozen', min: 0, max: 19, color: '#3b82f6',
    ru: 'Рынок замер', en: 'Market frozen',
    ruDesc: 'Оборот на дне, цена не движется. Часто предшествует накоплению.',
    enDesc: 'Turnover at its floor, price flat. Often precedes accumulation.' },
  { zone: 'quiet', min: 20, max: 39, color: '#06b6d4',
    ru: 'Затишье', en: 'Quiet',
    ruDesc: 'Активность ниже нормы. Движения слабые, интерес низкий.',
    enDesc: 'Activity below normal. Weak moves, low interest.' },
  { zone: 'normal', min: 40, max: 59, color: '#94a3b8',
    ru: 'Обычный режим', en: 'Normal',
    ruDesc: 'Рынок работает в своём привычном темпе.',
    enDesc: 'The market is running at its usual pace.' },
  { zone: 'busy', min: 60, max: 79, color: '#c084fc',
    ru: 'Высокая активность', en: 'High activity',
    ruDesc: 'Оборот и движения выше нормы. Направление смотрите отдельно — так же выглядят и сильный рост, и обвал.',
    enDesc: 'Turnover and moves above normal. Check direction separately — a rally and a crash look alike here.' },
  { zone: 'peak', min: 80, max: 100, color: '#ec4899',
    ru: 'Максимальная активность', en: 'Peak activity',
    ruDesc: 'Редкое состояние: рекордные обороты и резкие движения. За год таких дней единицы.',
    enDesc: 'Rare: record turnover and sharp moves. Only a handful of such days per year.' },
];

export interface VolumeDay {
  date: string;
  /** Bitcoin's own 24h turnover. Named explicitly: this is not the whole
   *  market. Over our stored days the global figure correlated with it at
   *  only 0.51 and their ratio ranged 1.54-4.69, so calling it "market
   *  volume" would be false. Bitcoin is used because it is the only series
   *  with a clean year of history behind it. */
  btcVolume24h: number;
}

export function zoneOf(score: number): PulseZone {
  return PULSE_ZONES.find((z) => score >= z.min && score <= z.max)?.zone ?? 'normal';
}

export function zoneMeta(zone: PulseZone) {
  return PULSE_ZONES.find((z) => z.zone === zone) ?? PULSE_ZONES[2];
}

const clamp = (v: number) => Math.max(0, Math.min(100, v));

/** 0 = Monday … 6 = Sunday, parsed as UTC to match how the cron stamps dates. */
export function weekdayOf(date: string): number {
  return (new Date(`${date}T00:00:00Z`).getUTCDay() + 6) % 7;
}

/**
 * Average turnover of each weekday relative to the overall average.
 *
 * Crypto volume has a weekly rhythm — Monday runs well below a typical day
 * and midweek above it — so without this correction every Monday reads as a
 * collapse and every Wednesday flatters itself. Computed over the full norm
 * window rather than a few weeks, so a single odd Tuesday cannot move it.
 */
export function computeWeekdayFactors(days: VolumeDay[]): number[] {
  const usable = days.filter((d) => typeof d.btcVolume24h === 'number' && d.btcVolume24h > 0);
  const neutral = [1, 1, 1, 1, 1, 1, 1];
  if (usable.length < MIN_OBSERVATIONS_PER_WEEKDAY * 7) return neutral;

  const overall = usable.reduce((s, d) => s + d.btcVolume24h, 0) / usable.length;
  if (!(overall > 0)) return neutral;

  const buckets: number[][] = [[], [], [], [], [], [], []];
  for (const d of usable) buckets[weekdayOf(d.date)].push(d.btcVolume24h);

  return buckets.map((values) => {
    if (values.length < MIN_OBSERVATIONS_PER_WEEKDAY) return 1;
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    return Math.min(FACTOR_MAX, Math.max(FACTOR_MIN, mean / overall));
  });
}

/**
 * Guard against upstream data glitches.
 *
 * Two days in the past year came back from CoinGecko at ~1% of the yearly
 * norm (0.34bn against 39bn) while the genuine yearly minimum is 33% of it.
 * Those are broken records, not quiet markets, and scoring them would put a
 * fabricated 14 at the bottom of the scale. Our published rule is that a day
 * with unavailable data is not published at all, so the same applies here.
 */
export function isPlausibleVolume(volume: number, normVolume: number): boolean {
  if (!(volume > 0) || !(normVolume > 0)) return false;
  return volume / normVolume >= 0.2;
}

export function median(values: number[]): number {
  if (values.length === 0) return 0;
  const s = [...values].sort((a, b) => a - b);
  const mid = s.length >> 1;
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

/**
 * Turnover against the norm for this weekday.
 *
 * Logarithmic because volume is multiplicative: three times the norm should
 * sit as far above 50 as a third of it sits below. A linear scale would put
 * "half the usual volume" and "twice the usual volume" at wildly unequal
 * distances from the middle.
 */
export function volumeScore(btcVolume: number, weekdayFactor: number, normVolume: number): number {
  if (!(btcVolume > 0) || !(normVolume > 0)) return 50;
  const ratio = (btcVolume / (weekdayFactor || 1)) / normVolume;
  return Math.round(clamp(50 + 50 * Math.log2(ratio) / Math.log2(VOLUME_SPAN)));
}

/** Daily price change. Flat = 50, +5% or more = 100, -5% or less = 0. */
export function growthScore(changePct: number): number {
  return Math.round(clamp(50 + (changePct / GROWTH_FULL_PCT) * 50));
}

/**
 * Size of the daily move against its yearly norm — a market standing still
 * is not an active market even when turnover looks respectable. Unsigned on
 * purpose: this measures how much is happening, not which way.
 */
export function volatilityScore(changePct: number, normAbsChange: number): number {
  if (!(normAbsChange > 0)) return 50;
  const ratio = Math.max(Math.abs(changePct) / normAbsChange, 0.05);
  return Math.round(clamp(50 + 50 * Math.log2(ratio) / Math.log2(VOLATILITY_SPAN)));
}

/**
 * How far the typical altcoin runs ahead of or behind Bitcoin over 30 days.
 *
 * A median margin, not a count of how many coins beat Bitcoin: the count is
 * a threshold tally, and when coins bunch up near Bitcoin's own return it
 * swings dozens of points on a 1-2% move in Bitcoin that changes nothing
 * about the market. On 12.08.2026 the count jumped 22 → 45 in a day while
 * the median moved one point.
 */
export function altcoinScore(medianMarginPp: number): number {
  return Math.round(clamp(50 + (medianMarginPp / ALTCOIN_FULL_PP) * 50));
}

export interface PulseComponents {
  volume: number;
  growth: number;
  volatility: number;
  fearGreed: number;
  /** Null when the altcoin margin could not be computed for that day; the
   *  remaining weights are renormalised rather than a value invented. */
  altcoin: number | null;
}

export function composeScore(c: PulseComponents): number {
  const parts: [number, number][] = [
    [c.volume, PULSE_WEIGHTS.volume],
    [c.growth, PULSE_WEIGHTS.growth],
    [c.volatility, PULSE_WEIGHTS.volatility],
    [c.fearGreed, PULSE_WEIGHTS.fearGreed],
  ];
  if (c.altcoin !== null) parts.push([c.altcoin, PULSE_WEIGHTS.altcoin]);
  const totalWeight = parts.reduce((s, [, w]) => s + w, 0);
  return Math.round(parts.reduce((s, [v, w]) => s + v * w, 0) / totalWeight);
}

/**
 * Dollar-pegged instruments to drop from the altcoin comparison.
 *
 * Detected by behaviour rather than by a list of names: the hand-kept
 * exclusion list went stale as tokenised treasuries entered the top 100, and
 * twelve of them — BlackRock's BUIDL, Ripple's RLUSD, Janus Henderson's JAAA
 * among them — were sitting in the index at exactly $1 and exactly 0.00%.
 * They took the places of real coins and bunched precisely at the threshold.
 * A list of names will go stale again; behaviour will not.
 */
export function isDollarPegged(price: number | null | undefined, change30d: number | null | undefined, change24h: number | null | undefined): boolean {
  if (typeof price !== 'number' || typeof change30d !== 'number') return false;
  if (!(price > 0.5 && price < 1.5)) return false;
  if (Math.abs(change30d) >= 2) return false;
  if (typeof change24h === 'number' && Math.abs(change24h) >= 0.5) return false;
  return true;
}
