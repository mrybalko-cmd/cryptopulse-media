'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CalendarRange, Clock, ExternalLink, Heart, List } from 'lucide-react';
import {
  CATEGORY_COLOR,
  CATEGORY_LABELS,
  CATEGORY_LUCIDE,
  CATEGORY_ORDER,
  IMPORTANCE_BADGE,
  tint,
} from '@/lib/calendarMeta';
import EventActions from './EventActions';
import type { CalendarEvent } from '@/lib/sanity';
import type { CSSProperties, ReactNode } from 'react';

/**
 * Доска календаря: герой, фильтры, список по датам и сетка месяца.
 *
 * Пришла на смену CalendarFilter, где сорок четыре карточки одного веса шли
 * сплошным списком: событие через два дня выглядело ровно как событие в
 * декабре. Теперь ближайшее событие — герой, остальное — плотный список, а
 * срезов три вместо одного.
 */

const DAY_MS = 86_400_000;
const DENSITY_DAYS = 30;

type Period = 'week' | 'month' | 'quarter' | 'all';
type Importance = 'any' | 'high' | 'medium';
type View = 'list' | 'month';

function toUtc(dateISO: string): number {
  return Date.parse(`${dateISO.slice(0, 10)}T00:00:00Z`);
}

/** Русскому нужны три формы, английскому хватает двух. */
function pluralRu(n: number, one: string, few: string, many: string): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
  return many;
}

function daysWord(n: number, isRu: boolean): string {
  return isRu ? pluralRu(n, 'день', 'дня', 'дней') : n === 1 ? 'day' : 'days';
}

function eventsWord(n: number, isRu: boolean): string {
  return isRu ? pluralRu(n, 'событие', 'события', 'событий') : n === 1 ? 'event' : 'events';
}

function countdownLabel(dateISO: string, todayISO: string, isRu: boolean): string {
  const days = Math.round((toUtc(dateISO) - toUtc(todayISO)) / DAY_MS);
  if (days <= 0) return isRu ? 'сегодня' : 'today';
  if (days === 1) return isRu ? 'завтра' : 'tomorrow';
  return isRu ? `через ${days} ${daysWord(days, true)}` : `in ${days} days`;
}

/** Диапазон многодневного события: «3–6 ноября» вместо одной даты. */
function spanLabel(event: CalendarEvent, isRu: boolean): string | null {
  if (!event.endDate || event.endDate <= event.date) return null;
  const from = new Date(event.date);
  const to = new Date(event.endDate);
  const sameMonth = event.date.slice(0, 7) === event.endDate.slice(0, 7);
  const loc = isRu ? 'ru-RU' : 'en-GB';
  const day = (d: Date) => d.toLocaleDateString(loc, { day: 'numeric', timeZone: 'UTC' });
  const full = (d: Date) =>
    d.toLocaleDateString(loc, { day: 'numeric', month: 'short', timeZone: 'UTC' }).replace('.', '');
  return sameMonth ? `${day(from)}–${full(to)}` : `${full(from)} – ${full(to)}`;
}

/* ── мелкие части ─────────────────────────────────────────────────────── */

function CategoryPill({ category, locale }: { category: string; locale: 'ru' | 'en' }) {
  const color = CATEGORY_COLOR[category] || CATEGORY_COLOR.other;
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10.5px] font-extrabold whitespace-nowrap"
      style={{ color, background: tint(color, 0.13), border: `1px solid ${tint(color, 0.34)}` }}
    >
      <span className="block h-1.5 w-1.5 rounded-full" style={{ background: color }} />
      {CATEGORY_LABELS[category]?.[locale] || category}
    </span>
  );
}

