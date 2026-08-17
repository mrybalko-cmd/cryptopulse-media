import Link from 'next/link';
import type { ExchangeRaw } from '@/lib/sanity';
import {
  ExchangeLogo,
  LicenceChip,
  PinIcon,
  ProductChips,
  TradeButton,
  VOLUME_GRADIENT,
  formatVolume,
  licenceLabel,
  productLabels,
  slugFor,
} from './exchangePresentation';
import { SITE_BRAND } from '@/lib/site';

/**
 * A paid placement, lifted out of the ranking into its own slot above it.
 * Keeping it inside the table would put a smaller 24h volume above a larger
 * one, which reads as a broken sort — here it sits over the ranking instead
 * of inside it, and the label says plainly why.
 */
export default function ExchangeFeatured({ exchange, locale }: { exchange: ExchangeRaw; locale: string }) {
  const isRu = locale === 'ru';
  const licence = licenceLabel(exchange);
  const tagline = isRu ? exchange.taglineRu : exchange.taglineEn;

  return (
    <div
      className="relative overflow-hidden rounded-[20px] mb-3 px-5 py-4 sm:px-6 sm:py-5
        border border-[color-mix(in_srgb,var(--violet)_40%,transparent)]
        bg-[image:linear-gradient(120deg,color-mix(in_srgb,var(--violet)_14%,transparent),color-mix(in_srgb,var(--accent)_5%,transparent)_55%,transparent),var(--glass-fill)]
        shadow-[inset_0_1px_0_var(--glass-hi),0_18px_42px_color-mix(in_srgb,var(--violet)_22%,transparent)]"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -right-[4%] -top-[90px] h-[220px] w-[400px] blur-[54px]"
        style={{ background: 'radial-gradient(50% 50% at 50% 50%, color-mix(in srgb, var(--violet) 58%, transparent), transparent 72%)' }}
      />
      <Link
        href={`/${locale}/exchanges/${slugFor(exchange, locale)}`}
        aria-label={exchange.name}
        className="absolute inset-0 z-10"
      />

      <div className="relative">
        <span className="flex items-center gap-1.5 text-[9.5px] font-black uppercase tracking-[0.11em] text-[var(--violet-2)] mb-3">
          <PinIcon className="w-3 h-3" />
          {isRu ? `Партнёр ${SITE_BRAND}` : `${SITE_BRAND} partner`}
        </span>

        <div className="flex items-center gap-4 flex-wrap">
          <ExchangeLogo exchange={exchange} size={52} className="!rounded-[15px] border-[color-mix(in_srgb,var(--violet-2)_55%,transparent)] shadow-[0_0_0_4px_color-mix(in_srgb,var(--violet)_15%,transparent),0_8px_20px_rgba(0,0,0,0.25)]" />

          <span className="flex-1 min-w-[180px]">
            <span className="block text-lg font-extrabold -tracking-[0.025em] text-foreground">{exchange.name}</span>
            <span className="block text-xs text-muted mt-0.5">
              {exchange.foundedYear ? `${isRu ? 'с' : 'since'} ${exchange.foundedYear}` : ''}
              {exchange.foundedYear && tagline ? ' · ' : ''}
              {tagline}
            </span>
          </span>

          <span className="text-right shrink-0">
            <span className="block text-[9.5px] font-extrabold uppercase tracking-[0.09em] text-muted">
              {isRu ? 'Объём 24ч' : '24h volume'}
            </span>
            <span className={`block text-[25px] leading-none mt-1 -tracking-[0.04em] ${VOLUME_GRADIENT}`}>
              {formatVolume(exchange.volume24h)}
            </span>
          </span>

          <TradeButton exchange={exchange} isRu={isRu} />
        </div>

        <div className="flex items-center gap-1.5 flex-wrap mt-3.5">
          <ProductChips labels={productLabels(exchange, locale)} max={5} />
          {licence && <LicenceChip label={licence} />}
        </div>
      </div>
    </div>
  );
}
