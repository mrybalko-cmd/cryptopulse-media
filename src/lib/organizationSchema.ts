import { BASE } from './metadata';
import { ORGANIZATION_ID, SITE_EMAIL, SITE_NAME } from '@/lib/site';

export const CONTACT_EMAIL = SITE_EMAIL;

/** The organization node's canonical id. Article, glossary and listing schemas
 *  reference this instead of restating the publisher, so the entity is
 *  described once and every page points at the same one.
 *
 *  Re-exported from site.ts rather than computed again: two definitions of the
 *  same id is how half the graph ends up pointing at a node that nothing
 *  declares. */
export { ORGANIZATION_ID };

/**
 * Verified public profiles for schema.org `sameAs`.
 *
 * The one entry below was checked by hand on 07.10.2026 and answers 200. A
 * sameAs pointing at the wrong profile is worse than none — it hands search
 * engines a false identity claim for the brand and is hard to walk back — so
 * add a URL here only after opening it. The old CryptoPulse page is not listed:
 * it answers 301 since the rename, and a redirect is not an identity.
 */
export const SOCIAL_PROFILES: string[] = ['https://www.linkedin.com/company/intokened'];

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
    name: SITE_NAME,
    url: BASE,
    description: isRu
      ? 'Независимое издание о криптовалютах и искусственном интеллекте: новости, аналитика и справочные материалы о рынке, регулировании, биржах и технологиях ИИ.'
      : 'An independent publication on crypto and artificial intelligence: news, analysis and reference material on the market, its regulation, exchanges and AI technology.',
    logo: {
      '@type': 'ImageObject',
      url: `${BASE}/brand-mark-v3.png`,
      width: 512,
      height: 512,
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
