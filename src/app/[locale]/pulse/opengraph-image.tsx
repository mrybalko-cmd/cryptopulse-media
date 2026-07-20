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

// The approved "night sky" shareable-card variant, generated fresh on every
// request (Next revalidates og images per-route like any other page) — this
// same URL is both the page's og:image and the thing that gets pasted into
// an X/Telegram post, no separate manual export step.
export default async function PulseOpengraphImage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isRu = locale === 'ru';
  const data = await fetchLatestPulse();
  const score = data?.score ?? 50;
  const verdict = data ? (VERDICTS[data.classification]?.[isRu ? 'ru' : 'en'] ?? data.classification) : (isRu ? 'Пульс рынка' : 'Market Pulse');
  const dateStr = new Date(data?.computedAt ?? Date.now()).toLocaleDateString(isRu ? 'ru-RU' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' });

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px',
          background: 'linear-gradient(160deg, #0b0e14 0%, #131722 55%, #1a0f1a 100%)',
          position: 'relative',
        }}
      >
        <div style={{ position: 'absolute', top: -180, right: -180, width: 560, height: 560, borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.35) 0%, rgba(6,182,212,0) 70%)', display: 'flex' }} />
        <div style={{ position: 'absolute', bottom: -160, left: -140, width: 480, height: 480, borderRadius: '50%', background: 'radial-gradient(circle, rgba(236,72,153,0.28) 0%, rgba(236,72,153,0) 70%)', display: 'flex' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 14, position: 'relative' }}>
          <div style={{ width: 48, height: 48, borderRadius: 11, background: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="#facc15">
              <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
            </svg>
          </div>
          <div style={{ display: 'flex', fontSize: 30, fontWeight: 700, color: '#ffffff' }}>
            CryptoPulse<span style={{ color: '#22d3ee' }}>.media</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
          <svg width="640" height="90" viewBox="0 0 300 50" style={{ marginBottom: 4 }}>
            <path d="M0,25 L38,25 L50,25 L58,6 L66,44 L74,25 L100,25 L300,25" fill="none" stroke="#22d3ee" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div style={{ display: 'flex', fontSize: 260, fontWeight: 800, color: '#22d3ee', lineHeight: 1, fontFamily: 'monospace' }}>
            {score}
          </div>
          <div style={{ display: 'flex', fontSize: 48, fontWeight: 700, color: '#ffffff', marginTop: 16 }}>
            {verdict}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, position: 'relative' }}>
          <div style={{ display: 'flex', gap: 24, fontSize: 24, color: '#8892aa' }}>
            <div style={{ display: 'flex', gap: 6 }}>F&amp;G <span style={{ color: '#edf0f7', fontWeight: 700 }}>{data?.components.fearGreed ?? '—'}</span></div>
            <div style={{ display: 'flex' }}>·</div>
            <div style={{ display: 'flex', gap: 6 }}>{isRu ? 'Альтсезон' : 'Alt Season'} <span style={{ color: '#edf0f7', fontWeight: 700 }}>{data?.components.altSeason ?? '—'}</span></div>
            <div style={{ display: 'flex' }}>·</div>
            <div style={{ display: 'flex', gap: 6 }}>{isRu ? 'Объём' : 'Volume'} <span style={{ color: '#edf0f7', fontWeight: 700 }}>{data ? `${data.volumeChangePct > 0 ? '+' : ''}${data.volumeChangePct}%` : '—'}</span></div>
          </div>
          <div style={{ display: 'flex', fontSize: 20, color: '#5b6478' }}>cryptopulse.media/{locale}/pulse · {dateStr}</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
