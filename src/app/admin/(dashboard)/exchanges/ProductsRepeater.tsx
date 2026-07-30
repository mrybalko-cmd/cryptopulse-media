'use client';

import { useState } from 'react';
import ImageField from '../_shared/ImageField';
import type { ExchangeProductItem } from '@/lib/admin/data';

const smallInputCls = 'w-full bg-[var(--admin-input)] border border-[var(--admin-border)] rounded-lg px-2.5 py-2 text-[12.5px]';

interface Row {
  key: string;
  data?: ExchangeProductItem;
}

export default function ProductsRepeater({ existing }: { existing: ExchangeProductItem[] }) {
  const [rows, setRows] = useState<Row[]>(() => existing.map((p, i) => ({ key: `existing-${i}`, data: p })));

  return (
    <div className="flex flex-col gap-3 mb-2">
      {rows.map((row, i) => {
        const p = row.data;
        return (
          <div key={row.key} className="border border-[var(--admin-border)] rounded-lg p-3 bg-[var(--admin-panel)] relative">
            <button
              type="button"
              onClick={() => setRows(prev => prev.filter((_, idx) => idx !== i))}
              className="absolute top-2.5 right-2.5 text-[11px] font-bold text-red-400 hover:text-red-300"
            >
              ✕ Удалить
            </button>
            <input type="hidden" name={`product_existingImageRef_${i}`} value={p?.imageAssetRef ?? ''} />
            <div className="grid grid-cols-2 gap-3 mb-2 pr-20">
              <input name={`product_nameRu_${i}`} defaultValue={p?.nameRu} placeholder="Название, RU" className={smallInputCls} />
              <input name={`product_nameEn_${i}`} defaultValue={p?.nameEn} placeholder="Название, EN" className={smallInputCls} />
            </div>
            <div className="grid grid-cols-2 gap-3 mb-2">
              <input name={`product_shortRu_${i}`} defaultValue={p?.shortRu} placeholder="Короткое описание, RU" className={smallInputCls} />
              <input name={`product_shortEn_${i}`} defaultValue={p?.shortEn} placeholder="Короткое описание, EN" className={smallInputCls} />
            </div>
            <div className="grid grid-cols-2 gap-3 mb-2">
              <textarea name={`product_longRu_${i}`} defaultValue={p?.longRu} placeholder="Полное описание, RU" rows={2} className={smallInputCls} />
              <textarea name={`product_longEn_${i}`} defaultValue={p?.longEn} placeholder="Полное описание, EN" rows={2} className={smallInputCls} />
            </div>
            <ImageField name={`product_image_${i}`} label="Картинка продукта" currentUrl={p?.image} size={72} hint="Рекомендуется ~1600×800 px (2:1), JPG или WebP, до ~1 МБ." />
          </div>
        );
      })}
      <button
        type="button"
        onClick={() => setRows(prev => [...prev, { key: `new-${Date.now()}-${Math.random()}` }])}
        className="self-start text-[12px] font-bold text-cyan-400 border border-dashed border-cyan-500/40 rounded-lg px-3 py-2 hover:bg-cyan-500/10 transition-colors"
      >
        + Добавить продукт
      </button>
    </div>
  );
}
