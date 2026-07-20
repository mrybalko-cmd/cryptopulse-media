import { fetchPopularContent, fetchActiveBanners } from '@/lib/sanity';
import PopularList from './PopularList';
import SidebarBanner from './SidebarBanner';

interface Props {
  locale: string;
  limit?: number;
}

export default async function PopularSidebar({ locale, limit = 10 }: Props) {
  const [items, banners] = await Promise.all([
    fetchPopularContent(locale, limit),
    fetchActiveBanners(locale),
  ]);

  if (items.length === 0) return null;

  return (
    <aside className="hidden lg:block">
      <div className="sticky top-20 md:top-[8rem] flex flex-col gap-4">
        <PopularList items={items} locale={locale} />
        {banners.length > 0 && <SidebarBanner banners={banners} locale={locale} />}
      </div>
    </aside>
  );
}
