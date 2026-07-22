import ShareButtons from './ShareButtons';

export default function ArticleFooterMeta({
  date,
  time,
  url,
  title,
  locale,
}: {
  date: string;
  time: string;
  url: string;
  title: string;
  locale: string;
}) {
  const isRu = locale === 'ru';
  return (
    <div className="flex items-center justify-between gap-4 flex-wrap mt-8 py-4 border-t border-b border-border">
      <span className="text-sm text-muted">
        {isRu ? 'Опубликовано' : 'Published'}: {date} · {time}
      </span>
      <ShareButtons url={url} title={title} locale={locale} vertical={false} />
    </div>
  );
}
