export interface EurRate {
  source: string;
  logo: string;
  asset: 'USDT' | 'USDC';
  rate: number;
  feePct: number;
  type: 'p2p' | 'cex';
  url: string;
}

// Rates for selling USDT/USDC into EUR — "you have stablecoins, you want
// euros". Binance's P2P search `tradeType` is from the requester's own
// perspective (SELL = you're selling, matched against counterparty ads
// whose own tradeType is BUY) — confirmed against the live endpoint
// directly, not assumed from docs. Bybit P2P was ruled out: its documented
// API requires an advertiser account, no public read-only access. Revolut
// and other neobanks have no public API for consumer FX rates at all.
async function fetchBinanceP2P(asset: 'USDT' | 'USDC'): Promise<EurRate | null> {
  try {
    const res = await fetch('https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ asset, fiat: 'EUR', tradeType: 'SELL', page: 1, rows: 1, payTypes: [] }),
      next: { revalidate: 120 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const price = data?.data?.[0]?.adv?.price;
    if (!price) return null;
    return {
      source: 'Binance P2P',
      logo: '/logos/binance.svg',
      asset,
      rate: Number(price),
      feePct: 0,
      type: 'p2p',
      url: `https://p2p.binance.com/en/trade/sell/${asset}?fiat=EUR`,
    };
  } catch {
    return null;
  }
}

// Same unofficial-but-public pattern as Binance P2P — this is the endpoint
// OKX's own web client calls, no API key, verified live before shipping.
async function fetchOkxP2P(asset: 'USDT' | 'USDC'): Promise<EurRate | null> {
  try {
    const params = new URLSearchParams({
      t: String(Date.now()),
      side: 'sell',
      paymentMethod: 'all',
      userType: 'all',
      hideOtcModityIdList: '',
      sortType: '',
      isAbleFilter: 'false',
      urgentOrder: 'false',
      isRegionQuick: 'false',
      quoteCurrency: 'EUR',
      baseCurrency: asset.toLowerCase(),
    });
    const res = await fetch(`https://www.okx.com/v3/c2c/tradingOrders/books?${params}`, { next: { revalidate: 120 } });
    if (!res.ok) return null;
    const data = await res.json();
    const price = data?.data?.sell?.[0]?.price;
    if (!price) return null;
    return {
      source: 'OKX P2P',
      logo: '/logos/okx.svg',
      asset,
      rate: Number(price),
      feePct: 0,
      type: 'p2p',
      url: `https://www.okx.com/p2p-markets/eur/sell-${asset.toLowerCase()}`,
    };
  } catch {
    return null;
  }
}

async function fetchBitstamp(asset: 'USDT' | 'USDC'): Promise<EurRate | null> {
  try {
    const pair = `${asset.toLowerCase()}eur`;
    const res = await fetch(`https://www.bitstamp.net/api/v2/ticker/${pair}/`, { next: { revalidate: 120 } });
    if (!res.ok) return null;
    const data = await res.json();
    const price = data?.last;
    if (!price) return null;
    return {
      source: 'Bitstamp',
      logo: '/logos/bitstamp.svg',
      asset,
      rate: Number(price),
      feePct: 0.3,
      type: 'cex',
      url: `https://www.bitstamp.net/markets/${asset.toLowerCase()}/eur/`,
    };
  } catch {
    return null;
  }
}

async function fetchKraken(asset: 'USDT' | 'USDC'): Promise<EurRate | null> {
  try {
    const pair = `${asset}EUR`;
    const res = await fetch(`https://api.kraken.com/0/public/Ticker?pair=${pair}`, { next: { revalidate: 120 } });
    if (!res.ok) return null;
    const data = await res.json();
    const result = data?.result?.[Object.keys(data?.result ?? {})[0]];
    const price = result?.c?.[0];
    if (!price) return null;
    return {
      source: 'Kraken',
      logo: '/logos/kraken.svg',
      asset,
      rate: Number(price),
      feePct: 0.25,
      type: 'cex',
      url: `https://www.kraken.com/prices/${asset.toLowerCase()}-eur`,
    };
  } catch {
    return null;
  }
}

async function fetchCoinbase(asset: 'USDT' | 'USDC'): Promise<EurRate | null> {
  try {
    const res = await fetch(`https://api.exchange.coinbase.com/products/${asset}-EUR/ticker`, {
      headers: { 'User-Agent': 'CryptoPulse.media rate comparison' },
      next: { revalidate: 120 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const price = data?.price;
    if (!price) return null;
    return {
      source: 'Coinbase Exchange',
      logo: '/logos/coinbase.svg',
      asset,
      rate: Number(price),
      feePct: 0.4,
      type: 'cex',
      url: `https://exchange.coinbase.com/trade/${asset}-EUR`,
    };
  } catch {
    return null;
  }
}

export async function fetchEurRates(): Promise<EurRate[]> {
  const results = await Promise.all([
    fetchBinanceP2P('USDT'),
    fetchOkxP2P('USDT'),
    fetchBitstamp('USDT'),
    fetchBitstamp('USDC'),
    fetchKraken('USDT'),
    fetchKraken('USDC'),
    fetchCoinbase('USDT'),
    fetchCoinbase('USDC'),
  ]);
  return results.filter((r): r is EurRate => r !== null).sort((a, b) => b.rate - a.rate);
}
