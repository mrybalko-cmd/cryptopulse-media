import type { Metadata } from 'next';
import Link from 'next/link';
import { buildOg, BASE } from '@/lib/metadata';
import AvaxCalculator from '@/components/ui/AvaxCalculator';
import { AVAX_QUOTES, AVAX_FAQ } from '@/lib/avaxData';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isRu = locale === 'ru';
  const title = isRu
    ? 'Avalanche (AVAX) — История, цена и калькулятор инвестиций'
    : 'Avalanche (AVAX) — History, Price & Investment Calculator';
  const description = isRu
    ? 'Полная история Avalanche: как Эмин Гюн Сирер создал блокчейн со снежным консенсусом и суб-секундной финальностью. Подсети, Avalanche9000, Visa и JPMorgan. Калькулятор инвестиций.'
    : 'Complete Avalanche history: how Emin Gün Sirer built a blockchain with snowball consensus and sub-second finality. Subnets, Avalanche9000, Visa and JPMorgan. Investment calculator.';
  return {
    title,
    description,
    keywords: isRu
      ? ['avalanche avax история', 'avax блокчейн', 'emin gun sirer', 'avalanche суб-сети', 'avax калькулятор']
      : ['avalanche avax history', 'avax blockchain', 'emin gun sirer', 'avalanche subnets', 'avax investment calculator'],
    openGraph: buildOg({ url: `${BASE}/${locale}/assets/avax`, title, description, locale }),
    alternates: {
      canonical: `${BASE}/${locale}/assets/avax`,
      languages: {
        ru: `${BASE}/ru/assets/avax`,
        en: `${BASE}/en/assets/avax`,
        'x-default': `${BASE}/en/assets/avax`,
      },
    },
  };
}

