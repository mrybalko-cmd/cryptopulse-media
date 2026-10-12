import { adminClient as client, writeClient } from '@/lib/sanity';
import type { Bi, BiList, PlanUnit } from '@/lib/ai';

/**
 * Чтение и запись каталога AI для админки.
 *
 * Отдельно от `src/lib/ai.ts` намеренно: тот читает через кэш и отдаёт только
 * опубликованное, этому нужно видеть и скрытое, и сразу после правки. Общая
 * функция обслуживала бы два разных требования и однажды показала бы на сайте
 * черновик.
 */

export interface AdminPlan {
  _key?: string;
  name: string;
  price: number | null;
  currency: 'USD' | 'EUR';
  unit: PlanUnit;
  includes: Bi;
  recommended: boolean;
}

export interface AdminAiService {
  _id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  logoOnDark: boolean;
  monogram: string;
  brandColor: string;
  jobId: string | null;
  jobName: string | null;
  rank: number | null;
  website: string;
  pricingUrl: string;
  foundedYear: number | null;
  plans: AdminPlan[];
  facets: string[];
  tagline: Bi;
  highlight: Bi;
  features: BiList;
  about: Bi;
  pros: BiList;
  cons: BiList;
  seoTitle: Bi;
  seoDescription: Bi;
  priceCheckedAt: string | null;
  sources: string[];
  sponsored: boolean;
  pinned: boolean;
  hidden: boolean;
}

export interface AdminFacet { key: string; labelRu: string; labelEn: string }
export interface AdminFacetGroup {
  titleRu: string;
  titleEn: string;
  scope: 'task' | 'global';
  openByDefault: boolean;
  items: AdminFacet[];
}
export interface AdminAiJob {
  _id: string;
  slug: string;
  nameRu: string;
  nameEn: string;
  icon: string;
  order: number;
  introRu: string;
  introEn: string;
  sortedByRu: string;
  sortedByEn: string;
  hidden: boolean;
  facetGroups: AdminFacetGroup[];
  /** Сколько карточек на этой задаче — чтобы не удалить непустую. */
  serviceCount: number;
}

const SERVICE_PROJECTION = `_id, name, "slug": coalesce(slug.current, ""),
  "logoUrl": logo.asset->url, "logoOnDark": coalesce(logoOnDark, false),
  "monogram": coalesce(monogram, ""), "brandColor": coalesce(brandColor, "#111827"),
  "jobId": job._ref, "jobName": job->name.ru,
  rank, "website": coalesce(website, ""), "pricingUrl": coalesce(pricingUrl, ""), foundedYear,
  "plans": coalesce(plans[]{ _key, name, price, "currency": coalesce(currency, "USD"),
    "unit": coalesce(unit, "month"), "includes": coalesce(includes, {}), "recommended": coalesce(recommended, false) }, []),
  "facets": coalesce(facets, []),
  "tagline": coalesce(tagline, {}), "highlight": coalesce(highlight, {}),
  "features": coalesce(features, {}), "about": coalesce(about, {}),
  "pros": coalesce(pros, {}), "cons": coalesce(cons, {}),
  "seoTitle": coalesce(seoTitle, {}), "seoDescription": coalesce(seoDescription, {}),
  priceCheckedAt, "sources": coalesce(sources, []),
  "sponsored": coalesce(sponsored, false), "pinned": coalesce(pinned, false),
  "hidden": coalesce(hidden, false)`;

const JOB_PROJECTION = `_id, "slug": coalesce(slug.current, ""),
  "nameRu": coalesce(name.ru, ""), "nameEn": coalesce(name.en, ""),
  "icon": coalesce(icon, "grid"), "order": coalesce(order, 100),
  "introRu": coalesce(intro.ru, ""), "introEn": coalesce(intro.en, ""),
  "sortedByRu": coalesce(sortedBy.ru, ""), "sortedByEn": coalesce(sortedBy.en, ""),
  "hidden": coalesce(hidden, false),
  "facetGroups": coalesce(facetGroups[]{
    "titleRu": coalesce(title.ru, ""), "titleEn": coalesce(title.en, ""),
    "scope": coalesce(scope, "task"), "openByDefault": coalesce(openByDefault, false),
    "items": coalesce(items[]{ key, "labelRu": coalesce(label.ru, ""), "labelEn": coalesce(label.en, "") }, [])
  }, []),
  "serviceCount": count(*[_type == "aiService" && job._ref == ^._id])`;

export async function fetchAdminAiServices(): Promise<AdminAiService[]> {
  return client.fetch<AdminAiService[]>(
    `*[_type == "aiService"] | order(coalesce(rank, 999) asc, name asc){ ${SERVICE_PROJECTION} }`
  );
}

export async function fetchAdminAiServiceById(id: string): Promise<AdminAiService | null> {
  return client.fetch<AdminAiService | null>(
    `*[_type == "aiService" && _id == $id][0]{ ${SERVICE_PROJECTION} }`, { id }
  );
}

