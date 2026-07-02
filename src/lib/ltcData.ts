export const LTC_INVESTMENT_REFERENCE = [
  {
    yearsAgo: 10,
    year: 2016,
    price: 4.00,
    label: { ru: '10 лет назад (2016)', en: '10 years ago (2016)' },
    note: { ru: 'Litecoin до первого халвинга', en: 'Litecoin before first major halving' },
  },
  {
    yearsAgo: 5,
    year: 2021,
    price: 130.00,
    label: { ru: '5 лет назад (2021)', en: '5 years ago (2021)' },
    note: { ru: 'Пик бычьего рынка 2021', en: '2021 bull market peak' },
  },
];

export const INVESTMENT_AMOUNTS = [100, 500, 1000, 2000, 5000];

export interface LtcQuote {
  author: string;
  role: { ru: string; en: string };
  year: number;
  quote: { ru: string; en: string };
  sentiment: 'bullish' | 'bearish' | 'neutral';
}

export const LTC_QUOTES: LtcQuote[] = [
  {
    author: 'Чарли Ли',
    role: { ru: 'Создатель Litecoin', en: 'Creator of Litecoin' },
    year: 2011,
    quote: {
      ru: '«Если Bitcoin — это золото, то Litecoin — это серебро. Более быстрые и дешёвые транзакции для повседневного использования.»',
      en: '"If Bitcoin is gold, then Litecoin is silver. Faster and cheaper transactions for everyday use."',
    },
    sentiment: 'bullish',
  },
  {
    author: 'Чарли Ли',
    role: { ru: 'Создатель Litecoin', en: 'Creator of Litecoin' },
    year: 2017,
    quote: {
      ru: '«Я продал все свои Litecoin. Это конфликт интересов — когда я говорю о LTC, люди не знают, продвигаю ли я свои инвестиции.»',
      en: '"I sold all my Litecoin. There is a conflict of interest — when I speak about LTC, people do not know if I am promoting my own investment."',
    },
    sentiment: 'neutral',
  },
  {
    author: 'Виталик Бутерин',
    role: { ru: 'Создатель Ethereum', en: 'Creator of Ethereum' },
    year: 2021,
    quote: {
      ru: '«Litecoin существует уже 10 лет. Это невероятная стойкость для любого open-source проекта.»',
      en: '"Litecoin has existed for 10 years. That is incredible resilience for any open-source project."',
    },
    sentiment: 'neutral',
  },
  {
    author: 'Ли Лиминг',
    role: { ru: 'Старший директор Grayscale', en: 'Senior Director at Grayscale' },
    year: 2021,
    quote: {
      ru: '«Litecoin — один из старейших и наиболее устойчивых альткоинов. Его простота — это преимущество: нет сложности смарт-контрактных экосистем.»',
      en: '"Litecoin is one of the oldest and most resilient altcoins. Its simplicity is an advantage: no complexity of smart contract ecosystems."',
    },
    sentiment: 'bullish',
  },
  {
    author: 'Питер Шифф',
    role: { ru: 'Экономист и критик крипто', en: 'Economist and crypto critic' },
    year: 2022,
    quote: {
      ru: '«Litecoin — это Bitcoin без Bitcoin. Зачем нужен "серебряный" актив, если золото уже есть и при этом лучше?»',
      en: '"Litecoin is Bitcoin without Bitcoin. Why do you need a silver asset when gold already exists and is better?"',
    },
    sentiment: 'bearish',
  },
  {
    author: 'Чарли Ли',
    role: { ru: 'Создатель Litecoin', en: 'Creator of Litecoin' },
    year: 2022,
    quote: {
      ru: '«MWEB (MimbleWimble Extension Blocks) — это самое важное обновление Litecoin за многие годы. Конфиденциальные транзакции для тех, кому они нужны.»',
      en: '"MWEB (MimbleWimble Extension Blocks) is the most important Litecoin upgrade in many years. Private transactions for those who need them."',
    },
    sentiment: 'bullish',
  },
  {
    author: 'Майкл Сейлор',
    role: { ru: 'CEO MicroStrategy', en: 'CEO of MicroStrategy' },
    year: 2021,
    quote: {
      ru: '«Litecoin — это Bitcoin 10 лет назад. Вопрос: зачем держать серебро, когда есть цифровое золото? Я выбираю Bitcoin.»',
      en: '"Litecoin is what Bitcoin was 10 years ago. The question is: why hold silver when you have digital gold? I choose Bitcoin."',
    },
    sentiment: 'bearish',
  },
  {
    author: 'Ароха Нгата',
    role: { ru: 'Крипто-аналитик TrustNodes', en: 'Crypto analyst at TrustNodes' },
    year: 2023,
    quote: {
      ru: '«Litecoin — один из немногих альткоинов без собственной экосистемы, который пережил несколько медвежьих циклов. Это говорит о многом.»',
      en: '"Litecoin is one of the few altcoins without its own ecosystem that has survived several bear cycles. That says a lot."',
    },
    sentiment: 'bullish',
  },
];

