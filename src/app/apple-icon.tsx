import { ImageResponse } from 'next/og';
import { BrandTile } from '@/lib/brandMark';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

// Square, not rounded: iOS applies its own mask to home-screen icons, and a
// radius baked in here would be clipped a second time.
export default function AppleIcon() {
  return new ImageResponse(<BrandTile size={180} radius={0} />, { ...size });
}
