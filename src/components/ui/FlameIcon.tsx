/**
 * Volumetric flame: an outer tongue on a hot gradient plus a lighter core,
 * with a soft glow around it. Two gradients per instance, so the ids carry a
 * caller-supplied suffix — Safari reuses the first matching id when several
 * copies of the same widget render on one page (desktop + mobile).
 */
export default function FlameIcon({ id, size = 22 }: { id: string; size?: number }) {
  const outer = `flame-o-${id}`;
  const inner = `flame-i-${id}`;
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      className="shrink-0 drop-shadow-[0_0_9px_rgba(249,115,22,0.6)]"
      aria-hidden
      focusable="false"
    >
      <defs>
        <linearGradient id={outer} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#dc2626" />
          <stop offset="45%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#fbbf24" />
        </linearGradient>
        <linearGradient id={inner} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="100%" stopColor="#fff7ed" />
        </linearGradient>
      </defs>
      <path
        fill={`url(#${outer})`}
        d="M16.6 2.3c.6 4.3-2.1 6-3.4 8-1.5 2.2-2 4-2 6.1a6.8 6.8 0 0 0 13.6 0c0-2-.7-3.9-1.9-5.4 2.4 1.4 4.3 4.4 4.3 8.1a10.2 10.2 0 1 1-20.4 0c0-7.4 5.8-9.5 9.8-16.8Z"
      />
      <path
        fill={`url(#${inner})`}
        opacity="0.95"
        d="M16.1 17.4c.9 1.7-.4 2.6-.4 4.1a2.9 2.9 0 0 0 5.8.2c0-2.6-2.4-4-5.4-4.3Z"
      />
    </svg>
  );
}
