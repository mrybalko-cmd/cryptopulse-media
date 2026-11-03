import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { buildOg, buildTwitter, BASE } from '@/lib/metadata';
import CoinGuideLayout from '@/components/ui/CoinGuideLayout';
import { COIN_GUIDES } from '@/lib/coinGuides';
import { ORGANIZATION_ID } from '@/lib/organizationSchema';

type Props = { params: Promise<{ locale: string }> };
const SLUG = 'filecoin';
const guide = COIN_GUIDES[SLUG];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const isRu = locale === 'ru';
  const title = isRu ? 'Filecoin (FIL): цена, история, калькулятор' : 'Filecoin (FIL): price, history, calculator';
  const description = isRu
    ? 'Как Filecoin прошёл путь от статьи 2014 года от создателей IPFS до токенсейла на 205 миллионов долларов и запуска в 2020-м. История FIL и калькулятор.'
    : 'How Filecoin went from a 2014 paper by IPFS creator Protocol Labs to a 205 million dollar token sale and a 2020 launch. FIL history and a calculator.';

  return {
    // Absolute: the layout template appends the site name, which adds nothing here.
    title: { absolute: title },
    description,
    keywords: isRu
      ? ['filecoin история', 'fil токен', 'filecoin калькулятор', 'filecoin цена', 'курс fil']
      : ['filecoin history', 'fil token', 'filecoin investment calculator', 'filecoin price', 'fil price'],
    openGraph: buildOg({ url: `${BASE}/${locale}/assets/${SLUG}`, title, description, locale }),
    twitter: buildTwitter({ url: `${BASE}/${locale}/assets/${SLUG}`, title, description, locale }),
    alternates: {
      canonical: `${BASE}/${locale}/assets/${SLUG}`,
      languages: { ru: `${BASE}/ru/assets/${SLUG}`, en: `${BASE}/en/assets/${SLUG}`, 'x-default': `${BASE}/en/assets/${SLUG}` },
    },
  };
}

export default async function FilecoinPage({ params }: Props) {
  const { locale } = await params;
  const isRu = locale === 'ru';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: isRu ? 'Filecoin (FIL): рынок свободного места на дисках' : 'Filecoin (FIL): a market for disk space',
    description: isRu ? 'Как Filecoin прошёл путь от статьи 2014 года от создателей IPFS до токенсейла на 205 миллионов долларов и запуска в 2020-м. История FIL и калькулятор.' : 'How Filecoin went from a 2014 paper by IPFS creator Protocol Labs to a 205 million dollar token sale and a 2020 launch. FIL history and a calculator.',
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
      { '@type': 'ListItem', position: 3, name: 'Filecoin (FIL)', item: `${BASE}/${locale}/assets/${SLUG}` },
    ],
  };

  const historyContent = isRu ? (
    <>
      <h3>Один из крупнейших сборов 2017 года</h3>
      <p>
        В августе 2017 года Protocol Labs выпустила полный <Link href={`/${locale}/glossary/whitepaper`}>whitepaper</Link> Filecoin и собрала на продаже токенов больше 205 миллионов долларов, по данным The Block. Для <Link href={`/${locale}/glossary/ico`}>ICO</Link> сумма огромная, а сеть заработала только через три года.
      </p>

      <h3>Статья от создателей IPFS</h3>
      <p>
        <strong>Хуан Бенет</strong> основал Protocol Labs в мае 2014 года, это компания, которая стоит за файловым протоколом IPFS. Первая версия Filecoin вышла 15 июля того же года. Идея: у кого есть свободное место на диске, хранит чужие файлы и получает за это токен. По сути, облачное хранилище, где вместо одной компании тысячи независимых владельцев дисков.
      </p>

      <h3>Запуск в 2020 году</h3>
      <p>
        Основная сеть заработала 15 октября 2020 года на блоке 148 888. Провайдеры хранения, местные майнеры, вносят FIL в залог и каждые 24 часа доказывают, что данные на месте. Proof of Replication подтверждает, что копия существует, Proof of Spacetime — что она хранилась всё это время.
      </p>

      <h3>От 236 долларов до меньше одного</h3>
      <p>
        1 апреля 2021 года, меньше чем через полгода после запуска, FIL стоил 236,84 доллара, это его исторический максимум, по данным CoinGecko. Потом цена несколько лет снижалась и 18 августа 2026 года дошла до минимума, 0,6124 доллара. В обращении около 839 миллионов FIL.
      </p>
    </>
  ) : (
    <>
      <h3>A paper from the IPFS team</h3>
      <p>
        <strong>Juan Benet</strong> founded Protocol Labs in May 2014, the company behind the IPFS file protocol. On 15 July 2014 it published the first version of Filecoin. The idea: anyone with spare disk space can store other people’s files and get paid in a token.
      </p>

      <h3>2017: over 205 million dollars</h3>
      <p>
        Protocol Labs published the full <Link href={`/${locale}/glossary/whitepaper`}>whitepaper</Link> in August 2017 and raised over 205 million dollars in an <Link href={`/${locale}/glossary/ico`}>ICO</Link>, according to The Block. The network itself took three more years.
      </p>

      <h3>October 2020: the launch</h3>
      <p>
        The mainnet went live on 15 October 2020 at block 148,888. Storage providers, Filecoin’s miners, lock FIL as collateral and prove every 24 hours that they still hold the data. Proof of Replication shows a copy exists; Proof of Spacetime shows it stayed there over time.
      </p>

      <h3>From 236 dollars to under one</h3>
      <p>
        FIL set its all-time high of 236.84 dollars on 1 April 2021, by CoinGecko data, less than six months after launch. It then fell for years and hit its lowest recorded price, 0.6124 dollars, on 18 August 2026. About 839 million FIL are in circulation.
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
        name="Filecoin"
        symbol="FIL"
        icon="Ⓕ"
        coingeckoId="filecoin"
        tagline={isRu ? 'Сеть хранения, где платят за чужие файлы на вашем диске' : 'A storage network where providers earn for keeping files'}
        historyTitle={isRu ? 'История Filecoin: шесть лет от статьи до сети' : 'Filecoin history: six years from paper to network'}
        historyContent={historyContent}
        guide={guide}
      />
    </>
  );
}
