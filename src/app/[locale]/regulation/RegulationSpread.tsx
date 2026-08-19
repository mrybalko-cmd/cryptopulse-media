'use client';

import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { WORLD } from '@/lib/map';
import { STATUS_META, type RegStatus } from '@/lib/regulationData';
import type { RegCountry } from '@/lib/regulation';

/**
 * The map, full width, with the panels floating over it.
 *
 * Two rules decide where a panel may live. The left ones — the heading and the
 * country dossier — are permanent, because the frame is widened westwards and
 * they sit over open Pacific rather than over a country. The right ones — the
 * figures and the filter — lie over Russia and Asia, so they can be dismissed.
 *
 * The frame is `-320 0 1320 501` and the map is clipped to x ≥ 0. The extra 320
 * units are the panels' water. The clip matters: the world file carries copies
 * of countries wrapped past the antimeridian so Chukotka does not smear across
 * the canvas, and widening the frame would otherwise have put Russia's tail
 * right back under the panels.
 */

const ORDER: (RegStatus | 'all')[] = ['all', 'legal', 'restricted', 'banned', 'unclear'];
const CLS: Record<RegStatus, string> = { legal: 'ok', restricted: 'mid', banned: 'no', unclear: 'gr' };

function flag(iso2: string) {
  return String.fromCodePoint(...[...iso2].map(ch => 0x1f1e6 + ch.charCodeAt(0) - 65));
}

/** Prose of unpredictable length in a fixed cell needs a ceiling. */
function short(s: string | undefined, n: number) {
  if (!s) return '';
  return s.length > n ? s.slice(0, n - 1).replace(/[\s,–—-]+$/, '') + '…' : s;
}

