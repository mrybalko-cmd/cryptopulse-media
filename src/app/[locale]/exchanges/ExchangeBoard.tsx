'use client';

import { useEffect, useState } from 'react';
import type { ExchangeRaw } from '@/lib/sanity';
import { exchangeHasLicense } from '@/lib/exchangeFilters';
import {
  applyFilters, parseFilters, serializeFilters,
  EMPTY_FILTERS, type ExchangeFilterState,
} from '@/lib/exchangeFilterState';
import { formatVolume } from '@/components/ui/exchangePresentation';
import ExchangeToolbar from '@/components/ui/ExchangeToolbar';
import ExchangeTable from '@/components/ui/ExchangeTable';
import ExchangeFeatured from '@/components/ui/ExchangeFeatured';
import ExchangeRankingNotes from '@/components/ui/ExchangeRankingNotes';
import { SITE_BRAND } from '@/lib/site';

/**
 * Список бирж с фильтрами.
 *
 * Первая отрисовка идёт без фильтров и уходит в HTML целиком: и таблица, и
 * итоговые цифры, и текст под ней. Робот и читатель без скриптов видят полный
 * рейтинг — ровно то, на что указывает каноникал. Фильтры включаются уже в
 * браузере и в адрес пишутся решёткой, на сервер не уходят (почему именно так
 * — в комментарии к exchangeFilterState.ts).
 */
export default function ExchangeBoard({
  all, locale, isRu, picks,
}: {
  all: ExchangeRaw[];
  locale: string;
  isRu: boolean;
  /** Блок подборок. Приходит готовым с сервера: он строится по полному
   *  списку и от фильтров не зависит, так что отрисовывать его в браузере
   *  незачем — пусть остаётся в HTML как обычный текст. */
  picks: React.ReactNode;
}) {
  const [filters, setFilters] = useState<ExchangeFilterState>(EMPTY_FILTERS);

  // Состояние читается после монтирования, а не при рендере: на сервере
  // никакого адреса нет, и рассинхрон разметки сломал бы гидратацию.
  useEffect(() => {
    const read = () => {
      // Решётка первична. Строка запроса читается ради ссылок, разосланных
      // до перехода на решётку: пусть открываются так же, как открывались.
      const src = window.location.hash.length > 1 ? window.location.hash : window.location.search;
      setFilters(src.length > 1 ? parseFilters(src) : EMPTY_FILTERS);
    };
    read();
    window.addEventListener('hashchange', read);
    return () => window.removeEventListener('hashchange', read);
  }, []);

  function update(next: ExchangeFilterState) {
    setFilters(next);
    const qs = serializeFilters(next);
    // replaceState, а не push: перебор фильтров не должен набивать историю,
    // иначе «назад» из карточки биржи возвращает не туда, откуда ушли.
    // Путь пишем целиком, чтобы со старой ссылки слетела строка запроса и в
    // адресе не оставалось двух наборов фильтров разом.
    window.history.replaceState(null, '', qs ? `${window.location.pathname}#${qs}` : window.location.pathname);
  }

  const { featured, ranked, shown } = applyFilters(all, filters);
  const totalVolume = shown.reduce((sum, e) => sum + (e.volume24h ?? 0), 0);
  const licensedCount = shown.filter(exchangeHasLicense).length;
  const maxVolume = Math.max(0, ...shown.map(e => e.volume24h ?? 0));

  return (
    <>
      {/* На большом экране сводка полосой, на телефоне одна тихая строка:
          это справочная цифра, а не то, за чем на страницу приходят. */}
      <div className="hidden sm:flex flex-wrap rounded-[14px] overflow-hidden border border-[var(--glass-line)] bg-[image:var(--glass-fill)] shadow-[inset_0_1px_0_var(--glass-hi)] mb-5">
        {[
          [isRu ? 'Оборот 24ч' : '24h turnover', formatVolume(totalVolume)],
          [isRu ? 'Площадок' : 'Venues', String(shown.length)],
          [isRu ? 'С лицензией' : 'Licensed', String(licensedCount)],
        ].map(([label, value]) => (
          <span key={label} className="flex items-baseline gap-2 px-4 py-3 border-r border-[var(--glass-line)]">
            <span className="text-[9.5px] font-extrabold uppercase tracking-[0.09em] text-muted">{label}</span>
            <span className="text-[15.5px] font-extrabold tabular-nums -tracking-[0.025em] text-foreground">{value}</span>
          </span>
        ))}
        <span className="flex items-center px-4 py-3 text-[11.5px] text-muted">
          {isRu ? 'объём обновляется раз в сутки' : 'volume refreshed once a day'}
        </span>
      </div>
      <p className="sm:hidden flex items-center gap-1.5 flex-wrap rounded-xl border border-[var(--glass-line)] bg-[image:var(--glass-fill)] shadow-[inset_0_1px_0_var(--glass-hi)] px-3 py-2 text-[11px] text-muted mb-3.5">
        {isRu ? 'Оборот 24ч' : '24h turnover'} <b className="text-foreground font-extrabold tabular-nums">{formatVolume(totalVolume)}</b>
        <span className="opacity-40">·</span>
        <b className="text-foreground font-extrabold tabular-nums">{shown.length}</b> {isRu ? 'площадок' : 'venues'}
        <span className="opacity-40">·</span>
        <b className="text-foreground font-extrabold tabular-nums">{licensedCount}</b> {isRu ? 'с лицензией' : 'licensed'}
      </p>

      <h2 className="sr-only">{isRu ? 'Рейтинг криптобирж' : 'Exchange ranking'}</h2>
      <ExchangeToolbar filters={filters} onChange={update} locale={locale} />

      {shown.length === 0 ? (
        <p className="text-sm text-muted">
          {all.length === 0
            ? (isRu ? 'Пока нет добавленных бирж.' : 'No exchanges added yet.')
            : (isRu ? 'Ничего не найдено по выбранным фильтрам.' : 'Nothing matches the selected filters.')}
        </p>
      ) : (
        <>
          {featured.map(exchange => (
            <ExchangeFeatured key={exchange._id} exchange={exchange} locale={locale} />
          ))}
          {ranked.length > 0 && <ExchangeTable items={ranked} locale={locale} maxVolume={maxVolume} />}
          <p className="text-[11px] text-muted mt-2.5">
            {isRu
              ? `Нажмите на строку, чтобы открыть обзор биржи на ${SITE_BRAND}. «Торговать» открывается в новой вкладке.`
              : 'Tap a row to open our review of that exchange. “Trade” opens in a new tab.'}
          </p>
          {picks}
          <ExchangeRankingNotes
            isRu={isRu}
            venueCount={shown.length}
            totalVolume={totalVolume}
            licensedCount={licensedCount}
            leader={shown[0]}
            runnerUp={ranked[0]}
          />
        </>
      )}
    </>
  );
}
