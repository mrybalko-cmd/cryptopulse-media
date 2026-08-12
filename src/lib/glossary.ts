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
      "ru": "Хеш — строка фиксированной длины, которую математическая функция выдаёт для любых данных. Изменение одного символа во входе полностью меняет результат, а восстановить исходные данные по хешу невозможно.",
      "en": "A hash is a fixed-length string a mathematical function produces from any input. Changing one character of the input changes the result completely, and the input cannot be recovered from the hash."
    },
    updated: '2026-08-11',
    related: [
      "blockchain",
      "mining",
      "proof-of-work",
      "transaction",
      "nonce",
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
            "ru": "Функция принимает вход любого размера — слово, файл, целый блок транзакций — и всегда выдаёт результат одной длины. В биткоине это SHA-256, дающая 256 бит, то есть 64 символа в шестнадцатеричной записи.",
            "en": "The function takes an input of any size — a word, a file, a whole block of transactions — and always returns a result of the same length. Bitcoin uses SHA-256, producing 256 bits, or 64 characters in hexadecimal."
          },
          {
            "ru": "Ключевое свойство — лавинный эффект: изменение одной буквы даёт совершенно другой хеш, не похожий на прежний ничем. Поэтому по хешу удобно проверять, не менялись ли данные.",
            "en": "The key property is the avalanche effect: changing one letter yields a completely different hash with no resemblance to the previous one. That makes a hash a convenient way to check data has not changed."
          },
          {
            "ru": "Функция односторонняя. Посчитать хеш от данных мгновенно, а подобрать данные под заданный хеш можно только перебором — и именно на этой асимметрии держится майнинг.",
            "en": "The function is one-way. Computing a hash from data is instant; finding data that produces a given hash takes brute force. Mining rests on exactly that asymmetry."
          }
        ]
      },
      {
        "heading": {
          "ru": "Где вы его встречаете",
          "en": "Where you encounter it"
        },
        "bullets": [
          {
            "title": {
              "ru": "Идентификатор транзакции",
              "en": "A transaction ID"
            },
            "text": {
              "ru": "Длинная строка, по которой перевод находится в блокчейн-эксплорере, — это хеш самой транзакции.",
              "en": "The long string you use to find a transfer in a block explorer is the hash of the transaction itself."
            }
          },
          {
            "title": {
              "ru": "Связь блоков в цепочку",
              "en": "The link between blocks"
            },
            "text": {
              "ru": "Каждый блок содержит хеш предыдущего. Изменив старый блок, вы ломаете все ссылки после него.",
              "en": "Each block contains the previous one's hash. Alter an old block and every reference after it breaks."
            }
          },
          {
            "title": {
              "ru": "Задача майнинга",
              "en": "The mining puzzle"
            },
            "text": {
              "ru": "Майнер ищет число, при котором хеш блока окажется меньше порога. Проверить решение — одна операция.",
              "en": "A miner searches for a number that puts the block's hash below a target. Verifying the answer takes one operation."
            }
          },
          {
            "title": {
              "ru": "Проверка файлов и паролей",
              "en": "Checking files and passwords"
            },
            "text": {
              "ru": "Хеширование применяется далеко за пределами крипто — от контрольных сумм дистрибутивов до хранения паролей.",
              "en": "Hashing is used far beyond crypto, from download checksums to how passwords are stored."
            }
          }
        ]
      }
    ],
  },
  {
    slug: 'transaction',
    category: 'basics',
    term: { ru: 'Транзакция', en: 'Transaction' },
    definition: {
      "ru": "Транзакция — запись о переводе монет с одного адреса на другой, подписанная приватным ключом отправителя. Попав в блок и получив подтверждения, она становится частью блокчейна навсегда: отменить её нельзя.",
      "en": "A transaction is a record of coins moving from one address to another, signed with the sender's private key. Once it lands in a block and gathers confirmations it becomes part of the blockchain permanently: it cannot be reversed."
    },
    updated: '2026-08-11',
    related: [
      "block-explorer",
      "gas-fee",
      "hash",
      "node",
      "private-key",
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
            "ru": "Кошелёк собирает транзакцию, подписывает её ключом и рассылает по сети. Она попадает в общую очередь ожидающих — мемпул — и ждёт, пока майнер или валидатор включит её в блок. Чем выше предложенная комиссия, тем раньше это произойдёт.",
            "en": "A wallet assembles the transaction, signs it with the key and broadcasts it. It joins the shared queue of pending transactions, the mempool, and waits for a miner or validator to include it in a block. The higher the offered fee, the sooner that happens."
          },
          {
            "ru": "После включения в блок начинают накапливаться подтверждения: каждый следующий блок поверх делает отмену дороже. Биржи обычно ждут от одного до шести подтверждений в зависимости от суммы и сети.",
            "en": "Once in a block, confirmations start to accumulate: every block added on top makes reversal more expensive. Exchanges typically wait between one and six confirmations depending on the amount and the network."
          },
          {
            "ru": "Пока транзакция висит в мемпуле, её можно заменить — отправив ту же операцию с большей комиссией. После попадания в блок заменить нельзя уже ничего.",
            "en": "While a transaction sits in the mempool it can be replaced by resending the same operation with a higher fee. After it enters a block nothing can be changed."
          }
        ]
      },
      {
        "heading": {
          "ru": "Что делать, если она зависла",
          "en": "If it gets stuck"
        },
        "bullets": [
          {
            "title": {
              "ru": "Проверьте в эксплорере",
              "en": "Check the explorer"
            },
            "text": {
              "ru": "По хешу транзакции видно, в мемпуле она или уже в блоке. Это первое, что стоит сделать, а не писать в поддержку.",
              "en": "The transaction hash shows whether it is still in the mempool or already in a block. Do that before writing to support."
            }
          },
          {
            "title": {
              "ru": "Ускорьте той же комиссией",
              "en": "Speed it up with a fee bump"
            },
            "text": {
              "ru": "Многие кошельки умеют переотправить операцию с большей комиссией. Старая версия при этом отменяется.",
              "en": "Many wallets can resend the operation with a higher fee, which cancels the earlier version."
            }
          },
          {
            "title": {
              "ru": "Низкая комиссия — это надолго",
              "en": "A low fee means a long wait"
            },
            "text": {
              "ru": "В загруженной сети дешёвая транзакция может ждать часами и в итоге выпасть из мемпула.",
              "en": "On a busy network a cheap transaction can wait hours and eventually drop out of the mempool."
            }
          },
          {
            "title": {
              "ru": "Ошибочный адрес не исправить",
              "en": "A wrong address cannot be fixed"
            },
            "text": {
              "ru": "Подтверждённый перевод не отменяется. Единственная защита — пробная отправка небольшой суммы на новый адрес.",
              "en": "A confirmed transfer is final. The only defence is a small test send to any new address."
            }
          }
        ]
      }
    ],
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
      "ru": "Публичный ключ — вторая половина пары ключей, выведенная из приватного. Из него получается адрес для приёма средств, и его можно свободно показывать: обратно вычислить приватный ключ невозможно.",
      "en": "A public key is the other half of a key pair, derived from the private one. An address for receiving funds comes from it, and it can be shared freely: the private key cannot be computed back from it."
    },
    updated: '2026-08-11',
    related: [
      "private-key",
      "wallet",
      "transaction",
      "seed-phrase",
      "hash",
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
            "ru": "Приватный ключ превращается в публичный операцией, которую легко выполнить в одну сторону и невозможно обратить. Дальше публичный ключ хешируется, и получается адрес — та строка, которую вы даёте для перевода.",
            "en": "A private key becomes a public one through an operation that is easy in one direction and infeasible to reverse. The public key is then hashed to produce an address, the string you hand out for a transfer."
          },
          {
            "ru": "Подписывая транзакцию, кошелёк использует приватный ключ, а сеть проверяет подпись публичным. Так она убеждается, что распоряжение исходит от владельца адреса, не зная при этом секрета.",
            "en": "Signing a transaction uses the private key; the network verifies the signature with the public one. That confirms the instruction came from the address owner without the network ever learning the secret."
          },
          {
            "ru": "Поэтому адрес безопасно публиковать где угодно — на сайте, в чате, на визитке. Единственное, что он раскрывает, — историю операций по нему, потому что блокчейн публичен.",
            "en": "So an address is safe to publish anywhere: a website, a chat, a business card. The only thing it exposes is its transaction history, because the blockchain is public."
          }
        ]
      },
      {
        "heading": {
          "ru": "Что стоит знать",
          "en": "What to know"
        },
        "bullets": [
          {
            "title": {
              "ru": "Адрес и публичный ключ — не одно и то же",
              "en": "An address is not the public key"
            },
            "text": {
              "ru": "Адрес получается из публичного ключа хешированием. В большинстве случаев вы работаете именно с адресом.",
              "en": "An address is derived from the public key by hashing. In most situations what you handle is the address."
            }
          },
          {
            "title": {
              "ru": "Новый адрес на каждый приём",
              "en": "A fresh address per payment"
            },
            "text": {
              "ru": "Кошельки генерируют новые адреса из одной сид-фразы. Это не про безопасность, а про приватность: связать платежи становится труднее.",
              "en": "Wallets generate new addresses from a single seed phrase. That is about privacy rather than security: linking payments becomes harder."
            }
          },
          {
            "title": {
              "ru": "История видна всем",
              "en": "The history is public"
            },
            "text": {
              "ru": "Дав адрес один раз, вы открываете собеседнику весь его баланс и все операции по нему.",
              "en": "Give an address once and you show the recipient its entire balance and every transaction on it."
            }
          },
          {
            "title": {
              "ru": "Сеть имеет значение",
              "en": "The network matters"
            },
            "text": {
              "ru": "Адреса Ethereum и BNB Chain выглядят одинаково, но это разные сети. Совпадение формата не значит совместимости.",
              "en": "Ethereum and BNB Chain addresses look identical but the networks differ. A matching format does not mean compatibility."
            }
          }
        ]
      }
    ],
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
      "ru": "Узел — компьютер, который хранит копию блокчейна и проверяет каждую транзакцию и блок по правилам сети. Именно узлы, а не майнеры, решают, какие правила считаются действующими.",
      "en": "A node is a computer that keeps a copy of the blockchain and checks every transaction and block against the network's rules. It is nodes, not miners, that decide which rules count as valid."
    },
    updated: '2026-08-11',
    related: [
      "blockchain",
      "consensus-mechanism",
      "mining",
      "transaction",
      "hard-fork",
      "proof-of-stake"
    ],
    sections: [
      {
        "heading": {
          "ru": "Как это работает",
          "en": "How it works"
        },
        "paragraphs": [
          {
            "ru": "Полный узел скачивает всю историю сети и проверяет её самостоятельно, от первого блока до последнего. Он не доверяет никому: каждая подпись, каждая сумма и каждое правило проверяются его собственным кодом.",
            "en": "A full node downloads the network's entire history and verifies it itself, from the first block to the latest. It trusts nobody: every signature, every amount and every rule is checked by its own code."
          },
          {
            "ru": "Блок, нарушающий правила, узел просто отвергает — даже если его создал крупнейший майнер. Поэтому изменить правила против воли узлов невозможно: сеть примет только то, что они признают верным.",
            "en": "A block that breaks the rules is simply rejected, even if the largest miner produced it. Which is why rules cannot be changed against the nodes' will: the network accepts only what they consider valid."
          },
          {
            "ru": "Есть и лёгкие узлы, которые не хранят всю цепочку и запрашивают данные у полных. Кошелёк на телефоне работает именно так — быстро, но с доверием к тому, кто отвечает.",
            "en": "There are also light nodes that store no full chain and query full ones for data. A phone wallet works that way: fast, at the cost of trusting whoever answers."
          }
        ]
      },
      {
        "heading": {
          "ru": "Зачем держать свой узел",
          "en": "Why run your own"
        },
        "bullets": [
          {
            "title": {
              "ru": "Проверка без посредника",
              "en": "Verification without a middleman"
            },
            "text": {
              "ru": "Свой узел показывает состояние сети по её собственным правилам, а не по словам чужого сервера.",
              "en": "Your own node shows the network's state by its own rules rather than on some other server's word."
            }
          },
          {
            "title": {
              "ru": "Приватность",
              "en": "Privacy"
            },
            "text": {
              "ru": "Кошелёк, работающий через чужой узел, сообщает ему, какие адреса вас интересуют.",
              "en": "A wallet querying someone else's node tells that node which addresses interest you."
            }
          },
          {
            "title": {
              "ru": "Голос в спорах о правилах",
              "en": "A voice in rule disputes"
            },
            "text": {
              "ru": "При форке узлы выбирают, какую версию правил исполнять. Без своего узла вы принимаете чужой выбор.",
              "en": "In a fork, nodes choose which version of the rules to enforce. Without one you accept someone else's choice."
            }
          },
          {
            "title": {
              "ru": "Требования скромнее, чем кажется",
              "en": "Requirements are lower than expected"
            },
            "text": {
              "ru": "Полный узел биткоина работает на обычном мини-компьютере с диском на пару терабайт.",
              "en": "A full bitcoin node runs on an ordinary mini-PC with a couple of terabytes of disk."
            }
          }
        ]
      }
    ],
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
    updated: '2026-08-12',
    related: [
      "gas-fee",
      "transaction",
      "smart-contract",
      "fiat",
      "satoshi",
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
                        "ru": "Гвей — не отдельная монета, а удобная единица для очень маленьких сумм эфира. Один эфир содержит миллиард гвеев, а один гвей — ещё миллиард вей, самой мелкой доли. Так же, как в рубле сто копеек, только шагов больше.",
                        "en": "Gwei is not a separate coin but a convenient unit for very small amounts of ether. One ether holds a billion gwei, and one gwei holds another billion wei, the smallest fraction. The idea is the same as cents in a dollar, just with more steps."
                  },
                  {
                        "ru": "Единица понадобилась потому, что комиссия за перевод в эфире измеряется тысячными долями монеты. Писать «0,000000021 ETH» неудобно и легко ошибиться в нулях, а «21 гвей» читается сразу.",
                        "en": "The unit exists because an Ethereum transaction fee is measured in thousandths of a coin. Writing “0.000000021 ETH” is awkward and easy to miscount, while “21 gwei” reads at a glance."
                  },
                  {
                        "ru": "В кошельке цена газа почти всегда показана именно в гвеях. Умножив её на объём работы, который займёт ваша операция, вы получите комиссию в эфире.",
                        "en": "Wallets almost always show the gas price in gwei. Multiply it by the amount of work your operation takes and you get the fee in ether."
                  }
            ]
      },
      {
            "heading": {
                  "ru": "Считаем комиссию",
                  "en": "Working out the fee"
            },
            "example": {
                  "setup": {
                        "ru": "Обычный перевод эфира занимает 21 000 единиц газа. Смотрим, во что он обойдётся при разной загрузке сети.",
                        "en": "A plain ether transfer costs 21,000 units of gas. Here is what that comes to at different network loads."
                  },
                  "rows": [
                        {
                              "label": {
                                    "ru": "Спокойная сеть, 8 гвей",
                                    "en": "Quiet network, 8 gwei"
                              },
                              "value": {
                                    "ru": "0,000168 ETH",
                                    "en": "0.000168 ETH"
                              }
                        },
                        {
                              "label": {
                                    "ru": "Обычный день, 21 гвей",
                                    "en": "Ordinary day, 21 gwei"
                              },
                              "value": {
                                    "ru": "0,000441 ETH",
                                    "en": "0.000441 ETH"
                              }
                        },
                        {
                              "label": {
                                    "ru": "Пиковая нагрузка, 120 гвей",
                                    "en": "Peak load, 120 gwei"
                              },
                              "value": {
                                    "ru": "0,00252 ETH",
                                    "en": "0.00252 ETH"
                              }
                        }
                  ],
                  "outcome": {
                        "ru": "Разница между спокойным часом и пиком — пятнадцатикратная. Если операция не срочная, стоит подождать: цена газа меняется в течение суток и обычно ниже ночью и в выходные.",
                        "en": "The gap between a quiet hour and a peak is fifteenfold. If the operation is not urgent it pays to wait: gas prices move through the day and are usually lower at night and on weekends."
                  }
            }
      },
      {
            "heading": {
                  "ru": "На что обратить внимание",
                  "en": "What to watch for"
            },
            "bullets": [
                  {
                        "title": {
                              "ru": "Гвей — это цена, а не сумма",
                              "en": "Gwei is a price, not a total"
                        },
                        "text": {
                              "ru": "Комиссия зависит и от цены газа, и от сложности операции. Обмен на децентрализованной бирже занимает в десять раз больше газа, чем простой перевод, поэтому при той же цене обойдётся в десять раз дороже.",
                              "en": "The fee depends on both the gas price and the complexity of the operation. A swap on a decentralised exchange uses ten times the gas of a plain transfer, so at the same price it costs ten times more."
                        }
                  },
                  {
                        "title": {
                              "ru": "Слишком низкая цена — зависшая транзакция",
                              "en": "Too low a price means a stuck transaction"
                        },
                        "text": {
                              "ru": "Если поставить цену ниже, чем принимает сеть, перевод будет висеть в ожидании часами. Кошелёк обычно предлагает разумное значение сам.",
                              "en": "Set the price below what the network is accepting and the transfer will sit pending for hours. Wallets normally suggest a sensible value themselves."
                        }
                  },
                  {
                        "title": {
                              "ru": "В сетях второго уровня цифры другие",
                              "en": "Layer-two networks show different figures"
                        },
                        "text": {
                              "ru": "В Arbitrum или Base комиссии измеряются долями гвея. Привычка к значениям основной сети там сбивает с толку.",
                              "en": "On Arbitrum or Base fees are measured in fractions of a gwei. Numbers from the main network are misleading there."
                        }
                  }
            ]
      }
    ],
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
    updated: '2026-08-12',
    related: [
      "defi",
      "staking",
      "liquidity-pool",
      "dex",
      "smart-contract",
      "tokenomics"
    ],
    sections: [
      {
            "heading": {
                  "ru": "Как это работает",
                  "en": "How it works"
            },
            "paragraphs": [
                  {
                        "ru": "Доходное фермерство — размещение криптовалюты в протоколах DeFi ради дохода. Вы отдаёте монеты в пул ликвидности или в кредитный протокол, а взамен получаете часть комиссий, проценты по займам и часто дополнительные токены самого протокола.",
                        "en": "Yield farming means placing crypto into DeFi protocols to earn a return. You supply coins to a liquidity pool or a lending protocol and receive a share of fees, interest from borrowers, and often extra tokens issued by the protocol itself."
                  },
                  {
                        "ru": "Практика возникла летом 2020 года, когда протокол Compound начал раздавать собственный токен тем, кто пользуется платформой. Доходность мгновенно взлетела до трёхзначных величин, и за несколько месяцев в DeFi пришли миллиарды долларов.",
                        "en": "The practice emerged in the summer of 2020, when the Compound protocol began distributing its own token to platform users. Yields instantly jumped into triple digits and billions of dollars flowed into DeFi within months."
                  },
                  {
                        "ru": "Ключевой момент, который часто теряется: обещанная доходность складывается из двух очень разных частей. Комиссии реальны и приходят от торговой активности, а раздаваемые токены — это эмиссия, и её ценность зависит от того, будет ли на них спрос.",
                        "en": "The point most often lost: an advertised yield combines two very different parts. Fees are real and come from trading activity, while distributed tokens are issuance whose value depends on whether demand for them exists."
                  }
            ]
      },
      {
            "heading": {
                  "ru": "Разбираем обещанные проценты",
                  "en": "Breaking down an advertised yield"
            },
            "example": {
                  "setup": {
                        "ru": "Пул обещает 120% годовых. Смотрим, из чего эта цифра состоит.",
                        "en": "A pool advertises 120% a year. Here is what that figure consists of."
                  },
                  "rows": [
                        {
                              "label": {
                                    "ru": "Комиссии с торгового оборота",
                                    "en": "Fees from trading volume"
                              },
                              "value": {
                                    "ru": "12% годовых",
                                    "en": "12% a year"
                              }
                        },
                        {
                              "label": {
                                    "ru": "Раздача токенов протокола",
                                    "en": "Protocol token rewards"
                              },
                              "value": {
                                    "ru": "108% годовых",
                                    "en": "108% a year"
                              }
                        },
                        {
                              "label": {
                                    "ru": "Падение цены токена за квартал",
                                    "en": "Token price fall over the quarter"
                              },
                              "value": {
                                    "ru": "−70%",
                                    "en": "−70%"
                              }
                        },
                        {
                              "label": {
                                    "ru": "Непостоянные потери при расхождении цен",
                                    "en": "Impermanent loss as prices diverge"
                              },
                              "value": {
                                    "ru": "−5%",
                                    "en": "−5%"
                              }
                        }
                  ],
                  "outcome": {
                        "ru": "Устойчивая часть здесь — только 12%. Остальное держится на цене раздаваемого токена, а она обычно падает по мере того, как фермеры продают награду. С учётом падения токена и непостоянных потерь реальный результат оказывается отрицательным, хотя баннер обещал 120%.",
                        "en": "Only the 12% is durable. The rest rests on the price of the distributed token, which usually falls as farmers sell their rewards. Once the token's decline and impermanent loss are counted the real outcome is negative, though the banner promised 120%."
                  }
            }
      },
      {
            "heading": {
                  "ru": "На что обратить внимание",
                  "en": "What to watch for"
            },
            "bullets": [
                  {
                        "title": {
                              "ru": "Разделяйте комиссии и эмиссию",
                              "en": "Separate fees from issuance"
                        },
                        "text": {
                              "ru": "Хороший протокол показывает обе части отдельно. Если в интерфейсе одна общая цифра, это уже повод разбираться самому.",
                              "en": "A good protocol shows both parts separately. A single combined figure in the interface is itself a reason to dig deeper."
                        }
                  },
                  {
                        "title": {
                              "ru": "Риск смарт-контракта не исчезает",
                              "en": "Smart-contract risk does not go away"
                        },
                        "text": {
                              "ru": "Средства лежат в коде, который может содержать ошибку. Аудит снижает риск, но не убирает его: взломы случались и у проверенных протоколов.",
                              "en": "Funds sit in code that may contain a flaw. An audit lowers the risk without removing it: audited protocols have been exploited too."
                        }
                  },
                  {
                        "title": {
                              "ru": "Комиссии сети съедают маленькие суммы",
                              "en": "Network fees eat small amounts"
                        },
                        "text": {
                              "ru": "Вход, выход и сбор награды — отдельные операции. При сумме в несколько сотен долларов в основной сети Ethereum комиссии могут превысить доход.",
                              "en": "Entering, exiting and claiming rewards are separate operations. On a few hundred dollars in Ethereum's main network the fees can exceed the return."
                        }
                  },
                  {
                        "title": {
                              "ru": "Высокая доходность — это цена риска",
                              "en": "A high yield is the price of risk"
                        },
                        "text": {
                              "ru": "Ставка в сотни процентов означает, что рынок оценивает вероятность потерь как высокую. Это информация, а не подарок.",
                              "en": "A rate in the hundreds of percent means the market prices the chance of loss as high. That is information, not a gift."
                        }
                  }
            ]
      }
    ],
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
    updated: '2026-08-12',
    related: [
      "bitcoin",
      "market-order",
      "fomo",
      "whale",
      "market-cap",
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
                        "ru": "Исторический максимум — самая высокая цена, которой актив достигал за всё время торгов. Пока цена не превысила прежний пик, максимум остаётся тем же, сколько бы лет ни прошло.",
                        "en": "An all-time high is the highest price an asset has ever reached. Until price exceeds the previous peak the high stands, however many years pass."
                  },
                  {
                        "ru": "Показатель зависит от того, в чём измерять. Монета может обновить максимум в долларах и одновременно оставаться далеко от пика по отношению к биткоину — это разные вещи, и путать их не стоит.",
                        "en": "The figure depends on the unit of measurement. A coin can set a new high in dollars while remaining far below its peak against bitcoin — these are different things and should not be conflated."
                  },
                  {
                        "ru": "Биржи считают максимум по-разному: одни берут цену сделок, другие учитывают краткие выбросы в стакане. Поэтому на двух площадках исторический максимум одной монеты может отличаться на несколько процентов.",
                        "en": "Exchanges compute the high differently: some use traded prices, others count brief spikes in the order book. So the all-time high for one coin can differ by a few percent between two venues."
                  }
            ]
      },
      {
            "heading": {
                  "ru": "Что значит расстояние до максимума",
                  "en": "What the distance from the high means"
            },
            "example": {
                  "setup": {
                        "ru": "Актив стоил на пике 100 долларов и упал до 40. Считаем, что нужно, чтобы вернуться.",
                        "en": "An asset peaked at $100 and fell to $40. Here is what a return would require."
                  },
                  "rows": [
                        {
                              "label": {
                                    "ru": "Падение от максимума",
                                    "en": "Drop from the high"
                              },
                              "value": {
                                    "ru": "60%",
                                    "en": "60%"
                              }
                        },
                        {
                              "label": {
                                    "ru": "Рост, нужный для возврата",
                                    "en": "Gain needed to recover"
                              },
                              "value": {
                                    "ru": "150%",
                                    "en": "150%"
                              }
                        },
                        {
                              "label": {
                                    "ru": "Падение на 80%",
                                    "en": "A drop of 80%"
                              },
                              "value": {
                                    "ru": "нужен рост 400%",
                                    "en": "needs a 400% gain"
                              }
                        },
                        {
                              "label": {
                                    "ru": "Падение на 90%",
                                    "en": "A drop of 90%"
                              },
                              "value": {
                                    "ru": "нужен рост 900%",
                                    "en": "needs a 900% gain"
                              }
                        }
                  ],
                  "outcome": {
                        "ru": "Асимметрия здесь важнее самого числа: чем глубже падение, тем непропорционально больший рост нужен для возврата. Именно поэтому «монета упала всего на 80%, вырастет обратно» — рассуждение, недооценивающее задачу вчетверо.",
                        "en": "The asymmetry matters more than the number itself: the deeper the fall, the disproportionately larger the recovery required. This is why “the coin is only down 80%, it will come back” underestimates the task fourfold."
                  }
            }
      },
      {
            "heading": {
                  "ru": "На что обратить внимание",
                  "en": "What to watch for"
            },
            "bullets": [
                  {
                        "title": {
                              "ru": "Максимум — не уровень поддержки",
                              "en": "A high is not a support level"
                        },
                        "text": {
                              "ru": "Прежний пик не обязан быть достигнут снова. Тысячи монет с максимумами 2021 года не вернулись к ним и, вероятно, не вернутся.",
                              "en": "A previous peak carries no obligation to be reached again. Thousands of coins with 2021 highs have not returned to them and probably will not."
                        }
                  },
                  {
                        "title": {
                              "ru": "Обновление максимума часто совпадает с притоком новичков",
                              "en": "New highs often coincide with an influx of newcomers"
                        },
                        "text": {
                              "ru": "Заголовки о рекорде привлекают тех, кто раньше не интересовался рынком. Это делает окрестности максимума самой людной и самой рискованной зоной.",
                              "en": "Record headlines attract people who were not following the market before. That makes the area around a high the most crowded and the riskiest zone."
                        }
                  },
                  {
                        "title": {
                              "ru": "Сравнивайте в одной валюте",
                              "en": "Compare in one currency"
                        },
                        "text": {
                              "ru": "Максимум в долларах, в евро и в биткоинах достигается в разные дни. Утверждение «обновили исторический максимум» без указания валюты почти бессодержательно.",
                              "en": "Highs in dollars, in euros and in bitcoin occur on different days. The claim “a new all-time high” without naming the currency says almost nothing."
                        }
                  }
            ]
      }
    ],
  },
  {
    slug: 'fomo',
    category: 'slang',
    term: { ru: 'FOMO', en: 'FOMO' },
    definition: {
      ru: 'Fear of Missing Out — страх упустить выгоду. Эмоциональное состояние, при котором инвестор покупает актив на пике роста из боязни «не успеть», что часто приводит к убыткам.',
      en: 'Fear of Missing Out — the emotional state in which an investor buys an asset near the top of a rally out of fear of "missing the move," which often leads to losses.',
    },
    updated: '2026-08-12',
    related: [
      "fud",
      "hodl",
      "ath",
      "market-order",
      "leverage",
      "whale"
    ],
    sections: [
      {
            "heading": {
                  "ru": "Как это работает",
                  "en": "How it works"
            },
            "paragraphs": [
                  {
                        "ru": "Страх упустить выгоду — это состояние, в котором решение принимается не по расчёту, а потому что цена уже растёт без вас. Человек покупает не потому, что оценил актив, а потому что боится остаться в стороне.",
                        "en": "The fear of missing out is a state in which a decision comes not from analysis but from watching price rise without you. A person buys not because they assessed the asset but because they are afraid of being left behind."
                  },
                  {
                        "ru": "Механизм усиливается обратной связью: рост цены порождает заголовки, заголовки приводят новых покупателей, покупки толкают цену дальше. На каждом витке кажется, что доказательств правоты становится больше, хотя прибавляется только скорость.",
                        "en": "The mechanism is amplified by feedback: rising prices produce headlines, headlines bring new buyers, buying pushes price further. Each turn feels like more evidence of being right, though all that grows is the speed."
                  },
                  {
                        "ru": "Отличить это состояние от обоснованного решения помогает простой признак: если вы не могли объяснить, зачем вам этот актив, неделю назад по той же цене, то покупаете вы движение, а не актив.",
                        "en": "One simple test separates this state from a reasoned decision: if you could not have explained why you wanted this asset a week ago at the same price, you are buying the move rather than the asset."
                  }
            ]
      },
      {
            "heading": {
                  "ru": "Во что это обходится",
                  "en": "What it costs"
            },
            "example": {
                  "setup": {
                        "ru": "Два входа в один и тот же актив: один по плану, другой на волне заголовков.",
                        "en": "Two entries into the same asset: one to a plan, one on a wave of headlines."
                  },
                  "rows": [
                        {
                              "label": {
                                    "ru": "Вход по плану, заранее выбранная цена",
                                    "en": "Planned entry at a pre-chosen price"
                              },
                              "value": {
                                    "ru": "1 000 долларов по 40",
                                    "en": "$1,000 at 40"
                              }
                        },
                        {
                              "label": {
                                    "ru": "Вход на пике внимания",
                                    "en": "Entry at peak attention"
                              },
                              "value": {
                                    "ru": "1 000 долларов по 95",
                                    "en": "$1,000 at 95"
                              }
                        },
                        {
                              "label": {
                                    "ru": "Цена через три месяца",
                                    "en": "Price three months later"
                              },
                              "value": {
                                    "ru": "55",
                                    "en": "55"
                              }
                        },
                        {
                              "label": {
                                    "ru": "Результат первого",
                                    "en": "Outcome of the first"
                              },
                              "value": {
                                    "ru": "+37%",
                                    "en": "+37%"
                              }
                        },
                        {
                              "label": {
                                    "ru": "Результат второго",
                                    "en": "Outcome of the second"
                              },
                              "value": {
                                    "ru": "−42%",
                                    "en": "−42%"
                              }
                        }
                  ],
                  "outcome": {
                        "ru": "Актив был один и тот же, разной была только точка входа. Разница в результате — 79 процентных пунктов, и она целиком объясняется тем, в какой момент принималось решение.",
                        "en": "The asset was identical; only the entry point differed. The 79-point gap in outcome is explained entirely by when the decision was made."
                  }
            }
      },
      {
            "heading": {
                  "ru": "Что с этим делать",
                  "en": "What to do about it"
            },
            "bullets": [
                  {
                        "title": {
                              "ru": "Решение до движения, а не во время",
                              "en": "Decide before the move, not during it"
                        },
                        "text": {
                              "ru": "Цена входа, размер позиции и условия выхода, записанные заранее, работают именно потому, что записаны в спокойном состоянии.",
                              "en": "An entry price, position size and exit conditions written down in advance work precisely because they were written in a calm state."
                        }
                  },
                  {
                        "title": {
                              "ru": "Разбить вход на части",
                              "en": "Split the entry"
                        },
                        "text": {
                              "ru": "Покупка равными долями по расписанию снимает вопрос «а вдруг сейчас пик» — она заведомо не попадает ни в лучшую, ни в худшую точку.",
                              "en": "Buying equal amounts on a schedule removes the question of whether this is the top — it deliberately hits neither the best nor the worst point."
                        }
                  },
                  {
                        "title": {
                              "ru": "Заголовок — не сигнал",
                              "en": "A headline is not a signal"
                        },
                        "text": {
                              "ru": "К моменту, когда о росте пишут широкие издания, движение уже отражено в цене. Новость сообщает о прошлом, а не о будущем.",
                              "en": "By the time mainstream outlets write about a rally, the move is already in the price. News reports the past, not the future."
                        }
                  }
            ]
      }
    ],
  },
  {
    slug: 'fud',
    category: 'slang',
    term: { ru: 'FUD', en: 'FUD' },
    definition: {
      ru: 'Fear, Uncertainty and Doubt (страх, неопределённость и сомнение) — распространение негативной или пугающей информации о проекте, часто намеренно, чтобы снизить его цену.',
      en: 'Fear, Uncertainty and Doubt — the spread of negative or alarming information about a project, often deliberate, intended to push its price down.',
    },
    updated: '2026-08-12',
    related: [
      "fomo",
      "hodl",
      "whale",
      "rug-pull",
      "ath",
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
                        "ru": "Аббревиатура складывается из трёх слов: страх, неуверенность, сомнение. Так называют поток тревожных сообщений, который сбивает цену быстрее, чем участники успевают проверить, есть ли за ними что-то реальное.",
                        "en": "The abbreviation stands for fear, uncertainty and doubt. It describes a stream of alarming messages that knocks price down faster than participants can check whether anything real lies behind it."
                  },
                  {
                        "ru": "Важно, что термин ничего не говорит о правдивости. Плохая новость может быть полностью достоверной: крах биржи FTX в 2022 году сначала называли этим словом, и он оказался правдой. Ярлык описывает эмоциональный эффект, а не факты.",
                        "en": "The term says nothing about truth. Bad news can be entirely accurate: the collapse of the FTX exchange in 2022 was first dismissed with this word and turned out to be real. The label describes an emotional effect, not the facts."
                  },
                  {
                        "ru": "Именно поэтому слово стало удобным инструментом спора. Назвать критику этим ярлыком проще, чем ответить на неё по существу, и в спорах о конкретных проектах оно чаще всего используется именно так.",
                        "en": "That is exactly why the word became a convenient debating tool. Labelling criticism this way is easier than answering it, and in arguments about specific projects it is most often used that way."
                  }
            ]
      },
      {
            "heading": {
                  "ru": "Как отличить панику от новости",
                  "en": "Telling panic from news"
            },
            "bullets": [
                  {
                        "title": {
                              "ru": "Есть ли первоисточник",
                              "en": "Is there a primary source"
                        },
                        "text": {
                              "ru": "Заявление регулятора, отчётность, запись в блокчейне — это проверяемые вещи. Пересказ анонимного сообщения проверить нельзя.",
                              "en": "A regulator's statement, a filing, an on-chain record — these can be checked. A retelling of an anonymous post cannot."
                        }
                  },
                  {
                        "title": {
                              "ru": "Меняет ли новость что-то по существу",
                              "en": "Does the news change anything substantive"
                        },
                        "text": {
                              "ru": "Задержка обновления и приостановка вывода средств — события разного веса, хотя реакция цены на них может выглядеть одинаково.",
                              "en": "A delayed upgrade and a halt on withdrawals are events of different weight, though the price reaction to them can look identical."
                        }
                  },
                  {
                        "title": {
                              "ru": "Кому выгодно ваше решение",
                              "en": "Who benefits from your decision"
                        },
                        "text": {
                              "ru": "И паника, и её опровержение кому-то выгодны. Вопрос «кто это говорит и что он получит» полезнее, чем сам ярлык.",
                              "en": "Both a panic and its rebuttal benefit someone. Asking who is speaking and what they gain is more useful than the label itself."
                        }
                  },
                  {
                        "title": {
                              "ru": "Отвечают ли по существу",
                              "en": "Is the response substantive"
                        },
                        "text": {
                              "ru": "Если на конкретный вопрос о резервах отвечают словом «паникёры», отсутствие ответа само по себе информативно.",
                              "en": "If a specific question about reserves is answered with the word “panic”, the absence of an answer is itself informative."
                        }
                  }
            ]
      },
      {
            "heading": {
                  "ru": "На что обратить внимание",
                  "en": "What to watch for"
            },
            "paragraphs": [
                  {
                        "ru": "Ярлык работает в обе стороны. Им пользуются и те, кто хочет купить дешевле, распространяя тревогу, и те, кто хочет удержать цену, объявляя любую критику паникой. В обоих случаях слово заменяет разбор.",
                        "en": "The label cuts both ways. It is used both by those who want to buy cheaper by spreading alarm and by those who want to hold price up by declaring all criticism panic. In both cases the word replaces analysis."
                  },
                  {
                        "ru": "Практический вывод простой: решение о продаже, принятое за пятнадцать минут на основании одного сообщения, почти всегда хуже решения, принятого через сутки на основании проверенных фактов. Рынок редко закрывается за ночь.",
                        "en": "The practical conclusion is simple: a decision to sell made in fifteen minutes on the strength of one post is almost always worse than one made a day later on verified facts. Markets rarely close overnight."
                  }
            ]
      }
    ],
  },
  {
    slug: 'hodl',
    category: 'slang',
    term: { ru: 'HODL', en: 'HODL' },
    definition: {
      ru: 'Сленговое слово (от опечатки «hold»), обозначающее стратегию долгосрочного удержания криптовалюты несмотря на колебания рынка.',
      en: 'Crypto slang (originating from a typo of "hold") for a strategy of holding cryptocurrency long-term regardless of market swings.',
    },
    updated: '2026-08-12',
    related: [
      "fomo",
      "fud",
      "bitcoin",
      "ath",
      "halving",
      "non-custodial-wallet"
    ],
    sections: [
      {
            "heading": {
                  "ru": "Откуда слово",
                  "en": "Where the word comes from"
            },
            "paragraphs": [
                  {
                        "ru": "Слово появилось в декабре 2013 года из опечатки. Участник форума Bitcointalk написал сообщение с заголовком «I AM HODLING», объясняя, что после падения цены не собирается ничего продавать, потому что всё равно торгует хуже профессионалов.",
                        "en": "The word came from a typo in December 2013. A user on the Bitcointalk forum posted under the heading “I AM HODLING”, explaining that after a price drop he was not going to sell anything because he traded worse than professionals anyway."
                  },
                  {
                        "ru": "Опечатка прижилась и со временем обросла толкованием hold on for dear life — «держаться изо всех сил». Это позднейшая расшифровка, а не исходный смысл.",
                        "en": "The typo caught on and later acquired the reading “hold on for dear life”. That is a retrofitted expansion, not the original meaning."
                  },
                  {
                        "ru": "За шуткой стоит содержательная идея: большинство частных инвесторов проигрывают рынку не из-за плохого выбора активов, а из-за попыток угадать моменты входа и выхода. Отказ от таких попыток — осознанная стратегия, а не пассивность.",
                        "en": "Behind the joke is a substantive idea: most retail investors lose to the market not through poor asset selection but through attempts to time entries and exits. Declining to try is a deliberate strategy, not passivity."
                  }
            ]
      },
      {
            "heading": {
                  "ru": "Чем это отличается от бездействия",
                  "en": "How this differs from doing nothing"
            },
            "bullets": [
                  {
                        "title": {
                              "ru": "Актив выбран заранее",
                              "en": "The asset was chosen in advance"
                        },
                        "text": {
                              "ru": "Стратегия предполагает, что вы разобрались, что держите. Держать монету, о которой ничего не знаете, — это не стратегия, а надежда.",
                              "en": "The strategy assumes you understand what you hold. Holding a coin you know nothing about is not a strategy but a hope."
                        }
                  },
                  {
                        "title": {
                              "ru": "Размер позиции такой, что её можно не трогать",
                              "en": "The position is sized so it can be left alone"
                        },
                        "text": {
                              "ru": "Если сумма такая, что падение вдвое заставит продавать, то стратегия не выдержит первой же просадки.",
                              "en": "If the amount is such that a halving forces a sale, the strategy will not survive its first drawdown."
                        }
                  },
                  {
                        "title": {
                              "ru": "Есть условия пересмотра",
                              "en": "There are conditions for review"
                        },
                        "text": {
                              "ru": "Взлом протокола, уход команды, смена правил выпуска — поводы пересмотреть решение. Отказ реагировать на факты — не дисциплина, а упрямство.",
                              "en": "A protocol exploit, a team walking away, a change to issuance rules are reasons to revisit. Refusing to react to facts is stubbornness, not discipline."
                        }
                  },
                  {
                        "title": {
                              "ru": "Хранение продумано",
                              "en": "Custody is thought through"
                        },
                        "text": {
                              "ru": "Долгий срок повышает цену ошибки в хранении. Держать многолетнюю позицию на бирже — отдельный риск, не связанный с ценой.",
                              "en": "A long horizon raises the cost of a custody mistake. Holding a multi-year position on an exchange is a separate risk, unrelated to price."
                        }
                  }
            ]
      },
      {
            "heading": {
                  "ru": "На что обратить внимание",
                  "en": "What to watch for"
            },
            "paragraphs": [
                  {
                        "ru": "Стратегия проверена на биткоине и эфире, у которых есть многолетняя история и работающая сеть. Переносить её на любую монету механически нельзя: из тысяч проектов, существовавших в 2017 году, до сегодняшнего дня в заметном виде дожили десятки.",
                        "en": "The approach has been tested on bitcoin and ether, which have years of history and a working network. Transferring it to any coin mechanically does not work: of the thousands of projects alive in 2017, only dozens survive in any meaningful form."
                  },
                  {
                        "ru": "Второе ограничение — срок. Подход рассчитан на годы, а не на месяцы, и требует, чтобы деньги действительно не понадобились в этот срок. Инвестировать так средства, отложенные на ближайший год, значит гарантированно оказаться перед выбором в худший момент.",
                        "en": "The second limit is time. The approach is built for years rather than months and requires that the money genuinely is not needed in that span. Committing next year's funds this way guarantees facing a decision at the worst moment."
                  }
            ]
      }
    ],
  },
  {
    slug: 'whale',
    category: 'slang',
    term: { ru: 'Кит', en: 'Whale' },
    definition: {
      ru: 'Инвестор или кошелёк, владеющий очень крупным объёмом криптовалюты. Действия китов (крупные покупки или продажи) способны заметно влиять на цену актива.',
      en: 'An investor or wallet holding a very large amount of cryptocurrency. The actions of whales (large buys or sells) can noticeably move an asset\'s price.',
    },
    updated: '2026-08-12',
    related: [
      "market-order",
      "order-book",
      "block-explorer",
      "exchange",
      "ath",
      "fomo"
    ],
    sections: [
      {
            "heading": {
                  "ru": "Как это работает",
                  "en": "How it works"
            },
            "paragraphs": [
                  {
                        "ru": "Китом называют владельца настолько крупной позиции, что его отдельная сделка заметна на цене. Точного порога нет: для биткоина это тысячи монет, для небольшого токена достаточно и нескольких десятков тысяч долларов.",
                        "en": "A whale is the holder of a position large enough that a single trade of theirs moves the price. There is no exact threshold: for bitcoin it means thousands of coins, while for a small token a few tens of thousands of dollars is enough."
                  },
                  {
                        "ru": "Дело не в богатстве, а в соотношении размера позиции и глубины рынка. Один и тот же человек будет китом в токене с оборотом в миллион долларов и незаметным участником в биткоине.",
                        "en": "It is not about wealth but about the ratio of position size to market depth. The same person is a whale in a token turning over a million dollars a day and an invisible participant in bitcoin."
                  },
                  {
                        "ru": "Крупные кошельки видны в блокчейне, и за ними следят специальные сервисы. Но видно только движение средств, а не намерение: перевод на биржу может означать и подготовку к продаже, и смену места хранения.",
                        "en": "Large wallets are visible on-chain and tracked by dedicated services. Yet only the movement is visible, not the intent: a transfer to an exchange can mean preparation to sell or simply a change of custody."
                  }
            ]
      },
      {
            "heading": {
                  "ru": "Почему крупная сделка двигает цену",
                  "en": "Why a large trade moves price"
            },
            "example": {
                  "setup": {
                        "ru": "В стакане на продажу выставлено по 10 монет на каждом ценовом уровне. Кит покупает 40 монет одной рыночной заявкой.",
                        "en": "The order book has 10 coins for sale at each price level. A whale buys 40 coins with a single market order."
                  },
                  "rows": [
                        {
                              "label": {
                                    "ru": "Первые 10 монет",
                                    "en": "First 10 coins"
                              },
                              "value": {
                                    "ru": "по 100 долларов",
                                    "en": "at $100"
                              }
                        },
                        {
                              "label": {
                                    "ru": "Следующие 10",
                                    "en": "Next 10"
                              },
                              "value": {
                                    "ru": "по 102 доллара",
                                    "en": "at $102"
                              }
                        },
                        {
                              "label": {
                                    "ru": "Следующие 10",
                                    "en": "Next 10"
                              },
                              "value": {
                                    "ru": "по 105 долларов",
                                    "en": "at $105"
                              }
                        },
                        {
                              "label": {
                                    "ru": "Последние 10",
                                    "en": "Last 10"
                              },
                              "value": {
                                    "ru": "по 110 долларов",
                                    "en": "at $110"
                              }
                        }
                  ],
                  "outcome": {
                        "ru": "Средняя цена покупки вышла 104,25 доллара вместо 100, а на экране у всех остальных цена мгновенно подскочила на 10%. Никакой новости при этом не было — двигал цену размер заявки, а не информация.",
                        "en": "The average purchase price came to $104.25 instead of $100, and on everyone else's screen the price jumped 10% instantly. No news was involved — the order size moved the price, not information."
                  },
                  "total": {
                        "label": {
                              "ru": "Средняя цена",
                              "en": "Average price"
                        },
                        "value": {
                              "ru": "104,25 доллара",
                              "en": "$104.25"
                        }
                  }
            }
      },
      {
            "heading": {
                  "ru": "На что обратить внимание",
                  "en": "What to watch for"
            },
            "bullets": [
                  {
                        "title": {
                              "ru": "Перевод на биржу — не приговор",
                              "en": "A transfer to an exchange is not a verdict"
                        },
                        "text": {
                              "ru": "Сервисы отслеживания сообщают о движении средств, а не о планах. Значительная часть таких переводов заканчивается ничем.",
                              "en": "Tracking services report movements, not plans. A significant share of such transfers comes to nothing."
                        }
                  },
                  {
                        "title": {
                              "ru": "Чем меньше монета, тем важнее распределение",
                              "en": "The smaller the coin, the more distribution matters"
                        },
                        "text": {
                              "ru": "Если несколько кошельков держат большую часть выпуска, цена зависит от решений нескольких человек. Это видно в блокчейн-эксплорере до покупки.",
                              "en": "If a handful of wallets hold most of the supply, price depends on a few people's decisions. This is visible in a block explorer before you buy."
                        }
                  },
                  {
                        "title": {
                              "ru": "Копировать сделки бессмысленно",
                              "en": "Copying trades makes little sense"
                        },
                        "text": {
                              "ru": "Вы видите сделку после её исполнения и не знаете ни горизонта, ни размера остальной позиции, ни того, чем она захеджирована.",
                              "en": "You see a trade after it executed and know neither the horizon, nor the size of the rest of the position, nor how it is hedged."
                        }
                  }
            ]
      }
    ],
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
      "ru": "Хардфорк — изменение правил сети, несовместимое со старой версией. Узлы, не обновившиеся, перестают признавать новые блоки, и если несогласных много, цепочка расходится на две отдельные сети.",
      "en": "A hard fork is a change to a network's rules that old software cannot accept. Nodes that do not upgrade stop recognising new blocks, and when enough disagree the chain splits into two separate networks."
    },
    updated: '2026-08-11',
    related: [
      "soft-fork",
      "node",
      "consensus-mechanism",
      "blockchain",
      "bitcoin",
      "mining"
    ],
    sections: [
      {
        "heading": {
          "ru": "Как это работает",
          "en": "How it works"
        },
        "paragraphs": [
          {
            "ru": "Правила блокчейна записаны в коде узлов. Если изменение расширяет допустимое — например, увеличивает размер блока, — старые узлы будут считать новые блоки недействительными. Совместимости не получится ни в какую сторону.",
            "en": "A blockchain's rules live in node software. If a change widens what is allowed — a larger block size, say — old nodes will treat the new blocks as invalid. There is no compatibility in either direction."
          },
          {
            "ru": "Дальше всё решает, сколько участников перешло. Если почти все — старая цепочка просто умирает, и это обычное плановое обновление. Если сообщество раскололось — существовать продолжат обе цепочки, каждая со своей монетой.",
            "en": "What happens next depends on how many switch. If nearly everyone does, the old chain simply dies and it counts as a routine planned upgrade. If the community splits, both chains continue, each with its own coin."
          },
          {
            "ru": "У держателей монет в момент раскола баланс оказывается в обеих сетях: история до форка общая. Так в 2017 году появился Bitcoin Cash, а в 2016-м — Ethereum Classic после спора о возврате средств, украденных из The DAO.",
            "en": "Holders at the moment of the split end up with a balance on both networks, since the history before the fork is shared. That is how Bitcoin Cash appeared in 2017, and Ethereum Classic in 2016 after a dispute over reversing funds stolen from The DAO."
          }
        ]
      },
      {
        "heading": {
          "ru": "Что это значит для держателя",
          "en": "What it means for a holder"
        },
        "bullets": [
          {
            "title": {
              "ru": "Монеты дублируются, стоимость — нет",
              "en": "Coins duplicate, value does not"
            },
            "text": {
              "ru": "Баланс появляется в обеих сетях, но рынок делит стоимость между ними, а не удваивает её.",
              "en": "The balance appears on both networks, but the market divides the value between them rather than doubling it."
            }
          },
          {
            "title": {
              "ru": "Опасность повторного проигрывания",
              "en": "Replay risk"
            },
            "text": {
              "ru": "Без специальной защиты транзакция из одной цепочки может быть повторена в другой. Первые дни после форка лучше переждать.",
              "en": "Without replay protection a transaction on one chain can be repeated on the other. The first days after a fork are best sat out."
            }
          },
          {
            "title": {
              "ru": "Мошенники любят форки",
              "en": "Forks attract scams"
            },
            "text": {
              "ru": "«Получите монеты форка, введите сид-фразу» — классическая схема. Настоящий форк не требует ваших ключей.",
              "en": "\"Claim your fork coins, enter your seed phrase\" is a standard scheme. A real fork asks for none of your keys."
            }
          },
          {
            "title": {
              "ru": "Большинство форков — рутина",
              "en": "Most forks are routine"
            },
            "text": {
              "ru": "Плановые обновления сети тоже технически хардфорки. Раскол происходит редко и обычно из-за спора, а не из-за кода.",
              "en": "Planned network upgrades are technically hard forks too. A split is rare and usually caused by a dispute rather than by the code."
            }
          }
        ]
      }
    ],
  },
  {
    slug: 'soft-fork',
    category: 'tech',
    term: { ru: 'Софт-форк', en: 'Soft fork' },
    definition: {
      ru: 'Обратно совместимое обновление правил протокола, при котором старые ноды продолжают работать в новой сети без необходимости обязательного обновления.',
      en: 'A backwards-compatible update to a protocol\'s rules, where old nodes can continue operating on the upgraded network without being forced to update.',
    },
    updated: '2026-08-12',
    related: [
      "hard-fork",
      "bitcoin",
      "blockchain",
      "node",
      "consensus-mechanism",
      "mining"
    ],
    sections: [
      {
            "heading": {
                  "ru": "Как это работает",
                  "en": "How it works"
            },
            "paragraphs": [
                  {
                        "ru": "Мягкий форк — обновление правил сети, при котором новые правила строже старых. Блоки, созданные по новым правилам, остаются допустимыми и для старых узлов, поэтому сеть не разделяется, даже если обновились не все.",
                        "en": "A soft fork is a rules update in which the new rules are stricter than the old ones. Blocks produced under the new rules remain valid for old nodes as well, so the network does not split even if not everyone upgrades."
                  },
                  {
                        "ru": "Отличие от жёсткого форка именно в направлении. Жёсткий форк расширяет допустимое — старые узлы перестают понимать новые блоки, и цепочка расходится надвое. Мягкий сужает, и совместимость сохраняется в одну сторону.",
                        "en": "The difference from a hard fork lies in direction. A hard fork widens what is permitted — old nodes stop recognising new blocks and the chain splits in two. A soft fork narrows it, and compatibility survives one way."
                  },
                  {
                        "ru": "Обратная сторона такой совместимости в том, что старые узлы проверяют новые правила не полностью. Они видят блок как корректный, хотя не понимают части его содержимого. Поэтому мягкий форк считают более щадящим по последствиям, но менее прозрачным по сути.",
                        "en": "The flip side of that compatibility is that old nodes do not fully verify the new rules. They see a block as valid while not understanding part of its contents. This makes a soft fork gentler in consequences but less transparent in substance."
                  }
            ]
      },
      {
            "heading": {
                  "ru": "Как это выглядело в биткоине",
                  "en": "How it looked in Bitcoin"
            },
            "bullets": [
                  {
                        "title": {
                              "ru": "SegWit, 2017 год",
                              "en": "SegWit, 2017"
                        },
                        "text": {
                              "ru": "Подписи вынесли в отдельную часть блока. Старые узлы видели такие транзакции как корректные, хотя не разбирали новый формат. Обновление подготовило почву для сети Lightning.",
                              "en": "Signatures were moved into a separate part of the block. Old nodes saw such transactions as valid without parsing the new format. The upgrade laid the ground for the Lightning network."
                        }
                  },
                  {
                        "title": {
                              "ru": "Taproot, 2021 год",
                              "en": "Taproot, 2021"
                        },
                        "text": {
                              "ru": "Добавил новую схему подписей и сделал сложные условия траты неотличимыми от обычного перевода. Активирован при поддержке более 90% вычислительной мощности.",
                              "en": "Added a new signature scheme and made complex spending conditions indistinguishable from ordinary transfers. Activated with over 90% of hash power in support."
                        }
                  },
                  {
                        "title": {
                              "ru": "Ограничение размера блока в 1 МБ",
                              "en": "The 1 MB block size limit"
                        },
                        "text": {
                              "ru": "Введено в 2010 году тоже как ужесточение правил: до этого предела не было. Позже именно спор о его изменении привёл к жёсткому форку и появлению Bitcoin Cash.",
                              "en": "Introduced in 2010, also as a tightening: before that there was no limit. The later dispute over changing it produced the hard fork that created Bitcoin Cash."
                        }
                  }
            ]
      },
      {
            "heading": {
                  "ru": "На что обратить внимание",
                  "en": "What to watch for"
            },
            "paragraphs": [
                  {
                        "ru": "Для держателя монет мягкий форк обычно проходит незаметно: новых монет не появляется, кошелёк продолжает работать, ничего делать не нужно. Именно этим он отличается от жёсткого форка, после которого у вас оказывается баланс в двух сетях сразу.",
                        "en": "For a coin holder a soft fork usually passes unnoticed: no new coins appear, the wallet keeps working, nothing needs doing. That is precisely what distinguishes it from a hard fork, after which you hold a balance on two networks at once."
                  },
                  {
                        "ru": "Единственное, что стоит проверить, — поддерживает ли ваш кошелёк новые возможности. Старая версия продолжит отправлять и принимать средства, но не даст пользоваться тем, что добавило обновление: например, более дешёвыми комиссиями нового формата адресов.",
                        "en": "The one thing worth checking is whether your wallet supports the new capabilities. An old version will keep sending and receiving but will not let you use what the upgrade added — cheaper fees from a new address format, for instance."
                  }
            ]
      }
    ],
  },
  {
    slug: 'consensus-mechanism',
    category: 'tech',
    term: { ru: 'Механизм консенсуса', en: 'Consensus mechanism' },
    definition: {
      "ru": "Механизм консенсуса — правило, по которому сеть без центра решает, какая версия истории верна. Он определяет, кто записывает следующий блок и что делает участника честным.",
      "en": "A consensus mechanism is the rule by which a network with no centre decides which version of history is correct. It sets who writes the next block and what keeps a participant honest."
    },
    updated: '2026-08-11',
    related: [
      "proof-of-work",
      "proof-of-stake",
      "node",
      "blockchain",
      "hard-fork",
      "mining"
    ],
    sections: [
      {
        "heading": {
          "ru": "Какую задачу он решает",
          "en": "The problem it solves"
        },
        "paragraphs": [
          {
            "ru": "Тысячи узлов получают транзакции в разном порядке и с разной задержкой. Нужно, чтобы все пришли к одной версии событий, не доверяя друг другу и не имея арбитра. Это и есть задача консенсуса.",
            "en": "Thousands of nodes receive transactions in different orders and with different delays. They must arrive at one version of events without trusting each other and without an arbiter. That is the consensus problem."
          },
          {
            "ru": "Сложность в том, что часть участников может врать намеренно. Механизм должен работать, даже когда меньшинство активно вредит, — и делать вред дороже пользы от него.",
            "en": "The difficulty is that some participants may lie deliberately. The mechanism has to work even while a minority actively attacks, and to make attacking cost more than it returns."
          },
          {
            "ru": "Разные механизмы делают ставку на разные ресурсы. Proof-of-Work делает дорогой саму запись, Proof-of-Stake — нарушение правил, а сети с ограниченным кругом участников просто договариваются голосованием известных сторон.",
            "en": "Different mechanisms stake different resources. Proof-of-Work makes writing expensive, Proof-of-Stake makes breaking the rules expensive, and permissioned networks simply vote among known parties."
          }
        ]
      },
      {
        "heading": {
          "ru": "Чем они отличаются",
          "en": "How they differ"
        },
        "example": {
          "setup": {
            "ru": "Что именно теряет нарушитель в каждом подходе.",
            "en": "What an attacker actually loses under each approach."
          },
          "rows": [
            {
              "label": {
                "ru": "Proof-of-Work",
                "en": "Proof-of-Work"
              },
              "value": {
                "ru": "электричество и оборудование",
                "en": "electricity and hardware"
              }
            },
            {
              "label": {
                "ru": "Proof-of-Stake",
                "en": "Proof-of-Stake"
              },
              "value": {
                "ru": "заблокированные монеты",
                "en": "the locked stake"
              }
            },
            {
              "label": {
                "ru": "Закрытые сети",
                "en": "Permissioned networks"
              },
              "value": {
                "ru": "репутацию и доступ",
                "en": "reputation and access"
              }
            }
          ],
          "outcome": {
            "ru": "Отсюда и разница в свойствах: первый устойчив, но энергоёмок; второй экономичен, но склонен к концентрации у крупных держателей; третий быстр, но требует доверия к списку участников.",
            "en": "Hence the differing properties: the first is resilient but energy-hungry, the second efficient but prone to concentration among large holders, the third fast but reliant on trusting the participant list."
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
              "ru": "Скорость покупается доверием",
              "en": "Speed is bought with trust"
            },
            "text": {
              "ru": "Сети с тысячей транзакций в секунду обычно имеют меньше независимых валидаторов. Это компромисс, а не превосходство.",
              "en": "Networks doing a thousand transactions a second usually have fewer independent validators. That is a trade-off, not superiority."
            }
          },
          {
            "title": {
              "ru": "Финальность бывает разной",
              "en": "Finality varies"
            },
            "text": {
              "ru": "В одних сетях транзакция необратима через секунды, в других вероятность отката просто убывает с каждым блоком.",
              "en": "In some networks a transaction is final within seconds; in others the chance of reversal merely shrinks with each block."
            }
          },
          {
            "title": {
              "ru": "Решают узлы, а не мощность",
              "en": "Nodes decide, not hashpower"
            },
            "text": {
              "ru": "Майнер предлагает блок, но принимают его узлы. Правила меняются только с их согласия.",
              "en": "A miner proposes a block, but nodes accept it. Rules change only with their agreement."
            }
          }
        ]
      }
    ],
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
    updated: '2026-08-12',
    related: [
      "erc-20",
      "bep-20",
      "stablecoin",
      "transaction",
      "smart-contract",
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
                        "ru": "TRC-20 — стандарт токенов в сети Tron. Он описывает набор функций, которые должен уметь контракт токена: показывать баланс, переводить средства, разрешать списание третьей стороне. Любой кошелёк, знающий стандарт, работает с любым таким токеном.",
                        "en": "TRC-20 is the token standard on the Tron network. It describes the set of functions a token contract must provide: report a balance, transfer funds, authorise a third party to spend. Any wallet that knows the standard works with any such token."
                  },
                  {
                        "ru": "Стандарт устроен так же, как ERC-20 в Ethereum, и намеренно повторяет его набор функций. Разница не в логике, а в сети: комиссии, скорость подтверждения и способ оплаты газа у Tron свои.",
                        "en": "The standard mirrors Ethereum's ERC-20 and deliberately repeats its function set. The difference is not in logic but in the network: Tron has its own fees, confirmation speed and way of paying for gas."
                  },
                  {
                        "ru": "Практическая известность стандарта держится почти целиком на одном применении — переводах USDT. По объёму этих переводов Tron долгие годы соперничает с Ethereum, и причина проста: комиссия за перевод здесь измеряется центами, а не долларами.",
                        "en": "The standard's practical fame rests almost entirely on one use — USDT transfers. Tron has rivalled Ethereum on the volume of those transfers for years, for a simple reason: a transfer here costs cents rather than dollars."
                  }
            ]
      },
      {
            "heading": {
                  "ru": "Чем отличается от соседних стандартов",
                  "en": "How it differs from neighbouring standards"
            },
            "example": {
                  "setup": {
                        "ru": "Перевод 1 000 USDT в трёх разных сетях. Значения комиссий ориентировочные и меняются вместе с загрузкой.",
                        "en": "Sending 1,000 USDT across three networks. Fee figures are indicative and move with network load."
                  },
                  "rows": [
                        {
                              "label": {
                                    "ru": "TRC-20, сеть Tron",
                                    "en": "TRC-20 on Tron"
                              },
                              "value": {
                                    "ru": "около 1 доллара",
                                    "en": "around $1"
                              }
                        },
                        {
                              "label": {
                                    "ru": "ERC-20, сеть Ethereum",
                                    "en": "ERC-20 on Ethereum"
                              },
                              "value": {
                                    "ru": "3–15 долларов",
                                    "en": "$3–15"
                              }
                        },
                        {
                              "label": {
                                    "ru": "BEP-20, сеть BNB Chain",
                                    "en": "BEP-20 on BNB Chain"
                              },
                              "value": {
                                    "ru": "около 0,2 доллара",
                                    "en": "around $0.20"
                              }
                        },
                        {
                              "label": {
                                    "ru": "Время подтверждения в Tron",
                                    "en": "Confirmation time on Tron"
                              },
                              "value": {
                                    "ru": "около минуты",
                                    "en": "about a minute"
                              }
                        }
                  ],
                  "outcome": {
                        "ru": "Для перевода стейблкоинов между биржами разница в комиссии решает всё, и поэтому Tron занял эту нишу. Но у сети меньше приложений DeFi и заметно выше концентрация валидаторов, так что выбор здесь — не «лучше или хуже», а «дешевле против шире».",
                        "en": "For moving stablecoins between exchanges the fee difference decides everything, which is how Tron took this niche. But the network has fewer DeFi applications and markedly higher validator concentration, so the choice is not better versus worse but cheaper versus broader."
                  }
            }
      },
      {
            "heading": {
                  "ru": "На что обратить внимание",
                  "en": "What to watch for"
            },
            "bullets": [
                  {
                        "title": {
                              "ru": "Сеть при выводе выбирается отдельно",
                              "en": "The network is chosen separately on withdrawal"
                        },
                        "text": {
                              "ru": "USDT существует в десятке сетей. Отправив TRC-20 на адрес ERC-20, вы почти наверняка потеряете средства безвозвратно.",
                              "en": "USDT exists on a dozen networks. Send TRC-20 to an ERC-20 address and the funds are almost certainly lost for good."
                        }
                  },
                  {
                        "title": {
                              "ru": "Для комиссии нужен TRX на балансе",
                              "en": "You need TRX on the balance for fees"
                        },
                        "text": {
                              "ru": "Комиссия платится в основной монете сети. Кошелёк только с USDT не сможет отправить перевод, пока на нём нет небольшого запаса TRX.",
                              "en": "Fees are paid in the network's native coin. A wallet holding only USDT cannot send until it also holds a small amount of TRX."
                        }
                  },
                  {
                        "title": {
                              "ru": "Адреса начинаются с T",
                              "en": "Addresses begin with T"
                        },
                        "text": {
                              "ru": "Формат адреса отличается от Ethereum визуально, и это первая проверка перед отправкой.",
                              "en": "The address format differs visually from Ethereum's, and that is the first check before sending."
                        }
                  },
                  {
                        "title": {
                              "ru": "Эмитент может заморозить баланс",
                              "en": "The issuer can freeze a balance"
                        },
                        "text": {
                              "ru": "Это свойство самого USDT, а не сети: компания-эмитент технически способна заблокировать адрес в любой сети.",
                              "en": "That is a property of USDT itself rather than the network: the issuing company can technically block an address on any network."
                        }
                  }
            ]
      }
    ],
  },
  {
    slug: 'bep-20',
    category: 'tokens',
    term: { ru: 'BEP-20', en: 'BEP-20' },
    definition: {
      ru: 'Стандарт токенов сети BNB Smart Chain (BSC), совместимый по структуре с ERC-20, но с более низкими комиссиями за транзакции.',
      en: 'A token standard on the BNB Smart Chain (BSC), structurally compatible with ERC-20 but with lower transaction fees.',
    },
    updated: '2026-08-12',
    related: [
      "erc-20",
      "trc-20",
      "stablecoin",
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
                        "ru": "BEP-20 — стандарт токенов в сети BNB Chain, созданной биржей Binance. Как и родственные стандарты, он задаёт обязательный набор функций контракта, благодаря которому все кошельки и приложения работают с любым токеном одинаково.",
                        "en": "BEP-20 is the token standard on BNB Chain, the network created by the Binance exchange. Like its relatives it defines a mandatory set of contract functions so that every wallet and application handles any token the same way."
                  },
                  {
                        "ru": "Стандарт полностью совместим с ERC-20 на уровне кода: приложение, написанное для Ethereum, переносится сюда почти без изменений. Это было сознательным решением — сеть запускалась в 2020 году как более дешёвая альтернатива, и лёгкий перенос проектов был её главным аргументом.",
                        "en": "The standard is fully compatible with ERC-20 at the code level: an application written for Ethereum ports here with almost no changes. That was deliberate — the network launched in 2020 as a cheaper alternative, and easy migration was its main argument."
                  },
                  {
                        "ru": "Плата за дешевизну — в устройстве сети. Блоки подтверждают несколько десятков валидаторов вместо тысяч независимых узлов, поэтому решения принимаются быстрее, но круг тех, кто их принимает, заметно уже.",
                        "en": "The price of that cheapness is in the network's design. Blocks are confirmed by a few dozen validators rather than thousands of independent nodes, so decisions come faster but the circle making them is markedly narrower."
                  }
            ]
      },
      {
            "heading": {
                  "ru": "На что обратить внимание",
                  "en": "What to watch for"
            },
            "bullets": [
                  {
                        "title": {
                              "ru": "Низкий порог входа работает в обе стороны",
                              "en": "A low barrier cuts both ways"
                        },
                        "text": {
                              "ru": "Выпустить токен здесь стоит копейки, поэтому в сети огромное количество проектов-однодневок. Наличие токена в сети ничего не говорит о его качестве.",
                              "en": "Issuing a token here costs pennies, so the network is full of short-lived projects. A token existing on the network says nothing about its quality."
                        }
                  },
                  {
                        "title": {
                              "ru": "Одинаковый адрес в разных сетях",
                              "en": "The same address across networks"
                        },
                        "text": {
                              "ru": "У одного кошелька адрес в BNB Chain и в Ethereum совпадает. Это удобно и опасно одновременно: отправить не в ту сеть легко, а средства придут на «правильный» адрес в неправильной сети.",
                              "en": "One wallet has an identical address on BNB Chain and Ethereum. That is convenient and dangerous at once: sending to the wrong network is easy, and the funds land on the right address in the wrong network."
                        }
                  },
                  {
                        "title": {
                              "ru": "Комиссия платится в BNB",
                              "en": "Fees are paid in BNB"
                        },
                        "text": {
                              "ru": "Без небольшого запаса основной монеты перевести токены нельзя, как и в других сетях.",
                              "en": "Without a small reserve of the native coin you cannot move tokens, as on other networks."
                        }
                  },
                  {
                        "title": {
                              "ru": "Проверяйте адрес контракта, а не название",
                              "en": "Check the contract address, not the name"
                        },
                        "text": {
                              "ru": "Название и символ токена никем не защищены. Подделка популярной монеты с тем же тикером — самая частая схема в этой сети.",
                              "en": "A token's name and symbol are not protected by anything. Cloning a popular coin under the same ticker is the most common scheme on this network."
                        }
                  }
            ]
      },
      {
            "heading": {
                  "ru": "Как отличить сети при выводе",
                  "en": "Telling networks apart on withdrawal"
            },
            "paragraphs": [
                  {
                        "ru": "При выводе с биржи сеть выбирается отдельным пунктом, и биржа обычно показывает комиссию для каждой. Ошибка на этом шаге — самая дорогая из бытовых: средства уходят в сеть, где получатель не контролирует адрес, и вернуть их можно только через поддержку, если она вообще возьмётся.",
                        "en": "When withdrawing from an exchange the network is a separate field, and the exchange usually shows the fee for each. A mistake at this step is the costliest of everyday errors: funds go to a network where the recipient does not control the address, and recovery depends entirely on support agreeing to help."
                  },
                  {
                        "ru": "Простое правило: сеть выбирает получатель, а не отправитель. Прежде чем выводить, попросите у второй стороны не только адрес, но и название сети, и сверьте оба поля.",
                        "en": "A simple rule: the recipient chooses the network, not the sender. Before withdrawing, ask the other side for both the address and the network name, and check both fields."
                  }
            ]
      }
    ],
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
      "ru": "Кастодиальный кошелёк — счёт, где ключи держит компания: биржа, брокер или платёжный сервис. Вы владеете не монетами, а обязательством этой компании выдать их по запросу.",
      "en": "A custodial wallet is an account where a company holds the keys: an exchange, a broker, a payment service. What you own is not coins but that company's obligation to hand them over on request."
    },
    updated: '2026-08-11',
    related: [
      "non-custodial-wallet",
      "cex",
      "wallet",
      "exchange",
      "kyc",
      "private-key"
    ],
    sections: [
      {
        "heading": {
          "ru": "Как это работает",
          "en": "How it works"
        },
        "paragraphs": [
          {
            "ru": "Пополняя счёт, вы переводите монеты на адрес компании. Дальше ваш баланс — это строка в её базе данных. Внутренние переводы между пользователями вообще не попадают в блокчейн: меняются только записи.",
            "en": "Depositing sends coins to the company's address. From then on your balance is a row in its database. Internal transfers between users never touch the blockchain at all; only the records change."
          },
          {
            "ru": "Отсюда все удобства: мгновенные операции, отсутствие комиссий сети внутри платформы, восстановление доступа через поддержку, привычный вход по паролю. Ключи вам просто не нужны.",
            "en": "Hence the conveniences: instant operations, no network fees inside the platform, account recovery through support, a familiar password login. You simply do not need keys."
          },
          {
            "ru": "И отсюда же все риски. Счёт можно заморозить, вывод — ограничить, а при банкротстве вы становитесь одним из кредиторов. Крах FTX в 2022 году показал это в масштабе миллиардов долларов клиентских средств.",
            "en": "And hence all the risks. An account can be frozen, withdrawals limited, and in a bankruptcy you become one creditor among many. FTX's collapse in 2022 demonstrated this at the scale of billions in client funds."
          }
        ]
      },
      {
        "heading": {
          "ru": "Когда это разумно",
          "en": "When it makes sense"
        },
        "bullets": [
          {
            "title": {
              "ru": "Для торговли",
              "en": "For trading"
            },
            "text": {
              "ru": "Активные сделки требуют средств на бирже. Держать там торговый капитал нормально, весь запас — нет.",
              "en": "Active trading needs funds on the exchange. Keeping trading capital there is fine; keeping everything there is not."
            }
          },
          {
            "title": {
              "ru": "Для входа и выхода в фиат",
              "en": "For moving in and out of fiat"
            },
            "text": {
              "ru": "Покупка за евро и вывод на счёт возможны только через лицензированного посредника.",
              "en": "Buying with euros and withdrawing to a bank account only happens through a licensed intermediary."
            }
          },
          {
            "title": {
              "ru": "Для новичка на первое время",
              "en": "For a beginner at first"
            },
            "text": {
              "ru": "Потерять сид-фразу проще, чем пароль. Небольшая сумма на бирже безопаснее, чем крупная в кошельке без резервной копии.",
              "en": "Losing a seed phrase is easier than losing a password. A small amount on an exchange is safer than a large one in a wallet with no backup."
            }
          },
          {
            "title": {
              "ru": "Проверяйте, кто именно хранит",
              "en": "Check who actually holds it"
            },
            "text": {
              "ru": "Лицензия, отчётность о резервах и юрисдикция — единственное, что отличает надёжного кастодиана от следующего FTX.",
              "en": "A licence, proof-of-reserves reporting and jurisdiction are the only things separating a sound custodian from the next FTX."
            }
          }
        ]
      }
    ],
  },
  {
    slug: 'non-custodial-wallet',
    category: 'wallets',
    term: { ru: 'Некастодиальный кошелёк', en: 'Non-custodial wallet' },
    definition: {
      "ru": "Некастодиальный кошелёк — кошелёк, ключи от которого есть только у вас. Никто не может заморозить средства или отказать в переводе, и никто не поможет, если ключи потеряны или отданы мошеннику.",
      "en": "A non-custodial wallet is one whose keys only you hold. Nobody can freeze the funds or refuse a transfer, and nobody can help if the keys are lost or handed to a scammer."
    },
    updated: '2026-08-11',
    related: [
      "custodial-wallet",
      "wallet",
      "seed-phrase",
      "private-key",
      "cold-wallet",
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
            "ru": "Кошелёк генерирует сид-фразу прямо на вашем устройстве, и из неё выводятся все ключи. Разработчик приложения их не видит и не хранит — он вообще не знает, что вы существуете.",
            "en": "The wallet generates a seed phrase on your own device, and every key derives from it. The developer neither sees nor stores them; they do not know you exist."
          },
          {
            "ru": "Поэтому «забыли пароль» здесь не работает. Восстановление возможно только по сид-фразе, и любой, кто предлагает восстановить доступ иначе, обманывает.",
            "en": "So \"forgot password\" does not exist here. Recovery happens through the seed phrase alone, and anyone offering another route is lying."
          },
          {
            "ru": "Для DeFi это обязательное условие: подключиться к смарт-контракту, поставить ликвидность или взять заём можно только кошельком, который подписывает сам.",
            "en": "For DeFi it is a requirement: connecting to a contract, providing liquidity or taking a loan needs a wallet that signs for itself."
          }
        ]
      },
      {
        "heading": {
          "ru": "Что это значит на практике",
          "en": "What it means in practice"
        },
        "bullets": [
          {
            "title": {
              "ru": "Ответственность целиком ваша",
              "en": "The responsibility is entirely yours"
            },
            "text": {
              "ru": "Нет поддержки, нет отмены перевода, нет страховки. Это не недостаток, а условие, на которое вы соглашаетесь.",
              "en": "No support, no reversal, no insurance. That is not a flaw but the condition you accept."
            }
          },
          {
            "title": {
              "ru": "Резервная копия — не опция",
              "en": "The backup is not optional"
            },
            "text": {
              "ru": "Сид-фраза на бумаге в двух местах должна появиться в первые пять минут, а не когда-нибудь потом.",
              "en": "The phrase on paper in two places belongs in the first five minutes, not at some later point."
            }
          },
          {
            "title": {
              "ru": "Разрешения контрактам живут долго",
              "en": "Contract approvals live on"
            },
            "text": {
              "ru": "Подключаясь к DeFi, вы выдаёте право тратить токены. Оно действует, пока его не отозвать вручную.",
              "en": "Connecting to DeFi grants a right to spend tokens. It stays live until revoked by hand."
            }
          },
          {
            "title": {
              "ru": "Разделяйте суммы",
              "en": "Split the amounts"
            },
            "text": {
              "ru": "Основной запас на аппаратном кошельке, повседневные операции — с отдельного. Ошибка тогда стоит меньшего.",
              "en": "Main holdings on a hardware wallet, day-to-day activity from a separate one. A mistake then costs less."
            }
          }
        ]
      }
    ],
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
    updated: '2026-08-12',
    related: [
      "kyc",
      "exchange",
      "custodial-wallet",
      "p2p",
      "fiat",
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
                        "ru": "Противодействие отмыванию денег — набор правил, обязывающих финансовые компании проверять, откуда у клиента средства, и сообщать о подозрительных операциях. В криптовалютах эти требования распространяются на биржи, обменники и кастодиальные кошельки.",
                        "en": "Anti-money laundering is a set of rules requiring financial companies to check where a client's funds come from and to report suspicious activity. In crypto these requirements apply to exchanges, brokers and custodial wallets."
                  },
                  {
                        "ru": "В Европейском союзе основу задают директивы AMLD и регламент MiCA, который с 2024 года распространил единые правила на всех поставщиков криптоуслуг. Отдельное требование — «правило перевода»: при переводе между площадками должны передаваться данные отправителя и получателя.",
                        "en": "In the European Union the framework comes from the AMLD directives and the MiCA regulation, which since 2024 has extended unified rules to all crypto service providers. A separate requirement is the travel rule: transfers between platforms must carry sender and recipient data."
                  },
                  {
                        "ru": "Проверку часто путают с KYC, хотя это разные вещи. KYC — установление личности при регистрации, разовая процедура. AML — постоянное наблюдение за операциями после неё: анализ сумм, частоты, происхождения средств.",
                        "en": "The checks are often confused with KYC, though they are different. KYC is identity verification at sign-up, a one-off procedure. AML is ongoing monitoring of activity afterwards: analysis of amounts, frequency and the origin of funds."
                  }
            ]
      },
      {
            "heading": {
                  "ru": "Что именно проверяют",
                  "en": "What is actually checked"
            },
            "bullets": [
                  {
                        "title": {
                              "ru": "Происхождение средств",
                              "en": "The source of funds"
                        },
                        "text": {
                              "ru": "Крупное пополнение может потребовать документов: выписки, договора продажи, справки о доходах. Это стандартная процедура, а не признак подозрений.",
                              "en": "A large deposit may require documents: statements, a sale agreement, proof of income. This is standard procedure rather than a sign of suspicion."
                        }
                  },
                  {
                        "title": {
                              "ru": "История адреса в блокчейне",
                              "en": "The wallet's on-chain history"
                        },
                        "text": {
                              "ru": "Специальные сервисы оценивают, проходили ли средства через миксеры, санкционные адреса или взломанные площадки. Оценка вероятностная, и ложные срабатывания случаются.",
                              "en": "Specialist services assess whether funds passed through mixers, sanctioned addresses or hacked platforms. The assessment is probabilistic and false positives do occur."
                        }
                  },
                  {
                        "title": {
                              "ru": "Нетипичное поведение",
                              "en": "Unusual behaviour"
                        },
                        "text": {
                              "ru": "Резкая смена схемы операций, дробление сумм, переводы сразу после вывода — всё это поводы для дополнительных вопросов.",
                              "en": "An abrupt change in activity, splitting amounts, transfers immediately after withdrawal — all of these prompt further questions."
                        }
                  },
                  {
                        "title": {
                              "ru": "Связь с санкционными списками",
                              "en": "Links to sanctions lists"
                        },
                        "text": {
                              "ru": "Проверка идёт и по личности клиента, и по адресам, с которыми он взаимодействует.",
                              "en": "Screening covers both the client's identity and the addresses they interact with."
                        }
                  }
            ]
      },
      {
            "heading": {
                  "ru": "На что обратить внимание",
                  "en": "What to watch for"
            },
            "paragraphs": [
                  {
                        "ru": "Практический риск для обычного пользователя — не штраф, а заморозка. Если средства пришли с адреса с плохой историей, площадка может ограничить вывод до выяснения, и разбирательство занимает недели. Покупка криптовалюты у случайного продавца с рук — самый частый способ получить такую историю, ничего не нарушив самому.",
                        "en": "The practical risk for an ordinary user is not a fine but a freeze. If funds arrive from an address with a poor history, a platform may restrict withdrawal pending review, and that takes weeks. Buying crypto from a random private seller is the most common way to acquire such a history without doing anything wrong yourself."
                  },
                  {
                        "ru": "Снизить риск помогает простое правило: пополнять счёт с площадок, которые сами проходят проверку, и хранить подтверждения покупок. Выписка о том, где и когда были куплены монеты, снимает большинство вопросов за один раз.",
                        "en": "A simple rule reduces the risk: fund accounts from platforms that are themselves regulated, and keep purchase records. A statement showing where and when coins were bought settles most questions in one go."
                  }
            ]
      }
    ],
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
      "ru": "ICO — продажа токенов проекта до запуска продукта, чтобы собрать деньги на разработку. Модель расцвела в 2017 году и почти исчезла после того, как регуляторы признали большинство таких продаж выпуском ценных бумаг.",
      "en": "An ICO is a sale of a project's tokens before the product exists, to raise money for development. The model boomed in 2017 and largely vanished after regulators judged most such sales to be securities offerings."
    },
    updated: '2026-08-11',
    related: [
      "ido",
      "tokenomics",
      "whitepaper",
      "rug-pull",
      "altcoin",
      "airdrop"
    ],
    sections: [
      {
        "heading": {
          "ru": "Как это работало",
          "en": "How it worked"
        },
        "paragraphs": [
          {
            "ru": "Команда публиковала уайтпейпер, открывала кошелёк и продавала токены за биткоин или эфир. Ни лицензии, ни проспекта, ни проверки инвесторов — достаточно было сайта и смарт-контракта.",
            "en": "A team published a whitepaper, opened a wallet and sold tokens for bitcoin or ether. No licence, no prospectus, no investor checks: a website and a smart contract were enough."
          },
          {
            "ru": "В 2017 году так собрали миллиарды долларов. Значительная часть проектов не выпустила ничего, а исследования того периода показывали, что больше половины ICO прекращали существование в течение нескольких месяцев после сбора.",
            "en": "Billions were raised this way in 2017. A large share of the projects shipped nothing, and studies from the period found that more than half of ICOs ceased to exist within months of the raise."
          },
          {
            "ru": "Дальше вмешались регуляторы. Продажа токена с обещанием прибыли от усилий команды в большинстве юрисдикций подпадает под законы о ценных бумагах, и модель сменилась на продажи через биржи и площадки запуска.",
            "en": "Then regulators intervened. Selling a token on the promise of profit from a team's efforts falls under securities law in most jurisdictions, and the model shifted to sales through exchanges and launchpads."
          }
        ]
      },
      {
        "heading": {
          "ru": "Что осталось от модели",
          "en": "What is left of the model"
        },
        "bullets": [
          {
            "title": {
              "ru": "IDO и площадки запуска",
              "en": "IDOs and launchpads"
            },
            "text": {
              "ru": "Продажа идёт через DEX или биржевую платформу, которая хотя бы формально проверяет проект.",
              "en": "The sale runs through a DEX or an exchange platform that at least nominally vets the project."
            }
          },
          {
            "title": {
              "ru": "Ранние раунды закрыты",
              "en": "Early rounds are private"
            },
            "text": {
              "ru": "Лучшие условия достаются фондам до публичной продажи. Розничный покупатель почти всегда входит последним и дороже.",
              "en": "The best terms go to funds before any public sale. Retail almost always enters last and highest."
            }
          },
          {
            "title": {
              "ru": "Эйрдропы вместо продаж",
              "en": "Airdrops instead of sales"
            },
            "text": {
              "ru": "Раздать токены за пользование продуктом юридически проще, чем продать их. Отсюда нынешняя мода на раздачи.",
              "en": "Giving tokens away for using a product is legally simpler than selling them. Hence the current fashion for airdrops."
            }
          },
          {
            "title": {
              "ru": "Признаки не изменились",
              "en": "The warning signs have not changed"
            },
            "text": {
              "ru": "Обещание доходности, анонимная команда, отсутствие продукта и график разблокировок в полгода — те же, что в 2017-м.",
              "en": "A promised return, an anonymous team, no product, and a six-month unlock schedule are the same signs as in 2017."
            }
          }
        ]
      }
    ],
  },
  {
    slug: 'ido',
    category: 'tokens',
    term: { ru: 'IDO', en: 'IDO' },
    definition: {
      ru: 'Initial DEX Offering — первичное размещение токена сразу на децентрализованной бирже, без участия централизованного посредника.',
      en: 'Initial DEX Offering — a token launch that takes place directly on a decentralized exchange, without a centralized intermediary.',
    },
    updated: '2026-08-12',
    related: [
      "ico",
      "defi",
      "liquidity-pool",
      "smart-contract",
      "exchange",
      "fomo"
    ],
    sections: [
      {
            "heading": {
                  "ru": "Как это работает",
                  "en": "How it works"
            },
            "paragraphs": [
                  {
                        "ru": "IDO — первичное размещение токена сразу на децентрализованной бирже. Проект создаёт пул ликвидности, вносит в него свои токены и некоторую сумму в стейблкоинах или эфире, после чего торговля открывается автоматически для всех.",
                        "en": "An IDO is a token's first offering directly on a decentralised exchange. The project creates a liquidity pool, deposits its tokens along with some stablecoins or ether, and trading opens automatically for everyone."
                  },
                  {
                        "ru": "Формат появился в 2020 году как ответ на две проблемы предшественников. У ICO деньги собирались до листинга, и проект мог исчезнуть с ними. У IEO всё зависело от решения одной биржи. В IDO торговля начинается сразу, а ликвидность видна в блокчейне.",
                        "en": "The format emerged in 2020 as an answer to two problems with its predecessors. In an ICO money was raised before listing and a project could vanish with it. In an IEO everything depended on one exchange's decision. In an IDO trading starts immediately and liquidity is visible on-chain."
                  },
                  {
                        "ru": "Обратная сторона немедленного старта — отсутствие всякого отбора. Разместить токен может кто угодно, никаких проверок нет, и ответственность за оценку проекта целиком лежит на покупателе.",
                        "en": "The flip side of an immediate start is the absence of any filter. Anyone can list a token, no checks apply, and the entire burden of assessing a project falls on the buyer."
                  }
            ]
      },
      {
            "heading": {
                  "ru": "Что происходит в первые минуты",
                  "en": "What happens in the first minutes"
            },
            "example": {
                  "setup": {
                        "ru": "Токен выходит в пул на 100 000 долларов ликвидности. Смотрим типичный ход первого часа.",
                        "en": "A token launches into a pool with $100,000 of liquidity. Here is a typical first hour."
                  },
                  "rows": [
                        {
                              "label": {
                                    "ru": "Стартовая цена",
                                    "en": "Starting price"
                              },
                              "value": {
                                    "ru": "0,10 доллара",
                                    "en": "$0.10"
                              }
                        },
                        {
                              "label": {
                                    "ru": "Пик через 4 минуты",
                                    "en": "Peak after 4 minutes"
                              },
                              "value": {
                                    "ru": "0,85 доллара",
                                    "en": "$0.85"
                              }
                        },
                        {
                              "label": {
                                    "ru": "Цена через час",
                                    "en": "Price after an hour"
                              },
                              "value": {
                                    "ru": "0,18 доллара",
                                    "en": "$0.18"
                              }
                        },
                        {
                              "label": {
                                    "ru": "Доля покупок ботами в первом блоке",
                                    "en": "Share of first-block buys by bots"
                              },
                              "value": {
                                    "ru": "до 80%",
                                    "en": "up to 80%"
                              }
                        }
                  ],
                  "outcome": {
                        "ru": "Тот, кто увидел рост и купил на пике, к концу часа потерял около 80%. Автоматические программы получают доступ к пулу в том же блоке, где он создан, поэтому обычный человек физически не может оказаться первым — он покупает уже у ботов.",
                        "en": "Whoever saw the rally and bought at the peak was down about 80% within the hour. Automated programs reach the pool in the same block it is created, so an ordinary person physically cannot be first — they are buying from the bots."
                  }
            }
      },
      {
            "heading": {
                  "ru": "На что обратить внимание",
                  "en": "What to watch for"
            },
            "bullets": [
                  {
                        "title": {
                              "ru": "Заблокирована ли ликвидность",
                              "en": "Is liquidity locked"
                        },
                        "text": {
                              "ru": "Если создатель может забрать ликвидность из пула, он способен обнулить цену одной операцией. Блокировка на срок проверяется в блокчейне и должна быть указана в документации.",
                              "en": "If the creator can pull liquidity out of the pool they can zero the price in one transaction. A time lock is verifiable on-chain and should be stated in the documentation."
                        }
                  },
                  {
                        "title": {
                              "ru": "Кому принадлежит основная доля выпуска",
                              "en": "Who holds most of the supply"
                        },
                        "text": {
                              "ru": "Несколько кошельков с большей частью токенов — это будущее давление на цену. Распределение видно в эксплорере до покупки.",
                              "en": "A handful of wallets holding most of the tokens is future selling pressure. The distribution is visible in an explorer before you buy."
                        }
                  },
                  {
                        "title": {
                              "ru": "Есть ли у контракта особые права",
                              "en": "Does the contract carry special powers"
                        },
                        "text": {
                              "ru": "Возможность выпускать новые токены, менять комиссию или запрещать продажу отдельным адресам — всё это записано в коде и проверяется до сделки.",
                              "en": "The ability to mint new tokens, change fees or block particular addresses from selling is written into the code and can be checked before trading."
                        }
                  },
                  {
                        "title": {
                              "ru": "Скорость решает не в вашу пользу",
                              "en": "Speed does not work in your favour"
                        },
                        "text": {
                              "ru": "Соревноваться с автоматическими программами за первые секунды бессмысленно. Если стратегия строится на том, чтобы успеть, — это не стратегия.",
                              "en": "Competing with automated programs for the first seconds is pointless. If a strategy depends on being fast enough, it is not a strategy."
                        }
                  }
            ]
      }
    ],
  },
  {
    slug: 'whitepaper',
    category: 'basics',
    term: { ru: 'Whitepaper (уайтпейпер)', en: 'Whitepaper' },
    definition: {
      "ru": "Уайтпейпер — документ, в котором проект описывает, какую задачу решает, как устроен технически и как распределены токены. Это первое, что стоит прочитать, и первое, что подделывают.",
      "en": "A whitepaper is the document in which a project states the problem it solves, how it works technically and how the tokens are distributed. It is the first thing worth reading and the first thing that gets faked."
    },
    updated: '2026-08-11',
    related: [
      "tokenomics",
      "ico",
      "rug-pull",
      "dao",
      "smart-contract",
      "altcoin"
    ],
    sections: [
      {
        "heading": {
          "ru": "Откуда это взялось",
          "en": "Where it comes from"
        },
        "paragraphs": [
          {
            "ru": "Жанр задал документ Сатоши Накамото 2008 года: девять страниц, описывающих механику биткоина без обещаний доходности и без слова о цене. Он читается за полчаса и до сих пор остаётся образцом того, как это делается.",
            "en": "The genre was set by Satoshi Nakamoto's 2008 document: nine pages describing bitcoin's mechanics with no promises of returns and not a word about price. It reads in half an hour and remains the model for how this is done."
          },
          {
            "ru": "К 2017 году форма выродилась. Уайтпейперы превратились в маркетинговые брошюры с дорожными картами, командами из стоковых фотографий и разделами о «революции в индустрии» без единой технической детали.",
            "en": "By 2017 the form had degenerated. Whitepapers became marketing brochures with roadmaps, teams made of stock photography, and sections about revolutionising an industry without a single technical detail."
          },
          {
            "ru": "Поэтому ценность документа сегодня не в том, что он есть, а в том, что именно в нём написано и можно ли это проверить.",
            "en": "So the value of the document today is not that it exists but what is actually in it and whether any of it can be checked."
          }
        ]
      },
      {
        "heading": {
          "ru": "Что искать при чтении",
          "en": "What to look for"
        },
        "bullets": [
          {
            "title": {
              "ru": "Задача до решения",
              "en": "The problem before the solution"
            },
            "text": {
              "ru": "Хороший документ объясняет, почему существующие способы не годятся. Если этого нет, блокчейн здесь чаще всего лишний.",
              "en": "A good document explains why existing approaches fail. Without that, the blockchain is usually unnecessary here."
            }
          },
          {
            "title": {
              "ru": "Распределение токенов в цифрах",
              "en": "Token distribution in numbers"
            },
            "text": {
              "ru": "Доли команды и инвесторов, график разблокировок. Отсутствие этого раздела — само по себе ответ.",
              "en": "Team and investor shares, the unlock schedule. The absence of that section is itself an answer."
            }
          },
          {
            "title": {
              "ru": "Зачем нужен токен",
              "en": "What the token is for"
            },
            "text": {
              "ru": "Если продукт работал бы и без токена, токен выпущен ради сбора денег, а не ради механики.",
              "en": "If the product would work without the token, the token exists to raise money rather than to make anything work."
            }
          },
          {
            "title": {
              "ru": "Проверяемые заявления",
              "en": "Checkable claims"
            },
            "text": {
              "ru": "Ссылки на код, тесты, названия партнёров, которые можно спросить. Обещания «в будущем» ничего не стоят.",
              "en": "Links to code, benchmarks, named partners you can ask. Promises about the future cost nothing."
            }
          },
          {
            "title": {
              "ru": "Тон",
              "en": "The tone"
            },
            "text": {
              "ru": "Прогнозы цены, гарантии доходности и слово «революция» в техническом документе — признак не той аудитории.",
              "en": "Price forecasts, guaranteed returns and the word \"revolutionary\" in a technical document signal the wrong audience."
            }
          }
        ]
      }
    ],
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
      "ru": "Рыночный ордер — заявка купить или продать немедленно по лучшим доступным ценам. Исполняется почти всегда и сразу, но цена определяется стаканом, а не вами: на тонкой паре она окажется хуже той, что была на экране.",
      "en": "A market order buys or sells immediately at the best available prices. It almost always fills and fills at once, but the price comes from the book rather than from you: on a thin pair it lands worse than the screen showed."
    },
    updated: '2026-08-11',
    related: [
      "limit-order",
      "order-book",
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
            "ru": "Ордер идёт по стакану сверху вниз, забирая встречные заявки подряд, пока не наберёт нужный объём. Если на лучшей цене стоит меньше, чем вам нужно, остаток добирается по ценам хуже — и вашей реальной ценой становится средняя.",
            "en": "The order walks the book, taking counter-offers in turn until the size is filled. If the best price holds less than you need, the remainder fills at worse ones, and your real price is the average."
          },
          {
            "ru": "Отсюда следует, что стоимость рыночного ордера зависит не от объёма самого по себе, а от объёма относительно глубины стакана. Одна и та же сумма на биткоине и на мелком альткоине — совершенно разные истории.",
            "en": "So the cost of a market order depends not on size in itself but on size relative to the book's depth. The same amount on bitcoin and on a small altcoin are entirely different stories."
          },
          {
            "ru": "Биржи обычно берут за рыночные ордера повышенную комиссию: они забирают ликвидность из стакана, а не добавляют её.",
            "en": "Exchanges usually charge more for market orders: they take liquidity out of the book rather than adding it."
          }
        ]
      },
      {
        "heading": {
          "ru": "Когда он уместен",
          "en": "When it is the right tool"
        },
        "bullets": [
          {
            "title": {
              "ru": "Когда важнее исполниться, чем цена",
              "en": "When filling matters more than price"
            },
            "text": {
              "ru": "Выход из позиции на падении или срочная покупка — там, где отказ от сделки дороже проскальзывания.",
              "en": "Exiting into a fall or an urgent purchase: cases where not trading costs more than the slippage."
            }
          },
          {
            "title": {
              "ru": "На ликвидной паре и небольшой сумме",
              "en": "On a liquid pair in modest size"
            },
            "text": {
              "ru": "При обмене на пару сотен долларов в BTC/USDT разница с лимитным ордером измеряется центами.",
              "en": "Swapping a couple of hundred dollars in BTC/USDT, the difference from a limit order is measured in cents."
            }
          },
          {
            "title": {
              "ru": "Не для тонких пар",
              "en": "Not for thin pairs"
            },
            "text": {
              "ru": "На малоликвидном альткоине рыночный ордер способен увести цену на проценты одной вашей сделкой.",
              "en": "On an illiquid altcoin a market order can move the price by whole percent with your trade alone."
            }
          },
          {
            "title": {
              "ru": "Смотрите стакан до отправки",
              "en": "Read the book before sending"
            },
            "text": {
              "ru": "Глубина видна заранее. Оценить проскальзывание можно за секунды, и это дешевле, чем узнать его постфактум.",
              "en": "Depth is visible in advance. Estimating slippage takes seconds and costs less than discovering it afterwards."
            }
          }
        ]
      }
    ],
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
    updated: '2026-08-12',
    related: [
      "mining",
      "hash",
      "proof-of-work",
      "blockchain",
      "transaction",
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
                        "ru": "Nonce — число, которое подбирают, чтобы результат вычисления удовлетворил заданному условию. Слово составлено из английского «number used once» — число, используемое один раз.",
                        "en": "A nonce is a number picked so that the result of a computation satisfies a given condition. The word comes from “number used once”."
                  },
                  {
                        "ru": "В майнинге это единственная часть блока, которую майнер может свободно менять. Он подставляет число, считает хеш блока и проверяет, оказался ли результат меньше целевого значения. Не подошло — прибавляет единицу и считает заново.",
                        "en": "In mining it is the only part of a block a miner may freely change. They insert a number, compute the block's hash and check whether the result came out below a target value. If not, they add one and compute again."
                  },
                  {
                        "ru": "Именно этот перебор и есть работа в «доказательстве работы». Найти подходящее число можно только слепым перебором, а проверить чужую находку — одной операцией. На этой асимметрии держится вся защита сети.",
                        "en": "This brute-force search is the work in proof of work. A valid number can only be found by blind search, while verifying someone else's find takes a single operation. The network's entire security rests on that asymmetry."
                  }
            ]
      },
      {
            "heading": {
                  "ru": "Масштаб перебора",
                  "en": "The scale of the search"
            },
            "example": {
                  "setup": {
                        "ru": "Поле nonce в биткоине занимает 32 бита. Считаем, на сколько его хватает современному оборудованию.",
                        "en": "Bitcoin's nonce field is 32 bits wide. Here is how far that goes on modern hardware."
                  },
                  "rows": [
                        {
                              "label": {
                                    "ru": "Всего вариантов в поле",
                                    "en": "Total values in the field"
                              },
                              "value": {
                                    "ru": "около 4,3 миллиарда",
                                    "en": "about 4.3 billion"
                              }
                        },
                        {
                              "label": {
                                    "ru": "Скорость одного устройства",
                                    "en": "Speed of one machine"
                              },
                              "value": {
                                    "ru": "до 200 триллионов хешей в секунду",
                                    "en": "up to 200 trillion hashes per second"
                              }
                        },
                        {
                              "label": {
                                    "ru": "Время на весь перебор",
                                    "en": "Time to exhaust the field"
                              },
                              "value": {
                                    "ru": "доли секунды",
                                    "en": "a fraction of a second"
                              }
                        },
                        {
                              "label": {
                                    "ru": "Целевое время блока",
                                    "en": "Target block interval"
                              },
                              "value": {
                                    "ru": "10 минут",
                                    "en": "10 minutes"
                              }
                        }
                  ],
                  "outcome": {
                        "ru": "Поля давно не хватает: устройство перебирает все четыре миллиарда вариантов быстрее, чем за секунду. Поэтому майнеры меняют и другие части блока — метку времени и служебную транзакцию, — чтобы получить новый набор вариантов для перебора.",
                        "en": "The field has long been too small: a machine exhausts all four billion values in under a second. So miners also vary other parts of the block — the timestamp and a service transaction — to obtain a fresh set of values to search."
                  }
            }
      },
      {
            "heading": {
                  "ru": "Где ещё встречается это слово",
                  "en": "Where else the word appears"
            },
            "bullets": [
                  {
                        "title": {
                              "ru": "Счётчик транзакций в Ethereum",
                              "en": "The transaction counter in Ethereum"
                        },
                        "text": {
                              "ru": "Здесь nonce означает совсем другое: порядковый номер операции с конкретного адреса. Он не даёт отправить один и тот же перевод дважды.",
                              "en": "Here nonce means something else entirely: the sequence number of an operation from a given address. It prevents the same transfer being sent twice."
                        }
                  },
                  {
                        "title": {
                              "ru": "Зависшая транзакция",
                              "en": "A stuck transaction"
                        },
                        "text": {
                              "ru": "Если операция с меньшим номером не подтверждена, все последующие ждут её. Отсюда приём «заменить транзакцию с тем же номером и большей комиссией».",
                              "en": "If an operation with a lower number is unconfirmed, every later one waits for it. Hence the trick of replacing a transaction with the same number and a higher fee."
                        }
                  },
                  {
                        "title": {
                              "ru": "Одноразовые коды в криптографии",
                              "en": "One-time values in cryptography"
                        },
                        "text": {
                              "ru": "В шифровании таким числом гарантируют, что два одинаковых сообщения дадут разный результат.",
                              "en": "In encryption such a value guarantees that two identical messages produce different output."
                        }
                  }
            ]
      }
    ],
  },
  {
    slug: 'block-explorer',
    category: 'tech',
    term: { ru: 'Блокчейн-эксплорер', en: 'Block explorer' },
    definition: {
      "ru": "Блокчейн-эксплорер — сайт, через который можно посмотреть любую транзакцию, адрес или блок в сети. Он не требует регистрации и показывает те же данные, что видит любой узел: блокчейн публичен целиком.",
      "en": "A block explorer is a website for looking up any transaction, address or block on a network. It needs no account and shows the same data any node sees: the blockchain is public in full."
    },
    updated: '2026-08-11',
    related: [
      "transaction",
      "hash",
      "node",
      "blockchain",
      "public-key",
      "smart-contract"
    ],
    sections: [
      {
        "heading": {
          "ru": "Что через него можно проверить",
          "en": "What you can check with it"
        },
        "paragraphs": [
          {
            "ru": "Самое частое — судьба перевода. По хешу транзакции видно, ушла ли она из мемпула, в каком блоке оказалась и сколько получила подтверждений. Это отвечает на вопрос «деньги пропали?» быстрее любой поддержки.",
            "en": "Most often, the fate of a transfer. A transaction hash shows whether it left the mempool, which block it landed in and how many confirmations it has. That answers \"where did my money go\" faster than any support desk."
          },
          {
            "ru": "Дальше — адреса. Виден баланс, вся история операций и то, с какими адресами они шли. Именно поэтому криптовалюты не анонимны: связав адрес с человеком однажды, аналитик видит и всё остальное.",
            "en": "Then addresses. The balance, the full transaction history and which addresses were involved. This is why crypto is not anonymous: link an address to a person once and an analyst sees all the rest."
          },
          {
            "ru": "И контракты. Эксплорер показывает код токена, число держателей и распределение по крупнейшим кошелькам. Проверить токеномику проекта здесь можно за пару минут и без доверия к его сайту.",
            "en": "And contracts. An explorer shows a token's code, its holder count and the distribution across the largest wallets. A project's tokenomics can be checked here in a couple of minutes without trusting its own website."
          }
        ]
      },
      {
        "heading": {
          "ru": "Как им пользоваться",
          "en": "How to use it"
        },
        "bullets": [
          {
            "title": {
              "ru": "У каждой сети свой",
              "en": "Each network has its own"
            },
            "text": {
              "ru": "Хеш из Ethereum не найдётся в эксплорере биткоина. Сначала определитесь, в какой сети шёл перевод.",
              "en": "An Ethereum hash will not be found in a bitcoin explorer. Establish which network the transfer used first."
            }
          },
          {
            "title": {
              "ru": "Проверяйте адрес контракта",
              "en": "Verify contract addresses"
            },
            "text": {
              "ru": "Перед покупкой незнакомого токена сверьте адрес с официальным источником проекта — подделок с тем же именем много.",
              "en": "Before buying an unfamiliar token, match the address against the project's official source; clones with the same name are common."
            }
          },
          {
            "title": {
              "ru": "Смотрите крупнейших держателей",
              "en": "Read the top holders"
            },
            "text": {
              "ru": "Несколько кошельков с половиной запаса видно сразу, и это говорит о риске больше, чем весь уайтпейпер.",
              "en": "A handful of wallets holding half the supply is visible immediately, and says more about risk than the whole whitepaper."
            }
          },
          {
            "title": {
              "ru": "Комиссию видно заранее",
              "en": "Fees are visible in advance"
            },
            "text": {
              "ru": "Эксплореры показывают текущую загрузку сети — по ней понятно, стоит ли отправлять перевод прямо сейчас.",
              "en": "Explorers show current network load, which tells you whether now is a good moment to send."
            }
          }
        ]
      }
    ],
  },
  {
    slug: 'satoshi',
    category: 'basics',
    term: { ru: 'Сатоши', en: 'Satoshi' },
    definition: {
      ru: 'Наименьшая единица биткоина, равная одной стомиллионной (0.00000001) BTC. Названа в честь создателя биткоина.',
      en: 'The smallest unit of Bitcoin, equal to one hundred-millionth (0.00000001) of a BTC. Named after Bitcoin\'s creator.',
    },
    updated: '2026-08-12',
    related: [
      "bitcoin",
      "fiat",
      "gwei",
      "transaction",
      "exchange",
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
                        "ru": "Сатоши — самая мелкая часть биткоина, одна стомиллионная. В одном биткоине сто миллионов сатоши, и дробить монету мельче протокол не умеет.",
                        "en": "A satoshi is the smallest part of a bitcoin, one hundred-millionth of it. One bitcoin holds a hundred million satoshi, and the protocol cannot divide a coin any further."
                  },
                  {
                        "ru": "Единица названа в честь Сатоши Накамото — псевдонима автора биткоина, опубликовавшего описание системы в 2008 году. Личность за этим именем не установлена до сих пор.",
                        "en": "The unit is named after Satoshi Nakamoto, the pseudonym of bitcoin's author, who published the system's description in 2008. The identity behind the name has never been established."
                  },
                  {
                        "ru": "Такое дробление заложено с самого начала не ради удобства, а по необходимости: если монета дорожает в тысячи раз, расплачиваться целыми биткоинами становится невозможно.",
                        "en": "The subdivision was built in from the start out of necessity rather than convenience: if a coin appreciates a thousandfold, paying in whole bitcoins becomes impossible."
                  }
            ]
      },
      {
            "heading": {
                  "ru": "Сколько это в деньгах",
                  "en": "What it is worth"
            },
            "example": {
                  "setup": {
                        "ru": "Пересчитаем при цене биткоина 60 000 долларов.",
                        "en": "Converting at a bitcoin price of $60,000."
                  },
                  "rows": [
                        {
                              "label": {
                                    "ru": "1 сатоши",
                                    "en": "1 satoshi"
                              },
                              "value": {
                                    "ru": "0,0006 доллара",
                                    "en": "$0.0006"
                              }
                        },
                        {
                              "label": {
                                    "ru": "1 000 сатоши",
                                    "en": "1,000 satoshi"
                              },
                              "value": {
                                    "ru": "0,60 доллара",
                                    "en": "$0.60"
                              }
                        },
                        {
                              "label": {
                                    "ru": "100 000 сатоши",
                                    "en": "100,000 satoshi"
                              },
                              "value": {
                                    "ru": "60 долларов",
                                    "en": "$60"
                              }
                        },
                        {
                              "label": {
                                    "ru": "1 000 000 сатоши",
                                    "en": "1,000,000 satoshi"
                              },
                              "value": {
                                    "ru": "600 долларов",
                                    "en": "$600"
                              }
                        }
                  ],
                  "outcome": {
                        "ru": "Отсюда видно, зачем нужна единица: покупка за пять долларов — это примерно 8 300 сатоши, и такую сумму гораздо проще держать в голове, чем 0,000083 BTC.",
                        "en": "This shows why the unit exists: a five-dollar purchase is roughly 8,300 satoshi, and that is far easier to hold in your head than 0.000083 BTC."
                  }
            }
      },
      {
            "heading": {
                  "ru": "На что обратить внимание",
                  "en": "What to watch for"
            },
            "bullets": [
                  {
                        "title": {
                              "ru": "Комиссия сети считается в сатоши за байт",
                              "en": "Network fees are quoted in satoshi per byte"
                        },
                        "text": {
                              "ru": "Кошелёк показывает не общую комиссию, а ставку за единицу размера транзакции. Итог зависит от того, из скольких частей собран ваш перевод.",
                              "en": "A wallet shows a rate per unit of transaction size rather than a total fee. The final amount depends on how many pieces your transfer is assembled from."
                        }
                  },
                  {
                        "title": {
                              "ru": "«Стакать сатоши» — не то же, что инвестировать",
                              "en": "“Stacking sats” is not the same as investing"
                        },
                        "text": {
                              "ru": "Выражение означает регулярную покупку небольших сумм. Это способ распределить вход по времени, а не гарантия результата.",
                              "en": "The phrase means buying small amounts regularly. It is a way to spread entry over time, not a guarantee of an outcome."
                        }
                  },
                  {
                        "title": {
                              "ru": "Мельче сатоши перевести нельзя",
                              "en": "Nothing smaller than a satoshi can be sent"
                        },
                        "text": {
                              "ru": "В сети второго уровня Lightning расчёты идут в тысячных долях сатоши, но в основной сети такие суммы существовать не могут.",
                              "en": "The Lightning second layer settles in thousandths of a satoshi, but such amounts cannot exist on the main network."
                        }
                  }
            ]
      }
    ],
  },
  {
    slug: 'fiat',
    category: 'basics',
    term: { ru: 'Фиат', en: 'Fiat' },
    definition: {
      ru: 'Традиционная государственная валюта, не обеспеченная физическим товаром, например доллар, евро или гривна — в противоположность криптовалюте.',
      en: 'Traditional government-issued currency not backed by a physical commodity, such as the US dollar, euro, or Czech koruna — as opposed to cryptocurrency.',
    },
    updated: '2026-08-12',
    related: [
      "bitcoin",
      "stablecoin",
      "exchange",
      "custodial-wallet",
      "satoshi",
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
                        "ru": "Фиатными называют обычные государственные деньги — доллар, евро, злотый. Слово происходит от латинского fiat, «да будет»: ценность таких денег держится не на золоте или другом обеспечении, а на решении государства и доверии к нему.",
                        "en": "Fiat money is ordinary state-issued currency — the dollar, the euro, the zloty. The word comes from the Latin fiat, “let it be”: the value of such money rests not on gold or another backing but on a state's decision and the trust placed in it."
                  },
                  {
                        "ru": "Система в нынешнем виде существует с 1971 года, когда США окончательно отвязали доллар от золота. До этого количество денег было формально ограничено запасами металла.",
                        "en": "The system in its present form dates from 1971, when the United States finally severed the dollar's link to gold. Before that the quantity of money was formally limited by metal reserves."
                  },
                  {
                        "ru": "Ключевое отличие от криптовалют — в том, кто определяет выпуск. Объём фиатных денег устанавливает центральный банк исходя из экономической политики, тогда как выпуск биткоина задан кодом и не меняется по чьему-либо решению.",
                        "en": "The key difference from cryptocurrencies is who determines issuance. The quantity of fiat money is set by a central bank according to economic policy, whereas bitcoin's issuance is fixed in code and does not change at anyone's decision."
                  }
            ]
      },
      {
            "heading": {
                  "ru": "Что это значит на практике",
                  "en": "What this means in practice"
            },
            "bullets": [
                  {
                        "title": {
                              "ru": "Ввод и вывод — самое узкое место",
                              "en": "On-ramps and off-ramps are the bottleneck"
                        },
                        "text": {
                              "ru": "Обмен между фиатом и криптовалютой проходит через регулируемых посредников, поэтому именно здесь требуют документы и здесь чаще всего возникают задержки.",
                              "en": "Exchanging between fiat and crypto runs through regulated intermediaries, so this is where documents are demanded and where delays most often occur."
                        }
                  },
                  {
                        "title": {
                              "ru": "Стейблкоины — это фиат в другой оболочке",
                              "en": "Stablecoins are fiat in another wrapper"
                        },
                        "text": {
                              "ru": "Монета, привязанная к доллару, наследует и его свойства, и решения его эмитента. Это не выход из фиатной системы, а другой способ в ней находиться.",
                              "en": "A coin pegged to the dollar inherits both its properties and its issuer's decisions. It is not an exit from the fiat system but another way of being inside it."
                        }
                  },
                  {
                        "title": {
                              "ru": "Инфляция — свойство системы, а не сбой",
                              "en": "Inflation is a property of the system, not a fault"
                        },
                        "text": {
                              "ru": "Постепенное обесценивание заложено в целевые показатели центральных банков. Обычно целью считают около 2% в год.",
                              "en": "Gradual loss of value is built into central bank targets, usually set at around 2% a year."
                        }
                  }
            ]
      },
      {
            "heading": {
                  "ru": "Сколько стоит время",
                  "en": "What time costs"
            },
            "example": {
                  "setup": {
                        "ru": "Что происходит с покупательной способностью 10 000 евро при инфляции 2% в год.",
                        "en": "What happens to the purchasing power of €10,000 at 2% annual inflation."
                  },
                  "rows": [
                        {
                              "label": {
                                    "ru": "Через 5 лет",
                                    "en": "After 5 years"
                              },
                              "value": {
                                    "ru": "9 057 евро",
                                    "en": "€9,057"
                              }
                        },
                        {
                              "label": {
                                    "ru": "Через 10 лет",
                                    "en": "After 10 years"
                              },
                              "value": {
                                    "ru": "8 203 евро",
                                    "en": "€8,203"
                              }
                        },
                        {
                              "label": {
                                    "ru": "Через 20 лет",
                                    "en": "After 20 years"
                              },
                              "value": {
                                    "ru": "6 730 евро",
                                    "en": "€6,730"
                              }
                        },
                        {
                              "label": {
                                    "ru": "Через 30 лет",
                                    "en": "After 30 years"
                              },
                              "value": {
                                    "ru": "5 521 евро",
                                    "en": "€5,521"
                              }
                        }
                  ],
                  "outcome": {
                        "ru": "Через тридцать лет сумма сохранит примерно 55% нынешней покупательной способности — при том, что целевая инфляция считается низкой и предсказуемой. Это объясняет, почему деньги держат не только на счёте, но и в активах.",
                        "en": "After thirty years the sum retains roughly 55% of today's purchasing power — and that is with inflation considered low and predictable. This explains why money is held in assets and not only in accounts."
                  }
            }
      }
    ],
  },
  {
    slug: 'exchange',
    category: 'trading',
    term: { ru: 'Биржа', en: 'Exchange' },
    definition: {
      ru: 'Платформа для покупки, продажи и обмена криптовалют. Может быть централизованной (CEX) или децентрализованной (DEX).',
      en: 'A platform for buying, selling, and trading cryptocurrencies. It can be centralized (CEX) or decentralized (DEX).',
    },
    updated: '2026-08-12',
    related: [
      "market-order",
      "custodial-wallet",
      "liquidity-pool",
      "aml",
      "kyc",
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
                        "ru": "Криптобиржа сводит покупателей и продавцов. Заявки собираются в стакан, где на одной стороне цены на покупку, на другой на продажу, и сделка происходит, когда они встречаются. Площадка берёт комиссию с оборота.",
                        "en": "A crypto exchange brings buyers and sellers together. Orders collect in an order book with bids on one side and asks on the other, and a trade occurs when they meet. The venue takes a fee from turnover."
                  },
                  {
                        "ru": "Биржи делятся на два типа, и разница между ними принципиальная. На централизованной площадке средства хранит компания, а торговля идёт по её внутренним записям — быстро и удобно, но монеты вам не принадлежат, пока вы их не вывели. На децентрализованной сделки исполняет смарт-контракт, а монеты остаются в вашем кошельке.",
                        "en": "Exchanges come in two types, and the difference is fundamental. On a centralised venue the company holds the funds and trading runs on its internal ledger — fast and convenient, but the coins are not yours until you withdraw them. On a decentralised one a smart contract settles trades and the coins stay in your wallet."
                  },
                  {
                        "ru": "Формула «не ваши ключи — не ваши монеты» появилась не из идеологии, а из практики. Mt. Gox в 2014-м, QuadrigaCX в 2019-м, FTX в 2022-м — каждый раз пользователи видели баланс на экране, которого фактически уже не было.",
                        "en": "The phrase “not your keys, not your coins” came from experience rather than ideology. Mt. Gox in 2014, QuadrigaCX in 2019, FTX in 2022 — each time users saw a balance on screen that no longer existed in fact."
                  }
            ]
      },
      {
            "heading": {
                  "ru": "Как сравнивать площадки",
                  "en": "How to compare venues"
            },
            "bullets": [
                  {
                        "title": {
                              "ru": "Лицензия в вашей юрисдикции",
                              "en": "A licence in your jurisdiction"
                        },
                        "text": {
                              "ru": "В ЕС это регистрация по MiCA. Лицензия не гарантирует сохранность средств, но даёт понятный порядок действий при споре.",
                              "en": "In the EU that means MiCA registration. A licence does not guarantee your funds are safe but it gives a defined process if something goes wrong."
                        }
                  },
                  {
                        "title": {
                              "ru": "Глубина стакана по вашей паре",
                              "en": "Order book depth for your pair"
                        },
                        "text": {
                              "ru": "Большой общий оборот площадки ничего не значит, если в нужной вам паре тонкий стакан: цена исполнения окажется хуже видимой.",
                              "en": "A venue's large total turnover means nothing if your pair has a thin book: your execution price will be worse than the one displayed."
                        }
                  },
                  {
                        "title": {
                              "ru": "Условия ввода и вывода",
                              "en": "Deposit and withdrawal terms"
                        },
                        "text": {
                              "ru": "Комиссия за вывод в евро и доступные сети для стейблкоинов влияют на итог сильнее, чем разница в торговой комиссии.",
                              "en": "The fee for withdrawing euros and the available networks for stablecoins affect the outcome more than a difference in trading fees."
                        }
                  },
                  {
                        "title": {
                              "ru": "Подтверждение резервов",
                              "en": "Proof of reserves"
                        },
                        "text": {
                              "ru": "Регулярная публикация с независимой проверкой лучше разового отчёта, но не заменяет полноценный аудит обязательств.",
                              "en": "Regular publication with independent verification beats a one-off report, though it is not a full audit of liabilities."
                        }
                  }
            ]
      },
      {
            "heading": {
                  "ru": "На что обратить внимание",
                  "en": "What to watch for"
            },
            "paragraphs": [
                  {
                        "ru": "Разделение по назначению снимает большую часть риска: биржа — место для сделок, кошелёк — место для хранения. Держать на площадке ту сумму, с которой вы торгуете на этой неделе, разумно; держать там весь портфель годами — значит принимать риск, за который вам никто не платит.",
                        "en": "Separating by purpose removes most of the risk: an exchange is a place to trade, a wallet is a place to store. Keeping the amount you are trading with this week on a venue is reasonable; keeping an entire portfolio there for years means taking on a risk nobody pays you for."
                  },
                  {
                        "ru": "Наш рейтинг бирж сравнивает площадки по обороту, лицензиям и доступным продуктам. Комиссии мы не сравниваем и об этом пишем прямо: сопоставимых данных по ним у нас нет, а придумывать их мы не станем.",
                        "en": "Our exchange ranking compares venues by turnover, licences and available products. We do not compare fees and say so plainly: we have no comparable data on them, and we will not invent it."
                  }
            ]
      }
    ],
  },
  {
    slug: 'genesis-block',
    category: 'tech',
    term: { ru: 'Генезис-блок', en: 'Genesis block' },
    definition: {
      ru: 'Самый первый блок в блокчейне, с которого начинается вся цепочка. У биткоина генезис-блок был создан 3 января 2009 года.',
      en: 'The very first block in a blockchain, from which the entire chain begins. Bitcoin\'s genesis block was created on January 3, 2009.',
    },
    updated: '2026-08-12',
    related: [
      "blockchain",
      "bitcoin",
      "block-explorer",
      "mining",
      "whitepaper",
      "hard-fork"
    ],
    sections: [
      {
            "heading": {
                  "ru": "Как это работает",
                  "en": "How it works"
            },
            "paragraphs": [
                  {
                        "ru": "Генезис-блок — первый блок цепочки, единственный, у которого нет предыдущего. Все остальные блоки ссылаются на своего предшественника хешем, и эта цепочка ссылок обрывается именно здесь.",
                        "en": "The genesis block is the first block of a chain, the only one with no predecessor. Every other block references the one before it by hash, and that chain of references ends here."
                  },
                  {
                        "ru": "Обычно он прописан прямо в коде программы, а не добывается майнингом. Узел при запуске не проверяет его, а принимает как данность — иначе проверять было бы не от чего.",
                        "en": "It is normally hard-coded into the software rather than mined. A node does not verify it at startup but accepts it as given — there would be nothing to verify against otherwise."
                  },
                  {
                        "ru": "В биткоине блок создан 3 января 2009 года, и в его данные вписана строка из заголовка газеты The Times: «Chancellor on brink of second bailout for banks». Это одновременно доказательство, что блок не создан раньше указанной даты, и прямое указание на причину появления системы.",
                        "en": "Bitcoin's was created on 3 January 2009, and its data carries a line from a headline in The Times: “Chancellor on brink of second bailout for banks”. That is at once proof the block was not made before that date and a direct statement of why the system appeared."
                  }
            ]
      },
      {
            "heading": {
                  "ru": "Что в нём необычного",
                  "en": "What is unusual about it"
            },
            "bullets": [
                  {
                        "title": {
                              "ru": "Награду за него нельзя потратить",
                              "en": "Its reward cannot be spent"
                        },
                        "text": {
                              "ru": "Пятьдесят биткоинов первого блока не проводятся через обычный механизм расчёта баланса — из-за особенности исходного кода они навсегда недоступны.",
                              "en": "The fifty bitcoins of the first block are not processed through the usual balance mechanism — a quirk of the original code makes them permanently unspendable."
                        }
                  },
                  {
                        "title": {
                              "ru": "Адрес по-прежнему получает переводы",
                              "en": "The address still receives transfers"
                        },
                        "text": {
                              "ru": "Люди годами отправляют туда небольшие суммы как дань уважения. Все они тоже остаются недоступными.",
                              "en": "People have sent small amounts there for years as a tribute. Those too remain locked."
                        }
                  },
                  {
                        "title": {
                              "ru": "Пауза до второго блока",
                              "en": "The gap before the second block"
                        },
                        "text": {
                              "ru": "Между первым и вторым блоком прошло шесть дней вместо обычных десяти минут. Единого объяснения нет до сих пор.",
                              "en": "Six days passed between the first and second block instead of the usual ten minutes. There is still no agreed explanation."
                        }
                  },
                  {
                        "title": {
                              "ru": "Он есть у каждой сети",
                              "en": "Every network has one"
                        },
                        "text": {
                              "ru": "У Ethereum, у любого форка, у частного блокчейна — везде цепочка начинается с блока, принятого без проверки.",
                              "en": "Ethereum, any fork, a private blockchain — every chain begins with a block accepted without verification."
                        }
                  }
            ]
      },
      {
            "heading": {
                  "ru": "Почему это важно",
                  "en": "Why it matters"
            },
            "paragraphs": [
                  {
                        "ru": "Генезис-блок задаёт идентичность сети. Два блокчейна с одинаковым кодом, но разными первыми блоками — это две разные, несовместимые сети. Именно поэтому при жёстком форке новая цепочка сохраняет общий генезис со старой: их история совпадает до точки расхождения.",
                        "en": "The genesis block defines a network's identity. Two blockchains with identical code but different first blocks are two separate, incompatible networks. This is why a hard fork's new chain keeps the same genesis as the old one: their history matches up to the point of divergence."
                  },
                  {
                        "ru": "Для практики отсюда следует простая вещь: доверие к цепочке начинается с доверия к тому, что ваш узел взял правильный первый блок. Все проверки после него бессмысленны, если начальная точка подменена — поэтому программу для узла берут только из официального источника и сверяют подпись.",
                        "en": "One practical consequence follows: trust in a chain starts with trust that your node took the correct first block. Every check after it is meaningless if the starting point was substituted — which is why node software is taken only from an official source and its signature verified."
                  }
            ]
      }
    ],
  },
];
