'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import NewsTimelineRow from './NewsTimelineRow';

const TZ = 'Europe/Prague';

interface NewsItem {
  _id: string;
  title: string;
  slug: { current: string };
  coverImage?: string;
  publishedAt: string;
  breaking?: boolean;
  ownBadge?: boolean;
  badge?: string;
  topic?: string;
  views?: number;
}

interface Props {
  locale: string;
  initialCount: number;
  pageSize?: number;
  lastInitialDay?: string; // YYYY-MM-DD — to suppress duplicate day header on first loaded batch
  nextPage: number; // page number the crawlable "load more" link points to
  hasNext: boolean; // whether the server already knows there's more beyond this page
}

function toDayKey(isoOrMs: string | number): string {
  const d = typeof isoOrMs === 'number' ? new Date(isoOrMs) : new Date(isoOrMs);
  return d.toLocaleDateString('en-CA', { timeZone: TZ });
}

function dayLabel(dayISO: string, locale: string): string {
  const todayKey = new Date().toLocaleDateString('en-CA', { timeZone: TZ });
  const yestKey = new Date(Date.now() - 86400000).toLocaleDateString('en-CA', { timeZone: TZ });
  if (dayISO === todayKey) return locale === 'ru' ? 'Сегодня' : 'Today';
  if (dayISO === yestKey) return locale === 'ru' ? 'Вчера' : 'Yesterday';
  const d = new Date(dayISO + 'T12:00:00');
  return d.toLocaleDateString(locale === 'ru' ? 'ru-RU' : 'en-US', {
    weekday: 'long', day: 'numeric', month: 'long',
  });
}

function groupByDay(items: NewsItem[]): { day: string; items: NewsItem[] }[] {
  const map = new Map<string, NewsItem[]>();
  for (const item of items) {
    const key = toDayKey(item.publishedAt);
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(item);
  }
  return [...map.entries()].map(([day, items]) => ({ day, items }));
}

export default function NewsLoadMore({ locale, initialCount, pageSize = 20, lastInitialDay, nextPage, hasNext }: Props) {
  const [allLoaded, setAllLoaded] = useState<NewsItem[]>([]);
  const [offset, setOffset] = useState(initialCount);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(hasNext);
  const [page, setPage] = useState(nextPage);
  const isRu = locale === 'ru';

  const loadMore = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/news-own?locale=${locale}&limit=${pageSize}&offset=${offset}`);
      const data: NewsItem[] = await res.json();
      if (data.length < pageSize) setHasMore(false);
      setAllLoaded(prev => [...prev, ...data]);
      setOffset(prev => prev + data.length);
      setPage(prev => prev + 1);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  const groups = groupByDay(allLoaded);

  return (
    <>
      {groups.length > 0 && (
        <div className="mt-0">
          {groups.map(({ day, items }, gi) => {
            const suppressHeader = gi === 0 && lastInitialDay === day;
            return (
              <section key={day} aria-label={dayLabel(day, locale)}>
                {!suppressHeader && (
                  <div className="flex items-center gap-3 mt-8 mb-2">
                    <h2 className="text-[11px] font-bold uppercase tracking-widest text-muted whitespace-nowrap" suppressHydrationWarning>
                      {dayLabel(day, locale)}
                    </h2>
                    <div className="flex-1 h-px bg-border" />
                  </div>
                )}
                <div>
                  {items.map(item => (
                    <NewsTimelineRow
                      key={item._id}
                      title={item.title}
                      href={`/${locale}/news/${item.slug.current}`}
                      external={false}
                      publishedAt={Math.floor(new Date(item.publishedAt).getTime() / 1000)}
                      imageUrl={item.coverImage}
                      topic={item.topic}
                      locale={locale}
                      breaking={item.breaking}
                      ownBadge={item.ownBadge !== false}
                      badge={item.badge}
                      views={item.views}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}

      {hasMore && (
        <div className="flex justify-center mt-8">
          <Link
            href={`/${locale}/news/page/${page}`}
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
