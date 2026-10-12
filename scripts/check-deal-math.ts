/**
 * Проверка арифметики учёта размещений.
 *
 * Запуск: node --experimental-strip-types scripts/check-deal-math.ts
 *
 * Держится отдельно от одноразовых скриптов (те с подчёркиванием в имени),
 * потому что считает деньги: ошибка здесь не ломает сборку и не падает в
 * логах, она тихо уезжает в отчёт и всплывает при сверке с банком.
 */
import { dealMoney, totals, monthlyGross, type Deal } from '../src/lib/admin/dealMath.ts';

const deals: Deal[] = [
  { _id: 'a', client: 'Клиент A', dealDate: '2026-10-03', source: 'agency', partner: 'Агентство',
    status: 'paid', paidAt: '2026-10-10', currency: 'USD', fxToUsdt: 1, usdtToEur: 0.92, commissionPct: 15,
    placements: [
      { kind: 'banner', amount: 1000 },
      { kind: 'article', amount: 500 },
      { kind: 'newsletter', amount: 250 },
    ] },
  { _id: 'b', client: 'Клиент B', dealDate: '2026-10-07', source: 'direct',
    status: 'invoiced', currency: 'EUR', fxToUsdt: 1.09, usdtToEur: 0.92, commissionPct: 0,
    placements: [{ kind: 'pr', amount: 800 }] },
  { _id: 'c', client: 'Сорвалось', dealDate: '2026-10-09', source: 'agent', partner: 'Агент',
    status: 'cancelled', currency: 'EUR', fxToUsdt: 1.09, usdtToEur: 0.92, commissionPct: 10,
    placements: [{ kind: 'banner', amount: 9999 }] },
];

const a = dealMoney(deals[0]);
const ok = (name: string, got: unknown, want: unknown) =>
  console.log(`${JSON.stringify(got) === JSON.stringify(want) ? '✓' : '✗'} ${name}: ${got}${JSON.stringify(got) === JSON.stringify(want) ? '' : ` (ждали ${want})`}`);

ok('сумма трёх размещений', a.gross, 1750);
ok('комиссия 15%', a.commission, 262.5);
ok('остаётся нам', a.net, 1487.5);
ok('в USDT по курсу 1', a.netUsdt, 1487.5);
ok('в евро по 0,92', a.netEur, 1368.5);

// Сделка в евро: 800 € — это 872 USDT по курсу 1,09, и обратно в евро по
// 0,92 выходит 802,24 €, а не ровно 800. Расхождение в 2,24 € — цена двух
// курсов вместо одного, и оно должно быть видно в проверке, а не всплыть
// однажды при сверке с банком.
const b = dealMoney(deals[1]);
ok('евровая сделка в USDT', b.netUsdt, 872);
ok('и обратно в евро — с расхождением', b.netEur, 802.24);

const t = totals(deals);
ok('сделок в расчёте (отменённая не в счёт)', t.deals, 2);
ok('размещений', t.placements, 4);
ok('сумма в USDT', t.grossUsdt, 1750 + 872);
ok('комиссия в USDT', t.commissionUsdt, 262.5);
ok('остаток в USDT', t.netUsdt, 1487.5 + 872);
ok('остаток в евро', t.netEur, 1368.5 + 802.24);
ok('неоплаченный счёт — только сделка B', t.unpaid.usdt, 872);
ok('неоплаченных счетов', t.unpaid.count, 1);
ok('отменённые не попали в валюты', t.byCurrency.length, 2);
ok('самый дорогой вид — баннер', t.byKind[0].label, 'Баннер');
ok('баннер только из живой сделки', t.byKind[0].amountUsdt, 1000);
// 1487,50 USDT через агентство против 872 напрямую — разрез отсортирован по
// деньгам, а не по тому, какой источник приятнее.
ok('источники отсортированы по остатку', t.bySource[0].label, 'Через агентство');
ok('прямой клиент вторым', t.bySource[1].netUsdt, 872);

// График: пустые месяцы остаются в ряду нулями, отменённая сделка в него не
// попадает, а подпись получает год, когда период пересекает год.
const g = monthlyGross(deals, '2026-08-01', '2026-10-31');
ok('столбиков по месяцам периода', g.bars.length, 3);
ok('август пустой', g.bars[0].grossUsdt, 0);
ok('октябрь — обе живые сделки', g.bars[2].grossUsdt, 1750 + 872);
ok('октябрь — две сделки, не три', g.bars[2].deals, 2);
ok('подпись без года внутри одного года', g.bars[2].label, 'окт');
ok('подпись с годом на стыке лет', monthlyGross([], '2025-12-01', '2026-01-31').bars[0].label, 'дек 25');