export default async function AvaxPage({ params }: Props) {
  const { locale } = await params;
  const isRu = locale === 'ru';
  const loc = isRu ? 'ru' : 'en';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: isRu ? 'Avalanche (AVAX): блокчейн со скоростью снежной лавины' : 'Avalanche (AVAX): The Blockchain with Avalanche-Speed Finality',
    description: isRu ? 'История Avalanche от основания до Avalanche9000.' : 'Avalanche history from founding to Avalanche9000.',
    inLanguage: locale,
    datePublished: '2024-01-01',
    dateModified: new Date().toISOString().slice(0, 10),
    author: { '@type': 'Organization', name: 'CryptoPulse.media', url: BASE },
    publisher: { '@type': 'Organization', name: 'CryptoPulse.media', url: BASE },
    mainEntityOfPage: `${BASE}/${locale}/assets/avax`,
  };

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: AVAX_FAQ.map(item => ({
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
      { '@type': 'ListItem', position: 3, name: 'Avalanche (AVAX)', item: `${BASE}/${locale}/assets/avax` },
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
        <span className="text-foreground">Avalanche (AVAX)</span>
      </nav>

      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl font-bold text-accent">🔺</span>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight">
              Avalanche <span className="text-muted font-normal text-2xl">AVAX</span>
            </h1>
            <p className="text-muted text-sm mt-1">
              {isRu ? 'Высокоскоростной L1 с уникальным снежным консенсусом и суб-секундной финальностью транзакций' : 'High-speed L1 with unique snowball consensus and sub-second transaction finality'}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          {[
            { label: isRu ? 'Год запуска' : 'Launched', value: '2020' },
            { label: isRu ? 'Макс. запас' : 'Max Supply', value: '720M AVAX' },
            { label: isRu ? 'Основатель' : 'Founder', value: 'E.G. Sirer' },
            { label: isRu ? 'Консенсус' : 'Consensus', value: 'Snowball PoS' },
          ].map(s => (
            <div key={s.label} className="bg-card border border-border rounded-lg p-3">
              <p className="text-xs text-muted mb-1">{s.label}</p>
              <p className="text-sm font-semibold text-foreground">{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-14">
        <AvaxCalculator locale={locale} />
      </div>

      <article className="mb-14">
        <h2 className="text-2xl font-bold text-foreground mb-8">
          {isRu ? 'История Avalanche: скорость как философия' : 'Avalanche History: Speed as Philosophy'}
        </h2>
        <div className="prose prose-invert prose-sm max-w-none prose-headings:text-foreground prose-headings:font-semibold prose-p:text-muted prose-p:leading-relaxed prose-strong:text-foreground prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-li:text-muted">
          {isRu ? (
            <>
              <h3>2018–2019: Анонимный whitepaper и исследования Cornell</h3>
              <p>В 2018 году анонимная группа под псевдонимом «Team Rocket» опубликовала whitepaper с новым консенсусным протоколом: вместо последовательного голосования — <strong>рандомизированный опрос подмножеств</strong> нод. Каждая нода спрашивает случайную выборку соседей, меняет мнение при достижении порога — и через несколько раундов весь сеть приходит к согласию. Это как «снежный ком» (Snowball): раз начавшееся движение не останавливается.</p>
              <p>Профессор Cornell Эмин Гюн Сирер — известный крипто-исследователь, предсказавший уязвимость биткоина «selfish mining» ещё в 2013 году — признал протокол революционным. В 2018 году он и соавторы основали <strong>Ava Labs</strong>.</p>

              <h3>2020: Запуск mainnet — и мгновенный успех</h3>
              <p>В сентябре 2020 года Avalanche запустила mainnet. Ключевое отличие: три связанных цепи внутри одной сети — X-Chain (активы), C-Chain (EVM-совместимость для смарт-контрактов), P-Chain (стейкинг и суб-сети). Финальность транзакции: <strong>&lt;1 секунды</strong>.</p>
              <p>C-Chain — полная совместимость с Ethereum: любой Solidity-контракт можно задеплоить без изменений. Это привлекло DeFi-проекты, уставшие от высоких газ-комиссий Ethereum.</p>

              <h3>2021: Бычий рынок и TVL $12 млрд</h3>
              <p>Август 2021: Avalanche запустила программу <strong>Avalanche Rush</strong> — $180 млн в стимулах для DeFi-проектов. Результат: TVL вырос с $200M до $12B. Протоколы Trader Joe, Benqi, Platypus стали крупнейшими в экосистеме.</p>
              <p>AVAX достиг ATH <strong>$146</strong> в ноябре 2021 года. Рыночная капитализация превысила $35 млрд.</p>

              <h3>2022: Суб-сети и корпоративный интерес</h3>
              <p>Концепция <strong>суб-сетей (Subnets)</strong>: любой проект может создать собственный блокчейн внутри экосистемы Avalanche, с кастомными правилами валидации, токеном и уровнем приватности. Это привлекло институционалов.</p>
              <p><strong>JPMorgan</strong> провёл пилот по торговле токенизированными облигациями на суб-сети Avalanche (проект Onyx). <strong>Visa</strong> интегрировала расчёты в USDC через Avalanche C-Chain. Медвежий рынок 2022 года обвалил AVAX на 93% от ATH.</p>

              <h3>2023–2025: Evergreen, Avalanche9000 и институциональная экспансия</h3>
              <p>Продукт <strong>Evergreen</strong> — суб-сети для финансовых институтов с KYC, приватностью и соответствием требованиям регуляторов. Deloitte использовал Avalanche для системы FEMA (федеральное управление по ликвидации последствий катастроф).</p>
              <p>В 2024 году апгрейд <strong>Avalanche9000</strong> снизил стоимость создания суб-сети с 2000 AVAX до 1.33 AVAX — открыв дорогу для тысяч новых проектов. Количество активных суб-сетей превысило 100.</p>
            </>
          ) : (
            <>
              <h3>2018–2019: Anonymous Whitepaper and Cornell Research</h3>
              <p>In 2018, an anonymous group under the pseudonym "Team Rocket" published a whitepaper with a new consensus protocol: instead of sequential voting — <strong>randomized sampling of node subsets</strong>. Each node queries a random sample of neighbors, changes opinion when a threshold is reached — and after a few rounds the entire network reaches consensus. It's like a "snowball": once started, the movement doesn't stop.</p>
              <p>Cornell Professor Emin Gün Sirer — a well-known crypto researcher who predicted Bitcoin's "selfish mining" vulnerability back in 2013 — recognized the protocol as revolutionary. In 2018 he and co-authors founded <strong>Ava Labs</strong>.</p>

              <h3>2020: Mainnet Launch — and Immediate Success</h3>
              <p>In September 2020, Avalanche launched its mainnet. Key difference: three linked chains within one network — X-Chain (assets), C-Chain (EVM-compatible for smart contracts), P-Chain (staking and subnets). Transaction finality: <strong>&lt;1 second</strong>.</p>
              <p>C-Chain offers full Ethereum compatibility: any Solidity contract can be deployed unchanged. This attracted DeFi projects tired of Ethereum's high gas fees.</p>

              <h3>2021: Bull Market and $12B TVL</h3>
              <p>August 2021: Avalanche launched the <strong>Avalanche Rush</strong> program — $180M in incentives for DeFi projects. Result: TVL grew from $200M to $12B. Protocols Trader Joe, Benqi, and Platypus became the ecosystem's largest. AVAX reached ATH of <strong>$146</strong> in November 2021.</p>

              <h3>2022: Subnets and Corporate Interest</h3>
              <p>The <strong>Subnets</strong> concept: any project can create its own blockchain within the Avalanche ecosystem, with custom validation rules, token, and privacy level. This attracted institutions. <strong>JPMorgan</strong> ran a pilot for trading tokenized bonds on an Avalanche subnet (Onyx project). <strong>Visa</strong> integrated USDC settlements through Avalanche C-Chain. The 2022 bear market crashed AVAX by 93% from ATH.</p>

              <h3>2023–2025: Evergreen, Avalanche9000 and Institutional Expansion</h3>
              <p>The <strong>Evergreen</strong> product — subnets for financial institutions with KYC, privacy, and regulatory compliance. Deloitte used Avalanche for a FEMA disaster recovery system.</p>
              <p>In 2024, the <strong>Avalanche9000</strong> upgrade reduced the cost of creating a subnet from 2,000 AVAX to 1.33 AVAX — opening the door for thousands of new projects. The number of active subnets exceeded 100.</p>
            </>
          )}
        </div>
      </article>

      <section className="mb-14">
        <h2 className="text-2xl font-bold text-foreground mb-6">
          {isRu ? 'Что говорят об Avalanche' : 'What They Say About Avalanche'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {AVAX_QUOTES.map((q, i) => (
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
          {isRu ? 'Часто задаваемые вопросы об Avalanche' : 'Frequently Asked Questions About Avalanche'}
        </h2>
        <div className="flex flex-col gap-4">
          {AVAX_FAQ.map((item, i) => (
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
            { slug: 'layer-2', label: 'Layer 2' },
            { slug: 'bridge', label: isRu ? 'Мост' : 'Bridge' },
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
