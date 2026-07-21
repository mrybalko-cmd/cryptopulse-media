import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { buildOg, BASE } from '@/lib/metadata';
import Link from 'next/link';
import { Scale, ArrowRightLeft, ArrowRight } from 'lucide-react';
import PopularSidebar from '@/components/ui/PopularSidebar';
import FearGreedWidget from '@/components/ui/FearGreedWidget';
import AltcoinSeasonWidget from '@/components/ui/AltcoinSeasonWidget';
import PulseWidget from '@/components/ui/PulseWidget';
import { fetchFearGreedIndex } from '@/lib/feargreed';
import { fetchAltcoinSeasonIndex } from '@/lib/altcoinSeason';
import { fetchLatestPulse } from '@/lib/pulse';


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
  const title = isRu ? 'Калькуляторы и показатели — CryptoPulse.media' : 'Calculators & Metrics — CryptoPulse.media';
  const description = isRu
    ? 'Индекс страха и жадности, индекс альткоин-сезона, конвертер валют и сравнение богатства — всё в одном месте.'
    : 'Fear & Greed Index, Altcoin Season Index, currency converter, wealth comparison — all in one place.';

  return {
    title,
    description,
    openGraph: buildOg({ url: `${BASE}/${locale}/calculators`, title, description, locale }),
    alternates: {
      canonical: `${BASE}/${locale}/calculators`,
      languages: { ru: `${BASE}/ru/calculators`, en: `${BASE}/en/calculators` },
    },
  };
}

export default async function CalculatorsHubPage({ params }: Props) {
  const { locale } = await params;
  const isRu = locale === 'ru';

  const [fearGreedData, altcoinSeasonData, pulseData] = await Promise.all([
    fetchFearGreedIndex().catch(() => null),
    fetchAltcoinSeasonIndex().catch(() => null),
    fetchLatestPulse().catch(() => null),
  ]);

  const faq = isRu ? FAQ_RU : FAQ_EN;
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  const cards = [
    {
      href: `/${locale}/calculators/wealth`,
      icon: Scale,
      title: isRu ? 'Сравнение богатства' : 'Wealth Comparison',
      description: isRu
        ? 'Введи свой доход и узнай, сколько лет нужно работать, чтобы накопить состояние одного из самых богатых людей мира.'
        : "Enter your income and find out how many years it would take to match the fortune of one of the world's richest people.",
    },
    {
      href: `/${locale}/calculators/converter`,
      icon: ArrowRightLeft,
      title: isRu ? 'Конвертер валют' : 'Currency Converter',
      description: isRu
        ? 'Переведи сумму в любой из 20 основных фиатных валют в биткоин и другие топовые криптовалюты по актуальному курсу.'
        : 'Convert an amount in any of the 20 major fiat currencies into Bitcoin and other top cryptocurrencies at live rates.',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_256px] gap-6 lg:gap-8">
        <div>
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground">
              {isRu ? 'Калькуляторы и показатели' : 'Calculators & Metrics'}
            </h1>
            <p className="text-muted text-sm mt-2">
              {isRu
                ? 'Индекс страха и жадности, индекс альткоин-сезона, конвертер валют и сравнение богатства.'
                : 'Fear & Greed Index, Altcoin Season Index, currency converter, and wealth comparison.'}
            </p>
          </div>

          {/* Fear & Greed Index + Altcoin Season Index + Pulse */}
          {(fearGreedData || altcoinSeasonData || pulseData) && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {fearGreedData && (
                <div className="p-5 rounded-2xl border border-border bg-card">
                  <p className="text-xs font-semibold text-muted uppercase tracking-widest mb-3">
                    {isRu ? 'Индекс страха и жадности' : 'Fear & Greed Index'}
                  </p>
                  <FearGreedWidget
                    value={fearGreedData.value}
                    classification={fearGreedData.classification}
                    locale={locale}
                  />
                </div>
              )}
              {altcoinSeasonData && (
                <div className="p-5 rounded-2xl border border-border bg-card">
                  <p className="text-xs font-semibold text-muted uppercase tracking-widest mb-3">
                    {isRu ? 'Индекс альткоин-сезона' : 'Altcoin Season Index'}
                  </p>
                  <AltcoinSeasonWidget
                    value={altcoinSeasonData.index}
                    classification={altcoinSeasonData.classification}
                    locale={locale}
                  />
                </div>
              )}
              {pulseData && <PulseWidget data={pulseData} locale={locale} idSuffix="calculators-hub" />}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {cards.map((card) => {
              const Icon = card.icon;
              return (
                <Link
                  key={card.href}
                  href={card.href}
                  className="group flex flex-col gap-3 p-6 rounded-2xl border border-border bg-card hover:border-accent/40 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                    <Icon size={20} />
                  </div>
                  <h2 className="text-base font-semibold text-foreground">{card.title}</h2>
                  <p className="text-sm text-muted leading-relaxed flex-1">{card.description}</p>
                  <span className="flex items-center gap-1 text-sm text-accent font-medium">
                    {isRu ? 'Открыть' : 'Open'}
                    <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </Link>
              );
            })}
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
                  outperformed Bitcoin over the past 90 days, signaling an "altcoin season." When it&apos;s low,
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
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
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
