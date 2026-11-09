'use server';

import { redirect } from 'next/navigation';
import { revalidateTag } from 'next/cache';
import { requireAdminPermission } from '@/lib/admin/auth';
import {
  createExchange,
  updateExchange,
  deleteExchange,
  fetchAdminExchangeById,
  uploadImageAsset,
  type ExchangeInput,
  type ExchangeProductItem,
  type ExchangeBadgeItem,
  type ExchangeRegionItem,
} from '@/lib/admin/data';
import { textToBlocks, type PortableTextBlock } from '@/lib/admin/portableText';
import { logActivity } from '@/lib/admin/activityLog';
import { venueButtonColor } from '@/lib/exchangePlacements';
import { BROKER_LOCALIZED_KEYS, type BrokerLocalizedFields, type BrokerRegulator } from '@/lib/brokerFields';
import { EXCHANGE_PASSPORT_KEYS, type ExchangePassportText } from '@/lib/exchangePassport';

async function parseProducts(
  formData: FormData
): Promise<(ExchangeProductItem & { imageAssetId?: string })[]> {
  const rows: { nameRu: string; nameEn: string; shortRu?: string; shortEn?: string; longRu?: string; longEn?: string; file: File | null; existingRef?: string }[] = [];
  let i = 0;
  while (formData.has(`product_nameRu_${i}`) || formData.has(`product_nameEn_${i}`)) {
    const nameRu = String(formData.get(`product_nameRu_${i}`) || '').trim();
    const nameEn = String(formData.get(`product_nameEn_${i}`) || '').trim();
    if (nameRu || nameEn) {
      rows.push({
        nameRu,
        nameEn,
        shortRu: String(formData.get(`product_shortRu_${i}`) || '') || undefined,
        shortEn: String(formData.get(`product_shortEn_${i}`) || '') || undefined,
        longRu: String(formData.get(`product_longRu_${i}`) || '') || undefined,
        longEn: String(formData.get(`product_longEn_${i}`) || '') || undefined,
        file: formData.get(`product_image_${i}`) as File | null,
        existingRef: String(formData.get(`product_existingImageRef_${i}`) || '') || undefined,
      });
    }
    i++;
  }

  // Upload every row's new image concurrently instead of one-by-one.
  const imageAssetIds = await Promise.all(
    rows.map(row => (row.file && row.file.size > 0 ? uploadImageAsset(row.file) : Promise.resolve(row.existingRef)))
  );

  return rows.map((row, idx) => ({
    image: null,
    imageAssetRef: null,
    nameRu: row.nameRu,
    nameEn: row.nameEn,
    shortRu: row.shortRu,
    shortEn: row.shortEn,
    longRu: row.longRu,
    longEn: row.longEn,
    imageAssetId: imageAssetIds[idx],
  }));
}

function parseRegulators(formData: FormData): BrokerRegulator[] {
  const rows: BrokerRegulator[] = [];
  const indexes = [...formData.keys()]
    .map(key => key.match(/^regulator_name_(\d+)$/)?.[1])
    .filter((i): i is string => Boolean(i));
  for (const i of indexes) {
    const value = (field: string) => String(formData.get(`regulator_${field}_${i}`) || '').trim();
    if (!value('name')) continue;
    rows.push({
      name: value('name'),
      entity: value('entity'),
      licence: value('licence'),
      noteRu: value('noteRu'),
      noteEn: value('noteEn'),
      url: value('url'),
      tier1: formData.get(`regulator_tier1_${i}`) === 'on',
    });
  }
  return rows;
}

function parseBadges(formData: FormData): ExchangeBadgeItem[] {
  const badges: ExchangeBadgeItem[] = [];
  let i = 0;
  while (formData.has(`badge_textRu_${i}`) || formData.has(`badge_textEn_${i}`)) {
    const textRu = String(formData.get(`badge_textRu_${i}`) || '').trim();
    const textEn = String(formData.get(`badge_textEn_${i}`) || '').trim();
    if (textRu || textEn) {
      badges.push({
        textRu,
        textEn,
        tone: String(formData.get(`badge_tone_${i}`) || 'off'),
        link: String(formData.get(`badge_link_${i}`) || '') || undefined,
      });
    }
    i++;
  }
  return badges;
}

