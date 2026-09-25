'use client';

import { useEffect, useState } from 'react';
import { PRODUCT_CATEGORIES } from '@/lib/exchangeFilters';
import {
  EXCHANGE_TYPES, EXCHANGE_SORTS, countActiveFilters,
  type ExchangeFilterState, type ExchangeSort,
} from '@/lib/exchangeFilterState';

const SORT_LABELS: Record<ExchangeSort, { ru: string; en: string }> = {
  volume: { ru: 'По объёму торгов', en: 'By trading volume' },
  year: { ru: 'По году основания', en: 'By founding year' },
  alpha: { ru: 'По алфавиту', en: 'Alphabetically' },
};

/**
 * Панель фильтров списка бирж.
 *
 * Была набором ссылок с параметрами запроса, стала кнопками: параметры
 * запроса делали весь маршрут динамическим и лишали страницу кэша.
 *
 * Тип и порядок применяются сразу, а продукты, лицензия, год и объём
 * собираются в черновик и уходят по «Применить» — как и было, чтобы не
 * перетряхивать таблицу на каждую галочку.
 */
export default function ExchangeToolbar({
  filters, onChange, locale,
}: {
  filters: ExchangeFilterState;
  onChange: (next: ExchangeFilterState) => void;
  locale: string;
}) {
  const isRu = locale === 'ru';
  const [draft, setDraft] = useState(filters);
  const activeFilterCount = countActiveFilters(filters);

  // Черновик подхватывает состояние, когда оно меняется снаружи: при чтении
  // адреса на входе и при нажатии «назад».
  useEffect(() => { setDraft(filters); }, [filters]);

  const tabCls = (on: boolean) =>
    `px-3.5 py-1.5 rounded-md text-xs font-bold transition-colors ${
      on ? 'bg-accent text-white' : 'text-muted hover:text-foreground'}`;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
      <div className="flex gap-1 bg-card border border-border rounded-lg p-1">
        <button type="button" aria-pressed={!filters.type}
          onClick={() => onChange({ ...filters, type: undefined })} className={tabCls(!filters.type)}>
          {isRu ? 'Все' : 'All'}
        </button>
        {EXCHANGE_TYPES.map(t => (
          <button key={t} type="button" aria-pressed={filters.type === t}
            onClick={() => onChange({ ...filters, type: t })} className={tabCls(filters.type === t)}>
            {t}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <details className="relative z-40">
          <summary className="cursor-pointer select-none list-none flex items-center gap-1.5 text-xs font-semibold border border-border rounded-lg px-3 py-2 bg-card text-foreground whitespace-nowrap">
            {isRu ? SORT_LABELS[filters.sort].ru : SORT_LABELS[filters.sort].en} <span className="text-muted">▾</span>
          </summary>
          <div className="absolute right-0 z-40 mt-1.5 w-56 bg-card border border-border rounded-lg shadow-xl py-1.5">
            {EXCHANGE_SORTS.map(s => (
              <button key={s} type="button"
                onClick={e => {
                  onChange({ ...filters, sort: s });
                  (e.currentTarget.closest('details') as HTMLDetailsElement | null)?.removeAttribute('open');
                }}
                className={`block w-full text-left px-3.5 py-2 text-xs ${
                  filters.sort === s ? 'text-accent font-semibold' : 'text-foreground hover:bg-[var(--card-hover)]'}`}>
                {isRu ? SORT_LABELS[s].ru : SORT_LABELS[s].en}
              </button>
            ))}
          </div>
        </details>

        <details className="relative z-40" open={activeFilterCount > 0 || undefined}>
          <summary className="cursor-pointer select-none list-none flex items-center gap-1.5 text-xs font-semibold border border-border rounded-lg px-3 py-2 bg-card text-foreground whitespace-nowrap">
            <span aria-hidden>⚙</span> {isRu ? 'Фильтры' : 'Filters'}
            {activeFilterCount > 0 && (
              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-accent text-white text-[10px] font-bold">{activeFilterCount}</span>
            )}
            <span className="text-muted">▾</span>
          </summary>
          <form
            onSubmit={e => { e.preventDefault(); onChange(draft); }}
            className="static sm:absolute sm:z-40 sm:right-0 mt-3 sm:mt-1.5 w-full sm:w-[600px] sm:max-w-[80vw] bg-card border border-border rounded-xl p-5 sm:shadow-xl"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div>
                <h4 className="text-[10px] uppercase tracking-wide text-muted mb-2 font-bold">{isRu ? 'Продукты' : 'Products'}</h4>
                <div className="flex flex-col gap-1.5">
                  {PRODUCT_CATEGORIES.map(p => (
                    <label key={p.value} className="flex items-center gap-2 text-xs text-foreground cursor-pointer">
                      <input type="checkbox" checked={draft.products.includes(p.value)}
                        onChange={e => setDraft(d => ({
                          ...d,
                          products: e.target.checked
                            ? [...d.products, p.value]
                            : d.products.filter(v => v !== p.value),
                        }))}
                        className="accent-accent" />
                      {isRu ? p.labelRu : p.labelEn}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-[10px] uppercase tracking-wide text-muted mb-2 font-bold">{isRu ? 'Лицензии' : 'Licences'}</h4>
                <label className="flex items-center gap-2 text-xs text-foreground cursor-pointer">
                  <input type="checkbox" checked={draft.license}
                    onChange={e => setDraft(d => ({ ...d, license: e.target.checked }))}
                    className="accent-accent" />
                  {isRu ? 'Есть регуляторная лицензия' : 'Has a regulatory licence'}
                </label>
              </div>
              <div>
                <h4 className="text-[10px] uppercase tracking-wide text-muted mb-2 font-bold">{isRu ? 'Год основания' : 'Founded year'}</h4>
                <div className="flex items-center gap-1.5">
                  <NumberField value={draft.minYear} placeholder={isRu ? 'От' : 'From'}
                    onChange={v => setDraft(d => ({ ...d, minYear: v }))} />
                  <NumberField value={draft.maxYear} placeholder={isRu ? 'До' : 'To'}
                    onChange={v => setDraft(d => ({ ...d, maxYear: v }))} />
                </div>
              </div>
              <div>
                <h4 className="text-[10px] uppercase tracking-wide text-muted mb-2 font-bold">{isRu ? 'Мин. объём, $ млн' : 'Min volume, $M'}</h4>
                <NumberField value={draft.minVolumeM} placeholder="100"
                  onChange={v => setDraft(d => ({ ...d, minVolumeM: v }))} />
              </div>
            </div>

            <div className="flex items-center justify-end gap-4 mt-5 pt-4 border-t border-border">
              {activeFilterCount > 0 && (
                <button type="button"
                  onClick={() => onChange({
                    ...filters, products: [], license: false,
                    minYear: undefined, maxYear: undefined, minVolumeM: undefined,
                  })}
                  className="text-xs text-muted hover:text-foreground">
                  {isRu ? 'Сбросить' : 'Reset'}
                </button>
              )}
              <button type="submit" className="bg-accent text-white text-xs font-bold rounded-lg px-5 py-2 hover:opacity-90 transition-opacity">
                {isRu ? 'Применить' : 'Apply'}
              </button>
            </div>
          </form>
        </details>
      </div>
    </div>
  );
}

function NumberField({ value, placeholder, onChange }: {
  value?: number; placeholder: string; onChange: (v: number | undefined) => void;
}) {
  return (
    <input
      type="number"
      value={value ?? ''}
      placeholder={placeholder}
      onChange={e => {
        const n = Number(e.target.value);
        onChange(e.target.value === '' || !Number.isFinite(n) ? undefined : n);
      }}
      className="w-full bg-background border border-border rounded-lg px-2 py-1.5 text-xs text-foreground"
    />
  );
}
