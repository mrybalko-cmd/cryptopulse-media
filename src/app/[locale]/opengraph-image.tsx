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
              background: '#0891b2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 32,
              color: '#0a0a0a',
              fontWeight: 700,
            }}
          >
            ⚡
          </div>
          <div style={{ display: 'flex', fontSize: 36, fontWeight: 700, color: '#ffffff' }}>
            CryptoPulse<span style={{ color: '#0891b2' }}>.media</span>
          </div>
        </div>
        <div style={{ display: 'flex', fontSize: 48, fontWeight: 700, color: '#ffffff', maxWidth: 900, lineHeight: 1.2 }}>
          {isRu ? 'Крипто-аналитика для частных инвесторов Европы' : 'Crypto intelligence for European investors'}
        </div>
        <div style={{ display: 'flex', fontSize: 26, color: '#6b7280', marginTop: 24 }}>
          {isRu ? 'Новости · Статьи · Интервью' : 'News · Articles · Interviews'}
        </div>
      </div>
    ),
    { ...size }
  );
}
