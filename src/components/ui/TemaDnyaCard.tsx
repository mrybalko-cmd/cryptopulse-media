import Link from 'next/link';
import Image from 'next/image';
import { Clock, ArrowRight, Eye, Heart } from 'lucide-react';
import { sanityImageTransform } from '@/lib/sanityImage';

// Homepage "Тема дня" — a single featured article shown instead of the old
// two hero cards. One unified card (cover on top, text below), centered in its
// two-column slot with equal side margins. Its height is driven by the
// Popular list beside it: the cover is `flex-1` so it fills whatever height
// remains after the (compact) text block, which keeps this card exactly as
// tall as "Популярное" (never taller). Same hover behavior as ArticleCard.
interface TemaDnyaCardProps {
  article: {
    title: string;
    excerpt?: string;
    slug: { current: string };
    coverImage?: string;
    coverImageAlt?: string;
    publishedAt: string;
    readingTime?: number;
    views?: number;
    likes?: number;
  };
  locale: string;
}

export default function TemaDnyaCard({ article, locale }: TemaDnyaCardProps) {
  const isRu = locale === 'ru';
  const date = new Date(article.publishedAt).toLocaleDateString(isRu ? 'ru-RU' : 'en-US', {
    day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Europe/Prague',
  });
  const minRead = isRu ? 'мин' : 'min';

  return (
    <Link
      href={`/${locale}/articles/${article.slug.current}`}
      className="group flex flex-col h-full w-full max-w-[460px] bg-card border border-border/70 rounded-xl overflow-hidden shadow-sm hover:border-accent/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
    >
      {article.coverImage && (
        <div className="relative flex-1 min-h-0 overflow-hidden">
          <Image
            src={sanityImageTransform(article.coverImage, { width: 900 })!}
            alt={article.coverImageAlt || article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            priority
            unoptimized
          />
        </div>
      )}
      {/* Text zone is a fixed 30% of the card height (cover fills the other
          70%). No excerpt — just the kicker, a two-line title (tightened
          leading/spacing so both lines always fit in the band) and meta. */}
      <div
        className="flex flex-col justify-center overflow-hidden basis-[30%] grow-0 shrink-0 px-4"
        style={{ backgroundColor: 'var(--tema-fill)' }}
      >
        <span className="text-[10.5px] font-black uppercase tracking-[0.12em] text-article-accent mb-1">
          {isRu ? 'Тема дня' : 'Top story'}
        </span>
        <h3 className="font-semibold text-foreground leading-[1.18] group-hover:text-accent transition-colors text-[17px] line-clamp-2">
          {article.title}
        </h3>
        <div className="flex items-center justify-between mt-1.5">
          <div className="flex items-center gap-2 text-muted text-xs">
            <span>{date}</span>
            {article.readingTime && (
              <>
                <span className="text-border">·</span>
                <Clock size={10} />
                <span>{article.readingTime} {minRead}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted">
            {typeof article.views === 'number' && (
              <span className="flex items-center gap-1"><Eye size={11} />{article.views}</span>
            )}
            {typeof article.likes === 'number' && article.likes > 0 && (
              <span className="flex items-center gap-1"><Heart size={11} />{article.likes}</span>
            )}
            <ArrowRight size={14} className="group-hover:text-accent group-hover:translate-x-0.5 transition-all" />
          </div>
        </div>
      </div>
    </Link>
  );
}
