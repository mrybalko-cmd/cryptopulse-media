import type { BrokerRaw } from '@/lib/sanity';

export function brokerLossSentence(broker: BrokerRaw, isRu: boolean): string {
  if (!broker.lossPercent) {
    return isRu
      ? 'CFD — сложные инструменты с высоким риском быстрой потери денег. Подтверждённого процента потерь у этого брокера у нас нет.'
      : 'CFDs are complex instruments with a high risk of losing money rapidly. We hold no confirmed loss figure for this broker.';
  }
  return isRu
    ? `${broker.lossPercent} розничных счетов теряют деньги при торговле CFD у этого брокера.`
    : `${broker.lossPercent} of retail accounts lose money trading CFDs with this broker.`;
}

/** Плашка риска: обязательна в разделе, в рекламе брокера и на его странице. */
export default function BrokerRisk({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <p
      className={`rounded-xl border border-[color-mix(in_srgb,var(--exchange-warn)_40%,transparent)] bg-[color-mix(in_srgb,var(--exchange-warn)_9%,transparent)] px-3 py-2 text-[12.5px] leading-relaxed text-foreground ${className}`}
    >
      {children}
    </p>
  );
}
