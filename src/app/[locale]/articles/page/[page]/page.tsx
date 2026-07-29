export const revalidate = 300;

import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { buildOg, buildTwitter, BASE } from '@/lib/metadata';
import type { Metadata } from 'next';
import { fetchArticles } from '@/lib/sanity';
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
    // No hreflang here: this route is always noindex,follow (below), and a
    // noindexed page annotating an equally-noindexed sibling as its language
    // alternate is exactly the "hreflang to/from noindex URL" pattern SEO
    // audits flag — hreflang should only ever point between indexable pages.
    alternates: {
      canonical: `${BASE}/${locale}/articles/page/${page}`,
    },
    robots: { index: false, follow: true },
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
    />
  );
}
