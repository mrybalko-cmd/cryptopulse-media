import { MetadataRoute } from 'next';
import { client, fetchAuthors, fetchTopicStats, fetchExchangeMentions, fetchExchangeSlugsForSitemap, fetchBrokerSlugsForSitemap, fetchNoIndexKeys } from '@/lib/sanity';
import { exchangeNewsPageCount } from '@/lib/exchangeMentions';
import type { TopicStat } from '@/lib/sanity';
import { GLOSSARY_BASELINE } from '@/lib/glossary';
import { AI_GLOSSARY_BASELINE } from '@/lib/aiGlossary';
import { getCryptoGlossary, getAiGlossary } from '@/lib/glossaryData';
import { COINS } from '@/lib/coins';
import { TOPIC_SLUGS, NEWS_TOPIC_SLUGS } from '@/lib/topics';
import { LISTING_PATHS, LIVE_DATA_PATHS, TOOL_PATHS, INFO_PATHS } from '@/lib/sitemapRoutes';
import { PAGE_REVISIONS } from '@/lib/pageRevisions';
import { SITE_URL } from '@/lib/site';
import { getRegulationCountries } from '@/lib/regulation';
import { getLicenceRegimes } from '@/lib/licences';
import { getAiJobs, getAiServices } from '@/lib/ai';
import { loadAuthors } from '@/app/[locale]/authors/AuthorsView';

const BASE = SITE_URL;

/**
 * Все материалы для карты сайта — одним лёгким запросом, без лимита и мимо
 * unstable_cache.
 *
 * Раньше карта брала fetchSanityNews({ limit: 1000 }) на язык. Новостей стало
 * 1376 на язык, и 376 самых старых на каждом языке в карту не попадали вовсе.
 * А сама карта жила как ISR-страница и с деплоя 03.11.2026 ни разу не
 * пересобралась на Vercel: отдавала снимок момента сборки (0 из 42 свежих
 * материалов), хотя локально пересборка проходила. Теперь её отдаёт обычный
 * маршрут sitemap.xml/route.ts с кэшем CDN на час, а данные читаются здесь
 * напрямую — каждая сборка карты видит базу как есть.
 */
type SitemapMaterial = {
  _type: 'news' | 'article';
  language: 'ru' | 'en';
  slug: { current: string };
  publishedAt: string;
  updatedAt?: string;
};

async function fetchSitemapMaterials(): Promise<SitemapMaterial[]> {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return [];
  return client.fetch(
    `*[_type in ["news", "article"] && language in ["ru", "en"] && defined(slug.current) && publishedAt <= now()]
       | order(publishedAt desc) { _type, language, slug, publishedAt, updatedAt }`,
  );
}

/** События календаря: только то, что нужно карте, плюс _updatedAt для даты. */
async function fetchSitemapCalendar(): Promise<{ slug: string; date: string; endDate?: string; _updatedAt?: string }[]> {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return [];
  return client.fetch(
    `*[_type == "calendarEvent" && defined(slug.current)] | order(date asc) { "slug": slug.current, date, endDate, _updatedAt }`,
  );
}

