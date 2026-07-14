import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { buildOg, BASE } from '@/lib/metadata';
import CoinGuideLayout from '@/components/ui/CoinGuideLayout';
import { COIN_GUIDES } from '@/lib/coinGuides';

type Props = { params: Promise<{ locale: string }> };
const SLUG = 'near';
const guide = COIN_GUIDES[SLUG];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const isRu = locale === 'ru';
  const title = isRu ? 'NEAR Protocol (NEAR) — История, цена и калькулятор инвестиций' : 'NEAR Protocol (NEAR) — History, Price & Investment Calculator';
  const description = isRu
    ? 'История NEAR Protocol: от исследований в области машинного обучения до шардированного блокчейна и разворота к теме ИИ. Калькулятор инвестиций в NEAR.'
    : 'The history of NEAR Protocol: from machine learning research to a sharded blockchain and its pivot toward AI. NEAR investment calculator.';

  return {
    title,
    description,
    keywords: isRu
      ? ['near protocol история', 'near токен', 'near калькулятор', 'шардинг блокчейн', 'near ии']
      : ['near protocol history', 'near token', 'near investment calculator', 'blockchain sharding', 'near ai'],
    openGraph: buildOg({ url: `${BASE}/${locale}/assets/${SLUG}`, title, description, locale }),
    alternates: {
      canonical: `${BASE}/${locale}/assets/${SLUG}`,
      languages: { ru: `${BASE}/ru/assets/${SLUG}`, en: `${BASE}/en/assets/${SLUG}` },
    },
  };
}

export default async function NearPage({ params }: Props) {
  const { locale } = await params;
  const isRu = locale === 'ru';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: isRu ? 'NEAR Protocol (NEAR): история шардированного блокчейна' : 'NEAR Protocol (NEAR): History of the Sharded Blockchain',
    description: isRu ? 'История NEAR от исследований машинного обучения до фокуса на ИИ.' : 'The history of NEAR from machine learning research to its AI focus.',
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
      { '@type': 'ListItem', position: 3, name: 'NEAR Protocol (NEAR)', item: `${BASE}/${locale}/assets/${SLUG}` },
    ],
  };

  const glossaryBase = `/${locale}/glossary`;

  const historyContent = isRu ? (
    <>
      <h3>2018: От машинного обучения к блокчейну</h3>
      <p>
        NEAR основали <strong>Илья Полосухин</strong> (бывший инженер Google) и <strong>Александр
        Скиданов</strong> (бывший директор по разработке в базе данных MemSQL). Они познакомились через
        стартап-акселератор <strong>Y Combinator</strong>. Изначально их компания занималась исследованиями
        в области машинного обучения, но в 2018 году команда переключилась на разработку собственного{' '}
        <Link href={`${glossaryBase}#blockchain`}>блокчейна</Link>.
      </p>

      <h3>2020: Запуск основной сети</h3>
      <p>
        Мейннет NEAR (фаза II) заработал в апреле 2020 года. В марте 2021 года был запущен «Rainbow
        Bridge» — мост, соединяющий NEAR с Ethereum и позволяющий переводить активы между сетями.
      </p>

      <h3>Технология: динамический шардинг Nightshade</h3>
      <p>
        Ключевая технология NEAR — «<strong>Nightshade</strong>», разновидность шардинга (разделения
        сети на параллельно работающие части), которая динамически подстраивается под текущую нагрузку
        сети, теоретически позволяя масштабироваться без потери децентрализации.
      </p>

      <h3>2022: Исторический максимум</h3>
      <p>
        На фоне общего бычьего рынка токен NEAR достиг исторического максимума около{' '}
        <strong>$20,37</strong> в середине января 2022 года.
      </p>

      <h3>2023–2024: Разворот к теме искусственного интеллекта</h3>
      <p>
        Начиная с 2023–2024 годов команда NEAR сместила публичный фокус проекта на концепцию «блокчейна
        для ИИ» — идею использовать децентрализованную инфраструктуру для хранения данных и обучения
        открытых моделей искусственного интеллекта, в противовес контролю над ИИ со стороны нескольких
        крупных технологических корпораций.
      </p>
    </>
  ) : (
    <>
      <h3>2018: From Machine Learning to Blockchain</h3>
      <p>
        NEAR was founded by <strong>Illia Polosukhin</strong> (a former Google engineer) and{' '}
        <strong>Alexander Skidanov</strong> (a former director of engineering at the database company
        MemSQL). They met through the <strong>Y Combinator</strong> startup accelerator. Their company
        originally worked on machine learning research, but in 2018 the team pivoted to building its own{' '}
        <Link href={`${glossaryBase}#blockchain`}>blockchain</Link>.
      </p>

      <h3>2020: Mainnet Launch</h3>
      <p>
        NEAR's mainnet (Phase II) went live in April 2020. In March 2021, the "Rainbow Bridge" launched,
        connecting NEAR to Ethereum and allowing assets to move between the two networks.
      </p>

      <h3>Technology: Dynamic Nightshade Sharding</h3>
      <p>
        NEAR's core technology is <strong>"Nightshade,"</strong> a form of sharding (splitting the network
        into parts that run in parallel) that dynamically adapts to current network load, theoretically
        allowing it to scale without sacrificing decentralization.
      </p>

      <h3>2022: An All-Time High</h3>
      <p>
        Amid the broader bull market, the NEAR token reached an all-time high of roughly{' '}
        <strong>$20.37</strong> in mid-January 2022.
      </p>

      <h3>2023–2024: A Pivot Toward Artificial Intelligence</h3>
      <p>
        Starting in 2023–2024, the NEAR team shifted the project's public focus toward a "blockchain for
        AI" concept — the idea of using decentralized infrastructure to store data and train open AI
        models, as a counterweight to control over AI by a handful of large tech corporations.
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
        name="NEAR Protocol"
        symbol="NEAR"
        icon="Ⓝ"
        coingeckoId="near"
        tagline={isRu ? 'Шардированный блокчейн с прицелом на массовое ИИ- и веб-принятие' : 'A sharded blockchain aiming for mainstream AI and web adoption'}
        historyTitle={isRu ? 'История NEAR Protocol: от машинного обучения до ИИ' : 'NEAR Protocol History: From Machine Learning to AI'}
        historyContent={historyContent}
        guide={guide}
      />
    </>
  );
}
