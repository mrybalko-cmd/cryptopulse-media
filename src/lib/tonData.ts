export const TON_INVESTMENT_REFERENCE = [
  {
    yearsAgo: 3,
    year: 2023,
    price: 1.70,
    label: { ru: '3 года назад (2023)', en: '3 years ago (2023)' },
    note: { ru: 'До объявления интеграции с Telegram', en: 'Before Telegram integration announcement' },
  },
];

export const INVESTMENT_AMOUNTS = [100, 500, 1000, 2000, 5000];

export interface TonQuote {
  author: string;
  role: { ru: string; en: string };
  year: number;
  quote: { ru: string; en: string };
  sentiment: 'bullish' | 'bearish' | 'neutral';
}

export const TON_QUOTES: TonQuote[] = [
  {
    author: 'Павел Дуров',
    role: { ru: 'Основатель Telegram', en: 'Founder of Telegram' },
    year: 2023,
    quote: {
      ru: '«Telegram стал первым мессенджером с встроенным криптокошельком для 900 миллионов пользователей. TON — это наш блокчейн.»',
      en: '"Telegram became the first messenger with a built-in crypto wallet for 900 million users. TON is our blockchain."',
    },
    sentiment: 'bullish',
  },
  {
    author: 'Павел Дуров',
    role: { ru: 'Основатель Telegram', en: 'Founder of Telegram' },
    year: 2024,
    quote: {
      ru: '«Мы хотим сделать Web3 таким же простым, как отправка сообщения. С TON и Telegram мы уже на полпути к этой цели.»',
      en: '"We want to make Web3 as simple as sending a message. With TON and Telegram we are already halfway to this goal."',
    },
    sentiment: 'bullish',
  },
  {
    author: 'Николай Дуров',
    role: { ru: 'CTO Telegram, создатель протокола TON', en: 'CTO of Telegram, creator of TON protocol' },
    year: 2021,
    quote: {
      ru: '«TON разработан для скорости и масштаба. Мы реализовали бесконечное шардирование — теоретически сеть может масштабироваться до любой нагрузки.»',
      en: '"TON was designed for speed and scale. We implemented infinite sharding — theoretically the network can scale to any load."',
    },
    sentiment: 'bullish',
  },
  {
    author: 'Гэри Генслер',
    role: { ru: 'Председатель SEC (2021–2025)', en: 'SEC Chair (2021–2025)' },
    year: 2020,
    quote: {
      ru: '«Telegram проводил незарегистрированное предложение ценных бумаг. ICO TON нарушило законы США.»',
      en: '"Telegram conducted an unregistered securities offering. The TON ICO violated US laws."',
    },
    sentiment: 'bearish',
  },
  {
    author: 'Кирилл Мелконьянц',
    role: { ru: 'Аналитик крипторынков', en: 'Crypto market analyst' },
    year: 2024,
    quote: {
      ru: '«TON — единственный блокчейн в истории, имеющий встроенную аудиторию в 900 миллионов пользователей. Это меняет игру.»',
      en: '"TON is the only blockchain in history with a built-in audience of 900 million users. This changes the game."',
    },
    sentiment: 'bullish',
  },
  {
    author: 'Питер Шифф',
    role: { ru: 'Экономист и критик крипто', en: 'Economist and crypto critic' },
    year: 2024,
    quote: {
      ru: '«Блокчейн, принадлежащий компании, принадлежащей одному человеку — это не децентрализация. TON — это цифровая валюта Дурова.»',
      en: '"A blockchain owned by a company owned by one man is not decentralization. TON is Durov\'s digital currency."',
    },
    sentiment: 'bearish',
  },
  {
    author: 'Андрей Дороничев',
    role: { ru: 'Бывший директор Google VR', en: 'Former Google VR Director' },
    year: 2024,
    quote: {
      ru: '«Hamster Kombat на TON за несколько месяцев привлёк 300 миллионов игроков. Это самый быстрый онбординг в Web3 в истории.»',
      en: '"Hamster Kombat on TON attracted 300 million players in a few months. This is the fastest Web3 onboarding in history."',
    },
    sentiment: 'bullish',
  },
  {
    author: 'Павел Дуров',
    role: { ru: 'Основатель Telegram', en: 'Founder of Telegram' },
    year: 2024,
    quote: {
      ru: '«После моего ареста во Франции мне стало ещё яснее: децентрализованные технологии — единственная защита от цифрового авторитаризма.»',
      en: '"After my arrest in France it became even clearer to me: decentralized technologies are the only protection against digital authoritarianism."',
    },
    sentiment: 'bullish',
  },
];

