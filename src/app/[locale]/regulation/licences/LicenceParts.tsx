import Link from 'next/link';
import type { CSSProperties } from 'react';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { authorColorVar } from '@/lib/authorColors';
import type { FeeTable, HeadlineStat, LicenceRegime } from '@/lib/licences';

/**
 * Части страниц лицензионных режимов.
 *
 * Карточка режима — одна ссылка целиком, а не заголовок-ссылка внутри блока.
 * Так же сделаны карточки участников: по маленькой мишени в углу никто не
 * целится, а курсор-рука на всей плитке сразу говорит, что она ведёт дальше.
 */

/** Знак режима: монограмма в его цвете и флаг юрисдикции уголком.
 *
 *  Логотипа регулятора здесь нет намеренно. Эмблема CySEC или VARA на
 *  стороннем сайте читается как заявление об аккредитации, и регуляторы ведут
 *  списки таких сайтов. Наш знак ничего подобного не обещает. */
export function RegimeMark({
  monogram,
  flag,
  accent,
  size = 38,
}: {
  monogram: string;
  flag?: string;
  accent: string;
  size?: number;
}) {
  const c = authorColorVar(accent);
  return (
    <span
      aria-hidden
      className="relative grid shrink-0 place-items-center rounded-[11px] font-extrabold tracking-[-0.03em] text-white"
      style={{
        width: size,
        height: size,
        fontSize: Math.max(8, Math.round(size * 0.29)),
        background: `linear-gradient(145deg, ${c}, color-mix(in srgb, ${c} 55%, #000))`,
        boxShadow: `0 4px 14px color-mix(in srgb, ${c} 36%, transparent)`,
      }}
    >
      {monogram}
      {flag && (
        <i
          className="absolute -bottom-[5px] -right-[5px] not-italic leading-none drop-shadow-[0_1px_3px_rgba(0,0,0,0.45)]"
          style={{ fontSize: Math.round(size * 0.37) }}
        >
          {flag}
        </i>
      )}
    </span>
  );
}

/** Карточка режима в хабе. Кликается в любой точке. */
export function RegimeCard({
  regime,
  locale,
  stats,
  summary,
}: {
  regime: LicenceRegime;
  locale: string;
  stats: HeadlineStat[];
  summary: string;
}) {
  const isRu = locale === 'ru';
  const c = authorColorVar(regime.accent);
  const scope = (isRu ? regime.scope?.ru : regime.scope?.en) || regime.authority;
  return (
    <Link
      href={`/${locale}/regulation/licences/${regime.slug}`}
      style={{ '--c': c } as CSSProperties}
      className="lic-card group flex flex-col gap-[11px] rounded-[18px] border border-[var(--glass-edge)]
                 bg-[linear-gradient(180deg,var(--glass-clear),var(--glass-clear-2))] p-4
                 shadow-[var(--glass-shadow),inset_0_1px_0_var(--glass-edge-lit)]
                 transition-[transform,border-color,box-shadow] duration-150
                 hover:-translate-y-[2px] hover:border-[var(--c)]
                 motion-reduce:transform-none motion-reduce:transition-none"
    >
      <span className="flex items-center gap-2.5">
        <RegimeMark monogram={regime.monogram} flag={regime.jurisdictionFlag} accent={regime.accent} />
        <span className="min-w-0">
          <b className="block text-[15px] font-extrabold tracking-[-0.02em] text-foreground">
            {isRu ? regime.name.ru : regime.name.en}
          </b>
          <span className="block text-[11.5px] text-muted">{scope}</span>
        </span>
      </span>

      {summary && <span className="block text-[12.5px] leading-[1.5] text-muted">{summary}</span>}

      {stats.length > 0 && (
        <span className="mt-0.5 grid grid-cols-3 gap-2">
          {stats.map(s => (
            <span key={s.label} className="block border-t border-[var(--glass-line)] pt-[7px]">
              <span className="block text-[9px] font-extrabold uppercase tracking-[0.09em] text-muted">
                {s.label}
              </span>
              <b className="mt-0.5 block text-[14px] font-extrabold tracking-[-0.025em] tabular-nums text-foreground">
                {s.value}
              </b>
            </span>
          ))}
        </span>
      )}

      <span className="mt-auto flex items-center justify-between gap-2 border-t border-[var(--glass-line)] pt-2.5">
        <span className="text-[10.5px] font-semibold tabular-nums text-muted">{dmy(regime.checkedAt)}</span>
        <span className="inline-flex items-center gap-1 text-[11.5px] font-extrabold text-[var(--c)]">
          {isRu ? 'Открыть' : 'Open'}
          <ChevronRight size={13} strokeWidth={2.6} className="transition-transform group-hover:translate-x-[2px]" />
        </span>
      </span>
    </Link>
  );
}

