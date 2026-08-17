// Without this the route is fully static: prices are baked in at build time
// and a failed upstream call during that build leaves the page blank until
// somebody deploys again. Now it re-renders on its own every 15 minutes.
export const revalidate = 900;

import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import CurrencyConverter, { type CoinMeta } from '@/components/ui/CurrencyConverter';
import ConverterSeo, { CONVERTER_FAQ } from '@/components/ui/ConverterSeo';
import PopularSidebar from '@/components/ui/PopularSidebar';
import PopularList from '@/components/ui/PopularList';
import SidebarBanner from '@/components/ui/SidebarBanner';
import { fetchPopularContent, fetchActiveBanners } from '@/lib/sanity';
import { fetchTopAssetPrices } from '@/lib/coins';
import { CRYPTO_CURRENCIES, FIAT_CURRENCIES, fetchConverterPrices } from '@/lib/currencies';
import { SITE_BRAND, SITE_URL } from '@/lib/site';

const BASE = SITE_URL;

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ from?: string; to?: string; amount?: string }>;
};

const VALID_KEYS = new Set([
  ...CRYPTO_CURRENCIES.map(c => `c:${c.id}`),
  ...FIAT_CURRENCIES.map(f => `f:${f.code}`),
]);

export async function generateMetadata({ params }: Pick<Props, 'params'>): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const isRu = locale === 'ru';
  const title = isRu
    ? 'Конвертер криптовалют — курс онлайн'
    : 'Crypto Currency Converter — Live Rates';
  const description = isRu
    ? 'Переведите биткоин, Ethereum и ещё 13 монет в доллары, евро, гривны и 17 других валют — и обратно. Живой курс, готовые суммы, изменение за сутки.'
    : 'Convert Bitcoin, Ethereum and 13 other coins into dollars, euros, hryvnia and 17 more currencies — and back. Live rates, ready-made amounts, 24h change.';

  return {
    title,
    description,
    alternates: {
      // The pair lives in the query string, so every combination would
      // otherwise be its own crawlable duplicate. Canonical stays bare.
      canonical: `${BASE}/${locale}/calculators/converter`,
      languages: {
        ru: `${BASE}/ru/calculators/converter`,
        en: `${BASE}/en/calculators/converter`,
        'x-default': `${BASE}/en/calculators/converter`,
      },
    },
    openGraph: {
      type: 'website',
      title,
      description,
      url: `${BASE}/${locale}/calculators/converter`,
      siteName: `${SITE_BRAND}.media`,
      locale: isRu ? 'ru_RU' : 'en_US',
      images: [{ url: `${BASE}/${locale}/opengraph-image` }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [`${BASE}/${locale}/opengraph-image`] },
  };
}

