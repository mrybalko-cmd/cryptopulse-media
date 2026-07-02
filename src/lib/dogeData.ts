export const DOGE_INVESTMENT_REFERENCE = [
  {
    yearsAgo: 10,
    year: 2016,
    price: 0.00012,
    label: { ru: '10 лет назад (2016)', en: '10 years ago (2016)' },
    note: { ru: 'DOGE до эпохи Илона Маска', en: 'DOGE before the Elon Musk era' },
  },
  {
    yearsAgo: 5,
    year: 2021,
    price: 0.22,
    label: { ru: '5 лет назад (2021)', en: '5 years ago (2021)' },
    note: { ru: 'Начало DOGE-мании (июль 2021)', en: 'Start of DOGE mania (July 2021)' },
  },
];

export const INVESTMENT_AMOUNTS = [100, 500, 1000, 2000, 5000];

export interface DogeQuote {
  author: string;
  role: { ru: string; en: string };
  year: number;
  quote: { ru: string; en: string };
  sentiment: 'bullish' | 'bearish' | 'neutral';
}

export const DOGE_QUOTES: DogeQuote[] = [
  {
    author: 'Илон Маск',
    role: { ru: 'CEO Tesla и SpaceX', en: 'CEO of Tesla and SpaceX' },
    year: 2021,
    quote: {
      ru: '«Dogecoin — народная криптовалюта.»',
      en: '"Dogecoin is the people\'s crypto."',
    },
    sentiment: 'bullish',
  },
  {
    author: 'Илон Маск',
    role: { ru: 'CEO Tesla и SpaceX', en: 'CEO of Tesla and SpaceX' },
    year: 2021,
    quote: {
      ru: '«Собаки живут в собачьих домиках и отправляются на Луну! Doge howling at the moon.»',
      en: '"Dogs live in doghouses and go to the moon! Doge howling at the moon."',
    },
    sentiment: 'bullish',
  },
  {
    author: 'Биллие Маркус',
    role: { ru: 'Сооснователь Dogecoin', en: 'Co-founder of Dogecoin' },
    year: 2021,
    quote: {
      ru: '«Я продал все свои DOGE в 2015 году, чтобы купить подержанный Honda Civic. Я не предвидел, что мем станет инвестиционным активом.»',
      en: '"I sold all my DOGE in 2015 to buy a used Honda Civic. I did not foresee a meme becoming an investment asset."',
    },
    sentiment: 'neutral',
  },
  {
    author: 'Марк Кубан',
    role: { ru: 'Миллиардер, владелец Dallas Mavericks', en: 'Billionaire, owner of Dallas Mavericks' },
    year: 2021,
    quote: {
      ru: '«Dallas Mavericks принимают DOGE. Это лучшая криптовалюта для платежей — быстрая, дешёвая и весёлая. Именно такими и должны быть деньги.»',
      en: '"Dallas Mavericks accept DOGE. It is the best crypto for payments — fast, cheap, and fun. That is what money should be."',
    },
    sentiment: 'bullish',
  },
  {
    author: 'Питер Шифф',
    role: { ru: 'Экономист и критик крипто', en: 'Economist and crypto critic' },
    year: 2021,
    quote: {
      ru: '«Dogecoin — это джок, который стал дорогостоящей шуткой для тех, кто купил на пике. Монета без ограниченного предложения, без разработчиков, без реального применения.»',
      en: '"Dogecoin is a joke that became an expensive joke for those who bought at the top. A coin without limited supply, without developers, without real use."',
    },
    sentiment: 'bearish',
  },
  {
    author: 'Джексон Палмер',
    role: { ru: 'Сооснователь Dogecoin', en: 'Co-founder of Dogecoin' },
    year: 2021,
    quote: {
      ru: '«Криптовалюта — это инструмент ультрабогатых для манипуляций рынком. Я сожалею, что вообще создал этот проект.»',
      en: '"Cryptocurrency is a tool of the ultra-wealthy for market manipulation. I regret ever creating this project."',
    },
    sentiment: 'bearish',
  },
  {
    author: 'Снуп Догг',
    role: { ru: 'Музыкант и поп-культурная фигура', en: 'Musician and pop culture figure' },
    year: 2021,
    quote: {
      ru: '«Это Снуп DOGE.»',
      en: '"It\'s Snoop DOGE."',
    },
    sentiment: 'bullish',
  },
  {
    author: 'Виталик Бутерин',
    role: { ru: 'Создатель Ethereum', en: 'Creator of Ethereum' },
    year: 2022,
    quote: {
      ru: '«Dogecoin — единственная монета с приятным сообществом. Если Dogecoin переедет на Proof of Stake, я буду рад помочь.»',
      en: '"Dogecoin is the only coin with a nice community. If Dogecoin moves to Proof of Stake, I would be happy to help."',
    },
    sentiment: 'bullish',
  },
];

