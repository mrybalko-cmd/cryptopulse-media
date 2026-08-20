// The admin's owner works from Czechia — every date/time shown in the admin
// panel (and every "which day does this belong to" grouping decision) should
// use Europe/Prague wall-clock time, not whatever timezone the serverless
// function happens to run in (Vercel defaults to UTC).
export const ADMIN_TIMEZONE = 'Europe/Prague';

const dateKeyFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: ADMIN_TIMEZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

/** 'YYYY-MM-DD' for the calendar day `date` falls on in Prague — use this
 * instead of `.toDateString()` for any day-bucketing/grouping logic. */
export function pragueDateKey(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return dateKeyFormatter.format(d);
}

/** A UTC-midnight Date representing the given Prague calendar day — safe to
 * increment with setUTCDate() for building rolling day ranges, since we've
 * already resolved the DST-sensitive part (which day it is) via the zone. */
export function pragueDateKeyToUTCDate(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

export function pragueToday(): Date {
  return pragueDateKeyToUTCDate(pragueDateKey(new Date()));
}

export function formatPragueTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', timeZone: ADMIN_TIMEZONE });
}

export function formatPragueDate(iso: string | Date, opts: Intl.DateTimeFormatOptions): string {
  const d = typeof iso === 'string' ? new Date(iso) : iso;
  return d.toLocaleDateString('ru-RU', { ...opts, timeZone: ADMIN_TIMEZONE });
}

export function formatPragueDateTime(iso?: string): string {
  if (!iso) return '';
  return new Date(iso).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: ADMIN_TIMEZONE,
  });
}

// ── Поля datetime-local в админке ─────────────────────────────────────────
// Браузер отдаёт из такого поля «2026-08-20T11:00» без всякой зоны, а
// new Date() от такой строки читает её в зоне процесса. На Vercel это UTC,
// поэтому набранные редактором 11:00 уходили в базу как 11:00 UTC и выходили
// на сайте в 13:00 по Праге. В обратную сторону было симметрично: форма
// показывала iso.slice(0,16), то есть UTC-время вместо пражского.

/** Смещение Праги от UTC в конкретный момент, с учётом перевода часов. */
function pragueOffsetMs(at: Date): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: ADMIN_TIMEZONE, hour12: false,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  }).formatToParts(at);
  const g = (t: string) => Number(parts.find(p => p.type === t)!.value);
  const wall = Date.UTC(g('year'), g('month') - 1, g('day'), g('hour') % 24, g('minute'), g('second'));
  return wall - at.getTime();
}

/** UTC-момент → «YYYY-MM-DDTHH:mm» пражскими стенными часами, для поля формы. */
export function pragueLocalInput(iso?: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: ADMIN_TIMEZONE, hour12: false,
    year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit',
  }).formatToParts(d);
  const g = (t: string) => parts.find(p => p.type === t)!.value;
  const hh = g('hour') === '24' ? '00' : g('hour');
  return `${g('year')}-${g('month')}-${g('day')}T${hh}:${g('minute')}`;
}

/**
 * «YYYY-MM-DDTHH:mm» пражскими часами → UTC-момент в ISO.
 *
 * Смещение берём двумя проходами: первое приближение считаем от значения,
 * прочитанного как UTC, вторым уточняем — иначе в ночь перевода часов
 * результат уезжает на час.
 */
export function pragueInputToISO(local?: string): string | undefined {
  if (!local) return undefined;
  const m = local.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
  if (!m) return undefined;
  const [y, mo, d, h, mi] = m.slice(1).map(Number);
  const asUTC = Date.UTC(y, mo - 1, d, h, mi);
  const rough = pragueOffsetMs(new Date(asUTC));
  const exact = pragueOffsetMs(new Date(asUTC - rough));
  return new Date(asUTC - exact).toISOString();
}
