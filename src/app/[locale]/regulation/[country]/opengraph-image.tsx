import { ImageResponse } from 'next/og';
import { OgCard, OG_SIZE, words } from '@/lib/ogCard';
import { getRegulationCountries, REGION_LABELS } from '@/lib/regulation';
import { STATUS_META } from '@/lib/regulationData';

/**
 * A card per country.
 *
 * This file has to exist: a file-based image in the parent segment does not
 * cascade into a dynamic child, so removing this page's explicit `images` left
 * it with no preview image at all — messengers showed the link bare. Caught in
 * production, which is the wrong place to catch it.
 */
export const size = OG_SIZE;
export const contentType = 'image/png';

export default async function CountryOgImage({
  params,
}: {
  params: Promise<{ locale: string; country: string }>;
}) {
  const { locale, country } = await params;
  const isRu = locale === 'ru';
  const all = await getRegulationCountries();
  const c = all.find(x => x.slug === country && x.hasPage);

  // An unknown slug still has to produce an image rather than an error — the
  // route renders 404 for the page, and a broken image alongside it helps
  // nobody.
  // "Криптовалюта в " + a country name gives "в Германия": names are stored in
  // the nominative and Russian wants the prepositional here, which cannot be
  // derived. The page's own seo title already carries the right form, so the
  // card borrows its first clause instead of rebuilding the phrase.
  const seo = c ? (isRu ? c.page?.seoTitle?.ru : c.page?.seoTitle?.en) : '';
  const name = c ? (isRu ? c.name.ru : c.name.en) : isRu ? 'мире' : 'the world';
  const lead = (seo?.split(':')[0] || (isRu ? `Криптовалюта: ${name}` : `Crypto: ${name}`)).trim();
  const status = c ? (isRu ? STATUS_META[c.status].labelRu : STATUS_META[c.status].labelEn) : '';
  // The tax note is prose of unpredictable length, and a chip that wraps to
  // two lines swallows the card. Use it only when it is short enough to read
  // as a label; otherwise fall back to the region, which always is.
  const note = c?.taxNote ? (isRu ? c.taxNote.ru : c.taxNote.en).split('.')[0].trim() : '';
  const second = note && note.length <= 34
    ? note
    : c ? (isRu ? REGION_LABELS[c.region].ru : REGION_LABELS[c.region].en) : '';

  return new ImageResponse(
    (
      <OgCard
        headline={
          isRu ? words(`${lead}: правила и налоги`, 'налоги') : words(`${lead}: rules and tax`, 'tax')
        }
        chips={[status, second].filter(Boolean)}
      />
    ),
    { ...size }
  );
}
