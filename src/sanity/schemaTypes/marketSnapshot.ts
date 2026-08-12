import { defineField, defineType } from 'sanity';

// Written once a day by the /api/cron/pulse-snapshot job — not meant to be
// edited by hand in Studio, just a data log powering the Market Pulse
// widget/page. Kept as a real document type (not a singleton) so history
// accumulates.
//
// Both the raw inputs and the derived component scores are stored. The raw
// inputs are the point-in-time facts; the scores are kept alongside so the
// admin log can show how a day was actually scored without re-deriving it
// against today's norms — the norms move as the rolling year moves.
export const marketSnapshotType = defineType({
  name: 'marketSnapshot',
  title: 'Market Snapshot (auto)',
  type: 'document',
  fields: [
    defineField({ name: 'date', title: 'Date', type: 'string', readOnly: true }),

    // ── raw inputs ──
    defineField({ name: 'btcVolume24h', title: 'Bitcoin 24h turnover (USD)', type: 'number', readOnly: true }),
    defineField({ name: 'normVolume', title: 'Turnover norm — median of rolling year (USD)', type: 'number', readOnly: true }),
    defineField({ name: 'weekdayFactor', title: 'Weekday turnover factor applied', type: 'number', readOnly: true }),
    defineField({ name: 'priceChange24h', title: 'Bitcoin price change 24h (%)', type: 'number', readOnly: true }),
    defineField({ name: 'normAbsChange', title: 'Daily move norm — median of rolling year (%)', type: 'number', readOnly: true }),
    defineField({ name: 'altcoinMarginPp', title: 'Median altcoin margin vs Bitcoin, 30d (pp)', type: 'number', readOnly: true }),
    defineField({ name: 'altcoinCoins', title: 'Altcoins in the margin calculation', type: 'number', readOnly: true }),

    // ── component scores, each 0-100 with 50 = normal ──
    defineField({ name: 'volumeScore', title: 'Component: turnover', type: 'number', readOnly: true }),
    defineField({ name: 'growthScore', title: 'Component: price growth', type: 'number', readOnly: true }),
    defineField({ name: 'volatilityScore', title: 'Component: volatility', type: 'number', readOnly: true }),
    defineField({ name: 'fearGreedValue', title: 'Component: Fear & Greed', type: 'number', readOnly: true }),
    defineField({ name: 'altcoinScoreValue', title: 'Component: altcoin margin', type: 'number', readOnly: true }),

    defineField({ name: 'pulseScore', title: 'Pulse score (0-100, 50 = normal)', type: 'number', readOnly: true }),
    defineField({ name: 'pulseZone', title: 'Pulse zone', type: 'string', readOnly: true }),
    // Rows rebuilt by scripts/backfill-pulse.ts from historical price and
    // sentiment data rather than recorded live. Flagged so the admin log
    // never presents a reconstruction as a live measurement.
    defineField({ name: 'reconstructed', title: 'Rebuilt from historical data', type: 'boolean', readOnly: true }),
    defineField({ name: 'computedAt', title: 'Computed at', type: 'datetime', readOnly: true }),
  ],
  preview: {
    select: { date: 'date', score: 'pulseScore', zone: 'pulseZone' },
    prepare({ date, score, zone }) {
      return { title: `${date} — Pulse ${score}`, subtitle: zone };
    },
  },
});
