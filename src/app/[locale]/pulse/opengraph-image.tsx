import { ImageResponse } from 'next/og';
import { fetchLatestPulse } from '@/lib/pulse';

export const size = { width: 1200, height: 1200 };
export const contentType = 'image/png';

const VERDICTS: Record<string, { ru: string; en: string }> = {
  flatline: { ru: 'Штиль', en: 'Flatline' },
  warming: { ru: 'Разминка', en: 'Warming up' },
  steady: { ru: 'Ровный ритм', en: 'Steady rhythm' },
  heating: { ru: 'Разогрев', en: 'Heating up' },
  peak: { ru: 'Пиковая активность', en: 'Peak activity' },
};

const GRAD = { a: '#3b82f6', b: '#06b6d4', c: '#ec4899' };

// Mirrors PulseWidget.tsx's own look almost 1:1 (same bg-card tone, same
// glow blobs, same gradient ECG line/number, same 40/30/30 bar) rather than
// a separately-art-directed card — so what gets shared reads as "a screenshot
// of the actual site", not a different design someone might not recognize.
export default async function PulseOpengraphImage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isRu = locale === 'ru';
  const data = await fetchLatestPulse();
  const score = data?.score ?? 50;
  const verdict = data ? (VERDICTS[data.classification]?.[isRu ? 'ru' : 'en'] ?? data.classification) : (isRu ? 'Пульс рынка' : 'Market Pulse');

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '80px',
          background: '#161b26',
          position: 'relative',
        }}
      >
        {/* same two glow blobs as the on-site widget, scaled up */}
        <div style={{ position: 'absolute', top: -140, left: -140, width: 460, height: 460, borderRadius: '50%', background: GRAD.a, opacity: 0.22, filter: 'blur(60px)', display: 'flex' }} />
        <div style={{ position: 'absolute', bottom: -140, right: -140, width: 420, height: 420, borderRadius: '50%', background: GRAD.c, opacity: 0.22, filter: 'blur(60px)', display: 'flex' }} />

        {/* header row — same dot + label as the widget */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, position: 'relative' }}>
          <div style={{ width: 18, height: 18, borderRadius: '50%', background: GRAD.b, display: 'flex' }} />
          <div style={{ display: 'flex', fontSize: 34, fontWeight: 800, color: '#edf0f7' }}>
            {isRu ? 'Пульс рынка' : 'Market Pulse'}
          </div>
        </div>

        {/* ECG line */}
        <svg width="100%" height="140" viewBox="0 0 320 60" preserveAspectRatio="none" style={{ marginTop: 56 }}>
          <defs>
            <linearGradient id="ecg" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={GRAD.a} />
              <stop offset="50%" stopColor={GRAD.b} />
              <stop offset="100%" stopColor={GRAD.c} />
            </linearGradient>
          </defs>
          <path
            d="M0,30 L45,30 L58,30 L67,8 L76,52 L85,30 L115,30 L320,30"
            fill="none"
            stroke="url(#ecg)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {/* score + verdict */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 28, marginTop: 24, position: 'relative' }}>
          <div
            style={{
              display: 'flex',
              fontSize: 220,
              fontWeight: 800,
              lineHeight: 1,
              fontFamily: 'monospace',
              backgroundImage: `linear-gradient(90deg, ${GRAD.a}, ${GRAD.b}, ${GRAD.c})`,
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            {score}
          </div>
          <div style={{ display: 'flex', fontSize: 44, fontWeight: 700, color: '#edf0f7' }}>{verdict}</div>
        </div>

        {/* 40/30/30 weighted bar — identical to the widget */}
        <div style={{ display: 'flex', gap: 10, marginTop: 40, position: 'relative' }}>
          <div style={{ display: 'flex', width: '40%', height: 12, borderRadius: 999, background: GRAD.a }} />
          <div style={{ display: 'flex', width: '30%', height: 12, borderRadius: 999, background: GRAD.b }} />
          <div style={{ display: 'flex', width: '30%', height: 12, borderRadius: 999, background: GRAD.c }} />
        </div>

        {/* brand footer — the only thing the on-site widget doesn't need, since
            this card gets seen outside the site's own context */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 'auto', position: 'relative' }}>
          <div style={{ width: 36, height: 36, borderRadius: 9, background: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#facc15">
              <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
            </svg>
          </div>
          <div style={{ display: 'flex', fontSize: 24, fontWeight: 700, color: '#edf0f7' }}>
            CryptoPulse<span style={{ color: '#22d3ee' }}>.media</span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
