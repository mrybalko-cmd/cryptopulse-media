'use server';

import { redirect } from 'next/navigation';
import { pragueInputToISO } from '@/lib/admin/timezone';
import { revalidateTag, revalidatePath } from 'next/cache';
import { requireAdminPermission } from '@/lib/admin/auth';
import { createNews, updateNews, deleteNews, duplicateNews, unpublishDocument, republishDocument, fetchAdminNewsById, uploadImageAsset, type NewsInput } from '@/lib/admin/data';
import { textToBlocks, type PortableTextBlock } from '@/lib/admin/portableText';
import { fetchDocumentHistory, restoreRevision } from '@/lib/admin/history';
import { logActivity } from '@/lib/admin/activityLog';

async function uploadIfPresent(formData: FormData, field: string): Promise<string | undefined> {
  const file = formData.get(field) as File | null;
  if (file && file.size > 0) return uploadImageAsset(file);
  return undefined;
}

async function uploadInlineImages(formData: FormData): Promise<Record<number, string>> {
  const entries: [number, Promise<string>][] = [];
  let i = 0;
  while (formData.has(`body_image_${i}`)) {
    const file = formData.get(`body_image_${i}`) as File | null;
    if (file && file.size > 0) entries.push([i, uploadImageAsset(file)]);
    i++;
  }
  const resolved = await Promise.all(entries.map(([, p]) => p));
  const map: Record<number, string> = {};
  entries.forEach(([idx], j) => { map[idx] = resolved[j]; });
  return map;
}

async function parseNewsInput(formData: FormData, originalBody: PortableTextBlock[] | undefined): Promise<NewsInput> {
  const publishedAtRaw = String(formData.get('publishedAt') || '');
  const pinnedUntilRaw = String(formData.get('pinnedUntil') || '');
  const intent = String(formData.get('intent') || '');
  const publishTiming = intent === 'draft' ? 'draft' : ((formData.get('publishTiming') as 'now' | 'scheduled') || 'now');
  const newImageAssetIds = await uploadInlineImages(formData);
  return {
    language: (formData.get('language') as 'ru' | 'en') || 'ru',
    title: String(formData.get('title') || ''),
    slug: String(formData.get('slug') || ''),
    excerpt: String(formData.get('excerpt') || ''),
    coverImageAlt: String(formData.get('coverImageAlt') || ''),
    publishTiming,
    publishedAt: pragueInputToISO(publishedAtRaw),
    body: textToBlocks(String(formData.get('body') || ''), originalBody, newImageAssetIds),
    sourceName: String(formData.get('sourceName') || ''),
    sourceUrl: String(formData.get('sourceUrl') || ''),
    seoFocusKeyphrase: String(formData.get('seoFocusKeyphrase') || ''),
    seoMetaTitle: String(formData.get('seoMetaTitle') || ''),
    seoMetaDescription: String(formData.get('seoMetaDescription') || ''),
    seoKeywords: formData.getAll('seoKeywords').map(String).filter(Boolean),
    seoCanonicalUrl: String(formData.get('seoCanonicalUrl') || ''),
    seoNoIndex: formData.get('seoNoIndex') === 'on',
    topic: String(formData.get('topic') || ''),
    ownBadge: formData.get('ownBadge') === 'on',
    badge: (formData.get('badge') as 'none' | 'promo' | 'companyNews') || 'none',
    breaking: formData.get('breaking') === 'on',
    pinnedUntil: pragueInputToISO(pinnedUntilRaw),
    authorId: String(formData.get('authorId') || ''),
    commentsEnabled: formData.get('commentsEnabled') === 'on',
    translationRefId: String(formData.get('translationRefId') || ''),
  };
}

export async function createNewsAction(formData: FormData) {
  await requireAdminPermission('news');
  const [input, coverImageAssetId, ogImageAssetId] = await Promise.all([
    parseNewsInput(formData, undefined),
    uploadIfPresent(formData, 'coverImage'),
    uploadIfPresent(formData, 'seoOgImage'),
  ]);
  const doc = await createNews(input, coverImageAssetId, ogImageAssetId);
  revalidateTag('news', { expire: 0 });
  redirect(`/admin/news/${doc._id}`);
}

export async function updateNewsAction(id: string, originalBody: PortableTextBlock[] | undefined, formData: FormData) {
  await requireAdminPermission('news');
  const [input, coverImageAssetId, ogImageAssetId] = await Promise.all([
    parseNewsInput(formData, originalBody),
    uploadIfPresent(formData, 'coverImage'),
    uploadIfPresent(formData, 'seoOgImage'),
  ]);
  await updateNews(id, input, coverImageAssetId, ogImageAssetId);
  revalidateTag('news', { expire: 0 });
  redirect(`/admin/news/${id}`);
}

export async function deleteNewsAction(id: string) {
  const session = await requireAdminPermission('news');
  const doc = await fetchAdminNewsById(id);
  await deleteNews(id);
  await logActivity(session, { action: 'delete', entityType: 'news', entityTitle: doc?.title ?? id, entityId: id });
  revalidateTag('news', { expire: 0 });
  redirect('/admin/news');
}

// List-row variants: the edit page binds the id into a closure, but a row in a
// list posts it, so these read it from the form and stay on the list instead of
// redirecting into the material.
export async function deleteNewsFromListAction(formData: FormData) {
  const session = await requireAdminPermission('news');
  const id = String(formData.get('id'));
  const doc = await fetchAdminNewsById(id);
  await deleteNews(id);
  await logActivity(session, { action: 'delete', entityType: 'news', entityTitle: doc?.title ?? id, entityId: id });
  revalidateTag('news', { expire: 0 });
  revalidatePath('/admin/news');
}

export async function unpublishNewsAction(formData: FormData) {
  const session = await requireAdminPermission('news');
  const id = String(formData.get('id'));
  const doc = await fetchAdminNewsById(id);
  await unpublishDocument(id);
  await logActivity(session, { action: 'unpublish', entityType: 'news', entityTitle: doc?.title ?? id, entityId: id });
  revalidateTag('news', { expire: 0 });
  revalidatePath('/admin/news');
}

export async function republishNewsAction(formData: FormData) {
  const session = await requireAdminPermission('news');
  const id = String(formData.get('id'));
  const doc = await fetchAdminNewsById(id);
  await republishDocument(id);
  await logActivity(session, { action: 'republish', entityType: 'news', entityTitle: doc?.title ?? id, entityId: id });
  revalidateTag('news', { expire: 0 });
  revalidatePath('/admin/news');
}

export async function getNewsHistoryAction(id: string) {
  await requireAdminPermission('news');
  return fetchDocumentHistory(id);
}

export async function restoreNewsRevisionAction(formData: FormData) {
  await requireAdminPermission('news');
  const id = String(formData.get('id'));
  const revisionId = String(formData.get('revisionId'));
  await restoreRevision(id, revisionId);
  revalidateTag('news', { expire: 0 });
  redirect(`/admin/news/${id}`);
}

export async function duplicateNewsAction(formData: FormData) {
  await requireAdminPermission('news');
  const id = String(formData.get('id'));
  const newId = await duplicateNews(id);
  revalidateTag('news', { expire: 0 });
  redirect(`/admin/news/${newId}`);
}
