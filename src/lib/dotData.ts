export const DOT_INVESTMENT_REFERENCE = [
  {
    yearsAgo: 5,
    year: 2021,
    price: 15.00,
    label: { ru: '5 лет назад (2021)', en: '5 years ago (2021)' },
    note: { ru: 'До первых аукционов парачейнов', en: 'Before first parachain auctions' },
  },
];

export const INVESTMENT_AMOUNTS = [100, 500, 1000, 2000, 5000];

export interface DotQuote {
  author: string;
  role: { ru: string; en: string };
  year: number;
  quote: { ru: string; en: string };
  sentiment: 'bullish' | 'bearish' | 'neutral';
}

export const DOT_QUOTES: DotQuote[] = [
  {
    author: 'Гэвин Вуд',
    role: { ru: 'Основатель Polkadot, сооснователь Ethereum', en: 'Founder of Polkadot, Ethereum co-founder' },
    year: 2020,
    quote: {
      ru: '«Polkadot — это не просто блокчейн. Это сеть блокчейнов. Интернет блокчейнов.»',
      en: '"Polkadot is not just a blockchain. It is a network of blockchains. The internet of blockchains."',
    },
    sentiment: 'bullish',
  },
  {
    author: 'Гэвин Вуд',
    role: { ru: 'Основатель Polkadot', en: 'Founder of Polkadot' },
    year: 2022,
    quote: {
      ru: '«Я изобрёл Solidity и смарт-контракты Ethereum. Теперь я хочу выйти за рамки: Polkadot — это следующий уровень архитектуры блокчейнов.»',
      en: '"I invented Solidity and Ethereum smart contracts. Now I want to go beyond: Polkadot is the next level of blockchain architecture."',
    },
    sentiment: 'bullish',
  },
  {
    author: 'Роберт Хабермайер',
    role: { ru: 'Сооснователь Polkadot', en: 'Co-founder of Polkadot' },
    year: 2021,
    quote: {
      ru: '«Модель парачейнов позволяет специализированным блокчейнам работать параллельно, разделяя безопасность Relay Chain. Это масштабируемость без жертв в безопасности.»',
      en: '"The parachain model allows specialized blockchains to run in parallel sharing Relay Chain security. This is scalability without security sacrifices."',
    },
    sentiment: 'bullish',
  },
  {
    author: 'Виталик Бутерин',
    role: { ru: 'Создатель Ethereum', en: 'Creator of Ethereum' },
    year: 2021,
    quote: {
      ru: '«Polkadot избрал другой архитектурный путь, чем Ethereum. Ни один из них не является абсолютно «правильным» — это инженерные компромиссы.»',
      en: '"Polkadot chose a different architectural path than Ethereum. Neither is absolutely "right" — these are engineering trade-offs."',
    },
    sentiment: 'neutral',
  },
  {
    author: 'Кэти Вуд',
    role: { ru: 'CEO ARK Invest', en: 'CEO of ARK Invest' },
    year: 2021,
    quote: {
      ru: '«Polkadot создаёт условия для блокчейн-интероперабельности, которая необходима Web3. Это критическая инфраструктура следующего десятилетия.»',
      en: '"Polkadot is creating conditions for blockchain interoperability that Web3 needs. This is critical infrastructure for the next decade."',
    },
    sentiment: 'bullish',
  },
  {
    author: 'Питер Шифф',
    role: { ru: 'Экономист и критик крипто', en: 'Economist and crypto critic' },
    year: 2022,
    quote: {
      ru: '«Ещё один "убийца Ethereum", который пообещал революцию и пришёл к посредственным результатам. Рыночная капитализация не отражает реального применения.»',
      en: '"Another Ethereum killer that promised revolution and delivered mediocre results. Market cap does not reflect real usage."',
    },
    sentiment: 'bearish',
  },
  {
    author: 'Гэвин Вуд',
    role: { ru: 'Основатель Polkadot', en: 'Founder of Polkadot' },
    year: 2024,
    quote: {
      ru: '«JAM (Join-Accumulate Machine) — следующая эволюция Polkadot. Мы заменяем аукционную модель парачейнов на более гибкую и доступную архитектуру.»',
      en: '"JAM (Join-Accumulate Machine) is the next evolution of Polkadot. We are replacing the parachain auction model with a more flexible and accessible architecture."',
    },
    sentiment: 'bullish',
  },
  {
    author: 'Бретт Скотт',
    role: { ru: 'Независимый аналитик блокчейна', en: 'Independent blockchain analyst' },
    year: 2023,
    quote: {
      ru: '«Polkadot 2.0 с корвременной моделью — это прагматичный шаг. Аукционы парачейнов отпугивали стартапы. Новая модель более инклюзивна.»',
      en: '"Polkadot 2.0 with the coretime model is a pragmatic move. Parachain auctions scared off startups. The new model is more inclusive."',
    },
    sentiment: 'bullish',
  },
];

