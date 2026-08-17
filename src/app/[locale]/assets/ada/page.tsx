import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import CoinGuideLayout from '@/components/ui/CoinGuideLayout';
import { buildOg, buildTwitter, BASE } from '@/lib/metadata';
import { ADA_QUOTES, ADA_FAQ, ADA_INVESTMENT_REFERENCE } from '@/lib/adaData';
import { SITE_NAME } from '@/lib/site';

type Props = { params: Promise<{ locale: string }> };
const SLUG = 'ada';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const isRu = locale === 'ru';
  const title = isRu ? 'Cardano (ADA): цена, история, калькулятор' : 'Cardano (ADA): price, history, calculator';
  const description = isRu
    ? 'История Cardano: как Чарльз Хоскинсон построил блокчейн «третьего поколения» на научном подходе. Протокол Ouroboros, эры развития, калькулятор инвестиций в ADA.'
    : 'Cardano history: how Charles Hoskinson built a third-generation blockchain on a scientific approach. Ouroboros, development eras, ADA investment calculator.';
  return {
    // Absolute: the layout template appends ` | ${SITE_NAME}`, which costs
    // 20 characters and adds nothing here — the coin's name is already first.
    title: { absolute: title },
    description,
    keywords: isRu
      ? ['cardano история', 'ada криптовалюта', 'cardano ouroboros', 'charles hoskinson', 'ada калькулятор']
      : ['cardano history', 'ada cryptocurrency', 'cardano ouroboros', 'charles hoskinson', 'ada investment calculator'],
    openGraph: buildOg({ url: `${BASE}/${locale}/assets/ada`, title, description, locale }),
    twitter: buildTwitter({ url: `${BASE}/${locale}/assets/ada`, title, description, locale }),
    alternates: {
      canonical: `${BASE}/${locale}/assets/ada`,
      languages: {
        ru: `${BASE}/ru/assets/ada`,
        en: `${BASE}/en/assets/ada`,
        'x-default': `${BASE}/en/assets/ada`,
      },
    },
  };
}

const GUIDE = {
  stats: [
    { label: { ru: 'Год запуска', en: 'Launched' }, value: '2017' },
    { label: { ru: 'Макс. запас', en: 'Max Supply' }, value: '45B ADA' },
    { label: { ru: 'Основатель', en: 'Founder' }, value: 'C. Hoskinson' },
    { label: { ru: 'Консенсус', en: 'Consensus' }, value: 'Ouroboros PoS' },
  ],
  investmentReference: ADA_INVESTMENT_REFERENCE,
  faq: ADA_FAQ,
  glossaryTerms: [
    { slug: 'staking', label: { ru: 'Стейкинг', en: 'Staking' } },
    { slug: 'proof-of-stake', label: { ru: 'Proof of Stake', en: 'Proof of Stake' } },
    { slug: 'smart-contract', label: { ru: 'Смарт-контракт', en: 'Smart Contract' } },
    { slug: 'defi', label: { ru: 'DeFi', en: 'DeFi' } },
    { slug: 'dao', label: { ru: 'DAO', en: 'DAO' } },
  ],
};

