'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import type { AdminAiJob } from '@/lib/admin/aiData';
import SubmitButton from '../../_shared/SubmitButton';
import SavedMark from '../../_shared/SavedMark';

/**
 * Задача и её признаки фильтра.
 *
 * Ключ отделён от подписи, и это главное в форме. Подпись правится когда
 * угодно и меняется сразу везде — в хабе, в подборках, на странице сервиса.
 * Ключ остаётся прежним, поэтому уже расставленные у карточек галочки не
 * слетают. Поменять ключ у заведённого признака означает отвязать его от всех
 * карточек разом, поэтому поле ключа у существующих пунктов закрыто.
 *
 * Новый ключ проверяется на занятость по всему каталогу: один ключ не должен
 * значить разное в двух группах, иначе фильтр начнёт отбирать не то.
 */

const FIELD = 'w-full bg-[var(--admin-input)] border border-[var(--admin-border)] rounded-lg px-3 py-2 text-[13px]';
const LABEL = 'block text-[10.5px] uppercase tracking-wide text-[var(--admin-text-dim)] mb-1.5 font-bold';
const HINT = 'text-[11px] text-[var(--admin-text-muted)] mt-1 leading-relaxed';

const ICONS = [
  ['pen', 'Перо — текст'], ['mic', 'Микрофон — голосовой ввод'], ['wave', 'Волна — расшифровка'],
  ['image', 'Картинка — изображения'], ['film', 'Плёнка — видео'], ['mega', 'Рупор — креативы'],
  ['volume', 'Динамик — озвучка'], ['user', 'Человек — аватары'], ['code', 'Скобки — код'],
  ['deck', 'Экран — презентации'], ['zap', 'Молния — автоматизация'], ['search', 'Лупа — поиск'],
  ['grid', 'Сетка — прочее'],
] as const;

interface Item { rowKey: string; key: string; ru: string; en: string; existing: boolean }
interface Group { rowKey: string; ru: string; en: string; scope: string; open: boolean; items: Item[] }

