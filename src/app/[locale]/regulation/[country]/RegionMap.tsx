import { WORLD, regionView } from '@/lib/map';

/**
 * The country in its neighbourhood, drawn from the same geometry as the big
 * map rather than an illustration — so a correction to the world file cannot
 * leave these headers showing a shape the map no longer draws.
 */
export default function RegionMap({
  isoNum,
  label,
  mapHref,
  allLabel,
}: {
  isoNum: string;
  label: string;
  mapHref: string;
  allLabel: string;
}) {
  const view = regionView(isoNum);
  const own = WORLD.paths[isoNum];
  const id = `me-${isoNum}`;

  return (
    <div className="rounded-[15px] border border-[var(--glass-line)] p-3 flex flex-col bg-[linear-gradient(180deg,var(--rates-inset),transparent)] shadow-[inset_0_1px_0_var(--glass-hi)]">
      <svg viewBox={view.viewBox} className="block w-full h-auto flex-1 min-h-0" role="img" aria-label={label}>
        <defs>
          <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--positive)" stopOpacity="0.62" />
            <stop offset="1" stopColor="var(--positive)" stopOpacity="0.28" />
          </linearGradient>
          <filter id={`${id}-glow`} x="-90%" y="-90%" width="280%" height="280%">
            <feGaussianBlur stdDeviation="1.4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {view.neighbours.map(code => (
          <path
            key={code}
            d={WORLD.paths[code]}
            fill="var(--glass-hover)"
            stroke="var(--glass-line)"
            strokeWidth={0.35}
            vectorEffect="non-scaling-stroke"
          />
        ))}

        {own ? (
          <path
            d={own}
            fill={`url(#${id}-fill)`}
            stroke="var(--positive)"
            strokeWidth={1.1}
            vectorEffect="non-scaling-stroke"
            filter={`url(#${id}-glow)`}
          />
        ) : view.marker ? (
          /* No outline exists at this scale — Singapore is smaller than a
             pixel here. The marker sits on the same coordinates the big map
             already uses to make such countries clickable. */
          <g filter={`url(#${id}-glow)`}>
            <circle cx={view.marker[0]} cy={view.marker[1]} r={3.4} fill="var(--positive)" />
            <circle
              cx={view.marker[0]}
              cy={view.marker[1]}
              r={6.4}
              fill="none"
              stroke="var(--positive)"
              strokeWidth={0.9}
              strokeOpacity={0.5}
              vectorEffect="non-scaling-stroke"
            />
          </g>
        ) : null}
      </svg>

      <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-[var(--glass-line)] text-[11px] text-muted font-mono">
        <span>{label}</span>
        <a href={mapHref} className="text-accent hover:underline">
          {allLabel}
        </a>
      </div>
    </div>
  );
}
