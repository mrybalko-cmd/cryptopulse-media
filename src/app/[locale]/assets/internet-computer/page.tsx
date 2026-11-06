import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { buildOg, buildTwitter, BASE } from '@/lib/metadata';
import CoinGuideLayout from '@/components/ui/CoinGuideLayout';
import { COIN_GUIDES } from '@/lib/coinGuides';
import { ORGANIZATION_ID } from '@/lib/organizationSchema';

import { ASSET_REVISIONS } from '@/lib/pageRevisions';
type Props = { params: Promise<{ locale: string }> };
const SLUG = 'internet-computer';
const guide = COIN_GUIDES[SLUG];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const isRu = locale === 'ru';
  const title = isRu ? 'Internet Computer (ICP): цена, история, калькулятор' : 'Internet Computer (ICP): price, history, calculator';
  const description = isRu
    ? 'Как Internet Computer от DFINITY стартовал с сотен долларов и потерял 95% за два месяца. Канистры, Network Nervous System и калькулятор ICP.'
    : 'How DFINITY’s Internet Computer opened at hundreds of dollars and lost 95% in two months. Canisters, the Network Nervous System and an ICP calculator.';

  return {
    // Absolute: the layout template appends the site name, which adds nothing here.
    title: { absolute: title },
    description,
    keywords: isRu
      ? ['internet computer история', 'icp токен', 'internet computer калькулятор', 'internet computer цена', 'курс icp']
      : ['internet computer history', 'icp token', 'internet computer investment calculator', 'internet computer price', 'icp price'],
    openGraph: buildOg({ url: `${BASE}/${locale}/assets/${SLUG}`, title, description, locale }),
    twitter: buildTwitter({ url: `${BASE}/${locale}/assets/${SLUG}`, title, description, locale }),
    alternates: {
      canonical: `${BASE}/${locale}/assets/${SLUG}`,
      languages: { ru: `${BASE}/ru/assets/${SLUG}`, en: `${BASE}/en/assets/${SLUG}`, 'x-default': `${BASE}/en/assets/${SLUG}` },
    },
  };
}

export default async function InternetComputerPage({ params }: Props) {
  const { locale } = await params;
  const isRu = locale === 'ru';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: isRu ? 'Internet Computer (ICP): старт за 700 долларов и падение на 95%' : 'Internet Computer (ICP): a launch at 700 dollars and a 95% fall',
    description: isRu ? 'Как Internet Computer от DFINITY стартовал с сотен долларов и потерял 95% за два месяца. Канистры, Network Nervous System и калькулятор ICP.' : 'How DFINITY’s Internet Computer opened at hundreds of dollars and lost 95% in two months. Canisters, the Network Nervous System and an ICP calculator.',
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
      { '@type': 'ListItem', position: 3, name: 'Internet Computer (ICP)', item: `${BASE}/${locale}/assets/${SLUG}` },
    ],
  };

  const historyContent = isRu ? (
    <>
      <h3>Самый громкий старт 2021 года</h3>
      <p>
        10 мая 2021 года DFINITY открыла исходный код сети и выпустила ICP на рынок, торги сразу начались на Coinbase, Binance и других биржах. Ненадолго ICP вошёл в первую тройку криптовалют по капитализации. Исторический максимум, <strong>700,65 доллара</strong>, по CoinGecko приходится на тот же день.
      </p>

      <h3>Минус 95% за два месяца</h3>
      <p>
        К 24 июня 2021 года ICP стоил около 35 долларов, писал CoinDesk. Аналитическая компания Arkham выпустила отчёт: по её версии, связанные с проектом адреса отправляли на биржи крупные суммы ICP. В DFINITY отчёт назвали «нелепым», а инвесторы подали коллективный иск, утверждая, что ICP — незарегистрированная ценная бумага.
      </p>

      <h3>Цюрихская лаборатория</h3>
      <p>
        Некоммерческий исследовательский фонд DFINITY <strong>Доминик Уильямс</strong> основал в 2016 году в Цюрихе. Он задумал блокчейн, который хранит не только платежи, но и целые приложения вместе с сайтами. До запуска команда работала пять лет.
      </p>

      <h3>Канистры и нейроны</h3>
      <p>
        Приложения в ICP работают как <Link href={`/${locale}/glossary/smart-contract`}>смарт-контракты</Link>, которые здесь называются канистрами: они сами хранят данные и отдают веб-страницы. Сетью управляет Network Nervous System. Держатели замораживают ICP в «нейронах», голосуют за обновления и получают награду, как при <Link href={`/${locale}/glossary/staking`}>стейкинге</Link>. Цена при этом продолжала падать и 1 августа 2026 года дошла до минимума в 2 доллара.
      </p>
    </>
  ) : (
    <>
      <h3>A lab in Zurich</h3>
      <p>
        <strong>Dominic Williams</strong> founded the DFINITY Foundation in 2016, a non-profit research organisation based in Zurich. He wanted a blockchain that runs entire applications, websites included, instead of only recording payments. The team spent five years on development before launch.
      </p>

      <h3>May 2021: the launch</h3>
      <p>
        DFINITY made the network’s source code and the ICP token public on 10 May 2021, and Coinbase, Binance and other exchanges listed it on day one. By market cap ICP briefly ranked among the top three crypto assets. Its all-time high of <strong>700.65 dollars</strong> dates to that same day on CoinGecko.
      </p>

      <h3>Down 95% in two months</h3>
      <p>
        By 24 June 2021 ICP traded near 35 dollars, CoinDesk reported. Analytics firm Arkham published a report suggesting insiders had sent large amounts of ICP to exchanges; DFINITY called it “ludicrous”, and investors filed a class-action lawsuit claiming ICP was an unregistered security.
      </p>

      <h3>Canisters and neurons</h3>
      <p>
        Applications on ICP run as <Link href={`/${locale}/glossary/smart-contract`}>smart contracts</Link> called canisters, which store data and serve web pages themselves. The Network Nervous System governs the network: holders lock ICP into “neurons”, vote on upgrades and earn rewards much like <Link href={`/${locale}/glossary/staking`}>staking</Link>. The price kept sliding, and on 1 August 2026 it reached an all-time low of 2.00 dollars.
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
        name="Internet Computer"
        symbol="ICP"
        icon="∞"
        coingeckoId="internet-computer"
        tagline={isRu ? 'Блокчейн, на котором живут целые сайты' : 'A blockchain that wants to host whole websites'}
        historyTitle={isRu ? 'История Internet Computer: от Цюриха до обвала' : 'Internet Computer history: from Zurich to the crash'}
        historyContent={historyContent}
        guide={guide}
      />
    </>
  );
}
