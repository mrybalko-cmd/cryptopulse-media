import { MetadataRoute } from 'next';
import { fetchArticles, fetchSanityNews, fetchAuthors } from '@/lib/sanity';
import { GLOSSARY } from '@/lib/glossary';
import { AI_GLOSSARY } from '@/lib/aiGlossary';
import { COINS } from '@/lib/coins';
import { TOPIC_SLUGS, NEWS_TOPIC_SLUGS } from '@/lib/topics';

const BASE = 'https://cryptopulse.media';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articlesRu, articlesEn, newsRu, newsEn, authors] = await Promise.all([
    fetchArticles({ limit: 500, locale: 'ru' }),
    fetchArticles({ limit: 500, locale: 'en' }),
    fetchSanityNews({ limit: 1000, locale: 'ru' }),
    fetchSanityNews({ limit: 1000, locale: 'en' }),
    fetchAuthors(),
  ]);

  const STATIC_DATE = new Date('2026-06-01');

  // Listing pages: new content daily
  const listingPaths = ['', '/news', '/articles', '/articles/popular', '/news/popular', '/ai', '/ai/glossary', '/authors'];
  // Tool/asset pages: content changes but template doesn't
  const toolPaths = [
    '/calculators', '/calculators/wealth', '/calculators/converter', '/calendar', '/assets', '/altcoin-season', '/pulse', '/rates',
    ...COINS.filter(c => c.available).map(c => `/assets/${c.slug}`),
  ];
  // Info pages: rarely change
  const infoPaths = ['/privacy', '/disclaimer', '/advertising', '/glossary', '/faq', '/security', '/editorial-policy', '/about', '/fear-greed', '/regulation'];

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
      changeFrequency: 'daily' as const,
      priority: 0.8,
    })),
    ...articlesEn.map((a: any) => ({
      url: `${BASE}/en/articles/${a.slug.current}`,
      lastModified: new Date(a.publishedAt),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    })),
  ];

  const newsPages = [
    ...newsRu.map((n: any) => ({
      url: `${BASE}/ru/news/${n.slug.current}`,
      lastModified: new Date(n.publishedAt),
      changeFrequency: 'hourly' as const,
      priority: 0.9,
    })),
    ...newsEn.map((n: any) => ({
      url: `${BASE}/en/news/${n.slug.current}`,
      lastModified: new Date(n.publishedAt),
      changeFrequency: 'hourly' as const,
      priority: 0.9,
    })),
  ];

  const glossaryTermPages = GLOSSARY.flatMap(term => [
    { url: `${BASE}/ru/glossary/${term.slug}`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${BASE}/en/glossary/${term.slug}`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 },
  ]);

  const aiGlossaryTermPages = AI_GLOSSARY.flatMap(term => [
    { url: `${BASE}/ru/ai/glossary/${term.slug}`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${BASE}/en/ai/glossary/${term.slug}`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 },
  ]);

  const authorPages = (authors as any[]).flatMap((a: any) => [
    { url: `${BASE}/ru/authors/${a.slug}`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.7 },
    { url: `${BASE}/en/authors/${a.slug}`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.7 },
  ]);

  // Topic listing pages are secondary filter/navigation views over content
  // that's already listed (and crawled) elsewhere — priority/frequency
  // deliberately kept below real articles and news so they don't compete
  // with actual content for a crawl budget that's already constrained.
  const topicPages = TOPIC_SLUGS.flatMap(topic => [
    { url: `${BASE}/ru/articles/topic/${topic}`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.4 },
    { url: `${BASE}/en/articles/topic/${topic}`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.4 },
  ]);

  const newsTopicPages = NEWS_TOPIC_SLUGS.flatMap(topic => [
    { url: `${BASE}/ru/news/topic/${topic}`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.4 },
    { url: `${BASE}/en/news/topic/${topic}`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.4 },
  ]);

  return [...staticPages, ...articlePages, ...newsPages, ...glossaryTermPages, ...aiGlossaryTermPages, ...authorPages, ...topicPages, ...newsTopicPages];
}
