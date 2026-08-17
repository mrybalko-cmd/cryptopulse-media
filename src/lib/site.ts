/**
 * Everything that changes when the site changes address or name.
 *
 * Before this file the domain was written out by hand in 21 files and the
 * brand name in 78, which made a migration a search-and-replace across the
 * whole codebase — the kind of edit where one missed canonical or hreflang
 * quietly points at the old host forever. Now moving is one environment
 * variable, and renaming is one constant.
 *
 * Nothing here reads a runtime value that could differ between the build and
 * the request: metadata is generated at build time, so a URL that changed
 * shape between the two would produce canonicals that disagree with the pages
 * they sit on.
 */

/**
 * Absolute origin, no trailing slash.
 *
 * Set NEXT_PUBLIC_SITE_URL in the environment to move the site. The fallback
 * is the current home rather than localhost on purpose: a missing variable
 * during a production build should keep the site where it is, not publish
 * 1766 canonicals pointing at a development machine.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://cryptopulse.media').replace(/\/+$/, '');

/** Host alone — for display in text where a full URL would read as clutter. */
export const SITE_HOST = SITE_URL.replace(/^https?:\/\//, '');

/**
 * The publication's name as readers see it: page titles, footer, legal pages,
 * schema.org, the title template. Includes the zone because the brand has
 * always been written with it.
 */
export const SITE_NAME = 'CryptoPulse.media';

/**
 * The name without its zone, for prose where the full form reads heavy —
 * "the {SITE_BRAND} editorial team" rather than "the CryptoPulse.media
 * editorial team".
 */
export const SITE_BRAND = 'CryptoPulse';

/**
 * Editorial inbox, published in schema.org and the RSS feed.
 *
 * Note it is not the address the public pages tell readers to write to — those
 * carry CONTACT_EMAIL from constants.ts, which is a personal mailbox. The two
 * have disagreed since before this file existed; unifying them is an editorial
 * decision, not a mechanical one.
 */
export const SITE_EMAIL = `info@${SITE_HOST}`;

/** Suffix appended to page titles by the root layout's title template. */
export const TITLE_SUFFIX = ` | ${SITE_NAME}`;

/**
 * Stable identity for the publisher across every JSON-LD block on the site.
 * Article, WebSite and Breadcrumb nodes all point here rather than repeating
 * the organization, so a crawler reads one publisher rather than 1766.
 */
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

/** Absolute URL for a site-relative path. Accepts both `/x` and `x`. */
export function siteUrl(path = ''): string {
  if (!path) return SITE_URL;
  return `${SITE_URL}/${String(path).replace(/^\/+/, '')}`;
}
