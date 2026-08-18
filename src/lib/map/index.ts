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
