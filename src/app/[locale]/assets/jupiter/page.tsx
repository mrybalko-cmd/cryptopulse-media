import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { buildOg, buildTwitter, BASE } from '@/lib/metadata';
import CoinGuideLayout from '@/components/ui/CoinGuideLayout';
import { COIN_GUIDES } from '@/lib/coinGuides';
import { ORGANIZATION_ID } from '@/lib/organizationSchema';

type Props = { params: Promise<{ locale: string }> };
const SLUG = 'jupiter';
const guide = COIN_GUIDES[SLUG];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const isRu = locale === 'ru';
  const title = isRu ? 'Jupiter (JUP): цена, история, калькулятор' : 'Jupiter (JUP): price, history, calculator';
  const description = isRu
    ? 'Как Jupiter стал главным маршрутом обменов в Solana, раздал миллиард JUP в январе 2024 года и сжёг 3 миллиарда год спустя. История и калькулятор вложений в JUP.'
    : 'How Jupiter became the main swap route on Solana, gave away a billion JUP in January 2024 and burned 3 billion a year later. History and a JUP calculator.';

  return {
    // Absolute: the layout template appends the site name, which adds nothing here.
    title: { absolute: title },
    description,
    keywords: isRu
      ? ['jupiter история', 'jup токен', 'jupiter калькулятор', 'jupiter цена', 'курс jup']
      : ['jupiter history', 'jup token', 'jupiter investment calculator', 'jupiter price', 'jup price'],
    openGraph: buildOg({ url: `${BASE}/${locale}/assets/${SLUG}`, title, description, locale }),
    twitter: buildTwitter({ url: `${BASE}/${locale}/assets/${SLUG}`, title, description, locale }),
    alternates: {
      canonical: `${BASE}/${locale}/assets/${SLUG}`,
      languages: { ru: `${BASE}/ru/assets/${SLUG}`, en: `${BASE}/en/assets/${SLUG}`, 'x-default': `${BASE}/en/assets/${SLUG}` },
    },
  };
}

export default async function JupiterPage({ params }: Props) {
  const { locale } = await params;
  const isRu = locale === 'ru';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: isRu ? 'Jupiter (JUP): маршрутизатор обменов в Solana' : 'Jupiter (JUP): the router behind Solana swaps',
    description: isRu ? 'Как Jupiter стал главным маршрутом обменов в Solana, раздал миллиард JUP в январе 2024 года и сжёг 3 миллиарда год спустя. История и калькулятор вложений в JUP.' : 'How Jupiter became the main swap route on Solana, gave away a billion JUP in January 2024 and burned 3 billion a year later. History and a JUP calculator.',
    inLanguage: locale,
    datePublished: '2026-11-03',
    dateModified: new Date().toISOString().slice(0, 10),
    author: { '@id': ORGANIZATION_ID },
    publisher: { '@id': ORGANIZATION_ID },
    mainEntityOfPage: `${BASE}/${locale}/assets/${SLUG}`,
  };
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: guide.faq.map(item => ({ '@type': 'Question', name: item.question[isRu ? 'ru' : 'en'], acceptedAnswer: { '@type': 'Answer', text: item.answer[isRu ? 'ru' : 'en'] } })),
  };
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: isRu ? 'Главная' : 'Home', item: `${BASE}/${locale}` },
      { '@type': 'ListItem', position: 2, name: isRu ? 'Крипто-активы' : 'Crypto Assets', item: `${BASE}/${locale}/assets` },
      { '@type': 'ListItem', position: 3, name: 'Jupiter (JUP)', item: `${BASE}/${locale}/assets/${SLUG}` },
    ],
  };

  const historyContent = isRu ? (
    <>
      <h3>Миллиард токенов в первый день</h3>
      <p>
        31 января 2024 года Jupiter выпустил токен JUP и устроил <Link href={`/${locale}/glossary/airdrop`}>аирдроп</Link>: около миллиарда токенов получили примерно 955 тысяч кошельков, по данным Decrypt. В тот же день цена поставила исторический максимум, 2,00 доллара, по данным CoinGecko.
      </p>

      <h3>Агрегатор для Solana</h3>
      <p>
        Сам Jupiter работает с октября 2021 года, это первый агрегатор обменов в сети Solana. Когда вы меняете один токен на другой, он сравнивает цены на множестве <Link href={`/${locale}/glossary/dex`}>DEX</Link> и при необходимости делит заявку между ними, чтобы снизить <Link href={`/${locale}/glossary/slippage`}>проскальзывание</Link>. Примерно как сервис сравнения авиабилетов, только сделка проходит сразу. Сооснователь проекта известен под псевдонимом meow.
      </p>

      <h3>Сжигание и второй Jupuary</h3>
      <p>
        В августе 2024 года сообщество одобрило сжечь 3 миллиарда JUP из доли команды, и максимальный выпуск сократился с 10 до 7 миллиардов. 22 января 2025 года второй аирдроп Jupuary разослал почти 700 миллионов JUP, тогда около 616 миллионов долларов, примерно 2 миллионам кошельков, писал The Block.
      </p>

      <h3>Что сейчас</h3>
      <p>
        Общее предложение около 6,86 миллиарда JUP, в обращении примерно 3,3 миллиарда. Минимум, 0,1358 доллара, цена поставила 12 февраля 2026 года, по данным CoinGecko.
      </p>
    </>
  ) : (
    <>
      <h3>An aggregator for Solana</h3>
      <p>
        Jupiter launched in October 2021 as the first on-chain swap aggregator on Solana. When you swap one token for another, Jupiter checks prices across many <Link href={`/${locale}/glossary/dex`}>DEX</Link> venues and splits the order to lower <Link href={`/${locale}/glossary/slippage`}>slippage</Link>. Its co-founder goes by the pseudonym meow.
      </p>

      <h3>31 January 2024: the first airdrop</h3>
      <p>
        JUP launched on 31 January 2024 with an <Link href={`/${locale}/glossary/airdrop`}>airdrop</Link> of about 1 billion tokens to some 955,000 wallets, according to Decrypt. The price set its all-time high of 2.00 dollars on launch day, by CoinGecko data.
      </p>

      <h3>Jupuary and the burn</h3>
      <p>
        In August 2024 the community approved burning 3 billion JUP from the team’s allocation, which cut the maximum supply from 10 billion to 7 billion. On 22 January 2025 the second Jupuary airdrop sent nearly 700 million JUP, then worth about 616 million dollars, to about 2 million wallets, The Block reported.
      </p>

      <h3>Where JUP stands now</h3>
      <p>
        Total supply is about 6.86 billion JUP, and about 3.3 billion are in circulation, by CoinGecko data. The price hit its lowest recorded level, 0.1358 dollars, on 12 February 2026.
      </p>
    </>
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <CoinGuideLayout
        locale={locale}
        slug={SLUG}
        name="Jupiter"
        symbol="JUP"
        icon="Ⓙ"
        coingeckoId="jupiter-exchange-solana"
        tagline={isRu ? 'Агрегатор обменов, через который идёт Solana' : 'The swap aggregator at the centre of Solana'}
        historyTitle={isRu ? 'История Jupiter: от агрегатора до Jupuary' : 'Jupiter history: from an aggregator to Jupuary'}
        historyContent={historyContent}
        guide={guide}
      />
    </>
  );
}
