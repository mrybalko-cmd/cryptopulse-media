import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: 'Googlebot-News',
        allow: '/',
        disallow: ['/studio/', '/api/'],
      },
      {
        userAgent: '*',
        allow: ['/', '/_next/static/', '/_next/image'],
        disallow: ['/studio/', '/api/'],
      },
    ],
    sitemap: [
      'https://cryptopulse.media/sitemap.xml',
      'https://cryptopulse.media/news-sitemap.xml',
    ],
  };
}
