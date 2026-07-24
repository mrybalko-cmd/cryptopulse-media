import { fetchExchangesWithCoingeckoIds, updateExchangeVolume } from './sanity';

interface CoinGeckoExchange {
  id: string;
  trade_volume_24h_btc: number;
}

async function fetchBtcUsdPrice(): Promise<number | null> {
  try {
    const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd', { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    const price = data?.bitcoin?.usd;
    return typeof price === 'number' ? price : null;
  } catch {
    return null;
  }
}

// CoinGecko reports exchange volume in BTC, not USD, so a current BTC price
// is needed to convert it — unlike /global (used for the Pulse index), which
// already returns a USD total directly.
async function fetchExchangeVolumesByCoingeckoId(): Promise<Map<string, number>> {
  const map = new Map<string, number>();
  try {
    const pages = await Promise.all(
      [1, 2].map(page =>
        fetch(`https://api.coingecko.com/api/v3/exchanges?per_page=100&page=${page}`, { cache: 'no-store' })
          .then(res => (res.ok ? res.json() : []))
          .catch(() => [])
      )
    );
    for (const page of pages) {
      for (const ex of page as CoinGeckoExchange[]) {
        if (ex?.id && typeof ex.trade_volume_24h_btc === 'number') {
          map.set(ex.id, ex.trade_volume_24h_btc);
        }
      }
    }
  } catch {
    // leave map empty — caller treats as "no data this run"
  }
  return map;
}

export interface ExchangeVolumeRefreshResult {
  updated: number;
  skipped: number;
  total: number;
}

// Runs once a day from the cron route. Only touches exchanges that have a
// coingeckoId set — an exchange without one simply keeps whatever volume24h
// it last had (or none), it's never zeroed out by a failed lookup.
export async function refreshExchangeVolumes(): Promise<ExchangeVolumeRefreshResult | null> {
  const [targets, btcUsd] = await Promise.all([fetchExchangesWithCoingeckoIds(), fetchBtcUsdPrice()]);
  if (targets.length === 0 || btcUsd == null) return null;

  const volumesBtc = await fetchExchangeVolumesByCoingeckoId();
  if (volumesBtc.size === 0) return null;

  let updated = 0;
  let skipped = 0;
  for (const target of targets) {
    const volBtc = volumesBtc.get(target.coingeckoId);
    if (volBtc == null) {
      skipped += 1;
      continue;
    }
    await updateExchangeVolume(target._id, Math.round(volBtc * btcUsd));
    updated += 1;
  }

  return { updated, skipped, total: targets.length };
}
