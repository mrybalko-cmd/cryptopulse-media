export const revalidate = 300;

import { getTranslations, setRequestLocale} from 'next-intl/server';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import NewsListItem from '@/components/ui/NewsListItem';
import ArticleCard from '@/components/ui/ArticleCard';
import ArticleRowCard from '@/components/ui/ArticleRowCard';
import ArticleCarousel from '@/components/ui/ArticleCarousel';
import AuthorColumns from '@/components/ui/AuthorColumns';
import VideoCard from '@/components/ui/VideoCard';
import CalendarCarousel from '@/components/ui/CalendarCarousel';
import PopularList from '@/components/ui/PopularList';
import { fetchOwnNews } from '@/lib/news';
import { fetchArticles, fetchCalendarEvents, fetchPopularContent, fetchHomeSettings } from '@/lib/sanity';
import { fetchVideos } from '@/lib/youtube';
type Props = { params: Promise<{ locale: string }> };

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('home');

  const [news, articles, videos, calendarEvents, popular, settings] = await Promise.allSettled([
    // News rail runs alongside the articles column, down to the calendar —
    // trimmed further (18 -> 17) to close the last bit of gap before the
    // calendar section.
    fetchOwnNews({ limit: 17, locale }),
    // 2 (hero) + 3 (row 2) + 5×4 (rows 4-7, compact) = 25
    fetchArticles({ limit: 25, locale }),
    fetchVideos({ limit: 5 }),
    fetchCalendarEvents(),
    // Trimmed from 7: with row 2 now compact (not two more full cards),
    // 7 items made the sidebar taller than the hero row + row 2 combined,
    // leaving dead space below row 2 before the next section. 5 items
    // matches that combined height instead.
    fetchPopularContent(locale, 5),
    fetchHomeSettings(locale),
  ]);

  const newsItems = news.status === 'fulfilled' ? news.value : [];
  const articleItems = articles.status === 'fulfilled' ? articles.value : [];
  const videoItems = videos.status === 'fulfilled' ? videos.value : [];
  const popularItems = popular.status === 'fulfilled' ? popular.value : [];
  const homeSettings = settings.status === 'fulfilled'
    ? settings.value
    : { showNews: true, showArticles: true, showAuthorColumns: true, featuredAuthors: [] };
  const authorItems = homeSettings.featuredAuthors;
  const hasPopular = popularItems.length > 0;
  const heroArticles = articleItems.slice(0, 2);
  const row2Articles = articleItems.slice(2, 5);
  const row4Articles = articleItems.slice(5, 10);
  const row5Articles = articleItems.slice(10, 15);
  const row6Articles = articleItems.slice(15, 20);
  const row7Articles = articleItems.slice(20, 25);
  const todayISO = new Date().toISOString().slice(0, 10);
  const upcomingEvents = (calendarEvents.status === 'fulfilled' ? calendarEvents.value : [])
    .filter((e) => e.date >= todayISO)
    .slice(0, 10);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <h1 className="sr-only">{t('hero')}</h1>

      {/* Mobile-only homepage flow (approved mockup): hero -> two small cards ->
          news list -> authors (stacked) -> second hero -> swipeable rail.
          Pure CSS show/hide (hidden below, lg:hidden here) rather than a JS
          branch, so both variants exist in the same SSR markup — no
          hydration mismatch, and it's just responsive design, not cloaking. */}
      <div className="lg:hidden flex flex-col gap-6 mb-8">
        {homeSettings.showArticles && heroArticles[0] && (
          <ArticleCard
            key={heroArticles[0]._id}
            title={heroArticles[0].title}
            excerpt={heroArticles[0].excerpt}
            slug={heroArticles[0].slug.current}
            coverImage={heroArticles[0].coverImage}
            publishedAt={heroArticles[0].publishedAt}
            readingTime={heroArticles[0].readingTime}
            badge={heroArticles[0].badge}
            views={heroArticles[0].views}
            likes={heroArticles[0].likes}
            locale={locale}
            priority
            imageFade={false}
          />
        )}

        {homeSettings.showArticles && row2Articles.length > 0 && (
          <div className="flex flex-col gap-2.5">
            {row2Articles.slice(0, 2).map((article: any) => (
              <ArticleRowCard
                key={article._id}
                title={article.title}
                slug={article.slug.current}
                coverImage={article.coverImage}
                publishedAt={article.publishedAt}
                locale={locale}
              />
            ))}
          </div>
        )}

        {homeSettings.showNews && newsItems.length > 0 && (
          <div>
            {newsItems.slice(0, 6).map((item) => (
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
        )}

        {homeSettings.showAuthorColumns && authorItems.length > 0 && (
          <AuthorColumns authors={authorItems} locale={locale} variant="stack" />
        )}

        {homeSettings.showArticles && heroArticles[1] && (
          <ArticleCard
            key={heroArticles[1]._id}
            title={heroArticles[1].title}
            excerpt={heroArticles[1].excerpt}
            slug={heroArticles[1].slug.current}
            coverImage={heroArticles[1].coverImage}
            publishedAt={heroArticles[1].publishedAt}
            readingTime={heroArticles[1].readingTime}
            badge={heroArticles[1].badge}
            views={heroArticles[1].views}
            likes={heroArticles[1].likes}
            locale={locale}
            imageFade={false}
          />
        )}

        {homeSettings.showArticles && row4Articles.length > 0 && (
          <ArticleCarousel
            articles={row4Articles.slice(0, 4).map((a: any) => ({
              _id: a._id,
              title: a.title,
              slug: a.slug,
              coverImage: a.coverImage,
            }))}
            locale={locale}
          />
        )}
      </div>

      {/* News rail + Articles (desktop) */}
      <div className={`hidden lg:grid grid-cols-1 gap-6 lg:gap-8 mb-8 ${homeSettings.showNews && homeSettings.showArticles ? 'lg:grid-cols-4' : ''}`}>
        {/* News */}
        {homeSettings.showNews && (
        <section className={homeSettings.showArticles ? 'lg:col-span-1' : ''}>
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
        )}

        {/* Articles */}
        {homeSettings.showArticles && (
        <section className={homeSettings.showNews ? 'lg:col-span-3' : ''}>
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
            <div className="flex flex-col gap-6">
              {/* Row 1 (unchanged) + Row 2 (new, compact) — Popular spans
                  both rows in the third column, same mechanic as before,
                  just with row 2 broken out into its own dense sub-grid
                  instead of two more full-size cards auto-flowing in.
                  Rows sized by content (no forced grid-rows-2) so Popular's
                  5 items line up with row 1 + row 2's real combined height
                  instead of stretching both rows to match a taller widget. */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
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
                    imageFade={false}
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

              {/* Row 3 — author columns (curated in Studio: Настройки главной) */}
              {homeSettings.showAuthorColumns && authorItems.length > 0 && (
                <AuthorColumns authors={authorItems} locale={locale} />
              )}

              {/* Rows 4-7 — same bare-grid treatment as row 2 (no card/border
                  wrapper), just 5 across instead of 3, each its own block. */}
              {[row4Articles, row5Articles, row6Articles, row7Articles].map((rowArticles, rowIndex) =>
                rowArticles.length > 0 ? (
                  <div key={rowIndex} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                    {rowArticles.map((article: any) => (
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
                ) : null
              )}
            </div>
          ) : (
            <EmptyState text={locale === 'ru' ? 'Статьи появятся скоро' : 'Articles coming soon'} />
          )}
        </section>
        )}
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
