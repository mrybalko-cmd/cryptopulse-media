/**
 * The site's one timestamp format: `HH:MM · DD.MM.YYYY`, 24-hour, time first.
 *
 * Built on en-GB with an explicit hourCycle rather than the visitor's locale,
 * so RU and EN render identically to the approved design: no AM/PM, and a
 * dot-separated DD.MM.YYYY rather than the M/D/YYYY that en-US would produce.
 * Times are shown in the newsroom's own timezone, so a reader never sees a
 * published-at that disagrees with what the editors saw.
 *
 * Kept here rather than inline because the format was being restated in each
 * component that needed it, which is how the two drift apart.
 */
const TIMEZONE = 'Europe/Prague';

export interface FormattedTimestamp {
  /** `14:05` */
  time: string;
  /** `11.08.2026` */
  date: string;
  /** `14:05 · 11.08.2026` */
  full: string;
}

export function formatTimestamp(input: Date | string | number): FormattedTimestamp | null {
  const d =
    input instanceof Date ? input
    : typeof input === 'number' ? new Date(input)
    : new Date(input);
  if (Number.isNaN(d.getTime())) return null;

  const parts = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
    timeZone: TIMEZONE,
  })
    .formatToParts(d)
    .reduce((acc, p) => { acc[p.type] = p.value; return acc; }, {} as Record<string, string>);

  const time = `${parts.hour}:${parts.minute}`;
  const date = `${parts.day}.${parts.month}.${parts.year}`;
  return { time, date, full: `${time} · ${date}` };
}

/** ISO 8601 for schema.org date fields, which want machine dates, not display ones. */
export function toIso(input: Date | string | number): string | null {
  const d =
    input instanceof Date ? input
    : typeof input === 'number' ? new Date(input)
    : new Date(input);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}
