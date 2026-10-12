'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { MouseEvent as ReactMouseEvent, KeyboardEvent as ReactKeyboardEvent } from 'react';
import { Check, ChevronDown, SlidersHorizontal, X } from 'lucide-react';
import type { AiFacet, AiFacetGroup, AiJob, AiService, Locale } from '@/lib/ai';
import { allFacets, money, paidFrom, pick, pickList, unitLabel } from '@/lib/ai';
import JobIcon from './JobIcon';

/**
 * Фильтрация идёт на клиенте, и это осознанно.
 *
 * Каталог — полсотни карточек и десяток групп признаков. Гонять их через URL и
 * сервер значило бы ждать круг до сервера на каждую галочку и плодить сотни
 * адресов с одинаковым содержимым, которые поиск честно посчитает дублями.
 * Весь список приходит разом в разметке, поэтому страница индексируется
 * целиком, а щелчок по галочке отвечает мгновенно.
 */

interface Props {
  locale: Locale;
  /** Весь каталог: задача выбирается здесь же, без перезагрузки страницы. */
  services: AiService[];
  jobs: AiJob[];
  /** Готовые наборы признаков: ключ «» — для режима «Все сервисы». */
  groupsByJob: Record<string, AiFacetGroup[]>;
  initialJob: string;
  t: Record<string, string>;
}

const brand = (s: AiService) => s.brandColor || '#111827';
const mono = (s: AiService) => s.monogram || s.name.slice(0, 2).toUpperCase();

/**
 * Плашка сервиса: логотип, если загружен, иначе монограмма на фирменном цвете.
 *
 * Фирменный цвет кладётся под монограмму и только под неё. У логотипа почти
 * всегда свой фон, и подложка того же семейства превращала знак в квадрат
 * внутри квадрата, а у тёмных знаков на тёмном цвете — просто в пятно.
 *
 * Под логотипом подложка белая, а под светлым — тёмная. Шестнадцать знаков из
 * сорока двух нарисованы белым по прозрачному фону и на белой плашке
 * пропадали совсем. Яркость считается при загрузке, флаг лежит в карточке и
 * переключается руками, если автомат ошибся.
 */
export function ServiceMark({ s, size = 44 }: { s: AiService; size?: number }) {
  return (
    <span
      className={`grid shrink-0 place-items-center overflow-hidden rounded-[10px] font-extrabold tracking-tight ${
        s.logoUrl
          ? `border border-border ${s.logoOnDark ? 'bg-[#15161a]' : 'bg-white'}`
          : 'text-white'
      }`}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.34,
        ...(s.logoUrl ? null : { background: brand(s) }),
      }}
      aria-hidden="true"
    >
      {s.logoUrl ? (
        <Image src={s.logoUrl} alt="" width={size} height={size} className="h-full w-full object-contain p-1.5" />
      ) : (
        mono(s)
      )}
    </span>
  );
}

/**
 * Карточка о двух состояниях.
 *
 * Сложенная занимает 156 пикселей вместо 322: пятьдесят с лишним карточек в
 * полный рост давали полотно на десять экранов, и до конца его никто не
 * доходил. Видно то, по чему выбирают — знак, название, цена и две строки
 * «чем выделяется»; прячется то, что нужно уже остановившемуся на карточке.
 *
 * Действие всегда одно и зависит от состояния: сложенная разворачивается,
 * развёрнутая ведёт на страницу сервиса. Две цели в одном месте заставляли бы
 * целиться, поэтому отдельной кнопки «подробнее» нет — есть подпись,
 * объясняющая, что карточка нажимается.
 *
 * Карточка не обёрнута в ссылку: внутри развёрнутой живёт кнопка «Свернуть», а
 * кнопка внутри ссылки — недопустимая вложенность. Настоящая ссылка в карточке
 * есть — «Разбор»; по ней ходит поиск и работает открытие в новой вкладке.
 */
