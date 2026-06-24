import Image from 'next/image';
import { Play, ExternalLink } from 'lucide-react';

interface VideoCardProps {
  title: string;
  channelName: string;
  thumbnail: string;
  videoId: string;
  publishedAt: string;
  locale: string;
}

export default function VideoCard({ title, channelName, thumbnail, videoId, publishedAt, locale }: VideoCardProps) {
  const date = new Date(publishedAt).toLocaleDateString(locale === 'ru' ? 'ru-RU' : 'en-US', {
    day: 'numeric', month: 'short', year: 'numeric'
  });
  const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

  return (
    <a
      href={videoUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-card border border-border rounded-lg overflow-hidden hover:border-accent/40 transition-all duration-200"
    >
      <div className="relative aspect-video overflow-hidden">
        <Image src={thumbnail} alt={title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-background/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-12 h-12 rounded-full bg-accent/90 flex items-center justify-center">
            <Play size={18} className="text-background ml-0.5" fill="currentColor" />
          </div>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-sm font-medium text-foreground leading-snug line-clamp-2 group-hover:text-accent transition-colors">
          {title}
        </h3>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded-full bg-accent/20 flex items-center justify-center">
              <span className="text-accent text-xs font-bold">▶</span>
            </div>
            <span className="text-xs text-muted">{channelName}</span>
            <span className="text-border">·</span>
            <span className="text-xs text-muted">{date}</span>
          </div>
          <ExternalLink size={12} className="text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </a>
  );
}
