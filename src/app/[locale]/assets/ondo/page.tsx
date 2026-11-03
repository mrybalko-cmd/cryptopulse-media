import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { buildOg, buildTwitter, BASE } from '@/lib/metadata';
import CoinGuideLayout from '@/components/ui/CoinGuideLayout';
import { COIN_GUIDES } from '@/lib/coinGuides';
import { ORGANIZATION_ID } from '@/lib/organizationSchema';

type Props = { params: Promise<{ locale: string }> };
const SLUG = 'ondo';
const guide = COIN_GUIDES[SLUG];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const isRu = locale === 'ru';
  const title = isRu ? 'Ondo (ONDO): цена, история, калькулятор' : 'Ondo (ONDO): price, history, calculator';
  const description = isRu
    ? 'Как Ondo Finance перенесла в блокчейн гособлигации США, а затем американские акции, и что даёт держателям токен ONDO. История ONDO и калькулятор вложений.'
    : 'How Ondo Finance put US Treasuries and then US stocks on the blockchain, and what the ONDO token gives its holders. ONDO history and an investment calculator.';

  return {
    // Absolute: the layout template appends the site name, which adds nothing here.
    title: { absolute: title },
    description,
    keywords: isRu
      ? ['ondo история', 'ondo токен', 'ondo калькулятор', 'ondo цена', 'курс ondo']
      : ['ondo history', 'ondo token', 'ondo investment calculator', 'ondo price', 'ondo price'],
    openGraph: buildOg({ url: `${BASE}/${locale}/assets/${SLUG}`, title, description, locale }),
    twitter: buildTwitter({ url: `${BASE}/${locale}/assets/${SLUG}`, title, description, locale }),
    alternates: {
      canonical: `${BASE}/${locale}/assets/${SLUG}`,
      languages: { ru: `${BASE}/ru/assets/${SLUG}`, en: `${BASE}/en/assets/${SLUG}`, 'x-default': `${BASE}/en/assets/${SLUG}` },
    },
  };
}

export default async function OndoPage({ params }: Props) {
  const { locale } = await params;
  const isRu = locale === 'ru';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: isRu ? 'Ondo (ONDO): активы Уолл-стрит в блокчейне' : 'Ondo (ONDO): Wall Street assets on the blockchain',
    description: isRu ? 'Как Ondo Finance перенесла в блокчейн гособлигации США, а затем американские акции, и что даёт держателям токен ONDO. История ONDO и калькулятор вложений.' : 'How Ondo Finance put US Treasuries and then US stocks on the blockchain, and what the ONDO token gives its holders. ONDO history and an investment calculator.',
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
      { '@type': 'ListItem', position: 3, name: 'Ondo (ONDO)', item: `${BASE}/${locale}/assets/${SLUG}` },
    ],
  };

  const historyContent = isRu ? (
    <>
      <h3>Облигации в виде токена</h3>
      <p>
        Главные продукты Ondo — OUSG, токен на краткосрочных гособлигациях США, и USDY, долларовый токен с доходностью. Значительная часть OUSG лежит в токенизированном фонде BUIDL от BlackRock. По сути это доходность облигаций, которую можно переводить по <Link href={`/${locale}/glossary/blockchain`}>блокчейну</Link> как обычный токен.
      </p>

      <h3>Из Goldman Sachs</h3>
      <p>
        <strong>Натан Оллман</strong> работал в команде цифровых активов Goldman Sachs и в 2021 году основал Ondo Finance. В том же году компания привлекла 4 миллиона долларов посевных денег, а в 2022-м — 20 миллионов в раунде A от Founders Fund, Pantera Capital и Coinbase Ventures.
      </p>

      <h3>Январь 2024: ONDO на бирже</h3>
      <p>
        ONDO продавали на CoinList ещё в 2022 году, но переводить токены было нельзя. В январе 2024 года Ondo разблокировала 14,3% выпуска в 10 миллиардов, и за день капитализация превысила миллиард долларов, пишет The Defiant. ONDO даёт голос в <Link href={`/${locale}/glossary/dao`}>DAO</Link> и на активы под OUSG и USDY не претендует. Исторический максимум — 2,14 доллара 15 декабря 2024 года.
      </p>

      <h3>Акции США для остального мира</h3>
      <p>
        В сентябре 2025 года Ondo запустила Global Markets: токенизированные версии более 100 американских акций и ETF для инвесторов за пределами США. В мае 2026 года компания сообщила о неожиданной смерти Оллмана, гендиректором стал президент Ondo <strong>Иэн Де Боде</strong>.
      </p>
    </>
  ) : (
    <>
      <h3>From Goldman Sachs to DeFi</h3>
      <p>
        <strong>Nathan Allman</strong> worked on the digital assets team at Goldman Sachs and founded Ondo Finance in 2021. The company raised a 4 million dollar seed round that year and a 20 million dollar Series A in 2022 from Founders Fund, Pantera Capital and Coinbase Ventures.
      </p>

      <h3>Treasuries as a token</h3>
      <p>
        Ondo’s main products are OUSG, a token backed by short-term US Treasuries, and USDY, a yield-bearing dollar token. Much of OUSG sits in BlackRock’s tokenised BUIDL fund. You get a bond yield in a form that moves on a <Link href={`/${locale}/glossary/blockchain`}>blockchain</Link> like any token.
      </p>

      <h3>January 2024: ONDO starts trading</h3>
      <p>
        Ondo sold ONDO on CoinList in 2022, but buyers could not transfer it. In January 2024 Ondo unlocked 14.3% of the 10 billion supply, and the token passed 1 billion dollars in market cap within a day, The Defiant reported. ONDO gives a vote in the Ondo <Link href={`/${locale}/glossary/dao`}>DAO</Link>; the assets Ondo manages stand behind OUSG and USDY, and the token has no claim on them. It reached its all-time high of 2.14 dollars on 15 December 2024.
      </p>

      <h3>US stocks for the rest of the world</h3>
      <p>
        In September 2025 Ondo launched Global Markets, tokenised versions of more than 100 US stocks and ETFs for investors outside the US. In May 2026 Ondo announced the unexpected death of Allman; president <strong>Ian De Bode</strong> became chief executive.
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
        name="Ondo"
        symbol="ONDO"
        icon="Ⓞ"
        coingeckoId="ondo-finance"
        tagline={isRu ? 'Американские облигации и акции в виде токенов' : 'US Treasuries and stocks as tokens'}
        historyTitle={isRu ? 'История Ondo: токенизированные облигации и акции' : 'Ondo history: tokenised Treasuries and stocks'}
        historyContent={historyContent}
        guide={guide}
      />
    </>
  );
}
