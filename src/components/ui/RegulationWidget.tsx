import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getRegulationCountries, lastCheckedAt } from '@/lib/regulation';
import { STATUS_META, type RegStatus } from '@/lib/regulationData';
import GEO from '@/lib/map/widgetPaths.json';

/**
 * Карточка карты регуляции для страницы калькуляторов.
 *
 * Серверный компонент без единой строки клиентского JS: геометрия остаётся
 * в серверной сборке, а в браузер уезжает уже готовый SVG. Своя геометрия,
 * а не та, что рисует большую карту: точки прорежены с допуском 2,5 пункта —
 * при ширине карточки 320 и viewBox 1000 это меньше пикселя, зато 128 КБ
 * превращаются в 54.
 *
 * Стекло собрано из --glass-fill / --glass-line / --glass-hi, за ним стоят
 * размытые ореолы --halo-*: без света позади панель такой прозрачности
 * неотличима от матовой. Тот же приём несут ExchangeTable и AuthorColumns.
 *
 * Размытие подложки задаётся утилитой backdrop-blur-*, а не свойством в CSS:
 * рукописный backdrop-filter вырезается сборкой.
 */

const ORDER: RegStatus[] = ['legal', 'restricted', 'banned', 'unclear'];

/**
 * Короткие подписи только для карточки. В STATUS_META лежит «С ограничениями» —
 * 15 символов, которые в колонке шириной 93 px переносятся на вторую строку
 * и ломают выравнивание чисел. Большую карту не трогаем: там места хватает.
 */
const SHORT: Partial<Record<RegStatus, { ru: string; en: string }>> = {
  legal: { ru: 'Разрешено', en: 'Legal' },
  restricted: { ru: 'Ограничено', en: 'Restricted' },
  banned: { ru: 'Запрещено', en: 'Banned' },
};

