import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'placeholder',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
});

const BASE = 'https://cryptopulse.media';

export const revalidate = 3600;

type NewsItem = {
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
      `*[_type == "news" && publishedAt <= now() && publishedAt >= $since] | order(publishedAt desc) [0...1000] {
        slug, title, language, publishedAt
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
      return `  <url>
    <loc>${BASE}/${locale}/news/${item.slug.current}</loc>
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
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  });
}
