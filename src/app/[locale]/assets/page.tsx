import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { buildOg, BASE } from '@/lib/metadata';
import PopularSidebar from '@/components/ui/PopularSidebar';

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
  {
    slug: 'bnb',
    symbol: 'BNB',
    icon: '◈',
    name: 'BNB',
    tagline: { ru: 'Нативный токен биржи Binance и экосистемы BNB Chain', en: 'Native token of Binance exchange and BNB Chain ecosystem' },
    year: 2017,
    available: true,
  },
  {
    slug: 'doge',
    symbol: 'DOGE',
    icon: 'Ð',
    name: 'Dogecoin',
    tagline: { ru: 'Мем-монета №1 — народная криптовалюта Илона Маска', en: 'The #1 meme coin — Elon Musk\'s people\'s cryptocurrency' },
    year: 2013,
    available: true,
  },
  {
    slug: 'ada',
    symbol: 'ADA',
    icon: '₳',
    name: 'Cardano',
    tagline: { ru: 'Блокчейн третьего поколения с научным подходом к безопасности', en: 'Third-generation blockchain with a scientific approach to security' },
    year: 2017,
    available: true,
  },
  {
    slug: 'ton',
    symbol: 'TON',
    icon: '💎',
    name: 'Toncoin',
    tagline: { ru: 'Блокчейн Telegram от братьев Дуров — 900M пользователей', en: 'Telegram blockchain from the Durov brothers — 900M users' },
    year: 2021,
    available: true,
  },
  {
    slug: 'avax',
    symbol: 'AVAX',
    icon: '🔺',
    name: 'Avalanche',
    tagline: { ru: 'Высокоскоростной L1 с уникальным снежным консенсусом', en: 'High-speed L1 with unique snowball consensus' },
    year: 2020,
    available: true,
  },
  {
    slug: 'trx',
    symbol: 'TRX',
    icon: '⬡',
    name: 'Tron',
    tagline: { ru: 'Главная сеть для USDT-переводов в мире', en: 'The world\'s main network for USDT transfers' },
    year: 2018,
    available: true,
  },
  {
    slug: 'dot',
    symbol: 'DOT',
    icon: '●',
    name: 'Polkadot',
    tagline: { ru: 'Интероперабельный мультичейн от создателя Solidity', en: 'Interoperable multi-chain from the creator of Solidity' },
    year: 2020,
    available: true,
  },
  {
    slug: 'link',
    symbol: 'LINK',
    icon: '⬡',
    name: 'Chainlink',
    tagline: { ru: 'Децентрализованные оракулы — инфраструктура 80% DeFi', en: 'Decentralized oracles — infrastructure for 80% of DeFi' },
    year: 2017,
    available: true,
  },
  {
    slug: 'ltc',
    symbol: 'LTC',
    icon: 'Ł',
    name: 'Litecoin',
    tagline: { ru: '«Серебро к биткоиновому золоту» — 12 лет надёжности', en: '"Silver to Bitcoin\'s gold" — 12 years of reliability' },
    year: 2011,
    available: true,
  },
  {
    slug: 'shib',
    symbol: 'SHIB',
    icon: '🐕',
    name: 'Shiba Inu',
    tagline: { ru: '«Убийца Dogecoin» с собственным L2 и 410T сожжёнными токенами', en: '"DOGE killer" with its own L2 and 410T burned tokens' },
    year: 2020,
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

        <PopularSidebar locale={locale} />
      </div>
    </div>
  );
}
