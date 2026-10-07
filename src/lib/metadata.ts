import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL, TITLE_SUFFIX } from '@/lib/site';
const BASE = SITE_URL;

export function buildOg(opts: {
  url: string;
  title: string;
  description: string;
  locale: string;
  type?: 'website' | 'article';
  image?: string;
}) {
  const fallbackImage = `${BASE}/${opts.locale}/opengraph-image`;
  return {
    type: (opts.type ?? 'website') as 'website' | 'article',
    locale: opts.locale === 'ru' ? 'ru_RU' : 'en_US',
    siteName: SITE_NAME,
    url: opts.url,
    title: opts.title,
    description: opts.description,
    images: [{ url: opts.image || fallbackImage }],
  };
}

/**
 * Next.js does NOT fall back to `openGraph` for the `twitter` metadata
 * block — they're separate namespaces, and a nested object like `twitter`
 * defined once (e.g. in the root layout) is entirely overwritten by the
 * next segment that defines it, never deep-merged. Since no per-page
 * generateMetadata previously set its own `twitter`, every page fell back
 * to the root layout's bare `{ card: 'summary_large_image' }` — no title,
 * description, or image — which is what Sitechecker flags as "Twitter card
 * incomplete" site-wide. Call this alongside buildOg with the same opts.
 */
export function buildTwitter(opts: {
  url?: string;
  title: string;
  description: string;
  locale: string;
  type?: 'website' | 'article';
  image?: string;
}) {
  const fallbackImage = `${BASE}/${opts.locale}/opengraph-image`;
  return {
    card: 'summary_large_image' as const,
    title: opts.title,
    description: opts.description,
    images: [opts.image || fallbackImage],
  };
}

/**
 * Описание для сниппета, обрезанное по границе предложения.
 *
 * Раньше здесь резалось по сто пятьдесят пятому символу, и в выдачу уходил
 * обрывок: «…no income tax and no capital gains tax, so there is no…». В
 * аудите 07.10.2026 так выглядели 94 страницы стран и 379 материалов. Для
 * обычного сниппета это просто некрасиво, а языковой модели многоточие на
 * середине фразы достаётся как факт без второй половины.
 *
 * Поэтому сначала ищем последнюю точку в пределах лимита и заканчиваем на
 * ней — описание выходит короче, зато фраза целая. Многоточие остаётся только
 * там, где в лимит не поместилось ни одного предложения.
 *
 * Лимит 200, а не 155, которые принято держать для сниппета. Замер на наших
 * 694 описаниях: при 155 обрывалось 97, при 200 — шесть, а средняя длина
 * выросла с 140 до 145 символов. Рез по предложению укорачивает описание сам,
 * и запас нужен не для того, чтобы писать длиннее, а чтобы точка успела
 * попасть в окно. Что не поместится в сниппет, Google подрежет сам и сделает
 * это аккуратнее нас.
 *
 * Границей считается точка, за которой пробел или конец строки, но не точка
 * после одиночной заглавной буквы: «U.S.» и «т.е.» — не конец предложения.
 * Такой разбор отбрасывает и настоящий конец вида «…in the USA.», поэтому он
 * лишь предпочтение: не нашлось границы — режем по слову, как прежде.
 */
export function truncateDesc(text: string, max = 200): string {
  if (!text) return text;
  const t = text.trim().replace(/\s+/g, ' ');
  if (t.length <= max) return t;

  const window = t.slice(0, max + 1);
  const ends = [...window.matchAll(/(?<![A-ZА-ЯЁ])[.!?](?=\s|$)/g)];
  const lastEnd = ends.length ? (ends[ends.length - 1].index as number) + 1 : -1;
  // Половину лимита описание обязано занять: одно короткое предложение из
  // трёх слов — хуже, чем целая мысль с многоточием.
  if (lastEnd >= max * 0.5) return window.slice(0, lastEnd).trim();

  const cut = t.slice(0, max);
  const space = cut.lastIndexOf(' ');
  const body = space > max * 0.6 ? cut.slice(0, space) : cut;
  return body.replace(/[\s,;:–—-]+$/, '') + '…';
}

