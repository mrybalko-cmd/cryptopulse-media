import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { buildOg, buildTwitter, BASE } from '@/lib/metadata';
import CoinGuideLayout from '@/components/ui/CoinGuideLayout';
import { COIN_GUIDES } from '@/lib/coinGuides';
import { ORGANIZATION_ID } from '@/lib/organizationSchema';

import { ASSET_REVISIONS } from '@/lib/pageRevisions';
type Props = { params: Promise<{ locale: string }> };
const SLUG = 'kaspa';
const guide = COIN_GUIDES[SLUG];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const isRu = locale === 'ru';
  const title = isRu ? 'Kaspa (KAS): цена, история, калькулятор' : 'Kaspa (KAS): price, history, calculator';
  const description = isRu
    ? 'Как Kaspa запустилась без премайна и инвесторов и заменила цепочку блоков на blockDAG. Ежемесячные халвинги, обновление Crescendo и калькулятор KAS.'
    : 'How Kaspa launched without a premine or investors and replaced the single chain of blocks with a blockDAG. Monthly halvings, the Crescendo upgrade and a KAS calculator.';

  return {
    // Absolute: the layout template appends the site name, which adds nothing here.
    title: { absolute: title },
    description,
    keywords: isRu
      ? ['kaspa история', 'kas токен', 'kaspa калькулятор', 'kaspa цена', 'курс kas']
      : ['kaspa history', 'kas token', 'kaspa investment calculator', 'kaspa price', 'kas price'],
    openGraph: buildOg({ url: `${BASE}/${locale}/assets/${SLUG}`, title, description, locale }),
    twitter: buildTwitter({ url: `${BASE}/${locale}/assets/${SLUG}`, title, description, locale }),
    alternates: {
      canonical: `${BASE}/${locale}/assets/${SLUG}`,
      languages: { ru: `${BASE}/ru/assets/${SLUG}`, en: `${BASE}/en/assets/${SLUG}`, 'x-default': `${BASE}/en/assets/${SLUG}` },
    },
  };
}

export default async function KaspaPage({ params }: Props) {
  const { locale } = await params;
  const isRu = locale === 'ru';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: isRu ? 'Kaspa (KAS): майнинговая монета без премайна' : 'Kaspa (KAS): a proof-of-work coin without a premine',
    description: isRu ? 'Как Kaspa запустилась без премайна и инвесторов и заменила цепочку блоков на blockDAG. Ежемесячные халвинги, обновление Crescendo и калькулятор KAS.' : 'How Kaspa launched without a premine or investors and replaced the single chain of blocks with a blockDAG. Monthly halvings, the Crescendo upgrade and a KAS calculator.',
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
      { '@type': 'ListItem', position: 3, name: 'Kaspa (KAS)', item: `${BASE}/${locale}/assets/${SLUG}` },
    ],
  };

  const historyContent = isRu ? (
    <>
      <h3>Честный запуск</h3>
      <p>
        Сеть Kaspa заработала 7 ноября 2021 года без премайна, без ICO и без доли для основателей или инвесторов. Каждую монету KAS добыли майнеры. Разработку начала компания DAGLabs, которую финансировал Polychain Capital, а потом проект перешёл к сообществу.
      </p>

      <h3>Граф вместо цепочки</h3>
      <p>
        В основе Kaspa протокол GHOSTDAG, который придумали <strong>Йонатан Сомполинский</strong> и Авив Зохар из Еврейского университета в Иерусалиме. В биткоине из двух одновременно найденных блоков в истории остаётся один. Kaspa сохраняет оба и выстраивает их в граф, blockDAG, поэтому блоки могут появляться намного чаще.
      </p>

      <h3>Халвинг каждый месяц</h3>
      <p>
        С мая 2022 года награда за блок каждый месяц уменьшается примерно на 5,6%, и за год набегает полноценный <Link href={`/${locale}/glossary/halving`}>халвинг</Link>. Шаг взят из музыки: так соотносятся соседние полутона в темперированном строе. Общий выпуск приблизится к 28,7 миллиарда KAS. Максимум цены, <strong>0,2074 доллара</strong>, пришёлся на 31 июля 2024 года (CoinGecko).
      </p>

      <h3>Crescendo</h3>
      <p>
        До 5 мая 2025 года Kaspa выпускала один блок в секунду. Обновление Crescendo вышло после переписывания узла на Rust и подняло скорость до десяти блоков в секунду. Награду за блок разработчики урезали вдесятеро, чтобы график эмиссии не изменился.
      </p>
    </>
  ) : (
    <>
      <h3>An idea from university research</h3>
      <p>
        Kaspa grew out of research by <strong>Yonatan Sompolinsky</strong> and Aviv Zohar at the Hebrew University of Jerusalem. Their GHOSTDAG protocol keeps blocks mined at the same moment and orders them in a graph, a blockDAG. That lets the network produce blocks far more often than Bitcoin.
      </p>

      <h3>November 2021: a fair launch</h3>
      <p>
        The network launched on 7 November 2021 with no premine, no ICO and no coins set aside for founders or investors. Miners produced every KAS in existence. Development started at DAGLabs, a company backed by Polychain Capital, and then passed to the community.
      </p>

      <h3>A halving every month</h3>
      <p>
        Since May 2022 Kaspa has followed a chromatic schedule: each month the block reward shrinks by a factor of the twelfth root of one half, about 5.6%, so over a year it <Link href={`/${locale}/glossary/halving`}>halves</Link>. Total supply should approach about 28.7 billion KAS. The all-time high of <strong>0.2074 dollars</strong> came on 31 July 2024, per CoinGecko.
      </p>

      <h3>Crescendo: ten blocks per second</h3>
      <p>
        Kaspa ran at one block per second until 5 May 2025. The Crescendo upgrade, which followed a rewrite of the node in Rust, raised the rate to ten blocks per second. Developers cut the per-block reward tenfold to keep issuance on the same curve.
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
        name="Kaspa"
        symbol="KAS"
        icon="Ⓚ"
        coingeckoId="kaspa"
        tagline={isRu ? 'Майнинг и десять блоков в секунду' : 'Proof of work with ten blocks every second'}
        historyTitle={isRu ? 'История Kaspa: граф блоков вместо цепочки' : 'Kaspa history: a blockDAG instead of a chain'}
        historyContent={historyContent}
        guide={guide}
      />
    </>
  );
}