export interface LtcFaqItem {
  question: { ru: string; en: string };
  answer: { ru: string; en: string };
}

export const LTC_FAQ: LtcFaqItem[] = [
  {
    question: {
      ru: 'Кто создал Litecoin?',
      en: 'Who created Litecoin?',
    },
    answer: {
      ru: 'Litecoin создал Чарли Ли — бывший инженер Google. Он опубликовал проект 7 октября 2011 года на форуме BitcoinTalk. Ли вдохновился Bitcoin и хотел создать его более быструю и лёгкую версию для повседневных платежей. Сам Ли называл это «серебром против золота». В 2013 году Ли ушёл из Google и присоединился к Coinbase в качестве директора по инжинирингу, продолжая развивать Litecoin. В 2017 году он сделал скандальный шаг — продал все свои LTC на пике рынка, чтобы избежать конфликта интересов.',
      en: 'Litecoin was created by Charlie Lee — a former Google engineer. He published the project on October 7, 2011 on the BitcoinTalk forum. Lee was inspired by Bitcoin and wanted to create a faster and lighter version for everyday payments. Lee himself called it "silver to gold." In 2013, Lee left Google and joined Coinbase as Engineering Director, continuing to develop Litecoin. In 2017 he made a controversial move — selling all his LTC at the market peak to avoid conflict of interest.',
    },
  },
  {
    question: {
      ru: 'Чем Litecoin технически отличается от Bitcoin?',
      en: 'How does Litecoin technically differ from Bitcoin?',
    },
    answer: {
      ru: 'Litecoin — почти буквальный форк Bitcoin с несколькими ключевыми отличиями: 1) Время блока: 2,5 минуты против 10 у Bitcoin — транзакции подтверждаются в 4 раза быстрее; 2) Максимальный запас: 84 млн LTC против 21 млн BTC — в 4 раза больше; 3) Алгоритм майнинга: Scrypt против SHA-256, изначально задуман как «ASIC-resistant» для препятствия монополизации, хотя ASIC для Scrypt всё равно появились; 4) MimbleWimble (MWEB, 2022): опциональные приватные транзакции — функция, которой нет у Bitcoin. По сути LTC остаётся «тестовой сетью» для технологий, которые потом рассматривает Bitcoin.',
      en: 'Litecoin is nearly a literal Bitcoin fork with several key differences: 1) Block time: 2.5 minutes vs. 10 for Bitcoin — transactions confirm 4x faster; 2) Maximum supply: 84 million LTC vs. 21 million BTC — 4x more; 3) Mining algorithm: Scrypt vs. SHA-256, originally designed as "ASIC-resistant" to prevent monopolization, though Scrypt ASICs eventually appeared anyway; 4) MimbleWimble (MWEB, 2022): optional private transactions — a feature Bitcoin lacks. In essence LTC remains a "testnet" for technologies that Bitcoin later considers.',
    },
  },
  {
    question: {
      ru: 'Почему Чарли Ли продал все свои LTC в 2017 году?',
      en: 'Why did Charlie Lee sell all his LTC in 2017?',
    },
    answer: {
      ru: 'В декабре 2017 года, когда LTC торговался вблизи исторического максимума ~$420, Чарли Ли объявил, что продал и подарил все свои Litecoin. Его объяснение было прямым: «Владея большим количеством LTC, у меня есть потенциальный конфликт интересов. Когда я говорю позитивные вещи о Litecoin, люди всегда могут задаться вопросом, пытаюсь ли я накачать цену ради собственной выгоды». Это решение вызвало полярную реакцию: одни похвалили его честность, другие назвали это «дампом токенов» и потерей уверенности в проекте. Ли продолжает руководить Litecoin Foundation.',
      en: 'In December 2017, when LTC was trading near its all-time high of ~$420, Charlie Lee announced he had sold and donated all his Litecoin. His explanation was direct: "Owning a large amount of LTC gives me a potential conflict of interest. When I say positive things about Litecoin, people can always wonder if I am trying to pump the price for personal gain." This decision received polar reactions: some praised his honesty, others called it a "token dump" and loss of confidence in the project. Lee continues to lead the Litecoin Foundation.',
    },
  },
  {
    question: {
      ru: 'Что такое MWEB (MimbleWimble Extension Blocks)?',
      en: 'What is MWEB (MimbleWimble Extension Blocks)?',
    },
    answer: {
      ru: 'MimbleWimble — протокол конфиденциальности для блокчейнов, изначально опубликованный анонимным автором под псевдонимом Tom Elvis Jedusor (французское имя Волан-де-Морта) в 2016 году. MWEB добавляет приватные транзакции в Litecoin — суммы и адреса скрыты. Важно: это опциональная функция, вы можете делать обычные (публичные) или приватные транзакции по выбору. MWEB активировался в мае 2022 года. После этого некоторые биржи (Coinbase) временно задержали интеграцию обновления, а Бинанс добавил MWEB без проблем.',
      en: 'MimbleWimble is a privacy protocol for blockchains, originally published by an anonymous author under the pseudonym Tom Elvis Jedusor (the French name for Voldemort) in 2016. MWEB adds private transactions to Litecoin — amounts and addresses are hidden. Important: this is an optional feature, you can make regular (public) or private transactions by choice. MWEB activated in May 2022. After that some exchanges (Coinbase) temporarily delayed integrating the update, while Binance added MWEB without issues.',
    },
  },
  {
    question: {
      ru: 'Как часто происходит халвинг Litecoin?',
      en: 'How often does Litecoin halving occur?',
    },
    answer: {
      ru: 'Халвинг Litecoin происходит каждые 840 000 блоков (примерно каждые 4 года). Даты предыдущих халвингов: 2015, 2019, 2023. Изначальное вознаграждение: 50 LTC за блок. После трёх халвингов: 6,25 LTC. Следующий халвинг ожидается в 2027 году. В отличие от Bitcoin, халвинги Litecoin не вызывают столь же мощных ценовых ралли — рынок, как правило, уже закладывает событие в цену заранее. Некоторые аналитики считают, что LTC служит «ранним сигналом» о движении BTC из-за схожей дефляционной модели.',
      en: 'Litecoin halving occurs every 840,000 blocks (approximately every 4 years). Previous halving dates: 2015, 2019, 2023. Initial reward: 50 LTC per block. After three halvings: 6.25 LTC. The next halving is expected in 2027. Unlike Bitcoin, Litecoin halvings do not produce as powerful price rallies — the market typically prices in the event in advance. Some analysts believe LTC serves as an "early signal" for BTC movement due to the similar deflationary model.',
    },
  },
  {
    question: {
      ru: 'Какое будущее у Litecoin в мире Layer 2 и DeFi?',
      en: 'What is Litecoin\'s future in a world of Layer 2 and DeFi?',
    },
    answer: {
      ru: 'Litecoin намеренно позиционируется как простой платёжный блокчейн без смарт-контрактов и DeFi. Это одновременно его сила и слабость. Сила: простота, надёжность, 13 лет без взлома протокола. Слабость: отсутствие DeFi-экосистемы, NFT, Layer 2 оставляет его вне крупнейших трендов. Попытки построить мосты к LTC были (WLTC на Ethereum, Lightning Network для LTC), но без широкого принятия. На горизонте 2024–2025: разработчики изучают Atomic Swaps для безопасного обмена с Bitcoin без доверенной стороны, а также возможность Ordinals на Litecoin.',
      en: 'Litecoin deliberately positions itself as a simple payment blockchain without smart contracts or DeFi. This is simultaneously its strength and weakness. Strength: simplicity, reliability, 13 years without a protocol hack. Weakness: the absence of a DeFi ecosystem, NFTs, Layer 2 keeps it outside the biggest trends. Attempts to build bridges to LTC have been made (WLTC on Ethereum, Lightning Network for LTC) but without broad adoption. On the 2024–2025 horizon: developers are exploring Atomic Swaps for trustless exchange with Bitcoin, and the possibility of Ordinals on Litecoin.',
    },
  },
];
