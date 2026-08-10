import Link from 'next/link';
import type { ExchangeRaw } from '@/lib/sanity';
import {
  ExchangeLogo,
  LicenceChip,
  ProductChips,
  TradeButton,
  VOLUME_GRADIENT,
  formatVolume,
  licenceLabel,
  productLabels,
  slugFor,
} from './exchangePresentation';

// Russian product labels run wider than English ('Фьючерсы' vs 'Futures'),
// so the products column is sized for the longer of the two.
const COLS = 'grid-cols-[44px_minmax(0,1.6fr)_150px_186px_104px_130px]';

/**
 * A row holds the link, it never *is* one: `<a>` inside `<a>` is invalid and
 * the parser closes the outer anchor, throwing the Trade button out of the
 * grid. The stretched link covers the row; Trade sits above it on z-20.
 */
function StretchedLink({ href, label }: { href: string; label: string }) {
  return <Link href={href} aria-label={label} className="absolute inset-0 z-10" />;
}

function VolumeBar({ value, max }: { value: number; max: number }) {
  return (
    <span className="block h-1 rounded-full bg-[var(--rates-inset)] overflow-hidden mt-1.5">
      <span
        className="block h-full rounded-full bg-[linear-gradient(90deg,color-mix(in_srgb,var(--violet)_55%,transparent),var(--violet-2))]"
        style={{ width: `${max > 0 ? Math.max(1, (value / max) * 100) : 0}%` }}
      />
    </span>
  );
}

export default function ExchangeTable({
  items,
  locale,
  maxVolume,
}: {
  items: (ExchangeRaw & { rank: number })[];
  locale: string;
  maxVolume: number;
}) {
  const isRu = locale === 'ru';

  return (
    <div className="relative">
      {/* Colour halo bleeding from behind the panel's top edge */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-[4%] -top-[52px] h-[210px] w-[440px] blur-[52px]"
        style={{ background: 'radial-gradient(50% 50% at 50% 50%, var(--halo-violet), transparent 72%)' }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute right-[1%] -top-[38px] h-[180px] w-[340px] blur-[52px]"
        style={{ background: 'radial-gradient(50% 50% at 50% 50%, var(--halo-cyan), transparent 72%)' }}
      />

      <div className="relative rounded-[20px] overflow-hidden border border-[var(--glass-line)] bg-[image:var(--glass-fill)] shadow-[inset_0_1px_0_var(--glass-hi),var(--glass-shadow)]">
        {/* Desktop table */}
        <div className="hidden md:block">
          <div className={`grid ${COLS} items-center border-b border-[var(--glass-line)] text-[9.5px] font-extrabold uppercase tracking-[0.085em] text-muted`}>
            <span className="px-3 py-3 text-center">#</span>
            <span className="px-3 py-3">{isRu ? 'Биржа' : 'Exchange'}</span>
            <span className="px-3 py-3">{isRu ? 'Объём 24ч ↓' : '24h volume ↓'}</span>
            <span className="px-3 py-3">{isRu ? 'Продукты' : 'Products'}</span>
            <span className="px-3 py-3">{isRu ? 'Лицензия' : 'Licence'}</span>
            <span className="px-3 py-3" />
          </div>

          {items.map(exchange => {
            const licence = licenceLabel(exchange, true);
            return (
              <div
                key={exchange._id}
                className={`group relative grid ${COLS} items-center border-b border-[var(--glass-line)] last:border-b-0 transition-colors hover:bg-[var(--glass-hover)]`}
              >
                <StretchedLink href={`/${locale}/exchanges/${slugFor(exchange, locale)}`} label={exchange.name} />

                <span className="px-3 py-3 text-center text-sm font-extrabold tabular-nums text-muted group-hover:text-foreground transition-colors">
                  {exchange.rank}
                </span>

                <span className="px-3 py-3 min-w-0 flex items-center gap-3">
                  <ExchangeLogo exchange={exchange} size={34} />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[13.5px] font-extrabold text-foreground truncate group-hover:text-accent transition-colors">
                      {exchange.name}
                    </span>
                    <span className="block text-[10.5px] text-muted truncate mt-px">
                      {exchange.foundedYear ? `${isRu ? 'с' : 'since'} ${exchange.foundedYear}` : ''}
                      {exchange.foundedYear && (isRu ? exchange.taglineRu : exchange.taglineEn) ? ' · ' : ''}
                      {isRu ? exchange.taglineRu : exchange.taglineEn}
                    </span>
                  </span>
                </span>

                <span className="px-3 py-3">
                  <span className={`block text-[15px] ${VOLUME_GRADIENT}`}>{formatVolume(exchange.volume24h)}</span>
                  <VolumeBar value={exchange.volume24h ?? 0} max={maxVolume} />
                </span>

                <span className="px-3 py-3 flex gap-1 overflow-hidden">
                  <ProductChips labels={productLabels(exchange, locale)} max={2} />
                </span>

                <span className="px-3 py-3">{licence && <LicenceChip label={licence} />}</span>

                <span className="px-3 py-3 flex justify-end">
                  <TradeButton exchange={exchange} isRu={isRu} />
                </span>
              </div>
            );
          })}
        </div>

        {/* Mobile: one compact row per exchange */}
        <div className="md:hidden">
          {items.map(exchange => {
            const licence = licenceLabel(exchange, true);
            return (
              <div
                key={exchange._id}
                className="relative grid grid-cols-[26px_minmax(0,1fr)_auto] gap-2.5 items-center px-3 py-3 border-b border-[var(--glass-line)] last:border-b-0"
              >
                <StretchedLink href={`/${locale}/exchanges/${slugFor(exchange, locale)}`} label={exchange.name} />

                <span className="text-center text-xs font-extrabold tabular-nums text-muted">{exchange.rank}</span>

                <span className="min-w-0 flex items-center gap-2.5">
                  <ExchangeLogo exchange={exchange} size={30} className="rounded-[9px]" />
                  <span className="min-w-0">
                    <span className="block text-[13px] font-extrabold text-foreground truncate">{exchange.name}</span>
                    <span className="flex gap-1 mt-1 overflow-hidden">
                      <ProductChips labels={productLabels(exchange, locale)} max={2} />
                      {licence && (
                        <span className="rounded-md bg-positive/15 px-[7px] py-[3px] text-[9.5px] font-extrabold text-positive whitespace-nowrap">
                          {licence}
                        </span>
                      )}
                    </span>
                  </span>
                </span>

                <span className="text-right shrink-0">
                  <span className={`block text-sm ${VOLUME_GRADIENT}`}>{formatVolume(exchange.volume24h)}</span>
                  {exchange.tradeUrl ? (
                    <span className="block mt-1.5">
                      <TradeButton exchange={exchange} isRu={isRu} size="sm" />
                    </span>
                  ) : (
                    <span className="block text-[9.5px] text-muted mt-1">{isRu ? 'объём 24ч' : '24h volume'}</span>
                  )}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
