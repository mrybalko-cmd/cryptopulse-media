export interface FaqItem {
  slug: string;
  category: { ru: string; en: string };
  question: { ru: string; en: string };
  answer: { ru: string; en: string };
}

export const FAQ: FaqItem[] = [
  {
    slug: 'trc20-vs-erc20',
    category: { ru: 'Сети и комиссии', en: 'Networks & fees' },
    question: { ru: 'Какая сеть дешевле для перевода USDT: TRC20 или ERC20?', en: 'Which network is cheaper for sending USDT: TRC20 or ERC20?' },
    answer: {
      ru: 'TRC20 (сеть TRON) почти всегда дешевле — комиссия обычно составляет около 1 доллара или меньше, тогда как комиссия в сети ERC20 (Ethereum) может доходить до нескольких, а в периоды загрузки сети — до десятков долларов. Перед переводом обязательно проверьте, что и отправитель, и получатель используют одну и ту же сеть — перевод в неправильную сеть может привести к потере средств.',
      en: 'TRC20 (the TRON network) is almost always cheaper — fees are typically around $1 or less, while ERC20 (Ethereum) fees can run into several dollars, or tens of dollars during network congestion. Always confirm that both the sender and recipient are using the same network — sending to the wrong network can result in lost funds.',
    },
  },
  {
    slug: 'what-is-seed-phrase-recovery',
    category: { ru: 'Кошельки', en: 'Wallets' },
    question: { ru: 'Можно ли восстановить доступ к кошельку, если потерял сид-фразу?', en: 'Can I recover my wallet if I lose my seed phrase?' },
    answer: {
      ru: 'Если вы потеряли и сид-фразу, и доступ к устройству с кошельком, восстановить средства невозможно — ни одна компания, включая разработчиков кошелька, не имеет резервной копии ваших ключей. Поэтому сид-фразу нужно записывать на бумаге (или в металле) и хранить в нескольких надёжных местах, а не только в памяти или в заметках на телефоне.',
      en: 'If you lose both your seed phrase and access to the device holding the wallet, your funds cannot be recovered — no company, including the wallet developer, holds a backup of your keys. That is why you should write your seed phrase on paper (or metal) and store it in more than one secure location, not just in your memory or in phone notes.',
    },
  },
  {
    slug: 'cex-vs-dex',
    category: { ru: 'Биржи', en: 'Exchanges' },
    question: { ru: 'В чём разница между CEX и DEX?', en: 'What is the difference between a CEX and a DEX?' },
    answer: {
      ru: 'CEX (централизованная биржа, например Binance) хранит ваши средства на своих кошельках и обычно требует прохождения верификации (KYC). DEX (децентрализованная биржа) позволяет торговать напрямую из собственного кошелька через смарт-контракты без передачи средств третьей стороне, но обычно не имеет службы поддержки и не отменяет ошибочные транзакции.',
      en: 'A CEX (centralized exchange, e.g. Binance) holds your funds in its own wallets and usually requires identity verification (KYC). A DEX (decentralized exchange) lets you trade directly from your own wallet via smart contracts without handing funds to a third party, but typically has no customer support and cannot reverse mistaken transactions.',
    },
  },
  {
    slug: 'crypto-taxes',
    category: { ru: 'Налоги и право', en: 'Taxes & legal' },
    question: { ru: 'Нужно ли платить налоги с криптовалюты?', en: 'Do I need to pay taxes on cryptocurrency?' },
    answer: {
      ru: 'В большинстве стран продажа или обмен криптовалюты с прибылью считается налогооблагаемым событием. Правила сильно различаются по странам и часто меняются, поэтому мы не можем дать универсальный ответ — обратитесь к налоговому консультанту в вашей юрисдикции. Это не является налоговой консультацией.',
      en: 'In most countries, selling or trading cryptocurrency at a profit is a taxable event. Rules vary significantly by country and change frequently, so we cannot give a universal answer — consult a tax advisor in your jurisdiction. This is not tax advice.',
    },
  },
  {
    slug: 'what-is-gas-fee',
    category: { ru: 'Сети и комиссии', en: 'Networks & fees' },
    question: { ru: 'Что такое газ (gas fee) и почему он постоянно меняется?', en: 'What is a gas fee and why does it keep changing?' },
    answer: {
      ru: 'Газ — это плата за обработку транзакции или смарт-контракта в сети блокчейна, например Ethereum. Размер газа зависит от того, насколько загружена сеть в данный момент: чем больше людей одновременно отправляют транзакции, тем выше комиссия, поскольку пользователи конкурируют за ограниченное место в блоке.',
      en: 'Gas is the fee paid for processing a transaction or smart contract on a blockchain network such as Ethereum. The amount depends on how congested the network is at that moment: the more people are sending transactions at once, the higher the fee, since users are competing for limited space in each block.',
    },
  },
  {
    slug: 'sent-to-wrong-address',
    category: { ru: 'Безопасность', en: 'Security' },
    question: { ru: 'Что делать, если я отправил крипту не на тот адрес?', en: "What should I do if I sent crypto to the wrong address?" },
    answer: {
      ru: 'Транзакции в блокчейне необратимы. Если адрес существует и принадлежит другому пользователю или несовместимому кошельку, вернуть средства можно только если получатель добровольно отправит их обратно — гарантировать это никто не может. Перед любым переводом всегда проверяйте адрес получателя и сеть посимвольно.',
      en: 'Blockchain transactions are irreversible. If the address exists and belongs to another user or an incompatible wallet, the funds can only be recovered if the recipient voluntarily sends them back — there is no way to guarantee this. Always double-check the recipient address and network character by character before sending.',
    },
  },
  {
    slug: 'is-it-safe-to-keep-crypto-on-exchange',
    category: { ru: 'Безопасность', en: 'Security' },
    question: { ru: 'Безопасно ли хранить крипту на бирже?', en: 'Is it safe to keep crypto on an exchange?' },
    answer: {
      ru: 'Для небольших сумм и активной торговли это приемлемо, но биржи остаются привлекательной целью для взлома, а в случае банкротства биржи доступ к средствам может быть потерян. Общее правило: суммы, которыми вы не торгуете активно, лучше переводить в собственный некастодиальный (и желательно холодный) кошелёк.',
      en: 'For small amounts and active trading it is acceptable, but exchanges remain attractive hacking targets, and if an exchange goes bankrupt, access to funds can be lost. The general rule is: move any amount you are not actively trading into your own non-custodial — ideally cold — wallet.',
    },
  },
  {
    slug: 'bitcoin-vs-ethereum',
    category: { ru: 'Основы', en: 'Basics' },
    question: { ru: 'В чём разница между Bitcoin и Ethereum?', en: 'What is the difference between Bitcoin and Ethereum?' },
    answer: {
      ru: 'Bitcoin создавался как цифровое «золото» — альтернатива деньгам и средство сохранения стоимости. Ethereum — это платформа для смарт-контрактов, на которой строятся приложения DeFi, NFT и тысячи токенов. У них разные блокчейны, разные механизмы консенсуса и разные основные сценарии использования.',
      en: 'Bitcoin was designed as digital "gold" — an alternative to money and a store of value. Ethereum is a smart-contract platform on which DeFi apps, NFTs, and thousands of tokens are built. They run on different blockchains, use different consensus mechanisms, and serve different primary use cases.',
    },
  },
  {
    slug: 'how-many-confirmations-btc',
    category: { ru: 'Сети и комиссии', en: 'Networks & fees' },
    question: { ru: 'Сколько подтверждений нужно для транзакции Bitcoin?', en: 'How many confirmations does a Bitcoin transaction need?' },
    answer: {
      ru: 'Большинство бирж считают транзакцию надёжной после 1–6 подтверждений (примерно 10–60 минут), в зависимости от суммы перевода и политики конкретной площадки. Чем крупнее сумма, тем больше подтверждений обычно требуется.',
      en: 'Most exchanges treat a transaction as final after 1–6 confirmations (roughly 10–60 minutes), depending on the transfer amount and the specific platform\'s policy. The larger the amount, the more confirmations are typically required.',
    },
  },
  {
    slug: 'transaction-stuck',
    category: { ru: 'Сети и комиссии', en: 'Networks & fees' },
    question: { ru: 'Что делать, если перевод «завис» и долго не подтверждается?', en: 'What should I do if a transfer is "stuck" and not confirming?' },
    answer: {
      ru: 'Чаще всего это означает, что указанная комиссия слишком мала для текущей загрузки сети. Некоторые кошельки позволяют ускорить транзакцию (Replace-By-Fee) или отменить и отправить заново с более высокой комиссией. Если такой функции нет — остаётся только ждать, пока сеть разгрузится; средства при этом не теряются.',
      en: 'This usually means the fee you set was too low for current network congestion. Some wallets let you speed up the transaction (Replace-By-Fee) or cancel and resend with a higher fee. If that option isn\'t available, you simply have to wait for the network to clear — the funds are not lost in the meantime.',
    },
  },
  {
    slug: 'spot-vs-futures',
    category: { ru: 'Трейдинг', en: 'Trading' },
    question: { ru: 'Что выгоднее: спотовая торговля или фьючерсы?', en: 'Which is better: spot trading or futures?' },
    answer: {
      ru: 'Спот — это покупка реальной криптовалюты без плеча, риск ограничен суммой вложения. Фьючерсы с кредитным плечом позволяют зарабатывать больше при удачном прогнозе, но так же быстро приводят к ликвидации позиции при ошибке. Для начинающих спот значительно безопаснее.',
      en: 'Spot trading means buying actual cryptocurrency without leverage, so your risk is limited to the amount invested. Leveraged futures can amplify gains when your prediction is right, but they can just as quickly trigger liquidation when it\'s wrong. Spot trading is significantly safer for beginners.',
    },
  },
  {
    slug: 'how-to-spot-scam-token',
    category: { ru: 'Безопасность', en: 'Security' },
    question: { ru: 'Как не попасть на скам-токен или rug pull?', en: 'How can I avoid scam tokens and rug pulls?' },
    answer: {
      ru: 'Проверяйте, заблокирована (locked) ли ликвидность проекта, есть ли аудит смарт-контракта от известной компании, насколько токены сконцентрированы в кошельках команды, и реален ли заявленный коллектив (есть ли публичная история, выступления, код на GitHub). Чем меньше прозрачности — тем выше риск.',
      en: 'Check whether the project\'s liquidity is locked, whether the smart contract has been audited by a reputable firm, how concentrated the token supply is in team wallets, and whether the team is verifiably real (public history, talks, code on GitHub). The less transparency there is, the higher the risk.',
    },
  },
  {
    slug: 'what-is-staking-yield',
    category: { ru: 'Основы', en: 'Basics' },
    question: { ru: 'Что такое стейкинг и сколько на нём можно заработать?', en: 'What is staking and how much can I earn from it?' },
    answer: {
      ru: 'Стейкинг — это блокировка криптовалюты для участия в подтверждении транзакций сети Proof-of-Stake в обмен на вознаграждение. Доходность сильно различается между сетями и провайдерами — от 1–2% до 15–20% годовых, но чем выше обещанная доходность, тем выше и риск (включая риск полной потери средств).',
      en: 'Staking means locking up cryptocurrency to help validate transactions on a Proof-of-Stake network in exchange for rewards. Yields vary widely between networks and providers — from 1–2% to 15–20% annually — but the higher the promised yield, the higher the risk, including the risk of losing the funds entirely.',
    },
  },
  {
    slug: 'limit-vs-market-order',
    category: { ru: 'Трейдинг', en: 'Trading' },
    question: { ru: 'В чём разница между лимитным и рыночным ордером?', en: 'What is the difference between a limit order and a market order?' },
    answer: {
      ru: 'Рыночный ордер исполняется немедленно по лучшей доступной цене. Лимитный ордер исполняется только при достижении указанной вами цены или лучше — может не исполниться вовсе, но даёт больше контроля над ценой сделки.',
      en: 'A market order executes immediately at the best available price. A limit order only executes once the market reaches your specified price or better — it may never fill, but it gives you more control over the trade price.',
    },
  },
  {
    slug: 'minimum-amount-to-start',
    category: { ru: 'Основы', en: 'Basics' },
    question: { ru: 'С какой минимальной суммы можно начать инвестировать в крипту?', en: 'What is the minimum amount needed to start investing in crypto?' },
    answer: {
      ru: 'Технически большинство криптовалют делимы на очень маленькие доли (например, сатоши для биткоина), поэтому можно начать с нескольких долларов. Однако стоит учитывать комиссии сети и биржи, которые при слишком маленьких суммах могут «съесть» значительную часть вложений.',
      en: 'Technically, most cryptocurrencies are divisible into very small fractions (such as satoshis for Bitcoin), so you can start with just a few dollars. However, network and exchange fees can eat up a significant share of very small amounts, so it\'s worth factoring that in.',
    },
  },
  {
    slug: 'hardware-vs-software-wallet',
    category: { ru: 'Кошельки', en: 'Wallets' },
    question: { ru: 'Что лучше: аппаратный или программный кошелёк?', en: 'Which is better: a hardware wallet or a software wallet?' },
    answer: {
      ru: 'Аппаратный (холодный) кошелёк хранит приватные ключи offline на физическом устройстве и считается самым безопасным вариантом для хранения крупных сумм. Программный (горячий) кошелёк удобнее для частых небольших операций, но более уязвим, поскольку устройство постоянно подключено к интернету.',
      en: 'A hardware (cold) wallet stores private keys offline on a physical device and is considered the safest option for holding large amounts. A software (hot) wallet is more convenient for frequent small transactions, but is more vulnerable since the device stays connected to the internet.',
    },
  },
  {
    slug: 'what-is-a-whitepaper',
    category: { ru: 'Основы', en: 'Basics' },
    question: { ru: 'Зачем читать whitepaper проекта перед инвестицией?', en: "Why should I read a project's whitepaper before investing?" },
    answer: {
      ru: 'Whitepaper описывает технологию, цель и экономику токена проекта. Его внимательное изучение помогает понять, решает ли проект реальную задачу, насколько продумана его токеномика и не содержит ли документ явных признаков мошеннической схемы — например, нереалистичных обещаний доходности.',
      en: "A whitepaper describes a project's technology, goals, and token economics. Reading it carefully helps you understand whether the project solves a real problem, how well thought out its tokenomics are, and whether the document shows obvious red flags — such as unrealistic return promises.",
    },
  },
  {
    slug: 'what-is-kyc-why-required',
    category: { ru: 'Биржи', en: 'Exchanges' },
    question: { ru: 'Зачем биржи требуют пройти верификацию (KYC)?', en: 'Why do exchanges require identity verification (KYC)?' },
    answer: {
      ru: 'Регулируемые биржи обязаны проверять личность пользователей по закону, чтобы предотвращать отмывание денег и мошенничество (требования AML/KYC). Это также помогает бирже восстановить доступ к аккаунту, если вы потеряете пароль.',
      en: 'Regulated exchanges are legally required to verify user identity in order to prevent money laundering and fraud (AML/KYC requirements). It also helps the exchange restore access to your account if you lose your password.',
    },
  },
  {
    slug: 'what-is-market-cap',
    category: { ru: 'Основы', en: 'Basics' },
    question: { ru: 'Почему важно смотреть на капитализацию, а не только на цену монеты?', en: "Why does market cap matter more than just a coin's price?" },
    answer: {
      ru: 'Цена одной монеты ничего не говорит о размере проекта — дешёвая монета может иметь огромное количество в обороте. Капитализация (цена × количество монет в обращении) показывает реальный размер проекта и позволяет корректно сравнивать разные криптовалюты между собой.',
      en: "A single coin's price says nothing about a project's size — a cheap coin can simply have a huge circulating supply. Market cap (price × circulating supply) reflects a project's real size and lets you compare different cryptocurrencies meaningfully.",
    },
  },
  {
    slug: 'crypto-volatility-why',
    category: { ru: 'Основы', en: 'Basics' },
    question: { ru: 'Почему курс криптовалют так сильно колеблется?', en: 'Why does the price of cryptocurrency fluctuate so much?' },
    answer: {
      ru: 'Крипторынок торгуется круглосуточно, имеет относительно небольшую ликвидность по сравнению с традиционными рынками и сильно реагирует на новости, регуляторные решения и действия крупных держателей («китов»). Это делает его заметно более волатильным, чем, например, рынок акций.',
      en: 'The crypto market trades around the clock, has relatively low liquidity compared to traditional markets, and reacts strongly to news, regulatory decisions, and the actions of large holders ("whales"). This makes it noticeably more volatile than, for example, the stock market.',
    },
  },
];
