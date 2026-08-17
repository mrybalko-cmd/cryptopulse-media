export const revalidate = 300;

import { getTranslations, setRequestLocale} from 'next-intl/server';
import { buildOg, buildTwitter, BASE } from '@/lib/metadata';
import type { Metadata } from 'next';
import { fetchArticles } from '@/lib/sanity';
import ArticlesListingBody from './ArticlesListingBody';
import { SITE_URL } from '@/lib/site';

export const INITIAL_LIMIT = 15;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'articles' });
  const title = t('title');
  const description = t('subtitle');
  return {
    title,
    description,
    openGraph: buildOg({ url: `${BASE}/${locale}/articles`, title, description, locale }),
    twitter: buildTwitter({ url: `${BASE}/${locale}/articles`, title, description, locale }),
    alternates: {
      canonical: `${SITE_URL}/${locale}/articles`,
      languages: { ru: `${SITE_URL}/ru/articles`, en: `${SITE_URL}/en/articles`, 'x-default': `${SITE_URL}/en/articles` },
    },
  };
}

export default async function ArticlesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('articles');

  const articles = await fetchArticles({ limit: INITIAL_LIMIT, locale });
  const hasNext = articles.length === INITIAL_LIMIT;

  return (
    <ArticlesListingBody
      locale={locale}
      title={t('title')}
      subtitle={t('subtitle')}
      articles={articles}
      page={1}
      pageSize={INITIAL_LIMIT}
      hasNext={hasNext}
      startOffsetForLoadMore={articles.length}
    />
  );
}
