// Historical ETH prices: average price on July 1 of each year
// Sources: CoinMarketCap, CoinGecko historical data
export const ETH_INVESTMENT_REFERENCE = [
  {
    yearsAgo: 10,
    year: 2016,
    price: 12.00,
    label: { ru: '10 лет назад (2016)', en: '10 years ago (2016)' },
    note: { ru: 'Первый полный год торгов', en: 'First full year of trading' },
  },
  {
    yearsAgo: 5,
    year: 2021,
    price: 2230.00,
    label: { ru: '5 лет назад (2021)', en: '5 years ago (2021)' },
    note: { ru: 'Год NFT и DeFi-бума', en: 'Year of NFT and DeFi boom' },
  },
];

export const INVESTMENT_AMOUNTS = [100, 500, 1000, 2000, 5000];

export interface EthQuote {
  author: string;
  role: { ru: string; en: string };
  year: number;
  quote: { ru: string; en: string };
  sentiment: 'bullish' | 'bearish' | 'neutral';
}

export const ETH_QUOTES: EthQuote[] = [
  {
    author: 'Виталик Бутерин',
    role: { ru: 'Создатель Ethereum', en: 'Creator of Ethereum' },
    year: 2014,
    quote: {
      ru: '«Bitcoin — это калькулятор, Ethereum — смартфон. Bitcoin делает одно действие очень хорошо, Ethereum позволяет делать что угодно.»',
      en: '"Bitcoin is a calculator, Ethereum is a smartphone. Bitcoin does one thing very well; Ethereum lets you do anything."',
    },
    sentiment: 'bullish',
  },
  {
    author: 'Марк Кубан',
    role: { ru: 'Миллиардер, владелец Dallas Mavericks', en: 'Billionaire, owner of Dallas Mavericks' },
    year: 2021,
    quote: {
      ru: '«Ethereum — это цифровая нефть. Он питает весь мир DeFi, NFT и смарт-контрактов.»',
      en: '"Ethereum is digital oil. It powers the entire world of DeFi, NFTs and smart contracts."',
    },
    sentiment: 'bullish',
  },
  {
    author: 'Кэти Вуд',
    role: { ru: 'CEO ARK Invest', en: 'CEO of ARK Invest' },
    year: 2021,
    quote: {
      ru: '«Мы считаем, что Ethereum — это децентрализованная финансовая операционная система мира.»',
      en: '"We believe Ethereum is the decentralized financial operating system of the world."',
    },
    sentiment: 'bullish',
  },
  {
    author: 'Питер Шифф',
    role: { ru: 'Экономист и критик крипто', en: 'Economist and crypto critic' },
    year: 2021,
    quote: {
      ru: '«Ethereum — это просто ещё одна спекулятивная монета. У него нет фундаментальной ценности как у золота.»',
      en: '"Ethereum is just another speculative coin. It has no fundamental value like gold."',
    },
    sentiment: 'bearish',
  },
  {
    author: 'Джозеф Любин',
    role: { ru: 'Сооснователь Ethereum, CEO ConsenSys', en: 'Co-founder of Ethereum, CEO of ConsenSys' },
    year: 2022,
    quote: {
      ru: '«Ethereum — это платформа, которая позволит людям строить новую экономику напрямую, без посредников.»',
      en: '"Ethereum is a platform that will enable people to build a new economy directly, without intermediaries."',
    },
    sentiment: 'bullish',
  },
  {
    author: 'Найав Равикант',
    role: { ru: 'Сооснователь AngelList', en: 'Co-founder of AngelList' },
    year: 2021,
    quote: {
      ru: '«Ethereum — это мировой компьютер. Он работает без перерывов, без цензуры и без кражи.»',
      en: '"Ethereum is the world computer. It runs without downtime, without censorship, without fraud."',
    },
    sentiment: 'bullish',
  },
  {
    author: 'Джейми Даймон',
    role: { ru: 'CEO JPMorgan Chase', en: 'CEO of JPMorgan Chase' },
    year: 2021,
    quote: {
      ru: '«Я не большой поклонник крипто, но блокчейн — реальная вещь. Ethereum-технологии интересны с точки зрения смарт-контрактов.»',
      en: '"I\'m not a big crypto fan, but blockchain is real. Ethereum technology is interesting from a smart contract perspective."',
    },
    sentiment: 'neutral',
  },
  {
    author: 'Андреас Антонопулос',
    role: { ru: 'Автор «Mastering Ethereum»', en: 'Author of "Mastering Ethereum"' },
    year: 2019,
    quote: {
      ru: '«Ethereum даёт разработчикам суперсилу: возможность писать программы, которые невозможно остановить.»',
      en: '"Ethereum gives developers a superpower: the ability to write programs that cannot be stopped."',
    },
    sentiment: 'bullish',
  },
];

export interface EthFaqItem {
  question: { ru: string; en: string };
  answer: { ru: string; en: string };
}

