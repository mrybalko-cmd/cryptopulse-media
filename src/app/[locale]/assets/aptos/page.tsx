import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { buildOg, BASE } from '@/lib/metadata';
import CoinGuideLayout from '@/components/ui/CoinGuideLayout';
import { COIN_GUIDES } from '@/lib/coinGuides';

type Props = { params: Promise<{ locale: string }> };
const SLUG = 'aptos';
const guide = COIN_GUIDES[SLUG];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const isRu = locale === 'ru';
  const title = isRu ? 'Aptos (APT) — История, цена и калькулятор инвестиций' : 'Aptos (APT) — History, Price & Investment Calculator';
  const description = isRu
    ? 'История Aptos: от закрытого проекта Meta Diem до независимого L1-блокчейна на языке Move. Калькулятор инвестиций в APT.'
    : "The history of Aptos: from Meta's shuttered Diem project to an independent Move-language L1. APT investment calculator.";

  return {
    title,
    description,
    keywords: isRu
      ? ['aptos история', 'apt токен', 'aptos калькулятор', 'meta diem', 'move язык программирования']
      : ['aptos history', 'apt token', 'aptos investment calculator', 'meta diem', 'move programming language'],
    openGraph: buildOg({ url: `${BASE}/${locale}/assets/${SLUG}`, title, description, locale }),
    alternates: {
      canonical: `${BASE}/${locale}/assets/${SLUG}`,
      languages: { ru: `${BASE}/ru/assets/${SLUG}`, en: `${BASE}/en/assets/${SLUG}` },
    },
  };
}

export default async function AptosPage({ params }: Props) {
  const { locale } = await params;
  const isRu = locale === 'ru';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: isRu ? 'Aptos (APT): история блокчейна, выросшего из проекта Meta Diem' : "Aptos (APT): History of the Blockchain That Grew Out of Meta's Diem",
    description: isRu ? 'История Aptos от закрытия Diem до независимого блокчейна.' : "The history of Aptos from Diem's shutdown to an independent blockchain.",
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
      { '@type': 'ListItem', position: 3, name: 'Aptos (APT)', item: `${BASE}/${locale}/assets/${SLUG}` },
    ],
  };

  const glossaryBase = `/${locale}/glossary`;

  const historyContent = isRu ? (
    <>
      <h3>Наследие Diem: вторая жизнь закрытого проекта Meta</h3>
      <p>
        Как и Sui, Aptos родился из обломков <strong>Diem</strong> (ранее Libra) — амбициозной, но
        закрытой в 2022 году под давлением регуляторов криптовалюты Facebook (Meta). Основатели Aptos,{' '}
        <strong>Мо Шейх</strong> и <strong>Эйвери Чинг</strong>, оба ранее работали в Meta именно над
        Diem. После закрытия проекта они использовали часть его технологического наследия, включая язык
        программирования <strong>Move</strong>, чтобы построить независимый публичный{' '}
        <Link href={`${glossaryBase}#blockchain`}>блокчейн</Link>.
      </p>

      <h3>Октябрь 2022: Запуск мейннета на фоне контроверзы</h3>
      <p>
        Генезис-блок Aptos был создан 12 октября 2022 года, а публичный мейннет объявлен 18 октября.
        Токен начал торговаться на крупных биржах, включая Binance, Coinbase и FTX, 19 октября 2022 года
        по цене около $8,50–10 — запуск сопровождался спорами о непрозрачном распределении токенов
        среди инвесторов на раннем этапе.
      </p>

      <h3>Январь 2023: Исторический максимум</h3>
      <p>
        Несмотря на споры вокруг запуска, токен APT вырос до исторического максимума около{' '}
        <strong>$20,39</strong> уже 26 января 2023 года — менее чем через четыре месяца после старта
        сети.
      </p>

      <h3>Aptos и Sui: конкурирующие «наследники» одного проекта</h3>
      <p>
        Aptos и Sui часто сравнивают именно потому, что оба проекта выросли из одной и той же команды и
        технологии Diem/Libra и используют язык Move для смарт-контрактов — хотя технически они
        развивались как полностью независимые, конкурирующие блокчейны первого уровня.
      </p>
    </>
  ) : (
    <>
      <h3>Diem's Legacy: A Second Life for Meta's Shuttered Project</h3>
      <p>
        Like Sui, Aptos was born from the wreckage of <strong>Diem</strong> (formerly Libra) — Facebook's
        (Meta's) ambitious cryptocurrency, shut down in 2022 under regulatory pressure. Aptos's founders,{' '}
        <strong>Mo Shaikh</strong> and <strong>Avery Ching</strong>, both previously worked at Meta
        specifically on Diem. After the project was shut down, they took part of its technical legacy,
        including the <strong>Move</strong> programming language, to build an independent public{' '}
        <Link href={`${glossaryBase}#blockchain`}>blockchain</Link>.
      </p>

      <h3>October 2022: A Controversial Mainnet Launch</h3>
      <p>
        Aptos's genesis block was created on October 12, 2022, with the public mainnet announced on
        October 18. The token began trading on major exchanges including Binance, Coinbase, and FTX on
        October 19, 2022, at around $8.50–10 — the launch was accompanied by controversy over the
        opaque early-stage token distribution among investors.
      </p>

      <h3>January 2023: An All-Time High</h3>
      <p>
        Despite the controversy surrounding its launch, APT climbed to an all-time high of roughly{' '}
        <strong>$20.39</strong> on January 26, 2023 — less than four months after the network launched.
      </p>

      <h3>Aptos and Sui: Competing "Heirs" to the Same Project</h3>
      <p>
        Aptos and Sui are frequently compared precisely because both projects grew out of the same team
        and Diem/Libra technology and both use the Move language for smart contracts — though technically
        they've developed as fully independent, competing Layer 1 blockchains.
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
        name="Aptos"
        symbol="APT"
        icon="🅰"
        coingeckoId="aptos"
        tagline={isRu ? 'L1 на языке Move, выросший из закрытого проекта Meta Diem' : "A Move-language L1 that grew out of Meta's shuttered Diem project"}
        historyTitle={isRu ? 'История Aptos: от Diem до независимого блокчейна' : 'Aptos History: From Diem to an Independent Blockchain'}
        historyContent={historyContent}
        guide={guide}
      />
    </>
  );
}
