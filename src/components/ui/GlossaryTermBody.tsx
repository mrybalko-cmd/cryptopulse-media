import Link from 'next/link';
import { Check } from 'lucide-react';
import { CATEGORY_LABELS, type GlossaryTerm } from '@/lib/glossary';

type Props = {
  term: GlossaryTerm;
  /** Every term in the same set, for resolving related slugs. */
  all: GlossaryTerm[];
  locale: string;
  /** Route segment this set lives under: 'glossary' or 'ai/glossary'. */
  base: string;
};

/**
 * Picks what to show under "Related terms".
 *
 * The curated list wins. Without one, other terms in the same category are at
 * least topical — the previous behaviour took whichever terms happened to sit
 * next to this one in the source array, so "Slippage" recommended "Whitepaper"
 * purely because of file order.
 */
export function relatedTerms(term: GlossaryTerm, all: GlossaryTerm[], limit = 6): GlossaryTerm[] {
  if (term.related?.length) {
    const bySlug = new Map(all.map(t => [t.slug, t]));
    const picked = term.related.map(s => bySlug.get(s)).filter((t): t is GlossaryTerm => Boolean(t));
    if (picked.length) return picked.slice(0, limit);
  }
  if (term.category) {
    const sameCategory = all.filter(t => t.category === term.category && t.slug !== term.slug);
    if (sameCategory.length) return sameCategory.slice(0, limit);
  }
  // Last resort, for sets that carry no categories at all: other entries from
  // the same set. No better than picking neighbours, but it keeps the internal
  // links alive rather than dropping the block entirely.
  return all.filter(t => t.slug !== term.slug).slice(0, limit);
}

/** Rough reading time from the term's own words, both locales counted alike. */
export function termWordCount(term: GlossaryTerm, loc: 'ru' | 'en'): number {
  const parts: string[] = [term.definition[loc]];
  for (const s of term.sections ?? []) {
    parts.push(s.heading[loc]);
    for (const p of s.paragraphs ?? []) parts.push(p[loc]);
    for (const b of s.bullets ?? []) parts.push(b.title[loc], b.text[loc]);
    if (s.example) parts.push(s.example.setup[loc], s.example.outcome[loc]);
  }
  return parts.join(' ').split(/\s+/).filter(Boolean).length;
}

