import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { buildOg, buildTwitter, BASE } from '@/lib/metadata';
import CoinGuideLayout from '@/components/ui/CoinGuideLayout';
import { COIN_GUIDES } from '@/lib/coinGuides';
import { ORGANIZATION_ID } from '@/lib/organizationSchema';

import { ASSET_REVISIONS } from '@/lib/pageRevisions';
type Props = { params: Promise<{ locale: string }> };
const SLUG = 'worldcoin';
const guide = COIN_GUIDES[SLUG];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const isRu = locale === 'ru';
  const title = isRu ? 'Worldcoin (WLD): цена, история, калькулятор' : 'Worldcoin (WLD): price, history, calculator';
  const description = isRu
    ? 'Как проект Сэма Альтмана сканирует радужку глаза устройством Orb и раздаёт WLD. Запреты в Кении и Испании, переименование в World и калькулятор WLD.'
    : 'How Sam Altman’s project scans irises with a device called the Orb and pays out WLD. Bans in Kenya and Spain, the rebrand to World and a WLD calculator.';

  return {
    // Absolute: the layout template appends the site name, which adds nothing here.
    title: { absolute: title },
    description,
    keywords: isRu
      ? ['worldcoin история', 'wld токен', 'worldcoin калькулятор', 'worldcoin цена', 'курс wld']
      : ['worldcoin history', 'wld token', 'worldcoin investment calculator', 'worldcoin price', 'wld price'],
    openGraph: buildOg({ url: `${BASE}/${locale}/assets/${SLUG}`, title, description, locale }),
    twitter: buildTwitter({ url: `${BASE}/${locale}/assets/${SLUG}`, title, description, locale }),
    alternates: {
      canonical: `${BASE}/${locale}/assets/${SLUG}`,
      languages: { ru: `${BASE}/ru/assets/${SLUG}`, en: `${BASE}/en/assets/${SLUG}`, 'x-default': `${BASE}/en/assets/${SLUG}` },
    },
  };
}

export default async function WorldcoinPage({ params }: Props) {
  const { locale } = await params;
  const isRu = locale === 'ru';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: isRu ? 'Worldcoin (WLD): скан радужки в обмен на токен' : 'Worldcoin (WLD): an iris scan in exchange for a token',
    description: isRu ? 'Как проект Сэма Альтмана сканирует радужку глаза устройством Orb и раздаёт WLD. Запреты в Кении и Испании, переименование в World и калькулятор WLD.' : 'How Sam Altman’s project scans irises with a device called the Orb and pays out WLD. Bans in Kenya and Spain, the rebrand to World and a WLD calculator.',
    inLanguage: locale,
    datePublished: '2026-11-03',
    dateModified: ASSET_REVISIONS[SLUG] ?? '2026-11-03',
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
      { '@type': 'ListItem', position: 3, name: 'Worldcoin (WLD)', item: `${BASE}/${locale}/assets/${SLUG}` },
    ],
  };

  const historyContent = isRu ? (
    <>
      <h3>Шар, который смотрит в глаза</h3>
      <p>
        Orb — металлический шар с камерой. Он снимает лицо и радужку, проверяет, что перед ним уникальный человек, и выдаёт World ID. Подтверждённые пользователи получают токены WLD. Проект основали в 2019 году <strong>Сэм Альтман</strong>, Алекс Бления и Макс Новендстерн через компанию Tools for Humanity.
      </p>

      <h3>Запуск и запреты</h3>
      <p>
        Торги WLD открылись 24 июля 2023 года, но не в США. Уже в августе Кения приостановила регистрацию, а Франция, Великобритания и Бавария начали проверки. В марте 2024 года испанский регулятор по защите данных запретил проекту собирать биометрию, затем похожие решения приняла Португалия.
      </p>

      <h3>Пик на волне ИИ</h3>
      <p>
        <Link href={`/${locale}/glossary/ath`}>Исторический максимум</Link>, <strong>11,74 доллара</strong>, WLD поставил 9 марта 2024 года, по данным CoinGecko. Спрос на токены ИИ тогда был высоким, а Альтман возглавлял и OpenAI, и Worldcoin. В октябре 2024-го проект убрал «coin» из названия, стал World и показал новый Orb с меньшим числом деталей.
      </p>

      <h3>Выход в США</h3>
      <p>
        В Америке World заработал 1 мая 2025 года, в шести городах, среди них Сан-Франциско и Атланта. К сентябрю 2025-го приложением World App пользовались около 33 миллионов человек, 15 миллионов из них прошли проверку. Это больше, чем население Казахстана, но токен продолжал дешеветь: 18 мая 2026 года он опустился до 0,23 доллара.
      </p>
    </>
  ) : (
    <>
      <h3>Sam Altman’s second project</h3>
      <p>
        <strong>Sam Altman</strong>, Alex Blania and Max Novendstern founded Worldcoin in 2019 through the company Tools for Humanity. The idea: a device called the Orb photographs your face and irises, confirms you are a unique person and gives you a World ID. Verified users receive WLD.
      </p>

      <h3>July 2023: launch and the first bans</h3>
      <p>
        WLD started trading on 24 July 2023, though not in the United States. Within weeks Kenya suspended enrolment, and France, the UK and Bavaria opened investigations. In March 2024 the Spanish data protection agency ordered the project to stop collecting biometric data.
      </p>

      <h3>The peak on AI hype</h3>
      <p>
        WLD reached its <Link href={`/${locale}/glossary/ath`}>all-time high</Link> of <strong>11.74 dollars</strong> on 9 March 2024, according to CoinGecko, while AI tokens were in demand and Altman led both OpenAI and Worldcoin. In October 2024 the project dropped “coin” from its name, became World and showed a new Orb with fewer parts.
      </p>

      <h3>Into the United States</h3>
      <p>
        World started operating in the United States on 1 May 2025, in six cities including San Francisco and Atlanta. By September 2025 it counted about 33 million World App users, 15 million of them verified. The token kept falling and on 18 May 2026 hit an all-time low of 0.23 dollars.
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
        name="Worldcoin"
        symbol="WLD"
        icon="◉"
        coingeckoId="worldcoin-wld"
        tagline={isRu ? 'Токен в обмен на доказательство, что вы человек' : 'A token handed out for proving you are human'}
        historyTitle={isRu ? 'История Worldcoin: Orb и токен' : 'Worldcoin history: the Orb and the token'}
        historyContent={historyContent}
        guide={guide}
      />
    </>
  );
}
