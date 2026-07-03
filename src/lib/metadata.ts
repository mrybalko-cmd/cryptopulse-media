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

export { BASE };
