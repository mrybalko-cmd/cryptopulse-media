'use client';

import { useState, useTransition } from 'react';
import type { AdminAuthorOption, AdminWidgetSlot, MaterialOption } from '@/lib/admin/data';
import MaterialPicker from '../_shared/MaterialPicker';
import { loadAuthorMaterialsAction } from './actions';

/**
 * Подборка блока участников внизу главной.
 *
 * Строка собирается как в авторских колонках выше: сначала участник, потом его
 * работа на русском и на английском. Выбор участника — инструмент отбора, в
 * базу он не пишется: автора блок берёт из самого материала, и держать вторую
 * копию этой связи значило бы заводить способ их рассинхронизировать.
 *
 * Участника можно и не выбирать: тогда в списке лежат свежие материалы всех
 * авторов, и работает поиск по заголовку.
 */

const MAX_ITEMS = 3;
const MAX_READING = 6;

const selectCls =
  'w-full bg-[var(--admin-input)] border border-[var(--admin-border)] rounded-lg px-2.5 py-2 text-[12.5px]';
const rowCls =
  'grid grid-cols-[26px_44px_minmax(150px,200px)_minmax(0,1fr)_minmax(0,1fr)_28px] gap-2 items-center ' +
  'rounded-lg border border-[var(--admin-border)] bg-[var(--admin-panel)] p-2.5';
const hintCls = 'text-[11px] text-[var(--admin-text-dim)] leading-snug';

interface Row {
  key: string;
  authorId: string;
  ruId: string;
  enId: string;
}

function SlotRow({
  row,
  index,
  name,
  onChange,
  onMove,
  onRemove,
  total,
  authors,
  allRu,
  allEn,
  loadingAuthor,
  ensureMaterials,
  authorOf,
}: {
  row: Row;
  index: number;
  name: string;
  onChange: (patch: Partial<Row>) => void;
  onMove?: (dir: -1 | 1) => void;
  onRemove: () => void;
  total: number;
  authors: AdminAuthorOption[];
  allRu: MaterialOption[];
  allEn: MaterialOption[];
  loadingAuthor: string | null;
  ensureMaterials: (id: string) => void;
  authorOf: (id: string) => string;
}) {
  // Участник берётся из выбранного материала, пока редактор не выбрал его
  // руками: при перезагрузке страницы строка должна выглядеть заполненной.
  const authorId = row.authorId || authorOf(row.ruId) || authorOf(row.enId);
  const author = authors.find((a) => a._id === authorId);
  const loading = loadingAuthor === authorId;
  const ownRu = authorId ? allRu.filter((m) => m.authorId === authorId) : allRu;
  const ownEn = authorId ? allEn.filter((m) => m.authorId === authorId) : allEn;

  return (
    <div className={rowCls}>
      <div className="flex flex-col gap-0.5">
        {onMove ? (
          <>
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
          </>
        ) : (
          <span />
        )}
      </div>

      <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full border border-[var(--admin-border)] bg-[var(--admin-input)]">
        {author?.photo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={`${author.photo}?w=88&h=88&fit=crop`} alt="" className="h-full w-full object-cover" />
        )}
      </div>

      <select
        value={authorId}
        onChange={(e) => {
          // Смена участника сбрасывает материалы: прежние ему не принадлежат.
          onChange({ authorId: e.target.value, ruId: '', enId: '' });
          ensureMaterials(e.target.value);
        }}
        className={selectCls}
      >
        <option value="">— все участники —</option>
        {authors.map((a) => (
          <option key={a._id} value={a._id}>
            {a.name}
          </option>
        ))}
      </select>

      {loading ? (
        <div className={`${selectCls} text-[var(--admin-text-muted)]`}>— загружаем материалы —</div>
      ) : (
        <MaterialPicker
          name={`${name}_ru_${index}`}
          candidates={ownRu}
          value={row.ruId}
          onChange={(id) => onChange({ ruId: id })}
          locale="ru"
        />
      )}

      {loading ? (
        <div className={`${selectCls} text-[var(--admin-text-muted)]`}>— загружаем материалы —</div>
      ) : (
        <MaterialPicker
          name={`${name}_en_${index}`}
          candidates={ownEn}
          value={row.enId}
          onChange={(id) => onChange({ enId: id })}
          locale="en"
        />
      )}

      <button
        type="button"
        onClick={onRemove}
        title="Очистить строку"
        className="text-[13px] leading-none text-[var(--admin-text-muted)] hover:text-[#f87171]"
      >
        ✕
      </button>
    </div>
  );
}


