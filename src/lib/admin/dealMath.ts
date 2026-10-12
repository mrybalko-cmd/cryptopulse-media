/**
 * Типы, подписи и арифметика учёта размещений — всё без обращений к базе.
 *
 * Самодостаточность здесь не вкус, а условие проверяемости: эти функции
 * считают одни и те же цифры для списка, формы и выгрузки, и их надо уметь
 * прогнать, не поднимая проект. Ни один импорт отсюда наружу не ведёт.
 */

export type DealCurrency = 'EUR' | 'USD' | 'USDT' | 'USDC';
export type DealSource = 'direct' | 'agency' | 'agent';
export type DealStatus = 'planned' | 'invoiced' | 'paid' | 'cancelled';

export type PlacementKind =
  | 'banner' | 'article' | 'news' | 'pr' | 'aiCard'
  | 'exchange' | 'newsletter' | 'social' | 'homeWidget' | 'other';

export interface Placement {
  _key?: string;
  kind: PlacementKind;
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
  fxToEur: number;
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

export interface DealMoney {
  /** Сумма размещений в валюте сделки. */
  gross: number;
  /** Комиссия агентству или агенту, в валюте сделки. */
  commission: number;
  /** Что остаётся нам, в валюте сделки. */
  net: number;
  /** То же в евро по курсу, зафиксированному датой сделки. */
  grossEur: number;
  netEur: number;
}

export function dealMoney(d: Pick<Deal, 'placements' | 'commissionPct' | 'fxToEur'>): DealMoney {
  const gross = (d.placements ?? []).reduce((s, p) => s + (Number(p?.amount) || 0), 0);
  const commission = (gross * (Number(d.commissionPct) || 0)) / 100;
  const net = gross - commission;
  const fx = Number(d.fxToEur) || 1;
  return {
    gross: round2(gross),
    commission: round2(commission),
    net: round2(net),
    grossEur: round2(gross * fx),
    netEur: round2(net * fx),
  };
}

export interface Totals {
  /** Сколько сделок вошло в расчёт. Отменённые не входят. */
  deals: number;
  placements: number;
  grossEur: number;
  commissionEur: number;
  netEur: number;
  /** Разрез по валютам — без пересчёта, в том, в чём платили. */
  byCurrency: { currency: DealCurrency; gross: number; net: number; deals: number }[];
  /** Разрез по видам размещения, в евро. */
  byKind: { kind: PlacementKind; label: string; amountEur: number; count: number }[];
  /** Разрез по источнику клиента, в евро. */
  bySource: { source: DealSource; label: string; netEur: number; deals: number }[];
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
  const kind = new Map<PlacementKind, { amountEur: number; count: number }>();
  const src = new Map<DealSource, { netEur: number; deals: number }>();
  let grossEur = 0, commissionEur = 0, netEur = 0, placements = 0;

  for (const d of live) {
    const m = dealMoney(d);
    grossEur += m.grossEur;
    commissionEur += round2(m.commission * (Number(d.fxToEur) || 1));
    netEur += m.netEur;
    placements += d.placements?.length ?? 0;

    const c = cur.get(d.currency) ?? { gross: 0, net: 0, deals: 0 };
    cur.set(d.currency, { gross: round2(c.gross + m.gross), net: round2(c.net + m.net), deals: c.deals + 1 });

    const s = src.get(d.source) ?? { netEur: 0, deals: 0 };
    src.set(d.source, { netEur: round2(s.netEur + m.netEur), deals: s.deals + 1 });

    const fx = Number(d.fxToEur) || 1;
    for (const p of d.placements ?? []) {
      const k = kind.get(p.kind) ?? { amountEur: 0, count: 0 };
      kind.set(p.kind, { amountEur: round2(k.amountEur + (Number(p.amount) || 0) * fx), count: k.count + 1 });
    }
  }

  return {
    deals: live.length,
    placements,
    grossEur: round2(grossEur),
    commissionEur: round2(commissionEur),
    netEur: round2(netEur),
    byCurrency: [...cur.entries()]
      .map(([currency, v]) => ({ currency, ...v }))
      .sort((a, b) => b.gross - a.gross),
    byKind: [...kind.entries()]
      .map(([k, v]) => ({ kind: k, label: PLACEMENT_LABEL[k] ?? k, ...v }))
      .sort((a, b) => b.amountEur - a.amountEur),
    bySource: [...src.entries()]
      .map(([s, v]) => ({ source: s, label: SOURCE_LABEL[s] ?? s, ...v }))
      .sort((a, b) => b.netEur - a.netEur),
  };
}

