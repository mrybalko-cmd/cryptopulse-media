import { fetchPopularContent } from '@/lib/sanity';
import PopularList from './PopularList';

interface Props {
  locale: string;
  limit?: number;
}

export default async function PopularSidebar({ locale, limit = 10 }: Props) {
  const items = await fetchPopularContent(locale, limit);

  if (items.length === 0) return null;

  return (
    <aside className="hidden lg:block">
      <div className="sticky top-20 md:top-[8rem]">
        <PopularList items={items} locale={locale} />
      </div>
    </aside>
  );
}
