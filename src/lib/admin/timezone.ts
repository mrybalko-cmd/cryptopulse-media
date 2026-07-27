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
