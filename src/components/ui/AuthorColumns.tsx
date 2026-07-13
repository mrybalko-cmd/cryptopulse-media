import Link from 'next/link';
import Image from 'next/image';
import { PenLine } from 'lucide-react';
import { sanityImageTransform } from '@/lib/sanityImage';
import type { AuthorWithLatest } from '@/lib/sanity';

// Own fixed pair of tokens (--author-*, defined in globals.css under :root
// and html.light), deliberately separate from --card/--accent so this block
// doesn't just look like every other card — graphite in dark mode, silver
// in light mode, approved separately from the rest of the theme via the
// palette-options mockups from that review. Still theme-*aware*: it swaps
// with the site's light/dark toggle, just to its own pair of colors rather
// than the shared ones.
const bg = 'linear-gradient(135deg, var(--author-bg-1), var(--author-bg-2))';
const border = 'var(--author-border)';
const text = 'var(--author-text)';
const muted = 'var(--author-muted)';
const accent = 'var(--author-accent)';
const link = 'var(--author-link)';
const accentMix = (pct: number) => `color-mix(in srgb, ${accent} ${pct}%, transparent)`;

// Deliberately more prominent than the plain bordered boxes used for the
// article rows around it (bigger avatars, icon-badge heading) — this is
// the one section on the homepage that's about people, not just more
// headlines, and should read that way.
export default function AuthorColumns({ authors, locale }: { authors: AuthorWithLatest[]; locale: string }) {
  const withLatest = authors.filter((a) => a.latest);
  if (withLatest.length === 0) return null;
  const isRu = locale === 'ru';

  return (
    <section
      aria-labelledby="author-columns-heading"
      className="rounded-xl p-5 sm:p-6 shadow-sm"
      style={{ background: bg, border: `1px solid ${border}` }}
    >
      <div className="flex items-center justify-between mb-5">
        <h2 id="author-columns-heading" className="flex items-center gap-2.5 text-base font-bold" style={{ color: text }}>
          <span className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: accentMix(20) }}>
            <PenLine size={14} style={{ color: accent }} />
          </span>
          {isRu ? 'Авторские колонки' : 'From our authors'}
        </h2>
        <Link href={`/${locale}/authors`} className="text-xs font-medium hover:opacity-75 transition-opacity" style={{ color: accent }}>
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
              className={i > 0 ? 'border-t lg:border-t-0 lg:border-l pt-5 lg:pt-0 lg:pl-5' : ''}
              style={i > 0 ? { borderColor: border } : undefined}
            >
              <Link href={`/${locale}/authors/${author.slug}`} className="group flex items-center gap-3 mb-3">
                {author.photo ? (
                  <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0 border-2" style={{ borderColor: accentMix(33) }}>
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
                  <div
                    className="w-14 h-14 rounded-full border-2 flex items-center justify-center shrink-0"
                    style={{ background: accentMix(10), borderColor: accentMix(33) }}
                  >
                    <span className="text-base font-bold" style={{ color: accent }}>{author.name.charAt(0)}</span>
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-wide truncate transition-colors" style={{ color: text }}>
                    {author.name}
                  </p>
                  {role && <p className="text-[11px] truncate" style={{ color: muted }}>{role}</p>}
                </div>
              </Link>
              <Link
                href={latestHref}
                className="block text-xs font-semibold hover:opacity-75 transition-opacity leading-snug line-clamp-2"
                style={{ color: link }}
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
