import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { ReactNode } from 'react';
import type { FearGreedData } from '@/lib/feargreed';
import type { AltcoinSeasonData } from '@/lib/altcoinSeason';
import type { PulseData } from '@/lib/pulse';
import { zoneMeta } from '@/lib/pulseMath';
import { SITE_BRAND } from '@/lib/site';

/**
 * «Рынок сейчас» — три показателя тремя отдельными карточками.
 *
 * Раньше они лежали в одной сетке на три колонки и выглядели равными, хотя
 * равными не являются: Пульс мы считаем сами и держим по нему историю за
 * девяносто дней, а страх и жадность с альткоин-сезоном заимствуем, и каждый
 * меряет по одной стороне. Поэтому Пульс занимает левую половину и ведёт, а
 * два остальных стоят компактными карточками справа.
 *
 * Каждая карточка — ссылка целиком, а не блок со ссылкой внутри: читатель
 * целится в виджет, а не в слова под ним. По той же причине строка «открыть»
 * набрана белым — акцентная ссылка обещала бы, что нажимать надо именно по
 * ней.
 */

interface Props {
  locale: string;
  fearGreed: FearGreedData | null;
  altcoin: AltcoinSeasonData | null;
  pulse: PulseData | null;
}

const FNG_LABELS: Record<string, { ru: string; en: string }> = {
  'Extreme Fear': { ru: 'Крайний страх', en: 'Extreme Fear' },
  Fear: { ru: 'Страх', en: 'Fear' },
  Neutral: { ru: 'Нейтрально', en: 'Neutral' },
  Greed: { ru: 'Жадность', en: 'Greed' },
  'Extreme Greed': { ru: 'Крайняя жадность', en: 'Extreme Greed' },
};

const ALT_LABELS: Record<AltcoinSeasonData['classification'], { ru: string; en: string }> = {
  bitcoin: { ru: 'Сезон биткоина', en: 'Bitcoin season' },
  neutral: { ru: 'Нейтрально', en: 'Neutral' },
  altcoin: { ru: 'Сезон альткоинов', en: 'Altcoin season' },
};

function fngColor(v: number) {
  return v <= 24 ? '#e5534b' : v <= 44 ? '#f0883e' : v <= 55 ? '#d29922' : v <= 74 ? '#3fb950' : '#2ea043';
}
function altColor(v: number) {
  return v <= 25 ? '#f0883e' : v <= 74 ? '#d29922' : '#8b5cf6';
}

/** Общая оболочка: стекло, ореол за ним, строка «открыть» внизу. */
function Card({
  href, children, footer, cta, halo,
}: {
  href: string;
  children: ReactNode;
  /** Слева в нижней строке — откуда число. */
  footer: string;
  cta: string;
  halo: string;
}) {
  return (
    <Link
      href={href}
      className="group relative flex flex-col overflow-hidden rounded-[15px] border border-[var(--glass-edge)]
                 bg-[var(--glass-clear)] p-[17px] shadow-[var(--glass-shadow),inset_0_1px_0_var(--glass-edge-lit)]
                 backdrop-blur-[22px] backdrop-saturate-150 transition-[transform,border-color,box-shadow]
                 hover:-translate-y-0.5 hover:border-[var(--glass-edge-lit)]
                 motion-reduce:transform-none motion-reduce:transition-none"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -left-[12%] -top-[22%] h-[86%] w-[72%] blur-[36px]"
        style={{ background: `radial-gradient(50% 50% at 50% 50%, ${halo}, transparent 70%)` }}
      />
      <span className="relative flex flex-1 flex-col">{children}</span>
      <span className="relative mt-auto flex items-center justify-between gap-2 pt-3">
        <span className="font-mono text-[10px] text-muted">{footer}</span>
        <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-[11.5px] font-semibold text-foreground">
          {cta}
          <ArrowRight
            size={11}
            className="transition-transform duration-200 ease-out group-hover:translate-x-[3px]
                       motion-reduce:transform-none motion-reduce:transition-none"
          />
        </span>
      </span>
    </Link>
  );
}

/** Горизонтальная шкала с меткой вместо круглого циферблата. */
function Scale({ gradient, at, label }: { gradient: string; at: number; label?: ReactNode }) {
  return (
    <>
      <span className="relative mt-[9px] mb-[6px] block h-[5px] rounded-full" style={{ background: gradient }}>
        <i
          className="absolute -top-1 block h-[13px] w-[3px] rounded-sm bg-white shadow-[0_0_0_2px_rgba(0,0,0,0.45)]"
          style={{ left: `${Math.min(Math.max(at, 0), 100)}%` }}
        />
      </span>
      {label}
    </>
  );
}

