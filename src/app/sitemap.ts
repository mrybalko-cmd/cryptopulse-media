import { MetadataRoute } from 'next';
import { fetchArticles } from '@/lib/sanity';

const BASE = 'https://cryptopulse.media';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articlesRu, articlesEn] = await Promise.all([
    fetchArticles({ limit: 100, locale: 'ru' }),
    fetchArticles({ limit: 100, locale: 'en' }),
  ]);

  const staticPages = ['', '/news', '/articles', '/interviews'].flatMap(path => [
    { url: `${BASE}/ru${path}`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: path === '' ? 1 : 0.8 },
    { url: `${BASE}/en${path}`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: path === '' ? 1 : 0.8 },
  ]);

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

  return [...staticPages, ...articlePages];
}
