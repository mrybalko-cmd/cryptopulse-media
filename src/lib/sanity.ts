import { createClient } from '@sanity/client';
import { BROKER_LOCALIZED_KEYS, type BrokerLocalizedFields, type BrokerRegulator } from './brokerFields';
import { unstable_cache } from 'next/cache';
import { EXCHANGE_PASSPORT_KEYS, type ExchangePassportText } from './exchangePassport';
import { isVenueNews, linksToVenue, mentionRule } from './exchangeMentions';
import { ctaHref } from '@/lib/assetCtaShared';

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'placeholder',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  // Reads go through Sanity's CDN. The plan allows 1,000,000 CDN requests
  // against 250,000 uncached ones, and with useCdn off every read was charged
  // to the small quota — 251.8k of 250k used, 4 of a million CDN requests.
  // Nothing here needs to be fresher than the CDN: results are wrapped in
  // unstable_cache for 300s anyway, and Sanity purges the CDN on publish.
  useCdn: true,
});

const READ_CACHE_SECONDS = 300;

// Окно для того, что живёт долго и меняется по команде, а не по расписанию:
// сам материал, «похожие», баннеры, «Популярное».
//
// Окно страницы в Next — это минимум её собственного revalidate и всех кэшей
// данных, которые она читает. Поэтому одного `export const revalidate = 3600`
// на маршруте мало: пока «Популярное» стояло на 60 секундах, страницы
// материалов пересобирались раз в минуту, что и видно было в манифесте
// сборки. Двигать надо оба слоя сразу.
//
// Час безопасен, потому что каждый из этих кэшей сбрасывается по событию:
// материал — персональным тегом при сохранении в админке, «похожие» — тегом
// раздела, баннеры — своим тегом при правке размещения. Само по себе окно
// ждать приходится только «Популярному», а список по просмотрам меняется
// медленно.
const ARCHIVE_CACHE_SECONDS = 3600;
// Ленты и «Популярное» живут короче: их содержимое меняется чаще всего,
// а с тегами сохранение в админке всё равно сбрасывает их мгновенно.
const FEED_CACHE_SECONDS = 60;

/**
 * Чтения админки. Тот же проект, но мимо CDN.
 *
 * Админка читает документ сразу после того, как сама его записала: сохранение
 * редиректит на форму, и та перечитывает материал через считанные миллисекунды.
 * CDN в этот момент ещё отдаёт прежнюю копию — замерено, расхождение держится
 * не меньше трёх секунд. Редактор видел снятую галочку «наш материал» и пустую
 * плашку на обложке, хотя в базе всё сохранилось. Хуже того: повторное
 * «Сохранить» на такой форме записывало снятую галочку обратно и стирало
 * отметку молча.
 *
 * Уходит в маленькую квоту некэшированных запросов, но админкой пользуются
 * только редакторы — против трафика сайта это доли процента.
 */
export const adminClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

export const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'placeholder',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
  // Stays off: the CDN does not serve authenticated requests, and a write that
  // read its own stale copy would undo itself.
  useCdn: false,
});

export async function incrementViews(id: string): Promise<number | null> {
  if (!process.env.SANITY_API_WRITE_TOKEN) return null;
  try {
    // Возвращаем новое значение: страница закэширована на минуты, и без этого
    // читатель не видит собственный просмотр. Ответ на запись мы и так
    // получаем — отдельного чтения из Sanity это не стоит.
    const doc = await writeClient
      .patch(id)
      .setIfMissing({ views: 0 })
      .inc({ views: 1 })
      .commit({ autoGenerateArrayKeys: false });
    return typeof doc?.views === 'number' ? doc.views : null;
  } catch {
    // view counting is best-effort, never block rendering on it
    return null;
  }
}

/**
 * Баннер в тексте не ставится в рекламу и чужие материалы: плашка «Промо» или
 * «Новости компании», гостевой/партнёрский автор (author.sponsored) или
 * ручная галочка «Без баннера в тексте» у самого материала.
 */
const NO_INLINE_BANNER =
  'coalesce(hideInlineBanner, false) || badge in ["promo", "companyNews"] || coalesce(author->sponsored, false)';

/** Максимум баннеров в ротации на одно место. Админка не даёт включить шестой. */
export const BANNER_ROTATION_LIMIT = 5;

export interface InlineBannerItem {
  _id: string;
  title: string;
  image: string;
  mobileImage: string;
  altText: string;
  weight: number;
}

/** Баннеры внутри текста: своя пятёрка, отдельная от баннеров под «Популярным». */
export const fetchInlineBanners = unstable_cache(
  async (locale: string, kind: 'news' | 'article'): Promise<InlineBannerItem[]> => {
    if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return [];
    try {
      return await client.fetch(
        `*[_type == "sidebarBanner" && active == true && placement == "inline"
          && defined(image.asset) && defined(mobileImage.asset)
          && coalesce(contentTypes, "all") in ["all", $kind]
          && (language == "all" || !defined(language) || language == $locale)
          && (!defined(startAt) || startAt <= now())
          && (!defined(endAt) || endAt >= now())
        ] | order(_createdAt desc) [0...$limit] {
          _id, title, "image": image.asset->url, "mobileImage": mobileImage.asset->url,
          altText, "weight": coalesce(weight, 1)
        }`,
        { locale, kind, limit: BANNER_ROTATION_LIMIT }
      );
    } catch {
      return [];
    }
  },
  ['fetchInlineBanners'],
  { revalidate: ARCHIVE_CACHE_SECONDS, tags: ['banners'] }
);

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
          && coalesce(placement, "sidebar") == "sidebar"
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
  { revalidate: ARCHIVE_CACHE_SECONDS, tags: ['banners'] }
);

/**
 * Счётчики патчат по запросу с условием на тип: раньше маршрут принимал id
 * любого документа и дописывал ему impressions/clicks — хоть новости, хоть
 * пользователю админки.
 */
const BANNER_BY_ID = '*[_type == "sidebarBanner" && _id == $id]';

export async function incrementBannerImpression(id: string) {
  if (!process.env.SANITY_API_WRITE_TOKEN) return;
  try {
    await writeClient.mutate(
      [{ patch: { query: BANNER_BY_ID, params: { id }, setIfMissing: { impressions: 0 }, inc: { impressions: 1 } } }],
      { autoGenerateArrayKeys: false },
    );
  } catch {
    // impression counting is best-effort, never block rendering on it
  }
}

