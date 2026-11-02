import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { buildOg, buildTwitter, BASE } from '@/lib/metadata';
import CoinGuideLayout from '@/components/ui/CoinGuideLayout';
import { COIN_GUIDES } from '@/lib/coinGuides';
import { ORGANIZATION_ID } from '@/lib/organizationSchema';

type Props = { params: Promise<{ locale: string }> };
const SLUG = 'hyperliquid';
const guide = COIN_GUIDES[SLUG];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const isRu = locale === 'ru';
  const title = isRu ? 'Hyperliquid (HYPE): цена, история, калькулятор' : 'Hyperliquid (HYPE): price, history, calculator';
  const description = isRu
    ? 'Как биржа без венчурных денег раздала 31% своего токена и вошла в первую пятнадцатку. Аирдроп HYPE, обратный выкуп и история с JELLY, плюс калькулятор.'
    : 'How a self-funded futures exchange gave away 31% of its token and reached the top 15. The HYPE airdrop, buybacks and the JELLY incident, plus a calculator.';

  return {
    // Absolute: the layout template appends the site name, which adds nothing here.
    title: { absolute: title },
    description,
    keywords: isRu
      ? ['hyperliquid история', 'hype токен', 'hyperliquid калькулятор', 'hyperliquid цена', 'курс hype']
      : ['hyperliquid history', 'hype token', 'hyperliquid investment calculator', 'hyperliquid price', 'hype price'],
    openGraph: buildOg({ url: `${BASE}/${locale}/assets/${SLUG}`, title, description, locale }),
    twitter: buildTwitter({ url: `${BASE}/${locale}/assets/${SLUG}`, title, description, locale }),
    alternates: {
      canonical: `${BASE}/${locale}/assets/${SLUG}`,
      languages: { ru: `${BASE}/ru/assets/${SLUG}`, en: `${BASE}/en/assets/${SLUG}`, 'x-default': `${BASE}/en/assets/${SLUG}` },
    },
  };
}

export default async function HyperliquidPage({ params }: Props) {
  const { locale } = await params;
  const isRu = locale === 'ru';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: isRu ? 'Hyperliquid (HYPE): биржа, которая обошлась без инвесторов' : 'Hyperliquid (HYPE): the exchange that funded itself',
    description: isRu ? 'Как биржа без венчурных денег раздала 31% своего токена и вошла в первую пятнадцатку. Аирдроп HYPE, обратный выкуп и история с JELLY, плюс калькулятор.' : 'How a self-funded futures exchange gave away 31% of its token and reached the top 15. The HYPE airdrop, buybacks and the JELLY incident, plus a calculator.',
    inLanguage: locale,
    datePublished: '2026-11-02',
    dateModified: new Date().toISOString().slice(0, 10),
    author: { '@id': ORGANIZATION_ID },
    publisher: { '@id': ORGANIZATION_ID },
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
      { '@type': 'ListItem', position: 3, name: 'Hyperliquid (HYPE)', item: `${BASE}/${locale}/assets/${SLUG}` },
    ],
  };

  const historyContent = isRu ? (
    <>
      <h3>Аирдроп в 31%</h3>
      <p>
        29 ноября 2024 года Hyperliquid выпустила токен HYPE и раздала <strong>310 миллионов</strong> монет, 31% из миллиарда, тем, кто торговал на бирже. Обычный <Link href={`/${locale}/glossary/airdrop`}>аирдроп</Link> раздаёт 5–15%. Торги открылись на отметке 3,81 доллара, это до сих пор минимум HYPE, а уже за первые сутки цена перевалила за 6 долларов.
      </p>

      <h3>Трейдер строит биржу</h3>
      <p>
        Hyperliquid основал в 2022 году <strong>Джефф Янь</strong>, до этого работавший в высокочастотной трейдинговой фирме Hudson River Trading. Команда сделала собственный <Link href={`/${locale}/glossary/blockchain`}>блокчейн</Link> под одну задачу: фьючерсную биржу с <Link href={`/${locale}/glossary/order-book`}>книгой заявок</Link>, которая работает целиком в сети и по скорости не уступает централизованным. Венчурных денег проект не брал.
      </p>

      <h3>Выкуп на комиссии</h3>
      <p>
        Большую часть торговых комиссий биржа отправляет в фонд, который покупает HYPE на рынке. Чем активнее торгуют, тем больше токенов скупает фонд.
      </p>

      <h3>Проверка JELLY</h3>
      <p>
        В марте 2025 года трейдер разогнал цену мелкого токена JELLY, чтобы ударить по хранилищу ликвидности биржи. Валидаторы сняли JELLY с торгов и закрыли позиции по более ранней цене: хранилище уцелело, но вопросов о децентрализации биржи стало больше. HYPE продолжил расти и 23 сентября 2026 года обновил максимум, 97,96 доллара.
      </p>
    </>
  ) : (
    <>
      <h3>A trader builds an exchange</h3>
      <p>
        <strong>Jeff Yan</strong>, who traded at the high-frequency firm Hudson River Trading, started Hyperliquid in 2022. The team built its own <Link href={`/${locale}/glossary/blockchain`}>blockchain</Link> for one job: a futures exchange with an <Link href={`/${locale}/glossary/order-book`}>order book</Link> that runs on-chain and feels as fast as a centralised one. It raised no venture money.
      </p>

      <h3>November 2024: 31% to the users</h3>
      <p>
        On 29 November 2024 Hyperliquid launched HYPE and sent <strong>310 million tokens</strong>, 31% of the billion-token supply, to people who had used the exchange. Typical <Link href={`/${locale}/glossary/airdrop`}>airdrops</Link> give out 5% to 15%. HYPE opened at 3.81 dollars, its lowest price on record, and passed 6 dollars within a day.
      </p>

      <h3>Buybacks from fees</h3>
      <p>
        The exchange sends most of its trading fees to an assistance fund that buys HYPE on the market. The more you and other traders trade, the more tokens the fund buys.
      </p>

      <h3>The JELLY test</h3>
      <p>
        In March 2025 a trader pushed the price of the small JELLY token to squeeze the exchange’s liquidity vault. Validators delisted JELLY and settled positions at an earlier price, which protected the vault and raised questions about how decentralised the exchange is. HYPE kept climbing and reached its all-time high of 97.96 dollars on 23 September 2026.
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
        name="Hyperliquid"
        symbol="HYPE"
        icon="Ⓗ"
        coingeckoId="hyperliquid"
        tagline={isRu ? 'Фьючерсная биржа на собственном блокчейне' : 'A futures exchange that runs on its own blockchain'}
        historyTitle={isRu ? 'История Hyperliquid: биржа без венчурных денег' : 'Hyperliquid history: an exchange with no venture money'}
        historyContent={historyContent}
        guide={guide}
      />
    </>
  );
}
