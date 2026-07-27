import Link from 'next/link';
import { getAdminSession } from '@/lib/admin/auth';
import { hasPermission } from '@/lib/admin/permissions';
import { fetchScheduleItems, type ScheduleItem, type ScheduleBannerWindow } from '@/lib/admin/data';
import { redirect } from 'next/navigation';
import ScheduleAnalytics from './ScheduleAnalytics';

const TYPE_META: Record<ScheduleItem['type'], { color: string; label: string; title: (t: string) => string }> = {
  news: { color: '#06b6d4', label: 'Новость', title: t => t },
  article: { color: '#8b5cf6', label: 'Статья', title: t => t },
  'banner-start': { color: '#f2a93b', label: 'Баннер', title: t => `«${t}» — старт показа` },
  'banner-end': { color: '#f2a93b', label: 'Баннер', title: t => `«${t}» — конец показа` },
  'exchange-pin': { color: '#ec4899', label: 'Биржа', title: t => `${t} — истекает закрепление` },
};

const TYPE_ORDER: ScheduleItem['type'][] = ['news', 'article', 'banner-start', 'banner-end', 'exchange-pin'];

const LEGEND = [
  { color: '#06b6d4', label: 'Новость' },
  { color: '#8b5cf6', label: 'Статья' },
  { color: '#f2a93b', label: 'Баннер' },
  { color: '#ec4899', label: 'Закрепление биржи' },
];

const WEEKDAYS_SHORT_RU = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
const LIST_DAYS = 21; // rolling window forward from today
const CALENDAR_DAYS_BEFORE = 7; // recent past, so "realized" counts have something to show
const CALENDAR_DAYS_AFTER = 13; // + today = 21 days total, matching the list window

function dayLabel(date: Date): string {
  const today = new Date();
  const isSameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (isSameDay(date, today)) return `Сегодня, ${date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}`;
  if (isSameDay(date, tomorrow)) return `Завтра, ${date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}`;
  if (isSameDay(date, yesterday)) return `Вчера, ${date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}`;
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
}

