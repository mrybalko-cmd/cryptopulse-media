import Script from 'next/script';

/**
 * Google Reader Revenue Manager, Subscribe with Google Basic, configured as
 * open access (no paywall). It gives Google a structured signal about content
 * access for News and Discover.
 *
 * Rendered by article and news pages rather than by the root layout. The
 * snippet declares `type: "NewsArticle"`, which is true on a story and false on
 * the converter, the exchange ranking or the glossary — and it was loading
 * ~82 KB on all of them to say so.
 */
export default function SwgBasic({ locale }: { locale: string }) {
  return (
    <>
      <Script async src="https://news.google.com/swg/js/v1/swg-basic.js" strategy="lazyOnload" />
      <Script id="swg-basic-init" strategy="lazyOnload">
        {`(self.SWG_BASIC = self.SWG_BASIC || []).push(basicSubscriptions => {
          basicSubscriptions.init({
            type: "NewsArticle",
            isPartOfType: ["Product"],
            isPartOfProductId: "CAow3cm3DA:openaccess",
            clientOptions: { theme: "light", lang: "${locale}" },
          });
        });`}
      </Script>
    </>
  );
}
