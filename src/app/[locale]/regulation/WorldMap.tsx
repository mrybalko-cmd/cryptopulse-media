'use client';

import { useState } from 'react';
import { WORLD } from '@/lib/map';
import { STATUS_META, type RegStatus } from '@/lib/regulationData';
import type { RegCountry } from '@/lib/regulation';

const ORDER: RegStatus[] = ['legal', 'restricted', 'banned', 'unclear'];

/**
 * The relief map.
 *
 * Countries we track are filled with a vertical gradient in their status colour
 * and the whole landmass carries one drop shadow, so it reads as raised over the
 * water rather than as a flat infographic. Everything else is neutral land.
 *
 * Eight countries — Estonia, Switzerland, Czechia, Georgia, Portugal, South
 * Korea, El Salvador, Singapore — are too small to hit at this scale, so they
 * also get an invisible disc. Without it "click any country on the map" is a
 * promise the outline cannot keep.
 */
export default function WorldMap({
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
  const [hover, setHover] = useState<{ name: string; status: RegStatus; x: number; y: number } | null>(null);

  const byNum = new Map(countries.map(c => [c.isoNum.padStart(3, '0'), c]));
  const dimmed = (c: RegCountry) =>
    (filter !== 'all' && c.status !== filter) ||
    (!!query && !`${c.name.ru} ${c.name.en} ${c.iso2}`.toLowerCase().includes(query));

  const selectedNum = countries.find(c => c.iso2 === selected)?.isoNum.padStart(3, '0');
  const ring = selectedNum ? WORLD.targets[selectedNum] : undefined;

  return (
    <div className="glass-panel mb-3 !px-0 !py-0 overflow-hidden">
      <div className="flex items-center justify-between gap-3 flex-wrap px-4 pt-3 pb-1.5">
        <h2 className="text-[13px] font-bold m-0">{isRu ? 'Мир на карте' : 'The world map'}</h2>
        <span className="text-[11.5px] text-muted">
          {hover
            ? <><b style={{ color: STATUS_META[hover.status].color }}>{hover.name}</b>{' · '}
                {isRu ? STATUS_META[hover.status].labelRu : STATUS_META[hover.status].labelEn}</>
            : isRu ? 'Наведите на страну, нажмите — откроются подробности'
                   : 'Hover a country; click to open the details'}
        </span>
      </div>

      <div className="relative px-1.5 pb-1">
        <svg
          viewBox={`0 0 ${WORLD.width} ${WORLD.height}`}
          className="block w-full h-auto"
          role="img"
          aria-label={isRu ? 'Карта мира: статус регулирования криптовалют по странам'
                           : 'World map: crypto regulation status by country'}
        >
          <defs>
            {ORDER.map(s => (
              <linearGradient key={s} id={`reg-g-${s}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor={STATUS_META[s].color} stopOpacity="1" />
                <stop offset="1" stopColor={STATUS_META[s].color} stopOpacity="0.62" />
              </linearGradient>
            ))}
            <filter id="reg-relief" x="-8%" y="-8%" width="116%" height="126%">
              <feDropShadow dx="0" dy="2.2" stdDeviation="2.4" floodColor="#000" floodOpacity="0.55" />
            </filter>
            <filter id="reg-hot" x="-25%" y="-25%" width="150%" height="150%">
              <feDropShadow dx="0" dy="0" stdDeviation="3.2" floodColor="#fff" floodOpacity="0.55" />
            </filter>
          </defs>

          <g filter="url(#reg-relief)">
            {Object.entries(WORLD.paths).map(([num, d]) => {
              const c = byNum.get(num);
              const on = c && selected === c.iso2;
              return (
                <path
                  key={num}
                  d={d}
                  className={c ? 'cursor-pointer' : ''}
                  fill={c ? `url(#reg-g-${c.status})` : 'var(--card)'}
                  stroke="var(--background)"
                  strokeWidth={0.35}
                  opacity={c && dimmed(c) ? 0.2 : 1}
                  filter={on ? 'url(#reg-hot)' : undefined}
                  onMouseEnter={e => {
                    if (!c) return;
                    const box = (e.currentTarget.ownerSVGElement as SVGSVGElement).getBoundingClientRect();
                    const r = e.currentTarget.getBoundingClientRect();
                    setHover({
                      name: isRu ? c.name.ru : c.name.en,
                      status: c.status,
                      x: r.left + r.width / 2 - box.left,
                      y: r.top - box.top,
                    });
                  }}
                  onMouseLeave={() => setHover(null)}
                  onClick={() => c && onSelect(selected === c.iso2 ? null : c.iso2)}
                />
              );
            })}
          </g>

          {Object.entries(WORLD.targets).map(([num, [cx, cy]]) => {
            const c = byNum.get(num);
            if (!c) return null;
            return (
              <circle
                key={`t-${num}`}
                cx={cx} cy={cy} r={7}
                fill="transparent"
                className="cursor-pointer"
                onClick={() => onSelect(selected === c.iso2 ? null : c.iso2)}
              >
                <title>{isRu ? c.name.ru : c.name.en}</title>
              </circle>
            );
          })}

          {ring && (
            <circle cx={ring[0]} cy={ring[1]} r={11} fill="none" stroke="var(--foreground)" strokeWidth={0.8} opacity={0.65} />
          )}
        </svg>
      </div>

      <div className="flex gap-3 flex-wrap px-4 pb-3 text-[11.5px] text-muted">
        {ORDER.map(s => (
          <span key={s} className="inline-flex items-center gap-1.5">
            <i className="w-2.5 h-2.5 rounded-[3px] block" style={{ backgroundColor: STATUS_META[s].color }} />
            {isRu ? STATUS_META[s].labelRu : STATUS_META[s].labelEn}
          </span>
        ))}
        <span className="inline-flex items-center gap-1.5 opacity-60">
          <i className="w-2.5 h-2.5 rounded-[3px] block bg-card" />
          {isRu ? 'не отслеживаем' : 'not tracked'}
        </span>
      </div>
    </div>
  );
}
