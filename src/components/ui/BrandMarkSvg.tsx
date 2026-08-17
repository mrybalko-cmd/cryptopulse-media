/**
 * The mark as it appears in the header and the footer — no tile.
 *
 * It used to be `/brand-mark.png`, the same square used for the favicon and the
 * app icon. That square carries a graphite tile, and the tile is #1D1D1F while
 * the site's own background is #1d1d1f — the same colour. On the dark theme the
 * tile was invisible, so a 40px box showed a 28px mark floating in 12px of
 * nothing, which read exactly as the reader described it: small, and too far
 * from the word. The tile belongs where the mark lands on someone else's
 * background — a favicon, an avatar, Google News — not here.
 *
 * The brackets take `currentColor`, so the mark follows the theme instead of
 * needing one file per background.
 *
 * The bolt's volume is two flat planes rather than a gradient. That is not a
 * simplification: the axis from the bolt's tip to its tail splits its six
 * vertices cleanly 2+2 without crossing an edge, so the lit face and the shaded
 * fold are each an ordinary polygon. No gradient, no clipPath, and — the part
 * that matters — no `id`, so the component can appear twice on a page and in a
 * server component without colliding with itself.
 */

const BRACKETS: ReadonlyArray<readonly [number, number, number, number]> = [
  [4, 4, 6, 56], [4, 4, 15, 6], [4, 54, 15, 6],
  [54, 4, 6, 56], [45, 4, 15, 6], [45, 54, 15, 6],
];

/** The face the light hits, and the one that turns away from it. */
const BOLT_LIT = '40,6 16,36 30,36 24,58';
const BOLT_FOLD = '24,58 48,28 34,28 40,6';

const GOLD_LIT = '#FFC93C';
const GOLD_FOLD = '#D4820F';

export default function BrandMarkSvg({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true" focusable="false">
      {BRACKETS.map(([x, y, w, h]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width={w} height={h} fill="currentColor" />
      ))}
      <polygon points={BOLT_LIT} fill={GOLD_LIT} />
      <polygon points={BOLT_FOLD} fill={GOLD_FOLD} />
    </svg>
  );
}
