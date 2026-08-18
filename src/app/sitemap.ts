import { MetadataRoute } from 'next';
import { fetchArticles, fetchSanityNews, fetchAuthors, fetchTopicStats, fetchExchangeSlugsForSitemap } from '@/lib/sanity';
import type { TopicStat } from '@/lib/sanity';
import { GLOSSARY, GLOSSARY_BASELINE } from '@/lib/glossary';
import { AI_GLOSSARY, AI_GLOSSARY_BASELINE } from '@/lib/aiGlossary';
import { COINS } from '@/lib/coins';
import { TOPIC_SLUGS, NEWS_TOPIC_SLUGS } from '@/lib/topics';
import { LISTING_PATHS, LIVE_DATA_PATHS, TOOL_PATHS, INFO_PATHS } from '@/lib/sitemapRoutes';
import { PAGE_REVISIONS } from '@/lib/pageRevisions';
import { SITE_URL } from '@/lib/site';
import { getRegulationCountries } from '@/lib/regulation';

const BASE = SITE_URL;

// Rebuild hourly. Without this the whole sitemap — including the daily dates on
// live-data pages and the newest-content dates on listings — would freeze at
// build time and only move when someone deploys, which is the coupling between
// lastmod and deploys this file exists to avoid.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [
    articlesRu, articlesEn, newsRu, newsEn, authors,
    articleTopicsRu, articleTopicsEn, newsTopicsRu, newsTopicsEn,
    exchanges,
  ] = await Promise.all([
    fetchArticles({ limit: 500, locale: 'ru' }),
    fetchArticles({ limit: 500, locale: 'en' }),
    fetchSanityNews({ limit: 1000, locale: 'ru' }),
    fetchSanityNews({ limit: 1000, locale: 'en' }),
    fetchAuthors(),
    fetchTopicStats('article', 'ru'),
    fetchTopicStats('article', 'en'),
    fetchTopicStats('news', 'ru'),
    fetchTopicStats('news', 'en'),
    fetchExchangeSlugsForSitemap(),
  ]);

  // ── Dating policy ──────────────────────────────────────────────────────────
  // Every URL's lastmod comes from whichever of these actually governs that
  // page, and none of them may move merely because we deployed:
  //
  //   Content            editorial updatedAt, else publishedAt. Deliberately
  //                      NOT Sanity's _updatedAt — incrementViews() patches
  //                      article and news documents on every page view, so
  //                      _updatedAt there is a traffic timestamp, not a
  //                      content one, and would mark all 1300 materials as
  //                      "just modified" forever.
  //   Listings           the newest item they list.
  //   Topic listings     the newest item in that topic.
  //   Exchanges/authors  Sanity _updatedAt — safe there. Authors change only by
  //                      hand; exchanges also move on the daily volume cron,
  //                      which is a real change to a page that ranks by volume.
  //   Live-data pages    today at day granularity. The numbers really do differ
  //                      from yesterday's, and same-day deploys produce the
  //                      same value, so it's honest without being churn.
  //   Hand-authored      their source file's commit date, from pageRevisions.ts
  //                      (regenerate: node scripts/gen-page-revisions.mjs).
  //   Glossary terms     the term's own `updated` if it carries one, else the
  //                      set's frozen baseline (not the file's commit date, or
  //                      one rewritten term would re-date all 65).
  //
  // This replaces a single hardcoded 2026-06-01 that covered 364 of 1668 URLs —
  // all of the glossary and assets, 97% of exchanges, 92% of the AI section —
  // and told Google nothing on any of them ever changed.

  /** Only the fields the sitemap reads — the fetchers return untyped GROQ results. */
  type Material = { slug: { current: string }; publishedAt: string; updatedAt?: string };
  type Author = { slug: string; _updatedAt?: string };

  const toDate = (v?: string | null): Date | null => {
    if (!v) return null;
    const d = new Date(v);
    return Number.isNaN(d.getTime()) ? null : d;
  };

  const now = new Date();
  /** Today, truncated to the UTC day, so repeated deploys within a day agree. */
  const todayUtc = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

  /** Commit date of a hand-authored page; falls back to today only if the
   *  generated map is missing an entry, which the generator warns about. */
  const revisionOf = (key: string): Date => toDate(PAGE_REVISIONS[key]) ?? todayUtc;

  /** A material's real editorial date. */
  const contentDate = (x: { updatedAt?: string; publishedAt: string }): Date =>
    toDate(x.updatedAt) ?? toDate(x.publishedAt) ?? todayUtc;

  const newest = (dates: (Date | null)[]): Date | null => {
    const valid = dates.filter((d): d is Date => d !== null);
    return valid.length ? new Date(Math.max(...valid.map((d) => d.getTime()))) : null;
  };

  // Freshest published item — used as lastmod for content listings so they only
  // advance when real content ships, not on every deploy.
  const allContent = [...newsRu, ...newsEn, ...articlesRu, ...articlesEn] as {
    updatedAt?: string; publishedAt: string;
  }[];
  const latestContentDate = newest(allContent.map(contentDate)) ?? todayUtc;

  const liveDataPaths = [
    ...LIVE_DATA_PATHS,
    ...COINS.filter(c => c.available).map(c => `/assets/${c.slug}`),
  ];

  /**
   * Country pages appear here the moment an editor ticks "Своя страница" —
   * derived from the same data the route uses, so a sixth country cannot end
   * up live and absent from the sitemap the way a hand-kept list would allow.
   */
  const countryPages = (await getRegulationCountries())
    .filter(c => c.hasPage)
    .flatMap(c => [
      { url: `${BASE}/ru/regulation/${c.slug}`, lastModified: new Date(c.checkedAt), changeFrequency: 'monthly' as const, priority: 0.7 },
      { url: `${BASE}/en/regulation/${c.slug}`, lastModified: new Date(c.checkedAt), changeFrequency: 'monthly' as const, priority: 0.7 },
    ]);

  const staticPages = [
    ...LISTING_PATHS.flatMap(path => [
      { url: `${BASE}/ru${path}`, lastModified: latestContentDate, changeFrequency: 'daily' as const, priority: path === '' ? 1 : 0.9 },
      { url: `${BASE}/en${path}`, lastModified: latestContentDate, changeFrequency: 'daily' as const, priority: path === '' ? 1 : 0.9 },
    ]),
    ...liveDataPaths.flatMap(path => [
      { url: `${BASE}/ru${path}`, lastModified: todayUtc, changeFrequency: 'daily' as const, priority: 0.7 },
      { url: `${BASE}/en${path}`, lastModified: todayUtc, changeFrequency: 'daily' as const, priority: 0.7 },
    ]),
    ...TOOL_PATHS.flatMap(path => [
      { url: `${BASE}/ru${path}`, lastModified: revisionOf(path), changeFrequency: 'weekly' as const, priority: 0.7 },
      { url: `${BASE}/en${path}`, lastModified: revisionOf(path), changeFrequency: 'weekly' as const, priority: 0.7 },
    ]),
    ...INFO_PATHS.flatMap(path => [
      { url: `${BASE}/ru${path}`, lastModified: revisionOf(path), changeFrequency: 'monthly' as const, priority: 0.5 },
      { url: `${BASE}/en${path}`, lastModified: revisionOf(path), changeFrequency: 'monthly' as const, priority: 0.5 },
    ]),
  ];

  const articlePages = [
    ...(articlesRu as Material[]).map((a) => ({
      url: `${BASE}/ru/articles/${a.slug.current}`,
      lastModified: contentDate(a),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    })),
    ...(articlesEn as Material[]).map((a) => ({
      url: `${BASE}/en/articles/${a.slug.current}`,
      lastModified: contentDate(a),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    })),
  ];

  const newsPages = [
    ...(newsRu as Material[]).map((n) => ({
      url: `${BASE}/ru/news/${n.slug.current}`,
      lastModified: contentDate(n),
      changeFrequency: 'hourly' as const,
      priority: 0.9,
    })),
    ...(newsEn as Material[]).map((n) => ({
      url: `${BASE}/en/news/${n.slug.current}`,
      lastModified: contentDate(n),
      changeFrequency: 'hourly' as const,
      priority: 0.9,
    })),
  ];

  const glossaryDate = toDate(GLOSSARY_BASELINE) ?? todayUtc;
  const glossaryTermPages = GLOSSARY.flatMap(term => {
    const d = toDate(term.updated) ?? glossaryDate;
    return [
      { url: `${BASE}/ru/glossary/${term.slug}`, lastModified: d, changeFrequency: 'monthly' as const, priority: 0.6 },
      { url: `${BASE}/en/glossary/${term.slug}`, lastModified: d, changeFrequency: 'monthly' as const, priority: 0.6 },
    ];
  });

  const aiGlossaryDate = toDate(AI_GLOSSARY_BASELINE) ?? todayUtc;
  const aiGlossaryTermPages = AI_GLOSSARY.flatMap(term => {
    const d = toDate(term.updated) ?? aiGlossaryDate;
    return [
      { url: `${BASE}/ru/ai/glossary/${term.slug}`, lastModified: d, changeFrequency: 'monthly' as const, priority: 0.6 },
      { url: `${BASE}/en/ai/glossary/${term.slug}`, lastModified: d, changeFrequency: 'monthly' as const, priority: 0.6 },
    ];
  });

  const authorPages = (authors as Author[]).flatMap((a) => {
    const d = toDate(a._updatedAt) ?? todayUtc;
    return [
      { url: `${BASE}/ru/authors/${a.slug}`, lastModified: d, changeFrequency: 'weekly' as const, priority: 0.7 },
      { url: `${BASE}/en/authors/${a.slug}`, lastModified: d, changeFrequency: 'weekly' as const, priority: 0.7 },
    ];
  });

  // Topic listing pages are secondary filter/navigation views over content
  // that's already listed (and crawled) elsewhere — priority/frequency
  // deliberately kept below real articles and news so they don't compete
  // with actual content for a crawl budget that's already constrained.
  // Topics with fewer than 3 published items get noindex'd by the topic
  // page itself (see isThin in page.tsx) — mirror that threshold here so
  // a thin topic never ends up noindex'd yet still listed in the sitemap.
  const topicEntry = (stats: Record<string, TopicStat>, topic: string, url: string) => {
    const s = stats[topic];
    if (!s || s.count < 3) return [];
    return [{ url, lastModified: toDate(s.latest) ?? latestContentDate, changeFrequency: 'weekly' as const, priority: 0.4 }];
  };

  const topicPages = TOPIC_SLUGS.flatMap(topic => [
    ...topicEntry(articleTopicsRu, topic, `${BASE}/ru/articles/topic/${topic}`),
    ...topicEntry(articleTopicsEn, topic, `${BASE}/en/articles/topic/${topic}`),
  ]);

  const newsTopicPages = NEWS_TOPIC_SLUGS.flatMap(topic => [
    ...topicEntry(newsTopicsRu, topic, `${BASE}/ru/news/topic/${topic}`),
    ...topicEntry(newsTopicsEn, topic, `${BASE}/en/news/topic/${topic}`),
  ]);

  const exchangePages = exchanges.flatMap(e => {
    const d = toDate(e._updatedAt) ?? todayUtc;
    return [
      { url: `${BASE}/ru/exchanges/${e.slugRu}`, lastModified: d, changeFrequency: 'daily' as const, priority: 0.7 },
      { url: `${BASE}/en/exchanges/${e.slugEn}`, lastModified: d, changeFrequency: 'daily' as const, priority: 0.7 },
    ];
  });

  // These list the exchange's press coverage, so they move with the newsroom
  // rather than with the exchange document.
  const exchangeNewsPages = exchanges.flatMap(e => [
    { url: `${BASE}/ru/exchanges/${e.slugRu}/news`, lastModified: latestContentDate, changeFrequency: 'daily' as const, priority: 0.5 },
    { url: `${BASE}/en/exchanges/${e.slugEn}/news`, lastModified: latestContentDate, changeFrequency: 'daily' as const, priority: 0.5 },
  ]);

  return [...staticPages, ...countryPages, ...articlePages, ...newsPages, ...glossaryTermPages, ...aiGlossaryTermPages, ...authorPages, ...topicPages, ...newsTopicPages, ...exchangePages, ...exchangeNewsPages];
}
