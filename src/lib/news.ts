import { fetchSanityNews, countSanityNews } from '@/lib/sanity';
import { SITE_NAME } from '@/lib/site';

export interface UnifiedNewsItem {
  id: string;
  title: string;
  excerpt?: string;
  imageUrl?: string | null;
  source: string;
  publishedAt: number;
  categories?: string;
  topic?: string;
  href: string;
  external: boolean;
  pinned?: boolean;
  breaking?: boolean;
  ownBadge?: boolean;
  badge?: string;
  views?: number;
  likes?: number;
}

export async function fetchOwnNews({
  limit = 30,
  locale = 'ru',
  offset = 0,
}: { limit?: number; locale?: string; offset?: number } = {}): Promise<UnifiedNewsItem[]> {
  const cms = await fetchSanityNews({ limit, locale, offset });
  return (cms || []).map((n: any) => ({
    id: n._id,
    title: n.title,
    excerpt: n.excerpt,
    imageUrl: n.coverImage,
    source: SITE_NAME,
    publishedAt: Math.floor(new Date(n.publishedAt).getTime() / 1000),
    href: `/${locale}/news/${n.slug.current}`,
    external: false,
    topic: n.topic,
    pinned: !!n.pinnedUntil && new Date(n.pinnedUntil) > new Date(),
    breaking: !!n.breaking,
    ownBadge: n.ownBadge === true,
    badge: n.badge,
    views: typeof n.views === 'number' ? n.views : undefined,
    likes: typeof n.likes === 'number' ? n.likes : undefined,
  }));
}

/**
 * Сколько всего новостей в ленте на этом языке.
 *
 * Нужно, чтобы посчитать число страниц: без него лента знала только
 * «есть ли следующая» и не могла показать номера, из-за чего старые
 * материалы висели в 36 переходах от первой страницы.
 */
export async function countOwnNews(locale = 'ru'): Promise<number> {
  return (await countSanityNews(locale)) ?? 0;
}

/** Первая страница длиннее последующих, поэтому счёт не делится нацело. */
export function totalNewsPages(total: number, initial: number, pageSize: number): number {
  if (total <= initial) return 1;
  return 1 + Math.ceil((total - initial) / pageSize);
}
