import type { Metadata } from 'next';
import Link from 'next/link';
import { buildOg, BASE } from '@/lib/metadata';
import SolanaCalculator from '@/components/ui/SolanaCalculator';
import { SOL_QUOTES, SOL_FAQ } from '@/lib/solanaData';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isRu = locale === 'ru';
  const title = isRu
    ? 'Solana (SOL) — История, технология и калькулятор инвестиций'
    : 'Solana (SOL) — History, Technology & Investment Calculator';
  const description = isRu
    ? 'Полная история Solana: кто создал, что такое Proof of History, крах FTX и возрождение, NFT и DeFi на Solana. Калькулятор: сколько бы вы заработали, вложив $100–5000 в SOL 5 лет назад.'
    : 'Complete Solana history: who created it, what is Proof of History, the FTX collapse and recovery, NFT and DeFi on Solana. Calculator: how much would you have earned investing $100–5000 in SOL 5 years ago.';

  return {
    title,
    description,
    keywords: isRu
      ? ['solana история', 'что если бы купил solana', 'proof of history', 'анатолий яковенко', 'solana nft', 'solana калькулятор']
      : ['solana history', 'what if i bought solana', 'proof of history', 'anatoly yakovenko', 'solana nft', 'solana investment calculator'],
    openGraph: buildOg({ url: `${BASE}/${locale}/assets/solana`, title, description, locale }),
    alternates: {
      canonical: `${BASE}/${locale}/assets/solana`,
      languages: {
        ru: `${BASE}/ru/assets/solana`,
        en: `${BASE}/en/assets/solana`,
        'x-default': `${BASE}/en/assets/solana`,
      },
    },
  };
}

