interface Props {
  /** Price points, oldest first. Already thinned server-side to ~40 values. */
  points: number[];
  /** Drives the color: green when the week closed up, red when it closed down. */
  positive: boolean;
  height: number;
  /** Marks the latest point — used on the three spotlight cards only. */
  showDot?: boolean;
  className?: string;
}

/**
 * Inline SVG price line with a soft fade underneath. Drawn in a fixed 300-unit
 * viewBox and stretched with preserveAspectRatio="none", so one component
 * works at 26px in a table row and 64px in a spotlight card. The stroke uses
 * vector-effect="non-scaling-stroke" so that stretching never thickens it.
 */
export default function Sparkline({ points, positive, height, showDot = false, className = '' }: Props) {
  if (points.length < 2) return null;

  const width = 300;
  const pad = 4;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const span = max - min || 1;
  const step = width / (points.length - 1);

  const coords = points.map((p, i) => {
    const x = (i * step).toFixed(1);
    const y = (pad + (height - pad * 2) * (1 - (p - min) / span)).toFixed(1);
    return `${x},${y}`;
  });

  const color = positive ? 'var(--positive)' : 'var(--negative)';
  // Gradient ids must be unique per instance or Safari reuses the first one.
  const gradientId = `spark-${positive ? 'up' : 'down'}-${height}-${Math.abs(Math.round(points[0] * 1e6))}`;
  const [lastX, lastY] = coords[coords.length - 1].split(',');

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className={`block w-full ${className}`}
      style={{ height }}
      aria-hidden
      focusable="false"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.22" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,${height} ${coords.join(' ')} ${width},${height}`} fill={`url(#${gradientId})`} />
      <polyline
        points={coords.join(' ')}
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
      {showDot && <circle cx={lastX} cy={lastY} r="2.6" fill={color} vectorEffect="non-scaling-stroke" />}
    </svg>
  );
}
