'use client';

import { useState } from 'react';
import type { AdminPickOption } from '@/lib/admin/data';

/**
 * Подборка нижнего блока главной: страны и лицензионные режимы.
 *
 * Строка — это выпадающий список и стрелки порядка, без пар по языкам: у
 * страны и у режима обе версии лежат в одном документе, в отличие от
 * материалов, где русский и английский — разные записи.
 *
 * Пустая подборка — рабочее состояние, а не недоделка: блок тогда берёт
 * страны с самой свежей проверкой и режимы по порядку из хаба.
 */

const MAX_COUNTRIES = 5;
const MAX_REGIMES = 4;

const selectCls =
  'w-full bg-[var(--admin-input)] border border-[var(--admin-border)] rounded-lg px-2.5 py-2 text-[12.5px]';
const hintCls = 'text-[11px] text-[var(--admin-text-dim)] leading-snug';

/* Объявлена снаружи компонента намеренно: внутри React пересоздавал бы её
   на каждый ввод, строка размонтировалась бы и теряла фокус. */
function PickRow({
  value,
  index,
  name,
  options,
  total,
  onChange,
  onMove,
  onRemove,
}: {
  value: string;
  index: number;
  name: string;
  options: AdminPickOption[];
  total: number;
  onChange: (id: string) => void;
  onMove: (dir: -1 | 1) => void;
  onRemove: () => void;
}) {
  return (
    <div className="grid grid-cols-[26px_24px_minmax(0,1fr)_28px] items-center gap-2 rounded-lg border border-[var(--admin-border)] bg-[var(--admin-panel)] p-2.5">
      <div className="flex flex-col gap-0.5">
        <button
          type="button"
          onClick={() => onMove(-1)}
          disabled={index === 0}
          title="Переместить выше"
          className="text-[11px] leading-none text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] disabled:opacity-25"
        >
          ▲
        </button>
        <button
          type="button"
          onClick={() => onMove(1)}
          disabled={index === total - 1}
          title="Переместить ниже"
          className="text-[11px] leading-none text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] disabled:opacity-25"
        >
          ▼
        </button>
      </div>

      <span className="text-center text-[11px] font-bold tabular-nums text-[var(--admin-text-muted)]">
        {index + 1}
      </span>

      <select name={`${name}_${index}`} value={value} onChange={e => onChange(e.target.value)} className={selectCls}>
        <option value="">— не выбрано —</option>
        {options.map(o => (
          <option key={o.id} value={o.id}>
            {o.label}
          </option>
        ))}
      </select>

      <button
        type="button"
        onClick={onRemove}
        title="Убрать строку"
        className="text-[13px] leading-none text-[var(--admin-text-muted)] hover:text-[#f87171]"
      >
        ✕
      </button>
    </div>
  );
}

function PickList({
  title,
  hint,
  name,
  max,
  options,
  initial,
  addLabel,
}: {
  title: string;
  hint: string;
  name: string;
  max: number;
  options: AdminPickOption[];
  initial: string[];
  addLabel: string;
}) {
  const [rows, setRows] = useState<string[]>(initial);

  const move = (i: number, dir: -1 | 1) => {
    const t = i + dir;
    if (t < 0 || t >= rows.length) return;
    const next = [...rows];
    [next[i], next[t]] = [next[t], next[i]];
    setRows(next);
  };

  return (
    <div className="mb-5">
      <h3 className="mb-1.5 text-[12px] font-bold">{title}</h3>
      <p className={`${hintCls} mb-2`}>{hint}</p>
      <div className="flex flex-col gap-2">
        {rows.map((value, i) => (
          <PickRow
            key={`${name}-${i}`}
            value={value}
            index={i}
            name={name}
            options={options}
            total={rows.length}
            onChange={id => setRows(rows.map((r, idx) => (idx === i ? id : r)))}
            onMove={dir => move(i, dir)}
            onRemove={() => setRows(rows.filter((_, idx) => idx !== i))}
          />
        ))}
      </div>
      {rows.length < max && (
        <button
          type="button"
          onClick={() => setRows([...rows, ''])}
          className="mt-2 rounded-lg border border-dashed border-[var(--admin-border)] px-3 py-2 text-[12px] font-bold text-[var(--admin-text-muted)] hover:text-[var(--admin-text)]"
        >
          + {addLabel}
        </button>
      )}
    </div>
  );
}

export default function HomeRegulationWidgetEditor({
  show,
  countries,
  regimes,
  pickedCountries,
  pickedRegimes,
}: {
  show: boolean;
  countries: AdminPickOption[];
  regimes: AdminPickOption[];
  pickedCountries: string[];
  pickedRegimes: string[];
}) {
  return (
    <div className="mb-8">
      <h2 className="mb-1.5 text-[13px] font-bold text-[var(--admin-text-secondary)]">
        Блок регуляции в самом низу главной
      </h2>
      <p className={`${hintCls} mb-4 max-w-[80ch]`}>
        Карта мира слева, выбранные страны в середине, лицензионные режимы справа. Порядок строк
        здесь = порядок на сайте. Любой список можно оставить пустым: тогда в середину встанут
        страны с самой свежей проверкой, а справа — режимы по порядку из раздела лицензий. Режим,
        скрытый в Studio, пропадает отсюда и с сайта сам.
      </p>

      <label className="mb-5 flex items-center gap-2 text-[12.5px]">
        <input type="checkbox" name="showRegulationWidget" defaultChecked={show} />
        Показывать блок регуляции
      </label>

      <PickList
        title="Страны"
        hint="Середина блока, до пяти. В списке только страны со своей страницей — остальным некуда вести."
        name="regcountry"
        max={MAX_COUNTRIES}
        options={countries}
        initial={pickedCountries}
        addLabel="добавить страну"
      />

      <PickList
        title="Лицензии"
        hint="Правая колонка, до четырёх. На телефоне идут лентой вбок."
        name="regregime"
        max={MAX_REGIMES}
        options={regimes}
        initial={pickedRegimes}
        addLabel="добавить режим"
      />
    </div>
  );
}
