export const revalidate = 300;

import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { after } from 'next/server';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowLeft, Calendar, ExternalLink, Eye, Zap } from 'lucide-react';
import EmailSubscribeForm from '@/components/ui/EmailSubscribeForm';
import AuthorCard from '@/components/ui/AuthorCard';
import { fetchNewsBySlug, incrementViews, fetchComments, fetchRelatedNews } from '@/lib/sanity';
import { PortableText } from '@portabletext/react';
import ShareButtons from '@/components/ui/ShareButtons';
import NewsCard from '@/components/ui/NewsCard';
import CommentSection from '@/components/ui/CommentSection';
import { SITE_NAME } from '@/lib/constants';
import { urlFor } from '@/lib/sanityImage';
import { truncateDesc } from '@/lib/metadata';

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const news = await fetchNewsBySlug(slug, locale);
  if (!news) return {};

  const title = news.seo?.metaTitle || news.title;
  const description = truncateDesc(news.seo?.metaDescription || news.excerpt || '');
  const ogImage = news.coverImage || `https://cryptopulse.media/${locale}/opengraph-image`;
  const otherLocale = locale === 'ru' ? 'en' : 'ru';
  const translationLang = news.translation?.language;
  const translationSlug = news.translation?.slug;

  return {
    title,
    description,
    keywords: news.seo?.keywords,
    alternates: {
      canonical: `https://cryptopulse.media/${locale}/news/${slug}`,
      languages: {
        [locale]: `https://cryptopulse.media/${locale}/news/${slug}`,
        ...(translationLang && translationSlug
          ? {
              [translationLang]: `https://cryptopulse.media/${translationLang}/news/${translationSlug}`,
              'x-default': `https://cryptopulse.media/en/news/${translationLang === 'en' ? translationSlug : slug}`,
            }
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
      images: [{ url: ogImage }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function NewsDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  const news = await fetchNewsBySlug(slug.trim(), locale);

  if (!news) notFound();

  after(() => incrementViews(news._id));

  const commentsEnabled = news.commentsEnabled !== false;
  const comments = commentsEnabled ? await fetchComments(news._id) : [];
  const relatedNews = await fetchRelatedNews(news._id, locale, 3);

  const date = new Date(news.publishedAt).toLocaleDateString(
    locale === 'ru' ? 'ru-RU' : 'en-US',
    { day: 'numeric', month: 'long', year: 'numeric' }
  );

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: news.title,
    description: news.excerpt,
    image: [news.coverImage || `https://cryptopulse.media/${locale}/opengraph-image`],
    datePublished: news.publishedAt,
    dateModified: news._updatedAt || news.publishedAt,
    inLanguage: locale,
    author: { '@type': 'Organization', name: 'CryptoPulse.media' },
    publisher: { '@type': 'Organization', name: 'CryptoPulse.media' },
    mainEntityOfPage: `https://cryptopulse.media/${locale}/news/${slug}`,
    commentCount: comments.length,
    ...(comments.length > 0 && {
      comment: comments.slice(0, 20).map((c) => ({
        '@type': 'Comment',
        author: { '@type': 'Person', name: c.authorName },
        text: c.text,
        dateCreated: c.createdAt,
      })),
    }),
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
          <Image src={news.coverImage} alt={news.title} fill className="object-cover" />
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
        <div className="flex items-center gap-4">
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
                        alt={value.alt || ''}
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
                  const isExternal = value?.href?.startsWith('http');
                  const relParts = [
                    ...(isExternal ? ['noopener', 'noreferrer'] : []),
                    ...(value?.rel === 'nofollow' ? ['nofollow'] : []),
                  ];
                  return (
                    <a
                      href={value?.href}
                      target={isExternal ? '_blank' : undefined}
                      rel={relParts.length > 0 ? relParts.join(' ') : undefined}
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
        <CommentSection targetId={news._id} locale={locale} initialComments={comments} />
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
        <div className="sticky top-24">
          <ShareButtons url={pageUrl} title={news.title} locale={locale} />
        </div>
      </aside>
      </div>
    </div>
  );
}
