import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import CoinGuideLayout from '@/components/ui/CoinGuideLayout';
import { buildOg, buildTwitter, BASE } from '@/lib/metadata';
import { TON_QUOTES, TON_FAQ, TON_INVESTMENT_REFERENCE } from '@/lib/tonData';
import { SITE_NAME } from '@/lib/site';

type Props = { params: Promise<{ locale: string }> };
const SLUG = 'ton';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const isRu = locale === 'ru';
  const title = isRu
    ? 'Gram (GRAM), ранее Toncoin: цена и история'
    : 'Gram (GRAM), formerly Toncoin: price and history';
  const description = isRu
    ? 'Gram (бывший Toncoin) — монета экосистемы Telegram: цена, история ребрендинга и калькулятор инвестиций.'
    : 'Gram, formerly Toncoin — the coin of the Telegram ecosystem: price, the story of the rebrand, and an investment calculator.';
  return {
    // Absolute: the layout template appends ` | ${SITE_NAME}`, which costs
    // 20 characters and adds nothing here — the coin's name is already first.
    title: { absolute: title },
    description,
    keywords: isRu
      ? ['gram монета', 'toncoin gram', 'ton ребрендинг', 'gram цена', 'telegram криптовалюта']
      : ['gram coin', 'toncoin gram', 'ton rebrand', 'gram price', 'telegram cryptocurrency'],
    openGraph: buildOg({ url: `${BASE}/${locale}/assets/ton`, title, description, locale }),
    twitter: buildTwitter({ url: `${BASE}/${locale}/assets/ton`, title, description, locale }),
    alternates: {
      canonical: `${BASE}/${locale}/assets/ton`,
      languages: {
        ru: `${BASE}/ru/assets/ton`,
        en: `${BASE}/en/assets/ton`,
        'x-default': `${BASE}/en/assets/ton`,
      },
    },
  };
}

const GUIDE = {
  stats: [
    { label: { ru: 'Год перезапуска', en: 'Relaunched' }, value: '2021' },
    { label: { ru: 'Запас', en: 'Supply' }, value: { ru: 'Инфляционный', en: 'Inflationary' } },
    { label: { ru: 'Основатели', en: 'Founders' }, value: 'П. и Н. Дуров' },
    { label: { ru: 'Консенсус', en: 'Consensus' }, value: 'PoS (BFT)' },
  ],
  investmentReference: TON_INVESTMENT_REFERENCE,
  faq: TON_FAQ,
  glossaryTerms: [
    { slug: 'smart-contract', label: { ru: 'Смарт-контракт', en: 'Smart Contract' } },
    { slug: 'staking', label: { ru: 'Стейкинг', en: 'Staking' } },
    { slug: 'ico', label: { ru: 'ICO', en: 'ICO' } },
    { slug: 'wallet', label: { ru: 'Кошелёк', en: 'Wallet' } },
    { slug: 'nft', label: { ru: 'NFT', en: 'NFT' } },
  ],
};

