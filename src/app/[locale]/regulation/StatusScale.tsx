'use client';

import { STATUS_META, type RegStatus } from '@/lib/regulationData';
import type { RegCountry } from '@/lib/regulation';

const ORDER: RegStatus[] = ['legal', 'restricted', 'banned', 'unclear'];

/**
 * The headline figure and the four status counts.
 *
 * The counts are buttons: they were already the page's real measurements, so
 * making them filter the map and the index costs nothing and saves a separate
 * row of controls.
 *
 * Equal columns with a fixed two-character number, rather than a flex row —
 * "7" and "20" are different widths and the labels are different lengths, so a
 * shared gap produced visibly uneven spacing.
 */
export default function StatusScale({
  countries,
  locale,
  filter,
  onFilterChange,
}: {
  countries: RegCountry[];
  locale: string;
  filter: RegStatus | 'all';
  onFilterChange: (f: RegStatus | 'all') => void;
}) {
  const isRu = locale === 'ru';
  const total = countries.length;
  const count = (s: RegStatus) => countries.filter(c => c.status === s).length;

  return (
    <div className="glass-panel mb-3">
      <div className="flex items-baseline gap-3 flex-wrap mb-3.5">
        <span className="text-[46px] font-bold leading-none tracking-[-0.035em] tabular-nums">{total}</span>
        <span className="text-[13px] text-muted max-w-[38ch] leading-snug">
          {isRu
            ? 'стран на карте. Данные ведём сами и проверяем по первоисточникам.'
            : 'countries on the map. We maintain the data ourselves and check it against primary sources.'}
        </span>
      </div>

      <div className="flex h-[11px] rounded-full overflow-hidden gap-0.5 mb-3.5">
        {ORDER.map(s => (
          <span
            key={s}
            className="block rounded-[3px] transition-opacity duration-200"
            style={{
              flex: count(s),
              backgroundColor: STATUS_META[s].color,
              opacity: filter !== 'all' && filter !== s ? 0.22 : 1,
            }}
          />
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4">
        {ORDER.map((s, i) => {
          const meta = STATUS_META[s];
          const active = filter === s;
          return (
            <button
              key={s}
              type="button"
              aria-pressed={active}
              onClick={() => onFilterChange(active ? 'all' : s)}
              className={`text-left pl-4 border-l border-border first:pl-0 first:border-l-0 ${
                i === 2 ? 'max-sm:pl-0 max-sm:border-l-0 max-sm:mt-3' : ''
              } ${i === 3 ? 'max-sm:mt-3' : ''} transition-opacity ${
                filter !== 'all' && !active ? 'opacity-40' : ''
              } hover:opacity-75`}
            >
              <span className="block text-[22px] font-bold leading-none tracking-[-0.02em] tabular-nums" style={{ color: meta.color }}>
                {count(s)}
              </span>
              <span className="flex items-center gap-1.5 text-[11.5px] text-muted mt-[7px]">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: meta.color }} />
                {isRu ? meta.labelRu : meta.labelEn}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