export default function HomeAuthorsWidgetEditor({
  settings,
  authors,
  materialsRu,
  materialsEn,
}: {
  settings: {
    showAuthorsWidget: boolean;
    widgetHero: AdminWidgetSlot;
    widgetItems: AdminWidgetSlot[];
    widgetReading: AdminWidgetSlot[];
  };
  authors: AdminAuthorOption[];
  materialsRu: MaterialOption[];
  materialsEn: MaterialOption[];
}) {
  /* Материалы выбранного участника подтягиваются по требованию и копятся:
     тянуть весь архив на две тысячи записей ради одной строки незачем. */
  const [extraRu, setExtraRu] = useState<MaterialOption[]>([]);
  const [extraEn, setExtraEn] = useState<MaterialOption[]>([]);
  const [loadingAuthor, setLoadingAuthor] = useState<string | null>(null);
  const [, startLoad] = useTransition();

  const allRu = [...materialsRu, ...extraRu];
  const allEn = [...materialsEn, ...extraEn];

  /** Автор уже выбранного материала: иначе при открытии страницы строка
   *  выглядела бы так, будто участник не выбран. */
  const authorOf = (id: string) =>
    (allRu.find((m) => m._id === id) || allEn.find((m) => m._id === id))?.authorId || '';

  function ensureMaterials(authorId: string) {
    if (!authorId) return;
    if (allRu.some((m) => m.authorId === authorId) || allEn.some((m) => m.authorId === authorId)) return;
    setLoadingAuthor(authorId);
    startLoad(async () => {
      const got = await loadAuthorMaterialsAction(authorId);
      setExtraRu((prev) => [...prev, ...got.ru]);
      setExtraEn((prev) => [...prev, ...got.en]);
      setLoadingAuthor(null);
    });
  }

  const [heroRow, setHeroRow] = useState<Row>(() => ({
    key: 'hero',
    authorId: '',
    ruId: settings.widgetHero?.ruId || '',
    enId: settings.widgetHero?.enId || '',
  }));
  const [items, setItems] = useState<Row[]>(() =>
    (settings.widgetItems || []).map((s, i) => ({
      key: `wi-${i}`,
      authorId: '',
      ruId: s.ruId || '',
      enId: s.enId || '',
    }))
  );
  const [reading, setReading] = useState<Row[]>(() =>
    (settings.widgetReading || []).map((s, i) => ({
      key: `wr-${i}`,
      authorId: '',
      ruId: s.ruId || '',
      enId: s.enId || '',
    }))
  );

  const shared = { authors, allRu, allEn, loadingAuthor, ensureMaterials, authorOf };

  const renderList = (
    name: string,
    rows: Row[],
    setRows: (next: Row[]) => void,
    max: number,
    addLabel: string
  ) => {
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
            <SlotRow
              key={row.key}
              row={row}
              index={i}
              name={name}
              total={rows.length}
              onChange={(patch) => setRows(rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r)))}
              onMove={(dir) => move(i, dir)}
              onRemove={() => setRows(rows.filter((_, idx) => idx !== i))}
              {...shared}
            />
          ))}
        </div>
        {rows.length < max && (
          <button
            type="button"
            onClick={() =>
              setRows([...rows, { key: `${name}-new-${Date.now()}`, authorId: '', ruId: '', enId: '' }])
            }
            className="mt-2 rounded-lg border border-dashed border-[var(--admin-border)] px-3 py-2 text-[12px] font-bold text-[var(--admin-text-muted)] hover:text-[var(--admin-text)]"
          >
            + {addLabel}
          </button>
        )}
      </>
    );
  };

  return (
    <div className="mb-8">
      <h2 className="mb-1.5 text-[13px] font-bold text-[var(--admin-text-secondary)]">
        Блок участников внизу главной
      </h2>
      <p className={`${hintCls} mb-4 max-w-[80ch]`}>
        Крупная работа, три публикации колонками и «Сейчас читают» справа. В каждой строке сначала
        выбирается участник — список материалов рядом сразу сужается до его работ. Можно оставить
        «все участники» и найти материал поиском по заголовку. Любой список можно оставить пустым:
        эта часть подберётся сама — крупной работой станет последняя статья с обложкой, в колонки
        встанут свежие работы разных участников, а в «Сейчас читают» уйдут материалы с наибольшим
        числом просмотров. Порядок строк здесь = порядок на сайте.
      </p>

      <label className="mb-5 flex items-center gap-2 text-[12.5px]">
        <input type="checkbox" name="showAuthorsWidget" defaultChecked={settings.showAuthorsWidget} />
        Показывать блок участников
      </label>

      <div className="overflow-x-auto">
        <div className="w-max min-w-full">
          <div className="mb-5">
            <h3 className="mb-1.5 text-[12px] font-bold">Крупная работа</h3>
            <p className={`${hintCls} mb-2`}>Слева в блоке: обложка, заголовок, лид и портрет автора.</p>
            <SlotRow
              row={heroRow}
              index={0}
              name="whero"
              total={1}
              onChange={(patch) => setHeroRow({ ...heroRow, ...patch })}
              onRemove={() => setHeroRow({ ...heroRow, authorId: '', ruId: '', enId: '' })}
              {...shared}
            />
          </div>

          <div className="mb-5">
            <h3 className="mb-1.5 text-[12px] font-bold">Три публикации колонками</h3>
            <p className={`${hintCls} mb-2`}>
              Под крупной работой. Больше трёх не поместится — ряд рассчитан на три колонки.
            </p>
            {renderList('witem', items, setItems, MAX_ITEMS, 'добавить публикацию')}
          </div>

          <div>
            <h3 className="mb-1.5 text-[12px] font-bold">«Сейчас читают»</h3>
            <p className={`${hintCls} mb-2`}>
              Правая колонка. На сайте показываются первые четыре — остальные держатся про запас,
              чтобы быстро поменять местами без поиска.
            </p>
            {renderList('wread', reading, setReading, MAX_READING, 'добавить материал')}
          </div>
        </div>
      </div>
    </div>
  );
}
