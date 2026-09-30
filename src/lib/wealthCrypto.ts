import { fetchCoinMarket } from './coinMarket';
import { BTC_MAX_SUPPLY } from './wealth';

/**
 * Крипто-контекст калькулятора состояний: во сколько биткоинов укладывается
 * состояние и что из крупных монет человек мог бы выкупить целиком.
 *
 * Это единственный угол, которого нет ни у одного другого калькулятора
 * состояний, и ради него страница вообще живёт на крипто-издании.
 */
export interface WealthCrypto {
  btcPrice: number;
  /** Сколько биткоинов уже добыто. */
  btcCirculating: number;
  btcMarketCap: number;
  caps: { slug: string; symbol: string; name: string; marketCap: number }[];
  /** Когда обновлялись котировки. */
  updatedAt: string | null;
}

const PEERS = [
  { slug: 'solana', symbol: 'SOL', name: 'Solana' },
  { slug: 'doge', symbol: 'DOGE', name: 'Dogecoin' },
  { slug: 'ethereum', symbol: 'ETH', name: 'Ethereum' },
];

/**
 * Возвращает null, если биткоина нет: без цены весь крипто-блок бессмысленен,
 * и лучше его не рисовать вовсе, чем показать нули. Монеты-соседи могут
 * отсутствовать по одной — список просто станет короче.
 */
export async function fetchWealthCrypto(): Promise<WealthCrypto | null> {
  const [btc, ...peers] = await Promise.all([
    fetchCoinMarket('bitcoin'),
    ...PEERS.map((p) => fetchCoinMarket(p.slug)),
  ]);
  if (!btc || !btc.price) return null;

  return {
    btcPrice: btc.price,
    btcCirculating: btc.circulating ?? btc.marketCap / btc.price,
    btcMarketCap: btc.marketCap,
    caps: PEERS.map((p, i) => ({ ...p, marketCap: peers[i]?.marketCap ?? 0 })).filter((c) => c.marketCap > 0),
    updatedAt: btc.updatedAt ?? null,
  };
}

/** Доля от предельной эмиссии в 21 миллион — сколько биткоина это состояние. */
export function btcShare(wealth: number, btcPrice: number) {
  const coins = wealth / btcPrice;
  return { coins, pctOfCap: (coins / BTC_MAX_SUPPLY) * 100 };
}
