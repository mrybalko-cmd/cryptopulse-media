// Час, как у режимов лицензий: прайсы меняются реже новостей, а правка в
// админке сбрасывает тег `ai` и видна сразу.
export const revalidate = 3600;

import type { Metadata } from 'next';
import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { getAiJobs, getAiServices, facetGroupsFor, servicesForJob, pick, type Locale } from '@/lib/ai';
import { buildOg, buildTwitter, BASE, pageTitle, titleText, truncateDesc } from '@/lib/metadata';
import { ORGANIZATION_ID } from '@/lib/organizationSchema';
import { SITE_NAME } from '@/lib/site';
import PopularSidebar from '@/components/ui/PopularSidebar';
import AiCatalogue from './AiParts';
import JobIcon from './JobIcon';

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ job?: string }>;
}

const T = {
  ru: {
    home: 'Главная', ai: 'AI', here: 'Сервисы',
    h1: 'Какую AI-шку взять под свою задачу',
    lede: 'Уникальный хаб по подборке AI-инструментов под вашу задачу. Используя наш фильтр, подбери идеальное решение для реализации своих проектов.',
    servicesH: 'Сервисы', filters: 'Фильтры', reset: 'Сбросить всё', close: 'Закрыть',
    details: 'Детали', review: 'Разбор', onRequest: 'по запросу',
    priceChecked: 'Цена сверена', priceUnchecked: 'Цена не сверена',
    ofWhichChecked: 'цена сверена', filtersOn: 'фильтров',
    emptyA: 'Под эти условия ничего нет',
    emptyB: 'Снимите часть галочек — узкие признаки отсекают больше всего.',
    empty: 'Сервисы пока не заведены.',
    collection: 'Разбор задачи',
    title: 'AI-сервисы: что выбрать под свою задачу',
    desc: 'Каталог AI-инструментов по задачам: генерация видео и изображений, расшифровка, озвучка, код. Тарифы сверены с официальными прайсами, у каждой цены стоит дата проверки.',
  },
  en: {
    home: 'Home', ai: 'AI', here: 'Services',
    h1: 'Which AI to pick for the job in front of you',
    lede: 'One place to match an AI tool to the job in front of you. Work the filter and the shortlist comes down to what actually fits your project.',
    servicesH: 'Services', filters: 'Filters', reset: 'Clear all', close: 'Close',
    details: 'Details', review: 'Full review', onRequest: 'on request',
    priceChecked: 'Price checked', priceUnchecked: 'Price not checked',
    ofWhichChecked: 'price checked', filtersOn: 'filters',
    emptyA: 'Nothing matches that',
    emptyB: 'Clear a box or two — the narrow facets rule out the most.',
    empty: 'No services published yet.',
    collection: 'The full write-up',
    title: 'AI tools: what to pick for the job you have',
    desc: 'A catalogue of AI tools by job: video and image generation, transcription, voice-over, code. Plans are checked against the official pricing pages and every price carries the date it was checked.',
  },
} as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = T[locale === 'ru' ? 'ru' : 'en'];
  const url = `${BASE}/${locale}/ai/tools`;
  const description = truncateDesc(t.desc);
  return {
    title: pageTitle(t.title),
    description,
    alternates: {
      canonical: url,
      languages: {
        ru: `${BASE}/ru/ai/tools`,
        en: `${BASE}/en/ai/tools`,
        'x-default': `${BASE}/en/ai/tools`,
      },
    },
    openGraph: buildOg({ url, title: titleText(t.title), description, locale }),
    twitter: buildTwitter({ url, title: titleText(t.title), description, locale }),
  };
}

