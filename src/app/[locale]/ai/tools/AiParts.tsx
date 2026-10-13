'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { MouseEvent as ReactMouseEvent, KeyboardEvent as ReactKeyboardEvent } from 'react';
import { Check, ChevronDown, Search, SlidersHorizontal, X } from 'lucide-react';
import type { AiFacet, AiFacetGroup, AiJob, AiService, Locale } from '@/lib/ai';
import { allFacets, money, paidFrom, pick, pickList, unitLabel } from '@/lib/ai';
import { haystackOf, matches, rank, type Haystack } from '@/lib/aiSearch';
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
function Card({
  s, locale, t, hidden,
}: {
  s: AiService;
  locale: Locale;
  t: Record<string, string>;
  /** Карточка за десятым местом: в разметке есть, на экране нет. */
  hidden?: boolean;
}) {
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
    <li className={hidden ? 'hidden' : 'flex'}>
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

/* ── Поиск ────────────────────────────────────────────────────────── */

/**
 * Подсказка в пустом поле: буквы набегают по очереди и строка сменяется.
 *
 * Анимация сделана на CSS, без библиотеки. Присланный компонент тянул за
 * собой motion и два набора иконок — около ста двадцати килобайт на одно
 * поле ввода; эффект тот же, а вес страницы не растёт. Под
 * prefers-reduced-motion буквы просто появляются.
 */
function Placeholder({ text }: { text: string }) {
  return (
    <span className="ai-ph" aria-hidden="true">
      {[...text].map((ch, i) => (
        <span key={`${i}-${ch}`} style={{ animationDelay: `${i * 0.012}s` }}>
          {ch === ' ' ? ' ' : ch}
        </span>
      ))}
    </span>
  );
}

function Hunt({
  value,
  onChange,
  hints,
  t,
  onSubmit,
}: {
  value: string;
  onChange: (v: string) => void;
  hints: string[];
  t: Record<string, string>;
  onSubmit: () => void;
}) {
  const [i, setI] = useState(0);
  // Подсказки крутятся только у пустого поля: поверх набранного их не видно,
  // а таймер в это время греет батарею впустую.
  useEffect(() => {
    if (value || hints.length < 2) return;
    const id = setInterval(() => setI(v => (v + 1) % hints.length), 3400);
    return () => clearInterval(id);
  }, [value, hints.length]);

  return (
    <form
      role="search"
      className="ai-hunt flex min-w-0 flex-1 items-center gap-1.5 rounded-full p-[5px] pl-[7px]"
      onSubmit={e => { e.preventDefault(); onSubmit(); }}
    >
      <span className="ai-hunt-ic grid size-10 shrink-0 place-items-center rounded-full">
        <Search size={17} strokeWidth={2.2} />
      </span>
      <span className="relative flex h-10 min-w-0 flex-1 items-center">
        {!value && (
          <span className="pointer-events-none absolute inset-y-0 left-2 flex items-center overflow-hidden">
            <Placeholder key={i} text={hints[i]} />
          </span>
        )}
        <input
          type="search"
          value={value}
          onChange={e => onChange(e.target.value)}
          aria-label={t.searchLabel}
          className="h-full w-full min-w-0 appearance-none border-0 bg-transparent px-2 text-[14.5px] text-foreground outline-none [&::-webkit-search-cancel-button]:hidden"
        />
      </span>
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label={t.clearSearch}
          className="ai-hunt-ic grid size-10 shrink-0 place-items-center rounded-full"
        >
          <X size={16} strokeWidth={2.4} />
        </button>
      )}
      <button type="submit" className="ai-cta h-10 shrink-0 rounded-full px-[18px] text-[13.5px]">
        {t.find}
      </button>
    </form>
  );
}

/* ── Фильтр ───────────────────────────────────────────────────────── */

