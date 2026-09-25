import type { ExchangeRaw } from './sanity';
import { exchangeHasProductCategory, exchangeHasLicense, PRODUCT_CATEGORIES } from './exchangeFilters';
import { splitPinned } from './exchangeRanking';

/**
 * Состояние фильтров списка бирж.
 *
 * Живёт в решётке адреса, а не в параметрах запроса, и вот почему. Стоит
 * странице прочитать searchParams — и весь маршрут становится динамическим:
 * Vercel перестаёт её кэшировать, каждый заход робота рендерится заново и
 * попадает в счёт, а обход замедляется. Так и вышло: 25.09.2026 страница
 * бирж отдавалась с no-store и не обходилась Googlebot с 23 августа, тогда
 * как соседние разделы обходились нормально.
 *
 * Решётка на сервер не уходит вовсе, поэтому страница остаётся статической.
 * Заодно робот не плодит десяток адресов с параметрами, которые всё равно
 * закрыты каноникалом на чистый адрес и в индекс никогда не попадали
 * (проверено: /en/exchanges?type=DEX — «URL is unknown to Google»).
 *
 * Бирж шестнадцать, поэтому отбор в браузере ничего не стоит: весь список и
 * так приходит в HTML.
 */

export const EXCHANGE_TYPES = ['CEX', 'DEX', 'P2P'] as const;
export const EXCHANGE_SORTS = ['volume', 'year', 'alpha'] as const;

export type ExchangeSort = (typeof EXCHANGE_SORTS)[number];

export type ExchangeFilterState = {
  type?: string;
  sort: ExchangeSort;
  products: string[];
  license: boolean;
  minYear?: number;
  maxYear?: number;
  minVolumeM?: number;
};

export const EMPTY_FILTERS: ExchangeFilterState = {
  sort: 'volume',
  products: [],
  license: false,
};

const PRODUCT_VALUES: readonly string[] = PRODUCT_CATEGORIES.map(p => p.value);

function num(v: string | null): number | undefined {
  if (!v) return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

/** Разбирает и решётку, и старую строку запроса: формат один и тот же. */
export function parseFilters(raw: string): ExchangeFilterState {
  const p = new URLSearchParams(raw.replace(/^[#?]/, ''));
  const type = p.get('type');
  const sort = p.get('sort');
  return {
    type: type && (EXCHANGE_TYPES as readonly string[]).includes(type) ? type : undefined,
    sort: (EXCHANGE_SORTS as readonly string[]).includes(sort || '') ? (sort as ExchangeSort) : 'volume',
    products: p.getAll('product').filter(v => PRODUCT_VALUES.includes(v)),
    license: p.get('license') === '1',
    minYear: num(p.get('minYear')),
    maxYear: num(p.get('maxYear')),
    minVolumeM: num(p.get('minVolume')),
  };
}

/** Обратно в строку. Значения по умолчанию не пишем, чтобы адрес был коротким. */
export function serializeFilters(f: ExchangeFilterState): string {
  const p = new URLSearchParams();
  if (f.type) p.set('type', f.type);
  if (f.sort !== 'volume') p.set('sort', f.sort);
  for (const v of f.products) p.append('product', v);
  if (f.license) p.set('license', '1');
  if (f.minYear != null) p.set('minYear', String(f.minYear));
  if (f.maxYear != null) p.set('maxYear', String(f.maxYear));
  if (f.minVolumeM != null) p.set('minVolume', String(f.minVolumeM));
  return p.toString();
}

export function countActiveFilters(f: ExchangeFilterState): number {
  return f.products.length + (f.license ? 1 : 0)
    + (f.minYear != null ? 1 : 0) + (f.maxYear != null ? 1 : 0) + (f.minVolumeM != null ? 1 : 0);
}

/**
 * Отбор и порядок. Оплаченные размещения поднимаются НАД рейтингом, а не
 * сортируются внутрь него, чтобы нумерованный список всегда честно
 * соответствовал тому, что обещает заголовок.
 */
export function applyFilters(all: ExchangeRaw[], f: ExchangeFilterState) {
  const filtered = all.filter(e => {
    if (f.type && !e.type?.includes(f.type)) return false;
    if (f.products.length > 0 && !f.products.some(p => exchangeHasProductCategory(e, p))) return false;
    if (f.license && !exchangeHasLicense(e)) return false;
    if (f.minYear != null && (e.foundedYear ?? 0) < f.minYear) return false;
    if (f.maxYear != null && (e.foundedYear ?? 9999) > f.maxYear) return false;
    if (f.minVolumeM != null && (e.volume24h ?? 0) < f.minVolumeM * 1e6) return false;
    return true;
  });

  const { featured, rest: organic } = splitPinned(filtered);
  const sorted =
    f.sort === 'year'
      ? [...organic].sort((a, b) => (a.foundedYear ?? 9999) - (b.foundedYear ?? 9999))
      : f.sort === 'alpha'
        ? [...organic].sort((a, b) => a.name.localeCompare(b.name))
        : [...organic].sort((a, b) => (b.volume24h ?? 0) - (a.volume24h ?? 0));

  const ranked: (ExchangeRaw & { rank: number })[] = sorted.map((e, i) => ({ ...e, rank: i + 1 }));
  return { featured, ranked, shown: [...featured, ...ranked] };
}
