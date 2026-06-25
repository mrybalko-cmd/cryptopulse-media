import { NextRequest, NextResponse } from 'next/server';
import { searchContent } from '@/lib/sanity';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') || '';
  const locale = searchParams.get('locale') || 'ru';

  const results = await searchContent(q, locale);
  return NextResponse.json({ results });
}
