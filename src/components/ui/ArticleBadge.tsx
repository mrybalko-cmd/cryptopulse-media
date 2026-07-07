import { Star, TrendingUp } from 'lucide-react';

interface ArticleBadgeProps {
  badge?: string;
  locale: string;
  className?: string;
}

export default function ArticleBadge({ badge, locale, className = '' }: ArticleBadgeProps) {
  if (!badge || badge === 'none') return null;

  if (badge === 'editorsChoice') {
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full bg-purple-600 text-white text-xs font-medium ${className}`}>
        <Star size={10} fill="currentColor" />
        {locale === 'ru' ? 'Выбор редакции' : "Editor's choice"}
      </span>
    );
  }

  if (badge === 'trending') {
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full bg-orange-700 text-white text-xs font-medium ${className}`}>
        <TrendingUp size={10} />
        {locale === 'ru' ? 'Актуально' : 'Trending'}
      </span>
    );
  }

  return null;
}
