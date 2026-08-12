import type { ReactNode } from 'react';
import CoinPageShell, { type CoinQuote } from './CoinPageShell';
import { coinMeta } from '@/lib/coinRegistry';
import { fetchCoinMarket } from '@/lib/coinMarket';
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

  // Only the quote is fetched here, and it is batched across the whole
  // registry. History is loaded by the calculator after paint.
  const market = await fetchCoinMarket(slug);

  return (
    <CoinPageShell
      locale={locale}
      slug={slug}
      meta={meta}
      market={market}
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
