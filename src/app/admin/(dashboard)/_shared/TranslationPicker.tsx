'use client';

import { useState } from 'react';

interface TranslationCandidate {
  _id: string;
  title: string;
  coverImage: string | null;
}

export default function TranslationPicker({
  candidates,
  defaultValue,
}: {
  candidates: TranslationCandidate[];
  defaultValue?: string;
}) {
  const [value, setValue] = useState(defaultValue ?? '');
  const selected = candidates.find(c => c._id === value);

  return (
    <div className="flex items-center gap-2.5">
      <div className="w-9 h-9 rounded-lg overflow-hidden bg-[var(--admin-input)] border border-[var(--admin-border)] shrink-0">
        {selected?.coverImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={`${selected.coverImage}?w=72&h=72&fit=crop`} alt="" className="w-full h-full object-cover" />
        )}
      </div>
      <select
        name="translationRefId"
        value={value}
        onChange={e => setValue(e.target.value)}
        className="flex-1 min-w-0 bg-[var(--admin-input)] border border-[var(--admin-border)] rounded-lg px-3 py-2.5 text-[13px]"
      >
        <option value="">— нет —</option>
        {candidates.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
      </select>
    </div>
  );
}
