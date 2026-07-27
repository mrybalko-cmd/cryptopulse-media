import Link from 'next/link';
import { getAdminSession } from '@/lib/admin/auth';
import { hasPermission } from '@/lib/admin/permissions';
import { fetchScheduleItems, type ScheduleItem } from '@/lib/admin/data';
import { redirect } from 'next/navigation';

const TYPE_META: Record<ScheduleItem['type'], { color: string; label: string; title: (t: string) => string }> = {
  news: { color: '#06b6d4', label: 'Новость', title: t => t },
  article: { color: '#8b5cf6', label: 'Статья', title: t => t },
  'banner-start': { color: '#f2a93b', label: 'Баннер', title: t => `«${t}» — старт показа` },
  'banner-end': { color: '#f2a93b', label: 'Баннер', title: t => `«${t}» — конец показа` },
  'exchange-pin': { color: '#ec4899', label: 'Биржа', title: t => `${t} — истекает закрепление` },
};

const LEGEND = [
  { color: '#06b6d4', label: 'Новость' },
  { color: '#8b5cf6', label: 'Статья' },
  { color: '#f2a93b', label: 'Баннер' },
  { color: '#ec4899', label: 'Закрепление биржи' },
];

const WEEKDAYS_SHORT_RU = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

function dayLabel(date: Date): string {
  const today = new Date();
  const isSameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  if (isSameDay(date, today)) return `Сегодня, ${date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}`;
  if (isSameDay(date, tomorrow)) return `Завтра, ${date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}`;
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
}

function groupByDay(items: ScheduleItem[]) {
  const groups = new Map<string, { date: Date; items: ScheduleItem[] }>();
  for (const item of items) {
    const d = new Date(item.at);
    const key = d.toDateString();
    if (!groups.has(key)) groups.set(key, { date: d, items: [] });
    groups.get(key)!.items.push(item);
  }
  return Array.from(groups.values());
}

// Always "today + the next 13 days" (two full weeks), never a calendar-month
// grid — the user explicitly wants a rolling window anchored on today, not
// something that needs prev/next navigation to stay useful.
function buildRollingDays(startFrom: Date, count: number): Date[] {
  const start = new Date(startFrom.getFullYear(), startFrom.getMonth(), startFrom.getDate());
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

export default async function AdminSchedulePage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const session = await getAdminSession();
  if (!session) redirect('/admin/login');

  const { view } = await searchParams;
  const activeView = view === 'calendar' ? 'calendar' : 'list';

  const allItems = await fetchScheduleItems();
  const items = allItems.filter(i => hasPermission(session, i.permission));

  const now = new Date();
  const dayGroups = groupByDay(items);
  const rollingDays = buildRollingDays(now, 14);
  const itemsByDate = new Map<string, ScheduleItem[]>();
  for (const item of items) {
    const key = new Date(item.at).toDateString();
    if (!itemsByDate.has(key)) itemsByDate.set(key, []);
    itemsByDate.get(key)!.push(item);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-[19px] font-bold">Расписание</h1>
        <div className="flex gap-1 bg-[var(--admin-input)] border border-[var(--admin-border)] rounded-lg p-1">
          <Link
            href="/admin/schedule"
            className={`text-[11.5px] font-bold px-3.5 py-1.5 rounded-md transition-colors ${activeView === 'list' ? 'bg-[var(--admin-border)] text-[var(--admin-text)]' : 'text-[var(--admin-text-muted)]'}`}
          >
            Список
          </Link>
          <Link
            href="/admin/schedule?view=calendar"
            className={`text-[11.5px] font-bold px-3.5 py-1.5 rounded-md transition-colors ${activeView === 'calendar' ? 'bg-[var(--admin-border)] text-[var(--admin-text)]' : 'text-[var(--admin-text-muted)]'}`}
          >
            Календарь
          </Link>
        </div>
      </div>

      <div className="flex gap-4 flex-wrap text-[11px] text-[var(--admin-text-muted)] mb-5">
        {LEGEND.map(l => (
          <span key={l.label} className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: l.color }} />
            {l.label}
          </span>
        ))}
      </div>

      {items.length === 0 ? (
        <p className="text-[13px] text-[var(--admin-text-muted)]">Ничего не запланировано.</p>
      ) : activeView === 'list' ? (
        <div className="flex flex-col gap-5 max-w-2xl">
          {dayGroups.map(({ date, items: dayItems }) => (
            <div key={date.toISOString()}>
              <div className="text-[11px] uppercase tracking-wide text-[var(--admin-text-muted)] font-bold mb-2">{dayLabel(date)}</div>
              <div className="border border-[var(--admin-border)] rounded-xl bg-[var(--admin-panel)] divide-y divide-[var(--admin-border)]">
                {dayItems.map(item => {
                  const meta = TYPE_META[item.type];
                  return (
                    <Link
                      key={`${item.type}-${item.id}-${item.at}`}
                      href={item.href}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-[var(--admin-input)] transition-colors"
                    >
                      <span className="text-[11.5px] text-[var(--admin-text-muted)] w-11 shrink-0 tabular-nums">
                        {new Date(item.at).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: meta.color }} />
                      <span className="text-[12.5px] font-semibold flex-1">{meta.title(item.title)}</span>
                      <span className="text-[9.5px] font-extrabold uppercase text-[var(--admin-text-muted)] tracking-wide shrink-0">{meta.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <p className="text-[11px] text-[var(--admin-text-muted)] mb-3">Следующие 14 дней, начиная с сегодняшнего.</p>
          <div className="grid grid-cols-7 gap-1.5">
            {rollingDays.map(date => {
              const isToday = date.toDateString() === now.toDateString();
              const dayItems = itemsByDate.get(date.toDateString()) ?? [];
              return (
                <div
                  key={date.toISOString()}
                  className="border rounded-lg p-1.5 min-h-[92px]"
                  style={{
                    background: 'var(--admin-input)',
                    borderColor: isToday ? 'var(--admin-focus)' : 'var(--admin-border)',
                  }}
                >
                  <div className="text-[10px] text-[var(--admin-text-muted)] mb-0.5">{WEEKDAYS_SHORT_RU[date.getDay()]}</div>
                  <div
                    className={`text-[11px] mb-1 ${isToday ? 'font-extrabold' : 'text-[var(--admin-text-secondary)]'}`}
                    style={isToday ? { color: 'var(--admin-focus)' } : undefined}
                  >
                    {date.getDate()} {date.toLocaleDateString('ru-RU', { month: 'short' })}
                  </div>
                  <div className="flex flex-col gap-0.5">
                    {dayItems.slice(0, 3).map(item => {
                      const meta = TYPE_META[item.type];
                      return (
                        <Link
                          key={`${item.type}-${item.id}`}
                          href={item.href}
                          title={meta.title(item.title)}
                          className="text-[9px] font-bold px-1.5 py-0.5 rounded truncate block"
                          style={{ background: `${meta.color}33`, color: meta.color }}
                        >
                          {item.title}
                        </Link>
                      );
                    })}
                    {dayItems.length > 3 && (
                      <span className="text-[9px] text-[var(--admin-text-muted)] px-1.5">+{dayItems.length - 3}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
