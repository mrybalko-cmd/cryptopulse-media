/**
 * Пятёрка самых богатых американцев и скорость, с которой растут их состояния.
 *
 * Два замера на человека, а не один. Один даёт только статичную цифру, из
 * которой нельзя построить счётчик; два дают скорость — и её видно, откуда
 * взяли. Оба замера из одного списка Forbes 400, ровно с разницей в год,
 * поэтому сравнивается одно с тем же, а не годовой список с ежедневной
 * оценкой.
 *
 * Обновлять раз в год, после публикации нового Forbes 400 (выходит в
 * сентябре): нынешние `netWorth` уезжают в `previousNetWorth`, даты
 * сдвигаются, сверху ложатся свежие. Состав пятёрки тоже меняется — в 2026-м
 * Ларри Эллисон ушёл на седьмое место, его сменил Майкл Делл.
 *
 * Источники:
 *  - Forbes 400 (2026), котировки на 4 сентября 2026;
 *  - Forbes 400 (2025), опубликован 9 сентября 2025.
 */
export interface Billionaire {
  id: string;
  name: { ru: string; en: string };
  /** «на состояние Илона Маска» / «Elon Musk’s fortune» — форма для фраз,
   *  где имя стоит не в именительном. Держим в данных, а не в коде: правил
   *  склонения для фамилий вроде «Делл» и «Брин» нет, каждая своя. */
  possessive: { ru: string; en: string };
  company: string;
  /** Оценка Forbes на дату NET_WORTH_AS_OF. */
  netWorth: number;
  /** Оценка Forbes годом раньше, на дату PREVIOUS_AS_OF. */
  previousNetWorth: number;
}

/** Котировки, на которых посчитан список Forbes 400 2026 года. */
export const NET_WORTH_AS_OF = '2026-09-04';
/** Публикация списка Forbes 400 2025 года. */
export const PREVIOUS_AS_OF = '2025-09-09';

export const TOP_BILLIONAIRES: Billionaire[] = [
  { id: 'musk', name: { ru: 'Илон Маск', en: 'Elon Musk' }, possessive: { ru: 'Илона Маска', en: 'Elon Musk’s' }, company: 'Tesla, SpaceX', netWorth: 908_000_000_000, previousNetWorth: 428_000_000_000 },
  { id: 'bezos', name: { ru: 'Джефф Безос', en: 'Jeff Bezos' }, possessive: { ru: 'Джеффа Безоса', en: 'Jeff Bezos’s' }, company: 'Amazon', netWorth: 378_000_000_000, previousNetWorth: 241_000_000_000 },
  { id: 'page', name: { ru: 'Ларри Пейдж', en: 'Larry Page' }, possessive: { ru: 'Ларри Пейджа', en: 'Larry Page’s' }, company: 'Alphabet', netWorth: 278_000_000_000, previousNetWorth: 179_000_000_000 },
  { id: 'dell', name: { ru: 'Майкл Делл', en: 'Michael Dell' }, possessive: { ru: 'Майкла Делла', en: 'Michael Dell’s' }, company: 'Dell Technologies', netWorth: 263_000_000_000, previousNetWorth: 129_000_000_000 },
  { id: 'brin', name: { ru: 'Сергей Брин', en: 'Sergey Brin' }, possessive: { ru: 'Сергея Брина', en: 'Sergey Brin’s' }, company: 'Alphabet', netWorth: 256_000_000_000, previousNetWorth: 166_000_000_000 },
];

export const DEFAULT_BILLIONAIRE = TOP_BILLIONAIRES[0];

export function billionaireById(id: string | null | undefined): Billionaire {
  return TOP_BILLIONAIRES.find((b) => b.id === id) ?? DEFAULT_BILLIONAIRE;
}

const MS_BETWEEN_SNAPSHOTS =
  Date.parse(`${NET_WORTH_AS_OF}T00:00:00Z`) - Date.parse(`${PREVIOUS_AS_OF}T00:00:00Z`);

/**
 * Долларов в секунду. Это скорость между двумя замерами, а не поток котировок:
 * у Forbes и Bloomberg открытого потока нет ни у кого, включая нас, и страница
 * говорит об этом прямо под счётчиком.
 */
export function growthPerSecond(b: Billionaire): number {
  return ((b.netWorth - b.previousNetWorth) / MS_BETWEEN_SNAPSHOTS) * 1000;
}

/** Состояние на произвольный момент: замер плюс скорость на прошедшее время. */
export function wealthAt(b: Billionaire, at: number): number {
  const since = (at - Date.parse(`${NET_WORTH_AS_OF}T00:00:00Z`)) / 1000;
  return b.netWorth + growthPerSecond(b) * since;
}
