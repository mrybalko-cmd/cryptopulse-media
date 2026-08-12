// Pure arithmetic behind the Pulse index — no imports, no I/O.
//
// Deliberately isolated from pulse.ts so the backfill script
// (scripts/backfill-pulse.ts) can import this file directly under plain
// Node without pulling in Next's data layer. A historical row and a fresh
// one therefore go through literally the same functions rather than two
// implementations that drift apart.

// 40% Fear & Greed (sentiment) + 30% Altcoin Season (capital rotation risk
// appetite) + 30% volume momentum (actual trading activity, not just mood).
// Weights are deliberately simple and disclosed, not tuned/backtested; if
// they change, the change is disclosed on /pulse, not silently.
export const PULSE_WEIGHTS = { fearGreed: 0.4, altSeason: 0.3, volumeMomentum: 0.3 } as const;

// How far back we look for both the weekday profile and the percentile
// ranking. Long enough that a quiet fortnight doesn't redefine "normal",
// short enough that a bull run from six months ago stops distorting today.
export const PULSE_HISTORY_DAYS = 180;

// Below this many stored days a percentile is noise, not information — the
// widget shows the raw composite alone and says so rather than dressing up
// a three-day sample as a 0-100 ranking.
export const PULSE_MIN_SAMPLE = 14;

// Volume baseline window, in prior days, once weekday adjustment is applied.
export const VOLUME_BASELINE_DAYS = 7;

// A weekday needs this many observations before its factor is trusted;
// anything thinner falls back to 1.0 (no adjustment) so a single outlier
// Tuesday can't rewrite every Tuesday.
const MIN_OBSERVATIONS_PER_WEEKDAY = 2;

// Even with enough observations, the correction is capped. Real weekday
// effects in crypto volume sit around ±25%; anything past this range is far
// more likely to be a data gap than a genuine calendar pattern.
const FACTOR_MIN = 0.6;
const FACTOR_MAX = 1.6;

export type PulseClassification = 'flatline' | 'warming' | 'steady' | 'heating' | 'peak';

// Percentile-based zones. Deliberately even 20-point bands: because the
// input is a percentile, each zone is reachable roughly a fifth of the time
// by construction. The previous raw-score zones could not do this — over the
// first 22 days the composite never once exceeded 51, so "heating" and
// "peak" were unreachable in principle, not merely unobserved.
export type PulseZone = 'calm' | 'quiet' | 'normal' | 'lively' | 'surge';

export const PULSE_ZONES: { zone: PulseZone; min: number; max: number; color: string; ru: string; en: string }[] = [
  { zone: 'calm',   min: 0,   max: 19,  color: '#3b82f6', ru: 'Штиль',        en: 'Flatline' },
  { zone: 'quiet',  min: 20,  max: 39,  color: '#06b6d4', ru: 'Спокойно',     en: 'Quiet' },
  { zone: 'normal', min: 40,  max: 59,  color: '#94a3b8', ru: 'Обычный день', en: 'Normal day' },
  { zone: 'lively', min: 60,  max: 79,  color: '#c084fc', ru: 'Оживление',    en: 'Lively' },
  { zone: 'surge',  min: 80,  max: 100, color: '#ec4899', ru: 'Всплеск',      en: 'Surge' },
];

export interface VolumeDay {
  date: string;
  totalVolume24h: number;
}

/** Legacy raw-scale band. Still written per snapshot for continuity with
 *  rows created before the percentile scale existed. */
export function classifyPulse(score: number): PulseClassification {
  if (score <= 24) return 'flatline';
  if (score <= 44) return 'warming';
  if (score <= 55) return 'steady';
  if (score <= 74) return 'heating';
  return 'peak';
}

export function zoneOf(percentile: number): PulseZone {
  return PULSE_ZONES.find((z) => percentile >= z.min && percentile <= z.max)?.zone ?? 'normal';
}

export function zoneMeta(zone: PulseZone) {
  return PULSE_ZONES.find((z) => z.zone === zone) ?? PULSE_ZONES[2];
}

// 0% change → 50 (neutral); ±20% or more → 0/100. Linear between. 20% was
// picked as the clamp because single-day total-market volume swings beyond
// that are rare outside of genuine volatility spikes — see /pulse.
export function volumeMomentumScore(changePct: number): number {
  const clamped = Math.max(-20, Math.min(20, changePct));
  return Math.round(50 + clamped * 2.5);
}

