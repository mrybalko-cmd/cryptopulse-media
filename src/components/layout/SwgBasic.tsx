import Script from 'next/script';

/** Google News open-access product ID for this publication. */
export const SWG_PRODUCT_ID = 'CAow3cm3DA:openaccess';

/**
 * The open-access signal, written into our own article node.
 *
 * swg-basic.js also injects these properties client-side, but it writes them
 * into the FIRST `application/ld+json` script it finds — which on our pages is
 * the Organization/WebSite `@graph`. That leaves properties sitting beside
 * `@graph` (invalid per the JSON-LD spec) on a node that describes the
 * publication rather than the story. Declaring them here puts the signal on
 * the article itself, server-rendered, where crawlers that do not execute
 * JavaScript can also see it.
 */
export const openAccessMarkup = {
  isAccessibleForFree: true,
  isPartOf: { '@type': ['CreativeWork', 'Product'], productID: SWG_PRODUCT_ID },
} as const;

/**
 * Google Reader Revenue Manager, Subscribe with Google Basic, configured as
 * open access (no paywall). It gives Google a structured signal about content
 * access for News and Discover.
 *
 * Rendered by article and news pages rather than by the root layout: the
 * snippet declares a content type, which is meaningful on a story and false on
 * the converter, the exchange ranking or the glossary — and it was loading
 * ~82 KB on all of them to say so.
 *
 * `type` must match what the page's own JSON-LD declares. It used to be
 * hard-coded to "NewsArticle", so every /articles/ page — which declares
 * BlogPosting — ended up asserting two mutually exclusive content types for
 * one URL.
 */
export default function SwgBasic({ locale, type }: { locale: string; type: string }) {
  return (
    <>
      <Script async src="https://news.google.com/swg/js/v1/swg-basic.js" strategy="lazyOnload" />
      <Script id="swg-basic-init" strategy="lazyOnload">
        {`(self.SWG_BASIC = self.SWG_BASIC || []).push(basicSubscriptions => {
          basicSubscriptions.init({
            type: ${JSON.stringify(type)},
            isPartOfType: ["Product"],
            isPartOfProductId: ${JSON.stringify(SWG_PRODUCT_ID)},
            clientOptions: { theme: "light", lang: ${JSON.stringify(locale)} },
          });
        });`}
      </Script>
    </>
  );
}
