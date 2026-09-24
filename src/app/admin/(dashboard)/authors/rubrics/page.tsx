import Link from 'next/link';
import { requireAdminPermission } from '@/lib/admin/auth';
import { fetchAdminRubrics } from '@/lib/admin/data';
import { createRubricAction, updateRubricAction, deleteRubricAction } from '../actions';
import DeleteButton from '../../_shared/DeleteButton';
import SubmitButton from '../../_shared/SubmitButton';

const inputCls = 'w-full bg-[var(--admin-input)] border border-[var(--admin-border)] rounded-lg px-3 py-2 text-[12.5px]';
const labelCls = 'text-[11px] font-bold text-[var(--admin-text-secondary)] mb-1 block';

const VISIBILITY = [
  { v: 'auto', t: 'Авто', h: 'видна, пока в ней есть хоть одна карточка' },
  { v: 'always', t: 'Всегда', h: 'показывать даже пустую' },
  { v: 'never', t: 'Никогда', h: 'внутренний ярлык, на сайт не выходит' },
] as const;

/**
 * Рубрики витрины.
 *
 * Правятся прямо в строках, без отдельной страницы на каждую: их единицы, и
 * заводить ради трёх полей вложенный маршрут значит гонять человека туда-сюда.
 */
export default async function RubricsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; removed?: string }>;
}) {
  await requireAdminPermission('authors');
  const [rubrics, sp] = await Promise.all([fetchAdminRubrics(), searchParams]);

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between gap-4 mb-1">
        <h1 className="text-[19px] font-bold">Рубрики витрины</h1>
        <Link href="/admin/authors" className="text-[12px] text-[var(--admin-text-muted)] hover:text-cyan-400">
          ← К участникам
        </Link>
      </div>
      <p className="text-[11.5px] text-[var(--admin-text-muted)] mb-6">
        Это кнопки фильтров над карточками на странице «Авторы и партнёры».
        Порядок задаётся числом: чем меньше, тем левее.
      </p>

      {sp.saved && <Note tone="ok">Сохранено. На сайте появится в течение пары минут.</Note>}
      {sp.removed !== undefined && (
        <Note tone="ok">
          Рубрика удалена{Number(sp.removed) > 0 ? `, снята с ${sp.removed} карточек` : ''}.
        </Note>
      )}

      <div className="grid gap-3 mb-8">
        {rubrics.length === 0 && (
          <p className="text-[13px] text-[var(--admin-text-muted)]">Пока ни одной рубрики.</p>
        )}
        {rubrics.map(r => {
          const save = async (formData: FormData) => {
            'use server';
            await updateRubricAction(r._id, formData);
          };
          const remove = async () => {
            'use server';
            await deleteRubricAction(r._id);
          };
          const invisible = r.visibility === 'auto' && (r.used ?? 0) === 0;
          return (
            <form key={r._id} action={save}
              className="border border-[var(--admin-border)] rounded-xl bg-[var(--admin-panel)] p-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                <div>
                  <label className={labelCls}>Название (RU)</label>
                  <input name="titleRu" defaultValue={r.titleRu} required className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Title (EN)</label>
                  <input name="titleEn" defaultValue={r.titleEn} required className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Ключ</label>
                  <input name="slug" defaultValue={r.slug} required className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Порядок</label>
                  <input name="order" type="number" defaultValue={r.order} className={inputCls} />
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                {VISIBILITY.map(o => (
                  <label key={o.v} title={o.h}
                    className="flex items-center gap-2 border border-[var(--admin-border)] rounded-lg
                      px-3 py-1.5 text-[12px] cursor-pointer has-[:checked]:border-cyan-500/50">
                    <input type="radio" name="visibility" value={o.v}
                      defaultChecked={r.visibility === o.v}
                      className="w-3.5 h-3.5 accent-cyan-500" />
                    {o.t}
                  </label>
                ))}
              </div>

              <div className="flex items-center justify-between gap-3 flex-wrap">
                <span className="text-[11px] text-[var(--admin-text-dim)]">
                  {r.used ?? 0} участник{plural(r.used ?? 0)}
                  {invisible && ' · сейчас на сайте не видна'}
                </span>
                <span className="flex items-center gap-2">
                  <DeleteButton action={remove}
                    confirmMessage={`Удалить рубрику «${r.titleRu}»? Она снимется с ${r.used ?? 0} карточек, сами участники останутся.`} />
                  <SubmitButton className="bg-[#22c55e] text-[#06210f] font-extrabold text-[12px] rounded-lg px-4 py-2">
                    Сохранить
                  </SubmitButton>
                </span>
              </div>
            </form>
          );
        })}
      </div>

      <h2 className="text-[14px] font-bold mb-3">Новая рубрика</h2>
      <form action={createRubricAction}
        className="border border-[var(--admin-border)] rounded-xl bg-[var(--admin-panel)] p-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
          <div>
            <label className={labelCls}>Название (RU)</label>
            <input name="titleRu" required placeholder="Спикеры" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Title (EN)</label>
            <input name="titleEn" required placeholder="Speakers" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Ключ</label>
            <input name="slug" required placeholder="speakers" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Порядок</label>
            <input name="order" type="number" defaultValue={100} className={inputCls} />
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mb-3">
          {VISIBILITY.map(o => (
            <label key={o.v} title={o.h}
              className="flex items-center gap-2 border border-[var(--admin-border)] rounded-lg
                px-3 py-1.5 text-[12px] cursor-pointer has-[:checked]:border-cyan-500/50">
              <input type="radio" name="visibility" value={o.v} defaultChecked={o.v === 'auto'}
                className="w-3.5 h-3.5 accent-cyan-500" />
              {o.t}
            </label>
          ))}
        </div>
        <SubmitButton className="bg-cyan-500 text-[#06222b] font-extrabold text-[12px] rounded-lg px-4 py-2">
          Создать рубрику
        </SubmitButton>
      </form>
    </div>
  );
}

function Note({ tone, children }: { tone: 'ok'; children: React.ReactNode }) {
  return (
    <p className={`text-[12px] rounded-lg px-3 py-2 mb-4 ${
      tone === 'ok' ? 'bg-green-500/10 text-green-400' : ''}`}>
      {children}
    </p>
  );
}

function plural(n: number): string {
  const d = Math.abs(n) % 100;
  if (d >= 11 && d <= 14) return 'ов';
  const u = d % 10;
  return u === 1 ? '' : u >= 2 && u <= 4 ? 'а' : 'ов';
}
