// Час, как у хаба: подборка меняется вместе с карточками, а правка в админке
// сбрасывает тег `ai` и видна сразу.
export const revalidate = 3600;

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { Check } from 'lucide-react';
import {
  getAiJobs, jobBySlug, servicesForJob, facetGroupsFor, allFacets,
  paidFrom, money, unitLabel, pick, pickList, lastPriceCheck, type Locale,
} from '@/lib/ai';
import { buildOg, buildTwitter, BASE, pageTitle, titleText, truncateDesc } from '@/lib/metadata';
import { ORGANIZATION_ID } from '@/lib/organizationSchema';
import { SITE_NAME } from '@/lib/site';
import PopularSidebar from '@/components/ui/PopularSidebar';
import { ServiceMark } from '../../tools/AiParts';
import JobIcon from '../../tools/JobIcon';

/**
 * Подборка под одну задачу: «чем генерировать видео», «чем расшифровать
 * созвон».
 *
 * Отличие от хаба не в данных, а в обещании. Хаб даёт фильтр и предлагает
 * выбирать самому; подборка — готовый список, в котором уже назван порядок
 * сортировки и то, чем сервисы друг от друга отличаются. Поэтому здесь нет
 * фильтра: страница отвечает на вопрос, а не помогает его задать.
 *
 * Рейтингов «9,2 из 10» тут нет и не будет: своих замеров у нас нет, а
 * выдуманная оценка подрывает доверие и ко всему остальному на сайте. Вместо
 * оценки — открытым текстом сказано, по какому признаку список отсортирован.
 */

interface Props {
  params: Promise<{ locale: string; task: string }>;
}

const T = {
  ru: {
    home: 'Главная', ai: 'AI', hub: 'Сервисы',
    sorted: 'Как отсортировано', checked: 'Цены сверены', notChecked: 'цена не сверена',
    details: 'Детали', review: 'Разбор', onRequest: 'по запросу',
    all: 'Все сервисы и фильтр', otherJobs: 'Другие задачи',
    empty: 'Под эту задачу карточек пока нет.',
    descTail: 'Тарифы сверены с официальными прайсами, у каждой цены стоит дата проверки.',
  },
  en: {
    home: 'Home', ai: 'AI', hub: 'Services',
    sorted: 'How this is ordered', checked: 'Prices checked', notChecked: 'price not checked',
    details: 'Details', review: 'Full review', onRequest: 'on request',
    all: 'All services and the filter', otherJobs: 'Other jobs',
    empty: 'No cards for this job yet.',
    descTail: 'Plans are checked against the official pricing pages and every price carries the date it was checked.',
  },
} as const;

export async function generateStaticParams() {
  const jobs = await getAiJobs();
  return jobs.flatMap(j => [
    { locale: 'ru', task: j.slug },
    { locale: 'en', task: j.slug },
  ]);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw, task } = await params;
  const locale = (raw === 'ru' ? 'ru' : 'en') as Locale;
  const job = await jobBySlug(task);
  if (!job) return {};
  const t = T[locale];

  const name = pick(job.name, locale);
  const title = locale === 'ru' ? `${name}: чем пользоваться и сколько стоит` : `${name}: what to use and what it costs`;
  const intro = pick(job.intro, locale);
  const description = truncateDesc(intro || `${name}. ${t.descTail}`);
  const url = `${BASE}/${locale}/ai/best/${job.slug}`;

  return {
    title: pageTitle(title),
    description,
    alternates: {
      canonical: url,
      languages: {
        ru: `${BASE}/ru/ai/best/${job.slug}`,
        en: `${BASE}/en/ai/best/${job.slug}`,
        'x-default': `${BASE}/en/ai/best/${job.slug}`,
      },
    },
    openGraph: buildOg({ url, title: titleText(title), description, locale }),
    twitter: buildTwitter({ url, title: titleText(title), description, locale }),
  };
}

