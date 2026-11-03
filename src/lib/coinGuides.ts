/** One curated entry point in a coin's past. Lives here, with the data, rather
 *  than inside a component: the reference prices are content, and the component
 *  that used to own this type is being replaced. */
export interface InvestmentReference {
  yearsAgo: number;
  year: number;
  price: number;
  label: { ru: string; en: string };
  note: { ru: string; en: string };
}

export interface CoinFaqItem {
  question: { ru: string; en: string };
  answer: { ru: string; en: string };
}

export interface CoinStat {
  label: { ru: string; en: string };
  /** Bilingual where the fact itself differs by language — «Без лимита» and
   *  «Unlimited» are the same fact stated twice, not a label. */
  value: string | { ru: string; en: string };
}

export interface CoinGuideData {
  investmentReference: InvestmentReference[];
  faq: CoinFaqItem[];
  stats: CoinStat[];
  glossaryTerms: { slug: string; label: { ru: string; en: string } }[];
}

export const COIN_GUIDES: Record<string, CoinGuideData> = {
  polygon: {
    stats: [
      { label: { ru: 'Год создания', en: 'Created' }, value: '2017' },
      { label: { ru: 'Создатели', en: 'Creators' }, value: 'Jaynti Kanani, Sandeep Nailwal, Anurag Arjun' },
      { label: { ru: 'Тип сети', en: 'Network type' }, value: 'Ethereum L2 / sidechain' },
      { label: { ru: 'Токен', en: 'Token' }, value: 'POL (ex-MATIC)' },
    ],
    investmentReference: [
      { yearsAgo: 5, year: 2021, price: 0.018, label: { ru: '5 лет назад (нач. 2021)', en: '5 years ago (early 2021)' }, note: { ru: 'До взрывного роста', en: 'Before the explosive rally' } },
      { yearsAgo: 3, year: 2023, price: 0.85, label: { ru: '3 года назад (2023)', en: '3 years ago (2023)' }, note: { ru: 'После спада с ATH', en: 'After the ATH pullback' } },
      { yearsAgo: 1, year: 2025, price: 0.35, label: { ru: '1 год назад (2025)', en: '1 year ago (2025)' }, note: { ru: 'Период ребрендинга в POL', en: 'During the POL rebrand' } },
    ],
    faq: [
      {
        question: { ru: 'Чем POL отличается от MATIC?', en: 'What\'s the difference between POL and MATIC?' },
        answer: {
          ru: 'POL — это новый токен, заменивший MATIC в рамках обновления «Polygon 2.0». Обмен происходит 1:1, а POL станет базовым токеном для всей экосистемы связанных блокчейнов Polygon (AggLayer), а не только одной сети.',
          en: 'POL is the new token that replaced MATIC as part of the "Polygon 2.0" upgrade. The swap happens 1:1, and POL is designed to become the base token for Polygon\'s entire ecosystem of connected chains (AggLayer), not just a single network.',
        },
      },
      {
        question: { ru: 'Зачем нужен Polygon, если есть Ethereum?', en: 'Why does Polygon exist if Ethereum already does?' },
        answer: {
          ru: 'Ethereum сам по себе медленный и дорогой для повседневных транзакций. Polygon работает поверх Ethereum как более быстрая и дешёвая сеть, при этом сохраняя связь с безопасностью и ликвидностью Ethereum — это называется решением второго уровня (Layer 2) или сайдчейном.',
          en: 'Ethereum on its own is slow and expensive for everyday transactions. Polygon runs on top of Ethereum as a faster, cheaper network while still tapping into Ethereum\'s security and liquidity — this is what\'s known as a Layer 2 or sidechain solution.',
        },
      },
      {
        question: { ru: 'Кто использует Polygon?', en: 'Who uses Polygon?' },
        answer: {
          ru: 'Polygon — одна из самых популярных сетей для NFT и игровых проектов благодаря низким комиссиям. Крупные бренды, включая Starbucks, Reddit и Nike, запускали проекты именно на Polygon.',
          en: 'Polygon is one of the most popular networks for NFTs and gaming projects thanks to its low fees. Major brands including Starbucks, Reddit, and Nike have launched projects on Polygon specifically.',
        },
      },
    ],
    glossaryTerms: [
      { slug: 'blockchain', label: { ru: 'Блокчейн', en: 'Blockchain' } },
      { slug: 'wallet', label: { ru: 'Кошелёк', en: 'Wallet' } },
      { slug: 'defi', label: { ru: 'DeFi', en: 'DeFi' } },
    ],
  },

  uniswap: {
    stats: [
      { label: { ru: 'Год создания', en: 'Created' }, value: '2018' },
      { label: { ru: 'Создатель', en: 'Creator' }, value: 'Hayden Adams' },
      { label: { ru: 'Тип', en: 'Type' }, value: 'DEX (decentralized exchange)' },
      { label: { ru: 'Токен запущен', en: 'Token launched' }, value: 'September 2020' },
    ],
    investmentReference: [
      { yearsAgo: 5, year: 2021, price: 30, label: { ru: '5 лет назад (2021)', en: '5 years ago (2021)' }, note: { ru: 'Близко к ATH', en: 'Near the all-time high' } },
      { yearsAgo: 3, year: 2023, price: 5.5, label: { ru: '3 года назад (2023)', en: '3 years ago (2023)' }, note: { ru: 'После крипто-зимы', en: 'After the crypto winter' } },
      { yearsAgo: 1, year: 2025, price: 8, label: { ru: '1 год назад (2025)', en: '1 year ago (2025)' }, note: { ru: 'Промежуточный уровень', en: 'Mid-cycle level' } },
    ],
    faq: [
      {
        question: { ru: 'Что такое Uniswap?', en: 'What is Uniswap?' },
        answer: {
          ru: 'Uniswap — крупнейшая децентрализованная биржа (DEX) на Ethereum. В отличие от Binance или Coinbase, здесь нет центральной компании, которая держит ваши деньги — сделки проходят напрямую через смарт-контракты и пулы ликвидности.',
          en: 'Uniswap is the largest decentralized exchange (DEX) on Ethereum. Unlike Binance or Coinbase, there\'s no central company holding your funds — trades happen directly through smart contracts and liquidity pools.',
        },
      },
      {
        question: { ru: 'Что за история с раздачей токенов в 2020 году?', en: 'What was the 2020 token airdrop story?' },
        answer: {
          ru: '16 сентября 2020 года Uniswap раздал по 400 токенов UNI каждому кошельку, который хоть раз пользовался протоколом до этой даты. На пике цены это составляло около $18 000 бесплатно — одна из крупнейших раздач в истории криптовалют.',
          en: 'On September 16, 2020, Uniswap airdropped 400 UNI tokens to every wallet that had ever used the protocol before that date. At the token\'s peak price, that was worth around $18,000 for free — one of the largest airdrops in crypto history.',
        },
      },
      {
        question: { ru: 'Что означает механизм AMM?', en: 'What does the AMM mechanism mean?' },
        answer: {
          ru: 'Automated Market Maker (автоматический маркет-мейкер) — модель, в которой цену актива определяет математическая формула и соотношение токенов в пуле ликвидности, а не книга ордеров, как на обычных биржах. Именно эту идею популяризировал Uniswap.',
          en: 'An Automated Market Maker (AMM) is a model where an asset\'s price is set by a mathematical formula and the ratio of tokens in a liquidity pool, rather than an order book like traditional exchanges use. Uniswap is the project that popularized this idea.',
        },
      },
    ],
    glossaryTerms: [
      { slug: 'defi', label: { ru: 'DeFi', en: 'DeFi' } },
      { slug: 'blockchain', label: { ru: 'Блокчейн', en: 'Blockchain' } },
      { slug: 'wallet', label: { ru: 'Кошелёк', en: 'Wallet' } },
    ],
  },

  cosmos: {
    stats: [
      { label: { ru: 'Уайтпейпер', en: 'Whitepaper' }, value: '2016' },
      { label: { ru: 'Создатели', en: 'Creators' }, value: 'Jae Kwon, Ethan Buchman' },
      { label: { ru: 'Мейннет', en: 'Mainnet' }, value: 'March 2019' },
      { label: { ru: 'Концепция', en: 'Concept' }, value: '"Internet of Blockchains"' },
    ],
    investmentReference: [
      { yearsAgo: 5, year: 2021, price: 25, label: { ru: '5 лет назад (2021)', en: '5 years ago (2021)' }, note: { ru: 'Перед ралли к ATH', en: 'Before the ATH rally' } },
      { yearsAgo: 3, year: 2023, price: 10, label: { ru: '3 года назад (2023)', en: '3 years ago (2023)' }, note: { ru: 'После падения с пика', en: 'After the peak decline' } },
      { yearsAgo: 1, year: 2025, price: 5, label: { ru: '1 год назад (2025)', en: '1 year ago (2025)' }, note: { ru: 'Промежуточный уровень', en: 'Mid-cycle level' } },
    ],
    faq: [
      {
        question: { ru: 'Что означает «Интернет блокчейнов»?', en: 'What does "Internet of Blockchains" mean?' },
        answer: {
          ru: 'Cosmos построен так, чтобы разные независимые блокчейны могли общаться друг с другом и обмениваться активами через протокол IBC (Inter-Blockchain Communication), а не существовать изолированно, как большинство сетей.',
          en: 'Cosmos is built so that separate, independent blockchains can communicate with each other and exchange assets through the IBC (Inter-Blockchain Communication) protocol, instead of existing in isolation like most networks.',
        },
      },
      {
        question: { ru: 'Кто создал Cosmos?', en: 'Who created Cosmos?' },
        answer: {
          ru: 'Проект начался в 2014 году с компании Tendermint, основанной Джеем Квоном (Jae Kwon). В 2016 году вместе с Итаном Бьюкененом (Ethan Buchman) они опубликовали уайтпейпер Cosmos, а в апреле 2017 года провели ICO, собрав $17 млн менее чем за полчаса.',
          en: 'The project began in 2014 with Tendermint, founded by Jae Kwon. In 2016, together with Ethan Buchman, they published the Cosmos whitepaper, and in April 2017 held an ICO that raised $17 million in under 30 minutes.',
        },
      },
      {
        question: { ru: 'Какие проекты построены на Cosmos SDK?', en: 'What projects are built on the Cosmos SDK?' },
        answer: {
          ru: 'Десятки независимых блокчейнов используют Cosmos SDK как основу, включая Binance Chain, Osmosis, Celestia и Injective — каждый со своим собственным токеном, но с возможностью подключения к сети Cosmos через IBC.',
          en: 'Dozens of independent blockchains use the Cosmos SDK as their foundation, including Binance Chain, Osmosis, Celestia, and Injective — each with its own token, but able to connect to the Cosmos network via IBC.',
        },
      },
    ],
    glossaryTerms: [
      { slug: 'blockchain', label: { ru: 'Блокчейн', en: 'Blockchain' } },
      { slug: 'altcoin', label: { ru: 'Альткоин', en: 'Altcoin' } },
      { slug: 'wallet', label: { ru: 'Кошелёк', en: 'Wallet' } },
    ],
  },

  stellar: {
    stats: [
      { label: { ru: 'Год создания', en: 'Created' }, value: '2014' },
      { label: { ru: 'Создатели', en: 'Creators' }, value: 'Jed McCaleb, Joyce Kim' },
      { label: { ru: 'Запуск сети', en: 'Network launch' }, value: 'April 2015' },
      { label: { ru: 'Организация', en: 'Organization' }, value: 'Stellar Development Foundation' },
    ],
    investmentReference: [
      { yearsAgo: 8, year: 2018, price: 0.30, label: { ru: '8 лет назад (2018)', en: '8 years ago (2018)' }, note: { ru: 'После ATH начала года', en: 'After the year\'s ATH' } },
      { yearsAgo: 5, year: 2021, price: 0.25, label: { ru: '5 лет назад (2021)', en: '5 years ago (2021)' }, note: { ru: 'Спокойный период', en: 'A quiet period' } },
      { yearsAgo: 2, year: 2024, price: 0.11, label: { ru: '2 года назад (2024)', en: '2 years ago (2024)' }, note: { ru: 'До роста интереса к RWA', en: 'Before RWA interest picked up' } },
    ],
    faq: [
      {
        question: { ru: 'Кто создал Stellar?', en: 'Who created Stellar?' },
        answer: {
          ru: 'Stellar основал в 2014 году Джед Маккалеб (Jed McCaleb) — тот же человек, что ранее основал биржу Mt. Gox и стоял у истоков Ripple. Он покинул Ripple из-за разногласий и запустил Stellar вместе с Джойс Ким как некоммерческий проект.',
          en: 'Stellar was founded in 2014 by Jed McCaleb — the same person who earlier founded the Mt. Gox exchange and co-founded Ripple. He left Ripple over disagreements and launched Stellar together with Joyce Kim as a non-profit project.',
        },
      },
      {
        question: { ru: 'Чем Stellar отличается от Ripple (XRP)?', en: 'How is Stellar different from Ripple (XRP)?' },
        answer: {
          ru: 'Оба проекта решают похожую задачу — быстрые дешёвые международные переводы — но Stellar с самого начала ориентирован на некоммерческие и социальные цели (доступ к финансам для непереведённого населения), тогда как Ripple работает как коммерческая компания в основном с банками.',
          en: 'Both projects solve a similar problem — fast, cheap cross-border transfers — but Stellar has been oriented toward non-profit and social goals (financial access for the unbanked) from the start, while Ripple operates as a for-profit company working mainly with banks.',
        },
      },
      {
        question: { ru: 'Для чего сейчас используется Stellar?', en: 'What is Stellar used for today?' },
        answer: {
          ru: 'В последние годы Stellar активно применяется для токенизации реальных активов (RWA) — например, партнёрство с Franklin Templeton по выпуску токенизированного фонда денежного рынка прямо в сети Stellar.',
          en: 'In recent years, Stellar has been actively used for real-world asset (RWA) tokenization — for example, its partnership with Franklin Templeton to issue a tokenized money market fund directly on the Stellar network.',
        },
      },
    ],
    glossaryTerms: [
      { slug: 'blockchain', label: { ru: 'Блокчейн', en: 'Blockchain' } },
      { slug: 'wallet', label: { ru: 'Кошелёк', en: 'Wallet' } },
      { slug: 'transaction', label: { ru: 'Транзакция', en: 'Transaction' } },
    ],
  },

  monero: {
    stats: [
      { label: { ru: 'Год создания', en: 'Created' }, value: '2014' },
      { label: { ru: 'Происхождение', en: 'Origin' }, value: 'Fork of Bytecoin' },
      { label: { ru: 'Технология приватности', en: 'Privacy tech' }, value: 'Ring signatures, stealth addresses' },
      { label: { ru: 'Эмиссия', en: 'Supply' }, value: 'Uncapped (tail emission)' },
    ],
    investmentReference: [
      { yearsAgo: 8, year: 2018, price: 250, label: { ru: '8 лет назад (2018)', en: '8 years ago (2018)' }, note: { ru: 'После ATH начала года', en: 'After the year\'s ATH' } },
      { yearsAgo: 5, year: 2021, price: 150, label: { ru: '5 лет назад (2021)', en: '5 years ago (2021)' }, note: { ru: 'Стабильный период', en: 'A stable period' } },
      { yearsAgo: 2, year: 2024, price: 160, label: { ru: '2 года назад (2024)', en: '2 years ago (2024)' }, note: { ru: 'До ужесточения делистингов', en: 'Before delisting pressure increased' } },
    ],
    faq: [
      {
        question: { ru: 'Чем Monero отличается от Bitcoin?', en: 'How is Monero different from Bitcoin?' },
        answer: {
          ru: 'В Bitcoin все транзакции видны публично в блокчейне — можно проследить, кто кому и сколько отправил. Monero использует кольцевые подписи и скрытые адреса, чтобы сделать отправителя, получателя и сумму транзакции непрозрачными для посторонних.',
          en: 'In Bitcoin, every transaction is publicly visible on the blockchain — you can trace who sent what to whom. Monero uses ring signatures and stealth addresses to keep the sender, recipient, and amount of a transaction hidden from outside observers.',
        },
      },
      {
        question: { ru: 'Легально ли использовать Monero?', en: 'Is it legal to use Monero?' },
        answer: {
          ru: 'Да, владение и использование Monero легально в большинстве стран. Однако из-за требований к прозрачности транзакций (AML) многие крупные биржи делистинговали XMR в ряде юрисдикций, включая часть европейских стран.',
          en: 'Yes, owning and using Monero is legal in most countries. However, due to transaction-transparency (AML) requirements, many major exchanges have delisted XMR in certain jurisdictions, including parts of Europe.',
        },
      },
      {
        question: { ru: 'Почему у Monero нет ограничения эмиссии в 21 миллион?', en: 'Why doesn\'t Monero have a 21-million-style supply cap?' },
        answer: {
          ru: 'После достижения примерно 18,4 млн монет Monero переходит на модель «tail emission» — небольшая постоянная эмиссия (0,6 XMR за блок) продолжается бесконечно, чтобы у майнеров всегда был стимул поддерживать сеть, даже когда комиссии за транзакции будут низкими.',
          en: 'After reaching roughly 18.4 million coins, Monero switches to a "tail emission" model — a small, constant issuance (0.6 XMR per block) continues indefinitely, so miners always have an incentive to secure the network even when transaction fees are low.',
        },
      },
    ],
    glossaryTerms: [
      { slug: 'blockchain', label: { ru: 'Блокчейн', en: 'Blockchain' } },
      { slug: 'mining', label: { ru: 'Майнинг', en: 'Mining' } },
      { slug: 'wallet', label: { ru: 'Кошелёк', en: 'Wallet' } },
    ],
  },

  bch: {
    stats: [
      { label: { ru: 'Дата форка', en: 'Fork date' }, value: 'August 1, 2017' },
      { label: { ru: 'Инициаторы', en: 'Led by' }, value: 'Roger Ver, Jihan Wu, Gavin Andresen' },
      { label: { ru: 'Размер блока', en: 'Block size' }, value: 'Up to 32 MB' },
      { label: { ru: 'Родитель', en: 'Parent chain' }, value: 'Bitcoin (BTC)' },
    ],
    investmentReference: [
      { yearsAgo: 8, year: 2018, price: 1500, label: { ru: '8 лет назад (2018)', en: '8 years ago (2018)' }, note: { ru: 'После ATH конца 2017', en: 'After the late-2017 ATH' } },
      { yearsAgo: 5, year: 2021, price: 550, label: { ru: '5 лет назад (2021)', en: '5 years ago (2021)' }, note: { ru: 'Локальный подъём', en: 'A local high' } },
      { yearsAgo: 2, year: 2024, price: 450, label: { ru: '2 года назад (2024)', en: '2 years ago (2024)' }, note: { ru: 'Стабильный уровень', en: 'A stable level' } },
    ],
    faq: [
      {
        question: { ru: 'Почему появился Bitcoin Cash?', en: 'Why was Bitcoin Cash created?' },
        answer: {
          ru: 'К 2017 году в сообществе Bitcoin разгорелся спор о том, как масштабировать сеть: увеличить размер блока (проще, но менее децентрализовано) или внедрить SegWit и решения второго уровня (сложнее, но сохраняет маленькие блоки). Сторонники больших блоков не пришли к согласию с остальными и 1 августа 2017 года разделили сеть — так появился Bitcoin Cash.',
          en: 'By 2017, a dispute had erupted in the Bitcoin community over how to scale the network: increase the block size (simpler, but less decentralized) or adopt SegWit and Layer 2 solutions (more complex, but keeps blocks small). Big-block proponents couldn\'t reach agreement with the rest of the community, and on August 1, 2017, they split the network — creating Bitcoin Cash.',
        },
      },
      {
        question: { ru: 'Получили ли держатели BTC бесплатные BCH?', en: 'Did BTC holders get free BCH?' },
        answer: {
          ru: 'Да. Любой, кто владел Bitcoin на момент форка (блок 478 559), автоматически получил равное количество Bitcoin Cash на тот же адрес — по одному BCH за каждый BTC.',
          en: 'Yes. Anyone who held Bitcoin at the moment of the fork (block 478,559) automatically received an equal amount of Bitcoin Cash at the same address — one BCH for every BTC.',
        },
      },
      {
        question: { ru: 'Раскалывался ли сам Bitcoin Cash дальше?', en: 'Did Bitcoin Cash itself split further?' },
        answer: {
          ru: 'Да — в ноябре 2018 года произошёл ещё один раскол внутри сообщества BCH, приведший к появлению Bitcoin SV (BSV), который продвигала фракция во главе с Крейгом Райтом.',
          en: 'Yes — in November 2018, another split happened within the BCH community, leading to the creation of Bitcoin SV (BSV), championed by a faction led by Craig Wright.',
        },
      },
    ],
    glossaryTerms: [
      { slug: 'blockchain', label: { ru: 'Блокчейн', en: 'Blockchain' } },
      { slug: 'mining', label: { ru: 'Майнинг', en: 'Mining' } },
      { slug: 'transaction', label: { ru: 'Транзакция', en: 'Transaction' } },
    ],
  },

  arbitrum: {
    stats: [
      { label: { ru: 'Разработчик', en: 'Developer' }, value: 'Offchain Labs' },
      { label: { ru: 'Создатели', en: 'Founders' }, value: 'Ed Felten, Steven Goldfeder, Harry Kalodner' },
      { label: { ru: 'Мейннет', en: 'Mainnet' }, value: 'August 2021' },
      { label: { ru: 'Тип', en: 'Type' }, value: 'Optimistic rollup (Ethereum L2)' },
    ],
    investmentReference: [
      { yearsAgo: 3, year: 2023, price: 1.5, label: { ru: '3 года назад (2023)', en: '3 years ago (2023)' }, note: { ru: 'Вскоре после запуска токена', en: 'Shortly after the token launch' } },
      { yearsAgo: 2, year: 2024, price: 2.0, label: { ru: '2 года назад (2024)', en: '2 years ago (2024)' }, note: { ru: 'Около ATH', en: 'Near the all-time high' } },
      { yearsAgo: 1, year: 2025, price: 0.7, label: { ru: '1 год назад (2025)', en: '1 year ago (2025)' }, note: { ru: 'После общей коррекции рынка', en: 'After the broader market correction' } },
    ],
    faq: [
      {
        question: { ru: 'Что такое Arbitrum?', en: 'What is Arbitrum?' },
        answer: {
          ru: 'Arbitrum — крупнейшее по объёму заблокированных средств решение второго уровня (Layer 2) для Ethereum. Оно обрабатывает транзакции отдельно от основной сети Ethereum, а затем публикует итоговые данные обратно, снижая комиссии в десятки раз при сохранении безопасности Ethereum.',
          en: 'Arbitrum is the largest Ethereum Layer 2 solution by total value locked. It processes transactions separately from the main Ethereum network, then posts the results back, cutting fees by dozens of times while keeping Ethereum-level security.',
        },
      },
      {
        question: { ru: 'Кто разработал Arbitrum?', en: 'Who developed Arbitrum?' },
        answer: {
          ru: 'Arbitrum создан компанией Offchain Labs, основанной Эдом Фелтеном (бывший профессор Принстона и заместитель технического директора США при администрации Обамы), Стивеном Голдфедером и Гарри Калоднером.',
          en: 'Arbitrum was built by Offchain Labs, founded by Ed Felten (a former Princeton professor and U.S. Deputy CTO under the Obama administration), Steven Goldfeder, and Harry Kalodner.',
        },
      },
      {
        question: { ru: 'Что за раздача токенов ARB в 2023 году?', en: 'What was the 2023 ARB token airdrop?' },
        answer: {
          ru: '23 марта 2023 года Arbitrum раздал около 1,16 млрд токенов ARB примерно 625 000 кошельков, которые ранее активно пользовались сетью — одна из крупнейших раздач среди L2-решений.',
          en: 'On March 23, 2023, Arbitrum airdropped roughly 1.16 billion ARB tokens to about 625,000 wallets that had previously used the network actively — one of the largest airdrops among L2 solutions.',
        },
      },
    ],
    glossaryTerms: [
      { slug: 'blockchain', label: { ru: 'Блокчейн', en: 'Blockchain' } },
      { slug: 'defi', label: { ru: 'DeFi', en: 'DeFi' } },
      { slug: 'wallet', label: { ru: 'Кошелёк', en: 'Wallet' } },
    ],
  },

  sui: {
    stats: [
      { label: { ru: 'Разработчик', en: 'Developer' }, value: 'Mysten Labs' },
      { label: { ru: 'Создатели', en: 'Founders' }, value: 'Ex-Meta/Diem engineers' },
      { label: { ru: 'Мейннет', en: 'Mainnet' }, value: 'May 2023' },
      { label: { ru: 'Язык программирования', en: 'Programming language' }, value: 'Move' },
    ],
    investmentReference: [
      { yearsAgo: 2, year: 2024, price: 1.0, label: { ru: '2 года назад (2024)', en: '2 years ago (2024)' }, note: { ru: 'Год после запуска', en: 'A year after launch' } },
      { yearsAgo: 1, year: 2025, price: 4.0, label: { ru: '1 год назад (2025)', en: '1 year ago (2025)' }, note: { ru: 'Около пика цикла', en: 'Near the cycle peak' } },
      { yearsAgo: 0, year: 2026, price: 3.0, label: { ru: 'В начале этого года', en: 'Earlier this year' }, note: { ru: 'Промежуточный уровень', en: 'Mid-cycle level' } },
    ],
    faq: [
      {
        question: { ru: 'Кто стоит за Sui?', en: 'Who is behind Sui?' },
        answer: {
          ru: 'Sui разработан компанией Mysten Labs, основанной бывшими инженерами Meta (Facebook), которые ранее работали над закрытым блокчейн-проектом Diem (изначально Libra) — амбициозной, но так и не запущенной криптовалютой Facebook.',
          en: 'Sui was built by Mysten Labs, founded by former Meta (Facebook) engineers who had previously worked on the shuttered Diem project (originally called Libra) — Facebook\'s ambitious cryptocurrency that never launched.',
        },
      },
      {
        question: { ru: 'Чем Sui отличается от других блокчейнов первого уровня?', en: 'How is Sui different from other Layer 1 blockchains?' },
        answer: {
          ru: 'Sui обрабатывает независимые транзакции параллельно, а не строго последовательно, как большинство сетей, что позволяет добиваться очень высокой скорости. Также сеть использует язык программирования Move, изначально разработанный для проекта Diem — он делает смарт-контракты более защищёнными от типичных ошибок.',
          en: 'Sui processes independent transactions in parallel rather than strictly one after another like most networks, which allows for very high throughput. The network also uses the Move programming language, originally developed for the Diem project, which makes smart contracts more resistant to common bugs.',
        },
      },
    ],
    glossaryTerms: [
      { slug: 'blockchain', label: { ru: 'Блокчейн', en: 'Blockchain' } },
      { slug: 'wallet', label: { ru: 'Кошелёк', en: 'Wallet' } },
      { slug: 'altcoin', label: { ru: 'Альткоин', en: 'Altcoin' } },
    ],
  },

  near: {
    stats: [
      { label: { ru: 'Создатели', en: 'Founders' }, value: 'Illia Polosukhin, Alexander Skidanov' },
      { label: { ru: 'Мейннет', en: 'Mainnet' }, value: 'April 2020' },
      { label: { ru: 'Технология', en: 'Technology' }, value: 'Nightshade sharding' },
      { label: { ru: 'Текущий фокус', en: 'Current focus' }, value: 'AI + blockchain' },
    ],
    investmentReference: [
      { yearsAgo: 5, year: 2021, price: 3, label: { ru: '5 лет назад (2021)', en: '5 years ago (2021)' }, note: { ru: 'Перед ралли к ATH', en: 'Before the ATH rally' } },
      { yearsAgo: 3, year: 2023, price: 1.5, label: { ru: '3 года назад (2023)', en: '3 years ago (2023)' }, note: { ru: 'После крипто-зимы', en: 'After the crypto winter' } },
      { yearsAgo: 1, year: 2025, price: 3.5, label: { ru: '1 год назад (2025)', en: '1 year ago (2025)' }, note: { ru: 'На фоне AI-нарратива', en: 'Amid the AI narrative' } },
    ],
    faq: [
      {
        question: { ru: 'Кто создал NEAR Protocol?', en: 'Who created NEAR Protocol?' },
        answer: {
          ru: 'NEAR основали Илья Полосухин (бывший инженер Google) и Александр Скиданов (бывший директор по разработке в MemSQL). Они познакомились через акселератор Y Combinator, а изначально их компания занималась машинным обучением, прежде чем перейти в блокчейн.',
          en: 'NEAR was founded by Illia Polosukhin (a former Google engineer) and Alexander Skidanov (a former director of engineering at MemSQL). They met through the Y Combinator accelerator, and their company originally worked on machine learning before pivoting to blockchain.',
        },
      },
      {
        question: { ru: 'Что такое шардинг Nightshade?', en: 'What is Nightshade sharding?' },
        answer: {
          ru: 'Шардинг — способ разделить сеть на несколько параллельно работающих частей («шардов»), чтобы обрабатывать больше транзакций одновременно. Технология NEAR под названием Nightshade делает это динамически, подстраиваясь под нагрузку сети.',
          en: 'Sharding is a way to split a network into several parts ("shards") that work in parallel, allowing it to process more transactions at once. NEAR\'s Nightshade technology does this dynamically, adapting to the network\'s load.',
        },
      },
      {
        question: { ru: 'Почему NEAR стал ассоциироваться с ИИ?', en: 'Why has NEAR become associated with AI?' },
        answer: {
          ru: 'С 2023–2024 годов команда NEAR сместила публичный фокус проекта на «блокчейн для искусственного интеллекта» — идею использовать децентрализованную сеть для хранения данных и обучения открытых ИИ-моделей вместо того, чтобы отдавать контроль над ИИ нескольким крупным корпорациям.',
          en: 'Since 2023–2024, the NEAR team has shifted the project\'s public focus toward "blockchain for artificial intelligence" — the idea of using a decentralized network to store data and train open AI models, instead of leaving control over AI to a handful of large corporations.',
        },
      },
    ],
    glossaryTerms: [
      { slug: 'blockchain', label: { ru: 'Блокчейн', en: 'Blockchain' } },
      { slug: 'wallet', label: { ru: 'Кошелёк', en: 'Wallet' } },
      { slug: 'altcoin', label: { ru: 'Альткоин', en: 'Altcoin' } },
    ],
  },

  aptos: {
    stats: [
      { label: { ru: 'Создатели', en: 'Founders' }, value: 'Mo Shaikh, Avery Ching' },
      { label: { ru: 'Мейннет', en: 'Mainnet' }, value: 'October 2022' },
      { label: { ru: 'Происхождение', en: 'Origin' }, value: 'Ex-Meta / Diem project' },
      { label: { ru: 'Язык программирования', en: 'Programming language' }, value: 'Move' },
    ],
    investmentReference: [
      { yearsAgo: 3, year: 2023, price: 10, label: { ru: '3 года назад (2023)', en: '3 years ago (2023)' }, note: { ru: 'Вскоре после запуска', en: 'Shortly after launch' } },
      { yearsAgo: 2, year: 2024, price: 8, label: { ru: '2 года назад (2024)', en: '2 years ago (2024)' }, note: { ru: 'Стабильный уровень', en: 'A stable level' } },
      { yearsAgo: 1, year: 2025, price: 9, label: { ru: '1 год назад (2025)', en: '1 year ago (2025)' }, note: { ru: 'Промежуточный уровень', en: 'Mid-cycle level' } },
    ],
    faq: [
      {
        question: { ru: 'Чем Aptos связан с Facebook?', en: 'What is Aptos\'s connection to Facebook?' },
        answer: {
          ru: 'Aptos основали Мо Шейх и Эйвери Чинг — оба ранее работали в Meta (Facebook) над проектом Diem (изначально Libra), закрытым блокчейн-инициативой компании по созданию собственной валюты. После закрытия Diem в 2022 году часть команды использовала наработки, включая язык Move, чтобы построить независимый публичный блокчейн Aptos.',
          en: 'Aptos was founded by Mo Shaikh and Avery Ching, both of whom previously worked at Meta (Facebook) on Diem (originally Libra), the company\'s shuttered blockchain initiative to create its own currency. After Diem was shut down in 2022, part of the team used the underlying work, including the Move language, to build the independent public blockchain Aptos.',
        },
      },
      {
        question: { ru: 'Чем Aptos похож на Sui?', en: 'How is Aptos similar to Sui?' },
        answer: {
          ru: 'Оба проекта выросли из одной и той же команды и технологии Diem/Libra и используют язык программирования Move для смарт-контрактов. Aptos и Sui часто сравнивают как конкурирующих «наследников» закрытого проекта Facebook, хотя технически они развивались независимо друг от друга.',
          en: 'Both projects grew out of the same Diem/Libra team and technology and use the Move programming language for smart contracts. Aptos and Sui are often compared as competing "heirs" to Facebook\'s shuttered project, though they\'ve technically developed independently of each other.',
        },
      },
    ],
    glossaryTerms: [
      { slug: 'blockchain', label: { ru: 'Блокчейн', en: 'Blockchain' } },
      { slug: 'wallet', label: { ru: 'Кошелёк', en: 'Wallet' } },
      { slug: 'altcoin', label: { ru: 'Альткоин', en: 'Altcoin' } },
    ],
  },

  zcash: {
    stats: [
      { label: { ru: 'Год запуска', en: 'Launched' }, value: '2016' },
      { label: { ru: 'Создатели', en: 'Creators' }, value: 'Zooko Wilcox-O’Hearn, Electric Coin Company' },
      { label: { ru: 'Максимальный выпуск', en: 'Max supply' }, value: { ru: '21 000 000', en: '21,000,000' } },
      { label: { ru: 'Консенсус', en: 'Consensus' }, value: 'Proof of Work (Equihash)' },
    ],
    investmentReference: [
      { yearsAgo: 5, year: 2021, price: 169.7, label: { ru: '5 лет назад (ноябрь 2021)', en: '5 years ago (November 2021)' }, note: { ru: 'До медвежьего рынка 2022 года', en: 'Before the 2022 bear market' } },
      { yearsAgo: 3, year: 2023, price: 28.66, label: { ru: '3 года назад (ноябрь 2023)', en: '3 years ago (November 2023)' }, note: { ru: 'У нижней границы диапазона', en: 'Near the bottom of its range' } },
      { yearsAgo: 1, year: 2025, price: 412.13, label: { ru: '1 год назад (ноябрь 2025)', en: '1 year ago (November 2025)' }, note: { ru: 'В разгар ралли приватных монет', en: 'In the middle of the privacy rally' } },
    ],
    faq: [
      {
        question: { ru: 'Как Zcash скрывает переводы?', en: 'What makes Zcash private?' },
        answer: {
          ru: 'Скрытый перевод сопровождается доказательством с нулевым разглашением: сеть убеждается, что платёж корректен, не видя ни отправителя, ни получателя, ни суммы. Скрытность включается по желанию: можно пользоваться и обычным прозрачным адресом.',
          en: 'A shielded transaction uses a zero-knowledge proof: the network checks that the payment is valid without seeing the sender, the recipient or the amount. Privacy is optional, so you choose between a transparent and a shielded address.',
        },
      },
      {
        question: { ru: 'Сколько всего будет ZEC?', en: 'How many ZEC will ever exist?' },
        answer: {
          ru: '21 миллион, как и биткоинов. В обращении около 17 миллионов, а халвинги примерно раз в четыре года вдвое урезают выпуск новых монет.',
          en: '21 million, the same cap as Bitcoin. About 17 million are in circulation, and halvings cut new issuance about every four years.',
        },
      },
      {
        question: { ru: 'Почему рекорд цены пришёлся на первый день?', en: 'Why was the all-time high on the first day?' },
        answer: {
          ru: 'В день запуска монет было очень мало, а желающих купить много, поэтому первые сделки прошли по цене до 3191,93 доллара. Когда предложение выросло, цена упала.',
          en: 'On 28 October 2016 only a few coins existed and demand was high, so the first trades went through at up to 3,191.93 dollars. Supply grew within weeks and the price fell.',
        },
      },
    ],
    glossaryTerms: [
      { slug: 'blockchain', label: { ru: 'Блокчейн', en: 'Blockchain' } },
      { slug: 'halving', label: { ru: 'Халвинг', en: 'Halving' } },
      { slug: 'mining', label: { ru: 'Майнинг', en: 'Mining' } },
    ],
  },

  hyperliquid: {
    stats: [
      { label: { ru: 'Год запуска токена', en: 'Token launch' }, value: '2024' },
      { label: { ru: 'Основатель', en: 'Founder' }, value: 'Jeff Yan' },
      { label: { ru: 'Максимальный выпуск', en: 'Max supply' }, value: { ru: '1 000 000 000', en: '1,000,000,000' } },
      { label: { ru: 'Тип сети', en: 'Network type' }, value: { ru: 'L1 со встроенной биржей', en: 'L1 with an on-chain exchange' } },
    ],
    investmentReference: [
      { yearsAgo: 2, year: 2024, price: 3.81, label: { ru: 'При запуске (ноябрь 2024)', en: 'At launch (November 2024)' }, note: { ru: 'Цена открытия после аирдропа', en: 'Opening price after the airdrop' } },
      { yearsAgo: 1, year: 2025, price: 43.28, label: { ru: '1 год назад (ноябрь 2025)', en: '1 year ago (November 2025)' }, note: { ru: 'Через год после запуска', en: 'A year after launch' } },
    ],
    faq: [
      {
        question: { ru: 'Что такое Hyperliquid?', en: 'What is Hyperliquid?' },
        answer: {
          ru: 'Децентрализованная биржа фьючерсов на собственном блокчейне. Заявки, их исполнение и расчёты проходят в сети, а средства остаются под вашим контролем.',
          en: 'A decentralised exchange for futures that runs on its own blockchain. Orders, matching and settlement happen on-chain, and you keep custody of your funds.',
        },
      },
      {
        question: { ru: 'Как распределили HYPE?', en: 'How was HYPE distributed?' },
        answer: {
          ru: '29 ноября 2024 года 310 миллионов HYPE, 31% всего выпуска, раздали пользователям биржи. Венчурных инвесторов у проекта не было, так что их доли нет.',
          en: 'On 29 November 2024 Hyperliquid airdropped 310 million HYPE, 31% of the supply, to users. The project took no venture funding, so no investors received a share.',
        },
      },
      {
        question: { ru: 'Как комиссии биржи связаны с HYPE?', en: 'Why do people say exchange fees support HYPE?' },
        answer: {
          ru: 'Большая часть торговых комиссий идёт в фонд, который покупает HYPE на рынке. Больше оборот — больше покупок.',
          en: 'Most trading fees go to an assistance fund that buys HYPE on the market, so higher trading volume means more buying.',
        },
      },
    ],
    glossaryTerms: [
      { slug: 'dex', label: { ru: 'DEX', en: 'DEX' } },
      { slug: 'airdrop', label: { ru: 'Аирдроп', en: 'Airdrop' } },
      { slug: 'order-book', label: { ru: 'Книга заявок', en: 'Order book' } },
    ],
  },

  hedera: {
    stats: [
      { label: { ru: 'Открытие сети', en: 'Open access' }, value: '2019' },
      { label: { ru: 'Создатели', en: 'Creators' }, value: 'Leemon Baird, Mance Harmon' },
      { label: { ru: 'Максимальный выпуск', en: 'Max supply' }, value: { ru: '50 000 000 000', en: '50,000,000,000' } },
      { label: { ru: 'Тип сети', en: 'Network type' }, value: { ru: 'Хэшграф, proof of stake', en: 'Hashgraph, proof of stake' } },
    ],
    investmentReference: [
      { yearsAgo: 5, year: 2021, price: 0.3997, label: { ru: '5 лет назад (ноябрь 2021)', en: '5 years ago (November 2021)' }, note: { ru: 'Через два месяца после максимума', en: 'Two months after the all-time high' } },
      { yearsAgo: 3, year: 2023, price: 0.0537, label: { ru: '3 года назад (ноябрь 2023)', en: '3 years ago (November 2023)' }, note: { ru: 'У дна цикла', en: 'Near the bottom of the cycle' } },
      { yearsAgo: 1, year: 2025, price: 0.1964, label: { ru: '1 год назад (ноябрь 2025)', en: '1 year ago (November 2025)' }, note: { ru: 'После восстановления 2024–2025 годов', en: 'After the 2024 to 2025 recovery' } },
    ],
    faq: [
      {
        question: { ru: 'Hedera — это блокчейн?', en: 'Is Hedera a blockchain?' },
        answer: {
          ru: 'Нет, Hedera работает на хэшграфе. Узлы обмениваются историей транзакций и договариваются о порядке событий без блоков и майнеров.',
          en: 'No, it uses a hashgraph. Nodes share transaction history with each other and reach agreement on the order of events without blocks or miners.',
        },
      },
      {
        question: { ru: 'Кто управляет Hedera?', en: 'Who runs Hedera?' },
        answer: {
          ru: 'Совет крупных организаций; в разное время в него входили Google, IBM, Boeing и Deutsche Telekom. Каждый участник держит узел и голосует за изменения сети.',
          en: 'A governing council of large organisations; members have included Google, IBM, Boeing and Deutsche Telekom. Each runs a node and votes on changes to the network.',
        },
      },
      {
        question: { ru: 'Сколько всего HBAR?', en: 'How many HBAR exist?' },
        answer: {
          ru: 'Выпуск зафиксирован на 50 миллиардах HBAR, в обращении около 44 миллиардов.',
          en: 'The supply is fixed at 50 billion HBAR, and about 44 billion are in circulation.',
        },
      },
    ],
    glossaryTerms: [
      { slug: 'node', label: { ru: 'Узел', en: 'Node' } },
      { slug: 'consensus-mechanism', label: { ru: 'Консенсус', en: 'Consensus' } },
      { slug: 'proof-of-stake', label: { ru: 'Proof of Stake', en: 'Proof of Stake' } },
    ],
  },

  quant: {
    stats: [
      { label: { ru: 'Год ICO', en: 'ICO' }, value: '2018' },
      { label: { ru: 'Основатель', en: 'Founder' }, value: 'Gilbert Verdian' },
      { label: { ru: 'Максимальный выпуск', en: 'Max supply' }, value: { ru: '14 612 493', en: '14,612,493' } },
      { label: { ru: 'Тип токена', en: 'Token type' }, value: { ru: 'ERC-20 на Ethereum', en: 'ERC-20 on Ethereum' } },
    ],
    investmentReference: [
      { yearsAgo: 5, year: 2021, price: 274.0, label: { ru: '5 лет назад (ноябрь 2021)', en: '5 years ago (November 2021)' }, note: { ru: 'Через два месяца после максимума', en: 'Two months after the all-time high' } },
      { yearsAgo: 3, year: 2023, price: 104.3, label: { ru: '3 года назад (ноябрь 2023)', en: '3 years ago (November 2023)' }, note: { ru: 'После спада 2022 года', en: 'After the 2022 decline' } },
      { yearsAgo: 1, year: 2025, price: 80.05, label: { ru: '1 год назад (ноябрь 2025)', en: '1 year ago (November 2025)' }, note: { ru: 'Во время коррекции 2025 года', en: 'During the 2025 correction' } },
    ],
    faq: [
      {
        question: { ru: 'Чем занимается Quant?', en: 'What does Quant do?' },
        answer: {
          ru: 'Продаёт Overledger — программу, которая связывает разные блокчейны друг с другом и с существующими банковскими системами.',
          en: 'It sells Overledger, software that connects different blockchains with each other and with existing bank systems.',
        },
      },
      {
        question: { ru: 'Почему QNT так мало?', en: 'Why is the QNT supply so small?' },
        answer: {
          ru: 'Выпуск ограничен 14 612 493 QNT, в обращении около 14,56 миллиона. Токен нужен компаниям для оплаты лицензий Overledger.',
          en: 'The supply is capped at 14,612,493 QNT, and about 14.56 million are in circulation. Companies need QNT to pay for Overledger licences.',
        },
      },
      {
        question: { ru: 'Когда QNT стоил дороже всего?', en: 'When did QNT reach its all-time high?' },
        answer: {
          ru: '11 сентября 2021 года, 427,42 доллара.',
          en: 'On 11 September 2021, at 427.42 dollars.',
        },
      },
    ],
    glossaryTerms: [
      { slug: 'ico', label: { ru: 'ICO', en: 'ICO' } },
      { slug: 'erc-20', label: { ru: 'ERC-20', en: 'ERC-20' } },
      { slug: 'blockchain', label: { ru: 'Блокчейн', en: 'Blockchain' } },
    ],
  },

  bittensor: {
    stats: [
      { label: { ru: 'Запуск основной сети', en: 'Mainnet' }, value: '2023' },
      { label: { ru: 'Создатели', en: 'Creators' }, value: 'Jacob Steeves, Ala Shaabana' },
      { label: { ru: 'Максимальный выпуск', en: 'Max supply' }, value: { ru: '21 000 000', en: '21,000,000' } },
      { label: { ru: 'Тип сети', en: 'Network type' }, value: { ru: 'L1 для машинного обучения', en: 'L1 for machine learning' } },
    ],
    investmentReference: [
      { yearsAgo: 3, year: 2023, price: 86.38, label: { ru: '3 года назад (ноябрь 2023)', en: '3 years ago (November 2023)' }, note: { ru: 'Через восемь месяцев после запуска сети', en: 'Eight months after mainnet' } },
      { yearsAgo: 1, year: 2025, price: 497.3, label: { ru: '1 год назад (ноябрь 2025)', en: '1 year ago (November 2025)' }, note: { ru: 'За месяц до первого халвинга', en: 'A month before the first halving' } },
    ],
    faq: [
      {
        question: { ru: 'Что такое Bittensor?', en: 'What is Bittensor?' },
        answer: {
          ru: 'Блокчейн, который платит TAO майнерам за работу в машинном обучении и валидаторам за её оценку. Работа идёт в подсетях, у каждой своя задача.',
          en: 'A blockchain that pays TAO to miners who provide machine learning work and to validators who score it. Work happens in subnets, each with its own task.',
        },
      },
      {
        question: { ru: 'Сколько всего будет TAO?', en: 'How many TAO will exist?' },
        answer: {
          ru: '21 миллион, как и биткоинов. В обращении около 11,7 миллиона.',
          en: '21 million, the same cap as Bitcoin. About 11.7 million are in circulation.',
        },
      },
      {
        question: { ru: 'Когда был первый халвинг TAO?', en: 'When was the first TAO halving?' },
        answer: {
          ru: 'В декабре 2025 года. Он урезал выпуск примерно с 7200 TAO в день до 3600.',
          en: 'In December 2025. It cut daily issuance from about 7,200 TAO to 3,600.',
        },
      },
    ],
    glossaryTerms: [
      { slug: 'halving', label: { ru: 'Халвинг', en: 'Halving' } },
      { slug: 'mining', label: { ru: 'Майнинг', en: 'Mining' } },
      { slug: 'whitepaper', label: { ru: 'Whitepaper', en: 'Whitepaper' } },
    ],
  },

  cronos: {
    stats: [
      { label: { ru: 'Год выпуска', en: 'Launched' }, value: '2018' },
      { label: { ru: 'Основатели', en: 'Founders' }, value: 'Kris Marszalek, Bobby Bao, Gary Or, Rafael Melo' },
      { label: { ru: 'Максимальный выпуск', en: 'Max supply' }, value: { ru: '100 000 000 000', en: '100,000,000,000' } },
      { label: { ru: 'Сети', en: 'Networks' }, value: { ru: 'Cronos EVM и Crypto.org Chain', en: 'Cronos EVM and Crypto.org Chain' } },
    ],
    investmentReference: [
      { yearsAgo: 5, year: 2021, price: 0.2127, label: { ru: '5 лет назад (ноябрь 2021)', en: '5 years ago (November 2021)' }, note: { ru: 'За три недели до максимума', en: 'Three weeks before the all-time high' } },
      { yearsAgo: 3, year: 2023, price: 0.06226, label: { ru: '3 года назад (ноябрь 2023)', en: '3 years ago (November 2023)' }, note: { ru: 'После спада 2022 года', en: 'After the 2022 decline' } },
      { yearsAgo: 1, year: 2025, price: 0.147, label: { ru: '1 год назад (ноябрь 2025)', en: '1 year ago (November 2025)' }, note: { ru: 'Через семь месяцев после голосования о перевыпуске', en: 'Seven months after the reissue vote' } },
    ],
    faq: [
      {
        question: { ru: 'CRO — это токен Crypto.com?', en: 'Is CRO the Crypto.com token?' },
        answer: {
          ru: 'Да. Crypto.com выпустила CRO в 2018 году, на нём работают сети Cronos и Crypto.org Chain. В феврале 2022 года токен переименовали в Cronos, тикер остался прежним.',
          en: 'Yes. Crypto.com issued CRO in 2018, and it powers the Cronos chain and the Crypto.org Chain. In February 2022 Crypto.com renamed the token Cronos and kept the ticker CRO.',
        },
      },
      {
        question: { ru: 'Сколько всего CRO?', en: 'How many CRO exist?' },
        answer: {
          ru: 'Максимум — 100 миллиардов, в обращении около 50,8 миллиарда по данным CoinGecko. 70 миллиардов, сожжённых в 2021 году, в 2025-м вернули голосованием в резервный кошелёк с поэтапной разблокировкой.',
          en: 'The maximum is 100 billion. About 50.8 billion are in circulation, according to CoinGecko. In 2025 validators voted to reissue 70 billion tokens that had been burned in 2021, and they sit in a reserve wallet under vesting.',
        },
      },
      {
        question: { ru: 'Когда CRO стоил дороже всего?', en: 'When did CRO reach its all-time high?' },
        answer: {
          ru: '23 ноября 2021 года, 0,8915 доллара. В том же месяце Crypto.com запустила сеть Cronos и купила название арены в Лос-Анджелесе.',
          en: 'On 23 November 2021, at 0.8915 dollars, during the month Crypto.com launched the Cronos chain and bought the naming rights to the Los Angeles arena.',
        },
      },
    ],
    glossaryTerms: [
      { slug: 'cex', label: { ru: 'Биржа', en: 'Exchange' } },
      { slug: 'smart-contract', label: { ru: 'Смарт-контракт', en: 'Smart contract' } },
      { slug: 'tokenomics', label: { ru: 'Токеномика', en: 'Tokenomics' } },
    ],
  },

  ethena: {
    stats: [
      { label: { ru: 'Год запуска токена', en: 'Token launch' }, value: '2024' },
      { label: { ru: 'Основатель', en: 'Founder' }, value: 'Guy Young' },
      { label: { ru: 'Максимальный выпуск', en: 'Max supply' }, value: { ru: '15 000 000 000', en: '15,000,000,000' } },
      { label: { ru: 'Продукт', en: 'Product' }, value: { ru: 'Синтетический доллар USDe', en: 'Synthetic dollar USDe' } },
    ],
    investmentReference: [
      { yearsAgo: 2, year: 2024, price: 0.3693, label: { ru: '2 года назад (ноябрь 2024)', en: '2 years ago (November 2024)' }, note: { ru: 'Через семь месяцев после аирдропа', en: 'Seven months after the airdrop' } },
      { yearsAgo: 1, year: 2025, price: 0.3876, label: { ru: '1 год назад (ноябрь 2025)', en: '1 year ago (November 2025)' }, note: { ru: 'Через месяц после пика выпуска USDe', en: 'A month after USDe supply peaked' } },
    ],
    faq: [
      {
        question: { ru: 'Чем USDe отличается от ENA?', en: 'What is the difference between USDe and ENA?' },
        answer: {
          ru: 'USDe — синтетический доллар, его цель держаться у одного доллара. ENA — токен управления с выпуском 15 миллиардов, его цена свободно меняется.',
          en: 'USDe is the synthetic dollar that aims to hold a price of one dollar. ENA is the governance token with a supply of 15 billion, and its price floats with the market.',
        },
      },
      {
        question: { ru: 'Откуда доходность USDe?', en: 'Where does the USDe yield come from?' },
        answer: {
          ru: 'В основном из фандинга: трейдеры с длинными позициями во фьючерсах платят держателям коротких, а шорты держит Ethena. Когда фандинг уходит в минус, доход падает.',
          en: 'From funding: traders with long positions in futures pay holders of short positions, and Ethena holds shorts. When funding turns negative, the yield falls.',
        },
      },
      {
        question: { ru: 'Как распределили ENA?', en: 'How was ENA distributed?' },
        answer: {
          ru: '750 миллионов, 5% выпуска, получили пользователи в аирдропе 2 апреля 2024 года. Из 15 миллиардов в обращении около 13,4 миллиарда по данным CoinGecko.',
          en: '750 million ENA, 5% of supply, went to users in the airdrop of 2 April 2024. About 13.4 billion of the 15 billion are in circulation, according to CoinGecko.',
        },
      },
    ],
    glossaryTerms: [
      { slug: 'stablecoin', label: { ru: 'Стейблкоин', en: 'Stablecoin' } },
      { slug: 'airdrop', label: { ru: 'Аирдроп', en: 'Airdrop' } },
      { slug: 'leverage', label: { ru: 'Плечо', en: 'Leverage' } },
    ],
  },

  pepe: {
    stats: [
      { label: { ru: 'Год запуска', en: 'Launched' }, value: '2023' },
      { label: { ru: 'Создатели', en: 'Creators' }, value: { ru: 'Анонимные', en: 'Anonymous' } },
      { label: { ru: 'Максимальный выпуск', en: 'Max supply' }, value: { ru: '420 690 000 000 000', en: '420,690,000,000,000' } },
      { label: { ru: 'Тип токена', en: 'Token type' }, value: { ru: 'ERC-20 на Ethereum', en: 'ERC-20 on Ethereum' } },
    ],
    investmentReference: [
      { yearsAgo: 3, year: 2023, price: 1.19e-06, label: { ru: '3 года назад (ноябрь 2023)', en: '3 years ago (November 2023)' }, note: { ru: 'Через полгода после листинга на Binance', en: 'Six months after the Binance listing' } },
      { yearsAgo: 1, year: 2025, price: 6.69e-06, label: { ru: '1 год назад (ноябрь 2025)', en: '1 year ago (November 2025)' }, note: { ru: 'Через 11 месяцев после максимума', en: 'Eleven months after the all-time high' } },
    ],
    faq: [
      {
        question: { ru: 'У PEPE есть применение?', en: 'Does PEPE have a use?' },
        answer: {
          ru: 'Нет, это мем-токен без продукта. Binance при листинге прямо написала, что у PEPE нет полезности и механизма поддержки цены.',
          en: 'No. It is a meme token without a product. Binance said at listing that PEPE has no utility or mechanism to sustain its value.',
        },
      },
      {
        question: { ru: 'Сколько всего PEPE?', en: 'How many PEPE exist?' },
        answer: {
          ru: '420,69 триллиона по данным CoinGecko. Новые токены выпустить нельзя, а 93,1% выпуска при запуске ушли в пул Uniswap.',
          en: '420.69 trillion, according to CoinGecko. No new tokens can be created, and 93.1% of the supply went into a Uniswap pool at launch.',
        },
      },
      {
        question: { ru: 'Кто создал PEPE?', en: 'Who created PEPE?' },
        answer: {
          ru: 'Анонимные разработчики. Токен назван в честь мема с лягушкой Пепе, к автору рисунка создатели отношения не имеют.',
          en: 'Anonymous developers. The token is named after the Pepe the Frog meme, and its creators have no link to the meme’s author.',
        },
      },
    ],
    glossaryTerms: [
      { slug: 'erc-20', label: { ru: 'ERC-20', en: 'ERC-20' } },
      { slug: 'liquidity-pool', label: { ru: 'Пул ликвидности', en: 'Liquidity pool' } },
      { slug: 'dex', label: { ru: 'DEX', en: 'DEX' } },
    ],
  },

  aave: {
    stats: [
      { label: { ru: 'Год запуска', en: 'Launched' }, value: '2017 (ETHLend)' },
      { label: { ru: 'Основатель', en: 'Founder' }, value: 'Stani Kulechov' },
      { label: { ru: 'Максимальный выпуск', en: 'Max supply' }, value: { ru: '16 000 000', en: '16,000,000' } },
      { label: { ru: 'Тип токена', en: 'Token type' }, value: { ru: 'ERC-20 на Ethereum', en: 'ERC-20 on Ethereum' } },
    ],
    investmentReference: [
      { yearsAgo: 5, year: 2021, price: 324.1, label: { ru: '5 лет назад (ноябрь 2021)', en: '5 years ago (November 2021)' }, note: { ru: 'Через полгода после максимума', en: 'Six months after the all-time high' } },
      { yearsAgo: 3, year: 2023, price: 89.16, label: { ru: '3 года назад (ноябрь 2023)', en: '3 years ago (November 2023)' }, note: { ru: 'После спада 2022 года', en: 'After the 2022 decline' } },
      { yearsAgo: 1, year: 2025, price: 222.96, label: { ru: '1 год назад (ноябрь 2025)', en: '1 year ago (November 2025)' }, note: { ru: 'Через месяц после рекорда депозитов', en: 'A month after record deposits' } },
    ],
    faq: [
      {
        question: { ru: 'Что делает Aave?', en: 'What does Aave do?' },
        answer: {
          ru: 'Это кредитный рынок: вы вносите криптовалюту и получаете проценты или берёте в долг под залог. Ставки зависят от спроса и предложения в каждом пуле.',
          en: 'It is a lending market: you deposit crypto to earn interest or borrow against collateral. Interest rates move with supply and demand in each pool.',
        },
      },
      {
        question: { ru: 'Что такое флеш-кредит?', en: 'What is a flash loan?' },
        answer: {
          ru: 'Заём без залога, который берут и возвращают в одной транзакции. Если деньги не вернулись, вся транзакция отменяется. Aave ввёл такие кредиты в 2020 году.',
          en: 'A loan without collateral that you take and repay in a single transaction. If the money does not come back, the whole transaction is cancelled. Aave introduced them in 2020.',
        },
      },
      {
        question: { ru: 'Сколько всего AAVE?', en: 'How many AAVE exist?' },
        answer: {
          ru: 'Выпуск ограничен 16 миллионами, в обращении около 15,4 миллиона по данным CoinGecko. Токен появился в 2020 году при обмене LEND в пропорции 100 к 1.',
          en: 'The supply is capped at 16 million, and about 15.4 million are in circulation, according to CoinGecko. The token came from a 100-to-1 swap of LEND in 2020.',
        },
      },
    ],
    glossaryTerms: [
      { slug: 'defi', label: { ru: 'DeFi', en: 'DeFi' } },
      { slug: 'liquidation', label: { ru: 'Ликвидация', en: 'Liquidation' } },
      { slug: 'ico', label: { ru: 'ICO', en: 'ICO' } },
    ],
  },

  ondo: {
    stats: [
      { label: { ru: 'Начало торгов', en: 'Trading since' }, value: '2024' },
      { label: { ru: 'Основатель', en: 'Founder' }, value: 'Nathan Allman' },
      { label: { ru: 'Максимальный выпуск', en: 'Max supply' }, value: { ru: '10 000 000 000', en: '10,000,000,000' } },
      { label: { ru: 'Продукты', en: 'Products' }, value: 'OUSG, USDY, Global Markets' },
    ],
    investmentReference: [
      { yearsAgo: 2, year: 2024, price: 0.6681, label: { ru: '2 года назад (ноябрь 2024)', en: '2 years ago (November 2024)' }, note: { ru: 'За шесть недель до максимума', en: 'Six weeks before the all-time high' } },
      { yearsAgo: 1, year: 2025, price: 0.703, label: { ru: '1 год назад (ноябрь 2025)', en: '1 year ago (November 2025)' }, note: { ru: 'Через два месяца после запуска токенизированных акций', en: 'Two months after tokenised stocks launched' } },
    ],
    faq: [
      {
        question: { ru: 'ONDO обеспечен облигациями?', en: 'Is ONDO backed by Treasuries?' },
        answer: {
          ru: 'Нет. Активами обеспечены OUSG и USDY, а ONDO — токен управления, его цену определяет рынок.',
          en: 'No. OUSG and USDY are backed by assets. ONDO is a governance token, and its price depends on the market.',
        },
      },
      {
        question: { ru: 'Сколько всего ONDO?', en: 'How many ONDO exist?' },
        answer: {
          ru: 'Выпуск ограничен 10 миллиардами, в обращении около 4,87 миллиарда по данным CoinGecko.',
          en: 'The supply is capped at 10 billion, and about 4.87 billion are in circulation, according to CoinGecko.',
        },
      },
      {
        question: { ru: 'Кто руководит Ondo Finance?', en: 'Who runs Ondo Finance?' },
        answer: {
          ru: 'Основатель Натан Оллман умер в мае 2026 года в возрасте 32 лет. После этого гендиректором назначили президента компании Иэна Де Боде.',
          en: 'Founder Nathan Allman died in May 2026, aged 32. The company then named its president, Ian De Bode, chief executive.',
        },
      },
    ],
    glossaryTerms: [
      { slug: 'dao', label: { ru: 'DAO', en: 'DAO' } },
      { slug: 'blockchain', label: { ru: 'Блокчейн', en: 'Blockchain' } },
      { slug: 'stablecoin', label: { ru: 'Стейблкоин', en: 'Stablecoin' } },
    ],
  },

  mantle: {
    stats: [
      { label: { ru: 'Запуск сети', en: 'Mainnet' }, value: '2023' },
      { label: { ru: 'Предшественник', en: 'Predecessor' }, value: 'BitDAO (BIT)' },
      { label: { ru: 'Максимальный выпуск', en: 'Max supply' }, value: { ru: '≈6 220 000 000', en: '≈6,220,000,000' } },
      { label: { ru: 'Тип сети', en: 'Network type' }, value: { ru: 'L2 на Ethereum', en: 'Ethereum layer 2' } },
    ],
    investmentReference: [
      { yearsAgo: 3, year: 2023, price: 0.3842, label: { ru: '3 года назад (ноябрь 2023)', en: '3 years ago (November 2023)' }, note: { ru: 'Через две недели после минимума', en: 'Two weeks after the all-time low' } },
      { yearsAgo: 1, year: 2025, price: 1.4424, label: { ru: '1 год назад (ноябрь 2025)', en: '1 year ago (November 2025)' }, note: { ru: 'Через месяц после рекорда', en: 'A month after the record' } },
    ],
    faq: [
      {
        question: { ru: 'Чем BIT отличается от MNT?', en: 'What is the difference between BIT and MNT?' },
        answer: {
          ru: 'Ничем, кроме имени: MNT — это переименованный BIT. После слияния BitDAO и Mantle в 2023 году держатели обменяли токены один к одному.',
          en: 'MNT is the renamed BIT. BitDAO holders converted their tokens one to one after the 2023 merger with Mantle, and BIT stopped being the project’s token.',
        },
      },
      {
        question: { ru: 'Зачем нужна сеть Mantle?', en: 'What is Mantle used for?' },
        answer: {
          ru: 'Это второй уровень Ethereum: приложения работают в нём с комиссиями ниже, чем в самом Ethereum. MNT оплачивает транзакции и даёт голос в управлении.',
          en: 'Mantle is an Ethereum layer 2. Apps run on it with lower fees than on Ethereum itself, and MNT pays for transactions and carries votes in governance.',
        },
      },
      {
        question: { ru: 'Сколько всего MNT?', en: 'How many MNT exist?' },
        answer: {
          ru: 'Максимальный выпуск около 6,22 миллиарда MNT, в обращении, по данным CoinGecko, около 3,3 миллиарда. Большая часть остального лежит в казне.',
          en: 'The maximum supply is about 6.22 billion MNT, and about 3.3 billion are in circulation according to CoinGecko. Most of the rest sits in the treasury.',
        },
      },
    ],
    glossaryTerms: [
      { slug: 'layer-2', label: { ru: 'Layer 2', en: 'Layer 2' } },
      { slug: 'dao', label: { ru: 'DAO', en: 'DAO' } },
      { slug: 'gas-fee', label: { ru: 'Комиссия за газ', en: 'Gas fee' } },
    ],
  },

  worldcoin: {
    stats: [
      { label: { ru: 'Запуск токена', en: 'Token launch' }, value: '2023' },
      { label: { ru: 'Основатели', en: 'Founders' }, value: 'Sam Altman, Alex Blania, Max Novendstern' },
      { label: { ru: 'Максимальный выпуск', en: 'Max supply' }, value: { ru: '10 000 000 000', en: '10,000,000,000' } },
      { label: { ru: 'Тип токена', en: 'Token type' }, value: { ru: 'ERC-20 на Ethereum и Optimism', en: 'ERC-20 on Ethereum and Optimism' } },
    ],
    investmentReference: [
      { yearsAgo: 3, year: 2023, price: 1.886, label: { ru: '3 года назад (ноябрь 2023)', en: '3 years ago (November 2023)' }, note: { ru: 'Через три месяца после запуска', en: 'Three months after launch' } },
      { yearsAgo: 1, year: 2025, price: 0.872, label: { ru: '1 год назад (ноябрь 2025)', en: '1 year ago (November 2025)' }, note: { ru: 'После выхода в США', en: 'After the US launch' } },
    ],
    faq: [
      {
        question: { ru: 'Зачем Worldcoin сканирует радужку?', en: 'Why does Worldcoin scan irises?' },
        answer: {
          ru: 'Скан доказывает, что вы уникальный человек, без имени и паспорта. Orb превращает снимок в код, и по нему система не даёт одному человеку зарегистрироваться дважды.',
          en: 'The scan proves you are a unique human without a name or passport. The Orb turns the image into a code, and that code stops one person from registering twice.',
        },
      },
      {
        question: { ru: 'Сколько всего WLD?', en: 'How many WLD exist?' },
        answer: {
          ru: 'Выпуск ограничен 10 миллиардами WLD. В обращении, по данным CoinGecko, около 3,7 миллиарда.',
          en: 'The supply is capped at 10 billion WLD. About 3.7 billion are in circulation according to CoinGecko.',
        },
      },
      {
        question: { ru: 'Worldcoin разрешён везде?', en: 'Is Worldcoin legal everywhere?' },
        answer: {
          ru: 'Нет. Регуляторы Кении, Испании, Португалии и ряда других стран приостанавливали или ограничивали работу Orb из-за защиты персональных данных. Доступность зависит от страны.',
          en: 'No. Regulators in Kenya, Spain, Portugal and several other countries have suspended or restricted the Orb over privacy concerns, so availability depends on where you live.',
        },
      },
    ],
    glossaryTerms: [
      { slug: 'erc-20', label: { ru: 'ERC-20', en: 'ERC-20' } },
      { slug: 'layer-2', label: { ru: 'Layer 2', en: 'Layer 2' } },
      { slug: 'tokenomics', label: { ru: 'Токеномика', en: 'Tokenomics' } },
    ],
  },

  'internet-computer': {
    stats: [
      { label: { ru: 'Запуск сети', en: 'Launched' }, value: '2021' },
      { label: { ru: 'Основатель', en: 'Founder' }, value: 'Dominic Williams, DFINITY Foundation' },
      { label: { ru: 'Максимальный выпуск', en: 'Max supply' }, value: { ru: 'Не ограничен', en: 'Uncapped' } },
      { label: { ru: 'Управление', en: 'Governance' }, value: 'Network Nervous System' },
    ],
    investmentReference: [
      { yearsAgo: 5, year: 2021, price: 47.02, label: { ru: '5 лет назад (ноябрь 2021)', en: '5 years ago (November 2021)' }, note: { ru: 'Через полгода после запуска', en: 'Six months after launch' } },
      { yearsAgo: 3, year: 2023, price: 4.072, label: { ru: '3 года назад (ноябрь 2023)', en: '3 years ago (November 2023)' }, note: { ru: 'После медвежьего рынка 2022 года', en: 'After the 2022 bear market' } },
      { yearsAgo: 1, year: 2025, price: 3.442, label: { ru: '1 год назад (ноябрь 2025)', en: '1 year ago (November 2025)' }, note: { ru: 'На пути к новым минимумам', en: 'On the way to new lows' } },
    ],
    faq: [
      {
        question: { ru: 'Что такое Internet Computer?', en: 'What is Internet Computer?' },
        answer: {
          ru: 'Блокчейн от фонда DFINITY, в котором приложения живут целиком, вместе с данными и веб-страницами, внутри смарт-контрактов-канистр.',
          en: 'A blockchain from the DFINITY Foundation that hosts complete applications, including their data and web pages, inside smart contracts called canisters.',
        },
      },
      {
        question: { ru: 'Почему ICP так упал после запуска?', en: 'Why did ICP fall so much after launch?' },
        answer: {
          ru: 'Токен стартовал с сотен долларов при высокой оценке и за два месяца потерял около 95%. Критики винили продажи инсайдеров, DFINITY это отрицала и ссылалась на состояние рынка.',
          en: 'It opened at hundreds of dollars with a high valuation and lost about 95% within two months. Critics blamed insider selling; DFINITY rejected that and pointed to market conditions.',
        },
      },
      {
        question: { ru: 'Что такое нейроны в ICP?', en: 'What are neurons in ICP?' },
        answer: {
          ru: 'Замороженные ICP, которые дают голос в Network Nervous System, органе, утверждающем обновления сети. За участие в голосованиях нейроны получают награду.',
          en: 'Locked ICP that gives you voting power in the Network Nervous System, the body that approves network upgrades. Neurons earn rewards for voting.',
        },
      },
    ],
    glossaryTerms: [
      { slug: 'smart-contract', label: { ru: 'Смарт-контракт', en: 'Smart contract' } },
      { slug: 'staking', label: { ru: 'Стейкинг', en: 'Staking' } },
      { slug: 'node', label: { ru: 'Узел', en: 'Node' } },
    ],
  },

  'ethereum-classic': {
    stats: [
      { label: { ru: 'Отделение от Ethereum', en: 'Split from Ethereum' }, value: '2016' },
      { label: { ru: 'Блок разделения', en: 'Fork block' }, value: { ru: '1 920 000', en: '1,920,000' } },
      { label: { ru: 'Максимальный выпуск', en: 'Max supply' }, value: { ru: '≈210 700 000', en: '≈210,700,000' } },
      { label: { ru: 'Консенсус', en: 'Consensus' }, value: 'Proof of Work (Etchash)' },
    ],
    investmentReference: [
      { yearsAgo: 5, year: 2021, price: 53.88, label: { ru: '5 лет назад (ноябрь 2021)', en: '5 years ago (November 2021)' }, note: { ru: 'Через полгода после максимума', en: 'Six months after the all-time high' } },
      { yearsAgo: 3, year: 2023, price: 17.76, label: { ru: '3 года назад (ноябрь 2023)', en: '3 years ago (November 2023)' }, note: { ru: 'После медвежьего рынка 2022 года', en: 'After the 2022 bear market' } },
      { yearsAgo: 1, year: 2025, price: 16.34, label: { ru: '1 год назад (ноябрь 2025)', en: '1 year ago (November 2025)' }, note: { ru: 'Ниже уровня 2023 года', en: 'Below its 2023 level' } },
    ],
    faq: [
      {
        question: { ru: 'Чем Ethereum Classic отличается от Ethereum?', en: 'How is Ethereum Classic different from Ethereum?' },
        answer: {
          ru: 'До июля 2016 года у них общая история. Ethereum отменил последствия взлома The DAO и позже перешёл на Proof of Stake, Ethereum Classic оставил всё как было и работает на майнинге.',
          en: 'They share history up to July 2016. Ethereum reversed the DAO hack and later moved to proof of stake; Ethereum Classic kept the hack in its history and still runs on mining.',
        },
      },
      {
        question: { ru: 'Сколько всего будет ETC?', en: 'How many ETC will exist?' },
        answer: {
          ru: 'Выпуск ограничен: награда за блок уменьшается на 20% каждые 5 миллионов блоков, а общий объём, по данным CoinGecko, приближается к 210,7 миллиона ETC.',
          en: 'The supply is limited. The block reward drops by 20% every 5 million blocks, and the total approaches about 210.7 million ETC according to CoinGecko.',
        },
      },
      {
        question: { ru: 'Что такое атака 51%?', en: 'What is a 51% attack?' },
        answer: {
          ru: 'Если у одного участника больше половины мощности майнинга, он может переписать последние блоки и потратить одни и те же монеты дважды. Ethereum Classic пережил несколько таких атак в 2019 и 2020 годах.',
          en: 'When one party controls most of the mining power, it can rewrite recent blocks and spend the same coins twice. Ethereum Classic suffered several such attacks in 2019 and 2020.',
        },
      },
    ],
    glossaryTerms: [
      { slug: 'hard-fork', label: { ru: 'Хардфорк', en: 'Hard fork' } },
      { slug: 'proof-of-work', label: { ru: 'Proof of Work', en: 'Proof of Work' } },
      { slug: 'mining', label: { ru: 'Майнинг', en: 'Mining' } },
    ],
  },

  kaspa: {
    stats: [
      { label: { ru: 'Запуск сети', en: 'Launched' }, value: '2021' },
      { label: { ru: 'Автор протокола', en: 'Protocol author' }, value: 'Yonatan Sompolinsky' },
      { label: { ru: 'Максимальный выпуск', en: 'Max supply' }, value: { ru: '≈28 700 000 000', en: '≈28,700,000,000' } },
      { label: { ru: 'Консенсус', en: 'Consensus' }, value: 'Proof of Work, GHOSTDAG' },
    ],
    investmentReference: [
      { yearsAgo: 3, year: 2023, price: 0.0519, label: { ru: '3 года назад (ноябрь 2023)', en: '3 years ago (November 2023)' }, note: { ru: 'До ралли 2024 года', en: 'Before the 2024 rally' } },
      { yearsAgo: 1, year: 2025, price: 0.05327, label: { ru: '1 год назад (ноябрь 2025)', en: '1 year ago (November 2025)' }, note: { ru: 'После обновления Crescendo', en: 'After the Crescendo upgrade' } },
    ],
    faq: [
      {
        question: { ru: 'Что такое blockDAG?', en: 'What is a blockDAG?' },
        answer: {
          ru: 'Структура, в которой несколько блоков могут добавляться одновременно, и все они учитываются. В цепочке, как у биткоина, из двух параллельных блоков остаётся только один.',
          en: 'A structure in which several blocks can join the ledger at the same time and all of them count. Bitcoin keeps one of two parallel blocks and discards the other.',
        },
      },
      {
        question: { ru: 'Был ли у Kaspa премайн?', en: 'Did Kaspa have a premine?' },
        answer: {
          ru: 'Нет. Сеть запустилась 7 ноября 2021 года без премайна, ICO и доли основателей и инвесторов, все монеты добыты майнингом.',
          en: 'No. The network launched on 7 November 2021 without a premine, ICO or allocation for founders and investors; all coins come from mining.',
        },
      },
      {
        question: { ru: 'Сколько всего будет KAS?', en: 'How many KAS will exist?' },
        answer: {
          ru: 'Около 28,7 миллиарда. Награда за блок снижается каждый месяц, и большая часть выпуска уже в обращении.',
          en: 'About 28.7 billion. The block reward falls every month, and most of the supply is already in circulation.',
        },
      },
    ],
    glossaryTerms: [
      { slug: 'proof-of-work', label: { ru: 'Proof of Work', en: 'Proof of Work' } },
      { slug: 'mining', label: { ru: 'Майнинг', en: 'Mining' } },
      { slug: 'halving', label: { ru: 'Халвинг', en: 'Halving' } },
    ],
  },

  'pi-network': {
    stats: [
      { label: { ru: 'Запуск приложения', en: 'App launch' }, value: '2019' },
      { label: { ru: 'Создатели', en: 'Creators' }, value: 'Nicolas Kokkalis, Chengdiao Fan' },
      { label: { ru: 'Максимальный выпуск', en: 'Max supply' }, value: { ru: '100 000 000 000', en: '100,000,000,000' } },
      { label: { ru: 'Открытая сеть', en: 'Open network' }, value: { ru: '20 февраля 2025', en: '20 February 2025' } },
    ],
    investmentReference: [
      { yearsAgo: 1, year: 2025, price: 0.2468, label: { ru: '1 год назад (ноябрь 2025)', en: '1 year ago (November 2025)' }, note: { ru: 'Через восемь месяцев после открытия сети', en: 'Eight months after the open network launch' } },
    ],
    faq: [
      {
        question: { ru: 'Как устроен майнинг Pi?', en: 'How does Pi mining work?' },
        answer: {
          ru: 'Раз в сутки вы открываете приложение Pi и нажимаете кнопку. Телефон не считает ничего сложного: приложение фиксирует активность и начисляет PI.',
          en: 'You open the Pi app and tap a button once every 24 hours. The phone does no heavy computation; the app records your activity and credits PI.',
        },
      },
      {
        question: { ru: 'С какого момента PI можно продать?', en: 'When could PI be traded?' },
        answer: {
          ru: 'С 20 февраля 2025 года, когда открылась сеть. До этого балансы жили внутри приложения и закрытой сети.',
          en: 'From 20 February 2025, when the open network went live. Before that, balances stayed inside the app and the enclosed mainnet.',
        },
      },
      {
        question: { ru: 'Сколько всего PI?', en: 'How many PI exist?' },
        answer: {
          ru: 'По модели выпуска — не больше 100 миллиардов. В обращении около 11,3 миллиарда.',
          en: 'The supply model sets a maximum of 100 billion PI. About 11.3 billion are in circulation.',
        },
      },
    ],
    glossaryTerms: [
      { slug: 'kyc', label: { ru: 'KYC', en: 'KYC' } },
      { slug: 'mining', label: { ru: 'Майнинг', en: 'Mining' } },
      { slug: 'node', label: { ru: 'Узел', en: 'Node' } },
    ],
  },

  algorand: {
    stats: [
      { label: { ru: 'Запуск основной сети', en: 'Mainnet' }, value: '2019' },
      { label: { ru: 'Основатель', en: 'Founder' }, value: 'Silvio Micali' },
      { label: { ru: 'Максимальный выпуск', en: 'Max supply' }, value: { ru: '10 000 000 000', en: '10,000,000,000' } },
      { label: { ru: 'Консенсус', en: 'Consensus' }, value: 'Pure Proof of Stake' },
    ],
    investmentReference: [
      { yearsAgo: 5, year: 2021, price: 1.8322, label: { ru: '5 лет назад (ноябрь 2021)', en: '5 years ago (November 2021)' }, note: { ru: 'На подъёме 2021 года', en: 'During the 2021 rally' } },
      { yearsAgo: 3, year: 2023, price: 0.1144, label: { ru: '3 года назад (ноябрь 2023)', en: '3 years ago (November 2023)' }, note: { ru: 'После падения 2022 года', en: 'After the 2022 decline' } },
      { yearsAgo: 1, year: 2025, price: 0.1793, label: { ru: '1 год назад (ноябрь 2025)', en: '1 year ago (November 2025)' }, note: { ru: 'До минимума 2026 года', en: 'Before the 2026 low' } },
    ],
    faq: [
      {
        question: { ru: 'Кто создал Algorand?', en: 'Who created Algorand?' },
        answer: {
          ru: 'Сильвио Микали, профессор MIT и лауреат премии Тьюринга 2012 года. Компанию он основал в 2017 году, основная сеть заработала в июне 2019-го.',
          en: 'Silvio Micali, an MIT professor and the 2012 Turing Award winner. He founded the company in 2017, and the main network launched in June 2019.',
        },
      },
      {
        question: { ru: 'Что такое чистый proof of stake?', en: 'What is pure proof of stake?' },
        answer: {
          ru: 'Вариант proof of stake в Algorand. Проверяющих для каждого блока выбирают случайно среди всех держателей ALGO, пропорционально их доле, и заранее никто не знает, на кого падёт выбор.',
          en: 'Algorand’s version of proof of stake. Validators for each block are chosen at random from all ALGO holders, in proportion to their stake, and no one knows in advance who will be picked.',
        },
      },
      {
        question: { ru: 'Почему максимум пришёлся на 2019 год?', en: 'Why was the all-time high in June 2019?' },
        answer: {
          ru: 'Торги ALGO начались вместе с запуском сети в июне 2019 года, и 20 июня цена дошла до 3,56 доллара. За три месяца после этого монета потеряла 94%.',
          en: 'ALGO started trading together with the mainnet launch in June 2019 and peaked at 3.56 dollars on 20 June. The price then lost 94% in three months.',
        },
      },
    ],
    glossaryTerms: [
      { slug: 'proof-of-stake', label: { ru: 'Proof of Stake', en: 'Proof of Stake' } },
      { slug: 'consensus-mechanism', label: { ru: 'Консенсус', en: 'Consensus' } },
      { slug: 'smart-contract', label: { ru: 'Смарт-контракт', en: 'Smart contract' } },
    ],
  },

  jupiter: {
    stats: [
      { label: { ru: 'Запуск агрегатора', en: 'Aggregator launch' }, value: '2021' },
      { label: { ru: 'Запуск токена', en: 'Token launch' }, value: { ru: '31 января 2024', en: '31 January 2024' } },
      { label: { ru: 'Общее предложение', en: 'Total supply' }, value: { ru: 'около 6,86 млрд', en: 'about 6.86 billion' } },
      { label: { ru: 'Сеть', en: 'Network' }, value: 'Solana' },
    ],
    investmentReference: [
      { yearsAgo: 2, year: 2024, price: 0.9604, label: { ru: '2 года назад (ноябрь 2024)', en: '2 years ago (November 2024)' }, note: { ru: 'Через девять месяцев после запуска', en: 'Nine months after launch' } },
      { yearsAgo: 1, year: 2025, price: 0.4108, label: { ru: '1 год назад (ноябрь 2025)', en: '1 year ago (November 2025)' }, note: { ru: 'После сжигания 3 миллиардов JUP', en: 'After the 3 billion JUP burn' } },
    ],
    faq: [
      {
        question: { ru: 'Что делает Jupiter?', en: 'What does Jupiter do?' },
        answer: {
          ru: 'Ищет самый выгодный маршрут обмена токенов в Solana: сравнивает цены на разных биржах и может разделить одну заявку между ними.',
          en: 'It finds the best route for a token swap on Solana. It compares prices across many exchanges and can split one order between them.',
        },
      },
      {
        question: { ru: 'Как распределили JUP?', en: 'How was JUP distributed?' },
        answer: {
          ru: 'Аирдропами. 31 января 2024 года около миллиарда JUP ушли примерно 955 тысячам кошельков, 22 января 2025-го почти 700 миллионов — примерно 2 миллионам.',
          en: 'Through airdrops. About 1 billion JUP went to some 955,000 wallets on 31 January 2024, and nearly 700 million JUP went to about 2 million wallets on 22 January 2025.',
        },
      },
      {
        question: { ru: 'Почему выпуск JUP сократился?', en: 'Why did the JUP supply fall?' },
        answer: {
          ru: 'В августе 2024 года сообщество проголосовало сжечь 3 миллиарда JUP из доли команды, и потолок выпуска упал с 10 до 7 миллиардов.',
          en: 'The community voted in August 2024 to burn 3 billion JUP from the team’s allocation, cutting the maximum supply from 10 billion to 7 billion.',
        },
      },
    ],
    glossaryTerms: [
      { slug: 'dex', label: { ru: 'DEX', en: 'DEX' } },
      { slug: 'airdrop', label: { ru: 'Аирдроп', en: 'Airdrop' } },
      { slug: 'slippage', label: { ru: 'Проскальзывание', en: 'Slippage' } },
    ],
  },

  render: {
    stats: [
      { label: { ru: 'Токенсейл', en: 'Token sale' }, value: '2017' },
      { label: { ru: 'Основатель', en: 'Founder' }, value: 'Jules Urbach, OTOY' },
      { label: { ru: 'Максимальный выпуск', en: 'Max supply' }, value: { ru: '644 168 762', en: '644,168,762' } },
      { label: { ru: 'Сеть', en: 'Network' }, value: { ru: 'Solana (с 2023 года)', en: 'Solana (since 2023)' } },
    ],
    investmentReference: [
      { yearsAgo: 5, year: 2021, price: 0.995, label: { ru: '5 лет назад (ноябрь 2021)', en: '5 years ago (November 2021)' }, note: { ru: 'Ещё RNDR на Ethereum', en: 'Still RNDR on Ethereum' } },
      { yearsAgo: 3, year: 2023, price: 2.418, label: { ru: '3 года назад (ноябрь 2023)', en: '3 years ago (November 2023)' }, note: { ru: 'За день до переезда на Solana', en: 'A day before the move to Solana' } },
      { yearsAgo: 1, year: 2025, price: 2.332, label: { ru: '1 год назад (ноябрь 2025)', en: '1 year ago (November 2025)' }, note: { ru: 'После пика 2024 года', en: 'After the 2024 peak' } },
    ],
    faq: [
      {
        question: { ru: 'Что такое Render Network?', en: 'What is Render Network?' },
        answer: {
          ru: 'Площадка, где владельцы видеокарт сдают их мощность под рендеринг изображений и видео и получают за это RENDER.',
          en: 'A marketplace where owners of graphics cards rent out their computing power for rendering images and video and get paid in RENDER.',
        },
      },
      {
        question: { ru: 'Чем RNDR отличается от RENDER?', en: 'What is the difference between RNDR and RENDER?' },
        answer: {
          ru: 'RNDR — исходный токен ERC-20 на Ethereum. В ноябре 2023 года сеть переехала на Solana, и RNDR меняли на RENDER один к одному.',
          en: 'RNDR was the original ERC-20 token on Ethereum. In November 2023 the network moved to Solana, and holders swapped RNDR for RENDER at 1:1.',
        },
      },
      {
        question: { ru: 'Кто стоит за Render?', en: 'Who is behind Render?' },
        answer: {
          ru: 'Жюль Урбах, основатель OTOY — компании, которая выпускает программы для рендеринга. Идею он впервые описал в 2009 году.',
          en: 'Jules Urbach, founder of OTOY, a company that makes rendering software. He first described the idea in 2009.',
        },
      },
    ],
    glossaryTerms: [
      { slug: 'erc-20', label: { ru: 'ERC-20', en: 'ERC-20' } },
      { slug: 'ico', label: { ru: 'ICO', en: 'ICO' } },
      { slug: 'blockchain', label: { ru: 'Блокчейн', en: 'Blockchain' } },
    ],
  },

  filecoin: {
    stats: [
      { label: { ru: 'Запуск основной сети', en: 'Mainnet' }, value: '2020' },
      { label: { ru: 'Основатель', en: 'Founder' }, value: 'Juan Benet, Protocol Labs' },
      { label: { ru: 'Токенсейл 2017', en: '2017 token sale' }, value: { ru: 'более 205 млн долларов', en: 'over 205 million dollars' } },
      { label: { ru: 'Доказательства', en: 'Proofs' }, value: 'Proof of Replication, Proof of Spacetime' },
    ],
    investmentReference: [
      { yearsAgo: 5, year: 2021, price: 63.88, label: { ru: '5 лет назад (ноябрь 2021)', en: '5 years ago (November 2021)' }, note: { ru: 'Через семь месяцев после максимума', en: 'Seven months after the all-time high' } },
      { yearsAgo: 3, year: 2023, price: 3.938, label: { ru: '3 года назад (ноябрь 2023)', en: '3 years ago (November 2023)' }, note: { ru: 'После падения 2022 года', en: 'After the 2022 decline' } },
      { yearsAgo: 1, year: 2025, price: 1.672, label: { ru: '1 год назад (ноябрь 2025)', en: '1 year ago (November 2025)' }, note: { ru: 'До минимума 2026 года', en: 'Before the 2026 low' } },
    ],
    faq: [
      {
        question: { ru: 'Что такое Filecoin?', en: 'What is Filecoin?' },
        answer: {
          ru: 'Децентрализованная сеть хранения. Провайдеры сдают место на дисках, хранят файлы клиентов и получают FIL, а каждые 24 часа доказывают, что данные на месте.',
          en: 'A decentralised storage network. Providers rent out disk space, store clients’ files and earn FIL. Every 24 hours they must prove the data is still there.',
        },
      },
      {
        question: { ru: 'Как Filecoin связан с IPFS?', en: 'How is Filecoin linked to IPFS?' },
        answer: {
          ru: 'Оба проекта сделала Protocol Labs, которую основал Хуан Бенет. IPFS находит файлы по их содержимому, а Filecoin добавляет рынок, который платит за их хранение.',
          en: 'Both come from Protocol Labs, founded by Juan Benet. IPFS addresses files by their content; Filecoin adds a market that pays providers to keep them.',
        },
      },
      {
        question: { ru: 'Когда FIL стоил дороже всего?', en: 'When did FIL reach its all-time high?' },
        answer: {
          ru: '1 апреля 2021 года, 236,84 доллара, меньше чем через полгода после запуска сети.',
          en: 'On 1 April 2021, at 236.84 dollars, less than six months after the mainnet launch.',
        },
      },
    ],
    glossaryTerms: [
      { slug: 'ico', label: { ru: 'ICO', en: 'ICO' } },
      { slug: 'mining', label: { ru: 'Майнинг', en: 'Mining' } },
      { slug: 'whitepaper', label: { ru: 'Whitepaper', en: 'Whitepaper' } },
    ],
  },
};
