import Link from 'next/link';
import Image from 'next/image';
import { sanityImageTransform } from '@/lib/sanityImage';

interface ArticleRowCardProps {
  title: string;
  slug: string;
  coverImage?: string;
  coverImageAlt?: string;
  publishedAt: string;
  locale: string;
}

// Small horizontal card — thumb left, title+date right. Used for the mobile
// homepage's "two stacked small cards" slot (step 2 of the mobile layout
// review); not used on desktop, which shows these same articles as part of
// row 2's compact grid instead.
export default function ArticleRowCard({ title, slug, coverImage, coverImageAlt, publishedAt, locale }: ArticleRowCardProps) {
  const date = new Date(publishedAt).toLocaleDateString(locale === 'ru' ? 'ru-RU' : 'en-US', {
    day: 'numeric', month: 'short', timeZone: 'Europe/Prague',
  });

  return (
    <Link
      href={`/${locale}/articles/${slug}`}
      className="group flex gap-2.5 border border-border rounded-xl bg-card p-2 hover:border-accent/50 transition-colors"
    >
      {coverImage && (
        <div className="relative w-20 h-16 rounded-lg overflow-hidden shrink-0">
          <Image
            src={sanityImageTransform(coverImage, { width: 200 })!}
            alt={coverImageAlt || title}
            fill
            className="object-cover"
            sizes="80px"
            unoptimized
          />
        </div>
      )}
      <div className="min-w-0 flex flex-col justify-center">
        <h3 className="text-xs font-semibold text-foreground leading-snug line-clamp-2 group-hover:text-accent transition-colors">
          {title}
        </h3>
        <span className="text-[10px] text-muted mt-1">{date}</span>
      </div>
    </Link>
  );
}
