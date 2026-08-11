import Link from 'next/link';
import type { ExchangeRaw } from '@/lib/sanity';
import { exchangeHasLicense, exchangeHasProductCategory } from '@/lib/exchangeFilters';
import { ExchangeLogo, slugFor } from './exchangePresentation';

type Props = { exchanges: ExchangeRaw[]; locale: string };

/** A question, the rule that answers it, and where the rule's full result lives. */
type Pick = {
  q: string;
  /** Why this venue, in one line. Written from the rule, not about the brand. */
  a: string;
  /** Narrows the field; the winner is then the highest 24h volume among those. */
  filter: (e: ExchangeRaw) => boolean;
  /** Overrides the default "highest volume wins" when another order is the point. */
  rank?: (a: ExchangeRaw, b: ExchangeRaw) => number;
  href: string;
};

const volume = (e: ExchangeRaw) => e.volume24h ?? 0;

/**
 * "Which venue suits you" — the long tail of "best crypto exchange for X".
 *
 * Every answer is computed from a stated rule rather than chosen editorially,
 * so it stays true as the data moves and cannot quietly become an endorsement.
 * The rules only use fields the page already renders: licence badge, 24h
 * volume, founding year, product categories, venue type.
 *
 * Deliberately absent: anything about fees. The site holds no fee data and no
 * user ratings, so a "best for low fees" card would be an invented claim — and
 * that is the single most common question in this category.
 */
