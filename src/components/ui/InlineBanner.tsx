'use client';

import { useEffect, useRef, useState } from 'react';
import type { InlineBannerItem } from '@/lib/sanity';
import { sanityImageTransform } from '@/lib/sanityImage';
import { pickWeighted, trackBannerClickGa, useBannerImpression } from './bannerTracking';

/**
 * Баннер внутри текста новости или статьи.
 *
 * Две картинки: 970×200 от 768 px (в колонке 696 px он уменьшается до
 * 696×144) и 320×80 на телефоне, в родном размере по центру. Место под
 * баннер резервируется до выбора, чтобы текст не прыгал: сервер уже знает,
 * что активные баннеры есть, а какой из них показать, решает браузер — иначе
 * выбор застыл бы в кэше страницы на час.
 */
export default function InlineBanner({ banners, locale }: { banners: InlineBannerItem[]; locale: string }) {
  const [chosen, setChosen] = useState<InlineBannerItem | null>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    // Выбор только на клиенте: на сервере он попал бы в кэш страницы.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (banners.length) setChosen(pickWeighted(banners));
  }, [banners]);

  useBannerImpression(linkRef, chosen?._id ?? null);

  if (!banners.length) return null;

  return (
    <aside aria-label={locale === 'ru' ? 'Реклама' : 'Advertisement'} className="not-prose my-8 flex flex-col items-center gap-1.5">
      <span className="text-[10px] uppercase tracking-[0.06em] text-muted">{locale === 'ru' ? 'Реклама' : 'Ad'}</span>
      <div className="w-full max-w-[320px] md:max-w-none aspect-[4/1] md:aspect-[970/200] rounded-lg overflow-hidden border border-border bg-card">
        {chosen && (
          <a
            ref={linkRef}
            href={`/api/banner-click/${chosen._id}`}
            target="_blank"
            rel="sponsored noopener noreferrer"
            onClick={() => trackBannerClickGa(chosen._id, chosen.title)}
            className="block w-full h-full"
          >
            <picture>
              <source media="(min-width: 768px)" srcSet={sanityImageTransform(chosen.image, { width: 1392 }) ?? chosen.image} />
              <img src={sanityImageTransform(chosen.mobileImage, { width: 640 }) ?? chosen.mobileImage} alt={chosen.altText} loading="lazy" className="w-full h-full object-cover" />
            </picture>
          </a>
        )}
      </div>
    </aside>
  );
}
