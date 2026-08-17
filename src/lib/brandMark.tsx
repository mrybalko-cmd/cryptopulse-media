/**
 * The publication's mark, for images Next generates at request time.
 *
 * icon, apple-icon and both opengraph-image routes used to each carry their own
 * copy of a red tile with a stock bolt path in it. Three copies of a logo is
 * three logos: the next edit lands in one of them and the set quietly drifts.
 * This is the single definition they all draw from.
 *
 * The geometry is the same 64-unit square the SVG masters and the PNG build
 * script use, so the generated images and the exported files stay identical:
 *   ../../intokened.com/build-logo.py
 *
 * Deliberately flat gold rather than the folded two-plane gradient of the full
 * mark. These images render through Satori, whose SVG gradient support is
 * partial, and every place this component appears is small enough that the fold
 * would read as noise anyway — the same reason the 16px favicon is flat.
 */

/** Bracket stems and arms, as rectangles rather than a stroked path. */
const BRACKETS: ReadonlyArray<readonly [number, number, number, number]> = [
  [4, 4, 6, 56], [4, 4, 15, 6], [4, 54, 15, 6],
  [54, 4, 6, 56], [45, 4, 15, 6], [45, 54, 15, 6],
];

/** The bolt, already scaled to 0.66 and centred — the value the brackets frame. */
const BOLT = '37.28,14.84 21.44,34.64 30.68,34.64 26.72,49.16 42.56,29.36 33.32,29.36';

export const BRAND_GRAPHITE = '#1d1d1f';
export const BRAND_PAPER = '#f2f3f5';
export const BRAND_GOLD = '#ffc93c';

/**
 * Below this the gap between a bracket and the bolt falls under a pixel and the
 * mark collapses into a blob, so the brackets come off and the bolt fills the
 * frame instead. Matches the threshold in the PNG build script.
 */
const BRACKET_FLOOR = 48;

export function BrandMark({
  size,
  bracket = BRAND_PAPER,
  bolt = BRAND_GOLD,
  simplified,
}: {
  size: number;
  bracket?: string;
  bolt?: string;
  /**
   * Overrides the size threshold. Pass `false` where the drawing is small in
   * its own coordinate space but large on screen — the badge on a 1200×630
   * social card is 35 units wide and displayed at several times that, so the
   * automatic rule would strip the brackets from an image nobody sees small.
   */
  simplified?: boolean;
}) {
  if (simplified ?? size < BRACKET_FLOOR) {
    return (
      <svg width={size} height={size} viewBox="0 0 64 64">
        <polygon points="40,6 16,36 30,36 24,58 48,28 34,28" fill={bolt} />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 64 64">
      {BRACKETS.map(([x, y, w, h]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width={w} height={h} fill={bracket} />
      ))}
      <polygon points={BOLT} fill={bolt} />
    </svg>
  );
}

/** The mark on its graphite tile — the form used as an app icon or avatar. */
export function BrandTile({
  size,
  radius,
  simplified,
}: {
  size: number;
  radius?: number;
  simplified?: boolean;
}) {
  return (
    <div
      style={{
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: BRAND_GRAPHITE,
        borderRadius: radius ?? Math.round(size * 0.22),
      }}
    >
      <BrandMark size={Math.round(size * 0.62)} simplified={simplified} />
    </div>
  );
}
