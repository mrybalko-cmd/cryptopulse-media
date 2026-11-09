// Данные брокеров меняются только из админки, а она сбрасывает тег exchanges.
export const revalidate = 3600;

import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { buildOg, buildTwitter, BASE } from '@/lib/metadata';
import { fetchBrokers, fetchPopularContent, fetchActiveBanners } from '@/lib/sanity';
import { rankBrokers, tier1Count } from '@/lib/brokerFields';
import { hasActiveAd } from '@/lib/exchangePlacements';
import { formatTimestamp } from '@/lib/formatTimestamp';
import BrokerBoard from '@/components/ui/BrokerBoard';
import { brokerHref } from '@/components/ui/brokerPresentation';
import BrokerRisk, { brokerLossSentence } from '@/components/ui/BrokerRisk';
import ExchangeAdBlock from '@/components/ui/ExchangeAdBlock';
import PopularSidebar from '@/components/ui/PopularSidebar';
import PopularList from '@/components/ui/PopularList';
import SidebarBanner from '@/components/ui/SidebarBanner';
import { SITE_BRAND } from '@/lib/site';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const isRu = locale === 'ru';
  const title = isRu ? 'Брокеры с криптовалютой: регуляторы и условия' : 'Brokers with crypto: regulators and terms';
  const description = isRu
    ? 'Регулируемые брокеры с криптовалютой: лицензии с номерами, монеты или CFD, депозит и доля счетов, теряющих деньги, по данным самих брокеров.'
    : 'Regulated brokers with crypto: licences with numbers, coins or CFDs, minimum deposit and the share of accounts losing money, as each broker reports it.';
  return {
    title,
    description,
    openGraph: buildOg({ url: `${BASE}/${locale}/brokers`, title, description, locale }),
    twitter: buildTwitter({ url: `${BASE}/${locale}/brokers`, title, description, locale }),
    alternates: {
      canonical: `${BASE}/${locale}/brokers`,
      languages: { ru: `${BASE}/ru/brokers`, en: `${BASE}/en/brokers`, 'x-default': `${BASE}/en/brokers` },
    },
  };
}

