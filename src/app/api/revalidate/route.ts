import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const { type, slug, locale } = body;

  if (type === 'article' && slug) {
    if (locale) {
      revalidatePath(`/${locale}/articles/${slug}`);
    } else {
      revalidatePath('/ru/articles/[slug]', 'page');
      revalidatePath('/en/articles/[slug]', 'page');
    }
  } else if (type === 'news' && slug) {
    if (locale) {
      revalidatePath(`/${locale}/news/${slug}`);
    } else {
      revalidatePath('/ru/news/[slug]', 'page');
      revalidatePath('/en/news/[slug]', 'page');
    }
  } else {
    revalidatePath('/', 'layout');
  }

  return NextResponse.json({ revalidated: true, at: new Date().toISOString() });
}

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
  }

  const path = request.nextUrl.searchParams.get('path') || '/';
  revalidatePath(path);
  return NextResponse.json({ revalidated: true, path, at: new Date().toISOString() });
}
