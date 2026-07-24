import Link from 'next/link';
import { Newspaper } from 'lucide-react';
import { fetchActiveBanners, type ExchangeMention } from '@/lib/sanity';
import SidebarBanner from './SidebarBanner';

function formatDate(iso: string, locale: string) {
  return new Date(iso).toLocaleDateString(locale === 'ru' ? 'ru-RU' : 'en-US', { day: 'numeric', month: 'short' });
}

// Same sticky card + banner format as PopularSidebar (bg-card border rounded-lg
// list, banner underneath) — just scoped to one exchange's own coverage
// instead of site-wide "most read".
export default async function ExchangeNewsSidebar({
  exchangeName,
  mentions,
  locale,
}: {
  exchangeName: string;
  mentions: ExchangeMention[];
  locale: string;
}) {
  const isRu = locale === 'ru';
  const banners = await fetchActiveBanners(locale);

  return (
    <aside className="lg:sticky lg:top-[8rem] lg:self-start flex flex-col gap-4">
      <div className="bg-card border border-border rounded-lg p-4">
        <h2 className="flex items-center gap-2 text-sm font-bold text-foreground mb-4">
          <Newspaper size={18} className="text-accent" />
          {isRu ? `Новости ${exchangeName}` : `${exchangeName} News`}
        </h2>
        {mentions.length > 0 ? (
          <div className="flex flex-col gap-3">
            {mentions.map((m, i) => (
              <Link
                key={i}
                href={`/${locale}/${m._type === 'news' ? 'news' : 'articles'}/${m.slug}`}
                className="group flex items-start gap-2.5"
              >
                <span className="text-lg font-extrabold text-accent/30 leading-none shrink-0">{i + 1}</span>
                <div className="min-w-0">
                  <h3 className="text-xs font-semibold text-foreground leading-snug line-clamp-2 group-hover:text-accent transition-colors">
                    {m.title}
                  </h3>
                  <p className="text-[11px] text-muted mt-1">{formatDate(m.publishedAt, locale)}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted">
            {isRu ? 'Пока нет материалов, ссылающихся на эту биржу.' : 'No coverage linking to this exchange yet.'}
          </p>
        )}
      </div>
      {banners.length > 0 && <SidebarBanner banners={banners} locale={locale} />}
    </aside>
  );
}
