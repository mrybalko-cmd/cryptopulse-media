/**
 * The publication's bolt, as an icon.
 *
 * Everywhere a lightning appeared in the interface — the "our story" badge, the
 * breaking-news pill, the AI section marker — it was lucide's `Zap`: a rounded,
 * softly-cut shape that has nothing to do with the one inside the brackets in
 * the logo. Two lightning shapes in one product is one too many, and the reader
 * cannot tell which is the brand.
 *
 * Same polygon as the mark, unit for unit:
 *   src/lib/brandMark.tsx · ../../intokened.com/build-logo.py
 *
 * Drop-in for `Zap`: takes the same `size` and `className`, fills with
 * currentColor, so every existing colour class keeps working.
 */
export default function BoltIcon({
  size = 16,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="currentColor"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M40 6 L16 36 L30 36 L24 58 L48 28 L34 28 Z" />
    </svg>
  );
}
