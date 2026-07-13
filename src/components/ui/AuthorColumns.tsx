import Link from 'next/link';
import Image from 'next/image';
import { sanityImageTransform } from '@/lib/sanityImage';
import type { AuthorWithLatest } from '@/lib/sanity';

export default function AuthorColumns({ authors, locale }: { authors: AuthorWithLatest[]; locale: string }) {
  const withLatest = authors.filter((a) => a.latest);
  if (withLatest.length === 0) return null;
  const isRu = locale === 'ru';

  return (
    <section aria-labelledby="author-columns-heading" className="bg-card border border-border rounded-xl p-5 sm:p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 id="author-columns-heading" className="flex items-center gap-2 text-sm font-bold text-foreground">
          <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
          {isRu ? 'Авторские колонки' : 'From our authors'}
        </h2>
        <Link href={`/${locale}/authors`} className="text-xs text-muted hover:text-accent transition-colors">
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
              className={`${i > 0 ? 'border-t lg:border-t-0 lg:border-l border-border pt-5 lg:pt-0 lg:pl-5' : ''}`}
            >
              <Link href={`/${locale}/authors/${author.slug}`} className="group flex items-center gap-2.5 mb-3">
                {author.photo ? (
                  <div className="relative w-11 h-11 rounded-full overflow-hidden shrink-0 border-2 border-border">
                    <Image
                      src={sanityImageTransform(author.photo, { width: 88 })!}
                      alt={author.name}
                      fill
                      className="object-cover"
                      sizes="44px"
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="w-11 h-11 rounded-full bg-accent/10 border-2 border-border flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-accent">{author.name.charAt(0)}</span>
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
