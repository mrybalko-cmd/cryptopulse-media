import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { STATUS_META } from '@/lib/regulationData';
import { getRegulationCountries, lastCheckedAt } from '@/lib/regulation';
import RegulationClient from './RegulationClient';
import RegulationGuide, { regulationFaq } from './RegulationGuide';
import PopularSidebar from '@/components/ui/PopularSidebar';
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

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: regulationFaq(isRu).map(([q, a]) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };

  return (
    <div className="max-w-[1320px] mx-auto px-4 sm:px-6 py-8 sm:py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      {/* Разворот с картой, затем указатель всех стран */}
      <RegulationClient locale={locale} countries={countries} />

      {/* Текст под картой идёт в одну колонку с рельсом «Популярное» —
          как на /assets, /rates и /exchanges */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_256px] gap-6 lg:gap-8">
        <div className="min-w-0">
          <RegulationGuide locale={locale} countries={countries} />

          {/* Дисклеймер внизу: он нужен, но не должен быть вторым, что видит читатель */}
          <p className="mt-8 pt-4 border-t border-border text-[11px] leading-relaxed text-muted">
            {isRu
              ? 'Материал носит справочный характер и не является инвестиционной или налоговой консультацией. Законы меняются — перед решением сверьтесь с сайтом регулятора вашей страны.'
              : 'This is reference material, not investment or tax advice. Laws change — check your own regulator before acting.'}
          </p>
        </div>
        <PopularSidebar locale={locale} />
      </div>
    </div>
  );
}
