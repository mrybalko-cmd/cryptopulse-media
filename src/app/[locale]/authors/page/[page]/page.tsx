export const revalidate = 3600;

import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { buildOg, buildTwitter, BASE } from '@/lib/metadata';
import { fetchAuthorsPageSettings } from '@/lib/sanity';
import AuthorsView, { authorsTexts, loadAuthors } from '../../AuthorsView';

/**
 * Страницы витрины со второй и дальше.
 *
 * Каждая со своим canonical на себя и своим заголовком с номером. Ссылки
 * пагинации — обычные <a>, робот по ним проходит; rel="next" Google перестал
 * учитывать ещё в 2019 году, а ссылки работают всегда.
 */

type Props = { params: Promise<{ locale: string; page: string }> };

export async function generateStaticParams() {
  const { totalPages } = await loadAuthors('en');
  // Первая страница живёт по короткому адресу, здесь только вторая и дальше.
  return Array.from({ length: Math.max(0, totalPages - 1) }, (_, i) => ({ page: String(i + 2) }));
}

function parsePage(raw: string): number | null {
  if (!/^\d+$/.test(raw)) return null;
  const n = Number(raw);
  // Единицу сюда не пускаем: у первой страницы свой адрес, и дубль ей не нужен.
  return n >= 2 ? n : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, page } = await params;
  setRequestLocale(locale);
  const n = parsePage(page);
  if (!n) return {};
  const t = authorsTexts(await fetchAuthorsPageSettings(), locale === 'ru', n);
  const url = `${BASE}/${locale}/authors/page/${n}`;
  return {
    title: t.seoTitle,
    description: t.seoDescription,
    openGraph: buildOg({ url, title: t.seoTitle, description: t.seoDescription, locale }),
    twitter: buildTwitter({ url, title: t.seoTitle, description: t.seoDescription, locale }),
    alternates: {
      canonical: url,
      languages: {
        ru: `${BASE}/ru/authors/page/${n}`,
        en: `${BASE}/en/authors/page/${n}`,
        'x-default': `${BASE}/en/authors/page/${n}`,
      },
    },
  };
}

export default async function AuthorsPagedPage({ params }: Props) {
  const { locale, page } = await params;
  setRequestLocale(locale);
  const n = parsePage(page);
  if (!n) notFound();
  return <AuthorsView locale={locale} page={n} />;
}