/**
 * Заголовок для тега <title>.
 *
 * Раньше здесь стояла жёсткая обрезка: собственный текст страницы урезался до
 * сорока с небольшим символов, чтобы вместе с суффиксом « | Intokened.com»
 * уложиться в шестьдесят. В выдачу из-за этого уходили обрывки на середине
 * фразы — «Криптовалюта в Германии: регулирование,…», без слов «налоги» и
 * «лицензии», ради которых страницу и писали. В аудите 20.08.2026 таких
 * страниц нашлось 11 из 92 в выборке, а среди гидов по странам — все 30.
 *
 * Оборванная фраза читается хуже длинного заголовка, который поисковик и так
 * подрежет по ширине сам. Поэтому теперь, когда заголовок не помещается вместе
 * с суффиксом, мы отдаём его целиком и без суффикса: название сайта Google
 * из сниппета всё равно часто убирает. Многоточие остаётся только для
 * действительно длинных заголовков, где без него не обойтись.
 *
 * Потолок поднят с семидесяти до восьмидесяти 07.10.2026. Замер: из 2518
 * заголовков материалов ни один не длиннее 68 символов, а из 94 заголовков
 * стран выше семидесяти оказались два — те, где редактор написал длинную
 * фразу, и обрывались ровно они. Восемьдесят затрагивают только их и ничего
 * больше; что не поместится в выдачу, Google подрежет по ширине сам.
 *
 * Передавайте сюда только текст самой страницы, без уже добавленного суффикса.
 */
export function pageTitle(text: string, max = 60, hardMax = 80): Metadata['title'] {
  const budget = max - TITLE_SUFFIX.length;
  if (!text) return text;
  // Помещается вместе с брендом — пусть шаблон макета его и добавит.
  if (text.length <= budget) return text;
  // Не помещается, но остаётся читаемым целиком — отдаём без бренда.
  if (text.length <= hardMax) return { absolute: text };
  const cut = text.slice(0, hardMax - 1);
  const lastSpace = cut.lastIndexOf(' ');
  return { absolute: (lastSpace > hardMax * 0.6 ? cut.slice(0, lastSpace) : cut) + '…' };
}

/**
 * Заголовок страницы термина.
 *
 * Шаблон «{термин} — что это такое в крипто?» с брендом в шестьдесят символов
 * не влезает почти никогда, и прежний вызов с hardMax = 0 резал его всегда:
 * в выдачу уходило «DEX (decentralized exchange) — What Is It in…», где
 * оборвана ровно та часть, которая объясняет, что это за страница. Проверка
 * 07.10.2026: так выглядели 33 заголовка.
 *
 * Шаблон целиком — 86 терминов из 87 укладываются в семьдесят символов, и
 * столько Google показывает сам. Единственный, кто не укладывается (RLHF с
 * расшифровкой), получает заголовком сам термин: он осмысленный и без хвоста.
 */
export function termTitle(name: string, tail: string): string {
  const full = `${name}${tail}`;
  return full.length <= 70 ? full : name;
}

/**
 * Тот же расчёт, но строкой — для мест, где нужен именно текст: заголовок в
 * микроразметке, og:title, twitter:title.
 */
export function titleText(text: string, max = 60, hardMax = 80): string {
  const t = pageTitle(text, max, hardMax);
  return typeof t === 'string' ? t : (t as { absolute: string }).absolute;
}

/**
 * Builds the hreflang languages map, defaulting x-default to the English URL.
 *
 * Google recommends every hreflang set include an x-default annotation, and
 * Ahrefs flags its absence ("Missing x-default") site-wide otherwise. x-default
 * is a distinct annotation, not a language subtag, so pointing it at the same
 * URL as 'en' does NOT create "more than one page per language" — it's the
 * textbook pattern (en, ru, x-default=en).
 *
 * Pass an explicit xDefault to override; otherwise the 'en' entry is reused.
 */
export function buildLanguages(
  langs: Record<string, string>,
  xDefault?: string,
): Record<string, string> {
  const result = { ...langs };
  const fallback = xDefault ?? langs.en;
  if (fallback) {
    result['x-default'] = fallback;
  }
  return result;
}

export { BASE };
