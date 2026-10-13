import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  // The CSP is scoped to the locale-prefixed public routes only (/ru/*,
  // /en/*) — /admin and /studio never match either source pattern, so they
  // keep getting the four headers below but no CSP at all. Sanity Studio in
  // particular is a heavy third-party SPA with its own script/style/connect
  // needs we don't have full visibility into; restricting it here risked
  // silently breaking the CMS editing UI for no real security benefit (it's
  // an authenticated, noindexed internal tool, not the audience this policy
  // protects). Every origin below is enumerated from the actual code: GA
  // (layout.tsx), Ahrefs analytics (layout.tsx), Google Reader Revenue
  // Manager / Subscribe with Google Basic (layout.tsx — runs its own
  // network calls and can render its own UI in an iframe), the YouTube
  // embed iframe (YouTubeEmbed.tsx — Twitter/X embeds are plain
  // server-rendered links, no iframe), and the image CDNs already
  // allowlisted in images.remotePatterns below. script-src/style-src keep
  // 'unsafe-inline' for the pre-hydration theme script and Tailwind's
  // inline style attributes — real nonce-based hardening is a further
  // step, not attempted here.
  async headers() {
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://analytics.ahrefs.com https://news.google.com",
      "style-src 'self' 'unsafe-inline' https://news.google.com",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      // GA4 давно шлёт события не на google-analytics.com, а на
      // region1.analytics.google.com — другой домен, и старый список его не
      // покрывал. Счётчик грузился, gtag отвечал, а каждый запрос молча
      // отбивался политикой: в консоли «Refused to connect», в отчётах тишина.
      // Туда же относятся домены Google Ads: без них не работают конверсии.
      "connect-src 'self' " +
        "https://www.google-analytics.com https://*.google-analytics.com " +
        "https://analytics.google.com https://*.analytics.google.com " +
        "https://www.googletagmanager.com " +
        "https://www.google.com https://www.googleadservices.com " +
        // Конверсии Google Ads уходят ещё и на локальный домен страны
        // посетителя: чех пингует google.cz, немец google.de. Шаблон в CSP
        // по доменной зоне не работает, поэтому страны перечислены — это те,
        // по которым идут наши кампании.
        "https://www.google.cz https://www.google.de https://www.google.fr https://www.google.es https://www.google.it https://www.google.nl https://www.google.pl https://www.google.pt https://www.google.ie https://www.google.se https://www.google.dk https://www.google.no https://www.google.fi https://www.google.at https://www.google.be https://www.google.gr https://www.google.ro https://www.google.bg https://www.google.hr https://www.google.si https://www.google.sk https://www.google.hu https://www.google.lv https://www.google.lt https://www.google.lu https://www.google.ch https://www.google.ee https://www.google.ca https://www.google.co.uk https://www.google.com.ua https://www.google.ae https://www.google.com.au https://www.google.com.cy https://www.google.com.mt " +
        "https://*.doubleclick.net " +
        "https://analytics.ahrefs.com https://news.google.com",
      // googletagmanager — кадр из <noscript> контейнера GTM.
      "frame-src https://www.youtube.com https://news.google.com https://www.googletagmanager.com",
      "object-src 'none'",
      "base-uri 'self'",
      "frame-ancestors 'self'",
    ].join('; ');

    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      {
        source: '/ru/:path*',
        headers: [{ key: 'Content-Security-Policy', value: csp }],
      },
      {
        source: '/en/:path*',
        headers: [{ key: 'Content-Security-Policy', value: csp }],
      },
    ];
  },
  experimental: {
    // Default 1MB is too small for banner image uploads in /admin (server
    // actions posting a File via FormData go through this same limit).
    serverActions: { bodySizeLimit: '8mb' },

  },
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
