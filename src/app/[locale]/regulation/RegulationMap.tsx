'use client';

import { useState, useCallback } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { REGULATION_DATA, STATUS_META, type CountryReg, type RegStatus } from '@/lib/regulationData';
import { X, ChevronDown, Globe } from 'lucide-react';

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

const isoNumToCountry = new Map(REGULATION_DATA.map(c => [c.isoNum, c]));

const STATUS_FILL: Record<RegStatus, string> = {
  legal:      '#16a34a',
  restricted: '#d97706',
  banned:     '#dc2626',
  unclear:    '#6b7280',
};

const UNKNOWN_FILL = '#1e293b';

interface Props {
  locale: string;
  filter: RegStatus | 'all';
  onFilterChange: (f: RegStatus | 'all') => void;
}

export default function RegulationMap({ locale, filter, onFilterChange }: Props) {
  const isRu = locale === 'ru';
  const [selected, setSelected] = useState<CountryReg | null>(null);
  const [tooltip, setTooltip] = useState<{ country: CountryReg; x: number; y: number } | null>(null);

  const handleClick = useCallback((country: CountryReg | undefined) => {
    if (!country) return;
    setSelected(prev => (prev?.iso2 === country.iso2 ? null : country));
  }, []);

  const counts = {
    legal:      REGULATION_DATA.filter(c => c.status === 'legal').length,
    restricted: REGULATION_DATA.filter(c => c.status === 'restricted').length,
    banned:     REGULATION_DATA.filter(c => c.status === 'banned').length,
    unclear:    REGULATION_DATA.filter(c => c.status === 'unclear').length,
  };

  const filters: { key: RegStatus | 'all'; labelRu: string; labelEn: string; color?: string }[] = [
    { key: 'all',        labelRu: 'Все страны',        labelEn: 'All countries' },
    { key: 'legal',      labelRu: `Разрешено (${counts.legal})`,          labelEn: `Legal (${counts.legal})`,       color: '#16a34a' },
    { key: 'restricted', labelRu: `С ограничениями (${counts.restricted})`, labelEn: `Restricted (${counts.restricted})`, color: '#d97706' },
    { key: 'banned',     labelRu: `Запрещено (${counts.banned})`,          labelEn: `Banned (${counts.banned})`,     color: '#dc2626' },
    { key: 'unclear',    labelRu: `Нет данных (${counts.unclear})`,        labelEn: `Unclear (${counts.unclear})`,   color: '#6b7280' },
  ];

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {filters.map(f => (
          <button
            key={f.key}
            onClick={() => onFilterChange(f.key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150 ${
              filter === f.key
                ? 'bg-accent text-background border-accent'
                : 'border-border text-muted hover:text-foreground hover:border-accent/40'
            }`}
          >
            {f.color && (
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: f.color }} />
            )}
            {isRu ? f.labelRu : f.labelEn}
          </button>
        ))}
      </div>

      {/* Map */}
      <div className="relative rounded-xl overflow-hidden border border-border bg-[#0f172a] mb-6">
        <ComposableMap
          projectionConfig={{ scale: 140, center: [10, 10] }}
          style={{ width: '100%', height: 'auto' }}
          viewBox="0 0 800 420"
        >
          <ZoomableGroup center={[0, 0]} zoom={1}>
            <Geographies geography={GEO_URL}>
              {({ geographies }: { geographies: any[] }) =>
                geographies.map((geo: any) => {
                  const isoNum = String(geo.id);
                  const country = isoNumToCountry.get(isoNum);
                  const isVisible = !country || filter === 'all' || country.status === filter;
                  const fill = country
                    ? (isVisible ? STATUS_FILL[country.status] : '#1e293b')
                    : UNKNOWN_FILL;
                  const isSelected = selected?.isoNum === isoNum;

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={fill}
                      stroke={isSelected ? '#f8fafc' : '#0f172a'}
                      strokeWidth={isSelected ? 1 : 0.4}
                      style={{
                        default: { outline: 'none', opacity: isVisible ? 1 : 0.3 },
                        hover:   { outline: 'none', opacity: 1, fill: country ? STATUS_FILL[country.status] : '#334155', cursor: country ? 'pointer' : 'default', filter: 'brightness(1.2)' },
                        pressed: { outline: 'none' },
                      }}
                      onMouseEnter={(e: React.MouseEvent) => {
                        if (country) setTooltip({ country, x: e.clientX, y: e.clientY });
                      }}
                      onMouseLeave={() => setTooltip(null)}
                      onMouseMove={(e: React.MouseEvent) => {
                        if (country) setTooltip({ country, x: e.clientX, y: e.clientY });
                      }}
                      onClick={() => handleClick(country)}
                    />
                  );
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>

        {/* Map legend */}
        <div className="absolute bottom-3 left-3 flex flex-col gap-1 pointer-events-none">
          {Object.entries(STATUS_FILL).map(([status, color]) => {
            const meta = STATUS_META[status as RegStatus];
            return (
              <div key={status} className="flex items-center gap-1.5 bg-background/80 backdrop-blur px-2 py-0.5 rounded text-[10px] text-foreground">
                <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: color }} />
                {isRu ? meta.labelRu : meta.labelEn}
              </div>
            );
          })}
          <div className="flex items-center gap-1.5 bg-background/80 backdrop-blur px-2 py-0.5 rounded text-[10px] text-muted">
            <span className="w-2.5 h-2.5 rounded-sm shrink-0 bg-[#1e293b]" />
            {isRu ? 'Нет в базе' : 'Not in database'}
          </div>
        </div>

        {/* Zoom hint */}
        <div className="absolute top-3 right-3 text-[10px] text-muted/60 bg-background/60 backdrop-blur px-2 py-1 rounded pointer-events-none">
          {isRu ? 'Скролл — масштаб · Клик — детали' : 'Scroll to zoom · Click for details'}
        </div>
      </div>

      {/* Tooltip (fixed to viewport) */}
      {tooltip && (
        <div
          className="fixed z-50 pointer-events-none bg-card border border-border rounded-lg px-3 py-2 shadow-xl text-xs max-w-48"
          style={{ left: tooltip.x + 14, top: tooltip.y - 10 }}
        >
          <div className="font-semibold text-foreground mb-0.5">
            {isRu ? tooltip.country.name.ru : tooltip.country.name.en}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: STATUS_FILL[tooltip.country.status] }} />
            <span style={{ color: STATUS_FILL[tooltip.country.status] }} className="font-medium">
              {isRu ? STATUS_META[tooltip.country.status].labelRu : STATUS_META[tooltip.country.status].labelEn}
            </span>
          </div>
        </div>
      )}

      {/* Country detail panel */}
      {selected && (
        <CountryPanel
          country={selected}
          isRu={isRu}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}

function CountryPanel({ country, isRu, onClose }: { country: CountryReg; isRu: boolean; onClose: () => void }) {
  const meta = STATUS_META[country.status];
  const [open, setOpen] = useState(false);

  return (
    <div className={`rounded-xl border p-5 mb-6 animate-in fade-in slide-in-from-top-2 duration-200 ${meta.bg} ${meta.border}`}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h3 className="text-base font-bold text-foreground">
            {isRu ? country.name.ru : country.name.en}
          </h3>
          <span
            className="inline-flex items-center gap-1.5 mt-1 text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{ backgroundColor: meta.color + '22', color: meta.color }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: meta.color }} />
            {isRu ? meta.labelRu : meta.labelEn}
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-muted hover:text-foreground hover:bg-foreground/10 transition-colors shrink-0"
          aria-label="Close"
        >
          <X size={16} />
        </button>
      </div>

      <p className="text-sm text-foreground leading-relaxed mb-3">
        {isRu ? country.summary.ru : country.summary.en}
      </p>

      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-1.5 text-xs text-muted hover:text-foreground transition-colors"
      >
        <ChevronDown size={13} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
        {isRu ? 'Подробнее' : 'More details'}
      </button>

      {open && (
        <div className="mt-3 space-y-2 text-xs text-muted leading-relaxed border-t border-current/10 pt-3">
          <p>{isRu ? country.details.ru : country.details.en}</p>
          {country.taxNote && (
            <p className="flex items-start gap-1.5">
              <span className="shrink-0 mt-0.5">💰</span>
              <span><strong className="text-foreground">{isRu ? 'Налоги:' : 'Taxes:'}</strong> {isRu ? country.taxNote.ru : country.taxNote.en}</span>
            </p>
          )}
          <p className="text-muted/50">
            {isRu ? `Обновлено: ${country.updatedYear}` : `Updated: ${country.updatedYear}`}
          </p>
        </div>
      )}
    </div>
  );
}

export function RegulationStats({ locale }: { locale: string }) {
  const isRu = locale === 'ru';
  const stats = [
    { status: 'legal' as RegStatus,      count: REGULATION_DATA.filter(c => c.status === 'legal').length },
    { status: 'restricted' as RegStatus, count: REGULATION_DATA.filter(c => c.status === 'restricted').length },
    { status: 'banned' as RegStatus,     count: REGULATION_DATA.filter(c => c.status === 'banned').length },
    { status: 'unclear' as RegStatus,    count: REGULATION_DATA.filter(c => c.status === 'unclear').length },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
      {stats.map(({ status, count }) => {
        const meta = STATUS_META[status];
        return (
          <div key={status} className={`rounded-xl border p-4 ${meta.bg} ${meta.border}`}>
            <div className="text-2xl font-bold tabular-nums" style={{ color: meta.color }}>{count}</div>
            <div className="text-xs text-muted mt-0.5 leading-tight">
              {isRu ? meta.labelRu : meta.labelEn}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function CountryList({ locale, filter }: { locale: string; filter: RegStatus | 'all' }) {
  const isRu = locale === 'ru';
  const [selected, setSelected] = useState<CountryReg | null>(null);

  const visible = filter === 'all'
    ? REGULATION_DATA
    : REGULATION_DATA.filter(c => c.status === filter);

  const sorted = [...visible].sort((a, b) => {
    const order: Record<RegStatus, number> = { legal: 0, restricted: 1, banned: 2, unclear: 3 };
    return order[a.status] - order[b.status] || (isRu ? a.name.ru : a.name.en).localeCompare(isRu ? b.name.ru : b.name.en);
  });

  return (
    <div>
      <h2 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
        <Globe size={14} className="text-accent" />
        {isRu ? 'Список стран' : 'Country list'}
        <span className="text-muted font-normal">({sorted.length})</span>
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {sorted.map(country => {
          const meta = STATUS_META[country.status];
          const isOpen = selected?.iso2 === country.iso2;
          return (
            <div
              key={country.iso2}
              id={country.slug}
              className={`rounded-xl border transition-all duration-150 cursor-pointer ${
                isOpen ? `${meta.bg} ${meta.border}` : 'border-border bg-card hover:border-accent/30 hover:bg-card/80'
              }`}
              onClick={() => setSelected(isOpen ? null : country)}
            >
              <div className="flex items-center justify-between px-4 py-3 gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: meta.color }}
                  />
                  <span className="text-sm font-medium text-foreground truncate">
                    {isRu ? country.name.ru : country.name.en}
                  </span>
                </div>
                <ChevronDown
                  size={14}
                  className={`text-muted shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
              </div>

              {isOpen && (
                <div className="px-4 pb-4 border-t border-current/10 pt-3 space-y-2">
                  <p className="text-xs text-muted leading-relaxed">
                    {isRu ? country.summary.ru : country.summary.en}
                  </p>
                  <p className="text-xs text-muted leading-relaxed">
                    {isRu ? country.details.ru : country.details.en}
                  </p>
                  {country.taxNote && (
                    <p className="text-xs text-muted leading-relaxed">
                      <strong className="text-foreground">{isRu ? 'Налоги: ' : 'Taxes: '}</strong>
                      {isRu ? country.taxNote.ru : country.taxNote.en}
                    </p>
                  )}
                  <p className="text-[10px] text-muted/50">
                    {isRu ? `Обновлено: ${country.updatedYear}` : `Updated: ${country.updatedYear}`}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
