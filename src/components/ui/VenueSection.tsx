'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * Раздел страницы биржи или брокера. На телефоне раскрывается по нажатию, на
 * десктопе открыт всегда. Содержимое одно на оба экрана: текст не задваивается в
 * HTML и остаётся в нём, даже когда раздел свёрнут.
 */
export default function VenueSection({
  id,
  title,
  meta,
  gold = false,
  defaultOpen = false,
  children,
}: {
  id: string;
  title: string;
  meta?: string | number | null;
  gold?: boolean;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const edge = gold
    ? 'border-[color-mix(in_srgb,var(--passport-gold)_40%,transparent)]'
    : 'border-[var(--glass-line)]';

  return (
    <section id={id} className={`scroll-mt-32 rounded-2xl border ${edge} bg-[image:var(--glass-fill)] md:rounded-none md:border-0 md:bg-none`}>
      <h2 className="text-[15px] md:text-lg font-bold text-foreground">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={`${id}-body`}
          onClick={() => setOpen(value => !value)}
          className="flex w-full items-center gap-2 px-3.5 py-3 min-h-11 text-left font-bold md:min-h-0 md:p-0 md:mb-3 md:pointer-events-none"
        >
          <span className={gold ? 'text-[var(--passport-gold)] md:text-foreground' : undefined}>{title}</span>
          {meta !== null && meta !== undefined && meta !== '' && (
            <span className="text-xs font-semibold text-muted tabular-nums">{meta}</span>
          )}
          <ChevronDown size={16} aria-hidden className={`ml-auto shrink-0 text-muted transition-transform md:hidden ${open ? 'rotate-180' : ''}`} />
        </button>
      </h2>
      <div id={`${id}-body`} className={`px-3.5 pb-3.5 md:p-0 ${open ? '' : 'hidden md:block'}`}>
        {children}
      </div>
    </section>
  );
}
