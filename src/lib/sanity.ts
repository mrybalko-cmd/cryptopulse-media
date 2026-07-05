import { createClient } from '@sanity/client';
import { unstable_cache } from 'next/cache';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'placeholder',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
});

const READ_CACHE_SECONDS = 300;

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
        `*[_type == "article" && language == $locale && publishedAt <= now()] | order(publishedAt desc) [0...$limit] {
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
        `*[_type == "article" && slug.current == $slug && language == $locale && publishedAt <= now()][0] {
          _id, _updatedAt, title, excerpt, slug, publishedAt, readingTime, badge, body, views, seo, commentsEnabled,
          "coverImage": coverImage.asset->url,
          "translation": translationRef->{language, "slug": slug.current},
          "author": author->{name, "slug": slug.current, roleRu, roleEn, bioRu, bioEn, telegram, linkedin, facebook, twitter, "photo": photo.asset->url}
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
        `*[_type == "news" && language == $locale && publishedAt <= now()] | order(select(pinnedUntil > now() => 0, 1) asc, publishedAt desc) [0...$limit] {
          _id, title, excerpt, slug, publishedAt, pinnedUntil, breaking, views,
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
      `*[(_type == "article" || _type == "news") && language == $locale && publishedAt <= now() && title match $q] | order(publishedAt desc) [0...15] {
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
        `*[_type == "news" && slug.current == $slug && language == $locale && publishedAt <= now()][0] {
          _id, _updatedAt, title, excerpt, slug, publishedAt, body, sourceName, sourceUrl, breaking, views, seo, commentsEnabled,
          "coverImage": coverImage.asset->url,
          "translation": translationRef->{language, "slug": slug.current},
          "author": author->{name, "slug": slug.current, roleRu, roleEn, bioRu, bioEn, telegram, linkedin, facebook, twitter, "photo": photo.asset->url}
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

export interface SanityComment {
  _id: string;
  authorName: string;
  text: string;
  createdAt: string;
  parentId: string | null;
}

export const fetchComments = unstable_cache(
  async (targetId: string): Promise<SanityComment[]> => {
    if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return [];
    try {
      return await client.fetch(
        `*[_type == "comment" && target._ref == $targetId && approved == true] | order(createdAt asc) {
          _id, authorName, text, createdAt, "parentId": parentComment._ref
        }`,
        { targetId }
      );
    } catch {
      return [];
    }
  },
  ['fetchComments'],
  { revalidate: 20 }
);

export async function isCommentingAllowed(targetId: string) {
  try {
    const doc = await client.fetch(`*[_id == $targetId][0]{ commentsEnabled }`, { targetId });
    return doc ? doc.commentsEnabled !== false : false;
  } catch {
    return false;
  }
}

export async function countRecentCommentsByIpHash(ipHash: string, sinceISO: string) {
  if (!process.env.SANITY_API_WRITE_TOKEN) return 0;
  try {
    return await writeClient.fetch(
      `count(*[_type == "comment" && ipHash == $ipHash && createdAt > $sinceISO])`,
      { ipHash, sinceISO }
    );
  } catch {
    return 0;
  }
}

export async function createComment(input: {
  authorName: string;
  text: string;
  targetId: string;
  parentCommentId?: string;
  ipHash: string;
}) {
  if (!process.env.SANITY_API_WRITE_TOKEN) throw new Error('Sanity write token not configured');
  await writeClient.create({
    _type: 'comment',
    authorName: input.authorName,
    text: input.text,
    target: { _type: 'reference', _weak: true, _ref: input.targetId },
    ...(input.parentCommentId
      ? { parentComment: { _type: 'reference', _weak: true, _ref: input.parentCommentId } }
      : {}),
    approved: false,
    createdAt: new Date().toISOString(),
    ipHash: input.ipHash,
  });
}

export interface CalendarEvent {
  _id: string;
  title: { ru: string; en: string };
  slug: string;
  description?: { ru?: string; en?: string };
  date: string;
  category: string;
  importance: 'low' | 'medium' | 'high';
  iconUrl: string | null;
  sourceUrl: string | null;
  likes: number;
  dislikes: number;
}

export const fetchCalendarEvents = unstable_cache(
  async (): Promise<CalendarEvent[]> => {
    if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return [];
    try {
      return await client.fetch(
        `*[_type == "calendarEvent"] | order(date asc) {
          _id, title, "slug": slug.current, description, date, category, importance,
          "iconUrl": icon.asset->url, sourceUrl,
          "likes": coalesce(likes, 0), "dislikes": coalesce(dislikes, 0)
        }`
      );
    } catch {
      return [];
    }
  },
  ['fetchCalendarEvents'],
  { revalidate: READ_CACHE_SECONDS }
);

export async function recordEventVote(eventId: string, vote: 'like' | 'dislike', ipHash: string) {
  if (!process.env.SANITY_API_WRITE_TOKEN) throw new Error('Sanity write token not configured');

  const field = vote === 'like' ? 'likes' : 'dislikes';
  const otherField = vote === 'like' ? 'dislikes' : 'likes';

  const existing = await writeClient.fetch(
    `*[_type == "eventVote" && event._ref == $eventId && ipHash == $ipHash][0]{ _id, vote }`,
    { eventId, ipHash }
  );

  if (!existing) {
    await writeClient
      .patch(eventId)
      .setIfMissing({ likes: 0, dislikes: 0 })
      .inc({ [field]: 1 })
      .commit({ autoGenerateArrayKeys: false });
    await writeClient.create({
      _type: 'eventVote',
      event: { _type: 'reference', _weak: true, _ref: eventId },
      ipHash,
      vote,
    });
    return { action: 'added' as const, vote: vote as 'like' | 'dislike' | null };
  }

  if (existing.vote === vote) {
    await writeClient.patch(eventId).dec({ [field]: 1 }).commit({ autoGenerateArrayKeys: false });
    await writeClient.delete(existing._id);
    return { action: 'removed' as const, vote: null };
  }

  await writeClient
    .patch(eventId)
    .dec({ [otherField]: 1 })
    .inc({ [field]: 1 })
    .commit({ autoGenerateArrayKeys: false });
  await writeClient.patch(existing._id).set({ vote }).commit({ autoGenerateArrayKeys: false });
  return { action: 'switched' as const, vote: vote as 'like' | 'dislike' | null };
}

export const fetchRelatedArticles = unstable_cache(
  async (excludeId: string, locale: string, limit = 4) => {
    if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return [];
    try {
      return await client.fetch(
        `*[_type == "article" && language == $locale && publishedAt <= now() && _id != $excludeId] | order(publishedAt desc) [0...$limit] {
          _id, title, excerpt, slug, publishedAt, readingTime, badge, views,
          "coverImage": coverImage.asset->url
        }`,
        { locale, excludeId, limit }
      );
    } catch {
      return [];
    }
  },
  ['fetchRelatedArticles'],
  { revalidate: READ_CACHE_SECONDS }
);

export const fetchRelatedNews = unstable_cache(
  async (excludeId: string, locale: string, limit = 4) => {
    if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return [];
    try {
      return await client.fetch(
        `*[_type == "news" && language == $locale && publishedAt <= now() && _id != $excludeId] | order(publishedAt desc) [0...$limit] {
          _id, title, excerpt, slug, publishedAt,
          "coverImage": coverImage.asset->url
        }`,
        { locale, excludeId, limit }
      );
    } catch {
      return [];
    }
  },
  ['fetchRelatedNews'],
  { revalidate: READ_CACHE_SECONDS }
);

export interface PopularItem {
  _type: 'article' | 'news';
  _id: string;
  title: string;
  slug: string;
  views: number;
}

// ── Authors ──────────────────────────────────────────────────────────────────

export const fetchAuthors = unstable_cache(
  async () => {
    if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return [];
    try {
      return await client.fetch(
        `*[_type == "author"] | order(name asc) {
          _id, name, "slug": slug.current, roleRu, roleEn, bioRu, bioEn,
          "photo": photo.asset->url, telegram, linkedin, facebook, twitter
        }`
      );
    } catch {
      return [];
    }
  },
  ['fetchAuthors'],
  { revalidate: READ_CACHE_SECONDS }
);

export const fetchAuthorBySlug = unstable_cache(
  async (slug: string) => {
    if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return null;
    try {
      return await client.fetch(
        `*[_type == "author" && slug.current == $slug][0] {
          _id, name, "slug": slug.current, roleRu, roleEn, bioRu, bioEn,
          "photo": photo.asset->url, telegram, linkedin, facebook, twitter
        }`,
        { slug }
      );
    } catch {
      return null;
    }
  },
  ['fetchAuthorBySlug'],
  { revalidate: READ_CACHE_SECONDS }
);

export const fetchAuthorContent = unstable_cache(
  async (authorSlug: string, locale: string) => {
    if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return { articles: [], news: [] };
    try {
      const [articles, news] = await Promise.all([
        client.fetch(
          `*[_type == "article" && author->slug.current == $slug && language == $locale && publishedAt <= now()] | order(publishedAt desc) [0...20] {
            _id, title, excerpt, slug, publishedAt, readingTime, badge, views,
            "coverImage": coverImage.asset->url
          }`,
          { slug: authorSlug, locale }
        ),
        client.fetch(
          `*[_type == "news" && author->slug.current == $slug && language == $locale && publishedAt <= now()] | order(publishedAt desc) [0...20] {
            _id, title, slug, publishedAt, views,
            "coverImage": coverImage.asset->url
          }`,
          { slug: authorSlug, locale }
        ),
      ]);
      return { articles, news };
    } catch {
      return { articles: [], news: [] };
    }
  },
  ['fetchAuthorContent'],
  { revalidate: READ_CACHE_SECONDS }
);

// ── Article Topics ────────────────────────────────────────────────────────────

export const fetchArticlesByTopic = unstable_cache(
  async (topic: string, locale: string, limit = 30) => {
    if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return [];
    try {
      return await client.fetch(
        `*[_type == "article" && topic == $topic && language == $locale && publishedAt <= now()] | order(publishedAt desc) [0...$limit] {
          _id, title, excerpt, slug, publishedAt, readingTime, badge, views, topic,
          "coverImage": coverImage.asset->url
        }`,
        { topic, locale, limit }
      );
    } catch {
      return [];
    }
  },
  ['fetchArticlesByTopic'],
  { revalidate: READ_CACHE_SECONDS }
);

export const fetchPopularContent = unstable_cache(
  async (locale: string, limit = 6): Promise<PopularItem[]> => {
    if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return [];
    try {
      return await client.fetch(
        `*[(_type == "article" || _type == "news") && language == $locale && publishedAt <= now()] | order(coalesce(views, 0) desc, publishedAt desc) [0...$limit] {
          _type, _id, title, "slug": slug.current, "views": coalesce(views, 0)
        }`,
        { locale, limit }
      );
    } catch {
      return [];
    }
  },
  ['fetchPopularContent'],
  { revalidate: READ_CACHE_SECONDS }
);
