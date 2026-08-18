'use client';

import { ChevronDown } from 'lucide-react';
import CountryDetail, { flag } from './CountryDetail';
import { REGION_LABELS, type RegCountry, type RegRegion } from '@/lib/regulation';
import { STATUS_META, type RegStatus } from '@/lib/regulationData';

const REGION_ORDER: RegRegion[] = ['eu', 'americas', 'asia', 'mena'];
const STATUS_ORDER: RegStatus[] = ['legal', 'restricted', 'banned', 'unclear'];

/**
 * The country index: four collapsible regions, countries as tiles inside.
 *
 * Forty-six full-width rows ran seven screens on a phone; tiles at 170px fit
 * four to six per row, and the regions collapse to headers.
 *
 * Each tile *is* a `<details>` rather than a button beside a separate list —
 * the first build had both, which rendered every country's name twice and read
 * as a bug. Open, a tile spans the full row and shows the country underneath.
 *
 * `<details>` rather than conditional rendering: every country's paragraphs are
 * in the HTML whatever is open, which is the entire point of the rebuild.
 */
export default function CountryIndex({
  countries,
  locale,
  filter,
  query,
  selected,
  onSelect,
}: {
  countries: RegCountry[];
  locale: string;
  filter: RegStatus | 'all';
  query: string;
  selected: string | null;
  onSelect: (iso2: string | null) => void;
}) {
  const isRu = locale === 'ru';
  const matches = (c: RegCountry) =>
    (filter === 'all' || c.status === filter) &&
    (!query || `${c.name.ru} ${c.name.en} ${c.iso2}`.toLowerCase().includes(query));

  const pickedRegion = countries.find(c => c.iso2 === selected)?.region;

  return (
    <div className="glass-panel !px-1 !py-1">
      {REGION_ORDER.map(region => {
        const rows = countries.filter(c => c.region === region).filter(matches);
        if (rows.length === 0) return null;
        const openRegion = query !== '' || pickedRegion === region || (!pickedRegion && region === 'eu');

        return (
          <details key={region} open={openRegion} className="border-b border-border last:border-b-0">
            <summary className="tap-target list-none cursor-pointer min-h-11 flex items-center gap-2.5 px-3 py-2 text-[12px] font-semibold uppercase tracking-[0.1em] text-muted [&::-webkit-details-marker]:hidden">
              {isRu ? REGION_LABELS[region].ru : REGION_LABELS[region].en}
              <span className="text-[11.5px] normal-case tracking-normal opacity-60 font-medium">{rows.length}</span>
              <span className="flex gap-[3px] ml-auto items-center">
                {STATUS_ORDER.map(s => {
                  const n = rows.filter(c => c.status === s).length;
                  if (!n) return null;
                  return (
                    <i
                      key={s}
                      className="w-2 h-2 rounded-[2px] block"
                      style={{ backgroundColor: STATUS_META[s].color, opacity: 0.35 + (0.65 * n) / rows.length }}
                    />
                  );
                })}
              </span>
              <ChevronDown size={13} className="text-muted shrink-0" />
            </summary>

            <div className="grid grid-cols-2 lg:grid-cols-[repeat(auto-fill,minmax(170px,1fr))] gap-1.5 px-2.5 pb-3 pt-0.5">
              {rows.map(c => {
                const active = selected === c.iso2;
                const meta = STATUS_META[c.status];
                return (
                  <details
                    key={c.iso2}
                    id={c.slug}
                    open={active}
                    // an open country takes the whole row so its text has room
                    className={`rounded-xl border transition-colors ${active ? 'col-span-full' : ''}`}
                    style={{
                      borderColor: active ? `${meta.color}9e` : 'transparent',
                      background: active ? `${meta.color}1a` : 'var(--card)',
                    }}
                  >
                    <summary
                      onClick={e => { e.preventDefault(); onSelect(active ? null : c.iso2); }}
                      className="tap-target list-none cursor-pointer min-h-11 flex items-center gap-2 px-3 py-1.5 text-[13px] font-semibold [&::-webkit-details-marker]:hidden"
                    >
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: meta.color }} />
                      <span className="text-sm leading-none shrink-0">{flag(c.iso2)}</span>
                      <span className="flex-1 min-w-0 truncate">{isRu ? c.name.ru : c.name.en}</span>
                      {active && (
                        <span className="text-[11px] text-muted font-medium shrink-0">
                          {isRu ? meta.labelRu : meta.labelEn}
                        </span>
                      )}
                      <ChevronDown size={12} className={`text-muted shrink-0 transition-transform ${active ? 'rotate-180' : ''}`} />
                    </summary>
                    <CountryDetail country={c} locale={locale} />
                  </details>
                );
              })}
            </div>
          </details>
        );
      })}
    </div>
  );
}
