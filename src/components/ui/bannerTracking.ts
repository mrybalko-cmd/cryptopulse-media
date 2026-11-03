'use client';

import { useEffect, type RefObject } from 'react';

/** Взвешенный случайный выбор: баннер с весом 3 выпадает втрое чаще баннера с весом 1. */
export function pickWeighted<T extends { weight?: number }>(items: T[]): T {
  const total = items.reduce((sum, b) => sum + (b.weight || 1), 0);
  let r = Math.random() * total;
  for (const b of items) {
    r -= b.weight || 1;
    if (r <= 0) return b;
  }
  return items[items.length - 1];
}

/**
 * Показ засчитывается, когда баннер виден хотя бы наполовину целую секунду
 * (упрощённый порог видимости MRC), и только один раз за загрузку страницы.
 */
export function useBannerImpression(ref: RefObject<HTMLElement | null>, id: string | null) {
  useEffect(() => {
    const el = ref.current;
    if (!id || !el) return;
    let sent = false;
    let timer: ReturnType<typeof setTimeout> | null = null;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !sent) {
          timer = setTimeout(() => {
            if (sent) return;
            sent = true;
            fetch('/api/banner-view', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ id }),
              keepalive: true,
            }).catch(() => {});
            observer.disconnect();
          }, 1000);
        } else if (!entry.isIntersecting && timer) {
          clearTimeout(timer);
          timer = null;
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      if (timer) clearTimeout(timer);
    };
  }, [ref, id]);
}

/**
 * Клик идёт через наш редирект /api/banner-click, который GA не видит как
 * внешний переход, — поэтому отправляем событие той же формы, что у GA4
 * Enhanced Measurement, и оно попадает в общий отчёт по внешним кликам.
 */
export function trackBannerClickGa(id: string, title: string) {
  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
  gtag?.('event', 'click', {
    link_url: `/api/banner-click/${id}`,
    link_id: id,
    link_text: title,
    outbound: true,
  });
}
