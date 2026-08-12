'use client';

import { useEffect, useMemo, useState } from 'react';
import type { CoinHistoryPoint, DcaRun } from '@/lib/coinMarket';
import { simulateDca, startOptions as startOptionsFrom } from '@/lib/coinMarket';
import type { InvestmentReference } from '@/lib/coinGuides';

const AMOUNTS_ONCE = [100, 500, 1000, 2000, 5000];
const AMOUNTS_MONTHLY = [50, 100, 250, 500, 1000];

/** Genitive forms — «6 февраля», not «6 февраль». */
const RU_MONTHS_GEN = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];

export default function CoinInvestmentCalculator({
  locale,
  symbol,
  name,
  color,
  price,
  ath,
  athChangePct,
  reference,
  slug,
}: {
  locale: string;
  symbol: string;
  name: string;
  color: string;
  price: number | null;
  ath: number;
  athChangePct: number;
  /** Curated one-off entry points (2011, 2016, 2021 …) — the only way to reach
   *  further back than a year, since the free price feed stops at 365 days. */
  reference: InvestmentReference[];
  slug: string;
}) {
  const isRu = locale === 'ru';
  const [mode, setMode] = useState<'once' | 'monthly'>('once');
  // Loaded after paint rather than at build time: twenty-four history requests
  // in a burst met the rate limit and, with a retry, failed the deployment.
  // Both the chart and this mode sit below the fold, so nothing waits on it.
  const [history, setHistory] = useState<CoinHistoryPoint[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    let alive = true;
    fetch(`/api/coin-history?slug=${encodeURIComponent(slug)}`)
      .then((r) => r.json())
      .then((d) => { if (alive) setHistory(Array.isArray(d?.history) ? d.history : []); })
      .catch(() => {})
      .finally(() => { if (alive) setLoadingHistory(false); });
    return () => { alive = false; };
  }, [slug]);

  const startOptions = useMemo(() => startOptionsFrom(history), [history]);
  const [amountOnce, setAmountOnce] = useState(1000);
  const [amountMonthly, setAmountMonthly] = useState(100);
  const [startIdx, setStartIdx] = useState(0);

  const dca: DcaRun | null = useMemo(
    () => (mode === 'monthly' && startOptions.length ? simulateDca(history, startOptions[startIdx] ?? startOptions[0], amountMonthly) : null),
    [mode, history, startOptions, startIdx, amountMonthly]
  );

  const money = (n: number) =>
    n >= 1e6
      ? `$${(n / 1e6).toFixed(2)}${isRu ? ' млн' : 'M'}`
      : n >= 1000
        ? `$${Math.round(n).toLocaleString(isRu ? 'ru-RU' : 'en-US')}`
        : `$${n < 1 ? n.toFixed(4) : n.toFixed(2)}`;

  const dateLabel = (d: string) => {
    const [y, m, dd] = d.split('-');
    return isRu
      ? `${+dd} ${RU_MONTHS_GEN[+m - 1]} ${y}`
      : new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${d}T00:00:00Z`));
  };

  // Intl gives «авг. 2025 г.» in Russian — correct but heavy for a button.
  const RU_MONTHS = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
  const monthLabel = (d: string) => {
    const [y, m] = d.split('-');
    return isRu
      ? `${RU_MONTHS[+m - 1]} ${y}`
      : new Intl.DateTimeFormat('en-GB', { month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${d}T00:00:00Z`));
  };

  const plural = (n: number, one: string, few: string, many: string) => {
    if (!isRu) return `${n} ${n === 1 ? one : many}`;
    const m10 = n % 10, m100 = n % 100;
    return `${n} ${m10 === 1 && m100 !== 11 ? one : m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14) ? few : many}`;
  };

  const pct = (v: number) => `${v > 0 ? '+' : v < 0 ? '−' : ''}${Math.abs(v).toFixed(1).replace('.', isRu ? ',' : '.')}%`;

  return (
    <section className="glass-panel" style={{ ['--coin' as string]: color }}>
      {history.length > 2 && (
        <YearChart history={history} color={color} isRu={isRu} money={money} />
      )}

      <h2 className="text-[19px] sm:text-xl font-extrabold tracking-tight text-foreground">
        {isRu ? `Сколько бы вы заработали на ${name}` : `What you would have made on ${name}`}
      </h2>
      <p className="text-[12.5px] text-muted mt-1 mb-4 leading-relaxed">
        {isRu ? 'Выберите сумму и способ. Текущая цена ' : 'Pick an amount and a method. Current price '}
        <b className="text-foreground">{price ? money(price) : '…'}</b>.
      </p>

      <div className="inline-flex gap-1 p-1 rounded-full border border-[var(--glass-line)] bg-[color-mix(in_srgb,var(--foreground)_4%,transparent)] mb-4">
        {(['once', 'monthly'] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className="text-[12.5px] font-extrabold px-4 py-1.5 rounded-full transition-colors"
            style={mode === m
              ? { background: color, color: '#fff', boxShadow: `0 4px 14px color-mix(in srgb, ${color} 45%, transparent)` }
              : { color: 'var(--muted)' }}
          >
            {m === 'once' ? (isRu ? 'Купить разом' : 'Buy once') : (isRu ? 'Каждый месяц' : 'Every month')}
          </button>
        ))}
      </div>

      <Label>{mode === 'once' ? (isRu ? 'Сумма покупки' : 'Purchase amount') : (isRu ? 'Сумма в месяц' : 'Amount per month')}</Label>
      <div className="flex flex-wrap gap-[7px] mb-4">
        {(mode === 'once' ? AMOUNTS_ONCE : AMOUNTS_MONTHLY).map((a) => {
          const on = a === (mode === 'once' ? amountOnce : amountMonthly);
          return (
            <button
              key={a}
              onClick={() => (mode === 'once' ? setAmountOnce(a) : setAmountMonthly(a))}
              className="rounded-[11px] px-3 py-[7px] text-[13px] font-bold border transition-colors"
              style={on
                ? { borderColor: color, color: 'var(--foreground)', background: `color-mix(in srgb, ${color} 16%, transparent)` }
                : { borderColor: 'var(--glass-line)', color: 'var(--muted)' }}
            >
              ${a.toLocaleString(isRu ? 'ru-RU' : 'en-US')}
            </button>
          );
        })}
      </div>

      {mode === 'monthly' && startOptions.length > 0 && (
        <>
          <Label>{isRu ? 'Когда начать откладывать' : 'When to start'}</Label>
          <div className="flex flex-wrap gap-[7px]">
            {startOptions.map((d, i) => {
              const on = i === startIdx;
              return (
                <button
                  key={d}
                  onClick={() => setStartIdx(i)}
                  title={i === 0 ? (isRu ? 'Самая ранняя доступная дата' : 'Earliest date available') : undefined}
                  className="rounded-[11px] px-3 py-[7px] text-[12.5px] font-bold border transition-colors flex items-center gap-[7px]"
                  style={on
                    ? { borderColor: color, color: 'var(--foreground)', background: `color-mix(in srgb, ${color} 16%, transparent)` }
                    : { borderColor: 'var(--glass-line)', color: 'var(--muted)' }}
                >
                  {i === 0 && <span className="w-[5px] h-[5px] rounded-full shrink-0" style={{ background: color }} />}
                  {monthLabel(d)}
                </button>
              );
            })}
          </div>
          <p className="text-[11px] text-muted leading-relaxed mt-2 mb-4 pl-3 border-l-2" style={{ borderColor: `color-mix(in srgb, ${color} 45%, transparent)` }}>
            {isRu
              ? `Раньше ${monthLabel(startOptions[0])} расчёт не уходит: бесплатный доступ к истории цен даёт ровно 365 дней, на 366-й день источник отвечает отказом. Достраивать недостающие цены мы не станем — лучше короткий честный период, чем длинный придуманный.`
              : `The calculation cannot reach further back than ${monthLabel(startOptions[0])}: free access to price history covers exactly 365 days and the source refuses the 366th. We will not fill the gap with invented prices — a short honest window beats a long imagined one.`}
          </p>
        </>
      )}

      {mode === 'once' ? (
        <OnceResult
          amount={amountOnce} price={price} reference={reference} symbol={symbol} color={color}
          isRu={isRu} money={money}
          ath={ath} athChangePct={athChangePct} name={name}
        />
      ) : (
        <MonthlyResult
          run={dca} amount={amountMonthly} color={color} isRu={isRu} loading={loadingHistory}
          money={money} pct={pct} dateLabel={dateLabel} plural={plural}
        />
      )}

      <p className="text-[11px] text-muted leading-relaxed mt-3">
        {mode === 'once'
          ? isRu
            ? 'Опорные цены — среднее за июль соответствующего года по данным CoinMarketCap, текущая цена от CoinGecko. Расчёт приблизительный.'
            : 'Reference prices are the July average of the year in question (CoinMarketCap); the current price comes from CoinGecko. The calculation is approximate.'
          : isRu
            ? 'Расчёт по дневным ценам CoinGecko: покупка в первый доступный день каждого месяца. Комиссии бирж не учитываются.'
            : 'Calculated from CoinGecko daily closes: one purchase on the first available day of each month. Exchange fees are not included.'}
        {isRu
          ? ' Прошлая доходность ничего не говорит о будущей. Не является инвестиционной рекомендацией.'
          : ' Past performance says nothing about the future. This is not investment advice.'}
      </p>
    </section>
  );
}