function Card({ s, locale, t }: { s: AiService; locale: Locale; t: Record<string, string> }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const plan = paidFrom(s);
  const feats = pickList(s.features, locale).slice(0, 3);
  const checked = Boolean(s.priceCheckedAt);
  const href = `/${locale}/ai/tools/${s.slug}`;

  const act = (e: ReactMouseEvent | ReactKeyboardEvent) => {
    if ((e.target as HTMLElement).closest('[data-fold]')) return;
    if (!open) { setOpen(true); return; }
    router.push(href);
  };

  return (
    <li className="flex">
      <article
        role="button"
        tabIndex={0}
        aria-expanded={open}
        aria-label={open ? `${s.name} — ${t.review}` : `${s.name} — ${t.more}`}
        onClick={act}
        onKeyDown={e => {
          if (e.key !== 'Enter' && e.key !== ' ') return;
          e.preventDefault();
          act(e);
        }}
        className={`ai-card group relative flex w-full cursor-pointer flex-col gap-3 overflow-hidden rounded-[14px] p-4 backdrop-blur-[14px] backdrop-saturate-150 ${
          open ? '' : 'ai-card-half'
        }`}
      >
        <div className="flex items-start gap-3">
          <ServiceMark s={s} />
          <div className="min-w-0 flex-1">
            <h3 className="text-[16.5px] font-extrabold tracking-tight">{s.name}</h3>
            <p className="mt-0.5 line-clamp-2 min-h-[2.7em] text-[13px] leading-[1.35] text-muted">
              {pick(s.tagline, locale)}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <b className="block text-[18px] font-black tabular-nums tracking-tight">
              {plan ? money(plan.price, plan.currency) : '—'}
            </b>
            <span className="text-[12px] text-muted">
              {plan ? unitLabel(plan.unit, locale) : t.onRequest}
            </span>
          </div>
        </div>

        <p className="m-0 flex items-start gap-2.5 text-[13px] font-semibold leading-[1.45]">
          <span className="ai-tick mt-px grid size-[18px] shrink-0 place-items-center rounded-full">
            <Check size={11} strokeWidth={3.5} className="text-white" />
          </span>
          <span className="ai-card-uniq line-clamp-4">{pick(s.highlight, locale)}</span>
        </p>

        {feats.length > 0 && (
          <ul className="ai-card-feat m-0 flex min-h-[2.6em] list-none flex-wrap content-start gap-1.5 p-0">
            {feats.map((f, i) => (
              <li
                key={f}
                className={`rounded-md border px-2 py-0.5 text-[12px] font-semibold ${
                  i === 0
                    ? 'border-violet/40 bg-violet/10 text-violet'
                    : 'border-border bg-card text-muted'
                }`}
              >
                {f}
              </li>
            ))}
          </ul>
        )}

        <div className="ai-card-foot mt-auto flex flex-wrap items-center gap-2.5 border-t border-border pt-3 text-[12px] text-muted">
          {checked ? (
            <span className="inline-flex items-center gap-1.5 font-bold text-positive">
              <Check size={13} strokeWidth={3} />
              {t.priceChecked}
            </span>
          ) : (
            <span className="font-semibold text-importance-medium">{t.priceUnchecked}</span>
          )}
          <button
            type="button"
            data-fold
            onClick={() => setOpen(false)}
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-0.5 text-[11.5px] font-extrabold text-muted hover:text-foreground"
          >
            <ChevronDown size={12} className="rotate-180" />
            {t.fold}
          </button>
          <Link href={href} className="ai-go ml-auto font-extrabold" tabIndex={-1}>
            {t.review} →
          </Link>
        </div>

        {/* Срез растворяется, а не обрывается: жёсткая граница читается как
            поломка вёрстки, мягкая — как «дальше ещё есть». */}
        <span className="ai-card-fade" aria-hidden="true" />
        <span className="ai-card-more">
          {t.more}
          <ChevronDown size={13} />
        </span>
      </article>
    </li>
  );
}

/**
 * Сколько компаний в этой задаче стоит за каждым признаком.
 *
 * Считается по полному списку задачи, а не по отфильтрованному. Иначе пункты
 * исчезали бы по ходу выбора, и читатель терял бы дорогу назад: снял галочку —
 * а вернуть нечего, пункт пропал.
 */
function countFacets(services: AiService[]): Map<string, number> {
  const n = new Map<string, number>();
  for (const s of services) for (const k of allFacets(s)) n.set(k, (n.get(k) ?? 0) + 1);
  return n;
}

/** Больше семи галочек в группе читатель не разбирает, а пролистывает. */
const MAX_PER_GROUP = 7;
/** Пункт, за которым стоит одна компания, — это не фильтр, а ссылка на неё. */
const MIN_MATCHES = 2;

/**
 * Группы, приведённые к задаче: пункты, под которые подпадает меньше двух
 * компаний, убираются, остаётся не больше семи самых населённых, а группа без
 * двух живых пунктов не показывается вовсе.
 *
 * Правило живёт в коде, а не в наполнении, намеренно. Вычистить фильтр руками
 * можно один раз; на третьей новой компании он снова зарастёт пунктами,
 * которые ничего не отсекают. Здесь же список подстраивается сам: признак
 * появляется в фильтре ровно тогда, когда вторая компания его получает.
 */
