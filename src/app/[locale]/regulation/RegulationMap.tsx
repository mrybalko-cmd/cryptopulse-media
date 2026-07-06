'use client';

import { useState } from 'react';
import { REGULATION_DATA, STATUS_META, type CountryReg, type RegStatus } from '@/lib/regulationData';
import { X, ChevronDown, Globe, MapPin } from 'lucide-react';

const STATUS_COLOR: Record<RegStatus, string> = {
  legal:      '#16a34a',
  restricted: '#d97706',
  banned:     '#dc2626',
  unclear:    '#6b7280',
};

// Regions grouping for visual display
const REGIONS: { id: string; labelRu: string; labelEn: string; isoCodes: string[] }[] = [
  { id: 'eu',       labelRu: 'Европа',          labelEn: 'Europe',          isoCodes: ['CZ','DE','FR','CH','GB','PT','ES','NL','NO','SE','EE','PL','IT','BY','UA'] },
  { id: 'americas', labelRu: 'Америка',          labelEn: 'Americas',        isoCodes: ['US','CA','SV','BR','MX','AR','BO'] },
  { id: 'asia',     labelRu: 'Азия',             labelEn: 'Asia',            isoCodes: ['SG','JP','AU','KR','IN','CN','TR','KZ','GE','TH','ID','PH','PK','UZ','BD','NP'] },
  { id: 'mena',     labelRu: 'Ближний Восток / Африка', labelEn: 'Middle East / Africa', isoCodes: ['AE','SA','EG','DZ','MA','TN','ZA'] },
];

interface Props {
  locale: string;
  filter: RegStatus | 'all';
  onFilterChange: (f: RegStatus | 'all') => void;
}

export default function RegulationMap({ locale, filter, onFilterChange }: Props) {
  const isRu = locale === 'ru';
  const [selected, setSelected] = useState<CountryReg | null>(null);

  const counts = {
    legal:      REGULATION_DATA.filter(c => c.status === 'legal').length,
    restricted: REGULATION_DATA.filter(c => c.status === 'restricted').length,
    banned:     REGULATION_DATA.filter(c => c.status === 'banned').length,
    unclear:    REGULATION_DATA.filter(c => c.status === 'unclear').length,
  };

  const filters: { key: RegStatus | 'all'; labelRu: string; labelEn: string; color?: string }[] = [
    { key: 'all',        labelRu: 'Все страны',                         labelEn: 'All countries' },
    { key: 'legal',      labelRu: `Разрешено (${counts.legal})`,        labelEn: `Legal (${counts.legal})`,            color: STATUS_COLOR.legal },
    { key: 'restricted', labelRu: `С ограничениями (${counts.restricted})`, labelEn: `Restricted (${counts.restricted})`, color: STATUS_COLOR.restricted },
    { key: 'banned',     labelRu: `Запрещено (${counts.banned})`,       labelEn: `Banned (${counts.banned})`,          color: STATUS_COLOR.banned },
    { key: 'unclear',    labelRu: `Нет данных (${counts.unclear})`,     labelEn: `Unclear (${counts.unclear})`,        color: STATUS_COLOR.unclear },
  ];

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {filters.map(f => (
          <button
            key={f.key}
            onClick={() => { onFilterChange(f.key); setSelected(null); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150 ${
              filter === f.key
                ? 'bg-accent text-background border-accent'
                : 'border-border text-muted hover:text-foreground hover:border-accent/40'
            }`}
          >
            {f.color && <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: f.color }} />}
            {isRu ? f.labelRu : f.labelEn}
          </button>
        ))}
      </div>

      {/* Regional visual grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {REGIONS.map(region => {
          const regionCountries = REGULATION_DATA.filter(c => region.isoCodes.includes(c.iso2));
          const visible = filter === 'all' ? regionCountries : regionCountries.filter(c => c.status === filter);
          if (visible.length === 0 && filter !== 'all') return null;

          return (
            <div key={region.id} className="rounded-xl border border-border bg-card p-4">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-muted mb-3 flex items-center gap-1.5">
                <MapPin size={11} />
                {isRu ? region.labelRu : region.labelEn}
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {regionCountries.map(country => {
                  const isVisible = filter === 'all' || country.status === filter;
                  const isSelected = selected?.iso2 === country.iso2;
                  return (
                    <button
                      key={country.iso2}
                      onClick={() => setSelected(isSelected ? null : country)}
                      title={isRu ? country.name.ru : country.name.en}
                      className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium border transition-all duration-150 ${
                        isVisible ? 'opacity-100' : 'opacity-25 pointer-events-none'
                      } ${
                        isSelected
                          ? 'ring-2 ring-offset-1 ring-offset-card'
                          : 'hover:brightness-110'
                      }`}
                      style={isVisible ? {
                        backgroundColor: STATUS_COLOR[country.status] + '18',
                        borderColor: STATUS_COLOR[country.status] + '50',
                        color: STATUS_COLOR[country.status],
                        ...(isSelected ? { ringColor: STATUS_COLOR[country.status] } : {}),
                      } : { borderColor: 'transparent', backgroundColor: 'transparent', color: 'var(--muted)' }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ backgroundColor: isVisible ? STATUS_COLOR[country.status] : '#6b7280' }}
                      />
                      {isRu ? country.name.ru : country.name.en}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Country detail panel */}
      {selected && (
        <CountryPanel country={selected} isRu={isRu} onClose={() => setSelected(null)} />
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
            style={{ backgroundColor: STATUS_COLOR[country.status] + '22', color: STATUS_COLOR[country.status] }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: STATUS_COLOR[country.status] }} />
            {isRu ? meta.labelRu : meta.labelEn}
          </span>
        </div>
        <button onClick={onClose} className="p-1 rounded-lg text-muted hover:text-foreground hover:bg-foreground/10 transition-colors shrink-0" aria-label="Close">
          <X size={16} />
        </button>
      </div>

      <p className="text-sm text-foreground leading-relaxed mb-3">
        {isRu ? country.summary.ru : country.summary.en}
      </p>

      <button onClick={() => setOpen(v => !v)} className="flex items-center gap-1.5 text-xs text-muted hover:text-foreground transition-colors">
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
          <p className="text-muted/50">{isRu ? `Обновлено: ${country.updatedYear}` : `Updated: ${country.updatedYear}`}</p>
        </div>
      )}
    </div>
  );
}

