import Image from 'next/image';
import Link from 'next/link';
import { Clock } from 'lucide-react';
import { CATEGORY_COLOR, CATEGORY_LABELS, CATEGORY_LUCIDE, IMPORTANCE_BADGE, tint } from '@/lib/calendarMeta';
import type { CalendarEvent } from '@/lib/sanity';
import type { CSSProperties } from 'react';

interface Props {
  event: CalendarEvent;
  locale: string;
  /** Days from today to the event, computed once by the carousel so every card
      counts down from the same "now" and the server/client markup matches. */
  daysAway?: number;
}

function countdown(days: number | undefined, isRu: boolean): string | null {
  if (days === undefined) return null;
  if (days <= 0) return isRu ? 'сегодня' : 'today';
  if (days === 1) return isRu ? 'завтра' : 'tomorrow';
  if (isRu) {
    const mod10 = days % 10;
    const mod100 = days % 100;
    const word =
      mod10 === 1 && mod100 !== 11
        ? 'день'
        : mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)
          ? 'дня'
          : 'дней';
    return `через ${days} ${word}`;
  }
  return `in ${days} days`;
}

export function CalendarEventCarouselCard({ event, locale, daysAway }: Props) {
  const isRu = locale === 'ru';
  const loc = isRu ? 'ru' : 'en';
  const title = event.title[loc];
  const categoryLabel = CATEGORY_LABELS[event.category]?.[loc] || event.category;
  const color = CATEGORY_COLOR[event.category] || CATEGORY_COLOR.other;
  const Icon = CATEGORY_LUCIDE[event.category] || CATEGORY_LUCIDE.other;
  const importance = IMPORTANCE_BADGE[event.importance];

  const date = new Date(event.date);
  const day = date.toLocaleDateString(isRu ? 'ru-RU' : 'en-US', { day: 'numeric', timeZone: 'UTC' });
  const month = date
    .toLocaleDateString(isRu ? 'ru-RU' : 'en-US', { month: 'short', timeZone: 'UTC' })
    .replace('.', '');
  const timeLeft = countdown(daysAway, isRu);
  const isSoon = daysAway !== undefined && daysAway >= 0 && daysAway <= 7;

  return (
    <Link
      href={`/${locale}/calendar#${event.slug}`}
      style={{ '--cat-soft': tint(color, 0.4) } as CSSProperties}
      className="snap-start shrink-0 w-60 relative overflow-hidden bg-card border border-border rounded-2xl p-3.5 pl-4 flex flex-col gap-2.5 transition-all hover:border-[var(--cat-soft)] hover:shadow-lg"
    >
      <span aria-hidden className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ background: color }} />

      <div className="flex items-start justify-between gap-2.5">
        <p className="flex items-baseline gap-1.5">
          <span className="text-[22px] font-extrabold text-foreground leading-none tabular-nums">{day}</span>
          <span className="text-[10px] font-extrabold uppercase tracking-[0.08em] text-muted">{month}</span>
        </p>
        <span
          className="w-[30px] h-[30px] rounded-lg overflow-hidden flex items-center justify-center shrink-0 relative"
          style={{ color, background: tint(color, 0.14) }}
        >
          {event.iconUrl ? (
            <Image src={event.iconUrl} alt="" aria-hidden="true" width={30} height={30} className="w-full h-full object-cover" />
          ) : (
            <Icon size={16} strokeWidth={2} />
          )}
        </span>
      </div>

      <h3 className="text-[12.5px] font-bold text-foreground leading-snug line-clamp-3 min-h-[50px]">{title}</h3>

      <div className="flex items-center gap-1.5 flex-wrap">
        <span
          className="inline-flex items-center gap-1.5 text-[10.5px] font-bold px-2 py-0.5 rounded-full"
          style={{ color, background: tint(color, 0.13) }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
          {categoryLabel}
        </span>
        {event.importance === 'high' && importance && (
          <span className={`inline-flex items-center gap-1.5 text-[10.5px] font-bold px-2 py-0.5 rounded-full ${importance.className}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            {importance.short[loc]}
          </span>
        )}
      </div>

      {timeLeft && (
        <span className={`inline-flex items-center gap-1 text-[10.5px] tabular-nums ${isSoon ? 'text-accent' : 'text-muted'}`}>
          <Clock size={11} />
          {timeLeft}
        </span>
      )}
    </Link>
  );
}
