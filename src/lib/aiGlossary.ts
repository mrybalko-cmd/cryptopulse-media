import type { GlossaryTerm } from './glossary';

/** See GLOSSARY_BASELINE in ./glossary — same reasoning, this file's own
 *  commit date would re-stamp all 22 AI terms whenever one is edited. */
export const AI_GLOSSARY_BASELINE = '2026-07-14';

export const AI_GLOSSARY: GlossaryTerm[] = [
  {
    slug: 'llm',
    term: { ru: 'LLM (большая языковая модель)', en: 'LLM (Large Language Model)' },
    definition: {
      "ru": "LLM — нейросеть, обученная на огромных объёмах текста и предсказывающая следующий фрагмент слова. Из этого простого механизма и вырастает всё остальное: ответы на вопросы, перевод, код, рассуждения.",
      "en": "An LLM is a neural network trained on vast amounts of text that predicts the next fragment of a word. Everything else grows out of that single mechanism: answers, translation, code, reasoning."
    },
    updated: '2026-08-11',
    related: [
      "transformer",
      "token-ai",
      "context-window",
      "inference",
      "hallucination",
      "fine-tuning"
    ],
    sections: [
      {
        "heading": {
          "ru": "Как это работает",
          "en": "How it works"
        },
        "paragraphs": [
          {
            "ru": "Модель не хранит текст и не ищет по базе. Она хранит веса — миллиарды чисел, настроенных так, чтобы по началу фразы предсказывать её продолжение. Ответ строится по одному токену за раз, и каждый следующий выбирается с учётом всех предыдущих.",
            "en": "The model stores no text and searches no database. It stores weights, billions of numbers tuned so that a beginning of a phrase predicts its continuation. An answer is built one token at a time, each chosen in light of everything before it."
          },
          {
            "ru": "Обучение идёт в два больших этапа. Сначала предобучение на массиве текста — так модель усваивает язык и фактические связи. Затем дообучение на примерах желаемого поведения и обратной связи от людей — так она учится отвечать полезно, а не просто правдоподобно продолжать.",
            "en": "Training runs in two broad stages. Pre-training on a corpus of text teaches the model language and factual associations. Then fine-tuning on examples of desired behaviour and human feedback teaches it to answer usefully rather than merely continue plausibly."
          },
          {
            "ru": "Отсюда главное практическое следствие: модель не «знает» в человеческом смысле, а воспроизводит закономерности. Уверенный тон в ответе не связан с тем, верен ли ответ.",
            "en": "Hence the key practical consequence: the model does not \"know\" in the human sense, it reproduces patterns. Confidence in the tone of an answer is unrelated to whether the answer is right."
          }
        ]
      },
      {
        "heading": {
          "ru": "Что модель делает хорошо и плохо",
          "en": "Where it is strong and weak"
        },
        "bullets": [
          {
            "title": {
              "ru": "Хорошо: работа с данным текстом",
              "en": "Strong: working with text you provide"
            },
            "text": {
              "ru": "Пересказ, перевод, поиск противоречий, переписывание в другом стиле. Материал перед глазами, придумывать нечего.",
              "en": "Summarising, translating, spotting contradictions, rewriting in another register. The material is in front of it and nothing needs inventing."
            }
          },
          {
            "title": {
              "ru": "Хорошо: структурирование и черновики",
              "en": "Strong: structure and first drafts"
            },
            "text": {
              "ru": "Разложить задачу, предложить план, набросать код — там, где важна форма, а проверка остаётся за вами.",
              "en": "Breaking down a task, proposing a plan, sketching code: places where shape matters and verification stays with you."
            }
          },
          {
            "title": {
              "ru": "Плохо: точные факты по памяти",
              "en": "Weak: precise facts from memory"
            },
            "text": {
              "ru": "Даты, цифры, цитаты и ссылки модель воспроизводит правдоподобно, но не гарантированно верно. Всё это проверяется отдельно.",
              "en": "Dates, figures, quotations and links come out plausible rather than reliably correct. All of it needs separate checking."
            }
          },
          {
            "title": {
              "ru": "Плохо: арифметика и свежие события",
              "en": "Weak: arithmetic and recent events"
            },
            "text": {
              "ru": "Счёт по шагам даётся моделям тяжелее, чем текст, а знания заканчиваются на дате обучения, если нет доступа к поиску.",
              "en": "Step-by-step calculation is harder for a model than prose, and its knowledge stops at the training date unless it can search."
            }
          }
        ]
      }
    ],
  },
  {
    slug: 'transformer',
    term: { ru: 'Трансформер', en: 'Transformer' },
    definition: {
      "ru": "Трансформер — архитектура нейросети, предложенная в 2017 году в статье «Attention Is All You Need». На ней построены практически все современные языковые модели, а её ключевая идея — механизм внимания.",
      "en": "The transformer is a neural network architecture introduced in the 2017 paper \"Attention Is All You Need\". Nearly every modern language model is built on it, and its central idea is the attention mechanism."
    },
    updated: '2026-08-11',
    related: [
      "llm",
      "neural-network",
      "model-weights",
      "embedding",
      "context-window",
      "inference"
    ],
    sections: [
      {
        "heading": {
          "ru": "Как это работает",
          "en": "How it works"
        },
        "paragraphs": [
          {
            "ru": "Внимание позволяет модели при обработке каждого слова смотреть на все остальные слова сразу и решать, какие из них важны. В предложении «банк отказал в кредите, потому что он был убыточным» именно внимание связывает «он» с нужным словом.",
            "en": "Attention lets the model look at every other word at once while processing each one, and decide which of them matter. In \"the bank refused the loan because it was unprofitable\", attention is what ties \"it\" to the right word."
          },
          {
            "ru": "До трансформеров текст обрабатывался последовательно, слово за словом, и связь между далёкими частями предложения терялась. Внимание сняло это ограничение и заодно сделало обучение параллельным — отсюда и возможность обучать модели на действительно больших объёмах.",
            "en": "Before transformers, text was processed sequentially, word by word, and links between distant parts of a sentence were lost. Attention removed that limit and made training parallel at the same time, which is what allowed models to be trained on genuinely large corpora."
          },
          {
            "ru": "Расплата за это — квадратичный рост вычислений с длиной текста. Удвоив контекст, вы учетверяете работу, и именно поэтому длинный контекст стоит дорого и развивается медленнее, чем хотелось бы.",
            "en": "The price is that computation grows quadratically with length. Double the context and you quadruple the work, which is why long context is expensive and advances more slowly than one would like."
          }
        ]
      },
      {
        "heading": {
          "ru": "Почему это важно знать",
          "en": "Why this matters"
        },
        "bullets": [
          {
            "title": {
              "ru": "Объясняет цену длинного контекста",
              "en": "It explains the cost of long context"
            },
            "text": {
              "ru": "Запрос на 100 тысяч токенов стоит не вдвое дороже запроса на 50 тысяч, а заметно больше.",
              "en": "A 100,000-token request does not cost twice a 50,000-token one; it costs noticeably more."
            }
          },
          {
            "title": {
              "ru": "Объясняет «потерю середины»",
              "en": "It explains \"lost in the middle\""
            },
            "text": {
              "ru": "Модели заметно лучше держат начало и конец длинного текста, чем середину. Важное стоит ставить по краям.",
              "en": "Models hold the beginning and end of a long text noticeably better than the middle. Put what matters at the edges."
            }
          },
          {
            "title": {
              "ru": "Одна архитектура на всё",
              "en": "One architecture for everything"
            },
            "text": {
              "ru": "Текст, изображения, звук и код обрабатываются одним и тем же механизмом — отсюда мультимодальные модели.",
              "en": "Text, images, audio and code all run through the same mechanism, which is where multimodal models come from."
            }
          }
        ]
      }
    ],
  },
  {
    slug: 'prompt-engineering',
    term: { ru: 'Промпт-инжиниринг', en: 'Prompt Engineering' },
    definition: {
      "ru": "Промпт-инжиниринг — составление запросов так, чтобы модель делала нужное. Не магические формулировки, а обычная точность: ясная задача, необходимый контекст, заданный формат ответа и критерий, по которому его оценивать.",
      "en": "Prompt engineering is writing requests so a model does the right thing. Not magic phrasings but ordinary precision: a clear task, the context it needs, a defined output format, and a criterion for judging the result."
    },
    updated: '2026-08-11',
    related: [
      "llm",
      "chain-of-thought",
      "few-shot-learning",
      "context-window",
      "hallucination",
      "token-ai"
    ],
    sections: [
      {
        "heading": {
          "ru": "Что действительно работает",
          "en": "What actually works"
        },
        "paragraphs": [
          {
            "ru": "Первое — конкретность задачи. «Напиши про биткоин» и «объясни халвинг человеку, который впервые слышит о криптовалютах, в трёх абзацах, без жаргона» дают несопоставимые по качеству ответы.",
            "en": "First, specificity. \"Write about bitcoin\" and \"explain the halving to someone hearing about crypto for the first time, in three paragraphs, without jargon\" produce answers of entirely different quality."
          },
          {
            "ru": "Второе — примеры. Один-два образца желаемого ответа объясняют формат лучше, чем абзац описаний. Модель хорошо копирует структуру показанного.",
            "en": "Second, examples. One or two samples of the wanted answer convey a format better than a paragraph describing it. Models copy the structure of what they are shown."
          },
          {
            "ru": "Третье — материал. Если ответ должен опираться на конкретный текст, его нужно дать. Просить модель вспомнить документ по названию — самый быстрый способ получить выдумку.",
            "en": "Third, the material. If the answer must rest on a specific text, provide it. Asking a model to recall a document by its title is the fastest route to invention."
          }
        ]
      },
      {
        "heading": {
          "ru": "Приёмы, которые окупаются",
          "en": "Techniques that pay off"
        },
        "bullets": [
          {
            "title": {
              "ru": "Задайте роль и аудиторию",
              "en": "Name the role and the audience"
            },
            "text": {
              "ru": "«Объясни как редактор новичку» задаёт и уровень детализации, и тон, и что можно опустить.",
              "en": "\"Explain as an editor would to a newcomer\" sets the level of detail, the tone, and what may be left out."
            }
          },
          {
            "title": {
              "ru": "Опишите формат заранее",
              "en": "Define the format up front"
            },
            "text": {
              "ru": "Число пунктов, длина, наличие заголовков, язык вывода. Иначе получите то, что модель считает уместным по умолчанию.",
              "en": "Number of points, length, headings, output language. Otherwise you get whatever the model considers default."
            }
          },
          {
            "title": {
              "ru": "Разрешите сказать «не знаю»",
              "en": "Allow \"I don't know\""
            },
            "text": {
              "ru": "Без этого разрешения модель заполнит пробел догадкой, потому что продолжить текст она обязана.",
              "en": "Without that permission the model fills the gap with a guess, because continuing the text is what it must do."
            }
          },
          {
            "title": {
              "ru": "Просите рассуждение до ответа",
              "en": "Ask for reasoning before the answer"
            },
            "text": {
              "ru": "На задачах со счётом и логикой это заметно повышает точность — модель не «прыгает» сразу к выводу.",
              "en": "On counting and logic tasks this measurably improves accuracy: the model stops jumping straight to a conclusion."
            }
          },
          {
            "title": {
              "ru": "Итерация вместо длинного промпта",
              "en": "Iterate instead of writing one long prompt"
            },
            "text": {
              "ru": "Короткий запрос, оценка результата, уточнение — быстрее, чем пытаться предусмотреть всё заранее.",
              "en": "A short request, a look at the result, then a correction beats trying to anticipate everything in advance."
            }
          }
        ]
      }
    ],
  },
  {
    slug: 'rag',
    term: { ru: 'RAG (генерация с дополнением поиском)', en: 'RAG (Retrieval-Augmented Generation)' },
    definition: {
      "ru": "RAG — подход, при котором модель перед ответом ищет нужные фрагменты в вашей базе и отвечает уже по ним. Так она работает со свежими и закрытыми данными, которых не было в обучении, и заметно реже выдумывает.",
      "en": "RAG is an approach where the model first retrieves relevant fragments from your own data and answers from them. It is how a model works with fresh or private material it was never trained on, and it invents markedly less."
    },
    updated: '2026-08-11',
    related: [
      "embedding",
      "vector-database",
      "hallucination",
      "context-window",
      "llm",
      "fine-tuning"
    ],
    sections: [
      {
        "heading": {
          "ru": "Как это работает",
          "en": "How it works"
        },
        "paragraphs": [
          {
            "ru": "Документы заранее нарезаются на куски и превращаются в векторы — числовые представления смысла. Они складываются в векторную базу. При запросе в векторы превращается и он, база находит ближайшие по смыслу фрагменты, и они подставляются в контекст вместе с вопросом.",
            "en": "Documents are chunked in advance and turned into vectors, numeric representations of meaning, which go into a vector database. A query is vectorised too, the database finds the closest fragments by meaning, and they are placed into the context alongside the question."
          },
          {
            "ru": "Модель отвечает уже по этому материалу, а не по памяти. Отсюда два выигрыша: ответ опирается на проверяемый источник, и его можно снабдить ссылкой на конкретный документ.",
            "en": "The model then answers from that material rather than from memory. Two gains follow: the answer rests on a checkable source, and it can carry a link to the specific document."
          },
          {
            "ru": "Поиск идёт по смыслу, а не по словам. Запрос «как вернуть товар» находит раздел «политика возврата», даже если этих слов в нём нет, — потому что сравниваются векторы, а не строки.",
            "en": "Retrieval works on meaning rather than words. A query about \"sending something back\" finds the \"returns policy\" section even without matching words, because vectors are compared rather than strings."
          }
        ]
      },
      {
        "heading": {
          "ru": "RAG или дообучение",
          "en": "RAG or fine-tuning"
        },
        "bullets": [
          {
            "title": {
              "ru": "RAG — когда меняются данные",
              "en": "RAG when the data changes"
            },
            "text": {
              "ru": "Документы обновляются без переобучения модели: достаточно переиндексировать базу. Дообучение так не умеет.",
              "en": "Documents update without retraining the model; reindexing the store is enough. Fine-tuning cannot do that."
            }
          },
          {
            "title": {
              "ru": "Дообучение — когда меняется поведение",
              "en": "Fine-tuning when the behaviour changes"
            },
            "text": {
              "ru": "Стиль ответа, формат вывода, специфический жаргон — это про дообучение, а не про поиск.",
              "en": "Answer style, output format, a specific jargon: that is fine-tuning territory, not retrieval."
            }
          },
          {
            "title": {
              "ru": "Качество упирается в нарезку",
              "en": "Quality lives in the chunking"
            },
            "text": {
              "ru": "Слишком мелкие куски теряют контекст, слишком крупные размывают поиск. Это основная настройка всей схемы.",
              "en": "Chunks too small lose context, chunks too large blur retrieval. This is the main knob in the whole design."
            }
          },
          {
            "title": {
              "ru": "Плохой поиск — плохой ответ",
              "en": "Bad retrieval, bad answer"
            },
            "text": {
              "ru": "Если база отдала не те фрагменты, модель уверенно ответит по ним. RAG сокращает выдумки, но не отменяет проверку.",
              "en": "If the store returns the wrong fragments the model will answer confidently from them. RAG reduces invention; it does not remove the need to check."
            }
          }
        ]
      }
    ],
  },
  {
    slug: 'fine-tuning',
    term: { ru: 'Файнтюнинг (дообучение)', en: 'Fine-tuning' },
    definition: {
      "ru": "Дообучение — донастройка готовой модели на своих примерах, чтобы она усвоила нужный стиль, формат или узкую задачу. Веса при этом меняются, в отличие от промптов и RAG, которые работают только с контекстом.",
      "en": "Fine-tuning adapts an existing model on your own examples so it takes on a required style, format or narrow task. It changes the weights, unlike prompting and RAG, which work only with context."
    },
    updated: '2026-08-11',
    related: [
      "llm",
      "model-weights",
      "rag",
      "foundation-model",
      "rlhf",
      "inference"
    ],
    sections: [
      {
        "heading": {
          "ru": "Как это работает",
          "en": "How it works"
        },
        "paragraphs": [
          {
            "ru": "За основу берётся уже обученная модель, и на наборе пар «запрос — желаемый ответ» её веса слегка сдвигаются. Обучать с нуля не нужно: язык и знания о мире модель уже усвоила, донастраивается только поведение.",
            "en": "You start from an already-trained model and nudge its weights on a set of request-and-desired-answer pairs. Training from scratch is unnecessary: the model already has language and world knowledge; only behaviour is being adjusted."
          },
          {
            "ru": "Чаще всего меняют не все веса, а небольшую добавку к ним — так дообучение обходится в тысячи раз дешевле полного и умещается на одной видеокарте. Результат хранится отдельно и подключается к базовой модели.",
            "en": "Usually not all weights are changed but a small addition to them, which makes the process thousands of times cheaper than full training and fits on a single GPU. The result is stored separately and attached to the base model."
          },
          {
            "ru": "Качество упирается в данные, а не в объём. Несколько сотен аккуратно подобранных примеров дают лучший результат, чем десятки тысяч случайных: модель усваивает и ошибки тоже.",
            "en": "Quality depends on the data rather than its volume. A few hundred carefully chosen examples beat tens of thousands of random ones: the model absorbs the mistakes too."
          }
        ]
      },
      {
        "heading": {
          "ru": "Когда это нужно и когда нет",
          "en": "When it is needed and when not"
        },
        "bullets": [
          {
            "title": {
              "ru": "Нужно: устойчивый формат вывода",
              "en": "Needed: a strict output format"
            },
            "text": {
              "ru": "Если модель обязана всегда отвечать одной и той же структурой, дообучение надёжнее длинной инструкции в промпте.",
              "en": "When a model must always answer in one structure, fine-tuning is more reliable than a long instruction in the prompt."
            }
          },
          {
            "title": {
              "ru": "Нужно: свой стиль или жаргон",
              "en": "Needed: your own voice or jargon"
            },
            "text": {
              "ru": "Редакционный тон и отраслевая терминология передаются примерами лучше, чем описанием.",
              "en": "An editorial tone and industry terminology transfer through examples better than through description."
            }
          },
          {
            "title": {
              "ru": "Не нужно: добавить знания",
              "en": "Not needed: adding knowledge"
            },
            "text": {
              "ru": "Для фактов есть RAG. Дообучение плохо запоминает конкретные сведения и не позволяет их обновлять.",
              "en": "For facts there is RAG. Fine-tuning memorises specific information poorly and offers no way to update it."
            }
          },
          {
            "title": {
              "ru": "Не нужно: сначала попробуйте промпт",
              "en": "Not needed: try prompting first"
            },
            "text": {
              "ru": "Значительная часть задач, под которые заказывают дообучение, решается точным запросом и парой примеров.",
              "en": "A large share of tasks that fine-tuning is commissioned for are solved by a precise request and a couple of examples."
            }
          }
        ]
      }
    ],
  },
  {
    slug: 'hallucination',
    term: { ru: 'Галлюцинация ИИ', en: 'AI Hallucination' },
    definition: {
      "ru": "Галлюцинация — уверенно поданный, но выдуманный ответ: несуществующая цитата, ссылка, статья или цифра. Это не сбой, а прямое следствие того, как устроена модель: она предсказывает правдоподобное продолжение, а не проверяет факт.",
      "en": "A hallucination is a confidently delivered but invented answer: a quotation, link, paper or figure that does not exist. It is not a malfunction but a direct consequence of the design: the model predicts a plausible continuation rather than verifying a fact."
    },
    updated: '2026-08-11',
    related: [
      "llm",
      "rag",
      "inference",
      "fine-tuning",
      "chain-of-thought",
      "context-window"
    ],
    sections: [
      {
        "heading": {
          "ru": "Почему это происходит",
          "en": "Why it happens"
        },
        "paragraphs": [
          {
            "ru": "Модель обучена продолжать текст правдоподобно. У неё нет отдельного механизма, который отличал бы «я это знаю» от «так обычно бывает написано». На вопрос о несуществующей статье она выдаёт то, как выглядела бы ссылка на такую статью.",
            "en": "The model is trained to continue text plausibly. It has no separate mechanism distinguishing \"I know this\" from \"this is how such things are usually written\". Asked about a paper that does not exist, it produces what a reference to such a paper would look like."
          },
          {
            "ru": "Чаще всего это случается там, где данных было мало: узкие темы, точные цифры, имена, даты, конкретные ссылки. И почти никогда — там, где нужный текст лежит прямо в запросе.",
            "en": "It happens most where training data was thin: narrow topics, precise figures, names, dates, specific links. And almost never where the needed text sits directly in the request."
          },
          {
            "ru": "Опаснее всего то, что тон ответа не меняется. Выдуманная ссылка подаётся с той же уверенностью, что и верная, поэтому по самому тексту отличить их невозможно.",
            "en": "The dangerous part is that the tone does not change. An invented citation arrives with the same confidence as a correct one, so the text itself gives you no way to tell them apart."
          }
        ]
      },
      {
        "heading": {
          "ru": "Как снизить риск",
          "en": "How to reduce the risk"
        },
        "bullets": [
          {
            "title": {
              "ru": "Дайте источник в запросе",
              "en": "Supply the source in the request"
            },
            "text": {
              "ru": "Когда нужный текст перед моделью, выдумывать нечего. Это самый надёжный приём, и на нём построен RAG.",
              "en": "With the text in front of it there is nothing to invent. This is the most reliable technique, and RAG is built on it."
            }
          },
          {
            "title": {
              "ru": "Просите цитату, а не пересказ",
              "en": "Ask for the quote, not the gist"
            },
            "text": {
              "ru": "Требование привести дословный фрагмент из данного текста резко сокращает пространство для выдумки.",
              "en": "Demanding a verbatim fragment from the provided text sharply narrows the room for invention."
            }
          },
          {
            "title": {
              "ru": "Разрешите ответить «не знаю»",
              "en": "Permit \"I don't know\""
            },
            "text": {
              "ru": "Прямое указание отвечать «нет данных» вместо догадки заметно меняет поведение модели.",
              "en": "An explicit instruction to say \"no data\" instead of guessing changes the behaviour noticeably."
            }
          },
          {
            "title": {
              "ru": "Проверяйте всё, что можно проверить",
              "en": "Verify anything verifiable"
            },
            "text": {
              "ru": "Ссылки открывайте, цифры сверяйте с первоисточником, цитаты ищите в оригинале. Особенно если они выглядят убедительно.",
              "en": "Open the links, check the numbers against the primary source, find the quotes in the original. Especially when they look convincing."
            }
          }
        ]
      }
    ],
  },
  {
    slug: 'context-window',
    term: { ru: 'Контекстное окно', en: 'Context Window' },
    definition: {
      "ru": "Контекстное окно — сколько текста модель удерживает одновременно: и ваш запрос, и всю предыдущую переписку, и ответ. Измеряется в токенах, и всё, что вышло за границу окна, для модели перестаёт существовать.",
      "en": "The context window is how much text a model holds at once: your request, the whole prior conversation and the answer. It is measured in tokens, and anything outside the window stops existing for the model."
    },
    updated: '2026-08-11',
    related: [
      "token-ai",
      "llm",
      "rag",
      "transformer",
      "inference",
      "ai-agent"
    ],
    sections: [
      {
        "heading": {
          "ru": "Как это работает",
          "en": "How it works"
        },
        "paragraphs": [
          {
            "ru": "Модель не помнит прошлые разговоры. Каждый запрос отправляется вместе со всей историей переписки, и именно эта история и есть «память». Как только суммарный объём превышает окно, самое старое отбрасывается или сжимается.",
            "en": "A model remembers no past conversations. Every request is sent along with the whole history, and that history is the \"memory\". Once the total exceeds the window, the oldest part is dropped or compressed."
          },
          {
            "ru": "Окно делится между входом и выходом. Загрузив документ на 90% окна, вы оставляете модели мало места на ответ, и он окажется короче, чем вы рассчитывали.",
            "en": "The window is shared between input and output. Load a document filling 90% of it and you leave the model little room to answer, which comes out shorter than you expected."
          },
          {
            "ru": "Большое окно не равно хорошей работе с ним. Модели устойчиво лучше используют начало и конец длинного текста, чем середину, поэтому набивать окно «на всякий случай» обычно вредит качеству.",
            "en": "A large window does not mean good use of it. Models consistently handle the start and end of a long text better than the middle, so filling the window \"just in case\" usually hurts quality."
          }
        ]
      },
      {
        "heading": {
          "ru": "Как с этим работать",
          "en": "How to work with it"
        },
        "bullets": [
          {
            "title": {
              "ru": "Важное — в начало и в конец",
              "en": "Put what matters at the edges"
            },
            "text": {
              "ru": "Инструкция в самом начале и повтор ключевого требования в конце работают лучше, чем то же самое в середине.",
              "en": "An instruction at the very start plus a restatement of the key requirement at the end beats the same words in the middle."
            }
          },
          {
            "title": {
              "ru": "Меньше текста, но по делу",
              "en": "Less text, better chosen"
            },
            "text": {
              "ru": "Три нужные страницы дают лучший ответ, чем триста, среди которых эти три спрятаны.",
              "en": "Three relevant pages produce a better answer than three hundred with those three hidden inside."
            }
          },
          {
            "title": {
              "ru": "Длинная переписка дорожает",
              "en": "A long thread gets expensive"
            },
            "text": {
              "ru": "История отправляется целиком каждый раз, поэтому стоимость сообщения растёт по мере разговора.",
              "en": "The history is resent in full every time, so the cost per message climbs as the conversation goes on."
            }
          },
          {
            "title": {
              "ru": "Для больших объёмов есть RAG",
              "en": "For large volumes there is RAG"
            },
            "text": {
              "ru": "Вместо того чтобы грузить всю базу в окно, ищут нужные куски и передают только их.",
              "en": "Rather than loading a whole corpus into the window, retrieve the relevant pieces and pass only those."
            }
          }
        ]
      }
    ],
  },
  {
    slug: 'token-ai',
    term: { ru: 'Токен (в ИИ)', en: 'Token (AI)' },
    definition: {
      "ru": "Токен в ИИ — кусок текста, которым модель оперирует вместо букв и слов. Обычно это часть слова: в английском примерно четыре символа. В токенах измеряют и длину контекста, и стоимость запроса.",
      "en": "A token in AI is a chunk of text the model works with instead of letters or words. Usually it is part of a word, about four characters in English. Tokens are the unit for both context length and price."
    },
    updated: '2026-08-11',
    related: [
      "context-window",
      "llm",
      "inference",
      "embedding",
      "transformer",
      "prompt-engineering"
    ],
    sections: [
      {
        "heading": {
          "ru": "Как это работает",
          "en": "How it works"
        },
        "paragraphs": [
          {
            "ru": "Текст разбивается на токены по частоте встречаемости. Частые слова становятся одним токеном целиком, редкие дробятся на части. Поэтому «the» — это один токен, а выдуманное слово может занять пять.",
            "en": "Text is split into tokens by frequency. Common words become a single token; rare ones are broken into pieces. So \"the\" is one token while an invented word might take five."
          },
          {
            "ru": "Кириллица дробится мельче латиницы: один и тот же смысл на русском обычно занимает в полтора-два раза больше токенов, чем на английском. Это напрямую влияет и на цену запроса, и на то, сколько помещается в контекст.",
            "en": "Cyrillic splits more finely than Latin script: the same meaning in Russian usually takes one and a half to two times the tokens it takes in English. That feeds straight into both price and how much fits in the context."
          },
          {
            "ru": "Модель видит только токены, а не буквы внутри них. Отсюда её давняя слабость в задачах вроде «сколько букв «р» в слове»: она работает с фрагментами, а не с символами.",
            "en": "The model sees tokens, not the letters inside them. Hence its long-standing weakness at questions like \"how many r's are in this word\": it works with fragments, not characters."
          }
        ]
      },
      {
        "heading": {
          "ru": "Сколько это в словах",
          "en": "What that is in words"
        },
        "example": {
          "setup": {
            "ru": "Примерные соотношения, которых достаточно для оценки объёма и цены.",
            "en": "Rough ratios, enough to estimate size and cost."
          },
          "rows": [
            {
              "label": {
                "ru": "1 токен (английский)",
                "en": "1 token (English)"
              },
              "value": {
                "ru": "≈ 4 символа",
                "en": "≈ 4 characters"
              }
            },
            {
              "label": {
                "ru": "1 000 токенов",
                "en": "1,000 tokens"
              },
              "value": {
                "ru": "≈ 750 слов",
                "en": "≈ 750 words"
              }
            },
            {
              "label": {
                "ru": "Страница А4",
                "en": "An A4 page"
              },
              "value": {
                "ru": "≈ 500–700 токенов",
                "en": "≈ 500–700 tokens"
              }
            },
            {
              "label": {
                "ru": "Тот же текст на русском",
                "en": "The same text in Russian"
              },
              "value": {
                "ru": "×1,5–2",
                "en": "×1.5–2"
              }
            }
          ],
          "outcome": {
            "ru": "Контекст на 128 тысяч токенов вмещает примерно роман среднего размера на английском — и заметно меньше на русском. Цена запроса считается по сумме входных и выходных токенов, поэтому длинная переписка дорожает с каждым сообщением.",
            "en": "A 128,000-token context holds roughly a mid-length novel in English, and noticeably less in Russian. A request is priced on input plus output tokens together, so a long conversation gets more expensive with every message."
          }
        }
      }
    ],
  },
  {
    slug: 'inference',
    term: { ru: 'Инференс', en: 'Inference' },
    definition: {
      ru: 'Процесс использования уже обученной модели для получения ответа на новый запрос — в отличие от обучения (training), когда модель настраивает свои параметры. Именно инференс происходит каждый раз, когда вы отправляете сообщение чат-боту.',
      en: 'The process of using an already-trained model to generate a response to a new input — as opposed to training, when the model adjusts its parameters. Inference is what happens every time you send a message to a chatbot.',
    },
  },
  {
    slug: 'embedding',
    term: { ru: 'Эмбеддинг', en: 'Embedding' },
    definition: {
      "ru": "Эмбеддинг — представление текста, картинки или звука в виде набора чисел, где близкие по смыслу объекты оказываются рядом. На этом держатся семантический поиск, рекомендации и вся схема RAG.",
      "en": "An embedding represents text, an image or audio as a list of numbers in which things close in meaning end up close together. Semantic search, recommendations and the whole RAG pattern rest on it."
    },
    updated: '2026-08-11',
    related: [
      "vector-database",
      "rag",
      "llm",
      "transformer",
      "multimodal-ai",
      "token-ai"
    ],
    sections: [
      {
        "heading": {
          "ru": "Как это работает",
          "en": "How it works"
        },
        "paragraphs": [
          {
            "ru": "Модель превращает фрагмент в вектор — список из сотен или тысяч чисел. Каждое число само по себе ничего не значит, но расстояние между двумя векторами отражает близость смыслов.",
            "en": "A model turns a fragment into a vector, a list of hundreds or thousands of numbers. No single number means anything on its own, but the distance between two vectors reflects how close their meanings are."
          },
          {
            "ru": "Поэтому «автомобиль» и «машина» оказываются рядом, а «автомобиль» и «суп» — далеко, хотя буквенно первое и второе не похожи. Поиск по эмбеддингам находит по смыслу, а не по совпадению строк.",
            "en": "So \"car\" and \"automobile\" land near each other while \"car\" and \"soup\" do not, even though the first pair shares no letters. Embedding search finds by meaning rather than by string match."
          },
          {
            "ru": "Одна и та же модель эмбеддингов должна использоваться и при индексации, и при поиске. Векторы разных моделей несопоставимы: сменив модель, базу нужно строить заново.",
            "en": "The same embedding model must be used for indexing and for querying. Vectors from different models are not comparable: change the model and the store has to be rebuilt."
          }
        ]
      },
      {
        "heading": {
          "ru": "Где это применяется",
          "en": "Where it is used"
        },
        "bullets": [
          {
            "title": {
              "ru": "Семантический поиск",
              "en": "Semantic search"
            },
            "text": {
              "ru": "Находит нужный документ по описанию проблемы, даже если пользователь не знает правильных терминов.",
              "en": "Finds the right document from a description of a problem, even when the user does not know the correct terms."
            }
          },
          {
            "title": {
              "ru": "Поиск дубликатов",
              "en": "Deduplication"
            },
            "text": {
              "ru": "Два текста об одном и том же оказываются рядом в векторном пространстве, даже будучи написанными разными словами.",
              "en": "Two texts about the same thing sit close together in vector space even when written in different words."
            }
          },
          {
            "title": {
              "ru": "Рекомендации",
              "en": "Recommendations"
            },
            "text": {
              "ru": "Похожие статьи, товары или треки подбираются по близости векторов, а не по совпадению тегов.",
              "en": "Similar articles, products or tracks are matched by vector proximity rather than by shared tags."
            }
          },
          {
            "title": {
              "ru": "Классификация",
              "en": "Classification"
            },
            "text": {
              "ru": "Определить тему или тональность можно по тому, к каким известным примерам вектор оказался ближе.",
              "en": "Topic or sentiment can be decided by which known examples a vector lands nearest to."
            }
          }
        ]
      }
    ],
  },
  {
    slug: 'ai-agent',
    term: { ru: 'ИИ-агент', en: 'AI Agent' },
    definition: {
      "ru": "ИИ-агент — модель, которой дали инструменты и право действовать в цикле: она сама решает, какой шаг сделать, выполняет его, смотрит на результат и продолжает, пока задача не решена.",
      "en": "An AI agent is a model given tools and the right to act in a loop: it decides what step to take, takes it, looks at the result and carries on until the task is done."
    },
    updated: '2026-08-11',
    related: [
      "llm",
      "mcp",
      "chain-of-thought",
      "context-window",
      "inference",
      "rag"
    ],
    sections: [
      {
        "heading": {
          "ru": "Как это работает",
          "en": "How it works"
        },
        "paragraphs": [
          {
            "ru": "Обычная модель отвечает один раз на один запрос. Агент получает цель и набор инструментов — поиск, чтение файлов, вызов API, запуск кода — и работает циклом: выбрать действие, выполнить, оценить результат, выбрать следующее.",
            "en": "An ordinary model answers once to one request. An agent is given a goal and a set of tools — search, file access, API calls, running code — and works in a loop: choose an action, take it, judge the result, choose the next."
          },
          {
            "ru": "Ключевое отличие в том, что план не задан заранее. Модель сама решает, сколько шагов понадобится и какие, поэтому одна и та же задача может решаться по-разному от запуска к запуску.",
            "en": "The key difference is that the plan is not fixed in advance. The model decides how many steps are needed and which, so the same task can be solved differently from run to run."
          },
          {
            "ru": "Отсюда и главная сложность: ошибка на раннем шаге тянется через весь цикл. Агент, неверно понявший задачу, будет уверенно и добросовестно делать не то — и остановить его должны внешние ограничения, а не он сам.",
            "en": "Hence the central difficulty: an early mistake propagates through the whole loop. An agent that misread the task will confidently and diligently do the wrong thing, and what stops it has to be an external limit rather than its own judgement."
          }
        ]
      },
      {
        "heading": {
          "ru": "Что важно при использовании",
          "en": "What matters in practice"
        },
        "bullets": [
          {
            "title": {
              "ru": "Ограничивайте права",
              "en": "Limit the permissions"
            },
            "text": {
              "ru": "Доступ на чтение и доступ на запись — разные вещи. Необратимые действия должны требовать подтверждения.",
              "en": "Read access and write access are different things. Irreversible actions should require confirmation."
            }
          },
          {
            "title": {
              "ru": "Ставьте предел на число шагов",
              "en": "Cap the number of steps"
            },
            "text": {
              "ru": "Без ограничения агент способен уйти в длинный цикл, тратя время и деньги на бесполезную работу.",
              "en": "Without a limit an agent can settle into a long loop, spending time and money on useless work."
            }
          },
          {
            "title": {
              "ru": "Проверяйте промежуточные шаги",
              "en": "Check the intermediate steps"
            },
            "text": {
              "ru": "Итоговый ответ может выглядеть убедительно при ошибке в середине. Смотрите, что именно он делал.",
              "en": "A final answer can look convincing with an error in the middle. Look at what it actually did."
            }
          },
          {
            "title": {
              "ru": "Узкая задача надёжнее широкой",
              "en": "A narrow task beats a broad one"
            },
            "text": {
              "ru": "Агент, у которого одна понятная цель и три инструмента, ошибается заметно реже универсального.",
              "en": "An agent with one clear goal and three tools errs far less often than a general-purpose one."
            }
          }
        ]
      }
    ],
  },
  {
    slug: 'multimodal-ai',
    term: { ru: 'Мультимодальный ИИ', en: 'Multimodal AI' },
    definition: {
      ru: 'Модель, способная одновременно понимать и/или генерировать разные типы данных — текст, изображения, аудио и видео — а не только текст. Например, может проанализировать фото и ответить на вопрос о нём текстом.',
      en: 'A model that can understand and/or generate multiple types of data at once — text, images, audio, and video — rather than just text. For example, it can analyze a photo and answer a question about it in text.',
    },
  },
  {
    slug: 'rlhf',
    term: { ru: 'RLHF (обучение с подкреплением на основе обратной связи людей)', en: 'RLHF (Reinforcement Learning from Human Feedback)' },
    definition: {
      ru: 'Метод дообучения модели, при котором люди оценивают качество её ответов, а модель корректируется так, чтобы чаще выдавать ответы, которые люди оценивают выше. Ключевой этап в том, чтобы сделать ИИ-модель полезной и безопасной, а не только технически рабочей.',
      en: 'A fine-tuning method where humans rate the quality of a model\'s responses, and the model is adjusted to more often produce answers that humans rate highly. It\'s a key step in making an AI model helpful and safe, not just technically functional.',
    },
  },
  {
    slug: 'diffusion-model',
    term: { ru: 'Диффузионная модель', en: 'Diffusion Model' },
    definition: {
      ru: 'Тип генеративной модели, которая учится создавать изображения (или другой контент), постепенно «очищая» случайный шум до тех пор, пока не получится осмысленная картинка. Лежит в основе большинства генераторов изображений — Midjourney, Stable Diffusion, DALL-E.',
      en: 'A type of generative model that learns to create images (or other content) by gradually "cleaning up" random noise until a coherent picture emerges. It underlies most image generators, including Midjourney, Stable Diffusion, and DALL-E.',
    },
  },
  {
    slug: 'foundation-model',
    term: { ru: 'Foundation model (базовая модель)', en: 'Foundation Model' },
    definition: {
      ru: 'Крупная модель, обученная на широком массиве данных, которая служит основой для множества более узких приложений через дообучение или промптинг — вместо того чтобы обучать отдельную модель под каждую задачу с нуля.',
      en: 'A large model trained on a broad dataset that serves as the base for many narrower applications through fine-tuning or prompting — instead of training a separate model from scratch for every task.',
    },
  },
  {
    slug: 'chain-of-thought',
    term: { ru: 'Chain-of-thought (цепочка рассуждений)', en: 'Chain-of-Thought' },
    definition: {
      ru: 'Техника, при которой модель «рассуждает вслух» пошагово перед тем, как дать финальный ответ, вместо того чтобы сразу выдавать результат. Заметно повышает точность на задачах, требующих логики или математики.',
      en: 'A technique where the model "thinks out loud" step by step before giving its final answer, instead of producing a result immediately. It noticeably improves accuracy on tasks that require logic or math.',
    },
  },
  {
    slug: 'neural-network',
    term: { ru: 'Нейронная сеть', en: 'Neural Network' },
    definition: {
      ru: 'Математическая модель, устроенная по образцу связей нейронов в мозге: множество слоёв простых вычислительных узлов, которые вместе учатся находить сложные закономерности в данных. Основа практически всех современных систем ИИ.',
      en: 'A mathematical model loosely inspired by the connections between neurons in the brain: many layers of simple computational units that together learn to find complex patterns in data. It\'s the foundation of nearly all modern AI systems.',
    },
  },
  {
    slug: 'model-weights',
    term: { ru: 'Веса модели', en: 'Model Weights' },
    definition: {
      ru: 'Числовые параметры внутри нейросети, которые настраиваются в процессе обучения и определяют, как модель обрабатывает входные данные. «Открытые веса» (open-weight) означает, что эти параметры можно скачать и запускать модель самостоятельно.',
      en: 'The numeric parameters inside a neural network that are adjusted during training and determine how the model processes input. "Open-weight" means these parameters can be downloaded so anyone can run the model themselves.',
    },
  },
  {
    slug: 'few-shot-learning',
    term: { ru: 'Few-shot / zero-shot обучение', en: 'Few-shot / Zero-shot Learning' },
    definition: {
      ru: 'Способность модели выполнять новую задачу, увидев всего несколько примеров (few-shot) или вообще без примеров, только по текстовому описанию задачи (zero-shot) — без дополнительного дообучения на новых данных.',
      en: 'A model\'s ability to perform a new task after seeing just a few examples (few-shot) or with no examples at all, based purely on a text description of the task (zero-shot) — without any additional training on new data.',
    },
  },
  {
    slug: 'agi',
    term: { ru: 'AGI (общий искусственный интеллект)', en: 'AGI (Artificial General Intelligence)' },
    definition: {
      "ru": "AGI — гипотетический ИИ, способный решать любые интеллектуальные задачи на уровне человека, а не только те, под которые обучен. Такой системы не существует, и общепринятого определения, по которому её признают созданной, тоже нет.",
      "en": "AGI is a hypothetical AI able to handle any intellectual task at human level, not only the ones it was trained for. No such system exists, and there is no agreed definition by which one would be recognised."
    },
    updated: '2026-08-11',
    related: [
      "llm",
      "foundation-model",
      "ai-agent",
      "neural-network",
      "inference",
      "rlhf"
    ],
    sections: [
      {
        "heading": {
          "ru": "Почему об этом сложно говорить",
          "en": "Why it is hard to discuss"
        },
        "paragraphs": [
          {
            "ru": "Определения расходятся принципиально. Для одних AGI — это система, проходящая любой человеческий тест, для других — способная самостоятельно ставить себе цели, для третьих — экономический критерий вроде замещения большинства удалённых работ. Эти определения дают разные ответы на вопрос, близко ли это.",
            "en": "The definitions differ fundamentally. For some, AGI is a system that passes any human test; for others, one that sets its own goals; for others still, an economic threshold such as replacing most remote work. These definitions give different answers to how close it is."
          },
          {
            "ru": "Современные модели сильны там, где есть много данных, и неожиданно слабы в простых задачах, требующих устойчивого рассуждения по шагам или физической интуиции. Способность сдавать профессиональные экзамены и способность надёжно работать в реальной задаче — разные вещи.",
            "en": "Current models are strong where data is plentiful and unexpectedly weak on simple tasks needing sustained step-by-step reasoning or physical intuition. Passing professional exams and working reliably on a real task are different capabilities."
          },
          {
            "ru": "Прогнозы сроков расходятся на десятилетия и исходят от людей, у которых есть интерес в ответе. Это не значит, что они неискренни, но означает, что относиться к точным датам стоит осторожно.",
            "en": "Timeline forecasts differ by decades and come from people with a stake in the answer. That does not make them insincere, but it does mean specific dates deserve caution."
          }
        ]
      },
      {
        "heading": {
          "ru": "Как читать заявления об AGI",
          "en": "How to read claims about AGI"
        },
        "bullets": [
          {
            "title": {
              "ru": "Спросите об определении",
              "en": "Ask for the definition"
            },
            "text": {
              "ru": "Заявление «AGI близко» без указания критерия не содержит проверяемого утверждения.",
              "en": "\"AGI is close\" without a stated criterion contains no checkable claim."
            }
          },
          {
            "title": {
              "ru": "Бенчмарк — не то же, что работа",
              "en": "A benchmark is not the job"
            },
            "text": {
              "ru": "Результат на тесте показывает результат на тесте. Задачи из теста часто попадают в обучающие данные.",
              "en": "A test score shows a test score. Test items frequently end up in training data."
            }
          },
          {
            "title": {
              "ru": "Смотрите на провалы, а не на успехи",
              "en": "Watch the failures, not the wins"
            },
            "text": {
              "ru": "Где именно система ошибается, говорит о её устройстве больше, чем список того, что у неё получилось.",
              "en": "Where a system fails says more about how it works than a list of what it managed."
            }
          },
          {
            "title": {
              "ru": "У говорящего есть интерес",
              "en": "The speaker has an interest"
            },
            "text": {
              "ru": "Оценки сроков чаще всего звучат от компаний, привлекающих финансирование под эту задачу.",
              "en": "Timeline estimates most often come from companies raising money against that goal."
            }
          }
        ]
      }
    ],
  },
  {
    slug: 'vector-database',
    term: { ru: 'Векторная база данных', en: 'Vector Database' },
    definition: {
      ru: 'База данных, оптимизированная для хранения и быстрого поиска эмбеддингов (векторов) по смысловой близости, а не по точному текстовому совпадению. Ключевой компонент систем RAG и семантического поиска.',
      en: 'A database optimized for storing and quickly searching embeddings (vectors) by semantic similarity rather than exact text matches. It\'s a key component of RAG systems and semantic search.',
    },
  },
  {
    slug: 'mcp',
    term: { ru: 'MCP (протокол контекста модели)', en: 'MCP (Model Context Protocol)' },
    definition: {
      "ru": "MCP — открытый протокол, описывающий единый способ подключать модели к внешним данным и инструментам. Разработан Anthropic и открыт для всех: интеграция пишется один раз и работает с любым поддерживающим протокол приложением.",
      "en": "MCP is an open protocol defining one standard way to connect models to external data and tools. Created by Anthropic and released openly: an integration is written once and works with any application that supports the protocol."
    },
    updated: '2026-08-11',
    related: [
      "ai-agent",
      "llm",
      "rag",
      "inference",
      "vector-database",
      "context-window"
    ],
    sections: [
      {
        "heading": {
          "ru": "Какую задачу он решает",
          "en": "The problem it solves"
        },
        "paragraphs": [
          {
            "ru": "До протокола каждое приложение придумывало собственный способ дать модели доступ к файлам, базе или API. Интеграция с десятью источниками в трёх приложениях означала тридцать разных реализаций одного и того же.",
            "en": "Before the protocol every application invented its own way of giving a model access to files, a database or an API. Connecting ten sources across three applications meant thirty separate implementations of the same thing."
          },
          {
            "ru": "MCP задаёт общий интерфейс: сервер описывает, какие инструменты и данные он предоставляет, а любой клиент, понимающий протокол, может ими пользоваться. Источник подключается один раз и становится доступен везде.",
            "en": "MCP defines a shared interface: a server describes the tools and data it offers, and any client that speaks the protocol can use them. A source is connected once and becomes available everywhere."
          },
          {
            "ru": "Практическое следствие — модель перестаёт быть замкнутой на своём обучении. Она получает доступ к текущим данным компании, внутренним системам и действиям, оставаясь при этом в границах, которые задал сервер.",
            "en": "The practical consequence is that a model stops being sealed inside its training. It reaches a company's current data, internal systems and actions, while staying inside the boundaries the server defines."
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
              "ru": "Права задаются на стороне сервера",
              "en": "Permissions live on the server"
            },
            "text": {
              "ru": "Что именно модель может прочитать и изменить, решает подключаемый сервер, а не сама модель.",
              "en": "What a model may read and change is decided by the connected server, not by the model."
            }
          },
          {
            "title": {
              "ru": "Подключение — это доверие",
              "en": "Connecting is an act of trust"
            },
            "text": {
              "ru": "Сторонний сервер получает доступ к тому, что вы ему открыли. Ставить его стоит так же осмотрительно, как расширение в браузер.",
              "en": "A third-party server gets access to whatever you open to it. Install one as carefully as you would a browser extension."
            }
          },
          {
            "title": {
              "ru": "Протокол открытый",
              "en": "The protocol is open"
            },
            "text": {
              "ru": "Спецификация публична, реализации существуют для разных языков, и привязки к одному поставщику нет.",
              "en": "The specification is public, implementations exist for several languages, and there is no lock-in to one vendor."
            }
          },
          {
            "title": {
              "ru": "Это не замена RAG",
              "en": "It does not replace RAG"
            },
            "text": {
              "ru": "MCP описывает, как подключиться к источнику. Как искать в нём нужное — по-прежнему отдельная задача.",
              "en": "MCP describes how to connect to a source. How to find the right thing inside it remains a separate problem."
            }
          }
        ]
      }
    ],
  },
];
