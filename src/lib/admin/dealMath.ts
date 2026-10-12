/**
 * Типы, подписи и арифметика учёта размещений — всё без обращений к базе.
 *
 * Самодостаточность здесь не вкус, а условие проверяемости: эти функции
 * считают одни и те же цифры для списка, формы и выгрузки, и их надо уметь
 * прогнать, не поднимая проект. Ни один импорт отсюда наружу не ведёт.
 *
 * Базовая валюта отчёта — USDT: в ней приходит оплата, в ней живёт баланс, и
 * именно её цифру надо видеть первой. Евро остаётся второй, справочной
 * валютой, поэтому курсов в сделке два, и оба заморожены её датой:
 *
 *   `fxToUsdt`  — сколько USDT в одной единице валюты сделки;
 *   `usdtToEur` — сколько евро в одном USDT на дату сделки.
 *
 * Заморозка — не перестраховка. Курс на сегодня пересчитывает и закрытый
 * месяц: отчёт за сентябрь в октябре показал бы другую цифру, а сверять его
 * с банком пришлось бы той, что была.
 */

export type DealCurrency = 'USDT' | 'USDC' | 'USD' | 'EUR';
export type DealSource = 'direct' | 'agency' | 'agent';
export type DealStatus = 'planned' | 'invoiced' | 'paid' | 'cancelled';

export type PlacementKind =
  | 'banner' | 'article' | 'news' | 'pr' | 'aiCard'
  | 'exchange' | 'newsletter' | 'social' | 'homeWidget' | 'other';

export interface Placement {
  _key?: string;
  kind: PlacementKind;
  /** Своё название услуги. Заполнено — показывается вместо названия из списка. */
  customKind?: string;
  amount: number;
  url?: string;
  note?: string;
}

export interface Deal {
  _id: string;
  client: string;
  dealDate: string;
  source: DealSource;
  partner?: string;
  status: DealStatus;
  paidAt?: string;
  invoiceNo?: string;
  currency: DealCurrency;
  /** Курс валюты сделки к USDT. Для USDT, USD и USDC — единица. */
  fxToUsdt: number;
  /** Курс USDT к евро на дату сделки. Нужен только для справочной цифры. */
  usdtToEur: number;
  commissionPct: number;
  placements: Placement[];
  notes?: string;
}

export const PLACEMENT_LABEL: Record<PlacementKind, string> = {
  banner: 'Баннер',
  article: 'Статья',
  news: 'Новость',
  pr: 'Пакет PR',
  aiCard: 'Карточка в каталоге AI',
  exchange: 'Карточка биржи',
  newsletter: 'Рассылка',
  social: 'Пост в соцсетях',
  homeWidget: 'Виджет на главной',
  other: 'Другое',
};

/**
 * Как размещение называется на экране и в отчёте.
 *
 * Своё название важнее списка: услуга, которой в списке нет, иначе
 * схлопнулась бы в «Другое», и разрез по видам потерял бы именно ту строку,
 * ради которой её и завели.
 */
export const placementLabel = (p: Pick<Placement, 'kind' | 'customKind'>): string =>
  p.customKind?.trim() || PLACEMENT_LABEL[p.kind] || p.kind;

export const SOURCE_LABEL: Record<DealSource, string> = {
  direct: 'Прямой',
  agency: 'Через агентство',
  agent: 'Через агента',
};

export const STATUS_LABEL: Record<DealStatus, string> = {
  planned: 'Договорились',
  invoiced: 'Счёт выставлен',
  paid: 'Оплачено',
  cancelled: 'Отменено',
};

export type DealInput = Omit<Deal, '_id'>;

/* ── Деньги ───────────────────────────────────────────────────────── */

/** Округление до копеек в последний момент, а не на каждом шаге. */
const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;

const toUsdt = (d: Pick<Deal, 'fxToUsdt'>) => Number(d.fxToUsdt) || 1;
const toEur = (d: Pick<Deal, 'usdtToEur'>) => Number(d.usdtToEur) || 0;

