import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: 'Googlebot-News',
        allow: '/',
        disallow: ['/studio/', '/api/', '/admin/'],
      },
      // Assistants that read and cite pages, named explicitly rather than left
      // to fall through the wildcard. Same permissions the wildcard already
      // gave them; the point is that the access is now a stated decision and
      // shows up in the file for anyone checking.
      //
      // Training-only crawlers (CCBot, Google-Extended) are also still allowed
      // by the wildcard below. Blocking them is a content-licensing call rather
      // than an SEO one, so it is left open until it is made deliberately.
      {
        userAgent: ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-User', 'PerplexityBot'],
        allow: '/',
        disallow: ['/studio/', '/api/', '/admin/'],
      },
      {
        userAgent: '*',
        allow: ['/', '/_next/static/', '/_next/image'],
        disallow: ['/studio/', '/api/', '/admin/'],
      },
    ],
    sitemap: [
      `${SITE_URL}/sitemap.xml`,
      `${SITE_URL}/news-sitemap.xml`,
    ],
  };
}
