import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, Clock, ExternalLink } from 'lucide-react';
import { buildOg, buildTwitter, BASE, truncateDesc } from '@/lib/metadata';
import { fetchCalendarEvents } from '@/lib/sanity';
import { CATEGORY_COLOR, CATEGORY_LABELS, CATEGORY_LUCIDE, IMPORTANCE_BADGE, tint } from '@/lib/calendarMeta';
import { ORGANIZATION_ID } from '@/lib/organizationSchema';
import EventActions from '@/components/ui/EventActions';
import PopularSidebar from '@/components/ui/PopularSidebar';
import { SITE_NAME } from '@/lib/site';
import type { CSSProperties } from 'react';

/**
 * Страница одного события.
 *
 * Раньше события жили только якорями на общей странице, и по запросу вроде
 * «token2049 singapore 2026» сайту нечем было ранжироваться: сорок четыре
 * события делили один адрес и одну разметку ItemList. Теперь у каждого свой
 * адрес и своя разметка Event.
 */

type Props = { params: Promise<{ locale: string; slug: string }> };

const DAY_MS = 86_400_000;

export const revalidate = 300;

export async function generateStaticParams() {
  const events = await fetchCalendarEvents();
  return events.map((e) => ({ slug: e.slug }));
}

function toUtc(dateISO: string): number {
  return Date.parse(`${dateISO.slice(0, 10)}T00:00:00Z`);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const events = await fetchCalendarEvents();
  const event = events.find((e) => e.slug === slug);
  if (!event) return {};

  const isRu = locale === 'ru';
  const loc = isRu ? 'ru' : 'en';
  const dateLabel = new Date(event.date).toLocaleDateString(isRu ? 'ru-RU' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
  const title = `${event.title[loc]} — ${dateLabel}`;
  const description = truncateDesc(
    event.description?.[loc] ||
      (isRu
        ? `${event.title[loc]}: дата, категория и уровень важности в криптокалендаре ${SITE_NAME}.`
        : `${event.title[loc]}: date, category and importance in the ${SITE_NAME} crypto calendar.`)
  );
  const url = `${BASE}/${locale}/calendar/${slug}`;

  return {
    title,
    description,
    openGraph: buildOg({ url, title, description, locale }),
    twitter: buildTwitter({ url, title, description, locale }),
    alternates: {
      canonical: url,
      languages: {
        ru: `${BASE}/ru/calendar/${slug}`,
        en: `${BASE}/en/calendar/${slug}`,
        'x-default': `${BASE}/en/calendar/${slug}`,
      },
    },
  };
}

export default async function CalendarEventPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const isRu = locale === 'ru';
  const loc = isRu ? 'ru' : 'en';

  const events = await fetchCalendarEvents();
  const event = events.find((e) => e.slug === slug);
  if (!event) notFound();

  const url = `${BASE}/${locale}/calendar/${slug}`;
  const color = CATEGORY_COLOR[event.category] || CATEGORY_COLOR.other;
  const Icon = CATEGORY_LUCIDE[event.category] || CATEGORY_LUCIDE.other;
  const importance = IMPORTANCE_BADGE[event.importance] || IMPORTANCE_BADGE.medium;

  const todayISO = new Date().toISOString().slice(0, 10);
  const isPast = event.date < todayISO;
  const days = Math.round((toUtc(event.date) - toUtc(todayISO)) / DAY_MS);
  const dateLabel = new Date(event.date).toLocaleDateString(isRu ? 'ru-RU' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    weekday: 'long',
    timeZone: 'UTC',
  });

  // Соседние события по дате: читателю есть куда идти дальше, а поисковику
  // достаётся связь между страницами раздела.
  const sorted = [...events].sort((a, b) => a.date.localeCompare(b.date));
  const index = sorted.findIndex((e) => e._id === event._id);
  const prev = sorted[index - 1];
  const next = sorted[index + 1];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Event',
        name: event.title[loc],
        description: event.description?.[loc] || event.title[loc],
        startDate: event.date,
        ...(event.endDate ? { endDate: event.endDate } : {}),
        // У schema.org нет статуса «прошло»: EventScheduled противопоставлен
        // отмене и переносу. Прошедшее событие остаётся Event без обещания,
        // что оно впереди.
        ...(isPast ? {} : { eventStatus: 'https://schema.org/EventScheduled' }),
        eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
        location: { '@type': 'VirtualLocation', url: event.sourceUrl || url },
        url,
        organizer: { '@id': ORGANIZATION_ID },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: SITE_NAME, item: `${BASE}/${locale}` },
          {
            '@type': 'ListItem',
            position: 2,
            name: isRu ? 'Криптокалендарь' : 'Crypto Calendar',
            item: `${BASE}/${locale}/calendar`,
          },
          { '@type': 'ListItem', position: 3, name: event.title[loc], item: url },
        ],
      },
    ],
  };

  return (
    <div className="mx-auto max-w-[1320px] px-4 py-10 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_256px] lg:gap-8">
        <div className="cal-stage">
          <Link
            href={`/${locale}/calendar`}
            className="mb-5 inline-flex items-center gap-1.5 text-[12px] font-bold text-muted transition-colors hover:text-foreground"
          >
            <ArrowLeft size={13} />
            {isRu ? 'Криптокалендарь' : 'Crypto Calendar'}
          </Link>

          <article className="relative overflow-hidden rounded-[20px] p-5 cal-glass backdrop-blur-[22px] backdrop-saturate-150 sm:p-7">
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-[inherit]"
              style={{ background: `radial-gradient(52% 70% at 6% 0%, ${tint(color, 0.18)}, transparent 70%)` }}
            />

            <div className="relative flex items-start gap-4">
              <span
                className="grid h-[52px] w-[52px] shrink-0 place-items-center overflow-hidden rounded-[14px]"
                style={{ color, background: tint(color, 0.14), border: `1px solid ${tint(color, 0.34)}` }}
              >
                {event.iconUrl ? (
                  <Image
                    src={event.iconUrl}
                    alt=""
                    aria-hidden="true"
                    width={52}
                    height={52}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Icon size={24} strokeWidth={2} />
                )}
              </span>

              <div className="min-w-0">
                <h1 className="text-[22px] font-extrabold leading-tight tracking-[-0.02em] text-foreground text-balance sm:text-[28px]">
                  {event.title[loc]}
                </h1>
                <p className="mt-2 text-[13px] text-muted">
                  {dateLabel}
                  {event.time ? ` · ${event.time}` : ''}
                  {event.endDate && event.endDate > event.date
                    ? ` — ${new Date(event.endDate).toLocaleDateString(isRu ? 'ru-RU' : 'en-GB', {
                        day: 'numeric',
                        month: 'long',
                        timeZone: 'UTC',
                      })}`
                    : ''}
                </p>
              </div>
            </div>

            <div className="relative mt-5 flex flex-wrap items-center gap-2">
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-extrabold"
                style={{ color, background: tint(color, 0.13), border: `1px solid ${tint(color, 0.34)}` }}
              >
                <span className="block h-1.5 w-1.5 rounded-full" style={{ background: color }} />
                {CATEGORY_LABELS[event.category]?.[loc] || event.category}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-extrabold ${importance.className}`}
              >
                <span className="block h-1.5 w-1.5 rounded-full bg-current" />
                {importance.label[loc]}
              </span>
              {!isPast && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold tabular-nums text-accent">
                  <Clock size={12} />
                  {days <= 0
                    ? isRu
                      ? 'сегодня'
                      : 'today'
                    : isRu
                      ? `через ${days}`
                      : `in ${days} days`}
                </span>
              )}
            </div>

            {event.description?.[loc] && (
              <p className="relative mt-5 max-w-[68ch] text-[14px] leading-relaxed text-muted">
                {event.description[loc]}
              </p>
            )}

            {/* Итог заполняется редакцией после даты и показывается только у
                прошедших событий: до даты писать в него нечего. */}
            {isPast && event.outcome?.[loc] && (
              <div
                className="relative mt-5 rounded-[14px] px-4 py-3.5 cal-glass-soft"
                style={{ '--cat': color } as CSSProperties}
              >
                <b className="mb-1.5 block text-[10.5px] font-extrabold uppercase tracking-[0.1em] text-muted">
                  {isRu ? 'Чем кончилось' : 'Outcome'}
                </b>
                <p className="text-[13.5px] leading-relaxed text-foreground">{event.outcome[loc]}</p>
              </div>
            )}

            <div className="relative mt-6 flex flex-wrap items-center gap-3 border-t border-[var(--glass-edge)] pt-4">
              <EventActions event={event} locale={locale} pageUrl={`${BASE}/${locale}/calendar`} />
              {event.sourceUrl && (
                <a
                  href={event.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto inline-flex items-center gap-1.5 rounded-[10px] border border-[var(--glass-edge)] px-3 py-2 text-[11.5px] font-bold text-foreground transition-colors hover:border-[var(--glass-edge-lit)]"
                >
                  <ExternalLink size={12} />
                  {isRu ? 'Источник' : 'Source'}
                </a>
              )}
            </div>
          </article>

          {(prev || next) && (
            <nav className="mt-4 grid gap-2.5 sm:grid-cols-2">
              {prev && (
                <Link
                  href={`/${locale}/calendar/${prev.slug}`}
                  className="rounded-[14px] p-3.5 cal-glass-soft transition-colors hover:border-[var(--glass-edge-lit)]"
                >
                  <b className="block text-[10px] font-extrabold uppercase tracking-[0.1em] text-muted">
                    {isRu ? 'Раньше' : 'Earlier'}
                  </b>
                  <span className="mt-1 block text-[12.5px] font-bold text-foreground">{prev.title[loc]}</span>
                </Link>
              )}
              {next && (
                <Link
                  href={`/${locale}/calendar/${next.slug}`}
                  className="rounded-[14px] p-3.5 text-right cal-glass-soft transition-colors hover:border-[var(--glass-edge-lit)] sm:col-start-2"
                >
                  <b className="block text-[10px] font-extrabold uppercase tracking-[0.1em] text-muted">
                    {isRu ? 'Дальше' : 'Next'}
                  </b>
                  <span className="mt-1 block text-[12.5px] font-bold text-foreground">{next.title[loc]}</span>
                </Link>
              )}
            </nav>
          )}
        </div>

        <PopularSidebar locale={locale} />
      </div>
    </div>
  );
}
