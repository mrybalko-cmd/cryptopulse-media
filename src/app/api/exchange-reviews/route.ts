import { NextRequest, NextResponse } from 'next/server';
import {
  createExchangeReview,
  countRecentExchangeReviewsByIpHash,
  isExchangeReviewingAllowed,
  fetchExchangeReviews,
} from '@/lib/sanity';
import { getIpHash } from '@/lib/request';

const RATE_LIMIT_COUNT = 3;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

export async function GET(req: NextRequest) {
  const exchangeId = req.nextUrl.searchParams.get('exchangeId');
  if (!exchangeId) return NextResponse.json([], { status: 200 });
  const reviews = await fetchExchangeReviews(exchangeId);
  return NextResponse.json(reviews, {
    headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60' },
  });
}

export async function POST(req: NextRequest) {
  let body: {
    authorName?: string;
    rating?: number;
    text?: string;
    exchangeId?: string;
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
  const exchangeId = (body.exchangeId || '').trim();
  const rating = Number(body.rating);

  if (!authorName || authorName.length > 60) {
    return NextResponse.json({ error: 'invalid_name' }, { status: 400 });
  }
  if (!text || text.length < 2 || text.length > 2000) {
    return NextResponse.json({ error: 'invalid_text' }, { status: 400 });
  }
  if (!exchangeId) {
    return NextResponse.json({ error: 'invalid_target' }, { status: 400 });
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ error: 'invalid_rating' }, { status: 400 });
  }
  if (!(await isExchangeReviewingAllowed(exchangeId))) {
    return NextResponse.json({ error: 'reviews_disabled' }, { status: 403 });
  }

  const ipHash = getIpHash(req);
  const sinceISO = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString();
  const recentCount = await countRecentExchangeReviewsByIpHash(ipHash, sinceISO);
  if (recentCount >= RATE_LIMIT_COUNT) {
    return NextResponse.json(
      { error: 'rate_limited', message: isRu ? 'Слишком много отзывов, попробуйте позже.' : 'Too many reviews — try again later.' },
      { status: 429 }
    );
  }

  try {
    await createExchangeReview({ authorName, rating, text, exchangeId, ipHash });
  } catch {
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
