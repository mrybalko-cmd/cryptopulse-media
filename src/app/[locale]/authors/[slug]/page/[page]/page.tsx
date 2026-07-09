export const revalidate = 300;

import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { buildOg, BASE } from '@/lib/metadata';
import { fetchAuthorBySlug, fetchAuthorFeed } from '@/lib/sanity';
import AuthorPageBody from '../../AuthorPageBody';
import { AUTHOR_PAGE_SIZE } from '../../page';

// Page 1 lives at /authors/[slug] itself; this route only serves page >= 2 —
// same crawlable-pagination pattern as /articles/page/[n] and /news/page/[n].
// Unlike those (deliberately noindex,follow to save crawl budget on a
// duplicate-ish listing), author pagination pages ARE indexed: each page is
// a distinct, non-duplicate slice of one author's output, and the user
// wants them discoverable on their own. An article's own indexability never
// depends on which author-page currently lists it — it has its own
// canonical /articles|news/[slug] URL and its own sitemap.xml entry
// regardless of pagination.
type Props = { params: Promise<{ locale: string; slug: string; page: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug, page: pageParam } = await params;
  setRequestLocale(locale);
  const page = Number(pageParam);
  const author = await fetchAuthorBySlug(slug);
  if (!author) return {};
  const isRu = locale === 'ru';
  const role = (isRu ? author.roleRu : author.roleEn) || '';
  const title = `${author.name}${role ? ` — ${role}` : ''} — ${isRu ? 'страница' : 'page'} ${page}`;
  const bio = isRu ? author.bioRu : author.bioEn;
  const description = bio
    ? bio.slice(0, 155)
    : isRu
    ? `Материалы автора ${author.name} на CryptoPulse.media`
    : `Articles by ${author.name} on CryptoPulse.media`;
  return {
    title,
    description,
    openGraph: buildOg({ url: `${BASE}/${locale}/authors/${slug}/page/${page}`, title, description, locale, image: author.photo }),
    alternates: {
      canonical: `${BASE}/${locale}/authors/${slug}/page/${page}`,
      languages: {
        ru: `${BASE}/ru/authors/${slug}/page/${page}`,
        en: `${BASE}/en/authors/${slug}/page/${page}`,
      },
    },
  };
}

export default async function AuthorDeepPage({ params }: Props) {
  const { locale, slug, page: pageParam } = await params;
  const page = Number(pageParam);
  if (!Number.isInteger(page) || page < 2) notFound();
  setRequestLocale(locale);
  const isRu = locale === 'ru';

  const author = await fetchAuthorBySlug(slug);
  if (!author) notFound();

  const offset = (page - 1) * AUTHOR_PAGE_SIZE;
  const feed = await fetchAuthorFeed(slug, locale, AUTHOR_PAGE_SIZE, offset);
  if (feed.items.length === 0) notFound();

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
        page={page}
        pageSize={AUTHOR_PAGE_SIZE}
      />
    </>
  );
}
