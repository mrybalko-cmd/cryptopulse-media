import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, Eye, Flame, Zap } from 'lucide-react';
import { TOPIC_TAG } from '@/lib/topics';
import type { PopularItem } from '@/lib/sanity';
import type { CSSProperties } from 'react';

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
// Layout ("layers"): #1 is a cover with the headline BELOW it — never over
// it, since our covers routinely carry their own wordmark or headline text.
// Places 2–4 are separate glass tiles resting on the panel with a shadow and
// a coloured halo underneath; the rank sits as a token on the corner of the
// thumbnail, tinted with the material's topic colour so the token, the halo
// and the topic dot all speak one colour. Everything below is a text row
// with the rank on the LEFT, so the numbers form one straight column top to
// bottom. Four covers total — this widget sits on nearly every page, so its
// weight matters more than its polish.
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

function topicColor(topic?: string): string {
  return (topic && TOPIC_TAG[topic]?.color) || 'var(--accent)';
}

function TopicDot({ topic, locale }: { topic?: string; locale: 'ru' | 'en' }) {
  const meta = topic ? TOPIC_TAG[topic] : undefined;
  if (!meta) return null;
  return (
    <span className="inline-flex items-center gap-1 text-[9.5px] font-extrabold text-muted whitespace-nowrap">
      <span className="w-[5px] h-[5px] rounded-full shrink-0" style={{ background: meta.color }} />
      {meta[locale]}
    </span>
  );
}

/**
 * Count only — the word itself ("просмотров" is 11 characters) overflowed the
 * 256px tile. The eye icon already says what the number is, and the full
 * phrase stays available to screen readers and on hover.
 */
function Views({ count, label }: { count: number; label: string }) {
  return (
    <span
      className="inline-flex items-center gap-1 text-[10.5px] text-muted tabular-nums whitespace-nowrap"
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
  const tiles = others.slice(0, 3);
  const tail = others.slice(3);

  const content = (
    <>
      <TitleTag className="flex items-center gap-2 mb-2.5">
        <span className="w-[22px] h-[22px] rounded-lg flex items-center justify-center shrink-0 bg-gradient-to-br from-orange-400 to-red-500 shadow-lg shadow-red-500/40">
          <Flame size={13} className="text-white" fill="currentColor" />
        </span>
        <span className="text-[13.5px] font-black text-foreground -tracking-[0.02em]">
          {isRu ? 'Популярное' : 'Most read'}
        </span>
      </TitleTag>

      <div className="flex flex-col lg:flex-1">
        {/* #1 — cover, headline strictly underneath */}
        <Link
          href={hrefFor(first)}
          className="group relative block rounded-[14px] overflow-hidden ring-1 ring-inset ring-[var(--popular-glass-line)] shadow-[var(--popular-lead-shadow)]"
        >
          {first.coverImage ? (
            <Image
              src={sized(first.coverImage, 640, 256)}
              alt=""
              width={320}
              height={128}
              sizes="256px"
              className="w-full h-16 object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
          ) : (
            <span className="block w-full h-16 bg-card-hover" />
          )}
          <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full px-2 py-[3px] text-[9px] font-black uppercase tracking-wider text-white whitespace-nowrap bg-gradient-to-r from-orange-400 to-red-500 shadow-lg shadow-red-500/50">
            <Zap size={9} fill="currentColor" />
            {isRu ? '№1 сегодня' : '#1 today'}
          </span>
          <span
            className="block px-[11px] pt-2 pb-2.5"
            style={{
              background: `linear-gradient(180deg, color-mix(in srgb, ${topicColor(first.topic)} 12%, var(--card)), var(--card))`,
            }}
          >
            <ItemTag className="text-[13.5px] font-black -tracking-[0.02em] text-foreground leading-[1.25] line-clamp-2 group-hover:text-[var(--title-hover)] transition-colors">
              {first.title}
            </ItemTag>
            <span className="flex items-center gap-2 mt-1">
              <Views count={first.views} label={viewsLabel} />
              <TopicDot topic={first.topic} locale={loc} />
            </span>
          </span>
        </Link>

        <div className="flex flex-col gap-1.5 mt-2.5 lg:flex-1 lg:justify-between">
          {/* 2–4 — glass tiles with a topic-coloured halo underneath */}
          {tiles.map((item, i) => {
            const color = topicColor(item.topic);
            return (
              <Link
                key={item._id}
                href={hrefFor(item)}
                style={{ '--tc': color } as CSSProperties}
                className="group relative grid grid-cols-[40px_minmax(0,1fr)_14px] gap-2.5 items-center px-[9px] py-[7px] rounded-[13px] bg-[var(--popular-glass)] border border-[var(--popular-glass-line)] shadow-[var(--popular-row-shadow)] transition-all hover:-translate-y-px hover:border-[var(--tc)]"
              >
                {/* Halo — always lit under #2, appears on hover for the rest */}
                <span
                  aria-hidden
                  className={`pointer-events-none absolute inset-x-[12%] -bottom-[7px] h-3 rounded-[50%] blur-[6px] transition-opacity ${
                    i === 0 ? 'opacity-80' : 'opacity-0 group-hover:opacity-100'
                  }`}
                  style={{
                    background: `radial-gradient(60% 100% at 50% 0%, color-mix(in srgb, ${color} 42%, transparent), transparent 72%)`,
                  }}
                />
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
                    className="absolute -left-[5px] -top-[5px] w-[17px] h-[17px] rounded-full flex items-center justify-center text-[9px] font-black text-white tabular-nums"
                    style={{
                      background: `linear-gradient(135deg, ${color}, color-mix(in srgb, ${color} 55%, #000))`,
                      boxShadow: `0 2px 9px color-mix(in srgb, ${color} 60%, transparent)`,
                    }}
                  >
                    {i + 2}
                  </span>
                </span>
                <span className="min-w-0 relative">
                  <ItemTag className="text-[11.5px] font-extrabold -tracking-[0.01em] text-foreground leading-[1.28] line-clamp-2 group-hover:text-[var(--title-hover)] transition-colors">
                    {item.title}
                  </ItemTag>
                  <span className="flex items-center gap-[7px] mt-1">
                    <TopicDot topic={item.topic} locale={loc} />
                    <Views count={item.views} label={viewsLabel} />
                  </span>
                </span>
                <ChevronRight size={12} className="relative text-muted" />
              </Link>
            );
          })}

          {/* 5+ — text rows, rank on the LEFT so the numbers form one column */}
          {tail.map((item, i) => {
            const color = topicColor(item.topic);
            return (
              <Link
                key={item._id}
                href={hrefFor(item)}
                style={{ '--tc': color } as CSSProperties}
                className="group grid grid-cols-[20px_minmax(0,1fr)] gap-2.5 items-center px-2.5 py-[7px] rounded-[13px] border border-dashed border-[var(--popular-glass-line)] transition-all hover:border-solid hover:border-[var(--tc)] hover:bg-[var(--popular-glass)]"
              >
                <span className="text-[13px] font-black tabular-nums text-center leading-none" style={{ color }}>
                  {i + 5}
                </span>
                <ItemTag className="text-[11.5px] font-bold text-foreground leading-[1.3] line-clamp-2 group-hover:text-[var(--title-hover)] transition-colors">
                  {item.title}
                </ItemTag>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );

  if (bare) return content;

  return (
    <div className="rounded-2xl border border-border p-3.5 h-full flex flex-col bg-[image:var(--popular-panel)] shadow-[var(--popular-shadow)]">
      {content}
    </div>
  );
}
