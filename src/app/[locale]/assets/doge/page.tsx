import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { buildOg, BASE } from '@/lib/metadata';
import DogeCalculator from '@/components/ui/DogeCalculator';
import { DOGE_QUOTES, DOGE_FAQ } from '@/lib/dogeData';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const isRu = locale === 'ru';
  const title = isRu
    ? 'Dogecoin (DOGE) — История, цена и калькулятор инвестиций'
    : 'Dogecoin (DOGE) — History, Price & Investment Calculator';
  const description = isRu
    ? 'Полная история Dogecoin: от шутки за два дня до топ-10 криптовалют. Роль Илона Маска, NASCAR, ямайская бобслейная команда и DOGE-мания 2021. Калькулятор: что если бы вы купили DOGE 5 или 10 лет назад.'
    : 'Complete Dogecoin history: from a two-day joke to top-10 cryptocurrency. Elon Musk\'s role, NASCAR, the Jamaican bobsled team and 2021 DOGE mania. Calculator: what if you had bought DOGE 5 or 10 years ago.';
  return {
    title,
    description,
    keywords: isRu
      ? ['dogecoin история', 'doge илон маск', 'dogecoin мем', 'doge калькулятор', 'dogecoin цена']
      : ['dogecoin history', 'doge elon musk', 'dogecoin meme', 'doge investment calculator', 'dogecoin price'],
    openGraph: buildOg({ url: `${BASE}/${locale}/assets/doge`, title, description, locale }),
    alternates: {
      canonical: `${BASE}/${locale}/assets/doge`,
      languages: {
        ru: `${BASE}/ru/assets/doge`,
        en: `${BASE}/en/assets/doge`,
      },
    },
  };
}

