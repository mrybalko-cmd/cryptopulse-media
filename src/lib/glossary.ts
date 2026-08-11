/**
 * Date the current stock of short definitions was written.
 *
 * Terms rewritten since then carry their own `updated` and use that instead;
 * this is the floor for everything else. It is a frozen constant rather than
 * the file's commit date on purpose: this file holds all 65 terms, so taking
 * its commit date would re-stamp every untouched term as freshly updated every
 * time a single term is expanded. Bump it only when the whole set is revised.
 */
export const GLOSSARY_BASELINE = '2026-07-30';

export interface Bilingual { ru: string; en: string }

/** Broad buckets used for the category chip and, more importantly, as the
 *  fallback for "related terms" on entries that don't yet name their own. */
export type GlossaryCategory =
  | 'basics' | 'wallets' | 'trading' | 'defi' | 'tech'
  | 'compliance' | 'tokens' | 'slang' | 'security';

export const CATEGORY_LABELS: Record<GlossaryCategory, Bilingual> = {
  basics:     { ru: 'Основы',        en: 'Basics' },
  wallets:    { ru: 'Кошельки',      en: 'Wallets' },
  trading:    { ru: 'Торговля',      en: 'Trading' },
  defi:       { ru: 'DeFi',          en: 'DeFi' },
  tech:       { ru: 'Технологии',    en: 'Technology' },
  compliance: { ru: 'Регулирование', en: 'Compliance' },
  tokens:     { ru: 'Токены',        en: 'Tokens' },
  slang:      { ru: 'Сленг',         en: 'Slang' },
  security:   { ru: 'Безопасность',  en: 'Security' },
};

/** A worked example. Crypto terms turn concrete the moment real numbers are
 *  attached, and a calculation a reader can follow is also the part search
 *  engines and assistants quote.
 *
 *  Values are bilingual like everything else, because number formatting is not
 *  locale-neutral: Russian writes 10 000,00 where English writes 10,000.00.
 *  Shipping one form to both audiences reads as broken to whichever one it
 *  isn't written for. */
export interface GlossaryExample {
  setup: Bilingual;
  rows: { label: Bilingual; value: Bilingual }[];
  total?: { label: Bilingual; value: Bilingual };
  outcome: Bilingual;
}

export interface GlossaryBullet { title: Bilingual; text: Bilingual }

/** One section of the expanded entry. Every field past `heading` is optional so
 *  a section can be prose, a list, a worked example, or a combination, without
 *  forcing every term into the same shape — "Whitepaper" has nothing to
 *  calculate, "Slippage" is mostly calculation. */
export interface GlossarySection {
  heading: Bilingual;
  paragraphs?: Bilingual[];
  bullets?: GlossaryBullet[];
  example?: GlossaryExample;
}

export interface GlossaryTerm {
  slug: string;
  term: Bilingual;
  /** The short, self-contained answer. Stays short on purpose: it is the
   *  schema description, the meta description, and the passage an assistant
   *  lifts when it cites the page. Expansion belongs in `sections`. */
  definition: Bilingual;
  category?: GlossaryCategory;
  /** The expanded entry. Absent means the term still shows definition only —
   *  terms are being expanded in batches and the page renders both shapes. */
  sections?: GlossarySection[];
  /** Curated related slugs. Without this the page falls back to other terms in
   *  the same category, which is at least topical; it used to show whichever
   *  terms happened to sit next to this one in the array. */
  related?: string[];
  /** ISO date (YYYY-MM-DD) this term's own text was last rewritten. Set it when
   *  you edit a single term; the sitemap falls back to the file's commit date
   *  for terms that don't carry one, so a term is never stamped fresher than it
   *  is. */
  updated?: string;
}

