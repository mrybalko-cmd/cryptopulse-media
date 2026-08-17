import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';
import { LEGACY_HOSTS, SITE_URL } from './lib/site';

const handleI18n = createMiddleware(routing);

/**
 * The host the site currently calls home. Anything served on a different host
 * is a staging copy — a real second address the site answers on before the
 * move — and must never be indexed: two hosts serving the same 1766 pages is
 * duplicate content, and the wrong one can win.
 */
const CANONICAL_HOST = SITE_URL.replace(/^https?:\/\//, '');

/**
 * A permanent redirect to the same path on the canonical host, or null.
 *
 * Only for hosts the site has actually left. Guarded against the case where a
 * legacy host is still the canonical one — that would redirect a page to
 * itself, forever.
 */
function redirectFromLegacyHost(request: NextRequest): NextResponse | null {
  const host = request.headers.get('host')?.split(':')[0];
  if (!host || host === CANONICAL_HOST) return null;
  if (!LEGACY_HOSTS.includes(host)) return null;
  const target = new URL(request.nextUrl.pathname + request.nextUrl.search, SITE_URL);
  return NextResponse.redirect(target, 308);
}

/** Adds noindex to every response served on a host that is not yet ours. */
function guardNonCanonicalHost(request: NextRequest, response: Response | undefined): void {
  const host = request.headers.get('host')?.split(':')[0];
  if (!host || host === CANONICAL_HOST || host.endsWith('.vercel.app') || host === 'localhost') return;
  response?.headers.set('X-Robots-Tag', 'noindex, nofollow');
}

export function proxy(request: NextRequest) {
  // Before anything else: a request on an address the site has left never gets
  // a page, only the way to its new one.
  const moved = redirectFromLegacyHost(request);
  if (moved) return moved;

  const { pathname } = request.nextUrl;
  if (pathname === '/') {
    // next-intl's own redirect for "/" uses NextResponse.redirect() with no
    // status, which defaults to 307 (temporary) — issue a real 308 ourselves
    // since the default locale here never changes.
    return NextResponse.redirect(new URL(`/${routing.defaultLocale}`, request.url), 308);
  }
  if (pathname.startsWith('/studio') || pathname.startsWith('/api') || pathname.startsWith('/admin')) {
    const passthrough = NextResponse.next();
    guardNonCanonicalHost(request, passthrough);
    return passthrough;
  }
  const response = handleI18n(request);
  // next-intl sets Set-Cookie (NEXT_LOCALE) on every response even with
  // localeDetection: false — any Set-Cookie causes Next.js to downgrade
  // Cache-Control to "private, no-store", which disables Vercel Edge Cache
  // and ISR entirely. Strip the cookie and restore public caching so Vercel
  // can serve cached HTML to Googlebot and users.
  if (response) {
    const location = response.headers.get('Location');
    if (location && response.status === 307) {
      // Every bare (non-locale-prefixed) path redirects here to add the
      // locale segment — this mapping never changes per-request, so it's a
      // permanent redirect. next-intl issues a temporary 307 by default;
      // reissue it as 308 so crawlers consolidate/drop the bare URL instead
      // of re-checking it indefinitely.
      return NextResponse.redirect(new URL(location, request.url), 308);
    }
    response.headers.delete('Set-Cookie');
    if (!location) {
      response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=3600');
    }
  }
  guardNonCanonicalHost(request, response);
  return response;
}

// icon/apple-icon are file-convention routes Next.js serves at the root,
// without a file extension in the URL — exclude them explicitly so the
// locale middleware doesn't redirect them to a non-existent /[locale]/icon.
export const config = {
  matcher: ['/((?!_next|_vercel|api|icon|apple-icon|favicon.ico|.*\\..*).*)']
};
