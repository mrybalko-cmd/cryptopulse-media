// Our own Altcoin Season Index — no free public API exists for CoinMarketCap's
// or blockchaincenter.net's version (both require a paid key or scraping a
// client-rendered page), so this is computed independently from CoinGecko's
// free markets endpoint using the same underlying idea both of those trackers
// popularized: what share of the top market-cap coins have beaten Bitcoin's
// price performance over a trailing window.
//
// Window is 30 days (not CMC's 90) purely for API-cost reasons: CoinGecko's
// markets endpoint returns 30d change for the whole top-100 list in a single
// request via `price_change_percentage=30d`; a 90-day figure isn't available
// on that endpoint and would need one historical-chart call per coin (100+
// requests, well past the free tier's rate limit). This is disclosed on the
// page itself, not just here.

const EXCLUDED_IDS = new Set([
  // Stablecoins — a "coin" pegged to $1 can't meaningfully out/underperform
  // Bitcoin, so including them would just dilute the index toward whatever
  // BTC did (a flat 0% distorts the comparison).
  'tether', 'usd-coin', 'dai', 'first-digital-usd', 'usds', 'ethena-usde',
  'paypal-usd', 'true-usd', 'frax', 'usdd', 'fdusd', 'gemini-dollar',
  'binance-usd', 'paxos-standard', 'susds', 'usual-usd',
  // Asset-backed / wrapped / liquid-staking tokens — these track another
  // asset's price by design (often literally Bitcoin or Ethereum), so they
  // don't represent an independent "altcoin" bet.
  'wrapped-bitcoin', 'coinbase-wrapped-btc', 'weth', 'wrapped-steth',
  'staked-ether', 'wrapped-eeth', 'rocket-pool-eth', 'renbtc', 'huobi-btc',
  'tether-gold', 'pax-gold',
]);

export interface AltcoinSeasonCoin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  marketCapRank: number;
  change30d: number;
  marginVsBtc: number;
  beatsBtc: boolean;
}

export interface AltcoinSeasonData {
  index: number;
  classification: 'bitcoin' | 'neutral' | 'altcoin';
  btcChange30d: number;
  sampleSize: number;
  topOutperformers: AltcoinSeasonCoin[];
  topUnderperformers: AltcoinSeasonCoin[];
}

function classify(index: number): AltcoinSeasonData['classification'] {
  if (index >= 75) return 'altcoin';
  if (index <= 25) return 'bitcoin';
  return 'neutral';
}

export async function fetchAltcoinSeasonIndex(): Promise<AltcoinSeasonData | null> {
  try {
    const url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=150&page=1&sparkline=false&price_change_percentage=30d';
    const res = await fetch(url, { next: { revalidate: 28800 } }); // ~3x/day
    if (!res.ok) return null;
    const raw = await res.json();
    if (!Array.isArray(raw)) return null;

    const btc = raw.find((c: any) => c.id === 'bitcoin');
    if (!btc || typeof btc.price_change_percentage_30d_in_currency !== 'number') return null;
    const btcChange30d = btc.price_change_percentage_30d_in_currency;

    const alts: AltcoinSeasonCoin[] = raw
      .filter((c: any) =>
        c.id !== 'bitcoin' &&
        !EXCLUDED_IDS.has(c.id) &&
        typeof c.price_change_percentage_30d_in_currency === 'number'
      )
      .slice(0, 100)
      .map((c: any) => {
        const change30d = c.price_change_percentage_30d_in_currency;
        return {
          id: c.id,
          symbol: String(c.symbol).toUpperCase(),
          name: c.name,
          image: c.image,
          marketCapRank: c.market_cap_rank,
          change30d,
          marginVsBtc: change30d - btcChange30d,
          beatsBtc: change30d > btcChange30d,
        };
      });

    if (alts.length === 0) return null;

    const beatingCount = alts.filter(a => a.beatsBtc).length;
    const index = Math.round((beatingCount / alts.length) * 100);

    const sorted = [...alts].sort((a, b) => b.marginVsBtc - a.marginVsBtc);
    const topOutperformers = sorted.slice(0, 10);
    const topUnderperformers = sorted.slice(-10).reverse();

    return {
      index,
      classification: classify(index),
      btcChange30d,
      sampleSize: alts.length,
      topOutperformers,
      topUnderperformers,
    };
  } catch {
    return null;
  }
}
