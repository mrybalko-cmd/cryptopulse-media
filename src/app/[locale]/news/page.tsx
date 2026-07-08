export const revalidate = 300;

import { getTranslations, setRequestLocale } from 'next-intl/server';
import { buildOg, BASE } from '@/lib/metadata';
import type { Metadata } from 'next';
import { fetchOwnNews } from '@/lib/news';
import NewsListingBody from './NewsListingBody';

export const INITIAL = 30;
export const PAGE_SIZE = 20;

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
      canonical: `${BASE}/${locale}/news`,
      languages: {
        ru: `${BASE}/ru/news`,
        en: `${BASE}/en/news`,
      },
    },
  };
}

export default async function NewsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('news');

  const items = (await fetchOwnNews({ limit: INITIAL, locale })) ?? [];
  const hasNext = items.length === INITIAL;

  return (
    <NewsListingBody
      locale={locale}
      title={t('title')}
      subtitle={t('subtitle')}
      items={items}
      page={1}
      pageSize={PAGE_SIZE}
      hasNext={hasNext}
      startOffsetForLoadMore={items.length}
    />
  );
}
