export const BNB_INVESTMENT_REFERENCE = [
  {
    yearsAgo: 7,
    year: 2019,
    price: 25.00,
    label: { ru: '7 лет назад (2019)', en: '7 years ago (2019)' },
    note: { ru: 'BNB до запуска BSC', en: 'BNB before BSC launch' },
  },
  {
    yearsAgo: 5,
    year: 2021,
    price: 310.00,
    label: { ru: '5 лет назад (2021)', en: '5 years ago (2021)' },
    note: { ru: 'Пик BSC DeFi-экосистемы', en: 'BSC DeFi ecosystem peak' },
  },
];

export const INVESTMENT_AMOUNTS = [100, 500, 1000, 2000, 5000];

export interface BnbQuote {
  author: string;
  role: { ru: string; en: string };
  year: number;
  quote: { ru: string; en: string };
  sentiment: 'bullish' | 'bearish' | 'neutral';
}

export const BNB_QUOTES: BnbQuote[] = [
  {
    author: 'Чанпэн Чжао (CZ)',
    role: { ru: 'Основатель и бывший CEO Binance', en: 'Founder and former CEO of Binance' },
    year: 2021,
    quote: {
      ru: '«Наша миссия — сделать крипту доступной для каждого. BNB — топливо для этого двигателя, и мы только разгоняемся.»',
      en: '"Our mission is to make crypto accessible to everyone. BNB is the fuel for this engine, and we are just accelerating."',
    },
    sentiment: 'bullish',
  },
  {
    author: 'Майк Новограц',
    role: { ru: 'CEO Galaxy Digital', en: 'CEO of Galaxy Digital' },
    year: 2021,
    quote: {
      ru: '«Binance Smart Chain привлекла миллионы пользователей, которые не могли позволить себе комиссии Ethereum. Это реальный рост — не спекулятивный.»',
      en: '"Binance Smart Chain attracted millions of users who could not afford Ethereum fees. That is real adoption — not speculative."',
    },
    sentiment: 'bullish',
  },
  {
    author: 'Виталик Бутерин',
    role: { ru: 'Создатель Ethereum', en: 'Creator of Ethereum' },
    year: 2021,
    quote: {
      ru: '«BSC — это просто централизованный Ethereum. Когда что-то идёт не так, всегда есть один человек, которому можно позвонить. Это не блокчейн.»',
      en: '"BSC is just a centralized Ethereum. When something goes wrong, there is always one person you can call. That is not a blockchain."',
    },
    sentiment: 'bearish',
  },
  {
    author: 'Гэри Генслер',
    role: { ru: 'Председатель SEC (2021–2025)', en: 'SEC Chair (2021–2025)' },
    year: 2023,
    quote: {
      ru: '«Binance нарушила нормы о ценных бумагах. BNB является незарегистрированной ценной бумагой.»',
      en: '"Binance violated securities laws. BNB is an unregistered security."',
    },
    sentiment: 'bearish',
  },
  {
    author: 'Кэти Вуд',
    role: { ru: 'CEO ARK Invest', en: 'CEO of ARK Invest' },
    year: 2022,
    quote: {
      ru: '«Крупнейшая биржа с нативным токеном, который сжигается — это уникальная экономическая модель. Но регуляторный риск реален.»',
      en: '"The largest exchange with a native token that gets burned — this is a unique economic model. But regulatory risk is real."',
    },
    sentiment: 'neutral',
  },
  {
    author: 'Чанпэн Чжао (CZ)',
    role: { ru: 'Основатель Binance', en: 'Founder of Binance' },
    year: 2023,
    quote: {
      ru: '«Я ухожу с поста CEO Binance. Это тяжёлое решение, но правильное для компании. Binance продолжит жить.»',
      en: '"I am stepping down as CEO of Binance. This is a difficult decision but the right one for the company. Binance will continue to thrive."',
    },
    sentiment: 'neutral',
  },
  {
    author: 'Питер Шифф',
    role: { ru: 'Экономист и критик крипто', en: 'Economist and crypto critic' },
    year: 2023,
    quote: {
      ru: '«Когда основатель крупнейшей криптобиржи в мире признаёт вину по уголовному делу — это не «недоразумение», это системная проблема индустрии.»',
      en: '"When the founder of the world\'s largest crypto exchange pleads guilty to criminal charges — this is not a misunderstanding, it is a systemic problem of the industry."',
    },
    sentiment: 'bearish',
  },
  {
    author: 'Ричард Тенг',
    role: { ru: 'CEO Binance (с 2023)', en: 'CEO of Binance (since 2023)' },
    year: 2024,
    quote: {
      ru: '«Мы заплатили за прошлые ошибки и движемся вперёд. Binance будет строже, прозрачнее и сильнее.»',
      en: '"We paid for past mistakes and we move forward. Binance will be stricter, more transparent and stronger."',
    },
    sentiment: 'bullish',
  },
];

