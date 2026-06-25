import { fetchNews } from '@/lib/cryptonews';
import { fetchSanityNews } from '@/lib/sanity';
import { SITE_NAME } from '@/lib/constants';

export interface UnifiedNewsItem {
  id: string;
  title: string;
  excerpt?: string;
  imageUrl?: string | null;
  source: string;
  publishedAt: number;
  categories?: string;
  href: string;
  external: boolean;
}

export async function fetchMergedNews({
  limit = 12,
  locale = 'ru',
}: { limit?: number; locale?: string } = {}): Promise<UnifiedNewsItem[]> {
  const [rss, cms] = await Promise.allSettled([
    fetchNews({ limit: limit * 2, locale }),
    fetchSanityNews({ limit, locale }),
  ]);

  const rssItems: UnifiedNewsItem[] = (rss.status === 'fulfilled' ? rss.value : []).map(n => ({
    id: n.id,
    title: n.title,
    imageUrl: n.imageUrl,
    source: n.source,
    publishedAt: n.publishedAt,
    categories: n.categories,
    href: n.url,
    external: true,
  }));

  const cmsItems: UnifiedNewsItem[] = (cms.status === 'fulfilled' ? cms.value : []).map((n: any) => ({
    id: n._id,
    title: n.title,
    excerpt: n.excerpt,
    imageUrl: n.coverImage,
    source: SITE_NAME,
    publishedAt: Math.floor(new Date(n.publishedAt).getTime() / 1000),
    href: `/${locale}/news/${n.slug.current}`,
    external: false,
  }));

  return [...rssItems, ...cmsItems]
    .sort((a, b) => b.publishedAt - a.publishedAt)
    .slice(0, limit);
}
