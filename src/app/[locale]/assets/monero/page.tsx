import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { buildOg, BASE } from '@/lib/metadata';
import CoinGuideLayout from '@/components/ui/CoinGuideLayout';
import { COIN_GUIDES } from '@/lib/coinGuides';

type Props = { params: Promise<{ locale: string }> };
const SLUG = 'monero';
const guide = COIN_GUIDES[SLUG];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const isRu = locale === 'ru';
  const title = isRu ? 'Monero (XMR) — История, цена и калькулятор инвестиций' : 'Monero (XMR) — History, Price & Investment Calculator';
  const description = isRu
    ? 'История Monero: от форка Bytecoin до главной приватной криптовалюты с кольцевыми подписями. Калькулятор инвестиций в XMR.'
    : 'The history of Monero: from a Bytecoin fork to the leading privacy coin built on ring signatures. XMR investment calculator.';

  return {
    title,
    description,
    keywords: isRu
      ? ['monero история', 'xmr токен', 'приватная криптовалюта', 'monero калькулятор', 'кольцевые подписи']
      : ['monero history', 'xmr token', 'privacy coin', 'monero investment calculator', 'ring signatures'],
    openGraph: buildOg({ url: `${BASE}/${locale}/assets/${SLUG}`, title, description, locale }),
    alternates: {
      canonical: `${BASE}/${locale}/assets/${SLUG}`,
      languages: { ru: `${BASE}/ru/assets/${SLUG}`, en: `${BASE}/en/assets/${SLUG}` },
    },
  };
}

export default async function MoneroPage({ params }: Props) {
  const { locale } = await params;
  const isRu = locale === 'ru';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: isRu ? 'Monero (XMR): история главной приватной криптовалюты' : 'Monero (XMR): History of the Leading Privacy Coin',
    description: isRu ? 'История Monero от форка Bytecoin до сегодняшнего дня.' : 'The history of Monero from a Bytecoin fork to today.',
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
      { '@type': 'ListItem', position: 3, name: 'Monero (XMR)', item: `${BASE}/${locale}/assets/${SLUG}` },
    ],
  };

  const glossaryBase = `/${locale}/glossary`;

  const historyContent = isRu ? (
    <>
      <h3>2014: Рождение из форка Bytecoin</h3>
      <p>
        Monero был запущен в апреле 2014 года как форк малоизвестной монеты <strong>Bytecoin</strong>,
        первой реализации протокола <strong>CryptoNote</strong>. Группа разработчиков, обнаружившая
        проблемы с изначальным распределением монет Bytecoin (большая часть уже была добыта до
        публичного анонса), решила запустить честный форк с нуля. Изначальный создатель, известный только
        под ником <strong>«thankful_for_today»</strong>, вскоре покинул проект, и разработку продолжило
        комьюнити под новым именем — Monero (эсперанто для слова «монета»).
      </p>

      <h3>Как устроена приватность Monero</h3>
      <p>
        В отличие от Bitcoin, где каждая{' '}
        <Link href={`${glossaryBase}#transaction`}>транзакция</Link> публично видна в блокчейне, Monero
        использует несколько криптографических техник одновременно: кольцевые подписи (скрывают
        реального отправителя среди группы возможных), скрытые адреса (генерируют уникальный
        одноразовый адрес получателя для каждой транзакции) и конфиденциальные транзакции RingCT
        (скрывают сумму перевода).
      </p>

      <h3>2018: Пик цены на фоне общего рынка</h3>
      <p>
        Как и большинство криптовалют, Monero достиг исторического максимума на пике рынка в январе 2018
        года — около <strong>$540</strong> за монету.
      </p>

      <h3>Регуляторное давление и делистинги</h3>
      <p>
        Из-за требований по борьбе с отмыванием денег (AML) и невозможности отследить транзакции ряд
        крупных бирж, включая некоторые европейские платформы, был вынужден делистинговать XMR в
        отдельных юрисдикциях. Тем не менее владение и использование Monero остаётся легальным в
        большинстве стран мира.
      </p>
    </>
  ) : (
    <>
      <h3>2014: Born from a Bytecoin Fork</h3>
      <p>
        Monero launched in April 2014 as a fork of the little-known <strong>Bytecoin</strong>, the first
        implementation of the <strong>CryptoNote</strong> protocol. A group of developers who spotted
        problems with Bytecoin's original coin distribution (most of the supply had already been mined
        before the public announcement) decided to launch a fair fork from scratch. The original creator,
        known only by the handle <strong>"thankful_for_today,"</strong> soon left the project, and the
        community carried development forward under a new name — Monero (Esperanto for "coin").
      </p>

      <h3>How Monero's Privacy Actually Works</h3>
      <p>
        Unlike Bitcoin, where every{' '}
        <Link href={`${glossaryBase}#transaction`}>transaction</Link> is publicly visible on the
        blockchain, Monero combines several cryptographic techniques at once: ring signatures (hide the
        real sender among a group of possible senders), stealth addresses (generate a unique one-time
        recipient address for every transaction), and confidential RingCT transactions (hide the amount
        being sent).
      </p>

      <h3>2018: A Price Peak Amid the Broader Market</h3>
      <p>
        Like most cryptocurrencies, Monero hit its all-time high at the market's peak in January 2018 —
        around <strong>$540</strong> per coin.
      </p>

      <h3>Regulatory Pressure and Delistings</h3>
      <p>
        Due to anti-money-laundering (AML) requirements and the inability to trace transactions, a number
        of major exchanges, including some European platforms, have been forced to delist XMR in certain
        jurisdictions. That said, owning and using Monero remains legal in most countries worldwide.
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
        name="Monero"
        symbol="XMR"
        icon="ɱ"
        coingeckoId="monero"
        tagline={isRu ? 'Главная приватная криптовалюта с полностью анонимными транзакциями' : 'The leading privacy coin, with fully anonymous transactions'}
        historyTitle={isRu ? 'История Monero: от форка Bytecoin до главной приватной монеты' : 'Monero History: From a Bytecoin Fork to the Leading Privacy Coin'}
        historyContent={historyContent}
        guide={guide}
      />
    </>
  );
}
