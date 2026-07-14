import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { buildOg, BASE } from '@/lib/metadata';
import CoinGuideLayout from '@/components/ui/CoinGuideLayout';
import { COIN_GUIDES } from '@/lib/coinGuides';

type Props = { params: Promise<{ locale: string }> };
const SLUG = 'uniswap';
const guide = COIN_GUIDES[SLUG];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const isRu = locale === 'ru';
  const title = isRu ? 'Uniswap (UNI) — История, цена и калькулятор инвестиций' : 'Uniswap (UNI) — History, Price & Investment Calculator';
  const description = isRu
    ? 'История Uniswap: от идеи автоматического маркет-мейкера до крупнейшей децентрализованной биржи и легендарной раздачи токенов. Калькулятор инвестиций в UNI.'
    : 'The history of Uniswap: from an automated market maker idea to the largest decentralized exchange and its legendary token airdrop. UNI investment calculator.';

  return {
    title,
    description,
    keywords: isRu
      ? ['uniswap история', 'uni токен', 'раздача uniswap', 'uniswap калькулятор', 'что такое dex']
      : ['uniswap history', 'uni token', 'uniswap airdrop', 'uniswap investment calculator', 'what is a dex'],
    openGraph: buildOg({ url: `${BASE}/${locale}/assets/${SLUG}`, title, description, locale }),
    alternates: {
      canonical: `${BASE}/${locale}/assets/${SLUG}`,
      languages: { ru: `${BASE}/ru/assets/${SLUG}`, en: `${BASE}/en/assets/${SLUG}` },
    },
  };
}

