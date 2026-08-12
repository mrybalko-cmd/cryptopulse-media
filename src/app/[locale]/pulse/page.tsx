export const revalidate = 300;

import type { Metadata } from 'next';
import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft } from 'lucide-react';
import { buildOg, buildTwitter, BASE } from '@/lib/metadata';
import { fetchLatestPulse, PULSE_WEIGHTS, PULSE_ZONES, PULSE_MIN_SAMPLE } from '@/lib/pulse';
import { fetchPopularContent } from '@/lib/sanity';
import PulseWidget from '@/components/ui/PulseWidget';
import PopularSidebar from '@/components/ui/PopularSidebar';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const isRu = locale === 'ru';
  const title = isRu
    ? 'Пульс рынка — сводный индекс настроения крипторынка от CryptoPulse'
    : 'Market Pulse — CryptoPulse’s composite crypto sentiment index';
  const description = isRu
    ? 'Пульс — наш собственный составной индекс от 0 до 100: страх и жадность, ротация в альткоины и импульс объёма торгов в одном числе. Обновляется ежедневно.'
    : 'Pulse is our own composite score from 0 to 100: fear and greed, altcoin rotation, and trading volume momentum in a single daily number.';

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

const FACTORS_RU = [
  { pct: '40%', name: 'Fear & Greed Index', desc: 'Наш уже существующий индекс страха и жадности — коллективное настроение участников рынка.' },
  { pct: '30%', name: 'Altcoin Season Index', desc: 'Ротация капитала между биткоином и альткоинами — признак аппетита к риску.' },
  { pct: '30%', name: 'Импульс объёма торгов', desc: 'Оборот за 24 часа против нормы для этого дня недели — признак реальной активности, а не только настроения.' },
];

const FACTORS_EN = [
  { pct: '40%', name: 'Fear & Greed Index', desc: 'Our existing Fear & Greed Index — collective market sentiment.' },
  { pct: '30%', name: 'Altcoin Season Index', desc: 'Capital rotation between Bitcoin and altcoins — a risk-appetite signal.' },
  { pct: '30%', name: 'Volume momentum', desc: '24h turnover against the norm for that weekday — a sign of real activity, not just mood.' },
];

// Ordered walkthrough of the calculation. Step 2 and step 3 are the two
// corrections made on 11.08.2026 and are stated plainly rather than buried:
// before them the index was partly measuring the calendar, and three of its
// five zones were unreachable in principle.
const STEPS_RU = [
  {
    t: 'Три сигнала сводятся в один балл',
    d: 'Страх и жадность — 40%, ротация в альткоины — 30%, импульс объёма — 30%. Веса зафиксированы и не подбирались задним числом.',
  },
  {
    t: 'Объём сравнивается с нормой своего дня недели',
    d: 'Понедельник в крипте тише среды примерно на четверть: по нашим данным понедельник даёт 0,72 от оборота среднего дня, а среда — 1,15. Раньше любой день сравнивался со средним за прошлые семь, поэтому каждый понедельник выглядел провалом рынка. Теперь понедельник сравнивается с понедельниками.',
  },
  {
    t: 'Балл переводится в место на нашей истории',
    d: 'Сырой составной балл живёт в узком коридоре, поэтому число на первом экране — это перцентиль: сколько процентов прошлых дней были спокойнее сегодняшнего. Сырой балл остаётся видимым под графиком, чтобы методику можно было проверить.',
  },
  {
    t: 'Если данных нет, день не публикуется',
    d: 'Недоступный источник — это пропуск в истории, а не подставленное значение.',
  },
];