function ImportancePill({ importance, locale }: { importance: string; locale: 'ru' | 'en' }) {
  const meta = IMPORTANCE_BADGE[importance] || IMPORTANCE_BADGE.medium;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10.5px] font-extrabold whitespace-nowrap ${meta.className}`}
    >
      <span className="block h-1.5 w-1.5 rounded-full bg-current" />
      {meta.label[locale]}
    </span>
  );
}

/** Значок события: загруженная редакцией картинка, иначе иконка категории. */
function EventMark({ event, size }: { event: CalendarEvent; size: 'sm' | 'lg' }) {
  const color = CATEGORY_COLOR[event.category] || CATEGORY_COLOR.other;
  const Icon = CATEGORY_LUCIDE[event.category] || CATEGORY_LUCIDE.other;
  const px = size === 'lg' ? 38 : 34;
  return (
    <span
      className={`grid shrink-0 place-items-center overflow-hidden rounded-[10px] ${
        size === 'lg' ? 'h-[38px] w-[38px]' : 'h-[34px] w-[34px]'
      }`}
      style={{ color, background: tint(color, 0.14), border: `1px solid ${tint(color, 0.34)}` }}
    >
      {event.iconUrl ? (
        <Image
          src={event.iconUrl}
          alt=""
          aria-hidden="true"
          width={px}
          height={px}
          className="h-full w-full object-cover"
        />
      ) : (
        <Icon size={size === 'lg' ? 18 : 16} strokeWidth={2.1} />
      )}
    </span>
  );
}

function Chip({
  active,
  onClick,
  color,
  children,
  count,
}: {
  active: boolean;
  onClick: () => void;
  color?: string;
  children: ReactNode;
  count?: number;
}) {
  const style: CSSProperties | undefined =
    active && color ? { borderColor: tint(color, 0.55), background: tint(color, 0.12), color } : undefined;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      style={style}
      className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-[11.5px] font-bold transition-colors ${
        active
          ? color
            ? ''
            : 'border-[var(--glass-edge-lit)] bg-[var(--glass-clear)] text-foreground'
          : 'border-[var(--glass-edge)] text-muted hover:text-foreground'
      }`}
    >
      {color && <span className="block h-[7px] w-[7px] shrink-0 rounded-full" style={{ background: color }} />}
      {children}
      {count !== undefined && <b className="font-bold tabular-nums text-muted">{count}</b>}
    </button>
  );
}

/** Залитая кнопка важности. Жёлтая берёт графитовый текст: белый на жёлтом
 *  даёт 1,9:1 и не читается. */
