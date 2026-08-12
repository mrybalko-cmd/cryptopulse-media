import { requireAdminPermission } from '@/lib/admin/auth';
import { fetchPulseHistory } from '@/lib/admin/data';
import { formatPragueDate } from '@/lib/admin/timezone';
import { fetchLatestPulse } from '@/lib/pulse';
import { zoneMeta, zoneOf, median } from '@/lib/pulseMath';
import PulseWidget from '@/components/ui/PulseWidget';

// Deliberately longer than the widget's own chart window: this is the log you
// study the index's behaviour in, so it should outrun what the site shows.
const HISTORY_LIMIT = 400;

const WEEKDAYS = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];

function weekdayLabel(date: string) {
  return WEEKDAYS[(new Date(`${date}T00:00:00Z`).getUTCDay() + 6) % 7];
}

function num(v: number | null | undefined, digits = 0) {
  if (typeof v !== 'number') return '—';
  return v.toFixed(digits).replace('.', ',');
}

function signed(v: number | null | undefined, digits = 1) {
  if (typeof v !== 'number') return '—';
  return `${v > 0 ? '+' : v < 0 ? '−' : ''}${Math.abs(v).toFixed(digits).replace('.', ',')}`;
}

const COLS = 'grid-cols-[70px_26px_1fr_46px_46px_46px_46px_46px_46px_64px_54px_44px]';

