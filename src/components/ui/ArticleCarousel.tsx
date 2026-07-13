import Link from 'next/link';
import Image from 'next/image';
import { sanityImageTransform } from '@/lib/sanityImage';

interface CarouselArticle {
  _id: string;
  title: string;
  slug: string | { current: string };
  coverImage?: string;
  coverImageAlt?: string;
}

// Horizontal swipeable strip — real <a> tags in normal DOM flow (not
// rendered via a click-only JS carousel), so every card stays a crawlable
// link regardless of scroll position; scroll-snap is pure CSS.
export default function ArticleCarousel({ articles, locale }: { articles: CarouselArticle[]; locale: string }) {
  if (articles.length === 0) return null;

  return (
    <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 [scrollbar-width:thin]">
      {articles.map((article) => {
        const slug = typeof article.slug === 'string' ? article.slug : article.slug.current;
        return (
          <Link
            key={article._id}
            href={`/${locale}/articles/${slug}`}
            className="group snap-start shrink-0 w-[68%] xs:w-[60%] sm:w-[45%] border border-border rounded-xl bg-card overflow-hidden hover:border-accent/50 transition-colors"
          >
            {article.coverImage && (
              <div className="relative h-24 overflow-hidden">
                <Image
                  src={sanityImageTransform(article.coverImage, { width: 400 })!}
                  alt={article.coverImageAlt || article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="280px"
                  unoptimized
                />
              </div>
            )}
            <div className="p-2.5">
              <h4 className="text-xs font-semibold text-foreground leading-snug line-clamp-2 group-hover:text-accent transition-colors">
                {article.title}
              </h4>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
