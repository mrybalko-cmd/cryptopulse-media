# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: someone choosing a jurisdiction to move to or operate from. They arrive
comparing countries — what tax they would pay, whether a licence is needed, what
is restricted — and they are deciding, not browsing.

Secondary: a reader arriving from search with a single question about one
country ("is crypto banned in China"), who reads one answer and leaves.

Both read Russian or English; the two audiences are served by separate texts,
not by a translation of one into the other.

## Product Purpose

Intokened.com is a crypto and AI publication for European investors, published in
Russian and English. Its regulation section answers where cryptocurrency is
legal, restricted or banned across 46 countries, with ten of those countries
carrying a full guide of their own.

Success for the regulation surface is two things at once: search traffic on
regulation questions, and readers moving from the map into the country guides.

## Positioning

The data is maintained and verified by the editorial team against regulator
sources rather than aggregated from other trackers. Every country carries the
regulator's name, a link to the source, and the date it was last checked, and
those dates are shown to the reader.

## Operating Context

Content lives in Sanity and is edited through the site's own admin at
`/admin/regulation`; no code change is needed to correct a country, add a guide,
or publish a new one. The section sits inside a wider site — news, articles,
exchange reviews, rates, calculators, glossary — and shares its navigation,
"Most read" rail and banner slot with those pages.

## Capabilities and Constraints

- 46 countries, each with: status (legal / restricted / banned / grey zone),
  short summary, details, tax note, one notable fact, regulator name, source
  URL, region, and a verification date.
- 10 of the 46 have long guides at `/regulation/<slug>` in both languages,
  opened by a per-country flag rather than by code.
- Map geometry comes from Natural Earth at 1:110m. Singapore has no outline at
  that scale and is drawn as a marker; a handful of other small countries need
  invisible click targets.
- Region membership is a field on the country, not a list in a component.
- The zero-tax distinction is not yet a field: six countries qualify, but two of
  them (Germany, Portugal) only after a holding period. Any filter on it needs
  its own field before it can be trusted.

## Brand Commitments

- Name and wordmark: Intokened.com.
- The world map stays the section's main element; it may not be reduced to a
  small illustration beside something else.
- The long reference text below the map stays. It earns search traffic and is
  the reason several countries have any text on the page at all.
- The site's existing design system is the world this surface belongs to; the
  three pages the owner holds as the standard are `/assets`, `/rates` and
  `/exchanges`.

## Evidence on Hand

- 46 verified country records with regulator sources and check dates, all
  re-verified in August 2026.
- 10 long country guides, 700–1000 words per language, each with sources,
  a timeline and five questions.
- An archive of the publication's own news and articles, used for real
  interlinking from country pages.
- No user research, analytics segments or conversion data have been established
  for this surface; future work must not invent them.

## Product Principles

1. Every claim carries a source and the date it was checked, and the reader sees
   the date.
2. Anything the editors will want to change is editable without a deploy.
3. The answer comes before the browsing: a reader with one question should not
   have to find themselves on a map first.
4. Both languages are written, never machine-translated from the other.
5. The map is the evidence; the country guides are the depth. Neither replaces
   the other.
