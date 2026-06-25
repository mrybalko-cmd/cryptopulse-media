import Link from 'next/link';

interface NewsListItemProps {
  title: string;
  href: string;
  external: boolean;
  publishedAt: number;
  category?: string;
  locale: string;
}

export default function NewsListItem({ title, href, external, publishedAt, category, locale }: NewsListItemProps) {
  const date = new Date(publishedAt * 1000);
  const dateStr = date.toLocaleDateString(locale === 'ru' ? 'ru-RU' : 'en-US', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  });
  const timeStr = date.toLocaleTimeString(locale === 'ru' ? 'ru-RU' : 'en-US', {
    hour: '2-digit', minute: '2-digit',
  });

  const className = "group block py-3 border-b border-border last:border-b-0";

  const content = (
    <>
      <h3 className="text-sm font-bold text-foreground leading-snug group-hover:text-accent transition-colors">
        {title}
      </h3>
      <div className="flex items-center justify-between gap-3 mt-1.5">
        <span className="text-xs text-muted whitespace-nowrap">
          {dateStr} <span className="text-muted/60">•</span> {timeStr}
        </span>
        {category && (
          <span className="text-xs text-muted truncate">{category}</span>
        )}
      </div>
    </>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
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
