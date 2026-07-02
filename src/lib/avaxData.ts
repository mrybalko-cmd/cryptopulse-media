export const AVAX_INVESTMENT_REFERENCE = [
  {
    yearsAgo: 5,
    year: 2021,
    price: 13.50,
    label: { ru: '5 лет назад (2021)', en: '5 years ago (2021)' },
    note: { ru: 'До запуска программы Avalanche Rush', en: 'Before Avalanche Rush program launch' },
  },
];

export const INVESTMENT_AMOUNTS = [100, 500, 1000, 2000, 5000];

export interface AvaxQuote {
  author: string;
  role: { ru: string; en: string };
  year: number;
  quote: { ru: string; en: string };
  sentiment: 'bullish' | 'bearish' | 'neutral';
}

export const AVAX_QUOTES: AvaxQuote[] = [
  {
    author: 'Эмин Гюн Сирер',
    role: { ru: 'Основатель Avalanche, профессор Корнелла', en: 'Founder of Avalanche, Cornell professor' },
    year: 2021,
    quote: {
      ru: '«Avalanche решает трилемму блокчейна: мы быстрые, дешёвые и действительно децентрализованные. Финальность транзакции менее одной секунды — это не обещание, это реальность.»',
      en: '"Avalanche solves the blockchain trilemma: we are fast, cheap and truly decentralized. Transaction finality in under one second is not a promise, it is a reality."',
    },
    sentiment: 'bullish',
  },
  {
    author: 'Эмин Гюн Сирер',
    role: { ru: 'CEO Ava Labs', en: 'CEO of Ava Labs' },
    year: 2022,
    quote: {
      ru: '«Субсети — это будущее блокчейнов. Вместо одной медленной цепочки для всех — тысячи специализированных сетей, объединённых общим стандартом безопасности.»',
      en: '"Subnets are the future of blockchains. Instead of one slow chain for everyone — thousands of specialized networks united by a common security standard."',
    },
    sentiment: 'bullish',
  },
  {
    author: 'Майк Новограц',
    role: { ru: 'CEO Galaxy Digital', en: 'CEO of Galaxy Digital' },
    year: 2021,
    quote: {
      ru: '«Avalanche привлекла серьёзных институциональных разработчиков. Программа Rush показала, что правильные стимулы быстро строят ликвидность.»',
      en: '"Avalanche attracted serious institutional developers. The Rush program showed that the right incentives build liquidity quickly."',
    },
    sentiment: 'bullish',
  },
  {
    author: 'Виталик Бутерин',
    role: { ru: 'Создатель Ethereum', en: 'Creator of Ethereum' },
    year: 2021,
    quote: {
      ru: '«Консенсус «снежинки» интересен с академической точки зрения. Но я хочу увидеть, как он работает под настоящей нагрузкой при реальных условиях атак.»',
      en: '"Snowflake consensus is interesting from an academic perspective. But I want to see how it performs under real load and actual attack conditions."',
    },
    sentiment: 'neutral',
  },
  {
    author: 'Кэти Вуд',
    role: { ru: 'CEO ARK Invest', en: 'CEO of ARK Invest' },
    year: 2022,
    quote: {
      ru: '«Партнёрство Avalanche с Amazon Web Services — это признание блокчейна корпоративным миром. Avalanche думает об институциональном рынке серьёзно.»',
      en: '"Avalanche\'s partnership with Amazon Web Services is corporate world recognition of blockchain. Avalanche is serious about the institutional market."',
    },
    sentiment: 'bullish',
  },
  {
    author: 'Питер Шифф',
    role: { ru: 'Экономист и критик крипто', en: 'Economist and crypto critic' },
    year: 2022,
    quote: {
      ru: '«Каждый новый L1 обещает быть быстрее, дешевле и децентрализованнее. Avalanche ничем не отличается от сотен предыдущих "убийц Ethereum".»',
      en: '"Every new L1 promises to be faster, cheaper and more decentralized. Avalanche is no different from hundreds of previous Ethereum killers."',
    },
    sentiment: 'bearish',
  },
  {
    author: 'Дэвид Нечо',
    role: { ru: 'Бывший руководитель JPMorgan (Onyx)', en: 'Former JPMorgan Onyx head' },
    year: 2023,
    quote: {
      ru: '«Институциональные клиенты выбирают Avalanche из-за субсетей. Финансовые учреждения хотят контролировать своих валидаторов и данные — это даёт Evergreen Subnet.»',
      en: '"Institutional clients choose Avalanche because of subnets. Financial institutions want to control their validators and data — Evergreen Subnet provides exactly that."',
    },
    sentiment: 'bullish',
  },
  {
    author: 'Эмин Гюн Сирер',
    role: { ru: 'CEO Ava Labs', en: 'CEO of Ava Labs' },
    year: 2024,
    quote: {
      ru: '«Avalanche9000 — самое большое обновление в истории сети. Мы удешевляем создание субсетей в 99 раз. Это открывает блокчейны для каждого разработчика.»',
      en: '"Avalanche9000 is the biggest upgrade in network history. We are making subnets 99x cheaper to create. This opens blockchains to every developer."',
    },
    sentiment: 'bullish',
  },
];

