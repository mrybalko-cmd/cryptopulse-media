'use client';

import { useState } from 'react';
import BoltIcon from '@/components/ui/BoltIcon';

export default function CoverImageField({
  name,
  currentUrl,
  breakingDefault,
  ownBadgeDefault,
}: {
  name: string;
  currentUrl?: string | null;
  /** Pass a boolean (not undefined) to render the live "⚡ Важное" badge + its own
   * checkbox next to the preview — used by News, which has a `breaking` field.
   * Articles have no such field, so they omit this prop entirely. */
  breakingDefault?: boolean;
  /** Same idea for the "⚡ Наш материал" (own-story) badge — shown right next to
   * "Важное" when both apply, matching NewsCard's actual side-by-side layout. */
  ownBadgeDefault?: boolean;
}) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [breaking, setBreaking] = useState(breakingDefault ?? false);
  const [ownBadge, setOwnBadge] = useState(ownBadgeDefault ?? false);
  const showBreakingToggle = breakingDefault !== undefined;
  const showOwnBadgeToggle = ownBadgeDefault !== undefined;
  const displayUrl = previewUrl ?? (currentUrl ? `${currentUrl}?w=640` : null);

  return (
    <div>
      <div className="text-[10.5px] uppercase tracking-wide text-[var(--admin-text-muted)] font-bold mb-2">Обложка (как будет выглядеть на сайте)</div>
      <p className="text-[11px] text-[var(--admin-text-dim)] mb-2 max-w-[340px]">Рекомендуется 1200×675 px (16:9), JPG или WebP, до ~1 МБ.</p>
      <div className="relative w-full max-w-[340px] h-[176px] rounded-lg overflow-hidden bg-[var(--admin-input)] border border-[var(--admin-border)] mb-3">
        {displayUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={displayUrl} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[12px] text-[var(--admin-text-dim)]">Картинка не загружена</div>
        )}
        {(breaking || ownBadge) && (
          <div className="absolute top-2 left-2 flex items-center gap-1.5">
            {breaking && (
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-red-600 text-white text-[10.5px] font-bold">
                <BoltIcon size={10} />
                Важное
              </div>
            )}
            {ownBadge && (
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-red-600 text-white text-[10.5px] font-medium">
                <BoltIcon size={10} className="text-yellow-400" />
                Наш материал
              </div>
            )}
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
        className="w-full max-w-[340px] text-[12.5px] text-[var(--admin-text-muted)]"
      />
      {currentUrl && <p className="text-[11px] text-[var(--admin-text-muted)] mt-1">Оставьте пустым, чтобы не менять текущую картинку.</p>}
      <div className="flex flex-col gap-2 mt-3">
        {showBreakingToggle && (
          <label className="flex items-center gap-2 text-[12.5px]">
            <input type="checkbox" name="breaking" checked={breaking} onChange={e => setBreaking(e.target.checked)} />
            ⚡ Молния (срочная новость)
          </label>
        )}
        {showOwnBadgeToggle && (
          <label className="flex items-center gap-2 text-[12.5px]">
            <input type="checkbox" name="ownBadge" checked={ownBadge} onChange={e => setOwnBadge(e.target.checked)} />
            ⚡ Значок «Наш материал»
          </label>
        )}
      </div>
    </div>
  );
}
