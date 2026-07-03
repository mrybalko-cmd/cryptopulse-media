export const revalidate = 300;

import { getTranslations, setRequestLocale} from 'next-intl/server';
import { buildOg, BASE } from '@/lib/metadata';
import type { Metadata } from 'next';
import ArticleCard from '@/components/ui/ArticleCard';
import ArticlesLoadMore from '@/components/ui/ArticlesLoadMore';
import { fetchArticles } from '@/lib/sanity';

const INITIAL_LIMIT = 12;

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
      languages: { ru: 'https://cryptopulse.media/ru/articles', en: 'https://cryptopulse.media/en/articles', 'x-default': 'https://cryptopulse.media/en/articles' },
    },
  };
}

export default async function ArticlesPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations('articles');

  const articles = await fetchArticles({ limit: INITIAL_LIMIT, locale });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">{t('title')}</h1>
        <p className="text-muted text-sm mt-1">{t('subtitle')}</p>
      </div>

      {articles.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {articles.map((article: any, i: number) => (
              <ArticleCard
                key={article._id}
                title={article.title}
                excerpt={article.excerpt}
                slug={article.slug.current}
                coverImage={article.coverImage}
                publishedAt={article.publishedAt}
                readingTime={article.readingTime}
                badge={article.badge}
                views={article.views}
                locale={locale}
                featured={i === 0}
              />
            ))}
          </div>
          <ArticlesLoadMore locale={locale} initialCount={articles.length} pageSize={12} />
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
