import type { Metadata } from 'next';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { GoogleAnalytics } from '@next/third-parties/google';
import { routing } from '@/i18n/routing';
import PriceTicker from '@/components/layout/PriceTicker';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import '../globals.css';

const BASE = 'https://cryptopulse.media';
const GA_ID = 'G-8YJT9B6XFV';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isRu = locale === 'ru';

  return {
    title: {
      default: isRu
        ? 'CryptoPulse.media — Новости криптовалют, аналитика и интервью'
        : 'CryptoPulse.media — Crypto News, Analysis & Interviews',
      template: '%s | CryptoPulse.media',
    },
    description: isRu
      ? 'Крипто-аналитика для простых людей простыми словами. Новости, статьи и интервью.'
      : 'Crypto intelligence for European investors. News, analysis, and interviews.',
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
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
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
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${BASE}/${locale}?search={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      },
    ],
  };

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
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
      <body suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
          <PriceTicker />
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </NextIntlClientProvider>
      </body>
      <GoogleAnalytics gaId={GA_ID} />
    </html>
  );
}

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }));
}
