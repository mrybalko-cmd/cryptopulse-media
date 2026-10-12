'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import SubmitButton from '../_shared/SubmitButton';
import SavedMark from '../_shared/SavedMark';
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

interface Row { key: string; kind: PlacementKind; custom: string; amount: string; url: string; note: string }

/**
 * Курс к USDT по умолчанию. Для доллара и его токенов — единица: это и есть
 * самый частый случай, а расхождение в доли процента не та точность, за
 * которой стоит ходить в биржу при каждом заведении сделки.
 */
const DEFAULT_FX_USDT: Record<DealCurrency, string> = { USDT: '1', USDC: '1', USD: '1', EUR: '1.09' };

/** Запасной курс USDT → EUR, если биржи не ответили. */
const FALLBACK_USDT_EUR = '0.92';

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
    kind: 'banner', custom: '', amount: '', url: '', note: '',
  });

  const [rows, setRows] = useState<Row[]>(() =>
    deal?.placements.length
      ? deal.placements.map((p, i) => ({
          key: p._key || `row${i}`,
          kind: p.kind,
          custom: p.customKind ?? '',
          amount: String(p.amount ?? ''),
          url: p.url ?? '',
          note: p.note ?? '',
        }))
      : [{ key: 'row0', kind: 'banner', custom: '', amount: '', url: '', note: '' }]
  );
  const [source, setSource] = useState(deal?.source ?? 'direct');
  const [status, setStatus] = useState(deal?.status ?? 'invoiced');
  const [currency, setCurrency] = useState<DealCurrency>(deal?.currency ?? 'USDT');
  const [fxUsdt, setFxUsdt] = useState(String(deal?.fxToUsdt ?? 1));
  const [usdtEur, setUsdtEur] = useState(
    String(deal?.usdtToEur ?? FALLBACK_USDT_EUR)
  );
  const [rateSource, setRateSource] = useState<'live' | 'fallback' | 'loading'>(
    deal ? 'live' : 'loading'
  );
  const [commission, setCommission] = useState(String(deal?.commissionPct ?? 0));

  // Курс USDT → EUR у новой сделки подставляется один раз, при открытии
  // формы, и дальше живёт в документе. Берётся медиана наших же P2P-курсов
  // продажи USDT за евро — та цифра, по которой деньги и выводятся. Медиана,
  // а не первая строка: одна биржа с задранным объявлением не должна
  // определять курс всей сделки.
  useEffect(() => {
    if (deal) return;
    let alive = true;
    fetch('/api/rates/eur')
      .then(r => (r.ok ? r.json() : null))
      .then((data: { rates?: { rate: number }[] } | null) => {
        if (!alive) return;
        const nums = (data?.rates ?? []).map(r => Number(r.rate)).filter(n => n > 0).sort((a, b) => a - b);
        if (!nums.length) { setRateSource('fallback'); return; }
        const mid = nums.length % 2
          ? nums[(nums.length - 1) / 2]
          : (nums[nums.length / 2 - 1] + nums[nums.length / 2]) / 2;
        setUsdtEur(mid.toFixed(4).replace(/0+$/, '').replace(/\.$/, ''));
        setRateSource('live');
      })
      .catch(() => { if (alive) setRateSource('fallback'); });
    return () => { alive = false; };
  }, [deal]);

  const money = dealMoney({
    placements: rows.map(r => ({ kind: r.kind, amount: Number(r.amount) || 0 })),
    commissionPct: Number(commission) || 0,
    fxToUsdt: Number(fxUsdt) || 1,
    usdtToEur: Number(usdtEur) || 0,
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
        строками при первой же правке. «Своё название» заполняется, когда услуги
        нет в списке: оно показывается вместо вида и становится отдельной строкой
        в разрезе по видам размещения.
      </p>

      <div className="border border-[var(--admin-border)] rounded-xl overflow-hidden mb-3">
        <table className="w-full text-[12.5px] border-collapse">
          <thead>
            <tr className="bg-[var(--admin-input)] text-[10.5px] uppercase tracking-wide text-[var(--admin-text-dim)]">
              <th className="text-left font-bold px-3 py-2.5 w-[170px]">Вид</th>
              <th className="text-left font-bold px-3 py-2.5 w-[180px]">Своё название</th>
              <th className="text-left font-bold px-3 py-2.5 w-[110px]">Сумма, {sign}</th>
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
                    name="customKind" value={r.custom} maxLength={60}
                    placeholder="если услуги нет в списке"
                    aria-label={`Своё название услуги ${i + 1}`} className={FIELD}
                    onChange={e => setRows(v => v.map(x => x.key === r.key ? { ...x, custom: e.target.value } : x))}
                  />
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
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-4">
        <div>
          <label className={LABEL} htmlFor="currency">Валюта</label>
          <select
            id="currency" name="currency" value={currency} className={FIELD}
            onChange={e => {
              const next = e.target.value as DealCurrency;
              setCurrency(next);
              // Курс подставляется только если его ещё не правили руками:
              // перетереть введённое значение сменой валюты было бы обидно.
              if (fxUsdt === DEFAULT_FX_USDT[currency]) setFxUsdt(DEFAULT_FX_USDT[next]);
            }}
          >
            <option value="USDT">USDT</option>
            <option value="USDC">USDC</option>
            <option value="USD">USD — доллар</option>
            <option value="EUR">EUR — евро</option>
          </select>
        </div>
        <div>
          <label className={LABEL} htmlFor="fxToUsdt">Курс к USDT</label>
          <input
            id="fxToUsdt" name="fxToUsdt" inputMode="decimal" required value={fxUsdt}
            className={`${FIELD} tabular-nums`} onChange={e => setFxUsdt(e.target.value)}
          />
          <p className="text-[11px] text-[var(--admin-text-muted)] mt-1">
            {currency === 'EUR'
              ? 'Сколько USDT в одном евро.'
              : `Сколько USDT в одном ${currency} — единица.`}
          </p>
        </div>
        <div>
          <label className={LABEL} htmlFor="usdtToEur">Курс USDT → EUR</label>
          <input
            id="usdtToEur" name="usdtToEur" inputMode="decimal" required value={usdtEur}
            className={`${FIELD} tabular-nums ${rateSource === 'live' && !deal ? 'border-cyan-500/40' : ''}`}
            onChange={e => { setUsdtEur(e.target.value); setRateSource('live'); }}
          />
          <p className="text-[11px] text-[var(--admin-text-muted)] mt-1">
            {deal
              ? 'Заморожен датой сделки. Меняйте только если курс записан неверно.'
              : rateSource === 'loading'
                ? 'Спрашиваем курс продажи USDT за евро…'
                : rateSource === 'live'
                  ? 'Подставлен по курсу продажи USDT за евро. Нужен только для справочной цифры.'
                  : 'Биржи не ответили — стоит запасной курс, проверьте его.'}
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
        <h2 className="text-[10.5px] uppercase tracking-wide text-[var(--admin-text-dim)] mb-2.5 font-bold">
          Считается по ходу ввода
        </h2>
        <div className="flex flex-wrap items-end gap-x-8 gap-y-3">
          <div>
            <div className="text-[10.5px] uppercase tracking-wide text-[var(--admin-text-dim)] font-bold">
              Остаётся нам
            </div>
            <div className="text-[25px] font-black tabular-nums tracking-tight leading-tight">
              {money.netUsdt.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              <span className="text-[12.5px] font-extrabold text-[var(--admin-text-muted)] ml-1">USDT</span>
            </div>
          </div>
          <dl className="grid gap-x-6 gap-y-1.5 sm:grid-cols-2 text-[13px] m-0 flex-1 min-w-[260px]">
            <Line k={`Сумма размещений (${rows.length})`} v={fmt(money.gross, sign)} />
            <Line k="Комиссия партнёру" v={fmt(money.commission, sign)} />
            {currency !== 'USDT' && <Line k={`Остаётся в ${sign}`} v={fmt(money.net, sign)} />}
            <Line k="То же в евро" v={fmt(money.netEur)} bold />
          </dl>
        </div>
      </div>

      <div className="mb-6">
        <label className={LABEL} htmlFor="notes">Заметки</label>
        <textarea id="notes" name="notes" rows={3} defaultValue={deal?.notes} className={FIELD} />
      </div>

      <div className="flex items-center gap-3">
        <SubmitButton className="bg-cyan-500 text-[#06222b] font-extrabold text-[12.5px] rounded-lg px-5 py-2.5">
          Сохранить
        </SubmitButton>
        <SavedMark />
        <Link href="/admin/deals" className="text-[12.5px] text-[var(--admin-text-muted)]">Отмена</Link>
        {deleteAction && (
          // Подтверждение с именем клиента и суммой: восстановить сделку
          // неоткуда, а кнопка стоит в одном ряду с «Сохранить».
          <button
            type="submit" formAction={deleteAction}
            onClick={e => {
              const ok = confirm(
                `Удалить сделку «${deal?.client ?? ''}» на ${fmt(money.netUsdt, 'USDT')} ` +
                'безвозвратно? Это действие нельзя отменить.'
              );
              if (!ok) e.preventDefault();
            }}
            className="ml-auto text-[12.5px] font-bold text-red-400 border border-red-400/30 rounded-lg px-3.5 py-2 hover:bg-red-500/10 hover:border-red-500/50 transition-colors"
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
