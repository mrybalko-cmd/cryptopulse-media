import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { buildOg, buildTwitter, BASE } from '@/lib/metadata';
import CoinGuideLayout from '@/components/ui/CoinGuideLayout';
import { COIN_GUIDES } from '@/lib/coinGuides';
import { ORGANIZATION_ID } from '@/lib/organizationSchema';

type Props = { params: Promise<{ locale: string }> };
const SLUG = 'pi-network';
const guide = COIN_GUIDES[SLUG];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const isRu = locale === 'ru';
  const title = isRu ? 'Pi Network (PI): цена, история, калькулятор' : 'Pi Network (PI): price, history, calculator';
  const description = isRu
    ? 'Как Pi Network прошла путь от приложения для телефона в 2019 году до открытой сети в феврале 2025-го. Майнинг в телефоне, KYC и первые торги, плюс калькулятор.'
    : 'How Pi Network went from a phone app in 2019 to an open mainnet in February 2025. Mobile mining, KYC and the launch-week price, plus a PI calculator.';

  return {
    // Absolute: the layout template appends the site name, which adds nothing here.
    title: { absolute: title },
    description,
    keywords: isRu
      ? ['pi network история', 'pi токен', 'pi network калькулятор', 'pi network цена', 'курс pi']
      : ['pi network history', 'pi token', 'pi network investment calculator', 'pi network price', 'pi price'],
    openGraph: buildOg({ url: `${BASE}/${locale}/assets/${SLUG}`, title, description, locale }),
    twitter: buildTwitter({ url: `${BASE}/${locale}/assets/${SLUG}`, title, description, locale }),
    alternates: {
      canonical: `${BASE}/${locale}/assets/${SLUG}`,
      languages: { ru: `${BASE}/ru/assets/${SLUG}`, en: `${BASE}/en/assets/${SLUG}`, 'x-default': `${BASE}/en/assets/${SLUG}` },
    },
  };
}

export default async function PiNetworkPage({ params }: Props) {
  const { locale } = await params;
  const isRu = locale === 'ru';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: isRu ? 'Pi Network (PI): от приложения в телефоне до открытой сети' : 'Pi Network (PI): from a phone app to an open network',
    description: isRu ? 'Как Pi Network прошла путь от приложения для телефона в 2019 году до открытой сети в феврале 2025-го. Майнинг в телефоне, KYC и первые торги, плюс калькулятор.' : 'How Pi Network went from a phone app in 2019 to an open mainnet in February 2025. Mobile mining, KYC and the launch-week price, plus a PI calculator.',
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
      { '@type': 'ListItem', position: 3, name: 'Pi Network (PI)', item: `${BASE}/${locale}/assets/${SLUG}` },
    ],
  };

  const historyContent = isRu ? (
    <>
      <h3>Первые торги через шесть лет</h3>
      <p>
        Торговать PI на биржах стало можно только 20 февраля 2025 года, почти через шесть лет после запуска проекта. Открытая сеть заработала в 8:00 по UTC, ликвидности было мало, и за несколько часов цена упала примерно на 65%, по данным Cointelegraph. Потом она отыгралась: 26 февраля 2025 года PI поставил исторический максимум, 2,99 доллара, по данным CoinGecko.
      </p>

      <h3>Майнинг одной кнопкой</h3>
      <p>
        Pi Network запустили 14 марта 2019 года, в День числа пи, выпускники Стэнфорда <strong>Николас Коккалис</strong> и <strong>Чэндяо Фань</strong>. Идея была в добыче без оборудования: раз в сутки открываете приложение и нажимаете кнопку. Тяжёлых вычислений телефон не делает, так что с <Link href={`/${locale}/glossary/mining`}>майнингом</Link> биткоина здесь общее только слово.
      </p>

      <h3>Закрытая сеть и проверка личности</h3>
      <p>
        Основная сеть стартовала в декабре 2021 года закрытой: без связи с внешними биржами. Чтобы перенести баланс из приложения в сеть, владелец должен был пройти <Link href={`/${locale}/glossary/kyc`}>KYC</Link>, то есть подтвердить личность, примерно как при открытии банковского счёта. На проверку пользователей и перенос балансов ушло три года.
      </p>

      <h3>Сто миллиардов в запасе</h3>
      <p>
        Модель выпуска ограничивает PI сотней миллиардов токенов, в обращении около 11,3 миллиарда. В июле 2026 года цена опустилась до минимума за всю историю, 0,0706 доллара. Большая часть возможного выпуска пока не дошла до рынка.
      </p>
    </>
  ) : (
    <>
      <h3>Pi Day 2019</h3>
      <p>
        Stanford graduates <strong>Nicolas Kokkalis</strong> and <strong>Chengdiao Fan</strong> launched Pi Network on 14 March 2019, Pi Day. The idea was mining without hardware: you open the app and tap a button once every 24 hours to keep earning. The phone does no heavy computation, so this <Link href={`/${locale}/glossary/mining`}>mining</Link> has little in common with Bitcoin’s.
      </p>

      <h3>An enclosed mainnet and KYC</h3>
      <p>
        The mainnet started in December 2021 as an enclosed network behind a firewall, cut off from outside exchanges. Before a balance could move from the app to the mainnet, its owner had to pass <Link href={`/${locale}/glossary/kyc`}>KYC</Link>, an identity check. The team spent the next three years verifying users and migrating balances.
      </p>

      <h3>20 February 2025: the network opens</h3>
      <p>
        The open network went live at 8:00 UTC on 20 February 2025, and PI started trading on exchanges for the first time. Liquidity was thin. Within hours the price fell about 65%, according to Cointelegraph, then recovered and set an all-time high of 2.99 dollars on 26 February 2025, by CoinGecko data.
      </p>

      <h3>The supply cap</h3>
      <p>
        The supply model caps PI at 100 billion tokens, and about 11.3 billion are in circulation, according to CoinGecko. In July 2026 the price fell to its lowest recorded level, 0.0706 dollars.
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
        name="Pi Network"
        symbol="PI"
        icon="π"
        coingeckoId="pi-network"
        tagline={isRu ? 'Монета, которую добывали нажатием кнопки в приложении' : 'A coin people mined by tapping a button in an app'}
        historyTitle={isRu ? 'История Pi Network: шесть лет до первых торгов' : 'Pi Network history: six years before trading'}
        historyContent={historyContent}
        guide={guide}
      />
    </>
  );
}
