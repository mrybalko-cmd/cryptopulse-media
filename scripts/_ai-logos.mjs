/**
 * Сбор логотипов сервисов с их же сайтов.
 *
 * Порядок источников от лучшего к худшему: иконка из web-манифеста (там чаще
 * всего лежит квадрат 512×512), затем apple-touch-icon (обычно 180×180),
 * затем favicon.svg (вектор, масштабируется как угодно). Ничего не
 * дорисовываем и не растягиваем: если нашлось только 64 пикселя, карточка
 * останется с монограммой — размытый знак хуже честных двух букв.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { SERVICES } from './ai-seed-services.ts';

const OUT = '/private/tmp/claude-501/-Users-maksymrybalko-Desktop-AI/5abd23a0-d6a4-46b7-ba79-a0ccdf98ffcc/scratchpad/ai-logos';
mkdirSync(OUT, { recursive: true });

const UA = { 'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36' };
const abs = (base, href) => { try { return new URL(href, base).href; } catch { return null; } };

async function get(url, timeout = 15000) {
  const c = AbortSignal.timeout(timeout);
  const r = await fetch(url, { headers: UA, signal: c, redirect: 'follow' });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r;
}

/** Все кандидаты в порядке предпочтения. */
async function candidates(site) {
  const out = [];
  let html = '', base = site;
  try { const r = await get(site); base = r.url; html = await r.text(); } catch { return out; }

  const manifest = html.match(/<link[^>]+rel=["']?manifest["']?[^>]*>/i)?.[0];
  const mHref = manifest?.match(/href=["']([^"']+)["']/i)?.[1];
  if (mHref) {
    try {
      const m = await (await get(abs(base, mHref))).json();
      for (const i of (m.icons ?? []).slice().sort((a, b) => px(b.sizes) - px(a.sizes))) {
        const u = abs(base, i.src);
        if (u && px(i.sizes) >= 192) out.push({ url: u, why: `манифест ${i.sizes}` });
      }
    } catch { /* манифеста нет или он закрыт — идём дальше */ }
  }
  for (const tag of html.match(/<link[^>]+rel=["']?[^"'>]*icon[^"'>]*["']?[^>]*>/gi) ?? []) {
    const href = tag.match(/href=["']([^"']+)["']/i)?.[1];
    if (!href) continue;
    const sizes = tag.match(/sizes=["']([^"']+)["']/i)?.[1] ?? '';
    const apple = /apple-touch-icon/i.test(tag);
    const svg = /\.svg(\?|$)/i.test(href);
    const u = abs(base, href);
    if (!u) continue;
    if (svg) out.push({ url: u, why: 'favicon.svg', rank: 1 });
    else if (apple) out.push({ url: u, why: `apple-touch-icon ${sizes || '180'}`, rank: 2 });
    else if (px(sizes) >= 192) out.push({ url: u, why: `icon ${sizes}`, rank: 2 });
  }
  out.push({ url: abs(base, '/favicon.svg'), why: 'favicon.svg (угадан)', rank: 3 });
  out.push({ url: abs(base, '/apple-touch-icon.png'), why: 'apple-touch-icon (угадан)', rank: 3 });
  return out.filter(x => x.url);
}
const px = s => Math.max(0, ...String(s || '').split(/\s+/).map(v => parseInt(v, 10) || 0));

const rows = [];
for (const s of SERVICES) {
  let saved = null;
  for (const c of await candidates(s.website)) {
    try {
      const r = await get(c.url, 12000);
      const type = (r.headers.get('content-type') || '').split(';')[0];
      const buf = Buffer.from(await r.arrayBuffer());
      if (buf.length < 200) continue;
      const ext = type.includes('svg') ? 'svg' : type.includes('png') ? 'png'
        : type.includes('webp') ? 'webp' : type.includes('jpeg') ? 'jpg' : null;
      if (!ext) continue;
      const dim = ext === 'png' ? pngSize(buf) : null;
      if (ext === 'png' && dim && Math.min(dim.w, dim.h) < 128) continue;
      writeFileSync(`${OUT}/${s.slug}.${ext}`, buf);
      saved = { file: `${s.slug}.${ext}`, why: c.why, size: dim ? `${dim.w}×${dim.h}` : (ext === 'svg' ? 'вектор' : '?'), bytes: buf.length };
      break;
    } catch { /* следующий кандидат */ }
  }
  rows.push({ slug: s.slug, name: s.name, ...(saved ?? { file: null }) });
  console.log(`${saved ? '✓' : '✗'} ${s.name.padEnd(20)} ${saved ? `${saved.file.padEnd(26)} ${saved.size.padEnd(10)} ${saved.why}` : 'не нашёл'}`);
}

function pngSize(b) {
  if (b.length < 24 || b.readUInt32BE(0) !== 0x89504e47) return null;
  return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
}

writeFileSync(`${OUT}/_report.json`, JSON.stringify(rows, null, 1));
const ok = rows.filter(r => r.file).length;
console.log(`\nНашлось: ${ok} из ${rows.length}. Без логотипа: ${rows.filter(r => !r.file).map(r => r.name).join(', ') || 'нет'}`);
