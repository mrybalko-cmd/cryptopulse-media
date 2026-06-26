import { createClient } from '@sanity/client';
import { unstable_cache } from 'next/cache';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'placeholder',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
});

// Short cache window: keeps repeat page loads fast while bounding how long a
// deleted/edited document can keep appearing on the site to ~45s.
const READ_CACHE_SECONDS = 45;

const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'placeholder',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

export async function incrementViews(id: string) {
  if (!process.env.SANITY_API_WRITE_TOKEN) return;
  try {
    await writeClient.patch(id).setIfMissing({ views: 0 }).inc({ views: 1 }).commit({ autoGenerateArrayKeys: false });
  } catch {
    // view counting is best-effort, never block rendering on it
  }
}

interface FetchArticlesOptions {
  limit?: number;
  locale?: string;
  slug?: string;
}

export const fetchArticles = unstable_cache(
  async ({ limit = 10, locale = 'ru' }: FetchArticlesOptions = {}) => {
    if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return [];
    try {
      return await client.fetch(
        `*[_type == "article" && language == $locale] | order(publishedAt desc) [0...$limit] {
          _id, title, excerpt, slug, publishedAt, readingTime, badge, views,
          "coverImage": coverImage.asset->url
        }`,
        { locale, limit }
      );
    } catch {
      return [];
    }
  },
  ['fetchArticles'],
  { revalidate: READ_CACHE_SECONDS }
);

export const fetchArticleBySlug = unstable_cache(
  async (slug: string, locale: string) => {
    if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return null;
    try {
      return await client.fetch(
        `*[_type == "article" && slug.current == $slug && language == $locale][0] {
          _id, _updatedAt, title, excerpt, slug, publishedAt, readingTime, badge, body, views, seo,
          "coverImage": coverImage.asset->url,
          "translation": translationRef->{language, "slug": slug.current}
        }`,
        { slug, locale }
      );
    } catch {
      return null;
    }
  },
  ['fetchArticleBySlug'],
  { revalidate: READ_CACHE_SECONDS }
);

export const fetchSanityNews = unstable_cache(
  async ({ limit = 10, locale = 'ru' }: FetchArticlesOptions = {}) => {
    if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return [];
    try {
      return await client.fetch(
        `*[_type == "news" && language == $locale] | order(publishedAt desc) [0...$limit] {
          _id, title, excerpt, slug, publishedAt,
          "coverImage": coverImage.asset->url
        }`,
        { locale, limit }
      );
    } catch {
      return [];
    }
  },
  ['fetchSanityNews'],
  { revalidate: READ_CACHE_SECONDS }
);

export async function searchContent(query: string, locale: string) {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || !query.trim()) return [];
  try {
    return await client.fetch(
      `*[(_type == "article" || _type == "news") && language == $locale && title match $q] | order(publishedAt desc) [0...15] {
        _type, title, publishedAt, "slug": slug.current
      }`,
      { locale, q: `*${query.trim()}*` }
    );
  } catch {
    return [];
  }
}

export const fetchNewsBySlug = unstable_cache(
  async (slug: string, locale: string) => {
    if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return null;
    try {
      return await client.fetch(
        `*[_type == "news" && slug.current == $slug && language == $locale][0] {
          _id, _updatedAt, title, excerpt, slug, publishedAt, body, sourceName, sourceUrl, views, seo,
          "coverImage": coverImage.asset->url,
          "translation": translationRef->{language, "slug": slug.current}
        }`,
        { slug, locale }
      );
    } catch {
      return null;
    }
  },
  ['fetchNewsBySlug'],
  { revalidate: READ_CACHE_SECONDS }
);
