import { Star, TrendingUp, Megaphone, Building2 } from 'lucide-react';

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

  // Disclosure-style badges — deliberately a different visual family
  // (amber/slate, not the editorial purple/orange above) so a reader can
  // tell at a glance that a piece is commercial or company-sourced rather
  // than our own reporting, same spirit as the "Ad" label on sidebar banners.
  if (badge === 'promo') {
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500 text-amber-950 text-xs font-medium ${className}`}>
        <Megaphone size={10} />
        {locale === 'ru' ? 'Промо' : 'Promo'}
      </span>
    );
  }

  if (badge === 'companyNews') {
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full bg-slate-600 text-white text-xs font-medium ${className}`}>
        <Building2 size={10} />
        {locale === 'ru' ? 'Новости компании' : 'Company news'}
      </span>
    );
  }

  return null;
}
