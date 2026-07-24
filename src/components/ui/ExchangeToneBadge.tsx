export type ExchangeBadgeTone = 'ok' | 'warn' | 'off' | 'gold' | 'license';

// Color is tied to what kind of fact the badge states, not chosen freely per
// badge — a regulatory licence (MiCA or otherwise) is always this same blue
// wherever it appears, a corporate/trust fact is always gold, etc. Keeps the
// same badge meaning visually consistent across every exchange.
const TONE_CLASSES: Record<ExchangeBadgeTone, string> = {
  ok: 'bg-green-600 text-white',
  warn: 'bg-amber-500 text-amber-950',
  off: 'bg-slate-600 text-white',
  gold: 'bg-yellow-600 text-yellow-950',
  license: 'bg-blue-600 text-white',
};

export default function ExchangeToneBadge({ text, tone, className = '' }: { text: string; tone: ExchangeBadgeTone; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap shrink-0 ${TONE_CLASSES[tone] ?? TONE_CLASSES.off} ${className}`}>
      {text}
    </span>
  );
}
