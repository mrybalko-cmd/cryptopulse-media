import type { ExchangeRaw } from './sanity';

// Fixed categories used only for the listing filter — exchanges' own product
// names stay free text (see exchange.ts schema), this just matches common
// naming so "Spot"/"Спот" from any exchange lands in the same bucket.
export const PRODUCT_CATEGORIES = [
  { value: 'spot', labelRu: 'Спот', labelEn: 'Spot', pattern: /spot|спот/i },
  { value: 'futures', labelRu: 'Фьючерсы', labelEn: 'Futures', pattern: /futures|derivative|фьючерс|деривати/i },
  { value: 'p2p', labelRu: 'P2P', labelEn: 'P2P', pattern: /p2p/i },
  { value: 'earn', labelRu: 'Earn / Стейкинг', labelEn: 'Earn / Staking', pattern: /earn|staking|стейкинг/i },
  { value: 'card', labelRu: 'Карта', labelEn: 'Card', pattern: /card|карта/i },
  { value: 'launchpad', labelRu: 'Launchpad', labelEn: 'Launchpad', pattern: /launchpad|ieo/i },
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number]['value'];

export function exchangeHasProductCategory(exchange: Pick<ExchangeRaw, 'products'>, category: string): boolean {
  const cat = PRODUCT_CATEGORIES.find(c => c.value === category);
  if (!cat || !exchange.products) return false;
  return exchange.products.some(p => cat.pattern.test(p.nameEn || '') || cat.pattern.test(p.nameRu || ''));
}

export function exchangeHasLicense(exchange: Pick<ExchangeRaw, 'badges'>): boolean {
  return Boolean(exchange.badges?.some(b => b.tone === 'license'));
}