function liveGroups(groups: AiFacetGroup[], counts: Map<string, number>): AiFacetGroup[] {
  const out: AiFacetGroup[] = [];
  for (const g of groups) {
    const items = g.items
      .map(i => ({ i, n: counts.get(i.key) ?? 0 }))
      .filter(x => x.n >= MIN_MATCHES);
    if (items.length < 2) continue;
    // Порядок внутри группы авторский, поэтому отбираем семь самых населённых,
    // а показываем их в исходной последовательности.
    const keep = new Set(
      [...items].sort((a, b) => b.n - a.n).slice(0, MAX_PER_GROUP).map(x => x.i.key)
    );
    out.push({ ...g, items: items.filter(x => keep.has(x.i.key)).map(x => x.i) as AiFacet[] });
  }
  return out;
}

function Group({
  group,
  locale,
  on,
  toggle,
  counts,
  openAll,
}: {
  group: AiFacetGroup;
  locale: Locale;
  on: Set<string>;
  toggle: (k: string) => void;
  counts: Map<string, number>;
  openAll: boolean;
}) {
  const picked = group.items.filter(i => on.has(i.key)).length;
  return (
    <details className="border-b border-border last:border-b-0" open={openAll}>
      <summary className="ai-sum flex cursor-pointer list-none items-center gap-2.5 px-1 py-3 text-[13px] font-extrabold uppercase tracking-[.06em] text-muted">
        {pick(group.title, locale)}
        {picked > 0 && <span className="ai-pick rounded-full px-2 py-px text-[12px] font-extrabold tabular-nums text-white">{picked}</span>}
        <ChevronDown size={15} className="ml-auto shrink-0 transition-transform [details[open]_&]:rotate-180" />
      </summary>
      <div className="px-1 pb-3.5 pt-0.5">
        {group.items.map(f => (
          <label key={f.key} className="flex cursor-pointer items-start gap-2.5 py-1 text-[13.5px] leading-[1.35] text-muted hover:text-foreground">
            <input
              type="checkbox"
              checked={on.has(f.key)}
              onChange={() => toggle(f.key)}
              className="ai-box mt-px size-[17px] shrink-0 cursor-pointer appearance-none rounded-[6px] border-[1.5px] border-border bg-background"
            />
            <span className={on.has(f.key) ? 'font-semibold text-foreground' : undefined}>
              {pick(f.label, locale)}
            </span>
            <span className="ml-auto shrink-0 pl-2 text-[12.5px] tabular-nums text-muted/70">
              {counts.get(f.key)}
            </span>
          </label>
        ))}
      </div>
    </details>
  );
}

