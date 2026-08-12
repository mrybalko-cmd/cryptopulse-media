import { ImageResponse } from 'next/og';
import { fetchLatestPulse } from '@/lib/pulse';
import { zoneMeta } from '@/lib/pulseMath';

// Standard 1.91:1 og:image size — a 1:1 square got center-cropped top/bottom
// by Facebook and other scrapers, which target this ratio and don't just
// show a square image as-is. Verified by checking Facebook's own Sharing
// Debugger preview before/after this change.
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Without an explicit revalidate, Next treats this metadata image route as
// fully static — generated once and never refreshed — unlike the page
// itself (which sets revalidate=300), so the two silently drift apart as
// the daily Pulse score updates. Matches the page's own window.
export const revalidate = 300;

// Matches the on-site widget's single violet gradient rather than the old
// blue→cyan→pink ECG palette, so a shared card and the page look like the
// same object. Cyan is kept only for the secondary glow.
const V1 = '#c084fc';
const V2 = '#8b5cf6';
const GRAD = { a: V2, b: '#06b6d4', c: V1 };

// Mirrors PulseWidget.tsx's own look (same bg-card tone, same glow blobs,
// same gradient ECG line/number, same 40/30/30 bar) rather than a
// separately-art-directed card — so what gets shared reads as "a screenshot
// of the actual site". Laid out as two columns (info left, big score right)
// instead of one tall stack, since the wide 1.91:1 frame has more width
// than height to work with.
export default async function PulseOpengraphImage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isRu = locale === 'ru';
  const data = await fetchLatestPulse();
  // Same fallback rule as the widget: no honest percentile yet → show the
  // raw composite, never a number we can't stand behind.
  const headline = data ? (data.percentile ?? data.score) : 50;
  const zone = data ? zoneMeta(data.zone) : null;
  const verdict = zone ? (isRu ? zone.ru : zone.en) : isRu ? 'Пульс рынка' : 'Market Pulse';
  const caption = data?.percentile != null
    ? isRu ? `активнее, чем в ${data.percentile}% дней` : `busier than ${data.percentile}% of days`
    : isRu ? 'сводный индекс рынка' : 'composite market index';
  const bars = data?.history ?? [];

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          padding: '64px 72px',
          background: '#161b26',
          position: 'relative',
        }}
      >
        {/* same two glow blobs as the on-site widget, scaled up */}
        <div style={{ position: 'absolute', top: -160, left: -120, width: 460, height: 460, borderRadius: '50%', background: GRAD.a, opacity: 0.22, filter: 'blur(60px)', display: 'flex' }} />
        <div style={{ position: 'absolute', bottom: -160, right: -120, width: 420, height: 420, borderRadius: '50%', background: GRAD.c, opacity: 0.22, filter: 'blur(60px)', display: 'flex' }} />

        {/* left column — label, ECG line, weighted bar, brand footer */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '54%', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 18, height: 18, borderRadius: '50%', background: GRAD.b, display: 'flex' }} />
            <div style={{ display: 'flex', fontSize: 34, fontWeight: 800, color: '#edf0f7' }}>
              {isRu ? 'Пульс рынка' : 'Market Pulse'}
            </div>
          </div>

          {/* The same percentile bar chart the site shows, so a shared card
              reads as a screenshot of the real widget rather than separate
              art direction. */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 120 }}>
            {bars.map((d, i) => (
              <div
                key={d.date}
                style={{
                  display: 'flex',
                  flex: 1,
                  height: `${Math.max(9, d.percentile ?? d.score)}%`,
                  borderRadius: '4px 4px 1px 1px',
                  backgroundImage: `linear-gradient(180deg, ${V1}, ${V2})`,
                  opacity: i === bars.length - 1 ? 1 : 0.78,
                }}
              />
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
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

        {/* right column — big score + verdict, vertically centered */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '46%', position: 'relative' }}>
          <div
            style={{
              display: 'flex',
              fontSize: 220,
              fontWeight: 800,
              lineHeight: 1,
              backgroundImage: `linear-gradient(160deg, ${V1}, ${V2})`,
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            {headline}
          </div>
          <div style={{ display: 'flex', fontSize: 40, fontWeight: 700, color: '#edf0f7', marginTop: 8 }}>{verdict}</div>
          <div style={{ display: 'flex', fontSize: 22, color: '#9aa0ae', marginTop: 10 }}>{caption}</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
