import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getMessages, setRequestLocale} from 'next-intl/server';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import { GoogleTagManager } from '@next/third-parties/google';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { routing } from '@/i18n/routing';
import PriceTicker from '@/components/layout/PriceTicker';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { organizationSchema, ORGANIZATION_ID } from '@/lib/organizationSchema';
import '../globals.css';
import { SITE_NAME, SITE_URL, TITLE_SUFFIX } from '@/lib/site';

const BASE = SITE_URL;
const GA_ID = 'G-8YJT9B6XFV';
const GTM_ID = 'GTM-K7FVWR42';
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
      /* Сокращение общего описания: первое предложение вместе с брендом даёт
         89 знаков, и поисковик обрезал бы его посреди слова. Единственное
         место, где текст приходится жать, и жмётся он до того же утверждения. */
      default: isRu
        ? 'Intokened.com — независимое медиа о крипте и ИИ'
        : 'Intokened.com — independent media on crypto and AI',
      template: `%s${TITLE_SUFFIX}`,
    },
    // Первые два предложения общего описания издания, дословно. Третье
    // («доверяем только первоисточникам») сюда не влезает: с ним выходит 243
    // знака, а всё длиннее двухсот поисковик обрезает на середине фразы.
    description: isRu
      ? 'Независимое международное медиа о криптовалютах и искусственном интеллекте. Мы переводим сложные технологические тренды на понятный язык, создавая материалы на английском и русском.'
      : 'An independent international media outlet on crypto and artificial intelligence. We turn complex technology trends into plain language, publishing in English and Russian.',
    metadataBase: new URL(BASE),
    alternates: {
      canonical: `${BASE}/${locale}`,
      languages: { ru: `${BASE}/ru`, en: `${BASE}/en`, 'x-default': `${BASE}/en` },
    },
    openGraph: {
      type: 'website',
      locale: isRu ? 'ru_RU' : 'en_US',
      alternateLocale: isRu ? 'en_US' : 'ru_RU',
      siteName: SITE_NAME,
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
      organizationSchema(locale),
      {
        '@type': 'WebSite',
        '@id': `${BASE}/#website`,
        name: SITE_NAME,
        url: BASE,
        publisher: { '@id': ORGANIZATION_ID },
        inLanguage: locale,
      },
    ],
  };

  return (
    <html lang={locale} suppressHydrationWarning className={inter.variable}>
      <head>
        {/* Only preconnect to the image CDN (the LCP hero cover). GA and Ahrefs
            load lazily below, so preconnecting to them up front is premature —
            it just trips PageSpeed's ">4 preconnects / unused preconnect"
            warning without helping. */}
        <link rel="preconnect" href="https://cdn.sanity.io" />
        <link rel="alternate" type="application/rss+xml" title={SITE_NAME} href="/rss.xml" />
        {/* Google Publisher Center — paste verification token from publishercenter.google.com into GOOGLE_PUBLISHER_CENTER_TOKEN env var */}
        {process.env.GOOGLE_PUBLISHER_CENTER_TOKEN && (
          <meta name="google-site-verification" content={process.env.GOOGLE_PUBLISHER_CENTER_TOKEN} />
        )}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='light'){document.documentElement.classList.add('light');}}catch(e){}})();`,
          }}
        />
      </head>
      <body suppressHydrationWarning className="overflow-x-clip">
        {/* Кадр для посетителя без JS — первым в body, как требует инструкция
            контейнера. Отслеживать им почти нечего: сам GTM и GA4 без JS не
            работают вовсе, срабатывают только теги-пиксели. Поставлен потому,
            что это часть штатной установки, а не ради данных. Домен добавлен
            в frame-src: без этого политика кадр молча отбивает. */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
            title="Google Tag Manager"
          />
        </noscript>
        <NextIntlClientProvider messages={messages}>
          <PriceTicker />
          <Header />
          <main className="min-h-screen overflow-x-clip">
            {children}
          </main>
          <Footer />
        </NextIntlClientProvider>
        {/* Deliberately after {children}, not in <head>, so a page's own
            Article node is the first application/ld+json on the page.
            This started as a fix: Google's swg-basic.js wrote article
            properties into whichever block came first, and while this one led
            they landed beside `@graph` — invalid JSON-LD on 1450 URLs. That
            script has since been removed, but the order is kept: the page's
            own subject should lead, and anything that injects into "the first
            block" then finds the right one. Placement in the document does not
            change how a crawler reads either block. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Счётчик. Загружается сразу после гидратации, а не в простое:
            на lazyOnload короткий визит успевает закончиться раньше, чем
            уйдёт событие.

            Отбор по размеру экрана был здесь с сентября и отсекал ферму
            безголовых браузеров. Снят 06.10.2026 по решению владельца: ферма
            всё равно сменила разрешения, а любой порог по экрану рискует
            отрезать живого читателя. Мусор теперь считаем и отсеиваем в
            отчётах, а не на входе. */}
        <Script id="ga-init" strategy="afterInteractive">{`
  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', '${GA_ID}');
`}</Script>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        {/* Контейнер тегов. Счётчик выше остаётся прямым вызовом gtag и в
            контейнер не переносится: два пути до одного GA4 считали бы каждый
            просмотр дважды. Если внутри контейнера заводится тег GA4, сначала
            убирается ga-init и строка gtag/js выше — одно из двух, не оба. */}
        <GoogleTagManager gtmId={GTM_ID} />
        <Script src="https://analytics.ahrefs.com/analytics.js" data-key={AHREFS_KEY} strategy="lazyOnload" />
        {/* Включено в панели Vercel с 13.07.2026, но до 01.09 не собирало:
            включить функцию — половина дела, клиентский компонент нужно
            смонтировать. Speed Insights даёт полевые Core Web Vitals, которых
            нет ни в GA4, ни в Ahrefs Analytics. */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }));
}
