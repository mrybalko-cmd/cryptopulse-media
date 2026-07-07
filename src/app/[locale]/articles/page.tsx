export const revalidate = 300;

import { getTranslations, setRequestLocale} from 'next-intl/server';
import { buildOg, BASE } from '@/lib/metadata';
import type { Metadata } from 'next';
import ArticleCard from '@/components/ui/ArticleCard';
import ArticlesLoadMore from '@/components/ui/ArticlesLoadMore';
import { fetchArticles } from '@/lib/sanity';
import Link from 'next/link';

const TOPICS: Record<string, { ru: string; en: string }> = {
  regulation: { ru: 'Регулирование', en: 'Regulation' },
  defi: { ru: 'DeFi & Web3', en: 'DeFi & Web3' },
  bitcoin: { ru: 'Bitcoin', en: 'Bitcoin' },
  market: { ru: 'Рынок', en: 'Market' },
  technology: { ru: 'Технологии', en: 'Technology' },
  security: { ru: 'Безопасность', en: 'Security' },
  education: { ru: 'Обучение', en: 'Education' },
};

const INITIAL_LIMIT = 15;

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
    alternates: {
      canonical: `https://cryptopulse.media/${locale}/articles`,
      languages: { ru: 'https://cryptopulse.media/ru/articles', en: 'https://cryptopulse.media/en/articles' },
    },
  };
}

export default async function ArticlesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('articles');

  const articles = await fetchArticles({ limit: INITIAL_LIMIT, locale });

  const pageUrl = `${BASE}/${locale}/articles`;

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: locale === 'ru' ? 'Главная' : 'Home', item: `${BASE}/${locale}` },
      { '@type': 'ListItem', position: 2, name: t('title'), item: pageUrl },
    ],
  };

  const collectionLd = articles.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: t('title'),
    description: t('subtitle'),
    url: pageUrl,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: articles.map((article: any, i: number) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${BASE}/${locale}/articles/${article.slug.current}`,
        name: article.title,
      })),
    },
  } : null;

  return (
    <div className="max-w-[100rem] mx-auto px-4 sm:px-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      {collectionLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }} />
      )}

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">{t('title')}</h1>
        <p className="text-muted text-sm mt-1">{t('subtitle')}</p>
      </div>

      {/* Topic filter pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-accent text-background border border-accent">
          {locale === 'ru' ? 'Все' : 'All'}
        </span>
        {Object.entries(TOPICS).map(([key, labels]) => (
          <Link
            key={key}
            href={`/${locale}/articles/topic/${key}`}
            className="px-3 py-1.5 rounded-full text-xs font-medium border border-border text-muted hover:border-accent/40 hover:text-foreground transition-colors"
          >
            {locale === 'ru' ? labels.ru : labels.en}
          </Link>
        ))}
      </div>

      {articles.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
          <ArticlesLoadMore locale={locale} initialCount={articles.length} pageSize={INITIAL_LIMIT} />
        </>
      ) : (
        <div className="border border-dashed border-border rounded-lg py-20 flex flex-col items-center justify-center gap-3">
          <p className="text-muted text-sm">
            {locale === 'ru' ? 'Статьи появятся после настройки Sanity CMS' : 'Articles will appear after setting up Sanity CMS'}
          </p>
          <a href="https://sanity.io" target="_blank" rel="noopener noreferrer"
            className="text-xs text-accent hover:underline">
            sanity.io
          </a>
        </div>
      )}
    </div>
  );
}
