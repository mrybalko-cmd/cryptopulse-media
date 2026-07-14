import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { buildOg, BASE } from '@/lib/metadata';
import CoinGuideLayout from '@/components/ui/CoinGuideLayout';
import { COIN_GUIDES } from '@/lib/coinGuides';

type Props = { params: Promise<{ locale: string }> };
const SLUG = 'arbitrum';
const guide = COIN_GUIDES[SLUG];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const isRu = locale === 'ru';
  const title = isRu ? 'Arbitrum (ARB) — История, цена и калькулятор инвестиций' : 'Arbitrum (ARB) — History, Price & Investment Calculator';
  const description = isRu
    ? 'История Arbitrum: от исследовательского проекта Принстона до крупнейшего L2-решения для Ethereum и рекордной раздачи токенов. Калькулятор инвестиций в ARB.'
    : 'The history of Arbitrum: from a Princeton research project to the largest Ethereum L2 and a record-setting token airdrop. ARB investment calculator.';

  return {
    title,
    description,
    keywords: isRu
      ? ['arbitrum история', 'arb токен', 'раздача arbitrum', 'arbitrum калькулятор', 'layer 2 ethereum']
      : ['arbitrum history', 'arb token', 'arbitrum airdrop', 'arbitrum investment calculator', 'ethereum layer 2'],
    openGraph: buildOg({ url: `${BASE}/${locale}/assets/${SLUG}`, title, description, locale }),
    alternates: {
      canonical: `${BASE}/${locale}/assets/${SLUG}`,
      languages: { ru: `${BASE}/ru/assets/${SLUG}`, en: `${BASE}/en/assets/${SLUG}` },
    },
  };
}

export default async function ArbitrumPage({ params }: Props) {
  const { locale } = await params;
  const isRu = locale === 'ru';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: isRu ? 'Arbitrum (ARB): история крупнейшего L2-решения для Ethereum' : "Arbitrum (ARB): History of Ethereum's Largest L2",
    description: isRu ? 'История Arbitrum от Offchain Labs до крупнейшего решения второго уровня.' : 'The history of Arbitrum from Offchain Labs to the largest Layer 2 solution.',
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
      { '@type': 'ListItem', position: 3, name: 'Arbitrum (ARB)', item: `${BASE}/${locale}/assets/${SLUG}` },
    ],
  };

  const glossaryBase = `/${locale}/glossary`;

  const historyContent = isRu ? (
    <>
      <h3>2018–2021: От исследований Принстона до Offchain Labs</h3>
      <p>
        Технология Arbitrum выросла из академических исследований <strong>Эда Фелтена</strong> — бывшего
        профессора компьютерных наук Принстонского университета, который также занимал пост заместителя
        технического директора США при администрации Обамы. Вместе со <strong>Стивеном Голдфедером</strong>{' '}
        и <strong>Гарри Калоднером</strong> он основал компанию <strong>Offchain Labs</strong>, чтобы
        превратить исследования в рабочий продукт. Мейннет Arbitrum One запустился в августе 2021 года.
      </p>

      <h3>Как работает Arbitrum</h3>
      <p>
        Arbitrum — это <Link href={`${glossaryBase}#blockchain`}>решение второго уровня (Layer 2)</Link>{' '}
        типа «оптимистичный роллап» (optimistic rollup): транзакции обрабатываются отдельно от основной
        сети Ethereum, а затем итоговые данные публикуются обратно в Ethereum, что позволяет пользоваться
        безопасностью Ethereum, но с намного меньшими комиссиями.
      </p>

      <h3>Март 2023: Одна из крупнейших раздач токенов в истории DeFi</h3>
      <p>
        23 марта 2023 года Arbitrum выпустил собственный токен <strong>ARB</strong> и раздал около{' '}
        <strong>1,16 млрд токенов</strong> примерно <strong>625 000 кошельков</strong>, которые ранее
        активно пользовались сетью. Из-за низкой начальной ликвидности токен показал крайне высокую
        волатильность в первые часы торгов, прежде чем устаканиться на более стабильных уровнях.
      </p>

      <h3>Сегодня: лидер среди решений второго уровня</h3>
      <p>
        Arbitrum остаётся крупнейшим L2-решением для Ethereum по объёму заблокированных средств,
        принимая у себя сотни децентрализованных приложений.
      </p>
    </>
  ) : (
    <>
      <h3>2018–2021: From Princeton Research to Offchain Labs</h3>
      <p>
        Arbitrum's technology grew out of academic research by <strong>Ed Felten</strong> — a former
        Princeton University computer science professor who also served as the U.S. Deputy Chief
        Technology Officer under the Obama administration. Together with <strong>Steven Goldfeder</strong>{' '}
        and <strong>Harry Kalodner</strong>, he founded <strong>Offchain Labs</strong> to turn the research
        into a working product. The Arbitrum One mainnet launched in August 2021.
      </p>

      <h3>How Arbitrum Works</h3>
      <p>
        Arbitrum is an <Link href={`${glossaryBase}#blockchain`}>Layer 2</Link> solution known as an
        "optimistic rollup": transactions are processed separately from the main Ethereum network, and the
        resulting data is then posted back to Ethereum — letting it benefit from Ethereum's security while
        charging much lower fees.
      </p>

      <h3>March 2023: One of DeFi's Largest Token Airdrops</h3>
      <p>
        On March 23, 2023, Arbitrum launched its own <strong>ARB</strong> token and airdropped roughly{' '}
        <strong>1.16 billion tokens</strong> to about <strong>625,000 wallets</strong> that had previously
        used the network actively. Due to thin initial liquidity, the token showed extreme volatility in
        its first hours of trading before settling into more stable levels.
      </p>

      <h3>Today: A Leader Among Layer 2 Solutions</h3>
      <p>
        Arbitrum remains the largest Ethereum L2 by total value locked, hosting hundreds of decentralized
        applications.
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
        name="Arbitrum"
        symbol="ARB"
        icon="🔷"
        coingeckoId="arbitrum"
        tagline={isRu ? 'Крупнейшее L2-решение для масштабирования Ethereum' : 'The largest Layer 2 scaling solution for Ethereum'}
        historyTitle={isRu ? 'История Arbitrum: от Принстона до крупнейшего L2' : 'Arbitrum History: From Princeton to the Largest L2'}
        historyContent={historyContent}
        guide={guide}
      />
    </>
  );
}
