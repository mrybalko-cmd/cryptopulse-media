'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import NewsCard from './NewsCard';
import { SITE_NAME } from '@/lib/constants';

interface NewsItem {
  _id: string;
  title: string;
  excerpt?: string;
  slug: { current: string };
  coverImage?: string;
  publishedAt: string;
  breaking?: boolean;
  views?: number;
}

interface Props {
  locale: string;
  initialCount: number;
  pageSize?: number;
}

export default function NewsLoadMore({ locale, initialCount, pageSize = 20 }: Props) {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [offset, setOffset] = useState(initialCount);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/news-own?locale=${locale}&limit=${pageSize}&offset=${offset}`);
      const data: NewsItem[] = await res.json();
      if (data.length < pageSize) setHasMore(false);
      setItems(prev => [...prev, ...data]);
      setOffset(prev => prev + data.length);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  const isRu = locale === 'ru';

  return (
    <>
      {items.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
          {items.map(item => (
            <NewsCard
              key={item._id}
              title={item.title}
              source={SITE_NAME}
              href={`/${locale}/news/${item.slug.current}`}
              external={false}
              publishedAt={Math.floor(new Date(item.publishedAt).getTime() / 1000)}
              imageUrl={item.coverImage}
              locale={locale}
              breaking={item.breaking}
            />
          ))}
        </div>
      )}

      {hasMore && (
        <div className="flex justify-center mt-6">
          <button
            onClick={loadMore}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium border border-border rounded-lg text-muted hover:text-foreground hover:border-accent/40 transition-colors disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                {isRu ? 'Загрузка...' : 'Loading...'}
              </>
            ) : (
              isRu ? 'Загрузить ещё' : 'Load more'
            )}
          </button>
        </div>
      )}
    </>
  );
}
