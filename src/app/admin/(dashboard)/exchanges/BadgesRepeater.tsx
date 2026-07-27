'use client';

import { useState } from 'react';
import type { ExchangeBadgeItem } from '@/lib/admin/data';
import { BADGE_TONES } from './toneOptions';

const smallInputCls = 'w-full bg-[var(--admin-input)] border border-[var(--admin-border)] rounded-lg px-2.5 py-2 text-[12.5px]';

interface Row {
  key: string;
  data?: ExchangeBadgeItem;
}

export default function BadgesRepeater({ existing }: { existing: ExchangeBadgeItem[] }) {
  const [rows, setRows] = useState<Row[]>(() => existing.map((b, i) => ({ key: `existing-${i}`, data: b })));

  return (
    <div className="flex flex-col gap-2 mb-2">
      {rows.map((row, i) => {
        const b = row.data;
        return (
          <div key={row.key} className="grid grid-cols-[1fr_1fr_1fr_1fr_auto] gap-2 border border-[var(--admin-border)] rounded-lg p-2.5 bg-[var(--admin-panel)] items-center">
            <input name={`badge_textRu_${i}`} defaultValue={b?.textRu} placeholder="Текст, RU" className={smallInputCls} />
            <input name={`badge_textEn_${i}`} defaultValue={b?.textEn} placeholder="Текст, EN" className={smallInputCls} />
            <select name={`badge_tone_${i}`} defaultValue={b?.tone ?? 'off'} className={smallInputCls}>
              {BADGE_TONES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
            <input name={`badge_link_${i}`} defaultValue={b?.link} placeholder="Ссылка (необяз.)" className={smallInputCls} />
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
        + Добавить плашку
      </button>
    </div>
  );
}
