export const revalidate = 300;

import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { buildOg, BASE } from '@/lib/metadata';
import { fetchTopLikedNews } from '@/lib/sanity';
import NewsListItem from '@/components/ui/NewsListItem';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const isRu = locale === 'ru';
  const title = isRu
    ? 'Самые залайканные новости — CryptoPulse.media'
    : 'Most liked news — CryptoPulse.media';
  const description = isRu
    ? 'Новости CryptoPulse.media, которые читатели отметили лайком чаще всего.'
    : 'CryptoPulse.media news stories readers have liked the most.';
  return {
    title,
    description,
    openGraph: buildOg({ url: `${BASE}/${locale}/news/popular`, title, description, locale }),
    alternates: {
      canonical: `${BASE}/${locale}/news/popular`,
      languages: { ru: `${BASE}/ru/news/popular`, en: `${BASE}/en/news/popular` },
    },
  };
}

export default async function PopularNewsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isRu = locale === 'ru';

  const news = await fetchTopLikedNews(locale, 30);
  const pageTitle = isRu ? 'Самые залайканные новости' : 'Most liked news';
  const pageUrl = `${BASE}/${locale}/news/popular`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: pageTitle,
    url: pageUrl,
    ...(news.length > 0 && {
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: news.map((item, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          url: `${BASE}/${locale}/news/${item.slug.current}`,
          name: item.title,
        })),
      },
    }),
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: isRu ? 'Главная' : 'Home', item: `${BASE}/${locale}` },
      { '@type': 'ListItem', position: 2, name: isRu ? 'Новости' : 'News', item: `${BASE}/${locale}/news` },
      { '@type': 'ListItem', position: 3, name: pageTitle, item: pageUrl },
    ],
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <Link
        href={`/${locale}/news`}
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-accent transition-colors mb-8"
      >
        <ArrowLeft size={14} />
        {isRu ? 'Все новости' : 'All news'}
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">{pageTitle}</h1>
        <p className="text-muted text-sm mt-1">
          {news.length > 0
            ? isRu
              ? `${news.length} ${news.length === 1 ? 'новость' : news.length < 5 ? 'новости' : 'новостей'}`
              : `${news.length} ${news.length === 1 ? 'story' : 'stories'}`
            : isRu ? 'Пока никто ничего не лайкнул' : 'No likes yet'}
        </p>
      </div>

      {news.length > 0 ? (
        <div>
          {news.map((item) => (
            <NewsListItem
              key={item._id}
              title={item.title}
              href={`/${locale}/news/${item.slug.current}`}
              external={false}
              publishedAt={Math.floor(new Date(item.publishedAt).getTime() / 1000)}
              locale={locale}
              breaking={item.breaking}
              ownBadge={item.ownBadge !== false}
              views={item.views}
              likes={item.likes}
            />
          ))}
        </div>
      ) : (
        <div className="border border-dashed border-border rounded-lg py-20 flex items-center justify-center">
          <span className="text-sm text-muted">
            {isRu ? 'Как только читатели начнут лайкать новости, они появятся здесь.' : 'Once readers start liking stories, they’ll show up here.'}
          </span>
        </div>
      )}
    </div>
  );
}
