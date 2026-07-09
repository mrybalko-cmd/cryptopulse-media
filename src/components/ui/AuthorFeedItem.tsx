import Link from 'next/link';
import Image from 'next/image';
import { Eye, Heart } from 'lucide-react';
import { sanityImageTransform } from '@/lib/sanityImage';
import type { AuthorFeedItem as AuthorFeedItemType } from '@/lib/sanity';

export default function AuthorFeedItem({ item, locale }: { item: AuthorFeedItemType; locale: string }) {
  const isArticle = item._type === 'article';
  const isRu = locale === 'ru';
  const href = `/${locale}/${isArticle ? 'articles' : 'news'}/${item.slug.current}`;
  const date = new Date(item.publishedAt).toLocaleDateString(isRu ? 'ru-RU' : 'en-US', {
    day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Europe/Prague',
  });

  return (
    <Link
      href={href}
      className="group flex items-center gap-4 py-3 px-3 -mx-3 rounded-lg border-b border-border last:border-0 hover:bg-foreground/5 transition-colors"
    >
      {item.coverImage && (
        <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden shrink-0">
          <Image
            src={sanityImageTransform(item.coverImage, { width: 128 })!}
            alt={item.coverImageAlt || item.title}
            fill
            className="object-cover"
            sizes="64px"
            unoptimized
          />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span
            className={`text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded shrink-0 ${
              isArticle ? 'bg-blue-600/15 text-blue-400' : 'bg-orange-600/15 text-orange-400'
            }`}
          >
            {isArticle ? (isRu ? 'Статья' : 'Article') : (isRu ? 'Новость' : 'News')}
          </span>
          <span className="text-xs text-muted whitespace-nowrap">{date}</span>
        </div>
        <h3 className="text-sm font-semibold text-foreground leading-snug line-clamp-2 group-hover:text-accent transition-colors">
          {item.title}
        </h3>
      </div>
      <div className="flex items-center gap-3 text-xs text-muted shrink-0">
        {typeof item.views === 'number' && item.views > 0 && (
          <span className="flex items-center gap-1">
            <Eye size={11} />
            {item.views}
          </span>
        )}
        {typeof item.likes === 'number' && item.likes > 0 && (
          <span className="flex items-center gap-1">
            <Heart size={11} />
            {item.likes}
          </span>
        )}
      </div>
    </Link>
  );
}
