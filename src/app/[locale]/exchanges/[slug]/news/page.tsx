import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { fetchExchangeBySlug, fetchExchangeMentions, fetchExchangeSlugsForSitemap } from '@/lib/sanity';
import ExchangeNewsArchive, { exchangeNewsMetadata } from '@/components/ui/ExchangeNewsArchive';

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await fetchExchangeSlugsForSitemap();
  return slugs.flatMap(s =>
    [
      s.slugEn ? { locale: 'en', slug: s.slugEn } : null,
      s.slugRu ? { locale: 'ru', slug: s.slugRu } : null,
    ].filter((x): x is { locale: string; slug: string } => x !== null)
  );
}

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const exchange = await fetchExchangeBySlug(slug, locale);
  return exchange ? exchangeNewsMetadata(exchange, locale, 1) : {};
}

export default async function ExchangeNewsArchivePage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const exchange = await fetchExchangeBySlug(slug, locale);
  if (!exchange) notFound();

  const mentions = await fetchExchangeMentions(exchange.name, exchange.slugRu, exchange.slugEn, exchange.website, locale);
  return <ExchangeNewsArchive exchange={exchange} slug={slug} mentions={mentions} locale={locale} page={1} />;
}
