import Link from 'next/link';
import { requireAdminPermission } from '@/lib/admin/auth';
import { fetchAdminCalendarEvents } from '@/lib/admin/data';
import { CATEGORY_LABELS, CATEGORY_ICON } from '@/lib/calendarMeta';
import { formatPragueDate } from '@/lib/admin/timezone';

const IMPORTANCE_DOTS: Record<string, number> = { low: 1, medium: 2, high: 3 };
const IMPORTANCE_COLOR: Record<string, string> = { low: 'var(--admin-text-dim)', medium: '#f2a93b', high: '#ef4444' };

export default async function AdminCalendarPage() {
  await requireAdminPermission('calendar');
  const events = await fetchAdminCalendarEvents();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[19px] font-bold">Календарь событий</h1>
        <Link href="/admin/calendar/new" className="bg-cyan-500 text-[#06222b] font-extrabold text-[12.5px] rounded-lg px-4 py-2.5">
          + Добавить событие
        </Link>
      </div>

      {events.length === 0 ? (
        <p className="text-[13px] text-[var(--admin-text-muted)]">Пока нет ни одного события.</p>
      ) : (
        <div className="border border-[var(--admin-border)] rounded-xl bg-[var(--admin-panel)] divide-y divide-[var(--admin-border)] max-w-3xl">
          {events.map(e => {
            const d = new Date(`${e.date}T00:00:00`);
            const dots = IMPORTANCE_DOTS[e.importance] ?? 2;
            const color = IMPORTANCE_COLOR[e.importance] ?? '#f2a93b';
            return (
              <Link
                key={e._id}
                href={`/admin/calendar/${e._id}`}
                className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--admin-input)] transition-colors"
              >
                <div className="w-11 text-center shrink-0">
                  <div className="text-[15px] font-extrabold leading-tight">{d.getDate()}</div>
                  <div className="text-[9px] text-[var(--admin-text-dim)] uppercase">{formatPragueDate(d, { month: 'short' })}</div>
                </div>
                <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-[var(--admin-input)] text-[var(--admin-text-secondary)] shrink-0 whitespace-nowrap">
                  {CATEGORY_ICON[e.category] ?? '🗓️'} {CATEGORY_LABELS[e.category]?.ru ?? e.category}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-[12.5px] font-bold truncate">{e.titleRu}</div>
                  <div className="flex gap-0.5 mt-1">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <span key={i} className="w-[5px] h-[5px] rounded-full" style={{ background: i < dots ? color : 'var(--admin-border)' }} />
                    ))}
                  </div>
                </div>
                <div className="text-[11px] text-[var(--admin-text-dim)] shrink-0 whitespace-nowrap">❤ {e.likes} · 👎 {e.dislikes}</div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
