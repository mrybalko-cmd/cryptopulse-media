'use client';

import { useState } from 'react';
import type { AdminPickOption } from '@/lib/admin/data';

/**
 * Блок каталога AI на главной: показывать или нет и какие логотипы в ряду.
 *
 * Пусто означает «первые двадцать по месту в рейтинге», и это написано на
 * экране. Иначе пустой список читается как «ничего не показывать», а блок
 * при этом живёт — редактор идёт искать несуществующую поломку.
 */
export default function HomeAiWidgetEditor({
  show,
  services,
  picked,
}: {
  show: boolean;
  services: AdminPickOption[];
  picked: string[];
}) {
  const MAX = 20;
  const [rows, setRows] = useState<string[]>(picked.length ? picked : ['']);

  const set = (i: number, v: string) => setRows(r => r.map((x, k) => (k === i ? v : x)));

  return (
    <section>
      <h2 className="text-[15px] font-bold mb-1.5">Блок AI-сервисов</h2>
      <p className="text-[11.5px] text-[var(--admin-text-muted)] mb-4 max-w-[72ch]">
        Ряд логотипов и кнопка в каталог. Встаёт под блоком регуляции, в самом
        низу главной.
      </p>

      <label className="flex items-center gap-2.5 text-[13px] font-semibold mb-4">
        <input type="checkbox" name="showAiWidget" defaultChecked={show} />
        Показывать блок
      </label>

      <p className="text-[11.5px] text-[var(--admin-text-muted)] mb-2.5 max-w-[72ch]">
        Порядок строк = порядок в ряду. Оставьте пусто — встанут первые двадцать
        по месту в рейтинге. В списке только сервисы с загруженным логотипом:
        плитка с двумя буквами не выполняет задачу ряда — узнать знакомое.
      </p>

      <div className="grid gap-2 max-w-[460px]">
        {rows.map((value, i) => (
          <div key={i} className="flex gap-2 items-center">
            <span className="text-[11px] text-[var(--admin-text-dim)] w-5 tabular-nums">{i + 1}</span>
            <select
              name={`aiservice_${i}`}
              value={value}
              aria-label={`Логотип ${i + 1}`}
              onChange={e => set(i, e.target.value)}
              className="flex-1 bg-[var(--admin-input)] border border-[var(--admin-border)] rounded-lg px-3 py-2 text-[13px]"
            >
              <option value="">— не выбран —</option>
              {services.map(s => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
            <button
              type="button"
              aria-label={`Убрать строку ${i + 1}`}
              onClick={() => setRows(r => (r.length === 1 ? [''] : r.filter((_, k) => k !== i)))}
              className="w-7 h-7 rounded-md border border-[var(--admin-border)] text-[var(--admin-text-muted)]"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {rows.length < MAX && (
        <button
          type="button"
          onClick={() => setRows(r => [...r, ''])}
          className="mt-2.5 border border-[var(--admin-border)] text-[12.5px] font-bold rounded-lg px-3.5 py-2"
        >
          + Ещё логотип
        </button>
      )}
    </section>
  );
}
