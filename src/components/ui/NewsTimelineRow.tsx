'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { ArrowRight, ExternalLink, Zap, Pin, Eye } from 'lucide-react';
import { TOPIC_META } from '@/lib/topicMeta';
import ArticleBadge from './ArticleBadge';

export { TOPIC_META };

const TZ = 'Europe/Prague';

interface Props {
  title: string;
  href: string;
  external: boolean;
  publishedAt: number;
  imageUrl?: string | null;
  topic?: string;
  locale: string;
  pinned?: boolean;
  breaking?: boolean;
  ownBadge?: boolean;
  badge?: string;
  views?: number;
}

export default function NewsTimelineRow({
  title, href, external, publishedAt, imageUrl, topic, locale, pinned, breaking, ownBadge = true, badge, views,
}: Props) {
  const [imgErr, setImgErr] = useState(false);

  const d = new Date(publishedAt * 1000);
  const isoStr = d.toISOString();
  const timeStr = d.toLocaleTimeString('en-GB', {
    hour: '2-digit', minute: '2-digit', hour12: false, timeZone: TZ,
  });

  const meta = topic ? TOPIC_META[topic] : null;

  const inner = (
    <article
      className="group flex items-start gap-2.5 py-2.5 border-b border-border/50 last:border-b-0 hover:bg-foreground/[0.03] -mx-2 px-2 rounded-lg transition-colors"
      itemScope
      itemType="https://schema.org/NewsArticle"
    >
      {/* Time */}
      <time
        dateTime={isoStr}
        itemProp="datePublished"
        content={isoStr}
        suppressHydrationWarning
        className="w-[38px] shrink-0 font-mono text-[11px] leading-none text-muted text-right tabular-nums mt-[3px]"
      >
        {timeStr}
      </time>

      {/* Thumbnail */}
      <div className="w-10 h-10 shrink-0 rounded-lg overflow-hidden relative border border-border/60 bg-card flex items-center justify-center">
        {imageUrl && !imgErr ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
            sizes="40px"
            unoptimized={!imageUrl.includes('cdn.sanity.io')}
            onError={() => setImgErr(true)}
          />
        ) : (
          <span className={`w-full h-full flex items-center justify-center text-sm ${meta ? meta.rowCls.split(' ')[1] : 'bg-accent/10'}`}>
            {meta ? meta.fallback : '📰'}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Badges row */}
        {(breaking || pinned || (badge && badge !== 'none')) && (
          <div className="flex items-center gap-1.5 mb-1">
            {breaking && (
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-600 text-white animate-pulse">
                <Zap size={8} fill="currentColor" />
                {locale === 'ru' ? 'Срочно' : 'Breaking'}
              </span>
            )}
            {pinned && (
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium bg-yellow-500/20 text-yellow-500">
                <Pin size={8} fill="currentColor" />
                {locale === 'ru' ? 'Закреплено' : 'Pinned'}
              </span>
            )}
            {badge && badge !== 'none' && (
              <ArticleBadge badge={badge} locale={locale} className="!px-1.5 !py-0.5 !text-[10px] !gap-0.5" />
            )}
          </div>
        )}

        {/* Title */}
        <h3
          className="text-[13px] font-medium text-foreground leading-snug group-hover:text-accent transition-colors line-clamp-2"
          itemProp="headline"
        >
          {!external && ownBadge && !breaking && (
            <Zap
              size={11}
              className="inline mr-1 -mt-px text-yellow-500 shrink-0"
              fill="currentColor"
              aria-label={locale === 'ru' ? 'Наш материал' : 'Our story'}
            />
          )}
          {title}
        </h3>

        {/* Topic pill + views */}
        {(meta || typeof views === 'number') && (
          <div className="flex items-center gap-2 mt-1.5">
            {meta && (
              <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${meta.rowCls}`}>
                <span className={`w-1 h-1 rounded-full shrink-0 ${meta.dotCls}`} />
                {locale === 'ru' ? meta.ru : meta.en}
              </span>
            )}
            {!external && typeof views === 'number' && (
              <span className="flex items-center gap-1 text-[10px] text-muted">
                <Eye size={10} />
                {views}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Arrow */}
      <span className="shrink-0 mt-[3px] opacity-0 group-hover:opacity-50 transition-opacity text-muted">
        {external
          ? <ExternalLink size={12} />
          : <ArrowRight size={12} />}
      </span>
    </article>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer nofollow" className="block">
        {inner}
      </a>
    );
  }
  return <Link href={href} className="block">{inner}</Link>;
}