export interface AvaxFaqItem {
  question: { ru: string; en: string };
  answer: { ru: string; en: string };
}

export const AVAX_FAQ: AvaxFaqItem[] = [
  {
    question: {
      ru: 'Кто создал Avalanche?',
      en: 'Who created Avalanche?',
    },
    answer: {
      ru: 'Avalanche разработан командой Ava Labs под руководством профессора Корнеллского университета Эмина Гюн Сирера — известного исследователя в области компьютерных наук и криптографии. Сирер ранее открыл и задокументировал атаку «Selfish Mining» на Bitcoin. Вместе с ним проект создавали Кевин Секниски и Мэвис Чи. Ava Labs получила финансирование от ведущих венчурных фондов: a16z, Polychain, Dragonfly. Mainnet был запущен в сентябре 2020 года.',
      en: 'Avalanche was developed by Ava Labs under the leadership of Cornell University professor Emin Gün Sirer — a renowned computer science and cryptography researcher. Sirer previously discovered and documented the Selfish Mining attack on Bitcoin. Kevin Sekniski and Mavis Chi co-created the project with him. Ava Labs received funding from leading venture funds: a16z, Polychain, Dragonfly. The mainnet launched in September 2020.',
    },
  },
  {
    question: {
      ru: 'Как работает консенсус «снежинки» (Snowball)?',
      en: 'How does the Snowball consensus work?',
    },
    answer: {
      ru: 'Avalanche использует семейство протоколов Snow (Slush → Snowflake → Snowball). В отличие от PoW (голосование вычислительной мощью) и классического PoS (голосование по монетам), протокол Snow работает через случайную выборку: каждый валидатор случайно опрашивает небольшую подгруппу других валидаторов и принимает мнение большинства. Процесс повторяется до тех пор, пока не достигается уверенный консенсус. Это позволяет достигать финальности транзакций менее чем за 1–2 секунды при тысячах валидаторов без снижения производительности.',
      en: 'Avalanche uses the Snow protocol family (Slush → Snowflake → Snowball). Unlike PoW (voting by computing power) and classical PoS (voting by coins), the Snow protocol works through random sampling: each validator randomly polls a small subset of other validators and adopts the majority opinion. The process repeats until confident consensus is reached. This allows transaction finality in under 1–2 seconds with thousands of validators without performance degradation.',
    },
  },
  {
    question: {
      ru: 'Что такое субсети (Subnets) Avalanche?',
      en: 'What are Avalanche Subnets?',
    },
    answer: {
      ru: 'Субсети — это наиболее уникальная функция Avalanche. Каждый разработчик или компания может создать свою суверенную блокчейн-сеть (субсеть), которая: 1) работает по собственным правилам (своя виртуальная машина, токен, KYC-требования); 2) защищена валидаторами, которых выбирает создатель субсети; 3) при этом может взаимодействовать с основной сетью Avalanche. JPMorgan, деловая платёжная сеть (Spruce), игровые проекты (Gunzilla Off the Grid) — все они используют субсети. Это делает Avalanche привлекательной для корпоративного блокчейна.',
      en: 'Subnets are the most unique feature of Avalanche. Any developer or company can create their own sovereign blockchain network (subnet) that: 1) operates by its own rules (custom virtual machine, token, KYC requirements); 2) is secured by validators chosen by the subnet creator; 3) can still interact with the main Avalanche network. JPMorgan, business payment networks (Spruce), gaming projects (Gunzilla Off the Grid) — all use subnets. This makes Avalanche attractive for enterprise blockchain.',
    },
  },
  {
    question: {
      ru: 'В чём отличие Avalanche от Ethereum?',
      en: 'What is the difference between Avalanche and Ethereum?',
    },
    answer: {
      ru: 'Avalanche — EVM-совместимый блокчейн: разработчики Ethereum могут развернуть проекты практически без изменений кода. Ключевые преимущества перед Ethereum: финальность транзакции < 2 сек (у Ethereum ~12 сек); комиссии значительно ниже (хотя выросли во время перегрузки сети); архитектура субсетей для специализированных цепочек. Основная сеть Avalanche состоит из трёх цепочек: X-Chain (обмен активов), C-Chain (смарт-контракты, EVM), P-Chain (координация валидаторов). Большинство DeFi-активности происходит на C-Chain.',
      en: 'Avalanche is an EVM-compatible blockchain: Ethereum developers can deploy projects with virtually no code changes. Key advantages over Ethereum: transaction finality < 2 seconds (Ethereum ~12 sec); fees significantly lower (though they increased during network congestion); subnet architecture for specialized chains. The main Avalanche network consists of three chains: X-Chain (asset exchange), C-Chain (smart contracts, EVM), P-Chain (validator coordination). Most DeFi activity happens on C-Chain.',
    },
  },
  {
    question: {
      ru: 'Почему AVAX упал в 2022 году?',
      en: 'Why did AVAX fall in 2022?',
    },
    answer: {
      ru: 'AVAX разделил судьбу всего криптобезопасность рынка в 2022 году: крах LUNA/UST в мае (уничтожил $40 млрд) и банкротство FTX в ноябре обвалили весь рынок. Дополнительный фактор: Avalanche имела тесные связи с FTX — биржа вкладывала в экосистему, и после её краха опасения инвесторов усилились. AVAX упал с $140 (ATH ноябрь 2021) до $10 (ноябрь 2022) — падение на 93%. В 2023–2024 году актив восстановился до $30–40 благодаря росту субсетей и институциональным партнёрствам.',
      en: 'AVAX shared the fate of the entire crypto market in 2022: the LUNA/UST collapse in May (destroyed $40 billion) and FTX bankruptcy in November crashed the whole market. Additional factor: Avalanche had close ties with FTX — the exchange invested in the ecosystem, and after its collapse investor concerns intensified. AVAX fell from $140 (ATH November 2021) to $10 (November 2022) — a 93% decline. In 2023–2024 the asset recovered to $30–40 thanks to subnet growth and institutional partnerships.',
    },
  },
  {
    question: {
      ru: 'Каков максимальный запас AVAX?',
      en: 'What is the maximum supply of AVAX?',
    },
    answer: {
      ru: 'Максимальный запас AVAX составляет 720 миллионов токенов. Около 360 млн уже в обращении по состоянию на 2024 год. Новые AVAX создаются как вознаграждения валидаторов и выдаются через стейкинг. Для стейкинга требуется минимум 2 000 AVAX для валидаторов или любая сумма для делегаторов. AVAX также сжигается при оплате комиссий транзакций — это создаёт частично дефляционный механизм. Чем выше активность сети, тем больше AVAX сжигается комиссиями.',
      en: 'The maximum supply of AVAX is 720 million tokens. About 360 million are in circulation as of 2024. New AVAX are created as validator rewards and distributed through staking. Staking requires a minimum of 2,000 AVAX for validators or any amount for delegators. AVAX is also burned when paying transaction fees — creating a partially deflationary mechanism. The higher the network activity, the more AVAX is burned by fees.',
    },
  },
];
