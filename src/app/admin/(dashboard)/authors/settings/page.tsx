import Link from 'next/link';
import { requireAdminPermission } from '@/lib/admin/auth';
import { fetchAuthorsPageDoc } from '@/lib/admin/data';
import { saveAuthorsPageAction } from '../actions';
import SubmitButton from '../../_shared/SubmitButton';

const inputCls = 'w-full bg-[var(--admin-input)] border border-[var(--admin-border)] rounded-lg px-3 py-2.5 text-[13px]';
const labelCls = 'text-[11.5px] font-bold text-[var(--admin-text-secondary)] mb-1.5 block';

const SORTS = [
  { v: 'manual', t: 'Вручную', h: 'по числу «порядок» в карточке участника' },
  { v: 'materials', t: 'По числу материалов', h: 'сверху те, кто больше публиковался' },
  { v: 'alphabet', t: 'По алфавиту', h: 'по имени на языке страницы' },
] as const;

/**
 * Тексты и порядок страницы «Авторы и партнёры».
 *
 * Ни одной строки этой страницы нет в коде: заголовок, подзаголовок и оба
 * поля для поисковика берутся отсюда. Пусто — подставляется запасной текст,
 * страница не остаётся с дырой.
 */
export default async function AuthorsSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  await requireAdminPermission('authors');
  const [doc, sp] = await Promise.all([fetchAuthorsPageDoc(), searchParams]);

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between gap-4 mb-1">
        <h1 className="text-[19px] font-bold">Страница «Авторы и партнёры»</h1>
        <Link href="/admin/authors" className="text-[12px] text-[var(--admin-text-muted)] hover:text-cyan-400">
          ← К участникам
        </Link>
      </div>
      <p className="text-[11.5px] text-[var(--admin-text-muted)] mb-6">
        Тексты витрины и порядок карточек. Деплой не нужен.
      </p>

      {sp.saved && (
        <p className="text-[12px] rounded-lg px-3 py-2 mb-4 bg-green-500/10 text-green-400">
          Сохранено. На сайте появится в течение пары минут.
        </p>
      )}

      <form action={saveAuthorsPageAction}>
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div>
            <label className={labelCls}>Заголовок (RU)</label>
            <input name="headingRu" defaultValue={doc?.headingRu} placeholder="Авторы и партнёры" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Heading (EN)</label>
            <input name="headingEn" defaultValue={doc?.headingEn} placeholder="Authors and partners" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Подзаголовок (RU)</label>
            <textarea name="ledeRu" defaultValue={doc?.ledeRu} rows={3} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Lede (EN)</label>
            <textarea name="ledeEn" defaultValue={doc?.ledeEn} rows={3} className={inputCls} />
          </div>
        </div>

        <h2 className="text-[13px] font-bold text-[var(--admin-text-secondary)] mb-1">Для поисковика</h2>
        <p className="text-[11px] text-[var(--admin-text-dim)] mb-3">
          Заголовок до 60 знаков, описание до 155: длиннее Google обрезает прямо в выдаче.
        </p>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className={labelCls}>Title (RU)</label>
            <input name="seoTitleRu" defaultValue={doc?.seoTitleRu} maxLength={70} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Title (EN)</label>
            <input name="seoTitleEn" defaultValue={doc?.seoTitleEn} maxLength={70} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Description (RU)</label>
            <textarea name="seoDescriptionRu" defaultValue={doc?.seoDescriptionRu} rows={3} maxLength={170} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Description (EN)</label>
            <textarea name="seoDescriptionEn" defaultValue={doc?.seoDescriptionEn} rows={3} maxLength={170} className={inputCls} />
          </div>
        </div>

        <h2 className="text-[13px] font-bold text-[var(--admin-text-secondary)] mb-3">Порядок карточек</h2>
        <div className="grid gap-2 mb-6">
          {SORTS.map(o => (
            <label key={o.v} className="flex items-start gap-2.5 border border-[var(--admin-border)]
              rounded-lg px-3 py-2.5 cursor-pointer has-[:checked]:border-cyan-500/50">
              <input type="radio" name="sort" value={o.v}
                defaultChecked={(doc?.sort || 'manual') === o.v}
                className="mt-0.5 w-4 h-4 accent-cyan-500 shrink-0" />
              <span>
                <span className="block text-[12.5px] font-bold">{o.t}</span>
                <span className="block text-[11px] text-[var(--admin-text-dim)] mt-0.5">{o.h}</span>
              </span>
            </label>
          ))}
        </div>

        <SubmitButton className="bg-[#22c55e] text-[#06210f] font-extrabold text-[12.5px] rounded-lg px-5 py-2.5">
          Сохранить
        </SubmitButton>
      </form>
    </div>
  );
}
