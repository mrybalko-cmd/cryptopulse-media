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

export function truncateDesc(text: string, max = 155): string {
  if (!text || text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(' ');
  return (lastSpace > 100 ? cut.slice(0, lastSpace) : cut) + '…';
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
 * Передавайте сюда только текст самой страницы, без уже добавленного суффикса.
 */
export function pageTitle(text: string, max = 60, hardMax = 70): Metadata['title'] {
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
 * Тот же расчёт, но строкой — для мест, где нужен именно текст: заголовок в
 * микроразметке, og:title, twitter:title.
 */
export function titleText(text: string, max = 60, hardMax = 70): string {
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
