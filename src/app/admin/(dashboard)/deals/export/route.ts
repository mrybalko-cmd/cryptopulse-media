import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin/auth';
import {
  fetchDeals, fetchDealRange, dealMoney, totals, monthlyGross,
  placementLabel, SOURCE_LABEL, STATUS_LABEL,
} from '@/lib/admin/deals';
import { buildXlsx, type Cell } from '@/lib/admin/xlsx';
import { resolvePeriod, ru } from '../period';

/**
 * Выгрузка отчёта за период.
 *
 * Строка — размещение, а не сделка. Сделка из трёх размещений даёт три
 * строки, и сумма сделки повторяется в каждой; это сознательно. Отчёт сводят
 * сводной таблицей, а она умеет группировать строки и не умеет разворачивать
 * список, уложенный в одну ячейку. Чтобы повтор не сложился дважды, суммы
 * сделки стоят только в первой строке её блока.
 */

export async function GET(request: NextRequest) {
  // Отдельная проверка вместо requireOwner: тот уводит редиректом, а на
  // скачивание файла редирект в HTML выглядит как молча не сработавшая кнопка.
  const session = await getAdminSession();
  if (!session?.isOwner) {
    return NextResponse.json({ error: 'Только для владельца' }, { status: 403 });
  }

  const sp = Object.fromEntries(request.nextUrl.searchParams);
  const bounds = await fetchDealRange();
  const period = resolvePeriod(sp, bounds);
  const deals = await fetchDeals(period.from, period.to);
  const t = totals(deals);
  const chart = monthlyGross(deals, period.from, period.to);

  const rows: Cell[][] = [
    [
      'Дата', 'Клиент', 'Откуда клиент', 'Партнёр', 'Состояние', 'Оплачено',
      'Счёт', 'Вид размещения', 'Ссылка', 'Пометка', 'Сумма размещения',
      'Валюта', 'Курс к USDT', 'Курс USDT → EUR', 'Сумма сделки', 'Комиссия %',
      'Комиссия', 'Итог сделки', 'Итог сделки, USDT', 'Итог сделки, €', 'Заметки',
    ],
  ];

  for (const d of deals) {
    const m = dealMoney(d);
    d.placements.forEach((p, i) => {
      const first = i === 0;
      rows.push([
        ru(d.dealDate),
        d.client,
        SOURCE_LABEL[d.source] ?? d.source,
        d.partner ?? '',
        STATUS_LABEL[d.status] ?? d.status,
        d.paidAt ? ru(d.paidAt) : '',
        d.invoiceNo ?? '',
        placementLabel(p),
        p.url ?? '',
        p.note ?? '',
        p.amount,
        d.currency,
        d.fxToUsdt,
        d.usdtToEur,
        // Итоги сделки — только в первой её строке, иначе сводная таблица
        // сложит одну сделку столько раз, сколько в ней размещений.
        first ? m.gross : '',
        first ? d.commissionPct : '',
        first ? m.commission : '',
        first ? m.net : '',
        first ? m.netUsdt : '',
        first ? m.netEur : '',
        first ? d.notes ?? '' : '',
      ]);
    });
  }

  rows.push([]);
  rows.push(['Итог за период', period.label, `${ru(period.from)} — ${ru(period.to)}`]);
  rows.push(['Сделок в расчёте', t.deals, 'отменённые не считаются']);
  rows.push(['Размещений', t.placements]);
  rows.push(['Сумма размещений, USDT', t.grossUsdt, `≈ ${t.grossEur} €`]);
  rows.push(['Комиссия партнёрам, USDT', t.commissionUsdt, `≈ ${t.commissionEur} €`]);
  rows.push(['Осталось нам, USDT', t.netUsdt, `≈ ${t.netEur} €`]);
  rows.push(['Счёт выставлен, не оплачен, USDT', t.unpaid.usdt, `счетов: ${t.unpaid.count}`]);
  rows.push([]);
  rows.push(['По видам размещения, USDT']);
  for (const k of t.byKind) rows.push([k.label, k.amountUsdt, k.count]);
  rows.push([]);
  rows.push(['По валютам, без пересчёта']);
  for (const c of t.byCurrency) rows.push([c.currency, c.net, c.deals]);
  rows.push([]);
  rows.push(['Откуда клиент, USDT']);
  for (const s of t.bySource) rows.push([s.label, s.netUsdt, s.deals]);
  rows.push([]);
  rows.push(['Поступления по месяцам, USDT']);
  for (const b of chart.bars) rows.push([b.key, b.grossUsdt, b.deals]);
  rows.push([]);
  rows.push([
    'Отчёт считается в USDT. Евро — вторая валюта, по курсу, записанному ' +
      'в сделке на её дату. USD и USDC приравниваются к USDT.',
  ]);

  const file = buildXlsx(rows, {
    name: 'Размещения',
    widths: [11, 26, 17, 18, 15, 11, 12, 22, 34, 24, 15, 9, 11, 15, 14, 11, 12, 13, 16, 15, 30],
  });

  const name = `razmeshcheniya-${period.from}_${period.to}.xlsx`;
  return new NextResponse(new Uint8Array(file), {
    headers: {
      'content-type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'content-disposition': `attachment; filename="${name}"`,
      'content-length': String(file.length),
      'cache-control': 'no-store',
    },
  });
}