function parseRegions(formData: FormData): ExchangeRegionItem[] {
  const regions: ExchangeRegionItem[] = [];
  let i = 0;
  while (formData.has(`region_regionRu_${i}`) || formData.has(`region_regionEn_${i}`)) {
    const regionRu = String(formData.get(`region_regionRu_${i}`) || '').trim();
    const regionEn = String(formData.get(`region_regionEn_${i}`) || '').trim();
    if (regionRu || regionEn) {
      regions.push({
        regionRu,
        regionEn,
        tone: String(formData.get(`region_tone_${i}`) || 'ok'),
        noteRu: String(formData.get(`region_noteRu_${i}`) || '') || undefined,
        noteEn: String(formData.get(`region_noteEn_${i}`) || '') || undefined,
      });
    }
    i++;
  }
  return regions;
}

async function parseExchangeInput(
  formData: FormData,
  originalDescriptionRu: PortableTextBlock[] | undefined,
  originalDescriptionEn: PortableTextBlock[] | undefined
): Promise<ExchangeInput> {
  const text = (name: string) => String(formData.get(name) || '').trim();
  // Срок вводится датой и действует до конца этого дня: время суток тут ни к чему.
  const term = (name: string) => (text(name) ? `${text(name)}T23:59:59.000Z` : undefined);
  const venueKind = text('venueKind') === 'broker' ? 'broker' as const : 'exchange' as const;
  return {
    venueKind,
    ...(venueKind === 'broker' ? {
      regulators: parseRegulators(formData),
      offersCoins: formData.get('offersCoins') === 'on',
      offersCfd: formData.get('offersCfd') === 'on',
      minDeposit: text('minDeposit'),
      lossPercent: text('lossPercent'),
      demoUrl: text('demoUrl'),
      verifiedAt: text('verifiedAt'),
      brokerText: Object.fromEntries(BROKER_LOCALIZED_KEYS.map(key => [key, text(key)])) as BrokerLocalizedFields,
    } : {
      verifiedAt: text('verifiedAt'),
      reservesUrl: text('reservesUrl'),
      passportText: Object.fromEntries(EXCHANGE_PASSPORT_KEYS.map(key => [key, text(key)])) as ExchangePassportText,
    }),
    name: String(formData.get('name') || ''),
    logoBg: String(formData.get('logoBg') || ''),
    slugRu: String(formData.get('slugRu') || ''),
    slugEn: String(formData.get('slugEn') || ''),
    foundedYear: formData.get('foundedYear') ? Number(formData.get('foundedYear')) : undefined,
    website: String(formData.get('website') || ''),
    linkLabel: String(formData.get('linkLabel') || ''),
    trackingUrl: String(formData.get('trackingUrl') || ''),
    tradeUrl: String(formData.get('tradeUrl') || ''),
    coingeckoId: String(formData.get('coingeckoId') || ''),
    type: formData.getAll('type').map(String),
    taglineRu: String(formData.get('taglineRu') || ''),
    taglineEn: String(formData.get('taglineEn') || ''),
    descriptionRu: textToBlocks(String(formData.get('descriptionRu') || ''), originalDescriptionRu),
    descriptionEn: textToBlocks(String(formData.get('descriptionEn') || ''), originalDescriptionEn),
    products: await parseProducts(formData),
    badges: parseBadges(formData),
    regions: parseRegions(formData),
    buttonColor: venueButtonColor(text('buttonColor')),
    tradeUntil: term('tradeUntil'),
    extendedEnabled: formData.get('extendedEnabled') === 'on',
    extendedUntil: term('extendedUntil'),
    extendedPerkRu: text('extendedPerkRu'),
    extendedPerkEn: text('extendedPerkEn'),
    extendedFactsRu: text('extendedFactsRu'),
    extendedFactsEn: text('extendedFactsEn'),
    extendedTradeUrl: text('extendedTradeUrl'),
    extendedBonusUrl: text('extendedBonusUrl'),
    extendedBonusLabelRu: text('extendedBonusLabelRu'),
    extendedBonusLabelEn: text('extendedBonusLabelEn'),
    extendedBannerId: text('extendedBannerId'),
    extendedStepsRu: text('extendedStepsRu'),
    extendedStepsEn: text('extendedStepsEn'),
    extendedFaqRu: text('extendedFaqRu'),
    extendedFaqEn: text('extendedFaqEn'),
    adEnabled: formData.get('adEnabled') === 'on',
    adUntil: term('adUntil'),
    adUrl: text('adUrl'),
    adTextRu: text('adTextRu'),
    adTextEn: text('adTextEn'),
    adOfferRu: text('adOfferRu'),
    adOfferEn: text('adOfferEn'),
    adOfferNoteRu: text('adOfferNoteRu'),
    adOfferNoteEn: text('adOfferNoteEn'),
    adButtonRu: text('adButtonRu'),
    adButtonEn: text('adButtonEn'),
    reviewsEnabled: formData.get('reviewsEnabled') === 'on',
    seoMetaTitleRu: String(formData.get('seoMetaTitleRu') || ''),
    seoMetaTitleEn: String(formData.get('seoMetaTitleEn') || ''),
    seoMetaDescriptionRu: String(formData.get('seoMetaDescriptionRu') || ''),
    seoMetaDescriptionEn: String(formData.get('seoMetaDescriptionEn') || ''),
    seoNoIndex: formData.get('seoNoIndex') === 'on',
  };
}