export default async function AdminPulsePage() {
  await requireAdminPermission('pulse');
  const [history, latestPulse] = await Promise.all([
    fetchPulseHistory(HISTORY_LIMIT),
    fetchLatestPulse(),
  ]);

  const scores = history.map((s) => s.pulseScore).filter((v): v is number => typeof v === 'number');
  const stats = scores.length
    ? { min: Math.min(...scores), max: Math.max(...scores), med: Math.round(median(scores)) }
    : null;
  const reconstructed = history.filter((s) => s.reconstructed).length;

  return (
    <div>
      <h1 className="text-[19px] font-bold mb-1">Pulse</h1>
      <p className="text-[11px] text-[var(--admin-text-muted)] mb-2 max-w-3xl">
        Считается автоматически раз в сутки (крон в 00:05 UTC), только для чтения — это лог реальных значений.
        Виджет справа — тот же компонент, что и на сайте.
      </p>
      <p className="text-[11px] text-[var(--admin-text-muted)] mb-2 max-w-3xl">
        <b className="text-[var(--admin-text)]">Индекс</b> — абсолютная шкала 0–100, где 50 = нормальные условия рынка.
        Каждый компонент тоже отцентрован на 50: <b className="text-[var(--admin-text)]">Об</b> — оборот биткоина против
        годовой медианы с поправкой на день недели, <b className="text-[var(--admin-text)]">Рост</b> — изменение цены за сутки,
        <b className="text-[var(--admin-text)]"> Вол</b> — размах движения против годовой нормы,
        <b className="text-[var(--admin-text)]"> С&amp;Ж</b> — внешний индекс страха и жадности,
        <b className="text-[var(--admin-text)]"> Альт</b> — медианный отрыв альткоинов от биткоина за 30 дней.
      </p>
      {stats && (
        <p className="text-[11px] text-[var(--admin-text-muted)] mb-6 max-w-3xl">
          За {scores.length} дней: минимум <b className="text-[var(--admin-text)]">{stats.min}</b>, максимум{' '}
          <b className="text-[var(--admin-text)]">{stats.max}</b>, медиана <b className="text-[var(--admin-text)]">{stats.med}</b>.
          {reconstructed > 0 && (
            <>
              {' '}Из них <b className="text-[var(--admin-text)]">{reconstructed}</b> восстановлены по историческим данным
              (помечены значком <span className="text-[var(--admin-text)]">≈</span>) — это реконструкция, а не живое измерение.
            </>
          )}
        </p>
      )}

      {history.length === 0 ? (
        <p className="text-[13px] text-[var(--admin-text-muted)]">Пока нет ни одного снапшота.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
          <div className="border border-[var(--admin-border)] rounded-xl bg-[var(--admin-panel)] overflow-hidden">
            <div className="overflow-x-auto">
              <div className="min-w-[760px]">
                <div className={`grid ${COLS} gap-2 px-4 py-2.5 text-[10px] uppercase font-extrabold text-[var(--admin-text-dim)] border-b border-[var(--admin-border)]`}>
                  <span>Дата</span>
                  <span>Дн</span>
                  <span>Зона</span>
                  <span className="text-right">Индекс</span>
                  <span className="text-right">Об</span>
                  <span className="text-right">Рост</span>
                  <span className="text-right">Вол</span>
                  <span className="text-right">С&amp;Ж</span>
                  <span className="text-right">Альт</span>
                  <span className="text-right">Оборот</span>
                  <span className="text-right">Цена</span>
                  <span className="text-right">К-т</span>
                </div>

                {history.map((s) => {
                  const zone = zoneMeta((s.pulseZone as never) ?? zoneOf(s.pulseScore));
                  return (
                    <div
                      key={s._id}
                      className={`grid ${COLS} gap-2 px-4 py-2.5 text-[11.5px] border-b border-[var(--admin-border)] last:border-b-0 items-center`}
                    >
                      <span className="tabular-nums">
                        {s.reconstructed && <span className="text-[var(--admin-text-dim)] mr-1" title="восстановлено">≈</span>}
                        {formatPragueDate(new Date(`${s.date}T00:00:00Z`), { day: '2-digit', month: '2-digit' })}
                      </span>
                      <span className="text-[var(--admin-text-dim)]">{weekdayLabel(s.date)}</span>
                      <span className="flex items-center gap-2 min-w-0">
                        <span className="flex-1 h-1.5 rounded-full bg-[var(--admin-input)] overflow-hidden relative">
                          <span className="block h-full rounded-full" style={{ width: `${s.pulseScore}%`, background: zone.color }} />
                          {/* the 50 mark — the whole scale hangs off it */}
                          <span className="absolute left-1/2 top-0 bottom-0 w-px bg-[var(--admin-text-dim)]" />
                        </span>
                        <span className="text-[10px] text-[var(--admin-text-muted)] whitespace-nowrap">{zone.ru}</span>
                      </span>
                      <span className="font-bold tabular-nums text-right">{s.pulseScore}</span>
                      <span className="tabular-nums text-right text-[var(--admin-text-dim)]">{num(s.volumeScore)}</span>
                      <span className="tabular-nums text-right text-[var(--admin-text-dim)]">{num(s.growthScore)}</span>
                      <span className="tabular-nums text-right text-[var(--admin-text-dim)]">{num(s.volatilityScore)}</span>
                      <span className="tabular-nums text-right text-[var(--admin-text-dim)]">{num(s.fearGreedValue)}</span>
                      <span className="tabular-nums text-right text-[var(--admin-text-dim)]">{num(s.altcoinScoreValue)}</span>
                      <span className="tabular-nums text-right text-[var(--admin-text-dim)]">
                        {typeof s.btcVolume24h === 'number' ? `${Math.round(s.btcVolume24h / 1e9)} млрд` : '—'}
                      </span>
                      <span
                        className="tabular-nums text-right"
                        style={{ color: (s.priceChange24h ?? 0) >= 0 ? '#22c55e' : '#ef4444' }}
                      >
                        {signed(s.priceChange24h)}%
                      </span>
                      <span className="tabular-nums text-right text-[var(--admin-text-dim)]">{num(s.weekdayFactor, 2)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div>
            {latestPulse ? (
              <PulseWidget data={latestPulse} locale="ru" variant="hub" />
            ) : (
              <p className="text-[12px] text-[var(--admin-text-muted)]">Нет данных для виджета.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
