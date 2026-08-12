import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import CoinGuideLayout from '@/components/ui/CoinGuideLayout';
import { buildOg, buildTwitter, BASE } from '@/lib/metadata';
import { LINK_QUOTES, LINK_FAQ, LINK_INVESTMENT_REFERENCE } from '@/lib/linkData';

type Props = { params: Promise<{ locale: string }> };
const SLUG = 'link';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const isRu = locale === 'ru';
  const title = isRu ? 'Chainlink (LINK): цена, история, калькулятор' : 'Chainlink (LINK): price, history, calculator';
  const description = isRu
    ? 'Полная история Chainlink: как Сергей Назаров решил проблему оракула и создал инфраструктуру за 80% DeFi. LINK Marines, VRF, CCIP и почему без Chainlink не работает большинство DeFi-протоколов. Калькулятор инвестиций.'
    : 'Complete Chainlink history: how Sergey Nazarov solved the oracle problem and built infrastructure for 80% of DeFi. LINK Marines, VRF, CCIP and why most DeFi protocols don\'t work without Chainlink. Investment calculator.';
  return {
    // Absolute: the layout template appends ' | CryptoPulse.media', which costs
    // 20 characters and adds nothing here — the coin's name is already first.
    title: { absolute: title },
    description,
    keywords: isRu
      ? ['chainlink link история', 'sergey nazarov', 'chainlink оракул defi', 'link токен', 'link калькулятор']
      : ['chainlink link history', 'sergey nazarov', 'chainlink oracle defi', 'link token', 'link investment calculator'],
    openGraph: buildOg({ url: `${BASE}/${locale}/assets/link`, title, description, locale }),
    twitter: buildTwitter({ url: `${BASE}/${locale}/assets/link`, title, description, locale }),
    alternates: {
      canonical: `${BASE}/${locale}/assets/link`,
      languages: {
        ru: `${BASE}/ru/assets/link`,
        en: `${BASE}/en/assets/link`,
        'x-default': `${BASE}/en/assets/link`,
      },
    },
  };
}

const GUIDE = {
  stats: [
    { label: { ru: 'Год запуска', en: 'Launched' }, value: '2017' },
    { label: { ru: 'Макс. запас', en: 'Max Supply' }, value: '1B LINK' },
    { label: { ru: 'Основатель', en: 'Founder' }, value: 'S. Nazarov' },
    { label: { ru: 'Тип', en: 'Type' }, value: { ru: 'Оракул', en: 'Oracle' } },
  ],
  investmentReference: LINK_INVESTMENT_REFERENCE,
  faq: LINK_FAQ,
  glossaryTerms: [
    { slug: 'smart-contract', label: { ru: 'Смарт-контракт', en: 'Smart Contract' } },
    { slug: 'defi', label: { ru: 'DeFi', en: 'DeFi' } },
    { slug: 'staking', label: { ru: 'Стейкинг', en: 'Staking' } },
    { slug: 'bridge', label: { ru: 'Мост', en: 'Bridge' } },
    { slug: 'nft', label: { ru: 'NFT', en: 'NFT' } },
  ],
};

