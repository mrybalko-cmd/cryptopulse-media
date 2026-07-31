import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getMessages, setRequestLocale} from 'next-intl/server';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import { routing } from '@/i18n/routing';
import PriceTicker from '@/components/layout/PriceTicker';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import '../globals.css';

const BASE = 'https://cryptopulse.media';
const GA_ID = 'G-8YJT9B6XFV';
const AHREFS_KEY = '9PVWiRWYIPxrsY1xzgp+vA';

// Cyrillic subset is required — half the site's content is Russian, and
// without it Inter would silently fall back to the system font for RU text.
const inter = Inter({ subsets: ['latin', 'cyrillic'], variable: '--font-inter', display: 'swap' });

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const isRu = locale === 'ru';

  return {
    title: {
      default: isRu
        ? 'CryptoPulse.media — Новости криптовалют, аналитика и гиды по активам'
        : 'CryptoPulse.media — Crypto News, Analysis & Asset Guides',
      template: '%s | CryptoPulse.media',
    },
    // Kept under ~150 chars (both languages) — the previous AI-aware rewrite
    // ran to 170-179 chars, which Ahrefs flagged as "meta description too
    // long" on every page that falls back to this default (any route
    // without its own generateMetadata description).
    description: isRu
      ? 'Крипто- и AI-аналитика для простых людей простыми словами. Новости, статьи, гиды по активам, темы об ИИ и глоссарий терминов.'
      : 'Crypto & AI intelligence for European investors. Breaking news, deep analysis, asset guides, AI coverage, and a glossary — all in plain language.',
    metadataBase: new URL(BASE),
    alternates: {
      canonical: `${BASE}/${locale}`,
      languages: { ru: `${BASE}/ru`, en: `${BASE}/en`, 'x-default': `${BASE}/en` },
    },
    openGraph: {
      type: 'website',
      locale: isRu ? 'ru_RU' : 'en_US',
      alternateLocale: isRu ? 'en_US' : 'ru_RU',
      siteName: 'CryptoPulse.media',
      url: `${BASE}/${locale}`,
    },
    twitter: { card: 'summary_large_image' },
    // Default for indexable pages. A page-level `robots` (e.g. the noindex,
    // follow on paginated /page/[n] routes) replaces this wholesale rather
    // than merging — previously this was also a hardcoded <meta> tag in the
    // layout's raw <head>, which Next's metadata API can't see or dedupe,
    // so indexed and noindex pages alike ended up with two robots tags.
    robots: { 'max-snippet': -1, 'max-image-preview': 'large', 'max-video-preview': -1 },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${BASE}/#organization`,
        name: 'CryptoPulse.media',
        url: BASE,
      },
      {
        '@type': 'WebSite',
        '@id': `${BASE}/#website`,
        name: 'CryptoPulse.media',
        url: BASE,
        publisher: { '@id': `${BASE}/#organization` },
        inLanguage: locale,
      },
    ],
  };

  return (
    <html lang={locale} suppressHydrationWarning className={inter.variable}>
      <head>
        {/* Only preconnect to the image CDN (the LCP hero cover). GA/GTM and
            Subscribe-with-Google load lazily (below), so preconnecting to them
            up front is premature — it just trips PageSpeed's ">4 preconnects /
            unused preconnect" warning without helping. */}
        <link rel="preconnect" href="https://cdn.sanity.io" />
        <link rel="alternate" type="application/rss+xml" title="CryptoPulse.media" href="/rss.xml" />
        {/* Google Publisher Center — paste verification token from publishercenter.google.com into GOOGLE_PUBLISHER_CENTER_TOKEN env var */}
        {process.env.GOOGLE_PUBLISHER_CENTER_TOKEN && (
          <meta name="google-site-verification" content={process.env.GOOGLE_PUBLISHER_CENTER_TOKEN} />
        )}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='light'){document.documentElement.classList.add('light');}}catch(e){}})();`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Google Reader Revenue Manager — Subscribe with Google Basic,
            configured as open-access (no paywall). Gives Google a structured
            signal about content access for News/Discover; same snippet
            works across every page, only `lang` varies by locale. */}
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
      </head>
      <body suppressHydrationWarning className="overflow-x-clip">
        <NextIntlClientProvider messages={messages}>
          <PriceTicker />
          <Header />
          <main className="min-h-screen overflow-x-clip">
            {children}
          </main>
          <Footer />
        </NextIntlClientProvider>
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="lazyOnload" />
        <Script id="ga-init" strategy="lazyOnload">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}</Script>
        <Script src="https://analytics.ahrefs.com/analytics.js" data-key={AHREFS_KEY} strategy="lazyOnload" />
      </body>
    </html>
  );
}

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }));
}
