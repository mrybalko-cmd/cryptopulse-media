import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { REGULATION_DATA, STATUS_META } from '@/lib/regulationData';
import RegulationClient from './RegulationClient';

const BASE = 'https://cryptopulse.media';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isRu = locale === 'ru';

  const title = isRu
    ? 'Криптовалюты по странам мира: карта регулирования 2025'
    : 'Crypto Regulation by Country: World Map 2025';
  const description = isRu
    ? 'Интерактивная карта: в каких странах криптовалюта разрешена, ограничена или запрещена. Подробная информация о законах для 38 стран.'
    : 'Interactive map: in which countries is cryptocurrency legal, restricted, or banned. Detailed law information for 38 countries.';

  return {
    title,
    description,
    alternates: {
      canonical: `${BASE}/${locale}/regulation`,
      languages: {
        ru: `${BASE}/ru/regulation`,
        en: `${BASE}/en/regulation`,
        'x-default': `${BASE}/en/regulation`,
      },
    },
    openGraph: {
      type: 'website',
      title,
      description,
      url: `${BASE}/${locale}/regulation`,
      siteName: 'CryptoPulse.media',
      locale: isRu ? 'ru_RU' : 'en_US',
    },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default async function RegulationPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isRu = locale === 'ru';

  const legalCount      = REGULATION_DATA.filter(c => c.status === 'legal').length;
  const restrictedCount = REGULATION_DATA.filter(c => c.status === 'restricted').length;
  const bannedCount     = REGULATION_DATA.filter(c => c.status === 'banned').length;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: isRu ? 'Карта регулирования криптовалют по странам мира' : 'Crypto Regulation Map by Country',
    description: isRu
      ? `Статус криптовалютного регулирования для ${REGULATION_DATA.length} стран. ${legalCount} разрешают, ${restrictedCount} ограничивают, ${bannedCount} запрещают.`
      : `Cryptocurrency regulation status for ${REGULATION_DATA.length} countries. ${legalCount} permit, ${restrictedCount} restrict, ${bannedCount} ban.`,
    url: `${BASE}/${locale}/regulation`,
    publisher: {
      '@type': 'Organization',
      name: 'CryptoPulse.media',
      url: BASE,
    },
    dateModified: '2025-06-01',
    inLanguage: locale,
    about: { '@type': 'Thing', name: isRu ? 'Регулирование криптовалют' : 'Cryptocurrency regulation' },
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: isRu ? 'Главная' : 'Home', item: `${BASE}/${locale}` },
      { '@type': 'ListItem', position: 2, name: isRu ? 'Карта регулирования' : 'Regulation Map', item: `${BASE}/${locale}/regulation` },
    ],
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight mb-3">
          {isRu
            ? 'Криптовалюты по странам мира: карта регулирования'
            : 'Crypto Regulation by Country: World Map'}
        </h1>
        <p className="text-muted text-sm sm:text-base leading-relaxed max-w-2xl">
          {isRu
            ? `В каких странах можно свободно покупать биткоин и другие криптовалюты, где есть ограничения, а где торговля криптой полностью запрещена. Данные по ${REGULATION_DATA.length} странам, обновлено в 2025 году.`
            : `Which countries allow you to freely buy bitcoin and other cryptocurrencies, where there are restrictions, and where crypto trading is completely banned. Data for ${REGULATION_DATA.length} countries, updated 2025.`}
        </p>

        {/* Disclaimer */}
        <div className="mt-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-xs text-muted leading-relaxed">
          <strong className="text-foreground">
            {isRu ? '⚠️ Важно: ' : '⚠️ Important: '}
          </strong>
          {isRu
            ? 'Информация носит ознакомительный характер. Законодательство меняется — перед принятием решений проконсультируйтесь с юристом в вашей стране.'
            : 'This information is for educational purposes only. Laws change — consult a legal professional in your country before making decisions.'}
        </div>
      </div>

      {/* Interactive client part: stats + map + list */}
      <RegulationClient locale={locale} />

      {/* SEO text block */}
      <section className="mt-14 pt-8 border-t border-border">
        <h2 className="text-lg font-bold text-foreground mb-4">
          {isRu ? 'Как работает регулирование криптовалют' : 'How crypto regulation works'}
        </h2>
        <div className="prose prose-sm max-w-none
          prose-headings:text-foreground prose-headings:font-semibold
          prose-p:text-muted prose-p:leading-relaxed
          prose-strong:text-foreground
          prose-li:text-muted">
          {isRu ? (
            <>
              <p>Каждая страна самостоятельно решает, как относиться к криптовалютам. Единого мирового стандарта нет, поэтому ситуация кардинально отличается от страны к стране.</p>

              <h3>🟢 Разрешено — что это значит?</h3>
              <p>В странах с разрешённым статусом криптовалюты можно свободно покупать, продавать, хранить и во многих случаях использовать для расчётов. Как правило, действуют биржи с государственными лицензиями. Примеры: Германия, Швейцария, США, Япония, ОАЭ.</p>

              <h3>🟡 С ограничениями — что запрещено?</h3>
              <p>В этих странах крипту можно держать и торговать, но с важными оговорками: запрет на оплату товаров и услуг, обязательный KYC, высокие налоги или разрешение торговли только через государственные платформы. Примеры: Россия, Индия, Турция, Южная Корея.</p>

              <h3>🔴 Запрещено — насколько серьёзно?</h3>
              <p>Страны с запретом официально объявили крипто-операции незаконными. Степень исполнения закона варьируется: Китай блокирует доступ на технологическом уровне, в Алжире предусмотрено уголовное преследование. Несмотря на запреты, население часто использует P2P-биржи и VPN.</p>

              <h3>Что такое MiCA?</h3>
              <p>MiCA (Markets in Crypto-Assets) — регламент ЕС, вступивший в полную силу в 2024 году. Он устанавливает единые правила для всех 27 стран ЕС: лицензирование бирж (CASP), регулирование стейблкоинов и защиту потребителей. Компания с лицензией MiCA в одной стране ЕС автоматически может работать во всех.</p>
            </>
          ) : (
            <>
              <p>Each country decides independently how to treat cryptocurrencies. There is no global standard, so the situation differs dramatically from country to country.</p>

              <h3>🟢 Legal — what does it mean?</h3>
              <p>In countries with legal status, cryptocurrencies can be freely bought, sold, held, and in many cases used for payments. Licensed exchanges typically operate. Examples: Germany, Switzerland, USA, Japan, UAE.</p>

              <h3>🟡 Restricted — what is banned?</h3>
              <p>In these countries crypto can be held and traded, but with important caveats: ban on paying for goods and services, mandatory KYC, high taxes, or trading only through state-approved platforms. Examples: Russia, India, Turkey, South Korea.</p>

              <h3>🔴 Banned — how serious is it?</h3>
              <p>Countries with a ban have officially declared crypto operations illegal. Enforcement varies: China blocks access at the infrastructure level, while Algeria has criminal prosecution. Despite bans, populations often use P2P exchanges and VPNs.</p>

              <h3>What is MiCA?</h3>
              <p>MiCA (Markets in Crypto-Assets) is the EU regulation that came into full force in 2024. It sets unified rules for all 27 EU countries: exchange licensing (CASP), stablecoin regulation, and consumer protection. A company with a MiCA licence in one EU country can automatically operate in all of them.</p>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
