export const revalidate = 300;

import type { Metadata } from 'next';
import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft } from 'lucide-react';
import { buildOg, buildTwitter, BASE } from '@/lib/metadata';
import { fetchLatestPulse, PULSE_WEIGHTS, PULSE_ZONES } from '@/lib/pulse';
import { fetchPopularContent } from '@/lib/sanity';
import PulseWidget from '@/components/ui/PulseWidget';
import PopularSidebar from '@/components/ui/PopularSidebar';

type Props = { params: Promise<{ locale: string }> };

/** The day the index was first published. Fixed: it is a fact about the page,
 *  not something that should drift with each rebuild. */
const PULSE_LAUNCHED = '2026-07-20';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const isRu = locale === 'ru';
  const title = isRu
    ? 'Пульс рынка — индекс активности крипторынка от CryptoPulse'
    : 'Market Pulse — CryptoPulse’s crypto market activity index';
  const description = isRu
    ? 'Одно число от 0 до 100: насколько сегодня активен крипторынок. 50 — обычный режим, 100 — рынок разогрет, 0 — замер. Оборот, движение цены, волатильность, настроение и альткоины. Обновляется ежедневно.'
    : 'A single 0–100 number: how active the crypto market is today. 50 is normal, 100 is running hot, 0 is frozen. Turnover, price move, volatility, sentiment and altcoins. Updated daily.';

  return {
    title,
    description,
    openGraph: buildOg({ url: `${BASE}/${locale}/pulse`, title, description, locale, image: `${BASE}/${locale}/pulse/opengraph-image` }),
    twitter: buildTwitter({ url: `${BASE}/${locale}/pulse`, title, description, locale, image: `${BASE}/${locale}/pulse/opengraph-image` }),
    alternates: {
      canonical: `${BASE}/${locale}/pulse`,
      languages: { ru: `${BASE}/ru/pulse`, en: `${BASE}/en/pulse`, 'x-default': `${BASE}/en/pulse` },
    },
  };
}

const W = (k: keyof typeof PULSE_WEIGHTS) => Math.round(PULSE_WEIGHTS[k] * 100);

// Every step states what 50 means for that component, because that is the
// only way a reader can check the number against reality themselves.
const STEPS_RU = [
  {
    t: `Объём торгов биткоина против нормы — ${W('volume')}%`,
    d: 'Оборот за сутки сравнивается с медианой за 365 дней, с поправкой на день недели. Втрое выше нормы — 100, ровно норма — 50, втрое ниже — 0. Почему биткоин, а не весь рынок: чистая история за год есть только по нему, а общий оборот разные агрегаторы считают по-разному. За наши дни наблюдений общий оборот совпадал с биткоиновым лишь наполовину, поэтому выдавать одно за другое мы не станем.',
  },
  {
    t: `Рост цены за сутки — ${W('growth')}%`,
    d: 'Ноль — 50, плюс 5% и выше — 100, минус 5% и ниже — 0. Этого компонента раньше не было вовсе: индекс не отличал растущий рынок от падающего.',
  },
  {
    t: `Волатильность — ${W('volatility')}%`,
    d: 'Размах дневного движения против годовой нормы. Рынок, стоящий на месте, не активен, даже если оборот выглядит приличным. Знак здесь не учитывается: это мера того, сколько происходит, а не в какую сторону.',
  },
  {
    t: `Страх и жадность — ${W('fearGreed')}%`,
    d: 'Внешний индекс alternative.me, уже 0–100. Берём как есть и не перенормируем. Его 50 означает «нейтральное настроение» по его собственной шкале — но за прошедший год медиана этого индекса была около 25, год выдался пугливый.',
  },
  {
    t: `Отрыв альткоинов от биткоина — ${W('altcoin')}%`,
    d: 'Насколько типичный альткоин обгоняет биткоин за 30 дней. Считается медианой отрыва, а не количеством обогнавших: счёт через порог скачет на десятки пунктов, когда монеты сгрудились у планки. Из расчёта исключаются стейблкоины и токенизированные фонды — они стоят доллар и ставкой на альткоин не являются.',
  },
];

