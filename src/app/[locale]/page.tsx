export const revalidate = 300;

import { getTranslations, setRequestLocale} from 'next-intl/server';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import NewsListItem from '@/components/ui/NewsListItem';
import ArticleCard from '@/components/ui/ArticleCard';
import AuthorColumns from '@/components/ui/AuthorColumns';
import VideoCard from '@/components/ui/VideoCard';
import CalendarCarousel from '@/components/ui/CalendarCarousel';
import PopularList from '@/components/ui/PopularList';
import { fetchOwnNews } from '@/lib/news';
import { fetchArticles, fetchCalendarEvents, fetchPopularContent, fetchAuthorsWithLatest } from '@/lib/sanity';
import { fetchVideos } from '@/lib/youtube';
type Props = { params: Promise<{ locale: string }> };

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('home');

  const [news, articles, videos, calendarEvents, popular, authors] = await Promise.allSettled([
    // News rail runs the full height of the articles column beside it
    // (through the hero block, author columns, and both compact rows down
    // to the calendar) — needs enough real items to naturally reach that
    // far, not just the ~4 rows it used to sit next to.
    fetchOwnNews({ limit: 20, locale }),
    // 2 (hero) + 3 (row 2, compact) + 5 (row 4) + 5 (row 5) = 15
    fetchArticles({ limit: 16, locale }),
    fetchVideos({ limit: 5 }),
    fetchCalendarEvents(),
    fetchPopularContent(locale, 7),
    fetchAuthorsWithLatest(locale, 4),
  ]);

  const newsItems = news.status === 'fulfilled' ? news.value : [];
  const articleItems = articles.status === 'fulfilled' ? articles.value : [];
  const videoItems = videos.status === 'fulfilled' ? videos.value : [];
  const popularItems = popular.status === 'fulfilled' ? popular.value : [];
  const authorItems = authors.status === 'fulfilled' ? authors.value : [];
  const hasPopular = popularItems.length > 0;
  const heroArticles = articleItems.slice(0, 2);
  const row2Articles = articleItems.slice(2, 5);
  const row4Articles = articleItems.slice(5, 10);
  const row5Articles = articleItems.slice(10, 15);
  const todayISO = new Date().toISOString().slice(0, 10);
  const upcomingEvents = (calendarEvents.status === 'fulfilled' ? calendarEvents.value : [])
    .filter((e) => e.date >= todayISO)
    .slice(0, 10);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <h1 className="sr-only">{t('hero')}</h1>

      {/* News rail + Articles */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8 mb-14">
        {/* News */}
        <section className="lg:col-span-1">
          <div className="flex items-center justify-between mb-5">
            <h2 className="flex items-center gap-2 text-sm font-bold text-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
              <Link href={`/${locale}/news`} className="hover:text-accent transition-colors">
                {t('latestNews')}
              </Link>
            </h2>
            <Link href={`/${locale}/news`} className="flex items-center gap-1 text-xs text-muted hover:text-accent transition-colors">
              {t('viewAll')} <ArrowRight size={12} />
            </Link>
          </div>
          {newsItems.length > 0 ? (
            <div>
              {newsItems.map((item) => (
                <NewsListItem
                  key={item.id}
                  title={item.title}
                  href={item.href}
                  external={item.external}
                  publishedAt={item.publishedAt}
                  category={item.categories?.split('|').filter(Boolean)[0]}
                  locale={locale}
                  pinned={item.pinned}
                  breaking={item.breaking}
                  ownBadge={item.ownBadge}
                  views={item.views}
                  likes={item.likes}
                  aiTopic={item.topic === 'ai'}
                />
              ))}
            </div>
          ) : (
            <EmptyState text={locale === 'ru' ? 'Новости загружаются...' : 'Loading news...'} />
          )}
        </section>

        {/* Articles */}
        <section className="lg:col-span-3">
          <div className="flex items-center justify-between mb-5">
            <h2 className="flex items-center gap-2 text-sm font-bold text-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
              <Link href={`/${locale}/articles`} className="hover:text-accent transition-colors">
                {t('featuredArticles')}
              </Link>
            </h2>
            <Link href={`/${locale}/articles`} className="flex items-center gap-1 text-xs text-muted hover:text-accent transition-colors">
              {t('viewAll')} <ArrowRight size={12} />
            </Link>
          </div>
          {articleItems.length > 0 ? (
            <div className="flex flex-col gap-8">
              {/* Row 1 (unchanged) + Row 2 (new, compact) — Popular spans
                  both rows in the third column, same mechanic as before,
                  just with row 2 broken out into its own dense sub-grid
                  instead of two more full-size cards auto-flowing in. */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2 gap-3">
                {heroArticles.map((article: any, i: number) => (
                  <ArticleCard
                    key={article._id}
                    title={article.title}
                    excerpt={article.excerpt}
                    slug={article.slug.current}
                    coverImage={article.coverImage}
                    publishedAt={article.publishedAt}
                    readingTime={article.readingTime}
                    badge={article.badge}
                    views={article.views}
                    likes={article.likes}
                    locale={locale}
                    priority={i < 2}
                  />
                ))}
                {hasPopular && (
                  <div className="lg:row-span-2">
                    <PopularList items={popularItems} locale={locale} />
                  </div>
                )}
                {row2Articles.length > 0 && (
                  <div className="sm:col-span-2 lg:col-span-2 lg:row-start-2">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {row2Articles.map((article: any) => (
                        <ArticleCard
                          key={article._id}
                          title={article.title}
                          excerpt={article.excerpt}
                          slug={article.slug.current}
                          coverImage={article.coverImage}
                          publishedAt={article.publishedAt}
                          locale={locale}
                          compact
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Row 3 — author columns */}
              {authorItems.length > 0 && <AuthorColumns authors={authorItems} locale={locale} />}

              {/* Row 4 — compact, 5 across */}
              {row4Articles.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                  {row4Articles.map((article: any) => (
                    <ArticleCard
                      key={article._id}
                      title={article.title}
                      excerpt={article.excerpt}
                      slug={article.slug.current}
                      coverImage={article.coverImage}
                      publishedAt={article.publishedAt}
                      locale={locale}
                      compact
                    />
                  ))}
                </div>
              )}

              {/* Row 5 — compact, 5 across, more breathing room */}
              {row5Articles.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-5">
                  {row5Articles.map((article: any) => (
                    <ArticleCard
                      key={article._id}
                      title={article.title}
                      excerpt={article.excerpt}
                      slug={article.slug.current}
                      coverImage={article.coverImage}
                      publishedAt={article.publishedAt}
                      locale={locale}
                      compact
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <EmptyState text={locale === 'ru' ? 'Статьи появятся скоро' : 'Articles coming soon'} />
          )}
        </section>
      </div>

      {/* Calendar */}
      <CalendarCarousel events={upcomingEvents} locale={locale} />

      {/* Videos */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="flex items-center gap-2 text-sm font-bold text-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
            <Link href={`/${locale}/interviews`} className="hover:text-accent transition-colors">
              {t('latestInterviews')}
            </Link>
          </h2>
          <Link href={`/${locale}/interviews`} className="flex items-center gap-1 text-xs text-muted hover:text-accent transition-colors">
            {t('viewAll')} <ArrowRight size={12} />
          </Link>
        </div>
        {videoItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {videoItems.map((video: any) => (
              <VideoCard
                key={video.id.videoId}
                title={video.snippet.title}
                channelName={video.snippet.channelTitle}
                thumbnail={video.snippet.thumbnails.medium.url}
                videoId={video.id.videoId}
                publishedAt={video.snippet.publishedAt}
                locale={locale}
              />
            ))}
          </div>
        ) : (
          <EmptyState text={locale === 'ru' ? 'Интервью появятся скоро' : 'Interviews coming soon'} />
        )}
      </section>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="border border-dashed border-border rounded-lg py-12 flex items-center justify-center">
      <span className="text-sm text-muted">{text}</span>
    </div>
  );
}
