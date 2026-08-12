import Image from 'next/image';
import { sanityImageTransform } from '@/lib/sanityImage';
import { PRODUCT_CATEGORIES, exchangeHasProductCategory } from '@/lib/exchangeFilters';
import type { ExchangeRaw } from '@/lib/sanity';

// Volume is the one figure the whole section is ranked on, so it carries the
// violet gradient — everywhere else emphasis comes from weight alone.
export const VOLUME_GRADIENT =
  'bg-[linear-gradient(90deg,var(--violet),var(--violet-2))] bg-clip-text text-transparent font-black tabular-nums -tracking-[0.03em]';

export const GLASS_PANEL =
  'border border-[var(--glass-line)] bg-[image:var(--glass-fill)] rounded-[20px] ' +
  'shadow-[inset_0_1px_0_var(--glass-hi),var(--glass-shadow)] overflow-hidden';

export function formatVolume(v: number | null | undefined): string {
  if (!v) return '—';
  if (v >= 1e9) return `$${(v / 1e9).toFixed(1)}B`;
  if (v >= 1e6) return `$${Math.round(v / 1e6)}M`;
  return `$${v.toLocaleString('en-US')}`;
}

// The listing shows just "MiCA licence" — the jurisdiction ("(Malta)") only
// matters on the exchange's own page, where there is room to explain it.
export function licenceLabel(exchange: ExchangeRaw, short = false): string | null {
  const badge = exchange.badges?.find(b => b.tone === 'license');
  if (!badge) return null;
  const full = (badge.textEn || badge.textRu || '').replace(/\s*\([^)]*\)\s*$/, '').trim();
  if (!full) return null;
  return short ? full.split(' ')[0] : full;
}

export function productLabels(exchange: ExchangeRaw, locale: string): string[] {
  const isRu = locale === 'ru';
  return PRODUCT_CATEGORIES.filter(c => exchangeHasProductCategory(exchange, c.value)).map(c => {
    // The filter menu can afford "Earn / Staking"; a chip in a 176px column
    // cannot, and the half before the slash already names the thing.
    const label = isRu ? c.labelRu : c.labelEn;
    return label.split(' / ')[0];
  });
}

export function slugFor(exchange: ExchangeRaw, locale: string): string {
  return locale === 'ru' ? exchange.slugRu : exchange.slugEn;
}

/**
 * Size comes from CSS custom properties rather than inline width/height, so a
 * caller can ask for a different size per breakpoint with `sizeMobile` instead
 * of rendering the logo twice and hiding one.
 *
 * That matters beyond tidiness: this element used to carry an inline
 * `display: inline-block`, and an inline declaration beats any `md:hidden`
 * class, so a caller that rendered two sizes got both of them on screen.
 */
export function ExchangeLogo({
  exchange,
  size,
  sizeMobile,
  className = '',
}: {
  exchange: ExchangeRaw;
  size: number;
  sizeMobile?: number;
  className?: string;
}) {
  const vars = {
    '--logo-sm': `${sizeMobile ?? size}px`,
    '--logo-lg': `${size}px`,
  } as React.CSSProperties;

  const shared =
    'rounded-[10px] overflow-hidden shrink-0 border border-[var(--glass-line)] shadow-[0_3px_10px_rgba(0,0,0,0.18)] ' +
    'w-[var(--logo-sm)] h-[var(--logo-sm)] md:w-[var(--logo-lg)] md:h-[var(--logo-lg)] ' +
    className;

  if (!exchange.logo) {
    return (
      <span
        className={`${shared} flex items-center justify-center text-white font-black text-[calc(var(--logo-sm)*0.36)] md:text-[calc(var(--logo-lg)*0.36)]`}
        style={{ ...vars, background: exchange.logoBg || '#3b82f6' }}
        aria-hidden="true"
      >
        {exchange.name.slice(0, 2).toUpperCase()}
      </span>
    );
  }
  return (
    // Decorative on purpose, and marked so explicitly. Every placement puts the
    // exchange name in text right beside the mark, so alt text would make a
    // screen reader announce the same name twice. aria-hidden states that the
    // empty alt is a decision rather than an oversight — an audit otherwise
    // reads it as 29 images "missing" alt on this page alone.
    <span className={`${shared} inline-block`} style={vars} aria-hidden="true">
      <Image
        src={sanityImageTransform(exchange.logo, { width: size * 2 })!}
        alt=""
        width={size}
        height={size}
        className="w-full h-full object-cover"
        unoptimized
      />
    </span>
  );
}

export function ProductChips({ labels, max }: { labels: string[]; max: number }) {
  const shown = labels.slice(0, max);
  const extra = labels.length - shown.length;
  return (
    <>
      {shown.map(l => (
        <span
          key={l}
          className="rounded-md bg-[var(--rates-inset)] px-[7px] py-[3px] text-[9.5px] font-extrabold text-muted whitespace-nowrap"
        >
          {l}
        </span>
      ))}
      {extra > 0 && (
        <span className="rounded-md bg-[var(--rates-inset)] px-[7px] py-[3px] text-[9.5px] font-extrabold text-muted">
          +{extra}
        </span>
      )}
    </>
  );
}

export function LicenceChip({ label, className = '' }: { label: string; className?: string }) {
  return (
    <span
      className={`inline-block rounded-full bg-positive/15 px-[9px] py-1 text-[10px] font-extrabold text-positive whitespace-nowrap ${className}`}
    >
      {label}
    </span>
  );
}

/**
 * Only rendered when the exchange actually has a trade link. The old listing
 * showed a blurred disabled button for the thirteen exchanges that don't,
 * which read as broken rather than as "not available".
 */
export function TradeButton({
  exchange,
  isRu,
  size = 'md',
}: {
  exchange: ExchangeRaw;
  isRu: boolean;
  size?: 'sm' | 'md';
}) {
  if (!exchange.tradeUrl) return null;
  return (
    <a
      href={exchange.tradeUrl}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className={`relative z-20 inline-flex items-center gap-1.5 rounded-[10px] bg-positive font-extrabold text-white whitespace-nowrap
        shadow-[0_6px_18px_color-mix(in_srgb,var(--positive)_32%,transparent),inset_0_1px_0_rgba(255,255,255,0.25)]
        hover:brightness-110 transition-[filter] ${size === 'sm' ? 'px-2.5 py-1.5 text-[10px]' : 'px-3.5 py-2 text-[11.5px]'}`}
    >
      {isRu ? 'Торговать' : 'Trade'}
      <svg viewBox="0 0 24 24" aria-hidden className={size === 'sm' ? 'w-2.5 h-2.5' : 'w-3 h-3'} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 3h6v6" />
        <path d="M10 14 21 3" />
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      </svg>
    </a>
  );
}

export function PinIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 17v5" />
      <path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z" />
    </svg>
  );
}
