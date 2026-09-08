import { unstable_cache } from 'next/cache';
import { client } from '@/lib/sanity';
import { GLOSSARY, type GlossaryTerm } from '@/lib/glossary';
import { AI_GLOSSARY } from '@/lib/aiGlossary';

/**
 * Глоссарий из Sanity, с падением обратно на файлы кода.
 *
 * 87 терминов переехали в базу, чтобы правка определения не требовала деплоя:
 * при 2384 адресах каждый выкат сбрасывает кэш данных и стоит квоты. Форма
 * возвращаемого объекта намеренно совпадает с прежним GlossaryTerm — страницы
 * получают ровно то же, что импортировали из файла, и меняется в них только
 * одно слово, `await`.
 *
 * Пустой ответ — не то же самое, что сбой, но и не глоссарий. До миграции этот
 * запрос возвращал ноль, и отрисовать его значило бы показать читателю пустой
 * словарь вместо 87 статей. Поэтому пусто и ошибка ведут в один и тот же
 * запасной путь — в файл.
 */

export type GlossaryKind = 'crypto' | 'ai';

const QUERY = `*[_type=="glossaryTerm" && kind==$kind]{
  "slug": slug.current,
  term, definition, category, updated, autolink, aliases, termLink,
  "related": related[]->slug.current,
  sections[]{
    heading,
    paragraphs[]{ru, en},
    bullets[]{title, text},
    example{ setup, rows[]{label, value}, total, outcome }
  }
}`;

/** Sanity отдаёт пустые массивы там, где в коде поля просто нет. Разница
 *  безобидна на экране, но ломает сравнение при сверке и заставляет страницу
 *  рисовать пустой список вместо ничего. */
function tidy(d: Record<string, unknown>): GlossaryTerm {
  const arr = (v: unknown) => (Array.isArray(v) && v.length ? v : undefined);
  const sections = (d.sections as Record<string, unknown>[] | undefined)?.map(s => ({
    heading: s.heading,
    ...(arr(s.paragraphs) ? { paragraphs: s.paragraphs } : {}),
    ...(arr(s.bullets) ? { bullets: s.bullets } : {}),
    ...(s.example ? { example: s.example } : {}),
  }));
  return {
    slug: d.slug,
    term: d.term,
    ...(d.termLink && (d.termLink as any).url ? { termLink: d.termLink } : {}),
    definition: d.definition,
    ...(d.category ? { category: d.category } : {}),
    ...(arr(sections) ? { sections } : {}),
    ...(arr(d.related) ? { related: d.related } : {}),
    ...(d.updated ? { updated: d.updated } : {}),
  } as GlossaryTerm;
}

/**
 * Запасной путь на файлы кода.
 *
 * Он молчаливый по природе и потому опасен: страницы отрисуются, читатель
 * ничего не заметит, а редактор увидит на сайте не то, что сохранил в админке.
 * Именно так эта миграция чуть не уехала сломанной — база отдавала пусто,
 * страницы брали файл и выглядели идеально. Поэтому каждое срабатывание
 * пишется в журнал: в наблюдаемости Vercel это видно сразу.
 */
function fromFile(kind: GlossaryKind, why: string): GlossaryTerm[] {
  console.error(
    `[glossary] отдаю данные из файла кода вместо базы (${kind}): ${why}. ` +
    'Правки, сделанные в админке, на сайте сейчас НЕ видны.',
  );
  return kind === 'ai' ? AI_GLOSSARY : GLOSSARY;
}

async function load(kind: GlossaryKind): Promise<GlossaryTerm[]> {
  try {
    const docs = await client.fetch<Record<string, unknown>[]>(QUERY, { kind });
    if (!docs?.length) return fromFile(kind, 'запрос вернул пустой список');
    // Порядок в файле осмысленный: термины стоят так, как их расставил
    // редактор. База порядок не хранит, поэтому восстанавливаем его по файлу,
    // а всё, чего в файле ещё нет, уходит в конец по алфавиту.
    const order = new Map((kind === 'ai' ? AI_GLOSSARY : GLOSSARY).map((t, i) => [t.slug, i]));
    return docs
      .map(tidy)
      .sort((a, b) => {
        const ia = order.get(a.slug), ib = order.get(b.slug);
        if (ia !== undefined && ib !== undefined) return ia - ib;
        if (ia !== undefined) return -1;
        if (ib !== undefined) return 1;
        return a.term.en.localeCompare(b.term.en);
      });
  } catch (e) {
    return fromFile(kind, e instanceof Error ? e.message : 'запрос не выполнился');
  }
}

export const getCryptoGlossary = unstable_cache(
  () => load('crypto'),
  ['glossary-crypto'],
  { revalidate: 300, tags: ['glossary'] },
);

export const getAiGlossary = unstable_cache(
  () => load('ai'),
  ['glossary-ai'],
  { revalidate: 300, tags: ['glossary'] },
);

/** Плоский список для простановки ссылок: термин, его словоформы и адрес.
 *  Единственный источник правды для автоссылок — раньше их питон-скрипт
 *  держал свою копию списка на 66 пар и не знал ни AI-словаря,
 *  ни множественного числа. */
export interface GlossaryLinkTarget {
  slug: string;
  kind: GlossaryKind;
  term: { ru: string; en: string };
  aliases: { ru: string[]; en: string[] };
  path: { ru: string; en: string };
}

export const getGlossaryLinkTargets = unstable_cache(
  async (): Promise<GlossaryLinkTarget[]> => {
    const docs = await client.fetch<Record<string, any>[]>(
      `*[_type=="glossaryTerm" && autolink != false]{
         "slug": slug.current, kind, term, aliases
       }`,
    );
    return (docs || []).map(d => {
      const base = d.kind === 'ai' ? 'ai/glossary' : 'glossary';
      return {
        slug: d.slug,
        kind: d.kind,
        term: { ru: d.term?.ru || '', en: d.term?.en || '' },
        aliases: { ru: d.aliases?.ru || [], en: d.aliases?.en || [] },
        path: { ru: `/ru/${base}/${d.slug}`, en: `/en/${base}/${d.slug}` },
      };
    });
  },
  ['glossary-link-targets'],
  { revalidate: 300, tags: ['glossary'] },
);
