export const revalidate = 300;

import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { buildOg, BASE } from '@/lib/metadata';
import { fetchAuthorBySlug, fetchAuthorFeed } from '@/lib/sanity';
import AuthorPageBody from './AuthorPageBody';

export const AUTHOR_PAGE_SIZE = 20;

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const author = await fetchAuthorBySlug(slug);
  if (!author) return {};
  const isRu = locale === 'ru';
  const role = (isRu ? author.roleRu : author.roleEn) || '';
  const title = `${author.name}${role ? ` — ${role}` : ''}`;
  const bio = isRu ? author.bioRu : author.bioEn;
  const description = bio
    ? bio.slice(0, 155)
    : isRu
    ? `Материалы автора ${author.name} на CryptoPulse.media`
    : `Articles by ${author.name} on CryptoPulse.media`;
  return {
    title,
    description,
    openGraph: buildOg({ url: `${BASE}/${locale}/authors/${slug}`, title, description, locale, image: author.photo }),
    alternates: {
      canonical: `${BASE}/${locale}/authors/${slug}`,
      languages: { ru: `${BASE}/ru/authors/${slug}`, en: `${BASE}/en/authors/${slug}` },
    },
  };
}

export default async function AuthorPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const isRu = locale === 'ru';

  const [author, feed] = await Promise.all([
    fetchAuthorBySlug(slug),
    fetchAuthorFeed(slug, locale, AUTHOR_PAGE_SIZE, 0),
  ]);

  if (!author) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: author.name,
    ...(author.photo && { image: author.photo }),
    ...(author.roleEn && { jobTitle: isRu ? author.roleRu : author.roleEn }),
    worksFor: { '@type': 'Organization', name: 'CryptoPulse.media', url: BASE },
    url: `${BASE}/${locale}/authors/${slug}`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <AuthorPageBody
        locale={locale}
        slug={slug}
        author={author}
        items={feed.items}
        total={feed.total}
        page={1}
        pageSize={AUTHOR_PAGE_SIZE}
      />
    </>
  );
}