/** 0 = Monday … 6 = Sunday. Parsed as UTC to match how the cron stamps dates. */
export function weekdayOf(date: string): number {
  const day = new Date(`${date}T00:00:00Z`).getUTCDay();
  return (day + 6) % 7;
}

/**
 * Average volume of each weekday relative to the overall average.
 *
 * Crypto volume has a strong weekly rhythm: over our own first 22 days,
 * Monday averaged 0.72 of a typical day and Wednesday 1.15. Comparing every
 * day against a plain 7-day mean therefore made every Monday read as a
 * market collapse and flattered every Wednesday — the index was partly
 * measuring the calendar. Dividing each day's volume by its weekday factor
 * removes that before anything else is computed.
 */
export function computeWeekdayFactors(snapshots: VolumeDay[]): number[] {
  const usable = snapshots.filter((s) => typeof s.totalVolume24h === 'number' && s.totalVolume24h > 0);
  const neutral = [1, 1, 1, 1, 1, 1, 1];
  if (usable.length < MIN_OBSERVATIONS_PER_WEEKDAY * 2) return neutral;

  const overall = usable.reduce((sum, s) => sum + s.totalVolume24h, 0) / usable.length;
  if (!(overall > 0)) return neutral;

  const buckets: number[][] = [[], [], [], [], [], [], []];
  for (const s of usable) buckets[weekdayOf(s.date)].push(s.totalVolume24h);

  return buckets.map((values) => {
    if (values.length < MIN_OBSERVATIONS_PER_WEEKDAY) return 1;
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    return Math.min(FACTOR_MAX, Math.max(FACTOR_MIN, mean / overall));
  });
}

/**
 * Share of stored days that were no busier than this one, 0-100.
 *
 * The raw composite lives in a narrow corridor (18-38 across our first 22
 * days once the weekday artefact is removed), which makes it useless as a
 * headline: three of five zones can never be reached. A percentile uses the
 * whole scale honestly and answers the question a reader actually has —
 * is today busier than usual?
 */
export function percentileOf(score: number, series: number[]): number | null {
  if (series.length < PULSE_MIN_SAMPLE) return null;
  const atOrBelow = series.filter((v) => v <= score).length;
  return Math.round((atOrBelow / series.length) * 100);
}

/** Recompose the 0-100 composite from a day's raw inputs. */
export function composeScore(fearGreed: number, altSeason: number, volumeChangePct: number) {
  const volumeMomentum = volumeMomentumScore(volumeChangePct);
  const score = Math.round(
    fearGreed * PULSE_WEIGHTS.fearGreed +
    altSeason * PULSE_WEIGHTS.altSeason +
    volumeMomentum * PULSE_WEIGHTS.volumeMomentum
  );
  return { score, volumeMomentum };
}

/**
 * Weekday-adjusted volume change for `current`, against the most recent
 * VOLUME_BASELINE_DAYS of prior snapshots. `prior` must be newest-first and
 * must not include the day being computed.
 */
export function adjustedVolumeChange(
  current: VolumeDay,
  prior: VolumeDay[],
  factors: number[]
): { changePct: number; rawChangePct: number; weekdayFactor: number } {
  const weekdayFactor = factors[weekdayOf(current.date)] || 1;
  const window = prior
    .slice(0, VOLUME_BASELINE_DAYS)
    .filter((s) => typeof s.totalVolume24h === 'number' && s.totalVolume24h > 0);

  const rounded = Math.round(weekdayFactor * 1000) / 1000;
  if (window.length === 0) return { changePct: 0, rawChangePct: 0, weekdayFactor: rounded };

  const rawBaseline = window.reduce((sum, s) => sum + s.totalVolume24h, 0) / window.length;
  const rawChangePct = rawBaseline > 0 ? ((current.totalVolume24h - rawBaseline) / rawBaseline) * 100 : 0;

  const adjustedNow = current.totalVolume24h / weekdayFactor;
  const adjustedBaseline =
    window.reduce((sum, s) => sum + s.totalVolume24h / (factors[weekdayOf(s.date)] || 1), 0) / window.length;
  const changePct = adjustedBaseline > 0 ? ((adjustedNow - adjustedBaseline) / adjustedBaseline) * 100 : 0;

  return {
    changePct: Math.round(changePct * 10) / 10,
    rawChangePct: Math.round(rawChangePct * 10) / 10,
    weekdayFactor: rounded,
  };
}
