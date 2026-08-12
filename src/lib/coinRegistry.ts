// Every coin page in one table: the CoinGecko id we query, the ticker, and the
// brand colour the page's glass takes its glow from. Twenty-four pages used to
// carry this inline, each in its own file, which is how three of them ended up
// pointing at the wrong coin's price feed.
export interface CoinMeta {
  id: string;
  symbol: string;
  name: string;
  /** Drives the page's ambient glow, so the 24 pages read as a family without
   *  needing 24 separate designs. */
  color: string;
  /** Previous name and ticker, shown as a note under the heading. A coin that
   *  rebrands keeps its slug — the URL is what other sites link to — so the
   *  old name has to live somewhere the reader can still find it. */
  formerly?: { name: string; symbol: string };
}

export const COIN_REGISTRY: Record<string, CoinMeta> = {
  ada: { id: 'cardano', symbol: 'ADA', name: 'Cardano', color: '#0033AD' },
  aptos: { id: 'aptos', symbol: 'APT', name: 'Aptos', color: '#06C0A9' },
  arbitrum: { id: 'arbitrum', symbol: 'ARB', name: 'Arbitrum', color: '#28A0F0' },
  avax: { id: 'avalanche-2', symbol: 'AVAX', name: 'Avalanche', color: '#E84142' },
  bch: { id: 'bitcoin-cash', symbol: 'BCH', name: 'Bitcoin Cash', color: '#8DC351' },
  bitcoin: { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', color: '#F7931A' },
  bnb: { id: 'binancecoin', symbol: 'BNB', name: 'BNB', color: '#F0B90B' },
  cosmos: { id: 'cosmos', symbol: 'ATOM', name: 'Cosmos Hub', color: '#2E3148' },
  doge: { id: 'dogecoin', symbol: 'DOGE', name: 'Dogecoin', color: '#C2A633' },
  dot: { id: 'polkadot', symbol: 'DOT', name: 'Polkadot', color: '#E6007A' },
  ethereum: { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', color: '#627EEA' },
  link: { id: 'chainlink', symbol: 'LINK', name: 'Chainlink', color: '#2A5ADA' },
  ltc: { id: 'litecoin', symbol: 'LTC', name: 'Litecoin', color: '#345D9D' },
  monero: { id: 'monero', symbol: 'XMR', name: 'Monero', color: '#FF6600' },
  near: { id: 'near', symbol: 'NEAR', name: 'NEAR Protocol', color: '#00C08B' },
  polygon: { id: 'polygon-ecosystem-token', symbol: 'POL', name: 'Polygon', color: '#8247E5' },
  shib: { id: 'shiba-inu', symbol: 'SHIB', name: 'Shiba Inu', color: '#FFA409' },
  solana: { id: 'solana', symbol: 'SOL', name: 'Solana', color: '#14F195' },
  stellar: { id: 'stellar', symbol: 'XLM', name: 'Stellar', color: '#7D00FF' },
  sui: { id: 'sui', symbol: 'SUI', name: 'Sui', color: '#4DA2FF' },
  // Rebranded from Toncoin (TON) in 2026. The slug stays `ton`: it is what
  // other sites link to, and the page notes the former name for anyone
  // arriving with the old one in mind.
  ton: { id: 'the-open-network', symbol: 'GRAM', name: 'Gram', color: '#0098EA', formerly: { name: 'Toncoin', symbol: 'TON' } },
  trx: { id: 'tron', symbol: 'TRX', name: 'TRON', color: '#EF0027' },
  uniswap: { id: 'uniswap', symbol: 'UNI', name: 'Uniswap', color: '#FF007A' },
  xrp: { id: 'ripple', symbol: 'XRP', name: 'XRP', color: '#23292F' },
};

export const COIN_SLUGS = Object.keys(COIN_REGISTRY);

export function coinMeta(slug: string): CoinMeta | null {
  return COIN_REGISTRY[slug] ?? null;
}
