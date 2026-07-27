'use client';

import { useState } from 'react';
import type { AdminAuthorOption, MaterialOption } from '@/lib/admin/data';

const selectCls = 'w-full bg-[var(--admin-input)] border border-[var(--admin-border)] rounded-lg px-2.5 py-2 text-[12.5px]';

interface Slot {
  key: string;
  authorId: string;
  materialRuId: string;
  materialEnId: string;
}

export default function HomeAuthorColumnsEditor({
  slotCount,
  authors,
  materialsRu,
  materialsEn,
  initialSlots,
}: {
  slotCount: number;
  authors: AdminAuthorOption[];
  materialsRu: MaterialOption[];
  materialsEn: MaterialOption[];
  initialSlots: { authorId?: string; materialRuId?: string; materialEnId?: string }[];
}) {
  const [slots, setSlots] = useState<Slot[]>(() =>
    Array.from({ length: slotCount }, (_, i) => ({
      key: `slot-${i}`,
      authorId: initialSlots[i]?.authorId ?? '',
      materialRuId: initialSlots[i]?.materialRuId ?? '',
      materialEnId: initialSlots[i]?.materialEnId ?? '',
    }))
  );
  const [previewLocale, setPreviewLocale] = useState<'ru' | 'en'>('ru');

  function updateSlot(i: number, patch: Partial<Slot>) {
    setSlots(prev => prev.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  }

  function moveSlot(i: number, direction: -1 | 1) {
    const target = i + direction;
    if (target < 0 || target >= slots.length) return;
    setSlots(prev => {
      const next = [...prev];
      [next[i], next[target]] = [next[target], next[i]];
      return next;
    });
  }

  const previewAuthors = slots
    .map(slot => {
      const author = authors.find(a => a._id === slot.authorId);
      if (!author) return null;
      const materialId = previewLocale === 'ru' ? slot.materialRuId : slot.materialEnId;
      const materials = previewLocale === 'ru' ? materialsRu : materialsEn;
      const material = materials.find(m => m._id === materialId);
      if (!material) return null;
      return { author, material };
    })
    .filter((x): x is { author: AdminAuthorOption; material: MaterialOption } => x !== null);

  return (
    <>
      <div className="flex flex-col gap-2 mb-6">
        {slots.map((slot, i) => {
          const author = authors.find(a => a._id === slot.authorId);
          const ownMaterialsRu = materialsRu.filter(m => m.authorId === slot.authorId);
          const ownMaterialsEn = materialsEn.filter(m => m.authorId === slot.authorId);
          return (
            <div key={slot.key} className="grid grid-cols-[28px_52px_1fr_1fr_1fr] gap-2 items-center border border-[var(--admin-border)] rounded-lg p-2.5 bg-[var(--admin-panel)]">
              <div className="flex flex-col gap-0.5">
                <button
                  type="button"
                  onClick={() => moveSlot(i, -1)}
                  disabled={i === 0}
                  className="text-[11px] leading-none text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] disabled:opacity-25 disabled:cursor-default"
                  title="Переместить выше"
                >
                  ▲
                </button>
                <button
                  type="button"
                  onClick={() => moveSlot(i, 1)}
                  disabled={i === slots.length - 1}
                  className="text-[11px] leading-none text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] disabled:opacity-25 disabled:cursor-default"
                  title="Переместить ниже"
                >
                  ▼
                </button>
              </div>

              <div className="w-11 h-11 rounded-full overflow-hidden bg-[var(--admin-input)] border border-[var(--admin-border)] shrink-0">
                {author?.photo && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={`${author.photo}?w=88&h=88&fit=crop`} alt="" className="w-full h-full object-cover" />
                )}
              </div>

              <select
                name={`slot_authorId_${i}`}
                value={slot.authorId}
                onChange={e => updateSlot(i, { authorId: e.target.value, materialRuId: '', materialEnId: '' })}
                className={selectCls}
              >
                <option value="">— автор —</option>
                {authors.map(a => <option key={a._id} value={a._id}>{a.name}</option>)}
              </select>

              <select
                name={`slot_materialRuId_${i}`}
                value={slot.materialRuId}
                onChange={e => updateSlot(i, { materialRuId: e.target.value })}
                disabled={!slot.authorId}
                className={selectCls}
              >
                <option value="">{slot.authorId ? '— материал RU —' : '— сначала автор —'}</option>
                {ownMaterialsRu.map(m => <option key={m._id} value={m._id}>{m.title}</option>)}
              </select>

              <select
                name={`slot_materialEnId_${i}`}
                value={slot.materialEnId}
                onChange={e => updateSlot(i, { materialEnId: e.target.value })}
                disabled={!slot.authorId}
                className={selectCls}
              >
                <option value="">{slot.authorId ? '— материал EN —' : '— сначала автор —'}</option>
                {ownMaterialsEn.map(m => <option key={m._id} value={m._id}>{m.title}</option>)}
              </select>
            </div>
          );
        })}
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <h2 className="text-[13px] font-bold text-[var(--admin-text-secondary)]">Предпросмотр — как будет выглядеть на главной</h2>
          <div className="flex gap-1 bg-[var(--admin-input)] border border-[var(--admin-border)] rounded-lg p-1">
            {(['ru', 'en'] as const).map(l => (
              <button
                type="button"
                key={l}
                onClick={() => setPreviewLocale(l)}
                className={`text-[11px] font-bold px-3 py-1.5 rounded-md transition-colors ${previewLocale === l ? 'bg-[var(--admin-border)] text-[var(--admin-text)]' : 'text-[var(--admin-text-muted)]'}`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {previewAuthors.length === 0 ? (
          <p className="text-[12px] text-[var(--admin-text-muted)]">Выберите автора и материалы хотя бы для одной строки, чтобы увидеть предпросмотр.</p>
        ) : (
          <section
            className="rounded-xl p-5 sm:p-6"
            style={{ background: 'linear-gradient(135deg, var(--author-bg-1), var(--author-bg-2))', border: '1px solid var(--author-border)' }}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="flex items-center gap-2.5 text-base font-bold" style={{ color: 'var(--author-text)' }}>
                <span className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'color-mix(in srgb, var(--author-accent) 20%, transparent)' }}>
                  ✎
                </span>
                {previewLocale === 'ru' ? 'Авторские колонки' : 'From our authors'}
              </h3>
              <span className="text-xs font-medium" style={{ color: 'var(--author-accent)' }}>
                {previewLocale === 'ru' ? 'Все авторы →' : 'All authors →'}
              </span>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-6">
              {previewAuthors.map(({ author, material }, i) => (
                <div
                  key={author._id + i}
                  className={i > 0 ? 'border-t lg:border-t-0 lg:border-l pt-5 lg:pt-0 lg:pl-5' : ''}
                  style={i > 0 ? { borderColor: 'var(--author-border)' } : undefined}
                >
                  <div className="flex items-center gap-3 mb-3">
                    {author.photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={`${author.photo}?w=112&h=112&fit=crop`}
                        alt=""
                        className="w-14 h-14 rounded-full object-cover border-2 shrink-0"
                        style={{ borderColor: 'color-mix(in srgb, var(--author-accent) 33%, transparent)' }}
                      />
                    ) : (
                      <div
                        className="w-14 h-14 rounded-full border-2 flex items-center justify-center shrink-0"
                        style={{ background: 'color-mix(in srgb, var(--author-accent) 10%, transparent)', borderColor: 'color-mix(in srgb, var(--author-accent) 33%, transparent)' }}
                      >
                        <span className="text-base font-bold" style={{ color: 'var(--author-accent)' }}>{author.name.charAt(0)}</span>
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-xs font-bold uppercase tracking-wide truncate" style={{ color: 'var(--author-text)' }}>{author.name}</p>
                      {(previewLocale === 'ru' ? author.roleRu : author.roleEn) && (
                        <p className="text-[11px] truncate" style={{ color: 'var(--author-muted)' }}>{previewLocale === 'ru' ? author.roleRu : author.roleEn}</p>
                      )}
                    </div>
                  </div>
                  <p className="block text-xs font-semibold leading-snug line-clamp-2" style={{ color: 'var(--author-link)' }}>
                    {material.title}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
