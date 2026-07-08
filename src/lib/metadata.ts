const BASE = 'https://cryptopulse.media';

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
    siteName: 'CryptoPulse.media',
    url: opts.url,
    title: opts.title,
    description: opts.description,
    images: [{ url: opts.image || fallbackImage }],
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
 * `title.template` appends " | CryptoPulse.media" (20 chars) — pass only the
 * page-specific text here, never a string that already includes the suffix.
 */
export function truncateTitle(text: string, max = 60, suffixLen = 20): string {
  const budget = max - suffixLen;
  if (!text || text.length <= budget) return text;
  const cut = text.slice(0, budget);
  const lastSpace = cut.lastIndexOf(' ');
  return (lastSpace > budget * 0.6 ? cut.slice(0, lastSpace) : cut) + '…';
}

/**
 * Builds the hreflang languages map without x-default duplication.
 *
 * x-default is omitted because for a bilingual EN/RU site it always equals the
 * 'en' entry, causing Ahrefs to flag "more than one page per language in hreflang".
 * The 'en' tag already signals Google to serve English as the fallback.
 *
 * Pass an explicit xDefault only when it differs from every language-specific URL
 * (e.g. a language-selector page). In all other cases it is dropped automatically.
 */
export function buildLanguages(
  langs: Record<string, string>,
  xDefault?: string,
): Record<string, string> {
  const result = { ...langs };
  if (xDefault && !Object.values(result).includes(xDefault)) {
    result['x-default'] = xDefault;
  }
  return result;
}

export { BASE };
