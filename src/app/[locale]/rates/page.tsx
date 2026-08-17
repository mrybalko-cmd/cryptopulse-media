export const revalidate = 120;

import type { Metadata } from 'next';
import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { Lock, MessageCircle, Star } from 'lucide-react';
import { buildOg, buildTwitter, BASE } from '@/lib/metadata';
import { fetchEurRates } from '@/lib/eurRates';
import { formatTimestamp, toIso } from '@/lib/formatTimestamp';
import { ORGANIZATION_ID } from '@/lib/organizationSchema';
import EurCalculator from '@/components/ui/EurCalculator';
import EurRatesTable from '@/components/ui/EurRatesTable';
import PopularSidebar from '@/components/ui/PopularSidebar';
import { SITE_NAME } from '@/lib/site';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const isRu = locale === 'ru';
  const title = isRu
    ? 'Курс USDT и USDC к евро: P2P и биржи'
    : 'USDT and USDC to EUR: P2P and exchanges';
  const description = isRu
    ? 'Сравниваем курс обмена USDT и USDC на евро в реальном времени — Binance P2P, OKX P2P, Bitstamp, Kraken, Coinbase. Находите выгодный курс до сделки.'
    : 'Compare live USDT and USDC to EUR rates — Binance P2P, OKX P2P, Bitstamp, Kraken, Coinbase. Find the best rate before you trade.';

  return {
    title,
    description,
    openGraph: buildOg({ url: `${BASE}/${locale}/rates`, title, description, locale }),
    twitter: buildTwitter({ url: `${BASE}/${locale}/rates`, title, description, locale }),
    alternates: {
      canonical: `${BASE}/${locale}/rates`,
      languages: { ru: `${BASE}/ru/rates`, en: `${BASE}/en/rates`, 'x-default': `${BASE}/en/rates` },
    },
  };
}

const SAFETY_TIPS = [
  {
    key: 'escrow',
    icon: Lock,
    color: '#22c55e',
    title: { ru: 'Только эскроу', en: 'Escrow only' },
    text: {
      ru: 'Работайте на площадках, где крипта продавца блокируется до вашего подтверждения оплаты. Нет эскроу — нет сделки.',
      en: 'Use platforms that lock the seller’s crypto until you confirm payment — no escrow, no deal.',
    },
  },
  {
    key: 'seller',
    icon: Star,
    color: '#f59e0b',
    title: { ru: 'Проверьте продавца', en: 'Read the seller' },
    text: {
      ru: 'Посмотрите рейтинг и число закрытых сделок до первой сделки именно с этим контрагентом.',
      en: 'Check the rating and how many trades they have closed before your first deal with them.',
    },
  },
  {
    key: 'chat',
    icon: MessageCircle,
    color: '#06b6d4',
    title: { ru: 'Не выходите из чата', en: 'Stay in the chat' },
    text: {
      ru: 'Оплата и подтверждение — только во встроенном чате площадки: это единственная запись, которую примет арбитраж.',
      en: 'Keep payment and confirmation inside the platform’s own chat — that is the only record a dispute accepts.',
    },
  },
];

const FAQ_RU = [
  { q: 'Как часто обновляются курсы?', a: 'Автоматически, каждые пару минут в течение торгового дня — данные берутся напрямую из публичных API Binance P2P, OKX P2P, Bitstamp, Kraken и Coinbase Exchange.' },
  { q: 'Это официальный курс евро?', a: 'Нет — это агрегированные рыночные котировки в конкретный момент, а не индикативный курс Европейского центробанка. Для официального курса ЕЦБ используйте сайт ecb.europa.eu.' },
  { q: 'USDT или USDC — есть ли разница?', a: 'Оба стейблкоина привязаны к доллару 1:1. Разница — в эмитенте (Tether и Circle соответственно) и подходе к резервам и аудиту. В ЕС по регламенту MiCA у USDC исторически меньше ограничений на биржах, чем у USDT — на некоторых площадках USDT для розничных клиентов из ЕС временно ограничивали.' },
  { q: 'Безопасно ли обменивать через P2P?', a: 'Да, если использовать площадку со встроенным эскроу (крипта продавца блокируется до подтверждения оплаты) и проверять рейтинг/количество сделок контрагента. Никогда не переводите деньги и не подтверждайте оплату вне чата платформы.' },
  { q: 'Как быстро приходят деньги после P2P-сделки?', a: 'Обычно от нескольких минут до пары часов — зависит от способа оплаты и скорости подтверждения продавца. SEPA-переводы в среднем быстрее карточных.' },
  { q: 'Есть ли минимальная и максимальная сумма обмена?', a: 'Да, у каждого объявления P2P и у каждой биржи — свои лимиты. На бирже лимиты обычно шире, чем в отдельном P2P-объявлении; при крупной сумме может понадобиться несколько сделок.' },
  { q: 'Нужна ли верификация (KYC) для обмена?', a: 'Да, все источники на этой странице требуют пройти верификацию личности перед торговлей — это стандартное регуляторное требование.' },
  { q: 'Курс учитывает комиссию за вывод на банковскую карту или счёт?', a: 'Нет — в таблице показана только комиссия конкретной сделки. Вывод EUR с P2P обычно происходит напрямую на счёт продавца без отдельной комиссии платформы; вывод с биржи на карту/IBAN может тарифицироваться отдельно — уточняйте у конкретной площадки.' },
  { q: 'Облагается ли обмен крипты на евро налогом?', a: 'В большинстве юрисдикций ЕС — да, но правила сильно различаются по стране. Мы не даём налоговых консультаций — обратитесь к местному налоговому специалисту для точного ответа по вашей стране.' },
];

