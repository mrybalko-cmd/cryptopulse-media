import Link from 'next/link';
import type { PulseData } from '@/lib/pulse';
import { BASE } from '@/lib/metadata';
import ShareButtons from './ShareButtons';

const VERDICTS: Record<PulseData['classification'], { ru: string; en: string }> = {
  flatline: { ru: 'Штиль', en: 'Flatline' },
  warming: { ru: 'Разминка', en: 'Warming up' },
  steady: { ru: 'Ровный ритм', en: 'Steady rhythm' },
  heating: { ru: 'Разогрев', en: 'Heating up' },
  peak: { ru: 'Пиковая активность', en: 'Peak activity' },
};

// Own palette, distinct from Fear & Greed's red-green and Altcoin Season's
// orange-violet — see FearGreedWidget/AltcoinSeasonWidget for that
// convention. Blue → cyan → pink reads as "calm to energetic", which fits
// a heartbeat-line metaphor literally named after the site.
const GRAD = { a: '#3b82f6', b: '#06b6d4', c: '#ec4899' };

export default function PulseWidget({
  data,
  locale,
  idSuffix = 'default',
  className = '',
}: {
  data: PulseData;
  locale: string;
  idSuffix?: string;
  className?: string;
}) {
  const isRu = locale === 'ru';
  const verdict = VERDICTS[data.classification]?.[isRu ? 'ru' : 'en'] ?? data.classification;
  const gradId = `pulse-ecg-${idSuffix}`;
  const pulseHref = `/${locale}/pulse`;
  const shareUrl = `${BASE}${pulseHref}`;
  const shareText = isRu
    ? `Пульс рынка сегодня: ${data.score} — ${verdict}`
    : `Today's Market Pulse: ${data.score} — ${verdict}`;

  return (
    <div className={`bg-card border border-border rounded-lg p-4 flex flex-col relative overflow-hidden ${className}`}>
      {/* layered glow — mirrors the approved share-card treatment, toned down for a small on-site card */}
      <div
        className="absolute -top-10 -left-10 w-32 h-32 rounded-full blur-2xl opacity-20 pointer-events-none"
        style={{ background: GRAD.a }}
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-10 -right-10 w-28 h-28 rounded-full blur-2xl opacity-20 pointer-events-none"
        style={{ background: GRAD.c }}
        aria-hidden="true"
      />

      {/* Whole info area is one big click target to /pulse — only the share
          icons below get their own separate action, since <a> can't nest
          interactive children. */}
      <Link href={pulseHref} className="flex flex-col flex-1">
        <h2 className="flex items-center gap-2 text-sm font-bold text-foreground mb-3 relative">
          <span className="w-1.5 h-1.5 rounded-full shrink-0 animate-pulse motion-reduce:animate-none" style={{ background: GRAD.b, boxShadow: `0 0 6px ${GRAD.b}` }} aria-hidden="true" />
          {isRu ? 'Пульс рынка' : 'Market Pulse'}
        </h2>

        <svg className="w-full h-10 relative" viewBox="0 0 320 60" preserveAspectRatio="none" aria-hidden="true">
          <path
            d="M0,30 L45,30 L58,30 L67,8 L76,52 L85,30 L115,30 L320,30"
            fill="none"
            stroke={`url(#${gradId})`}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" style={{ stopColor: GRAD.a }} />
              <stop offset="50%" style={{ stopColor: GRAD.b }} />
              <stop offset="100%" style={{ stopColor: GRAD.c }} />
            </linearGradient>
          </defs>
        </svg>

        <div className="flex items-baseline gap-2.5 relative">
          <span
            className="font-mono text-3xl font-extrabold tabular-nums leading-none"
            style={{ backgroundImage: `linear-gradient(90deg, ${GRAD.a}, ${GRAD.b}, ${GRAD.c})`, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}
          >
            {data.score}
          </span>
          <span className="text-sm font-semibold text-foreground">{verdict}</span>
        </div>

        <div className="flex gap-1 mt-3 relative">
          <span className="h-1 rounded-full" style={{ width: '40%', background: GRAD.a }} />
          <span className="h-1 rounded-full" style={{ width: '30%', background: GRAD.b }} />
          <span className="h-1 rounded-full" style={{ width: '30%', background: GRAD.c }} />
        </div>
      </Link>

      <div className="flex items-center justify-between gap-2 mt-auto pt-3 border-t border-border relative">
        <ShareButtons url={shareUrl} title={shareText} locale={locale} vertical={false} />
        <Link href={pulseHref} className="text-xs text-accent hover:underline shrink-0">
          {isRu ? 'Подробнее →' : 'Details →'}
        </Link>
      </div>
    </div>
  );
}
