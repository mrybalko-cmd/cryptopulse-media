import Link from 'next/link';
import type { BodyBlock, Figure, TimelineEvent, FaqItem, SourceLink } from '@/lib/regulationPage';

/* The glass recipe the rest of the site uses, named once. */
const PANEL =
  'rounded-[15px] border border-[var(--glass-line)] bg-[image:var(--glass-fill)] shadow-[inset_0_1px_0_var(--glass-hi)]';

/**
 * A tinted glass block: the panel above plus a violet wash and a blurred halo
 * behind the copy. The halo is a child with a negative z-index inside an
 * isolated stacking context — a positioned element at z-index 0 paints *over*
 * inline text, which would put a purple cloud on top of the words.
 */
function Tinted({
  rail,
  label,
  children,
}: {
  rail: string;
  label?: { text: string; color: string };
  children: React.ReactNode;
}) {
  return (
    <div className={`relative isolate overflow-hidden mt-5 rounded-2xl border border-[var(--glass-line)] bg-[image:var(--glass-fill)] shadow-[inset_0_1px_0_var(--glass-hi),var(--glass-shadow)] pl-6 pr-5 py-4`}>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: 'linear-gradient(118deg, color-mix(in srgb, var(--violet) 20%, transparent), transparent 52%)' }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -z-10 -left-[6%] -top-[58px] w-[380px] h-[200px] rounded-full blur-[54px]"
        style={{ background: 'radial-gradient(50% 50% at 50% 50%, var(--halo-violet), transparent 70%)' }}
      />
      <span aria-hidden className="absolute left-0 inset-y-0 w-[3px]" style={{ background: `linear-gradient(180deg, ${rail}, transparent 88%)` }} />
      <span aria-hidden className="absolute left-4 right-4 top-0 h-px bg-gradient-to-r from-transparent via-[var(--glass-edge-lit)] to-transparent" />
      {label && (
        <p className="m-0 mb-2 text-[11px] font-bold uppercase tracking-[0.15em] leading-[1.4]" style={{ color: label.color }}>
          {label.text}
        </p>
      )}
      {children}
    </div>
  );
}

export function ShortAnswer({ text, lead }: { text: string; lead: string }) {
  return (
    <Tinted rail="var(--accent)">
      <p className="m-0 text-[15px] leading-[1.7] text-foreground">
        <b className="text-accent font-bold">{lead}</b> {text}
      </p>
    </Tinted>
  );
}

export function CuriousFact({ text, label }: { text: string; label: string }) {
  return (
    <Tinted rail="var(--importance-medium)" label={{ text: label, color: 'var(--importance-medium)' }}>
      <p className="m-0 text-[15px] leading-[1.7] text-foreground">{text}</p>
    </Tinted>
  );
}

/**
 * The six tiles. Numbers take violet — on this site cyan already means "link"
 * everywhere, so figures that must read as their own thing borrow the
 * secondary accent, the same way /rates and /assets do.
 *
 * A value that is a word rather than a number drops to the smaller size and
 * plain foreground colour: "Обязательна" set at 28px in violet reads as a
 * headline, not as a fact.
 */
