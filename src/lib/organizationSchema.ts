import { BASE } from './metadata';
import { ORGANIZATION_ID, SITE_EMAIL, SITE_NAME } from '@/lib/site';
import { LINKEDIN_PROFILE_URL } from '@/lib/constants';

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
 * Built from the footer's own constant rather than repeated here. Two copies
 * of one address is how the footer ended up pointing at the retired brand
 * while this list already named the new one. A sameAs pointing at the wrong
 * profile hands search engines a false identity claim and is hard to walk
 * back, so anything added here is opened by hand first.
 */
export const SOCIAL_PROFILES: string[] = [LINKEDIN_PROFILE_URL];

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
    // Общее описание издания целиком, слово в слово. Тот же текст стоит в
    // llms.txt, в первом абзаце «О нас» и на странице компании в LinkedIn:
    // раньше их было десять разных, и два из них противоречили друг другу.
    description: isRu
      ? 'Независимое международное медиа о криптовалютах и искусственном интеллекте. Мы переводим сложные технологические тренды на понятный язык, создавая материалы на английском и русском. Доверяем только первоисточникам, чтобы вы могли доверять нам.'
      : 'An independent international media outlet on crypto and artificial intelligence. We turn complex technology trends into plain language, publishing in English and Russian. We trust only primary sources, so that you can trust us.',
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
