export default function ImageField({
  name,
  label,
  currentUrl,
  size = 96,
  hint,
}: {
  name: string;
  label: string;
  currentUrl?: string | null;
  size?: number;
  /** Recommended dimensions/format line shown under the picker. */
  hint?: string;
}) {
  return (
    <div>
      <div className="text-[10.5px] uppercase tracking-wide text-[var(--admin-text-muted)] font-bold mb-2">{label}</div>
      {hint && <p className="text-[11px] text-[var(--admin-text-dim)] mb-2">{hint}</p>}
      {currentUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`${currentUrl}?w=${size * 2}&h=${size * 2}&fit=crop`}
          alt=""
          style={{ width: size, height: size }}
          className="rounded-lg object-cover mb-2 border border-[var(--admin-border)]"
        />
      )}
      <input name={name} type="file" accept="image/*" className="w-full text-[12.5px] text-[var(--admin-text-muted)]" />
      {currentUrl && <p className="text-[11px] text-[var(--admin-text-muted)] mt-1">Оставьте пустым, чтобы не менять текущую картинку.</p>}
    </div>
  );
}
