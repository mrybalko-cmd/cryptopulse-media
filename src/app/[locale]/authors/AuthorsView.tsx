import { notFound } from 'next/navigation';
import { Users } from 'lucide-react';
import { BASE } from '@/lib/metadata';
import { fetchAuthorCards, fetchAuthorRubrics, fetchAuthorsPageSettings } from '@/lib/sanity';
import { SITE_NAME } from '@/lib/site';
import { authorName } from '@/lib/authorName';
import PopularSidebar from '@/components/ui/PopularSidebar';
import AuthorsBoard from './AuthorsBoard';

/**
 * Витрина участников — общий вид для первой страницы и для /page/N.
 *
 * Обе страницы отдают свои двенадцать карточек прямо в HTML и имеют
 * собственный canonical. Canonical на первую страницу Google считает сигналом
 * «эта страница не нужна» и выбрасывает её из индекса вместе со ссылками на
 * участников, которые только на ней и есть.
 */

export const PER_PAGE = 12;

export async function loadAuthors(locale: string) {
  const [authors, allRubrics, settings] = await Promise.all([
    fetchAuthorCards(),
    fetchAuthorRubrics(),
    fetchAuthorsPageSettings(),
  ]);

  const sorted =
    settings.sort === 'alphabet'
      ? [...authors].sort((a, b) => authorName(a, locale).localeCompare(authorName(b, locale)))
      : settings.sort === 'materials'
        ? [...authors].sort((a, b) => b.materials - a.materials)
        : authors;

  // «Авто» решается здесь: рубрика видна, пока в ней есть хоть одна карточка.
  // Опустела — пропала сама, появился участник — вернулась сама, без правок.
  const used = new Set(authors.flatMap((a) => a.rubrics || []));
  const rubrics = allRubrics.filter((r) => r.visibility === 'always' || used.has(r.key));

  return { authors: sorted, rubrics, settings, totalPages: Math.max(1, Math.ceil(sorted.length / PER_PAGE)) };
}

/** Тексты раздела: ни одной строки нет в коде, всё правится в админке. */
export function authorsTexts(
  s: Awaited<ReturnType<typeof fetchAuthorsPageSettings>>,
  isRu: boolean,
  page = 1
) {
  const suffix = page > 1 ? (isRu ? ` — страница ${page}` : ` — page ${page}`) : '';
  const heading = (isRu ? s.headingRu : s.headingEn) || (isRu ? 'Авторы и партнёры' : 'Authors and partners');
  const seoTitle = (isRu ? s.seoTitleRu : s.seoTitleEn) || heading;
  const seoDescription =
    (isRu ? s.seoDescriptionRu : s.seoDescriptionEn) ||
    (isRu
      ? `Редакция и партнёры ${SITE_NAME}: кто пишет материалы и что уже опубликовано.`
      : `The editorial team and partners of ${SITE_NAME}: who writes and what they published.`);
  return {
    heading,
    lede:
      (isRu ? s.ledeRu : s.ledeEn) ||
      (isRu ? 'Кто пишет для Intokened и что они сделали.' : 'Who writes for Intokened and what they made.'),
    // Номер страницы обязан попасть в заголовок и описание: иначе у пяти
    // страниц одинаковые метаданные, и поиск считает их дублями.
    seoTitle: seoTitle + suffix,
    seoDescription: page > 1 ? `${seoDescription}${suffix}.` : seoDescription,
  };
}

export default async function AuthorsView({ locale, page }: { locale: string; page: number }) {
  const isRu = locale === 'ru';
  const { authors, rubrics, settings, totalPages } = await loadAuthors(locale);
  if (page < 1 || page > totalPages) notFound();

  const t = authorsTexts(settings, isRu, page);
  const basePath = `/${locale}/authors`;
  const pageUrl = page === 1 ? `${BASE}${basePath}` : `${BASE}${basePath}/page/${page}`;
  const shown = authors.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  // Разметка для поисковика: участники этой страницы с типом каждого. Для
  // человека Person, для компании Organization — иначе Google приписывает
  // организации свойства человека и элемент из выдачи выпадает.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: t.seoTitle,
    description: t.seoDescription,
    url: pageUrl,
    isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: BASE },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: shown.length,
      itemListElement: shown.map((a, i) => ({
        '@type': 'ListItem',
        position: (page - 1) * PER_PAGE + i + 1,
        item: {
          '@type': a.entityKind === 'organization' ? 'Organization' : 'Person',
          name: authorName(a, locale),
          url: `${BASE}${basePath}/${a.slug}`,
          ...(a.photo ? { image: a.photo } : {}),
          ...(a.entityKind === 'person' && (isRu ? a.roleRu : a.roleEn)
            ? { jobTitle: isRu ? a.roleRu : a.roleEn }
            : {}),
        },
      })),
    },
  };

  return (
    <div className="mx-auto max-w-[1320px] px-4 py-10 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_256px] lg:gap-8">
        <div className="cal-stage">
          <div className="mb-6">
            <h1 className="mb-2.5 flex items-center gap-3 text-[30px] font-extrabold leading-[1.06] tracking-[-0.025em] sm:text-[38px]">
              <Users className="shrink-0 text-accent" size={28} />
              {t.heading}
              {page > 1 && <span className="text-muted">— {isRu ? `страница ${page}` : `page ${page}`}</span>}
            </h1>
            <p className="max-w-[54ch] text-[15px] text-muted">{t.lede}</p>
          </div>

          <AuthorsBoard
            authors={authors}
            rubrics={rubrics}
            locale={locale}
            page={page}
            perPage={PER_PAGE}
            basePath={basePath}
          />
        </div>

        <PopularSidebar locale={locale} />
      </div>
    </div>
  );
}
