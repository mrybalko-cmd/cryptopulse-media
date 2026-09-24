'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Globe } from 'lucide-react';
import { TelegramIcon, LinkedInIcon, InstagramIcon, FacebookIcon } from '@/components/ui/socialIcons';
import type { AuthorCard, AuthorRubric } from '@/lib/sanity';
import { authorName, authorInitial } from '@/lib/authorName';

/**
 * Витрина авторов и партнёров.
 *
 * Клиентский компонент нужен ровно ради фильтров: переключение рубрики не
 * должно ходить на сервер и перерисовывать страницу. Карточки приходят готовым
 * списком с сервера, здесь только показ и скрытие.
 *
 * Рубрики в строку фильтров отбирает страница, а не этот компонент: «авто»
 * зависит от числа видимых карточек, и считать его надо там, где известен
 * полный список.
 */

const LINKS = [
  { key: 'telegram', Icon: () => <TelegramIcon size={13} />, label: 'Telegram' },
  { key: 'linkedin', Icon: () => <LinkedInIcon size={13} />, label: 'LinkedIn' },
  { key: 'instagram', Icon: () => <InstagramIcon size={13} />, label: 'Instagram' },
  { key: 'facebook', Icon: () => <FacebookIcon size={13} />, label: 'Facebook' },
  { key: 'website', Icon: () => <Globe size={13} />, label: 'Website' },
] as const;

const HALO: Record<string, string> = {
  violet: 'var(--halo-violet)',
  cyan: 'var(--halo-cyan)',
  pink: 'var(--halo-pink)',
};

function plural(n: number, one: string, few: string, many: string) {
  const d = Math.abs(n) % 100;
  if (d >= 11 && d <= 14) return many;
  const u = d % 10;
  return u === 1 ? one : u >= 2 && u <= 4 ? few : many;
}

