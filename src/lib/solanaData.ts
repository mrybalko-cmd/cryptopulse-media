// Historical SOL prices: average price in July of each year
// Solana mainnet launched March 2020, so data available from 2021
export const SOL_INVESTMENT_REFERENCE = [
  {
    yearsAgo: 5,
    year: 2021,
    price: 35.00,
    label: { ru: '5 лет назад (2021)', en: '5 years ago (2021)' },
    note: { ru: 'Старт NFT-бума на Solana', en: 'Start of Solana NFT boom' },
  },
];

export const INVESTMENT_AMOUNTS = [100, 500, 1000, 2000, 5000];

export interface SolQuote {
  author: string;
  role: { ru: string; en: string };
  year: number;
  quote: { ru: string; en: string };
  sentiment: 'bullish' | 'bearish' | 'neutral';
}

export const SOL_QUOTES: SolQuote[] = [
  {
    author: 'Анатолий Яковенко',
    role: { ru: 'Основатель Solana', en: 'Founder of Solana' },
    year: 2020,
    quote: {
      ru: '«Доказательство истории (Proof of History) — это не консенсусный механизм. Это криптографические часы, которые позволяют сети договориться о времени без единого координатора.»',
      en: '"Proof of History is not a consensus mechanism. It\'s a cryptographic clock that lets the network agree on time without a single coordinator."',
    },
    sentiment: 'bullish',
  },
  {
    author: 'Радж Гокал',
    role: { ru: 'Сооснователь Solana Labs', en: 'Co-founder of Solana Labs' },
    year: 2021,
    quote: {
      ru: '«Мы строим единый глобальный компьютер. Один блокчейн — не тысяча шардов и L2. Разработчики должны писать код для единого состояния.»',
      en: '"We are building a single global computer. One blockchain — not a thousand shards and L2s. Developers should write code for a single state."',
    },
    sentiment: 'bullish',
  },
  {
    author: 'Марк Кубан',
    role: { ru: 'Миллиардер, владелец Dallas Mavericks', en: 'Billionaire, owner of Dallas Mavericks' },
    year: 2021,
    quote: {
      ru: '«Solana — самая быстрая и дешёвая платформа смарт-контрактов на рынке. Она побеждает Ethereum по всем техническим показателям.»',
      en: '"Solana is the fastest and cheapest smart contract platform on the market. It beats Ethereum on every technical metric."',
    },
    sentiment: 'bullish',
  },
  {
    author: 'Виталик Бутерин',
    role: { ru: 'Создатель Ethereum', en: 'Creator of Ethereum' },
    year: 2022,
    quote: {
      ru: '«Высокая производительность, достигнутая за счёт централизации, не является достижением. Истинная масштабируемость должна сохранять децентрализацию.»',
      en: '"High performance achieved through centralization is not an achievement. True scalability must preserve decentralization."',
    },
    sentiment: 'bearish',
  },
  {
    author: 'Кэти Вуд',
    role: { ru: 'CEO ARK Invest', en: 'CEO of ARK Invest' },
    year: 2023,
    quote: {
      ru: '«Solana продемонстрировала невероятную устойчивость. Восстановление после коллапса FTX говорит о силе технологии и сообщества.»',
      en: '"Solana has demonstrated remarkable resilience. Recovery after the FTX collapse speaks to the strength of the technology and community."',
    },
    sentiment: 'bullish',
  },
  {
    author: 'Питер Шифф',
    role: { ru: 'Экономист и критик крипто', en: 'Economist and crypto critic' },
    year: 2022,
    quote: {
      ru: '«Solana — это просто централизованная база данных с модным логотипом. Когда сеть упала в четвёртый раз, никто даже не удивился.»',
      en: '"Solana is just a centralized database with a fancy logo. When the network went down for the fourth time, nobody was even surprised."',
    },
    sentiment: 'bearish',
  },
  {
    author: 'Брайан Армстронг',
    role: { ru: 'CEO Coinbase', en: 'CEO of Coinbase' },
    year: 2023,
    quote: {
      ru: '«Solana — один из самых инновационных блокчейнов в экосистеме. Coinbase продолжит поддерживать её развитие.»',
      en: '"Solana is one of the most innovative blockchains in the ecosystem. Coinbase will continue to support its development."',
    },
    sentiment: 'bullish',
  },
  {
    author: 'Аарон Лукашевски',
    role: { ru: 'Аналитик Kaiko Research', en: 'Analyst at Kaiko Research' },
    year: 2024,
    quote: {
      ru: '«Рост Solana в 2024 году — это не просто спекуляция. За ним стоит реальный рост числа активных пользователей, объёмов DEX и разработчиков.»',
      en: '"Solana\'s growth in 2024 is not just speculation. Behind it lies real growth in active users, DEX volume and developer activity."',
    },
    sentiment: 'bullish',
  },
];

export interface SolFaqItem {
  question: { ru: string; en: string };
  answer: { ru: string; en: string };
}

