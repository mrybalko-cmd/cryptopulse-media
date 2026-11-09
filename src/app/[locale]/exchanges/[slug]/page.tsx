import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { buildOg, buildTwitter, BASE, titleText } from '@/lib/metadata';
import {
  fetchExchangeBySlug,
  fetchExchangeSlugsForSitemap,
  fetchExchanges,
  fetchExchangeMentions,
  fetchExchangeReviews,
  fetchExchangeReviewSummary,
} from '@/lib/sanity';
import { rankExchanges } from '@/lib/exchangeRanking';
import { activeTradeUrl, hasExtendedProfile, venueButtonColor } from '@/lib/exchangePlacements';
import { formatTimestamp } from '@/lib/formatTimestamp';
import {
  ExchangeLogo,
  RestrictionChip,
  RowAction,
  VenueButton,
  formatVolume,
  passportLicence,
  restrictionLabel,
  slugFor,
} from '@/components/ui/exchangePresentation';
import VenueMobileBar from '@/components/ui/VenueMobileBar';
import VenuePassport, { type PassportCell } from '@/components/ui/VenuePassport';
import VenueSection from '@/components/ui/VenueSection';
import CollapsibleRichText from '@/components/ui/CollapsibleRichText';
import ExchangeToneBadge, { type ExchangeBadgeTone } from '@/components/ui/ExchangeToneBadge';
import ExchangeProducts from '@/components/ui/ExchangeProducts';
import ExchangeRegions from '@/components/ui/ExchangeRegions';
import ExchangeReviewSection from '@/components/ui/ExchangeReviewSection';
import ExchangeNewsSection from '@/components/ui/ExchangeNewsSection';
import PopularSidebar from '@/components/ui/PopularSidebar';
import { SITE_BRAND } from '@/lib/site';

