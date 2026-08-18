/**
 * Move the 46 regulation-map countries out of source and into Sanity.
 *
 * They lived in src/lib/regulationData.ts, which made every correction a commit
 * and a deploy. Law moves faster than we ship, and the file proved it: Bolivia
 * carried a `banned` badge for two years after the ban was lifted, with its own
 * description saying the ban was lifted directly underneath.
 *
 * Two fields are derived rather than copied:
 *
 *   region     — read out of the REGIONS table in the map component, which is
 *                where it lived. Russia was in the data and in no region, so
 *                nothing rendered it; the migration fails loudly if any country
 *                cannot be placed rather than repeating that silence.
 *
 *   checkedAt  — the old data carried a year, not a date. A year becomes the
 *                first of January, which is a placeholder and looks like one in
 *                the admin list. The three countries corrected today against
 *                primary sources get today's date, because that is true.
 *
 * Idempotent: documents get a deterministic _id (regulation-<iso2>), so a
 * second run updates rather than duplicating.
 *
 * Usage:
 *   node --experimental-strip-types scripts/migrate-regulation.ts          # dry run
 *   node --experimental-strip-types scripts/migrate-regulation.ts --write  # apply
 */

import { createClient } from '@sanity/client';
import { readFileSync } from 'node:fs';
import { REGULATION_DATA } from '../src/lib/regulationData.ts';

const WRITE = process.argv.includes('--write');

const env = Object.fromEntries(
  readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter(l => l.includes('=') && !l.trim().startsWith('#'))
    .map(l => {
      const i = l.indexOf('=');
      return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^["']|["']$/g, '')];
    })
);

const client = createClient({
  projectId: env.SANITY_PROJECT_ID || env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.SANITY_DATASET || env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

/** Region membership, lifted from RegulationMap.tsx so the two cannot disagree. */
const mapSource = readFileSync('src/app/[locale]/regulation/RegulationMap.tsx', 'utf8');
const regionBlock = mapSource.match(/const REGIONS[\s\S]*?\n\];/)?.[0] ?? '';
const REGION_OF = new Map<string, string>();
for (const line of regionBlock.split('\n')) {
  const id = line.match(/id: '(\w+)'/)?.[1];
  if (!id) continue;
  for (const code of line.match(/'([A-Z]{2})'/g) ?? []) {
    REGION_OF.set(code.replace(/'/g, ''), id);
  }
}

/** Verified against primary sources on 18.08.2026 — see the session log. */
const CHECKED_TODAY = new Set(['SV', 'BO', 'CN']);
const TODAY = '2026-08-18';

const missing = REGULATION_DATA.filter(c => !REGION_OF.has(c.iso2)).map(c => c.iso2);
if (missing.length) {
  console.error(`Не удалось определить регион для: ${missing.join(', ')}`);
  console.error('Добавьте код в REGIONS в RegulationMap.tsx и повторите.');
  process.exit(1);
}

const docs = REGULATION_DATA.map(c => ({
  _id: `regulation-${c.iso2.toLowerCase()}`,
  _type: 'regulationCountry',
  iso2: c.iso2,
  isoNum: c.isoNum,
  slug: { _type: 'slug', current: c.slug },
  status: c.status,
  region: REGION_OF.get(c.iso2),
  name: { _type: 'object', ru: c.name.ru, en: c.name.en },
  summary: { _type: 'object', ru: c.summary.ru, en: c.summary.en },
  details: { _type: 'object', ru: c.details.ru, en: c.details.en },
  ...(c.taxNote
    ? { taxNote: { _type: 'object', ru: c.taxNote.ru, en: c.taxNote.en } }
    : {}),
  checkedAt: CHECKED_TODAY.has(c.iso2) ? TODAY : `${c.updatedYear}-01-01`,
}));

const byRegion = docs.reduce<Record<string, number>>((a, d) => {
  a[d.region as string] = (a[d.region as string] ?? 0) + 1;
  return a;
}, {});

console.log(`Стран к переносу: ${docs.length}`);
console.log('По регионам:', byRegion);
console.log('Свежая дата проверки:', [...CHECKED_TODAY].join(', '), `→ ${TODAY}`);
console.log('Остальные получают 1 января своего года — это заглушка, её видно в админке.');

if (!WRITE) {
  console.log('\nСухой прогон. Для записи: --write');
  process.exit(0);
}

const tx = docs.reduce((t, d) => t.createOrReplace(d), client.transaction());
await tx.commit();
console.log(`\nЗаписано в Sanity: ${docs.length} стран.`);
