import Link from 'next/link';
import Image from 'next/image';
import { Clock, ArrowRight, Eye, Heart, Zap } from 'lucide-react';
import ArticleBadge from './ArticleBadge';
import { sanityImageTransform } from '@/lib/sanityImage';

interface ArticleCardProps {
  title: string;
  excerpt: string;
  slug: string;
  coverImage?: string;
  coverImageAlt?: string;
  publishedAt: string;
  readingTime?: number;
  locale: string;
  featured?: boolean;
  // Smaller image/type-scale for dense grids (homepage rows 2/4/5) — same
  // card, same hover/badge/link behavior, just less vertical footprint so
  // more articles fit per row without a second component to keep in sync.
  compact?: boolean;
  badge?: string;
  views?: number;
  likes?: number;
  priority?: boolean;
  topic?: string;
  // Bottom-to-top gradient fade over the cover image, blending it into the
  // card background — purely decorative (no text sits on the image).
  // Defaults off site-wide per user preference; kept as an escape hatch
  // rather than deleted outright in case a future usage wants it back.
  imageFade?: boolean;
}

export default function ArticleCard({
  title, excerpt, slug, coverImage, coverImageAlt, publishedAt, readingTime, locale, featured, compact, badge, views, likes, priority, topic, imageFade = false
}: ArticleCardProps) {
  const date = new Date(publishedAt).toLocaleDateString(locale === 'ru' ? 'ru-RU' : 'en-US', {
    day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Europe/Prague'
  });
  const minRead = locale === 'ru' ? 'мин' : 'min';

  return (
    <Link
      href={`/${locale}/articles/${slug}`}
      className={`group flex flex-col h-full bg-card border border-border/70 ${compact ? 'rounded-lg' : 'rounded-xl'} overflow-hidden shadow-sm hover:border-accent/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 ${featured ? 'md:col-span-2' : ''}`}
    >
      {coverImage && (
        <div className={`relative overflow-hidden ${featured ? 'h-52' : compact ? 'h-20 sm:h-24' : 'h-36 sm:h-40 md:h-44'}`}>
          <Image
            src={sanityImageTransform(coverImage, { width: compact ? 400 : 1280 })!}
            alt={coverImageAlt || title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            priority={priority}
            unoptimized
          />
          {imageFade && <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />}
          {badge && badge !== 'none' && !compact && (
            <div className="absolute top-2 left-2">
              <ArticleBadge badge={badge} locale={locale} />
            </div>
          )}
          {topic === 'ai' && (
            <div className={`absolute top-2 right-2 rounded bg-blue-600 flex items-center justify-center ${compact ? 'w-4 h-4' : 'w-5 h-5'}`} title="AI">
              <Zap size={compact ? 9 : 11} className="text-white" fill="currentColor" />
            </div>
          )}
        </div>
      )}
      <div className={`flex flex-col flex-1 ${compact ? 'p-2.5' : 'p-4'}`}>
        {(!coverImage && badge && badge !== 'none' && !compact) && (
          <div className="mb-2">
            <ArticleBadge badge={badge} locale={locale} />
          </div>
        )}
        <h3 className={`font-semibold text-foreground leading-snug group-hover:text-accent transition-colors ${featured ? 'text-base' : compact ? 'text-xs' : 'text-sm'} line-clamp-2`}>
          {title}
        </h3>
        {!compact && <p className="text-muted text-xs mt-2 leading-relaxed line-clamp-2">{excerpt}</p>}
        {/* mt-auto pins this row to the card's bottom edge when the card is
            stretched taller than its own content (e.g. row 2 next to the
            taller Crypto Prices widget) — falls back to the usual small gap
            below the title when there's no extra height to fill. */}
        <div className={`flex items-center justify-between mt-auto ${compact ? 'pt-1.5' : 'pt-3'}`}>
          <div className={`flex items-center gap-2 text-muted ${compact ? 'text-[10px]' : 'text-xs'}`}>
            <span>{date}</span>
            {readingTime && !compact && (
              <>
                <span className="text-border">·</span>
                <Clock size={10} />
                <span>{readingTime} {minRead}</span>
              </>
            )}
          </div>
          {!compact && (
            <div className="flex items-center gap-2 text-xs text-muted">
              {typeof views === 'number' && (
                <span className="flex items-center gap-1">
                  <Eye size={11} />
                  {views}
                </span>
              )}
              {typeof likes === 'number' && likes > 0 && (
                <span className="flex items-center gap-1">
                  <Heart size={11} />
                  {likes}
                </span>
              )}
              <ArrowRight size={14} className="group-hover:text-accent group-hover:translate-x-0.5 transition-all" />
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
