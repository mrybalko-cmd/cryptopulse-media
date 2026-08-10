import Link from 'next/link';
import Image from 'next/image';
import { Eye, PenLine } from 'lucide-react';
import { sanityImageTransform } from '@/lib/sanityImage';
import type { AuthorWithLatest } from '@/lib/sanity';

/**
 * Clear glass, not a tinted card. The pane carries almost no fill of its own
 * (--glass-clear) and leans on backdrop-blur plus the coloured halos placed
 * *behind* it — without something behind, a pane this transparent looks
 * identical to an opaque one, which is exactly how the previous version read.
 *
 * `variant="stack"` renders one vertical list instead of the 4-column grid —
 * used on the mobile homepage, where this sits between the news rail and the
 * second hero article rather than as its own wide row.
 */

// A fine grain stops a large translucent plane from reading as flat plastic.
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

function Halos() {
  return (
    <>
      <span
        aria-hidden
        className="pointer-events-none absolute -left-[4%] -top-[46px] h-[190px] w-[420px] rounded-full blur-[54px] z-0"
        style={{ background: 'radial-gradient(50% 50% at 50% 50%, var(--halo-violet), transparent 70%)' }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -right-[3%] -top-[34px] h-[170px] w-[340px] rounded-full blur-[54px] z-0"
        style={{ background: 'radial-gradient(50% 50% at 50% 50%, var(--halo-cyan), transparent 70%)' }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute left-[34%] -bottom-[52px] h-[150px] w-[300px] rounded-full blur-[54px] z-0"
        style={{ background: 'radial-gradient(50% 50% at 50% 50%, var(--halo-pink), transparent 72%)' }}
      />
    </>
  );
}

function Avatar({ author, size }: { author: AuthorWithLatest; size: number }) {
  const ring = {
    width: size,
    height: size,
    background: 'linear-gradient(140deg, var(--glass-edge-lit), rgba(255,255,255,0.06) 45%, var(--glass-edge))',
  };
  if (!author.photo) {
    return (
      <span className="relative block shrink-0 rounded-full p-[2px] shadow-[0_4px_14px_rgba(0,0,0,0.28)]" style={ring}>
        <span className="flex h-full w-full items-center justify-center rounded-full bg-card text-sm font-bold text-muted">
          {author.name.charAt(0)}
        </span>
      </span>
    );
  }
  return (
    <span className="relative block shrink-0 rounded-full p-[2px] shadow-[0_4px_14px_rgba(0,0,0,0.28)]" style={ring}>
      <Image
        src={sanityImageTransform(author.photo, { width: size * 2 })!}
        alt={author.name}
        width={size}
        height={size}
        className="h-full w-full rounded-full object-cover"
        sizes={`${size}px`}
        unoptimized
      />
    </span>
  );
}

function Meta({ author, locale }: { author: AuthorWithLatest; locale: string }) {
  const isRu = locale === 'ru';
  const latest = author.latest!;
  const isNews = latest._type === 'news';
  const date = latest.publishedAt
    ? new Date(latest.publishedAt).toLocaleDateString(isRu ? 'ru-RU' : 'en-US', {
        day: 'numeric',
        month: 'short',
        timeZone: 'Europe/Prague',
      })
    : null;

  return (
    <span className="mt-3 flex items-center gap-[7px] overflow-hidden whitespace-nowrap text-[10.5px] text-muted tabular-nums">
      <span
        className={`shrink-0 rounded-full border border-[var(--glass-edge)] bg-white/[0.06] px-1.5 py-[2px] text-[8.5px] font-black uppercase tracking-[0.07em] ${
          isNews ? 'text-accent' : 'text-[var(--violet-2)]'
        }`}
      >
        {isNews ? (isRu ? 'Новость' : 'News') : isRu ? 'Статья' : 'Article'}
      </span>
      {date && <span>{date}</span>}
      {typeof latest.views === 'number' && latest.views > 0 && (
        <>
          <span className="opacity-40">·</span>
          <span
            className="inline-flex items-center gap-[3px]"
            title={`${latest.views} ${isRu ? 'просмотров' : 'views'}`}
          >
            <Eye size={10} aria-hidden />
            {latest.views}
          </span>
        </>
      )}
    </span>
  );
}

export default function AuthorColumns({
  authors,
  locale,
  variant = 'grid',
}: {
  authors: AuthorWithLatest[];
  locale: string;
  variant?: 'grid' | 'stack';
}) {
  const withLatest = authors.filter(a => a.latest);
  if (withLatest.length === 0) return null;
  const isRu = locale === 'ru';
  const isStack = variant === 'stack';

  return (
    <div className="relative">
      <Halos />

      <section
        aria-labelledby={`author-columns-heading-${variant}`}
        className="relative z-[1] overflow-hidden rounded-[18px] border border-[var(--glass-edge)] p-5
          shadow-[inset_0_1px_0_var(--glass-edge-lit),inset_0_-1px_0_rgba(255,255,255,0.05),0_26px_60px_rgba(0,0,0,0.42)]
          backdrop-blur-[22px] backdrop-saturate-150"
        style={{ background: 'linear-gradient(180deg, var(--glass-clear), var(--glass-clear-2))' }}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 opacity-[0.05]"
          style={{ backgroundImage: GRAIN }}
        />

        <div className="relative z-[1] mb-4 flex items-center justify-between gap-3">
          <h2
            id={`author-columns-heading-${variant}`}
            className="flex items-center gap-2.5 text-base font-extrabold -tracking-[0.015em] text-foreground"
          >
            <span
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[9px] border border-[var(--glass-edge)] text-[var(--violet-2)] shadow-[inset_0_1px_0_var(--glass-edge-lit)]"
              style={{ background: 'linear-gradient(160deg, rgba(255,255,255,0.16), rgba(255,255,255,0.04))' }}
            >
              <PenLine size={14} />
            </span>
            {isRu ? 'Авторские колонки' : 'From our authors'}
          </h2>
          <Link
            href={`/${locale}/authors`}
            className="whitespace-nowrap text-xs font-bold text-muted transition-colors hover:text-[var(--title-hover)]"
          >
            {isRu ? 'Все авторы →' : 'All authors →'}
          </Link>
        </div>

        <div className={isStack ? 'relative z-[1] flex flex-col' : 'relative z-[1] grid grid-cols-2 lg:grid-cols-4'}>
          {withLatest.map((author, i) => {
            const latest = author.latest!;
            const role = (isRu ? author.roleRu : author.roleEn) || '';
            const href = `/${locale}/${latest._type === 'article' ? 'articles' : 'news'}/${latest.slug}`;

            const title = (
              <Link
                href={href}
                className="line-clamp-2 min-h-[37px] text-[12.5px] font-bold leading-[1.35] text-foreground transition-colors hover:text-[var(--title-hover)]"
              >
                {latest.title}
              </Link>
            );

            if (isStack) {
              return (
                <div
                  key={author._id}
                  className={`flex items-start gap-3 ${i > 0 ? 'mt-3 border-t border-[var(--glass-edge)] pt-3' : ''}`}
                >
                  <Link href={`/${locale}/authors/${author.slug}`} className="shrink-0">
                    <Avatar author={author} size={42} />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link href={`/${locale}/authors/${author.slug}`} className="block">
                      <span className="block truncate text-[11px] font-extrabold uppercase tracking-[0.05em] text-foreground">
                        {author.name}
                      </span>
                      {role && <span className="mt-px block truncate text-[10.5px] text-muted">{role}</span>}
                    </Link>
                    <div className="mt-1">{title}</div>
                    <Meta author={author} locale={locale} />
                  </div>
                </div>
              );
            }

            return (
              <div
                key={author._id}
                // A hairline that fades out at both ends instead of a hard
                // border — a solid rule would sit on the glass, not in it.
                className={`relative min-w-0 px-4 first:pl-0 last:pr-0 ${
                  i > 0
                    ? 'before:absolute before:inset-y-0 before:left-0 before:w-px before:bg-[linear-gradient(180deg,transparent,var(--glass-edge)_20%,var(--glass-edge)_80%,transparent)]'
                    : ''
                }`}
              >
                <Link href={`/${locale}/authors/${author.slug}`} className="mb-3.5 flex items-center gap-[11px]">
                  <Avatar author={author} size={50} />
                  <span className="min-w-0">
                    <span className="block truncate text-xs font-extrabold uppercase tracking-[0.05em] text-foreground">
                      {author.name}
                    </span>
                    {role && <span className="mt-px block truncate text-[11px] text-muted">{role}</span>}
                  </span>
                </Link>
                {title}
                <Meta author={author} locale={locale} />
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
