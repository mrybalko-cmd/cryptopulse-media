import type { MonthBar } from '@/lib/admin/deals';

/**
 * Поступления по месяцам периода — столбиками.
 *
 * Рисуется на сервере обычным SVG, без библиотеки: один ряд столбиков с
 * подписями — это полсотни строк разметки, а любая библиотека графиков
 * весит больше всей админки и тянет свой клиентский рантайм.
 *
 * Подсказка на наведении — на CSS через group-hover, поэтому компонент
 * остаётся серверным: состояние тут не нужно, а 'use client' ради одного
 * ховера отправил бы в браузер лишний бандл.
 *
 * Пустые месяцы остаются в ряду засечкой на нуле. Выкинуть их было бы
 * короче, но тогда провал между сентябрём и декабрём выглядел бы как три
 * подряд удачных месяца — ровно то, что по графику и надо увидеть.
 */

/* Система координат SVG — своя, в «единицах графика»; наружу он
   растягивается по ширине контейнера. */
const W = 1000;
const H = 200;
const X0 = 44;   // слева — подписи шкалы
const X1 = 990;
const TOP = 28;  // верхняя линия сетки
const BASE = 160; // ноль

const fmt = (n: number, digits = 2) =>
  n.toLocaleString('ru-RU', { minimumFractionDigits: digits, maximumFractionDigits: digits });

/**
 * Круглый потолок шкалы: подпись у линии сетки должна быть читаемым числом,
 * а не 273,91. Берём следующий «шаг» выше максимума.
 */
function ceilNice(max: number): number {
  if (max <= 0) return 100;
  const pow = 10 ** Math.floor(Math.log10(max));
  for (const step of [1, 2, 2.5, 5, 10]) {
    const candidate = step * pow;
    if (candidate >= max) return candidate;
  }
  return 10 * pow;
}

export default function DealsChart({
  bars,
  trimmed,
}: {
  bars: MonthBar[];
  trimmed: boolean;
}) {
  // Один столбик — не график: период короче двух месяцев показывать нечем.
  if (bars.length < 2) return null;

  const max = ceilNice(Math.max(...bars.map(b => b.grossUsdt)));
  const scale = (BASE - TOP) / max;
  const slot = (X1 - X0) / bars.length;
  const barW = Math.min(34, slot * 0.46);
  const best = bars.reduce((a, b) => (b.grossUsdt > a.grossUsdt ? b : a), bars[0]);

  return (
    <div className="mt-[18px] border-t border-[var(--admin-border)] pt-[15px]">
      <div className="flex items-baseline justify-between gap-3 flex-wrap mb-2">
        <h3 className="text-[10.5px] uppercase tracking-wide text-[var(--admin-text-dim)] font-bold m-0">
          Поступления по месяцам, USDT
        </h3>
        <span className="text-[11px] text-[var(--admin-text-dim)] tabular-nums">
          {best.grossUsdt > 0 && `лучший месяц — ${best.label}, ${fmt(best.grossUsdt)} USDT · `}
          наведите на столбик
          {trimmed && ' · показаны последние 24 месяца'}
        </span>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="block w-full h-auto"
        role="img"
        aria-label={
          `Поступления по месяцам в USDT: ` +
          bars.map(b => `${b.label} ${b.grossUsdt > 0 ? fmt(b.grossUsdt, 0) : 'без поступлений'}`).join(', ')
        }
      >
        <defs>
          <linearGradient id="dealBar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#22d3ee" />
            <stop offset="1" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>

        {/* Сетка: только нижняя линия и потолок со серединой — больше линий
            спорит со столбиками. Обе подписаны значением, до которого
            график реально доходит. */}
        <line x1={X0} y1={TOP} x2={X1} y2={TOP} stroke="#35353a" strokeWidth="1" />
        <line x1={X0} y1={BASE - (max / 2) * scale} x2={X1} y2={BASE - (max / 2) * scale} stroke="#35353a" strokeWidth="1" />
        <line x1={X0} y1={BASE} x2={X1} y2={BASE} stroke="#4a4a51" strokeWidth="1" />
        {[max, max / 2, 0].map(v => (
          <text
            key={v}
            x={X0 - 9}
            y={BASE - v * scale + 4}
            textAnchor="end"
            fill="#8b8d94"
            fontSize="10.5"
            fontWeight="700"
          >
            {fmt(v, 0)}
          </text>
        ))}

        {bars.map((b, i) => {
          const cx = X0 + slot * i + slot / 2;
          const h = b.grossUsdt * scale;
          const y = BASE - h;
          const tipW = 132;
          const tipH = 44;
          const tipX = Math.min(Math.max(cx - tipW / 2, X0), X1 - tipW);
          const tipY = Math.max(y - tipH - 20, 2);

          return (
            <g key={b.key} className="group">
              {/* Цель для наведения на всю высоту колонки: ловить мышью
                  тридцать пикселей столбика — занятие на точность. */}
              <rect x={cx - slot / 2} y={6} width={slot} height={BASE - 6 + 30} fill="transparent" />

              {b.grossUsdt > 0 ? (
                <>
                  <rect
                    x={cx - barW / 2}
                    y={y}
                    width={barW}
                    height={h}
                    rx="4"
                    fill="url(#dealBar)"
                    className="transition-[filter] duration-150 group-hover:brightness-110"
                  />
                  <text x={cx} y={y - 7} textAnchor="middle" fill="#ffffff" fontSize="11.5" fontWeight="800">
                    {fmt(b.grossUsdt, 0)}
                  </text>
                  <text x={cx} y={BASE + 18} textAnchor="middle" fill="#d4d5da" fontSize="11" fontWeight="800">
                    {b.label}
                  </text>
                  <g className="opacity-0 transition-opacity duration-150 group-hover:opacity-100 pointer-events-none">
                    <rect x={tipX} y={tipY} width={tipW} height={tipH} rx="7" fill="#141416" stroke="#4a4a51" strokeWidth="1" />
                    <text x={tipX + tipW / 2} y={tipY + 17} textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="700">
                      {fmt(b.grossUsdt)} USDT
                    </text>
                    <text x={tipX + tipW / 2} y={tipY + 33} textAnchor="middle" fill="#bdc0c7" fontSize="10.5" fontWeight="600">
                      ≈ {fmt(b.grossEur)} € · {b.deals === 1 ? '1 сделка' : `сделок: ${b.deals}`}
                    </text>
                  </g>
                </>
              ) : (
                <>
                  <rect x={cx - barW / 2} y={BASE - 2} width={barW} height={2} rx="1" fill="#3d3d43" />
                  <text x={cx} y={BASE - 8} textAnchor="middle" fill="#5a5a60" fontSize="10.5" fontWeight="600">
                    —
                  </text>
                  <text x={cx} y={BASE + 18} textAnchor="middle" fill="#8b8d94" fontSize="11" fontWeight="600">
                    {b.label}
                  </text>
                </>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
