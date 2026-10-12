/** Средняя яркость непрозрачных пикселей знака: по ней выбираем подложку. */
import sharp from 'sharp';
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
const D='/private/tmp/claude-501/-Users-maksymrybalko-Desktop-AI/5abd23a0-d6a4-46b7-ba79-a0ccdf98ffcc/scratchpad/ai-logos/normalised';
const out={};
for (const f of readdirSync(D).filter(f=>f.endsWith('.png'))) {
  const { data } = await sharp(readFileSync(`${D}/${f}`)).raw().ensureAlpha().toBuffer({resolveWithObject:true});
  let sum=0,n=0;
  for (let i=0;i<data.length;i+=4){ const a=data[i+3]; if(a<40) continue;
    sum += 0.2126*data[i]+0.7152*data[i+1]+0.0722*data[i+2]; n++; }
  const L = n ? sum/n : 0;
  out[f.replace('.png','')] = Math.round(L);
}
writeFileSync(`${D}/_luminance.json`, JSON.stringify(out, null, 1));
const rows = Object.entries(out).sort((a,b)=>b[1]-a[1]);
for (const [k,v] of rows) console.log(`${k.padEnd(20)} ${String(v).padStart(4)}  ${v>170?'светлый — нужен тёмный фон':''}`);
console.log(`\nСветлых знаков: ${rows.filter(r=>r[1]>170).length} из ${rows.length}`);
