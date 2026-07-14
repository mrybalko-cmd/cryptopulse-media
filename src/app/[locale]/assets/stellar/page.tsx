import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { buildOg, BASE } from '@/lib/metadata';
import CoinGuideLayout from '@/components/ui/CoinGuideLayout';
import { COIN_GUIDES } from '@/lib/coinGuides';

type Props = { params: Promise<{ locale: string }> };
const SLUG = 'stellar';
const guide = COIN_GUIDES[SLUG];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const isRu = locale === 'ru';
  const title = isRu ? 'Stellar (XLM) — История, цена и калькулятор инвестиций' : 'Stellar (XLM) — History, Price & Investment Calculator';
  const description = isRu
    ? 'История Stellar: от разрыва Джеда Маккалеба с Ripple до сети для дешёвых международных платежей и токенизации активов. Калькулятор инвестиций в XLM.'
    : 'The history of Stellar: from Jed McCaleb\'s split with Ripple to a network for cheap cross-border payments and asset tokenization. XLM investment calculator.';

  return {
    title,
    description,
    keywords: isRu
      ? ['stellar история', 'xlm токен', 'jed mccaleb', 'stellar калькулятор', 'xlm vs xrp']
      : ['stellar history', 'xlm token', 'jed mccaleb', 'stellar investment calculator', 'xlm vs xrp'],
    openGraph: buildOg({ url: `${BASE}/${locale}/assets/${SLUG}`, title, description, locale }),
    alternates: {
      canonical: `${BASE}/${locale}/assets/${SLUG}`,
      languages: { ru: `${BASE}/ru/assets/${SLUG}`, en: `${BASE}/en/assets/${SLUG}` },
    },
  };
}

export default async function StellarPage({ params }: Props) {
  const { locale } = await params;
  const isRu = locale === 'ru';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: isRu ? 'Stellar (XLM): история сети для дешёвых международных платежей' : 'Stellar (XLM): History of the Cheap Cross-Border Payments Network',
    description: isRu ? 'История Stellar от основания Джедом Маккалебом до токенизации активов.' : "The history of Stellar from Jed McCaleb's founding to asset tokenization.",
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
      { '@type': 'ListItem', position: 3, name: 'Stellar (XLM)', item: `${BASE}/${locale}/assets/${SLUG}` },
    ],
  };

  const glossaryBase = `/${locale}/glossary`;

  const historyContent = isRu ? (
    <>
      <h3>2014: Основание после ухода из Ripple</h3>
      <p>
        Stellar основал в 2014 году <strong>Джед Маккалеб (Jed McCaleb)</strong> — фигура с уникальной
        историей в криптомире: он ранее основал биржу Mt. Gox (позже проданную и обанкротившуюся уже без
        него) и был одним из создателей Ripple. Разойдясь с командой Ripple во взглядах на развитие
        проекта, Маккалеб вместе с юристом <strong>Джойс Ким (Joyce Kim)</strong> запустил Stellar как
        некоммерческую инициативу — Stellar Development Foundation.
      </p>

      <h3>2015: Запуск сети и ранний рост</h3>
      <p>
        Сеть Stellar заработала в апреле 2015 года. Изначально протокол во многом опирался на код Ripple,
        но со временем Stellar развил собственную архитектуру консенсуса (Stellar Consensus Protocol),
        отличную от <Link href={`${glossaryBase}#proof-of-work`}>Proof-of-Work</Link> Bitcoin.
      </p>

      <h3>2018: Пик цены на волне общего крипто-бума</h3>
      <p>
        На фоне общего рыночного безумия конца 2017 — начала 2018 года XLM закрыл 2017 год с ростом более{' '}
        <strong>14 000%</strong> и достиг исторического максимума около <strong>$0,94</strong> в начале
        января 2018 года.
      </p>

      <h3>2019 и далее: партнёрства и токенизация реальных активов</h3>
      <p>
        В 2019 году Stellar заключил партнёрство с <strong>IBM</strong> (проект World Wire) для
        международных платежей между банками. В последующие годы фокус сместился на{' '}
        <strong>токенизацию реальных активов (RWA)</strong> — например, партнёрство с управляющей
        компанией Franklin Templeton по выпуску токенизированного фонда денежного рынка прямо в сети
        Stellar, что сделало проект одним из пионеров этого направления среди публичных блокчейнов.
      </p>
    </>
  ) : (
    <>
      <h3>2014: Founded After Leaving Ripple</h3>
      <p>
        Stellar was founded in 2014 by <strong>Jed McCaleb</strong> — a figure with a uniquely storied
        crypto history: he previously founded the Mt. Gox exchange (later sold and only went bankrupt after
        he left) and was one of Ripple's co-founders. After parting ways with the Ripple team over the
        project's direction, McCaleb launched Stellar together with lawyer <strong>Joyce Kim</strong> as a
        non-profit initiative — the Stellar Development Foundation.
      </p>

      <h3>2015: Network Launch and Early Growth</h3>
      <p>
        The Stellar network went live in April 2015. The protocol initially relied heavily on Ripple's
        codebase, but over time Stellar developed its own consensus architecture (the Stellar Consensus
        Protocol), distinct from Bitcoin's{' '}
        <Link href={`${glossaryBase}#proof-of-work`}>Proof-of-Work</Link>.
      </p>

      <h3>2018: A Price Peak Amid the Broader Crypto Boom</h3>
      <p>
        Amid the broader market mania of late 2017 into early 2018, XLM closed out 2017 up over{' '}
        <strong>14,000%</strong> and reached an all-time high of roughly <strong>$0.94</strong> in early
        January 2018.
      </p>

      <h3>2019 Onward: Partnerships and Real-World Asset Tokenization</h3>
      <p>
        In 2019, Stellar partnered with <strong>IBM</strong> (the World Wire project) for cross-border
        payments between banks. In later years, the focus shifted toward{' '}
        <strong>real-world asset (RWA) tokenization</strong> — for example, a partnership with asset
        manager Franklin Templeton to issue a tokenized money market fund directly on Stellar, making the
        project one of the pioneers of this space among public blockchains.
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
        name="Stellar"
        symbol="XLM"
        icon="⭐"
        coingeckoId="stellar"
        tagline={isRu ? 'Сеть для быстрых и дешёвых международных платежей' : 'A network for fast, cheap cross-border payments'}
        historyTitle={isRu ? 'История Stellar: от Mt. Gox и Ripple до токенизации активов' : 'Stellar History: From Mt. Gox and Ripple to Asset Tokenization'}
        historyContent={historyContent}
        guide={guide}
      />
    </>
  );
}
