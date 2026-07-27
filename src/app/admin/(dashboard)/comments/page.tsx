import Link from 'next/link';
import { requireAdminPermission } from '@/lib/admin/auth';
import { fetchAdminComments } from '@/lib/admin/data';
import { approveCommentAction, rejectCommentAction, deleteCommentAction, editCommentAction } from './actions';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

export default async function AdminCommentsPage({ searchParams }: { searchParams: Promise<{ filter?: string }> }) {
  await requireAdminPermission('comments');
  const { filter } = await searchParams;
  const activeFilter = filter === 'approved' || filter === 'all' ? filter : 'pending';
  const comments = await fetchAdminComments(activeFilter);

  const tabs = [
    { key: 'pending', label: 'На модерации' },
    { key: 'approved', label: 'Одобренные' },
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
              activeFilter === t.key ? 'bg-cyan-500/15 text-cyan-400 border-transparent' : 'border-[#262b38] text-[#8b93a7]'
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {comments.length === 0 ? (
        <p className="text-[13px] text-[#8b93a7]">Ничего нет в этом фильтре.</p>
      ) : (
        <div className="flex flex-col gap-2.5 max-w-2xl">
          {comments.map(c => (
            <div key={c._id} className="border border-[#262b38] rounded-xl p-3.5 bg-[#161922]">
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
                <span className="text-[10.5px] text-[#8b93a7] ml-auto">{formatDate(c.createdAt)}</span>
              </div>
              <p className="text-[12.5px] text-[#c3c9d6] leading-relaxed mb-2.5 whitespace-pre-wrap">{c.text}</p>
              <div className="flex items-center gap-2">
                {!c.approved && (
                  <form action={approveCommentAction}><input type="hidden" name="id" value={c._id} /><button className="text-[11px] font-bold px-3 py-1.5 rounded-lg bg-green-500/15 text-green-400">✓ Одобрить</button></form>
                )}
                {c.approved && (
                  <form action={rejectCommentAction}><input type="hidden" name="id" value={c._id} /><button className="text-[11px] font-bold px-3 py-1.5 rounded-lg bg-slate-500/15 text-slate-300">Снять с публикации</button></form>
                )}
                {!c.approved && (
                  <form action={rejectCommentAction}><input type="hidden" name="id" value={c._id} /><button className="text-[11px] font-bold px-3 py-1.5 rounded-lg bg-red-500/15 text-red-400">✕ Отклонить</button></form>
                )}
                <details className="ml-1">
                  <summary className="text-[11px] font-bold px-3 py-1.5 rounded-lg border border-[#262b38] text-[#8b93a7] cursor-pointer inline-block list-none">✎ Править</summary>
                  <form action={editCommentAction} className="mt-2 flex gap-2">
                    <input type="hidden" name="id" value={c._id} />
                    <textarea name="text" defaultValue={c.text} className="flex-1 bg-[#1c202b] border border-[#262b38] rounded-lg px-2.5 py-2 text-[12px]" rows={2} />
                    <button className="text-[11px] font-bold px-3 py-1.5 rounded-lg bg-cyan-500 text-[#06222b] self-start">Сохранить</button>
                  </form>
                </details>
                <form action={deleteCommentAction} className="ml-auto"><input type="hidden" name="id" value={c._id} /><button className="text-[11px] font-bold px-3 py-1.5 rounded-lg text-red-400/70">Удалить</button></form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