const STEPS_EN = [
  {
    t: 'Three signals become one score',
    d: 'Fear & Greed 40%, altcoin rotation 30%, volume momentum 30%. The weights are fixed and were not fitted after the fact.',
  },
  {
    t: 'Volume is compared to the norm for its weekday',
    d: 'Monday is about a quarter quieter than Wednesday in crypto: in our own data Monday runs at 0.72 of an average day’s turnover and Wednesday at 1.15. Previously every day was compared to a plain seven-day mean, so every Monday read as a market collapse. Now Mondays are compared to Mondays.',
  },
  {
    t: 'The score becomes a place in our own history',
    d: 'The raw composite lives in a narrow corridor, so the headline number is a percentile: what share of past days were quieter than today. The raw score stays visible below the chart so the method remains checkable.',
  },
  {
    t: 'No data, no entry',
    d: 'An unavailable source leaves a gap in the history rather than an invented value.',
  },
];

const FAQ_RU = [
  { q: 'Почему число сегодня другое, чем вчера, хотя рынок почти не двигался?', a: 'Показатель на первом экране — это место дня среди всех дней, что мы измерили. Если рынок стоит, а прошлая неделя была бурной, сегодняшний день опускается в рейтинге, хотя абсолютные значения не изменились. Сырой составной балл под графиком показывает абсолютную величину и ведёт себя спокойнее.' },
  { q: 'Что значит «норма для этого дня недели»?', a: 'Средний оборот всех таких же дней недели в нашей истории. У каждого дня свой коэффициент: по нашим данным понедельник даёт 0,72 от оборота среднего дня, среда — 1,15. Мы делим сегодняшний оборот на коэффициент его дня и только потом сравниваем с прошлыми днями. Без этой поправки каждый понедельник выглядел обвалом рынка, хотя это был просто понедельник.' },
  { q: 'Насколько надёжна шкала на нынешней выборке?', a: 'Пока умеренно, и мы пишем это прямо на странице. Перцентиль считается по всей накопленной истории, поэтому чем длиннее история, тем устойчивее шкала. Пока дней меньше четырнадцати, мы вообще не показываем перцентиль и оставляем сырой балл — выдавать точность, которой нет, мы не будем.' },
  { q: 'Чем Пульс отличается от Fear & Greed Index?', a: 'Fear & Greed измеряет только настроение (страх/жадность). Пульс — более широкий показатель: он добавляет к настроению ротацию капитала между биткоином и альткоинами и реальную активность рынка (объём торгов), а не только эмоции.' },
  { q: 'Как часто обновляется индекс?', a: 'Раз в сутки — новый снапшот считается автоматически и публикуется здесь же. Отдельные компоненты (Fear & Greed, Altcoin Season) обновляются с той же периодичностью, что и на их собственных страницах.' },
  { q: 'Почему веса именно 40/30/30?', a: 'Настроение рынка (Fear & Greed) — самый изученный и проверенный временем сигнал, поэтому у него наибольший вес. Ротация в альткоины и объём торгов — более узкие сигналы, поэтому у каждого по 30%. Веса могут уточняться по мере накопления данных — любое изменение будет отражено на этой странице.' },
  { q: 'Можно ли использовать Пульс как торговый сигнал?', a: 'Нет. Это вспомогательный аналитический инструмент, который помогает быстро оценить общий контекст рынка. Решения о сделках стоит принимать на основе полноценного технического и фундаментального анализа, а не одного числа.' },
  { q: 'Что происходит, если один из источников данных недоступен?', a: 'Снапшот за этот день не публикуется — мы не подставляем случайные значения вместо реальных данных. На графике истории это будет видно как пропуск, а не как ошибочное число.' },
];

