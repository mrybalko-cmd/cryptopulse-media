export const revalidate = 300;

import { getTranslations, setRequestLocale} from 'next-intl/server';
import { buildOg, BASE } from '@/lib/metadata';
import type { Metadata } from 'next';
import NewsCard from '@/components/ui/NewsCard';
import NewsLoadMore from '@/components/ui/NewsLoadMore';
import { fetchOwnNews } from '@/lib/news';
import Link from 'next/link';

const NEWS_TOPICS: Record<string, { ru: string; en: string }> = {
  regulation: { ru: 'Регулирование', en: 'Regulation' },
  defi: { ru: 'DeFi & Web3', en: 'DeFi & Web3' },
  bitcoin: { ru: 'Bitcoin', en: 'Bitcoin' },
  market: { ru: 'Рынок', en: 'Market' },
  technology: { ru: 'Технологии', en: 'Technology' },
  security: { ru: 'Безопасность', en: 'Security' },
  education: { ru: 'Обучение', en: 'Education' },
  'press-release': { ru: 'Пресс-релиз', en: 'Press Release' },
};

const INITIAL = 30;

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

  const result = await fetchOwnNews({ limit: INITIAL, locale });
  const items = result ?? [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">{t('title')}</h1>
        <p className="text-muted text-sm mt-1">{t('subtitle')}</p>
      </div>

      {/* Topic filter pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-accent text-background border border-accent">
          {locale === 'ru' ? 'Все' : 'All'}
        </span>
        {Object.entries(NEWS_TOPICS).map(([key, labels]) => (
          <Link
            key={key}
            href={`/${locale}/news/topic/${key}`}
            className="px-3 py-1.5 rounded-full text-xs font-medium border border-border text-muted hover:border-accent/40 hover:text-foreground transition-colors"
          >
            {locale === 'ru' ? labels.ru : labels.en}
          </Link>
        ))}
      </div>

      {items.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {items.map((item) => (
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
                ownBadge={item.ownBadge}
              />
            ))}
          </div>
          <NewsLoadMore locale={locale} initialCount={items.length} pageSize={12} />
        </>
      ) : (
        <div className="border border-dashed border-border rounded-lg py-20 flex items-center justify-center">
          <span className="text-sm text-muted">
            {locale === 'ru' ? 'Новостей пока нет' : 'No news yet'}
          </span>
        </div>
      )}
    </div>
  );
}
