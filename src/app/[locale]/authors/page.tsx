// Час вместо пяти минут — причина в src/app/[locale]/news/[slug]/page.tsx.
// Правки доезжают мимо окна: админка сбрасывает теги этого раздела.
export const revalidate = 3600;

import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { buildOg, buildTwitter, BASE } from '@/lib/metadata';
import { fetchAuthorsPageSettings } from '@/lib/sanity';
import AuthorsView, { authorsTexts } from './AuthorsView';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = authorsTexts(await fetchAuthorsPageSettings(), locale === 'ru');
  return {
    title: t.seoTitle,
    description: t.seoDescription,
    openGraph: buildOg({ url: `${BASE}/${locale}/authors`, title: t.seoTitle, description: t.seoDescription, locale }),
    twitter: buildTwitter({ url: `${BASE}/${locale}/authors`, title: t.seoTitle, description: t.seoDescription, locale }),
    alternates: {
      canonical: `${BASE}/${locale}/authors`,
      languages: { ru: `${BASE}/ru/authors`, en: `${BASE}/en/authors`, 'x-default': `${BASE}/en/authors` },
    },
  };
}

export default async function AuthorsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <AuthorsView locale={locale} page={1} />;
}
