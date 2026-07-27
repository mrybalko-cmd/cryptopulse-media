'use client';

import { useState } from 'react';
import type { ExchangeRegionItem } from '@/lib/admin/data';
import { REGION_TONES } from './toneOptions';

const smallInputCls = 'w-full bg-[var(--admin-input)] border border-[var(--admin-border)] rounded-lg px-2.5 py-2 text-[12.5px]';

interface Row {
  key: string;
  data?: ExchangeRegionItem;
}

export default function RegionsRepeater({ existing }: { existing: ExchangeRegionItem[] }) {
  const [rows, setRows] = useState<Row[]>(() => existing.map((r, i) => ({ key: `existing-${i}`, data: r })));

  return (
    <div className="flex flex-col gap-2 mb-2">
      {rows.map((row, i) => {
        const r = row.data;
        return (
          <div key={row.key} className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr_auto] gap-2 border border-[var(--admin-border)] rounded-lg p-2.5 bg-[var(--admin-panel)] items-center">
            <input name={`region_regionRu_${i}`} defaultValue={r?.regionRu} placeholder="Регион, RU" className={smallInputCls} />
            <input name={`region_regionEn_${i}`} defaultValue={r?.regionEn} placeholder="Регион, EN" className={smallInputCls} />
            <select name={`region_tone_${i}`} defaultValue={r?.tone ?? 'ok'} className={smallInputCls}>
              {REGION_TONES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
            <input name={`region_noteRu_${i}`} defaultValue={r?.noteRu} placeholder="Комментарий, RU" className={smallInputCls} />
            <input name={`region_noteEn_${i}`} defaultValue={r?.noteEn} placeholder="Комментарий, EN" className={smallInputCls} />
            <button
              type="button"
              onClick={() => setRows(prev => prev.filter((_, idx) => idx !== i))}
              className="text-red-400 hover:text-red-300 text-[13px] font-bold px-2"
              title="Удалить"
            >
              ✕
            </button>
          </div>
        );
      })}
      <button
        type="button"
        onClick={() => setRows(prev => [...prev, { key: `new-${Date.now()}-${Math.random()}` }])}
        className="self-start text-[12px] font-bold text-cyan-400 border border-dashed border-cyan-500/40 rounded-lg px-3 py-2 hover:bg-cyan-500/10 transition-colors"
      >
        + Добавить регион
      </button>
    </div>
  );
}