export default async function AdaPage({ params }: Props) {
  const { locale } = await params;
  const isRu = locale === 'ru';
  const loc = isRu ? 'ru' : 'en';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: isRu ? 'Cardano (ADA): блокчейн третьего поколения с научным подходом' : 'Cardano (ADA): Third-Generation Blockchain with a Scientific Approach',
    description: isRu ? 'История Cardano от основания до Voltaire эры.' : 'Cardano history from founding to the Voltaire era.',
    inLanguage: locale,
    datePublished: '2024-01-01',
    dateModified: new Date().toISOString().slice(0, 10),
    author: { '@type': 'Organization', name: '${SITE_NAME}', url: BASE },
    publisher: { '@type': 'Organization', name: '${SITE_NAME}', url: BASE },
    mainEntityOfPage: `${BASE}/${locale}/assets/ada`,
  };

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: ADA_FAQ.map(item => ({
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
      { '@type': 'ListItem', position: 3, name: 'Cardano (ADA)', item: `${BASE}/${locale}/assets/ada` },
    ],
  };

  const historyContent = (
    <>
      {isRu ? (
            <>
              <h3>2015–2017: Рождение из спора</h3>
              <p>Чарльз Хоскинсон — один из соучредителей Ethereum — покинул проект в 2014 году после разногласий с Виталиком Бутериным о коммерческой модели. В 2015 году он и Джереми Вуд основали <strong>IOHK (Input Output Hong Kong)</strong> — научно-инженерную компанию, которая возьмёт Cardano как основной проект.</p>
              <p>Кардинальное отличие от других блокчейнов: Cardano строился на <strong>peer-reviewed академических исследованиях</strong>. Каждый ключевой протокол должен был пройти независимую научную рецензию и публикацию. Хоскинсон называет это «исследованием, опережающим разработку».</p>
              <p>Сеть запущена в сентябре 2017 года, одновременно с ICO, собравшим $62 млн преимущественно от японских инвесторов (через биржу Coincheck).</p>

              <h3>2018–2019: Эра Byron — базовая функциональность</h3>
              <p>Первая эра Cardano — Byron — обеспечила базовый функционал: кошельки, транзакции, блокчейн-эксплорер. В 2019 году вышел улучшенный кошелёк <strong>Daedalus</strong>. Протокол оставался централизованным — сеть управлялась нодами IOHK.</p>

              <h3>2020: Эра Shelley — децентрализация</h3>
              <p>Август 2020 года стал ключевым: запуск эры <strong>Shelley</strong> принёс настоящую децентрализацию. Появились пулы стейкинга — любой мог стать валидатором. Сеть перешла на <strong>Ouroboros</strong> — первый в мире PoS-протокол с математически доказанной безопасностью (через теорию игр и криптографию).</p>
              <p>К концу 2020 года Cardano стала одной из самых децентрализованных PoS-сетей: тысячи пулов, контролируемых разными операторами.</p>

              <h3>2021: Эра Goguen — смарт-контракты наконец-то</h3>
              <p>Самое ожидаемое событие в истории Cardano: сентябрь 2021, эра <strong>Goguen</strong>, запуск смарт-контрактов на языке Plutus (функциональный язык на базе Haskell). Критики издевались годами: «ADA — блокчейн без DeFi». Теперь это исправлено.</p>
              <p>Цена ADA достигла ATH <strong>$3,10</strong> в сентябре 2021 года, суммарная рыночная капитализация превышала $100 млрд — третье место после BTC и ETH. DeFi-экосистема начала формироваться вокруг DEX SundaeSwap и Minswap.</p>

              <h3>2022–2023: Эра Basho и кризис рынка</h3>
              <p>Эра <strong>Basho</strong> направлена на масштабируемость: сайдчейны, Input Endorsers, Hydra (offchain state channels для теоретически неограниченного TPS). Внедрение идёт медленно — что стало мишенью для критиков.</p>
              <p>В 2022 году, на фоне краха LUNA и FTX, ADA потеряла более 80% от ATH. Хоскинсон продолжал строить, игнорируя медвежий рынок.</p>

              <h3>2024–2025: Эра Voltaire — самоуправление</h3>
              <p>Финальная эра дорожной карты: <strong>Voltaire</strong> переносит управление Cardano в руки сообщества через on-chain голосование (CIP-1694). Конституционный комитет, DRep-делегаты, казна под контролем ADA-холдеров. Это первый полноценный on-chain governance для крупного L1 блокчейна.</p>
              <p>Bitget, Binance и Coinbase продолжают добавлять ADA-продукты. Партнёрства с правительствами Эфиопии, Грузии и Танзании (цифровые удостоверения и образовательные документы на Cardano) остаются уникальным кейсом для всего крипторынка.</p>
            </>
          ) : (
            <>
              <h3>2015–2017: Born from a Dispute</h3>
              <p>Charles Hoskinson — one of Ethereum's co-founders — left the project in 2014 after disagreements with Vitalik Buterin over the commercial model. In 2015 he and Jeremy Wood founded <strong>IOHK (Input Output Hong Kong)</strong> — a science-engineering company that would take Cardano as its main project.</p>
              <p>The cardinal difference from other blockchains: Cardano was built on <strong>peer-reviewed academic research</strong>. Every key protocol had to pass independent scientific review and publication. Hoskinson calls this "research ahead of development."</p>
              <p>The network launched in September 2017, simultaneously with an ICO that raised $62 million, primarily from Japanese investors (through Coincheck exchange).</p>

              <h3>2018–2019: Byron Era — Basic Functionality</h3>
              <p>The first Cardano era — Byron — provided basic functionality: wallets, transactions, blockchain explorer. In 2019 the improved <strong>Daedalus</strong> wallet was released. The protocol remained centralized — the network was run by IOHK nodes.</p>

              <h3>2020: Shelley Era — Decentralization</h3>
              <p>August 2020 was the key moment: the launch of the <strong>Shelley</strong> era brought real decentralization. Staking pools appeared — anyone could become a validator. The network switched to <strong>Ouroboros</strong> — the world's first PoS protocol with mathematically proven security (through game theory and cryptography).</p>

              <h3>2021: Goguen Era — Smart Contracts Finally</h3>
              <p>The most anticipated event in Cardano's history: September 2021, the <strong>Goguen</strong> era, launching smart contracts in the Plutus language (functional language based on Haskell). Critics had mocked for years: "ADA — a blockchain without DeFi." Now that was fixed.</p>
              <p>ADA price reached ATH of <strong>$3.10</strong> in September 2021, total market capitalization exceeded $100 billion — third place after BTC and ETH.</p>

              <h3>2022–2023: Basho Era and Market Crisis</h3>
              <p>The <strong>Basho</strong> era focuses on scalability: sidechains, Input Endorsers, Hydra (offchain state channels for theoretically unlimited TPS). Implementation is slow — which became fodder for critics. In 2022, amid the LUNA and FTX crashes, ADA lost more than 80% from ATH.</p>

              <h3>2024–2025: Voltaire Era — Self-Governance</h3>
              <p>The roadmap's final era: <strong>Voltaire</strong> transfers Cardano governance to the community through on-chain voting (CIP-1694). A constitutional committee, DRep delegates, treasury under ADA holder control. This is the first full on-chain governance for a major L1 blockchain.</p>
              <p>Partnerships with governments of Ethiopia, Georgia and Tanzania (digital IDs and educational documents on Cardano) remain a unique case for the entire crypto market.</p>
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
        tagline={isRu ? 'Блокчейн третьего поколения — академический подход к масштабируемости и безопасности' : 'Third-generation blockchain — academic approach to scalability and security'}
        historyTitle={isRu ? 'История Cardano: наука на блокчейне' : 'Cardano History: Science on the Blockchain'}
        historyContent={historyContent}
        guide={GUIDE}
        quotes={ADA_QUOTES}
      />
    </>
  );
}
