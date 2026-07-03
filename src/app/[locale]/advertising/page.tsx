import { getTranslations, setRequestLocale} from 'next-intl/server';
import { buildOg, BASE } from '@/lib/metadata';
import type { Metadata } from 'next';
import { CONTACT_EMAIL, SITE_NAME } from '@/lib/constants';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'legal' });
  return {
    title: t('advertisingTitle'),
    openGraph: buildOg({ url: `${BASE}/${locale}/advertising`, title: t('advertisingTitle'), description: '', locale }),
    alternates: {
      canonical: `https://cryptopulse.media/${locale}/advertising`,
      languages: { ru: 'https://cryptopulse.media/ru/advertising', en: 'https://cryptopulse.media/en/advertising', 'x-default': 'https://cryptopulse.media/en/advertising' },
    },
  };
}

export default async function AdvertisingPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations('legal');
  const isRu = locale === 'ru';

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-8">{t('advertisingTitle')}</h1>

      <div className="prose prose-invert prose-sm max-w-none
        prose-headings:text-foreground prose-headings:font-semibold
        prose-p:text-muted prose-p:leading-relaxed
        prose-a:text-accent prose-a:underline prose-a:decoration-accent/50 hover:prose-a:decoration-accent
        prose-strong:text-foreground
      ">
        {isRu ? (
          <>
            <p>
              {SITE_NAME} публикует рекламные новости и статьи для проектов из крипто- и
              финтех-индустрии.
            </p>
            <p>
              Если вы хотите разместить материал о своём проекте — напишите на{' '}
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>, и мы обсудим условия и формат
              размещения.
            </p>
          </>
        ) : (
          <>
            <p>
              {SITE_NAME} publishes sponsored news and articles for projects from the crypto and
              fintech industry.
            </p>
            <p>
              If you'd like to feature your project — email{' '}
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> and we'll discuss the terms and
              format of the placement.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
