import type { Metadata } from 'next';
import Link from 'next/link';
import { buildOg, BASE } from '@/lib/metadata';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
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
        'x-default': `${BASE}/en/assets`,
      },
    },
  };
}

const ASSETS = [
  {
    slug: 'bitcoin',
    symbol: 'BTC',
    icon: '₿',
    name: 'Bitcoin',
    tagline: { ru: 'Первая криптовалюта, «цифровое золото»', en: 'The first cryptocurrency, "digital gold"' },
    year: 2009,
    available: true,
  },
  {
    slug: 'ethereum',
    symbol: 'ETH',
    icon: 'Ξ',
    name: 'Ethereum',
    tagline: { ru: 'Платформа смарт-контрактов №1', en: 'The #1 smart contract platform' },
    year: 2015,
    available: true,
  },
  {
    slug: 'solana',
    symbol: 'SOL',
    icon: '◎',
    name: 'Solana',
    tagline: { ru: 'Высокоскоростной блокчейн нового поколения', en: 'High-speed next-generation blockchain' },
    year: 2020,
    available: true,
  },
  {
    slug: 'xrp',
    symbol: 'XRP',
    icon: '✕',
    name: 'XRP (Ripple)',
    tagline: { ru: 'Токен для международных платежей', en: 'Token for cross-border payments' },
    year: 2012,
    available: true,
  },
];

export default async function AssetsPage({ params }: Props) {
  const { locale } = await params;
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

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
        {ASSETS.map(asset => (
          asset.available ? (
            <Link
              key={asset.slug}
              href={`/${locale}/assets/${asset.slug}`}
              className="group bg-card border border-border rounded-2xl p-5 hover:border-accent/40 transition-colors"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl font-bold text-accent">{asset.icon}</span>
                <div>
                  <p className="font-bold text-foreground">{asset.name}</p>
                  <p className="text-xs text-muted">{asset.symbol} · {isRu ? 'с' : 'since'} {asset.year}</p>
                </div>
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
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl font-bold text-muted">{asset.icon}</span>
                <div>
                  <p className="font-bold text-foreground">{asset.name}</p>
                  <p className="text-xs text-muted">{asset.symbol} · {isRu ? 'с' : 'since'} {asset.year}</p>
                </div>
              </div>
              <p className="text-sm text-muted">{asset.tagline[loc]}</p>
              <p className="text-xs text-muted mt-3">{isRu ? 'Скоро...' : 'Coming soon...'}</p>
            </div>
          )
        ))}
      </div>
    </div>
  );
}
