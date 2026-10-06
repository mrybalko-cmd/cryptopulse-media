'use client';

import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Check, ChevronDown, Globe, Mail, Search, X } from 'lucide-react';
import { TelegramIcon, LinkedInIcon, InstagramIcon, FacebookIcon } from '@/components/ui/socialIcons';
import type { AuthorCard, AuthorRubric } from '@/lib/sanity';
import { authorName, authorInitial } from '@/lib/authorName';
import { authorColorVar } from '@/lib/authorColors';
import type { CSSProperties } from 'react';

/**
 * Витрина участников.
 *
 * Карточка — одна ссылка на страницу участника: промежуточного раскрытия нет,
 * потому что читать полное описание и материалы удобнее там, где они лежат.
 *
 * Поиск и выбор сфер живут в состоянии компонента и не уезжают в адрес. Стоит
 * странице прочитать search params, и она станет динамической: каждый заход
 * робота будет считаться отдельной сборкой. Номер страницы — сегмент пути,
 * его отдаёт сервер, и статику он не ломает.
 */

const LINKS = [
  { key: 'telegram', Icon: () => <TelegramIcon size={12} />, label: 'Telegram' },
  { key: 'linkedin', Icon: () => <LinkedInIcon size={12} />, label: 'LinkedIn' },
  { key: 'instagram', Icon: () => <InstagramIcon size={12} />, label: 'Instagram' },
  { key: 'facebook', Icon: () => <FacebookIcon size={12} />, label: 'Facebook' },
  { key: 'website', Icon: () => <Globe size={12} />, label: 'Website' },
] as const;

/** Со скольких сфер в выпадающем списке появляется поиск по ним. */
const SPHERE_SEARCH_FROM = 8;
/** С какой длины запроса показываем подсказки. */
const SUGGEST_FROM = 2;

function plural(n: number, one: string, few: string, many: string) {
  const d = Math.abs(n) % 100;
  if (d >= 11 && d <= 14) return many;
  const u = d % 10;
  return u === 1 ? one : u >= 2 && u <= 4 ? few : many;
}

function materialsWord(n: number, isRu: boolean) {
  return isRu ? plural(n, 'материал', 'материала', 'материалов') : n === 1 ? 'story' : 'stories';
}

/* ── карточка ─────────────────────────────────────────────────────────── */

function Card({
  author,
  locale,
  rubrics,
}: {
  author: AuthorCard;
  locale: string;
  rubrics: AuthorRubric[];
}) {
  const isRu = locale === 'ru';
  const display = authorName(author, locale);
  const role = (isRu ? author.roleRu : author.roleEn) || (isRu ? author.roleEn : author.roleRu);
  const bio = (isRu ? author.bioRu : author.bioEn) || (isRu ? author.bioEn : author.bioRu);
  const isOrg = author.entityKind === 'organization';
  // В карточке лежат ключи рубрик, а показать надо название. Берём первую из
  // тех, что видимы в фильтре: внутренние рубрики на витрину не выносим.
  const sphereKey = (author.rubrics || []).find((k) => rubrics.some((r) => r.key === k));
  const sphereRubric = rubrics.find((r) => r.key === sphereKey);
  const sphere = sphereRubric ? (isRu ? sphereRubric.titleRu : sphereRubric.titleEn) : null;

  const links = LINKS.filter((l) => author[l.key]).slice(0, 3);
  const showMail = links.length < 3 && author.email;

  return (
    <Link
      href={`/${locale}/authors/${author.slug}`}
      style={{ '--c': authorColorVar(author.haloColor) } as CSSProperties}
      className="author-card group"
    >
      <span className="author-cap">
        {sphere && (
          <span
            className="relative z-[2] m-[9px] inline-block max-w-[120px] truncate rounded-md bg-black/25
                       px-[7px] py-[3px] text-[8.5px] font-black uppercase tracking-[0.12em] text-white"
          >
            {sphere}
          </span>
        )}
      </span>

      {author.photo ? (
        <Image
          src={author.photo}
          alt={display}
          width={62}
          height={62}
          className={`author-ava h-[62px] w-[62px] ${isOrg ? 'rounded-[17px]' : 'rounded-full'}`}
        />
      ) : (
        <span
          className={`author-ava grid h-[62px] w-[62px] place-items-center text-[19px] font-extrabold
                      ${isOrg ? 'rounded-[17px]' : 'rounded-full'}`}
        >
          {authorInitial(author, locale)}
        </span>
      )}

      <span className="author-body">
        <span className="block truncate text-[14px] font-extrabold leading-tight tracking-[-0.012em]">
          {display}
        </span>
        <span className="mt-[3px] block min-h-[15px] truncate text-[11px] font-bold leading-[1.35] text-[var(--c)]">
          {role || ' '}
        </span>
        {bio && (
          <span className="mt-2 line-clamp-2 min-h-[34px] text-left text-[11px] leading-[1.55] text-muted">
            {bio}
          </span>
        )}
      </span>

      <span className="author-foot">
        <span className="whitespace-nowrap text-[10.5px] font-semibold text-muted">
          <b className="mr-[3px] text-[13.5px] font-black tabular-nums text-foreground">{author.materials}</b>
          {materialsWord(author.materials, isRu)}
        </span>
        <span className="flex gap-1">
          {links.map(({ key, Icon, label }) => (
            <span
              key={key}
              title={label}
              className="grid h-[23px] w-[23px] place-items-center rounded-[7px] border border-[var(--glass-edge)]
                         bg-[var(--glass-clear-2)] text-muted transition-colors group-hover:text-foreground"
            >
              <Icon />
            </span>
          ))}
          {showMail && (
            <span
              title="Email"
              className="grid h-[23px] w-[23px] place-items-center rounded-[7px] border border-[var(--glass-edge)]
                         bg-[var(--glass-clear-2)] text-muted transition-colors group-hover:text-foreground"
            >
              <Mail size={12} />
            </span>
          )}
        </span>
      </span>
    </Link>
  );
}