// Increments the click counter and returns the banner's destination link in
// one round trip. The redirect route resolves the target URL server-side
// from the banner id rather than trusting a client-supplied URL, which would
// otherwise be an open-redirect vector.
export async function incrementBannerClick(id: string): Promise<string | null> {
  if (!process.env.SANITY_API_WRITE_TOKEN) return null;
  try {
    const res = await writeClient.mutate(
      [{ patch: { query: BANNER_BY_ID, params: { id }, setIfMissing: { clicks: 0 }, inc: { clicks: 1 } } }],
      { autoGenerateArrayKeys: false, returnDocuments: true },
    );
    const doc = (res as unknown as Array<{ link?: unknown }>)[0];
    return doc && typeof doc.link === 'string' ? doc.link : null;
  } catch {
    return null;
  }
}

/**
 * Клик по кнопке партнёра на монете.
 *
 * Адрес возвращается из самого документа, а не принимается от клиента:
 * произвольная цель редиректа — это дыра открытого редиректа. Параметр
 * `which` только выбирает между двумя уже записанными адресами.
 *
 * Метки кампании дописывает ctaHref — тот же помощник, что раньше делал
 * это в разметке. Ссылка теперь ведёт на наш маршрут, а не к партнёру.
 */
export async function incrementAssetCtaClick(
  id: string,
  which: 'buy' | 'sell',
): Promise<string | null> {
  if (!process.env.SANITY_API_WRITE_TOKEN) return null;
  const field = which === 'sell' ? 'sellClicks' : 'clicks';
  try {
    const doc = await writeClient
      .patch(id)
      .setIfMissing({ [field]: 0 })
      .inc({ [field]: 1 })
      .commit({ autoGenerateArrayKeys: false });
    const raw =
      which === 'sell' && typeof doc.sellUrl === 'string' && doc.sellUrl
        ? doc.sellUrl
        : doc.url;
    if (typeof raw !== 'string' || !raw) return null;
    return ctaHref(raw, typeof doc.coinSlug === 'string' ? doc.coinSlug : '');
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

/**
 * Ленты читаются через unstable_cache с коротким окном и тегом.
 *
 * Раньше это были прямые client.fetch: Next не связывал их ни с каким тегом,
 * поэтому revalidateTag после сохранения в админке сбрасывал только страницу
 * самого материала, а лента и главная ещё до пяти минут показывали старое.
 * Окно короче общего (60 с вместо 300), чтобы отложенная публикация
 * появлялась не позже, чем раньше, — ISR-окно страницы и так 300 с.
 */
export const countSanityArticles = unstable_cache(
  async (locale: string) => {
    if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return 0;
    try {
      // Фильтр обязан совпадать с fetchArticles слово в слово.
      return await client.fetch<number>(
        `count(*[_type == "article" && language == $locale && publishedAt <= now()])`,
        { locale }
      );
    } catch {
      return 0;
    }
  },
  ['countSanityArticles'],
  { revalidate: READ_CACHE_SECONDS, tags: ['articles'] }
);

export const fetchArticles = unstable_cache(
  async ({ limit = 10, locale = 'ru', offset = 0 }: FetchArticlesOptions = {}) => {
    if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return [];
    try {
      return await client.fetch(
        `*[_type == "article" && language == $locale && publishedAt <= now()] | order(publishedAt desc) [$offset...$end] {
        _id, title, excerpt, slug, publishedAt, updatedAt, topic, readingTime, badge, ownBadge, views, likes,
        "coverImage": coverImage.asset->url,
        "coverImageAlt": coverImage.alt
      }`,
        { locale, offset, end: offset + limit }
      );
    } catch {
      return [];
    }
  },
  ['fetchArticles'],
  { revalidate: FEED_CACHE_SECONDS, tags: ['articles'] }
);

/** То же, что у новостей: персональный тег на каждый материал. */
export const fetchArticleBySlug = (slug: string, locale: string) =>
  unstable_cache(
    async () => {
    if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return null;
    try {
      return await client.fetch(
        `*[_type == "article" && slug.current == $slug && language == $locale && publishedAt <= now()][0] {
          _id, _updatedAt, title, excerpt, slug, publishedAt, readingTime, badge, ownBadge, body, topic, views, likes, seo, commentsEnabled, updatedAt,
          "noInlineBanner": ${NO_INLINE_BANNER},
          "coverImage": coverImage.asset->url,
          "coverImageAlt": coverImage.alt,
          "seoOgImageUrl": seo.ogImage.asset->url,
          "translation": translationRef->{language, "slug": slug.current},
          "author": author->{name, firstNameRu, lastNameRu, firstNameEn, lastNameEn, "slug": slug.current, roleRu, roleEn, bioRu, bioEn, email, telegram, linkedin, facebook, twitter, instagram, website, "photo": photo.asset->url}
        }`,
        { slug, locale }
      );
    } catch {
      return null;
    }
  },
    ['fetchArticleBySlug', locale, slug],
    { revalidate: ARCHIVE_CACHE_SECONDS, tags: ['article-item', `article:${locale}:${slug}`] },
  )();

export const fetchSanityNews = unstable_cache(
  async ({ limit = 10, locale = 'ru', offset = 0 }: FetchArticlesOptions = {}) => {
    if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return [];
    try {
      return await client.fetch(
        `*[_type == "news" && language == $locale && publishedAt <= now()] | order(select(pinnedUntil > now() => 0, 1) asc, publishedAt desc) [$offset...$end] {
        _id, title, excerpt, slug, publishedAt, updatedAt, pinnedUntil, breaking, ownBadge, badge, topic, views, likes,
        "coverImage": coverImage.asset->url
      }`,
        { locale, offset, end: offset + limit }
      );
    } catch {
      return [];
    }
  },
  ['fetchSanityNews'],
  { revalidate: FEED_CACHE_SECONDS, tags: ['news'] }
);

export const countSanityNews = unstable_cache(
  async (locale: string) => {
    if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return 0;
    try {
      // Фильтр обязан совпадать с fetchSanityNews слово в слово: иначе
      // число страниц в пагинации разойдётся с тем, что реально в ленте.
      return await client.fetch<number>(
        `count(*[_type == "news" && language == $locale && publishedAt <= now()])`,
        { locale }
      );
    } catch {
      return 0;
    }
  },
  ['countSanityNews'],
  { revalidate: FEED_CACHE_SECONDS, tags: ['news'] }
);

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

/**
 * Материал по адресу. Кэш строится на каждый вызов, чтобы получить СВОЙ тег
 * вида `news:ru:slug`.
 *
 * Иначе не сходилось: общий тег `news` сбрасывал все 1768 страниц при каждом
 * сохранении (6,17 млн платных перезаписей при 1,66 млн чтений), а один только
 * `revalidatePath` без сброса данных пересобирал бы страницу со старым текстом,
 * потому что данные под ней остались бы в кэше ещё до пяти минут.
 * Персональный тег даёт ровно то, что нужно: правим один материал — протухает
 * один материал.
 */
export const fetchNewsBySlug = (slug: string, locale: string) =>
  unstable_cache(
    async () => {
    if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return null;
    try {
      return await client.fetch(
        `*[_type == "news" && slug.current == $slug && language == $locale && publishedAt <= now()][0] {
          _id, _updatedAt, title, excerpt, slug, publishedAt, body, sourceName, sourceUrl, breaking, badge, ownBadge, topic, views, likes, seo, commentsEnabled, updatedAt,
          "noInlineBanner": ${NO_INLINE_BANNER},
          "coverImage": coverImage.asset->url,
          "coverImageAlt": coverImage.alt,
          "seoOgImageUrl": seo.ogImage.asset->url,
          "translation": translationRef->{language, "slug": slug.current},
          "author": author->{name, firstNameRu, lastNameRu, firstNameEn, lastNameEn, "slug": slug.current, roleRu, roleEn, bioRu, bioEn, email, telegram, linkedin, facebook, twitter, instagram, website, "photo": photo.asset->url}
        }`,
        { slug, locale }
      );
    } catch {
      return null;
    }
  },
    ['fetchNewsBySlug', locale, slug],
    { revalidate: ARCHIVE_CACHE_SECONDS, tags: ['news-item', `news:${locale}:${slug}`] },
  )();

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
        "noInlineBanner": ${NO_INLINE_BANNER},
        "coverImage": coverImage.asset->url,
        "coverImageAlt": coverImage.alt,
        "author": author->{name, firstNameRu, lastNameRu, firstNameEn, lastNameEn, "slug": slug.current, roleRu, roleEn, bioRu, bioEn, email, telegram, linkedin, facebook, twitter, instagram, website, "photo": photo.asset->url}
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
  // 300s like every other read. This sat at 20 — refreshing fifteen times more
  // often than anything else on the site for the sake of three comments.
  //
  // Тег обязателен: без него одобренный в админке комментарий доезжал до
  // материала только сам, а материал пересобирается раз в час — модератор
  // жал «Одобрить», комментарий уходил из очереди и на странице не
  // появлялся. Тег общий, не по каждому материалу: комментариев единицы,
  // а раздельные теги пришлось бы вычислять в действии по ссылке.
  { revalidate: READ_CACHE_SECONDS, tags: ['comments'] }
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
  /** Свободная строка вида «14:00 UTC» — у многих событий точного часа нет. */
  time?: string | null;
  /** Последний день многодневного события; пусто означает «один день». */
  endDate?: string | null;
  /** Чем кончилось. Показывается только в архиве, после даты события. */
  outcome?: { ru?: string; en?: string } | null;
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
          _id, title, "slug": slug.current, description, date, time, endDate, outcome,
          category, importance, "iconUrl": icon.asset->url, sourceUrl,
          "likes": coalesce(likes, 0), "dislikes": coalesce(dislikes, 0)
        }`
      );
    } catch {
      return [];
    }
  },
  ['fetchCalendarEvents'],
  // Тег обязателен: без него правка из админки доезжала до сайта только
  // сама, когда истечёт кэш. Сбрасывать было буквально нечего.
  { revalidate: READ_CACHE_SECONDS, tags: ['calendar'] }
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
          _id, title, excerpt, slug, publishedAt, readingTime, badge, ownBadge, views, likes,
          "coverImage": coverImage.asset->url
        }`,
        { locale, excludeId, limit }
      );
    } catch {
      return [];
    }
  },
  ['fetchRelatedArticles'],
  // Тег постраничный, не общий: им помечены кэши, которые читает КАЖДАЯ
  // страница материала. Пока они висели на общем теге, одно сохранение
  // в админке помечало устаревшими все 1768 новостей разом, и дальше
  // каждая пересобиралась при первом обращении. За период это дало
  // 6,17 млн платных перезаписей при 1,66 млн чтений — 3,7 записи
  // на чтение. Ленты и счётчики остались на общем теге и по-прежнему
  // обновляются мгновенно.
  { revalidate: ARCHIVE_CACHE_SECONDS, tags: ['article-item'] }
);

