import Link from 'next/link';
import type { CSSProperties } from 'react';
import { ArrowRight, ChevronRight, Globe2 } from 'lucide-react';
import { authorColorVar } from '@/lib/authorColors';
import GEO from '@/lib/map/widgetPaths.json';
import type { HomeRegulationData, WidgetCountry } from '@/lib/licences';
import { getRegulationCountries, lastCheckedAt } from '@/lib/regulation';
import { STATUS_META, type RegStatus } from '@/lib/regulationData';
import { RegimeMark } from '@/app/[locale]/regulation/licences/LicenceParts';

/**
 * Нижний блок главной: карта, страны, лицензии.
 *
 * Три намерения читателя в одном месте, и каждое со своей ссылкой. Кто хочет
 * обзор — жмёт карту. Кто приехал за конкретной страной — её карточку. Кто
 * собирается работать с клиентами — режим справа. До октября 2026 виджет
 * регуляции жил на главной только под `lg:hidden`, то есть на десктопе его не
 * было вовсе.
 *
 * Карта здесь не интерактивная: это картинка состояния и ссылка на настоящую
 * карту. Клики по странам стоят клиентского компонента, а блок обязан
 * оставаться серверным — он внизу страницы и грузиться ему незачем.
 */

const ORDER: RegStatus[] = ['legal', 'restricted', 'banned', 'unclear'];
const SHORT: Record<RegStatus, { ru: string; en: string }> = {
  legal: { ru: 'Разрешено', en: 'Legal' },
  restricted: { ru: 'С огранич.', en: 'Limited' },
  banned: { ru: 'Запрещено', en: 'Banned' },
  unclear: { ru: 'Нет данных', en: 'Grey' },
};

function flag(iso2: string) {
  return String.fromCodePoint(...[...iso2].map(ch => 0x1f1e6 + ch.charCodeAt(0) - 65));
}

/** Короткая строка под названием страны: регулятор, иначе начало сводки. */
function subtitle(c: WidgetCountry, isRu: boolean): string {
  const summary = (isRu ? c.summaryRu : c.summaryEn) || '';
  if (c.regulatorName) return c.regulatorName;
  return summary.split(/[.·]/)[0]?.trim().slice(0, 42) ?? '';
}

/**
 * Правая колонка карточки страны.
 *
 * Берём первое число с процентом из заметки о налоге. Если его там нет — у
 * Люксембурга ставка зависит от срока владения и числа в заметке не случается —
 * показываем статус словом вместо прочерка: он осмыслен всегда.
 */
function taxValue(c: WidgetCountry, isRu: boolean): { value: string; isRate: boolean } {
  const note = (isRu ? c.taxRu : c.taxEn) || '';
  const rate = note.match(/\d+[.,]?\d*\s*%/)?.[0]?.replace(/\s+/g, '');
  if (rate) return { value: rate, isRate: true };
  const label: Record<WidgetCountry['status'], { ru: string; en: string }> = {
    legal: { ru: 'разрешено', en: 'legal' },
    restricted: { ru: 'ограничено', en: 'limited' },
    banned: { ru: 'запрещено', en: 'banned' },
    unclear: { ru: 'нет данных', en: 'grey' },
  };
  return { value: isRu ? label[c.status].ru : label[c.status].en, isRate: false };
}