const STEPS_EN = [
  {
    t: `Bitcoin turnover against its norm — ${W('volume')}%`,
    d: '24h turnover compared to the median of the past 365 days, adjusted for the weekday. Three times the norm reads 100, the norm itself reads 50, a third of it reads 0. Why Bitcoin rather than the whole market: it is the only series with a clean year of history, and aggregators measure total turnover differently. Across our recorded days the global figure tracked Bitcoin’s only about half the time, so we will not present one as the other.',
  },
  {
    t: `Price change over 24h — ${W('growth')}%`,
    d: 'Flat reads 50, +5% or more reads 100, −5% or less reads 0. This component did not exist before: the index could not tell a rising market from a falling one.',
  },
  {
    t: `Volatility — ${W('volatility')}%`,
    d: 'The size of the daily move against its yearly norm. A market standing still is not an active market, however respectable the turnover looks. Unsigned on purpose: this measures how much is happening, not which way.',
  },
  {
    t: `Fear & Greed — ${W('fearGreed')}%`,
    d: 'The external alternative.me index, already on a 0–100 scale. Taken as published, not renormalised. Its 50 means “neutral sentiment” by its own definition — but over the past year its median sat near 25, a fearful year.',
  },
  {
    t: `Altcoin margin versus Bitcoin — ${W('altcoin')}%`,
    d: 'How far the typical altcoin runs ahead of Bitcoin over 30 days. Measured as a median margin rather than a count of coins beating Bitcoin: a threshold tally swings dozens of points when coins bunch up near the line. Stablecoins and tokenised funds are excluded — they sit at a dollar and are not a bet on altcoins.',
  },
];

// Stated on the page, not buried in a repo comment. Each of these is a real
// limit we hit while building the index, not boilerplate hedging.
const LIMITS_RU = [
  { t: 'Это не прогноз', d: 'Индекс описывает то, что уже произошло за сутки. Высокое значение не означает, что рост продолжится, низкое — что пора покупать.' },
  { t: 'Активность не равна направлению', d: 'На 67 может быть и сильный рост, и обвал: 6 февраля 2026 года рынок упал на 14% при рекордном обороте и получил ровно 67. Смотрите компонент роста цены рядом с числом — он и говорит направление.' },
  { t: 'Норма пересматривается', d: 'Медиана оборота и волатильности считается по скользящему году, поэтому одно и то же состояние рынка через год может дать чуть другое число.' },
  { t: 'Это не торговый сигнал', d: 'Один показатель не заменяет анализ. Это быстрый ответ на вопрос «что вообще происходит», не более.' },
];

const LIMITS_EN = [
  { t: 'Not a forecast', d: 'The index describes what has already happened over the past day. A high reading does not mean the move will continue; a low one does not mean it is time to buy.' },
  { t: 'Activity is not direction', d: 'A 67 can be a strong rally or a crash: on 6 February 2026 the market fell 14% on record turnover and scored exactly 67. Read the price-change component beside the number — that is what carries direction.' },
  { t: 'The norm keeps moving', d: 'Turnover and volatility norms are medians over a rolling year, so the same market conditions may score slightly differently a year from now.' },
  { t: 'Not a trading signal', d: 'A single number is not analysis. It answers “what is going on at all”, and no more.' },
];

const FAQ_RU = [
  { q: 'Что означает число 50?', a: 'Нормальные условия рынка: оборот примерно на уровне годовой медианы, цена движется как обычно, настроение нейтральное. Выше 50 — активность выше обычной, ниже — рынок спокойнее нормы. Отметка 50 нарисована прямо на шкале в виджете, чтобы число не приходилось держать в голове.' },
  { q: 'Почему индекс редко поднимается выше 50?', a: 'Потому что рынок и правда был спокойнее нормы. Каждый компонент отцентрован на своей норме, но индекс страха и жадности за прошедший год имел медиану около 25 и тянет сумму вниз. Медиана самого Пульса за год — примерно 44, а не 50. Мы не подкручиваем шкалу, чтобы получилось красивее: если год был вялый, число это показывает.' },
  { q: 'Высокое значение — это хорошо?', a: 'Это не оценка «хорошо или плохо», а мера активности. Резкий обвал на огромных объёмах даст высокое значение так же, как и сильный рост. Направление показывает компонент роста цены и фраза-объяснение под числом.' },
  { q: 'Почему объём считается по биткоину, а не по всему рынку?', a: 'Чтобы сравнивать с нормой, нужна история за год, а она на бесплатных источниках есть только по отдельным монетам. Общий оборот рынка разные агрегаторы считают по-разному, и за наши дни наблюдений он совпадал с биткоиновым лишь наполовину. Поэтому компонент честно называется «объём торгов биткоина».' },
  { q: 'Что такое поправка на день недели?', a: 'Оборот в крипте заметно зависит от дня недели: выходные и понедельник тише середины недели. Без поправки каждый понедельник выглядел бы провалом рынка, хотя это просто понедельник. Мы делим оборот дня на коэффициент его дня недели, посчитанный по всему году, и только потом сравниваем с нормой.' },
  { q: 'Как часто обновляется индекс?', a: 'Раз в сутки. Значение считается автоматически и публикуется здесь же. Если источник данных недоступен, день не публикуется вовсе — в истории останется пропуск, а не выдуманное число.' },
  { q: 'Можно ли использовать Пульс как торговый сигнал?', a: 'Нет. Это вспомогательный аналитический инструмент для быстрой оценки контекста. Решения о сделках стоит принимать на основе полноценного технического и фундаментального анализа, а не одного числа.' },
];

