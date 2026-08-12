import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import CoinGuideLayout from '@/components/ui/CoinGuideLayout';
import { buildOg, buildTwitter, BASE } from '@/lib/metadata';
import { TRX_QUOTES, TRX_FAQ, TRX_INVESTMENT_REFERENCE } from '@/lib/trxData';

type Props = { params: Promise<{ locale: string }> };
const SLUG = 'trx';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const isRu = locale === 'ru';
  const title = isRu ? 'TRON (TRX): цена, история, калькулятор' : 'TRON (TRX): price, history, calculator';
  const description = isRu
    ? 'Полная история Tron: от скандала с плагиатом до крупнейшей USDT-сети в мире. Джастин Сан, TRC-20, покупка BitTorrent и почему USDT на Tron дешевле чем на Ethereum. Калькулятор инвестиций.'
    : 'Complete Tron history: from plagiarism scandal to the world\'s largest USDT network. Justin Sun, TRC-20, BitTorrent acquisition and why USDT on Tron is cheaper than on Ethereum. Investment calculator.';
  return {
    // Absolute: the layout template appends ' | CryptoPulse.media', which costs
    // 20 characters and adds nothing here — the coin's name is already first.
    title: { absolute: title },
    description,
    keywords: isRu
      ? ['tron trx история', 'justin sun криптовалюта', 'trc-20 usdt', 'tron блокчейн', 'trx калькулятор']
      : ['tron trx history', 'justin sun cryptocurrency', 'trc-20 usdt', 'tron blockchain', 'trx investment calculator'],
    openGraph: buildOg({ url: `${BASE}/${locale}/assets/trx`, title, description, locale }),
    twitter: buildTwitter({ url: `${BASE}/${locale}/assets/trx`, title, description, locale }),
    alternates: {
      canonical: `${BASE}/${locale}/assets/trx`,
      languages: {
        ru: `${BASE}/ru/assets/trx`,
        en: `${BASE}/en/assets/trx`,
        'x-default': `${BASE}/en/assets/trx`,
      },
    },
  };
}

const GUIDE = {
  stats: [
    { label: { ru: 'Год запуска', en: 'Launched' }, value: '2018' },
    { label: { ru: 'Запас', en: 'Supply' }, value: { ru: '~89B TRX', en: '~89B TRX' } },
    { label: { ru: 'Основатель', en: 'Founder' }, value: 'Justin Sun' },
    { label: { ru: 'Консенсус', en: 'Consensus' }, value: 'DPoS (27 SR)' },
  ],
  investmentReference: TRX_INVESTMENT_REFERENCE,
  faq: TRX_FAQ,
  glossaryTerms: [
    { slug: 'trc-20', label: { ru: 'TRC-20', en: 'TRC-20' } },
    { slug: 'stablecoin', label: { ru: 'Стейблкоин', en: 'Stablecoin' } },
    { slug: 'dex', label: { ru: 'DEX', en: 'DEX' } },
    { slug: 'smart-contract', label: { ru: 'Смарт-контракт', en: 'Smart Contract' } },
    { slug: 'p2p', label: { ru: 'P2P', en: 'P2P' } },
  ],
};

