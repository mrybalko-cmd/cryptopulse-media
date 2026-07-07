import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

const BASE = 'https://cryptopulse.media';

async function pingIndexNow(urls: string[]) {
  const key = process.env.INDEXNOW_KEY;
  if (!key || urls.length === 0) return;

  try {
    await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host: 'cryptopulse.media',
        key,
        keyLocation: `${BASE}/${key}.txt`,
        urlList: urls,
      }),
      signal: AbortSignal.timeout(5000),
    });
  } catch {
    // IndexNow ping is best-effort — never block revalidation
  }
}

async function pingGoogleSitemap() {
  try {
    await fetch(
      `https://www.google.com/ping?sitemap=${encodeURIComponent(`${BASE}/news-sitemap.xml`)}`,
      { signal: AbortSignal.timeout(5000) }
    );
  } catch {
    // best-effort
  }
}

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const { type, slug, locale } = body;

  const urlsToIndex: string[] = [];

  if (type === 'article' && slug) {
    if (locale) {
      revalidatePath(`/${locale}/articles/${slug}`);
      revalidatePath(`/${locale}`, 'page');
      urlsToIndex.push(`${BASE}/${locale}/articles/${slug}`);
    } else {
      revalidatePath('/ru/articles/[slug]', 'page');
      revalidatePath('/en/articles/[slug]', 'page');
      revalidatePath('/ru', 'page');
      revalidatePath('/en', 'page');
      urlsToIndex.push(`${BASE}/ru/articles/${slug}`, `${BASE}/en/articles/${slug}`);
    }
    revalidatePath('/ru/articles', 'page');
    revalidatePath('/en/articles', 'page');
    revalidatePath('/ru/ai', 'page');
    revalidatePath('/en/ai', 'page');
  } else if (type === 'news' && slug) {
    if (locale) {
      revalidatePath(`/${locale}/news/${slug}`);
      revalidatePath(`/${locale}`, 'page');
      urlsToIndex.push(`${BASE}/${locale}/news/${slug}`);
    } else {
      revalidatePath('/ru/news/[slug]', 'page');
      revalidatePath('/en/news/[slug]', 'page');
      revalidatePath('/ru', 'page');
      revalidatePath('/en', 'page');
      urlsToIndex.push(`${BASE}/ru/news/${slug}`, `${BASE}/en/news/${slug}`);
    }
    revalidatePath('/ru/news', 'page');
    revalidatePath('/en/news', 'page');
    revalidatePath('/ru/ai', 'page');
    revalidatePath('/en/ai', 'page');
  } else {
    revalidatePath('/', 'layout');
  }

  // Ping in background — don't await so revalidate response is instant
  if (urlsToIndex.length > 0) {
    void Promise.all([pingIndexNow(urlsToIndex), pingGoogleSitemap()]);
  }

  return NextResponse.json({ revalidated: true, pinged: urlsToIndex, at: new Date().toISOString() });
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