const FAQ_EN = [
  { q: 'What does 50 mean?', a: 'Normal market conditions: turnover near the yearly median, price moving as it usually does, sentiment neutral. Above 50 is more active than usual, below is calmer. The 50 mark is drawn on the widget’s scale so you never have to hold it in your head.' },
  { q: 'Why is the index rarely above 50?', a: 'Because the market genuinely has been calmer than normal. Each component is centred on its own norm, but the Fear & Greed index had a median near 25 over the past year and pulls the total down. Pulse’s own yearly median is around 44 rather than 50. We do not adjust the scale to look better: if the year was sluggish, the number says so.' },
  { q: 'Is a high reading good?', a: 'It is a measure of activity, not a verdict. A sharp crash on enormous volume scores high just as a strong rally does. Direction comes from the price-change component and the sentence beneath the number.' },
  { q: 'Why is turnover measured on Bitcoin rather than the whole market?', a: 'Comparing against a norm requires a year of history, and free sources provide that per coin only. Aggregators measure total market turnover differently, and across our recorded days it tracked Bitcoin’s only about half the time. So the component is honestly named “Bitcoin turnover”.' },
  { q: 'What is the weekday adjustment?', a: 'Crypto turnover depends noticeably on the day of the week — weekends and Mondays are quieter than midweek. Without a correction every Monday would look like a market collapse when it is simply a Monday. We divide each day’s turnover by its weekday factor, computed across the whole year, before comparing it to the norm.' },
  { q: 'How often does it update?', a: 'Once a day. The value is computed automatically and published here. If a data source is unavailable, that day is not published at all — the history keeps a gap rather than an invented number.' },
  { q: 'Can I use Pulse as a trading signal?', a: 'No. It is a supplementary tool for a quick read on context. Trading decisions should rest on full technical and fundamental analysis, not one number.' },
];