export default function AuthorsBoard({
  authors,
  rubrics,
  locale,
}: {
  authors: AuthorCard[];
  rubrics: AuthorRubric[];
  locale: string;
}) {
  const isRu = locale === 'ru';
  const [active, setActive] = useState('all');

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: authors.length };
    for (const a of authors) for (const r of a.rubrics || []) c[r] = (c[r] || 0) + 1;
    return c;
  }, [authors]);

  const shown = active === 'all' ? authors : authors.filter(a => (a.rubrics || []).includes(active));

  return (
    <>
      {/* На телефоне строка фильтров прокручивается, а не переносится: рубрик
          в админке может стать шесть и больше, и переносом они съели бы
          пол-экрана до первой карточки. Отступы отрицательные, чтобы полоса
          уезжала под самый край, как это принято в лентах. */}
      <div className="flex gap-2 mb-7 overflow-x-auto sm:flex-wrap sm:overflow-visible
        -mx-4 px-4 sm:mx-0 sm:px-0 pb-1 sm:pb-0 [scrollbar-width:none]
        [&::-webkit-scrollbar]:hidden">
        <FilterButton on={active === 'all'} onClick={() => setActive('all')}
          label={isRu ? 'Все' : 'All'} count={counts.all} />
        {rubrics.map(r => (
          <FilterButton key={r._id} on={active === r.key} onClick={() => setActive(r.key)}
            label={isRu ? r.titleRu : r.titleEn} count={counts[r.key] || 0} />
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {shown.map(a => {
          const display = authorName(a, locale);
          const role = (isRu ? a.roleRu : a.roleEn) || (isRu ? a.roleEn : a.roleRu);
          const bio = (isRu ? a.bioRu : a.bioEn) || (isRu ? a.bioEn : a.bioRu);
          const badge = badgeFor(a, rubrics, isRu);
          return (
            <Link
              key={a._id}
              href={`/${locale}/authors/${a.slug}`}
              className="group relative block rounded-[22px] transition-transform duration-200 hover:-translate-y-1"
            >
              {/* Ореол обязателен: без него прозрачная панель неотличима от
                  обычной. Два пятна по диагонали — на узком экране одного мало,
                  цвет не дотягивается до противоположного края карточки. */}
              <span aria-hidden className="pointer-events-none absolute left-0 -top-1.5 w-[190px] h-[190px]
                rounded-full blur-[52px] opacity-90 z-0"
                style={{ background: HALO[a.haloColor] || HALO.violet }} />
              <span aria-hidden className="pointer-events-none absolute right-0 -bottom-6 w-[150px] h-[150px]
                rounded-full blur-[48px] opacity-60 z-0 sm:hidden"
                style={{ background: HALO.cyan }} />

              <span className="author-glass relative z-[1] flex flex-col h-full rounded-[22px] p-5 sm:p-[22px] overflow-hidden">
                <span className="grid grid-cols-[46px_1fr_auto] sm:grid-cols-1 gap-x-3 items-center">
                  <span className="row-span-2 sm:row-span-1 sm:mb-3.5 sm:flex sm:items-center sm:justify-between">
                    {a.photo ? (
                      <Image
                        src={a.photo} alt={display} width={62} height={62}
                        className={`w-[46px] h-[46px] sm:w-[62px] sm:h-[62px] object-cover border-2
                          ${a.entityKind === 'organization' ? 'rounded-[13px] sm:rounded-2xl' : 'rounded-full'}`}
                        style={{ borderColor: 'var(--glass-edge)' }}
                      />
                    ) : (
                      <span className={`w-[46px] h-[46px] sm:w-[62px] sm:h-[62px] flex items-center justify-center
                        font-extrabold text-[15px] sm:text-[19px] border
                        ${a.entityKind === 'organization' ? 'rounded-[13px] sm:rounded-2xl' : 'rounded-full'}`}
                        style={{ background: 'var(--glass-clear-2)', borderColor: 'var(--glass-edge)' }}>
                        {authorInitial(a, locale)}
                      </span>
                    )}
                    {badge && (
                      <span className="glass-control hidden sm:inline-block text-[10.5px] uppercase
                        tracking-[.09em] font-bold rounded-[7px] px-2.5 py-1 text-muted">
                        {badge}
                      </span>
                    )}
                  </span>

                  <span className="col-start-2 sm:col-start-1 text-[15.5px] sm:text-[18.5px] font-bold
                    leading-tight tracking-[-.015em] self-end sm:self-auto">{display}</span>
                  {role && (
                    <span className="col-start-2 sm:col-start-1 text-[12px] sm:text-[13px] font-semibold
                      text-accent mt-0.5 sm:mb-2.5 self-start sm:self-auto">{role}</span>
                  )}
                </span>

                {/* Без block: line-clamp сам ставит display, а block его перебивал,
                    и описание печаталось целиком вместо двух строк. */}
                {bio && (
                  <span className="text-[12.8px] sm:text-[13.8px] text-muted leading-[1.5]
                    line-clamp-2 sm:line-clamp-3 mt-2.5 mb-2.5 sm:mb-4">{bio}</span>
                )}

                {/* Нижняя строка прижата к низу карточки: описания разной длины,
                    и без этого счётчики в ряду стоят на разной высоте. */}
                <span className="flex items-center justify-between gap-3 sm:block mt-auto">
                  <span className="flex gap-1.5 sm:mb-3.5">
                    {LINKS.filter(l => a[l.key]).slice(0, 4).map(({ key, Icon, label }) => (
                      <span key={key} title={label}
                        className="glass-control w-[27px] h-[27px] sm:w-[31px] sm:h-[31px] rounded-[8px]
                          sm:rounded-[9px] flex items-center justify-center text-muted
                          group-hover:text-foreground transition-colors">
                        <Icon />
                      </span>
                    ))}
                    {a.email && (
                      <span title="Email"
                        className="glass-control w-[27px] h-[27px] sm:w-[31px] sm:h-[31px] rounded-[8px]
                          sm:rounded-[9px] flex items-center justify-center text-muted
                          group-hover:text-foreground transition-colors">
                        <Mail size={13} />
                      </span>
                    )}
                  </span>
                  <span className="text-[11.5px] sm:text-[12.5px] text-muted whitespace-nowrap
                    sm:block sm:border-t glass-divider sm:pt-3">
                    <b className="font-extrabold text-foreground text-[13px] sm:text-[13.5px]">{a.materials}</b>{' '}
                    {isRu
                      ? plural(a.materials, 'материал', 'материала', 'материалов')
                      : a.materials === 1 ? 'story' : 'stories'}
                  </span>
                </span>
              </span>
            </Link>
          );
        })}
      </div>

      {shown.length === 0 && (
        <p className="text-sm text-muted py-10 text-center">
          {isRu ? 'В этой рубрике пока никого нет.' : 'Nobody in this category yet.'}
        </p>
      )}
    </>
  );
}

function FilterButton({ on, onClick, label, count }:
  { on: boolean; onClick: () => void; label: string; count: number }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={on}
      className={`shrink-0 rounded-full px-4 py-2 text-[13.5px] font-semibold border transition-colors
        ${on ? 'bg-foreground text-background border-transparent' : 'text-muted border-border hover:text-foreground'}`}>
      {label}<b className="font-extrabold opacity-55 ml-1.5">{count}</b>
    </button>
  );
}

/** Плашка берётся из первой рубрики. Внутренние сюда не попадают: их нет в списке. */
function badgeFor(a: AuthorCard, rubrics: AuthorRubric[], isRu: boolean) {
  const first = (a.rubrics || []).find(k => rubrics.some(r => r.key === k));
  const r = rubrics.find(x => x.key === first);
  return r ? (isRu ? r.titleRu : r.titleEn) : null;
}
