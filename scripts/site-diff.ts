/**
 * Compares two site snapshots and reports what a change actually did.
 *
 * Written for the domain migration: a build passing proves the code compiles,
 * not that 1766 canonicals, hreflang pairs and titles still say what they said
 * yesterday. This is the check that would have caught a half-moved hreflang.
 *
 *   node --experimental-strip-types scripts/site-diff.ts before.json after.json
 */
import fs from 'node:fs';

const A = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const B = JSON.parse(fs.readFileSync(process.argv[3], 'utf8'));

const FIELDS = ['status', 'title', 'description', 'canonical', 'robots', 'h1', 'ogUrl', 'ogTitle'] as const;
const pathsA = new Set(Object.keys(A.pages));
const pathsB = new Set(Object.keys(B.pages));

const gone = [...pathsA].filter(p => !pathsB.has(p));
const added = [...pathsB].filter(p => !pathsA.has(p));

const diffs: Record<string, string[]> = {};
let same = 0;
for (const p of pathsA) {
  if (!pathsB.has(p)) continue;
  const a = A.pages[p], b = B.pages[p];
  if ('error' in a || 'error' in b) continue;
  const found: string[] = [];
  for (const f of FIELDS) if (a[f] !== b[f]) found.push(`${f}: «${a[f]}» → «${b[f]}»`);
  for (const k of new Set([...Object.keys(a.hreflang), ...Object.keys(b.hreflang)]))
    if (a.hreflang[k] !== b.hreflang[k]) found.push(`hreflang ${k}: «${a.hreflang[k]}» → «${b.hreflang[k]}»`);
  if (a.jsonLdTypes.join() !== b.jsonLdTypes.join()) found.push(`json-ld: [${a.jsonLdTypes}] → [${b.jsonLdTypes}]`);
  const la = new Set(a.internalLinks), lb = new Set(b.internalLinks);
  const lost = [...la].filter(x => !lb.has(x)), got = [...lb].filter(x => !la.has(x));
  if (lost.length) found.push(`потеряно ссылок: ${lost.length} (${lost.slice(0,3).join(', ')})`);
  if (got.length) found.push(`добавлено ссылок: ${got.length} (${got.slice(0,3).join(', ')})`);
  if (Math.abs(a.words - b.words) > Math.max(12, a.words * 0.03)) found.push(`слов: ${a.words} → ${b.words}`);
  if (found.length) diffs[p] = found; else same++;
}

console.log(`страниц в эталоне: ${pathsA.size}, в новом снимке: ${pathsB.size}`);
console.log(`совпали полностью: ${same}`);
console.log(`с отличиями:       ${Object.keys(diffs).length}`);
console.log(`пропали:           ${gone.length}`);
console.log(`появились:         ${added.length}`);
if (gone.length) console.log('\nПРОПАЛИ:\n' + gone.slice(0, 20).map(p => '  ' + p).join('\n'));
if (added.length) console.log('\nПОЯВИЛИСЬ:\n' + added.slice(0, 20).map(p => '  ' + p).join('\n'));

const byKind: Record<string, number> = {};
for (const list of Object.values(diffs)) for (const d of list) byKind[d.split(':')[0]] = (byKind[d.split(':')[0]] ?? 0) + 1;
if (Object.keys(byKind).length) {
  console.log('\nОТЛИЧИЯ ПО ВИДАМ:');
  for (const [k, v] of Object.entries(byKind).sort((x, y) => y[1] - x[1])) console.log(`  ${String(v).padStart(5)}  ${k}`);
  console.log('\nПРИМЕРЫ:');
  for (const [p, list] of Object.entries(diffs).slice(0, 12)) console.log(`  ${p}\n     ${list.slice(0, 3).join('\n     ')}`);
}
