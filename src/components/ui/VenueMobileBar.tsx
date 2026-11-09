import type { VenueButtonColor } from '@/lib/exchangePlacements';
import { VenueButton } from './exchangePresentation';

/**
 * Полоса с кнопкой внизу экрана телефона. Показывается только при партнёрской
 * ссылке, поэтому страница монтирует её по условию и добавляет снизу отступ.
 */
export default function VenueMobileBar({
  name,
  note,
  href,
  color,
  label,
}: {
  name: string;
  note?: string | null;
  href: string;
  color: VenueButtonColor;
  label: string;
}) {
  return (
    <div className="md:hidden fixed inset-x-0 bottom-0 z-30 flex items-center gap-3 border-t border-[var(--glass-line)] bg-[image:var(--glass-fill)] backdrop-blur-md px-4 pt-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))]">
      <span className="min-w-0 flex-1">
        <b className="block text-[13px] font-extrabold text-foreground truncate">{name}</b>
        {note && <span className="block text-[11px] text-muted truncate">{note}</span>}
      </span>
      <VenueButton href={href} color={color} className="shrink-0 !h-11">{label}</VenueButton>
    </div>
  );
}
