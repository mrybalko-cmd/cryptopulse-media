/**
 * Как материал попадает в новости биржи: её название есть в заголовке или тексте.
 * Ручного поля нет. Новая площадка работает сразу, по названию из карточки; правило
 * ниже нужно только там, где название двусмысленно или в текстах пишется иначе.
 * Правила проверены на всех материалах сайта 09.11.2026.
 */

/** Границы слова. \b тут не годится: он не знает кириллицу. */
const NOT_WORD_BEFORE = '(?<![\\p{L}\\p{N}])';
const NOT_WORD_AFTER = '(?![\\p{L}\\p{N}])';

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function wordRegExp(term: string): RegExp {
  return new RegExp(`${NOT_WORD_BEFORE}${escapeRegExp(term)}${NOT_WORD_AFTER}`, 'iu');
}

/** Название в карточке длиннее того, как площадку называют в текстах, или у неё было старое имя. */
const TERMS_BY_SLUG: Record<string, string[]> = {
  'crypto-com': ['Crypto.com'],
  htx: ['HTX', 'Huobi'],
  'saxo-bank': ['Saxo'],
  'interactive-brokers': ['Interactive Brokers', 'IBKR'],
};

const GEMINI_PEERS = 'Coinbase|Kraken|Binance|OKX|Bitstamp|Robinhood|Crypto\\.com|Bullish';
const GATE_PEERS = 'Coinbase|Bybit|OKX|KuCoin|Kraken|MEXC|Binance|Bitget|Bithumb|Coinone|HTX';
const WINKLEVOSS = '(?:Winklevoss|Винклвосс|Уинклвосс)\\p{L}*';

/**
 * Само слово здесь ничего не доказывает, поэтому материал берём только по контексту.
 * Gemini на сайте почти всегда модель Google: отсеивается 103 материала из 115. Gate бывает
 * обычным словом: quantum gate, efficacy gate; регистр в этом правиле важен.
 */
const CONTEXT_BY_SLUG: Record<string, RegExp> = {
  gemini: new RegExp(
    [
      'Gemini\\s+Space\\s+Station',
      'Gemini\\s+(?:Trust|Exchange|Earn|Titan|Dollar|Credit\\s+Card)',
      '\\bGEMI\\b',
      '\\bGUSD\\b',
      '[Ee]xchanges?\\s+Gemini',
      'Gemini\\s+exchange',
      '(?:бирж\\p{L}*|платформ\\p{L}*)\\s+Gemini',
      `${WINKLEVOSS}[^.]{0,80}Gemini`,
      `Gemini[^.]{0,80}${WINKLEVOSS}`,
      `(?:${GEMINI_PEERS}),?\\s+(?:(?:and|or|и|или)\\s+)?Gemini${NOT_WORD_AFTER}`,
      `Gemini,?\\s+(?:(?:and|or|и|или)\\s+)?(?:${GEMINI_PEERS})`,
    ].join('|'),
    'u',
  ),
  gate: new RegExp(
    [
      'Gate\\.(?:io|com)',
      `[Ee]xchange\\s+Gate${NOT_WORD_AFTER}`,
      'Gate\\s+exchange',
      `бирж\\p{L}*\\s+Gate${NOT_WORD_AFTER}`,
      'Gate\\s+(?:CEO|founder|DexBuilder|Ventures)',
      `(?:CEO|глав\\p{L}+|основател\\p{L}+)\\s+Gate${NOT_WORD_AFTER}`,
      `(?:${GATE_PEERS})[,:]?\\s+Gate${NOT_WORD_AFTER}`,
      'Gate[,:]\\s+(?:KuCoin|Kraken|MEXC|Bitget|OKX|Bybit|HTX|Coinone|\\d)',
    ].join('|'),
    'u',
  ),
};

/** Материалы о самом разделе бирж перечисляют все площадки подряд и новостями о них не являются. */
const NOT_VENUE_NEWS = new Set(['cryptopulse-razdel-birzhi-kak-ustroen', 'cryptopulse-exchanges-section-explained']);

export function isVenueNews(slug: string): boolean {
  return !NOT_VENUE_NEWS.has(slug);
}

export interface MentionRule {
  /** Слова для предварительного отбора в запросе к Sanity. */
  terms: string[];
  /** Название стоит в этом тексте как слово. */
  named: (text: string) => boolean;
  /** Этот текст действительно про площадку. */
  isMention: (text: string) => boolean;
}

export function mentionRule(name: string, slug: string): MentionRule {
  const terms = TERMS_BY_SLUG[slug] ?? [name];
  const words = terms.map(wordRegExp);
  const named = (text: string) => words.some(word => word.test(text));
  const context = CONTEXT_BY_SLUG[slug];
  return {
    terms,
    named,
    isMention: context ? (text: string) => named(text) && context.test(text) : named,
  };
}

/** Ссылка на нашу страницу площадки или на её сайт: для двусмысленных названий это такой же контекст. */
export function linksToVenue(
  hrefs: (string | null)[] | null | undefined,
  slugs: string[],
  domain: string | null,
): boolean {
  return (hrefs ?? []).some(href => {
    if (!href) return false;
    if (slugs.some(slug => new RegExp(`/exchanges/${escapeRegExp(slug)}(?:[/?#]|$)`).test(href))) return true;
    if (!domain) return false;
    try {
      return new URL(href).hostname.replace(/^www\./, '') === domain;
    } catch {
      return false;
    }
  });
}

/** Для блока на странице площадки: сначала материалы с её названием в заголовке, внутри по дате. */
export function featuredMentions<T extends { inTitle: boolean }>(mentions: T[], count: number): T[] {
  return [...mentions.filter(m => m.inTitle), ...mentions.filter(m => !m.inTitle)].slice(0, count);
}

export const EXCHANGE_NEWS_PAGE_SIZE = 20;

export function exchangeNewsPageCount(total: number): number {
  return Math.max(1, Math.ceil(total / EXCHANGE_NEWS_PAGE_SIZE));
}
