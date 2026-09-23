'use server';

import { redirect } from 'next/navigation';
import { revalidatePath, revalidateTag } from 'next/cache';
import { requireAdminPermission } from '@/lib/admin/auth';
import { createAuthor, updateAuthor, deleteAuthor, fetchAdminAuthorById, uploadImageAsset, type AuthorInput } from '@/lib/admin/data';
import { logActivity } from '@/lib/admin/activityLog';

function parseInput(formData: FormData): AuthorInput {
  return {
    name: String(formData.get('name') || ''),
    slug: String(formData.get('slug') || ''),
    firstNameRu: String(formData.get('firstNameRu') || ''),
    lastNameRu: String(formData.get('lastNameRu') || ''),
    firstNameEn: String(formData.get('firstNameEn') || ''),
    lastNameEn: String(formData.get('lastNameEn') || ''),
    hidden: formData.get('hidden') === 'on',
    instagram: String(formData.get('instagram') || ''),
    website: String(formData.get('website') || ''),
    roleRu: String(formData.get('roleRu') || ''),
    roleEn: String(formData.get('roleEn') || ''),
    bioRu: String(formData.get('bioRu') || ''),
    bioEn: String(formData.get('bioEn') || ''),
    telegram: String(formData.get('telegram') || ''),
    linkedin: String(formData.get('linkedin') || ''),
    facebook: String(formData.get('facebook') || ''),
    twitter: String(formData.get('twitter') || ''),
    email: String(formData.get('email') || ''),
  };
}

/**
 * Сбросить всё, где видно автора.
 *
 * Без этого правка доезжала до сайта только сама, по истечении кэша: данные
 * лежат 5 минут, а страница отдаётся протухшей ещё час. 23.09.2026 автора
 * скрыли в админке, а он остался в списке на сайте — ровно из-за этого.
 * Тот же механизм неделей раньше держал закэшированный 404 на материале,
 * который уже вышел.
 *
 * Тег `homeSettings` тоже нужен: подборка на главной вшивает поля автора
 * внутрь себя, включая признак скрытия, и своего тега у неё нет.
 */
function publishAuthors(slug?: string) {
  revalidateTag('authors', { expire: 0 });
  revalidateTag('homeSettings', { expire: 0 });
  for (const locale of ['ru', 'en']) {
    revalidatePath(`/${locale}/authors`);
    revalidatePath(`/${locale}`);
    if (slug) revalidatePath(`/${locale}/authors/${slug}`);
  }
  // Скрытые уходят из карты сайта, а она пересобирается раз в час.
  revalidatePath('/sitemap.xml');
}


export async function createAuthorAction(formData: FormData) {
  await requireAdminPermission('authors');
  const input = parseInput(formData);
  const photoFile = formData.get('photo') as File | null;
  const photoAssetId = photoFile && photoFile.size > 0 ? await uploadImageAsset(photoFile) : undefined;
  const doc = await createAuthor(input, photoAssetId);
  publishAuthors(input.slug);
  redirect(`/admin/authors/${doc._id}?saved=1`);
}

export async function updateAuthorAction(id: string, formData: FormData) {
  await requireAdminPermission('authors');
  const input = parseInput(formData);
  const photoFile = formData.get('photo') as File | null;
  const photoAssetId = photoFile && photoFile.size > 0 ? await uploadImageAsset(photoFile) : undefined;
  // Старый slug тоже сбрасываем: если его поменяли, прежний адрес обязан
  // перестать отдавать страницу из кэша.
  const before = await fetchAdminAuthorById(id);
  await updateAuthor(id, input, photoAssetId);
  publishAuthors(input.slug);
  if (before?.slug && before.slug !== input.slug) publishAuthors(before.slug);
  redirect(`/admin/authors/${id}?saved=1`);
}

export async function deleteAuthorAction(id: string) {
  const session = await requireAdminPermission('authors');
  const doc = await fetchAdminAuthorById(id);
  await deleteAuthor(id);
  await logActivity(session, { action: 'delete', entityType: 'author', entityTitle: doc?.name ?? id, entityId: id });
  publishAuthors(doc?.slug);
  redirect('/admin/authors');
}
