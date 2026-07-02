import type { Metadata } from 'next';
import Link from 'next/link';
import { buildOg, BASE } from '@/lib/metadata';
import AdaCalculator from '@/components/ui/AdaCalculator';
import { ADA_QUOTES, ADA_FAQ } from '@/lib/adaData';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isRu = locale === 'ru';
  const title = isRu
    ? 'Cardano (ADA) — История, цена и калькулятор инвестиций'
    : 'Cardano (ADA) — History, Price & Investment Calculator';
  const description = isRu
    ? 'Полная история Cardano: как Чарльз Хоскинсон создал блокчейн «третьего поколения» с научным подходом. Протокол Ouroboros, эры развития и почему ADA называют медленным но надёжным. Калькулятор инвестиций.'
    : 'Complete Cardano history: how Charles Hoskinson built a third-generation blockchain with a scientific approach. Ouroboros protocol, development eras and why ADA is called slow but reliable. Investment calculator.';
  return {
    title,
    description,
    keywords: isRu
      ? ['cardano история', 'ada криптовалюта', 'cardano ouroboros', 'charles hoskinson', 'ada калькулятор']
      : ['cardano history', 'ada cryptocurrency', 'cardano ouroboros', 'charles hoskinson', 'ada investment calculator'],
    openGraph: buildOg({ url: `${BASE}/${locale}/assets/ada`, title, description, locale }),
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
    author: { '@type': 'Organization', name: 'CryptoPulse.media', url: BASE },
    publisher: { '@type': 'Organization', name: 'CryptoPulse.media', url: BASE },
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

  const glossaryBase = `/${locale}/glossary`;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <nav className="flex items-center gap-1.5 text-xs text-muted mb-8">
        <Link href={`/${locale}`} className="hover:text-accent transition-colors">{isRu ? 'Главная' : 'Home'}</Link>
        <span>›</span>
        <Link href={`/${locale}/assets`} className="hover:text-accent transition-colors">{isRu ? 'Крипто-активы' : 'Crypto Assets'}</Link>
        <span>›</span>
        <span className="text-foreground">Cardano (ADA)</span>
      </nav>

      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl font-bold text-accent">₳</span>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight">
              Cardano <span className="text-muted font-normal text-2xl">ADA</span>
            </h1>
            <p className="text-muted text-sm mt-1">
              {isRu ? 'Блокчейн третьего поколения — академический подход к масштабируемости и безопасности' : 'Third-generation blockchain — academic approach to scalability and security'}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          {[
            { label: isRu ? 'Год запуска' : 'Launched', value: '2017' },
            { label: isRu ? 'Макс. запас' : 'Max Supply', value: '45B ADA' },
            { label: isRu ? 'Основатель' : 'Founder', value: 'C. Hoskinson' },
            { label: isRu ? 'Консенсус' : 'Consensus', value: 'Ouroboros PoS' },
          ].map(s => (
            <div key={s.label} className="bg-card border border-border rounded-lg p-3">
              <p className="text-xs text-muted mb-1">{s.label}</p>
              <p className="text-sm font-semibold text-foreground">{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-14">
        <AdaCalculator locale={locale} />
      </div>

      <article className="mb-14">
        <h2 className="text-2xl font-bold text-foreground mb-8">
          {isRu ? 'История Cardano: наука на блокчейне' : 'Cardano History: Science on the Blockchain'}
        </h2>
        <div className="prose prose-invert prose-sm max-w-none prose-headings:text-foreground prose-headings:font-semibold prose-p:text-muted prose-p:leading-relaxed prose-strong:text-foreground prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-li:text-muted">
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
        </div>
      </article>

      <section className="mb-14">
        <h2 className="text-2xl font-bold text-foreground mb-6">
          {isRu ? 'Что говорят о Cardano' : 'What They Say About Cardano'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {ADA_QUOTES.map((q, i) => (
            <blockquote key={i} className={`bg-card border rounded-xl p-4 ${
              q.sentiment === 'bullish' ? 'border-positive/30' :
              q.sentiment === 'bearish' ? 'border-negative/30' : 'border-border'
            }`}>
              <p className="text-sm text-foreground leading-relaxed mb-3 italic">{q.quote[loc]}</p>
              <footer>
                <p className="text-sm font-semibold text-foreground">{q.author}</p>
                <p className="text-xs text-muted">{q.role[loc]}, {q.year}</p>
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      <section className="mb-14">
        <h2 className="text-2xl font-bold text-foreground mb-6">
          {isRu ? 'Часто задаваемые вопросы о Cardano' : 'Frequently Asked Questions About Cardano'}
        </h2>
        <div className="flex flex-col gap-4">
          {ADA_FAQ.map((item, i) => (
            <details key={i} className="group bg-card border border-border rounded-xl overflow-hidden">
              <summary className="flex items-center justify-between p-4 cursor-pointer select-none font-semibold text-sm text-foreground list-none">
                {item.question[loc]}
                <span className="text-muted group-open:rotate-180 transition-transform shrink-0 ml-3">▾</span>
              </summary>
              <div className="px-4 pb-4 pt-0 text-sm text-muted leading-relaxed border-t border-border">
                <p className="pt-3">{item.answer[loc]}</p>
              </div>
            </details>
          ))}
        </div>
      </section>

      <section className="bg-card border border-border rounded-xl p-5">
        <h3 className="text-sm font-bold text-foreground mb-3">
          {isRu ? 'Изучите термины в глоссарии' : 'Learn the terms in our glossary'}
        </h3>
        <div className="flex flex-wrap gap-2">
          {[
            { slug: 'staking', label: isRu ? 'Стейкинг' : 'Staking' },
            { slug: 'proof-of-stake', label: 'Proof of Stake' },
            { slug: 'smart-contract', label: isRu ? 'Смарт-контракт' : 'Smart Contract' },
            { slug: 'defi', label: 'DeFi' },
            { slug: 'dao', label: 'DAO' },
          ].map(t => (
            <Link key={t.slug} href={`${glossaryBase}#${t.slug}`}
              className="text-xs px-3 py-1.5 rounded-full bg-background border border-border text-muted hover:text-accent hover:border-accent/40 transition-colors">
              {t.label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