const FAQ_EN = [
  { q: 'How often are rates updated?', a: 'Automatically, every couple of minutes during trading hours — data comes straight from the public APIs of Binance P2P, OKX P2P, Bitstamp, Kraken, and Coinbase Exchange.' },
  { q: 'Is this the official EUR exchange rate?', a: 'No — these are aggregated market quotes at a given moment, not the European Central Bank’s indicative rate. For the official ECB rate, see ecb.europa.eu.' },
  { q: 'USDT vs USDC — is there a difference?', a: 'Both are pegged 1:1 to the dollar. The difference is the issuer (Tether vs. Circle) and their approach to reserves and audits. Under the EU’s MiCA rules, USDC has historically faced fewer restrictions on exchanges than USDT, which some platforms temporarily limited for EU retail users.' },
  { q: 'Is P2P trading safe?', a: 'Yes, if you use a platform with built-in escrow (the seller’s crypto is locked until you confirm payment) and check the counterparty’s rating and trade count. Never send money or confirm payment outside the platform’s own chat.' },
  { q: 'How fast does the money arrive after a P2P trade?', a: 'Usually a few minutes to a couple of hours, depending on the payment method and how quickly the seller confirms. SEPA transfers tend to be faster than card payments.' },
  { q: 'Is there a minimum or maximum exchange amount?', a: 'Yes — each P2P ad and each exchange has its own limits. Exchange limits are usually wider than a single P2P ad; large amounts may need to be split across a few trades.' },
  { q: 'Do I need to verify my identity (KYC)?', a: 'Yes — every source on this page requires identity verification before trading, a standard regulatory requirement.' },
  { q: 'Does the rate include the fee for withdrawing to a bank card or account?', a: 'No — the table shows only the trade fee itself. P2P EUR payouts usually go straight to the seller’s account with no extra platform fee; withdrawing from an exchange to a card/IBAN may carry its own fee — check with the specific platform.' },
  { q: 'Is exchanging crypto for euros taxed?', a: 'In most EU jurisdictions, yes — but rules vary significantly by country. We don’t provide tax advice — consult a local tax professional for guidance specific to your country.' },
];

