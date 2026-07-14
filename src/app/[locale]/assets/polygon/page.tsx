import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { buildOg, BASE } from '@/lib/metadata';
import CoinGuideLayout from '@/components/ui/CoinGuideLayout';
import { COIN_GUIDES } from '@/lib/coinGuides';

type Props = { params: Promise<{ locale: string }> };
const SLUG = 'polygon';
const guide = COIN_GUIDES[SLUG];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const isRu = locale === 'ru';
  const title = isRu ? 'Polygon (POL) — История, цена и калькулятор инвестиций' : 'Polygon (POL) — History, Price & Investment Calculator';
  const description = isRu
    ? 'История Polygon: от Matic Network до ребрендинга в POL, рост экосистемы масштабирования Ethereum. Калькулятор инвестиций в POL/MATIC.'
    : 'The history of Polygon: from Matic Network to the POL rebrand, and the growth of its Ethereum scaling ecosystem. POL/MATIC investment calculator.';

  return {
    title,
    description,
    keywords: isRu
      ? ['polygon история', 'matic что это', 'pol токен', 'polygon калькулятор']
      : ['polygon history', 'what is matic', 'pol token', 'polygon investment calculator'],
    openGraph: buildOg({ url: `${BASE}/${locale}/assets/${SLUG}`, title, description, locale }),
    alternates: {
      canonical: `${BASE}/${locale}/assets/${SLUG}`,
      languages: { ru: `${BASE}/ru/assets/${SLUG}`, en: `${BASE}/en/assets/${SLUG}` },
    },
  };
}

export default async function PolygonPage({ params }: Props) {
  const { locale } = await params;
  const isRu = locale === 'ru';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: isRu ? 'Polygon (POL): история сети масштабирования Ethereum' : 'Polygon (POL): History of the Ethereum Scaling Network',
    description: isRu ? 'История Polygon от Matic Network до POL.' : 'The history of Polygon from Matic Network to POL.',
    inLanguage: locale,
    datePublished: '2026-07-14',
    dateModified: new Date().toISOString().slice(0, 10),
    author: { '@type': 'Organization', name: 'CryptoPulse.media', url: BASE },
    publisher: { '@type': 'Organization', name: 'CryptoPulse.media', url: BASE },
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
      { '@type': 'ListItem', position: 3, name: 'Polygon (POL)', item: `${BASE}/${locale}/assets/${SLUG}` },
    ],
  };

  const glossaryBase = `/${locale}/glossary`;

  const historyContent = isRu ? (
    <>
      <h3>2017: Matic Network — решение проблемы медленного и дорогого Ethereum</h3>
      <p>
        Polygon начинался в октябре 2017 года как <strong>Matic Network</strong> — проект трёх индийских
        разработчиков, Джаянти Канани, Сандипа Наилвала и Анурага Арджуна. Идея была простой: Ethereum
        в те годы уже страдал от медленных и дорогих транзакций, и Matic предложил решение второго
        уровня (<Link href={`${glossaryBase}#blockchain`}>сайдчейн</Link>), которое работает поверх
        Ethereum, обрабатывая транзакции быстрее и намного дешевле.
      </p>
      <p>
        В 2019 году Matic провёл token-сейл на Binance Launchpad по цене около $0,0026 за токен — одна из
        первых площадок такого рода.
      </p>

      <h3>2021: Ребрендинг в Polygon и взрывной рост</h3>
      <p>
        В феврале 2021 года проект переименовался в <strong>Polygon</strong>, отражая более широкие
        амбиции — не просто один сайдчейн, а целая экосистема инструментов для масштабирования Ethereum.
        2021 год стал переломным: на фоне бума NFT и DeFi токен MATIC вырос более чем на 14 000% за год,
        достигнув исторического максимума около <strong>$2,92</strong> в конце декабря 2021 года.
      </p>
      <p>
        Крупные бренды начали выбирать Polygon именно из-за низких комиссий — Starbucks, Reddit и Nike
        запускали свои Web3-проекты на этой сети.
      </p>

      <h3>2024: Переход от MATIC к POL</h3>
      <p>
        В рамках обновления «Polygon 2.0» команда объявила о переходе с токена MATIC на новый токен{' '}
        <strong>POL</strong>, с обменом 1:1. Цель — сделать POL базовым токеном не для одной сети, а для
        целой связанной экосистемы блокчейнов Polygon через технологию AggLayer.
      </p>
    </>
  ) : (
    <>
      <h3>2017: Matic Network — a Fix for Slow, Expensive Ethereum</h3>
      <p>
        Polygon began in October 2017 as <strong>Matic Network</strong>, a project by three Indian
        developers — Jaynti Kanani, Sandeep Nailwal, and Anurag Arjun. The idea was simple: Ethereum was
        already suffering from slow, expensive transactions, and Matic proposed a{' '}
        <Link href={`${glossaryBase}#blockchain`}>sidechain</Link> Layer 2 solution that runs on top of
        Ethereum, processing transactions faster and far more cheaply.
      </p>
      <p>
        In 2019, Matic ran a token sale on Binance Launchpad at around $0.0026 per token — one of the
        earliest projects to launch that way.
      </p>

      <h3>2021: Rebranding to Polygon and Explosive Growth</h3>
      <p>
        In February 2021, the project rebranded as <strong>Polygon</strong> to reflect broader ambitions —
        not just one sidechain, but a whole ecosystem of Ethereum scaling tools. 2021 was a turning point:
        amid the NFT and DeFi boom, MATIC gained over 14,000% for the year, reaching an all-time high of
        roughly <strong>$2.92</strong> in late December 2021.
      </p>
      <p>
        Major brands began choosing Polygon specifically for its low fees — Starbucks, Reddit, and Nike all
        launched Web3 projects on the network.
      </p>

      <h3>2024: The Move from MATIC to POL</h3>
      <p>
        As part of the "Polygon 2.0" upgrade, the team announced a migration from the MATIC token to a new{' '}
        <strong>POL</strong> token, swapped 1:1. The goal is to make POL the base token not for a single
        chain, but for Polygon's entire connected ecosystem of blockchains via its AggLayer technology.
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
        name="Polygon"
        symbol="POL"
        icon="🟣"
        coingeckoId="polygon-ecosystem-token"
        tagline={isRu ? 'Сеть для масштабирования Ethereum, недавно перешедшая с MATIC на POL' : 'Ethereum scaling network that recently migrated from MATIC to POL'}
        historyTitle={isRu ? 'История Polygon: от Matic Network до POL' : 'Polygon History: From Matic Network to POL'}
        historyContent={historyContent}
        guide={guide}
      />
    </>
  );
}
