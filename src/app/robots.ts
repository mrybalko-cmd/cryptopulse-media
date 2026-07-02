import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/_next/static/', '/_next/image'],
        disallow: '/studio/',
      },
    ],
    sitemap: 'https://cryptopulse.media/sitemap.xml',
  };
}
