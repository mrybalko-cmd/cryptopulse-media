export const revalidate = 300;

import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import Image from 'next/image';
import { Zap, Clock, Eye, ArrowRight, Calendar } from 'lucide-react';
import { fetchAIContent } from '@/lib/sanity';
import { buildOg, BASE } from '@/lib/metadata';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isRu = locale === 'ru';
  const title = isRu
    ? 'AI & Искусственный интеллект в крипто — CryptoPulse.media'
    : 'AI & Artificial Intelligence in Crypto — CryptoPulse.media';
  const description = isRu
    ? 'Новости и аналитика об искусственном интеллекте в мире криптовалют и блокчейна. ChatGPT, нейросети, AI-трейдинг, генеративные модели и их влияние на рынок.'
    : 'News and analysis on artificial intelligence in the crypto and blockchain world. ChatGPT, neural networks, AI trading, generative models and their market impact.';
  return {
    title,
    description,
    keywords: isRu
      ? ['AI криптовалюта', 'искусственный интеллект блокчейн', 'ChatGPT крипто', 'AI трейдинг', 'нейросети крипто']
      : ['AI crypto', 'artificial intelligence blockchain', 'ChatGPT crypto', 'AI trading', 'neural networks crypto'],
    openGraph: buildOg({ url: `${BASE}/${locale}/ai`, title, description, locale }),
    alternates: {
      canonical: `${BASE}/${locale}/ai`,
      languages: {
        ru: `${BASE}/ru/ai`,
        en: `${BASE}/en/ai`,
        'x-default': `${BASE}/en/ai`,
      },
    },
  };
}

