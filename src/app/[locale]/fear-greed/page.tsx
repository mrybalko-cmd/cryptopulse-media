export const revalidate = 3600;

import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { buildOg, BASE } from '@/lib/metadata';
import { fetchFearGreedIndex } from '@/lib/feargreed';
import FearGreedWidget from '@/components/ui/FearGreedWidget';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const isRu = locale === 'ru';
  const title = isRu
    ? 'Индекс страха и жадности криптовалютного рынка — CryptoPulse.media'
    : 'Crypto Fear & Greed Index — CryptoPulse.media';
  const description = isRu
    ? 'Что такое индекс страха и жадности, как он считается, какие данные использует и как применять его в анализе криптовалютного рынка.'
    : 'What the Crypto Fear & Greed Index is, how it is calculated, what data it uses, and how to apply it in crypto market analysis.';
  return {
    title,
    description,
    openGraph: buildOg({ url: `${BASE}/${locale}/fear-greed`, title, description, locale }),
    alternates: {
      canonical: `${BASE}/${locale}/fear-greed`,
      languages: {
        ru: `${BASE}/ru/fear-greed`,
        en: `${BASE}/en/fear-greed`,
      },
    },
  };
}

const ZONES = [
  { range: '0–24',  color: '#E5534B', ru: 'Крайний страх',    en: 'Extreme Fear' },
  { range: '25–44', color: '#F0883E', ru: 'Страх',             en: 'Fear' },
  { range: '45–55', color: '#D29922', ru: 'Нейтрально',        en: 'Neutral' },
  { range: '56–74', color: '#3FB950', ru: 'Жадность',          en: 'Greed' },
  { range: '75–100',color: '#2EA043', ru: 'Крайняя жадность',  en: 'Extreme Greed' },
];

const FACTORS_RU = [
  { pct: '25%', name: 'Волатильность BTC',    desc: 'Сравнивается с 30- и 90-дневными средними. Аномальная волатильность = страх.' },
  { pct: '25%', name: 'Объём и импульс',      desc: 'Текущий объём торгов и направление движения относительно средних значений.' },
  { pct: '15%', name: 'Соцсети и упоминания', desc: 'Количество твитов и взаимодействий с хештегами BTC и ETH.' },
  { pct: '15%', name: 'Опросы',               desc: 'Недельные опросы crypto-сообщества (временно приостановлены).' },
  { pct: '10%', name: 'Доминация Bitcoin',    desc: 'Рост доминации BTC = уход из альткоинов в «тихую гавань».' },
  { pct: '10%', name: 'Google Trends',        desc: 'Поисковые запросы по «bitcoin» — рост интереса у широкой аудитории.' },
];

const FACTORS_EN = [
  { pct: '25%', name: 'BTC Volatility',       desc: 'Compared to 30- and 90-day averages. Unusual volatility signals fear.' },
  { pct: '25%', name: 'Market Volume/Momentum', desc: 'Current trading volume and price direction vs. historical averages.' },
  { pct: '15%', name: 'Social Media',         desc: 'Tweet volume and interaction rate on BTC and ETH hashtags.' },
  { pct: '15%', name: 'Surveys',              desc: 'Weekly crypto community polls (currently paused).' },
  { pct: '10%', name: 'Bitcoin Dominance',    desc: 'Rising BTC dominance = rotation from altcoins into "safe haven."' },
  { pct: '10%', name: 'Google Trends',        desc: 'Search volume for "bitcoin" — rising retail interest signal.' },
];

