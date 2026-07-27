import Link from 'next/link';
import { getAdminSession } from '@/lib/admin/auth';
import { hasPermission } from '@/lib/admin/permissions';
import { fetchScheduleItems, type ScheduleItem } from '@/lib/admin/data';
import { formatDateTime } from '../_shared/formatDateTime';
import { redirect } from 'next/navigation';

const TYPE_META: Record<ScheduleItem['type'], { icon: string; label: (title: string) => string }> = {
  news: { icon: '📰', label: t => `Публикация новости «${t}»` },
  article: { icon: '📝', label: t => `Публикация статьи «${t}»` },
  'banner-start': { icon: '🖼️', label: t => `Баннер «${t}» начинает показ` },
  'banner-end': { icon: '🖼️', label: t => `Баннер «${t}» заканчивает показ` },
  'exchange-pin': { icon: '📌', label: t => `Закрепление «${t}» истекает` },
};

function groupByDay(items: ScheduleItem[]) {
  const groups = new Map<string, ScheduleItem[]>();
  for (const item of items) {
    const day = new Date(item.at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
    if (!groups.has(day)) groups.set(day, []);
    groups.get(day)!.push(item);
  }
  return groups;
}

export default async function AdminSchedulePage() {
  const session = await getAdminSession();
  if (!session) redirect('/admin/login');

  const allItems = await fetchScheduleItems();
  const items = allItems.filter(i => hasPermission(session, i.permission));
  const groups = groupByDay(items);

  return (
    <div>
      <h1 className="text-[19px] font-bold mb-1">Расписание</h1>
      <p className="text-[12.5px] text-[var(--admin-text-muted)] mb-6">
        Всё, что должно произойти автоматически: запланированные публикации, показ баннеров и истечение закреплений бирж.
      </p>

      {items.length === 0 ? (
        <p className="text-[13px] text-[var(--admin-text-muted)]">Ничего не запланировано.</p>
      ) : (
        <div className="flex flex-col gap-6 max-w-2xl">
          {Array.from(groups.entries()).map(([day, dayItems]) => (
            <div key={day}>
              <div className="text-[11px] uppercase tracking-wide text-[var(--admin-text-muted)] font-bold mb-2">{day}</div>
              <div className="flex flex-col gap-2">
                {dayItems.map(item => {
                  const meta = TYPE_META[item.type];
                  return (
                    <Link
                      key={`${item.type}-${item.id}-${item.at}`}
                      href={item.href}
                      className="flex items-center gap-3 border border-[var(--admin-border)] rounded-xl p-3 bg-[var(--admin-panel)] hover:border-cyan-500/40 transition-colors"
                    >
                      <span className="text-[18px] shrink-0">{meta.icon}</span>
                      <span className="text-[13px] font-semibold">{meta.label(item.title)}</span>
                      <span className="ml-auto text-[11px] text-[var(--admin-text-muted)] shrink-0">{formatDateTime(item.at)}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
