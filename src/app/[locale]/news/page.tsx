import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import NewsCard from '@/components/ui/NewsCard';
import { fetchMergedNews } from '@/lib/news';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'news' });
  return {
    title: t('title'),
    description: t('subtitle'),
    alternates: { canonical: `https://cryptopulse.media/${locale}/news` },
  };
}

export default async function NewsPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations('news');

  const news = await fetchMergedNews({ limit: 30, locale });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">{t('title')}</h1>
        <p className="text-muted text-sm mt-1">{t('subtitle')}</p>
      </div>

      {news.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {news.map((item) => (
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
    </div>
  );
}
