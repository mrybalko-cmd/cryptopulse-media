'use server';

import { redirect } from 'next/navigation';
import { revalidateTag } from 'next/cache';
import { pragueInputToISO } from '@/lib/admin/timezone';
import { requireAdminPermission } from '@/lib/admin/auth';
import {
  createBanner, updateBanner, uploadImageAsset, setPlacementActive, fetchAdminBannerById,
  countLiveBanners, bannerLiveNow, type BannerInput,
} from '@/lib/admin/data';
import { BANNER_ROTATION_LIMIT } from '@/lib/sanity';

function parseInput(formData: FormData): Omit<BannerInput, 'imageAssetId' | 'mobileImageAssetId'> {
  const placement = formData.get('placement') === 'inline' ? 'inline' : 'sidebar';
  const ct = formData.get('contentTypes');
  return {
    title: String(formData.get('title') || ''),
    placement,
    contentTypes: ct === 'news' || ct === 'article' ? ct : 'all',
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


async function uploadIfAny(formData: FormData, field: string) {
  const file = formData.get(field) as File | null;
  return file && file.size > 0 ? uploadImageAsset(file) : undefined;
}

/**
 * Пятёрка ротации полна: включаемый баннер сохраняется остановленным, а форма
 * возвращается с объяснением. Иначе сайт молча показывал бы пять самых новых,
 * и один из оплаченных выпадал бы без всякого следа в админке.
 */
async function rotationFull(input: { placement: BannerInput['placement']; active: boolean; startAt?: string; endAt?: string }, exceptId?: string) {
  if (!bannerLiveNow(input)) return false;
  return (await countLiveBanners(input.placement, exceptId)) >= BANNER_ROTATION_LIMIT;
}

export async function createBannerAction(formData: FormData) {
  await requireAdminPermission('banners');
  const input = parseInput(formData);
  const full = await rotationFull(input);
  const imageAssetId = await uploadIfAny(formData, 'image');
  const mobileImageAssetId = input.placement === 'inline' ? await uploadIfAny(formData, 'mobileImage') : undefined;
  const doc = await createBanner({ ...input, active: full ? false : input.active, imageAssetId, mobileImageAssetId });
  publishBanners();
  // На список не уводим: форма возвращается с отметкой о сохранении, иначе
  // редактор не понимает, сработала кнопка или нет, и жмёт её второй раз.
  redirect(`/admin/banners/${doc._id}?saved=1${full ? '&full=1' : ''}`);
}

export async function updateBannerAction(id: string, formData: FormData) {
  await requireAdminPermission('banners');
  const input = parseInput(formData);
  const full = await rotationFull(input, id);
  const imageAssetId = await uploadIfAny(formData, 'image');
  const mobileImageAssetId = input.placement === 'inline' ? await uploadIfAny(formData, 'mobileImage') : undefined;
  await updateBanner(id, { ...input, active: full ? false : input.active, imageAssetId, mobileImageAssetId });
  publishBanners();
  redirect(`/admin/banners/${id}?saved=1${full ? '&full=1' : ''}`);
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
  if (active) {
    const doc = await fetchAdminBannerById(id);
    if (doc && (await rotationFull({ ...doc, active: true }, id))) {
      const back = String(formData.get('back') || '/admin/banners');
      redirect(`${back.startsWith('/admin/banners') ? back.split('?')[0] : '/admin/banners'}?full=1`);
    }
  }
  await setPlacementActive('sidebarBanner', id, active);
  publishBanners();
  redirect(backTo(formData.get('back'), '/admin/banners', active ? 'resumed' : 'stopped', String(formData.get('name') || '')));
}