export const fetchRelatedNews = unstable_cache(
  async (excludeId: string, locale: string, limit = 4) => {
    if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return [];
    try {
      return await client.fetch(
        `*[_type == "news" && language == $locale && publishedAt <= now() && _id != $excludeId] | order(publishedAt desc) [0...$limit] {
          _id, title, excerpt, slug, publishedAt, breaking, ownBadge,
          "coverImage": coverImage.asset->url
        }`,
        { locale, excludeId, limit }
      );
    } catch {
      return [];
    }
  },
  ['fetchRelatedNews'],
  // Тег постраничный, не общий: им помечены кэши, которые читает КАЖДАЯ
  // страница материала. Пока они висели на общем теге, одно сохранение
  // в админке помечало устаревшими все 1768 новостей разом, и дальше
  // каждая пересобиралась при первом обращении. За период это дало
  // 6,17 млн платных перезаписей при 1,66 млн чтений — 3,7 записи
  // на чтение. Ленты и счётчики остались на общем теге и по-прежнему
  // обновляются мгновенно.
  { revalidate: ARCHIVE_CACHE_SECONDS, tags: ['news-item'] }
);

export interface PopularItem {
  _type: 'article' | 'news';
  _id: string;
  title: string;
  slug: string;
  views: number;
  /** Both optional: the widget degrades to a text-only row when a material
      has no cover or no topic assigned. */
  topic?: string;
  coverImage?: string;
}

// ── Authors ──────────────────────────────────────────────────────────────────

export const fetchAuthors = unstable_cache(
  async () => {
    if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return [];
    try {
      return await client.fetch(
        // hidden != true, а не !hidden: у девяти карточек из десяти поля
        // просто нет, и отрицание отсутствующего значения в GROQ даёт null,
        // то есть вычеркнуло бы всех. Отсюда же скрытые не попадают в карту
        // сайта — она берёт этот же запрос. По той же причине здесь стоит
        // и срок размещения: условие обязано совпадать с fetchAuthorCards,
        // иначе в карте сайта окажется тот, кого на витрине уже нет.
        `*[_type == "author" && hidden != true
           && (!defined(placementFrom) || placementFrom <= now())
           && (!defined(placementTo) || placementTo >= now())] | order(name asc) {
          _id, _updatedAt, name, firstNameRu, lastNameRu, firstNameEn, lastNameEn, "slug": slug.current, roleRu, roleEn, bioRu, bioEn,
          "photo": photo.asset->url, email, telegram, linkedin, facebook, twitter, instagram, website
        }`
      );
    } catch {
      return [];
    }
  },
  ['fetchAuthors'],
  { revalidate: ARCHIVE_CACHE_SECONDS, tags: ['authors'] }
);

export interface AuthorRubric {
  _id: string;
  titleRu: string;
  titleEn: string;
  key: string;
  visibility: 'auto' | 'always' | 'never';
  order: number;
}

