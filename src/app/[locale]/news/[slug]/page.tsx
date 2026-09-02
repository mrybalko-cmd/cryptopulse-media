export const revalidate = 300;

import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import ViewCount from '@/components/ui/ViewCount';
import OwnMark from '@/components/ui/OwnMark';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowLeft, Calendar, ExternalLink } from 'lucide-react';
import EmailSubscribeForm from '@/components/ui/EmailSubscribeForm';
import AuthorCard from '@/components/ui/AuthorCard';
import ArticleFooterMeta from '@/components/ui/ArticleFooterMeta';
import { fetchNewsBySlug, fetchRelatedNews, fetchPopularContent, fetchActiveBanners, fetchRecentSlugsForPrerender } from '@/lib/sanity';
import RichText from '@/components/ui/RichText';
import ShareButtons from '@/components/ui/ShareButtons';
import LikeButton from '@/components/ui/LikeButton';
import NewsCard from '@/components/ui/NewsCard';
import ArticleBadge from '@/components/ui/ArticleBadge';
import PopularList from '@/components/ui/PopularList';
import ArticleSidebar from '@/components/ui/ArticleSidebar';
import SidebarBanner from '@/components/ui/SidebarBanner';
import InfiniteMobileFeed from '@/components/ui/InfiniteMobileFeed';
import CommentSection from '@/components/ui/CommentSection';

import { sanityImageTransform, sanityImageSrcSet, sanityImageDimensions } from '@/lib/sanityImage';
import { truncateDesc, pageTitle, titleText } from '@/lib/metadata';
import { SITE_NAME, SITE_URL } from '@/lib/site';
import BoltIcon from '@/components/ui/BoltIcon';

type Props = { params: Promise<{ locale: string; slug: string }> };

