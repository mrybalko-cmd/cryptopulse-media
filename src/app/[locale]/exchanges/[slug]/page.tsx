import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { buildOg, BASE } from '@/lib/metadata';
import { sanityImageTransform } from '@/lib/sanityImage';
import {
  fetchExchangeBySlug,
  fetchExchanges,
  fetchExchangeMentions,
  fetchExchangeReviews,
  fetchExchangeReviewSummary,
} from '@/lib/sanity';
import { rankExchanges } from '@/lib/exchangeRanking';
import RichText from '@/components/ui/RichText';
import ExchangeToneBadge, { type ExchangeBadgeTone } from '@/components/ui/ExchangeToneBadge';
import ExchangeProducts from '@/components/ui/ExchangeProducts';
import ExchangeRegions from '@/components/ui/ExchangeRegions';
import ExchangeReviewSection from '@/components/ui/ExchangeReviewSection';

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const isRu = locale === 'ru';
  const exchange = await fetchExchangeBySlug(slug, locale);
  if (!exchange) return {};

  const title = (isRu ? exchange.seo?.metaTitleRu : exchange.seo?.metaTitleEn)
    || (isRu ? `${exchange.name} — обзор, продукты и отзывы` : `${exchange.name} — overview, products and reviews`);
  const description = (isRu ? exchange.seo?.metaDescriptionRu : exchange.seo?.metaDescriptionEn)
    || (isRu ? exchange.taglineRu : exchange.taglineEn)
    || (isRu ? `${exchange.name}: обзор биржи, продукты, регулирование и отзывы читателей CryptoPulse.` : `${exchange.name}: exchange overview, products, regulation and reader reviews on CryptoPulse.`);

  return {
    title,
    description,
    robots: exchange.seo?.noIndex ? { index: false, follow: true } : undefined,
    openGraph: buildOg({ url: `${BASE}/${locale}/exchanges/${slug}`, title, description, locale, image: exchange.logo || undefined }),
    alternates: {
      canonical: `${BASE}/${locale}/exchanges/${slug}`,
      languages: { ru: `${BASE}/ru/exchanges/${exchange.slugRu}`, en: `${BASE}/en/exchanges/${exchange.slugEn}` },
    },
  };
}

