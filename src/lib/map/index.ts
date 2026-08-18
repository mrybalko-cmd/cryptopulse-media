/**
 * World geometry for the regulation map.
 *
 * Countries are drawn from TopoJSON (Natural Earth 110m) projected with Miller
 * cylindrical and pre-flattened into SVG paths, keyed by ISO 3166-1 numeric —
 * the same `isoNum` each country carries in Sanity.
 *
 * Miller rather than Mercator on purpose: Mercator inflates Greenland to the
 * size of Africa, and on a status map the visual weight of a country *is* the
 * statement. Antarctica is cropped; no jurisdiction we track sits there.
 *
 * Rings crossing the antimeridian are unwrapped at build time — without that,
 * Russia and Fiji smear a bar across the whole map.
 *
 * `targets` holds hand-computed centres for countries whose smallest dimension
 * is under 10 units at this scale. They get an invisible disc so a fingertip
 * can land on Estonia or Singapore, which a 3-pixel outline cannot offer.
 */
import data from './worldPaths.json';

export interface WorldGeometry {
  width: number;
  height: number;
  /** ISO numeric (zero-padded) → SVG path data */
  paths: Record<string, string>;
  /** ISO numeric → [cx, cy] for countries too small to tap */
  targets: Record<string, [number, number]>;
}

// The JSON's inferred type has a literal key for all 174 countries and a
// tuple-less array for targets, so TypeScript refuses a direct assertion.
export const WORLD = data as unknown as WorldGeometry;

/* ────────────────── one country's neighbourhood ────────────────── */

export interface RegionView {
  /** SVG viewBox cropped to the country and its surroundings. */
  viewBox: string;
  /** ISO numeric codes to draw as context, the country itself excluded. */
  neighbours: string[];
  /** Set when the country has no outline at this scale — draw a dot instead. */
  marker?: [number, number];
}

function bounds(path: string): [number, number, number, number] {
  const n = path.match(/-?\d+\.?\d*/g)?.map(Number) ?? [];
  const xs: number[] = [], ys: number[] = [];
  for (let i = 0; i < n.length - 1; i += 2) { xs.push(n[i]); ys.push(n[i + 1]); }
  return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)];
}

/**
 * The map shown in a country page's header.
 *
 * Wider than tall on purpose: the header's headline column is short, and a
 * square map left a third of the panel empty under the title.
 *
 * Countries below roughly 100km across have no outline in the 110m dataset at
 * all — Singapore is one of our five — so those fall back to the same click
 * coordinates the big map already uses, drawn as a marker. Without that branch
 * the panel would render an empty sea.
 */
export function regionView(isoNum: string, aspect = 1.55): RegionView {
  const own = WORLD.paths[isoNum];
  const target = WORLD.targets[isoNum];
  if (!own && !target) return { viewBox: `0 0 ${WORLD.width} ${WORLD.height}`, neighbours: [] };

  const [x0, y0, x1, y1] = own ? bounds(own) : [target[0], target[1], target[0], target[1]];
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;

  // Enough room around the country to recognise where on earth this is, and a
  // floor so a small country does not fill the frame edge to edge.
  const w = Math.max((x1 - x0) * 4.2, 78);
  const h = Math.max(w / aspect, (y1 - y0) * 2.6);
  const vw = Math.max(w, h * aspect);
  const vh = vw / aspect;
  const vx = Math.max(0, Math.min(cx - vw / 2, WORLD.width - vw));
  const vy = Math.max(0, Math.min(cy - vh / 2, WORLD.height - vh));

  const neighbours = Object.keys(WORLD.paths).filter(code => {
    if (code === isoNum) return false;
    const [a0, b0, a1, b1] = bounds(WORLD.paths[code]);
    return a1 > vx && a0 < vx + vw && b1 > vy && b0 < vy + vh;
  });

  return {
    viewBox: `${vx.toFixed(1)} ${vy.toFixed(1)} ${vw.toFixed(1)} ${vh.toFixed(1)}`,
    neighbours,
    ...(own ? {} : { marker: target }),
  };
}
