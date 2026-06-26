import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';

const handleI18n = createMiddleware(routing);

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === '/') {
    // next-intl's own redirect for "/" uses NextResponse.redirect() with no
    // status, which defaults to 307 (temporary) — issue a real 308 ourselves
    // since the default locale here never changes.
    return NextResponse.redirect(new URL(`/${routing.defaultLocale}`, request.url), 308);
  }
  if (pathname.startsWith('/studio') || pathname.startsWith('/api')) {
    return NextResponse.next();
  }
  return handleI18n(request);
}

// icon/apple-icon are file-convention routes Next.js serves at the root,
// without a file extension in the URL — exclude them explicitly so the
// locale middleware doesn't redirect them to a non-existent /[locale]/icon.
export const config = {
  matcher: ['/((?!_next|_vercel|api|icon|apple-icon|favicon.ico|.*\\..*).*)']
};
