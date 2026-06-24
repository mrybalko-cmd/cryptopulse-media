import { getTranslations } from 'next-intl/server';
import VideoCard from '@/components/ui/VideoCard';
import { fetchVideos } from '@/lib/youtube';

type Props = { params: Promise<{ locale: string }> };

export default async function InterviewsPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations('interviews');

  const videos = await fetchVideos({ limit: 12 });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">{t('title')}</h1>
        <p className="text-muted text-sm mt-1">{t('subtitle')}</p>
      </div>

      {videos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map((video: any) => (
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
        <div className="border border-dashed border-border rounded-lg py-20 flex flex-col items-center justify-center gap-3">
          <p className="text-muted text-sm">
            {locale === 'ru' ? 'Добавь YouTube API ключ в .env для загрузки интервью' : 'Add YouTube API key to .env to load interviews'}
          </p>
          <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer"
            className="text-xs text-accent hover:underline">
            console.cloud.google.com
          </a>
        </div>
      )}
    </div>
  );
}
