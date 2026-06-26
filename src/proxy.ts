import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';

const handleI18n = createMiddleware(routing);

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
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
