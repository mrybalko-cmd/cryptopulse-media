export const LINK_INVESTMENT_REFERENCE = [
  {
    yearsAgo: 7,
    year: 2019,
    price: 2.50,
    label: { ru: '7 лет назад (2019)', en: '7 years ago (2019)' },
    note: { ru: 'LINK до взрыва DeFi', en: 'LINK before the DeFi explosion' },
  },
  {
    yearsAgo: 5,
    year: 2021,
    price: 20.00,
    label: { ru: '5 лет назад (2021)', en: '5 years ago (2021)' },
    note: { ru: 'LINK — оракул всего DeFi', en: 'LINK — oracle for all of DeFi' },
  },
];

export const INVESTMENT_AMOUNTS = [100, 500, 1000, 2000, 5000];

export interface LinkQuote {
  author: string;
  role: { ru: string; en: string };
  year: number;
  quote: { ru: string; en: string };
  sentiment: 'bullish' | 'bearish' | 'neutral';
}

export const LINK_QUOTES: LinkQuote[] = [
  {
    author: 'Сергей Назаров',
    role: { ru: 'Основатель Chainlink', en: 'Founder of Chainlink' },
    year: 2021,
    quote: {
      ru: '«Chainlink — это не просто оракул цен. Это универсальная инфраструктура для передачи любых данных реального мира в блокчейны.»',
      en: '"Chainlink is not just a price oracle. It is universal infrastructure for delivering any real-world data to blockchains."',
    },
    sentiment: 'bullish',
  },
  {
    author: 'Сергей Назаров',
    role: { ru: 'Основатель Chainlink', en: 'Founder of Chainlink' },
    year: 2023,
    quote: {
      ru: '«CCIP открывает новую эру кросс-чейн взаимодействия. Банки, которые хотят работать с несколькими блокчейнами, могут делать это через единый стандарт.»',
      en: '"CCIP opens a new era of cross-chain interaction. Banks that want to work with multiple blockchains can do so through a single standard."',
    },
    sentiment: 'bullish',
  },
  {
    author: 'Андре Кронье',
    role: { ru: 'Создатель Yearn Finance', en: 'Creator of Yearn Finance' },
    year: 2020,
    quote: {
      ru: '«Если убрать оракулы Chainlink из DeFi — половина протоколов перестанет работать за ночь. Это настоящая инфраструктура.»',
      en: '"If you remove Chainlink oracles from DeFi — half the protocols will stop working overnight. This is true infrastructure."',
    },
    sentiment: 'bullish',
  },
  {
    author: 'Аноним «LINK Marines»',
    role: { ru: 'Прозвище преданного сообщества Chainlink', en: 'Nickname for the devoted Chainlink community' },
    year: 2019,
    quote: {
      ru: '«Продавцы обречены. LINK — 1000x. #LINKARMY»',
      en: '"Sellers are doomed. LINK is 1000x. #LINKARMY"',
    },
    sentiment: 'bullish',
  },
  {
    author: 'Питер Шифф',
    role: { ru: 'Экономист и критик крипто', en: 'Economist and crypto critic' },
    year: 2022,
    quote: {
      ru: '«Chainlink — хорошая технология для решения проблемы, которая существует только в блокчейнах. Реальный мир не нуждается в децентрализованных оракулах.»',
      en: '"Chainlink is good technology for solving a problem that only exists in blockchains. The real world does not need decentralized oracles."',
    },
    sentiment: 'bearish',
  },
  {
    author: 'Артур Хейс',
    role: { ru: 'Сооснователь BitMEX', en: 'Co-founder of BitMEX' },
    year: 2023,
    quote: {
      ru: '«Chainlink — одна из немногих крипто-инфраструктур, которую институциональные банки серьёзно рассматривают. Партнёрства с SWIFT и Swift говорят о реальной деловой тяге.»',
      en: '"Chainlink is one of the few crypto infrastructures that institutional banks seriously consider. Partnerships with SWIFT speak to real business traction."',
    },
    sentiment: 'bullish',
  },
  {
    author: 'Гэвин Вуд',
    role: { ru: 'Основатель Polkadot', en: 'Founder of Polkadot' },
    year: 2020,
    quote: {
      ru: '«Оракулы — критически важная часть блокчейн-стека. Chainlink проделал отличную работу по стандартизации этого слоя.»',
      en: '"Oracles are a critically important part of the blockchain stack. Chainlink has done excellent work standardizing this layer."',
    },
    sentiment: 'bullish',
  },
  {
    author: 'Рейн Лохмус',
    role: { ru: 'Сооснователь LHV Bank', en: 'Co-founder of LHV Bank' },
    year: 2023,
    quote: {
      ru: '«Возможность CCIP интегрировать традиционные банковские системы с DeFi через Chainlink — это то, что нас реально интересует.»',
      en: '"The ability of CCIP to integrate traditional banking systems with DeFi through Chainlink is what genuinely interests us."',
    },
    sentiment: 'bullish',
  },
];

