import { MetadataRoute } from 'next';
import { fetchArticles, fetchSanityNews } from '@/lib/sanity';
import { GLOSSARY } from '@/lib/glossary';

const BASE = 'https://cryptopulse.media';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articlesRu, articlesEn, newsRu, newsEn] = await Promise.all([
    fetchArticles({ limit: 100, locale: 'ru' }),
    fetchArticles({ limit: 100, locale: 'en' }),
    fetchSanityNews({ limit: 200, locale: 'ru' }),
    fetchSanityNews({ limit: 200, locale: 'en' }),
  ]);

  const STATIC_DATE = new Date('2026-06-01');

  // Listing pages: new content daily
  const listingPaths = ['', '/news', '/articles', '/interviews'];
  // Tool/asset pages: content changes but template doesn't
  const toolPaths = ['/calculators', '/calculators/wealth', '/calculators/converter', '/calendar', '/assets', '/assets/bitcoin', '/assets/ethereum', '/assets/solana', '/assets/xrp', '/assets/bnb', '/assets/doge', '/assets/ada', '/assets/ton', '/assets/avax', '/assets/trx', '/assets/dot', '/assets/link', '/assets/ltc', '/assets/shib'];
  // Info pages: rarely change
  const infoPaths = ['/privacy', '/disclaimer', '/advertising', '/glossary', '/faq', '/security', '/editorial-policy', '/about'];

  const staticPages = [
    ...listingPaths.flatMap(path => [
      { url: `${BASE}/ru${path}`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: path === '' ? 1 : 0.9 },
      { url: `${BASE}/en${path}`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: path === '' ? 1 : 0.9 },
    ]),
    ...toolPaths.flatMap(path => [
      { url: `${BASE}/ru${path}`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.7 },
      { url: `${BASE}/en${path}`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.7 },
    ]),
    ...infoPaths.flatMap(path => [
      { url: `${BASE}/ru${path}`, lastModified: STATIC_DATE, changeFrequency: 'monthly' as const, priority: 0.5 },
      { url: `${BASE}/en${path}`, lastModified: STATIC_DATE, changeFrequency: 'monthly' as const, priority: 0.5 },
    ]),
  ];

  const articlePages = [
    ...articlesRu.map((a: any) => ({
      url: `${BASE}/ru/articles/${a.slug.current}`,
      lastModified: new Date(a.publishedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
    ...articlesEn.map((a: any) => ({
      url: `${BASE}/en/articles/${a.slug.current}`,
      lastModified: new Date(a.publishedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
  ];

  const newsPages = [
    ...newsRu.map((n: any) => ({
      url: `${BASE}/ru/news/${n.slug.current}`,
      lastModified: new Date(n.publishedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    })),
    ...newsEn.map((n: any) => ({
      url: `${BASE}/en/news/${n.slug.current}`,
      lastModified: new Date(n.publishedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    })),
  ];

  const glossaryTermPages = GLOSSARY.flatMap(term => [
    { url: `${BASE}/ru/glossary/${term.slug}`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${BASE}/en/glossary/${term.slug}`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 },
  ]);

  return [...staticPages, ...articlePages, ...newsPages, ...glossaryTermPages];
}