export interface AuthorCard {
  _id: string;
  name: string;
  firstNameRu?: string; lastNameRu?: string;
  firstNameEn?: string; lastNameEn?: string;
  slug: string;
  roleRu?: string; roleEn?: string;
  bioRu?: string; bioEn?: string;
  photo?: string;
  entityKind: 'person' | 'organization';
  haloColor: 'violet' | 'cyan' | 'pink' | 'blue' | 'emerald' | 'amber' | 'orange';
  rubrics: string[];
  materials: number;
  telegram?: string; linkedin?: string; facebook?: string; twitter?: string;
  instagram?: string; website?: string; email?: string;
}

/**
 * Карточки для раздела авторов, вместе с числом материалов у каждого.
 *
 * Скрытые и те, у кого истёк срок размещения, сюда не попадают: условие одно
 * и то же и для списка, и для карты сайта, чтобы не вышло как с партнёрским
 * материалом, который мы предлагали обойти и сами же не показывали.
 */
export const fetchAuthorCards = unstable_cache(
  async (): Promise<AuthorCard[]> => {
    if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return [];
    try {
      return await client.fetch(
        `*[_type == "author" && hidden != true
           && (!defined(placementFrom) || placementFrom <= now())
           && (!defined(placementTo) || placementTo >= now())]
         | order(coalesce(sortOrder, 100) asc, name asc) {
          _id, name, firstNameRu, lastNameRu, firstNameEn, lastNameEn,
          "slug": slug.current, roleRu, roleEn, bioRu, bioEn,
          "photo": photo.asset->url,
          "entityKind": coalesce(entityKind, "person"),
          "haloColor": coalesce(haloColor, "violet"),
          "rubrics": rubrics[]->slug.current,
          "materials": count(*[_type in ["news", "article"] && author._ref == ^._id]),
          telegram, linkedin, facebook, twitter, instagram, website, email
        }`
      );
    } catch {
      return [];
    }
  },
  ['fetchAuthorCards'],
  { revalidate: ARCHIVE_CACHE_SECONDS, tags: ['authors'] }
);

/**
 * Рубрики для строки фильтров.
 *
 * «Никогда» отсекается здесь же: такая рубрика существует только для
 * сортировки в админке. Режим «авто» отсекается на странице, потому что
 * зависит от числа видимых карточек, а его считает уже она.
 */
export const fetchAuthorRubrics = unstable_cache(
  async (): Promise<AuthorRubric[]> => {
    if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return [];
    try {
      return await client.fetch(
        `*[_type == "authorRubric" && coalesce(visibility, "auto") != "never"]
         | order(coalesce(order, 100) asc) {
          _id, titleRu, titleEn, "key": slug.current,
          "visibility": coalesce(visibility, "auto"), "order": coalesce(order, 100)
        }`
      );
    } catch {
      return [];
    }
  },
  ['fetchAuthorRubrics'],
  { revalidate: ARCHIVE_CACHE_SECONDS, tags: ['authors'] }
);

export interface AuthorsPageSettings {
  headingRu?: string; headingEn?: string;
  ledeRu?: string; ledeEn?: string;
  seoTitleRu?: string; seoTitleEn?: string;
  seoDescriptionRu?: string; seoDescriptionEn?: string;
  sort: 'manual' | 'materials' | 'alphabet';
}

export const fetchAuthorsPageSettings = unstable_cache(
  async (): Promise<AuthorsPageSettings> => {
    const fallback: AuthorsPageSettings = { sort: 'manual' };
    if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return fallback;
    try {
      const doc = await client.fetch(`*[_type == "authorsPage"][0]{
        headingRu, headingEn, ledeRu, ledeEn,
        seoTitleRu, seoTitleEn, seoDescriptionRu, seoDescriptionEn,
        "sort": coalesce(sort, "manual")
      }`);
      return doc || fallback;
    } catch {
      return fallback;
    }
  },
  ['fetchAuthorsPageSettings'],
  { revalidate: ARCHIVE_CACHE_SECONDS, tags: ['authors'] }
);

export const fetchAuthorBySlug = unstable_cache(
  async (slug: string) => {
    if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return null;
    try {
      return await client.fetch(
        // Скрытого автора эта страница по-прежнему отдаёт: на неё ведут
        // ссылки из его материалов, а скрытие убирает из витрины, а не с сайта.
        `*[_type == "author" && slug.current == $slug][0] {
          _id, name, firstNameRu, lastNameRu, firstNameEn, lastNameEn, "slug": slug.current, roleRu, roleEn, bioRu, bioEn,
          "photo": photo.asset->url, email, telegram, linkedin, facebook, twitter, instagram, website,
          "entityKind": coalesce(entityKind, "person"),
          "haloColor": coalesce(haloColor, "violet"),
          "sponsored": coalesce(sponsored, false),
          "hidden": coalesce(hidden, false)
        }`,
        { slug }
      );
    } catch {
      return null;
    }
  },
  ['fetchAuthorBySlug'],
  { revalidate: ARCHIVE_CACHE_SECONDS, tags: ['authors'] }
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
  async (
    authorSlug: string,
    locale: string,
    limit = 20,
    offset = 0,
    type?: 'article' | 'news',
    q?: string,
  ): Promise<{ items: AuthorFeedItem[]; total: number }> => {
    if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return { items: [], total: 0 };
    try {
      // Тип и поиск отбираются здесь, а не в браузере. У самого плодовитого
      // автора 1836 материалов: отдать их все на клиент ради фильтра нельзя,
      // а фильтровать одну открытую страницу значит обманывать — человек
      // ищет по всему архиву, а находит по двадцати строкам.
      const where =
        '_type in ["article", "news"] && author->slug.current == $slug' +
        ' && language == $locale && publishedAt <= now()' +
        (type ? ' && _type == $type' : '') +
        (q ? ' && title match $q' : '');
      const result = await client.fetch(
        `{
          "items": *[${where}] | order(publishedAt desc) [$offset...$end] {
            _type, _id, title, excerpt, slug, publishedAt, readingTime, badge, views, likes,
            "coverImage": coverImage.asset->url,
            "coverImageAlt": coverImage.alt
          },
          "total": count(*[${where}])
        }`,
        {
          slug: authorSlug, locale, offset, end: offset + limit,
          ...(type ? { type } : {}),
          // Звёздочка на конце: без неё match ищет слово целиком, и «bitco»
          // не найдёт ни одного «bitcoin».
          ...(q ? { q: `${q}*` } : {}),
        }
      );
      return result;
    } catch {
      return { items: [], total: 0 };
    }
  },
  ['fetchAuthorFeed'],
  { revalidate: ARCHIVE_CACHE_SECONDS, tags: ['articles', 'news'] }
);

export interface AuthorStats {
  total: number;
  articles: number;
  news: number;
  views: number;
  firstAt?: string;
}

