export const revalidate = 28800; // ~3x/day — matches fetchAltcoinSeasonIndex's own cache window

import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft, TrendingUp, TrendingDown } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { buildOg, BASE } from '@/lib/metadata';
import { fetchAltcoinSeasonIndex, type AltcoinSeasonCoin } from '@/lib/altcoinSeason';
import AltcoinSeasonWidget from '@/components/ui/AltcoinSeasonWidget';
import PopularSidebar from '@/components/ui/PopularSidebar';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const isRu = locale === 'ru';
  const title = isRu
    ? 'Индекс альткоин-сезона — CryptoPulse.media'
    : 'Altcoin Season Index — CryptoPulse.media';
  const description = isRu
    ? 'Наш собственный индекс альткоин-сезона: сколько из топ-100 криптовалют обгоняют Bitcoin за 30 дней, прямо сейчас, с рейтингом лидеров и аутсайдеров.'
    : 'Our own Altcoin Season Index: what share of the top 100 cryptocurrencies are beating Bitcoin over the last 30 days, right now, with live leaderboards.';
  return {
    title,
    description,
    openGraph: buildOg({ url: `${BASE}/${locale}/altcoin-season`, title, description, locale }),
    alternates: {
      canonical: `${BASE}/${locale}/altcoin-season`,
      languages: { ru: `${BASE}/ru/altcoin-season`, en: `${BASE}/en/altcoin-season` },
    },
  };
}

const ZONES = [
  { range: '0–25',  color: '#F0883E', ru: 'Сезон биткоина',    en: 'Bitcoin Season' },
  { range: '26–74', color: '#D29922', ru: 'Нейтрально',         en: 'Neutral' },
  { range: '75–100',color: '#8B5CF6', ru: 'Сезон альткоинов',   en: 'Altcoin Season' },
];

const FAQ_RU = [
  {
    q: 'Что такое альткоин-сезон?',
    a: 'Период, когда большинство альткоинов (криптовалют, кроме Bitcoin) растут быстрее самого Bitcoin. Трейдеры используют этот термин, чтобы понять, стоит ли перекладывать капитал из BTC в альткоины в поисках более высокой доходности.',
  },
  {
    q: 'Чем ваш индекс отличается от индекса CoinMarketCap?',
    a: 'Методология похожа (доля топ-монет, обогнавших Bitcoin), но CoinMarketCap использует топ-100 монет и 90-дневное окно, а мы — топ-100 монет и 30-дневное окно (объясняем причину в разделе методологии ниже). Оба подхода легитимны, но дают разные числа — это нормально для двух независимых индексов.',
  },
  {
    q: 'Как часто обновляются данные?',
    a: 'Индекс пересчитывается по актуальным ценам CoinGecko несколько раз в сутки (около 3 раз).',
  },
  {
    q: 'Индекс 75+ значит, что нужно покупать альткоины?',
    a: 'Нет. Индекс — статистический показатель прошлой динамики, а не торговый сигнал и не прогноз. Прошлые результаты не гарантируют будущих.',
  },
];

const FAQ_EN = [
  {
    q: 'What is an altcoin season?',
    a: "A period when most altcoins (cryptocurrencies other than Bitcoin) are rising faster than Bitcoin itself. Traders use the term to gauge whether it's worth rotating capital from BTC into altcoins in search of higher returns.",
  },
  {
    q: 'How is your index different from CoinMarketCap\'s?',
    a: "The methodology is similar (share of top coins beating Bitcoin), but CoinMarketCap uses the top 100 coins over a 90-day window, while we use the top 100 coins over a 30-day window (explained in the methodology section below). Both approaches are legitimate, but they produce different numbers — that's expected for two independent indexes.",
  },
  {
    q: 'How often is the data updated?',
    a: 'The index is recalculated from live CoinGecko prices several times a day (about 3x).',
  },
  {
    q: 'Does an index of 75+ mean I should buy altcoins?',
    a: "No. The index is a statistical read of past performance, not a trading signal or a forecast. Past results don't guarantee future ones.",
  },
];

