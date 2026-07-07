export const revalidate = 300;

import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { buildOg, BASE } from '@/lib/metadata';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { fetchNewsByTopic } from '@/lib/sanity';
import { SITE_NAME } from '@/lib/constants';
import NewsCard from '@/components/ui/NewsCard';
import { NEWS_TOPICS as TOPICS } from '@/lib/topics';

type Props = { params: Promise<{ locale: string; topic: string }> };

export async function generateStaticParams() {
  const topics = Object.keys(TOPICS);
  return ['ru', 'en'].flatMap(locale => topics.map(topic => ({ locale, topic })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, topic } = await params;
  setRequestLocale(locale);
  const topicData = TOPICS[topic];
  if (!topicData) return {};
  const isRu = locale === 'ru';
  const topicName = isRu ? topicData.ru : topicData.en;
  const title = isRu
    ? `Новости: ${topicName} — CryptoPulse.media`
    : `News: ${topicName} — CryptoPulse.media`;
  const description = isRu
    ? `Последние новости CryptoPulse.media по теме «${topicName}»: актуальные события, аналитика и комментарии.`
    : `Latest CryptoPulse.media news on ${topicName}: events, analysis and commentary.`;
  return {
    title,
    description,
    openGraph: buildOg({ url: `${BASE}/${locale}/news/topic/${topic}`, title, description, locale }),
    alternates: {
      canonical: `${BASE}/${locale}/news/topic/${topic}`,
      languages: {
        ru: `${BASE}/ru/news/topic/${topic}`,
        en: `${BASE}/en/news/topic/${topic}`,
      },
    },
  };
}

export default async function NewsTopicPage({ params }: Props) {
  const { locale, topic } = await params;
  setRequestLocale(locale);

  const topicData = TOPICS[topic];
  if (!topicData) notFound();

  const isRu = locale === 'ru';
  const topicName = isRu ? topicData.ru : topicData.en;
  const news = await fetchNewsByTopic(topic, locale);

  const pageTitle = isRu
    ? `Новости: ${topicName}`
    : `News: ${topicName}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: pageTitle,
    url: `${BASE}/${locale}/news/topic/${topic}`,
    description: isRu
      ? `Новости по теме «${topicName}» на CryptoPulse.media`
      : `News on ${topicName} at CryptoPulse.media`,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="mb-6">
        <Link
          href={`/${locale}/news`}
          className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-accent transition-colors mb-4"
        >
          <ArrowLeft size={14} />
          {isRu ? 'Все новости' : 'All news'}
        </Link>
        <h1 className="text-2xl font-bold text-foreground">{pageTitle}</h1>
        <p className="text-muted text-sm mt-1">
          {isRu
            ? `${news.length} ${news.length === 1 ? 'новость' : news.length < 5 ? 'новости' : 'новостей'}`
            : `${news.length} ${news.length === 1 ? 'article' : 'articles'}`}
        </p>
      </div>

      {/* Topic filter pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        <Link
          href={`/${locale}/news`}
          className="px-3 py-1.5 rounded-full text-xs font-medium border border-border text-muted hover:border-accent/40 hover:text-foreground transition-colors"
        >
          {isRu ? 'Все' : 'All'}
        </Link>
        {Object.entries(TOPICS).map(([key, labels]) => (
          <Link
            key={key}
            href={`/${locale}/news/topic/${key}`}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              key === topic
                ? 'bg-accent text-background border-accent'
                : 'border-border text-muted hover:border-accent/40 hover:text-foreground'
            }`}
          >
            {isRu ? labels.ru : labels.en}
          </Link>
        ))}
      </div>

      {news.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {news.map((item: any) => (
            <NewsCard
              key={item._id}
              title={item.title}
              source={SITE_NAME}
              href={`/${locale}/news/${item.slug.current}`}
              external={false}
              publishedAt={Math.floor(new Date(item.publishedAt).getTime() / 1000)}
              imageUrl={item.coverImage}
              locale={locale}
              breaking={item.breaking}
              ownBadge={item.ownBadge !== false}
            />
          ))}
        </div>
      ) : (
        <div className="border border-dashed border-border rounded-lg py-20 flex items-center justify-center">
          <span className="text-sm text-muted">
            {isRu ? 'Новостей по этой теме пока нет' : 'No news in this topic yet'}
          </span>
        </div>
      )}
    </div>
  );
}