/** Twelve months of closes. The coin pages carried no chart at all before this. */
function YearChart({ history, color, isRu, money }: { history: CoinHistoryPoint[]; color: string; isRu: boolean; money: (n: number) => string }) {
  const step = Math.max(1, Math.ceil(history.length / 90));
  const pts = history.filter((_, i) => i % step === 0);
  if (pts.length < 3) return null;
  const W = 600, H = 100, PAD = 4;
  const lo = Math.min(...pts.map((p) => p.price));
  const hi = Math.max(...pts.map((p) => p.price));
  // The label uses the true minimum of the full series, not of the sampled
  // points — sampling skips days and quoted a different low than the page did.
  const trueLow = Math.min(...history.map((p) => p.price));
  const span = hi - lo || 1;
  const x = (i: number) => (i / (pts.length - 1)) * W;
  const y = (v: number) => H - PAD - ((v - lo) / span) * (H - PAD * 2);
  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(p.price).toFixed(1)}`).join(' ');
  const id = `yc-${color.replace('#', '')}`;

  return (
    <div className="mb-5">
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="block w-full h-[92px] sm:h-[120px]"
        role="img" aria-label={isRu ? 'График цены за 12 месяцев' : 'Price chart over 12 months'}>
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.35" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={`${line} L${W},${H} L0,${H} Z`} fill={`url(#${id})`} />
        <path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        <circle cx={W} cy={y(pts[pts.length - 1].price)} r="4" fill={color} />
      </svg>
      <div className="flex justify-between text-[10px] text-muted mt-1.5">
        <span>{isRu ? '12 месяцев назад' : '12 months ago'}</span>
        <span>{isRu ? 'минимум года' : 'year low'} {money(trueLow)}</span>
        <span>{isRu ? 'сегодня' : 'today'}</span>
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-[10px] font-extrabold uppercase tracking-[0.08em] text-muted mb-2">{children}</p>;
}

