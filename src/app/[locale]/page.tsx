export const revalidate = 300;

import { getTranslations, setRequestLocale} from 'next-intl/server';
import Link from 'next/link';
import { ArrowRight, Zap } from 'lucide-react';
import NewsListItem from '@/components/ui/NewsListItem';
import ArticleCard from '@/components/ui/ArticleCard';
import VideoCard from '@/components/ui/VideoCard';
import CalendarCarousel from '@/components/ui/CalendarCarousel';
import PopularList from '@/components/ui/PopularList';
import { fetchOwnNews } from '@/lib/news';
import { fetchArticles, fetchCalendarEvents, fetchPopularContent, fetchAIContent } from '@/lib/sanity';
import { fetchVideos } from '@/lib/youtube';
type Props = { params: Promise<{ locale: string }> };

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('home');

  const [news, articles, videos, calendarEvents, popular, aiItems] = await Promise.allSettled([
    fetchOwnNews({ limit: 12, locale }),
    fetchArticles({ limit: 12, locale }),
    fetchVideos({ limit: 5 }),
    fetchCalendarEvents(),
    fetchPopularContent(locale, 7),
    fetchAIContent({ limit: 6, locale }),
  ]);

  const newsItems = news.status === 'fulfilled' ? news.value : [];
  const articleItems = articles.status === 'fulfilled' ? articles.value : [];
  const videoItems = videos.status === 'fulfilled' ? videos.value : [];
  const popularItems = popular.status === 'fulfilled' ? popular.value : [];
  const aiContent = aiItems.status === 'fulfilled' ? aiItems.value : [];
  const hasPopular = popularItems.length > 0;
  // The popular widget occupies grid slots 3+6 (a 2-row span in the
  // rightmost column), so with it present only 10 article cells remain;
  // CSS grid auto-flow naturally wraps the rest around it (2,2,3,3 rows).
  const firstArticles = hasPopular ? articleItems.slice(0, 2) : articleItems;
  const restArticles = hasPopular ? articleItems.slice(2, 10) : [];
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {firstArticles.map((article: any, i: number) => (
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
                  locale={locale}
                  priority={i < 2}
                />
              ))}
              {hasPopular && (
                <div className="lg:row-span-2">
                  <PopularList items={popularItems} locale={locale} />
                </div>
              )}
              {restArticles.map((article: any) => (
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
                  locale={locale}
                />
              ))}
            </div>
          ) : (
            <EmptyState text={locale === 'ru' ? 'Статьи появятся скоро' : 'Articles coming soon'} />
          )}
        </section>
      </div>

      {/* Calendar */}
      <CalendarCarousel events={upcomingEvents} locale={locale} />

      {/* AI section */}
      {aiContent.length > 0 && (
        <section className="mb-14">
          <div className="flex items-center justify-between mb-5">
            <h2 className="flex items-center gap-2 text-sm font-bold text-foreground">
              <Zap size={13} className="text-yellow-400 shrink-0" fill="currentColor" />
              <Link href={`/${locale}/ai`} className="hover:text-accent transition-colors">
                AI
              </Link>
            </h2>
            <Link href={`/${locale}/ai`} className="flex items-center gap-1 text-xs text-muted hover:text-accent transition-colors">
              {locale === 'ru' ? 'Смотреть все' : 'View all'} <ArrowRight size={12} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {aiContent.slice(0, 6).map((item: any) => {
              const isArticle = item._type === 'article';
              const href = `/${locale}/${isArticle ? 'articles' : 'news'}/${item.slug.current}`;
              const date = new Date(item.publishedAt).toLocaleDateString(locale === 'ru' ? 'ru-RU' : 'en-US', {
                day: 'numeric', month: 'short', year: 'numeric',
              });
              return (
                <Link
                  key={item._id}
                  href={href}
                  className="group flex gap-3 bg-card border border-border/70 rounded-xl p-4 shadow-sm hover:border-accent/30 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                >
                  {item.coverImage && (
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0">
                      <img src={item.coverImage} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-1.5 mb-1">
                      <Zap size={12} className="text-yellow-400 shrink-0 mt-0.5" fill="currentColor" />
                      <h3 className="text-sm font-medium text-foreground leading-snug group-hover:text-accent transition-colors line-clamp-2">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-xs text-muted mt-1">{date}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

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