export interface DogeFaqItem {
  question: { ru: string; en: string };
  answer: { ru: string; en: string };
}

export const DOGE_FAQ: DogeFaqItem[] = [
  {
    question: {
      ru: 'Кто создал Dogecoin и почему?',
      en: 'Who created Dogecoin and why?',
    },
    answer: {
      ru: 'Dogecoin создали программисты Билли Маркус (IBM) и Джексон Палмер (Adobe) в декабре 2013 года. Буквально за два дня. Идея была простая — пошутить над хайпом вокруг криптовалют, использовав популярный интернет-мем с собакой породы сиба-ину. Маркус взял за основу код Litecoin, а Палмер предложил использовать мем Doge. Ни тот ни другой не ожидали, что монета переживёт 2014 год.',
      en: 'Dogecoin was created by programmers Billy Markus (IBM) and Jackson Palmer (Adobe) in December 2013. Literally in two days. The idea was simple — to mock the hype around cryptocurrencies using the popular Shiba Inu dog internet meme. Markus took Litecoin\'s code as the base while Palmer suggested using the Doge meme. Neither expected the coin to survive past 2014.',
    },
  },
  {
    question: {
      ru: 'Почему у Dogecoin нет лимита предложения?',
      en: 'Why does Dogecoin have no supply limit?',
    },
    answer: {
      ru: 'Изначально Dogecoin имел лимит в 100 млрд монет — но в 2014 году разработчики убрали его, сделав токен инфляционным. Мотивация: это стимулировало людей тратить, а не копить DOGE, поддерживая ликвидность. Каждый год в оборот добавляется примерно 5 млрд новых DOGE (около 3,6% от текущего предложения). Инфляция фиксированная в абсолютных цифрах, то есть в процентах со временем падает. Критики считают неограниченное предложение недостатком, сторонники — функцией.',
      en: 'Originally Dogecoin had a 100 billion coin limit — but in 2014 developers removed it, making the token inflationary. The rationale: this encouraged people to spend rather than hoard DOGE, maintaining liquidity. Approximately 5 billion new DOGE enter circulation annually (about 3.6% of current supply). Inflation is fixed in absolute terms, meaning in percentage terms it decreases over time. Critics see unlimited supply as a flaw; supporters see it as a feature.',
    },
  },
  {
    question: {
      ru: 'Почему Илон Маск так поддерживает Dogecoin?',
      en: 'Why does Elon Musk support Dogecoin so much?',
    },
    answer: {
      ru: 'Маск начал твитить о DOGE ещё в 2019 году, называя его «своей любимой криптовалютой». Поводы для поддержки разные: искренняя симпатия к «народной монете» без серьёзного фасада, желание популяризировать крипто среди массовой аудитории, а также, по собственным словам Маска, желание «разнообразить» рынок криптовалют. После покупки Twitter в 2022 году появилась активно обсуждаемая идея интеграции DOGE в платёжную систему X. В 2025 году Маск возглавил государственное ведомство, шутливо названное «DOGE» (Department of Government Efficiency).',
      en: 'Musk began tweeting about DOGE in 2019, calling it his "favorite cryptocurrency." His motivations vary: genuine affinity for the "people\'s coin" without serious pretense, desire to popularize crypto for mass audiences, and in his own words a wish to "diversify" the crypto market. After buying Twitter in 2022, the actively discussed idea of DOGE integration into the X payment system emerged. In 2025, Musk headed a government agency jokingly named "DOGE" (Department of Government Efficiency).',
    },
  },
  {
    question: {
      ru: 'Является ли Dogecoin реально используемой валютой?',
      en: 'Is Dogecoin actually used as a currency?',
    },
    answer: {
      ru: 'В отличие от многих криптовалют, DOGE изначально создавалась для микроплатежей и чаевых в интернете. Сообщество DOGE финансировало спонсорство NASCAR-гонщика в 2014 году и помогло отправить Jamaican Bobsled Team на Олимпиаду. Dallas Mavericks Марка Кубана до сих пор принимают DOGE. Tesla принимает DOGE за мерч. Транзакции DOGE быстрые (~1 мин) и почти бесплатные, что делает её технически пригодной для платежей. Главная проблема — волатильность цены делает практическое использование как валюты затруднённым.',
      en: 'Unlike many cryptocurrencies, DOGE was created from the start for micro-payments and internet tipping. The DOGE community funded NASCAR driver sponsorship in 2014 and helped send the Jamaican Bobsled Team to the Olympics. Mark Cuban\'s Dallas Mavericks still accept DOGE. Tesla accepts DOGE for merchandise. DOGE transactions are fast (~1 min) and nearly free, making it technically suitable for payments. The main problem: price volatility makes practical use as a currency difficult.',
    },
  },
  {
    question: {
      ru: 'В чём отличие Dogecoin от Shiba Inu?',
      en: 'What is the difference between Dogecoin and Shiba Inu?',
    },
    answer: {
      ru: 'Оба токена используют мем с сиба-ину, но технически совершенно разные. Dogecoin — самостоятельный блокчейн (форк Litecoin), запущенный в 2013 году, с десятилетней историей и принятием у реальных продавцов. Shiba Inu — ERC-20 токен на Ethereum, запущенный в 2020 году как «убийца Dogecoin». SHIB имеет собственную DeFi-экосистему (ShibaSwap), L2 (Shibarium) и токен сжигания. У DOGE годами нет заметного развития протокола, зато есть легитимность, имя и поддержка Маска. Это соперники по нарративу, но не технологические конкуренты.',
      en: 'Both tokens use the Shiba Inu meme but are technically completely different. Dogecoin is a standalone blockchain (Litecoin fork) launched in 2013 with a decade of history and acceptance by real merchants. Shiba Inu is an ERC-20 token on Ethereum launched in 2020 as the "Dogecoin killer." SHIB has its own DeFi ecosystem (ShibaSwap), L2 (Shibarium), and a burning token. DOGE has had no notable protocol development for years but has legitimacy, a name, and Musk\'s support. They are narrative rivals but not technical competitors.',
    },
  },
  {
    question: {
      ru: 'Имеет ли смысл инвестировать в DOGE?',
      en: 'Does investing in DOGE make sense?',
    },
    answer: {
      ru: 'Dogecoin — высокоспекулятивный актив с экстремальной чувствительностью к высказываниям Илона Маска и настроению рынка. Исторически DOGE демонстрировал кратные иксы во время «мем-манй» (2021), но и жесточайшие просадки в 90%+ после пика. У монеты нет жёсткого лимита предложения (инфляционная эмиссия) и, по мнению критиков, нет фундаментального применения, отличного от спекуляции и чаевых. Технический прогресс проекта минимален. При всём этом — DOGE остаётся в топ-10 по капитализации уже более 10 лет, что само по себе феноменально. Не является финансовой рекомендацией.',
      en: 'Dogecoin is a highly speculative asset with extreme sensitivity to Elon Musk\'s statements and market sentiment. Historically DOGE delivered massive multipliers during "meme mania" (2021) but also brutal 90%+ drawdowns after peaks. The coin has no hard supply limit (inflationary issuance) and, according to critics, no fundamental use case beyond speculation and tipping. Technical progress is minimal. Despite all this — DOGE has remained in the top 10 by market cap for over 10 years, which is itself phenomenal. Not financial advice.',
    },
  },
];
