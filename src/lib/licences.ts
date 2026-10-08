import { unstable_cache } from 'next/cache';
import { client } from '@/lib/sanity';

/**
 * Лицензионные режимы: MiCA, VARA, CySEC, Дія City.
 *
 * Отдельно от стран намеренно. Страна отвечает, сколько здесь берут налога;
 * режим — что нужно, чтобы работать с клиентами. У MiCA страны вообще нет: он
 * накрывает двадцать семь сразу, и привязка к одной была бы неправдой.
 *
 * Разбор строковых полей переиспользует парсеры страниц стран: формат «метка |
 * значение | подпись» редактор уже знает, и заводить для режимов второй
 * синтаксис значило бы учить его дважды.
 */

export type RegimeStatus = 'active' | 'transition' | 'draft';
export type RegimeAccent = 'cyan' | 'amber' | 'violet' | 'blue' | 'emerald' | 'pink' | 'orange';

interface Bi { ru?: string; en?: string }

/** Проверяющий режим — то же, что у стран. */
export interface RegimeReviewer {
  name: string;
  slug: string;
  entityKind?: 'person' | 'organization';
  firstNameRu?: string | null; lastNameRu?: string | null;
  firstNameEn?: string | null; lastNameEn?: string | null;
  roleRu?: string | null; roleEn?: string | null;
}

export interface LicenceRegime {
  slug: string;
  name: Bi;
  monogram: string;
  jurisdictionFlag?: string;
  accent: RegimeAccent;
  authority: string;
  scope?: Bi;
  status: RegimeStatus;
  order: number;
  /** Страна, на чьей странице рисуется врезка. У наднациональных режимов её нет. */
  country?: { slug: string; nameRu: string; nameEn: string };
  headline?: Bi;
  intro?: Bi;
  figures?: Bi;
  feeTable?: Bi;
  steps?: Bi;
  body?: Bi;
  timeline?: Bi;
  faq?: Bi;
  sources?: Bi;
  related?: Bi;
  seoTitle?: Bi;
  seoDescription?: Bi;
  publishedAt?: string;
  checkedAt: string;
  reviewedBy?: RegimeReviewer;
}

const QUERY = `*[_type == "licenceRegime" && hidden != true]{
  "slug": slug.current, name, monogram, jurisdictionFlag, accent, authority, scope,
  status, "order": coalesce(order, 50),
  "country": country->{ "slug": slug.current, "nameRu": name.ru, "nameEn": name.en },
  headline, intro, figures, feeTable, steps, body, timeline, faq, sources, related,
  seoTitle, seoDescription, publishedAt, checkedAt,
  "reviewedBy": reviewedBy->{
    name, "slug": slug.current, entityKind,
    firstNameRu, lastNameRu, firstNameEn, lastNameEn, roleRu, roleEn
  }
} | order(order asc, name.en asc)`;

export const getLicenceRegimes = unstable_cache(
  async (): Promise<LicenceRegime[]> => {
    try {
      const docs: LicenceRegime[] = await client.fetch(QUERY);
      return docs ?? [];
    } catch {
      // Пустой список рисует хаб без карточек, но не роняет страницу карты,
      // на которой полоса перехода живёт рядом с самой картой.
      return [];
    }
  },
  ['licence-regimes'],
  // Час, как у стран: правка в админке сбрасывает тег и видна сразу.
  { revalidate: 3600, tags: ['regulation', 'licences'] }
);

/** Режим одной страны — для врезки на её странице. */
export async function regimeForCountry(countrySlug: string): Promise<LicenceRegime | null> {
  const all = await getLicenceRegimes();
  return all.find(r => r.country?.slug === countrySlug) ?? null;
}

/** Самая свежая проверка среди режимов — что показывает хаб. */
export function lastCheckedRegime(regimes: LicenceRegime[]): string {
  return regimes.reduce((max, r) => (r.checkedAt > max ? r.checkedAt : max), '');
}

/* ────────────────── разбор полей, которых нет у стран ────────────────── */

function lines(raw?: string): string[] {
  return (raw ?? '').split('\n').map(l => l.trim()).filter(Boolean);
}
function columns(line: string): string[] {
  return line.split('|').map(c => c.trim());
}

