'use server';

import { redirect } from 'next/navigation';
import { requireAdminPermission } from '@/lib/admin/auth';
import { createAuthor, updateAuthor, deleteAuthor, uploadImageAsset, type AuthorInput } from '@/lib/admin/data';

function parseInput(formData: FormData): AuthorInput {
  return {
    name: String(formData.get('name') || ''),
    slug: String(formData.get('slug') || ''),
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

export async function createAuthorAction(formData: FormData) {
  await requireAdminPermission('authors');
  const input = parseInput(formData);
  const photoFile = formData.get('photo') as File | null;
  const photoAssetId = photoFile && photoFile.size > 0 ? await uploadImageAsset(photoFile) : undefined;
  const doc = await createAuthor(input, photoAssetId);
  redirect(`/admin/authors/${doc._id}`);
}

export async function updateAuthorAction(id: string, formData: FormData) {
  await requireAdminPermission('authors');
  const input = parseInput(formData);
  const photoFile = formData.get('photo') as File | null;
  const photoAssetId = photoFile && photoFile.size > 0 ? await uploadImageAsset(photoFile) : undefined;
  await updateAuthor(id, input, photoAssetId);
  redirect(`/admin/authors/${id}`);
}

export async function deleteAuthorAction(id: string) {
  await requireAdminPermission('authors');
  await deleteAuthor(id);
  redirect('/admin/authors');
}
