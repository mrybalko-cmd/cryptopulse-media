import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { buildOg, BASE } from '@/lib/metadata';
import DotCalculator from '@/components/ui/DotCalculator';
import { DOT_QUOTES, DOT_FAQ } from '@/lib/dotData';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const isRu = locale === 'ru';
  const title = isRu
    ? 'Polkadot (DOT) — История, цена и калькулятор инвестиций'
    : 'Polkadot (DOT) — History, Price & Investment Calculator';
  const description = isRu
    ? 'Полная история Polkadot: как Гэвин Вуд — создатель Solidity и сооснователь Ethereum — построил интероперабельную мультичейн сеть. Параллельные цепи, аукционы слотов и Polkadot 2.0. Калькулятор инвестиций.'
    : 'Complete Polkadot history: how Gavin Wood — creator of Solidity and Ethereum co-founder — built an interoperable multi-chain network. Parachains, slot auctions and Polkadot 2.0. Investment calculator.';
  return {
    title,
    description,
    keywords: isRu
      ? ['polkadot dot история', 'gavin wood криптовалюта', 'parachain polkadot', 'dot блокчейн', 'dot калькулятор']
      : ['polkadot dot history', 'gavin wood cryptocurrency', 'parachain polkadot', 'dot blockchain', 'dot investment calculator'],
    openGraph: buildOg({ url: `${BASE}/${locale}/assets/dot`, title, description, locale }),
    alternates: {
      canonical: `${BASE}/${locale}/assets/dot`,
      languages: {
        ru: `${BASE}/ru/assets/dot`,
        en: `${BASE}/en/assets/dot`,
      },
    },
  };
}

