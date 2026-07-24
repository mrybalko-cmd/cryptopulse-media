import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { refreshExchangeVolumes } from '@/lib/exchangeVolumes';

// Triggered once a day by Vercel Cron (see vercel.json) — same
// Bearer-CRON_SECRET gate as /api/cron/pulse-snapshot.
export async function GET(request: NextRequest) {
  const auth = request.headers.get('authorization');
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const result = await refreshExchangeVolumes();
  if (!result) {
    return NextResponse.json({ ok: false, error: 'Could not refresh exchange volumes (source data unavailable)' }, { status: 502 });
  }

  revalidateTag('exchanges', { expire: 0 });
  return NextResponse.json({ ok: true, ...result });
}
