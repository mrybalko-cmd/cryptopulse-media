import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { CSSProperties, ReactNode } from 'react';
import { CATEGORY_COLOR, CATEGORY_LABELS, CATEGORY_LUCIDE, IMPORTANCE_META, tint } from '@/lib/calendarMeta';
import type { CalendarEvent } from '@/lib/sanity';
import { COINS, SECTOR_META, SECTOR_ORDER, type AssetSector } from '@/lib/coins';
import { COIN_REGISTRY } from '@/lib/coinRegistry';
import type { CoinPriceSnapshot } from '@/lib/coins';

/**
 * Справочники: календарь и криптоактивы.
 *
 * Третья полка страницы — то, за чем приходят один раз и с конкретным
 * вопросом, в отличие от показателей, которые смотрят каждый день. Карта
 * регуляции стоит рядом своим собственным компонентом и ничего здесь не
 * знает о соседях.
 *
 * Цвета и значки событий берутся из той же таблицы, что на странице
 * календаря, а кружок монеты — из её фирменного цвета в реестре: событие и
 * монета читаются одинаково в обоих местах.
 */

function Card({ href, title, meta, cta, children }: {
  href: string; title: string; meta: string; cta: string; children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group relative flex flex-col overflow-hidden rounded-[18px] border border-[var(--glass-edge)]
                 bg-[var(--glass-clear)] p-4 shadow-[var(--glass-shadow),inset_0_1px_0_var(--glass-edge-lit)]
                 backdrop-blur-[22px] backdrop-saturate-150 transition-[transform,border-color]
                 duration-200 ease-out hover:-translate-y-[3px] hover:border-[var(--glass-edge-lit)]
                 motion-reduce:transform-none motion-reduce:transition-none"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -left-[16%] -top-[16%] h-[62%] w-[74%] blur-[32px]"
        style={{ background: 'radial-gradient(50% 50% at 50% 50%, var(--halo-violet), transparent 70%)' }}
      />
      <span className="relative mb-2.5 flex items-baseline justify-between gap-2.5">
        <b className="text-[13px] font-extrabold text-foreground">{title}</b>
        <span className="shrink-0 font-mono text-[10.5px] text-muted">{meta}</span>
      </span>
      <span className="relative flex flex-1 flex-col">{children}</span>
      <span className="relative mt-auto inline-flex items-center gap-1.5 pt-3 text-[11.5px] font-semibold text-foreground">
        {cta}
        <ArrowRight
          size={11}
          className="transition-transform duration-200 ease-out group-hover:translate-x-[3px]
                     motion-reduce:transform-none motion-reduce:transition-none"
        />
      </span>
    </Link>
  );
}

/* ── Календарь ──────────────────────────────────────────────────────── */

export function CalendarCard({ locale, events }: { locale: string; events: CalendarEvent[] }) {
  const isRu = locale === 'ru';
  const loc = (isRu ? 'ru' : 'en') as 'ru' | 'en';
  if (events.length === 0) return null;

  const fmt = new Intl.DateTimeFormat(isRu ? 'ru-RU' : 'en-GB', { day: 'numeric', month: 'short' });

  return (
    <Card
      href={`/${locale}/calendar`}
      title={isRu ? 'Криптокалендарь' : 'Crypto calendar'}
      meta={isRu ? `${events.length} ближайших` : `next ${events.length}`}
      cta={isRu ? 'Весь календарь' : 'Full calendar'}
    >
      {events.map((e) => {
        const color = CATEGORY_COLOR[e.category] ?? CATEGORY_COLOR.other;
        const Icon = CATEGORY_LUCIDE[e.category] ?? CATEGORY_LUCIDE.other;
        const dots = IMPORTANCE_META[e.importance]?.dots ?? 1;
        return (
          <span key={e._id} className="flex gap-2.5 border-b border-[var(--glass-edge)] py-2.5 last:border-b-0">
            <span
              className="grid h-[26px] w-[26px] shrink-0 place-items-center rounded-lg"
              style={{ color, background: tint(color, 0.15), border: `1px solid ${tint(color, 0.34)}` } as CSSProperties}
            >
              <Icon size={13} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="mb-[3px] flex items-center gap-[7px]">
                <time className="shrink-0 font-mono text-[10px] font-bold text-muted" dateTime={e.date}>
                  {fmt.format(new Date(e.date))}
                </time>
                <em
                  className="whitespace-nowrap text-[8.5px] font-extrabold uppercase not-italic tracking-[0.07em]"
                  style={{ color }}
                >
                  {CATEGORY_LABELS[e.category]?.[loc] ?? CATEGORY_LABELS.other[loc]}
                </em>
                {/* Три точки важности — те же, что в списке на странице календаря */}
                <span className="ml-auto flex shrink-0 gap-[2px]" aria-hidden>
                  {[0, 1, 2].map((i) => (
                    <i
                      key={i}
                      className="block h-1 w-1 rounded-full"
                      style={{
                        background:
                          i < dots
                            ? dots === 3
                              ? 'var(--negative)'
                              : dots === 2
                                ? '#e0ab3a'
                                : 'var(--muted)'
                            : 'var(--border)',
                      }}
                    />
                  ))}
                </span>
              </span>
              <span className="block text-[11.5px] font-semibold leading-snug text-foreground">
                {e.title[loc] || e.title.en}
              </span>
            </span>
          </span>
        );
      })}
    </Card>
  );
}

