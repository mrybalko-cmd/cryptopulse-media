import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import CoinGuideLayout from '@/components/ui/CoinGuideLayout';
import { buildOg, buildTwitter, BASE } from '@/lib/metadata';
import { SHIB_QUOTES, SHIB_FAQ, SHIB_INVESTMENT_REFERENCE } from '@/lib/shibData';

type Props = { params: Promise<{ locale: string }> };
const SLUG = 'shib';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const isRu = locale === 'ru';
  const title = isRu ? 'Shiba Inu (SHIB): цена, история, калькулятор' : 'Shiba Inu (SHIB): price, history, calculator';
  const description = isRu
    ? 'История Shiba Inu: анонимный Ryoshi, сожжённые Виталиком Бутериным 410 триллионов SHIB, Shibarium L2 и реализм про $0.01. Калькулятор инвестиций.'
    : 'Shiba Inu history: the anonymous Ryoshi, the 410 trillion SHIB Vitalik Buterin burned, Shibarium L2 and honest talk about $0.01. Investment calculator.';
  return {
    // Absolute: the layout template appends ' | CryptoPulse.media', which costs
    // 20 characters and adds nothing here — the coin's name is already first.
    title: { absolute: title },
    description,
    keywords: isRu
      ? ['shiba inu shib история', 'ryoshi создатель shib', 'виталик бутерин shib', 'shibarium', 'shib калькулятор']
      : ['shiba inu shib history', 'ryoshi shib creator', 'vitalik buterin shib', 'shibarium', 'shib investment calculator'],
    openGraph: buildOg({ url: `${BASE}/${locale}/assets/shib`, title, description, locale }),
    twitter: buildTwitter({ url: `${BASE}/${locale}/assets/shib`, title, description, locale }),
    alternates: {
      canonical: `${BASE}/${locale}/assets/shib`,
      languages: {
        ru: `${BASE}/ru/assets/shib`,
        en: `${BASE}/en/assets/shib`,
        'x-default': `${BASE}/en/assets/shib`,
      },
    },
  };
}

const GUIDE = {
  stats: [
    { label: { ru: 'Год запуска', en: 'Launched' }, value: 'Авг. 2020' },
    { label: { ru: 'Запас', en: 'Supply' }, value: { ru: '~549T SHIB', en: '~549T SHIB' } },
    { label: { ru: 'Создатель', en: 'Creator' }, value: 'Ryoshi (анон.)' },
    { label: { ru: 'Стандарт', en: 'Standard' }, value: 'ERC-20' },
  ],
  investmentReference: SHIB_INVESTMENT_REFERENCE,
  faq: SHIB_FAQ,
  glossaryTerms: [
    { slug: 'altcoin', label: { ru: 'Альткоин', en: 'Altcoin' } },
    { slug: 'defi', label: { ru: 'DeFi', en: 'DeFi' } },
    { slug: 'dex', label: { ru: 'DEX', en: 'DEX' } },
    { slug: 'layer-2', label: { ru: 'Layer 2', en: 'Layer 2' } },
    { slug: 'market-cap', label: { ru: 'Рыночная капитализация', en: 'Market Cap' } },
  ],
};

