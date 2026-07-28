import Link from 'next/link';
import { Flame, Eye } from 'lucide-react';
import type { PopularItem } from '@/lib/sanity';

// `bare` skips the card's own border/background/padding — used when a
// parent (e.g. ArticleSidebar) already supplies the surrounding card, so the
// list can sit inside it below another section without a nested box.
//
// `asHeadings` controls whether the title and item labels render as real
// <h2>/<h3> tags. Several detail pages render this same list twice — once
// for desktop (aside), once for mobile — toggled purely via CSS so only one
// is ever visible/exposed to assistive tech at a given viewport. Real
// heading tags in BOTH copies still show up as literal duplicate headings
// to crawlers/SEO auditors, so the non-canonical (mobile) copy should pass
// asHeadings={false} to render the identical markup as plain tags instead.
export default function PopularList({
  items,
  locale,
  bare = false,
  asHeadings = true,
}: {
  items: PopularItem[];
  locale: string;
  bare?: boolean;
  asHeadings?: boolean;
}) {
  if (items.length === 0) return null;
  const isRu = locale === 'ru';
  const TitleTag = asHeadings ? 'h2' : 'p';
  const ItemTag = asHeadings ? 'h3' : 'p';

  const content = (
    <>
      <TitleTag className="flex items-center gap-2 text-sm font-bold text-foreground mb-4">
        <Flame size={21} className="text-red-600" fill="currentColor" />
        {isRu ? 'Популярное' : 'Most read'}
      </TitleTag>
      <div className="flex flex-col gap-3">
        {items.map((item, i) => (
          <Link
            key={item._id}
            href={`/${locale}/${item._type === 'article' ? 'articles' : 'news'}/${item.slug}`}
            className="group flex items-start gap-2.5"
          >
            <span className="text-lg font-extrabold text-accent/30 leading-none shrink-0">{i + 1}</span>
            <div className="min-w-0">
              <ItemTag className="text-xs font-semibold text-foreground leading-snug line-clamp-2 group-hover:text-accent transition-colors">
                {item.title}
              </ItemTag>
              <p className="flex items-center gap-1 text-[11px] text-muted mt-1">
                <Eye size={10} />
                {item.views} {isRu ? 'просмотров' : 'views'}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );

  if (bare) return content;

  return <div className="bg-card border border-border rounded-lg p-4 h-full flex flex-col">{content}</div>;
}
