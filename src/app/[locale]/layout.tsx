import type { Metadata } from 'next';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getMessages, setRequestLocale} from 'next-intl/server';
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
        <GoogleAnalytics gaId={GA_ID} />
      </body>
    </html>
  );
}

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }));
}
