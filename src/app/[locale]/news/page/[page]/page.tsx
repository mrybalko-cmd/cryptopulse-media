export const revalidate = 300;

import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { buildOg, BASE } from '@/lib/metadata';
import type { Metadata } from 'next';
import { fetchOwnNews } from '@/lib/news';
import NewsListingBody from '../../NewsListingBody';
import { INITIAL, PAGE_SIZE } from '../../page';

// page 1 lives at /news itself; this route only serves page >= 2 — a crawler
// following "Load more"'s real href lands here instead of relying on JS.
// Kept as its own dynamic segment (not a ?page= query param) so the
// high-traffic /news page above stays statically generated/ISR-cached.
function offsetForPage(page: number): { offset: number; limit: number } {
  return { offset: INITIAL + (page - 2) * PAGE_SIZE, limit: PAGE_SIZE };
}

type Props = {
  params: Promise<{ locale: string; page: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, page: pageParam } = await params;
  const page = Number(pageParam);
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'news' });
  const title = t('title');
  const description = t('subtitle');
  return {
    title,
    description,
    openGraph: buildOg({ url: `${BASE}/${locale}/news/page/${page}`, title, description, locale }),
    alternates: {
      canonical: `${BASE}/${locale}/news/page/${page}`,
      languages: {
        ru: `${BASE}/ru/news/page/${page}`,
        en: `${BASE}/en/news/page/${page}`,
      },
    },
    robots: { index: false, follow: true },
  };
}

export default async function NewsDeepPage({ params }: Props) {
  const { locale, page: pageParam } = await params;
  const page = Number(pageParam);
  if (!Number.isInteger(page) || page < 2) notFound();
  setRequestLocale(locale);
  const t = await getTranslations('news');

  const { offset, limit } = offsetForPage(page);
  const items = (await fetchOwnNews({ limit, locale, offset })) ?? [];
  if (items.length === 0) notFound();

  const hasNext = items.length === limit;

  return (
    <NewsListingBody
      locale={locale}
      title={t('title')}
      subtitle={t('subtitle')}
      items={items}
      page={page}
      pageSize={PAGE_SIZE}
      hasNext={hasNext}
      startOffsetForLoadMore={offset + items.length}
    />
  );
}