const FAQ_EN = [
  { q: 'Why did the number move when the market barely did?', a: 'The headline figure is where the day ranks among every day we have measured. If the market is flat but last week was busy, today slips down the ranking even though the absolute values did not change. The raw composite score below the chart shows the absolute level and moves less.' },
  { q: 'What does “the norm for this weekday” mean?', a: 'The average turnover of every same weekday in our history. Each day carries its own factor: in our data Monday runs at 0.72 of an average day and Wednesday at 1.15. Today’s turnover is divided by its weekday factor before anything is compared. Without that correction every Monday looked like a market collapse when it was simply a Monday.' },
  { q: 'How reliable is the scale on the current sample?', a: 'Moderately, and we say so on the page. The percentile is ranked against the whole accumulated history, so the longer the record the steadier the scale. Below fourteen days we show no percentile at all and fall back to the raw score — we will not manufacture precision we do not have.' },
  { q: 'How is Pulse different from the Fear & Greed Index?', a: 'Fear & Greed only measures sentiment. Pulse is broader — it adds capital rotation between Bitcoin and altcoins and real market activity (trading volume), not just emotion.' },
  { q: 'How often does it update?', a: 'Once a day — a new snapshot is computed automatically and published here. The underlying components update on the same schedule as their own pages.' },
  { q: 'Why these specific weights (40/30/30)?', a: 'Market sentiment (Fear & Greed) is the most studied, time-tested signal, so it carries the most weight. Altcoin rotation and volume are narrower signals, each weighted at 30%. Weights may be refined as we gather more data — any change will be disclosed here.' },
  { q: 'Can I use Pulse as a trading signal?', a: 'No. It’s a supplementary analytical tool for a quick read on overall market context. Trading decisions should rely on full technical and fundamental analysis, not a single number.' },
  { q: 'What happens if a data source is unavailable?', a: 'That day’s snapshot simply isn’t published — we don’t substitute a made-up value for missing data. The history shows a gap, not a wrong number.' },
];

