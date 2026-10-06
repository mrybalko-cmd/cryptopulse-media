'use client';

import { useState } from 'react';
import type { AdminWidgetSlot, MaterialOption } from '@/lib/admin/data';
import MaterialPicker from '../_shared/MaterialPicker';

/**
 * Подборка блока участников внизу главной.
 *
 * Три списка: крупная работа, три публикации колонками и «Сейчас читают».
 * Каждый можно оставить пустым — тогда эта часть подбирается автоматически,
 * и блок остаётся живым, даже если про него забыли.
 *
 * Сайт двуязычный, поэтому у каждого слота два материала: на сайте показывается
 * тот, что соответствует языку страницы. Оставить одну сторону пустой можно —
 * на второй язык тогда уйдёт автоподбор.
 */

const MAX_ITEMS = 3;
const MAX_READING = 6;

const rowCls =
  'grid grid-cols-[26px_minmax(0,1fr)_minmax(0,1fr)_28px] gap-2 items-center rounded-lg border ' +
  'border-[var(--admin-border)] bg-[var(--admin-panel)] p-2.5';
const hintCls = 'text-[11px] text-[var(--admin-text-dim)] leading-snug';

interface Row {
  key: string;
  ruId: string;
  enId: string;
}

function toRows(slots: AdminWidgetSlot[], prefix: string): Row[] {
  return slots.map((s, i) => ({ key: `${prefix}-${i}`, ruId: s.ruId || '', enId: s.enId || '' }));
}

function SlotList({
  name,
  rows,
  setRows,
  max,
  materialsRu,
  materialsEn,
  addLabel,
}: {
  name: string;
  rows: Row[];
  setRows: (next: Row[]) => void;
  max: number;
  materialsRu: MaterialOption[];
  materialsEn: MaterialOption[];
  addLabel: string;
}) {
  const update = (i: number, patch: Partial<Row>) =>
    setRows(rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));

  const move = (i: number, dir: -1 | 1) => {
    const t = i + dir;
    if (t < 0 || t >= rows.length) return;
    const next = [...rows];
    [next[i], next[t]] = [next[t], next[i]];
    setRows(next);
  };

  return (
    <>
      <div className="flex flex-col gap-2">
        {rows.map((row, i) => (
          <div key={row.key} className={rowCls}>
            <div className="flex flex-col gap-0.5">
              <button
                type="button"
                onClick={() => move(i, -1)}
                disabled={i === 0}
                title="Переместить выше"
                className="text-[11px] leading-none text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] disabled:opacity-25"
              >
                ▲
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                disabled={i === rows.length - 1}
                title="Переместить ниже"
                className="text-[11px] leading-none text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] disabled:opacity-25"
              >
                ▼
              </button>
            </div>

            <MaterialPicker
              name={`${name}_ru_${i}`}
              candidates={materialsRu}
              value={row.ruId}
              onChange={(id) => update(i, { ruId: id })}
              locale="ru"
            />
            <MaterialPicker
              name={`${name}_en_${i}`}
              candidates={materialsEn}
              value={row.enId}
              onChange={(id) => update(i, { enId: id })}
              locale="en"
            />

            <button
              type="button"
              onClick={() => setRows(rows.filter((_, idx) => idx !== i))}
              title="Убрать из блока"
              className="text-[13px] leading-none text-[var(--admin-text-muted)] hover:text-[#f87171]"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {rows.length < max && (
        <button
          type="button"
          onClick={() => setRows([...rows, { key: `${name}-new-${Date.now()}`, ruId: '', enId: '' }])}
          className="mt-2 rounded-lg border border-dashed border-[var(--admin-border)] px-3 py-2 text-[12px] font-bold text-[var(--admin-text-muted)] hover:text-[var(--admin-text)]"
        >
          + {addLabel}
        </button>
      )}
    </>
  );
}

export default function HomeAuthorsWidgetEditor({
  settings,
  materialsRu,
  materialsEn,
}: {
  settings: {
    showAuthorsWidget: boolean;
    widgetHero: AdminWidgetSlot;
    widgetItems: AdminWidgetSlot[];
    widgetReading: AdminWidgetSlot[];
  };
  materialsRu: MaterialOption[];
  materialsEn: MaterialOption[];
}) {
  const [heroRu, setHeroRu] = useState(settings.widgetHero?.ruId || '');
  const [heroEn, setHeroEn] = useState(settings.widgetHero?.enId || '');
  const [items, setItems] = useState<Row[]>(() => toRows(settings.widgetItems || [], 'wi'));
  const [reading, setReading] = useState<Row[]>(() => toRows(settings.widgetReading || [], 'wr'));

  return (
    <div className="mb-8">
      <h2 className="mb-1.5 text-[13px] font-bold text-[var(--admin-text-secondary)]">
        Блок участников внизу главной
      </h2>
      <p className={`${hintCls} mb-4 max-w-[76ch]`}>
        Крупная работа, три публикации колонками и «Сейчас читают» справа. Любой список можно оставить
        пустым — эта часть подберётся сама: крупной работой станет последняя статья с обложкой, в
        колонки встанут свежие работы разных участников, а в «Сейчас читают» — материалы с наибольшим
        числом просмотров. Порядок строк здесь = порядок на сайте.
      </p>

      <label className="mb-5 flex items-center gap-2 text-[12.5px]">
        <input type="checkbox" name="showAuthorsWidget" defaultChecked={settings.showAuthorsWidget} />
        Показывать блок участников
      </label>

      <div className="mb-5">
        <h3 className="mb-1.5 text-[12px] font-bold">Крупная работа</h3>
        <p className={`${hintCls} mb-2`}>Слева в блоке: обложка, заголовок, лид и портрет автора.</p>
        <div className={rowCls}>
          <span />
          <MaterialPicker name="whero_ru_0" candidates={materialsRu} value={heroRu} onChange={setHeroRu} locale="ru" />
          <MaterialPicker name="whero_en_0" candidates={materialsEn} value={heroEn} onChange={setHeroEn} locale="en" />
          <button
            type="button"
            onClick={() => {
              setHeroRu('');
              setHeroEn('');
            }}
            title="Очистить — вернуться к автоподбору"
            className="text-[13px] leading-none text-[var(--admin-text-muted)] hover:text-[#f87171]"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="mb-5">
        <h3 className="mb-1.5 text-[12px] font-bold">Три публикации колонками</h3>
        <p className={`${hintCls} mb-2`}>
          Под крупной работой. Больше трёх не поместится — ряд рассчитан на три колонки.
        </p>
        <SlotList
          name="witem"
          rows={items}
          setRows={setItems}
          max={MAX_ITEMS}
          materialsRu={materialsRu}
          materialsEn={materialsEn}
          addLabel="добавить публикацию"
        />
      </div>

      <div>
        <h3 className="mb-1.5 text-[12px] font-bold">«Сейчас читают»</h3>
        <p className={`${hintCls} mb-2`}>
          Правая колонка. На сайте показываются первые четыре — остальные держатся про запас, чтобы
          быстро поменять местами без поиска.
        </p>
        <SlotList
          name="wread"
          rows={reading}
          setRows={setReading}
          max={MAX_READING}
          materialsRu={materialsRu}
          materialsEn={materialsEn}
          addLabel="добавить материал"
        />
      </div>
    </div>
  );
}
