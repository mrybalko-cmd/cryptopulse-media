
// Server renders wait on these. A third-party API that stalls must not be
// able to hold a page open indefinitely, so every call carries a deadline.
const UPSTREAM_TIMEOUT_MS = 8000;
export interface FearGreedData {
  value: number;
  classification: string;
}

export async function fetchFearGreedIndex(): Promise<FearGreedData | null> {
  try {
    const res = await fetch('https://api.alternative.me/fng/?limit=1', { signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS), next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const data = await res.json();
    const entry = data?.data?.[0];
    if (!entry) return null;
    return {
      value: Number(entry.value),
      classification: entry.value_classification,
    };
  } catch {
    return null;
  }
}
