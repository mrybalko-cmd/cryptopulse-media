'use server';

import { redirect } from 'next/navigation';
import { revalidateTag } from 'next/cache';
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

/**
 * Сбросить баннеры по всему сайту.
 *
 * Раньше раздел не сбрасывал ничего, и новый баннер доезжал сам за пять минут.
 * После того как окно обновления архивных страниц подняли до часа, это стало
 * ощутимо: размещение, за которое заплатили, появлялось бы через час.
 *
 * Сброс помечает устаревшими все страницы с баннером, то есть почти весь
 * сайт, и они пересоберутся по мере обхода. Для баннеров это нормально: их
 * меняют несколько раз в месяц, а не пять раз в сутки, как публикации, —
 * ради которых «Популярное» и отцепили от тегов новостей.
 */
function publishBanners() {
  revalidateTag('banners', { expire: 0 });
}


export async function createBannerAction(formData: FormData) {
  await requireAdminPermission('banners');
  const input = parseInput(formData);
  const imageFile = formData.get('image') as File | null;
  const imageAssetId = imageFile && imageFile.size > 0 ? await uploadImageAsset(imageFile) : undefined;
  await createBanner({ ...input, imageAssetId });
  publishBanners();
  redirect('/admin/banners');
}

export async function updateBannerAction(id: string, formData: FormData) {
  await requireAdminPermission('banners');
  const input = parseInput(formData);
  const imageFile = formData.get('image') as File | null;
  const imageAssetId = imageFile && imageFile.size > 0 ? await uploadImageAsset(imageFile) : undefined;
  await updateBanner(id, { ...input, imageAssetId });
  publishBanners();
  redirect('/admin/banners');
}