export function Figures({ figures }: { figures: Figure[] }) {
  if (!figures.length) return null;
  return (
    <dl className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4 m-0">
      {figures.map(f => {
        const numeric = /\d/.test(f.value);
        // Tone wins over "is it a number": a stated meaning beats a guess.
        const colour =
          f.tone === 'ok' ? 'text-[var(--positive)]'
          : f.tone === 'warn' ? 'text-[var(--importance-medium)]'
          : numeric ? 'text-[var(--violet-2)]'
          : 'text-foreground';
        return (
          <div key={f.label} className={`${PANEL} px-4 pt-3 pb-4`}>
            <dt className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted leading-[1.4] mb-2">{f.label}</dt>
            <dd className="m-0">
              <span
                className={`flex items-end min-h-[30px] font-bold tabular-nums leading-none ${colour} ${
                  numeric ? 'text-[28px] tracking-[-0.045em]' : 'text-[21px] tracking-[-0.03em]'
                }`}
              >
                {f.value}
              </span>
              {f.note && <span className="block text-[12px] text-muted mt-2 leading-[1.4]">{f.note}</span>}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}

export function Body({ blocks }: { blocks: BodyBlock[] }) {
  return (
    <>
      {blocks.map((b, i) => {
        if (b.kind === 'h2') {
          return (
            <h2 key={i} className="text-[21px] font-bold tracking-[-0.03em] leading-[1.2] mt-8 mb-3">
              {b.text}
            </h2>
          );
        }
        if (b.kind === 'h3') {
          return (
            <h3 key={i} className="text-[17px] font-bold tracking-[-0.02em] leading-[1.25] mt-6 mb-2">
              {b.text}
            </h3>
          );
        }
        return (
          <p key={i} className="text-[15px] leading-[1.75] text-muted mb-3">
            {b.runs.map((r, j) =>
              r.href ? (
                <a
                  key={j}
                  href={r.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent no-underline border-b border-accent/30 hover:border-accent"
                >
                  {r.text}
                </a>
              ) : (
                <span key={j}>{r.text}</span>
              )
            )}
          </p>
        );
      })}
    </>
  );
}

export function AllowedRestricted({
  allowed,
  restricted,
  allowedLabel,
  restrictedLabel,
}: {
  allowed: string[];
  restricted: string[];
  allowedLabel: string;
  restrictedLabel: string;
}) {
  if (!allowed.length && !restricted.length) return null;
  const col = (items: string[], label: string, color: string, mark: string) =>
    items.length ? (
      <div className={`${PANEL} p-4`}>
        <h3 className="m-0 mb-3 text-[11px] font-bold uppercase tracking-[0.14em] leading-[1.4]" style={{ color }}>
          {label}
        </h3>
        <ul className="m-0 p-0 list-none">
          {items.map(t => (
            <li key={t} className="relative pl-5 py-[5px] text-[14px] leading-[1.5] text-muted">
              <span aria-hidden className="absolute left-0 top-[5px] text-[12px] font-bold" style={{ color }}>
                {mark}
              </span>
              {t}
            </li>
          ))}
        </ul>
      </div>
    ) : null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
      {col(allowed, allowedLabel, 'var(--positive)', '✓')}
      {col(restricted, restrictedLabel, 'var(--importance-medium)', '—')}
    </div>
  );
}

export function Timeline({ events }: { events: TimelineEvent[] }) {
  if (!events.length) return null;
  return (
    <div className="relative mt-4 pl-6">
      <span aria-hidden className="absolute left-0 top-[5px] bottom-[5px] w-px bg-[linear-gradient(180deg,transparent,var(--glass-line)_12%,var(--glass-line)_88%,transparent)]" />
      {events.map(e => (
        <div key={`${e.when}-${e.text}`} className="relative pb-4 last:pb-0">
          <span
            aria-hidden
            className="absolute -left-[28px] top-[5px] w-[9px] h-[9px] rounded-full border-2"
            style={
              e.highlight
                ? { background: 'var(--importance-medium)', borderColor: 'var(--importance-medium)', boxShadow: '0 0 12px color-mix(in srgb, var(--importance-medium) 55%, transparent)' }
                : { background: 'var(--background)', borderColor: 'var(--violet)' }
            }
          />
          <time className="block text-[12px] font-bold tracking-[0.02em] tabular-nums mb-1" style={{ color: e.highlight ? 'var(--importance-medium)' : 'var(--violet-2)' }}>
            {e.when}
          </time>
          <p className="m-0 text-[14px] leading-[1.6] text-muted">{e.text}</p>
        </div>
      ))}
    </div>
  );
}

export function Faq({ items }: { items: FaqItem[] }) {
  if (!items.length) return null;
  return (
    <div className="mt-3 border-t border-[var(--glass-line)]">
      {items.map(q => (
        <div key={q.question} className="border-b border-[var(--glass-line)] py-3">
          <h3 className="m-0 mb-1 flex gap-2 items-baseline text-[15px] font-bold tracking-[-0.02em] leading-[1.35]">
            <span aria-hidden className="flex-none font-mono text-[var(--violet-2)]">?</span>
            {q.question}
          </h3>
          <p className="m-0 ml-5 text-[14px] leading-[1.65] text-muted">{q.answer}</p>
        </div>
      ))}
    </div>
  );
}

export function Sources({ items, checked }: { items: SourceLink[]; checked: string }) {
  if (!items.length) return null;
  return (
    <div className="grid gap-2 mt-3">
      {items.map((s, i) => (
        <div key={s.url} className={`${PANEL} flex gap-3 items-baseline px-4 py-3 text-[14px]`}>
          <span className="flex-none font-mono text-[11px] font-bold tabular-nums text-muted opacity-70">
            {String(i + 1).padStart(2, '0')}
          </span>
          <a href={s.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-foreground no-underline hover:text-accent leading-[1.4]">
            {s.title}
          </a>
          <span className="ml-auto flex-none font-mono text-[11px] tabular-nums text-muted opacity-70">{checked}</span>
        </div>
      ))}
    </div>
  );
}

export interface RelatedItem {
  title: string;
  href: string;
  kind: string;
}

export function Related({ items }: { items: RelatedItem[] }) {
  if (!items.length) return null;
  return (
    <div className={`grid grid-cols-1 gap-2 mt-3 ${items.length === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-3'}`}>
      {items.map(r => (
        <Link key={r.href} href={r.href} className={`${PANEL} px-4 pt-3 pb-4 no-underline group`}>
          <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--violet-2)] mb-2 leading-[1.4]">{r.kind}</span>
          <span className="block text-[14px] font-semibold leading-[1.4] tracking-[-0.015em] text-foreground group-hover:text-[var(--title-hover)] transition-colors">
            {r.title}
          </span>
        </Link>
      ))}
    </div>
  );
}

export interface Neighbour {
  name: string;
  href: string;
  flag: string;
  stat?: string;
}

export function CountrySwitcher({
  prev,
  next,
  mapHref,
  mapLabel,
  total,
  prevLabel,
  nextLabel,
}: {
  prev?: Neighbour;
  next?: Neighbour;
  mapHref: string;
  mapLabel: string;
  total: number;
  prevLabel: string;
  nextLabel: string;
}) {
  const card = (n: Neighbour, label: string, dir: 'prev' | 'next') => (
    <Link
      href={n.href}
      className={`${PANEL} flex items-center gap-3 px-4 py-3 rounded-2xl no-underline group transition-transform hover:-translate-y-0.5 ${
        dir === 'next' ? 'flex-row-reverse text-right' : ''
      }`}
    >
      <span aria-hidden className="flex-none text-[17px] font-bold text-[var(--violet-2)] opacity-80">
        {dir === 'prev' ? '←' : '→'}
      </span>
      <span aria-hidden className="flex-none text-[24px] leading-none">{n.flag}</span>
      <span className="min-w-0 flex-1">
        <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-muted opacity-70 leading-[1.4]">{label}</span>
        <span className={`flex items-center gap-[7px] text-[17px] font-bold tracking-[-0.02em] leading-[1.25] mt-0.5 text-foreground group-hover:text-[var(--title-hover)] transition-colors ${dir === 'next' ? 'justify-end' : ''}`}>
          {dir === 'prev' && <span aria-hidden className="w-1.5 h-1.5 rounded-full bg-[var(--positive)] shadow-[0_0_7px_var(--positive)] flex-none" />}
          {n.name}
          {dir === 'next' && <span aria-hidden className="w-1.5 h-1.5 rounded-full bg-[var(--positive)] shadow-[0_0_7px_var(--positive)] flex-none" />}
        </span>
        {n.stat && <span className="block text-[12px] text-muted mt-[3px] tabular-nums leading-[1.4]">{n.stat}</span>}
      </span>
    </Link>
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-2 mt-3 items-stretch">
      {prev ? card(prev, prevLabel, 'prev') : <span />}
      <Link href={mapHref} className={`${PANEL} flex flex-col items-center justify-center gap-1 px-5 py-3 rounded-2xl no-underline min-w-[124px]`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} className="w-6 h-6 text-muted opacity-85" aria-hidden>
          <circle cx="12" cy="12" r="9.2" />
          <path d="M2.8 12h18.4M12 2.8c2.6 2.6 2.6 15.8 0 18.4M12 2.8c-2.6 2.6-2.6 15.8 0 18.4" />
        </svg>
        <span className="text-[12px] font-semibold text-muted text-center leading-[1.35]">{mapLabel}</span>
        <span className="text-[12px] font-bold tabular-nums text-[var(--violet-2)]">{total}</span>
      </Link>
      {next ? card(next, nextLabel, 'next') : <span />}
    </div>
  );
}
