import Link from 'next/link';
import { Zap, Pin, Eye } from 'lucide-react';

interface NewsListItemProps {
  title: string;
  href: string;
  external: boolean;
  publishedAt: number;
  category?: string;
  locale: string;
  pinned?: boolean;
  breaking?: boolean;
  ownBadge?: boolean;
  views?: number;
  aiTopic?: boolean;
}

export default function NewsListItem({ title, href, external, publishedAt, category, locale, pinned, breaking, ownBadge = true, views, aiTopic }: NewsListItemProps) {
  const date = new Date(publishedAt * 1000);
  const dateStr = date.toLocaleDateString(locale === 'ru' ? 'ru-RU' : 'en-US', {
    day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'Europe/Prague',
  });
  const timeStr = date.toLocaleTimeString(locale === 'ru' ? 'ru-RU' : 'en-US', {
    hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Prague',
  });

  const className = "group block py-3 px-3 -mx-3 rounded-lg border-b border-border last:border-b-0 hover:bg-foreground/5 hover:shadow-lg hover:shadow-black/10 hover:scale-[1.01] transition-all duration-200";

  const content = (
    <>
      {breaking && (
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-bold bg-red-600 text-white mb-1.5 animate-pulse">
          <Zap size={10} fill="currentColor" />
          {locale === 'ru' ? 'Важное' : 'Breaking'}
        </span>
      )}
      <h3 className="text-sm font-bold text-foreground leading-snug group-hover:text-accent transition-colors">
        {aiTopic && (
          <span className="float-left mr-1.5 mt-0.5 w-4 h-4 rounded bg-blue-600 flex items-center justify-center shrink-0" title="AI">
            <Zap size={10} className="text-white" fill="currentColor" />
          </span>
        )}
        {!external && ownBadge && !aiTopic && (
          <span className="float-left mr-1.5 mt-0.5 w-4 h-4 rounded bg-red-600 flex items-center justify-center" title={locale === 'ru' ? 'Наш материал' : 'Our story'}>
            <Zap size={10} className="text-yellow-400" fill="currentColor" />
          </span>
        )}
        {pinned && (
          <span className="float-left mr-1.5 mt-0.5 w-4 h-4 rounded bg-yellow-500 flex items-center justify-center" title={locale === 'ru' ? 'Закреплено' : 'Pinned'}>
            <Pin size={10} className="text-background" fill="currentColor" />
          </span>
        )}
        {title}
      </h3>
      <div className="flex items-center justify-between gap-x-3 gap-y-1 mt-1.5 flex-wrap">
        <span className="text-xs text-muted whitespace-nowrap">
          {dateStr} <span className="text-muted/60">•</span> {timeStr}
        </span>
        <div className="flex items-center gap-2 shrink-0">
          {!external && typeof views === 'number' && views > 0 && (
            <span className="flex items-center gap-1 text-xs text-muted">
              <Eye size={11} />
              {views}
            </span>
          )}
          {category && (
            <span className="text-xs text-muted truncate">{category}</span>
          )}
        </div>
      </div>
    </>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer nofollow" className={className}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {content}
    </Link>
  );
}
