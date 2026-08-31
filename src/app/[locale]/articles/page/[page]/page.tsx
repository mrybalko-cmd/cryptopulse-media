export const revalidate = 300;

import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { buildOg, buildTwitter, BASE } from '@/lib/metadata';
import type { Metadata } from 'next';
import { fetchArticles, countSanityArticles } from '@/lib/sanity';
import ArticlesListingBody from '../../ArticlesListingBody';
import { INITIAL_LIMIT } from '../../page';

// page 1 lives at /articles itself; this route only serves page >= 2 — a
// crawler following "Load more"'s real href lands here instead of relying on
// JS. Kept as its own dynamic segment (not a ?page= query param) so the
// high-traffic /articles page above stays statically generated/ISR-cached.
type Props = {
  params: Promise<{ locale: string; page: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, page: pageParam } = await params;
  const page = Number(pageParam);
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'articles' });
  const title = t('title');
  // t('subtitle') is identical on every page in this series — append the
  // page number so the meta description isn't byte-identical across them.
  const description = `${t('subtitle')} ${locale === 'ru' ? `— страница ${page}` : `— page ${page}`}`;
  return {
    title,
    description,
    openGraph: buildOg({ url: `${BASE}/${locale}/articles/page/${page}`, title, description, locale }),
    twitter: buildTwitter({ url: `${BASE}/${locale}/articles/page/${page}`, title, description, locale }),
    // Indexable since 31.08.2026. These pages carried noindex,follow to keep
    // near-duplicate listings out of the index while still passing crawl paths
    // to older material. Two Ahrefs crawls showed the follow half never
    // happened: every orphaned article reported `pagination inlinks = 0`, and
    // the orphan count grew 69 -> 97 while numbered pagination was live and
    // the articles were reachable by hand. A crawler that will not traverse a
    // noindex page cannot follow its links, so the listing has to be indexable
    // for the links on it to count. hreflang follows, now that both sides of
    // the pair are indexable — the same shape author pagination already uses.
    alternates: {
      canonical: `${BASE}/${locale}/articles/page/${page}`,
      languages: {
        ru: `${BASE}/ru/articles/page/${page}`,
        en: `${BASE}/en/articles/page/${page}`,
        'x-default': `${BASE}/en/articles/page/${page}`,
      },
    },
  };
}

export default async function ArticlesDeepPage({ params }: Props) {
  const { locale, page: pageParam } = await params;
  const page = Number(pageParam);
  if (!Number.isInteger(page) || page < 2) notFound();
  setRequestLocale(locale);
  const t = await getTranslations('articles');

  const offset = (page - 1) * INITIAL_LIMIT;
  const articles = await fetchArticles({ limit: INITIAL_LIMIT, locale, offset });
  if (articles.length === 0) notFound();

  const hasNext = articles.length === INITIAL_LIMIT;
  const totalPages = Math.max(1, Math.ceil(((await countSanityArticles(locale)) ?? 0) / INITIAL_LIMIT));

  return (
    <ArticlesListingBody
      locale={locale}
      title={t('title')}
      subtitle={t('subtitle')}
      articles={articles}
      page={page}
      pageSize={INITIAL_LIMIT}
      hasNext={hasNext}
      startOffsetForLoadMore={offset + articles.length}
      totalPages={totalPages}
    />
  );
}