export default async function RegulationWidget({ locale }: { locale: string }) {
  const isRu = locale === 'ru';
  const countries = await getRegulationCountries();
  if (!countries.length) return null;

  const counts = ORDER.reduce<Record<RegStatus, number>>((acc, s) => {
    acc[s] = countries.filter(c => c.status === s).length;
    return acc;
  }, {} as Record<RegStatus, number>);

  const byIso = new Map(countries.map(c => [c.isoNum, c.status]));
  const tracked = Object.entries(GEO.paths).filter(([iso]) => byIso.has(iso));
  const plain = Object.entries(GEO.paths).filter(([iso]) => !byIso.has(iso));
  // Страны без контура в геометрии 110m — Сингапур и другие города-государства —
  // рисуются точкой, как и на большой карте.
  const markers = Object.entries(GEO.targets).filter(([iso]) => !GEO.paths[iso as keyof typeof GEO.paths]);

  const checked = lastCheckedAt(countries);
  const checkedLabel = checked
    ? new Date(checked).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '.')
    : '';

  const tint = (iso: string) => STATUS_META[byIso.get(iso)!].color;

  return (
    <Link
      href={`/${locale}/regulation`}
      aria-label={isRu
        ? `Карта регуляции: ${countries.length} стран`
        : `Regulation map: ${countries.length} countries`}
      className="group relative block overflow-hidden rounded-[18px] bg-card shadow-[var(--glass-shadow)]
                 transition-[transform,box-shadow] duration-200 ease-out
                 hover:-translate-y-[3px]
                 motion-reduce:transform-none motion-reduce:transition-none"
    >
      {/* Ореолы — то, ради чего стекло вообще имеет смысл */}
      <span aria-hidden className="pointer-events-none absolute -left-[19%] -top-[12%] h-[59%] w-[72%] rounded-full blur-[30px]"
            style={{ background: 'radial-gradient(50% 50% at 50% 50%, var(--halo-violet), transparent 70%)' }} />
      <span aria-hidden className="pointer-events-none absolute -right-[22%] top-[6%] h-[62%] w-[78%] rounded-full blur-[34px]"
            style={{ background: 'radial-gradient(50% 50% at 50% 50%, var(--halo-cyan), transparent 70%)' }} />
      <span aria-hidden className="pointer-events-none absolute -bottom-[19%] left-[13%] h-[46%] w-[66%] rounded-full blur-[38px]"
            style={{ background: 'radial-gradient(50% 50% at 50% 50%, var(--halo-pink), transparent 72%)' }} />

      <div className="relative z-[2] flex min-h-[323px] flex-col overflow-hidden rounded-[18px]
                      border border-[var(--glass-line)] bg-[image:var(--glass-fill)]
                      shadow-[inset_0_1px_0_var(--glass-hi)]
                      backdrop-blur-[22px] backdrop-saturate-150">
        <div className="flex items-baseline justify-between gap-2 px-4 pt-[15px]">
          <b className="text-[12.5px] font-bold tracking-[0.015em] text-foreground">
            {isRu ? 'Регулирование криптовалют' : 'Crypto regulation'}
          </b>
          <span className="font-mono text-[10.5px] text-muted">
            {countries.length} {isRu ? 'стран' : 'countries'}
          </span>
        </div>

        <div className="relative mt-2 w-full" style={{ aspectRatio: `${GEO.width} / ${GEO.height}` }}>
          <svg
            viewBox={`0 0 ${GEO.width} ${GEO.height}`}
            preserveAspectRatio="xMidYMid meet"
            aria-hidden
            className="absolute inset-0 h-full w-full"
          >
            <defs>
              <filter id="regw-glow" x="-25%" y="-25%" width="150%" height="150%">
                <feGaussianBlur stdDeviation="7" />
              </filter>
              <filter id="regw-lift" x="-25%" y="-25%" width="150%" height="150%">
                <feDropShadow dx="0" dy="5" stdDeviation="4" floodColor="#000" floodOpacity="0.55" />
              </filter>
              {/* Отслеживаемые страны описаны один раз: свечение и сама заливка
                  ссылаются на них через <use>. Пока они рисовались дважды,
                  виджет весил 90 КБ разметки — четверть страницы. */}
              <g id="regw-tracked">
                {tracked.map(([iso, d]) => <path key={iso} d={d} fill={tint(iso)} />)}
                {markers.map(([iso, xy]) => (
                  <circle key={iso} cx={xy[0]} cy={xy[1]} r={6} fill={tint(iso)} />
                ))}
              </g>
            </defs>
            {/* Свет из-под материков */}
            <use href="#regw-tracked" filter="url(#regw-glow)" opacity="0.75" />
            <g filter="url(#regw-lift)">
              <g fill="var(--muted)" fillOpacity="0.25">
                {plain.map(([iso, d]) => <path key={iso} d={d} />)}
              </g>
              <use href="#regw-tracked" fillOpacity="0.93" />
            </g>
          </svg>
        </div>

        {/* Полоса пропорций: ширина сегмента строго по числу стран */}
        <div className="mx-4 mt-[15px] flex h-[5px] gap-[2px] overflow-hidden rounded-[3px]">
          {ORDER.filter(s => counts[s] > 0).map(s => (
            <i key={s} className="block h-full rounded-[2px]"
               style={{ flex: counts[s], background: STATUS_META[s].color }} />
          ))}
        </div>

        {/* Числа набраны как у соседних карточек индексов: extrabold, tabular */}
        <div className="mt-[11px] grid grid-cols-3 gap-1.5 px-4">
          {(['legal', 'restricted', 'banned'] as RegStatus[]).map(s => (
            <span key={s}>
              <b className="block text-[27px] font-extrabold leading-none -tracking-[0.03em] tabular-nums text-foreground">
                {counts[s]}
              </b>
              <em className="mt-[5px] block text-[9.5px] font-extrabold uppercase not-italic tracking-[0.09em] text-muted">
                {isRu ? SHORT[s]!.ru : SHORT[s]!.en}
              </em>
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between gap-2 px-4 pb-[14px] pt-[14px]">
          {checkedLabel && (
            <span className="font-mono text-[10px] text-muted">
              {isRu ? 'проверено' : 'checked'} {checkedLabel}
            </span>
          )}
          <span className="flex items-center gap-1.5 whitespace-nowrap text-[11.5px] font-medium text-foreground">
            {isRu ? 'Открыть карту' : 'Open the map'}
            <ArrowRight
              size={11}
              className="transition-transform duration-200 ease-out group-hover:translate-x-[3px]
                         motion-reduce:transform-none motion-reduce:transition-none"
            />
          </span>
        </div>
      </div>
    </Link>
  );
}
