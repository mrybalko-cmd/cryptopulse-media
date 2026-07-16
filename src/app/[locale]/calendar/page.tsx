import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { buildOg, BASE } from '@/lib/metadata';
import { fetchCalendarEvents } from '@/lib/sanity';
import CalendarFilter from '@/components/ui/CalendarFilter';
import PopularSidebar from '@/components/ui/PopularSidebar';

const CALENDAR_FAQ = [
  {
    slug: 'data-source',
    question: {
      ru: 'Откуда берутся данные о событиях в календаре?',
      en: "Where does the calendar's event data come from?",
    },
    answer: {
      ru: 'Редакция CryptoPulse.media вручную отслеживает официальные анонсы проектов, бирж и регуляторов и добавляет проверенные события с указанием источника.',
      en: "CryptoPulse.media's editors manually track official announcements from projects, exchanges, and regulators, and add verified events with a source link.",
    },
  },
  {
    slug: 'importance-level',
    question: {
      ru: 'Что означает уровень важности события?',
      en: "What does an event's importance level mean?",
    },
    answer: {
      ru: 'Это ориентировочная оценка потенциального влияния на рынок: высокий уровень — событие способно заметно сдвинуть цену конкретного актива или рынок в целом; низкий — событие скорее информационное.',
      en: 'It\'s a rough estimate of potential market impact: high means the event could meaningfully move the price of a specific asset or the market as a whole; low means it\'s more informational.',
    },
  },
  {
    slug: 'add-to-calendar',
    question: {
      ru: 'Можно ли добавить событие себе в календарь?',
      en: 'Can I add an event to my own calendar?',
    },
    answer: {
      ru: 'Да, у каждого события есть кнопка добавления в Google Calendar — вы получите напоминание в удобное время.',
      en: 'Yes — every event has a button to add it to Google Calendar, so you get a reminder at a convenient time.',
    },
  },
  {
    slug: 'update-frequency',
    question: {
      ru: 'Как часто обновляется календарь?',
      en: 'How often is the calendar updated?',
    },
    answer: {
      ru: 'Список пополняется по мере появления новых подтверждённых дат — часто это происходит за недели или месяцы до самого события.',
      en: "New confirmed dates are added as they're announced — often weeks or months ahead of the actual event.",
    },
  },
  {
    slug: 'unlock-impact',
    question: {
      ru: 'Разлок токенов — это всегда плохо для цены?',
      en: 'Is a token unlock always bad for price?',
    },
    answer: {
      ru: 'Не обязательно. Если рынок ожидал разлок и заранее заложил его в цену, влияние может быть минимальным. Важен не сам факт разлока, а его размер относительно объёмов торгов и текущего спроса.',
      en: "Not necessarily. If the market already expected the unlock and priced it in ahead of time, the impact can be minimal. What matters isn't the unlock itself, but its size relative to trading volume and current demand.",
    },
  },
];

const CALENDAR_GLOSSARY_LINKS = [
  { slug: 'market-cap', label: { ru: 'Капитализация рынка', en: 'Market cap' } },
  { slug: 'ico', label: { ru: 'ICO', en: 'ICO' } },
  { slug: 'halving', label: { ru: 'Халвинг', en: 'Halving' } },
  { slug: 'airdrop', label: { ru: 'Airdrop', en: 'Airdrop' } },
  { slug: 'staking', label: { ru: 'Стейкинг', en: 'Staking' } },
];

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const isRu = locale === 'ru';
  const title = isRu ? 'Криптокалендарь — важные события крипторынка' : 'Crypto Calendar — Key Market Events';
  const description = isRu
    ? 'Анлоки токенов, токенсейлы, листинги, отчётность и другие важные события крипторынка — с уровнем важности и датами.'
    : 'Token unlocks, token sales, listings, macro reports, and other key crypto market events — with importance ratings and dates.';

  return {
    title,
    description,
    openGraph: buildOg({ url: `${BASE}/${locale}/calendar`, title, description, locale }),
    alternates: {
      canonical: `${BASE}/${locale}/calendar`,
      languages: { ru: `${BASE}/ru/calendar`, en: `${BASE}/en/calendar` },
    },
  };
}

