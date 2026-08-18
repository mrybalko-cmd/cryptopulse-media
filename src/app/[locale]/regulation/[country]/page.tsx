export const revalidate = 300;

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { client } from '@/lib/sanity';
import { SITE_NAME, SITE_URL } from '@/lib/site';
import { truncateDesc, truncateTitle } from '@/lib/metadata';
import { STATUS_META } from '@/lib/regulationData';
import { getRegulationCountries, REGION_LABELS, type RegCountry } from '@/lib/regulation';
import {
  parseBody, parseFaq, parseFigures, parseList, parseSources, parseTimeline,
} from '@/lib/regulationPage';
import PopularSidebar from '@/components/ui/PopularSidebar';
import RegionMap from './RegionMap';
import {
  AllowedRestricted, Body, CountrySwitcher, CuriousFact, Faq, Figures,
  Related, ShortAnswer, Sources, Timeline, type Neighbour, type RelatedItem,
} from './CountryArticle';

const BASE = SITE_URL;

type Props = { params: Promise<{ locale: string; country: string }> };

function flag(iso2: string) {
  return String.fromCodePoint(...[...iso2].map(ch => 0x1f1e6 + ch.charCodeAt(0) - 65));
}

const T = {
  ru: {
    home: 'Главная', map: 'Карта регуляции', mapAll: 'вся карта →',
    lead: 'Коротко.', checked: 'проверено', fact: 'Любопытный факт',
    allowed: 'Разрешено', restricted: 'Ограничено',
    faq: 'Частые вопросы', sources: 'Источники', related: 'Читайте по теме',
    others: 'Другие страны', allCountries: 'Все страны\nна карте',
    prev: 'Предыдущая', next: 'Следующая',
    updated: 'Обновлено', disclaimer: 'материал носит справочный характер и не является инвестиционной или налоговой консультацией',
    title: (n: string) => `Криптовалюта в ${n}: регулирование, налоги и лицензии`,
  },
  en: {
    home: 'Home', map: 'Regulation map', mapAll: 'full map →',
    lead: 'In short.', checked: 'checked', fact: 'Worth knowing',
    allowed: 'Allowed', restricted: 'Restricted',
    faq: 'Common questions', sources: 'Sources', related: 'Related reading',
    others: 'Other countries', allCountries: 'All countries\non the map',
    prev: 'Previous', next: 'Next',
    updated: 'Updated', disclaimer: 'this is reference material, not investment or tax advice',
    title: (n: string) => `Cryptocurrency in ${n}: regulation, taxes and licensing`,
  },
} as const;

/** Only countries the editor has switched on get a URL at all. */
async function published(): Promise<RegCountry[]> {
  const all = await getRegulationCountries();
  return all.filter(c => c.hasPage);
}

function pick(c: RegCountry, field: 'intro' | 'figures' | 'body' | 'allowed' | 'restricted' | 'timeline' | 'faq' | 'sources' | 'related' | 'seoTitle' | 'seoDescription', isRu: boolean) {
  const v = c.page?.[field];
  return (isRu ? v?.ru : v?.en) || '';
}

function dmy(iso: string) {
  return iso ? iso.split('-').reverse().join('.') : '';
}

export async function generateStaticParams() {
  const countries = await published();
  return countries.flatMap(c => [
    { locale: 'ru', country: c.slug },
    { locale: 'en', country: c.slug },
  ]);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, country } = await params;
  setRequestLocale(locale);
  const isRu = locale === 'ru';
  const c = (await published()).find(x => x.slug === country);
  if (!c) return {};

  const t = isRu ? T.ru : T.en;
  const name = isRu ? c.name.ru : c.name.en;
  const title = pick(c, 'seoTitle', isRu) || t.title(name);
  const description = truncateDesc(pick(c, 'seoDescription', isRu) || pick(c, 'intro', isRu) || (isRu ? c.summary.ru : c.summary.en));

  return {
    title: truncateTitle(title),
    description,
    alternates: {
      canonical: `${BASE}/${locale}/regulation/${c.slug}`,
      languages: {
        ru: `${BASE}/ru/regulation/${c.slug}`,
        en: `${BASE}/en/regulation/${c.slug}`,
        'x-default': `${BASE}/en/regulation/${c.slug}`,
      },
    },
    openGraph: {
      type: 'article',
      title,
      description,
      url: `${BASE}/${locale}/regulation/${c.slug}`,
      siteName: SITE_NAME,
      locale: isRu ? 'ru_RU' : 'en_US',
      images: [{ url: `${BASE}/${locale}/opengraph-image` }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [`${BASE}/${locale}/opengraph-image`] },
  };
}

