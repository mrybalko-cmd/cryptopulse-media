import Link from 'next/link';
import Image from 'next/image';
import { sanityImageTransform } from '@/lib/sanityImage';
import type { ExchangeMention } from '@/lib/sanity';

function formatDate(iso: string, locale: string) {
  return new Date(iso).toLocaleDateString(locale === 'ru' ? 'ru-RU' : 'en-US', { day: 'numeric', month: 'short' });
}

const VISIBLE = 4;

// On the page itself now (not a sidebar list) — a real module you can browse,
// with a link through to the full archive once there's more than fits here.
// Horizontal scroll-snap row on mobile ("листаются в сторону"), a normal
// grid from sm: up.
export default function ExchangeNewsSection({
  exchangeName,
  slug,
  mentions,
  locale,
}: {
  exchangeName: string;
  slug: string;
  mentions: ExchangeMention[];
  locale: string;
}) {
  if (mentions.length === 0) return null;
  const isRu = locale === 'ru';
  const visible = mentions.slice(0, VISIBLE);

  return (
    <section id="news" className="scroll-mt-28">
      <h2 className="text-lg font-bold text-foreground mb-3">{isRu ? `Новости ${exchangeName}` : `${exchangeName} News`}</h2>
      <div className="flex sm:grid sm:grid-cols-2 gap-3 overflow-x-auto sm:overflow-visible snap-x snap-mandatory sm:snap-none pb-1 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0">
        {visible.map((m, i) => (
          <Link
            key={i}
            href={`/${locale}/${m._type === 'news' ? 'news' : 'articles'}/${m.slug}`}
            className="shrink-0 w-[78%] sm:w-auto sm:shrink flex gap-3 border border-border rounded-xl p-3 bg-card hover:border-accent/50 transition-colors snap-start"
          >
            <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-background">
              {m.coverImage && (
                <Image src={sanityImageTransform(m.coverImage, { width: 112 })!} alt={m.title} fill className="object-cover" unoptimized />
              )}
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-extrabold text-accent uppercase tracking-wide">
                {m._type === 'news' ? (isRu ? 'Новость' : 'News') : (isRu ? 'Статья' : 'Article')}
              </span>
              <p className="text-xs font-bold text-foreground leading-snug line-clamp-2 mt-0.5">{m.title}</p>
              <p className="text-[11px] text-muted mt-1">{formatDate(m.publishedAt, locale)}</p>
            </div>
          </Link>
        ))}
      </div>
      {mentions.length > VISIBLE && (
        <Link href={`/${locale}/exchanges/${slug}/news`} className="inline-block text-sm font-semibold text-accent mt-3 hover:underline">
          {isRu ? `Показать все новости о ${exchangeName} →` : `Show all ${exchangeName} coverage →`}
        </Link>
      )}
    </section>
  );
}
