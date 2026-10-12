import Link from 'next/link';
import { requireOwner } from '@/lib/admin/auth';
import {
  fetchDeals, fetchDealRange, dealMoney, totals,
  placementLabel, SOURCE_LABEL, STATUS_LABEL,
} from '@/lib/admin/deals';
import { PRESETS, resolvePeriod, ru } from './period';

/**
 * Учёт коммерческих размещений.
 *
 * Раздел закрыт правом владельца, а не отдельным правом в списке: добавить
 * сюда ключ означало бы показать его в форме прав сотрудника и предложить
 * выдать. Выручка не делится по сотрудникам.
 */

const money = (n: number, cur = '€') =>
  `${n.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${cur}`;

const STATUS_COLOR: Record<string, string> = {
  planned: 'var(--admin-text-dim)',
  invoiced: '#f2a93b',
  paid: '#22c55e',
  cancelled: '#ef4444',
};

export default async function DealsPage({
  searchParams,
}: {
  searchParams: Promise<{ preset?: string; from?: string; to?: string }>;
}) {
  await requireOwner();
  const [sp, bounds] = await Promise.all([searchParams, fetchDealRange()]);
  const period = resolvePeriod(sp, bounds);
  const deals = await fetchDeals(period.from, period.to);
  const t = totals(deals);

  const query = new URLSearchParams(
    period.preset === 'custom'
      ? { preset: 'custom', from: period.from, to: period.to }
      : { preset: period.preset }
  ).toString();

  const cancelled = deals.length - t.deals;

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-5 flex-wrap">
        <div>
          <h1 className="text-[19px] font-bold">Коммерческие размещения</h1>
          <p className="text-[11.5px] text-[var(--admin-text-muted)] mt-1">
            Виден только вам. Сотрудникам раздел не показывается и прав на него нет.
          </p>
        </div>
        <div className="flex gap-2">
          <a
            href={`/admin/deals/export?${query}`}
            className="border border-[var(--admin-border)] text-[12.5px] font-bold rounded-lg px-4 py-2.5"
          >
            ⤓ Выгрузить в Excel
          </a>
          <Link
            href="/admin/deals/new"
            className="bg-cyan-500 text-[#06222b] font-extrabold text-[12.5px] rounded-lg px-4 py-2.5"
          >
            + Добавить сделку
          </Link>
        </div>
      </div>

      {/* ── Период ─────────────────────────────────────────────── */}
      <div className="flex gap-1.5 mb-3 flex-wrap">
        {PRESETS.map(p => (
          <Link
            key={p.key}
            href={`/admin/deals?preset=${p.key}`}
            className={`text-[11.5px] font-bold px-3 py-1.5 rounded-full border ${
              period.preset === p.key
                ? 'bg-cyan-500/15 text-cyan-400 border-transparent'
                : 'border-[var(--admin-border)] text-[var(--admin-text-muted)]'
            }`}
          >
            {p.label}
          </Link>
        ))}
      </div>

      <form
        method="get"
        action="/admin/deals"
        className="flex items-end gap-2 mb-5 flex-wrap text-[12px]"
      >
        <input type="hidden" name="preset" value="custom" />
        <label className="flex flex-col gap-1">
          <span className="text-[10.5px] uppercase tracking-wide text-[var(--admin-text-dim)]">С какого</span>
          <input
            type="date" name="from" defaultValue={period.from}
            className="bg-[var(--admin-input)] border border-[var(--admin-border)] rounded-lg px-2.5 py-1.5"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-[10.5px] uppercase tracking-wide text-[var(--admin-text-dim)]">По какое</span>
          <input
            type="date" name="to" defaultValue={period.to}
            className="bg-[var(--admin-input)] border border-[var(--admin-border)] rounded-lg px-2.5 py-1.5"
          />
        </label>
        <button
          type="submit"
          className="border border-[var(--admin-border)] font-bold rounded-lg px-3.5 py-1.5"
        >
          Показать
        </button>
        <span className="text-[11.5px] text-[var(--admin-text-muted)] pb-1.5">
          Обе границы входят в отчёт
        </span>
      </form>

      {/* ── Калькулятор ────────────────────────────────────────── */}
      <section className="border border-[var(--admin-border)] rounded-xl p-4 mb-5">
        <div className="flex items-baseline justify-between gap-3 mb-3 flex-wrap">
          <h2 className="text-[14px] font-bold">Итог за период: {period.label}</h2>
          <span className="text-[11.5px] text-[var(--admin-text-muted)] tabular-nums">
            {ru(period.from)} — {ru(period.to)} · сделок {t.deals}
            {cancelled > 0 && ` · отменено ${cancelled}, в расчёт не входят`}
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 mb-4">
          <Tile label="Сумма размещений" value={money(t.grossEur)} />
          <Tile label="Комиссия партнёрам" value={money(t.commissionEur)} dim />
          <Tile label="Осталось нам" value={money(t.netEur)} accent />
        </div>

        {t.deals > 0 && (
          <div className="grid gap-4 md:grid-cols-3 text-[12px]">
            <Breakdown
              title="По валютам, без пересчёта"
              rows={t.byCurrency.map(c => ({
                k: c.currency,
                v: money(c.net, c.currency === 'EUR' ? '€' : c.currency),
                n: c.deals,
              }))}
            />
            <Breakdown
              title="По видам размещения, €"
              rows={t.byKind.map(k => ({ k: k.label, v: money(k.amountEur), n: k.count }))}
            />
            <Breakdown
              title="Откуда клиент, €"
              rows={t.bySource.map(s => ({ k: s.label, v: money(s.netEur), n: s.deals }))}
            />
          </div>
        )}

        <p className="text-[11px] text-[var(--admin-text-muted)] mt-4 leading-relaxed max-w-[76ch]">
          Пересчёт в евро идёт по курсу, записанному в сделке на её дату, —
          поэтому закрытый месяц не меняется задним числом. USDT и USDC считаются
          как доллар: это допущение, на бирже они ходят с отклонением в доли
          процента.
        </p>
      </section>

      {/* ── Список ─────────────────────────────────────────────── */}
      {deals.length === 0 ? (
        <p className="text-[13px] text-[var(--admin-text-muted)]">
          За этот период сделок нет. Выберите другой период или добавьте сделку.
        </p>
      ) : (
        <div className="border border-[var(--admin-border)] rounded-xl overflow-hidden">
          <table className="w-full text-[12.5px] border-collapse">
            <thead>
              <tr className="bg-[var(--admin-input)] text-[10.5px] uppercase tracking-wide text-[var(--admin-text-dim)]">
                <th className="text-left font-bold px-3 py-2.5">Дата</th>
                <th className="text-left font-bold px-3 py-2.5">Клиент</th>
                <th className="text-left font-bold px-3 py-2.5">Размещения</th>
                <th className="text-right font-bold px-3 py-2.5">Сумма</th>
                <th className="text-right font-bold px-3 py-2.5">Комиссия</th>
                <th className="text-right font-bold px-3 py-2.5">Итог, €</th>
                <th className="text-left font-bold px-3 py-2.5">Состояние</th>
              </tr>
            </thead>
            <tbody>
              {deals.map(d => {
                const m = dealMoney(d);
                const sign = d.currency === 'EUR' ? '€' : d.currency;
                return (
                  <tr key={d._id} className="border-t border-[var(--admin-border)] align-top">
                    <td className="px-3 py-2.5 tabular-nums whitespace-nowrap">{ru(d.dealDate)}</td>
                    <td className="px-3 py-2.5">
                      <Link href={`/admin/deals/${d._id}`} className="font-bold hover:text-cyan-400">
                        {d.client}
                      </Link>
                      <div className="text-[11px] text-[var(--admin-text-muted)]">
                        {SOURCE_LABEL[d.source]}
                        {d.partner ? ` · ${d.partner}` : ''}
                        {d.invoiceNo ? ` · счёт ${d.invoiceNo}` : ''}
                      </div>
                    </td>
                    <td className="px-3 py-2.5">
                      <ul className="m-0 p-0 list-none space-y-0.5">
                        {d.placements.map((p, i) => (
                          <li key={p._key ?? i} className="text-[11.5px]">
                            {p.url ? (
                              <a href={p.url} target="_blank" rel="noopener" className="hover:text-cyan-400 underline decoration-dotted">
                                {placementLabel(p)}
                              </a>
                            ) : (
                              placementLabel(p)
                            )}
                            <span className="text-[var(--admin-text-muted)] tabular-nums">
                              {' · '}{p.amount.toLocaleString('ru-RU')} {sign}
                            </span>
                            {p.note && <span className="text-[var(--admin-text-dim)]"> · {p.note}</span>}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-3 py-2.5 text-right tabular-nums whitespace-nowrap">{money(m.gross, sign)}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums whitespace-nowrap text-[var(--admin-text-muted)]">
                      {d.commissionPct > 0 ? `${money(m.commission, sign)} · ${d.commissionPct}%` : '—'}
                    </td>
                    <td className="px-3 py-2.5 text-right tabular-nums whitespace-nowrap font-bold">
                      {money(m.netEur)}
                    </td>
                    <td className="px-3 py-2.5 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold">
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ background: STATUS_COLOR[d.status] ?? 'var(--admin-text-dim)' }}
                        />
                        {STATUS_LABEL[d.status] ?? d.status}
                      </span>
                      {d.status === 'paid' && d.paidAt && (
                        <div className="text-[10.5px] text-[var(--admin-text-dim)] tabular-nums">{ru(d.paidAt)}</div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Tile({ label, value, accent, dim }: { label: string; value: string; accent?: boolean; dim?: boolean }) {
  return (
    <div className={`rounded-lg px-3.5 py-3 border ${accent ? 'border-cyan-500/40 bg-cyan-500/10' : 'border-[var(--admin-border)]'}`}>
      <div className="text-[10.5px] uppercase tracking-wide text-[var(--admin-text-dim)]">{label}</div>
      <div className={`text-[20px] font-extrabold tabular-nums mt-0.5 ${dim ? 'text-[var(--admin-text-muted)]' : ''}`}>
        {value}
      </div>
    </div>
  );
}

function Breakdown({ title, rows }: { title: string; rows: { k: string; v: string; n: number }[] }) {
  return (
    <div>
      <h3 className="text-[10.5px] uppercase tracking-wide text-[var(--admin-text-dim)] mb-1.5">{title}</h3>
      <ul className="m-0 p-0 list-none">
        {rows.map(r => (
          <li key={r.k} className="flex justify-between gap-3 py-1 border-t border-[var(--admin-border)] first:border-t-0">
            <span className="min-w-0 truncate">{r.k}</span>
            <span className="tabular-nums whitespace-nowrap">
              {r.v} <span className="text-[var(--admin-text-dim)]">· {r.n}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
