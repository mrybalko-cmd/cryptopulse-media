export interface GlossaryTerm {
  slug: string;
  term: { ru: string; en: string };
  definition: { ru: string; en: string };
}

export const GLOSSARY: GlossaryTerm[] = [
  {
    slug: 'bitcoin',
    term: { ru: 'Биткоин', en: 'Bitcoin' },
    definition: {
      ru: 'Первая и самая известная криптовалюта, созданная в 2009 году анонимным автором (или группой) под псевдонимом Сатоши Накамото. Работает без центрального банка или посредников — все транзакции записываются в общедоступный блокчейн.',
      en: 'The first and most well-known cryptocurrency, created in 2009 by an anonymous author (or group) under the pseudonym Satoshi Nakamoto. It works without a central bank or intermediaries — every transaction is recorded on a public blockchain.',
    },
  },
  {
    slug: 'blockchain',
    term: { ru: 'Блокчейн', en: 'Blockchain' },
    definition: {
      ru: 'Распределённая база данных, состоящая из цепочки блоков с информацией о транзакциях. Каждый новый блок ссылается на предыдущий, что делает изменение прошлых записей практически невозможным без согласия всей сети.',
      en: 'A distributed database made up of a chain of blocks containing transaction data. Each new block references the previous one, which makes altering past records nearly impossible without the agreement of the entire network.',
    },
  },
  {
    slug: 'hash',
    term: { ru: 'Хеш', en: 'Hash' },
    definition: {
      ru: 'Уникальная строка фиксированной длины, которая получается из любых данных с помощью математической функции. Малейшее изменение исходных данных полностью меняет хеш, поэтому он используется для подтверждения целостности блоков и транзакций.',
      en: 'A unique, fixed-length string produced from any input data using a mathematical function. The smallest change to the input completely changes the hash, which is why it is used to verify the integrity of blocks and transactions.',
    },
  },
  {
    slug: 'transaction',
    term: { ru: 'Транзакция', en: 'Transaction' },
    definition: {
      ru: 'Запись о переводе криптовалюты с одного адреса на другой. После подтверждения сетью транзакция становится частью блокчейна и её уже нельзя отменить или изменить.',
      en: 'A record of a cryptocurrency transfer from one address to another. Once confirmed by the network, a transaction becomes part of the blockchain and can no longer be reversed or altered.',
    },
  },
  {
    slug: 'wallet',
    term: { ru: 'Кошелёк', en: 'Wallet' },
    definition: {
      ru: 'Программа или устройство для хранения приватных ключей, которые дают доступ к криптовалюте на блокчейне. Сама криптовалюта физически не «лежит» в кошельке — он лишь хранит ключи для управления ею.',
      en: 'Software or a device for storing the private keys that give access to cryptocurrency on the blockchain. The coins themselves are not physically "stored" in the wallet — it only holds the keys needed to control them.',
    },
  },
  {
    slug: 'private-key',
    term: { ru: 'Приватный ключ', en: 'Private key' },
    definition: {
      ru: 'Секретный код, который доказывает право собственности на криптовалюту и позволяет подписывать транзакции. Тот, кто знает приватный ключ, полностью контролирует средства — его нельзя никому передавать.',
      en: 'A secret code that proves ownership of cryptocurrency and allows you to sign transactions. Whoever knows the private key has full control over the funds — it should never be shared with anyone.',
    },
  },
  {
    slug: 'public-key',
    term: { ru: 'Публичный ключ', en: 'Public key' },
    definition: {
      ru: 'Криптографический ключ, из которого формируется адрес кошелька для получения средств. В отличие от приватного ключа, его можно свободно показывать другим — это аналог номера банковского счёта.',
      en: 'A cryptographic key from which a wallet address is derived to receive funds. Unlike a private key, it can be safely shared with others — similar to a bank account number.',
    },
  },
  {
    slug: 'seed-phrase',
    term: { ru: 'Сид-фраза', en: 'Seed phrase' },
    definition: {
      ru: 'Набор из 12–24 слов, из которого можно восстановить все приватные ключи кошелька. Это самая важная вещь, которую нужно защитить: тот, кто знает сид-фразу, может полностью забрать ваши средства.',
      en: 'A set of 12–24 words from which all of a wallet\'s private keys can be restored. It is the single most important thing to protect: anyone who knows your seed phrase can take full control of your funds.',
    },
  },
  {
    slug: 'mining',
    term: { ru: 'Майнинг', en: 'Mining' },
    definition: {
      ru: 'Процесс подтверждения транзакций и создания новых блоков в сетях с механизмом Proof-of-Work, например в Bitcoin. Майнеры решают сложные вычислительные задачи и получают вознаграждение в криптовалюте.',
      en: 'The process of verifying transactions and creating new blocks in Proof-of-Work networks, such as Bitcoin. Miners solve complex computational puzzles and are rewarded with cryptocurrency.',
    },
  },
  {
    slug: 'node',
    term: { ru: 'Нода', en: 'Node' },
    definition: {
      ru: 'Компьютер, подключённый к сети блокчейна, который хранит копию реестра и проверяет транзакции по правилам протокола. Чем больше независимых нод, тем устойчивее и децентрализованнее сеть.',
      en: 'A computer connected to a blockchain network that stores a copy of the ledger and validates transactions according to the protocol\'s rules. The more independent nodes there are, the more resilient and decentralized the network.',
    },
  },
  {
    slug: 'smart-contract',
    term: { ru: 'Смарт-контракт', en: 'Smart contract' },
    definition: {
      ru: 'Программа, которая автоматически выполняется на блокчейне при выполнении заданных условий, без участия посредников. Лежит в основе большинства приложений DeFi, NFT и DAO.',
      en: 'A program that automatically executes on the blockchain once predefined conditions are met, without intermediaries. It powers most DeFi, NFT, and DAO applications.',
    },
  },
  {
    slug: 'gas-fee',
    term: { ru: 'Газ (комиссия)', en: 'Gas fee' },
    definition: {
      ru: 'Плата за выполнение транзакции или смарт-контракта в сети блокчейна, например Ethereum. Размер газа зависит от загруженности сети — чем она выше, тем дороже обходится транзакция.',
      en: 'The fee paid for executing a transaction or smart contract on a blockchain network such as Ethereum. The gas amount depends on network congestion — the busier the network, the more expensive a transaction becomes.',
    },
  },
  {
    slug: 'gwei',
    term: { ru: 'Gwei', en: 'Gwei' },
    definition: {
      ru: 'Мельчайшая единица измерения эфира (ETH), в которой обычно указывается размер комиссии за газ. Один ETH равен миллиарду gwei.',
      en: 'A tiny denomination of ether (ETH) commonly used to express gas fees. One ETH equals one billion gwei.',
    },
  },
  {
    slug: 'altcoin',
    term: { ru: 'Альткоин', en: 'Altcoin' },
    definition: {
      ru: 'Любая криптовалюта, отличная от биткоина. Термин объединяет тысячи проектов — от Ethereum и Solana до небольших нишевых токенов.',
      en: 'Any cryptocurrency other than Bitcoin. The term covers thousands of projects — from Ethereum and Solana to small niche tokens.',
    },
  },
  {
    slug: 'stablecoin',
    term: { ru: 'Стейблкоин', en: 'Stablecoin' },
    definition: {
      ru: 'Криптовалюта, курс которой привязан к стабильному активу — чаще всего к доллару США. Используется для защиты от волатильности и расчётов внутри крипторынка (примеры: USDT, USDC).',
      en: 'A cryptocurrency pegged to a stable asset, most often the US dollar. It is used to avoid volatility and to settle transactions within the crypto market (examples: USDT, USDC).',
    },
  },
  {
    slug: 'defi',
    term: { ru: 'DeFi', en: 'DeFi' },
    definition: {
      ru: 'Децентрализованные финансы — экосистема приложений на блокчейне (кредитование, обмен, страхование), которая работает без банков и других традиционных посредников.',
      en: 'Decentralized Finance — an ecosystem of blockchain applications (lending, trading, insurance) that operates without banks or other traditional intermediaries.',
    },
  },
  {
    slug: 'nft',
    term: { ru: 'NFT', en: 'NFT' },
    definition: {
      ru: 'Невзаимозаменяемый токен (Non-Fungible Token) — уникальная запись в блокчейне, подтверждающая право собственности на конкретный цифровой или физический объект: изображение, музыку, билет и т. д.',
      en: 'A Non-Fungible Token — a unique blockchain record that certifies ownership of a specific digital or physical item, such as artwork, music, or a ticket.',
    },
  },
  {
    slug: 'dex',
    term: { ru: 'DEX (децентрализованная биржа)', en: 'DEX (decentralized exchange)' },
    definition: {
      ru: 'Биржа, на которой сделки проходят напрямую между пользователями через смарт-контракты, без центральной компании-оператора и без передачи средств на хранение третьей стороне.',
      en: 'An exchange where trades happen directly between users via smart contracts, without a central operating company and without depositing funds with a third party.',
    },
  },
  {
    slug: 'cex',
    term: { ru: 'CEX (централизованная биржа)', en: 'CEX (centralized exchange)' },
    definition: {
      ru: 'Биржа, управляемая компанией, которая хранит средства пользователей на своих кошельках и обеспечивает ликвидность и сопоставление ордеров (например, Binance, Coinbase).',
      en: 'An exchange run by a company that holds user funds in its own wallets and provides liquidity and order matching (for example, Binance, Coinbase).',
    },
  },
  {
    slug: 'staking',
    term: { ru: 'Стейкинг', en: 'Staking' },
    definition: {
      ru: 'Блокировка криптовалюты для участия в подтверждении транзакций в сетях Proof-of-Stake. В обмен участник получает вознаграждение, но рискует потерять часть средств при нарушении правил сети.',
      en: 'Locking up cryptocurrency to help validate transactions in Proof-of-Stake networks. In return, the participant earns rewards, but risks losing part of the stake if the network\'s rules are broken.',
    },
  },
  {
    slug: 'yield-farming',
    term: { ru: 'Йилд-фарминг', en: 'Yield farming' },
    definition: {
      ru: 'Стратегия в DeFi, при которой пользователь предоставляет свои активы протоколам (например, в пулы ликвидности) ради получения процентного дохода или дополнительных токенов.',
      en: 'A DeFi strategy in which a user supplies assets to protocols (for example, liquidity pools) in order to earn interest income or additional tokens.',
    },
  },
  {
    slug: 'liquidity-pool',
    term: { ru: 'Пул ликвидности', en: 'Liquidity pool' },
    definition: {
      ru: 'Совместный резерв из двух и более токенов, заблокированный в смарт-контракте, который обеспечивает обмен активами на децентрализованных биржах без участия классического ордербука.',
      en: 'A shared reserve of two or more tokens locked in a smart contract that enables asset swaps on decentralized exchanges without a traditional order book.',
    },
  },
  {
    slug: 'market-cap',
    term: { ru: 'Капитализация рынка', en: 'Market cap' },
    definition: {
      ru: 'Общая стоимость всех монет криптовалюты в обращении: цена монеты умноженная на количество монет в обороте. Используется для сравнения размера разных проектов.',
      en: 'The total value of all coins of a cryptocurrency in circulation: the coin price multiplied by the circulating supply. It is used to compare the relative size of different projects.',
    },
  },
  {
    slug: 'ath',
    term: { ru: 'Исторический максимум (ATH)', en: 'ATH (All-Time High)' },
    definition: {
      ru: 'Самая высокая цена, которую когда-либо достигал актив за всю историю торгов.',
      en: 'The highest price an asset has ever reached over its entire trading history.',
    },
  },
  {
    slug: 'fomo',
    term: { ru: 'FOMO', en: 'FOMO' },
    definition: {
      ru: 'Fear of Missing Out — страх упустить выгоду. Эмоциональное состояние, при котором инвестор покупает актив на пике роста из боязни «не успеть», что часто приводит к убыткам.',
      en: 'Fear of Missing Out — the emotional state in which an investor buys an asset near the top of a rally out of fear of "missing the move," which often leads to losses.',
    },
  },
  {
    slug: 'fud',
    term: { ru: 'FUD', en: 'FUD' },
    definition: {
      ru: 'Fear, Uncertainty and Doubt (страх, неопределённость и сомнение) — распространение негативной или пугающей информации о проекте, часто намеренно, чтобы снизить его цену.',
      en: 'Fear, Uncertainty and Doubt — the spread of negative or alarming information about a project, often deliberate, intended to push its price down.',
    },
  },
  {
    slug: 'hodl',
    term: { ru: 'HODL', en: 'HODL' },
    definition: {
      ru: 'Сленговое слово (от опечатки «hold»), обозначающее стратегию долгосрочного удержания криптовалюты несмотря на колебания рынка.',
      en: 'Crypto slang (originating from a typo of "hold") for a strategy of holding cryptocurrency long-term regardless of market swings.',
    },
  },
  {
    slug: 'whale',
    term: { ru: 'Кит', en: 'Whale' },
    definition: {
      ru: 'Инвестор или кошелёк, владеющий очень крупным объёмом криптовалюты. Действия китов (крупные покупки или продажи) способны заметно влиять на цену актива.',
      en: 'An investor or wallet holding a very large amount of cryptocurrency. The actions of whales (large buys or sells) can noticeably move an asset\'s price.',
    },
  },
  {
    slug: 'halving',
    term: { ru: 'Халвинг', en: 'Halving' },
    definition: {
      ru: 'Запрограммированное событие в сети Bitcoin (и некоторых других монет), при котором вознаграждение майнерам за блок уменьшается вдвое. Происходит примерно раз в четыре года.',
      en: 'A programmed event in the Bitcoin network (and some other coins) where the block reward paid to miners is cut in half. It happens roughly once every four years.',
    },
  },
  {
    slug: 'hard-fork',
    term: { ru: 'Хард-форк', en: 'Hard fork' },
    definition: {
      ru: 'Несовместимое с предыдущей версией изменение протокола блокчейна, которое разделяет сеть на старую и новую ветки (пример: разделение Bitcoin и Bitcoin Cash).',
      en: 'A backwards-incompatible change to a blockchain\'s protocol that splits the network into an old and a new chain (example: the split of Bitcoin and Bitcoin Cash).',
    },
  },
  {
    slug: 'soft-fork',
    term: { ru: 'Софт-форк', en: 'Soft fork' },
    definition: {
      ru: 'Обратно совместимое обновление правил протокола, при котором старые ноды продолжают работать в новой сети без необходимости обязательного обновления.',
      en: 'A backwards-compatible update to a protocol\'s rules, where old nodes can continue operating on the upgraded network without being forced to update.',
    },
  },
  {
    slug: 'consensus-mechanism',
    term: { ru: 'Механизм консенсуса', en: 'Consensus mechanism' },
    definition: {
      ru: 'Набор правил, по которым участники децентрализованной сети согласовывают, какая версия блокчейна является правильной (например, Proof-of-Work или Proof-of-Stake).',
      en: 'A set of rules by which participants in a decentralized network agree on which version of the blockchain is valid (for example, Proof-of-Work or Proof-of-Stake).',
    },
  },
  {
    slug: 'proof-of-work',
    term: { ru: 'Proof-of-Work (PoW)', en: 'Proof-of-Work (PoW)' },
    definition: {
      ru: 'Механизм консенсуса, в котором майнеры доказывают вычислительную работу, чтобы добавить новый блок. Используется, например, в Bitcoin; требует значительных энергозатрат.',
      en: 'A consensus mechanism in which miners prove they performed computational work in order to add a new block. Used by Bitcoin, among others; it requires significant energy.',
    },
  },
  {
    slug: 'proof-of-stake',
    term: { ru: 'Proof-of-Stake (PoS)', en: 'Proof-of-Stake (PoS)' },
    definition: {
      ru: 'Механизм консенсуса, в котором право подтверждать блоки получают участники, заблокировавшие (застейкавшие) свою криптовалюту в качестве залога. Энергоэффективнее, чем Proof-of-Work.',
      en: 'A consensus mechanism in which the right to validate blocks goes to participants who have locked up (staked) their cryptocurrency as collateral. It is more energy-efficient than Proof-of-Work.',
    },
  },
  {
    slug: 'erc-20',
    term: { ru: 'ERC-20', en: 'ERC-20' },
    definition: {
      ru: 'Технический стандарт токенов в сети Ethereum, который определяет общие правила для создания взаимозаменяемых токенов. Подавляющее большинство токенов на Ethereum выпущены по этому стандарту.',
      en: 'A technical token standard on the Ethereum network that defines common rules for creating fungible tokens. The vast majority of tokens on Ethereum are issued under this standard.',
    },
  },
  {
    slug: 'trc-20',
    term: { ru: 'TRC-20', en: 'TRC-20' },
    definition: {
      ru: 'Аналог стандарта ERC-20, но в сети TRON. Часто используется для переводов USDT — комиссии в сети TRON, как правило, заметно ниже, чем в Ethereum.',
      en: 'An equivalent of the ERC-20 standard, but on the TRON network. It is widely used for USDT transfers — fees on TRON are typically much lower than on Ethereum.',
    },
  },
  {
    slug: 'bep-20',
    term: { ru: 'BEP-20', en: 'BEP-20' },
    definition: {
      ru: 'Стандарт токенов сети BNB Smart Chain (BSC), совместимый по структуре с ERC-20, но с более низкими комиссиями за транзакции.',
      en: 'A token standard on the BNB Smart Chain (BSC), structurally compatible with ERC-20 but with lower transaction fees.',
    },
  },
  {
    slug: 'cold-wallet',
    term: { ru: 'Холодный кошелёк', en: 'Cold wallet' },
    definition: {
      ru: 'Кошелёк, приватные ключи которого хранятся offline (например, на отдельном устройстве). Считается самым безопасным способом долгосрочного хранения крупных сумм.',
      en: 'A wallet whose private keys are stored offline (for example, on a dedicated device). It is considered the safest way to hold large amounts long-term.',
    },
  },
  {
    slug: 'hot-wallet',
    term: { ru: 'Горячий кошелёк', en: 'Hot wallet' },
    definition: {
      ru: 'Кошелёк, постоянно подключённый к интернету (приложение или браузерное расширение). Удобен для частых операций, но более уязвим для взлома, чем холодный кошелёк.',
      en: 'A wallet that is always connected to the internet (an app or browser extension). Convenient for frequent transactions, but more vulnerable to hacking than a cold wallet.',
    },
  },
  {
    slug: 'custodial-wallet',
    term: { ru: 'Кастодиальный кошелёк', en: 'Custodial wallet' },
    definition: {
      ru: 'Кошелёк, приватные ключи которого хранит третья сторона (например, биржа), а не сам пользователь. Действует принцип «не твои ключи — не твои монеты».',
      en: 'A wallet whose private keys are held by a third party (such as an exchange) rather than the user. The principle "not your keys, not your coins" applies.',
    },
  },
  {
    slug: 'non-custodial-wallet',
    term: { ru: 'Некастодиальный кошелёк', en: 'Non-custodial wallet' },
    definition: {
      ru: 'Кошелёк, в котором приватные ключи полностью контролирует сам пользователь, без посредников. Даёт больше ответственности, но и больше контроля над средствами.',
      en: 'A wallet in which the private keys are fully controlled by the user, with no intermediary. It carries more responsibility, but also more control over the funds.',
    },
  },
  {
    slug: 'kyc',
    term: { ru: 'KYC', en: 'KYC' },
    definition: {
      ru: 'Know Your Customer («знай своего клиента») — процедура проверки личности пользователя, которую проходят на регулируемых биржах для соответствия законодательству.',
      en: 'Know Your Customer — an identity-verification procedure that users complete on regulated exchanges to comply with the law.',
    },
  },
  {
    slug: 'aml',
    term: { ru: 'AML', en: 'AML' },
    definition: {
      ru: 'Anti-Money Laundering («противодействие отмыванию денег») — комплекс политик и процедур, которые биржи и финансовые организации применяют для предотвращения незаконных финансовых операций.',
      en: 'Anti-Money Laundering — a set of policies and procedures that exchanges and financial institutions use to prevent illicit financial activity.',
    },
  },
  {
    slug: 'airdrop',
    term: { ru: 'Airdrop (раздача токенов)', en: 'Airdrop' },
    definition: {
      ru: 'Бесплатная раздача токенов проектом, обычно в рамках маркетинга или вознаграждения ранних пользователей. Будьте осторожны: под видом airdrop часто маскируют фишинговые схемы.',
      en: 'A free distribution of tokens by a project, usually for marketing purposes or to reward early users. Be cautious: phishing schemes are often disguised as airdrops.',
    },
  },
  {
    slug: 'ico',
    term: { ru: 'ICO', en: 'ICO' },
    definition: {
      ru: 'Initial Coin Offering — первичное размещение токенов, способ сбора средств для проекта в обмен на его токены, по аналогии с IPO на фондовом рынке.',
      en: 'Initial Coin Offering — a fundraising method where a project sells its tokens to investors, broadly analogous to an IPO on the stock market.',
    },
  },
  {
    slug: 'ido',
    term: { ru: 'IDO', en: 'IDO' },
    definition: {
      ru: 'Initial DEX Offering — первичное размещение токена сразу на децентрализованной бирже, без участия централизованного посредника.',
      en: 'Initial DEX Offering — a token launch that takes place directly on a decentralized exchange, without a centralized intermediary.',
    },
  },
  {
    slug: 'whitepaper',
    term: { ru: 'Whitepaper (уайтпейпер)', en: 'Whitepaper' },
    definition: {
      ru: 'Официальный документ проекта, в котором описаны его технология, цели, экономика токена и команда. Первое, что стоит изучить перед инвестицией в новый проект.',
      en: 'A project\'s official document describing its technology, goals, token economics, and team. It is the first thing worth reading before investing in a new project.',
    },
  },
  {
    slug: 'tokenomics',
    term: { ru: 'Токеномика', en: 'Tokenomics' },
    definition: {
      ru: 'Экономическая модель токена: общий объём эмиссии, распределение между командой и инвесторами, механизмы сжигания или эмиссии новых токенов.',
      en: 'A token\'s economic model: total supply, distribution between the team and investors, and mechanisms for burning or minting new tokens.',
    },
  },
  {
    slug: 'slippage',
    term: { ru: 'Слиппедж (проскальзывание)', en: 'Slippage' },
    definition: {
      ru: 'Разница между ожидаемой и фактической ценой исполнения сделки, обычно возникающая при низкой ликвидности или высокой волатильности рынка.',
      en: 'The difference between the expected price of a trade and the price at which it is actually executed, typically caused by low liquidity or high market volatility.',
    },
  },
  {
    slug: 'order-book',
    term: { ru: 'Книга ордеров (ордербук)', en: 'Order book' },
    definition: {
      ru: 'Список всех открытых заявок на покупку и продажу актива на бирже, отсортированных по цене. Показывает текущий спрос и предложение в реальном времени.',
      en: 'A list of all open buy and sell orders for an asset on an exchange, sorted by price. It shows real-time supply and demand.',
    },
  },
  {
    slug: 'limit-order',
    term: { ru: 'Лимитный ордер', en: 'Limit order' },
    definition: {
      ru: 'Заявка на покупку или продажу по конкретной указанной цене или лучше. Исполняется только тогда, когда рынок достигает этой цены.',
      en: 'An order to buy or sell at a specific price or better. It only executes once the market reaches that price.',
    },
  },
  {
    slug: 'market-order',
    term: { ru: 'Рыночный ордер', en: 'Market order' },
    definition: {
      ru: 'Заявка на немедленную покупку или продажу актива по лучшей доступной цене на рынке прямо сейчас.',
      en: 'An order to buy or sell an asset immediately at the best price currently available in the market.',
    },
  },
  {
    slug: 'leverage',
    term: { ru: 'Кредитное плечо', en: 'Leverage' },
    definition: {
      ru: 'Использование заёмных средств для увеличения размера позиции. Плечо умножает не только потенциальную прибыль, но и потенциальные убытки — высокорискованный инструмент.',
      en: 'The use of borrowed funds to increase the size of a trading position. Leverage multiplies both potential profit and potential losses — a high-risk tool.',
    },
  },
  {
    slug: 'liquidation',
    term: { ru: 'Ликвидация позиции', en: 'Liquidation' },
    definition: {
      ru: 'Принудительное закрытие торговой позиции с плечом биржей, когда убытки приближаются к размеру внесённого залога. Приводит к потере части или всех вложенных средств.',
      en: 'The forced closure of a leveraged trading position by the exchange when losses approach the size of the deposited collateral. It results in losing part or all of the funds invested.',
    },
  },
  {
    slug: 'rug-pull',
    term: { ru: 'Раг-пул', en: 'Rug pull' },
    definition: {
      ru: 'Мошенническая схема, при которой создатели проекта резко выводят всю ликвидность или продают свои токены, обрушивая цену и оставляя инвесторов без средств.',
      en: 'A scam in which a project\'s creators suddenly withdraw all liquidity or dump their tokens, crashing the price and leaving investors with worthless holdings.',
    },
  },
  {
    slug: 'p2p',
    term: { ru: 'P2P', en: 'P2P' },
    definition: {
      ru: 'Peer-to-peer («равный равному») — прямой обмен криптовалютой между двумя пользователями, часто за фиатные деньги, без участия централизованного посредника в самой сделке.',
      en: 'Peer-to-peer — a direct cryptocurrency exchange between two users, often for fiat money, without a centralized intermediary handling the trade itself.',
    },
  },
  {
    slug: 'layer-2',
    term: { ru: 'Layer 2 (уровень 2)', en: 'Layer 2' },
    definition: {
      ru: 'Дополнительный протокол, построенный поверх основного блокчейна (Layer 1), который ускоряет транзакции и снижает комиссии, перенося часть вычислений за пределы основной сети.',
      en: 'A secondary protocol built on top of a base blockchain (Layer 1) that speeds up transactions and lowers fees by moving some computation off the main network.',
    },
  },
  {
    slug: 'bridge',
    term: { ru: 'Блокчейн-мост', en: 'Bridge' },
    definition: {
      ru: 'Протокол, позволяющий переводить активы и данные между разными блокчейнами, которые изначально несовместимы друг с другом.',
      en: 'A protocol that allows assets and data to move between different blockchains that are not natively compatible with one another.',
    },
  },
  {
    slug: 'dao',
    term: { ru: 'DAO', en: 'DAO' },
    definition: {
      ru: 'Decentralized Autonomous Organization («децентрализованная автономная организация») — сообщество, которое принимает решения путём голосования держателей токенов, а правила работы закреплены в смарт-контрактах.',
      en: 'Decentralized Autonomous Organization — a community that makes decisions through token-holder voting, with its rules encoded in smart contracts.',
    },
  },
  {
    slug: 'nonce',
    term: { ru: 'Nonce', en: 'Nonce' },
    definition: {
      ru: 'Число, используемое один раз, которое майнеры подбирают при добыче блока в сетях Proof-of-Work, а также счётчик, предотвращающий повторное использование одной и той же транзакции на аккаунте.',
      en: 'A number used once, which miners search for when mining a block in Proof-of-Work networks; also a counter that prevents a transaction from being replayed on an account.',
    },
  },
  {
    slug: 'block-explorer',
    term: { ru: 'Блокчейн-эксплорер', en: 'Block explorer' },
    definition: {
      ru: 'Веб-сервис, позволяющий просматривать блоки, транзакции и адреса в блокчейне в режиме реального времени (например, Etherscan для Ethereum).',
      en: 'A web service that lets you browse blocks, transactions, and addresses on a blockchain in real time (for example, Etherscan for Ethereum).',
    },
  },
  {
    slug: 'satoshi',
    term: { ru: 'Сатоши', en: 'Satoshi' },
    definition: {
      ru: 'Наименьшая единица биткоина, равная одной стомиллионной (0.00000001) BTC. Названа в честь создателя биткоина.',
      en: 'The smallest unit of Bitcoin, equal to one hundred-millionth (0.00000001) of a BTC. Named after Bitcoin\'s creator.',
    },
  },
  {
    slug: 'fiat',
    term: { ru: 'Фиат', en: 'Fiat' },
    definition: {
      ru: 'Традиционная государственная валюта, не обеспеченная физическим товаром, например доллар, евро или гривна — в противоположность криптовалюте.',
      en: 'Traditional government-issued currency not backed by a physical commodity, such as the US dollar, euro, or Czech koruna — as opposed to cryptocurrency.',
    },
  },
  {
    slug: 'exchange',
    term: { ru: 'Биржа', en: 'Exchange' },
    definition: {
      ru: 'Платформа для покупки, продажи и обмена криптовалют. Может быть централизованной (CEX) или децентрализованной (DEX).',
      en: 'A platform for buying, selling, and trading cryptocurrencies. It can be centralized (CEX) or decentralized (DEX).',
    },
  },
  {
    slug: 'genesis-block',
    term: { ru: 'Генезис-блок', en: 'Genesis block' },
    definition: {
      ru: 'Самый первый блок в блокчейне, с которого начинается вся цепочка. У биткоина генезис-блок был создан 3 января 2009 года.',
      en: 'The very first block in a blockchain, from which the entire chain begins. Bitcoin\'s genesis block was created on January 3, 2009.',
    },
  },
];
