import Image from 'next/image';
import Link from 'next/link';
import { CATEGORY_ICON, CATEGORY_LABELS } from '@/lib/calendarMeta';
import type { CalendarEvent } from '@/lib/sanity';

interface Props {
  event: CalendarEvent;
  locale: string;
}

function DateBadge({ dateISO, locale }: { dateISO: string; locale: string }) {
  const date = new Date(dateISO);
  const day = date.toLocaleDateString(locale === 'ru' ? 'ru-RU' : 'en-US', { day: '2-digit', timeZone: 'UTC' });
  const month = date.toLocaleDateString(locale === 'ru' ? 'ru-RU' : 'en-US', { month: 'short', timeZone: 'UTC' });
  return (
    <div>
      <p className="text-2xl font-extrabold text-foreground leading-none">{day}</p>
      <p className="text-xs text-muted mt-1 capitalize">{month}</p>
    </div>
  );
}

function EventIcon({ event }: { event: CalendarEvent }) {
  if (event.iconUrl) {
    return (
      <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0 bg-background border border-border">
        <Image src={event.iconUrl} alt={event.title?.en || event.title?.ru || ''} fill className="object-cover" />
      </div>
    );
  }
  return (
    <div className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center text-base shrink-0">
      {CATEGORY_ICON[event.category] || '🗓️'}
    </div>
  );
}

export function CalendarEventCarouselCard({ event, locale }: Props) {
  const isRu = locale === 'ru';
  const title = event.title[locale as 'ru' | 'en'];
  const categoryLabel = CATEGORY_LABELS[event.category]?.[isRu ? 'ru' : 'en'] || event.category;

  return (
    <Link
      href={`/${locale}/calendar#${event.slug}`}
      className="snap-start shrink-0 w-64 bg-card border border-border rounded-2xl p-4 flex flex-col justify-between hover:border-accent/40 transition-colors"
    >
      <div className="flex items-start justify-between mb-4">
        <DateBadge dateISO={event.date} locale={locale} />
        <EventIcon event={event} />
      </div>
      <h3 className="text-sm font-semibold text-foreground leading-snug line-clamp-3 mb-3">{title}</h3>
      <span className="self-start text-xs px-2 py-1 rounded-full bg-accent/10 text-accent font-medium">
        {categoryLabel}
      </span>
    </Link>
  );
}
