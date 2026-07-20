import { fetchFearGreedIndex } from './feargreed';
import { fetchAltcoinSeasonIndex } from './altcoinSeason';
import { fetchRecentMarketSnapshots, saveMarketSnapshot } from './sanity';

// Our own composite index — the site's name literally is the metric.
// 40% Fear & Greed (sentiment) + 30% Altcoin Season (capital rotation risk
// appetite) + 30% 24h volume momentum (actual trading activity, not just
// mood) — see /pulse for the full public methodology write-up. Weights are
// deliberately simple and disclosed, not tuned/backtested; if they change,
// the change is disclosed on the page, not silently.
export const PULSE_WEIGHTS = { fearGreed: 0.4, altSeason: 0.3, volumeMomentum: 0.3 } as const;

export type PulseClassification = 'flatline' | 'warming' | 'steady' | 'heating' | 'peak';

export interface PulseData {
  score: number;
  classification: PulseClassification;
  components: {
    fearGreed: number;
    altSeason: number;
    volumeMomentum: number;
  };
  volumeChangePct: number;
  computedAt: string;
}

export function classifyPulse(score: number): PulseClassification {
  if (score <= 24) return 'flatline';
  if (score <= 44) return 'warming';
  if (score <= 55) return 'steady';
  if (score <= 74) return 'heating';
  return 'peak';
}

// 0% change → 50 (neutral); ±20% or more → 0/100. Linear between. 20% was
// picked as the clamp because single-day total-market volume swings beyond
// that are rare outside of genuine volatility spikes — see /pulse.
function volumeMomentumScore(changePct: number): number {
  const clamped = Math.max(-20, Math.min(20, changePct));
  return Math.round(50 + clamped * 2.5);
}

async function fetchGlobalVolume(): Promise<number | null> {
  try {
    const res = await fetch('https://api.coingecko.com/api/v3/global', { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const data = await res.json();
    const vol = data?.data?.total_volume?.usd;
    return typeof vol === 'number' ? vol : null;
  } catch {
    return null;
  }
}

// Runs once a day from the cron route. Reads up to 7 prior stored snapshots
// as the volume baseline — on the very first run (no history yet) it falls
// back to a neutral 0% change rather than dividing by nothing.
export async function computeAndStorePulse(): Promise<PulseData | null> {
  const [fg, altSeason, currentVolume] = await Promise.all([
    fetchFearGreedIndex(),
    fetchAltcoinSeasonIndex(),
    fetchGlobalVolume(),
  ]);
  if (!fg || !altSeason || currentVolume == null) return null;

  const recent = await fetchRecentMarketSnapshots(7);
  const baselineVolumes = recent.map((s) => s.totalVolume24h).filter((v) => typeof v === 'number');
  const baseline = baselineVolumes.length > 0
    ? baselineVolumes.reduce((a, b) => a + b, 0) / baselineVolumes.length
    : currentVolume;

  const volumeChangePct = baseline > 0 ? ((currentVolume - baseline) / baseline) * 100 : 0;
  const volScore = volumeMomentumScore(volumeChangePct);

  const score = Math.round(
    fg.value * PULSE_WEIGHTS.fearGreed +
    altSeason.index * PULSE_WEIGHTS.altSeason +
    volScore * PULSE_WEIGHTS.volumeMomentum
  );
  const classification = classifyPulse(score);
  const computedAt = new Date().toISOString();

  await saveMarketSnapshot({
    date: computedAt.slice(0, 10),
    totalVolume24h: currentVolume,
    fearGreedValue: fg.value,
    altSeasonValue: altSeason.index,
    volumeChangePct: Math.round(volumeChangePct * 10) / 10,
    pulseScore: score,
    pulseClassification: classification,
    computedAt,
  });

  return {
    score,
    classification,
    components: { fearGreed: fg.value, altSeason: altSeason.index, volumeMomentum: volScore },
    volumeChangePct: Math.round(volumeChangePct * 10) / 10,
    computedAt,
  };
}

export async function fetchLatestPulse(): Promise<PulseData | null> {
  const [latest] = await fetchRecentMarketSnapshots(1);
  if (!latest || typeof latest.pulseScore !== 'number') return null;
  return {
    score: latest.pulseScore,
    classification: (latest.pulseClassification as PulseClassification) ?? classifyPulse(latest.pulseScore),
    components: {
      fearGreed: latest.fearGreedValue,
      altSeason: latest.altSeasonValue,
      volumeMomentum: volumeMomentumScore(latest.volumeChangePct ?? 0),
    },
    volumeChangePct: latest.volumeChangePct ?? 0,
    computedAt: latest.computedAt,
  };
}