// Always "today + the next N-1 days", never a calendar-month grid — the user
// explicitly wants a rolling window anchored on today, not something that
// needs prev/next navigation to stay useful.
function buildRollingDays(startFrom: Date, count: number): Date[] {
  const start = new Date(startFrom.getFullYear(), startFrom.getMonth(), startFrom.getDate());
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

function buildDaysAround(centerDate: Date, daysBefore: number, daysAfter: number): Date[] {
  const start = new Date(centerDate.getFullYear(), centerDate.getMonth(), centerDate.getDate());
  start.setDate(start.getDate() - daysBefore);
  return Array.from({ length: daysBefore + daysAfter + 1 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

function summarizeByType(items: ScheduleItem[]) {
  const counts = new Map<ScheduleItem['type'], number>();
  for (const item of items) counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  return TYPE_ORDER.filter(t => counts.has(t)).map(t => ({ type: t, count: counts.get(t)! }));
}

function itemMatchesLang(item: ScheduleItem, lang?: string): boolean {
  if (!lang) return true;
  if (item.language === null || item.language === 'all') return true;
  return item.language === lang;
}

function bannerMatchesLang(banner: ScheduleBannerWindow, lang?: string): boolean {
  if (!lang) return true;
  return banner.language === 'all' || banner.language === lang;
}

function isBannerActiveOnDay(banner: ScheduleBannerWindow, day: Date): boolean {
  if (!banner.startAt || !banner.endAt) return false;
  const dayStart = new Date(day.getFullYear(), day.getMonth(), day.getDate()).getTime();
  const dayEnd = dayStart + 24 * 60 * 60 * 1000 - 1;
  const start = new Date(banner.startAt).getTime();
  const end = new Date(banner.endAt).getTime();
  return start <= dayEnd && end >= dayStart;
}

function buildHref(view: 'list' | 'calendar', lang?: string): string {
  const params = new URLSearchParams();
  if (view === 'calendar') params.set('view', 'calendar');
  if (lang) params.set('lang', lang);
  const qs = params.toString();
  return qs ? `/admin/schedule?${qs}` : '/admin/schedule';
}

export default async function AdminSchedulePage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string; lang?: string }>;
}) {
  const session = await getAdminSession();
  if (!session) redirect('/admin/login');

  const { view, lang: rawLang } = await searchParams;
  const activeView = view === 'calendar' ? 'calendar' : 'list';
  const lang = rawLang === 'ru' || rawLang === 'en' ? rawLang : undefined;

  const now = new Date();
  const windowStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  windowStart.setDate(windowStart.getDate() - CALENDAR_DAYS_BEFORE);
  const windowEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  windowEnd.setDate(windowEnd.getDate() + LIST_DAYS);
  windowEnd.setHours(23, 59, 59, 999);

  const { items: allItems, banners: allBanners } = await fetchScheduleItems(windowStart.toISOString(), windowEnd.toISOString());
  const items = allItems.filter(i => hasPermission(session, i.permission) && itemMatchesLang(i, lang));
  const canSeeBanners = hasPermission(session, 'banners');
  const banners = canSeeBanners ? allBanners.filter(b => bannerMatchesLang(b, lang)) : [];

  const itemsByDate = new Map<string, ScheduleItem[]>();
  for (const item of items) {
    const key = new Date(item.at).toDateString();
    if (!itemsByDate.has(key)) itemsByDate.set(key, []);
    itemsByDate.get(key)!.push(item);
  }

  const listDays = buildRollingDays(now, LIST_DAYS);
  const calendarDays = buildDaysAround(now, CALENDAR_DAYS_BEFORE, CALENDAR_DAYS_AFTER);

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h1 className="text-[19px] font-bold">Расписание</h1>
        <div className="flex items-center gap-2">
          <div className="flex gap-1 bg-[var(--admin-input)] border border-[var(--admin-border)] rounded-lg p-1">
            {[{ key: undefined, label: 'Все' }, { key: 'ru', label: 'RU' }, { key: 'en', label: 'EN' }].map(l => (
              <Link
                key={l.label}
                href={buildHref(activeView, l.key)}
                className={`text-[11.5px] font-bold px-3 py-1.5 rounded-md transition-colors ${lang === l.key ? 'bg-[var(--admin-border)] text-[var(--admin-text)]' : 'text-[var(--admin-text-muted)]'}`}
              >
                {l.label}
              </Link>
            ))}
          </div>
          <div className="flex gap-1 bg-[var(--admin-input)] border border-[var(--admin-border)] rounded-lg p-1">
            <Link
              href={buildHref('list', lang)}
              className={`text-[11.5px] font-bold px-3.5 py-1.5 rounded-md transition-colors ${activeView === 'list' ? 'bg-[var(--admin-border)] text-[var(--admin-text)]' : 'text-[var(--admin-text-muted)]'}`}
            >
              Список
            </Link>
            <Link
              href={buildHref('calendar', lang)}
              className={`text-[11.5px] font-bold px-3.5 py-1.5 rounded-md transition-colors ${activeView === 'calendar' ? 'bg-[var(--admin-border)] text-[var(--admin-text)]' : 'text-[var(--admin-text-muted)]'}`}
            >
              Календарь
            </Link>
          </div>
        </div>
      </div>

      <ScheduleAnalytics />

      <div className="flex gap-4 flex-wrap text-[11px] text-[var(--admin-text-muted)] mb-5">
        {LEGEND.map(l => (
          <span key={l.label} className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: l.color }} />
            {l.label}
          </span>
        ))}
      </div>

      {activeView === 'list' ? (
        <div className="flex flex-col gap-5 max-w-2xl">
          <p className="text-[11px] text-[var(--admin-text-muted)]">Следующие {LIST_DAYS} дней, начиная с сегодняшнего.</p>
          {listDays.map(date => {
            const dayItems = itemsByDate.get(date.toDateString()) ?? [];
            const summary = summarizeByType(dayItems);
            const activeBanners = banners.filter(b => isBannerActiveOnDay(b, date));
            return (
              <div key={date.toISOString()}>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="text-[11px] uppercase tracking-wide text-[var(--admin-text-muted)] font-bold">{dayLabel(date)}</span>
                  {summary.map(s => (
                    <span key={s.type} className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: `${TYPE_META[s.type].color}26`, color: TYPE_META[s.type].color }}>
                      {s.count} {TYPE_META[s.type].label.toLowerCase()}
                    </span>
                  ))}
                  {activeBanners.map(b => (
                    <Link key={b._id} href={`/admin/banners/${b._id}`} className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400">
                      📢 {b.title}
                    </Link>
                  ))}
                </div>
                {dayItems.length === 0 ? (
                  <div className="border border-dashed border-[var(--admin-border)] rounded-xl px-4 py-2.5 text-[12px] text-[var(--admin-text-dim)]">Нет публикаций</div>
                ) : (
                  <div className={`border border-[var(--admin-border)] rounded-xl bg-[var(--admin-panel)] divide-y divide-[var(--admin-border)] ${dayItems.length > 10 ? 'max-h-[460px] overflow-y-auto' : ''}`}>
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
                          {item.language && item.language !== 'all' && (
                            <span className="text-[9px] font-extrabold uppercase text-[var(--admin-text-dim)] tracking-wide shrink-0">{item.language}</span>
                          )}
                          <span className="text-[9.5px] font-extrabold uppercase text-[var(--admin-text-muted)] tracking-wide shrink-0">{meta.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div>
          <p className="text-[11px] text-[var(--admin-text-muted)] mb-3">
            Последние {CALENDAR_DAYS_BEFORE} дней и следующие {CALENDAR_DAYS_AFTER + 1}, начиная с сегодняшнего — реализованные и запланированные публикации.
          </p>
          <div className="grid grid-cols-7 gap-1.5">
            {calendarDays.map(date => {
              const isToday = date.toDateString() === now.toDateString();
              const dayItems = itemsByDate.get(date.toDateString()) ?? [];
              const realizedItems = dayItems.filter(i => i.realized);
              const plannedItems = dayItems.filter(i => !i.realized);
              return (
                <div
                  key={date.toISOString()}
                  className="border rounded-lg p-1.5 min-h-[110px]"
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

                  <div className="flex flex-col gap-0.5 mb-1">
                    {realizedItems.length > 0 && (
                      <span className="text-[9px] font-bold text-green-400">✅ Реализовано: {realizedItems.length}</span>
                    )}
                    {plannedItems.length > 0 && (
                      <span className="text-[9px] font-bold" style={{ color: 'var(--admin-focus)' }}>🕓 План: {plannedItems.length}</span>
                    )}
                    {dayItems.length === 0 && <span className="text-[9px] text-[var(--admin-text-dim)]">—</span>}
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
                          {item.realized ? '✓ ' : ''}{item.title}
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
