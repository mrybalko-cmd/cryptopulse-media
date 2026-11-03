'use server';

import { redirect } from 'next/navigation';
import { revalidateTag } from 'next/cache';
import { pragueInputToISO } from '@/lib/admin/timezone';
import { requireAdminPermission } from '@/lib/admin/auth';
import { createBanner, updateBanner, uploadImageAsset, setPlacementActive, type BannerInput } from '@/lib/admin/data';

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
  const doc = await createBanner({ ...input, imageAssetId });
  publishBanners();
  // На список не уводим: форма возвращается с отметкой о сохранении, иначе
  // редактор не понимает, сработала кнопка или нет, и жмёт её второй раз.
  redirect(`/admin/banners/${doc._id}?saved=1`);
}

export async function updateBannerAction(id: string, formData: FormData) {
  await requireAdminPermission('banners');
  const input = parseInput(formData);
  const imageFile = formData.get('image') as File | null;
  const imageAssetId = imageFile && imageFile.size > 0 ? await uploadImageAsset(imageFile) : undefined;
  await updateBanner(id, { ...input, imageAssetId });
  publishBanners();
  redirect(`/admin/banners/${id}?saved=1`);
}

/**
 * Куда вернуться после нажатия: только внутрь своего раздела, иначе
 * подставной back из формы уводил бы куда угодно.
 */
function backTo(raw: FormDataEntryValue | null, base: string, toggled: 'stopped' | 'resumed', name: string) {
  const back = String(raw || '');
  const path = back === base || back.startsWith(`${base}/`) || back.startsWith(`${base}?`) ? back : base;
  const url = new URL(path, 'http://x');
  url.searchParams.delete('saved');
  url.searchParams.set('toggled', toggled);
  url.searchParams.set('name', name);
  return `${url.pathname}${url.search}`;
}

/** Кнопка «Остановить / Возобновить». Показы и клики не трогает. */
export async function toggleBannerAction(formData: FormData) {
  await requireAdminPermission('banners');
  const id = String(formData.get('id') || '');
  const active = formData.get('active') === 'true';
  await setPlacementActive('sidebarBanner', id, active);
  publishBanners();
  redirect(backTo(formData.get('back'), '/admin/banners', active ? 'resumed' : 'stopped', String(formData.get('name') || '')));
}
