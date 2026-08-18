import { BrandTile } from '@/lib/brandMark';
import { SITE_BRAND, SITE_ZONE } from '@/lib/site';

/**
 * The share card every page falls back to.
 *
 * It is drawn for the size it is actually seen at. A link preview in Telegram
 * is about 340px wide, so the previous card's 26px subtitle arrived as 7px and
 * its 48px headline as 14px; measured, 97% of that card was within a shade of
 * black, which in a feed reads as an image that failed to load. This one gives
 * the frame to one sentence and fills the background with brand colour.
 *
 * Satori notes, learned the hard way:
 *  - every div needs an explicit `display`, and a bare text node beside an
 *    element is a layout error rather than inline text;
 *  - so an accented word inside a sentence cannot be a `<span>` in flowing
 *    text — the headline is laid out as a wrapping row of word chips instead,
 *    which is what `Headline` below is doing;
 *  - `margin-top: auto` is unreliable, so the spacer is an explicit flex:1 div.
 */

export const OG_SIZE = { width: 1200, height: 675 };

export interface CardWord {
  text: string;
  /** Painted in the secondary accent — one or two words per headline, no more. */
  hot?: boolean;
}

/** "Где крипта *разрешена*, а где вас ждёт штраф" → words, some marked. */
export function words(sentence: string, ...highlight: string[]): CardWord[] {
  const wanted = new Set(highlight.map(w => w.toLowerCase()));
  return sentence.split(' ').map(text => {
    const bare = text.replace(/[.,:;!?—]/g, '').toLowerCase();
    return wanted.has(bare) ? { text, hot: true } : { text };
  });
}

function Headline({ parts }: { parts: CardWord[] }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', maxWidth: 1010 }}>
      {parts.map((w, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            fontSize: 82,
            fontWeight: 700,
            lineHeight: 1.04,
            letterSpacing: '-0.04em',
            color: w.hot ? '#c084fc' : '#ffffff',
            marginRight: 20,
          }}
        >
          {w.text}
        </div>
      ))}
    </div>
  );
}

function Chip({ children, hot }: { children: string; hot?: boolean }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '12px 26px',
        borderRadius: 999,
        fontSize: 26,
        fontWeight: 600,
        border: `1px solid ${hot ? 'rgba(139,92,246,0.50)' : 'rgba(255,255,255,0.16)'}`,
        background: hot ? 'rgba(139,92,246,0.26)' : 'rgba(255,255,255,0.06)',
        color: hot ? '#e9ddff' : '#e7e8ec',
      }}
    >
      {children}
    </div>
  );
}

export function OgCard({ headline, chips }: { headline: CardWord[]; chips: string[] }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: '64px 72px',
        background: '#0b0b0d',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Two brand glows.
          Satori is fussy here and the settings below are the ones that survive
          it. `circle at x% y%` renders nothing at all. Large negative offsets
          get clipped, leaving the glow as a band across the top. And a colour
          that is still visible where its element ends shows that edge as a rim.
          So: modest offsets, and the colour reaches zero at 54% of the box,
          well inside it, with the peak raised to keep the same presence. */}
      <div
        style={{
          position: 'absolute',
          top: -230,
          left: -220,
          width: 1120,
          height: 900,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.60) 0%, rgba(139,92,246,0) 54%)',
          display: 'flex',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: -180,
          right: -240,
          width: 1000,
          height: 820,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(6,182,212,0.50) 0%, rgba(6,182,212,0) 54%)',
          display: 'flex',
        }}
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <BrandTile size={56} simplified={false} />
        <div style={{ display: 'flex', fontSize: 36, fontWeight: 700, color: '#ffffff' }}>
          {SITE_BRAND}
          <span style={{ color: '#92959e' }}>{SITE_ZONE}</span>
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1 }} />

      <Headline parts={headline} />

      <div style={{ display: 'flex', gap: 14, marginTop: 28 }}>
        {chips.map((c, i) => (
          <Chip key={c} hot={i === 0}>
            {c}
          </Chip>
        ))}
      </div>
    </div>
  );
}
