import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 2592000,
    // Next.js always emits every deviceSizes width in each <Image>'s srcset
    // regardless of what the `sizes` attribute hints — no image on this site
    // (cover images capped at max-w-3xl = 768px, even at 2x DPR) ever needs
    // more than ~1536px, so 1920 is a safe ceiling. Without this, the default
    // deviceSizes array includes 2048/3840, which crawlers flag as
    // oversized image responses even though real browsers never request them.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    remotePatterns: [
      { protocol: 'https', hostname: '**.coingecko.com' },
      { protocol: 'https', hostname: '**.cryptopanic.com' },
      { protocol: 'https', hostname: 'i.ytimg.com' },
      { protocol: 'https', hostname: 'cdn.sanity.io' },
    ]
  }
};

export default withNextIntl(nextConfig);
