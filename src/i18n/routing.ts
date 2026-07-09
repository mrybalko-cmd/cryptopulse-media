import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['ru', 'en'],
  defaultLocale: 'en',
  localePrefix: 'always',
  localeDetection: false,
  // next-intl's default Link:-header hreflang alternates swap the locale
  // segment while keeping the SAME slug. Our RU/EN slugs are never the same
  // string (RU is transliterated, EN is a separate semantic slug), so that
  // auto-generated header always points at a URL that doesn't exist in the
  // other locale (or a bare/x-default URL that 308s then 404s). Every page
  // already emits correct, translation-aware alternates via its own
  // generateMetadata (using the real cross-locale slug from Sanity) — this
  // was the root cause of the mass "hreflang to redirect/broken page" and
  // "broken redirect" findings in Ahrefs.
  alternateLinks: false,
});
