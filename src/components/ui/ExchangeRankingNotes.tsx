import type { ExchangeRaw } from '@/lib/sanity';
import { formatVolume } from './exchangePresentation';

type Props = {
  isRu: boolean;
  venueCount: number;
  /** Combined 24h volume across every venue on the page, in dollars. */
  totalVolume: number;
  licensedCount: number;
  /** Highest volume on the page. */
  leader?: ExchangeRaw;
  /** Second by volume. */
  runnerUp?: ExchangeRaw;
};

/**
 * The explanatory text under the ranking.
 *
 * It exists because the page had no prose whatsoever: the table is real data,
 * but boilerplate-stripping extraction returned about 53 words of page chrome,
 * so there was nothing here for a search engine or an assistant to quote. It
 * also says out loud two things the table can only imply — why paid placements
 * are not in the ranking, and what an empty licence cell means.
 *
 * Every figure is derived from the same values the table renders, so the prose
 * cannot drift away from the numbers above it.
 */
function volumeRu(v: number | null | undefined): string {
  if (!v) return '—';
  return v >= 1e9
    ? `$${(v / 1e9).toFixed(1).replace('.', ',')} млрд`
    : `$${Math.round(v / 1e6)} млн`;
}

export default function ExchangeRankingNotes({
  isRu, venueCount, totalVolume, licensedCount, leader, runnerUp,
}: Props) {
  const total = isRu ? volumeRu(totalVolume) : formatVolume(totalVolume);
  const leadShare =
    leader?.volume24h && totalVolume > 0
      ? Math.round((leader.volume24h / totalVolume) * 100)
      : null;
  const multiple =
    leader?.volume24h && runnerUp?.volume24h && runnerUp.volume24h > 0
      ? (leader.volume24h / runnerUp.volume24h).toFixed(1).replace(/\.0$/, '').replace('.', isRu ? ',' : '.')
      : null;

  return (
    <section className="mt-8 pt-6 border-t border-border">
      <h2 className="text-lg sm:text-xl font-extrabold text-foreground -tracking-[0.02em] mb-3">
        {isRu ? 'Как устроен этот рейтинг' : 'How this ranking works'}
      </h2>

      <div className="flex flex-col gap-3 text-[14.5px] leading-[1.75] text-muted max-w-[72ch]">
        <p>
          {isRu ? (
            <>
              {venueCount} площадок в рейтинге дают <b className="text-foreground font-semibold">{total}</b> спотового
              оборота за сутки.
              {leader && leadShare != null && (
                <> На {leader.name} приходится <b className="text-foreground font-semibold">{volumeRu(leader.volume24h)}</b>, это {leadShare}% всего объёма
                  {multiple && runnerUp ? <> и в {multiple} раза больше, чем у следующей по обороту {runnerUp.name}</> : null}.
                </>
              )}{' '}
              Лицензию хотя бы в одной европейской юрисдикции подтвердили{' '}
              <b className="text-foreground font-semibold">{licensedCount}</b> из {venueCount}.
            </>
          ) : (
            <>
              The {venueCount} venues listed here turn over <b className="text-foreground font-semibold">{total}</b> in spot
              volume between them in 24 hours.
              {leader && leadShare != null && (
                <> {leader.name} accounts for <b className="text-foreground font-semibold">{formatVolume(leader.volume24h)}</b> of that, or {leadShare}%
                  {multiple && runnerUp ? <>, and {multiple} times the volume of {runnerUp.name} behind it</> : null}.
                </>
              )}{' '}
              <b className="text-foreground font-semibold">{licensedCount}</b> of the {venueCount} hold a licence in at
              least one European jurisdiction.
            </>
          )}
        </p>

        <p>
          {isRu
            ? 'Место считается только по спотовому обороту за последние 24 часа, деривативы не учитываются. Цифры приходят из CoinGecko и обновляются раз в сутки, время обновления стоит под заголовком страницы. Оборот показывает, насколько площадка ликвидна: чем он выше, тем меньше вы теряете на проскальзывании в крупной сделке.'
            : 'A venue’s place depends only on its spot volume over the last 24 hours; derivatives are not counted. The figures come from CoinGecko and refresh once a day, and the time of the last refresh sits under the page heading. Volume is a read on liquidity: the higher it is, the less a large order costs you in slippage.'}
        </p>

        <p>
          {isRu
            ? 'Платное выделение строки и рекламный блок на номер места не влияют. Рекламный блок всегда подписан, а площадка из него стоит в таблице на том же месте, что и без рекламы.'
            : 'Paid row highlighting and the ad block have no effect on a venue’s number. The ad block is always labelled, and the venue it promotes sits in the table at the same place it would hold without the ad.'}
        </p>

        <p>
          {isRu
            ? 'Отметка о лицензии означает регистрацию или разрешение хотя бы в одной европейской юрисдикции. Пустая ячейка не значит, что площадка работает незаконно, — только то, что у нас нет подтверждённых данных по её статусу.'
            : 'A licence mark means registration or authorisation in at least one European jurisdiction. An empty cell does not mean a venue operates illegally, only that we hold no confirmed data on its status.'}
        </p>
      </div>
    </section>
  );
}
