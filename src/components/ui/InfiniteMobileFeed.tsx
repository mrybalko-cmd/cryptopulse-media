'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Calendar, User } from 'lucide-react';
import RichText from './RichText';
import CommentSection from './CommentSection';
import PopularList from './PopularList';
import type { PopularItem } from '@/lib/sanity';

interface FeedItem {
  _id: string;
  _type: 'article' | 'news';
  title: string;
  excerpt?: string;
  slug: { current: string };
  publishedAt: string;
  body?: any[];
  coverImage?: string;
  coverImageAlt?: string;
  commentsEnabled?: boolean;
  author?: { name: string; slug?: string };
}

interface Props {
  type: 'article' | 'news';
  locale: string;
  cursor: string;
}

// Mobile-only, client-fetched "previous article" feed — loads one item at a
// time as the user scrolls, each with its own comment section and Popular
// block. Deliberately not server-rendered: stacking full article bodies in
// the initial HTML would create duplicate/thin-content risk on the current
// article's own indexed URL under mobile-first indexing. Fetched-on-scroll
// content is far less likely to be crawled/indexed the same way.
export default function InfiniteMobileFeed({ type, locale, cursor: initialCursor }: Props) {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [popularByItem, setPopularByItem] = useState<Record<string, PopularItem[]>>({});
  const [cursor, setCursor] = useState(initialCursor);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const loadNext = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/infinite-feed?type=${type}&locale=${locale}&before=${encodeURIComponent(cursor)}`);
      const data: FeedItem | null = await res.json();
      if (!data) {
        setDone(true);
        return;
      }
      setItems((prev) => [...prev, data]);
      setCursor(data.publishedAt);

      const popRes = await fetch(`/api/popular?locale=${locale}&limit=8`);
      const popData: PopularItem[] = await popRes.json();
      setPopularByItem((prev) => ({
        ...prev,
        [data._id]: popData.filter((p) => p._id !== data._id).slice(0, 7),
      }));
    } catch {
      setDone(true);
    } finally {
      setLoading(false);
    }
  }, [type, locale, cursor]);

  useEffect(() => {
    if (done) return;
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) loadNext();
      },
      { rootMargin: '600px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, done, cursor]);

  const isRu = locale === 'ru';

  return (
    <div className="lg:hidden">
      {items.map((item) => {
        const commentsEnabled = item.commentsEnabled !== false;
        const date = new Date(item.publishedAt).toLocaleDateString(isRu ? 'ru-RU' : 'en-US', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        });
        return (
          <div key={item._id} className="mt-12 pt-8 border-t border-border">
            {item.coverImage && (
              <div className="rounded-lg overflow-hidden mb-6">
                <img
                  src={item.coverImage}
                  alt={item.coverImageAlt || item.title}
                  className="w-full h-auto"
                  loading="lazy"
                />
              </div>
            )}
            <h2 className="text-xl font-bold text-foreground leading-tight mb-3">
              <a
                href={`/${locale}/${item._type === 'article' ? 'articles' : 'news'}/${item.slug.current}`}
                className="hover:text-accent transition-colors"
              >
                {item.title}
              </a>
            </h2>
            <div className="flex items-center flex-wrap gap-3 mb-6 pb-4 border-b border-border text-xs text-muted">
              {item.author?.name && (
                <span className="flex items-center gap-1.5">
                  <User size={12} />
                  {item.author.name}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Calendar size={12} />
                {date}
              </span>
            </div>
            {item.body ? (
              <RichText value={item.body} fallbackAlt={item.title} locale={locale} />
            ) : (
              <p className="text-muted">{item.excerpt}</p>
            )}
            {commentsEnabled && <CommentSection targetId={item._id} locale={locale} />}
            {popularByItem[item._id]?.length > 0 && (
              <div className="mt-12 pt-8 border-t border-border">
                <PopularList items={popularByItem[item._id]} locale={locale} />
              </div>
            )}
          </div>
        );
      })}
      {!done && <div ref={sentinelRef} className="h-4" />}
    </div>
  );
}
