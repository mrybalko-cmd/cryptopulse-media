import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_IDS = new Set([
  'bitcoin', 'ethereum', 'solana', 'binancecoin', 'ripple',
  'cardano', 'avalanche-2', 'polkadot', 'tron', 'litecoin',
  'shiba-inu', 'chainlink', 'the-open-network', 'dogecoin',
]);

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const ids = (searchParams.get('ids') || '').split(',').filter(id => ALLOWED_IDS.has(id)).join(',');
  const vs = 'usd';
  const perPage = Math.min(parseInt(searchParams.get('per_page') || '8', 10), 20);

  if (!ids) return NextResponse.json([], { status: 400 });

  const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${vs}&ids=${ids}&order=market_cap_desc&per_page=${perPage}&page=1&sparkline=false&price_change_percentage=24h`;
  const res = await fetch(url, { next: { revalidate: 60 } });

  if (!res.ok) return NextResponse.json([], { status: res.status });

  const data = await res.json();
  return NextResponse.json(data, {
    headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30' },
  });
}
