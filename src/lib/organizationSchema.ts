import { BASE } from './metadata';
import { SITE_EMAIL, SITE_NAME } from '@/lib/site';

export const CONTACT_EMAIL = SITE_EMAIL;

/** The organization node's canonical id. Article, glossary and listing schemas
 *  reference this instead of restating the publisher, so the entity is
 *  described once and every page points at the same one. */
export const ORGANIZATION_ID = `${BASE}/#organization`;

/**
 * Verified public profiles for schema.org `sameAs`.
 *
 * Deliberately empty: the site runs an X account but its handle isn't recorded
 * anywhere in this repo, and a sameAs pointing at the wrong profile is worse
 * than none — it hands search engines a false identity claim for the brand and
 * is hard to walk back. Add the real URLs here once confirmed; the schema omits
 * the property entirely while this is empty.
 */
export const SOCIAL_PROFILES: string[] = [];

/**
 * The publisher entity, as NewsMediaOrganization rather than plain Organization.
 *
 * The subtype is what carries a newsroom's accountability signals — who runs
 * the editorial side, how corrections are handled, what the publication stands
 * behind. Every property below points at a page that actually exists and
 * actually covers that ground: /editorial-policy carries editorial
 * independence, ad labelling, accuracy standards and a corrections section,
 * and /authors is the editorial roster. Nothing here is aspirational.
 */
export function organizationSchema(locale: string) {
  const isRu = locale === 'ru';
  const policy = `${BASE}/${locale}/editorial-policy`;

  return {
    '@type': 'NewsMediaOrganization',
    '@id': ORGANIZATION_ID,
    name: '${SITE_NAME}',
    url: BASE,
    description: isRu
      ? 'Независимое издание о криптовалютах: новости, аналитика и справочные материалы о рынке, регулировании и биржах.'
      : 'An independent crypto publication: news, analysis and reference material on the market, regulation and exchanges.',
    logo: {
      '@type': 'ImageObject',
      url: `${BASE}/logo-mark.png`,
      width: 500,
      height: 500,
    },
    email: CONTACT_EMAIL,
    knowsLanguage: ['ru', 'en'],
    masthead: `${BASE}/${locale}/authors`,
    ethicsPolicy: policy,
    correctionsPolicy: policy,
    publishingPrinciples: policy,
    ...(SOCIAL_PROFILES.length > 0 ? { sameAs: SOCIAL_PROFILES } : {}),
  };
}