export default function RegulationSpread({
  locale,
  countries,
}: {
  locale: string;
  countries: RegCountry[];
}) {
  const isRu = locale === 'ru';
  const [filter, setFilter] = useState<RegStatus | 'all'>('all');
  const [selected, setSelected] = useState<string | null>(null);
  const [hover, setHover] = useState<{ x: number; y: number; name: string; status: RegStatus } | null>(null);
  const [sideHidden, setSideHidden] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  const byNum = useMemo(
    () => Object.fromEntries(countries.map(c => [c.isoNum, c])) as Record<string, RegCountry>,
    [countries]
  );
  const counts = useMemo(() => {
    const n = (s: RegStatus) => countries.filter(c => c.status === s).length;
    return { all: countries.length, legal: n('legal'), restricted: n('restricted'), banned: n('banned'), unclear: n('unclear') };
  }, [countries]);
  const guides = countries.filter(c => c.hasPage).length;

  // Опрошенная страна показывается всегда: панель без содержимого выглядит
  // сломанной, а первой страной логично взять ту, где мы недавно сверялись.
  const shown = countries.find(c => c.iso2 === selected) ?? countries.find(c => c.hasPage) ?? countries[0];
  const meta = shown ? STATUS_META[shown.status] : null;
  const label = (s: RegStatus) => (isRu ? STATUS_META[s].labelRu : STATUS_META[s].labelEn);
  const matches = (c: RegCountry) => filter === 'all' || c.status === filter;

  return (
    <div className="reg-spread">
      <button
        type="button"
        className="reg-clear"
        onClick={() => setSideHidden(v => !v)}
        aria-pressed={sideHidden}
      >
        {sideHidden
          ? (isRu ? '◉ Вернуть панели' : '◉ Show panels')
          : (isRu ? '◍ Убрать панели справа' : '◍ Hide right panels')}
      </button>

      <div className="reg-map" ref={boxRef}>
        <svg
          viewBox="-320 0 1320 501"
          className={filter === 'all' ? undefined : 'dim'}
          role="img"
          aria-label={isRu ? 'Карта регулирования криптовалют по странам' : 'World map of crypto regulation'}
          onMouseLeave={() => setHover(null)}
        >
          <defs>
            {(['legal', 'restricted', 'banned', 'unclear'] as RegStatus[]).map(s => {
              const id = { legal: 'Ok', restricted: 'Mid', banned: 'No', unclear: 'Gr' }[s];
              return (
                <g key={s}>
                  <linearGradient id={`reg${id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor={STATUS_META[s].color} stopOpacity="0.76" />
                    <stop offset="1" stopColor={STATUS_META[s].color} stopOpacity="0.34" />
                  </linearGradient>
                  <linearGradient id={`reg${id}L`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor={STATUS_META[s].color} stopOpacity="0.92" />
                    <stop offset="1" stopColor={STATUS_META[s].color} stopOpacity="0.62" />
                  </linearGradient>
                </g>
              );
            })}
            <clipPath id="regLand">
              <rect x="0" y="0" width={WORLD.width} height={WORLD.height} />
            </clipPath>
          </defs>

          <g clipPath="url(#regLand)">
            {Object.entries(WORLD.paths).map(([num, d]) => {
              const c = byNum[num];
              if (!c) return <path key={num} d={d} className="none" />;
              return (
                <path
                  key={num}
                  d={d}
                  className={[CLS[c.status], matches(c) ? 'match' : '', selected === c.iso2 ? 'sel' : '']
                    .filter(Boolean)
                    .join(' ')}
                  data-n={c.iso2}
                  onMouseMove={e => {
                    const r = boxRef.current?.getBoundingClientRect();
                    if (!r) return;
                    setHover({
                      x: e.clientX - r.left,
                      y: e.clientY - r.top,
                      name: isRu ? c.name.ru : c.name.en,
                      status: c.status,
                    });
                  }}
                  onClick={() => setSelected(c.iso2)}
                >
                  <title>{`${isRu ? c.name.ru : c.name.en} — ${label(c.status)}`}</title>
                </path>
              );
            })}

            {/* Countries below roughly 100 km across have no outline at this
                scale. They get the same invisible discs the map has always
                used, so "click any country" stays literally true. */}
            {Object.entries(WORLD.targets).map(([num, [x, y]]) => {
              const c = byNum[num];
              if (!c || WORLD.paths[num]) return null;
              return (
                <circle
                  key={`t${num}`}
                  cx={x}
                  cy={y}
                  r={7}
                  fill="transparent"
                  data-n={c.iso2}
                  className={matches(c) ? 'match' : ''}
                  onClick={() => setSelected(c.iso2)}
                >
                  <title>{`${isRu ? c.name.ru : c.name.en} — ${label(c.status)}`}</title>
                </circle>
              );
            })}
          </g>
        </svg>

        {hover && (
          <span className="reg-tag" style={{ left: hover.x, top: hover.y }}>
            {hover.name}
            <span
              className="block mt-[5px] text-[10px] font-semibold uppercase tracking-[0.11em]"
              style={{ color: STATUS_META[hover.status].color }}
            >
              {label(hover.status)}
            </span>
          </span>
        )}
      </div>

      <div className={`reg-over${sideHidden ? ' hidden' : ''}`}>
        <div className="reg-row">
          <div className="reg-gl thick p-[13px_15px] max-w-[252px]">
            <h1 className="m-0 text-[18px] font-bold leading-[1.18] tracking-[-0.03em]">
              {isRu ? 'Крипта по странам:' : 'Crypto by country:'}
              <br />
              <span className="text-accent">
                {isRu ? 'где можно, а где нет' : 'where it is legal'}
              </span>
            </h1>
            <div className="mt-[9px] pt-[9px] border-t border-[var(--glass-line)] font-mono text-[11px] text-muted">
              {isRu ? `${counts.all} стран · проверено ` : `${counts.all} countries · checked `}
              {(countries.reduce((m, c) => (c.checkedAt > m ? c.checkedAt : m), '') || '').split('-').reverse().join('.')}
            </div>
          </div>

          <div className="reg-gl side mt-[38px] py-[13px] px-[18px] flex gap-2">
            {([['legal', 'ok'], ['restricted', 'mid'], ['banned', 'no']] as const).map(([s, cls]) => (
              <div key={s} className="flex-1 min-w-[78px] flex flex-col items-center text-center">
                <span className={`reg-num ${cls} text-[27px]`}>{counts[s]}</span>
                <span className="mt-[7px] text-[9.5px] max-[760px]:text-[10.5px] font-bold uppercase tracking-[0.15em] max-[760px]:tracking-[0.1em] text-muted">
                  {isRu
                    ? { legal: 'разрешено', restricted: 'огранич.', banned: 'запрещено' }[s]
                    : { legal: 'legal', restricted: 'limited', banned: 'banned' }[s]}
                </span>
              </div>
            ))}
            <div className="flex-1 min-w-[78px] flex flex-col items-center text-center">
              <span className="reg-num text-[27px]">{guides}</span>
              <span className="mt-[7px] text-[9.5px] max-[760px]:text-[10.5px] font-bold uppercase tracking-[0.15em] max-[760px]:tracking-[0.1em] text-muted">
                {isRu ? 'гидов' : 'guides'}
              </span>
            </div>
          </div>
        </div>

        <div className="reg-row bot">
          {shown && meta && (
            <div className="reg-gl thick p-[13px_14px] max-w-[308px] w-full max-h-[calc(100%-20px)] flex flex-col min-h-0">
              <div className="flex-1 min-h-0 overflow-y-auto pr-[3px]">
                <div className="flex items-center gap-[9px] mb-[10px] flex-wrap">
                  <span aria-hidden className="text-[25px] leading-none">{flag(shown.iso2)}</span>
                  <h2 className="m-0 text-[17.5px] font-bold tracking-[-0.028em] flex-1 min-w-0">
                    {isRu ? shown.name.ru : shown.name.en}
                  </h2>
                  <span
                    className="inline-flex items-center gap-1.5 px-[11px] py-[5px] rounded-full text-[11px] font-bold leading-[1.4]"
                    style={{ background: `${meta.color}26`, color: meta.color }}
                  >
                    <i className="w-1.5 h-1.5 rounded-full" style={{ background: meta.color }} />
                    {label(shown.status)}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-1.5 mb-[9px]">
                  {[
                    [isRu ? 'Налог' : 'Tax', short(shown.taxNote ? (isRu ? shown.taxNote.ru : shown.taxNote.en) : '', 26) || '—'],
                    [isRu ? 'Регулятор' : 'Regulator', short((shown.regulatorName || '—').split('/')[0].trim(), 18)],
                    [isRu ? 'Проверено' : 'Checked', shown.checkedAt.split('-').reverse().join('.')],
                  ].map(([k, v]) => (
                    <div key={k} className="px-[9px] py-2 rounded-[9px] border border-[var(--glass-line)] bg-[color-mix(in_srgb,var(--foreground)_5%,transparent)] min-w-0">
                      <span className="block mb-1.5 text-[9px] max-[760px]:text-[10px] font-bold uppercase tracking-[0.13em] text-muted whitespace-nowrap">{k}</span>
                      <span className="block text-[12.5px] font-bold leading-[1.28] tracking-[-0.02em] [overflow-wrap:anywhere]">{v}</span>
                    </div>
                  ))}
                </div>

                {shown.factNote && (isRu ? shown.factNote.ru : shown.factNote.en) && (
                  <p className="m-0 mb-[7px] px-[10px] py-2 rounded-[9px] text-[11.8px] leading-[1.45] text-muted border border-[var(--glass-line)] bg-[color-mix(in_srgb,var(--foreground)_4%,transparent)]">
                    {short(isRu ? shown.factNote.ru : shown.factNote.en, 120)}
                  </p>
                )}
              </div>

              {/* Закреплено: главное действие панели не должно уезжать в прокрутку. */}
              <div className="flex-none pt-2.5 mt-0.5 border-t border-[var(--glass-line)]">
                {shown.hasPage ? (
                  <Link href={`/${locale}/regulation/${shown.slug}`} className="reg-cta">
                    {isRu ? `Подробнее: ${shown.name.ru} →` : `Full guide: ${shown.name.en} →`}
                  </Link>
                ) : (
                  <span className="reg-cta ghost">{isRu ? 'Гид пока не написан' : 'No guide yet'}</span>
                )}
              </div>
            </div>
          )}

          <div className="reg-gl side p-[11px_12px]">
            <div className="flex rounded-[11px] overflow-hidden border border-[var(--glass-line)] bg-[color-mix(in_srgb,var(--foreground)_5%,transparent)] max-w-full overflow-x-auto">
              {ORDER.map(s => {
                const on = filter === s;
                const color = s === 'all' ? '#8b8d94' : STATUS_META[s].color;
                return (
                  <button
                    key={s}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setFilter(s)}
                    className="flex-none inline-flex items-center gap-[7px] px-[13px] py-2.5 text-[12px] font-semibold border-r border-[var(--glass-line)] last:border-r-0 transition-colors"
                    style={
                      on
                        ? {
                            color: 'var(--foreground)',
                            background:
                              'linear-gradient(180deg, color-mix(in srgb, var(--violet) 34%, transparent), color-mix(in srgb, var(--violet) 16%, transparent))',
                            boxShadow: 'inset 0 1px 0 var(--glass-edge-lit)',
                          }
                        : { color: 'var(--muted)' }
                    }
                  >
                    <i className="w-[7px] h-[7px] rounded-full block" style={{ background: color }} />
                    {s === 'all'
                      ? (isRu ? 'Все' : 'All')
                      : isRu
                        ? { legal: 'Разрешено', restricted: 'Огранич.', banned: 'Запрет', unclear: 'Серая' }[s]
                        : { legal: 'Legal', restricted: 'Limited', banned: 'Banned', unclear: 'Grey' }[s]}
                  </button>
                );
              })}
            </div>
            <p className="m-0 mt-2 text-[11px] leading-[1.4] text-muted text-center">
              {isRu
                ? 'наведите — увидите статус · щёлкните — откроется досье'
                : 'hover for status · click to open the dossier'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
