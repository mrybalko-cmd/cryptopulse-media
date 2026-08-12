import Link from 'next/link';
import type { PulseData } from '@/lib/pulse';
import { zoneMeta } from '@/lib/pulseMath';
import { BASE } from '@/lib/metadata';
import ShareButtons from './ShareButtons';

// One vertical violet identity in every placement. Both variables are defined
// per theme in globals.css, so the widget follows the theme without carrying a
// second palette of its own.
const V1 = 'var(--violet-2)';
const V2 = 'var(--violet)';
const NUMBER = `linear-gradient(160deg, ${V1}, ${V2})`;

// The 0-100 rail. Colour encodes the zone, and the tick at the midpoint is
// the whole point of the widget: "23" means nothing without seeing where 50
// is.
const RAIL = 'linear-gradient(90deg,#3b82f6,#06b6d4 30%,#94a3b8 50%,#c084fc 72%,#ec4899)';

const FACTOR_COLORS = ['#06b6d4', '#c084fc', '#ec4899', '#38bdf8', '#a78bfa'];

function barColor(score: number) {
  if (score >= 80) return '#ec4899';
  if (score >= 60) return '#c084fc';
  if (score >= 40) return '#94a3b8';
  if (score >= 20) return '#06b6d4';
  return '#3b82f6';
}

export type PulseVariant = 'card' | 'hub' | 'full';

