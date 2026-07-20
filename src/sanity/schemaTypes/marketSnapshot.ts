import { defineField, defineType } from 'sanity';

// Written once a day by the /api/cron/pulse-snapshot job — not meant to be
// edited by hand in Studio, just a data log powering the Pulse of the Day
// widget/page. Kept as a real document type (not a singleton) so history
// accumulates and the volume-momentum baseline has something to compare
// against after the first week.
export const marketSnapshotType = defineType({
  name: 'marketSnapshot',
  title: 'Market Snapshot (auto)',
  type: 'document',
  fields: [
    defineField({ name: 'date', title: 'Date', type: 'string', readOnly: true }),
    defineField({ name: 'totalVolume24h', title: 'Total 24h volume (USD)', type: 'number', readOnly: true }),
    defineField({ name: 'fearGreedValue', title: 'Fear & Greed value', type: 'number', readOnly: true }),
    defineField({ name: 'altSeasonValue', title: 'Altcoin Season value', type: 'number', readOnly: true }),
    defineField({ name: 'volumeChangePct', title: 'Volume change vs baseline (%)', type: 'number', readOnly: true }),
    defineField({ name: 'pulseScore', title: 'Pulse score', type: 'number', readOnly: true }),
    defineField({ name: 'pulseClassification', title: 'Pulse classification', type: 'string', readOnly: true }),
    defineField({ name: 'computedAt', title: 'Computed at', type: 'datetime', readOnly: true }),
  ],
  preview: {
    select: { date: 'date', score: 'pulseScore', classification: 'pulseClassification' },
    prepare({ date, score, classification }) {
      return { title: `${date} — Pulse ${score}`, subtitle: classification };
    },
  },
});
