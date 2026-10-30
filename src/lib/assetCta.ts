import { unstable_cache } from 'next/cache';
import { client } from '@/lib/sanity';
import type { AssetCta } from '@/lib/assetCtaShared';

/**
 * Кнопки партнёров на монетах — серверное чтение.
 *
 * Читается одним запросом на всю витрину, а не по запросу на монету: на
 * странице активов их двадцать четыре, и двадцать четыре обращения к базе
 * ради одной кнопки каждое — лишняя нагрузка на квоту.
 *
 * Срок показа считается здесь, на сервере, а не в разметке. Иначе кнопка
 * висела бы до ближайшей пересборки страницы, то есть до часа после
 * окончания оплаченного периода.
 *
 * Типы и чистые помощники живут в `assetCtaShared.ts`: витрина — клиентский
 * компонент, и этот файл ей импортировать нельзя.
 */

export type { AssetCta, AssetCtaPlaces, CtaMode } from '@/lib/assetCtaShared';
export { ctaHref, ctaLabels, inkOn } from '@/lib/assetCtaShared';

/** Метка кэша. Админка сбрасывает её при сохранении. */
export const ASSET_CTA_TAG = 'asset-cta';

const QUERY = `*[_type == "assetCta" && active == true && defined(coinSlug) && defined(url)]{
  coinSlug, mode, labelRu, labelEn, url, sellUrl, partner, color,
  "showAdLabel": coalesce(showAdLabel, false),
  "language": coalesce(language, "all"),
  "places": {
    "cards":  coalesce(places.cards,  true),
    "table":  coalesce(places.table,  true),
    "page":   coalesce(places.page,   true),
    "sticky": coalesce(places.sticky, true)
  },
  startAt, endAt
}`;

interface RawCta extends AssetCta {
  startAt?: string | null;
  endAt?: string | null;
}

const fetchAll = unstable_cache(
  async (): Promise<RawCta[]> => {
    if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return [];
    try {
      const docs: RawCta[] = await client.fetch(QUERY);
      return docs ?? [];
    } catch {
      // Витрина важнее кнопки: сорвавшийся запрос убирает рекламу,
      // но не роняет страницу с ценами.
      return [];
    }
  },
  ['asset-cta'],
  { revalidate: 3600, tags: [ASSET_CTA_TAG] },
);

function withinWindow(c: RawCta, now: number): boolean {
  if (c.startAt && Date.parse(c.startAt) > now) return false;
  if (c.endAt && Date.parse(c.endAt) < now) return false;
  return true;
}

/**
 * Карта «slug монеты → кнопка» для одного языка.
 *
 * Возвращает именно карту, а не список: и витрина, и страница монеты ищут по
 * slug, и Map избавляет их от перебора на каждой из двадцати четырёх карточек.
 */
export async function getAssetCtas(locale: string): Promise<Map<string, AssetCta>> {
  const docs = await fetchAll();
  const now = Date.now();
  const lang = locale === 'ru' ? 'ru' : 'en';
  const map = new Map<string, AssetCta>();
  for (const c of docs) {
    if (!withinWindow(c, now)) continue;
    if (c.language !== 'all' && c.language !== lang) continue;
    // Дубль по монете возможен: уникального индекса в базе нет. Берём первый
    // подходящий и не перетираем — порядок запроса стабилен.
    if (!map.has(c.coinSlug)) map.set(c.coinSlug, c);
  }
  return map;
}

/** Кнопка одной монеты. Для страницы монеты, где карта целиком не нужна. */
export async function getAssetCta(slug: string, locale: string): Promise<AssetCta | null> {
  return (await getAssetCtas(locale)).get(slug) ?? null;
}
