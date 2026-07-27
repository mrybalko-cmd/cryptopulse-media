'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { ScheduleItem, ScheduleBannerWindow } from '@/lib/admin/data';
import { pragueDateKey, formatPragueDate, formatPragueTime } from '@/lib/admin/timezone';

const TYPE_META: Record<ScheduleItem['type'], { color: string; label: string; title: (t: string) => string }> = {
  news: { color: '#06b6d4', label: 'Новость', title: t => t },
  article: { color: '#8b5cf6', label: 'Статья', title: t => t },
  'banner-start': { color: '#f2a93b', label: 'Баннер', title: t => `«${t}» — старт показа` },
  'banner-end': { color: '#f2a93b', label: 'Баннер', title: t => `«${t}» — конец показа` },
  'exchange-pin': { color: '#ec4899', label: 'Биржа', title: t => `${t} — истекает закрепление` },
};

// Symmetric around the anchor day, so "today" sits dead-center by default.
const WINDOW_BEFORE = 10;
const WINDOW_AFTER = 10;
const STEP_DAYS = 14;

function keyToDate(key: string): Date {
  return new Date(`${key}T00:00:00Z`);
}

function addDaysToKey(key: string, days: number): string {
  const d = keyToDate(key);
  d.setUTCDate(d.getUTCDate() + days);
  return pragueDateKey(d);
}

function buildRange(centerKey: string, before: number, after: number): string[] {
  const start = addDaysToKey(centerKey, -before);
  return Array.from({ length: before + after + 1 }, (_, i) => addDaysToKey(start, i));
}

function dayLabel(key: string, todayKey: string): string {
  const monthDay = formatPragueDate(keyToDate(key), { day: 'numeric', month: 'long' });
  if (key === todayKey) return `Сегодня, ${monthDay}`;
  if (key === addDaysToKey(todayKey, 1)) return `Завтра, ${monthDay}`;
  if (key === addDaysToKey(todayKey, -1)) return `Вчера, ${monthDay}`;
  return monthDay;
}

function isBannerActiveOnDay(banner: ScheduleBannerWindow, dayKey: string): boolean {
  if (!banner.startAt || !banner.endAt) return false;
  const startKey = pragueDateKey(banner.startAt);
  const endKey = pragueDateKey(banner.endAt);
  return startKey <= dayKey && dayKey <= endKey;
}

