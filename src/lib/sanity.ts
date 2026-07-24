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

export interface SidebarBannerItem {
  _id: string;
  title: string;
  image: string;
  altText: string;
  weight: number;
}

export const fetchActiveBanners = unstable_cache(
  async (locale: string, limit = 5): Promise<SidebarBannerItem[]> => {
    if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return [];
    try {
      return await client.fetch(
        `*[_type == "sidebarBanner" && active == true
          && (language == "all" || !defined(language) || language == $locale)
          && (!defined(startAt) || startAt <= now())
          && (!defined(endAt) || endAt >= now())
        ] | order(_createdAt desc) [0...$limit] {
          _id, title, "image": image.asset->url, altText, "weight": coalesce(weight, 1)
        }`,
        { locale, limit }
      );
    } catch {
      return [];
    }
  },
  ['fetchActiveBanners'],
  { revalidate: READ_CACHE_SECONDS }
);

export async function incrementBannerImpression(id: string) {
  if (!process.env.SANITY_API_WRITE_TOKEN) return;
  try {
    await writeClient.patch(id).setIfMissing({ impressions: 0 }).inc({ impressions: 1 }).commit({ autoGenerateArrayKeys: false });
  } catch {
    // impression counting is best-effort, never block rendering on it
  }
}

// Increments the click counter and returns the banner's destination link in
// one round trip — commit() already returns the full patched document, so a
// separate read query isn't needed. The redirect route resolves the target
// URL server-side from the banner id rather than trusting a client-supplied
// URL, which would otherwise be an open-redirect vector.
export async function incrementBannerClick(id: string): Promise<string | null> {
  if (!process.env.SANITY_API_WRITE_TOKEN) return null;
  try {
    const doc = await writeClient
      .patch(id)
      .setIfMissing({ clicks: 0 })
      .inc({ clicks: 1 })
      .commit({ autoGenerateArrayKeys: false });
    return typeof doc.link === 'string' ? doc.link : null;
  } catch {
    return null;
  }
}

export async function setLike(id: string, liked: boolean): Promise<number | null> {
  if (!process.env.SANITY_API_WRITE_TOKEN) return null;
  try {
    const doc = await writeClient
      .patch(id)
      .setIfMissing({ likes: 0 })
      .inc({ likes: liked ? 1 : -1 })
      .commit({ autoGenerateArrayKeys: false });
    const likes = typeof doc.likes === 'number' ? doc.likes : 0;
    return Math.max(0, likes);
  } catch {
    return null;
  }
}

interface FetchArticlesOptions {
  limit?: number;
  locale?: string;
  slug?: string;
  offset?: number;
}

export async function fetchArticles({ limit = 10, locale = 'ru', offset = 0 }: FetchArticlesOptions = {}) {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return [];
  try {
    return await client.fetch(
      `*[_type == "article" && language == $locale && publishedAt <= now()] | order(publishedAt desc) [$offset...$end] {
        _id, title, excerpt, slug, publishedAt, readingTime, badge, views, likes,
        "coverImage": coverImage.asset->url,
        "coverImageAlt": coverImage.alt
      }`,
      { locale, offset, end: offset + limit }
    );
  } catch {
    return [];
  }
}

export const fetchArticleBySlug = unstable_cache(
  async (slug: string, locale: string) => {
    if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return null;
    try {
      return await client.fetch(
        `*[_type == "article" && slug.current == $slug && language == $locale && publishedAt <= now()][0] {
          _id, _updatedAt, title, excerpt, slug, publishedAt, readingTime, badge, body, topic, views, likes, seo, commentsEnabled, updatedAt,
          "coverImage": coverImage.asset->url,
          "coverImageAlt": coverImage.alt,
          "seoOgImageUrl": seo.ogImage.asset->url,
          "translation": translationRef->{language, "slug": slug.current},
          "author": author->{name, "slug": slug.current, roleRu, roleEn, bioRu, bioEn, email, telegram, linkedin, facebook, twitter, "photo": photo.asset->url}
        }`,
        { slug, locale }
      );
    } catch {
      return null;
    }
  },
  ['fetchArticleBySlug'],
  { revalidate: READ_CACHE_SECONDS, tags: ['articles'] }
);

