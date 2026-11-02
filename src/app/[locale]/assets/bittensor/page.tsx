import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { buildOg, buildTwitter, BASE } from '@/lib/metadata';
import CoinGuideLayout from '@/components/ui/CoinGuideLayout';
import { COIN_GUIDES } from '@/lib/coinGuides';
import { ORGANIZATION_ID } from '@/lib/organizationSchema';

type Props = { params: Promise<{ locale: string }> };
const SLUG = 'bittensor';
const guide = COIN_GUIDES[SLUG];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const isRu = locale === 'ru';
  const title = isRu ? 'Bittensor (TAO): цена, история, калькулятор' : 'Bittensor (TAO): price, history, calculator';
  const description = isRu
    ? 'Как Bittensor платит TAO за работу в машинном обучении, почему копирует потолок биткоина в 21 миллион и что изменил первый халвинг в декабре 2025 года.'
    : 'How Bittensor pays TAO for machine learning work, why it copies Bitcoin\'s 21 million cap and what changed after the first halving in December 2025. History and a calculator.';

  return {
    // Absolute: the layout template appends the site name, which adds nothing here.
    title: { absolute: title },
    description,
    keywords: isRu
      ? ['bittensor история', 'tao токен', 'bittensor калькулятор', 'bittensor цена', 'курс tao']
      : ['bittensor history', 'tao token', 'bittensor investment calculator', 'bittensor price', 'tao price'],
    openGraph: buildOg({ url: `${BASE}/${locale}/assets/${SLUG}`, title, description, locale }),
    twitter: buildTwitter({ url: `${BASE}/${locale}/assets/${SLUG}`, title, description, locale }),
    alternates: {
      canonical: `${BASE}/${locale}/assets/${SLUG}`,
      languages: { ru: `${BASE}/ru/assets/${SLUG}`, en: `${BASE}/en/assets/${SLUG}`, 'x-default': `${BASE}/en/assets/${SLUG}` },
    },
  };
}

export default async function BittensorPage({ params }: Props) {
  const { locale } = await params;
  const isRu = locale === 'ru';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: isRu ? 'Bittensor (TAO): рынок машинного обучения' : 'Bittensor (TAO): a market for machine learning',
    description: isRu ? 'Как Bittensor платит TAO за работу в машинном обучении, почему копирует потолок биткоина в 21 миллион и что изменил первый халвинг в декабре 2025 года.' : 'How Bittensor pays TAO for machine learning work, why it copies Bitcoin\'s 21 million cap and what changed after the first halving in December 2025. History and a calculator.',
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
      { '@type': 'ListItem', position: 3, name: 'Bittensor (TAO)', item: `${BASE}/${locale}/assets/${SLUG}` },
    ],
  };

  const historyContent = isRu ? (
    <>
      <h3>Биткоин для нейросетей</h3>
      <p>
        Bittensor устроен по образцу биткоина: тот же потолок в 21 миллион токенов, те же <Link href={`/${locale}/glossary/halving`}>халвинги</Link>, никакой предпродажи и доли основателей. Только платит сеть не за подбор хеша, а за полезную работу в машинном обучении, и сама решает, чья работа полезна.
      </p>

      <h3>От статьи до сети</h3>
      <p>
        Проект начали в 2019 году <strong>Джейкоб Стивз</strong> и <strong>Ала Шаабана</strong>, а <Link href={`/${locale}/glossary/whitepaper`}>whitepaper</Link> подписан псевдонимом Yuma Rao. Основная сеть Finney заработала в марте 2023 года, и 14 мая того же года TAO опустился до своего минимума, 30,83 доллара. Исторический максимум, 757,60 доллара, пришёлся на 7 марта 2024 года.
      </p>

      <h3>Подсети</h3>
      <p>
        Работа в Bittensor разбита на подсети, у каждой своя задача: генерация текста, прогноз цен и так далее. В феврале 2025 года обновление dynamic TAO дало каждой подсети собственный токен, и теперь можно вложиться в конкретную подсеть.
      </p>

      <h3>Первый халвинг</h3>
      <p>
        В декабре 2025 года прошёл первый халвинг, который, по подсчёту Grayscale, урезал выпуск примерно с 7200 TAO в день до 3600. Срок халвинга Bittensor определяет по общему числу выпущенных токенов, а не по номеру блока, как биткоин.
      </p>
    </>
  ) : (
    <>
      <h3>A market for models</h3>
      <p>
        <strong>Jacob Steeves</strong> and <strong>Ala Shaabana</strong> started Bittensor in 2019 with a simple idea: pay people in a token for useful machine learning work, and let the network judge whose work is useful. The <Link href={`/${locale}/glossary/whitepaper`}>whitepaper</Link> was signed with the pseudonym Yuma Rao.
      </p>

      <h3>2023: Finney and a fair launch</h3>
      <p>
        The main network, called Finney, launched in March 2023. TAO had no presale and no allocation for founders, and miners and validators earned every token. The supply is capped at 21 million, the same as Bitcoin. TAO hit its lowest recorded price of 30.83 dollars on 14 May 2023.
      </p>

      <h3>Subnets and dynamic TAO</h3>
      <p>
        Bittensor splits work into subnets, each with its own task, such as text generation or price forecasting. In February 2025 the dynamic TAO upgrade gave every subnet its own token, so you can back a specific subnet.
      </p>

      <h3>The first halving</h3>
      <p>
        TAO reached its all-time high of 757.60 dollars on 7 March 2024. The first <Link href={`/${locale}/glossary/halving`}>halving</Link> arrived in December 2025 and cut daily issuance from about 7,200 TAO to 3,600, according to Grayscale. Bittensor times its halvings by total supply; Bitcoin times them by block count.
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
        name="Bittensor"
        symbol="TAO"
        icon="τ"
        coingeckoId="bittensor"
        tagline={isRu ? 'Сеть, которая платит за машинное обучение' : 'A network that pays for machine learning'}
        historyTitle={isRu ? 'История Bittensor: ИИ по правилам биткоина' : 'Bittensor history: AI on Bitcoin\'s rules'}
        historyContent={historyContent}
        guide={guide}
      />
    </>
  );
}
