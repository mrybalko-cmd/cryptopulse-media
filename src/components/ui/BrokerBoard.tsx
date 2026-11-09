'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { BrokerRaw } from '@/lib/sanity';
import { hasExtendedProfile, extendedFacts } from '@/lib/exchangePlacements';
import { ExchangeLogo, ProductChips, RowAction } from './exchangePresentation';
import { AccessChip, brokerHref } from './brokerPresentation';

type BrokerFilter = 'all' | 'coins' | 'cfd';

const noData = (isRu: boolean) => <span className="text-[11px] text-muted">{isRu ? 'нет данных' : 'no data'}</span>;

/**
 * Таблица брокеров. Весь список уходит в HTML при первой отрисовке, переключатель
 * только прячет строки в браузере. Плечо и депозит вводятся текстом, поэтому
 * фильтров по ним нет: при четырёх брокерах они ничего и не отсеяли бы.
 */
export default function BrokerBoard({ brokers, locale }: { brokers: (BrokerRaw & { rank: number })[]; locale: string }) {
  const isRu = locale === 'ru';
  const [filter, setFilter] = useState<BrokerFilter>('all');
  const shown = brokers.filter(b => (filter === 'coins' ? b.offersCoins : filter === 'cfd' ? b.offersCfd : true));

  const chips: { value: BrokerFilter; label: string }[] = [
    { value: 'all', label: isRu ? 'Все' : 'All' },
    { value: 'coins', label: isRu ? 'Монеты' : 'Coins' },
    { value: 'cfd', label: 'CFD' },
  ];

  return (
    <>
      <h2 className="sr-only">{isRu ? 'Список брокеров' : 'Broker list'}</h2>
      <div role="group" aria-label={isRu ? 'Что получаете' : 'What you get'} className="inline-flex gap-1 rounded-xl border border-[var(--glass-line)] bg-[image:var(--glass-fill)] p-1 mb-4">
        {chips.map(chip => (
          <button
            key={chip.value}
            type="button"
            aria-pressed={filter === chip.value}
            onClick={() => setFilter(chip.value)}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-colors ${
              filter === chip.value ? 'bg-[var(--violet)] text-white' : 'text-muted hover:text-foreground'
            }`}
          >
            {chip.label}
          </button>
        ))}
      </div>

      <div className="relative rounded-[20px] overflow-hidden border border-[var(--glass-line)] bg-[image:var(--glass-fill)] shadow-[inset_0_1px_0_var(--glass-hi),var(--glass-shadow)]">
        <table className="w-full table-fixed border-collapse text-left [color:inherit]">
          <caption className="px-3 pt-3 pb-2 text-left text-[9.5px] font-extrabold uppercase tracking-[0.085em] text-muted">
            {isRu ? 'Брокеры с криптовалютой · ' : 'Brokers with crypto · '}{shown.length}
          </caption>
          <thead>
            <tr className="border-b border-[var(--glass-line)] text-[9.5px] font-extrabold uppercase tracking-[0.085em] text-muted">
              <th scope="col" className="w-[36px] md:w-[40px] px-2 md:px-3 py-3 text-center font-extrabold">#</th>
              <th scope="col" className="px-2 md:px-3 py-3 font-extrabold">{isRu ? 'Брокер' : 'Broker'}</th>
              <th scope="col" className="hidden md:table-cell w-[150px] px-3 py-3 font-extrabold">{isRu ? 'Регуляторы' : 'Regulators'}</th>
              <th scope="col" className="hidden md:table-cell w-[132px] px-3 py-3 font-extrabold">{isRu ? 'Что получаете' : 'What you get'}</th>
              <th scope="col" className="hidden lg:table-cell w-[78px] px-3 py-3 font-extrabold">{isRu ? 'Плечо' : 'Leverage'}</th>
              <th scope="col" className="hidden md:table-cell w-[78px] px-3 py-3 font-extrabold">{isRu ? 'Депозит' : 'Deposit'}</th>
              <th scope="col" className="hidden md:table-cell w-[78px] px-3 py-3 font-extrabold">{isRu ? 'Теряют' : 'Lose money'}</th>
              <th scope="col" className="w-[116px] md:w-[142px] px-2 md:px-3 py-3">
                <span className="sr-only">{isRu ? 'Действие' : 'Action'}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {shown.map(broker => {
              const extended = hasExtendedProfile(broker);
              const perk = extended ? (isRu ? broker.extendedPerkRu : broker.extendedPerkEn) : null;
              const facts = extended ? extendedFacts(isRu ? broker.extendedFactsRu : broker.extendedFactsEn) : [];
              const names = (broker.regulators ?? []).map(r => r.name.split(',')[0]);
              const tagline = isRu ? broker.taglineRu : broker.taglineEn;
              return (
                <tr
                  key={broker._id}
                  className={`group relative border-b border-[var(--glass-line)] last:border-b-0 transition-colors ${
                    extended
                      ? 'bg-[color-mix(in_srgb,var(--violet)_11%,transparent)] hover:bg-[color-mix(in_srgb,var(--violet)_16%,transparent)]'
                      : 'hover:bg-[var(--glass-hover)]'
                  }`}
                >
                  <td className="px-2 md:px-3 py-3 align-middle text-center text-xs md:text-sm font-extrabold tabular-nums text-muted">
                    <Link href={brokerHref(broker, locale)} aria-label={broker.name} className="absolute inset-0 z-10" />
                    {broker.rank}
                  </td>
                  <td className="px-2 md:px-3 py-3 align-middle min-w-0">
                    <span className="flex items-center gap-2.5 md:gap-3 min-w-0">
                      <ExchangeLogo exchange={broker} size={34} sizeMobile={30} />
                      <span className="min-w-0 flex-1">
                        <span className="block text-[13px] md:text-[13.5px] font-extrabold text-foreground truncate group-hover:text-accent transition-colors">
                          {broker.name}
                        </span>
                        {/* На телефоне колонок нет: главное стоит под названием. */}
                        <span className="md:hidden block text-[10.5px] text-muted leading-snug mt-0.5">
                          {names.slice(0, 3).join(' · ')}{names.length > 3 ? ` +${names.length - 3}` : ''}
                        </span>
                        <span className="md:hidden block text-[10.5px] font-bold text-foreground leading-snug mt-0.5">
                          {isRu ? broker.accessRu : broker.accessEn}
                          {broker.lossPercent ? ` · ${isRu ? 'теряют' : 'lose'} ${broker.lossPercent}` : ''}
                        </span>
                        {perk ? (
                          <span className="block text-[11.5px] md:text-xs leading-snug text-muted mt-0.5">{perk}</span>
                        ) : (
                          <span className="hidden md:block text-[10.5px] text-muted truncate mt-px">
                            {broker.foundedYear ? `${isRu ? 'с' : 'since'} ${broker.foundedYear}` : ''}
                            {broker.foundedYear && tagline ? ' · ' : ''}
                            {tagline}
                          </span>
                        )}
                        {facts.length > 0 && (
                          <span className="hidden md:flex flex-wrap gap-1 mt-1">
                            <ProductChips labels={facts} max={3} />
                          </span>
                        )}
                      </span>
                    </span>
                  </td>
                  <td className="hidden md:table-cell px-3 py-3 align-middle">
                    <span className="flex flex-wrap gap-1 overflow-hidden">
                      <ProductChips labels={names} max={3} />
                    </span>
                  </td>
                  <td className="hidden md:table-cell px-3 py-3 align-middle whitespace-normal">
                    <AccessChip broker={broker} isRu={isRu} />
                  </td>
                  <td className="hidden lg:table-cell px-3 py-3 align-middle text-xs font-bold text-foreground">
                    {(isRu ? broker.leverageRu : broker.leverageEn) || noData(isRu)}
                  </td>
                  <td className="hidden md:table-cell px-3 py-3 align-middle text-xs font-bold tabular-nums text-foreground">
                    {broker.minDeposit || noData(isRu)}
                  </td>
                  <td className="hidden md:table-cell px-3 py-3 align-middle text-xs font-bold tabular-nums text-foreground">
                    {broker.lossPercent || noData(isRu)}
                  </td>
                  <td className="px-2 md:px-3 py-3 align-middle">
                    <span className="flex justify-end">
                      <RowAction exchange={broker} isRu={isRu} tradeLabel={isRu ? 'Открыть счёт' : 'Open account'} />
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
