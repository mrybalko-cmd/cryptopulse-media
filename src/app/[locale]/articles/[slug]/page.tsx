export const revalidate = 300;

import { getTranslations, setRequestLocale} from 'next-intl/server';
import { notFound } from 'next/navigation';
import ViewTracker from '@/components/ui/ViewTracker';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowLeft, Clock, Calendar, Eye, User } from 'lucide-react';
import { fetchArticleBySlug, fetchRelatedArticles } from '@/lib/sanity';
import { PortableText } from '@portabletext/react';
import ShareButtons from '@/components/ui/ShareButtons';
import LikeButton from '@/components/ui/LikeButton';
import ArticleBadge from '@/components/ui/ArticleBadge';
import ArticleCard from '@/components/ui/ArticleCard';
import CommentSection from '@/components/ui/CommentSection';
import EmailSubscribeForm from '@/components/ui/EmailSubscribeForm';
import AuthorCard from '@/components/ui/AuthorCard';
import { urlFor, sanityImageTransform } from '@/lib/sanityImage';
import { truncateDesc, truncateTitle, BASE } from '@/lib/metadata';

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const article = await fetchArticleBySlug(slug.trim(), locale);
  if (!article) return {};

  const title = article.seo?.metaTitle || article.title;
  const description = truncateDesc(article.seo?.metaDescription || article.excerpt || '');
  const ogImageUrl = article.seoOgImageUrl
    || sanityImageTransform(article.coverImage, { width: 1200, height: 630, format: 'jpg' })
    || `https://cryptopulse.media/${locale}/opengraph-image`;
  const canonicalUrl = article.seo?.canonicalUrl || `https://cryptopulse.media/${locale}/articles/${slug}`;
  const translationLang = article.translation?.language;
  const translationSlug = article.translation?.slug;

  return {
    title: truncateTitle(title),
    description,
    keywords: article.seo?.keywords,
    ...(article.seo?.noIndex && { robots: { index: false, follow: false, googleBot: { index: false, follow: false } } }),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        [locale]: `https://cryptopulse.media/${locale}/articles/${slug}`,
        ...(translationLang && translationSlug
          ? { [translationLang]: `https://cryptopulse.media/${translationLang}/articles/${translationSlug}` }
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
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: title }],
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt || article.publishedAt,
      ...(article.author?.slug && {
        authors: [`https://cryptopulse.media/${locale}/authors/${article.author.slug}`],
      }),
      ...(article.topic && { section: article.topic }),
      ...(article.seo?.keywords?.length && { tags: article.seo.keywords }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const article = await fetchArticleBySlug(slug.trim(), locale);

  if (!article) notFound();


  const commentsEnabled = article.commentsEnabled !== false;
  const relatedArticles = await fetchRelatedArticles(article._id, locale, 3);

  const date = new Date(article.publishedAt).toLocaleDateString(
    locale === 'ru' ? 'ru-RU' : 'en-US',
    { day: 'numeric', month: 'long', year: 'numeric' }
  );

  const wordCount = countBodyWords(article.body);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': article.seo?.schemaType || 'BlogPosting',
    headline: article.title,
    description: article.excerpt,
    url: `https://cryptopulse.media/${locale}/articles/${slug}`,
    image: [article.seoOgImageUrl || article.coverImage || `https://cryptopulse.media/${locale}/opengraph-image`],
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt,
    inLanguage: locale,
    ...(wordCount > 0 && { wordCount }),
    author: article.author
      ? { '@type': 'Person', name: article.author.name.trim(), url: `https://cryptopulse.media/${locale}/authors/${article.author.slug}` }
      : { '@type': 'Organization', '@id': 'https://cryptopulse.media/#organization' },
    publisher: { '@id': 'https://cryptopulse.media/#organization' },
    mainEntityOfPage: `https://cryptopulse.media/${locale}/articles/${slug}`,
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
          <Image
            src={sanityImageTransform(article.coverImage, { width: 1536 })!}
            alt={article.coverImageAlt || article.title}
            fill
            className="object-cover"
            priority
            unoptimized
          />
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
        <div className="flex items-center flex-wrap gap-3">
          {/* Byline — always visible, required for Google News */}
          <div className="flex items-center gap-1.5 text-xs text-muted">
            <User size={12} />
            {article.author?.slug ? (
              <a
                href={`/${locale}/authors/${article.author.slug}`}
                className="hover:text-accent transition-colors"
                rel="author"
              >
                {article.author.name}
              </a>
            ) : (
              <span rel="author">{article.author?.name || 'CryptoPulse.media'}</span>
            )}
          </div>
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
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-muted">
            <Eye size={12} />
            <span>{article.views || 0}</span>
          </div>
          <LikeButton id={article._id} locale={locale} initialLikes={article.likes || 0} />
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
                        alt={value.alt || article.title}
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
                  const href = value?.href ?? '';
                  const isInternal = href.startsWith('/') || href.startsWith(BASE);
                  if (isInternal) {
                    const path = href.startsWith(BASE) ? href.slice(BASE.length) || '/' : href;
                    return (
                      <Link
                        href={path}
                        className="text-blue-500 underline decoration-blue-500 hover:text-blue-600 hover:decoration-blue-600"
                      >
                        {children}
                      </Link>
                    );
                  }
                  const relParts = [
                    'noopener', 'noreferrer',
                    ...(value?.rel === 'nofollow' ? ['nofollow'] : []),
                  ];
                  return (
                    <a
                      href={href}
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
        <p className="text-muted">{article.excerpt}</p>
      )}

      {article.author && <AuthorCard author={article.author} locale={locale} />}

      {commentsEnabled && (
        <CommentSection targetId={article._id} locale={locale} />
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
                likes={related.likes}
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
          <ShareButtons url={pageUrl} title={article.title} locale={locale} />
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
