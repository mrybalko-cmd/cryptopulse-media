import Link from 'next/link';
import type { PulseData } from '@/lib/pulse';
import { zoneMeta } from '@/lib/pulseMath';
import { BASE } from '@/lib/metadata';
import ShareButtons from './ShareButtons';

// One vertical violet gradient, used identically in every placement — the
// bar chart, the headline number, and the factor fills all read as the same
// object rather than three separately-coloured widgets. Fear & Greed owns
// red-green and Altcoin Season owns orange-violet, so Pulse stays on violet.
// Both are defined per theme in globals.css (#c084fc/#8b5cf6 dark,
// #a855f7/#7c3aed light), so the widget follows the theme without a second
// palette of its own.
const V1 = 'var(--violet-2)';
const V2 = 'var(--violet)';
const BAR = `linear-gradient(180deg, ${V1}, color-mix(in srgb, ${V2} 35%, transparent))`;
const NUMBER = `linear-gradient(160deg, ${V1}, ${V2})`;

// Per-factor accents. Only used for the three factor rows, where telling the
// bars apart at a glance matters more than colour unity.
const FACTOR_COLORS = ['#06b6d4', '#c084fc', '#ec4899'];

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
  // mobile — toggled purely via CSS so only one is ever visible per
  // viewport (see PopularList's asHeadings for the identical reasoning).
  // Real <h2> tags in both copies still read as a literal duplicate
  // heading to crawlers, so the non-canonical copy passes false here.
  asHeading?: boolean;
  /** card = homepage/admin tile · hub = taller /calculators tile ·
   *  full = the wide panel that leads the /pulse page. */
  variant?: PulseVariant;
}) {
  const isRu = locale === 'ru';
  const zone = zoneMeta(data.zone);
  const TitleTag = asHeading ? 'h2' : 'p';
  const pulseHref = `/${locale}/pulse`;
  const shareUrl = `${BASE}${pulseHref}`;

  // While the sample is too thin for an honest percentile, the raw composite
  // is the headline instead — a "78th percentile" off six days would be a
  // made-up precision, so we show the number we can actually stand behind.
  const hasPercentile = data.percentile !== null;
  const headline = hasPercentile ? data.percentile! : data.score;

  const zoneLabel = isRu ? zone.ru : zone.en;
  const shareText = isRu
    ? `Пульс рынка сегодня: ${headline} — ${zoneLabel}`
    : `Today's Market Pulse: ${headline} — ${zoneLabel}`;

  const subtitle = hasPercentile
    ? isRu
      ? `активнее, чем в ${data.percentile}% дней · сырой балл ${data.score}`
      : `busier than ${data.percentile}% of days · raw score ${data.score}`
    : isRu
      ? `сырой балл · выборка ${data.sampleSize} дн.`
      : `raw score · ${data.sampleSize}-day sample`;

  const factors = [
    {
      name: isRu ? 'Страх и жадность' : 'Fear & Greed',
      value: data.components.fearGreed,
      chip: String(data.components.fearGreed),
      note: isRu ? 'настроение рынка' : 'market sentiment',
    },
    {
      name: isRu ? 'Ротация в альткоины' : 'Altcoin rotation',
      value: data.components.altSeason,
      chip: String(data.components.altSeason),
      note: isRu ? 'аппетит к риску' : 'risk appetite',
    },
    {
      name: isRu ? 'Объём к норме дня' : 'Volume vs day norm',
      value: data.components.volumeMomentum,
      chip: formatPct(data.volumeChangePct, isRu),
      note: isRu ? 'с поправкой на день недели' : 'weekday-adjusted',
    },
  ];

  const chart = (
    <div
      className={`flex items-end gap-[2px] sm:gap-[3px] ${variant === 'full' ? 'h-[78px]' : 'h-full min-h-[36px]'}`}
      role="img"
      aria-label={
        isRu
          ? `Пульс рынка за последние ${data.history.length} дней`
          : `Market Pulse over the last ${data.history.length} days`
      }
    >
      {data.history.map((d, i) => (
        <span
          key={d.date}
          className="flex-1 min-w-[3px] rounded-t-[3px] rounded-b-[1px] block"
          style={{
            // Percentile drives the height so the chart and the headline
            // number speak the same language; a floor of 9% keeps the
            // quietest day visible as a bar rather than a gap.
            height: `${Math.max(9, d.percentile ?? d.score)}%`,
            backgroundImage: BAR,
            boxShadow:
              i === data.history.length - 1
                ? `0 0 16px 1px color-mix(in srgb, ${V1} 65%, transparent)`
                : undefined,
          }}
        />
      ))}
    </div>
  );

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
              className="text-[54px] sm:text-[68px] font-black leading-[0.9] tracking-[-0.045em] tabular-nums"
              style={{ backgroundImage: NUMBER, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}
            >
              {headline}
            </span>
            <span className="text-base font-extrabold pb-1.5 text-foreground">
              {zoneLabel}
              <small className="block font-semibold text-muted text-xs mt-0.5">{subtitle}</small>
            </span>
          </div>

          <p className="text-[12.5px] text-muted leading-relaxed mt-2.5 max-w-[64ch]">{summary(data, isRu)}</p>

          <div className="mt-4">{chart}</div>
          <div className="flex justify-between text-[10px] text-muted mt-2">
            <span>{formatDate(data.history[0]?.date, locale, true)}</span>
            <span>{isRu ? 'сегодня' : 'today'}</span>
          </div>

          <div className="flex flex-col gap-4 mt-5">
            {factors.map((f, i) => (
              <div key={f.name}>
                <div className="flex w-full justify-between items-baseline mb-2 gap-3">
                  <span className="text-[11.5px] font-bold text-muted">{f.name}</span>
                  <span className="text-[11px] text-muted text-right">{f.note}</span>
                </div>
                <div className="relative block h-[9px] rounded-full bg-[color-mix(in_srgb,var(--foreground)_9%,transparent)]">
                  <i
                    className="absolute left-0 top-0 bottom-0 rounded-full block"
                    style={{
                      width: `${clamp(f.value)}%`,
                      backgroundImage: `linear-gradient(90deg, color-mix(in srgb, ${FACTOR_COLORS[i]} 32%, transparent), ${FACTOR_COLORS[i]})`,
                    }}
                  />
                  {/* Anchored by whichever edge keeps the chip inside the
                      track: centring on the value pushed "−24,1%" clean off
                      the rail at both extremes. */}
                  <b
                    className="absolute top-1/2 -translate-y-1/2 text-[12.5px] font-black px-2.5 py-[3px] rounded-full whitespace-nowrap tabular-nums bg-background border-[1.5px] border-current shadow-[0_2px_10px_rgba(0,0,0,0.35)]"
                    style={{
                      color: FACTOR_COLORS[i],
                      ...(clamp(f.value) < 50
                        ? { left: `${clamp(f.value)}%` }
                        : { right: `${100 - clamp(f.value)}%` }),
                    }}
                  >
                    {f.chip}
                  </b>
                </div>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-muted mt-3 pt-3 border-t border-[var(--popular-glass-line)]">
            {isRu ? 'Сырой составной балл: ' : 'Raw composite score: '}
            <b className="text-foreground tabular-nums">{data.score}</b>
            {isRu ? ' из 100 · объём ' : ' of 100 · volume '}
            <b className="text-foreground tabular-nums">{formatPct(data.volumeChangePct, isRu)}</b>
            {isRu ? ' к норме дня · выборка ' : ' vs day norm · sample '}
            <b className="text-foreground tabular-nums">{data.sampleSize}</b>
            {isRu ? ' дн.' : ' days'}
          </p>

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

  // card / hub — the compact tile. Chart flexes to whatever height the
  // surrounding grid hands us (201px on the homepage, 305px in the tools
  // hub), so one component covers both without a hard-coded height.
  const isHub = variant === 'hub';

  return (
    <div
      className={`rounded-[18px] border border-[var(--popular-glass-line)] bg-[var(--popular-glass)] shadow-[inset_0_1px_0_var(--popular-glass-line),var(--popular-shadow)] px-4 py-3.5 flex flex-col relative overflow-hidden ${className}`}
    >
      <Glow />

      {/* Whole info area is one big click target to /pulse — only the share
          icons below get their own separate action, since <a> can't nest
          interactive children. */}
      <Link href={pulseHref} className="flex flex-col flex-1 min-h-0 relative">
        <TitleTag className="flex items-center gap-1.5 text-[12.5px] font-extrabold text-foreground leading-tight">
          <Dot />
          {isRu ? 'Пульс рынка' : 'Market Pulse'}
        </TitleTag>

        <div className="flex items-baseline gap-2 mt-1.5">
          <span
            className={`${isHub ? 'text-[46px]' : 'text-[34px]'} font-black leading-none tabular-nums`}
            style={{ backgroundImage: NUMBER, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}
          >
            {headline}
          </span>
          <span className="text-[12.5px] font-extrabold text-foreground">{zoneLabel}</span>
        </div>

        <div className={`${isHub ? 'text-[11.5px] mt-1.5' : 'text-[10.5px] mt-1'} text-muted leading-snug`}>{subtitle}</div>

        {isHub && <p className="text-[11.5px] text-muted leading-relaxed mt-2.5">{summary(data, isRu)}</p>}

        <div className="mt-auto pt-2 min-h-0">{chart}</div>

        {isHub && (
          <div className="flex gap-[5px] mt-2.5">
            {factors.map((f, i) => (
              <i
                key={f.name}
                className="flex-1 h-1 rounded-full block"
                style={{
                  backgroundImage: `linear-gradient(90deg, color-mix(in srgb, ${FACTOR_COLORS[i]} 30%, transparent), ${FACTOR_COLORS[i]})`,
                }}
              />
            ))}
          </div>
        )}
      </Link>

      <div className="mt-2.5 pt-2 border-t border-[var(--popular-glass-line)] relative">
        <ShareButtons url={shareUrl} title={shareText} locale={locale} vertical={false} />
      </div>
    </div>
  );
}

function Glow() {
  return (
    <>
      <div
        className="absolute -top-12 -left-10 w-36 h-36 rounded-full blur-2xl opacity-25 pointer-events-none"
        style={{ background: V2 }}
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-12 -right-10 w-32 h-32 rounded-full blur-2xl opacity-20 pointer-events-none"
        style={{ background: '#06b6d4' }}
        aria-hidden="true"
      />
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

function clamp(v: number) {
  return Math.max(0, Math.min(100, v));
}

function formatPct(v: number, isRu: boolean) {
  const s = `${v > 0 ? '+' : v < 0 ? '−' : ''}${Math.abs(v).toFixed(1)}%`;
  return isRu ? s.replace('.', ',') : s;
}

function formatDate(iso: string | undefined, locale: string, short = false) {
  if (!iso) return '';
  const d = new Date(iso.length === 10 ? `${iso}T00:00:00Z` : iso);
  return new Intl.DateTimeFormat(locale === 'ru' ? 'ru-RU' : 'en-GB', {
    day: '2-digit',
    month: '2-digit',
    ...(short ? {} : { year: 'numeric' }),
    timeZone: 'Europe/Prague',
  }).format(d);
}

// One sentence naming what actually moved, built from the same numbers the
// factor rows show — never a canned phrase that could contradict them.
function summary(data: PulseData, isRu: boolean) {
  const { fearGreed, altSeason } = data.components;
  const vol = data.volumeChangePct;
  const volPart = isRu
    ? `объём торгов ${vol < 0 ? 'на ' + Math.abs(vol).toFixed(1).replace('.', ',') + '% ниже' : vol > 0 ? 'на ' + vol.toFixed(1).replace('.', ',') + '% выше' : 'на уровне'} нормы для этого дня недели`
    : `trading volume ${vol < 0 ? Math.abs(vol).toFixed(1) + '% below' : vol > 0 ? vol.toFixed(1) + '% above' : 'at'} the norm for this weekday`;
  const moodPart = isRu
    ? fearGreed <= 25
      ? 'на рынке сильный страх'
      : fearGreed <= 45
        ? 'настроение осторожное'
        : fearGreed >= 75
          ? 'преобладает жадность'
          : 'настроение ровное'
    : fearGreed <= 25
      ? 'sentiment is deeply fearful'
      : fearGreed <= 45
        ? 'sentiment is cautious'
        : fearGreed >= 75
          ? 'greed dominates'
          : 'sentiment is level';
  const altPart = isRu
    ? altSeason <= 25
      ? 'капитал держится в биткоине'
      : altSeason >= 75
        ? 'капитал уходит в альткоины'
        : 'капитал распределён между биткоином и альткоинами'
    : altSeason <= 25
      ? 'capital is staying in Bitcoin'
      : altSeason >= 75
        ? 'capital is rotating into altcoins'
        : 'capital is split between Bitcoin and altcoins';

  return `${cap(volPart)}, ${moodPart}, ${altPart}.`;
}

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
