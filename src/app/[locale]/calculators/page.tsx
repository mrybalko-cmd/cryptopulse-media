// Страница рендерилась на каждый заход: без этой строки маршрут считался
// динамическим, и боевой адрес отвечал no-store с вечным промахом кэша.
// Пятнадцать минут здесь — потолок, а не реальное окно: под маршрутом лежат
// чтения из Sanity со своим кэшем на 300 секунд, и пересборка идёт по
// меньшему из двух. В сборке маршрут так и отмечен — 5m.
export const revalidate = 900;

import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { buildOg, buildTwitter, BASE } from '@/lib/metadata';
import Link from 'next/link';
import PopularSidebar from '@/components/ui/PopularSidebar';
import RegulationWidget from '@/components/ui/RegulationWidget';
import MarketNow from '@/components/ui/calculators/MarketNow';
import { CalendarCard, AssetsCard } from '@/components/ui/calculators/ReferenceCards';
import { ConverterCard, WealthCard } from '@/components/ui/CalculatorToolCard';
import { fetchFearGreedIndex } from '@/lib/feargreed';
import { fetchAltcoinSeasonIndex } from '@/lib/altcoinSeason';
import { fetchLatestPulse } from '@/lib/pulse';
import { fetchTopAssetPrices, COINS, type CoinPriceSnapshot } from '@/lib/coins';
import { fetchCalendarEvents } from '@/lib/sanity';
import { TOP_BILLIONAIRES } from '@/lib/billionaires';
import { WEALTH_DEFAULTS, formatInt } from '@/lib/wealth';
import { zoneMeta } from '@/lib/pulseMath';
import { SITE_BRAND } from '@/lib/site';

type Props = { params: Promise<{ locale: string }> };

/** Сколько ближайших событий показывает карточка календаря. */
const CALENDAR_ITEMS = 5;
/** Монет в карточке активов: восемь ложатся сеткой 2×4 без остатка. */
const ASSET_TILES = 8;

const FAQ_RU = [
  { q: 'Как часто обновляются показатели на этой странице?', a: 'Пульс считается раз в сутки автоматическим заданием. Индекс страха и жадности и индекс альткоин-сезона обновляются несколько раз в день, курсы в конвертере и цены монет — непрерывно. Карту регулирования редакция проверяет вручную, и дата последней проверки стоит прямо на виджете.' },
  { q: 'Можно ли по этим числам принимать торговые решения?', a: 'Нет. Это вспомогательные показатели: они говорят, в каком состоянии рынок, но не говорят, что с этим делать. Ни один индекс не заменяет собственного анализа, и ни одно число на этой странице не является инвестиционной рекомендацией.' },
  { q: 'В чём разница между индексом страха и жадности и Пульсом?', a: 'Страх и жадность меряет только настроение: рынок может быть в эйфории при мёртвых торгах, и индекс этого не покажет. Пульс добавляет к настроению оборот биткоина против годовой нормы, изменение цены за сутки и размах движения. Поэтому расхождение между ними само по себе информативно.' },
  { q: 'Нужна ли регистрация?', a: 'Нет. Все инструменты на странице бесплатны и работают без регистрации и без входа в аккаунт.' },
  { q: 'Откуда берётся карта регулирования и как часто её проверяют?', a: 'Статус криптовалют по странам ведёт редакция по открытым источникам: законам, разъяснениям регуляторов и официальным заявлениям. Дата последней проверки стоит на самом виджете, а на странице карты её видно по каждой стране отдельно.' },
];

const FAQ_EN = [
  { q: 'How often do the readings on this page update?', a: 'A scheduled job computes Pulse once a day. The Fear and Greed Index and the Altcoin Season Index refresh several times a day; converter rates and coin prices change with the market. The editors check the regulation map by hand, and the date of the last check sits on the widget itself.' },
  { q: 'Can I trade on these numbers?', a: 'No. They describe the state of the market and stop there. No index replaces your own analysis, and nothing on this page is investment advice.' },
  { q: 'What is the difference between Fear and Greed and Pulse?', a: 'Fear and greed measures mood alone, so the market can look euphoric on dead trading and the index will not show it. Pulse adds Bitcoin turnover against its yearly norm, the 24-hour price move and the range of that move. A gap between the two carries information neither gives on its own.' },
  { q: 'Do I need an account?', a: 'No. Every tool on this page is free and works without signing up.' },
  { q: 'Where does the regulation map come from, and how often is it checked?', a: 'The editors maintain the per-country status from public sources: laws, regulator guidance and official statements. The date of the last check sits on the widget, and the map page carries it per country.' },
];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const isRu = locale === 'ru';
  const title = isRu ? 'Калькуляторы и показатели рынка' : 'Market readings & calculators';
  const description = isRu
    ? 'Пульс рынка, индекс страха и жадности, индекс альткоин-сезона, конвертер валют и калькулятор состояний. Плюс карта регулирования, криптокалендарь и страницы монет.'
    : 'Market Pulse, the Fear & Greed Index, the Altcoin Season Index, a currency converter and a wealth calculator. Plus the regulation map, the crypto calendar and coin pages.';

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

