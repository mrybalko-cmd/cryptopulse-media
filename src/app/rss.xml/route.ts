import { createClient } from '@sanity/client';

const BASE = 'https://cryptopulse.media';
const SITE_NAME = 'CryptoPulse.media';
const CONTACT_EMAIL = 'info@cryptopulse.media';

export const revalidate = 1800;

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'placeholder',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
});

function esc(str: string): string {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

type FeedItem = {
  _id: string;
  _type: string;
  title: string;
  excerpt?: string;
  slug: { current: string };
  publishedAt: string;
  language: string;
  coverImage?: string;
};

async function fetchItems(): Promise<FeedItem[]> {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return [];
  try {
    return await client.fetch(
      `*[_type in ["news", "article"] && !(_id in path("drafts.**")) && defined(publishedAt) && publishedAt <= now()]
      | order(publishedAt desc) [0...50] {
        _id, _type, title, excerpt, slug, publishedAt, language,
        "coverImage": coverImage.asset->url
      }`
    );
  } catch {
    return [];
  }
}

export async function GET() {
  const items = await fetchItems();

  const itemsXml = items
    .filter(i => i.slug?.current && i.title && i.publishedAt)
    .map(item => {
      const section = item._type === 'article' ? 'articles' : 'news';
      const url = `${BASE}/${item.language}/${section}/${item.slug.current}`;
      const pubDate = new Date(item.publishedAt).toUTCString();
      const description = esc(item.excerpt || item.title);
      const imageTag = item.coverImage
        ? `\n      <enclosure url="${esc(item.coverImage)}" type="image/jpeg" length="0" />`
        : '';

      return `  <item>
    <title>${esc(item.title)}</title>
    <link>${url}</link>
    <guid isPermaLink="true">${url}</guid>
    <description>${description}</description>
    <pubDate>${pubDate}</pubDate>
    <language>${item.language}</language>${imageTag}
  </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${SITE_NAME}</title>
    <link>${BASE}</link>
    <description>Крипто- и AI-аналитика для простых людей | Crypto &amp; AI intelligence for European investors</description>
    <language>ru, en</language>
    <managingEditor>${CONTACT_EMAIL}</managingEditor>
    <webMaster>${CONTACT_EMAIL}</webMaster>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${BASE}/rss.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${BASE}/icon.png</url>
      <title>${SITE_NAME}</title>
      <link>${BASE}</link>
    </image>
${itemsXml}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=1800, stale-while-revalidate=3600',
    },
  });
}
