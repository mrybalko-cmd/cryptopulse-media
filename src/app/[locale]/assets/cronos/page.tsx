import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { buildOg, buildTwitter, BASE } from '@/lib/metadata';
import CoinGuideLayout from '@/components/ui/CoinGuideLayout';
import { COIN_GUIDES } from '@/lib/coinGuides';
import { ORGANIZATION_ID } from '@/lib/organizationSchema';

import { ASSET_REVISIONS } from '@/lib/pageRevisions';
type Props = { params: Promise<{ locale: string }> };
const SLUG = 'cronos';
const guide = COIN_GUIDES[SLUG];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const isRu = locale === 'ru';
  const title = isRu ? 'Cronos (CRO): цена, история, калькулятор' : 'Cronos (CRO): price, history, calculator';
  const description = isRu
    ? 'Как гонконгский стартап с крипто-картой стал Crypto.com, сжёг 70 миллиардов CRO в 2021 году и вернул их голосованием в 2025-м. История CRO и калькулятор вложений.'
    : 'How a Hong Kong card startup became Crypto.com, burned 70 billion CRO in 2021 and voted to bring them back in 2025. CRO history and an investment calculator.';

  return {
    // Absolute: the layout template appends the site name, which adds nothing here.
    title: { absolute: title },
    description,
    keywords: isRu
      ? ['cronos история', 'cro токен', 'cronos калькулятор', 'cronos цена', 'курс cro']
      : ['cronos history', 'cro token', 'cronos investment calculator', 'cronos price', 'cro price'],
    openGraph: buildOg({ url: `${BASE}/${locale}/assets/${SLUG}`, title, description, locale }),
    twitter: buildTwitter({ url: `${BASE}/${locale}/assets/${SLUG}`, title, description, locale }),
    alternates: {
      canonical: `${BASE}/${locale}/assets/${SLUG}`,
      languages: { ru: `${BASE}/ru/assets/${SLUG}`, en: `${BASE}/en/assets/${SLUG}`, 'x-default': `${BASE}/en/assets/${SLUG}` },
    },
  };
}

export default async function CronosPage({ params }: Props) {
  const { locale } = await params;
  const isRu = locale === 'ru';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: isRu ? 'Cronos (CRO): от стартапа с картой до своей сети' : 'Cronos (CRO): from a card startup to its own chain',
    description: isRu ? 'Как гонконгский стартап с крипто-картой стал Crypto.com, сжёг 70 миллиардов CRO в 2021 году и вернул их голосованием в 2025-м. История CRO и калькулятор вложений.' : 'How a Hong Kong card startup became Crypto.com, burned 70 billion CRO in 2021 and voted to bring them back in 2025. CRO history and an investment calculator.',
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
      { '@type': 'ListItem', position: 3, name: 'Cronos (CRO)', item: `${BASE}/${locale}/assets/${SLUG}` },
    ],
  };

  const historyContent = isRu ? (
    <>
      <h3>Сожгли 70 миллиардов</h3>
      <p>
        В феврале 2021 года Crypto.com объявила, что сожжёт 70 миллиардов CRO, и назвала это крупнейшим сжиганием токенов в истории. Объяснение было такое: перед запуском Crypto.org Chain сеть нужно децентрализовать. Из 100 миллиардов токенов в игре оставалось меньше трети.
      </p>

      <h3>Стартап покупает домен</h3>
      <p>
        Начиналась компания в 2016 году в Гонконге под именем Monaco и продавала дебетовую крипто-карту; среди основателей был <strong>Крис Маршалек</strong>. В июле 2018 года Monaco купила домен crypto.com у криптографа Мэтта Блейза, который зарегистрировал его ещё в 1993-м, и сменила название. Цену сделки стороны не раскрыли. В ноябре 2018 года появился CRO с выпуском 100 миллиардов.
      </p>

      <h3>Ноябрь 2021: сеть и арена</h3>
      <p>
        8 ноября 2021 года в бета-режиме заработала сеть Cronos, совместимая с <Link href={`/${locale}/glossary/smart-contract`}>смарт-контрактами</Link> Ethereum. Через девять дней Crypto.com на 20 лет купила право назвать своим именем арену в Лос-Анджелесе, где играют «Лейкерс»; по данным прессы, за сумму больше 700 миллионов долларов. Исторический максимум CRO, 0,8915 доллара, пришёлся на 23 ноября 2021 года.
      </p>

      <h3>Сожжённое вернули</h3>
      <p>
        В марте 2025 года валидаторы голосовали за перевыпуск тех самых 70 миллиардов CRO в резервный кошелёк с разблокировкой на несколько лет. Большинство первых голосов было против, но 17 марта решение продавили несколько крупных валидаторов, пишет The Block. Если вы покупали CRO из-за сжигания, обещание 2021 года больше не действует.
      </p>
    </>
  ) : (
    <>
      <h3>Monaco buys a domain</h3>
      <p>
        The company started in Hong Kong in 2016 as Monaco, a startup selling a crypto debit card; <strong>Kris Marszalek</strong> was among its founders. In July 2018 it bought the crypto.com domain from cryptographer Matt Blaze, who had registered it in 1993, and renamed itself Crypto.com; neither side disclosed the price. CRO followed in November 2018 with a supply of 100 billion tokens.
      </p>

      <h3>The largest burn in history</h3>
      <p>
        In February 2021 Crypto.com announced it would burn 70 billion CRO and called it the largest token burn in history. The stated aim was to decentralise the network ahead of the Crypto.org Chain launch.
      </p>

      <h3>November 2021: a chain and an arena</h3>
      <p>
        On 8 November 2021 the Cronos chain went live in beta. It runs <Link href={`/${locale}/glossary/smart-contract`}>smart contracts</Link> written for Ethereum. Nine days later Crypto.com bought the naming rights to the Los Angeles arena for 20 years, at a reported price of over 700 million dollars. CRO set its all-time high of 0.8915 dollars on 23 November 2021. In February 2022 Crypto.com renamed the token Cronos and kept the CRO ticker.
      </p>

      <h3>The burned tokens come back</h3>
      <p>
        In March 2025 validators voted on a proposal to reissue the 70 billion CRO burned in 2021 and place them in a strategic reserve wallet with multi-year vesting. Most early voters rejected it, yet a few large validators carried the proposal on 17 March, The Block reported. Critics said it broke the promise behind the original burn.
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
        name="Cronos"
        symbol="CRO"
        icon="Ⓒ"
        coingeckoId="crypto-com-chain"
        tagline={isRu ? 'Токен биржи, который обзавёлся своей сетью' : 'The exchange token that grew its own chain'}
        historyTitle={isRu ? 'История Cronos: Monaco, Crypto.com и 70 миллиардов токенов' : 'Cronos history: Monaco, Crypto.com and 70 billion tokens'}
        historyContent={historyContent}
        guide={guide}
      />
    </>
  );
}
