/**
 * Поля брокера. Значения вводятся свободным текстом: регуляция, плечо и условия
 * у каждого брокера свои, и шаблон тут только навязал бы неправду. Пустое поле на
 * странице так и подписано: «нет подтверждённых данных».
 */

export const BROKER_TEXT_FIELDS = [
  { key: 'access', label: 'Что получаете', hint: 'Монеты и CFD' },
  { key: 'leverage', label: 'Плечо, розница', hint: 'до 1:2' },
  { key: 'instruments', label: 'Криптоинструменты', hint: '11 монет в ЕЭЗ' },
  { key: 'spread', label: 'Спред BTC', hint: 'от $15' },
  { key: 'platforms', label: 'Платформы', hint: 'MT5, веб, приложение' },
  { key: 'funding', label: 'Пополнение', hint: 'Карта, SEPA' },
  { key: 'overnight', label: 'Комиссия за ночь', hint: 'Есть, по инструменту' },
  { key: 'available', label: 'Доступен', hint: 'ЕС, Великобритания' },
  { key: 'lossNote', label: 'Пояснение к проценту потерь', hint: 'По данным брокера, сайт для Великобритании' },
] as const;

type BrokerTextKey = (typeof BROKER_TEXT_FIELDS)[number]['key'];
export type BrokerLocalizedKey = `${BrokerTextKey}${'Ru' | 'En'}`;
export type BrokerLocalizedFields = Partial<Record<BrokerLocalizedKey, string | null>>;

export const BROKER_LOCALIZED_KEYS = BROKER_TEXT_FIELDS.flatMap(f => [`${f.key}Ru`, `${f.key}En`]) as BrokerLocalizedKey[];

/** Одна строка «Лицензии». Вводится вручную целиком; список на выбор намеренно отсутствует. */
export interface BrokerRegulator {
  name: string;
  entity?: string | null;
  licence?: string | null;
  noteRu?: string | null;
  noteEn?: string | null;
  url?: string | null;
  tier1?: boolean | null;
}

export interface BrokerRankable {
  name: string;
  regulators?: BrokerRegulator[] | null;
  minDeposit?: string | null;
}

export function tier1Count(broker: BrokerRankable): number {
  return (broker.regulators ?? []).filter(r => r.tier1).length;
}

/** Депозит вводится текстом ($50, €0). Для порядка берём число, без данных идём в конец. */
function depositNumber(raw: string | null | undefined): number {
  const match = (raw ?? '').replace(/\s/g, '').match(/\d+(?:[.,]\d+)?/);
  return match ? Number(match[0].replace(',', '.')) : Number.POSITIVE_INFINITY;
}

/** Порядок брокеров: больше регуляторов первого уровня, при равенстве меньше депозит. */
export function rankBrokers<T extends BrokerRankable>(brokers: T[]): (T & { rank: number })[] {
  return [...brokers]
    .sort((a, b) =>
      tier1Count(b) - tier1Count(a)
      || depositNumber(a.minDeposit) - depositNumber(b.minDeposit)
      || a.name.localeCompare(b.name))
    .map((broker, i) => ({ ...broker, rank: i + 1 }));
}
