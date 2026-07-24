import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { buildOg, BASE } from '@/lib/metadata';
import { fetchExchanges } from '@/lib/sanity';
import { rankExchanges } from '@/lib/exchangeRanking';
import ExchangeCard from '@/components/ui/ExchangeCard';
import ExchangeTypeFilter from '@/components/ui/ExchangeTypeFilter';
import PopularSidebar from '@/components/ui/PopularSidebar';

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<{ type?: string | string[] }> };

const TYPES = ['CEX', 'DEX', 'P2P'];
const VISIBLE = 10;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const isRu = locale === 'ru';
  const title = isRu ? 'Криптобиржи — рейтинг топ-20 по объёму торгов' : 'Crypto Exchanges — Top 20 Ranked by Trading Volume';
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
  const { type } = await searchParams;
  setRequestLocale(locale);
  const isRu = locale === 'ru';

  const selectedTypes = (Array.isArray(type) ? type : type ? [type] : []).filter(t => TYPES.includes(t));

  const all = await fetchExchanges();
  const filtered = selectedTypes.length > 0
    ? all.filter(e => e.type?.some(t => selectedTypes.includes(t)))
    : all;
  const ranked = rankExchanges(filtered);
  const visible = ranked.slice(0, VISIBLE);
  const rest = ranked.slice(VISIBLE, 20);

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

      <div className="grid grid-cols-1 lg:grid-cols-[200px_minmax(0,1fr)_256px] gap-6 lg:gap-8">
        <div className="hidden lg:block">
          <ExchangeTypeFilter selected={selectedTypes} locale={locale} variant="rail" />
        </div>

        <div>
          <nav className="flex items-center gap-1.5 text-xs text-muted mb-6">
            <Link href={`/${locale}`} className="hover:text-accent transition-colors">{isRu ? 'Главная' : 'Home'}</Link>
            <span>›</span>
            <span className="text-foreground">{isRu ? 'Криптобиржи' : 'Crypto Exchanges'}</span>
          </nav>

          <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight mb-3">
            {isRu ? 'Топ-20 криптобирж' : 'Top 20 Crypto Exchanges'}
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
            <ExchangeTypeFilter selected={selectedTypes} locale={locale} variant="inline" />
          </div>

          {ranked.length === 0 ? (
            <p className="text-sm text-muted">{isRu ? 'Пока нет добавленных бирж.' : 'No exchanges added yet.'}</p>
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
        </div>

        <PopularSidebar locale={locale} />
      </div>
    </div>
  );
}
