import { unstable_cache } from 'next/cache';
import { client } from '@/lib/sanity';

/**
 * Каталог AI-сервисов: /ai/tools, /ai/tools/<slug>, /ai/best/<задача>.
 *
 * Две сущности и одно правило между ними. Задача (`aiJob`) владеет набором
 * признаков фильтра; сервис (`aiService`) только ставит галочки против готовых
 * ключей. Если позволить сервису заводить свои признаки, через месяц в фильтре
 * будут «4K», «4к» и «разрешение 4K» — три пункта об одном и том же.
 *
 * Цена на карточке не хранится отдельным полем. Она считается из тарифов, и
 * это сознательно: одно место правды. Редактор меняет тариф в админке, и
 * цифра на карточке, ступень фильтра и разметка Offer меняются вместе.
 */

export type Locale = 'ru' | 'en';
export interface Bi { ru?: string; en?: string }
export interface BiList { ru?: string[]; en?: string[] }

export type PlanUnit = 'month' | 'seat' | 'usage' | 'once';

export interface AiPlan {
  name: string;
  price?: number | null;
  currency?: 'USD' | 'EUR';
  unit?: PlanUnit;
  includes?: Bi;
  recommended?: boolean;
}

export interface AiFacet { key: string; label: Bi }
export interface AiFacetGroup {
  title: Bi;
  scope: 'task' | 'global';
  items: AiFacet[];
  openByDefault?: boolean;
}

export interface AiJob {
  slug: string;
  name: Bi;
  icon: string;
  order: number;
  facetGroups: AiFacetGroup[];
  intro?: Bi;
  sortedBy?: Bi;
}

export interface AiServiceReviewer {
  name: string;
  slug: string;
  entityKind?: 'person' | 'organization';
}

export interface AiService {
  slug: string;
  name: string;
  monogram?: string;
  brandColor?: string;
  logoUrl?: string | null;
  logoOnDark?: boolean;
  jobSlug?: string;
  rank?: number | null;
  website?: string;
  pricingUrl?: string;
  foundedYear?: number | null;
  plans: AiPlan[];
  facets: string[];
  tagline?: Bi;
  highlight?: Bi;
  features?: BiList;
  about?: Bi;
  pros?: BiList;
  cons?: BiList;
  seoTitle?: Bi;
  seoDescription?: Bi;
  priceCheckedAt?: string | null;
  sources?: string[];
  reviewedBy?: AiServiceReviewer | null;
  sponsored?: boolean;
  pinned?: boolean;
}

const JOB_QUERY = `*[_type == "aiJob" && hidden != true]{
  "slug": slug.current, name, "icon": coalesce(icon, "grid"), "order": coalesce(order, 100),
  "facetGroups": coalesce(facetGroups[]{
    title, "scope": coalesce(scope, "task"), openByDefault,
    "items": coalesce(items[]{ key, label }, [])
  }, []),
  intro, sortedBy
} | order(order asc)`;

const SERVICE_QUERY = `*[_type == "aiService" && hidden != true]{
  "slug": slug.current, name, monogram, brandColor,
  "logoUrl": logo.asset->url, logoOnDark,
  "jobSlug": job->slug.current,
  rank, website, pricingUrl, foundedYear,
  "plans": coalesce(plans[]{ name, price, currency, unit, includes, recommended }, []),
  "facets": coalesce(facets, []),
  tagline, highlight, features, about, pros, cons, seoTitle, seoDescription,
  priceCheckedAt, "sources": coalesce(sources, []),
  "reviewedBy": reviewedBy->{ name, "slug": slug.current, entityKind },
  sponsored, pinned
}`;

export const getAiJobs = unstable_cache(
  async (): Promise<AiJob[]> => {
    try {
      return (await client.fetch<AiJob[]>(JOB_QUERY)) ?? [];
    } catch {
      // Пустой список рисует хаб без полосы задач, но не роняет страницу.
      return [];
    }
  },
  ['ai-jobs'],
  { revalidate: 3600, tags: ['ai', 'ai-jobs'] }
);

export const getAiServices = unstable_cache(
  async (): Promise<AiService[]> => {
    try {
      return (await client.fetch<AiService[]>(SERVICE_QUERY)) ?? [];
    } catch {
      return [];
    }
  },
  ['ai-services'],
  { revalidate: 3600, tags: ['ai', 'ai-services'] }
);

/* ── Деньги ──────────────────────────────────────────────────────── */

/**
 * Минимальный платный тариф — то, с чего начинается подписка.
 *
 * Считаются только повторяющиеся платежи: за месяц и за человека. Оплата за
 * объём и разовая лицензия отбрасываются, и это не придирка. У Devin в
 * тарифах есть доплата $2,25 за единицу работы агента; взяв её за минимум,
 * карточка написала бы «от $2,25» вместо настоящих $20 в месяц. Такая цифра
 * не просто неточна — она ставит сервис не в ту ступень фильтра.
 */
