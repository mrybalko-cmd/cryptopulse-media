import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { buildOg, buildTwitter, BASE } from '@/lib/metadata';
import CoinGuideLayout from '@/components/ui/CoinGuideLayout';
import { COIN_GUIDES } from '@/lib/coinGuides';
import { ORGANIZATION_ID } from '@/lib/organizationSchema';

import { ASSET_REVISIONS } from '@/lib/pageRevisions';
type Props = { params: Promise<{ locale: string }> };
const SLUG = 'pepe';
const guide = COIN_GUIDES[SLUG];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const isRu = locale === 'ru';
  const title = isRu ? 'Pepe (PEPE): цена, история, калькулятор' : 'Pepe (PEPE): price, history, calculator';
  const description = isRu
    ? 'Как PEPE за три недели после тихого запуска в апреле 2023 года дорос до миллиарда долларов капитализации, а в декабре 2024-го поставил рекорд. История и калькулятор.'
    : 'How PEPE went from a quiet launch in April 2023 to a billion-dollar market cap in three weeks and a record in December 2024. PEPE history and an investment calculator.';

  return {
    // Absolute: the layout template appends the site name, which adds nothing here.
    title: { absolute: title },
    description,
    keywords: isRu
      ? ['pepe история', 'pepe токен', 'pepe калькулятор', 'pepe цена', 'курс pepe']
      : ['pepe history', 'pepe token', 'pepe investment calculator', 'pepe price', 'pepe price'],
    openGraph: buildOg({ url: `${BASE}/${locale}/assets/${SLUG}`, title, description, locale }),
    twitter: buildTwitter({ url: `${BASE}/${locale}/assets/${SLUG}`, title, description, locale }),
    alternates: {
      canonical: `${BASE}/${locale}/assets/${SLUG}`,
      languages: { ru: `${BASE}/ru/assets/${SLUG}`, en: `${BASE}/en/assets/${SLUG}`, 'x-default': `${BASE}/en/assets/${SLUG}` },
    },
  };
}

export default async function PepePage({ params }: Props) {
  const { locale } = await params;
  const isRu = locale === 'ru';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: isRu ? 'Pepe (PEPE): лягушка, дошедшая до миллиарда за три недели' : 'Pepe (PEPE): the frog that reached a billion in three weeks',
    description: isRu ? 'Как PEPE за три недели после тихого запуска в апреле 2023 года дорос до миллиарда долларов капитализации, а в декабре 2024-го поставил рекорд. История и калькулятор.' : 'How PEPE went from a quiet launch in April 2023 to a billion-dollar market cap in three weeks and a record in December 2024. PEPE history and an investment calculator.',
    inLanguage: locale,
    datePublished: '2026-11-03',
    dateModified: ASSET_REVISIONS[SLUG] ?? '2026-11-03',
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
      { '@type': 'ListItem', position: 3, name: 'Pepe (PEPE)', item: `${BASE}/${locale}/assets/${SLUG}` },
    ],
  };

  const historyContent = isRu ? (
    <>
      <h3>Миллиард за три недели</h3>
      <p>
        К началу мая 2023 года <Link href={`/${locale}/glossary/market-cap`}>капитализация</Link> PEPE перевалила за миллиард долларов, а ведь токену не было и месяца. 5 мая торги открыла Binance и тут же предупредила: у токена нет ни полезности, ни механизма, который поддерживал бы цену. В течение часа после объявления курс вырос примерно на 41%.
      </p>

      <h3>Тихий запуск</h3>
      <p>
        Токен появился в сети Ethereum в апреле 2023 года, без предпродажи и без комиссии за переводы. Анонимные создатели отправили 93,1% из 420,69 триллиона токенов в <Link href={`/${locale}/glossary/liquidity-pool`}>пул ликвидности</Link> Uniswap, сожгли токены пула и отказались от контроля над контрактом. Число 420,69 — шутка из двух интернет-мемов, 420 и 69.
      </p>

      <h3>Скандал с общим кошельком</h3>
      <p>
        24 августа 2023 года у общего кошелька команды снизили порог подписей, и около 16 триллионов PEPE ушли на биржи. Оставшийся основатель обвинил трёх бывших участников: по его словам, они вышли из кошелька и удалили свои аккаунты. После этого курс пошёл вниз.
      </p>

      <h3>Рекорд декабря 2024 года</h3>
      <p>
        На волне мемкоинов конца 2024 года PEPE поставил исторический максимум — 0,00002803 доллара 9 декабря, по данным CoinGecko. Как и у Dogecoin в 2021-м, цену здесь двигают внимание и объём торгов, а не продукт.
      </p>
    </>
  ) : (
    <>
      <h3>A quiet launch in April 2023</h3>
      <p>
        PEPE appeared on Ethereum in April 2023 with no presale and no transaction tax. Its anonymous creators sent 93.1% of the 420.69 trillion tokens to a <Link href={`/${locale}/glossary/liquidity-pool`}>liquidity pool</Link> on Uniswap, burned the pool tokens and renounced control of the contract. The figure 420.69 joins two internet number jokes, 420 and 69.
      </p>

      <h3>A billion in three weeks</h3>
      <p>
        In early May 2023 PEPE passed 1 billion dollars in <Link href={`/${locale}/glossary/market-cap`}>market cap</Link>. Binance opened trading on 5 May and warned that the token had no utility or mechanism to sustain its value. The price jumped about 41% within an hour of the announcement.
      </p>

      <h3>The multisig scandal</h3>
      <p>
        On 24 August 2023 the team’s shared wallet lowered its signing threshold, and about 16 trillion PEPE went to exchanges. The remaining founder blamed three former team members who, he said, then left the wallet and deleted their accounts. Holders sold, and the price dropped within hours.
      </p>

      <h3>A record in December 2024</h3>
      <p>
        The memecoin rally of late 2024 took PEPE to its all-time high of 0.00002803 dollars on 9 December 2024, according to CoinGecko. The token has no product behind it, so its price depends on attention and trading volume.
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
        name="Pepe"
        symbol="PEPE"
        icon="🐸"
        coingeckoId="pepe"
        tagline={isRu ? 'Мем с лягушкой, который держится на одном внимании' : 'A frog meme that trades on attention alone'}
        historyTitle={isRu ? 'История Pepe: мем без дорожной карты' : 'Pepe history: a meme without a roadmap'}
        historyContent={historyContent}
        guide={guide}
      />
    </>
  );
}
