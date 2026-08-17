import { ImageResponse } from 'next/og';
import { BrandTile } from '@/lib/brandMark';
import { SITE_BRAND, SITE_ZONE } from '@/lib/site';

// 16:9, not the classic 1200x630 OG ratio — Google Discover's own image
// guidance calls out 16:9 specifically for large-image thumbnail eligibility.
export const size = { width: 1200, height: 675 };
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
          <BrandTile size={56} simplified={false} />
          <div style={{ display: 'flex', fontSize: 36, fontWeight: 700, color: '#ffffff' }}>
            {SITE_BRAND}<span style={{ color: '#92959e' }}>{SITE_ZONE}</span>
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
          <Pill color="#ffc93c" bg="rgba(255,201,60,0.16)">{isRu ? 'Крипто' : 'Crypto'}</Pill>
          <Pill color="#93c5fd" bg="rgba(37,99,235,0.18)">{isRu ? 'ИИ' : 'AI'}</Pill>
        </div>
      </div>
    ),
    { ...size }
  );
}
