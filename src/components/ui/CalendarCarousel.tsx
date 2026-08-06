'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { CalendarEventCarouselCard } from './CalendarEventCard';
import type { CalendarEvent } from '@/lib/sanity';

const DAY_MS = 86_400_000;

export default function CalendarCarousel({ events, locale }: { events: CalendarEvent[]; locale: string }) {
  const isRu = locale === 'ru';
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    trackRef.current?.scrollBy({ left: dir * 280, behavior: 'smooth' });
  };

  if (events.length === 0) return null;

  // One "today" for every card, so the countdowns can't disagree with each other.
  const todayMs = Date.parse(`${new Date().toISOString().slice(0, 10)}T00:00:00Z`);
  const daysTo = (dateISO: string) =>
    Math.max(0, Math.round((Date.parse(`${dateISO.slice(0, 10)}T00:00:00Z`) - todayMs) / DAY_MS));

  const nextIn = daysTo(events[0].date);
  const mod10 = nextIn % 10;
  const mod100 = nextIn % 100;
  const dayWord =
    mod10 === 1 && mod100 !== 11
      ? 'день'
      : mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)
        ? 'дня'
        : 'дней';
  const nextLabel = isRu
    ? nextIn === 0
      ? 'Ближайшее событие — сегодня'
      : nextIn === 1
        ? 'Ближайшее событие — завтра'
        : `Ближайшее событие — через ${nextIn} ${dayWord}`
    : nextIn === 0
      ? 'Next event — today'
      : nextIn === 1
        ? 'Next event — tomorrow'
        : `Next event — in ${nextIn} days`;

  return (
    <section className="mb-14">
      <div className="flex items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="flex items-center gap-2 text-sm font-bold text-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
            <Link href={`/${locale}/calendar`} className="hover:text-accent transition-colors">
              {isRu ? 'Криптокалендарь' : 'Crypto Calendar'}
            </Link>
          </h2>
          <p className="text-[11px] text-muted mt-1">
            {nextLabel} · {isRu ? `всего впереди ${events.length}` : `${events.length} ahead`}
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => scroll(-1)}
            aria-label={isRu ? 'Назад' : 'Previous'}
            className="w-8 h-8 rounded-full border border-border bg-card flex items-center justify-center text-muted hover:text-accent hover:border-accent/40 transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => scroll(1)}
            aria-label={isRu ? 'Вперёд' : 'Next'}
            className="w-8 h-8 rounded-full border border-border bg-card flex items-center justify-center text-muted hover:text-accent hover:border-accent/40 transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div ref={trackRef} className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
        {events.map((event) => (
          <CalendarEventCarouselCard
            key={event._id}
            event={event}
            locale={locale}
            daysAway={daysTo(event.date)}
          />
        ))}
      </div>

      <div className="flex justify-center mt-5">
        <Link
          href={`/${locale}/calendar`}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-accent text-background text-sm font-medium hover:opacity-90 transition-opacity"
        >
          {isRu ? 'Посмотреть все события' : 'View all events'}
          <ArrowRight size={14} />
        </Link>
      </div>
    </section>
  );
}
