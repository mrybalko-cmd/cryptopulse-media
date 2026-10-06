/**
 * Цвета карточек участников.
 *
 * Семь значений, те же, что у категорий криптокалендаря: каждое уже проверено
 * на контраст и на графите, и на белом, и у каждого есть пара под обе темы.
 * Свободный цвет редакции не даём — он рано или поздно окажется кислотным.
 *
 * Значение приходит из поля haloColor в админке. Неизвестное значение (а оно
 * возможно: поле строковое, и в базе могут лежать старые варианты) молча
 * падает на фиолетовый, а не роняет карточку.
 */

export const AUTHOR_COLORS = {
  violet: { light: '#7c3aed', dark: '#8b5cf6', label: { ru: 'Фиолетовый', en: 'Violet' } },
  cyan: { light: '#0b8ba8', dark: '#06b6d4', label: { ru: 'Бирюзовый', en: 'Cyan' } },
  pink: { light: '#d4267c', dark: '#ec4899', label: { ru: 'Розовый', en: 'Pink' } },
  blue: { light: '#2f6fd0', dark: '#3b82f6', label: { ru: 'Синий', en: 'Blue' } },
  emerald: { light: '#0a8f5f', dark: '#10b981', label: { ru: 'Изумрудный', en: 'Emerald' } },
  amber: { light: '#c07a09', dark: '#f59e0b', label: { ru: 'Янтарный', en: 'Amber' } },
  orange: { light: '#d1600c', dark: '#f97316', label: { ru: 'Оранжевый', en: 'Orange' } },
} as const;

export type AuthorColorKey = keyof typeof AUTHOR_COLORS;

export const AUTHOR_COLOR_ORDER: AuthorColorKey[] = [
  'violet', 'cyan', 'pink', 'blue', 'emerald', 'amber', 'orange',
];

export function isAuthorColor(key: string | undefined | null): key is AuthorColorKey {
  return !!key && key in AUTHOR_COLORS;
}

/** Переменная темы, а не готовый hex: цвет обязан меняться вместе с темой. */
export function authorColorVar(key: string | undefined | null): string {
  return `var(--author-${isAuthorColor(key) ? key : 'violet'})`;
}

/** Для админки, где тема всегда тёмная и переменных сайта нет. */
export function authorColorHex(key: string | undefined | null, theme: 'light' | 'dark' = 'dark'): string {
  return AUTHOR_COLORS[isAuthorColor(key) ? key : 'violet'][theme];
}
