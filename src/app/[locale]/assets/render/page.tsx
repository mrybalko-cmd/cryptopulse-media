import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { buildOg, buildTwitter, BASE } from '@/lib/metadata';
import CoinGuideLayout from '@/components/ui/CoinGuideLayout';
import { COIN_GUIDES } from '@/lib/coinGuides';
import { ORGANIZATION_ID } from '@/lib/organizationSchema';

import { ASSET_REVISIONS } from '@/lib/pageRevisions';
type Props = { params: Promise<{ locale: string }> };
const SLUG = 'render';
const guide = COIN_GUIDES[SLUG];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const isRu = locale === 'ru';
  const title = isRu ? 'Render (RENDER): цена, история, калькулятор' : 'Render (RENDER): price, history, calculator';
  const description = isRu
    ? 'Как Render Network от OTOY превратила простаивающие видеокарты в рынок рендеринга, переехала с Ethereum на Solana и сменила тикер. История и калькулятор.'
    : 'How OTOY’s Render Network turned idle graphics cards into a rendering market, moved from Ethereum to Solana and changed its ticker. History and a calculator.';

  return {
    // Absolute: the layout template appends the site name, which adds nothing here.
    title: { absolute: title },
    description,
    keywords: isRu
      ? ['render история', 'render токен', 'render калькулятор', 'render цена', 'курс render']
      : ['render history', 'render token', 'render investment calculator', 'render price', 'render price'],
    openGraph: buildOg({ url: `${BASE}/${locale}/assets/${SLUG}`, title, description, locale }),
    twitter: buildTwitter({ url: `${BASE}/${locale}/assets/${SLUG}`, title, description, locale }),
    alternates: {
      canonical: `${BASE}/${locale}/assets/${SLUG}`,
      languages: { ru: `${BASE}/ru/assets/${SLUG}`, en: `${BASE}/en/assets/${SLUG}`, 'x-default': `${BASE}/en/assets/${SLUG}` },
    },
  };
}

export default async function RenderPage({ params }: Props) {
  const { locale } = await params;
  const isRu = locale === 'ru';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: isRu ? 'Render (RENDER): рынок мощностей видеокарт' : 'Render (RENDER): a market for graphics cards',
    description: isRu ? 'Как Render Network от OTOY превратила простаивающие видеокарты в рынок рендеринга, переехала с Ethereum на Solana и сменила тикер. История и калькулятор.' : 'How OTOY’s Render Network turned idle graphics cards into a rendering market, moved from Ethereum to Solana and changed its ticker. History and a calculator.',
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
      { '@type': 'ListItem', position: 3, name: 'Render (RENDER)', item: `${BASE}/${locale}/assets/${SLUG}` },
    ],
  };

  const historyContent = isRu ? (
    <>
      <h3>Две буквы в тикере</h3>
      <p>
        Если вы видели и RNDR, и RENDER, это один проект. 2 ноября 2023 года сеть переехала с Ethereum на Solana, а токен сменил имя. Старые RNDR меняли на RENDER один к одному через портал фонда, биржи переходили в течение 2024 года.
      </p>

      <h3>Идея из 2009 года</h3>
      <p>
        Придумал Render <strong>Жюль Урбах</strong>, основатель OTOY, компании, которая делает программы для рендеринга. Впервые он описал идею в 2009 году: владельцы простаивающих видеокарт сдают их в аренду художникам и студиям, которым нужно обсчитать картинку или видео, а расплачиваются за это токеном. Похоже на сдачу пустующей квартиры посуточно, только сдаётся вычислительная мощность.
      </p>

      <h3>Токенсейл 2017 года</h3>
      <p>
        Публичная продажа токенов прошла в октябре 2017 года. RNDR был токеном стандарта <Link href={`/${locale}/glossary/erc-20`}>ERC-20</Link> на Ethereum. Минимум за всю историю, 0,0367 доллара, он поставил 16 июня 2020 года, по данным CoinGecko.
      </p>

      <h3>Подъём на волне ИИ</h3>
      <p>
        С бумом искусственного интеллекта видеокарты стали дефицитом, и RENDER пошёл вверх вместе с ними. 17 марта 2024 года он достиг максимума, 13,53 доллара. Выпуск ограничен 644 168 762 токенами, в обращении около 534 миллионов.
      </p>
    </>
  ) : (
    <>
      <h3>An idea from a graphics company</h3>
      <p>
        <strong>Jules Urbach</strong>, founder of the rendering software company OTOY, first described Render in 2009. The idea: people with idle graphics cards rent them out to artists and studios that need to render images and video, and the work is paid for in a token.
      </p>

      <h3>2017: RNDR on Ethereum</h3>
      <p>
        Render held its public token sale in October 2017. The token, RNDR, was an <Link href={`/${locale}/glossary/erc-20`}>ERC-20</Link> token on Ethereum. It sank to its lowest recorded price of 0.0367 dollars on 16 June 2020, by CoinGecko data.
      </p>

      <h3>2023: the move to Solana</h3>
      <p>
        On 2 November 2023 the network moved to Solana, and the token became RENDER. Holders swapped RNDR for RENDER at 1:1 through the foundation’s upgrade portal, and exchanges switched over through 2024.
      </p>

      <h3>The AI wave</h3>
      <p>
        The AI boom made graphics cards scarce, and RENDER reached its all-time high of 13.53 dollars on 17 March 2024. The maximum supply is 644,168,762 tokens, and about 534 million are in circulation.
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
        name="Render"
        symbol="RENDER"
        icon="Ⓡ"
        coingeckoId="render-token"
        tagline={isRu ? 'Биржа свободных мощностей видеокарт' : 'A marketplace for spare GPU power'}
        historyTitle={isRu ? 'История Render: от RNDR на Ethereum к RENDER на Solana' : 'Render history: from RNDR on Ethereum to RENDER on Solana'}
        historyContent={historyContent}
        guide={guide}
      />
    </>
  );
}
