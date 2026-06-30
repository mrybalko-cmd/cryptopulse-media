import { createHash } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { createComment, countRecentCommentsByIpHash, isCommentingAllowed } from '@/lib/sanity';

const RATE_LIMIT_COUNT = 3;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

function getIpHash(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  return createHash('sha256').update(ip).digest('hex');
}

export async function POST(req: NextRequest) {
  let body: {
    authorName?: string;
    text?: string;
    targetId?: string;
    parentCommentId?: string;
    website?: string; // honeypot
    locale?: string;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 });
  }

  const isRu = body.locale === 'ru';

  // Honeypot: bots tend to fill every field. Pretend success so they don't
  // learn this field is being checked, but never write to Sanity.
  if (body.website) {
    return NextResponse.json({ ok: true });
  }

  const authorName = (body.authorName || '').trim();
  const text = (body.text || '').trim();
  const targetId = (body.targetId || '').trim();

  if (!authorName || authorName.length > 60) {
    return NextResponse.json({ error: 'invalid_name' }, { status: 400 });
  }
  if (!text || text.length < 2 || text.length > 2000) {
    return NextResponse.json({ error: 'invalid_text' }, { status: 400 });
  }
  if (!targetId) {
    return NextResponse.json({ error: 'invalid_target' }, { status: 400 });
  }
  if (!(await isCommentingAllowed(targetId))) {
    return NextResponse.json({ error: 'comments_disabled' }, { status: 403 });
  }

  const ipHash = getIpHash(req);
  const sinceISO = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString();
  const recentCount = await countRecentCommentsByIpHash(ipHash, sinceISO);
  if (recentCount >= RATE_LIMIT_COUNT) {
    return NextResponse.json(
      { error: 'rate_limited', message: isRu ? 'Слишком много комментариев, попробуй позже.' : 'Too many comments — try again later.' },
      { status: 429 }
    );
  }

  try {
    await createComment({
      authorName,
      text,
      targetId,
      parentCommentId: body.parentCommentId?.trim() || undefined,
      ipHash,
    });
  } catch {
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
