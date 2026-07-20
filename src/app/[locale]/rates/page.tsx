export const revalidate = 120;

import type { Metadata } from 'next';
import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft } from 'lucide-react';
import { buildOg, BASE } from '@/lib/metadata';
import { fetchEurRates } from '@/lib/eurRates';
import EurCalculator from '@/components/ui/EurCalculator';
import EurRatesTable from '@/components/ui/EurRatesTable';
import PopularSidebar from '@/components/ui/PopularSidebar';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const isRu = locale === 'ru';
  const title = isRu
    ? 'Курс USDT и USDC к евро — сравнение P2P и бирж — CryptoPulse.media'
    : 'USDT & USDC to EUR rate — P2P and exchange comparison — CryptoPulse.media';
  const description = isRu
    ? 'Сравниваем курс обмена USDT и USDC на евро в реальном времени — Binance P2P, OKX P2P, Bitstamp, Kraken, Coinbase. Находите выгодный курс до сделки.'
    : 'Compare live USDT and USDC to EUR rates — Binance P2P, OKX P2P, Bitstamp, Kraken, Coinbase. Find the best rate before you trade.';

  return {
    title,
    description,
    openGraph: buildOg({ url: `${BASE}/${locale}/rates`, title, description, locale }),
    alternates: {
      canonical: `${BASE}/${locale}/rates`,
      languages: { ru: `${BASE}/ru/rates`, en: `${BASE}/en/rates` },
    },
  };
}

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
  const faq = isRu ? FAQ_RU : FAQ_EN;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: isRu ? 'Курс USDT и USDC к евро' : 'USDT & USDC to EUR rate',
    url: `${BASE}/${locale}/rates`,
    publisher: { '@type': 'Organization', name: 'CryptoPulse.media' },
  };
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
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

      {/* Hero — short and full-width, not squeezed beside the calculator */}
      <p className="text-xs font-bold uppercase tracking-widest text-accent mb-2">
        {isRu ? 'Обновляется каждые пару минут' : 'Updated every couple of minutes'}
      </p>
      <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight text-balance mb-3">
        {isRu ? 'Курс USDT и USDC к евро' : 'USDT & USDC to EUR rate'}
      </h1>
      <p className="text-muted text-sm leading-relaxed max-w-xl mb-8">
        {isRu
          ? 'Сравниваем реальные курсы P2P и бирж, чтобы вы находили выгодный курс до сделки, а не после.'
          : 'Comparing live P2P and exchange rates so you find the best deal before you trade, not after.'}
      </p>

      {/* Calculator — full width, matching the table below it */}
      <div className="mb-3">
        <EurCalculator rates={rates} locale={locale} />
      </div>
      <p className="text-xs text-muted mb-10">
        {isRu ? 'Курс подтягивается из таблицы ниже — при смене актива результат обновится сразу.' : 'The rate is pulled straight from the table below — it updates as soon as you change the asset.'}
      </p>

      {/* Table */}
      <section className="mb-10">
        <h2 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4">
          {isRu ? 'Курсы сейчас' : 'Current rates'}
        </h2>
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

      {/* Safety tips */}
      <section className="mb-10">
        <h2 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4">
          {isRu ? 'Как торговать безопаснее' : 'How to trade more safely'}
        </h2>
        <div className="flex flex-col gap-2">
          {(isRu
            ? [
                'Используйте только площадки со встроенным эскроу — крипта продавца блокируется до вашего подтверждения оплаты.',
                'Проверяйте рейтинг и количество завершённых сделок продавца перед первой сделкой.',
                'Никогда не переводите деньги и не подтверждайте оплату вне встроенного чата платформы.',
              ]
            : [
                'Only use platforms with built-in escrow — the seller’s crypto is locked until you confirm payment.',
                'Check the seller’s rating and completed trade count before your first deal.',
                'Never send money or confirm payment outside the platform’s own chat.',
              ]
          ).map((tip, i) => (
            <div key={i} className="flex items-start gap-3 text-sm text-muted leading-relaxed">
              <span className="font-mono text-xs font-bold text-accent shrink-0 mt-0.5">0{i + 1}</span>
              {tip}
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

      <div className="border border-border rounded-lg px-4 py-3 bg-card">
        <p className="text-xs text-muted leading-relaxed">
          <span className="font-semibold text-foreground">{isRu ? 'Важно: ' : 'Note: '}</span>
          {isRu
            ? 'Курсы носят справочный характер и могут отличаться в момент сделки. CryptoPulse.media не является стороной обмена, не хранит средства пользователей и не несёт ответственности за операции на сторонних площадках.'
            : 'Rates are for reference only and may differ at the time of your trade. CryptoPulse.media is not a party to any exchange, does not hold user funds, and is not responsible for transactions on third-party platforms.'}
        </p>
      </div>

      </div>
      <PopularSidebar locale={locale} />
      </div>
    </div>
  );
}
