import { ImageResponse } from 'next/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

function Pill({ color, bg, children }: { color: string; bg: string; children: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '10px 22px',
        borderRadius: 999,
        background: bg,
        color,
        fontSize: 24,
        fontWeight: 600,
      }}
    >
      {children}
    </div>
  );
}

export default async function OpengraphImage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isRu = locale === 'ru';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          background: '#0a0a0a',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Soft brand-colored glows so the card reads as more than a flat
            black rectangle, without pulling in any external image asset
            (satori/next-og can't fetch our own site screenshots reliably). */}
        <div
          style={{
            position: 'absolute',
            top: -220,
            right: -180,
            width: 620,
            height: 620,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(220,38,38,0.22) 0%, rgba(220,38,38,0) 70%)',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -240,
            left: -160,
            width: 560,
            height: 560,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(37,99,235,0.20) 0%, rgba(37,99,235,0) 70%)',
            display: 'flex',
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 40 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 12,
              background: '#dc2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="30" height="30" viewBox="0 0 24 24" fill="#facc15">
              <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
            </svg>
          </div>
          <div style={{ display: 'flex', fontSize: 36, fontWeight: 700, color: '#ffffff' }}>
            CryptoPulse<span style={{ color: '#06b6d4' }}>.media</span>
          </div>
        </div>
        <div style={{ display: 'flex', fontSize: 48, fontWeight: 700, color: '#ffffff', maxWidth: 900, lineHeight: 1.2 }}>
          {isRu ? 'Крипто- и AI-аналитика для инвесторов Европы' : 'Crypto & AI intelligence for European investors'}
        </div>
        <div style={{ display: 'flex', fontSize: 26, color: '#9ca3af', marginTop: 20, maxWidth: 900 }}>
          {isRu
            ? 'Новости, аналитика, гиды по активам и глоссарий — простыми словами'
            : 'News, analysis, asset guides, and a glossary — all in plain language'}
        </div>
        <div style={{ display: 'flex', gap: 14, marginTop: 36 }}>
          <Pill color="#facc15" bg="rgba(220,38,38,0.18)">{isRu ? 'Крипто' : 'Crypto'}</Pill>
          <Pill color="#93c5fd" bg="rgba(37,99,235,0.18)">{isRu ? 'ИИ' : 'AI'}</Pill>
        </div>
      </div>
    ),
    { ...size }
  );
}
