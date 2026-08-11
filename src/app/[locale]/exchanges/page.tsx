import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { buildOg, buildTwitter, BASE } from '@/lib/metadata';
import { fetchExchanges, fetchPopularContent, fetchActiveBanners, type ExchangeRaw } from '@/lib/sanity';
import { formatTimestamp, toIso } from '@/lib/formatTimestamp';
import { splitPinned } from '@/lib/exchangeRanking';
import { exchangeHasProductCategory, exchangeHasLicense, PRODUCT_CATEGORIES } from '@/lib/exchangeFilters';
import ExchangeTable from '@/components/ui/ExchangeTable';
import ExchangeFeatured from '@/components/ui/ExchangeFeatured';
import { formatVolume, slugFor } from '@/components/ui/exchangePresentation';
import ExchangeToolbar, { type ExchangeSearchParams } from '@/components/ui/ExchangeToolbar';
import PopularSidebar from '@/components/ui/PopularSidebar';
import PopularList from '@/components/ui/PopularList';
import SidebarBanner from '@/components/ui/SidebarBanner';

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<ExchangeSearchParams> };

const TYPES = ['CEX', 'DEX', 'P2P'];
const PRODUCT_VALUES = PRODUCT_CATEGORIES.map(p => p.value);

function toArray(v?: string | string[]): string[] {
  return Array.isArray(v) ? v : v ? [v] : [];
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { locale } = await params;
  const sp = await searchParams;
  setRequestLocale(locale);
  const isRu = locale === 'ru';
  const title = isRu ? 'Криптобиржи — рейтинг по объёму торгов' : 'Crypto Exchanges — Ranked by Trading Volume';
  const description = isRu
    ? 'Рейтинг крупнейших криптобирж по объёму торгов за 24 часа: продукты, лицензии, доступность по регионам и новости CryptoPulse по каждой бирже.'
    : 'Ranking of the largest crypto exchanges by 24h trading volume: products, licensing, regional availability and CryptoPulse coverage for each exchange.';

  // Any filter/sort query param produces a distinct crawlable URL (e.g.
  // ?type=DEX&sort=year), but canonical always points back at the bare
  // /exchanges — these aren't meant to be indexed as their own entity.
  // hreflang on a non-canonical variant always points at the OTHER
  // locale's bare URL too, which can't reciprocate back to this exact
  // query string — "missing reciprocal hreflang" and, since many filter
  // combinations render identical content, "technically duplicate URLs".
  // Omit hreflang entirely on filtered variants; only the bare URL keeps it.
  const hasFilters = Object.keys(sp).length > 0;

  return {
    title,
    description,
    openGraph: buildOg({ url: `${BASE}/${locale}/exchanges`, title, description, locale }),
    twitter: buildTwitter({ url: `${BASE}/${locale}/exchanges`, title, description, locale }),
    alternates: {
      canonical: `${BASE}/${locale}/exchanges`,
      ...(!hasFilters && { languages: { ru: `${BASE}/ru/exchanges`, en: `${BASE}/en/exchanges`, 'x-default': `${BASE}/en/exchanges` } }),
    },
  };
}

