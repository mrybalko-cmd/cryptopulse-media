import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { buildOg, BASE } from '@/lib/metadata';
import LinkCalculator from '@/components/ui/LinkCalculator';
import { LINK_QUOTES, LINK_FAQ } from '@/lib/linkData';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const isRu = locale === 'ru';
  const title = isRu
    ? 'Chainlink (LINK) — История, цена и калькулятор инвестиций'
    : 'Chainlink (LINK) — History, Price & Investment Calculator';
  const description = isRu
    ? 'Полная история Chainlink: как Сергей Назаров решил проблему оракула и создал инфраструктуру за 80% DeFi. LINK Marines, VRF, CCIP и почему без Chainlink не работает большинство DeFi-протоколов. Калькулятор инвестиций.'
    : 'Complete Chainlink history: how Sergey Nazarov solved the oracle problem and built infrastructure for 80% of DeFi. LINK Marines, VRF, CCIP and why most DeFi protocols don\'t work without Chainlink. Investment calculator.';
  return {
    title,
    description,
    keywords: isRu
      ? ['chainlink link история', 'sergey nazarov', 'chainlink оракул defi', 'link токен', 'link калькулятор']
      : ['chainlink link history', 'sergey nazarov', 'chainlink oracle defi', 'link token', 'link investment calculator'],
    openGraph: buildOg({ url: `${BASE}/${locale}/assets/link`, title, description, locale }),
    alternates: {
      canonical: `${BASE}/${locale}/assets/link`,
      languages: {
        ru: `${BASE}/ru/assets/link`,
        en: `${BASE}/en/assets/link`,
      },
    },
  };
}

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
        <span className="text-foreground">Chainlink (LINK)</span>
      </nav>

      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl font-bold text-accent">⬡</span>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight">
              Chainlink <span className="text-muted font-normal text-2xl">LINK</span>
            </h1>
            <p className="text-muted text-sm mt-1">
              {isRu ? 'Децентрализованная оракульная сеть — связующее звено между блокчейном и реальным миром' : 'Decentralized oracle network — the link between blockchain and the real world'}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          {[
            { label: isRu ? 'Год запуска' : 'Launched', value: '2017' },
            { label: isRu ? 'Макс. запас' : 'Max Supply', value: '1B LINK' },
            { label: isRu ? 'Основатель' : 'Founder', value: 'S. Nazarov' },
            { label: isRu ? 'Тип' : 'Type', value: isRu ? 'Оракул' : 'Oracle' },
          ].map(s => (
            <div key={s.label} className="bg-card border border-border rounded-lg p-3">
              <p className="text-xs text-muted mb-1">{s.label}</p>
              <p className="text-sm font-semibold text-foreground">{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-14">
        <LinkCalculator locale={locale} />
      </div>

      <article className="mb-14">
        <h2 className="text-2xl font-bold text-foreground mb-8">
          {isRu ? 'История Chainlink: невидимый скелет DeFi' : 'Chainlink History: The Invisible Skeleton of DeFi'}
        </h2>
        <div className="prose prose-invert prose-sm max-w-none prose-headings:text-foreground prose-headings:font-semibold prose-p:text-muted prose-p:leading-relaxed prose-strong:text-foreground prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-li:text-muted">
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
        </div>
      </article>

      <section className="mb-14">
        <h2 className="text-2xl font-bold text-foreground mb-6">
          {isRu ? 'Что говорят о Chainlink' : 'What They Say About Chainlink'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {LINK_QUOTES.map((q, i) => (
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
          {isRu ? 'Часто задаваемые вопросы о Chainlink' : 'Frequently Asked Questions About Chainlink'}
        </h2>
        <div className="flex flex-col gap-4">
          {LINK_FAQ.map((item, i) => (
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
            { slug: 'smart-contract', label: isRu ? 'Смарт-контракт' : 'Smart Contract' },
            { slug: 'defi', label: 'DeFi' },
            { slug: 'staking', label: isRu ? 'Стейкинг' : 'Staking' },
            { slug: 'bridge', label: isRu ? 'Мост' : 'Bridge' },
            { slug: 'nft', label: 'NFT' },
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
