import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { after } from 'next/server';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowLeft, Clock, Calendar, Eye } from 'lucide-react';
import { fetchArticleBySlug, incrementViews } from '@/lib/sanity';
import { PortableText } from '@portabletext/react';
import ShareButtons from '@/components/ui/ShareButtons';
import ArticleBadge from '@/components/ui/ArticleBadge';
import SetTranslationLink from '@/components/ui/SetTranslationLink';

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = await fetchArticleBySlug(slug, locale);
  if (!article) return {};

  const title = article.seo?.metaTitle || article.title;
  const description = article.seo?.metaDescription || article.excerpt;
  const ogImage = article.coverImage || `https://cryptopulse.media/${locale}/opengraph-image`;

  return {
    title,
    description,
    keywords: article.seo?.keywords,
    alternates: {
      canonical: `https://cryptopulse.media/${locale}/articles/${slug}`,
      languages: article.translation
        ? {
            [locale]: `https://cryptopulse.media/${locale}/articles/${slug}`,
            [article.translation.language]: `https://cryptopulse.media/${article.translation.language}/articles/${article.translation.slug}`,
          }
        : undefined,
    },
    openGraph: {
      type: 'article',
      title,
      description,
      url: `https://cryptopulse.media/${locale}/articles/${slug}`,
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

export default async function ArticlePage({ params }: Props) {
  const { locale, slug } = await params;
  const article = await fetchArticleBySlug(slug, locale);

  if (!article) notFound();

  after(() => incrementViews(article._id));

  const translationHref = article.translation
    ? `/${article.translation.language}/articles/${article.translation.slug}`
    : null;

  const date = new Date(article.publishedAt).toLocaleDateString(
    locale === 'ru' ? 'ru-RU' : 'en-US',
    { day: 'numeric', month: 'long', year: 'numeric' }
  );

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    image: [article.coverImage || `https://cryptopulse.media/${locale}/opengraph-image`],
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    inLanguage: locale,
    author: { '@type': 'Organization', name: 'CryptoPulse.media' },
    publisher: { '@type': 'Organization', name: 'CryptoPulse.media' },
    mainEntityOfPage: `https://cryptopulse.media/${locale}/articles/${slug}`,
  };

  const pageUrl = `https://cryptopulse.media/${locale}/articles/${slug}`;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <SetTranslationLink href={translationHref} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="flex gap-6">
      <div className="flex-1 max-w-3xl min-w-0">
      {/* Back */}
      <Link
        href={`/${locale}/articles`}
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-accent transition-colors mb-8"
      >
        <ArrowLeft size={14} />
        {locale === 'ru' ? 'Все статьи' : 'All articles'}
      </Link>

      {/* Share (mobile) */}
      <div className="lg:hidden mb-6">
        <ShareButtons url={pageUrl} title={article.title} locale={locale} vertical={false} />
      </div>

      {/* Cover */}
      {article.coverImage && (
        <div className="relative h-64 sm:h-80 rounded-lg overflow-hidden mb-8">
          <Image src={article.coverImage} alt={article.title} fill className="object-cover" />
        </div>
      )}

      {/* Header */}
      {article.badge && article.badge !== 'none' && (
        <div className="mb-3">
          <ArticleBadge badge={article.badge} locale={locale} />
        </div>
      )}
      <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight mb-4">
        {article.title}
      </h1>

      <div className="flex items-center justify-between gap-4 mb-8 pb-8 border-b border-border">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-xs text-muted">
            <Calendar size={12} />
            <span>{date}</span>
          </div>
          {article.readingTime && (
            <div className="flex items-center gap-1.5 text-xs text-muted">
              <Clock size={12} />
              <span>{article.readingTime} {locale === 'ru' ? 'мин чтения' : 'min read'}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted">
          <Eye size={12} />
          <span>{article.views || 0}</span>
        </div>
      </div>

      {/* Body */}
      {article.body ? (
        <div className="prose prose-invert prose-sm max-w-none
          prose-headings:text-foreground prose-headings:font-semibold
          prose-p:text-muted prose-p:leading-relaxed
          prose-a:text-blue-500 prose-a:underline prose-a:decoration-blue-500 hover:prose-a:text-blue-600 hover:prose-a:decoration-blue-600
          prose-strong:text-foreground
          prose-blockquote:border-accent prose-blockquote:text-muted
          prose-code:text-accent prose-code:bg-card prose-code:px-1 prose-code:rounded
        ">
          <PortableText
            value={article.body}
            components={{
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
        <p className="text-muted">{article.excerpt}</p>
      )}
      </div>

      {/* Share (desktop, sticky) */}
      <aside className="hidden lg:block shrink-0">
        <div className="sticky top-24">
          <ShareButtons url={pageUrl} title={article.title} locale={locale} />
        </div>
      </aside>
      </div>
    </div>
  );
}
