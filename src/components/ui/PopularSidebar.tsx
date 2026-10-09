import { fetchPopularContent, fetchActiveBanners } from '@/lib/sanity';
import PopularList from './PopularList';
import SidebarBanner from './SidebarBanner';

interface Props {
  locale: string;
  limit?: number;
  /* Классы на корень. Нужны там, где сайдбар лежит не прямо в сетке, а внутри
     колонки: без `flex-1` его коробка сжимается до содержимого, и липкому
     блоку внутри некуда ехать. Замер 09.10.2026 на странице режима: коробка
     1000px при блоке 1000px, ход — ноль. */
  className?: string;
}

/* Пять материалов, а не десять. Блок липкий, и на экране 900px под него есть
   772px: десять строк давали 1000px, шесть — 796px, и в обоих случаях низ
   баннера обрезался в приклеенном состоянии. Пять дают 745px и помещаются
   целиком. Подпись «Топ N» считается от длины списка, править её не нужно. */
export default async function PopularSidebar({ locale, limit = 5, className = '' }: Props) {
  const [items, banners] = await Promise.all([
    fetchPopularContent(locale, limit),
    fetchActiveBanners(locale),
  ]);

  if (items.length === 0) return null;

  return (
    <aside className={`hidden lg:block ${className}`.trim()}>
      <div className="sticky top-20 md:top-[8rem] flex flex-col gap-4">
        <PopularList items={items} locale={locale} />
        {banners.length > 0 && <SidebarBanner banners={banners} locale={locale} />}
      </div>
    </aside>
  );
}
