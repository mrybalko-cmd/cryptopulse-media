'use client';

import { ExternalLink, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ru, enUS } from 'date-fns/locale';


interface NewsCardProps {
  title: string;
  source: string;
  url: string;
  publishedAt: number;
  categories?: string;
  locale: string;
  imageUrl?: string | null;
}

export default function NewsCard({ title, source, url, publishedAt, categories, locale, imageUrl }: NewsCardProps) {
  const dateLocale = locale === 'ru' ? ru : enUS;
  const timeAgo = formatDistanceToNow(new Date(publishedAt * 1000), { addSuffix: true, locale: dateLocale });
  const tags = categories?.split('|').filter(Boolean).slice(0, 2) || [];

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-card border border-border rounded-lg overflow-hidden hover:border-accent/40 transition-all duration-200"
    >
      {imageUrl && (
        <div className="relative h-32 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageUrl} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-card/60 to-transparent" />
        </div>
      )}
      <div className="p-4">
        {tags.length > 0 && (
          <div className="flex gap-1.5 mb-2 flex-wrap">
            {tags.map(tag => (
              <span key={tag} className="text-xs px-1.5 py-0.5 rounded bg-background text-accent border border-accent/20 uppercase font-mono">
                {tag}
              </span>
            ))}
          </div>
        )}
        <h3 className="text-sm font-medium text-foreground leading-snug group-hover:text-accent transition-colors line-clamp-3">
          {title}
        </h3>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted font-medium">{source}</span>
            <span className="text-border">·</span>
            <Clock size={10} className="text-muted" />
            <span className="text-xs text-muted">{timeAgo}</span>
          </div>
          <ExternalLink size={12} className="text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </a>
  );
}
