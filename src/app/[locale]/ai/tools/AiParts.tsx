'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import { Check, ChevronDown, SlidersHorizontal, X } from 'lucide-react';
import type { AiFacet, AiFacetGroup, AiService, Locale } from '@/lib/ai';
import { allFacets, money, paidFrom, pick, pickList, unitLabel } from '@/lib/ai';

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
  services: AiService[];
  groups: AiFacetGroup[];
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

function Card({ s, locale, t }: { s: AiService; locale: Locale; t: Record<string, string> }) {
  const plan = paidFrom(s);
  const feats = pickList(s.features, locale).slice(0, 3);
  const checked = Boolean(s.priceCheckedAt);

  return (
    <li className="flex">
      <article className="ai-card relative flex w-full flex-col gap-3 overflow-hidden rounded-[14px] p-4">
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
            {s.pricingUrl && (
              <a
                href={s.pricingUrl}
                rel="sponsored nofollow noopener"
                target="_blank"
                className="mt-1 block text-[12px] font-extrabold text-accent hover:underline"
              >
                {t.details} ↗
              </a>
            )}
          </div>
        </div>

        <p className="m-0 flex min-h-[5.8em] items-start gap-2.5 text-[13px] font-semibold leading-[1.45]">
          <span className="ai-tick mt-px grid size-[18px] shrink-0 place-items-center rounded-full">
            <Check size={11} strokeWidth={3.5} className="text-white" />
          </span>
          <span className="line-clamp-4">{pick(s.highlight, locale)}</span>
        </p>

        {feats.length > 0 && (
          <ul className="m-0 flex min-h-[2.6em] list-none flex-wrap content-start gap-1.5 p-0">
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

        <div className="mt-auto flex items-center gap-2.5 border-t border-border pt-3 text-[12px] text-muted">
          {checked ? (
            <span className="inline-flex items-center gap-1.5 font-bold text-positive">
              <Check size={13} strokeWidth={3} />
              {t.priceChecked}
            </span>
          ) : (
            <span className="font-semibold text-importance-medium">{t.priceUnchecked}</span>
          )}
          <Link
            href={`/${locale}/ai/tools/${s.slug}`}
            className="ml-auto font-extrabold text-accent hover:underline"
          >
            {t.review} →
          </Link>
        </div>
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
}: {
  group: AiFacetGroup;
  locale: Locale;
  on: Set<string>;
  toggle: (k: string) => void;
  counts: Map<string, number>;
}) {
  const picked = group.items.filter(i => on.has(i.key)).length;
  return (
    <details className="border-b border-border last:border-b-0" open={group.openByDefault}>
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

export default function AiCatalogue({ locale, services, groups, t }: Props) {
  const [on, setOn] = useState<Set<string>>(new Set());
  const [sheet, setSheet] = useState(false);

  const counts = useMemo(() => countFacets(services), [services]);
  const live = useMemo(() => liveGroups(groups, counts), [groups, counts]);

  const toggle = (k: string) =>
    setOn(prev => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });

  const list = useMemo(() => {
    if (!on.size) return services;
    const wanted = [...on];
    return services.filter(s => {
      const have = new Set(allFacets(s));
      return wanted.every(k => have.has(k));
    });
  }, [services, on]);

  const checked = list.filter(s => s.priceCheckedAt).length;

  return (
    <>
      <div className="mt-5 grid gap-5 lg:grid-cols-[264px_minmax(0,1fr)]">
        <form
          aria-label={t.filters}
          className={`ai-filters self-start rounded-[20px] p-3.5 ${
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
          {live.map((g, i) => (
            <Group
              key={`${pick(g.title, locale)}-${i}`}
              group={g}
              locale={locale}
              on={on}
              toggle={toggle}
              counts={counts}
            />
          ))}
          {on.size > 0 && (
            <button
              type="button"
              onClick={() => setOn(new Set())}
              className="mt-2 p-1 text-[12.5px] font-bold text-accent"
            >
              {t.reset}
            </button>
          )}
        </form>

        <section aria-labelledby="ai-res">
          <div className="mb-4 flex flex-wrap items-baseline gap-3">
            <h2 id="ai-res" className="text-[19px] font-extrabold tracking-tight">{t.servicesH}</h2>
            <span className="text-[13.5px] tabular-nums text-muted" aria-live="polite">
              {list.length} · {t.ofWhichChecked}: {checked}
              {on.size > 0 && ` · ${t.filtersOn}: ${on.size}`}
            </span>
          </div>

          {list.length > 0 ? (
            <ul className="m-0 grid list-none grid-cols-1 gap-3.5 p-0 sm:grid-cols-2 xl:grid-cols-3">
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
