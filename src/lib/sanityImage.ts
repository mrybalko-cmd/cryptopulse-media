import { createImageUrlBuilder as imageUrlBuilder } from '@sanity/image-url';

const builder = imageUrlBuilder({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'placeholder',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
});

export function urlFor(source: { asset?: { _ref?: string } }) {
  return builder.image(source);
}
