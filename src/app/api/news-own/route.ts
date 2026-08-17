import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  // Reads go through Sanity's CDN. The plan allows 1,000,000 CDN requests
  // against 250,000 uncached ones, and with useCdn off every read was charged
  // to the small quota — 251.8k of 250k used, 4 of a million CDN requests.
  // Nothing here needs to be fresher than the CDN: results are wrapped in
  // unstable_cache for 300s anyway, and Sanity purges the CDN on publish.
  useCdn: true,
});

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const locale = searchParams.get('locale') || 'ru';
  const limit = Math.min(Number(searchParams.get('limit') || 20), 50);
  const offset = Math.max(Number(searchParams.get('offset') || 0), 0);

  try {
    const news = await client.fetch(
      `*[_type == "news" && language == $locale && publishedAt <= now()]
      | order(publishedAt desc) [$offset...$end] {
        _id, title, excerpt, slug, publishedAt, breaking, ownBadge, badge, topic, views, likes,
        "coverImage": coverImage.asset->url
      }`,
      { locale, offset, end: offset + limit }
    );
    return NextResponse.json(news, {
      headers: { 'Cache-Control': 'public, max-age=45, stale-while-revalidate=120' },
    });
  } catch (e) {
    console.error('[api/news-own]', e);
    return NextResponse.json([], { status: 500 });
  }
}
