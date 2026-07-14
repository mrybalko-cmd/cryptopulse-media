import type { GlossaryTerm } from './glossary';

export const AI_GLOSSARY: GlossaryTerm[] = [
  {
    slug: 'llm',
    term: { ru: 'LLM (большая языковая модель)', en: 'LLM (Large Language Model)' },
    definition: {
      ru: 'Нейросеть, обученная на огромных объёмах текста и способная понимать и генерировать человеческий язык. Примеры: GPT, Claude, Gemini, Grok. Лежит в основе большинства современных чат-ботов и ИИ-ассистентов.',
      en: 'A neural network trained on massive amounts of text that can understand and generate human language. Examples include GPT, Claude, Gemini, and Grok. It powers most modern chatbots and AI assistants.',
    },
  },
  {
    slug: 'transformer',
    term: { ru: 'Трансформер', en: 'Transformer' },
    definition: {
      ru: 'Архитектура нейросети, представленная в 2017 году в статье «Attention Is All You Need», которая лежит в основе почти всех современных LLM. Её ключевая идея — механизм внимания (attention), позволяющий модели учитывать связи между всеми словами текста одновременно.',
      en: 'The neural network architecture introduced in the 2017 paper "Attention Is All You Need" that underlies almost every modern LLM. Its key idea is the attention mechanism, which lets the model weigh the relationships between all words in a text simultaneously.',
    },
  },
  {
    slug: 'prompt-engineering',
    term: { ru: 'Промпт-инжиниринг', en: 'Prompt Engineering' },
    definition: {
      ru: 'Искусство и практика составления запросов (промптов) к ИИ так, чтобы получить максимально точный и полезный ответ. Включает формулировку задачи, добавление примеров и контекста, уточнение формата вывода.',
      en: 'The art and practice of crafting prompts to an AI so that it produces the most accurate and useful response. It includes phrasing the task clearly, adding examples and context, and specifying the desired output format.',
    },
  },
  {
    slug: 'rag',
    term: { ru: 'RAG (генерация с дополнением поиском)', en: 'RAG (Retrieval-Augmented Generation)' },
    definition: {
      ru: 'Техника, при которой модель перед ответом сначала находит релевантные документы во внешней базе знаний, а затем использует их как контекст для генерации. Снижает риск галлюцинаций и позволяет отвечать на вопросы про свежие или узкоспециализированные данные.',
      en: 'A technique where the model first retrieves relevant documents from an external knowledge base, then uses them as context to generate its answer. It reduces hallucinations and lets the model answer questions about recent or highly specialized data.',
    },
  },
  {
    slug: 'fine-tuning',
    term: { ru: 'Файнтюнинг (дообучение)', en: 'Fine-tuning' },
    definition: {
      ru: 'Дополнительное обучение уже готовой модели на узком наборе данных, чтобы адаптировать её под конкретную задачу или стиль — например, юридические документы или тон бренда — без обучения модели с нуля.',
      en: 'Additional training of an already-trained model on a narrow dataset to adapt it to a specific task or style — for example, legal documents or a brand\'s tone — without training the model from scratch.',
    },
  },
  {
    slug: 'hallucination',
    term: { ru: 'Галлюцинация ИИ', en: 'AI Hallucination' },
    definition: {
      ru: 'Ситуация, когда модель уверенно выдаёт неверную или полностью выдуманную информацию как факт — например, несуществующую цитату или ложную статистику. Главная причина, почему ответы ИИ всегда нужно проверять.',
      en: 'A situation where a model confidently states false or entirely made-up information as fact — for example, a nonexistent quote or fabricated statistic. It\'s the main reason AI-generated answers should always be fact-checked.',
    },
  },
  {
    slug: 'context-window',
    term: { ru: 'Контекстное окно', en: 'Context Window' },
    definition: {
      ru: 'Максимальный объём текста (измеряется в токенах), который модель может «видеть» одновременно — включая сам запрос, историю диалога и вложенные файлы. Чем больше окно, тем длиннее документы модель может обрабатывать за раз.',
      en: 'The maximum amount of text (measured in tokens) a model can "see" at once — including the prompt itself, the conversation history, and any attached files. The larger the window, the longer the documents the model can process in one go.',
    },
  },
  {
    slug: 'token-ai',
    term: { ru: 'Токен (в ИИ)', en: 'Token (AI)' },
    definition: {
      ru: 'Минимальная единица текста, с которой работает языковая модель — обычно часть слова, целое слово или знак препинания. Стоимость использования большинства ИИ-моделей рассчитывается именно за количество токенов на входе и выходе.',
      en: 'The smallest unit of text a language model processes — usually part of a word, a whole word, or a punctuation mark. Usage costs for most AI models are billed by the number of input and output tokens.',
    },
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
      ru: 'Числовое представление текста, изображения или другого объекта в виде вектора, где смысловая близость объектов отражается в близости их векторов. Используется для поиска похожих документов и лежит в основе RAG и векторных баз данных.',
      en: 'A numeric representation of text, an image, or another object as a vector, where semantic similarity between objects is reflected in the closeness of their vectors. It\'s used to find similar documents and underlies RAG and vector databases.',
    },
  },
  {
    slug: 'ai-agent',
    term: { ru: 'ИИ-агент', en: 'AI Agent' },
    definition: {
      ru: 'Система на основе LLM, которая может не только отвечать на вопросы, но и самостоятельно планировать шаги, вызывать внешние инструменты (поиск, код, API) и выполнять многошаговые задачи для достижения цели с минимальным участием человека.',
      en: 'An LLM-based system that can not only answer questions but also independently plan steps, call external tools (search, code, APIs), and carry out multi-step tasks to reach a goal with minimal human involvement.',
    },
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
      ru: 'Гипотетический ИИ, способный понимать, обучаться и выполнять любую интеллектуальную задачу на уровне человека или выше — в отличие от современных моделей, которые сильны в конкретных областях, но не обладают универсальным интеллектом. Пока не достигнут; сроки его появления — предмет споров в индустрии.',
      en: 'A hypothetical AI capable of understanding, learning, and performing any intellectual task at a human level or beyond — unlike today\'s models, which excel in specific domains but lack general-purpose intelligence. AGI has not yet been achieved, and its timeline is a subject of debate in the industry.',
    },
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
      ru: 'Открытый стандарт, представленный Anthropic, который позволяет ИИ-моделям единообразно подключаться к внешним источникам данных и инструментам — базам данных, файловым системам, API — без написания отдельной интеграции под каждую комбинацию модели и сервиса.',
      en: 'An open standard introduced by Anthropic that lets AI models connect to external data sources and tools — databases, file systems, APIs — in a uniform way, without writing a separate integration for every model-and-service combination.',
    },
  },
];
