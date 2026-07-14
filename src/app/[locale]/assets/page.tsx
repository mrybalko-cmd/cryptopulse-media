import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { buildOg, BASE } from '@/lib/metadata';
import PopularSidebar from '@/components/ui/PopularSidebar';
import { COINS, COIN_IDS, fetchTopAssetPrices } from '@/lib/coins';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const isRu = locale === 'ru';
  const title = isRu ? 'Крипто-активы — Гид по Bitcoin, Ethereum и другим' : 'Crypto Assets — Guide to Bitcoin, Ethereum & More';
  const description = isRu
    ? 'История, факты, цены и калькуляторы инвестиций для главных криптовалют: Bitcoin, Ethereum, Solana и других. Всё что нужно знать инвестору.'
    : 'History, facts, prices and investment calculators for top cryptocurrencies: Bitcoin, Ethereum, Solana and others. Everything an investor needs to know.';

  return {
    title,
    description,
    openGraph: buildOg({ url: `${BASE}/${locale}/assets`, title, description, locale }),
    alternates: {
      canonical: `${BASE}/${locale}/assets`,
      languages: {
        ru: `${BASE}/ru/assets`,
        en: `${BASE}/en/assets`,
      },
    },
  };
}

export default async function AssetsPage({ params }: Props) {
  const { locale } = await params;
  const prices = await fetchTopAssetPrices(COIN_IDS);
  const isRu = locale === 'ru';
  const loc = isRu ? 'ru' : 'en';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: isRu ? 'Крипто-активы | CryptoPulse.media' : 'Crypto Assets | CryptoPulse.media',
    description: isRu
      ? 'Гиды по главным криптовалютам: история, факты и калькуляторы инвестиций.'
      : 'Guides to top cryptocurrencies: history, facts and investment calculators.',
    url: `${BASE}/${locale}/assets`,
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: isRu ? 'Главная' : 'Home', item: `${BASE}/${locale}` },
      { '@type': 'ListItem', position: 2, name: isRu ? 'Крипто-активы' : 'Crypto Assets', item: `${BASE}/${locale}/assets` },
    ],
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_256px] gap-6 lg:gap-8">
        <div>
          <nav className="flex items-center gap-1.5 text-xs text-muted mb-8">
            <Link href={`/${locale}`} className="hover:text-accent transition-colors">{isRu ? 'Главная' : 'Home'}</Link>
            <span>›</span>
            <span className="text-foreground">{isRu ? 'Крипто-активы' : 'Crypto Assets'}</span>
          </nav>

          <h1 className="text-3xl font-bold text-foreground mb-3">
            {isRu ? 'Крипто-активы' : 'Crypto Assets'}
          </h1>
          <p className="text-muted text-sm leading-relaxed mb-10 max-w-xl">
            {isRu
              ? 'Глубокие гиды по главным криптовалютам: история создания, ключевые события, рост цены и интерактивные калькуляторы инвестиций.'
              : 'In-depth guides to major cryptocurrencies: creation history, key events, price growth and interactive investment calculators.'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {COINS.map(asset => {
              const snapshot = prices[asset.coingeckoId];
              const isPositive = (snapshot?.price_change_percentage_24h ?? 0) >= 0;
              const priceTag = snapshot && (
                <span className="flex items-center gap-1.5 shrink-0">
                  <span className="text-sm font-mono text-foreground">
                    ${snapshot.current_price.toLocaleString('en-US', { maximumFractionDigits: snapshot.current_price < 1 ? 4 : 2 })}
                  </span>
                  <span className={`flex items-center gap-0.5 text-xs font-mono ${isPositive ? 'text-positive' : 'text-negative'}`}>
                    {isPositive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                    {isPositive ? '+' : ''}{snapshot.price_change_percentage_24h.toFixed(1)}%
                  </span>
                </span>
              );

              return asset.available ? (
                <Link
                  key={asset.slug}
                  href={`/${locale}/assets/${asset.slug}`}
                  className="group bg-card border border-border rounded-2xl p-5 hover:border-accent/40 transition-colors"
                >
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-3xl font-bold text-accent shrink-0">{asset.icon}</span>
                      <div className="min-w-0">
                        <p className="font-bold text-foreground truncate">{asset.name}</p>
                        <p className="text-xs text-muted">{asset.symbol} · {isRu ? 'с' : 'since'} {asset.year}</p>
                      </div>
                    </div>
                    {priceTag}
                  </div>
                  <p className="text-sm text-muted">{asset.tagline[loc]}</p>
                  <p className="text-xs text-accent mt-3 group-hover:underline">
                    {isRu ? 'Читать гид →' : 'Read guide →'}
                  </p>
                </Link>
              ) : (
                <div
                  key={asset.slug}
                  className="bg-card border border-dashed border-border rounded-2xl p-5 opacity-50"
                >
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-3xl font-bold text-muted shrink-0">{asset.icon}</span>
                      <div className="min-w-0">
                        <p className="font-bold text-foreground truncate">{asset.name}</p>
                        <p className="text-xs text-muted">{asset.symbol} · {isRu ? 'с' : 'since'} {asset.year}</p>
                      </div>
                    </div>
                    {priceTag}
                  </div>
                  <p className="text-sm text-muted">{asset.tagline[loc]}</p>
                  <p className="text-xs text-muted mt-3">{isRu ? 'Скоро...' : 'Coming soon...'}</p>
                </div>
              );
            })}
          </div>
        </div>

        <PopularSidebar locale={locale} />
      </div>
    </div>
  );
}
