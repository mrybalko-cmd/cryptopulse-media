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
  pinned?: boolean;
  views?: number;
}

async function fetchOwnNewsItems(limit: number, locale: string): Promise<UnifiedNewsItem[]> {
  const cms = await fetchSanityNews({ limit, locale });
  return (cms || []).map((n: any) => ({
    id: n._id,
    title: n.title,
    excerpt: n.excerpt,
    imageUrl: n.coverImage,
    source: SITE_NAME,
    publishedAt: Math.floor(new Date(n.publishedAt).getTime() / 1000),
    href: `/${locale}/news/${n.slug.current}`,
    external: false,
    pinned: !!n.pinnedUntil && new Date(n.pinnedUntil) > new Date(),
    views: typeof n.views === 'number' ? n.views : undefined,
  }));
}

export async function fetchOwnNews({
  limit = 30,
  locale = 'ru',
}: { limit?: number; locale?: string } = {}): Promise<UnifiedNewsItem[]> {
  return fetchOwnNewsItems(limit, locale);
}

export async function fetchMergedNews({
  limit = 12,
  locale = 'ru',
}: { limit?: number; locale?: string } = {}): Promise<UnifiedNewsItem[]> {
  // Fetch all own news (uncapped) so pinned items that were recently unpinned
  // don't immediately disappear — they stay in the pool and sink gradually.
  const [rss, cms] = await Promise.allSettled([
    fetchNews({ limit: limit * 2, locale }),
    fetchOwnNewsItems(50, locale),
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

  const cmsItems: UnifiedNewsItem[] = cms.status === 'fulfilled' ? cms.value : [];

  // Pinned own news always floats to the top. Remaining own news items are
  // guaranteed a slot before RSS fills the rest, so unpinned editorial items
  // gradually move down (not instantly cut off by a flood of RSS content).
  const pinned = cmsItems.filter(i => i.pinned);
  const unpinnedOwn = cmsItems
    .filter(i => !i.pinned)
    .sort((a, b) => b.publishedAt - a.publishedAt);

  const ownToShow = [...pinned, ...unpinnedOwn];
  const remainingSlots = Math.max(0, limit - ownToShow.length);
  const rssToShow = rssItems
    .sort((a, b) => b.publishedAt - a.publishedAt)
    .slice(0, remainingSlots);

  return [...ownToShow, ...rssToShow]
    .sort((a, b) => {
      if (!!a.pinned !== !!b.pinned) return a.pinned ? -1 : 1;
      return b.publishedAt - a.publishedAt;
    })
    .slice(0, limit);
}