export default async function CalendarPage({ params }: Props) {
  const { locale } = await params;
  const isRu = locale === 'ru';
  const loc = (isRu ? 'ru' : 'en') as 'ru' | 'en';
  const pageUrl = `${BASE}/${locale}/calendar`;

  const events = await fetchCalendarEvents();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ItemList',
        name: isRu ? 'Криптокалендарь CryptoPulse.media' : 'CryptoPulse.media Crypto Calendar',
        itemListElement: events.map((e, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          item: {
            '@type': 'Event',
            name: e.title[loc],
            description: e.description?.[loc] || e.title[loc],
            startDate: e.date,
            eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
            eventStatus: 'https://schema.org/EventScheduled',
            location: { '@type': 'VirtualLocation', url: e.sourceUrl || pageUrl },
            url: `${pageUrl}#${e.slug}`,
          },
        })),
      },
      {
        '@type': 'FAQPage',
        mainEntity: CALENDAR_FAQ.map(f => ({
          '@type': 'Question',
          name: f.question[loc],
          acceptedAnswer: { '@type': 'Answer', text: f.answer[loc] },
        })),
      },
    ],
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_256px] gap-6 lg:gap-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            {isRu ? 'Криптокалендарь' : 'Crypto Calendar'}
          </h1>
          <p className="text-muted text-sm mb-8 leading-relaxed">
            {isRu
              ? 'Анлоки токенов, токенсейлы, листинги, макроотчёты и другие важные события крипторынка — с уровнем важности, лайками и возможностью добавить в свой Google Calendar.'
              : 'Token unlocks, token sales, listings, macro reports, and other key crypto market events — with an importance rating, likes, and the option to add them to your Google Calendar.'}
          </p>

          <CalendarFilter events={events} locale={locale} pageUrl={pageUrl} />

          {/* SEO copy block — approved by user 16.07.2026. Explains what the
              calendar is and why each event category matters, with real
              internal links to existing glossary terms rather than inventing
              new ones. FAQ uses the same <details>/<summary> pattern as
              /faq for a familiar expand-on-click interaction. */}
          <section className="mt-14 pt-10 border-t border-border">
            <h2 className="text-xl font-bold text-foreground mb-4">
              {isRu ? 'Что такое криптокалендарь и зачем он нужен' : 'What a Crypto Calendar Is and Why It Matters'}
            </h2>
            <div className="text-sm text-muted leading-relaxed flex flex-col gap-4 max-w-3xl">
              <p>
                {isRu
                  ? 'Криптокалендарь — это хронология событий, которые реально двигают цену и объёмы торгов на крипторынке: разлоки токенов (unlock), токенсейлы, листинги на биржах, обновления и хардфорки протоколов, отраслевые конференции, решения регуляторов и корпоративная отчётность компаний, связанных с криптоиндустрией. В отличие от новостной ленты, которая рассказывает о том, что уже произошло, календарь показывает, что произойдёт — и позволяет подготовиться заранее, а не реагировать постфактум.'
                  : "A crypto calendar is a timeline of events that actually move price and trading volume in the crypto market: token unlocks, token sales, exchange listings, protocol upgrades and forks, industry conferences, regulatory decisions, and earnings reports from companies tied to the crypto industry. Unlike a news feed, which tells you what already happened, a calendar shows you what's coming — so you can prepare ahead of time instead of reacting after the fact."}
              </p>
              <p>
                {isRu
                  ? 'Для трейдера или инвестора это разница между «увидеть падение цены на 15%» и «знать за неделю, что впереди разлок токенов на десятки миллионов долларов, который эту цену обрушит». Каждое событие в календаре получает уровень важности (низкая / средняя / высокая) — по сути, ориентир, насколько сильно оно способно повлиять на рынок конкретного актива или на рынок в целом.'
                  : "For a trader or investor, that's the difference between watching a price drop 15% and knowing a week in advance that a multi-million-dollar token unlock is about to hit the market. Every event on the calendar carries an importance rating (low / medium / high) — a rough guide to how much it could move the price of a specific asset, or the market as a whole."}
              </p>
            </div>

            <h3 className="text-base font-bold text-foreground mt-8 mb-4">
              {isRu ? 'Почему разные типы событий важны именно для тех, кто следит за рынком' : 'Why Each Type of Event Matters to Market Watchers'}
            </h3>
            <div className="text-sm text-muted leading-relaxed flex flex-col gap-4 max-w-3xl">
              {isRu ? (
                <>
                  <p><strong className="text-foreground">Разлоки токенов (unlock)</strong> — увеличение количества монет в свободном обращении. Ранние инвесторы и команда проекта получают доступ к ранее заблокированным токенам и нередко продают часть на рынке, что давит на цену. Чем крупнее разлок относительно текущей <Link href={`/${locale}/glossary/market-cap`} className="text-accent hover:underline">капитализации</Link> проекта — тем выше потенциальное влияние.</p>
                  <p><strong className="text-foreground">Токенсейлы</strong> — первичное привлечение средств новым проектом (см. <Link href={`/${locale}/glossary/ico`} className="text-accent hover:underline">ICO</Link>). Участие на ранней стадии исторически было одним из способов купить актив ниже биржевой цены, но несёт и повышенный риск.</p>
                  <p><strong className="text-foreground">Листинги на биржах</strong> — выход монеты на новую биржу почти всегда означает приток ликвидности и новую аудиторию трейдеров, что часто сопровождается ростом объёмов и волатильности в первые дни.</p>
                  <p><strong className="text-foreground">Хардфорки и обновления протокола</strong> — технические изменения в сети (смена алгоритма, апгрейд консенсуса) способны как повысить доверие к проекту, так и создать краткосрочную неопределённость, пока рынок оценивает последствия.</p>
                  <p><strong className="text-foreground">Регуляторные события</strong> — решения SEC, ЕС, других регуляторов создают одни из самых резких движений на рынке, потому что напрямую меняют правила игры для целых секторов индустрии.</p>
                  <p><strong className="text-foreground"><Link href={`/${locale}/glossary/halving`} className="text-accent hover:underline">Халвинг</Link></strong> — отдельная категория событий-ориентиров: запрограммированное сокращение эмиссии Bitcoin (и ряда других монет) раз в несколько лет, вокруг которого исторически строятся рыночные циклы.</p>
                  <p>Отдельно стоит следить за смежными механиками, которые часто привязаны к датам в календаре, — например, <Link href={`/${locale}/glossary/airdrop`} className="text-accent hover:underline">airdrop</Link> (бесплатная раздача токенов проектом) или <Link href={`/${locale}/glossary/staking`} className="text-accent hover:underline">стейкинг</Link> (блокировка монет ради вознаграждения): сроки таких программ нередко совпадают с другими рыночными событиями и усиливают их эффект.</p>
                </>
              ) : (
                <>
                  <p><strong className="text-foreground">Token unlocks</strong> — an increase in circulating supply. Early investors and project teams gain access to previously locked tokens and often sell part of them on the open market, which pressures the price. The bigger the unlock relative to a project&apos;s current <Link href={`/${locale}/glossary/market-cap`} className="text-accent hover:underline">market cap</Link>, the bigger the potential impact.</p>
                  <p><strong className="text-foreground">Token sales</strong> — a new project&apos;s initial fundraising round (see <Link href={`/${locale}/glossary/ico`} className="text-accent hover:underline">ICO</Link>). Getting in early has historically been one way to buy an asset below its eventual exchange price, but it also carries higher risk.</p>
                  <p><strong className="text-foreground">Exchange listings</strong> — a coin going live on a new exchange almost always brings fresh liquidity and a new pool of traders, which often shows up as a volume and volatility spike in the first few days.</p>
                  <p><strong className="text-foreground">Forks and protocol upgrades</strong> — technical changes to a network (a consensus upgrade, an algorithm change) can either boost confidence in a project or create short-term uncertainty while the market prices in the consequences.</p>
                  <p><strong className="text-foreground">Regulatory events</strong> — decisions from the SEC, the EU, and other regulators produce some of the sharpest moves in the market, because they directly change the rules for entire sectors of the industry.</p>
                  <p><strong className="text-foreground"><Link href={`/${locale}/glossary/halving`} className="text-accent hover:underline">Halving</Link></strong> — a landmark event type on its own: a programmed cut to Bitcoin&apos;s (and a few other coins&apos;) issuance every few years, around which entire market cycles have historically been built.</p>
                  <p>It&apos;s also worth watching adjacent mechanics that often line up with calendar dates — like an <Link href={`/${locale}/glossary/airdrop`} className="text-accent hover:underline">airdrop</Link> (a project giving away tokens for free) or <Link href={`/${locale}/glossary/staking`} className="text-accent hover:underline">staking</Link> (locking up coins in exchange for rewards): the timing of these programs frequently overlaps with other market events and amplifies their effect.</p>
                </>
              )}
            </div>

            {/* FAQ — same expand/collapse <details> pattern as /faq: click a
                question to open it, click again to close it. */}
            <h3 className="text-base font-bold text-foreground mt-8 mb-4">
              {isRu ? 'Частые вопросы о криптокалендаре' : 'Frequently Asked Questions About the Crypto Calendar'}
            </h3>
            <div className="space-y-2 max-w-3xl">
              {CALENDAR_FAQ.map(f => (
                <details
                  key={f.slug}
                  id={f.slug}
                  className="group bg-card border border-border rounded-lg px-4 py-3 open:border-accent/40 scroll-mt-24"
                >
                  <summary className="cursor-pointer list-none flex items-start justify-between gap-3 text-sm font-semibold text-foreground">
                    {f.question[loc]}
                    <span className="text-muted text-xs shrink-0 mt-0.5 group-open:rotate-180 transition-transform">▾</span>
                  </summary>
                  <p className="text-muted text-sm leading-relaxed mt-2">{f.answer[loc]}</p>
                </details>
              ))}
            </div>

            {/* Glossary interlinking */}
            <div className="bg-card border border-border rounded-xl p-5 mt-8 max-w-3xl">
              <h3 className="text-sm font-bold text-foreground mb-3">
                {isRu ? 'Изучите термины в глоссарии' : 'Learn the terms in our glossary'}
              </h3>
              <div className="flex flex-wrap gap-2">
                {CALENDAR_GLOSSARY_LINKS.map(t => (
                  <Link
                    key={t.slug}
                    href={`/${locale}/glossary/${t.slug}`}
                    className="text-xs px-3 py-1.5 rounded-full bg-background border border-border text-muted hover:text-accent hover:border-accent/40 transition-colors"
                  >
                    {t.label[loc]}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </div>

        <PopularSidebar locale={locale} />
      </div>
    </div>
  );
}
