import type { ExchangeRaw } from '@/lib/sanity';
import { formatVolume } from './exchangePresentation';

type Props = {
  isRu: boolean;
  venueCount: number;
  /** Combined 24h volume across every venue on the page, in dollars. */
  totalVolume: number;
  licensedCount: number;
  /** Highest volume on the page, partner placements included. */
  leader?: ExchangeRaw;
  /** Top of the neutral ranking, which is a different venue when a partner leads. */
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
export default function ExchangeRankingNotes({
  isRu, venueCount, totalVolume, licensedCount, leader, runnerUp,
}: Props) {
  const total = formatVolume(totalVolume);
  const leadShare =
    leader?.volume24h && totalVolume > 0
      ? Math.round((leader.volume24h / totalVolume) * 100)
      : null;
  const multiple =
    leader?.volume24h && runnerUp?.volume24h && runnerUp.volume24h > 0
      ? (leader.volume24h / runnerUp.volume24h).toFixed(1).replace(/\.0$/, '')
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
              {venueCount} площадок в рейтинге дают <b className="text-foreground font-semibold">{total}</b> оборота
              за сутки.
              {leader && leadShare != null && (
                <> На {leader.name} приходится <b className="text-foreground font-semibold">{formatVolume(leader.volume24h)}</b>, это {leadShare}% всего объёма
                  {multiple && runnerUp ? <> и в {multiple} раза больше, чем у следующей по обороту {runnerUp.name}</> : null}.
                </>
              )}{' '}
              Лицензию хотя бы в одной европейской юрисдикции подтвердили{' '}
              <b className="text-foreground font-semibold">{licensedCount}</b> из {venueCount}.
            </>
          ) : (
            <>
              The {venueCount} venues listed here turn over <b className="text-foreground font-semibold">{total}</b> between
              them in 24 hours.
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
            ? 'Таблица сортируется строго по обороту за последние 24 часа. Цифры приходят из публичных API самих площадок и обновляются раз в сутки — время последнего обновления стоит под заголовком страницы. Оборот показывает, насколько площадка ликвидна: чем он выше, тем меньше вы теряете на проскальзывании в крупной сделке.'
            : 'The table sorts strictly by volume over the last 24 hours. The figures come from each venue’s own public API and refresh once a day; the time of the last refresh sits under the page heading. Volume is a read on liquidity: the higher it is, the less a large order costs you in slippage.'}
        </p>

        <p>
          {isRu
            ? 'Партнёрские размещения вынесены в отдельный блок над таблицей и помечены плашкой. В самом рейтинге их нет — оплаченное место не смешивается с нейтральной сортировкой, поэтому таблица показывает порядок, который даёт только оборот.'
            : 'Partner placements sit in their own block above the table and carry a label. They are not in the ranking itself: a paid slot never mixes into the neutral sort, so the table shows the order volume alone produces.'}
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
