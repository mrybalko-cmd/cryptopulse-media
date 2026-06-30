export const CATEGORY_LABELS: Record<string, { ru: string; en: string }> = {
  report: { ru: 'Отчётность', en: 'Reports' },
  unlock: { ru: 'Разлоки', en: 'Unlocks' },
  sale: { ru: 'Токенсейлы', en: 'Token Sales' },
  listing: { ru: 'Листинги', en: 'Listings' },
  fork: { ru: 'Хардфорки', en: 'Forks & Upgrades' },
  conference: { ru: 'Конференции', en: 'Conferences' },
  regulation: { ru: 'Регулирование', en: 'Regulation' },
  other: { ru: 'Другое', en: 'Other' },
};

export const CATEGORY_ICON: Record<string, string> = {
  report: '📊',
  unlock: '🔓',
  sale: '🚀',
  listing: '📈',
  fork: '⚙️',
  conference: '🎤',
  regulation: '⚖️',
  other: '🗓️',
};

export const IMPORTANCE_META: Record<string, { label: { ru: string; en: string }; dots: number; colorClass: string }> = {
  low: { label: { ru: 'Низкая важность', en: 'Low importance' }, dots: 1, colorClass: 'bg-muted' },
  medium: { label: { ru: 'Средняя важность', en: 'Medium importance' }, dots: 2, colorClass: 'bg-yellow-500' },
  high: { label: { ru: 'Высокая важность', en: 'High importance' }, dots: 3, colorClass: 'bg-negative' },
};

export const CATEGORY_ORDER = ['report', 'unlock', 'sale', 'listing', 'fork', 'conference', 'regulation', 'other'];
