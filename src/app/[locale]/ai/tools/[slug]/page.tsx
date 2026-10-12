export const revalidate = 3600;

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { Check } from 'lucide-react';
import {
  facetLabels, getAiJobs, getAiServices, jobBySlug, money, paidFrom,
  pick, pickList, serviceBySlug, unitLabel, type AiService, type Locale,
} from '@/lib/ai';
import { buildOg, buildTwitter, BASE, pageTitle, titleText, truncateDesc } from '@/lib/metadata';
import { ORGANIZATION_ID } from '@/lib/organizationSchema';
import { SITE_NAME } from '@/lib/site';
import PopularSidebar from '@/components/ui/PopularSidebar';
import { ServiceMark } from '../AiParts';

interface Props { params: Promise<{ locale: string; slug: string }> }

const T = {
  ru: {
    home: 'Главная', ai: 'AI', tools: 'Сервисы',
    about: 'О компании', canDo: 'Что умеет', plans: 'Сколько стоит', worth: 'Стоит ли брать',
    stronger: 'Сильнее', weaker: 'Слабее', facts: 'Коротко',
    details: 'Детали', sources: 'Источники', checkedOn: 'Цена сверена',
    unchecked: 'Цену ещё не сверяли с официальным прайсом',
    plan: 'Тариф', price: 'Цена', includes: 'Что входит', oftener: 'чаще берут',
    free: 'Бесплатный тариф', noFree: 'Бесплатного нет', founded: 'Основана',
    rank: 'Место в рейтинге a16z', onRequest: 'по запросу',
    ask: 'Есть вопросы или замечания?',
    askBody: 'Напишите нам — разберёмся и поправим. Если это ваш сервис, пришлите правку, мы проверим и обновим дату.',
    write: 'Написать', sponsored: 'Платное размещение',
  },
  en: {
    home: 'Home', ai: 'AI', tools: 'Services',
    about: 'About the company', canDo: 'What it does', plans: 'What it costs', worth: 'Worth it?',
    stronger: 'Stronger', weaker: 'Weaker', facts: 'At a glance',
    details: 'Details', sources: 'Sources', checkedOn: 'Price checked',
    unchecked: 'The price has not been checked against the official page yet',
    plan: 'Plan', price: 'Price', includes: 'What you get', oftener: 'most picked',
    free: 'Free tier', noFree: 'No free tier', founded: 'Founded',
    rank: 'a16z ranking', onRequest: 'on request',
    ask: 'Questions or corrections?',
    askBody: 'Write to us and we will sort it out. If this is your service, send a correction and we will check it and update the date.',
    write: 'Write to us', sponsored: 'Paid placement',
  },
} as const;

export async function generateStaticParams() {
  const services = await getAiServices();
  return services.flatMap(s => [{ locale: 'ru', slug: s.slug }, { locale: 'en', slug: s.slug }]);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const s = await serviceBySlug(slug);
  if (!s) return {};
  const loc = (locale === 'ru' ? 'ru' : 'en') as Locale;
  const title = pick(s.seoTitle, loc) || `${s.name}: ${pick(s.tagline, loc)}`;
  const description = truncateDesc(pick(s.seoDescription, loc) || pick(s.highlight, loc));
  const url = `${BASE}/${locale}/ai/tools/${slug}`;
  return {
    title: pageTitle(title),
    description,
    alternates: {
      canonical: url,
      languages: {
        ru: `${BASE}/ru/ai/tools/${slug}`,
        en: `${BASE}/en/ai/tools/${slug}`,
        'x-default': `${BASE}/en/ai/tools/${slug}`,
      },
    },
    openGraph: buildOg({ url, title: titleText(title), description, locale }),
    twitter: buildTwitter({ url, title: titleText(title), description, locale }),
  };
}

const dmy = (iso?: string | null) => {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}.${m}.${y}`;
};

function Facts({ s, locale, t }: { s: AiService; locale: Locale; t: Record<string, string> }) {
  const plan = paidFrom(s);
  const free = s.plans.find(p => p.price === 0);
  const rows: Array<[string, string, boolean?]> = [
    [t.price, plan ? `${money(plan.price, plan.currency)} ${unitLabel(plan.unit, locale)}` : t.onRequest],
    [t.free, free ? pick(free.includes, locale) || 'Да' : t.noFree, !free],
  ];
  if (s.foundedYear) rows.push([t.founded, String(s.foundedYear)]);
  if (s.rank) rows.push([t.rank, `#${s.rank}`]);

  return (
    <aside className="ai-card self-start overflow-hidden rounded-[14px]">
      <h2 className="m-0 px-3.5 pb-2 pt-3 text-[11px] font-extrabold uppercase tracking-[.1em] text-muted">
        {t.facts}
      </h2>
      {rows.map(([k, v, warn]) => (
        <div key={k} className="flex items-baseline gap-2.5 border-t border-border px-3.5 py-2 text-[12.5px]">
          <span className="shrink-0 text-muted">{k}</span>
          <span className={`ml-auto text-right font-bold tabular-nums ${warn ? 'text-importance-medium' : ''}`}>{v}</span>
        </div>
      ))}
    </aside>
  );
}

