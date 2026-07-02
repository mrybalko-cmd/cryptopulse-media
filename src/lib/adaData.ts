export const ADA_INVESTMENT_REFERENCE = [
  {
    yearsAgo: 7,
    year: 2019,
    price: 0.065,
    label: { ru: '7 лет назад (2019)', en: '7 years ago (2019)' },
    note: { ru: 'Cardano до смарт-контрактов', en: 'Cardano before smart contracts' },
  },
  {
    yearsAgo: 5,
    year: 2021,
    price: 1.20,
    label: { ru: '5 лет назад (2021)', en: '5 years ago (2021)' },
    note: { ru: 'До запуска смарт-контрактов Alonzo', en: 'Before Alonzo smart contracts launch' },
  },
];

export const INVESTMENT_AMOUNTS = [100, 500, 1000, 2000, 5000];

export interface AdaQuote {
  author: string;
  role: { ru: string; en: string };
  year: number;
  quote: { ru: string; en: string };
  sentiment: 'bullish' | 'bearish' | 'neutral';
}

export const ADA_QUOTES: AdaQuote[] = [
  {
    author: 'Чарльз Хоскинсон',
    role: { ru: 'Основатель Cardano, сооснователь Ethereum', en: 'Founder of Cardano, Ethereum co-founder' },
    year: 2021,
    quote: {
      ru: '«Мы строим финансовую операционную систему для 3 миллиардов людей, которые не имеют доступа к банкам. Это займёт время, но иначе и быть не может.»',
      en: '"We are building a financial operating system for 3 billion people who lack access to banks. This will take time, but it cannot be otherwise."',
    },
    sentiment: 'bullish',
  },
  {
    author: 'Чарльз Хоскинсон',
    role: { ru: 'Основатель Cardano', en: 'Founder of Cardano' },
    year: 2022,
    quote: {
      ru: '«Все говорят, что у Cardano нет dApps. Но у нас есть лучшая академическая основа в индустрии и смарт-контракты, верифицированные формальными методами.»',
      en: '"Everyone says Cardano has no dApps. But we have the best academic foundation in the industry and smart contracts verified by formal methods."',
    },
    sentiment: 'bullish',
  },
  {
    author: 'Виталик Бутерин',
    role: { ru: 'Создатель Ethereum', en: 'Creator of Ethereum' },
    year: 2022,
    quote: {
      ru: '«Cardano имеет академически строгий подход, но мне кажется, что скорость развития слишком медленная, чтобы оставаться актуальной.»',
      en: '"Cardano has an academically rigorous approach, but I feel the development pace is too slow to remain relevant."',
    },
    sentiment: 'neutral',
  },
  {
    author: 'Кэти Вуд',
    role: { ru: 'CEO ARK Invest', en: 'CEO of ARK Invest' },
    year: 2021,
    quote: {
      ru: '«Cardano — одна из наиболее тщательно разработанных блокчейн-платформ. Академический подход команды — это конкурентное преимущество в долгосрочной перспективе.»',
      en: '"Cardano is one of the most carefully engineered blockchain platforms. The team\'s academic approach is a competitive advantage in the long run."',
    },
    sentiment: 'bullish',
  },
  {
    author: 'Питер Шифф',
    role: { ru: 'Экономист и критик крипто', en: 'Economist and crypto critic' },
    year: 2021,
    quote: {
      ru: '«Cardano существует уже много лет и всё это время обещает смарт-контракты. Когда обещания превращаются в маркетинг — это красный флаг.»',
      en: '"Cardano has existed for years and has been promising smart contracts all this time. When promises turn into marketing — that is a red flag."',
    },
    sentiment: 'bearish',
  },
  {
    author: 'Антони Помплиано',
    role: { ru: 'Инвестор и криптопредприниматель', en: 'Investor and crypto entrepreneur' },
    year: 2021,
    quote: {
      ru: '«ADA рос быстрее, чем большинство активов в 2021 году. Но инвесторы должны понимать: за ценой должен стоять реальный продукт.»',
      en: '"ADA grew faster than most assets in 2021. But investors need to understand: real products must back the price."',
    },
    sentiment: 'neutral',
  },
  {
    author: 'Луис Лампрей',
    role: { ru: 'Директор IOHK', en: 'Director at IOHK' },
    year: 2023,
    quote: {
      ru: '«Ekosistema Cardano набирает обороты. SundaeSwap, MELD, WingRiders, jpg.store — это реальные dApps с реальными пользователями.»',
      en: '"The Cardano ecosystem is gaining momentum. SundaeSwap, MELD, WingRiders, jpg.store — these are real dApps with real users."',
    },
    sentiment: 'bullish',
  },
  {
    author: 'Чарльз Хоскинсон',
    role: { ru: 'Основатель Cardano', en: 'Founder of Cardano' },
    year: 2024,
    quote: {
      ru: '«Эпоха Вольтер — это децентрализованное управление. Cardano становится первым блокчейном, которым полностью управляет сообщество.»',
      en: '"The Voltaire era is decentralized governance. Cardano becomes the first blockchain fully governed by its community."',
    },
    sentiment: 'bullish',
  },
];