export interface BnbFaqItem {
  question: { ru: string; en: string };
  answer: { ru: string; en: string };
}

export const BNB_FAQ: BnbFaqItem[] = [
  {
    question: {
      ru: 'Для чего используется BNB?',
      en: 'What is BNB used for?',
    },
    answer: {
      ru: 'BNB — нативный токен экосистемы Binance. Основные применения: оплата торговых комиссий на бирже Binance со скидкой до 25%, оплата газа в сети BNB Chain (бывшая BSC), участие в токен-сейлах на Binance Launchpad и Launchpool, NFT-маркетплейсе Binance NFT, а также в децентрализованных приложениях экосистемы BNB Chain. Чем активнее экосистема Binance, тем выше спрос на BNB.',
      en: 'BNB is the native token of the Binance ecosystem. Key uses: paying trading fees on Binance exchange with up to 25% discount, paying gas fees on BNB Chain (formerly BSC), participating in token sales on Binance Launchpad and Launchpool, the Binance NFT marketplace, and decentralized apps in the BNB Chain ecosystem. The more active the Binance ecosystem, the higher the demand for BNB.',
    },
  },
  {
    question: {
      ru: 'Как работает сжигание BNB?',
      en: 'How does BNB burning work?',
    },
    answer: {
      ru: 'Binance сжигает BNB ежеквартально с момента создания токена в 2017 году. Механизм Auto-Burn (2021) привязывает объём сжигания к цене BNB и числу блоков в сети. Также введён механизм Real-Time Burn: часть газовых сборов в сети BNB Chain сжигается автоматически. Изначальный объём: 200 млн BNB. Цель — сжечь 100 млн (50%). По состоянию на 2024 год уже сожжено более 47 млн BNB, что создаёт дефляционное давление на цену.',
      en: 'Binance has burned BNB quarterly since the token\'s creation in 2017. The Auto-Burn mechanism (2021) ties the burn volume to BNB\'s price and the number of blocks in the network. A Real-Time Burn mechanism was also introduced: a portion of gas fees on BNB Chain is automatically burned. Original supply: 200 million BNB. Target: burn 100 million (50%). As of 2024, over 47 million BNB have already been burned, creating deflationary pressure on the price.',
    },
  },
  {
    question: {
      ru: 'Что такое BNB Chain и чем она отличается от Ethereum?',
      en: 'What is BNB Chain and how does it differ from Ethereum?',
    },
    answer: {
      ru: 'BNB Chain — это блокчейн, запущенный Binance в 2020 году как Binance Smart Chain (BSC). Технически он почти идентичен Ethereum: поддерживает те же смарт-контракты (EVM-совместим), что позволяет разработчикам легко переносить проекты. Ключевые отличия: комиссии в 10–50 раз дешевле, скорость транзакций выше (3-секундные блоки против 12 у Ethereum). Цена — меньшая децентрализация: вместо тысяч независимых узлов-валидаторов Ethereum, BNB Chain работает на 21 выбранном валидаторе, что регулярно критикуют как «DPOS с китайскими характеристиками».',
      en: 'BNB Chain is a blockchain launched by Binance in 2020 as Binance Smart Chain (BSC). Technically it is nearly identical to Ethereum: it supports the same smart contracts (EVM-compatible), allowing developers to easily migrate projects. Key differences: fees are 10–50x cheaper, transaction speed is higher (3-second blocks vs. 12 for Ethereum). The trade-off: less decentralization — instead of thousands of independent Ethereum validators, BNB Chain runs on 21 selected validators, regularly criticized as "DPOS with Chinese characteristics."',
    },
  },
  {
    question: {
      ru: 'Что произошло с Binance и CZ в 2023 году?',
      en: 'What happened to Binance and CZ in 2023?',
    },
    answer: {
      ru: 'В ноябре 2023 года Binance урегулировала претензии с Министерством юстиции США, заплатив $4,3 млрд штрафа — один из крупнейших в истории криптоиндустрии. Чанпэн Чжао (CZ) признал вину в нарушении законов об отмывании денег и согласился уйти с поста CEO. В апреле 2024 года суд приговорил его к 4 месяцам заключения. Новым CEO стал Ричард Тенг. Несмотря на это, Binance сохранила первенство по торговым объёмам, а BNB восстановился до уровней выше 500 долларов к 2024 году.',
      en: 'In November 2023, Binance settled charges with the US Department of Justice, paying $4.3 billion in fines — one of the largest in crypto industry history. Changpeng Zhao (CZ) pleaded guilty to money laundering violations and agreed to step down as CEO. In April 2024 a court sentenced him to 4 months in prison. Richard Teng became the new CEO. Despite this, Binance maintained its lead in trading volume, and BNB recovered to levels above $500 by 2024.',
    },
  },
  {
    question: {
      ru: 'Централизован ли BNB?',
      en: 'Is BNB centralized?',
    },
    answer: {
      ru: 'Критики указывают на несколько признаков централизации BNB: 1) Крупный пакет BNB принадлежит Binance и команде основателей; 2) BNB Chain работает на 21 валидаторе, большинство из которых аффилированы с Binance; 3) Механизм сжигания и изменение параметров сети контролируются Binance. Сторонники возражают: у BNB Chain есть независимые валидаторы и открытый код. Это вопрос определений: BNB менее децентрализован, чем Bitcoin или Ethereum, но это осознанный архитектурный выбор в пользу скорости и дешевизны.',
      en: 'Critics point to several signs of BNB centralization: 1) A large BNB stake belongs to Binance and founding team; 2) BNB Chain runs on 21 validators, most affiliated with Binance; 3) The burn mechanism and network parameter changes are controlled by Binance. Supporters counter: BNB Chain has independent validators and open-source code. This is a matter of definitions: BNB is less decentralized than Bitcoin or Ethereum, but this is a deliberate architectural choice prioritizing speed and low cost.',
    },
  },
  {
    question: {
      ru: 'Каков максимальный запас BNB?',
      en: 'What is the maximum supply of BNB?',
    },
    answer: {
      ru: 'Изначально было создано 200 миллионов BNB. Это не бесконечно инфлируемый токен, как DOGE или ETH (до EIP-1559). Цель Binance — сжечь половину, то есть 100 млн BNB. Таким образом, в конечном счёте в обращении останется около 100 миллионов токенов. Ежеквартальные сжигания продолжаются: объём сожжённых монет публично верифицируется в блокчейне. Этот механизм дефляции отличает BNB от большинства биржевых токенов.',
      en: 'Originally, 200 million BNB were created. This is not an infinitely inflating token like DOGE or ETH (pre-EIP-1559). Binance\'s goal is to burn half — 100 million BNB. Ultimately, approximately 100 million tokens will remain in circulation. Quarterly burns continue: the volume of burned coins is publicly verifiable on the blockchain. This deflation mechanism distinguishes BNB from most exchange tokens.',
    },
  },
];
