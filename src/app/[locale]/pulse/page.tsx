export const revalidate = 300;

import type { Metadata } from 'next';
import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft } from 'lucide-react';
import { buildOg, BASE } from '@/lib/metadata';
import { fetchLatestPulse, PULSE_WEIGHTS } from '@/lib/pulse';
import { fetchPopularContent } from '@/lib/sanity';
import PulseWidget from '@/components/ui/PulseWidget';

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
    openGraph: buildOg({ url: `${BASE}/${locale}/pulse`, title, description, locale }),
    alternates: {
      canonical: `${BASE}/${locale}/pulse`,
      languages: { ru: `${BASE}/ru/pulse`, en: `${BASE}/en/pulse` },
    },
  };
}

const ZONES = [
  { range: '0–24', color: '#3b82f6', ru: 'Штиль', en: 'Flatline' },
  { range: '25–44', color: '#06b6d4', ru: 'Разминка', en: 'Warming up' },
  { range: '45–55', color: '#94a3b8', ru: 'Ровный ритм', en: 'Steady rhythm' },
  { range: '56–74', color: '#f472b6', ru: 'Разогрев', en: 'Heating up' },
  { range: '75–100', color: '#ec4899', ru: 'Пиковая активность', en: 'Peak activity' },
];

const FACTORS_RU = [
  { pct: '40%', name: 'Fear & Greed Index', desc: 'Наш уже существующий индекс страха и жадности — коллективное настроение участников рынка.' },
  { pct: '30%', name: 'Altcoin Season Index', desc: 'Ротация капитала между биткоином и альткоинами — признак аппетита к риску.' },
  { pct: '30%', name: 'Импульс объёма торгов', desc: 'Изменение суммарного объёма за 24ч относительно скользящего 7-дневного среднего — признак реальной активности, а не только настроения.' },
];

const FACTORS_EN = [
  { pct: '40%', name: 'Fear & Greed Index', desc: 'Our existing Fear & Greed Index — collective market sentiment.' },
  { pct: '30%', name: 'Altcoin Season Index', desc: 'Capital rotation between Bitcoin and altcoins — a risk-appetite signal.' },
  { pct: '30%', name: 'Volume momentum', desc: '24h total trading volume change vs. a rolling 7-day average — a sign of real activity, not just mood.' },
];

const FAQ_RU = [
  { q: 'Чем Пульс отличается от Fear & Greed Index?', a: 'Fear & Greed измеряет только настроение (страх/жадность). Пульс — более широкий показатель: он добавляет к настроению ротацию капитала между биткоином и альткоинами и реальную активность рынка (объём торгов), а не только эмоции.' },
  { q: 'Как часто обновляется индекс?', a: 'Раз в сутки — новый снапшот считается автоматически и публикуется здесь же. Отдельные компоненты (Fear & Greed, Altcoin Season) обновляются с той же периодичностью, что и на их собственных страницах.' },
  { q: 'Почему веса именно 40/30/30?', a: 'Настроение рынка (Fear & Greed) — самый изученный и проверенный временем сигнал, поэтому у него наибольший вес. Ротация в альткоины и объём торгов — более узкие сигналы, поэтому у каждого по 30%. Веса могут уточняться по мере накопления данных — любое изменение будет отражено на этой странице.' },
  { q: 'Можно ли использовать Пульс как торговый сигнал?', a: 'Нет. Это вспомогательный аналитический инструмент, который помогает быстро оценить общий контекст рынка. Решения о сделках стоит принимать на основе полноценного технического и фундаментального анализа, а не одного числа.' },
  { q: 'Что происходит, если один из источников данных недоступен?', a: 'Снапшот за этот день не публикуется — мы не подставляем случайные значения вместо реальных данных. На графике истории это будет видно как пропуск, а не как ошибочное число.' },
];

const FAQ_EN = [
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
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <Link href={`/${locale}`} className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-accent transition-colors mb-8">
        <ArrowLeft size={14} />
        {isRu ? 'На главную' : 'Home'}
      </Link>

      {/* Hero */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-6 mb-10">
        <div className="flex-1">
          <p className="text-xs font-bold uppercase tracking-widest text-accent mb-2">
            {isRu ? 'Собственный индекс CryptoPulse' : 'CryptoPulse’s own index'}
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight text-balance mb-4">
            {isRu ? 'Пульс рынка' : 'Market Pulse'}
          </h1>
          <p className="text-muted text-sm leading-relaxed max-w-xl">
            {isRu
              ? 'Составной показатель от 0 до 100, который объединяет страх и жадность, ротацию капитала между биткоином и альткоинами и импульс объёма торгов — чтобы не сверять три разных индекса вручную. Публикуется ежедневно.'
              : 'A composite score from 0 to 100 that blends fear and greed, Bitcoin-to-altcoin capital rotation, and trading volume momentum — so you don’t have to check three separate indices by hand. Published daily.'}
          </p>
        </div>
        {data ? (
          <div className="shrink-0 w-full sm:w-64">
            <PulseWidget data={data} locale={locale} idSuffix="pulse-page" />
          </div>
        ) : (
          <p className="text-xs text-muted shrink-0">
            {isRu ? 'Первый снапшот появится в течение суток после запуска.' : 'The first snapshot will appear within a day of launch.'}
          </p>
        )}
      </div>

      {/* Zones */}
      <section className="mb-10">
        <h2 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4">
          {isRu ? 'Зоны индекса' : 'Index zones'}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {ZONES.map((z) => (
            <div key={z.range} className="border border-border rounded-lg p-3 flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: z.color }} />
                <span className="font-mono text-xs text-muted tabular-nums">{z.range}</span>
              </div>
              <span className="text-sm font-semibold text-foreground">{isRu ? z.ru : z.en}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Methodology */}
      <section className="mb-10">
        <h2 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4">
          {isRu ? 'Из чего считается' : 'How it is calculated'}
        </h2>
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
            <div className="text-sm font-semibold text-foreground mb-2">{isRu ? 'Низкий пульс (0–24)' : 'Low pulse (0–24)'}</div>
            <p className="text-xs text-muted leading-relaxed">
              {isRu
                ? 'Рынок в фазе затишья — низкая волатильность, низкий интерес. Часто предшествует фазе накопления перед движением.'
                : 'The market is quiet — low volatility, low interest. Often precedes an accumulation phase ahead of a move.'}
            </p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-sm font-semibold text-foreground mb-2">{isRu ? 'Высокий пульс (75–100)' : 'High pulse (75–100)'}</div>
            <p className="text-xs text-muted leading-relaxed">
              {isRu
                ? 'Повышенная активность и жадность одновременно — риск резких движений в обе стороны возрастает. Не сигнал к действию сам по себе.'
                : 'Elevated activity and greed at once — the risk of sharp moves in either direction rises. Not an action signal on its own.'}
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
                классический признак того, куда инвесторы готовы нести повышенный риск, — и реальный импульс объёма торгов,
                который показывает, подкреплено ли движение настоящей активностью или это просто разговоры в соцсетях.
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
                a classic sign of where investors are willing to take on extra risk — and real trading volume momentum, which
                shows whether a move is backed by real activity or just social media chatter.
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
  );
}