export interface AdaFaqItem {
  question: { ru: string; en: string };
  answer: { ru: string; en: string };
}

export const ADA_FAQ: AdaFaqItem[] = [
  {
    question: {
      ru: 'Кто создал Cardano и в чём его философия?',
      en: 'Who created Cardano and what is its philosophy?',
    },
    answer: {
      ru: 'Cardano основал Чарльз Хоскинсон в 2015 году после конфликта с Виталиком Бутериным и ухода из Ethereum. Через IOHK (Input Output Hong Kong) он собрал команду академиков и исследователей. Философия Cardano: «исследования прежде разработки». Все изменения в протоколе публикуются как рецензируемые научные работы, проверяются формальными методами верификации. Это делает Cardano одним из самых академически строгих проектов в криптоиндустрии.',
      en: 'Cardano was founded by Charles Hoskinson in 2015 after a conflict with Vitalik Buterin and departure from Ethereum. Through IOHK (Input Output Hong Kong) he assembled a team of academics and researchers. Cardano\'s philosophy: "research before development." All protocol changes are published as peer-reviewed academic papers and verified by formal methods. This makes Cardano one of the most academically rigorous projects in the crypto industry.',
    },
  },
  {
    question: {
      ru: 'Как работает Proof of Stake Ouroboros?',
      en: 'How does Ouroboros Proof of Stake work?',
    },
    answer: {
      ru: 'Ouroboros — первый научно рецензируемый алгоритм Proof of Stake. В отличие от простых PoS-механизмов, Ouroboros разбивает время на «эпохи» и «слоты», случайно выбирая лидеров-блокировщиков пропорционально их стейку. Безопасность алгоритма доказана математически, а не только протестирована эмпирически. Стейкинг ADA доступен напрямую из кошелька, без блокировки монет (можно тратить в любой момент) — что принципиально отличает его от Ethereum, где ETH блокировался до The Merge.',
      en: 'Ouroboros is the first peer-reviewed Proof of Stake algorithm. Unlike simple PoS mechanisms, Ouroboros divides time into "epochs" and "slots," randomly selecting block-producing leaders proportional to their stake. The algorithm\'s security is proven mathematically, not just tested empirically. ADA staking is available directly from a wallet without locking coins (you can spend them at any time) — fundamentally different from Ethereum where ETH was locked until The Merge.',
    },
  },
  {
    question: {
      ru: 'Почему Cardano называют «самым медленным» блокчейном?',
      en: 'Why is Cardano called the "slowest" blockchain?',
    },
    answer: {
      ru: 'Это преувеличение, но с долей правды. Cardano разрабатывается по строгой академической методологии: каждое изменение проходит этапы исследования, рецензирования, тестирования и только потом внедряется в mainnet. Смарт-контракты появились лишь в сентябре 2021 (обновление Alonzo) — спустя 4 года после ICO. Критики называют это маркетинговым провалом. Сторонники считают: лучше опоздать с надёжным продуктом, чем выпустить сырой. К 2023–2024 году экосистема DeFi на Cardano реально выросла.',
      en: 'This is an exaggeration but with a grain of truth. Cardano is developed using strict academic methodology: every change goes through research, peer review, testing phases before mainnet deployment. Smart contracts only arrived in September 2021 (Alonzo upgrade) — four years after the ICO. Critics call this a marketing failure. Supporters argue: better to be late with a reliable product than to ship something raw. By 2023–2024 the Cardano DeFi ecosystem genuinely grew.',
    },
  },
  {
    question: {
      ru: 'Что такое эпохи развития Cardano?',
      en: 'What are the Cardano development eras?',
    },
    answer: {
      ru: 'Cardano развивается по поэтапной «дорожной карте» из пяти эр, каждая названа в честь поэтов и математиков: Byron (2017) — базовая инфраструктура; Shelley (2020) — полная децентрализация, стейкинг; Goguen (2021) — смарт-контракты (Alonzo); Basho (2022–2023) — масштабирование (Vasil, Hydra L2); Voltaire (2023–2024) — управление и DAO. Модель Voltaire делает Cardano первым крупным блокчейном с on-chain децентрализованным управлением через «Project Catalyst».',
      en: 'Cardano develops through a phased "roadmap" of five eras, each named after poets and mathematicians: Byron (2017) — base infrastructure; Shelley (2020) — full decentralization, staking; Goguen (2021) — smart contracts (Alonzo); Basho (2022–2023) — scaling (Vasil, Hydra L2); Voltaire (2023–2024) — governance and DAO. The Voltaire model makes Cardano the first major blockchain with on-chain decentralized governance through "Project Catalyst."',
    },
  },
  {
    question: {
      ru: 'Есть ли реальные dApps на Cardano?',
      en: 'Are there real dApps on Cardano?',
    },
    answer: {
      ru: 'После запуска смарт-контрактов в сентябре 2021 года экосистема начала расти медленно, но уверенно. К 2023–2024 году Cardano имеет несколько активных DEX (SundaeSwap, MuesliSwap, Minswap), стейблкоин-протоколы (Djed), NFT-маркетплейсы (jpg.store — один из крупнейших в крипто), протоколы кредитования (MELD). TVL (Total Value Locked) в DeFi на Cardano значительно ниже, чем у Ethereum или Solana, но тренд положительный. Язык программирования Plutus/Haskell сложнее Solidity, что ограничивает пул разработчиков.',
      en: 'After smart contracts launched in September 2021 the ecosystem started growing slowly but steadily. By 2023–2024 Cardano has several active DEXes (SundaeSwap, MuesliSwap, Minswap), stablecoin protocols (Djed), NFT marketplaces (jpg.store — one of the largest in crypto), lending protocols (MELD). TVL (Total Value Locked) in Cardano DeFi is significantly lower than Ethereum or Solana, but the trend is positive. The Plutus/Haskell programming language is harder than Solidity, limiting the developer pool.',
    },
  },
  {
    question: {
      ru: 'Каков максимальный запас ADA?',
      en: 'What is the maximum supply of ADA?',
    },
    answer: {
      ru: 'Максимальный запас ADA составляет 45 млрд монет. Это фиксированная цифра — как у Bitcoin. По состоянию на 2024 год в обращении находится около 35 млрд ADA. Оставшиеся монеты постепенно распределяются через вознаграждения за стейкинг. Важная деталь: Cardano не имеет механизма сжигания токенов, поэтому инфляция здесь выражается в постепенном выпуске новых монет из резерва (не печатании новых). Со временем инфляция замедляется по мере приближения к лимиту.',
      en: 'The maximum supply of ADA is 45 billion coins. This is a fixed number — like Bitcoin. As of 2024 approximately 35 billion ADA are in circulation. The remaining coins are gradually distributed through staking rewards. Important detail: Cardano has no token burning mechanism, so inflation is expressed as gradual release of new coins from the reserve (not printing new ones). Over time, inflation slows as it approaches the limit.',
    },
  },
];
