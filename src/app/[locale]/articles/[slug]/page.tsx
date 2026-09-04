export const revalidate = 300;

import { getTranslations, setRequestLocale} from 'next-intl/server';
import { notFound } from 'next/navigation';
import ViewCount from '@/components/ui/ViewCount';
import OwnMark from '@/components/ui/OwnMark';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowLeft, Clock, Calendar } from 'lucide-react';
import { fetchArticleBySlug, fetchRelatedArticles, fetchPopularContent, fetchActiveBanners, fetchRecentSlugsForPrerender } from '@/lib/sanity';
import RichText from '@/components/ui/RichText';
import ShareButtons from '@/components/ui/ShareButtons';
import LikeButton from '@/components/ui/LikeButton';
import ArticleBadge from '@/components/ui/ArticleBadge';
import ArticleCard from '@/components/ui/ArticleCard';
import PopularList from '@/components/ui/PopularList';
import ArticleSidebar from '@/components/ui/ArticleSidebar';
import SidebarBanner from '@/components/ui/SidebarBanner';
import InfiniteMobileFeed from '@/components/ui/InfiniteMobileFeed';
import CommentSection from '@/components/ui/CommentSection';
import EmailSubscribeForm from '@/components/ui/EmailSubscribeForm';
import AuthorCard from '@/components/ui/AuthorCard';
import ArticleFooterMeta from '@/components/ui/ArticleFooterMeta';
import { sanityImageTransform, sanityImageSrcSet, sanityImageDimensions } from '@/lib/sanityImage';
import { truncateDesc, pageTitle, titleText } from '@/lib/metadata';
import { SITE_NAME, SITE_URL } from '@/lib/site';

type Props = { params: Promise<{ locale: string; slug: string }> };

