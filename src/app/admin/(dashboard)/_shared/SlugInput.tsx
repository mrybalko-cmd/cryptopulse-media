'use client';

import { useState } from 'react';
import { slugify } from '@/lib/admin/slugify';

export default function SlugInput({
  name,
  titleInputName,
  defaultValue,
  label = 'Slug (URL)',
}: {
  name: string;
  titleInputName: string;
  defaultValue?: string;
  label?: string;
}) {
  const [value, setValue] = useState(defaultValue ?? '');

  return (
    <div>
      <label className="text-[11.5px] font-bold text-[#c3c9d6] mb-1.5 block">{label}</label>
      <div className="flex gap-2">
        <input
          name={name}
          value={value}
          onChange={e => setValue(e.target.value)}
          required
          className="flex-1 bg-[#1c202b] border border-[#262b38] rounded-lg px-3 py-2.5 text-[13px] font-mono"
        />
        <button
          type="button"
          onClick={() => {
            const titleEl = document.querySelector<HTMLInputElement>(`[name="${titleInputName}"]`);
            if (titleEl?.value) setValue(slugify(titleEl.value));
          }}
          className="shrink-0 bg-[#1c202b] border border-[#262b38] rounded-lg px-3 text-[12px] font-semibold text-[#c3c9d6] hover:border-cyan-500/40 transition-colors"
        >
          Сгенерировать из названия
        </button>
      </div>
    </div>
  );
}
