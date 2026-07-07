'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { CATEGORY_ICON, CATEGORY_LABELS, CATEGORY_ORDER, IMPORTANCE_META } from '@/lib/calendarMeta';
import EventActions from './EventActions';
import type { CalendarEvent } from '@/lib/sanity';

interface Props {
  events: CalendarEvent[];
  locale: string;
  pageUrl: string;
}

function ImportanceDots({ importance, locale }: { importance: string; locale: string }) {
  const meta = IMPORTANCE_META[importance] || IMPORTANCE_META.medium;
  const label = meta.label[locale as 'ru' | 'en'];
  return (
    <span className="inline-flex items-center gap-1" title={label} aria-label={label}>
      {[1, 2, 3].map((i) => (
        <span
          key={i}
          className={`w-1.5 h-1.5 rounded-full ${i <= meta.dots ? meta.colorClass : 'bg-border'}`}
        />
      ))}
    </span>
  );
}

function EventRow({ event, locale, pageUrl }: { event: CalendarEvent; locale: string; pageUrl: string }) {
  const isRu = locale === 'ru';
  const loc = isRu ? 'ru' : 'en';
  const title = event.title[loc];
  const description = event.description?.[loc];
  const categoryLabel = CATEGORY_LABELS[event.category]?.[loc] || event.category;
  const date = new Date(event.date);
  const dateStr = date.toLocaleDateString(isRu ? 'ru-RU' : 'en-US', { day: 'numeric', month: 'long', timeZone: 'UTC' });

  return (
    <div id={event.slug} className="flex gap-4 bg-card border border-border rounded-xl p-4 scroll-mt-20 md:scroll-mt-32">
      <div className="shrink-0 w-9 h-9 rounded-full overflow-hidden bg-accent/10 flex items-center justify-center text-base relative">
        {event.iconUrl ? (
          <Image src={event.iconUrl} alt={title} fill className="object-cover" />
        ) : (
          CATEGORY_ICON[event.category] || '🗓️'
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1.5">
          <span className="text-xs font-semibold text-accent">{dateStr}</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent font-medium">{categoryLabel}</span>
          <ImportanceDots importance={event.importance} locale={locale} />
        </div>
        <h3 className="text-sm font-semibold text-foreground leading-snug">{title}</h3>
        {description && <p className="text-sm text-muted mt-1 leading-relaxed">{description}</p>}
        {event.sourceUrl && (
          <a
            href={event.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-accent hover:underline mt-1 inline-block"
          >
            {isRu ? 'Источник' : 'Source'}
          </a>
        )}
        <div className="mt-3">
          <EventActions event={event} locale={locale} pageUrl={pageUrl} />
        </div>
      </div>
    </div>
  );
}

export default function CalendarFilter({ events, locale, pageUrl }: Props) {
  const isRu = locale === 'ru';
  const [category, setCategory] = useState<string>('all');

  const todayISO = new Date().toISOString().slice(0, 10);

  const presentCategories = useMemo(
    () => CATEGORY_ORDER.filter((c) => events.some((e) => e.category === c)),
    [events]
  );

  const filtered = category === 'all' ? events : events.filter((e) => e.category === category);
  const upcoming = filtered.filter((e) => e.date >= todayISO);
  const past = filtered.filter((e) => e.date < todayISO).reverse();

  return (
    <div>
      <div className="flex gap-1.5 mb-8 overflow-x-auto pb-1 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
        <button
          onClick={() => setCategory('all')}
          className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
            category === 'all' ? 'border-accent bg-accent/10 text-accent' : 'border-border text-muted hover:text-foreground'
          }`}
        >
          {isRu ? 'Все' : 'All'}
        </button>
        {presentCategories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              category === c ? 'border-accent bg-accent/10 text-accent' : 'border-border text-muted hover:text-foreground'
            }`}
          >
            {CATEGORY_ICON[c]} {CATEGORY_LABELS[c]?.[isRu ? 'ru' : 'en'] || c}
          </button>
        ))}
      </div>

      <section className="mb-10">
        <h2 className="text-xs font-bold uppercase tracking-widest text-accent mb-3">
          {isRu ? 'Предстоящие события' : 'Upcoming events'}
        </h2>
        {upcoming.length > 0 ? (
          <div className="flex flex-col gap-3">
            {upcoming.map((event) => (
              <EventRow key={event._id} event={event} locale={locale} pageUrl={pageUrl} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted">{isRu ? 'Пока нет запланированных событий в этой категории.' : 'No upcoming events in this category yet.'}</p>
        )}
      </section>

      {past.length > 0 && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted mb-3">
            {isRu ? 'Прошедшие события' : 'Past events'}
          </h2>
          <div className="flex flex-col gap-3 opacity-70">
            {past.map((event) => (
              <EventRow key={event._id} event={event} locale={locale} pageUrl={pageUrl} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
