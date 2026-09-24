// Час вместо пяти минут — причина в src/app/[locale]/news/[slug]/page.tsx.
// Правки доезжают мимо окна: админка сбрасывает теги этого раздела.
export const revalidate = 3600;

import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { buildOg, buildTwitter, BASE } from '@/lib/metadata';
import { fetchAuthorCards, fetchAuthorRubrics, fetchAuthorsPageSettings } from '@/lib/sanity';
import { Users } from 'lucide-react';
import { SITE_NAME } from '@/lib/site';
import { authorName } from '@/lib/authorName';
import AuthorsBoard from './AuthorsBoard';

type Props = { params: Promise<{ locale: string }> };

/** Ни одной строки текста этой страницы нет в коде: всё правится в админке. */
function texts(s: Awaited<ReturnType<typeof fetchAuthorsPageSettings>>, isRu: boolean) {
  return {
    heading: (isRu ? s.headingRu : s.headingEn) || (isRu ? 'Авторы и партнёры' : 'Authors and partners'),
    lede: (isRu ? s.ledeRu : s.ledeEn)
      || (isRu ? 'Кто пишет для Intokened и что они сделали.' : 'Who writes for Intokened and what they made.'),
    seoTitle: (isRu ? s.seoTitleRu : s.seoTitleEn) || (isRu ? 'Авторы и партнёры' : 'Authors and partners'),
    seoDescription: (isRu ? s.seoDescriptionRu : s.seoDescriptionEn)
      || (isRu
        ? `Редакция и партнёры ${SITE_NAME}: кто пишет материалы и что уже опубликовано.`
        : `The editorial team and partners of ${SITE_NAME}: who writes and what they published.`),
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = texts(await fetchAuthorsPageSettings(), locale === 'ru');
  return {
    title: t.seoTitle,
    description: t.seoDescription,
    openGraph: buildOg({ url: `${BASE}/${locale}/authors`, title: t.seoTitle, description: t.seoDescription, locale }),
    twitter: buildTwitter({ url: `${BASE}/${locale}/authors`, title: t.seoTitle, description: t.seoDescription, locale }),
    alternates: {
      canonical: `${BASE}/${locale}/authors`,
      languages: { ru: `${BASE}/ru/authors`, en: `${BASE}/en/authors`, 'x-default': `${BASE}/en/authors` },
    },
  };
}

export default async function AuthorsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isRu = locale === 'ru';

  const [authors, allRubrics, settings] = await Promise.all([
    fetchAuthorCards(),
    fetchAuthorRubrics(),
    fetchAuthorsPageSettings(),
  ]);
  const t = texts(settings, isRu);

  const sorted = settings.sort === 'alphabet'
    ? [...authors].sort((a, b) => authorName(a, locale).localeCompare(authorName(b, locale)))
    : settings.sort === 'materials'
      ? [...authors].sort((a, b) => b.materials - a.materials)
      : authors;

  // «Авто» решается здесь: рубрика видна, пока в ней есть хоть одна карточка.
  // Опустела — пропала сама, появился участник — вернулась сама, без правок.
  const used = new Set(authors.flatMap(a => a.rubrics || []));
  const rubrics = allRubrics.filter(r => r.visibility === 'always' || used.has(r.key));

  // Разметка для поисковика: список участников с типом каждого. Для человека
  // Person, для компании Organization — иначе Google приписывает организации
  // свойства человека и элемент из выдачи выпадает.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: t.seoTitle,
    description: t.seoDescription,
    url: `${BASE}/${locale}/authors`,
    isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: BASE },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: sorted.length,
      itemListElement: sorted.map((a, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': a.entityKind === 'organization' ? 'Organization' : 'Person',
          name: authorName(a, locale),
          url: `${BASE}/${locale}/authors/${a.slug}`,
          ...(a.photo ? { image: a.photo } : {}),
          ...(a.entityKind === 'person' && (isRu ? a.roleRu : a.roleEn)
            ? { jobTitle: isRu ? a.roleRu : a.roleEn } : {}),
        },
      })),
    },
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="mb-7">
        <h1 className="text-[32px] sm:text-[42px] font-extrabold tracking-[-.025em] leading-[1.06] mb-2.5 flex items-center gap-3">
          <Users className="text-accent shrink-0" size={30} />
          {t.heading}
        </h1>
        <p className="text-muted text-[15px] sm:text-[16.5px] max-w-[54ch]">{t.lede}</p>
      </div>

      <AuthorsBoard authors={sorted} rubrics={rubrics} locale={locale} />
    </div>
  );
}
