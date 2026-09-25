import { requireAdminPermission } from '@/lib/admin/auth';
import { fetchAdminSubscribersPage, ADMIN_LIST_PAGE_SIZE } from '@/lib/admin/data';
import { formatPragueDateTime } from '@/lib/admin/timezone';
import ListSearchBar from '../_shared/ListSearchBar';
import SubmitButton from '../_shared/SubmitButton';
import { DeleteSubmitButton } from '../_shared/DeleteButton';
import Link from 'next/link';
import {
  toggleSubscriberAction, deleteSubscriberAction,
  createSubscriberAction, updateSubscriberAction,
} from './actions';

type StatusFilter = 'all' | 'active' | 'inactive';

const inputCls = 'w-full bg-[var(--admin-input)] border border-[var(--admin-border)] rounded-lg px-3 py-2 text-[12.5px]';
const labelCls = 'block text-[10.5px] font-bold uppercase tracking-wide text-[var(--admin-text-muted)] mb-1';

export default async function AdminSubscribersPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; q?: string; lang?: string; page?: string; saved?: string; error?: string }>;
}) {
  await requireAdminPermission('subscribers');
  const { filter: rawFilter, q, lang: rawLang, page: rawPage, saved, error } = await searchParams;
  const status: StatusFilter = ['all', 'active', 'inactive'].includes(rawFilter ?? '') ? (rawFilter as StatusFilter) : 'all';
  const locale = rawLang === 'ru' || rawLang === 'en' ? rawLang : undefined;
  const page = Math.max(1, Number(rawPage) || 1);

  const { items, filteredTotal, counts } = await fetchAdminSubscribersPage({ q: q?.trim() || undefined, locale, status, page });

  const tabs: { key: StatusFilter; label: string }[] = [
    { key: 'all', label: `Все (${counts.all})` },
    { key: 'active', label: `Активные (${counts.active})` },
    { key: 'inactive', label: `Отписались (${counts.inactive})` },
  ];

  function pageHref(p: number) {
    const params = new URLSearchParams();
    if (status !== 'all') params.set('filter', status);
    if (q) params.set('q', q);
    if (locale) params.set('lang', locale);
    if (p > 1) params.set('page', String(p));
    const qs = params.toString();
    return qs ? `/admin/subscribers?${qs}` : '/admin/subscribers';
  }

  const exportHref = `/admin/subscribers/export?${new URLSearchParams({
    ...(status !== 'all' ? { status } : {}),
    ...(locale ? { locale } : {}),
  }).toString()}`;

  const totalPages = Math.max(1, Math.ceil(filteredTotal / ADMIN_LIST_PAGE_SIZE));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[19px] font-bold">Подписчики рассылки</h1>
        <a
          href={exportHref}
          className="bg-cyan-500 text-[#06222b] font-extrabold text-[12.5px] rounded-lg px-4 py-2.5"
        >
          ⬇ Экспорт CSV
        </a>
      </div>

      <div className="flex gap-1.5 mb-4">
        {tabs.map(t => (
          <Link
            key={t.key}
            href={t.key === 'all' ? '/admin/subscribers' : `/admin/subscribers?filter=${t.key}`}
            className={`text-[11.5px] font-bold px-3 py-1.5 rounded-full border ${
              status === t.key ? 'bg-cyan-500/15 text-cyan-400 border-transparent' : 'border-[var(--admin-border)] text-[var(--admin-text-muted)]'
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {saved && (
        <p className="text-[12px] rounded-lg px-3 py-2 mb-3 bg-green-500/10 text-green-400">Сохранено.</p>
      )}
      {error && (
        <p className="text-[12px] rounded-lg px-3 py-2 mb-3 bg-red-500/10 text-red-400">
          {error === 'email' ? 'Похоже, это не адрес электронной почты.' : error}
        </p>
      )}

      {/* Добавление руками: человек попросил подписать его письмом или
          адрес переносят из другого списка. */}
      <details className="mb-4">
        <summary className="cursor-pointer select-none list-none inline-flex items-center gap-1.5 text-[12.5px] font-bold border border-[var(--admin-border)] rounded-lg px-3.5 py-2 hover:border-cyan-500/40">
          + Добавить подписчика
        </summary>
        <form action={createSubscriberAction} className="mt-3 flex flex-wrap items-end gap-2.5 border border-[var(--admin-border)] rounded-xl bg-[var(--admin-panel)] p-4">
          <label className="flex-1 min-w-[220px]">
            <span className={labelCls}>Email</span>
            <input name="email" type="email" required placeholder="name@example.com" className={inputCls} />
          </label>
          <label>
            <span className={labelCls}>Язык</span>
            <select name="locale" defaultValue="en" className={inputCls}>
              <option value="en">EN</option>
              <option value="ru">RU</option>
            </select>
          </label>
          <label className="flex items-center gap-2 text-[12.5px] h-[38px]">
            <input type="checkbox" name="active" defaultChecked className="w-4 h-4 accent-cyan-500" />
            Активен
          </label>
          <SubmitButton className="bg-cyan-500 text-[#06222b] font-extrabold text-[12.5px] rounded-lg px-4 py-2.5">
            Добавить
          </SubmitButton>
        </form>
      </details>

      <ListSearchBar basePath="/admin/subscribers" query={q} lang={locale} filter={status} placeholder="Поиск по email…" />

      {items.length === 0 ? (
        <p className="text-[13px] text-[var(--admin-text-muted)]">
          {q || status !== 'all'
            ? 'Ничего не нашлось по этому фильтру.'
            : 'Подписчиков пока нет. Как только кто-то подпишется на сайте, он появится здесь.'}
        </p>
      ) : (
        <div className="border border-[var(--admin-border)] rounded-xl bg-[var(--admin-panel)] divide-y divide-[var(--admin-border)]">
          {items.map(s => (
            <div key={s._id} className="relative flex items-center gap-3 px-4 py-3">
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-bold truncate">{s.email}</div>
                <div className="text-[11px] text-[var(--admin-text-muted)]">
                  {s.locale.toUpperCase()} · {s.source || 'источник не указан'} · {formatPragueDateTime(s.subscribedAt)}
                </div>
              </div>
              <span
                className="text-[10.5px] font-extrabold px-3 py-1.5 rounded-full whitespace-nowrap shrink-0"
                style={{ background: s.active ? '#22c55e26' : '#8b8d9426', color: s.active ? '#22c55e' : '#8b8d94' }}
              >
                {s.active ? 'Активен' : 'Отписался'}
              </span>
              <form action={toggleSubscriberAction}>
                <input type="hidden" name="id" value={s._id} />
                <input type="hidden" name="active" value={s.active ? 'false' : 'true'} />
                <button
                  type="submit"
                  className="text-[11.5px] font-bold px-3 py-1.5 rounded-lg border border-[var(--admin-border)] hover:border-cyan-500/40 transition-colors whitespace-nowrap shrink-0"
                >
                  {s.active ? 'Отписать' : 'Вернуть'}
                </button>
              </form>

              {/* Правка адреса и языка. Раскрывается на всю ширину строки,
                  а не втискивается в неё: в узкой колонке поле было бы
                  шириной в пару символов. */}
              <details className="shrink-0">
                <summary className="cursor-pointer select-none list-none text-[11.5px] font-bold px-3 py-1.5 rounded-lg border border-[var(--admin-border)] hover:border-cyan-500/40 transition-colors whitespace-nowrap">
                  Изменить
                </summary>
                <form action={updateSubscriberAction} className="absolute left-4 right-4 mt-2 z-20 flex flex-wrap items-end gap-2.5 border border-[var(--admin-border)] rounded-xl bg-[var(--admin-panel)] p-4 shadow-xl">
                  <input type="hidden" name="id" value={s._id} />
                  <label className="flex-1 min-w-[200px]">
                    <span className={labelCls}>Email</span>
                    <input name="email" type="email" required defaultValue={s.email} className={inputCls} />
                  </label>
                  <label>
                    <span className={labelCls}>Язык</span>
                    <select name="locale" defaultValue={s.locale} className={inputCls}>
                      <option value="en">EN</option>
                      <option value="ru">RU</option>
                    </select>
                  </label>
                  <label className="flex items-center gap-2 text-[12.5px] h-[36px]">
                    <input type="checkbox" name="active" defaultChecked={s.active} className="w-4 h-4 accent-cyan-500" />
                    Активен
                  </label>
                  <SubmitButton className="bg-[#22c55e] text-[#06210f] font-extrabold text-[12px] rounded-lg px-4 py-2">
                    Сохранить
                  </SubmitButton>
                </form>
              </details>

              {/* С подтверждением: адрес из рассылки восстановить неоткуда. */}
              <form action={deleteSubscriberAction} className="shrink-0">
                <input type="hidden" name="id" value={s._id} />
                <input type="hidden" name="email" value={s.email} />
                <DeleteSubmitButton confirmMessage={`Удалить ${s.email} из списка рассылки? Восстановить адрес будет неоткуда.`} />
              </form>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-5 text-[12px] text-[var(--admin-text-muted)]">
          <span>Стр. {page} из {totalPages} · всего {filteredTotal}</span>
          <div className="flex gap-2">
            {page > 1 && (
              <Link href={pageHref(page - 1)} className="font-bold px-3 py-1.5 rounded-lg border border-[var(--admin-border)] hover:border-cyan-500/40 transition-colors">
                ‹ Назад
              </Link>
            )}
            {page < totalPages && (
              <Link href={pageHref(page + 1)} className="font-bold px-3 py-1.5 rounded-lg border border-[var(--admin-border)] hover:border-cyan-500/40 transition-colors">
                Далее ›
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
