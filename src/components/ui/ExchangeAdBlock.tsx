import Link from 'next/link';
import type { ExchangeRaw } from '@/lib/sanity';
import { venueButtonColor } from '@/lib/exchangePlacements';
import { ExchangeLogo, GhostButton, VenueButton, slugFor } from './exchangePresentation';
import BrokerRisk from './BrokerRisk';

/**
 * Рекламный блок над рейтингом. Ярлык «Реклама» обязателен и не отключается,
 * номера места здесь нет: сама площадка стоит в таблице на своём месте.
 * Показывается только при hasActiveAd, поэтому ссылка всегда есть.
 */
export default function ExchangeAdBlock({
  exchange,
  locale,
  reviewHref,
  reviewLabel,
  defaultButton,
  risk,
  ownPage = false,
}: {
  exchange: ExchangeRaw;
  locale: string;
  reviewHref?: string;
  reviewLabel?: string;
  defaultButton?: string;
  /** Обязательно для рекламы брокера с CFD. */
  risk?: string;
  /** На странице самой биржи: только предложение и кнопка, без логотипа и ссылки на обзор. */
  ownPage?: boolean;
}) {
  const isRu = locale === 'ru';
  const pageHref = reviewHref ?? `/${locale}/exchanges/${slugFor(exchange, locale)}`;
  const text = (isRu ? exchange.adTextRu : exchange.adTextEn) || (isRu ? exchange.taglineRu : exchange.taglineEn);
  const offer = isRu ? exchange.adOfferRu : exchange.adOfferEn;
  const offerNote = isRu ? exchange.adOfferNoteRu : exchange.adOfferNoteEn;
  const buttonText = (isRu ? exchange.adButtonRu : exchange.adButtonEn) || defaultButton || (isRu ? 'Торговать' : 'Trade');

  if (ownPage) {
    return (
      <aside
        aria-label={isRu ? `Реклама: ${exchange.name}` : `Advertisement: ${exchange.name}`}
        className="relative overflow-hidden rounded-[18px] mt-4 px-4 py-3.5 sm:px-5 border border-[color-mix(in_srgb,var(--violet)_40%,transparent)] bg-[image:linear-gradient(120deg,color-mix(in_srgb,var(--violet)_15%,transparent),transparent_70%),var(--glass-fill)]"
      >
        <span className="inline-block rounded-md border border-[var(--glass-line)] bg-[var(--rates-inset)] px-[7px] py-px text-[10.5px] font-bold text-muted">
          {isRu ? 'Реклама' : 'Ad'}
        </span>
        <div className="mt-2 flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
          <div className="min-w-0 flex-1">
            <b className="block text-[15px] font-extrabold text-foreground leading-snug">{offer || text}</b>
            {offer && offerNote && <span className="block text-xs text-muted mt-0.5">{offerNote}</span>}
          </div>
          <VenueButton href={exchange.adUrl!} color={venueButtonColor(exchange.buttonColor)} className="shrink-0 max-md:w-full max-md:h-11">
            {buttonText}
          </VenueButton>
        </div>
      </aside>
    );
  }

  return (
    <aside
      aria-label={isRu ? `Реклама: ${exchange.name}` : `Advertisement: ${exchange.name}`}
      className="relative overflow-hidden rounded-[18px] mb-5 px-4 py-3.5 sm:px-5
        border border-[color-mix(in_srgb,var(--violet)_40%,transparent)]
        bg-[image:linear-gradient(120deg,color-mix(in_srgb,var(--violet)_15%,transparent),color-mix(in_srgb,var(--violet-2)_5%,transparent)_55%,transparent),var(--glass-fill)]
        shadow-[inset_0_1px_0_var(--glass-hi),0_16px_36px_color-mix(in_srgb,var(--violet)_18%,transparent)]"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -right-[4%] -top-[90px] h-[220px] w-[400px] blur-[54px]"
        style={{ background: 'radial-gradient(50% 50% at 50% 50%, color-mix(in srgb, var(--violet) 50%, transparent), transparent 72%)' }}
      />

      <div className="relative">
        <span className="inline-block rounded-md border border-[var(--glass-line)] bg-[var(--rates-inset)] px-[7px] py-px text-[10.5px] font-bold text-muted">
          {isRu ? 'Реклама' : 'Ad'}
        </span>

        <div className="mt-2 flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
          <div className="flex items-start md:items-center gap-3 md:gap-4 flex-1 min-w-0">
            <ExchangeLogo exchange={exchange} size={48} sizeMobile={44} className="!rounded-[14px]" />
            <div className="min-w-0 flex-1">
              <Link
                href={pageHref}
                className="block text-base font-extrabold -tracking-[0.02em] text-foreground hover:text-accent transition-colors"
              >
                {exchange.name}
              </Link>
              {text && <p className="text-xs leading-snug text-muted mt-0.5">{text}</p>}
              {offer && (
                <div className="mt-2 rounded-xl border border-dashed border-[color-mix(in_srgb,var(--violet)_55%,transparent)] px-3 py-2">
                  <b className="block text-[13.5px] font-extrabold text-foreground">{offer}</b>
                  {offerNote && <span className="block text-xs text-muted mt-0.5">{offerNote}</span>}
                </div>
              )}
              {risk && <BrokerRisk className="mt-2 !text-xs">{risk}</BrokerRisk>}
            </div>
          </div>

          <div className="grid grid-cols-2 md:flex gap-2 md:gap-2.5 md:shrink-0">
            <VenueButton href={exchange.adUrl!} color={venueButtonColor(exchange.buttonColor)} className="max-md:w-full max-md:h-11">
              {buttonText}
            </VenueButton>
            <GhostButton href={pageHref} className="max-md:w-full max-md:h-11">
              {reviewLabel ?? (isRu ? 'Обзор биржи' : 'Exchange review')}
            </GhostButton>
          </div>
        </div>
      </div>
    </aside>
  );
}
