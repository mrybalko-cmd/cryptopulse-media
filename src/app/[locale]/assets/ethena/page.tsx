import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { buildOg, buildTwitter, BASE } from '@/lib/metadata';
import CoinGuideLayout from '@/components/ui/CoinGuideLayout';
import { COIN_GUIDES } from '@/lib/coinGuides';
import { ORGANIZATION_ID } from '@/lib/organizationSchema';

type Props = { params: Promise<{ locale: string }> };
const SLUG = 'ethena';
const guide = COIN_GUIDES[SLUG];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const isRu = locale === 'ru';
  const title = isRu ? 'Ethena (ENA): цена, история, калькулятор' : 'Ethena (ENA): price, history, calculator';
  const description = isRu
    ? 'Как Ethena построила USDe, доллар на крипте и коротких фьючерсах, довела его почти до 15 миллиардов и раздала 750 миллионов ENA. История и калькулятор вложений.'
    : 'How Ethena built USDe, a dollar backed by crypto and short futures, grew it to almost 15 billion dollars and handed out 750 million ENA. History and a calculator.';

  return {
    // Absolute: the layout template appends the site name, which adds nothing here.
    title: { absolute: title },
    description,
    keywords: isRu
      ? ['ethena история', 'ena токен', 'ethena калькулятор', 'ethena цена', 'курс ena']
      : ['ethena history', 'ena token', 'ethena investment calculator', 'ethena price', 'ena price'],
    openGraph: buildOg({ url: `${BASE}/${locale}/assets/${SLUG}`, title, description, locale }),
    twitter: buildTwitter({ url: `${BASE}/${locale}/assets/${SLUG}`, title, description, locale }),
    alternates: {
      canonical: `${BASE}/${locale}/assets/${SLUG}`,
      languages: { ru: `${BASE}/ru/assets/${SLUG}`, en: `${BASE}/en/assets/${SLUG}`, 'x-default': `${BASE}/en/assets/${SLUG}` },
    },
  };
}

export default async function EthenaPage({ params }: Props) {
  const { locale } = await params;
  const isRu = locale === 'ru';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: isRu ? 'Ethena (ENA): доллар, собранный из фьючерсов' : 'Ethena (ENA): a dollar built on futures',
    description: isRu ? 'Как Ethena построила USDe, доллар на крипте и коротких фьючерсах, довела его почти до 15 миллиардов и раздала 750 миллионов ENA. История и калькулятор вложений.' : 'How Ethena built USDe, a dollar backed by crypto and short futures, grew it to almost 15 billion dollars and handed out 750 million ENA. History and a calculator.',
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
      { '@type': 'ListItem', position: 3, name: 'Ethena (ENA)', item: `${BASE}/${locale}/assets/${SLUG}` },
    ],
  };

  const historyContent = isRu ? (
    <>
      <h3>Как устроен USDe</h3>
      <p>
        Обычный <Link href={`/${locale}/glossary/stablecoin`}>стейблкоин</Link> вроде USDT держит под каждым токеном доллары или облигации. USDe устроен иначе: Ethena держит залог в криптовалюте и открывает на ту же сумму короткую позицию во фьючерсах. Если залог дешевеет, шорт приносит прибыль, и сумма остаётся прежней. Доход держателям застейканного USDe дают платежи по фандингу, которые платят трейдеры с длинными позициями.
      </p>

      <h3>Эссе, из которого выросла компания</h3>
      <p>
        Идею в марте 2023 года описал сооснователь BitMEX Артур Хейс в эссе «Dust on Crust». <strong>Гай Янг</strong>, до этого много лет проработавший в традиционных финансах, ушёл с работы, чтобы её воплотить. В июле 2023 года Ethena Labs получила посевные инвестиции во главе с фондом Dragonfly, а в феврале 2024-го открыла USDe для всех.
      </p>

      <h3>Аирдроп на 750 миллионов</h3>
      <p>
        2 апреля 2024 года Ethena раздала 750 миллионов ENA, 5% от выпуска в 15 миллиардов, через <Link href={`/${locale}/glossary/airdrop`}>аирдроп</Link> пользователям, копившим баллы. Торги начались примерно с 0,64 доллара при капитализации около миллиарда, пишет The Defiant. Через девять дней, 11 апреля, ENA поставил исторический максимум — 1,52 доллара.
      </p>

      <h3>Почти 15 миллиардов и откат</h3>
      <p>
        В начале октября 2025 года в обращении было почти 15 миллиардов USDe, по данным DefiLlama, на которые ссылается DL News. Во время обвала 10 октября на Binance USDe на несколько часов ушёл заметно ниже доллара. За два следующих месяца выпуск сжался примерно на 40%: трейдеры сократили ставки.
      </p>
    </>
  ) : (
    <>
      <h3>An essay turns into a company</h3>
      <p>
        In March 2023 Arthur Hayes, co-founder of BitMEX, published an essay called “Dust on Crust”, arguing for a dollar backed by crypto and short futures. <strong>Guy Young</strong>, who had spent years in traditional finance, left his job to build it. In July 2023 Ethena Labs raised a seed round led by Dragonfly.
      </p>

      <h3>How USDe holds its price</h3>
      <p>
        USDe is a synthetic dollar. A classic <Link href={`/${locale}/glossary/stablecoin`}>stablecoin</Link> keeps dollars in a bank; Ethena holds crypto as collateral and opens an equal short position in futures, so a fall in the collateral is offset by a gain on the short. Holders who stake USDe earn the funding that traders pay on those positions. USDe opened to the public in February 2024.
      </p>

      <h3>April 2024: an airdrop of 750 million</h3>
      <p>
        On 2 April 2024 Ethena gave away 750 million ENA, 5% of the 15 billion supply, in an <Link href={`/${locale}/glossary/airdrop`}>airdrop</Link> to users who had collected points. ENA started trading at about 0.64 dollars, worth around 1 billion dollars in circulation, The Defiant reported. Nine days later, on 11 April, it hit its all-time high of 1.52 dollars.
      </p>

      <h3>Up to 15 billion and back</h3>
      <p>
        USDe supply reached almost 15 billion dollars in early October 2025, according to DefiLlama data cited by DL News. During the crash of 10 October, USDe fell well below a dollar on Binance for a few hours. Over the next two months supply shrank by about 40% as traders cut their bets.
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
        name="Ethena"
        symbol="ENA"
        icon="Ⓔ"
        coingeckoId="ethena"
        tagline={isRu ? 'Синтетический доллар на крипте и коротких фьючерсах' : 'A synthetic dollar backed by crypto and short futures'}
        historyTitle={isRu ? 'История Ethena: USDe и токен ENA' : 'Ethena history: USDe and the ENA token'}
        historyContent={historyContent}
        guide={guide}
      />
    </>
  );
}
