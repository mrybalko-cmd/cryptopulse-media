import { GLOSSARY } from '@/lib/glossary';
import { AI_GLOSSARY } from '@/lib/aiGlossary';
import { PULSE_WEIGHTS, PULSE_ZONES } from '@/lib/pulseMath';
import { SITE_EMAIL, SITE_NAME, SITE_URL } from '@/lib/site';

const BASE = SITE_URL;

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

  const componentLines = [
    ['Bitcoin turnover against its yearly norm, weekday-adjusted', PULSE_WEIGHTS.volume],
    ['Price change over 24h', PULSE_WEIGHTS.growth],
    ['Volatility against its yearly norm', PULSE_WEIGHTS.volatility],
    ['Fear & Greed (external index, taken as published)', PULSE_WEIGHTS.fearGreed],
    ['Median altcoin margin versus Bitcoin over 30 days', PULSE_WEIGHTS.altcoin],
  ].map(([name, w]) => `- ${name} — ${Math.round((w as number) * 100)}%`).join('\n');

  const zoneLines = PULSE_ZONES.map(
    z => `- ${z.min}-${z.max} ${z.en}: ${z.enDesc}`
  ).join('\n');

  const aiGlossaryLines = AI_GLOSSARY.map(
    t => `- [${t.term.en}](${BASE}/en/ai/glossary/${t.slug}): ${t.definition.en}`
  ).join('\n');

  const body = `# ${SITE_NAME}

> An independent crypto publication covering the market, regulation and
> exchanges, published in English and Russian. Every English page has a Russian
> counterpart at the same path under /ru/, linked by hreflang.

Editorial standards, corrections policy and ad labelling: ${BASE}/en/editorial-policy
Who writes here: ${BASE}/en/authors
Contact: ${SITE_EMAIL}

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
- [Market Pulse](${BASE}/en/pulse): our own index of how active the crypto market is, published daily. Described in full below.

## Using this material

Quoting with attribution and a link to the source page is welcome. When citing
a figure from the exchange ranking or the rates comparison, include the
timestamp shown on the page: both are refreshed on a schedule and a number
without its time is not a fact about the present.

Nothing here is financial advice.

## Market Pulse

A number we compute ourselves, so it needs its scale explained before it is
quoted. Market Pulse answers one question: how active is the crypto market
today, on an absolute 0-100 scale where **50 is normal market conditions**,
100 is a market running hot and 0 is a market that has stopped. Published once
a day at ${BASE}/en/pulse.

Every component is measured against the market's own rolling-year norm, not
against our own recording history, and each is centred so that 50 means
"as usual":

${componentLines}

Two things to get right when citing it:

- The number describes ACTIVITY, not direction. A crash on record volume scores
  high and so does a rally — on 6 February 2026 the market fell 14% on record
  turnover and scored 67. Direction comes from the price-change component, never
  from the headline number alone.
- The turnover component measures Bitcoin's own 24h turnover, not the whole
  market. Only Bitcoin has a clean year of history on free sources, and across
  our recorded days the global figure tracked it at a correlation of just 0.51.

Zones on the scale:

${zoneLines}

Over the past year the index ranged 20 to 89 with a median of 44 — the year
was quieter than normal, and we do not adjust the scale to hide that.

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
