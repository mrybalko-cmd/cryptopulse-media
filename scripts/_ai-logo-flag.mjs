/** Проставляет logoOnDark по посчитанной яркости знака. */
import { createClient } from '@sanity/client';
import { readFileSync } from 'node:fs';
const D='/private/tmp/claude-501/-Users-maksymrybalko-Desktop-AI/5abd23a0-d6a4-46b7-ba79-a0ccdf98ffcc/scratchpad/ai-logos/normalised';
const lum = JSON.parse(readFileSync(`${D}/_luminance.json`, 'utf8'));
const env = Object.fromEntries(readFileSync('.env.local','utf8').split('\n')
  .filter(l=>l.includes('=')&&!l.trim().startsWith('#'))
  .map(l=>{const i=l.indexOf('=');return [l.slice(0,i).trim(), l.slice(i+1).trim().replace(/^["']|["']$/g,'')];}));
const c = createClient({projectId:env.SANITY_PROJECT_ID||env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset:env.SANITY_DATASET||env.NEXT_PUBLIC_SANITY_DATASET||'production',
  apiVersion:'2024-01-01',token:env.SANITY_API_WRITE_TOKEN,useCdn:false});
let tx = c.transaction(); let light = 0;
for (const [slug, L] of Object.entries(lum)) {
  const onDark = L > 170;
  if (onDark) light += 1;
  tx = tx.patch(`ai-service-${slug}`, p => p.set({ logoOnDark: onDark }));
}
await tx.commit();
console.log(`Проставлено у ${Object.keys(lum).length} карточек, светлых знаков ${light}`);
