'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import {
  PLACEMENT_LABEL, SOURCE_LABEL, STATUS_LABEL,
  dealMoney, type Deal, type PlacementKind, type DealCurrency,
} from '@/lib/admin/deals';

/**
 * Форма сделки.
 *
 * Итоги считаются прямо здесь, по мере ввода, тем же `dealMoney`, что и
 * список с выгрузкой. Это не украшение: комиссия в процентах от суммы
 * нескольких размещений — ровно та арифметика, которую легко сделать в уме
 * неправильно, а заметить ошибку через месяц в отчёте.
 */

const FIELD =
  'w-full bg-[var(--admin-input)] border border-[var(--admin-border)] rounded-lg px-3 py-2 text-[13px]';
const LABEL =
  'block text-[10.5px] uppercase tracking-wide text-[var(--admin-text-dim)] mb-1.5 font-bold';

interface Row { key: string; kind: PlacementKind; amount: string; url: string; note: string }

/** Курс по умолчанию — единица для евро: это и есть самый частый случай. */
const DEFAULT_FX: Record<DealCurrency, string> = { EUR: '1', USD: '0.92', USDT: '0.92', USDC: '0.92' };

export default function DealForm({
  deal,
  action,
  deleteAction,
}: {
  deal?: Deal;
  action: (formData: FormData) => void;
  deleteAction?: () => void;
}) {
  const today = new Date().toISOString().slice(0, 10);

  // Ключ строки — счётчик, а не случайное число. Случайное считалось бы прямо
  // в теле компонента, а отрисовка обязана быть повторяемой: при повторном
  // проходе ключи вышли бы другими, и React переставил бы поля вместе с
  // курсором прямо во время набора.
  const nextKey = useRef(0);
  const newRow = (): Row => ({
    key: `new${nextKey.current++}`,
    kind: 'banner', amount: '', url: '', note: '',
  });

  const [rows, setRows] = useState<Row[]>(() =>
    deal?.placements.length
      ? deal.placements.map((p, i) => ({
          key: p._key || `row${i}`,
          kind: p.kind,
          amount: String(p.amount ?? ''),
          url: p.url ?? '',
          note: p.note ?? '',
        }))
      : [{ key: 'row0', kind: 'banner', amount: '', url: '', note: '' }]
  );
  const [source, setSource] = useState(deal?.source ?? 'direct');
  const [status, setStatus] = useState(deal?.status ?? 'invoiced');
  const [currency, setCurrency] = useState<DealCurrency>(deal?.currency ?? 'EUR');
  const [fx, setFx] = useState(String(deal?.fxToEur ?? 1));
  const [commission, setCommission] = useState(String(deal?.commissionPct ?? 0));

  const money = dealMoney({
    placements: rows.map(r => ({ kind: r.kind, amount: Number(r.amount) || 0 })),
    commissionPct: Number(commission) || 0,
    fxToEur: Number(fx) || 1,
  });
  const sign = currency === 'EUR' ? '€' : currency;
  const fmt = (n: number, s = '€') =>
    `${n.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${s}`;

  return (
    <form action={action} className="max-w-[920px]">
      <div className="grid gap-4 sm:grid-cols-2 mb-5">
        <div>
          <label className={LABEL} htmlFor="client">Клиент</label>
          <input id="client" name="client" required defaultValue={deal?.client} className={FIELD}
            placeholder="Как компания подписывает счёт" />
        </div>
        <div>
          <label className={LABEL} htmlFor="dealDate">Дата сделки</label>
          <input id="dealDate" name="dealDate" type="date" required
            defaultValue={deal?.dealDate ?? today} className={FIELD} />
          <p className="text-[11px] text-[var(--admin-text-muted)] mt-1">
            По ней сделка попадает в отчёт за период.
          </p>
        </div>

        <div>
          <label className={LABEL} htmlFor="source">Откуда клиент</label>
          <select id="source" name="source" value={source} className={FIELD}
            onChange={e => setSource(e.target.value as typeof source)}>
            {Object.entries(SOURCE_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
        <div>
          <label className={LABEL} htmlFor="partner">Агентство или агент</label>
          <input id="partner" name="partner" defaultValue={deal?.partner} className={FIELD}
            disabled={source === 'direct'}
            placeholder={source === 'direct' ? 'Не нужно для прямого клиента' : 'Название партнёра'} />
        </div>

        <div>
          <label className={LABEL} htmlFor="status">Состояние</label>
          <select id="status" name="status" value={status} className={FIELD}
            onChange={e => setStatus(e.target.value as typeof status)}>
            {Object.entries(STATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          {status === 'cancelled' && (
            <p className="text-[11px] text-[var(--admin-text-muted)] mt-1">
              Отменённая сделка остаётся в списке, но в деньги не попадает.
            </p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={LABEL} htmlFor="paidAt">Дата оплаты</label>
            <input id="paidAt" name="paidAt" type="date" defaultValue={deal?.paidAt}
              disabled={status !== 'paid'} className={FIELD} />
          </div>
          <div>
            <label className={LABEL} htmlFor="invoiceNo">Номер счёта</label>
            <input id="invoiceNo" name="invoiceNo" defaultValue={deal?.invoiceNo} className={FIELD} />
          </div>
        </div>
      </div>

      {/* ── Размещения ─────────────────────────────────────────── */}
      <h2 className="text-[14px] font-bold mb-2">Размещения</h2>
      <p className="text-[11.5px] text-[var(--admin-text-muted)] mb-3 max-w-[70ch]">
        Одна сделка может покрывать несколько форматов. Сумма сделки складывается
        из строк, поэтому отдельного поля «всего» нет — оно разъехалось бы со
        строками при первой же правке.
      </p>

      <div className="border border-[var(--admin-border)] rounded-xl overflow-hidden mb-3">
        <table className="w-full text-[12.5px] border-collapse">
          <thead>
            <tr className="bg-[var(--admin-input)] text-[10.5px] uppercase tracking-wide text-[var(--admin-text-dim)]">
              <th className="text-left font-bold px-3 py-2.5 w-[190px]">Вид</th>
              <th className="text-left font-bold px-3 py-2.5 w-[120px]">Сумма, {sign}</th>
              <th className="text-left font-bold px-3 py-2.5">Ссылка</th>
              <th className="text-left font-bold px-3 py-2.5">Пометка</th>
              <th className="w-[44px]" />
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.key} className="border-t border-[var(--admin-border)]">
                <td className="px-2 py-2">
                  <select
                    name="kind" value={r.kind} aria-label={`Вид размещения ${i + 1}`}
                    className={FIELD}
                    onChange={e => setRows(v => v.map(x => x.key === r.key ? { ...x, kind: e.target.value as PlacementKind } : x))}
                  >
                    {Object.entries(PLACEMENT_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </td>
                <td className="px-2 py-2">
                  <input
                    name="amount" inputMode="decimal" required value={r.amount}
                    aria-label={`Сумма размещения ${i + 1}`} className={`${FIELD} tabular-nums`}
                    onChange={e => setRows(v => v.map(x => x.key === r.key ? { ...x, amount: e.target.value } : x))}
                  />
                </td>
                <td className="px-2 py-2">
                  <input
                    name="url" type="url" value={r.url} placeholder="https://"
                    aria-label={`Ссылка на размещение ${i + 1}`} className={FIELD}
                    onChange={e => setRows(v => v.map(x => x.key === r.key ? { ...x, url: e.target.value } : x))}
                  />
                </td>
                <td className="px-2 py-2">
                  <input
                    name="note" value={r.note} placeholder="две недели в сайдбаре"
                    aria-label={`Пометка к размещению ${i + 1}`} className={FIELD}
                    onChange={e => setRows(v => v.map(x => x.key === r.key ? { ...x, note: e.target.value } : x))}
                  />
                </td>
                <td className="px-2 py-2 text-center">
                  <button
                    type="button"
                    aria-label={`Убрать размещение ${i + 1}`}
                    disabled={rows.length === 1}
                    onClick={() => setRows(v => v.filter(x => x.key !== r.key))}
                    className="w-7 h-7 rounded-md border border-[var(--admin-border)] text-[var(--admin-text-muted)] disabled:opacity-35"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        type="button"
        onClick={() => setRows(v => [...v, newRow()])}
        className="border border-[var(--admin-border)] text-[12.5px] font-bold rounded-lg px-3.5 py-2 mb-6"
      >
        + Добавить размещение
      </button>

      {/* ── Деньги ─────────────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-3 mb-4">
        <div>
          <label className={LABEL} htmlFor="currency">Валюта</label>
          <select
            id="currency" name="currency" value={currency} className={FIELD}
            onChange={e => {
              const next = e.target.value as DealCurrency;
              setCurrency(next);
              // Курс подставляется только если его ещё не правили руками:
              // перетереть введённое значение сменой валюты было бы обидно.
              if (fx === DEFAULT_FX[currency]) setFx(DEFAULT_FX[next]);
            }}
          >
            <option value="EUR">EUR — евро</option>
            <option value="USD">USD — доллар</option>
            <option value="USDT">USDT</option>
            <option value="USDC">USDC</option>
          </select>
        </div>
        <div>
          <label className={LABEL} htmlFor="fxToEur">Курс к евро на дату сделки</label>
          <input
            id="fxToEur" name="fxToEur" inputMode="decimal" required value={fx}
            className={`${FIELD} tabular-nums`} onChange={e => setFx(e.target.value)}
          />
          <p className="text-[11px] text-[var(--admin-text-muted)] mt-1">
            Сколько евро в одной {currency}. Ставится один раз и не меняется.
          </p>
        </div>
        <div>
          <label className={LABEL} htmlFor="commissionPct">Комиссия партнёру, %</label>
          <input
            id="commissionPct" name="commissionPct" inputMode="decimal" value={commission}
            className={`${FIELD} tabular-nums`} onChange={e => setCommission(e.target.value)}
          />
        </div>
      </div>

      <div className="border border-[var(--admin-border)] rounded-xl p-4 mb-5">
        <h2 className="text-[10.5px] uppercase tracking-wide text-[var(--admin-text-dim)] mb-2 font-bold">
          Считается по ходу ввода
        </h2>
        <dl className="grid gap-x-6 gap-y-1.5 sm:grid-cols-2 text-[13px] m-0">
          <Line k={`Сумма размещений (${rows.length})`} v={fmt(money.gross, sign)} />
          <Line k="Комиссия партнёру" v={fmt(money.commission, sign)} />
          <Line k="Остаётся нам" v={fmt(money.net, sign)} bold />
          <Line k="То же в евро" v={fmt(money.netEur)} bold />
        </dl>
      </div>

      <div className="mb-6">
        <label className={LABEL} htmlFor="notes">Заметки</label>
        <textarea id="notes" name="notes" rows={3} defaultValue={deal?.notes} className={FIELD} />
      </div>

      <div className="flex items-center gap-3">
        <button type="submit" className="bg-cyan-500 text-[#06222b] font-extrabold text-[12.5px] rounded-lg px-5 py-2.5">
          Сохранить
        </button>
        <Link href="/admin/deals" className="text-[12.5px] text-[var(--admin-text-muted)]">Отмена</Link>
        {deleteAction && (
          <button
            type="submit" formAction={deleteAction}
            className="ml-auto text-[12.5px] font-bold text-red-400 border border-red-400/30 rounded-lg px-3.5 py-2"
          >
            Удалить сделку
          </button>
        )}
      </div>
    </form>
  );
}

function Line({ k, v, bold }: { k: string; v: string; bold?: boolean }) {
  return (
    <div className="flex justify-between gap-4 border-t border-[var(--admin-border)] py-1 first:border-t-0 sm:[&:nth-child(2)]:border-t-0">
      <dt className="text-[var(--admin-text-muted)]">{k}</dt>
      <dd className={`m-0 tabular-nums ${bold ? 'font-extrabold' : ''}`}>{v}</dd>
    </div>
  );
}
