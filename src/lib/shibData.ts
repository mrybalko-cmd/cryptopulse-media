export const SHIB_INVESTMENT_REFERENCE = [
  {
    yearsAgo: 4,
    year: 2022,
    price: 0.0000110,
    label: { ru: '4 года назад (2022)', en: '4 years ago (2022)' },
    note: { ru: 'После пика 2021, до Shibarium', en: 'After 2021 peak, before Shibarium' },
  },
];

export const INVESTMENT_AMOUNTS = [100, 500, 1000, 2000, 5000];

export interface ShibQuote {
  author: string;
  role: { ru: string; en: string };
  year: number;
  quote: { ru: string; en: string };
  sentiment: 'bullish' | 'bearish' | 'neutral';
}

export const SHIB_QUOTES: ShibQuote[] = [
  {
    author: 'Рёши (Ryoshi)',
    role: { ru: 'Анонимный создатель SHIB', en: 'Anonymous creator of SHIB' },
    year: 2020,
    quote: {
      ru: '«Я отправил половину всего запаса SHIB Виталику Бутерину. Либо он их сожжёт и поднимет ценность, либо будет держать. Это его выбор.»',
      en: '"I sent half of the entire SHIB supply to Vitalik Buterin. Either he burns them and raises the value, or he holds them. It is his choice."',
    },
    sentiment: 'bullish',
  },
  {
    author: 'Виталик Бутерин',
    role: { ru: 'Создатель Ethereum', en: 'Creator of Ethereum' },
    year: 2021,
    quote: {
      ru: '«Я не хочу быть марионеткой, которую крипто-проекты используют для накачки цены. Я жертвую свои SHIB (≈$1 млрд) в фонд помощи Индии при COVID и частично сжигаю.»',
      en: '"I do not want to be a puppet that crypto projects use to pump their price. I am donating my SHIB (≈$1 billion) to India COVID relief and burning part of it."',
    },
    sentiment: 'neutral',
  },
  {
    author: 'Шитоши Кусама',
    role: { ru: 'Главный разработчик Shiba Inu', en: 'Lead developer of Shiba Inu' },
    year: 2023,
    quote: {
      ru: '«Shibarium — это не просто Layer 2. Это основа для нашей экосистемы: дешёвые транзакции, сжигание SHIB и десятки приложений.»',
      en: '"Shibarium is not just a Layer 2. It is the foundation for our ecosystem: cheap transactions, SHIB burning, and dozens of applications."',
    },
    sentiment: 'bullish',
  },
  {
    author: 'Кэти Вуд',
    role: { ru: 'CEO ARK Invest', en: 'CEO of ARK Invest' },
    year: 2021,
    quote: {
      ru: '«Мы не вкладываем в мем-коины. Наш инвестиционный критерий — реальная технологическая инновация, а не интернет-юмор.»',
      en: '"We do not invest in meme coins. Our investment criterion is real technological innovation, not internet humor."',
    },
    sentiment: 'bearish',
  },
  {
    author: 'Питер Шифф',
    role: { ru: 'Экономист и критик крипто', en: 'Economist and crypto critic' },
    year: 2021,
    quote: {
      ru: '«SHIB вырос на 1 000 000% за год не потому что у него есть ценность, а потому что люди надеются продать его кому-то ещё дороже. Это определение пирамиды.»',
      en: '"SHIB rose 1,000,000% in a year not because it has value but because people hope to sell it to someone else at a higher price. That is the definition of a pyramid."',
    },
    sentiment: 'bearish',
  },
  {
    author: 'Марк Кубан',
    role: { ru: 'Миллиардер, владелец Dallas Mavericks', en: 'Billionaire, owner of Dallas Mavericks' },
    year: 2021,
    quote: {
      ru: '«SHIB — это игра на импульс. Если вы готовы потерять всё вложенное — ладно. Если нет — держитесь подальше.»',
      en: '"SHIB is a momentum play. If you are prepared to lose everything you put in — fine. If not — stay away."',
    },
    sentiment: 'neutral',
  },
  {
    author: 'Илон Маск',
    role: { ru: 'CEO Tesla и SpaceX', en: 'CEO of Tesla and SpaceX' },
    year: 2021,
    quote: {
      ru: '«У меня нет Shiba Inu.»',
      en: '"I do not own Shiba Inu."',
    },
    sentiment: 'neutral',
  },
  {
    author: 'Шитоши Кусама',
    role: { ru: 'Главный разработчик Shiba Inu', en: 'Lead developer of Shiba Inu' },
    year: 2024,
    quote: {
      ru: '«ShibaOS и Shiba Eternity показывают: мы строим реальный продукт, а не просто держим мем. Сообщество верит в нас.»',
      en: '"ShibaOS and Shiba Eternity show: we are building a real product, not just holding a meme. The community believes in us."',
    },
    sentiment: 'bullish',
  },
];

