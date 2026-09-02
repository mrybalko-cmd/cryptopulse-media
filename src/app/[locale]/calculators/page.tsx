import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { buildOg, buildTwitter, BASE } from '@/lib/metadata';
import Link from 'next/link';
import PopularSidebar from '@/components/ui/PopularSidebar';
import IndexGaugeCard from '@/components/ui/IndexGaugeCard';
import PulseWidget from '@/components/ui/PulseWidget';
import RegulationWidget from '@/components/ui/RegulationWidget';
import { ConverterCard, WealthCard } from '@/components/ui/CalculatorToolCard';
import { fetchFearGreedIndex } from '@/lib/feargreed';
import { fetchAltcoinSeasonIndex } from '@/lib/altcoinSeason';
import { fetchLatestPulse } from '@/lib/pulse';
import { fetchTopAssetPrices } from '@/lib/coins';
import { TOP_BILLIONAIRES } from '@/lib/billionaires';
import { SITE_BRAND } from '@/lib/site';


type Props = { params: Promise<{ locale: string }> };

const FAQ_RU = [
  { q: 'Как часто обновляются показатели на этой странице?', a: 'Индекс страха и жадности и Пульс рынка обновляются ежедневно, индекс альткоин-сезона — несколько раз в день, конвертер валют показывает курс в реальном времени.' },
  { q: 'Эти показатели — торговый сигнал, по которому можно принимать решения?', a: 'Нет. Все индексы на этой странице — вспомогательные аналитические инструменты. Они помогают быстро оценить контекст рынка, но не заменяют технический и фундаментальный анализ и не являются инвестиционной рекомендацией.' },
  { q: 'В чём разница между индексом страха и жадности и Пульсом рынка?', a: 'Индекс страха и жадности измеряет только эмоциональное состояние рынка. Пульс — более широкий показатель: он добавляет к настроению ротацию капитала между биткоином и альткоинами и реальный объём торгов.' },
  { q: 'Нужно ли регистрироваться, чтобы пользоваться калькуляторами?', a: 'Нет, все инструменты на странице полностью бесплатны и доступны без регистрации.' },
  { q: 'Появятся ли новые инструменты в этом разделе?', a: 'Да, мы планируем расширять раздел новыми показателями и калькуляторами по мере развития сайта.' },
];

const FAQ_EN = [
  { q: 'How often do the metrics on this page update?', a: 'The Fear & Greed Index and Market Pulse update daily, the Altcoin Season Index updates several times a day, and the currency converter shows live rates.' },
  { q: 'Can I use these metrics as a trading signal?', a: 'No. Every index on this page is a supplementary analytical tool. They help you quickly gauge market context but don’t replace full technical and fundamental analysis, and none of them constitute investment advice.' },
  { q: 'What’s the difference between the Fear & Greed Index and Market Pulse?', a: 'The Fear & Greed Index measures market sentiment only. Pulse is broader — it adds Bitcoin-to-altcoin capital rotation and real trading volume on top of sentiment.' },
  { q: 'Do I need to sign up to use the calculators?', a: 'No, every tool on this page is completely free and requires no registration.' },
  { q: 'Will more tools be added to this section?', a: 'Yes, we plan to keep expanding this page with new metrics and calculators as the site grows.' },
];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const isRu = locale === 'ru';
  const title = isRu ? 'Калькуляторы и показатели' : 'Calculators & Metrics';
  const description = isRu
    ? 'Индекс страха и жадности, индекс альткоин-сезона, конвертер валют и сравнение богатства — всё в одном месте.'
    : 'Fear & Greed Index, Altcoin Season Index, currency converter, wealth comparison — all in one place.';

  return {
    title,
    description,
    openGraph: buildOg({ url: `${BASE}/${locale}/calculators`, title, description, locale }),
    twitter: buildTwitter({ url: `${BASE}/${locale}/calculators`, title, description, locale }),
    alternates: {
      canonical: `${BASE}/${locale}/calculators`,
      languages: { ru: `${BASE}/ru/calculators`, en: `${BASE}/en/calculators`, 'x-default': `${BASE}/en/calculators` },
    },
  };
}