// The newest news prerender; everything older renders on demand and is
// then cached by ISR. Returning [] meant every single URL was a cold
// server render on its first request.
export async function generateStaticParams() {
  return fetchRecentSlugsForPrerender('news', 80);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const news = await fetchNewsBySlug(slug, locale);
  if (!news) return {};

  const title = news.seo?.metaTitle || news.title;
  const description = truncateDesc(news.seo?.metaDescription || news.excerpt || '');
  // 16:9 (not the classic 1200x630 OG ratio) — Google Discover's own image
  // guidance calls out 16:9 specifically for large-image thumbnail eligibility.
  const ogImageUrl = news.seoOgImageUrl
    || sanityImageTransform(news.coverImage, { width: 1200, height: 675, format: 'jpg' })
    || `${SITE_URL}/${locale}/opengraph-image`;
  const canonicalUrl = news.seo?.canonicalUrl || `${SITE_URL}/${locale}/news/${slug}`;
  const translationLang = news.translation?.language;
  const translationSlug = news.translation?.slug;

  return {
    title: pageTitle(title),
    description,
    keywords: news.seo?.keywords,
    ...(news.seo?.noIndex && { robots: { index: false, follow: false, googleBot: { index: false, follow: false } } }),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        [locale]: `${SITE_URL}/${locale}/news/${slug}`,
        ...(translationLang && translationSlug
          ? { [translationLang]: `${SITE_URL}/${translationLang}/news/${translationSlug}` }
          : {}),
        // x-default points at the English version when we can resolve it —
        // either this page is EN, or its translation is the EN one. Omitted
        // when no EN counterpart exists so it never targets a missing URL.
        ...(locale === 'en'
          ? { 'x-default': `${SITE_URL}/en/news/${slug}` }
          : translationLang === 'en' && translationSlug
            ? { 'x-default': `${SITE_URL}/en/news/${translationSlug}` }
            : {}),
      },
    },
    openGraph: {
      type: 'article',
      title,
      description,
      url: `${SITE_URL}/${locale}/news/${slug}`,
      siteName: SITE_NAME,
      locale: locale === 'ru' ? 'ru_RU' : 'en_US',
      images: [{ url: ogImageUrl, width: 1200, height: 675, alt: title }],
      publishedTime: news.publishedAt,
      modifiedTime: news.updatedAt || news.publishedAt,
      ...(news.author?.slug && {
        authors: [`${SITE_URL}/${locale}/authors/${news.author.slug}`],
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
  const popularItems = (await fetchPopularContent(locale, 8))
    .filter((item) => item._id !== news._id)
    .slice(0, 7);
  const banners = await fetchActiveBanners(locale);

  // Unified with the homepage feed: 24-hour time and dot-separated DD.MM.YYYY,
  // formatted locale-independently (en-GB, h23) so RU and EN render identically.
  const dtParts = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
    timeZone: 'Europe/Prague',
  }).formatToParts(new Date(news.publishedAt)).reduce((acc, p) => { acc[p.type] = p.value; return acc; }, {} as Record<string, string>);
  const time = `${dtParts.hour}:${dtParts.minute}`;
  const date = `${dtParts.day}.${dtParts.month}.${dtParts.year}`;

  const wordCount = countBodyWords(news.body);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: news.title,
    description: news.excerpt,
    url: `${SITE_URL}/${locale}/news/${slug}`,
    image: [news.seoOgImageUrl || news.coverImage || `${SITE_URL}/${locale}/opengraph-image`],
    datePublished: news.publishedAt,
    dateModified: news.updatedAt || news.publishedAt,
    inLanguage: locale,
    ...(wordCount > 0 && { wordCount }),
    author: news.author
      ? { '@type': 'Person', name: news.author.name.trim(), url: `${SITE_URL}/${locale}/authors/${news.author.slug}` }
      : { '@type': 'Organization', '@id': `${SITE_URL}/#organization` },
    publisher: { '@id': `${SITE_URL}/#organization` },
    mainEntityOfPage: `${SITE_URL}/${locale}/news/${slug}`,
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
      { '@type': 'ListItem', position: 2, name: locale === 'ru' ? 'Новости' : 'News', item: `${SITE_URL}/${locale}/news` },
      { '@type': 'ListItem', position: 3, name: news.title, item: `${SITE_URL}/${locale}/news/${slug}` },
    ],
  };

  const pageUrl = `${SITE_URL}/${locale}/news/${slug}`;

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
      {news.coverImage && (() => {
        const dims = sanityImageDimensions(news.coverImage) ?? { width: 1200, height: 630 };
        return (
          <div className="rounded-[20px] overflow-hidden mb-8 bg-background">
            <img
              src={sanityImageTransform(news.coverImage, { width: 1536 })!}
              srcSet={sanityImageSrcSet(news.coverImage, { width: 1536 })}
              alt={news.coverImageAlt || (locale === 'ru' ? `Обложка новости: ${news.title}` : `News cover: ${news.title}`)}
              width={dims.width}
              height={dims.height}
              className="w-full h-auto block"
              loading="eager"
            />
          </div>
        );
      })()}

      {/* Header */}
      {news.badge && news.badge !== 'none' && (
        <div className="mb-3">
          <ArticleBadge badge={news.badge} locale={locale} />
        </div>
      )}
      {news.breaking && (
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600 text-white text-xs font-bold mb-4 animate-pulse">
          <BoltIcon size={12} />
          {locale === 'ru' ? 'Важное' : 'Breaking News'}
        </div>
      )}
      <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight mb-4">
        {news.ownBadge && <OwnMark locale={locale} size={18} className="align-[-0.06em] mr-1.5" />}
        {news.title}
      </h1>

      <div className="flex items-center justify-between gap-4 mb-4 pb-4 border-b border-border">
        <div className="flex items-center flex-wrap gap-3">
          {/* Byline — always visible, required for Google News */}
          <div className="flex items-center gap-1.5 text-xs text-muted">
            {news.author?.slug ? (
              <a
                href={`/${locale}/authors/${news.author.slug}`}
                className="hover:text-accent transition-colors"
                rel="author"
              >
                {news.author.name}
              </a>
            ) : (
              <span rel="author">{news.author?.name || SITE_NAME}</span>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted">
            <Calendar size={12} />
            <span className="tabular-nums">{time} · {date}</span>
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
        <div className="flex items-center gap-3">
          <ViewCount id={news._id} initial={news.views || 0} />
          <LikeButton id={news._id} locale={locale} initialLikes={news.likes || 0} />
        </div>
      </div>

      {/* Share (mobile) — after header, before body */}
      <div className="lg:hidden mb-6">
        <ShareButtons url={pageUrl} title={news.title} locale={locale} vertical={false} />
      </div>

      {/* Body */}
      {news.body ? (
        <RichText value={news.body} fallbackAlt={news.title} locale={locale} />
      ) : (
        <p className="text-foreground">{news.excerpt}</p>
      )}

      <ArticleFooterMeta date={date} time={time} url={pageUrl} title={news.title} locale={locale} />

      {news.author && <AuthorCard author={news.author} locale={locale} />}

      {commentsEnabled && (
        <CommentSection targetId={news._id} locale={locale} />
      )}

      <EmailSubscribeForm locale={locale} source="news-detail" />

      {relatedNews.length > 0 && (
        <div className="hidden lg:block mt-12 pt-8 border-t border-border">
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
                breaking={related.breaking}
                ownBadge={related.ownBadge}
              />
            ))}
          </div>
        </div>
      )}

      {/* Popular — mobile, replaces Related news in that slot */}
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

      {/* Mobile infinite feed — previous news, its own comments + Popular, repeating */}
      <InfiniteMobileFeed type="news" locale={locale} cursor={news.publishedAt} banners={banners} />
      </div>

      {/* Share + Popular (desktop, sticky) */}
      <aside className="hidden lg:block shrink-0 w-64">
        <div className="sticky top-20 md:top-[8rem] flex flex-col gap-4">
          <ArticleSidebar url={pageUrl} title={news.title} locale={locale} popularItems={popularItems} />
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