export default function ScheduleCalendarView({
  itemsByDate,
  banners,
  todayKey,
  historyStartKey,
  futureEndKey,
}: {
  itemsByDate: Record<string, ScheduleItem[]>;
  banners: ScheduleBannerWindow[];
  todayKey: string;
  historyStartKey: string;
  futureEndKey: string;
}) {
  const [anchorKey, setAnchorKey] = useState(todayKey);
  const [selected, setSelected] = useState(todayKey);

  const dayKeys = useMemo(() => buildRange(anchorKey, WINDOW_BEFORE, WINDOW_AFTER), [anchorKey]);
  const canGoBack = dayKeys[0] > historyStartKey;
  const canGoForward = dayKeys[dayKeys.length - 1] < futureEndKey;

  function shift(days: number) {
    const next = addDaysToKey(anchorKey, days);
    setAnchorKey(next);
    setSelected(next);
  }

  function goToday() {
    setAnchorKey(todayKey);
    setSelected(todayKey);
  }

  const selectedItems = itemsByDate[selected] ?? [];
  const realizedItems = selectedItems.filter(i => i.realized);
  const plannedItems = selectedItems.filter(i => !i.realized);
  const selectedBanners = banners.filter(b => isBannerActiveOnDay(b, selected));

  return (
    <div>
      <div className="border border-[var(--admin-border)] rounded-xl bg-[var(--admin-panel)] p-4">
        <div className="flex items-center justify-between gap-2 mb-2.5 flex-wrap">
          <div className="text-[11px] text-[var(--admin-text-muted)] font-bold">
            {formatPragueDate(keyToDate(dayKeys[0]), { day: 'numeric', month: 'long' })} — {formatPragueDate(keyToDate(dayKeys[dayKeys.length - 1]), { day: 'numeric', month: 'long' })}
          </div>
          <div className="flex items-center gap-1">
            {anchorKey !== todayKey && (
              <button
                type="button"
                onClick={goToday}
                className="text-[10.5px] font-bold px-2.5 py-1 rounded-md text-[var(--admin-focus)] hover:bg-[var(--admin-input)] transition-colors"
              >
                Сегодня
              </button>
            )}
            <button
              type="button"
              onClick={() => shift(-STEP_DAYS)}
              disabled={!canGoBack}
              className="w-7 h-7 rounded-md border border-[var(--admin-border)] flex items-center justify-center text-[var(--admin-text-secondary)] hover:bg-[var(--admin-input)] disabled:opacity-30 disabled:cursor-default transition-colors"
              title="Раньше"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => shift(STEP_DAYS)}
              disabled={!canGoForward}
              className="w-7 h-7 rounded-md border border-[var(--admin-border)] flex items-center justify-center text-[var(--admin-text-secondary)] hover:bg-[var(--admin-input)] disabled:opacity-30 disabled:cursor-default transition-colors"
              title="Позже"
            >
              ›
            </button>
          </div>
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {dayKeys.map(key => {
            const dayItems = itemsByDate[key] ?? [];
            const types = Array.from(new Set(dayItems.map(i => i.type))).slice(0, 4);
            const isToday = key === todayKey;
            const isSelected = key === selected;
            const d = keyToDate(key);
            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelected(key)}
                className="min-w-[52px] text-center rounded-lg px-1.5 pt-2 pb-1.5 shrink-0 border transition-colors"
                style={{
                  borderColor: isSelected ? 'var(--admin-focus)' : 'var(--admin-border)',
                  background: isSelected ? 'rgba(6,182,212,.10)' : 'var(--admin-input)',
                }}
              >
                <div className="text-[9px] uppercase text-[var(--admin-text-dim)]">
                  {formatPragueDate(d, { weekday: 'short' })}
                </div>
                <div
                  className="text-[14px] font-extrabold my-0.5"
                  style={{ color: isSelected || isToday ? 'var(--admin-focus)' : 'var(--admin-text)' }}
                >
                  {d.getUTCDate()}
                </div>
                <div className="flex gap-0.5 justify-center h-[5px]">
                  {types.map(t => (
                    <span key={t} className="w-[8px] h-[5px] rounded-sm" style={{ background: TYPE_META[t].color }} />
                  ))}
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex gap-4 flex-wrap text-[10.5px] text-[var(--admin-text-dim)] mt-3.5 mb-4">
          <span className="flex items-center gap-1.5"><i className="w-2 h-2 rounded-sm inline-block" style={{ background: TYPE_META.news.color }} />Новость</span>
          <span className="flex items-center gap-1.5"><i className="w-2 h-2 rounded-sm inline-block" style={{ background: TYPE_META.article.color }} />Статья</span>
          <span className="flex items-center gap-1.5"><i className="w-2 h-2 rounded-sm inline-block" style={{ background: TYPE_META['banner-start'].color }} />Баннер</span>
          <span className="flex items-center gap-1.5"><i className="w-2 h-2 rounded-sm inline-block" style={{ background: TYPE_META['exchange-pin'].color }} />Биржа</span>
        </div>

        <div className="border-t border-[var(--admin-border)] pt-4">
          <div className="flex items-center justify-between gap-3 flex-wrap mb-3">
            <div className="text-[15px] font-extrabold">{dayLabel(selected, todayKey)}</div>
            <div className="flex items-center gap-2 flex-wrap">
              {plannedItems.length > 0 && (
                <span className="text-[10.5px] font-bold px-2.5 py-1 rounded-full" style={{ background: 'rgba(242,169,59,.15)', color: '#f2a93b' }}>
                  🕓 План: {plannedItems.length}
                </span>
              )}
              {realizedItems.length > 0 && (
                <span className="text-[10.5px] font-bold px-2.5 py-1 rounded-full" style={{ background: 'rgba(34,197,94,.15)', color: '#22c55e' }}>
                  ✅ Реализовано: {realizedItems.length}
                </span>
              )}
              {selectedBanners.map(b => (
                <Link key={b._id} href={`/admin/banners/${b._id}`} className="text-[10.5px] font-bold px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-400">
                  📢 {b.title} активен
                </Link>
              ))}
            </div>
          </div>

          {selectedItems.length === 0 ? (
            <div className="text-[12px] text-[var(--admin-text-dim)] py-3">Нет запланированных или опубликованных материалов на этот день.</div>
          ) : (
            <div className="flex flex-col gap-1.5 max-h-[420px] overflow-y-auto pr-1">
              {selectedItems.map(item => {
                const meta = TYPE_META[item.type];
                return (
                  <Link
                    key={`${item.type}-${item.id}-${item.at}`}
                    href={item.href}
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg bg-[var(--admin-input)] hover:brightness-110 transition-all"
                    style={{ borderLeft: `3px solid ${item.realized ? 'var(--admin-text-dim)' : meta.color}` }}
                  >
                    <span className="text-[11px] text-[var(--admin-text-dim)] w-11 shrink-0 tabular-nums">{formatPragueTime(item.at)}</span>
                    <span className={`text-[12.5px] flex-1 min-w-0 truncate ${item.realized ? 'text-[var(--admin-text-dim)]' : 'font-semibold'}`}>
                      {item.realized ? '✓ ' : ''}{meta.title(item.title)}
                    </span>
                    {item.language && item.language !== 'all' && (
                      <span className="text-[9px] font-extrabold uppercase text-[var(--admin-text-dim)] shrink-0">{item.language}</span>
                    )}
                    <span className="text-[9.5px] font-extrabold uppercase shrink-0" style={{ color: meta.color }}>{meta.label}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