/**
 * Пять цифр под описанием участника.
 *
 * Считаются в базе одним запросом, а не сложением того, что пришло на
 * открытую страницу: в ленте лежат двадцать строк из двух тысяч, и сумма
 * просмотров по ним была бы выдумкой. Для компании, которая покупает
 * размещение, это единственная строка с отдачей — врать в ней нельзя.
 */
export const fetchAuthorStats = unstable_cache(
  async (slug: string, locale: string): Promise<AuthorStats> => {
    const empty: AuthorStats = { total: 0, articles: 0, news: 0, views: 0 };
    if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return empty;
    const base = 'author->slug.current == $slug && language == $locale && publishedAt <= now()';
    try {
      const r = await client.fetch(
        `{
          "articles": count(*[_type == "article" && ${base}]),
          "news": count(*[_type == "news" && ${base}]),
          "views": math::sum(*[_type in ["article", "news"] && ${base}].views),
          "firstAt": *[_type in ["article", "news"] && ${base}]
            | order(publishedAt asc)[0].publishedAt
        }`,
        { slug, locale }
      );
      return {
        total: (r?.articles || 0) + (r?.news || 0),
        articles: r?.articles || 0,
        news: r?.news || 0,
        views: r?.views || 0,
        firstAt: r?.firstAt || undefined,
      };
    } catch {
      return empty;
    }
  },
  ['fetchAuthorStats'],
  { revalidate: ARCHIVE_CACHE_SECONDS, tags: ['articles', 'news'] }
);

export interface AuthorWithLatest {
  _id: string;
  name: string;
  firstNameRu?: string;
  lastNameRu?: string;
  firstNameEn?: string;
  lastNameEn?: string;
  hidden?: boolean;
  slug: string;
  roleRu?: string;
  roleEn?: string;
  photo?: string;
  latest: {
    _type: 'article' | 'news';
    title: string;
    slug: string;
    publishedAt?: string;
    views?: number;
  } | null;
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
            "firstNameRu": author->firstNameRu,
            "lastNameRu": author->lastNameRu,
            "firstNameEn": author->firstNameEn,
            "lastNameEn": author->lastNameEn,
            "hidden": coalesce(author->hidden, false),
            "slug": author->slug.current,
            "roleRu": author->roleRu,
            "roleEn": author->roleEn,
            "photo": author->photo.asset->url,
            "latest": ${materialField}-> { _type, title, "slug": slug.current, publishedAt, views }
          }
        }`,
        { locale }
      );
      if (!doc) return fallback;
      return {
        showNews: doc.showNews ?? true,
        showArticles: doc.showArticles ?? true,
        showAuthorColumns: doc.showAuthorColumns ?? true,
        // Скрытый автор выпадает из подборки на главной, даже если редактор
        // поставил его туда раньше. Иначе «скрыт» означало бы «скрыт везде,
        // кроме самого заметного места на сайте».
        featuredAuthors: (doc.featuredAuthors || [])
          .filter((a: AuthorWithLatest) => a._id && a.latest && !a.hidden),
      };
    } catch {
      return fallback;
    }
  },
  ['fetchHomeSettings'],
  { revalidate: READ_CACHE_SECONDS, tags: ['homeSettings'] }
);

// ── Article Topics ────────────────────────────────────────────────────────────

export const fetchArticlesByTopic = unstable_cache(
  async (topic: string, locale: string, limit = 30) => {
    if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return [];
    try {
      return await client.fetch(
        `*[_type == "article" && topic == $topic && language == $locale && publishedAt <= now()] | order(publishedAt desc) [0...$limit] {
          _id, title, excerpt, slug, publishedAt, readingTime, badge, ownBadge, views, likes, topic,
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
  { revalidate: READ_CACHE_SECONDS, tags: ['articles'] }
);

// Per-topic published-doc counts, so callers (sitemap generation) can mirror
// the "thin topic" noindex threshold used by the topic pages themselves
// (see isThin in articles/topic/[topic] and news/topic/[topic] page.tsx)
// instead of unconditionally listing every topic slug.
export interface TopicStat {
  count: number;
  /** publishedAt of the newest item in the topic — the topic listing's real
   *  lastmod, since that's the only thing that changes its contents. */
  latest: string | null;
}

export const fetchTopicStats = unstable_cache(
  async (type: 'article' | 'news', locale: string): Promise<Record<string, TopicStat>> => {
    if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return {};
    try {
      const rows: { topic: string; publishedAt: string }[] = await client.fetch(
        `*[_type == $type && language == $locale && publishedAt <= now() && defined(topic)]{ topic, publishedAt }`,
        { type, locale }
      );
      return rows.reduce((acc: Record<string, TopicStat>, r) => {
        const prev = acc[r.topic];
        acc[r.topic] = {
          count: (prev?.count ?? 0) + 1,
          latest: !prev?.latest || r.publishedAt > prev.latest ? r.publishedAt : prev.latest,
        };
        return acc;
      }, {});
    } catch {
      return {};
    }
  },
  ['fetchTopicStats'],
  { revalidate: READ_CACHE_SECONDS, tags: ['articles', 'news'] }
);

export const fetchPopularContent = unstable_cache(
  async (locale: string, limit = 6): Promise<PopularItem[]> => {
    if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return [];
    try {
      return await client.fetch(
        `*[(_type == "article" || _type == "news") && language == $locale && publishedAt <= now()] | order(coalesce(views, 0) desc, publishedAt desc) [0...$limit] {
          _type, _id, title, "slug": slug.current, "views": coalesce(views, 0),
          topic, "coverImage": coverImage.asset->url
        }`,
        { locale, limit }
      );
    } catch {
      return [];
    }
  },
  ['fetchPopularContent'],
  {
    // Собственный тег, а не ['articles', 'news'].
    //
    // «Популярное» стоит в боковой колонке каждого материала, и с прежними
    // тегами любая публикация помечала устаревшими все 2200 страниц архива:
    // пять публикаций в сутки — и весь сайт вставал в очередь на пересборку.
    // Свежести это не добавляло: блок и так обновляется раз в минуту по
    // собственному окну, и просмотры в нём меняются постоянно сами.
    revalidate: ARCHIVE_CACHE_SECONDS,
    tags: ['popular'],
  }
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
          _id, title, excerpt, slug, publishedAt, readingTime, badge, ownBadge, views, likes, topic,
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
  { revalidate: FEED_CACHE_SECONDS, tags: ['articles'] }
);

export const fetchTopLikedNews = unstable_cache(
  async (locale: string, limit = 30): Promise<TopLikedItem[]> => {
    if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return [];
    try {
      return await client.fetch(
        `*[_type == "news" && language == $locale && publishedAt <= now() && coalesce(likes, 0) > 0] | order(likes desc, views desc, publishedAt desc) [0...$limit] {
          _id, title, slug, publishedAt, views, likes, breaking, ownBadge, badge, topic,
          "coverImage": coverImage.asset->url
        }`,
        { locale, limit }
      );
    } catch {
      return [];
    }
  },
  ['fetchTopLikedNews'],
  { revalidate: FEED_CACHE_SECONDS, tags: ['news'] }
);