export default function ExchangePicks({ exchanges, locale }: Props) {
  const isRu = locale === 'ru';

  const picks: Pick[] = isRu
    ? [
        {
          q: 'Нужна площадка с лицензией в ЕС?',
          a: 'Из площадок с подтверждённой лицензией — с самым большим оборотом.',
          filter: exchangeHasLicense,
          href: '?license=1',
        },
        {
          q: 'Важно, чтобы биржа работала давно?',
          a: 'Старейшая из работающих площадок рейтинга.',
          filter: e => Boolean(e.foundedYear),
          rank: (a, b) => (a.foundedYear ?? 9999) - (b.foundedYear ?? 9999),
          href: '?sort=year',
        },
        {
          q: 'Нужен максимальный оборот?',
          a: 'Крупнейший оборот за сутки: чем он выше, тем меньше вы теряете на проскальзывании.',
          filter: () => true,
          href: '?sort=volume',
        },
        {
          q: 'Нужны не только спот, но и стейкинг или карта?',
          a: 'Самый широкий набор продуктов среди лицензированных площадок.',
          filter: e => exchangeHasLicense(e) && exchangeHasProductCategory(e, 'earn'),
          href: '?license=1&product=earn',
        },
        {
          q: 'Хотите завести деньги с карты?',
          a: 'Лицензированная площадка с прямым вводом фиата.',
          filter: e => exchangeHasLicense(e) && exchangeHasProductCategory(e, 'card'),
          href: '?license=1&product=card',
        },
        {
          q: 'Планируете покупать напрямую у людей?',
          a: 'Самая крупная P2P-площадка: больше объявлений — больше выбор контрагента.',
          filter: e => exchangeHasProductCategory(e, 'p2p'),
          href: '?product=p2p',
        },
      ]
    : [
        {
          q: 'Need a venue licensed in the EU?',
          a: 'The largest by volume among those with a confirmed licence.',
          filter: exchangeHasLicense,
          href: '?license=1',
        },
        {
          q: 'Want an exchange that has been around?',
          a: 'The oldest venue still operating in this ranking.',
          filter: e => Boolean(e.foundedYear),
          rank: (a, b) => (a.foundedYear ?? 9999) - (b.foundedYear ?? 9999),
          href: '?sort=year',
        },
        {
          q: 'Need the deepest liquidity?',
          a: 'The largest 24h volume: the higher it is, the less a trade costs you in slippage.',
          filter: () => true,
          href: '?sort=volume',
        },
        {
          q: 'Want staking or a card, not just spot?',
          a: 'The widest product range among licensed venues.',
          filter: e => exchangeHasLicense(e) && exchangeHasProductCategory(e, 'earn'),
          href: '?license=1&product=earn',
        },
        {
          q: 'Funding from a bank card?',
          a: 'A licensed venue that takes fiat directly.',
          filter: e => exchangeHasLicense(e) && exchangeHasProductCategory(e, 'card'),
          href: '?license=1&product=card',
        },
        {
          q: 'Buying peer to peer?',
          a: 'The largest P2P venue: more listings means more choice of counterparty.',
          filter: e => exchangeHasProductCategory(e, 'p2p'),
          href: '?product=p2p',
        },
      ];

  // A question with no answer in the current data is dropped rather than shown
  // with a blank: an unanswered question reads as broken, and the set of venues
  // is editable, so any rule can legitimately come up empty.
  const answered = picks
    .map(p => {
      const pool = exchanges.filter(p.filter);
      if (pool.length === 0) return null;
      const winner = [...pool].sort(p.rank ?? ((a, b) => volume(b) - volume(a)))[0];
      return { pick: p, winner };
    })
    .filter((x): x is { pick: Pick; winner: ExchangeRaw } => x !== null);

  if (answered.length < 3) return null;

  return (
    <section className="mt-8 pt-6 border-t border-border">
      <h2 className="text-lg sm:text-xl font-extrabold text-foreground -tracking-[0.02em] mb-1">
        {isRu ? 'Какая площадка подойдёт' : 'Which venue suits you'}
      </h2>
      <p className="text-sm text-muted leading-[1.7] max-w-[70ch] mb-4">
        {isRu
          ? 'Ответы считаются по данным рейтинга и меняются вместе с ним. Комиссии мы не сравниваем: этих данных у нас нет.'
          : 'The answers are computed from the ranking’s own data and move with it. We do not compare fees: we hold no fee data.'}
      </p>

      {/* Two sibling links per row rather than one wrapping the whole thing: the
          question leads to the filtered ranking, the venue leads to that venue's
          own review. Nesting them is invalid HTML — the parser closes the outer
          anchor and the inner one escapes its container. */}
      <div className="flex flex-col">
        {answered.map(({ pick, winner }) => (
          <div
            key={pick.q}
            className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_auto] gap-2 sm:gap-4 sm:items-center py-3.5 border-b border-border last:border-b-0"
          >
            <Link href={`/${locale}/exchanges${pick.href}`} className="group block">
              <span className="block text-[14.5px] font-bold text-foreground transition-colors group-hover:text-[var(--title-hover)]">
                {pick.q}
              </span>
              <span className="block text-xs text-muted leading-[1.55] mt-1">{pick.a}</span>
            </Link>

            <Link
              href={`/${locale}/exchanges/${slugFor(winner, locale)}`}
              className="group flex items-center gap-2 shrink-0 justify-self-start sm:justify-self-end"
              aria-label={isRu ? `Обзор ${winner.name}` : `${winner.name} review`}
            >
              <ExchangeLogo exchange={winner} size={26} />
              <span className="text-[13.5px] font-extrabold text-foreground transition-colors group-hover:text-[var(--title-hover)]">
                {winner.name}
              </span>
            </Link>
          </div>
        ))}
      </div>

      <p className="mt-3.5 text-[11.5px] text-muted leading-[1.6] max-w-[72ch]">
        {isRu
          ? 'Каждый ответ — это правило, а не редакционное мнение: площадка, которая лидирует по названному признаку среди тех, что есть в рейтинге. Нажатие открывает таблицу, отфильтрованную по тому же признаку.'
          : 'Each answer is a rule rather than an editorial opinion: the venue that leads on the stated criterion among those in the ranking. Following one opens the table filtered by that same criterion.'}
      </p>

    </section>
  );
}