export async function fetchAdminAiJobs(): Promise<AdminAiJob[]> {
  return client.fetch<AdminAiJob[]>(
    `*[_type == "aiJob"] | order(order asc){ ${JOB_PROJECTION} }`
  );
}

export async function fetchAdminAiJobById(id: string): Promise<AdminAiJob | null> {
  return client.fetch<AdminAiJob | null>(`*[_type == "aiJob" && _id == $id][0]{ ${JOB_PROJECTION} }`, { id });
}

/**
 * Признаки, доступные карточке: свои у её задачи плюс общие из любой задачи.
 * Ровно то же правило, что на сайте, — иначе редактор поставит галочку,
 * которой в фильтре нет, и она нигде не покажется.
 */
export async function fetchFacetChoices(jobId: string | null): Promise<AdminFacetGroup[]> {
  const jobs = await fetchAdminAiJobs();
  const own = jobs.find(j => j._id === jobId)?.facetGroups.filter(g => g.scope === 'task') ?? [];
  const seen = new Set<string>();
  const global: AdminFacetGroup[] = [];
  for (const job of jobs) {
    for (const g of job.facetGroups) {
      if (g.scope !== 'global') continue;
      const id = g.items.map(i => i.key).join(',');
      if (seen.has(id)) continue;
      seen.add(id);
      global.push(g);
    }
  }
  return [...own, ...global];
}

/**
 * Сколько карточек отмечено каждым признаком.
 *
 * Без этой цифры редактор правит формулировки вслепую: в хабе пункт
 * показывается, только когда его имеют минимум две компании задачи, и признак
 * с одной галочкой на сайте не появляется вовсе. Увидев ноль или единицу,
 * понятно, что дело не в формулировке — признак просто некому показать.
 */
export async function fetchFacetUsage(): Promise<Record<string, number>> {
  const rows = await client.fetch<{ job: string | null; facets: string[] }[]>(
    `*[_type == "aiService" && hidden != true]{ "job": job->slug.current, "facets": coalesce(facets, []) }`
  );
  const out: Record<string, number> = {};
  for (const r of rows) for (const k of r.facets) out[k] = (out[k] ?? 0) + 1;
  return out;
}

/**
 * То же, но в разрезе задачи: общий признак может быть у двадцати компаний
 * каталога и у одной внутри конкретной задачи — в её фильтре он не покажется.
 */
export async function fetchFacetUsageInJob(jobSlug: string): Promise<Record<string, number>> {
  const rows = await client.fetch<{ facets: string[] }[]>(
    `*[_type == "aiService" && hidden != true && job->slug.current == $jobSlug]{ "facets": coalesce(facets, []) }`,
    { jobSlug }
  );
  const out: Record<string, number> = {};
  for (const r of rows) for (const k of r.facets) out[k] = (out[k] ?? 0) + 1;
  return out;
}

/** Ключи, которыми распоряжается код: в форме они показаны, но не правятся. */
export const DERIVED_FACET_KEYS = new Set(['free', 'nofree', 'cheap', 'mid', 'pricey', 'perseat', 'usage']);

const rnd = () => Math.random().toString(36).slice(2, 8);

export type AiServiceInput = Omit<AdminAiService, '_id' | 'logoUrl' | 'jobName'>;

function serviceDoc(input: AiServiceInput, logoAssetId?: string) {
  const bi = (b: Bi) => ({ ru: b.ru?.trim() || undefined, en: b.en?.trim() || undefined });
  const list = (b: BiList) => ({
    ru: (b.ru ?? []).map(s => s.trim()).filter(Boolean),
    en: (b.en ?? []).map(s => s.trim()).filter(Boolean),
  });
  return {
    name: input.name.trim(),
    slug: { _type: 'slug', current: input.slug.trim() },
    ...(logoAssetId ? { logo: { _type: 'image', asset: { _type: 'reference', _ref: logoAssetId } } } : {}),
    logoOnDark: input.logoOnDark,
    monogram: input.monogram.trim() || undefined,
    brandColor: input.brandColor.trim() || '#111827',
    job: input.jobId ? { _type: 'reference', _ref: input.jobId } : undefined,
    rank: input.rank ?? undefined,
    website: input.website.trim() || undefined,
    pricingUrl: input.pricingUrl.trim() || undefined,
    foundedYear: input.foundedYear ?? undefined,
    plans: input.plans.map((p, i) => ({
      _key: p._key || `pl${i}${rnd()}`,
      _type: 'aiPlan',
      name: p.name.trim(),
      price: p.price,
      currency: p.currency,
      unit: p.unit,
      includes: bi(p.includes),
      recommended: p.recommended,
    })),
    // Выводимые ключи в документ не пишутся: их считает код из тарифов, и
    // записанная копия разъехалась бы с ценой при первой же правке.
    facets: input.facets.filter(k => !DERIVED_FACET_KEYS.has(k)),
    tagline: bi(input.tagline),
    highlight: bi(input.highlight),
    features: list(input.features),
    about: bi(input.about),
    pros: list(input.pros),
    cons: list(input.cons),
    seoTitle: bi(input.seoTitle),
    seoDescription: bi(input.seoDescription),
    priceCheckedAt: input.priceCheckedAt || undefined,
    sources: input.sources.map(s => s.trim()).filter(Boolean),
    sponsored: input.sponsored,
    pinned: input.pinned,
    hidden: input.hidden,
  };
}

