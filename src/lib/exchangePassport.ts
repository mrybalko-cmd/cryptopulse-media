/**
 * Поля паспорта биржи, которые редакция вводит сама. Оборот, место, лицензия и
 * продукты считаются из других данных. Пустое поле на странице так и подписано:
 * «нет подтверждённых данных».
 */

export const EXCHANGE_PASSPORT_FIELDS = [
  { key: 'coinsPairs', label: 'Монет и пар', hint: '1 800+ монет, 2 500+ пар' },
  { key: 'fiat', label: 'Фиат', hint: 'EUR, USD, 60+' },
  { key: 'funding', label: 'Пополнение', hint: 'Карта, SEPA, P2P' },
  { key: 'spotFee', label: 'Комиссия спот', hint: '0,1% / 0,1%' },
  { key: 'kyc', label: 'KYC', hint: 'Обязателен' },
  { key: 'available', label: 'Доступна', hint: 'ЕС, Украина, Казахстан' },
] as const;

type PassportKey = (typeof EXCHANGE_PASSPORT_FIELDS)[number]['key'];
export type ExchangePassportKey = `${PassportKey}${'Ru' | 'En'}`;
export type ExchangePassportText = Partial<Record<ExchangePassportKey, string | null>>;

export const EXCHANGE_PASSPORT_KEYS = EXCHANGE_PASSPORT_FIELDS.flatMap(f => [`${f.key}Ru`, `${f.key}En`]) as ExchangePassportKey[];