export function paidFrom(s: AiService): AiPlan | null {
  const paid = s.plans.filter(
    p =>
      typeof p.price === 'number' &&
      (p.price as number) > 0 &&
      (p.unit ?? 'month') !== 'usage' &&
      (p.unit ?? 'month') !== 'once'
  );
  if (!paid.length) return null;
  return paid.reduce((a, b) => ((a.price as number) <= (b.price as number) ? a : b));
}

export const hasFreeTier = (s: AiService): boolean =>
  s.plans.some(p => p.price === 0);

/**
 * Ступени цены: до $12, $12–25, от $25.
 *
 * Границы не выбраны на глаз, а посчитаны по каталогу: квартили минимального
 * платного тарифа лежат на $10, $12 и $20, и на этих границах 51 карточка
 * делится как 19 / 18 / 7. Прежние 15 и 40 давали 23 / 20 / 1 — верхняя
 * ступень оставалась пустой, то есть не фильтровала ничего.
 */
export type PriceBand = 'cheap' | 'mid' | 'pricey' | null;
export const PRICE_BANDS = { cheap: 12, mid: 25 } as const;
export function priceBand(s: AiService): PriceBand {
  const p = paidFrom(s)?.price;
  if (typeof p !== 'number') return null;
  if (p < PRICE_BANDS.cheap) return 'cheap';
  if (p <= PRICE_BANDS.mid) return 'mid';
  return 'pricey';
}

/**
 * Ключи, которые система выводит сама и которые редактору проставлять не надо:
 * ступень цены, наличие бесплатного тарифа и его отсутствие, оплата за место и
 * за объём. Руками их дублировать нельзя — разъедутся с тарифами при первой же
 * правке.
 *
 * `nofree` выводится, а не ставится галочкой, по той же причине: «бесплатного
 * тарифа нет» — это утверждение о тарифах, и оно обязано меняться вместе с
 * ними. Четырнадцать карточек из 51 сейчас без бесплатного входа, и для
 * выбирающего это самый частый отсекающий признак.
 */
export function derivedFacets(s: AiService): string[] {
  const out: string[] = [];
  if (hasFreeTier(s)) out.push('free');
  else out.push('nofree');
  const band = priceBand(s);
  if (band) out.push(band);
  if (s.plans.some(p => p.unit === 'seat')) out.push('perseat');
  if (s.plans.some(p => p.unit === 'usage')) out.push('usage');
  return out;
}

/** Ключи, которыми распоряжается код. Схема и наполнение их не ставят. */
export const DERIVED_KEYS = ['free', 'nofree', 'cheap', 'mid', 'pricey', 'perseat', 'usage'] as const;

export const allFacets = (s: AiService): string[] =>
  [...new Set([...(s.facets ?? []), ...derivedFacets(s)])];

export const matchesFacets = (s: AiService, wanted: string[]): boolean => {
  if (!wanted.length) return true;
  const have = new Set(allFacets(s));
  return wanted.every(k => have.has(k));
};

/* ── Выборки ─────────────────────────────────────────────────────── */

/**
 * Сервисы одной задачи. Закреплённые наверх, дальше по цене: читатель
 * сравнивает деньги, и список, отсортированный по чему-то ещё, заставляет его
 * делать это глазами.
 */
export function sortServices(list: AiService[]): AiService[] {
  return [...list].sort((a, b) => {
    if (!!a.pinned !== !!b.pinned) return a.pinned ? -1 : 1;
    const pa = paidFrom(a)?.price ?? Number.POSITIVE_INFINITY;
    const pb = paidFrom(b)?.price ?? Number.POSITIVE_INFINITY;
    if (pa !== pb) return pa - pb;
    return (a.rank ?? 999) - (b.rank ?? 999);
  });
}

export async function servicesForJob(jobSlug: string): Promise<AiService[]> {
  const all = await getAiServices();
  return sortServices(all.filter(s => s.jobSlug === jobSlug));
}

/** Весь каталог в том же порядке, что и внутри задачи. */
export async function allServices(): Promise<AiService[]> {
  return sortServices(await getAiServices());
}

export async function serviceBySlug(slug: string): Promise<AiService | null> {
  const all = await getAiServices();
  return all.find(s => s.slug === slug) ?? null;
}

export async function jobBySlug(slug: string): Promise<AiJob | null> {
  const jobs = await getAiJobs();
  return jobs.find(j => j.slug === slug) ?? null;
}

/**
 * Группы фильтра для одной задачи: её собственные плюс общие, заведённые в
 * любой из задач. Общие собираются по ключу группы, чтобы «Цена», заведённая
 * дважды по недосмотру, не нарисовалась дважды.
 */