/** Три цифры карточки: `МЕТКА | значение`. */
export interface HeadlineStat { label: string; value: string }
export function parseHeadline(raw?: string): HeadlineStat[] {
  return lines(raw)
    .map(l => {
      const [label, value] = columns(l);
      return label && value ? { label, value } : null;
    })
    .filter((s): s is HeadlineStat => s !== null)
    // Больше трёх в карточку не помещается, и обрезать здесь честнее, чем
    // ломать сетку на четвёртой.
    .slice(0, 3);
}

/** Таблица стоимости: первая строка — заголовки, дальше данные. */
export interface FeeTable { head: string[]; rows: string[][] }
export function parseFeeTable(raw?: string): FeeTable | null {
  const all = lines(raw).map(columns);
  if (all.length < 2) return null;
  const [head, ...rows] = all;
  const width = head.length;
  return {
    head,
    // Строка короче заголовка добивается пустыми ячейками: иначе таблица
    // разъезжается на одной неполной строке.
    rows: rows.map(r => Array.from({ length: width }, (_, i) => r[i] ?? '')),
  };
}

/** Шаги заявки: по строке на шаг, нумерация своя. */
export function parseSteps(raw?: string): string[] {
  return lines(raw).map(l => l.replace(/^\d+[.)]\s*/, ''));
}

/* ────────────────── виджет на главной ────────────────── */

export interface WidgetCountry {
  slug: string;
  iso2: string;
  nameRu: string;
  nameEn: string;
  status: 'legal' | 'restricted' | 'banned' | 'unclear';
  regulatorName?: string;
  summaryRu?: string;
  summaryEn?: string;
  taxRu?: string;
  taxEn?: string;
  checkedAt: string;
}

export interface HomeRegulationData {
  show: boolean;
  countries: WidgetCountry[];
  regimes: LicenceRegime[];
}

const WIDGET_COUNTRY_PROJECTION = `
  "slug": slug.current, iso2, "nameRu": name.ru, "nameEn": name.en, status,
  regulatorName, "summaryRu": summary.ru, "summaryEn": summary.en,
  "taxRu": taxNote.ru, "taxEn": taxNote.en, checkedAt
`;

/**
 * Что показывает нижний блок главной.
 *
 * Подборка редактора, а при пустой подборке — свежепроверенные страны со
 * своей страницей. Вторая половина важнее первой: блок не должен пустовать
 * из-за того, что до него не дошли руки, и не должен показывать страну без
 * гида, в который можно провалиться.
 */
export const getHomeRegulation = unstable_cache(
  async (): Promise<HomeRegulationData> => {
    const empty: HomeRegulationData = { show: false, countries: [], regimes: [] };
    if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return empty;
    try {
      const settings: {
        show?: boolean;
        countries?: WidgetCountry[];
        regimes?: { slug: string }[];
      } = await client.fetch(`*[_type == "homeSettings"][0]{
        "show": coalesce(showRegulationWidget, true),
        "countries": regulationWidgetCountries[]->{ ${WIDGET_COUNTRY_PROJECTION} },
        "regimes": regulationWidgetRegimes[]->{ "slug": slug.current }
      }`);

      if (settings?.show === false) return empty;

      let countries = (settings?.countries ?? []).filter(Boolean);
      if (!countries.length) {
        countries = await client.fetch(
          `*[_type == "regulationCountry" && hasPage == true] | order(checkedAt desc)[0...5]{
            ${WIDGET_COUNTRY_PROJECTION}
          }`
        );
      }

      const all = await getLicenceRegimes();
      const chosen = (settings?.regimes ?? []).map(r => r?.slug).filter(Boolean);
      const regimes = chosen.length
        ? chosen.map(s => all.find(r => r.slug === s)).filter((r): r is LicenceRegime => Boolean(r))
        : all.slice(0, 4);

      return { show: true, countries: countries ?? [], regimes };
    } catch {
      return empty;
    }
  },
  ['home-regulation-widget'],
  { revalidate: 3600, tags: ['homeSettings', 'regulation', 'licences'] }
);
