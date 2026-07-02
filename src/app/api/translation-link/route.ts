import { NextRequest, NextResponse } from 'next/server';
import { fetchArticleBySlug, fetchNewsBySlug } from '@/lib/sanity';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type');
  const slug = searchParams.get('slug');
  const locale = searchParams.get('locale');

  if (!slug || !locale || (type !== 'articles' && type !== 'news')) {
    return NextResponse.json({ href: null });
  }

  try {
    const doc = type === 'news' ? await fetchNewsBySlug(slug, locale) : await fetchArticleBySlug(slug, locale);
    const translation = doc?.translation;
    const href = translation ? `/${translation.language}/${type}/${translation.slug}` : null;
    return NextResponse.json({ href });
  } catch {
    return NextResponse.json({ href: null });
  }
}
