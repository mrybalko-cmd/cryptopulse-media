export const TRX_INVESTMENT_REFERENCE = [
  {
    yearsAgo: 7,
    year: 2019,
    price: 0.025,
    label: { ru: '7 лет назад (2019)', en: '7 years ago (2019)' },
    note: { ru: 'TRX до USDT на Tron', en: 'TRX before USDT on Tron' },
  },
  {
    yearsAgo: 5,
    year: 2021,
    price: 0.065,
    label: { ru: '5 лет назад (2021)', en: '5 years ago (2021)' },
    note: { ru: 'Tron — главный канал USDT', en: 'Tron becomes dominant USDT channel' },
  },
];

export const INVESTMENT_AMOUNTS = [100, 500, 1000, 2000, 5000];

export interface TrxQuote {
  author: string;
  role: { ru: string; en: string };
  year: number;
  quote: { ru: string; en: string };
  sentiment: 'bullish' | 'bearish' | 'neutral';
}

export const TRX_QUOTES: TrxQuote[] = [
  {
    author: 'Джастин Сан',
    role: { ru: 'Основатель Tron', en: 'Founder of Tron' },
    year: 2018,
    quote: {
      ru: '«Tron построит основу децентрализованного интернета. Мы поможем создателям контента напрямую получать доход от своей аудитории.»',
      en: '"Tron will build the foundation of the decentralized internet. We will help content creators earn directly from their audience."',
    },
    sentiment: 'bullish',
  },
  {
    author: 'Джастин Сан',
    role: { ru: 'Основатель Tron', en: 'Founder of Tron' },
    year: 2020,
    quote: {
      ru: '«Объём USDT в сети Tron превысил объём USDT на Ethereum. Мы доказали, что блокчейн можно использовать для реальных платежей.»',
      en: '"USDT volume on Tron has exceeded USDT on Ethereum. We have proven that blockchain can be used for real payments."',
    },
    sentiment: 'bullish',
  },
  {
    author: 'Виталик Бутерин',
    role: { ru: 'Создатель Ethereum', en: 'Creator of Ethereum' },
    year: 2018,
    quote: {
      ru: '«Whitepaper Tron содержит значительные фрагменты, скопированные из других проектов без атрибуции. Это серьёзная проблема.»',
      en: '"The Tron whitepaper contains significant passages copied from other projects without attribution. This is a serious problem."',
    },
    sentiment: 'bearish',
  },
  {
    author: 'Уоррен Баффет',
    role: { ru: 'Легендарный инвестор', en: 'Legendary investor' },
    year: 2023,
    quote: {
      ru: '«Я не куплю ни одну криптовалюту по любой цене. Это не производительный актив.»',
      en: '"I would not buy any cryptocurrency at any price. It is not a productive asset."',
    },
    sentiment: 'bearish',
  },
  {
    author: 'Рафаэль Шульман',
    role: { ru: 'Аналитик Nansen', en: 'Analyst at Nansen' },
    year: 2023,
    quote: {
      ru: '«Tron обрабатывает колоссальные объёмы USDT-транзакций. Это реальная утилита — не спекуляция. Tron стал инфраструктурой для крипто-долларизации.»',
      en: '"Tron processes enormous USDT transaction volumes. This is real utility — not speculation. Tron has become infrastructure for crypto-dollarization."',
    },
    sentiment: 'bullish',
  },
  {
    author: 'Питер Шифф',
    role: { ru: 'Экономист и критик крипто', en: 'Economist and crypto critic' },
    year: 2021,
    quote: {
      ru: '«Большинство Tron-транзакций — это USDT, а не TRX. Рост сети не означает роста ценности токена.»',
      en: '"Most Tron transactions are USDT, not TRX. Network growth does not mean token value growth."',
    },
    sentiment: 'bearish',
  },
  {
    author: 'Джастин Сан',
    role: { ru: 'Посол Гренады при ВТО', en: 'Grenada\'s Ambassador to the WTO' },
    year: 2021,
    quote: {
      ru: '«Я горжусь стать представителем Гренады в ВТО. Это возможность продвигать криптовалюты на международном уровне.»',
      en: '"I am proud to become Grenada\'s representative to the WTO. This is an opportunity to promote cryptocurrencies at the international level."',
    },
    sentiment: 'neutral',
  },
  {
    author: 'Анонимный пользователь Binance',
    role: { ru: 'Популярная шутка в крипто-сообществе', en: 'Popular joke in the crypto community' },
    year: 2020,
    quote: {
      ru: '«Если хочешь перевести USDT быстро и дёшево — используй TRC-20. Если хочешь потратить половину на газ — используй ERC-20.»',
      en: '"If you want to send USDT fast and cheap — use TRC-20. If you want to spend half on gas — use ERC-20."',
    },
    sentiment: 'bullish',
  },
];

