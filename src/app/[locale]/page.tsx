import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import NewsCard from '@/components/ui/NewsCard';
import ArticleCard from '@/components/ui/ArticleCard';
import VideoCard from '@/components/ui/VideoCard';
import { fetchNews } from '@/lib/cryptonews';
import { fetchArticles } from '@/lib/sanity';
import { fetchVideos } from '@/lib/youtube';

type Props = { params: Promise<{ locale: string }> };

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations('home');

  const [news, articles, videos] = await Promise.allSettled([
    fetchNews({ limit: 6 }),
    fetchArticles({ limit: 4, locale }),
    fetchVideos({ limit: 3 }),
  ]);

  const newsItems = news.status === 'fulfilled' ? news.value : [];
  const articleItems = articles.status === 'fulfilled' ? articles.value : [];
  const videoItems = videos.status === 'fulfilled' ? videos.value : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Hero */}
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <span className="text-accent text-xs font-medium uppercase tracking-widest">Live</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight max-w-xl">
          {t('hero')}
        </h1>
      </div>

      {/* News */}
      <section className="mb-14">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-foreground uppercase tracking-widest">{t('latestNews')}</h2>
          <Link href={`/${locale}/news`} className="flex items-center gap-1 text-xs text-muted hover:text-accent transition-colors">
            {t('viewAll')} <ArrowRight size={12} />
          </Link>
        </div>
        {newsItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {newsItems.map((item: any) => (
              <NewsCard
                key={item.id}
                title={item.title}
                source={item.source}
                url={item.url}
                publishedAt={item.publishedAt}
                categories={item.categories}
                imageUrl={item.imageUrl}
                locale={locale}
              />
            ))}
          </div>
        ) : (
          <EmptyState text={locale === 'ru' ? 'Новости загружаются...' : 'Loading news...'} />
        )}
      </section>

      {/* Articles */}
      <section className="mb-14">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-foreground uppercase tracking-widest">{t('featuredArticles')}</h2>
          <Link href={`/${locale}/articles`} className="flex items-center gap-1 text-xs text-muted hover:text-accent transition-colors">
            {t('viewAll')} <ArrowRight size={12} />
          </Link>
        </div>
        {articleItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {articleItems.map((article: any, i: number) => (
              <ArticleCard
                key={article._id}
                title={article.title}
                excerpt={article.excerpt}
                slug={article.slug.current}
                coverImage={article.coverImage}
                publishedAt={article.publishedAt}
                readingTime={article.readingTime}
                locale={locale}
                featured={i === 0}
              />
            ))}
          </div>
        ) : (
          <EmptyState text={locale === 'ru' ? 'Статьи появятся скоро' : 'Articles coming soon'} />
        )}
      </section>

      {/* Videos */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-foreground uppercase tracking-widest">{t('latestInterviews')}</h2>
          <Link href={`/${locale}/interviews`} className="flex items-center gap-1 text-xs text-muted hover:text-accent transition-colors">
            {t('viewAll')} <ArrowRight size={12} />
          </Link>
        </div>
        {videoItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
