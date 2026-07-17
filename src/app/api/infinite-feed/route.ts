import { NextRequest, NextResponse } from 'next/server';
import { fetchPreviousItem } from '@/lib/sanity';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const type = searchParams.get('type');
  const locale = searchParams.get('locale') || 'en';
  const before = searchParams.get('before');

  if ((type !== 'article' && type !== 'news') || !before) {
    return NextResponse.json({ error: 'Invalid params' }, { status: 400 });
  }

  const item = await fetchPreviousItem(type, locale, before);
  return NextResponse.json(item, {
    headers: { 'Cache-Control': 'public, max-age=45, stale-while-revalidate=120' },
  });
}
