export type ExchangeBadgeTone = 'ok' | 'warn' | 'off' | 'gold';

const TONE_CLASSES: Record<ExchangeBadgeTone, string> = {
  ok: 'bg-green-600 text-white',
  warn: 'bg-amber-500 text-amber-950',
  off: 'bg-slate-600 text-white',
  gold: 'bg-yellow-600 text-yellow-950',
};

export default function ExchangeToneBadge({ text, tone, className = '' }: { text: string; tone: ExchangeBadgeTone; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${TONE_CLASSES[tone] ?? TONE_CLASSES.off} ${className}`}>
      {text}
    </span>
  );
}