function formatPct(n: number): string {
  const sign = n > 0 ? '+' : '';
  return `${sign}${n.toFixed(1)}%`;
}

function CoinRow({ coin, locale, rank }: { coin: AltcoinSeasonCoin; locale: string; rank: number }) {
  const isPositiveMargin = coin.marginVsBtc >= 0;
  return (
    <div className="flex items-center gap-3 px-4 py-2.5 border-b border-border last:border-b-0">
      <span className="font-mono text-xs text-muted w-5 shrink-0 tabular-nums">{rank}</span>
      <Image src={coin.image} alt={coin.name} width={20} height={20} className="rounded-full shrink-0" unoptimized />
      <div className="min-w-0 flex-1">
        <span className="text-sm font-semibold text-foreground truncate block">{coin.name}</span>
        <span className="text-[10px] text-muted uppercase">{coin.symbol}</span>
      </div>
      <div className="text-right shrink-0">
        <div className="font-mono text-xs tabular-nums text-foreground">{formatPct(coin.change30d)}</div>
        <div
          className={`font-mono text-[10px] tabular-nums ${isPositiveMargin ? 'text-positive' : 'text-negative'}`}
          title={locale === 'ru' ? 'Разница с Bitcoin за 30 дней' : 'Margin vs Bitcoin over 30 days'}
        >
          {formatPct(coin.marginVsBtc)} {locale === 'ru' ? 'к BTC' : 'vs BTC'}
        </div>
      </div>
    </div>
  );
}

