import { NextRequest, NextResponse } from 'next/server';
import { incrementBannerClick } from '@/lib/sanity';

// Resolves the destination server-side from the banner's own Sanity document
// rather than accepting a URL from the client — an arbitrary client-supplied
// redirect target would be an open-redirect vector.
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const link = await incrementBannerClick(id);
  if (!link) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  return NextResponse.redirect(link);
}
