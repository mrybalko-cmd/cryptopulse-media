import type { BrokerRaw } from '@/lib/sanity';
import { LicenceChip, RestrictionChip } from './exchangePresentation';

export function brokerHref(broker: BrokerRaw, locale: string): string {
  return `/${locale}/brokers/${locale === 'ru' ? broker.slugRu : broker.slugEn}`;
}

export function AccessChip({ broker, isRu }: { broker: BrokerRaw; isRu: boolean }) {
  const access = isRu ? broker.accessRu : broker.accessEn;
  if (!access) return <span className="text-[11px] text-muted">{isRu ? 'нет данных' : 'no data'}</span>;
  return broker.offersCoins ? <LicenceChip label={access} /> : <RestrictionChip label={access} />;
}
