'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { CalendarEventCarouselCard } from './CalendarEventCard';
import type { CalendarEvent } from '@/lib/sanity';

export default function CalendarCarousel({ events, locale }: { events: CalendarEvent[]; locale: string }) {
  const isRu = locale === 'ru';
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    trackRef.current?.scrollBy({ left: dir * 280, behavior: 'smooth' });
  };

  if (events.length === 0) return null;

  return (
    <section className="mb-14">
      <div className="flex items-center justify-between mb-5">
        <h2 className="flex items-center gap-2 text-sm font-bold text-foreground">
          <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
          {isRu ? 'Криптокалендарь' : 'Crypto Calendar'}
        </h2>
        <div className="hidden sm:flex items-center gap-1.5">
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
          <CalendarEventCarouselCard key={event._id} event={event} locale={locale} />
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