export interface LinkFaqItem {
  question: { ru: string; en: string };
  answer: { ru: string; en: string };
}

export const LINK_FAQ: LinkFaqItem[] = [
  {
    question: {
      ru: 'Что такое оракул и почему Chainlink так важен?',
      en: 'What is an oracle and why is Chainlink so important?',
    },
    answer: {
      ru: 'Смарт-контракты на блокчейне «слепы» — они не могут самостоятельно получить данные из внешнего мира (цены, погода, спортивные результаты, курсы валют). Оракул — это посредник, который доставляет внешние данные в смарт-контракт. Проблема централизованного оракула: если он взломан или лжёт — весь протокол можно манипулировать. Chainlink решает это через сеть независимых узлов-операторов, которые агрегируют данные из множества источников. По состоянию на 2024 год Chainlink обеспечивает оракулами DeFi-протоколы с совокупным TVL более $40 млрд.',
      en: 'Smart contracts on a blockchain are "blind" — they cannot independently access data from the outside world (prices, weather, sports results, exchange rates). An oracle is an intermediary that delivers external data to a smart contract. The problem with a centralized oracle: if it is hacked or lies — the entire protocol can be manipulated. Chainlink solves this through a network of independent node operators that aggregate data from multiple sources. As of 2024, Chainlink provides oracles for DeFi protocols with a combined TVL of over $40 billion.',
    },
  },
  {
    question: {
      ru: 'Как используется токен LINK?',
      en: 'How is the LINK token used?',
    },
    answer: {
      ru: 'LINK — это токен оплаты в экосистеме Chainlink. Смарт-контракты и протоколы платят LINK узлам-операторам Chainlink за предоставление данных. Оператор должен также застейкать LINK в качестве залога: если он предоставляет ложные данные — теряет стейк. Это создаёт экономический стимул для честности. С запуском стейкинга в 2022 году и расширенной версии в 2023 году обычные держатели тоже могут стейкать LINK и получать доходность. Спрос на LINK растёт пропорционально активности DeFi-экосистемы.',
      en: 'LINK is the payment token in the Chainlink ecosystem. Smart contracts and protocols pay LINK to Chainlink node operators for data delivery. Operators must also stake LINK as collateral: if they provide false data — they lose their stake. This creates an economic incentive for honesty. With the launch of staking in 2022 and the expanded version in 2023, regular holders can also stake LINK and earn yield. Demand for LINK grows proportionally with DeFi ecosystem activity.',
    },
  },
  {
    question: {
      ru: 'Какие продукты предлагает Chainlink кроме прайс-фидов?',
      en: 'What products does Chainlink offer beyond price feeds?',
    },
    answer: {
      ru: 'Chainlink расширился далеко за пределы оракулов цен. Ключевые продукты: Price Feeds — агрегированные ценовые данные для 1500+ пар; VRF (Verifiable Random Function) — доказуемо случайные числа для NFT, игр и лотерей; Automation (бывший Keepers) — автоматические триггеры для смарт-контрактов; Proof of Reserve — мониторинг резервов стейблкоинов и wrapped-токенов; CCIP (Cross-Chain Interoperability Protocol) — стандарт для безопасного кросс-чейн перевода токенов и сообщений. CCIP используется SWIFT, Fidelity и другими крупными финансовыми институтами.',
      en: 'Chainlink has expanded far beyond price oracles. Key products: Price Feeds — aggregated price data for 1500+ pairs; VRF (Verifiable Random Function) — provably fair random numbers for NFTs, games and lotteries; Automation (formerly Keepers) — automatic triggers for smart contracts; Proof of Reserve — monitoring reserves of stablecoins and wrapped tokens; CCIP (Cross-Chain Interoperability Protocol) — standard for secure cross-chain transfer of tokens and messages. CCIP is used by SWIFT, Fidelity and other major financial institutions.',
    },
  },
  {
    question: {
      ru: 'Почему LINK называют «тайным победителем» DeFi?',
      en: 'Why is LINK called the "quiet winner" of DeFi?',
    },
    answer: {
      ru: 'DeFi-протоколы (Aave, Compound, Synthetix, dYdX, Curve и другие) не могут нормально работать без оракулов цен. Chainlink занимает около 75–80% рынка DeFi-оракулов по всем блокчейнам. Это значит: чем больше растёт DeFi — тем больше протоколов зависят от Chainlink. Инвесторы называют LINK «тайным победителем», потому что он извлекает выгоду из роста всей экосистемы, а не отдельной платформы. Сходство с «лопатами в золотой лихорадке»: добытчики богатеют по-разному, а продавцы инструментов — всегда.',
      en: 'DeFi protocols (Aave, Compound, Synthetix, dYdX, Curve and others) cannot function properly without price oracles. Chainlink holds approximately 75–80% of the DeFi oracle market across all blockchains. This means: the more DeFi grows — the more protocols depend on Chainlink. Investors call LINK the "quiet winner" because it benefits from the growth of the entire ecosystem, not a single platform. The analogy to "picks and shovels in the gold rush": miners profit differently, but tool sellers always win.',
    },
  },
  {
    question: {
      ru: 'Когда Chainlink наконец запустил стейкинг?',
      en: 'When did Chainlink finally launch staking?',
    },
    answer: {
      ru: 'Стейкинг LINK был одним из самых долгожданных событий в истории токена — сообщество ждало его годами. Первая версия (v0.1) запустилась в декабре 2022 года с лимитом 25 млн LINK. Расширенная версия v0.2 вышла в ноябре 2023 года с увеличенным пулом до 45 млн LINK и улучшенной системой наград. Доходность стейкинга невысока (~5% годовых) и финансируется Chainlink Labs, а не транзакционными комиссиями, — что критики считают неустойчивым. Переход к полностью «fee-based» стейкингу остаётся целью на будущее.',
      en: 'LINK staking was one of the most anticipated events in the token\'s history — the community waited for it for years. The first version (v0.1) launched in December 2022 with a 25 million LINK cap. The expanded v0.2 released in November 2023 with an increased pool of 45 million LINK and improved reward system. Staking yield is modest (~5% annually) and funded by Chainlink Labs rather than transaction fees — which critics consider unsustainable. Transitioning to fully "fee-based" staking remains a future goal.',
    },
  },
  {
    question: {
      ru: 'Каков максимальный запас LINK?',
      en: 'What is the maximum supply of LINK?',
    },
    answer: {
      ru: 'Максимальный запас LINK составляет 1 млрд токенов — это фиксированное число, новые LINK не создаются. Изначальное распределение: 35% — публичная продажа (ICO 2017), 35% — Chainlink Labs (команда), 30% — Node Operator Incentives (стимулы для операторов узлов, выдаются постепенно). По состоянию на 2024 год в обращении находится около 580–600 млн LINK. Tokennomics относительно простая и предсказуемая. Отсутствие инфляции — плюс для долгосрочных держателей, хотя конкурентный рынок оракулов может давить на цену.',
      en: 'The maximum supply of LINK is 1 billion tokens — a fixed number with no new LINK created. Initial distribution: 35% — public sale (2017 ICO), 35% — Chainlink Labs (team), 30% — Node Operator Incentives (gradual distribution). As of 2024 approximately 580–600 million LINK are in circulation. Tokenomics are relatively simple and predictable. The absence of inflation is a plus for long-term holders, though a competitive oracle market may pressure the price.',
    },
  },
];
