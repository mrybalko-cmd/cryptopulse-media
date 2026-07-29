import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { buildOg, buildTwitter, BASE } from '@/lib/metadata';
import { sanityImageTransform } from '@/lib/sanityImage';
import {
  fetchExchangeBySlug,
  fetchExchanges,
  fetchExchangeMentions,
  fetchExchangeReviews,
  fetchExchangeReviewSummary,
} from '@/lib/sanity';
import { rankExchanges } from '@/lib/exchangeRanking';
import CollapsibleRichText from '@/components/ui/CollapsibleRichText';
import ExchangeToneBadge, { type ExchangeBadgeTone } from '@/components/ui/ExchangeToneBadge';
import ExchangeProducts from '@/components/ui/ExchangeProducts';
import ExchangeRegions from '@/components/ui/ExchangeRegions';
import ExchangeReviewSection from '@/components/ui/ExchangeReviewSection';
import ExchangeNewsSection from '@/components/ui/ExchangeNewsSection';
import PopularSidebar from '@/components/ui/PopularSidebar';

type Props = { params: Promise<{ locale: string; slug: string }> };

const MENTIONS_FETCH_LIMIT = 8;

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
    twitter: buildTwitter({ url: `${BASE}/${locale}/exchanges/${slug}`, title, description, locale, image: exchange.logo || undefined }),
    alternates: {
      canonical: `${BASE}/${locale}/exchanges/${slug}`,
      // noIndex is one shared field on this bilingual document, so both
      // locale pages are noindexed together — never emit hreflang between
      // them in that case (see the pagination routes for the full reasoning).
      ...(!exchange.seo?.noIndex && {
        languages: { ru: `${BASE}/ru/exchanges/${exchange.slugRu}`, en: `${BASE}/en/exchanges/${exchange.slugEn}` },
      }),
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
    fetchExchangeMentions(exchange.slugRu, exchange.slugEn, exchange.website, locale, MENTIONS_FETCH_LIMIT),
    fetchExchangeReviews(exchange._id),
    fetchExchangeReviewSummary(exchange._id),
  ]);
  const rank = rankExchanges(all).find(e => e._id === exchange._id)?.rank;

  const name = exchange.name;
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

  // Each tab must match a section that actually renders below — the
  // "overview"/"products"/"news" sections are all conditional on the
  // exchange having that data, and an unconditional tab pointing at a
  // section that didn't render is a broken in-page jump link (Sitechecker
  // flagged exactly this on exchanges missing one of these fields).
  const navLinks = [
    ...(description && description.length > 0 ? [{ id: 'overview', ru: 'Обзор', en: 'Overview' }] : []),
    ...(exchange.regions && exchange.regions.length > 0 ? [{ id: 'regulation', ru: 'Регулирование', en: 'Regulation' }] : []),
    ...(products && products.length > 0 ? [{ id: 'products', ru: 'Продукты', en: 'Products' }] : []),
    ...(mentions.length > 0 ? [{ id: 'news', ru: 'Новости', en: 'News' }] : []),
    { id: 'reviews', ru: 'Отзывы', en: 'Reviews' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <nav className="flex items-center gap-1.5 text-xs text-muted mb-8 flex-wrap">
        <Link href={`/${locale}`} className="hover:text-accent transition-colors">{isRu ? 'Главная' : 'Home'}</Link>
        <span>›</span>
        <Link href={`/${locale}/exchanges`} className="hover:text-accent transition-colors">{isRu ? 'Криптобиржи' : 'Crypto Exchanges'}</Link>
        <span>›</span>
        <span className="text-foreground">{name}</span>
      </nav>

      <div className="flex items-start gap-4 mb-6">
        {exchange.logo ? (
          <div className="relative w-16 h-16 rounded-2xl overflow-hidden shrink-0 border-2 border-[#ec4899]">
            <Image src={sanityImageTransform(exchange.logo, { width: 128 })!} alt={name} width={64} height={64} className="w-full h-full object-cover" unoptimized />
          </div>
        ) : (
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black shrink-0 border-2 border-[#ec4899]" style={{ background: exchange.logoBg || '#3b82f6' }}>
            {initials}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-black text-foreground leading-tight">{name}</h1>
          <p className="text-muted text-sm mt-1">
            {exchange.foundedYear && <>{isRu ? 'С' : 'Since'} {exchange.foundedYear} · </>}
            <a href={exchange.trackingUrl || exchange.website} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
              {exchange.linkLabel || exchange.website.replace(/^https?:\/\//, '').replace(/\/$/, '')} ↗
            </a>
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-3">
            {exchange.type?.map(t => <span key={t} className="text-xs font-semibold px-2 py-1 rounded-full border border-border text-foreground">{t}</span>)}
            {exchange.badges?.map((b, i) => (
              <ExchangeToneBadge key={i} text={isRu ? b.textRu : b.textEn} tone={b.tone as ExchangeBadgeTone} />
            ))}
            {rank && (
              <span className="inline-flex items-baseline gap-1 px-3 py-1 rounded-full border border-border">
                <span className="text-[9.5px] uppercase tracking-wide text-muted">{isRu ? 'Место' : 'Rank'}</span>
                <span className="text-sm font-black bg-[linear-gradient(90deg,#3b82f6,#06b6d4,#ec4899)] bg-clip-text text-transparent">#{rank}</span>
              </span>
            )}
            {exchange.tradeUrl ? (
              <a
                href={exchange.tradeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 text-sm font-extrabold px-5 py-2.5 rounded-lg bg-positive text-white hover:opacity-90 transition-opacity whitespace-nowrap"
              >
                {isRu ? 'Торговать' : 'Trade'} ↗
              </a>
            ) : (
              <span
                aria-disabled="true"
                className="shrink-0 text-sm font-extrabold px-5 py-2.5 rounded-lg bg-[var(--card-hover)] border border-border text-muted opacity-45 blur-[0.3px] cursor-not-allowed whitespace-nowrap"
              >
                {isRu ? 'Торговать' : 'Trade'}
              </span>
            )}
          </div>
        </div>
      </div>

      <nav className="flex gap-1 border-b border-border mb-8 sticky top-14 md:top-[6.25rem] bg-background z-10 -mx-4 px-4 sm:-mx-6 sm:px-6">
        {navLinks.map(l => (
          <a key={l.id} href={`#${l.id}`} className="px-3.5 py-3 text-sm font-semibold text-muted hover:text-foreground border-b-2 border-transparent hover:border-border transition-colors">
            {isRu ? l.ru : l.en}
          </a>
        ))}
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_256px] gap-8 lg:gap-10">
        <div className="flex flex-col gap-10 min-w-0">
          {description && description.length > 0 && (
            <section id="overview" className="scroll-mt-28">
              <h2 className="text-lg font-bold text-foreground mb-3">{isRu ? 'Обзор' : 'Overview'}</h2>
              <CollapsibleRichText value={description} fallbackAlt={name} locale={locale} />
            </section>
          )}

          {exchange.regions && exchange.regions.length > 0 && (
            <section id="regulation" className="scroll-mt-28">
              <h2 className="text-lg font-bold text-foreground mb-3">{isRu ? 'Регулирование и доступность' : 'Regulation & Availability'}</h2>
              <ExchangeRegions regions={exchange.regions} locale={locale} />
            </section>
          )}

          {products && products.length > 0 && (
            <section id="products" className="scroll-mt-28">
              <h2 className="text-lg font-bold text-foreground mb-3">{isRu ? 'Продукты' : 'Products'}</h2>
              <ExchangeProducts products={products} locale={locale} />
            </section>
          )}

          <ExchangeNewsSection exchangeName={name} slug={slug} mentions={mentions} locale={locale} />

          <section id="reviews" className="scroll-mt-28">
            <h2 className="text-lg font-bold text-foreground mb-3">{isRu ? 'Отзывы' : 'Reviews'}</h2>
            <ExchangeReviewSection exchangeId={exchange._id} locale={locale} initialReviews={reviews} initialAverage={reviewSummary.average} />
          </section>
        </div>

        <PopularSidebar locale={locale} limit={7} />
      </div>
    </div>
  );
}