export const GLOSSARY: GlossaryTerm[] = [
  {
    slug: 'bitcoin',
    category: 'basics',
    term: { ru: 'Биткоин', en: 'Bitcoin' },
    definition: {
      ru: 'Первая и самая известная криптовалюта, созданная в 2009 году анонимным автором (или группой) под псевдонимом Сатоши Накамото. Работает без центрального банка или посредников — все транзакции записываются в общедоступный блокчейн.',
      en: 'The first and most well-known cryptocurrency, created in 2009 by an anonymous author (or group) under the pseudonym Satoshi Nakamoto. It works without a central bank or intermediaries — every transaction is recorded on a public blockchain.',
    },
  },
  {
    slug: 'blockchain',
    category: 'tech',
    term: { ru: 'Блокчейн', en: 'Blockchain' },
    definition: {
      ru: 'Распределённая база данных, состоящая из цепочки блоков с информацией о транзакциях. Каждый новый блок ссылается на предыдущий, что делает изменение прошлых записей практически невозможным без согласия всей сети.',
      en: 'A distributed database made up of a chain of blocks containing transaction data. Each new block references the previous one, which makes altering past records nearly impossible without the agreement of the entire network.',
    },
  },
  {
    slug: 'hash',
    category: 'tech',
    term: { ru: 'Хеш', en: 'Hash' },
    definition: {
      ru: 'Уникальная строка фиксированной длины, которая получается из любых данных с помощью математической функции. Малейшее изменение исходных данных полностью меняет хеш, поэтому он используется для подтверждения целостности блоков и транзакций.',
      en: 'A unique, fixed-length string produced from any input data using a mathematical function. The smallest change to the input completely changes the hash, which is why it is used to verify the integrity of blocks and transactions.',
    },
  },
  {
    slug: 'transaction',
    category: 'basics',
    term: { ru: 'Транзакция', en: 'Transaction' },
    definition: {
      ru: 'Запись о переводе криптовалюты с одного адреса на другой. После подтверждения сетью транзакция становится частью блокчейна и её уже нельзя отменить или изменить.',
      en: 'A record of a cryptocurrency transfer from one address to another. Once confirmed by the network, a transaction becomes part of the blockchain and can no longer be reversed or altered.',
    },
  },
  {
    slug: 'wallet',
    category: 'wallets',
    term: { ru: 'Кошелёк', en: 'Wallet' },
    definition: {
      ru: 'Программа или устройство для хранения приватных ключей, которые дают доступ к криптовалюте на блокчейне. Сама криптовалюта физически не «лежит» в кошельке — он лишь хранит ключи для управления ею.',
      en: 'Software or a device for storing the private keys that give access to cryptocurrency on the blockchain. The coins themselves are not physically "stored" in the wallet — it only holds the keys needed to control them.',
    },
  },
  {
    slug: 'private-key',
    category: 'wallets',
    term: { ru: 'Приватный ключ', en: 'Private key' },
    definition: {
      ru: 'Секретный код, который доказывает право собственности на криптовалюту и позволяет подписывать транзакции. Тот, кто знает приватный ключ, полностью контролирует средства — его нельзя никому передавать.',
      en: 'A secret code that proves ownership of cryptocurrency and allows you to sign transactions. Whoever knows the private key has full control over the funds — it should never be shared with anyone.',
    },
  },
  {
    slug: 'public-key',
    category: 'wallets',
    term: { ru: 'Публичный ключ', en: 'Public key' },
    definition: {
      ru: 'Криптографический ключ, из которого формируется адрес кошелька для получения средств. В отличие от приватного ключа, его можно свободно показывать другим — это аналог номера банковского счёта.',
      en: 'A cryptographic key from which a wallet address is derived to receive funds. Unlike a private key, it can be safely shared with others — similar to a bank account number.',
    },
  },
  {
    slug: 'seed-phrase',
    category: 'wallets',
    term: { ru: 'Сид-фраза', en: 'Seed phrase' },
    definition: {
      "ru": "Сид-фраза — набор из 12 или 24 слов, из которого восстанавливаются все ключи кошелька. Это и есть доступ к деньгам: кто знает фразу, тот владеет средствами, а при потере восстановить её невозможно.",
      "en": "A seed phrase is a set of 12 or 24 words from which every key in a wallet is regenerated. It is the access itself: whoever knows the phrase owns the funds, and if you lose it there is no way to recover it."
    },
    updated: '2026-08-11',
    related: [
      "private-key",
      "wallet",
      "cold-wallet",
      "hot-wallet",
      "non-custodial-wallet",
      "public-key"
    ],
    sections: [
      {
        "heading": {
          "ru": "Как это работает",
          "en": "How it works"
        },
        "paragraphs": [
          {
            "ru": "Слова берутся из фиксированного словаря на 2048 слов по стандарту BIP-39. Из этой последовательности математически выводятся все приватные ключи и адреса кошелька, причём всегда одни и те же.",
            "en": "The words come from a fixed 2,048-word list defined by BIP-39. Every private key and address in the wallet is derived mathematically from that sequence, and always derives to the same result."
          },
          {
            "ru": "Поэтому фразу можно ввести в любой совместимый кошелёк на любом устройстве и получить те же адреса с теми же деньгами. Само приложение ничего не хранит: оно каждый раз пересчитывает ключи из фразы.",
            "en": "That is why the phrase can be typed into any compatible wallet on any device and produce the same addresses holding the same money. The app stores nothing; it recomputes the keys from the phrase each time."
          },
          {
            "ru": "По той же причине фразу нельзя сбросить или сменить, как пароль. Никакой поддержки, которая её восстановит, не существует, и любой, кто предлагает это сделать, вас обманывает.",
            "en": "For the same reason the phrase cannot be reset or changed like a password. No support desk exists that can restore it, and anyone offering to is lying to you."
          }
        ]
      },
      {
        "heading": {
          "ru": "Почему её крадут, а не взламывают",
          "en": "Why it gets stolen rather than cracked"
        },
        "example": {
          "setup": {
            "ru": "Оценим, сколько вариантов защищает фразу из 12 слов.",
            "en": "Here is the size of the space a 12-word phrase covers."
          },
          "rows": [
            {
              "label": {
                "ru": "Слов в словаре BIP-39",
                "en": "Words in the BIP-39 list"
              },
              "value": { "ru": "2 048", "en": "2,048" }
            },
            {
              "label": {
                "ru": "Длина фразы",
                "en": "Phrase length"
              },
              "value": { "ru": "12", "en": "12" }
            },
            {
              "label": {
                "ru": "Стойкость",
                "en": "Entropy"
              },
              "value": { "ru": "128 бит", "en": "128 bits" }
            }
          ],
          "outcome": {
            "ru": "Перебрать это невозможно никакими вычислительными мощностями. Поэтому фразы не взламывают, а забирают у владельца: со скриншота в галерее, из заметки в облаке, через фальшивую страницу «восстановления кошелька» или поддельную поддержку.",
            "en": "No amount of computing power brute-forces that. So phrases are not cracked, they are taken from the owner: off a screenshot in the gallery, out of a cloud note, through a fake \"wallet recovery\" page or an impostor support account."
          }
        }
      },
      {
        "heading": {
          "ru": "Как хранить",
          "en": "How to store it"
        },
        "bullets": [
          {
            "title": {
              "ru": "Только офлайн",
              "en": "Offline only"
            },
            "text": {
              "ru": "Бумага в двух разных местах или выбитая на металле пластина. Фото, скриншот, заметка и мессенджер исключены.",
              "en": "Paper in two separate places, or stamped into a metal plate. Photos, screenshots, notes apps and messengers are out."
            }
          },
          {
            "title": {
              "ru": "Проверьте восстановление заранее",
              "en": "Test the restore before you need it"
            },
            "text": {
              "ru": "Записанная с ошибкой фраза обнаруживается в худший момент. Восстановите кошелёк на пустом устройстве и убедитесь, что адреса совпали.",
              "en": "A phrase written down wrong reveals itself at the worst moment. Restore the wallet on a clean device and confirm the addresses match."
            }
          },
          {
            "title": {
              "ru": "Её никто не спрашивает",
              "en": "Nobody legitimately asks"
            },
            "text": {
              "ru": "Ни поддержка кошелька, ни биржа, ни «проверка на совместимость». Запрос фразы — это и есть атака, без исключений.",
              "en": "Not wallet support, not an exchange, not a \"compatibility check\". A request for the phrase is the attack itself, without exception."
            }
          },
          {
            "title": {
              "ru": "Учтите наследование",
              "en": "Plan for inheritance"
            },
            "text": {
              "ru": "Если фразу не найдёт никто, кроме вас, деньги исчезнут вместе с вами. Это решается конвертом у нотариуса или разделением фразы на части.",
              "en": "If nobody but you can find the phrase, the money leaves with you. A sealed envelope with a notary, or splitting the phrase into parts, solves it."
            }
          },
          {
            "title": {
              "ru": "Дополнительное слово",
              "en": "The extra word"
            },
            "text": {
              "ru": "BIP-39 позволяет добавить к фразе собственную passphrase. Она защищает при краже бумаги, но при её утрате деньги теряются так же безвозвратно.",
              "en": "BIP-39 lets you add your own passphrase on top. It protects against the paper being stolen, and losing it loses the money just as finally."
            }
          }
        ]
      }
    ],
  },
  {
    slug: 'mining',
    category: 'tech',
    term: { ru: 'Майнинг', en: 'Mining' },
    definition: {
      ru: 'Процесс подтверждения транзакций и создания новых блоков в сетях с механизмом Proof-of-Work, например в Bitcoin. Майнеры решают сложные вычислительные задачи и получают вознаграждение в криптовалюте.',
      en: 'The process of verifying transactions and creating new blocks in Proof-of-Work networks, such as Bitcoin. Miners solve complex computational puzzles and are rewarded with cryptocurrency.',
    },
  },
  {
    slug: 'node',
    category: 'tech',
    term: { ru: 'Нода', en: 'Node' },
    definition: {
      ru: 'Компьютер, подключённый к сети блокчейна, который хранит копию реестра и проверяет транзакции по правилам протокола. Чем больше независимых нод, тем устойчивее и децентрализованнее сеть.',
      en: 'A computer connected to a blockchain network that stores a copy of the ledger and validates transactions according to the protocol\'s rules. The more independent nodes there are, the more resilient and decentralized the network.',
    },
  },
  {
    slug: 'smart-contract',
    category: 'tech',
    term: { ru: 'Смарт-контракт', en: 'Smart contract' },
    definition: {
      ru: 'Программа, которая автоматически выполняется на блокчейне при выполнении заданных условий, без участия посредников. Лежит в основе большинства приложений DeFi, NFT и DAO.',
      en: 'A program that automatically executes on the blockchain once predefined conditions are met, without intermediaries. It powers most DeFi, NFT, and DAO applications.',
    },
  },
  {
    slug: 'gas-fee',
    category: 'tech',
    term: { ru: 'Газ (комиссия)', en: 'Gas fee' },
    definition: {
      "ru": "Газ — плата за вычисления в сети. Вы платите не за сумму перевода, а за работу, которую сеть выполняет: простая отправка стоит дёшево, обмен через смарт-контракт дороже, и цена растёт, когда в сети очередь.",
      "en": "Gas is the fee for computation on a network. You pay for the work the network does rather than for the amount you send: a plain transfer is cheap, a swap through a smart contract costs more, and the price climbs when the network is busy."
    },
    updated: '2026-08-11',
    related: [
      "gwei",
      "transaction",
      "smart-contract",
      "layer-2",
      "node",
      "blockchain"
    ],
    sections: [
      {
        "heading": {
          "ru": "Как это работает",
          "en": "How it works"
        },
        "paragraphs": [
          {
            "ru": "У каждой операции есть цена в единицах газа, зависящая от её сложности. Простой перевод ETH стоит 21 000 единиц, обмен на DEX — около 150 000, а сложные операции с несколькими контрактами уходят за 300 000.",
            "en": "Every operation has a price in units of gas set by its complexity. A plain ETH transfer costs 21,000 units, a DEX swap around 150,000, and operations touching several contracts run past 300,000."
          },
          {
            "ru": "Итог считается как количество единиц, умноженное на цену за единицу. Цена измеряется в gwei, миллиардных долях ETH, и определяется спросом: когда транзакций много, за место в блоке идёт торг и цена растёт.",
            "en": "The total is units multiplied by price per unit. That price is measured in gwei, billionths of an ETH, and is set by demand: when transactions pile up, block space is bid for and the price rises."
          },
          {
            "ru": "С 2021 года плата делится на базовую часть, которая сжигается, и чаевые валидатору за приоритет. Поднимая чаевые, вы двигаетесь в очереди быстрее, но саму базовую часть это не меняет.",
            "en": "Since 2021 the fee splits into a base portion, which is burned, and a tip to the validator for priority. Raising the tip moves you up the queue without changing the base."
          }
        ]
      },
      {
        "heading": {
          "ru": "Пример с числами",
          "en": "A worked example"
        },
        "example": {
          "setup": {
            "ru": "Обычный перевод ETH: 21 000 единиц газа, базовая плата 18 gwei, чаевые 2 gwei, ETH стоит $2 400.",
            "en": "A plain ETH transfer: 21,000 units of gas, an 18 gwei base fee, a 2 gwei tip, ETH at $2,400."
          },
          "rows": [
            {
              "label": {
                "ru": "21 000 × 20 gwei",
                "en": "21,000 × 20 gwei"
              },
              "value": { "ru": "0,00042 ETH", "en": "0.00042 ETH" }
            },
            {
              "label": {
                "ru": "В долларах",
                "en": "In dollars"
              },
              "value": { "ru": "$1,01", "en": "$1.01" }
            },
            {
              "label": {
                "ru": "То же при 80 gwei",
                "en": "The same at 80 gwei"
              },
              "value": { "ru": "$4,03", "en": "$4.03" }
            }
          ],
          "outcome": {
            "ru": "Тот же перевод в загруженной сети дороже вчетверо, а обмен на DEX тратит примерно в семь раз больше газа, чем перевод. Сумма при этом не важна: отправка $10 и $10 000 стоит одинаково.",
            "en": "The same transfer costs four times more on a busy network, and a DEX swap burns roughly seven times the gas of a transfer. The amount is irrelevant: sending $10 and $10,000 costs the same."
          }
        }
      },
      {
        "heading": {
          "ru": "Как платить меньше",
          "en": "How to pay less"
        },
        "bullets": [
          {
            "title": {
              "ru": "Смотрите на загрузку сети",
              "en": "Watch the load"
            },
            "text": {
              "ru": "Разница между часом пик и спокойным временем — в разы. Несрочную операцию дешевле отложить.",
              "en": "Peak and quiet hours differ by multiples. A transaction that can wait should."
            }
          },
          {
            "title": {
              "ru": "Используйте Layer 2",
              "en": "Use a Layer 2"
            },
            "text": {
              "ru": "Arbitrum, Base, Optimism выполняют те же операции за копейки, а расчёт всё равно попадает в Ethereum.",
              "en": "Arbitrum, Base and Optimism run the same operations for cents while still settling to Ethereum."
            }
          },
          {
            "title": {
              "ru": "Не путайте лимит и цену",
              "en": "Limit is not price"
            },
            "text": {
              "ru": "Лимит газа — потолок расхода, неизрасходованное вернётся. Цена за единицу — то, что реально определяет сумму.",
              "en": "The gas limit is a ceiling and the unused part comes back. The price per unit is what actually sets the bill."
            }
          },
          {
            "title": {
              "ru": "Проверяйте перед подписью",
              "en": "Read it before signing"
            },
            "text": {
              "ru": "Кошелёк показывает итоговую сумму до подтверждения. Комиссия в $40 за перевод на $30 видна заранее.",
              "en": "The wallet shows the total before you confirm. A $40 fee on a $30 transfer is visible in advance."
            }
          },
          {
            "title": {
              "ru": "Зависшую транзакцию можно ускорить",
              "en": "A stuck transaction can be pushed"
            },
            "text": {
              "ru": "Отправка с тем же nonce и большей ценой газа заменяет её. Просто ждать при низкой цене можно очень долго.",
              "en": "Resending with the same nonce and a higher gas price replaces it. Simply waiting at a low price can take a very long time."
            }
          }
        ]
      }
    ],
  },
  {
    slug: 'gwei',
    category: 'tech',
    term: { ru: 'Gwei', en: 'Gwei' },
    definition: {
      ru: 'Мельчайшая единица измерения эфира (ETH), в которой обычно указывается размер комиссии за газ. Один ETH равен миллиарду gwei.',
      en: 'A tiny denomination of ether (ETH) commonly used to express gas fees. One ETH equals one billion gwei.',
    },
  },
  {
    slug: 'altcoin',
    category: 'tokens',
    term: { ru: 'Альткоин', en: 'Altcoin' },
    definition: {
      ru: 'Любая криптовалюта, отличная от биткоина. Термин объединяет тысячи проектов — от Ethereum и Solana до небольших нишевых токенов.',
      en: 'Any cryptocurrency other than Bitcoin. The term covers thousands of projects — from Ethereum and Solana to small niche tokens.',
    },
  },
  {
    slug: 'stablecoin',
    category: 'tokens',
    term: { ru: 'Стейблкоин', en: 'Stablecoin' },
    definition: {
      "ru": "Стейблкоин — криптовалюта, привязанная к стоимости обычной валюты, чаще всего к доллару. Один USDT или USDC должен всегда стоить около доллара, поэтому в них держат деньги между сделками и ими же рассчитываются.",
      "en": "A stablecoin is a cryptocurrency pegged to the value of an ordinary currency, most often the dollar. One USDT or USDC should always be worth about a dollar, which is why people park money in them between trades and settle payments with them."
    },
    updated: '2026-08-11',
    related: [
      "fiat",
      "erc-20",
      "trc-20",
      "defi",
      "p2p",
      "exchange"
    ],
    sections: [
      {
        "heading": {
          "ru": "Как это работает",
          "en": "How it works"
        },
        "paragraphs": [
          {
            "ru": "Обеспеченные фиатом стейблкоины (USDT, USDC) держат резерв в долларах и коротких гособлигациях: на каждый выпущенный токен должен приходиться доллар в резерве. Привязку удерживает возможность погашения — крупный держатель может обменять токены у эмитента по номиналу, и арбитраж возвращает курс к доллару.",
            "en": "Fiat-backed stablecoins (USDT, USDC) hold reserves in dollars and short government debt: every issued token is meant to have a dollar behind it. The peg holds through redemption, since a large holder can exchange tokens with the issuer at par and arbitrage pulls the price back to a dollar."
          },
          {
            "ru": "Обеспеченные криптовалютой (DAI) работают иначе: залог в ETH и других монетах превышает выпуск, обычно в полтора раза, а излишек покрывает падение цены залога.",
            "en": "Crypto-backed ones (DAI) work differently: collateral in ETH and other coins exceeds the issued amount, typically by half again, and that excess absorbs a fall in the collateral's price."
          },
          {
            "ru": "Алгоритмические не держат резерва вовсе и удерживают цену выпуском и сжиганием второго токена. Такая конструкция уже разрушалась: в мае 2022 года UST потерял привязку, и около $40 млрд стоимости исчезло за несколько дней.",
            "en": "Algorithmic ones hold no reserve at all and defend the price by minting and burning a second token. That design has already failed: in May 2022 UST lost its peg and roughly $40bn of value disappeared within days."
          }
        ]
      },
      {
        "heading": {
          "ru": "Что бывает с привязкой",
          "en": "What happens to a peg"
        },
        "example": {
          "setup": {
            "ru": "Март 2023 года: у USDC $3,3 млрд резервов оказались в рухнувшем Silicon Valley Bank.",
            "en": "March 2023: $3.3bn of USDC reserves sat in the collapsed Silicon Valley Bank."
          },
          "rows": [
            {
              "label": {
                "ru": "Курс до новости",
                "en": "Before the news"
              },
              "value": { "ru": "$1,0000", "en": "$1.0000" }
            },
            {
              "label": {
                "ru": "Минимум 11 марта",
                "en": "Low on 11 March"
              },
              "value": { "ru": "≈ $0,8800", "en": "≈ $0.8800" }
            },
            {
              "label": {
                "ru": "Через три дня",
                "en": "Three days later"
              },
              "value": { "ru": "≈ $0,9990", "en": "≈ $0.9990" }
            }
          ],
          "outcome": {
            "ru": "Продавший на панике потерял около 12%, дождавшийся — почти ничего. Главный риск стейблкоина не в волатильности, а в том, что стоит за резервом и кто это проверяет.",
            "en": "Selling into the panic cost about 12%; waiting cost almost nothing. A stablecoin's real risk is not volatility but what backs the reserve and who verifies it."
          }
        }
      },
      {
        "heading": {
          "ru": "На что смотреть",
          "en": "What to weigh"
        },
        "bullets": [
          {
            "title": {
              "ru": "Чем обеспечен",
              "en": "What backs it"
            },
            "text": {
              "ru": "Наличные и короткие гособлигации — одно. Корпоративные бумаги, займы и «прочие активы» — другое.",
              "en": "Cash and short government paper are one thing. Corporate paper, loans and \"other assets\" are another."
            }
          },
          {
            "title": {
              "ru": "Кто и как часто подтверждает резерв",
              "en": "Who attests, and how often"
            },
            "text": {
              "ru": "Ежемесячный отчёт независимой фирмы и годовой пресс-релиз — разный уровень доверия.",
              "en": "A monthly report from an independent firm and an annual press release are not the same level of assurance."
            }
          },
          {
            "title": {
              "ru": "Под какое регулирование попадает",
              "en": "Which rules apply"
            },
            "text": {
              "ru": "В ЕС с 2024 года действует MiCA: у эмитентов стейблкоинов появились требования к резервам и лицензии. Это проверяемый признак, а не обещание.",
              "en": "In the EU, MiCA has applied since 2024, putting reserve requirements and licensing on stablecoin issuers. That is a checkable fact rather than a promise."
            }
          },
          {
            "title": {
              "ru": "Сеть выпуска",
              "en": "The network it lives on"
            },
            "text": {
              "ru": "Один и тот же USDT существует в ERC-20, TRC-20 и других сетях. Отправка не в ту сеть теряет деньги безвозвратно.",
              "en": "The same USDT exists as ERC-20, TRC-20 and more. Sending to the wrong network loses the money for good."
            }
          },
          {
            "title": {
              "ru": "Можно ли погасить",
              "en": "Whether you can redeem"
            },
            "text": {
              "ru": "Если обменять токены на доллары у эмитента может только клиент с миллионом, привязку удерживают не для вас.",
              "en": "If only a client with a million can redeem tokens for dollars with the issuer, the peg is not being defended on your behalf."
            }
          }
        ]
      }
    ],
  },
  {
    slug: 'defi',
    category: 'defi',
    term: { ru: 'DeFi', en: 'DeFi' },
    definition: {
      "ru": "DeFi — финансовые сервисы на смарт-контрактах, работающие без банка и брокера: обмен, займы, проценты на вложенное. Правила записаны в коде, доступ есть у любого кошелька, а посредника, который может отказать, нет.",
      "en": "DeFi is financial services built on smart contracts that run without a bank or a broker: swapping, lending, earning on deposits. The rules live in code, any wallet can use them, and there is no intermediary able to say no."
    },
    updated: '2026-08-11',
    related: [
      "smart-contract",
      "dex",
      "liquidity-pool",
      "staking",
      "yield-farming",
      "liquidation"
    ],
    sections: [
      {
        "heading": {
          "ru": "Как это работает",
          "en": "How it works"
        },
        "paragraphs": [
          {
            "ru": "Место банка занимает смарт-контракт. Условия займа, ставка и правила ликвидации записаны в его коде заранее и выполняются автоматически, одинаково для всех. Заявку никто не рассматривает, и отказать вам некому.",
            "en": "A smart contract stands where the bank used to. Loan terms, rates and liquidation rules are written into its code up front and execute automatically, identically for everyone. No application is reviewed, and nobody is there to decline it."
          },
          {
            "ru": "Средства при этом остаются в вашем кошельке или в контракте, к которому ключ есть только у вас. Это же и главная разница с биржей: некому заморозить счёт, но и некому вернуть деньги, если вы ошиблись.",
            "en": "Your funds stay in your own wallet, or in a contract only your key controls. That is also the sharpest difference from an exchange: nobody can freeze the account, and nobody can return the money when you get something wrong."
          },
          {
            "ru": "Протоколы собираются друг из друга как детали: полученный в одном месте токен-расписку кладут залогом в другом, а доход с него — в третьем. Удобно и ровно поэтому опасно: сбой в нижнем контракте тянет за собой всю цепочку.",
            "en": "Protocols slot into each other like parts: a receipt token from one becomes collateral in another, and its yield goes into a third. Convenient, and dangerous for exactly that reason, since a failure in the bottom contract drags the whole stack with it."
          }
        ]
      },
      {
        "heading": {
          "ru": "Пример с числами",
          "en": "A worked example"
        },
        "example": {
          "setup": {
            "ru": "Вы кладёте 1 ETH по $2 400 в залог и берёте заём в USDT. Протокол выдаёт максимум 75% от залога, ликвидация наступает при 85%.",
            "en": "You post 1 ETH at $2,400 as collateral and borrow USDT. The protocol lends up to 75% of the collateral and liquidates at 85%."
          },
          "rows": [
            {
              "label": {
                "ru": "Залог",
                "en": "Collateral"
              },
              "value": { "ru": "$2 400,00", "en": "$2,400.00" }
            },
            {
              "label": {
                "ru": "Максимум к займу (75%)",
                "en": "Borrowing limit, 75%"
              },
              "value": { "ru": "$1 800,00", "en": "$1,800.00" }
            },
            {
              "label": {
                "ru": "Взяли",
                "en": "Borrowed"
              },
              "value": { "ru": "$1 200,00", "en": "$1,200.00" }
            }
          ],
          "total": {
            "label": {
              "ru": "Цена ETH при ликвидации",
              "en": "ETH price at liquidation"
            },
            "value": { "ru": "$1 411,76", "en": "$1,411.76" }
          },
          "outcome": {
            "ru": "Пока ETH выше $1 412, позиция жива. Ниже — протокол сам продаст залог, чтобы закрыть долг, и удержит штраф сверху. Никто не позвонит и не предупредит: это делает код.",
            "en": "Above $1,412 the position survives. Below it the protocol sells the collateral to clear the debt and keeps a penalty on top. No call, no warning: code does it."
          }
        }
      },
      {
        "heading": {
          "ru": "Чем рискуете",
          "en": "Where the risk sits"
        },
        "bullets": [
          {
            "title": {
              "ru": "Ошибка в контракте",
              "en": "A bug in the contract"
            },
            "text": {
              "ru": "Код неизменен после развёртывания, поэтому ошибку часто нельзя починить, а вывести средства успевает атакующий.",
              "en": "Code is immutable once deployed, so a flaw often cannot be patched, and the attacker is the one who gets the funds out."
            }
          },
          {
            "title": {
              "ru": "Оракул цены",
              "en": "The price oracle"
            },
            "text": {
              "ru": "Протокол узнаёт цену снаружи. Подмена или задержка данных вызывает ликвидации там, где рынок этого не требовал.",
              "en": "A protocol learns the price from outside. Manipulated or stale data triggers liquidations the market never called for."
            }
          },
          {
            "title": {
              "ru": "Ликвидация необратима",
              "en": "Liquidation is final"
            },
            "text": {
              "ru": "Отменить её и договориться не с кем. Единственная защита — запас по залогу.",
              "en": "There is nobody to reverse it or negotiate with. The only defence is collateral headroom."
            }
          },
          {
            "title": {
              "ru": "Комиссии сети",
              "en": "Network fees"
            },
            "text": {
              "ru": "В загруженной сети операция стоит десятки долларов, и небольшие суммы теряют смысл.",
              "en": "On a busy network a single operation costs tens of dollars, which erases the point of small amounts."
            }
          },
          {
            "title": {
              "ru": "Доходность из инфляции токена",
              "en": "Yield printed out of thin air"
            },
            "text": {
              "ru": "Заявленные сотни процентов часто выплачиваются собственным токеном протокола. Его цена падает ровно потому, что его печатают.",
              "en": "Triple-digit rates are often paid in the protocol's own token, whose price falls for precisely the reason it is being printed."
            }
          }
        ]
      }
    ],
  },
  {
    slug: 'nft',
    category: 'tokens',
    term: { ru: 'NFT', en: 'NFT' },
    definition: {
      "ru": "NFT — токен, существующий в единственном экземпляре и потому не взаимозаменяемый: один биткоин равен любому другому, а два NFT всегда разные. Так на блокчейне закрепляют право на конкретный предмет: картинку, внутриигровую вещь, билет.",
      "en": "An NFT is a token that exists in a single copy and therefore is not interchangeable: one bitcoin equals any other, while two NFTs are always different. It is how a claim to one specific thing is recorded on a blockchain: an image, an in-game item, a ticket."
    },
    updated: '2026-08-11',
    related: [
      "erc-20",
      "smart-contract",
      "wallet",
      "tokenomics",
      "airdrop",
      "dao"
    ],
    sections: [
      {
        "heading": {
          "ru": "Как это работает",
          "en": "How it works"
        },
        "paragraphs": [
          {
            "ru": "Стандарт ERC-721 присваивает каждому токену собственный номер внутри коллекции. Блокчейн хранит, какому адресу принадлежит токен с этим номером, и историю всех его переходов.",
            "en": "The ERC-721 standard gives every token its own number inside a collection. The blockchain records which address owns the token with that number, and the full history of its transfers."
          },
          {
            "ru": "Сам файл в блокчейне почти никогда не лежит: он слишком тяжёлый. Токен хранит ссылку на изображение, и вопрос, где именно оно находится, важнее, чем кажется. Ссылка на IPFS с адресацией по содержимому переживёт исчезновение проекта, обычная ссылка на сервер — нет.",
            "en": "The file itself is almost never on-chain, being far too heavy. The token stores a link to the image, and where that image actually lives matters more than it looks. A content-addressed IPFS link outlives the project; an ordinary server link does not."
          },
          {
            "ru": "Владение токеном и авторские права — разные вещи. Если в условиях коллекции прямо не передана лицензия, покупка даёт запись в блокчейне, а не право использовать изображение.",
            "en": "Owning the token and owning the copyright are separate. Unless the collection's terms hand over a licence explicitly, the purchase buys an entry on a blockchain rather than the right to use the picture."
          }
        ]
      },
      {
        "heading": {
          "ru": "Пример с числами",
          "en": "A worked example"
        },
        "example": {
          "setup": {
            "ru": "Вы продали NFT за 2 ETH. Роялти автора коллекции 7,5%, комиссия площадки 2,5%.",
            "en": "You sell an NFT for 2 ETH. The collection's creator royalty is 7.5% and the marketplace takes 2.5%."
          },
          "rows": [
            {
              "label": {
                "ru": "Цена продажи",
                "en": "Sale price"
              },
              "value": { "ru": "2,0000 ETH", "en": "2.0000 ETH" }
            },
            {
              "label": {
                "ru": "Роялти автору, 7,5%",
                "en": "Creator royalty, 7.5%"
              },
              "value": { "ru": "−0,1500 ETH", "en": "−0.1500 ETH" }
            },
            {
              "label": {
                "ru": "Комиссия площадки, 2,5%",
                "en": "Marketplace fee, 2.5%"
              },
              "value": { "ru": "−0,0500 ETH", "en": "−0.0500 ETH" }
            }
          ],
          "total": {
            "label": {
              "ru": "На руки",
              "en": "Net"
            },
            "value": { "ru": "1,8000 ETH", "en": "1.8000 ETH" }
          },
          "outcome": {
            "ru": "Десять процентов ушло ещё до газа. Купив за 1,9 ETH и продав за 2 ETH, вы выходите в минус, хотя цена «выросла».",
            "en": "Ten percent left before gas. Buying at 1.9 ETH and selling at 2 ETH puts you underwater, even though the price \"went up\"."
          }
        }
      },
      {
        "heading": {
          "ru": "На что смотреть",
          "en": "What to weigh"
        },
        "bullets": [
          {
            "title": {
              "ru": "Где хранится файл",
              "en": "Where the file lives"
            },
            "text": {
              "ru": "IPFS или Arweave переживут проект. Ссылка на сайт команды исчезнет вместе с оплатой хостинга.",
              "en": "IPFS or Arweave outlast the project. A link to the team's website disappears with the hosting bill."
            }
          },
          {
            "title": {
              "ru": "Ликвидность коллекции",
              "en": "Whether it trades"
            },
            "text": {
              "ru": "Цена последней продажи ничего не значит, если сделок две в месяц. Смотрите на число продаж, а не на floor price.",
              "en": "A last-sale price means nothing at two trades a month. Read the sales count, not the floor price."
            }
          },
          {
            "title": {
              "ru": "Что именно вы покупаете",
              "en": "What you are actually buying"
            },
            "text": {
              "ru": "Права, лицензия, доступ куда-то или просто запись — это должно быть написано, а не подразумеваться.",
              "en": "Rights, a licence, access to something, or just a record: it has to be written down rather than implied."
            }
          },
          {
            "title": {
              "ru": "Комиссии на выходе",
              "en": "The cost of leaving"
            },
            "text": {
              "ru": "Роялти и комиссия площадки съедают до 10%. Заложите их в цену покупки заранее.",
              "en": "Royalty plus marketplace fee runs to 10%. Price that into the purchase up front."
            }
          },
          {
            "title": {
              "ru": "Подделки коллекций",
              "en": "Cloned collections"
            },
            "text": {
              "ru": "Копию коллекции создать ничего не стоит. Сверяйте адрес контракта с официальным, а не название и картинку.",
              "en": "Cloning a collection costs nothing. Check the contract address against the official one rather than the name and the artwork."
            }
          }
        ]
      }
    ],
  },
  {
    slug: 'dex',
    category: 'defi',
    term: { ru: 'DEX (децентрализованная биржа)', en: 'DEX (decentralized exchange)' },
    definition: {
      ru: 'Биржа, на которой сделки проходят напрямую между пользователями через смарт-контракты, без центральной компании-оператора и без передачи средств на хранение третьей стороне.',
      en: 'An exchange where trades happen directly between users via smart contracts, without a central operating company and without depositing funds with a third party.',
    },
  },
  {
    slug: 'cex',
    category: 'trading',
    term: { ru: 'CEX (централизованная биржа)', en: 'CEX (centralized exchange)' },
    definition: {
      ru: 'Биржа, управляемая компанией, которая хранит средства пользователей на своих кошельках и обеспечивает ликвидность и сопоставление ордеров (например, Binance, Coinbase).',
      en: 'An exchange run by a company that holds user funds in its own wallets and provides liquidity and order matching (for example, Binance, Coinbase).',
    },
  },
  {
    slug: 'staking',
    category: 'defi',
    term: { ru: 'Стейкинг', en: 'Staking' },
    definition: {
      "ru": "Стейкинг — блокировка монет в сети ради вознаграждения. Ваши монеты помогают подтверждать транзакции по механизму Proof-of-Stake, а сеть платит за это процент, обычно 3–12% годовых.",
      "en": "Staking means locking coins in a network to earn a reward. Your coins help confirm transactions under Proof-of-Stake, and the network pays a percentage for it, usually 3–12% a year."
    },
    updated: '2026-08-11',
    related: [
      "proof-of-stake",
      "defi",
      "liquidity-pool",
      "yield-farming",
      "node",
      "cex"
    ],
    sections: [
      {
        "heading": {
          "ru": "Как это работает",
          "en": "How it works"
        },
        "paragraphs": [
          {
            "ru": "В Proof-of-Stake право записать следующий блок достаётся не тому, у кого мощнее оборудование, а тому, кто заблокировал монеты. Чем больше ставка, тем чаще выпадает очередь и тем выше вознаграждение.",
            "en": "Under Proof-of-Stake the right to write the next block goes not to the strongest hardware but to whoever has locked up coins. The larger the stake, the more often the turn comes and the bigger the reward."
          },
          {
            "ru": "Ставить можно самому, подняв валидатор (в Ethereum это 32 ETH и постоянно работающий сервер), либо делегировать монеты чужому валидатору или бирже. Во втором случае часть дохода забирает комиссия.",
            "en": "You can stake yourself by running a validator (32 ETH and an always-on server, on Ethereum), or delegate your coins to someone else's validator or an exchange. The second route gives away part of the yield as a fee."
          },
          {
            "ru": "Монеты обычно нельзя забрать мгновенно: у сети есть период разблокировки, от нескольких часов до нескольких недель. Всё это время цена движется, а продать вы не можете.",
            "en": "The coins rarely come back instantly: networks impose an unbonding period running from hours to weeks. The price keeps moving throughout, and you cannot sell."
          }
        ]
      },
      {
        "heading": {
          "ru": "Пример с числами",
          "en": "A worked example"
        },
        "example": {
          "setup": {
            "ru": "Вы стейкаете 10 ETH под 4% годовых через валидатора с комиссией 10%.",
            "en": "You stake 10 ETH at 4% a year through a validator charging a 10% fee."
          },
          "rows": [
            {
              "label": {
                "ru": "Начислено за год",
                "en": "Earned over the year"
              },
              "value": { "ru": "0,4000 ETH", "en": "0.4000 ETH" }
            },
            {
              "label": {
                "ru": "Комиссия валидатора 10%",
                "en": "Validator fee, 10%"
              },
              "value": { "ru": "−0,0400 ETH", "en": "−0.0400 ETH" }
            }
          ],
          "total": {
            "label": {
              "ru": "На руки",
              "en": "Net"
            },
            "value": { "ru": "0,3600 ETH", "en": "0.3600 ETH" }
          },
          "outcome": {
            "ru": "Чистая доходность вышла 3,6% вместо 4%. Считать её нужно в монетах, а не в деньгах: если ETH за тот же год подешевеет на 20%, ваши 10,36 ETH будут стоить меньше, чем стоили 10 ETH на старте.",
            "en": "The net came to 3.6% rather than 4%. Count it in coins rather than in money: if ETH falls 20% over the same year, your 10.36 ETH is worth less than the 10 ETH you began with."
          }
        }
      },
      {
        "heading": {
          "ru": "На что смотреть",
          "en": "What to weigh"
        },
        "bullets": [
          {
            "title": {
              "ru": "Период разблокировки",
              "en": "The unbonding period"
            },
            "text": {
              "ru": "Главный скрытый риск. Обвал случается ровно тогда, когда монеты заперты на три недели.",
              "en": "The main hidden risk. A crash lands precisely while the coins are locked for three weeks."
            }
          },
          {
            "title": {
              "ru": "Комиссия валидатора",
              "en": "The validator's cut"
            },
            "text": {
              "ru": "От 5% до 25% дохода. Разница между 5% и 20% комиссии — это разница между 3,8% и 3,2% годовых.",
              "en": "Anywhere from 5% to 25% of the yield. The gap between a 5% and a 20% fee is the gap between 3.8% and 3.2% a year."
            }
          },
          {
            "title": {
              "ru": "Слэшинг",
              "en": "Slashing"
            },
            "text": {
              "ru": "За сбои валидатора сеть штрафует, и часть ставки списывается. Делегируя, вы принимаете и этот риск тоже.",
              "en": "Networks fine validators for misbehaviour, burning part of the stake. Delegating means taking that risk on too."
            }
          },
          {
            "title": {
              "ru": "Доходность считается в монетах",
              "en": "Yield is denominated in coins"
            },
            "text": {
              "ru": "Годовые в процентах ничего не говорят о том, сколько это будет стоить в деньгах через год.",
              "en": "A percentage says nothing about what the position will be worth in money a year from now."
            }
          },
          {
            "title": {
              "ru": "Ликвидный стейкинг — не то же самое",
              "en": "Liquid staking is a different thing"
            },
            "text": {
              "ru": "Он выдаёт токен-расписку, которой можно торговать, но добавляет риск смарт-контракта и риск отвязки этой расписки от цены монеты.",
              "en": "It hands you a tradeable receipt token, at the cost of contract risk and the risk that the receipt depegs from the coin it represents."
            }
          }
        ]
      }
    ],
  },
  {
    slug: 'yield-farming',
    category: 'defi',
    term: { ru: 'Йилд-фарминг', en: 'Yield farming' },
    definition: {
      ru: 'Стратегия в DeFi, при которой пользователь предоставляет свои активы протоколам (например, в пулы ликвидности) ради получения процентного дохода или дополнительных токенов.',
      en: 'A DeFi strategy in which a user supplies assets to protocols (for example, liquidity pools) in order to earn interest income or additional tokens.',
    },
  },
  {
    slug: 'liquidity-pool',
    category: 'defi',
    term: { ru: 'Пул ликвидности', en: 'Liquidity pool' },
    definition: {
      ru: 'Совместный резерв из двух и более токенов, заблокированный в смарт-контракте, который обеспечивает обмен активами на децентрализованных биржах без участия классического ордербука.',
      en: 'A shared reserve of two or more tokens locked in a smart contract that enables asset swaps on decentralized exchanges without a traditional order book.',
    },
  },
  {
    slug: 'market-cap',
    category: 'trading',
    term: { ru: 'Капитализация рынка', en: 'Market cap' },
    definition: {
      "ru": "Рыночная капитализация — цена монеты, умноженная на число монет в обращении. Показывает размер актива, а не количество вложенных в него денег, и именно по ней проекты сравнивают между собой.",
      "en": "Market cap is the price of a coin multiplied by the number of coins in circulation. It shows the size of an asset rather than how much money went into it, and it is the figure projects are compared by."
    },
    updated: '2026-08-11',
    related: [
      "ath",
      "tokenomics",
      "whale",
      "exchange",
      "altcoin",
      "bitcoin"
    ],
    sections: [
      {
        "heading": {
          "ru": "Как это работает",
          "en": "How it works"
        },
        "paragraphs": [
          {
            "ru": "Считают по монетам в обращении, то есть по тем, что доступны рынку. Заблокированные, зарезервированные командой и ещё не выпущенные в этот счёт не входят, поэтому одна и та же монета имеет разную капитализацию в зависимости от того, что считать обращением.",
            "en": "The count uses circulating supply, meaning the coins the market can actually reach. Locked, team-reserved and unissued coins stay out, so the same coin carries different caps depending on what counts as circulating."
          },
          {
            "ru": "Рядом стоит полностью разводнённая оценка: цена, умноженная на весь будущий выпуск. Если она втрое больше текущей капитализации, значит две трети монет ещё не вышли на рынок и когда-нибудь выйдут.",
            "en": "Alongside it sits fully diluted valuation: price times the entire future supply. When it is three times the current cap, two thirds of the coins have yet to reach the market and one day will."
          },
          {
            "ru": "Капитализация не равна вложенным деньгам. Чтобы поднять её на миллиард, миллиарда не нужно: достаточно, чтобы по новой цене прошла небольшая сделка, а переоценились все монеты сразу.",
            "en": "A cap is not money invested. Adding a billion to it does not take a billion: one small trade at a new price is enough, because every coin is repriced at once."
          }
        ]
      },
      {
        "heading": {
          "ru": "Почему цена монеты ничего не значит",
          "en": "Why the price per coin tells you nothing"
        },
        "example": {
          "setup": {
            "ru": "Монета A стоит $0,05, в обращении 10 млрд штук. Монета B стоит $80, в обращении 3 млн штук.",
            "en": "Coin A trades at $0.05 with 10 billion circulating. Coin B trades at $80 with 3 million circulating."
          },
          "rows": [
            {
              "label": {
                "ru": "A: 0,05 × 10 000 000 000",
                "en": "A: 0.05 × 10,000,000,000"
              },
              "value": { "ru": "$500 000 000", "en": "$500,000,000" }
            },
            {
              "label": {
                "ru": "B: 80 × 3 000 000",
                "en": "B: 80 × 3,000,000"
              },
              "value": { "ru": "$240 000 000", "en": "$240,000,000" }
            }
          ],
          "outcome": {
            "ru": "«Дешёвая» A вдвое крупнее «дорогой» B. Цена одной монеты зависит только от того, на сколько частей поделили выпуск. Поэтому обещание «монета по $0,01 вырастет до $100» арифметически невыполнимо: при таком выпуске это капитализация больше мировой экономики.",
            "en": "The \"cheap\" A is twice the size of the \"expensive\" B. Price per coin depends only on how many pieces the supply was cut into. Which is why \"this $0.01 coin will reach $100\" is arithmetically impossible: at that supply it implies a cap larger than the world economy."
          }
        }
      },
      {
        "heading": {
          "ru": "На что смотреть",
          "en": "What to weigh"
        },
        "bullets": [
          {
            "title": {
              "ru": "Разница между текущей и разводнённой",
              "en": "The gap to fully diluted"
            },
            "text": {
              "ru": "Большой разрыв означает будущее давление продавцов, когда заблокированные монеты выйдут на рынок.",
              "en": "A wide gap means future selling pressure as locked coins reach the market."
            }
          },
          {
            "title": {
              "ru": "График разблокировок",
              "en": "The unlock schedule"
            },
            "text": {
              "ru": "Даты выхода команды и инвесторов из блокировки известны заранее и обычно указаны в токеномике.",
              "en": "The dates team and investor allocations unlock are known in advance and usually spelled out in the tokenomics."
            }
          },
          {
            "title": {
              "ru": "Объём торгов рядом с капитализацией",
              "en": "Volume against cap"
            },
            "text": {
              "ru": "Капитализация в миллиард при обороте $50 тысяч в сутки означает, что выйти по этой цене нельзя.",
              "en": "A billion-dollar cap on $50,000 of daily volume means nobody exits at that price."
            }
          },
          {
            "title": {
              "ru": "Кто считает обращение",
              "en": "Who decides what circulates"
            },
            "text": {
              "ru": "Данные о выпуске часто подаёт сам проект. У разных агрегаторов цифры расходятся именно поэтому.",
              "en": "Supply figures are often supplied by the project itself, which is exactly why aggregators disagree."
            }
          }
        ]
      }
    ],
  },
  {
    slug: 'ath',
    category: 'trading',
    term: { ru: 'Исторический максимум (ATH)', en: 'ATH (All-Time High)' },
    definition: {
      ru: 'Самая высокая цена, которую когда-либо достигал актив за всю историю торгов.',
      en: 'The highest price an asset has ever reached over its entire trading history.',
    },
  },
  {
    slug: 'fomo',
    category: 'slang',
    term: { ru: 'FOMO', en: 'FOMO' },
    definition: {
      ru: 'Fear of Missing Out — страх упустить выгоду. Эмоциональное состояние, при котором инвестор покупает актив на пике роста из боязни «не успеть», что часто приводит к убыткам.',
      en: 'Fear of Missing Out — the emotional state in which an investor buys an asset near the top of a rally out of fear of "missing the move," which often leads to losses.',
    },
  },
  {
    slug: 'fud',
    category: 'slang',
    term: { ru: 'FUD', en: 'FUD' },
    definition: {
      ru: 'Fear, Uncertainty and Doubt (страх, неопределённость и сомнение) — распространение негативной или пугающей информации о проекте, часто намеренно, чтобы снизить его цену.',
      en: 'Fear, Uncertainty and Doubt — the spread of negative or alarming information about a project, often deliberate, intended to push its price down.',
    },
  },
  {
    slug: 'hodl',
    category: 'slang',
    term: { ru: 'HODL', en: 'HODL' },
    definition: {
      ru: 'Сленговое слово (от опечатки «hold»), обозначающее стратегию долгосрочного удержания криптовалюты несмотря на колебания рынка.',
      en: 'Crypto slang (originating from a typo of "hold") for a strategy of holding cryptocurrency long-term regardless of market swings.',
    },
  },
  {
    slug: 'whale',
    category: 'slang',
    term: { ru: 'Кит', en: 'Whale' },
    definition: {
      ru: 'Инвестор или кошелёк, владеющий очень крупным объёмом криптовалюты. Действия китов (крупные покупки или продажи) способны заметно влиять на цену актива.',
      en: 'An investor or wallet holding a very large amount of cryptocurrency. The actions of whales (large buys or sells) can noticeably move an asset\'s price.',
    },
  },
  {
    slug: 'halving',
    category: 'tech',
    term: { ru: 'Халвинг', en: 'Halving' },
    definition: {
      "ru": "Халвинг — запрограммированное сокращение награды майнерам вдвое. У биткоина происходит каждые 210 000 блоков, примерно раз в четыре года, и вдвое замедляет появление новых монет.",
      "en": "A halving is a pre-programmed cut of the mining reward by half. In bitcoin it happens every 210,000 blocks, roughly once every four years, and halves the rate at which new coins appear."
    },
    updated: '2026-08-11',
    related: [
      "mining",
      "bitcoin",
      "proof-of-work",
      "tokenomics",
      "node",
      "blockchain"
    ],
    sections: [
      {
        "heading": {
          "ru": "Как это работает",
          "en": "How it works"
        },
        "paragraphs": [
          {
            "ru": "Правило записано в коде биткоина с самого начала: после каждых 210 000 добытых блоков награда за блок делится пополам. Это не решение и не голосование, а условие, выполняющееся автоматически.",
            "en": "The rule has been in bitcoin's code from the start: after every 210,000 blocks mined, the block reward is cut in half. It is not a decision or a vote but a condition that executes on its own."
          },
          {
            "ru": "Так задаётся вся эмиссия. Сумма всех уменьшающихся наград сходится к 21 миллиону монет, и последняя будет добыта примерно в 2140 году. Именно поэтому предложение биткоина конечно и известно заранее.",
            "en": "That is what defines the whole issuance. The sum of every shrinking reward converges on 21 million coins, the last of which is mined around 2140. It is why bitcoin's supply is finite and known in advance."
          },
          {
            "ru": "Для майнеров халвинг вдвое сокращает выручку за ту же работу. Слабые уходят, сложность добычи снижается, оставшиеся получают больше. Со временем основным доходом майнеров станут комиссии за транзакции, а не награда за блок.",
            "en": "For miners a halving cuts revenue for the same work in half. The weakest leave, difficulty drops, and those remaining earn more. Over time transaction fees rather than the block reward become miners' main income."
          }
        ]
      },
      {
        "heading": {
          "ru": "Как менялась награда",
          "en": "How the reward has changed"
        },
        "example": {
          "setup": {
            "ru": "Награда за один блок биткоина по годам.",
            "en": "Bitcoin's reward per block, by year."
          },
          "rows": [
            {
              "label": {
                "ru": "2009",
                "en": "2009"
              },
              "value": { "ru": "50 BTC", "en": "50 BTC" }
            },
            {
              "label": {
                "ru": "2012",
                "en": "2012"
              },
              "value": { "ru": "25 BTC", "en": "25 BTC" }
            },
            {
              "label": {
                "ru": "2016",
                "en": "2016"
              },
              "value": { "ru": "12,5 BTC", "en": "12.5 BTC" }
            },
            {
              "label": {
                "ru": "2020",
                "en": "2020"
              },
              "value": { "ru": "6,25 BTC", "en": "6.25 BTC" }
            },
            {
              "label": {
                "ru": "2024",
                "en": "2024"
              },
              "value": { "ru": "3,125 BTC", "en": "3.125 BTC" }
            }
          ],
          "outcome": {
            "ru": "Блоки находятся примерно каждые десять минут, то есть около 144 в сутки. После 2024 года сеть выпускает порядка 450 BTC в день вместо 900 до него.",
            "en": "Blocks arrive roughly every ten minutes, about 144 a day. Since 2024 the network issues around 450 BTC a day where it issued 900 before."
          }
        }
      },
      {
        "heading": {
          "ru": "Что стоит понимать",
          "en": "What to keep in mind"
        },
        "bullets": [
          {
            "title": {
              "ru": "Дата известна заранее",
              "en": "The date is known in advance"
            },
            "text": {
              "ru": "Халвинг считается по номеру блока, поэтому его ждут за годы. Внезапной новостью он быть не может.",
              "en": "A halving is counted in blocks, so it is anticipated years out. It cannot arrive as breaking news."
            }
          },
          {
            "title": {
              "ru": "Рост цены не гарантирован",
              "en": "A price rise is not guaranteed"
            },
            "text": {
              "ru": "Прошлые халвинги предшествовали росту, но выборка — четыре события за пятнадцать лет. Этого мало для закономерности.",
              "en": "Past halvings preceded rallies, but the sample is four events in fifteen years. That is not enough to call it a pattern."
            }
          },
          {
            "title": {
              "ru": "Сеть не замедляется",
              "en": "The network does not slow down"
            },
            "text": {
              "ru": "Сложность пересчитывается каждые две недели, поэтому блоки продолжают идти раз в десять минут независимо от ухода майнеров.",
              "en": "Difficulty readjusts every two weeks, so blocks keep arriving every ten minutes regardless of miners leaving."
            }
          },
          {
            "title": {
              "ru": "У других сетей своя модель",
              "en": "Other networks work differently"
            },
            "text": {
              "ru": "Халвинг — правило биткоина и нескольких форков. У Ethereum эмиссия устроена иначе и халвингов нет.",
              "en": "Halving is a rule of bitcoin and a few forks. Ethereum issues coins on a different model and has no halvings."
            }
          }
        ]
      }
    ],
  },
  {
    slug: 'hard-fork',
    category: 'tech',
    term: { ru: 'Хард-форк', en: 'Hard fork' },
    definition: {
      ru: 'Несовместимое с предыдущей версией изменение протокола блокчейна, которое разделяет сеть на старую и новую ветки (пример: разделение Bitcoin и Bitcoin Cash).',
      en: 'A backwards-incompatible change to a blockchain\'s protocol that splits the network into an old and a new chain (example: the split of Bitcoin and Bitcoin Cash).',
    },
  },
  {
    slug: 'soft-fork',
    category: 'tech',
    term: { ru: 'Софт-форк', en: 'Soft fork' },
    definition: {
      ru: 'Обратно совместимое обновление правил протокола, при котором старые ноды продолжают работать в новой сети без необходимости обязательного обновления.',
      en: 'A backwards-compatible update to a protocol\'s rules, where old nodes can continue operating on the upgraded network without being forced to update.',
    },
  },
  {
    slug: 'consensus-mechanism',
    category: 'tech',
    term: { ru: 'Механизм консенсуса', en: 'Consensus mechanism' },
    definition: {
      ru: 'Набор правил, по которым участники децентрализованной сети согласовывают, какая версия блокчейна является правильной (например, Proof-of-Work или Proof-of-Stake).',
      en: 'A set of rules by which participants in a decentralized network agree on which version of the blockchain is valid (for example, Proof-of-Work or Proof-of-Stake).',
    },
  },
  {
    slug: 'proof-of-work',
    category: 'tech',
    term: { ru: 'Proof-of-Work (PoW)', en: 'Proof-of-Work (PoW)' },
    definition: {
      ru: 'Механизм консенсуса, в котором майнеры доказывают вычислительную работу, чтобы добавить новый блок. Используется, например, в Bitcoin; требует значительных энергозатрат.',
      en: 'A consensus mechanism in which miners prove they performed computational work in order to add a new block. Used by Bitcoin, among others; it requires significant energy.',
    },
  },
  {
    slug: 'proof-of-stake',
    category: 'tech',
    term: { ru: 'Proof-of-Stake (PoS)', en: 'Proof-of-Stake (PoS)' },
    definition: {
      ru: 'Механизм консенсуса, в котором право подтверждать блоки получают участники, заблокировавшие (застейкавшие) свою криптовалюту в качестве залога. Энергоэффективнее, чем Proof-of-Work.',
      en: 'A consensus mechanism in which the right to validate blocks goes to participants who have locked up (staked) their cryptocurrency as collateral. It is more energy-efficient than Proof-of-Work.',
    },
  },
  {
    slug: 'erc-20',
    category: 'tokens',
    term: { ru: 'ERC-20', en: 'ERC-20' },
    definition: {
      ru: 'Технический стандарт токенов в сети Ethereum, который определяет общие правила для создания взаимозаменяемых токенов. Подавляющее большинство токенов на Ethereum выпущены по этому стандарту.',
      en: 'A technical token standard on the Ethereum network that defines common rules for creating fungible tokens. The vast majority of tokens on Ethereum are issued under this standard.',
    },
  },
  {
    slug: 'trc-20',
    category: 'tokens',
    term: { ru: 'TRC-20', en: 'TRC-20' },
    definition: {
      ru: 'Аналог стандарта ERC-20, но в сети TRON. Часто используется для переводов USDT — комиссии в сети TRON, как правило, заметно ниже, чем в Ethereum.',
      en: 'An equivalent of the ERC-20 standard, but on the TRON network. It is widely used for USDT transfers — fees on TRON are typically much lower than on Ethereum.',
    },
  },
  {
    slug: 'bep-20',
    category: 'tokens',
    term: { ru: 'BEP-20', en: 'BEP-20' },
    definition: {
      ru: 'Стандарт токенов сети BNB Smart Chain (BSC), совместимый по структуре с ERC-20, но с более низкими комиссиями за транзакции.',
      en: 'A token standard on the BNB Smart Chain (BSC), structurally compatible with ERC-20 but with lower transaction fees.',
    },
  },
  {
    slug: 'cold-wallet',
    category: 'wallets',
    term: { ru: 'Холодный кошелёк', en: 'Cold wallet' },
    definition: {
      ru: 'Кошелёк, приватные ключи которого хранятся offline (например, на отдельном устройстве). Считается самым безопасным способом долгосрочного хранения крупных сумм.',
      en: 'A wallet whose private keys are stored offline (for example, on a dedicated device). It is considered the safest way to hold large amounts long-term.',
    },
  },
  {
    slug: 'hot-wallet',
    category: 'wallets',
    term: { ru: 'Горячий кошелёк', en: 'Hot wallet' },
    definition: {
      ru: 'Кошелёк, постоянно подключённый к интернету (приложение или браузерное расширение). Удобен для частых операций, но более уязвим для взлома, чем холодный кошелёк.',
      en: 'A wallet that is always connected to the internet (an app or browser extension). Convenient for frequent transactions, but more vulnerable to hacking than a cold wallet.',
    },
  },
  {
    slug: 'custodial-wallet',
    category: 'wallets',
    term: { ru: 'Кастодиальный кошелёк', en: 'Custodial wallet' },
    definition: {
      ru: 'Кошелёк, приватные ключи которого хранит третья сторона (например, биржа), а не сам пользователь. Действует принцип «не твои ключи — не твои монеты».',
      en: 'A wallet whose private keys are held by a third party (such as an exchange) rather than the user. The principle "not your keys, not your coins" applies.',
    },
  },
  {
    slug: 'non-custodial-wallet',
    category: 'wallets',
    term: { ru: 'Некастодиальный кошелёк', en: 'Non-custodial wallet' },
    definition: {
      ru: 'Кошелёк, в котором приватные ключи полностью контролирует сам пользователь, без посредников. Даёт больше ответственности, но и больше контроля над средствами.',
      en: 'A wallet in which the private keys are fully controlled by the user, with no intermediary. It carries more responsibility, but also more control over the funds.',
    },
  },
  {
    slug: 'kyc',
    category: 'compliance',
    term: { ru: 'KYC', en: 'KYC' },
    definition: {
      ru: 'Know Your Customer («знай своего клиента») — процедура проверки личности пользователя, которую проходят на регулируемых биржах для соответствия законодательству.',
      en: 'Know Your Customer — an identity-verification procedure that users complete on regulated exchanges to comply with the law.',
    },
  },
  {
    slug: 'aml',
    category: 'compliance',
    term: { ru: 'AML', en: 'AML' },
    definition: {
      ru: 'Anti-Money Laundering («противодействие отмыванию денег») — комплекс политик и процедур, которые биржи и финансовые организации применяют для предотвращения незаконных финансовых операций. На практике это выражается в мониторинге транзакций на подозрительную активность, лимитах на вывод средств и обязательной проверке личности (KYC) перед крупными операциями — требования обычно устанавливает регулятор той юрисдикции, где работает биржа.',
      en: 'Anti-Money Laundering — a set of policies and procedures that exchanges and financial institutions use to prevent illicit financial activity. In practice, this means monitoring transactions for suspicious patterns, applying withdrawal limits, and requiring identity verification (KYC) before larger transactions — requirements are typically set by the regulator in the exchange\'s operating jurisdiction.',
    },
  },
  {
    slug: 'airdrop',
    category: 'tokens',
    term: { ru: 'Airdrop (раздача токенов)', en: 'Airdrop' },
    definition: {
      ru: 'Бесплатная раздача токенов проектом, обычно в рамках маркетинга или вознаграждения ранних пользователей. Будьте осторожны: под видом airdrop часто маскируют фишинговые схемы.',
      en: 'A free distribution of tokens by a project, usually for marketing purposes or to reward early users. Be cautious: phishing schemes are often disguised as airdrops.',
    },
  },
  {
    slug: 'ico',
    category: 'tokens',
    term: { ru: 'ICO', en: 'ICO' },
    definition: {
      ru: 'Initial Coin Offering — первичное размещение токенов, способ сбора средств для проекта в обмен на его токены, по аналогии с IPO на фондовом рынке.',
      en: 'Initial Coin Offering — a fundraising method where a project sells its tokens to investors, broadly analogous to an IPO on the stock market.',
    },
  },
  {
    slug: 'ido',
    category: 'tokens',
    term: { ru: 'IDO', en: 'IDO' },
    definition: {
      ru: 'Initial DEX Offering — первичное размещение токена сразу на децентрализованной бирже, без участия централизованного посредника.',
      en: 'Initial DEX Offering — a token launch that takes place directly on a decentralized exchange, without a centralized intermediary.',
    },
  },
  {
    slug: 'whitepaper',
    category: 'basics',
    term: { ru: 'Whitepaper (уайтпейпер)', en: 'Whitepaper' },
    definition: {
      ru: 'Официальный документ проекта, в котором описаны его технология, цели, экономика токена и команда. Первое, что стоит изучить перед инвестицией в новый проект.',
      en: 'A project\'s official document describing its technology, goals, token economics, and team. It is the first thing worth reading before investing in a new project.',
    },
  },
  {
    slug: 'tokenomics',
    category: 'tokens',
    term: { ru: 'Токеномика', en: 'Tokenomics' },
    definition: {
      ru: 'Экономическая модель токена: общий объём эмиссии, распределение между командой и инвесторами, механизмы сжигания или эмиссии новых токенов.',
      en: 'A token\'s economic model: total supply, distribution between the team and investors, and mechanisms for burning or minting new tokens.',
    },
  },
  {
    slug: 'slippage',
    category: 'trading',
    term: { ru: 'Слиппедж (проскальзывание)', en: 'Slippage' },
    definition: {
      ru: 'Разница между ценой, которую вы видели в момент отправки сделки, и ценой, по которой она реально исполнилась. Выглядит как курс чуть хуже ожидаемого, и тем заметнее, чем тоньше рынок и быстрее движется цена.',
      en: 'The gap between the price you saw when you sent a trade and the price it actually filled at. It shows up as a slightly worse rate than the one on screen, and it grows the thinner the market is and the faster the price moves.',
    },
    updated: '2026-08-11',
    related: ['order-book', 'limit-order', 'market-order', 'liquidity-pool', 'dex', 'liquidation'],
    sections: [
      {
        heading: { ru: 'Как это работает', en: 'How it works' },
        paragraphs: [
          {
            ru: 'Биржевой стакан — это очередь предложений по разным ценам. Рыночный ордер выкупает их подряд, начиная с лучшей. Если ваш объём больше того, что стоит по лучшей цене, остаток добирается по ценам хуже, и вашей реальной ценой становится средняя по всем этим кусочкам.',
            en: 'An order book is a queue of offers at different prices. A market order eats through them in turn, starting with the best. If your size is bigger than what sits at the best price, the remainder fills at worse ones, and your real price becomes the average across all those pieces.',
          },
          {
            ru: 'На DEX происходит то же самое, только против пула ликвидности: каждая купленная единица сдвигает соотношение в пуле, поэтому цена уходит от вас прямо по ходу сделки.',
            en: 'The same thing happens on a DEX, except against a liquidity pool: every unit you buy shifts the pool\'s ratio, so the price walks away from you while the trade is still going through.',
          },
          {
            ru: 'Величину определяют две вещи: сколько ликвидности стоит рядом с текущей ценой и насколько цена успевает уйти за секунды между нажатием кнопки и исполнением.',
            en: 'Two things set the size of it: how much liquidity sits near the current price, and how far the price travels in the seconds between your click and the fill.',
          },
        ],
      },
      {
        heading: { ru: 'Пример с числами', en: 'A worked example' },
        example: {
          setup: {
            ru: 'Вы покупаете 5 ETH при цене на экране $2 400. В стакане: 1,5 ETH по $2 400, затем 2 ETH по $2 403, затем 1,5 ETH по $2 409.',
            en: 'You buy 5 ETH with $2,400 showing on screen. The book holds 1.5 ETH at $2,400, then 2 ETH at $2,403, then 1.5 ETH at $2,409.',
          },
          rows: [
            { label: { ru: '1,5 × $2 400', en: '1.5 × $2,400' }, "value": { "ru": "$3 600,00", "en": "$3,600.00" } },
            { label: { ru: '2 × $2 403', en: '2 × $2,403' }, "value": { "ru": "$4 806,00", "en": "$4,806.00" } },
            { label: { ru: '1,5 × $2 409', en: '1.5 × $2,409' }, "value": { "ru": "$3 613,50", "en": "$3,613.50" } },
          ],
          total: { label: { ru: 'Итого за 5 ETH', en: 'Total for 5 ETH' }, "value": { "ru": "$12 019,50", "en": "$12,019.50" } },
          outcome: {
            ru: 'Средняя цена вышла $2 403,90 вместо ожидаемых $2 400. Проскальзывание стоило $19,50, или 0,16%. На ликвидной паре это норма. На тонком альткоине тот же ордер может пройти вверх по стакану на 3–5%, и вместо $12 000 вы заплатите около $12 500.',
            en: 'The average came out at $2,403.90 instead of the $2,400 you expected. Slippage cost $19.50, or 0.16%. On a liquid pair that is normal. On a thin altcoin the same order can walk 3–5% up the book, and instead of $12,000 you pay around $12,500.',
          },
        },
      },
      {
        heading: { ru: 'Как уменьшить', en: 'How to keep it small' },
        bullets: [
          {
            title: { ru: 'Ограничьте допуск', en: 'Cap your tolerance' },
            text: {
              ru: 'И биржи, и DEX позволяют задать максимальное проскальзывание: сделка откатится, вместо того чтобы исполниться по цене, на которую вы не соглашались. Для крупных пар нормальны 0,1–0,5%. Если паре нужно 5% и больше, это говорит о самой паре, а не о том, что надо поднять настройку.',
              en: 'Exchanges and DEXs both let you set a maximum: the trade reverts instead of filling at a price you never agreed to. For major pairs 0.1–0.5% is normal. A pair that needs 5% or more is telling you about the pair, not about the setting you should raise.',
            },
          },
          {
            title: { ru: 'Используйте лимитный ордер', en: 'Use a limit order' },
            text: {
              ru: 'Он называет вашу цену и ждёт. Может не исполниться вовсе, но хуже не исполнится.',
              en: 'It names your price and waits. It may go unfilled, but it cannot fill worse.',
            },
          },
          {
            title: { ru: 'Дробите крупный объём', en: 'Split a large order' },
            text: {
              ru: 'Несколько небольших сделок обходятся дешевле, чем один ордер, съедающий стакан целиком.',
              en: 'Several smaller fills spread out cost less than one order eating the whole book.',
            },
          },
          {
            title: { ru: 'Смотрите на глубину до выбора объёма', en: 'Check depth before size' },
            text: {
              ru: 'Стакан или TVL пула показывают, сколько можно взять, прежде чем цена сдвинется.',
              en: 'The order book, or the pool\'s TVL, tells you how much you can take before the price moves.',
            },
          },
          {
            title: { ru: 'Не торопитесь после новостей', en: 'Wait out the news' },
            text: {
              ru: 'В первые минуты спред расширяется, а глубина исчезает. Высокий допуск на тонком токене — ровно то, что ищут сэндвич-боты.',
              en: 'In the first minutes spreads widen and depth disappears. A high tolerance on a thin token is exactly what sandwich bots look for.',
            },
          },
        ],
      },
    ],
  },
  {
    slug: 'order-book',
    category: 'trading',
    term: { ru: 'Книга ордеров (ордербук)', en: 'Order book' },
    definition: {
      ru: 'Список всех открытых заявок на покупку и продажу актива на бирже, отсортированных по цене. Показывает текущий спрос и предложение в реальном времени.',
      en: 'A list of all open buy and sell orders for an asset on an exchange, sorted by price. It shows real-time supply and demand.',
    },
  },
  {
    slug: 'limit-order',
    category: 'trading',
    term: { ru: 'Лимитный ордер', en: 'Limit order' },
    definition: {
      ru: 'Заявка на покупку или продажу по конкретной указанной цене или лучше. Исполняется только тогда, когда рынок достигает этой цены.',
      en: 'An order to buy or sell at a specific price or better. It only executes once the market reaches that price.',
    },
  },
  {
    slug: 'market-order',
    category: 'trading',
    term: { ru: 'Рыночный ордер', en: 'Market order' },
    definition: {
      ru: 'Заявка на немедленную покупку или продажу актива по лучшей доступной цене на рынке прямо сейчас.',
      en: 'An order to buy or sell an asset immediately at the best price currently available in the market.',
    },
  },
  {
    slug: 'leverage',
    category: 'trading',
    term: { ru: 'Кредитное плечо', en: 'Leverage' },
    definition: {
      ru: 'Использование заёмных средств для увеличения размера позиции. Плечо умножает не только потенциальную прибыль, но и потенциальные убытки — высокорискованный инструмент.',
      en: 'The use of borrowed funds to increase the size of a trading position. Leverage multiplies both potential profit and potential losses — a high-risk tool.',
    },
  },
  {
    slug: 'liquidation',
    category: 'trading',
    term: { ru: 'Ликвидация позиции', en: 'Liquidation' },
    definition: {
      "ru": "Ликвидация — принудительное закрытие позиции биржей, когда залога перестаёт хватать на покрытие убытка. Момент выбираете не вы: позицию закрывают автоматически, и внесённая маржа сгорает.",
      "en": "Liquidation is the forced closing of a position by the exchange once the collateral no longer covers the loss. The timing is not yours: the position is closed automatically and the margin you put up is gone."
    },
    updated: '2026-08-11',
    related: [
      "leverage",
      "slippage",
      "order-book",
      "limit-order",
      "market-cap",
      "cex"
    ],
    sections: [
      {
        "heading": {
          "ru": "Как это работает",
          "en": "How it works"
        },
        "paragraphs": [
          {
            "ru": "Торгуя с плечом, вы вносите маржу — свою часть суммы, а остальное даёт биржа. Убыток списывается именно с вашей части, поэтому при плече 10× движение цены на 1% съедает 10% вашей маржи.",
            "en": "Trading with leverage, you post margin, your share of the position, and the exchange supplies the rest. Losses come out of your share, so at 10× a 1% move in price eats 10% of your margin."
          },
          {
            "ru": "У биржи есть уровень поддерживающей маржи — минимум, ниже которого позицию держать нельзя. Как только собственных средств остаётся меньше, срабатывает ликвидация: позиция закрывается по рынку без вашего участия.",
            "en": "The exchange sets a maintenance margin, the floor below which a position cannot be held. The moment your own funds fall under it, liquidation fires and the position is closed at market without you."
          },
          {
            "ru": "Ликвидации усиливают сами себя. Массовое принудительное закрытие лонгов — это волна рыночных продаж, которая двигает цену ниже и запускает следующие ликвидации. Так за минуты проходят движения, которые обычно занимают дни.",
            "en": "Liquidations feed on themselves. A mass of forced long closures is a wave of market selling, which pushes the price lower and triggers the next round. That is how moves that normally take days happen in minutes."
          }
        ]
      },
      {
        "heading": {
          "ru": "Пример с числами",
          "en": "A worked example"
        },
        "example": {
          "setup": {
            "ru": "Вы открыли лонг по биткоину на $10 000 с плечом 10×, вложив $1 000 своих. Вход по $64 000, поддерживающая маржа 0,5%.",
            "en": "You open a $10,000 long on bitcoin at 10× with $1,000 of your own. Entry at $64,000, maintenance margin 0.5%."
          },
          "rows": [
            {
              "label": {
                "ru": "Размер позиции",
                "en": "Position size"
              },
              "value": { "ru": "$10 000,00", "en": "$10,000.00" }
            },
            {
              "label": {
                "ru": "Своих средств",
                "en": "Your margin"
              },
              "value": { "ru": "$1 000,00", "en": "$1,000.00" }
            },
            {
              "label": {
                "ru": "Движение до ликвидации",
                "en": "Move until liquidation"
              },
              "value": { "ru": "≈ 9,5%", "en": "≈ 9.5%" }
            }
          ],
          "total": {
            "label": {
              "ru": "Цена ликвидации",
              "en": "Liquidation price"
            },
            "value": { "ru": "≈ $57 920", "en": "≈ $57,920" }
          },
          "outcome": {
            "ru": "Достаточно падения на 9,5%, чтобы потерять всю тысячу. При плече 20× хватит 4,5%, при 50× — 1,5%. Биткоин проходит такие движения за часы, а иногда за минуты.",
            "en": "A 9.5% fall is enough to take the whole thousand. At 20× it takes 4.5%, at 50× just 1.5%. Bitcoin covers moves like that in hours, sometimes in minutes."
          }
        }
      },
      {
        "heading": {
          "ru": "Как не доводить",
          "en": "How to avoid it"
        },
        "bullets": [
          {
            "title": {
              "ru": "Считайте цену ликвидации до входа",
              "en": "Know the liquidation price before entering"
            },
            "text": {
              "ru": "Биржа показывает её сразу. Если она внутри обычного дневного диапазона, плечо слишком большое.",
              "en": "The exchange shows it immediately. If it sits inside the normal daily range, the leverage is too high."
            }
          },
          {
            "title": {
              "ru": "Ставьте стоп-лосс выше неё",
              "en": "Put the stop above it"
            },
            "text": {
              "ru": "Стоп закрывает позицию по вашей цене и оставляет часть маржи. Ликвидация не оставляет ничего.",
              "en": "A stop closes at your price and leaves part of the margin. Liquidation leaves nothing."
            }
          },
          {
            "title": {
              "ru": "Изолированная маржа вместо кросс",
              "en": "Isolated margin, not cross"
            },
            "text": {
              "ru": "При кросс-марже под удар попадает весь баланс счёта, а не только та сумма, которой вы рискнули.",
              "en": "Cross margin puts the whole account balance at risk rather than only the amount you meant to risk."
            }
          },
          {
            "title": {
              "ru": "Помните про финансирование",
              "en": "Remember funding"
            },
            "text": {
              "ru": "На бессрочных контрактах каждые несколько часов списывается ставка финансирования. Она медленно приближает цену ликвидации.",
              "en": "Perpetual contracts charge a funding rate every few hours. It quietly walks the liquidation price toward you."
            }
          },
          {
            "title": {
              "ru": "Тонкий рынок бьёт дважды",
              "en": "A thin market hits twice"
            },
            "text": {
              "ru": "Закрытие идёт по рынку, и на неликвидной паре проскальзывание делает убыток больше расчётного.",
              "en": "The close goes through at market, and on an illiquid pair slippage makes the loss larger than the arithmetic said."
            }
          }
        ]
      }
    ],
  },
  {
    slug: 'rug-pull',
    category: 'security',
    term: { ru: 'Раг-пул', en: 'Rug pull' },
    definition: {
      "ru": "Рагпул — когда создатели проекта забирают деньги вкладчиков и исчезают: выводят ликвидность из пула, продают весь свой запас токенов или просто отключают сайт. Цена падает почти до нуля за минуты.",
      "en": "A rug pull is when a project's creators take investors' money and vanish: they drain the liquidity pool, dump their entire token supply, or simply switch the site off. The price collapses to near zero within minutes."
    },
    updated: '2026-08-11',
    related: [
      "tokenomics",
      "liquidity-pool",
      "dex",
      "smart-contract",
      "whitepaper",
      "airdrop"
    ],
    sections: [
      {
        "heading": {
          "ru": "Как это работает",
          "en": "How it works"
        },
        "paragraphs": [
          {
            "ru": "Классическая схема выглядит так: команда выпускает токен, добавляет ликвидность в пул на DEX и разгоняет интерес в соцсетях. Люди покупают, цена растёт, а пул наполняется настоящими деньгами.",
            "en": "The classic version runs like this: the team issues a token, seeds a liquidity pool on a DEX, and drives interest on social media. People buy, the price climbs, and the pool fills with real money."
          },
          {
            "ru": "В нужный момент создатели забирают из пула свою половину — ту, что в ETH или USDT. Пул пустеет, и продать токен становится не за что: обменивать его больше не на что.",
            "en": "At the chosen moment the creators withdraw their half of the pool, the side denominated in ETH or USDT. The pool empties, and the token can no longer be sold because there is nothing left to sell it into."
          },
          {
            "ru": "Второй вариант — не трогать пул, а продать собственный запас: если у команды 60% всех токенов, их продажа обваливает цену без всякого вывода ликвидности. Третий, «мягкий» рагпул — проект не исчезает, а просто перестаёт разрабатываться, и токен умирает медленно.",
            "en": "A second version leaves the pool alone and dumps the team's own holdings instead: if they control 60% of supply, selling it collapses the price without touching liquidity at all. A third, softer version has nobody vanish, the project simply stops being built and the token dies slowly."
          }
        ]
      },
      {
        "heading": {
          "ru": "Что видно заранее",
          "en": "What is visible in advance"
        },
        "example": {
          "setup": {
            "ru": "Проект выпустил 100 млн токенов. Смотрим распределение и пул до покупки.",
            "en": "A project has issued 100 million tokens. Here is what the distribution and the pool show before you buy."
          },
          "rows": [
            {
              "label": {
                "ru": "У кошельков команды",
                "en": "Held by team wallets"
              },
              "value": { "ru": "62 000 000 (62%)", "en": "62,000,000 (62%)" }
            },
            {
              "label": {
                "ru": "В свободном обращении",
                "en": "Circulating"
              },
              "value": { "ru": "38 000 000 (38%)", "en": "38,000,000 (38%)" }
            },
            {
              "label": {
                "ru": "Ликвидность под замком",
                "en": "Liquidity locked"
              },
              "value": { "ru": "нет", "en": "no" }
            }
          ],
          "outcome": {
            "ru": "Команда способна продать больше токенов, чем есть на всём рынке, и в любую секунду вывести ликвидность. Эти цифры лежат в блокчейн-эксплорере и на странице пула, их видно до того, как вы что-то купили.",
            "en": "The team can sell more tokens than the market holds, and can pull the liquidity at any second. Both numbers sit in a block explorer and on the pool's page, visible before you buy anything."
          }
        }
      },
      {
        "heading": {
          "ru": "Что проверить до покупки",
          "en": "What to check before buying"
        },
        "bullets": [
          {
            "title": {
              "ru": "Заперта ли ликвидность",
              "en": "Is liquidity locked"
            },
            "text": {
              "ru": "У честных проектов ликвидность заблокирована смарт-контрактом на срок. Без замка её выводят в любой момент.",
              "en": "Honest projects lock pool liquidity in a contract for a fixed term. Without a lock it can leave whenever."
            }
          },
          {
            "title": {
              "ru": "Как распределены токены",
              "en": "How supply is spread"
            },
            "text": {
              "ru": "Блокчейн-эксплорер показывает крупнейших держателей. Несколько кошельков с половиной запаса — прямой риск.",
              "en": "A block explorer lists the largest holders. A handful of wallets holding half the supply is the risk itself."
            }
          },
          {
            "title": {
              "ru": "Есть ли аудит и чей",
              "en": "Whose audit is it"
            },
            "text": {
              "ru": "Слово «аудировано» без имени аудитора и открывающегося отчёта не значит ничего. Отчёт должен относиться к тому же адресу контракта.",
              "en": "The word \"audited\" without a named auditor and a report you can open means nothing. The report has to cover the same contract address."
            }
          },
          {
            "title": {
              "ru": "Можно ли вообще продать",
              "en": "Can it be sold at all"
            },
            "text": {
              "ru": "Часть контрактов разрешает покупку и блокирует продажу. Проверяется микросделкой на минимальную сумму.",
              "en": "Some contracts allow buying and block selling. A minimal test trade answers it."
            }
          },
          {
            "title": {
              "ru": "Кто стоит за проектом",
              "en": "Who is behind it"
            },
            "text": {
              "ru": "Анонимная команда не приговор, но поднимает цену ошибки: спросить будет не с кого.",
              "en": "An anonymous team is not a verdict, but it raises the cost of being wrong: there is nobody to answer for it."
            }
          }
        ]
      }
    ],
  },
  {
    slug: 'p2p',
    category: 'trading',
    term: { ru: 'P2P', en: 'P2P' },
    definition: {
      "ru": "P2P — это сделка напрямую между двумя людьми: один продаёт крипту, другой платит фиатом, а площадка держит монеты в эскроу, пока обе стороны не подтвердят перевод. Так покупают и продают там, где нет прямого банковского канала на биржу.",
      "en": "P2P is a trade directly between two people: one sells crypto, the other pays in fiat, and the platform holds the coins in escrow until both sides confirm. It is how people buy and sell where no direct bank rail to an exchange exists."
    },
    updated: '2026-08-11',
    related: [
      "exchange",
      "cex",
      "fiat",
      "kyc",
      "stablecoin",
      "aml"
    ],
    sections: [
      {
        "heading": {
          "ru": "Как это работает",
          "en": "How it works"
        },
        "paragraphs": [
          {
            "ru": "Площадка не участвует в переводе денег. Продавец размещает объявление с курсом, лимитами и способами оплаты. Покупатель открывает сделку, и в этот момент криптовалюта продавца замораживается в эскроу: вывести её он уже не может.",
            "en": "The platform never touches the money itself. A seller posts an offer with a rate, limits and payment methods. A buyer opens a trade, and at that moment the seller's crypto is frozen in escrow, beyond their reach."
          },
          {
            "ru": "Дальше покупатель переводит фиат напрямую продавцу: на карту, по IBAN, через платёжную систему. Когда продавец подтверждает получение, эскроу открывается и монеты уходят покупателю.",
            "en": "The buyer then sends fiat straight to the seller: card, IBAN, payment service. Once the seller confirms it arrived, escrow releases and the coins move to the buyer."
          },
          {
            "ru": "Если стороны не сошлись, включается арбитраж площадки: модератор смотрит скриншоты и выписки и решает, кому уходят монеты. Поэтому переписку нельзя уводить из чата площадки: снаружи у арбитража нет доказательств.",
            "en": "When the two disagree, the platform's arbitration steps in: a moderator reads the screenshots and statements and decides where the coins go. That is why the conversation has to stay in the platform's chat, since arbitration has no evidence from outside it."
          }
        ]
      },
      {
        "heading": {
          "ru": "Пример с числами",
          "en": "A worked example"
        },
        "example": {
          "setup": {
            "ru": "Вы продаёте 1 000 USDT за евро. На бирже курс 0,9180 EUR за USDT, лучшее объявление на P2P — 0,9350.",
            "en": "You sell 1,000 USDT for euros. The exchange rate is 0.9180 EUR per USDT; the best P2P offer is 0.9350."
          },
          "rows": [
            {
              "label": {
                "ru": "На бирже: 1 000 × 0,9180",
                "en": "On the exchange: 1,000 × 0.9180"
              },
              "value": { "ru": "€918,00", "en": "€918.00" }
            },
            {
              "label": {
                "ru": "На P2P: 1 000 × 0,9350",
                "en": "On P2P: 1,000 × 0.9350"
              },
              "value": { "ru": "€935,00", "en": "€935.00" }
            }
          ],
          "total": {
            "label": {
              "ru": "Разница",
              "en": "Difference"
            },
            "value": { "ru": "€17,00", "en": "€17.00" }
          },
          "outcome": {
            "ru": "P2P дал на €17 больше с тысячи, это 1,85%. Обратная сторона — время и риск: сделка идёт минуты вместо секунд, оплату надо получить и проверить. На нескольких тысячах разница ощутима, на сотне евро она не окупает возни.",
            "en": "P2P returned €17 more per thousand, or 1.85%. The cost is time and risk: the trade takes minutes rather than seconds, and the payment has to arrive and be checked. On a few thousand the gap is worth it; on a hundred euros it is not."
          }
        }
      },
      {
        "heading": {
          "ru": "Как не потерять деньги",
          "en": "How to stay safe"
        },
        "bullets": [
          {
            "title": {
              "ru": "Оставайтесь в чате площадки",
              "en": "Stay in the platform's chat"
            },
            "text": {
              "ru": "Переписка в мессенджере вне юрисдикции арбитража. Если дойдёт до спора, доказательствами будут только сообщения из чата сделки.",
              "en": "A conversation in a messenger sits outside arbitration's reach. If it comes to a dispute, only the messages inside the trade chat count as evidence."
            }
          },
          {
            "title": {
              "ru": "Проверяйте контрагента",
              "en": "Read the counterparty"
            },
            "text": {
              "ru": "Число сделок, доля успешных, срок регистрации. Свежий аккаунт с очень выгодным курсом — обычная приманка.",
              "en": "Trade count, completion rate, account age. A new account with an unusually good rate is standard bait."
            }
          },
          {
            "title": {
              "ru": "Не отпускайте эскроу до зачисления",
              "en": "Release only on arrival"
            },
            "text": {
              "ru": "«Отправлено» и «зачислено» — разные вещи. Платёж можно отозвать уже после того, как вы отдали монеты.",
              "en": "\"Sent\" and \"credited\" are different states. A payment can be recalled after you have already released the coins."
            }
          },
          {
            "title": {
              "ru": "Имя плательщика должно совпадать",
              "en": "Names must match"
            },
            "text": {
              "ru": "Отправитель платежа обязан совпадать с именем в аккаунте. Перевод от третьего лица — типичный признак отмывания, и банк может заблокировать счёт.",
              "en": "The sender of the payment must be the account holder. A third-party transfer is a standard laundering pattern, and a bank can freeze the account over it."
            }
          },
          {
            "title": {
              "ru": "Смотрите на условия, а не только на курс",
              "en": "Read the terms, not just the rate"
            },
            "text": {
              "ru": "Курс лучше рынка обычно идёт в комплекте с неудобным способом оплаты или узким окном по сумме.",
              "en": "A better-than-market rate usually arrives attached to an awkward payment method or a narrow amount window."
            }
          }
        ]
      }
    ],
  },
  {
    slug: 'layer-2',
    category: 'tech',
    term: { ru: 'Layer 2 (уровень 2)', en: 'Layer 2' },
    definition: {
      ru: 'Дополнительный протокол, построенный поверх основного блокчейна (Layer 1), который ускоряет транзакции и снижает комиссии, перенося часть вычислений за пределы основной сети.',
      en: 'A secondary protocol built on top of a base blockchain (Layer 1) that speeds up transactions and lowers fees by moving some computation off the main network.',
    },
  },
  {
    slug: 'bridge',
    category: 'tech',
    term: { ru: 'Блокчейн-мост', en: 'Bridge' },
    definition: {
      ru: 'Протокол, позволяющий переводить активы и данные между разными блокчейнами, которые изначально несовместимы друг с другом.',
      en: 'A protocol that allows assets and data to move between different blockchains that are not natively compatible with one another.',
    },
  },
  {
    slug: 'dao',
    category: 'defi',
    term: { ru: 'DAO', en: 'DAO' },
    definition: {
      ru: 'Decentralized Autonomous Organization («децентрализованная автономная организация») — сообщество, которое принимает решения путём голосования держателей токенов, а правила работы закреплены в смарт-контрактах.',
      en: 'Decentralized Autonomous Organization — a community that makes decisions through token-holder voting, with its rules encoded in smart contracts.',
    },
  },
  {
    slug: 'nonce',
    category: 'tech',
    term: { ru: 'Nonce', en: 'Nonce' },
    definition: {
      ru: 'Число, используемое один раз, которое майнеры подбирают при добыче блока в сетях Proof-of-Work, а также счётчик, предотвращающий повторное использование одной и той же транзакции на аккаунте.',
      en: 'A number used once, which miners search for when mining a block in Proof-of-Work networks; also a counter that prevents a transaction from being replayed on an account.',
    },
  },
  {
    slug: 'block-explorer',
    category: 'tech',
    term: { ru: 'Блокчейн-эксплорер', en: 'Block explorer' },
    definition: {
      ru: 'Веб-сервис, позволяющий просматривать блоки, транзакции и адреса в блокчейне в режиме реального времени (например, Etherscan для Ethereum).',
      en: 'A web service that lets you browse blocks, transactions, and addresses on a blockchain in real time (for example, Etherscan for Ethereum).',
    },
  },
  {
    slug: 'satoshi',
    category: 'basics',
    term: { ru: 'Сатоши', en: 'Satoshi' },
    definition: {
      ru: 'Наименьшая единица биткоина, равная одной стомиллионной (0.00000001) BTC. Названа в честь создателя биткоина.',
      en: 'The smallest unit of Bitcoin, equal to one hundred-millionth (0.00000001) of a BTC. Named after Bitcoin\'s creator.',
    },
  },
  {
    slug: 'fiat',
    category: 'basics',
    term: { ru: 'Фиат', en: 'Fiat' },
    definition: {
      ru: 'Традиционная государственная валюта, не обеспеченная физическим товаром, например доллар, евро или гривна — в противоположность криптовалюте.',
      en: 'Traditional government-issued currency not backed by a physical commodity, such as the US dollar, euro, or Czech koruna — as opposed to cryptocurrency.',
    },
  },
  {
    slug: 'exchange',
    category: 'trading',
    term: { ru: 'Биржа', en: 'Exchange' },
    definition: {
      ru: 'Платформа для покупки, продажи и обмена криптовалют. Может быть централизованной (CEX) или децентрализованной (DEX).',
      en: 'A platform for buying, selling, and trading cryptocurrencies. It can be centralized (CEX) or decentralized (DEX).',
    },
  },
  {
    slug: 'genesis-block',
    category: 'tech',
    term: { ru: 'Генезис-блок', en: 'Genesis block' },
    definition: {
      ru: 'Самый первый блок в блокчейне, с которого начинается вся цепочка. У биткоина генезис-блок был создан 3 января 2009 года.',
      en: 'The very first block in a blockchain, from which the entire chain begins. Bitcoin\'s genesis block was created on January 3, 2009.',
    },
  },
];
