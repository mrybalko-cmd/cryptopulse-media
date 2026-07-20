import { NextRequest, NextResponse } from 'next/server';
import { computeAndStorePulse } from '@/lib/pulse';

// Triggered once a day by Vercel Cron (see vercel.json). Vercel sends
// `Authorization: Bearer $CRON_SECRET` automatically when CRON_SECRET is set
// as a project env var — this just checks it matches, same pattern as the
// existing REVALIDATE_SECRET-gated /api/revalidate route.
export async function GET(request: NextRequest) {
  const auth = request.headers.get('authorization');
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = await computeAndStorePulse();
  if (!data) {
    return NextResponse.json({ ok: false, error: 'Could not compute pulse (source data unavailable)' }, { status: 502 });
  }
  return NextResponse.json({ ok: true, ...data });
}
