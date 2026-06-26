import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowLeft, Calendar, ExternalLink, Eye } from 'lucide-react';
import { fetchNewsBySlug, incrementViews } from '@/lib/sanity';
import { PortableText } from '@portabletext/react';
import ShareButtons from '@/components/ui/ShareButtons';

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const news = await fetchNewsBySlug(slug, locale);
  if (!news) return {};

  const title = news.seo?.metaTitle || news.title;
  const description = news.seo?.metaDescription || news.excerpt;

  return {
    title,
    description,
    keywords: news.seo?.keywords,
    alternates: { canonical: `https://cryptopulse.media/${locale}/news/${slug}` },
    openGraph: {
      type: 'article',
      title,
      description,
      url: `https://cryptopulse.media/${locale}/news/${slug}`,
      siteName: 'CryptoPulse.media',
      locale: locale === 'ru' ? 'ru_RU' : 'en_US',
      images: news.coverImage ? [{ url: news.coverImage }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: news.coverImage ? [news.coverImage] : undefined,
    },
  };
}

export default async function NewsDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  const news = await fetchNewsBySlug(slug, locale);

  if (!news) notFound();

  await incrementViews(news._id);

  const date = new Date(news.publishedAt).toLocaleDateString(
    locale === 'ru' ? 'ru-RU' : 'en-US',
    { day: 'numeric', month: 'long', year: 'numeric' }
  );

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: news.title,
    description: news.excerpt,
    image: news.coverImage ? [news.coverImage] : undefined,
    datePublished: news.publishedAt,
    inLanguage: locale,
    author: { '@type': 'Organization', name: 'CryptoPulse.media' },
    publisher: { '@type': 'Organization', name: 'CryptoPulse.media' },
    mainEntityOfPage: `https://cryptopulse.media/${locale}/news/${slug}`,
  };

  const pageUrl = `https://cryptopulse.media/${locale}/news/${slug}`;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
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

      {/* Share (mobile) */}
      <div className="lg:hidden mb-6">
        <ShareButtons url={pageUrl} title={news.title} locale={locale} vertical={false} />
      </div>

      {/* Cover */}
      {news.coverImage && (
        <div className="relative h-64 sm:h-80 rounded-lg overflow-hidden mb-8">
          <Image src={news.coverImage} alt={news.title} fill className="object-cover" />
        </div>
      )}

      {/* Header */}
      <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight mb-4">
        {news.title}
      </h1>

      <div className="flex items-center justify-between gap-4 mb-8 pb-8 border-b border-border">
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

      {/* Body */}
      {news.body ? (
        <div className="prose prose-invert prose-sm max-w-none
          prose-headings:text-foreground prose-headings:font-semibold
          prose-p:text-muted prose-p:leading-relaxed
          prose-a:text-accent prose-a:underline prose-a:decoration-accent/50 hover:prose-a:decoration-accent
          prose-strong:text-foreground
          prose-blockquote:border-accent prose-blockquote:text-muted
          prose-code:text-accent prose-code:bg-card prose-code:px-1 prose-code:rounded
        ">
          <PortableText
            value={news.body}
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
                      className="text-accent underline decoration-accent/50 hover:decoration-accent"
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
