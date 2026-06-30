export interface FiatCurrency {
  code: string;
  flag: string;
  name: { ru: string; en: string };
}

export interface CryptoCurrency {
  id: string;
  symbol: string;
  name: { ru: string; en: string };
}

// 20 most-traded fiat currencies (CoinGecko vs_currency codes).
export const FIAT_CURRENCIES: FiatCurrency[] = [
  { code: 'usd', flag: '🇺🇸', name: { ru: 'Доллар США', en: 'US Dollar' } },
  { code: 'eur', flag: '🇪🇺', name: { ru: 'Евро', en: 'Euro' } },
  { code: 'gbp', flag: '🇬🇧', name: { ru: 'Фунт стерлингов', en: 'British Pound' } },
  { code: 'jpy', flag: '🇯🇵', name: { ru: 'Японская иена', en: 'Japanese Yen' } },
  { code: 'cny', flag: '🇨🇳', name: { ru: 'Китайский юань', en: 'Chinese Yuan' } },
  { code: 'chf', flag: '🇨🇭', name: { ru: 'Швейцарский франк', en: 'Swiss Franc' } },
  { code: 'cad', flag: '🇨🇦', name: { ru: 'Канадский доллар', en: 'Canadian Dollar' } },
  { code: 'aud', flag: '🇦🇺', name: { ru: 'Австралийский доллар', en: 'Australian Dollar' } },
  { code: 'rub', flag: '🇷🇺', name: { ru: 'Российский рубль', en: 'Russian Ruble' } },
  { code: 'uah', flag: '🇺🇦', name: { ru: 'Украинская гривна', en: 'Ukrainian Hryvnia' } },
  { code: 'pln', flag: '🇵🇱', name: { ru: 'Польский злотый', en: 'Polish Zloty' } },
  { code: 'czk', flag: '🇨🇿', name: { ru: 'Чешская крона', en: 'Czech Koruna' } },
  { code: 'try', flag: '🇹🇷', name: { ru: 'Турецкая лира', en: 'Turkish Lira' } },
  { code: 'inr', flag: '🇮🇳', name: { ru: 'Индийская рупия', en: 'Indian Rupee' } },
  { code: 'brl', flag: '🇧🇷', name: { ru: 'Бразильский реал', en: 'Brazilian Real' } },
  { code: 'mxn', flag: '🇲🇽', name: { ru: 'Мексиканское песо', en: 'Mexican Peso' } },
  { code: 'zar', flag: '🇿🇦', name: { ru: 'Южноафриканский рэнд', en: 'South African Rand' } },
  { code: 'krw', flag: '🇰🇷', name: { ru: 'Южнокорейская вона', en: 'South Korean Won' } },
  { code: 'sek', flag: '🇸🇪', name: { ru: 'Шведская крона', en: 'Swedish Krona' } },
  { code: 'nok', flag: '🇳🇴', name: { ru: 'Норвежская крона', en: 'Norwegian Krone' } },
];

// Top 15 cryptocurrencies by market cap (CoinGecko coin ids).
export const CRYPTO_CURRENCIES: CryptoCurrency[] = [
  { id: 'bitcoin', symbol: 'BTC', name: { ru: 'Биткоин', en: 'Bitcoin' } },
  { id: 'ethereum', symbol: 'ETH', name: { ru: 'Эфириум', en: 'Ethereum' } },
  { id: 'tether', symbol: 'USDT', name: { ru: 'Tether', en: 'Tether' } },
  { id: 'binancecoin', symbol: 'BNB', name: { ru: 'BNB', en: 'BNB' } },
  { id: 'solana', symbol: 'SOL', name: { ru: 'Solana', en: 'Solana' } },
  { id: 'ripple', symbol: 'XRP', name: { ru: 'XRP', en: 'XRP' } },
  { id: 'usd-coin', symbol: 'USDC', name: { ru: 'USD Coin', en: 'USD Coin' } },
  { id: 'cardano', symbol: 'ADA', name: { ru: 'Cardano', en: 'Cardano' } },
  { id: 'dogecoin', symbol: 'DOGE', name: { ru: 'Dogecoin', en: 'Dogecoin' } },
  { id: 'the-open-network', symbol: 'TON', name: { ru: 'Toncoin', en: 'Toncoin' } },
  { id: 'tron', symbol: 'TRX', name: { ru: 'TRON', en: 'TRON' } },
  { id: 'avalanche-2', symbol: 'AVAX', name: { ru: 'Avalanche', en: 'Avalanche' } },
  { id: 'polkadot', symbol: 'DOT', name: { ru: 'Polkadot', en: 'Polkadot' } },
  { id: 'chainlink', symbol: 'LINK', name: { ru: 'Chainlink', en: 'Chainlink' } },
  { id: 'matic-network', symbol: 'MATIC', name: { ru: 'Polygon', en: 'Polygon' } },
];
