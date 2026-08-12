import { fetchFearGreedIndex } from './feargreed';
import { fetchAltcoinSeasonIndex } from './altcoinSeason';
import { fetchRecentMarketSnapshots, saveMarketSnapshot } from './sanity';
import {
  PULSE_HISTORY_DAYS,
  adjustedVolumeChange,
  classifyPulse,
  composeScore,
  computeWeekdayFactors,
  percentileOf,
  volumeMomentumScore,
  zoneOf,
  type PulseClassification,
  type PulseZone,
} from './pulseMath';

// Re-exported so every existing import site keeps working unchanged and
// callers never need to know the arithmetic lives in its own module.
export {
  PULSE_WEIGHTS,
  PULSE_HISTORY_DAYS,
  PULSE_MIN_SAMPLE,
  PULSE_ZONES,
  classifyPulse,
  zoneOf,
  zoneMeta,
  volumeMomentumScore,
  percentileOf,
  computeWeekdayFactors,
  adjustedVolumeChange,
  composeScore,
} from './pulseMath';
export type { PulseClassification, PulseZone } from './pulseMath';

// Server renders wait on these. A third-party API that stalls must not be
// able to hold a page open indefinitely, so every call carries a deadline.
const UPSTREAM_TIMEOUT_MS = 8000;

export interface PulseData {
  /** Headline number: percentile rank of today's composite against stored
   *  history. Null until we have PULSE_MIN_SAMPLE days. */
  percentile: number | null;
  zone: PulseZone;
  /** Raw composite 0-100. Kept visible on the page so the method stays
   *  checkable, and used as the headline while the sample is still small. */
  score: number;
  /** Legacy raw-scale band. Still stored per snapshot for continuity with
   *  rows written before the percentile scale existed. */
  classification: PulseClassification;
  components: {
    fearGreed: number;
    altSeason: number;
    volumeMomentum: number;
  };
  /** Weekday-adjusted change vs the recent baseline — what the score uses. */
  volumeChangePct: number;
  /** Unadjusted change vs a plain 7-day mean — what we used to publish.
   *  Kept so the two can be compared in admin. */
  volumeChangePctRaw: number;
  /** Divisor applied to this day's volume: <1 for quiet weekdays. */
  weekdayFactor: number;
  /** How many stored days the percentile was ranked against. */
  sampleSize: number;
  /** Oldest-first, most recent CHART_DAYS entries — the bar chart. Ranked
   *  against the same series as the headline so chart and number agree. */
  history: { date: string; score: number; percentile: number | null }[];
  computedAt: string;
}

// How many days the widget's bar chart shows. Three weeks reads as "recent
// context" at 300px wide without the bars collapsing to hairlines.
export const PULSE_CHART_DAYS = 22;

async function fetchGlobalVolume(): Promise<number | null> {
  try {
    const res = await fetch('https://api.coingecko.com/api/v3/global', { signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS), next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const data = await res.json();
    const vol = data?.data?.total_volume?.usd;
    return typeof vol === 'number' ? vol : null;
  } catch {
    return null;
  }
}

// Runs once a day from the cron route. Reads recent history for two separate
// purposes: the weekday profile (long window) and the volume baseline
// (last week). On the very first run there is no history, so the weekday
// factors are all 1.0 and the change is 0% — neutral, not invented.
export async function computeAndStorePulse(): Promise<PulseData | null> {
  const [fg, altSeason, currentVolume] = await Promise.all([
    fetchFearGreedIndex(),
    fetchAltcoinSeasonIndex(),
    fetchGlobalVolume(),
  ]);
  if (!fg || !altSeason || currentVolume == null) return null;

  const computedAt = new Date().toISOString();
  const date = computedAt.slice(0, 10);

  const history = await fetchRecentMarketSnapshots(PULSE_HISTORY_DAYS);
  const prior = history.filter((s) => s.date !== date);
  const factors = computeWeekdayFactors([...prior, { date, totalVolume24h: currentVolume }]);

  const { changePct, rawChangePct, weekdayFactor } = adjustedVolumeChange(
    { date, totalVolume24h: currentVolume },
    prior,
    factors
  );

  const { score, volumeMomentum } = composeScore(fg.value, altSeason.index, changePct);
  const classification = classifyPulse(score);

  const series = [...prior.map((s) => s.pulseScore).filter((v) => typeof v === 'number'), score];
  const percentile = percentileOf(score, series);

  await saveMarketSnapshot({
    date,
    totalVolume24h: currentVolume,
    fearGreedValue: fg.value,
    altSeasonValue: altSeason.index,
    volumeChangePct: changePct,
    volumeChangePctRaw: rawChangePct,
    weekdayFactor,
    pulseScore: score,
    pulseClassification: classification,
    computedAt,
  });

  return {
    percentile,
    zone: zoneOf(percentile ?? 50),
    score,
    classification,
    components: { fearGreed: fg.value, altSeason: altSeason.index, volumeMomentum },
    volumeChangePct: changePct,
    volumeChangePctRaw: rawChangePct,
    weekdayFactor,
    sampleSize: series.length,
    history: [...prior]
      .filter((s) => typeof s.pulseScore === 'number')
      .slice(0, PULSE_CHART_DAYS - 1)
      .map((s) => ({ date: s.date, score: s.pulseScore, percentile: percentileOf(s.pulseScore, series) }))
      .reverse()
      .concat([{ date, score, percentile }]),
    computedAt,
  };
}

/**
 * The reading every surface renders.
 *
 * The percentile is computed here rather than stored, because it is a
 * statement about the whole history, not about one day — a value stored on
 * 20 July would silently go stale as the record around it grew. The stored
 * fields are only point-in-time facts.
 */
export async function fetchLatestPulse(): Promise<PulseData | null> {
  const history = await fetchRecentMarketSnapshots(PULSE_HISTORY_DAYS);
  const [latest] = history;
  if (!latest || typeof latest.pulseScore !== 'number') return null;

  const series = history.map((s) => s.pulseScore).filter((v) => typeof v === 'number');
  const percentile = percentileOf(latest.pulseScore, series);
  const volumeChangePct = latest.volumeChangePct ?? 0;

  return {
    percentile,
    zone: zoneOf(percentile ?? 50),
    score: latest.pulseScore,
    classification: (latest.pulseClassification as PulseClassification) ?? classifyPulse(latest.pulseScore),
    components: {
      fearGreed: latest.fearGreedValue,
      altSeason: latest.altSeasonValue,
      volumeMomentum: volumeMomentumScore(volumeChangePct),
    },
    volumeChangePct,
    volumeChangePctRaw: latest.volumeChangePctRaw ?? volumeChangePct,
    weekdayFactor: latest.weekdayFactor ?? 1,
    sampleSize: series.length,
    // Built from the history already in hand — the chart costs no extra query.
    history: history
      .filter((s) => typeof s.pulseScore === 'number')
      .slice(0, PULSE_CHART_DAYS)
      .map((s) => ({ date: s.date, score: s.pulseScore, percentile: percentileOf(s.pulseScore, series) }))
      .reverse(),
    computedAt: latest.computedAt,
  };
}
