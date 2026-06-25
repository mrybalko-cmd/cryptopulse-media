import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowLeft, Clock, Calendar, Eye } from 'lucide-react';
import { fetchArticleBySlug, incrementViews } from '@/lib/sanity';
import { PortableText } from '@portabletext/react';
import ShareButtons from '@/components/ui/ShareButtons';

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = await fetchArticleBySlug(slug, locale);
  if (!article) return {};

  const title = article.seo?.metaTitle || article.title;
  const description = article.seo?.metaDescription || article.excerpt;

  return {
    title,
    description,
    keywords: article.seo?.keywords,
    alternates: { canonical: `https://cryptopulse.media/${locale}/articles/${slug}` },
    openGraph: {
      type: 'article',
      title,
      description,
      url: `https://cryptopulse.media/${locale}/articles/${slug}`,
      siteName: 'CryptoPulse.media',
      locale: locale === 'ru' ? 'ru_RU' : 'en_US',
      images: article.coverImage ? [{ url: article.coverImage }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: article.coverImage ? [article.coverImage] : undefined,
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { locale, slug } = await params;
  const article = await fetchArticleBySlug(slug, locale);

  if (!article) notFound();

  await incrementViews(article._id);

  const date = new Date(article.publishedAt).toLocaleDateString(
    locale === 'ru' ? 'ru-RU' : 'en-US',
    { day: 'numeric', month: 'long', year: 'numeric' }
  );

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    image: article.coverImage ? [article.coverImage] : undefined,
    datePublished: article.publishedAt,
    inLanguage: locale,
    author: { '@type': 'Organization', name: 'CryptoPulse.media' },
    publisher: { '@type': 'Organization', name: 'CryptoPulse.media' },
    mainEntityOfPage: `https://cryptopulse.media/${locale}/articles/${slug}`,
  };

  const pageUrl = `https://cryptopulse.media/${locale}/articles/${slug}`;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
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
          prose-a:text-accent prose-a:underline prose-a:decoration-accent/50 hover:prose-a:decoration-accent
          prose-strong:text-foreground
          prose-blockquote:border-accent prose-blockquote:text-muted
          prose-code:text-accent prose-code:bg-card prose-code:px-1 prose-code:rounded
        ">
          <PortableText
            value={article.body}
            components={{
              marks: {
                link: ({ value, children }) => (
                  <a
                    href={value?.href}
                    target={value?.href?.startsWith('http') ? '_blank' : undefined}
                    rel={value?.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="text-accent underline decoration-accent/50 hover:decoration-accent"
                  >
                    {children}
                  </a>
                ),
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
