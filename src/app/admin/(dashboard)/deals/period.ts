/**
 * Период отчёта: разбор и подписи.
 *
 * Пресеты и календарь живут в одном месте, потому что иначе «этот месяц» в
 * списке и «этот месяц» в выгрузке однажды разойдутся на день — и сойдутся
 * обратно только после долгого разбирательства, почему в Excel на одну сделку
 * больше.
 */

const iso = (d: Date) => d.toISOString().slice(0, 10);

export type PresetKey = 'today' | 'month' | 'prevMonth' | 'quarter' | 'year' | 'all' | 'custom';

export const PRESETS: { key: Exclude<PresetKey, 'custom'>; label: string }[] = [
  { key: 'today', label: 'Сегодня' },
  { key: 'month', label: 'Этот месяц' },
  { key: 'prevMonth', label: 'Прошлый месяц' },
  { key: 'quarter', label: 'Квартал' },
  { key: 'year', label: 'Год' },
  { key: 'all', label: 'За всё время' },
];

export interface Period { from: string; to: string; preset: PresetKey; label: string }

/**
 * Границы считаются от сегодняшней даты в UTC. Сделка — не публикация, её дата
 * проставляется руками и часового пояса не имеет, поэтому сдвигать её на
 * пражское время было бы лишней точностью.
 */
export function resolvePeriod(
  sp: { preset?: string; from?: string; to?: string },
  bounds: { first: string | null; last: string | null }
): Period {
  const now = new Date();
  const y = now.getUTCFullYear();
  const m = now.getUTCMonth();

  const ask = (sp.preset ?? '') as PresetKey;
  const valid = /^\d{4}-\d{2}-\d{2}$/;

  if (ask === 'custom' || (!sp.preset && sp.from && sp.to)) {
    const from = valid.test(sp.from ?? '') ? sp.from! : iso(new Date(Date.UTC(y, m, 1)));
    const to = valid.test(sp.to ?? '') ? sp.to! : iso(now);
    // Перепутанные местами границы — обычная опечатка, а не повод показать
    // пустой отчёт и заставить гадать.
    const [a, b] = from <= to ? [from, to] : [to, from];
    return { from: a, to: b, preset: 'custom', label: `${ru(a)} — ${ru(b)}` };
  }

  switch (ask) {
    case 'today':
      return { from: iso(now), to: iso(now), preset: 'today', label: 'Сегодня' };
    case 'prevMonth': {
      const from = new Date(Date.UTC(y, m - 1, 1));
      const to = new Date(Date.UTC(y, m, 0));
      return { from: iso(from), to: iso(to), preset: 'prevMonth', label: monthName(from) };
    }
    case 'quarter': {
      const q = Math.floor(m / 3) * 3;
      return {
        from: iso(new Date(Date.UTC(y, q, 1))),
        to: iso(new Date(Date.UTC(y, q + 3, 0))),
        preset: 'quarter',
        label: `${Math.floor(m / 3) + 1}-й квартал ${y}`,
      };
    }
    case 'year':
      return { from: `${y}-01-01`, to: `${y}-12-31`, preset: 'year', label: `${y} год` };
    case 'all':
      return {
        from: bounds.first ?? '2000-01-01',
        to: bounds.last ?? iso(now),
        preset: 'all',
        label: 'За всё время',
      };
    default: {
      const from = new Date(Date.UTC(y, m, 1));
      return {
        from: iso(from),
        to: iso(new Date(Date.UTC(y, m + 1, 0))),
        preset: 'month',
        label: monthName(from),
      };
    }
  }
}

const MONTHS = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь',
  'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'];

const monthName = (d: Date) => `${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;

/** 2026-10-12 → 12.10.2026, как везде на сайте. */
export const ru = (isoDate: string) => {
  const [yy, mm, dd] = isoDate.split('-');
  return `${dd}.${mm}.${yy}`;
};
