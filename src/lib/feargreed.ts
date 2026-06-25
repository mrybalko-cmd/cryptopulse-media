export interface FearGreedData {
  value: number;
  classification: string;
}

export async function fetchFearGreedIndex(): Promise<FearGreedData | null> {
  try {
    const res = await fetch('https://api.alternative.me/fng/?limit=1', { next: { revalidate: 3600 } });
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
