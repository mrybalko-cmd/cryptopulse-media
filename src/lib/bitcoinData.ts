// Historical BTC prices: average price on July 1 of each year
// Sources: CoinMarketCap, Coindesk historical data
export const BTC_INVESTMENT_REFERENCE = [
  {
    yearsAgo: 15,
    year: 2011,
    price: 15.40,
    label: { ru: '15 лет назад (2011)', en: '15 years ago (2011)' },
    note: { ru: 'После первого пузыря', en: 'After the first bubble' },
  },
  {
    yearsAgo: 10,
    year: 2016,
    price: 671.00,
    label: { ru: '10 лет назад (2016)', en: '10 years ago (2016)' },
    note: { ru: 'После второго халвинга', en: 'After the second halving' },
  },
  {
    yearsAgo: 5,
    year: 2021,
    price: 33630.00,
    label: { ru: '5 лет назад (2021)', en: '5 years ago (2021)' },
    note: { ru: 'Год ATH $69 000', en: 'Year of $69K ATH' },
  },
];

export const INVESTMENT_AMOUNTS = [100, 500, 1000, 2000, 5000];

export interface BtcQuote {
  author: string;
  role: { ru: string; en: string };
  year: number;
  quote: { ru: string; en: string };
  sentiment: 'bullish' | 'bearish' | 'neutral';
}

export const BTC_QUOTES: BtcQuote[] = [
  {
    author: 'Hal Finney',
    role: { ru: 'Первый получатель Bitcoin', en: 'First Bitcoin recipient' },
    year: 2009,
    quote: {
      ru: '«Запускаю биткоин.»',
      en: '"Running bitcoin."',
    },
    sentiment: 'bullish',
  },
  {
    author: 'Michael Saylor',
    role: { ru: 'CEO MicroStrategy', en: 'CEO of MicroStrategy' },
    year: 2021,
    quote: {
      ru: '«Биткоин — это вершина имущества человечества. Это первое по-настоящему дефицитное цифровое имущество, когда-либо созданное.»',
      en: '"Bitcoin is the apex property of the human race. It is the first truly scarce digital property ever created."',
    },
    sentiment: 'bullish',
  },
  {
    author: 'Warren Buffett',
    role: { ru: 'CEO Berkshire Hathaway', en: 'CEO of Berkshire Hathaway' },
    year: 2018,
    quote: {
      ru: '«Я почти наверняка уверен, что криптовалюты закончатся плохо. Если бы мог купить пятилетний put на каждую из них — с удовольствием бы, но никогда не буду шортить.»',
      en: `"I can say with almost certainty that cryptos will come to a bad ending. If I could buy a five-year put on every one of them I would, but I would never short a dime’s worth."`,
    },
    sentiment: 'bearish',
  },
  {
    author: 'Elon Musk',
    role: { ru: 'CEO Tesla и SpaceX', en: 'CEO of Tesla & SpaceX' },
    year: 2021,
    quote: {
      ru: '«Я думаю, биткоин — это хорошее явление, и я его поддерживаю.»',
      en: '"I do at this point think bitcoin is a good thing, and I am a supporter of bitcoin."',
    },
    sentiment: 'bullish',
  },
  {
    author: 'Ray Dalio',
    role: { ru: 'Основатель Bridgewater Associates', en: 'Founder of Bridgewater Associates' },
    year: 2021,
    quote: {
      ru: '«Биткоин — чёртовски изобретение. Просто восхищаюсь тем, как это было сделано.»',
      en: '"Bitcoin is one hell of an invention. I feel that I really need to respect it."',
    },
    sentiment: 'neutral',
  },
  {
    author: 'Jack Dorsey',
    role: { ru: 'Основатель Twitter и Block', en: 'Founder of Twitter & Block' },
    year: 2021,
    quote: {
      ru: '«Биткоин меняет абсолютно всё. Я не думаю, что в моей жизни есть что-то более важное.»',
      en: '"Bitcoin changes absolutely everything. I don\'t think there is anything more important in my lifetime to work on."',
    },
    sentiment: 'bullish',
  },
  {
    author: 'Нayib Bukele',
    role: { ru: 'Президент Сальвадора', en: 'President of El Salvador' },
    year: 2021,
    quote: {
      ru: '«Биткоин — деньги народа.»',
      en: '"Bitcoin is the people\'s money."',
    },
    sentiment: 'bullish',
  },
  {
    author: 'Сатоши Накамото',
    role: { ru: 'Создатель Bitcoin', en: 'Creator of Bitcoin' },
    year: 2009,
    quote: {
      ru: '«Корень проблемы с обычными валютами — это доверие, необходимое для их работы. Центральному банку необходимо доверять, что он не будет обесценивать валюту.»',
      en: '"The root problem with conventional currency is all the trust that\'s required to make it work. The central bank must be trusted not to debase the currency."',
    },
    sentiment: 'bullish',
  },
];

