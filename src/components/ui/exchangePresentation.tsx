import Image from 'next/image';
import Link from 'next/link';
import { sanityImageTransform } from '@/lib/sanityImage';
import { PRODUCT_CATEGORIES, exchangeHasProductCategory } from '@/lib/exchangeFilters';
import { activeTradeUrl, venueButtonColor, type VenueButtonColor } from '@/lib/exchangePlacements';
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

/** Предупреждение из плашек, когда лицензии нет: например «Ограничена в ЕС». */
export function restrictionLabel(exchange: ExchangeRaw, isRu: boolean): string | null {
  const badge = exchange.badges?.find(b => b.tone === 'warn');
  return badge ? (isRu ? badge.textRu : badge.textEn) || null : null;
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

export function RestrictionChip({ label }: { label: string }) {
  return (
    <span className="inline-block rounded-full bg-[color-mix(in_srgb,var(--exchange-warn)_15%,transparent)] px-[9px] py-1 text-[10px] font-extrabold text-[var(--exchange-warn)] whitespace-nowrap">
      {label}
    </span>
  );
}

const VENUE_BUTTON_STYLES: Record<VenueButtonColor, { gradient: string; shadow: string }> = {
  violet: { gradient: 'linear-gradient(135deg,#7c3aed,#4f46e5)', shadow: '#7c3aed' },
  orange: { gradient: 'linear-gradient(135deg,#c2410c,#b03a0a)', shadow: '#c2410c' },
  green: { gradient: 'linear-gradient(135deg,#047857,#065f46)', shadow: '#047857' },
};

const BUTTON_SIZES = {
  sm: 'h-[34px] px-2.5 md:px-3 rounded-[10px] text-[12px]',
  md: 'h-10 px-4 rounded-xl text-[13.5px]',
};

function ExternalIcon({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </svg>
  );
}

/** Партнёрская кнопка в цвете площадки. Цветов три, белый текст держит контраст от 5:1 на каждом. */
export function VenueButton({
  href,
  color,
  size = 'md',
  className = '',
  children,
}: {
  href: string;
  color: VenueButtonColor;
  size?: 'sm' | 'md';
  className?: string;
  children: React.ReactNode;
}) {
  const { gradient, shadow } = VENUE_BUTTON_STYLES[color];
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className={`relative z-20 inline-flex items-center justify-center gap-1.5 border border-white/20 font-extrabold text-white whitespace-nowrap
        hover:brightness-110 transition-[filter] ${BUTTON_SIZES[size]} ${className}`}
      style={{
        backgroundImage: `linear-gradient(180deg,rgba(255,255,255,.14),rgba(255,255,255,0) 52%),${gradient}`,
        boxShadow: `inset 0 1px 0 rgba(255,255,255,.32),0 6px 16px color-mix(in srgb,${shadow} 34%,transparent)`,
      }}
    >
      {children}
      <ExternalIcon className={size === 'sm' ? 'w-2.5 h-2.5' : 'w-3 h-3'} />
    </a>
  );
}

const NEUTRAL_BUTTON = 'inline-flex items-center justify-center border border-[var(--glass-line)] bg-[var(--rates-inset)] font-extrabold whitespace-nowrap';

/** Внутренняя ссылка рядом с партнёрской кнопкой, того же размера. */
export function GhostButton({
  href,
  size = 'md',
  className = '',
  children,
}: {
  href: string;
  size?: 'sm' | 'md';
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className={`${NEUTRAL_BUTTON} text-foreground hover:bg-[var(--glass-hover)] transition-colors ${BUTTON_SIZES[size]} ${className}`}>
      {children}
    </Link>
  );
}

/**
 * Кнопка строки таблицы. Есть действующая партнёрская ссылка: кнопка в цвете
 * площадки. Нет: серая «Подробнее» того же размера. Это подпись, а не ссылка,
 * страницу площадки открывает растянутая ссылка всей строки.
 */
export function RowAction({ exchange, isRu, tradeLabel }: { exchange: ExchangeRaw; isRu: boolean; tradeLabel?: string }) {
  const href = activeTradeUrl(exchange);
  if (href) {
    return (
      <VenueButton href={href} color={venueButtonColor(exchange.buttonColor)} size="sm">
        {tradeLabel ?? (isRu ? 'Торговать' : 'Trade')}
      </VenueButton>
    );
  }
  return (
    <span className={`${NEUTRAL_BUTTON} text-muted group-hover:text-foreground transition-colors ${BUTTON_SIZES.sm}`}>
      {isRu ? 'Подробнее' : 'Details'}
    </span>
  );
}
