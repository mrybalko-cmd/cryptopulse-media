import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken, ADMIN_SESSION_COOKIE } from '@/lib/admin/auth';

// Gate every /admin/* page except the login page itself. Verification
// happens here (Edge) so a stale/invalid cookie never even reaches a page.
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === '/admin/login') return NextResponse.next();

  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;

  if (!session) {
    const loginUrl = new URL('/admin/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
