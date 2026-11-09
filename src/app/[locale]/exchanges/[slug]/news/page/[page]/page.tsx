import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { exchangeNewsPageCount } from '@/lib/exchangeMentions';
import { fetchExchangeBySlug, fetchExchangeMentions } from '@/lib/sanity';
import ExchangeNewsArchive, { exchangeNewsMetadata } from '@/components/ui/ExchangeNewsArchive';

export const revalidate = 3600;

// Пустой список обязателен: без него маршрут с параметрами не кэшируется и
// рендерится на каждый запрос. Страницы собираются при первом обращении.
export async function generateStaticParams() {
  return [];
}

type Props = { params: Promise<{ locale: string; slug: string; page: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug, page: pageParam } = await params;
  setRequestLocale(locale);
  const page = Number(pageParam);
  if (!Number.isInteger(page) || page < 2) return {};
  const exchange = await fetchExchangeBySlug(slug, locale);
  return exchange ? exchangeNewsMetadata(exchange, locale, page) : {};
}

export default async function ExchangeNewsDeepPage({ params }: Props) {
  const { locale, slug, page: pageParam } = await params;
  setRequestLocale(locale);

  // Первая страница живёт по короткому адресу, здесь только вторая и дальше.
  const page = Number(pageParam);
  if (!Number.isInteger(page) || page < 2) notFound();

  const exchange = await fetchExchangeBySlug(slug, locale);
  if (!exchange) notFound();

  const mentions = await fetchExchangeMentions(exchange.name, exchange.slugRu, exchange.slugEn, exchange.website, locale);
  if (page > exchangeNewsPageCount(mentions.length)) notFound();

  return <ExchangeNewsArchive exchange={exchange} slug={slug} mentions={mentions} locale={locale} page={page} />;
}
