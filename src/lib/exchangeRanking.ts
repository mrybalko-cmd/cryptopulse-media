export interface Rankable {
  volume24h?: number | null;
}

/**
 * Место в рейтинге: только оборот за 24 часа. Платные размещения сюда не входят,
 * поэтому номер в таблице и на странице площадки всегда один и тот же.
 */
export function rankExchanges<T extends Rankable>(items: T[]): (T & { rank: number })[] {
  return [...items]
    .sort((a, b) => (b.volume24h ?? 0) - (a.volume24h ?? 0))
    .map((item, i) => ({ ...item, rank: i + 1 }));
}
