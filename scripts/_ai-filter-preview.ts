/** Разовый замер: как выглядит фильтр после правила «≥2 компании, ≤7 пунктов». */
import { JOBS } from './ai-seed-jobs.ts';
import { SERVICES } from './ai-seed-services.ts';

const derived = (s: typeof SERVICES[number]) => {
  const out: string[] = [];
  const paid = s.plans.filter(p => typeof p.price === 'number' && (p.price as number) > 0 && (p.unit ?? 'month') !== 'usage' && (p.unit ?? 'month') !== 'once');
  if (s.plans.some(p => p.price === 0)) out.push('free'); else out.push('nofree');
  if (paid.length) { const m = Math.min(...paid.map(p => p.price as number)); out.push(m < 12 ? 'cheap' : m <= 25 ? 'mid' : 'pricey'); }
  if (s.plans.some(p => p.unit === 'seat')) out.push('perseat');
  if (s.plans.some(p => p.unit === 'usage')) out.push('usage');
  return out;
};
const all = (s: typeof SERVICES[number]) => [...new Set([...s.facets, ...derived(s)])];

const globals = JOBS.flatMap(j => j.facetGroups.filter(g => g.scope === 'global'));
const seen = new Set<string>();
const globalGroups = globals.filter(g => { const id = g.items.map(i => i.key).join(','); if (seen.has(id)) return false; seen.add(id); return true; });

let totalShown = 0, maxGroup = 0, minCount = 99;
for (const job of JOBS) {
  const list = SERVICES.filter(s => s.job === job.slug);
  const counts = new Map<string, number>();
  for (const s of list) for (const k of all(s)) counts.set(k, (counts.get(k) ?? 0) + 1);
  const groups = [...job.facetGroups.filter(g => g.scope === 'task'), ...globalGroups];
  console.log(`\n### ${job.slug} — ${list.length} компаний`);
  let shown = 0;
  for (const g of groups) {
    const items = g.items.map(i => ({ i, n: counts.get(i.key) ?? 0 })).filter(x => x.n >= 2);
    if (items.length < 2) continue;
    const keep = new Set([...items].sort((a,b)=>b.n-a.n).slice(0,7).map(x=>x.i.key));
    const kept = items.filter(x => keep.has(x.i.key));
    shown += kept.length;
    maxGroup = Math.max(maxGroup, kept.length);
    for (const x of kept) minCount = Math.min(minCount, x.n);
    console.log(`  ${g.title.ru} (${kept.length}): ${kept.map(x=>`${x.i.label.ru} ${x.n}`).join(' · ')}`);
  }
  if (!shown) console.log('  — фильтр не показывается: компаний слишком мало');
  totalShown += shown;
}
console.log(`\nВсего живых пунктов по всем задачам: ${totalShown}`);
console.log(`Самая большая группа: ${maxGroup} пунктов. Минимум компаний за пунктом: ${minCount}.`);
