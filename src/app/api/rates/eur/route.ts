import { NextResponse } from 'next/server';
import { fetchEurRates } from '@/lib/eurRates';

export async function GET() {
  const rates = await fetchEurRates();
  return NextResponse.json(
    { rates, updatedAt: new Date().toISOString() },
    { headers: { 'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=60' } }
  );
}
