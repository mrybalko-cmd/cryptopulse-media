import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { buildOg, buildTwitter, BASE } from '@/lib/metadata';
import CoinGuideLayout from '@/components/ui/CoinGuideLayout';
import { COIN_GUIDES } from '@/lib/coinGuides';
import { ORGANIZATION_ID } from '@/lib/organizationSchema';

type Props = { params: Promise<{ locale: string }> };
const SLUG = 'ethereum-classic';
const guide = COIN_GUIDES[SLUG];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const isRu = locale === 'ru';
  const title = isRu ? 'Ethereum Classic (ETC): цена, история, калькулятор' : 'Ethereum Classic (ETC): price, history, calculator';
  const description = isRu
    ? 'Как взлом The DAO в 2016 году расколол Ethereum надвое и почему Ethereum Classic сохранил старую цепочку. Атаки 51%, ограниченный выпуск и калькулятор ETC.'
    : 'How the 2016 DAO hack split Ethereum in two, and why Ethereum Classic kept the old chain. 51% attacks, a fixed supply and an ETC investment calculator.';

  return {
    // Absolute: the layout template appends the site name, which adds nothing here.
    title: { absolute: title },
    description,
    keywords: isRu
      ? ['ethereum classic история', 'etc токен', 'ethereum classic калькулятор', 'ethereum classic цена', 'курс etc']
      : ['ethereum classic history', 'etc token', 'ethereum classic investment calculator', 'ethereum classic price', 'etc price'],
    openGraph: buildOg({ url: `${BASE}/${locale}/assets/${SLUG}`, title, description, locale }),
    twitter: buildTwitter({ url: `${BASE}/${locale}/assets/${SLUG}`, title, description, locale }),
    alternates: {
      canonical: `${BASE}/${locale}/assets/${SLUG}`,
      languages: { ru: `${BASE}/ru/assets/${SLUG}`, en: `${BASE}/en/assets/${SLUG}`, 'x-default': `${BASE}/en/assets/${SLUG}` },
    },
  };
}

export default async function EthereumClassicPage({ params }: Props) {
  const { locale } = await params;
  const isRu = locale === 'ru';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: isRu ? 'Ethereum Classic (ETC): цепочка, которая отказалась откатываться' : 'Ethereum Classic (ETC): the chain that refused to roll back',
    description: isRu ? 'Как взлом The DAO в 2016 году расколол Ethereum надвое и почему Ethereum Classic сохранил старую цепочку. Атаки 51%, ограниченный выпуск и калькулятор ETC.' : 'How the 2016 DAO hack split Ethereum in two, and why Ethereum Classic kept the old chain. 51% attacks, a fixed supply and an ETC investment calculator.',
    inLanguage: locale,
    datePublished: '2026-11-03',
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
      { '@type': 'ListItem', position: 3, name: 'Ethereum Classic (ETC)', item: `${BASE}/${locale}/assets/${SLUG}` },
    ],
  };

  const historyContent = isRu ? (
    <>
      <h3>«Код — это закон»</h3>
      <p>
        Ethereum Classic — тот самый Ethereum, каким он был до июля 2016 года. Когда большинство решило отменить последствия взлома, часть майнеров и пользователей отказалась. По их логике, блокчейн, который переписывают, когда на кону большие деньги, перестаёт быть неизменяемым.
      </p>

      <h3>Взлом The DAO</h3>
      <p>
        В июне 2016 года злоумышленник вывел около 3,6 миллиона эфиров из The DAO, инвестиционного фонда на Ethereum. Сообщество проголосовало вернуть деньги, и 20 июля 2016 года на блоке 1 920 000 Ethereum провёл <Link href={`/${locale}/glossary/hard-fork`}>хардфорк</Link>. Сеть разделилась: новая цепочка стала Ethereum, старая — Ethereum Classic.
      </p>

      <h3>Мишень для атак 51%</h3>
      <p>
        Маленькую сеть дешевле атаковать. В январе 2019 года кто-то получил контроль над большей частью вычислительной мощности ETC и потратил одни и те же монеты дважды. В августе 2020-го атаки повторились трижды за месяц, одна из них переписала больше 4000 блоков, и биржи увеличили число подтверждений для зачисления.
      </p>

      <h3>После перехода Ethereum на стейкинг</h3>
      <p>
        Исторический максимум ETC, <strong>167,09 доллара</strong>, приходится на май 2021 года (CoinGecko). Когда в сентябре 2022 года Ethereum отказался от майнинга, владельцы видеокарт перешли на ETC, который остался на <Link href={`/${locale}/glossary/proof-of-work`}>PoW-майнинге</Link>. Хешрейт за считанные часы обновил рекорд, но цене это не помогло.
      </p>
    </>
  ) : (
    <>
      <h3>The DAO hack</h3>
      <p>
        In June 2016 an attacker drained about 3.6 million ether from The DAO, an investment fund built on Ethereum. Most of the community voted to rewrite history and return the money. At block 1,920,000 on 20 July 2016 Ethereum carried out a <Link href={`/${locale}/glossary/hard-fork`}>hard fork</Link>, and the network split in two.
      </p>

      <h3>“Code is law”</h3>
      <p>
        Miners and users who rejected the fork kept running the old chain, which became Ethereum Classic. They argued that a blockchain which reverses transactions when the stakes are high enough is no longer immutable. ETC kept the original history, hack included.
      </p>

      <h3>A target for 51% attacks</h3>
      <p>
        A smaller network costs less to attack. In January 2019 someone gained control of most of the network’s hashing power and double-spent coins. In August 2020 attackers struck three more times in one month, one attack reorganised more than 4,000 blocks, and exchanges raised their confirmation requirements.
      </p>

      <h3>Life after the Merge</h3>
      <p>
        In May 2021 ETC reached its all-time high of <strong>167.09 dollars</strong> on CoinGecko. When Ethereum moved to proof of stake in September 2022, GPU miners came to ETC, which kept <Link href={`/${locale}/glossary/proof-of-work`}>PoW mining</Link>, and its hashrate hit a record within hours. The price went the other way and fell after the Merge.
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
        name="Ethereum Classic"
        symbol="ETC"
        icon="ξ"
        coingeckoId="ethereum-classic"
        tagline={isRu ? 'Исходная цепочка Ethereum, которая не стала отменять взлом' : 'The original Ethereum chain that refused to reverse a hack'}
        historyTitle={isRu ? 'История Ethereum Classic: взлом The DAO и раскол' : 'Ethereum Classic history: the DAO hack and the split'}
        historyContent={historyContent}
        guide={guide}
      />
    </>
  );
}