function OnceResult({
  amount, price, reference, symbol, color, isRu, money, ath, athChangePct, name,
}: {
  amount: number; price: number | null; reference: InvestmentReference[]; symbol: string; color: string;
  isRu: boolean; money: (n: number) => string;
  ath: number; athChangePct: number; name: string;
}) {
  const first = reference[0];
  const coins = first && amount > 0 ? amount / first.price : 0;
  const value = price ? coins * price : null;
  const multiple = value && amount ? value / amount : null;
  const loc = isRu ? 'ru' : 'en';

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-[1.15fr_1fr] gap-3.5">
        <div
          className="rounded-2xl border border-[var(--glass-line)] p-4 sm:p-[18px]"
          style={{ background: `linear-gradient(150deg, color-mix(in srgb, ${color} 18%, transparent), transparent 70%)` }}
        >
          <p className="text-[11px] font-extrabold uppercase tracking-[0.06em] text-muted">
            {isRu ? 'Стоило бы сегодня' : 'Would be worth today'}
          </p>
          <p className="text-[32px] sm:text-[40px] font-black tracking-[-0.04em] leading-none mt-[7px] tabular-nums" style={{ color }}>
            {value !== null ? money(value) : '…'}
          </p>
          {multiple !== null && (
            <p className="text-[13px] font-extrabold mt-2" style={{ color }}>
              ×{multiple >= 100 ? Math.round(multiple).toLocaleString(isRu ? 'ru-RU' : 'en-US') : multiple.toFixed(1)}{' '}
              {isRu ? 'к вложенному' : 'your money'}
            </p>
          )}
          {first && (
            <p className="text-[11.5px] text-muted mt-[7px] leading-relaxed">
              ${amount.toLocaleString(isRu ? 'ru-RU' : 'en-US')} {isRu ? 'в' : 'in'} {first.year} {isRu ? 'году по' : 'at'}{' '}
              {money(first.price)} — {isRu ? 'это' : 'that is'} {coins >= 1 ? coins.toFixed(4) : coins.toFixed(6)} {symbol}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-[9px]">
          <Row k={isRu ? 'Вложено' : 'Invested'} v={`$${amount.toLocaleString(isRu ? 'ru-RU' : 'en-US')}`} />
          <Row
            k={isRu ? 'Прибыль' : 'Profit'}
            v={value !== null ? `${value - amount >= 0 ? '+' : '−'}${money(Math.abs(value - amount))}` : '…'}
            color={value !== null && value - amount < 0 ? 'var(--negative)' : 'var(--positive)'}
          />
          <Row k={isRu ? 'Цена тогда' : 'Price then'} v={first ? money(first.price) : '—'} />
          <Row k={isRu ? 'Цена сейчас' : 'Price now'} v={price ? money(price) : '…'} />
        </div>
      </div>

      {ath > 0 && (
        <Drawdown
          title={isRu ? 'Что пришлось бы пережить по дороге' : 'What you would have sat through'}
          width={Math.min(100, Math.abs(athChangePct))}
        >
          {isRu ? (
            <>
              {name} сейчас на <b className="text-foreground">{Math.abs(athChangePct).toFixed(0)}%</b> ниже своего максимума {money(ath)}.
              Прибыль на экране — это конец пути, а не весь путь: чтобы дойти до неё, позицию надо было удержать через падение такой глубины.
            </>
          ) : (
            <>
              {name} sits <b className="text-foreground">{Math.abs(athChangePct).toFixed(0)}%</b> below its high of {money(ath)}.
              The profit on screen is the end of the road, not the road: reaching it meant holding through a fall that deep.
            </>
          )}
        </Drawdown>
      )}

      <div className="flex flex-col sm:flex-row gap-[9px] mt-3.5">
        {reference.map((r) => {
          const c = amount / r.price;
          const v = price ? c * price : null;
          return (
            <div key={r.yearsAgo} className="flex-1 rounded-[13px] border border-[var(--glass-line)] px-3 py-2.5">
              <p className="text-[11px] font-extrabold" style={{ color }}>{r.label[loc]}</p>
              <p className="text-[10.5px] text-muted mt-0.5">{r.note[loc]}</p>
              <p className="text-base font-black mt-[7px] tabular-nums" style={{ color: v !== null && v < amount ? 'var(--negative)' : 'var(--positive)' }}>
                {v !== null ? money(v) : '…'}
              </p>
              <p className="text-[11px] text-muted mt-0.5">
                {isRu ? 'из' : 'from'} ${amount.toLocaleString(isRu ? 'ru-RU' : 'en-US')} · {isRu ? 'цена была' : 'price was'} {money(r.price)}
              </p>
            </div>
          );
        })}
      </div>
    </>
  );
}

function MonthlyResult({
  run, amount, color, isRu, money, pct, dateLabel, plural, loading,
}: {
  run: DcaRun | null; amount: number; color: string; isRu: boolean; loading: boolean;
  money: (n: number) => string; pct: (n: number) => string;
  dateLabel: (d: string) => string; plural: (n: number, a: string, b: string, c: string) => string;
}) {
  if (!run) {
    return (
      <p className="text-sm text-muted">
        {loading
          ? (isRu ? 'Загружаю историю цен…' : 'Loading price history…')
          : (isRu ? 'Историю цен для этой монеты сейчас получить не удалось. Обновите страницу через несколько минут.' : 'Price history for this coin could not be fetched just now. Try again in a few minutes.')}
      </p>
    );
  }
  const diff = run.valueNow - run.invested;
  const better = run.valueNow - run.lumpValueNow;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-[1.15fr_1fr] gap-3.5">
        <div
          className="rounded-2xl border border-[var(--glass-line)] p-4 sm:p-[18px]"
          style={{ background: `linear-gradient(150deg, color-mix(in srgb, ${color} 18%, transparent), transparent 70%)` }}
        >
          <p className="text-[11px] font-extrabold uppercase tracking-[0.06em] text-muted">
            {isRu ? 'Стоило бы сегодня' : 'Would be worth today'}
          </p>
          <p className="text-[32px] sm:text-[40px] font-black tracking-[-0.04em] leading-none mt-[7px] tabular-nums" style={{ color }}>
            {money(run.valueNow)}
          </p>
          <p className="text-[13px] font-extrabold mt-2" style={{ color: run.changePct < 0 ? 'var(--negative)' : 'var(--positive)' }}>
            {pct(run.changePct)} {isRu ? 'к вложенному' : 'on what you put in'}
          </p>
          <p className="text-[11.5px] text-muted mt-[7px] leading-relaxed">
            ${amount.toLocaleString(isRu ? 'ru-RU' : 'en-US')} {isRu ? 'в месяц с' : 'a month from'} {dateLabel(run.from)} —{' '}
            {isRu ? 'это' : 'that is'} {plural(run.purchases, 'покупка', 'покупки', 'покупок')} {isRu ? 'на' : 'totalling'} ${run.invested.toLocaleString(isRu ? 'ru-RU' : 'en-US')}
          </p>
        </div>

        <div className="flex flex-col gap-[9px]">
          <Row k={isRu ? 'Вложено' : 'Invested'} v={`$${run.invested.toLocaleString(isRu ? 'ru-RU' : 'en-US')}`} />
          <Row
            k={diff < 0 ? (isRu ? 'Убыток' : 'Loss') : (isRu ? 'Прибыль' : 'Profit')}
            v={`${diff < 0 ? '−' : '+'}${money(Math.abs(diff))}`}
            color={diff < 0 ? 'var(--negative)' : 'var(--positive)'}
          />
          <Row k={isRu ? 'Если бы разом' : 'If bought in one go'} v={money(run.lumpValueNow)} />
          <Row
            k={isRu ? 'Разница' : 'Difference'}
            v={`${better >= 0 ? '+' : '−'}${money(Math.abs(better))}`}
            color={better >= 0 ? 'var(--positive)' : 'var(--negative)'}
          />
        </div>
      </div>

      <JourneyChart run={run} color={color} isRu={isRu} dateLabel={dateLabel} />

      {run.worst && (
        <Drawdown
          title={isRu ? 'Худший момент этого периода' : 'The worst moment of this run'}
          width={Math.min(100, Math.abs(run.worst.pct))}
        >
          {isRu ? (
            <>
              <b className="text-foreground">{dateLabel(run.worst.date)}</b>: вы уже вложили ${run.worst.invested.toLocaleString('ru-RU')},
              а стоило это {money(run.worst.value)} — <b className="text-foreground">{pct(run.worst.pct)}</b>.
              Именно в такой день люди продают. Итог на экране получают те, кто не продал.
            </>
          ) : (
            <>
              <b className="text-foreground">{dateLabel(run.worst.date)}</b>: you had put in ${run.worst.invested.toLocaleString('en-US')} and
              it was worth {money(run.worst.value)} — <b className="text-foreground">{pct(run.worst.pct)}</b>.
              That is the day people sell. The figure above belongs to those who did not.
            </>
          )}
        </Drawdown>
      )}
    </>
  );
}

