/**
 * Кнопка партнёра: типы и чистые помощники.
 *
 * Вынесено из `assetCta.ts` отдельным файлом потому, что витрина
 * (`AssetsExplorer`) — клиентский компонент. Импорт серверного модуля с
 * `unstable_cache` и клиентом Sanity утащил бы их в браузерный пакет.
 * Здесь нет ни одного серверного импорта, и файл безопасен для обеих сторон.
 */

export type CtaMode = 'buy' | 'sell' | 'both' | 'custom';

export interface AssetCtaPlaces {
  cards: boolean;
  table: boolean;
  page: boolean;
  sticky: boolean;
}

export interface AssetCta {
  coinSlug: string;
  mode: CtaMode;
  labelRu?: string | null;
  labelEn?: string | null;
  url: string;
  sellUrl?: string | null;
  partner?: string | null;
  color?: string | null;
  showAdLabel: boolean;
  language: 'all' | 'ru' | 'en';
  places: AssetCtaPlaces;
}

/**
 * Адрес с метками кампании.
 *
 * Метки дописываются здесь, а не руками в админке: редактор про них забудет,
 * а без них клики не отличить от баннерных в одном отчёте.
 */
export function ctaHref(url: string, coinSlug: string): string {
  try {
    const u = new URL(url);
    if (!u.searchParams.has('utm_source')) u.searchParams.set('utm_source', 'intokened');
    if (!u.searchParams.has('utm_medium')) u.searchParams.set('utm_medium', 'coin_button');
    if (!u.searchParams.has('utm_campaign')) u.searchParams.set('utm_campaign', coinSlug);
    return u.toString();
  } catch {
    return url;
  }
}

/**
 * Цвет надписи по яркости фона.
 *
 * Свободный выбор цвета в админке иначе даёт нечитаемые кнопки: белое по
 * жёлтому. Порог 0.42 подобран по нашей палитре — янтарный уходит в чёрный
 * текст, кирпичный остаётся с белым.
 */
export function inkOn(hex: string): string {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map(c => c + c).join('') : h;
  if (full.length !== 6 || /[^0-9a-fA-F]/.test(full)) return '#ffffff';
  const ch = (i: number) => {
    const v = parseInt(full.slice(i, i + 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  const lum = 0.2126 * ch(0) + 0.7152 * ch(2) + 0.0722 * ch(4);
  return lum > 0.42 ? '#111111' : '#ffffff';
}

/** Надписи кнопок для режима и языка. */
export function ctaLabels(
  cta: AssetCta,
  symbol: string,
  locale: string,
): { buy?: string; sell?: string } {
  const isRu = locale === 'ru';
  if (cta.mode === 'custom') {
    const own = (isRu ? cta.labelRu : cta.labelEn) || cta.labelEn || cta.labelRu || '';
    return { buy: own || (isRu ? 'Перейти' : 'Open') };
  }
  const buy = isRu ? `Купить ${symbol}` : `Buy ${symbol}`;
  const sell = isRu ? `Продать ${symbol}` : `Sell ${symbol}`;
  if (cta.mode === 'buy') return { buy };
  if (cta.mode === 'sell') return { sell };
  return { buy, sell };
}
