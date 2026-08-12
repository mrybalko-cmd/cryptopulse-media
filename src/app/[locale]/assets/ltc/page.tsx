import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import CoinGuideLayout from '@/components/ui/CoinGuideLayout';
import { buildOg, buildTwitter, BASE } from '@/lib/metadata';
import { LTC_QUOTES, LTC_FAQ, LTC_INVESTMENT_REFERENCE } from '@/lib/ltcData';

type Props = { params: Promise<{ locale: string }> };
const SLUG = 'ltc';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const isRu = locale === 'ru';
  const title = isRu ? 'Litecoin (LTC): цена, история, калькулятор' : 'Litecoin (LTC): price, history, calculator';
  const description = isRu
    ? 'Полная история Litecoin: как Чарли Ли создал «серебро к биткоиновому золоту». SegWit, Lightning Network, MimbleWimble, халвинги и почему LTC считается «тест-сетью» для биткоина. Калькулятор инвестиций.'
    : 'Complete Litecoin history: how Charlie Lee created "silver to Bitcoin\'s gold." SegWit, Lightning Network, MimbleWimble, halvings and why LTC is considered Bitcoin\'s "testnet." Investment calculator.';
  return {
    // Absolute: the layout template appends ' | CryptoPulse.media', which costs
    // 20 characters and adds nothing here — the coin's name is already first.
    title: { absolute: title },
    description,
    keywords: isRu
      ? ['litecoin ltc история', 'charlie lee', 'litecoin mimblewimble', 'ltc халвинг', 'ltc калькулятор']
      : ['litecoin ltc history', 'charlie lee', 'litecoin mimblewimble', 'ltc halving', 'ltc investment calculator'],
    openGraph: buildOg({ url: `${BASE}/${locale}/assets/ltc`, title, description, locale }),
    twitter: buildTwitter({ url: `${BASE}/${locale}/assets/ltc`, title, description, locale }),
    alternates: {
      canonical: `${BASE}/${locale}/assets/ltc`,
      languages: {
        ru: `${BASE}/ru/assets/ltc`,
        en: `${BASE}/en/assets/ltc`,
        'x-default': `${BASE}/en/assets/ltc`,
      },
    },
  };
}

const GUIDE = {
  stats: [
    { label: { ru: 'Год создания', en: 'Created' }, value: 'Окт. 2011' },
    { label: { ru: 'Макс. запас', en: 'Max Supply' }, value: '84M LTC' },
    { label: { ru: 'Создатель', en: 'Creator' }, value: 'Charlie Lee' },
    { label: { ru: 'Алгоритм', en: 'Algorithm' }, value: 'Scrypt PoW' },
  ],
  investmentReference: LTC_INVESTMENT_REFERENCE,
  faq: LTC_FAQ,
  glossaryTerms: [
    { slug: 'mining', label: { ru: 'Майнинг', en: 'Mining' } },
    { slug: 'halving', label: { ru: 'Халвинг', en: 'Halving' } },
    { slug: 'proof-of-work', label: { ru: 'Proof of Work', en: 'Proof of Work' } },
    { slug: 'wallet', label: { ru: 'Кошелёк', en: 'Wallet' } },
    { slug: 'fork', label: { ru: 'Форк', en: 'Fork' } },
  ],
};

