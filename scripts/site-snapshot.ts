/**
 * Records what every page on the site currently says about itself.
 *
 * The domain migration touches 75 hardcoded URLs across 21 files. This exists
 * so the change can be proven harmless rather than assumed harmless: run it
 * before, run it after, diff. A canonical that quietly kept pointing at the old
 * host, or a hreflang pair that half-moved, is invisible to a build and fatal
 * to a migration.
 *
 *   node --experimental-strip-types scripts/site-snapshot.ts <base> <out.json>
 */
import fs from 'node:fs';
import https from 'node:https';

const BASE = process.argv[2] ?? 'https://cryptopulse.media';
const OUT = process.argv[3] ?? 'snapshot.json';
const CONCURRENCY = 10;

interface PageFacts {
  status: number;
  title: string | null;
  description: string | null;
  canonical: string | null;
  robots: string | null;
  h1: string | null;
  ogUrl: string | null;
  ogTitle: string | null;
  hreflang: Record<string, string>;
  jsonLdTypes: string[];
  /** Every internal link target, so a lost link shows up as a diff. */
  internalLinks: string[];
  words: number;
}

/**
 * Optional fourth argument: an IP to connect to, ignoring DNS.
 *
 * A domain that has just moved spends up to its TTL with public resolvers
 * still handing out the old address. Pinning the IP lets the new host be
 * verified now rather than half an hour from now, and — more importantly —
 * verifies the server itself rather than whatever DNS happens to say.
 */
const PIN_IP = process.argv[4];

async function fetchText(url: string): Promise<{ status: number; body: string }> {
  if (!PIN_IP) {
    // No manual Accept-Encoding: fetch negotiates and decompresses on its own,
    // and asking for gzip by hand hands back a body it has already decoded.
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SiteSnapshot/1.0)' },
      redirect: 'manual',
      signal: AbortSignal.timeout(45_000),
    });
    return { status: res.status, body: await res.text() };
  }
  const u = new URL(url);
  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        host: PIN_IP,
        servername: u.hostname,          // SNI still names the real host
        port: 443,
        path: u.pathname + u.search,
        method: 'GET',
        headers: { Host: u.hostname, 'User-Agent': 'Mozilla/5.0 (compatible; SiteSnapshot/1.0)', 'Accept-Encoding': 'identity' },
        timeout: 45_000,
      },
      res => {
        let body = '';
        res.setEncoding('utf8');
        res.on('data', c => (body += c));
        res.on('end', () => resolve({ status: res.statusCode ?? 0, body }));
      }
    );
    req.on('timeout', () => req.destroy(new Error('timeout')));
    req.on('error', reject);
    req.end();
  });
}

function one(html: string, re: RegExp): string | null {
  const m = html.match(re);
  return m ? m[1].trim() : null;
}

/** Host is deliberately stripped: the point is to compare paths across a rename. */
function stripHost(u: string): string {
  return u.replace(/^https?:\/\/[^/]+/, '') || '/';
}

function extract(status: number, html: string): PageFacts {
  const body = html.replace(/<script[\s\S]*?<\/script>/g, '');
  const hreflang: Record<string, string> = {};
  for (const m of html.matchAll(/<link[^>]+hrefLang="([^"]+)"[^>]+href="([^"]+)"/gi)) {
    hreflang[m[1]] = stripHost(m[2]);
  }
  const jsonLdTypes: string[] = [];
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      const d = JSON.parse(m[1]);
      jsonLdTypes.push(d['@type'] ?? (d['@graph'] ? '@graph' : '?'));
    } catch { jsonLdTypes.push('BROKEN'); }
  }
  const links = new Set<string>();
  for (const m of body.matchAll(/href="(\/[^"#?]*)"/g)) {
    if (!m[1].startsWith('/_next') && !/\.(png|jpg|svg|ico|webp|css|js)$/.test(m[1])) links.add(m[1].replace(/\/$/, '') || '/');
  }
  const text = body.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  return {
    status,
    title: one(html, /<title>([\s\S]*?)<\/title>/),
    description: one(html, /<meta name="description" content="([^"]*)"/),
    canonical: (u => (u ? stripHost(u) : null))(one(html, /<link rel="canonical" href="([^"]+)"/)),
    robots: one(html, /<meta name="robots" content="([^"]*)"/),
    h1: (v => (v ? v.replace(/<[^>]+>/g, '').trim() : null))(one(body, /<h1[^>]*>([\s\S]*?)<\/h1>/)),
    ogUrl: (u => (u ? stripHost(u) : null))(one(html, /<meta property="og:url" content="([^"]+)"/)),
    ogTitle: one(html, /<meta property="og:title" content="([^"]*)"/),
    hreflang,
    jsonLdTypes,
    internalLinks: [...links].sort(),
    words: text.split(' ').length,
  };
}

const sitemapXml = (await fetchText(`${BASE}/sitemap.xml`)).body;
// The sitemap lists absolute URLs built from SITE_URL, which is the production
// host even when the sitemap itself came from localhost. Taking those verbatim
// would quietly snapshot production while claiming to measure the local build —
// which is exactly what happened the first time this ran.
const urls = [...sitemapXml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => BASE + stripHost(m[1]));
console.log(`страниц в sitemap: ${urls.length} (опрашиваю ${BASE})`);

const out: Record<string, PageFacts | { error: string }> = {};
let done = 0;
async function worker(queue: string[]) {
  for (;;) {
    const url = queue.pop();
    if (!url) return;
    const path = stripHost(url);
    try {
      const { status, body } = await fetchText(url);
      out[path] = extract(status, body);
    } catch (e) {
      out[path] = { error: String(e).slice(0, 120) };
    }
    if (++done % 200 === 0) console.log(`  ${done}/${urls.length}…`);
  }
}
const queue = [...urls];
await Promise.all(Array.from({ length: CONCURRENCY }, () => worker(queue)));

fs.writeFileSync(OUT, JSON.stringify({ base: BASE, takenAt: new Date().toISOString(), pages: out }, null, 1));
const errors = Object.values(out).filter(p => 'error' in p).length;
console.log(`\nзаписано: ${Object.keys(out).length} страниц в ${OUT}`);
console.log(`ошибок при съёме: ${errors}`);