/**
 * Один и тот же сайт — одна карточка.
 *
 * Адрес приводится к сравнимому виду: без протокола, без www и без хвостового
 * слеша. Иначе «https://runwayml.com/» и «runwayml.com» считались бы разными
 * компаниями, и каталог тихо обзавёлся бы дублями, которые заметны только
 * глазами и только потом.
 */
export function normaliseSite(url: string): string {
  return url.trim().toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/+$/, '');
}

export interface Duplicate { _id: string; name: string; reason: 'site' | 'slug' }

/** Ищет уже заведённую карточку по сайту или адресу. exceptId — своя при правке. */
export async function findDuplicate(
  website: string, slug: string, exceptId?: string
): Promise<Duplicate | null> {
  const rows = await client.fetch<{ _id: string; name: string; website: string | null; slug: string | null }[]>(
    `*[_type == "aiService"]{ _id, name, website, "slug": slug.current }`
  );
  const site = normaliseSite(website);
  const wanted = slug.trim().toLowerCase();
  for (const r of rows) {
    if (r._id === exceptId) continue;
    if (wanted && r.slug === wanted) return { _id: r._id, name: r.name, reason: 'slug' };
    if (site && r.website && normaliseSite(r.website) === site) return { _id: r._id, name: r.name, reason: 'site' };
  }
  return null;
}

export async function createAiService(input: AiServiceInput, logoAssetId?: string) {
  return writeClient.create({ _type: 'aiService', ...serviceDoc(input, logoAssetId) });
}

export async function updateAiService(id: string, input: AiServiceInput, logoAssetId?: string) {
  const fields = serviceDoc(input, logoAssetId);
  const unset = Object.entries(fields).filter(([, v]) => v === undefined).map(([k]) => k);
  let patch = writeClient.patch(id).set(fields);
  if (unset.length) patch = patch.unset(unset);
  await patch.commit({ autoGenerateArrayKeys: false });
}

export async function deleteAiService(id: string) {
  await writeClient.delete(id);
}

export type AiJobInput = Omit<AdminAiJob, '_id' | 'serviceCount'>;

function jobDoc(input: AiJobInput) {
  return {
    name: { ru: input.nameRu.trim() || undefined, en: input.nameEn.trim() || undefined },
    slug: { _type: 'slug', current: input.slug.trim() },
    icon: input.icon,
    order: input.order,
    intro: { ru: input.introRu.trim() || undefined, en: input.introEn.trim() || undefined },
    sortedBy: { ru: input.sortedByRu.trim() || undefined, en: input.sortedByEn.trim() || undefined },
    hidden: input.hidden,
    facetGroups: input.facetGroups.map((g, gi) => ({
      _key: `g${gi}${rnd()}`,
      _type: 'aiFacetGroup',
      title: { ru: g.titleRu.trim() || undefined, en: g.titleEn.trim() || undefined },
      scope: g.scope,
      openByDefault: g.openByDefault,
      items: g.items.map(f => ({
        // Ключ и есть _key: он уникален внутри группы по определению, и
        // переименование подписи его не трогает — галочки у карточек держатся
        // именно на ключе.
        _key: f.key,
        _type: 'aiFacet',
        key: f.key,
        label: { ru: f.labelRu.trim() || undefined, en: f.labelEn.trim() || undefined },
      })),
    })),
  };
}

export async function createAiJob(input: AiJobInput) {
  return writeClient.create({ _type: 'aiJob', ...jobDoc(input) });
}

export async function updateAiJob(id: string, input: AiJobInput) {
  await writeClient.patch(id).set(jobDoc(input)).commit({ autoGenerateArrayKeys: false });
}

/**
 * Удаление задачи с проверкой входящих ссылок.
 *
 * База и сама не даст удалить документ, на который ссылаются, но сообщение
 * об этом редактору ничего не объясняет. Считаем карточки заранее и говорим,
 * сколько их и куда их сначала переложить.
 */
export async function deleteAiJob(id: string): Promise<{ ok: boolean; used: number }> {
  const used = await client.fetch<number>(`count(*[_type == "aiService" && job._ref == $id])`, { id });
  if (used > 0) return { ok: false, used };
  await writeClient.delete(id);
  return { ok: true, used: 0 };
}