// Every exchange page was rendering on demand on every request — no static
// params, no revalidate — which made it the slowest page on the site (1.1s
// TTFB) and the one a crawler is most likely to give up on. There are only a
// few dozen of them, so all of them prerender.
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
  const isRu = locale === 'ru';
  const exchange = await fetchExchangeBySlug(slug, locale);
  if (!exchange) return {};

  // Clamped rather than trimmed by hand: the exchange name is data, and
  // "Crypto.com Exchange" alone eats half the budget the brand suffix leaves.
  const title = titleText(
    (isRu ? exchange.seo?.metaTitleRu : exchange.seo?.metaTitleEn)
      || (isRu ? `${exchange.name} — обзор и отзывы` : `${exchange.name} — overview and reviews`)
  );
  const description = (isRu ? exchange.seo?.metaDescriptionRu : exchange.seo?.metaDescriptionEn)
    || (isRu ? exchange.taglineRu : exchange.taglineEn)
    || (isRu ? `${exchange.name}: обзор биржи, продукты, регулирование и отзывы читателей ${SITE_BRAND}.` : `${exchange.name}: exchange overview, products, regulation and reader reviews on ${SITE_BRAND}.`);

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
        languages: { ru: `${BASE}/ru/exchanges/${exchange.slugRu}`, en: `${BASE}/en/exchanges/${exchange.slugEn}`, 'x-default': `${BASE}/en/exchanges/${exchange.slugEn}` },
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
    fetchExchangeMentions(exchange.name, exchange.slugRu, exchange.slugEn, exchange.website, locale),
    fetchExchangeReviews(exchange._id),
    fetchExchangeReviewSummary(exchange._id),
  ]);
  const ranked = rankExchanges(all);
  const rank = ranked.find(e => e._id === exchange._id)?.rank;

  const name = exchange.name;
  const description = isRu ? exchange.descriptionRu : exchange.descriptionEn;
  const products = exchange.products;
  const tradeHref = activeTradeUrl(exchange);
  const color = venueButtonColor(exchange.buttonColor);
  const licence = passportLicence(exchange, isRu);
  const restriction = licence ? null : restrictionLabel(exchange, isRu);
  const volume = exchange.volume24h ? formatVolume(exchange.volume24h) : null;
  const rankText = rank ? `#${rank} ${isRu ? 'из' : 'of'} ${ranked.length}` : null;
  const text = (ru?: string | null, en?: string | null) => (isRu ? ru : en) || null;
  const productNames = (products ?? []).map(p => (isRu ? p.nameRu : p.nameEn));

  // Ближайшие по обороту: номер в рейтинге здесь единственный честный признак похожести.
  const similar = rank
    ? [...ranked.filter(e => e._id !== exchange._id)].sort((a, b) => Math.abs(a.rank - rank) - Math.abs(b.rank - rank) || a.rank - b.rank).slice(0, 3)
    : [];

  const passport: PassportCell[] = [
    { label: isRu ? 'Оборот 24ч' : '24h volume', value: volume, desktopOnly: true },
    { label: isRu ? 'Место' : 'Rank', value: rankText, desktopOnly: true },
    { label: isRu ? 'Лицензия' : 'Licence', value: licence?.text ?? restriction, href: licence?.href },
    {
      label: isRu ? 'Проверено' : 'Checked',
      value: exchange.verifiedAt ? (formatTimestamp(exchange.verifiedAt)?.date ?? null) : null,
      note: isRu ? 'редакция' : 'by editors',
    },
    {
      label: isRu ? 'Продукты' : 'Products',
      value: productNames.length ? String(productNames.length) : null,
      note: productNames.slice(0, 3).join(', ') || null,
      desktopOnly: true,
    },
    { label: isRu ? 'Монет и пар' : 'Coins and pairs', value: text(exchange.coinsPairsRu, exchange.coinsPairsEn) },
    { label: isRu ? 'Фиат' : 'Fiat', value: text(exchange.fiatRu, exchange.fiatEn) },
    { label: isRu ? 'Пополнение' : 'Funding', value: text(exchange.fundingRu, exchange.fundingEn) },
    // Нижний ряд утверждён только для расширенного профиля.
    ...(hasExtendedProfile(exchange)
      ? [
          { label: 'Proof of reserves', value: exchange.reservesUrl ? (isRu ? 'Да' : 'Yes') : null, href: exchange.reservesUrl },
          { label: isRu ? 'Комиссия спот' : 'Spot fee', value: text(exchange.spotFeeRu, exchange.spotFeeEn) },
          { label: 'KYC', value: text(exchange.kycRu, exchange.kycEn) },
          { label: isRu ? 'Доступна' : 'Available in', value: text(exchange.availableRu, exchange.availableEn) },
        ]
      : []),
  ];

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
    { id: 'passport', label: isRu ? 'Паспорт' : 'Passport' },
    ...(description && description.length > 0 ? [{ id: 'overview', label: isRu ? 'Обзор' : 'Overview' }] : []),
    ...(exchange.regions && exchange.regions.length > 0 ? [{ id: 'regulation', label: isRu ? 'Регулирование' : 'Regulation' }] : []),
    ...(products && products.length > 0 ? [{ id: 'products', label: isRu ? 'Продукты' : 'Products' }] : []),
    ...(mentions.length > 0 ? [{ id: 'news', label: `${isRu ? 'Новости' : 'News'} · ${mentions.length}` }] : []),
    { id: 'reviews', label: `${isRu ? 'Отзывы' : 'Reviews'}${reviews.length ? ` · ${reviews.length}` : ''}` },
  ];

  return (
    <div className={`max-w-[1320px] mx-auto px-4 sm:px-6 pt-10 ${tradeHref ? 'pb-24 md:pb-10' : 'pb-10'}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_256px] gap-6 lg:gap-8">
        <div className="min-w-0">
          <nav className="flex items-center gap-1.5 text-xs text-muted mb-5 flex-wrap">
            <Link href={`/${locale}`} className="hover:text-accent transition-colors">{isRu ? 'Главная' : 'Home'}</Link>
            <span>›</span>
            <span>{isRu ? 'Где торговать' : 'Where to trade'}</span>
            <span>›</span>
            <Link href={`/${locale}/exchanges`} className="hover:text-accent transition-colors">{isRu ? 'Криптобиржи' : 'Crypto Exchanges'}</Link>
            <span>›</span>
            <span className="text-foreground">{name}</span>
          </nav>

          <header className="rounded-[20px] border border-[var(--glass-line)] bg-[image:var(--glass-fill)] shadow-[inset_0_1px_0_var(--glass-hi),var(--glass-shadow)] p-4 sm:p-5">
            <div className="flex items-start gap-3.5 sm:gap-4">
              <ExchangeLogo exchange={exchange} size={64} sizeMobile={52} className="!rounded-[16px]" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl sm:text-[28px] font-extrabold text-foreground leading-tight -tracking-[0.03em]">{name}</h1>
                  {exchange.type?.map(t => <span key={t} className="text-xs font-semibold px-2 py-0.5 rounded-full border border-border text-foreground">{t}</span>)}
                  {exchange.badges?.map((b, i) => (
                    <ExchangeToneBadge key={i} text={isRu ? b.textRu : b.textEn} tone={b.tone as ExchangeBadgeTone} />
                  ))}
                  {!exchange.badges?.length && restriction && <RestrictionChip label={restriction} />}
                </div>
                <p className="text-[13px] text-muted mt-1">
                  {rank && (isRu ? `#${rank} из ${ranked.length} по обороту за 24 часа` : `#${rank} of ${ranked.length} by 24h volume`)}
                  {exchange.foundedYear ? `${rank ? ' · ' : ''}${isRu ? `с ${exchange.foundedYear} года` : `since ${exchange.foundedYear}`}` : ''}
                </p>
              </div>
            </div>

            {/* На телефоне паспорт свёрнут до строк, а главные цифры стоят здесь. */}
            <dl className="md:hidden grid grid-cols-3 gap-2 mt-3.5">
              {[
                [isRu ? 'Оборот' : 'Volume', volume ?? '—'],
                [isRu ? 'Место' : 'Rank', rank ? `#${rank}` : '—'],
                [isRu ? 'Продукты' : 'Products', productNames.length || '—'],
              ].map(([label, value]) => (
                <div key={String(label)} className="rounded-xl border border-[var(--glass-line)] bg-[var(--rates-inset)] px-2.5 py-2">
                  <dt className="text-[10px] font-extrabold uppercase tracking-[0.06em] text-muted">{label}</dt>
                  <dd className="text-[15px] font-extrabold text-foreground tabular-nums mt-0.5">{value}</dd>
                </div>
              ))}
            </dl>

            <div className="flex flex-wrap gap-2.5 mt-4">
              {tradeHref && (
                <VenueButton href={tradeHref} color={color}>{isRu ? 'Торговать' : 'Trade'}</VenueButton>
              )}
              <a
                href={exchange.trackingUrl || exchange.website}
                target="_blank"
                rel={exchange.trackingUrl ? 'noopener noreferrer sponsored' : 'noopener noreferrer'}
                className="inline-flex items-center justify-center h-10 px-4 rounded-xl border border-[var(--glass-line)] bg-[var(--rates-inset)] text-[13.5px] font-extrabold text-foreground hover:bg-[var(--glass-hover)] transition-colors whitespace-nowrap"
              >
                {exchange.linkLabel || exchange.website.replace(/^https?:\/\//, '').replace(/\/$/, '')} ↗
              </a>
            </div>
          </header>

          <nav
            aria-label={isRu ? 'Разделы страницы' : 'Page sections'}
            className="hidden md:flex gap-1 border-b border-border mt-5 mb-6 sticky top-[6.25rem] bg-background z-10 overflow-x-auto scrollbar-none"
          >
            {navLinks.map(l => (
              <a key={l.id} href={`#${l.id}`} className="whitespace-nowrap shrink-0 px-3 py-3 text-sm font-semibold text-muted hover:text-foreground border-b-2 border-transparent hover:border-border transition-colors">
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex flex-col gap-2 md:gap-9 mt-4 md:mt-0">
            <VenueSection id="passport" title={isRu ? 'Паспорт биржи' : 'Exchange passport'} gold defaultOpen>
              <VenuePassport cells={passport} isRu={isRu} />
            </VenueSection>

            {description && description.length > 0 && (
              <VenueSection id="overview" title={isRu ? 'Обзор' : 'Overview'}>
                <CollapsibleRichText value={description} fallbackAlt={name} locale={locale} />
              </VenueSection>
            )}

            {exchange.regions && exchange.regions.length > 0 && (
              <VenueSection id="regulation" title={isRu ? 'Регулирование и доступность' : 'Regulation & Availability'}>
                <ExchangeRegions regions={exchange.regions} locale={locale} />
                <p className="text-xs text-muted mt-3">
                  {isRu ? 'Подробно о правилах по странам: ' : 'Rules by country: '}
                  <Link href={`/${locale}/regulation`} className="font-semibold text-[var(--violet-2)] hover:underline">
                    {isRu ? 'регулирование криптовалют' : 'crypto regulation'}
                  </Link>
                </p>
              </VenueSection>
            )}

            {products && products.length > 0 && (
              <VenueSection id="products" title={isRu ? 'Продукты' : 'Products'} meta={products.length}>
                <ExchangeProducts products={products} locale={locale} />
              </VenueSection>
            )}

            {mentions.length > 0 && (
              <VenueSection id="news" title={isRu ? `Материалы о ${name}` : `${name} coverage`} meta={mentions.length}>
                <ExchangeNewsSection exchangeName={name} slug={slug} mentions={mentions} locale={locale} />
              </VenueSection>
            )}

            <VenueSection
              id="reviews"
              title={isRu ? 'Отзывы читателей' : 'Reader reviews'}
              meta={reviews.length ? `${reviewSummary.average.toFixed(1)} · ${reviews.length}` : null}
            >
              <ExchangeReviewSection exchangeId={exchange._id} locale={locale} initialReviews={reviews} initialAverage={reviewSummary.average} />
            </VenueSection>

            {similar.length > 0 && (
              <section className="mt-3 md:mt-0">
                <h2 className="text-[15px] md:text-lg font-bold text-foreground mb-3">{isRu ? 'Похожие биржи' : 'Similar exchanges'}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                  {similar.map(other => (
                    <div key={other._id} className="relative flex items-center gap-3 rounded-[14px] border border-[var(--glass-line)] bg-[image:var(--glass-fill)] px-3 py-2.5 hover:bg-[var(--glass-hover)] transition-colors">
                      <Link href={`/${locale}/exchanges/${slugFor(other, locale)}`} aria-label={other.name} className="absolute inset-0 z-10" />
                      <ExchangeLogo exchange={other} size={34} />
                      <span className="min-w-0 flex-1">
                        <b className="block text-[13px] font-extrabold text-foreground truncate">{other.name}</b>
                        <span className="block text-[11px] text-muted truncate tabular-nums">#{other.rank} · {formatVolume(other.volume24h)}</span>
                      </span>
                      <RowAction exchange={other} isRu={isRu} />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>

        <PopularSidebar locale={locale} limit={7} />
      </div>

      {tradeHref && (
        <VenueMobileBar
          name={name}
          note={[rank ? (isRu ? `#${rank} по обороту` : `#${rank} by volume`) : null, licence?.text].filter(Boolean).join(' · ')}
          href={tradeHref}
          color={color}
          label={isRu ? 'Торговать' : 'Trade'}
        />
      )}
    </div>
  );
}
