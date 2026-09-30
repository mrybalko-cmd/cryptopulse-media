'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Share2 } from 'lucide-react';
import {
  TOP_BILLIONAIRES, NET_WORTH_AS_OF, billionaireById, growthPerSecond, wealthAt,
} from '@/lib/billionaires';
import {
  BITCOIN_GENESIS_MS, BTC_MAX_SUPPLY, HUMAN_LIFESPAN_YEARS, INCOME_MAX, RATE_MAX, RATE_MIN,
  WEALTH_DEFAULTS, computeWealth, formatCompactMoney, formatDecimal, formatInt, formatMoney,
  formatSmart, parseWealthState, serializeWealthState, timesWord, yearsWord, type WealthState,
} from '@/lib/wealth';
import { btcShare, type WealthCrypto } from '@/lib/wealthCrypto';
import { SITE_URL } from '@/lib/site';
import ShareResultSheet from './ShareResultSheet';

const SECONDS_PER_YEAR = 365.25 * 24 * 3600;
const SNAPSHOT_MS = Date.parse(`${NET_WORTH_AS_OF}T00:00:00Z`);

/**
 * Калькулятор состояний целиком: счётчик, крипто-блок, расчёт и шеринг.
 *
 * Состояние страницы живёт в адресной решётке (#p=musk&inc=1000&rate=20), а не
 * в запросе. Запрос читает сервер, и чтение делает маршрут динамическим —
 * страница теряет кэш и пересобирается на каждый заход. Решётка до сервера не
 * доходит вовсе: маршрут остаётся статическим, а восстановлением занимается
 * этот компонент после гидратации.
 */
