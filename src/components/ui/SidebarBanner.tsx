'use client';

import { useEffect, useRef, useState } from 'react';
import type { SidebarBannerItem } from '@/lib/sanity';
import { pickWeighted, trackBannerClickGa, useBannerImpression } from './bannerTracking';

interface Props {
  banners: SidebarBannerItem[];
  locale: string;
}

// Picked client-side (not server-side) so the rotation actually changes on
// every page reload — a server-side pick would get frozen into the page's
// ISR cache and stay the same for up to 5 minutes for every visitor.
// Impressions only fire once the banner has been at least 50% visible for
// 1s (a simplified MRC viewability threshold), not just present in the DOM.
export default function SidebarBanner({ banners, locale }: Props) {
  const [chosen, setChosen] = useState<SidebarBannerItem | null>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (banners.length === 0) return;
    // Выбор только на клиенте: на сервере он попал бы в кэш страницы.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setChosen(pickWeighted(banners));
  }, [banners]);

  useBannerImpression(linkRef, chosen?._id ?? null);

  if (!chosen) return null;

  // Клик идёт через /api/banner-click: адрес берётся на сервере из документа,
  // а GA получает событие внешнего клика (см. trackBannerClickGa).
  const trackGaClick = () => trackBannerClickGa(chosen._id, chosen.title);

  return (
    <a
      ref={linkRef}
      href={`/api/banner-click/${chosen._id}`}
      target="_blank"
      rel="sponsored noopener noreferrer"
      onClick={trackGaClick}
      className="group relative block aspect-square w-full rounded-lg overflow-hidden border border-border bg-card"
    >
      <span className="absolute top-1.5 left-1.5 z-10 px-1.5 py-0.5 rounded bg-background/80 text-[9px] font-medium text-muted backdrop-blur-sm">
        {locale === 'ru' ? 'Реклама' : 'Ad'}
      </span>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={chosen.image}
        alt={chosen.altText}
        loading="lazy"
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
    </a>
  );
}
