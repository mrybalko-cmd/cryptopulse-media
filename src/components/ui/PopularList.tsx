import Link from 'next/link';
import { Flame, Eye } from 'lucide-react';
import type { PopularItem } from '@/lib/sanity';

export default function PopularList({ items, locale }: { items: PopularItem[]; locale: string }) {
  if (items.length === 0) return null;
  const isRu = locale === 'ru';

  return (
    <section className="mb-14">
      <div className="flex items-center justify-between mb-5">
        <h2 className="flex items-center gap-2 text-sm font-bold text-foreground">
          <Flame size={21} className="text-red-600" fill="currentColor" />
          {isRu ? 'Популярное' : 'Most read'}
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((item, i) => (
          <Link
            key={item._id}
            href={`/${locale}/${item._type === 'article' ? 'articles' : 'news'}/${item.slug}`}
            className="flex items-start gap-3 bg-card border border-border rounded-lg p-3 hover:border-accent/40 transition-colors"
          >
            <span className="text-2xl font-extrabold text-accent/30 leading-none shrink-0">{i + 1}</span>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-foreground leading-snug line-clamp-2">{item.title}</h3>
              <p className="flex items-center gap-1 text-xs text-muted mt-1.5">
                <Eye size={11} />
                {item.views} {isRu ? 'просмотров' : 'views'}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
