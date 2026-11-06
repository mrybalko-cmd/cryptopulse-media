import { buildSitemapEntries } from '@/lib/sitemapEntries';

/**
 * Карта сайта — обычный серверный ответ под кэшем CDN, а не ISR-страница.
 *
 * Как src/app/sitemap.ts она с деплоя 03.11.2026 ни разу не пересобралась на
 * Vercel: трое суток отдавался снимок момента сборки, без единого свежего
 * материала, при том что ошибок в логах не было и локально пересборка шла.
 * Здесь кэш задан явно и проверяем по заголовкам: CDN держит ответ час, ещё
 * час может отдавать старый, пока в фоне собирается новый. Худший случай —
 * карта отстаёт от базы на два часа, а не на дни.
 *
 * Путь тот же, /sitemap.xml, поэтому robots.txt, Search Console и правило
 * файрвола «Bypass machine files» менять не нужно.
 */
export const dynamic = 'force-dynamic';

const escapeXml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');

const isoDate = (d: string | Date | undefined) => {
  if (!d) return null;
  const date = d instanceof Date ? d : new Date(d);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
};

export async function GET() {
  const entries = await buildSitemapEntries();
  const body = entries
    .map((e) => {
      const lastmod = isoDate(e.lastModified);
      return (
        '<url>\n' +
        `<loc>${escapeXml(e.url)}</loc>\n` +
        (lastmod ? `<lastmod>${lastmod}</lastmod>\n` : '') +
        (e.changeFrequency ? `<changefreq>${e.changeFrequency}</changefreq>\n` : '') +
        (e.priority !== undefined ? `<priority>${e.priority}</priority>\n` : '') +
        '</url>'
      );
    })
    .join('\n');

  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    body +
    '\n</urlset>\n';

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=3600',
    },
  });
}
