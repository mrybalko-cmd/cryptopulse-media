interface Props {
  /** 0–100. */
  value: number;
  /** Colour of the filled part and the needle dot. */
  color: string;
  width?: number;
  /** Stops for the track behind the value, left to right. */
  gradient: string[];
  /** Unique per instance — several gauges can share a page. */
  id: string;
}

/**
 * Half-circle gauge as inline SVG. Replaces the canvas version, which needed
 * 'use client' plus an effect and only painted after hydration — so the arc
 * popped in a beat late and had to re-read the theme in JS. This renders on
 * the server, costs no client JS, and takes its track colour from the theme
 * token like everything else.
 */
export default function GaugeArc({ value, color, width = 126, gradient, id }: Props) {
  const stroke = Math.round(width * 0.071);
  const radius = width / 2 - stroke;
  const cx = width / 2;
  const cy = width / 2;
  const height = Math.round(width * 0.56);
  const arcLength = Math.PI * radius;
  const pct = Math.max(0, Math.min(100, value)) / 100;

  const path = `M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`;

  // Needle sits at the end of the filled arc.
  const angle = Math.PI + pct * Math.PI;
  const nx = cx + radius * Math.cos(angle);
  const ny = cy + radius * Math.sin(angle);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} className="block" aria-hidden focusable="false">
      <defs>
        <linearGradient id={`gauge-${id}`} x1="0" y1="0" x2="1" y2="0">
          {gradient.map((stop, i) => (
            <stop key={stop + i} offset={`${(i / (gradient.length - 1)) * 100}%`} stopColor={stop} />
          ))}
        </linearGradient>
      </defs>
      <path d={path} fill="none" stroke="var(--border)" strokeWidth={stroke} strokeLinecap="round" />
      <path
        d={path}
        fill="none"
        stroke={`url(#gauge-${id})`}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={`${(arcLength * pct).toFixed(1)} ${arcLength.toFixed(1)}`}
      />
      <circle cx={nx} cy={ny} r={stroke * 0.62} fill="var(--background)" />
      <circle cx={nx} cy={ny} r={stroke * 0.42} fill={color} />
    </svg>
  );
}
