import Link from 'next/link';
import Image from 'next/image';
import { sanityImageTransform } from '@/lib/sanityImage';

// Homepage second-row article card — same overlay style as "Тема дня": the
// cover fills the card, a bottom gradient carries a three-line white title +
// date. `h-full` so the three cards stretch to fill their grid row, which is
// sized by the Market Pulse widget beside them (they end up the same height).
interface OverlayArticleCardProps {
  title: string;
  slug: string;
  coverImage?: string;
  coverImageAlt?: string;
  publishedAt: string;
  locale: string;
}

export default function OverlayArticleCard({ title, slug, coverImage, coverImageAlt, publishedAt, locale }: OverlayArticleCardProps) {
  const date = new Date(publishedAt).toLocaleDateString(locale === 'ru' ? 'ru-RU' : 'en-US', {
    day: 'numeric', month: 'short', timeZone: 'Europe/Prague',
  });

  return (
    <Link
      href={`/${locale}/articles/${slug}`}
      className="group relative block h-full min-h-[112px] rounded-lg overflow-hidden border border-border/70"
    >
      {coverImage && (
        <Image
          src={sanityImageTransform(coverImage, { width: 480 })!}
          alt={coverImageAlt || title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          unoptimized
        />
      )}
      <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.88)_0%,rgba(0,0,0,0.25)_55%,transparent_78%)]" />
      <div className="absolute inset-x-0 bottom-0 p-2.5">
        <h3 className="text-white text-[11.5px] font-bold leading-snug line-clamp-3 [text-shadow:0_1px_6px_rgba(0,0,0,0.5)] group-hover:text-[var(--title-hover)] transition-colors">
          {title}
        </h3>
        <div className="text-white/[0.78] text-[9px] mt-1">{date}</div>
      </div>
    </Link>
  );
}
