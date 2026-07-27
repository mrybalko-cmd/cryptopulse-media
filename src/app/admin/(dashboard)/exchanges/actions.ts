'use server';

import { redirect } from 'next/navigation';
import { revalidateTag } from 'next/cache';
import { requireAdminPermission } from '@/lib/admin/auth';
import {
  createExchange,
  updateExchange,
  deleteExchange,
  uploadImageAsset,
  type ExchangeInput,
  type ExchangeProductItem,
  type ExchangeBadgeItem,
  type ExchangeRegionItem,
} from '@/lib/admin/data';
import { textToBlocks, type PortableTextBlock } from '@/lib/admin/portableText';

async function parseProducts(
  formData: FormData,
  originalProducts: ExchangeProductItem[] | undefined
): Promise<(ExchangeProductItem & { imageAssetId?: string })[]> {
  const products: (ExchangeProductItem & { imageAssetId?: string })[] = [];
  let i = 0;
  while (formData.has(`product_nameRu_${i}`) || formData.has(`product_nameEn_${i}`)) {
    const nameRu = String(formData.get(`product_nameRu_${i}`) || '').trim();
    const nameEn = String(formData.get(`product_nameEn_${i}`) || '').trim();
    if (!nameRu && !nameEn) {
      i++;
      continue;
    }
    const file = formData.get(`product_image_${i}`) as File | null;
    let imageAssetId: string | undefined;
    if (file && file.size > 0) {
      imageAssetId = await uploadImageAsset(file);
    } else {
      imageAssetId = originalProducts?.[i]?.imageAssetRef ?? undefined;
    }
    products.push({
      image: null,
      imageAssetRef: null,
      nameRu,
      nameEn,
      shortRu: String(formData.get(`product_shortRu_${i}`) || '') || undefined,
      shortEn: String(formData.get(`product_shortEn_${i}`) || '') || undefined,
      longRu: String(formData.get(`product_longRu_${i}`) || '') || undefined,
      longEn: String(formData.get(`product_longEn_${i}`) || '') || undefined,
      imageAssetId,
    });
    i++;
  }
  return products;
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
  originalDescriptionEn: PortableTextBlock[] | undefined,
  originalProducts: ExchangeProductItem[] | undefined
): Promise<ExchangeInput> {
  const pinUntilRaw = String(formData.get('pinUntil') || '');
  return {
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
    products: await parseProducts(formData, originalProducts),
    badges: parseBadges(formData),
    regions: parseRegions(formData),
    pinned: formData.get('pinned') === 'on',
    pinPosition: formData.get('pinPosition') ? Number(formData.get('pinPosition')) : undefined,
    pinUntil: pinUntilRaw ? new Date(pinUntilRaw).toISOString() : undefined,
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
  const input = await parseExchangeInput(formData, undefined, undefined, undefined);
  const logoFile = formData.get('logo') as File | null;
  const logoAssetId = logoFile && logoFile.size > 0 ? await uploadImageAsset(logoFile) : undefined;
  const doc = await createExchange(input, logoAssetId);
  revalidateTag('exchanges', { expire: 0 });
  redirect(`/admin/exchanges/${doc._id}`);
}

export async function updateExchangeAction(
  id: string,
  originalDescriptionRu: PortableTextBlock[] | undefined,
  originalDescriptionEn: PortableTextBlock[] | undefined,
  originalProducts: ExchangeProductItem[] | undefined,
  formData: FormData
) {
  await requireAdminPermission('exchanges');
  const input = await parseExchangeInput(formData, originalDescriptionRu, originalDescriptionEn, originalProducts);
  const logoFile = formData.get('logo') as File | null;
  const logoAssetId = logoFile && logoFile.size > 0 ? await uploadImageAsset(logoFile) : undefined;
  await updateExchange(id, input, logoAssetId);
  revalidateTag('exchanges', { expire: 0 });
  redirect(`/admin/exchanges/${id}`);
}

export async function deleteExchangeAction(id: string) {
  await requireAdminPermission('exchanges');
  await deleteExchange(id);
  revalidateTag('exchanges', { expire: 0 });
  redirect('/admin/exchanges');
}
