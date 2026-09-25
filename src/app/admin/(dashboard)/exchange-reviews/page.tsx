import Link from 'next/link';
import { requireAdminPermission } from '@/lib/admin/auth';
import { DeleteSubmitButton } from '../_shared/DeleteButton';
import { fetchAdminExchangeReviews, type ModerationFilter } from '@/lib/admin/data';
import { formatPragueDate } from '@/lib/admin/timezone';
import {
  approveExchangeReviewAction, rejectExchangeReviewAction, unpublishExchangeReviewAction,
  restoreExchangeReviewAction, deleteExchangeReviewAction, editExchangeReviewAction,
} from './actions';
import ModerationButton from '../_shared/ModerationButton';

function formatDate(iso: string) {
  return formatPragueDate(iso, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

export default async function AdminExchangeReviewsPage({ searchParams }: { searchParams: Promise<{ filter?: string }> }) {
  await requireAdminPermission('exchanges');
  const { filter } = await searchParams;
  const activeFilter: ModerationFilter =
    filter === 'approved' || filter === 'rejected' || filter === 'all' ? filter : 'pending';
  const reviews = await fetchAdminExchangeReviews(activeFilter);

  const tabs = [
    { key: 'pending', label: 'На модерации' },
    { key: 'approved', label: 'Одобренные' },
    { key: 'rejected', label: 'Отклонённые' },
    { key: 'all', label: 'Все' },
  ] as const;

  return (
    <div>
      <h1 className="text-[19px] font-bold mb-1">Отзывы о биржах</h1>
      <p className="text-[12.5px] text-[var(--admin-text-muted)] mb-6">Отдельно от комментариев к новостям и статьям — это отзывы, которые читатели оставляют на страницах бирж.</p>
      <div className="flex gap-1.5 mb-5">
        {tabs.map(t => (
          <Link
            key={t.key}
            href={t.key === 'pending' ? '/admin/exchange-reviews' : `/admin/exchange-reviews?filter=${t.key}`}
            className={`text-[11.5px] font-bold px-3 py-1.5 rounded-full border ${
              activeFilter === t.key ? 'bg-cyan-500/15 text-cyan-400 border-transparent' : 'border-[var(--admin-border)] text-[var(--admin-text-muted)]'
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {reviews.length === 0 ? (
        <p className="text-[13px] text-[var(--admin-text-muted)]">
          {activeFilter === 'pending'
            ? 'Очередь пуста: новых отзывов на модерацию нет.'
            : 'Ничего нет в этом фильтре.'}
        </p>
      ) : (
        <div className="flex flex-col gap-2.5 max-w-2xl">
          {reviews.map(r => (
            <div key={r._id} className="border border-[var(--admin-border)] rounded-xl p-3.5 bg-[var(--admin-panel)]">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 shrink-0" />
                <span className="font-bold text-[12.5px]">{r.authorName}</span>
                <span className="text-amber-400 text-[12px]">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                {r.exchangeSlugRu && (
                  <Link href={`/ru/exchanges/${r.exchangeSlugRu}`} target="_blank" className="text-[11px] text-cyan-400">
                    → {r.exchangeName}
                  </Link>
                )}
                <span className="ml-auto flex items-center gap-2 shrink-0">
                  {activeFilter === 'all' && (
                    <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded ${
                      r.approved ? 'bg-green-500/12 text-green-400'
                        : r.rejected ? 'bg-red-500/12 text-red-400'
                        : 'bg-amber-500/12 text-amber-500'}`}>
                      {r.approved ? 'на сайте' : r.rejected ? 'отклонён' : 'в очереди'}
                    </span>
                  )}
                  <span className="text-[10.5px] text-[var(--admin-text-muted)]">{formatDate(r.createdAt)}</span>
                </span>
              </div>
              <p className="text-[12.5px] text-[var(--admin-text-secondary)] leading-relaxed mb-2.5 whitespace-pre-wrap">{r.text}</p>
              <div className="flex items-center gap-2 flex-wrap">
                {!r.approved && (
                  <form action={approveExchangeReviewAction}>
                    <input type="hidden" name="id" value={r._id} />
                    <ModerationButton pendingLabel="Одобряем…"
                      className="text-[11px] font-bold px-3 py-1.5 rounded-lg bg-green-500/15 text-green-400">
                      ✓ Одобрить
                    </ModerationButton>
                  </form>
                )}
                {r.approved && (
                  <form action={unpublishExchangeReviewAction}>
                    <input type="hidden" name="id" value={r._id} />
                    <ModerationButton pendingLabel="Снимаем…"
                      className="text-[11px] font-bold px-3 py-1.5 rounded-lg bg-slate-500/15 text-slate-300">
                      Снять с публикации
                    </ModerationButton>
                  </form>
                )}
                {!r.approved && !r.rejected && (
                  <form action={rejectExchangeReviewAction}>
                    <input type="hidden" name="id" value={r._id} />
                    <ModerationButton pendingLabel="Отклоняем…"
                      className="text-[11px] font-bold px-3 py-1.5 rounded-lg bg-red-500/15 text-red-400">
                      ✕ Отклонить
                    </ModerationButton>
                  </form>
                )}
                {r.rejected && (
                  <form action={restoreExchangeReviewAction}>
                    <input type="hidden" name="id" value={r._id} />
                    <ModerationButton pendingLabel="Возвращаем…"
                      className="text-[11px] font-bold px-3 py-1.5 rounded-lg bg-cyan-500/15 text-cyan-400">
                      ↩ Вернуть в очередь
                    </ModerationButton>
                  </form>
                )}
                <details className="ml-1 relative">
                  <summary className="text-[11px] font-bold px-3 py-1.5 rounded-lg border border-[var(--admin-border)] text-[var(--admin-text-muted)] cursor-pointer inline-block list-none">✎ Править</summary>
                  <form action={editExchangeReviewAction} className="absolute left-0 top-full mt-2 z-20 w-[440px] max-w-[calc(100vw-3rem)] flex gap-2 border border-[var(--admin-border)] rounded-xl bg-[var(--admin-panel)] p-3 shadow-xl">
                    <input type="hidden" name="id" value={r._id} />
                    <textarea name="text" defaultValue={r.text} className="flex-1 bg-[var(--admin-input)] border border-[var(--admin-border)] rounded-lg px-2.5 py-2 text-[12px]" rows={2} />
                    <button className="text-[11px] font-bold px-3 py-1.5 rounded-lg bg-cyan-500 text-[#06222b] self-start">Сохранить</button>
                  </form>
                </details>
                <form action={deleteExchangeReviewAction} className="ml-auto">
                  <input type="hidden" name="id" value={r._id} />
                  <input type="hidden" name="authorName" value={r.authorName} />
                  <input type="hidden" name="text" value={r.text} />
                  <DeleteSubmitButton confirmMessage={`Удалить отзыв безвозвратно? Это действие нельзя отменить.`} />
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
