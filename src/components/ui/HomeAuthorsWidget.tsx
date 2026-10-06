import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronRight, Eye, Flame } from 'lucide-react';
import type { HomeAuthorsWidget as WidgetData, WidgetMaterial } from '@/lib/sanity';
import { authorName } from '@/lib/authorName';
import { authorColorVar } from '@/lib/authorColors';
import type { CSSProperties } from 'react';

/**
 * Блок участников внизу главной.
 *
 * Крупная работа слева, три публикации колонками под ней, «Сейчас читают»
 * справа. Каждая часть либо собрана редактором в админке, либо подобрана
 * автоматически — компонент об этом не знает и рисует то, что пришло.
 */

function href(locale: string, m: WidgetMaterial) {
  return `/${locale}/${m._type === 'news' ? 'news' : 'articles'}/${m.slug}`;
}

function who(m: WidgetMaterial, locale: string) {
  const a = m.author;
  if (!a) return null;
  const isRu = locale === 'ru';
  return {
    name: authorName({ ...a, name: a.name } as Parameters<typeof authorName>[0], locale),
    role: (isRu ? a.roleRu : a.roleEn) || (isRu ? a.roleEn : a.roleRu) || '',
    photo: a.photo,
    org: a.entityKind === 'organization',
    color: authorColorVar(a.haloColor),
    slug: a.slug,
  };
}

