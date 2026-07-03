export const revalidate = 300;

import { getTranslations, setRequestLocale} from 'next-intl/server';
import { buildOg, BASE } from '@/lib/metadata';
import type { Metadata } from 'next';
import NewsCard from '@/components/ui/NewsCard';
import NewsLoadMore from '@/components/ui/NewsLoadMore';
import { fetchMergedNews, fetchOwnNews } from '@/lib/news';

const INITIAL_OWN = 30;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'news' });
  const title = t('title');
  const description = t('subtitle');
  return {
    title,
    description,
    openGraph: buildOg({ url: `${BASE}/${locale}/news`, title, description, locale }),
    alternates: {
      canonical: `https://cryptopulse.media/${locale}/news`,
      languages: { ru: 'https://cryptopulse.media/ru/news', en: 'https://cryptopulse.media/en/news', 'x-default': 'https://cryptopulse.media/en/news' },
    },
  };
}

export default async function NewsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('news');

  const [ownResult, mergedResult] = await Promise.allSettled([
    fetchOwnNews({ limit: INITIAL_OWN, locale }),
    fetchMergedNews({ limit: 30, locale }),
  ]);

  const ownItems = ownResult.status === 'fulfilled' ? ownResult.value : [];
  const otherItems = (mergedResult.status === 'fulfilled' ? mergedResult.value : []).filter((item) => item.external);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">{t('title')}</h1>
        <p className="text-muted text-sm mt-1">{t('subtitle')}</p>
      </div>

      {ownItems.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
            <h2 className="text-sm font-bold text-foreground">
              {locale === 'ru' ? 'Материалы редакции' : 'Editorial picks'}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {ownItems.map((item) => (
              <NewsCard
                key={item.id}
                title={item.title}
                source={item.source}
                href={item.href}
                external={item.external}
                publishedAt={item.publishedAt}
                categories={item.categories}
                imageUrl={item.imageUrl}
                locale={locale}
                pinned={item.pinned}
                breaking={item.breaking}
              />
            ))}
          </div>
          <NewsLoadMore locale={locale} initialCount={ownItems.length} pageSize={12} />
        </section>
      )}

      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-muted shrink-0" />
          <h2 className="text-sm font-bold text-foreground">
            {locale === 'ru' ? 'Все новости' : 'All news'}
          </h2>
        </div>
        {otherItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {otherItems.map((item) => (
              <NewsCard
                key={item.id}
                title={item.title}
                source={item.source}
                href={item.href}
                external={item.external}
                publishedAt={item.publishedAt}
                categories={item.categories}
                imageUrl={item.imageUrl}
                locale={locale}
              />
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-border rounded-lg py-20 flex items-center justify-center">
            <span className="text-sm text-muted">
              {locale === 'ru' ? 'Загружаем новости...' : 'Loading news...'}
            </span>
          </div>
        )}
      </section>
    </div>
  );
}
