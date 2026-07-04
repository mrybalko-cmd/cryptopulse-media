import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { buildOg, BASE } from '@/lib/metadata';
import { fetchCalendarEvents } from '@/lib/sanity';
import CalendarFilter from '@/components/ui/CalendarFilter';
import PopularSidebar from '@/components/ui/PopularSidebar';


type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const isRu = locale === 'ru';
  const title = isRu ? 'Криптокалендарь — важные события крипторынка' : 'Crypto Calendar — Key Market Events';
  const description = isRu
    ? 'Анлоки токенов, токенсейлы, листинги, отчётность и другие важные события крипторынка — с уровнем важности и датами.'
    : 'Token unlocks, token sales, listings, macro reports, and other key crypto market events — with importance ratings and dates.';

  return {
    title,
    description,
    openGraph: buildOg({ url: `${BASE}/${locale}/calendar`, title, description, locale }),
    alternates: {
      canonical: `${BASE}/${locale}/calendar`,
      languages: { ru: `${BASE}/ru/calendar`, en: `${BASE}/en/calendar`, 'x-default': `${BASE}/en/calendar` },
    },
  };
}

export default async function CalendarPage({ params }: Props) {
  const { locale } = await params;
  const isRu = locale === 'ru';
  const loc = (isRu ? 'ru' : 'en') as 'ru' | 'en';
  const pageUrl = `${BASE}/${locale}/calendar`;

  const events = await fetchCalendarEvents();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: isRu ? 'Криптокалендарь CryptoPulse.media' : 'CryptoPulse.media Crypto Calendar',
    itemListElement: events.map((e, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Event',
        name: e.title[loc],
        description: e.description?.[loc] || e.title[loc],
        startDate: e.date,
        eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
        eventStatus: 'https://schema.org/EventScheduled',
        location: { '@type': 'VirtualLocation', url: e.sourceUrl || pageUrl },
        url: `${pageUrl}#${e.slug}`,
      },
    })),
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 256px', gap: '2rem' }}>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            {isRu ? 'Криптокалендарь' : 'Crypto Calendar'}
          </h1>
          <p className="text-muted text-sm mb-8 leading-relaxed">
            {isRu
              ? 'Анлоки токенов, токенсейлы, листинги, макроотчёты и другие важные события крипторынка — с уровнем важности, лайками и возможностью добавить в свой Google Calendar.'
              : 'Token unlocks, token sales, listings, macro reports, and other key crypto market events — with an importance rating, likes, and the option to add them to your Google Calendar.'}
          </p>

          <CalendarFilter events={events} locale={locale} pageUrl={pageUrl} />
        </div>

        <PopularSidebar locale={locale} />
      </div>
    </div>
  );
}
