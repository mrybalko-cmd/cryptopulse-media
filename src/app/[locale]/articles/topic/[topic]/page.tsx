export const revalidate = 300;

import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { buildOg, BASE } from '@/lib/metadata';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { fetchArticlesByTopic } from '@/lib/sanity';
import ArticleCard from '@/components/ui/ArticleCard';

const TOPICS: Record<string, { ru: string; en: string }> = {
  regulation: { ru: 'Регулирование', en: 'Regulation' },
  defi: { ru: 'DeFi & Web3', en: 'DeFi & Web3' },
  bitcoin: { ru: 'Bitcoin', en: 'Bitcoin' },
  market: { ru: 'Рынок', en: 'Market' },
  technology: { ru: 'Технологии', en: 'Technology' },
  security: { ru: 'Безопасность', en: 'Security' },
  education: { ru: 'Обучение', en: 'Education' },
  ai: { ru: 'Искусственный интеллект', en: 'AI & Machine Learning' },
};

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
    ? `Статьи по теме: ${topicName} — CryptoPulse.media`
    : `Articles: ${topicName} — CryptoPulse.media`;
  const description = isRu
    ? `Читайте аналитические статьи CryptoPulse.media по теме «${topicName}»: разборы, тренды и экспертные мнения.`
    : `Explore CryptoPulse.media analysis and in-depth articles on ${topicName}: trends, breakdowns, and expert takes.`;
  return {
    title,
    description,
    openGraph: buildOg({ url: `${BASE}/${locale}/articles/topic/${topic}`, title, description, locale }),
    alternates: {
      canonical: `${BASE}/${locale}/articles/topic/${topic}`,
      languages: {
        ru: `${BASE}/ru/articles/topic/${topic}`,
        en: `${BASE}/en/articles/topic/${topic}`,
        'x-default': `${BASE}/en/articles/topic/${topic}`,
      },
    },
  };
}

export default async function TopicPage({ params }: Props) {
  const { locale, topic } = await params;
  setRequestLocale(locale);
  const isRu = locale === 'ru';
  const topicData = TOPICS[topic];
  if (!topicData) notFound();

  const articles = await fetchArticlesByTopic(topic, locale, 50);
  const topicName = isRu ? topicData.ru : topicData.en;
  const pageTitle = isRu
    ? `Статьи по теме: ${topicName} — CryptoPulse.media`
    : `Articles: ${topicName} — CryptoPulse.media`;

  const pageUrl = `${BASE}/${locale}/articles/topic/${topic}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: pageTitle,
    url: pageUrl,
    about: { '@type': 'Thing', name: topicName },
    ...(articles.length > 0 && {
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: articles.map((article: any, i: number) => ({
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
      { '@type': 'ListItem', position: 3, name: topicName, item: pageUrl },
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

      {/* Topic pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        <Link
          href={`/${locale}/articles`}
          className="px-3 py-1.5 rounded-full text-xs font-medium border border-border text-muted hover:border-accent/40 hover:text-foreground transition-colors"
        >
          {isRu ? 'Все' : 'All'}
        </Link>
        {Object.entries(TOPICS).map(([key, labels]) => (
          <Link
            key={key}
            href={`/${locale}/articles/topic/${key}`}
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

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">{topicName}</h1>
        <p className="text-muted text-sm mt-1">
          {articles.length > 0
            ? isRu
              ? `${articles.length} ${articles.length === 1 ? 'материал' : articles.length < 5 ? 'материала' : 'материалов'}`
              : `${articles.length} ${articles.length === 1 ? 'article' : 'articles'}`
            : isRu ? 'Материалов пока нет' : 'No articles yet'}
        </p>
      </div>

      {articles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {articles.map((article: any, i: number) => (
            <ArticleCard
              key={article._id}
              title={article.title}
              excerpt={article.excerpt}
              slug={article.slug.current}
              coverImage={article.coverImage}
              coverImageAlt={article.coverImageAlt}
              publishedAt={article.publishedAt}
              readingTime={article.readingTime}
              badge={article.badge}
              views={article.views}
              locale={locale}
              priority={i < 2}
            />
          ))}
        </div>
      ) : (
        <div className="border border-dashed border-border rounded-lg py-20 flex items-center justify-center">
          <p className="text-muted text-sm">
            {isRu ? 'Статьи по этой теме появятся скоро.' : 'Articles on this topic coming soon.'}
          </p>
        </div>
      )}
    </div>
  );
}
