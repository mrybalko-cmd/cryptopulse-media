import Link from 'next/link';
import { PRODUCT_CATEGORIES } from '@/lib/exchangeFilters';

const TYPES = ['CEX', 'DEX', 'P2P'] as const;

export interface ExchangeFilterState {
  types: string[];
  products: string[];
  hasLicense: boolean;
  minYear?: number;
  maxYear?: number;
  minVolumeM?: number;
}

// Plain GET <form> — no client JS needed, every field round-trips through
// the URL (?type=CEX&product=spot&license=1&minYear=2015...). Same fields
// render both as the desktop rail and — wrapped in a <details> by the
// caller — as a collapsible panel on mobile.
function Fields({ state, locale }: { state: ExchangeFilterState; locale: string }) {
  const isRu = locale === 'ru';

  return (
    <>
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wide text-muted mb-2.5">{isRu ? 'Тип' : 'Type'}</h3>
        <div className="flex flex-col gap-2">
          {TYPES.map(t => (
            <label key={t} className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
              <input type="checkbox" name="type" value={t} defaultChecked={state.types.includes(t)} className="accent-accent" />
              {t}
            </label>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-border">
        <h3 className="text-xs font-bold uppercase tracking-wide text-muted mb-2.5">{isRu ? 'Продукты' : 'Products'}</h3>
        <div className="flex flex-col gap-2">
          {PRODUCT_CATEGORIES.map(p => (
            <label key={p.value} className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
              <input type="checkbox" name="product" value={p.value} defaultChecked={state.products.includes(p.value)} className="accent-accent" />
              {isRu ? p.labelRu : p.labelEn}
            </label>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-border">
        <h3 className="text-xs font-bold uppercase tracking-wide text-muted mb-2.5">{isRu ? 'Лицензии и юрисдикция' : 'Licences & jurisdiction'}</h3>
        <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
          <input type="checkbox" name="license" value="1" defaultChecked={state.hasLicense} className="accent-accent" />
          {isRu ? 'Есть регуляторная лицензия' : 'Has a regulatory licence'}
        </label>
      </div>

      <div className="pt-4 border-t border-border">
        <h3 className="text-xs font-bold uppercase tracking-wide text-muted mb-2.5">{isRu ? 'Год основания' : 'Founded year'}</h3>
        <div className="flex items-center gap-2">
          <input type="number" name="minYear" placeholder={isRu ? 'От' : 'From'} defaultValue={state.minYear} className="w-full bg-background border border-border rounded-lg px-2.5 py-1.5 text-sm text-foreground" />
          <span className="text-muted text-xs">—</span>
          <input type="number" name="maxYear" placeholder={isRu ? 'До' : 'To'} defaultValue={state.maxYear} className="w-full bg-background border border-border rounded-lg px-2.5 py-1.5 text-sm text-foreground" />
        </div>
      </div>

      <div className="pt-4 border-t border-border">
        <h3 className="text-xs font-bold uppercase tracking-wide text-muted mb-2.5">{isRu ? 'Мин. объём торгов, $ млн' : 'Min 24h volume, $M'}</h3>
        <input type="number" name="minVolume" placeholder="100" defaultValue={state.minVolumeM} className="w-full bg-background border border-border rounded-lg px-2.5 py-1.5 text-sm text-foreground" />
      </div>
    </>
  );
}

const hasAnyFilter = (s: ExchangeFilterState) =>
  s.types.length > 0 || s.products.length > 0 || s.hasLicense || s.minYear != null || s.maxYear != null || s.minVolumeM != null;

export default function ExchangeFilters({ state, locale, variant }: { state: ExchangeFilterState; locale: string; variant: 'rail' | 'mobile' }) {
  const isRu = locale === 'ru';
  const action = `/${locale}/exchanges`;

  if (variant === 'rail') {
    return (
      <form action={action} className="bg-card border border-border rounded-lg p-4 sticky top-[8rem] max-h-[calc(100vh-10rem)] overflow-y-auto flex flex-col gap-4">
        <Fields state={state} locale={locale} />
        <button type="submit" className="w-full bg-accent text-white text-sm font-semibold rounded-lg py-2 hover:opacity-90 transition-opacity">
          {isRu ? 'Применить' : 'Apply'}
        </button>
        {hasAnyFilter(state) && (
          <Link href={action} className="block text-center text-xs text-muted hover:text-foreground">
            {isRu ? 'Сбросить' : 'Reset'}
          </Link>
        )}
      </form>
    );
  }

  return (
    <details className="mb-6 bg-card border border-border rounded-lg overflow-hidden">
      <summary className="cursor-pointer select-none list-none flex items-center justify-between p-3.5">
        <span className="text-sm font-semibold text-foreground">{isRu ? 'Фильтры' : 'Filters'}</span>
        <span className="text-muted text-xs">▾</span>
      </summary>
      <form action={action} className="flex flex-col gap-4 p-4 pt-0 border-t border-border">
        <Fields state={state} locale={locale} />
        <button type="submit" className="w-full bg-accent text-white text-sm font-semibold rounded-lg py-2 hover:opacity-90 transition-opacity">
          {isRu ? 'Применить' : 'Apply'}
        </button>
        {hasAnyFilter(state) && (
          <Link href={action} className="block text-center text-xs text-muted hover:text-foreground">
            {isRu ? 'Сбросить' : 'Reset'}
          </Link>
        )}
      </form>
    </details>
  );
}
