/**
 * Подбор словоформ для терминов глоссария по нашему собственному корпусу.
 *
 * Автоматическая простановка ссылок ищет точное слово, поэтому «стейблкоины»
 * не совпадают с термином «стейблкоин», и материал уходит без ссылок. Склонения
 * скриптом придумывать нельзя — для русского это гарантированный мусор в поле,
 * от которого зависят ссылки. Поэтому формы не изобретаются, а собираются:
 * берём слова, которые действительно встретились в опубликованных новостях
 * и статьях, и предлагаем только их.
 *
 *   npx tsx scripts/collect-aliases.mts          — показать предложения
 *   npx tsx scripts/collect-aliases.mts --write  — записать в базу
 */
import { createClient } from '@sanity/client';

const WRITE = process.argv.includes('--write');
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

/** Слово целиком, с русскими и латинскими буквами и дефисом внутри. */
const WORD = /[\p{L}][\p{L}-]*/gu;

async function corpus(lang: 'ru' | 'en'): Promise<Map<string, number>> {
  const freq = new Map<string, number>();
  const PAGE = 150;
  for (let i = 0; ; i += PAGE) {
    const rows = await client.fetch<{ t: string }[]>(
      `*[_type in ["news","article"] && language==$lang][$a...$b]{"t": pt::text(body)}`,
      { lang, a: i, b: i + PAGE },
    );
    if (!rows.length) break;
    for (const r of rows) {
      for (const m of (r.t || '').toLowerCase().matchAll(WORD)) {
        const w = m[0];
        if (w.length < 3) continue;
        freq.set(w, (freq.get(w) || 0) + 1);
      }
    }
    process.stdout.write(`\r  ${lang}: обработано ${i + rows.length} материалов`);
    if (rows.length < PAGE) break;
  }
  process.stdout.write('\n');
  return freq;
}

/**
 * Кандидат принимается, только если он равен корню плюс настоящее окончание
 * из списка ниже. Без этого ограничения корпус подсовывает однокоренной мусор:
 * «Трансформер» притягивал «трансформации», «DeFi» — «defiant» и «defined»,
 * «Инференс» — опечатку «inferencex». Проверено 08.09.2026 на сухом прогоне.
 */
const SUFFIXES: Record<'ru' | 'en', string[]> = {
  ru: ['а', 'я', 'у', 'ю', 'ом', 'ем', 'е', 'и', 'ы', 'ов', 'ев', 'ей',
       'ам', 'ям', 'ами', 'ями', 'ах', 'ях', 'ой', 'ою'],
  en: ['s', 'es'],
};

/** Русские существительные на гласную склоняются от основы без неё:
 *  «биржа» → «бирж» + «и/ей/ам». Для слов на согласную основа равна слову. */
function stemOf(term: string, lang: 'ru' | 'en'): string {
  const head = term.toLowerCase().split('(')[0].trim();
  if (lang === 'en') return head;
  return /[аяоеьй]$/.test(head) ? head.slice(0, -1) : head;
}

function candidates(term: string, lang: 'ru' | 'en', freq: Map<string, number>): string[] {
  const word = term.toLowerCase().split('(')[0].trim();
  if (word.includes(' ') || word.includes('-')) return [];  // составные ищем целиком
  if (word.length < 4) return [];                            // короткий корень даёт ложные совпадения
  const stem = stemOf(term, lang);
  const out: [string, number][] = [];
  for (const suf of SUFFIXES[lang]) {
    const form = stem + suf;
    if (form === word) continue;
    const n = freq.get(form);
    if (n && n >= 2) out.push([form, n]);
  }
  return out.sort((a, b) => b[1] - a[1]).map(([w]) => w);
}

async function main() {
  console.log('Читаю корпус опубликованных материалов…');
  const [ru, en] = [await corpus('ru'), await corpus('en')];
  console.log(`  словарь корпуса: русских ${ru.size}, английских ${en.size}\n`);

  const terms = await client.fetch<any[]>(
    `*[_type=="glossaryTerm"]{_id, kind, "slug": slug.current, term, aliases}`,
  );

  let filled = 0, empty = 0;
  const plan: { id: string; ru: string[]; en: string[]; label: string }[] = [];
  for (const t of terms) {
    const cru = candidates(t.term?.ru || '', 'ru', ru);
    const cen = candidates(t.term?.en || '', 'en', en);
    if (cru.length || cen.length) filled++; else empty++;
    plan.push({ id: t._id, ru: cru, en: cen, label: `${t.term?.ru} · ${t.term?.en}` });
  }

  console.log(`Термины с найденными формами: ${filled}, без единой: ${empty}\n`);
  console.log('Примеры предложений:');
  for (const p of plan.filter(x => x.ru.length || x.en.length)) {
    console.log(`  ${p.label}`);
    if (p.ru.length) console.log(`      ru: ${p.ru.join(', ')}`);
    if (p.en.length) console.log(`      en: ${p.en.join(', ')}`);
  }

  if (!WRITE) { console.log('\nСухой прогон. Для записи добавьте --write'); return; }
  let tx = client.transaction();
  for (const p of plan) tx = tx.patch(p.id, patch => patch.set({ aliases: { ru: p.ru, en: p.en } }));
  await tx.commit();
  console.log(`\nЗаписано словоформ у ${plan.length} терминов.`);
}

main().catch(e => { console.error(e); process.exit(1); });
