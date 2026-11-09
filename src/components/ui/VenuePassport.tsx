export interface PassportCell {
  label: string;
  value: string | null | undefined;
  note?: string | null;
  /** Ссылка на источник: реестр, отчёт о резервах. */
  href?: string | null;
  /** На телефоне эта цифра уже стоит в плитках под шапкой. */
  desktopOnly?: boolean;
}

/** Золотой паспорт площадки. На телефоне строки «название — значение», на десктопе сетка. */
export default function VenuePassport({ cells, isRu }: { cells: PassportCell[]; isRu: boolean }) {
  return (
    <dl className="grid grid-cols-1 md:grid-cols-4 md:rounded-2xl md:overflow-hidden md:border md:border-[color-mix(in_srgb,var(--passport-gold)_40%,transparent)] md:bg-[linear-gradient(180deg,color-mix(in_srgb,var(--passport-gold)_10%,transparent),color-mix(in_srgb,var(--passport-gold)_3%,transparent))]">
      {cells.map(cell => (
        <div
          key={cell.label}
          className={`min-w-0 items-baseline justify-between gap-4 py-2 border-b last:border-b-0 border-[color-mix(in_srgb,var(--passport-gold)_16%,transparent)] md:block md:px-3 md:py-2.5 md:border-r md:last:border-b ${cell.desktopOnly ? 'hidden' : 'flex'}`}
        >
          <dt className="shrink-0 text-[10px] font-extrabold uppercase tracking-[0.08em] text-[var(--passport-gold)] md:mb-0.5">{cell.label}</dt>
          {cell.value ? (
            <dd className="min-w-0 text-right md:text-left text-sm font-bold text-foreground leading-snug break-words">
              {cell.value}
              {cell.note && <span className="block text-[11px] font-normal text-muted mt-0.5">{cell.note}</span>}
              {cell.href && (
                <a href={cell.href} target="_blank" rel="noopener noreferrer" className="block text-[11px] font-semibold text-[var(--violet-2)] hover:underline mt-0.5">
                  {isRu ? 'Источник ↗' : 'Source ↗'}
                </a>
              )}
            </dd>
          ) : (
            <dd className="min-w-0 text-right md:text-left text-xs text-muted leading-snug">{isRu ? 'нет подтверждённых данных' : 'no confirmed data'}</dd>
          )}
        </div>
      ))}
    </dl>
  );
}
