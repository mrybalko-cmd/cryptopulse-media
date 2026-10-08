// Час, как у страниц стран. Правка в админке сбрасывает тег и видна сразу.
export const revalidate = 3600;

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { client } from '@/lib/sanity';
import { authorName } from '@/lib/authorName';
import { authorColorVar } from '@/lib/authorColors';
import {
  getLicenceRegimes, parseFeeTable, parseHeadline, parseSteps, type LicenceRegime,
} from '@/lib/licences';
import { buildOg, buildTwitter, BASE, pageTitle, titleText, truncateDesc } from '@/lib/metadata';
import { ORGANIZATION_ID } from '@/lib/organizationSchema';
import {
  parseBody, parseFaq, parseFigures, parseSources, parseTimeline,
} from '@/lib/regulationPage';
import PopularSidebar from '@/components/ui/PopularSidebar';
import {
  Body, Faq, Figures, Related, ShortAnswer, Sources, Timeline,
  type RelatedItem,
} from '../../[country]/CountryArticle';
import { FeeTableView, RegimeMark, Steps, dmy } from '../LicenceParts';
import type { CSSProperties } from 'react';

interface Props { params: Promise<{ locale: string; regime: string }> }

const T = {
  ru: {
    home: 'Главная', map: 'Карта регуляции', hub: 'Лицензии',
    lead: 'Коротко.', checked: 'проверено', reviewed: 'Данные проверил',
    byline: 'Материал ведёт редакция Intokened.com',
    fees: 'Сколько стоит', steps: 'Как проходит заявка', timeline: 'Хронология',
    faq: 'Частые вопросы', sources: 'Источники', related: 'Читайте по теме',
    other: 'Другие режимы', country: 'Страница страны',
    updated: 'Обновлено',
    disclaimer: 'материал носит справочный характер и не является юридической консультацией',
    status: { active: 'Действует', transition: 'Переходный период', draft: 'Проект' },
  },
  en: {
    home: 'Home', map: 'Regulation map', hub: 'Licensing',
    lead: 'In short.', checked: 'checked', reviewed: 'Data checked by',
    byline: 'Maintained by the Intokened.com editorial team',
    fees: 'What it costs', steps: 'How an application runs', timeline: 'Timeline',
    faq: 'Questions', sources: 'Sources', related: 'Read next',
    other: 'Other regimes', country: 'Country page',
    updated: 'Updated',
    disclaimer: 'this is reference material, not legal advice',
    status: { active: 'Active', transition: 'Transition period', draft: 'Draft' },
  },
} as const;

const pick = (r: LicenceRegime, key: keyof LicenceRegime, isRu: boolean): string | undefined => {
  const field = r[key] as { ru?: string; en?: string } | undefined;
  return (isRu ? field?.ru : field?.en) || undefined;
};

async function find(slug: string): Promise<LicenceRegime | undefined> {
  return (await getLicenceRegimes()).find(r => r.slug === slug);
}

async function relatedItems(slugs: string[], locale: string, isRu: boolean): Promise<RelatedItem[]> {
  if (!slugs.length) return [];
  const rows: { title: string; slug: string; type: string }[] = await client.fetch(
    `*[(_type == "news" || _type == "article") && language == $lang && slug.current in $slugs]{
      title, "slug": slug.current, "type": _type
    }`,
    { slugs, lang: locale }
  );
  const bySlug = new Map(rows.map(r => [r.slug, r]));
  return slugs
    .map(s => bySlug.get(s))
    .filter((r): r is { title: string; slug: string; type: string } => Boolean(r))
    .map(r => ({
      title: r.title,
      href: `/${locale}/${r.type === 'article' ? 'articles' : 'news'}/${r.slug}`,
      kind: r.type === 'article' ? (isRu ? 'Статья' : 'Article') : (isRu ? 'Новость' : 'News'),
    }));
}

export async function generateStaticParams() {
  const regimes = await getLicenceRegimes();
  return regimes.flatMap(r => [
    { locale: 'ru', regime: r.slug },
    { locale: 'en', regime: r.slug },
  ]);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, regime: slug } = await params;
  const r = await find(slug);
  if (!r) return {};
  const isRu = locale === 'ru';
  const heading = pick(r, 'seoTitle', isRu) || (isRu ? r.name.ru : r.name.en) || '';
  const description = truncateDesc(pick(r, 'seoDescription', isRu) || pick(r, 'intro', isRu) || '');
  const url = `${BASE}/${locale}/regulation/licences/${slug}`;
  return {
    title: pageTitle(heading),
    description,
    alternates: {
      canonical: url,
      languages: {
        ru: `${BASE}/ru/regulation/licences/${slug}`,
        en: `${BASE}/en/regulation/licences/${slug}`,
        'x-default': `${BASE}/en/regulation/licences/${slug}`,
      },
    },
    openGraph: buildOg({ url, title: titleText(heading), description, locale, type: 'article' }),
    twitter: buildTwitter({ url, title: titleText(heading), description, locale }),
  };
}

