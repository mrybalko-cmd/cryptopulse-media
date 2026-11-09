// Окно обновления держим часом, а не пятью минутами: обороты переписывает
// раз в сутки /api/cron/exchange-volumes, и он же сбрасывает тег exchanges,
// как и правка из админки. Между сбросами пересобирать нечего, а под
// маршрутом лежит слой данных на том же часе — двигать надо оба сразу.
export const revalidate = 3600;

import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { buildOg, buildTwitter, BASE } from '@/lib/metadata';
import { fetchExchanges, fetchPopularContent, fetchActiveBanners, fetchInlineBanners, type ExchangeRaw } from '@/lib/sanity';
import { formatTimestamp, toIso } from '@/lib/formatTimestamp';
import { applyFilters, EMPTY_FILTERS } from '@/lib/exchangeFilterState';
import ExchangePicks from '@/components/ui/ExchangePicks';
import { slugFor } from '@/components/ui/exchangePresentation';
import ExchangeBoard from './ExchangeBoard';
import PopularSidebar from '@/components/ui/PopularSidebar';
import PopularList from '@/components/ui/PopularList';
import SidebarBanner from '@/components/ui/SidebarBanner';
import { SITE_BRAND } from '@/lib/site';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const isRu = locale === 'ru';
  const title = isRu ? 'Криптобиржи — рейтинг по объёму торгов' : 'Crypto exchanges — ranked by volume';
  const description = isRu
    ? `Рейтинг крупнейших криптобирж по объёму торгов за 24 часа: продукты, лицензии, доступность по регионам и новости ${SITE_BRAND} по каждой бирже.`
    : `Ranking of the largest crypto exchanges by 24h trading volume: products, licensing, regional availability and ${SITE_BRAND} coverage for each exchange.`;

  // Раньше тут гасился hreflang на отфильтрованных адресах: они не могли
  // ответить взаимностью и Ahrefs их помечал. Теперь фильтры живут в решётке,
  // отдельных адресов не существует вовсе, и гасить нечего.
  return {
    title,
    description,
    openGraph: buildOg({ url: `${BASE}/${locale}/exchanges`, title, description, locale }),
    twitter: buildTwitter({ url: `${BASE}/${locale}/exchanges`, title, description, locale }),
    alternates: {
      canonical: `${BASE}/${locale}/exchanges`,
      languages: { ru: `${BASE}/ru/exchanges`, en: `${BASE}/en/exchanges`, 'x-default': `${BASE}/en/exchanges` },
    },
  };
}

export default async function ExchangesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isRu = locale === 'ru';

  const [all, mobilePopular, mobileBanners, inlineBanners] = await Promise.all([
    fetchExchanges(),
    fetchPopularContent(locale, 3),
    fetchActiveBanners(locale),
    fetchInlineBanners(locale, 'exchanges'),
  ]);

  // Сервер считает нефильтрованный рейтинг: он и уходит в разметку, и он же
  // соответствует каноникалу. Фильтры пересчитываются в браузере поверх того
  // же списка теми же функциями.
  const { ranked } = applyFilters(all, EMPTY_FILTERS);

  // Самый свежий документ биржи — это момент, когда рейтинг действительно
  // менялся: /api/cron/exchange-volumes переписывает суточные обороты раз в
  // день. Обещать свежесть, которой у данных нет, страница уже пробовала.
  const lastDataChange = all.reduce<string | null>(
    (latest, e) => (e._updatedAt && (!latest || e._updatedAt > latest) ? e._updatedAt : latest),
    null,
  );
  const updatedStamp = lastDataChange ? formatTimestamp(lastDataChange) : null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: isRu ? `Криптобиржи | ${SITE_BRAND}.media` : `Crypto Exchanges | ${SITE_BRAND}.media`,
    description: isRu
      ? 'Рейтинг крупнейших криптобирж по объёму торгов.'
      : 'Ranking of the largest crypto exchanges by trading volume.',
    url: `${BASE}/${locale}/exchanges`,
    ...(lastDataChange ? { dateModified: toIso(lastDataChange) } : {}),
  };

  // Тот же порядок, что в таблице: только оборот. Рекламный блок в разметку
  // списка не попадает.
  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: isRu ? 'Рейтинг криптобирж по объёму торгов' : 'Crypto exchanges ranked by trading volume',
    numberOfItems: ranked.length,
    itemListElement: ranked.map((e, i) => ({
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
            <span>{isRu ? 'Где торговать' : 'Where to trade'}</span>
            <span>›</span>
            <span className="text-foreground">{isRu ? 'Криптобиржи' : 'Crypto Exchanges'}</span>
          </nav>

          <h1 className="text-[26px] sm:text-[30px] font-extrabold text-foreground leading-[1.08] -tracking-[0.035em] mb-2">
            {isRu ? 'Криптобиржи — ' : 'Crypto exchanges — '}
            <span className="bg-[linear-gradient(90deg,var(--violet),var(--violet-2))] bg-clip-text text-transparent">
              {isRu ? 'рейтинг по обороту' : 'ranked by volume'}
            </span>
          </h1>
          <p className="text-muted text-sm leading-relaxed max-w-[60ch] mb-2">
            {isRu
              ? `Продукты, лицензии и материалы ${SITE_BRAND} по каждой площадке.`
              : `Products, licensing and ${SITE_BRAND} coverage for every venue.`}
          </p>
          {updatedStamp && (
            <p className="text-muted text-xs mb-4">
              {isRu ? 'Обороты обновлены ' : 'Volumes updated '}
              <time dateTime={toIso(lastDataChange!) ?? undefined} className="tabular-nums">
                {updatedStamp.full}
              </time>
            </p>
          )}

          <p className="flex flex-wrap items-center justify-between gap-2 rounded-[14px] border border-[var(--glass-line)] bg-[image:var(--glass-fill)] px-4 py-2.5 text-[12.5px] text-muted mb-3">
            <span>{isRu ? 'Нужен брокер с CFD на криптовалюту?' : 'Looking for a broker with crypto CFDs?'}</span>
            <Link href={`/${locale}/brokers`} className="font-extrabold text-foreground hover:text-accent transition-colors">
              {isRu ? 'Брокеры с криптой →' : 'Brokers with crypto →'}
            </Link>
          </p>

          <ExchangeBoard
            banners={inlineBanners}
            all={all}
            locale={locale}
            isRu={isRu}
            picks={<ExchangePicks exchanges={all} locale={locale} />}
          />

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
