// Without this the route is fully static: prices are baked in at build time
// and a failed upstream call during that build leaves the page blank until
// somebody deploys again. Now it re-renders on its own every 15 minutes.
export const revalidate = 900;

import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { Calculator } from 'lucide-react';
import { buildOg, buildTwitter, BASE } from '@/lib/metadata';
import PopularSidebar from '@/components/ui/PopularSidebar';
import AssetsExplorer, { type AssetRow } from '@/components/ui/AssetsExplorer';
import { COINS, COIN_IDS, fetchTopAssetPrices } from '@/lib/coins';

type Props = { params: Promise<{ locale: string }> };

const ASSETS_FAQ = [
  {
    slug: 'where-to-start',
    question: {
      ru: 'С какого криптоактива начать разбираться?',
      en: 'Which crypto asset should a beginner start with?',
    },
    answer: {
      ru: 'Большинство начинает с Bitcoin и Ethereum: у них самая длинная история и самая глубокая ликвидность, а значит и больше всего проверяемых фактов. Наши гиды объясняют, для чего создавалась каждая сеть, — это полезнее, чем выбирать по цене.',
      en: 'Most people start with Bitcoin and Ethereum — they have the longest track record and the deepest liquidity, which also means the most verifiable history. Our guides explain what each network was built for, which is more useful than picking by price.',
    },
  },
  {
    slug: 'market-cap-meaning',
    question: {
      ru: 'Что на самом деле показывает капитализация?',
      en: 'What does market cap actually tell you?',
    },
    answer: {
      ru: 'Это цена, умноженная на количество монет в обращении. Показатель ранжирует активы по размеру, но ничего не говорит о том, справедлива ли цена: высокая капитализация означает лишь, что в актив уже вложено много денег.',
      en: 'It is price multiplied by circulating supply. It ranks assets by size but says nothing about whether a price is fair — a high market cap only means a lot of money is already in.',
    },
  },
  {
    slug: 'price-updates',
    question: {
      ru: 'Как часто обновляются цены на этой странице?',
      en: 'How often do the prices on this page update?',
    },
    answer: {
      ru: 'Цена, капитализация и график за 7 дней обновляются каждые 15 минут по данным CoinGecko. Это справочный контекст рядом с редакционными материалами, а не биржевой терминал — для сделок сверяйтесь с биржей.',
      en: 'Price, market cap and the 7-day chart refresh every 15 minutes from CoinGecko. This is reference context next to editorial content, not a trading terminal — check an exchange before acting on a number.',
    },
  },
  {
    slug: 'sectors-meaning',
    question: {
      ru: 'Зачем активы разделены на секторы?',
      en: 'Why are the assets split into sectors?',
    },
    answer: {
      ru: 'Чтобы сравнивать сопоставимое. Платёжные монеты решают одну задачу, платформы Layer 1 — совсем другую, и сравнивать их «в лоб» по проценту роста бессмысленно. Фильтр по сектору показывает, кто с кем на самом деле конкурирует.',
      en: 'So you compare like with like. Payment coins solve one problem, Layer 1 platforms solve an entirely different one, and ranking them against each other by percentage gain tells you very little. The sector filter shows who actually competes with whom.',
    },
  },
  {
    slug: 'investment-advice',
    question: {
      ru: 'Это инвестиционные рекомендации?',
      en: 'Are these guides investment advice?',
    },
    answer: {
      ru: 'Нет. Это образовательные материалы о том, как устроена каждая сеть и что происходило с ней в прошлом. Ничто на странице не является рекомендацией покупать или продавать.',
      en: 'No. They are educational explainers about how each network works and what happened to it in the past. Nothing here is a recommendation to buy or sell.',
    },
  },
];

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
    twitter: buildTwitter({ url: `${BASE}/${locale}/assets`, title, description, locale }),
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

