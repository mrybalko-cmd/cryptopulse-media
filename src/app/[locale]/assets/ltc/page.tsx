import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { buildOg, BASE } from '@/lib/metadata';
import LtcCalculator from '@/components/ui/LtcCalculator';
import { LTC_QUOTES, LTC_FAQ } from '@/lib/ltcData';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const isRu = locale === 'ru';
  const title = isRu
    ? 'Litecoin (LTC) — История, цена и калькулятор инвестиций'
    : 'Litecoin (LTC) — History, Price & Investment Calculator';
  const description = isRu
    ? 'Полная история Litecoin: как Чарли Ли создал «серебро к биткоиновому золоту». SegWit, Lightning Network, MimbleWimble, халвинги и почему LTC считается «тест-сетью» для биткоина. Калькулятор инвестиций.'
    : 'Complete Litecoin history: how Charlie Lee created "silver to Bitcoin\'s gold." SegWit, Lightning Network, MimbleWimble, halvings and why LTC is considered Bitcoin\'s "testnet." Investment calculator.';
  return {
    title,
    description,
    keywords: isRu
      ? ['litecoin ltc история', 'charlie lee', 'litecoin mimblewimble', 'ltc халвинг', 'ltc калькулятор']
      : ['litecoin ltc history', 'charlie lee', 'litecoin mimblewimble', 'ltc halving', 'ltc investment calculator'],
    openGraph: buildOg({ url: `${BASE}/${locale}/assets/ltc`, title, description, locale }),
    alternates: {
      canonical: `${BASE}/${locale}/assets/ltc`,
      languages: {
        ru: `${BASE}/ru/assets/ltc`,
        en: `${BASE}/en/assets/ltc`,
      },
    },
  };
}

