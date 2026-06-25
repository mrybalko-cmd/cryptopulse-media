import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'placeholder',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
});

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

export async function fetchArticles({ limit = 10, locale = 'ru' }: FetchArticlesOptions = {}) {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return [];
  try {
    return await client.fetch(
      `*[_type == "article" && language == $locale] | order(publishedAt desc) [0...$limit] {
        _id, title, excerpt, slug, publishedAt, readingTime,
        "coverImage": coverImage.asset->url
      }`,
      { locale, limit }
    );
  } catch {
    return [];
  }
}

export async function fetchArticleBySlug(slug: string, locale: string) {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return null;
  try {
    return await client.fetch(
      `*[_type == "article" && slug.current == $slug && language == $locale][0] {
        _id, title, excerpt, slug, publishedAt, readingTime, body, views, seo,
        "coverImage": coverImage.asset->url
      }`,
      { slug, locale }
    );
  } catch {
    return null;
  }
}

export async function fetchSanityNews({ limit = 10, locale = 'ru' }: FetchArticlesOptions = {}) {
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
}

export async function fetchNewsBySlug(slug: string, locale: string) {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return null;
  try {
    return await client.fetch(
      `*[_type == "news" && slug.current == $slug && language == $locale][0] {
        _id, title, excerpt, slug, publishedAt, body, sourceName, sourceUrl, views, seo,
        "coverImage": coverImage.asset->url
      }`,
      { slug, locale }
    );
  } catch {
    return null;
  }
}