export default async function AiServicePage({ params }: Props) {
  const { locale: raw, slug } = await params;
  setRequestLocale(raw);
  const locale = (raw === 'ru' ? 'ru' : 'en') as Locale;
  const t = T[locale] as unknown as Record<string, string>;

  const s = await serviceBySlug(slug);
  if (!s) notFound();

  const [job, labels, jobs] = await Promise.all([
    s.jobSlug ? jobBySlug(s.jobSlug) : Promise.resolve(null),
    facetLabels(),
    getAiJobs(),
  ]);

  const plan = paidFrom(s);
  const feats = pickList(s.features, locale);
  const pros = pickList(s.pros, locale);
  const cons = pickList(s.cons, locale);
  const about = pick(s.about, locale);
  const url = `${BASE}/${locale}/ai/tools/${slug}`;

  // Offer в разметке обязан совпадать с видимой ценой до копейки: расхождение
  // Google считает обманом и снимает сниппет целиком, а не одну строку.
  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: t.home, item: `${BASE}/${locale}` },
          { '@type': 'ListItem', position: 2, name: t.ai, item: `${BASE}/${locale}/ai` },
          { '@type': 'ListItem', position: 3, name: t.tools, item: `${BASE}/${locale}/ai/tools` },
          { '@type': 'ListItem', position: 4, name: s.name, item: url },
        ],
      },
      {
        '@type': 'SoftwareApplication',
        '@id': url,
        name: s.name,
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        description: truncateDesc(pick(s.seoDescription, locale) || pick(s.highlight, locale)),
        ...(s.website ? { url: s.website } : {}),
        ...(s.priceCheckedAt ? { dateModified: s.priceCheckedAt } : {}),
        publisher: { '@id': ORGANIZATION_ID },
        isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: BASE },
        ...(plan && typeof plan.price === 'number'
          ? {
              offers: {
                '@type': 'Offer',
                price: String(plan.price),
                priceCurrency: plan.currency ?? 'USD',
              },
            }
          : {}),
      },
    ],
  };

  return (
    <div className="mx-auto max-w-[1320px] px-4 py-6 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />

      <nav aria-label="breadcrumb" className="mb-4 text-[13px] text-muted">
        <Link href={`/${locale}`} className="hover:text-foreground">{t.home}</Link>{' · '}
        <Link href={`/${locale}/ai`} className="hover:text-foreground">{t.ai}</Link>{' · '}
        <Link href={`/${locale}/ai/tools`} className="hover:text-foreground">{t.tools}</Link>{' · '}
        <b className="font-semibold text-foreground">{s.name}</b>
      </nav>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_256px] xl:gap-8">
        <article className="min-w-0">
          <header className="ai-card overflow-hidden rounded-[18px] p-5">
            <div className="flex flex-wrap items-start gap-4">
              <ServiceMark s={s} size={56} />
              <div className="min-w-0 flex-1 basis-64">
                <h1 className="text-[clamp(24px,4vw,32px)] font-black tracking-[-.03em]">{s.name}</h1>
                <p className="mt-1 text-[14px] text-muted">{pick(s.tagline, locale)}</p>
                {job && (
                  <Link
                    href={`/${locale}/ai/tools?job=${job.slug}`}
                    className="mt-2.5 inline-block text-[12.5px] font-bold text-accent hover:underline"
                  >
                    {pick(job.name, locale)} →
                  </Link>
                )}
              </div>
              {s.pricingUrl && (
                <a
                  href={s.pricingUrl}
                  rel="sponsored nofollow noopener"
                  target="_blank"
                  className="ai-fab rounded-[10px] px-4 py-2.5 text-[13px] font-extrabold text-white"
                >
                  {t.details} ↗
                </a>
              )}
            </div>

            {pick(s.highlight, locale) && (
              <p className="m-0 mt-3.5 flex items-start gap-2.5 border-t border-border pt-3.5 text-[13.5px] font-semibold leading-[1.45]">
                <span className="ai-tick mt-px grid size-[19px] shrink-0 place-items-center rounded-full">
                  <Check size={12} strokeWidth={3.5} className="text-white" />
                </span>
                <span>{pick(s.highlight, locale)}</span>
              </p>
            )}

            <p className="mt-3 text-[12px] text-muted">
              {s.priceCheckedAt ? (
                <span className="font-bold text-positive">{t.checkedOn} {dmy(s.priceCheckedAt)}</span>
              ) : (
                <span className="font-semibold text-importance-medium">{t.unchecked}</span>
              )}
              {s.sponsored && <span className="ml-2 rounded border border-border px-1.5 py-0.5">{t.sponsored}</span>}
            </p>
          </header>

          <div className="mt-5 grid gap-5 md:grid-cols-[minmax(0,1fr)_224px]">
            <div>
              <h2 className="mb-2.5 text-[17px] font-extrabold tracking-tight">{t.about}</h2>
              {about ? (
                about.split('\n').filter(Boolean).map((para, i) => (
                  <p key={i} className="mb-2.5 text-[14px] leading-[1.65] last:mb-0">{para}</p>
                ))
              ) : (
                <p className="text-[14px] text-muted">—</p>
              )}
              {s.sources && s.sources.length > 0 && (
                <p className="mt-3 text-[12px] text-muted">
                  {t.sources}:{' '}
                  {s.sources.map((src, i) => (
                    <span key={src}>
                      {i > 0 && ' · '}
                      <a href={src} rel="nofollow noopener" target="_blank" className="hover:text-accent">
                        {new URL(src).hostname.replace(/^www\./, '')}
                      </a>
                    </span>
                  ))}
                </p>
              )}
            </div>
            <Facts s={s} locale={locale} t={t} />
          </div>

          {feats.length > 0 && (
            <section className="mt-7">
              <h2 className="mb-3 border-b border-border pb-2 text-[16px] font-extrabold tracking-tight">{t.canDo}</h2>
              <ul className="m-0 grid list-none gap-2 p-0 sm:grid-cols-2">
                {feats.map(f => (
                  <li key={f} className="flex items-start gap-2 text-[13.5px] leading-[1.45]">
                    <span className="ai-tick mt-px grid size-[18px] shrink-0 place-items-center rounded-full">
                      <Check size={11} strokeWidth={3.5} className="text-white" />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {s.plans.length > 0 && (
            <section className="mt-7">
              <h2 className="mb-3 border-b border-border pb-2 text-[16px] font-extrabold tracking-tight">{t.plans}</h2>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[420px] border-collapse text-[13px]">
                  <thead>
                    <tr>
                      {[t.plan, t.price, t.includes].map(h => (
                        <th key={h} className="border-b border-border px-2.5 pb-2 text-left text-[11px] font-extrabold uppercase tracking-[.07em] text-muted">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {s.plans.map(p => (
                      <tr key={p.name} className={p.recommended ? 'bg-violet/10' : undefined}>
                        <td className="border-b border-border px-2.5 py-2.5 align-top font-semibold">
                          {p.name}
                          {p.recommended && (
                            <span className="ml-2 text-[10px] font-extrabold uppercase tracking-[.07em] text-violet">{t.oftener}</span>
                          )}
                        </td>
                        <td className="whitespace-nowrap border-b border-border px-2.5 py-2.5 align-top font-extrabold tabular-nums">
                          {typeof p.price === 'number' ? money(p.price, p.currency) : t.onRequest}
                          <span className="ml-1 font-normal text-muted">{typeof p.price === 'number' ? unitLabel(p.unit, locale) : ''}</span>
                        </td>
                        <td className="border-b border-border px-2.5 py-2.5 align-top text-muted">{pick(p.includes, locale)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {(pros.length > 0 || cons.length > 0) && (
            <section className="mt-7">
              <h2 className="mb-3 border-b border-border pb-2 text-[16px] font-extrabold tracking-tight">{t.worth}</h2>
              {/* Пустая половина не рисуется: рамка с заголовком и без единого
                  пункта читается как недогрузившийся блок, а не как «минусов
                  нет». Оставшаяся половина занимает всю ширину. */}
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { title: t.stronger, items: pros, tone: 'text-accent' },
                  { title: t.weaker, items: cons, tone: 'text-negative' },
                ].filter(({ items }) => items.length > 0).map(({ title, items, tone }) => (
                  <div key={title} className="rounded-xl border border-border p-3.5 sm:[&:only-child]:col-span-2">
                    <h3 className={`mb-2 text-[11px] font-extrabold uppercase tracking-[.05em] ${tone}`}>{title}</h3>
                    <ul className="m-0 list-disc pl-4 text-[13px] text-muted">
                      {items.map(i => <li key={i} className="mb-1.5 leading-[1.45]">{i}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          {s.facets.length > 0 && (
            <ul className="mt-6 flex list-none flex-wrap gap-1.5 p-0">
              {s.facets.map(k => {
                const label = pick(labels.get(k), locale);
                return label ? (
                  <li key={k} className="rounded-md border border-border bg-card px-2 py-0.5 text-[12px] font-semibold text-muted">
                    {label}
                  </li>
                ) : null;
              })}
            </ul>
          )}

          <aside className="ai-card mt-7 flex flex-wrap items-center gap-3 rounded-[14px] p-4 text-[13px]">
            <p className="m-0 min-w-0 flex-1 basis-72">
              <b className="font-extrabold">{t.ask}</b> {t.askBody}
            </p>
            <Link
              href={`/${locale}/about`}
              className="rounded-[10px] border border-border px-4 py-2 text-[13px] font-bold hover:border-accent hover:text-accent"
            >
              {t.write}
            </Link>
          </aside>

          {jobs.length > 0 && (
            <nav aria-label={t.tools} className="mt-7 flex flex-wrap gap-2">
              {jobs.slice(0, 8).map(j => (
                <Link
                  key={j.slug}
                  href={`/${locale}/ai/tools?job=${j.slug}`}
                  className="ai-task rounded-full px-3 py-1.5 text-[12.5px] font-semibold"
                >
                  {pick(j.name, locale)}
                </Link>
              ))}
            </nav>
          )}
        </article>

        <PopularSidebar locale={locale} className="flex-1" />
      </div>
    </div>
  );
}