export default async function ShibPage({ params }: Props) {
  const { locale } = await params;
  const isRu = locale === 'ru';
  const loc = isRu ? 'ru' : 'en';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: isRu ? 'Shiba Inu (SHIB): мем-монета с трагедией и экосистемой' : 'Shiba Inu (SHIB): Meme Coin with a Tragic Turn and an Ecosystem',
    description: isRu ? 'История SHIB от создания до Shibarium L2.' : 'SHIB history from creation to Shibarium L2.',
    inLanguage: locale,
    datePublished: '2024-01-01',
    dateModified: new Date().toISOString().slice(0, 10),
    author: { '@type': 'Organization', name: 'CryptoPulse.media', url: BASE },
    publisher: { '@type': 'Organization', name: 'CryptoPulse.media', url: BASE },
    mainEntityOfPage: `${BASE}/${locale}/assets/shib`,
  };

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: SHIB_FAQ.map(item => ({
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
      { '@type': 'ListItem', position: 3, name: 'Shiba Inu (SHIB)', item: `${BASE}/${locale}/assets/shib` },
    ],
  };

  const historyContent = (
    <>
      {isRu ? (
            <>
              <h3>2020: Ryoshi и трюк с Бутериным</h3>
              <p>В августе 2020 года анонимный разработчик под псевдонимом <strong>Ryoshi</strong> запустил Shiba Inu как ERC-20 токен на Ethereum. Изначальный выпуск: <strong>1 квадриллион (1,000,000,000,000,000) SHIB</strong>.</p>
              <p>Ryoshi намеренно отправил <strong>50% всего запаса</strong> (~500 трлн SHIB) на кошелёк Виталика Бутерина — адрес публичный, широко известный. Логика: «заблокировать» половину предложения у незаинтересованного держателя, создав искусственный дефицит. Это гениальный PR-ход: теперь с именем Бутерина связан SHIB.</p>

              <h3>2021: Бутерин сжигает $6.7 млрд — и жертвует ещё миллиард</h3>
              <p>Апрель 2021 года: SHIB стремительно растёт на фоне DOGE-мании. Бутерин неожиданно действует: он сжигает <strong>410,241,996,771,871 SHIB</strong> (~90% своих токенов), отправив их на «нулевой адрес» 0x000...0dEaD. На тот момент стоимость сожжённых токенов составляла около <strong>$6,7 млрд</strong>.</p>
              <p>Оставшиеся ~50 трлн SHIB Бутерин <strong>пожертвовал на COVID-фонд Индии</strong> (India COVID Crypto Relief Fund) под руководством предпринимателя Санделя Майни. Стоимость пожертвования: около <strong>$1 млрд</strong>. Это крупнейшее крипто-пожертвование в истории.</p>
              <p>ATH SHIB: <strong>$0,00008616</strong> в октябре 2021 года. Рост с момента создания: миллионы процентов.</p>

              <h3>2021: Экосистема — ShibaSwap, LEASH, BONE</h3>
              <p>После хайпа команда (теперь под руководством Shytoshi Kusama — другой анонимный разработчик) запустила <strong>ShibaSwap</strong> — DEX на Ethereum. Введены два новых токена: <strong>LEASH</strong> (первоначально привязан к DOGE, ограниченный запас 107,646 токенов) и <strong>BONE</strong> (токен управления ShibaSwap). Так SHIB превратился из одного токена в трёхтокенную экосистему.</p>

              <h3>2022–2023: Shibarium — собственный L2</h3>
              <p>Главная ставка команды SHIB на будущее: в августе 2023 года запущен <strong>Shibarium</strong> — Layer 2 блокчейн на Polygon Edge. Цель: снизить комиссии и увеличить скорость транзакций SHIB, также планируется механизм сжигания через транзакционные комиссии в BONE.</p>
              <p>Запуск был резонансным: первые дни Shibarium столкнулся с перегрузкой (Bridge застрял $1.7M ETH), однако проблемы были оперативно решены. К 2024 году Shibarium обработал более 500M транзакций.</p>

              <h3>2024–2025: Ryoshi «умирает» и зрелость экосистемы</h3>
              <p>В 2022 году Ryoshi опубликовал последний пост и удалил все предыдущие — символично «исчезнув». SHIB стал первой крупной мем-монетой с задокументированным «исчезновением» анонимного создателя.</p>
              <p>SHIB Academy, планы на игровой хаб Shib: The Metaverse, интеграции в AMM и NFT — экосистема продолжает расширяться. Вопрос достижения $0,01 математически невозможен при текущем предложении (требует капитализации $5,5 трлн — в 5 раз больше всего рынка), но сообщество продолжает верить в «сжигание до триллиона».</p>
            </>
          ) : (
            <>
              <h3>2020: Ryoshi and the Buterin Trick</h3>
              <p>In August 2020, an anonymous developer under the pseudonym <strong>Ryoshi</strong> launched Shiba Inu as an ERC-20 token on Ethereum. Initial supply: <strong>1 quadrillion (1,000,000,000,000,000) SHIB</strong>.</p>
              <p>Ryoshi intentionally sent <strong>50% of the total supply</strong> (~500 trillion SHIB) to Vitalik Buterin's wallet — a public, widely known address. Logic: "lock up" half the supply with an uninterested holder, creating artificial scarcity. A genius PR move: now Buterin's name is linked to SHIB.</p>

              <h3>2021: Buterin Burns $6.7B — and Donates Another Billion</h3>
              <p>April 2021: SHIB is surging amid DOGE mania. Buterin unexpectedly acts: he burns <strong>410,241,996,771,871 SHIB</strong> (~90% of his tokens), sending them to the "dead address" 0x000...0dEaD. At the time, the burned tokens were worth approximately <strong>$6.7 billion</strong>.</p>
              <p>The remaining ~50 trillion SHIB, Buterin <strong>donated to India's COVID relief fund</strong> (India COVID Crypto Relief Fund) led by entrepreneur Sandeep Nailwal. Donation value: approximately <strong>$1 billion</strong>. The largest crypto donation in history.</p>
              <p>SHIB ATH: <strong>$0.00008616</strong> in October 2021.</p>

              <h3>2021: Ecosystem — ShibaSwap, LEASH, BONE</h3>
              <p>After the hype, the team (now led by Shytoshi Kusama — another anonymous developer) launched <strong>ShibaSwap</strong> — a DEX on Ethereum. Two new tokens introduced: <strong>LEASH</strong> (initially pegged to DOGE, limited supply of 107,646 tokens) and <strong>BONE</strong> (ShibaSwap governance token). SHIB became a three-token ecosystem.</p>

              <h3>2022–2023: Shibarium — Its Own L2</h3>
              <p>The SHIB team's main bet on the future: in August 2023, <strong>Shibarium</strong> was launched — a Layer 2 blockchain on Polygon Edge. Goal: reduce fees and increase SHIB transaction speed, with a planned burn mechanism through transaction fees in BONE. The launch was bumpy: Shibarium encountered congestion in its first days (Bridge stuck $1.7M ETH), but problems were quickly resolved. By 2024, Shibarium processed more than 500M transactions.</p>

              <h3>2024–2025: Ryoshi "Dies" and Ecosystem Maturation</h3>
              <p>In 2022, Ryoshi published a final post and deleted all previous ones — symbolically "disappearing." SHIB became the first major meme coin with a documented "disappearance" of its anonymous creator.</p>
              <p>SHIB Academy, plans for the Shib: The Metaverse gaming hub, AMM and NFT integrations — the ecosystem continues to expand. Reaching $0.01 is mathematically impossible at the current supply (requires $5.5T market cap — 5x the entire market), but the community continues to believe in "burning to a trillion."</p>
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
        tagline={isRu ? '«Убийца Dogecoin» с анонимным создателем, 410T сожжённых токенов и собственным L2 блокчейном' : '"DOGE killer" with an anonymous creator, 410T burned tokens, and its own L2 blockchain'}
        historyTitle={isRu ? 'История Shiba Inu: мем с неожиданным поворотом' : 'Shiba Inu History: Meme with an Unexpected Turn'}
        historyContent={historyContent}
        guide={GUIDE}
        quotes={SHIB_QUOTES}
      />
    </>
  );
}
