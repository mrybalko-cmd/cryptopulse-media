import ShareButtons from './ShareButtons';
import PopularList from './PopularList';
import type { PopularItem } from '@/lib/sanity';

// Desktop sticky sidebar for article/news detail pages — Share + Popular
// merged into one card instead of two separate floating blocks.
export default function ArticleSidebar({
  url,
  title,
  locale,
  popularItems,
}: {
  url: string;
  title: string;
  locale: string;
  popularItems: PopularItem[];
}) {
  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <ShareButtons url={url} title={title} locale={locale} vertical={false} />
      {popularItems.length > 0 && (
        <>
          <hr className="border-border my-4" />
          <PopularList items={popularItems} locale={locale} bare />
        </>
      )}
    </div>
  );
}
