'use client';

import { useEffect, useRef, useState } from 'react';
import type { SidebarBannerItem } from '@/lib/sanity';

interface Props {
  banners: SidebarBannerItem[];
  locale: string;
}

// Weighted random pick — a banner with weight 3 is 3x as likely to be
// chosen as one with weight 1. Falls back to uniform odds when all weights
// are equal (the default), so existing behavior is unchanged unless someone
// actually raises a weight in Studio.
function pickWeighted(banners: SidebarBannerItem[]): SidebarBannerItem {
  const total = banners.reduce((sum, b) => sum + (b.weight || 1), 0);
  let r = Math.random() * total;
  for (const b of banners) {
    r -= b.weight || 1;
    if (r <= 0) return b;
  }
  return banners[banners.length - 1];
}

// Picked client-side (not server-side) so the rotation actually changes on
// every page reload — a server-side pick would get frozen into the page's
// ISR cache and stay the same for up to 5 minutes for every visitor.
// Impressions only fire once the banner has been at least 50% visible for
// 1s (a simplified MRC viewability threshold), not just present in the DOM.
export default function SidebarBanner({ banners, locale }: Props) {
  const [chosen, setChosen] = useState<SidebarBannerItem | null>(null);
  const trackedRef = useRef(false);
  const linkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (banners.length === 0) return;
    setChosen(pickWeighted(banners));
  }, [banners]);

  useEffect(() => {
    if (!chosen) return;
    const el = linkRef.current;
    if (!el) return;

    let timer: ReturnType<typeof setTimeout> | null = null;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !trackedRef.current) {
          timer = setTimeout(() => {
            if (trackedRef.current) return;
            trackedRef.current = true;
            fetch('/api/banner-view', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ id: chosen._id }),
            });
            observer.disconnect();
          }, 1000);
        } else if (!entry.isIntersecting && timer) {
          clearTimeout(timer);
          timer = null;
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      if (timer) clearTimeout(timer);
    };
  }, [chosen]);

  if (!chosen) return null;

  // The link goes through our own redirect (so Sanity can count the click
  // and resolve the destination server-side — see /api/banner-click, which
  // deliberately never exposes the real advertiser URL to the client to
  // avoid an open-redirect surface). GA can't see that server-side hop as
  // an "outbound click" the way it does for a plain external href, so this
  // fires an equivalent client-side event with the same shape GA4's own
  // Enhanced Measurement outbound-click event uses (event name, param
  // names) — it lands in the same click/Link URL report instead of a
  // separate custom one. Opens in a new tab, so the current page never
  // navigates away and the event always has time to send.
  const trackGaClick = () => {
    const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
    gtag?.('event', 'click', {
      link_url: `/api/banner-click/${chosen._id}`,
      link_id: chosen._id,
      link_text: chosen.title,
      outbound: true,
    });
  };

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
