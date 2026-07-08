export const revalidate = 300;

import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import ViewTracker from '@/components/ui/ViewTracker';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowLeft, Calendar, ExternalLink, Eye, User, Zap } from 'lucide-react';
import EmailSubscribeForm from '@/components/ui/EmailSubscribeForm';
import AuthorCard from '@/components/ui/AuthorCard';
import { fetchNewsBySlug, fetchRelatedNews } from '@/lib/sanity';
import { PortableText } from '@portabletext/react';
import ShareButtons from '@/components/ui/ShareButtons';
import NewsCard from '@/components/ui/NewsCard';
import CommentSection from '@/components/ui/CommentSection';
import { SITE_NAME } from '@/lib/constants';
import { urlFor } from '@/lib/sanityImage';
import { truncateDesc, truncateTitle } from '@/lib/metadata';

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const news = await fetchNewsBySlug(slug, locale);
  if (!news) return {};

  const title = news.seo?.metaTitle || news.title;
  const description = truncateDesc(news.seo?.metaDescription || news.excerpt || '');
  const ogImageUrl = news.seoOgImageUrl || news.coverImage || `https://cryptopulse.media/${locale}/opengraph-image`;
  const canonicalUrl = news.seo?.canonicalUrl || `https://cryptopulse.media/${locale}/news/${slug}`;
  const translationLang = news.translation?.language;
  const translationSlug = news.translation?.slug;

  return {
    title: truncateTitle(title),
    description,
    keywords: news.seo?.keywords,
    ...(news.seo?.noIndex && { robots: { index: false, follow: false, googleBot: { index: false, follow: false } } }),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        [locale]: `https://cryptopulse.media/${locale}/news/${slug}`,
        ...(translationLang && translationSlug
          ? { [translationLang]: `https://cryptopulse.media/${translationLang}/news/${translationSlug}` }
          : {}),
      },
    },
    openGraph: {
      type: 'article',
      title,
      description,
      url: `https://cryptopulse.media/${locale}/news/${slug}`,
      siteName: 'CryptoPulse.media',
      locale: locale === 'ru' ? 'ru_RU' : 'en_US',
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: title }],
      publishedTime: news.publishedAt,
      modifiedTime: news.updatedAt || news._updatedAt || news.publishedAt,
      ...(news.author?.slug && {
        authors: [`https://cryptopulse.media/${locale}/authors/${news.author.slug}`],
      }),
      ...(news.topic && { section: news.topic }),
      ...(news.seo?.keywords?.length && { tags: news.seo.keywords }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function NewsDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const news = await fetchNewsBySlug(slug.trim(), locale);

  if (!news) notFound();


  const commentsEnabled = news.commentsEnabled !== false;
  const relatedNews = await fetchRelatedNews(news._id, locale, 3);

  const date = new Date(news.publishedAt).toLocaleDateString(
    locale === 'ru' ? 'ru-RU' : 'en-US',
    { day: 'numeric', month: 'long', year: 'numeric' }
  );

  const wordCount = countBodyWords(news.body);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: news.title,
    description: news.excerpt,
    url: `https://cryptopulse.media/${locale}/news/${slug}`,
    image: [news.seoOgImageUrl || news.coverImage || `https://cryptopulse.media/${locale}/opengraph-image`],
    datePublished: news.publishedAt,
    dateModified: news.updatedAt || news._updatedAt || news.publishedAt,
    inLanguage: locale,
    ...(wordCount > 0 && { wordCount }),
    author: news.author
      ? { '@type': 'Person', name: news.author.name.trim(), url: `https://cryptopulse.media/${locale}/authors/${news.author.slug}` }
      : { '@type': 'Organization', '@id': 'https://cryptopulse.media/#organization' },
    publisher: { '@id': 'https://cryptopulse.media/#organization' },
    mainEntityOfPage: `https://cryptopulse.media/${locale}/news/${slug}`,
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: locale === 'ru' ? 'Главная' : 'Home', item: `https://cryptopulse.media/${locale}` },
      { '@type': 'ListItem', position: 2, name: locale === 'ru' ? 'Новости' : 'News', item: `https://cryptopulse.media/${locale}/news` },
      { '@type': 'ListItem', position: 3, name: news.title, item: `https://cryptopulse.media/${locale}/news/${slug}` },
    ],
  };

  const pageUrl = `https://cryptopulse.media/${locale}/news/${slug}`;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <ViewTracker id={news._id} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <div className="flex gap-6">
      <div className="flex-1 max-w-3xl min-w-0">
      {/* Back */}
      <Link
        href={`/${locale}/news`}
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-accent transition-colors mb-8"
      >
        <ArrowLeft size={14} />
        {locale === 'ru' ? 'Все новости' : 'All news'}
      </Link>

      {/* Cover */}
      {news.coverImage && (
        <div className="relative h-64 sm:h-80 rounded-lg overflow-hidden mb-8">
          <Image src={news.coverImage} alt={news.coverImageAlt || news.title} fill className="object-cover" priority sizes="(min-width: 1024px) 65vw, 100vw" />
        </div>
      )}

      {/* Header */}
      {news.breaking && (
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600 text-white text-xs font-bold mb-4 animate-pulse">
          <Zap size={12} fill="currentColor" />
          {locale === 'ru' ? 'Молния' : 'Breaking News'}
        </div>
      )}
      <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight mb-4">
        {news.title}
      </h1>

      <div className="flex items-center justify-between gap-4 mb-4 pb-4 border-b border-border">
        <div className="flex items-center flex-wrap gap-3">
          {/* Byline — always visible, required for Google News */}
          <div className="flex items-center gap-1.5 text-xs text-muted">
            <User size={12} />
            {news.author?.slug ? (
              <a
                href={`/${locale}/authors/${news.author.slug}`}
                className="hover:text-accent transition-colors"
                rel="author"
              >
                {news.author.name}
              </a>
            ) : (
              <span rel="author">{news.author?.name || 'CryptoPulse.media'}</span>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted">
            <Calendar size={12} />
            <span>{date}</span>
          </div>
          {news.sourceName && (
            <a
              href={news.sourceUrl || undefined}
              target={news.sourceUrl ? '_blank' : undefined}
              rel={news.sourceUrl ? 'noopener noreferrer' : undefined}
              className="flex items-center gap-1.5 text-xs text-muted hover:text-accent transition-colors"
            >
              <span>{locale === 'ru' ? 'Источник' : 'Source'}: {news.sourceName}</span>
              {news.sourceUrl && <ExternalLink size={12} />}
            </a>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted">
          <Eye size={12} />
          <span>{news.views || 0}</span>
        </div>
      </div>

      {/* Share (mobile) — after header, before body */}
      <div className="lg:hidden mb-6">
        <ShareButtons url={pageUrl} title={news.title} locale={locale} vertical={false} />
      </div>

      {/* Body */}
      {news.body ? (
        <div className="prose prose-invert prose-sm max-w-none
          prose-headings:text-foreground prose-headings:font-semibold
          prose-p:text-muted prose-p:leading-relaxed
          prose-a:text-blue-500 prose-a:underline prose-a:decoration-blue-500 hover:prose-a:text-blue-600 hover:prose-a:decoration-blue-600
          prose-strong:text-foreground
          prose-li:text-muted prose-li:marker:text-muted
          prose-blockquote:border-accent prose-blockquote:text-muted
          prose-code:text-accent prose-code:bg-card prose-code:px-1 prose-code:rounded
        ">
          <PortableText
            value={news.body}
            components={{
              types: {
                image: ({ value }: { value: any }) => {
                  if (!value?.asset) return null;
                  const src = urlFor(value).width(900).url();
                  return (
                    <figure className="my-6">
                      <img
                        src={src}
                        alt={value.alt || news.title}
                        loading="lazy"
                        className="w-full h-auto rounded-lg"
                      />
                      {value.alt && (
                        <figcaption className="text-xs text-muted text-center mt-2">{value.alt}</figcaption>
                      )}
                    </figure>
                  );
                },
              },
              marks: {
                link: ({ value, children }) => {
                  const relParts = [
                    'noopener', 'noreferrer',
                    ...(value?.rel === 'nofollow' ? ['nofollow'] : []),
                  ];
                  return (
                    <a
                      href={value?.href}
                      target="_blank"
                      rel={relParts.join(' ')}
                      className="text-blue-500 underline decoration-blue-500 hover:text-blue-600 hover:decoration-blue-600"
                    >
                      {children}
                    </a>
                  );
                },
              },
            }}
          />
        </div>
      ) : (
        <p className="text-muted">{news.excerpt}</p>
      )}

      {news.author && <AuthorCard author={news.author} locale={locale} />}

      {commentsEnabled && (
        <CommentSection targetId={news._id} locale={locale} />
      )}

      <EmailSubscribeForm locale={locale} source="news-detail" />

      {relatedNews.length > 0 && (
        <div className="mt-12 pt-8 border-t border-border">
          <h2 className="text-sm font-bold text-foreground mb-5">
            {locale === 'ru' ? 'Похожие материалы' : 'Related news'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {relatedNews.map((related: any) => (
              <NewsCard
                key={related._id}
                title={related.title}
                source={SITE_NAME}
                href={`/${locale}/news/${related.slug.current}`}
                external={false}
                publishedAt={Math.floor(new Date(related.publishedAt).getTime() / 1000)}
                imageUrl={related.coverImage}
                locale={locale}
              />
            ))}
          </div>
        </div>
      )}
      </div>

      {/* Share (desktop, sticky) */}
      <aside className="hidden lg:block shrink-0">
        <div className="sticky top-20 md:top-[8rem]">
          <ShareButtons url={pageUrl} title={news.title} locale={locale} />
        </div>
      </aside>
      </div>
    </div>
  );
}

function countBodyWords(body: any[]): number {
  if (!Array.isArray(body)) return 0;
  return body
    .filter((b: any) => b._type === 'block')
    .flatMap((b: any) => b.children ?? [])
    .filter((c: any) => c._type === 'span')
    .reduce((acc: number, c: any) => acc + (c.text ?? '').trim().split(/\s+/).filter(Boolean).length, 0);
}
