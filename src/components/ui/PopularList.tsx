import Image from 'next/image';
import Link from 'next/link';
import { Eye } from 'lucide-react';
import FlameIcon from './FlameIcon';
import { TOPIC_TAG } from '@/lib/topics';
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
// Layout ("glass"): one translucent panel with a light top edge; nothing
// inside gets its own border. #1 is a cover with the headline on a blurred
// plate over its lower edge — readable whatever the cover shows, which
// matters because ours routinely carry their own wordmark. Places 2–4 are
// plain rows that only light up on hover, their rank a hot-gradient token on
// the corner of the thumbnail. Everything below is a text row with the rank
// on the LEFT, filled with the same gradient, so the numbers form one column
// top to bottom. Four covers total — this widget sits on nearly every page,
// so its weight matters more than its polish.
//
// On the homepage the card stretches to the "Тема дня" height, so on lg+ the
// tail spreads to fill it; on mobile it stays naturally spaced.

/**
 * Ask Sanity's CDN for a pre-cropped copy instead of handing a 2752×1536 PNG
 * to Next's optimizer for a 40px thumbnail. Without this the first render of
 * a fresh cover times out (observed: 500 after 38s in dev), and this widget
 * asks for four covers on nearly every page of the site.
 */
function sized(url: string, w: number, h: number): string {
  return `${url}?w=${w}&h=${h}&fit=crop&auto=format`;
}

/** Yellow → orange → red, the same run of colour as the flame in the header. */
const HOT_GRADIENT = 'linear-gradient(135deg, #fbbf24, #f97316 55%, #ef4444)';

function TopicLabel({ topic, locale }: { topic?: string; locale: 'ru' | 'en' }) {
  const meta = topic ? TOPIC_TAG[topic] : undefined;
  if (!meta) return null;
  return (
    <span
      className="text-[9.5px] font-bold uppercase tracking-wide whitespace-nowrap"
      style={{ color: meta.color }}
    >
      {meta[locale]}
    </span>
  );
}

