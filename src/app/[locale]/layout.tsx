import type { Metadata } from 'next';
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
        ? 'CryptoPulse.media — Новости криптовалют, аналитика и интервью'
        : 'CryptoPulse.media — Crypto News, Analysis & Interviews',
      template: '%s | CryptoPulse.media',
    },
    description: isRu
      ? 'Крипто-аналитика для простых людей простыми словами. Актуальные новости, глубокие статьи, интервью с экспертами и глоссарий терминов криптовалют.'
      : 'Crypto intelligence for European investors. Breaking news, deep analysis, expert interviews, and a glossary of crypto terms — all in plain language.',
    metadataBase: new URL(BASE),
    alternates: {
      canonical: `${BASE}/${locale}`,
      languages: { ru: `${BASE}/ru`, en: `${BASE}/en` },
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
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://cdn.sanity.io" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
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
