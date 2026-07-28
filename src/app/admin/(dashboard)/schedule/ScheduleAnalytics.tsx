import Link from 'next/link';
import { fetchPublicationTrend, fetchTopLikedContent, fetchAuthorLikesLeaderboard, fetchAuthorPublicationCounts } from '@/lib/admin/data';
import { pragueDateKey, formatPragueDate } from '@/lib/admin/timezone';

const TREND_DAYS = 30;

function formatDayLabel(dateKey: string): string {
  // dateKey is already a Prague-local "YYYY-MM-DD" — parsing it as UTC
  // midnight and formatting with the same Prague zone below is a safe
  // round-trip (see pragueDateKeyToUTCDate), so day/month never drift.
  return formatPragueDate(new Date(`${dateKey}T00:00:00Z`), { day: '2-digit', month: '2-digit' });
}

export default async function ScheduleAnalytics() {
  const [trend, topLiked, authorLeaderboard, pubCounts] = await Promise.all([
    fetchPublicationTrend(TREND_DAYS),
    fetchTopLikedContent(10),
    fetchAuthorLikesLeaderboard(),
    fetchAuthorPublicationCounts(),
  ]);

  const maxCount = Math.max(1, ...trend.counts.map(c => c.count));
  const maxAuthorLikes = Math.max(1, ...authorLeaderboard.map(a => a.totalLikes));
  const todayStr = pragueDateKey(new Date());
  const totalPubs = pubCounts.reduce((sum, a) => sum + a.count, 0);
  const maxPubCount = Math.max(1, ...pubCounts.map(a => a.count));

  return (
    <div className="border border-[var(--admin-border)] rounded-2xl bg-[var(--admin-panel)] p-5 mb-6">
    <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1.15fr_0.95fr] gap-6">
      {/* Publication trend */}
      <div>
        <div className="flex items-start justify-between mb-4 gap-3 flex-wrap">
          <div className="text-[12.5px] font-bold flex items-center gap-1.5">
            <span className="text-green-400">✓</span> Динамика — {TREND_DAYS} дн.
          </div>
          <div className="flex gap-4 text-right">
            <div>
              <div className="text-[10px] text-[var(--admin-text-muted)]">Всего:</div>
              <div className="text-[14px] font-extrabold tabular-nums">{trend.total}</div>
            </div>
            <div>
              <div className="text-[10px] text-[var(--admin-text-muted)]">Среднее:</div>
              <div className="text-[14px] font-extrabold tabular-nums">{trend.average.toFixed(1)}/день</div>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto pb-1">
          <div className="flex items-end gap-1 h-[130px] min-w-max">
            {trend.counts.map(c => {
              const isToday = c.date === todayStr;
              const heightPct = Math.max(4, (c.count / maxCount) * 100);
              return (
                <div key={c.date} className="flex flex-col items-center justify-end h-full w-[18px] shrink-0">
                  <span className="text-[9px] text-[var(--admin-text-muted)] tabular-nums mb-0.5">{c.count || ''}</span>
                  <div
                    className="w-full rounded-sm"
                    style={{ height: `${heightPct}%`, background: isToday ? 'var(--admin-focus)' : '#22c55e' }}
                    title={`${formatDayLabel(c.date)}: ${c.count}`}
                  />
                  <span className="text-[8.5px] text-[var(--admin-text-dim)] mt-1 tabular-nums">{formatDayLabel(c.date)}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top liked */}
      <div className="lg:border-l lg:border-[var(--admin-border)] lg:pl-6">
        <div className="text-[12.5px] font-bold flex items-center gap-1.5 mb-4">
          <span className="text-red-500">❤️</span> Топ по лайкам <span className="text-[10px] font-semibold text-[var(--admin-text-dim)]">· за всё время</span>
        </div>
        {topLiked.length === 0 ? (
          <p className="text-[12px] text-[var(--admin-text-muted)]">Пока нет лайков.</p>
        ) : (
          <div className="flex flex-col gap-3 max-h-[220px] overflow-y-auto pr-1">
            {topLiked.map((item, i) => (
              <Link key={item.id} href={item.href} className="flex items-start gap-2.5 hover:opacity-80 transition-opacity">
                <span className="text-[12px] font-extrabold text-[var(--admin-text-dim)] w-4 shrink-0 pt-0.5">{i + 1}</span>
                <span className="text-[12.5px] font-semibold flex-1 line-clamp-2">{item.title}</span>
                <span className="text-[9px] font-extrabold uppercase text-[var(--admin-text-dim)] bg-[var(--admin-input)] rounded px-1.5 py-0.5 shrink-0">{item.language}</span>
                <span className="flex items-center gap-1 text-[12px] font-bold text-red-500 shrink-0">
                  ❤️ {item.likes}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* By authors */}
      <div className="lg:border-l lg:border-[var(--admin-border)] lg:pl-6">
        <div className="text-[12.5px] font-bold flex items-center gap-1.5 mb-4">
          <span className="text-violet-400">👤</span> По авторам — сумма лайков
        </div>
        {authorLeaderboard.length === 0 ? (
          <p className="text-[12px] text-[var(--admin-text-muted)]">Пока нет данных.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {authorLeaderboard.map(a => (
              <div key={a.id}>
                <div className="flex items-center justify-between text-[12.5px] font-semibold mb-1">
                  <span>{a.name}</span>
                  <span className="tabular-nums font-extrabold">♡ {a.totalLikes}</span>
                </div>
                <div className="h-1.5 rounded-full bg-[var(--admin-input)] overflow-hidden">
                  <div className="h-full rounded-full bg-violet-500" style={{ width: `${(a.totalLikes / maxAuthorLikes) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>

    {/* Publications per author */}
    <div className="mt-5 pt-5 border-t border-[var(--admin-border)]">
      <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
        <div className="text-[12.5px] font-bold flex items-center gap-1.5">
          <span className="text-cyan-400">📰</span> Публикаций по авторам
        </div>
        <div className="text-[10px] text-[var(--admin-text-dim)]">{totalPubs} всего</div>
      </div>
      {pubCounts.length === 0 ? (
        <p className="text-[12px] text-[var(--admin-text-muted)]">Пока нет данных.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {pubCounts.map(a => (
            <div key={a.id}>
              <div className="text-[11px] font-bold text-[var(--admin-text-secondary)] truncate mb-1.5">{a.name}</div>
              <div className="text-[20px] font-extrabold tabular-nums mb-1.5">{a.count}</div>
              <div className="h-[5px] rounded-full bg-[var(--admin-input)] overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${(a.count / maxPubCount) * 100}%`, background: 'linear-gradient(90deg, var(--admin-focus), #22d3ee)' }}
                />
              </div>
              <div className="text-[9.5px] text-[var(--admin-text-dim)] mt-1">{totalPubs > 0 ? Math.round((a.count / totalPubs) * 100) : 0}%</div>
            </div>
          ))}
        </div>
      )}
    </div>
    </div>
  );
}
