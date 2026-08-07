import Link from 'next/link';
import GaugeArc from './GaugeArc';
import type { CSSProperties } from 'react';

interface Props {
  name: string;
  value: number;
  classification: string;
  color: string;
  gradient: string[];
  /** One sentence on what this reading means for a reader. */
  explanation: string;
  source: string;
  href: string;
  id: string;
}

/**
 * One index rendered as an instrument. On phones it lays out as a row — gauge
 * and number on the left, meaning on the right — because at 390px the reader
 * needs the sentence more than a row of three matching dials. From sm up it
 * stacks into a centred column, three across.
 */
export default function IndexGaugeCard({
  name,
  value,
  classification,
  color,
  gradient,
  explanation,
  source,
  href,
  id,
}: Props) {
  return (
    <Link
      href={href}
      style={{ '--c': color } as CSSProperties}
      className="group relative overflow-hidden rounded-[18px] p-4 sm:p-[18px] border border-[var(--popular-glass-line)] bg-[var(--popular-glass)] shadow-[inset_0_1px_0_var(--popular-glass-line),var(--popular-shadow)] grid grid-cols-[92px_minmax(0,1fr)] gap-3 items-center sm:flex sm:flex-col sm:items-center sm:text-center transition-transform hover:-translate-y-0.5"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute left-1/2 -top-[34%] h-[150px] w-[190px] -translate-x-1/2 blur-[30px]"
        style={{ background: `radial-gradient(50% 60% at 50% 50%, ${color}6b, transparent 70%)` }}
      />

      <span className="relative sm:contents">
        <span className="hidden sm:block text-[9.5px] font-extrabold uppercase tracking-[0.09em] text-muted mb-3">
          {name}
        </span>
        <span className="block sm:hidden">
          <GaugeArc value={value} color={color} width={92} gradient={gradient} id={`${id}-m`} />
        </span>
        <span className="hidden sm:block">
          <GaugeArc value={value} color={color} width={126} gradient={gradient} id={`${id}-d`} />
        </span>
        <span className="block text-center text-[23px] sm:text-[30px] font-extrabold text-foreground tabular-nums -tracking-[0.03em] -mt-8 sm:-mt-[42px] sm:mb-3.5">
          {value}
        </span>
      </span>

      <span className="relative min-w-0">
        <span className="block sm:hidden text-[9px] font-extrabold uppercase tracking-[0.09em] text-muted mb-1">
          {name}
        </span>
        <span
          className="inline-flex text-[10px] sm:text-[11px] font-extrabold rounded-full px-2.5 py-1"
          style={{ color, background: `${color}26` }}
        >
          {classification}
        </span>
        <span className="block text-[11px] sm:text-[11.5px] text-muted leading-relaxed mt-1.5 sm:mt-2.5 sm:min-h-[34px]">
          {explanation}
        </span>
        <span className="hidden sm:block text-[9.5px] text-muted/70 mt-2.5">source: {source}</span>
      </span>
    </Link>
  );
}
