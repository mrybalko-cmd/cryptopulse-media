
// Server renders wait on these. A third-party API that stalls must not be
// able to hold a page open indefinitely, so every call carries a deadline.
const UPSTREAM_TIMEOUT_MS = 8000;
export interface FearGreedData {
  value: number;
  classification: string;
  /** Значение недельной давности. Отсутствует, если источник вернул короткий ответ. */
  weekAgo?: number;
}

/**
 * Берём восемь последних значений, а не одно.
 *
 * Статичное «74» не говорит ничего: 74 после 50 и 74 после 85 — это
 * противоположные состояния рынка. Восьмое значение в ответе — ровно неделя
 * назад, и разница между ним и сегодняшним даёт направление. Запрос тот же
 * самый, лишний трафик — семь строк JSON.
 */
export async function fetchFearGreedIndex(): Promise<FearGreedData | null> {
  try {
    const res = await fetch('https://api.alternative.me/fng/?limit=8', { signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS), next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const data = await res.json();
    const entry = data?.data?.[0];
    if (!entry) return null;
    const older = data?.data?.[7];
    const weekAgo = older ? Number(older.value) : NaN;
    return {
      value: Number(entry.value),
      classification: entry.value_classification,
      weekAgo: Number.isFinite(weekAgo) ? weekAgo : undefined,
    };
  } catch {
    return null;
  }
}
