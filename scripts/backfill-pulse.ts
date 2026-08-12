/**
 * Recompute every stored Pulse snapshot with the weekday-adjusted method.
 *
 * Why this exists: before 11.08.2026 the volume component compared each day
 * against a plain 7-day mean, which made every Monday read as a collapse
 * (Monday averages 0.72 of a typical day's volume) and flattered every
 * Wednesday (1.15). Leaving those rows untouched would mean the history the
 * admin log shows was produced by two different formulas — useless for
 * studying how the index behaves. So we rewrite them all with the current
 * arithmetic, importing the exact same functions the site uses.
 *
 * The raw inputs recorded per day (volume, Fear & Greed, Altcoin Season) are
 * never touched — only the derived fields are recomputed from them.
 *
 * DO NOT run the full pass routinely. Weekday factors are re-estimated from
 * the whole record, so every new day nudges them, and a full rewrite would
 * move numbers that were already published. The live cron never does this:
 * it writes only today's row using the factors known at that moment, and
 * records the factor it used, so each row stays auditable.
 *
 * The full pass is for one-off transitions (a formula change). To repair a
 * single day — e.g. a cron that fired on a stale deployment — use --only.
 *
 * Usage:
 *   node --experimental-strip-types scripts/backfill-pulse.ts                      # dry run, all
 *   node --experimental-strip-types scripts/backfill-pulse.ts --write              # apply, all
 *   node --experimental-strip-types scripts/backfill-pulse.ts --only 2026-08-12    # dry run, one day
 */

import { readFileSync } from 'node:fs';
import {
  adjustedVolumeChange,
  classifyPulse,
  composeScore,
  computeWeekdayFactors,
  percentileOf,
  zoneMeta,
  zoneOf,
} from '../src/lib/pulseMath.ts';

function loadEnv() {
  try {
    for (const line of readFileSync(new URL('../.env.local', import.meta.url), 'utf8').split('\n')) {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  } catch {
    // env may be supplied by the shell instead
  }
}
loadEnv();

const PROJECT = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const TOKEN = process.env.SANITY_API_WRITE_TOKEN;
const WRITE = process.argv.includes('--write');
const ONLY = (() => {
  const i = process.argv.indexOf('--only');
  return i >= 0 ? process.argv[i + 1] : null;
})();

if (!PROJECT) {
  console.error('NEXT_PUBLIC_SANITY_PROJECT_ID не задан');
  process.exit(1);
}

const API = `https://${PROJECT}.api.sanity.io/v2024-01-01`;
const WD = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];

interface Row {
  _id: string;
  date: string;
  totalVolume24h: number;
  fearGreedValue: number;
  altSeasonValue: number;
  volumeChangePct: number;
  pulseScore: number;
}

async function fetchAll(): Promise<Row[]> {
  const query = `*[_type=="marketSnapshot" && defined(date)]|order(date asc){
    _id,date,totalVolume24h,fearGreedValue,altSeasonValue,volumeChangePct,pulseScore}`;
  const res = await fetch(`${API}/data/query/${DATASET}?query=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error(`Sanity ответил ${res.status}`);
  return (await res.json()).result ?? [];
}

async function patch(mutations: unknown[]) {
  const res = await fetch(`${API}/data/mutate/${DATASET}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${TOKEN}` },
    body: JSON.stringify({ mutations }),
  });
  if (!res.ok) throw new Error(`Запись не прошла: ${res.status} ${await res.text()}`);
}

const rows = await fetchAll();
if (rows.length === 0) {
  console.log('Снапшотов нет — пересчитывать нечего.');
  process.exit(0);
}

// Weekday factors come from the whole record, exactly as the live index does.
const factors = computeWeekdayFactors(rows);
console.log(`Снапшотов: ${rows.length}\n`);
console.log('Коэффициенты дня недели:');
factors.forEach((f, i) => console.log(`  ${WD[i]}  ${f.toFixed(3)}`));

const results = rows.map((row, i) => {
  // Prior days, newest-first, excluding the day being recomputed — the same
  // shape computeAndStorePulse() passes at runtime.
  const prior = rows.slice(Math.max(0, i - 7), i).reverse();
  const { changePct, rawChangePct, weekdayFactor } = adjustedVolumeChange(row, prior, factors);
  const { score } = composeScore(row.fearGreedValue, row.altSeasonValue, changePct);
  return { row, changePct, rawChangePct, weekdayFactor, score, classification: classifyPulse(score) };
});

const series = results.map((r) => r.score);

console.log('\nдата        дн   объём было → стало     балл было → стало   перцентиль  зона');
for (const r of results) {
  const p = percentileOf(r.score, series);
  const zn = p === null ? '—' : zoneMeta(zoneOf(p)).ru;
  const wd = WD[(new Date(`${r.row.date}T00:00:00Z`).getUTCDay() + 6) % 7];
  console.log(
    `  ${r.row.date} ${wd}  ${String(r.row.volumeChangePct).padStart(7)}% → ${String(r.changePct).padStart(6)}%   ` +
    `${String(r.row.pulseScore).padStart(3)} → ${String(r.score).padStart(3)}        ` +
    `${String(p ?? '—').padStart(3)}      ${zn}`
  );
}

const oldRange = [Math.min(...rows.map((r) => r.pulseScore)), Math.max(...rows.map((r) => r.pulseScore))];
const newRange = [Math.min(...series), Math.max(...series)];
console.log(`\nРазмах сырого балла: было ${oldRange[0]}–${oldRange[1]}, стало ${newRange[0]}–${newRange[1]}`);

// --only still computes across the whole record (weekday factors and the
// baseline window need it) but writes exactly one row, leaving every
// already-published day alone.
const toWrite = ONLY ? results.filter((r) => r.row.date === ONLY) : results;
if (ONLY && toWrite.length === 0) {
  console.error(`\nСнапшота за ${ONLY} нет.`);
  process.exit(1);
}

const changed = results.filter((r) => r.score !== r.row.pulseScore).length;
console.log(`Изменится значений при полном пересчёте: ${changed} из ${results.length}`);
console.log(ONLY ? `Режим --only: будет записан только ${ONLY}` : 'Режим: полный пересчёт всех строк');

if (!WRITE) {
  console.log('\nЭто пробный прогон. Чтобы записать, добавьте --write');
  process.exit(0);
}
if (!TOKEN) {
  console.error('\nSANITY_API_WRITE_TOKEN не задан — записывать нечем.');
  process.exit(1);
}

await patch(
  toWrite.map((r) => ({
    patch: {
      id: r.row._id,
      set: {
        volumeChangePct: r.changePct,
        volumeChangePctRaw: r.rawChangePct,
        weekdayFactor: r.weekdayFactor,
        pulseScore: r.score,
        pulseClassification: r.classification,
      },
    },
  }))
);
console.log(`\nЗаписано: ${toWrite.length} снапшот(ов) пересчитано.`);
