import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { buildOg, buildTwitter, BASE } from '@/lib/metadata';
import CoinGuideLayout from '@/components/ui/CoinGuideLayout';
import { COIN_GUIDES } from '@/lib/coinGuides';
import { ORGANIZATION_ID } from '@/lib/organizationSchema';

import { ASSET_REVISIONS } from '@/lib/pageRevisions';
type Props = { params: Promise<{ locale: string }> };
const SLUG = 'algorand';
const guide = COIN_GUIDES[SLUG];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const isRu = locale === 'ru';
  const title = isRu ? 'Algorand (ALGO): цена, история, калькулятор' : 'Algorand (ALGO): price, history, calculator';
  const description = isRu
    ? 'Как профессор MIT Сильвио Микали построил Algorand, почему ALGO поставил рекорд в первые дни торгов и при чём тут FIFA. История и калькулятор вложений в ALGO.'
    : 'How MIT professor Silvio Micali built Algorand, why ALGO peaked on its first day and what the FIFA deal meant. History and an ALGO investment calculator.';

  return {
    // Absolute: the layout template appends the site name, which adds nothing here.
    title: { absolute: title },
    description,
    keywords: isRu
      ? ['algorand история', 'algo токен', 'algorand калькулятор', 'algorand цена', 'курс algo']
      : ['algorand history', 'algo token', 'algorand investment calculator', 'algorand price', 'algo price'],
    openGraph: buildOg({ url: `${BASE}/${locale}/assets/${SLUG}`, title, description, locale }),
    twitter: buildTwitter({ url: `${BASE}/${locale}/assets/${SLUG}`, title, description, locale }),
    alternates: {
      canonical: `${BASE}/${locale}/assets/${SLUG}`,
      languages: { ru: `${BASE}/ru/assets/${SLUG}`, en: `${BASE}/en/assets/${SLUG}`, 'x-default': `${BASE}/en/assets/${SLUG}` },
    },
  };
}

export default async function AlgorandPage({ params }: Props) {
  const { locale } = await params;
  const isRu = locale === 'ru';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: isRu ? 'Algorand (ALGO): блокчейн профессора криптографии' : 'Algorand (ALGO): a professor’s blockchain',
    description: isRu ? 'Как профессор MIT Сильвио Микали построил Algorand, почему ALGO поставил рекорд в первые дни торгов и при чём тут FIFA. История и калькулятор вложений в ALGO.' : 'How MIT professor Silvio Micali built Algorand, why ALGO peaked on its first day and what the FIFA deal meant. History and an ALGO investment calculator.',
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
      { '@type': 'ListItem', position: 3, name: 'Algorand (ALGO)', item: `${BASE}/${locale}/assets/${SLUG}` },
    ],
  };

  const historyContent = isRu ? (
    <>
      <h3>Рекорд в первую неделю</h3>
      <p>
        Свой исторический максимум ALGO поставил почти сразу: 20 июня 2019 года, по данным CoinGecko, он стоил 3,56 доллара. Основная сеть заработала в том же месяце, а на голландском аукционе CoinList 25 миллионов ALGO ушли по единой цене 2,40 доллара, это больше 60 миллионов долларов, по данным CoinDesk. За следующие три месяца монета потеряла 94% стоимости, писал Decrypt.
      </p>

      <h3>Профессор с премией Тьюринга</h3>
      <p>
        <strong>Сильвио Микали</strong>, профессор MIT, получил премию Тьюринга в 2012 году, её называют Нобелевской премией в информатике. В 2017-м он основал Algorand. Его схема, чистый <Link href={`/${locale}/glossary/proof-of-stake`}>proof of stake</Link>, выбирает проверяющих для каждого блока случайно среди всех держателей, с учётом их доли. Заранее неизвестно, кого выберут, поэтому атаковать их трудно.
      </p>

      <h3>FIFA</h3>
      <p>
        В мае 2022 года FIFA объявила Algorand своей официальной блокчейн-платформой: компания стала спонсором чемпионата мира в Катаре и женского чемпионата мира 2023 года. Цену первой недели ALGO так и не вернул: даже на подъёме 2021 года, 1 ноября, он закрылся на Binance на 1,83 доллара.
      </p>

      <h3>Десять миллиардов</h3>
      <p>
        Выпуск ограничен 10 миллиардами ALGO, в обращении около 9,08 миллиарда. В июле 2026 года цена дошла до минимума, 0,0757 доллара, это в 47 раз ниже рекорда 2019 года.
      </p>
    </>
  ) : (
    <>
      <h3>A professor with a Turing Award</h3>
      <p>
        <strong>Silvio Micali</strong>, an MIT professor, won the Turing Award in 2012 for his work in cryptography. In 2017 he founded Algorand. His design, pure <Link href={`/${locale}/glossary/proof-of-stake`}>proof of stake</Link>, picks the validators for each block at random from all token holders, weighted by stake. No one knows in advance who will be chosen, which makes it hard to attack them.
      </p>

      <h3>June 2019: a sale and a peak</h3>
      <p>
        The main network launched in June 2019. At the same time Algorand sold 25 million ALGO in a Dutch auction on CoinList at a single price of 2.40 dollars, raising over 60 million dollars, according to CoinDesk. ALGO set its all-time high of 3.56 dollars on 20 June 2019, by CoinGecko data, and lost 94% of its value in the first three months, as Decrypt reported.
      </p>

      <h3>FIFA and the 2021 rally</h3>
      <p>
        In May 2022 FIFA named Algorand its official blockchain platform, with sponsorship of the Qatar World Cup and the 2023 Women’s World Cup. On 1 November 2021, during that year’s rally, ALGO closed at 1.83 dollars on Binance, about half its launch-week high.
      </p>

      <h3>Ten billion tokens</h3>
      <p>
        The supply is capped at 10 billion ALGO, and about 9.08 billion are in circulation. In July 2026 ALGO fell to its lowest recorded price, 0.0757 dollars.
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
        name="Algorand"
        symbol="ALGO"
        icon="Ⓐ"
        coingeckoId="algorand"
        tagline={isRu ? 'Блокчейн от лауреата премии Тьюринга' : 'A blockchain designed by a Turing Award winner'}
        historyTitle={isRu ? 'История Algorand: сначала криптография, потом цена' : 'Algorand history: cryptography first, price later'}
        historyContent={historyContent}
        guide={guide}
      />
    </>
  );
}