export default async function ExchangeDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const isRu = locale === 'ru';

  const exchange = await fetchExchangeBySlug(slug, locale);
  if (!exchange) notFound();

  const [all, mentions, reviews, reviewSummary] = await Promise.all([
    fetchExchanges(),
    fetchExchangeMentions(exchange.slugRu, exchange.slugEn, exchange.website, locale),
    fetchExchangeReviews(exchange._id),
    fetchExchangeReviewSummary(exchange._id),
  ]);
  const rank = rankExchanges(all).find(e => e._id === exchange._id)?.rank;

  const name = exchange.name;
  const tagline = isRu ? exchange.taglineRu : exchange.taglineEn;
  const description = isRu ? exchange.descriptionRu : exchange.descriptionEn;
  const products = exchange.products;
  const initials = name.slice(0, 2).toUpperCase();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url: exchange.website,
    ...(exchange.logo ? { logo: exchange.logo } : {}),
    ...(exchange.foundedYear ? { foundingDate: String(exchange.foundedYear) } : {}),
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: isRu ? 'Главная' : 'Home', item: `${BASE}/${locale}` },
      { '@type': 'ListItem', position: 2, name: isRu ? 'Криптобиржи' : 'Crypto Exchanges', item: `${BASE}/${locale}/exchanges` },
      { '@type': 'ListItem', position: 3, name, item: `${BASE}/${locale}/exchanges/${slug}` },
    ],
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <nav className="flex items-center gap-1.5 text-xs text-muted mb-8 flex-wrap">
        <Link href={`/${locale}`} className="hover:text-accent transition-colors">{isRu ? 'Главная' : 'Home'}</Link>
        <span>›</span>
        <Link href={`/${locale}/exchanges`} className="hover:text-accent transition-colors">{isRu ? 'Криптобиржи' : 'Crypto Exchanges'}</Link>
        <span>›</span>
        <span className="text-foreground">{name}</span>
      </nav>

      <div className="flex items-start gap-4 mb-10">
        {exchange.logo ? (
          <div className="relative w-16 h-16 rounded-2xl overflow-hidden shrink-0" style={{ background: exchange.logoBg || '#3b82f6' }}>
            <Image src={sanityImageTransform(exchange.logo, { width: 128 })!} alt={name} fill className="object-contain p-2" unoptimized />
          </div>
        ) : (
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black shrink-0" style={{ background: exchange.logoBg || '#3b82f6' }}>
            {initials}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-black text-foreground leading-tight">{name}</h1>
          <p className="text-muted text-sm mt-1">
            {exchange.foundedYear && <>{isRu ? 'С' : 'Since'} {exchange.foundedYear} · </>}
            <a href={exchange.website} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
              {exchange.website.replace(/^https?:\/\//, '').replace(/\/$/, '')} ↗
            </a>
          </p>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {exchange.type?.map(t => <span key={t} className="text-xs font-semibold px-2 py-1 rounded-full border border-border text-foreground">{t}</span>)}
            {exchange.badges?.map((b, i) => (
              <ExchangeToneBadge key={i} text={isRu ? b.textRu : b.textEn} tone={b.tone as ExchangeBadgeTone} />
            ))}
          </div>
        </div>
        {rank && (
          <div className="text-right shrink-0">
            <p className="text-[10px] uppercase tracking-wide text-muted">{isRu ? 'Место в рейтинге' : 'Rank'}</p>
            <p className="text-2xl font-black bg-[linear-gradient(90deg,#3b82f6,#06b6d4,#ec4899)] bg-clip-text text-transparent">#{rank}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-10">
        <div className="flex flex-col gap-8 min-w-0">
          {description && description.length > 0 && (
            <details open className="group">
              <summary className="cursor-pointer select-none list-none flex items-center justify-between">
                <h2 className="text-lg font-bold text-foreground">{isRu ? 'Обзор' : 'Overview'}</h2>
                <span className="text-muted group-open:rotate-180 transition-transform">▾</span>
              </summary>
              <div className="mt-3">
                <RichText value={description} fallbackAlt={name} locale={locale} />
              </div>
            </details>
          )}

          {products && products.length > 0 && (
            <details open className="group">
              <summary className="cursor-pointer select-none list-none flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold text-foreground">{isRu ? 'Продукты' : 'Products'}</h2>
                <span className="text-muted group-open:rotate-180 transition-transform">▾</span>
              </summary>
              <ExchangeProducts products={products} locale={locale} />
            </details>
          )}

          {exchange.regions && exchange.regions.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-foreground mb-3">{isRu ? 'Регулирование и доступность' : 'Regulation & Availability'}</h2>
              <ExchangeRegions regions={exchange.regions} locale={locale} />
            </section>
          )}

          <ExchangeReviewSection exchangeId={exchange._id} locale={locale} initialReviews={reviews} initialAverage={reviewSummary.average} />
        </div>

        <aside>
          <h2 className="text-sm font-bold text-foreground mb-3">{isRu ? 'Новости на CryptoPulse' : 'CryptoPulse coverage'}</h2>
          {mentions.length > 0 ? (
            <div className="flex flex-col">
              {mentions.map((m, i) => (
                <Link
                  key={i}
                  href={`/${locale}/${m._type === 'news' ? 'news' : 'articles'}/${m.slug}`}
                  className="py-2.5 border-b border-border last:border-0 text-sm text-foreground hover:text-accent transition-colors"
                >
                  {m.title}
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted">{isRu ? 'Пока нет материалов, ссылающихся на эту биржу.' : 'No coverage linking to this exchange yet.'}</p>
          )}
        </aside>
      </div>
    </div>
  );
}
