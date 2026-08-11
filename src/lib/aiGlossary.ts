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
      "ru": "Инференс — работа уже обученной модели: она получает запрос и выдаёт ответ. В отличие от обучения, веса при этом не меняются, и именно за инференс вы платите, пользуясь ИИ-сервисом.",
      "en": "Inference is a trained model doing its job: it takes a request and produces an answer. Unlike training, the weights do not change, and inference is what you pay for when using an AI service."
    },
    updated: '2026-08-11',
    related: [
      "llm",
      "model-weights",
      "token-ai",
      "context-window",
      "neural-network",
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
            "ru": "Запрос превращается в токены, проходит через все слои модели, и на выходе получается распределение вероятностей для следующего токена. Из него выбирается один, добавляется к тексту, и всё повторяется — токен за токеном, пока ответ не закончится.",
            "en": "A request becomes tokens, passes through every layer, and out comes a probability distribution for the next token. One is chosen, appended to the text, and the whole thing repeats, token by token, until the answer ends."
          },
          {
            "ru": "Поэтому ответ и печатается постепенно: он в буквальном смысле создаётся по кусочку. И поэтому длинный ответ стоит дороже короткого — работа выполняется заново для каждого токена.",
            "en": "That is why an answer appears gradually: it is literally being produced piece by piece. And why a long answer costs more than a short one: the work is redone for every token."
          },
          {
            "ru": "Настройка «температуры» управляет выбором из распределения. Ниже — модель чаще берёт самый вероятный вариант и отвечает предсказуемо; выше — допускает менее вероятные, что даёт разнообразие вместе с большим риском ошибки.",
            "en": "A temperature setting controls how the choice is made. Lower means the model more often takes the likeliest option and answers predictably; higher admits less likely ones, which brings variety along with more risk of error."
          }
        ]
      },
      {
        "heading": {
          "ru": "Что влияет на цену и скорость",
          "en": "What drives cost and speed"
        },
        "bullets": [
          {
            "title": {
              "ru": "Считаются вход и выход",
              "en": "Input and output both count"
            },
            "text": {
              "ru": "Платите и за отправленный контекст, и за сгенерированный ответ, обычно по разным ставкам.",
              "en": "You pay for the context sent and for the answer generated, usually at different rates."
            }
          },
          {
            "title": {
              "ru": "Длинная переписка дорожает",
              "en": "A long thread gets expensive"
            },
            "text": {
              "ru": "Вся история отправляется заново с каждым сообщением, поэтому стоимость растёт по ходу разговора.",
              "en": "The whole history is resent with every message, so cost climbs as the conversation goes on."
            }
          },
          {
            "title": {
              "ru": "Размер модели решает",
              "en": "Model size decides"
            },
            "text": {
              "ru": "Модель поменьше отвечает быстрее и дешевле. Для простых задач крупная — это переплата без выигрыша.",
              "en": "A smaller model answers faster and cheaper. For simple tasks a large one is overpayment with no gain."
            }
          },
          {
            "title": {
              "ru": "Кэширование контекста",
              "en": "Context caching"
            },
            "text": {
              "ru": "Многие провайдеры дешевле считают повторно отправляемую неизменную часть запроса. На длинных промптах экономия заметная.",
              "en": "Many providers charge less for an unchanged part of a request that is resent. On long prompts the saving is significant."
            }
          }
        ]
      }
    ],
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
      "ru": "Мультимодальная модель работает не только с текстом, но и с изображениями, звуком или видео — в одном и том же механизме. Можно показать ей график и спросить о нём словами, получив текстовый ответ.",
      "en": "A multimodal model works not only with text but with images, audio or video, inside the same mechanism. You can show it a chart, ask about it in words and get a written answer."
    },
    updated: '2026-08-11',
    related: [
      "llm",
      "embedding",
      "transformer",
      "diffusion-model",
      "foundation-model",
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
            "ru": "Разные типы данных приводятся к общему виду — векторам. Картинка нарезается на фрагменты, каждый превращается в набор чисел, и дальше модель обрабатывает их тем же механизмом внимания, что и слова. Для неё это одна последовательность, а не два разных мира.",
            "en": "Different data types are brought to a common form: vectors. An image is cut into patches, each becomes a set of numbers, and the model then processes them with the same attention mechanism it uses for words. To it this is one sequence, not two separate worlds."
          },
          {
            "ru": "Отсюда возможность связывать модальности. Модель отвечает на вопрос о содержимом фотографии, читает текст со скриншота, описывает график или находит несоответствие между таблицей и подписью к ней.",
            "en": "Which is what lets modalities be linked. The model answers a question about a photograph's contents, reads text from a screenshot, describes a chart, or spots a mismatch between a table and its caption."
          },
          {
            "ru": "Изображения дороже текста: одна картинка занимает сотни или тысячи токенов в зависимости от разрешения. При работе с документами это заметно влияет и на стоимость, и на то, сколько поместится в контекст.",
            "en": "Images cost more than text: a single picture takes hundreds or thousands of tokens depending on resolution. Working with documents, that noticeably affects both the bill and how much fits in the context."
          }
        ]
      },
      {
        "heading": {
          "ru": "Где это применяют",
          "en": "Where it is used"
        },
        "bullets": [
          {
            "title": {
              "ru": "Разбор документов и скриншотов",
              "en": "Reading documents and screenshots"
            },
            "text": {
              "ru": "Извлечь данные из счёта, таблицы или снимка экрана — самое частое практическое применение.",
              "en": "Pulling data out of an invoice, a table or a screen capture is the most common practical use."
            }
          },
          {
            "title": {
              "ru": "Проверка графиков и схем",
              "en": "Checking charts and diagrams"
            },
            "text": {
              "ru": "Модель находит расхождение между цифрами в тексте и тем, что показано на изображении.",
              "en": "The model spots a discrepancy between figures in the text and what an image shows."
            }
          },
          {
            "title": {
              "ru": "Доступность",
              "en": "Accessibility"
            },
            "text": {
              "ru": "Описание изображений словами и распознавание речи закрывают задачи, которые раньше требовали отдельных систем.",
              "en": "Describing images in words and transcribing speech cover tasks that used to need separate systems."
            }
          },
          {
            "title": {
              "ru": "Мелкий текст всё ещё проблема",
              "en": "Fine print remains a problem"
            },
            "text": {
              "ru": "На плотных таблицах и низком разрешении ошибки чтения обычны. Важные цифры стоит перепроверять.",
              "en": "On dense tables and low resolution, reading errors are common. Important numbers deserve rechecking."
            }
          }
        ]
      }
    ],
  },
  {
    slug: 'rlhf',
    term: { ru: 'RLHF (обучение с подкреплением на основе обратной связи людей)', en: 'RLHF (Reinforcement Learning from Human Feedback)' },
    definition: {
      "ru": "RLHF — дообучение модели на человеческих оценках: люди сравнивают варианты ответов, на этих сравнениях учится отдельная модель-судья, и по её оценкам настраивается основная. Так модель учат быть полезной, а не просто правдоподобной.",
      "en": "RLHF trains a model on human preferences: people compare candidate answers, a separate judge model learns from those comparisons, and the main model is tuned against its scores. It is how a model is taught to be useful rather than merely plausible."
    },
    updated: '2026-08-11',
    related: [
      "fine-tuning",
      "llm",
      "foundation-model",
      "model-weights",
      "hallucination",
      "neural-network"
    ],
    sections: [
      {
        "heading": {
          "ru": "Зачем это нужно",
          "en": "Why it is needed"
        },
        "paragraphs": [
          {
            "ru": "После предобучения модель умеет продолжать текст, но не отвечать на вопросы. На «как испечь хлеб» она может выдать список похожих вопросов — потому что в интернете именно так и выглядят страницы. Это правдоподобное продолжение, но бесполезный ответ.",
            "en": "After pre-training a model can continue text but not answer questions. Asked how to bake bread it might produce a list of similar questions, because that is what such pages look like online. A plausible continuation and a useless answer."
          },
          {
            "ru": "RLHF закрывает этот разрыв. Людям показывают несколько вариантов ответа, они выбирают лучший, и модель настраивается выдавать то, что люди предпочитают. Отсюда привычный формат диалога, отказ от вредных запросов и признание незнания.",
            "en": "RLHF closes that gap. People are shown several candidate answers, they pick the better one, and the model is tuned toward what people prefer. Hence the familiar conversational format, refusals on harmful requests and admissions of not knowing."
          },
          {
            "ru": "Побочные эффекты тоже отсюда. Склонность соглашаться с собеседником, многословие и осторожные оговорки — это то, что оценщики систематически предпочитали, а модель добросовестно усвоила.",
            "en": "The side effects come from the same place. A tendency to agree with the user, verbosity and hedged caveats are what raters systematically preferred, and the model dutifully learned it."
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
              "ru": "Оценки — это чьи-то оценки",
              "en": "Preferences belong to someone"
            },
            "text": {
              "ru": "Поведение модели отражает вкусы конкретной группы разметчиков и заданные им инструкции.",
              "en": "A model's manner reflects the tastes of a specific group of raters and the instructions they were given."
            }
          },
          {
            "title": {
              "ru": "Полезность и правдивость — разные цели",
              "en": "Helpful and truthful are different targets"
            },
            "text": {
              "ru": "Уверенный ответ нравится людям больше осторожного, поэтому обучение на предпочтениях само по себе не убирает выдумки.",
              "en": "People prefer a confident answer to a cautious one, so preference training by itself does not remove invention."
            }
          },
          {
            "title": {
              "ru": "Соглашательство — известная проблема",
              "en": "Sycophancy is a known failure"
            },
            "text": {
              "ru": "Если настаивать на неверном утверждении, модель склонна согласиться. Это прямое следствие обучения на одобрении.",
              "en": "Push a wrong claim and a model tends to agree. That is a direct consequence of training on approval."
            }
          },
          {
            "title": {
              "ru": "Есть более дешёвые варианты",
              "en": "Cheaper variants exist"
            },
            "text": {
              "ru": "Подходы вроде обучения по прямым предпочтениям дают похожий результат без отдельной модели-судьи.",
              "en": "Approaches such as direct preference optimisation reach a similar result without a separate judge model."
            }
          }
        ]
      }
    ],
  },
  {
    slug: 'diffusion-model',
    term: { ru: 'Диффузионная модель', en: 'Diffusion Model' },
    definition: {
      "ru": "Диффузионная модель создаёт изображение, постепенно убирая шум: начинает со случайных пикселей и за десятки шагов превращает их в картинку, соответствующую запросу. На этом принципе работает большинство генераторов изображений.",
      "en": "A diffusion model creates an image by gradually removing noise: it starts from random pixels and over dozens of steps turns them into a picture matching the request. Most image generators work this way."
    },
    updated: '2026-08-11',
    related: [
      "neural-network",
      "multimodal-ai",
      "embedding",
      "inference",
      "model-weights",
      "foundation-model"
    ],
    sections: [
      {
        "heading": {
          "ru": "Как это работает",
          "en": "How it works"
        },
        "paragraphs": [
          {
            "ru": "При обучении к настоящим изображениям пошагово добавляют шум, пока не останется случайность, и модель учится обращать этот процесс — предсказывать, как выглядел кадр на шаг раньше. Научившись этому, она умеет идти от чистого шума к изображению.",
            "en": "In training, noise is added to real images step by step until only randomness remains, and the model learns to reverse the process, predicting what the frame looked like one step earlier. Having learned that, it can walk from pure noise to an image."
          },
          {
            "ru": "Текстовый запрос направляет этот путь. Описание превращается в вектор, и на каждом шаге очистки модель сдвигает результат в сторону соответствия ему. Поэтому одна и та же формулировка при разном начальном шуме даёт разные картинки.",
            "en": "A text prompt steers the path. The description becomes a vector, and at every denoising step the model nudges the result toward matching it. Which is why the same wording with different starting noise yields different pictures."
          },
          {
            "ru": "Число шагов определяет компромисс между качеством и скоростью: меньше шагов — быстрее и грубее, больше — дольше и детальнее.",
            "en": "The number of steps sets the trade-off between quality and speed: fewer steps are faster and rougher, more are slower and finer."
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
              "ru": "Модель не копирует картинки",
              "en": "It does not copy pictures"
            },
            "text": {
              "ru": "Она усвоила закономерности, а не хранит исходные изображения. Хотя при переобучении отдельные фрагменты воспроизводятся почти дословно.",
              "en": "It absorbed patterns rather than storing source images, though overfitting can reproduce individual fragments almost verbatim."
            }
          },
          {
            "title": {
              "ru": "Текст на изображениях даётся тяжело",
              "en": "Text inside images is hard"
            },
            "text": {
              "ru": "Буквы для такой модели — та же текстура, что и всё остальное, поэтому надписи часто выходят искажёнными.",
              "en": "Letters are just another texture to such a model, which is why captions often come out garbled."
            }
          },
          {
            "title": {
              "ru": "Права на результат неочевидны",
              "en": "Rights to the output are unsettled"
            },
            "text": {
              "ru": "Правовой статус сгенерированных изображений и обучающих данных различается по юрисдикциям и продолжает меняться.",
              "en": "The legal status of generated images and of training data differs by jurisdiction and keeps changing."
            }
          },
          {
            "title": {
              "ru": "Одинаковый запрос — разный результат",
              "en": "The same prompt, different results"
            },
            "text": {
              "ru": "Повторяемость обеспечивается фиксацией начального шума, а не текстом запроса.",
              "en": "Reproducibility comes from fixing the starting noise, not from the wording of the prompt."
            }
          }
        ]
      }
    ],
  },
  {
    slug: 'foundation-model',
    term: { ru: 'Foundation model (базовая модель)', en: 'Foundation Model' },
    definition: {
      "ru": "Базовая модель — крупная модель, обученная на широких данных и предназначенная не для одной задачи, а как основа для многих. Её адаптируют промптами, дообучением или инструментами вместо того, чтобы обучать новую с нуля.",
      "en": "A foundation model is a large model trained on broad data and intended not for one task but as a base for many. It is adapted with prompts, fine-tuning or tools instead of training something new from scratch."
    },
    updated: '2026-08-11',
    related: [
      "llm",
      "fine-tuning",
      "model-weights",
      "rlhf",
      "multimodal-ai",
      "neural-network"
    ],
    sections: [
      {
        "heading": {
          "ru": "Что изменил этот подход",
          "en": "What the approach changed"
        },
        "paragraphs": [
          {
            "ru": "Раньше под каждую задачу обучали отдельную модель на размеченных данных: одна для тональности отзывов, другая для классификации писем, третья для перевода. Каждая требовала своего набора данных и своей команды.",
            "en": "Previously each task got its own model trained on labelled data: one for review sentiment, another for email classification, a third for translation. Each needed its own dataset and its own team."
          },
          {
            "ru": "Базовая модель обучается один раз на огромном общем корпусе, а дальше применяется ко всем этим задачам без переобучения. Стоимость входа для прикладной задачи упала с месяцев работы до нескольких строк запроса.",
            "en": "A foundation model is trained once on a huge general corpus and then applied to all those tasks without retraining. The cost of entry for an applied problem fell from months of work to a few lines of prompt."
          },
          {
            "ru": "Оборотная сторона — концентрация. Обучение таких моделей по силам единицам компаний, и остальные строят на чужом фундаменте, наследуя его ограничения и смещения.",
            "en": "The flip side is concentration. Training such models is within reach of a handful of companies, and everyone else builds on someone else's foundation, inheriting its limits and biases."
          }
        ]
      },
      {
        "heading": {
          "ru": "Как их адаптируют",
          "en": "How they are adapted"
        },
        "bullets": [
          {
            "title": {
              "ru": "Промпт",
              "en": "Prompting"
            },
            "text": {
              "ru": "Самый дешёвый способ: задача описывается словами и примерами прямо в запросе. Ничего не меняется в модели.",
              "en": "The cheapest route: the task is described in words and examples inside the request. Nothing in the model changes."
            }
          },
          {
            "title": {
              "ru": "RAG",
              "en": "RAG"
            },
            "text": {
              "ru": "Добавляет знания, которых у модели не было: свежие или закрытые данные подставляются в контекст.",
              "en": "Adds knowledge the model lacked: fresh or private data is placed into the context."
            }
          },
          {
            "title": {
              "ru": "Дообучение",
              "en": "Fine-tuning"
            },
            "text": {
              "ru": "Меняет поведение: стиль, формат, узкую специализацию. Дороже промпта, но устойчивее.",
              "en": "Changes behaviour: style, format, a narrow specialisation. Costlier than prompting and more consistent."
            }
          },
          {
            "title": {
              "ru": "Инструменты",
              "en": "Tools"
            },
            "text": {
              "ru": "Доступ к поиску, коду и внешним системам расширяет возможности, не трогая саму модель.",
              "en": "Access to search, code and external systems extends what it can do without touching the model."
            }
          }
        ]
      }
    ],
  },
  {
    slug: 'chain-of-thought',
    term: { ru: 'Chain-of-thought (цепочка рассуждений)', en: 'Chain-of-Thought' },
    definition: {
      "ru": "Цепочка рассуждений — приём, при котором модель проговаривает промежуточные шаги перед ответом. На задачах со счётом и логикой это заметно повышает точность по сравнению с ответом сразу.",
      "en": "Chain-of-thought is the technique of having a model work through intermediate steps before answering. On counting and logic tasks it measurably improves accuracy compared with answering straight away."
    },
    updated: '2026-08-11',
    related: [
      "prompt-engineering",
      "llm",
      "hallucination",
      "few-shot-learning",
      "inference",
      "ai-agent"
    ],
    sections: [
      {
        "heading": {
          "ru": "Почему это работает",
          "en": "Why it works"
        },
        "paragraphs": [
          {
            "ru": "Модель тратит примерно одинаковые вычисления на каждый токен. Отвечая сразу, она обязана уместить всю задачу в один шаг. Проговаривая рассуждение, она получает больше шагов на ту же задачу — и каждый следующий опирается на записанный предыдущий.",
            "en": "A model spends roughly the same computation on every token. Answering immediately forces the whole problem into a single step. Writing out the reasoning gives it more steps for the same problem, each building on the previous one now written down."
          },
          {
            "ru": "Промежуточные шаги играют роль внешней памяти. Модель не держит вычисление «в уме» — она видит его в тексте перед собой, и это заметно снижает число арифметических и логических промахов.",
            "en": "The intermediate steps act as external memory. The model does not hold the calculation \"in its head\"; it sees it in the text in front of it, which cuts arithmetic and logic slips noticeably."
          },
          {
            "ru": "Побочная польза — проверяемость. Видя ход рассуждения, вы находите, где именно оно свернуло не туда, вместо того чтобы гадать по одному итоговому числу.",
            "en": "A side benefit is checkability. Seeing the reasoning, you can find where it went wrong instead of guessing from a single final number."
          }
        ]
      },
      {
        "heading": {
          "ru": "Как применять",
          "en": "How to use it"
        },
        "bullets": [
          {
            "title": {
              "ru": "Просите шаги до вывода",
              "en": "Ask for steps before the conclusion"
            },
            "text": {
              "ru": "Формулировка «сначала разбери по шагам, потом дай ответ» работает и на самых простых моделях.",
              "en": "\"Work through it step by step, then give the answer\" works even on simple models."
            }
          },
          {
            "title": {
              "ru": "Не для всех задач",
              "en": "Not for every task"
            },
            "text": {
              "ru": "На переводе, пересказе и стилистической правке рассуждение только удлиняет ответ и увеличивает счёт.",
              "en": "On translation, summarising and copy-editing, reasoning only lengthens the answer and raises the bill."
            }
          },
          {
            "title": {
              "ru": "Рассуждение можно скрыть",
              "en": "The reasoning can be hidden"
            },
            "text": {
              "ru": "Попросите изложить ход мысли, а затем выдать только итог — качество останется, а ответ будет коротким.",
              "en": "Ask it to reason and then output only the conclusion: the quality stays and the answer is short."
            }
          },
          {
            "title": {
              "ru": "Правдоподобное рассуждение бывает ложным",
              "en": "Plausible reasoning can still be wrong"
            },
            "text": {
              "ru": "Записанные шаги не гарантируют верность. Они лишь дают возможность проверить, а не заменяют проверку.",
              "en": "Written-out steps do not guarantee correctness. They make checking possible; they do not replace it."
            }
          }
        ]
      }
    ],
  },
  {
    slug: 'neural-network',
    term: { ru: 'Нейронная сеть', en: 'Neural Network' },
    definition: {
      "ru": "Нейросеть — вычислительная модель из слоёв простых элементов, связанных числовыми весами. Она ничего не программируется вручную: нужное поведение получается настройкой этих весов на примерах.",
      "en": "A neural network is a computational model built from layers of simple units connected by numeric weights. Nothing in it is programmed by hand: the behaviour comes from tuning those weights on examples."
    },
    updated: '2026-08-11',
    related: [
      "model-weights",
      "transformer",
      "llm",
      "inference",
      "fine-tuning",
      "diffusion-model"
    ],
    sections: [
      {
        "heading": {
          "ru": "Как это работает",
          "en": "How it works"
        },
        "paragraphs": [
          {
            "ru": "Входные данные проходят через слои. В каждом слое числа умножаются на веса, складываются и пропускаются через простую нелинейную функцию. Ни один элемент по отдельности ничего не «понимает» — поведение возникает из их сочетания.",
            "en": "Input passes through layers. In each layer numbers are multiplied by weights, summed and pushed through a simple non-linear function. No single unit \"understands\" anything; the behaviour emerges from the combination."
          },
          {
            "ru": "Обучение — это подбор весов. Модели показывают пример, сравнивают её ответ с правильным, вычисляют ошибку и слегка сдвигают все веса в сторону её уменьшения. Повторив это миллионы раз, получают работающую сеть.",
            "en": "Training is weight-fitting. The model is shown an example, its answer is compared with the correct one, the error is computed and every weight is nudged to reduce it. Repeat that millions of times and you have a working network."
          },
          {
            "ru": "Отсюда главное следствие: объяснить, почему сеть ответила именно так, обычно невозможно. Знание не лежит в конкретном месте, оно размазано по миллиардам чисел.",
            "en": "Hence the key consequence: explaining why a network gave a particular answer is usually impossible. The knowledge sits nowhere specific; it is spread across billions of numbers."
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
              "ru": "Данные важнее архитектуры",
              "en": "Data matters more than architecture"
            },
            "text": {
              "ru": "Качество и состав обучающего набора определяют результат сильнее, чем устройство самой сети.",
              "en": "The quality and composition of the training set drive the result more than the network's design."
            }
          },
          {
            "title": {
              "ru": "Смещения наследуются",
              "en": "Bias is inherited"
            },
            "text": {
              "ru": "Всё, что систематически встречалось в данных, воспроизведётся в ответах, включая нежелательное.",
              "en": "Whatever appeared systematically in the data reappears in the answers, including what nobody wanted."
            }
          },
          {
            "title": {
              "ru": "Обучение и работа — разные вещи",
              "en": "Training and running differ"
            },
            "text": {
              "ru": "Обучение стоит дорого и делается однажды. Использование готовой модели на порядки дешевле.",
              "en": "Training is expensive and happens once. Running a finished model costs orders of magnitude less."
            }
          }
        ]
      }
    ],
  },
  {
    slug: 'model-weights',
    term: { ru: 'Веса модели', en: 'Model Weights' },
    definition: {
      "ru": "Веса модели — те самые миллиарды чисел, которые получились в результате обучения. Это и есть модель: архитектура без весов бесполезна, а веса без неё — просто файл.",
      "en": "Model weights are the billions of numbers that training produced. They are the model: an architecture without weights is useless, and weights without it are just a file."
    },
    updated: '2026-08-11',
    related: [
      "neural-network",
      "fine-tuning",
      "foundation-model",
      "inference",
      "llm",
      "transformer"
    ],
    sections: [
      {
        "heading": {
          "ru": "Открытые и закрытые веса",
          "en": "Open and closed weights"
        },
        "paragraphs": [
          {
            "ru": "Часть разработчиков публикует веса: модель можно скачать, запустить у себя, дообучить и изучить. Другая часть держит их у себя, давая доступ только через API. От этого зависит, кому принадлежат ваши данные и что будет, если поставщик изменит условия.",
            "en": "Some developers publish their weights: the model can be downloaded, run locally, fine-tuned and inspected. Others keep them in-house and give access only through an API. That choice decides who holds your data and what happens if the provider changes terms."
          },
          {
            "ru": "«Открытые веса» — не то же самое, что открытый исходный код. Обучающие данные и сам процесс обучения почти никогда не публикуются, а лицензии часто ограничивают коммерческое использование. Воспроизвести модель с нуля по одним весам нельзя.",
            "en": "\"Open weights\" is not the same as open source. The training data and the training process are almost never published, and licences often restrict commercial use. Weights alone do not let anyone reproduce the model."
          },
          {
            "ru": "Размер файла весов задаёт требования к железу. Модели поменьше запускаются на обычном ноутбуке, крупные требуют серверных видеокарт — и именно поэтому большинство пользуется API, а не своим сервером.",
            "en": "The size of the weights file sets the hardware requirement. Smaller models run on an ordinary laptop; large ones need server-grade GPUs, which is why most people use an API rather than their own machine."
          }
        ]
      },
      {
        "heading": {
          "ru": "Что из этого следует",
          "en": "What follows from it"
        },
        "bullets": [
          {
            "title": {
              "ru": "Свои веса — свои данные",
              "en": "Your weights, your data"
            },
            "text": {
              "ru": "Локальный запуск означает, что запросы не покидают вашу инфраструктуру. Для чувствительных данных это часто решающий аргумент.",
              "en": "Running locally means requests never leave your infrastructure. For sensitive data that is often the deciding argument."
            }
          },
          {
            "title": {
              "ru": "Закрытая модель может измениться",
              "en": "A closed model can change"
            },
            "text": {
              "ru": "Поставщик обновляет модель на своей стороне, и поведение меняется без вашего участия. Скачанные веса — нет.",
              "en": "A provider updates the model on their side and behaviour shifts without your involvement. Downloaded weights do not."
            }
          },
          {
            "title": {
              "ru": "Проверяйте лицензию",
              "en": "Read the licence"
            },
            "text": {
              "ru": "Доступность скачивания не равна праву на коммерческое использование. Условия у разных моделей расходятся сильно.",
              "en": "Being downloadable is not the same as being licensed for commercial use. Terms differ substantially between models."
            }
          }
        ]
      }
    ],
  },
  {
    slug: 'few-shot-learning',
    term: { ru: 'Few-shot / zero-shot обучение', en: 'Few-shot / Zero-shot Learning' },
    definition: {
      "ru": "Few-shot — приём, при котором в запрос кладут несколько примеров нужного ответа, и модель повторяет их формат. Zero-shot — тот же запрос без примеров, только с инструкцией.",
      "en": "Few-shot means putting a handful of example answers into the request so the model copies their format. Zero-shot is the same request with instructions only and no examples."
    },
    updated: '2026-08-11',
    related: [
      "prompt-engineering",
      "llm",
      "fine-tuning",
      "context-window",
      "chain-of-thought",
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
            "ru": "Модель ничему не учится в процессе — веса не меняются. Примеры просто оказываются в контексте, и продолжение текста естественным образом наследует их структуру. Формально это не обучение, а очень точное указание формата.",
            "en": "The model learns nothing in the process; the weights do not change. The examples simply sit in the context, and the continuation naturally inherits their structure. Strictly it is not learning but a very precise statement of the format."
          },
          {
            "ru": "Поэтому пара образцов работает лучше абзаца объяснений. Показать, как должен выглядеть ответ, почти всегда короче и надёжнее, чем описать это словами.",
            "en": "Which is why a couple of samples beat a paragraph of explanation. Showing what an answer should look like is almost always shorter and more reliable than describing it."
          },
          {
            "ru": "Обратная сторона: модель копирует и то, чего вы не имели в виду. Если во всех примерах ответ начинается с глагола или уложен в две строки, она сочтёт это частью задания.",
            "en": "The flip side: the model copies what you did not intend as well. If every example starts with a verb or fits two lines, it will treat that as part of the brief."
          }
        ]
      },
      {
        "heading": {
          "ru": "Как составлять примеры",
          "en": "How to choose examples"
        },
        "bullets": [
          {
            "title": {
              "ru": "Два-три достаточно",
              "en": "Two or three is enough"
            },
            "text": {
              "ru": "Больше примеров занимают контекст и редко улучшают результат после третьего.",
              "en": "More examples consume context and rarely improve the result past the third."
            }
          },
          {
            "title": {
              "ru": "Включите сложный случай",
              "en": "Include a hard case"
            },
            "text": {
              "ru": "Пример с исключением объясняет границы задачи лучше, чем три одинаково простых.",
              "en": "One example containing an exception conveys the task's boundaries better than three easy ones."
            }
          },
          {
            "title": {
              "ru": "Следите за случайными закономерностями",
              "en": "Watch for accidental patterns"
            },
            "text": {
              "ru": "Одинаковая длина, порядок или тон во всех примерах будут воспроизведены как требование.",
              "en": "Matching length, order or tone across all examples will be reproduced as a requirement."
            }
          },
          {
            "title": {
              "ru": "Если примеров нужно много — это дообучение",
              "en": "If you need many, that is fine-tuning"
            },
            "text": {
              "ru": "Десятки примеров в каждом запросе стоят денег и места. Устойчивое поведение дешевле зашить дообучением.",
              "en": "Dozens of examples in every request cost money and space. Persistent behaviour is cheaper to bake in by fine-tuning."
            }
          }
        ]
      }
    ],
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
      "ru": "Векторная база — хранилище эмбеддингов, умеющее быстро находить ближайшие по смыслу записи. Это техническая основа RAG: именно она отвечает на вопрос, какие фрагменты подставить модели в контекст.",
      "en": "A vector database stores embeddings and finds the closest ones by meaning, fast. It is the technical basis of RAG: it answers the question of which fragments to place into the model's context."
    },
    updated: '2026-08-11',
    related: [
      "embedding",
      "rag",
      "llm",
      "ai-agent",
      "inference",
      "context-window"
    ],
    sections: [
      {
        "heading": {
          "ru": "Как это работает",
          "en": "How it works"
        },
        "paragraphs": [
          {
            "ru": "Обычная база ищет точные совпадения: строку, число, диапазон. Векторная ищет ближайших соседей в пространстве из сотен измерений — то есть записи, похожие по смыслу, а не по написанию.",
            "en": "An ordinary database looks for exact matches: a string, a number, a range. A vector database looks for nearest neighbours in a space of hundreds of dimensions, meaning records similar in meaning rather than in spelling."
          },
          {
            "ru": "Точный перебор всех векторов при миллионах записей слишком медленный, поэтому используется приближённый поиск: он жертвует небольшой долей точности ради ответа за миллисекунды. Этот компромисс настраивается.",
            "en": "Exhaustive comparison across millions of records is too slow, so approximate search is used: it gives up a small share of accuracy for an answer in milliseconds. That trade-off is configurable."
          },
          {
            "ru": "Отдельная база нужна не всегда. При небольших объёмах расширения к обычным СУБД справляются, и заводить отдельную систему стоит, когда счёт идёт на сотни тысяч фрагментов.",
            "en": "A dedicated database is not always necessary. At modest volumes, extensions to ordinary relational systems cope, and a separate one earns its place when fragments run into the hundreds of thousands."
          }
        ]
      },
      {
        "heading": {
          "ru": "Что решает качество",
          "en": "What decides quality"
        },
        "bullets": [
          {
            "title": {
              "ru": "Нарезка документов",
              "en": "How documents are chunked"
            },
            "text": {
              "ru": "Слишком мелкие фрагменты теряют контекст, слишком крупные размывают поиск. Это главная настройка всей схемы.",
              "en": "Chunks too small lose context, chunks too large blur retrieval. This is the main knob in the design."
            }
          },
          {
            "title": {
              "ru": "Одна модель эмбеддингов",
              "en": "One embedding model"
            },
            "text": {
              "ru": "Индексация и поиск должны идти одной моделью. Сменили её — базу нужно строить заново.",
              "en": "Indexing and querying must use the same model. Change it and the store has to be rebuilt."
            }
          },
          {
            "title": {
              "ru": "Фильтры по метаданным",
              "en": "Metadata filters"
            },
            "text": {
              "ru": "Дата, автор, раздел рядом с вектором позволяют сузить поиск до актуального, а не искать по всему архиву.",
              "en": "A date, an author or a section stored alongside the vector narrows retrieval to what is current instead of the whole archive."
            }
          },
          {
            "title": {
              "ru": "Гибридный поиск обычно лучше",
              "en": "Hybrid search usually wins"
            },
            "text": {
              "ru": "Сочетание векторного поиска с обычным по ключевым словам находит и смысл, и точные термины вроде артикулов.",
              "en": "Combining vector search with plain keyword search catches both meaning and exact terms like part numbers."
            }
          }
        ]
      }
    ],
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