export default async function AIPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isRu = locale === 'ru';

  const items = await fetchAIContent({ limit: 40, locale });
  const articles = items.filter((i: any) => i._type === 'article');
  const news = items.filter((i: any) => i._type === 'news');

  const pageUrl = `${BASE}/${locale}/ai`;

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: isRu ? 'Главная' : 'Home', item: `${BASE}/${locale}` },
      { '@type': 'ListItem', position: 2, name: 'AI', item: pageUrl },
    ],
  };

  const collectionLd = items.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: isRu ? 'AI & Искусственный интеллект в крипто' : 'AI & Artificial Intelligence in Crypto',
    description: isRu
      ? 'Новости и аналитика об искусственном интеллекте в мире криптовалют'
      : 'News and analysis on AI in the crypto world',
    url: pageUrl,
    inLanguage: locale,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: items.slice(0, 20).map((item: any, i: number) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${BASE}/${locale}/${item._type === 'article' ? 'articles' : 'news'}/${item.slug.current}`,
        name: item.title,
      })),
    },
  } : null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      {collectionLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }} />
      )}

      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <Zap size={28} className="text-yellow-400 shrink-0" fill="currentColor" />
          <h1 className="text-3xl font-bold text-foreground">AI</h1>
        </div>
        <p className="text-muted text-sm max-w-2xl">
          {isRu
            ? 'Новости и аналитика об искусственном интеллекте в мире криптовалют и блокчейна — ChatGPT, AI-трейдинг, нейросети, генеративные модели.'
            : 'News and analysis on artificial intelligence in crypto and blockchain — ChatGPT, AI trading, neural networks, generative models.'}
        </p>
      </div>

      {/* AI Articles */}
      {articles.length > 0 && (
        <section className="mb-12">
          <h2 className="flex items-center gap-2 text-base font-bold text-foreground mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
            {isRu ? 'Статьи об AI' : 'AI Articles'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article: any) => (
              <AIArticleCard key={article._id} item={article} locale={locale} />
            ))}
          </div>
        </section>
      )}

      {/* AI News */}
      {news.length > 0 && (
        <section>
          <h2 className="flex items-center gap-2 text-base font-bold text-foreground mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
            {isRu ? 'Новости AI' : 'AI News'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {news.map((item: any) => (
              <AINewsCard key={item._id} item={item} locale={locale} />
            ))}
          </div>
        </section>
      )}

      {items.length === 0 && (
        <div className="border border-dashed border-border rounded-xl py-24 flex flex-col items-center justify-center gap-4">
          <Zap size={32} className="text-yellow-400/60" fill="currentColor" />
          <p className="text-muted text-sm text-center max-w-xs">
            {isRu
              ? 'Публикации об AI появятся здесь. Выберите тему "AI & Машинное обучение" при создании статьи или новости в Sanity.'
              : 'AI publications will appear here. Select "AI & Machine Learning" topic when creating an article or news in Sanity.'}
          </p>
        </div>
      )}
    </div>
  );
}

function AIArticleCard({ item, locale }: { item: any; locale: string }) {
  const isRu = locale === 'ru';
  const date = new Date(item.publishedAt).toLocaleDateString(isRu ? 'ru-RU' : 'en-US', {
    day: 'numeric', month: 'short', year: 'numeric',
  });

  return (
    <Link
      href={`/${locale}/articles/${item.slug.current}`}
      className="group block bg-card border border-border/70 rounded-xl overflow-hidden shadow-sm hover:border-blue-500/40 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
    >
      <div className="relative h-40 sm:h-44 overflow-hidden">
        {item.coverImage ? (
          <>
            <Image
              src={item.coverImage}
              alt={item.title}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
          </>
        ) : (
          <div className="w-full h-full bg-card flex items-center justify-center">
            <Zap size={32} className="text-yellow-400/30" fill="currentColor" />
          </div>
        )}
        <div className="absolute top-2 right-2" title="AI">
          <Zap size={14} className="text-yellow-400" fill="currentColor" />
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-sm font-semibold text-foreground leading-snug group-hover:text-blue-400 transition-colors line-clamp-2 mb-2">
          {item.title}
        </h3>
        {item.excerpt && (
          <p className="text-xs text-muted leading-relaxed line-clamp-2 mb-3">{item.excerpt}</p>
        )}
        <div className="flex items-center justify-between text-xs text-muted">
          <div className="flex items-center gap-2">
            <Calendar size={10} />
            <span>{date}</span>
            {item.readingTime && (
              <>
                <span className="text-border">·</span>
                <Clock size={10} />
                <span>{item.readingTime} {isRu ? 'мин' : 'min'}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            {typeof item.views === 'number' && item.views > 0 && (
              <span className="flex items-center gap-1"><Eye size={10} />{item.views}</span>
            )}
            <ArrowRight size={13} className="group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
          </div>
        </div>
      </div>
    </Link>
  );
}

function AINewsCard({ item, locale }: { item: any; locale: string }) {
  const isRu = locale === 'ru';
  const date = new Date(item.publishedAt);
  const dateStr = date.toLocaleDateString(isRu ? 'ru-RU' : 'en-US', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const timeStr = date.toLocaleTimeString(isRu ? 'ru-RU' : 'en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <Link
      href={`/${locale}/news/${item.slug.current}`}
      className="group flex gap-3 bg-card border border-border/70 rounded-xl p-4 shadow-sm hover:border-blue-500/40 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
    >
      {item.coverImage && (
        <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
          <Image src={item.coverImage} alt={item.title} fill className="object-cover" sizes="64px" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-1.5 mb-1.5">
          <Zap size={13} className="text-yellow-400 shrink-0 mt-0.5" fill="currentColor" />
          <h3 className="text-sm font-medium text-foreground leading-snug group-hover:text-blue-400 transition-colors line-clamp-3">
            {item.title}
          </h3>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted">
          <span>{dateStr}</span>
          <span className="text-border">·</span>
          <span>{timeStr}</span>
          {typeof item.views === 'number' && item.views > 0 && (
            <>
              <span className="text-border">·</span>
              <Eye size={10} /><span>{item.views}</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
