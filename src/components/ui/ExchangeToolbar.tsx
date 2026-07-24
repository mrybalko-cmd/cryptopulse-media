import Link from 'next/link';
import { PRODUCT_CATEGORIES } from '@/lib/exchangeFilters';

const TYPES = ['CEX', 'DEX', 'P2P'] as const;
const SORTS = [
  { value: 'volume', ru: 'По объёму торгов', en: 'By trading volume' },
  { value: 'year', ru: 'По году основания', en: 'By founding year' },
  { value: 'alpha', ru: 'По алфавиту', en: 'Alphabetically' },
] as const;

export type ExchangeSearchParams = {
  type?: string;
  sort?: string;
  product?: string | string[];
  license?: string;
  minYear?: string;
  maxYear?: string;
  minVolume?: string;
};

function toArray(v?: string | string[]): string[] {
  return Array.isArray(v) ? v : v ? [v] : [];
}

// Builds a link that preserves every other active param — clicking "CEX"
// shouldn't wipe out a license/year filter someone already applied.
function hrefWith(base: string, sp: ExchangeSearchParams, overrides: Partial<ExchangeSearchParams>): string {
  const merged: Record<string, string | string[] | undefined> = { ...sp, ...overrides };
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(merged)) {
    if (v == null || v === '') continue;
    if (Array.isArray(v)) v.forEach(x => x && params.append(k, x));
    else params.append(k, v);
  }
  const qs = params.toString();
  return qs ? `${base}?${qs}` : base;
}

export default function ExchangeToolbar({ sp, locale }: { sp: ExchangeSearchParams; locale: string }) {
  const isRu = locale === 'ru';
  const base = `/${locale}/exchanges`;

  const activeType = sp.type && (TYPES as readonly string[]).includes(sp.type) ? sp.type : undefined;
  const activeSort = SORTS.find(s => s.value === sp.sort) ?? SORTS[0];
  const selectedProducts = toArray(sp.product);
  const hasLicense = sp.license === '1';
  const activeFilterCount = selectedProducts.length + (hasLicense ? 1 : 0) + (sp.minYear ? 1 : 0) + (sp.maxYear ? 1 : 0) + (sp.minVolume ? 1 : 0);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
      <div className="flex gap-1 bg-card border border-border rounded-lg p-1">
        <Link
          href={hrefWith(base, sp, { type: undefined })}
          className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition-colors ${!activeType ? 'bg-accent text-white' : 'text-muted hover:text-foreground'}`}
        >
          {isRu ? 'Все' : 'All'}
        </Link>
        {TYPES.map(t => (
          <Link
            key={t}
            href={hrefWith(base, sp, { type: t })}
            className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition-colors ${activeType === t ? 'bg-accent text-white' : 'text-muted hover:text-foreground'}`}
          >
            {t}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <details className="relative">
          <summary className="cursor-pointer select-none list-none flex items-center gap-1.5 text-xs font-semibold border border-border rounded-lg px-3 py-2 bg-card text-foreground whitespace-nowrap">
            {isRu ? activeSort.ru : activeSort.en} <span className="text-muted">▾</span>
          </summary>
          <div className="absolute right-0 z-20 mt-1.5 w-56 bg-card border border-border rounded-lg shadow-xl py-1.5">
            {SORTS.map(s => (
              <Link
                key={s.value}
                href={hrefWith(base, sp, { sort: s.value === 'volume' ? undefined : s.value })}
                className={`block px-3.5 py-2 text-xs ${activeSort.value === s.value ? 'text-accent font-semibold' : 'text-foreground hover:bg-[var(--card-hover)]'}`}
              >
                {isRu ? s.ru : s.en}
              </Link>
            ))}
          </div>
        </details>

        <details className="relative" open={activeFilterCount > 0 || undefined}>
          <summary className="cursor-pointer select-none list-none flex items-center gap-1.5 text-xs font-semibold border border-border rounded-lg px-3 py-2 bg-card text-foreground whitespace-nowrap">
            <span aria-hidden>⚙</span> {isRu ? 'Фильтры' : 'Filters'}
            {activeFilterCount > 0 && (
              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-accent text-white text-[10px] font-bold">{activeFilterCount}</span>
            )}
            <span className="text-muted">▾</span>
          </summary>
          <form
            action={base}
            className="static sm:absolute sm:z-20 sm:right-0 mt-3 sm:mt-1.5 w-full sm:w-[600px] sm:max-w-[80vw] bg-card border border-border rounded-xl p-5 sm:shadow-xl"
          >
            {activeType && <input type="hidden" name="type" value={activeType} />}
            {sp.sort && <input type="hidden" name="sort" value={sp.sort} />}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div>
                <h4 className="text-[10px] uppercase tracking-wide text-muted mb-2 font-bold">{isRu ? 'Продукты' : 'Products'}</h4>
                <div className="flex flex-col gap-1.5">
                  {PRODUCT_CATEGORIES.map(p => (
                    <label key={p.value} className="flex items-center gap-2 text-xs text-foreground cursor-pointer">
                      <input type="checkbox" name="product" value={p.value} defaultChecked={selectedProducts.includes(p.value)} className="accent-accent" />
                      {isRu ? p.labelRu : p.labelEn}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-[10px] uppercase tracking-wide text-muted mb-2 font-bold">{isRu ? 'Лицензии' : 'Licences'}</h4>
                <label className="flex items-center gap-2 text-xs text-foreground cursor-pointer">
                  <input type="checkbox" name="license" value="1" defaultChecked={hasLicense} className="accent-accent" />
                  {isRu ? 'Есть регуляторная лицензия' : 'Has a regulatory licence'}
                </label>
              </div>
              <div>
                <h4 className="text-[10px] uppercase tracking-wide text-muted mb-2 font-bold">{isRu ? 'Год основания' : 'Founded year'}</h4>
                <div className="flex items-center gap-1.5">
                  <input type="number" name="minYear" placeholder={isRu ? 'От' : 'From'} defaultValue={sp.minYear} className="w-full bg-background border border-border rounded-lg px-2 py-1.5 text-xs text-foreground" />
                  <input type="number" name="maxYear" placeholder={isRu ? 'До' : 'To'} defaultValue={sp.maxYear} className="w-full bg-background border border-border rounded-lg px-2 py-1.5 text-xs text-foreground" />
                </div>
              </div>
              <div>
                <h4 className="text-[10px] uppercase tracking-wide text-muted mb-2 font-bold">{isRu ? 'Мин. объём, $ млн' : 'Min volume, $M'}</h4>
                <input type="number" name="minVolume" placeholder="100" defaultValue={sp.minVolume} className="w-full bg-background border border-border rounded-lg px-2 py-1.5 text-xs text-foreground" />
              </div>
            </div>

            <div className="flex items-center justify-end gap-4 mt-5 pt-4 border-t border-border">
              {activeFilterCount > 0 && (
                <Link
                  href={hrefWith(base, sp, { product: undefined, license: undefined, minYear: undefined, maxYear: undefined, minVolume: undefined })}
                  className="text-xs text-muted hover:text-foreground"
                >
                  {isRu ? 'Сбросить' : 'Reset'}
                </Link>
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
