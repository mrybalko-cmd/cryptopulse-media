export const revalidate = 300;

import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { buildOg, BASE } from '@/lib/metadata';
import { fetchAIContent } from '@/lib/sanity';
import AIPageBody from '@/components/ui/AIPageBody';
import { AI_PAGE_SIZE } from '../../page';

// Page 1 lives at /ai itself; this route only serves page >= 2 — same
// crawlable-pagination pattern as /authors/[slug]/page/[n]. Indexed (not
// noindex,follow like /news and /articles pagination): per the user's
// explicit request, each AI page is a distinct, real slice of AI-topic
// content as the archive grows, not a duplicate-ish generic listing —
// same reasoning already applied to author pagination on this site.
type Props = { params: Promise<{ locale: string; page: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, page: pageParam } = await params;
  const page = Number(pageParam);
  const isRu = locale === 'ru';
  const title = isRu
    ? `AI & Искусственный интеллект в крипто — страница ${page} — CryptoPulse.media`
    : `AI & Artificial Intelligence in Crypto — page ${page} — CryptoPulse.media`;
  const description = isRu
    ? 'Новости и аналитика об искусственном интеллекте в мире криптовалют и блокчейна.'
    : 'News and analysis on artificial intelligence in the crypto and blockchain world.';
  return {
    title,
    description,
    openGraph: buildOg({ url: `${BASE}/${locale}/ai/page/${page}`, title, description, locale }),
    alternates: {
      canonical: `${BASE}/${locale}/ai/page/${page}`,
      languages: {
        ru: `${BASE}/ru/ai/page/${page}`,
        en: `${BASE}/en/ai/page/${page}`,
      },
    },
  };
}

export default async function AIDeepPage({ params }: Props) {
  const { locale, page: pageParam } = await params;
  const page = Number(pageParam);
  if (!Number.isInteger(page) || page < 2) notFound();
  setRequestLocale(locale);

  const offset = (page - 1) * AI_PAGE_SIZE;
  const { items, total } = await fetchAIContent(locale, AI_PAGE_SIZE, offset);
  if (items.length === 0) notFound();

  return <AIPageBody locale={locale} items={items} total={total} page={page} pageSize={AI_PAGE_SIZE} />;
}
