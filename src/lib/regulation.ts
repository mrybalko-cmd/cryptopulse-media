import { unstable_cache } from 'next/cache';
import { client } from './sanity';
import { REGULATION_DATA, type CountryReg, type RegStatus } from './regulationData';

/**
 * The regulation map's data, read from Sanity with the source file as a net.
 *
 * The 46 countries used to be a TypeScript constant, so every correction meant
 * a deploy — and law does not wait for a deploy. They live in Sanity now and
 * are editable from /admin/regulation.
 *
 * REGULATION_DATA stays in the repo deliberately. If Sanity is unreachable the
 * page shows the last known good map rather than an empty one: stale facts beat
 * a blank page on a URL that 1,716 internal links point at.
 */

export type RegRegion = 'eu' | 'americas' | 'asia' | 'mena';

/** A country as the map renders it: the old shape plus what Sanity adds. */
export interface RegCountry extends CountryReg {
  region: RegRegion;
  /** A single memorable thing that happened here — what makes the entry worth reading. */
  factNote?: { ru: string; en: string };
  regulatorName?: string;
  sourceUrl?: string;
  /** ISO date. `updatedYear` is derived from it for the existing UI. */
  checkedAt: string;
}

export const REGION_LABELS: Record<RegRegion, { ru: string; en: string }> = {
  eu:       { ru: 'Европа',                     en: 'Europe' },
  americas: { ru: 'Америка',                    en: 'Americas' },
  asia:     { ru: 'Азия',                       en: 'Asia' },
  mena:     { ru: 'Ближний Восток / Африка',    en: 'Middle East / Africa' },
};

/**
 * Where a country sits when the fallback file is in play.
 *
 * This table is the reason Russia vanished from the map: region membership
 * lived only here, and a country absent from every row rendered nowhere while
 * still counting in the totals. In Sanity the region is a required field on the
 * country itself, so the problem cannot recur — this copy only serves the
 * offline fallback, and anything unlisted lands in `eu` rather than disappearing.
 */
const FALLBACK_REGION: Record<string, RegRegion> = {};
for (const [region, codes] of Object.entries({
  eu:       ['CZ','DE','FR','CH','GB','PT','ES','NL','NO','SE','EE','PL','IT','BY','UA','RU'],
  americas: ['US','CA','SV','BR','MX','AR','BO'],
  asia:     ['SG','JP','AU','KR','IN','CN','TR','KZ','GE','TH','ID','PH','PK','UZ','BD','NP'],
  mena:     ['AE','SA','EG','DZ','MA','TN','ZA'],
}) as [RegRegion, string[]][]) {
  for (const c of codes) FALLBACK_REGION[c] = region;
}

interface SanityRegDoc {
  iso2: string;
  isoNum: string;
  slug: string;
  status: RegStatus;
  region: RegRegion;
  nameRu: string; nameEn: string;
  summaryRu: string; summaryEn: string;
  detailsRu: string; detailsEn: string;
  taxNoteRu?: string; taxNoteEn?: string;
  factNoteRu?: string; factNoteEn?: string;
  regulatorName?: string;
  sourceUrl?: string;
  checkedAt: string;
}

const QUERY = `*[_type == "regulationCountry"]{
  iso2, isoNum, "slug": slug.current, status, region,
  "nameRu": name.ru, "nameEn": name.en,
  "summaryRu": summary.ru, "summaryEn": summary.en,
  "detailsRu": details.ru, "detailsEn": details.en,
  "taxNoteRu": taxNote.ru, "taxNoteEn": taxNote.en,
  "factNoteRu": factNote.ru, "factNoteEn": factNote.en,
  regulatorName, sourceUrl, checkedAt
}`;

function fromSanity(d: SanityRegDoc): RegCountry {
  return {
    iso2: d.iso2,
    isoNum: d.isoNum,
    slug: d.slug,
    name: { ru: d.nameRu, en: d.nameEn },
    status: d.status,
    summary: { ru: d.summaryRu, en: d.summaryEn },
    details: { ru: d.detailsRu, en: d.detailsEn },
    ...(d.taxNoteRu || d.taxNoteEn
      ? { taxNote: { ru: d.taxNoteRu ?? '', en: d.taxNoteEn ?? '' } }
      : {}),
    ...(d.factNoteRu || d.factNoteEn
      ? { factNote: { ru: d.factNoteRu ?? '', en: d.factNoteEn ?? '' } }
      : {}),
    updatedYear: (d.checkedAt ?? '').slice(0, 4),
    region: d.region,
    regulatorName: d.regulatorName,
    sourceUrl: d.sourceUrl,
    checkedAt: d.checkedAt,
  };
}

function fromFile(): RegCountry[] {
  return REGULATION_DATA.map(c => ({
    ...c,
    region: FALLBACK_REGION[c.iso2] ?? 'eu',
    checkedAt: `${c.updatedYear}-01-01`,
  }));
}

export const getRegulationCountries = unstable_cache(
  async (): Promise<RegCountry[]> => {
    try {
      const docs: SanityRegDoc[] = await client.fetch(QUERY);
      // An empty result is not an outage but it is not a map either — before
      // the migration ran this query returned nothing, and rendering that would
      // have replaced 46 countries with a blank page.
      if (!docs?.length) return fromFile();
      return docs
        .map(fromSanity)
        .sort((a, b) => a.name.en.localeCompare(b.name.en));
    } catch {
      return fromFile();
    }
  },
  ['regulation-countries'],
  { revalidate: 300, tags: ['regulation'] }
);

/** Newest check across all countries — what `dateModified` should say. */
export function lastCheckedAt(countries: RegCountry[]): string {
  return countries.reduce((max, c) => (c.checkedAt > max ? c.checkedAt : max), '');
}
