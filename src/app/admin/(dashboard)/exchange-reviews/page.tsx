import Link from 'next/link';
import { requireAdminPermission } from '@/lib/admin/auth';
import { fetchAdminExchangeReviews } from '@/lib/admin/data';
import { formatPragueDate } from '@/lib/admin/timezone';
import { approveExchangeReviewAction, rejectExchangeReviewAction, deleteExchangeReviewAction, editExchangeReviewAction } from './actions';

function formatDate(iso: string) {
  return formatPragueDate(iso, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

export default async function AdminExchangeReviewsPage({ searchParams }: { searchParams: Promise<{ filter?: string }> }) {
  await requireAdminPermission('exchanges');
  const { filter } = await searchParams;
  const activeFilter = filter === 'approved' || filter === 'all' ? filter : 'pending';
  const reviews = await fetchAdminExchangeReviews(activeFilter);

  const tabs = [
    { key: 'pending', label: 'На модерации' },
    { key: 'approved', label: 'Одобренные' },
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
        <p className="text-[13px] text-[var(--admin-text-muted)]">Ничего нет в этом фильтре.</p>
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
                <span className="text-[10.5px] text-[var(--admin-text-muted)] ml-auto">{formatDate(r.createdAt)}</span>
              </div>
              <p className="text-[12.5px] text-[var(--admin-text-secondary)] leading-relaxed mb-2.5 whitespace-pre-wrap">{r.text}</p>
              <div className="flex items-center gap-2">
                {!r.approved && (
                  <form action={approveExchangeReviewAction}><input type="hidden" name="id" value={r._id} /><button className="text-[11px] font-bold px-3 py-1.5 rounded-lg bg-green-500/15 text-green-400">✓ Одобрить</button></form>
                )}
                {r.approved && (
                  <form action={rejectExchangeReviewAction}><input type="hidden" name="id" value={r._id} /><button className="text-[11px] font-bold px-3 py-1.5 rounded-lg bg-slate-500/15 text-slate-300">Снять с публикации</button></form>
                )}
                {!r.approved && (
                  <form action={rejectExchangeReviewAction}><input type="hidden" name="id" value={r._id} /><button className="text-[11px] font-bold px-3 py-1.5 rounded-lg bg-red-500/15 text-red-400">✕ Отклонить</button></form>
                )}
                <details className="ml-1">
                  <summary className="text-[11px] font-bold px-3 py-1.5 rounded-lg border border-[var(--admin-border)] text-[var(--admin-text-muted)] cursor-pointer inline-block list-none">✎ Править</summary>
                  <form action={editExchangeReviewAction} className="mt-2 flex gap-2">
                    <input type="hidden" name="id" value={r._id} />
                    <textarea name="text" defaultValue={r.text} className="flex-1 bg-[var(--admin-input)] border border-[var(--admin-border)] rounded-lg px-2.5 py-2 text-[12px]" rows={2} />
                    <button className="text-[11px] font-bold px-3 py-1.5 rounded-lg bg-cyan-500 text-[#06222b] self-start">Сохранить</button>
                  </form>
                </details>
                <form action={deleteExchangeReviewAction} className="ml-auto"><input type="hidden" name="id" value={r._id} /><button className="text-[11px] font-bold px-3 py-1.5 rounded-lg text-red-400/70">Удалить</button></form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
