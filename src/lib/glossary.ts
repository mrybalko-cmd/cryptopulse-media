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
      "ru": "Биткоин — первая криптовалюта, запущенная в 2009 году автором под псевдонимом Сатоши Накамото. Работает без банка и посредников: транзакции проверяет сеть независимых компьютеров, а всего монет будет не больше 21 миллиона.",
      "en": "Bitcoin is the first cryptocurrency, launched in 2009 by an author writing as Satoshi Nakamoto. It runs without a bank or intermediaries: a network of independent computers verifies transactions, and there will never be more than 21 million coins."
    },
    updated: '2026-08-11',
    related: [
      "blockchain",
      "mining",
      "halving",
      "proof-of-work",
      "satoshi",
      "genesis-block"
    ],
    sections: [
      {
        "heading": {
          "ru": "Как это работает",
          "en": "How it works"
        },
        "paragraphs": [
          {
            "ru": "Все переводы записываются в общий журнал — блокчейн, копии которого хранят тысячи узлов по миру. Новые записи собираются в блоки примерно каждые десять минут, и каждый блок ссылается на предыдущий, поэтому переписать прошлое незаметно невозможно.",
            "en": "Every transfer is written into a shared ledger, the blockchain, copies of which are kept by thousands of nodes worldwide. New entries are gathered into blocks roughly every ten minutes, and each block references the one before it, so rewriting the past cannot go unnoticed."
          },
          {
            "ru": "Право записать очередной блок разыгрывается майнингом: компьютеры перебирают варианты, пока не найдут подходящий, и тратят на это электричество. Победитель получает награду новыми монетами — именно так они и появляются.",
            "en": "The right to write the next block is contested through mining: computers grind through candidates until one fits, spending electricity to do it. The winner is paid in new coins, which is the only way coins come into existence."
          },
          {
            "ru": "Владение сводится к ключам. Монеты не лежат в кошельке — в блокчейне записано, какому адресу они принадлежат, а приватный ключ доказывает право ими распорядиться. Потерянный ключ означает потерянные монеты, вернуть их некому.",
            "en": "Ownership comes down to keys. Coins do not sit in a wallet; the blockchain records which address they belong to, and a private key proves the right to move them. A lost key means lost coins, with nobody to appeal to."
          }
        ]
      },
      {
        "heading": {
          "ru": "Сколько всего монет",
          "en": "How many coins there are"
        },
        "example": {
          "setup": {
            "ru": "Эмиссия задана кодом и сокращается вдвое примерно каждые четыре года.",
            "en": "Issuance is set in code and halves roughly every four years."
          },
          "rows": [
            {
              "label": {
                "ru": "Предел выпуска",
                "en": "Hard cap"
              },
              "value": {
                "ru": "21 000 000 BTC",
                "en": "21,000,000 BTC"
              }
            },
            {
              "label": {
                "ru": "Награда за блок с 2024 года",
                "en": "Block reward since 2024"
              },
              "value": {
                "ru": "3,125 BTC",
                "en": "3.125 BTC"
              }
            },
            {
              "label": {
                "ru": "Блоков в сутки",
                "en": "Blocks per day"
              },
              "value": {
                "ru": "≈ 144",
                "en": "≈ 144"
              }
            }
          ],
          "total": {
            "label": {
              "ru": "Новых монет в сутки",
              "en": "New coins per day"
            },
            "value": {
              "ru": "≈ 450 BTC",
              "en": "≈ 450 BTC"
            }
          },
          "outcome": {
            "ru": "Последняя монета будет добыта около 2140 года. Дробится биткоин до одной стомиллионной — эта доля называется сатоши, и расчёты в сети идут именно в ней.",
            "en": "The last coin will be mined around 2140. Bitcoin divides down to one hundred-millionth of a coin, a unit called a satoshi, and the network actually counts in those."
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
              "ru": "Анонимности нет",
              "en": "It is not anonymous"
            },
            "text": {
              "ru": "Адреса не содержат имени, но вся история переводов публична навсегда. Связав адрес с личностью один раз, аналитик видит и всё остальное.",
              "en": "Addresses carry no name, but the full transfer history is public forever. Tie an address to a person once and an analyst sees everything else too."
            }
          },
          {
            "title": {
              "ru": "Перевод необратим",
              "en": "Transfers are final"
            },
            "text": {
              "ru": "Отправив монеты не на тот адрес, отменить операцию нельзя: в сети нет стороны, которая могла бы это сделать.",
              "en": "Send to the wrong address and there is no undo: the network has no party able to perform one."
            }
          },
          {
            "title": {
              "ru": "Волатильность — норма",
              "en": "Volatility is the baseline"
            },
            "text": {
              "ru": "Движения по 5–10% за сутки для биткоина обычны, а просадки на 70% от пика случались в каждом рыночном цикле.",
              "en": "Daily moves of 5–10% are ordinary, and drawdowns of 70% from a peak have happened in every market cycle."
            }
          },
          {
            "title": {
              "ru": "Комиссия не зависит от суммы",
              "en": "The fee ignores the amount"
            },
            "text": {
              "ru": "Платят за место в блоке, а не за размер перевода: отправка $50 и $5 млн стоит примерно одинаково.",
              "en": "You pay for space in a block, not for the size of the transfer: sending $50 and $5m costs about the same."
            }
          }
        ]
      }
    ],
  },
  {
    slug: 'blockchain',
    category: 'tech',
    term: { ru: 'Блокчейн', en: 'Blockchain' },
    definition: {
      "ru": "Блокчейн — общая база данных, которую одновременно хранят тысячи независимых компьютеров. Записи собираются в блоки, каждый блок ссылается на предыдущий, и изменить старую запись нельзя, не сломав всю цепочку после неё.",
      "en": "A blockchain is a shared database held simultaneously by thousands of independent computers. Records are gathered into blocks, each block references the one before it, and an old record cannot be altered without breaking the whole chain after it."
    },
    updated: '2026-08-11',
    related: [
      "hash",
      "node",
      "transaction",
      "consensus-mechanism",
      "smart-contract",
      "block-explorer"
    ],
    sections: [
      {
        "heading": {
          "ru": "Как это работает",
          "en": "How it works"
        },
        "paragraphs": [
          {
            "ru": "Каждый блок содержит список транзакций и хеш предыдущего блока — короткий отпечаток его содержимого. Поменяв хоть один символ в старом блоке, вы меняете его хеш, а значит и ссылку в следующем блоке, и так далее до самого конца цепочки.",
            "en": "Each block holds a list of transactions and the hash of the block before it, a short fingerprint of that block's contents. Change a single character in an old block and its hash changes, which breaks the reference in the next block, and so on to the end of the chain."
          },
          {
            "ru": "Поэтому подделка требует пересчитать всю цепочку заново и сделать это быстрее, чем её продолжает вся остальная сеть. В крупных сетях это экономически невозможно.",
            "en": "Forgery therefore means recomputing the entire chain and doing it faster than the rest of the network extends it. On large networks that is economically out of reach."
          },
          {
            "ru": "Кто именно добавляет следующий блок, решает механизм консенсуса: в одних сетях это вычислительная работа, в других — заблокированные монеты. Общее одно: узлы должны согласиться, что новый блок корректен, иначе его просто не примут.",
            "en": "Which participant adds the next block is settled by a consensus mechanism: computational work in some networks, locked-up coins in others. The common part is that nodes must agree the new block is valid, or it is simply not accepted."
          }
        ]
      },
      {
        "heading": {
          "ru": "Чем блокчейны отличаются",
          "en": "How blockchains differ"
        },
        "example": {
          "setup": {
            "ru": "Скорость и стоимость записи различаются на порядки — это и определяет, для чего сеть годится.",
            "en": "Speed and cost of writing differ by orders of magnitude, and that decides what a network is good for."
          },
          "rows": [
            {
              "label": {
                "ru": "Биткоин: новый блок",
                "en": "Bitcoin: new block"
              },
              "value": {
                "ru": "≈ 10 минут",
                "en": "≈ 10 minutes"
              }
            },
            {
              "label": {
                "ru": "Ethereum: новый блок",
                "en": "Ethereum: new block"
              },
              "value": {
                "ru": "≈ 12 секунд",
                "en": "≈ 12 seconds"
              }
            },
            {
              "label": {
                "ru": "Сети Layer 2",
                "en": "Layer 2 networks"
              },
              "value": {
                "ru": "< 1 секунды",
                "en": "< 1 second"
              }
            }
          ],
          "outcome": {
            "ru": "Медленная сеть не хуже быстрой: биткоин намеренно жертвует скоростью ради простоты и устойчивости, а Ethereum платит сложностью за возможность исполнять программы прямо в блокчейне.",
            "en": "A slow network is not a worse one: bitcoin trades speed for simplicity and resilience on purpose, while Ethereum pays in complexity for the ability to run programs on-chain."
          }
        }
      },
      {
        "heading": {
          "ru": "Чего блокчейн не делает",
          "en": "What a blockchain does not do"
        },
        "bullets": [
          {
            "title": {
              "ru": "Не проверяет правду",
              "en": "It does not verify truth"
            },
            "text": {
              "ru": "Сеть гарантирует, что запись не изменится, но не что она верна. Записанная ложь останется в блокчейне навсегда — уже как неизменяемая ложь.",
              "en": "The network guarantees a record will not change, not that it is correct. A lie written to a blockchain stays there forever, now as an immutable lie."
            }
          },
          {
            "title": {
              "ru": "Не хранит файлы",
              "en": "It does not store files"
            },
            "text": {
              "ru": "Место в блоке дорого, поэтому картинки и документы лежат снаружи, а в цепочку пишется только ссылка или хеш.",
              "en": "Block space is expensive, so images and documents live elsewhere and only a link or a hash goes on-chain."
            }
          },
          {
            "title": {
              "ru": "Не делает систему честной сам по себе",
              "en": "It does not make a system honest by itself"
            },
            "text": {
              "ru": "Если ключи от контракта у одной команды, децентрализация записи ничего не меняет: решения по-прежнему принимает эта команда.",
              "en": "If one team holds the contract keys, decentralised record-keeping changes nothing: that team still makes the decisions."
            }
          },
          {
            "title": {
              "ru": "Не скрывает участников",
              "en": "It does not hide participants"
            },
            "text": {
              "ru": "Публичный блокчейн виден каждому. Приватность требует отдельных решений, а не следует из технологии.",
              "en": "A public blockchain is visible to everyone. Privacy takes deliberate work; it does not come with the technology."
            }
          }
        ]
      }
    ],
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
      "ru": "Кошелёк — программа или устройство, которое хранит ваши приватные ключи и подписывает ими транзакции. Монеты остаются в блокчейне, а кошелёк даёт право ими распоряжаться — поэтому потеря кошелька без резервной копии равна потере денег.",
      "en": "A wallet is software or a device that stores your private keys and signs transactions with them. The coins stay on the blockchain; the wallet holds the right to move them, which is why losing a wallet with no backup means losing the money."
    },
    updated: '2026-08-11',
    related: [
      "private-key",
      "seed-phrase",
      "cold-wallet",
      "hot-wallet",
      "custodial-wallet",
      "non-custodial-wallet"
    ],
    sections: [
      {
        "heading": {
          "ru": "Как это работает",
          "en": "How it works"
        },
        "paragraphs": [
          {
            "ru": "Кошелёк создаёт пару ключей: публичный, из которого получается адрес для приёма, и приватный, которым подписываются переводы. Подпись доказывает сети, что распоряжение исходит от владельца, при этом сам ключ никуда не отправляется.",
            "en": "A wallet creates a key pair: a public one, from which a receiving address is derived, and a private one used to sign transfers. The signature proves to the network that the instruction came from the owner, while the key itself never leaves the device."
          },
          {
            "ru": "Все ключи выводятся из сид-фразы — набора из 12 или 24 слов. Поэтому кошелёк можно восстановить на другом устройстве и в другом приложении: важна фраза, а не программа.",
            "en": "Every key derives from a seed phrase, a set of 12 or 24 words. That is why a wallet can be restored on another device in another app: the phrase matters, the software does not."
          },
          {
            "ru": "Главное различие проходит по тому, у кого ключи. В некастодиальном кошельке они только у вас. В кастодиальном — у биржи или сервиса, и тогда вы владеете не монетами, а обязательством компании их выдать.",
            "en": "The dividing line is who holds the keys. In a non-custodial wallet only you do. In a custodial one an exchange or service does, and what you own is not coins but the company's promise to hand them over."
          }
        ]
      },
      {
        "heading": {
          "ru": "Какие бывают",
          "en": "The main kinds"
        },
        "bullets": [
          {
            "title": {
              "ru": "Аппаратный",
              "en": "Hardware"
            },
            "text": {
              "ru": "Отдельное устройство, которое хранит ключ офлайн и подписывает операции внутри себя. Ключ не попадает на компьютер даже в момент подписи. Для крупных сумм это разумный минимум.",
              "en": "A separate device that keeps the key offline and signs inside itself. The key never reaches the computer, not even while signing. For meaningful amounts this is the sensible minimum."
            }
          },
          {
            "title": {
              "ru": "Программный",
              "en": "Software"
            },
            "text": {
              "ru": "Приложение на телефоне или расширение в браузере. Удобно для повседневных сумм, но ключ живёт на устройстве, подключённом к интернету.",
              "en": "An app on a phone or an extension in a browser. Convenient for everyday amounts, but the key lives on a device that is online."
            }
          },
          {
            "title": {
              "ru": "Биржевой",
              "en": "Exchange-held"
            },
            "text": {
              "ru": "Ключей у вас нет вообще. Удобно для торговли и бессмысленно для хранения: банкротство или блокировка счёта решаются не вами.",
              "en": "You hold no keys at all. Fine for trading, pointless for storage: a bankruptcy or a frozen account is not yours to resolve."
            }
          },
          {
            "title": {
              "ru": "Мультиподпись",
              "en": "Multisig"
            },
            "text": {
              "ru": "Для перевода нужны несколько ключей из набора, например два из трёх. Убирает единственную точку отказа, но усложняет ежедневное пользование.",
              "en": "A transfer needs several keys out of a set, two of three for instance. It removes the single point of failure at the cost of everyday convenience."
            }
          }
        ]
      },
      {
        "heading": {
          "ru": "Правила, которые экономят деньги",
          "en": "Rules that save money"
        },
        "bullets": [
          {
            "title": {
              "ru": "Проверьте сеть перед отправкой",
              "en": "Check the network first"
            },
            "text": {
              "ru": "Один и тот же USDT существует в разных сетях. Отправка не в ту сеть — самая частая безвозвратная потеря у новичков.",
              "en": "The same USDT exists on several networks. Sending to the wrong one is the most common unrecoverable loss beginners make."
            }
          },
          {
            "title": {
              "ru": "Сначала пробный перевод",
              "en": "Send a test amount first"
            },
            "text": {
              "ru": "На новый адрес отправьте небольшую сумму и дождитесь зачисления. Комиссия за это дешевле любой ошибки.",
              "en": "Send a small amount to a new address and wait for it to arrive. That fee is cheaper than any mistake."
            }
          },
          {
            "title": {
              "ru": "Разделяйте кошельки",
              "en": "Separate your wallets"
            },
            "text": {
              "ru": "Один для долгого хранения, второй для сделок и подключения к сайтам. Взлом второго не должен стоить вам первого.",
              "en": "One for long-term holding, one for trading and connecting to sites. A compromise of the second must not cost you the first."
            }
          },
          {
            "title": {
              "ru": "Отзывайте разрешения",
              "en": "Revoke approvals"
            },
            "text": {
              "ru": "Подключаясь к DeFi-сервису, вы выдаёте контракту право тратить ваши токены. Разрешение остаётся действующим, пока его не отозвать.",
              "en": "Connecting to a DeFi service grants a contract the right to spend your tokens. That approval stays live until you revoke it."
            }
          }
        ]
      }
    ],
  },
  {
    slug: 'private-key',
    category: 'wallets',
    term: { ru: 'Приватный ключ', en: 'Private key' },
    definition: {
      "ru": "Приватный ключ — секретное число, которым подписываются переводы с вашего адреса. Он и есть право собственности: кто знает ключ, тот распоряжается монетами, и отменить это нельзя ни сменой пароля, ни обращением в поддержку.",
      "en": "A private key is the secret number that signs transfers from your address. It is ownership itself: whoever knows the key controls the coins, and no password change or support ticket can undo that."
    },
    updated: '2026-08-11',
    related: [
      "public-key",
      "seed-phrase",
      "wallet",
      "cold-wallet",
      "non-custodial-wallet",
      "transaction"
    ],
    sections: [
      {
        "heading": {
          "ru": "Как это работает",
          "en": "How it works"
        },
        "paragraphs": [
          {
            "ru": "Из приватного ключа математически выводится публичный, а из него — адрес. Обратный путь невозможен: зная адрес, вычислить ключ нельзя. Поэтому адрес можно публиковать где угодно.",
            "en": "A public key derives mathematically from the private one, and an address from that. The reverse does not work: an address cannot be turned back into a key. That is why an address can be published anywhere."
          },
          {
            "ru": "Отправляя монеты, кошелёк подписывает транзакцию ключом. Сеть проверяет подпись публичным ключом и убеждается, что распоряжение подлинное, — при этом сам приватный ключ она никогда не видит.",
            "en": "When you send coins, the wallet signs the transaction with the key. The network checks that signature against the public key and confirms the instruction is genuine, without ever seeing the private key."
          },
          {
            "ru": "На практике ключей у вас много: кошелёк выводит их из сид-фразы, по отдельному ключу на каждый адрес. Резервная копия делается с фразы, а не с каждого ключа по отдельности.",
            "en": "In practice you have many keys: the wallet derives them from a seed phrase, one per address. The backup you keep is the phrase, not each individual key."
          }
        ]
      },
      {
        "heading": {
          "ru": "Почему ключ не подбирают",
          "en": "Why keys are not guessed"
        },
        "example": {
          "setup": {
            "ru": "Приватный ключ биткоина — случайное 256-битное число.",
            "en": "A bitcoin private key is a random 256-bit number."
          },
          "rows": [
            {
              "label": {
                "ru": "Всего вариантов",
                "en": "Possible values"
              },
              "value": {
                "ru": "2 в степени 256",
                "en": "2 to the 256"
              }
            },
            {
              "label": {
                "ru": "Это примерно",
                "en": "Which is about"
              },
              "value": {
                "ru": "10 в степени 77",
                "en": "10 to the 77"
              }
            },
            {
              "label": {
                "ru": "Атомов в наблюдаемой Вселенной",
                "en": "Atoms in the observable universe"
              },
              "value": {
                "ru": "10 в степени 80",
                "en": "10 to the 80"
              }
            }
          ],
          "outcome": {
            "ru": "Перебор невозможен ни при какой вычислительной мощности. Поэтому ключи не взламывают, а забирают у владельца: через фишинг, вредоносное расширение, скриншот в облаке или поддельную страницу восстановления.",
            "en": "Brute force is out of the question at any scale of computing. So keys are not cracked, they are taken from the owner: phishing, a malicious extension, a screenshot in the cloud, a fake recovery page."
          }
        }
      },
      {
        "heading": {
          "ru": "Как не потерять контроль",
          "en": "How to keep control"
        },
        "bullets": [
          {
            "title": {
              "ru": "Ключ не вводят на сайтах",
              "en": "Never type it into a site"
            },
            "text": {
              "ru": "Ни один настоящий сервис не просит приватный ключ или сид-фразу. Запрос — это и есть атака.",
              "en": "No legitimate service asks for a private key or seed phrase. The request is the attack."
            }
          },
          {
            "title": {
              "ru": "Подписывайте на устройстве",
              "en": "Sign on a device"
            },
            "text": {
              "ru": "Аппаратный кошелёк подписывает внутри себя, поэтому ключ не появляется на заражённом компьютере даже на секунду.",
              "en": "A hardware wallet signs internally, so the key never appears on an infected computer, not even for a moment."
            }
          },
          {
            "title": {
              "ru": "Читайте, что подписываете",
              "en": "Read what you sign"
            },
            "text": {
              "ru": "Подпись — это не только перевод. Ею выдают контракту право тратить ваши токены, и выглядит это в интерфейсе почти так же.",
              "en": "A signature is not only a transfer. It can grant a contract the right to spend your tokens, and in the interface the two look nearly identical."
            }
          },
          {
            "title": {
              "ru": "Не храните всё под одним ключом",
              "en": "Do not keep everything under one key"
            },
            "text": {
              "ru": "Разделение по кошелькам ограничивает ущерб: одна ошибка тогда стоит части средств, а не всех сразу.",
              "en": "Splitting across wallets caps the damage: one mistake then costs part of the money rather than all of it."
            }
          }
        ]
      }
    ],
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
      "ru": "Майнинг — процесс, в котором компьютеры соревнуются за право записать очередной блок и получают за это новые монеты. Победитель определяется перебором вариантов, то есть затратами электричества, а не голосованием.",
      "en": "Mining is the process where computers compete for the right to write the next block and are paid in new coins for it. The winner is decided by grinding through candidates, meaning by electricity spent, not by a vote."
    },
    updated: '2026-08-11',
    related: [
      "proof-of-work",
      "halving",
      "bitcoin",
      "node",
      "hash",
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
            "ru": "Майнер собирает транзакции в блок и подбирает число, при котором хеш блока окажется меньше заданного порога. Угадать нельзя, можно только перебирать — миллиарды вариантов в секунду. Нашедший объявляет решение сети, остальные мгновенно проверяют его одной операцией.",
            "en": "A miner gathers transactions into a block and searches for a number that makes the block's hash fall below a target. It cannot be reasoned out, only tried, billions of attempts a second. Whoever finds it announces the solution, and everyone else verifies it instantly in a single operation."
          },
          {
            "ru": "Сложность подстраивается каждые 2016 блоков, примерно раз в две недели, чтобы блоки продолжали находиться раз в десять минут независимо от того, сколько мощности пришло в сеть или ушло из неё.",
            "en": "Difficulty readjusts every 2,016 blocks, roughly once a fortnight, so blocks keep arriving every ten minutes no matter how much hashpower has joined the network or left it."
          },
          {
            "ru": "В этом и смысл затрат: переписать историю можно, только повторив всю проделанную работу быстрее, чем её продолжает остальная сеть. Защита биткоина — это не запрет, а цена атаки.",
            "en": "That expense is the point: rewriting history means redoing all that work faster than the rest of the network extends it. Bitcoin's security is not a prohibition but a price on attacking it."
          }
        ]
      },
      {
        "heading": {
          "ru": "Экономика майнера",
          "en": "A miner's economics"
        },
        "example": {
          "setup": {
            "ru": "Установка на 200 TH/s потребляет 3,5 кВт. Электричество по $0,08 за кВт·ч.",
            "en": "A 200 TH/s rig draws 3.5 kW. Electricity costs $0.08 per kWh."
          },
          "rows": [
            {
              "label": {
                "ru": "Расход в сутки",
                "en": "Draw per day"
              },
              "value": {
                "ru": "3,5 × 24 = 84 кВт·ч",
                "en": "3.5 × 24 = 84 kWh"
              }
            },
            {
              "label": {
                "ru": "Стоимость электричества",
                "en": "Electricity cost"
              },
              "value": {
                "ru": "84 × $0,08",
                "en": "84 × $0.08"
              }
            }
          ],
          "total": {
            "label": {
              "ru": "Затраты в сутки",
              "en": "Cost per day"
            },
            "value": {
              "ru": "$6,72",
              "en": "$6.72"
            }
          },
          "outcome": {
            "ru": "Майнинг прибылен ровно до тех пор, пока намайненное за сутки стоит дороже этих $6,72 плюс амортизация оборудования. Поэтому при падении цены первыми выключаются те, у кого электричество дороже, а сложность потом снижается и возвращает остальным маржу.",
            "en": "Mining pays only while a day's output is worth more than that $6.72 plus wear on the hardware. So when the price falls, the miners with the dearest electricity switch off first, difficulty then drops, and margin returns for the rest."
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
              "ru": "В одиночку блок не найти",
              "en": "Solo mining does not find blocks"
            },
            "text": {
              "ru": "Одна установка против всей сети находит блок раз в десятки лет. Поэтому майнят в пулах, где награда делится по вкладу.",
              "en": "One rig against the whole network finds a block once in decades. That is why miners join pools, where the reward is split by contribution."
            }
          },
          {
            "title": {
              "ru": "Домашний майнинг биткоина мёртв",
              "en": "Home bitcoin mining is over"
            },
            "text": {
              "ru": "Конкурировать с промышленными площадками на дешёвой энергии видеокартой или домашним ASIC невозможно уже много лет.",
              "en": "Competing with industrial sites on cheap power, using a graphics card or a home ASIC, stopped being possible years ago."
            }
          },
          {
            "title": {
              "ru": "Оборудование стареет",
              "en": "Hardware ages"
            },
            "text": {
              "ru": "Новые модели эффективнее, и старые вытесняются, даже если ещё работают. Это не разовая покупка, а бизнес с амортизацией.",
              "en": "Newer models are more efficient and push older ones out even while they still run. This is a business with depreciation, not a one-off purchase."
            }
          },
          {
            "title": {
              "ru": "Не все сети майнятся",
              "en": "Not every network is mined"
            },
            "text": {
              "ru": "Ethereum перешёл на Proof-of-Stake в 2022 году: там блоки создают не майнеры, а валидаторы с заблокированными монетами.",
              "en": "Ethereum moved to Proof-of-Stake in 2022: there blocks come from validators with locked coins, not from miners."
            }
          }
        ]
      }
    ],
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
      "ru": "Смарт-контракт — программа, которая живёт в блокчейне и исполняется автоматически при заданных условиях. Её код виден всем, менять его после публикации обычно нельзя, и остановить исполнение никто не может.",
      "en": "A smart contract is a program that lives on a blockchain and executes automatically when its conditions are met. Its code is public, it usually cannot be changed after deployment, and nobody can halt its execution."
    },
    updated: '2026-08-11',
    related: [
      "defi",
      "gas-fee",
      "erc-20",
      "dex",
      "dao",
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
            "ru": "Контракт публикуется в сеть один раз и получает собственный адрес. Дальше любой может вызвать его функции, отправив транзакцию, а сеть исполнит код одинаково на всех узлах и запишет результат в блокчейн.",
            "en": "A contract is published to the network once and gets its own address. After that anyone can call its functions by sending a transaction, and the network executes the code identically on every node and writes the result to the chain."
          },
          {
            "ru": "За вычисления платит вызывающий — комиссией за газ. Чем сложнее операция, тем дороже, и если газа не хватило, изменения откатываются, а потраченная комиссия не возвращается.",
            "en": "The caller pays for the computation through a gas fee. The more complex the operation the more it costs, and if the gas runs out the changes revert while the fee spent does not come back."
          },
          {
            "ru": "Именно неизменность делает контракты полезными и опасными одновременно. Продавцу не нужно доверять, потому что правила исполнит код, — но и ошибку в этом коде чаще всего нельзя починить.",
            "en": "Immutability is what makes contracts both useful and dangerous. You need not trust a counterparty, because code enforces the terms; equally, a flaw in that code usually cannot be patched."
          }
        ]
      },
      {
        "heading": {
          "ru": "Что ими делают",
          "en": "What they are used for"
        },
        "bullets": [
          {
            "title": {
              "ru": "Выпуск токенов",
              "en": "Issuing tokens"
            },
            "text": {
              "ru": "Почти все токены, включая USDT и USDC, — это контракты, которые ведут учёт, у кого сколько на балансе.",
              "en": "Almost every token, USDT and USDC included, is a contract keeping a ledger of who holds what."
            }
          },
          {
            "title": {
              "ru": "Обмен без посредника",
              "en": "Swapping without a middleman"
            },
            "text": {
              "ru": "DEX — это контракт, который держит пул из двух активов и меняет один на другой по формуле, без биржи и без счёта.",
              "en": "A DEX is a contract holding a pool of two assets and swapping one for the other by formula, with no exchange and no account."
            }
          },
          {
            "title": {
              "ru": "Займы под залог",
              "en": "Collateralised lending"
            },
            "text": {
              "ru": "Контракт принимает залог, выдаёт заём и сам продаёт залог, если его цена опустилась ниже порога.",
              "en": "A contract takes collateral, issues a loan, and sells that collateral itself when its price falls below a threshold."
            }
          },
          {
            "title": {
              "ru": "Управление проектом",
              "en": "Running a project"
            },
            "text": {
              "ru": "DAO голосует токенами, и принятое решение исполняется контрактом, а не менеджером.",
              "en": "A DAO votes with tokens, and the decision is carried out by a contract rather than by a manager."
            }
          }
        ]
      },
      {
        "heading": {
          "ru": "На что смотреть",
          "en": "What to weigh"
        },
        "bullets": [
          {
            "title": {
              "ru": "Кто может его изменить",
              "en": "Who can change it"
            },
            "text": {
              "ru": "Многие контракты обновляемые, и тогда у кого-то есть ключ от обновления. Это удобно для разработки и опасно для вас.",
              "en": "Many contracts are upgradeable, which means somebody holds the upgrade key. Convenient for development, risky for you."
            }
          },
          {
            "title": {
              "ru": "Есть ли аудит и чей",
              "en": "Whose audit it has"
            },
            "text": {
              "ru": "Отчёт должен открываться, называть аудитора и относиться к тому же адресу контракта, а не к «версии проекта».",
              "en": "The report has to open, name the auditor, and cover the same contract address rather than some \"project version\"."
            }
          },
          {
            "title": {
              "ru": "Сколько в нём средств и как долго",
              "en": "How much it holds, and for how long"
            },
            "text": {
              "ru": "Контракт с крупной суммой, проживший годы без взлома, — сам по себе довод, хотя и не гарантия.",
              "en": "A contract holding a lot of money that has run for years unbroken is an argument in itself, though not a guarantee."
            }
          },
          {
            "title": {
              "ru": "Что вы ему разрешили",
              "en": "What you have approved"
            },
            "text": {
              "ru": "Разрешение на трату токенов остаётся бессрочным, пока его не отозвать вручную. Проверяйте выданные доступы.",
              "en": "A spending approval lasts indefinitely until you revoke it by hand. Review the ones you have granted."
            }
          }
        ]
      }
    ],
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
      "ru": "Альткоин — любая криптовалюта, кроме биткоина. Термин объединяет всё подряд: и вторую по размеру сеть Ethereum, и токен, выпущенный вчера ради шутки, — поэтому сам по себе он ничего не говорит о качестве.",
      "en": "An altcoin is any cryptocurrency other than bitcoin. The word lumps everything together, from Ethereum, the second largest network, to a token minted yesterday as a joke, so on its own it says nothing about quality."
    },
    updated: '2026-08-11',
    related: [
      "bitcoin",
      "market-cap",
      "tokenomics",
      "stablecoin",
      "nft",
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
            "ru": "Часть альткоинов — это собственные блокчейны со своей экономикой и защитой: Ethereum, Solana, Cardano. Другая часть — токены, живущие внутри чужой сети: их выпуск не требует ни майнеров, ни валидаторов, достаточно опубликовать смарт-контракт.",
            "en": "Some altcoins are their own blockchains with their own economics and security: Ethereum, Solana, Cardano. Others are tokens living inside someone else's network, which need no miners or validators at all, just a deployed smart contract."
          },
          {
            "ru": "Разница принципиальна для рисков. У самостоятельной сети есть узлы, разработчики и стоимость атаки. У токена за плечами только его контракт и команда, а выпустить такой токен стоит несколько долларов.",
            "en": "That difference drives the risk. A standalone network has nodes, developers and a cost of attacking it. A token has only its contract and its team behind it, and issuing one costs a few dollars."
          },
          {
            "ru": "Цена альткоинов сильно связана с биткоином: на его падениях они обычно падают глубже, а на росте отстают, пока капитал не начнёт переходить в них. Отсюда и разговоры про «альткоин-сезон».",
            "en": "Altcoin prices track bitcoin closely: they usually fall harder on its declines and lag on its rallies until capital starts rotating into them. Hence the talk of an \"altcoin season\"."
          }
        ]
      },
      {
        "heading": {
          "ru": "Как распределён рынок",
          "en": "How the market is split"
        },
        "example": {
          "setup": {
            "ru": "Порядок величин, который стоит держать в голове при сравнении проектов.",
            "en": "The orders of magnitude worth holding in mind when comparing projects."
          },
          "rows": [
            {
              "label": {
                "ru": "Доля биткоина в капитализации рынка",
                "en": "Bitcoin's share of market cap"
              },
              "value": {
                "ru": "≈ 50–60%",
                "en": "≈ 50–60%"
              }
            },
            {
              "label": {
                "ru": "Доля Ethereum",
                "en": "Ethereum's share"
              },
              "value": {
                "ru": "≈ 10–15%",
                "en": "≈ 10–15%"
              }
            },
            {
              "label": {
                "ru": "Всё остальное",
                "en": "Everything else"
              },
              "value": {
                "ru": "≈ 25–40%",
                "en": "≈ 25–40%"
              }
            }
          ],
          "outcome": {
            "ru": "Эти проценты делятся между десятками тысяч монет, и подавляющее большинство из них не имеет ни оборота, ни пользователей. «Тысячи проектов» на практике означают несколько десятков живых и очень длинный хвост.",
            "en": "Those last percent are split across tens of thousands of coins, the vast majority with neither volume nor users. \"Thousands of projects\" in practice means a few dozen live ones and a very long tail."
          }
        }
      },
      {
        "heading": {
          "ru": "Как отличать",
          "en": "How to tell them apart"
        },
        "bullets": [
          {
            "title": {
              "ru": "Своя сеть или токен",
              "en": "Own network or token"
            },
            "text": {
              "ru": "Первый вопрос к любому проекту. Токен в чужой сети наследует её безопасность, но не имеет собственной.",
              "en": "The first question about any project. A token inherits its host network's security and has none of its own."
            }
          },
          {
            "title": {
              "ru": "Оборот, а не капитализация",
              "en": "Volume, not market cap"
            },
            "text": {
              "ru": "Капитализация в сотни миллионов при обороте в десятки тысяч означает, что выйти по этой цене нельзя.",
              "en": "A cap in the hundreds of millions on volume in the tens of thousands means nobody exits at that price."
            }
          },
          {
            "title": {
              "ru": "Кто держит запас",
              "en": "Who holds the supply"
            },
            "text": {
              "ru": "Несколько кошельков с половиной всех монет — это не инвестиция, а ставка на их поведение.",
              "en": "A handful of wallets holding half the supply is not an investment, it is a bet on how they behave."
            }
          },
          {
            "title": {
              "ru": "Что проект делает сегодня",
              "en": "What the project does today"
            },
            "text": {
              "ru": "Дорожная карта описывает намерения. Работающий продукт и живые пользователи описывают факт.",
              "en": "A roadmap describes intentions. A working product with real users describes facts."
            }
          }
        ]
      }
    ],
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
      "ru": "DEX — обменник, работающий на смарт-контрактах: у него нет счетов, регистрации и хранения ваших средств. Вы меняете токены прямо из своего кошелька, а цену задаёт не стакан заявок, а пул ликвидности.",
      "en": "A DEX is an exchange built on smart contracts: no accounts, no registration, no custody of your funds. You swap tokens straight from your own wallet, and the price comes from a liquidity pool rather than an order book."
    },
    updated: '2026-08-11',
    related: [
      "liquidity-pool",
      "smart-contract",
      "slippage",
      "cex",
      "defi",
      "gas-fee"
    ],
    sections: [
      {
        "heading": {
          "ru": "Как это работает",
          "en": "How it works"
        },
        "paragraphs": [
          {
            "ru": "В пуле лежат два актива, внесённые другими пользователями. Контракт держит их произведение постоянным: покупая один токен, вы забираете его из пула и добавляете второй, и соотношение сдвигается — это и есть новая цена.",
            "en": "A pool holds two assets, deposited by other users. The contract keeps their product constant: buying one token takes it out of the pool and puts the other in, the ratio shifts, and that shift is the new price."
          },
          {
            "ru": "Поэтому цена зависит от размера сделки относительно пула. В глубоком пуле обмен на тысячу долларов почти не двигает курс, в мелком та же тысяча уводит его на проценты.",
            "en": "So the price depends on trade size relative to the pool. In a deep pool a thousand-dollar swap barely moves the rate; in a shallow one the same thousand moves it by whole percent."
          },
          {
            "ru": "Средства всё время остаются у вас: контракт получает право взять токены ровно на эту операцию. Ни заморозить счёт, ни отказать в выводе некому — как и некому помочь при ошибке.",
            "en": "Your funds stay yours throughout: the contract is granted the right to take tokens for exactly this operation. Nobody can freeze an account or refuse a withdrawal, and equally nobody can help when you get something wrong."
          }
        ]
      },
      {
        "heading": {
          "ru": "DEX или биржа",
          "en": "DEX or exchange"
        },
        "example": {
          "setup": {
            "ru": "Что различается на практике при обмене одной и той же суммы.",
            "en": "What actually differs when swapping the same amount."
          },
          "rows": [
            {
              "label": {
                "ru": "Хранение средств",
                "en": "Custody"
              },
              "value": {
                "ru": "у вас / у биржи",
                "en": "yours / the exchange's"
              }
            },
            {
              "label": {
                "ru": "Проверка личности",
                "en": "Identity check"
              },
              "value": {
                "ru": "нет / KYC",
                "en": "none / KYC"
              }
            },
            {
              "label": {
                "ru": "Комиссия за обмен",
                "en": "Swap fee"
              },
              "value": {
                "ru": "0,05–1% + газ",
                "en": "0.05–1% + gas"
              }
            },
            {
              "label": {
                "ru": "Новые токены",
                "en": "New tokens"
              },
              "value": {
                "ru": "сразу / после листинга",
                "en": "immediately / after listing"
              }
            }
          ],
          "outcome": {
            "ru": "На крупных парах биржа обычно дешевле из-за газа, а DEX выигрывает там, где токена ещё нет в листингах или где важно не отдавать средства на хранение.",
            "en": "On major pairs an exchange is usually cheaper once gas is counted; a DEX wins where a token is not listed yet, or where not handing over custody matters."
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
              "ru": "Токены-двойники",
              "en": "Impostor tokens"
            },
            "text": {
              "ru": "Создать токен с любым названием и логотипом ничего не стоит. Сверяйте адрес контракта, а не имя в списке.",
              "en": "Creating a token with any name and logo costs nothing. Verify the contract address, not the name in a list."
            }
          },
          {
            "title": {
              "ru": "Проскальзывание на тонком пуле",
              "en": "Slippage in a thin pool"
            },
            "text": {
              "ru": "Крупная сделка в мелком пуле исполняется заметно хуже экрана. Ограничивайте допуск, а не поднимайте его.",
              "en": "A large trade in a small pool fills well below the screen price. Cap your tolerance instead of raising it."
            }
          },
          {
            "title": {
              "ru": "Сэндвич-атаки",
              "en": "Sandwich attacks"
            },
            "text": {
              "ru": "Боты видят вашу сделку до исполнения и зарабатывают на ней, если допуск по проскальзыванию выставлен большим.",
              "en": "Bots see your trade before it executes and profit from it whenever your slippage tolerance is set wide."
            }
          },
          {
            "title": {
              "ru": "Ошибка в контракте",
              "en": "A contract bug"
            },
            "text": {
              "ru": "Средства в пуле защищены только кодом. Взлом контракта не страхуется и не отменяется.",
              "en": "Money in a pool is protected by code alone. A contract exploit is neither insured nor reversible."
            }
          }
        ]
      }
    ],
  },
  {
    slug: 'cex',
    category: 'trading',
    term: { ru: 'CEX (централизованная биржа)', en: 'CEX (centralized exchange)' },
    definition: {
      "ru": "CEX — централизованная биржа: компания, которая хранит ваши средства, ведёт счета и сводит заявки покупателей и продавцов в стакане. Быстро и удобно, но ключи от монет находятся у неё, а не у вас.",
      "en": "A CEX is a centralised exchange: a company that holds your funds, runs the accounts, and matches buy and sell orders in an order book. Fast and convenient, but it holds the keys to the coins, not you."
    },
    updated: '2026-08-11',
    related: [
      "exchange",
      "dex",
      "order-book",
      "kyc",
      "custodial-wallet",
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
            "ru": "Пополняя счёт, вы переводите монеты на адрес биржи. Дальше сделки идут в её внутренней базе, а не в блокчейне: поэтому они мгновенные и без комиссии сети. В блокчейн операция возвращается только при выводе.",
            "en": "Depositing sends coins to the exchange's own address. From there trades happen in its internal database rather than on-chain, which is why they are instant and carry no network fee. The blockchain sees the money again only on withdrawal."
          },
          {
            "ru": "Цену определяет стакан заявок. Рыночный ордер исполняется сразу по лучшим доступным ценам, лимитный ждёт своей. Чем больше заявок стоит рядом с текущей ценой, тем меньше вы теряете на крупной сделке.",
            "en": "Price comes from the order book. A market order fills immediately against the best available offers, a limit order waits for its price. The more orders sit near the current price, the less a large trade costs you."
          },
          {
            "ru": "Биржа берёт комиссию с каждой сделки, обычно 0,1–0,2%, и часто разную для того, кто добавляет ликвидность, и того, кто её забирает. К этому добавляется комиссия за вывод — иногда заметно выше сетевой.",
            "en": "The exchange charges on every trade, usually 0.1–0.2%, and often at different rates for adding liquidity and taking it. On top comes a withdrawal fee, sometimes noticeably above the network's own."
          }
        ]
      },
      {
        "heading": {
          "ru": "Из чего складывается цена сделки",
          "en": "What a trade really costs"
        },
        "example": {
          "setup": {
            "ru": "Покупка на $1 000 и последующий вывод монет на свой кошелёк.",
            "en": "A $1,000 purchase followed by a withdrawal to your own wallet."
          },
          "rows": [
            {
              "label": {
                "ru": "Комиссия за сделку, 0,1%",
                "en": "Trading fee, 0.1%"
              },
              "value": {
                "ru": "$1,00",
                "en": "$1.00"
              }
            },
            {
              "label": {
                "ru": "Спред на ликвидной паре",
                "en": "Spread on a liquid pair"
              },
              "value": {
                "ru": "≈ $0,20",
                "en": "≈ $0.20"
              }
            },
            {
              "label": {
                "ru": "Вывод в сети",
                "en": "Network withdrawal"
              },
              "value": {
                "ru": "$1–5",
                "en": "$1–5"
              }
            }
          ],
          "total": {
            "label": {
              "ru": "Итого",
              "en": "Total"
            },
            "value": {
              "ru": "≈ $2–6",
              "en": "≈ $2–6"
            }
          },
          "outcome": {
            "ru": "На ликвидной паре главные расходы — вывод, а не торговля. На тонкой паре всё наоборот: спред и проскальзывание легко превышают комиссию в несколько раз.",
            "en": "On a liquid pair the withdrawal dominates, not the trading. On a thin pair it inverts: spread and slippage easily run several times the fee."
          }
        }
      },
      {
        "heading": {
          "ru": "На что смотреть при выборе",
          "en": "What to weigh when choosing"
        },
        "bullets": [
          {
            "title": {
              "ru": "Лицензия в вашей юрисдикции",
              "en": "A licence where you live"
            },
            "text": {
              "ru": "В ЕС это регистрация по MiCA. Она не гарантирует сохранность, но даёт понятный порядок в спорной ситуации.",
              "en": "In the EU that means MiCA registration. It guarantees nothing about solvency, but it gives a defined process when something goes wrong."
            }
          },
          {
            "title": {
              "ru": "Реальный оборот пары",
              "en": "The pair's real volume"
            },
            "text": {
              "ru": "Крупная биржа с тонкой парой хуже мелкой с глубокой: значение имеет ликвидность именно в том, чем вы торгуете.",
              "en": "A big exchange with a thin pair is worse than a small one with a deep pair: what matters is liquidity in the thing you actually trade."
            }
          },
          {
            "title": {
              "ru": "Условия вывода",
              "en": "Withdrawal terms"
            },
            "text": {
              "ru": "Смотрите лимиты, сроки и фиксированные комиссии заранее — на этапе вывода менять площадку поздно.",
              "en": "Check limits, timings and flat fees up front; the withdrawal step is a bad moment to discover them."
            }
          },
          {
            "title": {
              "ru": "Не биржа для хранения",
              "en": "Not a place to store"
            },
            "text": {
              "ru": "Счёт на бирже — это обязательство компании, а не ваши монеты. То, что не торгуется прямо сейчас, лучше держать в своём кошельке.",
              "en": "An exchange balance is the company's obligation, not your coins. Whatever you are not actively trading belongs in your own wallet."
            }
          }
        ]
      }
    ],
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
      "ru": "Пул ликвидности — запас двух токенов в смарт-контракте, из которого идёт обмен на DEX. Цену задаёт не стакан заявок, а соотношение активов в пуле, а пополняют его обычные пользователи в обмен на долю комиссий.",
      "en": "A liquidity pool is a reserve of two tokens held in a smart contract that a DEX swaps against. The price comes from the ratio between the assets rather than an order book, and ordinary users fund it in exchange for a share of the fees."
    },
    updated: '2026-08-11',
    related: [
      "dex",
      "defi",
      "slippage",
      "yield-farming",
      "smart-contract",
      "stablecoin"
    ],
    sections: [
      {
        "heading": {
          "ru": "Как это работает",
          "en": "How it works"
        },
        "paragraphs": [
          {
            "ru": "Контракт держит произведение количеств двух токенов постоянным. Покупая один, вы забираете его из пула и добавляете другой — соотношение сдвигается, и это и есть новая цена. Формулу придумали, чтобы обходиться без покупателей и продавцов в одно и то же время.",
            "en": "The contract keeps the product of the two token balances constant. Buying one takes it out and puts the other in; the ratio shifts, and that shift is the new price. The formula exists so that a trade needs no matching counterparty at that moment."
          },
          {
            "ru": "Поставщик ликвидности вносит оба актива в текущей пропорции и получает токен-расписку на свою долю. Комиссии со всех сделок, обычно 0,05–1%, распределяются между всеми держателями долей.",
            "en": "A liquidity provider deposits both assets in the current ratio and receives a token representing their share. Fees from every trade, usually 0.05–1%, are split among all share holders."
          },
          {
            "ru": "Глубина пула определяет цену крупной сделки. В пуле на миллион долларов обмен на тысячу почти не двигает курс, в пуле на пятьдесят тысяч та же тысяча уводит его на проценты.",
            "en": "Pool depth decides what a large trade costs. In a million-dollar pool a thousand-dollar swap barely moves the rate; in a fifty-thousand-dollar pool the same thousand moves it by whole percent."
          }
        ]
      },
      {
        "heading": {
          "ru": "Непостоянные потери",
          "en": "Impermanent loss"
        },
        "example": {
          "setup": {
            "ru": "Вы внесли 1 ETH по $2 000 и 2 000 USDT. Цена ETH выросла вдвое, до $4 000.",
            "en": "You deposit 1 ETH at $2,000 alongside 2,000 USDT. ETH then doubles to $4,000."
          },
          "rows": [
            {
              "label": {
                "ru": "Если бы просто держали",
                "en": "If you had simply held"
              },
              "value": {
                "ru": "$6 000",
                "en": "$6,000"
              }
            },
            {
              "label": {
                "ru": "Стоимость доли в пуле",
                "en": "Value of the pool share"
              },
              "value": {
                "ru": "≈ $5 657",
                "en": "≈ $5,657"
              }
            }
          ],
          "total": {
            "label": {
              "ru": "Разница",
              "en": "Difference"
            },
            "value": {
              "ru": "≈ −$343 (−5,7%)",
              "en": "≈ −$343 (−5.7%)"
            }
          },
          "outcome": {
            "ru": "Пул автоматически продавал дорожающий ETH по дороге вверх, поэтому его в вашей доле стало меньше. Комиссии могут перекрыть разницу, а могут и нет — «непостоянной» потеря считается лишь потому, что исчезает, если цена вернётся к исходной.",
            "en": "The pool sold ETH all the way up, so your share holds less of it. Fees may or may not cover the gap. The loss is called impermanent only because it disappears if the price returns to where it started."
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
              "ru": "Пары из похожих активов безопаснее",
              "en": "Correlated pairs are safer"
            },
            "text": {
              "ru": "У пула из двух стейблкоинов непостоянных потерь почти нет — их цены не расходятся.",
              "en": "A pool of two stablecoins has almost no impermanent loss: their prices do not diverge."
            }
          },
          {
            "title": {
              "ru": "Годовые считаются от объёма",
              "en": "Yield comes from volume"
            },
            "text": {
              "ru": "Высокий APR в пуле без сделок — это цифра из воздуха. Смотрите оборот, а не обещание.",
              "en": "A high APR in a pool with no trades is a number from nowhere. Read the volume, not the promise."
            }
          },
          {
            "title": {
              "ru": "Доходность часто платят токеном проекта",
              "en": "Rewards are often the project's own token"
            },
            "text": {
              "ru": "Он дешевеет ровно потому, что его печатают для выплат. Считайте доход в том, что реально останется.",
              "en": "It falls in price precisely because it is being printed to pay you. Count the yield in what you will actually keep."
            }
          },
          {
            "title": {
              "ru": "Риск контракта никуда не девается",
              "en": "Contract risk remains"
            },
            "text": {
              "ru": "Средства лежат в коде. Взлом пула не страхуется, а вывести их до атаки успевает атакующий.",
              "en": "The money sits in code. A pool exploit is uninsured, and the attacker is the one who gets out first."
            }
          }
        ]
      }
    ],
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
      "ru": "Proof-of-Work — способ договориться, кто запишет следующий блок: право получает тот, кто первым подберёт решение вычислительной задачи. Подбор стоит электричества, и именно эта цена защищает сеть от переписывания истории.",
      "en": "Proof-of-Work is how a network agrees who writes the next block: the right goes to whoever first finds the solution to a computational puzzle. The search costs electricity, and that cost is what stops the history being rewritten."
    },
    updated: '2026-08-11',
    related: [
      "mining",
      "proof-of-stake",
      "consensus-mechanism",
      "hash",
      "halving",
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
            "ru": "Майнер подбирает число, при котором хеш блока окажется меньше заданного порога. Угадать невозможно, только перебирать — миллиарды попыток в секунду. Зато проверка занимает одну операцию: остальные узлы мгновенно убеждаются, что решение верно.",
            "en": "A miner searches for a number that makes the block's hash fall below a target. It cannot be reasoned out, only tried, billions of attempts a second. Verification, though, is a single operation: other nodes confirm the answer instantly."
          },
          {
            "ru": "Асимметрия между дорогим поиском и дешёвой проверкой — суть механизма. Сеть не доверяет никому и ничего не голосует: она просто принимает ту цепочку, в которую вложено больше работы.",
            "en": "That asymmetry between an expensive search and a cheap check is the whole mechanism. The network trusts nobody and votes on nothing: it simply accepts whichever chain has more work behind it."
          },
          {
            "ru": "Сложность пересчитывается каждые 2016 блоков, около двух недель, и держит интервал между блоками у десяти минут независимо от того, сколько мощности пришло в сеть.",
            "en": "Difficulty readjusts every 2,016 blocks, roughly a fortnight, holding the gap between blocks near ten minutes no matter how much hashpower has joined."
          }
        ]
      },
      {
        "heading": {
          "ru": "Почему это дорого атаковать",
          "en": "Why attacking it is expensive"
        },
        "example": {
          "setup": {
            "ru": "Чтобы переписать историю, нужно контролировать больше половины мощности сети и удерживать её.",
            "en": "Rewriting history means controlling more than half the network's hashpower and holding it."
          },
          "rows": [
            {
              "label": {
                "ru": "Нужно оборудования",
                "en": "Hardware required"
              },
              "value": {
                "ru": "> 50% сети",
                "en": "> 50% of the network"
              }
            },
            {
              "label": {
                "ru": "Расход энергии",
                "en": "Energy draw"
              },
              "value": {
                "ru": "как у средней страны",
                "en": "comparable to a mid-size country"
              }
            },
            {
              "label": {
                "ru": "Что даёт атака",
                "en": "What it achieves"
              },
              "value": {
                "ru": "двойная трата",
                "en": "a double-spend"
              }
            }
          ],
          "outcome": {
            "ru": "Атакующий не может создать монеты из воздуха и не может тронуть чужие адреса — только отменить собственные недавние переводы. Затраты при этом сопоставимы с бюджетом крупной компании, а сеть после атаки обесценится вместе с добычей.",
            "en": "An attacker cannot conjure coins or touch anyone else's addresses, only reverse their own recent transfers. The cost runs to a large company's budget, and the network they attacked devalues along with the prize."
          }
        }
      },
      {
        "heading": {
          "ru": "Сильные и слабые стороны",
          "en": "Strengths and weaknesses"
        },
        "bullets": [
          {
            "title": {
              "ru": "Проверено временем",
              "en": "Proven by time"
            },
            "text": {
              "ru": "Биткоин работает на этом механизме с 2009 года без единой успешной атаки на консенсус.",
              "en": "Bitcoin has run on it since 2009 without a single successful attack on consensus."
            }
          },
          {
            "title": {
              "ru": "Не требует доверия к участникам",
              "en": "It needs no trust in participants"
            },
            "text": {
              "ru": "Вход открыт любому с оборудованием, и никто не решает, кого допустить.",
              "en": "Anyone with hardware can join, and nobody decides who is admitted."
            }
          },
          {
            "title": {
              "ru": "Дорого по энергии",
              "en": "Energy-hungry"
            },
            "text": {
              "ru": "Это плата за безопасность, а не побочный эффект: дешёвая защита означала бы дешёвую атаку.",
              "en": "That is the price of the security, not a side effect: cheap defence would mean a cheap attack."
            }
          },
          {
            "title": {
              "ru": "Пропускная способность ограничена",
              "en": "Throughput is limited"
            },
            "text": {
              "ru": "Десять минут на блок — сознательный компромисс. Скорость ищут в решениях второго уровня, а не в самой сети.",
              "en": "Ten minutes a block is a deliberate trade-off. Speed is sought in layer-2 solutions rather than in the base network."
            }
          }
        ]
      }
    ],
  },
  {
    slug: 'proof-of-stake',
    category: 'tech',
    term: { ru: 'Proof-of-Stake (PoS)', en: 'Proof-of-Stake (PoS)' },
    definition: {
      "ru": "Proof-of-Stake — механизм, в котором право записать блок получает не самый мощный компьютер, а тот, кто заблокировал монеты в сети. Залог и есть гарантия честности: за нарушение часть ставки сжигается.",
      "en": "Proof-of-Stake gives the right to write a block not to the strongest computer but to whoever has locked coins in the network. The stake is the guarantee of honesty: misbehave and part of it is burned."
    },
    updated: '2026-08-11',
    related: [
      "staking",
      "proof-of-work",
      "consensus-mechanism",
      "node",
      "defi",
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
            "ru": "Валидатор вносит залог и получает право предлагать блоки. Очередь распределяется псевдослучайно, но с весом по размеру ставки: больше залог — чаще очередь и выше доход.",
            "en": "A validator posts a stake and earns the right to propose blocks. Turns are assigned pseudo-randomly but weighted by stake size: a larger stake means more turns and more income."
          },
          {
            "ru": "Честность обеспечивается штрафом. Если валидатор подписывает противоречащие блоки или долго не выходит на связь, сеть списывает часть его залога — это называется слэшингом. Атаковать становится дорого не по электричеству, а по собственным заблокированным деньгам.",
            "en": "Honesty is enforced by penalty. A validator that signs conflicting blocks or goes offline for long has part of its stake taken, a mechanism called slashing. Attacking becomes expensive not in electricity but in your own locked money."
          },
          {
            "ru": "Ethereum перешёл на этот механизм в сентябре 2022 года, сократив энергопотребление сети примерно на 99,9%. Порог для собственного валидатора там — 32 ETH, меньшие суммы участвуют через делегирование или пулы.",
            "en": "Ethereum switched to it in September 2022, cutting the network's energy use by roughly 99.9%. Running your own validator there takes 32 ETH; smaller amounts take part through delegation or pools."
          }
        ]
      },
      {
        "heading": {
          "ru": "Что теряет валидатор",
          "en": "What a validator stands to lose"
        },
        "example": {
          "setup": {
            "ru": "Порядок величин штрафов в Ethereum при ставке 32 ETH.",
            "en": "The scale of penalties on Ethereum for a 32 ETH stake."
          },
          "rows": [
            {
              "label": {
                "ru": "Простой валидатора",
                "en": "Being offline"
              },
              "value": {
                "ru": "примерно как недополученный доход",
                "en": "about the income foregone"
              }
            },
            {
              "label": {
                "ru": "Двойная подпись",
                "en": "Double signing"
              },
              "value": {
                "ru": "от 1 ETH и выше",
                "en": "from 1 ETH upward"
              }
            },
            {
              "label": {
                "ru": "Массовое нарушение",
                "en": "Correlated failure"
              },
              "value": {
                "ru": "до всей ставки",
                "en": "up to the whole stake"
              }
            }
          ],
          "outcome": {
            "ru": "Штраф растёт, если нарушают многие одновременно. Так сеть наказывает не ошибку одного, а согласованную атаку — и заодно поощряет использовать разных провайдеров, а не один облачный сервис на всех.",
            "en": "The penalty scales with how many fail at once. That way the network punishes a coordinated attack rather than an individual mistake, and incidentally rewards spreading across providers instead of one cloud host."
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
              "ru": "Экономия энергии реальна",
              "en": "The energy saving is real"
            },
            "text": {
              "ru": "Оборудование валидатора — это обычный сервер, а не ферма. Отсюда и падение потребления на три порядка.",
              "en": "A validator runs on an ordinary server, not a farm. Hence a drop in consumption of three orders of magnitude."
            }
          },
          {
            "title": {
              "ru": "Богатые получают больше",
              "en": "The large stake earns more"
            },
            "text": {
              "ru": "Доход пропорционален ставке, поэтому концентрация со временем растёт. Это главный содержательный упрёк механизму.",
              "en": "Income is proportional to stake, so concentration grows over time. That is the substantive objection to the design."
            }
          },
          {
            "title": {
              "ru": "Монеты не мгновенно доступны",
              "en": "Coins are not instantly free"
            },
            "text": {
              "ru": "У выхода из стейкинга есть период ожидания, и цена всё это время движется без вас.",
              "en": "Exiting has a waiting period, and the price keeps moving throughout it."
            }
          },
          {
            "title": {
              "ru": "Делегирование не снимает риск",
              "en": "Delegating does not remove risk"
            },
            "text": {
              "ru": "Слэшинг валидатора задевает и делегатов. Выбор оператора — это выбор риска, а не только комиссии.",
              "en": "A validator's slashing hits its delegators too. Choosing an operator is choosing risk, not only a fee."
            }
          }
        ]
      }
    ],
  },
  {
    slug: 'erc-20',
    category: 'tokens',
    term: { ru: 'ERC-20', en: 'ERC-20' },
    definition: {
      "ru": "ERC-20 — стандарт токенов в сети Ethereum: набор правил, которым следует контракт, чтобы кошельки и биржи понимали токен без отдельной поддержки. Большинство известных токенов, включая USDT и USDC, выпущены по нему.",
      "en": "ERC-20 is the token standard on Ethereum: a set of rules a contract follows so wallets and exchanges understand the token without bespoke support. Most well-known tokens, USDT and USDC among them, are issued under it."
    },
    updated: '2026-08-11',
    related: [
      "trc-20",
      "bep-20",
      "smart-contract",
      "gas-fee",
      "stablecoin",
      "wallet"
    ],
    sections: [
      {
        "heading": {
          "ru": "Как это работает",
          "en": "How it works"
        },
        "paragraphs": [
          {
            "ru": "Стандарт описывает несколько обязательных функций: узнать баланс, перевести токены, разрешить кому-то тратить ваши. Любой контракт с этими функциями автоматически работает во всех кошельках и на всех биржах — им не нужно ничего добавлять под каждый новый токен.",
            "en": "The standard defines a handful of required functions: read a balance, transfer tokens, approve someone to spend yours. Any contract with them works in every wallet and on every exchange automatically, with nothing to add per token."
          },
          {
            "ru": "Сам токен — это просто запись в контракте о том, кому сколько принадлежит. Никаких отдельных «монет» не существует, поэтому выпуск токена стоит цену одной транзакции, и сделать это может кто угодно.",
            "en": "The token itself is just an entry in a contract saying who owns how much. No separate \"coins\" exist, so issuing one costs a single transaction, and anyone can do it."
          },
          {
            "ru": "Комиссию при переводе ERC-20 платят в ETH, а не в самом токене. Поэтому кошелёк с одними лишь USDT на балансе не может ничего отправить: на газ нужен эфир.",
            "en": "Fees on an ERC-20 transfer are paid in ETH, not in the token itself. So a wallet holding only USDT can send nothing at all: gas needs ether."
          }
        ]
      },
      {
        "heading": {
          "ru": "Одинаковый токен в разных сетях",
          "en": "The same token on different networks"
        },
        "example": {
          "setup": {
            "ru": "USDT существует в нескольких сетях. Это разные токены с одинаковым названием.",
            "en": "USDT exists on several networks. They are different tokens with the same name."
          },
          "rows": [
            {
              "label": {
                "ru": "ERC-20 (Ethereum)",
                "en": "ERC-20 (Ethereum)"
              },
              "value": {
                "ru": "комиссия в ETH",
                "en": "fee in ETH"
              }
            },
            {
              "label": {
                "ru": "TRC-20 (Tron)",
                "en": "TRC-20 (Tron)"
              },
              "value": {
                "ru": "комиссия в TRX",
                "en": "fee in TRX"
              }
            },
            {
              "label": {
                "ru": "BEP-20 (BNB Chain)",
                "en": "BEP-20 (BNB Chain)"
              },
              "value": {
                "ru": "комиссия в BNB",
                "en": "fee in BNB"
              }
            }
          ],
          "outcome": {
            "ru": "Отправив USDT в сети ERC-20 на адрес, который биржа выдала для TRC-20, вы отправите их в никуда. Это самая частая безвозвратная потеря у новичков, и предупреждение о выборе сети на бирже стоит там не для красоты.",
            "en": "Send ERC-20 USDT to an address an exchange issued for TRC-20 and it goes nowhere. This is the most common unrecoverable loss beginners make, and the network warning on an exchange is not decoration."
          }
        }
      },
      {
        "heading": {
          "ru": "Что стоит знать",
          "en": "What to know"
        },
        "bullets": [
          {
            "title": {
              "ru": "Название ничего не гарантирует",
              "en": "A name guarantees nothing"
            },
            "text": {
              "ru": "Выпустить токен с именем и логотипом любого проекта стоит несколько долларов. Проверяйте адрес контракта.",
              "en": "Issuing a token with any project's name and logo costs a few dollars. Verify the contract address."
            }
          },
          {
            "title": {
              "ru": "Нужен ETH на комиссию",
              "en": "You need ETH for gas"
            },
            "text": {
              "ru": "Держите небольшой запас эфира на любом кошельке с ERC-20 токенами, иначе они окажутся заперты.",
              "en": "Keep a little ether in any wallet holding ERC-20 tokens, or they are stranded there."
            }
          },
          {
            "title": {
              "ru": "Разрешения бессрочны",
              "en": "Approvals are open-ended"
            },
            "text": {
              "ru": "Функция approve выдаёт контракту право тратить ваши токены и действует, пока её не отозвать вручную.",
              "en": "The approve function grants a contract the right to spend your tokens and stays live until you revoke it by hand."
            }
          },
          {
            "title": {
              "ru": "Есть более новые стандарты",
              "en": "Newer standards exist"
            },
            "text": {
              "ru": "ERC-721 и ERC-1155 описывают NFT. ERC-20 — только для взаимозаменяемых токенов, где одна единица равна любой другой.",
              "en": "ERC-721 and ERC-1155 cover NFTs. ERC-20 is only for fungible tokens, where one unit equals any other."
            }
          }
        ]
      }
    ],
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
      "ru": "Холодный кошелёк — хранилище ключей, которое никогда не подключено к интернету. Подпись транзакции происходит внутри устройства, поэтому вредоносная программа на компьютере не может добраться до ключа.",
      "en": "A cold wallet keeps keys on something that is never connected to the internet. Transactions are signed inside the device, so malware on the computer has no path to the key."
    },
    updated: '2026-08-11',
    related: [
      "hot-wallet",
      "wallet",
      "private-key",
      "seed-phrase",
      "non-custodial-wallet",
      "custodial-wallet"
    ],
    sections: [
      {
        "heading": {
          "ru": "Как это работает",
          "en": "How it works"
        },
        "paragraphs": [
          {
            "ru": "Компьютер собирает транзакцию и передаёт её устройству. Устройство показывает сумму и адрес на собственном экране, вы подтверждаете кнопкой, и наружу выходит только подпись. Ключ физически не покидает устройство ни на одном шаге.",
            "en": "The computer assembles a transaction and hands it to the device. The device shows the amount and address on its own screen, you confirm with a button, and only a signature comes back out. The key physically never leaves the device."
          },
          {
            "ru": "Отсюда и смысл собственного экрана: заражённый компьютер может подменить адрес получателя в интерфейсе, но не на дисплее устройства. Сверять адрес нужно именно там.",
            "en": "Which is what the device's own screen is for: an infected computer can swap the recipient address in the interface but not on the device's display. That display is where the address must be checked."
          },
          {
            "ru": "Холодным может быть не только аппаратный кошелёк. Ключ, записанный на бумаге и никогда не вводившийся в компьютер, тоже холодный — просто пользоваться им неудобно и рискованно при вводе.",
            "en": "Cold storage is not only a hardware wallet. A key written on paper and never typed into a computer is cold as well, just awkward to use and risky at the moment of entry."
          }
        ]
      },
      {
        "heading": {
          "ru": "Когда это нужно",
          "en": "When it is worth it"
        },
        "bullets": [
          {
            "title": {
              "ru": "Сумма, которую жалко потерять",
              "en": "An amount you would mind losing"
            },
            "text": {
              "ru": "Простое правило: если потеря этих денег изменит вашу жизнь, они не должны лежать в кошельке на телефоне.",
              "en": "A simple rule: if losing the money would change your life, it does not belong in a phone wallet."
            }
          },
          {
            "title": {
              "ru": "Долгое хранение",
              "en": "Long-term holding"
            },
            "text": {
              "ru": "Активы, которые вы не собираетесь трогать месяцами, ничего не теряют от того, что доступ к ним занимает лишнюю минуту.",
              "en": "Assets you will not touch for months lose nothing from taking an extra minute to reach."
            }
          },
          {
            "title": {
              "ru": "Работа с незнакомыми сайтами",
              "en": "Dealing with unfamiliar sites"
            },
            "text": {
              "ru": "Основной запас на холодном, отдельный горячий кошелёк для подключений — тогда ошибка стоит только того, что было в горячем.",
              "en": "Main holdings cold, a separate hot wallet for connections: a mistake then costs only what was in the hot one."
            }
          }
        ]
      },
      {
        "heading": {
          "ru": "Чего оно не защищает",
          "en": "What it does not protect against"
        },
        "bullets": [
          {
            "title": {
              "ru": "От потери сид-фразы",
              "en": "Losing the seed phrase"
            },
            "text": {
              "ru": "Устройство — это не резервная копия. Сломалось или потерялось — восстанавливаете по фразе, и без неё восстанавливать нечем.",
              "en": "The device is not the backup. If it breaks or is lost you restore from the phrase, and without the phrase there is nothing to restore from."
            }
          },
          {
            "title": {
              "ru": "От подписи не глядя",
              "en": "Signing without looking"
            },
            "text": {
              "ru": "Устройство защищает ключ, а не от вашего согласия. Подтвердив вредоносное разрешение, вы отдадите токены добровольно.",
              "en": "The device protects the key, not you from your own consent. Approve a malicious permission and you hand over the tokens willingly."
            }
          },
          {
            "title": {
              "ru": "От покупки с рук",
              "en": "Buying used"
            },
            "text": {
              "ru": "Устройство с уже готовой сид-фразой в коробке — это подстава. Фразу генерирует только сам владелец при первой настройке.",
              "en": "A device that arrives with a seed phrase already in the box is a trap. The phrase is generated by the owner at first setup, by nobody else."
            }
          }
        ]
      }
    ],
  },
  {
    slug: 'hot-wallet',
    category: 'wallets',
    term: { ru: 'Горячий кошелёк', en: 'Hot wallet' },
    definition: {
      "ru": "Горячий кошелёк — приложение на телефоне, компьютере или в браузере, где ключи хранятся на устройстве с интернетом. Удобно для повседневных сумм и подключения к сервисам, но именно поэтому уязвимее холодного.",
      "en": "A hot wallet is an app on a phone, computer or browser where the keys live on a device that is online. Convenient for everyday amounts and for connecting to services, and less safe than cold storage for exactly that reason."
    },
    updated: '2026-08-11',
    related: [
      "cold-wallet",
      "wallet",
      "private-key",
      "seed-phrase",
      "dex",
      "defi"
    ],
    sections: [
      {
        "heading": {
          "ru": "Как это работает",
          "en": "How it works"
        },
        "paragraphs": [
          {
            "ru": "Ключ хранится в зашифрованном виде в памяти устройства, а пароль или биометрия открывают к нему доступ. Подпись происходит там же, где вы работаете, — поэтому всё занимает секунды.",
            "en": "The key sits encrypted in the device's storage, and a password or biometrics unlocks it. Signing happens on the same machine you are working on, which is why everything takes seconds."
          },
          {
            "ru": "Это же и вектор атаки. Вредоносное расширение, заражённый компьютер или фишинговый сайт работают с тем же устройством и тем же ключом. Ничего физически не отделяет ваше подтверждение от чужого кода.",
            "en": "That is also the attack surface. A malicious extension, an infected computer or a phishing site all touch the same device and the same key. Nothing physical separates your confirmation from someone else's code."
          },
          {
            "ru": "Для DeFi горячий кошелёк по сути обязателен: подключаться к сервисам, подписывать разрешения и торговать с холодного устройства каждый раз неудобно. Практика сводится к разделению сумм, а не к отказу от горячего.",
            "en": "For DeFi a hot wallet is effectively required: connecting to services, approving permissions and trading from a cold device every time is impractical. The answer is splitting the money, not avoiding hot wallets."
          }
        ]
      },
      {
        "heading": {
          "ru": "Как пользоваться безопасно",
          "en": "How to use one safely"
        },
        "bullets": [
          {
            "title": {
              "ru": "Держите там столько, сколько не жалко",
              "en": "Keep only what you can lose"
            },
            "text": {
              "ru": "Горячий кошелёк — это карманные деньги. Основной запас живёт в другом месте.",
              "en": "A hot wallet is pocket money. The main holdings live somewhere else."
            }
          },
          {
            "title": {
              "ru": "Отдельный кошелёк для незнакомых сайтов",
              "en": "A separate wallet for unfamiliar sites"
            },
            "text": {
              "ru": "Подключения, эйрдропы, тестовые сети — всё через кошелёк, где нет ничего ценного.",
              "en": "Connections, airdrops and testnets all go through a wallet holding nothing of value."
            }
          },
          {
            "title": {
              "ru": "Регулярно отзывайте разрешения",
              "en": "Revoke approvals regularly"
            },
            "text": {
              "ru": "Каждое подключение к DeFi оставляет действующее право тратить ваши токены. Список стоит просматривать раз в пару месяцев.",
              "en": "Every DeFi connection leaves a live right to spend your tokens. The list is worth reviewing every couple of months."
            }
          },
          {
            "title": {
              "ru": "Ставьте расширения только из официальных магазинов",
              "en": "Install extensions only from official stores"
            },
            "text": {
              "ru": "Поддельные кошельки-расширения — распространённая схема. Проверяйте издателя и число установок.",
              "en": "Fake wallet extensions are a standard scheme. Check the publisher and the install count."
            }
          },
          {
            "title": {
              "ru": "Фраза не хранится в телефоне",
              "en": "The phrase does not live on the phone"
            },
            "text": {
              "ru": "Скриншот сид-фразы в галерее попадает в облако автоматически. Это самый частый способ потерять всё сразу.",
              "en": "A screenshot of a seed phrase syncs to the cloud automatically. It is the most common way to lose everything at once."
            }
          }
        ]
      }
    ],
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
      "ru": "KYC — обязательная проверка личности клиента: паспорт, селфи, иногда подтверждение адреса и источника средств. Без неё регулируемая площадка не имеет права открыть вам счёт и провести операцию с фиатом.",
      "en": "KYC is the mandatory identity check a service runs on a customer: passport, selfie, sometimes proof of address and source of funds. Without it a regulated venue is not allowed to open your account or move fiat for you."
    },
    updated: '2026-08-11',
    related: [
      "aml",
      "cex",
      "exchange",
      "p2p",
      "fiat",
      "custodial-wallet"
    ],
    sections: [
      {
        "heading": {
          "ru": "Как это работает",
          "en": "How it works"
        },
        "paragraphs": [
          {
            "ru": "Площадка обязана знать, кто её клиент, по закону о противодействии отмыванию. Базовый уровень — документ и селфи, дальше по мере роста оборота запрашивают адрес проживания и происхождение денег.",
            "en": "A venue is legally required to know who its customer is under anti-money-laundering rules. The base level is a document and a selfie; as turnover grows they ask for a residential address and the origin of the money."
          },
          {
            "ru": "Лимиты обычно привязаны к уровню проверки: без неё доступен только просмотр или очень небольшие суммы, с полной — вывод фиата и высокие лимиты. Поэтому проходить её лучше заранее, а не в момент, когда деньги нужно вывести.",
            "en": "Limits are usually tied to the level of verification: without it you get read-only access or very small amounts; with it, fiat withdrawals and high limits. Which is why it is better done in advance than at the moment you need the money out."
          },
          {
            "ru": "В ЕС требования единые для всех лицензированных площадок по MiCA и связанным нормам. Отсутствие KYC у сервиса, работающего с евро, — это не преимущество, а признак того, что он вне регулирования.",
            "en": "In the EU the requirements are uniform across licensed venues under MiCA and related rules. A euro-handling service with no KYC is not offering you an advantage; it is telling you it operates outside regulation."
          }
        ]
      },
      {
        "heading": {
          "ru": "Что стоит понимать",
          "en": "What to keep in mind"
        },
        "bullets": [
          {
            "title": {
              "ru": "Проверка занимает время",
              "en": "It takes time"
            },
            "text": {
              "ru": "Обычно от минут до пары дней, а при загрузке площадки дольше. Начинать вывод средств с прохождения KYC — плохая идея.",
              "en": "Usually minutes to a couple of days, longer when a venue is busy. Starting a withdrawal by beginning KYC is a poor plan."
            }
          },
          {
            "title": {
              "ru": "Данные остаются у компании",
              "en": "The data stays with the company"
            },
            "text": {
              "ru": "Копии документов хранятся годами по требованию регулятора. Утечки таких баз случались, и это реальный риск, а не гипотетический.",
              "en": "Copies of documents are retained for years by regulation. Databases like these have leaked before; the risk is real, not hypothetical."
            }
          },
          {
            "title": {
              "ru": "Имя плательщика должно совпадать",
              "en": "The payer's name must match"
            },
            "text": {
              "ru": "Перевод с чужой карты или счёта — типичная причина блокировки: для комплаенса это признак дробления и подставных лиц.",
              "en": "Paying from someone else's card or account is a standard cause of a freeze: to compliance it reads as layering through third parties."
            }
          },
          {
            "title": {
              "ru": "Источник средств спрашивают всерьёз",
              "en": "Source of funds is asked in earnest"
            },
            "text": {
              "ru": "На крупных суммах попросят подтвердить происхождение денег. Заранее сохранённые выписки и договоры экономят недели.",
              "en": "On larger amounts you will be asked to evidence where the money came from. Statements and contracts kept in advance save weeks."
            }
          }
        ]
      }
    ],
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
      "ru": "Эйрдроп — бесплатная раздача токенов пользователям, обычно за прошлую активность в проекте или для привлечения внимания к запуску. Часть раздач приносит реальные деньги, но именно под них маскируется большинство схем с кражей кошельков.",
      "en": "An airdrop is a free distribution of tokens to users, usually for past activity in a project or to draw attention to a launch. Some are genuinely valuable, and they are also the disguise most wallet-draining scams choose."
    },
    updated: '2026-08-11',
    related: [
      "tokenomics",
      "wallet",
      "rug-pull",
      "smart-contract",
      "nft",
      "ico"
    ],
    sections: [
      {
        "heading": {
          "ru": "Как это работает",
          "en": "How it works"
        },
        "paragraphs": [
          {
            "ru": "Проект фиксирует состояние сети на определённом блоке и определяет, какие адреса подходят под условия: пользовались продуктом, держали токен, предоставляли ликвидность. Дальше токены либо приходят сами, либо их нужно забрать вручную на сайте проекта.",
            "en": "A project takes a snapshot of the network at a chosen block and decides which addresses qualify: used the product, held a token, provided liquidity. The tokens then either arrive on their own or must be claimed by hand on the project's site."
          },
          {
            "ru": "Смысл для проекта прост: раздать долю в управлении тем, кто уже пользовался, и получить сразу много держателей к моменту листинга. Смысл для пользователя — компенсация за ранний риск и потраченные на комиссии деньги.",
            "en": "The logic for the project is straightforward: hand a share of governance to people who already use it, and arrive at listing with many holders at once. For the user it is compensation for early risk and the fees already spent."
          },
          {
            "ru": "Ровно эта механика делает эйрдропы идеальной приманкой. Человек и так ждёт неожиданных токенов и подписи на сайте — поэтому фальшивая страница получения выглядит для него совершенно естественно.",
            "en": "That same mechanic makes airdrops ideal bait. The user is already expecting unexpected tokens and a signature on a website, so a fake claim page looks entirely natural to them."
          }
        ]
      },
      {
        "heading": {
          "ru": "Как выглядит кража",
          "en": "What the theft looks like"
        },
        "bullets": [
          {
            "title": {
              "ru": "Токен, пришедший сам",
              "en": "A token that arrived by itself"
            },
            "text": {
              "ru": "В кошельке появляется незнакомый токен с крупной «стоимостью». Попытка продать его ведёт на сайт, где просят подпись, — и подпись отдаёт доступ к настоящим активам.",
              "en": "An unknown token with an impressive \"value\" shows up in the wallet. Trying to sell it leads to a site asking for a signature, and that signature hands over access to the real assets."
            }
          },
          {
            "title": {
              "ru": "Страница получения по ссылке из личных сообщений",
              "en": "A claim page from a direct message"
            },
            "text": {
              "ru": "Настоящие проекты объявляют раздачу в своих официальных каналах. Ссылка, пришедшая лично и срочно, — почти всегда подделка.",
              "en": "Real projects announce distributions in their own official channels. A link that arrives privately and urgently is nearly always fake."
            }
          },
          {
            "title": {
              "ru": "Просьба «разблокировать» или заплатить",
              "en": "A request to \"unlock\" or pay"
            },
            "text": {
              "ru": "За получение бесплатных токенов не платят. Любая комиссия «за разблокировку» — это конец истории.",
              "en": "Nobody pays to receive free tokens. Any \"unlock fee\" is where the story ends."
            }
          },
          {
            "title": {
              "ru": "Подпись, которую не читают",
              "en": "A signature nobody reads"
            },
            "text": {
              "ru": "Опасна не сама раздача, а разрешение, которое вы подписываете. Смотрите, что именно запрашивает сайт, до подтверждения.",
              "en": "The danger is not the distribution but the approval you sign. Read what the site is actually requesting before confirming."
            }
          }
        ]
      },
      {
        "heading": {
          "ru": "Как участвовать разумно",
          "en": "How to take part sensibly"
        },
        "bullets": [
          {
            "title": {
              "ru": "Отдельный кошелёк",
              "en": "A separate wallet"
            },
            "text": {
              "ru": "Для всех раздач и подключений к незнакомым сайтам держите кошелёк, на котором нет ничего ценного.",
              "en": "Keep a wallet with nothing valuable in it for every airdrop and every connection to an unfamiliar site."
            }
          },
          {
            "title": {
              "ru": "Только официальные источники",
              "en": "Official sources only"
            },
            "text": {
              "ru": "Адрес страницы получения берите с сайта проекта или из его закреплённого поста, а не из поиска и не из чата.",
              "en": "Take the claim URL from the project's own site or pinned post, not from search results and not from a chat."
            }
          },
          {
            "title": {
              "ru": "Считайте затраты",
              "en": "Count what it costs"
            },
            "text": {
              "ru": "Активность ради будущей раздачи стоит комиссий. Нередко потраченный газ превышает всё, что раздадут.",
              "en": "Farming activity for a future drop costs gas fees. Often the gas spent exceeds anything the drop pays out."
            }
          },
          {
            "title": {
              "ru": "Раздачи не гарантированы",
              "en": "Nothing is promised"
            },
            "text": {
              "ru": "Проект ничего не обещает и вправе изменить условия или не раздавать вовсе. Это лотерея, а не заработок.",
              "en": "A project promises nothing and may change the terms or skip the drop entirely. It is a lottery, not an income."
            }
          }
        ]
      }
    ],
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
      "ru": "Токеномика — правила выпуска и распределения токена: сколько их всего, кому они достались, когда разблокируются и за что сжигаются. Эти цифры определяют будущее давление на цену задолго до любых новостей о проекте.",
      "en": "Tokenomics is a token's issuance and distribution rules: how many exist, who received them, when they unlock and what burns them. These numbers set the future pressure on the price long before any news about the project."
    },
    updated: '2026-08-11',
    related: [
      "market-cap",
      "altcoin",
      "ico",
      "airdrop",
      "rug-pull",
      "whitepaper"
    ],
    sections: [
      {
        "heading": {
          "ru": "Из чего она состоит",
          "en": "What it consists of"
        },
        "paragraphs": [
          {
            "ru": "Первое — общий выпуск и сколько из него уже в обращении. Разрыв между этими числами показывает, сколько токенов ещё выйдет на рынок. Если в обращении треть, две трети когда-нибудь появятся у продавцов.",
            "en": "First, total supply and how much of it already circulates. The gap between the two shows how many tokens are still to arrive. If a third circulates, two thirds will eventually appear in sellers' hands."
          },
          {
            "ru": "Второе — распределение. Доли команды, ранних инвесторов, фонда развития и публичной продажи. Если больше половины у нескольких кошельков, цена зависит от их решений, а не от спроса.",
            "en": "Second, distribution. The shares held by the team, early investors, the treasury and the public sale. If more than half sits in a few wallets, the price depends on their decisions rather than on demand."
          },
          {
            "ru": "Третье — график разблокировок. Даты, когда заблокированные доли станут доступны. Они известны заранее и опубликованы, поэтому крупные разблокировки не должны быть для вас новостью.",
            "en": "Third, the unlock schedule. The dates on which locked allocations become available. They are known and published in advance, so a large unlock should never surprise you."
          }
        ]
      },
      {
        "heading": {
          "ru": "Как читать разблокировки",
          "en": "How to read an unlock"
        },
        "example": {
          "setup": {
            "ru": "Токен торгуется по $2. В обращении 100 млн, всего выпущено 500 млн. Через месяц разблокируются 50 млн.",
            "en": "A token trades at $2. 100m circulate out of 500m total. In a month, 50m unlock."
          },
          "rows": [
            {
              "label": {
                "ru": "Капитализация сейчас",
                "en": "Market cap now"
              },
              "value": {
                "ru": "$200 000 000",
                "en": "$200,000,000"
              }
            },
            {
              "label": {
                "ru": "Полностью разводнённая оценка",
                "en": "Fully diluted valuation"
              },
              "value": {
                "ru": "$1 000 000 000",
                "en": "$1,000,000,000"
              }
            },
            {
              "label": {
                "ru": "Прирост обращения через месяц",
                "en": "Circulating increase in a month"
              },
              "value": {
                "ru": "+50%",
                "en": "+50%"
              }
            }
          ],
          "outcome": {
            "ru": "Чтобы цена устояла, спрос должен вырасти в полтора раза за месяц просто для сохранения статус-кво. Полностью разводнённая оценка в пять раз выше текущей означает, что рынок платит за пятую часть будущего предложения.",
            "en": "For the price to hold, demand has to grow by half in a month just to stand still. A fully diluted valuation five times the current cap means the market is paying for a fifth of the eventual supply."
          }
        }
      },
      {
        "heading": {
          "ru": "Красные флаги",
          "en": "Red flags"
        },
        "bullets": [
          {
            "title": {
              "ru": "Больше половины у команды и инвесторов",
              "en": "Over half to team and investors"
            },
            "text": {
              "ru": "Проект тогда принадлежит им, а не рынку. Публичная доля меньше 20% — повод отнестись серьёзно.",
              "en": "The project then belongs to them, not to the market. A public share below 20% deserves serious pause."
            }
          },
          {
            "title": {
              "ru": "Разблокировки без периода ожидания",
              "en": "Unlocks with no cliff"
            },
            "text": {
              "ru": "Здоровый график растягивает выход инвесторов на годы. Всё сразу через полгода — это план выхода, а не развития.",
              "en": "A healthy schedule spreads investor exits over years. Everything at once after six months is an exit plan, not a growth plan."
            }
          },
          {
            "title": {
              "ru": "Бесконечная эмиссия",
              "en": "Uncapped issuance"
            },
            "text": {
              "ru": "Если новые токены печатаются для выплат доходности, эта доходность и есть источник падения цены.",
              "en": "If new tokens are printed to pay yield, that yield is itself the source of the price decline."
            }
          },
          {
            "title": {
              "ru": "Сжигание вместо полезности",
              "en": "Burning instead of utility"
            },
            "text": {
              "ru": "Сжигание сокращает предложение, но не создаёт спрос. Вопрос всегда один: зачем этот токен нужен, кроме роста цены.",
              "en": "Burning cuts supply without creating demand. The question is always the same: what is the token for, besides going up."
            }
          }
        ]
      }
    ],
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
      "ru": "Стакан заявок — список всех текущих предложений купить и продать актив, отсортированных по цене. Он показывает не только курс, но и глубину рынка: сколько можно купить или продать, прежде чем цена сдвинется.",
      "en": "An order book is the list of all live offers to buy and sell an asset, sorted by price. It shows more than the rate: it shows depth, meaning how much can be bought or sold before the price moves."
    },
    updated: '2026-08-11',
    related: [
      "limit-order",
      "market-order",
      "slippage",
      "cex",
      "exchange",
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
            "ru": "С одной стороны стоят заявки на покупку, с другой — на продажу. Разница между лучшей ценой покупки и лучшей ценой продажи называется спредом: это и есть скрытая стоимость входа и выхода.",
            "en": "Buy orders stand on one side, sell orders on the other. The gap between the best buy price and the best sell price is the spread, and it is the hidden cost of getting in and out."
          },
          {
            "ru": "Сделка происходит, когда чья-то заявка совпадает по цене со встречной. Рыночный ордер берёт лучшие доступные предложения подряд, пока не наберёт нужный объём, поэтому крупная заявка исполняется по нескольким ценам сразу.",
            "en": "A trade happens when one order meets another at a price. A market order takes the best available offers in turn until the size is filled, which is why a large order executes at several prices at once."
          },
          {
            "ru": "Глубина стакана важнее курса на экране. Цена $100 при заявках на $2 000 рядом означает, что продать на $50 000 по этой цене не получится ни при каких обстоятельствах.",
            "en": "Depth matters more than the price on screen. A $100 quote with $2,000 of orders around it means selling $50,000 at that price is not going to happen under any circumstances."
          }
        ]
      },
      {
        "heading": {
          "ru": "Как читать глубину",
          "en": "How to read depth"
        },
        "example": {
          "setup": {
            "ru": "Вы хотите продать 5 BTC. В стакане заявки на покупку выстроены так.",
            "en": "You want to sell 5 BTC. The bids in the book line up like this."
          },
          "rows": [
            {
              "label": {
                "ru": "2 BTC по",
                "en": "2 BTC at"
              },
              "value": {
                "ru": "$64 000",
                "en": "$64,000"
              }
            },
            {
              "label": {
                "ru": "1,5 BTC по",
                "en": "1.5 BTC at"
              },
              "value": {
                "ru": "$63 850",
                "en": "$63,850"
              }
            },
            {
              "label": {
                "ru": "1,5 BTC по",
                "en": "1.5 BTC at"
              },
              "value": {
                "ru": "$63 600",
                "en": "$63,600"
              }
            }
          ],
          "total": {
            "label": {
              "ru": "Средняя цена продажи",
              "en": "Average sale price"
            },
            "value": {
              "ru": "≈ $63 835",
              "en": "≈ $63,835"
            }
          },
          "outcome": {
            "ru": "На экране была цена $64 000, а получили вы на $825 меньше на всей сделке. Это и есть проскальзывание, и предсказать его можно было по стакану до отправки ордера.",
            "en": "The screen said $64,000 and you received $825 less across the trade. That is slippage, and the book let you predict it before sending the order."
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
              "ru": "Стакан меняется каждую секунду",
              "en": "The book changes every second"
            },
            "text": {
              "ru": "Заявки ставят и снимают постоянно. Увиденная глубина не гарантирована к моменту исполнения.",
              "en": "Orders are placed and pulled constantly. The depth you saw is not guaranteed by the time you execute."
            }
          },
          {
            "title": {
              "ru": "Крупные заявки бывают показными",
              "en": "Large orders can be theatre"
            },
            "text": {
              "ru": "Стену из заявок ставят, чтобы повлиять на решения других, и снимают при приближении цены.",
              "en": "A wall of orders can be placed to influence other people's decisions and pulled as the price approaches."
            }
          },
          {
            "title": {
              "ru": "Спред — это тоже комиссия",
              "en": "The spread is a fee too"
            },
            "text": {
              "ru": "На тонкой паре он легко превышает торговую комиссию в несколько раз, просто не называется комиссией.",
              "en": "On a thin pair it easily exceeds the trading fee several times over; it just is not called a fee."
            }
          },
          {
            "title": {
              "ru": "У DEX стакана нет",
              "en": "A DEX has no book"
            },
            "text": {
              "ru": "Там цену задаёт формула пула ликвидности, и глубину надо смотреть по размеру пула, а не по заявкам.",
              "en": "There the price comes from a liquidity pool formula, and depth is read from pool size rather than from orders."
            }
          }
        ]
      }
    ],
  },
  {
    slug: 'limit-order',
    category: 'trading',
    term: { ru: 'Лимитный ордер', en: 'Limit order' },
    definition: {
      "ru": "Лимитный ордер — заявка купить или продать по названной вами цене, не хуже. Она ждёт в стакане и может не исполниться вовсе, зато исполнится строго по вашим условиям, без проскальзывания.",
      "en": "A limit order is an instruction to buy or sell at a price you name, or better. It waits in the book and may never fill, but if it fills it does so on your terms, with no slippage."
    },
    updated: '2026-08-11',
    related: [
      "market-order",
      "order-book",
      "slippage",
      "cex",
      "leverage",
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
            "ru": "Вы указываете цену и объём. Заявка встаёт в стакан и ждёт, пока рынок до неё дойдёт. Пока встречной заявки нет, ничего не происходит: деньги зарезервированы, но сделки нет.",
            "en": "You name a price and a size. The order joins the book and waits for the market to reach it. Until a counterparty appears nothing happens: the funds are reserved but no trade exists."
          },
          {
            "ru": "Исполниться заявка может частями, если встречного объёма не хватает. Тогда часть ордера торгуется, а остаток продолжает стоять по той же цене.",
            "en": "It can fill in parts when there is not enough on the other side. Part of the order trades and the remainder keeps standing at the same price."
          },
          {
            "ru": "Лимитные заявки добавляют ликвидность в стакан, поэтому биржи обычно берут за них меньшую комиссию, чем за рыночные, которые ликвидность забирают.",
            "en": "Limit orders add liquidity to the book, so exchanges usually charge less for them than for market orders, which take liquidity away."
          }
        ]
      },
      {
        "heading": {
          "ru": "Лимитный или рыночный",
          "en": "Limit or market"
        },
        "example": {
          "setup": {
            "ru": "Один и тот же объём на тонкой паре двумя способами.",
            "en": "The same size on a thin pair, executed two ways."
          },
          "rows": [
            {
              "label": {
                "ru": "Рыночный: исполнение",
                "en": "Market: fill"
              },
              "value": {
                "ru": "мгновенно",
                "en": "immediate"
              }
            },
            {
              "label": {
                "ru": "Рыночный: цена",
                "en": "Market: price"
              },
              "value": {
                "ru": "хуже экрана",
                "en": "worse than screen"
              }
            },
            {
              "label": {
                "ru": "Лимитный: исполнение",
                "en": "Limit: fill"
              },
              "value": {
                "ru": "может не быть",
                "en": "may not happen"
              }
            },
            {
              "label": {
                "ru": "Лимитный: цена",
                "en": "Limit: price"
              },
              "value": {
                "ru": "ровно ваша",
                "en": "exactly yours"
              }
            }
          ],
          "outcome": {
            "ru": "Рыночный ордер платит за скорость проскальзыванием, лимитный платит за цену риском не исполниться. На ликвидной паре разница копеечная, на тонкой — принципиальная.",
            "en": "A market order pays for speed in slippage; a limit order pays for price with the risk of no fill. On a liquid pair the difference is pennies; on a thin one it is the whole trade."
          }
        }
      },
      {
        "heading": {
          "ru": "Как пользоваться",
          "en": "How to use it"
        },
        "bullets": [
          {
            "title": {
              "ru": "По умолчанию — лимитный",
              "en": "Default to limit"
            },
            "text": {
              "ru": "Если сделка не срочная, лимитный ордер почти всегда выгоднее: вы не платите ни спред, ни проскальзывание.",
              "en": "When a trade is not urgent, a limit order is almost always cheaper: you pay neither the spread nor slippage."
            }
          },
          {
            "title": {
              "ru": "Проверяйте срок действия",
              "en": "Check the expiry"
            },
            "text": {
              "ru": "У заявок бывают режимы «до отмены» и «на день». Забытый ордер может исполниться в совсем другой рыночной обстановке.",
              "en": "Orders come as good-till-cancelled or day orders. A forgotten one can fill in an entirely different market."
            }
          },
          {
            "title": {
              "ru": "Стоп-лосс — это не лимитный ордер",
              "en": "A stop-loss is not a limit order"
            },
            "text": {
              "ru": "Стоп срабатывает при достижении цены и часто превращается в рыночный, то есть исполняется с проскальзыванием.",
              "en": "A stop triggers at a price and often converts to a market order, meaning it fills with slippage."
            }
          },
          {
            "title": {
              "ru": "Дробите крупный объём",
              "en": "Split large size"
            },
            "text": {
              "ru": "Несколько заявок по разным ценам исполняются чаще, чем одна крупная на одном уровне.",
              "en": "Several orders across price levels fill more often than one large order at a single level."
            }
          }
        ]
      }
    ],
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
      "ru": "Плечо — торговля на сумму больше собственной: биржа добавляет недостающее, а вы вносите маржу как обеспечение. Прибыль и убыток считаются от всей позиции, поэтому небольшое движение цены даёт крупный результат в обе стороны.",
      "en": "Leverage means trading a position larger than your own money: the exchange supplies the rest and you post margin as security. Profit and loss are calculated on the whole position, so a small price move produces a large result in either direction."
    },
    updated: '2026-08-11',
    related: [
      "liquidation",
      "order-book",
      "limit-order",
      "market-order",
      "cex",
      "slippage"
    ],
    sections: [
      {
        "heading": {
          "ru": "Как это работает",
          "en": "How it works"
        },
        "paragraphs": [
          {
            "ru": "При плече 10× вы вносите десятую часть суммы, а торгуете целой. Каждый процент движения цены превращается в десять процентов вашей маржи — и в прибыли, и в убытке.",
            "en": "At 10× you post a tenth of the position and trade the whole of it. Every percent the price moves becomes ten percent of your margin, gains and losses alike."
          },
          {
            "ru": "Убыток списывается только с вашей части, а не с денег биржи. Как только собственных средств остаётся меньше поддерживающего минимума, позицию закрывают принудительно — это ликвидация, и происходит она без вашего участия.",
            "en": "Losses come only out of your share, never the exchange's. The moment your own funds fall below the maintenance minimum the position is force-closed. That is liquidation, and it happens without you."
          },
          {
            "ru": "На бессрочных контрактах добавляется ставка финансирования: каждые несколько часов одна сторона рынка платит другой. Держа позицию долго, вы платите за это отдельно, даже если цена стоит на месте.",
            "en": "Perpetual contracts add a funding rate: every few hours one side of the market pays the other. Holding a position for long means paying that separately, even when the price has not moved."
          }
        ]
      },
      {
        "heading": {
          "ru": "Сколько нужно ошибиться",
          "en": "How wrong you can afford to be"
        },
        "example": {
          "setup": {
            "ru": "Насколько цена должна пойти против вас, чтобы маржа кончилась. Поддерживающая маржа 0,5%.",
            "en": "How far the price must move against you before the margin is gone. Maintenance margin 0.5%."
          },
          "rows": [
            {
              "label": {
                "ru": "Плечо 5×",
                "en": "5× leverage"
              },
              "value": {
                "ru": "≈ 19,5%",
                "en": "≈ 19.5%"
              }
            },
            {
              "label": {
                "ru": "Плечо 10×",
                "en": "10× leverage"
              },
              "value": {
                "ru": "≈ 9,5%",
                "en": "≈ 9.5%"
              }
            },
            {
              "label": {
                "ru": "Плечо 20×",
                "en": "20× leverage"
              },
              "value": {
                "ru": "≈ 4,5%",
                "en": "≈ 4.5%"
              }
            },
            {
              "label": {
                "ru": "Плечо 50×",
                "en": "50× leverage"
              },
              "value": {
                "ru": "≈ 1,5%",
                "en": "≈ 1.5%"
              }
            }
          ],
          "outcome": {
            "ru": "Биткоин проходит 1,5% за минуты, а 9,5% — за часы обычного дня. Поэтому высокое плечо превращает сделку не в инвестицию, а в ставку на короткий отрезок времени.",
            "en": "Bitcoin covers 1.5% in minutes and 9.5% within hours of an ordinary day. High leverage therefore turns a trade into a bet on a short window rather than an investment."
          }
        }
      },
      {
        "heading": {
          "ru": "Как этим пользоваться",
          "en": "How to handle it"
        },
        "bullets": [
          {
            "title": {
              "ru": "Считайте цену ликвидации до входа",
              "en": "Know the liquidation price first"
            },
            "text": {
              "ru": "Биржа показывает её сразу. Если она внутри обычного дневного диапазона, плечо выбрано слишком большое.",
              "en": "The exchange shows it immediately. If it falls inside a normal daily range, the leverage is too high."
            }
          },
          {
            "title": {
              "ru": "Изолированная маржа",
              "en": "Isolated margin"
            },
            "text": {
              "ru": "Ограничивает потерю одной позицией. При кросс-марже под ударом весь баланс счёта.",
              "en": "It caps the loss at one position. Cross margin puts the entire account balance at risk."
            }
          },
          {
            "title": {
              "ru": "Стоп-лосс выше ликвидации",
              "en": "A stop above liquidation"
            },
            "text": {
              "ru": "Стоп закрывает по вашей цене и оставляет часть маржи. Ликвидация не оставляет ничего.",
              "en": "A stop closes at your price and leaves part of the margin. Liquidation leaves nothing."
            }
          },
          {
            "title": {
              "ru": "Плечо не заменяет размер позиции",
              "en": "Leverage is not position sizing"
            },
            "text": {
              "ru": "Взять 10× на десятую часть депозита и 1× на весь депозит — разные вещи по риску, хотя сумма позиции одна.",
              "en": "Taking 10× on a tenth of your capital and 1× on all of it carry different risk, even though the position size matches."
            }
          }
        ]
      }
    ],
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
      "ru": "Layer 2 — надстройка над основным блокчейном, которая обрабатывает транзакции у себя, а в главную сеть отправляет только сжатый итог. Отсюда комиссии в центы вместо долларов при сохранении защиты базового уровня.",
      "en": "A Layer 2 is a network built on top of a base blockchain: it processes transactions itself and posts only a compressed summary back to the main chain. Hence fees in cents rather than dollars, while keeping the base layer's security."
    },
    updated: '2026-08-11',
    related: [
      "gas-fee",
      "blockchain",
      "bridge",
      "smart-contract",
      "transaction",
      "defi"
    ],
    sections: [
      {
        "heading": {
          "ru": "Как это работает",
          "en": "How it works"
        },
        "paragraphs": [
          {
            "ru": "Тысячи операций собираются вне основной сети, сжимаются в один пакет и отправляются в неё одной записью. Стоимость главной транзакции делится на всех участников пакета — поэтому перевод стоит центы.",
            "en": "Thousands of operations are gathered off the main chain, compressed into one batch and posted back as a single entry. The cost of that one transaction is split across everyone in the batch, which is why a transfer costs cents."
          },
          {
            "ru": "Есть два подхода к доказательству честности. Оптимистичные роллапы (Arbitrum, Base, Optimism) считают пакет верным по умолчанию и дают окно, в течение которого его можно оспорить. Zk-роллапы прикладывают криптографическое доказательство сразу, поэтому окна ожидания нет.",
            "en": "There are two approaches to proving honesty. Optimistic rollups (Arbitrum, Base, Optimism) assume a batch is valid and allow a window to challenge it. Zk-rollups attach a cryptographic proof immediately, so no waiting window is needed."
          },
          {
            "ru": "Отсюда практическая разница: вывод обратно в основную сеть у оптимистичных роллапов занимает около недели, если идти штатным путём. Мосты сторонних сервисов делают это за минуты, но за их скорость вы платите доверием к самому мосту.",
            "en": "Which creates a practical difference: withdrawing back to the main chain from an optimistic rollup takes about a week by the official route. Third-party bridges do it in minutes, and that speed is paid for with trust in the bridge."
          }
        ]
      },
      {
        "heading": {
          "ru": "Разница в цене",
          "en": "The difference in cost"
        },
        "example": {
          "setup": {
            "ru": "Одна и та же операция обмена в основной сети Ethereum и на Layer 2.",
            "en": "The same swap on Ethereum mainnet and on a Layer 2."
          },
          "rows": [
            {
              "label": {
                "ru": "Обмен в Ethereum",
                "en": "Swap on Ethereum"
              },
              "value": {
                "ru": "$3–30",
                "en": "$3–30"
              }
            },
            {
              "label": {
                "ru": "Обмен на Layer 2",
                "en": "Swap on a Layer 2"
              },
              "value": {
                "ru": "$0,01–0,20",
                "en": "$0.01–0.20"
              }
            },
            {
              "label": {
                "ru": "Перевод между кошельками",
                "en": "Wallet-to-wallet transfer"
              },
              "value": {
                "ru": "< $0,01",
                "en": "< $0.01"
              }
            }
          ],
          "outcome": {
            "ru": "Разница в десятки и сотни раз. Именно она делает возможными сценарии, бессмысленные в основной сети: микроплатежи, игровые операции, частая перебалансировка позиций.",
            "en": "A gap of tens to hundreds of times. It is what makes viable the things that make no sense on mainnet: micropayments, in-game actions, frequent rebalancing."
          }
        }
      },
      {
        "heading": {
          "ru": "О чём помнить",
          "en": "What to keep in mind"
        },
        "bullets": [
          {
            "title": {
              "ru": "Это отдельная сеть",
              "en": "It is a separate network"
            },
            "text": {
              "ru": "Отправив токены в Arbitrum на адрес, который вы используете в Ethereum, вы попадёте туда же по адресу, но средства окажутся в другой сети. Проверяйте выбранную сеть до отправки.",
              "en": "Sending tokens to an Arbitrum address you also use on Ethereum lands at the same address but in a different network. Check which network is selected before sending."
            }
          },
          {
            "title": {
              "ru": "Вывод бывает долгим",
              "en": "Withdrawals can be slow"
            },
            "text": {
              "ru": "У оптимистичных роллапов штатный вывод занимает около семи дней. Планируйте это заранее, а не в момент, когда деньги нужны.",
              "en": "The official exit from an optimistic rollup takes about seven days. Plan for it in advance rather than when the money is needed."
            }
          },
          {
            "title": {
              "ru": "Централизация секвенсора",
              "en": "Sequencer centralisation"
            },
            "text": {
              "ru": "Порядок транзакций во многих L2 определяет один оператор. Это работает быстро, но это единственная точка отказа.",
              "en": "In many L2s a single operator decides transaction order. It works fast, and it is a single point of failure."
            }
          },
          {
            "title": {
              "ru": "Ликвидность разделена",
              "en": "Liquidity is fragmented"
            },
            "text": {
              "ru": "Одна и та же пара может быть глубокой в одной сети и почти пустой в другой. Смотрите на пул именно там, где торгуете.",
              "en": "The same pair can be deep on one network and nearly empty on another. Check the pool on the network you are actually trading on."
            }
          }
        ]
      }
    ],
  },
  {
    slug: 'bridge',
    category: 'tech',
    term: { ru: 'Блокчейн-мост', en: 'Bridge' },
    definition: {
      "ru": "Мост — сервис, переносящий активы между блокчейнами. Токены не путешествуют: оригинал блокируется в одной сети, а в другой выпускается его обёрнутая копия. Мосты — самая атакуемая часть криптоинфраструктуры.",
      "en": "A bridge moves assets between blockchains. Tokens do not travel: the original is locked on one network while a wrapped copy is issued on the other. Bridges are the most attacked part of crypto infrastructure."
    },
    updated: '2026-08-11',
    related: [
      "layer-2",
      "blockchain",
      "smart-contract",
      "erc-20",
      "defi",
      "wallet"
    ],
    sections: [
      {
        "heading": {
          "ru": "Как это работает",
          "en": "How it works"
        },
        "paragraphs": [
          {
            "ru": "Вы отправляете токен в контракт моста в исходной сети. Он блокируется там, и в целевой сети выпускается эквивалентное количество обёрнутого токена. При обратной операции копия сжигается, а оригинал разблокируется.",
            "en": "You send a token into the bridge's contract on the source network. It is locked there, and an equivalent amount of a wrapped token is minted on the destination. Going back burns the copy and unlocks the original."
          },
          {
            "ru": "Обёрнутый токен стоит ровно столько, сколько стоит обещание моста вернуть оригинал. Если заблокированные средства украдут, копия обесценится, хотя формально останется у вас на балансе.",
            "en": "A wrapped token is worth exactly as much as the bridge's promise to return the original. If the locked funds are stolen, the copy is worthless even though it still sits in your balance."
          },
          {
            "ru": "Поэтому мост — это концентрация средств в одном контракте, охраняемом одним набором ключей или валидаторов. Атакующему не нужно ломать блокчейн, достаточно сломать мост.",
            "en": "So a bridge concentrates funds in one contract, guarded by one set of keys or validators. An attacker need not break a blockchain, only the bridge."
          }
        ]
      },
      {
        "heading": {
          "ru": "Почему это опасно",
          "en": "Why this is dangerous"
        },
        "example": {
          "setup": {
            "ru": "Крупнейшие взломы мостов, все — в течение одного года.",
            "en": "The largest bridge exploits, all within a single year."
          },
          "rows": [
            {
              "label": {
                "ru": "Ronin, март 2022",
                "en": "Ronin, March 2022"
              },
              "value": {
                "ru": "≈ $625 млн",
                "en": "≈ $625m"
              }
            },
            {
              "label": {
                "ru": "Wormhole, февраль 2022",
                "en": "Wormhole, February 2022"
              },
              "value": {
                "ru": "≈ $325 млн",
                "en": "≈ $325m"
              }
            },
            {
              "label": {
                "ru": "Nomad, август 2022",
                "en": "Nomad, August 2022"
              },
              "value": {
                "ru": "≈ $190 млн",
                "en": "≈ $190m"
              }
            }
          ],
          "outcome": {
            "ru": "В случае Ronin атакующий получил контроль над пятью из девяти ключей валидаторов — этого хватило, чтобы подписать вывод. Уязвимость была не в криптографии, а в том, сколько подписей требовалось и кто их держал.",
            "en": "In Ronin's case the attacker gained control of five of nine validator keys, which was enough to sign a withdrawal. The weakness was not in the cryptography but in how many signatures were required and who held them."
          }
        }
      },
      {
        "heading": {
          "ru": "Как снизить риск",
          "en": "How to reduce the risk"
        },
        "bullets": [
          {
            "title": {
              "ru": "Не держите средства в мосту",
              "en": "Do not park money in a bridge"
            },
            "text": {
              "ru": "Мост — это транспорт, а не хранилище. Перевели и сразу используйте актив по назначению.",
              "en": "A bridge is transport, not storage. Move the asset and put it to use straight away."
            }
          },
          {
            "title": {
              "ru": "Официальный мост сети",
              "en": "The network's own bridge"
            },
            "text": {
              "ru": "У Layer 2 обычно есть собственный мост — медленнее сторонних, но без дополнительного набора доверенных подписантов.",
              "en": "A Layer 2 usually has its own bridge: slower than third-party ones, but without an extra set of trusted signers."
            }
          },
          {
            "title": {
              "ru": "Смотрите, кто подписывает",
              "en": "Look at who signs"
            },
            "text": {
              "ru": "Сколько ключей нужно для вывода и кому они принадлежат — это и есть модель безопасности моста.",
              "en": "How many keys a withdrawal needs and who holds them is the bridge's security model."
            }
          },
          {
            "title": {
              "ru": "Крупную сумму — частями",
              "en": "Move large sums in parts"
            },
            "text": {
              "ru": "Несколько переводов подряд с проверкой зачисления дешевле одной ошибки на всю сумму.",
              "en": "Several transfers with a check between them cost less than one mistake with everything."
            }
          }
        ]
      }
    ],
  },
  {
    slug: 'dao',
    category: 'defi',
    term: { ru: 'DAO', en: 'DAO' },
    definition: {
      "ru": "DAO — организация, решения в которой принимаются голосованием держателей токенов, а исполняются смарт-контрактом. Ни директора, ни совета: если предложение набрало голоса, код исполнит его автоматически.",
      "en": "A DAO is an organisation where holders of a token vote on decisions and a smart contract carries them out. No director, no board: if a proposal passes, code executes it automatically."
    },
    updated: '2026-08-11',
    related: [
      "smart-contract",
      "defi",
      "tokenomics",
      "nft",
      "blockchain",
      "whitepaper"
    ],
    sections: [
      {
        "heading": {
          "ru": "Как это работает",
          "en": "How it works"
        },
        "paragraphs": [
          {
            "ru": "Право голоса даёт токен, и вес голоса обычно равен количеству токенов. Предложение выносится на голосование, набирает или не набирает кворум, и в случае успеха контракт сам выполняет заложенное действие — например, переводит средства из казны.",
            "en": "The token carries the vote, and voting weight usually equals the number of tokens held. A proposal goes up, reaches quorum or does not, and on success the contract performs the action itself, moving money out of the treasury for instance."
          },
          {
            "ru": "Казна DAO — это контракт, к которому ни у кого нет единоличного ключа. Именно поэтому такие организации управляют крупными суммами: распорядиться ими в обход голосования технически невозможно.",
            "en": "A DAO's treasury is a contract nobody holds a personal key to. That is precisely why such organisations manage large sums: spending them around a vote is not technically possible."
          },
          {
            "ru": "На практике голосование почти всегда происходит вне блокчейна, чтобы не платить газ за каждый голос, а в сеть отправляется только итог. Это дешевле и создаёт отдельный вопрос доверия к площадке подсчёта.",
            "en": "In practice voting almost always happens off-chain to avoid paying gas per vote, with only the outcome posted to the network. Cheaper, and it introduces a separate question of trust in the counting platform."
          }
        ]
      },
      {
        "heading": {
          "ru": "Кто на самом деле решает",
          "en": "Who actually decides"
        },
        "example": {
          "setup": {
            "ru": "Типичное распределение голосов в токене управления.",
            "en": "A typical spread of voting power in a governance token."
          },
          "rows": [
            {
              "label": {
                "ru": "Доля голосов у 10 крупнейших адресов",
                "en": "Top 10 addresses hold"
              },
              "value": {
                "ru": "часто > 50%",
                "en": "often > 50%"
              }
            },
            {
              "label": {
                "ru": "Явка на голосованиях",
                "en": "Turnout on votes"
              },
              "value": {
                "ru": "обычно 1–10%",
                "en": "usually 1–10%"
              }
            }
          ],
          "outcome": {
            "ru": "При такой явке несколько крупных держателей проводят любое решение. Формально управление распределено, фактически — сосредоточено, и понять это можно по публичным данным до покупки токена.",
            "en": "At that turnout a handful of large holders passes anything. Governance is distributed on paper and concentrated in fact, and the public data says so before you buy the token."
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
              "ru": "Распределение голосов",
              "en": "Vote distribution"
            },
            "text": {
              "ru": "Смотрите крупнейших держателей и явку. Это говорит о реальном устройстве власти больше, чем описание в документации.",
              "en": "Read the largest holders and the turnout. It says more about how power actually works than the documentation does."
            }
          },
          {
            "title": {
              "ru": "Что именно голосуется",
              "en": "What is actually voted on"
            },
            "text": {
              "ru": "Иногда сообществу оставляют выбор цвета логотипа, а расходы казны решает команда. Проверяйте область полномочий.",
              "en": "Sometimes the community picks a logo colour while the team decides the treasury. Check the scope of authority."
            }
          },
          {
            "title": {
              "ru": "Атаки на управление реальны",
              "en": "Governance attacks are real"
            },
            "text": {
              "ru": "Скупив достаточно токенов, можно провести предложение о выводе казны. Такие случаи уже были.",
              "en": "Buy enough tokens and you can pass a proposal that drains the treasury. It has happened."
            }
          },
          {
            "title": {
              "ru": "Юридический статус неясен",
              "en": "The legal status is unsettled"
            },
            "text": {
              "ru": "В большинстве юрисдикций DAO не является юридическим лицом, и ответственность участников — открытый вопрос.",
              "en": "In most jurisdictions a DAO is not a legal entity, and the liability of its participants is an open question."
            }
          }
        ]
      }
    ],
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
