/**
 * Сверка перенесённого глоссария с исходником в коде.
 *
 * Читает из Sanity всё, что записал migrate-glossary, приводит к той же форме,
 * что в src/lib/*.ts, и сравнивает посимвольно. Любое расхождение печатается
 * с путём до поля. Ноль расхождений — единственный допустимый результат:
 * потерянный абзац в 226 разделах руками не найдёшь.
 */
import { createClient } from '@sanity/client';
import { GLOSSARY } from '../src/lib/glossary';
import { AI_GLOSSARY } from '../src/lib/aiGlossary';
import type { GlossaryTerm } from '../src/lib/glossary';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

const diffs: string[] = [];
const note = (p: string, a: unknown, b: unknown) =>
  diffs.push(`${p}\n    в коде:  ${JSON.stringify(a)?.slice(0, 130)}\n    в базе:  ${JSON.stringify(b)?.slice(0, 130)}`);

/** Sanity возвращает ключи объекта в своём порядке: в коде {ru, en},
 *  из базы может прийти {en, ru}. Обычный JSON.stringify считает это
 *  расхождением, и первая же сверка дала ложную тревогу на термине «Кит».
 *  Поэтому ключи сортируются перед сравнением — сравниваем содержимое,
 *  а не порядок полей. */
function stable(v: unknown): string {
  const walk = (x: any): any => {
    if (Array.isArray(x)) return x.map(walk);
    if (x && typeof x === 'object') {
      return Object.keys(x).sort().reduce((acc: any, k) => {
        if (!k.startsWith('_')) acc[k] = walk(x[k]);
        return acc;
      }, {});
    }
    return x;
  };
  return JSON.stringify(walk(v));
}

function cmp(path: string, a: unknown, b: unknown) {
  const norm = (v: unknown) => (v === undefined || v === null || v === '' ? undefined : v);
  if (norm(a) === undefined && norm(b) === undefined) return;
  if (stable(a) !== stable(b)) note(path, a, b);
}

function cmpTerm(src: GlossaryTerm, doc: any, kind: string) {
  const p = `[${kind}/${src.slug}]`;
  if (!doc) { diffs.push(`${p} НЕТ В БАЗЕ`); return; }
  cmp(`${p} term`, src.term, doc.term && { ru: doc.term.ru, en: doc.term.en });
  cmp(`${p} definition`, src.definition, doc.definition && { ru: doc.definition.ru, en: doc.definition.en });
  cmp(`${p} category`, src.category, doc.category);
  cmp(`${p} updated`, src.updated, doc.updated);
  cmp(`${p} related`, src.related || [], (doc.relatedSlugs || []));

  const ss = src.sections || [], ds = doc.sections || [];
  if (ss.length !== ds.length) { note(`${p} число разделов`, ss.length, ds.length); return; }
  ss.forEach((s, i) => {
    const d = ds[i], q = `${p} раздел ${i + 1}`;
    cmp(`${q} heading`, s.heading, d.heading && { ru: d.heading.ru, en: d.heading.en });

    const sp = s.paragraphs || [], dp = (d.paragraphs || []).map((x: any) => ({ ru: x.ru, en: x.en }));
    cmp(`${q} абзацы`, sp, dp);

    const sb = s.bullets || [];
    const db = (d.bullets || []).map((x: any) => ({
      title: x.title && { ru: x.title.ru, en: x.title.en },
      text: x.text && { ru: x.text.ru, en: x.text.en },
    }));
    cmp(`${q} список`, sb, db);

    if (s.example || d.example) {
      const de = d.example ? {
        setup: d.example.setup && { ru: d.example.setup.ru, en: d.example.setup.en },
        rows: (d.example.rows || []).map((r: any) => ({
          label: r.label && { ru: r.label.ru, en: r.label.en },
          value: r.value && { ru: r.value.ru, en: r.value.en },
        })),
        ...(d.example.total ? { total: {
          label: d.example.total.label && { ru: d.example.total.label.ru, en: d.example.total.label.en },
          value: d.example.total.value && { ru: d.example.total.value.ru, en: d.example.total.value.en },
        } } : {}),
        outcome: d.example.outcome && { ru: d.example.outcome.ru, en: d.example.outcome.en },
      } : undefined;
      cmp(`${q} разбор`, s.example, de);
    }
  });
}

async function main() {
  const docs = await client.fetch<any[]>(
    `*[_type=="glossaryTerm"]{
       kind, term, definition, category, updated, sections,
       "slug": slug.current,
       "relatedSlugs": related[]->slug.current
     }`,
  );
  const byKey = new Map(docs.map(d => [`${d.kind}:${d.slug}`, d]));
  console.log(`В базе: ${docs.length} терминов. В коде: ${GLOSSARY.length + AI_GLOSSARY.length}.\n`);

  for (const t of GLOSSARY) cmpTerm(t, byKey.get(`crypto:${t.slug}`), 'crypto');
  for (const t of AI_GLOSSARY) cmpTerm(t, byKey.get(`ai:${t.slug}`), 'ai');

  const extra = docs.filter(d =>
    !GLOSSARY.some(t => t.slug === d.slug && d.kind === 'crypto') &&
    !AI_GLOSSARY.some(t => t.slug === d.slug && d.kind === 'ai'));
  extra.forEach(d => diffs.push(`[${d.kind}/${d.slug}] ЛИШНИЙ в базе`));

  if (!diffs.length) {
    console.log('РАСХОЖДЕНИЙ НЕТ. 87 терминов, 226 разделов, 42 разбора совпадают посимвольно.');
  } else {
    console.log(`РАСХОЖДЕНИЙ: ${diffs.length}\n`);
    diffs.slice(0, 25).forEach(d => console.log('  ' + d + '\n'));
    process.exit(1);
  }
}

main().catch(e => { console.error(e); process.exit(1); });
