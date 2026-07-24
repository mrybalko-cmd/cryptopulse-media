import Link from 'next/link';

const TYPES = ['CEX', 'DEX', 'P2P'] as const;

// Plain GET <form> — no client JS needed, checkbox state round-trips through
// the URL (?type=CEX&type=P2P) just like the "Apply" button in the approved
// mockup. `peer-checked` gives the pill variant live visual feedback before
// the form is even submitted.
export default function ExchangeTypeFilter({
  selected,
  locale,
  variant,
}: {
  selected: string[];
  locale: string;
  variant: 'rail' | 'inline';
}) {
  const isRu = locale === 'ru';

  if (variant === 'rail') {
    return (
      <form action={`/${locale}/exchanges`} className="bg-card border border-border rounded-lg p-4 sticky top-20">
        <h3 className="text-xs font-bold uppercase tracking-wide text-muted mb-3">{isRu ? 'Тип' : 'Type'}</h3>
        <div className="flex flex-col gap-2.5 mb-4">
          {TYPES.map(t => (
            <label key={t} className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
              <input type="checkbox" name="type" value={t} defaultChecked={selected.includes(t)} className="accent-accent" />
              {t}
            </label>
          ))}
        </div>
        <button type="submit" className="w-full bg-accent text-white text-sm font-semibold rounded-lg py-2 hover:opacity-90 transition-opacity">
          {isRu ? 'Применить' : 'Apply'}
        </button>
        {selected.length > 0 && (
          <Link href={`/${locale}/exchanges`} className="block text-center text-xs text-muted hover:text-foreground mt-2">
            {isRu ? 'Сбросить' : 'Reset'}
          </Link>
        )}
      </form>
    );
  }

  return (
    <form action={`/${locale}/exchanges`} className="flex flex-wrap items-center gap-2 mb-6">
      {TYPES.map(t => (
        <label key={t} className="cursor-pointer">
          <input type="checkbox" name="type" value={t} defaultChecked={selected.includes(t)} className="peer sr-only" />
          <span className="block px-3 py-1.5 rounded-full text-xs font-semibold border border-border text-muted peer-checked:bg-accent peer-checked:text-white peer-checked:border-accent transition-colors">
            {t}
          </span>
        </label>
      ))}
      <button type="submit" className="px-3 py-1.5 rounded-full text-xs font-semibold bg-accent text-white hover:opacity-90 transition-opacity">
        {isRu ? 'Применить' : 'Apply'}
      </button>
      {selected.length > 0 && (
        <Link href={`/${locale}/exchanges`} className="text-xs text-muted hover:text-foreground">
          {isRu ? 'Сбросить' : 'Reset'}
        </Link>
      )}
    </form>
  );
}
