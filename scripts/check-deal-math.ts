/**
 * Проверка арифметики учёта размещений.
 *
 * Запуск: node --experimental-strip-types scripts/check-deal-math.ts
 *
 * Держится отдельно от одноразовых скриптов (те с подчёркиванием в имени),
 * потому что считает деньги: ошибка здесь не ломает сборку и не падает в
 * логах, она тихо уезжает в отчёт и всплывает при сверке с банком.
 */
import { dealMoney, totals, type Deal } from '../src/lib/admin/dealMath.ts';

const deals: Deal[] = [
  { _id: 'a', client: 'Клиент A', dealDate: '2026-10-03', source: 'agency', partner: 'Агентство',
    status: 'paid', paidAt: '2026-10-10', currency: 'USD', fxToEur: 0.92, commissionPct: 15,
    placements: [
      { kind: 'banner', amount: 1000 },
      { kind: 'article', amount: 500 },
      { kind: 'newsletter', amount: 250 },
    ] },
  { _id: 'b', client: 'Клиент B', dealDate: '2026-10-07', source: 'direct',
    status: 'invoiced', currency: 'EUR', fxToEur: 1, commissionPct: 0,
    placements: [{ kind: 'pr', amount: 800 }] },
  { _id: 'c', client: 'Сорвалось', dealDate: '2026-10-09', source: 'agent', partner: 'Агент',
    status: 'cancelled', currency: 'EUR', fxToEur: 1, commissionPct: 10,
    placements: [{ kind: 'banner', amount: 9999 }] },
];

const a = dealMoney(deals[0]);
const ok = (name: string, got: unknown, want: unknown) =>
  console.log(`${JSON.stringify(got) === JSON.stringify(want) ? '✓' : '✗'} ${name}: ${got}${JSON.stringify(got) === JSON.stringify(want) ? '' : ` (ждали ${want})`}`);

ok('сумма трёх размещений', a.gross, 1750);
ok('комиссия 15%', a.commission, 262.5);
ok('остаётся нам', a.net, 1487.5);
ok('в евро по 0,92', a.netEur, 1368.5);

const t = totals(deals);
ok('сделок в расчёте (отменённая не в счёт)', t.deals, 2);
ok('размещений', t.placements, 4);
ok('сумма в евро', t.grossEur, 1750 * 0.92 + 800);
ok('комиссия в евро', t.commissionEur, 241.5);
ok('остаток в евро', t.netEur, 1368.5 + 800);
ok('отменённые не попали в валюты', t.byCurrency.length, 2);
ok('самый дорогой вид — баннер', t.byKind[0].label, 'Баннер');
ok('баннер только из живой сделки', t.byKind[0].amountEur, 920);
// 1368,50 € через агентство против 800 € напрямую — разрез отсортирован по
// деньгам, а не по тому, какой источник приятнее.
ok('источники отсортированы по остатку', t.bySource[0].label, 'Через агентство');
ok('прямой клиент вторым', t.bySource[1].netEur, 800);