export default async function DogePage({ params }: Props) {
  const { locale } = await params;
  const isRu = locale === 'ru';
  const loc = isRu ? 'ru' : 'en';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: isRu ? 'Dogecoin (DOGE): история мем-монеты, ставшей феноменом' : 'Dogecoin (DOGE): History of the Meme Coin That Became a Phenomenon',
    description: isRu ? 'Полная история Dogecoin от двухдневной шутки до инструмента Илона Маска.' : 'Complete history of Dogecoin from a two-day joke to Elon Musk\'s favourite coin.',
    inLanguage: locale,
    datePublished: '2024-01-01',
    dateModified: new Date().toISOString().slice(0, 10),
    author: { '@type': 'Organization', name: 'CryptoPulse.media', url: BASE },
    publisher: { '@type': 'Organization', name: 'CryptoPulse.media', url: BASE },
    mainEntityOfPage: `${BASE}/${locale}/assets/doge`,
  };

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: DOGE_FAQ.map(item => ({
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
      { '@type': 'ListItem', position: 3, name: 'Dogecoin (DOGE)', item: `${BASE}/${locale}/assets/doge` },
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
        <span className="text-foreground">Dogecoin (DOGE)</span>
      </nav>

      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl font-bold text-accent">Ð</span>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight">
              Dogecoin <span className="text-muted font-normal text-2xl">DOGE</span>
            </h1>
            <p className="text-muted text-sm mt-1">
              {isRu ? 'Мем-монета №1, ставшая «народной криптовалютой» благодаря Илону Маску' : 'The #1 meme coin that became the "people\'s crypto" thanks to Elon Musk'}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          {[
            { label: isRu ? 'Год создания' : 'Created', value: 'Дек. 2013' },
            { label: isRu ? 'Запас' : 'Supply', value: isRu ? 'Без лимита' : 'Unlimited' },
            { label: isRu ? 'Создатели' : 'Creators', value: 'Markus & Palmer' },
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
        <DogeCalculator locale={locale} />
      </div>

      <article className="mb-14">
        <h2 className="text-2xl font-bold text-foreground mb-8">
          {isRu ? 'История Dogecoin: от шутки до топ-10 по капитализации' : 'Dogecoin History: From a Joke to Top 10 by Market Cap'}
        </h2>
        <div className="prose prose-invert prose-sm max-w-none prose-headings:text-foreground prose-headings:font-semibold prose-p:text-muted prose-p:leading-relaxed prose-strong:text-foreground prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-li:text-muted">
          {isRu ? (
            <>
              <h3>2013: Рождение за два дня</h3>
              <p>В декабре 2013 года инженер Adobe Джексон Палмер увидел в Twitter шутку: «Imagine if there was a Dogecoin» с фотографией собаки сиба-ину (мем «Doge», популярный в 2013-м). Он зарегистрировал домен dogecoin.com. Инженер IBM Билли Маркус нашёл его, написал за два дня код на основе Litecoin — и Dogecoin был запущен 6 декабря 2013 года.</p>
              <p>Никто не воспринимал это серьёзно. Маркус сказал другу: «Эта монета просуществует месяц». Он ошибся ровно на 10+ лет.</p>

              <h3>2014: NASCAR и ямайская команда</h3>
              <p>Сообщество DOGE в 2014 году совершило нечто беспрецедентное: собрало <strong>$55 000 DOGE</strong> для спонсирования NASCAR-гонщика Джоша Уайза и <strong>$30 000</strong> для отправки ямайской бобслейной команды на зимнюю Олимпиаду в Сочи. Это доказало: DOGE-сообщество — не просто «мемеры», а реальная сила для добрых дел.</p>

              <h3>2015–2018: Забвение и первое воскрешение</h3>
              <p>После первых эйфорических месяцев DOGE впал в долгий сон. Оба основателя покинули проект: Палмер в 2015 году (открыто заявив о разочаровании в криптоиндустрии), Маркус продал всё в том же году на Honda Civic. Без лидеров, без разработки, без нарратива — DOGE существовал на инерции.</p>
              <p>В феврале 2019 года Илон Маск написал в Twitter: «Dogecoin might be my fav cryptocurrency». Это был первый залп эры Маска — и DOGE немедленно вырос на 25%.</p>

              <h3>2021: Безумие DOGE-мании</h3>
              <p>Январь 2021 года, WallStreetBets-эффект — розничные инвесторы искали следующую идею для «сквиза». DOGE стал мемом движения. Цена выросла с <strong>$0,005 до $0,073</strong> — рост в 14 раз за неделю. Только начало.</p>
              <p>4 февраля Маск написал твит «Doge» с картинкой короля — и монета выросла ещё на 40%. Снуп Догг переименовал себя в «Snoop DOGE». Геймеры на Robinhood покупали DOGE вместо акций GameStop.</p>
              <p>8 мая 2021 года — <strong>легендарный момент</strong>: Маск выходит на SNL (Saturday Night Live) и когда его спрашивают «что такое Dogecoin?», он отвечает: «Это хастл» (The Hustle). Цена обвалилась с $0,74 до $0,40 прямо во время эфира. Но к тому моменту ранние инвесторы уже сделали сотни иксов.</p>
              <p>ATH DOGE: <strong>$0,7376</strong> в мае 2021 года. Годовой рост: +12 000%.</p>

              <h3>2022–2023: Twitter/X и новая жизнь</h3>
              <p>В октябре 2022 года Маск купил Twitter за $44 млрд. Сразу появились слухи об интеграции DOGE в платёжную систему. Маск сменил иконку Twitter на логотип Dogecoin — монета выросла на 30% за сутки. Однако реальная платёжная интеграция пока не реализована.</p>
              <p>Dallas Mavericks Марка Кубана продолжают принимать DOGE. Tesla принимает DOGE за мерч компании.</p>

              <h3>2024–2025: DOGE как государственная аббревиатура</h3>
              <p>В 2025 году Маск возглавил «Департамент государственной эффективности» (DOGE — Department of Government Efficiency) в администрации Трампа. Это дало новый нарратив: «DOGE теперь официален на государственном уровне». Монета реагировала ростом.</p>
              <p>Viталик Бутерин неоднократно заявлял о готовности помочь DOGE перейти на Proof of Stake — что радикально снизило бы инфляцию. Если это случится, Dogecoin превратится из мема в полноценный актив с ограниченным предложением.</p>
            </>
          ) : (
            <>
              <h3>2013: Born in Two Days</h3>
              <p>In December 2013, Adobe engineer Jackson Palmer saw a tweet joking "Imagine if there was a Dogecoin" with a photo of a Shiba Inu dog (the "Doge" meme popular in 2013). He registered dogecoin.com. IBM engineer Billy Markus found it, spent two days writing code based on Litecoin — and Dogecoin launched on December 6, 2013.</p>
              <p>Nobody took it seriously. Markus told a friend: "This coin will last a month." He was off by 10+ years.</p>

              <h3>2014: NASCAR and the Jamaican Team</h3>
              <p>The DOGE community in 2014 accomplished something unprecedented: raised <strong>$55,000 in DOGE</strong> to sponsor NASCAR driver Josh Wise and <strong>$30,000</strong> to send the Jamaican bobsled team to the Winter Olympics in Sochi. This proved DOGE community members were not just memers but a real force for good.</p>

              <h3>2015–2018: Obscurity and First Revival</h3>
              <p>After the initial euphoric months, DOGE fell into a long sleep. Both founders left the project: Palmer in 2015 (publicly expressing disillusionment with the crypto industry), Markus selling everything that same year to buy a Honda Civic. Without leaders, without development, without a narrative — DOGE existed on inertia.</p>
              <p>In February 2019, Elon Musk tweeted: "Dogecoin might be my fav cryptocurrency." This was the first shot of the Musk era — and DOGE immediately rose 25%.</p>

              <h3>2021: DOGE Mania Madness</h3>
              <p>January 2021, the WallStreetBets effect — retail investors were looking for the next "squeeze" idea. DOGE became the movement's meme. Price rose from <strong>$0.005 to $0.073</strong> — a 14x gain in one week. Just the beginning.</p>
              <p>On February 4, Musk tweeted "Doge" with a lion king image — and the coin rose another 40%. Snoop Dogg renamed himself "Snoop DOGE." Gamers on Robinhood bought DOGE instead of GameStop stock.</p>
              <p>May 8, 2021 — the <strong>legendary moment</strong>: Musk appears on SNL (Saturday Night Live) and when asked "what is Dogecoin?", he answers: "It's a hustle." The price crashed from $0.74 to $0.40 during the live broadcast. But by then, early investors had already made hundreds of X's.</p>
              <p>DOGE ATH: <strong>$0.7376</strong> in May 2021. Annual gain: +12,000%.</p>

              <h3>2022–2023: Twitter/X and New Life</h3>
              <p>In October 2022, Musk bought Twitter for $44 billion. Rumors immediately emerged about DOGE integration into the payment system. Musk briefly changed Twitter's icon to the Dogecoin logo — the coin rose 30% in a day. However, actual payment integration has not yet been implemented.</p>

              <h3>2024–2025: DOGE as a Government Acronym</h3>
              <p>In 2025, Musk headed the "Department of Government Efficiency" (DOGE) in the Trump administration. This gave a new narrative: "DOGE is now official at the government level." The coin responded with gains.</p>
              <p>Vitalik Buterin has repeatedly expressed willingness to help DOGE transition to Proof of Stake — which would radically reduce inflation. If this happens, Dogecoin would transform from a meme into a genuine asset with limited supply.</p>
            </>
          )}
        </div>
      </article>

      <section className="mb-14">
        <h2 className="text-2xl font-bold text-foreground mb-6">
          {isRu ? 'Что говорят о Dogecoin' : 'What They Say About Dogecoin'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {DOGE_QUOTES.map((q, i) => (
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
          {isRu ? 'Часто задаваемые вопросы о Dogecoin' : 'Frequently Asked Questions About Dogecoin'}
        </h2>
        <div className="flex flex-col gap-4">
          {DOGE_FAQ.map((item, i) => (
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
            { slug: 'altcoin', label: isRu ? 'Альткоин' : 'Altcoin' },
            { slug: 'proof-of-work', label: 'Proof of Work' },
            { slug: 'market-cap', label: isRu ? 'Рыночная капитализация' : 'Market Cap' },
            { slug: 'fomo', label: 'FOMO' },
            { slug: 'whale', label: isRu ? 'Кит' : 'Whale' },
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
