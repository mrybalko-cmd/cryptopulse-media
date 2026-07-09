'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import ArticleCard from './ArticleCard';

interface Article {
  _id: string;
  title: string;
  excerpt?: string;
  slug: { current: string };
  coverImage?: string;
  coverImageAlt?: string;
  publishedAt: string;
  readingTime?: number;
  badge?: string;
  views?: number;
  likes?: number;
}

interface Props {
  locale: string;
  initialCount: number;
  pageSize?: number;
  nextPage: number; // page number the crawlable "load more" link points to
  hasNext: boolean; // whether the server already knows there's more beyond this page
}

export default function ArticlesLoadMore({ locale, initialCount, pageSize = 15, nextPage, hasNext }: Props) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [offset, setOffset] = useState(initialCount);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(hasNext);
  const [page, setPage] = useState(nextPage);

  const loadMore = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/articles?locale=${locale}&limit=${pageSize}&offset=${offset}`);
      const data: Article[] = await res.json();
      if (data.length < pageSize) setHasMore(false);
      setArticles(prev => [...prev, ...data]);
      setOffset(prev => prev + data.length);
      setPage(prev => prev + 1);
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-4">
          {articles.map(article => (
            <ArticleCard
              key={article._id}
              title={article.title}
              excerpt={article.excerpt ?? ''}
              slug={article.slug.current}
              coverImage={article.coverImage}
              coverImageAlt={article.coverImageAlt}
              publishedAt={article.publishedAt}
              readingTime={article.readingTime}
              badge={article.badge}
              views={article.views}
              likes={article.likes}
              locale={locale}
            />
          ))}
        </div>
      )}

      {hasMore && (
        <div className="flex justify-center mt-8">
          <Link
            href={`/${locale}/articles/page/${page}`}
            onClick={(e) => { e.preventDefault(); if (!loading) loadMore(); }}
            aria-disabled={loading}
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
          </Link>
        </div>
      )}
    </>
  );
}
