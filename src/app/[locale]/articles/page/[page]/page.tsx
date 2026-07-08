export const revalidate = 300;

import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { buildOg, BASE } from '@/lib/metadata';
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
  const description = t('subtitle');
  return {
    title,
    description,
    openGraph: buildOg({ url: `${BASE}/${locale}/articles/page/${page}`, title, description, locale }),
    alternates: {
      canonical: `${BASE}/${locale}/articles/page/${page}`,
      languages: {
        ru: `${BASE}/ru/articles/page/${page}`,
        en: `${BASE}/en/articles/page/${page}`,
      },
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
