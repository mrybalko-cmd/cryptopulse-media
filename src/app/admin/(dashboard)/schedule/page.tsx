import Link from 'next/link';
import { getAdminSession } from '@/lib/admin/auth';
import { hasPermission } from '@/lib/admin/permissions';
import { fetchScheduleItems, type ScheduleItem, type ScheduleBannerWindow } from '@/lib/admin/data';
import { pragueDateKey, pragueToday, formatPragueTime, formatPragueDate } from '@/lib/admin/timezone';
import { redirect } from 'next/navigation';
import ScheduleAnalytics from './ScheduleAnalytics';
import ScheduleCalendarView from './ScheduleCalendarView';

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

const LIST_DAYS = 21; // rolling window forward from today
// Calendar view: fetch a wide window once (this site is only a few weeks
// old, so "all history" is a trivial query) and let ScheduleCalendarView
// page through it entirely client-side — no extra round trips needed.
const CALENDAR_HISTORY_DAYS_BACK = 400;
const CALENDAR_FUTURE_DAYS = 60;

function dayLabel(date: Date): string {
  const key = pragueDateKey(date);
  const now = new Date();
  const todayKey = pragueDateKey(now);
  const tomorrowKey = pragueDateKey(new Date(now.getTime() + 24 * 60 * 60 * 1000));
  const yesterdayKey = pragueDateKey(new Date(now.getTime() - 24 * 60 * 60 * 1000));
  const monthDay = formatPragueDate(date, { day: 'numeric', month: 'long' });
  if (key === todayKey) return `Сегодня, ${monthDay}`;
  if (key === tomorrowKey) return `Завтра, ${monthDay}`;
  if (key === yesterdayKey) return `Вчера, ${monthDay}`;
  return monthDay;
}

// Always "today + the next N-1 days", never a calendar-month grid — the user
// explicitly wants a rolling window anchored on today, not something that
// needs prev/next navigation to stay useful. `startFrom` must be a
// UTC-midnight marker for a Prague calendar day (see pragueToday()) — plain
// setDate()/getFullYear() would reinterpret it through the server's own
// timezone, which is not necessarily Prague (or even the same zone twice).
function buildRollingDays(startFrom: Date, count: number): Date[] {
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(startFrom);
    d.setUTCDate(startFrom.getUTCDate() + i);
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
  // Compare Prague calendar-day keys (sortable as plain strings, "YYYY-MM-DD")
  // rather than raw epoch math — the latter would compare against the day
  // marker's own UTC midnight, which doesn't line up with the true Prague
  // day boundary once CEST's +2h offset is accounted for.
  const dayKey = pragueDateKey(day);
  const startKey = pragueDateKey(banner.startAt);
  const endKey = pragueDateKey(banner.endAt);
  return startKey <= dayKey && dayKey <= endKey;
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

  const pragueTodayDate = pragueToday();
  const todayKey = pragueDateKey(new Date());
  const windowStart = new Date(pragueTodayDate);
  windowStart.setUTCDate(windowStart.getUTCDate() - CALENDAR_HISTORY_DAYS_BACK);
  const windowEnd = new Date(pragueTodayDate);
  windowEnd.setUTCDate(windowEnd.getUTCDate() + Math.max(LIST_DAYS, CALENDAR_FUTURE_DAYS) + 1);

  const { items: allItems, banners: allBanners } = await fetchScheduleItems(windowStart.toISOString(), windowEnd.toISOString());
  const items = allItems.filter(i => hasPermission(session, i.permission) && itemMatchesLang(i, lang));
  const canSeeBanners = hasPermission(session, 'banners');
  const banners = canSeeBanners ? allBanners.filter(b => bannerMatchesLang(b, lang)) : [];

  const itemsByDate = new Map<string, ScheduleItem[]>();
  for (const item of items) {
    const key = pragueDateKey(item.at);
    if (!itemsByDate.has(key)) itemsByDate.set(key, []);
    itemsByDate.get(key)!.push(item);
  }

  const listDays = buildRollingDays(pragueTodayDate, LIST_DAYS);
  const historyStartKey = pragueDateKey(windowStart);
  const futureEndKey = pragueDateKey(windowEnd);

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
        <div>
          <p className="text-[11px] text-[var(--admin-text-muted)] mb-3">
            Следующие {LIST_DAYS} дней, начиная с сегодняшнего. ✓ и приглушённый текст — уже опубликовано; яркий текст — ещё запланировано.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {listDays.map(date => {
              const dayItems = itemsByDate.get(pragueDateKey(date)) ?? [];
              const summary = summarizeByType(dayItems);
              const activeBanners = banners.filter(b => isBannerActiveOnDay(b, date));
              const isToday = pragueDateKey(date) === todayKey;
              return (
                <div
                  key={date.toISOString()}
                  className="border rounded-xl p-3 bg-[var(--admin-panel)] flex flex-col min-h-[100px]"
                  style={{ borderColor: isToday ? 'var(--admin-focus)' : 'var(--admin-border)' }}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
                    <span
                      className="text-[11.5px] font-bold"
                      style={{ color: isToday ? 'var(--admin-focus)' : 'var(--admin-text-secondary)' }}
                    >
                      {dayLabel(date)}
                    </span>
                    {activeBanners.map(b => (
                      <Link key={b._id} href={`/admin/banners/${b._id}`} className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 shrink-0">
                        📢 {b.title}
                      </Link>
                    ))}
                  </div>

                  {summary.length > 0 && (
                    <div className="flex items-center gap-2.5 mb-2 flex-wrap">
                      {summary.map(s => (
                        <span key={s.type} className="flex items-center gap-1 text-[10px] font-extrabold tabular-nums" style={{ color: TYPE_META[s.type].color }}>
                          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: TYPE_META[s.type].color }} />
                          {s.count}
                        </span>
                      ))}
                    </div>
                  )}

                  {dayItems.length === 0 ? (
                    <div className="flex-1 flex items-center text-[11px] text-[var(--admin-text-dim)]">Нет публикаций</div>
                  ) : (
                    <div className={`flex flex-col ${dayItems.length > 4 ? 'max-h-[168px] overflow-y-auto pr-0.5' : ''}`}>
                      {dayItems.map(item => {
                        const meta = TYPE_META[item.type];
                        return (
                          <Link
                            key={`${item.type}-${item.id}-${item.at}`}
                            href={item.href}
                            title={meta.title(item.title)}
                            className="flex items-center gap-1.5 py-1 border-t border-[var(--admin-border)] first:border-t-0 hover:bg-[var(--admin-input)] -mx-1 px-1 rounded transition-colors"
                          >
                            <span className="text-[9.5px] text-[var(--admin-text-dim)] w-8 shrink-0 tabular-nums">
                              {formatPragueTime(item.at)}
                            </span>
                            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: item.realized ? 'var(--admin-text-dim)' : meta.color }} />
                            <span
                              className={`text-[10.5px] flex-1 min-w-0 truncate ${item.realized ? 'text-[var(--admin-text-dim)]' : 'text-[var(--admin-text)] font-semibold'}`}
                            >
                              {item.realized ? '✓ ' : ''}{item.title}
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div>
          <p className="text-[11px] text-[var(--admin-text-muted)] mb-3">
            Кликните на день в ленте, чтобы увидеть подробности. Стрелки листают всю историю публикаций — и вперёд, к запланированному.
          </p>
          <ScheduleCalendarView
            itemsByDate={Object.fromEntries(itemsByDate)}
            banners={banners}
            todayKey={todayKey}
            historyStartKey={historyStartKey}
            futureEndKey={futureEndKey}
          />
        </div>
      )}
    </div>
  );
}