export interface DotFaqItem {
  question: { ru: string; en: string };
  answer: { ru: string; en: string };
}

export const DOT_FAQ: DotFaqItem[] = [
  {
    question: {
      ru: 'Кто создал Polkadot?',
      en: 'Who created Polkadot?',
    },
    answer: {
      ru: 'Polkadot создал Гэвин Вуд — один из наиболее влиятельных технологов в истории криптоиндустрии. Вуд был сооснователем Ethereum и написал его техническую спецификацию (Yellow Paper), изобрёл язык программирования Solidity для смарт-контрактов и создал клиент Ethereum Parity. В 2016 году он опубликовал whitepaper Polkadot. В 2017 году Web3 Foundation собрала $145 млн в ходе ICO. Genesis-блок Polkadot был запущен в 2020 году. Вуд также создал Kusama — «канарейку» Polkadot для экспериментов.',
      en: 'Polkadot was created by Gavin Wood — one of the most influential technologists in crypto history. Wood was Ethereum\'s co-founder and wrote its technical specification (Yellow Paper), invented the Solidity programming language for smart contracts, and built the Parity Ethereum client. In 2016 he published the Polkadot whitepaper. In 2017 Web3 Foundation raised $145 million in an ICO. Polkadot\'s genesis block launched in 2020. Wood also created Kusama — Polkadot\'s "canary" network for experiments.',
    },
  },
  {
    question: {
      ru: 'Что такое Relay Chain и парачейны?',
      en: 'What is the Relay Chain and what are parachains?',
    },
    answer: {
      ru: 'Архитектура Polkadot строится на двух уровнях. Relay Chain — это главная цепочка безопасности. Она не выполняет смарт-контракты сама, но обеспечивает консенсус и финальность для всей сети. Парачейны — это специализированные блокчейны, подключённые к Relay Chain. Каждый парачейн работает параллельно с другими, имеет своё управление, токены и правила, но получает безопасность от общей Relay Chain. Это позволяет сотням специализированных блокчейнов работать одновременно, обмениваясь данными через стандарт XCM.',
      en: 'Polkadot\'s architecture is built on two levels. Relay Chain is the main security chain. It does not execute smart contracts itself but provides consensus and finality for the entire network. Parachains are specialized blockchains connected to the Relay Chain. Each parachain runs in parallel with others, has its own governance, tokens and rules, but receives security from the shared Relay Chain. This allows hundreds of specialized blockchains to operate simultaneously, exchanging data through the XCM standard.',
    },
  },
  {
    question: {
      ru: 'Что такое аукционы парачейнов и как они работали?',
      en: 'What are parachain auctions and how did they work?',
    },
    answer: {
      ru: 'Слоты парачейнов в Polkadot ограничены (изначально ~100). Проекты конкурировали за них через аукционы с блокировкой DOT: чем больше DOT заблокировано сообществом в пользу проекта, тем больше шансов выиграть слот (аренда на 2 года). Это создавало мощные стимулы: проекты предлагали свои токены тем, кто заблокирует DOT. В 2021 году первые аукционы выиграли Acala, Moonbeam, Astar. Минус модели: слишком высокий барьер для небольших проектов. Polkadot 2.0 переходит к модели «coretime» — аренда вычислительного времени без жёстких аукционов.',
      en: 'Parachain slots in Polkadot are limited (~100 initially). Projects competed for them through DOT-locking auctions: the more DOT locked by the community in a project\'s favor, the greater the chance of winning a slot (2-year lease). This created powerful incentives: projects offered their tokens to those who locked DOT. In 2021 the first auctions were won by Acala, Moonbeam, Astar. The model\'s downside: too high a barrier for small projects. Polkadot 2.0 transitions to a "coretime" model — renting compute time without rigid auctions.',
    },
  },
  {
    question: {
      ru: 'Что такое Kusama и зачем он нужен?',
      en: 'What is Kusama and what is it for?',
    },
    answer: {
      ru: 'Kusama (KSM) — это «канарейная сеть» Polkadot. Технически идентична Polkadot, но работает с реальными активами и без строгих требований к безопасности. Проекты сначала тестируют и запускаются на Kusama, а потом переходят на Polkadot. Это позволяет выявлять ошибки до производственного развертывания. Kusama имеет отдельный токен KSM и своё сообщество. Управление на Kusama более хаотичное (быстрые голосования, меньше требований к стейку), что делает сеть экспериментальной площадкой. «Chaos protocol» — неофициальный слоган Kusama.',
      en: 'Kusama (KSM) is Polkadot\'s "canary network." Technically identical to Polkadot but operates with real assets and without strict security requirements. Projects first test and launch on Kusama, then migrate to Polkadot. This allows discovering bugs before production deployment. Kusama has a separate KSM token and its own community. Governance on Kusama is more chaotic (fast votes, lower staking requirements), making the network an experimental playground. "Chaos protocol" is Kusama\'s unofficial slogan.',
    },
  },
  {
    question: {
      ru: 'Каков максимальный запас DOT?',
      en: 'What is the maximum supply of DOT?',
    },
    answer: {
      ru: 'DOT — инфляционный токен без жёсткого лимита. Сеть генерирует новые DOT для вознаграждения валидаторов и номинаторов (10% годовых от общего предложения, хотя реальный процент для стейкеров выше при неполной иммобилизации). В 2020 году Polkadot провёл ребаланс: разделил токены в соотношении 100:1 (было 10 млн, стало 1 млрд DOT). Важно: при сравнении исторических цен это нужно учитывать. Высокая инфляция компенсируется тем, что стейкеры получают вознаграждения, а не-стейкеры разводняются.',
      en: 'DOT is an inflationary token with no hard cap. The network generates new DOT to reward validators and nominators (10% annually of total supply, though the actual percentage for stakers is higher when staking is not full). In 2020 Polkadot conducted a redenomination: split tokens 100:1 (from 10M to 1B DOT). Important: when comparing historical prices this must be accounted for. High inflation is compensated by stakers receiving rewards while non-stakers get diluted.',
    },
  },
  {
    question: {
      ru: 'Что такое Polkadot 2.0 и JAM?',
      en: 'What is Polkadot 2.0 and JAM?',
    },
    answer: {
      ru: 'Polkadot 2.0 — эволюция протокола, объявленная в 2023 году. Ключевые изменения: замена аукционной модели слотов парачейнов на модель «coretime» (аренда вычислительного времени блоками, доступная любому проекту без многолетних аукционов). JAM (Join-Accumulate Machine) — предложение Гэвина Вуда 2024 года о следующей генерации Polkadot. JAM упрощает архитектуру Relay Chain и делает её более универсальной: не просто хаб для парачейнов, но универсальная вычислительная среда, способная запускать любой код, включая ZK-проверки и смарт-контракты нового поколения.',
      en: 'Polkadot 2.0 is a protocol evolution announced in 2023. Key changes: replacing the parachain slot auction model with a "coretime" model (renting compute time in blocks, accessible to any project without multi-year auctions). JAM (Join-Accumulate Machine) is Gavin Wood\'s 2024 proposal for the next generation of Polkadot. JAM simplifies Relay Chain architecture and makes it more universal: not just a hub for parachains, but a universal compute environment capable of running any code, including ZK proofs and next-generation smart contracts.',
    },
  },
];