/** Заголовок полки. Отдельным компонентом, чтобы три полки были одинаковыми. */
function Shelf({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) {
  return (
    <section className="mb-7">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h2 className="text-[12.5px] font-extrabold uppercase tracking-wider text-foreground">{title}</h2>
        {note && <span className="shrink-0 text-[11px] text-muted">{note}</span>}
      </div>
      {children}
    </section>
  );
}

export default async function CalculatorsHubPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isRu = locale === 'ru';
  const loc = (isRu ? 'ru' : 'en') as 'ru' | 'en';

  const [fearGreed, altcoin, pulse, events, prices] = await Promise.all([
    fetchFearGreedIndex().catch(() => null),
    fetchAltcoinSeasonIndex().catch(() => null),
    fetchLatestPulse().catch(() => null),
    fetchCalendarEvents().catch(() => []),
    fetchTopAssetPrices(COINS.slice(0, ASSET_TILES).map((c) => c.coingeckoId))
      .catch((): Record<string, CoinPriceSnapshot> => ({})),
  ]);

  const btc = prices['bitcoin'];

  // Ближайшие события: прошедшие отсекаем по началу сегодняшнего дня, иначе
  // сегодняшнее событие исчезало бы из карточки в полдень.
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = events.filter((e) => e.date >= today).slice(0, CALENDAR_ITEMS);

  // Превью калькулятора считается ровно по тем условиям, что стоят на самой
  // странице по умолчанию: доход и норма сбережений из WEALTH_DEFAULTS. Иначе
  // карточка обещает одно число, а страница после клика показывает другое.
  const savedPerYear = WEALTH_DEFAULTS.inc * 12 * (WEALTH_DEFAULTS.rate / 100);
  const wealthRows = TOP_BILLIONAIRES.slice(0, 3).map((b) => {
    const years = b.netWorth / savedPerYear;
    return {
      name: b.name[loc].split(' ').slice(-1)[0],
      years: years >= 1e6 ? `${(years / 1e6).toFixed(0)} ${isRu ? 'млн' : 'M'}` : formatInt(years, locale),
      pct: Math.round((b.netWorth / TOP_BILLIONAIRES[0].netWorth) * 100),
    };
  });
  const wealthBasis = isRu
    ? `при доходе $${WEALTH_DEFAULTS.inc.toLocaleString('ru-RU')} и ${WEALTH_DEFAULTS.rate}% в накопления`
    : `at $${WEALTH_DEFAULTS.inc.toLocaleString('en-US')} a month, ${WEALTH_DEFAULTS.rate}% saved`;

  /**
   * Сводка дня — три числа одной фразой.
   *
   * Заменяет прежнюю полоску над заголовком, где те же 74, 65 и 41 стояли
   * ровно перед карточками с теми же 74, 65 и 41. Читатель проходил одно и то
   * же дважды, а подпись «обновление ежедневно» висела в двух местах.
   */
  const summary = (() => {
    const parts: string[] = [];
    if (fearGreed) {
      parts.push(
        fearGreed.value <= 44
          ? isRu ? `рынок осторожен (${fearGreed.value})` : `the market is cautious (${fearGreed.value})`
          : fearGreed.value <= 55
            ? isRu ? `настроение ровное (${fearGreed.value})` : `mood is level (${fearGreed.value})`
            : isRu ? `рынок в жадности (${fearGreed.value})` : `the market is greedy (${fearGreed.value})`
      );
    }
    if (altcoin) {
      parts.push(
        altcoin.index >= 75
          ? isRu ? `альткоины обгоняют биткоин (${altcoin.index})` : `altcoins are beating Bitcoin (${altcoin.index})`
          : altcoin.index <= 25
            ? isRu ? `деньги сидят в биткоине (${altcoin.index})` : `money sits in Bitcoin (${altcoin.index})`
            : isRu ? `перевеса между биткоином и альткоинами нет (${altcoin.index})` : `neither Bitcoin nor altcoins lead (${altcoin.index})`
      );
    }
    if (pulse) {
      const z = zoneMeta(pulse.zone);
      parts.push(
        isRu
          ? `наш пульс ${pulse.score} — ${(isRu ? z.ru : z.en).toLowerCase()}`
          : `our pulse reads ${pulse.score}, ${z.en.toLowerCase()}`
      );
    }
    if (parts.length === 0) return null;
    return `${isRu ? 'Сегодня' : 'Today'}: ${parts.join(isRu ? ', ' : ', ')}.`;
  })();

  const pageUrl = `${BASE}/${locale}/calculators`;
  const faq = isRu ? FAQ_RU : FAQ_EN;

  /* Один граф на страницу: инструменты объявлены приложениями и собраны в
     ItemList, чтобы Google читал страницу как набор инструментов, а не как
     текст с вопросами. */
  const tools = [
    {
      name: isRu ? 'Пульс рынка' : 'Market Pulse',
      url: `${BASE}/${locale}/pulse`,
      description: isRu
        ? 'Составной индекс состояния рынка по обороту, движению цены и настроению. Абсолютная шкала 0–100.'
        : 'A composite index of market conditions built from turnover, price movement and sentiment, on an absolute 0–100 scale.',
    },
    {
      name: isRu ? 'Индекс страха и жадности' : 'Fear & Greed Index',
      url: `${BASE}/${locale}/fear-greed`,
      description: isRu
        ? 'Настроение крипторынка одним числом от 0 до 100 по данным alternative.me.'
        : 'Crypto market sentiment as a single number from 0 to 100, sourced from alternative.me.',
    },
    {
      name: isRu ? 'Индекс альткоин-сезона' : 'Altcoin Season Index',
      url: `${BASE}/${locale}/altcoin-season`,
      description: isRu
        ? 'Доля крупнейших монет, обгоняющих биткоин за 30 дней, с лидерами и аутсайдерами.'
        : 'The share of the largest coins beating Bitcoin over 30 days, with leaders and laggards.',
    },
    {
      name: isRu ? 'Конвертер валют' : 'Currency Converter',
      url: `${BASE}/${locale}/calculators/converter`,
      description: isRu
        ? 'Перевод 20 основных фиатных валют в биткоин и другие топовые криптовалюты по актуальному курсу.'
        : 'Convert 20 major fiat currencies into Bitcoin and other top cryptocurrencies at live rates.',
    },
    {
      name: isRu ? 'Состояние миллиардеров' : 'Billionaire wealth',
      url: `${BASE}/${locale}/calculators/wealth`,
      description: isRu
        ? 'Живой счётчик состояний пятёрки Forbes с переводом в биткоины и расчётом срока накопления.'
        : 'A live counter for the five largest Forbes fortunes, converted into bitcoin, with your own saving horizon.',
    },
    {
      name: isRu ? 'Карта регулирования криптовалют' : 'Crypto regulation map',
      url: `${BASE}/${locale}/regulation`,
      description: isRu
        ? 'Статус криптовалют по странам: где разрешено, где с ограничениями, где запрещено.'
        : 'Per-country status of crypto: where it is legal, restricted or banned.',
    },
  ];

  const pageLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: isRu ? 'Главная' : 'Home', item: `${BASE}/${locale}` },
          { '@type': 'ListItem', position: 2, name: isRu ? 'Калькуляторы и показатели' : 'Calculators & Metrics', item: pageUrl },
        ],
      },
      {
        '@type': 'ItemList',
        name: isRu ? `Показатели и калькуляторы ${SITE_BRAND}` : `${SITE_BRAND} readings and calculators`,
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
            isAccessibleForFree: true,
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

  return (
    <div className="mx-auto max-w-[1320px] px-4 py-8 sm:px-6 sm:py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageLd) }} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_256px] lg:gap-8">
        <div className="min-w-0">
          <nav aria-label={isRu ? 'Хлебные крошки' : 'Breadcrumb'} className="mb-3 flex items-center gap-1.5 text-xs text-muted">
            <Link href={`/${locale}`} className="transition-colors hover:text-accent">{isRu ? 'Главная' : 'Home'}</Link>
            <span>›</span>
            <span className="text-foreground">{isRu ? 'Калькуляторы и показатели' : 'Calculators & Metrics'}</span>
          </nav>

          <h1 className="mb-2.5 text-balance text-3xl font-extrabold leading-[1.08] tracking-tight text-foreground sm:text-[36px]">
            {isRu ? (
              <>Понять рынок раньше, чем <span className="text-accent">читать графики</span></>
            ) : (
              <>Read the market before you <span className="text-accent">read the charts</span></>
            )}
          </h1>
          <p className="mb-3 max-w-2xl text-sm leading-relaxed text-muted">
            {isRu
              ? 'Три показателя, которые говорят, в каком настроении рынок, два калькулятора и справочники по регулированию, событиям и монетам.'
              : 'Three readings that say what mood the market is in, two calculators, and reference pages on regulation, events and coins.'}
          </p>
          {summary && (
            <p className="mb-7 max-w-[70ch] border-l border-[var(--glass-edge)] pl-3 text-[13px] leading-relaxed text-muted">
              {summary}
            </p>
          )}

          <Shelf
            title={isRu ? 'Рынок сейчас' : 'Market now'}
            note={isRu ? 'обновляется ежедневно' : 'updated daily'}
          >
            <MarketNow locale={locale} fearGreed={fearGreed} altcoin={altcoin} pulse={pulse} />
          </Shelf>

          <Shelf title={isRu ? 'Калькуляторы' : 'Calculators'} note={isRu ? 'без регистрации' : 'no sign-up'}>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <ConverterCard
                locale={locale}
                btcPrice={btc?.current_price}
                btcSparkline={btc?.sparkline_in_7d?.price.filter((_, i) => i % 4 === 0)}
                btcChange7d={btc?.price_change_percentage_7d_in_currency}
              />
              <WealthCard locale={locale} people={wealthRows} basis={wealthBasis} />
            </div>
          </Shelf>

          <Shelf
            title={isRu ? 'Справочники' : 'Reference'}
            note={isRu ? 'то, за чем приходят раз, а не каждый день' : 'what you look up once, not daily'}
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[1.35fr_1fr_1.18fr]">
              <RegulationWidget locale={locale} compact />
              <CalendarCard locale={locale} events={upcoming} />
              <AssetsCard locale={locale} prices={prices} />
            </div>
          </Shelf>

          <section className="mb-10 mt-12 max-w-[68ch]">
            {isRu ? (
              <>
                <h2 className="mb-3 text-lg font-bold text-foreground">Что показывает каждый показатель</h2>
                <div className="space-y-4 text-sm leading-relaxed text-muted">
                  <p>
                    Крипторынок торгуется круглосуточно, и настроение участников меняется за часы. Пересматривать
                    десятки графиков ради одного вопроса «что сейчас происходит» бессмысленно, поэтому на странице
                    собраны три числа, которые отвечают на него с трёх разных сторон. Каждое открывается отдельной
                    страницей с историей и разбором.
                  </p>
                  <p>
                    <span className="font-semibold text-foreground">Пульс рынка</span> мы считаем сами, остальные
                    два заимствуем. Он складывает четыре величины: оборот биткоина против годовой нормы с поправкой
                    на день недели, изменение цены за сутки, размах движения и внешний индекс страха и жадности.
                    Шкала абсолютная, от 0 до 100, где 50 — обычные условия рынка. Ниже 30 торгов мало и движения
                    вялые, выше 70 рынок разогнан.
                  </p>
                  <p>
                    <span className="font-semibold text-foreground">Индекс страха и жадности</span> отвечает на
                    вопрос «что сейчас чувствует рынок». Он собирает волатильность, объём торгов, активность в
                    соцсетях и доминацию биткоина и сводит всё к числу от 0 до 100. Ниже 45 рынок живёт
                    осторожностью, и исторически такие периоды совпадали с локальными минимумами цены. Выше 55
                    начинается жадность: покупают охотнее, но растёт и риск перегрева. Источник —{' '}
                    <a href="https://alternative.me/crypto/fear-and-greed-index/" target="_blank" rel="noopener noreferrer nofollow" className="text-accent hover:underline">alternative.me</a>,
                    мы берём готовое число и подписываем, откуда оно.
                  </p>
                  <p>
                    <span className="font-semibold text-foreground">Индекс альткоин-сезона</span> показывает, куда
                    идут деньги. Он считает, какая доля из ста крупнейших монет обогнала биткоин за последние
                    тридцать дней. Ниже 25 капитал сидит в биткоине, выше 75 расходится по альткоинам. В карточке
                    видно и то, какие монеты идут впереди и насколько.
                  </p>
                </div>

                <h2 className="mb-3 mt-8 text-lg font-bold text-foreground">Как читать три числа вместе</h2>
                <div className="space-y-4 text-sm leading-relaxed text-muted">
                  <p>
                    По отдельности каждое из них однобоко. Страх и жадность меряет только настроение и ничего не
                    знает об объёмах: рынок может быть в эйфории при мёртвых торгах. Альткоин-сезон меряет только
                    ротацию и не отличает роста от падения — монеты обгоняют биткоин и когда падают медленнее него.
                    Пульс добавляет к настроению оборот и размах движения, поэтому расхождение между ним и страхом с
                    жадностью само по себе читается: настроение жадное, а Пульс ниже пятидесяти — значит, покупать
                    хотят, но денег в рынке мало.
                  </p>
                  <p>
                    Ни одно из этих чисел не является торговым сигналом. Они говорят, в каком состоянии рынок, и на
                    этом останавливаются. Решение остаётся за вами, и ни один индекс не заменяет собственного анализа.
                  </p>
                </div>

                <h2 className="mb-3 mt-8 text-lg font-bold text-foreground">Калькуляторы</h2>
                <div className="space-y-4 text-sm leading-relaxed text-muted">
                  <p>
                    <span className="font-semibold text-foreground">Конвертер</span> переводит сумму в любой из
                    двадцати основных валют в биткоин и другие крупные криптовалюты по актуальному курсу. Работает и
                    крипта в крипту. Удобен, когда нужно быстро прикинуть размер покупки или продажи, не открывая
                    биржу.
                  </p>
                  <p>
                    <span className="font-semibold text-foreground">Состояние миллиардеров</span> — живой счётчик
                    пятёрки богатейших людей по версии Forbes с переводом состояния в биткоины и расчётом, сколько
                    лет копить лично вам при вашем доходе и норме сбережений.
                  </p>
                </div>

                <h2 className="mb-3 mt-8 text-lg font-bold text-foreground">Справочники</h2>
                <div className="space-y-4 text-sm leading-relaxed text-muted">
                  <p>
                    Три блока внизу страницы — не показатели, а то, за чем приходят один раз и с конкретным
                    вопросом. <span className="font-semibold text-foreground">Карта регулирования</span> держит
                    статус криптовалют по странам: где разрешено, где с ограничениями, где запрещено, с датой
                    последней проверки. <span className="font-semibold text-foreground">Криптокалендарь</span>{' '}
                    показывает ближайшие события: разлоки токенов, хардфорки, листинги, конференции и даты
                    публикации макроэкономической статистики.{' '}
                    <span className="font-semibold text-foreground">Криптоактивы</span> — страницы монет с ценой,
                    объёмом, годовым графиком и разбором: что это за проект, кто за ним стоит и чем он отличается от
                    соседей.
                  </p>
                </div>

                <h2 className="mb-3 mt-8 text-lg font-bold text-foreground">Как часто всё это обновляется</h2>
                <div className="space-y-4 text-sm leading-relaxed text-muted">
                  <p>
                    Пульс считается раз в сутки автоматическим заданием, индекс страха и жадности и индекс
                    альткоин-сезона — несколько раз в день, курсы в конвертере и цены монет — непрерывно. Карту
                    регулирования редакция обновляет вручную, и дата последней проверки стоит прямо на виджете. Все
                    инструменты бесплатны и работают без регистрации.
                  </p>
                </div>
              </>
            ) : (
              <>
                <h2 className="mb-3 text-lg font-bold text-foreground">What each reading shows</h2>
                <div className="space-y-4 text-sm leading-relaxed text-muted">
                  <p>
                    You can work through dozens of charts to find out what the market is doing this morning. Three
                    numbers answer it faster, from three different sides, and each one opens on its own page with
                    history and a write-up.
                  </p>
                  <p>
                    <span className="font-semibold text-foreground">Market Pulse</span> we calculate ourselves; the
                    other two we borrow. It takes four figures: Bitcoin turnover against its yearly norm with a
                    weekday correction, the price move over 24 hours, the range of that move, and the external fear
                    and greed reading. The scale runs 0 to 100, where 50 is ordinary market conditions. Below 30
                    trading is thin and moves are weak; above 70 the market runs hot.
                  </p>
                  <p>
                    <span className="font-semibold text-foreground">The Fear and Greed Index</span> answers how the
                    market feels. It pulls volatility, trading volume, social activity and Bitcoin dominance into one
                    number from 0 to 100. Below 45 the market runs on caution, and past stretches in that range have
                    lined up with local price bottoms. Above 55 greed takes over: buying gets easier, and so does
                    overheating.{' '}
                    <a href="https://alternative.me/crypto/fear-and-greed-index/" target="_blank" rel="noopener noreferrer nofollow" className="text-accent hover:underline">alternative.me</a>{' '}
                    calculates it, we take the number and name the source.
                  </p>
                  <p>
                    <span className="font-semibold text-foreground">The Altcoin Season Index</span> counts what share
                    of the hundred largest coins have beaten Bitcoin over the past 30 days. Below 25 capital sits in
                    Bitcoin; above 75 it has spread into altcoins. The card also shows which coins are running ahead
                    and by how much.
                  </p>
                </div>

                <h2 className="mb-3 mt-8 text-lg font-bold text-foreground">Reading all three together</h2>
                <div className="space-y-4 text-sm leading-relaxed text-muted">
                  <p>
                    On its own each reading is one-sided. Fear and greed measures mood and knows nothing about
                    volume, so the market can be euphoric on dead trading. Altcoin season measures rotation and
                    cannot tell a rise from a fall, since a coin beats Bitcoin by dropping more slowly too. Pulse
                    adds turnover and the daily range to the mood, so when it disagrees with fear and greed the
                    disagreement reads: a greedy mood with Pulse under fifty means buyers are willing and money is
                    thin.
                  </p>
                  <p>
                    None of these numbers is a trading signal. They describe the state of the market, and what you do
                    about it is your call.
                  </p>
                </div>

                <h2 className="mb-3 mt-8 text-lg font-bold text-foreground">The calculators</h2>
                <div className="space-y-4 text-sm leading-relaxed text-muted">
                  <p>
                    <span className="font-semibold text-foreground">The converter</span> turns an amount in any of
                    twenty major currencies into Bitcoin and other large cryptocurrencies at the current rate. Crypto
                    to crypto works as well.
                  </p>
                  <p>
                    <span className="font-semibold text-foreground">Billionaire wealth</span> is a live counter for
                    the five largest fortunes on the Forbes 400, with the amount converted into bitcoin and the
                    saving horizon calculated from your own income and savings rate.
                  </p>
                </div>

                <h2 className="mb-3 mt-8 text-lg font-bold text-foreground">Reference</h2>
                <div className="space-y-4 text-sm leading-relaxed text-muted">
                  <p>The three blocks at the foot of the page hold answers you look up once.</p>
                  <p>
                    <span className="font-semibold text-foreground">The regulation map</span> carries the status of
                    crypto per country, with the date of the last check.
                  </p>
                  <p>
                    <span className="font-semibold text-foreground">The crypto calendar</span> shows what is coming:
                    token unlocks, forks, listings, conferences and the dates macro figures are published.
                  </p>
                  <p>
                    <span className="font-semibold text-foreground">Crypto assets</span> are pages for individual
                    coins with price, volume, a year of history and a write-up on what the project is and who stands
                    behind it.
                  </p>
                </div>

                <h2 className="mb-3 mt-8 text-lg font-bold text-foreground">How often this updates</h2>
                <div className="space-y-4 text-sm leading-relaxed text-muted">
                  <p>
                    A scheduled job computes Pulse once a day. Fear and greed and the altcoin index refresh several
                    times a day; converter rates and coin prices change with the market. The editors update the
                    regulation map by hand, and the date of the last check sits on the widget itself. Every tool is
                    free and needs no account.
                  </p>
                </div>
              </>
            )}
          </section>

          <section className="mb-10 max-w-[68ch]">
            <h2 className="mb-4 text-lg font-bold text-foreground">
              {isRu ? 'Частые вопросы' : 'Frequently asked questions'}
            </h2>
            <div className="flex flex-col gap-2">
              {faq.map((f) => (
                <details key={f.q} className="group rounded-lg border border-border bg-card px-4 py-3 open:border-accent/40">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-3 text-sm font-semibold text-foreground">
                    {f.q}
                    <span className="mt-0.5 shrink-0 text-xs text-muted transition-transform group-open:rotate-180">▾</span>
                  </summary>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{f.a}</p>
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