export async function createExchangeAction(formData: FormData) {
  await requireAdminPermission('exchanges');
  const logoFile = formData.get('logo') as File | null;
  const coverFile = formData.get('extendedCover') as File | null;
  const [input, logoAssetId, coverAssetId] = await Promise.all([
    parseExchangeInput(formData, undefined, undefined),
    logoFile && logoFile.size > 0 ? uploadImageAsset(logoFile) : Promise.resolve(undefined),
    coverFile && coverFile.size > 0 ? uploadImageAsset(coverFile) : Promise.resolve(undefined),
  ]);
  const doc = await createExchange(input, logoAssetId, coverAssetId);
  revalidateTag('exchanges', { expire: 0 });
  redirect(`/admin/exchanges/${doc._id}?saved=1`);
}

export async function updateExchangeAction(
  id: string,
  originalDescriptionRu: PortableTextBlock[] | undefined,
  originalDescriptionEn: PortableTextBlock[] | undefined,
  formData: FormData
) {
  await requireAdminPermission('exchanges');
  const logoFile = formData.get('logo') as File | null;
  const coverFile = formData.get('extendedCover') as File | null;
  const [input, logoAssetId, coverAssetId] = await Promise.all([
    parseExchangeInput(formData, originalDescriptionRu, originalDescriptionEn),
    logoFile && logoFile.size > 0 ? uploadImageAsset(logoFile) : Promise.resolve(undefined),
    coverFile && coverFile.size > 0 ? uploadImageAsset(coverFile) : Promise.resolve(undefined),
  ]);
  await updateExchange(id, input, logoAssetId, coverAssetId);
  revalidateTag('exchanges', { expire: 0 });
  redirect(`/admin/exchanges/${id}?saved=1`);
}

export async function deleteExchangeAction(id: string) {
  const session = await requireAdminPermission('exchanges');
  const doc = await fetchAdminExchangeById(id);
  await deleteExchange(id);
  await logActivity(session, { action: 'delete', entityType: 'exchange', entityTitle: doc?.name ?? id, entityId: id });
  revalidateTag('exchanges', { expire: 0 });
  redirect('/admin/exchanges');
}