function SolidChip({
  active,
  onClick,
  tone,
  children,
  count,
}: {
  active: boolean;
  onClick: () => void;
  tone: 'high' | 'medium' | 'popular';
  children: ReactNode;
  count: number;
}) {
  const base =
    tone === 'high'
      ? { background: 'color-mix(in srgb, var(--negative) 88%, #000)', color: '#fff' }
      : tone === 'medium'
        ? { background: 'var(--importance-medium)', color: '#17191d' }
        : undefined;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      style={base}
      className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border-0 px-3 py-1.5 text-[11.5px] font-extrabold shadow-[0_2px_8px_rgba(0,0,0,0.14)] transition-[filter,box-shadow] hover:brightness-110 ${
        tone === 'popular' ? 'cal-gradient' : ''
      } ${active ? 'ring-2 ring-offset-2 ring-offset-background ring-current' : ''}`}
    >
      {tone === 'popular' && <Heart size={11} strokeWidth={2.4} className="shrink-0" fill="currentColor" />}
      {children}
      <b className="font-bold tabular-nums opacity-75">{count}</b>
    </button>
  );
}

/* ── карточка события ─────────────────────────────────────────────────── */

function EventRow({
  event,
  locale,
  pageUrl,
  disambiguateTitle,
  todayISO,
}: {
  event: CalendarEvent;
  locale: string;
  pageUrl: string;
  disambiguateTitle: boolean;
  todayISO: string;
}) {
  const isRu = locale === 'ru';
  const loc = isRu ? 'ru' : 'en';
  const title = event.title[loc];
  const description = event.description?.[loc];
  const color = CATEGORY_COLOR[event.category] || CATEGORY_COLOR.other;

  // Повторяющиеся события (CPI, FOMC) носят одинаковый заголовок. Месяц в
  // конце оставляет каждый <h3> на странице уникальным.
  const date = new Date(event.date);
  const monthYear = date.toLocaleDateString(isRu ? 'ru-RU' : 'en-US', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
  const displayTitle = disambiguateTitle ? `${title} — ${monthYear}` : title;

  const daysAway = Math.round((toUtc(event.date) - toUtc(todayISO)) / DAY_MS);
  const isSoon = daysAway >= 0 && daysAway <= 7;
  const span = spanLabel(event, isRu);

  return (
    <article
      id={event.slug}
      style={{ '--cat-soft': tint(color, 0.45) } as CSSProperties}
      className="group relative grid scroll-mt-20 grid-cols-[34px_minmax(0,1fr)] items-start gap-3 rounded-[14px]
                 p-3 px-3.5 transition-[transform,border-color] cal-glass-soft backdrop-blur-[16px]
                 backdrop-saturate-150 hover:-translate-y-px hover:border-[var(--cat-soft)]
                 md:grid-cols-[34px_minmax(0,1fr)_auto] md:scroll-mt-32 motion-reduce:transform-none"
    >
      <EventMark event={event} size="sm" />

      <div className="min-w-0 flex-1">
        <h3 className="text-[13.5px] font-bold leading-snug text-foreground">{displayTitle}</h3>
        {description && (
          <p className="mt-1 line-clamp-2 text-[11.5px] leading-relaxed text-muted sm:line-clamp-none">
            {description}
          </p>
        )}

        <div className="mt-2 flex flex-wrap items-center gap-2">
          <CategoryPill category={event.category} locale={loc} />
          <ImportancePill importance={event.importance} locale={loc} />
          <span
            className={`inline-flex items-center gap-1 whitespace-nowrap text-[10.5px] font-bold tabular-nums ${
              isSoon ? 'text-accent' : 'text-muted'
            }`}
          >
            <Clock size={11} className="shrink-0" />
            {countdownLabel(event.date, todayISO, isRu)}
          </span>
          {span && <span className="text-[10.5px] font-bold text-muted">{span}</span>}
          {event.time && <span className="text-[10.5px] font-bold text-muted">{event.time}</span>}
          {event.sourceUrl && (
            <a
              href={event.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-1 text-[10.5px] text-muted transition-colors hover:text-accent sm:inline-flex"
            >
              <ExternalLink size={10} />
              {isRu ? 'Источник' : 'Source'}
            </a>
          )}
        </div>

      </div>

      {/* Действия стоят сбоку, а не отдельной строкой снизу: строка оставляла
          под каждой карточкой пустую полосу. На десктопе они проявляются при
          наведении и при фокусе с клавиатуры, на узком экране видны всегда. */}
      <div
        className="col-span-2 mt-1 border-t border-[var(--glass-edge)] pt-2.5 transition-opacity
                   md:col-span-1 md:mt-0 md:self-center md:border-0 md:pt-0 md:opacity-0
                   md:group-hover:opacity-100 md:group-focus-within:opacity-100"
      >
        <EventActions event={event} locale={locale} pageUrl={pageUrl} compact />
      </div>
    </article>
  );
}

/* ── герой ────────────────────────────────────────────────────────────── */

function LeadEvent({
  event,
  locale,
  pageUrl,
  todayISO,
}: {
  event: CalendarEvent;
  locale: string;
  pageUrl: string;
  todayISO: string;
}) {
  const isRu = locale === 'ru';
  const loc = isRu ? 'ru' : 'en';
  const color = CATEGORY_COLOR[event.category] || CATEGORY_COLOR.other;
  const days = Math.max(0, Math.round((toUtc(event.date) - toUtc(todayISO)) / DAY_MS));
  const date = new Date(event.date);
  const span = spanLabel(event, isRu);

  return (
    <article
      id={event.slug}
      className="relative mb-3.5 grid scroll-mt-20 grid-cols-[86px_minmax(0,1fr)] gap-4 overflow-hidden
                 rounded-[18px] p-4 cal-glass backdrop-blur-[22px] backdrop-saturate-150
                 sm:grid-cols-[118px_minmax(0,1fr)] sm:gap-5 sm:p-5 md:scroll-mt-32"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit]"
        style={{ background: `radial-gradient(60% 90% at 8% 0%, ${tint(color, 0.2)}, transparent 72%)` }}
      />

      <div
        className="relative flex flex-col items-center justify-center rounded-[15px] px-2 py-3.5"
        style={{ background: tint(color, 0.14), border: `1px solid ${tint(color, 0.34)}` }}
      >
        <b className="text-[34px] font-black leading-[0.92] tracking-[-0.04em] tabular-nums sm:text-[40px]" style={{ color }}>
          {days}
        </b>
        <span className="text-[9.5px] font-extrabold uppercase tracking-[0.1em] text-muted">
          {daysWord(days, isRu)}
        </span>
        <em className="mt-1 text-[10.5px] font-bold not-italic text-muted">
          {date.toLocaleDateString(isRu ? 'ru-RU' : 'en-GB', {
            day: 'numeric',
            month: 'short',
            weekday: 'short',
            timeZone: 'UTC',
          })}
        </em>
      </div>

      <div className="relative min-w-0">
        <h3 className="mb-1.5 text-[17px] font-extrabold leading-tight tracking-[-0.015em] text-foreground text-balance sm:text-[19px]">
          {event.title[loc]}
        </h3>
        {event.description?.[loc] && (
          <p className="mb-3 max-w-[60ch] text-[12.5px] leading-relaxed text-muted">{event.description[loc]}</p>
        )}

        <div className="flex flex-wrap items-center gap-2 border-t border-[var(--glass-edge)] pt-3">
          <CategoryPill category={event.category} locale={loc} />
          <ImportancePill importance={event.importance} locale={loc} />
          <span className="inline-flex items-center gap-1 whitespace-nowrap text-[10.5px] font-bold tabular-nums text-accent">
            <Clock size={11} className="shrink-0" />
            {countdownLabel(event.date, todayISO, isRu)}
          </span>
          {span && <span className="text-[10.5px] font-bold text-muted">{span}</span>}
          {event.time && <span className="text-[10.5px] font-bold text-muted">{event.time}</span>}
          <span className="ml-auto" />
          <EventActions event={event} locale={locale} pageUrl={pageUrl} />
        </div>
      </div>
    </article>
  );
}

/* ── сетка месяца ─────────────────────────────────────────────────────── */

function MonthGrid({
  events,
  locale,
  todayISO,
}: {
  events: CalendarEvent[];
  locale: string;
  todayISO: string;
}) {
  const isRu = locale === 'ru';
  const loc = isRu ? 'ru' : 'en';
  const [offset, setOffset] = useState(0);

  const base = new Date(`${todayISO}T00:00:00Z`);
  const cursor = new Date(Date.UTC(base.getUTCFullYear(), base.getUTCMonth() + offset, 1));
  const year = cursor.getUTCFullYear();
  const month = cursor.getUTCMonth();
  const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;

  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  // Неделя начинается с понедельника: воскресенье в JS это 0.
  const firstWeekday = (new Date(Date.UTC(year, month, 1)).getUTCDay() + 6) % 7;

  const byDay = useMemo(() => {
    const map: Record<number, CalendarEvent[]> = {};
    for (const e of events) {
      if (!e.date.startsWith(monthKey)) continue;
      const d = Number(e.date.slice(8, 10));
      (map[d] ||= []).push(e);
    }
    return map;
  }, [events, monthKey]);

  const weekdays = Array.from({ length: 7 }, (_, i) =>
    new Date(Date.UTC(2024, 0, 1 + i)).toLocaleDateString(isRu ? 'ru-RU' : 'en-US', {
      weekday: 'short',
      timeZone: 'UTC',
    })
  );

  const monthLabel = cursor
    .toLocaleDateString(isRu ? 'ru-RU' : 'en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' })
    .replace(/\s*г\.$/, '');

  return (
    <div className="rounded-[20px] p-4 cal-glass backdrop-blur-[22px] backdrop-saturate-150">
      <div className="mb-3 flex items-center justify-between gap-3">
        <b className="text-[12px] font-extrabold uppercase tracking-[0.1em] text-foreground">{monthLabel}</b>
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={() => setOffset((v) => v - 1)}
            aria-label={isRu ? 'Предыдущий месяц' : 'Previous month'}
            className="h-7 w-7 rounded-lg border border-[var(--glass-edge)] text-muted transition-colors hover:text-foreground"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => setOffset((v) => v + 1)}
            aria-label={isRu ? 'Следующий месяц' : 'Next month'}
            className="h-7 w-7 rounded-lg border border-[var(--glass-edge)] text-muted transition-colors hover:text-foreground"
          >
            ›
          </button>
        </div>
      </div>

      <div className="mb-1.5 grid grid-cols-7 gap-1.5">
        {weekdays.map((w) => (
          <span key={w} className="pb-1 text-center text-[9.5px] font-extrabold uppercase tracking-[0.08em] text-muted">
            {w}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {Array.from({ length: firstWeekday }, (_, i) => (
          <div key={`pad-${i}`} className="min-h-[72px] rounded-[11px] opacity-25 cal-glass-soft sm:min-h-[92px]" />
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const iso = `${monthKey}-${String(day).padStart(2, '0')}`;
          const list = byDay[day] || [];
          const isToday = iso === todayISO;
          return (
            <div
              key={day}
              className={`flex min-h-[72px] flex-col gap-1 rounded-[11px] p-1.5 cal-glass-soft transition-colors sm:min-h-[92px] sm:p-2 ${
                isToday ? 'border-accent' : ''
              }`}
            >
              <b className={`text-[11.5px] font-extrabold tabular-nums ${isToday ? 'text-accent' : 'text-muted'}`}>
                {day}
              </b>
              {list.slice(0, 2).map((e) => {
                const color = CATEGORY_COLOR[e.category] || CATEGORY_COLOR.other;
                return (
                  <a
                    key={e._id}
                    href={`#${e.slug}`}
                    style={{ background: tint(color, 0.14) }}
                    className="flex items-center gap-1.5 overflow-hidden text-ellipsis whitespace-nowrap rounded-md px-1.5 py-0.5 text-[9.5px] font-bold leading-tight text-foreground"
                  >
                    <span className="block h-[5px] w-[5px] shrink-0 rounded-full" style={{ background: color }} />
                    <span className="truncate">{e.title[loc]}</span>
                  </a>
                );
              })}
              {list.length > 2 && (
                <small className="text-[9px] font-bold text-muted">+{list.length - 2}</small>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── доска ────────────────────────────────────────────────────────────── */

export default function CalendarBoard({
  events,
  locale,
  pageUrl,
}: {
  events: CalendarEvent[];
  locale: string;
  pageUrl: string;
}) {
  const isRu = locale === 'ru';
  const loc = isRu ? 'ru' : 'en';
  const [category, setCategory] = useState<string>('all');
  const [period, setPeriod] = useState<Period>('all');
  const [importance, setImportance] = useState<Importance>('any');
  const [popularOnly, setPopularOnly] = useState(false);
  const [view, setView] = useState<View>('list');

  const todayISO = new Date().toISOString().slice(0, 10);
  const todayMs = toUtc(todayISO);

  const upcomingAll = useMemo(() => events.filter((e) => e.date >= todayISO), [events, todayISO]);
  const past = useMemo(() => events.filter((e) => e.date < todayISO).reverse(), [events, todayISO]);

  const periodCounts = useMemo(() => {
    const within = (days: number) =>
      upcomingAll.filter((e) => toUtc(e.date) - todayMs <= days * DAY_MS).length;
    return { week: within(7), month: within(31), quarter: within(92), all: upcomingAll.length };
  }, [upcomingAll, todayMs]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const e of upcomingAll) counts[e.category] = (counts[e.category] || 0) + 1;
    return counts;
  }, [upcomingAll]);

  const importanceCounts = useMemo(
    () => ({
      high: upcomingAll.filter((e) => e.importance === 'high').length,
      medium: upcomingAll.filter((e) => e.importance === 'medium').length,
      popular: upcomingAll.filter((e) => (e.likes ?? 0) > 0).length,
    }),
    [upcomingAll]
  );

  const presentCategories = useMemo(
    () => CATEGORY_ORDER.filter((c) => upcomingAll.some((e) => e.category === c)),
    [upcomingAll]
  );

  const filtered = useMemo(() => {
    const limitDays = period === 'week' ? 7 : period === 'month' ? 31 : period === 'quarter' ? 92 : null;
    return upcomingAll.filter((e) => {
      if (category !== 'all' && e.category !== category) return false;
      if (importance !== 'any' && e.importance !== importance) return false;
      if (popularOnly && (e.likes ?? 0) <= 0) return false;
      if (limitDays !== null && toUtc(e.date) - todayMs > limitDays * DAY_MS) return false;
      return true;
    });
  }, [upcomingAll, category, importance, popularOnly, period, todayMs]);

  const lead = filtered[0];
  const rest = filtered.slice(1);

  const titleCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const e of events) {
      const t = e.title[loc];
      counts[t] = (counts[t] || 0) + 1;
    }
    return counts;
  }, [events, loc]);

  /* Полоса плотности: тридцать дней вперёд, цвет — категория самого важного
     события дня, высота — его важность. Пустые дни остаются засечкой, поэтому
     сгущения читаются силуэтом. */
  const density = useMemo(() => {
    const rank: Record<string, number> = { high: 3, medium: 2, low: 1 };
    return Array.from({ length: DENSITY_DAYS }, (_, i) => {
      const iso = new Date(todayMs + i * DAY_MS).toISOString().slice(0, 10);
      const sameDay = upcomingAll.filter((e) => e.date === iso);
      if (sameDay.length === 0) return { height: 4, color: null as string | null };
      const top = sameDay.reduce((a, b) => (rank[b.importance] > rank[a.importance] ? b : a));
      const height = top.importance === 'high' ? 34 : top.importance === 'medium' ? 20 : 12;
      return { height, color: CATEGORY_COLOR[top.category] || CATEGORY_COLOR.other };
    });
  }, [upcomingAll, todayMs]);

  /* Список по месяцам, внутри месяца по датам: рельс слева несёт дату, и
     карточки перестают её повторять. */
  const months = useMemo(() => {
    const out: { key: string; label: string; count: number; days: { date: string; items: CalendarEvent[] }[] }[] = [];
    for (const event of rest) {
      const monthKey = event.date.slice(0, 7);
      let month = out[out.length - 1];
      if (!month || month.key !== monthKey) {
        month = {
          key: monthKey,
          // ru-RU отдаёт «август 2026 г.»: хвостовое «г.» в заглавном
          // разделителе читается шумом.
          label: new Date(event.date)
            .toLocaleDateString(isRu ? 'ru-RU' : 'en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' })
            .replace(/\s*г\.$/, ''),
          count: 0,
          days: [],
        };
        out.push(month);
      }
      let day = month.days[month.days.length - 1];
      if (!day || day.date !== event.date) {
        day = { date: event.date, items: [] };
        month.days.push(day);
      }
      day.items.push(event);
      month.count += 1;
    }
    // Герой тоже принадлежит своему месяцу, иначе счётчик врёт на единицу.
    if (lead) {
      const k = lead.date.slice(0, 7);
      const m = out.find((x) => x.key === k);
      if (m) m.count += 1;
    }
    return out;
  }, [rest, lead, isRu]);

  const periodLabels: Record<Period, string> = {
    week: isRu ? 'Эта неделя' : 'This week',
    month: isRu ? 'Этот месяц' : 'This month',
    quarter: isRu ? 'Квартал' : 'Quarter',
    all: isRu ? 'Всё' : 'All',
  };

  return (
    <div className="cal-stage">
      <span aria-hidden className="cal-halo-3" />

      {/* Шапка раздела: заголовок уровнем выше стоит в page.tsx, здесь только
          переключатель вида, чтобы он не уехал от списка. */}
      <div className="mb-3.5 flex items-center justify-between gap-4 rounded-[18px] px-4 py-3 cal-glass backdrop-blur-[22px] backdrop-saturate-150">
        <p className="text-[11.5px] leading-relaxed text-muted">
          {isRu
            ? `${upcomingAll.length} ${eventsWord(upcomingAll.length, true)} впереди`
            : `${upcomingAll.length} ${eventsWord(upcomingAll.length, false)} ahead`}
        </p>
        <div className="flex shrink-0 gap-0.5 rounded-[11px] border border-[var(--glass-edge)] bg-[var(--glass-clear-2)] p-[3px]">
          {(['list', 'month'] as View[]).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              aria-pressed={view === v}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-bold transition-colors ${
                view === v ? 'bg-foreground text-background' : 'text-muted hover:text-foreground'
              }`}
            >
              {v === 'list' ? <List size={12} /> : <CalendarRange size={12} />}
              {v === 'list' ? (isRu ? 'Список' : 'List') : isRu ? 'Месяц' : 'Month'}
            </button>
          ))}
        </div>
      </div>

      {lead && view === 'list' && (
        <LeadEvent event={lead} locale={locale} pageUrl={pageUrl} todayISO={todayISO} />
      )}

      {/* Фильтры */}
      <div className="mb-4 flex flex-col gap-2.5 rounded-[18px] px-4 py-3.5 cal-glass backdrop-blur-[22px] backdrop-saturate-150">
        <div className="flex flex-wrap items-center gap-2">
          <span className="w-[78px] shrink-0 pr-1 text-right text-[9.5px] font-extrabold uppercase tracking-[0.09em] text-muted">
            {isRu ? 'Период' : 'Period'}
          </span>
          {(['week', 'month', 'quarter', 'all'] as Period[]).map((p) => (
            <Chip key={p} active={period === p} onClick={() => setPeriod(p)} count={periodCounts[p]}>
              {periodLabels[p]}
            </Chip>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="w-[78px] shrink-0 pr-1 text-right text-[9.5px] font-extrabold uppercase tracking-[0.09em] text-muted">
            {isRu ? 'Плотность' : 'Density'}
          </span>
          <div className="cal-density flex h-[38px] min-w-0 flex-1 items-end gap-[3px] px-0.5">
            {density.map((d, i) => (
              <span
                key={i}
                className={`cal-bar flex-1 ${d.color ? 'cal-bar-hot' : 'cal-bar-idle'}`}
                style={{ height: d.height, ...(d.color ? ({ '--d': d.color } as CSSProperties) : {}) }}
              />
            ))}
          </div>
          <span className="whitespace-nowrap text-[10px] text-muted">
            {isRu ? '30 дней вперёд' : 'next 30 days'}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="w-[78px] shrink-0 pr-1 text-right text-[9.5px] font-extrabold uppercase tracking-[0.09em] text-muted">
            {isRu ? 'Тема' : 'Topic'}
          </span>
          <Chip active={category === 'all'} onClick={() => setCategory('all')} count={upcomingAll.length}>
            {isRu ? 'Все' : 'All'}
          </Chip>
          {presentCategories.map((c) => (
            <Chip
              key={c}
              active={category === c}
              onClick={() => setCategory(c)}
              color={CATEGORY_COLOR[c] || CATEGORY_COLOR.other}
              count={categoryCounts[c]}
            >
              {CATEGORY_LABELS[c]?.[loc] || c}
            </Chip>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="w-[78px] shrink-0 pr-1 text-right text-[9.5px] font-extrabold uppercase tracking-[0.09em] text-muted">
            {isRu ? 'Важность' : 'Impact'}
          </span>
          <Chip
            active={importance === 'any' && !popularOnly}
            onClick={() => {
              setImportance('any');
              setPopularOnly(false);
            }}
            count={upcomingAll.length}
          >
            {isRu ? 'Любая' : 'Any'}
          </Chip>
          <SolidChip
            tone="high"
            active={importance === 'high'}
            onClick={() => setImportance(importance === 'high' ? 'any' : 'high')}
            count={importanceCounts.high}
          >
            {isRu ? 'Высокая' : 'High'}
          </SolidChip>
          <SolidChip
            tone="medium"
            active={importance === 'medium'}
            onClick={() => setImportance(importance === 'medium' ? 'any' : 'medium')}
            count={importanceCounts.medium}
          >
            {isRu ? 'Средняя' : 'Medium'}
          </SolidChip>
          <SolidChip
            tone="popular"
            active={popularOnly}
            onClick={() => setPopularOnly((v) => !v)}
            count={importanceCounts.popular}
          >
            {isRu ? 'Популярные' : 'Popular'}
          </SolidChip>
        </div>
      </div>

      {view === 'month' ? (
        <MonthGrid events={filtered} locale={locale} todayISO={todayISO} />
      ) : (
        <section className="rounded-[20px] p-4 cal-glass backdrop-blur-[22px] backdrop-saturate-150">
          <h2 className="sr-only">{isRu ? 'Предстоящие события' : 'Upcoming events'}</h2>
          {months.length > 0 ? (
            <div className="flex flex-col gap-1">
              {months.map((month) => (
                <div key={month.key}>
                  {/* Разделитель месяца — группировка, а не заголовок: в
                      оглавление страницы он не попадает. */}
                  <div className="mt-5 mb-2.5 flex items-center gap-2.5 rounded-[11px] px-3 py-1.5 cal-glass-soft first:mt-0">
                    <span className="whitespace-nowrap text-[11px] font-black uppercase tracking-[0.11em] text-foreground">
                      {month.label}
                    </span>
                    <span className="h-px flex-1 bg-[var(--glass-edge)]" />
                    <span className="whitespace-nowrap text-[10.5px] tabular-nums text-muted">
                      {month.count} {eventsWord(month.count, isRu)}
                    </span>
                  </div>

                  <div className="flex flex-col gap-2.5">
                    {month.days.map((day) => {
                      const d = new Date(day.date);
                      const isToday = day.date === todayISO;
                      return (
                        <div
                          key={day.date}
                          className="grid grid-cols-[46px_minmax(0,1fr)] gap-2.5 sm:grid-cols-[54px_minmax(0,1fr)] sm:gap-3.5"
                        >
                          <div
                            className={`self-start rounded-[12px] px-0.5 py-2 text-center cal-glass-soft ${
                              isToday ? 'border-accent' : ''
                            }`}
                          >
                            <div
                              className={`text-lg font-black leading-none tabular-nums sm:text-xl ${
                                isToday ? 'text-accent' : 'text-foreground'
                              }`}
                            >
                              {d.toLocaleDateString(isRu ? 'ru-RU' : 'en-US', { day: 'numeric', timeZone: 'UTC' })}
                            </div>
                            <div
                              className={`mt-1 text-[9px] font-extrabold uppercase tracking-[0.09em] ${
                                isToday ? 'text-accent' : 'text-muted'
                              }`}
                            >
                              {d
                                .toLocaleDateString(isRu ? 'ru-RU' : 'en-US', { month: 'short', timeZone: 'UTC' })
                                .replace('.', '')}
                            </div>
                            <div className="mt-0.5 text-[9.5px] text-muted opacity-75">
                              {d.toLocaleDateString(isRu ? 'ru-RU' : 'en-US', { weekday: 'short', timeZone: 'UTC' })}
                            </div>
                          </div>

                          <div className="flex min-w-0 flex-col gap-2.5">
                            {day.items.map((event) => (
                              <EventRow
                                key={event._id}
                                event={event}
                                locale={locale}
                                pageUrl={pageUrl}
                                todayISO={todayISO}
                                disambiguateTitle={titleCounts[event.title[loc]] > 1}
                              />
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-4 text-sm text-muted">
              {isRu
                ? 'По этому фильтру запланированных событий нет. Снимите часть условий.'
                : 'No upcoming events match this filter. Try clearing some of it.'}
            </p>
          )}
        </section>
      )}

      {/* Прошедшие: три свежих показываем, остальное живёт в архиве. */}
      {past.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-[18px] px-4 py-3 cal-glass backdrop-blur-[22px] backdrop-saturate-150">
          <div className="flex min-w-0 items-center gap-3">
            <h2 className="whitespace-nowrap text-[12.5px] font-extrabold text-foreground">
              {isRu ? 'Прошедшие события' : 'Past events'}
            </h2>
            <div className="hidden min-w-0 flex-wrap gap-1.5 sm:flex">
              {past.slice(0, 3).map((e) => {
                const color = CATEGORY_COLOR[e.category] || CATEGORY_COLOR.other;
                return (
                  <span
                    key={e._id}
                    style={{ background: tint(color, 0.13), borderColor: tint(color, 0.3) }}
                    className="inline-flex max-w-[220px] items-center gap-1.5 truncate rounded-md border px-2 py-0.5 text-[10.5px] font-bold text-muted"
                  >
                    <span className="block h-[5px] w-[5px] shrink-0 rounded-full" style={{ background: color }} />
                    <span className="truncate">{e.title[loc]}</span>
                  </span>
                );
              })}
            </div>
          </div>
          <Link
            href={`/${locale}/calendar/archive`}
            className="shrink-0 rounded-[10px] border border-[var(--glass-edge)] px-3.5 py-2 text-[11.5px] font-bold text-foreground transition-colors hover:border-[var(--glass-edge-lit)]"
          >
            {isRu ? `Весь архив · ${past.length}` : `Full archive · ${past.length}`}
          </Link>
        </div>
      )}
    </div>
  );
}