export default async function CurrencyConverterPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const sp = await searchParams;
  // A shared link renders its pair server-side rather than snapping to it
  // after hydration. Anything unrecognised falls back to the default pair.
  const initialFrom = sp.from && VALID_KEYS.has(sp.from) ? sp.from : 'f:usd';
  const initialTo = sp.to && VALID_KEYS.has(sp.to) ? sp.to : 'c:bitcoin';
  const initialAmount = sp.amount && Number(sp.amount) > 0 ? sp.amount : '1000';
  setRequestLocale(locale);
  const isRu = locale === 'ru';

  // Logos and weekly price lines are static enough to come from the server —
  // only the live quotes need the per-minute client fetch.
  const [snapshots, initialPrices, mobilePopular, mobileBanners] = await Promise.all([
    fetchTopAssetPrices(CRYPTO_CURRENCIES.map(c => c.id)),
    fetchConverterPrices(),
    fetchPopularContent(locale, 3),
    fetchActiveBanners(locale),
  ]);

  const meta: Record<string, CoinMeta> = Object.fromEntries(
    Object.entries(snapshots).map(([id, snap]) => [
      id,
      {
        image: snap.image,
        // Thinned to ~42 points: enough shape for a 96px line, a fraction of the payload.
        sparkline: snap.sparkline_in_7d?.price.filter((_, i) => i % 4 === 0),
        change7d: snap.price_change_percentage_7d_in_currency,
      },
    ])
  );

  const faq = CONVERTER_FAQ[isRu ? 'ru' : 'en'];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: isRu ? `Конвертер криптовалют ${SITE_BRAND}` : `${SITE_BRAND} Crypto Converter`,
        url: `${BASE}/${locale}/calculators/converter`,
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Any',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: isRu ? 'Главная' : 'Home', item: `${BASE}/${locale}` },
          {
            '@type': 'ListItem',
            position: 2,
            name: isRu ? 'Калькуляторы и показатели' : 'Calculators & Metrics',
            item: `${BASE}/${locale}/calculators`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: isRu ? 'Конвертер' : 'Converter',
            item: `${BASE}/${locale}/calculators/converter`,
          },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: faq.map(item => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a },
        })),
      },
    ],
  };

  return (
    <div className="max-w-[1320px] mx-auto px-4 sm:px-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_256px] gap-6 lg:gap-8">
        <div className="min-w-0">
          <nav className="flex items-center gap-1.5 text-xs text-muted mb-5">
            <Link href={`/${locale}`} className="hover:text-accent transition-colors">
              {isRu ? 'Главная' : 'Home'}
            </Link>
            <span>›</span>
            <Link href={`/${locale}/calculators`} className="hover:text-accent transition-colors">
              {isRu ? 'Калькуляторы' : 'Calculators'}
            </Link>
            <span>›</span>
            <span className="text-foreground">{isRu ? 'Конвертер' : 'Converter'}</span>
          </nav>

          <h1 className="text-[26px] sm:text-[30px] font-extrabold text-foreground leading-[1.08] -tracking-[0.035em] mb-2">
            {isRu ? 'Конвертер криптовалют — ' : 'Crypto converter — '}
            <span className="text-accent">{isRu ? 'курс прямо сейчас' : 'the rate right now'}</span>
          </h1>
          <p className="text-muted text-sm leading-relaxed max-w-[62ch] mb-6">
            {isRu
              ? '15 монет и 20 валют в любом сочетании — включая крипту в крипту. Курс обновляется раз в минуту, готовые суммы посчитаны заранее.'
              : '15 coins and 20 currencies in any combination — crypto to crypto included. Rates refresh every minute, common amounts are precomputed.'}
          </p>

          <h2 className="sr-only">{isRu ? 'Калькулятор' : 'Calculator'}</h2>
          <CurrencyConverter
            locale={locale}
            meta={meta}
            initialFrom={initialFrom}
            initialTo={initialTo}
            initialAmount={initialAmount}
            initialPrices={initialPrices}
          />

          <p className="text-[11px] text-muted mt-3">
            {isRu
              ? 'Курсы предоставлены CoinGecko. Расчёт носит информационный характер и не учитывает комиссии — реальный курс при покупке или продаже будет отличаться.'
              : 'Rates provided by CoinGecko. Figures are informational and exclude fees — the actual rate when buying or selling will differ.'}
          </p>

          <div className="mt-10">
            <ConverterSeo locale={locale} />
          </div>

          <section className="mt-9">
            <h2 className="text-lg sm:text-xl font-extrabold text-foreground -tracking-[0.02em] mb-3">
              {isRu ? 'Частые вопросы' : 'Frequently asked questions'}
            </h2>
            <div className="flex flex-col gap-2">
              {faq.map(item => (
                <details
                  key={item.q}
                  className="group rounded-xl border border-[var(--glass-line)] bg-[image:var(--glass-fill)] px-4 py-3 open:border-accent/40 transition-colors"
                >
                  <summary className="cursor-pointer list-none flex items-start justify-between gap-3 text-sm font-bold text-foreground">
                    {item.q}
                    <span className="shrink-0 text-muted transition-transform group-open:rotate-180">▾</span>
                  </summary>
                  <p className="text-sm text-muted leading-relaxed mt-2.5 max-w-[70ch]">{item.a}</p>
                </details>
              ))}
            </div>
          </section>

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