export default async function PulsePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isRu = locale === 'ru';

  const [data, related] = await Promise.all([
    fetchLatestPulse(),
    fetchPopularContent(locale, 3),
  ]);

  const factors = isRu ? FACTORS_RU : FACTORS_EN;
  const faq = isRu ? FAQ_RU : FAQ_EN;
  const steps = isRu ? STEPS_RU : STEPS_EN;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: isRu ? 'Пульс рынка — сводный индекс настроения крипторынка' : 'Market Pulse — composite crypto sentiment index',
    url: `${BASE}/${locale}/pulse`,
    publisher: { '@type': 'Organization', name: 'CryptoPulse.media' },
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

      {/* Hero — the reading itself leads the page as a full-width panel
          below the intro, instead of a 256px tile squeezed beside it: the
          chart, three factors and share row need the width. */}
      <div className="mb-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-accent mb-2">
            {isRu ? 'Собственный индекс CryptoPulse' : 'CryptoPulse’s own index'}
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight text-balance mb-4">
            {isRu ? 'Пульс рынка' : 'Market Pulse'}
          </h1>
          <p className="text-muted text-sm leading-relaxed max-w-xl">
            {isRu
              ? 'Одно число от 0 до 100, которое отвечает на вопрос «сегодня на рынке оживлённее или тише обычного?». Внутри — страх и жадность, ротация капитала между биткоином и альткоинами и оборот торгов, очищенный от эффекта дня недели. Обновляется раз в сутки.'
              : 'A single 0–100 number answering one question: is the market busier or quieter than usual today? Inside it are fear and greed, Bitcoin-to-altcoin capital rotation, and trading volume with the weekday effect removed. Updated once a day.'}
          </p>
        </div>
      </div>

      {data ? (
        <div className="mb-10">
          <PulseWidget data={data} locale={locale} asHeading={false} variant="full" />
        </div>
      ) : (
        <p className="text-xs text-muted mb-10">
          {isRu ? 'Первый снапшот появится в течение суток после запуска.' : 'The first snapshot will appear within a day of launch.'}
        </p>
      )}

      {/* Zones */}
      <section className="mb-10">
        <h2 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4">
          {isRu ? 'Зоны индекса' : 'Index zones'}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {PULSE_ZONES.map((z) => {
            const isNow = data?.percentile != null && data.percentile >= z.min && data.percentile <= z.max;
            return (
              <div
                key={z.zone}
                className={`border rounded-lg p-3 flex flex-col gap-1.5 relative ${isNow ? '' : 'border-border'}`}
                style={
                  isNow
                    ? {
                        borderColor: 'color-mix(in srgb, var(--violet-2) 55%, transparent)',
                        background: 'color-mix(in srgb, var(--violet) 9%, transparent)',
                      }
                    : undefined
                }
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
              </div>
            );
          })}
        </div>
        <p className="text-xs text-muted mt-3 leading-relaxed">
          {isRu
            ? `Границы зон заданы по перцентилю, поэтому каждая зона встречается примерно в пятой части дней — ни одна не остаётся недостижимой. Пока в истории меньше ${PULSE_MIN_SAMPLE} дней, перцентиль не показывается вовсе, а на первом экране стоит сырой составной балл.`
            : `Zone boundaries are set by percentile, so each zone occurs on roughly a fifth of days — none is unreachable. Below ${PULSE_MIN_SAMPLE} days of history no percentile is shown at all and the headline falls back to the raw composite score.`}
        </p>
      </section>

      {/* Methodology — the ordered walkthrough first, then the weights table */}
      <section className="mb-10">
        <h2 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4">
          {isRu ? 'Как считается' : 'How it is calculated'}
        </h2>
        <div className="flex flex-col divide-y divide-border border border-border rounded-lg overflow-hidden mb-4">
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

        <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">
          {isRu ? 'Веса компонентов' : 'Component weights'}
        </h3>
        <div className="flex flex-col divide-y divide-border border border-border rounded-lg overflow-hidden">
          {factors.map((f) => (
            <div key={f.name} className="flex items-start gap-4 px-4 py-3">
              <span className="font-mono text-xs font-bold text-accent tabular-nums shrink-0 mt-0.5 w-8">{f.pct}</span>
              <div>
                <div className="text-sm font-semibold text-foreground">{f.name}</div>
                <div className="text-xs text-muted leading-relaxed mt-0.5">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted mt-3">
          {isRu
            ? `Обновляется ежедневно. Веса зафиксированы (${Math.round(PULSE_WEIGHTS.fearGreed * 100)}/${Math.round(PULSE_WEIGHTS.altSeason * 100)}/${Math.round(PULSE_WEIGHTS.volumeMomentum * 100)}) — если формула изменится, это будет явно указано здесь.`
            : `Updated daily. Weights are fixed (${Math.round(PULSE_WEIGHTS.fearGreed * 100)}/${Math.round(PULSE_WEIGHTS.altSeason * 100)}/${Math.round(PULSE_WEIGHTS.volumeMomentum * 100)}) — any change to the formula will be disclosed here.`}
        </p>
      </section>

      {/* How to use */}
      <section className="mb-10">
        <h2 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4">
          {isRu ? 'Как использовать' : 'How to use it'}
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-sm font-semibold text-foreground mb-2">{isRu ? 'Низкие значения (0–19)' : 'Low readings (0–19)'}</div>
            <p className="text-xs text-muted leading-relaxed">
              {isRu
                ? 'Рынок спокойнее, чем почти во все дни, что мы наблюдали: низкая волатильность и низкий интерес. Часто предшествует фазе накопления перед движением.'
                : 'The market is calmer than on almost every day we have observed: low volatility, low interest. Often precedes an accumulation phase ahead of a move.'}
            </p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-sm font-semibold text-foreground mb-2">{isRu ? 'Высокие значения (80–100)' : 'High readings (80–100)'}</div>
            <p className="text-xs text-muted leading-relaxed">
              {isRu
                ? 'Оборот и жадность повышены одновременно — риск резких движений в обе стороны растёт. Сам по себе это не сигнал к действию.'
                : 'Turnover and greed are elevated at once — the risk of sharp moves in either direction rises. Not an action signal on its own.'}
            </p>
          </div>
        </div>
      </section>

      {/* FAQ — collapsible, same pattern as /faq */}
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

      {/* Deeper SEO body text */}
      <section className="mb-10">
        <h2 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4">
          {isRu ? 'Зачем нужен анализ настроения крипторынка' : 'Why crypto market sentiment analysis matters'}
        </h2>
        <div className="text-sm text-muted leading-relaxed space-y-3 max-w-none">
          {isRu ? (
            <>
              <p>
                Цена криптовалюты — это не только фундаментальные показатели протокола, но и коллективная психология
                участников рынка. Индексы настроения вроде Fear &amp; Greed давно используются трейдерами как быстрый способ
                оценить, насколько рынок эмоционально перегрет или, наоборот, задавлен паникой — но одного показателя
                настроения часто недостаточно, чтобы понять полную картину.
              </p>
              <p>
                Пульс рынка CryptoPulse объединяет три независимых сигнала в один. Помимо эмоционального фона (страх/жадность),
                он учитывает <Link href={`/${locale}/altcoin-season`} className="text-accent hover:underline">ротацию капитала между биткоином и альткоинами</Link> —
                классический признак того, куда инвесторы готовы нести повышенный риск, — и оборот торгов, очищенный от
                календарного эффекта. Последнее важнее, чем кажется: без поправки на день недели любой понедельник выглядит
                провалом рынка, хотя это всего лишь понедельник.
              </p>
              <p>
                Такой составной подход снижает риск сделать вывод на основе одного искажённого сигнала. Используйте Пульс
                вместе с <Link href={`/${locale}/fear-greed`} className="text-accent hover:underline">индексом страха и жадности</Link>,
                {' '}<Link href={`/${locale}/calculators`} className="text-accent hover:underline">калькуляторами</Link> и обычным
                техническим анализом — как один из факторов в общей картине, а не как единственный источник решений.
              </p>
            </>
          ) : (
            <>
              <p>
                Crypto prices reflect more than protocol fundamentals — they also reflect the collective psychology of market
                participants. Sentiment indices like Fear &amp; Greed have long been used by traders as a quick way to gauge
                whether the market is emotionally overheated or crushed by panic, but a single sentiment reading often isn’t
                the full picture.
              </p>
              <p>
                CryptoPulse’s Market Pulse blends three independent signals into one. Beyond emotional sentiment (fear/greed),
                it factors in <Link href={`/${locale}/altcoin-season`} className="text-accent hover:underline">capital rotation between Bitcoin and altcoins</Link> —
                a classic sign of where investors are willing to take on extra risk — and trading volume with the calendar
                effect stripped out. That last part matters more than it sounds: without a weekday correction every Monday
                looks like a market collapse when it is simply a Monday.
              </p>
              <p>
                This composite approach reduces the risk of drawing a conclusion from a single distorted signal. Use Pulse
                alongside the <Link href={`/${locale}/fear-greed`} className="text-accent hover:underline">Fear &amp; Greed Index</Link>,
                {' '}<Link href={`/${locale}/calculators`} className="text-accent hover:underline">calculators</Link>, and regular technical
                analysis — as one factor in the bigger picture, not the only input for a decision.
              </p>
            </>
          )}
        </div>
      </section>

      {/* Internal linking / related reading */}
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

      {/* Warning */}
      <div className="border border-border rounded-lg px-4 py-3 bg-card">
        <p className="text-xs text-muted leading-relaxed">
          <span className="font-semibold text-foreground">{isRu ? 'Важно: ' : 'Note: '}</span>
          {isRu
            ? 'Пульс — вспомогательный аналитический инструмент, не торговый сигнал и не инвестиционная рекомендация. Используйте его как один из факторов анализа наряду с техническим и фундаментальным анализом. CryptoPulse.media не даёт инвестиционных рекомендаций.'
            : 'Pulse is a supplementary analytical tool, not a trading signal or investment advice. Use it as one factor in your analysis alongside technical and fundamental research. CryptoPulse.media does not provide investment advice.'}
        </p>
      </div>

      </div>
      <PopularSidebar locale={locale} />
      </div>
    </div>
  );
}
