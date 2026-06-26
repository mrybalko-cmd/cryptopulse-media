export interface Billionaire {
  id: string;
  name: { ru: string; en: string };
  company: string;
  netWorth: number;
}

// Approximate net worth as of mid-2026 (Forbes / Bloomberg Billionaires Index).
export const TOP_BILLIONAIRES: Billionaire[] = [
  { id: 'musk', name: { ru: 'Илон Маск', en: 'Elon Musk' }, company: 'Tesla, SpaceX, xAI', netWorth: 950_000_000_000 },
  { id: 'page', name: { ru: 'Ларри Пейдж', en: 'Larry Page' }, company: 'Alphabet', netWorth: 274_000_000_000 },
  { id: 'ellison', name: { ru: 'Ларри Эллисон', en: 'Larry Ellison' }, company: 'Oracle', netWorth: 260_000_000_000 },
  { id: 'brin', name: { ru: 'Сергей Брин', en: 'Sergey Brin' }, company: 'Alphabet', netWorth: 256_000_000_000 },
  { id: 'bezos', name: { ru: 'Джефф Безос', en: 'Jeff Bezos' }, company: 'Amazon', netWorth: 255_000_000_000 },
];
