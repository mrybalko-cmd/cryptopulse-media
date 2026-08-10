'use client';

import { useState } from 'react';
import type { AdminAuthorOption, MaterialOption } from '@/lib/admin/data';
import MaterialPicker from '../_shared/MaterialPicker';

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
      <div className="overflow-x-auto mb-6">
      <div className="flex flex-col gap-2 w-max min-w-full">
        {slots.map((slot, i) => {
          const author = authors.find(a => a._id === slot.authorId);
          const ownMaterialsRu = materialsRu.filter(m => m.authorId === slot.authorId);
          const ownMaterialsEn = materialsEn.filter(m => m.authorId === slot.authorId);
          return (
            <div key={slot.key} className="grid grid-cols-[28px_52px_262px_449px_449px] gap-2 items-center border border-[var(--admin-border)] rounded-lg p-2.5 bg-[var(--admin-panel)]">
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

              {slot.authorId ? (
                <MaterialPicker
                  name={`slot_materialRuId_${i}`}
                  candidates={ownMaterialsRu}
                  value={slot.materialRuId}
                  onChange={id => updateSlot(i, { materialRuId: id })}
                  locale="ru"
                />
              ) : (
                <div className={`${selectCls} text-[var(--admin-text-muted)]`}>— сначала автор —</div>
              )}

              {slot.authorId ? (
                <MaterialPicker
                  name={`slot_materialEnId_${i}`}
                  candidates={ownMaterialsEn}
                  value={slot.materialEnId}
                  onChange={id => updateSlot(i, { materialEnId: id })}
                  locale="en"
                />
              ) : (
                <div className={`${selectCls} text-[var(--admin-text-muted)]`}>— сначала автор —</div>
              )}
            </div>
          );
        })}
      </div>
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
          <div className="relative">
            {/* Same clear-glass treatment as the live widget: the colour sits
                behind the pane, and the pane is transparent enough to show it. */}
            <span
              aria-hidden
              className="pointer-events-none absolute -left-[4%] -top-[40px] h-[160px] w-[360px] rounded-full blur-[48px]"
              style={{ background: 'radial-gradient(50% 50% at 50% 50%, color-mix(in srgb, #8b5cf6 42%, transparent), transparent 70%)' }}
            />
            <span
              aria-hidden
              className="pointer-events-none absolute -right-[3%] -top-[30px] h-[150px] w-[300px] rounded-full blur-[48px]"
              style={{ background: 'radial-gradient(50% 50% at 50% 50%, color-mix(in srgb, #06b6d4 34%, transparent), transparent 70%)' }}
            />
            <section
              className="relative rounded-[18px] p-5 border border-white/[0.16] backdrop-blur-[22px]"
              style={{ background: 'linear-gradient(180deg, rgba(255,255,255,.035), rgba(255,255,255,.012))', boxShadow: 'inset 0 1px 0 rgba(255,255,255,.34)' }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="flex items-center gap-2.5 text-base font-extrabold text-white">
                  <span className="w-7 h-7 rounded-[9px] flex items-center justify-center shrink-0 border border-white/[0.16] text-[#c084fc]"
                    style={{ background: 'linear-gradient(160deg, rgba(255,255,255,.16), rgba(255,255,255,.04))' }}>
                    ✎
                  </span>
                  {previewLocale === 'ru' ? 'Авторские колонки' : 'From our authors'}
                </h3>
                <span className="text-xs font-bold text-[var(--admin-text-muted)]">
                  {previewLocale === 'ru' ? 'Все авторы →' : 'All authors →'}
                </span>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4">
                {previewAuthors.map(({ author, material }, i) => (
                  <div
                    key={author._id + i}
                    className={`relative min-w-0 px-4 first:pl-0 last:pr-0 ${
                      i > 0
                        ? 'before:absolute before:inset-y-0 before:left-0 before:w-px before:bg-[linear-gradient(180deg,transparent,rgba(255,255,255,.16)_20%,rgba(255,255,255,.16)_80%,transparent)]'
                        : ''
                    }`}
                  >
                    <div className="flex items-center gap-[11px] mb-3.5">
                      <span
                        className="relative block shrink-0 rounded-full p-[2px] w-[50px] h-[50px]"
                        style={{ background: 'linear-gradient(140deg, rgba(255,255,255,.34), rgba(255,255,255,.06) 45%, rgba(255,255,255,.16))' }}
                      >
                        {author.photo ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={`${author.photo}?w=112&h=112&fit=crop`} alt="" className="w-full h-full rounded-full object-cover" />
                        ) : (
                          <span className="flex h-full w-full items-center justify-center rounded-full bg-[var(--admin-input)] text-sm font-bold text-[var(--admin-text-muted)]">
                            {author.name.charAt(0)}
                          </span>
                        )}
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-extrabold uppercase tracking-[0.05em] truncate text-white">{author.name}</p>
                        {(previewLocale === 'ru' ? author.roleRu : author.roleEn) && (
                          <p className="text-[11px] truncate text-[var(--admin-text-muted)]">{previewLocale === 'ru' ? author.roleRu : author.roleEn}</p>
                        )}
                      </div>
                    </div>
                    <p className="block text-[12.5px] font-bold leading-[1.35] line-clamp-2 min-h-[37px] text-white">
                      {material.title}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </>
  );
}
