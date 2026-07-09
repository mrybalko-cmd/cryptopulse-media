import { NextRequest, NextResponse } from 'next/server';
import { setLike } from '@/lib/sanity';

export async function POST(request: NextRequest) {
  try {
    const { id, liked } = await request.json();
    if (!id || typeof id !== 'string' || typeof liked !== 'boolean') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }
    const likes = await setLike(id, liked);
    return NextResponse.json({ ok: likes !== null, likes });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
