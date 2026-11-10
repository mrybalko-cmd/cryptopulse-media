import { getTranslations, setRequestLocale } from 'next-intl/server';
import { buildOg, buildTwitter, BASE } from '@/lib/metadata';
import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL } from '@/lib/site';
import { PRIVACY } from '@/lib/legalTexts';
import { LegalDocument } from '@/components/legal/LegalDocument';

/**
 * Текст — дословно документ юриста, лежит в lib/legalTexts.ts. Дата
 * «Последнее обновление» — из документа, а не new Date(): раньше страница
 * каждый день сообщала, что политика изменилась.
 */

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'legal' });
  const isRu = locale === 'ru';
  const description = isRu
    ? `Как ${SITE_NAME} собирает, использует и раскрывает информацию о посетителях сайта.`
    : `How ${SITE_NAME} collects, uses and discloses information about website visitors.`;
  return {
    title: t('privacyTitle'),
    description,
    openGraph: buildOg({ url: `${BASE}/${locale}/privacy`, title: t('privacyTitle'), description, locale }),
    twitter: buildTwitter({ url: `${BASE}/${locale}/privacy`, title: t('privacyTitle'), description, locale }),
    alternates: {
      canonical: `${SITE_URL}/${locale}/privacy`,
      languages: { ru: `${SITE_URL}/ru/privacy`, en: `${SITE_URL}/en/privacy`, 'x-default': `${SITE_URL}/en/privacy` },
    },
  };
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const doc = PRIVACY[locale === 'ru' ? 'ru' : 'en'];

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: locale === 'ru' ? 'Главная' : 'Home', item: `${BASE}/${locale}` },
      { '@type': 'ListItem', position: 2, name: doc.title, item: `${BASE}/${locale}/privacy` },
    ],
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <LegalDocument doc={doc} />
    </div>
  );
}
