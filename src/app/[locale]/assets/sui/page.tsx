import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { buildOg, BASE } from '@/lib/metadata';
import CoinGuideLayout from '@/components/ui/CoinGuideLayout';
import { COIN_GUIDES } from '@/lib/coinGuides';

type Props = { params: Promise<{ locale: string }> };
const SLUG = 'sui';
const guide = COIN_GUIDES[SLUG];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const isRu = locale === 'ru';
  const title = isRu ? 'Sui (SUI) — История, цена и калькулятор инвестиций' : 'Sui (SUI) — History, Price & Investment Calculator';
  const description = isRu
    ? 'История Sui: от закрытого проекта Meta Diem до высокоскоростного блокчейна на языке Move. Калькулятор инвестиций в SUI.'
    : "The history of Sui: from Meta's shuttered Diem project to a high-speed blockchain built on the Move language. SUI investment calculator.";

  return {
    title,
    description,
    keywords: isRu
      ? ['sui история', 'sui токен', 'mysten labs', 'sui калькулятор', 'move язык программирования']
      : ['sui history', 'sui token', 'mysten labs', 'sui investment calculator', 'move programming language'],
    openGraph: buildOg({ url: `${BASE}/${locale}/assets/${SLUG}`, title, description, locale }),
    alternates: {
      canonical: `${BASE}/${locale}/assets/${SLUG}`,
      languages: { ru: `${BASE}/ru/assets/${SLUG}`, en: `${BASE}/en/assets/${SLUG}` },
    },
  };
}

export default async function SuiPage({ params }: Props) {
  const { locale } = await params;
  const isRu = locale === 'ru';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: isRu ? 'Sui (SUI): история блокчейна от бывшей команды Meta' : "Sui (SUI): History of the Blockchain Built by Meta's Former Team",
    description: isRu ? 'История Sui от проекта Diem до независимого блокчейна Mysten Labs.' : 'The history of Sui from the Diem project to an independent blockchain by Mysten Labs.',
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
      { '@type': 'ListItem', position: 3, name: 'Sui (SUI)', item: `${BASE}/${locale}/assets/${SLUG}` },
    ],
  };

  const glossaryBase = `/${locale}/glossary`;

  const historyContent = isRu ? (
    <>
      <h3>Наследие Diem: от закрытого проекта Meta к публичному блокчейну</h3>
      <p>
        История Sui начинается не с чистого листа, а с обломков одного из самых амбициозных, но
        провалившихся проектов крипто-индустрии — <strong>Diem</strong> (изначально называвшегося
        Libra), собственной криптовалюты Facebook (Meta), закрытой в 2022 году под давлением
        регуляторов США. Часть инженерной команды Diem, включая <strong>Эвана Ченга, Сэма Блэкшира и
        Джорджа Данезиса</strong>, использовала часть наработок — в частности, язык программирования{' '}
        <strong>Move</strong>, изначально созданный для Diem, — чтобы основать компанию{' '}
        <strong>Mysten Labs</strong> и построить независимый публичный{' '}
        <Link href={`${glossaryBase}#blockchain`}>блокчейн</Link>.
      </p>

      <h3>Май 2023: Запуск мейннета</h3>
      <p>
        Мейннет Sui заработал 3 мая 2023 года. Токен начал торговаться примерно по $1,30 при листинге,
        значительно выше цены закрытой продажи ($0,03) и публичной продажи ($0,10) на более ранних
        этапах.
      </p>

      <h3>Технология: параллельная обработка транзакций</h3>
      <p>
        Ключевое архитектурное отличие Sui от большинства блокчейнов первого уровня — параллельная, а
        не строго последовательная обработка независимых транзакций, что теоретически позволяет
        добиваться значительно более высокой пропускной способности сети.
      </p>

      <h3>2024–2025: Рост на фоне общего внимания к новым L1</h3>
      <p>
        После спада до менее $0,40 в конце 2023 года, на фоне бычьего цикла 2024–2025 годов SUI вырос
        до исторического максимума около <strong>$5,35</strong> в январе 2025 года.
      </p>
    </>
  ) : (
    <>
      <h3>Diem's Legacy: From a Shuttered Meta Project to a Public Blockchain</h3>
      <p>
        Sui's story doesn't start with a blank slate — it starts with the wreckage of one of crypto's
        most ambitious, and ultimately failed, projects: <strong>Diem</strong> (originally called Libra),
        Facebook's (Meta's) own cryptocurrency, shut down in 2022 under pressure from U.S. regulators.
        Part of the Diem engineering team, including <strong>Evan Cheng, Sam Blackshear, and George
        Danezis</strong>, took some of that work — notably the <strong>Move</strong> programming
        language originally built for Diem — to found <strong>Mysten Labs</strong> and build an
        independent public <Link href={`${glossaryBase}#blockchain`}>blockchain</Link>.
      </p>

      <h3>May 2023: Mainnet Launch</h3>
      <p>
        Sui's mainnet went live on May 3, 2023. The token began trading around $1.30 at listing,
        significantly above its earlier private sale price ($0.03) and public sale price ($0.10).
      </p>

      <h3>Technology: Parallel Transaction Processing</h3>
      <p>
        Sui's key architectural difference from most Layer 1 blockchains is that it processes independent
        transactions in parallel rather than strictly one after another, which in theory allows for
        significantly higher network throughput.
      </p>

      <h3>2024–2025: Growth Amid Renewed Attention to New L1s</h3>
      <p>
        After falling below $0.40 in late 2023, SUI rallied through the 2024–2025 bull cycle to an
        all-time high of roughly <strong>$5.35</strong> in January 2025.
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
        name="Sui"
        symbol="SUI"
        icon="💧"
        coingeckoId="sui"
        tagline={isRu ? 'Высокоскоростной L1 от бывших разработчиков Meta/Diem' : 'High-speed L1 built by former Meta/Diem engineers'}
        historyTitle={isRu ? 'История Sui: от закрытого Diem до независимого блокчейна' : "Sui History: From Meta's Shuttered Diem to an Independent Blockchain"}
        historyContent={historyContent}
        guide={guide}
      />
    </>
  );
}