export default async function AiBestPage({ params }: Props) {
  const { locale: raw, task } = await params;
  setRequestLocale(raw);
  const locale = (raw === 'ru' ? 'ru' : 'en') as Locale;
  const t = T[locale];

  const job = await jobBySlug(task);
  if (!job) notFound();

  const [services, groups, jobs] = await Promise.all([
    servicesForJob(job.slug),
    facetGroupsFor(job.slug),
    getAiJobs(),
  ]);

  // Подписи признаков берутся из тех же групп, что рисуют фильтр в хабе:
  // одна формулировка на весь раздел.
  const labels = new Map<string, string>();
  for (const g of groups) for (const f of g.items) labels.set(f.key, pick(f.label, locale));

  const name = pick(job.name, locale);
  const title = locale === 'ru' ? `${name}: чем пользоваться и сколько стоит` : `${name}: what to use and what it costs`;
  const url = `${BASE}/${locale}/ai/best/${job.slug}`;
  const checkedAt = lastPriceCheck(services);
  const checkedCount = services.filter(s => s.priceCheckedAt).length;

  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: t.home, item: `${BASE}/${locale}` },
          { '@type': 'ListItem', position: 2, name: t.ai, item: `${BASE}/${locale}/ai` },
          { '@type': 'ListItem', position: 3, name: t.hub, item: `${BASE}/${locale}/ai/tools` },
          { '@type': 'ListItem', position: 4, name, item: url },
        ],
      },
      {
        '@type': 'CollectionPage',
        '@id': url,
        url,
        name: titleText(title),
        description: truncateDesc(pick(job.intro, locale) || name),
        isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: BASE },
        publisher: { '@id': ORGANIZATION_ID },
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: services.length,
          itemListElement: services.map((s, i) => ({
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
        <Link href={`/${locale}/ai/tools`} className="hover:text-foreground">{t.hub}</Link>
        {' · '}
        <b className="font-semibold text-foreground">{name}</b>
      </nav>

      <header className="max-w-[72ch]">
        <h1 className="text-[clamp(26px,4.4vw,40px)] font-black leading-[1.08] tracking-[-.03em]">
          {title}
        </h1>
        {pick(job.intro, locale) && (
          <p className="mt-4 text-[15px] leading-relaxed text-muted sm:text-[16px]">
            {pick(job.intro, locale)}
          </p>
        )}
        <dl className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-[13px]">
          {pick(job.sortedBy, locale) && (
            <div className="flex gap-2">
              <dt className="text-muted">{t.sorted}:</dt>
              <dd className="m-0 font-semibold">{pick(job.sortedBy, locale)}</dd>
            </div>
          )}
          {checkedAt && (
            <div className="flex gap-2">
              <dt className="text-muted">{t.checked}:</dt>
              <dd className="m-0 font-semibold tabular-nums">
                {checkedCount} / {services.length} · {checkedAt.split('-').reverse().join('.')}
              </dd>
            </div>
          )}
        </dl>
      </header>

      <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_256px] xl:gap-8">
        <div className="min-w-0">
          <h2 className="sr-only">{name}</h2>
          {services.length === 0 ? (
            <p className="text-[14px] text-muted">{t.empty}</p>
          ) : (
            <ol className="m-0 grid list-none gap-3.5 p-0">
              {services.map((s, i) => {
                const plan = paidFrom(s);
                const feats = pickList(s.features, locale).slice(0, 3);
                const marks = allFacets(s).map(k => labels.get(k)).filter(Boolean).slice(0, 5);
                return (
                  <li key={s.slug}>
                    <article className="ai-card relative flex flex-col gap-3 overflow-hidden rounded-[14px] p-4 sm:flex-row sm:items-start sm:gap-4">
                      <span
                        aria-hidden="true"
                        className="absolute left-0 top-0 grid h-7 w-7 place-items-center rounded-br-[10px] bg-foreground/5 text-[12px] font-black tabular-nums text-muted"
                      >
                        {i + 1}
                      </span>
                      <ServiceMark s={s} size={52} />
                      <div className="min-w-0 flex-1">
                        <h3 className="text-[17px] font-extrabold tracking-tight">
                          <Link href={`/${locale}/ai/tools/${s.slug}`} className="hover:text-accent">
                            {s.name}
                          </Link>
                        </h3>
                        <p className="mt-0.5 text-[13.5px] leading-[1.4] text-muted">{pick(s.tagline, locale)}</p>
                        <p className="m-0 mt-2.5 flex items-start gap-2.5 text-[13.5px] font-semibold leading-[1.45]">
                          <span className="ai-tick mt-px grid size-[18px] shrink-0 place-items-center rounded-full">
                            <Check size={11} strokeWidth={3.5} className="text-white" />
                          </span>
                          {pick(s.highlight, locale)}
                        </p>
                        {feats.length > 0 && (
                          <ul className="m-0 mt-2.5 flex list-none flex-wrap gap-1.5 p-0">
                            {feats.map(f => (
                              <li key={f} className="rounded-md border border-border bg-card px-2 py-0.5 text-[12px] font-semibold text-muted">
                                {f}
                              </li>
                            ))}
                          </ul>
                        )}
                        {marks.length > 0 && (
                          <p className="mt-2 text-[12px] text-muted">{marks.join(' · ')}</p>
                        )}
                      </div>
                      <div className="shrink-0 text-left sm:text-right">
                        <b className="block text-[20px] font-black tabular-nums tracking-tight">
                          {plan ? money(plan.price, plan.currency) : '—'}
                        </b>
                        <span className="text-[12px] text-muted">
                          {plan ? unitLabel(plan.unit, locale) : t.onRequest}
                        </span>
                        {!s.priceCheckedAt && (
                          <span className="mt-0.5 block text-[11.5px] font-semibold text-importance-medium">
                            {t.notChecked}
                          </span>
                        )}
                        <div className="mt-2 flex gap-3 text-[12.5px] font-extrabold sm:flex-col sm:gap-1">
                          <Link href={`/${locale}/ai/tools/${s.slug}`} className="text-accent hover:underline">
                            {t.review} →
                          </Link>
                          {s.pricingUrl && (
                            <a href={s.pricingUrl} rel="sponsored nofollow noopener" target="_blank"
                              className="text-muted hover:text-accent hover:underline">
                              {t.details} ↗
                            </a>
                          )}
                        </div>
                      </div>
                    </article>
                  </li>
                );
              })}
            </ol>
          )}

          <nav aria-labelledby="other-jobs" className="mt-10">
            <h2 id="other-jobs" className="mb-3 text-[15px] font-extrabold tracking-tight">{t.otherJobs}</h2>
            <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
              {jobs.filter(j => j.slug !== job.slug).map(j => (
                <li key={j.slug}>
                  <Link href={`/${locale}/ai/best/${j.slug}`}
                    className="ai-task inline-flex items-center gap-2 whitespace-nowrap rounded-full px-3.5 py-2 text-[13.5px] font-semibold">
                    <JobIcon name={j.icon} />
                    {pick(j.name, locale)}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[13px]">
              <Link href={`/${locale}/ai/tools`} className="font-extrabold text-accent hover:underline">
                {t.all} →
              </Link>
            </p>
          </nav>
        </div>

        <PopularSidebar locale={locale} className="flex-1" />
      </div>
    </div>
  );
}