/* ── Криптоактивы ───────────────────────────────────────────────────── */

/**
 * Фирменные цвета двух монет в реестре почти чёрные: XRP #23292F и Cardano
 * #0033AD. На тёмном фоне кружок такого цвета не виден вовсе, поэтому для
 * тёмной темы у них своя пара значений. Страницам монет это не касается —
 * там цвет работает ореолом на большой площади.
 */
const DARK_SAFE: Record<string, string> = { xrp: '#8f98a3', ada: '#3468d1' };

export function AssetsCard({
  locale,
  prices,
}: {
  locale: string;
  prices: Record<string, CoinPriceSnapshot>;
}) {
  const isRu = locale === 'ru';
  const loc = (isRu ? 'ru' : 'en') as 'ru' | 'en';
  /** Чем дороже монета, тем меньше знаков: «$2 702,96» не влезает в плитку
   *  шириной 160 px, а «$0,1» без знаков превращается в ноль. */
  const price = (v: number) =>
    new Intl.NumberFormat(isRu ? 'ru-RU' : 'en-US', {
      maximumFractionDigits: v >= 1000 ? 0 : v >= 1 ? 2 : 3,
    }).format(v);

  const shown = COINS.filter((c) => prices[c.coingeckoId]).slice(0, 8);
  const sectors = SECTOR_ORDER.map((s) => ({
    key: s,
    count: COINS.filter((c) => c.sector === s).length,
  })).filter((s) => s.count > 0);

  return (
    <Card
      href={`/${locale}/assets`}
      title={isRu ? 'Криптоактивы' : 'Crypto assets'}
      meta={isRu ? `${COINS.length} монет` : `${COINS.length} coins`}
      cta={isRu ? 'Все активы' : 'All assets'}
    >
      {shown.length > 0 && (
        <span className="mb-3 grid grid-cols-2 gap-1.5">
          {shown.map((c) => {
            const p = prices[c.coingeckoId];
            const up = (p.price_change_percentage_24h ?? 0) >= 0;
            return (
              <span
                key={c.slug}
                className="flex min-w-0 items-center gap-1.5 overflow-hidden rounded-[9px]
                           border border-[var(--glass-edge)] bg-[var(--glass-clear-2)] px-2 py-1.5"
                style={{ '--c': DARK_SAFE[c.slug] ?? COIN_REGISTRY[c.slug]?.color ?? '#8f98a3' } as CSSProperties}
              >
                <i
                  aria-hidden
                  className="block h-[9px] w-[9px] shrink-0 rounded-full bg-[var(--c)]
                             shadow-[0_0_0_3px_color-mix(in_srgb,var(--c)_22%,transparent)]"
                />
                <b className="shrink-0 text-[10.5px] font-extrabold text-foreground">{c.symbol}</b>
                <u className="ml-auto min-w-0 truncate font-mono text-[10px] tabular-nums text-muted no-underline">
                  ${price(p.current_price)}
                </u>
                <em
                  className="shrink-0 font-mono text-[9.5px] font-bold tabular-nums not-italic"
                  style={{ color: up ? 'var(--positive)' : 'var(--negative)' }}
                >
                  {up ? '+' : '−'}
                  {Math.abs(p.price_change_percentage_24h ?? 0).toFixed(1)}%
                </em>
              </span>
            );
          })}
        </span>
      )}

      <span className="mb-3 flex flex-wrap gap-1.5">
        {sectors.slice(0, 4).map((s) => (
          <span
            key={s.key}
            className="inline-flex items-center gap-1.5 rounded-md px-[7px] py-1 text-[10px] font-semibold text-muted"
            style={{
              border: `1px solid ${tint(SECTOR_META[s.key as AssetSector].color, 0.3)}`,
              background: tint(SECTOR_META[s.key as AssetSector].color, 0.11),
            }}
          >
            {SECTOR_META[s.key as AssetSector].label[loc]}
            <b className="font-extrabold tabular-nums text-foreground">{s.count}</b>
          </span>
        ))}
        {sectors.length > 4 && (
          <span className="inline-flex items-center rounded-md border border-[var(--glass-edge)] bg-[var(--glass-clear-2)] px-[7px] py-1 text-[10px] font-semibold text-muted">
            {isRu ? `и ещё ${sectors.length - 4}` : `+${sectors.length - 4} more`}
          </span>
        )}
      </span>

      <span className="block text-[11px] leading-relaxed text-muted">
        {isRu
          ? 'Цена, объём, годовой график и разбор по каждой монете: что это, кто стоит за проектом, чем отличается.'
          : 'Price, volume, a year of history and a write-up for every coin: what it is, who is behind it, how it differs.'}
      </span>
    </Card>
  );
}