export default async function RatesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isRu = locale === 'ru';

  const rates = await fetchEurRates();
  // Quotes are pulled live from the venues' public APIs on every render, and
  // the page revalidates every 120s, so the moment of this fetch IS the age of
  // the data. Previously the page claimed to update "every couple of minutes"
  // while emitting no date at all, which left crawlers to guess one.
  const fetchedAt = new Date();
  const fetchedStamp = formatTimestamp(fetchedAt);
  const faq = isRu ? FAQ_RU : FAQ_EN;
  const loc = (isRu ? 'ru' : 'en') as 'ru' | 'en';

  // Numbers for the summary strip: the best quote, who offers it, and how far
  // the worst venue sits from it — the spread is the reason to compare at all.
  const bestRate = rates.length ? Math.max(...rates.map((r) => r.rate)) : 0;
  const worstRate = rates.length ? Math.min(...rates.map((r) => r.rate)) : 0;
  const bestSource = rates.find((r) => r.rate === bestRate)?.source ?? '';
  const spreadPct = worstRate ? (((bestRate - worstRate) / worstRate) * 100).toFixed(1) : '0.0';

  /* Was a lone WebPage. The page is a comparison of venues, so it now also
     declares breadcrumbs and an ItemList — each entry pointing at our own
     review page for that exchange rather than only off-site. */
  const pageUrl = `${BASE}/${locale}/rates`;
  const listedVenues = rates.filter(
    (r, i, all) => all.findIndex((x) => x.source === r.source) === i
  );

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: isRu ? 'Курс USDT и USDC к евро' : 'USDT & USDC to EUR rate',
        url: pageUrl,
        publisher: { '@id': ORGANIZATION_ID },
        dateModified: toIso(fetchedAt),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: isRu ? 'Главная' : 'Home', item: `${BASE}/${locale}` },
          { '@type': 'ListItem', position: 2, name: isRu ? 'Курсы' : 'Rates', item: pageUrl },
        ],
      },
      {
        '@type': 'ItemList',
        name: isRu ? 'Площадки для обмена USDT и USDC на евро' : 'Venues for selling USDT and USDC to euro',
        numberOfItems: listedVenues.length,
        itemListElement: listedVenues.map((r, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: r.source,
          url: r.exchangeSlug ? `${BASE}/${locale}/exchanges/${r.exchangeSlug}` : r.url,
        })),
      },
    ],
  };
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };

  return (
    <div className="max-w-[1320px] mx-auto px-4 sm:px-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_256px] gap-6 lg:gap-8">
      <div>

      {/* Summary strip — the answer before the table: what the best rate is,
          how far apart the venues sit, and how fresh the numbers are. */}
      {rates.length > 0 && (
        <div className="flex items-stretch overflow-x-auto scrollbar-none border-y border-border -mx-4 sm:mx-0 mb-6">
          <span className="flex items-baseline gap-2 px-4 sm:px-5 py-2.5 border-r border-border whitespace-nowrap">
            <span className="text-[9.5px] font-bold uppercase tracking-wider text-muted">
              {isRu ? 'Лучший курс' : 'Best rate'}
            </span>
            <span className="text-[13px] font-extrabold text-foreground tabular-nums">€{bestRate.toFixed(4)}</span>
            <span className="text-[11px] font-bold text-positive">{bestSource}</span>
          </span>
          <span className="flex items-baseline gap-2 px-4 sm:px-5 py-2.5 border-r border-border whitespace-nowrap">
            <span className="text-[9.5px] font-bold uppercase tracking-wider text-muted">
              {isRu ? 'Разброс' : 'Spread'}
            </span>
            <span className="text-[13px] font-extrabold text-foreground tabular-nums">{spreadPct}%</span>
          </span>
          <span className="flex items-baseline gap-2 px-4 sm:px-5 py-2.5 border-r border-border whitespace-nowrap">
            <span className="text-[9.5px] font-bold uppercase tracking-wider text-muted">
              {isRu ? 'Источников' : 'Sources'}
            </span>
            <span className="text-[13px] font-extrabold text-foreground tabular-nums">{rates.length}</span>
          </span>
          <span className="flex items-center px-4 sm:px-5 py-2.5 whitespace-nowrap">
            <span className="text-[10px] text-muted">
              {isRu ? 'обновлено ' : 'updated '}
              <time dateTime={toIso(fetchedAt) ?? undefined} className="tabular-nums">
                {fetchedStamp?.full}
              </time>
            </span>
          </span>
        </div>
      )}

      <nav className="flex items-center gap-1.5 text-xs text-muted mb-4">
        <Link href={`/${locale}`} className="hover:text-accent transition-colors">{isRu ? 'Главная' : 'Home'}</Link>
        <span>›</span>
        <span className="text-foreground">{isRu ? 'Курсы' : 'Rates'}</span>
      </nav>

      <h1 className="text-3xl sm:text-[38px] font-extrabold text-foreground leading-[1.08] tracking-tight mb-3 text-balance">
        {isRu ? (
          <>Продайте стейблкоины по <span className="text-accent">лучшему курсу</span></>
        ) : (
          <>Sell your stablecoins at the <span className="text-accent">best rate today</span></>
        )}
      </h1>
      <p className="text-muted text-sm leading-relaxed max-w-2xl mb-7">
        {isRu
          ? 'Курсы P2P и бирж для USDT и USDC к евро рядом друг с другом — чтобы найти выгодный вариант до сделки, а не после.'
          : 'Live P2P and exchange quotes for USDT and USDC to euro, side by side — so you find the better deal before the trade, not after.'}
      </p>

      <div className="flex items-baseline justify-between gap-3 mb-3">
        <h2 className="text-[12.5px] font-extrabold uppercase tracking-wider text-foreground">
          {isRu ? 'Конвертер' : 'Convert'}
        </h2>
        <span className="text-[11px] text-muted">
          {isRu ? 'курс из таблицы ниже' : 'rate from the table below'}
        </span>
      </div>
      <div className="mb-10">
        <EurCalculator rates={rates} locale={locale} />
      </div>

      {/* Table */}
      <section className="mb-10">
        <div className="flex items-baseline justify-between gap-3 mb-3">
          <h2 className="text-[12.5px] font-extrabold uppercase tracking-wider text-foreground">
            {isRu ? 'Курсы сейчас' : 'Current rates'}
          </h2>
          <span className="text-[11px] text-muted">
            {isRu ? 'обновлено ' : 'updated '}
            <time dateTime={toIso(fetchedAt) ?? undefined} className="tabular-nums">
              {fetchedStamp?.full}
            </time>
          </span>
        </div>
        {rates.length > 0 ? (
          <EurRatesTable rates={rates} locale={locale} />
        ) : (
          <p className="text-sm text-muted">{isRu ? 'Курсы временно недоступны, попробуйте обновить страницу.' : 'Rates are temporarily unavailable, try refreshing.'}</p>
        )}
        <p className="text-xs text-muted mt-3">
          {isRu
            ? 'Курсы указаны для условной суммы 1000 USDT/USDC, при других объёмах могут отличаться. Источники: Binance P2P, OKX P2P, Bitstamp, Kraken, Coinbase Exchange.'
            : 'Rates shown for a reference amount of 1000 USDT/USDC — may differ at other volumes. Sources: Binance P2P, OKX P2P, Bitstamp, Kraken, Coinbase Exchange.'}
        </p>
      </section>

      {/* Why rates differ */}
      <section className="mb-10">
        <h2 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4">
          {isRu ? 'Почему курс отличается на разных платформах' : 'Why the rate differs across platforms'}
        </h2>
        <div className="text-sm text-muted leading-relaxed space-y-3">
          {isRu ? (
            <>
              <p><b className="text-foreground">P2P-курсы</b> выставляют сами продавцы — цена зависит от спроса в моменте, способа оплаты и репутации продавца, поэтому на P2P часто можно найти курс выгоднее рыночного.</p>
              <p><b className="text-foreground">Спотовые курсы бирж</b> ближе к «настоящему» рыночному курсу, но добавляется торговая комиссия платформы.</p>
              <p>Разница между источниками редко превышает 2–3%, но на крупной сумме это уже заметные деньги — поэтому сравнение того стоит.</p>
            </>
          ) : (
            <>
              <p><b className="text-foreground">P2P rates</b> are set by individual sellers — price depends on real-time demand, payment method, and the seller’s reputation, so P2P often beats the market rate.</p>
              <p><b className="text-foreground">Exchange spot rates</b> track the “real” market price more closely, but the platform’s trading fee gets added on top.</p>
              <p>The spread between sources rarely exceeds 2–3%, but on a large amount that’s real money — which is exactly why comparing pays off.</p>
            </>
          )}
        </div>
      </section>

      {/* Safety tips — icons and two-word titles instead of 01/02/03: these are
          three equal rules, not steps, so numbering added nothing. */}
      <section className="mb-10">
        <h2 className="text-[12.5px] font-extrabold uppercase tracking-wider text-foreground mb-3">
          {isRu ? 'Как торговать безопаснее' : 'How to trade more safely'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {SAFETY_TIPS.map((tip) => {
            const Icon = tip.icon;
            return (
              <div
                key={tip.key}
                className="relative overflow-hidden rounded-2xl border border-[var(--popular-glass-line)] bg-[var(--popular-glass)] shadow-[inset_0_1px_0_var(--popular-glass-line),var(--popular-shadow)] p-4"
              >
                <span
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: `${tip.color}29`, color: tip.color, border: `1px solid ${tip.color}4d` }}
                >
                  <Icon size={18} />
                </span>
                <h3 className="text-[13.5px] font-extrabold text-foreground -tracking-[0.01em] mt-3">{tip.title[loc]}</h3>
                <p className="text-[11.5px] text-muted leading-relaxed mt-1.5">{tip.text[loc]}</p>
              </div>
            );
          })}
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

      <div className="border border-border rounded-lg px-4 py-3 bg-card">
        <p className="text-xs text-muted leading-relaxed">
          <span className="font-semibold text-foreground">{isRu ? 'Важно: ' : 'Note: '}</span>
          {isRu
            ? 'Курсы носят справочный характер и могут отличаться в момент сделки. ${SITE_NAME} не является стороной обмена, не хранит средства пользователей и не несёт ответственности за операции на сторонних площадках.'
            : 'Rates are for reference only and may differ at the time of your trade. ${SITE_NAME} is not a party to any exchange, does not hold user funds, and is not responsible for transactions on third-party platforms.'}
        </p>
      </div>

      </div>
      <PopularSidebar locale={locale} />
      </div>
    </div>
  );
}
