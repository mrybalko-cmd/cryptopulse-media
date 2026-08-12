/**
 * Rebuild the Pulse history from historical market data.
 *
 * The index is anchored to a rolling year, so it does not need to accumulate
 * a record before it means anything — the inputs for the past year are all
 * publicly available. Rather than waiting a year for the scale to fill in,
 * this reconstructs every day from:
 *   · CoinGecko — Bitcoin daily price and turnover, one request for 365 days
 *   · alternative.me — Fear & Greed history, one request
 *
 * The altcoin margin cannot be reconstructed: it needs per-coin 30-day
 * performance for each past date, which the free tier will not serve at that
 * volume. Historical rows therefore carry four of the five components and
 * composeScore renormalises the remaining weights rather than inventing a
 * value. Every rebuilt row is flagged `reconstructed` so the admin log never
 * presents it as a live measurement.
 *
 * Usage:
 *   node --experimental-strip-types scripts/backfill-pulse.ts          # dry run
 *   node --experimental-strip-types scripts/backfill-pulse.ts --write  # apply
 */

import { readFileSync } from 'node:fs';
import {
  PULSE_NORM_DAYS,
  composeScore,
  computeWeekdayFactors,
  growthScore,
  isPlausibleVolume,
  median,
  volatilityScore,
  volumeScore,
  weekdayOf,
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
    // env may come from the shell instead
  }
}
loadEnv();

const PROJECT = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const TOKEN = process.env.SANITY_API_WRITE_TOKEN;
const WRITE = process.argv.includes('--write');

if (!PROJECT) {
  console.error('NEXT_PUBLIC_SANITY_PROJECT_ID не задан');
  process.exit(1);
}

const API = `https://${PROJECT}.api.sanity.io/v2024-01-01`;
const WD = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];

async function getJson(url: string, tries = 5): Promise<any> {
  for (let i = 0; i < tries; i++) {
    const res = await fetch(url, { headers: { 'User-Agent': 'cryptopulse-backfill' } });
    if (res.ok) return res.json();
    if (res.status === 429) {
      await new Promise((r) => setTimeout(r, 30_000 * (i + 1)));
      continue;
    }
    throw new Error(`${url.slice(0, 60)}… → ${res.status}`);
  }
  throw new Error('слишком много попыток');
}

const dayOf = (ms: number) => new Date(ms).toISOString().slice(0, 10);

console.log('Загружаю год данных по биткоину…');
const chart = await getJson(
  `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=${PULSE_NORM_DAYS}&interval=daily`
);
const volByDay = new Map<string, number>();
for (const [ts, v] of chart.total_volumes as [number, number][]) volByDay.set(dayOf(ts), v);
const byDay = new Map<string, { date: string; price: number; volume: number }>();
for (const [ts, p] of chart.prices as [number, number][]) {
  const date = dayOf(ts);
  byDay.set(date, { date, price: p, volume: volByDay.get(date) ?? 0 });
}
const days = [...byDay.values()].sort((a, b) => a.date.localeCompare(b.date));
console.log(`  дней: ${days.length}, с ${days[0].date} по ${days[days.length - 1].date}`);

console.log('Загружаю историю индекса страха и жадности…');
const fngRaw = await getJson('https://api.alternative.me/fng/?limit=400&format=json');
const fng = new Map<string, number>();
for (const e of fngRaw.data as { timestamp: string; value: string }[]) {
  fng.set(dayOf(Number(e.timestamp) * 1000), Number(e.value));
}
console.log(`  дней: ${fng.size}`);

// Norms come from the whole window, exactly as the live index computes them.
const normVolume = median(days.map((d) => d.volume).filter((v) => v > 0));
const factors = computeWeekdayFactors(days.map((d) => ({ date: d.date, btcVolume24h: d.volume })));
const changes = days.slice(1).map((d, i) => (d.price / days[i].price - 1) * 100);
const normAbsChange = median(changes.map(Math.abs));

console.log(`\nНормы: оборот ${(normVolume / 1e9).toFixed(1)} млрд, дневное движение ${normAbsChange.toFixed(2)}%`);
console.log('Коэффициенты дня недели: ' + factors.map((f, i) => `${WD[i]} ${f.toFixed(2)}`).join(' · '));

const rows = [];
const skipped: string[] = [];
for (let i = 1; i < days.length; i++) {
  const d = days[i];
  const fgValue = fng.get(d.date);
  if (fgValue === undefined || !(days[i - 1].price > 0)) continue;
  if (!isPlausibleVolume(d.volume, normVolume)) {
    skipped.push(d.date);
    continue;
  }

  const priceChange24h = Math.round(((d.price / days[i - 1].price - 1) * 100) * 100) / 100;
  const weekdayFactor = factors[weekdayOf(d.date)] || 1;
  const components = {
    volume: volumeScore(d.volume, weekdayFactor, normVolume),
    growth: growthScore(priceChange24h),
    volatility: volatilityScore(priceChange24h, normAbsChange),
    fearGreed: fgValue,
    altcoin: null,
  };
  const score = composeScore(components);
  rows.push({
    date: d.date,
    btcVolume24h: Math.round(d.volume),
    normVolume: Math.round(normVolume),
    weekdayFactor: Math.round(weekdayFactor * 1000) / 1000,
    priceChange24h,
    normAbsChange: Math.round(normAbsChange * 1000) / 1000,
    altcoinMarginPp: null,
    altcoinCoins: null,
    volumeScore: components.volume,
    growthScore: components.growth,
    volatilityScore: components.volatility,
    fearGreedValue: components.fearGreed,
    altcoinScoreValue: null,
    pulseScore: score,
    pulseZone: zoneOf(score),
    reconstructed: true,
    computedAt: `${d.date}T00:05:00.000Z`,
  });
}