export default function WealthBoard({ locale, crypto }: { locale: string; crypto: WealthCrypto | null }) {
  const isRu = locale === 'ru';
  const [state, setState] = useState<WealthState>(WEALTH_DEFAULTS);
  const [shareOpen, setShareOpen] = useState(false);

  // Первый рендер и на сервере, и в браузере показывает сам замер Forbes —
  // иначе разметка разойдётся на первом же кадре. Счётчик стартует после
  // гидратации, с этой же точки.
  const [now, setNow] = useState(SNAPSHOT_MS);
  const openedAt = useRef(SNAPSHOT_MS);

  const billionaire = billionaireById(state.p);
  const { savedPerYear, years } = useMemo(() => computeWealth(state), [state]);

  /* Восстановление из решётки. Query-строка принимается тоже — на случай
     ссылок, сохранённых до перехода на решётку. */
  useEffect(() => {
    const raw = window.location.hash.length > 1 ? window.location.hash : window.location.search;
    if (raw.length > 1) setState(parseWealthState(raw));
    openedAt.current = Date.now();
    setNow(Date.now());
  }, []);

  useEffect(() => {
    const qs = serializeWealthState(state);
    const next = qs ? `${window.location.pathname}#${qs}` : window.location.pathname;
    window.history.replaceState(null, '', next);
  }, [state]);

  /* Счётчик. Кто просил меньше движения — получает одно обновление в секунду
     вместо каждого кадра: число всё равно должно идти, иначе «вживую» врёт. */
  useEffect(() => {
    const calm = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (calm) {
      const id = setInterval(() => setNow(Date.now()), 1000);
      return () => clearInterval(id);
    }
    let raf = 0;
    const loop = () => { setNow(Date.now()); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const pick = useCallback((id: string) => {
    setState((s) => ({ ...s, p: id }));
    openedAt.current = Date.now();
  }, []);

  const live = wealthAt(billionaire, Math.max(now, SNAPSHOT_MS));
  const grown = live - wealthAt(billionaire, Math.max(openedAt.current, SNAPSHOT_MS));
  const perSecond = growthPerSecond(billionaire);

  const btc = crypto ? btcShare(billionaire.netWorth, crypto.btcPrice) : null;
  const ratePn = (state.rate - RATE_MIN) / (RATE_MAX - RATE_MIN);

  const name = isRu ? billionaire.name.ru : billionaire.name.en;
  const yearsText = Number.isFinite(years) ? formatInt(years, locale) : '∞';

  const shareUrl = useMemo(() => {
    const qs = serializeWealthState(state);
    return `${SITE_URL}/${locale}/calculators/wealth${qs ? `#${qs}` : ''}`;
  }, [state, locale]);

  const shareText = isRu
    ? `${yearsText} ${yearsWord(years, locale)} — столько мне копить на состояние ${billionaire.possessive.ru}. А вам?`
    : `${yearsText} ${yearsWord(years, locale)} — that is how long I would save for ${billionaire.possessive.en} fortune. And you?`;

  // Ореолы лежат под всем блоком, а не только под героем: стекло такой
  // прозрачности без подсветки за спиной неотличимо от матовой панели, и
  // крипто-карточки с калькулятором теряли отделку первыми.
  return (
    <div className="relative flex flex-col gap-4">
      <span aria-hidden className="pointer-events-none absolute -left-[10%] top-[26%] h-[42%] w-[62%] rounded-full blur-[80px]"
            style={{ background: 'radial-gradient(50% 50% at 50% 50%, var(--halo-violet), transparent 72%)' }} />
      <span aria-hidden className="pointer-events-none absolute -right-[8%] top-[52%] h-[38%] w-[54%] rounded-full blur-[80px]"
            style={{ background: 'radial-gradient(50% 50% at 50% 50%, var(--halo-cyan), transparent 72%)' }} />

      {/* ── герой: счётчик ────────────────────────────────────────────── */}
      <section className="relative z-[1]">
        <span aria-hidden className="pointer-events-none absolute -left-[8%] -top-[26%] h-[110%] w-[58%] rounded-full blur-[64px]"
              style={{ background: 'radial-gradient(50% 50% at 50% 50%, var(--halo-violet), transparent 70%)' }} />
        <span aria-hidden className="pointer-events-none absolute -right-[6%] top-[4%] h-[86%] w-[46%] rounded-full blur-[64px]"
              style={{ background: 'radial-gradient(50% 50% at 50% 50%, var(--halo-cyan), transparent 70%)' }} />

        <div className="relative z-[1] overflow-hidden rounded-2xl border border-[var(--glass-edge)]
                        bg-[var(--glass-clear)] p-4 shadow-[var(--glass-shadow),inset_0_1px_0_var(--glass-edge-lit)]
                        backdrop-blur-[20px] backdrop-saturate-150 sm:p-6">
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
            <b className="text-[14.5px] font-extrabold text-foreground">{name}</b>
            <span className="text-[12px] text-muted">{billionaire.company}</span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#f8595f]/35 bg-[#f8595f]/10
                             px-2 py-1 text-[10px] font-extrabold uppercase tracking-[0.1em] text-[#f8595f]">
              <span aria-hidden className="wealth-dot block h-[7px] w-[7px] rounded-full"
                    style={{ backgroundImage: 'linear-gradient(135deg,#c084fc,#7c3aed)' }} />
              {isRu ? 'вживую' : 'live'}
            </span>
          </div>

          {/* Кегль стоит на строке, а не на самом числе: доллар и слово рядом
              заданы в долях em, и от кегля числа они должны считаться тоже. */}
          <p className="mt-2.5 flex items-baseline font-extrabold leading-[0.95] tracking-[-0.045em] text-[clamp(28px,7.2vw,64px)]">
            <span className="mr-[0.28em] text-[0.42em] font-extrabold text-muted">$</span>
            <span suppressHydrationWarning className="wealth-grad tabular-nums">
              {formatInt(live, locale)}
            </span>
          </p>
          <p className="mt-1.5 text-[13px] text-muted">
            {isRu ? 'С тех пор как вы открыли страницу, он стал богаче на ' : 'Since you opened this page, he has gained '}
            <b suppressHydrationWarning className="font-bold tabular-nums text-positive">
              {formatMoney(Math.max(grown, 0), locale)}
            </b>
          </p>

          <div className="glass-divider mt-3.5 grid grid-cols-2 gap-x-5 gap-y-3 border-t pt-3.5 sm:flex sm:flex-wrap">
            <Speed value={formatMoney(perSecond, locale)} label={isRu ? 'в секунду' : 'per second'} />
            <Speed value={formatCompactMoney(perSecond * 3600, locale)} label={isRu ? 'в час' : 'per hour'} />
            <Speed value={formatCompactMoney(perSecond * 86400, locale)} label={isRu ? 'в сутки' : 'per day'} />
            <Speed value={`+${formatCompactMoney(perSecond * SECONDS_PER_YEAR, locale)}`}
                   label={isRu ? 'за последний год' : 'over the past year'} />
          </div>

          <div className="mt-3.5 grid grid-cols-3 gap-1.5 sm:flex sm:flex-wrap sm:gap-2">
            {TOP_BILLIONAIRES.map((b) => {
              const on = b.id === billionaire.id;
              const full = isRu ? b.name.ru : b.name.en;
              return (
                <button
                  key={b.id}
                  onClick={() => pick(b.id)}
                  aria-pressed={on}
                  className={`relative overflow-hidden rounded-xl border px-2 py-1.5 text-center backdrop-blur-[14px]
                              transition-[transform,border-color,box-shadow] sm:px-3 sm:py-2 sm:text-left
                              motion-reduce:transform-none ${
                    on
                      ? 'border-[#a855f7]/55 shadow-[0_10px_24px_rgba(124,58,237,0.28),inset_0_1px_0_rgba(255,255,255,0.2)]'
                      : 'glass-control hover:-translate-y-px'
                  }`}
                  style={on ? { backgroundImage: 'linear-gradient(115deg,rgba(168,85,247,0.16),rgba(34,211,238,0.12))' } : undefined}
                >
                  <span className={`block truncate text-[11.5px] font-bold sm:text-[12.5px] ${on ? 'wealth-grad' : 'text-foreground'}`}>
                    <span className="sm:hidden">{full.split(' ').slice(-1)[0]}</span>
                    <span className="max-sm:hidden">{full}</span>
                  </span>
                  <span className="block text-[9.5px] tabular-nums text-muted sm:text-[10.5px]">
                    {formatCompactMoney(b.netWorth, locale)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── крипто-угол ───────────────────────────────────────────────── */}
      {crypto && btc && (
        <section className="relative z-[1] grid gap-3 sm:grid-cols-[1.2fr_1fr]">
          <Panel title={isRu ? 'Это состояние в биткоинах' : 'This fortune in bitcoin'}>
            <p className="font-extrabold leading-none tracking-[-0.035em] text-[#e0ab3a] text-[clamp(24px,5vw,34px)]">
              {formatInt(btc.coins, locale)}
              <span className="ml-1 text-[0.4em] font-extrabold text-muted">BTC</span>
            </p>
            <p className="mt-3 text-[12.5px] text-muted">
              {isRu ? 'Доля от всех биткоинов, которые когда-либо будут добыты' : 'Share of every bitcoin that will ever be mined'}
            </p>
            <div className="mt-1.5 h-[11px] overflow-hidden rounded-md border border-border bg-background">
              <span className="block h-full rounded-md transition-[width] duration-500 motion-reduce:transition-none"
                    style={{ width: `${Math.min(btc.pctOfCap, 100)}%`, backgroundImage: 'linear-gradient(90deg,#e0ab3a,#f6d178)' }} />
            </div>
            <p className="mt-1.5 text-[11px] text-muted">
              {formatDecimal(btc.pctOfCap, locale, 1)}%{' '}
              {isRu
                ? `от ${formatInt(BTC_MAX_SUPPLY, locale)} — предельной эмиссии биткоина`
                : `of ${formatInt(BTC_MAX_SUPPLY, locale)} — bitcoin’s hard cap`}
            </p>
          </Panel>

          <Panel title={isRu ? 'Что он мог бы купить целиком' : 'What he could buy outright'}>
            <ul className="flex flex-col">
              {crypto.caps.map((c) => {
                const times = billionaire.netWorth / c.marketCap;
                const shown = times < 10 ? times : Math.round(times);
                return (
                  <li key={c.slug} className="glass-divider flex items-baseline justify-between gap-3 border-b py-2 last:border-b-0">
                    <span className="text-[13px] text-muted">{isRu ? `Весь ${c.name}` : `All of ${c.name}`}</span>
                    <b className="wealth-grad shrink-0 text-[14px] font-extrabold tabular-nums">
                      {isRu
                        ? `${formatSmart(times, locale)} ${timesWord(shown, locale)}`
                        : `${formatSmart(times, locale)}×`}
                    </b>
                  </li>
                );
              })}
              <li className="flex items-baseline justify-between gap-3 py-2">
                <span className="text-[13px] text-muted">{isRu ? 'Весь биткоин' : 'All of bitcoin'}</span>
                <b className="wealth-grad shrink-0 text-[14px] font-extrabold tabular-nums">
                  {formatDecimal((billionaire.netWorth / crypto.btcMarketCap) * 100, locale, 0)}%
                </b>
              </li>
            </ul>
          </Panel>
        </section>
      )}

      {/* ── расчёт ────────────────────────────────────────────────────── */}
      <section className="relative z-[1] overflow-hidden rounded-2xl border border-[var(--glass-edge)]
                          bg-[var(--glass-clear)] p-4 shadow-[var(--glass-shadow)]
                          backdrop-blur-[18px] sm:p-6">
        <h2 className="text-[17px] font-extrabold text-foreground sm:text-[19px]">
          {isRu ? 'А сколько лет на это уйдёт у вас' : 'And how long would it take you'}
        </h2>
        <p className="mt-1.5 max-w-[62ch] text-[13.5px] text-muted">
          {isRu
            ? 'Считаем честно: не весь доход уходит в накопления. Поставьте свою долю — и увидите число, которое имеет отношение к жизни, а не к арифметике.'
            : 'Honest maths: you do not save everything you earn. Set your own share and the number starts describing your life rather than a division sum.'}
        </p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-[12px] font-medium text-muted">
              {isRu ? 'Ваш доход в месяц' : 'Your monthly income'}
            </span>
            <span className="glass-control flex items-center gap-1.5 rounded-xl px-3 py-2.5">
              <span className="text-muted">$</span>
              <input
                type="number"
                inputMode="numeric"
                min={1}
                max={INCOME_MAX}
                value={state.inc}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  setState((s) => ({ ...s, inc: Number.isFinite(v) ? Math.min(Math.max(Math.round(v), 0), INCOME_MAX) : 0 }));
                }}
                className="w-full min-w-0 bg-transparent text-[15px] font-bold tabular-nums text-foreground outline-none"
              />
            </span>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-[12px] font-medium text-muted">
              {isRu ? 'Сколько откладываете' : 'How much you save'}
            </span>
            <span className="flex h-[42px] items-center gap-3">
              <input
                type="range"
                min={RATE_MIN}
                max={RATE_MAX}
                value={state.rate}
                onChange={(e) => setState((s) => ({ ...s, rate: Number(e.target.value) }))}
                className="wealth-range min-w-0 flex-1"
                style={{ ['--pn' as string]: ratePn }}
                aria-label={isRu ? 'Доля дохода в накопления, проценты' : 'Share of income saved, percent'}
              />
              <b className="wealth-grad w-[52px] shrink-0 text-right text-[16px] font-extrabold tabular-nums">
                {state.rate}%
              </b>
            </span>
          </label>
        </div>

        <div className="relative mt-4 overflow-hidden rounded-xl border border-[#a855f7]/30 p-4 sm:p-5"
             style={{ backgroundImage: 'linear-gradient(115deg,rgba(168,85,247,0.16),rgba(34,211,238,0.12))' }}>
          <p className="flex items-baseline font-extrabold leading-none tracking-[-0.04em] text-[clamp(30px,6vw,48px)]">
            <span className="wealth-grad wealth-grad-drift tabular-nums">{yearsText}</span>
            <span className="ml-[0.28em] text-[0.34em] font-extrabold text-muted">{yearsWord(years, locale)}</span>
          </p>
          <p className="mt-1.5 text-[13px] text-muted">
            {Number.isFinite(years)
              ? isRu
                ? `при доходе ${formatMoney(state.inc, locale)} в месяц и норме сбережений ${state.rate}% — это ${formatMoney(savedPerYear, locale)} в год`
                : `at ${formatMoney(state.inc, locale)} a month and a ${state.rate}% savings rate — that is ${formatMoney(savedPerYear, locale)} a year`
              : isRu
                ? 'при нулевом доходе копить нечего — поставьте сумму выше'
                : 'nothing saved, nothing counted — enter an income above'}
          </p>

          {Number.isFinite(years) && (
            <div className="mt-4 grid gap-2 border-t border-[#a855f7]/25 pt-3.5 sm:grid-cols-3">
              <Fact value={formatSmart(years / HUMAN_LIFESPAN_YEARS, locale)}
                    label={isRu ? `человеческих жизней по ${HUMAN_LIFESPAN_YEARS} лет` : `human lifetimes of ${HUMAN_LIFESPAN_YEARS} years`} />
              <Fact value={formatSmart(years / 100, locale)}
                    label={isRu ? 'веков непрерывной работы' : 'centuries of unbroken work'} />
              {/* Возраст биткоина берём из того же now, что и счётчик: Date.now()
                  прямо в разметке даёт на сервере и в браузере разные числа, и React
                  ругается на расхождение при гидратации. */}
              <Fact value={formatSmart(years / ((now - BITCOIN_GENESIS_MS) / (SECONDS_PER_YEAR * 1000)), locale)}
                    label={isRu ? 'раз по столько, сколько существует биткоин' : 'times as long as bitcoin has existed'} />
            </div>
          )}

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#a855f7]/25 pt-3.5">
            <p className="max-w-[44ch] text-[12.5px] text-muted">
              {isRu
                ? 'Готовая картинка с вашим числом — для Telegram, Twitter или LinkedIn.'
                : 'A ready-made image with your number — for Telegram, Twitter or LinkedIn.'}
            </p>
            <button
              onClick={() => setShareOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-[13px] font-extrabold text-white
                         shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_6px_18px_rgba(124,58,237,0.42),0_2px_4px_rgba(0,0,0,0.3)]
                         transition-transform hover:-translate-y-px active:translate-y-px motion-reduce:transform-none"
              style={{ backgroundImage: 'linear-gradient(115deg,#a855f7 0%,#6366f1 38%,#22d3ee 100%)' }}
            >
              <Share2 size={15} />
              {isRu ? 'Поделиться результатом' : 'Share your result'}
            </button>
          </div>
        </div>
      </section>

      <ShareResultSheet
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        state={state}
        locale={locale}
        shareUrl={shareUrl}
        shareText={shareText}
      />
    </div>
  );
}

function Speed({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <b className="block text-[15px] font-extrabold leading-tight tracking-[-0.02em] tabular-nums text-foreground sm:text-[16px]">
        {value}
      </b>
      <span className="text-[11px] text-muted">{label}</span>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[var(--glass-edge)] bg-[var(--glass-clear)]
                    p-4 shadow-[var(--glass-shadow),inset_0_1px_0_var(--glass-edge-lit)]
                    backdrop-blur-[18px] sm:p-5">
      <h3 className="mb-2.5 text-[11.5px] font-bold uppercase tracking-[0.11em] text-muted">{title}</h3>
      {children}
    </div>
  );
}

function Fact({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-lg border border-border bg-background/25 px-3 py-2.5">
      <b className="block text-[17px] font-extrabold leading-tight tabular-nums text-foreground">{value}</b>
      <span className="block text-[11px] leading-snug text-muted">{label}</span>
    </div>
  );
}