export default function AiJobForm({
  job,
  takenKeys,
  action,
  deleteAction,
  usedBy,
}: {
  job?: AdminAiJob;
  /** Ключи, занятые в других задачах: новый не должен их повторять. */
  takenKeys: Record<string, string>;
  action: (formData: FormData) => void;
  deleteAction?: () => void;
  usedBy?: number;
}) {
  const nextKey = useRef(0);
  const uid = () => `n${nextKey.current++}`;

  const [groups, setGroups] = useState<Group[]>(() =>
    job?.facetGroups.length
      ? job.facetGroups.map((g, gi) => ({
          rowKey: `g${gi}`,
          ru: g.titleRu, en: g.titleEn, scope: g.scope, open: g.openByDefault,
          items: g.items.map((f, fi) => ({
            rowKey: `g${gi}f${fi}`, key: f.key, ru: f.labelRu, en: f.labelEn, existing: true,
          })),
        }))
      : []
  );

  const setGroup = (rowKey: string, patch: Partial<Group>) =>
    setGroups(v => v.map(g => (g.rowKey === rowKey ? { ...g, ...patch } : g)));
  const setItem = (gKey: string, iKey: string, patch: Partial<Item>) =>
    setGroups(v => v.map(g => g.rowKey === gKey
      ? { ...g, items: g.items.map(i => (i.rowKey === iKey ? { ...i, ...patch } : i)) }
      : g));

  // Свои ключи считаются по форме, чужие приходят с сервера. Повтор внутри
  // одной задачи так же вреден, как и между задачами.
  const own = new Map<string, number>();
  for (const g of groups) for (const i of g.items) if (i.key) own.set(i.key, (own.get(i.key) ?? 0) + 1);
  const problem = (it: Item): string | null => {
    if (!it.key) return null;
    if (!/^[a-z0-9_-]{1,24}$/.test(it.key)) return 'Только латиница, цифры и дефис, до 24 знаков';
    if ((own.get(it.key) ?? 0) > 1) return 'Такой ключ уже есть в этой задаче';
    const where = takenKeys[it.key];
    if (where && !it.existing) return `Ключ занят: ${where}`;
    return null;
  };
  const broken = groups.some(g => g.items.some(i => problem(i)));

  return (
    <form action={action} className="max-w-[920px]">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={LABEL} htmlFor="name_ru">Название · RU</label>
          <input id="name_ru" name="name_ru" required defaultValue={job?.nameRu} className={FIELD}
            placeholder="Генерация видео" />
        </div>
        <div>
          <label className={LABEL} htmlFor="name_en">Название · EN</label>
          <input id="name_en" name="name_en" required defaultValue={job?.nameEn} className={FIELD}
            placeholder="Video generation" />
        </div>
        <div>
          <label className={LABEL} htmlFor="slug">Адрес</label>
          <input id="slug" name="slug" required defaultValue={job?.slug} pattern="[a-z0-9]+(-[a-z0-9]+)*"
            className={FIELD} placeholder="video" />
          <p className={HINT}>Один на оба языка. Из него собирается адрес подборки.</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={LABEL} htmlFor="icon">Иконка</label>
            <select id="icon" name="icon" defaultValue={job?.icon ?? 'grid'} className={FIELD}>
              {ICONS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>
          <div>
            <label className={LABEL} htmlFor="order">Порядок</label>
            <input id="order" name="order" inputMode="numeric" defaultValue={job?.order ?? 100} className={FIELD} />
            <p className={HINT}>Меньше — левее.</p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label className={LABEL} htmlFor="intro_ru">Текст подборки · RU</label>
          <textarea id="intro_ru" name="intro_ru" rows={4} defaultValue={job?.introRu} className={FIELD} />
        </div>
        <div>
          <label className={LABEL} htmlFor="intro_en">Текст подборки · EN</label>
          <textarea id="intro_en" name="intro_en" rows={4} defaultValue={job?.introEn} className={FIELD} />
        </div>
        <div>
          <label className={LABEL} htmlFor="sorted_ru">Как отсортировано · RU</label>
          <input id="sorted_ru" name="sorted_ru" defaultValue={job?.sortedByRu} className={FIELD} />
          <p className={HINT}>
            Пишется на странице открытым текстом. Оценок «9,2 из 10» у нас нет:
            своих замеров нет, а выдуманная оценка подрывает доверие и ко всему
            остальному.
          </p>
        </div>
        <div>
          <label className={LABEL} htmlFor="sorted_en">Как отсортировано · EN</label>
          <input id="sorted_en" name="sorted_en" defaultValue={job?.sortedByEn} className={FIELD} />
        </div>
      </div>

      {/* ── Группы признаков ──────────────────────────────────── */}
      <div className="mt-8 pt-7 border-t border-[var(--admin-border)]">
        <h2 className="text-[15px] font-bold mb-1.5">Группы признаков</h2>
        <p className="text-[11.5px] text-[var(--admin-text-muted)] mb-4 max-w-[78ch]">
          Общие группы — «Цена», «Где работает» — достаточно завести один раз
          в любой задаче: они собираются в один список и показываются везде.
          В хабе пункт появляется, только когда его имеют минимум две компании
          этой задачи, и в группе их остаётся не больше семи — поэтому заводить
          признак «на будущее» безопасно, он просто подождёт второй карточки.
        </p>

        {groups.map((g, gi) => (
          <fieldset key={g.rowKey} className="m-0 mb-3 p-3.5 border border-[var(--admin-border)] rounded-xl">
            <legend className="text-[10.5px] uppercase tracking-wide text-[var(--admin-text-dim)] px-1.5 font-bold">
              Группа {gi + 1}
            </legend>
            <div className="grid gap-3 sm:grid-cols-2 mb-3">
              <input name="g_title_ru" value={g.ru} aria-label={`Заголовок группы ${gi + 1}, русский`}
                placeholder="Заголовок · RU" className={FIELD}
                onChange={e => setGroup(g.rowKey, { ru: e.target.value })} />
              <input name="g_title_en" value={g.en} aria-label={`Заголовок группы ${gi + 1}, английский`}
                placeholder="Заголовок · EN" className={FIELD}
                onChange={e => setGroup(g.rowKey, { en: e.target.value })} />
            </div>
            <div className="flex gap-4 items-center flex-wrap mb-3">
              <select name="g_scope" value={g.scope} aria-label={`Где показывать группу ${gi + 1}`}
                className={`${FIELD} max-w-[280px]`}
                onChange={e => setGroup(g.rowKey, { scope: e.target.value })}>
                <option value="task">Только у этой задачи</option>
                <option value="global">У всех задач — общая</option>
              </select>
              <label className="flex items-center gap-2 text-[12.5px] font-semibold">
                <input type="checkbox" name="g_open" value={String(gi)} checked={g.open}
                  onChange={e => setGroup(g.rowKey, { open: e.target.checked })} />
                Раскрыта сразу
              </label>
              <button type="button"
                onClick={() => setGroups(v => v.filter(x => x.rowKey !== g.rowKey))}
                className="ml-auto text-[12px] font-bold text-red-400 border border-red-400/30 rounded-lg px-3 py-1.5">
                Убрать группу
              </button>
            </div>

            <table className="w-full text-[12.5px] border-collapse">
              <thead>
                <tr className="text-[10px] uppercase tracking-wide text-[var(--admin-text-dim)]">
                  <th className="text-left font-bold pb-1.5 w-[150px]">Ключ</th>
                  <th className="text-left font-bold pb-1.5">Подпись · RU</th>
                  <th className="text-left font-bold pb-1.5">Подпись · EN</th>
                  <th className="w-[36px]" />
                </tr>
              </thead>
              <tbody>
                {g.items.map((it, ii) => {
                  const err = problem(it);
                  return (
                    <tr key={it.rowKey} className="align-top">
                      <td className="pr-2 py-1">
                        <input type="hidden" name="i_group" value={String(gi)} />
                        <input name="i_key" value={it.key} readOnly={it.existing}
                          aria-label={`Ключ признака ${ii + 1} группы ${gi + 1}`}
                          className={`${FIELD} font-mono text-[11.5px] ${it.existing ? 'opacity-60' : ''} ${err ? 'border-red-400' : ''}`}
                          onChange={e => setItem(g.rowKey, it.rowKey, { key: e.target.value.trim().toLowerCase() })} />
                        {err && <p className="text-[10.5px] text-red-400 mt-1">{err}</p>}
                      </td>
                      <td className="pr-2 py-1">
                        <input name="i_ru" value={it.ru} aria-label={`Подпись признака ${ii + 1}, русский`}
                          className={FIELD} onChange={e => setItem(g.rowKey, it.rowKey, { ru: e.target.value })} />
                      </td>
                      <td className="pr-2 py-1">
                        <input name="i_en" value={it.en} aria-label={`Подпись признака ${ii + 1}, английский`}
                          className={FIELD} onChange={e => setItem(g.rowKey, it.rowKey, { en: e.target.value })} />
                      </td>
                      <td className="py-1 text-center">
                        <button type="button" aria-label={`Убрать признак ${ii + 1}`}
                          onClick={() => setGroups(v => v.map(x => x.rowKey === g.rowKey
                            ? { ...x, items: x.items.filter(y => y.rowKey !== it.rowKey) } : x))}
                          className="w-7 h-7 rounded-md border border-[var(--admin-border)] text-[var(--admin-text-muted)]">
                          ✕
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <button type="button"
              onClick={() => setGroup(g.rowKey, {
                items: [...g.items, { rowKey: uid(), key: '', ru: '', en: '', existing: false }],
              })}
              className="mt-2 border border-[var(--admin-border)] text-[12px] font-bold rounded-lg px-3 py-1.5">
              + Признак
            </button>
            <FreshNote group={g} />
          </fieldset>
        ))}

        <button type="button"
          onClick={() => setGroups(v => [...v, { rowKey: uid(), ru: '', en: '', scope: 'task', open: false, items: [] }])}
          className="border border-[var(--admin-border)] text-[12.5px] font-bold rounded-lg px-3.5 py-2">
          + Добавить группу
        </button>
      </div>

      <label className="flex items-center gap-2.5 text-[12.5px] font-semibold mt-7">
        <input type="checkbox" name="hidden" defaultChecked={job?.hidden} />
        Скрыть задачу из полосы
      </label>

      <div className="flex items-center gap-3 mt-7">
        {broken ? (
          <button type="submit" disabled
            className="bg-cyan-500 text-[#06222b] font-extrabold text-[12.5px] rounded-lg px-5 py-2.5 opacity-40">
            Сохранить
          </button>
        ) : (
          <SubmitButton className="bg-cyan-500 text-[#06222b] font-extrabold text-[12.5px] rounded-lg px-5 py-2.5">
            Сохранить
          </SubmitButton>
        )}
        <SavedMark />
        <Link href="/admin/ai/filters" className="text-[12.5px] text-[var(--admin-text-muted)]">Отмена</Link>
        {broken && (
          <span className="text-[11.5px] text-red-400">Поправьте ключи — пока они с ошибкой, сохранить нельзя</span>
        )}
        {deleteAction && (
          <button type="submit" formAction={deleteAction} disabled={Boolean(usedBy)}
            title={usedBy ? `На задаче ${usedBy} карточек — сначала переложите их` : undefined}
            className="ml-auto text-[12.5px] font-bold text-red-400 border border-red-400/30 rounded-lg px-3.5 py-2 disabled:opacity-40">
            Удалить задачу
          </button>
        )}
      </div>
    </form>
  );
}

/** Подсказка про признаки, которые ещё никому не проставлены. */
function FreshNote({ group }: { group: Group }) {
  const fresh = group.items.filter(i => !i.existing).length;
  if (!fresh) return null;
  return (
    <p className={HINT}>
      Новых признаков в группе: {fresh}. В хабе они появятся, когда их отметят
      хотя бы у двух карточек.
    </p>
  );
}