export default async function LtcPage({ params }: Props) {
  const { locale } = await params;
  const isRu = locale === 'ru';
  const loc = isRu ? 'ru' : 'en';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: isRu ? 'Litecoin (LTC): «серебро» мира криптовалют' : 'Litecoin (LTC): The "Silver" of the Cryptocurrency World',
    description: isRu ? 'История Litecoin от создания до MimbleWimble интеграции.' : 'Litecoin history from creation to MimbleWimble integration.',
    inLanguage: locale,
    datePublished: '2024-01-01',
    dateModified: new Date().toISOString().slice(0, 10),
    author: { '@type': 'Organization', name: 'CryptoPulse.media', url: BASE },
    publisher: { '@type': 'Organization', name: 'CryptoPulse.media', url: BASE },
    mainEntityOfPage: `${BASE}/${locale}/assets/ltc`,
  };

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: LTC_FAQ.map(item => ({
      '@type': 'Question',
      name: item.question[loc],
      acceptedAnswer: { '@type': 'Answer', text: item.answer[loc] },
    })),
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: isRu ? 'Главная' : 'Home', item: `${BASE}/${locale}` },
      { '@type': 'ListItem', position: 2, name: isRu ? 'Крипто-активы' : 'Crypto Assets', item: `${BASE}/${locale}/assets` },
      { '@type': 'ListItem', position: 3, name: 'Litecoin (LTC)', item: `${BASE}/${locale}/assets/ltc` },
    ],
  };

  const glossaryBase = `/${locale}/glossary`;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <nav className="flex items-center gap-1.5 text-xs text-muted mb-8">
        <Link href={`/${locale}`} className="hover:text-accent transition-colors">{isRu ? 'Главная' : 'Home'}</Link>
        <span>›</span>
        <Link href={`/${locale}/assets`} className="hover:text-accent transition-colors">{isRu ? 'Крипто-активы' : 'Crypto Assets'}</Link>
        <span>›</span>
        <span className="text-foreground">Litecoin (LTC)</span>
      </nav>

      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl font-bold text-accent">Ł</span>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight">
              Litecoin <span className="text-muted font-normal text-2xl">LTC</span>
            </h1>
            <p className="text-muted text-sm mt-1">
              {isRu ? 'Первый серьёзный форк биткоина — «серебро к биткоиновому золоту» с 12-летней историей' : 'The first serious Bitcoin fork — "silver to Bitcoin\'s gold" with a 12-year history'}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          {[
            { label: isRu ? 'Год создания' : 'Created', value: 'Окт. 2011' },
            { label: isRu ? 'Макс. запас' : 'Max Supply', value: '84M LTC' },
            { label: isRu ? 'Создатель' : 'Creator', value: 'Charlie Lee' },
            { label: isRu ? 'Алгоритм' : 'Algorithm', value: 'Scrypt PoW' },
          ].map(s => (
            <div key={s.label} className="bg-card border border-border rounded-lg p-3">
              <p className="text-xs text-muted mb-1">{s.label}</p>
              <p className="text-sm font-semibold text-foreground">{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-14">
        <LtcCalculator locale={locale} />
      </div>

      <article className="mb-14">
        <h2 className="text-2xl font-bold text-foreground mb-8">
          {isRu ? 'История Litecoin: 12 лет верной службы крипторынку' : 'Litecoin History: 12 Years of Faithful Service to the Crypto Market'}
        </h2>
        <div className="prose prose-invert prose-sm max-w-none prose-headings:text-foreground prose-headings:font-semibold prose-p:text-muted prose-p:leading-relaxed prose-strong:text-foreground prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-li:text-muted">
          {isRu ? (
            <>
              <h3>2011: Форк биткоина за три дня</h3>
              <p>Чарли Ли — инженер Google — в октябре 2011 года создал Litecoin как форк биткоина с изменениями: алгоритм майнинга Scrypt (вместо SHA-256, чтобы противодействовать ASIC-монополии), время блока <strong>2,5 минуты</strong> (вместо 10), максимальное предложение <strong>84M LTC</strong> (вместо 21M BTC).</p>
              <p>Сам Ли назвал это «серебром к биткоиновому золоту» — более быстрые и дешёвые транзакции для повседневных платежей, пока биткоин служит средством сбережения.</p>

              <h3>2013–2015: Первый бычий рынок и первый халвинг</h3>
              <p>В ноябре 2013 года, вместе с биткоином, LTC пережил первый значительный рост — с $1 до <strong>$48</strong>. Обвал такой же стремительный: $1,5 к середине 2015 года. В августе 2015 года — первый <strong>халвинг</strong>: награда за блок снизилась с 50 до 25 LTC.</p>

              <h3>2017: SegWit и роль «тест-сети»</h3>
              <p>Ключевой вклад Litecoin в историю биткоина: <strong>SegWit (Segregated Witness)</strong> был впервые активирован на Litecoin в мае 2017 года — за несколько месяцев до Bitcoin. Это доказало безопасность обновления и дало сообществу Bitcoin уверенность в активации SegWit. Аналогично — Lightning Network впервые тестировалась на Litecoin.</p>
              <p>В декабре 2017 года LTC достиг ATH <strong>$375</strong> на волне бычьего рынка. Чарли Ли в тот же момент публично продал и пожертвовал <strong>все свои LTC</strong>, объяснив: «мне некомфортно влиять на цену своими твитами». Сообщество восприняло это неоднозначно.</p>

              <h3>2019: Второй халвинг</h3>
              <p>В августе 2019 года — второй халвинг LTC: награда снизилась с 25 до 12,5 LTC. Halving-ралли подняло LTC с $30 до $140 к июню 2019, после чего обвал.</p>

              <h3>2022: MimbleWimble Extension Blocks (MWEB)</h3>
              <p>Самое значимое технологическое обновление Litecoin за годы: в мае 2022 года активирован <strong>MWEB (MimbleWimble Extension Blocks)</strong> — опциональный уровень конфиденциальности на базе протокола MimbleWimble. Пользователи могут делать «конфиденциальные транзакции» с приватными суммами. Litecoin стал первой из «основных» монет с реальным privacy-слоем.</p>
              <p>Парадокс: несколько бирж (Coinbase, Binance) временно делистировали LTC после MWEB из опасений регуляторов. Позже вернули обратно.</p>

              <h3>2023–2025: Третий халвинг и неопределённость</h3>
              <p>В августе 2023 — третий халвинг: 12,5 → 6,25 LTC за блок. После халвинга цена фактически не выросла — что поставило под сомнение «халвинг-нарратив» для LTC. К 2025 году вопрос будущего Litecoin в мире Layer-2 и новых L1 остаётся открытым. Однако 12+ лет непрерывной работы, Grayscale LTC Trust и интеграции в крупные платёжные системы дают ему своё место в криптоистории.</p>
            </>
          ) : (
            <>
              <h3>2011: Bitcoin Fork in Three Days</h3>
              <p>Charlie Lee — a Google engineer — created Litecoin in October 2011 as a Bitcoin fork with changes: the Scrypt mining algorithm (instead of SHA-256, to counter ASIC monopolization), block time of <strong>2.5 minutes</strong> (instead of 10), maximum supply of <strong>84M LTC</strong> (instead of 21M BTC).</p>
              <p>Lee himself called it "silver to Bitcoin's gold" — faster and cheaper transactions for everyday payments, while Bitcoin serves as a store of value.</p>

              <h3>2013–2015: First Bull Market and First Halving</h3>
              <p>In November 2013, along with Bitcoin, LTC experienced its first significant rally — from $1 to <strong>$48</strong>. The crash was equally swift: $1.5 by mid-2015. In August 2015 — the first <strong>halving</strong>: block reward reduced from 50 to 25 LTC.</p>

              <h3>2017: SegWit and the "Testnet" Role</h3>
              <p>Litecoin's key contribution to Bitcoin's history: <strong>SegWit (Segregated Witness)</strong> was first activated on Litecoin in May 2017 — months before Bitcoin. This proved the upgrade's safety and gave the Bitcoin community confidence to activate SegWit. Similarly, Lightning Network was first tested on Litecoin.</p>
              <p>In December 2017, LTC reached ATH of <strong>$375</strong>. Charlie Lee at that very moment publicly sold and donated <strong>all his LTC</strong>, explaining: "I'm uncomfortable influencing the price with my tweets." The community reacted with mixed feelings.</p>

              <h3>2019: Second Halving</h3>
              <p>In August 2019 — the second LTC halving: reward reduced from 25 to 12.5 LTC. The halving rally pushed LTC from $30 to $140 by June 2019, followed by a crash.</p>

              <h3>2022: MimbleWimble Extension Blocks (MWEB)</h3>
              <p>Litecoin's most significant technological update in years: in May 2022, <strong>MWEB (MimbleWimble Extension Blocks)</strong> was activated — an optional privacy layer based on the MimbleWimble protocol. Users can make "confidential transactions" with private amounts. Litecoin became the first "major" coin with a real privacy layer. Paradoxically, several exchanges (Coinbase, Binance) temporarily delisted LTC after MWEB due to regulatory concerns. Later restored.</p>

              <h3>2023–2025: Third Halving and Uncertainty</h3>
              <p>In August 2023 — the third halving: 12.5 → 6.25 LTC per block. After the halving, the price essentially didn't rise — casting doubt on the "halving narrative" for LTC. By 2025, the question of Litecoin's future in a world of Layer-2 and new L1s remains open. However, 12+ years of continuous operation, the Grayscale LTC Trust, and integrations into major payment systems give it its place in crypto history.</p>
            </>
          )}
        </div>
      </article>

      <section className="mb-14">
        <h2 className="text-2xl font-bold text-foreground mb-6">
          {isRu ? 'Что говорят о Litecoin' : 'What They Say About Litecoin'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {LTC_QUOTES.map((q, i) => (
            <blockquote key={i} className={`bg-card border rounded-xl p-4 ${
              q.sentiment === 'bullish' ? 'border-positive/30' :
              q.sentiment === 'bearish' ? 'border-negative/30' : 'border-border'
            }`}>
              <p className="text-sm text-foreground leading-relaxed mb-3 italic">{q.quote[loc]}</p>
              <footer>
                <p className="text-sm font-semibold text-foreground">{q.author}</p>
                <p className="text-xs text-muted">{q.role[loc]}, {q.year}</p>
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      <section className="mb-14">
        <h2 className="text-2xl font-bold text-foreground mb-6">
          {isRu ? 'Часто задаваемые вопросы о Litecoin' : 'Frequently Asked Questions About Litecoin'}
        </h2>
        <div className="flex flex-col gap-4">
          {LTC_FAQ.map((item, i) => (
            <details key={i} className="group bg-card border border-border rounded-xl overflow-hidden">
              <summary className="flex items-center justify-between p-4 cursor-pointer select-none font-semibold text-sm text-foreground list-none">
                {item.question[loc]}
                <span className="text-muted group-open:rotate-180 transition-transform shrink-0 ml-3">▾</span>
              </summary>
              <div className="px-4 pb-4 pt-0 text-sm text-muted leading-relaxed border-t border-border">
                <p className="pt-3">{item.answer[loc]}</p>
              </div>
            </details>
          ))}
        </div>
      </section>

      <section className="bg-card border border-border rounded-xl p-5">
        <h3 className="text-sm font-bold text-foreground mb-3">
          {isRu ? 'Изучите термины в глоссарии' : 'Learn the terms in our glossary'}
        </h3>
        <div className="flex flex-wrap gap-2">
          {[
            { slug: 'mining', label: isRu ? 'Майнинг' : 'Mining' },
            { slug: 'halving', label: isRu ? 'Халвинг' : 'Halving' },
            { slug: 'proof-of-work', label: 'Proof of Work' },
            { slug: 'wallet', label: isRu ? 'Кошелёк' : 'Wallet' },
            { slug: 'fork', label: isRu ? 'Форк' : 'Fork' },
          ].map(t => (
            <Link key={t.slug} href={`${glossaryBase}#${t.slug}`}
              className="text-xs px-3 py-1.5 rounded-full bg-background border border-border text-muted hover:text-accent hover:border-accent/40 transition-colors">
              {t.label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
