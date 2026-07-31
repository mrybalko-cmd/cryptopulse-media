import Link from 'next/link';
import Image from 'next/image';
import { Eye } from 'lucide-react';
import { sanityImageTransform } from '@/lib/sanityImage';

// Homepage "Тема дня" — the single featured article. Overlay hero: a 16:9 cover
// with the copy laid over a bottom gradient (bold red "Тема дня" kicker, a
// two-line white title and meta). Kept at a fixed 16:9 so it stays compact; the
// Popular list beside it stretches to this height.
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
      className="group relative block w-full max-w-[560px] aspect-[16/9] lg:aspect-auto lg:h-full lg:min-h-[240px] rounded-xl overflow-hidden border border-border/70 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
    >
      {article.coverImage && (
        <Image
          src={sanityImageTransform(article.coverImage, { width: 960 })!}
          alt={article.coverImageAlt || article.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          priority
          unoptimized
        />
      )}
      <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.9)_0%,rgba(0,0,0,0.4)_42%,transparent_68%)]" />
      <div className="absolute inset-x-0 bottom-0 p-[17px]">
        <span className="block text-[14px] font-black uppercase tracking-[0.12em] text-[#ff5252] mb-1.5 [text-shadow:0_1px_5px_rgba(0,0,0,0.6)]">
          {isRu ? 'Тема дня' : 'Top story'}
        </span>
        <h3 className="text-white font-extrabold text-[20px] leading-snug line-clamp-2 [text-shadow:0_1px_8px_rgba(0,0,0,0.4)] group-hover:text-[var(--title-hover)] transition-colors">
          {article.title}
        </h3>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-white/85 mt-2.5">
          <span>{date}</span>
          {article.readingTime && <span>{article.readingTime} {minRead}</span>}
          {typeof article.views === 'number' && (
            <span className="inline-flex items-center gap-1"><Eye size={11} />{article.views}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
