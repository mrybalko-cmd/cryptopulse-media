import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { buildOg, BASE } from '@/lib/metadata';
import EthereumCalculator from '@/components/ui/EthereumCalculator';
import { ETH_QUOTES, ETH_FAQ } from '@/lib/ethereumData';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const isRu = locale === 'ru';
  const title = isRu
    ? 'Ethereum (ETH) — История, смарт-контракты и калькулятор инвестиций'
    : 'Ethereum (ETH) — History, Smart Contracts & Investment Calculator';
  const description = isRu
    ? 'Полная история Ethereum: кто создал, как работают смарт-контракты, The Merge и переход на PoS. Калькулятор: сколько бы вы заработали, вложив $100–5000 в ETH 5 или 10 лет назад.'
    : 'Complete Ethereum history: who created it, how smart contracts work, The Merge and the shift to PoS. Calculator: how much would you have earned investing $100–5000 in ETH 5 or 10 years ago.';

  return {
    title,
    description,
    keywords: isRu
      ? ['эфириум история', 'что если бы купил эфириум', 'смарт-контракты ethereum', 'виталик бутерин', 'ethereum калькулятор', 'the merge ethereum']
      : ['ethereum history', 'what if i bought ethereum', 'smart contracts ethereum', 'vitalik buterin', 'ethereum investment calculator', 'the merge'],
    openGraph: buildOg({ url: `${BASE}/${locale}/assets/ethereum`, title, description, locale }),
    alternates: {
      canonical: `${BASE}/${locale}/assets/ethereum`,
      languages: {
        ru: `${BASE}/ru/assets/ethereum`,
        en: `${BASE}/en/assets/ethereum`,
      },
    },
  };
}

