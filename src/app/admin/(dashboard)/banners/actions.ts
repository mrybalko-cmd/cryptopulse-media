'use server';

import { redirect } from 'next/navigation';
import { pragueInputToISO } from '@/lib/admin/timezone';
import { requireAdminPermission } from '@/lib/admin/auth';
import { createBanner, updateBanner, uploadImageAsset, type BannerInput } from '@/lib/admin/data';

function parseInput(formData: FormData): Omit<BannerInput, 'imageAssetId'> {
  return {
    title: String(formData.get('title') || ''),
    altText: String(formData.get('altText') || ''),
    link: String(formData.get('link') || ''),
    language: (formData.get('language') as BannerInput['language']) || 'all',
    weight: Number(formData.get('weight')) || 1,
    startAt: pragueInputToISO(String(formData.get('startAt') || '')),
    endAt: pragueInputToISO(String(formData.get('endAt') || '')),
    active: formData.get('active') === 'on',
  };
}

export async function createBannerAction(formData: FormData) {
  await requireAdminPermission('banners');
  const input = parseInput(formData);
  const imageFile = formData.get('image') as File | null;
  const imageAssetId = imageFile && imageFile.size > 0 ? await uploadImageAsset(imageFile) : undefined;
  await createBanner({ ...input, imageAssetId });
  redirect('/admin/banners');
}

export async function updateBannerAction(id: string, formData: FormData) {
  await requireAdminPermission('banners');
  const input = parseInput(formData);
  const imageFile = formData.get('image') as File | null;
  const imageAssetId = imageFile && imageFile.size > 0 ? await uploadImageAsset(imageFile) : undefined;
  await updateBanner(id, { ...input, imageAssetId });
  redirect('/admin/banners');
}
