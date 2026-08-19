import { NextRequest, NextResponse } from 'next/server';
import { incrementViews } from '@/lib/sanity';

export async function POST(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
    }
    // Новое значение уходит обратно клиенту: страница отдаётся из кэша и
    // своего же просмотра читатель иначе не увидит ещё несколько минут.
    const views = await incrementViews(id);
    return NextResponse.json({ ok: true, views }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