export async function facetGroupsFor(jobSlug: string): Promise<AiFacetGroup[]> {
  const jobs = await getAiJobs();
  const own = jobs.find(j => j.slug === jobSlug)?.facetGroups.filter(g => g.scope === 'task') ?? [];
  const seen = new Set<string>();
  const global: AiFacetGroup[] = [];
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
 * Группы признаков для режима «Все сервисы»: свои у каждой задачи плюс общие.
 *
 * Список получается длинным, и это не страшно: правило отображения в хабе
 * оставит только те пункты, под которые подпадает минимум две компании, и не
 * больше семи на группу. Своя группа задачи, где таких пунктов не набралось,
 * просто не покажется.
 */
export async function allFacetGroups(): Promise<AiFacetGroup[]> {
  const jobs = await getAiJobs();
  const seen = new Set<string>();
  const own: AiFacetGroup[] = [];
  const global: AiFacetGroup[] = [];
  for (const job of jobs) {
    for (const g of job.facetGroups) {
      const id = g.items.map(i => i.key).join(',');
      if (seen.has(id)) continue;
      seen.add(id);
      (g.scope === 'global' ? global : own).push(g);
    }
  }
  return [...own, ...global];
}

/** Подпись признака по ключу — для страницы сервиса и подборок. */
export async function facetLabels(): Promise<Map<string, Bi>> {
  const jobs = await getAiJobs();
  const map = new Map<string, Bi>();
  for (const job of jobs) {
    for (const g of job.facetGroups) {
      for (const f of g.items) if (!map.has(f.key)) map.set(f.key, f.label);
    }
  }
  return map;
}

/* ── Мелочи для разметки и подписей ──────────────────────────────── */

export const pick = (b: Bi | undefined, locale: Locale): string =>
  (locale === 'ru' ? b?.ru : b?.en) || '';

export const pickList = (b: BiList | undefined, locale: Locale): string[] =>
  (locale === 'ru' ? b?.ru : b?.en) || [];

export const unitLabel = (unit: PlanUnit | undefined, locale: Locale): string => {
  const ru: Record<PlanUnit, string> = {
    month: 'в месяц', seat: 'в месяц за человека', usage: 'за объём', once: 'единоразово',
  };
  const en: Record<PlanUnit, string> = {
    month: 'per month', seat: 'per seat / month', usage: 'per use', once: 'one-off',
  };
  return (locale === 'ru' ? ru : en)[unit ?? 'month'];
};

export const money = (price: number | null | undefined, currency: 'USD' | 'EUR' = 'USD'): string => {
  if (typeof price !== 'number') return '—';
  const sign = currency === 'EUR' ? '€' : '$';
  return price === 0 ? `${sign}0` : `${sign}${price}`;
};

/* ── Виджет на главной ────────────────────────────────────────────── */

export interface AiTile {
  slug: string;
  name: string;
  monogram: string;
  brandColor: string;
  logoUrl: string | null;
  logoOnDark: boolean;
}

export interface HomeAiData { show: boolean; tiles: AiTile[] }

/**
 * Плитки для виджета на главной.
 *
 * Берутся закреплённые редактором, иначе первые по месту в рейтинге a16z.
 * Редактор ограничен двадцатью: док держится на том, что плитки
 * перекрываются и расступаются, а полсотни знаков в ряд перестают читаться и
 * превращаются в полосу.
 *
 * Сервисы без логотипа в виджет не попадают, хотя в каталоге показываются
 * монограммой. Виджет — витрина чужих брендов, и ряд, где половина плиток с
 * буквами вместо знака, работает против своей задачи: узнать знакомое.
 */
export const getHomeAi = unstable_cache(
  async (): Promise<HomeAiData> => {
    const empty: HomeAiData = { show: false, tiles: [] };
    if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return empty;
    try {
      const projection = `"slug": slug.current, name, "monogram": coalesce(monogram, ""),
        "brandColor": coalesce(brandColor, "#111827"),
        "logoUrl": logo.asset->url, "logoOnDark": coalesce(logoOnDark, false)`;

      const settings: { show?: boolean; tiles?: AiTile[] } = await client.fetch(
        `*[_type == "homeSettings"][0]{
          "show": coalesce(showAiWidget, true),
          "tiles": aiWidgetServices[]->{ ${projection} }
        }`
      );
      if (settings?.show === false) return empty;

      let tiles = (settings?.tiles ?? []).filter(t => t?.slug && t.logoUrl);
      if (!tiles.length) {
        tiles = await client.fetch<AiTile[]>(
          `*[_type == "aiService" && hidden != true && defined(logo)]
            | order(coalesce(rank, 999) asc)[0...20]{ ${projection} }`
        );
      }
      return { show: tiles.length > 0, tiles: tiles.slice(0, 20) };
    } catch {
      return empty;
    }
  },
  ['home-ai-widget'],
  { revalidate: 3600, tags: ['homeSettings', 'ai', 'ai-services'] }
);

/** Плитки для ряда логотипов внизу хаба: все, у кого есть загруженный знак. */
export function tilesFrom(services: AiService[]): AiTile[] {
  return services
    .filter(s => s.logoUrl)
    .map(s => ({
      slug: s.slug,
      name: s.name,
      monogram: s.monogram ?? '',
      brandColor: s.brandColor ?? '#111827',
      logoUrl: s.logoUrl ?? null,
      logoOnDark: Boolean(s.logoOnDark),
    }));
}

/** Последняя дата сверки по всему каталогу — для подписи в шапке раздела. */
export function lastPriceCheck(services: AiService[]): string | null {
  const dates = services.map(s => s.priceCheckedAt).filter(Boolean) as string[];
  return dates.length ? dates.sort().at(-1)! : null;
}
