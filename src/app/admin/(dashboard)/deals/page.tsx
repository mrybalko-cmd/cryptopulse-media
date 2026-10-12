import Link from 'next/link';
import { requireOwner } from '@/lib/admin/auth';
import {
  fetchDeals, fetchDealRange, dealMoney, totals, monthlyGross,
  placementLabel, SOURCE_LABEL, STATUS_LABEL,
} from '@/lib/admin/deals';
import { PRESETS, resolvePeriod, ru } from './period';
import { deleteDealAction } from './actions';
import { DeleteSubmitButton } from '../_shared/DeleteButton';
import DealsChart from './DealsChart';

/**
 * Учёт коммерческих размещений.
 *
 * Раздел закрыт правом владельца, а не отдельным правом в списке: добавить
 * сюда ключ означало бы показать его в форме прав сотрудника и предложить
 * выдать. Выручка не делится по сотрудникам.
 */

/**
 * Базовая валюта раздела — USDT: в ней приходит оплата и в ней считается
 * отчёт. Евро идёт второй строкой, справочно, по курсу из самой сделки.
 *
 * Неразрывный пробел перед валютой — намеренно: иначе «274,00» и «USDT»
 * разъезжаются по строкам в узкой клетке таблицы.
 */
const money = (n: number, cur = 'USDT') =>
  `${n.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${cur}`.trim();
const eur = (n: number) => money(n, '€');

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
  const chart = monthlyGross(deals, period.from, period.to);

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

      {/* Раздел закрыт правом владельца, не индексируется и не кэшируется —
          написано на экране, чтобы при показе чужому человеку было видно,
          что страницу открывать не стоит. */}
      <div className="flex items-center gap-2 flex-wrap mb-[18px] px-2.5 py-2 rounded-lg border border-amber-500/25 bg-amber-500/[0.07] text-[11px] text-amber-300/90">
        <span className="font-extrabold text-amber-200">🔒 Коммерческая тайна.</span>
        <span className="text-amber-200/55">
          не индексируется и не попадает в архивы поисковиков · не кэшируется ·
          скрыто в Sanity Studio · доступ только у владельца
        </span>
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

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-4">
          <Tile label="Сумма размещений" value={t.grossUsdt} sub={`≈ ${eur(t.grossEur)} · по курсу сделок`} />
          <Tile label="Комиссия партнёрам" value={t.commissionUsdt} sub={`≈ ${eur(t.commissionEur)}`} dim />
          <Tile label="Осталось нам" value={t.netUsdt} sub={`≈ ${eur(t.netEur)}`} accent />
          <Tile
            label="Счёт выставлен, не оплачен"
            value={t.unpaid.usdt}
            sub={t.unpaid.count === 0 ? 'счетов: 0 · всё закрыто' : `счетов: ${t.unpaid.count} · ≈ ${eur(t.unpaid.eur)}`}
            warn
          />
        </div>

        {t.deals > 0 && <DealsChart bars={chart.bars} trimmed={chart.trimmed} />}

        {t.deals > 0 && (
          <div className="grid gap-4 md:grid-cols-3 text-[12px] mt-[18px]">
            <Breakdown
              title="По валютам, без пересчёта"
              rows={t.byCurrency.map(c => ({
                k: c.currency,
                v: money(c.net, c.currency === 'EUR' ? '€' : c.currency),
                n: c.deals,
              }))}
            />
            <Breakdown
              title="По видам размещения, USDT"
              rows={t.byKind.map(k => ({ k: k.label, v: money(k.amountUsdt, ''), n: k.count }))}
            />
            <Breakdown
              title="Откуда клиент, USDT"
              rows={t.bySource.map(s => ({ k: s.label, v: money(s.netUsdt, ''), n: s.deals }))}
            />
          </div>
        )}

        <p className="text-[11px] text-[var(--admin-text-muted)] mt-4 leading-relaxed max-w-[76ch]">
          Заглавная валюта отчёта — USDT. Евро считается вторым курсом,
          записанным в сделку на её дату, поэтому закрытый месяц не меняется
          задним числом. USD и USDC приравниваются к USDT: это допущение, на
          бирже они ходят с отклонением в доли процента.
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
                <th className="text-right font-bold px-3 py-2.5">Итог, USDT</th>
                <th className="text-left font-bold px-3 py-2.5">Состояние</th>
                <th className="w-[52px]" />
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
                      {money(m.netUsdt, '')}
                      <span className="block text-[10.5px] font-normal text-[var(--admin-text-dim)]">
                        ≈ {eur(m.netEur)}
                      </span>
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
                    {/* Удаление прямо из списка: сорвавшуюся сделку чаще всего
                        видно именно здесь, а не внутри её карточки. */}
                    <td className="px-3 py-2.5 text-right">
                      <form action={deleteDealAction.bind(null, d._id)}>
                        <DeleteSubmitButton
                          compact
                          confirmMessage={
                            `Удалить сделку «${d.client}» на ${money(m.netUsdt)} безвозвратно? ` +
                            'Это действие нельзя отменить.'
                          }
                        />
                      </form>
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

/**
 * Плитка сводки: цифра в USDT крупно, евро мелким под ней.
 *
 * Валюта вынесена в отдельный `<span>` меньшим кеглем, а не в строку с
 * числом: иначе четыре плитки в ряд читаются как четыре разных числа длиной
 * в текст, и глаз перестаёт их сравнивать.
 */
function Tile({
  label, value, sub, accent, dim, warn,
}: {
  label: string; value: number; sub: string;
  accent?: boolean; dim?: boolean; warn?: boolean;
}) {
  const frame = accent
    ? 'border-green-500/40 bg-green-500/[0.09]'
    : warn
      ? 'border-amber-500/35 bg-amber-500/[0.07]'
      : 'border-[var(--admin-border)] bg-[var(--admin-bg-alt)]';
  const num = accent ? 'text-green-400' : warn ? 'text-amber-300' : dim ? 'text-[var(--admin-text-muted)]' : '';
  return (
    <div className={`rounded-xl px-3.5 py-3 border ${frame}`}>
      <div className="text-[10.5px] uppercase tracking-wide text-[var(--admin-text-dim)] font-bold">{label}</div>
      <div className={`text-[22px] font-black tabular-nums mt-1 -tracking-[0.01em] ${num}`}>
        {value.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        <span className="text-[12px] font-extrabold text-[var(--admin-text-muted)] ml-1 tracking-normal">USDT</span>
      </div>
      <div className="text-[11px] text-[var(--admin-text-muted)] tabular-nums mt-0.5">{sub}</div>
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
