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
  breaking?: boolean;
  views?: number;
}

export async function fetchOwnNews({
  limit = 30,
  locale = 'ru',
}: { limit?: number; locale?: string } = {}): Promise<UnifiedNewsItem[]> {
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
    breaking: !!n.breaking,
    views: typeof n.views === 'number' ? n.views : undefined,
  }));
}
