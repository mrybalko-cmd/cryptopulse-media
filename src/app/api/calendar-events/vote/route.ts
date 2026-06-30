import { NextRequest, NextResponse } from 'next/server';
import { recordEventVote } from '@/lib/sanity';
import { getIpHash } from '@/lib/request';

export async function POST(req: NextRequest) {
  let body: { eventId?: string; vote?: string };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 });
  }

  const eventId = (body.eventId || '').trim();
  const vote = body.vote;

  if (!eventId || (vote !== 'like' && vote !== 'dislike')) {
    return NextResponse.json({ error: 'invalid_request' }, { status: 400 });
  }

  const ipHash = getIpHash(req);

  try {
    const result = await recordEventVote(eventId, vote, ipHash);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}
