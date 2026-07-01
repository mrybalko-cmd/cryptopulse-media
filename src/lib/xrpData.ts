// Historical XRP prices: average price in July of each year
// XRP has been traded since 2013
export const XRP_INVESTMENT_REFERENCE = [
  {
    yearsAgo: 10,
    year: 2016,
    price: 0.006,
    label: { ru: '10 лет назад (2016)', en: '10 years ago (2016)' },
    note: { ru: 'До начала партнёрств с банками', en: 'Before major bank partnerships' },
  },
  {
    yearsAgo: 5,
    year: 2021,
    price: 0.65,
    label: { ru: '5 лет назад (2021)', en: '5 years ago (2021)' },
    note: { ru: 'На фоне иска SEC против Ripple', en: 'Amid SEC lawsuit against Ripple' },
  },
];

export const INVESTMENT_AMOUNTS = [100, 500, 1000, 2000, 5000];

export interface XrpQuote {
  author: string;
  role: { ru: string; en: string };
  year: number;
  quote: { ru: string; en: string };
  sentiment: 'bullish' | 'bearish' | 'neutral';
}

export const XRP_QUOTES: XrpQuote[] = [
  {
    author: 'Брэд Гарлингхаус',
    role: { ru: 'CEO Ripple', en: 'CEO of Ripple' },
    year: 2023,
    quote: {
      ru: '«Решение суда — это победа не только для Ripple, но и для всей крипто-индустрии США. XRP не является ценной бумагой при продаже на биржах.»',
      en: '"The court ruling is a victory not just for Ripple but for the entire US crypto industry. XRP is not a security when sold on exchanges."',
    },
    sentiment: 'bullish',
  },
  {
    author: 'Крис Ларсен',
    role: { ru: 'Сооснователь Ripple', en: 'Co-founder of Ripple' },
    year: 2021,
    quote: {
      ru: '«XRP был разработан для решения одной проблемы: сделать международные платежи такими же быстрыми и дешёвыми, как электронная почта.»',
      en: '"XRP was designed to solve one problem: to make international payments as fast and cheap as email."',
    },
    sentiment: 'bullish',
  },
  {
    author: 'Судья Анализа Торрес',
    role: { ru: 'Окружной суд США, Нью-Йорк', en: 'US District Court, New York' },
    year: 2023,
    quote: {
      ru: '«Продажи XRP на биржах не являлись предложением ценных бумаг. Покупатели на открытом рынке не имели разумных ожиданий прибыли от усилий Ripple.»',
      en: '"XRP sales on exchanges did not constitute offers of securities. Buyers on the open market had no reasonable expectation of profits from Ripple\'s efforts."',
    },
    sentiment: 'bullish',
  },
  {
    author: 'Гэри Генслер',
    role: { ru: 'Бывший глава SEC', en: 'Former SEC Chairman' },
    year: 2021,
    quote: {
      ru: '«Большинство криптовалют являются ценными бумагами. Эмитенты, выпускающие токены без регистрации в SEC, нарушают закон о ценных бумагах.»',
      en: '"Most crypto tokens are securities. Issuers offering tokens without SEC registration are violating securities law."',
    },
    sentiment: 'bearish',
  },
  {
    author: 'Йошитака Китао',
    role: { ru: 'CEO SBI Holdings (Япония)', en: 'CEO of SBI Holdings (Japan)' },
    year: 2020,
    quote: {
      ru: '«XRP — лучшее решение для международных платежей. SBI Ripple Asia уже обрабатывает миллиарды долларов транзакций между Японией и другими странами.»',
      en: '"XRP is the best solution for cross-border payments. SBI Ripple Asia already processes billions of dollars in transactions between Japan and other countries."',
    },
    sentiment: 'bullish',
  },
  {
    author: 'Питер Брандт',
    role: { ru: 'Трейдер и технический аналитик', en: 'Trader and technical analyst' },
    year: 2021,
    quote: {
      ru: '«XRP — это банкирская монета, контролируемая Ripple Labs. Назвать её децентрализованной криптовалютой — значит вводить людей в заблуждение.»',
      en: '"XRP is a banker\'s coin controlled by Ripple Labs. Calling it a decentralized cryptocurrency is misleading to people."',
    },
    sentiment: 'bearish',
  },
  {
    author: 'Дэвид Шварц',
    role: { ru: 'Главный технолог Ripple (CTO)', en: 'Ripple Chief Technology Officer' },
    year: 2022,
    quote: {
      ru: '«XRP Ledger работает уже более 10 лет без единого сбоя. Это доказывает, что можно иметь одновременно высокую скорость, низкие комиссии и децентрализацию.»',
      en: '"XRP Ledger has been running for over 10 years without a single outage. This proves you can have high speed, low fees, and decentralization at the same time."',
    },
    sentiment: 'bullish',
  },
  {
    author: 'Боб Уэй',
    role: { ru: 'Бывший инженер Ripple, эксперт XRP', en: 'Former Ripple engineer, XRP expert' },
    year: 2020,
    quote: {
      ru: '«XRP — это мост между фиатными валютами. Он не конкурирует с Bitcoin или Ethereum — он решает другую задачу: мгновенные международные расчёты.»',
      en: '"XRP is a bridge currency between fiat currencies. It doesn\'t compete with Bitcoin or Ethereum — it solves a different problem: instant international settlement."',
    },
    sentiment: 'bullish',
  },
];

