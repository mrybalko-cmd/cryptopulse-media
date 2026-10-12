/** Сброс кэша каталога AI. Секрет читается из файла, в argv не попадает. */
import { readFileSync } from 'node:fs';
const read = f => { try { return readFileSync(f, 'utf8'); } catch { return ''; } };
const secret = (read('.env.local') + '\n' + read(`${process.env.HOME}/Desktop/AI/.env`))
  .match(/^REVALIDATE_SECRET=(.*)$/m)?.[1]?.trim().replace(/^["']|["']$/g, '');
if (!secret) { console.error('REVALIDATE_SECRET не найден'); process.exit(1); }
const res = await fetch(`https://intokened.com/api/revalidate?secret=${encodeURIComponent(secret)}`, {
  method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ type: 'ai' }),
});
console.log('HTTP', res.status, (await res.text()).slice(0, 300));