export default async function AiToolsPage({ params, searchParams }: Props) {
  const { locale: raw } = await params;
  const { job: jobParam } = await searchParams;
  setRequestLocale(raw);
  const locale = (raw === 'ru' ? 'ru' : 'en') as Locale;
  const t = T[locale];

  const [jobs, all] = await Promise.all([getAiJobs(), getAiServices()]);
  // Задача из адреса, иначе первая в полосе. Адрес ?job= нужен ссылкам из
  // подборок и меню: читатель приходит сразу в нужную работу.
  const active = jobs.find(j => j.slug === jobParam) ?? jobs[0];
  const [services, groups] = active
    ? await Promise.all([servicesForJob(active.slug), facetGroupsFor(active.slug)])
    : [[], []];

  const url = `${BASE}/${locale}/ai/tools`;
  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: t.home, item: `${BASE}/${locale}` },
          { '@type': 'ListItem', position: 2, name: t.ai, item: `${BASE}/${locale}/ai` },
          { '@type': 'ListItem', position: 3, name: t.here, item: url },
        ],
      },
      {
        '@type': 'CollectionPage',
        '@id': url,
        url,
        name: titleText(t.title),
        description: truncateDesc(t.desc),
        isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: BASE },
        publisher: { '@id': ORGANIZATION_ID },
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: all.length,
          itemListElement: all.slice(0, 50).map((s, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: s.name,
            url: `${BASE}/${locale}/ai/tools/${s.slug}`,
          })),
        },
      },
    ],
  };

  return (
    <div className="mx-auto max-w-[1320px] px-4 py-6 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />

      <nav aria-label="breadcrumb" className="mb-4 text-[13px] text-muted">
        <Link href={`/${locale}`} className="hover:text-foreground">{t.home}</Link>
        {' · '}
        <Link href={`/${locale}/ai`} className="hover:text-foreground">{t.ai}</Link>
        {' · '}
        <b className="font-semibold text-foreground">{t.here}</b>
      </nav>

      <header className="ai-hero relative isolate overflow-hidden rounded-[20px]">
        <div className="ai-hero-bg" aria-hidden="true" />
        <div className="ai-hero-arc" aria-hidden="true">
          <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
            <defs>
              <linearGradient id="aiArc" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#7c2d12" />
                <stop offset="30%" stopColor="#ea580c" />
                <stop offset="62%" stopColor="#fb923c" />
                <stop offset="86%" stopColor="#fde68a" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
              <filter id="aiB1" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="46" /></filter>
              <filter id="aiB2" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="16" /></filter>
              <filter id="aiB3" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="4" /></filter>
            </defs>
            <path id="aiSweep" d="M -120 150 C 420 250 980 560 1760 1010" fill="none" />
            <use href="#aiSweep" stroke="url(#aiArc)" strokeWidth="58" opacity=".42" filter="url(#aiB1)" />
            <use href="#aiSweep" stroke="url(#aiArc)" strokeWidth="20" opacity=".62" filter="url(#aiB2)" />
            <use href="#aiSweep" stroke="url(#aiArc)" strokeWidth="5" opacity=".92" filter="url(#aiB3)" />
            <use href="#aiSweep" stroke="#fffbeb" strokeWidth="1.5" opacity=".96" />
          </svg>
        </div>
        <div className="ai-hero-vig" aria-hidden="true" />
        <div className="relative z-[3] px-6 py-12 text-center sm:px-9 sm:py-16">
          <h1 className="mx-auto max-w-[18ch] text-[clamp(30px,6vw,52px)] font-black leading-[1.06] tracking-[-.035em] text-white">
            {t.h1}
          </h1>
          <p className="mx-auto mt-5 max-w-[62ch] text-[15px] text-white/85 sm:text-[17px]">{t.lede}</p>
        </div>
      </header>

      {jobs.length > 0 && (
        <>
          <h2 className="sr-only">{t.filters}</h2>
          <ul className="mt-5 flex list-none flex-wrap gap-2 overflow-x-auto p-0 max-sm:flex-nowrap">
            {jobs.map(j => (
              <li key={j.slug}>
                <Link
                  href={`/${locale}/ai/tools?job=${j.slug}`}
                  aria-current={active?.slug === j.slug ? 'page' : undefined}
                  className="ai-task inline-flex items-center gap-2 whitespace-nowrap rounded-full px-3.5 py-2 text-[13.5px] font-semibold"
                >
                  <JobIcon name={j.icon} />
                  {pick(j.name, locale)}
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}

      {/* Связь с подборкой. Хаб даёт фильтр и предлагает выбирать самому,
          подборка — готовый список с объяснением порядка. Без этой ссылки
          вторая страница существовала бы только для поиска, а читатель до неё
          не добирался. */}
      {active && (
        <p className="mt-3 text-[13px]">
          <Link
            href={`/${locale}/ai/best/${active.slug}`}
            className="font-extrabold text-accent hover:underline"
          >
            {t.collection}: {pick(active.name, locale).toLowerCase()} →
          </Link>
        </p>
      )}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_256px] xl:gap-8">
        <div className="min-w-0">
          {services.length > 0 ? (
            <AiCatalogue locale={locale} services={services} groups={groups} t={t as unknown as Record<string, string>} />
          ) : (
            <p className="mt-6 text-[14px] text-muted">{t.empty}</p>
          )}
        </div>
        <PopularSidebar locale={locale} className="flex-1" />
      </div>
    </div>
  );
}
