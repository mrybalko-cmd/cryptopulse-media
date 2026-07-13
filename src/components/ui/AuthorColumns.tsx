import Link from 'next/link';
import Image from 'next/image';
import { PenLine } from 'lucide-react';
import { sanityImageTransform } from '@/lib/sanityImage';
import type { AuthorWithLatest } from '@/lib/sanity';

// Fixed "classic silver" palette, deliberately NOT wired to the site's
// --accent/--card/--foreground theme tokens — this block should look the
// same in light and dark mode, chosen and approved separately from the
// rest of the theme (see the palette-options mockup from that review).
const SILVER = {
  bg: 'linear-gradient(135deg, #F2F3F5, #E3E5E8)',
  border: '#D3D6DA',
  text: '#2B2E33',
  muted: '#6B707A',
  accent: '#64748B',
  link: '#475569',
};

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
      style={{ background: SILVER.bg, border: `1px solid ${SILVER.border}` }}
    >
      <div className="flex items-center justify-between mb-5">
        <h2 id="author-columns-heading" className="flex items-center gap-2.5 text-base font-bold" style={{ color: SILVER.text }}>
          <span className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${SILVER.accent}33` }}>
            <PenLine size={14} style={{ color: SILVER.accent }} />
          </span>
          {isRu ? 'Авторские колонки' : 'From our authors'}
        </h2>
        <Link href={`/${locale}/authors`} className="text-xs font-medium hover:opacity-75 transition-opacity" style={{ color: SILVER.accent }}>
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
              style={i > 0 ? { borderColor: SILVER.border } : undefined}
            >
              <Link href={`/${locale}/authors/${author.slug}`} className="group flex items-center gap-3 mb-3">
                {author.photo ? (
                  <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0 border-2" style={{ borderColor: `${SILVER.accent}55` }}>
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
                    style={{ background: `${SILVER.accent}1a`, borderColor: `${SILVER.accent}55` }}
                  >
                    <span className="text-base font-bold" style={{ color: SILVER.accent }}>{author.name.charAt(0)}</span>
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-wide truncate transition-colors" style={{ color: SILVER.text }}>
                    {author.name}
                  </p>
                  {role && <p className="text-[11px] truncate" style={{ color: SILVER.muted }}>{role}</p>}
                </div>
              </Link>
              <Link
                href={latestHref}
                className="block text-xs font-semibold hover:opacity-75 transition-opacity leading-snug line-clamp-2"
                style={{ color: SILVER.link }}
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
