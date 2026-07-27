import { requireAdminPermission } from '@/lib/admin/auth';
import { fetchPulseHistory } from '@/lib/admin/data';
import { formatPragueDate } from '@/lib/admin/timezone';
import { fetchLatestPulse } from '@/lib/pulse';
import PulseWidget from '@/components/ui/PulseWidget';

const ZONES: Record<string, { color: string; ru: string }> = {
  flatline: { color: '#3b82f6', ru: 'Штиль' },
  warming: { color: '#06b6d4', ru: 'Разминка' },
  steady: { color: '#94a3b8', ru: 'Ровный ритм' },
  heating: { color: '#f472b6', ru: 'Разогрев' },
  peak: { color: '#ec4899', ru: 'Пиковая активность' },
};

const HISTORY_LIMIT = 30;

export default async function AdminPulsePage() {
  await requireAdminPermission('pulse');
  const [history, latestPulse] = await Promise.all([
    fetchPulseHistory(HISTORY_LIMIT),
    fetchLatestPulse(),
  ]);

  return (
    <div>
      <h1 className="text-[19px] font-bold mb-1">Pulse</h1>
      <p className="text-[11px] text-[var(--admin-text-muted)] mb-6 max-w-2xl">
        Данные считаются автоматически раз в сутки (крон в 00:05 UTC) и доступны здесь только для чтения — редактировать нечего,
        это лог реальных значений. Виджет справа — тот же компонент, что и на главной странице сайта.
      </p>

      {history.length === 0 ? (
        <p className="text-[13px] text-[var(--admin-text-muted)]">Пока нет ни одного снапшота.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          <div className="border border-[var(--admin-border)] rounded-xl bg-[var(--admin-panel)] overflow-hidden">
            <div className="grid grid-cols-[90px_1fr_70px_70px_70px_90px] gap-2.5 px-4 py-2.5 text-[10px] uppercase font-extrabold text-[var(--admin-text-dim)] border-b border-[var(--admin-border)]">
              <span>Дата</span><span>Зона</span><span>Score</span><span>F&amp;G</span><span>Alt</span><span>Объём</span>
            </div>
            {history.map(s => {
              const zone = ZONES[s.pulseClassification] ?? { color: 'var(--admin-text-dim)', ru: s.pulseClassification };
              return (
                <div key={s._id} className="grid grid-cols-[90px_1fr_70px_70px_70px_90px] gap-2.5 px-4 py-2.5 text-[11.5px] border-b border-[var(--admin-border)] last:border-b-0 items-center">
                  <span>{formatPragueDate(new Date(`${s.date}T00:00:00Z`), { day: '2-digit', month: '2-digit' })}</span>
                  <span className="flex items-center gap-2">
                    <span className="flex-1 h-1.5 rounded-full bg-[var(--admin-input)] overflow-hidden">
                      <span className="block h-full rounded-full" style={{ width: `${s.pulseScore}%`, background: zone.color }} />
                    </span>
                    <span className="text-[10px] text-[var(--admin-text-muted)] whitespace-nowrap">{zone.ru}</span>
                  </span>
                  <span className="font-bold tabular-nums">{s.pulseScore}</span>
                  <span className="text-[var(--admin-text-dim)] tabular-nums">{s.fearGreedValue}</span>
                  <span className="text-[var(--admin-text-dim)] tabular-nums">{s.altSeasonValue}</span>
                  <span className="tabular-nums" style={{ color: s.volumeChangePct >= 0 ? '#22c55e' : '#ef4444' }}>
                    {s.volumeChangePct >= 0 ? '+' : ''}{s.volumeChangePct.toFixed(1)}%
                  </span>
                </div>
              );
            })}
          </div>

          <div>
            {latestPulse ? (
              <PulseWidget data={latestPulse} locale="ru" idSuffix="admin" />
            ) : (
              <p className="text-[12px] text-[var(--admin-text-muted)]">Нет данных для виджета.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
