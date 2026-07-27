'use client';

import { useState } from 'react';
import type { AdminAuthorOption } from '@/lib/admin/data';

export default function AuthorPicker({
  authors,
  defaultValue,
}: {
  authors: AdminAuthorOption[];
  defaultValue?: string;
}) {
  const [authorId, setAuthorId] = useState(defaultValue ?? '');
  const author = authors.find(a => a._id === authorId);

  return (
    <div className="flex items-center gap-2.5">
      <div className="w-9 h-9 rounded-full overflow-hidden bg-[var(--admin-input)] border border-[var(--admin-border)] shrink-0">
        {author?.photo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={`${author.photo}?w=72&h=72&fit=crop`} alt="" className="w-full h-full object-cover" />
        )}
      </div>
      <select
        name="authorId"
        value={authorId}
        onChange={e => setAuthorId(e.target.value)}
        className="flex-1 min-w-0 bg-[var(--admin-input)] border border-[var(--admin-border)] rounded-lg px-2.5 py-2 text-[12.5px]"
      >
        <option value="">— без автора —</option>
        {authors.map(a => <option key={a._id} value={a._id}>{a.name}</option>)}
      </select>
    </div>
  );
}