export default async function SolanaPage({ params }: Props) {
  const { locale } = await params;
  const isRu = locale === 'ru';
  const loc = isRu ? 'ru' : 'en';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: isRu
      ? 'Solana (SOL): история, Proof of History и путь к $260'
      : 'Solana (SOL): History, Proof of History and the Road to $260',
    description: isRu
      ? 'Полная история Solana от идеи Анатолия Яковенко до восстановления после FTX.'
      : 'Complete history of Solana from Anatoly Yakovenko\'s idea to recovery after FTX.',
    inLanguage: locale,
    datePublished: '2024-01-01',
    dateModified: new Date().toISOString().slice(0, 10),
    author: { '@type': 'Organization', name: 'CryptoPulse.media', url: BASE },
    publisher: { '@type': 'Organization', name: 'CryptoPulse.media', url: BASE },
    mainEntityOfPage: `${BASE}/${locale}/assets/solana`,
  };

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: SOL_FAQ.map(item => ({
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
      { '@type': 'ListItem', position: 3, name: 'Solana (SOL)', item: `${BASE}/${locale}/assets/solana` },
    ],
  };

  const glossaryBase = `/${locale}/glossary`;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-muted mb-8">
        <Link href={`/${locale}`} className="hover:text-accent transition-colors">{isRu ? 'Главная' : 'Home'}</Link>
        <span>›</span>
        <Link href={`/${locale}/assets`} className="hover:text-accent transition-colors">{isRu ? 'Крипто-активы' : 'Crypto Assets'}</Link>
        <span>›</span>
        <span className="text-foreground">Solana (SOL)</span>
      </nav>

      {/* Hero */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">◎</span>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight">
              Solana <span className="text-muted font-normal text-2xl">SOL</span>
            </h1>
            <p className="text-muted text-sm mt-1">
              {isRu ? 'Высокоскоростной блокчейн: до 65 000 транзакций в секунду' : 'High-speed blockchain: up to 65,000 transactions per second'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          {[
            { label: isRu ? 'Год запуска' : 'Launched', value: '2020' },
            { label: isRu ? 'Скорость (TPS)' : 'Speed (TPS)', value: '65 000' },
            { label: isRu ? 'Создатель' : 'Creator', value: 'Anatoly Yakovenko' },
            { label: isRu ? 'Консенсус' : 'Consensus', value: 'PoH + PoS' },
          ].map(s => (
            <div key={s.label} className="bg-card border border-border rounded-lg p-3">
              <p className="text-xs text-muted mb-1">{s.label}</p>
              <p className="text-sm font-semibold text-foreground">{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Calculator */}
      <div className="mb-14">
        <SolanaCalculator locale={locale} />
      </div>

      {/* History */}
      <article className="mb-14">
        <h2 className="text-2xl font-bold text-foreground mb-8">
          {isRu ? 'История Solana: от идеи инженера Qualcomm до «убийцы Ethereum»' : 'Solana History: From a Qualcomm Engineer\'s Idea to the "Ethereum Killer"'}
        </h2>

        <div className="prose prose-invert prose-sm max-w-none
          prose-headings:text-foreground prose-headings:font-semibold
          prose-p:text-muted prose-p:leading-relaxed
          prose-strong:text-foreground
          prose-a:text-accent prose-a:no-underline hover:prose-a:underline
          prose-li:text-muted">

          {isRu ? (
            <>
              <h3>2017: Озарение в 4 утра</h3>
              <p>
                Анатолий Яковенко работал старшим инженером в Qualcomm, когда в 2017 году проснулся посреди ночи
                с ключевой идеей. Он понял, что главная проблема существующих блокчейнов — не скорость процессора,
                а отсутствие единого понимания времени между узлами сети. Каждый узел должен договариваться
                с другими о том, когда именно произошла транзакция — и это создаёт огромные задержки.
              </p>
              <p>
                Решением стал <strong>Proof of History (PoH)</strong> — криптографические «доверенные часы»
                для всей сети. PoH позволяет записывать события в хронологическом порядке без необходимости
                синхронизации между узлами. Яковенко описал идею в whitepaper и начал собирать команду.
              </p>

              <h3>2018–2019: Основание Solana Labs и первые тесты</h3>
              <p>
                Вместе с Раджем Гокалом (бывший Google) и другими инженерами из Qualcomm, Intel и Dropbox
                Яковенко основал <strong>Solana Labs</strong> в 2018 году. Команда запустила первый тестнет
                в феврале 2018 года и провела несколько раундов тестирования, добившись скорости обработки
                в десятки тысяч транзакций в секунду.
              </p>
              <p>
                В 2019 году Solana привлекла $20 млн в ходе серии A. Технология привлекала серьёзных инвесторов:
                Multicoin Capital, a16z Crypto, Coinbase Ventures.
              </p>

              <h3>2020: Запуск Mainnet Beta и первый взлёт</h3>
              <p>
                В марте 2020 года запустилась <strong>Mainnet Beta</strong> Solana. Сеть обрабатывала
                транзакции за ~400 миллисекунд с комиссией в доли цента. Это был разительный контраст
                с Ethereum, где в периоды высокой активности комиссии достигали $50–100 за транзакцию.
              </p>
              <p>
                Ключевым событием 2020 года стало партнёрство с <strong>FTX</strong> — биржей Сэма
                Бэнкман-Фрида. FTX и Alameda Research стали крупнейшими инвесторами и сторонниками экосистемы
                Solana. Децентрализованная биржа <strong>Serum</strong> (DEX на Solana) была запущена при
                поддержке FTX и стала одним из первых DeFi-проектов на сети.
              </p>

              <h3>2021: Взрыв NFT и цена $260</h3>
              <p>
                2021 год стал звёздным для Solana. Пока Ethereum захлёбывался от высоких газовых комиссий,
                Solana предлагала те же возможности за доли цента и в сотни раз быстрее.
              </p>
              <p>
                Лето 2021 года: запуск коллекции <strong>Degenerate Ape Academy</strong> — первого вирусного
                NFT-дропа на Solana. 10 000 обезьян разошлись за минуты. Вслед за ней последовали сотни других
                коллекций. NFT-маркетплейс <strong>Magic Eden</strong> стал вторым по объёму в криптомире
                (после OpenSea на Ethereum).
              </p>
              <p>
                SOL вырос с $1,50 в начале года до исторического максимума <strong>$260 в ноябре 2021 года</strong>
                — рост более чем на 17 000%. Solana вошла в топ-5 по рыночной капитализации.
              </p>
              <p>
                Однако в сентябре 2021 года произошёл первый крупный сбой: сеть остановилась на 17 часов
                из-за перегрузки, вызванной ботами IDO. Критики заговорили о проблемах с надёжностью.
              </p>

              <h3>2022: FTX-катастрофа и «смерть» Solana</h3>
              <p>
                Ноябрь 2022 года стал самым тяжёлым месяцем в истории Solana. Крах биржи FTX и банкротство
                Alameda Research обнажили масштабы зависимости экосистемы от одного игрока.
              </p>
              <p>
                FTX и Alameda держали огромные позиции в SOL — сотни миллионов долларов. Ликвидация этих
                позиций обвалила цену SOL с $38 до <strong>$8 за несколько дней (-80%)</strong>. Многие
                проекты Solana потеряли финансирование. Криптопресса писала о «конце Solana».
              </p>
              <p>
                Тем не менее, сам блокчейн продолжал работать без перебоев. Независимые разработчики
                продолжали строить. Solana Labs выпустила ряд критических обновлений протокола,
                направленных на устранение уязвимостей, которые ранее вызывали сбои.
              </p>

              <h3>2023: Тихое возрождение</h3>
              <p>
                2023 год стал годом тихой, но упорной работы. Экосистема Solana показала
                феноменальную устойчивость. Число активных разработчиков выросло; новые проекты
                продолжали запускаться несмотря на медвежий рынок.
              </p>
              <p>
                NFT-маркетплейс <strong>Tensor</strong> составил конкуренцию Magic Eden.
                Появился <strong>Jupiter</strong> — агрегатор DEX, ставший одним из крупнейших
                в криптоиндустрии по объёму. Мем-коин <strong>BONK</strong> стал неожиданным
                хитом и дал толчок новой волне интереса к Solana.
              </p>

              <h3>2024: Новый ATH и зрелость экосистемы</h3>
              <p>
                К началу 2024 года SOL вернулся к $100+, а затем достиг нового исторического
                максимума — <strong>$260+</strong>. Solana обошла Ethereum по ряду метрик:
                объёму DEX-торгов, числу ежедневных активных пользователей и комиссионным сборам.
              </p>
              <p>
                <strong>Visa</strong> объявила о расширении пилота расчётов через Solana.
                <strong>Stripe</strong> интегрировал выплаты в USDC через Solana. Компания
                Solana Labs выпустила телефон <strong>Solana Saga</strong> и его второе поколение,
                превратив Solana в единственный блокчейн с собственным мобильным устройством.
              </p>
              <p>
                В мае 2024 года SEC США одобрила заявки на спотовые ETF для Ethereum, а следом
                появились ожидания аналогичного ETF для Solana — ещё один признак зрелости актива.
              </p>
            </>
          ) : (
            <>
              <h3>2017: A 4 AM Breakthrough</h3>
              <p>
                Anatoly Yakovenko was a senior engineer at Qualcomm when, in 2017, he woke up in the
                middle of the night with a key insight. He realized that the main problem with existing
                blockchains wasn't processor speed — it was the lack of a shared understanding of time
                between network nodes. Every node had to negotiate with others about when exactly a
                transaction occurred, creating massive delays.
              </p>
              <p>
                The solution was <strong>Proof of History (PoH)</strong> — cryptographic "trusted clocks"
                for the entire network. PoH allows events to be recorded in chronological order without
                synchronization between nodes. Yakovenko described the idea in a whitepaper and began
                assembling a team.
              </p>

              <h3>2018–2019: Founding Solana Labs and First Tests</h3>
              <p>
                Together with Raj Gokal (ex-Google) and other engineers from Qualcomm, Intel, and Dropbox,
                Yakovenko founded <strong>Solana Labs</strong> in 2018. The team launched the first testnet
                in February 2018 and ran multiple testing rounds, achieving tens of thousands of transactions
                per second.
              </p>
              <p>
                In 2019, Solana raised $20 million in a Series A. The technology attracted serious investors:
                Multicoin Capital, a16z Crypto, Coinbase Ventures.
              </p>

              <h3>2020: Mainnet Beta Launch and First Surge</h3>
              <p>
                In March 2020, Solana's <strong>Mainnet Beta</strong> went live. The network processed
                transactions in ~400 milliseconds with fees of fractions of a cent. This was a stark
                contrast to Ethereum, where fees during peak activity reached $50–100 per transaction.
              </p>
              <p>
                The key event of 2020 was a partnership with <strong>FTX</strong> — Sam Bankman-Fried's
                exchange. FTX and Alameda Research became the ecosystem's largest investors and champions.
                The decentralized exchange <strong>Serum</strong> (a DEX on Solana) launched with FTX
                backing and became one of the first DeFi projects on the network.
              </p>

              <h3>2021: The NFT Explosion and $260 ATH</h3>
              <p>
                2021 was Solana's breakout year. While Ethereum was overwhelmed by high gas fees, Solana
                offered the same capabilities for fractions of a cent and hundreds of times faster.
              </p>
              <p>
                Summer 2021: the launch of <strong>Degenerate Ape Academy</strong> — Solana's first viral
                NFT drop. 10,000 apes sold out in minutes. Hundreds of other collections followed. The
                <strong>Magic Eden</strong> NFT marketplace became the world's second-largest by volume
                (after OpenSea on Ethereum).
              </p>
              <p>
                SOL surged from $1.50 at the start of the year to an all-time high of{' '}
                <strong>$260 in November 2021</strong> — a gain of over 17,000%. Solana entered the top
                5 by market capitalization.
              </p>
              <p>
                However, September 2021 brought the first major outage: the network halted for 17 hours
                due to overload from IDO bots. Critics raised concerns about reliability.
              </p>

              <h3>2022: The FTX Catastrophe and Solana's "Death"</h3>
              <p>
                November 2022 was the darkest month in Solana's history. The collapse of FTX and bankruptcy
                of Alameda Research exposed how dependent the ecosystem was on a single player.
              </p>
              <p>
                FTX and Alameda held massive SOL positions — hundreds of millions of dollars. Liquidating
                these positions crashed SOL from $38 to{' '}
                <strong>$8 in just days (-80%)</strong>. Many Solana projects lost funding. The crypto
                press wrote about the "end of Solana."
              </p>
              <p>
                Yet the blockchain itself kept running without disruption. Independent developers kept
                building. Solana Labs released several critical protocol updates to address the
                vulnerabilities that had previously caused outages.
              </p>

              <h3>2023: A Quiet Revival</h3>
              <p>
                2023 was a year of quiet but determined work. The Solana ecosystem showed phenomenal
                resilience. Developer counts grew; new projects kept launching despite the bear market.
              </p>
              <p>
                NFT marketplace <strong>Tensor</strong> challenged Magic Eden. <strong>Jupiter</strong>
                emerged as a DEX aggregator that became one of the largest in crypto by volume. The
                meme coin <strong>BONK</strong> became an unexpected hit and sparked a new wave of
                interest in Solana.
              </p>

              <h3>2024: New ATH and Ecosystem Maturity</h3>
              <p>
                By early 2024, SOL had returned above $100 and then reached a new all-time high of{' '}
                <strong>$260+</strong>. Solana surpassed Ethereum on several metrics: DEX trading volume,
                daily active users, and fee revenue.
              </p>
              <p>
                <strong>Visa</strong> announced an expansion of its Solana settlement pilot.{' '}
                <strong>Stripe</strong> integrated USDC payouts via Solana. Solana Labs released the{' '}
                <strong>Solana Saga</strong> phone and its second generation, making Solana the only
                blockchain with its own mobile device.
              </p>
              <p>
                In May 2024, the US SEC approved spot ETF applications for Ethereum, and expectations
                for a similar Solana ETF grew — another sign of the asset's maturity.
              </p>
            </>
          )}
        </div>
      </article>

      {/* Quotes */}
      <section className="mb-14">
        <h2 className="text-2xl font-bold text-foreground mb-6">
          {isRu ? 'Что говорят о Solana' : 'What They Say About Solana'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {SOL_QUOTES.map((q, i) => (
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

      {/* FAQ */}
      <section className="mb-14">
        <h2 className="text-2xl font-bold text-foreground mb-6">
          {isRu ? 'Часто задаваемые вопросы о Solana' : 'Frequently Asked Questions About Solana'}
        </h2>
        <div className="flex flex-col gap-4">
          {SOL_FAQ.map((item, i) => (
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

      {/* Glossary links */}
      <section className="bg-card border border-border rounded-xl p-5">
        <h3 className="text-sm font-bold text-foreground mb-3">
          {isRu ? 'Изучите термины в глоссарии' : 'Learn the terms in our glossary'}
        </h3>
        <div className="flex flex-wrap gap-2">
          {[
            { slug: 'blockchain', label: isRu ? 'Блокчейн' : 'Blockchain' },
            { slug: 'smart-contract', label: isRu ? 'Смарт-контракт' : 'Smart Contract' },
            { slug: 'nft', label: 'NFT' },
            { slug: 'defi', label: 'DeFi' },
            { slug: 'staking', label: isRu ? 'Стейкинг' : 'Staking' },
            { slug: 'dex', label: 'DEX' },
            { slug: 'layer-2', label: 'Layer 2' },
            { slug: 'altcoin', label: isRu ? 'Альткоин' : 'Altcoin' },
          ].map(t => (
            <Link
              key={t.slug}
              href={`${glossaryBase}#${t.slug}`}
              className="text-xs px-3 py-1.5 rounded-full bg-background border border-border text-muted hover:text-accent hover:border-accent/40 transition-colors"
            >
              {t.label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
