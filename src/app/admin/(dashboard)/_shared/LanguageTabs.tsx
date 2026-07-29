'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LanguageTabs({
  name,
  defaultValue = 'ru',
  mode = 'create',
  translationHref,
}: {
  name: string;
  defaultValue?: 'ru' | 'en';
  // 'create': no document exists yet — the tabs just pick which language the
  // new document will be saved as (original toggle behavior).
  // 'edit': an existing document's language is fixed at creation and can't be
  // relabeled from here — the inactive tab instead navigates to the linked
  // translation document, or is disabled if none is linked yet.
  mode?: 'create' | 'edit';
  translationHref?: string | null;
}) {
  const [value, setValue] = useState(defaultValue);
  const router = useRouter();

  return (
    <div className="flex gap-1 mb-4">
      <input type="hidden" name={name} value={value} />
      {(['ru', 'en'] as const).map(v => {
        const isActive = v === value;
        const disabled = mode === 'edit' && !isActive && !translationHref;
        return (
          <button
            key={v}
            type="button"
            disabled={disabled}
            title={disabled ? `Нет связанной ${v.toUpperCase()}-версии — свяжите через «Перевод» ниже` : undefined}
            onClick={() => {
              if (isActive) return;
              if (mode === 'edit') {
                if (translationHref) router.push(translationHref);
                return;
              }
              setValue(v);
            }}
            className={`text-[11px] font-extrabold px-3 py-1 rounded-md transition-colors ${
              isActive
                ? 'bg-cyan-500/15 text-cyan-400'
                : disabled
                ? 'text-[var(--admin-text-muted)] opacity-40 cursor-not-allowed'
                : 'text-[var(--admin-text-muted)] hover:text-cyan-300 cursor-pointer'
            }`}
          >
            {v.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}