export default async function TonPage({ params }: Props) {
  const { locale } = await params;
  const isRu = locale === 'ru';
  const loc = isRu ? 'ru' : 'en';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: isRu ? 'Toncoin (TON): от блокчейна Telegram до народной криптосети' : 'Toncoin (TON): From Telegram Blockchain to a People\'s Crypto Network',
    description: isRu ? 'Полная история TON от ICO 2018 до интеграции с Telegram 2023.' : 'Complete TON history from 2018 ICO to Telegram integration in 2023.',
    inLanguage: locale,
    datePublished: '2024-01-01',
    dateModified: new Date().toISOString().slice(0, 10),
    author: { '@type': 'Organization', name: '${SITE_NAME}', url: BASE },
    publisher: { '@type': 'Organization', name: '${SITE_NAME}', url: BASE },
    mainEntityOfPage: `${BASE}/${locale}/assets/ton`,
  };

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: TON_FAQ.map(item => ({
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
      { '@type': 'ListItem', position: 3, name: 'Toncoin (TON)', item: `${BASE}/${locale}/assets/ton` },
    ],
  };

  const historyContent = (
    <>
      {isRu ? (
            <>
              <h3>2018: ICO на $1,7 млрд — и немедленный иск SEC</h3>
              <p>В 2018 году братья Дуров — Павел и Николай — провели одно из крупнейших ICO в истории: Telegram собрал <strong>$1,7 млрд</strong> от 175 аккредитованных инвесторов на разработку блокчейна TON (Telegram Open Network). Проект обещал скорость (млн транзакций в секунду), интеграцию с мессенджером на 400 млн пользователей и кошелёк прямо в Telegram.</p>
              <p>В октябре 2019 года SEC подала иск против Telegram: регулятор счёл GRAM (будущий TON-токен) незарегистрированной ценной бумагой. В мае 2020 года Telegram проиграл судебную битву, вернул инвесторам $1,2 млрд и официально свернул проект.</p>

              <h3>2020–2021: Воскрешение сообществом</h3>
              <p>Николай Дуров выложил исходный код TON в открытый доступ. Группа разработчиков взяла код и запустила независимый проект <strong>The Open Network</strong> (TON) в мае 2020 года под управлением сообщества. Никакого ICO, никаких инвесторов — только энтузиасты.</p>
              <p>В 2021 году монета (переименованная в Toncoin) начала торговаться. Экосистема медленно росла без прямого участия Telegram.</p>

              <h3>2022–2023: Официальное возвращение Дурова</h3>
              <p>В 2022 году Telegram официально принял TON как «предпочтительный блокчейн Telegram». В 2023 году Павел Дуров лично анонсировал интеграцию: кошелёк @wallet в Telegram, Fragment (биржа юзернеймов и номеров на TON), Stars (внутривалюта для оплаты контента).</p>
              <p>TON стал единственным блокчейном, интегрированным в мессенджер с аудиторией <strong>900 млн пользователей</strong>. Это уникальный дистрибуционный канал для онбординга в крипту.</p>

              <h3>2024: Hamster Kombat и рекорды</h3>
              <p>Игра Hamster Kombat в Telegram привлекла <strong>300 млн пользователей</strong> за несколько месяцев. Механика проста: нажимать на хомяка и зарабатывать очки, которые конвертировались в токен HMSTR на блокчейне TON. Несмотря на хайп (и последовавший провал цены HMSTR), это показало: TON-экосистема способна онбордить сотни миллионов человек.</p>
              <p>В 2024 году арест Павла Дурова во Франции вызвал краткосрочный обвал TON. Однако после его выхода под залог и заявлений о сотрудничестве с властями, цена восстановилась.</p>

              <h3>2025: Интеграция и вызовы</h3>
              <p>TON продолжает экспансию: NFT-маркетплейс Getgems, DeFi-протоколы, рекламная платформа Telegram Ads с расчётами в TON. Критики указывают на высокую степень централизации (Telegram контролирует ключевую инфраструктуру) и юридические риски.</p>
            </>
          ) : (
            <>
              <h3>2018: $1.7B ICO — and Immediate SEC Lawsuit</h3>
              <p>In 2018, the Durov brothers — Pavel and Nikolai — conducted one of the largest ICOs in history: Telegram raised <strong>$1.7 billion</strong> from 175 accredited investors to develop the TON (Telegram Open Network) blockchain. The project promised speed (millions of transactions per second), integration with a 400 million user messenger, and a wallet right inside Telegram.</p>
              <p>In October 2019, the SEC sued Telegram: the regulator deemed GRAM (the future TON token) an unregistered security. In May 2020, Telegram lost the legal battle, returned $1.2 billion to investors, and officially shut down the project.</p>

              <h3>2020–2021: Community Resurrection</h3>
              <p>Nikolai Durov released TON's source code publicly. A group of developers took the code and launched an independent project <strong>The Open Network</strong> (TON) in May 2020, community-governed. No ICO, no investors — just enthusiasts.</p>
              <p>In 2021, the coin (renamed Toncoin) started trading. The ecosystem slowly grew without Telegram's direct involvement.</p>

              <h3>2022–2023: Durov's Official Return</h3>
              <p>In 2022, Telegram officially adopted TON as "Telegram's preferred blockchain." In 2023, Pavel Durov personally announced integration: the @wallet in Telegram, Fragment (username and number exchange on TON), Stars (in-app currency for content payments).</p>
              <p>TON became the only blockchain integrated into a messenger with <strong>900 million users</strong>. This is a unique distribution channel for crypto onboarding.</p>

              <h3>2024: Hamster Kombat and Records</h3>
              <p>The Telegram game Hamster Kombat attracted <strong>300 million users</strong> in just a few months. The mechanic was simple: tap the hamster and earn points convertible to the HMSTR token on the TON blockchain. Despite the hype (and the subsequent HMSTR price crash), it showed: the TON ecosystem can onboard hundreds of millions of people.</p>
              <p>In 2024, Pavel Durov's arrest in France caused a short-term TON crash. However, after his release on bail and statements about cooperating with authorities, the price recovered.</p>

              <h3>2025: Integration and Challenges</h3>
              <p>TON continues expanding: Getgems NFT marketplace, DeFi protocols, Telegram Ads advertising platform with TON payments. Critics point to high centralization (Telegram controls key infrastructure) and legal risks.</p>
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
        tagline={isRu ? 'Блокчейн братьев Дуров — от запрета SEC до официальной криптовалюты Telegram' : 'The Durov brothers\' blockchain — from SEC ban to Telegram\'s official cryptocurrency'}
        historyTitle={isRu ? 'История TON: от мечты Дурова до Telegram-экосистемы' : 'TON History: From Durov\'s Dream to the Telegram Ecosystem'}
        historyContent={historyContent}
        guide={GUIDE}
        quotes={TON_QUOTES}
      />
    </>
  );
}