const scores = rows.map((r) => r.pulseScore).sort((a, b) => a - b);
const q = (p: number) => scores[Math.min(scores.length - 1, Math.round(p * (scores.length - 1)))];
console.log(`\nПересчитано дней: ${rows.length}`);
if (skipped.length) {
  console.log(`Пропущено из-за сбойных данных об обороте: ${skipped.length} (${skipped.join(', ')})`);
}
console.log(`Распределение: мин ${q(0)} · нижняя четверть ${q(0.25)} · медиана ${q(0.5)} · верхняя четверть ${q(0.75)} · макс ${q(1)}`);
console.log(`Дней выше 50: ${scores.filter((s) => s > 50).length} (${Math.round(scores.filter((s) => s > 50).length / scores.length * 100)}%)`);

console.log('\nСамые активные дни:');
for (const r of [...rows].sort((a, b) => b.pulseScore - a.pulseScore).slice(0, 4)) {
  console.log(`  ${r.date} ${WD[weekdayOf(r.date)]}  индекс ${r.pulseScore} (${zoneMeta(zoneOf(r.pulseScore)).ru})  ` +
    `оборот ${(r.btcVolume24h / 1e9).toFixed(0)} млрд, цена ${r.priceChange24h > 0 ? '+' : ''}${r.priceChange24h}%, страх ${r.fearGreedValue}`);
}
console.log('Самые тихие:');
for (const r of [...rows].sort((a, b) => a.pulseScore - b.pulseScore).slice(0, 3)) {
  console.log(`  ${r.date} ${WD[weekdayOf(r.date)]}  индекс ${r.pulseScore} (${zoneMeta(zoneOf(r.pulseScore)).ru})  ` +
    `оборот ${(r.btcVolume24h / 1e9).toFixed(0)} млрд, цена ${r.priceChange24h > 0 ? '+' : ''}${r.priceChange24h}%, страх ${r.fearGreedValue}`);
}
const last = rows[rows.length - 1];
console.log(`\nПоследний день ${last.date}: индекс ${last.pulseScore} — ${zoneMeta(zoneOf(last.pulseScore)).ru}`);

if (!WRITE) {
  console.log('\nЭто пробный прогон. Чтобы записать, добавьте --write');
  process.exit(0);
}
if (!TOKEN) {
  console.error('\nSANITY_API_WRITE_TOKEN не задан — записывать нечем.');
  process.exit(1);
}

// Existing documents are matched by date so the rebuild replaces rather than
// duplicates whatever the old formula left behind.
const existing: { _id: string; date: string }[] = (await getJson(
  `${API}/data/query/${DATASET}?query=${encodeURIComponent('*[_type=="marketSnapshot"]{_id,date}')}`
)).result ?? [];
const idByDate = new Map(existing.map((e) => [e.date, e._id]));
console.log(`\nВ базе уже есть строк: ${existing.length}`);

const mutations = rows.map((r) => {
  const id = idByDate.get(r.date);
  return id
    ? { createOrReplace: { _id: id, _type: 'marketSnapshot', ...r } }
    : { create: { _type: 'marketSnapshot', ...r } };
});

// Sanity caps mutation payloads, so this goes up in batches.
const BATCH = 50;
for (let i = 0; i < mutations.length; i += BATCH) {
  const slice = mutations.slice(i, i + BATCH);
  const res = await fetch(`${API}/data/mutate/${DATASET}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${TOKEN}` },
    body: JSON.stringify({ mutations: slice }),
  });
  if (!res.ok) throw new Error(`Запись не прошла: ${res.status} ${await res.text()}`);
  console.log(`  записано ${Math.min(i + BATCH, mutations.length)}/${mutations.length}`);
}

// Days the old formula wrote that the rebuild has no data for would otherwise
// sit in the log under a different method entirely.
const orphans = existing.filter((e) => !rows.some((r) => r.date === e.date));
if (orphans.length) {
  console.log(`\nСтрок без новых данных: ${orphans.length} — удаляю, чтобы в логе не осталось значений по старой формуле`);
  const res = await fetch(`${API}/data/mutate/${DATASET}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${TOKEN}` },
    body: JSON.stringify({ mutations: orphans.map((o) => ({ delete: { id: o._id } })) }),
  });
  if (!res.ok) throw new Error(`Удаление не прошло: ${res.status}`);
}

console.log(`\nГотово: ${rows.length} дней в истории.`);
