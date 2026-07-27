'use client';

import { useState } from 'react';
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

function keyToDate(key: string): Date {
  return new Date(`${key}T00:00:00Z`);
}

function dayLabel(key: string, todayKey: string): string {
  const d = keyToDate(key);
  const monthDay = formatPragueDate(d, { day: 'numeric', month: 'long' });
  if (key === todayKey) return `Сегодня, ${monthDay}`;
  const tomorrowKey = pragueDateKey(new Date(keyToDate(todayKey).getTime() + 24 * 60 * 60 * 1000));
  const yesterdayKey = pragueDateKey(new Date(keyToDate(todayKey).getTime() - 24 * 60 * 60 * 1000));
  if (key === tomorrowKey) return `Завтра, ${monthDay}`;
  if (key === yesterdayKey) return `Вчера, ${monthDay}`;
  return monthDay;
}

function isBannerActiveOnDay(banner: ScheduleBannerWindow, dayKey: string): boolean {
  if (!banner.startAt || !banner.endAt) return false;
  const startKey = pragueDateKey(banner.startAt);
  const endKey = pragueDateKey(banner.endAt);
  return startKey <= dayKey && dayKey <= endKey;
}

export default function ScheduleCalendarView({
  dayKeys,
  itemsByDate,
  banners,
  todayKey,
}: {
  dayKeys: string[];
  itemsByDate: Record<string, ScheduleItem[]>;
  banners: ScheduleBannerWindow[];
  todayKey: string;
}) {
  const [selected, setSelected] = useState(dayKeys.includes(todayKey) ? todayKey : dayKeys[0]);

  const selectedItems = itemsByDate[selected] ?? [];
  const realizedItems = selectedItems.filter(i => i.realized);
  const plannedItems = selectedItems.filter(i => !i.realized);
  const selectedBanners = banners.filter(b => isBannerActiveOnDay(b, selected));

  return (
    <div>
      <div className="border border-[var(--admin-border)] rounded-xl bg-[var(--admin-panel)] p-4">
        <div className="text-[11px] text-[var(--admin-text-muted)] font-bold mb-2.5">
          {formatPragueDate(keyToDate(dayKeys[0]), { day: 'numeric', month: 'long' })} — {formatPragueDate(keyToDate(dayKeys[dayKeys.length - 1]), { day: 'numeric', month: 'long' })}
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
