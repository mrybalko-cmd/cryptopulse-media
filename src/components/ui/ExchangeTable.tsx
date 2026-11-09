import Link from 'next/link';
import type { ExchangeRaw } from '@/lib/sanity';
import { extendedFacts, hasExtendedProfile } from '@/lib/exchangePlacements';
import {
  ExchangeLogo,
  LicenceChip,
  ProductChips,
  RestrictionChip,
  RowAction,
  VOLUME_GRADIENT,
  formatVolume,
  licenceLabel,
  productLabels,
  restrictionLabel,
  slugFor,
} from './exchangePresentation';

/**
 * A row holds the link, it never *is* one: `<a>` inside `<a>` is invalid and
 * the parser closes the outer anchor, throwing the Trade button out of the row.
 * The stretched link covers the row from inside the first cell; Trade sits
 * above it on z-20.
 *
 * `position: relative` on `<tr>` is what makes this work inside a real table,
 * and it is supported across current browsers — verified by hit-testing the
 * middle of a row and the Trade button separately at both breakpoints.
 */
function StretchedLink({ href, label }: { href: string; label: string }) {
  return <Link href={href} aria-label={label} className="absolute inset-0 z-10" />;
}

function VolumeBar({ value, max }: { value: number; max: number }) {
  return (
    <span className="hidden md:block h-1 rounded-full bg-[var(--rates-inset)] overflow-hidden mt-1.5">
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
  isComplete,
}: {
  items: (ExchangeRaw & { rank: number })[];
  locale: string;
  maxVolume: number;
  /** Показан весь рейтинг, без фильтров: подпись может сказать «все». */
  isComplete: boolean;
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
        {/*
          One table for both breakpoints. Until now the desktop grid and the
          mobile grid both sat in the DOM with CSS hiding one, so every venue
          appeared twice in the HTML — doubling the table's weight and showing
          each exchange to an extractor two times. Columns hide per breakpoint
          instead; only the Trade button is repeated, because on mobile it sits
          under the volume rather than in a column of its own.

          `color: inherit` is deliberate: without a doctype a table stops
          inheriting colour from its ancestors and falls back to the body's,
          which turns the venue names near-invisible on the dark theme.
        */}
        {/*
          `table-fixed` is load-bearing, not cosmetic. With automatic layout the
          product chips (each `whitespace-nowrap`) set the name column's
          min-content width, the table grows past the panel, and the panel's
          own `overflow-hidden` silently clips the volume column and the Trade
          buttons off the right edge on mobile — with no page-level overflow to
          give it away. Fixed layout makes the declared widths win and lets the
          name cell truncate instead.
        */}
        <table className="w-full table-fixed border-collapse text-left [color:inherit]">
          <caption className="px-3 pt-3 pb-2 text-left text-[9.5px] font-extrabold uppercase tracking-[0.085em] text-muted">
            {isRu ? 'Криптобиржи по обороту за 24 часа · ' : 'Crypto exchanges by 24h volume · '}
            {isComplete ? (isRu ? 'все ' : 'all ') : ''}{items.length}
          </caption>

          <thead>
            <tr className="border-b border-[var(--glass-line)] text-[9.5px] font-extrabold uppercase tracking-[0.085em] text-muted">
              <th scope="col" className="w-[36px] md:w-[44px] px-2 md:px-3 py-3 text-center font-extrabold">#</th>
              <th scope="col" className="px-2 md:px-3 py-3 font-extrabold">{isRu ? 'Биржа' : 'Exchange'}</th>
              <th scope="col" className="hidden md:table-cell w-[150px] px-3 py-3 font-extrabold">
                {isRu ? 'Оборот 24ч ↓' : '24h volume ↓'}
              </th>
              <th scope="col" className="hidden md:table-cell w-[186px] px-3 py-3 font-extrabold">
                {isRu ? 'Продукты' : 'Products'}
              </th>
              <th scope="col" className="hidden md:table-cell w-[132px] px-3 py-3 font-extrabold">
                {isRu ? 'Лицензия' : 'Licence'}
              </th>
              <th scope="col" className="w-[116px] md:w-[130px] px-2 md:px-3 py-3">
                <span className="sr-only">{isRu ? 'Действие' : 'Action'}</span>
              </th>
            </tr>
          </thead>

          <tbody>
            {items.map(exchange => {
              // Second argument is `short`, not the locale — the chip column is
              // narrow, so both languages get the shortened form.
              const licence = licenceLabel(exchange, true);
              const restriction = licence ? null : restrictionLabel(exchange, isRu);
              const products = productLabels(exchange, locale);
              const extended = hasExtendedProfile(exchange);
              const perk = extended ? (isRu ? exchange.extendedPerkRu : exchange.extendedPerkEn) : null;
              const facts = extended ? extendedFacts(isRu ? exchange.extendedFactsRu : exchange.extendedFactsEn) : [];
              return (
                <tr
                  key={exchange._id}
                  className={`group relative border-b border-[var(--glass-line)] last:border-b-0 transition-colors ${
                    extended
                      ? 'bg-[color-mix(in_srgb,var(--violet)_11%,transparent)] hover:bg-[color-mix(in_srgb,var(--violet)_16%,transparent)]'
                      : 'hover:bg-[var(--glass-hover)]'
                  }`}
                >
                  <td className="px-2 md:px-3 py-3 align-middle text-center text-xs md:text-sm font-extrabold tabular-nums text-muted group-hover:text-foreground transition-colors">
                    <StretchedLink href={`/${locale}/exchanges/${slugFor(exchange, locale)}`} label={exchange.name} />
                    {exchange.rank}
                  </td>

                  <td className="px-2 md:px-3 py-3 align-middle min-w-0">
                    <span className="flex items-center gap-2.5 md:gap-3 min-w-0">
                      <ExchangeLogo exchange={exchange} size={34} sizeMobile={30} />
                      <span className="min-w-0 flex-1">
                        <span className="block text-[13px] md:text-[13.5px] font-extrabold text-foreground truncate group-hover:text-accent transition-colors">
                          {exchange.name}
                        </span>
                        {/* На телефоне колонки оборота нет: цифра и лицензия стоят под названием. */}
                        <span className="md:hidden flex items-baseline gap-1.5 mt-0.5 min-w-0">
                          <span className={`text-[12.5px] ${VOLUME_GRADIENT}`}>{formatVolume(exchange.volume24h)}</span>
                          {licence && <span className="text-[10.5px] font-extrabold text-positive truncate">{licence}</span>}
                          {restriction && <span className="text-[10.5px] font-extrabold text-[var(--exchange-warn)] truncate">{restriction}</span>}
                        </span>
                        {perk ? (
                          <span className="block text-[11.5px] md:text-xs leading-snug text-muted mt-0.5">{perk}</span>
                        ) : (
                          <span className="hidden md:block text-[10.5px] text-muted truncate mt-px">
                            {exchange.foundedYear ? `${isRu ? 'с' : 'since'} ${exchange.foundedYear}` : ''}
                            {exchange.foundedYear && (isRu ? exchange.taglineRu : exchange.taglineEn) ? ' · ' : ''}
                            {isRu ? exchange.taglineRu : exchange.taglineEn}
                          </span>
                        )}
                        {facts.length > 0 && (
                          <span className="hidden md:flex flex-wrap gap-1 mt-1">
                            <ProductChips labels={facts} max={3} />
                          </span>
                        )}
                      </span>
                    </span>
                  </td>

                  <td className="hidden md:table-cell px-3 py-3 align-middle">
                    <span className={`block text-[15px] ${VOLUME_GRADIENT}`}>
                      {formatVolume(exchange.volume24h)}
                    </span>
                    <VolumeBar value={exchange.volume24h ?? 0} max={maxVolume} />
                  </td>

                  <td className="hidden md:table-cell px-3 py-3 align-middle">
                    <span className="flex gap-1 overflow-hidden">
                      <ProductChips labels={products} max={2} />
                    </span>
                  </td>

                  <td className="hidden md:table-cell px-3 py-3 align-middle">
                    {licence && <LicenceChip label={licence} />}
                    {restriction && <RestrictionChip label={restriction} />}
                  </td>

                  <td className="px-2 md:px-3 py-3 align-middle">
                    <span className="flex justify-end">
                      <RowAction exchange={exchange} isRu={isRu} />
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