export const SOL_FAQ: SolFaqItem[] = [
  {
    question: {
      ru: 'Кто создал Solana?',
      en: 'Who created Solana?',
    },
    answer: {
      ru: 'Solana была создана Анатолием Яковенко — выходцем из Украины, инженером Qualcomm и Dropbox. Идея пришла к нему в 2017 году: он осознал, что главная проблема блокчейнов — не скорость процессора, а отсутствие единого понимания времени между узлами сети. Решением стал Proof of History. Вместе с Раджем Гокалом и другими инженерами Яковенко основал Solana Labs в 2018 году. Mainnet Beta запущена в марте 2020 года.',
      en: 'Solana was created by Anatoly Yakovenko — a Ukrainian-born engineer from Qualcomm and Dropbox. The idea came to him in 2017: he realized that the main problem with blockchains was not processor speed but the lack of a shared understanding of time between network nodes. The solution was Proof of History. Together with Raj Gokal and other engineers, Yakovenko founded Solana Labs in 2018. The Mainnet Beta launched in March 2020.',
    },
  },
  {
    question: {
      ru: 'Что такое Proof of History и почему Solana такая быстрая?',
      en: 'What is Proof of History and why is Solana so fast?',
    },
    answer: {
      ru: 'Proof of History (PoH) — это криптографический механизм, который позволяет записывать события в хронологическом порядке без необходимости согласовывать время между узлами сети. Это как доверенные часы для всего блокчейна: каждый узел может независимо проверить порядок событий. Благодаря этому Solana обрабатывает до 65 000 транзакций в секунду (против ~15 у Ethereum) с временем блока ~400 мс и комиссией в доли цента.',
      en: 'Proof of History (PoH) is a cryptographic mechanism that allows events to be recorded in chronological order without nodes needing to agree on time between themselves. Think of it as a trusted clock for the entire blockchain: every node can independently verify the order of events. This allows Solana to process up to 65,000 transactions per second (vs. ~15 for Ethereum), with a block time of ~400ms and fees of fractions of a cent.',
    },
  },
  {
    question: {
      ru: 'Что случилось с Solana во время краха FTX?',
      en: 'What happened to Solana during the FTX collapse?',
    },
    answer: {
      ru: 'В ноябре 2022 года крах биржи FTX стал катастрофой для Solana: FTX и связанная с ней Alameda Research держали огромные позиции в SOL и были крупнейшими инвесторами экосистемы. После банкротства FTX цена SOL рухнула с $38 до $8 (-80%), а экосистема потеряла ключевых спонсоров. Многие объявили о «смерти Solana». Однако сеть продолжила работу без перебоев, разработчики остались, и к 2023–2024 году SOL полностью восстановился и достиг новых максимумов.',
      en: 'In November 2022, the FTX exchange collapse was catastrophic for Solana: FTX and affiliated Alameda Research held massive SOL positions and were the ecosystem\'s largest investors. After FTX\'s bankruptcy, SOL crashed from $38 to $8 (-80%) and the ecosystem lost its key sponsors. Many declared Solana "dead." However, the network continued running without interruption, developers stayed, and by 2023–2024 SOL fully recovered and reached new all-time highs.',
    },
  },
  {
    question: {
      ru: 'Правда ли что Solana централизована?',
      en: 'Is Solana really centralized?',
    },
    answer: {
      ru: 'Это частая критика. По сравнению с Bitcoin и Ethereum у Solana действительно выше минимальные требования к валидаторам (мощный сервер, быстрый интернет), что ограничивает число независимых узлов. Кроме того, у Solana Labs изначально было значительное влияние на развитие сети. С другой стороны, сеть насчитывает тысячи валидаторов по всему миру и не имеет единой точки отказа. Spoiler: полная децентрализация и высокая производительность — технический компромисс, известный как «трилемма блокчейна».',
      en: 'This is a common criticism. Compared to Bitcoin and Ethereum, Solana has higher minimum requirements for validators (powerful servers, fast internet), which limits the number of independent nodes. Additionally, Solana Labs initially had significant influence over network development. On the other hand, the network has thousands of validators worldwide and no single point of failure. Note: full decentralization and high performance is a technical trade-off known as the "blockchain trilemma."',
    },
  },
  {
    question: {
      ru: 'Почему Solana иногда «падала»?',
      en: 'Why did Solana experience outages?',
    },
    answer: {
      ru: 'С 2021 по 2022 год Solana пережила несколько сбоев сети (от нескольких часов до суток). Причины варьировались: в 2021 году сеть перегрузил поток транзакций от IDO-ботов; в 2022-м — ошибки в обработке дубликатных транзакций. Команда Solana Labs оперативно выпускала обновления. С конца 2022 года значительных сбоев не было. Критики указывают на это как на признак централизации; сторонники — как на нормальный путь развития молодого протокола.',
      en: 'Between 2021 and 2022, Solana experienced several network outages (from a few hours to a full day). Causes varied: in 2021 the network was overwhelmed by IDO bot traffic; in 2022 — bugs in duplicate transaction handling. The Solana Labs team released fixes promptly. Since late 2022 there have been no significant outages. Critics point to this as a sign of centralization; supporters see it as a normal development path for a young protocol.',
    },
  },
  {
    question: {
      ru: 'Каковы основные применения Solana?',
      en: 'What are the main use cases of Solana?',
    },
    answer: {
      ru: 'Благодаря высокой скорости и низким комиссиям Solana особенно популярна в нескольких нишах: NFT (крупнейшие коллекции вроде Mad Lads, Tensorian), DeFi (DEX Jupiter — один из крупнейших в крипто), мобильные приложения (Solana Mobile, Saga-телефон), игры и GameFi, мем-коины (BONK, WIF и другие), а также платежи — сеть Visa тестировала расчёты через Solana.',
      en: 'Thanks to high speed and low fees, Solana is especially popular in several niches: NFTs (major collections like Mad Lads, Tensorian), DeFi (Jupiter DEX — one of the largest in crypto), mobile apps (Solana Mobile, Saga phone), gaming and GameFi, meme coins (BONK, WIF and others), and payments — Visa tested settlements via Solana.',
    },
  },
];