/** Полоса перехода на хаб со страницы карты. Тоже одна ссылка целиком. */
export function LicenceCta({
  locale,
  regimes,
}: {
  locale: string;
  regimes: LicenceRegime[];
}) {
  const isRu = locale === 'ru';
  if (!regimes.length) return null;
  return (
    <Link
      href={`/${locale}/regulation/licences`}
      className="lic-cta group my-6 grid grid-cols-1 items-center gap-4 rounded-[16px] border border-[var(--glass-edge)]
                 p-[17px_20px] shadow-[var(--glass-shadow)] transition-transform duration-150
                 hover:-translate-y-[2px] sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-[18px]
                 motion-reduce:transform-none motion-reduce:transition-none"
    >
      <span className="block">
        <b className="mb-1 block text-[15.5px] font-extrabold tracking-[-0.025em] text-foreground">
          {isRu ? 'Лицензии: кто выдаёт, сколько ждать, сколько стоит' : 'Licensing: who issues, how long, how much'}
        </b>
        <span className="block max-w-[62ch] text-[12.5px] text-muted">
          {isRu
            ? 'Режимы, под которыми криптобизнес действительно подаётся: пошлина, срок по закону и публичный реестр. Сверено с источниками регуляторов.'
            : 'The regimes a crypto business actually applies under, each with the fee, the statutory clock and the public register. Checked against regulator sources.'}
        </span>
        <span className="mt-2.5 flex flex-wrap gap-[7px]">
          {regimes.map(r => (
            <span
              key={r.slug}
              style={{ '--c': authorColorVar(r.accent) } as CSSProperties}
              className="inline-flex items-center gap-1.5 rounded-[9px] border border-[var(--glass-line)]
                         bg-[var(--glass-clear)] px-2.5 py-[5px] text-[11px] font-bold"
            >
              <i className="h-[7px] w-[7px] rounded-[2px] bg-[var(--c)]" />
              {r.monogram}
            </span>
          ))}
        </span>
      </span>
      <span className="lic-btn inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl px-[19px] py-[11px] text-[13px] font-extrabold text-white">
        {isRu ? 'Открыть раздел' : 'Open licensing hub'}
        <ArrowRight size={14} strokeWidth={2.6} className="transition-transform group-hover:translate-x-[3px]" />
      </span>
    </Link>
  );
}

/** Врезка на странице страны: тот же блок, но внутри чужого материала. */
export function RegimeInset({
  regime,
  locale,
  stats,
  summary,
}: {
  regime: LicenceRegime;
  locale: string;
  stats: HeadlineStat[];
  summary: string;
}) {
  const isRu = locale === 'ru';
  const c = authorColorVar(regime.accent);
  return (
    <Link
      href={`/${locale}/regulation/licences/${regime.slug}`}
      style={{ '--c': c } as CSSProperties}
      className="lic-inset group my-5 grid grid-cols-1 items-center gap-4 rounded-[14px]
                 border border-[var(--glass-edge)] p-[15px_17px] transition-transform duration-150
                 hover:-translate-y-[2px] sm:grid-cols-[minmax(0,1fr)_auto]
                 motion-reduce:transform-none motion-reduce:transition-none"
    >
      <span className="block">
        <span className="mb-1.5 flex items-center gap-2.5">
          <RegimeMark monogram={regime.monogram} flag={regime.jurisdictionFlag} accent={regime.accent} size={32} />
          <b className="text-[14px] font-extrabold tracking-[-0.02em] text-foreground">
            {isRu ? regime.name.ru : regime.name.en}
          </b>
        </span>
        {summary && <span className="block text-[12.5px] text-muted">{summary}</span>}
        {stats.length > 0 && (
          <span className="mt-2.5 flex flex-wrap gap-x-[14px] gap-y-2">
            {stats.map(s => (
              <span key={s.label} className="block text-[11.5px] text-muted">
                {s.label}
                <b className="block text-[15px] font-extrabold tabular-nums text-foreground">{s.value}</b>
              </span>
            ))}
          </span>
        )}
      </span>
      <span
        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl px-[17px] py-[10px]
                   text-[12.5px] font-extrabold text-white"
        style={{ background: `linear-gradient(100deg, ${c}, var(--violet))` }}
      >
        {isRu ? 'Разбор режима' : 'Full breakdown'}
        <ArrowRight size={13} strokeWidth={2.6} className="transition-transform group-hover:translate-x-[3px]" />
      </span>
    </Link>
  );
}

/** Таблица стоимости. Листается вбок внутри своей рамки, страницу не тянет. */
export function FeeTableView({ table, accent }: { table: FeeTable; accent: string }) {
  return (
    <div className="-mx-1 overflow-x-auto px-1">
      <table className="w-full min-w-[340px] border-collapse text-[12.5px]">
        <thead>
          <tr>
            {table.head.map((h, i) => (
              <th
                key={h + i}
                className="border-b border-[var(--glass-line)] pb-2 pr-2.5 text-left text-[9.5px]
                           font-extrabold uppercase tracking-[0.09em] text-muted last:pr-0"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td
                  key={j}
                  className={`border-b border-[var(--glass-line)] py-[9px] pr-2.5 align-top last:pr-0 ${
                    j === 0 ? 'text-foreground' : 'font-bold tabular-nums'
                  }`}
                  style={j > 0 ? { color: authorColorVar(accent) } : undefined}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Шаги заявки. Номер рисуется счётчиком, а не записан в тексте. */
export function Steps({ items, accent }: { items: string[]; accent: string }) {
  if (!items.length) return null;
  const c = authorColorVar(accent);
  return (
    <ol className="m-0 grid list-none gap-2.5 p-0" style={{ '--c': c } as CSSProperties}>
      {items.map((text, i) => (
        <li key={i} className="relative pl-8 text-[12.5px] leading-[1.6] text-muted">
          <span
            className="absolute left-0 top-0 grid h-[22px] w-[22px] place-items-center rounded-[7px]
                       text-[11px] font-extrabold"
            style={{
              color: c,
              background: `color-mix(in srgb, ${c} 16%, transparent)`,
              border: `1px solid color-mix(in srgb, ${c} 34%, transparent)`,
            }}
          >
            {i + 1}
          </span>
          {text}
        </li>
      ))}
    </ol>
  );
}

export function dmy(iso?: string): string {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return d && m && y ? `${d}.${m}.${y}` : iso;
}