export default async function LtcPage({ params }: Props) {
  const { locale } = await params;
  const isRu = locale === 'ru';
  const loc = isRu ? 'ru' : 'en';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: isRu ? 'Litecoin (LTC): «серебро» мира криптовалют' : 'Litecoin (LTC): The "Silver" of the Cryptocurrency World',
    description: isRu ? 'История Litecoin от создания до MimbleWimble интеграции.' : 'Litecoin history from creation to MimbleWimble integration.',
    inLanguage: locale,
    datePublished: '2024-01-01',
    dateModified: new Date().toISOString().slice(0, 10),
    author: { '@type': 'Organization', name: 'CryptoPulse.media', url: BASE },
    publisher: { '@type': 'Organization', name: 'CryptoPulse.media', url: BASE },
    mainEntityOfPage: `${BASE}/${locale}/assets/ltc`,
  };

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: LTC_FAQ.map(item => ({
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
      { '@type': 'ListItem', position: 3, name: 'Litecoin (LTC)', item: `${BASE}/${locale}/assets/ltc` },
    ],
  };

  const historyContent = (
    <>
      {isRu ? (
            <>
              <h3>2011: Форк биткоина за три дня</h3>
              <p>Чарли Ли — инженер Google — в октябре 2011 года создал Litecoin как форк биткоина с изменениями: алгоритм майнинга Scrypt (вместо SHA-256, чтобы противодействовать ASIC-монополии), время блока <strong>2,5 минуты</strong> (вместо 10), максимальное предложение <strong>84M LTC</strong> (вместо 21M BTC).</p>
              <p>Сам Ли назвал это «серебром к биткоиновому золоту» — более быстрые и дешёвые транзакции для повседневных платежей, пока биткоин служит средством сбережения.</p>

              <h3>2013–2015: Первый бычий рынок и первый халвинг</h3>
              <p>В ноябре 2013 года, вместе с биткоином, LTC пережил первый значительный рост — с $1 до <strong>$48</strong>. Обвал такой же стремительный: $1,5 к середине 2015 года. В августе 2015 года — первый <strong>халвинг</strong>: награда за блок снизилась с 50 до 25 LTC.</p>

              <h3>2017: SegWit и роль «тест-сети»</h3>
              <p>Ключевой вклад Litecoin в историю биткоина: <strong>SegWit (Segregated Witness)</strong> был впервые активирован на Litecoin в мае 2017 года — за несколько месяцев до Bitcoin. Это доказало безопасность обновления и дало сообществу Bitcoin уверенность в активации SegWit. Аналогично — Lightning Network впервые тестировалась на Litecoin.</p>
              <p>В декабре 2017 года LTC достиг ATH <strong>$375</strong> на волне бычьего рынка. Чарли Ли в тот же момент публично продал и пожертвовал <strong>все свои LTC</strong>, объяснив: «мне некомфортно влиять на цену своими твитами». Сообщество восприняло это неоднозначно.</p>

              <h3>2019: Второй халвинг</h3>
              <p>В августе 2019 года — второй халвинг LTC: награда снизилась с 25 до 12,5 LTC. Halving-ралли подняло LTC с $30 до $140 к июню 2019, после чего обвал.</p>

              <h3>2022: MimbleWimble Extension Blocks (MWEB)</h3>
              <p>Самое значимое технологическое обновление Litecoin за годы: в мае 2022 года активирован <strong>MWEB (MimbleWimble Extension Blocks)</strong> — опциональный уровень конфиденциальности на базе протокола MimbleWimble. Пользователи могут делать «конфиденциальные транзакции» с приватными суммами. Litecoin стал первой из «основных» монет с реальным privacy-слоем.</p>
              <p>Парадокс: несколько бирж (Coinbase, Binance) временно делистировали LTC после MWEB из опасений регуляторов. Позже вернули обратно.</p>

              <h3>2023–2025: Третий халвинг и неопределённость</h3>
              <p>В августе 2023 — третий халвинг: 12,5 → 6,25 LTC за блок. После халвинга цена фактически не выросла — что поставило под сомнение «халвинг-нарратив» для LTC. К 2025 году вопрос будущего Litecoin в мире Layer-2 и новых L1 остаётся открытым. Однако 12+ лет непрерывной работы, Grayscale LTC Trust и интеграции в крупные платёжные системы дают ему своё место в криптоистории.</p>
            </>
          ) : (
            <>
              <h3>2011: Bitcoin Fork in Three Days</h3>
              <p>Charlie Lee — a Google engineer — created Litecoin in October 2011 as a Bitcoin fork with changes: the Scrypt mining algorithm (instead of SHA-256, to counter ASIC monopolization), block time of <strong>2.5 minutes</strong> (instead of 10), maximum supply of <strong>84M LTC</strong> (instead of 21M BTC).</p>
              <p>Lee himself called it "silver to Bitcoin's gold" — faster and cheaper transactions for everyday payments, while Bitcoin serves as a store of value.</p>

              <h3>2013–2015: First Bull Market and First Halving</h3>
              <p>In November 2013, along with Bitcoin, LTC experienced its first significant rally — from $1 to <strong>$48</strong>. The crash was equally swift: $1.5 by mid-2015. In August 2015 — the first <strong>halving</strong>: block reward reduced from 50 to 25 LTC.</p>

              <h3>2017: SegWit and the "Testnet" Role</h3>
              <p>Litecoin's key contribution to Bitcoin's history: <strong>SegWit (Segregated Witness)</strong> was first activated on Litecoin in May 2017 — months before Bitcoin. This proved the upgrade's safety and gave the Bitcoin community confidence to activate SegWit. Similarly, Lightning Network was first tested on Litecoin.</p>
              <p>In December 2017, LTC reached ATH of <strong>$375</strong>. Charlie Lee at that very moment publicly sold and donated <strong>all his LTC</strong>, explaining: "I'm uncomfortable influencing the price with my tweets." The community reacted with mixed feelings.</p>

              <h3>2019: Second Halving</h3>
              <p>In August 2019 — the second LTC halving: reward reduced from 25 to 12.5 LTC. The halving rally pushed LTC from $30 to $140 by June 2019, followed by a crash.</p>

              <h3>2022: MimbleWimble Extension Blocks (MWEB)</h3>
              <p>Litecoin's most significant technological update in years: in May 2022, <strong>MWEB (MimbleWimble Extension Blocks)</strong> was activated — an optional privacy layer based on the MimbleWimble protocol. Users can make "confidential transactions" with private amounts. Litecoin became the first "major" coin with a real privacy layer. Paradoxically, several exchanges (Coinbase, Binance) temporarily delisted LTC after MWEB due to regulatory concerns. Later restored.</p>

              <h3>2023–2025: Third Halving and Uncertainty</h3>
              <p>In August 2023 — the third halving: 12.5 → 6.25 LTC per block. After the halving, the price essentially didn't rise — casting doubt on the "halving narrative" for LTC. By 2025, the question of Litecoin's future in a world of Layer-2 and new L1s remains open. However, 12+ years of continuous operation, the Grayscale LTC Trust, and integrations into major payment systems give it its place in crypto history.</p>
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
        tagline={isRu ? 'Первый серьёзный форк биткоина — «серебро к биткоиновому золоту» с 12-летней историей' : 'The first serious Bitcoin fork — "silver to Bitcoin\'s gold" with a 12-year history'}
        historyTitle={isRu ? 'История Litecoin: 12 лет верной службы крипторынку' : 'Litecoin History: 12 Years of Faithful Service to the Crypto Market'}
        historyContent={historyContent}
        guide={GUIDE}
        quotes={LTC_QUOTES}
      />
    </>
  );
}