function Views({ count, label, className = '' }: { count: number; label: string; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-[10.5px] tabular-nums whitespace-nowrap ${className}`}
      title={`${count} ${label}`}
      aria-label={`${count} ${label}`}
    >
      <Eye size={10} aria-hidden />
      {count}
    </span>
  );
}

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
  const loc = (isRu ? 'ru' : 'en') as 'ru' | 'en';
  const TitleTag = asHeadings ? 'h2' : 'p';
  const ItemTag = asHeadings ? 'h3' : 'p';
  const viewsLabel = isRu ? 'просмотров' : 'views';
  const hrefFor = (it: PopularItem) => `/${locale}/${it._type === 'article' ? 'articles' : 'news'}/${it.slug}`;

  const [first, ...others] = items;
  const withThumb = others.slice(0, 3);
  const tail = others.slice(3);
  // Two copies of this widget can share a page (desktop aside + mobile), and
  // the flame's gradient ids must not collide between them.
  const flameId = `${asHeadings ? 'd' : 'm'}${first._id.slice(-6)}`;

  const content = (
    <>
      <TitleTag className="flex items-center gap-2 mb-3">
        <FlameIcon id={flameId} size={22} />
        <span className="text-xs font-extrabold uppercase tracking-[0.1em] text-foreground">
          {isRu ? 'Популярное' : 'Most read'}
        </span>
        <span className="ml-auto text-[10px] text-muted tabular-nums">
          {isRu ? 'Топ' : 'Top'} {items.length}
        </span>
      </TitleTag>

      <div className="flex flex-col lg:flex-1">
        {/* #1 — cover with the headline on a blurred plate over its lower edge */}
        <Link href={hrefFor(first)} className="group relative block rounded-[15px] overflow-hidden">
          {first.coverImage ? (
            <Image
              src={sized(first.coverImage, 640, 350)}
              alt=""
              width={320}
              height={175}
              sizes="256px"
              className="w-full h-[124px] object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
          ) : (
            <span className="block w-full h-[124px] bg-card-hover" />
          )}
          <span className="absolute inset-x-2 bottom-2 rounded-[11px] px-2.5 py-2 border border-white/15 bg-black/55 backdrop-blur-md">
            <ItemTag className="text-[12.5px] font-semibold text-white leading-[1.3] line-clamp-2">
              {first.title}
            </ItemTag>
            <span className="flex items-center gap-2 mt-1">
              <Views count={first.views} label={viewsLabel} className="text-white/75" />
              {first.topic && TOPIC_TAG[first.topic] && (
                <span className="text-[9.5px] font-bold uppercase tracking-wide text-white/70">
                  {TOPIC_TAG[first.topic][loc]}
                </span>
              )}
            </span>
          </span>
        </Link>

        <div className="flex flex-col mt-1.5 lg:flex-1 lg:justify-between">
          {/* 2–4 — rows that only light up on hover */}
          <div className="flex flex-col">
            {withThumb.map((item, i) => (
              <Link
                key={item._id}
                href={hrefFor(item)}
                className="group grid grid-cols-[40px_minmax(0,1fr)] gap-2.5 items-center p-2.5 mt-0.5 rounded-xl transition-colors hover:bg-[var(--popular-glass)]"
              >
                <span className="relative block w-10 h-10">
                  {item.coverImage ? (
                    <Image
                      src={sized(item.coverImage, 96, 96)}
                      alt=""
                      width={80}
                      height={80}
                      sizes="40px"
                      className="w-10 h-10 rounded-[11px] object-cover"
                    />
                  ) : (
                    <span className="block w-10 h-10 rounded-[11px] bg-card-hover" />
                  )}
                  <span
                    className="absolute -left-[5px] -top-[5px] w-[18px] h-[18px] rounded-full flex items-center justify-center text-[9.5px] font-black text-white tabular-nums shadow-[0_2px_10px_rgba(249,115,22,0.6)]"
                    style={{ background: HOT_GRADIENT }}
                  >
                    {i + 2}
                  </span>
                </span>
                <span className="min-w-0">
                  <ItemTag className="text-[11.5px] font-semibold text-foreground leading-[1.3] line-clamp-2 group-hover:text-[var(--title-hover)] transition-colors">
                    {item.title}
                  </ItemTag>
                  <span className="flex items-center gap-2 mt-1">
                    <TopicLabel topic={item.topic} locale={loc} />
                    <Views count={item.views} label={viewsLabel} className="text-muted" />
                  </span>
                </span>
              </Link>
            ))}
          </div>

          {/* 5+ — text rows, rank on the LEFT, filled with the same gradient */}
          {tail.length > 0 && (
            <div className="flex flex-col lg:flex-1 lg:justify-between">
              {tail.map((item, i) => (
                <Link
                  key={item._id}
                  href={hrefFor(item)}
                  className="group grid grid-cols-[20px_minmax(0,1fr)] gap-2.5 items-center px-2 py-2.5 mt-0.5 rounded-xl border-t border-border/60 transition-colors hover:bg-[var(--popular-glass)]"
                >
                  <span
                    className="text-[13.5px] font-black tabular-nums text-center leading-none bg-clip-text text-transparent"
                    style={{ backgroundImage: HOT_GRADIENT }}
                  >
                    {i + 5}
                  </span>
                  <ItemTag className="text-[11.5px] font-semibold text-foreground leading-[1.3] line-clamp-2 group-hover:text-[var(--title-hover)] transition-colors">
                    {item.title}
                  </ItemTag>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );

  if (bare) return content;

  return (
    <div className="rounded-[20px] border border-[var(--popular-glass-line)] bg-[var(--popular-glass)] p-[15px] h-full flex flex-col shadow-[inset_0_1px_0_var(--popular-glass-line),var(--popular-shadow)]">
      {content}
    </div>
  );
}
