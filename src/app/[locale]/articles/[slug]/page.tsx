export const revalidate = 300;

import { getTranslations, setRequestLocale} from 'next-intl/server';
import { notFound } from 'next/navigation';
import ViewTracker from '@/components/ui/ViewTracker';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowLeft, Clock, Calendar, Eye } from 'lucide-react';
import { fetchArticleBySlug, fetchComments, fetchRelatedArticles } from '@/lib/sanity';
import { PortableText } from '@portabletext/react';
import ShareButtons from '@/components/ui/ShareButtons';
import ArticleBadge from '@/components/ui/ArticleBadge';
import ArticleCard from '@/components/ui/ArticleCard';
import CommentSection from '@/components/ui/CommentSection';
import EmailSubscribeForm from '@/components/ui/EmailSubscribeForm';
import AuthorCard from '@/components/ui/AuthorCard';
import { urlFor } from '@/lib/sanityImage';
import { truncateDesc } from '@/lib/metadata';

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const article = await fetchArticleBySlug(slug.trim(), locale);
  if (!article) return {};

  const title = article.seo?.metaTitle || article.title;
  const description = truncateDesc(article.seo?.metaDescription || article.excerpt || '');
  const ogImage = article.coverImage || `https://cryptopulse.media/${locale}/opengraph-image`;
  const otherLocale = locale === 'ru' ? 'en' : 'ru';
  const translationLang = article.translation?.language;
  const translationSlug = article.translation?.slug;

  return {
    title,
    description,
    keywords: article.seo?.keywords,
    alternates: {
      canonical: `https://cryptopulse.media/${locale}/articles/${slug}`,
      languages: {
        [locale]: `https://cryptopulse.media/${locale}/articles/${slug}`,
        ...(translationLang && translationSlug
          ? {
              [translationLang]: `https://cryptopulse.media/${translationLang}/articles/${translationSlug}`,
              'x-default': `https://cryptopulse.media/en/articles/${translationLang === 'en' ? translationSlug : slug}`,
            }
          : {}),
      },
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
  const article = await fetchArticleBySlug(slug.trim(), locale);

  if (!article) notFound();


  const commentsEnabled = article.commentsEnabled !== false;
  const comments = commentsEnabled ? await fetchComments(article._id) : [];
  const relatedArticles = await fetchRelatedArticles(article._id, locale, 3);

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
    dateModified: article._updatedAt || article.publishedAt,
    inLanguage: locale,
    author: { '@type': 'Organization', name: 'CryptoPulse.media' },
    publisher: { '@type': 'Organization', name: 'CryptoPulse.media' },
    mainEntityOfPage: `https://cryptopulse.media/${locale}/articles/${slug}`,
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
      { '@type': 'ListItem', position: 2, name: locale === 'ru' ? 'Статьи' : 'Articles', item: `https://cryptopulse.media/${locale}/articles` },
      { '@type': 'ListItem', position: 3, name: article.title, item: `https://cryptopulse.media/${locale}/articles/${slug}` },
    ],
  };

  const pageUrl = `https://cryptopulse.media/${locale}/articles/${slug}`;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <ViewTracker id={article._id} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
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

      {/* Cover */}
      {article.coverImage && (
        <div className="relative h-64 sm:h-80 rounded-lg overflow-hidden mb-8">
          <Image src={article.coverImage} alt={article.title} fill className="object-cover" priority sizes="(min-width: 1024px) 65vw, 100vw" />
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

      <div className="flex items-center justify-between gap-4 mb-4 pb-4 border-b border-border">
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

      {/* Share (mobile) — after header, before body */}
      <div className="lg:hidden mb-6">
        <ShareButtons url={pageUrl} title={article.title} locale={locale} vertical={false} />
      </div>

      {/* Body */}
      {article.body ? (
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
            value={article.body}
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
        <p className="text-muted">{article.excerpt}</p>
      )}

      {article.author && <AuthorCard author={article.author} locale={locale} />}

      {commentsEnabled && (
        <CommentSection targetId={article._id} locale={locale} initialComments={comments} />
      )}

      <EmailSubscribeForm locale={locale} source="article-detail" />

      {relatedArticles.length > 0 && (
        <div className="mt-12 pt-8 border-t border-border">
          <h2 className="text-sm font-bold text-foreground mb-5">
            {locale === 'ru' ? 'Похожие материалы' : 'Related articles'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {relatedArticles.map((related: any) => (
              <ArticleCard
                key={related._id}
                title={related.title}
                excerpt={related.excerpt}
                slug={related.slug.current}
                coverImage={related.coverImage}
                publishedAt={related.publishedAt}
                readingTime={related.readingTime}
                badge={related.badge}
                views={related.views}
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
          <ShareButtons url={pageUrl} title={article.title} locale={locale} />
        </div>
      </aside>
      </div>
    </div>
  );
}
