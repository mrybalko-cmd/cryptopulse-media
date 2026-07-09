import { BASE } from '@/lib/metadata';
import ArticleCard from '@/components/ui/ArticleCard';
import ArticlesLoadMore from '@/components/ui/ArticlesLoadMore';
import Link from 'next/link';
import { Flame } from 'lucide-react';

const TOPICS: Record<string, { ru: string; en: string }> = {
  regulation: { ru: 'Регулирование', en: 'Regulation' },
  defi: { ru: 'DeFi & Web3', en: 'DeFi & Web3' },
  bitcoin: { ru: 'Bitcoin', en: 'Bitcoin' },
  market: { ru: 'Рынок', en: 'Market' },
  technology: { ru: 'Технологии', en: 'Technology' },
  security: { ru: 'Безопасность', en: 'Security' },
  education: { ru: 'Обучение', en: 'Education' },
};

type Props = {
  locale: string;
  title: string;
  subtitle: string;
  articles: any[];
  page: number;
  pageSize: number;
  hasNext: boolean;
  startOffsetForLoadMore: number;
};

export default function ArticlesListingBody({ locale, title, subtitle, articles, page, pageSize, hasNext, startOffsetForLoadMore }: Props) {
  const pageUrl = `${BASE}/${locale}/articles${page > 1 ? `/page/${page}` : ''}`;

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: locale === 'ru' ? 'Главная' : 'Home', item: `${BASE}/${locale}` },
      { '@type': 'ListItem', position: 2, name: title, item: pageUrl },
    ],
  };

  const collectionLd = articles.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: title,
    description: subtitle,
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
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        <p className="text-muted text-sm mt-1">{subtitle}</p>
      </div>

      {/* Topic filter pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-accent text-background border border-accent">
          {locale === 'ru' ? 'Все' : 'All'}
        </span>
        <Link
          href={`/${locale}/articles/popular`}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border border-border text-muted hover:border-accent/40 hover:text-foreground transition-colors"
        >
          <Flame size={12} className="text-red-600" fill="currentColor" />
          {locale === 'ru' ? 'Популярное' : 'Popular'}
        </Link>
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
                likes={article.likes}
                locale={locale}
                priority={page === 1 && i < 2}
              />
            ))}
          </div>
          <ArticlesLoadMore
            locale={locale}
            initialCount={startOffsetForLoadMore}
            pageSize={pageSize}
            nextPage={page + 1}
            hasNext={hasNext}
          />
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