/**
 * Invested-to-date against what it was worth. The gap between the dashed line
 * and the fill is the profit or loss — visible rather than arithmetic.
 */
function JourneyChart({
  run, color, isRu, dateLabel,
}: { run: DcaRun; color: string; isRu: boolean; dateLabel: (d: string) => string }) {
  const pts = run.series;
  if (pts.length < 3) return null;
  const W = 620, H = 140, PAD = 6;
  const max = Math.max(...pts.map((p) => Math.max(p.invested, p.value))) * 1.08 || 1;
  const x = (i: number) => PAD + (i / (pts.length - 1)) * (W - PAD * 2);
  const y = (v: number) => H - PAD - (v / max) * (H - PAD * 2);
  const path = (k: 'invested' | 'value') => pts.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(p[k]).toFixed(1)}`).join(' ');
  const area = `${path('value')} L${x(pts.length - 1).toFixed(1)},${H - PAD} L${x(0).toFixed(1)},${H - PAD} Z`;
  const wi = run.worst ? Math.max(0, pts.findIndex((p) => p.date >= run.worst!.date)) : -1;

  return (
    <div className="mt-4 rounded-2xl border border-[var(--glass-line)] px-4 pt-3.5 pb-3 bg-[color-mix(in_srgb,var(--foreground)_3%,transparent)]">
      <p className="text-[12.5px] font-extrabold text-foreground">{isRu ? 'Как это выглядело по месяцам' : 'How it looked month by month'}</p>
      <p className="text-[11px] text-muted mt-0.5 mb-3 leading-relaxed">
        {isRu
          ? 'Пунктир — сколько вы вложили нарастающим итогом. Заливка — сколько это стоило в тот день. Где заливка ниже пунктира, вы были в минусе.'
          : 'The dashed line is what you had put in by then. The fill is what it was worth that day. Where the fill sits below the line, you were down.'}
      </p>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="block w-full h-[120px] sm:h-[150px]"
        role="img"
        aria-label={isRu
          ? `График: вложенная сумма против стоимости вложений с ${dateLabel(run.from)}`
          : `Chart: amount invested against its value since ${dateLabel(run.from)}`}>
        <defs>
          <linearGradient id={`jg-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.42" />
            <stop offset="100%" stopColor={color} stopOpacity="0.04" />
          </linearGradient>
        </defs>
        <path d={area} fill={`url(#jg-${color.replace('#', '')})`} />
        <path d={path('value')} fill="none" stroke={color} strokeWidth="2.2" strokeLinejoin="round" />
        <path d={path('invested')} fill="none" stroke="currentColor" strokeWidth="1.6" strokeDasharray="5 4" opacity="0.62" />
        {wi >= 0 && (
          <>
            <line x1={x(wi)} y1={y(pts[wi].value)} x2={x(wi)} y2={y(pts[wi].invested)} stroke="var(--negative)" strokeWidth="1.6" />
            <circle cx={x(wi)} cy={y(pts[wi].value)} r="4.5" fill="var(--negative)" />
          </>
        )}
      </svg>
      <div className="flex justify-between text-[10px] text-muted mt-1.5">
        <span>{dateLabel(run.from)}</span>
        <span>{isRu ? 'сегодня' : 'today'}</span>
      </div>
      <div className="flex flex-wrap gap-3.5 mt-2.5 text-[11px] text-muted">
        <span><i className="inline-block w-3.5 h-[2.5px] rounded-sm mr-1.5 align-[2px]" style={{ background: color }} />{isRu ? 'стоимость вложений' : 'value'}</span>
        <span><i className="inline-block w-3.5 h-[2.5px] rounded-sm mr-1.5 align-[2px] opacity-60 bg-current" />{isRu ? 'сколько вложено' : 'invested'}</span>
        {run.worst && (
          <span><i className="inline-block w-[7px] h-[7px] rounded-full mr-1.5 bg-[var(--negative)]" />{isRu ? 'худший день' : 'worst day'}: {dateLabel(run.worst.date)}</span>
        )}
      </div>
    </div>
  );
}

