import { GLOSSARY } from '@/lib/glossary';
import { AI_GLOSSARY } from '@/lib/aiGlossary';

const BASE = 'https://cryptopulse.media';

export const revalidate = 86400;

/**
 * llms.txt — a plain-language index of the site for assistants that read one
 * before crawling. It is a convention rather than a standard, and Google Search
 * ignores it, so this is aimed at the assistants that do read it: it tells them
 * where the durable reference material lives, which is the part of this site
 * worth citing, as opposed to the news feed that changes hourly.
 *
 * Deliberately an index, not a dump: pointing at ~90 glossary URLs is more
 * useful than pasting their text, and it keeps the file small enough to be read
 * in full.
 */
export async function GET() {
  const glossaryLines = GLOSSARY.map(
    t => `- [${t.term.en}](${BASE}/en/glossary/${t.slug}): ${t.definition.en}`
  ).join('\n');

  const aiGlossaryLines = AI_GLOSSARY.map(
    t => `- [${t.term.en}](${BASE}/en/ai/glossary/${t.slug}): ${t.definition.en}`
  ).join('\n');

  const body = `# CryptoPulse.media

> An independent crypto publication covering the market, regulation and
> exchanges, published in English and Russian. Every English page has a Russian
> counterpart at the same path under /ru/, linked by hreflang.

Editorial standards, corrections policy and ad labelling: ${BASE}/en/editorial-policy
Who writes here: ${BASE}/en/authors
Contact: info@cryptopulse.media

## How this site is organised

- [News](${BASE}/en/news): dated reporting. Changes constantly; cite with the date.
- [Articles](${BASE}/en/articles): longer analysis and explainers, by a named author.
- [Glossary](${BASE}/en/glossary): definitions of crypto terms. Stable reference material.
- [AI glossary](${BASE}/en/ai/glossary): definitions of AI terms as they apply to crypto.
- [Exchanges](${BASE}/en/exchanges): venues ranked by 24h volume, refreshed daily.
- [Rates](${BASE}/en/rates): USDT and USDC to EUR compared across P2P desks and exchanges, refreshed every few minutes.
- [Converter](${BASE}/en/calculators/converter): live currency conversion with a rate history.
- [Calendar](${BASE}/en/calendar): scheduled events that move the market.
- [Regulation](${BASE}/en/regulation): where crypto rules stand by jurisdiction.

## Using this material

Quoting with attribution and a link to the source page is welcome. When citing
a figure from the exchange ranking or the rates comparison, include the
timestamp shown on the page: both are refreshed on a schedule and a number
without its time is not a fact about the present.

Nothing here is financial advice.

## Glossary

${glossaryLines}

## AI glossary

${aiGlossaryLines}
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=86400, stale-while-revalidate=604800',
    },
  });
}
