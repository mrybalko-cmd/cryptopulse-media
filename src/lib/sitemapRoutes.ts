// Static routes listed in the sitemap, grouped by what "last modified" means
// for each group. The grouping is the whole point: a single date applied to
// every page is what produced the frozen-lastmod bug (364 of 1668 URLs stamped
// 2026-06-01 regardless of reality), and a single build-time `new Date()` is
// what produced the opposite bug before that (every redeploy claiming hundreds
// of pages had just changed).
//
// scripts/gen-page-revisions.mjs reads TOOL_PATHS and INFO_PATHS from here, so
// adding a route in one place keeps the generated revision dates in sync.

/** Listings over content. Move when new content ships, not when we deploy. */
export const LISTING_PATHS = [
  '', '/news', '/articles', '/articles/popular', '/news/popular',
  '/ai', '/ai/glossary', '/authors', '/exchanges',
];

/** Pages whose substance IS live data — the numbers genuinely differ from
 *  yesterday's, so a date that advances daily is accurate rather than inflated.
 *  Coin pages under /assets are appended by the sitemap from COINS. */
export const LIVE_DATA_PATHS = [
  '/rates', '/assets', '/altcoin-season', '/fear-greed', '/calendar', '/pulse',
];

/** Tools whose content is the widget plus its prose — unchanged by the rates
 *  flowing through them, so these follow their source file, not the market. */
export const TOOL_PATHS = [
  '/calculators', '/calculators/wealth', '/calculators/converter',
];

/** Hand-authored pages that change only when someone edits them. */
export const INFO_PATHS = [
  '/privacy', '/disclaimer', '/advertising', '/glossary', '/faq',
  '/security', '/editorial-policy', '/about', '/regulation',
];