export default async function LinkPage({ params }: Props) {
  const { locale } = await params;
  const isRu = locale === 'ru';
  const loc = isRu ? 'ru' : 'en';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: isRu ? 'Chainlink (LINK): невидимая инфраструктура DeFi' : 'Chainlink (LINK): The Invisible Infrastructure of DeFi',
    description: isRu ? 'История Chainlink от oracle problem до доминирования в DeFi.' : 'Chainlink history from the oracle problem to DeFi dominance.',
    inLanguage: locale,
    datePublished: '2024-01-01',
    dateModified: new Date().toISOString().slice(0, 10),
    author: { '@type': 'Organization', name: 'CryptoPulse.media', url: BASE },
    publisher: { '@type': 'Organization', name: 'CryptoPulse.media', url: BASE },
    mainEntityOfPage: `${BASE}/${locale}/assets/link`,
  };

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: LINK_FAQ.map(item => ({
      '@type': 'Question',
      name: item.question[loc],
      acceptedAnswer: { '@type': 'Answer', text: item.answer[loc] },
    })),
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: isRu ? 'Главная' : 'Home', item: `${BASE}/${locale}` },
      { '@type': 'ListItem', position: 2, name: isRu ? 'Крипто-активы' : 'Crypto Assets', item: `${BASE}/${locale}/assets` },
      { '@type': 'ListItem', position: 3, name: 'Chainlink (LINK)', item: `${BASE}/${locale}/assets/link` },
    ],
  };

  const historyContent = (
    <>
      {isRu ? (
            <>
              <h3>2017: Oracle Problem и ICO</h3>
              <p>Смарт-контракты — программы на блокчейне — по природе изолированы от внешнего мира. Если кредитный протокол хочет ликвидировать залог при падении цены ETH ниже $1000, он не может «узнать» текущую цену ETH — блокчейн не имеет доступа к внешним данным. Это и есть <strong>«проблема оракула»</strong>.</p>
              <p>Сергей Назаров (предприниматель, ранее — CryptoMail) и Стив Эллис в 2017 году основали Chainlink и описали решение: децентрализованная сеть нод-операторов, которые берут данные из множества внешних источников, агрегируют их и передают в смарт-контракт. Стимул быть честным: потеря заложенного LINK (слэшинг).</p>
              <p>ICO в сентябре 2017 года: <strong>$32M</strong>. Тихо и без хайпа — в отличие от большинства ICO того времени.</p>

              <h3>2019: Mainnet и первые интеграции</h3>
              <p>Chainlink V1 mainnet запустился в мае 2019 года на Ethereum. Первый клиент — Synthetix (синтетические активы). Постепенно Aave, Compound, MakerDAO один за другим интегрировали прайс-фиды Chainlink. К концу 2019 года Chainlink работал в большинстве крупных DeFi-протоколов.</p>
              <p>LINK вырос с $0,30 в начале 2019 года до $2,50 к концу — тихо, без маркетинга. Сообщество «LINK Marines» — одно из самых убеждённых в криптоиндустрии — начало формироваться.</p>

              <h3>2020–2021: DeFi Summer и ATH</h3>
              <p>DeFi-лето 2020 года взорвало рынок: Uniswap, Compound, Aave, Yearn — все работают на оракулах Chainlink. LINK вырос с $2 до <strong>$52</strong> к ATH в мае 2021 года — рост в 26 раз за год. К 2021 году Chainlink обеспечивал данными более <strong>75-80% всего DeFi-рынка</strong>.</p>
              <p>Расширение продуктовой линейки: <strong>VRF (Verifiable Random Function)</strong> — генератор случайных чисел для NFT-проектов и блокчейн-игр; <strong>Chainlink Automation</strong> (автоматическое исполнение смарт-контрактов по условиям); <strong>Proof of Reserve</strong> (верификация резервов стейблкоинов).</p>

              <h3>2022–2023: Стейкинг и CCIP</h3>
              <p>В декабре 2022 года Chainlink запустил стейкинг v0.1 — первая версия с лимитом $75M. В ноябре 2023 — v0.2 с улучшениями и более высокими лимитами. Стейкеры получают доходность в LINK, выполняя роль дополнительного уровня безопасности сети.</p>
              <p><strong>CCIP (Cross-Chain Interoperability Protocol)</strong> — протокол для безопасных кросс-чейн переводов активов и сообщений. Крупные банки (Swift, ANZ Bank, BNY Mellon) начали пилоты с CCIP для расчётов с токенизированными активами.</p>

              <h3>2024–2025: Институциональная инфраструктура</h3>
              <p>Chainlink превратился в <strong>инфраструктурный слой для традиционных финансов</strong> в блокчейне. Tokenized assets (реальные активы на блокчейне) требуют оракулов для стоимостной оценки — Chainlink здесь безальтернативен. JPMorgan, Goldman Sachs и Depository Trust & Clearing Corporation тестируют интеграции.</p>
            </>
          ) : (
            <>
              <h3>2017: The Oracle Problem and ICO</h3>
              <p>Smart contracts — programs on the blockchain — are inherently isolated from the outside world. If a lending protocol wants to liquidate collateral when ETH falls below $1,000, it can't "know" the current ETH price — the blockchain has no access to external data. This is the <strong>"oracle problem."</strong></p>
              <p>Sergey Nazarov (entrepreneur, formerly CryptoMail) and Steve Ellis founded Chainlink in 2017 and described the solution: a decentralized network of node operators that fetch data from multiple external sources, aggregate it, and deliver it to smart contracts. Incentive to be honest: losing staked LINK (slashing). ICO in September 2017: <strong>$32M</strong>. Quietly and without hype.</p>

              <h3>2019: Mainnet and First Integrations</h3>
              <p>Chainlink V1 mainnet launched in May 2019 on Ethereum. First client: Synthetix (synthetic assets). Gradually Aave, Compound, and MakerDAO integrated Chainlink price feeds. By end of 2019, Chainlink ran in most major DeFi protocols. LINK grew from $0.30 to $2.50 by year-end — quietly, without marketing.</p>

              <h3>2020–2021: DeFi Summer and ATH</h3>
              <p>DeFi summer 2020 exploded the market: Uniswap, Compound, Aave, Yearn — all running on Chainlink oracles. LINK grew from $2 to <strong>$52</strong> ATH in May 2021 — 26x in a year. By 2021, Chainlink provided data to more than <strong>75-80% of the entire DeFi market</strong>.</p>
              <p>Product line expansion: <strong>VRF (Verifiable Random Function)</strong> — random number generator for NFT projects and blockchain games; <strong>Chainlink Automation</strong> (automated smart contract execution by conditions); <strong>Proof of Reserve</strong> (stablecoin reserve verification).</p>

              <h3>2022–2023: Staking and CCIP</h3>
              <p>In December 2022, Chainlink launched staking v0.1 — first version with $75M limit. In November 2023 — v0.2 with improvements and higher limits. Stakers earn LINK yield while serving as an additional security layer. <strong>CCIP (Cross-Chain Interoperability Protocol)</strong> — a protocol for secure cross-chain asset and message transfers. Major banks (Swift, ANZ Bank, BNY Mellon) began CCIP pilots for tokenized asset settlements.</p>

              <h3>2024–2025: Institutional Infrastructure</h3>
              <p>Chainlink has become an <strong>infrastructure layer for traditional finance</strong> in blockchain. Tokenized real-world assets require oracles for valuation — Chainlink is the only option here. JPMorgan, Goldman Sachs, and Depository Trust & Clearing Corporation are testing integrations.</p>
            </>
          )}
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
        tagline={isRu ? 'Децентрализованная оракульная сеть — связующее звено между блокчейном и реальным миром' : 'Decentralized oracle network — the link between blockchain and the real world'}
        historyTitle={isRu ? 'История Chainlink: невидимый скелет DeFi' : 'Chainlink History: The Invisible Skeleton of DeFi'}
        historyContent={historyContent}
        guide={GUIDE}
        quotes={LINK_QUOTES}
      />
    </>
  );
}
