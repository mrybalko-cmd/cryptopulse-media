import type { Metadata } from 'next';
import Link from 'next/link';
import { buildOg, BASE } from '@/lib/metadata';
import TonCalculator from '@/components/ui/TonCalculator';
import { TON_QUOTES, TON_FAQ } from '@/lib/tonData';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isRu = locale === 'ru';
  const title = isRu
    ? 'Toncoin (TON) — История, цена и калькулятор инвестиций'
    : 'Toncoin (TON) — History, Price & Investment Calculator';
  const description = isRu
    ? 'История TON: блокчейн Telegram, заблокированный SEC, воскрешённый сообществом и принятый обратно Дуровым. Hamster Kombat, 900M пользователей и интеграция с Telegram. Калькулятор инвестиций.'
    : 'TON history: the Telegram blockchain blocked by the SEC, resurrected by the community, and taken back by Durov. Hamster Kombat, 900M users and Telegram integration. Investment calculator.';
  return {
    title,
    description,
    keywords: isRu
      ? ['ton блокчейн', 'toncoin telegram', 'ton история', 'pavel durov криптовалюта', 'ton калькулятор']
      : ['ton blockchain', 'toncoin telegram', 'ton history', 'pavel durov cryptocurrency', 'ton investment calculator'],
    openGraph: buildOg({ url: `${BASE}/${locale}/assets/ton`, title, description, locale }),
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
    author: { '@type': 'Organization', name: 'CryptoPulse.media', url: BASE },
    publisher: { '@type': 'Organization', name: 'CryptoPulse.media', url: BASE },
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

  const glossaryBase = `/${locale}/glossary`;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <nav className="flex items-center gap-1.5 text-xs text-muted mb-8">
        <Link href={`/${locale}`} className="hover:text-accent transition-colors">{isRu ? 'Главная' : 'Home'}</Link>
        <span>›</span>
        <Link href={`/${locale}/assets`} className="hover:text-accent transition-colors">{isRu ? 'Крипто-активы' : 'Crypto Assets'}</Link>
        <span>›</span>
        <span className="text-foreground">Toncoin (TON)</span>
      </nav>

      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl font-bold text-accent">💎</span>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight">
              Toncoin <span className="text-muted font-normal text-2xl">TON</span>
            </h1>
            <p className="text-muted text-sm mt-1">
              {isRu ? 'Блокчейн братьев Дуров — от запрета SEC до официальной криптовалюты Telegram' : 'The Durov brothers\' blockchain — from SEC ban to Telegram\'s official cryptocurrency'}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          {[
            { label: isRu ? 'Год перезапуска' : 'Relaunched', value: '2021' },
            { label: isRu ? 'Запас' : 'Supply', value: isRu ? 'Инфляционный' : 'Inflationary' },
            { label: isRu ? 'Основатели' : 'Founders', value: 'П. и Н. Дуров' },
            { label: isRu ? 'Консенсус' : 'Consensus', value: 'PoS (BFT)' },
          ].map(s => (
            <div key={s.label} className="bg-card border border-border rounded-lg p-3">
              <p className="text-xs text-muted mb-1">{s.label}</p>
              <p className="text-sm font-semibold text-foreground">{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-14">
        <TonCalculator locale={locale} />
      </div>

      <article className="mb-14">
        <h2 className="text-2xl font-bold text-foreground mb-8">
          {isRu ? 'История TON: от мечты Дурова до Telegram-экосистемы' : 'TON History: From Durov\'s Dream to the Telegram Ecosystem'}
        </h2>
        <div className="prose prose-invert prose-sm max-w-none prose-headings:text-foreground prose-headings:font-semibold prose-p:text-muted prose-p:leading-relaxed prose-strong:text-foreground prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-li:text-muted">
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
        </div>
      </article>

      <section className="mb-14">
        <h2 className="text-2xl font-bold text-foreground mb-6">
          {isRu ? 'Что говорят о Toncoin' : 'What They Say About Toncoin'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {TON_QUOTES.map((q, i) => (
            <blockquote key={i} className={`bg-card border rounded-xl p-4 ${
              q.sentiment === 'bullish' ? 'border-positive/30' :
              q.sentiment === 'bearish' ? 'border-negative/30' : 'border-border'
            }`}>
              <p className="text-sm text-foreground leading-relaxed mb-3 italic">{q.quote[loc]}</p>
              <footer>
                <p className="text-sm font-semibold text-foreground">{q.author}</p>
                <p className="text-xs text-muted">{q.role[loc]}, {q.year}</p>
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      <section className="mb-14">
        <h2 className="text-2xl font-bold text-foreground mb-6">
          {isRu ? 'Часто задаваемые вопросы о TON' : 'Frequently Asked Questions About TON'}
        </h2>
        <div className="flex flex-col gap-4">
          {TON_FAQ.map((item, i) => (
            <details key={i} className="group bg-card border border-border rounded-xl overflow-hidden">
              <summary className="flex items-center justify-between p-4 cursor-pointer select-none font-semibold text-sm text-foreground list-none">
                {item.question[loc]}
                <span className="text-muted group-open:rotate-180 transition-transform shrink-0 ml-3">▾</span>
              </summary>
              <div className="px-4 pb-4 pt-0 text-sm text-muted leading-relaxed border-t border-border">
                <p className="pt-3">{item.answer[loc]}</p>
              </div>
            </details>
          ))}
        </div>
      </section>

      <section className="bg-card border border-border rounded-xl p-5">
        <h3 className="text-sm font-bold text-foreground mb-3">
          {isRu ? 'Изучите термины в глоссарии' : 'Learn the terms in our glossary'}
        </h3>
        <div className="flex flex-wrap gap-2">
          {[
            { slug: 'smart-contract', label: isRu ? 'Смарт-контракт' : 'Smart Contract' },
            { slug: 'staking', label: isRu ? 'Стейкинг' : 'Staking' },
            { slug: 'ico', label: 'ICO' },
            { slug: 'wallet', label: isRu ? 'Кошелёк' : 'Wallet' },
            { slug: 'nft', label: 'NFT' },
          ].map(t => (
            <Link key={t.slug} href={`${glossaryBase}#${t.slug}`}
              className="text-xs px-3 py-1.5 rounded-full bg-background border border-border text-muted hover:text-accent hover:border-accent/40 transition-colors">
              {t.label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
