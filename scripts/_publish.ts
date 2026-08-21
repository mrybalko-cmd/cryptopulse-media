import { createClient } from '@sanity/client';
import { readFileSync } from 'fs';
const write = createClient({ projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!, apiVersion: '2024-01-01', useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN! });
const FIELDS = ['intro','figures','body','allowed','restricted','timeline','faq','sources','seoTitle','seoDescription'];
function parse(file: string) {
  const out: Record<string, string> = {}; let cur = '', buf: string[] = [];
  const flush = () => { if (cur) out[cur] = buf.join('\n').trim(); buf = []; };
  for (const l of readFileSync(file, 'utf8').split('\n')) {
    const m = l.match(/^## (\w+)$/);
    if (m && FIELDS.includes(m[1])) { flush(); cur = m[1]; continue; }
    if (cur) buf.push(l);
  }
  flush(); return out;
}
(async () => {
  const [slug, fEn, fRu, relRu, relEn] = process.argv.slice(2);
  const en = parse(fEn), ru = parse(fRu);
  const doc = await write.fetch(`*[_type=="regulationCountry" && slug.current==$slug][0]{ _id }`, { slug });
  if (!doc) { console.error('нет страны:', slug); process.exit(1); }
  const page: Record<string, any> = { _type: 'object' };
  for (const k of FIELDS) page[k] = { _type: 'object', ru: ru[k] || '', en: en[k] || '' };
  if (relRu) page.related = { _type: 'object', ru: relRu.split(',').join('\n'), en: (relEn||'').split(',').join('\n') };
  const today = new Date().toISOString().slice(0, 10); // дата проверки — сигнал свежести, не хардкодить
  await write.patch(doc._id).set({ page, hasPage: true, checkedAt: today, publishedAt: today }).commit();
  console.log(`опубликовано: ${slug} (EN ${FIELDS.filter(k=>en[k]).length}/10, RU ${FIELDS.filter(k=>ru[k]).length}/10)`);
})();
