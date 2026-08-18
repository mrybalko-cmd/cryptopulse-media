import { ImageResponse } from 'next/og';
import { OgCard, OG_SIZE, words } from '@/lib/ogCard';
import { getRegulationCountries } from '@/lib/regulation';

// 16:9, not the classic 1200x630 OG ratio — Google Discover's own image
// guidance calls out 16:9 specifically for large-image thumbnail eligibility.
export const size = OG_SIZE;
export const contentType = 'image/png';

export default async function OpengraphImage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isRu = locale === 'ru';

  // Counted, never typed. A hard-coded "46" on a card that is cached for weeks
  // in every messenger is a claim we would have no way to correct.
  const countries = (await getRegulationCountries()).length;

  return new ImageResponse(
    (
      <OgCard
        headline={
          isRu
            ? words('Крипта и ИИ — понятным языком', 'понятным', 'языком')
            : words('Crypto and AI in plain language', 'plain', 'language')
        }
        chips={
          isRu
            ? [`Карта регулирования: ${countries} стран`, 'Курсы, биржи, разборы']
            : [`Regulation map: ${countries} countries`, 'Rates, exchanges, analysis']
        }
      />
    ),
    { ...size }
  );
}