export default async function AssetsPage({ params }: Props) {
  const { locale } = await params;
  const prices = await fetchTopAssetPrices(COIN_IDS);
  const isRu = locale === 'ru';
  const loc = isRu ? 'ru' : 'en';

  /* Build the client payload here rather than shipping the raw CoinGecko
     response: 24 coins × 168 sparkline points would add ~60KB to the RSC
     stream for a chart that is at most 300px wide. Thinned to 40 points at
     6 significant digits — enough for the shape, small enough to be free. */
  const assets: AssetRow[] = COINS.map((coin) => {
    const snapshot = prices[coin.coingeckoId];
    const raw = snapshot?.sparkline_in_7d?.price ?? [];
    const step = raw.length > 40 ? Math.ceil(raw.length / 40) : 1;
    const spark = raw.length >= 2 ? raw.filter((_, i) => i % step === 0).map((p) => Number(p.toPrecision(6))) : undefined;

    return {
      slug: coin.slug,
      name: coin.name,
      symbol: coin.symbol,
      tagline: coin.tagline[loc],
      year: coin.year,
      sector: coin.sector,
      available: coin.available,
      logo: snapshot?.image,
      rank: snapshot?.market_cap_rank,
      price: snapshot?.current_price,
      ch24: snapshot?.price_change_percentage_24h,
      ch7d: snapshot?.price_change_percentage_7d_in_currency,
      mcap: snapshot?.market_cap,
      volume: snapshot?.total_volume,
      spark,
    };
  }).sort((a, b) => (b.mcap || 0) - (a.mcap || 0));

  const pageUrl = `${BASE}/${locale}/assets`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        name: isRu ? 'Крипто-активы | CryptoPulse.media' : 'Crypto Assets | CryptoPulse.media',
        description: isRu
          ? 'Гиды по главным криптовалютам: история, факты и калькуляторы инвестиций.'
          : 'Guides to top cryptocurrencies: history, facts and investment calculators.',
        url: pageUrl,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: isRu ? 'Главная' : 'Home', item: `${BASE}/${locale}` },
          { '@type': 'ListItem', position: 2, name: isRu ? 'Крипто-активы' : 'Crypto Assets', item: pageUrl },
        ],
      },
      {
        // Tells Google this is a catalogue of 24 guides, not a page of prose.
        '@type': 'ItemList',
        name: isRu ? 'Гиды по криптоактивам' : 'Crypto asset guides',
        numberOfItems: assets.length,
        itemListElement: assets.map((asset, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: `${asset.name} (${asset.symbol})`,
          url: `${pageUrl}/${asset.slug}`,
        })),
      },
      {
        '@type': 'FAQPage',
        mainEntity: ASSETS_FAQ.map((item) => ({
          '@type': 'Question',
          name: item.question[loc],
          acceptedAnswer: { '@type': 'Answer', text: item.answer[loc] },
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
            <Link href={`/${locale}`} className="hover:text-accent transition-colors">{isRu ? 'Главная' : 'Home'}</Link>
            <span>›</span>
            <span className="text-foreground">{isRu ? 'Крипто-активы' : 'Crypto Assets'}</span>
          </nav>

          <h1 className="text-3xl sm:text-[38px] font-extrabold text-foreground leading-[1.08] tracking-tight mb-3 text-balance">
            {isRu ? (
              <>Каждый крупный криптоактив — <span className="text-accent">простыми словами</span></>
            ) : (
              <>Every major crypto asset, explained in <span className="text-accent">plain words</span></>
            )}
          </h1>
          <p className="text-muted text-sm leading-relaxed mb-7 max-w-2xl">
            {isRu
              ? `Актуальные цены, динамика за неделю и капитализация ${assets.length} активов — у каждого полный гид: история создания, ключевые события и то, для чего сеть используют на самом деле.`
              : `Live prices, weekly momentum and market cap for ${assets.length} assets — each with a full guide covering its history, the events that shaped it and what it is actually used for.`}
          </p>

          <AssetsExplorer assets={assets} locale={locale} />

          {/* Every guide carries an investment calculator; the calculators hub
              is the natural next stop for a reader comparing assets. */}
          <div className="mt-8 border border-border rounded-2xl bg-card-hover/40 px-5 sm:px-6 py-5 flex items-center justify-between gap-5 flex-wrap">
            <div>
              <h2 className="text-[15px] font-extrabold text-foreground mb-1.5">
                {isRu ? 'Не знаете, с чего начать?' : 'Not sure where to start?'}
              </h2>
              <p className="text-[12.5px] text-muted leading-relaxed max-w-lg">
                {isRu
                  ? 'В каждом гиде есть калькулятор: он показывает, во что превратились бы вложенные тогда $1000. А в разделе калькуляторов собраны конвертер валют и другие показатели рынка.'
                  : 'Every guide includes a calculator showing what $1,000 invested back then would be worth today. The calculators section adds a currency converter and other market metrics.'}
              </p>
            </div>
            <Link
              href={`/${locale}/calculators`}
              className="inline-flex items-center gap-2 bg-accent text-background rounded-[10px] px-4 py-2.5 text-[12.5px] font-extrabold hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              <Calculator size={14} />
              {isRu ? 'Открыть калькуляторы' : 'Open calculators'}
            </Link>
          </div>

          <section className="mt-12 pt-8 border-t border-border">
            <h2 className="text-xl font-bold text-foreground mb-4">
              {isRu ? 'Как пользоваться этой страницей' : 'How to use this page'}
            </h2>
            <div className="text-sm text-muted leading-relaxed flex flex-col gap-4 max-w-3xl">
              <p>
                {isRu ? (
                  <>
                    За каждым активом здесь стоит полный гид: кто и зачем создал сеть, какие события двигали её цену, для чего
                    токен используют сегодня и сколько принесли бы вложения, сделанные несколько лет назад. Цифры на этой
                    странице — контекст, а сами гиды — содержание.
                  </>
                ) : (
                  <>
                    Every asset here has a full guide behind it: who created the network and why, the events that moved its
                    price, what the token is used for today, and what an earlier entry would be worth now. The numbers on this
                    page are context — the guides are the substance.
                  </>
                )}
              </p>
              <p>
                {isRu ? (
                  <>
                    Фильтр по секторам помогает сравнивать сопоставимое: платформы <Link href={`/${locale}/glossary/smart-contract`} className="text-accent hover:underline">смарт-контрактов</Link> конкурируют
                    друг с другом, а платёжные и приватные монеты решают совсем другие задачи. Сети{' '}
                    <Link href={`/${locale}/glossary/layer-2`} className="text-accent hover:underline">Layer 2</Link> вынесены
                    отдельно, потому что живут поверх чужого блокчейна, а не рядом с ним. Сортировка по недельному изменению
                    показывает, куда на этой неделе двигались деньги, а <Link href={`/${locale}/glossary/market-cap`} className="text-accent hover:underline">капитализация</Link> —
                    насколько велик актив по сравнению с остальными.
                  </>
                ) : (
                  <>
                    The sector filter helps you compare like with like: <Link href={`/${locale}/glossary/smart-contract`} className="text-accent hover:underline">smart contract</Link> platforms
                    compete with each other, while payment and privacy coins solve entirely different problems.{' '}
                    <Link href={`/${locale}/glossary/layer-2`} className="text-accent hover:underline">Layer 2</Link> networks are
                    listed separately because they live on top of another blockchain rather than beside it. Sorting by weekly
                    change shows where money moved, and <Link href={`/${locale}/glossary/market-cap`} className="text-accent hover:underline">market cap</Link> shows
                    how big an asset is next to the rest.
                  </>
                )}
              </p>
            </div>

            <h3 className="text-base font-bold text-foreground mt-8 mb-4">
              {isRu ? 'Частые вопросы о криптоактивах' : 'Frequently asked questions'}
            </h3>
            <div className="flex flex-col gap-2 max-w-3xl">
              {ASSETS_FAQ.map((item) => (
                <details
                  key={item.slug}
                  id={item.slug}
                  className="group bg-card border border-border rounded-lg px-4 py-3 open:border-accent/40 scroll-mt-24"
                >
                  <summary className="cursor-pointer list-none flex items-start justify-between gap-3 text-sm font-semibold text-foreground">
                    {item.question[loc]}
                    <span className="text-muted text-xs shrink-0 mt-0.5 group-open:rotate-180 transition-transform">▾</span>
                  </summary>
                  <p className="text-muted text-sm leading-relaxed mt-2">{item.answer[loc]}</p>
                </details>
              ))}
            </div>
          </section>
        </div>

        <PopularSidebar locale={locale} />
      </div>
    </div>
  );
}