function dateLabel(iso: string, locale: string) {
  return new Date(iso).toLocaleDateString(locale === 'ru' ? 'ru-RU' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

function Portrait({
  photo,
  org,
  name,
  size,
  className = '',
}: {
  photo?: string;
  org?: boolean;
  name: string;
  size: number;
  className?: string;
}) {
  const shape = org ? 'rounded-[12px]' : 'rounded-full';
  if (!photo) {
    return (
      <span
        className={`author-dot grid shrink-0 place-items-center bg-[var(--glass-clear-2)] font-extrabold ${shape} ${className}`}
        style={{ width: size, height: size, fontSize: Math.round(size * 0.4) }}
      >
        {name.charAt(0)}
      </span>
    );
  }
  return (
    <Image
      src={photo}
      alt=""
      aria-hidden="true"
      width={size * 2}
      height={size * 2}
      className={`author-dot shrink-0 object-cover ${shape} ${className}`}
      style={{ width: size, height: size }}
    />
  );
}

export default function HomeAuthorsWidget({
  data,
  locale,
}: {
  data: WidgetData;
  locale: string;
}) {
  const isRu = locale === 'ru';
  if (!data.show || !data.hero) return null;

  const hero = data.hero;
  const h = who(hero, locale);

  return (
    <section className="home-authors mb-14">
      <div className="grid grid-cols-1 gap-7 lg:grid-cols-[minmax(0,1fr)_268px]">
        <div>
          <div className="mb-[18px] flex items-center justify-between gap-4">
            <h2 className="flex items-center gap-2.5 text-[20px] font-extrabold tracking-[-0.024em] sm:text-[22px]">
              <span className="home-authors-dot" />
              {isRu ? 'Авторы и партнёры' : 'Authors and partners'}
            </h2>
            <Link
              href={`/${locale}/authors`}
              className="inline-flex shrink-0 items-center gap-1.5 text-[12.5px] font-extrabold text-accent transition-colors hover:brightness-110"
            >
              {isRu ? 'Все авторы' : 'All authors'}
              <ChevronRight size={13} strokeWidth={2.6} />
            </Link>
          </div>

          {/* Крупная работа */}
          <Link
            href={href(locale, hero)}
            style={{ '--c': h?.color || 'var(--accent)' } as CSSProperties}
            className="home-hero group grid grid-cols-1 items-center gap-4 sm:grid-cols-[minmax(0,0.92fr)_minmax(0,1fr)] sm:gap-7"
          >
            {hero.cover && (
              <span className="relative block aspect-[16/10] overflow-hidden rounded-[18px] border border-[var(--glass-edge)] shadow-[var(--glass-shadow)] sm:aspect-[4/3]">
                <Image
                  src={hero.cover}
                  alt=""
                  aria-hidden="true"
                  fill
                  sizes="(max-width: 640px) 100vw, 420px"
                  className="object-cover saturate-[0.95] transition-transform duration-500 ease-out
                             group-hover:scale-[1.035] motion-reduce:transform-none"
                />
                {h && (
                  <Portrait
                    photo={h.photo}
                    org={h.org}
                    name={h.name}
                    size={46}
                    className="absolute left-3 top-3 z-[2]"
                  />
                )}
              </span>
            )}

            <span className="block min-w-0">
              {h && (
                <span className="mb-2.5 flex flex-wrap items-center gap-2">
                  <b className="text-[12.5px] font-black tracking-[0.02em] text-[var(--c)]">{h.name}</b>
                  {h.role && <span className="text-[11.5px] text-muted">{h.role}</span>}
                </span>
              )}
              <span className="mb-3 block text-[21px] font-extrabold leading-[1.2] tracking-[-0.025em] text-foreground text-balance transition-colors group-hover:text-[var(--c)] sm:text-[25px]">
                {hero.title}
              </span>
              {hero.excerpt && (
                <span className="mb-3.5 line-clamp-3 block max-w-[54ch] text-[13px] leading-relaxed text-muted sm:text-[13.5px]">
                  {hero.excerpt}
                </span>
              )}
              <span className="flex items-center gap-3.5 text-[12px] text-muted">
                {dateLabel(hero.publishedAt, locale)}
                <span className="inline-flex items-center gap-1.5 font-bold tabular-nums">
                  <Eye size={13} />
                  {hero.views}
                </span>
              </span>
            </span>
          </Link>

          {/* Три публикации колонками */}
          {data.items.length > 0 && (
            <div className="mt-7 grid grid-cols-1 gap-x-7 sm:grid-cols-3">
              {data.items.map((m) => {
                const a = who(m, locale);
                return (
                  <Link
                    key={m._id}
                    href={href(locale, m)}
                    style={{ '--c': a?.color || 'var(--accent)' } as CSSProperties}
                    className="home-col group block border-t border-[var(--glass-edge)] pt-4 transition-colors
                               hover:border-t-[var(--c)]"
                  >
                    <span className="mb-2.5 line-clamp-3 block text-[14.5px] font-bold leading-[1.35] tracking-[-0.012em] text-foreground transition-colors group-hover:text-[var(--c)]">
                      {m.title}
                    </span>
                    <span className="flex items-center gap-2">
                      {a && <Portrait photo={a.photo} org={a.org} name={a.name} size={22} />}
                      {a && <b className="text-[11px] font-extrabold text-[var(--c)]">{a.name}</b>}
                      <span className="text-[11px] text-muted">
                        ·{' '}
                        {new Date(m.publishedAt).toLocaleDateString(isRu ? 'ru-RU' : 'en-GB', {
                          day: 'numeric',
                          month: 'short',
                          timeZone: 'UTC',
                        })}
                      </span>
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Сейчас читают */}
        <aside>
          <h3 className="mb-3.5 flex items-center gap-2 text-[16px] font-extrabold tracking-[-0.02em] sm:text-[17px]">
            <Flame size={16} className="text-[#f97316]" />
            {isRu ? 'Сейчас читают' : 'Reading now'}
          </h3>

          {data.reading.map((m) => {
            const a = who(m, locale);
            return (
              <Link
                key={m._id}
                href={href(locale, m)}
                style={{ '--c': a?.color || 'var(--accent)' } as CSSProperties}
                className="home-read group mb-2 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2.5 rounded-[13px]
                           border border-[var(--glass-edge)] bg-[var(--glass-clear-2)] px-3.5 py-3
                           transition-[transform,border-color] hover:translate-x-[3px] hover:border-[var(--c)]
                           motion-reduce:transform-none"
              >
                <span className="min-w-0">
                  <b className="line-clamp-2 block text-[12.5px] font-bold leading-[1.35] text-foreground">
                    {m.title}
                  </b>
                  <span className="mt-1.5 flex items-center gap-2">
                    {a && <i className="text-[10.5px] font-extrabold not-italic text-[var(--c)]">{a.name}</i>}
                    <span className="inline-flex items-center gap-1 text-[10.5px] font-bold tabular-nums text-muted">
                      <Eye size={11} />
                      {m.views}
                    </span>
                  </span>
                </span>
                <ChevronRight
                  size={14}
                  strokeWidth={2.4}
                  className="text-muted transition-colors group-hover:text-[var(--c)]"
                />
              </Link>
            );
          })}

          <Link
            href={`/${locale}/authors`}
            className="home-authors-cta mt-3 flex items-center justify-center gap-1.5 rounded-xl px-4 py-3 text-[12px] font-extrabold"
          >
            {isRu ? 'Все авторы' : 'All authors'}
            <ArrowRight size={13} strokeWidth={2.4} />
          </Link>
        </aside>
      </div>
    </section>
  );
}
