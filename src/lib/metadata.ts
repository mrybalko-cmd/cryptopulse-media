import { SITE_NAME, SITE_URL } from '@/lib/site';
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
 * Truncates a page title so it stays readable once the root layout's
 * `title.template` appends ` | ${SITE_NAME}` (20 chars) — pass only the
 * page-specific text here, never a string that already includes the suffix.
 */
export function truncateTitle(text: string, max = 60, suffixLen = 20): string {
  const budget = max - suffixLen;
  if (!text || text.length <= budget) return text;
  // The ellipsis is a character too. Without reserving room for it every
  // truncated title came out one over the limit — 40 + '…' + the 20-char
  // suffix is 61, which is exactly what the audit kept flagging.
  const cut = text.slice(0, budget - 1);
  const lastSpace = cut.lastIndexOf(' ');
  return (lastSpace > budget * 0.6 ? cut.slice(0, lastSpace) : cut) + '…';
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
