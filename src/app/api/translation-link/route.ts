import { NextRequest, NextResponse } from 'next/server';
import { fetchArticleBySlug, fetchNewsBySlug, fetchExchangeBySlug } from '@/lib/sanity';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type');
  const slug = searchParams.get('slug');
  const locale = searchParams.get('locale');

  if (!slug || !locale || (type !== 'articles' && type !== 'news' && type !== 'exchanges')) {
    return NextResponse.json({ href: null });
  }

  try {
    // Exchange documents aren't split per language like article/news — one
    // doc holds both slugRu and slugEn, so the "translation" is just the
    // other locale's slug field on the same record, not a separate lookup.
    if (type === 'exchanges') {
      const doc = await fetchExchangeBySlug(slug, locale);
      const otherLocale = locale === 'ru' ? 'en' : 'ru';
      const otherSlug = otherLocale === 'ru' ? doc?.slugRu : doc?.slugEn;
      return NextResponse.json({ href: otherSlug ? `/${otherLocale}/exchanges/${otherSlug}` : null });
    }

    const doc = type === 'news' ? await fetchNewsBySlug(slug, locale) : await fetchArticleBySlug(slug, locale);
    const translation = doc?.translation;
    const href = translation ? `/${translation.language}/${type}/${translation.slug}` : null;
    return NextResponse.json({ href });
  } catch {
    return NextResponse.json({ href: null });
  }
}