export default async function CalculatorsHubPage({ params }: Props) {
  const { locale } = await params;
  const isRu = locale === 'ru';

  const loc = (isRu ? 'ru' : 'en') as 'ru' | 'en';

  const [fearGreedData, altcoinSeasonData, pulseData] = await Promise.all([
    fetchFearGreedIndex().catch(() => null),
    fetchAltcoinSeasonIndex().catch(() => null),
    fetchLatestPulse().catch(() => null),
  ]);

  // Bitcoin's price feeds the converter card's live example. Same cached call
  // the homepage widgets already make, so this costs nothing extra.
  const btcSnapshot = (await fetchTopAssetPrices(['bitcoin']).catch(() => null))?.bitcoin;
  const btcPrice = btcSnapshot?.current_price;
  const btcSparkline = btcSnapshot?.sparkline_in_7d?.price.filter((_, i) => i % 4 === 0);

  // Years to match each fortune on a reference salary — the same arithmetic
  // the full calculator does, shown here as a preview.
  const REFERENCE_SALARY = 60_000;
  const wealthRows = TOP_BILLIONAIRES.slice(0, 3).map((b) => {
    const years = b.netWorth / REFERENCE_SALARY;
    return {
      name: b.name[loc].split(' ').slice(-1)[0],
      years: `${(years / 1_000_000).toFixed(1)}M`,
      pct: Math.round((b.netWorth / TOP_BILLIONAIRES[0].netWorth) * 100),
    };
  });

  const faq = isRu ? FAQ_RU : FAQ_EN;
  /* One graph instead of a lone FAQPage: the two calculators are declared as
     applications and listed as an ItemList, so Google reads this page as a
     set of tools rather than a page of prose. */
  const pageUrl = `${BASE}/${locale}/calculators`;
  const tools = [
    {
      name: isRu ? 'Сравнение богатства' : 'Wealth Comparison',
      url: `${pageUrl.replace('/calculators', '')}/calculators/wealth`,
      description: isRu
        ? 'Сколько лет нужно работать, чтобы накопить состояние одного из богатейших людей мира.'
        : "How many years it would take to match the fortune of one of the world's richest people.",
    },
    {
      name: isRu ? 'Конвертер валют' : 'Currency Converter',
      url: `${pageUrl.replace('/calculators', '')}/calculators/converter`,
      description: isRu
        ? 'Перевод 20 основных фиатных валют в биткоин и другие топовые криптовалюты по актуальному курсу.'
        : 'Convert 20 major fiat currencies into Bitcoin and other top cryptocurrencies at live rates.',
    },
  ];

  const pageLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: isRu ? 'Главная' : 'Home', item: `${BASE}/${locale}` },
          { '@type': 'ListItem', position: 2, name: isRu ? 'Калькуляторы' : 'Calculators', item: pageUrl },
        ],
      },
      {
        '@type': 'ItemList',
        name: isRu ? `Калькуляторы ${SITE_BRAND}.media` : `${SITE_BRAND}.media calculators`,
        numberOfItems: tools.length,
        itemListElement: tools.map((t, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          item: {
            '@type': 'WebApplication',
            name: t.name,
            url: t.url,
            description: t.description,
            applicationCategory: 'FinanceApplication',
            operatingSystem: 'Any',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          },
        })),
      },
      {
        '@type': 'FAQPage',
        mainEntity: faq.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  };

  /* One sentence per index explaining what this reading means — the page
     used to show a bare number and leave the reader to guess. */
  const fngExplain = (v: number) =>
    v <= 44
      ? isRu
        ? 'Ниже 45 рынок живёт осторожностью — исторически такие периоды совпадали с локальными минимумами цены.'
        : 'Below 45 the market runs on caution — historically these stretches have lined up with local price bottoms.'
      : v <= 55
        ? isRu
          ? 'Рынок в равновесии: ни паники, ни эйфории — движения чаще определяются новостями, а не настроением.'
          : 'The market sits in balance — moves come from news rather than mood at these readings.'
        : isRu
          ? 'Выше 55 начинается жадность: покупают охотнее, но и риск перегрева растёт.'
          : 'Above 55 greed takes over — buying gets easier, and so does overheating.';

  const altExplain = (v: number) =>
    v <= 25
      ? isRu
        ? `Только ${v} из топ-50 монет обогнали биткоин за 90 дней — деньги сидят в BTC, а не расходятся по рынку.`
        : `Only ${v} of the top 50 coins beat Bitcoin over 90 days — money is sitting in BTC, not spreading out.`
      : v <= 74
        ? isRu
          ? `${v} из топ-50 монет обгоняют биткоин — рынок без явного перевеса в одну сторону.`
          : `${v} of the top 50 coins are beating Bitcoin — neither side clearly leads.`
        : isRu
          ? `${v} из топ-50 монет обгоняют биткоин — капитал заметно перетекает в альткоины.`
          : `${v} of the top 50 coins beat Bitcoin — capital is rotating into altcoins.`;

  const fngColor = (v: number) =>
    v <= 24 ? '#E5534B' : v <= 44 ? '#F0883E' : v <= 55 ? '#D29922' : v <= 74 ? '#3FB950' : '#2EA043';
  const altColor = (v: number) => (v <= 25 ? '#F0883E' : v <= 74 ? '#D29922' : '#8B5CF6');

  const FNG_LABELS: Record<string, { ru: string; en: string }> = {
    'Extreme Fear': { ru: 'Крайний страх', en: 'Extreme Fear' },
    Fear: { ru: 'Страх', en: 'Fear' },
    Neutral: { ru: 'Нейтрально', en: 'Neutral' },
    Greed: { ru: 'Жадность', en: 'Greed' },
    'Extreme Greed': { ru: 'Крайняя жадность', en: 'Extreme Greed' },
  };
  const ALT_LABELS: Record<string, { ru: string; en: string }> = {
    bitcoin: { ru: 'Сезон биткоина', en: 'Bitcoin season' },
    neutral: { ru: 'Нейтрально', en: 'Neutral' },
    altcoin: { ru: 'Сезон альткоинов', en: 'Altcoin season' },
  };

  return (
    <div className="max-w-[1320px] mx-auto px-4 sm:px-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageLd) }} />

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_256px] gap-6 lg:gap-8">
        <div className="min-w-0">
          {/* Summary strip — the three readings before any single instrument */}
          <div className="flex items-stretch overflow-x-auto scrollbar-none border-y border-border -mx-4 sm:mx-0 mb-6">
            {fearGreedData && (
              <span className="flex items-baseline gap-2 px-4 sm:px-5 py-2.5 border-r border-border whitespace-nowrap">
                <span className="text-[9.5px] font-bold uppercase tracking-wider text-muted">
                  {isRu ? 'Страх и жадность' : 'Fear & Greed'}
                </span>
                <span className="text-[13px] font-extrabold text-foreground tabular-nums">{fearGreedData.value}</span>
                <span className="text-[11px] font-bold" style={{ color: fngColor(fearGreedData.value) }}>
                  {FNG_LABELS[fearGreedData.classification]?.[loc] ?? fearGreedData.classification}
                </span>
              </span>
            )}
            {altcoinSeasonData && (
              <span className="flex items-baseline gap-2 px-4 sm:px-5 py-2.5 border-r border-border whitespace-nowrap">
                <span className="text-[9.5px] font-bold uppercase tracking-wider text-muted">
                  {isRu ? 'Альткоин-сезон' : 'Altcoin season'}
                </span>
                <span className="text-[13px] font-extrabold text-foreground tabular-nums">{altcoinSeasonData.index}</span>
                <span className="text-[11px] font-bold" style={{ color: altColor(altcoinSeasonData.index) }}>
                  {ALT_LABELS[altcoinSeasonData.classification]?.[loc] ?? altcoinSeasonData.classification}
                </span>
              </span>
            )}
            {pulseData && (
              <span className="flex items-baseline gap-2 px-4 sm:px-5 py-2.5 border-r border-border whitespace-nowrap">
                <span className="text-[9.5px] font-bold uppercase tracking-wider text-muted">
                  {isRu ? 'Пульс' : 'Pulse'}
                </span>
                <span className="text-[13px] font-extrabold text-foreground tabular-nums">{pulseData.score}</span>
              </span>
            )}
            <span className="flex items-center px-4 sm:px-5 py-2.5 whitespace-nowrap">
              <span className="text-[10px] text-muted">{isRu ? 'обновление ежедневно' : 'updated daily'}</span>
            </span>
          </div>

          <nav className="flex items-center gap-1.5 text-xs text-muted mb-4">
            <Link href={`/${locale}`} className="hover:text-accent transition-colors">{isRu ? 'Главная' : 'Home'}</Link>
            <span>›</span>
            <span className="text-foreground">{isRu ? 'Калькуляторы' : 'Calculators'}</span>
          </nav>

          <h1 className="text-3xl sm:text-[38px] font-extrabold text-foreground leading-[1.08] tracking-tight mb-3 text-balance">
            {isRu ? (
              <>Понять рынок раньше, чем <span className="text-accent">читать графики</span></>
            ) : (
              <>Read the market before you <span className="text-accent">read the charts</span></>
            )}
          </h1>
          <p className="text-muted text-sm leading-relaxed mb-7 max-w-2xl">
            {isRu
              ? 'Три индекса, которые говорят, в каком настроении рынок, и два калькулятора, превращающих число в понятный ответ.'
              : 'Three indices that say what mood the market is in, and two calculators that turn a number into an answer you can act on.'}
          </p>

          {(fearGreedData || altcoinSeasonData || pulseData) && (
            <>
              <div className="flex items-baseline justify-between gap-3 mb-3">
                <h2 className="text-[12.5px] font-extrabold uppercase tracking-wider text-foreground">
                  {isRu ? 'Показатели рынка' : 'Market indicators'}
                </h2>
                <span className="text-[11px] text-muted">{isRu ? 'обновление ежедневно' : 'updated daily'}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {fearGreedData && (
                  <IndexGaugeCard
                    id="fng"
                    name={isRu ? 'Индекс страха и жадности' : 'Fear & Greed Index'}
                    value={fearGreedData.value}
                    classification={FNG_LABELS[fearGreedData.classification]?.[loc] ?? fearGreedData.classification}
                    color={fngColor(fearGreedData.value)}
                    gradient={['#E5534B', '#F0883E', '#D29922', '#3FB950', '#2EA043']}
                    explanation={fngExplain(fearGreedData.value)}
                    source="alternative.me"
                    href={`/${locale}/fear-greed`}
                  />
                )}
                {altcoinSeasonData && (
                  <IndexGaugeCard
                    id="alt"
                    name={isRu ? 'Индекс альткоин-сезона' : 'Altcoin Season Index'}
                    value={altcoinSeasonData.index}
                    classification={ALT_LABELS[altcoinSeasonData.classification]?.[loc] ?? altcoinSeasonData.classification}
                    color={altColor(altcoinSeasonData.index)}
                    gradient={['#F0883E', '#D29922', '#8B5CF6']}
                    explanation={altExplain(altcoinSeasonData.index)}
                    source={`${SITE_BRAND} · CoinGecko`}
                    href={`/${locale}/altcoin-season`}
                  />
                )}
                {pulseData && <PulseWidget data={pulseData} locale={locale} variant="hub" />}
                <RegulationWidget locale={locale} />
              </div>
            </>
          )}

          <h2 className="text-[12.5px] font-extrabold uppercase tracking-wider text-foreground mt-8 mb-3">
            {isRu ? 'Калькуляторы' : 'Calculators'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ConverterCard
              locale={locale}
              btcPrice={btcPrice}
              btcSparkline={btcSparkline}
              btcChange7d={btcSnapshot?.price_change_percentage_7d_in_currency}
            />
            <WealthCard locale={locale} people={wealthRows} />
          </div>

          {/* SEO body text */}
          <section className="mt-12 mb-10">
            <h2 className="text-lg font-bold text-foreground mb-4">
              {isRu ? 'Зачем нужны эти инструменты' : 'Why these tools matter'}
            </h2>
            {isRu ? (
              <div className="space-y-4 text-sm text-muted leading-relaxed">
                <p>
                  Крипторынок никогда не останавливается — торги идут круглосуточно, семь дней в неделю, а настроение
                  участников может измениться за несколько часов. Чтобы не пересматривать десятки графиков и лент
                  новостей, удобно иметь под рукой несколько простых, но точных индикаторов. Именно для этого мы
                  собрали на одной странице пять инструментов: индекс страха и жадности, индекс альткоин-сезона,
                  собственный составной показатель «Пульс рынка», конвертер валют и калькулятор сравнения богатства.
                </p>
                <p>
                  <span className="font-semibold text-foreground">Индекс страха и жадности</span> отвечает на вопрос
                  «что сейчас чувствует рынок?». Он собирает данные о волатильности, объёме торгов, активности в
                  соцсетях и доминации биткоина и превращает их в одно число от 0 до 100. Низкие значения означают
                  панику и часто совпадают с локальными минимумами цены, высокие — эйфорию и риск перегрева.
                </p>
                <p>
                  <span className="font-semibold text-foreground">Индекс альткоин-сезона</span> показывает, куда
                  сейчас движутся деньги — в биткоин или в альткоины. Когда индекс высокий, большинство топовых
                  альткоинов обгоняют биткоин по доходности за последние 90 дней, а значит, на рынке «сезон
                  альткоинов». Когда низкий — капитал уходит в биткоин как в более консервативный актив.
                </p>
                <p>
                  <span className="font-semibold text-foreground">Пульс рынка</span> — наш собственный составной
                  индекс. Он не ограничивается только настроением, а объединяет три сигнала сразу: индекс страха и
                  жадности (40%), индекс альткоин-сезона (30%) и реальный импульс объёма торгов за последние сутки
                  (30%). Такое сочетание даёт более цельную картину рынка, чем любой из показателей по отдельности.
                </p>
                <p>
                  <span className="font-semibold text-foreground">Конвертер валют</span> переводит сумму в любой из
                  20 основных фиатных валют в биткоин и другие топовые криптовалюты по курсу, который обновляется в
                  реальном времени — удобно для быстрой оценки стоимости покупки или продажи.
                </p>
                <p>
                  <span className="font-semibold text-foreground">Сравнение богатства</span> — развлекательный, но
                  наглядный калькулятор: он показывает, сколько лет пришлось бы работать при вашем доходе, чтобы
                  накопить состояние одного из самых богатых людей планеты.
                </p>
                <p>
                  Все пять инструментов бесплатны, не требуют регистрации и обновляются автоматически, так что
                  достаточно просто вернуться на эту страницу, чтобы увидеть актуальные цифры.
                </p>
              </div>
            ) : (
              <div className="space-y-4 text-sm text-muted leading-relaxed">
                <p>
                  The crypto market never sleeps — trading runs 24/7, and sentiment can flip in a matter of hours.
                  Rather than digging through dozens of charts and news feeds, it helps to have a handful of simple
                  but reliable indicators in one place. That&apos;s why we brought together five tools on a single
                  page: the Fear &amp; Greed Index, the Altcoin Season Index, our own composite Market Pulse score,
                  a currency converter, and a wealth-comparison calculator.
                </p>
                <p>
                  <span className="font-semibold text-foreground">The Fear &amp; Greed Index</span> answers one
                  question: how is the market feeling right now? It pulls in volatility, trading volume, social media
                  activity, and Bitcoin dominance, then compresses all of it into a single number from 0 to 100. Low
                  readings mean panic and often line up with local price bottoms; high readings mean euphoria and the
                  risk of overheating.
                </p>
                <p>
                  <span className="font-semibold text-foreground">The Altcoin Season Index</span> shows where money is
                  currently flowing — into Bitcoin or into altcoins. When the index is high, most top altcoins have
                  outperformed Bitcoin over the past 90 days, signaling an &laquo;altcoin season&raquo;. When it&apos;s low,
                  capital is rotating back into Bitcoin as the more conservative asset.
                </p>
                <p>
                  <span className="font-semibold text-foreground">Market Pulse</span> is our own composite index. It
                  goes beyond sentiment alone, combining three signals at once: the Fear &amp; Greed Index (40%), the
                  Altcoin Season Index (30%), and real 24-hour trading volume momentum (30%). Together they give a
                  more complete read on the market than any single metric on its own.
                </p>
                <p>
                  <span className="font-semibold text-foreground">The currency converter</span> translates an amount
                  in any of the 20 major fiat currencies into Bitcoin and other top cryptocurrencies at a
                  continuously updated live rate — handy for quickly sizing a purchase or sale.
                </p>
                <p>
                  <span className="font-semibold text-foreground">Wealth Comparison</span> is a lighter, more playful
                  calculator: it shows how many years you&apos;d need to work at your current income to match the
                  fortune of one of the richest people on the planet.
                </p>
                <p>
                  All five tools are free, require no sign-up, and update automatically — just come back to this page
                  any time to see the latest numbers.
                </p>
              </div>
            )}
          </section>

          {/* FAQ */}
          <section className="mb-10">
            <h2 className="text-lg font-bold text-foreground mb-4">
              {isRu ? 'Частые вопросы' : 'Frequently asked questions'}
            </h2>
            <div className="flex flex-col gap-2">
              {faq.map((f) => (
                <details key={f.q} className="group bg-card border border-border rounded-lg px-4 py-3 open:border-accent/40">
                  <summary className="cursor-pointer list-none flex items-start justify-between gap-3 text-sm font-semibold text-foreground">
                    {f.q}
                    <span className="text-muted text-xs shrink-0 mt-0.5 group-open:rotate-180 transition-transform">▾</span>
                  </summary>
                  <p className="text-sm text-muted leading-relaxed mt-2">{f.a}</p>
                </details>
              ))}
            </div>
          </section>
        </div>

        <PopularSidebar locale={locale} />
      </div>
    </div>
  );
}
