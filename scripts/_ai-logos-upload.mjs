/**
 * Приводит собранные логотипы к одному виду и грузит их в Sanity.
 *
 * Всё переводится в PNG 512×512 с прозрачными полями. SVG не оставляем:
 * next/image отказывается обрабатывать вектор, пока не включён
 * dangerouslyAllowSVG, а включать его ради логотипов с чужих сайтов — значит
 * пустить в разметку чужой код. Растеризуем у себя.
 *
 * Пропорции не ломаем: fit=contain, фон прозрачный. Карточка сама положит
 * знак на свою подложку.
 */
import { createClient } from '@sanity/client';
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import sharp from 'sharp';

const SRC = '/private/tmp/claude-501/-Users-maksymrybalko-Desktop-AI/5abd23a0-d6a4-46b7-ba79-a0ccdf98ffcc/scratchpad/ai-logos';
const NORM = `${SRC}/normalised`;
mkdirSync(NORM, { recursive: true });

const env = Object.fromEntries(readFileSync('.env.local', 'utf8').split('\n')
  .filter(l => l.includes('=') && !l.trim().startsWith('#'))
  .map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^["']|["']$/g, '')]; }));
const client = createClient({
  projectId: env.SANITY_PROJECT_ID || env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.SANITY_DATASET || env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01', token: env.SANITY_API_WRITE_TOKEN, useCdn: false,
});

const files = readdirSync(SRC).filter(f => /\.(png|svg|webp|jpg)$/i.test(f));
let ok = 0, fail = [];
for (const f of files) {
  const slug = f.replace(/\.[^.]+$/, '');
  try {
    const png = await sharp(readFileSync(`${SRC}/${f}`), { density: 384 })
      .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png({ compressionLevel: 9 })
      .toBuffer();
    writeFileSync(`${NORM}/${slug}.png`, png);

    const asset = await client.assets.upload('image', png, {
      filename: `${slug}-logo.png`,
      title: `Логотип ${slug}`,
    });
    await client.patch(`ai-service-${slug}`)
      .set({ logo: { _type: 'image', asset: { _type: 'reference', _ref: asset._id } } })
      .commit();
    console.log(`✓ ${slug.padEnd(20)} ${(png.length / 1024).toFixed(0)} КБ`);
    ok += 1;
  } catch (e) {
    fail.push(`${slug}: ${e.message}`);
    console.log(`✗ ${slug.padEnd(20)} ${e.message}`);
  }
}
console.log(`\nЗагружено: ${ok} из ${files.length}`);
if (fail.length) console.log('Не вышло:\n  ' + fail.join('\n  '));
