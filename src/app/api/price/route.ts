import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const ids = searchParams.get('ids');
  const vs = searchParams.get('vs_currencies') || 'usd';

  if (!ids) return NextResponse.json({ error: 'ids required' }, { status: 400 });

  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=${vs}`;
  const res = await fetch(url, { next: { revalidate: 60 } });

  if (!res.ok) return NextResponse.json({}, { status: res.status });

  const data = await res.json();
  return NextResponse.json(data, {
    headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30' },
  });
}
