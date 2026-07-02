import type { Metadata } from 'next';
import Link from 'next/link';
import { buildOg, BASE } from '@/lib/metadata';
import BnbCalculator from '@/components/ui/BnbCalculator';
import { BNB_QUOTES, BNB_FAQ } from '@/lib/bnbData';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isRu = locale === 'ru';
  const title = isRu
    ? 'BNB (Binance Coin) — История, цена и калькулятор инвестиций'
    : 'BNB (Binance Coin) — History, Price & Investment Calculator';
  const description = isRu
    ? 'Полная история BNB: как Binance стала крупнейшей биржей мира, запуск BSC, механизм сжигания токенов, история с CZ. Калькулятор: сколько бы вы заработали, вложив в BNB 5 или 7 лет назад.'
    : 'Complete BNB history: how Binance became the world\'s largest exchange, BSC launch, token burning mechanism, the CZ story. Calculator: how much would you have earned investing in BNB 5 or 7 years ago.';
  return {
    title,
    description,
    keywords: isRu
      ? ['binance coin история', 'bnb токен', 'bsc блокчейн', 'binance smart chain', 'bnb калькулятор']
      : ['binance coin history', 'bnb token', 'bsc blockchain', 'binance smart chain', 'bnb investment calculator'],
    openGraph: buildOg({ url: `${BASE}/${locale}/assets/bnb`, title, description, locale }),
    alternates: {
      canonical: `${BASE}/${locale}/assets/bnb`,
      languages: {
        ru: `${BASE}/ru/assets/bnb`,
        en: `${BASE}/en/assets/bnb`,
        'x-default': `${BASE}/en/assets/bnb`,
      },
    },
  };
}

