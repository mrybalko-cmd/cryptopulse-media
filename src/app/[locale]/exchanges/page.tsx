import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { buildOg, BASE } from '@/lib/metadata';
import { fetchExchanges, fetchPopularContent, fetchActiveBanners } from '@/lib/sanity';
import { rankExchanges } from '@/lib/exchangeRanking';
import { exchangeHasProductCategory, exchangeHasLicense, PRODUCT_CATEGORIES } from '@/lib/exchangeFilters';
import ExchangeCard from '@/components/ui/ExchangeCard';
import ExchangeFilters, { type ExchangeFilterState } from '@/components/ui/ExchangeFilters';
import PopularSidebar from '@/components/ui/PopularSidebar';
import PopularList from '@/components/ui/PopularList';
import SidebarBanner from '@/components/ui/SidebarBanner';

type SearchParams = {
  type?: string | string[];
  product?: string | string[];
  license?: string;
  minYear?: string;
  maxYear?: string;
  minVolume?: string;
};

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<SearchParams> };

const TYPES = ['CEX', 'DEX', 'P2P'];
const PRODUCT_VALUES = PRODUCT_CATEGORIES.map(p => p.value);
const VISIBLE = 10;

function toArray(v?: string | string[]): string[] {
  return Array.isArray(v) ? v : v ? [v] : [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const isRu = locale === 'ru';
  const title = isRu ? 'Криптобиржи — рейтинг по объёму торгов' : 'Crypto Exchanges — Ranked by Trading Volume';
  const description = isRu
    ? 'Рейтинг крупнейших криптобирж по объёму торгов за 24 часа: продукты, лицензии, доступность по регионам и новости CryptoPulse по каждой бирже.'
    : 'Ranking of the largest crypto exchanges by 24h trading volume: products, licensing, regional availability and CryptoPulse coverage for each exchange.';

  return {
    title,
    description,
    openGraph: buildOg({ url: `${BASE}/${locale}/exchanges`, title, description, locale }),
    alternates: {
      canonical: `${BASE}/${locale}/exchanges`,
      languages: { ru: `${BASE}/ru/exchanges`, en: `${BASE}/en/exchanges` },
    },
  };
}

export default async function ExchangesPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const sp = await searchParams;
  setRequestLocale(locale);
  const isRu = locale === 'ru';

  const filterState: ExchangeFilterState = {
    types: toArray(sp.type).filter(t => TYPES.includes(t)),
    products: toArray(sp.product).filter(p => PRODUCT_VALUES.includes(p as (typeof PRODUCT_VALUES)[number])),
    hasLicense: sp.license === '1',
    minYear: sp.minYear ? Number(sp.minYear) : undefined,
    maxYear: sp.maxYear ? Number(sp.maxYear) : undefined,
    minVolumeM: sp.minVolume ? Number(sp.minVolume) : undefined,
  };

  const [all, mobilePopular, mobileBanners] = await Promise.all([
    fetchExchanges(),
    fetchPopularContent(locale, 3),
    fetchActiveBanners(locale),
  ]);
  const filtered = all.filter(e => {
    if (filterState.types.length > 0 && !e.type?.some(t => filterState.types.includes(t))) return false;
    if (filterState.products.length > 0 && !filterState.products.some(p => exchangeHasProductCategory(e, p))) return false;
    if (filterState.hasLicense && !exchangeHasLicense(e)) return false;
    if (filterState.minYear != null && (e.foundedYear ?? 0) < filterState.minYear) return false;
    if (filterState.maxYear != null && (e.foundedYear ?? 9999) > filterState.maxYear) return false;
    if (filterState.minVolumeM != null && (e.volume24h ?? 0) < filterState.minVolumeM * 1e6) return false;
    return true;
  });
  const ranked = rankExchanges(filtered);
  const visible = ranked.slice(0, VISIBLE);
  const rest = ranked.slice(VISIBLE);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: isRu ? 'Криптобиржи | CryptoPulse.media' : 'Crypto Exchanges | CryptoPulse.media',
    description: isRu
      ? 'Рейтинг крупнейших криптобирж по объёму торгов.'
      : 'Ranking of the largest crypto exchanges by trading volume.',
    url: `${BASE}/${locale}/exchanges`,
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <div className="grid grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)_256px] gap-6 lg:gap-8">
        <div className="hidden lg:block">
          <ExchangeFilters state={filterState} locale={locale} variant="rail" />
        </div>

        <div>
          <nav className="flex items-center gap-1.5 text-xs text-muted mb-6">
            <Link href={`/${locale}`} className="hover:text-accent transition-colors">{isRu ? 'Главная' : 'Home'}</Link>
            <span>›</span>
            <span className="text-foreground">{isRu ? 'Криптобиржи' : 'Crypto Exchanges'}</span>
          </nav>

          <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight mb-3">
            {isRu ? 'Криптобиржи' : 'Crypto Exchanges'}
          </h1>
          <p className="text-muted text-sm sm:text-base leading-relaxed max-w-2xl mb-2">
            {isRu
              ? 'Рейтинг по объёму торгов за 24 часа, обновляется автоматически. Продукты, статус лицензий и материалы CryptoPulse по каждой бирже.'
              : 'Ranked by 24h trading volume, updated automatically. Products, licensing status and CryptoPulse coverage for each exchange.'}
          </p>
          <div className="flex items-center gap-1.5 text-xs text-muted mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-positive shrink-0" />
            {isRu ? 'Объём торгов обновляется раз в сутки' : 'Trading volume refreshed once a day'}
          </div>

          <div className="lg:hidden">
            <ExchangeFilters state={filterState} locale={locale} variant="mobile" />
          </div>

          {ranked.length === 0 ? (
            <p className="text-sm text-muted">
              {all.length === 0
                ? (isRu ? 'Пока нет добавленных бирж.' : 'No exchanges added yet.')
                : (isRu ? 'Ничего не найдено по выбранным фильтрам.' : 'Nothing matches the selected filters.')}
            </p>
          ) : (
            <>
              <div className="flex flex-col gap-2.5">
                {visible.map(exchange => (
                  <ExchangeCard key={exchange._id} exchange={exchange} locale={locale} />
                ))}
              </div>

              {rest.length > 0 && (
                <details className="mt-3">
                  <summary className="cursor-pointer select-none text-center text-sm font-semibold text-accent border border-dashed border-border rounded-lg py-3 list-none">
                    {isRu ? `Показать ещё ${rest.length} →` : `Show ${rest.length} more →`}
                  </summary>
                  <div className="flex flex-col gap-2.5 mt-2.5">
                    {rest.map(exchange => (
                      <ExchangeCard key={exchange._id} exchange={exchange} locale={locale} />
                    ))}
                  </div>
                </details>
              )}
            </>
          )}

          {mobilePopular.length > 0 && (
            <div className="lg:hidden mt-8 flex flex-col gap-4">
              <PopularList items={mobilePopular} locale={locale} />
              {mobileBanners.length > 0 && <SidebarBanner banners={mobileBanners} locale={locale} />}
            </div>
          )}
        </div>

        <PopularSidebar locale={locale} />
      </div>
    </div>
  );
}
