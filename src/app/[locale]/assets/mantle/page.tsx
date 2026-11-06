import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { buildOg, buildTwitter, BASE } from '@/lib/metadata';
import CoinGuideLayout from '@/components/ui/CoinGuideLayout';
import { COIN_GUIDES } from '@/lib/coinGuides';
import { ORGANIZATION_ID } from '@/lib/organizationSchema';

import { ASSET_REVISIONS } from '@/lib/pageRevisions';
type Props = { params: Promise<{ locale: string }> };
const SLUG = 'mantle';
const guide = COIN_GUIDES[SLUG];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const isRu = locale === 'ru';
  const title = isRu ? 'Mantle (MNT): цена, история, калькулятор' : 'Mantle (MNT): price, history, calculator';
  const description = isRu
    ? 'Как BitDAO с деньгами Bybit и Питера Тиля превратилась в сеть Mantle и обменяла BIT на MNT один к одному. История MNT и калькулятор вложений.'
    : 'How BitDAO, funded by Bybit and Peter Thiel, became the Mantle network and swapped BIT for MNT one to one. MNT history and an investment calculator.';

  return {
    // Absolute: the layout template appends the site name, which adds nothing here.
    title: { absolute: title },
    description,
    keywords: isRu
      ? ['mantle история', 'mnt токен', 'mantle калькулятор', 'mantle цена', 'курс mnt']
      : ['mantle history', 'mnt token', 'mantle investment calculator', 'mantle price', 'mnt price'],
    openGraph: buildOg({ url: `${BASE}/${locale}/assets/${SLUG}`, title, description, locale }),
    twitter: buildTwitter({ url: `${BASE}/${locale}/assets/${SLUG}`, title, description, locale }),
    alternates: {
      canonical: `${BASE}/${locale}/assets/${SLUG}`,
      languages: { ru: `${BASE}/ru/assets/${SLUG}`, en: `${BASE}/en/assets/${SLUG}`, 'x-default': `${BASE}/en/assets/${SLUG}` },
    },
  };
}

export default async function MantlePage({ params }: Props) {
  const { locale } = await params;
  const isRu = locale === 'ru';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: isRu ? 'Mantle (MNT): от BitDAO до второго уровня Ethereum' : 'Mantle (MNT): from BitDAO to an Ethereum layer 2',
    description: isRu ? 'Как BitDAO с деньгами Bybit и Питера Тиля превратилась в сеть Mantle и обменяла BIT на MNT один к одному. История MNT и калькулятор вложений.' : 'How BitDAO, funded by Bybit and Peter Thiel, became the Mantle network and swapped BIT for MNT one to one. MNT history and an investment calculator.',
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
      { '@type': 'ListItem', position: 3, name: 'Mantle (MNT)', item: `${BASE}/${locale}/assets/${SLUG}` },
    ],
  };

  const historyContent = isRu ? (
    <>
      <h3>Смена вывески</h3>
      <p>
        Токена MNT до лета 2023 года не существовало, его прежнее имя BIT. В мае держатели BitDAO одобрили предложение BIP-21: казна и управление переходили к Mantle, сети, которую DAO до этого финансировала. Следующим голосованием курс обмена установили один BIT за один MNT.
      </p>

      <h3>Казна с процентом от Bybit</h3>
      <p>
        В июне 2021 года BitDAO продала инвесторам токены BIT более чем на 230 миллионов долларов. Среди покупателей были <strong>Питер Тиль</strong>, Founders Fund, Pantera Capital и Dragonfly. Биржа Bybit пообещала отчислять в казну <Link href={`/${locale}/glossary/dao`}>DAO</Link> 2,5 базисного пункта от оборота своих фьючерсов, примерно как отчисление с каждой сделки в общий фонд.
      </p>

      <h3>Запуск в Париже</h3>
      <p>
        Основную сеть Mantle запустила 17 июля 2023 года на конференции EthCC в Париже и тогда же объявила фонд экосистемы на 200 миллионов долларов. Это <Link href={`/${locale}/glossary/layer-2`}>второй уровень</Link> Ethereum: транзакции выполняются в Mantle, а итоговые расчёты записываются в Ethereum. Комиссию вы платите в MNT.
      </p>

      <h3>От дна до рекорда</h3>
      <p>
        Минимум MNT, 0,308 доллара, пришёлся на 17 октября 2023 года (данные CoinGecko). В сентябре 2025-го Bybit открыла 21 торговую пару с MNT и скидки на комиссии, и токен ушёл выше прежних пиков. 8 октября 2025 года он стоил <strong>2,86 доллара</strong>, а затем отдал большую часть роста.
      </p>
    </>
  ) : (
    <>
      <h3>BitDAO and the Bybit pledge</h3>
      <p>
        In June 2021 BitDAO sold more than 230 million dollars of its BIT governance tokens to investors including <strong>Peter Thiel</strong>, Founders Fund, Pantera Capital and Dragonfly. The exchange Bybit pledged 2.5 basis points of its futures trading volume to the <Link href={`/${locale}/glossary/dao`}>DAO</Link> treasury on top of the token sale.
      </p>

      <h3>One brand, one token</h3>
      <p>
        In May 2023 BIT holders approved proposal BIP-21, which folded BitDAO’s governance and treasury into Mantle, a network the DAO had been funding. The token took the name MNT, and a follow-up vote set the conversion at one BIT for one MNT.
      </p>

      <h3>July 2023: the network goes live</h3>
      <p>
        Mantle launched its mainnet on 17 July 2023 at EthCC in Paris, alongside a 200 million dollar ecosystem fund. It is a <Link href={`/${locale}/glossary/layer-2`}>layer 2</Link> on top of Ethereum: transactions run on Mantle and settle on Ethereum, and you pay fees in MNT.
      </p>

      <h3>The 2025 record</h3>
      <p>
        MNT spent its first months near the bottom; on 17 October 2023 it fell to 0.308 dollars, its all-time low on CoinGecko. In September 2025 Bybit added 21 MNT trading pairs and fee incentives, and the token climbed past its old highs. It peaked at <strong>2.86 dollars</strong> on 8 October 2025, then gave most of the gain back.
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
        name="Mantle"
        symbol="MNT"
        icon="Ⓜ"
        coingeckoId="mantle"
        tagline={isRu ? 'Второй уровень Ethereum, выросший из DAO биржи Bybit' : 'An Ethereum layer 2 that started as an exchange-backed DAO'}
        historyTitle={isRu ? 'История Mantle: DAO, которая построила свою сеть' : 'Mantle history: a DAO that built its own network'}
        historyContent={historyContent}
        guide={guide}
      />
    </>
  );
}
