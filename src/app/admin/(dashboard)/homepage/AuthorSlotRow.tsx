'use client';

import { useState } from 'react';
import type { AdminAuthorOption, MaterialOption } from '@/lib/admin/data';

const selectCls = 'w-full bg-[var(--admin-input)] border border-[var(--admin-border)] rounded-lg px-2.5 py-2 text-[12.5px]';

export default function AuthorSlotRow({
  index,
  authors,
  materialsRu,
  materialsEn,
  defaultAuthorId,
  defaultMaterialRuId,
  defaultMaterialEnId,
}: {
  index: number;
  authors: AdminAuthorOption[];
  materialsRu: MaterialOption[];
  materialsEn: MaterialOption[];
  defaultAuthorId?: string;
  defaultMaterialRuId?: string;
  defaultMaterialEnId?: string;
}) {
  const [authorId, setAuthorId] = useState(defaultAuthorId ?? '');
  const author = authors.find(a => a._id === authorId);

  return (
    <div className="grid grid-cols-[52px_1fr_1fr_1fr] gap-2 items-center border border-[var(--admin-border)] rounded-lg p-2.5 bg-[var(--admin-panel)]">
      <div className="w-11 h-11 rounded-full overflow-hidden bg-[var(--admin-input)] border border-[var(--admin-border)] shrink-0">
        {author?.photo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={`${author.photo}?w=88&h=88&fit=crop`} alt="" className="w-full h-full object-cover" />
        )}
      </div>
      <select
        name={`slot_authorId_${index}`}
        value={authorId}
        onChange={e => setAuthorId(e.target.value)}
        className={selectCls}
      >
        <option value="">— автор —</option>
        {authors.map(a => <option key={a._id} value={a._id}>{a.name}</option>)}
      </select>
      <select name={`slot_materialRuId_${index}`} defaultValue={defaultMaterialRuId ?? ''} className={selectCls}>
        <option value="">— материал RU —</option>
        {materialsRu.map(m => <option key={m._id} value={m._id}>{m.authorName ? `${m.authorName} — ` : ''}{m.title}</option>)}
      </select>
      <select name={`slot_materialEnId_${index}`} defaultValue={defaultMaterialEnId ?? ''} className={selectCls}>
        <option value="">— материал EN —</option>
        {materialsEn.map(m => <option key={m._id} value={m._id}>{m.authorName ? `${m.authorName} — ` : ''}{m.title}</option>)}
      </select>
    </div>
  );
}