// ── Pulse of the Day ────────────────────────────────────────────────────────
// One document per day, written once by the cron job in
// /api/cron/pulse-snapshot. Everything the site reads (widget, /pulse page,
// share-card image) reads the latest stored snapshot instead of recomputing
// the three-source blend on every request.

export interface MarketSnapshot {
  _id: string;
  date: string;
  // raw inputs — point-in-time facts
  btcVolume24h?: number;
  normVolume?: number;
  weekdayFactor?: number;
  priceChange24h?: number;
  normAbsChange?: number;
  altcoinMarginPp?: number | null;
  altcoinCoins?: number | null;
  // component scores, each 0-100 with 50 = normal market conditions
  volumeScore?: number;
  growthScore?: number;
  volatilityScore?: number;
  fearGreedValue?: number;
  altcoinScoreValue?: number | null;
  pulseScore: number;
  pulseZone?: string;
  reconstructed?: boolean;
  computedAt: string;
}

export async function saveMarketSnapshot(snapshot: Omit<MarketSnapshot, '_id'>): Promise<void> {
  if (!process.env.SANITY_API_WRITE_TOKEN) return;
  try {
    // One document per calendar day, enforced here rather than assumed. A
    // retried or double-fired cron used to create a second row for the same
    // date; harmless when only the newest row was read, but the rolling-year
    // statistics shown on the page are computed across the whole log, so a
    // duplicated day would quietly bias them.
    const existing = await writeClient.fetch<string | null>(
      `*[_type == "marketSnapshot" && date == $date][0]._id`,
      { date: snapshot.date }
    );
    if (existing) {
      await writeClient.patch(existing).set(snapshot).commit();
    } else {
      await writeClient.create({ _type: 'marketSnapshot', ...snapshot });
    }
  } catch {
    // best-effort — a missed daily snapshot just leaves a gap in the log,
    // not a broken page
  }
}

