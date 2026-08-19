/**
 * The second five: the United States, the United Kingdom, Japan, China and
 * South Korea. Checked on 19 August 2026.
 *
 * Unlike the first batch these are not all "legal". China is banned and South
 * Korea restricted, which is deliberate — it puts the template through the
 * statuses it had never rendered, and "is crypto banned in China" is a question
 * people actually type.
 *
 * Three of the five are mid-change, and the pages say so rather than writing
 * the pending state as the current one: the US market-structure bill is stuck
 * in the Senate, Japan's 20% rate is a bill and not yet law, and Korea's tax
 * starts in January 2027.
 */
import { readFileSync } from 'node:fs';
import { createClient } from '@sanity/client';

const env = Object.fromEntries(
  readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter(l => l.includes('=') && !l.trim().startsWith('#'))
    .map(l => {
      const i = l.indexOf('=');
      return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^["']|["']$/g, '')];
    })
);

const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

interface Side {
  intro: string; figures: string; body: string; allowed: string; restricted: string;
  timeline: string; faq: string; sources: string; related: string;
  seoTitle: string; seoDescription: string;
}

const COUNTRIES: { iso2: string; ru: Side; en: Side }[] = [

/* ═══════════════════════════ United States ═══════════════════════════ */
{
  iso2: 'US',
  ru: {
    intro:
      'Криптовалюта в США легальна, но единого закона о ней до сих пор нет. Налоговая считает криптоактив имуществом, поэтому прибыль облагается как прирост капитала: продержали больше года — ставка ниже, меньше года — платите как с обычного дохода. ' +
      'Правила для рынка делят между собой SEC и CFTC, и закон, который развёл бы их полномочия, к августу 2026 года так и не принят.',
    figures: [
      'ДЕРЖАТЬ ОТ ГОДА | 0–20% | долгосрочная ставка на прирост | ok',
      'ПРОДАТЬ РАНЬШЕ | до 37% | как обычный доход | warn',
      'СТЕЙКИНГ И МАЙНИНГ | Облагается | доход в момент получения | warn',
      'ОТЧЁТНОСТЬ БИРЖ | 1099-DA | площадки сообщают в налоговую | warn',
      'СТЕЙБЛКОИНЫ | Закон есть | GENIUS Act принят в июле 2025 | ok',
      'ЗАКОН О РЫНКЕ | Не принят | CLARITY Act застрял в Сенате | warn',
    ].join('\n'),
    body: `## Кто и как регулирует крипту в США

Ответ неудобный: несколько ведомств сразу, и они не всегда согласны друг с другом. Комиссия по ценным бумагам считает значительную часть токенов ценными бумагами и требует регистрации. Комиссия по товарным фьючерсам относит биткоин и эфир к товарам и регулирует производные на них. Между этими позициями годами шли суды, а компании тем временем гадали, под чьё определение попадают.

Поверх федерального уровня работают штаты. В Нью-Йорке действует отдельная лицензия BitLicense, получить которую дороже и дольше, чем разрешение во многих странах целиком.

Первый настоящий сдвиг случился в июле 2025 года: принят GENIUS Act — первый федеральный закон, написанный специально под криптоактив. Он касается стейблкоинов: кто вправе их выпускать, как делятся полномочия штатов и федерального центра, что должно лежать в резервах и можно ли платить держателю проценты.

Второй закон, [CLARITY Act](https://www.congress.gov/), должен был закрыть остальное — развести SEC и CFTC и наконец сказать, кто за что отвечает. Палата представителей приняла его ещё в июле 2025 года, банковский комитет Сената одобрил в мае 2026-го со счётом 15:9, а 22 июля появился сводный сенатский текст на шестьсот с лишним страниц. Голосов до августовских каникул не набралось, и реалистичным сроком называют сентябрь.

Спорят о трёх вещах: кто следит за соблюдением этических правил, сохранятся ли вознаграждения держателям стейблкоинов и как далеко простирается защита разработчиков.

## Налоги: как считает налоговая

Служба внутренних доходов ещё в 2014 году определила криптовалюту как имущество, и с тех пор логика не менялась. Каждая продажа, обмен одной монеты на другую и оплата покупки криптовалютой — это отчуждение имущества, по которому нужно посчитать прибыль или убыток.

Ставка зависит от срока владения. Продержали больше года — долгосрочный прирост, ставка 0%, 15% или 20% в зависимости от вашего дохода. Меньше года — краткосрочный, и он облагается по обычной шкале подоходного налога, доходящей до 37%.

Того «порога мелких сделок», который есть в Европе, здесь нет: купить кофе за биткоин формально означает отчуждение имущества и повод посчитать прибыль. Законопроекты о таком пороге вносились не раз и ни один не прошёл.

Стейкинг, майнинг и полученная криптой зарплата — это доход в момент получения, по рыночной цене того дня. Дальнейшее подорожание уже считается приростом капитала.

С 2025 года у налоговой появился собственный источник данных: биржи и брокеры отчитываются по форме 1099-DA. Раньше сведения приходили только от самого налогоплательщика.`,
    allowed: [
      'Покупать, хранить, продавать и переводить криптоактивы',
      'Держать биткоин-ETF на обычном брокерском счёте',
      'Майнить и получать стейкинг-вознаграждения, задекларировав доход',
      'Платить криптой там, где её принимают',
    ].join('\n'),
    restricted: [
      'Порога мелких сделок нет: оплата кофе — это отчуждение имущества',
      'В Нью-Йорке площадке нужна отдельная лицензия BitLicense',
      'Часть токенов SEC считает ценными бумагами со всеми последствиями',
      'Правила для рынка не достроены — CLARITY Act пока не принят',
    ].join('\n'),
    timeline: [
      '2014 | Налоговая объявляет криптовалюту имуществом. Определение держится по сей день и задаёт всю налоговую логику.',
      '2015 | Нью-Йорк вводит BitLicense — первую в стране отдельную лицензию для криптокомпаний.',
      'Январь 2024 | Одобрены спотовые биткоин-ETF: криптоактив приходит на обычные брокерские счета.',
      '2025 | Биржи начинают отчитываться перед налоговой по форме 1099-DA.',
      '* Июль 2025 | Принят GENIUS Act — первый федеральный закон, написанный под криптоактив. Речь о стейблкоинах.',
      'Август 2026 | CLARITY Act прошёл Палату и банковский комитет Сената, но голосов не набрал. Новый ориентир — сентябрь.',
    ].join('\n'),
    faq: [
      'Нужно ли платить налог с прибыли от криптовалюты в США? | Да. Криптовалюта считается имуществом, и каждая продажа, обмен или оплата покупки — это отчуждение, по которому считается прибыль. Ставка зависит от срока владения: до года — до 37%, дольше — 0%, 15% или 20%.',
      'Облагается ли обмен одной монеты на другую? | Да, это тоже отчуждение имущества. Тот факт, что доллары вы при этом не получали, ничего не меняет.',
      'Есть ли необлагаемый минимум для мелких покупок? | Нет. Оплата чашки кофе формально требует расчёта прибыли. Законопроекты о таком пороге вносились неоднократно и ни один не принят.',
      'Что даст CLARITY Act, если его примут? | Он разведёт полномочия SEC и CFTC и определит, какие токены считаются ценными бумагами, а какие товарами. Сейчас этот вопрос решают суды по отдельным делам.',
      'Правда ли, что биржи теперь сами сообщают о моих сделках? | Да, с 2025 года действует форма 1099-DA: площадки и брокеры передают данные в налоговую напрямую.',
    ].join('\n'),
    sources: [
      'SEC — Комиссия по ценным бумагам и биржам | https://www.sec.gov/',
      'CFTC — Комиссия по торговле товарными фьючерсами | https://www.cftc.gov/',
      'IRS — Служба внутренних доходов, раздел о цифровых активах | https://www.irs.gov/filing/digital-assets',
      'Конгресс США — тексты и статус законопроектов | https://www.congress.gov/',
    ].join('\n'),
    related: [
      'sec-otkryla-peresmotr-pravil-etf-kripto-produkty-perekhodyat-v-tekhnologicheski-neytralnuyu-sred',
      'strategy-polnaya-istoriya-bitkoin-kazny-maikla-seilora',
    ].join('\n'),
    seoTitle: 'Криптовалюта в США: регулирование, налоги и лицензии',
    seoDescription:
      'Как в США облагается прибыль от криптовалюты, чем занимаются SEC и CFTC, что уже принято и что застряло в Сенате. Данные проверены по сайтам ведомств.',
  },
  en: {
    intro:
      'Crypto is legal in the United States, and there is still no single law covering it. The tax authority treats a crypto asset as property, so profit is a capital gain: hold for more than a year and the rate drops, sell sooner and it is taxed as ordinary income. ' +
      'Market rules are split between the SEC and the CFTC, and the bill meant to separate their remits had not passed as of August 2026.',
    figures: [
      'HELD OVER A YEAR | 0–20% | long-term capital gains | ok',
      'SOLD SOONER | up to 37% | taxed as ordinary income | warn',
      'STAKING AND MINING | Taxable | income when received | warn',
      'EXCHANGE REPORTING | 1099-DA | venues report to the IRS | warn',
      'STABLECOINS | Law passed | the GENIUS Act, July 2025 | ok',
      'MARKET STRUCTURE | Not passed | the CLARITY Act is stuck | warn',
    ].join('\n'),
    body: `## Who regulates crypto in the United States

The awkward answer is several agencies at once, and they have not always agreed. The Securities and Exchange Commission treats a large share of tokens as securities requiring registration. The Commodity Futures Trading Commission treats bitcoin and ether as commodities and regulates derivatives on them. The gap between those positions was litigated for years while companies guessed which definition applied to them.

States sit on top of the federal layer. New York runs its own BitLicense, which costs more and takes longer than full authorisation in many countries.

The first real movement came in July 2025 with the GENIUS Act — the first federal statute written specifically for a crypto asset. It governs stablecoins: who may issue them, how state and federal oversight divide, what has to sit in reserves, and whether a holder may be paid interest.

A second bill, the [CLARITY Act](https://www.congress.gov/), was meant to handle the rest: separate SEC and CFTC authority and finally say who answers for what. The House passed it in July 2025, the Senate Banking Committee cleared it 15–9 in May 2026, and a merged Senate text of six hundred-odd pages appeared on 22 July. The votes were not there before the August recess, and September is now the realistic window.

Three fights remain: who enforces the ethics provisions, whether stablecoin rewards survive, and how far protections for developers reach.

## Tax: how the IRS counts it

The Internal Revenue Service classified crypto as property back in 2014, and the logic has not changed since. Every sale, every swap of one coin for another, and every purchase paid for in crypto is a disposal of property on which a gain or loss must be worked out.

The rate follows the holding period. More than a year and it is a long-term gain at 0%, 15% or 20% depending on your income. Less than a year and it is short-term, taxed on the ordinary income scale that reaches 37%.

There is no de minimis threshold of the kind Europe has: buying coffee with bitcoin is formally a disposal and a taxable event. Bills to create one have been introduced repeatedly and none has passed.

Staking, mining and being paid in crypto are income at the moment of receipt, at that day's market price. Later appreciation is then a capital gain.

Since 2025 the IRS has had its own data: exchanges and brokers report on Form 1099-DA. Before that the only source was the taxpayer.`,
    allowed: [
      'Buy, hold, sell and transfer crypto assets',
      'Hold a bitcoin ETF in an ordinary brokerage account',
      'Mine and earn staking rewards, declaring the income',
      'Pay in crypto wherever it is accepted',
    ].join('\n'),
    restricted: [
      'No de minimis rule: paying for coffee is a taxable disposal',
      'New York requires a separate BitLicense to operate',
      'The SEC treats many tokens as securities, with everything that follows',
      'Market rules are unfinished — the CLARITY Act has not passed',
    ].join('\n'),
    timeline: [
      '2014 | The IRS declares crypto to be property. That definition still stands and drives all the tax logic.',
      '2015 | New York introduces the BitLicense, the country\'s first dedicated licence for crypto firms.',
      'January 2024 | Spot bitcoin ETFs are approved, bringing crypto onto ordinary brokerage accounts.',
      '2025 | Exchanges begin reporting to the IRS on Form 1099-DA.',
      '* July 2025 | The GENIUS Act passes — the first federal law written for a crypto asset. It covers stablecoins.',
      'August 2026 | The CLARITY Act has cleared the House and Senate Banking Committee but lacks floor votes. September is the new target.',
    ].join('\n'),
    faq: [
      'Do I pay tax on crypto profits in the US? | Yes. Crypto is property, so every sale, swap or purchase paid in it is a disposal with a gain to compute. The rate depends on holding period: under a year up to 37%, over a year 0%, 15% or 20%.',
      'Is swapping one coin for another taxable? | Yes, that is a disposal too. Never touching dollars makes no difference.',
      'Is there an allowance for small purchases? | No. Buying a coffee formally requires a gain calculation. De minimis bills have been introduced repeatedly and none has passed.',
      'What would the CLARITY Act do? | Separate SEC and CFTC authority and define which tokens are securities and which are commodities. Today that is settled case by case in court.',
      'Do exchanges report my trades now? | Yes. Form 1099-DA has applied since 2025, and venues and brokers send the data to the IRS directly.',
    ].join('\n'),
    sources: [
      'SEC — Securities and Exchange Commission | https://www.sec.gov/',
      'CFTC — Commodity Futures Trading Commission | https://www.cftc.gov/',
      'IRS — digital assets guidance | https://www.irs.gov/filing/digital-assets',
      'US Congress — bill texts and status | https://www.congress.gov/',
    ].join('\n'),
    related: [
      'clarity-act-senate-recess-lummis-warren-standoff',
      'dtcc-chose-stellar-to-tokenize-russell-1000-stocks-and-us-treasuries-live-tests-begin-july-13',
    ].join('\n'),
    seoTitle: 'Cryptocurrency in the United States: regulation, taxes and licensing',
    seoDescription:
      'How the US taxes crypto profit, what the SEC and CFTC each cover, what has passed and what is stuck in the Senate. Checked against agency sources.',
  },
},

/* ═══════════════════════════ United Kingdom ═══════════════════════════ */
{
  iso2: 'GB',
  ru: {
    intro:
      'Криптовалюта в Великобритании легальна, и с февраля 2026 года у страны впервые появился полноценный закон о ней, а не набор разрозненных требований. ' +
      'Частный инвестор платит налог на прирост капитала по ставке 18% или 24% — она зависит от размера его дохода. Компаниям нужна авторизация FCA, и окно для заявок открывается 30 сентября 2026 года.',
    figures: [
      'НАЛОГ НА ПРИРОСТ | 18–24% | ставка зависит от вашего дохода | warn',
      'НЕОБЛАГАЕМЫЙ МИНИМУМ | 3000 £ | в год | ok',
      'ЛИЦЕНЗИЯ FCA | Обязательна | заявки с 30 сентября 2026 | warn',
      'КРАЙНИЙ СРОК | 25.10.2027 | без заявки работать нельзя | warn',
      'ЭМИТЕНТУ СТЕЙБЛКОИНА | 350 000 £ | минимальный капитал',
      'ОБМЕН ДАННЫМИ | CARF | обязанности площадок с 01.01.2026 | warn',
    ].join('\n'),
    body: `## Кто и как регулирует крипту в Великобритании

До 2026 года криптоиндустрия жила в стране в странном положении: биржи регистрировались у [FCA](https://www.fca.org.uk/) только по линии противодействия отмыванию, реклама подчинялась правилам финансовых продвижений, а самого закона о криптоактивах не существовало.

Он появился 4 февраля 2026 года. Новые правила впервые создали цельную законодательную рамку и определили круг деятельности, требующей разрешения регулятора: обмен, хранение, стейкинг и выпуск стейблкоинов.

Сроки расписаны жёстко. Окно для заявок открывается 30 сентября 2026 года и закрывается 28 февраля 2027-го. Площадка, которая в него не подала, после 25 октября 2027 года законно работать в стране не сможет. Это не постепенное ужесточение, а дата, после которой рынок будет выглядеть иначе.

Стейблкоины разделили по масштабу последствий. Розничные попадают под надзор FCA. Те, что способны повлиять на устойчивость финансовой системы, переходят к Банку Англии и обязаны держать резервы в деньгах центрального банка. Минимальный постоянный капитал эмитента квалифицированного стейблкоина — 350 тысяч фунтов.

## Налоги: прирост капитала и порог, который стоит помнить

Налоговая служба относит криптоактивы к имуществу, и при отчуждении возникает налог на прирост капитала. Отчуждением считается не только продажа за фунты: обмен одной монеты на другую и оплата покупки криптовалютой тоже.

Ставка зависит не от срока владения, а от вашего дохода: 18% для тех, кто платит подоходный налог по базовой ставке, и 24% для остальных. Британская система, в отличие от немецкой или португальской, за долгое владение ничем не награждает.

Есть годовой необлагаемый минимум — 3000 фунтов прибыли. В отличие от немецкого порога это именно вычет: превысили — платите с превышения, а не со всей суммы.

Майнинг, стейкинг, эйрдропы и полученная криптой зарплата — это не прирост капитала, а доход, и он облагается подоходным налогом в момент получения.

С 1 января 2026 года действует и новый слой отчётности. По международным правилам обмена данными о криптоактивах площадки собирают сведения о клиентах и передают их налоговым службам, а с 2026/27 года Британия начнёт получать данные из других стран автоматически.`,
    allowed: [
      'Покупать, хранить и продавать криптоактивы',
      'Пользоваться площадками, авторизованными FCA',
      'Получать прибыль до 3000 £ в год без налога',
      'Вести криптобизнес, подав заявку в открытое окно',
    ].join('\n'),
    restricted: [
      'Долгое владение ничего не даёт — льготы по сроку нет',
      'Обмен монеты на монету облагается так же, как продажа',
      'Без заявки до 28 февраля 2027 года площадка теряет право работать',
      'Реклама криптоактивов подчиняется правилам финансовых продвижений',
    ].join('\n'),
    timeline: [
      '2020 | FCA начинает регистрировать криптокомпании — пока только по линии противодействия отмыванию.',
      '2023 | Реклама криптоактивов подпадает под правила финансовых продвижений: предупреждения о риске становятся обязательными.',
      'Октябрь 2024 | Ставки налога на прирост капитала подняты до 18% и 24%.',
      'Январь 2026 | Вступают в силу обязанности площадок по международному обмену данными о криптоактивах.',
      '* Февраль 2026 | Принят первый в стране полноценный закон о криптоактивах.',
      'Сентябрь 2026 | Открывается окно заявок на авторизацию FCA. Закроется 28 февраля 2027 года.',
    ].join('\n'),
    faq: [
      'Сколько нужно держать криптовалюту в Британии, чтобы не платить налог? | Срок не имеет значения. В отличие от Германии или Португалии, льготы за долгое владение здесь нет: ставка зависит от вашего дохода и составляет 18% или 24%.',
      'Что даёт необлагаемый минимум в 3000 фунтов? | Это вычет: налог платится с прибыли сверх этой суммы, а не со всей прибыли целиком.',
      'Облагается ли обмен одной монеты на другую? | Да, это отчуждение, и посчитать прибыль нужно так же, как при продаже за фунты.',
      'Что будет с биржами, которые не подадут заявку в FCA? | После 25 октября 2027 года они не смогут законно работать в стране. Окно для заявок — с 30 сентября 2026 по 28 февраля 2027 года.',
      'Облагается ли стейкинг? | Да, но не как прирост капитала: полученное считается доходом в момент получения и облагается подоходным налогом.',
    ].join('\n'),
    sources: [
      'FCA — Управление по финансовому регулированию | https://www.fca.org.uk/',
      'HMRC — налоговая служба, руководство по криптоактивам | https://www.gov.uk/government/collections/cryptoassets',
      'Банк Англии — надзор за системными стейблкоинами | https://www.bankofengland.co.uk/',
    ].join('\n'),
    related: [
      'kak-sovladelec-tether-kupil-nadzhela-farazha-i-pochti-ostanovil-cifrovoy-funt',
      'bitkoin-kaznacheystva-satsuma-smarter-web-prodazha',
    ].join('\n'),
    seoTitle: 'Криптовалюта в Великобритании: регулирование, налоги и лицензии',
    seoDescription:
      'Ставка 18% или 24% без льгот за срок владения, необлагаемый минимум 3000 фунтов и авторизация FCA с сентября 2026 года. Данные проверены по сайтам регуляторов.',
  },
  en: {
    intro:
      'Crypto is legal in the United Kingdom, and since February 2026 the country has had a proper statute for it rather than a patchwork of separate requirements. ' +
      'A private investor pays capital gains tax at 18% or 24% depending on their income. Firms need FCA authorisation, and the application window opens on 30 September 2026.',
    figures: [
      'CAPITAL GAINS | 18–24% | rate follows your income | warn',
      'ANNUAL ALLOWANCE | £3,000 | of gains, tax-free | ok',
      'FCA AUTHORISATION | Required | applications from 30 Sept 2026 | warn',
      'HARD DEADLINE | 25.10.2027 | no application, no trading | warn',
      'STABLECOIN ISSUER | £350,000 | minimum capital',
      'DATA EXCHANGE | CARF | provider duties from 01.01.2026 | warn',
    ].join('\n'),
    body: `## Who regulates crypto in the United Kingdom

Until 2026 the industry sat in an odd position here: exchanges registered with the [FCA](https://www.fca.org.uk/) only for anti-money-laundering purposes, advertising fell under the financial promotions rules, and no statute on crypto assets existed at all.

One arrived on 4 February 2026. The new regulations created the first comprehensive legal framework and named the activities that require authorisation: exchange, custody, staking and stablecoin issuance.

The timetable is unusually firm. The application window opens on 30 September 2026 and closes on 28 February 2027. A platform that has not applied within it cannot lawfully operate in the country after 25 October 2027. This is not a gradual tightening but a date after which the market will simply look different.

Stablecoins were split by consequence. Retail ones fall to the FCA. Those large enough to matter for financial stability go to the Bank of England and must hold reserves in central bank money. The permanent minimum capital for a qualifying stablecoin issuer is £350,000.

## Tax: capital gains, and a threshold worth remembering

HMRC treats crypto as property, so disposing of it triggers capital gains tax. Disposal is not only selling for pounds: swapping one coin for another and paying for something in crypto both count.

The rate depends on your income rather than how long you held: 18% for basic-rate taxpayers and 24% for everyone else. Unlike Germany or Portugal, the British system rewards patience with nothing at all.

There is an annual exempt amount of £3,000 of gains. Unlike the German threshold this is a genuine allowance: exceed it and you pay on the excess, not on everything.

Mining, staking, airdrops and being paid in crypto are not capital gains. They are income, taxed at income tax rates at the moment of receipt.

Since 1 January 2026 a reporting layer has applied as well. Under the international framework for crypto-asset reporting, platforms collect customer information and pass it to tax authorities, and from the 2026/27 year the UK begins receiving data from other jurisdictions automatically.`,
    allowed: [
      'Buy, hold and sell crypto assets',
      'Use FCA-authorised platforms',
      'Take up to £3,000 of gains a year tax-free',
      'Run a crypto business by applying within the window',
    ].join('\n'),
    restricted: [
      'Holding period earns you nothing — there is no long-term relief',
      'Coin-to-coin swaps are taxed exactly like a sale',
      'No application by 28 February 2027 means no right to operate',
      'Crypto advertising follows the financial promotions rules',
    ].join('\n'),
    timeline: [
      '2020 | The FCA begins registering crypto firms, though only for anti-money-laundering purposes.',
      '2023 | Crypto advertising comes under the financial promotions regime; risk warnings become mandatory.',
      'October 2024 | Capital gains tax rates rise to 18% and 24%.',
      'January 2026 | Provider obligations under the international crypto-asset reporting framework take effect.',
      '* February 2026 | The country\'s first comprehensive crypto-asset statute is made.',
      'September 2026 | The FCA authorisation window opens. It closes on 28 February 2027.',
    ].join('\n'),
    faq: [
      'How long must I hold crypto in the UK to avoid tax? | Holding period is irrelevant. Unlike Germany or Portugal there is no long-term relief: the rate is 18% or 24% depending on your income.',
      'What does the £3,000 allowance do? | It is a genuine allowance — you pay tax on gains above it, not on the whole gain.',
      'Is swapping one coin for another taxable? | Yes. It is a disposal and the gain is computed exactly as if you had sold for pounds.',
      'What happens to exchanges that do not apply to the FCA? | After 25 October 2027 they cannot lawfully operate here. The window runs from 30 September 2026 to 28 February 2027.',
      'Is staking taxed? | Yes, but not as a capital gain. Rewards are income at the moment of receipt and taxed at income tax rates.',
    ].join('\n'),
    sources: [
      'FCA — Financial Conduct Authority | https://www.fca.org.uk/',
      'HMRC — cryptoassets manual and guidance | https://www.gov.uk/government/collections/cryptoassets',
      'Bank of England — systemic stablecoin oversight | https://www.bankofengland.co.uk/',
    ].join('\n'),
    related: [
      'bitcoin-treasury-firms-satsuma-smarter-web-selling',
      'powercompute-97-percent-btc-treasury-bridge-loan-silence',
    ].join('\n'),
    seoTitle: 'Cryptocurrency in the United Kingdom: regulation, taxes and licensing',
    seoDescription:
      '18% or 24% with no relief for holding, a £3,000 annual allowance, and FCA authorisation from September 2026. Checked against regulator sources.',
  },
},

/* ═══════════════════════════ Japan ═══════════════════════════ */
{
  iso2: 'JP',
  ru: {
    intro:
      'Криптовалюта в Японии легальна, а система лицензирования бирж здесь одна из старейших в мире — она выросла из двух крупнейших взломов в истории отрасли. ' +
      'Налог при этом остаётся самым тяжёлым среди развитых стран: прибыль считается прочим доходом и облагается по прогрессивной шкале, доходящей до 55%. Реформа, которая должна снизить ставку до 20%, подготовлена, но пока не принята.',
    figures: [
      'СЕЙЧАС | до 55% | прибыль считается прочим доходом | warn',
      'ГОТОВИТСЯ | 20% | отдельная ставка, законопроект 2026 | ok',
      'РЕГИСТРАЦИЯ БИРЖ | Обязательна | у FSA, с 2017 года',
      'СТЕЙБЛКОИНЫ | Разрешены | по закону о платёжных услугах | ok',
      'ТОКЕНОВ ПОД РАСКРЫТИЕ | 105 | из списка внутренних бирж',
      'ДЕФИ, NFT И ЗАРУБЕЖ | до 55% | реформа их не затронет | warn',
    ].join('\n'),
    body: `## Кто и как регулирует крипту в Японии

Японское регулирование написано кровью — точнее, чужими деньгами. В 2014 году рухнула токийская биржа Mt.Gox, через которую тогда проходила большая часть мировой торговли биткоином. В 2018-м у местной Coincheck украли активов примерно на полмиллиарда долларов. После каждого случая правила ужесточались, и именно поэтому Япония получила систему лицензирования раньше почти всех.

С 2017 года биржа обязана регистрироваться в Агентстве финансовых услуг. Требования касаются не бумаг, а устройства работы: средства клиентов отделены от собственных, значительная часть хранится в холодных кошельках, проверяются системы и персонал. Параллельно действует отраслевая саморегулируемая ассоциация, которая ведёт списки допущенных токенов.

Стейблкоины живут по закону о платёжных услугах, а не по режиму ценных бумаг. Три крупнейших банка страны готовят совместный иеновый стейблкоин для реальных расчётов.

### Что готовится изменить

Агентство финансовых услуг подготовило перестройку всей конструкции: криптоактивы предлагается перевести в разряд финансовых продуктов по закону о финансовых инструментах. За этим тянется всё остальное — правила о раскрытии информации для 105 токенов, торгуемых на внутренних биржах, запрет на использование инсайдерской информации и, главное для частного инвестора, отдельная ставка налога в 20% вместо нынешней прогрессивной.

Законопроект должен пройти парламент, и пока он не принят, действуют прежние правила.

## Налоги: почему 55% и кого реформа не спасёт

Сегодня прибыль от криптовалюты в Японии — это прочий доход. Он складывается с зарплатой и остальными поступлениями и облагается по прогрессивной шкале; с учётом местного налога верхняя граница подходит к 55%.

Разница с рынком акций разительная: там доход облагается отдельно и по существенно меньшей ставке. Именно это несоответствие и стало главным доводом за реформу.

У будущего послабления есть важная оговорка, которую стоит прочитать до переезда. Пониженная ставка задумана для торговли на зарегистрированных японских площадках. Вознаграждения за стейкинг, доход от кредитования и децентрализованных протоколов, операции с NFT и торговля на зарубежных или незарегистрированных биржах остаются прочим доходом со ставкой до 55%. То есть система станет двухуровневой, а не просто более щадящей.`,
    allowed: [
      'Покупать и продавать на биржах, зарегистрированных у FSA',
      'Пользоваться иеновыми стейблкоинами в расчётах',
      'Хранить активы у лицензированного кастодиана',
      'Майнить, задекларировав доход',
    ].join('\n'),
    restricted: [
      'Ставка до 55% — прибыль складывается с остальным доходом',
      'Торговля на незарегистрированной площадке под будущую льготу не попадёт',
      'Стейкинг, кредитование и NFT остаются прочим доходом',
      'Токен допускается к торгам только после проверки ассоциации',
    ].join('\n'),
    timeline: [
      '* 2014 | Рушится Mt.Gox — крупнейшая на тот момент биржа мира. Япония начинает писать правила раньше всех.',
      '2017 | Закон о платёжных услугах вводит обязательную регистрацию бирж в Агентстве финансовых услуг.',
      '2018 | Взлом Coincheck примерно на полмиллиарда долларов. Требования к хранению средств ужесточаются.',
      '2023 | Стейблкоины получают собственную рамку в рамках закона о платёжных услугах.',
      '2026 | Агентство вносит проект: криптоактивы как финансовые продукты, раскрытие по 105 токенам, ставка 20%.',
    ].join('\n'),
    faq: [
      'Сколько налога платят с криптовалюты в Японии? | Сегодня прибыль считается прочим доходом и облагается по прогрессивной шкале — с учётом местного налога до 55%. Реформа со ставкой 20% подготовлена, но пока не принята.',
      'Когда заработает ставка 20%? | После принятия законопроекта парламентом. Ориентир — 2026 год, но пока это проект, а не закон.',
      'Попадёт ли стейкинг под пониженную ставку? | Нет. Вознаграждения за стейкинг, доход от кредитования и децентрализованных протоколов, а также операции с NFT остаются прочим доходом.',
      'Можно ли торговать на зарубежной бирже? | Ограничений на личные сделки нет, но такая торговля не попадёт под будущую пониженную ставку — она задумана для зарегистрированных японских площадок.',
      'Почему в Японии так рано появились лицензии? | Из-за двух крупнейших взломов отрасли: Mt.Gox в 2014 году и Coincheck в 2018-м. Правила писались как ответ на них.',
    ].join('\n'),
    sources: [
      'FSA — Агентство финансовых услуг Японии | https://www.fsa.go.jp/en/',
      'Национальное налоговое агентство Японии | https://www.nta.go.jp/english/',
      'JVCEA — саморегулируемая ассоциация криптобирж | https://jvcea.or.jp/en/',
    ].join('\n'),
    related: [
      'postavshik-amazon-japan-az-com-maruwa-perevodit-2300-perevozchikov-na-stejblkoin-jpyc',
      'metaplanet-ceo-oproverg-prodazhu-bitkoina-5014-btc',
    ].join('\n'),
    seoTitle: 'Криптовалюта в Японии: регулирование, налоги и лицензии',
    seoDescription:
      'Ставка до 55% сегодня и реформа с 20% в проекте, регистрация бирж с 2017 года и оговорки, которые касаются стейкинга и зарубежных площадок.',
  },
  en: {
    intro:
      'Crypto is legal in Japan, and its exchange licensing regime is one of the oldest anywhere — it grew directly out of the two largest hacks in the industry\'s history. ' +
      'Tax, meanwhile, is the heaviest in the developed world: gains count as miscellaneous income on a progressive scale reaching about 55%. A reform cutting that to a flat 20% has been drafted but not enacted.',
    figures: [
      'TODAY | up to 55% | gains are miscellaneous income | warn',
      'DRAFTED | 20% | separate rate, 2026 bill | ok',
      'EXCHANGE REGISTRATION | Required | with the FSA since 2017',
      'STABLECOINS | Permitted | under the payment services regime | ok',
      'TOKENS FACING DISCLOSURE | 105 | listed on domestic venues',
      'DEFI, NFTS, OFFSHORE | up to 55% | the reform will not reach them | warn',
    ].join('\n'),
    body: `## Who regulates crypto in Japan

Japanese rules were written in the aftermath of other people's losses. In 2014 the Tokyo exchange Mt.Gox collapsed, and at the time most of the world's bitcoin trading ran through it. In 2018 the domestic venue Coincheck lost roughly half a billion dollars to a hack. Each episode tightened the rules, which is why Japan had a licensing regime long before almost anyone else.

Since 2017 an exchange must register with the Financial Services Agency. The requirements are about how the business runs rather than what it files: client funds are segregated from the firm's own, a substantial share sits in cold storage, and systems and staff are examined. A self-regulatory industry association operates alongside, maintaining the lists of tokens cleared for trading.

Stablecoins live under the payment services law rather than the securities regime. The country's three largest banks are preparing a joint yen stablecoin for live commercial settlement.

### What is being rebuilt

The Financial Services Agency has drafted a rework of the whole structure: crypto assets would be reclassified as financial products under the financial instruments legislation. Everything else follows from that — disclosure obligations for the 105 tokens traded on domestic exchanges, insider trading rules, and, for private investors, a separate 20% tax rate in place of the progressive scale.

The bill still has to pass the Diet. Until it does, the old rules apply.

## Tax: why 55%, and who the reform will not rescue

Today a crypto gain in Japan is miscellaneous income. It is added to salary and everything else and taxed progressively; with local tax the top approaches 55%.

The contrast with equities is stark — those are taxed separately and far more lightly. That mismatch is the central argument behind the reform.

The coming relief carries a caveat worth reading before relocating. The lower rate is designed for trading on registered Japanese venues. Staking rewards, income from lending and decentralised protocols, NFT transactions, and trading on foreign or unregistered exchanges all stay miscellaneous income at up to 55%. The system becomes two-tier rather than simply gentler.`,
    allowed: [
      'Trade on exchanges registered with the FSA',
      'Use yen stablecoins for settlement',
      'Hold assets with a licensed custodian',
      'Mine, declaring the income',
    ].join('\n'),
    restricted: [
      'Up to 55%, because gains stack on top of your other income',
      'Trading on an unregistered venue will miss the coming lower rate',
      'Staking, lending and NFTs stay miscellaneous income',
      'A token reaches the order book only after association review',
    ].join('\n'),
    timeline: [
      '* 2014 | Mt.Gox, then the largest exchange in the world, collapses. Japan starts writing rules before anyone else.',
      '2017 | The payment services act makes exchange registration with the Financial Services Agency mandatory.',
      '2018 | Coincheck loses roughly half a billion dollars to a hack, and custody requirements tighten.',
      '2023 | Stablecoins get their own framework within the payment services regime.',
      '2026 | The agency tables its bill: crypto as financial products, disclosure for 105 tokens, a 20% rate.',
    ].join('\n'),
    faq: [
      'How much tax do you pay on crypto in Japan? | Today gains are miscellaneous income on a progressive scale reaching about 55% with local tax. A 20% reform is drafted but not yet law.',
      'When does the 20% rate start? | Once the Diet passes the bill. 2026 is the target, but it remains a bill rather than a statute.',
      'Will staking qualify for the lower rate? | No. Staking rewards, lending and DeFi income and NFT transactions all stay miscellaneous income.',
      'Can I trade on a foreign exchange? | Personal trading is unrestricted, but it will not qualify for the coming lower rate, which is designed for registered Japanese venues.',
      'Why did Japan license exchanges so early? | Because of the industry\'s two biggest hacks: Mt.Gox in 2014 and Coincheck in 2018. The rules were written as a response to them.',
    ].join('\n'),
    sources: [
      'FSA — Financial Services Agency of Japan | https://www.fsa.go.jp/en/',
      'National Tax Agency of Japan | https://www.nta.go.jp/english/',
      'JVCEA — the self-regulatory exchange association | https://jvcea.or.jp/en/',
    ].join('\n'),
    related: [
      'amazon-japan-partner-az-com-maruwa-moves-2300-carriers-to-jpyc-stablecoin',
      'ripple-launches-rlusd-stablecoin-in-japan-via-sbi-vc-trade',
    ].join('\n'),
    seoTitle: 'Cryptocurrency in Japan: regulation, taxes and licensing',
    seoDescription:
      'Up to 55% today and a 20% reform still in draft, exchange registration since 2017, and the exceptions that catch staking and offshore venues.',
  },
},

/* ═══════════════════════════ China ═══════════════════════════ */
{
  iso2: 'CN',
  ru: {
    intro:
      'Криптовалюта в Китае запрещена, но запрет устроен тоньше, чем принято думать. Незаконна не сама монета, а деятельность вокруг неё: торговля, обмен, посредничество и майнинг. ' +
      'Владение при этом не образует преступления, и суды не раз признавали криптоактивы имуществом. Гонконг живёт по собственным правилам и в этот запрет не входит.',
    figures: [
      'ТОРГОВЛЯ | Запрещена | с сентября 2021 года | warn',
      'МАЙНИНГ | Запрещён | надзор усилен в 2026 году | warn',
      'ВЛАДЕНИЕ | Не преступление | суды признают имуществом',
      'ЮАНЕВЫЕ СТЕЙБЛКОИНЫ | Запрещены | и внутри страны, и за рубежом | warn',
      'ЦИФРОВОЙ ЮАНЬ | Государственный | единственный разрешённый путь',
      'ГОНКОНГ | Своя система | лицензии и стейблкоины | ok',
    ].join('\n'),
    body: `## Что именно запрещено, а что нет

Запрет складывался постепенно. В 2013 году банкам запретили операции с биткоином. В 2017-м закрыли первичные размещения токенов и вынудили уйти внутренние биржи — тогда из страны уехала и будущая крупнейшая биржа мира. В сентябре 2021 года вышло совместное уведомление ведомств, которое подвело черту: любая деятельность, связанная с виртуальными валютами, объявлена незаконной финансовой деятельностью, а зарубежные площадки, обслуживающие резидентов материкового Китая, — тоже вне закона. Тогда же свернули майнинг, до этого дававший заметную долю мирового хешрейта.

Важный нюанс: под запретом деятельность, а не факт владения. Китайские суды в гражданских спорах неоднократно исходили из того, что криптоактив — имущество, и рассматривали дела о его наследовании и разделе. Практический смысл этого различия невелик: держать не преступление, но и защитить сделку в суде не выйдет, поскольку сама сделка незаконна.

В феврале 2026 года Народный банк Китая и другие ведомства выпустили новый циркуляр. Он распространил контроль на токенизацию реальных активов и на стейблкоины, привязанные к юаню, причём запрет на их выпуск действует и внутри страны, и за её пределами — закрывая обходной путь через зарубежные структуры. Отдельно усилен надзор за майнингом: ищут «теневые» дата-центры, где оборудование работает скрытно.

Государство при этом не отказывается от технологии, а забирает её себе. Цифровой юань — валюта центрального банка — остаётся единственным разрешённым способом расплачиваться цифровыми деньгами.

## Гонконг: другая страна в той же стране

Гонконг — отдельная юрисдикция со своим финансовым правом, и материковый запрет на него не распространяется. Там действует лицензирование площадок для торговли виртуальными активами, а с августа 2025 года — собственный закон о стейблкоинах.

Разница настолько велика, что делает Гонконг обычным пунктом в маршрутах компаний, для которых материковый Китай закрыт. Но границу между режимами стоит держать в голове: гонконгская лицензия не даёт права работать с клиентами из материкового Китая.`,
    allowed: [
      'Владеть криптоактивами — само по себе не преступление',
      'Наследовать и делить их: суды признают имуществом',
      'Пользоваться цифровым юанем в расчётах',
      'Работать в Гонконге по местной лицензии',
    ].join('\n'),
    restricted: [
      'Торговля, обмен и посредничество — незаконная финансовая деятельность',
      'Зарубежные биржи не вправе обслуживать резидентов материка',
      'Майнинг запрещён, «теневые» дата-центры разыскивают',
      'Выпуск юаневых стейблкоинов — и в стране, и офшорно',
    ].join('\n'),
    timeline: [
      '2013 | Банкам запрещают операции с биткоином — первый шаг к запрету.',
      '2017 | Закрыты первичные размещения токенов и внутренние биржи. Компании уходят за границу.',
      '* Сентябрь 2021 | Совместное уведомление ведомств объявляет всю деятельность с виртуальными валютами незаконной. Майнинг сворачивают.',
      'Август 2025 | В Гонконге вступает в силу собственный закон о стейблкоинах — контраст с материком становится очевидным.',
      'Февраль 2026 | Новый циркуляр распространяет запрет на токенизацию реальных активов и юаневые стейблкоины, включая офшорные.',
    ].join('\n'),
    faq: [
      'Запрещено ли в Китае владеть биткоином? | Само владение преступления не образует, и суды в гражданских спорах признают криптоактивы имуществом. Запрещена деятельность: торговля, обмен, посредничество и майнинг.',
      'Можно ли пользоваться зарубежной биржей из Китая? | Нет. С сентября 2021 года обслуживание резидентов материкового Китая зарубежными площадками объявлено незаконным.',
      'Действует ли запрет в Гонконге? | Нет. Гонконг — отдельная юрисдикция со своим финансовым правом, лицензированием площадок и собственным законом о стейблкоинах с августа 2025 года.',
      'Почему запретили юаневые стейблкоины? | Циркуляр февраля 2026 года запрещает их выпуск без прямого разрешения властей, причём и за пределами страны — чтобы закрыть обходной путь через зарубежные структуры.',
      'Что такое цифровой юань? | Валюта центрального банка. Государство развивает её как единственный разрешённый способ цифровых расчётов, одновременно закрывая частные альтернативы.',
    ].join('\n'),
    sources: [
      'Народный банк Китая | http://www.pbc.gov.cn/en/3688006/index.html',
      'Комиссия по ценным бумагам и фьючерсам Гонконга | https://www.sfc.hk/en/',
      'Валютное управление Гонконга | https://www.hkma.gov.hk/eng/',
    ].join('\n'),
    related: [
      'kitay-priznal-cifrovye-aktivy-i-kripto-nasledstvom-chto-reshili-sudy',
      'istoriya-binance-ot-15-mln-na-ico-do-krupneishei-birzhi-mira',
    ].join('\n'),
    seoTitle: 'Криптовалюта в Китае: запрет, исключения и Гонконг',
    seoDescription:
      'Что именно запрещено в Китае, почему владение не образует преступления, при чём тут цифровой юань и как Гонконг живёт по собственным правилам.',
  },
  en: {
    intro:
      'Crypto is banned in China, though the ban is finer-grained than it is usually described. What is unlawful is the activity around a coin — trading, exchange, intermediation and mining — rather than the coin itself. ' +
      'Simply holding is not an offence, and courts have repeatedly treated crypto assets as property. Hong Kong runs its own rules and is not covered by any of this.',
    figures: [
      'TRADING | Banned | since September 2021 | warn',
      'MINING | Banned | enforcement tightened in 2026 | warn',
      'HOLDING | Not an offence | courts treat it as property',
      'YUAN STABLECOINS | Banned | onshore and offshore alike | warn',
      'DIGITAL YUAN | State-run | the only permitted route',
      'HONG KONG | Separate regime | licensing and stablecoins | ok',
    ].join('\n'),
    body: `## What exactly is banned, and what is not

The ban arrived in stages. In 2013 banks were barred from handling bitcoin. In 2017 token sales were shut down and domestic exchanges pushed out — the firm that would become the world's largest exchange left the country then. In September 2021 a joint notice from several agencies drew the line: any activity involving virtual currencies was declared unlawful financial activity, and foreign platforms serving mainland residents were placed outside the law too. Mining, which had accounted for a large share of global hashrate, was wound up in the same period.

The distinction matters: the prohibition attaches to activity, not to possession. Chinese courts in civil matters have repeatedly proceeded on the basis that a crypto asset is property, hearing cases on inheritance and division of assets. The practical value of that distinction is limited — holding is not an offence, but a trade cannot be enforced in court, because the trade itself is unlawful.

In February 2026 the People's Bank of China and other agencies issued a fresh circular. It extended control to the tokenisation of real-world assets and to yuan-pegged stablecoins, banning their issuance both inside the country and outside it — closing the route through offshore vehicles. Mining enforcement was tightened separately, targeting "shadow" data centres running rigs out of sight.

The state is not rejecting the technology so much as keeping it. The digital yuan, a central bank currency, remains the only sanctioned way to settle in digital money.

## Hong Kong: another country inside the same one

Hong Kong is a separate jurisdiction with its own financial law, and the mainland ban does not reach it. Virtual asset trading platforms are licensed there, and since August 2025 it has had a stablecoin ordinance of its own.

The gap is wide enough that Hong Kong is a routine stop for firms shut out of the mainland. The boundary is worth keeping in mind, though: a Hong Kong licence confers no right to serve mainland customers.`,
    allowed: [
      'Holding crypto — possession alone is not an offence',
      'Inheriting and dividing it: courts treat it as property',
      'Using the digital yuan for settlement',
      'Operating in Hong Kong under a local licence',
    ].join('\n'),
    restricted: [
      'Trading, exchange and intermediation are unlawful financial activity',
      'Foreign exchanges may not serve mainland residents',
      'Mining is banned and shadow data centres are hunted',
      'Issuing yuan-pegged stablecoins, onshore or offshore',
    ].join('\n'),
    timeline: [
      '2013 | Banks are barred from handling bitcoin — the first step towards a ban.',
      '2017 | Token sales and domestic exchanges are shut down. Firms move abroad.',
      '* September 2021 | A joint agency notice declares all virtual currency activity unlawful. Mining is wound up.',
      'August 2025 | Hong Kong\'s own stablecoin ordinance takes effect, making the contrast with the mainland plain.',
      'February 2026 | A new circular extends the ban to real-world asset tokenisation and yuan stablecoins, offshore ones included.',
    ].join('\n'),
    faq: [
      'Is owning bitcoin illegal in China? | Possession alone is not an offence, and courts in civil matters treat crypto as property. The prohibition covers activity: trading, exchange, intermediation and mining.',
      'Can I use a foreign exchange from China? | No. Since September 2021 foreign platforms serving mainland residents have been unlawful.',
      'Does the ban apply in Hong Kong? | No. Hong Kong is a separate jurisdiction with its own financial law, platform licensing and, since August 2025, a stablecoin ordinance.',
      'Why were yuan stablecoins banned? | The February 2026 circular prohibits issuing them without explicit government approval, including outside the country, to close the offshore route.',
      'What is the digital yuan? | A central bank currency. The state is building it as the only sanctioned form of digital settlement while closing private alternatives.',
    ].join('\n'),
    sources: [
      'People\'s Bank of China | http://www.pbc.gov.cn/en/3688006/index.html',
      'Securities and Futures Commission of Hong Kong | https://www.sfc.hk/en/',
      'Hong Kong Monetary Authority | https://www.hkma.gov.hk/eng/',
    ].join('\n'),
    related: [
      'hkma-quantum-readiness-banks-2-3-out-of-10',
      'the-story-of-binance-from-a-15m-ico-to-the-worlds-biggest-exchange',
    ].join('\n'),
    seoTitle: 'Cryptocurrency in China: the ban, its limits and Hong Kong',
    seoDescription:
      'What is actually prohibited in China, why holding is not an offence, where the digital yuan fits, and how Hong Kong runs an entirely separate regime.',
  },
},

/* ═══════════════════════════ South Korea ═══════════════════════════ */
{
  iso2: 'KR',
  ru: {
    intro:
      'Криптовалюта в Южной Корее разрешена, но обставлена ограничениями плотнее, чем почти где-либо: торговать можно только через счёт, открытый на ваше настоящее имя в банке-партнёре биржи. ' +
      'Налога на прибыль пока нет — его вводили четыре раза и четыре раза откладывали, но с 1 января 2027 года он всё же начнёт действовать по ставке 22%.',
    figures: [
      'НАЛОГ | 22% | с 1 января 2027 года | warn',
      'НЕОБЛАГАЕМЫЙ ПОРОГ | 2,5 млн ₩ | прибыли в год | ok',
      'СЧЁТ | Только именной | в банке-партнёре биржи | warn',
      'КОМПАНИЯМ | Разрешено | с января 2026, до 5% капитала | ok',
      'ЗАЩИТА ПОЛЬЗОВАТЕЛЕЙ | С июля 2024 | манипуляции наказуемы',
      'ВОНОВЫЕ СТЕЙБЛКОИНЫ | Готовятся | рамка обещана к концу 2026 | warn',
    ].join('\n'),
    body: `## Кто и как регулирует крипту в Южной Корее

Регулятор один — Комиссия по финансовым услугам, и подход у неё узнаваемый: рынок не запрещают, но заставляют работать прозрачно.

Стержень системы — требование именного счёта. Торговать на бирже можно только через банковский счёт, открытый на ваше настоящее имя в банке, с которым у этой биржи заключено соглашение. Анонимной торговли в стране нет с 2018 года, и именно это требование в своё время закрыло большую часть мелких площадок.

С июля 2024 года действует закон о защите пользователей виртуальных активов. Он обязал биржи отделять средства клиентов от собственных, держать значительную часть в холодном хранении, страховать риски и прямо запретил манипулирование рынком и использование инсайдерской информации.

Дальше готовится второй этап — рамочный закон о цифровых активах. Комиссия сводит несколько законопроектов в один и рассчитывает провести его до конца 2026 года; ключевой темой называют стейблкоины. Центральный банк настаивает, чтобы воновые стейблкоины выпускали в первую очередь консорциумы с преобладающим участием банков.

Отдельно стоит отметить перемену января 2026 года. До неё юридические лица фактически не могли держать криптоактивы — запрет действовал девять лет. Теперь публичным компаниям и профессиональным инвесторам разрешено направлять в цифровые активы до 5% собственного капитала в год; доступ получают около трёх с половиной тысяч организаций.

## Налоги: четыре отсрочки и дата, которая, похоже, окончательная

История корейского налога на криптовалюту — это история переносов. Его принимали, потом откладывали, снова откладывали, и так четыре раза подряд: рынок сопротивлялся, политики шли навстречу перед выборами.

В плане налоговой реформы, утверждённом 3 августа 2026 года, отсрочки нет — впервые с 2020 года пакет вышел без строчки о переносе. Значит, с 1 января 2027 года прибыль от криптовалюты начнёт облагаться: ставка 22% с учётом местной надбавки, необлагаемый порог — 2,5 миллиона вон прибыли в год.

Порог заметно ниже, чем у дохода от акций, и это одна из причин, по которым спор о справедливости ставки не закончился. Но до тех пор, пока закон не изменят снова, ориентироваться стоит на январь 2027 года.`,
    allowed: [
      'Торговать на биржах, зарегистрированных у регулятора',
      'Держать и переводить криптоактивы',
      'Компаниям — направлять в цифровые активы до 5% капитала в год',
      'Получать прибыль без налога до конца 2026 года',
    ].join('\n'),
    restricted: [
      'Только именной счёт в банке-партнёре биржи — анонимной торговли нет',
      'Манипулирование рынком и инсайдерская торговля наказуемы',
      'С 2027 года прибыль свыше 2,5 млн вон облагается по ставке 22%',
      'Воновые стейблкоины пока вне рамки — она только готовится',
    ].join('\n'),
    timeline: [
      '2018 | Вводится требование именного банковского счёта. Анонимная торговля исчезает, мелкие площадки закрываются.',
      '2021 | Биржи обязаны регистрироваться у регулятора. До конца процедуры доходят немногие.',
      '* Июль 2024 | Вступает в силу закон о защите пользователей: разделение средств, холодное хранение, запрет манипуляций.',
      'Январь 2026 | Снят девятилетний запрет для юридических лиц: компаниям разрешено до 5% капитала в цифровых активах.',
      'Август 2026 | План налоговой реформы выходит без очередной отсрочки — впервые с 2020 года.',
      'Январь 2027 | Начинает действовать налог 22% с прибыли свыше 2,5 млн вон в год.',
    ].join('\n'),
    faq: [
      'Платят ли в Южной Корее налог с криптовалюты? | Пока нет. Налог вводили и откладывали четыре раза, но план реформы от 3 августа 2026 года отсрочки не содержит: с 1 января 2027 года ставка составит 22% с прибыли свыше 2,5 млн вон в год.',
      'Почему для торговли нужен именной счёт? | Требование действует с 2018 года и закрывает анонимную торговлю: счёт открывается на ваше настоящее имя в банке, у которого есть соглашение с биржей.',
      'Могут ли компании держать криптовалюту? | Да, с января 2026 года. До этого девять лет действовал фактический запрет. Публичным компаниям и профессиональным инвесторам разрешено до 5% собственного капитала в год.',
      'Что изменил закон о защите пользователей? | С июля 2024 года биржи обязаны отделять средства клиентов, держать значительную часть в холодном хранении и страховать риски, а манипулирование рынком прямо запрещено.',
      'Когда появятся воновые стейблкоины? | Рамку обещают провести до конца 2026 года. Центральный банк настаивает, чтобы выпуск начинали консорциумы с преобладающим участием банков.',
    ].join('\n'),
    sources: [
      'FSC — Комиссия по финансовым услугам Кореи | https://www.fsc.go.kr/eng/',
      'Банк Кореи | https://www.bok.or.kr/eng/main/main.do',
      'Национальная налоговая служба Кореи | https://www.nts.go.kr/english/',
    ].join('\n'),
    related: [
      'yuzhnaya-koreya-nalog-na-kriptu-2027',
      'hyundai-card-perevod-na-steiblkoinah-7-minut-2026',
    ].join('\n'),
    seoTitle: 'Криптовалюта в Южной Корее: регулирование, налоги и лицензии',
    seoDescription:
      'Налог 22% с января 2027 года после четырёх отсрочек, обязательный именной счёт и разрешение для компаний с 2026 года. Данные проверены по релизам регулятора.',
  },
  en: {
    intro:
      'Crypto is legal in South Korea but hedged about more tightly than almost anywhere: you can only trade through an account opened in your real name at a bank partnered with the exchange. ' +
      'There is no tax on gains yet — it was legislated and postponed four times — but from 1 January 2027 it finally takes effect at 22%.',
    figures: [
      'TAX | 22% | from 1 January 2027 | warn',
      'EXEMPT THRESHOLD | ₩2.5m | of gains per year | ok',
      'ACCOUNT | Real-name only | at a partnered bank | warn',
      'COMPANIES | Permitted | since Jan 2026, up to 5% of equity | ok',
      'USER PROTECTION ACT | Since July 2024 | manipulation is an offence',
      'WON STABLECOINS | In progress | framework promised for 2026 | warn',
    ].join('\n'),
    body: `## Who regulates crypto in South Korea

There is one regulator, the Financial Services Commission, and its approach is recognisable: the market is not banned, it is forced into daylight.

The spine of the system is the real-name account. You may only trade through a bank account in your own name, at a bank that has an agreement with the exchange. Anonymous trading has been impossible since 2018, and that requirement is what closed most of the smaller venues at the time.

Since July 2024 the Virtual Asset User Protection Act has applied. It requires exchanges to segregate client funds from their own, keep a substantial share in cold storage and insure the risk, and it explicitly prohibits market manipulation and insider trading.

A second phase is being prepared — a framework act on digital assets. The commission is merging several bills into one and aims to pass it before the end of 2026, with stablecoins the central question. The central bank has pressed for won-pegged stablecoins to be issued first by consortia in which banks hold the majority.

January 2026 brought a change worth noting separately. Before it, corporate entities effectively could not hold crypto at all — a prohibition that had stood for nine years. Listed companies and professional investors may now allocate up to 5% of shareholder equity a year to digital assets, opening access to roughly three and a half thousand organisations.

## Tax: four postponements and a date that looks final

The story of Korean crypto tax is a story of delays. It was passed, then deferred, then deferred again — four times over, as the market pushed back and politicians obliged ahead of elections.

The tax reform package finalised on 3 August 2026 contains no deferral, the first complete package since 2020 without one. So from 1 January 2027 crypto gains become taxable at 22% including the local surcharge, with the first ₩2.5m of annual gains exempt.

That threshold sits noticeably below the equivalent for equities, which is one reason the fairness argument has not gone quiet. But unless the law changes yet again, January 2027 is the date to plan around.`,
    allowed: [
      'Trade on exchanges registered with the regulator',
      'Hold and transfer crypto assets',
      'Companies may allocate up to 5% of equity a year to digital assets',
      'Take gains untaxed through the end of 2026',
    ].join('\n'),
    restricted: [
      'Real-name accounts only — anonymous trading does not exist here',
      'Market manipulation and insider trading are offences',
      'From 2027, gains above ₩2.5m are taxed at 22%',
      'Won stablecoins are still outside any framework',
    ].join('\n'),
    timeline: [
      '2018 | Real-name bank accounts become mandatory. Anonymous trading disappears and smaller venues close.',
      '2021 | Exchanges must register with the regulator. Few complete the process.',
      '* July 2024 | The Virtual Asset User Protection Act takes effect: segregation, cold storage, a ban on manipulation.',
      'January 2026 | A nine-year prohibition on corporate holdings is lifted, with a 5%-of-equity annual cap.',
      'August 2026 | The tax reform package arrives without another postponement — the first since 2020.',
      'January 2027 | Tax begins at 22% on annual gains above ₩2.5m.',
    ].join('\n'),
    faq: [
      'Is crypto taxed in South Korea? | Not yet. The tax was passed and postponed four times, but the 3 August 2026 reform package contains no deferral: from 1 January 2027 the rate is 22% on annual gains above ₩2.5m.',
      'Why do I need a real-name account? | The requirement dates from 2018 and ends anonymous trading: the account must be in your own name at a bank with an agreement with the exchange.',
      'Can companies hold crypto? | Yes, since January 2026. Before that a de facto prohibition had stood for nine years. Listed firms and professional investors may allocate up to 5% of equity a year.',
      'What did the User Protection Act change? | Since July 2024 exchanges must segregate client funds, keep much of them in cold storage and insure the risk, and market manipulation is explicitly prohibited.',
      'When will won stablecoins arrive? | The framework is promised before the end of 2026. The central bank wants issuance to start with bank-majority consortia.',
    ].join('\n'),
    sources: [
      'FSC — Financial Services Commission of Korea | https://www.fsc.go.kr/eng/',
      'Bank of Korea | https://www.bok.or.kr/eng/main/main.do',
      'National Tax Service of Korea | https://www.nts.go.kr/english/',
    ].join('\n'),
    related: [
      'bithumb-ipo-2028-third-delay',
      'xrp-below-1-dollar-jeonbuk-bank-ripple-payments',
    ].join('\n'),
    seoTitle: 'Cryptocurrency in South Korea: regulation, taxes and licensing',
    seoDescription:
      '22% tax from January 2027 after four postponements, mandatory real-name accounts, and corporate access opened in 2026. Checked against regulator releases.',
  },
},
];

const FIELDS = [
  'intro', 'figures', 'body', 'allowed', 'restricted',
  'timeline', 'faq', 'sources', 'related', 'seoTitle', 'seoDescription',
] as const;

const words = (s: string) => s.split(/\s+/).filter(Boolean).length;
const total = (o: Side) =>
  words(o.intro) + words(o.body) + words(o.allowed) + words(o.restricted) +
  words(o.timeline) + words(o.faq) + words(o.figures);

async function main() {
  for (const c of COUNTRIES) {
    const doc = await client.fetch<{ _id: string; nameRu: string; status: string } | null>(
      `*[_type == "regulationCountry" && iso2 == $iso][0]{_id, "nameRu": name.ru, status}`,
      { iso: c.iso2 }
    );
    if (!doc) {
      console.error(`${c.iso2}: не найдена на карте — пропускаю`);
      continue;
    }
    const page = Object.fromEntries(
      FIELDS.map(f => [f, { _type: 'object', ru: c.ru[f], en: c.en[f] }])
    );
    await client
      .patch(doc._id)
      .set({ hasPage: true, page: { _type: 'object', ...page }, checkedAt: '2026-08-19' })
      .commit({ autoGenerateArrayKeys: false });
    console.log(`${doc.nameRu.padEnd(16)} ${doc.status.padEnd(11)} слов RU ${total(c.ru)} · EN ${total(c.en)}`);
  }
}

main().catch(e => { console.error(e.message); process.exit(1); });
