import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { buildOg, buildTwitter, BASE } from '@/lib/metadata';
import CoinGuideLayout from '@/components/ui/CoinGuideLayout';
import { COIN_GUIDES } from '@/lib/coinGuides';
import { ORGANIZATION_ID } from '@/lib/organizationSchema';

type Props = { params: Promise<{ locale: string }> };
const SLUG = 'zcash';
const guide = COIN_GUIDES[SLUG];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const isRu = locale === 'ru';
  const title = isRu ? 'Zcash (ZEC): цена, история, калькулятор' : 'Zcash (ZEC): price, history, calculator';
  const description = isRu
    ? 'Как Zcash прошёл путь от научной статьи до первой десятки. Скрытые переводы, халвинги и ралли 2025 года, плюс калькулятор вложений в ZEC.'
    : 'How Zcash went from a Johns Hopkins research paper to the top ten. Shielded transactions, halvings and the 2025 rally, plus a ZEC investment calculator.';

  return {
    // Absolute: the layout template appends the site name, which adds nothing here.
    title: { absolute: title },
    description,
    keywords: isRu
      ? ['zcash история', 'zec токен', 'zcash калькулятор', 'zcash цена', 'курс zec']
      : ['zcash history', 'zec token', 'zcash investment calculator', 'zcash price', 'zec price'],
    openGraph: buildOg({ url: `${BASE}/${locale}/assets/${SLUG}`, title, description, locale }),
    twitter: buildTwitter({ url: `${BASE}/${locale}/assets/${SLUG}`, title, description, locale }),
    alternates: {
      canonical: `${BASE}/${locale}/assets/${SLUG}`,
      languages: { ru: `${BASE}/ru/assets/${SLUG}`, en: `${BASE}/en/assets/${SLUG}`, 'x-default': `${BASE}/en/assets/${SLUG}` },
    },
  };
}

export default async function ZcashPage({ params }: Props) {
  const { locale } = await params;
  const isRu = locale === 'ru';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: isRu ? 'Zcash (ZEC): от научной статьи до первой десятки' : 'Zcash (ZEC): from a research paper to the top ten',
    description: isRu ? 'Как Zcash прошёл путь от научной статьи до первой десятки. Скрытые переводы, халвинги и ралли 2025 года, плюс калькулятор вложений в ZEC.' : 'How Zcash went from a Johns Hopkins research paper to the top ten. Shielded transactions, halvings and the 2025 rally, plus a ZEC investment calculator.',
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
      { '@type': 'ListItem', position: 3, name: 'Zcash (ZEC)', item: `${BASE}/${locale}/assets/${SLUG}` },
    ],
  };

  const historyContent = isRu ? (
    <>
      <h3>Рекорд в первый же день</h3>
      <p>
        Исторический максимум Zcash поставил в первый же день, 28 октября 2016 года. Монет тогда существовало всего несколько, и первые покупатели платили, по данным CoinGecko, до <strong>3191,93 доллара</strong> за ZEC. Через несколько недель <Link href={`/${locale}/glossary/mining`}>майнинг</Link> добавил предложения, и цена опустилась до десятков долларов.
      </p>

      <h3>Из научной статьи</h3>
      <p>
        Основа Zcash — работа Zerocash 2014 года, которую написали криптографы из Университета Джонса Хопкинса, MIT, Тель-Авивского университета и Техниона. Они показали, что <Link href={`/${locale}/glossary/blockchain`}>блокчейн</Link> может подтвердить платёж, не раскрывая отправителя, получателя и сумму. Для этого служит доказательство с нулевым разглашением, zk-SNARK. Вокруг идеи <strong>Зуко Уилкокс-О’Хирн</strong> построил компанию, которая сейчас называется Electric Coin Company.
      </p>

      <h3>Прозрачный и скрытый адрес</h3>
      <p>
        У Zcash тот же потолок в 21 миллион монет, что у биткоина, и те же <Link href={`/${locale}/glossary/halving`}>халвинги</Link>: второй прошёл в ноябре 2024 года. Отличие в выборе. Прозрачный адрес работает как биткоин-адрес, а скрытый прячет детали перевода. Каким пользоваться, решаете вы.
      </p>

      <h3>Ралли 2025 года</h3>
      <p>
        В июле 2024 года ZEC опускался до 16,08 доллара. Осенью 2025-го приватность снова вошла в моду: по ценам закрытия Binance, 1 сентября монета стоила 40,55 доллара, а 31 октября уже 404,54. Это рост вдесятеро за два месяца. К ноябрю 2026 года Zcash занимает десятое место по <Link href={`/${locale}/glossary/market-cap`}>капитализации</Link> на CoinGecko.
      </p>
    </>
  ) : (
    <>
      <h3>A research paper first</h3>
      <p>
        Zcash started as Zerocash, a 2014 paper by cryptographers from Johns Hopkins, MIT, Tel Aviv University and the Technion. They showed that a <Link href={`/${locale}/glossary/blockchain`}>blockchain</Link> could confirm a payment without revealing the sender, the recipient or the amount, using a zero-knowledge proof called a zk-SNARK. <strong>Zooko Wilcox-O’Hearn</strong> built a company around the idea, now the Electric Coin Company.
      </p>

      <h3>October 2016: a launch at 3,191 dollars</h3>
      <p>
        The network went live on 28 October 2016. Only a handful of coins existed on day one, and buyers paid up to <strong>3,191.93 dollars</strong> per ZEC, according to CoinGecko. That launch-day price remains the all-time high. Within weeks the price fell into the tens of dollars as <Link href={`/${locale}/glossary/mining`}>mining</Link> added supply.
      </p>

      <h3>Two kinds of address</h3>
      <p>
        Zcash copies Bitcoin’s cap of 21 million coins and its halving schedule. The difference is the choice it gives you: a transparent address works like Bitcoin’s, while a shielded address hides the details. The second <Link href={`/${locale}/glossary/halving`}>halving</Link> came in November 2024 and cut the block reward in half again.
      </p>

      <h3>The 2025 rally</h3>
      <p>
        For years ZEC traded far below its launch price; in July 2024 it touched 16.08 dollars. In autumn 2025 privacy came back into fashion, and ZEC rose tenfold in two months, from 40.55 dollars on 1 September to 404.54 dollars on 31 October, by Binance closing prices. By November 2026 it ranked tenth by <Link href={`/${locale}/glossary/market-cap`}>market cap</Link> on CoinGecko.
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
        name="Zcash"
        symbol="ZEC"
        icon="ⓩ"
        coingeckoId="zcash"
        tagline={isRu ? 'Правила эмиссии биткоина плюс скрытые переводы' : 'Bitcoin\'s supply rules with private transactions'}
        historyTitle={isRu ? 'История Zcash: монета, которая прячет сумму' : 'Zcash history: the coin that hides the amount'}
        historyContent={historyContent}
        guide={guide}
      />
    </>
  );
}