export default function PulseWidget({
  data,
  locale,
  className = '',
  asHeading = true,
  variant = 'card',
}: {
  data: PulseData;
  locale: string;
  className?: string;
  // The homepage renders this widget twice — once for desktop, once for
  // mobile — toggled purely via CSS so only one is ever visible per viewport.
  // Real <h2> tags in both copies still read as a duplicate heading to
  // crawlers, so the non-canonical copy passes false here.
  asHeading?: boolean;
  /** card = homepage tile · hub = taller /calculators tile · full = the wide
   *  panel that leads the /pulse page. */
  variant?: PulseVariant;
}) {
  const isRu = locale === 'ru';
  const zone = zoneMeta(data.zone);
  const TitleTag = asHeading ? 'h2' : 'p';
  const pulseHref = `/${locale}/pulse`;
  const shareUrl = `${BASE}${pulseHref}`;
  const zoneLabel = isRu ? zone.ru : zone.en;
  const shareText = isRu
    ? `Пульс рынка сегодня: ${data.score} из 100 — ${zoneLabel}`
    : `Today's Market Pulse: ${data.score} of 100 — ${zoneLabel}`;

  const factors = [
    {
      name: isRu ? 'Объём торгов биткоина' : 'Bitcoin turnover',
      value: data.components.volume,
      chip: String(data.components.volume),
      note: isRu
        ? `${bn(data.raw.btcVolume24h, true)} при норме ${bn(data.raw.normVolume, true)}`
        : `${bn(data.raw.btcVolume24h, false)} vs ${bn(data.raw.normVolume, false)} norm`,
    },
    {
      name: isRu ? 'Рост цены за сутки' : 'Price change, 24h',
      value: data.components.growth,
      chip: String(data.components.growth),
      note: pct(data.raw.priceChange24h, isRu),
    },
    {
      name: isRu ? 'Волатильность' : 'Volatility',
      value: data.components.volatility,
      chip: String(data.components.volatility),
      note: isRu
        ? `норма движения ${pct(data.raw.normAbsChange, isRu, false)}`
        : `${pct(data.raw.normAbsChange, isRu, false)} typical move`,
    },
    {
      name: isRu ? 'Страх и жадность' : 'Fear & Greed',
      value: data.components.fearGreed,
      chip: String(data.components.fearGreed),
      note: moodWord(data.components.fearGreed, isRu),
    },
    ...(data.components.altcoin !== null
      ? [{
          name: isRu ? 'Отрыв альткоинов от биткоина' : 'Altcoin margin vs Bitcoin',
          value: data.components.altcoin,
          chip: String(data.components.altcoin),
          note: data.raw.altcoinMarginPp !== null
            ? isRu
              ? `${pct(data.raw.altcoinMarginPp, isRu, true, ' п.п.')} за месяц`
              : `${pct(data.raw.altcoinMarginPp, isRu, true, 'pp')} over 30d`
            : '',
        }]
      : []),
  ];

  const rail = (compact: boolean) => (
    <>
      <div
        className={`relative ${compact ? 'h-[7px]' : 'h-2.5'} rounded-full ${compact ? 'mt-1.5' : 'mt-4'}`}
        style={{ backgroundImage: RAIL }}
        role="img"
        aria-label={
          isRu
            ? `Пульс рынка ${data.score} из 100, где 50 — обычный режим`
            : `Market Pulse ${data.score} of 100, where 50 is normal`
        }
      >
        <span
          className="absolute left-1/2 w-px"
          style={{ top: compact ? -5 : -8, bottom: compact ? -5 : -8, background: 'color-mix(in srgb, var(--foreground) 55%, transparent)' }}
        />
        <span
          className={`absolute rounded-sm bg-white ${compact ? 'w-[3px] h-[15px] -top-1' : 'w-1 h-5 -top-[5px]'}`}
          style={{
            left: `calc(${data.score}% - ${compact ? 1.5 : 2}px)`,
            boxShadow: compact ? '0 0 0 1.5px rgba(0,0,0,.5)' : '0 0 0 2px rgba(0,0,0,.45), 0 2px 8px rgba(0,0,0,.5)',
          }}
        />
      </div>
      <div className={`flex justify-between ${compact ? 'text-[8px] mt-[3px]' : 'text-[10px] mt-2'} text-muted`}>
        <span>{isRu ? '0 — замер' : '0 — frozen'}</span>
        <span className={compact ? '' : 'text-foreground font-extrabold'}>{isRu ? '50 — обычный режим' : '50 — normal'}</span>
        <span>{isRu ? '100 — разгон' : '100 — peak'}</span>
      </div>
    </>
  );

  const chart = (days: number, heightClass: string) => {
    const slice = data.history.slice(-days);
    return (
      <div className={`relative flex items-end gap-px sm:gap-[2px] ${heightClass}`}>
        {slice.map((d, i) => (
          <span
            key={d.date}
            className="flex-1 min-w-[2px] rounded-t-[2px] block"
            style={{
              height: `${Math.max(4, d.score)}%`,
              background: barColor(d.score),
              boxShadow: i === slice.length - 1 ? `0 0 10px 1px color-mix(in srgb, ${V1} 65%, transparent)` : undefined,
            }}
          />
        ))}
        <span
          className="absolute left-0 right-0 border-t border-dashed"
          style={{ bottom: '50%', borderColor: 'color-mix(in srgb, var(--foreground) 30%, transparent)' }}
        />
      </div>
    );
  };

  if (variant === 'full') {
    return (
      <div
        className={`rounded-[20px] border border-[var(--popular-glass-line)] bg-[var(--popular-glass)] shadow-[inset_0_1px_0_var(--popular-glass-line),var(--popular-shadow)] p-5 sm:p-6 relative overflow-hidden ${className}`}
      >
        <Glow />
        <div className="relative">
          <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[0.09em] text-muted mb-2.5">
            <Dot />
            {isRu ? 'Пульс рынка' : 'Market Pulse'} · {formatDate(data.computedAt, locale)}
          </div>

          <div className="flex items-end gap-3.5 flex-wrap">
            <span
              className="text-[52px] sm:text-[64px] font-black leading-[0.9] tracking-[-0.045em] tabular-nums"
              style={{ backgroundImage: NUMBER, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}
            >
              {data.score}
            </span>
            <span className="text-base font-extrabold pb-1.5 text-foreground">
              {zoneLabel}
              <small className="block font-semibold text-muted text-xs mt-0.5">
                {isRu ? 'обычный режим — 50, рынок разогрет — 100' : 'normal is 50, running hot is 100'}
              </small>
            </span>
          </div>

          <p className="text-[12.5px] text-muted leading-relaxed mt-2.5 max-w-[66ch]">{summary(data, isRu)}</p>

          {rail(false)}
          <div className="mt-4">{chart(90, 'h-[66px]')}</div>
          <div className="flex justify-between text-[10px] text-muted mt-2">
            <span>{isRu ? '90 дней назад' : '90 days ago'}</span>
            <span>{isRu ? 'пунктир — отметка 50' : 'dashed line marks 50'}</span>
            <span>{isRu ? 'сегодня' : 'today'}</span>
          </div>

          <div className="flex flex-col gap-3.5 mt-5">
            {factors.map((f, i) => (
              <div key={f.name}>
                <div className="flex w-full justify-between items-baseline mb-[7px] gap-3">
                  <span className="text-[11.5px] font-bold text-muted">{f.name}</span>
                  <span className="text-[11px] text-muted text-right">{f.note}</span>
                </div>
                {/* Fill grows out from the midpoint, not from the left edge:
                    these components are two-sided — below 50 is as meaningful
                    as above it. */}
                <div className="relative block h-[9px] rounded-full bg-[color-mix(in_srgb,var(--foreground)_9%,transparent)]">
                  <span
                    className="absolute left-1/2 w-px -top-[3px] -bottom-[3px]"
                    style={{ background: 'color-mix(in srgb, var(--foreground) 32%, transparent)' }}
                  />
                  <i
                    className="absolute top-0 bottom-0 rounded-full block"
                    style={{
                      left: `${Math.min(50, f.value)}%`,
                      width: `${Math.max(Math.abs(f.value - 50), 0.5)}%`,
                      background: FACTOR_COLORS[i],
                    }}
                  />
                  <b
                    className="absolute top-1/2 -translate-y-1/2 text-[12.5px] font-black px-2.5 py-[3px] rounded-full whitespace-nowrap tabular-nums bg-background border-[1.5px] border-current shadow-[0_2px_10px_rgba(0,0,0,0.35)]"
                    style={{
                      color: FACTOR_COLORS[i],
                      ...(f.value < 50 ? { left: `${f.value}%` } : { right: `${100 - f.value}%` }),
                    }}
                  >
                    {f.chip}
                  </b>
                </div>
              </div>
            ))}
          </div>

          {data.yearStats && (
            <p className="text-[11px] text-muted mt-3 pt-3 border-t border-[var(--popular-glass-line)]">
              {isRu ? 'Норма считается по медиане за ' : 'Norms are medians over '}
              <b className="text-foreground tabular-nums">365</b>
              {isRu ? ' дней · за этот период индекс ходил от ' : ' days · over that span the index ranged '}
              <b className="text-foreground tabular-nums">{data.yearStats.min}</b>
              {isRu ? ' до ' : ' to '}
              <b className="text-foreground tabular-nums">{data.yearStats.max}</b>
              {isRu ? ', медиана ' : ', median '}
              <b className="text-foreground tabular-nums">{data.yearStats.median}</b>
            </p>
          )}

          <div className="flex items-center gap-2.5 mt-4 pt-4 border-t border-[var(--popular-glass-line)] flex-wrap">
            <span className="text-[11px] font-bold text-muted mr-1">
              {isRu ? 'Поделиться показателем' : 'Share this reading'}
            </span>
            <ShareButtons url={shareUrl} title={shareText} locale={locale} vertical={false} />
          </div>
        </div>
      </div>
    );
  }

  const isHub = variant === 'hub';

  return (
    <div
      className={`rounded-[18px] border border-[var(--popular-glass-line)] bg-[var(--popular-glass)] shadow-[inset_0_1px_0_var(--popular-glass-line),var(--popular-shadow)] ${isHub ? 'px-4 py-4' : 'px-4 py-3'} flex flex-col relative overflow-hidden ${className}`}
    >
      <Glow />

      {/* Whole info area is one click target to /pulse — only the share icons
          get their own action, since <a> can't nest interactive children. */}
      <Link href={pulseHref} className="flex flex-col flex-1 min-h-0 relative">
        <TitleTag className="flex items-center gap-1.5 text-[12.5px] font-extrabold text-foreground leading-tight">
          <Dot />
          {isRu ? 'Пульс рынка' : 'Market Pulse'}
        </TitleTag>

        <div className="flex items-baseline gap-2 mt-1">
          <span
            className={`${isHub ? 'text-[44px]' : 'text-[34px]'} font-black leading-none tabular-nums`}
            style={{ backgroundImage: NUMBER, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}
          >
            {data.score}
          </span>
          <span className="text-[12.5px] font-extrabold text-foreground">{zoneLabel}</span>
        </div>

        <div className={`${isHub ? 'text-[11.5px] mt-1.5' : 'text-[10.5px] mt-0.5'} text-muted leading-snug`}>
          {shortLine(data, isRu)}
        </div>

        {isHub && <p className="text-[11.5px] text-muted leading-relaxed mt-[7px]">{summary(data, isRu)}</p>}

        {rail(true)}

        <div className="mt-auto pt-[5px] min-h-0">{chart(isHub ? 60 : 45, isHub ? 'h-10' : 'h-[26px]')}</div>
      </Link>

      <div className="mt-1.5 pt-1.5 border-t border-[var(--popular-glass-line)] relative">
        <ShareButtons url={shareUrl} title={shareText} locale={locale} vertical={false} />
      </div>
    </div>
  );
}

function Glow() {
  return (
    <>
      <div className="absolute -top-12 -left-10 w-36 h-36 rounded-full blur-2xl opacity-25 pointer-events-none" style={{ background: V2 }} aria-hidden="true" />
      <div className="absolute -bottom-12 -right-10 w-32 h-32 rounded-full blur-2xl opacity-20 pointer-events-none" style={{ background: '#06b6d4' }} aria-hidden="true" />
    </>
  );
}

function Dot() {
  return (
    <span
      className="w-1.5 h-1.5 rounded-full shrink-0 animate-pulse motion-reduce:animate-none"
      style={{ background: V1, boxShadow: `0 0 8px ${V1}` }}
      aria-hidden="true"
    />
  );
}

function bn(v: number, isRu: boolean) {
  if (!(v > 0)) return '—';
  return isRu ? `${Math.round(v / 1e9)} млрд` : `$${Math.round(v / 1e9)}bn`;
}

function pct(v: number, isRu: boolean, signed = true, unit = '%') {
  const sign = signed ? (v > 0 ? '+' : v < 0 ? '−' : '') : '';
  const s = `${sign}${Math.abs(v).toFixed(1)}${unit === '%' ? '%' : ` ${unit}`}`;
  return isRu ? s.replace('.', ',') : s;
}

function moodWord(fg: number, isRu: boolean) {
  if (fg <= 25) return isRu ? 'сильный страх' : 'extreme fear';
  if (fg <= 45) return isRu ? 'страх' : 'fear';
  if (fg >= 75) return isRu ? 'сильная жадность' : 'extreme greed';
  if (fg >= 55) return isRu ? 'жадность' : 'greed';
  return isRu ? 'нейтрально' : 'neutral';
}

function formatDate(iso: string | undefined, locale: string) {
  if (!iso) return '';
  const d = new Date(iso.length === 10 ? `${iso}T00:00:00Z` : iso);
  return new Intl.DateTimeFormat(locale === 'ru' ? 'ru-RU' : 'en-GB', {
    day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'Europe/Prague',
  }).format(d);
}

/** One short line for the small tile — the single most-off-normal fact. */
function shortLine(data: PulseData, isRu: boolean) {
  const vol = data.raw.normVolume > 0 ? Math.round((data.raw.btcVolume24h / data.raw.normVolume - 1) * 100) : 0;
  const volPart = isRu
    ? vol < 0 ? `объём на ${Math.abs(vol)}% ниже нормы` : vol > 0 ? `объём на ${vol}% выше нормы` : 'объём в норме'
    : vol < 0 ? `turnover ${Math.abs(vol)}% below norm` : vol > 0 ? `turnover ${vol}% above norm` : 'turnover at norm';
  const movePart = Math.abs(data.raw.priceChange24h) < 0.5
    ? (isRu ? 'цена стоит' : 'price flat')
    : (isRu ? `цена ${pct(data.raw.priceChange24h, isRu)}` : `price ${pct(data.raw.priceChange24h, isRu)}`);
  return `${volPart}, ${movePart}`;
}

/**
 * The sentence that carries direction. A one-dimensional activity number
 * cannot say whether the market is rising or falling, so this always names
 * it explicitly — built from the same figures the factor rows display, never
 * a canned phrase that could contradict them.
 */
function summary(data: PulseData, isRu: boolean) {
  const { btcVolume24h, normVolume, priceChange24h } = data.raw;
  const volPct = normVolume > 0 ? Math.round((btcVolume24h / normVolume - 1) * 100) : 0;

  const volPart = isRu
    ? `Оборот биткоина ${bn(btcVolume24h, true)} при годовой норме ${bn(normVolume, true)}${volPct !== 0 ? ` — на ${Math.abs(volPct)}% ${volPct < 0 ? 'ниже' : 'выше'}` : ''}`
    : `Bitcoin turnover ${bn(btcVolume24h, false)} against a yearly norm of ${bn(normVolume, false)}${volPct !== 0 ? ` — ${Math.abs(volPct)}% ${volPct < 0 ? 'below' : 'above'}` : ''}`;

  const dirPart = isRu
    ? Math.abs(priceChange24h) < 0.5
      ? 'цена за сутки почти не изменилась'
      : `цена за сутки ${pct(priceChange24h, isRu)}`
    : Math.abs(priceChange24h) < 0.5
      ? 'price barely moved over 24h'
      : `price ${pct(priceChange24h, isRu)} over 24h`;

  const moodPart = isRu
    ? `на рынке ${moodWord(data.components.fearGreed, isRu)}`
    : `sentiment reads ${moodWord(data.components.fearGreed, isRu)}`;

  const verdict = data.score >= 60
    ? (isRu ? 'Активность выше обычной.' : 'Activity is above normal.')
    : data.score <= 39
      ? (isRu ? 'Активности нет.' : 'There is no activity.')
      : (isRu ? 'Рынок в привычном темпе.' : 'The market is at its usual pace.');

  return `${volPart}. ${cap(dirPart)}, ${moodPart}. ${verdict}`;
}

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