export function RegulationStats({ locale }: { locale: string }) {
  const isRu = locale === 'ru';
  const stats: { status: RegStatus; count: number }[] = [
    { status: 'legal',      count: REGULATION_DATA.filter(c => c.status === 'legal').length },
    { status: 'restricted', count: REGULATION_DATA.filter(c => c.status === 'restricted').length },
    { status: 'banned',     count: REGULATION_DATA.filter(c => c.status === 'banned').length },
    { status: 'unclear',    count: REGULATION_DATA.filter(c => c.status === 'unclear').length },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
      {stats.map(({ status, count }) => {
        const meta = STATUS_META[status];
        return (
          <div key={status} className={`rounded-xl border p-4 ${meta.bg} ${meta.border}`}>
            <div className="text-2xl font-bold tabular-nums" style={{ color: STATUS_COLOR[status] }}>{count}</div>
            <div className="text-xs text-muted mt-0.5 leading-tight">{isRu ? meta.labelRu : meta.labelEn}</div>
          </div>
        );
      })}
    </div>
  );
}

export function CountryList({ locale, filter }: { locale: string; filter: RegStatus | 'all' }) {
  const isRu = locale === 'ru';
  const [selected, setSelected] = useState<CountryReg | null>(null);

  const visible = filter === 'all' ? REGULATION_DATA : REGULATION_DATA.filter(c => c.status === filter);
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
                isOpen ? `${meta.bg} ${meta.border}` : 'border-border bg-card hover:border-accent/30'
              }`}
              onClick={() => setSelected(isOpen ? null : country)}
            >
              <div className="flex items-center justify-between px-4 py-3 gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: STATUS_COLOR[country.status] }} />
                  <span className="text-sm font-medium text-foreground truncate">{isRu ? country.name.ru : country.name.en}</span>
                </div>
                <ChevronDown size={14} className={`text-muted shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </div>
              {isOpen && (
                <div className="px-4 pb-4 border-t border-current/10 pt-3 space-y-2">
                  <p className="text-xs text-muted leading-relaxed">{isRu ? country.summary.ru : country.summary.en}</p>
                  <p className="text-xs text-muted leading-relaxed">{isRu ? country.details.ru : country.details.en}</p>
                  {country.taxNote && (
                    <p className="text-xs text-muted"><strong className="text-foreground">{isRu ? 'Налоги: ' : 'Taxes: '}</strong>{isRu ? country.taxNote.ru : country.taxNote.en}</p>
                  )}
                  <p className="text-[10px] text-muted/50">{isRu ? `Обновлено: ${country.updatedYear}` : `Updated: ${country.updatedYear}`}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