export interface DealMoney {
  /** Сумма размещений в валюте сделки. */
  gross: number;
  /** Комиссия агентству или агенту, в валюте сделки. */
  commission: number;
  /** Что остаётся нам, в валюте сделки. */
  net: number;
  /** То же в USDT — в ней считается весь отчёт. */
  grossUsdt: number;
  commissionUsdt: number;
  netUsdt: number;
  /** И справочно в евро, по второму курсу сделки. */
  grossEur: number;
  netEur: number;
}

export function dealMoney(
  d: Pick<Deal, 'placements' | 'commissionPct' | 'fxToUsdt' | 'usdtToEur'>
): DealMoney {
  const gross = (d.placements ?? []).reduce((s, p) => s + (Number(p?.amount) || 0), 0);
  const commission = (gross * (Number(d.commissionPct) || 0)) / 100;
  const net = gross - commission;
  const u = toUsdt(d);
  const e = toEur(d);
  return {
    gross: round2(gross),
    commission: round2(commission),
    net: round2(net),
    grossUsdt: round2(gross * u),
    commissionUsdt: round2(commission * u),
    netUsdt: round2(net * u),
    grossEur: round2(gross * u * e),
    netEur: round2(net * u * e),
  };
}

export interface Totals {
  /** Сколько сделок вошло в расчёт. Отменённые не входят. */
  deals: number;
  placements: number;
  grossUsdt: number;
  commissionUsdt: number;
  netUsdt: number;
  /** То же в евро — вторая, справочная валюта. */
  grossEur: number;
  commissionEur: number;
  netEur: number;
  /** Счёт выставлен, деньги не пришли. Отдельно, потому что это к взысканию. */
  unpaid: { usdt: number; eur: number; count: number };
  /** Разрез по валютам — без пересчёта, в том, в чём платили. */
  byCurrency: { currency: DealCurrency; gross: number; net: number; deals: number }[];
  /** Разрез по видам размещения, в USDT. Своё название — отдельной строкой. */
  byKind: { label: string; amountUsdt: number; count: number }[];
  /** Разрез по источнику клиента, в USDT. */
  bySource: { source: DealSource; label: string; netUsdt: number; deals: number }[];
}

/**
 * Отменённые сделки не считаются нигде.
 *
 * Они остаются в списке, потому что помнить о сорвавшейся договорённости
 * полезно, но в деньгах их нет — иначе выручка за месяц окажется выше той,
 * что пришла на счёт, и расхождение заметят в самый неподходящий момент.
 */
