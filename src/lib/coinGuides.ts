import type { InvestmentReference } from '@/components/ui/CoinCalculator';

export interface CoinFaqItem {
  question: { ru: string; en: string };
  answer: { ru: string; en: string };
}

export interface CoinStat {
  label: { ru: string; en: string };
  value: string;
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
};
