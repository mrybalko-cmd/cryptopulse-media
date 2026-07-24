import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { buildOg, BASE } from '@/lib/metadata';
import { fetchExchanges, fetchPopularContent, fetchActiveBanners, type ExchangeRaw } from '@/lib/sanity';
import { rankExchanges } from '@/lib/exchangeRanking';
import { exchangeHasProductCategory, exchangeHasLicense, PRODUCT_CATEGORIES } from '@/lib/exchangeFilters';
import ExchangeCard from '@/components/ui/ExchangeCard';
import ExchangeToolbar, { type ExchangeSearchParams } from '@/components/ui/ExchangeToolbar';
import PopularSidebar from '@/components/ui/PopularSidebar';
import PopularList from '@/components/ui/PopularList';
import SidebarBanner from '@/components/ui/SidebarBanner';

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<ExchangeSearchParams> };

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

  let ranked: (ExchangeRaw & { rank: number })[];
  if (sortBy === 'year') {
    ranked = [...filtered].sort((a, b) => (a.foundedYear ?? 9999) - (b.foundedYear ?? 9999)).map((e, i) => ({ ...e, rank: i + 1 }));
  } else if (sortBy === 'alpha') {
    ranked = [...filtered].sort((a, b) => a.name.localeCompare(b.name)).map((e, i) => ({ ...e, rank: i + 1 }));
  } else {
    ranked = rankExchanges(filtered);
  }
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

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_256px] gap-6 lg:gap-8">
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

          <ExchangeToolbar sp={sp} locale={locale} />

          {ranked.length === 0 ? (
            <p className="text-sm text-muted">
              {all.length === 0
                ? (isRu ? 'Пока нет добавленных бирж.' : 'No exchanges added yet.')
                : (isRu ? 'Ничего не найдено по выбранным фильтрам.' : 'Nothing matches the selected filters.')}
            </p>
          ) : (
            <>
              <div className="flex flex-col gap-3">
                {visible.map(exchange => (
                  <ExchangeCard key={exchange._id} exchange={exchange} locale={locale} />
                ))}
              </div>

              {rest.length > 0 && (
                <details className="mt-3">
                  <summary className="cursor-pointer select-none text-center text-sm font-semibold text-accent border border-dashed border-border rounded-lg py-3 list-none">
                    {isRu ? `Показать ещё ${rest.length} →` : `Show ${rest.length} more →`}
                  </summary>
                  <div className="flex flex-col gap-3 mt-3">
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