export default async function HomeRegulationWidget({
  data,
  locale,
}: {
  data: HomeRegulationData;
  locale: string;
}) {
  if (!data.show || (!data.countries.length && !data.regimes.length)) return null;
  const isRu = locale === 'ru';

  const all = await getRegulationCountries();
  if (!all.length) return null;

  const counts = ORDER.reduce<Record<RegStatus, number>>((acc, s) => {
    acc[s] = all.filter(c => c.status === s).length;
    return acc;
  }, {} as Record<RegStatus, number>);
  const byIso = new Map(all.map(c => [c.isoNum, c.status]));
  const tint = (iso: string) => STATUS_META[byIso.get(iso)!].color;
  const tracked = Object.entries(GEO.paths).filter(([iso]) => byIso.has(iso));
  const plain = Object.entries(GEO.paths).filter(([iso]) => !byIso.has(iso));
  const markers = Object.entries(GEO.targets).filter(
    ([iso]) => !GEO.paths[iso as keyof typeof GEO.paths] && byIso.has(iso)
  );
  const checked = lastCheckedAt(all);
  const checkedLabel = checked
    ? new Date(checked).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '.')
    : '';

  return (
    <section className="home-reg mb-14">
      <div className="mb-[18px] flex items-center justify-between gap-4">
        <h2 className="flex items-center gap-2.5 text-[20px] font-extrabold tracking-[-0.024em] sm:text-[22px]">
          <span className="home-authors-dot" />
          {isRu ? 'Регулирование криптовалют' : 'Crypto regulation'}
        </h2>
        <Link
          href={`/${locale}/regulation`}
          className="inline-flex shrink-0 items-center gap-1.5 text-[12.5px] font-extrabold text-accent transition-colors hover:brightness-110"
        >
          {isRu ? 'Вся карта' : 'Full map'}
          <ChevronRight size={13} strokeWidth={2.6} />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-[18px] lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)_232px]">
        {/* ——— карта ——— */}
        <Link
          href={`/${locale}/regulation`}
          className="group flex flex-col gap-3 rounded-[18px] border border-[var(--glass-edge)]
                     bg-[linear-gradient(180deg,var(--glass-clear),var(--glass-clear-2))] p-[15px]
                     shadow-[var(--glass-shadow),inset_0_1px_0_var(--glass-edge-lit)]
                     transition-[transform,border-color] duration-150 hover:-translate-y-[2px] hover:border-accent
                     motion-reduce:transform-none motion-reduce:transition-none"
        >
          <span className="flex items-baseline justify-between gap-2">
            <b className="text-[12.5px] font-bold">{isRu ? 'Где как обстоит' : 'Where it stands'}</b>
            <span className="font-mono text-[10.5px] text-muted">
              {all.length} {isRu ? 'стран' : 'countries'}
            </span>
          </span>

          <svg
            viewBox={`0 0 ${GEO.width} ${GEO.height}`}
            preserveAspectRatio="xMidYMid meet"
            aria-hidden
            className="block h-auto w-full"
          >
            <g fill="var(--muted)" fillOpacity="0.22">
              {plain.map(([iso, d]) => <path key={iso} d={d} />)}
            </g>
            <g fillOpacity="0.93">
              {tracked.map(([iso, d]) => <path key={iso} d={d} fill={tint(iso)} />)}
              {markers.map(([iso, xy]) => (
                <circle key={iso} cx={xy[0]} cy={xy[1]} r={5} fill={tint(iso)} />
              ))}
            </g>
          </svg>

          <span className="flex h-[5px] gap-[2px] overflow-hidden rounded-[3px]">
            {ORDER.filter(s => counts[s] > 0).map(s => (
              <i key={s} className="block h-full rounded-[2px]" style={{ flex: counts[s], background: STATUS_META[s].color }} />
            ))}
          </span>

          <span className="grid grid-cols-3 gap-2">
            {(['legal', 'restricted', 'banned'] as RegStatus[]).map(s => (
              <span key={s}>
                <b className="block text-[25px] font-extrabold leading-none -tracking-[0.03em] tabular-nums"
                   style={{ color: STATUS_META[s].color }}>
                  {counts[s]}
                </b>
                <em className="mt-[5px] block text-[9px] font-extrabold uppercase not-italic tracking-[0.09em] text-muted">
                  {isRu ? SHORT[s].ru : SHORT[s].en}
                </em>
              </span>
            ))}
          </span>

          <span className="mt-auto flex items-center justify-between gap-2 border-t border-[var(--glass-line)] pt-2.5">
            {checkedLabel && (
              <span className="font-mono text-[10px] text-muted">
                {isRu ? 'проверено' : 'checked'} {checkedLabel}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 text-[11.5px] font-extrabold text-accent">
              {isRu ? 'Открыть карту' : 'Open the map'}
              <ArrowRight size={12} strokeWidth={2.6} className="transition-transform group-hover:translate-x-[3px]" />
            </span>
          </span>
        </Link>

        {/* ——— страны ——— */}
        {data.countries.length > 0 && (
          <div className="flex flex-col gap-[9px]">
            <div className="flex items-baseline justify-between gap-2 px-0.5">
              <b className="text-[12.5px] font-bold">{isRu ? 'Гиды по странам' : 'Guides worth reading'}</b>
              <Globe2 size={13} className="text-muted" />
            </div>
            {data.countries.map(c => {
              const colour = STATUS_META[c.status].color;
              const tax = taxValue(c, isRu);
              return (
                <Link
                  key={c.slug}
                  href={`/${locale}/regulation/${c.slug}`}
                  style={{ '--s': colour } as CSSProperties}
                  className="grid grid-cols-[28px_minmax(0,1fr)_auto] items-center gap-[11px] rounded-[13px]
                             border border-[var(--glass-line)] bg-[var(--glass-clear)] px-3.5 py-[11px]
                             transition-[transform,border-color] duration-150 hover:translate-x-[3px] hover:border-[var(--s)]
                             motion-reduce:transform-none motion-reduce:transition-none"
                >
                  <span className="text-[21px] leading-none">{flag(c.iso2)}</span>
                  <span className="min-w-0">
                    <b className="block truncate text-[13px] font-extrabold tracking-[-0.015em]">
                      {isRu ? c.nameRu : c.nameEn}
                    </b>
                    <span className="block truncate text-[11px] text-muted">{subtitle(c, isRu)}</span>
                  </span>
                  {/* Ставка набирается обычным цветом, а не цветом статуса.
                      Датские 53% зелёным читались как хорошая новость рядом с
                      финскими 30% того же оттенка — цвет статуса здесь врал бы
                      о величине налога. Статус несёт точка слева. */}
                  <span className="flex items-center gap-2.5 text-right">
                    <i className="h-[7px] w-[7px] shrink-0 rounded-full" style={{ background: colour }} />
                    <span>
                      <b
                        className={`block font-extrabold tracking-[-0.025em] tabular-nums ${
                          tax.isRate ? 'text-[14px] text-foreground' : 'text-[11.5px]'
                        }`}
                        style={tax.isRate ? undefined : { color: colour }}
                      >
                        {tax.value}
                      </b>
                      {tax.isRate && (
                        <em className="mt-0.5 block text-[9px] font-bold uppercase not-italic tracking-[0.08em] text-muted">
                          {isRu ? 'налог' : 'tax'}
                        </em>
                      )}
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        )}

        {/* ——— лицензии ——— */}
        {data.regimes.length > 0 && (
          <aside className="flex flex-col gap-[9px]">
            <b className="px-0.5 text-[12.5px] font-bold">{isRu ? 'Лицензии' : 'Licensing'}</b>
            {/* На телефоне режимы идут лентой вбок: пятый вертикальный список
                подряд читатель до конца не прокручивает. */}
            <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0">
              {data.regimes.map(r => (
                <Link
                  key={r.slug}
                  href={`/${locale}/regulation/licences/${r.slug}`}
                  style={{ '--c': authorColorVar(r.accent) } as CSSProperties}
                  className="grid min-w-[188px] shrink-0 grid-cols-[30px_minmax(0,1fr)] items-center gap-2.5
                             rounded-xl border border-[var(--glass-line)] bg-[var(--glass-clear)] px-3 py-2.5
                             transition-[transform,border-color] duration-150 hover:border-[var(--c)]
                             lg:min-w-0 lg:shrink hover:lg:translate-x-[3px]
                             motion-reduce:transform-none motion-reduce:transition-none"
                >
                  <RegimeMark monogram={r.monogram} flag={r.jurisdictionFlag} accent={r.accent} size={30} />
                  <span className="min-w-0">
                    <b className="block truncate text-[12.5px] font-extrabold tracking-[-0.015em]">
                      {isRu ? r.name.ru : r.name.en}
                    </b>
                    <span className="block truncate text-[10.5px] text-muted">
                      {(isRu ? r.scope?.ru : r.scope?.en) || r.authority}
                    </span>
                  </span>
                </Link>
              ))}
            </div>
            <Link
              href={`/${locale}/regulation/licences`}
              className="home-authors-cta mt-0.5 flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-[12px] font-extrabold"
            >
              {isRu ? 'Все режимы' : 'All regimes'}
              <ArrowRight size={13} strokeWidth={2.4} />
            </Link>
          </aside>
        )}
      </div>
    </section>
  );
}