export default async function DotPage({ params }: Props) {
  const { locale } = await params;
  const isRu = locale === 'ru';
  const loc = isRu ? 'ru' : 'en';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: isRu ? 'Polkadot (DOT): «интернет блокчейнов» от создателя Solidity' : 'Polkadot (DOT): The "Internet of Blockchains" from the Creator of Solidity',
    description: isRu ? 'История Polkadot от основания до Polkadot 2.0.' : 'Polkadot history from founding to Polkadot 2.0.',
    inLanguage: locale,
    datePublished: '2024-01-01',
    dateModified: new Date().toISOString().slice(0, 10),
    author: { '@type': 'Organization', name: 'CryptoPulse.media', url: BASE },
    publisher: { '@type': 'Organization', name: 'CryptoPulse.media', url: BASE },
    mainEntityOfPage: `${BASE}/${locale}/assets/dot`,
  };

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: DOT_FAQ.map(item => ({
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
      { '@type': 'ListItem', position: 3, name: 'Polkadot (DOT)', item: `${BASE}/${locale}/assets/dot` },
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
        <span className="text-foreground">Polkadot (DOT)</span>
      </nav>

      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl font-bold text-accent">●</span>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight">
              Polkadot <span className="text-muted font-normal text-2xl">DOT</span>
            </h1>
            <p className="text-muted text-sm mt-1">
              {isRu ? 'Гетерогенный мультичейн от Гэвина Вуда — интероперабельность блокчейнов как главная идея' : 'Heterogeneous multi-chain from Gavin Wood — blockchain interoperability as the core idea'}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          {[
            { label: isRu ? 'Год запуска' : 'Launched', value: '2020' },
            { label: isRu ? 'Запас' : 'Supply', value: isRu ? 'Инфляционный' : 'Inflationary' },
            { label: isRu ? 'Основатель' : 'Founder', value: 'Gavin Wood' },
            { label: isRu ? 'Архитектура' : 'Architecture', value: 'Relay + Parachains' },
          ].map(s => (
            <div key={s.label} className="bg-card border border-border rounded-lg p-3">
              <p className="text-xs text-muted mb-1">{s.label}</p>
              <p className="text-sm font-semibold text-foreground">{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-14">
        <DotCalculator locale={locale} />
      </div>

      <article className="mb-14">
        <h2 className="text-2xl font-bold text-foreground mb-8">
          {isRu ? 'История Polkadot: мультичейн-интернет от создателя Solidity' : 'Polkadot History: Multi-Chain Internet from the Creator of Solidity'}
        </h2>
        <div className="prose prose-invert prose-sm max-w-none prose-headings:text-foreground prose-headings:font-semibold prose-p:text-muted prose-p:leading-relaxed prose-strong:text-foreground prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-li:text-muted">
          {isRu ? (
            <>
              <h3>2014–2016: Гэвин Вуд и рождение идеи</h3>
              <p>Гэвин Вуд — один из трёх сооснователей Ethereum, автор языка <strong>Solidity</strong> и спецификации EVM (Ethereum Virtual Machine), технический директор Ethereum Foundation — покинул проект в 2016 году. В том же году он опубликовал первый <strong>whitepaper Polkadot</strong>.</p>
              <p>Идея проста и амбициозна одновременно: блокчейны сейчас существуют как «острова» — Bitcoin не может общаться с Ethereum, Ethereum не знает о Solana. Polkadot создаёт метапротокол — «Relay Chain», к которой подключаются специализированные «парачейны», обменивающиеся данными и активами без мостов и доверенных посредников.</p>

              <h3>2017: ICO и взлом Parity</h3>
              <p>ICO Polkadot в октябре 2017 года: <strong>$145 млн</strong> за несколько часов. Немедленно омрачённый катастрофой: в ноябре 2017 года хакер заблокировал <strong>$150M в ETH</strong> на кошельке Parity (компании Гэвина Вуда). Средства заморожены навсегда — включая часть средств, собранных в ICO Polkadot.</p>

              <h3>2019–2020: Kusama и тестирование в production</h3>
              <p>Перед запуском основной сети Polkadot создала «канареечную сеть» <strong>Kusama (KSM)</strong> — реальный блокчейн с реальными ставками, но с более быстрым циклом обновлений. Kusama стала полигоном для экспериментов: всё, что выживает в Kusama, идёт в Polkadot.</p>
              <p>Mainnet Polkadot запустился в мае 2020 года. Примечательный момент: в 2020 году токен DOT прошёл через реденоминацию <strong>1:100</strong> (один старый = 100 новых DOT) для удобства торговли.</p>

              <h3>2021: Аукционы слотов — параллельные цепи идут на борт</h3>
              <p>Главное событие 2021 года: <strong>аукционы парачейн-слотов</strong>. Проекты, желающие стать парачейном, конкурируют за «слоты», блокируя DOT через краудлоан (сообщество одалживает DOT, возвращаемые после окончания аренды). Первый победитель — Acala Network (DeFi хаб) с привлечёнными ~32M DOT. Затем Moonbeam (EVM-совместимый парачейн).</p>
              <p>ATH DOT: <strong>$55</strong> в ноябре 2021 года.</p>

              <h3>2022–2024: Медвежий рынок и переосмысление</h3>
              <p>DOT потерял более 90% от ATH. Система аукционов получила критику: высокий порог входа, сложность для пользователей, «замороженный» DOT не работает в DeFi.</p>
              <p>Ответ команды: <strong>Polkadot 2.0</strong> и концепция «coretime» (вычислительное время Relay Chain как ресурс, продаваемый без аукционов, более гибко). Протокол <strong>JAM (Join-Accumulate Machine)</strong> — радикальный редизайн архитектуры Polkadot для максимальной гибкости.</p>

              <h3>2025: Эволюция</h3>
              <p>Polkadot сохраняет сильные позиции в экосистеме DeFi через парачейны Acala, HydraDX, Bifrost. Аксиома «самый умный L0» остаётся релевантной: если мультичейн-будущее реализуется, Polkadot — один из главных претендентов на инфраструктурную роль.</p>
            </>
          ) : (
            <>
              <h3>2014–2016: Gavin Wood and the Birth of an Idea</h3>
              <p>Gavin Wood — one of Ethereum's three co-founders, author of the <strong>Solidity</strong> language and EVM specification, Ethereum Foundation CTO — left the project in 2016. That same year he published the first <strong>Polkadot whitepaper</strong>.</p>
              <p>The idea is simple yet ambitious: blockchains currently exist as "islands" — Bitcoin can't communicate with Ethereum, Ethereum doesn't know about Solana. Polkadot creates a meta-protocol — a "Relay Chain" to which specialized "parachains" connect, exchanging data and assets without bridges or trusted intermediaries.</p>

              <h3>2017: ICO and the Parity Hack</h3>
              <p>Polkadot's October 2017 ICO: <strong>$145 million</strong> in just hours. Immediately overshadowed by catastrophe: in November 2017, a hacker froze <strong>$150M in ETH</strong> in a Parity wallet (Gavin Wood's company). Funds frozen forever — including part of the Polkadot ICO proceeds.</p>

              <h3>2019–2020: Kusama and Production Testing</h3>
              <p>Before launching the main network, Polkadot created a "canary network" — <strong>Kusama (KSM)</strong> — a real blockchain with real stakes but faster upgrade cycles. Kusama became a testing ground: what survives Kusama goes to Polkadot. Polkadot mainnet launched in May 2020. Notable: in 2020 DOT underwent a <strong>1:100 redenomination</strong> for trading convenience.</p>

              <h3>2021: Slot Auctions — Parachains Come Aboard</h3>
              <p>The main 2021 event: <strong>parachain slot auctions</strong>. Projects wanting to become parachains compete for "slots" by locking DOT via crowdloans (community lends DOT, returned after lease ends). First winner: Acala Network (DeFi hub) with ~32M DOT attracted. Then Moonbeam (EVM-compatible parachain). ATH DOT: <strong>$55</strong> in November 2021.</p>

              <h3>2022–2024: Bear Market and Rethinking</h3>
              <p>DOT lost more than 90% from ATH. The auction system faced criticism: high entry threshold, complexity for users, "frozen" DOT doesn't work in DeFi. The team's answer: <strong>Polkadot 2.0</strong> and "coretime" concept (Relay Chain compute time as a resource sold without auctions, more flexibly). The <strong>JAM (Join-Accumulate Machine)</strong> protocol — radical redesign of Polkadot's architecture for maximum flexibility.</p>

              <h3>2025: Evolution</h3>
              <p>Polkadot maintains strong positions in the DeFi ecosystem through parachains Acala, HydraDX, Bifrost. The "smartest L0" axiom remains relevant: if a multi-chain future materializes, Polkadot is one of the main contenders for an infrastructure role.</p>
            </>
          )}
        </div>
      </article>

      <section className="mb-14">
        <h2 className="text-2xl font-bold text-foreground mb-6">
          {isRu ? 'Что говорят о Polkadot' : 'What They Say About Polkadot'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {DOT_QUOTES.map((q, i) => (
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
          {isRu ? 'Часто задаваемые вопросы о Polkadot' : 'Frequently Asked Questions About Polkadot'}
        </h2>
        <div className="flex flex-col gap-4">
          {DOT_FAQ.map((item, i) => (
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
            { slug: 'smart-contract', label: isRu ? 'Смарт-контракт' : 'Smart Contract' },
            { slug: 'staking', label: isRu ? 'Стейкинг' : 'Staking' },
            { slug: 'bridge', label: isRu ? 'Мост' : 'Bridge' },
            { slug: 'dao', label: 'DAO' },
            { slug: 'layer-2', label: 'Layer 2' },
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
