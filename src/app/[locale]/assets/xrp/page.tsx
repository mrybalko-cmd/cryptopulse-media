import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import CoinGuideLayout from '@/components/ui/CoinGuideLayout';
import { buildOg, buildTwitter, BASE } from '@/lib/metadata';
import { XRP_QUOTES, XRP_FAQ, XRP_INVESTMENT_REFERENCE } from '@/lib/xrpData';
import { SITE_NAME } from '@/lib/site';

type Props = { params: Promise<{ locale: string }> };
const SLUG = 'xrp';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const isRu = locale === 'ru';
  const title = isRu ? 'XRP: цена, история, калькулятор' : 'XRP: price, history, calculator';
  const description = isRu
    ? 'История XRP: как создали Ripple, партнёрства с банками, иск SEC 2020 года и победа в суде 2023-го. Калькулятор инвестиций в XRP за 5 и 10 лет.'
    : 'XRP history: how Ripple was created, bank partnerships, the 2020 SEC lawsuit and the 2023 court win. XRP investment calculator over 5 and 10 years.';

  return {
    // Absolute: the layout template appends ` | ${SITE_NAME}`, which costs
    // 20 characters and adds nothing here — the coin's name is already first.
    title: { absolute: title },
    description,
    keywords: isRu
      ? ['xrp история', 'ripple иск sec', 'что если бы купил xrp', 'брэд гарлингхаус', 'ripplenet', 'xrp калькулятор']
      : ['xrp history', 'ripple sec lawsuit', 'what if i bought xrp', 'brad garlinghouse', 'ripplenet', 'xrp investment calculator'],
    openGraph: buildOg({ url: `${BASE}/${locale}/assets/xrp`, title, description, locale }),
    twitter: buildTwitter({ url: `${BASE}/${locale}/assets/xrp`, title, description, locale }),
    alternates: {
      canonical: `${BASE}/${locale}/assets/xrp`,
      languages: {
        ru: `${BASE}/ru/assets/xrp`,
        en: `${BASE}/en/assets/xrp`,
        'x-default': `${BASE}/en/assets/xrp`,
      },
    },
  };
}

const GUIDE = {
  stats: [
    { label: { ru: 'Год создания', en: 'Created' }, value: '2012' },
    { label: { ru: 'Макс. запас', en: 'Max supply' }, value: '100 000 000 000' },
    { label: { ru: 'Скорость', en: 'Speed' }, value: '3–5 сек' },
    { label: { ru: 'Победа в суде', en: 'Court win' }, value: { ru: 'Июль 2023', en: 'Jul 2023' } },
  ],
  investmentReference: XRP_INVESTMENT_REFERENCE,
  faq: XRP_FAQ,
  glossaryTerms: [
    { slug: 'blockchain', label: { ru: 'Блокчейн', en: 'Blockchain' } },
    { slug: 'stablecoin', label: { ru: 'Стейблкоин', en: 'Stablecoin' } },
    { slug: 'cex', label: { ru: 'CEX', en: 'CEX' } },
    { slug: 'kyc', label: { ru: 'KYC / AML', en: 'KYC / AML' } },
    { slug: 'altcoin', label: { ru: 'Альткоин', en: 'Altcoin' } },
    { slug: 'market-cap', label: { ru: 'Капитализация', en: 'Market Cap' } },
    { slug: 'wallet', label: { ru: 'Кошелёк', en: 'Wallet' } },
    { slug: 'ico', label: { ru: 'ICO / IDO', en: 'ICO / IDO' } },
  ],
};