export default async function UniswapPage({ params }: Props) {
  const { locale } = await params;
  const isRu = locale === 'ru';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: isRu ? 'Uniswap (UNI): история крупнейшей децентрализованной биржи' : 'Uniswap (UNI): History of the Largest Decentralized Exchange',
    description: isRu ? 'История Uniswap от запуска протокола до легендарной раздачи UNI.' : 'The history of Uniswap from protocol launch to its legendary UNI airdrop.',
    inLanguage: locale,
    datePublished: '2026-07-14',
    dateModified: new Date().toISOString().slice(0, 10),
    author: { '@type': 'Organization', name: 'CryptoPulse.media', url: BASE },
    publisher: { '@type': 'Organization', name: 'CryptoPulse.media', url: BASE },
    mainEntityOfPage: `${BASE}/${locale}/assets/${SLUG}`,
  };
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: guide.faq.map(item => ({ '@type': 'Question', name: item.question[isRu ? 'ru' : 'en'], acceptedAnswer: { '@type': 'Answer', text: item.answer[isRu ? 'ru' : 'en'] } })),
  };
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: isRu ? 'Главная' : 'Home', item: `${BASE}/${locale}` },
      { '@type': 'ListItem', position: 2, name: isRu ? 'Крипто-активы' : 'Crypto Assets', item: `${BASE}/${locale}/assets` },
      { '@type': 'ListItem', position: 3, name: 'Uniswap (UNI)', item: `${BASE}/${locale}/assets/${SLUG}` },
    ],
  };

  const glossaryBase = `/${locale}/glossary`;

  const historyContent = isRu ? (
    <>
      <h3>2017–2018: Идея Виталика Бутерина и её реализация</h3>
      <p>
        История Uniswap началась с поста в блоге <strong>Виталика Бутерина</strong>, создателя Ethereum,
        описавшего теоретическую модель «автоматического маркет-мейкера» — способа торговать токенами
        через математическую формулу и общий пул ликвидности, а не через традиционную книгу ордеров.
      </p>
      <p>
        Инженер-механик <strong>Хайден Адамс</strong>, незадолго до этого потерявший работу, решил
        воплотить идею в код в качестве учебного проекта по программированию на Ethereum. В ноябре 2018
        года протокол Uniswap был запущен в основной сети Ethereum.
      </p>

      <h3>2020: DeFi Summer и взрывной рост</h3>
      <p>
        Лето 2020 года вошло в историю как <strong>«<Link href={`${glossaryBase}#defi`}>DeFi</Link> Summer»</strong> —
        взрывной рост децентрализованных финансовых протоколов. Uniswap оказался в центре этого движения,
        так как это была одна из первых <Link href={`${glossaryBase}#dex`}>DEX</Link>, где любой мог
        создать пул ликвидности для любого токена ERC-20 без разрешений и листингов, как на
        централизованных биржах.
      </p>

      <h3>2020: Легендарная раздача токена UNI</h3>
      <p>
        16 сентября 2020 года Uniswap выпустил собственный токен управления <strong>UNI</strong> и раздал
        по <strong>400 UNI</strong> каждому кошельку, который хоть раз взаимодействовал с протоколом до
        этой даты. На пике цены токена в мае 2021 года (около <strong>$45</strong>) эта раздача
        стоила почти <strong>$18 000</strong> — совершенно бесплатно для ранних пользователей. Это
        событие стало одним из крупнейших и самых известных «эйрдропов» в истории криптовалют и
        задало моду на подобные раздачи для десятков последующих проектов.
      </p>

      <h3>Сегодня: крупнейшая DEX на рынке</h3>
      <p>
        Uniswap остаётся крупнейшей децентрализованной биржей по объёму торгов, работая на нескольких
        сетях, включая Ethereum, Polygon, Arbitrum и Optimism.
      </p>
    </>
  ) : (
    <>
      <h3>2017–2018: Vitalik Buterin's Idea and Its Execution</h3>
      <p>
        Uniswap's story began with a blog post by <strong>Vitalik Buterin</strong>, Ethereum's creator,
        outlining a theoretical "automated market maker" model — a way to trade tokens through a
        mathematical formula and a shared liquidity pool instead of a traditional order book.
      </p>
      <p>
        Mechanical engineer <strong>Hayden Adams</strong>, who had recently lost his job, decided to turn
        the idea into code as an Ethereum programming learning project. In November 2018, the Uniswap
        protocol launched on the Ethereum mainnet.
      </p>

      <h3>2020: DeFi Summer and Explosive Growth</h3>
      <p>
        Summer 2020 became known as <strong>"<Link href={`${glossaryBase}#defi`}>DeFi</Link> Summer"</strong> —
        an explosive growth period for decentralized finance protocols. Uniswap sat at the center of this
        movement as one of the earliest <Link href={`${glossaryBase}#dex`}>DEXs</Link>, since anyone could
        create a liquidity pool for any ERC-20 token without permission or the listing process required by
        centralized exchanges.
      </p>

      <h3>2020: The Legendary UNI Token Airdrop</h3>
      <p>
        On September 16, 2020, Uniswap launched its own governance token, <strong>UNI</strong>, and
        airdropped <strong>400 UNI</strong> to every wallet that had interacted with the protocol before
        that date. At the token's peak price in May 2021 (around <strong>$45</strong>), that airdrop was
        worth nearly <strong>$18,000</strong> — entirely free for early users. It became one of the
        largest and most famous airdrops in crypto history, and set off a wave of similar airdrops across
        dozens of later projects.
      </p>

      <h3>Today: The Largest DEX in the Market</h3>
      <p>
        Uniswap remains the largest decentralized exchange by trading volume, running across multiple
        networks including Ethereum, Polygon, Arbitrum, and Optimism.
      </p>
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
        name="Uniswap"
        symbol="UNI"
        icon="🦄"
        coingeckoId="uniswap"
        tagline={isRu ? 'Крупнейшая децентрализованная биржа (DEX) на Ethereum' : 'The largest decentralized exchange (DEX) on Ethereum'}
        historyTitle={isRu ? 'История Uniswap: от идеи Виталика Бутерина до крупнейшей DEX' : "Uniswap History: From Vitalik Buterin's Idea to the Largest DEX"}
        historyContent={historyContent}
        guide={guide}
      />
    </>
  );
}
