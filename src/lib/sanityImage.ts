import { createImageUrlBuilder as imageUrlBuilder } from '@sanity/image-url';

const builder = imageUrlBuilder({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'placeholder',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
});

export function urlFor(source: { asset?: { _ref?: string } }) {
  return builder.image(source);
}

/**
 * Forces a resize + format on an already-resolved Sanity CDN URL (e.g. from
 * a `coverImage.asset->url` GROQ projection, which returns a plain string,
 * not an asset reference `urlFor()` can build from).
 *
 * Explicit `fm=` beats relying on the requester's Accept header: crawlers,
 * social-share bots, and most SEO tools never send `Accept: image/webp`, so
 * Next's own format negotiation falls back to the original — often a large
 * lossless PNG that `quality` can't shrink. Requesting the format directly
 * from Sanity's CDN guarantees every requester gets the same small file.
 */
export function sanityImageTransform(
  url: string | undefined | null,
  { width, height, format = 'webp', quality = 75 }: { width: number; height?: number; format?: 'webp' | 'jpg'; quality?: number }
): string | undefined {
  if (!url) return url ?? undefined;
  try {
    const u = new URL(url);
    u.searchParams.set('w', String(width));
    if (height) {
      u.searchParams.set('h', String(height));
      u.searchParams.set('fit', 'crop');
    }
    u.searchParams.set('fm', format);
    u.searchParams.set('q', String(quality));
    return u.toString();
  } catch {
    return url;
  }
}