export default async function XrpPage({ params }: Props) {
  const { locale } = await params;
  const isRu = locale === 'ru';
  const loc = isRu ? 'ru' : 'en';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: isRu
      ? 'XRP (Ripple): история, иск SEC и победа в суде'
      : 'XRP (Ripple): History, SEC Lawsuit and Court Victory',
    description: isRu
      ? 'Полная история XRP от основания Ripple до исторического судебного решения 2023 года.'
      : 'Complete XRP history from Ripple\'s founding to the landmark 2023 court ruling.',
    inLanguage: locale,
    datePublished: '2024-01-01',
    dateModified: new Date().toISOString().slice(0, 10),
    author: { '@type': 'Organization', name: '${SITE_NAME}', url: BASE },
    publisher: { '@type': 'Organization', name: '${SITE_NAME}', url: BASE },
    mainEntityOfPage: `${BASE}/${locale}/assets/xrp`,
  };

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: XRP_FAQ.map(item => ({
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
      { '@type': 'ListItem', position: 3, name: 'XRP (Ripple)', item: `${BASE}/${locale}/assets/xrp` },
    ],
  };

  const historyContent = (
    <>
      {isRu ? (
            <>
              <h3>2004–2011: Предтеча — оригинальный Ripple</h3>
              <p>
                История XRP начинается задолго до самого XRP. В 2004 году канадский веб-разработчик
                <strong>Райан Фаггер</strong> создал концепцию RipplePay — децентрализованной
                платёжной сети на основе доверия между участниками. Идея была революционной для своего
                времени: перевод средств через цепочку доверия без центрального посредника.
              </p>
              <p>
                В 2011 году к этой идее обратились <strong>Джед МакКалеб</strong> (сооснователь
                первой крупной биткоин-биржи Mt. Gox) и <strong>Крис Ларсен</strong> (серийный
                технологический предприниматель). Они задумали переработать концепцию Ripple,
                добавив собственную цифровую валюту — XRP.
              </p>

              <h3>2012: Рождение XRP и Ripple Labs</h3>
              <p>
                В 2012 году МакКалеб, Ларсен и Артур Бритто основали компанию <strong>OpenCoin</strong>
                (позднее переименованную в Ripple Labs, затем просто Ripple). Был запущен
                <strong>XRP Ledger</strong> — блокчейн нового типа, работающий без майнинга.
              </p>
              <p>
                Ключевые особенности XRP Ledger: транзакции подтверждаются за 3–5 секунд через
                механизм консенсуса уникальных валидаторов, без энергозатратного PoW. Все 100 млрд XRP
                были созданы сразу при запуске. 80% получила компания (значительную часть заблокировала
                в escrow), 20% — основатели.
              </p>
              <p>
                В том же году Джед МакКалеб покинул Ripple после разногласий с командой.
                Впоследствии он основал <strong>Stellar (XLM)</strong> — прямого конкурента XRP.
              </p>

              <h3>2013–2016: Партнёрства с банками и первый взлёт</h3>
              <p>
                Ripple сделала ставку на корпоративных клиентов — банки и платёжные системы.
                В 2014–2015 годах компания заключила соглашения с рядом финансовых институтов,
                предлагая им технологию быстрых международных переводов на базе RippleNet.
              </p>
              <p>
                Традиционная система SWIFT требовала от 1 до 5 рабочих дней и нескольких
                посредников для международного перевода. Ripple предлагал то же самое за секунды
                и за доли цента. Банк <strong>Santander</strong> стал одним из первых крупных
                партнёров, запустив приложение для международных платежей на базе Ripple.
              </p>
              <p>
                К 2016 году с Ripple сотрудничали более 30 банков. XRP при этом торговался
                в районе <strong>$0,006</strong> — большинство банков использовали технологию
                Ripple (RippleNet), но не сам токен XRP.
              </p>

              <h3>2017–2018: Бум и ATH $3,84</h3>
              <p>
                2017 год стал годом взрывного роста для всего крипторынка, и XRP не стал исключением.
                Объявления о новых банковских партнёрствах, рост числа пользователей RippleNet и
                общий бычий рынок подтолкнули XRP с $0,006 до <strong>$3,84 в январе 2018 года</strong>
                — рост на 63 000% за год.
              </p>
              <p>
                На пике XRP briefly exceeded Ethereum по рыночной капитализации, заняв второе место
                в мире. Ripple Labs оказалась компанией с миллиардными резервами — и немедленно
                привлекла внимание регуляторов.
              </p>
              <p>
                К концу 2018 года XRP вместе со всем рынком упал до $0,30 (-92% от максимума).
              </p>

              <h3>2019–2020: Рост RippleNet и удар SEC</h3>
              <p>
                К 2020 году RippleNet объединял более 300 финансовых организаций в 40+ странах.
                Был запущен продукт <strong>ODL (On-Demand Liquidity)</strong>, использующий XRP
                как мост для мгновенного обмена валюты. Партнёры включали MoneyGram, SBI Holdings
                (Япония), Santander, American Express и других.
              </p>
              <p>
                В декабре 2020 года, за несколько дней до инаугурации Байдена, SEC
                подала иск против Ripple Labs, Брэда Гарлингхауса и Криса Ларсена. SEC утверждала,
                что XRP является незарегистрированной ценной бумагой, а Ripple незаконно провёл
                её продажу на $1,3 млрд.
              </p>
              <p>
                Реакция рынка была немедленной: XRP рухнул на 70%. Coinbase, Kraken и большинство
                американских бирж делистировали XRP. MoneyGram приостановил сотрудничество с Ripple.
              </p>

              <h3>2021–2022: Борьба в суде</h3>
              <p>
                Пока большинство криптоактивов переживали бычий рынок 2021 года, XRP торговался
                в «коридоре» — иск SEC сдерживал рост. Тем не менее XRP достиг $1,96 в апреле
                2021 года на фоне частичных позитивных новостей из судебного процесса.
              </p>
              <p>
                Суд стал историческим по масштабам: Ripple и команда юристов бились за каждый
                документ, в том числе добиваясь раскрытия внутренней переписки SEC о Bitcoin
                и Ethereum (Hinman Speech). Крипто-сообщество внимательно следило за процессом —
                его исход должен был определить статус большинства криптоактивов в США.
              </p>

              <h3>2023: Историческая победа</h3>
              <p>
                13 июля 2023 года судья Анализа Торрес вынесла частичное решение в пользу Ripple.
                Главный вывод: <strong>XRP, продаваемый на публичных биржах, не является ценной
                бумагой</strong>. Розничные инвесторы не имели оснований ожидать прибыли
                от усилий Ripple — ключевой критерий теста Хоуи.
              </p>
              <p>
                XRP взлетел на 70% в день объявления решения. Coinbase вернул XRP на листинг.
                Решение стало крупнейшей юридической победой крипто-индустрии в США и создало
                важный прецедент: большинство токенов, торгуемых на биржах, могут не являться
                ценными бумагами.
              </p>
              <p>
                В августе 2023 года SEC всё же добилась частичного решения по институциональным
                продажам XRP (признанным ценными бумагами). Ripple оштрафовали на $125 млн —
                значительно меньше заявленных SEC $2 млрд. Компания заявила о победе.
              </p>

              <h3>2024: Новый цикл и глобальная экспансия</h3>
              <p>
                В 2024 году XRP достиг нового многолетнего максимума. Ripple запустил
                собственный стейблкоин <strong>RLUSD</strong> на XRP Ledger, одобренный
                регуляторами Нью-Йорка. Компания расширила партнёрства в Японии, ОАЭ,
                Великобритании и Бразилии.
              </p>
              <p>
                После победы Трампа на выборах 2024 года, обещавшего благоприятное
                крипторегулирование, XRP взлетел до <strong>$2,90+</strong>. SEC при новой
                администрации отозвала апелляцию по делу Ripple, фактически завершив
                многолетний судебный процесс в пользу компании.
              </p>
            </>
          ) : (
            <>
              <h3>2004–2011: The Precursor — Original Ripple</h3>
              <p>
                XRP's story begins long before XRP itself. In 2004, Canadian web developer{' '}
                <strong>Ryan Fugger</strong> created the concept of RipplePay — a decentralized
                payment network based on trust between participants. The idea was revolutionary for
                its time: transferring funds through a chain of trust without a central intermediary.
              </p>
              <p>
                In 2011, <strong>Jed McCaleb</strong> (co-founder of the first major Bitcoin exchange,
                Mt. Gox) and <strong>Chris Larsen</strong> (serial tech entrepreneur) revisited this
                idea. They set out to redesign the Ripple concept, adding their own digital currency: XRP.
              </p>

              <h3>2012: Birth of XRP and Ripple Labs</h3>
              <p>
                In 2012, McCaleb, Larsen, and Arthur Britto founded <strong>OpenCoin</strong> (later
                renamed Ripple Labs, then simply Ripple). The <strong>XRP Ledger</strong> launched —
                a new type of blockchain operating without mining.
              </p>
              <p>
                Key features: transactions settle in 3–5 seconds via a unique node list consensus
                mechanism, without energy-intensive PoW. All 100 billion XRP were created at launch.
                80% went to the company (a large portion locked in escrow), 20% to founders.
              </p>
              <p>
                That same year, Jed McCaleb left Ripple after disagreements with the team. He later
                founded <strong>Stellar (XLM)</strong> — a direct XRP competitor.
              </p>

              <h3>2013–2016: Bank Partnerships and Early Growth</h3>
              <p>
                Ripple targeted enterprise clients — banks and payment systems. Between 2014 and 2015,
                the company signed agreements with several financial institutions, offering them fast
                international transfer technology via RippleNet.
              </p>
              <p>
                Traditional SWIFT transfers took 1–5 business days and multiple intermediaries.
                Ripple offered the same in seconds for fractions of a cent. <strong>Santander</strong>
                was one of the first major partners, launching an international payments app powered
                by Ripple.
              </p>
              <p>
                By 2016, over 30 banks were partnered with Ripple. XRP itself traded around{' '}
                <strong>$0.006</strong> — most banks used Ripple's technology (RippleNet) but not
                the XRP token itself.
              </p>

              <h3>2017–2018: The Bull Run and $3.84 ATH</h3>
              <p>
                2017 was a year of explosive growth for the entire crypto market, and XRP was no
                exception. New banking partnership announcements, growing RippleNet adoption, and
                the overall bull market pushed XRP from $0.006 to{' '}
                <strong>$3.84 in January 2018</strong> — a gain of 63,000% in one year.
              </p>
              <p>
                At its peak, XRP briefly surpassed Ethereum in market cap, claiming second place
                globally. Ripple Labs found itself with billions in reserves — and immediately drew
                regulatory scrutiny.
              </p>
              <p>
                By end of 2018, XRP fell to $0.30 alongside the rest of the market (-92% from ATH).
              </p>

              <h3>2019–2020: RippleNet Growth and the SEC Blow</h3>
              <p>
                By 2020, RippleNet connected over 300 financial institutions in 40+ countries.
                The <strong>ODL (On-Demand Liquidity)</strong> product launched, using XRP as a
                bridge for instant currency exchange. Partners included MoneyGram, SBI Holdings
                (Japan), Santander, American Express, and others.
              </p>
              <p>
                In December 2020, days before Biden's inauguration, the SEC filed a lawsuit against
                Ripple Labs, Brad Garlinghouse, and Chris Larsen. The SEC alleged that XRP was an
                unregistered security and that Ripple had illegally sold $1.3 billion worth of it.
              </p>
              <p>
                Market reaction was immediate: XRP crashed 70%. Coinbase, Kraken, and most US
                exchanges delisted XRP. MoneyGram suspended its partnership with Ripple.
              </p>

              <h3>2021–2022: Fighting in Court</h3>
              <p>
                While most crypto assets enjoyed the 2021 bull market, XRP traded in a range —
                held back by the SEC lawsuit. Still, XRP reached $1.96 in April 2021 on partial
                positive court developments.
              </p>
              <p>
                The case became historic in scope: Ripple and its legal team fought over every
                document, including forcing disclosure of the SEC's internal communications about
                Bitcoin and Ethereum (the Hinman Speech). The crypto community watched closely —
                the outcome would define the status of most crypto assets in the US.
              </p>

              <h3>2023: The Historic Victory</h3>
              <p>
                On July 13, 2023, Judge Analisa Torres issued a partial ruling in Ripple's favor.
                The key finding: <strong>XRP sold on public exchanges is not a security</strong>.
                Retail investors had no reasonable expectation of profits from Ripple's efforts —
                the key prong of the Howey test.
              </p>
              <p>
                XRP surged 70% on the day of the announcement. Coinbase relisted XRP. The ruling
                became the biggest legal victory for the US crypto industry and set an important
                precedent: most tokens traded on exchanges may not be securities.
              </p>
              <p>
                In August 2023, the SEC did win a partial ruling on institutional XRP sales (deemed
                securities). Ripple was fined $125 million — far less than the SEC's requested $2
                billion. The company declared victory.
              </p>

              <h3>2024: A New Cycle and Global Expansion</h3>
              <p>
                In 2024, XRP reached new multi-year highs. Ripple launched its own stablecoin{' '}
                <strong>RLUSD</strong> on the XRP Ledger, approved by New York regulators. The
                company expanded partnerships in Japan, the UAE, the UK, and Brazil.
              </p>
              <p>
                Following Trump's 2024 election victory — with promises of favorable crypto
                regulation — XRP surged to <strong>$2.90+</strong>. The SEC under the new
                administration withdrew its appeal in the Ripple case, effectively ending the
                years-long legal battle in the company's favor.
              </p>
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
        tagline={isRu ? 'Цифровой мост для международных банковских платежей' : 'Digital bridge for international bank payments'}
        historyTitle={isRu ? 'История XRP: от платёжной сети до судебной битвы с SEC' : 'XRP History: From Payment Network to SEC Legal Battle'}
        historyContent={historyContent}
        guide={GUIDE}
        quotes={XRP_QUOTES}
      />
    </>
  );
}
