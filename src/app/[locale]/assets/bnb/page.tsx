import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import CoinGuideLayout from '@/components/ui/CoinGuideLayout';
import { buildOg, buildTwitter, BASE } from '@/lib/metadata';
import { BNB_QUOTES, BNB_FAQ, BNB_INVESTMENT_REFERENCE } from '@/lib/bnbData';
import { SITE_NAME } from '@/lib/site';

type Props = { params: Promise<{ locale: string }> };
const SLUG = 'bnb';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const isRu = locale === 'ru';
  const title = isRu ? 'BNB: цена, история, калькулятор' : 'BNB: price, history, calculator';
  const description = isRu
    ? 'История BNB: как Binance стала крупнейшей биржей мира, запуск BSC, сжигание токенов, дело CZ. Калькулятор инвестиций в BNB за 5 и 7 лет.'
    : "BNB history: how Binance became the world's largest exchange, the BSC launch, token burns, the CZ case. BNB investment calculator over 5 and 7 years.";
  return {
    // Absolute: the layout template appends ` | ${SITE_NAME}`, which costs
    // 20 characters and adds nothing here — the coin's name is already first.
    title: { absolute: title },
    description,
    keywords: isRu
      ? ['binance coin история', 'bnb токен', 'bsc блокчейн', 'binance smart chain', 'bnb калькулятор']
      : ['binance coin history', 'bnb token', 'bsc blockchain', 'binance smart chain', 'bnb investment calculator'],
    openGraph: buildOg({ url: `${BASE}/${locale}/assets/bnb`, title, description, locale }),
    twitter: buildTwitter({ url: `${BASE}/${locale}/assets/bnb`, title, description, locale }),
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

const GUIDE = {
  stats: [
    { label: { ru: 'Год создания', en: 'Created' }, value: '2017' },
    { label: { ru: 'Нач. запас', en: 'Initial supply' }, value: '200 000 000' },
    { label: { ru: 'Создатель', en: 'Creator' }, value: 'Changpeng Zhao (CZ)' },
    { label: { ru: 'Цель сжигания', en: 'Burn target' }, value: '100 000 000' },
  ],
  investmentReference: BNB_INVESTMENT_REFERENCE,
  faq: BNB_FAQ,
  glossaryTerms: [
    { slug: 'staking', label: { ru: 'Стейкинг', en: 'Staking' } },
    { slug: 'defi', label: { ru: 'DeFi', en: 'DeFi' } },
    { slug: 'cex', label: { ru: 'Централизованная биржа (CEX)', en: 'CEX' } },
    { slug: 'dex', label: { ru: 'Децентрализованная биржа (DEX)', en: 'DEX' } },
    { slug: 'bep-20', label: { ru: 'BEP-20', en: 'BEP-20' } },
    { slug: 'smart-contract', label: { ru: 'Смарт-контракт', en: 'Smart Contract' } },
  ],
};

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
    author: { '@type': 'Organization', name: SITE_NAME, url: BASE },
    publisher: { '@type': 'Organization', name: SITE_NAME, url: BASE },
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

  const historyContent = (
    <>
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
    </>
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <CoinGuideLayout
        locale={locale}
        slug={SLUG}
        tagline={isRu ? 'Нативный токен крупнейшей криптобиржи и блокчейн-экосистемы BNB Chain' : 'Native token of the world\'s largest crypto exchange and BNB Chain ecosystem'}
        historyTitle={isRu ? 'История BNB: от биржевого токена до целой экосистемы' : 'BNB History: From Exchange Token to Entire Ecosystem'}
        historyContent={historyContent}
        guide={GUIDE}
        quotes={BNB_QUOTES}
      />
    </>
  );
}
