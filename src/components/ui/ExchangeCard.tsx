import Link from 'next/link';
import Image from 'next/image';
import { sanityImageTransform } from '@/lib/sanityImage';
import ExchangeToneBadge, { type ExchangeBadgeTone } from './ExchangeToneBadge';
import type { ExchangeRaw } from '@/lib/sanity';

// Pulse gradient — same three stops as src/app/[locale]/pulse/opengraph-image.tsx
// (GRAD a/b/c), reused here so rank numbers and volume figures read as the
// same visual language as the rest of the site rather than a one-off accent.
const GRADIENT_TEXT = 'bg-[linear-gradient(90deg,#3b82f6,#06b6d4,#ec4899)] bg-clip-text text-transparent font-black';

function formatVolume(v: number | null | undefined): string {
  if (!v) return '—';
  if (v >= 1e9) return `$${(v / 1e9).toFixed(1)}B`;
  if (v >= 1e6) return `$${(v / 1e6).toFixed(1)}M`;
  return `$${v.toLocaleString('en-US')}`;
}

// The listing shows just "MiCA licence" — the jurisdiction ("(Malta)",
// "(Luxembourg)"...) only matters once you're on that exchange's own page,
// where there's room to explain it. Same badge text, just trimmed here.
function stripJurisdiction(text: string): string {
  return text.replace(/\s*\([^)]*\)\s*$/, '').trim();
}

export default function ExchangeCard({
  exchange,
  rank,
  locale,
}: {
  exchange: ExchangeRaw & { rank: number };
  rank?: number;
  locale: string;
}) {
  const isRu = locale === 'ru';
  const slug = isRu ? exchange.slugRu : exchange.slugEn;
  const tagline = isRu ? exchange.taglineRu : exchange.taglineEn;
  const displayRank = rank ?? exchange.rank;
  const initials = exchange.name.slice(0, 2).toUpperCase();
  const badges = exchange.badges?.slice(0, 2) ?? [];

  return (
    <div
      className={`flex flex-col gap-2.5 bg-card border rounded-xl px-4 py-3.5 hover:border-accent/50 hover:shadow-md transition-all ${
        exchange.pinned ? 'border-2 border-red-500' : 'border-border'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
        <Link href={`/${locale}/exchanges/${slug}`} className="flex items-center gap-3 sm:gap-4 min-w-0 sm:flex-1">
          <div className={`w-7 sm:w-9 text-center text-lg sm:text-xl shrink-0 ${GRADIENT_TEXT}`}>{displayRank}</div>

          <div className="shrink-0">
            {exchange.logo ? (
              <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl overflow-hidden shrink-0 border-2 border-[#ec4899]">
                <Image src={sanityImageTransform(exchange.logo, { width: 88 })!} alt={exchange.name} fill className="object-cover" unoptimized />
              </div>
            ) : (
              <div
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center text-white font-black text-sm shrink-0 border-2 border-[#ec4899]"
                style={{ background: exchange.logoBg || '#3b82f6' }}
              >
                {initials}
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="font-bold text-sm text-foreground truncate">{exchange.name}</p>
            {tagline && <p className="text-xs text-muted mt-0.5 truncate">{tagline}</p>}
          </div>

          <div className="hidden sm:block text-right shrink-0">
            <p className="text-[9px] uppercase tracking-wide text-muted whitespace-nowrap">{isRu ? 'Объём 24ч' : '24h volume'}</p>
            <p className={`text-sm whitespace-nowrap ${GRADIENT_TEXT}`}>{formatVolume(exchange.volume24h)}</p>
          </div>
        </Link>

        <div className="flex sm:hidden items-center justify-between gap-3 pl-[46px]">
          <div className="text-left">
            <p className="text-[9px] uppercase tracking-wide text-muted whitespace-nowrap">{isRu ? 'Объём 24ч' : '24h volume'}</p>
            <p className={`text-sm whitespace-nowrap ${GRADIENT_TEXT}`}>{formatVolume(exchange.volume24h)}</p>
          </div>
          {exchange.tradeUrl ? (
            <a
              href={exchange.tradeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 text-xs font-extrabold px-3.5 py-1.5 rounded-lg bg-positive text-white hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              {isRu ? 'Торговать' : 'Trade'}
            </a>
          ) : (
            <span
              aria-disabled="true"
              className="shrink-0 text-xs font-extrabold px-3.5 py-1.5 rounded-lg bg-[var(--card-hover)] border border-border text-muted opacity-45 blur-[0.3px] cursor-not-allowed whitespace-nowrap"
            >
              {isRu ? 'Торговать' : 'Trade'}
            </span>
          )}
        </div>

        {exchange.tradeUrl ? (
          <a
            href={exchange.tradeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-block shrink-0 text-xs font-extrabold px-3.5 py-2 rounded-lg bg-positive text-white hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            {isRu ? 'Торговать' : 'Trade'}
          </a>
        ) : (
          <span
            aria-disabled="true"
            className="hidden sm:inline-block shrink-0 text-xs font-extrabold px-3.5 py-2 rounded-lg bg-[var(--card-hover)] border border-border text-muted opacity-45 blur-[0.3px] cursor-not-allowed whitespace-nowrap"
          >
            {isRu ? 'Торговать' : 'Trade'}
          </span>
        )}
      </div>

      {badges.length > 0 && (
        <Link href={`/${locale}/exchanges/${slug}`} className="flex flex-wrap gap-1.5 pl-[46px] sm:pl-[52px]">
          {badges.map((b, i) => (
            <ExchangeToneBadge key={i} text={stripJurisdiction(isRu ? b.textRu : b.textEn)} tone={b.tone as ExchangeBadgeTone} />
          ))}
        </Link>
      )}
    </div>
  );
}
