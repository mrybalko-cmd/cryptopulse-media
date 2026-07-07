import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { buildOg, BASE } from '@/lib/metadata';
import BitcoinCalculator from '@/components/ui/BitcoinCalculator';
import { BTC_QUOTES, BTC_FAQ } from '@/lib/bitcoinData';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const isRu = locale === 'ru';
  const title = isRu
    ? 'Bitcoin (BTC) — История, цена и калькулятор инвестиций'
    : 'Bitcoin (BTC) — History, Price & Investment Calculator';
  const description = isRu
    ? 'Полная история Bitcoin: кто создал, история с пиццей, рост цены за 15 лет, знаменитые цитаты. Калькулятор: сколько бы вы заработали, вложив $100–5000 в BTC 5, 10 или 15 лет назад.'
    : 'Complete Bitcoin history: who created it, the pizza story, 15 years of price growth, famous quotes. Calculator: how much would you have earned investing $100–5000 in BTC 5, 10, or 15 years ago.';

  return {
    title,
    description,
    keywords: isRu
      ? ['биткоин история', 'что если бы купил биткоин', 'биткоин пицца', 'сатоши накамото', 'биткоин калькулятор']
      : ['bitcoin history', 'what if i bought bitcoin', 'bitcoin pizza story', 'satoshi nakamoto', 'bitcoin investment calculator'],
    openGraph: buildOg({ url: `${BASE}/${locale}/assets/bitcoin`, title, description, locale }),
    alternates: {
      canonical: `${BASE}/${locale}/assets/bitcoin`,
      languages: {
        ru: `${BASE}/ru/assets/bitcoin`,
        en: `${BASE}/en/assets/bitcoin`,
      },
    },
  };
}