export async function buildSitemapEntries(): Promise<MetadataRoute.Sitemap> {
  // Термины читаются из базы, иначе добавленный через админку термин
  // не попал бы в карту сайта до следующего деплоя.
  const GLOSSARY = await getCryptoGlossary();
  const AI_GLOSSARY = await getAiGlossary();
  const [
    materials, authors,
    articleTopicsRu, articleTopicsEn, newsTopicsRu, newsTopicsEn,
    exchanges, noIndexKeys,
  ] = await Promise.all([
    fetchSitemapMaterials(),
    fetchAuthors(),
    fetchTopicStats('article', 'ru'),
    fetchTopicStats('article', 'en'),
    fetchTopicStats('news', 'ru'),
    fetchTopicStats('news', 'en'),
    fetchExchangeSlugsForSitemap(),
    fetchNoIndexKeys(),
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
  const pick = (type: SitemapMaterial['_type'], language: SitemapMaterial['language']) =>
    materials.filter((m) => m._type === type && m.language === language);
  const articlesRu = pick('article', 'ru');
  const articlesEn = pick('article', 'en');
  const newsRu = pick('news', 'ru');
  const newsEn = pick('news', 'en');
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
  /* Страницы витрины участников со второй и дальше. Первая лежит в
     LISTING_PATHS, а эти появляются и исчезают вместе с числом участников. */
  const { totalPages: authorsTotalPages } = await loadAuthors('en');
  const authorPagedPages = Array.from({ length: Math.max(0, authorsTotalPages - 1) }, (_, i) => i + 2)
    .flatMap((n) => ['ru', 'en'].map((loc) => ({
      url: `${BASE}/${loc}/authors/page/${n}`,
      lastModified: todayUtc,
      changeFrequency: 'weekly' as const,
      priority: 0.4,
    })));

  /* Страницы событий. Прошедшие остаются в карте: у них есть итог и свой
     адрес, и поиск их уже знает. Частота обновления разная — будущее событие
     могут перенести, прошедшему правят разве что итог. */
  const calendarEvents = await fetchSitemapCalendar();
  const todayCal = new Date().toISOString().slice(0, 10);
  const calendarEventPages = calendarEvents.flatMap((e) => {
    const upcoming = e.date >= todayCal;
    // Дата правки карточки, а не «сегодня»: раньше все 100 событий получали
    // сегодняшний lastmod при каждой сборке, и Google переставал ему верить.
    const d = toDate(e._updatedAt) ?? toDate(e.endDate ?? e.date) ?? todayUtc;
    return ['ru', 'en'].map((loc) => ({
      url: `${BASE}/${loc}/calendar/${e.slug}`,
      lastModified: d,
      changeFrequency: upcoming ? ('weekly' as const) : ('monthly' as const),
      priority: upcoming ? 0.6 : 0.4,
    }));
  });

  const countryPages = (await getRegulationCountries())
    .filter(c => c.hasPage)
    .flatMap(c => [
      { url: `${BASE}/ru/regulation/${c.slug}`, lastModified: new Date(c.checkedAt), changeFrequency: 'monthly' as const, priority: 0.7 },
      { url: `${BASE}/en/regulation/${c.slug}`, lastModified: new Date(c.checkedAt), changeFrequency: 'monthly' as const, priority: 0.7 },
    ]);

  /* Лицензионные режимы. Страницы живут в Sanity, поэтому перечисляются
     отсюда, а не из списка путей: новый режим попадает в карту сайта сам. */
  const licencePages = (await getLicenceRegimes()).flatMap(r => [
    { url: `${BASE}/ru/regulation/licences/${r.slug}`, lastModified: new Date(r.checkedAt), changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${BASE}/en/regulation/licences/${r.slug}`, lastModified: new Date(r.checkedAt), changeFrequency: 'monthly' as const, priority: 0.7 },
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

  // Галка «noIndex» в админке убирает материал из карты сайта, но не из лент:
  // читатель его видит, поисковику мы его не предлагаем. См. fetchNoIndexKeys.
  const indexable = (type: 'article' | 'news', locale: string) =>
    (m: Material) => !noIndexKeys.has(`${type}:${locale}:${m.slug.current}`);

  const articlePages = [
    ...(articlesRu as Material[]).filter(indexable('article', 'ru')).map((a) => ({
      url: `${BASE}/ru/articles/${a.slug.current}`,
      lastModified: contentDate(a),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    })),
    ...(articlesEn as Material[]).filter(indexable('article', 'en')).map((a) => ({
      url: `${BASE}/en/articles/${a.slug.current}`,
      lastModified: contentDate(a),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    })),
  ];

  const newsPages = [
    ...(newsRu as Material[]).filter(indexable('news', 'ru')).map((n) => ({
      url: `${BASE}/ru/news/${n.slug.current}`,
      lastModified: contentDate(n),
      changeFrequency: 'hourly' as const,
      priority: 0.9,
    })),
    ...(newsEn as Material[]).filter(indexable('news', 'en')).map((n) => ({
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

  // Новые страницы в sitemap сами не попадают: брокеры добавлены здесь отдельно.
  const brokers = await fetchBrokerSlugsForSitemap();
  const brokerPages = brokers.flatMap(b => {
    const d = toDate(b._updatedAt) ?? todayUtc;
    return [
      { url: `${BASE}/ru/brokers/${b.slugRu}`, lastModified: d, changeFrequency: 'weekly' as const, priority: 0.7 },
      { url: `${BASE}/en/brokers/${b.slugEn}`, lastModified: d, changeFrequency: 'weekly' as const, priority: 0.7 },
    ];
  });
  const brokerHubPages = (['ru', 'en'] as const).map(l => ({
    url: `${BASE}/${l}/brokers`, lastModified: todayUtc, changeFrequency: 'weekly' as const, priority: 0.8,
  }));

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

  // Вторая страница архива и дальше. Число страниц у языков разное, поэтому
  // считаем для каждого отдельно.
  const exchangeNewsDeepPages = (await Promise.all(
    exchanges.flatMap(e => (['ru', 'en'] as const).map(async loc => {
      const mentions = await fetchExchangeMentions(e.name, e.slugRu, e.slugEn, e.website, loc);
      const slug = loc === 'ru' ? e.slugRu : e.slugEn;
      return Array.from({ length: exchangeNewsPageCount(mentions.length) - 1 }, (_, i) => ({
        url: `${BASE}/${loc}/exchanges/${slug}/news/page/${i + 2}`,
        lastModified: latestContentDate,
        changeFrequency: 'weekly' as const,
        priority: 0.4,
      }));
    })),
  )).flat();

  // Новые маршруты в sitemap автоматически не попадают — только руками.
  // Каталог AI датируется проверкой цен, а не моментом сборки: прежний
  // new Date() двигал lastmod при каждой пересборке карты.
  const aiServices = await getAiServices();
  const aiNewest = newest(aiServices.map((s) => toDate(s.priceCheckedAt))) ?? revisionOf('/ai/tools');
  const aiServicePages = aiServices.flatMap(s => {
    const d = toDate(s.priceCheckedAt) ?? aiNewest;
    return [
      { url: `${BASE}/ru/ai/tools/${s.slug}`, lastModified: d, changeFrequency: 'monthly' as const, priority: 0.7 },
      { url: `${BASE}/en/ai/tools/${s.slug}`, lastModified: d, changeFrequency: 'monthly' as const, priority: 0.7 },
    ];
  });
  const aiJobPages = (await getAiJobs()).flatMap(j => [
    { url: `${BASE}/ru/ai/best/${j.slug}`, lastModified: aiNewest, changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${BASE}/en/ai/best/${j.slug}`, lastModified: aiNewest, changeFrequency: 'monthly' as const, priority: 0.7 },
  ]);
  const aiHubPages = ['ru', 'en'].map(l => ({
    url: `${BASE}/${l}/ai/tools`, lastModified: aiNewest, changeFrequency: 'weekly' as const, priority: 0.8,
  }));

  const all = [...staticPages, ...brokerHubPages, ...brokerPages, ...authorPagedPages, ...calendarEventPages, ...countryPages, ...licencePages, ...aiHubPages, ...aiServicePages, ...aiJobPages, ...articlePages, ...newsPages, ...glossaryTermPages, ...aiGlossaryTermPages, ...authorPages, ...topicPages, ...newsTopicPages, ...exchangePages, ...exchangeNewsPages, ...exchangeNewsDeepPages];

  // Один адрес — одна запись. Дубли бывали: два документа с одинаковым slug
  // (top-10-altkoinov-rost-48-chasov и его английская пара) давали по две
  // строки. При совпадении остаётся более свежая дата.
  const byUrl = new Map<string, (typeof all)[number]>();
  for (const entry of all) {
    const prev = byUrl.get(entry.url);
    if (!prev || new Date(entry.lastModified ?? 0) > new Date(prev.lastModified ?? 0)) byUrl.set(entry.url, entry);
  }
  return [...byUrl.values()];
}
