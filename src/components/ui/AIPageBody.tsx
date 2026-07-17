import Link from 'next/link';
import { Zap } from 'lucide-react';
import AuthorFeedItem from './AuthorFeedItem';
import Pagination from './Pagination';
import type { AuthorFeedItem as AIFeedItem } from '@/lib/sanity';

type Props = {
  locale: string;
  items: AIFeedItem[];
  total: number;
  page: number;
  pageSize: number;
};

const FAQ = [
  {
    slug: 'ai-vs-algorithm',
    question: {
      ru: 'Чем искусственный интеллект отличается от обычного алгоритма?',
      en: "What's the difference between AI and a regular algorithm?",
    },
    answer: {
      ru: 'Обычный алгоритм следует заранее прописанным правилам «если — то». Искусственный интеллект (в первую очередь нейросети) сам находит закономерности в данных на этапе обучения и потом применяет их к новым, ранее не встречавшимся примерам — поэтому один и тот же LLM может отвечать на вопросы, которые никто заранее не предусмотрел.',
      en: 'A regular algorithm follows pre-written "if this, then that" rules. AI — neural networks in particular — learns patterns from data during training and then applies them to new examples it has never seen before, which is why the same LLM can answer questions nobody explicitly programmed it to handle.',
    },
  },
  {
    slug: 'what-is-ai-agent',
    question: {
      ru: 'Что такое AI-агент в контексте криптовалют?',
      en: 'What is an AI agent in a crypto context?',
    },
    answer: {
      ru: 'AI-агент — программа на основе языковой модели, которая не просто отвечает на вопросы, а самостоятельно выполняет многошаговые действия: анализирует рынок, взаимодействует со смарт-контрактами, совершает транзакции в блокчейне. Именно это отличает его от чат-бота — агент действует, а не только отвечает.',
      en: 'An AI agent is an LLM-based program that doesn\'t just answer questions but autonomously carries out multi-step actions — analyzing the market, interacting with smart contracts, executing on-chain transactions. That\'s what separates it from a chatbot: an agent acts, it doesn\'t just respond.',
    },
  },
  {
    slug: 'can-ai-predict-price',
    question: {
      ru: 'Может ли искусственный интеллект предсказывать цену криптовалют?',
      en: 'Can AI predict cryptocurrency prices?',
    },
    answer: {
      ru: 'AI хорошо находит статистические закономерности в исторических данных и может обрабатывать огромные объёмы новостей и ончейн-метрик быстрее человека — это помогает в анализе. Но крипторынок реагирует на непредсказуемые события (регуляторные решения, взломы, твиты влиятельных людей), которые невозможно вывести из прошлых данных, поэтому ни одна модель не даёт гарантированного прогноза цены.',
      en: 'AI is good at finding statistical patterns in historical data and can process huge volumes of news and on-chain metrics faster than a human — that helps with analysis. But the crypto market reacts to unpredictable events (regulatory decisions, hacks, an influential person\'s tweet) that can\'t be derived from past data, so no model offers a guaranteed price forecast.',
    },
  },
  {
    slug: 'safe-to-trust-ai',
    question: {
      ru: 'Безопасно ли доверять AI управление криптоактивами?',
      en: 'Is it safe to let AI manage crypto assets?',
    },
    answer: {
      ru: 'AI-инструменты (боты, агенты) полезны для рутинных задач вроде ребалансировки портфеля по заданным правилам, но полное доверие без контроля рискованно: модель может ошибиться, а мошенники нередко маскируют фишинговые схемы под «AI-трейдинг с гарантированной доходностью». Разумный подход — использовать AI как помощника с чёткими ограничениями, а не как автономного управляющего без надзора.',
      en: 'AI tools (bots, agents) are useful for routine tasks like rebalancing a portfolio by predefined rules, but handing over full control without oversight is risky: a model can make mistakes, and scammers frequently dress up phishing schemes as "AI trading with guaranteed returns." The sensible approach is to use AI as an assistant with clear limits, not as an unsupervised autonomous manager.',
    },
  },
  {
    slug: 'what-is-agi',
    question: {
      ru: 'Что такое AGI и когда его стоит ждать?',
      en: 'What is AGI, and when should we expect it?',
    },
    answer: {
      ru: 'AGI (общий искусственный интеллект) — гипотетическая система, способная решать любые интеллектуальные задачи не хуже человека, в отличие от современных моделей, каждая из которых заточена под конкретный тип задач. Точных сроков появления AGI не существует — оценки исследователей расходятся на десятилетия, и это остаётся предметом открытой дискуссии в индустрии.',
      en: "AGI (Artificial General Intelligence) is a hypothetical system able to handle any intellectual task at a human level, unlike today's models, each of which is tuned for a specific type of task. There's no firm timeline for AGI — researcher estimates vary by decades, and it remains an open debate in the industry.",
    },
  },
];

