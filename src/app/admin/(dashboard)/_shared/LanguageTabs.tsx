'use client';

import { useState } from 'react';

export default function LanguageTabs({
  name,
  defaultValue = 'ru',
}: {
  name: string;
  defaultValue?: 'ru' | 'en';
}) {
  const [value, setValue] = useState(defaultValue);

  return (
    <div className="flex gap-1 mb-4">
      <input type="hidden" name={name} value={value} />
      {(['ru', 'en'] as const).map(v => (
        <button
          key={v}
          type="button"
          onClick={() => setValue(v)}
          className={`text-[11px] font-extrabold px-3 py-1 rounded-md transition-colors ${
            value === v ? 'bg-cyan-500/15 text-cyan-400' : 'text-[var(--admin-text-muted)]'
          }`}
        >
          {v.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