export default async function ExchangesPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const sp = await searchParams;
  setRequestLocale(locale);
  const isRu = locale === 'ru';

  const activeType = sp.type && TYPES.includes(sp.type) ? sp.type : undefined;
  const selectedProducts = toArray(sp.product).filter(p => PRODUCT_VALUES.includes(p as (typeof PRODUCT_VALUES)[number]));
  const hasLicense = sp.license === '1';
  const minYear = sp.minYear ? Number(sp.minYear) : undefined;
  const maxYear = sp.maxYear ? Number(sp.maxYear) : undefined;
  const minVolumeM = sp.minVolume ? Number(sp.minVolume) : undefined;
  const sortBy = sp.sort === 'year' || sp.sort === 'alpha' ? sp.sort : 'volume';

  const [all, mobilePopular, mobileBanners] = await Promise.all([
    fetchExchanges(),
    fetchPopularContent(locale, 3),
    fetchActiveBanners(locale),
  ]);

  const filtered = all.filter(e => {
    if (activeType && !e.type?.includes(activeType)) return false;
    if (selectedProducts.length > 0 && !selectedProducts.some(p => exchangeHasProductCategory(e, p))) return false;
    if (hasLicense && !exchangeHasLicense(e)) return false;
    if (minYear != null && (e.foundedYear ?? 0) < minYear) return false;
    if (maxYear != null && (e.foundedYear ?? 9999) > maxYear) return false;
    if (minVolumeM != null && (e.volume24h ?? 0) < minVolumeM * 1e6) return false;
    return true;
  });

  // Paid placements are lifted above the ranking, not sorted into it, so the
  // numbered list below is always honestly ordered by whatever it says.
  const { featured, rest: organic } = splitPinned(filtered);

  const sorted =
    sortBy === 'year'
      ? [...organic].sort((a, b) => (a.foundedYear ?? 9999) - (b.foundedYear ?? 9999))
      : sortBy === 'alpha'
        ? [...organic].sort((a, b) => a.name.localeCompare(b.name))
        : [...organic].sort((a, b) => (b.volume24h ?? 0) - (a.volume24h ?? 0));
  const ranked: (ExchangeRaw & { rank: number })[] = sorted.map((e, i) => ({ ...e, rank: i + 1 }));

  const shown = [...featured, ...ranked];
  const totalVolume = shown.reduce((sum, e) => sum + (e.volume24h ?? 0), 0);
  const licensedCount = shown.filter(exchangeHasLicense).length;
  const maxVolume = Math.max(0, ...shown.map(e => e.volume24h ?? 0));

  // The newest exchange document is when this ranking last actually changed:
  // /api/cron/exchange-volumes rewrites the 24h figures daily. Claiming a
  // freshness the data doesn't have is what the page did before, saying
  // "updated once a day" while emitting no date at all for anything to read.
  const lastDataChange = shown.reduce<string | null>(
    (latest, e) => (e._updatedAt && (!latest || e._updatedAt > latest) ? e._updatedAt : latest),
    null,
  );
  const updatedStamp = lastDataChange ? formatTimestamp(lastDataChange) : null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: isRu ? 'Криптобиржи | CryptoPulse.media' : 'Crypto Exchanges | CryptoPulse.media',
    description: isRu
      ? 'Рейтинг крупнейших криптобирж по объёму торгов.'
      : 'Ranking of the largest crypto exchanges by trading volume.',
    url: `${BASE}/${locale}/exchanges`,
    ...(lastDataChange ? { dateModified: toIso(lastDataChange) } : {}),
  };

  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: isRu ? 'Рейтинг криптобирж по объёму торгов' : 'Crypto exchanges ranked by trading volume',
    numberOfItems: shown.length,
    itemListElement: shown.map((e, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: e.name,
      url: `${BASE}/${locale}/exchanges/${slugFor(e, locale)}`,
    })),
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: isRu ? 'Главная' : 'Home', item: `${BASE}/${locale}` },
      { '@type': 'ListItem', position: 2, name: isRu ? 'Криптобиржи' : 'Crypto Exchanges', item: `${BASE}/${locale}/exchanges` },
    ],
  };

  return (
    <div className="max-w-[1320px] mx-auto px-4 sm:px-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_256px] gap-6 lg:gap-8">
        <div>
          <nav className="flex items-center gap-1.5 text-xs text-muted mb-6">
            <Link href={`/${locale}`} className="hover:text-accent transition-colors">{isRu ? 'Главная' : 'Home'}</Link>
            <span>›</span>
            <span className="text-foreground">{isRu ? 'Криптобиржи' : 'Crypto Exchanges'}</span>
          </nav>

          <h1 className="text-[26px] sm:text-[30px] font-extrabold text-foreground leading-[1.08] -tracking-[0.035em] mb-2">
            {isRu ? 'Криптобиржи — ' : 'Crypto exchanges — '}
            <span className="text-accent">{isRu ? 'рейтинг по объёму' : 'ranked by volume'}</span>
          </h1>
          <p className="text-muted text-sm leading-relaxed max-w-[60ch] mb-2">
            {isRu
              ? 'Продукты, лицензии и материалы CryptoPulse по каждой площадке.'
              : 'Products, licensing and CryptoPulse coverage for every venue.'}
          </p>
          {updatedStamp && (
            <p className="text-muted text-xs mb-4">
              {isRu ? 'Обороты обновлены ' : 'Volumes updated '}
              <time dateTime={toIso(lastDataChange!) ?? undefined} className="tabular-nums">
                {updatedStamp.full}
              </time>
            </p>
          )}

          {/* Desktop: a summary strip. Mobile: one quiet line — it is a
              reference figure, not what people come to the page for. */}
          <div className="hidden sm:flex flex-wrap rounded-[14px] overflow-hidden border border-[var(--glass-line)] bg-[image:var(--glass-fill)] shadow-[inset_0_1px_0_var(--glass-hi)] mb-5">
            {[
              [isRu ? 'Оборот 24ч' : '24h turnover', formatVolume(totalVolume)],
              [isRu ? 'Площадок' : 'Venues', String(shown.length)],
              [isRu ? 'С лицензией' : 'Licensed', String(licensedCount)],
            ].map(([label, value]) => (
              <span key={label} className="flex items-baseline gap-2 px-4 py-3 border-r border-[var(--glass-line)]">
                <span className="text-[9.5px] font-extrabold uppercase tracking-[0.09em] text-muted">{label}</span>
                <span className="text-[15.5px] font-extrabold tabular-nums -tracking-[0.025em] text-foreground">{value}</span>
              </span>
            ))}
            <span className="flex items-center px-4 py-3 text-[11.5px] text-muted">
              {isRu ? 'объём обновляется раз в сутки' : 'volume refreshed once a day'}
            </span>
          </div>
          <p className="sm:hidden flex items-center gap-1.5 flex-wrap rounded-xl border border-[var(--glass-line)] bg-[image:var(--glass-fill)] shadow-[inset_0_1px_0_var(--glass-hi)] px-3 py-2 text-[11px] text-muted mb-3.5">
            {isRu ? 'Оборот 24ч' : '24h turnover'} <b className="text-foreground font-extrabold tabular-nums">{formatVolume(totalVolume)}</b>
            <span className="opacity-40">·</span>
            <b className="text-foreground font-extrabold tabular-nums">{shown.length}</b> {isRu ? 'площадок' : 'venues'}
            <span className="opacity-40">·</span>
            <b className="text-foreground font-extrabold tabular-nums">{licensedCount}</b> {isRu ? 'с лицензией' : 'licensed'}
          </p>

          <h2 className="sr-only">{isRu ? 'Рейтинг криптобирж' : 'Exchange ranking'}</h2>
          <ExchangeToolbar sp={sp} locale={locale} />

          {shown.length === 0 ? (
            <p className="text-sm text-muted">
              {all.length === 0
                ? (isRu ? 'Пока нет добавленных бирж.' : 'No exchanges added yet.')
                : (isRu ? 'Ничего не найдено по выбранным фильтрам.' : 'Nothing matches the selected filters.')}
            </p>
          ) : (
            <>
              {featured.map(exchange => (
                <ExchangeFeatured key={exchange._id} exchange={exchange} locale={locale} />
              ))}
              {ranked.length > 0 && <ExchangeTable items={ranked} locale={locale} maxVolume={maxVolume} />}
              <p className="text-[11px] text-muted mt-2.5">
                {isRu
                  ? 'Нажмите на строку, чтобы открыть обзор биржи на CryptoPulse. «Торговать» открывается в новой вкладке.'
                  : 'Tap a row to open our review of that exchange. “Trade” opens in a new tab.'}
              </p>
            </>
          )}

          {mobilePopular.length > 0 && (
            <div className="lg:hidden mt-8 flex flex-col gap-4">
              <PopularList items={mobilePopular} locale={locale} asHeadings={false} />
              {mobileBanners.length > 0 && <SidebarBanner banners={mobileBanners} locale={locale} />}
            </div>
          )}
        </div>

        <PopularSidebar locale={locale} />
      </div>
    </div>
  );
}
