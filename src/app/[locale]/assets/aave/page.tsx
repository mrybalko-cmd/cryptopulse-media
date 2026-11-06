import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { buildOg, buildTwitter, BASE } from '@/lib/metadata';
import CoinGuideLayout from '@/components/ui/CoinGuideLayout';
import { COIN_GUIDES } from '@/lib/coinGuides';
import { ORGANIZATION_ID } from '@/lib/organizationSchema';

import { ASSET_REVISIONS } from '@/lib/pageRevisions';
type Props = { params: Promise<{ locale: string }> };
const SLUG = 'aave';
const guide = COIN_GUIDES[SLUG];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const isRu = locale === 'ru';
  const title = isRu ? 'Aave (AAVE): цена, история, калькулятор' : 'Aave (AAVE): price, history, calculator';
  const description = isRu
    ? 'Как ETHLend превратился в Aave, придумал флеш-кредиты и стал крупнейшим кредитным протоколом DeFi с депозитами около 45 миллиардов долларов. История AAVE и калькулятор.'
    : 'How ETHLend became Aave, invented flash loans and grew into the largest lending protocol in DeFi with deposits of about 45 billion dollars. AAVE history and a calculator.';

  return {
    // Absolute: the layout template appends the site name, which adds nothing here.
    title: { absolute: title },
    description,
    keywords: isRu
      ? ['aave история', 'aave токен', 'aave калькулятор', 'aave цена', 'курс aave']
      : ['aave history', 'aave token', 'aave investment calculator', 'aave price', 'aave price'],
    openGraph: buildOg({ url: `${BASE}/${locale}/assets/${SLUG}`, title, description, locale }),
    twitter: buildTwitter({ url: `${BASE}/${locale}/assets/${SLUG}`, title, description, locale }),
    alternates: {
      canonical: `${BASE}/${locale}/assets/${SLUG}`,
      languages: { ru: `${BASE}/ru/assets/${SLUG}`, en: `${BASE}/en/assets/${SLUG}`, 'x-default': `${BASE}/en/assets/${SLUG}` },
    },
  };
}

export default async function AavePage({ params }: Props) {
  const { locale } = await params;
  const isRu = locale === 'ru';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: isRu ? 'Aave (AAVE): от ETHLend до главного кредитора DeFi' : 'Aave (AAVE): from ETHLend to the largest DeFi lender',
    description: isRu ? 'Как ETHLend превратился в Aave, придумал флеш-кредиты и стал крупнейшим кредитным протоколом DeFi с депозитами около 45 миллиардов долларов. История AAVE и калькулятор.' : 'How ETHLend became Aave, invented flash loans and grew into the largest lending protocol in DeFi with deposits of about 45 billion dollars. AAVE history and a calculator.',
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
      { '@type': 'ListItem', position: 3, name: 'Aave (AAVE)', item: `${BASE}/${locale}/assets/${SLUG}` },
    ],
  };

  const historyContent = isRu ? (
    <>
      <h3>Призрак по-фински</h3>
      <p>
        Aave по-фински значит «призрак». Так в сентябре 2018 года переименовали проект ETHLend, который <strong>Стани Кулечов</strong> запустил в 2017-м. Осенью того же года ETHLend собрал около 16,2 миллиона долларов на <Link href={`/${locale}/glossary/ico`}>ICO</Link>. Платформа сводила каждого заёмщика с одним кредитором, и рынок оставался маленьким, поэтому команда перешла на общие пулы.
      </p>

      <h3>2020: пулы и флеш-кредиты</h3>
      <p>
        Aave V1 заработал в январе 2020 года. Искать контрагента больше не нужно: вы вносите монеты в пул и берёте из него в долг под залог, примерно как в ломбарде, только без оценщика. Тогда же появились флеш-кредиты — заём без залога, который возвращают в той же транзакции. В октябре 2020 года старый токен LEND обменяли на AAVE в пропорции 100 к 1, выпуск ограничили 16 миллионами.
      </p>

      <h3>Пик 2021 года</h3>
      <p>
        На подъёме <Link href={`/${locale}/glossary/defi`}>DeFi</Link> AAVE поставил исторический максимум — 661,69 доллара 18 мая 2021 года, по данным CoinGecko. Держатели токена голосуют за изменения протокола, а застейканные AAVE — резерв на случай безнадёжных долгов.
      </p>

      <h3>Лидер кредитования</h3>
      <p>
        В начале октября 2025 года депозиты в Aave дошли до рекордных 44,9 миллиарда долларов по данным DefiLlama, это почти половина всего кредитования в DeFi. Протокол работает в Ethereum и ещё десятке сетей, а с июля 2023 года выпускает собственный стейблкоин GHO.
      </p>
    </>
  ) : (
    <>
      <h3>ETHLend and a Finnish ghost</h3>
      <p>
        <strong>Stani Kulechov</strong> launched ETHLend in 2017 and raised about 16.2 million dollars in an <Link href={`/${locale}/glossary/ico`}>ICO</Link> in November that year. The platform matched each borrower with a single lender, and the market stayed small. In September 2018 the project became Aave, the Finnish word for ghost, and switched to shared lending pools.
      </p>

      <h3>2020: pools and flash loans</h3>
      <p>
        Aave V1 went live in January 2020. Instead of finding a counterparty, you deposit into a pool and borrow from it against collateral. V1 also introduced flash loans: you borrow without collateral and repay within the same transaction. In October 2020 holders swapped the old LEND token for AAVE at 100 to 1, and supply was capped at 16 million.
      </p>

      <h3>The 2021 peak</h3>
      <p>
        In the <Link href={`/${locale}/glossary/defi`}>DeFi</Link> boom AAVE reached its all-time high of 661.69 dollars on 18 May 2021, according to CoinGecko. The token gives you a vote on protocol changes, and staked AAVE is a reserve against bad debt.
      </p>

      <h3>Leader in lending</h3>
      <p>
        Deposits on Aave hit a record of about 44.9 billion dollars in early October 2025, according to DefiLlama, almost half of all DeFi lending. The protocol runs on Ethereum and a dozen other networks and has its own stablecoin, GHO, launched in July 2023.
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
        name="Aave"
        symbol="AAVE"
        icon="👻"
        coingeckoId="aave"
        tagline={isRu ? 'Крупнейший кредитный рынок в DeFi' : 'The largest lending market in DeFi'}
        historyTitle={isRu ? 'История Aave: ETHLend, флеш-кредиты и обмен 100 к 1' : 'Aave history: ETHLend, flash loans and a 100-to-1 swap'}
        historyContent={historyContent}
        guide={guide}
      />
    </>
  );
}
