import { ImageResponse } from 'next/og';
import { OgCard, OG_SIZE, words } from '@/lib/ogCard';
import { getRegulationCountries } from '@/lib/regulation';

/**
 * The regulation section gets its own card, inherited by every country page
 * under it. The site-wide card has to describe a whole publication in one
 * sentence; this one only has to answer a question, so it can be sharper.
 */
export const size = OG_SIZE;
export const contentType = 'image/png';

export default async function RegulationOgImage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isRu = locale === 'ru';

  const all = await getRegulationCountries();
  const legal = all.filter(c => c.status === 'legal').length;

  return new ImageResponse(
    (
      <OgCard
        headline={
          isRu
            ? words('Где крипта разрешена, а где вас ждёт штраф', 'разрешена')
            : words('Where crypto is legal — and where it is a fine', 'legal')
        }
        chips={
          isRu
            ? [`${all.length} стран на карте`, `Разрешено в ${legal}`]
            : [`${all.length} countries mapped`, `Legal in ${legal}`]
        }
      />
    ),
    { ...size }
  );
}
