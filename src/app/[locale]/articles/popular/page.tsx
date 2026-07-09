export const revalidate = 300;

import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { buildOg, BASE } from '@/lib/metadata';
import { fetchTopLikedArticles } from '@/lib/sanity';
import ArticleCard from '@/components/ui/ArticleCard';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const isRu = locale === 'ru';
  const title = isRu
    ? 'Самые залайканные статьи — CryptoPulse.media'
    : 'Most liked articles — CryptoPulse.media';
  const description = isRu
    ? 'Статьи CryptoPulse.media, которые читатели отметили лайком чаще всего.'
    : 'CryptoPulse.media articles readers have liked the most.';
  return {
    title,
    description,
    openGraph: buildOg({ url: `${BASE}/${locale}/articles/popular`, title, description, locale }),
    alternates: {
      canonical: `${BASE}/${locale}/articles/popular`,
      languages: { ru: `${BASE}/ru/articles/popular`, en: `${BASE}/en/articles/popular` },
    },
  };
}

export default async function PopularArticlesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isRu = locale === 'ru';

  const articles = await fetchTopLikedArticles(locale, 30);
  const pageTitle = isRu ? 'Самые залайканные статьи' : 'Most liked articles';
  const pageUrl = `${BASE}/${locale}/articles/popular`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: pageTitle,
    url: pageUrl,
    ...(articles.length > 0 && {
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: articles.map((article, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          url: `${BASE}/${locale}/articles/${article.slug.current}`,
          name: article.title,
        })),
      },
    }),
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: isRu ? 'Главная' : 'Home', item: `${BASE}/${locale}` },
      { '@type': 'ListItem', position: 2, name: isRu ? 'Статьи' : 'Articles', item: `${BASE}/${locale}/articles` },
      { '@type': 'ListItem', position: 3, name: pageTitle, item: pageUrl },
    ],
  };

  return (
    <div className="max-w-[100rem] mx-auto px-4 sm:px-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <Link
        href={`/${locale}/articles`}
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-accent transition-colors mb-8"
      >
        <ArrowLeft size={14} />
        {isRu ? 'Все статьи' : 'All articles'}
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">{pageTitle}</h1>
        <p className="text-muted text-sm mt-1">
          {articles.length > 0
            ? isRu
              ? `${articles.length} ${articles.length === 1 ? 'материал' : articles.length < 5 ? 'материала' : 'материалов'}`
              : `${articles.length} ${articles.length === 1 ? 'article' : 'articles'}`
            : isRu ? 'Пока никто ничего не лайкнул' : 'No likes yet'}
        </p>
      </div>

      {articles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {articles.map((article, i) => (
            <ArticleCard
              key={article._id}
              title={article.title}
              excerpt={article.excerpt ?? ''}
              slug={article.slug.current}
              coverImage={article.coverImage}
              coverImageAlt={article.coverImageAlt}
              publishedAt={article.publishedAt}
              readingTime={article.readingTime}
              badge={article.badge}
              views={article.views}
              likes={article.likes}
              locale={locale}
              priority={i < 2}
            />
          ))}
        </div>
      ) : (
        <div className="border border-dashed border-border rounded-lg py-20 flex items-center justify-center">
          <p className="text-muted text-sm">
            {isRu ? 'Как только читатели начнут лайкать статьи, они появятся здесь.' : 'Once readers start liking articles, they’ll show up here.'}
          </p>
        </div>
      )}
    </div>
  );
}
