import type { ReactNode } from 'react';
import CoinPageShell, { type CoinQuote } from './CoinPageShell';
import { coinMeta } from '@/lib/coinRegistry';
import { fetchCoinHistory, fetchCoinMarket, startOptions } from '@/lib/coinMarket';
import type { CoinGuideData } from '@/lib/coinGuides';

/**
 * Data-fetching wrapper around CoinPageShell.
 *
 * Kept as a separate component so every /assets page — the ten that already
 * shared a layout and the fourteen that each carried their own — enters
 * through one door. All it does is fetch the live quote and the year of
 * closes; everything visual lives in the shell.
 *
 * `icon` and `coingeckoId` are still accepted and ignored: the logo now comes
 * from the market feed and the CoinGecko id from the registry, which is what
 * fixed three pages that had been querying the wrong coin's prices.
 */
export default async function CoinGuideLayout({
  locale,
  slug,
  tagline,
  historyTitle,
  historyContent,
  guide,
  quotes,
}: {
  locale: string;
  slug: string;
  name?: string;
  symbol?: string;
  icon?: string;
  coingeckoId?: string;
  tagline: string;
  historyTitle: string;
  historyContent: ReactNode;
  guide: CoinGuideData;
  quotes?: CoinQuote[];
}) {
  const meta = coinMeta(slug);
  if (!meta) return null;

  const [market, history] = await Promise.all([fetchCoinMarket(slug), fetchCoinHistory(slug)]);

  return (
    <CoinPageShell
      locale={locale}
      meta={meta}
      market={market}
      history={history}
      startOptions={startOptions(history)}
      tagline={tagline}
      facts={guide.stats}
      reference={guide.investmentReference}
      historyTitle={historyTitle}
      historyContent={historyContent}
      quotes={quotes}
      faq={guide.faq}
      glossaryTerms={guide.glossaryTerms}
    />
  );
}