function Facets({
  groups,
  locale,
  on,
  toggle,
  counts,
}: {
  groups: AiFacetGroup[];
  locale: Locale;
  on: Set<string>;
  toggle: (k: string) => void;
  counts: Map<string, number>;
}) {
  return (
    <div className="grid gap-x-7 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
      {groups.map((g, i) => (
        <div key={`${pick(g.title, locale)}-${i}`}>
          <h3 className="mb-1.5 text-[11px] font-extrabold uppercase tracking-[.07em] text-muted">
            {pick(g.title, locale)}
          </h3>
          {g.items.map(f => (
            <label
              key={f.key}
              className="flex cursor-pointer items-start gap-2.5 py-1 text-[13.5px] leading-[1.35] text-muted hover:text-foreground"
            >
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
      ))}
    </div>
  );
}

/* ── Каталог ──────────────────────────────────────────────────────── */

/** Сколько карточек видно до нажатия «Показать ещё». */
const PAGE = 10;

export default function AiCatalogue({ locale, services, jobs, groupsByJob, initialJob, t }: Props) {
  const [job, setJob] = useState(initialJob);
  const [on, setOn] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState('');
  const [panel, setPanel] = useState(false);
  const [shown, setShown] = useState(PAGE);
  const results = useRef<HTMLElement>(null);

  /** Подписи признаков по ключу — для поиска и для снятых галочек. */
  const labels = useMemo(() => {
    const m = new Map<string, string>();
    for (const groups of Object.values(groupsByJob)) {
      for (const g of groups) for (const f of g.items) if (!m.has(f.key)) m.set(f.key, pick(f.label, locale));
    }
    return m;
  }, [groupsByJob, locale]);

  /**
   * Стог сена под каждую карточку. Считается один раз на весь каталог, а не
   * на каждое нажатие клавиши: иначе полсотни карточек пересобирались бы по
   * сорок раз за фразу.
   */
  const stacks = useMemo(() => {
    const jobName = new Map(jobs.map(j => [j.slug, pick(j.name, locale)]));
    const m = new Map<string, Haystack>();
    for (const s of services) {
      m.set(
        s.slug,
        haystackOf({
          name: s.name,
          slug: s.slug,
          text: [
            pick(s.tagline, locale),
            pick(s.highlight, locale),
            ...pickList(s.features, locale),
            ...pickList(s.pros, locale),
            ...s.plans.map(p => p.name),
          ].filter(Boolean),
          tags: [
            jobName.get(s.jobSlug ?? '') ?? '',
            ...allFacets(s).map(k => labels.get(k) ?? ''),
          ].filter(Boolean),
        })
      );
    }
    return m;
  }, [services, jobs, locale, labels]);

  const pool = useMemo(
    () => (job ? services.filter(s => s.jobSlug === job) : services),
    [services, job]
  );
  const counts = useMemo(() => countFacets(pool), [pool]);
  const live = useMemo(() => liveGroups(groupsByJob[job] ?? [], counts), [groupsByJob, job, counts]);

  /**
   * Любая смена условий возвращает список к первым десяти: иначе человек,
   * открывший всю базу и уточнивший запрос, видит хвост чужой выдачи.
   * Сброс стоит в самих обработчиках, а не в эффекте: эффект на то же самое
   * даёт лишний проход отрисовки сразу после каждого нажатия.
   */
  const toggle = (k: string) => {
    setShown(PAGE);
    setOn(prev => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });
  };

  const search = (v: string) => { setShown(PAGE); setQuery(v); };

  const list = useMemo(() => {
    const wanted = [...on];
    let out = wanted.length
      ? pool.filter(s => {
          const have = new Set(allFacets(s));
          return wanted.every(k => have.has(k));
        })
      : pool;

    const q = query.trim();
    if (q) {
      out = out
        .filter(s => matches(stacks.get(s.slug)!, q))
        // Сортировка устойчивая, поэтому карточки с одинаковой близостью
        // остаются в исходном порядке каталога.
        .sort(
          (a, b) =>
            rank({ name: a.name, slug: a.slug, text: [], tags: [] }, stacks.get(a.slug)!, q) -
            rank({ name: b.name, slug: b.slug, text: [], tags: [] }, stacks.get(b.slug)!, q)
        );
    }
    return out;
  }, [pool, on, query, stacks]);

  /** Смена задачи сбрасывает галочки: в новой задаче признаки другие. */
  const pickJob = (slug: string) => { setShown(PAGE); setJob(slug); setOn(new Set()); };

  const clearAll = () => { setShown(PAGE); setOn(new Set()); setQuery(''); };
  const dirty = on.size > 0 || query.trim().length > 0;
  const checked = list.filter(s => s.priceCheckedAt).length;
  const hints = useMemo(
    () => [t.searchHint, t.searchHint1, t.searchHint2, t.searchHint3].filter(Boolean),
    [t]
  );

  return (
    <>
      <h2 className="sr-only">{t.filters}</h2>

      {/* Поиск и кнопка фильтра — один ряд. Всё, что нажимается, ростом 40,
          чтобы ряд читался как один предмет, а не как три разных. */}
      <div className="mt-4 flex flex-wrap items-center gap-2.5">
        <Hunt
          value={query}
          onChange={search}
          hints={hints}
          t={t}
          onSubmit={() => results.current?.scrollIntoView({ block: 'start', behavior: 'smooth' })}
        />
        {/* На широком экране кнопка стоит в ряду с поиском. На узком её место
            занимает плавающая кнопка внизу: до верха страницы оттуда не
            дотянуться, а палец и так внизу. */}
        <button
          type="button"
          onClick={() => setPanel(v => !v)}
          aria-expanded={panel}
          aria-controls="ai-facets"
          className="ai-chip hidden h-10 shrink-0 items-center gap-2 rounded-full px-4 text-[13.5px] font-semibold lg:inline-flex"
        >
          <SlidersHorizontal size={15} />
          {t.filters}
          {on.size > 0 && <span className="ai-pick rounded-full px-1.5 text-[11px] font-extrabold tabular-nums text-white">{on.size}</span>}
          <ChevronDown size={13} className={panel ? 'rotate-180 transition-transform' : 'transition-transform'} />
        </button>
      </div>

      {/* Полоса задач. На узком экране листается вбок одной строкой. */}
      <ul
        id="tasks"
        className="ai-strip mt-3 scroll-mt-32 flex list-none gap-2 overflow-x-auto px-0 py-1 sm:flex-wrap sm:overflow-visible max-sm:flex-nowrap"
      >
        <li>
          <button
            type="button"
            onClick={() => pickJob('')}
            aria-pressed={job === ''}
            className="ai-task inline-flex h-10 items-center gap-2 whitespace-nowrap rounded-full px-4 text-[13.5px] font-semibold"
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
              className="ai-task inline-flex h-10 items-center gap-2 whitespace-nowrap rounded-full px-4 text-[13.5px] font-semibold"
            >
              <JobIcon name={j.icon} />
              {pick(j.name, locale)}
            </button>
          </li>
        ))}
      </ul>

      {/* Панель признаков. На широком экране раскрывается на месте, на узком —
          шторкой снизу. Положение задают служебные классы прямо здесь, а не
          собственное правило в globals.css: оно сильнее и однажды уже
          открывало шторку куском страницы ниже экрана. */}
      {panel && (
        <>
          <div
            className="fixed inset-0 z-[66] bg-black/40 lg:hidden"
            onClick={() => setPanel(false)}
            aria-hidden="true"
          />
          <div
            id="ai-facets"
            className="ai-panel fixed inset-x-0 bottom-0 z-[70] max-h-[78vh] overflow-y-auto rounded-t-[20px] p-4 pb-6 backdrop-blur-[14px] backdrop-saturate-150 lg:static lg:mt-3 lg:max-h-none lg:rounded-[20px] lg:p-5"
          >
            <div className="mb-3 flex items-center gap-3 lg:hidden">
              <span className="mx-auto h-1 w-10 rounded-full bg-border" aria-hidden="true" />
            </div>
            <div className="mb-3 flex items-center justify-between gap-3">
              <b className="text-[12px] font-extrabold uppercase tracking-[.07em] text-muted">{t.filters}</b>
              <button
                type="button"
                onClick={() => setPanel(false)}
                aria-label={t.close}
                className="ai-chip grid size-8 place-items-center rounded-full lg:hidden"
              >
                <X size={15} />
              </button>
            </div>

            {live.length > 0 ? (
              <Facets groups={live} locale={locale} on={on} toggle={toggle} counts={counts} />
            ) : (
              <p className="m-0 text-[13.5px] text-muted">{t.noFacets}</p>
            )}

            {/* Прилипают к низу шторки: список признаков длиннее экрана, и
                «Показать» иначе оказывается там, куда надо ещё доскроллить. */}
            <div className="sticky bottom-0 -mx-4 mt-4 flex gap-2.5 border-t border-border bg-background/95 px-4 pb-1 pt-3 backdrop-blur-[10px] lg:hidden">
              <button
                type="button"
                onClick={() => setOn(new Set())}
                className="ai-chip h-10 flex-1 rounded-full text-[13.5px] font-semibold"
              >
                {t.reset}
              </button>
              <button
                type="button"
                onClick={() => setPanel(false)}
                className="ai-cta h-10 flex-1 rounded-full text-[13.5px]"
              >
                {t.show} {list.length}
              </button>
            </div>
          </div>
        </>
      )}

      <section id="results" ref={results} aria-labelledby="ai-res" className="mt-4 scroll-mt-24">
        <h2 id="ai-res" className="sr-only">{t.servicesH}</h2>

        {/* Строка итога: сколько нашлось, что выбрано и чем всё снять. */}
        <div className="flex flex-wrap items-center gap-2.5 border-t border-border pt-3.5">
          <span className="text-[13.5px] tabular-nums text-muted" aria-live="polite">
            <b className="font-extrabold text-foreground">{list.length}</b> · {t.ofWhichChecked}: {checked}
          </span>
          <div className="ml-auto flex flex-wrap items-center gap-2">
            {[...on].map(k => (
              <button
                key={k}
                type="button"
                onClick={() => toggle(k)}
                className="ai-chip inline-flex h-[34px] items-center gap-1.5 rounded-full px-3 text-[12.5px] font-semibold text-muted"
              >
                {labels.get(k) ?? k}
                <X size={13} />
              </button>
            ))}
            {dirty && (
              <button type="button" onClick={clearAll} className="ai-cta h-[34px] rounded-full px-4 text-[12.5px]">
                {t.reset}
              </button>
            )}
          </div>
        </div>

        {list.length > 0 ? (
          <>
            {/* Все карточки лежат в разметке всегда, скрыты только видом.
                Робот читает каталог целиком за один заход, а человек не
                получает полотно на десять экранов. */}
            <ul className="m-0 mt-4 grid list-none grid-cols-1 gap-3.5 p-0 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((s, i) => (
                <Card key={s.slug} s={s} locale={locale} t={t} hidden={i >= shown} />
              ))}
            </ul>
            {shown < list.length && (
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setShown(v => v + PAGE)}
                  className="ai-cta inline-flex h-11 items-center gap-2 rounded-full px-6 text-[14px]"
                >
                  {t.showMore} {Math.min(PAGE, list.length - shown)}
                  <ChevronDown size={15} />
                </button>
                <span className="text-[12.5px] tabular-nums text-muted">
                  {t.shownOf} {shown} {t.of} {list.length}
                </span>
              </div>
            )}
          </>
        ) : (
          <div className="mt-4 rounded-[14px] border border-dashed border-border p-9 text-center text-[14px] text-muted">
            <b className="mb-1.5 block text-[16px] text-foreground">{t.emptyA}</b>
            {t.emptyB}
            {dirty && (
              <div className="mt-4">
                <button type="button" onClick={clearAll} className="ai-cta h-10 rounded-full px-5 text-[13.5px]">
                  {t.reset}
                </button>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Плавающая кнопка фильтра. Прячется, пока шторка открыта: там свои
          кнопки, а две одинаковые на экране сразу читаются как ошибка. */}
      {!panel && (
        <button
          type="button"
          onClick={() => setPanel(true)}
          aria-expanded={false}
          aria-controls="ai-facets"
          className="ai-fab fixed bottom-5 left-1/2 z-[65] inline-flex h-10 -translate-x-1/2 items-center gap-2.5 rounded-full px-5 text-[13.5px] font-extrabold text-white lg:hidden"
        >
          <SlidersHorizontal size={16} />
          {t.filters}
          {on.size > 0 && ` · ${on.size}`}
        </button>
      )}
    </>
  );
}
