import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { buildOg, BASE } from '@/lib/metadata';
import CoinGuideLayout from '@/components/ui/CoinGuideLayout';
import { COIN_GUIDES } from '@/lib/coinGuides';

type Props = { params: Promise<{ locale: string }> };
const SLUG = 'bch';
const guide = COIN_GUIDES[SLUG];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const isRu = locale === 'ru';
  const title = isRu ? 'Bitcoin Cash (BCH) — История, цена и калькулятор инвестиций' : 'Bitcoin Cash (BCH) — History, Price & Investment Calculator';
  const description = isRu
    ? 'История Bitcoin Cash: спор о размере блока, форк от Bitcoin в 2017 году и дальнейший раскол на Bitcoin SV. Калькулятор инвестиций в BCH.'
    : 'The history of Bitcoin Cash: the block size debate, the 2017 fork from Bitcoin, and the later split into Bitcoin SV. BCH investment calculator.';

  return {
    title,
    description,
    keywords: isRu
      ? ['bitcoin cash история', 'bch токен', 'форк биткоина', 'bitcoin cash калькулятор', 'roger ver']
      : ['bitcoin cash history', 'bch token', 'bitcoin fork', 'bitcoin cash investment calculator', 'roger ver'],
    openGraph: buildOg({ url: `${BASE}/${locale}/assets/${SLUG}`, title, description, locale }),
    alternates: {
      canonical: `${BASE}/${locale}/assets/${SLUG}`,
      languages: { ru: `${BASE}/ru/assets/${SLUG}`, en: `${BASE}/en/assets/${SLUG}` },
    },
  };
}

export default async function BchPage({ params }: Props) {
  const { locale } = await params;
  const isRu = locale === 'ru';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: isRu ? 'Bitcoin Cash (BCH): история форка из-за спора о размере блока' : 'Bitcoin Cash (BCH): History of the Block Size Debate Fork',
    description: isRu ? 'История Bitcoin Cash от форка Bitcoin в 2017 году до сегодняшнего дня.' : 'The history of Bitcoin Cash from its 2017 fork from Bitcoin to today.',
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
      { '@type': 'ListItem', position: 3, name: 'Bitcoin Cash (BCH)', item: `${BASE}/${locale}/assets/${SLUG}` },
    ],
  };

  const glossaryBase = `/${locale}/glossary`;

  const historyContent = isRu ? (
    <>
      <h3>2015–2017: Спор о масштабировании Bitcoin</h3>
      <p>
        К середине 2010-х сеть Bitcoin столкнулась с растущей нагрузкой: блоки размером 1 МБ уже не
        справлялись с потоком транзакций, из-за чего комиссии росли, а подтверждения замедлялись. В
        сообществе разгорелся спор о том, как решать проблему: одни предлагали увеличить размер блока,
        другие — внедрить{' '}
        <Link href={`${glossaryBase}#soft-fork`}>софт-форк</Link> SegWit и решения второго уровня, не
        трогая базовый протокол.
      </p>

      <h3>1 августа 2017: Хард-форк и рождение Bitcoin Cash</h3>
      <p>
        Не сумев достичь согласия с остальной частью сообщества, сторонники больших блоков —
        среди них известный ранний инвестор <strong>Роджер Вер</strong>, глава Bitmain <strong>Цзихан
        У</strong> и бывший ведущий разработчик Bitcoin <strong>Гэвин Андресен</strong> — провели{' '}
        <Link href={`${glossaryBase}#hard-fork`}>хард-форк</Link> 1 августа 2017 года на блоке 478 559,
        увеличив лимит размера блока до 8 МБ (позже — до 32 МБ). Каждый, кто владел BTC на тот момент,
        автоматически получил равное количество новой монеты — Bitcoin Cash.
      </p>

      <h3>Декабрь 2017: Пик цены на общем рыночном ралли</h3>
      <p>
        На фоне общего крипто-бума конца 2017 года Bitcoin Cash достиг исторического максимума около{' '}
        <strong>$4 355</strong> 20 декабря 2017 года.
      </p>

      <h3>2018: Новый раскол — рождение Bitcoin SV</h3>
      <p>
        Разногласия не закончились с одним форком: в ноябре 2018 года само сообщество Bitcoin Cash
        разделилось из-за спора о дальнейшем направлении развития, что привело к появлению ещё одной
        монеты — <strong>Bitcoin SV (BSV)</strong>, которую продвигала фракция во главе с Крейгом Райтом.
      </p>
    </>
  ) : (
    <>
      <h3>2015–2017: Bitcoin's Scaling Debate</h3>
      <p>
        By the mid-2010s, the Bitcoin network was straining under growing load: 1 MB blocks could no
        longer keep up with transaction volume, driving fees up and confirmations slower. A dispute
        erupted in the community over how to fix it: some proposed increasing the block size, others
        wanted to adopt the SegWit{' '}
        <Link href={`${glossaryBase}#soft-fork`}>soft fork</Link> and Layer 2 solutions without touching
        the base protocol.
      </p>

      <h3>August 1, 2017: The Hard Fork and Bitcoin Cash's Birth</h3>
      <p>
        Unable to reach agreement with the rest of the community, big-block proponents — including early
        investor <strong>Roger Ver</strong>, Bitmain's <strong>Jihan Wu</strong>, and former Bitcoin lead
        developer <strong>Gavin Andresen</strong> — carried out a{' '}
        <Link href={`${glossaryBase}#hard-fork`}>hard fork</Link> on August 1, 2017, at block 478,559,
        raising the block size limit to 8 MB (later 32 MB). Anyone holding BTC at that moment automatically
        received an equal amount of the new coin, Bitcoin Cash.
      </p>

      <h3>December 2017: A Price Peak Amid the Broader Rally</h3>
      <p>
        Amid the broader crypto boom of late 2017, Bitcoin Cash reached an all-time high of roughly{' '}
        <strong>$4,355</strong> on December 20, 2017.
      </p>

      <h3>2018: Another Split — Bitcoin SV Is Born</h3>
      <p>
        The disagreements didn't end with one fork: in November 2018, the Bitcoin Cash community itself
        split over the project's future direction, leading to yet another coin —{' '}
        <strong>Bitcoin SV (BSV)</strong>, championed by a faction led by Craig Wright.
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
        name="Bitcoin Cash"
        symbol="BCH"
        icon="Ƀ"
        coingeckoId="bitcoin-cash"
        tagline={isRu ? 'Форк Bitcoin 2017 года, сделавший ставку на большие блоки' : 'The 2017 Bitcoin fork that bet on bigger blocks'}
        historyTitle={isRu ? 'История Bitcoin Cash: спор о масштабировании и форк' : 'Bitcoin Cash History: The Scaling Debate and the Fork'}
        historyContent={historyContent}
        guide={guide}
      />
    </>
  );
}