export default async function BnbPage({ params }: Props) {
  const { locale } = await params;
  const isRu = locale === 'ru';
  const loc = isRu ? 'ru' : 'en';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: isRu ? 'BNB (Binance Coin): история, экосистема и рост за 7 лет' : 'BNB (Binance Coin): History, Ecosystem and 7 Years of Growth',
    description: isRu ? 'Полная история BNB от ICO до крупнейшей биржевой экосистемы мира.' : 'Complete BNB history from ICO to the world\'s largest exchange ecosystem.',
    inLanguage: locale,
    datePublished: '2024-01-01',
    dateModified: new Date().toISOString().slice(0, 10),
    author: { '@type': 'Organization', name: 'CryptoPulse.media', url: BASE },
    publisher: { '@type': 'Organization', name: 'CryptoPulse.media', url: BASE },
    mainEntityOfPage: `${BASE}/${locale}/assets/bnb`,
  };

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: BNB_FAQ.map(item => ({
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
      { '@type': 'ListItem', position: 3, name: 'BNB (Binance Coin)', item: `${BASE}/${locale}/assets/bnb` },
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
        <span className="text-foreground">BNB (Binance Coin)</span>
      </nav>

      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl font-bold text-accent">◈</span>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight">
              Binance Coin <span className="text-muted font-normal text-2xl">BNB</span>
            </h1>
            <p className="text-muted text-sm mt-1">
              {isRu ? 'Нативный токен крупнейшей криптобиржи и блокчейн-экосистемы BNB Chain' : 'Native token of the world\'s largest crypto exchange and BNB Chain ecosystem'}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          {[
            { label: isRu ? 'Год создания' : 'Created', value: '2017' },
            { label: isRu ? 'Нач. запас' : 'Initial supply', value: '200 000 000' },
            { label: isRu ? 'Создатель' : 'Creator', value: 'Changpeng Zhao (CZ)' },
            { label: isRu ? 'Цель сжигания' : 'Burn target', value: '100 000 000' },
          ].map(s => (
            <div key={s.label} className="bg-card border border-border rounded-lg p-3">
              <p className="text-xs text-muted mb-1">{s.label}</p>
              <p className="text-sm font-semibold text-foreground">{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-14">
        <BnbCalculator locale={locale} />
      </div>

      <article className="mb-14">
        <h2 className="text-2xl font-bold text-foreground mb-8">
          {isRu ? 'История BNB: от биржевого токена до целой экосистемы' : 'BNB History: From Exchange Token to Entire Ecosystem'}
        </h2>
        <div className="prose prose-invert prose-sm max-w-none prose-headings:text-foreground prose-headings:font-semibold prose-p:text-muted prose-p:leading-relaxed prose-strong:text-foreground prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-li:text-muted">
          {isRu ? (
            <>
              <h3>2017: ICO за 15 минут и рождение Binance</h3>
              <p>В июле 2017 года Чанпэн Чжао (CZ) — технологический директор OKCoin, ставший серийным криптопредпринимателем — основал Binance. Биржа провела ICO BNB, собрав <strong>$15 млн за 15 минут</strong>. Токен размещался на Ethereum (ERC-20) по цене $0,10. Изначальная утилита была простой: держатели BNB получают <strong>скидку 50% на торговые комиссии</strong> Binance.</p>
              <p>Но Binance росла с невероятной скоростью. К концу 2017 года она стала крупнейшей в мире по объёму торгов — невероятный факт для биржи, которой не было и полугода.</p>

              <h3>2019: Binance Chain и собственный блокчейн</h3>
              <p>В апреле 2019 года Binance запустила собственный блокчейн — <strong>Binance Chain</strong>, и BNB мигрировал с Ethereum на новый нативный стандарт BEP-2. Цель: ускорить транзакции для торговли токенами на децентрализованной бирже Binance DEX.</p>
              <p>Тогда же начались регулярные <strong>квартальные сжигания BNB</strong> — Binance сжигала токены на сумму 20% от квартальной прибыли. Это создало дефляционную механику, подстёгивавшую интерес инвесторов.</p>

              <h3>2020: BSC — «дешёвый Ethereum» для масс</h3>
              <p>В сентябре 2020 года Binance запустила <strong>Binance Smart Chain (BSC)</strong> — второй блокчейн, параллельный Binance Chain, но EVM-совместимый (то есть поддерживающий смарт-контракты Ethereum). BSC предлагал: комиссии в 10–50 раз дешевле Ethereum, 3-секундные блоки. Это стало революцией доступности: тысячи DeFi-проектов переехали на BSC ради низких газ-фи.</p>
              <p>USDT и другие стейблкоины на BSC (стандарт BEP-20) стали популярными среди розничных пользователей.</p>

              <h3>2021: ATH $690 и экосистема с миллиардами TVL</h3>
              <p>DeFi-лето продолжилось в 2021 году — теперь на BSC. <strong>PancakeSwap</strong> стал крупнейшим DEX по объёму, конкурируя с Uniswap. Экосистема BSC достигла TVL в $30+ млрд. В мае 2021 года BNB установил исторический максимум: <strong>$690 за монету</strong>. Только за 2021 год рост составил более 1 300%.</p>
              <p>Binance запустила <strong>Launchpad и Launchpool</strong> — платформы для инвестирования в новые проекты с использованием BNB, что усилило спрос на токен.</p>

              <h3>2022: Волатильность, крах LUNA и хак моста</h3>
              <p>2022 год был турбулентным. Крах экосистемы LUNA/UST (май 2022) ударил по рынку. В октябре 2022 года мост BNB Chain был взломан — хакеры вывели около <strong>$100 млн</strong>. Binance оперативно остановила сеть (что критики использовали как доказательство централизации) и устранила уязвимость. BNB обновил правила безопасности.</p>

              <h3>2023: Иск SEC, уход CZ и $4,3 млрд штрафа</h3>
              <p>В ноябре 2023 года Министерство юстиции США объявило о заключении соглашения с Binance: биржа уплатила <strong>$4,3 млрд штрафа</strong> — одного из крупнейших в истории. CZ признал вину в нарушении законов о борьбе с отмыванием денег и покинул пост CEO. В апреле 2024 года суд приговорил его к <strong>4 месяцам заключения</strong>. Новым CEO стал Ричард Тенг.</p>
              <p>Несмотря на скандал, Binance сохранила лидерство по объёму торгов, а BNB к 2024 году восстановился выше $500.</p>

              <h3>2024: Ребрендинг и новый цикл</h3>
              <p>BSC был переименован в <strong>BNB Chain</strong>, подчёркивая независимость от бренда Binance. Разработчики активно работают над повышением децентрализации сети (100 валидаторов вместо 21). Механизм Auto-Burn и Real-Time Burn продолжают уменьшать предложение BNB. К концу 2024 года было сожжено более <strong>47 млн BNB</strong> из 100 млн запланированных.</p>
            </>
          ) : (
            <>
              <h3>2017: ICO in 15 Minutes and the Birth of Binance</h3>
              <p>In July 2017, Changpeng Zhao (CZ) — former CTO of OKCoin turned serial crypto entrepreneur — founded Binance. The exchange held a BNB ICO, raising <strong>$15 million in 15 minutes</strong>. The token was issued on Ethereum (ERC-20) at $0.10. The initial utility was simple: BNB holders receive a <strong>50% discount on Binance trading fees</strong>.</p>
              <p>But Binance grew at an incredible pace. By end of 2017 it became the world's largest exchange by trading volume — a remarkable feat for an exchange less than six months old.</p>

              <h3>2019: Binance Chain and Its Own Blockchain</h3>
              <p>In April 2019, Binance launched its own blockchain — <strong>Binance Chain</strong>, and BNB migrated from Ethereum to the new native BEP-2 standard. The goal: faster transactions for token trading on the Binance DEX decentralized exchange.</p>
              <p>Regular <strong>quarterly BNB burns</strong> also began — Binance burned tokens worth 20% of quarterly profit. This created deflationary mechanics that sustained investor interest.</p>

              <h3>2020: BSC — "Cheap Ethereum" for the Masses</h3>
              <p>In September 2020, Binance launched <strong>Binance Smart Chain (BSC)</strong> — a second blockchain parallel to Binance Chain but EVM-compatible (supporting Ethereum smart contracts). BSC offered fees 10–50x cheaper than Ethereum and 3-second blocks. This democratized access: thousands of DeFi projects migrated to BSC for low gas fees.</p>

              <h3>2021: ATH of $690 and an Ecosystem with Billions in TVL</h3>
              <p>DeFi summer continued in 2021 — now on BSC. <strong>PancakeSwap</strong> became the largest DEX by volume, competing with Uniswap. The BSC ecosystem reached $30+ billion TVL. In May 2021, BNB set its all-time high: <strong>$690 per coin</strong>. Growth of over 1,300% in 2021 alone.</p>

              <h3>2022: Volatility, LUNA Collapse and Bridge Hack</h3>
              <p>2022 was turbulent. The LUNA/UST ecosystem collapse (May 2022) rocked the market. In October 2022, the BNB Chain bridge was hacked — attackers extracted about <strong>$100 million</strong>. Binance promptly halted the network (which critics used as evidence of centralization) and patched the vulnerability.</p>

              <h3>2023: SEC Lawsuit, CZ's Departure and $4.3B Fine</h3>
              <p>In November 2023, the US Department of Justice announced a settlement with Binance: the exchange paid a <strong>$4.3 billion fine</strong> — one of the largest in history. CZ pleaded guilty to anti-money laundering violations and stepped down as CEO. In April 2024, a court sentenced him to <strong>4 months in prison</strong>. Richard Teng became the new CEO. Despite the scandal, Binance maintained its trading volume leadership, and BNB recovered above $500 by 2024.</p>

              <h3>2024: Rebrand and a New Cycle</h3>
              <p>BSC was rebranded to <strong>BNB Chain</strong>, emphasizing independence from the Binance brand. Developers are actively working on increasing network decentralization (100 validators instead of 21). Auto-Burn and Real-Time Burn mechanisms continue to reduce BNB supply. By end of 2024, more than <strong>47 million BNB</strong> had been burned out of the planned 100 million.</p>
            </>
          )}
        </div>
      </article>

      <section className="mb-14">
        <h2 className="text-2xl font-bold text-foreground mb-6">
          {isRu ? 'Что говорят о BNB' : 'What They Say About BNB'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {BNB_QUOTES.map((q, i) => (
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
          {isRu ? 'Часто задаваемые вопросы о BNB' : 'Frequently Asked Questions About BNB'}
        </h2>
        <div className="flex flex-col gap-4">
          {BNB_FAQ.map((item, i) => (
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
            { slug: 'staking', label: isRu ? 'Стейкинг' : 'Staking' },
            { slug: 'defi', label: 'DeFi' },
            { slug: 'cex', label: isRu ? 'Централизованная биржа (CEX)' : 'CEX' },
            { slug: 'dex', label: isRu ? 'Децентрализованная биржа (DEX)' : 'DEX' },
            { slug: 'bep-20', label: 'BEP-20' },
            { slug: 'smart-contract', label: isRu ? 'Смарт-контракт' : 'Smart Contract' },
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
