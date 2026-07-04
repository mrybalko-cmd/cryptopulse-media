import { NextRequest, NextResponse } from 'next/server';
import { fetchPopularContent } from '@/lib/sanity';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const locale = searchParams.get('locale') || 'en';
  const limit = parseInt(searchParams.get('limit') || '10', 10);

  const items = await fetchPopularContent(locale, limit);
  return NextResponse.json(items, {
    headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60' },
  });
}
