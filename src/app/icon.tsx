import { ImageResponse } from 'next/og';
import { BrandTile } from '@/lib/brandMark';

export const size = { width: 96, height: 96 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(<BrandTile size={96} radius={20} />, { ...size });
}
