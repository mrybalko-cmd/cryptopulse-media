'use client';

import { useState } from 'react';
import type { BrokerRegulator } from '@/lib/brokerFields';

const smallInputCls = 'w-full bg-[var(--admin-input)] border border-[var(--admin-border)] rounded-lg px-2.5 py-2 text-[12.5px]';

interface Row {
  key: string;
  data?: BrokerRegulator;
}

/** Регуляция брокера: каждая строка пишется вручную, ровно так, как есть у него. */
export default function RegulatorsRepeater({ existing }: { existing: BrokerRegulator[] }) {
  const [rows, setRows] = useState<Row[]>(() => existing.map((r, i) => ({ key: `existing-${i}`, data: r })));

  return (
    <div className="flex flex-col gap-2 mb-2">
      {rows.map((row, i) => {
        const r = row.data;
        return (
          <div key={row.key} className="border border-[var(--admin-border)] rounded-lg p-2.5 bg-[var(--admin-panel)] flex flex-col gap-2">
            <div className="grid grid-cols-[1fr_1.4fr_1fr_auto] gap-2 items-center">
              <input name={`regulator_name_${i}`} defaultValue={r?.name} placeholder="Регулятор: FCA, Великобритания" className={smallInputCls} />
              <input name={`regulator_entity_${i}`} defaultValue={r?.entity ?? ''} placeholder="Компания группы" className={smallInputCls} />
              <input name={`regulator_licence_${i}`} defaultValue={r?.licence ?? ''} placeholder="Номер: FRN 551422" className={smallInputCls} />
              <button
                type="button"
                onClick={() => setRows(prev => prev.filter((_, idx) => idx !== i))}
                className="text-red-400 hover:text-red-300 text-[13px] font-bold px-2"
                title="Удалить"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input name={`regulator_noteRu_${i}`} defaultValue={r?.noteRu ?? ''} placeholder="Пояснение, RU" className={smallInputCls} />
              <input name={`regulator_noteEn_${i}`} defaultValue={r?.noteEn ?? ''} placeholder="Пояснение, EN" className={smallInputCls} />
            </div>
            <div className="grid grid-cols-[1fr_auto] gap-3 items-center">
              <input name={`regulator_url_${i}`} type="url" defaultValue={r?.url ?? ''} placeholder="Ссылка на реестр регулятора" className={smallInputCls} />
              <label className="flex items-center gap-1.5 text-[12px] whitespace-nowrap">
                <input type="checkbox" name={`regulator_tier1_${i}`} defaultChecked={r?.tier1 ?? false} />
                Первый уровень (влияет на порядок)
              </label>
            </div>
          </div>
        );
      })}
      <button
        type="button"
        onClick={() => setRows(prev => [...prev, { key: `new-${Date.now()}-${Math.random()}` }])}
        className="self-start text-[12px] font-bold text-cyan-400 border border-dashed border-cyan-500/40 rounded-lg px-3 py-2 hover:bg-cyan-500/10 transition-colors"
      >
        + Добавить регулятора
      </button>
    </div>
  );
}
