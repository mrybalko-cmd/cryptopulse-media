/**
 * Перевод учёта сделок на USDT как базовую валюту.
 *
 * Было одно поле `fxToEur` — сколько евро в единице валюты сделки, и весь
 * отчёт считался в евро. Стало два: `fxToUsdt` (валюта сделки → USDT) и
 * `usdtToEur` (USDT → евро, справочно). Оба заморожены датой сделки.
 *
 * Запуск: node scripts/migrate-deals-usdt.mjs [--apply]
 * Без --apply только печатает, что собирается сделать.
 *
 * Правило переноса:
 *   USDT, USDC, USD → fxToUsdt = 1, usdtToEur = прежний fxToEur
 *                     (прежний курс был «евро за доллар», а доллар и его
 *                      токены мы приравниваем к USDT, так что это ровно он)
 *   EUR            → в прежней записи курс евро к евро равнялся единице и
 *                     про EUR/USDT не говорил ничего, поэтому курс берётся
 *                     из --eur-usdt (по умолчанию 1.09) и пишется честно,
 *                     с предупреждением в вывод.
 */
import { createClient } from '@sanity/client';
import fs from 'node:fs';

const env = Object.fromEntries(
  fs.readFileSync(new URL('../.env.local', import.meta.url), 'utf8')
    .split('\n')
    .filter(l => l.includes('='))
    .map(l => {
      const i = l.indexOf('=');
      return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^["']|["']$/g, '')];
    })
);

const apply = process.argv.includes('--apply');
const eurUsdtArg = process.argv.find(a => a.startsWith('--eur-usdt='));
const EUR_USDT = Number(eurUsdtArg?.split('=')[1]) || 1.09;

const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-10-01',
  token: env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

const round4 = n => Math.round(n * 10000) / 10000;

const deals = await client.fetch(
  '*[_type == "adDeal"] | order(dealDate asc){_id, client, dealDate, currency, fxToEur, fxToUsdt, usdtToEur}'
);

console.log(`Сделок в базе: ${deals.length}${apply ? '' : ' · режим просмотра, записи не будет'}\n`);

let planned = 0;
const tx = client.transaction();

for (const d of deals) {
  if (d.fxToUsdt != null && d.usdtToEur != null) {
    console.log(`· ${d.client} (${d.dealDate}) — уже переведена, пропускаю`);
    continue;
  }

  const old = Number(d.fxToEur) || 1;
  let fxToUsdt, usdtToEur, note;

  if (d.currency === 'EUR') {
    fxToUsdt = round4(EUR_USDT);
    usdtToEur = round4(1 / EUR_USDT);
    note = `⚠ курс взят из --eur-usdt=${EUR_USDT}: в прежней записи его не было`;
  } else {
    fxToUsdt = 1;
    usdtToEur = round4(old);
    note = `прежний курс ${old} стал курсом USDT → EUR`;
  }

  console.log(
    `· ${d.client} (${d.dealDate}, ${d.currency}): fxToUsdt=${fxToUsdt}, usdtToEur=${usdtToEur} — ${note}`
  );
  planned++;
  tx.patch(d._id, p => p.set({ fxToUsdt, usdtToEur }).unset(['fxToEur']));
}

if (!planned) {
  console.log('\nПереносить нечего.');
} else if (!apply) {
  console.log(`\nК переносу: ${planned}. Повторите с --apply, чтобы записать.`);
} else {
  await tx.commit();
  console.log(`\nПеренесено: ${planned}.`);
}
