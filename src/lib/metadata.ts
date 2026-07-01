const BASE = 'https://cryptopulse.media';

export function buildOg(opts: {
  url: string;
  title: string;
  description: string;
  locale: string;
  type?: 'website' | 'article';
  image?: string;
}) {
  return {
    type: (opts.type ?? 'website') as 'website' | 'article',
    locale: opts.locale === 'ru' ? 'ru_RU' : 'en_US',
    siteName: 'CryptoPulse.media',
    url: opts.url,
    title: opts.title,
    description: opts.description,
    ...(opts.image ? { images: [{ url: opts.image }] } : {}),
  };
}

export { BASE };
