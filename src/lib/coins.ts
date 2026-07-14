// Shared coin metadata — single source of truth for /assets, the homepage
// price widgets, and anywhere else that needs a coin's CoinGecko id, symbol,
// or display icon. `available` marks whether a full guide page exists at
// /assets/[slug]; unavailable coins still get a price-only listing card.
export interface CoinMeta {
  slug: string;
  coingeckoId: string;
  symbol: string;
  icon: string;
  name: string;
  tagline: { ru: string; en: string };
  year: number;
  available: boolean;
}

export const COINS: CoinMeta[] = [
  {
    slug: 'bitcoin', coingeckoId: 'bitcoin', symbol: 'BTC', icon: '₿', name: 'Bitcoin',
    tagline: { ru: 'Первая криптовалюта, «цифровое золото»', en: 'The first cryptocurrency, "digital gold"' },
    year: 2009, available: true,
  },
  {
    slug: 'ethereum', coingeckoId: 'ethereum', symbol: 'ETH', icon: 'Ξ', name: 'Ethereum',
    tagline: { ru: 'Платформа смарт-контрактов №1', en: 'The #1 smart contract platform' },
    year: 2015, available: true,
  },
  {
    slug: 'solana', coingeckoId: 'solana', symbol: 'SOL', icon: '◎', name: 'Solana',
    tagline: { ru: 'Высокоскоростной блокчейн нового поколения', en: 'High-speed next-generation blockchain' },
    year: 2020, available: true,
  },
  {
    slug: 'xrp', coingeckoId: 'ripple', symbol: 'XRP', icon: '✕', name: 'XRP (Ripple)',
    tagline: { ru: 'Токен для международных платежей', en: 'Token for cross-border payments' },
    year: 2012, available: true,
  },
  {
    slug: 'bnb', coingeckoId: 'binancecoin', symbol: 'BNB', icon: '◈', name: 'BNB',
    tagline: { ru: 'Нативный токен биржи Binance и экосистемы BNB Chain', en: 'Native token of Binance exchange and BNB Chain ecosystem' },
    year: 2017, available: true,
  },
  {
    slug: 'doge', coingeckoId: 'dogecoin', symbol: 'DOGE', icon: 'Ð', name: 'Dogecoin',
    tagline: { ru: 'Мем-монета №1 — народная криптовалюта Илона Маска', en: 'The #1 meme coin — Elon Musk\'s people\'s cryptocurrency' },
    year: 2013, available: true,
  },
  {
    slug: 'ada', coingeckoId: 'cardano', symbol: 'ADA', icon: '₳', name: 'Cardano',
    tagline: { ru: 'Блокчейн третьего поколения с научным подходом к безопасности', en: 'Third-generation blockchain with a scientific approach to security' },
    year: 2017, available: true,
  },
  {
    slug: 'ton', coingeckoId: 'the-open-network', symbol: 'TON', icon: '💎', name: 'Toncoin',
    tagline: { ru: 'Блокчейн Telegram от братьев Дуров — 900M пользователей', en: 'Telegram blockchain from the Durov brothers — 900M users' },
    year: 2021, available: true,
  },
  {
    slug: 'avax', coingeckoId: 'avalanche-2', symbol: 'AVAX', icon: '🔺', name: 'Avalanche',
    tagline: { ru: 'Высокоскоростной L1 с уникальным снежным консенсусом', en: 'High-speed L1 with unique snowball consensus' },
    year: 2020, available: true,
  },
  {
    slug: 'trx', coingeckoId: 'tron', symbol: 'TRX', icon: '⬡', name: 'Tron',
    tagline: { ru: 'Главная сеть для USDT-переводов в мире', en: 'The world\'s main network for USDT transfers' },
    year: 2018, available: true,
  },
  {
    slug: 'dot', coingeckoId: 'polkadot', symbol: 'DOT', icon: '●', name: 'Polkadot',
    tagline: { ru: 'Интероперабельный мультичейн от создателя Solidity', en: 'Interoperable multi-chain from the creator of Solidity' },
    year: 2020, available: true,
  },
  {
    slug: 'link', coingeckoId: 'chainlink', symbol: 'LINK', icon: '⬡', name: 'Chainlink',
    tagline: { ru: 'Децентрализованные оракулы — инфраструктура 80% DeFi', en: 'Decentralized oracles — infrastructure for 80% of DeFi' },
    year: 2017, available: true,
  },
  {
    slug: 'ltc', coingeckoId: 'litecoin', symbol: 'LTC', icon: 'Ł', name: 'Litecoin',
    tagline: { ru: '«Серебро к биткоиновому золоту» — 12 лет надёжности', en: '"Silver to Bitcoin\'s gold" — 12 years of reliability' },
    year: 2011, available: true,
  },
  {
    slug: 'shib', coingeckoId: 'shiba-inu', symbol: 'SHIB', icon: '🐕', name: 'Shiba Inu',
    tagline: { ru: '«Убийца Dogecoin» с собственным L2 и 410T сожжёнными токенами', en: '"DOGE killer" with its own L2 and 410T burned tokens' },
    year: 2020, available: true,
  },
  {
    slug: 'polygon', coingeckoId: 'polygon-ecosystem-token', symbol: 'POL', icon: '🟣', name: 'Polygon',
    tagline: { ru: 'Сеть для масштабирования Ethereum, недавно перешедшая с MATIC на POL', en: 'Ethereum scaling network that recently migrated from MATIC to POL' },
    year: 2017, available: true,
  },
  {
    slug: 'uniswap', coingeckoId: 'uniswap', symbol: 'UNI', icon: '🦄', name: 'Uniswap',
    tagline: { ru: 'Крупнейшая децентрализованная биржа (DEX) на Ethereum', en: 'The largest decentralized exchange (DEX) on Ethereum' },
    year: 2018, available: true,
  },
  {
    slug: 'cosmos', coingeckoId: 'cosmos', symbol: 'ATOM', icon: '⚛', name: 'Cosmos',
    tagline: { ru: '«Интернет блокчейнов» — сеть независимых, но взаимосвязанных цепей', en: 'The "Internet of Blockchains" — a network of independent, interconnected chains' },
    year: 2019, available: true,
  },
  {
    slug: 'stellar', coingeckoId: 'stellar', symbol: 'XLM', icon: '⭐', name: 'Stellar',
    tagline: { ru: 'Сеть для быстрых и дешёвых международных платежей', en: 'A network for fast, cheap cross-border payments' },
    year: 2014, available: true,
  },
  {
    slug: 'monero', coingeckoId: 'monero', symbol: 'XMR', icon: 'ɱ', name: 'Monero',
    tagline: { ru: 'Главная приватная криптовалюта с полностью анонимными транзакциями', en: 'The leading privacy coin, with fully anonymous transactions' },
    year: 2014, available: true,
  },
  {
    slug: 'bch', coingeckoId: 'bitcoin-cash', symbol: 'BCH', icon: 'Ƀ', name: 'Bitcoin Cash',
    tagline: { ru: 'Форк Bitcoin 2017 года, сделавший ставку на большие блоки', en: 'The 2017 Bitcoin fork that bet on bigger blocks' },
    year: 2017, available: true,
  },
  {
    slug: 'arbitrum', coingeckoId: 'arbitrum', symbol: 'ARB', icon: '🔷', name: 'Arbitrum',
    tagline: { ru: 'Крупнейшее L2-решение для масштабирования Ethereum', en: 'The largest Layer 2 scaling solution for Ethereum' },
    year: 2023, available: true,
  },
  {
    slug: 'sui', coingeckoId: 'sui', symbol: 'SUI', icon: '💧', name: 'Sui',
    tagline: { ru: 'Высокоскоростной L1 от бывших разработчиков Meta/Diem', en: 'High-speed L1 built by former Meta/Diem engineers' },
    year: 2023, available: true,
  },
  {
    slug: 'near', coingeckoId: 'near', symbol: 'NEAR', icon: 'Ⓝ', name: 'NEAR Protocol',
    tagline: { ru: 'Шардированный блокчейн с прицелом на массовое ИИ- и веб-принятие', en: 'A sharded blockchain aiming for mainstream AI and web adoption' },
    year: 2020, available: true,
  },
  {
    slug: 'aptos', coingeckoId: 'aptos', symbol: 'APT', icon: '🅰', name: 'Aptos',
    tagline: { ru: 'L1 на языке Move, выросший из закрытого проекта Meta Diem', en: 'A Move-language L1 that grew out of Meta\'s shuttered Diem project' },
    year: 2022, available: true,
  },
];

export const COIN_IDS = COINS.map(c => c.coingeckoId);

export interface CoinPriceSnapshot {
  id: string;
  current_price: number;
  price_change_percentage_24h: number;
}

// Server-side price fetch, cached a full day — used by the homepage "Top
// assets" widgets and the /assets listing page. Deliberately daily (not the
// 60s cache the header ticker uses): this isn't a live-trading ticker, just
// "today's price" context next to editorial content, so a slow-changing
// cache keeps it cheap without needing client-side polling.
export async function fetchTopAssetPrices(coingeckoIds: string[]): Promise<Record<string, CoinPriceSnapshot>> {
  if (coingeckoIds.length === 0) return {};
  try {
    const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coingeckoIds.join(',')}&order=market_cap_desc&per_page=${coingeckoIds.length}&page=1&sparkline=false&price_change_percentage=24h`;
    const res = await fetch(url, { next: { revalidate: 86400 } });
    if (!res.ok) return {};
    const data: CoinPriceSnapshot[] = await res.json();
    return Object.fromEntries(data.map(c => [c.id, c]));
  } catch {
    return {};
  }
}
