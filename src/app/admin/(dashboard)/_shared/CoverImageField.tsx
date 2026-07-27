'use client';

import { useState } from 'react';
import { Zap } from 'lucide-react';

export default function CoverImageField({
  name,
  currentUrl,
  breakingDefault,
}: {
  name: string;
  currentUrl?: string | null;
  /** Pass a boolean (not undefined) to render the live "⚡ Важное" badge + its own
   * checkbox next to the preview — used by News, which has a `breaking` field.
   * Articles have no such field, so they omit this prop entirely. */
  breakingDefault?: boolean;
}) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [breaking, setBreaking] = useState(breakingDefault ?? false);
  const showBreakingToggle = breakingDefault !== undefined;
  const displayUrl = previewUrl ?? (currentUrl ? `${currentUrl}?w=1200` : null);

  return (
    <div>
      <div className="text-[10.5px] uppercase tracking-wide text-[var(--admin-text-muted)] font-bold mb-2">Обложка</div>
      <div className="relative w-full h-56 sm:h-64 rounded-xl overflow-hidden bg-[var(--admin-input)] border border-[var(--admin-border)] mb-3">
        {displayUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={displayUrl} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[12px] text-[var(--admin-text-dim)]">Картинка не загружена</div>
        )}
        {breaking && (
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-600 text-white text-[11px] font-bold">
            <Zap size={11} fill="currentColor" />
            Важное
          </div>
        )}
      </div>
      <input
        name={name}
        type="file"
        accept="image/*"
        onChange={e => {
          const file = e.target.files?.[0];
          setPreviewUrl(file ? URL.createObjectURL(file) : null);
        }}
        className="w-full text-[12.5px] text-[var(--admin-text-muted)]"
      />
      {currentUrl && <p className="text-[11px] text-[var(--admin-text-muted)] mt-1">Оставьте пустым, чтобы не менять текущую картинку.</p>}
      {showBreakingToggle && (
        <label className="flex items-center gap-2 text-[12.5px] mt-3">
          <input type="checkbox" name="breaking" checked={breaking} onChange={e => setBreaking(e.target.checked)} />
          ⚡ Молния (срочная новость) — как будет выглядеть бейдж на карточке
        </label>
      )}
    </div>
  );
}
