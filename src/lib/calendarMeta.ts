import { BarChart3, CalendarDays, GitFork, Mic, Rocket, Scale, TrendingUp, Unlock } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

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

/* One hue per event category — a token unlock and a conference no longer look
   alike at a glance. Deliberately NOT --accent: the cyan brand color stays for
   nav/buttons, these are content colors. Same values in both themes; each was
   checked for contrast on #1d1d1f and on #ffffff. */
export const CATEGORY_COLOR: Record<string, string> = {
  report: '#3b82f6',
  unlock: '#f59e0b',
  sale: '#8b5cf6',
  listing: '#10b981',
  fork: '#06b6d4',
  conference: '#ec4899',
  regulation: '#f97316',
  other: '#64748b',
};

/* Lucide components per category, replacing the emoji below in the public UI:
   emoji render at different sizes and weights per OS, these don't. The emoji
   map is still used by the admin list. */
export const CATEGORY_LUCIDE: Record<string, LucideIcon> = {
  report: BarChart3,
  unlock: Unlock,
  sale: Rocket,
  listing: TrendingUp,
  fork: GitFork,
  conference: Mic,
  regulation: Scale,
  other: CalendarDays,
};

/* rgba() rather than color-mix(): browserslist targets Chrome 93+, and
   color-mix needs 111+. */
export function tint(hex: string, alpha: number): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

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

/* Importance shown as a labelled pill instead of three 6px dots nobody could
   read. `short` is for the tight homepage carousel card. */
export const IMPORTANCE_BADGE: Record<
  string,
  { label: { ru: string; en: string }; short: { ru: string; en: string }; className: string }
> = {
  high: {
    label: { ru: 'Высокая важность', en: 'High impact' },
    short: { ru: 'Важно', en: 'High' },
    className: 'text-negative bg-negative/10',
  },
  medium: {
    label: { ru: 'Средняя', en: 'Medium' },
    short: { ru: 'Средняя', en: 'Medium' },
    className: 'text-importance-medium bg-importance-medium/15',
  },
  low: {
    label: { ru: 'Низкая', en: 'Low' },
    short: { ru: 'Низкая', en: 'Low' },
    className: 'text-muted bg-muted/10',
  },
};

export const CATEGORY_ORDER = ['report', 'unlock', 'sale', 'listing', 'fork', 'conference', 'regulation', 'other'];