export default async function FearGreedPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isRu = locale === 'ru';

  const data = await fetchFearGreedIndex();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: isRu
      ? 'Индекс страха и жадности криптовалютного рынка'
      : 'Crypto Fear & Greed Index',
    url: `${BASE}/${locale}/fear-greed`,
    publisher: { '@type': 'Organization', name: 'CryptoPulse.media' },
  };

  const factors = isRu ? FACTORS_RU : FACTORS_EN;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Link
        href={`/${locale}`}
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-accent transition-colors mb-8"
      >
        <ArrowLeft size={14} />
        {isRu ? 'На главную' : 'Home'}
      </Link>

      {/* Hero */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-6 mb-10">
        <div className="flex-1">
          <p className="text-xs font-bold uppercase tracking-widest text-accent mb-2">
            {isRu ? 'Инструмент аналитика' : 'Market tool'}
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight text-balance mb-4">
            {isRu
              ? 'Индекс страха и жадности криптовалютного рынка'
              : 'Crypto Fear & Greed Index'}
          </h1>
          <p className="text-muted text-sm leading-relaxed max-w-xl">
            {isRu
              ? 'Составной показатель от 0 до 100, оцифровывающий коллективное настроение участников рынка. Публикуется ежедневно. Помогает понять, когда рынок перегрет эйфорией или задавлен паникой.'
              : 'A composite score from 0 to 100 that quantifies collective market sentiment. Published daily. Helps identify when the market is overheated with euphoria or crushed by panic.'}
          </p>
        </div>

        {/* Live widget */}
        {data && (
          <div className="flex flex-col items-center gap-2 shrink-0">
            <FearGreedWidget value={data.value} classification={data.classification} locale={locale} />
            <span className="text-xs text-muted">
              {isRu ? 'Сейчас' : 'Current'}
            </span>
          </div>
        )}
      </div>

      {/* Zones */}
      <section className="mb-10">
        <h2 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4">
          {isRu ? 'Зоны индекса' : 'Index zones'}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {ZONES.map(z => (
            <div key={z.range} className="border border-border rounded-lg p-3 flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: z.color }} />
                <span className="font-mono text-xs text-muted tabular-nums">{z.range}</span>
              </div>
              <span className="text-sm font-semibold text-foreground">
                {isRu ? z.ru : z.en}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mb-10">
        <h2 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4">
          {isRu ? 'Из чего считается' : 'How it is calculated'}
        </h2>
        <div className="flex flex-col divide-y divide-border border border-border rounded-lg overflow-hidden">
          {factors.map(f => (
            <div key={f.name} className="flex items-start gap-4 px-4 py-3">
              <span className="font-mono text-xs font-bold text-accent tabular-nums shrink-0 mt-0.5 w-8">
                {f.pct}
              </span>
              <div>
                <div className="text-sm font-semibold text-foreground">{f.name}</div>
                <div className="text-xs text-muted leading-relaxed mt-0.5">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted mt-3">
          {isRu
            ? 'Источник: alternative.me — обновляется ежедневно в полночь UTC.'
            : 'Source: alternative.me — updated daily at midnight UTC.'}
        </p>
      </section>

      {/* How to use */}
      <section className="mb-10">
        <h2 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4">
          {isRu ? 'Как использовать' : 'How to use it'}
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-sm font-semibold text-foreground mb-2">
              {isRu ? 'Крайний страх (0–24)' : 'Extreme Fear (0–24)'}
            </div>
            <p className="text-xs text-muted leading-relaxed">
              {isRu
                ? 'Исторически совпадает с локальными минимумами рынка. Долгосрочные инвесторы рассматривают эти зоны как потенциальные точки входа. «Покупай, когда другие боятся» — Уоррен Баффетт.'
                : 'Historically coincides with market local bottoms. Long-term investors view these zones as potential entry points. "Be fearful when others are greedy" — Warren Buffett.'}
            </p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-sm font-semibold text-foreground mb-2">
              {isRu ? 'Крайняя жадность (75–100)' : 'Extreme Greed (75–100)'}
            </div>
            <p className="text-xs text-muted leading-relaxed">
              {isRu
                ? 'Сигнал перегрева: рынок может быть переоценён. Трейдеры используют эти уровни для фиксации прибыли или ужесточения стоп-лоссов. Не является сигналом к продаже само по себе.'
                : 'Overheating signal: the market may be overvalued. Traders use these levels to take profit or tighten stop-losses. Not a sell signal on its own.'}
            </p>
          </div>
        </div>
      </section>

      {/* Warning */}
      <div className="border border-border rounded-lg px-4 py-3 bg-card">
        <p className="text-xs text-muted leading-relaxed">
          <span className="font-semibold text-foreground">
            {isRu ? 'Важно: ' : 'Note: '}
          </span>
          {isRu
            ? 'Индекс страха и жадности — вспомогательный инструмент, не торговый сигнал. Используйте его как один из факторов анализа наряду с техническим и фундаментальным анализом. CryptoPulse.media не даёт инвестиционных рекомендаций.'
            : 'The Fear & Greed Index is a supplementary tool, not a trading signal. Use it as one factor in your analysis alongside technical and fundamental research. CryptoPulse.media does not provide investment advice.'}
        </p>
      </div>
    </div>
  );
}
