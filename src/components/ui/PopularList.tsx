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
//
// Layout (variant "C2"): the #1 story is featured with a coral accent bar and
// a larger title (no rank number / no extra label — the single flame in the
// header already says "hot"), a hairline divider, then a ranked list 2..N. On
// the homepage the card stretches to the "Тема дня" height, so on lg+ the list
// spreads to fill it; on mobile it stays naturally spaced.
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
  const viewsLabel = isRu ? 'просмотров' : 'views';
  const hrefFor = (it: PopularItem) => `/${locale}/${it._type === 'article' ? 'articles' : 'news'}/${it.slug}`;

  const [first, ...rest] = items;

  const content = (
    <>
      <TitleTag className="flex items-center gap-2 text-sm font-bold text-foreground mb-4">
        <Flame size={21} className="text-red-600" fill="currentColor" />
        {isRu ? 'Популярное' : 'Most read'}
      </TitleTag>

      <div className="flex flex-col lg:flex-1">
        {/* #1 — featured with a coral accent bar and a bigger title (no rank). */}
        <Link href={hrefFor(first)} className="group block border-l-[3px] border-article-accent pl-3.5">
          <ItemTag className="text-base font-bold text-foreground leading-snug line-clamp-3 group-hover:text-[var(--title-hover)] transition-colors">
            {first.title}
          </ItemTag>
          <p className="flex items-center gap-1.5 text-[11px] text-muted mt-2">
            <Eye size={11} />
            {first.views} {viewsLabel}
          </p>
        </Link>

        <div className="h-px bg-border my-4" />

        <div className="flex flex-col gap-3 lg:flex-1 lg:justify-between">
          {rest.map((item, i) => (
            <Link key={item._id} href={hrefFor(item)} className="group flex items-start gap-2.5">
              <span className="text-base font-extrabold text-accent/40 leading-none shrink-0 w-4 text-center">{i + 2}</span>
              <div className="min-w-0">
                <ItemTag className="text-xs font-semibold text-foreground leading-snug line-clamp-2 group-hover:text-[var(--title-hover)] transition-colors">
                  {item.title}
                </ItemTag>
                <p className="flex items-center gap-1 text-[11px] text-muted mt-1">
                  <Eye size={10} />
                  {item.views} {viewsLabel}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );

  if (bare) return content;

  return <div className="bg-card border border-border rounded-lg p-4 h-full flex flex-col">{content}</div>;
}