export interface XrpFaqItem {
  question: { ru: string; en: string };
  answer: { ru: string; en: string };
}

export const XRP_FAQ: XrpFaqItem[] = [
  {
    question: {
      ru: 'Что такое XRP и чем он отличается от Bitcoin?',
      en: 'What is XRP and how does it differ from Bitcoin?',
    },
    answer: {
      ru: 'XRP — это цифровой актив, разработанный для международных платежей. В отличие от Bitcoin, который создан как альтернатива фиатным деньгам и средство сбережения, XRP создан как «мост» между валютами: банки и платёжные системы используют его для мгновенного обмена одной валюты на другую без промежуточной конвертации. XRP обрабатывает транзакции за 3–5 секунд с комиссией в доли цента. Кроме того, все 100 млрд XRP уже созданы заранее (в отличие от Bitcoin, который добывается).',
      en: 'XRP is a digital asset designed for international payments. Unlike Bitcoin, which was created as an alternative to fiat money and a store of value, XRP is designed as a "bridge" between currencies: banks and payment systems use it for instant exchange of one currency for another without intermediate conversion. XRP processes transactions in 3–5 seconds with fees of fractions of a cent. Additionally, all 100 billion XRP were pre-created (unlike Bitcoin, which is mined).',
    },
  },
  {
    question: {
      ru: 'Кто создал XRP и Ripple?',
      en: 'Who created XRP and Ripple?',
    },
    answer: {
      ru: 'Идея цифровой платёжной системы Ripple принадлежит Райану Фаггеру (2004). В 2012 году Джед МакКалеб и Крис Ларсен основали компанию OpenCoin (позднее переименована в Ripple Labs), разработав XRP на базе этой концепции. Джед МакКалеб позднее покинул Ripple и основал Stellar (XLM). Криптовалюта XRP функционирует на XRP Ledger — блокчейне, запущенном в 2012 году и работающем на консенсусном механизме без майнинга.',
      en: 'The idea for the Ripple digital payment system originated with Ryan Fugger (2004). In 2012, Jed McCaleb and Chris Larsen founded the company OpenCoin (later renamed Ripple Labs), developing XRP based on this concept. Jed McCaleb later left Ripple and founded Stellar (XLM). XRP functions on the XRP Ledger — a blockchain launched in 2012 running on a consensus mechanism without mining.',
    },
  },
  {
    question: {
      ru: 'Что такое иск SEC против Ripple и чем он закончился?',
      en: 'What is the SEC lawsuit against Ripple and how did it end?',
    },
    answer: {
      ru: 'В декабре 2020 года Комиссия по ценным бумагам США (SEC) подала иск против Ripple Labs, утверждая, что XRP является незарегистрированной ценной бумагой. Это обрушило цену XRP на 70% и привело к делистингу с крупных американских бирж. В июле 2023 года судья Анализа Торрес вынесла историческое решение: XRP, продаваемый на биржах, не является ценной бумагой. Это была крупнейшая победа крипто-индустрии в судах США и значимый прецедент для всего рынка.',
      en: 'In December 2020, the US Securities and Exchange Commission (SEC) filed a lawsuit against Ripple Labs, claiming XRP was an unregistered security. This crashed XRP\'s price by 70% and led to delistings from major US exchanges. In July 2023, Judge Analisa Torres issued a landmark ruling: XRP sold on exchanges is not a security. This was the biggest victory for the crypto industry in US courts and a significant precedent for the entire market.',
    },
  },
  {
    question: {
      ru: 'Что такое RippleNet и ODL?',
      en: 'What is RippleNet and ODL?',
    },
    answer: {
      ru: 'RippleNet — это глобальная платёжная сеть Ripple, объединяющая более 300 финансовых институтов (банков, платёжных провайдеров) в 40+ странах. Она позволяет проводить трансграничные платежи быстрее и дешевле, чем через систему SWIFT. ODL (On-Demand Liquidity) — ключевой продукт внутри RippleNet, использующий XRP как мост между валютами в режиме реального времени. Вместо того чтобы держать предварительно размещённые средства в разных валютах, банки конвертируют деньги через XRP мгновенно.',
      en: 'RippleNet is Ripple\'s global payment network, connecting over 300 financial institutions (banks, payment providers) in 40+ countries. It enables cross-border payments faster and cheaper than SWIFT. ODL (On-Demand Liquidity) is the key product within RippleNet, using XRP as a bridge between currencies in real time. Instead of pre-funding accounts in different currencies, banks convert money through XRP instantly.',
    },
  },
  {
    question: {
      ru: 'Правда ли что XRP централизован — Ripple контролирует его?',
      en: 'Is XRP really centralized — does Ripple control it?',
    },
    answer: {
      ru: 'Это один из главных аргументов критиков. Действительно, Ripple Labs изначально получила 80 млрд XRP из 100 млрд общего запаса. Большая часть заблокирована в escrow (55 млрд), из которых Ripple ежемесячно высвобождает до 1 млрд на нужды компании. XRP Ledger управляется сетью независимых валидаторов — технически ни одна сторона не может единолично остановить сеть. Однако доля Ripple в запасе и значительное влияние на экосистему отличают XRP от полностью децентрализованных активов вроде Bitcoin.',
      en: 'This is one of the main arguments of critics. Ripple Labs did initially receive 80 billion XRP out of 100 billion total supply. Most is locked in escrow (55 billion), from which Ripple releases up to 1 billion monthly for company needs. The XRP Ledger is governed by a network of independent validators — technically no single party can unilaterally stop the network. However, Ripple\'s share of the supply and significant ecosystem influence distinguishes XRP from fully decentralized assets like Bitcoin.',
    },
  },
  {
    question: {
      ru: 'Какой максимальный запас XRP и как он изменяется?',
      en: 'What is the maximum XRP supply and how does it change?',
    },
    answer: {
      ru: 'Максимальный запас XRP составляет ровно 100 миллиардов монет — все они были созданы при запуске сети в 2012 году (в отличие от Bitcoin, который продолжает добываться). XRP не майнится. Вместо этого каждая транзакция сжигает небольшую сумму XRP (около 0,00001 XRP), что делает общий запас постепенно дефляционным. К 2024 году в обращении находилось около 55–57 млрд XRP, остальные заблокированы в escrow Ripple.',
      en: 'The maximum XRP supply is exactly 100 billion coins — all created at the network launch in 2012 (unlike Bitcoin, which continues to be mined). XRP is not mined. Instead, each transaction burns a small amount of XRP (~0.00001 XRP), making the total supply gradually deflationary. By 2024, approximately 55–57 billion XRP were in circulation, with the rest locked in Ripple\'s escrow.',
    },
  },
];