export default async function AltcoinSeasonPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isRu = locale === 'ru';

  const data = await fetchAltcoinSeasonIndex();
  const faq = isRu ? FAQ_RU : FAQ_EN;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: isRu ? 'Индекс альткоин-сезона' : 'Altcoin Season Index',
        url: `${BASE}/${locale}/altcoin-season`,
        publisher: { '@type': 'Organization', name: 'CryptoPulse.media' },
      },
      {
        '@type': 'FAQPage',
        mainEntity: faq.map(f => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_256px] gap-6 lg:gap-8">
      <div>

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
            {isRu ? 'Индекс альткоин-сезона' : 'Altcoin Season Index'}
          </h1>
          <p className="text-muted text-sm leading-relaxed max-w-xl">
            {isRu
              ? 'Собственный расчёт CryptoPulse.media: какая доля топ-100 криптовалют по капитализации обгоняет Bitcoin по доходности за последние 30 дней. Помогает понять, куда сейчас течёт капитал рынка — в Bitcoin или в альткоины.'
              : "CryptoPulse.media's own calculation: what share of the top 100 cryptocurrencies by market cap are outperforming Bitcoin over the last 30 days. Helps gauge where the market's capital is currently rotating — into Bitcoin, or into altcoins."}
          </p>
        </div>

        {data && (
          <div className="flex flex-col items-center gap-2 shrink-0">
            <AltcoinSeasonWidget value={data.index} classification={data.classification} locale={locale} />
            <span className="text-xs text-muted">{isRu ? 'Сейчас' : 'Current'}</span>
          </div>
        )}
      </div>

      {data && (
        <>
          {/* Zones */}
          <section className="mb-10">
            <h2 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4">
              {isRu ? 'Зоны индекса' : 'Index zones'}
            </h2>
            <div className="grid grid-cols-3 gap-2">
              {ZONES.map(z => (
                <div key={z.range} className="border border-border rounded-lg p-3 flex flex-col gap-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: z.color }} />
                    <span className="font-mono text-xs text-muted tabular-nums">{z.range}</span>
                  </div>
                  <span className="text-sm font-semibold text-foreground">{isRu ? z.ru : z.en}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted mt-3">
              {isRu
                ? `Bitcoin за последние 30 дней: ${formatPct(data.btcChange30d)}. Сравнение построено на ${data.sampleSize} альткоинах.`
                : `Bitcoin over the last 30 days: ${formatPct(data.btcChange30d)}. Comparison is based on ${data.sampleSize} altcoins.`}
            </p>
          </section>

          {/* Leaderboards */}
          <section className="mb-10">
            <h2 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4">
              {isRu ? 'Лидеры и аутсайдеры за 30 дней' : 'Leaders and laggards over 30 days'}
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="border border-border rounded-lg overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-2.5 bg-card border-b border-border">
                  <TrendingUp size={14} className="text-positive" />
                  <span className="text-xs font-semibold text-foreground">
                    {isRu ? 'Топ-10 обгоняющих Bitcoin' : 'Top 10 beating Bitcoin'}
                  </span>
                </div>
                {data.topOutperformers.map((c, i) => (
                  <CoinRow key={c.id} coin={c} locale={locale} rank={i + 1} />
                ))}
              </div>
              <div className="border border-border rounded-lg overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-2.5 bg-card border-b border-border">
                  <TrendingDown size={14} className="text-negative" />
                  <span className="text-xs font-semibold text-foreground">
                    {isRu ? 'Топ-10 отстающих от Bitcoin' : 'Top 10 lagging behind Bitcoin'}
                  </span>
                </div>
                {data.topUnderperformers.map((c, i) => (
                  <CoinRow key={c.id} coin={c} locale={locale} rank={i + 1} />
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* Methodology */}
      <section className="mb-10">
        <h2 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4">
          {isRu ? 'Как считается индекс' : 'How the index is calculated'}
        </h2>
        <div className="flex flex-col gap-3 text-sm text-muted leading-relaxed">
          <p>
            {isRu
              ? 'Берём топ-100 криптовалют по капитализации на CoinGecko, исключая стейблкоины (USDT, USDC, DAI и т.п. — они привязаны к $1 и не могут «обогнать» или «отстать») и обёрнутые/застейканные токены (WBTC, wstETH и подобные — они технически копируют цену другого актива, а не являются самостоятельной ставкой рынка).'
              : "We take the top 100 cryptocurrencies by market cap on CoinGecko, excluding stablecoins (USDT, USDC, DAI, etc. — pegged to $1, so they can't meaningfully out- or under-perform) and wrapped/staked tokens (WBTC, wstETH, and similar — these technically track another asset's price rather than representing an independent market bet)."}
          </p>
          <p>
            {isRu
              ? 'Для каждой из оставшихся ~100 монет сравниваем доходность за 30 дней с доходностью Bitcoin за тот же период. Индекс — это процент монет, которые обогнали Bitcoin, округлённый до целого числа (0–100).'
              : "For each of the remaining ~100 coins, we compare its 30-day return to Bitcoin's return over the same period. The index is the percentage of coins that beat Bitcoin, rounded to a whole number (0–100)."}
          </p>
          <p>
            {isRu
              ? 'Важное отличие от индекса CoinMarketCap: там используется 90-дневное окно. Мы считаем за 30 дней — CoinGecko отдаёт эту цифру одним запросом сразу по всем монетам, тогда как 90-дневная история потребовала бы отдельного запроса на каждую из 100 монет и упёрлась бы в лимиты бесплатного API. Это осознанный компромисс, а не ошибка: оба окна показывают одну и ту же идею (доля монет впереди Bitcoin), просто на разных временных горизонтах.'
              : "One important difference from CoinMarketCap's index: theirs uses a 90-day window. We use 30 days — CoinGecko returns that figure for the entire top-100 list in a single request, whereas a 90-day history would require a separate API call per coin and would run into free-tier rate limits. This is a deliberate trade-off, not an error: both windows measure the same underlying idea (share of coins ahead of Bitcoin), just over different time horizons."}
          </p>
        </div>
      </section>

      {/* Educational context */}
      <section className="mb-10">
        <h2 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4">
          {isRu ? 'Зачем это трейдеру' : 'Why this matters for traders'}
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-sm font-semibold text-foreground mb-2">
              {isRu ? 'Сезон биткоина (0–25)' : 'Bitcoin Season (0–25)'}
            </div>
            <p className="text-xs text-muted leading-relaxed">
              {isRu
                ? 'Капитал рынка концентрируется в Bitcoin — часто во время неопределённости или общей коррекции, когда инвесторы уходят в наименее рискованный крипто-актив.'
                : 'Market capital concentrates in Bitcoin — often during uncertainty or a broad correction, when investors rotate into the least risky crypto asset.'}
            </p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-sm font-semibold text-foreground mb-2">
              {isRu ? 'Сезон альткоинов (75–100)' : 'Altcoin Season (75–100)'}
            </div>
            <p className="text-xs text-muted leading-relaxed">
              {isRu
                ? 'Инвесторы активно ищут доходность за пределами Bitcoin. Исторически такие периоды наблюдались в конце 2017 года и в 2021 году, оба раза — на пике рыночного цикла.'
                : 'Investors actively chase returns beyond Bitcoin. Historically, such periods occurred in late 2017 and in 2021, both times near the peak of a market cycle.'}
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mb-10">
        <h2 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4">
          {isRu ? 'Частые вопросы' : 'Frequently asked questions'}
        </h2>
        <div className="flex flex-col divide-y divide-border border border-border rounded-lg overflow-hidden">
          {faq.map(f => (
            <div key={f.q} className="px-4 py-3">
              <div className="text-sm font-semibold text-foreground mb-1">{f.q}</div>
              <div className="text-xs text-muted leading-relaxed">{f.a}</div>
            </div>
          ))}
        </div>
      </section>

      <p className="text-xs text-muted mb-3">
        {isRu ? 'Смотрите также: ' : 'See also: '}
        <Link href={`/${locale}/pulse`} className="text-accent hover:underline">
          {isRu ? 'Пульс рынка — составной индекс, который включает этот показатель' : 'Market Pulse — our composite index that includes this metric'}
        </Link>
      </p>

      {/* Warning */}
      <div className="border border-border rounded-lg px-4 py-3 bg-card mb-10">
        <p className="text-xs text-muted leading-relaxed">
          <span className="font-semibold text-foreground">{isRu ? 'Важно: ' : 'Note: '}</span>
          {isRu
            ? 'Индекс альткоин-сезона — вспомогательный статистический инструмент, не торговый сигнал и не инвестиционная рекомендация. Прошлая динамика цены не гарантирует будущих результатов. CryptoPulse.media не даёт инвестиционных советов.'
            : 'The Altcoin Season Index is a supplementary statistical tool, not a trading signal or investment advice. Past price performance does not guarantee future results. CryptoPulse.media does not provide investment recommendations.'}
        </p>
      </div>

      {/* Sources / footnotes */}
      <div className="text-xs text-muted border-t border-border pt-4">
        <p className="font-semibold text-foreground mb-2">{isRu ? 'Источники' : 'Sources'}</p>
        <ol className="list-decimal list-inside flex flex-col gap-1">
          <li>
            {isRu ? 'Рыночные данные: ' : 'Market data: '}
            <a href="https://www.coingecko.com/en/api" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
              CoinGecko API
            </a>
          </li>
          <li>
            {isRu ? 'Оригинальная концепция индекса: ' : 'Original index concept: '}
            <a href="https://www.blockchaincenter.net/en/altcoin-season-index/" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
              BlockchainCenter.net — Altcoin Season Index
            </a>
          </li>
          <li>
            {isRu ? 'Похожая метрика (иная методология, 90 дней): ' : 'A similar metric (different methodology, 90-day window): '}
            <a href="https://coinmarketcap.com/charts/altcoin-season-index/" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
              CoinMarketCap — Altcoin Season Index
            </a>
          </li>
        </ol>
      </div>

      </div>
      <PopularSidebar locale={locale} />
      </div>
    </div>
  );
}