export default function MarketNow({ locale, fearGreed, altcoin, pulse }: Props) {
  const isRu = locale === 'ru';
  const loc = (isRu ? 'ru' : 'en') as 'ru' | 'en';
  if (!fearGreed && !altcoin && !pulse) return null;

  const zone = pulse ? zoneMeta(pulse.zone) : null;
  const history = pulse?.history ?? [];
  const fngDelta =
    fearGreed && typeof fearGreed.weekAgo === 'number' ? fearGreed.value - fearGreed.weekAgo : null;

  return (
    <div className="grid gap-3 lg:grid-cols-[1.08fr_1fr]">
      {pulse && zone && (
        <Card
          href={`/${locale}/pulse`}
          halo="var(--halo-violet)"
          footer={isRu ? 'наш расчёт' : 'our own index'}
          cta={isRu ? 'Открыть Пульс' : 'Open Pulse'}
        >
          <span className="mb-0.5 flex items-center gap-2">
            <b className="text-[13px] font-extrabold text-foreground">{isRu ? 'Пульс рынка' : 'Market Pulse'}</b>
            <span className="rounded-full border border-[#c084fc]/35 px-[7px] py-1 text-[9px] font-extrabold uppercase tracking-[0.11em] text-[#c084fc]">
              {isRu ? `индекс ${SITE_BRAND}` : `${SITE_BRAND} index`}
            </span>
          </span>

          <span className="mt-2 mb-0.5 flex items-baseline gap-2.5">
            <b className="bg-[linear-gradient(100deg,#c084fc,#8b5cf6_55%,#6366f1)] bg-clip-text text-[54px] font-black leading-none -tracking-[0.045em] tabular-nums text-transparent">
              {pulse.score}
            </b>
            <em className="text-[15px] font-extrabold not-italic text-foreground">{isRu ? zone.ru : zone.en}</em>
          </span>

          <p className="mt-1 mb-3 text-[12.5px] leading-relaxed text-muted">
            {isRu ? zone.ruDesc : zone.enDesc}
          </p>

          <span className="relative mb-[5px] block h-[6px] rounded-full bg-[linear-gradient(90deg,#2563eb,#22d3ee_28%,#a855f7_72%,#ec4899)]">
            <u className="absolute -top-px bottom-[-1px] left-1/2 block w-px bg-white/55" />
            <i
              className="absolute -top-1 block h-[14px] w-[3px] rounded-sm bg-white shadow-[0_0_0_2px_rgba(0,0,0,0.45)]"
              style={{ left: `${Math.min(Math.max(pulse.score, 0), 100)}%` }}
            />
          </span>
          <span className="mb-3 flex justify-between text-[9.5px] text-muted">
            <span>{isRu ? '0 — заморозка' : '0 — frozen'}</span>
            <span>{isRu ? '50 — норма' : '50 — normal'}</span>
            <span>{isRu ? '100 — пик' : '100 — peak'}</span>
          </span>

          {history.length > 1 && (
            <>
              <span className="mt-auto flex h-[44px] items-end gap-[2px]">
                {history.map((d, i) => (
                  <i
                    key={d.date}
                    className="block flex-1 rounded-t-sm bg-[linear-gradient(180deg,#c084fc,#7c3aed)]"
                    style={{ height: `${Math.max(8, d.score)}%`, opacity: i === history.length - 1 ? 1 : 0.8 }}
                  />
                ))}
              </span>
              <span className="mt-1.5 block text-[10px] text-muted">
                {isRu ? `${history.length} дней истории` : `${history.length} days of history`}
              </span>
            </>
          )}
        </Card>
      )}

      <div className="flex flex-col gap-3">
        {fearGreed && (
          <Card
            href={`/${locale}/fear-greed`}
            halo="var(--halo-cyan)"
            footer="alternative.me"
            cta={isRu ? 'Открыть индекс' : 'Open the index'}
          >
            <span className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
              <b className="text-[12.5px] font-bold text-foreground">
                {isRu ? 'Страх и жадность' : 'Fear & Greed'}
              </b>
              {fngDelta !== null && fngDelta !== 0 && (
                <span
                  className="text-[10.5px] font-bold tabular-nums"
                  style={{ color: fngDelta > 0 ? 'var(--positive)' : 'var(--negative)' }}
                >
                  {fngDelta > 0 ? '+' : '−'}
                  {Math.abs(fngDelta)} {isRu ? 'за неделю' : 'in a week'}
                </span>
              )}
              <span
                className="ml-auto text-[22px] font-black leading-none -tracking-[0.03em] tabular-nums"
                style={{ color: fngColor(fearGreed.value) }}
              >
                {fearGreed.value}
              </span>
            </span>

            <Scale
              gradient="linear-gradient(90deg,#e5534b,#f0883e 30%,#d29922 52%,#3fb950 78%,#2ea043)"
              at={fearGreed.value}
              label={
                <span className="block text-[11px] font-extrabold" style={{ color: fngColor(fearGreed.value) }}>
                  {FNG_LABELS[fearGreed.classification]?.[loc] ?? fearGreed.classification}
                </span>
              }
            />

            <p className="mt-1.5 text-[11.5px] leading-relaxed text-muted">
              {fearGreed.value <= 44
                ? isRu
                  ? 'Ниже 45 рынок живёт осторожностью — исторически такие периоды совпадали с локальными минимумами цены.'
                  : 'Below 45 the market runs on caution — historically these stretches lined up with local price bottoms.'
                : fearGreed.value <= 55
                  ? isRu
                    ? 'Рынок в равновесии: движения чаще определяются новостями, а не настроением.'
                    : 'The market sits in balance — moves come from news rather than mood.'
                  : isRu
                    ? 'Выше 55 начинается жадность: покупают охотнее, но и риск перегрева растёт.'
                    : 'Above 55 greed takes over — buying gets easier, and so does overheating.'}
            </p>
          </Card>
        )}

        {altcoin && (
          <Card
            href={`/${locale}/altcoin-season`}
            halo="var(--halo-pink)"
            footer={isRu ? 'наш расчёт · CoinGecko' : 'our calc · CoinGecko'}
            cta={isRu ? 'Открыть индекс' : 'Open the index'}
          >
            <span className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
              <b className="text-[12.5px] font-bold text-foreground">
                {isRu ? 'Альткоин-сезон' : 'Altcoin season'}
              </b>
              <span
                className="ml-auto text-[22px] font-black leading-none -tracking-[0.03em] tabular-nums"
                style={{ color: altColor(altcoin.index) }}
              >
                {altcoin.index}
              </span>
            </span>

            <Scale
              gradient="linear-gradient(90deg,#f0883e,#d29922 45%,#8b5cf6)"
              at={altcoin.index}
              label={
                <span className="block text-[11px] font-extrabold" style={{ color: altColor(altcoin.index) }}>
                  {ALT_LABELS[altcoin.classification][loc]}
                </span>
              }
            />

            <p className="mt-1.5 text-[11.5px] leading-relaxed text-muted">
              {isRu
                ? `${altcoin.index} из ${altcoin.sampleSize} монет обгоняют биткоин за 30 дней. Биткоин за тот же срок ${altcoin.btcChange30d >= 0 ? '+' : '−'}${Math.abs(altcoin.btcChange30d).toFixed(1).replace('.', ',')}%.`
                : `${altcoin.index} of ${altcoin.sampleSize} coins beat Bitcoin over 30 days. Bitcoin itself is ${altcoin.btcChange30d >= 0 ? 'up' : 'down'} ${Math.abs(altcoin.btcChange30d).toFixed(1)}% over the same stretch.`}
            </p>

            {/* Расчёт индекса уже возвращает лидеров — показывать одно число 65
                и выбрасывать список было расточительством. */}
            {altcoin.topOutperformers.length > 0 && (
              <span className="mt-2.5 flex flex-wrap gap-1.5">
                {altcoin.topOutperformers.slice(0, 4).map((c) => (
                  <span
                    key={c.id}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--glass-edge)]
                               bg-[var(--glass-clear-2)] px-[7px] py-1 text-[10.5px] font-bold text-foreground"
                  >
                    {c.symbol.toUpperCase()}
                    <u className="font-mono text-[10px] tabular-nums text-positive no-underline">
                      +{Math.round(c.marginVsBtc)}%
                    </u>
                  </span>
                ))}
              </span>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}