export interface BtcFaqItem {
  question: { ru: string; en: string };
  answer: { ru: string; en: string };
}

export const BTC_FAQ: BtcFaqItem[] = [
  {
    question: {
      ru: 'Кто создал Bitcoin?',
      en: 'Who created Bitcoin?',
    },
    answer: {
      ru: 'Bitcoin был создан анонимным лицом или группой лиц под псевдонимом Сатоши Накамото. В октябре 2008 года Накамото опубликовал белую книгу «Bitcoin: A Peer-to-Peer Electronic Cash System», а в январе 2009 года запустил сеть. Личность Сатоши до сих пор остаётся неизвестной.',
      en: 'Bitcoin was created by an anonymous person or group under the pseudonym Satoshi Nakamoto. In October 2008, Nakamoto published the white paper "Bitcoin: A Peer-to-Peer Electronic Cash System" and launched the network in January 2009. Satoshi\'s real identity remains unknown to this day.',
    },
  },
  {
    question: {
      ru: 'Сколько всего будет биткоинов?',
      en: 'How many Bitcoins will ever exist?',
    },
    answer: {
      ru: 'Максимальное количество биткоинов ограничено 21 миллионом монет. Это фундаментальное правило, заложенное в код протокола Сатоши. К 2024 году добыто уже более 19,7 миллиона BTC. Последний биткоин будет добыт приблизительно в 2140 году.',
      en: 'The maximum supply of Bitcoin is capped at 21 million coins — a fundamental rule embedded in Satoshi\'s protocol code. By 2024, more than 19.7 million BTC had already been mined. The last Bitcoin is expected to be mined around the year 2140.',
    },
  },
  {
    question: {
      ru: 'Что такое халвинг Bitcoin?',
      en: 'What is Bitcoin halving?',
    },
    answer: {
      ru: 'Халвинг — это запрограммированное событие, при котором вознаграждение майнеров за добытый блок уменьшается вдвое. Происходит примерно каждые 4 года (каждые 210 000 блоков). Халвинги прошли в 2012, 2016, 2020 и 2024 годах. После каждого халвинга исторически следовал бычий рынок, так как предложение новых монет сокращается, а спрос растёт.',
      en: 'Halving is a programmed event where the mining reward for each new block is cut in half. It occurs approximately every 4 years (every 210,000 blocks). Halvings took place in 2012, 2016, 2020, and 2024. Historically, each halving has been followed by a bull market as new supply decreases while demand continues to grow.',
    },
  },
  {
    question: {
      ru: 'Что такое «история с пиццей»?',
      en: 'What is the "pizza story"?',
    },
    answer: {
      ru: '22 мая 2010 года программист Ласло Ханьеч совершил первую задокументированную коммерческую транзакцию с использованием Bitcoin: он заплатил 10 000 BTC за две пиццы Papa John\'s. Тогда это было около $41. Сегодня эти 10 000 BTC стоят сотни миллионов долларов. 22 мая отмечается как «Bitcoin Pizza Day».',
      en: 'On May 22, 2010, programmer Laszlo Hanyecz made the first documented commercial Bitcoin transaction: he paid 10,000 BTC for two Papa John\'s pizzas. At the time, this was worth about $41. Today, those 10,000 BTC would be worth hundreds of millions of dollars. May 22 is celebrated as "Bitcoin Pizza Day."',
    },
  },
  {
    question: {
      ru: 'Как безопасно хранить Bitcoin?',
      en: 'How to safely store Bitcoin?',
    },
    answer: {
      ru: 'Существует два основных способа: горячие кошельки (подключены к интернету — удобны для транзакций, но уязвимы) и холодные кошельки (аппаратные устройства вроде Ledger или Trezor — наиболее безопасны для долгосрочного хранения). Главное правило: никогда не храните seed-фразу в цифровом виде и не передавайте её третьим лицам.',
      en: 'There are two main options: hot wallets (connected to the internet — convenient for transactions but more vulnerable) and cold wallets (hardware devices like Ledger or Trezor — the safest for long-term storage). The golden rule: never store your seed phrase digitally and never share it with anyone.',
    },
  },
  {
    question: {
      ru: 'Почему у Bitcoin ограниченный запас в 21 миллион монет?',
      en: 'Why does Bitcoin have a fixed supply of 21 million?',
    },
    answer: {
      ru: 'Сатоши Накамото заложил в код Bitcoin дефляционную модель, вдохновлённую золотом. Ограниченное предложение защищает Bitcoin от инфляции — в отличие от фиатных валют, которые центральные банки могут печатать в неограниченных количествах. Именно поэтому Bitcoin часто называют «цифровым золотом».',
      en: 'Satoshi Nakamoto designed Bitcoin with a deflationary model inspired by gold. The fixed supply protects Bitcoin from inflation — unlike fiat currencies that central banks can print without limit. This is why Bitcoin is often called "digital gold."',
    },
  },
];