export async function fetchSanityNews({ limit = 10, locale = 'ru', offset = 0 }: FetchArticlesOptions = {}) {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return [];
  try {
    return await client.fetch(
      `*[_type == "news" && language == $locale && publishedAt <= now()] | order(select(pinnedUntil > now() => 0, 1) asc, publishedAt desc) [$offset...$end] {
        _id, title, excerpt, slug, publishedAt, pinnedUntil, breaking, ownBadge, badge, topic, views, likes,
        "coverImage": coverImage.asset->url
      }`,
      { locale, offset, end: offset + limit }
    );
  } catch {
    return [];
  }
}

export const fetchNewsByTopic = unstable_cache(
  async (topic: string, locale: string, limit = 50) => {
    if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return [];
    try {
      return await client.fetch(
        `*[_type == "news" && language == $locale && topic == $topic && publishedAt <= now()] | order(publishedAt desc) [0...$limit] {
          _id, title, excerpt, slug, publishedAt, breaking, ownBadge, badge, views,
          "coverImage": coverImage.asset->url
        }`,
        { locale, topic, limit }
      );
    } catch {
      return [];
    }
  },
  ['fetchNewsByTopic'],
  { revalidate: READ_CACHE_SECONDS, tags: ['news'] }
);

// Single combined query (not two separate per-type fetches merged in JS) so
// offset/limit pagination slices one real chronological feed — matches
// fetchAuthorFeed's approach, needed for /ai/page/[n] to paginate cleanly.
export async function fetchAIContent(
  locale: string,
  limit = 20,
  offset = 0
): Promise<{ items: AuthorFeedItem[]; total: number }> {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return { items: [], total: 0 };
  try {
    const result = await client.fetch(
      `{
        "items": *[_type in ["article", "news"] && language == $locale && topic == "ai" && publishedAt <= now()] | order(publishedAt desc) [$offset...$end] {
          _type, _id, title, excerpt, slug, publishedAt, readingTime, badge, views, likes,
          "coverImage": coverImage.asset->url,
          "coverImageAlt": coverImage.alt
        },
        "total": count(*[_type in ["article", "news"] && language == $locale && topic == "ai" && publishedAt <= now()])
      }`,
      { locale, offset, end: offset + limit }
    );
    return result;
  } catch {
    return { items: [], total: 0 };
  }
}

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
          _id, _updatedAt, title, excerpt, slug, publishedAt, body, sourceName, sourceUrl, breaking, badge, topic, views, likes, seo, commentsEnabled, updatedAt,
          "coverImage": coverImage.asset->url,
          "coverImageAlt": coverImage.alt,
          "seoOgImageUrl": seo.ogImage.asset->url,
          "translation": translationRef->{language, "slug": slug.current},
          "author": author->{name, "slug": slug.current, roleRu, roleEn, bioRu, bioEn, email, telegram, linkedin, facebook, twitter, "photo": photo.asset->url}
        }`,
        { slug, locale }
      );
    } catch {
      return null;
    }
  },
  ['fetchNewsBySlug'],
  { revalidate: READ_CACHE_SECONDS, tags: ['news'] }
);

// Single chronologically-previous article/news, full body included — powers
// the mobile infinite feed (client-fetched per scroll, never part of the
// initial SSR HTML, so it can't create duplicate-content risk on the
// current article's own indexed URL).
export async function fetchPreviousItem(type: 'article' | 'news', locale: string, beforePublishedAt: string) {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return null;
  try {
    return await client.fetch(
      `*[_type == $type && language == $locale && publishedAt <= now() && publishedAt < $before] | order(publishedAt desc) [0] {
        _id, _type, title, excerpt, slug, publishedAt, body, readingTime, badge, commentsEnabled,
        sourceName, sourceUrl, breaking,
        "coverImage": coverImage.asset->url,
        "coverImageAlt": coverImage.alt,
        "author": author->{name, "slug": slug.current, roleRu, roleEn, bioRu, bioEn, email, telegram, linkedin, facebook, twitter, "photo": photo.asset->url}
      }`,
      { type, locale, before: beforePublishedAt }
    );
  } catch {
    return null;
  }
}

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
          _id, title, excerpt, slug, publishedAt, readingTime, badge, views, likes,
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
          "photo": photo.asset->url, email, telegram, linkedin, facebook, twitter
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
          "photo": photo.asset->url, email, telegram, linkedin, facebook, twitter
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

export interface AuthorFeedItem {
  _type: 'article' | 'news';
  _id: string;
  title: string;
  excerpt?: string;
  slug: { current: string };
  publishedAt: string;
  readingTime?: number;
  badge?: string;
  views?: number;
  likes?: number;
  coverImage?: string;
  coverImageAlt?: string;
}

// Articles and news are merged into a single chronological feed (not two
// separately-paginated sections) so an author's page count only depends on
// their total output, not on hitting a per-type page boundary at different
// times — see fetchAuthorFeed's pagination.
export const fetchAuthorFeed = unstable_cache(
  async (authorSlug: string, locale: string, limit = 20, offset = 0): Promise<{ items: AuthorFeedItem[]; total: number }> => {
    if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return { items: [], total: 0 };
    try {
      const result = await client.fetch(
        `{
          "items": *[_type in ["article", "news"] && author->slug.current == $slug && language == $locale && publishedAt <= now()] | order(publishedAt desc) [$offset...$end] {
            _type, _id, title, excerpt, slug, publishedAt, readingTime, badge, views, likes,
            "coverImage": coverImage.asset->url,
            "coverImageAlt": coverImage.alt
          },
          "total": count(*[_type in ["article", "news"] && author->slug.current == $slug && language == $locale && publishedAt <= now()])
        }`,
        { slug: authorSlug, locale, offset, end: offset + limit }
      );
      return result;
    } catch {
      return { items: [], total: 0 };
    }
  },
  ['fetchAuthorFeed'],
  { revalidate: READ_CACHE_SECONDS }
);

export interface AuthorWithLatest {
  _id: string;
  name: string;
  slug: string;
  roleRu?: string;
  roleEn?: string;
  photo?: string;
  latest: { _type: 'article' | 'news'; title: string; slug: string } | null;
}

export interface HomeSettings {
  showNews: boolean;
  showArticles: boolean;
  showAuthorColumns: boolean;
  featuredAuthors: AuthorWithLatest[];
}

// Single round trip: the singleton doc's `featuredAuthors[]` array preserves
// editor-controlled display order from Studio. Each slot manually pairs an
// author with a specific material per language (materialRu/materialEn) —
// not necessarily that author's own latest piece — so the editor can, say,
// put a senior author's face next to whichever article they want to push
// this week, on both locale homepages correctly.
export const fetchHomeSettings = unstable_cache(
  async (locale: string): Promise<HomeSettings> => {
    const fallback: HomeSettings = { showNews: true, showArticles: true, showAuthorColumns: true, featuredAuthors: [] };
    if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return fallback;
    try {
      const materialField = locale === 'ru' ? 'materialRu' : 'materialEn';
      const doc = await client.fetch(
        `*[_type == "homeSettings"][0] {
          showNews, showArticles, showAuthorColumns,
          "featuredAuthors": featuredAuthors[] {
            "_id": author->_id,
            "name": author->name,
            "slug": author->slug.current,
            "roleRu": author->roleRu,
            "roleEn": author->roleEn,
            "photo": author->photo.asset->url,
            "latest": ${materialField}-> { _type, title, "slug": slug.current }
          }
        }`,
        { locale }
      );
      if (!doc) return fallback;
      return {
        showNews: doc.showNews ?? true,
        showArticles: doc.showArticles ?? true,
        showAuthorColumns: doc.showAuthorColumns ?? true,
        featuredAuthors: (doc.featuredAuthors || []).filter((a: AuthorWithLatest) => a._id && a.latest),
      };
    } catch {
      return fallback;
    }
  },
  ['fetchHomeSettings'],
  { revalidate: READ_CACHE_SECONDS }
);

// ── Article Topics ────────────────────────────────────────────────────────────

export const fetchArticlesByTopic = unstable_cache(
  async (topic: string, locale: string, limit = 30) => {
    if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return [];
    try {
      return await client.fetch(
        `*[_type == "article" && topic == $topic && language == $locale && publishedAt <= now()] | order(publishedAt desc) [0...$limit] {
          _id, title, excerpt, slug, publishedAt, readingTime, badge, views, likes, topic,
          "coverImage": coverImage.asset->url,
          "coverImageAlt": coverImage.alt
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

// Per-topic published-doc counts, so callers (sitemap generation) can mirror
// the "thin topic" noindex threshold used by the topic pages themselves
// (see isThin in articles/topic/[topic] and news/topic/[topic] page.tsx)
// instead of unconditionally listing every topic slug.
export const fetchTopicCounts = unstable_cache(
  async (type: 'article' | 'news', locale: string): Promise<Record<string, number>> => {
    if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return {};
    try {
      const topics: string[] = await client.fetch(
        `*[_type == $type && language == $locale && publishedAt <= now() && defined(topic)].topic`,
        { type, locale }
      );
      return topics.reduce((acc: Record<string, number>, t: string) => {
        acc[t] = (acc[t] ?? 0) + 1;
        return acc;
      }, {});
    } catch {
      return {};
    }
  },
  ['fetchTopicCounts'],
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

export interface TopLikedItem {
  _id: string;
  title: string;
  excerpt?: string;
  slug: { current: string };
  publishedAt: string;
  readingTime?: number;
  badge?: string;
  views: number;
  likes: number;
  topic?: string;
  coverImage?: string;
  coverImageAlt?: string;
  breaking?: boolean;
  ownBadge?: boolean;
}

export const fetchTopLikedArticles = unstable_cache(
  async (locale: string, limit = 30): Promise<TopLikedItem[]> => {
    if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return [];
    try {
      return await client.fetch(
        `*[_type == "article" && language == $locale && publishedAt <= now() && coalesce(likes, 0) > 0] | order(likes desc, views desc, publishedAt desc) [0...$limit] {
          _id, title, excerpt, slug, publishedAt, readingTime, badge, views, likes, topic,
          "coverImage": coverImage.asset->url,
          "coverImageAlt": coverImage.alt
        }`,
        { locale, limit }
      );
    } catch {
      return [];
    }
  },
  ['fetchTopLikedArticles'],
  { revalidate: READ_CACHE_SECONDS }
);

export const fetchTopLikedNews = unstable_cache(
  async (locale: string, limit = 30): Promise<TopLikedItem[]> => {
    if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return [];
    try {
      return await client.fetch(
        `*[_type == "news" && language == $locale && publishedAt <= now() && coalesce(likes, 0) > 0] | order(likes desc, views desc, publishedAt desc) [0...$limit] {
          _id, title, slug, publishedAt, views, likes, breaking, ownBadge, badge,
          "coverImage": coverImage.asset->url
        }`,
        { locale, limit }
      );
    } catch {
      return [];
    }
  },
  ['fetchTopLikedNews'],
  { revalidate: READ_CACHE_SECONDS }
);

// ── Pulse of the Day ────────────────────────────────────────────────────────
// One document per day, written once by the cron job in
// /api/cron/pulse-snapshot. Everything the site reads (widget, /pulse page,
// share-card image) reads the latest stored snapshot instead of recomputing
// the three-source blend on every request.

export interface MarketSnapshot {
  _id: string;
  date: string;
  totalVolume24h: number;
  fearGreedValue: number;
  altSeasonValue: number;
  volumeChangePct: number;
  pulseScore: number;
  pulseClassification: string;
  computedAt: string;
}

export async function saveMarketSnapshot(snapshot: Omit<MarketSnapshot, '_id'>): Promise<void> {
  if (!process.env.SANITY_API_WRITE_TOKEN) return;
  try {
    await writeClient.create({ _type: 'marketSnapshot', ...snapshot });
  } catch {
    // best-effort — a missed daily snapshot just means the next cron run
    // falls back to a wider baseline gap, not a broken page
  }
}

export const fetchRecentMarketSnapshots = unstable_cache(
  async (limit = 7): Promise<MarketSnapshot[]> => {
    if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return [];
    try {
      return await client.fetch(
        `*[_type == "marketSnapshot"] | order(computedAt desc) [0...$limit] {
          _id, date, totalVolume24h, fearGreedValue, altSeasonValue, volumeChangePct, pulseScore, pulseClassification, computedAt
        }`,
        { limit }
      );
    } catch {
      return [];
    }
  },
  ['fetchRecentMarketSnapshots'],
  { revalidate: READ_CACHE_SECONDS }
);

// ---------------- Exchanges ----------------

export interface ExchangeBadgeRaw {
  textRu: string;
  textEn: string;
  tone: 'ok' | 'warn' | 'off' | 'gold';
  link?: string;
}

export interface ExchangeRegionRaw {
  regionRu: string;
  regionEn: string;
  tone: 'ok' | 'warn' | 'off';
  noteRu?: string;
  noteEn?: string;
}

export interface ExchangeProductRaw {
  image: string;
  nameRu: string;
  nameEn: string;
  shortRu?: string;
  shortEn?: string;
  longRu?: string;
  longEn?: string;
}

export interface ExchangeRaw {
  _id: string;
  name: string;
  logo: string | null;
  logoBg?: string;
  slugRu: string;
  slugEn: string;
  foundedYear?: number;
  website: string;
  trackingUrl?: string;
  type: string[];
  taglineRu?: string;
  taglineEn?: string;
  volume24h?: number | null;
  pinned?: boolean;
  pinPosition?: number | null;
  pinUntil?: string | null;
  reviewsEnabled?: boolean;
  badges?: ExchangeBadgeRaw[];
}

export interface ExchangeDetailRaw extends ExchangeRaw {
  descriptionRu?: any[];
  descriptionEn?: any[];
  products?: ExchangeProductRaw[];
  regions?: ExchangeRegionRaw[];
  seo?: {
    metaTitleRu?: string;
    metaTitleEn?: string;
    metaDescriptionRu?: string;
    metaDescriptionEn?: string;
    noIndex?: boolean;
  };
}

const EXCHANGE_LIST_PROJECTION = `
  _id, name, "logo": logo.asset->url, logoBg,
  "slugRu": slugRu.current, "slugEn": slugEn.current,
  foundedYear, website, trackingUrl, type, taglineRu, taglineEn,
  volume24h, pinned, pinPosition, pinUntil, reviewsEnabled,
  badges[]{ textRu, textEn, tone, link }
`;

export const fetchExchanges = unstable_cache(
  async (): Promise<ExchangeRaw[]> => {
    if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return [];
    try {
      return await client.fetch(`*[_type == "exchange"]{ ${EXCHANGE_LIST_PROJECTION} }`);
    } catch {
      return [];
    }
  },
  ['fetchExchanges'],
  { revalidate: READ_CACHE_SECONDS, tags: ['exchanges'] }
);

export const fetchExchangeBySlug = unstable_cache(
  async (slug: string, locale: string): Promise<ExchangeDetailRaw | null> => {
    if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return null;
    const slugField = locale === 'ru' ? 'slugRu' : 'slugEn';
    try {
      return await client.fetch(
        `*[_type == "exchange" && ${slugField}.current == $slug][0]{
          ${EXCHANGE_LIST_PROJECTION},
          descriptionRu, descriptionEn,
          products[]{ "image": image.asset->url, nameRu, nameEn, shortRu, shortEn, longRu, longEn },
          regions[]{ regionRu, regionEn, tone, noteRu, noteEn },
          seo
        }`,
        { slug }
      );
    } catch {
      return null;
    }
  },
  ['fetchExchangeBySlug'],
  { revalidate: READ_CACHE_SECONDS, tags: ['exchanges'] }
);

export async function fetchExchangeSlugsForSitemap(): Promise<{ slugRu: string; slugEn: string }[]> {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return [];
  try {
    return await client.fetch(`*[_type == "exchange"]{ "slugRu": slugRu.current, "slugEn": slugEn.current }`);
  } catch {
    return [];
  }
}

function extractDomain(url?: string): string | null {
  if (!url) return null;
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return null;
  }
}

export interface ExchangeMention {
  _type: 'article' | 'news';
  title: string;
  slug: string;
  publishedAt: string;
}

// A material "mentions" an exchange purely by linking to it — either to the
// exchange's own page on this site or out to its official website — so
// editors don't need a separate manual tagging field, just the same inline
// link they'd already add for the reader's benefit.
export const fetchExchangeMentions = unstable_cache(
  async (slugRu: string, slugEn: string, website: string, locale: string, limit = 6): Promise<ExchangeMention[]> => {
    if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return [];
    const domain = extractDomain(website);
    const p1 = `*/exchanges/${slugRu}*`;
    const p2 = `*/exchanges/${slugEn}*`;
    const p3 = domain ? `*${domain}*` : '*__no_domain_configured__*';
    try {
      return await client.fetch(
        `*[_type in ["article", "news"] && language == $locale && publishedAt <= now()
          && count(body[].markDefs[href match $p1 || href match $p2 || href match $p3]) > 0
        ] | order(publishedAt desc) [0...$limit] {
          _type, title, "slug": slug.current, publishedAt
        }`,
        { locale, p1, p2, p3, limit }
      );
    } catch {
      return [];
    }
  },
  ['fetchExchangeMentions'],
  { revalidate: READ_CACHE_SECONDS, tags: ['exchanges', 'articles', 'news'] }
);

export interface ExchangeVolumeTarget { _id: string; coingeckoId: string }

export async function fetchExchangesWithCoingeckoIds(): Promise<ExchangeVolumeTarget[]> {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return [];
  try {
    return await client.fetch(`*[_type == "exchange" && defined(coingeckoId) && coingeckoId != ""]{ _id, coingeckoId }`);
  } catch {
    return [];
  }
}

export async function updateExchangeVolume(id: string, volume24h: number) {
  if (!process.env.SANITY_API_WRITE_TOKEN) return;
  try {
    await writeClient
      .patch(id)
      .set({ volume24h, volumeUpdatedAt: new Date().toISOString() })
      .commit({ autoGenerateArrayKeys: false });
  } catch {
    // best-effort — next day's cron run retries
  }
}

export interface ExchangeReview {
  _id: string;
  authorName: string;
  rating: number;
  text: string;
  createdAt: string;
}

export const fetchExchangeReviews = unstable_cache(
  async (exchangeId: string): Promise<ExchangeReview[]> => {
    if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return [];
    try {
      return await client.fetch(
        `*[_type == "exchangeReview" && exchange._ref == $exchangeId && approved == true] | order(createdAt desc) {
          _id, authorName, rating, text, createdAt
        }`,
        { exchangeId }
      );
    } catch {
      return [];
    }
  },
  ['fetchExchangeReviews'],
  { revalidate: 20 }
);

export async function fetchExchangeReviewSummary(exchangeId: string): Promise<{ average: number; count: number }> {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return { average: 0, count: 0 };
  try {
    const ratings: number[] = await client.fetch(
      `*[_type == "exchangeReview" && exchange._ref == $exchangeId && approved == true].rating`,
      { exchangeId }
    );
    if (ratings.length === 0) return { average: 0, count: 0 };
    const average = ratings.reduce((a, b) => a + b, 0) / ratings.length;
    return { average: Math.round(average * 10) / 10, count: ratings.length };
  } catch {
    return { average: 0, count: 0 };
  }
}

export async function isExchangeReviewingAllowed(exchangeId: string) {
  try {
    const doc = await client.fetch(`*[_id == $exchangeId][0]{ reviewsEnabled }`, { exchangeId });
    return doc ? doc.reviewsEnabled !== false : false;
  } catch {
    return false;
  }
}

export async function countRecentExchangeReviewsByIpHash(ipHash: string, sinceISO: string) {
  if (!process.env.SANITY_API_WRITE_TOKEN) return 0;
  try {
    return await writeClient.fetch(
      `count(*[_type == "exchangeReview" && ipHash == $ipHash && createdAt > $sinceISO])`,
      { ipHash, sinceISO }
    );
  } catch {
    return 0;
  }
}

export async function createExchangeReview(input: {
  authorName: string;
  rating: number;
  text: string;
  exchangeId: string;
  ipHash: string;
}) {
  if (!process.env.SANITY_API_WRITE_TOKEN) throw new Error('Sanity write token not configured');
  await writeClient.create({
    _type: 'exchangeReview',
    authorName: input.authorName,
    rating: input.rating,
    text: input.text,
    exchange: { _type: 'reference', _weak: true, _ref: input.exchangeId },
    approved: false,
    createdAt: new Date().toISOString(),
    ipHash: input.ipHash,
  });
}