/**
 * Titles for the "related reading" slugs.
 *
 * Slugs are per-language — the same story lives under different addresses in
 * ru and en — so the lookup is scoped by language rather than trusting a slug
 * to resolve in both.
 */
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

export default async function CountryRegulationPage({ params }: Props) {
  const { locale, country } = await params;
  setRequestLocale(locale);
  const isRu = locale === 'ru';
  const t = isRu ? T.ru : T.en;

  const all = await published();
  const c = all.find(x => x.slug === country);
  if (!c) notFound();

  const name = isRu ? c.name.ru : c.name.en;
  const heading = pick(c, 'seoTitle', isRu) || t.title(name);
  const meta = STATUS_META[c.status];
  const statusLabel = isRu ? meta.labelRu : meta.labelEn;

  const intro = pick(c, 'intro', isRu) || (isRu ? c.summary.ru : c.summary.en);
  const figures = parseFigures(pick(c, 'figures', isRu));
  const body = parseBody(pick(c, 'body', isRu));
  const allowed = parseList(pick(c, 'allowed', isRu));
  const restricted = parseList(pick(c, 'restricted', isRu));
  const timeline = parseTimeline(pick(c, 'timeline', isRu));
  const faq = parseFaq(pick(c, 'faq', isRu));
  const sources = parseSources(pick(c, 'sources', isRu));
  const related = await relatedItems(parseList(pick(c, 'related', isRu)), locale, isRu);
  const factNote = c.factNote && (isRu ? c.factNote.ru : c.factNote.en);

  // Alphabetical within the published set, wrapping around, so the pair of
  // arrows always leads somewhere as long as more than one page exists.
  const order = [...all].sort((a, b) => (isRu ? a.name.ru.localeCompare(b.name.ru) : a.name.en.localeCompare(b.name.en)));
  const at = order.findIndex(x => x.slug === c.slug);
  const asNeighbour = (x: RegCountry): Neighbour => ({
    name: isRu ? x.name.ru : x.name.en,
    href: `/${locale}/regulation/${x.slug}`,
    flag: flag(x.iso2),
    ...(x.taxNote ? { stat: (isRu ? x.taxNote.ru : x.taxNote.en).split('.')[0] } : {}),
  });
  const prev = order.length > 1 ? asNeighbour(order[(at - 1 + order.length) % order.length]) : undefined;
  const next = order.length > 1 ? asNeighbour(order[(at + 1) % order.length]) : undefined;

  const url = `${BASE}/${locale}/regulation/${c.slug}`;
  const graph: object[] = [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: t.home, item: `${BASE}/${locale}` },
        { '@type': 'ListItem', position: 2, name: t.map, item: `${BASE}/${locale}/regulation` },
        { '@type': 'ListItem', position: 3, name, item: url },
      ],
    },
    {
      '@type': 'Article',
      headline: truncateTitle(heading),
      description: truncateDesc(intro),
      inLanguage: isRu ? 'ru-RU' : 'en-US',
      dateModified: c.checkedAt,
      mainEntityOfPage: url,
      publisher: { '@type': 'Organization', name: SITE_NAME, url: BASE },
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }) }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_256px] gap-6 lg:gap-8">
        <div>
          <nav aria-label="breadcrumb" className="text-[12px] text-muted mb-4 leading-[1.5]">
            <Link href={`/${locale}`} className="text-muted no-underline hover:text-accent">{t.home}</Link>
            <span aria-hidden className="opacity-40 mx-[7px]">›</span>
            <Link href={`/${locale}/regulation`} className="text-muted no-underline hover:text-accent">{t.map}</Link>
            <span aria-hidden className="opacity-40 mx-[7px]">›</span>
            <span>{name}</span>
          </nav>

          {/* ── header: the country, its status, and where it sits ── */}
          <div className="relative isolate overflow-hidden rounded-[20px] border border-[var(--glass-line)] bg-[image:var(--glass-fill)] shadow-[inset_0_1px_0_var(--glass-hi),var(--glass-shadow)] p-5 grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_254px] gap-5 items-stretch">
            <span
              aria-hidden
              className="pointer-events-none absolute -z-10 -left-[4%] -top-[46px] w-[420px] h-[190px] rounded-full blur-[54px]"
              style={{ background: 'radial-gradient(50% 50% at 50% 50%, var(--halo-violet), transparent 70%)' }}
            />
            <span
              aria-hidden
              className="pointer-events-none absolute -z-10 -right-[3%] -top-[34px] w-[340px] h-[170px] rounded-full blur-[54px]"
              style={{ background: 'radial-gradient(50% 50% at 50% 50%, var(--halo-cyan), transparent 70%)' }}
            />
            <span aria-hidden className="absolute left-4 right-4 top-0 h-px bg-gradient-to-r from-transparent via-[var(--glass-edge-lit)] to-transparent" />

            <div className="flex flex-col">
              <span aria-hidden className="text-[38px] leading-none mb-3">{flag(c.iso2)}</span>
              <h1 className="m-0 mb-4 text-[23px] sm:text-[28px] lg:text-[31px] font-bold leading-[1.12] tracking-[-0.035em] text-balance">
                {heading}
              </h1>
              <div className="flex gap-[7px] flex-wrap items-center mt-auto">
                <span
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-[5px] text-[12px] font-bold leading-[1.4] border"
                  style={{ color: meta.color, borderColor: `${meta.color}55`, background: `${meta.color}1f` }}
                >
                  <span aria-hidden className="w-1.5 h-1.5 rounded-full" style={{ background: meta.color, boxShadow: `0 0 8px ${meta.color}` }} />
                  {statusLabel}
                </span>
                {c.regulatorName && (
                  <span className="inline-flex items-center rounded-full px-3 py-[5px] text-[12px] font-semibold leading-[1.4] border border-[var(--glass-line)] bg-[var(--glass-hover)] text-muted shadow-[inset_0_1px_0_var(--glass-hi)]">
                    {c.regulatorName}
                  </span>
                )}
                <span className="inline-flex items-center rounded-full px-3 py-[5px] text-[12px] font-semibold leading-[1.4] border border-[var(--glass-line)] bg-[var(--glass-hover)] text-muted shadow-[inset_0_1px_0_var(--glass-hi)]">
                  {isRu ? REGION_LABELS[c.region].ru : REGION_LABELS[c.region].en}
                </span>
                <span className="inline-flex items-center rounded-full px-3 py-[5px] text-[12px] font-semibold leading-[1.4] border border-[var(--glass-line)] bg-[var(--glass-hover)] text-muted shadow-[inset_0_1px_0_var(--glass-hi)] tabular-nums">
                  {t.checked} {dmy(c.checkedAt)}
                </span>
              </div>
            </div>

            <RegionMap
              isoNum={c.isoNum}
              label={isRu ? REGION_LABELS[c.region].ru : REGION_LABELS[c.region].en}
              mapHref={`/${locale}/regulation`}
              allLabel={t.mapAll}
            />
          </div>

          <ShortAnswer text={intro} lead={t.lead} />
          <Figures figures={figures} />
          <Body blocks={body} />
          <AllowedRestricted allowed={allowed} restricted={restricted} allowedLabel={t.allowed} restrictedLabel={t.restricted} />

          {timeline.length > 0 && (
            <>
              <h2 className="text-[21px] font-bold tracking-[-0.03em] leading-[1.2] mt-8 mb-3">
                {isRu ? 'Как складывались правила' : 'How the rules took shape'}
              </h2>
              <Timeline events={timeline} />
            </>
          )}

          {factNote && <CuriousFact text={factNote} label={t.fact} />}

          {faq.length > 0 && (
            <>
              <h2 className="text-[21px] font-bold tracking-[-0.03em] leading-[1.2] mt-8 mb-3">{t.faq}</h2>
              <Faq items={faq} />
            </>
          )}

          {sources.length > 0 && (
            <>
              <h2 className="text-[21px] font-bold tracking-[-0.03em] leading-[1.2] mt-8 mb-3">{t.sources}</h2>
              <Sources items={sources} checked={dmy(c.checkedAt)} />
            </>
          )}

          {related.length > 0 && (
            <>
              <h2 className="text-[21px] font-bold tracking-[-0.03em] leading-[1.2] mt-8 mb-3">{t.related}</h2>
              <Related items={related} />
            </>
          )}

          <h2 className="text-[21px] font-bold tracking-[-0.03em] leading-[1.2] mt-8 mb-3">{t.others}</h2>
          <CountrySwitcher
            {...(prev ? { prev } : {})}
            {...(next ? { next } : {})}
            mapHref={`/${locale}/regulation`}
            mapLabel={t.allCountries}
            total={(await getRegulationCountries()).length}
            prevLabel={t.prev}
            nextLabel={t.next}
          />

          <p className="mt-5 text-[11px] leading-[1.55] text-muted opacity-70 tabular-nums">
            {t.updated} <b className="font-semibold">{dmy(c.checkedAt)}</b> · {t.disclaimer}
          </p>
        </div>

        <PopularSidebar locale={locale} />
      </div>
    </div>
  );
}
