import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { buildOg, BASE } from '@/lib/metadata';
import CoinGuideLayout from '@/components/ui/CoinGuideLayout';
import { COIN_GUIDES } from '@/lib/coinGuides';

type Props = { params: Promise<{ locale: string }> };
const SLUG = 'cosmos';
const guide = COIN_GUIDES[SLUG];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const isRu = locale === 'ru';
  const title = isRu ? 'Cosmos (ATOM) — История, цена и калькулятор инвестиций' : 'Cosmos (ATOM) — History, Price & Investment Calculator';
  const description = isRu
    ? 'История Cosmos: от идеи «интернета блокчейнов» Джея Квона до сети независимых цепей, соединённых протоколом IBC. Калькулятор инвестиций в ATOM.'
    : 'The history of Cosmos: from Jae Kwon\'s "Internet of Blockchains" idea to a network of independent chains connected by the IBC protocol. ATOM investment calculator.';

  return {
    title,
    description,
    keywords: isRu
      ? ['cosmos история', 'atom токен', 'интернет блокчейнов', 'cosmos калькулятор', 'ibc протокол']
      : ['cosmos history', 'atom token', 'internet of blockchains', 'cosmos investment calculator', 'ibc protocol'],
    openGraph: buildOg({ url: `${BASE}/${locale}/assets/${SLUG}`, title, description, locale }),
    alternates: {
      canonical: `${BASE}/${locale}/assets/${SLUG}`,
      languages: { ru: `${BASE}/ru/assets/${SLUG}`, en: `${BASE}/en/assets/${SLUG}` },
    },
  };
}

export default async function CosmosPage({ params }: Props) {
  const { locale } = await params;
  const isRu = locale === 'ru';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: isRu ? 'Cosmos (ATOM): история «интернета блокчейнов»' : 'Cosmos (ATOM): History of the "Internet of Blockchains"',
    description: isRu ? 'История Cosmos от уайтпейпера до сети независимых блокчейнов.' : 'The history of Cosmos from whitepaper to a network of independent blockchains.',
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
      { '@type': 'ListItem', position: 3, name: 'Cosmos (ATOM)', item: `${BASE}/${locale}/assets/${SLUG}` },
    ],
  };

  const glossaryBase = `/${locale}/glossary`;

  const historyContent = isRu ? (
    <>
      <h3>2014–2016: От Tendermint к уайтпейперу Cosmos</h3>
      <p>
        История Cosmos начинается в 2014 году, когда <strong>Джей Квон (Jae Kwon)</strong> основал компанию{' '}
        <strong>Tendermint</strong> для разработки алгоритма консенсуса, который позволял бы независимым{' '}
        <Link href={`${glossaryBase}#blockchain`}>блокчейнам</Link> достигать согласия быстрее и эффективнее,
        чем классический Proof-of-Work Bitcoin. В 2016 году Квон вместе с <strong>Итаном Бьюкененом (Ethan
        Buchman)</strong> опубликовал уайтпейпер Cosmos, описывающий видение «<strong>интернета
        блокчейнов</strong>» — сети независимых, но взаимосвязанных цепей.
      </p>

      <h3>2017: Одно из самых быстрых ICO в истории</h3>
      <p>
        В апреле 2017 года команда Cosmos провела ICO и собрала <strong>$17 млн менее чем за 30
        минут</strong> — сбор средств пришлось остановить досрочно из-за огромного спроса. Это стало одним
        из самых заметных ICO своего времени.
      </p>

      <h3>2019: Запуск мейннета и рождение экосистемы</h3>
      <p>
        Основная сеть Cosmos Hub заработала в марте 2019 года. С этого момента вокруг Cosmos SDK — набора
        инструментов для создания собственных блокчейнов — начала расти целая экосистема независимых
        проектов, включая Binance Chain, Osmosis и Terra (до её краха в 2022 году).
      </p>
      <p>
        В 2020 году Джей Квон покинул пост генерального директора Interchain Foundation на фоне
        внутренних разногласий, оставшись главным архитектором технологии, а руководство перешло к Пенгу
        Чжуну.
      </p>

      <h3>2021–2022: Протокол IBC и пик цены</h3>
      <p>
        Ключевым технологическим достижением стал протокол <strong>IBC (Inter-Blockchain
        Communication)</strong>, позволивший разным блокчейнам на базе Cosmos SDK обмениваться токенами и
        данными напрямую. На фоне общего бычьего рынка ATOM достиг исторического максимума около{' '}
        <strong>$44,70</strong> в январе 2022 года.
      </p>
    </>
  ) : (
    <>
      <h3>2014–2016: From Tendermint to the Cosmos Whitepaper</h3>
      <p>
        Cosmos's story starts in 2014, when <strong>Jae Kwon</strong> founded <strong>Tendermint</strong> to
        develop a consensus algorithm that would let independent{' '}
        <Link href={`${glossaryBase}#blockchain`}>blockchains</Link> reach agreement faster and more
        efficiently than Bitcoin's classic Proof-of-Work. In 2016, Kwon and{' '}
        <strong>Ethan Buchman</strong> published the Cosmos whitepaper, describing a vision for an{' '}
        <strong>"Internet of Blockchains"</strong> — a network of independent, interconnected chains.
      </p>

      <h3>2017: One of the Fastest ICOs in History</h3>
      <p>
        In April 2017, the Cosmos team held an ICO and raised <strong>$17 million in under 30
        minutes</strong> — the fundraise had to be cut short due to overwhelming demand. It became one of
        the most notable ICOs of its time.
      </p>

      <h3>2019: Mainnet Launch and an Ecosystem Is Born</h3>
      <p>
        The main Cosmos Hub network went live in March 2019. From that point on, a whole ecosystem of
        independent projects grew around the Cosmos SDK — a toolkit for building custom blockchains —
        including Binance Chain, Osmosis, and Terra (before its 2022 collapse).
      </p>
      <p>
        In 2020, Jae Kwon stepped down as CEO of the Interchain Foundation amid internal disagreements,
        remaining the technology's principal architect, while leadership passed to Peng Zhong.
      </p>

      <h3>2021–2022: The IBC Protocol and a Price Peak</h3>
      <p>
        A key technical milestone was the <strong>IBC (Inter-Blockchain Communication)</strong> protocol,
        which let different Cosmos SDK-based blockchains exchange tokens and data directly. Amid the
        broader bull market, ATOM reached an all-time high of roughly <strong>$44.70</strong> in January
        2022.
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
        name="Cosmos"
        symbol="ATOM"
        icon="⚛"
        coingeckoId="cosmos"
        tagline={isRu ? '«Интернет блокчейнов» — сеть независимых, но взаимосвязанных цепей' : 'The "Internet of Blockchains" — a network of independent, interconnected chains'}
        historyTitle={isRu ? 'История Cosmos: от уайтпейпера до «интернета блокчейнов»' : 'Cosmos History: From Whitepaper to the "Internet of Blockchains"'}
        historyContent={historyContent}
        guide={guide}
      />
    </>
  );
}