export const ETH_FAQ: EthFaqItem[] = [
  {
    question: {
      ru: 'Кто создал Ethereum?',
      en: 'Who created Ethereum?',
    },
    answer: {
      ru: 'Ethereum был предложен в 2013 году 19-летним программистом Виталиком Бутериным. Идея пришла к нему после того, как он понял, что Bitcoin слишком ограничен для сложных приложений. В 2014 году команда Ethereum провела краудсейл ETH, собрав $18 млн. Сеть была официально запущена 30 июля 2015 года. Кроме Бутерина, в основании участвовали Гэвин Вуд, Джозеф Любин, Чарльз Хоскинсон и другие.',
      en: 'Ethereum was proposed in 2013 by 19-year-old programmer Vitalik Buterin. The idea came to him after realizing Bitcoin was too limited for complex applications. In 2014, the Ethereum team conducted a crowdsale of ETH, raising $18 million. The network officially launched on July 30, 2015. Besides Buterin, co-founders included Gavin Wood, Joseph Lubin, Charles Hoskinson, and others.',
    },
  },
  {
    question: {
      ru: 'Что такое смарт-контракт?',
      en: 'What is a smart contract?',
    },
    answer: {
      ru: 'Смарт-контракт — это программный код, который автоматически выполняется при выполнении заданных условий, без посредников. Представьте торговый автомат: вы бросаете монету, выбираете товар — автомат выдаёт его автоматически. Смарт-контракт работает так же, но для любых финансовых или договорных сделок. Он хранится в блокчейне Ethereum, поэтому его нельзя изменить или остановить после запуска.',
      en: 'A smart contract is program code that automatically executes when predefined conditions are met, without intermediaries. Think of a vending machine: you insert a coin, select a product, and it dispenses automatically. A smart contract works the same way but for any financial or contractual transaction. It lives on the Ethereum blockchain, so it cannot be changed or stopped after deployment.',
    },
  },
  {
    question: {
      ru: 'В чём разница между Ethereum и Bitcoin?',
      en: 'What is the difference between Ethereum and Bitcoin?',
    },
    answer: {
      ru: 'Bitcoin — это цифровые деньги и средство сбережения. Его цель — надёжное хранение и передача ценности. Ethereum — это платформа для приложений. На его базе строятся DeFi-протоколы, NFT-маркетплейсы, DAO и тысячи других проектов. Если Bitcoin — это цифровое золото, то Ethereum — это цифровая нефть: ресурс, который питает целую экосистему. Ещё одно различие: предложение ETH не ограничено 21 млн (как у BTC), а Bitcoin не поддерживает смарт-контракты нативно.',
      en: 'Bitcoin is digital money and a store of value — its purpose is the reliable storage and transfer of value. Ethereum is an application platform. DeFi protocols, NFT marketplaces, DAOs, and thousands of other projects are built on it. If Bitcoin is digital gold, Ethereum is digital oil: a resource that powers an entire ecosystem. Another difference: ETH\'s supply is not capped at 21 million (like BTC), and Bitcoin does not natively support smart contracts.',
    },
  },
  {
    question: {
      ru: 'Что такое «The Merge»?',
      en: 'What is "The Merge"?',
    },
    answer: {
      ru: '«The Merge» (Слияние) — историческое событие 15 сентября 2022 года, когда Ethereum перешёл с механизма консенсуса Proof of Work (майнинг) на Proof of Stake (стейкинг). Это снизило энергопотребление сети на ~99,95%. Вместо майнеров теперь транзакции подтверждают валидаторы, которые «ставят» (stake) не менее 32 ETH в качестве залога. The Merge сделал Ethereum значительно более экологичным и снизил выпуск новых ETH на ~90%.',
      en: '"The Merge" — the historic event on September 15, 2022, when Ethereum transitioned from Proof of Work (mining) to Proof of Stake (staking). This reduced the network\'s energy consumption by ~99.95%. Instead of miners, transactions are now validated by validators who "stake" at least 32 ETH as collateral. The Merge made Ethereum far more eco-friendly and reduced new ETH issuance by ~90%.',
    },
  },
  {
    question: {
      ru: 'Что такое газ (gas) в Ethereum?',
      en: 'What is gas in Ethereum?',
    },
    answer: {
      ru: 'Газ (gas) — это единица измерения вычислительной работы в сети Ethereum. Каждая транзакция или операция смарт-контракта требует определённого количества газа. Вы платите за газ в ETH. Цена газа (gas price) измеряется в gwei (1 gwei = 0,000000001 ETH) и меняется в зависимости от загруженности сети. В часы пик газ может стоить дорого; ночью или в выходные — дёшево. Это как дорожные сборы: чем больше машин на дороге, тем выше цена.',
      en: 'Gas is a unit of measurement for computational work in the Ethereum network. Every transaction or smart contract operation requires a certain amount of gas. You pay for gas in ETH. The gas price is measured in gwei (1 gwei = 0.000000001 ETH) and fluctuates based on network demand. During peak hours, gas can be expensive; at night or on weekends it\'s cheaper. Think of it like road tolls: the more traffic, the higher the price.',
    },
  },
  {
    question: {
      ru: 'Что такое ERC-20 и зачем это нужно?',
      en: 'What is ERC-20 and why does it matter?',
    },
    answer: {
      ru: 'ERC-20 — это стандарт для создания токенов на блокчейне Ethereum. Он определяет набор правил, которым должен следовать токен, чтобы работать с кошельками, биржами и другими приложениями. Благодаря ERC-20 тысячи проектов могут выпускать свои токены (USDT, LINK, UNI и др.) и они автоматически совместимы со всей экосистемой Ethereum. Это как стандарт USB: разные устройства подключаются к одному порту.',
      en: 'ERC-20 is the standard for creating tokens on the Ethereum blockchain. It defines a set of rules that a token must follow to work with wallets, exchanges, and other applications. Thanks to ERC-20, thousands of projects can issue their own tokens (USDT, LINK, UNI, etc.) and they automatically work across the entire Ethereum ecosystem. It\'s like the USB standard: different devices connect to the same port.',
    },
  },
];
