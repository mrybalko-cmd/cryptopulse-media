'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import ArticleCard from './ArticleCard';

interface Article {
  _id: string;
  title: string;
  excerpt?: string;
  slug: { current: string };
  coverImage?: string;
  publishedAt: string;
  readingTime?: number;
  badge?: string;
  views?: number;
}

interface Props {
  locale: string;
  initialCount: number;
  pageSize?: number;
}

export default function ArticlesLoadMore({ locale, initialCount, pageSize = 12 }: Props) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [offset, setOffset] = useState(initialCount);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/articles?locale=${locale}&limit=${pageSize}&offset=${offset}`);
      const data: Article[] = await res.json();
      if (data.length < pageSize) setHasMore(false);
      setArticles(prev => [...prev, ...data]);
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
      {articles.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {articles.map(article => (
            <ArticleCard
              key={article._id}
              title={article.title}
              excerpt={article.excerpt ?? ''}
              slug={article.slug.current}
              coverImage={article.coverImage}
              publishedAt={article.publishedAt}
              readingTime={article.readingTime}
              badge={article.badge}
              views={article.views}
              locale={locale}
            />
          ))}
        </div>
      )}

      {hasMore && (
        <div className="flex justify-center mt-8">
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