export default async function TrxPage({ params }: Props) {
  const { locale } = await params;
  const isRu = locale === 'ru';
  const loc = isRu ? 'ru' : 'en';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: isRu ? 'Tron (TRX): блокчейн развлечений и главная сеть для USDT' : 'Tron (TRX): Entertainment Blockchain and the Main USDT Network',
    description: isRu ? 'История Tron от основания до доминирования в USDT-транзакциях.' : 'Tron history from founding to USDT transaction dominance.',
    inLanguage: locale,
    datePublished: '2024-01-01',
    dateModified: new Date().toISOString().slice(0, 10),
    author: { '@type': 'Organization', name: 'CryptoPulse.media', url: BASE },
    publisher: { '@type': 'Organization', name: 'CryptoPulse.media', url: BASE },
    mainEntityOfPage: `${BASE}/${locale}/assets/trx`,
  };

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: TRX_FAQ.map(item => ({
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
      { '@type': 'ListItem', position: 3, name: 'Tron (TRX)', item: `${BASE}/${locale}/assets/trx` },
    ],
  };

  const historyContent = (
    <>
      {isRu ? (
            <>
              <h3>2017–2018: ICO и скандал с плагиатом</h3>
              <p>Джастин Сан — протеже Джека Ма, выпускник Пенсильванского университета, основал Tron в 2017 году с целью «децентрализовать интернет». ICO на <strong>$70 млн</strong> в сентябре 2017 года. Токен TRX сначала торговался на биржах как ERC-20 на Ethereum.</p>
              <p>В январе 2018 года разразился скандал: разработчики проанализировали whitepaper Tron и обнаружили <strong>дословные фрагменты без атрибуции</strong> из документации IPFS, Filecoin и других проектов. Виталик Бутерин назвал Джастина Сана «мастером маркетинга без технической базы». Сан принёс публичные извинения.</p>

              <h3>2018: Mainnet и покупка BitTorrent</h3>
              <p>В июне 2018 года Tron запустила собственный mainnet и начала миграцию TRX с Ethereum. В июле 2018 года — <strong>покупка BitTorrent за $140 млн</strong>. BitTorrent, крупнейший в мире P2P-протокол (более 2 млрд загрузок программного обеспечения), должен был стать «мостом» для онбординга сотен миллионов пользователей в Tron.</p>

              <h3>2019–2020: TRC-20 и приход USDT</h3>
              <p>Переломный момент в истории Tron: Tether выпустила <strong>USDT на TRC-20</strong>. Причина проста: транзакции в USDT на Ethereum в пике стоили $50–100 в газе. На Tron — меньше цента (ресурсная система вместо газа). Объём USDT на Tron быстро превысил объём на Ethereum.</p>
              <p>К 2020 году Tron стал <strong>главной сетью для USDT-переводов</strong> в мире — особенно в странах, где нужны быстрые и дешёвые P2P-переводы: Китай, Россия, СНГ, Ближний Восток.</p>

              <h3>2021: BTT и рост экосистемы</h3>
              <p>BitTorrent Token (BTT) — токен для вознаграждения сидеров в P2P-сети — запущен на TRC-20. Объём транзакций USDT на Tron в 2021 году превысил <strong>$4 трлн</strong> в годовом измерении. DeFi-экосистема JustLend, JustSwap (DEX) стала второй по TVL после Ethereum среди неEVM-платформ.</p>

              <h3>2022: USDD и кризис</h3>
              <p>В мае 2022 года, через несколько дней после краха LUNA/UST, Джастин Сан запустил <strong>USDD</strong> — алгоритмический стейблкоин Tron. В июне 2022 года USDD испытал краткосрочный депег до $0,97 — что вызвало панику, учитывая свежую LUNA-травму. Однако Tron DAO оперативно ввела $700M в резервы BTC/USDT, стабилизировав монету.</p>

              <h3>2023–2025: SEC и продолжение экспансии</h3>
              <p>В марте 2023 года SEC предъявила Джастину Сану обвинения: манипулирование рынком, незарегистрированные ценные бумаги, «wash trading». Сан переехал в Швейцарию; дело продолжается. Несмотря на это, объём USDT на Tron превысил <strong>$60 млрд</strong> — больше, чем на любой другой сети.</p>
            </>
          ) : (
            <>
              <h3>2017–2018: ICO and Plagiarism Scandal</h3>
              <p>Justin Sun — Jack Ma's protégé, University of Pennsylvania graduate — founded Tron in 2017 with the goal of "decentralizing the internet." <strong>$70M ICO</strong> in September 2017. TRX token initially traded on exchanges as ERC-20 on Ethereum.</p>
              <p>In January 2018, a scandal erupted: developers analyzed Tron's whitepaper and found <strong>verbatim passages without attribution</strong> from IPFS, Filecoin, and other projects' documentation. Vitalik Buterin called Justin Sun "a marketing genius with no technical foundation." Sun issued public apologies.</p>

              <h3>2018: Mainnet and BitTorrent Acquisition</h3>
              <p>In June 2018, Tron launched its own mainnet and began migrating TRX from Ethereum. In July 2018 — <strong>BitTorrent acquisition for $140M</strong>. BitTorrent, the world's largest P2P protocol, was meant to serve as a bridge for onboarding hundreds of millions of users into Tron.</p>

              <h3>2019–2020: TRC-20 and USDT's Arrival</h3>
              <p>A turning point in Tron's history: Tether issued <strong>USDT on TRC-20</strong>. The reason was simple: USDT transactions on Ethereum at peak cost $50–100 in gas. On Tron — less than a cent (resource system instead of gas). USDT volume on Tron quickly exceeded that on Ethereum.</p>
              <p>By 2020, Tron became the <strong>world's main network for USDT transfers</strong> — especially in countries needing fast and cheap P2P transfers: China, Russia, CIS, Middle East.</p>

              <h3>2021: BTT and Ecosystem Growth</h3>
              <p>BitTorrent Token (BTT) — a token for rewarding seeders in the P2P network — launched on TRC-20. USDT transaction volume on Tron in 2021 exceeded <strong>$4 trillion</strong> annualized. The JustLend and JustSwap (DEX) DeFi ecosystem became second in TVL after Ethereum among non-EVM platforms.</p>

              <h3>2022: USDD and Crisis</h3>
              <p>In May 2022, days after the LUNA/UST crash, Justin Sun launched <strong>USDD</strong> — Tron's algorithmic stablecoin. In June 2022, USDD briefly depegged to $0.97, causing panic given the fresh LUNA trauma. However, Tron DAO quickly deployed $700M in BTC/USDT reserves, stabilizing the coin.</p>

              <h3>2023–2025: SEC and Continued Expansion</h3>
              <p>In March 2023, the SEC charged Justin Sun with market manipulation, unregistered securities, and wash trading. Sun relocated to Switzerland; the case continues. Despite this, USDT volume on Tron exceeded <strong>$60 billion</strong> — more than on any other network.</p>
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
        tagline={isRu ? 'Скандальный блокчейн Джастина Сана, ставший крупнейшей сетью для USDT-переводов' : 'Justin Sun\'s controversial blockchain that became the world\'s largest USDT transfer network'}
        historyTitle={isRu ? 'История Tron: от плагиата до короля USDT-переводов' : 'Tron History: From Plagiarism to the King of USDT Transfers'}
        historyContent={historyContent}
        guide={GUIDE}
        quotes={TRX_QUOTES}
      />
    </>
  );
}
