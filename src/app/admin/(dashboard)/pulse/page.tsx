import { requireAdminPermission } from '@/lib/admin/auth';
import { fetchPulseHistory } from '@/lib/admin/data';
import { formatPragueDate } from '@/lib/admin/timezone';
import { fetchLatestPulse, PULSE_MIN_SAMPLE } from '@/lib/pulse';
import { percentileOf, zoneMeta, zoneOf } from '@/lib/pulseMath';
import PulseWidget from '@/components/ui/PulseWidget';

// Deliberately longer than the widget's own chart window: this is the log
// you study the index's behaviour in, so it should outrun what the site
// shows rather than mirror it.
const HISTORY_LIMIT = 120;

const WEEKDAYS = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];

function weekdayLabel(date: string) {
  return WEEKDAYS[(new Date(`${date}T00:00:00Z`).getUTCDay() + 6) % 7];
}

function pct(v: number | undefined) {
  if (typeof v !== 'number') return '—';
  return `${v > 0 ? '+' : v < 0 ? '−' : ''}${Math.abs(v).toFixed(1)}%`;
}

export default async function AdminPulsePage() {
  await requireAdminPermission('pulse');
  const [history, latestPulse] = await Promise.all([
    fetchPulseHistory(HISTORY_LIMIT),
    fetchLatestPulse(),
  ]);

  // Ranked against the same series the site uses, so a row here and the
  // widget never disagree about what today's number is.
  const series = history.map((s) => s.pulseScore).filter((v) => typeof v === 'number');

  return (
    <div>
      <h1 className="text-[19px] font-bold mb-1">Pulse</h1>
      <p className="text-[11px] text-[var(--admin-text-muted)] mb-2 max-w-3xl">
        Данные считаются автоматически раз в сутки (крон в 00:05 UTC) и доступны здесь только для чтения — редактировать нечего,
        это лог реальных значений. Виджет справа — тот же компонент, что и на главной странице сайта.
      </p>
      <p className="text-[11px] text-[var(--admin-text-muted)] mb-6 max-w-3xl">
        <b className="text-[var(--admin-text)]">Перцентиль</b> — место дня среди всех {series.length} сохранённых дней, это число
        видит читатель. <b className="text-[var(--admin-text)]">Балл</b> — сырой составной показатель 40/30/30.{' '}
        <b className="text-[var(--admin-text)]">Объём</b> показан дважды: с поправкой на день недели (её использует индекс) и без
        поправки (так считалось до 11.08.2026). <b className="text-[var(--admin-text)]">К-т</b> — коэффициент дня недели: 0,72 у
        понедельника означает, что типичный понедельник даёт 72% оборота среднего дня.
      </p>

      {history.length === 0 ? (
        <p className="text-[13px] text-[var(--admin-text-muted)]">Пока нет ни одного снапшота.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
          <div className="border border-[var(--admin-border)] rounded-xl bg-[var(--admin-panel)] overflow-hidden">
            <div className="overflow-x-auto">
              <div className="min-w-[720px]">
                <div className="grid grid-cols-[74px_28px_1fr_58px_54px_52px_52px_72px_66px_48px] gap-2 px-4 py-2.5 text-[10px] uppercase font-extrabold text-[var(--admin-text-dim)] border-b border-[var(--admin-border)]">
                  <span>Дата</span>
                  <span>Дн</span>
                  <span>Зона</span>
                  <span className="text-right">Перц.</span>
                  <span className="text-right">Балл</span>
                  <span className="text-right">F&amp;G</span>
                  <span className="text-right">Alt</span>
                  <span className="text-right">Объём</span>
                  <span className="text-right">Без попр.</span>
                  <span className="text-right">К-т</span>
                </div>

                {history.map((s) => {
                  const p = percentileOf(s.pulseScore, series);
                  const zone = p === null ? null : zoneMeta(zoneOf(p));
                  return (
                    <div
                      key={s._id}
                      className="grid grid-cols-[74px_28px_1fr_58px_54px_52px_52px_72px_66px_48px] gap-2 px-4 py-2.5 text-[11.5px] border-b border-[var(--admin-border)] last:border-b-0 items-center"
                    >
                      <span className="tabular-nums">
                        {formatPragueDate(new Date(`${s.date}T00:00:00Z`), { day: '2-digit', month: '2-digit' })}
                      </span>
                      <span className="text-[var(--admin-text-dim)]">{weekdayLabel(s.date)}</span>
                      <span className="flex items-center gap-2 min-w-0">
                        <span className="flex-1 h-1.5 rounded-full bg-[var(--admin-input)] overflow-hidden">
                          <span
                            className="block h-full rounded-full"
                            style={{ width: `${p ?? s.pulseScore}%`, background: zone?.color ?? 'var(--admin-text-dim)' }}
                          />
                        </span>
                        <span className="text-[10px] text-[var(--admin-text-muted)] whitespace-nowrap">
                          {zone?.ru ?? '—'}
                        </span>
                      </span>
                      <span className="font-bold tabular-nums text-right">{p ?? '—'}</span>
                      <span className="tabular-nums text-right text-[var(--admin-text-dim)]">{s.pulseScore}</span>
                      <span className="text-[var(--admin-text-dim)] tabular-nums text-right">{s.fearGreedValue}</span>
                      <span className="text-[var(--admin-text-dim)] tabular-nums text-right">{s.altSeasonValue}</span>
                      <span
                        className="tabular-nums text-right"
                        style={{ color: s.volumeChangePct >= 0 ? '#22c55e' : '#ef4444' }}
                      >
                        {pct(s.volumeChangePct)}
                      </span>
                      <span className="tabular-nums text-right text-[var(--admin-text-dim)]">{pct(s.volumeChangePctRaw)}</span>
                      <span className="tabular-nums text-right text-[var(--admin-text-dim)]">
                        {typeof s.weekdayFactor === 'number' ? s.weekdayFactor.toFixed(2).replace('.', ',') : '—'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {latestPulse ? (
              <PulseWidget data={latestPulse} locale="ru" variant="hub" />
            ) : (
              <p className="text-[12px] text-[var(--admin-text-muted)]">Нет данных для виджета.</p>
            )}
            {series.length < PULSE_MIN_SAMPLE && (
              <p className="text-[11px] text-[var(--admin-text-muted)] leading-relaxed">
                Дней меньше {PULSE_MIN_SAMPLE}, поэтому перцентиль пока не показывается ни здесь, ни на сайте — на первом экране
                стоит сырой балл.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