export default function AiCatalogue({ locale, services, jobs, groupsByJob, initialJob, t }: Props) {
  const [job, setJob] = useState(initialJob);
  const [openAll, setOpenAll] = useState(false);
  const [on, setOn] = useState<Set<string>>(new Set());
  const [sheet, setSheet] = useState(false);

  const pool = useMemo(
    () => (job ? services.filter(s => s.jobSlug === job) : services),
    [services, job]
  );
  const counts = useMemo(() => countFacets(pool), [pool]);
  const live = useMemo(() => liveGroups(groupsByJob[job] ?? [], counts), [groupsByJob, job, counts]);

  const toggle = (k: string) =>
    setOn(prev => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });

  const list = useMemo(() => {
    if (!on.size) return pool;
    const wanted = [...on];
    return pool.filter(s => {
      const have = new Set(allFacets(s));
      return wanted.every(k => have.has(k));
    });
  }, [pool, on]);

  /** Смена задачи сбрасывает галочки: в новой задаче признаки другие. */
  const pickJob = (slug: string) => { setJob(slug); setOn(new Set()); };

  const checked = list.filter(s => s.priceCheckedAt).length;

  return (
    <>
      {/* Полоса задач. Отступ сверху и снизу — не украшение: при наведении
          чип приподнимается и отбрасывает тень, а контейнер с горизонтальной
          прокруткой обрезает всё, что вылезло за его границы. */}
      <h2 className="sr-only">{t.filters}</h2>
      <ul
        id="tasks"
        className="mt-4 scroll-mt-32 flex list-none flex-wrap gap-2 px-0 py-1.5 overflow-x-auto sm:overflow-visible max-sm:flex-nowrap"
      >
        <li>
          <button
            type="button"
            onClick={() => pickJob('')}
            aria-pressed={job === ''}
            className="ai-task inline-flex items-center gap-2 whitespace-nowrap rounded-full px-3.5 py-2 text-[13.5px] font-semibold"
          >
            <JobIcon name="grid" />
            {t.everything}
          </button>
        </li>
        {jobs.map(j => (
          <li key={j.slug}>
            <button
              type="button"
              onClick={() => pickJob(j.slug)}
              aria-pressed={job === j.slug}
              className="ai-task inline-flex items-center gap-2 whitespace-nowrap rounded-full px-3.5 py-2 text-[13.5px] font-semibold"
            >
              <JobIcon name={j.icon} />
              {pick(j.name, locale)}
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-5 grid gap-5 lg:grid-cols-[264px_minmax(0,1fr)]">
        <form
          aria-label={t.filters}
          className={`ai-filters self-start rounded-[20px] p-3.5 backdrop-blur-[14px] backdrop-saturate-150 ${
            sheet
              ? 'fixed inset-x-0 bottom-0 z-[70] max-h-[78vh] overflow-y-auto rounded-b-none px-4 pb-6 pt-4'
              : 'hidden lg:block lg:sticky lg:top-[62px] lg:max-h-[calc(100vh-86px)] lg:overflow-y-auto'
          }`}
        >
          {sheet && (
            <button
              type="button"
              onClick={() => setSheet(false)}
              aria-label={t.close}
              className="absolute right-3 top-3 rounded-lg border border-border p-1.5 text-muted"
            >
              <X size={16} />
            </button>
          )}
          {/* Шапка панели приклеена: кнопка «развернуть всё» нужна именно тогда,
              когда список длинный и уехал вверх вместе с прокруткой. */}
          <div className="sticky top-0 z-[4] -mx-3.5 -mt-3.5 mb-1 border-b border-border bg-background/90 px-3.5 pb-2.5 pt-3 backdrop-blur-[10px]">
            <div className="mb-2 flex flex-wrap items-baseline gap-x-2 gap-y-1.5">
              <b className="text-[12px] font-extrabold uppercase tracking-[.07em] text-muted">{t.filters}</b>
              {on.size > 0 && (
                <span className="ai-pick rounded-full px-2 py-px text-[12px] font-extrabold tabular-nums text-white">
                  {on.size}
                </span>
              )}
              <button
                type="button"
                onClick={() => setOn(new Set())}
                disabled={on.size === 0}
                className="ml-auto shrink-0 whitespace-nowrap p-0.5 text-[12px] font-extrabold text-accent disabled:cursor-not-allowed disabled:text-muted/60"
              >
                {t.reset}
              </button>
            </div>
            <button
              type="button"
              onClick={() => setOpenAll(v => !v)}
              aria-expanded={openAll}
              className="flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-[10px] border border-border py-2 text-[12.5px] font-extrabold hover:border-violet/40"
            >
              {openAll ? t.collapseAll : t.expandAll}
              <ChevronDown size={14} className={openAll ? 'rotate-180' : undefined} />
            </button>
          </div>

          {live.map((g, i) => (
            <Group
              key={`${pick(g.title, locale)}-${i}-${openAll}`}
              group={g}
              locale={locale}
              on={on}
              toggle={toggle}
              counts={counts}
              openAll={openAll}
            />
          ))}
        </form>

        <section id="results" aria-labelledby="ai-res" className="scroll-mt-24">
          <div className="mb-4 flex flex-wrap items-baseline gap-3">
            <h2 id="ai-res" className="text-[19px] font-extrabold tracking-tight">{t.servicesH}</h2>
            <span className="text-[13.5px] tabular-nums text-muted" aria-live="polite">
              {list.length} · {t.ofWhichChecked}: {checked}
              {on.size > 0 && ` · ${t.filtersOn}: ${on.size}`}
            </span>
          </div>

          {list.length > 0 ? (
            <ul className="m-0 grid list-none grid-cols-1 gap-3.5 p-0 sm:grid-cols-2">
              {list.map(s => (
                <Card key={s.slug} s={s} locale={locale} t={t} />
              ))}
            </ul>
          ) : (
            <div className="rounded-[14px] border border-dashed border-border p-9 text-center text-[14px] text-muted">
              <b className="mb-1.5 block text-[16px] text-foreground">{t.emptyA}</b>
              {t.emptyB}
            </div>
          )}
        </section>
      </div>

      {sheet && (
        <div className="fixed inset-0 z-[66] bg-black/40 lg:hidden" onClick={() => setSheet(false)} aria-hidden="true" />
      )}
      <button
        type="button"
        onClick={() => setSheet(v => !v)}
        aria-expanded={sheet}
        className="ai-fab fixed bottom-5 left-1/2 z-[65] inline-flex -translate-x-1/2 items-center gap-2.5 rounded-full px-5 py-3 text-[14px] font-extrabold text-white lg:hidden"
      >
        <SlidersHorizontal size={17} />
        {t.filters}
        {on.size > 0 && ` · ${on.size}`}
      </button>
    </>
  );
}
