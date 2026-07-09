import { BASE } from '@/lib/metadata';
import NewsLoadMore from '@/components/ui/NewsLoadMore';
import NewsTimelineRow from '@/components/ui/NewsTimelineRow';
import { TOPIC_META } from '@/lib/topicMeta';
import type { UnifiedNewsItem } from '@/lib/news';
import Link from 'next/link';
import { Flame } from 'lucide-react';

const TZ = 'Europe/Prague';

function toDayKey(ts: number): string {
  return new Date(ts * 1000).toLocaleDateString('en-CA', { timeZone: TZ });
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

function groupByDay(items: UnifiedNewsItem[]): { day: string; items: UnifiedNewsItem[] }[] {
  const map = new Map<string, UnifiedNewsItem[]>();
  for (const item of items) {
    const key = toDayKey(item.publishedAt);
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(item);
  }
  return [...map.entries()].map(([day, items]) => ({ day, items }));
}

type Props = {
  locale: string;
  title: string;
  subtitle: string;
  items: UnifiedNewsItem[];
  page: number;
  pageSize: number;
  hasNext: boolean;
  startOffsetForLoadMore: number;
};

export default function NewsListingBody({ locale, title, subtitle, items, page, pageSize, hasNext, startOffsetForLoadMore }: Props) {
  const isRu = locale === 'ru';
  const groups = groupByDay(items);
  const lastDay = groups.length > 0 ? groups[groups.length - 1].day : undefined;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: title,
    url: `${BASE}/${locale}/news${page > 1 ? `/page/${page}` : ''}`,
    itemListElement: items.slice(0, 20).map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${BASE}${item.href}`,
      name: item.title,
    })),
  };

  const topicCounts: Record<string, number> = {};
  for (const item of items) {
    if (item.topic) topicCounts[item.topic] = (topicCounts[item.topic] ?? 0) + 1;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        <p className="text-muted text-sm mt-1">{subtitle}</p>
      </div>

      {/* Topic navigation bar — scrollable on mobile */}
      <nav
        aria-label={isRu ? 'Фильтр по теме' : 'Filter by topic'}
        className="relative -mx-4 sm:mx-0 mb-8"
      >
        {/* Scroll container */}
        <div className="flex items-stretch overflow-x-auto scrollbar-none border-b border-border px-4 sm:px-0 gap-0">
          {/* All — active */}
          <span className="relative shrink-0 flex items-center gap-1.5 px-4 py-3 text-sm font-semibold text-foreground cursor-default select-none whitespace-nowrap">
            {isRu ? 'Все новости' : 'All news'}
            {/* active underline */}
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent rounded-full" />
          </span>

          <Link
            href={`/${locale}/news/popular`}
            className="relative shrink-0 flex items-center gap-1.5 px-4 py-3 text-sm font-medium text-muted hover:text-foreground transition-colors whitespace-nowrap group"
          >
            <Flame size={14} className="text-red-600" fill="currentColor" />
            {isRu ? 'Популярное' : 'Popular'}
            <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-red-600 opacity-0 group-hover:opacity-60 transition-opacity" />
          </Link>

          {/* Topic tabs */}
          {Object.entries(TOPIC_META)
            .filter(([key]) => key !== 'press-release')
            .map(([key, meta]) => (
            <Link
              key={key}
              href={`/${locale}/news/topic/${key}`}
              className="relative shrink-0 flex items-center gap-1.5 px-4 py-3 text-sm font-medium text-muted hover:text-foreground transition-colors whitespace-nowrap group"
            >
              <span className={`w-2 h-2 rounded-full shrink-0 ${meta.dotCls} opacity-80 group-hover:opacity-100 transition-opacity`} />
              {isRu ? meta.ru : meta.en}
              {topicCounts[key] ? (
                <span className="text-[10px] font-mono tabular-nums text-muted/60 group-hover:text-muted transition-colors">
                  {topicCounts[key]}
                </span>
              ) : null}
              {/* hover underline */}
              <span className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-full ${meta.dotCls} opacity-0 group-hover:opacity-60 transition-opacity`} />
            </Link>
          ))}
        </div>
        {/* Right fade for mobile scroll hint */}
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent sm:hidden" />
      </nav>

      {/* Timeline */}
      {items.length > 0 ? (
        <>
          {groups.map(({ day, items: dayItems }) => (
            <section key={day} aria-label={dayLabel(day, locale)}>
              {/* Day separator */}
              <div className="flex items-center gap-3 mt-8 mb-2 first:mt-0">
                <h2 className="text-[11px] font-bold uppercase tracking-widest text-muted whitespace-nowrap" suppressHydrationWarning>
                  {dayLabel(day, locale)}
                </h2>
                <div className="flex-1 h-px bg-border" />
              </div>

              {/* Rows */}
              <div>
                {dayItems.map(item => (
                  <NewsTimelineRow
                    key={item.id}
                    title={item.title}
                    href={item.href}
                    external={item.external}
                    publishedAt={item.publishedAt}
                    imageUrl={item.imageUrl}
                    topic={item.topic}
                    locale={locale}
                    pinned={item.pinned}
                    breaking={item.breaking}
                    ownBadge={item.ownBadge}
                  />
                ))}
              </div>
            </section>
          ))}

          <NewsLoadMore
            locale={locale}
            initialCount={startOffsetForLoadMore}
            pageSize={pageSize}
            lastInitialDay={lastDay}
            nextPage={page + 1}
            hasNext={hasNext}
          />
        </>
      ) : (
        <div className="border border-dashed border-border rounded-lg py-20 flex items-center justify-center">
          <span className="text-sm text-muted">
            {isRu ? 'Новостей пока нет' : 'No news yet'}
          </span>
        </div>
      )}
    </div>
  );
}