function Drawdown({ title, width, children }: { title: string; width: number; children: React.ReactNode }) {
  return (
    <div className="mt-3.5 rounded-[14px] border px-3.5 py-3 border-[color-mix(in_srgb,var(--negative)_34%,var(--glass-line))] bg-[color-mix(in_srgb,var(--negative)_7%,transparent)]">
      <p className="text-[12.5px] font-extrabold text-foreground flex items-center gap-[7px]">⚠ {title}</p>
      <p className="text-[11.5px] text-muted mt-1.5 leading-relaxed">{children}</p>
      <div className="relative h-[7px] rounded-full mt-2.5 overflow-hidden bg-[color-mix(in_srgb,var(--foreground)_10%,transparent)]">
        <i className="absolute left-0 top-0 bottom-0 rounded-full" style={{ width: `${width}%`, background: 'linear-gradient(90deg, color-mix(in srgb, var(--negative) 45%, transparent), var(--negative))' }} />
      </div>
    </div>
  );
}

function Row({ k, v, color }: { k: string; v: string; color?: string }) {
  return (
    <div className="rounded-[13px] border border-[var(--glass-line)] px-3 py-2.5 flex justify-between items-baseline gap-2.5">
      <span className="text-[11.5px] text-muted">{k}</span>
      <span className="text-sm font-extrabold tabular-nums whitespace-nowrap" style={color ? { color } : undefined}>{v}</span>
    </div>
  );
}
