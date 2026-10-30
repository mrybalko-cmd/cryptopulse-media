'use server';

import { redirect } from 'next/navigation';
import { revalidateTag } from 'next/cache';
import { pragueInputToISO } from '@/lib/admin/timezone';
import { requireAdminPermission } from '@/lib/admin/auth';
import {
  createAssetCta, updateAssetCta, deleteAssetCta, assetCtaSlugTaken,
  type AssetCtaInput,
} from '@/lib/admin/data';
import { ASSET_CTA_TAG } from '@/lib/assetCta';

function parseInput(formData: FormData): AssetCtaInput {
  const str = (k: string) => String(formData.get(k) || '').trim();
  return {
    coinSlug: str('coinSlug'),
    active: formData.get('active') === 'on',
    mode: (formData.get('mode') as AssetCtaInput['mode']) || 'buy',
    labelRu: str('labelRu') || undefined,
    labelEn: str('labelEn') || undefined,
    url: str('url'),
    sellUrl: str('sellUrl') || undefined,
    partner: str('partner') || undefined,
    color: str('color') || undefined,
    showAdLabel: formData.get('showAdLabel') === 'on',
    language: (formData.get('language') as AssetCtaInput['language']) || 'all',
    places: {
      cards: formData.get('placeCards') === 'on',
      table: formData.get('placeTable') === 'on',
      page: formData.get('placePage') === 'on',
      sticky: formData.get('placeSticky') === 'on',
    },
    startAt: pragueInputToISO(str('startAt')),
    endAt: pragueInputToISO(str('endAt')),
  };
}

/**
 * Сбросить кнопки по всему разделу активов.
 *
 * Без этого правка доезжала бы до часа: и витрина, и страницы монет читают
 * кнопки через unstable_cache с этой меткой. Размещение, за которое
 * заплатили, появлялось бы через час после сохранения — ровно та дыра,
 * которую в баннерах уже закрыли.
 */
function publishCtas() {
  revalidateTag(ASSET_CTA_TAG, { expire: 0 });
}

export async function createAssetCtaAction(formData: FormData) {
  await requireAdminPermission('banners');
  const input = parseInput(formData);
  if (await assetCtaSlugTaken(input.coinSlug)) {
    redirect(`/admin/asset-cta/new?taken=${encodeURIComponent(input.coinSlug)}`);
  }
  const doc = await createAssetCta(input);
  publishCtas();
  redirect(`/admin/asset-cta/${doc._id}?saved=1`);
}

export async function updateAssetCtaAction(id: string, formData: FormData) {
  await requireAdminPermission('banners');
  const input = parseInput(formData);
  if (await assetCtaSlugTaken(input.coinSlug, id)) {
    redirect(`/admin/asset-cta/${id}?taken=${encodeURIComponent(input.coinSlug)}`);
  }
  await updateAssetCta(id, input);
  publishCtas();
  redirect(`/admin/asset-cta/${id}?saved=1`);
}

export async function deleteAssetCtaAction(formData: FormData) {
  await requireAdminPermission('banners');
  await deleteAssetCta(String(formData.get('id') || ''));
  publishCtas();
  redirect('/admin/asset-cta');
}