export interface TonFaqItem {
  question: { ru: string; en: string };
  answer: { ru: string; en: string };
}

export const TON_FAQ: TonFaqItem[] = [
  {
    question: {
      ru: 'Каково происхождение TON?',
      en: 'What is the origin of TON?',
    },
    answer: {
      ru: 'TON (The Open Network) имеет необычную историю. В 2018 году Telegram провёл одно из крупнейших ICO в истории — собрал $1,7 млрд от 175 инвесторов. Проект назывался Telegram Open Network. В 2019–2020 годах SEC США заблокировала запуск, обвинив Telegram в проведении незарегистрированного IPO. В мае 2020 года Telegram официально отказался от проекта. Однако сообщество разработчиков продолжило работу под именем Free TON, а позже — TON Foundation. В 2023 году Telegram вернулся к проекту и объявил Toncoin официальным блокчейном.',
      en: 'TON (The Open Network) has an unusual history. In 2018 Telegram conducted one of the largest ICOs in history — raising $1.7 billion from 175 investors. The project was called Telegram Open Network. In 2019–2020 the US SEC blocked the launch, accusing Telegram of conducting an unregistered IPO. In May 2020, Telegram officially abandoned the project. However, a developer community continued the work under the name Free TON, later TON Foundation. In 2023, Telegram returned to the project and declared Toncoin its official blockchain.',
    },
  },
  {
    question: {
      ru: 'Что даёт TON интеграция с Telegram?',
      en: 'What does Telegram integration give TON?',
    },
    answer: {
      ru: 'Интеграция TON с Telegram — беспрецедентное событие в криптоиндустрии. Telegram имеет более 900 миллионов активных пользователей. Что уже работает: Telegram Wallet (встроенный кошелёк для Toncoin и USDT-TON прямо в Telegram); Fragment — NFT-маркетплейс для покупки анонимных номеров и юзернеймов Telegram; Stars — встроенная валюта для оплаты контента в ботах; мини-приложения на базе TON (более 900 млн потенциальных пользователей). Это самая большая встроенная аудитория в истории Web3.',
      en: 'TON\'s integration with Telegram is an unprecedented event in the crypto industry. Telegram has over 900 million active users. What is already working: Telegram Wallet (built-in wallet for Toncoin and USDT-TON directly in Telegram); Fragment — NFT marketplace for buying anonymous numbers and Telegram usernames; Stars — built-in currency for paying for content in bots; TON-based mini-apps (over 900 million potential users). This is the largest built-in audience in Web3 history.',
    },
  },
  {
    question: {
      ru: 'Что такое Hamster Kombat и почему это важно для TON?',
      en: 'What is Hamster Kombat and why is it important for TON?',
    },
    answer: {
      ru: 'Hamster Kombat — кликер-игра в Telegram, запущенная в 2024 году на базе TON. За несколько месяцев она привлекла более 300 миллионов игроков — рекорд для любой Web3-игры. Игра проводила токен-дроп среди активных участников. Несмотря на то что многие критиковали её как «фермерство», она стала наиболее массовым онбордингом в криптовалюту в истории. После неё последовали десятки аналогичных игр (Notcoin, DOGS, BLUM и другие) — все на базе TON, что значительно увеличило транзакционную активность сети.',
      en: 'Hamster Kombat is a clicker game in Telegram launched in 2024 on TON. Within months it attracted over 300 million players — a record for any Web3 game. The game conducted a token airdrop among active participants. Despite being criticized as "farming," it became the most mass crypto onboarding event in history. It was followed by dozens of similar games (Notcoin, DOGS, BLUM and others) — all on TON, significantly increasing the network\'s transaction activity.',
    },
  },
  {
    question: {
      ru: 'Централизован ли TON?',
      en: 'Is TON centralized?',
    },
    answer: {
      ru: 'Это одна из главных дискуссий вокруг TON. Критические аргументы: 1) Telegram фактически контролирует экосистему и может определять её развитие; 2) До 70% начального запуска TON приходилось на связанные с Telegram структуры; 3) Арест Павла Дурова показал, что регуляторы могут давить через основателя. Контраргументы: 1) TON Foundation — независимая организация; 2) Протокол с открытым кодом; 3) Сотни независимых валидаторов. Реальность: TON значительно централизованнее Bitcoin, но предлагает беспрецедентный охват аудитории как компромисс.',
      en: 'This is one of the main debates around TON. Critical arguments: 1) Telegram effectively controls the ecosystem and can determine its development; 2) Up to 70% of TON\'s initial launch went to Telegram-related structures; 3) Pavel Durov\'s arrest showed regulators can pressure through the founder. Counter-arguments: 1) TON Foundation is an independent organization; 2) Open-source protocol; 3) Hundreds of independent validators. Reality: TON is significantly more centralized than Bitcoin but offers unprecedented audience reach as a trade-off.',
    },
  },
  {
    question: {
      ru: 'Насколько быстра сеть TON?',
      en: 'How fast is the TON network?',
    },
    answer: {
      ru: 'TON разработан с расчётом на масштаб. Благодаря технологии динамического шардирования сеть теоретически может обрабатывать более 1 миллиона транзакций в секунду (TPS). Для сравнения: Bitcoin — 7 TPS, Ethereum — ~15 TPS, Solana — 65 000 TPS. На практике реальный объём транзакций TON не достигает максимума, но сеть уже обрабатывала пиковые нагрузки во время крупных дропов. Время финализации транзакции — около 5 секунд. Комиссии — доли цента, что делает TON привлекательным для микроплатежей в Telegram.',
      en: 'TON was designed for scale. Thanks to dynamic sharding technology, the network can theoretically process over 1 million transactions per second (TPS). For comparison: Bitcoin — 7 TPS, Ethereum — ~15 TPS, Solana — 65,000 TPS. In practice real TON transaction volume does not reach the maximum, but the network has already handled peak loads during major airdrops. Transaction finalization time is about 5 seconds. Fees are fractions of a cent, making TON attractive for micro-payments in Telegram.',
    },
  },
  {
    question: {
      ru: 'Каков максимальный запас Toncoin?',
      en: 'What is the maximum supply of Toncoin?',
    },
    answer: {
      ru: 'Toncoin не имеет фиксированного максимального запаса — это инфляционный токен. Новые TON создаются как вознаграждения для валидаторов. Темп инфляции варьируется, но в целом невысок. По состоянию на 2024 год в обращении находится около 5,1 млрд TON. Оригинальные 5 млрд были распределены в 2020 году сообществом, продолжившим проект после отказа Telegram. Поскольку это не дефляционный токен, долгосрочная цена зависит от роста спроса (прежде всего через Telegram-экосистему), а не от встроенного дефицита предложения.',
      en: 'Toncoin has no fixed maximum supply — it is an inflationary token. New TON are created as validator rewards. The inflation rate varies but is generally low. As of 2024 approximately 5.1 billion TON are in circulation. The original 5 billion were distributed in 2020 by the community that continued the project after Telegram\'s withdrawal. Since this is not a deflationary token, the long-term price depends on growing demand (primarily through the Telegram ecosystem) rather than built-in supply scarcity.',
    },
  },
];