export default async function EthereumPage({ params }: Props) {
  const { locale } = await params;
  const isRu = locale === 'ru';
  const loc = isRu ? 'ru' : 'en';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: isRu
      ? 'Ethereum (ETH): история, смарт-контракты и The Merge'
      : 'Ethereum (ETH): History, Smart Contracts and The Merge',
    description: isRu
      ? 'Полная история Ethereum от белой книги Виталика Бутерина до The Merge.'
      : 'Complete history of Ethereum from Vitalik Buterin\'s whitepaper to The Merge.',
    inLanguage: locale,
    datePublished: '2024-01-01',
    dateModified: new Date().toISOString().slice(0, 10),
    author: { '@type': 'Organization', name: 'CryptoPulse.media', url: BASE },
    publisher: { '@type': 'Organization', name: 'CryptoPulse.media', url: BASE },
    mainEntityOfPage: `${BASE}/${locale}/assets/ethereum`,
  };

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: ETH_FAQ.map(item => ({
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
      { '@type': 'ListItem', position: 3, name: 'Ethereum (ETH)', item: `${BASE}/${locale}/assets/ethereum` },
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
        <span className="text-foreground">Ethereum (ETH)</span>
      </nav>

      {/* Hero */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">Ξ</span>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight">
              Ethereum <span className="text-muted font-normal text-2xl">ETH</span>
            </h1>
            <p className="text-muted text-sm mt-1">
              {isRu ? 'Платформа смарт-контрактов и децентрализованных приложений №1' : 'The #1 smart contract and decentralized application platform'}
            </p>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          {[
            { label: isRu ? 'Год запуска' : 'Launched', value: '2015' },
            { label: isRu ? 'Механизм' : 'Consensus', value: 'Proof of Stake' },
            { label: isRu ? 'Создатель' : 'Creator', value: 'Vitalik Buterin' },
            { label: isRu ? 'The Merge' : 'The Merge', value: isRu ? '15.09.2022' : 'Sep 15, 2022' },
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
        <EthereumCalculator locale={locale} />
      </div>

      {/* History */}
      <article className="mb-14">
        <h2 className="text-2xl font-bold text-foreground mb-8">
          {isRu ? 'История Ethereum: от идеи 19-летнего гения до мирового компьютера' : 'Ethereum History: From a Teen\'s Idea to the World Computer'}
        </h2>

        <div className="prose prose-invert prose-sm max-w-none
          prose-headings:text-foreground prose-headings:font-semibold
          prose-p:text-muted prose-p:leading-relaxed
          prose-strong:text-foreground
          prose-a:text-accent prose-a:no-underline hover:prose-a:underline
          prose-li:text-muted">

          {isRu ? (
            <>
              <h3>2013: Идея, которую отвергли в Bitcoin</h3>
              <p>
                Конец 2013 года. 19-летний канадско-российский программист <strong>Виталик Бутерин</strong>,
                редактор Bitcoin Magazine, написал белую книгу с необычным предложением: создать блокчейн,
                который умеет не только переводить деньги, но и выполнять произвольные программы —
                <strong>смарт-контракты</strong>.
              </p>
              <p>
                Бутерин предложил идею разработчикам Bitcoin. Те отказали: по их мнению, добавление
                программируемости усложнило бы и ослабило протокол. Тогда Виталик решил построить
                собственный <Link href={`${glossaryBase}#blockchain`}>блокчейн</Link> с нуля.
              </p>
              <p>
                На конференции Биткоин в Майами в январе 2014 года Бутерин публично представил Ethereum.
                К нему тут же присоединились Гэвин Вуд, Джозеф Любин, Чарльз Хоскинсон и другие —
                так сформировалась команда сооснователей.
              </p>

              <h3>2014: Краудсейл и финансирование</h3>
              <p>
                С июля по сентябрь 2014 года команда Ethereum провела публичный краудсейл (ICO): инвесторы
                могли купить ETH за Bitcoin по курсу 2 000 ETH за 1 BTC. За 42 дня было собрано
                <strong>31 529 BTC</strong> — около <strong>$18,4 млн</strong> по тогдашнему курсу.
                Это стало одним из крупнейших краудсейлов в истории на тот момент.
              </p>
              <p>
                Была создана некоммерческая организация <strong>Ethereum Foundation</strong> в Швейцарии
                для управления разработкой протокола.
              </p>

              <h3>2015: «Frontier» — рождение сети</h3>
              <p>
                30 июля 2015 года была запущена основная сеть Ethereum — версия <strong>«Frontier»</strong>.
                Первое вознаграждение за добытый блок составляло 5 ETH. Смарт-контракты стали реальностью:
                любой разработчик мог написать программу и запустить её в децентрализованной сети,
                которую невозможно остановить или подвергнуть цензуре.
              </p>
              <p>
                В первый год ETH торговался в диапазоне $0,50–$3. Сеть использовали в основном энтузиасты
                и разработчики.
              </p>

              <h3>2016: The DAO и первый кризис</h3>
              <p>
                Весной 2016 года был запущен <strong>The DAO</strong> — первый децентрализованный венчурный
                фонд на базе Ethereum. Он собрал $150 млн от 11 000 инвесторов. Это был грандиозный
                эксперимент с смарт-контрактами.
              </p>
              <p>
                В июне 2016 года хакер нашёл уязвимость в коде The DAO и вывел <strong>3,6 млн ETH</strong>
                — около $60 млн. Сообщество оказалось перед моральной дилеммой: блокчейн должен быть
                неизменным, но вернуть украденные средства можно только через изменение истории.
              </p>
              <p>
                В итоге сообщество проголосовало за <strong>хардфорк</strong>: блокчейн был «откатан»,
                а ETH жертвам возвращены. Часть сообщества, выступавшая за принцип неизменности,
                осталась на старой цепи — так появился <strong>Ethereum Classic (ETC)</strong>.
              </p>

              <h3>2017: DApps, ERC-20 и ICO-бум</h3>
              <p>
                2017 год стал годом взрывного роста. Стандарт <strong>ERC-20</strong>, позволяющий
                выпускать токены на Ethereum, открыл шлюзы для ICO-бума: тысячи проектов собирали
                сотни миллионов долларов, выпуская токены за несколько кликов.
              </p>
              <p>
                ETH вырос с $8 в январе до <strong>$800 в декабре 2017 года</strong> — рост на 10 000%.
                Сеть Ethereum обрабатывала миллионы транзакций, комиссии выросли, стала видна проблема
                масштабируемости.
              </p>
              <p>
                В конце 2017 года появилась игра CryptoKitties — первый вирусный NFT-проект. Кошки
                так перегрузили сеть, что транзакции тормозили по несколько дней.
              </p>

              <h3>2018–2019: «Крипто-зима» и строительство</h3>
              <p>
                После пика декабря 2017 года ETH рухнул с $1 400 до <strong>$85 к концу 2018 года</strong>.
                Большинство ICO-проектов обанкротились или оказались мошенничеством.
              </p>
              <p>
                Но разработчики продолжали строить. Это время стало периодом тихой технической работы:
                совершенствование протокола, запуск тестовых сетей для будущего перехода на PoS,
                развитие Layer 2 решений.
              </p>

              <h3>2020: DeFi-лето и взрыв децентрализованных финансов</h3>
              <p>
                Лето 2020 года вошло в историю как <strong>«DeFi Summer»</strong>. Протоколы
                Uniswap, Compound, Aave, MakerDAO взорвали рынок: пользователи могли давать и брать
                кредиты, торговать без биржи, зарабатывать проценты — всё без банков и посредников.
              </p>
              <p>
                Общая стоимость заблокированных средств (TVL) в DeFi выросла с $1 млрд до <strong>$15 млрд
                за несколько месяцев</strong>. Ethereum стал инфраструктурой новой финансовой системы.
              </p>

              <h3>2021: NFT-бум, ATH $4 800 и EIP-1559</h3>
              <p>
                Март 2021 года: художник Beeple продал NFT на платформе Christie's за
                <strong>$69,3 млн</strong>. NFT-маркетплейсы — OpenSea, Rarible, Foundation —
                начали генерировать миллиарды долларов оборота. Ethereum был платформой для всего этого.
              </p>
              <p>
                В августе 2021 года был активирован <strong>EIP-1559</strong> — крупнейшее обновление
                механизма комиссий. Базовая комиссия за транзакции теперь <strong>сжигается</strong>
                (уничтожается навсегда), а не уходит майнерам. Это сделало ETH дефляционным активом
                в периоды высокой активности.
              </p>
              <p>
                В ноябре 2021 года ETH достиг исторического максимума —{' '}
                <strong>$4 878 за монету</strong>.
              </p>

              <h3>2022: The Merge — революция за 13 секунд</h3>
              <p>
                15 сентября 2022 года в 06:42 UTC произошло одно из самых значимых событий в истории
                блокчейна — <strong>The Merge</strong> (Слияние). Ethereum переключился с Proof of Work
                на <strong>Proof of Stake</strong> за один блок, практически без сбоев.
              </p>
              <p>
                Последствия были немедленными: энергопотребление сети упало на{' '}
                <strong>~99,95%</strong> — с потребления, сопоставимого с целой страной, до уровня
                небольшого города. Выпуск новых ETH сократился примерно на 90%. Майнеры были выведены
                из системы: теперь сеть защищают валидаторы, ставящие не менее 32 ETH.
              </p>
              <p>
                The Merge стал подтверждением того, что команда Ethereum способна реализовывать
                невероятно сложные технические изменения в работающей системе стоимостью сотни
                миллиардов долларов.
              </p>

              <h3>2023–2024: Shanghai, Layer 2 и массовое принятие</h3>
              <p>
                В апреле 2023 года обновление <strong>Shanghai (Shapella)</strong> позволило
                валидаторам впервые вывести застейканные ETH. Это устранило последний барьер для
                крупных институциональных инвесторов.
              </p>
              <p>
                Экосистема Layer 2 — Arbitrum, Optimism, Base, zkSync — выросла в десятки раз,
                решая проблему высоких комиссий основной сети. Ethereum превратился в расчётный
                слой, а транзакции пользователей всё больше переносятся на L2.
              </p>
              <p>
                В мае 2024 года SEC США одобрила спотовые <strong>ETH ETF</strong> — вслед за
                Bitcoin. Это открыло Ethereum для пенсионных фондов и крупных институциональных
                игроков через традиционные брокерские счета.
              </p>
            </>
          ) : (
            <>
              <h3>2013: The Idea Bitcoin Rejected</h3>
              <p>
                Late 2013. <strong>Vitalik Buterin</strong>, a 19-year-old Canadian-Russian programmer
                and editor of Bitcoin Magazine, wrote a white paper with an unusual proposal: create a
                blockchain that could not only transfer money but also execute arbitrary programs —
                <strong>smart contracts</strong>.
              </p>
              <p>
                Buterin brought the idea to Bitcoin developers, who rejected it — in their view, adding
                programmability would complicate and weaken the protocol. So Vitalik decided to build his
                own <Link href={`${glossaryBase}#blockchain`}>blockchain</Link> from scratch.
              </p>
              <p>
                At the Bitcoin conference in Miami in January 2014, Buterin publicly unveiled Ethereum.
                Gavin Wood, Joseph Lubin, Charles Hoskinson, and others immediately joined — forming
                the co-founding team.
              </p>

              <h3>2014: The Crowdsale and Funding</h3>
              <p>
                From July to September 2014, the Ethereum team held a public crowdsale (ICO): investors
                could buy ETH with Bitcoin at a rate of 2,000 ETH per 1 BTC. Over 42 days they raised
                <strong>31,529 BTC</strong> — roughly <strong>$18.4 million</strong> at the time.
                It was one of the largest crowdfunding events in history.
              </p>
              <p>
                The non-profit <strong>Ethereum Foundation</strong> was established in Switzerland
                to oversee protocol development.
              </p>

              <h3>2015: "Frontier" — The Network Goes Live</h3>
              <p>
                On July 30, 2015, the Ethereum mainnet launched as <strong>"Frontier"</strong>.
                The initial block reward was 5 ETH. Smart contracts became real: any developer could
                write a program and deploy it on a decentralized network that could not be stopped
                or censored.
              </p>
              <p>
                In the first year, ETH traded between $0.50 and $3. The network was used mainly
                by enthusiasts and developers.
              </p>

              <h3>2016: The DAO and the First Crisis</h3>
              <p>
                In spring 2016, <strong>The DAO</strong> launched — the first decentralized venture
                fund built on Ethereum. It raised $150 million from 11,000 investors, a massive
                smart contract experiment.
              </p>
              <p>
                In June 2016, a hacker exploited a vulnerability in The DAO's code and drained
                <strong>3.6 million ETH</strong> — about $60 million. The community faced a moral
                dilemma: blockchains are supposed to be immutable, but recovering the stolen funds
                required rewriting history.
              </p>
              <p>
                The community voted for a <strong>hard fork</strong>: the blockchain was rolled back
                and victims' ETH was restored. The minority that believed in immutability stayed on
                the old chain — and <strong>Ethereum Classic (ETC)</strong> was born.
              </p>

              <h3>2017: DApps, ERC-20 and the ICO Boom</h3>
              <p>
                2017 was a year of explosive growth. The <strong>ERC-20</strong> token standard,
                which allows anyone to issue tokens on Ethereum, opened the floodgates for an ICO
                boom: thousands of projects raised hundreds of millions of dollars by issuing tokens
                with a few clicks.
              </p>
              <p>
                ETH soared from $8 in January to <strong>$800 in December 2017</strong> — a 10,000%
                gain. The Ethereum network processed millions of transactions; fees rose, and
                scalability became an obvious challenge.
              </p>
              <p>
                Late 2017 saw the launch of CryptoKitties — the first viral NFT project. The digital
                cats were so popular they clogged the network for days.
              </p>

              <h3>2018–2019: "Crypto Winter" and Building</h3>
              <p>
                After December 2017's peak, ETH collapsed from $1,400 to{' '}
                <strong>$85 by end of 2018</strong>. Most ICO projects went bankrupt or turned out
                to be scams.
              </p>
              <p>
                But developers kept building. This period was one of quiet technical work: protocol
                improvements, testnets for the coming PoS transition, and Layer 2 development.
              </p>

              <h3>2020: DeFi Summer and the Explosion of Decentralized Finance</h3>
              <p>
                Summer 2020 became known as <strong>"DeFi Summer"</strong>. Protocols like Uniswap,
                Compound, Aave, and MakerDAO exploded onto the scene: users could lend, borrow, trade
                without an exchange, and earn yield — all without banks or intermediaries.
              </p>
              <p>
                Total Value Locked (TVL) in DeFi grew from $1 billion to{' '}
                <strong>$15 billion in just a few months</strong>. Ethereum had become the
                infrastructure of a new financial system.
              </p>

              <h3>2021: NFT Boom, $4,800 ATH and EIP-1559</h3>
              <p>
                March 2021: digital artist Beeple sold an NFT at Christie's for{' '}
                <strong>$69.3 million</strong>. NFT marketplaces — OpenSea, Rarible, Foundation —
                began generating billions in volume. Ethereum was the platform powering it all.
              </p>
              <p>
                In August 2021, <strong>EIP-1559</strong> activated — the largest upgrade to
                Ethereum's fee mechanism. The base transaction fee is now <strong>burned</strong>
                (permanently destroyed) rather than going to miners. This made ETH deflationary
                during periods of high activity.
              </p>
              <p>
                In November 2021, ETH reached its all-time high:{' '}
                <strong>$4,878 per coin</strong>.
              </p>

              <h3>2022: The Merge — A Revolution in 13 Seconds</h3>
              <p>
                On September 15, 2022, at 06:42 UTC, one of the most significant events in blockchain
                history occurred — <strong>The Merge</strong>. Ethereum switched from Proof of Work
                to <strong>Proof of Stake</strong> in a single block, virtually without disruption.
              </p>
              <p>
                The consequences were immediate: the network's energy consumption dropped by{' '}
                <strong>~99.95%</strong> — from levels comparable to a small country to those of a
                small city. New ETH issuance fell by roughly 90%. Miners were removed from the system;
                the network is now secured by validators who stake at least 32 ETH.
              </p>
              <p>
                The Merge proved that the Ethereum team could execute incredibly complex technical
                changes on a live system worth hundreds of billions of dollars.
              </p>

              <h3>2023–2024: Shanghai, Layer 2 and Mass Adoption</h3>
              <p>
                In April 2023, the <strong>Shanghai (Shapella)</strong> upgrade allowed validators
                to withdraw staked ETH for the first time, removing the last barrier for large
                institutional investors.
              </p>
              <p>
                The Layer 2 ecosystem — Arbitrum, Optimism, Base, zkSync — grew dramatically,
                solving the high-fees problem of the main network. Ethereum evolved into a settlement
                layer, with more and more user transactions moving to L2.
              </p>
              <p>
                In May 2024, the US SEC approved spot <strong>ETH ETFs</strong> — following Bitcoin.
                This opened Ethereum to pension funds and institutional investors via traditional
                brokerage accounts.
              </p>
            </>
          )}
        </div>
      </article>

      {/* Quotes */}
      <section className="mb-14">
        <h2 className="text-2xl font-bold text-foreground mb-6">
          {isRu ? 'Что говорят об Ethereum' : 'What They Say About Ethereum'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {ETH_QUOTES.map((q, i) => (
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
          {isRu ? 'Часто задаваемые вопросы об Ethereum' : 'Frequently Asked Questions About Ethereum'}
        </h2>
        <div className="flex flex-col gap-4">
          {ETH_FAQ.map((item, i) => (
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

      {/* Related glossary links */}
      <section className="bg-card border border-border rounded-xl p-5">
        <h3 className="text-sm font-bold text-foreground mb-3">
          {isRu ? 'Изучите термины в глоссарии' : 'Learn the terms in our glossary'}
        </h3>
        <div className="flex flex-wrap gap-2">
          {[
            { slug: 'smart-contract', label: isRu ? 'Смарт-контракт' : 'Smart Contract' },
            { slug: 'blockchain', label: isRu ? 'Блокчейн' : 'Blockchain' },
            { slug: 'defi', label: 'DeFi' },
            { slug: 'staking', label: isRu ? 'Стейкинг' : 'Staking' },
            { slug: 'gas', label: isRu ? 'Газ (Gas)' : 'Gas' },
            { slug: 'nft', label: 'NFT' },
            { slug: 'erc-20', label: 'ERC-20' },
            { slug: 'layer-2', label: 'Layer 2' },
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
