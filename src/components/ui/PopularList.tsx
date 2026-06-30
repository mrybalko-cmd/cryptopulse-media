import Link from 'next/link';
import { Flame, Eye } from 'lucide-react';
import type { PopularItem } from '@/lib/sanity';

export default function PopularList({ items, locale }: { items: PopularItem[]; locale: string }) {
  if (items.length === 0) return null;
  const isRu = locale === 'ru';

  return (
    <div className="bg-card border border-border rounded-lg p-4 h-full flex flex-col">
      <h2 className="flex items-center gap-2 text-sm font-bold text-foreground mb-4">
        <Flame size={21} className="text-red-600" fill="currentColor" />
        {isRu ? 'Популярное' : 'Most read'}
      </h2>
      <div className="flex flex-col gap-3">
        {items.map((item, i) => (
          <Link
            key={item._id}
            href={`/${locale}/${item._type === 'article' ? 'articles' : 'news'}/${item.slug}`}
            className="group flex items-start gap-2.5"
          >
            <span className="text-lg font-extrabold text-accent/30 leading-none shrink-0">{i + 1}</span>
            <div className="min-w-0">
              <h3 className="text-xs font-semibold text-foreground leading-snug line-clamp-2 group-hover:text-accent transition-colors">
                {item.title}
              </h3>
              <p className="flex items-center gap-1 text-[11px] text-muted mt-1">
                <Eye size={10} />
                {item.views} {isRu ? 'просмотров' : 'views'}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