const AI_GLOSSARY_LINKS = [
  { slug: 'llm', label: { ru: 'LLM', en: 'LLM' } },
  { slug: 'ai-agent', label: { ru: 'ИИ-агент', en: 'AI Agent' } },
  { slug: 'neural-network', label: { ru: 'Нейронная сеть', en: 'Neural Network' } },
  { slug: 'agi', label: { ru: 'AGI', en: 'AGI' } },
  { slug: 'mcp', label: { ru: 'MCP', en: 'MCP' } },
];

const CRYPTO_GLOSSARY_LINKS = [
  { slug: 'smart-contract', label: { ru: 'Смарт-контракт', en: 'Smart contract' } },
  { slug: 'defi', label: { ru: 'DeFi', en: 'DeFi' } },
];

export default function AIPageBody({ locale, items, total, page, pageSize }: Props) {
  const isRu = locale === 'ru';
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const isFirstPage = page === 1;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
            <Zap size={16} className="text-white" fill="currentColor" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            AI{!isFirstPage && <span className="text-muted font-normal text-xl ml-2">— {isRu ? 'страница' : 'page'} {page}</span>}
          </h1>
        </div>
        <p className="text-muted text-sm max-w-2xl">
          {isRu
            ? 'Новости и аналитика об искусственном интеллекте в мире криптовалют и блокчейна — ChatGPT, AI-трейдинг, нейросети, генеративные модели.'
            : 'News and analysis on artificial intelligence in crypto and blockchain — ChatGPT, AI trading, neural networks, generative models.'}
        </p>
        <Link
          href={`/${locale}/ai/glossary`}
          className="inline-flex items-center gap-1.5 text-sm text-accent hover:underline mt-3"
        >
          {isRu ? 'Глоссарий терминов ИИ →' : 'AI terms glossary →'}
        </Link>
      </div>

      {/* Feed — articles and news mixed in one chronological, paginated list */}
      {items.length > 0 ? (
        <>
          <div className="flex flex-col mb-4">
            {items.map((item) => (
              <AuthorFeedItem key={item._id} item={item} locale={locale} />
            ))}
          </div>
          <Pagination
            basePath={`/${locale}/ai`}
            currentPage={page}
            totalPages={totalPages}
            locale={locale}
          />
        </>
      ) : (
        <div className="border border-dashed border-border rounded-xl py-24 flex flex-col items-center justify-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-600/10 flex items-center justify-center">
            <Zap size={24} className="text-blue-400" fill="currentColor" />
          </div>
          <p className="text-muted text-sm text-center max-w-xs">
            {isRu
              ? 'Публикации об AI появятся здесь. Выберите тему "AI & Машинное обучение" при создании статьи или новости в Sanity.'
              : 'AI publications will appear here. Select "AI & Machine Learning" topic when creating an article or news in Sanity.'}
          </p>
        </div>
      )}

      {/* SEO copy, FAQ, and glossary interlinking — page 1 only. Repeating a
          long educational block on every /ai/page/N would read as thin,
          duplicated content stacking up as the archive grows; it belongs on
          the canonical entry point searchers actually land on. */}
      {isFirstPage && (
        <section className="mt-14 pt-10 border-t border-border">
          <h2 className="text-xl font-bold text-foreground mb-4">
            {isRu
              ? 'Что такое искусственный интеллект и почему это важно для крипторынка'
              : 'What Artificial Intelligence Is and Why It Matters for Crypto'}
          </h2>
          <div className="text-sm text-muted leading-relaxed flex flex-col gap-4 max-w-3xl">
            <p>
              {isRu
                ? <>Искусственный интеллект — это программы, которые не следуют жёстко заданным правилам, а сами находят закономерности в данных на этапе обучения и применяют их к новым задачам. В основе большинства современных систем лежит <Link href={`/${locale}/ai/glossary/neural-network`} className="text-accent hover:underline">нейронная сеть</Link> — а самые заметные из них, такие как ChatGPT, устроены как <Link href={`/${locale}/ai/glossary/llm`} className="text-accent hover:underline">LLM</Link> (большая языковая модель), обученная на огромных массивах текста.</>
                : <>Artificial intelligence is software that doesn&apos;t follow rigid, hand-written rules — instead, it learns patterns from data during training and applies them to new tasks. Most modern systems are built on a <Link href={`/${locale}/ai/glossary/neural-network`} className="text-accent hover:underline">neural network</Link>, and the most visible ones, like ChatGPT, are <Link href={`/${locale}/ai/glossary/llm`} className="text-accent hover:underline">LLMs</Link> (Large Language Models) trained on massive amounts of text.</>}
            </p>
            <p>
              {isRu
                ? 'Для крипторынка это давно не абстрактная технология из другой индустрии. AI и блокчейн всё активнее пересекаются: модели анализируют ончейн-данные и новостной фон быстрее любого трейдера-человека, а разработчики создают целый сектор AI-криптопроектов — токенов и протоколов, построенных вокруг машинного обучения. Одновременно растёт и обратное влияние: рост интереса к AI двигает целые категории криптоактивов, а инфраструктура для обучения моделей (вычисления, данные) сама становится объектом токенизации.'
                : "For the crypto market, this stopped being an abstract technology from another industry a while ago. AI and blockchain increasingly overlap: models analyze on-chain data and news flow faster than any human trader, and developers have built an entire sector of AI-crypto projects — tokens and protocols built around machine learning. The influence runs the other way too: rising interest in AI moves whole categories of crypto assets, and the infrastructure behind training models (compute, data) is itself becoming a target for tokenization."}
            </p>
          </div>

          <h3 className="text-base font-bold text-foreground mt-8 mb-4">
            {isRu ? 'Ключевые направления на стыке AI и крипто' : 'Key intersections between AI and crypto'}
          </h3>
          <div className="text-sm text-muted leading-relaxed flex flex-col gap-4 max-w-3xl">
            {isRu ? (
              <>
                <p><strong className="text-foreground">AI-агенты и автономные транзакции</strong> — программы на основе LLM, которые не просто отвечают на вопросы, а самостоятельно взаимодействуют со смарт-контрактами и совершают действия в блокчейне (см. <Link href={`/${locale}/ai/glossary/ai-agent`} className="text-accent hover:underline">ИИ-агент</Link> и <Link href={`/${locale}/ai/glossary/mcp`} className="text-accent hover:underline">MCP</Link> — протокол, который всё чаще используют для подключения агентов к внешним инструментам).</p>
                <p><strong className="text-foreground">Алгоритмический AI-трейдинг</strong> — модели, обрабатывающие рыночные данные и новости для принятия торговых решений быстрее человека, хотя и без гарантии результата (подробнее — в FAQ ниже).</p>
                <p><strong className="text-foreground">Автоматизация через смарт-контракты</strong> — сочетание AI-анализа с <Link href={`/${locale}/glossary/smart-contract`} className="text-accent hover:underline">смарт-контрактами</Link> и протоколами <Link href={`/${locale}/glossary/defi`} className="text-accent hover:underline">DeFi</Link> позволяет автоматизировать целые торговые и кредитные стратегии без участия человека на каждом шаге.</p>
                <p><strong className="text-foreground">Мошенничество и дипфейки</strong> — та же технология, что помогает анализировать рынок, используется и для создания поддельных видео с «инвестиционными советами» от известных людей — рост качества генеративных моделей напрямую увеличивает и этот риск.</p>
                <p><strong className="text-foreground">Перспектива AGI</strong> — разговоры об <Link href={`/${locale}/ai/glossary/agi`} className="text-accent hover:underline">общем искусственном интеллекте</Link> напрямую влияют на настроения в AI-секторе крипторынка, даже если сроки его появления остаются предметом спора.</p>
              </>
            ) : (
              <>
                <p><strong className="text-foreground">AI agents and autonomous transactions</strong> — LLM-based programs that don&apos;t just answer questions but independently interact with smart contracts and take actions on-chain (see <Link href={`/${locale}/ai/glossary/ai-agent`} className="text-accent hover:underline">AI Agent</Link> and <Link href={`/${locale}/ai/glossary/mcp`} className="text-accent hover:underline">MCP</Link> — a protocol increasingly used to connect agents to external tools).</p>
                <p><strong className="text-foreground">Algorithmic AI trading</strong> — models that process market data and news to make trading decisions faster than a human, though without any guarantee of results (more on this in the FAQ below).</p>
                <p><strong className="text-foreground">Automation through smart contracts</strong> — combining AI analysis with <Link href={`/${locale}/glossary/smart-contract`} className="text-accent hover:underline">smart contracts</Link> and <Link href={`/${locale}/glossary/defi`} className="text-accent hover:underline">DeFi</Link> protocols makes it possible to automate entire trading and lending strategies without a human in the loop at every step.</p>
                <p><strong className="text-foreground">Scams and deepfakes</strong> — the same technology that helps analyze markets is also used to produce fake videos of well-known people giving "investment advice" — as generative models improve, this risk grows right along with them.</p>
                <p><strong className="text-foreground">The AGI question</strong> — talk of <Link href={`/${locale}/ai/glossary/agi`} className="text-accent hover:underline">Artificial General Intelligence</Link> directly shapes sentiment across the AI sector of the crypto market, even though its actual timeline remains disputed.</p>
              </>
            )}
          </div>

          {/* FAQ — same expand/collapse <details> pattern as /faq and
              /calendar: click to open, click again to close. */}
          <h3 className="text-base font-bold text-foreground mt-8 mb-4">
            {isRu ? 'Частые вопросы об AI и крипто' : 'Frequently Asked Questions About AI and Crypto'}
          </h3>
          <div className="space-y-2 max-w-3xl">
            {FAQ.map(f => (
              <details
                key={f.slug}
                id={f.slug}
                className="group bg-card border border-border rounded-lg px-4 py-3 open:border-accent/40 scroll-mt-24"
              >
                <summary className="cursor-pointer list-none flex items-start justify-between gap-3 text-sm font-semibold text-foreground">
                  {isRu ? f.question.ru : f.question.en}
                  <span className="text-muted text-xs shrink-0 mt-0.5 group-open:rotate-180 transition-transform">▾</span>
                </summary>
                <p className="text-muted text-sm leading-relaxed mt-2">{isRu ? f.answer.ru : f.answer.en}</p>
              </details>
            ))}
          </div>

          {/* Glossary interlinking — two distinct taxonomies on this site
              (AI glossary vs the main crypto glossary), kept as separate
              chip groups so it's clear which is which. */}
          <div className="grid sm:grid-cols-2 gap-4 mt-8 max-w-3xl">
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="text-sm font-bold text-foreground mb-3">
                {isRu ? 'Термины ИИ в глоссарии' : 'AI terms in our glossary'}
              </h3>
              <div className="flex flex-wrap gap-2">
                {AI_GLOSSARY_LINKS.map(t => (
                  <Link
                    key={t.slug}
                    href={`/${locale}/ai/glossary/${t.slug}`}
                    className="text-xs px-3 py-1.5 rounded-full bg-background border border-border text-muted hover:text-accent hover:border-accent/40 transition-colors"
                  >
                    {isRu ? t.label.ru : t.label.en}
                  </Link>
                ))}
              </div>
            </div>
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="text-sm font-bold text-foreground mb-3">
                {isRu ? 'Смежные термины крипто' : 'Related crypto terms'}
              </h3>
              <div className="flex flex-wrap gap-2">
                {CRYPTO_GLOSSARY_LINKS.map(t => (
                  <Link
                    key={t.slug}
                    href={`/${locale}/glossary/${t.slug}`}
                    className="text-xs px-3 py-1.5 rounded-full bg-background border border-border text-muted hover:text-accent hover:border-accent/40 transition-colors"
                  >
                    {isRu ? t.label.ru : t.label.en}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export { FAQ as AI_PAGE_FAQ };
