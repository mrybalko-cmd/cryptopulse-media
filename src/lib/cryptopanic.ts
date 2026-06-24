const BASE = 'https://cryptopanic.com/api/free/v1';

interface FetchNewsOptions {
  limit?: number;
  filter?: string;
  currencies?: string;
}

export async function fetchNews({ limit = 20, filter, currencies }: FetchNewsOptions = {}) {
  const token = process.env.CRYPTOPANIC_API_KEY;
  if (!token) return [];

  const params = new URLSearchParams({
    auth_token: token,
    public: 'true',
    ...(filter && filter !== 'all' ? { filter } : {}),
    ...(currencies ? { currencies } : {}),
  });

  try {
    const res = await fetch(`${BASE}/posts/?${params}`, { next: { revalidate: 120 } });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.results || []).slice(0, limit);
  } catch {
    return [];
  }
}