export default async function BitcoinPage({ params }: Props) {
  const { locale } = await params;
  const isRu = locale === 'ru';
  const loc = isRu ? 'ru' : 'en';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: isRu
      ? 'Bitcoin (BTC): история, создание и рост за 15 лет'
      : 'Bitcoin (BTC): History, Creation and 15 Years of Growth',
    description: isRu
      ? 'Полная история Bitcoin от белой книги Сатоши до сегодняшнего дня.'
      : 'Complete history of Bitcoin from Satoshi\'s whitepaper to today.',
    inLanguage: locale,
    datePublished: '2024-01-01',
    dateModified: new Date().toISOString().slice(0, 10),
    author: { '@type': 'Organization', name: 'CryptoPulse.media', url: BASE },
    publisher: { '@type': 'Organization', name: 'CryptoPulse.media', url: BASE },
    mainEntityOfPage: `${BASE}/${locale}/assets/bitcoin`,
  };

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: BTC_FAQ.map(item => ({
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
      { '@type': 'ListItem', position: 3, name: 'Bitcoin (BTC)', item: `${BASE}/${locale}/assets/bitcoin` },
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
        <span className="text-foreground">Bitcoin (BTC)</span>
      </nav>

      {/* Hero */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">₿</span>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight">
              Bitcoin <span className="text-muted font-normal text-2xl">BTC</span>
            </h1>
            <p className="text-muted text-sm mt-1">
              {isRu ? 'Первая и самая известная криптовалюта в мире' : 'The first and most recognized cryptocurrency in the world'}
            </p>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          {[
            { label: isRu ? 'Год создания' : 'Created', value: '2009' },
            { label: isRu ? 'Макс. запас' : 'Max supply', value: '21 000 000' },
            { label: isRu ? 'Создатель' : 'Creator', value: 'Satoshi Nakamoto' },
            { label: isRu ? 'Халвингов' : 'Halvings', value: '4 (2012–2024)' },
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
        <BitcoinCalculator locale={locale} />
      </div>

      {/* History */}
      <article className="mb-14">
        <h2 className="text-2xl font-bold text-foreground mb-8">
          {isRu ? 'История Bitcoin: от идеи до цифрового золота' : 'Bitcoin History: From Idea to Digital Gold'}
        </h2>

        <div className="prose prose-invert prose-sm max-w-none
          prose-headings:text-foreground prose-headings:font-semibold
          prose-p:text-muted prose-p:leading-relaxed
          prose-strong:text-foreground
          prose-a:text-accent prose-a:no-underline hover:prose-a:underline
          prose-li:text-muted">

          {isRu ? (
            <>
              <h3>2008: Рождение идеи на пике финансового кризиса</h3>
              <p>
                31 октября 2008 года, когда мировая финансовая система трещала по швам из-за ипотечного кризиса,
                анонимный программист под псевдонимом <strong>Сатоши Накамото</strong> опубликовал в криптографическом
                рассылочном списке девятистраничный документ — <strong>«Bitcoin: A Peer-to-Peer Electronic Cash System»</strong>.
                Это была белая книга, описывающая децентрализованную цифровую валюту без банков и правительств.
              </p>
              <p>
                Идея была революционной: создать систему, в которой два человека могут совершать транзакции напрямую,
                без посредников. В основу легла технология{' '}
                <Link href={`${glossaryBase}#blockchain`}>блокчейна</Link> — неизменяемой цепочки блоков с записями
                всех транзакций, защищённой криптографией.
              </p>

              <h3>2009: Первые блоки и первая транзакция</h3>
              <p>
                3 января 2009 года Сатоши добыл <strong>Genesis Block</strong> — самый первый блок в истории Bitcoin.
                В него было намеренно зашифровано сообщение из газеты The Times:
                <em>«Chancellor on brink of second bailout for banks»</em> («Канцлер на пороге второго спасения банков»).
                Это был недвусмысленный комментарий о неудачах традиционной финансовой системы.
              </p>
              <p>
                12 января 2009 года состоялась первая транзакция: Сатоши отправил <strong>10 биткоинов</strong>{' '}
                Халу Финни — известному криптографу и одному из первых сторонников проекта. Финни написал в Twitter:
                <em>«Running bitcoin»</em> — и эти два слова вошли в историю.
              </p>
              <p>
                В то время биткоин не имел никакой денежной ценности. Это был просто эксперимент нескольких десятков
                энтузиастов-криптографов.
              </p>

              <h3>2010: Пицца за 10 000 BTC — первая коммерческая сделка</h3>
              <p>
                22 мая 2010 года программист из Флориды <strong>Ласло Ханьеч</strong> написал на форуме BitcoinTalk:
                «Заплачу 10 000 биткоинов за две пиццы. Желательно Papa John's». Пользователь под ником
                Jercos согласился и заказал две пиццы за $41. Так была совершена первая задокументированная
                коммерческая транзакция в Bitcoin.
              </p>
              <p>
                Сегодня <strong>10 000 BTC — это сотни миллионов долларов</strong>. Ласло не жалеет об этом:
                «Я рад, что сыграл роль в становлении Bitcoin. Пиццы были вкусными». 22 мая отмечается как
                <strong>Bitcoin Pizza Day</strong> во всём мире.
              </p>
              <p>
                В том же году появилась первая биржа BitcoinMarket.com, и впервые была установлена цена BTC:
                <strong>$0,0008</strong> за монету. К концу 2010 года цена выросла до $0,30.
              </p>

              <h3>2011–2013: Первые пузыри, $1 и $1 000</h3>
              <p>
                В феврале 2011 года Bitcoin достиг паритета с долларом: <strong>1 BTC = $1</strong>.
                Это событие привлекло широкое внимание СМИ. В июне 2011 года цена достигла $30 — и тут же
                рухнула до $2 к ноябрю. Первый криптовалютный пузырь лопнул.
              </p>
              <p>
                Тогда же WikiLeaks начал принимать Bitcoin для пожертвований после того, как Visa, Mastercard
                и PayPal заблокировали платежи в их пользу. Это придало Bitcoin репутацию инструмента
                финансовой свободы.
              </p>
              <p>
                В ноябре 2012 года состоялся <Link href={`${glossaryBase}#halving`}>первый халвинг</Link>:
                вознаграждение{' '}
                <Link href={`${glossaryBase}#mining`}>майнеров</Link> снизилось с 50 до 25 BTC за блок.
                В ноябре 2013 года Bitcoin впервые преодолел отметку <strong>$1 000</strong>.
              </p>

              <h3>2014: Крах Mt. Gox и проверка на прочность</h3>
              <p>
                Февраль 2014 года стал чёрным месяцем для Bitcoin. Крупнейшая биржа мира <strong>Mt. Gox</strong>,
                через которую проходило 70% всех сделок с BTC, объявила о взломе: хакеры похитили
                <strong>850 000 биткоинов</strong>. Биржа обанкротилась, цена рухнула с $800 до $300.
              </p>
              <p>
                Но Bitcoin выжил. Это стало свидетельством устойчивости децентрализованной системы: протокол
                не был взломан — была взломана лишь централизованная биржа.
              </p>

              <h3>2015–2017: Институциональный интерес и эпический рост до $20 000</h3>
              <p>
                Второй халвинг (июль 2016) снизил вознаграждение до 12,5 BTC. Это совпало с постепенным
                восстановлением доверия: крупные компании начали изучать блокчейн-технологии. В 2017 году
                Япония легализовала Bitcoin как платёжное средство.
              </p>
              <p>
                2017 год стал годом безумного роста. Биткоин вырос с $1 000 в январе до <strong>$19 783</strong>{' '}
                в декабре — рост на 1 900% за год. В декабре 2017 года CME и CBOE запустили фьючерсы на Bitcoin,
                что открыло рынок для институциональных инвесторов.
              </p>

              <h3>2018–2019: «Крипто-зима» и медленное возрождение</h3>
              <p>
                После пика декабря 2017 года началась жестокая коррекция. К концу 2018 года BTC стоил около
                <strong>$3 200</strong> — падение на 84%. СМИ объявили «смерть биткоина» в 436-й раз.
                Но инфраструктура продолжала строиться: кошельки, кастодиальные сервисы, платёжные системы.
              </p>
              <p>
                К июлю 2019 года Bitcoin восстановился до $11 000, после чего снова скорректировался.
              </p>

              <h3>2020–2021: Институциональная революция и ATH $69 000</h3>
              <p>
                Пандемия COVID-19 поначалу обвалила Bitcoin вместе со всеми рынками: в марте 2020 года цена
                упала до <strong>$4 000</strong>. Но затем началось беспрецедентное ралли.
              </p>
              <p>
                В 2020 году <strong>MicroStrategy</strong> под руководством Майкла Сейлора начала конвертировать
                казначейские резервы в Bitcoin. <strong>Tesla</strong> купила BTC на $1,5 млрд в феврале 2021 года.
                В июне 2021 года <strong>Сальвадор</strong> стал первой страной, признавшей Bitcoin
                законным платёжным средством.
              </p>
              <p>
                В ноябре 2021 года Bitcoin достиг исторического максимума —{' '}
                <strong>$69 000 за монету</strong>. Рыночная капитализация превысила $1,2 триллиона.
              </p>

              <h3>2022: Обрушение FTX и новое дно</h3>
              <p>
                2022 год принёс две катастрофы. Сначала рухнула экосистема LUNA/UST (май 2022), уничтожив
                $40 млрд за несколько дней. Затем в ноябре обанкротилась <strong>биржа FTX</strong> — одна
                из крупнейших в мире. Bitcoin упал до <strong>$16 000</strong>. Снова звучали некрологи.
              </p>

              <h3>2023–2024: ETF, халвинг и новый цикл</h3>
              <p>
                В июне 2023 года BlackRock — крупнейший в мире управляющий активами — подал заявку на
                спотовый Bitcoin ETF. Это стало поворотным моментом. 10 января 2024 года Комиссия по ценным
                бумагам США <strong>одобрила сразу 11 спотовых Bitcoin ETF</strong>, открыв прямой доступ
                к BTC для миллионов инвесторов через обычные брокерские счета.
              </p>
              <p>
                19 апреля 2024 года состоялся <strong>четвёртый халвинг</strong>: вознаграждение снизилось
                до 3,125 BTC за блок. В марте 2024 года Bitcoin установил новый ATH — <strong>$73 000</strong>.
              </p>
            </>
          ) : (
            <>
              <h3>2008: Born in the Midst of Financial Crisis</h3>
              <p>
                On October 31, 2008, as the global financial system was crumbling under the weight of the
                mortgage crisis, an anonymous programmer using the pseudonym <strong>Satoshi Nakamoto</strong>{' '}
                published a nine-page document in a cryptography mailing list: <strong>"Bitcoin: A Peer-to-Peer
                Electronic Cash System"</strong>. This white paper described a decentralized digital currency
                operating without banks or governments.
              </p>
              <p>
                The idea was revolutionary: create a system where two people can transact directly, without
                intermediaries. At its core was{' '}
                <Link href={`${glossaryBase}#blockchain`}>blockchain</Link> technology — an immutable chain
                of blocks recording all transactions, secured by cryptography.
              </p>

              <h3>2009: The First Blocks and First Transaction</h3>
              <p>
                On January 3, 2009, Satoshi mined the <strong>Genesis Block</strong> — the very first block
                in Bitcoin history. Embedded in it was a message from The Times newspaper:
                <em>"Chancellor on brink of second bailout for banks"</em> — an unmistakable commentary on the
                failures of the traditional financial system.
              </p>
              <p>
                On January 12, 2009, the first transaction occurred: Satoshi sent <strong>10 Bitcoin</strong>{' '}
                to Hal Finney — a renowned cryptographer and one of the project's earliest supporters.
                Finney tweeted: <em>"Running bitcoin"</em> — two words that made history.
              </p>
              <p>
                At that time, Bitcoin had no monetary value. It was simply an experiment among a few dozen
                cryptography enthusiasts.
              </p>

              <h3>2010: Pizza for 10,000 BTC — The First Commercial Deal</h3>
              <p>
                On May 22, 2010, a Florida programmer named <strong>Laszlo Hanyecz</strong> posted on the
                BitcoinTalk forum: "I'll pay 10,000 bitcoins for two pizzas. Papa John's preferred." A user
                named Jercos agreed and ordered two pizzas for $41. This was the first documented commercial
                Bitcoin transaction in history.
              </p>
              <p>
                Today, <strong>10,000 BTC is worth hundreds of millions of dollars</strong>. Laszlo has no
                regrets: "I'm happy I played a role in Bitcoin's growth. The pizzas were good." May 22 is
                celebrated as <strong>Bitcoin Pizza Day</strong> worldwide.
              </p>
              <p>
                That same year, the first exchange BitcoinMarket.com appeared, establishing Bitcoin's first
                price: <strong>$0.0008</strong> per coin. By end of 2010, the price had risen to $0.30.
              </p>

              <h3>2011–2013: First Bubbles, $1 and $1,000</h3>
              <p>
                In February 2011, Bitcoin reached parity with the dollar: <strong>1 BTC = $1</strong>.
                This attracted widespread media attention. By June 2011, the price hit $30 — then crashed
                to $2 by November. The first crypto bubble had burst.
              </p>
              <p>
                Around this time, WikiLeaks began accepting Bitcoin for donations after Visa, Mastercard,
                and PayPal blocked payments. This gave Bitcoin a reputation as a tool for financial freedom.
              </p>
              <p>
                In November 2012, the{' '}
                <Link href={`${glossaryBase}#halving`}>first halving</Link> occurred:
                the <Link href={`${glossaryBase}#mining`}>mining</Link> reward dropped from 50 to 25 BTC
                per block. By November 2013, Bitcoin first crossed <strong>$1,000</strong>.
              </p>

              <h3>2014: Mt. Gox Collapse — A Test of Resilience</h3>
              <p>
                February 2014 was Bitcoin's darkest month. The world's largest exchange, <strong>Mt. Gox</strong>,
                handling 70% of all BTC trades, announced it had been hacked: thieves had stolen
                <strong>850,000 Bitcoin</strong>. The exchange went bankrupt, and the price crashed from $800 to $300.
              </p>
              <p>
                But Bitcoin survived. This proved the resilience of decentralized systems: the protocol itself
                was never hacked — only a centralized exchange had been compromised.
              </p>

              <h3>2015–2017: Institutional Interest and the Epic Rise to $20,000</h3>
              <p>
                The second halving (July 2016) reduced the reward to 12.5 BTC. This coincided with a gradual
                restoration of trust as major companies began exploring blockchain technology. In 2017, Japan
                legalized Bitcoin as a payment method.
              </p>
              <p>
                2017 was a year of explosive growth. Bitcoin climbed from $1,000 in January to{' '}
                <strong>$19,783</strong> in December — a 1,900% gain in a single year. In December 2017,
                CME and CBOE launched Bitcoin futures, opening the market to institutional investors.
              </p>

              <h3>2018–2019: "Crypto Winter" and Slow Recovery</h3>
              <p>
                After December 2017's peak, a brutal correction began. By end of 2018, BTC was at roughly
                <strong>$3,200</strong> — an 84% drop. Media declared "Bitcoin dead" for the 436th time.
                But infrastructure kept growing: wallets, custody services, payment systems.
              </p>

              <h3>2020–2021: Institutional Revolution and ATH of $69,000</h3>
              <p>
                The COVID-19 pandemic initially crashed Bitcoin along with all markets: in March 2020, the
                price fell to <strong>$4,000</strong>. Then came an unprecedented rally.
              </p>
              <p>
                In 2020, <strong>MicroStrategy</strong> under Michael Saylor began converting treasury reserves
                into Bitcoin. <strong>Tesla</strong> bought $1.5 billion in BTC in February 2021.
                In June 2021, <strong>El Salvador</strong> became the first country to adopt Bitcoin as
                legal tender.
              </p>
              <p>
                In November 2021, Bitcoin reached its all-time high:{' '}
                <strong>$69,000 per coin</strong>. The market cap exceeded $1.2 trillion.
              </p>

              <h3>2022: FTX Collapse and a New Low</h3>
              <p>
                2022 brought two catastrophes. First, the LUNA/UST ecosystem collapsed (May 2022), destroying
                $40 billion in days. Then in November, <strong>FTX exchange</strong> — one of the world's
                largest — went bankrupt. Bitcoin fell to <strong>$16,000</strong>. Obituaries were written again.
              </p>

              <h3>2023–2024: ETFs, Halving and a New Cycle</h3>
              <p>
                In June 2023, BlackRock — the world's largest asset manager — filed for a spot Bitcoin ETF.
                This was a pivotal moment. On January 10, 2024, the US Securities and Exchange Commission
                <strong>approved 11 spot Bitcoin ETFs</strong> simultaneously, opening direct BTC access
                to millions of investors through ordinary brokerage accounts.
              </p>
              <p>
                On April 19, 2024, the <strong>fourth halving</strong> occurred: the reward dropped to
                3.125 BTC per block. In March 2024, Bitcoin set a new ATH of <strong>$73,000</strong>.
              </p>
            </>
          )}
        </div>
      </article>

      {/* Quotes */}
      <section className="mb-14">
        <h2 className="text-2xl font-bold text-foreground mb-6">
          {isRu ? 'Что говорят о Bitcoin' : 'What They Say About Bitcoin'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {BTC_QUOTES.map((q, i) => (
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
          {isRu ? 'Часто задаваемые вопросы о Bitcoin' : 'Frequently Asked Questions About Bitcoin'}
        </h2>
        <div className="flex flex-col gap-4">
          {BTC_FAQ.map((item, i) => (
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
            { slug: 'blockchain', label: isRu ? 'Блокчейн' : 'Blockchain' },
            { slug: 'mining', label: isRu ? 'Майнинг' : 'Mining' },
            { slug: 'halving', label: isRu ? 'Халвинг' : 'Halving' },
            { slug: 'wallet', label: isRu ? 'Кошелёк' : 'Wallet' },
            { slug: 'private-key', label: isRu ? 'Приватный ключ' : 'Private Key' },
            { slug: 'seed-phrase', label: isRu ? 'Seed-фраза' : 'Seed Phrase' },
            { slug: 'defi', label: 'DeFi' },
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
