import Link from 'next/link';
import Image from 'next/image';
import { PenLine } from 'lucide-react';
import { sanityImageTransform } from '@/lib/sanityImage';
import type { AuthorWithLatest } from '@/lib/sanity';

// Deliberately more prominent than the plain bordered boxes used for the
// article rows around it (accent-tinted background/border, bigger avatars,
// icon-badge heading) — this is the one section on the homepage that's
// about people, not just more headlines, and should read that way.
export default function AuthorColumns({ authors, locale }: { authors: AuthorWithLatest[]; locale: string }) {
  const withLatest = authors.filter((a) => a.latest);
  if (withLatest.length === 0) return null;
  const isRu = locale === 'ru';

  return (
    <section
      aria-labelledby="author-columns-heading"
      className="bg-gradient-to-br from-accent/[0.07] via-card to-card border border-accent/25 rounded-xl p-5 sm:p-6 shadow-sm"
    >
      <div className="flex items-center justify-between mb-5">
        <h2 id="author-columns-heading" className="flex items-center gap-2.5 text-base font-bold text-foreground">
          <span className="w-7 h-7 rounded-lg bg-accent/15 flex items-center justify-center shrink-0">
            <PenLine size={14} className="text-accent" />
          </span>
          {isRu ? 'Авторские колонки' : 'From our authors'}
        </h2>
        <Link href={`/${locale}/authors`} className="text-xs font-medium text-accent hover:opacity-75 transition-opacity">
          {isRu ? 'Все авторы →' : 'All authors →'}
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-6">
        {withLatest.map((author, i) => {
          const role = (isRu ? author.roleRu : author.roleEn) || '';
          const latestHref = `/${locale}/${author.latest!._type === 'article' ? 'articles' : 'news'}/${author.latest!.slug}`;
          return (
            <div
              key={author._id}
              className={`${i > 0 ? 'border-t lg:border-t-0 lg:border-l border-accent/15 pt-5 lg:pt-0 lg:pl-5' : ''}`}
            >
              <Link href={`/${locale}/authors/${author.slug}`} className="group flex items-center gap-3 mb-3">
                {author.photo ? (
                  <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0 border-2 border-accent/30">
                    <Image
                      src={sanityImageTransform(author.photo, { width: 112 })!}
                      alt={author.name}
                      fill
                      className="object-cover"
                      sizes="56px"
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="w-14 h-14 rounded-full bg-accent/10 border-2 border-accent/30 flex items-center justify-center shrink-0">
                    <span className="text-base font-bold text-accent">{author.name.charAt(0)}</span>
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-wide text-foreground group-hover:text-accent transition-colors truncate">
                    {author.name}
                  </p>
                  {role && <p className="text-[11px] text-muted truncate">{role}</p>}
                </div>
              </Link>
              <Link
                href={latestHref}
                className="block text-xs font-semibold text-accent hover:opacity-75 transition-opacity leading-snug line-clamp-2"
              >
                {author.latest!.title}
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}
