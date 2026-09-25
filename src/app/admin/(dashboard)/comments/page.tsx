import Link from 'next/link';
import { requireAdminPermission } from '@/lib/admin/auth';
import { DeleteSubmitButton } from '../_shared/DeleteButton';
import { fetchAdminComments, type ModerationFilter } from '@/lib/admin/data';
import { formatPragueDate } from '@/lib/admin/timezone';
import {
  approveCommentAction, rejectCommentAction, unpublishCommentAction,
  restoreCommentAction, deleteCommentAction, editCommentAction,
} from './actions';
import ModerationButton from '../_shared/ModerationButton';

function formatDate(iso: string) {
  return formatPragueDate(iso, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

export default async function AdminCommentsPage({ searchParams }: { searchParams: Promise<{ filter?: string }> }) {
  await requireAdminPermission('comments');
  const { filter } = await searchParams;
  const activeFilter: ModerationFilter =
    filter === 'approved' || filter === 'rejected' || filter === 'all' ? filter : 'pending';
  const comments = await fetchAdminComments(activeFilter);

  const tabs = [
    { key: 'pending', label: 'На модерации' },
    { key: 'approved', label: 'Одобренные' },
    { key: 'rejected', label: 'Отклонённые' },
    { key: 'all', label: 'Все' },
  ] as const;

  return (
    <div>
      <h1 className="text-[19px] font-bold mb-6">Комментарии</h1>
      <div className="flex gap-1.5 mb-5">
        {tabs.map(t => (
          <Link
            key={t.key}
            href={t.key === 'pending' ? '/admin/comments' : `/admin/comments?filter=${t.key}`}
            className={`text-[11.5px] font-bold px-3 py-1.5 rounded-full border ${
              activeFilter === t.key ? 'bg-cyan-500/15 text-cyan-400 border-transparent' : 'border-[var(--admin-border)] text-[var(--admin-text-muted)]'
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {comments.length === 0 ? (
        <p className="text-[13px] text-[var(--admin-text-muted)]">
          {activeFilter === 'pending'
            ? 'Очередь пуста: новых комментариев на модерацию нет.'
            : 'Ничего нет в этом фильтре.'}
        </p>
      ) : (
        <div className="flex flex-col gap-2.5 max-w-2xl">
          {comments.map(c => (
            <div key={c._id} className="border border-[var(--admin-border)] rounded-xl p-3.5 bg-[var(--admin-panel)]">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 shrink-0" />
                <span className="font-bold text-[12.5px]">{c.authorName}</span>
                {c.targetSlug && c.targetType && (
                  <Link
                    href={`/${c.targetLocale ?? 'ru'}/${c.targetType === 'news' ? 'news' : 'articles'}/${c.targetSlug}`}
                    target="_blank"
                    className="text-[11px] text-cyan-400"
                  >
                    → {c.targetTitle}
                  </Link>
                )}
                <span className="ml-auto flex items-center gap-2 shrink-0">
                  {activeFilter === 'all' && (
                    <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded ${
                      c.approved ? 'bg-green-500/12 text-green-400'
                        : c.rejected ? 'bg-red-500/12 text-red-400'
                        : 'bg-amber-500/12 text-amber-500'}`}>
                      {c.approved ? 'на сайте' : c.rejected ? 'отклонён' : 'в очереди'}
                    </span>
                  )}
                  <span className="text-[10.5px] text-[var(--admin-text-muted)]">{formatDate(c.createdAt)}</span>
                </span>
              </div>
              <p className="text-[12.5px] text-[var(--admin-text-secondary)] leading-relaxed mb-2.5 whitespace-pre-wrap">{c.text}</p>
              <div className="flex items-center gap-2 flex-wrap">
                {/* Набор кнопок зависит от состояния. Раньше у неодобренного
                    комментария «Отклонить» проставляла approved: false тому,
                    у кого он и так false — нажатие ничего не меняло. */}
                {!c.approved && (
                  <form action={approveCommentAction}>
                    <input type="hidden" name="id" value={c._id} />
                    <ModerationButton pendingLabel="Одобряем…"
                      className="text-[11px] font-bold px-3 py-1.5 rounded-lg bg-green-500/15 text-green-400">
                      ✓ Одобрить
                    </ModerationButton>
                  </form>
                )}
                {c.approved && (
                  <form action={unpublishCommentAction}>
                    <input type="hidden" name="id" value={c._id} />
                    <ModerationButton pendingLabel="Снимаем…"
                      className="text-[11px] font-bold px-3 py-1.5 rounded-lg bg-slate-500/15 text-slate-300">
                      Снять с публикации
                    </ModerationButton>
                  </form>
                )}
                {!c.approved && !c.rejected && (
                  <form action={rejectCommentAction}>
                    <input type="hidden" name="id" value={c._id} />
                    <ModerationButton pendingLabel="Отклоняем…"
                      className="text-[11px] font-bold px-3 py-1.5 rounded-lg bg-red-500/15 text-red-400">
                      ✕ Отклонить
                    </ModerationButton>
                  </form>
                )}
                {c.rejected && (
                  <form action={restoreCommentAction}>
                    <input type="hidden" name="id" value={c._id} />
                    <ModerationButton pendingLabel="Возвращаем…"
                      className="text-[11px] font-bold px-3 py-1.5 rounded-lg bg-cyan-500/15 text-cyan-400">
                      ↩ Вернуть в очередь
                    </ModerationButton>
                  </form>
                )}
                <details className="ml-1 relative">
                  <summary className="text-[11px] font-bold px-3 py-1.5 rounded-lg border border-[var(--admin-border)] text-[var(--admin-text-muted)] cursor-pointer inline-block list-none">✎ Править</summary>
                  <form action={editCommentAction} className="absolute left-0 top-full mt-2 z-20 w-[440px] max-w-[calc(100vw-3rem)] flex gap-2 border border-[var(--admin-border)] rounded-xl bg-[var(--admin-panel)] p-3 shadow-xl">
                    <input type="hidden" name="id" value={c._id} />
                    <textarea name="text" defaultValue={c.text} className="flex-1 bg-[var(--admin-input)] border border-[var(--admin-border)] rounded-lg px-2.5 py-2 text-[12px]" rows={2} />
                    <button className="text-[11px] font-bold px-3 py-1.5 rounded-lg bg-cyan-500 text-[#06222b] self-start">Сохранить</button>
                  </form>
                </details>
                <form action={deleteCommentAction} className="ml-auto">
                  <input type="hidden" name="id" value={c._id} />
                  <input type="hidden" name="authorName" value={c.authorName} />
                  <input type="hidden" name="text" value={c.text} />
                  <DeleteSubmitButton confirmMessage={`Удалить комментарий безвозвратно? Это действие нельзя отменить.`} />
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