export const fetchRecentMarketSnapshots = unstable_cache(
  async (limit = 7): Promise<MarketSnapshot[]> => {
    if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return [];
    try {
      // Ordered by `date`, not `computedAt`: the weekday profile and the
      // volume baseline both depend on calendar order, and a row whose
      // computedAt drifted past midnight would otherwise sort out of place.
      return await client.fetch(
        `*[_type == "marketSnapshot"] | order(date desc) [0...$limit] {
          _id, date, btcVolume24h, normVolume, weekdayFactor,
          priceChange24h, normAbsChange, altcoinMarginPp, altcoinCoins,
          volumeScore, growthScore, volatilityScore, fearGreedValue, altcoinScoreValue,
          pulseScore, pulseZone, reconstructed, computedAt
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

// ── Coin quotes fallback ────────────────────────────────────────────────────
// Read whenever CoinGecko refuses; written once an hour by the cron. Keeps
// coin pages from shipping empty when a build's parallel workers meet the
// free tier's rate limit.

export interface StoredCoinQuote {
  coinId: string;
  price: number;
  change24h: number;
  marketCap: number;
  volume24h: number;
  ath: number;
  athChangePct: number;
  circulating: number | null;
  maxSupply: number | null;
  logo: string;
}

export async function saveCoinQuotes(quotes: StoredCoinQuote[]): Promise<void> {
  if (!process.env.SANITY_API_WRITE_TOKEN || quotes.length === 0) return;
  try {
    await writeClient.createOrReplace({
      _id: 'coinQuotes',
      _type: 'coinQuotes',
      updatedAt: new Date().toISOString(),
      quotes,
    });
  } catch {
    // best-effort: a missed write just means the fallback is one hour older
  }
}

export const fetchStoredCoinQuotes = unstable_cache(
  async (): Promise<{ updatedAt: string; quotes: StoredCoinQuote[] } | null> => {
    if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return null;
    try {
      return await client.fetch(`*[_id == "coinQuotes"][0]{ updatedAt, quotes }`);
    } catch {
      return null;
    }
  },
  ['fetchStoredCoinQuotes'],
  { revalidate: 600 }
);

// ---------------- Exchanges ----------------

export interface ExchangeBadgeRaw {
  textRu: string;
  textEn: string;
  tone: 'ok' | 'warn' | 'off' | 'gold' | 'license';
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
  /** Last write to the document. On exchanges this is a real content signal:
   *  the daily volume cron rewrites the 24h figures, which is exactly what a
   *  ranking by volume is showing. */
  _updatedAt?: string;
  name: string;
  logo: string | null;
  logoBg?: string;
  slugRu: string;
  slugEn: string;
  foundedYear?: number;
  website: string;
  linkLabel?: string;
  trackingUrl?: string;
  tradeUrl?: string;
  type: string[];
  taglineRu?: string;
  taglineEn?: string;
  volume24h?: number | null;
  tradeUntil?: string | null;
  buttonColor?: string | null;
  extendedEnabled?: boolean | null;
  extendedUntil?: string | null;
  extendedPerkRu?: string | null;
  extendedPerkEn?: string | null;
  extendedFactsRu?: string | null;
  extendedFactsEn?: string | null;
  adEnabled?: boolean | null;
  adUntil?: string | null;
  adUrl?: string | null;
  adTextRu?: string | null;
  adTextEn?: string | null;
  adOfferRu?: string | null;
  adOfferEn?: string | null;
  adOfferNoteRu?: string | null;
  adOfferNoteEn?: string | null;
  adButtonRu?: string | null;
  adButtonEn?: string | null;
  reviewsEnabled?: boolean;
  badges?: ExchangeBadgeRaw[];
  // Name-only on the listing (no image/description) — just enough to
  // support the "has this product" filter without pulling full detail data.
  products?: { nameRu: string; nameEn: string }[];
  regions?: { regionRu: string; regionEn: string; tone: string }[];
}

export interface ExchangeDetailRaw extends ExchangeRaw, ExchangePassportText {
  verifiedAt?: string | null;
  reservesUrl?: string | null;
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

export interface BrokerRaw extends ExchangeRaw, BrokerLocalizedFields {
  regulators?: BrokerRegulator[] | null;
  offersCoins?: boolean | null;
  offersCfd?: boolean | null;
  minDeposit?: string | null;
  lossPercent?: string | null;
  demoUrl?: string | null;
  verifiedAt?: string | null;
}

export interface BrokerDetailRaw extends BrokerRaw {
  descriptionRu?: any[];
  descriptionEn?: any[];
  seo?: ExchangeDetailRaw['seo'];
}

const EXCHANGE_LIST_PROJECTION = `
  _id, _updatedAt, name, "logo": logo.asset->url, logoBg,
  "slugRu": slugRu.current, "slugEn": slugEn.current,
  foundedYear, website, linkLabel, trackingUrl, tradeUrl, type, taglineRu, taglineEn,
  volume24h, reviewsEnabled,
  tradeUntil, buttonColor,
  extendedEnabled, extendedUntil, extendedPerkRu, extendedPerkEn, extendedFactsRu, extendedFactsEn,
  adEnabled, adUntil, adUrl, adTextRu, adTextEn, adOfferRu, adOfferEn, adOfferNoteRu, adOfferNoteEn, adButtonRu, adButtonEn,
  badges[]{ textRu, textEn, tone, link },
  regions[]{ regionRu, regionEn, tone },
  products[]{ nameRu, nameEn }
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
  { revalidate: ARCHIVE_CACHE_SECONDS, tags: ['exchanges'] }
);

const BROKER_PROJECTION = `
  ${EXCHANGE_LIST_PROJECTION},
  regulators[]{ name, entity, licence, noteRu, noteEn, url, tier1 },
  offersCoins, offersCfd, minDeposit, lossPercent, demoUrl, verifiedAt,
  ${BROKER_LOCALIZED_KEYS.join(', ')}
`;

export const fetchBrokers = unstable_cache(
  async (): Promise<BrokerRaw[]> => {
    if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return [];
    try {
      return await client.fetch(`*[_type == "broker"]{ ${BROKER_PROJECTION} }`);
    } catch {
      return [];
    }
  },
  ['fetchBrokers'],
  { revalidate: ARCHIVE_CACHE_SECONDS, tags: ['exchanges'] }
);

export const fetchBrokerBySlug = unstable_cache(
  async (slug: string, locale: string): Promise<BrokerDetailRaw | null> => {
    if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return null;
    const slugField = locale === 'ru' ? 'slugRu' : 'slugEn';
    try {
      return await client.fetch(
        `*[_type == "broker" && ${slugField}.current == $slug][0]{ ${BROKER_PROJECTION}, descriptionRu, descriptionEn, seo }`,
        { slug }
      );
    } catch {
      return null;
    }
  },
  ['fetchBrokerBySlug'],
  { revalidate: ARCHIVE_CACHE_SECONDS, tags: ['exchanges'] }
);

export async function fetchBrokerSlugsForSitemap(): Promise<{ slugRu: string; slugEn: string; _updatedAt: string }[]> {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return [];
  try {
    return await client.fetch(`*[_type == "broker" && seo.noIndex != true]{ "slugRu": slugRu.current, "slugEn": slugEn.current, _updatedAt }`);
  } catch {
    return [];
  }
}

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
          verifiedAt, reservesUrl, ${EXCHANGE_PASSPORT_KEYS.join(', ')},
          seo
        }`,
        { slug }
      );
    } catch {
      return null;
    }
  },
  ['fetchExchangeBySlug'],
  { revalidate: ARCHIVE_CACHE_SECONDS, tags: ['exchanges'] }
);

/**
 * Slugs for the newest materials, so the pages a crawler or a reader is most
 * likely to land on ship as static HTML instead of rendering on first hit.
 * Older material stays on-demand + ISR — prerendering all of it would grow
 * the build without helping anything that gets traffic.
 */
export async function fetchRecentSlugsForPrerender(
  type: 'news' | 'article',
  limit: number
): Promise<{ locale: string; slug: string }[]> {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return [];
  try {
    const rows: { language?: string; slug?: string }[] = await client.fetch(
      `*[_type == $type && defined(slug.current) && defined(publishedAt) && publishedAt <= now()]
        | order(publishedAt desc)[0...$limit]{ language, "slug": slug.current }`,
      { type, limit }
    );
    return rows
      .filter(r => r.slug && (r.language === 'ru' || r.language === 'en'))
      .map(r => ({ locale: r.language as string, slug: r.slug as string }));
  } catch {
    return [];
  }
}

export async function fetchExchangeSlugsForSitemap(): Promise<{ name: string; website: string | null; slugRu: string; slugEn: string; _updatedAt: string }[]> {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return [];
  try {
    // _updatedAt is a trustworthy content signal here, unlike on articles and
    // news, where incrementViews() patches the document on every page view. An
    // exchange document is written by an editor or by the daily
    // /api/cron/exchange-volumes job (00:15 UTC) — and a refreshed 24h volume
    // genuinely is what changed on a page that ranks venues by volume, so a
    // date that moves daily is accurate rather than inflated.
    return await client.fetch(`*[_type == "exchange"]{ name, website, "slugRu": slugRu.current, "slugEn": slugEn.current, _updatedAt }`);
  } catch {
    return [];
  }
}

/**
 * Материалы, закрытые от индексации галкой «noIndex» в админке.
 *
 * Карта сайта говорит поисковику «эту страницу стоит обойти», а мета-тег на
 * самой странице — «не индексируй». Вместе это противоречие: обход впустую, а
 * в новостной карте ещё и рекламный материал в ленте Google News, что бьёт по
 * оценке всего раздела. 17.09.2026 в таком виде лежал партнёрский перевод
 * finance.ua, обе языковые версии.
 *
 * Из лент материал при этом убирать нельзя, читатель его видеть должен, — так
 * что фильтр живёт здесь и применяется только к картам сайта.
 */
export async function fetchNoIndexKeys(): Promise<Set<string>> {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return new Set();
  try {
    const rows: { _type: string; language: string; slug: string }[] = await client.fetch(
      `*[_type in ["article", "news"] && seo.noIndex == true]{ _type, language, "slug": slug.current }`,
    );
    return new Set(rows.filter(r => r.slug).map(r => `${r._type}:${r.language}:${r.slug}`));
  } catch {
    return new Set();
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
  coverImage: string | null;
  /** Название площадки стоит в заголовке: такие материалы идут первыми в блоке на её странице. */
  inTitle: boolean;
}

interface ExchangeMentionCandidate extends Omit<ExchangeMention, 'inTitle'> {
  text: string | null;
  hrefs: (string | null)[] | null;
}

// Материал попадает к площадке по её названию в заголовке или тексте, правила в
// lib/exchangeMentions. `match` здесь только сужает выборку: он режет слова по
// пунктуации, поэтому «Crypto.com» совпал бы с любым текстом, где есть crypto и
// com, а без звёздочки в конце теряются «Binance's» и «Binance.US». Точное
// решение принимает код, по тексту кандидатов.
//
// Весь список, без лимита: блок берёт из него четыре, архив листает постранично.
// В кэше лежат только заголовки и адреса, текст кандидатов дальше функции не идёт.
export const fetchExchangeMentions = unstable_cache(
  async (name: string, slugRu: string, slugEn: string, website: string | null | undefined, locale: string): Promise<ExchangeMention[]> => {
    if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return [];
    const rule = mentionRule(name, slugEn);
    const domain = website ? extractDomain(website) : null;
    const conditions = rule.terms.map((_, i) => `title match $term${i} || pt::text(body) match $term${i}`).join(' || ');
    const terms = Object.fromEntries(rule.terms.map((term, i) => [`term${i}`, `${term}*`]));

    try {
      const candidates: ExchangeMentionCandidate[] = await client.fetch(
        `*[_type in ["article", "news"] && language == $locale && publishedAt <= now() && (${conditions})] | order(publishedAt desc) {
          _type, title, "slug": slug.current, publishedAt,
          "coverImage": coverImage.asset->url,
          "text": pt::text(body),
          "hrefs": body[].markDefs[].href
        }`,
        { locale, ...terms }
      );

      return candidates
        .filter(c => {
          if (!isVenueNews(c.slug)) return false;
          const full = `${c.title}\n${c.text ?? ''}`;
          return rule.isMention(full) || (rule.named(full) && linksToVenue(c.hrefs, [slugRu, slugEn], domain));
        })
        .map(({ _type, title, slug, publishedAt, coverImage }) => ({
          _type, title, slug, publishedAt, coverImage, inTitle: rule.named(title),
        }));
    } catch {
      return [];
    }
  },
  ['fetchExchangeMentionsByName'],
  { revalidate: ARCHIVE_CACHE_SECONDS, tags: ['exchanges', 'articles', 'news'] }
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
  // Same bug as fetchComments above: sat at 20s, refreshing fifteen times
  // more often than every other cached read on the site for a handful of
  // reviews per exchange page.
  //
  // Тег по той же причине, что у комментариев: одобренный отзыв обязан
  // появиться на странице биржи сразу, а не через час.
  { revalidate: READ_CACHE_SECONDS, tags: ['exchange-reviews'] }
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

/* ────────────────────────────────────────────────────────────────────────
   Блок участников внизу главной.

   Редактор может собрать его руками в админке, а может не трогать вовсе:
   каждая часть, оставленная пустой, добирается автоматически. Поэтому блок
   живой с первого дня и не превращается в пустую рамку, если про него
   забыли.
   ──────────────────────────────────────────────────────────────────────── */

export interface WidgetMaterial {
  _id: string;
  _type: 'article' | 'news';
  title: string;
  slug: string;
  excerpt?: string;
  publishedAt: string;
  views: number;
  cover?: string;
  author?: {
    name: string;
    firstNameRu?: string; lastNameRu?: string;
    firstNameEn?: string; lastNameEn?: string;
    slug: string;
    roleRu?: string; roleEn?: string;
    photo?: string;
    entityKind?: 'person' | 'organization';
    haloColor?: string;
  } | null;
}

export interface HomeAuthorsWidget {
  show: boolean;
  hero: WidgetMaterial | null;
  items: WidgetMaterial[];
  reading: WidgetMaterial[];
}

const WIDGET_MATERIAL_PROJECTION = `
  _id, _type, title, "slug": slug.current, excerpt, publishedAt,
  "views": coalesce(views, 0), "cover": coverImage.asset->url,
  "author": author->{
    name, firstNameRu, lastNameRu, firstNameEn, lastNameEn,
    "slug": slug.current, roleRu, roleEn, "photo": photo.asset->url,
    entityKind, haloColor, "hidden": coalesce(hidden, false)
  }
`;

export const fetchHomeAuthorsWidget = unstable_cache(
  async (locale: string): Promise<HomeAuthorsWidget> => {
    const empty: HomeAuthorsWidget = { show: false, hero: null, items: [], reading: [] };
    if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return empty;

    const lang = locale === 'ru' ? 'ru' : 'en';
    const pick = lang === 'ru' ? 'ru' : 'en';

    try {
      const data = await client.fetch(
        `{
          "settings": *[_type == "homeSettings"][0] {
            "show": coalesce(showAuthorsWidget, true),
            "hero": authorsWidgetHero.${pick}-> { ${WIDGET_MATERIAL_PROJECTION} },
            "items": authorsWidgetItems[].${pick}-> { ${WIDGET_MATERIAL_PROJECTION} },
            "reading": authorsWidgetReading[].${pick}-> { ${WIDGET_MATERIAL_PROJECTION} }
          },
          "autoHero": *[_type == "article" && language == $lang
              && defined(coverImage.asset) && defined(author)
              && !(coalesce(author->hidden, false))]
            | order(publishedAt desc)[0] { ${WIDGET_MATERIAL_PROJECTION} },
          "autoItems": *[_type == "author" && !(coalesce(hidden, false))] {
              "m": *[_type in ["article", "news"] && language == $lang
                  && author._ref == ^._id]
                | order(publishedAt desc)[0] { ${WIDGET_MATERIAL_PROJECTION} }
            }[defined(m)].m | order(publishedAt desc),
          "autoReading": *[_type in ["article", "news"] && language == $lang]
            | order(coalesce(views, 0) desc)[0...6] { ${WIDGET_MATERIAL_PROJECTION} }
        }`,
        { lang }
      );

      const s = data?.settings;
      if (s && s.show === false) return empty;

      const clean = (list: unknown): WidgetMaterial[] =>
        ((list as WidgetMaterial[]) || []).filter((m) => m && m._id && m.title);

      const hero: WidgetMaterial | null = s?.hero?._id ? s.hero : (data?.autoHero ?? null);

      /* Автоподбор трёх публикаций: запрос отдаёт по одной свежей работе на
         каждого участника, здесь остаётся отсеять автора героя. Брать просто
         последние материалы сайта нельзя — почти все они принадлежат одному
         новостнику, и блок про авторов стал бы его личной лентой. */
      let items: WidgetMaterial[] = clean(s?.items);
      if (items.length === 0) {
        const seen = new Set<string>();
        if (hero?.author?.slug) seen.add(hero.author.slug);
        const picked: WidgetMaterial[] = [];
        for (const m of clean(data?.autoItems)) {
          const key = m.author?.slug;
          if (!key || seen.has(key)) continue;
          seen.add(key);
          picked.push(m);
          if (picked.length >= 3) break;
        }
        items = picked;
      }
      items = items.slice(0, 3);

      let reading = clean(s?.reading);
      if (reading.length === 0) reading = clean(data?.autoReading).slice(0, 4);
      // Герой не дублируется в правой колонке: один и тот же заголовок дважды
      // в одном блоке читается как ошибка вёрстки.
      reading = reading.filter((m) => m._id !== hero?._id).slice(0, 4);

      return { show: true, hero, items, reading };
    } catch {
      return empty;
    }
  },
  ['fetchHomeAuthorsWidget'],
  { revalidate: READ_CACHE_SECONDS, tags: ['homeSettings', 'articles', 'news'] }
);
