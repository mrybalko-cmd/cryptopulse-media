import Link from 'next/link';
import Image from 'next/image';
import { Clock, ArrowRight, Eye } from 'lucide-react';
import ArticleBadge from './ArticleBadge';

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
  badge?: string;
  views?: number;
  priority?: boolean;
}

export default function ArticleCard({
  title, excerpt, slug, coverImage, coverImageAlt, publishedAt, readingTime, locale, featured, badge, views, priority
}: ArticleCardProps) {
  const date = new Date(publishedAt).toLocaleDateString(locale === 'ru' ? 'ru-RU' : 'en-US', {
    day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Europe/Prague'
  });
  const minRead = locale === 'ru' ? 'мин' : 'min';

  return (
    <Link
      href={`/${locale}/articles/${slug}`}
      className={`group block bg-card border border-border/70 rounded-xl overflow-hidden shadow-sm hover:border-accent/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 ${featured ? 'md:col-span-2' : ''}`}
    >
      {coverImage && (
        <div className={`relative overflow-hidden ${featured ? 'h-52' : 'h-36 sm:h-40 md:h-44'}`}>
          <Image
            src={coverImage}
            alt={coverImageAlt || title}
            fill
            sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 25vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            priority={priority}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
          {badge && badge !== 'none' && (
            <div className="absolute top-2 left-2">
              <ArticleBadge badge={badge} locale={locale} />
            </div>
          )}
        </div>
      )}
      <div className="p-4">
        {(!coverImage && badge && badge !== 'none') && (
          <div className="mb-2">
            <ArticleBadge badge={badge} locale={locale} />
          </div>
        )}
        <h3 className={`font-semibold text-foreground leading-snug group-hover:text-accent transition-colors ${featured ? 'text-base' : 'text-sm'} line-clamp-2`}>
          {title}
        </h3>
        <p className="text-muted text-xs mt-2 leading-relaxed line-clamp-2">{excerpt}</p>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2 text-xs text-muted">
            <span>{date}</span>
            {readingTime && (
              <>
                <span className="text-border">·</span>
                <Clock size={10} />
                <span>{readingTime} {minRead}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted">
            {typeof views === 'number' && (
              <span className="flex items-center gap-1">
                <Eye size={11} />
                {views}
              </span>
            )}
            <ArrowRight size={14} className="group-hover:text-accent group-hover:translate-x-0.5 transition-all" />
          </div>
        </div>
      </div>
    </Link>
  );
}