export default async function PulsePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isRu = locale === 'ru';

  const [data, related] = await Promise.all([
    fetchLatestPulse(),
    fetchPopularContent(locale, 3),
  ]);

  const steps = isRu ? STEPS_RU : STEPS_EN;
  const limits = isRu ? LIMITS_RU : LIMITS_EN;
  const faq = isRu ? FAQ_RU : FAQ_EN;

  // Matches the shape used on glossary term pages: publisher by @id rather
  // than a second inline copy of the organisation, and the fields Google asks
  // for on an Article. dateModified is the day's own computation, so the page
  // never claims to be fresher than the number it shows.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: isRu ? 'Пульс рынка — индекс активности крипторынка' : 'Market Pulse — crypto market activity index',
    description: isRu
      ? 'Абсолютный индекс активности крипторынка от 0 до 100, где 50 — обычный режим. Считается по обороту, движению цены, волатильности, настроению и поведению альткоинов.'
      : 'An absolute 0–100 index of crypto market activity where 50 means normal conditions. Built from turnover, price movement, volatility, sentiment and altcoin behaviour.',
    url: `${BASE}/${locale}/pulse`,
    inLanguage: locale,
    mainEntityOfPage: `${BASE}/${locale}/pulse`,
    image: [`${BASE}/${locale}/pulse/opengraph-image`],
    datePublished: PULSE_LAUNCHED,
    ...(data?.computedAt && { dateModified: data.computedAt }),
    author: { '@id': `${BASE}/#organization` },
    publisher: { '@id': `${BASE}/#organization` },
  };

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_256px] gap-6 lg:gap-8">
      <div>

      <Link href={`/${locale}`} className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-accent transition-colors mb-8">
        <ArrowLeft size={14} />
        {isRu ? 'На главную' : 'Home'}
      </Link>

      <p className="text-xs font-bold uppercase tracking-widest text-accent mb-2">
        {isRu ? 'Собственный индекс CryptoPulse' : 'CryptoPulse’s own index'}
      </p>
      <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight text-balance mb-4">
        {isRu ? 'Пульс рынка' : 'Market Pulse'}
      </h1>
      <p className="text-muted text-sm leading-relaxed max-w-xl mb-8">
        {isRu
          ? 'Одно число от 0 до 100, отвечающее на вопрос «насколько сегодня активен крипторынок». 50 — обычный режим, ближе к 100 — рынок разогрет и движется, ближе к нулю — замер. Считается по обороту, движению цены, волатильности, настроению участников и поведению альткоинов. Обновляется раз в сутки.'
          : 'A single 0–100 number answering one question: how active is the crypto market today. 50 is normal, closer to 100 means the market is running hot, closer to zero means it has stopped. Built from turnover, price movement, volatility, sentiment and altcoin behaviour. Updated once a day.'}
      </p>

      {/* The reading leads the page as a full-width panel — the scale, chart
          and five components need the width. */}
      {data ? (
        <div className="mb-10">
          <PulseWidget data={data} locale={locale} asHeading={false} variant="full" />
        </div>
      ) : (
        <p className="text-xs text-muted mb-10">
          {isRu ? 'Данные появятся после первого расчёта.' : 'Data will appear after the first computation.'}
        </p>
      )}

      {/* Zones */}
      <section className="mb-10">
        <h2 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4">
          {isRu ? 'Зоны индекса' : 'Index zones'}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {PULSE_ZONES.map((z) => {
            const isNow = data ? data.score >= z.min && data.score <= z.max : false;
            return (
              <div
                key={z.zone}
                className={`border rounded-lg p-3 flex flex-col gap-1.5 relative ${isNow ? '' : 'border-border'}`}
                style={isNow ? {
                  borderColor: 'color-mix(in srgb, var(--violet-2) 55%, transparent)',
                  background: 'color-mix(in srgb, var(--violet) 9%, transparent)',
                } : undefined}
              >
                {isNow && (
                  <span className="absolute top-2 right-2.5 text-[9px] font-extrabold uppercase tracking-wider" style={{ color: 'var(--violet-2)' }}>
                    {isRu ? 'сегодня' : 'today'}
                  </span>
                )}
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: z.color }} />
                  <span className="font-mono text-xs text-muted tabular-nums">{z.min}–{z.max}</span>
                </div>
                <span className="text-sm font-semibold text-foreground">{isRu ? z.ru : z.en}</span>
                <span className="text-[11px] text-muted leading-snug">{isRu ? z.ruDesc : z.enDesc}</span>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-muted mt-3 leading-relaxed">
          {isRu
            ? 'Названия зон говорят только об активности и намеренно не указывают направление: и сильный рост, и обвал выглядят здесь одинаково.'
            : 'Zone names describe activity only and deliberately say nothing about direction: a strong rally and a crash look the same here.'}
          {data?.yearStats && (isRu
            ? ` За последние ${data.yearStats.days} дней индекс ходил от ${data.yearStats.min} до ${data.yearStats.max}, медиана — ${data.yearStats.median}.`
            : ` Over the last ${data.yearStats.days} days the index ranged from ${data.yearStats.min} to ${data.yearStats.max}, with a median of ${data.yearStats.median}.`)}
        </p>
      </section>

      {/* Methodology */}
      <section className="mb-10">
        <h2 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4">
          {isRu ? 'Как считается' : 'How it is calculated'}
        </h2>
        <div className="flex flex-col divide-y divide-border border border-border rounded-lg overflow-hidden">
          {steps.map((s, i) => (
            <div key={s.t} className="flex items-start gap-4 px-4 py-3.5">
              <span
                className="w-6 h-6 rounded-full shrink-0 mt-0.5 flex items-center justify-center text-[11px] font-black"
                style={{ background: 'color-mix(in srgb, var(--violet) 22%, transparent)', color: 'var(--violet-2)' }}
              >
                {i + 1}
              </span>
              <div>
                <div className="text-sm font-semibold text-foreground mb-1">{s.t}</div>
                <div className="text-xs text-muted leading-relaxed">{s.d}</div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted mt-3">
          {isRu
            ? 'Веса зафиксированы и не подбирались задним числом. Если формула изменится, это будет явно указано здесь.'
            : 'The weights are fixed and were not fitted after the fact. Any change to the formula will be stated here.'}
        </p>
      </section>

      {/* Limits — stated plainly rather than hidden */}
      <section className="mb-10">
        <h2 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4">
          {isRu ? 'Чего Пульс не умеет' : 'What Pulse cannot do'}
        </h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {limits.map((l) => (
            <div key={l.t} className="bg-card border border-border rounded-lg p-4">
              <div className="text-sm font-semibold text-foreground mb-1.5">{l.t}</div>
              <p className="text-xs text-muted leading-relaxed">{l.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mb-10">
        <h2 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4">
          {isRu ? 'Частые вопросы' : 'Frequently asked questions'}
        </h2>
        <div className="space-y-2">
          {faq.map((f) => (
            <details key={f.q} className="group bg-card border border-border rounded-lg px-4 py-3 open:border-accent/40">
              <summary className="cursor-pointer list-none flex items-start justify-between gap-3 text-sm font-semibold text-foreground">
                {f.q}
                <span className="text-muted text-xs shrink-0 mt-0.5 group-open:rotate-180 transition-transform">▾</span>
              </summary>
              <p className="text-muted text-sm leading-relaxed mt-2">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Body text */}
      <section className="mb-10">
        <h2 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4">
          {isRu ? 'Зачем измерять активность крипторынка' : 'Why measure crypto market activity'}
        </h2>
        <div className="text-sm text-muted leading-relaxed space-y-3">
          {isRu ? (
            <>
              <p>
                Большинство знакомых трейдеру индикаторов отвечают на вопрос «куда движется цена». Пульс отвечает на другой,
                который обычно задают первым: происходит ли на рынке вообще хоть что-нибудь. Оборот вдвое ниже годовой нормы
                и цена, стоящая третью неделю, — это совсем другая обстановка, чем те же уровни цен на рекордных объёмах.
              </p>
              <p>
                Чтобы такое сравнение было честным, нужна точка отсчёта, не зависящая от того, когда мы начали измерять.
                Поэтому норма берётся по скользящему году, а не по нашей собственной короткой истории: иначе самая тихая
                неделя тихого месяца выглядела бы всплеском просто потому, что все остальные дни были ещё тише.
              </p>
              <p>
                Пользуйтесь Пульсом вместе с <Link href={`/${locale}/fear-greed`} className="text-accent hover:underline">индексом страха и жадности</Link>,
                {' '}<Link href={`/${locale}/altcoin-season`} className="text-accent hover:underline">индексом альткоин-сезона</Link> и
                {' '}<Link href={`/${locale}/calculators`} className="text-accent hover:underline">калькуляторами</Link> — как с одним из факторов
                общей картины, а не как с единственным основанием для решения.
              </p>
            </>
          ) : (
            <>
              <p>
                Most familiar indicators answer the question “where is price going”. Pulse answers the one traders usually ask
                first: is anything happening at all. Turnover at half its yearly norm with price flat for a third week is a
                completely different setting from the same price levels on record volume.
              </p>
              <p>
                For that comparison to be honest it needs a reference point independent of when we started measuring. So the
                norm comes from a rolling year rather than our own short record: otherwise the quietest week of a quiet month
                would look like a surge simply because every other day was quieter still.
              </p>
              <p>
                Use Pulse alongside the <Link href={`/${locale}/fear-greed`} className="text-accent hover:underline">Fear &amp; Greed Index</Link>,
                {' '}the <Link href={`/${locale}/altcoin-season`} className="text-accent hover:underline">Altcoin Season Index</Link> and our
                {' '}<Link href={`/${locale}/calculators`} className="text-accent hover:underline">calculators</Link> — as one factor in the
                bigger picture, not the only input for a decision.
              </p>
            </>
          )}
        </div>
      </section>

      {related.length > 0 && (
        <section className="mb-10">
          <h2 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4">
            {isRu ? 'Смотрите также' : 'See also'}
          </h2>
          <ul className="flex flex-col gap-2">
            {related.map((item) => (
              <li key={item._id}>
                <Link
                  href={`/${locale}/${item._type === 'article' ? 'articles' : 'news'}/${item.slug}`}
                  className="text-sm text-accent hover:underline"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="border border-border rounded-lg px-4 py-3 bg-card">
        <p className="text-xs text-muted leading-relaxed">
          <span className="font-semibold text-foreground">{isRu ? 'Важно: ' : 'Note: '}</span>
          {isRu
            ? 'Пульс — вспомогательный аналитический инструмент, не торговый сигнал и не инвестиционная рекомендация. Используйте его как один из факторов анализа наряду с техническим и фундаментальным. CryptoPulse.media не даёт инвестиционных рекомендаций.'
            : 'Pulse is a supplementary analytical tool, not a trading signal or investment advice. Use it as one factor alongside technical and fundamental research. CryptoPulse.media does not provide investment advice.'}
        </p>
      </div>

      </div>
      <PopularSidebar locale={locale} />
      </div>
    </div>
  );
}
