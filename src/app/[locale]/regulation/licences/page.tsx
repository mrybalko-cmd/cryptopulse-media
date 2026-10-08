// Час, как у карты стран: режимы меняются реже новостей, а правка в админке
// сбрасывает тег `licences` и видна сразу.
export const revalidate = 3600;

import type { Metadata } from 'next';
import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { ScrollText } from 'lucide-react';
import { getLicenceRegimes, lastCheckedRegime, parseHeadline } from '@/lib/licences';
import { buildOg, buildTwitter, BASE, pageTitle, titleText, truncateDesc } from '@/lib/metadata';
import { ORGANIZATION_ID } from '@/lib/organizationSchema';
import { SITE_NAME } from '@/lib/site';
import PopularSidebar from '@/components/ui/PopularSidebar';
import { RegimeCard, dmy } from './LicenceParts';

interface Props { params: Promise<{ locale: string }> }

const T = {
  ru: {
    home: 'Главная', map: 'Карта регуляции',
    h1: 'Лицензии на криптовалюту: режимы и регуляторы',
    lede: 'Где криптобизнес подаётся на разрешение, сколько берёт регулятор, какой срок даёт закон и сколько компаний держат лицензию сегодня.',
    tracked: (n: number) => `${n} ${n === 1 ? 'режим' : n < 5 ? 'режима' : 'режимов'}`,
    checked: 'проверено',
    empty: 'Режимы пока не заведены.',
    title: 'Лицензии на криптовалюту: кто выдаёт и сколько стоит',
    desc: 'Лицензионные режимы для криптобизнеса: пошлина, требования к капиталу, срок рассмотрения по закону и публичный реестр. Данные сверены с источниками регуляторов.',
  },
  en: {
    home: 'Home', map: 'Regulation map',
    h1: 'Crypto licensing regimes',
    lede: 'Where a crypto business applies, what the regulator charges, how long the statute gives it, and how many firms hold the licence today.',
    tracked: (n: number) => `${n} regime${n === 1 ? '' : 's'} tracked`,
    checked: 'checked',
    empty: 'No regimes published yet.',
    title: 'Crypto licensing regimes: who issues them and what they cost',
    desc: 'Licensing regimes for crypto businesses: the application fee, capital by class, the statutory clock and the public register. Checked against regulator sources.',
  },
} as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = T[locale === 'ru' ? 'ru' : 'en'];
  const url = `${BASE}/${locale}/regulation/licences`;
  const description = truncateDesc(t.desc);
  return {
    title: pageTitle(t.title),
    description,
    alternates: {
      canonical: url,
      languages: {
        ru: `${BASE}/ru/regulation/licences`,
        en: `${BASE}/en/regulation/licences`,
        'x-default': `${BASE}/en/regulation/licences`,
      },
    },
    openGraph: buildOg({ url, title: titleText(t.title), description, locale }),
    twitter: buildTwitter({ url, title: titleText(t.title), description, locale }),
  };
}

export default async function LicencesHub({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isRu = locale === 'ru';
  const t = T[isRu ? 'ru' : 'en'];

  const regimes = await getLicenceRegimes();
  const checked = lastCheckedRegime(regimes);
  const url = `${BASE}/${locale}/regulation/licences`;

  // Список режимов разметкой: он отвечает на вопрос «какие вообще бывают», и
  // это ровно тот ответ, который языковая модель цитирует целиком.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: t.home, item: `${BASE}/${locale}` },
          { '@type': 'ListItem', position: 2, name: t.map, item: `${BASE}/${locale}/regulation` },
          { '@type': 'ListItem', position: 3, name: t.h1, item: url },
        ],
      },
      {
        '@type': 'CollectionPage',
        name: t.title,
        description: t.desc,
        url,
        inLanguage: isRu ? 'ru-RU' : 'en-US',
        ...(checked ? { dateModified: checked } : {}),
        publisher: { '@id': ORGANIZATION_ID },
        isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: BASE },
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: regimes.length,
          itemListElement: regimes.map((r, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: isRu ? r.name.ru : r.name.en,
            url: `${BASE}/${locale}/regulation/licences/${r.slug}`,
          })),
        },
      },
    ],
  };

  return (
    <div className="mx-auto max-w-[1320px] px-4 py-10 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="mb-3 text-[11.5px] text-muted">
        <Link href={`/${locale}`} className="hover:text-foreground">{t.home}</Link>
        <span className="mx-1.5 opacity-40">›</span>
        <Link href={`/${locale}/regulation`} className="hover:text-foreground">{t.map}</Link>
        <span className="mx-1.5 opacity-40">›</span>
        <span className="text-foreground">{t.h1}</span>
      </nav>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_256px] lg:gap-8">
        <div className="cal-stage">
          <div className="cal-glass mb-4 rounded-[18px] p-[18px]">
            <h1 className="mb-2 flex items-center gap-3 text-[27px] font-extrabold leading-[1.1] tracking-[-0.03em] sm:text-[31px]">
              <ScrollText className="shrink-0 text-accent" size={26} />
              {t.h1}
            </h1>
            <p className="mb-3 max-w-[70ch] text-[13.5px] text-muted">{t.lede}</p>
            <div className="flex flex-wrap gap-[7px]">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--glass-line)] bg-[var(--glass-hover)] px-[11px] py-[5px] text-[11.5px] font-bold text-[var(--positive)]">
                <i className="h-1.5 w-1.5 rounded-full bg-[var(--positive)]" />
                {t.tracked(regimes.length)}
              </span>
              {checked && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--glass-line)] bg-[var(--glass-hover)] px-[11px] py-[5px] text-[11.5px] font-bold text-muted">
                  {t.checked} <b className="font-extrabold text-foreground tabular-nums">{dmy(checked)}</b>
                </span>
              )}
            </div>
          </div>

          {regimes.length === 0 ? (
            <p className="rounded-xl border border-dashed border-border px-4 py-10 text-center text-[13px] text-muted">
              {t.empty}
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              {regimes.map(r => (
                <RegimeCard
                  key={r.slug}
                  regime={r}
                  locale={locale}
                  stats={parseHeadline(isRu ? r.headline?.ru : r.headline?.en)}
                  summary={(isRu ? r.intro?.ru : r.intro?.en)?.split('\n')[0] ?? ''}
                />
              ))}
            </div>
          )}
        </div>

        <PopularSidebar locale={locale} />
      </div>
    </div>
  );
}
