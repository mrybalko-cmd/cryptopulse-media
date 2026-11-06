import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { buildOg, buildTwitter, BASE } from '@/lib/metadata';
import CoinGuideLayout from '@/components/ui/CoinGuideLayout';
import { COIN_GUIDES } from '@/lib/coinGuides';
import { ORGANIZATION_ID } from '@/lib/organizationSchema';

import { ASSET_REVISIONS } from '@/lib/pageRevisions';
type Props = { params: Promise<{ locale: string }> };
const SLUG = 'hedera';
const guide = COIN_GUIDES[SLUG];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const isRu = locale === 'ru';
  const title = isRu ? 'Hedera (HBAR): цена, история, калькулятор' : 'Hedera (HBAR): price, history, calculator';
  const description = isRu
    ? 'Как Hedera построила публичную сеть на хэшграфе вместо блокчейна и посадила в свой совет Google, IBM и Boeing. История HBAR и калькулятор вложений.'
    : 'How Hedera built a public network on hashgraph instead of a blockchain and put Google, IBM and Boeing on its council. HBAR history and an investment calculator.';

  return {
    // Absolute: the layout template appends the site name, which adds nothing here.
    title: { absolute: title },
    description,
    keywords: isRu
      ? ['hedera история', 'hbar токен', 'hedera калькулятор', 'hedera цена', 'курс hbar']
      : ['hedera history', 'hbar token', 'hedera investment calculator', 'hedera price', 'hbar price'],
    openGraph: buildOg({ url: `${BASE}/${locale}/assets/${SLUG}`, title, description, locale }),
    twitter: buildTwitter({ url: `${BASE}/${locale}/assets/${SLUG}`, title, description, locale }),
    alternates: {
      canonical: `${BASE}/${locale}/assets/${SLUG}`,
      languages: { ru: `${BASE}/ru/assets/${SLUG}`, en: `${BASE}/en/assets/${SLUG}`, 'x-default': `${BASE}/en/assets/${SLUG}` },
    },
  };
}

export default async function HederaPage({ params }: Props) {
  const { locale } = await params;
  const isRu = locale === 'ru';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: isRu ? 'Hedera (HBAR): публичная сеть под управлением корпораций' : 'Hedera (HBAR): a public network run by a corporate council',
    description: isRu ? 'Как Hedera построила публичную сеть на хэшграфе вместо блокчейна и посадила в свой совет Google, IBM и Boeing. История HBAR и калькулятор вложений.' : 'How Hedera built a public network on hashgraph instead of a blockchain and put Google, IBM and Boeing on its council. HBAR history and an investment calculator.',
    inLanguage: locale,
    datePublished: '2026-11-02',
    dateModified: ASSET_REVISIONS[SLUG] ?? '2026-11-02',
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
      { '@type': 'ListItem', position: 3, name: 'Hedera (HBAR)', item: `${BASE}/${locale}/assets/${SLUG}` },
    ],
  };

  const historyContent = isRu ? (
    <>
      <h3>Google и IBM вместо анонимных валидаторов</h3>
      <p>
        Управляет Hedera совет крупных организаций, в разное время в него входили Google, IBM, Boeing и Deutsche Telekom. Каждый участник держит <Link href={`/${locale}/glossary/node`}>узел</Link> сети и голосует за изменения. Корпоративные клиенты получают известных операторов, а критики — повод называть сеть централизованной.
      </p>

      <h3>Хэшграф вместо блоков</h3>
      <p>
        Алгоритм хэшграфа <strong>Лимон Бэрд</strong> описал в 2016 году. Узлы передают друг другу сведения о транзакциях в случайном порядке, и по этой истории каждый узел сам вычисляет порядок событий, без майнеров и блоков. Вместе с <strong>Мансом Хармоном</strong> Бэрд превратил алгоритм в Hedera.
      </p>

      <h3>Открытие сети и пик 2021 года</h3>
      <p>
        Для всех желающих сеть открылась в сентябре 2019 года. Выпуск HBAR зафиксирован на 50 миллиардах, в обращении около 44 миллиардов. Исторический максимум, 0,569 доллара, токен поставил 15 сентября 2021 года на общем подъёме рынка.
      </p>

      <h3>Код ушёл в Linux Foundation</h3>
      <p>
        Hedera открыла исходный код, а в 2024 году передала его Linux Foundation, где он развивается как проект Hiero. Теперь предлагать изменения через фонд могут и разработчики вне совета.
      </p>
    </>
  ) : (
    <>
      <h3>Hashgraph instead of blocks</h3>
      <p>
        <strong>Leemon Baird</strong> described hashgraph in 2016. Nodes in a hashgraph pass information about transactions to each other at random, and every node can work out the order of events from that record, without miners or blocks. Baird and <strong>Mance Harmon</strong> turned the algorithm into Hedera.
      </p>

      <h3>A council in place of anonymous validators</h3>
      <p>
        Hedera handed control to a governing council of large organisations, and members have included Google, IBM, Boeing and Deutsche Telekom. Each member runs a <Link href={`/${locale}/glossary/node`}>node</Link> and votes on changes. That design gives corporate users known operators and gives critics grounds to call the network centralised.
      </p>

      <h3>2019: open access and a peak in 2021</h3>
      <p>
        The network opened to the public in September 2019. HBAR has a fixed supply of 50 billion tokens, and about 44 billion are in circulation. The price reached its all-time high of 0.569 dollars on 15 September 2021, in the same rally that lifted most of the market.
      </p>

      <h3>The code goes to the Linux Foundation</h3>
      <p>
        Hedera opened its source code and in 2024 handed it to the Linux Foundation, where it continues as the Hiero project. Developers outside the council can now propose changes through the foundation.
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
        name="Hedera"
        symbol="HBAR"
        icon="ℏ"
        coingeckoId="hedera-hashgraph"
        tagline={isRu ? 'Публичная сеть под управлением совета корпораций' : 'A public network governed by a council of corporations'}
        historyTitle={isRu ? 'История Hedera: хэшграф и управляющий совет' : 'Hedera history: hashgraph and its governing council'}
        historyContent={historyContent}
        guide={guide}
      />
    </>
  );
}