export default async function BrokersPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isRu = locale === 'ru';

  const [all, mobilePopular, mobileBanners] = await Promise.all([
    fetchBrokers(),
    fetchPopularContent(locale, 3),
    fetchActiveBanners(locale),
  ]);
  const brokers = rankBrokers(all);
  const lastVerified = brokers.reduce<string | null>(
    (latest, b) => (b.verifiedAt && (!latest || b.verifiedAt > latest) ? b.verifiedAt : latest),
    null,
  );
  const tier1Total = brokers.reduce((sum, b) => sum + tier1Count(b), 0);
  const withCoins = brokers.filter(b => b.offersCoins).length;

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: isRu ? 'Брокеры с криптовалютой' : 'Brokers with crypto',
      numberOfItems: brokers.length,
      itemListElement: brokers.map((b, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: b.name,
        url: `${BASE}${brokerHref(b, locale)}`,
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: isRu ? 'Главная' : 'Home', item: `${BASE}/${locale}` },
        { '@type': 'ListItem', position: 2, name: isRu ? 'Брокеры' : 'Brokers', item: `${BASE}/${locale}/brokers` },
      ],
    },
  ];

  const differences = isRu
    ? [
        ['Чем вы владеете', 'На бирже монетой. У брокера чаще контрактом на её цену.'],
        ['Плечо', 'У брокера в ЕС для розницы на криптовалюту до 1:2.'],
        ['Вывод', 'Монету с биржи можно вывести на кошелёк. CFD нельзя.'],
      ]
    : [
        ['What you own', 'On an exchange, the coin. At a broker, usually a contract on its price.'],
        ['Leverage', 'EU retail clients get up to 1:2 on crypto at a broker.'],
        ['Withdrawal', 'A coin can leave an exchange for your wallet. A CFD cannot.'],
      ];

  return (
    <div className="max-w-[1320px] mx-auto px-4 sm:px-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_256px] gap-6 lg:gap-8">
        <div className="min-w-0">
          <nav className="flex items-center gap-1.5 text-xs text-muted mb-6 flex-wrap">
            <Link href={`/${locale}`} className="hover:text-accent transition-colors">{isRu ? 'Главная' : 'Home'}</Link>
            <span>›</span>
            <span>{isRu ? 'Где торговать' : 'Where to trade'}</span>
            <span>›</span>
            <span className="text-foreground">{isRu ? 'Брокеры' : 'Brokers'}</span>
          </nav>

          <h1 className="text-[26px] sm:text-[30px] font-extrabold text-foreground leading-[1.08] -tracking-[0.035em] mb-2">
            {isRu ? 'Брокеры с ' : 'Brokers with '}
            <span className="bg-[linear-gradient(90deg,var(--violet),var(--violet-2))] bg-clip-text text-transparent">
              {isRu ? 'криптовалютой' : 'crypto'}
            </span>
          </h1>
          <p className="text-muted text-sm leading-relaxed max-w-[60ch] mb-2">
            {isRu
              ? 'Счёт у регулируемого брокера. Чаще всего это CFD: вы торгуете ценой, а не владеете монетой.'
              : 'An account at a regulated broker. Most often that means CFDs: you trade the price without owning the coin.'}
          </p>
          {lastVerified && (
            <p className="text-muted text-xs mb-4">
              {isRu ? 'Данные проверены ' : 'Data checked '}
              <span className="tabular-nums">{formatTimestamp(lastVerified)?.date}</span>
            </p>
          )}

          <BrokerRisk className="mb-3">
            <b>{isRu ? 'Предупреждение о риске.' : 'Risk warning.'}</b>{' '}
            {isRu
              ? 'CFD — сложные инструменты с высоким риском быстрой потери денег из-за кредитного плеча. Процент розничных счетов, которые теряют деньги, указан у каждого брокера по его данным.'
              : 'CFDs are complex instruments with a high risk of losing money rapidly due to leverage. The share of retail accounts losing money is shown for each broker, as that broker reports it.'}
          </BrokerRisk>

          <p className="flex flex-wrap items-center justify-between gap-2 rounded-[14px] border border-[var(--glass-line)] bg-[image:var(--glass-fill)] px-4 py-2.5 text-[12.5px] text-muted mb-3">
            <span>{isRu ? 'Хотите купить сами монеты?' : 'Want to buy the coins themselves?'}</span>
            <Link href={`/${locale}/exchanges`} className="font-extrabold text-foreground hover:text-accent transition-colors">
              {isRu ? 'Криптобиржи →' : 'Crypto exchanges →'}
            </Link>
          </p>

          <p className="sm:hidden flex items-center gap-1.5 flex-wrap rounded-xl border border-[var(--glass-line)] bg-[image:var(--glass-fill)] shadow-[inset_0_1px_0_var(--glass-hi)] px-3 py-2 text-[11px] text-muted mb-3.5">
            <b className="text-foreground font-extrabold tabular-nums">{brokers.length}</b> {isRu ? 'брокера' : 'brokers'}
            <span className="opacity-40">·</span>
            <b className="text-foreground font-extrabold tabular-nums">{tier1Total}</b> {isRu ? 'регуляторов 1-го уровня' : 'tier-1 regulators'}
            <span className="opacity-40">·</span>
            <b className="text-foreground font-extrabold tabular-nums">{withCoins}</b> {isRu ? 'с монетами' : 'with coins'}
          </p>
          <div className="hidden sm:flex flex-wrap rounded-[14px] overflow-hidden border border-[var(--glass-line)] bg-[image:var(--glass-fill)] shadow-[inset_0_1px_0_var(--glass-hi)] mb-5">
            {[
              [isRu ? 'Брокеров' : 'Brokers', String(brokers.length)],
              [isRu ? 'Регуляторов 1-го уровня' : 'Tier-1 regulators', String(tier1Total)],
              [isRu ? 'С реальными монетами' : 'With real coins', String(withCoins)],
            ].map(([label, value]) => (
              <span key={label} className="flex items-baseline gap-2 px-4 py-3 border-r border-[var(--glass-line)]">
                <span className="text-[9.5px] font-extrabold uppercase tracking-[0.09em] text-muted">{label}</span>
                <span className="text-[15.5px] font-extrabold tabular-nums -tracking-[0.025em] text-foreground">{value}</span>
              </span>
            ))}
            <span className="flex items-center px-4 py-3 text-[11.5px] text-muted">
              {isRu ? 'порядок: по регуляторам, затем по депозиту' : 'order: by regulators, then by deposit'}
            </span>
          </div>

          {brokers.filter(hasActiveAd).map(broker => (
            <ExchangeAdBlock
              key={broker._id}
              exchange={broker}
              locale={locale}
              reviewHref={brokerHref(broker, locale)}
              reviewLabel={isRu ? 'Обзор брокера' : 'Broker review'}
              defaultButton={isRu ? 'Открыть счёт' : 'Open account'}
              risk={brokerLossSentence(broker, isRu)}
            />
          ))}

          {brokers.length === 0 ? (
            <p className="text-sm text-muted">{isRu ? 'Пока нет добавленных брокеров.' : 'No brokers added yet.'}</p>
          ) : (
            <BrokerBoard brokers={brokers} locale={locale} />
          )}

          <p className="text-[12px] leading-relaxed text-muted mt-2.5">
            {isRu
              ? `Порядок: сначала брокеры с бо́льшим числом регуляторов первого уровня (FCA, ASIC, BaFin, CySEC и подобные), при равенстве с меньшим минимальным депозитом. Часть ссылок партнёрские: ${SITE_BRAND} может получать вознаграждение, на порядок это не влияет.`
              : `Order: brokers with more tier-1 regulators come first (FCA, ASIC, BaFin, CySEC and the like); on a tie, the lower minimum deposit. Some links are affiliate links: ${SITE_BRAND} may earn a commission, which has no effect on the order.`}
          </p>

          <h2 className="text-lg sm:text-xl font-extrabold text-foreground -tracking-[0.02em] mt-8 mb-3">
            {isRu ? 'Брокер или биржа: в чём разница' : 'Broker or exchange: the difference'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {differences.map(([title, text]) => (
              <div key={title} className="rounded-[14px] border border-[var(--glass-line)] bg-[image:var(--glass-fill)] px-3.5 py-3">
                <b className="block text-[13px] font-extrabold text-foreground mb-0.5">{title}</b>
                <span className="text-xs leading-snug text-muted">{text}</span>
              </div>
            ))}
          </div>

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