// The newest articles prerender; everything older renders on demand and is
// then cached by ISR. Returning [] meant every single URL was a cold
// server render on its first request.
export async function generateStaticParams() {
  return fetchRecentSlugsForPrerender('article', 60);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const article = await fetchArticleBySlug(slug.trim(), locale);
  if (!article) return {};

  const title = article.seo?.metaTitle || article.title;
  const description = truncateDesc(article.seo?.metaDescription || article.excerpt || '');
  // 16:9 (not the classic 1200x630 OG ratio) — Google Discover's own image
  // guidance calls out 16:9 specifically for large-image thumbnail eligibility.
  const ogImageUrl = article.seoOgImageUrl
    || sanityImageTransform(article.coverImage, { width: 1200, height: 675, format: 'jpg' })
    || `${SITE_URL}/${locale}/opengraph-image`;
  const canonicalUrl = article.seo?.canonicalUrl || `${SITE_URL}/${locale}/articles/${slug}`;
  const translationLang = article.translation?.language;
  const translationSlug = article.translation?.slug;

  return {
    title: pageTitle(title),
    description,
    keywords: article.seo?.keywords,
    ...(article.seo?.noIndex && { robots: { index: false, follow: false, googleBot: { index: false, follow: false } } }),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        [locale]: `${SITE_URL}/${locale}/articles/${slug}`,
        ...(translationLang && translationSlug
          ? { [translationLang]: `${SITE_URL}/${translationLang}/articles/${translationSlug}` }
          : {}),
        // x-default points at the English version when we can resolve it —
        // either this page is EN, or its translation is the EN one. Omitted
        // when no EN counterpart exists so it never targets a missing URL.
        ...(locale === 'en'
          ? { 'x-default': `${SITE_URL}/en/articles/${slug}` }
          : translationLang === 'en' && translationSlug
            ? { 'x-default': `${SITE_URL}/en/articles/${translationSlug}` }
            : {}),
      },
    },
    openGraph: {
      type: 'article',
      title,
      description,
      url: `${SITE_URL}/${locale}/articles/${slug}`,
      siteName: SITE_NAME,
      locale: locale === 'ru' ? 'ru_RU' : 'en_US',
      images: [{ url: ogImageUrl, width: 1200, height: 675, alt: title }],
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt || article.publishedAt,
      ...(article.author?.slug && {
        authors: [`${SITE_URL}/${locale}/authors/${article.author.slug}`],
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
  const popularItems = (await fetchPopularContent(locale, 8))
    .filter((item) => item._id !== article._id)
    .slice(0, 7);
  const banners = await fetchActiveBanners(locale);

  // Unified with the homepage feed: 24-hour time and dot-separated DD.MM.YYYY,
  // formatted locale-independently (en-GB, h23) so RU and EN render identically.
  const dtParts = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
    timeZone: 'Europe/Prague',
  }).formatToParts(new Date(article.publishedAt)).reduce((acc, p) => { acc[p.type] = p.value; return acc; }, {} as Record<string, string>);
  const time = `${dtParts.hour}:${dtParts.minute}`;
  const date = `${dtParts.day}.${dtParts.month}.${dtParts.year}`;

  const wordCount = countBodyWords(article.body);

  const schemaType = article.seo?.schemaType || 'BlogPosting';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': schemaType,
    headline: article.title,
    description: article.excerpt,
    url: `${SITE_URL}/${locale}/articles/${slug}`,
    image: [article.seoOgImageUrl || article.coverImage || `${SITE_URL}/${locale}/opengraph-image`],
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt,
    inLanguage: locale,
    ...(wordCount > 0 && { wordCount }),
    author: article.author
      ? { '@type': 'Person', name: article.author.name.trim(), url: `${SITE_URL}/${locale}/authors/${article.author.slug}` }
      : { '@type': 'Organization', '@id': `${SITE_URL}/#organization` },
    publisher: { '@id': `${SITE_URL}/#organization` },
    mainEntityOfPage: `${SITE_URL}/${locale}/articles/${slug}`,
    // Plain schema.org, not a Subscribe-with-Google signal: it states the
    // story is not behind a paywall, which Google News reads on its own.
    // The swg-basic.js integration it used to accompany was removed — it
    // logged "No config could be discovered in the page" on every article
    // because the publication was never set up in Reader Revenue Manager,
    // so it shipped ~82 KB per story to do nothing.
    isAccessibleForFree: true,
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: locale === 'ru' ? 'Главная' : 'Home', item: `${SITE_URL}/${locale}` },
      { '@type': 'ListItem', position: 2, name: locale === 'ru' ? 'Статьи' : 'Articles', item: `${SITE_URL}/${locale}/articles` },
      { '@type': 'ListItem', position: 3, name: article.title, item: `${SITE_URL}/${locale}/articles/${slug}` },
    ],
  };

  const pageUrl = `${SITE_URL}/${locale}/articles/${slug}`;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
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

      {/* Cover — rendered at its real aspect ratio (read straight off the
          Sanity CDN filename) instead of cropped into a fixed-height box,
          so the full image always shows, same as in Studio. Height follows
          automatically and varies a bit between articles depending on each
          cover's own proportions — that's the direct trade-off of "never
          crop, just scale". */}
      {/* The hero is eager but carries no fetchPriority="high".
          React emits a <link rel="preload"> for the images it renders, and the
          router hoists those out of any route it prefetches — with eight
          article links near the top of a story, seven full-size covers of
          *other* articles landed in this page's preload queue. Prefetching
          them is Next working as designed and cannot be switched off per
          image; what could be switched off was their priority, which had them
          competing with this page's own LCP. Measured: seven high-priority
          preloads became zero, and the hero still loads from the initial HTML
          in the same round trip. */}
      {article.coverImage && (() => {
        const dims = sanityImageDimensions(article.coverImage) ?? { width: 1200, height: 630 };
        // База 768 равна ширине колонки текста; вариант 2x даёт 1536.
        // Прежняя база 1536 порождала 2x на 3072 px — вчетверо больше нужного,
        // и это был самый тяжёлый файл, который телефон скачивал со страницы.
        return (
          <div className="rounded-[20px] overflow-hidden mb-8 bg-background">
            <img
              src={sanityImageTransform(article.coverImage, { width: 768 })!}
              srcSet={sanityImageSrcSet(article.coverImage, { width: 768 })}
              alt={article.coverImageAlt || (locale === 'ru' ? `Обложка статьи: ${article.title}` : `Article cover: ${article.title}`)}
              width={dims.width}
              height={dims.height}
              className="w-full h-auto block"
              loading="eager"
            />
          </div>
        );
      })()}

      {/* Header */}
      {article.badge && article.badge !== 'none' && (
        <div className="mb-3">
          <ArticleBadge badge={article.badge} locale={locale} />
        </div>
      )}
      <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight mb-4">
        {article.ownBadge && <OwnMark locale={locale} size={18} className="align-[-0.06em] mr-1.5" />}
        {article.title}
      </h1>

      <div className="flex items-center justify-between gap-4 mb-4 pb-4 border-b border-border">
        <div className="flex items-center flex-wrap gap-3">
          {/* Byline — always visible, required for Google News */}
          <div className="flex items-center gap-1.5 text-xs text-muted">
            {article.author?.slug ? (
              <a
                href={`/${locale}/authors/${article.author.slug}`}
                className="hover:text-accent transition-colors"
                rel="author"
              >
                {article.author.name}
              </a>
            ) : (
              <span rel="author">{article.author?.name || SITE_NAME}</span>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted">
            <Calendar size={12} />
            <span className="tabular-nums">{time} · {date}</span>
          </div>
          {article.readingTime && (
            <div className="flex items-center gap-1.5 text-xs text-muted">
              <Clock size={12} />
              <span>{article.readingTime} {locale === 'ru' ? 'мин чтения' : 'min read'}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <ViewCount id={article._id} initial={article.views || 0} />
          <LikeButton id={article._id} locale={locale} initialLikes={article.likes || 0} />
        </div>
      </div>

      {/* Share (mobile) — after header, before body */}
      <div className="lg:hidden mb-6">
        <ShareButtons url={pageUrl} title={article.title} locale={locale} vertical={false} />
      </div>

      {/* Body */}
      {article.body ? (
        <RichText value={article.body} fallbackAlt={article.title} locale={locale} />
      ) : (
        <p className="text-foreground">{article.excerpt}</p>
      )}

      <ArticleFooterMeta date={date} time={time} url={pageUrl} title={article.title} locale={locale} />

      {article.author && <AuthorCard author={article.author} locale={locale} />}

      {commentsEnabled && (
        <CommentSection targetId={article._id} locale={locale} />
      )}

      <EmailSubscribeForm locale={locale} source="article-detail" />

      {relatedArticles.length > 0 && (
        <div className="hidden lg:block mt-12 pt-8 border-t border-border">
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
                ownBadge={related.ownBadge}
                views={related.views}
                likes={related.likes}
                locale={locale}
              />
            ))}
          </div>
        </div>
      )}

      {/* Popular — mobile, replaces Related articles in that slot */}
      {popularItems.length > 0 && (
        <div className="lg:hidden mt-12 pt-8 border-t border-border">
          <PopularList items={popularItems} locale={locale} asHeadings={false} />
          {banners.length > 0 && (
            <div className="max-w-xs mx-auto mt-4">
              <SidebarBanner banners={banners} locale={locale} />
            </div>
          )}
        </div>
      )}

      {/* Mobile infinite feed — previous article, its own comments + Popular, repeating */}
      <InfiniteMobileFeed type="article" locale={locale} cursor={article.publishedAt} banners={banners} />
      </div>

      {/* Share + Popular (desktop, sticky) */}
      <aside className="hidden lg:block shrink-0 w-64">
        <div className="sticky top-20 md:top-[8rem] flex flex-col gap-4">
          <ArticleSidebar url={pageUrl} title={article.title} locale={locale} popularItems={popularItems} />
          {banners.length > 0 && <SidebarBanner banners={banners} locale={locale} />}
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
