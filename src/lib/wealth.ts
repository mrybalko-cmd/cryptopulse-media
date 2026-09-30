/**
 * Общая арифметика и форматирование калькулятора состояний.
 *
 * Лежит отдельно, потому что одни и те же числа считают трое: страница на
 * сервере, клиентский компонент со счётчиком и генератор картинки для шеринга.
 * Разойдись они хоть на разряд — человек поделится не тем числом, которое
 * видел на экране.
 */
import { billionaireById, type Billionaire } from './billionaires';

export const BTC_MAX_SUPPLY = 21_000_000;
export const HUMAN_LIFESPAN_YEARS = 80;
/** Дата генезис-блока биткоина: 3 января 2009. */
export const BITCOIN_GENESIS_MS = Date.UTC(2009, 0, 3);

export interface WealthState {
  /** id миллиардера */
  p: string;
  /** доход в долларах в месяц */
  inc: number;
  /** какая доля дохода уходит в накопления, в процентах */
  rate: number;
}

export const WEALTH_DEFAULTS: WealthState = { p: 'musk', inc: 1000, rate: 20 };

export const INCOME_MAX = 10_000_000;
export const RATE_MIN = 1;
export const RATE_MAX = 100;

function clamp(n: number, lo: number, hi: number) {
  return Math.min(Math.max(n, lo), hi);
}

/**
 * Разбор состояния из адресной решётки.
 *
 * Именно из решётки, а не из query-строки: параметры в запросе читает сервер,
 * а чтение запроса делает маршрут динамическим — страница теряет кэш и
 * пересобирается на каждый заход. То же самое мы уже проходили на странице
 * бирж. Решётка до сервера не доходит вовсе, страница остаётся статической, а
 * восстановлением занимается клиент после гидратации.
 */
export function parseWealthState(raw: string): WealthState {
  const q = new URLSearchParams(raw.replace(/^[#?]/, ''));
  const inc = Number(q.get('inc'));
  const rate = Number(q.get('rate'));
  return {
    p: billionaireById(q.get('p')).id,
    inc: Number.isFinite(inc) && inc > 0 ? clamp(Math.round(inc), 1, INCOME_MAX) : WEALTH_DEFAULTS.inc,
    rate: Number.isFinite(rate) ? clamp(Math.round(rate), RATE_MIN, RATE_MAX) : WEALTH_DEFAULTS.rate,
  };
}

/** Пустая строка, когда всё по умолчанию: чистый адрес лучше адреса с хвостом. */
export function serializeWealthState(s: WealthState): string {
  const q = new URLSearchParams();
  if (s.p !== WEALTH_DEFAULTS.p) q.set('p', s.p);
  if (s.inc !== WEALTH_DEFAULTS.inc) q.set('inc', String(s.inc));
  if (s.rate !== WEALTH_DEFAULTS.rate) q.set('rate', String(s.rate));
  return q.toString();
}

export interface WealthResult {
  billionaire: Billionaire;
  /** сколько уходит в накопления за год */
  savedPerYear: number;
  /** лет до состояния; Infinity, если не откладывается ничего */
  years: number;
}

export function computeWealth(state: WealthState): WealthResult {
  const billionaire = billionaireById(state.p);
  const savedPerYear = state.inc * 12 * (state.rate / 100);
  return {
    billionaire,
    savedPerYear,
    years: savedPerYear > 0 ? billionaire.netWorth / savedPerYear : Infinity,
  };
}

/* ── форматирование ─────────────────────────────────────────────────── */

export function localeTag(locale: string) {
  return locale === 'ru' ? 'ru-RU' : 'en-US';
}

export function formatInt(n: number, locale: string) {
  return new Intl.NumberFormat(localeTag(locale), { maximumFractionDigits: 0 }).format(n);
}

export function formatMoney(n: number, locale: string) {
  return `$${formatInt(n, locale)}`;
}

/** «$95 млрд» / «$95bn» — для скоростей и состояний, где разряды не нужны. */
export function formatCompactMoney(n: number, locale: string) {
  const isRu = locale === 'ru';
  const nf = (v: number, d: number) =>
    new Intl.NumberFormat(localeTag(locale), { minimumFractionDigits: d, maximumFractionDigits: d }).format(v);
  if (Math.abs(n) >= 1e9) return `$${nf(n / 1e9, n / 1e9 < 10 ? 1 : 0)}${isRu ? ' млрд' : 'bn'}`;
  if (Math.abs(n) >= 1e6) return `$${nf(n / 1e6, 1)}${isRu ? ' млн' : 'm'}`;
  if (Math.abs(n) >= 1e3) return `$${nf(n / 1e3, 1)}${isRu ? ' тыс.' : 'k'}`;
  return formatMoney(n, locale);
}

export function formatDecimal(n: number, locale: string, digits = 1) {
  return new Intl.NumberFormat(localeTag(locale), {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(n);
}

/** Число мельче десяти показываем с десятой: «0,8», а не «1». */
export function formatSmart(n: number, locale: string) {
  return n < 10 ? formatDecimal(n, locale, 1) : formatInt(n, locale);
}

/**
 * Русское склонение по последней цифре. Без него на карточке выходит
 * «395 833 333 лет» там, где нужно «года», и это первое, что видно.
 */
function ruPlural(n: number, one: string, few: string, many: string) {
  const abs = Math.abs(Math.round(n));
  if (abs % 100 >= 11 && abs % 100 <= 14) return many;
  const last = abs % 10;
  if (last === 1) return one;
  if (last >= 2 && last <= 4) return few;
  return many;
}

export function yearsWord(n: number, locale: string) {
  if (locale !== 'ru') return Math.round(n) === 1 ? 'year' : 'years';
  return ruPlural(n, 'год', 'года', 'лет');
}

export function timesWord(n: number, locale: string) {
  if (locale !== 'ru') return '×';
  return Number.isInteger(n) ? ruPlural(n, 'раз', 'раза', 'раз') : 'раза';
}
