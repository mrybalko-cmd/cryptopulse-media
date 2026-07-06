import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
});

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const locale = searchParams.get('locale') || 'ru';
  const limit = Math.min(Number(searchParams.get('limit') || 12), 40);
  const offset = Math.max(Number(searchParams.get('offset') || 0), 0);

  try {
    const articles = await client.fetch(
      `*[_type == "article" && language == $locale && publishedAt <= now()]
      | order(publishedAt desc) [$offset...$end] {
        _id, title, excerpt, slug, publishedAt, readingTime, badge, views,
        "coverImage": coverImage.asset->url,
        "coverImageAlt": coverImage.alt
      }`,
      { locale, offset, end: offset + limit }
    );
    return NextResponse.json(articles, {
      headers: { 'Cache-Control': 'public, max-age=45, stale-while-revalidate=120' },
    });
  } catch (e) {
    console.error('[api/articles]', e);
    return NextResponse.json([], { status: 500 });
  }
}
