import { ImageResponse } from 'next/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

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
        }}
      >
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
          {isRu ? 'Крипто-аналитика для частных инвесторов Европы' : 'Crypto intelligence for European investors'}
        </div>
        <div style={{ display: 'flex', fontSize: 26, color: '#6b7280', marginTop: 24 }}>
          {isRu ? 'Новости · Статьи · Крипто-активы' : 'News · Articles · Crypto Assets'}
        </div>
      </div>
    ),
    { ...size }
  );
}
