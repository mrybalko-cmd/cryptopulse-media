'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { Clock, ExternalLink } from 'lucide-react';
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
import type { CSSProperties } from 'react';

interface Props {
  events: CalendarEvent[];
  locale: string;
  pageUrl: string;
}

const DAY_MS = 86_400_000;

function toUtc(dateISO: string): number {
  return Date.parse(`${dateISO.slice(0, 10)}T00:00:00Z`);
}

/* Russian needs three plural forms; English gets away with two. */
function pluralRu(n: number, one: string, few: string, many: string): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
  return many;
}

function countdownLabel(dateISO: string, todayISO: string, isRu: boolean): string {
  const days = Math.round((toUtc(dateISO) - toUtc(todayISO)) / DAY_MS);
  if (days <= 0) return isRu ? 'сегодня' : 'today';
  if (days === 1) return isRu ? 'завтра' : 'tomorrow';
  return isRu
    ? `через ${days} ${pluralRu(days, 'день', 'дня', 'дней')}`
    : `in ${days} days`;
}

function eventsWord(n: number, isRu: boolean): string {
  return isRu ? pluralRu(n, 'событие', 'события', 'событий') : n === 1 ? 'event' : 'events';
}

function ImportancePill({ importance, locale }: { importance: string; locale: string }) {
  const meta = IMPORTANCE_BADGE[importance] || IMPORTANCE_BADGE.medium;
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[10.5px] font-bold px-2 py-0.5 rounded-full ${meta.className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {meta.label[locale as 'ru' | 'en']}
    </span>
  );
}

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
  const categoryLabel = CATEGORY_LABELS[event.category]?.[loc] || event.category;
  const color = CATEGORY_COLOR[event.category] || CATEGORY_COLOR.other;
  const Icon = CATEGORY_LUCIDE[event.category] || CATEGORY_LUCIDE.other;

  // Recurring events (monthly CPI, FOMC decisions, etc.) share the exact same
  // title across multiple entries — appending month/year keeps each <h3> on
  // the page unique instead of repeating byte-identical headings.
  const date = new Date(event.date);
  const monthYear = date.toLocaleDateString(isRu ? 'ru-RU' : 'en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });
  const displayTitle = disambiguateTitle ? `${title} — ${monthYear}` : title;

  const daysAway = Math.round((toUtc(event.date) - toUtc(todayISO)) / DAY_MS);
  const isSoon = daysAway >= 0 && daysAway <= 7;

  return (
    <article
      id={event.slug}
      style={{ '--cat': color, '--cat-soft': tint(color, 0.4) } as CSSProperties}
      className="group relative flex gap-3 bg-card border border-border rounded-xl p-3 pl-4 overflow-hidden scroll-mt-20 md:scroll-mt-32 transition-all hover:border-[var(--cat-soft)] hover:shadow-lg"
    >
      <span aria-hidden className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ background: color }} />

      <div
        className="shrink-0 w-8 h-8 sm:w-[34px] sm:h-[34px] rounded-[9px] overflow-hidden flex items-center justify-center relative"
        style={{ color, background: tint(color, 0.14) }}
      >
        {event.iconUrl ? (
          <Image src={event.iconUrl} alt="" aria-hidden="true" width={34} height={34} className="w-full h-full object-cover" />
        ) : (
          <Icon size={17} strokeWidth={2} />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-bold text-foreground leading-snug">{displayTitle}</h3>
        {description && (
          <p className="text-xs sm:text-[12.5px] text-muted mt-1 leading-relaxed line-clamp-2 sm:line-clamp-none">
            {description}
          </p>
        )}

        <div className="flex items-center gap-2 flex-wrap mt-2">
          <span
            className="inline-flex items-center gap-1.5 text-[10.5px] font-bold px-2 py-0.5 rounded-full"
            style={{ color, background: tint(color, 0.13) }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
            {categoryLabel}
          </span>
          <ImportancePill importance={event.importance} locale={locale} />
          <span
            className={`inline-flex items-center gap-1 text-[10.5px] tabular-nums whitespace-nowrap ${
              isSoon ? 'text-accent' : 'text-muted'
            }`}
          >
            <Clock size={11} />
            {countdownLabel(event.date, todayISO, isRu)}
          </span>
          {event.sourceUrl && (
            <a
              href={event.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1 text-[10.5px] text-muted hover:text-accent transition-colors"
            >
              <ExternalLink size={10} />
              {isRu ? 'Источник' : 'Source'}
            </a>
          )}
        </div>

        <div className="mt-2.5 pt-2.5 border-t border-border">
          <EventActions event={event} locale={locale} pageUrl={pageUrl} />
        </div>
      </div>
    </article>
  );
}

export default function CalendarFilter({ events, locale, pageUrl }: Props) {
  const isRu = locale === 'ru';
  const loc = isRu ? 'ru' : 'en';
  const [category, setCategory] = useState<string>('all');
  const [highOnly, setHighOnly] = useState(false);

  const todayISO = new Date().toISOString().slice(0, 10);

  const presentCategories = useMemo(
    () => CATEGORY_ORDER.filter((c) => events.some((e) => e.category === c)),
    [events]
  );

  const titleCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const e of events) {
      const t = e.title[loc];
      counts[t] = (counts[t] || 0) + 1;
    }
    return counts;
  }, [events, loc]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const e of events) counts[e.category] = (counts[e.category] || 0) + 1;
    return counts;
  }, [events]);

  const byCategory = category === 'all' ? events : events.filter((e) => e.category === category);
  const filtered = highOnly ? byCategory.filter((e) => e.importance === 'high') : byCategory;
  const upcoming = filtered.filter((e) => e.date >= todayISO);
  const past = filtered.filter((e) => e.date < todayISO).reverse();

  // Summary of what's ahead — read before the list, not after scrolling it.
  const allUpcoming = events.filter((e) => e.date >= todayISO);
  const daysToNext = allUpcoming.length
    ? Math.max(0, Math.round((toUtc(allUpcoming[0].date) - toUtc(todayISO)) / DAY_MS))
    : 0;
  const highCount = allUpcoming.filter((e) => e.importance === 'high').length;
  const unlockCount = allUpcoming.filter((e) => e.category === 'unlock').length;
  const conferenceCount = allUpcoming.filter((e) => e.category === 'conference').length;

  /* Upcoming events grouped by date, then by month, so the rail on the left
     carries the date and the cards stop repeating it. */
  const months = useMemo(() => {
    const out: { key: string; label: string; count: number; days: { date: string; items: CalendarEvent[] }[] }[] = [];
    for (const event of upcoming) {
      const monthKey = event.date.slice(0, 7);
      let month = out[out.length - 1];
      if (!month || month.key !== monthKey) {
        month = {
          key: monthKey,
          // ru-RU renders "август 2026 г." — the trailing "г." reads as noise
          // in an uppercase divider.
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
    return out;
  }, [upcoming, isRu]);

  const stats: { color: string; value: number; label: string; highlight?: boolean }[] = [
    {
      color: 'var(--accent)',
      value: daysToNext,
      label: isRu ? 'дн. до ближайшего' : 'days to next',
      highlight: true,
    },
    { color: 'var(--negative)', value: highCount, label: isRu ? 'высокой важности' : 'high impact' },
    { color: CATEGORY_COLOR.unlock, value: unlockCount, label: isRu ? 'разлоков' : 'unlocks' },
    { color: CATEGORY_COLOR.conference, value: conferenceCount, label: isRu ? 'конференций' : 'conferences' },
  ];

  return (
    <div>
      {/* At-a-glance summary */}
      {allUpcoming.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-4">
          {stats.map((s) => (
            <span
              key={s.label}
              className={`inline-flex items-center gap-2 border rounded-[11px] px-3 py-2 bg-card ${
                s.highlight ? 'border-accent/45' : 'border-border'
              }`}
            >
              <span className="w-2 h-2 rounded-[3px] shrink-0" style={{ background: s.color }} />
              <span className="text-[15px] font-extrabold text-foreground tabular-nums leading-none">{s.value}</span>
              <span
                className={`text-[10.5px] uppercase tracking-wide font-semibold ${
                  s.highlight ? 'text-accent' : 'text-muted'
                }`}
              >
                {s.label}
              </span>
            </span>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
          <button
            onClick={() => setCategory('all')}
            className={`shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
              category === 'all'
                ? 'border-accent/55 bg-accent/10 text-foreground'
                : 'border-border text-muted hover:text-foreground'
            }`}
          >
            {isRu ? 'Все' : 'All'}
            <span className="text-[10px] text-muted tabular-nums">{events.length}</span>
          </button>
          {presentCategories.map((c) => {
            const color = CATEGORY_COLOR[c] || CATEGORY_COLOR.other;
            const active = category === c;
            return (
              <button
                key={c}
                onClick={() => setCategory(c)}
                style={
                  active
                    ? ({ borderColor: tint(color, 0.55), background: tint(color, 0.11) } as CSSProperties)
                    : undefined
                }
                className={`shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors whitespace-nowrap ${
                  active ? 'text-foreground' : 'border-border text-muted hover:text-foreground'
                }`}
              >
                <span className="w-[7px] h-[7px] rounded-full shrink-0" style={{ background: color }} />
                {CATEGORY_LABELS[c]?.[loc] || c}
                <span className="text-[10px] text-muted tabular-nums">{categoryCounts[c]}</span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={highOnly}
          onClick={() => setHighOnly((v) => !v)}
          className="shrink-0 inline-flex items-center gap-2 text-xs text-muted hover:text-foreground transition-colors"
        >
          <span
            className={`w-[30px] h-[17px] rounded-full border relative transition-colors ${
              highOnly ? 'bg-negative/20 border-negative/50' : 'bg-card border-border'
            }`}
          >
            <span
              className={`absolute top-[1.5px] w-[11px] h-[11px] rounded-full transition-all ${
                highOnly ? 'left-[15px] bg-negative' : 'left-[2px] bg-muted'
              }`}
            />
          </span>
          {isRu ? 'Только высокой важности' : 'High impact only'}
        </button>
      </div>

      <section className="mb-10">
        <h2 className="text-xs font-bold uppercase tracking-widest text-accent mb-4">
          {isRu ? 'Предстоящие события' : 'Upcoming events'}
        </h2>

        {months.length > 0 ? (
          <div className="flex flex-col gap-2">
            {months.map((month) => (
              <div key={month.key}>
                {/* Month divider — visual grouping only, so it stays out of the
                    heading outline (h1 → h2 → h3 event titles). */}
                <div className="flex items-center gap-3 mt-5 mb-3 first:mt-0">
                  <span className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-foreground whitespace-nowrap">
                    {month.label}
                  </span>
                  <span className="h-px bg-border flex-1" />
                  <span className="text-[10.5px] text-muted tabular-nums whitespace-nowrap">
                    {month.count} {eventsWord(month.count, isRu)}
                  </span>
                </div>

                <div className="flex flex-col gap-3">
                  {month.days.map((day) => {
                    const d = new Date(day.date);
                    const isToday = day.date === todayISO;
                    return (
                      <div key={day.date} className="grid grid-cols-[44px_minmax(0,1fr)] sm:grid-cols-[52px_minmax(0,1fr)] gap-2.5 sm:gap-3.5">
                        <div className="text-center pt-1">
                          <div
                            className={`text-lg sm:text-xl font-extrabold leading-none tabular-nums ${
                              isToday ? 'text-accent' : 'text-foreground'
                            }`}
                          >
                            {d.toLocaleDateString(isRu ? 'ru-RU' : 'en-US', { day: 'numeric', timeZone: 'UTC' })}
                          </div>
                          <div className="text-[9.5px] font-extrabold uppercase tracking-[0.09em] text-muted mt-1">
                            {d.toLocaleDateString(isRu ? 'ru-RU' : 'en-US', { month: 'short', timeZone: 'UTC' }).replace('.', '')}
                          </div>
                          <div className="text-[9.5px] text-muted/70 mt-0.5">
                            {d.toLocaleDateString(isRu ? 'ru-RU' : 'en-US', { weekday: 'short', timeZone: 'UTC' })}
                          </div>
                          {isToday && (
                            <div className="text-[8.5px] font-extrabold uppercase tracking-wide text-accent mt-1">
                              {isRu ? 'сегодня' : 'today'}
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col gap-2.5 min-w-0">
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
          <p className="text-sm text-muted">
            {isRu
              ? 'Пока нет запланированных событий по этому фильтру.'
              : 'No upcoming events match this filter yet.'}
          </p>
        )}
      </section>

      {past.length > 0 && (
        <details className="group border border-border rounded-xl bg-card/40 overflow-hidden">
          <summary className="flex items-center justify-between gap-3 px-4 py-3 cursor-pointer list-none">
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-muted flex items-center gap-2">
              <span className="text-xs transition-transform group-open:rotate-180">▾</span>
              {isRu ? 'Прошедшие события' : 'Past events'}
            </h2>
            <span className="text-[10.5px] text-muted tabular-nums">
              {past.length} {eventsWord(past.length, isRu)}
            </span>
          </summary>
          <div className="px-4 pb-3">
            {past.map((event) => {
              const color = CATEGORY_COLOR[event.category] || CATEGORY_COLOR.other;
              return (
                <div
                  key={event._id}
                  id={event.slug}
                  className="grid grid-cols-[68px_minmax(0,1fr)_auto] gap-2.5 items-center py-2 border-t border-border scroll-mt-20 md:scroll-mt-32"
                >
                  <span className="text-[11px] text-muted tabular-nums whitespace-nowrap">
                    {new Date(event.date).toLocaleDateString(isRu ? 'ru-RU' : 'en-US', {
                      day: 'numeric',
                      month: 'short',
                      timeZone: 'UTC',
                    })}
                  </span>
                  <span className="text-[12.5px] font-semibold text-foreground min-w-0">{event.title[loc]}</span>
                  <span className="text-[10px] font-bold whitespace-nowrap" style={{ color }}>
                    {CATEGORY_LABELS[event.category]?.[loc] || event.category}
                  </span>
                </div>
              );
            })}
          </div>
        </details>
      )}
    </div>
  );
}
