/**
 * Перенос глоссария из кода в Sanity.
 *
 * Запуск:  npx tsx scripts/migrate-glossary.mts           — показать, что будет
 *          npx tsx scripts/migrate-glossary.mts --write   — записать
 *
 * Идентификаторы детерминированные: glossary.<kind>.<slug>. Поэтому скрипт
 * можно гонять сколько угодно — он перезапишет те же документы, а не наплодит
 * дубликатов. Связанные термины проставляются вторым проходом, когда все
 * документы уже существуют: ссылка на ещё не созданный документ невалидна.
 *
 * Словоформы (aliases) намеренно не заполняются. В коде их нет, а придумывать
 * русские склонения скриптом — значит записать мусор в поле, от которого потом
 * зависит простановка ссылок. Заполняются отдельно, с проверкой.
 */
import { createClient } from '@sanity/client';
import { GLOSSARY } from '../src/lib/glossary';
import { AI_GLOSSARY } from '../src/lib/aiGlossary';
import type { GlossaryTerm } from '../src/lib/glossary';

const WRITE = process.argv.includes('--write');

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
  // клиент с токеном обязан остаться на прямых запросах: CDN не обслуживает
  // аутентифицированные, а запись, прочитавшая свою устаревшую копию,
  // откатила бы себя
  useCdn: false,
});

/**
 * Идентификатор без точек — намеренно.
 *
 * Точка в _id для Sanity означает путь, а по пути считаются права чтения:
 * документ `glossary.crypto.stablecoin` анонимный читатель не видит вообще.
 * Проверено 08.09.2026: с токеном запрос отдавал 88 документов, без токена
 * ноль, при этом `regulationCountry` с обычными идентификаторами читался
 * нормально. Сайт при этом молча падал на запасной путь в файл и выглядел
 * исправным, поэтому ошибку было почти невозможно заметить по экрану.
 */
const docId = (kind: string, slug: string) => `glossaryTerm-${kind}-${slug}`;

/** Пустой двуязычный объект отличается от отсутствующего: Sanity хранит
 *  undefined как отсутствие поля, и сверка потом покажет ложное расхождение. */
function bi(v?: { ru: string; en: string }) {
  return v ? { ru: v.ru, en: v.en } : undefined;
}

function buildDoc(t: GlossaryTerm, kind: 'crypto' | 'ai') {
  return {
    _id: docId(kind, t.slug),
    _type: 'glossaryTerm',
    kind,
    term: bi(t.term),
    slug: { _type: 'slug', current: t.slug },
    definition: bi(t.definition),
    ...(t.category ? { category: t.category } : {}),
    ...(t.updated ? { updated: t.updated } : {}),
    autolink: true,
    sections: (t.sections || []).map((s, i) => ({
      _key: `s${i}`,
      _type: 'section',
      heading: bi(s.heading),
      ...(s.paragraphs?.length
        ? { paragraphs: s.paragraphs.map((p, j) => ({ _key: `p${i}_${j}`, ru: p.ru, en: p.en })) }
        : {}),
      ...(s.bullets?.length
        ? {
            bullets: s.bullets.map((b, j) => ({
              _key: `b${i}_${j}`, title: bi(b.title), text: bi(b.text),
            })),
          }
        : {}),
      ...(s.example
        ? {
            example: {
              setup: bi(s.example.setup),
              rows: s.example.rows.map((r, j) => ({
                _key: `r${i}_${j}`, label: bi(r.label), value: bi(r.value),
              })),
              ...(s.example.total ? { total: { label: bi(s.example.total.label), value: bi(s.example.total.value) } } : {}),
              outcome: bi(s.example.outcome),
            },
          }
        : {}),
    })),
  };
}

async function main() {
  const all: { doc: ReturnType<typeof buildDoc>; related: string[]; kind: 'crypto' | 'ai' }[] = [];
  for (const [kind, arr] of [['crypto', GLOSSARY], ['ai', AI_GLOSSARY]] as const) {
    for (const t of arr) {
      all.push({ doc: buildDoc(t, kind), related: t.related || [], kind });
    }
  }

  // связанные термины могут указывать в соседний словарь — карта общая
  const known = new Map<string, string>();
  for (const { doc, kind } of all) known.set(`${kind}:${doc.slug.current}`, doc._id);
  const bySlug = new Map<string, string[]>();
  for (const { doc, kind } of all) {
    const k = doc.slug.current;
    bySlug.set(k, [...(bySlug.get(k) || []), doc._id]);
  }

  let refs = 0, dangling: string[] = [];
  const patches: { id: string; related: { _key: string; _ref: string }[] }[] = [];
  for (const { doc, related, kind } of all) {
    const list: { _key: string; _ref: string }[] = [];
    related.forEach((slug, i) => {
      const same = known.get(`${kind}:${slug}`);
      const any = bySlug.get(slug);
      const target = same || (any && any.length === 1 ? any[0] : undefined);
      if (target) { list.push({ _key: `rel${i}`, _ref: target }); refs++; }
      else dangling.push(`${doc.slug.current} → ${slug}`);
    });
    if (list.length) patches.push({ id: doc._id, related: list });
  }

  const secs = all.reduce((s, x) => s + x.doc.sections.length, 0);
  const exs = all.reduce((s, x) => s + x.doc.sections.filter((y: any) => y.example).length, 0);
  console.log(`Терминов к переносу: ${all.length} (крипто ${all.filter(a => a.kind === 'crypto').length}, ИИ ${all.filter(a => a.kind === 'ai').length})`);
  console.log(`Разделов: ${secs}, из них с разбором: ${exs}`);
  console.log(`Связей между терминами: ${refs}`);
  if (dangling.length) {
    console.log(`\nСсылки в никуда (${dangling.length}) — их пропускаю:`);
    dangling.slice(0, 20).forEach(d => console.log('   ' + d));
  }

  if (!WRITE) { console.log('\nЭто сухой прогон. Для записи добавьте --write'); return; }

  let n = 0;
  for (const { doc } of all) {
    await client.createOrReplace(doc as any);
    if (++n % 20 === 0) console.log(`  записано ${n}/${all.length}`);
  }
  console.log(`  записано ${n}/${all.length}`);

  let p = 0;
  for (const { id, related } of patches) {
    await client.patch(id).set({ related }).commit();
    p++;
  }
  console.log(`Связи проставлены у ${p} терминов.`);
}

main().catch(e => { console.error(e); process.exit(1); });
