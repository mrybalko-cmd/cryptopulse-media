import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { STATUS_META } from '@/lib/regulationData';
import { getRegulationCountries, lastCheckedAt } from '@/lib/regulation';
import RegulationClient from './RegulationClient';
import RegulationGuide from './RegulationGuide';
import { SITE_NAME, SITE_URL } from '@/lib/site';

const BASE = SITE_URL;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isRu = locale === 'ru';

  const title = isRu
    ? 'Крипта по странам: карта регулирования'
    : 'Crypto regulation by country: world map';
  // Counted from the live data, never typed. The hard-coded "38" outlived
  // eight additions and claimed 38 countries on a page that listed 46.
  const count = (await getRegulationCountries()).length;
  const description = isRu
    ? `Интерактивная карта: в каких странах криптовалюта разрешена, ограничена или запрещена. Подробная информация о законах для ${count} стран.`
    : `Interactive map: in which countries is cryptocurrency legal, restricted, or banned. Detailed law information for ${count} countries.`;

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
      siteName: SITE_NAME,
      locale: isRu ? 'ru_RU' : 'en_US',
    },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default async function RegulationPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isRu = locale === 'ru';

  const countries = await getRegulationCountries();
  const legalCount      = countries.filter(c => c.status === 'legal').length;
  const restrictedCount = countries.filter(c => c.status === 'restricted').length;
  const bannedCount     = countries.filter(c => c.status === 'banned').length;

  // "Updated 2025" was written into the page by hand and stayed there while the
  // data moved on. This follows the newest per-country check.
  const updatedLabel = new Intl.DateTimeFormat(isRu ? 'ru-RU' : 'en-GB', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  }).format(new Date(lastCheckedAt(countries)));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: isRu ? 'Карта регулирования криптовалют по странам мира' : 'Crypto Regulation Map by Country',
    description: isRu
      ? `Статус криптовалютного регулирования для ${countries.length} стран. ${legalCount} разрешают, ${restrictedCount} ограничивают, ${bannedCount} запрещают.`
      : `Cryptocurrency regulation status for ${countries.length} countries. ${legalCount} permit, ${restrictedCount} restrict, ${bannedCount} ban.`,
    url: `${BASE}/${locale}/regulation`,
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: BASE,
    },
    creator: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: BASE,
    },
    // The newest per-country check, not a date typed once and forgotten.
    dateModified: lastCheckedAt(countries),
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
            ? `В каких странах можно свободно покупать биткоин и другие криптовалюты, где есть ограничения, а где торговля криптой полностью запрещена. Данные по ${countries.length} странам, последняя проверка — ${updatedLabel}.`
            : `Which countries allow you to freely buy bitcoin and other cryptocurrencies, where there are restrictions, and where crypto trading is completely banned. Data for ${countries.length} countries, last checked ${updatedLabel}.`}
        </p>

        {/* Last updated */}
        <div className="mt-3 flex items-center gap-1.5 text-xs text-muted">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
          {isRu ? `Данные проверены: ${updatedLabel}` : `Data verified: ${updatedLabel}`}
          <span className="text-border">·</span>
          <span>{isRu ? `${countries.length} стран` : `${countries.length} countries`}</span>
        </div>

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
      <RegulationClient locale={locale} countries={countries} />

      <RegulationGuide locale={locale} countries={countries} />
    </div>
  );
}