export default function GlossaryTermBody({ term, all, locale, base }: Props) {
  const isRu = locale === 'ru';
  const loc: 'ru' | 'en' = isRu ? 'ru' : 'en';
  const related = relatedTerms(term, all);
  const words = termWordCount(term, loc);
  const minutes = Math.max(1, Math.round(words / 180));

  return (
    <>
      <h1 className="text-[27px] sm:text-[34px] font-extrabold text-foreground leading-[1.14] -tracking-[0.025em] text-balance mb-4">
        {term.term[loc]}
      </h1>

      <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-muted mb-6">
        {term.category && (
          <span className="text-[11px] font-extrabold uppercase tracking-[0.05em] text-accent border border-accent/35 rounded-full px-2.5 py-[3px]">
            {CATEGORY_LABELS[term.category][loc]}
          </span>
        )}
        {term.updated && (
          <>
            <span className="w-[3px] h-[3px] rounded-full bg-muted/60" aria-hidden />
            <span>
              {isRu ? 'Обновлено ' : 'Updated '}
              {term.updated.split('-').reverse().join('.')}
            </span>
          </>
        )}
        <span className="w-[3px] h-[3px] rounded-full bg-muted/60" aria-hidden />
        <span>{isRu ? `${minutes} мин` : `${minutes} min`}</span>
      </div>

      {/* The definition sits in its own pane so the answer someone came for is
          separable from the explanation around it — for a reader scanning, and
          for anything extracting a passage to quote. */}
      <div className="relative overflow-hidden rounded-2xl border border-[var(--glass-line)] bg-[image:var(--glass-fill)] px-[17px] sm:px-6 py-[18px] sm:py-[22px] mb-8 shadow-[var(--glass-shadow)]">
        <div
          className="pointer-events-none absolute -inset-y-[40%] -left-[12%] right-[40%] blur-[52px] bg-[var(--halo-violet)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute left-4 right-4 top-0 h-px bg-gradient-to-r from-transparent via-[var(--glass-edge-lit)] to-transparent"
          aria-hidden
        />
        <p className="relative text-base sm:text-[17.5px] leading-[1.6] text-foreground max-w-[62ch]">
          {term.definition[loc]}
        </p>
      </div>

      {term.sections?.map((section, i) => (
        <section key={i} className="mt-9 first:mt-0">
          <h2 className="text-lg sm:text-xl font-extrabold text-foreground -tracking-[0.02em] mb-3">
            {section.heading[loc]}
          </h2>

          {section.paragraphs && (
            <div className="text-[15px] leading-[1.75] text-muted max-w-[70ch] flex flex-col gap-3">
              {section.paragraphs.map((p, j) => <p key={j}>{p[loc]}</p>)}
            </div>
          )}

          {section.example && (
            <>
              <div className="border border-border rounded-2xl overflow-hidden max-w-[56ch]">
                <p className="px-3 sm:px-4 py-3 text-[13.5px] leading-[1.65] text-muted border-b border-border">
                  {section.example.setup[loc]}
                </p>
                <table className="w-full border-collapse text-[12.5px] sm:text-[13.5px]">
                  <tbody>
                    {section.example.rows.map((row, j) => (
                      <tr key={j}>
                        <td className="px-3 sm:px-4 py-2 border-b border-border text-muted tabular-nums">
                          {row.label[loc]}
                        </td>
                        <td className="px-3 sm:px-4 py-2 border-b border-border text-right font-semibold text-foreground tabular-nums">
                          {row.value[loc]}
                        </td>
                      </tr>
                    ))}
                    {section.example.total && (
                      <tr className="bg-foreground/[0.04]">
                        <td className="px-3 sm:px-4 py-2 font-extrabold text-foreground tabular-nums">
                          {section.example.total.label[loc]}
                        </td>
                        <td className="px-3 sm:px-4 py-2 text-right font-extrabold text-foreground tabular-nums">
                          {section.example.total.value[loc]}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-[15px] leading-[1.7] text-muted max-w-[70ch]">
                {section.example.outcome[loc]}
              </p>
            </>
          )}

          {section.bullets && (
            <ul className="flex flex-col gap-3 max-w-[70ch]">
              {section.bullets.map((b, j) => (
                <li key={j} className="grid grid-cols-[auto_1fr] gap-3 text-[15px] leading-[1.7] text-muted">
                  <Check className="w-[17px] h-[17px] mt-1 shrink-0 text-accent" aria-hidden />
                  <span>
                    <b className="block text-foreground font-bold">{b.title[loc]}</b>
                    {b.text[loc]}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}

      {/* Names only, and outside the article flow. Each entry used to carry the
          full definition of another term in the DOM (line-clamp hides it
          visually but leaves it in the markup), so a passage lifted from this
          page could end up attributing a neighbour's definition to this term. */}
      {related.length > 0 && (
        <aside className="mt-11 pt-6 border-t border-border">
          <h2 className="text-[13px] font-extrabold uppercase tracking-[0.06em] text-muted mb-3.5">
            {isRu ? 'Связанные термины' : 'Related terms'}
          </h2>
          <div className="flex flex-wrap gap-2">
            {related.map(t => (
              <Link
                key={t.slug}
                href={`/${locale}/${base}/${t.slug}`}
                className="text-[13.5px] font-semibold text-foreground border border-border rounded-full px-3.5 py-[7px] transition-colors hover:text-[var(--title-hover)] hover:border-[var(--title-hover)]/45"
              >
                {t.term[loc]}
              </Link>
            ))}
          </div>
          <Link
            href={`/${locale}/${base}`}
            className="inline-block mt-4 text-[13.5px] font-semibold text-accent transition-colors hover:text-[var(--title-hover)]"
          >
            {isRu ? 'Все термины глоссария →' : 'All glossary terms →'}
          </Link>
        </aside>
      )}
    </>
  );
}