export interface ShibFaqItem {
  question: { ru: string; en: string };
  answer: { ru: string; en: string };
}

export const SHIB_FAQ: ShibFaqItem[] = [
  {
    question: {
      ru: 'Кто создал Shiba Inu?',
      en: 'Who created Shiba Inu?',
    },
    answer: {
      ru: 'Shiba Inu запустил анонимный разработчик под псевдонимом «Ryoshi» в августе 2020 года. Ryoshi намеренно оставался анонимным, следуя примеру Сатоши Накамото. В мае 2022 года Ryoshi удалил все свои соцсети и объявил «уход», передав проект сообществу. Разработку продолжил лид-разработчик под псевдонимом «Shytoshi Kusama». Изначально SHIB создавался как «децентрализованный мем-токен» — буквально эксперимент с нулевыми издержками. Ryoshi отправил 50% всего запаса Виталику Бутерину, а другие 50% — на Uniswap для создания ликвидности.',
      en: 'Shiba Inu was launched by an anonymous developer under the pseudonym "Ryoshi" in August 2020. Ryoshi deliberately remained anonymous, following the example of Satoshi Nakamoto. In May 2022, Ryoshi deleted all his social accounts and announced "retirement," handing the project to the community. Development continued under lead developer pseudonym "Shytoshi Kusama." Originally SHIB was created as a "decentralized meme token" — literally a zero-cost experiment. Ryoshi sent 50% of the entire supply to Vitalik Buterin and the other 50% to Uniswap to create liquidity.',
    },
  },
  {
    question: {
      ru: 'Почему Виталик Бутерин сжёг SHIB?',
      en: 'Why did Vitalik Buterin burn SHIB?',
    },
    answer: {
      ru: 'В мае 2021 года SHIB взлетел на сотни тысяч процентов. Ryoshi отправил Виталику Бутерину половину всего запаса (~410 трлн SHIB, стоимостью около $7 млрд на пике). Бутерин сначала разозлился — он не просил эти токены. Но потом принял прагматичное решение: 10% (~$1 млрд в SHIB) пожертвовал в India COVID-Crypto Relief Fund, 90% (~$6,7 млрд в SHIB) сжёг, отправив на мёртвый адрес. Это одновременно уменьшило обращающееся предложение и поддержало реальное дело. Бутерин написал: «Не хочу быть "крипто-кингом" каких-либо токенов, которые я не просил.»',
      en: 'In May 2021, SHIB skyrocketed hundreds of thousands of percent. Ryoshi sent Vitalik Buterin half of the entire supply (~410 trillion SHIB, worth about $7 billion at the peak). Buterin was initially annoyed — he did not ask for these tokens. But then he made a pragmatic decision: donated 10% (~$1B in SHIB) to the India COVID-Crypto Relief Fund, burned 90% (~$6.7B in SHIB) by sending to a dead address. This simultaneously reduced circulating supply and supported a real cause. Buterin wrote: "I do not want to be the \'crypto king\' of any tokens I did not ask for."',
    },
  },
  {
    question: {
      ru: 'Что такое Shibarium?',
      en: 'What is Shibarium?',
    },
    answer: {
      ru: 'Shibarium — это Layer 2 сети Ethereum, разработанный командой Shiba Inu. Запуск прошёл в августе 2023 года с первоначальными техническими проблемами (сеть перегрузилась в первые дни), но вскоре стабилизировалась. Цель Shibarium: 1) Снизить комиссии для транзакций в SHIB, BONE и LEASH; 2) Создать среду для dApps, игр и NFT; 3) Каждая транзакция сжигает часть SHIB — уменьшая предложение. BONE — нативный газовый токен Shibarium. В экосистеме также есть LEASH (ограниченное предложение) и ShibaSwap DEX.',
      en: 'Shibarium is a Layer 2 of the Ethereum network developed by the Shiba Inu team. The launch happened in August 2023 with initial technical problems (network overloaded in the first days) but quickly stabilized. Shibarium\'s goals: 1) Reduce fees for SHIB, BONE, and LEASH transactions; 2) Create an environment for dApps, games and NFTs; 3) Every transaction burns some SHIB — reducing supply. BONE is Shibarium\'s native gas token. The ecosystem also includes LEASH (limited supply) and the ShibaSwap DEX.',
    },
  },
  {
    question: {
      ru: 'В чём риск инвестиции в SHIB?',
      en: 'What are the risks of investing in SHIB?',
    },
    answer: {
      ru: 'SHIB — один из наиболее волатильных активов в криптоиндустрии. Ключевые риски: 1) Экстремальная волатильность: после ATH в октябре 2021 ($0.0000888) SHIB потерял более 90% стоимости; 2) Гигантское предложение: около 589 трлн SHIB — даже при росте до $0.001 рыночная капитализация была бы $589 млрд; 3) Зависимость от нарративов и Твиттера; 4) Регуляторный риск для мем-токенов; 5) Анонимность основателей. С другой стороны: активное сообщество, реальная разработка (Shibarium, игры, метавселенная), сжигание токенов. Всегда инвестируй только то, что не жалко потерять.',
      en: 'SHIB is one of the most volatile assets in the crypto industry. Key risks: 1) Extreme volatility: after ATH in October 2021 ($0.0000888) SHIB lost over 90% of its value; 2) Enormous supply: approximately 589 trillion SHIB — even at $0.001 the market cap would be $589 billion; 3) Dependence on narratives and Twitter; 4) Regulatory risk for meme tokens; 5) Founder anonymity. On the other hand: active community, real development (Shibarium, games, metaverse), token burning. Always invest only what you can afford to lose.',
    },
  },
  {
    question: {
      ru: 'Сколько SHIB было уничтожено?',
      en: 'How much SHIB has been burned?',
    },
    answer: {
      ru: 'Изначально было создано 1 квадриллион (1 000 000 000 000 000) SHIB. Виталик Бутерин в 2021 году сжёг около 410 трлн SHIB (~41% от общего предложения). С тех пор ещё несколько трлн было уничтожено через различные механизмы (в том числе транзакции Shibarium). По состоянию на 2024 год в обращении осталось около 589 трлн SHIB. Портал Shibburn.com отслеживает темп сжигания в реальном времени. Важно понимать: даже при сжигании миллиардов SHIB в день, при таком огромном предложении значимого влияния на цену это не оказывает немедленно.',
      en: 'Originally 1 quadrillion (1,000,000,000,000,000) SHIB were created. Vitalik Buterin burned approximately 410 trillion SHIB in 2021 (~41% of the total supply). Since then several more trillion have been burned through various mechanisms (including Shibarium transactions). As of 2024 approximately 589 trillion SHIB remain in circulation. The Shibburn.com portal tracks the burn rate in real time. Important to understand: even burning billions of SHIB per day, with such an enormous supply, this does not have an immediate significant impact on price.',
    },
  },
  {
    question: {
      ru: 'Может ли SHIB достичь $0.01?',
      en: 'Can SHIB reach $0.01?',
    },
    answer: {
      ru: 'Это один из самых популярных вопросов в крипто-сообществе. Математика: при цене $0.01 и текущем предложении ~589 трлн SHIB рыночная капитализация составит ~$5,89 квадриллиона — это в тысячи раз больше всего мирового ВВП (~$100 трлн). Математически невозможно при текущем предложении. Для достижения $0.01 нужно сжечь свыше 99,9% всего предложения. При цене $0.001 — капитализация будет $589 млрд (уровень топ-3 крипто), что теоретически возможно, но требует масштабного роста всей криптоиндустрии. Это не финансовая рекомендация.',
      en: 'This is one of the most popular questions in the crypto community. The math: at $0.01 with the current supply of ~589 trillion SHIB, the market cap would be ~$5.89 quadrillion — thousands of times more than the entire global GDP (~$100 trillion). Mathematically impossible at the current supply. To reach $0.01, over 99.9% of total supply would need to be burned. At $0.001, the market cap would be $589 billion (top-3 crypto level), which is theoretically possible but requires massive growth of the entire crypto industry. Not financial advice.',
    },
  },
];
