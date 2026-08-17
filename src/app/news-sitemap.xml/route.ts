import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'placeholder',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  // Reads go through Sanity's CDN. The plan allows 1,000,000 CDN requests
  // against 250,000 uncached ones, and with useCdn off every read was charged
  // to the small quota — 251.8k of 250k used, 4 of a million CDN requests.
  // Nothing here needs to be fresher than the CDN: results are wrapped in
  // unstable_cache for 300s anyway, and Sanity purges the CDN on publish.
  useCdn: true,
});

const BASE = 'https://cryptopulse.media';

export const revalidate = 300;

type NewsItem = {
  _type: 'news' | 'article';
  slug: { current: string };
  title: string;
  language: string;
  publishedAt: string;
};

async function fetchRecentNews(): Promise<NewsItem[]> {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return [];
  try {
    const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
    return await client.fetch(
      `*[_type in ["news", "article"] && publishedAt <= now() && publishedAt >= $since] | order(publishedAt desc) [0...1000] {
        _type, slug, title, language, publishedAt
      }`,
      { since: twoDaysAgo }
    );
  } catch {
    return [];
  }
}

export async function GET() {
  const items = await fetchRecentNews();

  const urls = items
    .filter((item) => item.slug?.current && item.title && item.publishedAt)
    .map((item) => {
      const locale = item.language === 'en' ? 'en' : 'ru';
      const pubDate = new Date(item.publishedAt).toISOString();
      const lang = item.language === 'en' ? 'en' : 'ru';
      const title = item.title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      const section = item._type === 'article' ? 'articles' : 'news';
      return `  <url>
    <loc>${BASE}/${locale}/${section}/${item.slug.current}</loc>
    <news:news>
      <news:publication>
        <news:name>CryptoPulse.media</news:name>
        <news:language>${lang}</news:language>
      </news:publication>
      <news:publication_date>${pubDate}</news:publication_date>
      <news:title>${title}</news:title>
    </news:news>
  </url>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urls}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=600, stale-while-revalidate=3600',
    },
  });
}