/* ── доска ────────────────────────────────────────────────────────────── */

export default function AuthorsBoard({
  authors,
  rubrics,
  locale,
  page,
  perPage,
  basePath,
}: {
  authors: AuthorCard[];
  rubrics: AuthorRubric[];
  locale: string;
  page: number;
  perPage: number;
  basePath: string;
}) {
  const isRu = locale === 'ru';
  const [query, setQuery] = useState('');
  const [spheres, setSpheres] = useState<string[]>([]);
  const [sphereQuery, setSphereQuery] = useState('');
  const [sort, setSort] = useState<'default' | 'materials' | 'alphabet'>('default');
  const [menuOpen, setMenuOpen] = useState(false);
  const [suggestOpen, setSuggestOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const a of authors) for (const r of a.rubrics || []) c[r] = (c[r] || 0) + 1;
    return c;
  }, [authors]);

  /* Точка рядом со сферой берёт цвет первого её участника: собственного цвета
     у рубрики нет, а связь «сфера — цвет» всё равно читается по карточкам. */
  const sphereColor = useMemo(() => {
    const m: Record<string, string> = {};
    for (const a of authors) {
      for (const r of a.rubrics || []) if (!m[r]) m[r] = authorColorVar(a.haloColor);
    }
    return m;
  }, [authors]);

  const normalized = query.trim().toLowerCase();

  const matches = (a: AuthorCard) => {
    const name = authorName(a, locale).toLowerCase();
    const role = ((isRu ? a.roleRu : a.roleEn) || (isRu ? a.roleEn : a.roleRu) || '').toLowerCase();
    return name.includes(normalized) || role.includes(normalized);
  };

  const filtered = useMemo(() => {
    let list = authors;
    if (spheres.length) list = list.filter((a) => (a.rubrics || []).some((r) => spheres.includes(r)));
    if (normalized) list = list.filter(matches);
    if (sort === 'materials') list = [...list].sort((a, b) => b.materials - a.materials);
    if (sort === 'alphabet')
      list = [...list].sort((a, b) => authorName(a, locale).localeCompare(authorName(b, locale)));
    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authors, spheres, normalized, sort, locale]);

  // Пока ищут или отбирают сферу, страницы не нужны: искать человека по
  // страницам никто не станет. Показываем все совпадения разом.
  const sliced = useMemo(() => {
    const narrowed = normalized.length > 0 || spheres.length > 0 || sort !== 'default';
    if (narrowed) return filtered;
    const from = (page - 1) * perPage;
    return filtered.slice(from, from + perPage);
  }, [filtered, normalized, spheres, sort, page, perPage]);

  const narrowed = normalized.length > 0 || spheres.length > 0 || sort !== 'default';
  const totalPages = Math.max(1, Math.ceil(authors.length / perPage));

  const suggestions = useMemo(
    () => (normalized.length >= SUGGEST_FROM ? filtered.slice(0, 5) : []),
    [filtered, normalized]
  );

  const visibleRubrics = rubrics.filter((r) =>
    sphereQuery ? (isRu ? r.titleRu : r.titleEn).toLowerCase().includes(sphereQuery.toLowerCase()) : true
  );

  const toggleSphere = (key: string) =>
    setSpheres((v) => (v.includes(key) ? v.filter((x) => x !== key) : [...v, key]));

  return (
    <div>
      {/* Панель */}
      <div
        className="author-bar mb-2.5 flex flex-wrap items-center gap-2.5 rounded-[15px] px-3 py-2.5
                   bg-[linear-gradient(180deg,var(--glass-clear),var(--glass-clear-2))]
                   border border-[var(--glass-edge)] backdrop-blur-[20px] backdrop-saturate-150"
      >
        <div ref={boxRef} className="relative min-w-[190px] flex-1">
          <label className="flex items-center gap-2 rounded-[10px] border border-[var(--glass-edge)] bg-[var(--glass-clear-2)] px-3 py-2.5">
            <Search size={14} className="shrink-0 text-muted" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSuggestOpen(true);
              }}
              onFocus={() => setSuggestOpen(true)}
              onBlur={() => window.setTimeout(() => setSuggestOpen(false), 120)}
              placeholder={isRu ? 'Имя или должность' : 'Name or role'}
              aria-label={isRu ? 'Поиск участника' : 'Search participants'}
              className="min-w-0 flex-1 bg-transparent text-[12.5px] font-medium text-foreground outline-none placeholder:text-muted"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label={isRu ? 'Очистить' : 'Clear'}
                className="text-muted transition-colors hover:text-foreground"
              >
                <X size={13} />
              </button>
            )}
          </label>

          {suggestOpen && suggestions.length > 0 && (
            <div className="author-pop left-0 right-0 top-[calc(100%+6px)] backdrop-blur-[26px] backdrop-saturate-150">
              <p className="px-[9px] pb-1 pt-[7px] text-[9.5px] font-black uppercase tracking-[0.1em] text-muted">
                {isRu ? 'Участники' : 'Participants'}
              </p>
              {suggestions.map((a) => {
                const role = (isRu ? a.roleRu : a.roleEn) || (isRu ? a.roleEn : a.roleRu);
                return (
                  <Link
                    key={a._id}
                    href={`/${locale}/authors/${a.slug}`}
                    className="flex items-center gap-2.5 rounded-lg px-[9px] py-[7px] hover:bg-[var(--glass-clear-2)]"
                  >
                    {a.photo ? (
                      <Image
                        src={a.photo}
                        alt=""
                        width={24}
                        height={24}
                        className={`h-6 w-6 shrink-0 object-cover ${
                          a.entityKind === 'organization' ? 'rounded-[7px]' : 'rounded-full'
                        }`}
                      />
                    ) : (
                      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[var(--glass-clear-2)] text-[10px] font-bold">
                        {authorInitial(a, locale)}
                      </span>
                    )}
                    <b className="truncate text-[12.5px] font-bold text-foreground">{authorName(a, locale)}</b>
                    <span className="ml-auto whitespace-nowrap text-[11px] text-muted">
                      {role ? `${role} · ` : ''}
                      {a.materials}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {rubrics.length > 0 && (
          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              className="flex items-center gap-[7px] whitespace-nowrap rounded-[10px] border border-[var(--glass-edge)]
                         bg-[var(--glass-clear-2)] px-3 py-2.5 text-[11.5px] font-bold text-muted transition-colors hover:text-foreground"
            >
              {isRu ? 'Сфера:' : 'Field:'}
              <b className="font-extrabold text-foreground">
                {spheres.length ? spheres.length : isRu ? 'все' : 'all'}
              </b>
              <ChevronDown size={12} className={`transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
            </button>

            {menuOpen && (
              <div className="author-pop right-0 top-[calc(100%+6px)] max-h-[300px] min-w-[238px] overflow-y-auto backdrop-blur-[26px] backdrop-saturate-150">
                {rubrics.length >= SPHERE_SEARCH_FROM && (
                  <label className="mx-[3px] mb-1.5 mt-[3px] flex items-center gap-[7px] rounded-lg border border-[var(--glass-edge)] bg-[var(--glass-clear-2)] px-[9px] py-1.5">
                    <Search size={12} className="text-muted" />
                    <input
                      value={sphereQuery}
                      onChange={(e) => setSphereQuery(e.target.value)}
                      placeholder={isRu ? 'Найти сферу' : 'Find a field'}
                      className="min-w-0 flex-1 bg-transparent text-[11.5px] text-foreground outline-none placeholder:text-muted"
                    />
                  </label>
                )}
                {visibleRubrics.map((r) => {
                  const on = spheres.includes(r.key);
                  return (
                    <button
                      key={r._id}
                      type="button"
                      onClick={() => toggleSphere(r.key)}
                      className="flex w-full items-center gap-2.5 rounded-lg px-[9px] py-[7px] text-left hover:bg-[var(--glass-clear-2)]"
                    >
                      <span
                        className={`grid h-[15px] w-[15px] shrink-0 place-items-center rounded-[4px] border-[1.5px] ${
                          on ? 'border-foreground bg-foreground text-background' : 'border-[var(--glass-edge)]'
                        }`}
                      >
                        {on && <Check size={10} strokeWidth={3.2} />}
                      </span>
                      <i
                        className="block h-2 w-2 shrink-0 rounded-[3px]"
                        style={{ background: sphereColor[r.key] || 'var(--muted)' }}
                      />
                      <b className="text-[12px] font-bold text-foreground">{isRu ? r.titleRu : r.titleEn}</b>
                      <span className="ml-auto text-[11px] tabular-nums text-muted">{counts[r.key] || 0}</span>
                    </button>
                  );
                })}
                {visibleRubrics.length === 0 && (
                  <p className="px-[9px] py-2 text-[11.5px] text-muted">
                    {isRu ? 'Ничего не найдено' : 'Nothing found'}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as typeof sort)}
          aria-label={isRu ? 'Сортировка' : 'Sort'}
          className="cursor-pointer rounded-[10px] border border-[var(--glass-edge)] bg-[var(--glass-clear-2)]
                     px-3 py-2.5 text-[11.5px] font-bold text-muted"
        >
          <option value="default">{isRu ? 'По порядку редакции' : 'Editorial order'}</option>
          <option value="materials">{isRu ? 'По числу публикаций' : 'By publications'}</option>
          <option value="alphabet">{isRu ? 'По алфавиту' : 'Alphabetical'}</option>
        </select>
      </div>

      {/* Выбранные сферы: иначе человек отберёт группу, прокрутит вниз и
          забудет, почему видит четверых вместо пятидесяти. */}
      {(spheres.length > 0 || normalized) && (
        <div className="relative z-[55] mb-3.5 flex flex-wrap items-center gap-1.5">
          {spheres.map((key) => {
            const r = rubrics.find((x) => x.key === key);
            if (!r) return null;
            return (
              <span
                key={key}
                style={{ '--cc': sphereColor[key] || 'var(--muted)' } as CSSProperties}
                className="inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-[11px] font-bold
                           border-[color-mix(in_srgb,var(--cc)_34%,transparent)]
                           bg-[color-mix(in_srgb,var(--cc)_13%,transparent)] text-[var(--cc)]"
              >
                <i className="block h-1.5 w-1.5 rounded-full bg-[var(--cc)]" />
                {isRu ? r.titleRu : r.titleEn}
                <button type="button" onClick={() => toggleSphere(key)} aria-label={isRu ? 'Убрать' : 'Remove'}>
                  <X size={10} strokeWidth={3} />
                </button>
              </span>
            );
          })}
          <button
            type="button"
            onClick={() => {
              setSpheres([]);
              setQuery('');
              setSort('default');
            }}
            className="text-[11px] font-bold text-muted underline underline-offset-2 hover:text-foreground"
          >
            {isRu ? 'Сбросить' : 'Reset'}
          </button>
          <span className="ml-auto text-[11px] text-muted">
            {filtered.length} {isRu ? 'из' : 'of'} {authors.length}
          </span>
        </div>
      )}

      {/* Сетка */}
      {sliced.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-[repeat(auto-fill,minmax(205px,1fr))]">
          {sliced.map((a) => (
            <Card key={a._id} author={a} locale={locale} rubrics={rubrics} />
          ))}
        </div>
      ) : (
        <p className="py-10 text-center text-sm text-muted">
          {isRu ? 'Никого не нашлось. Снимите часть условий.' : 'Nobody matches. Try clearing some filters.'}
        </p>
      )}

      {/* Страницы. Обычные ссылки: робот по ним проходит, а rel="next" Google
          перестал учитывать ещё в 2019 году. */}
      {!narrowed && totalPages > 1 && (
        <>
          <nav className="mt-5 flex flex-wrap items-center justify-center gap-1.5">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <Link
                key={n}
                href={n === 1 ? basePath : `${basePath}/page/${n}`}
                aria-current={n === page ? 'page' : undefined}
                className={`grid h-[33px] min-w-[33px] place-items-center rounded-[9px] px-2.5 text-[12.5px] font-bold transition-colors ${
                  n === page
                    ? 'bg-foreground text-background'
                    : 'border border-[var(--glass-edge)] bg-[var(--glass-clear-2)] text-muted hover:text-foreground'
                }`}
              >
                {n}
              </Link>
            ))}
            {page < totalPages && (
              <Link
                href={`${basePath}/page/${page + 1}`}
                className="grid h-[33px] place-items-center rounded-[9px] border border-[var(--glass-edge)]
                           bg-[var(--glass-clear-2)] px-3.5 text-[12.5px] font-bold text-muted hover:text-foreground"
              >
                {isRu ? 'Дальше ›' : 'Next ›'}
              </Link>
            )}
          </nav>
          <p className="mt-2 text-center text-[10.5px] text-muted">
            {isRu
              ? `Страница ${page} из ${totalPages} · ${authors.length} ${materialsWord(authors.length, true) === 'материалов' ? 'участников' : 'участников'}`
              : `Page ${page} of ${totalPages} · ${authors.length} participants`}
          </p>
        </>
      )}
    </div>
  );
}