export function totals(deals: Deal[]): Totals {
  const live = deals.filter(d => d.status !== 'cancelled');

  const cur = new Map<DealCurrency, { gross: number; net: number; deals: number }>();
  // Группируем по тому, что видит человек: своё название — своя строка.
  const kind = new Map<string, { amountUsdt: number; count: number }>();
  const src = new Map<DealSource, { netUsdt: number; deals: number }>();
  let grossUsdt = 0, commissionUsdt = 0, netUsdt = 0;
  let grossEur = 0, commissionEur = 0, netEur = 0, placements = 0;
  let unpaidUsdt = 0, unpaidEur = 0, unpaidCount = 0;

  for (const d of live) {
    const m = dealMoney(d);
    grossUsdt += m.grossUsdt;
    commissionUsdt += m.commissionUsdt;
    netUsdt += m.netUsdt;
    grossEur += m.grossEur;
    commissionEur += round2(m.commission * toUsdt(d) * toEur(d));
    netEur += m.netEur;
    placements += d.placements?.length ?? 0;

    if (d.status === 'invoiced') {
      unpaidUsdt += m.netUsdt;
      unpaidEur += m.netEur;
      unpaidCount += 1;
    }

    const c = cur.get(d.currency) ?? { gross: 0, net: 0, deals: 0 };
    cur.set(d.currency, { gross: round2(c.gross + m.gross), net: round2(c.net + m.net), deals: c.deals + 1 });

    const s = src.get(d.source) ?? { netUsdt: 0, deals: 0 };
    src.set(d.source, { netUsdt: round2(s.netUsdt + m.netUsdt), deals: s.deals + 1 });

    const u = toUsdt(d);
    for (const p of d.placements ?? []) {
      const label = placementLabel(p);
      const k = kind.get(label) ?? { amountUsdt: 0, count: 0 };
      kind.set(label, { amountUsdt: round2(k.amountUsdt + (Number(p.amount) || 0) * u), count: k.count + 1 });
    }
  }

  return {
    deals: live.length,
    placements,
    grossUsdt: round2(grossUsdt),
    commissionUsdt: round2(commissionUsdt),
    netUsdt: round2(netUsdt),
    grossEur: round2(grossEur),
    commissionEur: round2(commissionEur),
    netEur: round2(netEur),
    unpaid: { usdt: round2(unpaidUsdt), eur: round2(unpaidEur), count: unpaidCount },
    byCurrency: [...cur.entries()]
      .map(([currency, v]) => ({ currency, ...v }))
      .sort((a, b) => b.gross - a.gross),
    byKind: [...kind.entries()]
      .map(([label, v]) => ({ label, ...v }))
      .sort((a, b) => b.amountUsdt - a.amountUsdt),
    bySource: [...src.entries()]
      .map(([s, v]) => ({ source: s, label: SOURCE_LABEL[s] ?? s, ...v }))
      .sort((a, b) => b.netUsdt - a.netUsdt),
  };
}

/* ── График по месяцам ────────────────────────────────────────────── */

const MONTHS_SHORT = ['янв', 'фев', 'мар', 'апр', 'май', 'июн',
  'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];

export interface MonthBar {
  /** 2026-09 — и ключ строки, и то, по чему сверять. */
  key: string;
  label: string;
  grossUsdt: number;
  grossEur: number;
  deals: number;
}

/** Больше двух лет столбиками не читается, да и экран не резиновый. */
const MAX_BARS = 24;

/**
 * Поступления по месяцам периода — ряд для графика.
 *
 * Пустые месяцы остаются в ряду нулями. Выкинуть их было бы короче, но тогда
 * провал между сентябрём и декабрём выглядел бы как три подряд удачных
 * месяца, а это ровно то, что по графику и надо увидеть.
 */
export function monthlyGross(deals: Deal[], from: string, to: string): {
  bars: MonthBar[];
  /** Ряд пришлось обрезать слева: период длиннее двух лет. */
  trimmed: boolean;
} {
  const [fy, fm] = from.split('-').map(Number);
  const [ty, tm] = to.split('-').map(Number);
  if (!fy || !fm || !ty || !tm) return { bars: [], trimmed: false };

  const multiYear = fy !== ty;
  const acc = new Map<string, { grossUsdt: number; grossEur: number; deals: number }>();
  for (let y = fy, m = fm; y < ty || (y === ty && m <= tm); m === 12 ? (y++, m = 1) : m++) {
    acc.set(`${y}-${String(m).padStart(2, '0')}`, { grossUsdt: 0, grossEur: 0, deals: 0 });
  }

  for (const d of deals) {
    if (d.status === 'cancelled') continue;
    const key = (d.dealDate ?? '').slice(0, 7);
    const cell = acc.get(key);
    if (!cell) continue;
    const m = dealMoney(d);
    cell.grossUsdt = round2(cell.grossUsdt + m.grossUsdt);
    cell.grossEur = round2(cell.grossEur + m.grossEur);
    cell.deals += 1;
  }

  const all = [...acc.entries()].map(([key, v]) => {
    const mon = MONTHS_SHORT[Number(key.slice(5)) - 1] ?? key;
    return { key, label: multiYear ? `${mon} ${key.slice(2, 4)}` : mon, ...v };
  });

  return {
    bars: all.length > MAX_BARS ? all.slice(-MAX_BARS) : all,
    trimmed: all.length > MAX_BARS,
  };
}