export default async function RegimePage({ params }: Props) {
  const { locale, regime: slug } = await params;
  setRequestLocale(locale);
  const isRu = locale === 'ru';
  const t = T[isRu ? 'ru' : 'en'];

  const r = await find(slug);
  if (!r) notFound();

  const all = await getLicenceRegimes();
  const others = all.filter(x => x.slug !== r.slug);
  const c = authorColorVar(r.accent);
  const url = `${BASE}/${locale}/regulation/licences/${slug}`;

  const name = isRu ? r.name.ru : r.name.en;
  const heading = pick(r, 'seoTitle', isRu) || name || '';
  const intro = pick(r, 'intro', isRu) || '';
  const figures = parseFigures(pick(r, 'figures', isRu));
  const feeTable = parseFeeTable(pick(r, 'feeTable', isRu));
  const steps = parseSteps(pick(r, 'steps', isRu));
  const body = parseBody(pick(r, 'body', isRu));
  const timeline = parseTimeline(pick(r, 'timeline', isRu));
  const faq = parseFaq(pick(r, 'faq', isRu));
  const sources = parseSources(pick(r, 'sources', isRu));
  const related = await relatedItems(
    (pick(r, 'related', isRu) || '').split('\n').map(s => s.trim()).filter(Boolean),
    locale,
    isRu
  );
  const scope = (isRu ? r.scope?.ru : r.scope?.en) || '';
  const stats = parseHeadline(pick(r, 'headline', isRu));

  const reviewer = r.reviewedBy
    ? {
        name: authorName(r.reviewedBy, locale),
        slug: r.reviewedBy.slug,
        role: (isRu ? r.reviewedBy.roleRu : r.reviewedBy.roleEn) || '',
        org: r.reviewedBy.entityKind === 'organization',
      }
    : null;

  const graph: Record<string, unknown>[] = [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: t.home, item: `${BASE}/${locale}` },
        { '@type': 'ListItem', position: 2, name: t.map, item: `${BASE}/${locale}/regulation` },
        { '@type': 'ListItem', position: 3, name: t.hub, item: `${BASE}/${locale}/regulation/licences` },
        { '@type': 'ListItem', position: 4, name, item: url },
      ],
    },
    {
      '@type': 'Article',
      headline: titleText(heading),
      // В разметке описание не режется: длину схема не ограничивает, а
      // языковой модели обрубок достаётся как факт без второй половины.
      description: intro,
      inLanguage: isRu ? 'ru-RU' : 'en-US',
      author: { '@id': ORGANIZATION_ID },
      ...(reviewer
        ? {
            reviewedBy: {
              '@type': reviewer.org ? 'Organization' : 'Person',
              name: reviewer.name,
              url: `${BASE}/${locale}/authors/${reviewer.slug}`,
              ...(reviewer.role ? { jobTitle: reviewer.role } : {}),
            },
          }
        : {}),
      ...(r.publishedAt ? { datePublished: r.publishedAt } : {}),
      dateModified: r.checkedAt,
      mainEntityOfPage: url,
      publisher: { '@id': ORGANIZATION_ID },
    },
  ];
  if (faq.length) {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: faq.map(q => ({
        '@type': 'Question',
        name: q.question,
        acceptedAnswer: { '@type': 'Answer', text: q.answer },
      })),
    });
  }

  return (
    <div className="mx-auto max-w-[1320px] px-4 py-10 sm:px-6" style={{ '--c': c } as CSSProperties}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }) }}
      />

      <nav className="mb-3 text-[11.5px] text-muted">
        <Link href={`/${locale}`} className="hover:text-foreground">{t.home}</Link>
        <span className="mx-1.5 opacity-40">›</span>
        <Link href={`/${locale}/regulation`} className="hover:text-foreground">{t.map}</Link>
        <span className="mx-1.5 opacity-40">›</span>
        <Link href={`/${locale}/regulation/licences`} className="hover:text-foreground">{t.hub}</Link>
        <span className="mx-1.5 opacity-40">›</span>
        <span className="text-foreground">{name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_256px] lg:gap-8">
        <div className="cal-stage">
          <header className="cal-glass rounded-[18px] p-[18px]">
            <RegimeMark monogram={r.monogram} flag={r.jurisdictionFlag} accent={r.accent} size={44} />
            <h1 className="mb-2.5 mt-3 text-[25px] font-extrabold leading-[1.14] tracking-[-0.03em] sm:text-[29px]">
              {heading}
            </h1>
            <div className="flex flex-wrap gap-[7px]">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--glass-line)] bg-[var(--glass-hover)] px-3 py-[5px] text-[12px] font-semibold text-[var(--positive)]">
                <i className="h-1.5 w-1.5 rounded-full bg-[var(--positive)]" />
                {t.status[r.status]}
              </span>
              {scope && (
                <span className="inline-flex items-center rounded-full border border-[var(--glass-line)] bg-[var(--glass-hover)] px-3 py-[5px] text-[12px] font-semibold text-muted">
                  {scope}
                </span>
              )}
              <span className="inline-flex items-center rounded-full border border-[var(--glass-line)] bg-[var(--glass-hover)] px-3 py-[5px] text-[12px] font-semibold tabular-nums text-muted">
                {t.checked} {dmy(r.checkedAt)}
              </span>
              {/* Кто отвечает за материал. Имя со ссылкой на профиль весит
                  больше, чем «редакция», и его же видит поисковик в разметке. */}
              <span className="inline-flex items-center rounded-full border border-[var(--glass-line)] bg-[var(--glass-hover)] px-3 py-[5px] text-[12px] font-semibold text-muted">
                {reviewer ? (
                  <>
                    {t.reviewed}&nbsp;
                    <Link
                      href={`/${locale}/authors/${reviewer.slug}`}
                      className="font-semibold text-foreground underline decoration-dotted underline-offset-2 hover:text-accent"
                    >
                      {reviewer.name}
                    </Link>
                  </>
                ) : (
                  t.byline
                )}
              </span>
            </div>

            {stats.length > 0 && (
              <dl className="mt-4 grid grid-cols-3 gap-2.5">
                {stats.map(s => (
                  <div key={s.label} className="border-t border-[var(--glass-line)] pt-2">
                    <dt className="text-[9.5px] font-extrabold uppercase tracking-[0.09em] text-muted">{s.label}</dt>
                    <dd className="m-0 mt-1 text-[18px] font-extrabold tracking-[-0.03em] tabular-nums text-foreground">
                      {s.value}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </header>

          {intro && <ShortAnswer text={intro} lead={t.lead} />}
          <Figures figures={figures} />
          <Body blocks={body} />

          {feeTable && (
            <section className="cal-glass mt-5 rounded-[16px] p-4">
              <h2 className="mb-3 flex items-center gap-2 text-[14.5px] font-extrabold tracking-[-0.02em]">
                <i className="h-3.5 w-[3px] rounded-sm" style={{ background: c }} />
                {t.fees}
              </h2>
              <FeeTableView table={feeTable} accent={r.accent} />
            </section>
          )}

          {steps.length > 0 && (
            <section className="cal-glass mt-5 rounded-[16px] p-4">
              <h2 className="mb-3 flex items-center gap-2 text-[14.5px] font-extrabold tracking-[-0.02em]">
                <i className="h-3.5 w-[3px] rounded-sm" style={{ background: c }} />
                {t.steps}
              </h2>
              <Steps items={steps} accent={r.accent} />
            </section>
          )}

          {timeline.length > 0 && (
            <section className="mt-5">
              <h2 className="mb-3 text-[14.5px] font-extrabold tracking-[-0.02em]">{t.timeline}</h2>
              <Timeline events={timeline} />
            </section>
          )}

          {faq.length > 0 && (
            <section className="mt-5">
              <h2 className="mb-3 text-[14.5px] font-extrabold tracking-[-0.02em]">{t.faq}</h2>
              <Faq items={faq} />
            </section>
          )}

          {r.country && (
            <Link
              href={`/${locale}/regulation/${r.country.slug}`}
              className="mt-5 inline-flex items-center gap-2 rounded-xl border border-[var(--glass-line)]
                         bg-[var(--glass-clear)] px-3.5 py-2.5 text-[12.5px] font-bold hover:border-[var(--c)]"
            >
              <span className="text-[var(--c)]">→</span>
              {t.country}: {isRu ? r.country.nameRu : r.country.nameEn}
            </Link>
          )}

          {sources.length > 0 && (
            <section className="mt-5">
              <h2 className="mb-3 text-[14.5px] font-extrabold tracking-[-0.02em]">{t.sources}</h2>
              <Sources items={sources} checked={dmy(r.checkedAt)} />
            </section>
          )}

          {related.length > 0 && (
            <section className="mt-5">
              <h2 className="mb-3 text-[14.5px] font-extrabold tracking-[-0.02em]">{t.related}</h2>
              <Related items={related} />
            </section>
          )}

          <p className="mt-5 text-[11px] leading-[1.55] tabular-nums text-muted opacity-70">
            {t.updated} <b className="font-semibold">{dmy(r.checkedAt)}</b> · {t.disclaimer}
          </p>
        </div>

        <aside className="flex flex-col gap-3">
          <PopularSidebar locale={locale} />
          {others.length > 0 && (
            <div className="cal-glass rounded-[16px] p-3.5">
              <h2 className="mb-2.5 text-[13px] font-extrabold">{t.other}</h2>
              {others.map(o => (
                <Link
                  key={o.slug}
                  href={`/${locale}/regulation/licences/${o.slug}`}
                  style={{ '--c': authorColorVar(o.accent) } as CSSProperties}
                  className="flex items-center gap-2.5 border-t border-[var(--glass-line)] py-2 first:border-t-0
                             hover:text-[var(--c)]"
                >
                  <RegimeMark monogram={o.monogram} flag={o.jurisdictionFlag} accent={o.accent} size={26} />
                  <span className="min-w-0">
                    <b className="block text-[12px] font-extrabold">{isRu ? o.name.ru : o.name.en}</b>
                    <span className="block text-[10.5px] text-muted">
                      {(isRu ? o.scope?.ru : o.scope?.en) || o.authority}
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
