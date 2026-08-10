import { requireOwner } from '@/lib/admin/auth';
import { fetchActivityLog } from '@/lib/admin/activityLog';
import { formatPragueDateTime } from '@/lib/admin/timezone';

const ACTION_LABEL: Record<string, { icon: string; label: string; color: string }> = {
  delete: { icon: '✕', label: 'удалил(а)', color: '#ef4444' },
  unpublish: { icon: '↓', label: 'снял(а) с сайта', color: '#f2a93b' },
  republish: { icon: '↑', label: 'вернул(а) на сайт', color: '#22c55e' },
  permissions_changed: { icon: '⚙', label: 'изменил(а) права', color: '#06b6d4' },
  user_created: { icon: '+', label: 'добавил(а) сотрудника', color: '#22c55e' },
};

const ENTITY_LABEL: Record<string, string> = {
  news: 'новость',
  article: 'статью',
  comment: 'комментарий',
  calendarEvent: 'событие календаря',
  exchange: 'биржу',
  author: 'автора',
  subscriber: 'подписчика',
  exchangeReview: 'отзыв',
  adminUser: 'сотрудника',
};

export default async function AdminActivityPage() {
  await requireOwner();
  const entries = await fetchActivityLog(100);

  return (
    <div>
      <h1 className="text-[19px] font-bold mb-2">Журнал действий</h1>
      <p className="text-[12.5px] text-[var(--admin-text-muted)] mb-6">
        Удаления и изменения прав сотрудников — последние 100 записей. Публикации и обычное редактирование сюда не попадают.
      </p>

      {entries.length === 0 ? (
        <p className="text-[13px] text-[var(--admin-text-muted)]">Пока ничего не записано.</p>
      ) : (
        <div className="border border-[var(--admin-border)] rounded-xl bg-[var(--admin-panel)] divide-y divide-[var(--admin-border)] max-w-2xl">
          {entries.map(e => {
            const meta = ACTION_LABEL[e.action] ?? { icon: '•', label: e.action, color: '#8b8d94' };
            const entityLabel = ENTITY_LABEL[e.entityType] ?? e.entityType;
            return (
              <div key={e._id} className="flex items-center gap-3 px-4 py-3">
                <span
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-[12px] shrink-0"
                  style={{ background: `${meta.color}26`, color: meta.color }}
                >
                  {meta.icon}
                </span>
                <div className="flex-1 min-w-0 text-[12.5px]">
                  <span className="font-bold">{e.adminName || e.adminEmail}</span> {meta.label} {entityLabel}{' '}
                  <span className="text-[var(--admin-text-muted)]">«{e.entityTitle}»</span>
                </div>
                <span className="text-[11px] text-[var(--admin-text-dim)] whitespace-nowrap shrink-0">{formatPragueDateTime(e.timestamp)}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
