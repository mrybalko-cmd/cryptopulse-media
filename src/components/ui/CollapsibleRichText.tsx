import { ChevronDown, ChevronUp } from 'lucide-react';
import RichText from './RichText';

// Truncates to 2 lines with a "Show more" toggle — pure CSS (checkbox +
// peer-checked), no client JS needed. Clamps the whole rendered RichText
// output as one box rather than trying to clip Portable Text itself, so it
// works regardless of how many blocks the description has.
export default function CollapsibleRichText({
  value,
  fallbackAlt,
  locale,
  compact = true,
}: {
  value: any[];
  fallbackAlt: string;
  locale: string;
  compact?: boolean;
}) {
  const isRu = locale === 'ru';

  // Only one instance of this component renders per exchange-detail page, so
  // a fixed id is fine — no cross-instance collision risk to worry about.
  const toggleId = 'exchange-description-toggle';

  return (
    <div>
      <input type="checkbox" id={toggleId} className="peer hidden" />
      <div className="line-clamp-2 peer-checked:line-clamp-none">
        <RichText value={value} fallbackAlt={fallbackAlt} locale={locale} compact={compact} />
      </div>
      <label
        htmlFor={toggleId}
        className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-accent cursor-pointer select-none peer-checked:hidden"
      >
        {isRu ? 'Показать ещё' : 'Show more'} <ChevronDown size={14} />
      </label>
      <label
        htmlFor={toggleId}
        className="hidden peer-checked:inline-flex items-center gap-1 mt-2 text-sm font-semibold text-accent cursor-pointer select-none"
      >
        {isRu ? 'Свернуть' : 'Show less'} <ChevronUp size={14} />
      </label>
    </div>
  );
}