export interface TrxFaqItem {
  question: { ru: string; en: string };
  answer: { ru: string; en: string };
}

export const TRX_FAQ: TrxFaqItem[] = [
  {
    question: {
      ru: 'Для чего реально используется Tron?',
      en: 'What is Tron actually used for?',
    },
    answer: {
      ru: 'Основное применение Tron сегодня — это передача USDT (Tether) через стандарт TRC-20. Комиссии на Tron в 10–100 раз дешевле, чем в сети Ethereum (ERC-20), а скорость выше. Это сделало TRC-20 USDT доминирующим стандартом для P2P-переводов, особенно в Азии, Африке и среди трейдеров на OTC-рынках. Tron также используется для приложений в сфере развлечений и гемблинга (исторически это был ключевой рынок), а BitTorrent Token (BTT) работает в рамках экосистемы Tron для децентрализованного хранения файлов.',
      en: 'Tron\'s main use today is transferring USDT (Tether) via the TRC-20 standard. Fees on Tron are 10–100x cheaper than on Ethereum (ERC-20) with higher speed. This made TRC-20 USDT the dominant standard for P2P transfers, especially in Asia, Africa, and among traders in OTC markets. Tron is also used for entertainment and gambling applications (historically a key market), and BitTorrent Token (BTT) works within the Tron ecosystem for decentralized file storage.',
    },
  },
  {
    question: {
      ru: 'Кто такой Джастин Сан и почему он спорная фигура?',
      en: 'Who is Justin Sun and why is he controversial?',
    },
    answer: {
      ru: 'Джастин Сан — китайский предприниматель, протеже Джека Ма (Alibaba). Он основал Tron в 2017 году в возрасте 26 лет. Сан известен агрессивным маркетингом: покупка обеда с Уорреном Баффетом за $4,6 млн (2019), приобретение BitTorrent, бесчисленные анонсы партнёрств. Критика: плагиат whitepaper (2018), обвинения в манипуляции рынком, уголовное расследование властей США (подозрение в мошенничестве с токенами), ордер на арест в Китае (по неподтверждённым данным). В 2021 году стал послом Гренады при ВТО. Сан — возможно, самый противоречивый основатель в истории крипто.',
      en: 'Justin Sun is a Chinese entrepreneur, protégé of Jack Ma (Alibaba). He founded Tron in 2017 at age 26. Sun is known for aggressive marketing: buying lunch with Warren Buffett for $4.6 million (2019), acquiring BitTorrent, countless partnership announcements. Criticism: whitepaper plagiarism (2018), allegations of market manipulation, US criminal investigation (suspicion of token fraud), arrest warrant in China (unconfirmed). In 2021 he became Grenada\'s Ambassador to the WTO. Sun is arguably the most controversial founder in crypto history.',
    },
  },
  {
    question: {
      ru: 'Что такое TRC-20 и как он отличается от ERC-20?',
      en: 'What is TRC-20 and how does it differ from ERC-20?',
    },
    answer: {
      ru: 'TRC-20 — стандарт токенов в сети Tron (аналог ERC-20 в Ethereum). Оба стандарта позволяют создавать токены на своём блокчейне. Главное отличие практическое: комиссии TRC-20 ниже (обычно $0,001–0,01 против $0,5–10+ для ERC-20 в периоды перегрузки), скорость выше (блоки каждые 3 секунды). USDT-TRC20 и USDT-ERC20 — это одна и та же Tether-монета, просто на разных блокчейнах. Важно: нельзя отправить TRC-20 USDT на ERC-20 адрес и наоборот — это распространённая ошибка, приводящая к потере средств.',
      en: 'TRC-20 is the token standard on the Tron network (analogous to ERC-20 on Ethereum). Both standards allow creating tokens on their blockchain. The main practical difference: TRC-20 fees are lower (usually $0.001–0.01 vs. $0.5–10+ for ERC-20 during congestion), speed is higher (blocks every 3 seconds). USDT-TRC20 and USDT-ERC20 are the same Tether coin, just on different blockchains. Important: you cannot send TRC-20 USDT to an ERC-20 address and vice versa — this is a common mistake leading to loss of funds.',
    },
  },
  {
    question: {
      ru: 'Что такое USDD и был ли он безопасен?',
      en: 'What is USDD and was it safe?',
    },
    answer: {
      ru: 'USDD — алгоритмический стейблкоин на базе Tron, запущенный в мае 2022 года Джастином Саном. По механизму он напоминал UST (Terra): сжигание TRX для создания USDD. Сан запустил его буквально в дни, когда UST рухнул, что многие восприняли с недоумением. USDD устоял (в отличие от UST), частично потому что Tron DAO Reserve активно интервенировал, покупая USDD за реальные резервы. Тем не менее USDD кратковременно депеговался в июне 2022 года. Доверие к алгоритмическим стейблкоинам после краха UST невысоко, и USDD не получил широкого распространения.',
      en: 'USDD is an algorithmic stablecoin on Tron, launched in May 2022 by Justin Sun. Its mechanism resembled UST (Terra): burning TRX to create USDD. Sun launched it literally in the days when UST collapsed, which many found bewildering. USDD held its peg (unlike UST), partly because the Tron DAO Reserve actively intervened, buying USDD with real reserves. Nevertheless, USDD briefly depegged in June 2022. Trust in algorithmic stablecoins after UST\'s collapse is low, and USDD has not gained wide adoption.',
    },
  },
  {
    question: {
      ru: 'Насколько децентрализован Tron?',
      en: 'How decentralized is Tron?',
    },
    answer: {
      ru: 'Tron использует механизм Delegated Proof of Stake (DPoS): 27 супер-представителей (Super Representatives) производят блоки, их выбирают голоса TRX-держателей. Критики указывают: большинство SR аффилированы с Джастином Саном и Tron Foundation; создатель сети де-факто контролирует её развитие. Это типичная ситуация для DPOS-блокчейнов (как EOS, Steem). По децентрализации Tron значительно уступает Bitcoin и Ethereum. Однако это осознанный выбор в пользу высокой производительности и низких комиссий.',
      en: 'Tron uses Delegated Proof of Stake (DPoS): 27 Super Representatives produce blocks, elected by TRX holder votes. Critics point out: most SRs are affiliated with Justin Sun and the Tron Foundation; the network creator de facto controls its development. This is a typical situation for DPOS blockchains (like EOS, Steem). In decentralization, Tron significantly lags behind Bitcoin and Ethereum. However, this is a deliberate choice in favor of high performance and low fees.',
    },
  },
  {
    question: {
      ru: 'Зачем Tron купил BitTorrent?',
      en: 'Why did Tron buy BitTorrent?',
    },
    answer: {
      ru: 'В 2018 году Tron Foundation приобрела BitTorrent — один из старейших и крупнейших децентрализованных протоколов передачи файлов с более 100 млн активных пользователей. Логика: BitTorrent уже доказал работоспособность децентрализованного распределения контента в больших масштабах. Tron планировал монетизировать это через токен BTT (BitTorrent Token): пользователи платят BTT за более быструю загрузку, сидеры получают BTT за раздачу. На практике интеграция прошла не так гладко, как планировалось, но BitTorrent и сегодня остаётся в составе экосистемы Tron.',
      en: 'In 2018, Tron Foundation acquired BitTorrent — one of the oldest and largest decentralized file transfer protocols with over 100 million active users. The logic: BitTorrent already proved the viability of decentralized content distribution at scale. Tron planned to monetize this through the BTT (BitTorrent Token): users pay BTT for faster downloads, seeders earn BTT for sharing. In practice the integration was not as smooth as planned, but BitTorrent remains part of the Tron ecosystem today.',
    },
  },
];
