import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { buildOg, buildTwitter, BASE } from '@/lib/metadata';
import { SITE_NAME, SITE_URL } from '@/lib/site';
import { TERMS } from '@/lib/legalTexts';
import { LegalDocument } from '@/components/legal/LegalDocument';

/**
 * Условия предоставления услуг — дословно документ юриста (lib/legalTexts.ts).
 *
 * Раньше здесь была страница «Данные и их использование»: на неё ведёт поле
 * `license` в разметке Dataset карты регулирования. Адрес не менялся, поэтому
 * разметка карты по-прежнему ссылается на действующие условия сайта.
 */

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'legal' });
  const isRu = locale === 'ru';
  const description = isRu
    ? `Условия использования сайта ${SITE_NAME}: право собственности, отсутствие гарантий и ограничение ответственности.`
    : `Terms of use of the ${SITE_NAME} website: ownership, no warranties and limitation of liability.`;

  return {
    title: t('termsTitle'),
    description,
    openGraph: buildOg({ url: `${BASE}/${locale}/terms`, title: t('termsTitle'), description, locale }),
    twitter: buildTwitter({ url: `${BASE}/${locale}/terms`, title: t('termsTitle'), description, locale }),
    alternates: {
      canonical: `${SITE_URL}/${locale}/terms`,
      languages: {
        ru: `${SITE_URL}/ru/terms`,
        en: `${SITE_URL}/en/terms`,
        'x-default': `${SITE_URL}/en/terms`,
      },
    },
  };
}

export default async function TermsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const doc = TERMS[locale === 'ru' ? 'ru' : 'en'];

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: locale === 'ru' ? 'Главная' : 'Home', item: `${BASE}/${locale}` },
      { '@type': 'ListItem', position: 2, name: doc.title, item: `${BASE}/${locale}/terms` },
    ],
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <LegalDocument doc={doc} />
    </div>
  );
}
