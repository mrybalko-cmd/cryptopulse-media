'use server';

import { redirect } from 'next/navigation';
import { revalidateTag } from 'next/cache';
import { requireAdminPermission } from '@/lib/admin/auth';
import { createArticle, updateArticle, deleteArticle, uploadImageAsset, type ArticleInput } from '@/lib/admin/data';
import { textToBlocks, type PortableTextBlock } from '@/lib/admin/portableText';
import { fetchDocumentHistory, restoreRevision } from '@/lib/admin/history';

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

async function parseArticleInput(formData: FormData, originalBody: PortableTextBlock[] | undefined): Promise<ArticleInput> {
  const publishedAtRaw = String(formData.get('publishedAt') || '');
  const readingTimeRaw = String(formData.get('readingTime') || '');
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
    publishedAt: publishedAtRaw ? new Date(publishedAtRaw).toISOString() : undefined,
    readingTime: readingTimeRaw ? Number(readingTimeRaw) : undefined,
    topic: String(formData.get('topic') || ''),
    badge: String(formData.get('badge') || 'none'),
    ownBadge: formData.get('ownBadge') === 'on',
    body: textToBlocks(String(formData.get('body') || ''), originalBody, newImageAssetIds),
    seoFocusKeyphrase: String(formData.get('seoFocusKeyphrase') || ''),
    seoMetaTitle: String(formData.get('seoMetaTitle') || ''),
    seoMetaDescription: String(formData.get('seoMetaDescription') || ''),
    seoKeywords: formData.getAll('seoKeywords').map(String).filter(Boolean),
    seoSchemaType: String(formData.get('seoSchemaType') || 'BlogPosting'),
    seoCanonicalUrl: String(formData.get('seoCanonicalUrl') || ''),
    seoNoIndex: formData.get('seoNoIndex') === 'on',
    authorId: String(formData.get('authorId') || ''),
    commentsEnabled: formData.get('commentsEnabled') === 'on',
    translationRefId: String(formData.get('translationRefId') || ''),
  };
}

export async function createArticleAction(formData: FormData) {
  await requireAdminPermission('articles');
  const [input, coverImageAssetId, ogImageAssetId] = await Promise.all([
    parseArticleInput(formData, undefined),
    uploadIfPresent(formData, 'coverImage'),
    uploadIfPresent(formData, 'seoOgImage'),
  ]);
  const doc = await createArticle(input, coverImageAssetId, ogImageAssetId);
  revalidateTag('articles', { expire: 0 });
  redirect(`/admin/articles/${doc._id}`);
}

export async function updateArticleAction(id: string, originalBody: PortableTextBlock[] | undefined, formData: FormData) {
  await requireAdminPermission('articles');
  const [input, coverImageAssetId, ogImageAssetId] = await Promise.all([
    parseArticleInput(formData, originalBody),
    uploadIfPresent(formData, 'coverImage'),
    uploadIfPresent(formData, 'seoOgImage'),
  ]);
  await updateArticle(id, input, coverImageAssetId, ogImageAssetId);
  revalidateTag('articles', { expire: 0 });
  redirect(`/admin/articles/${id}`);
}

export async function deleteArticleAction(id: string) {
  await requireAdminPermission('articles');
  await deleteArticle(id);
  revalidateTag('articles', { expire: 0 });
  redirect('/admin/articles');
}

export async function getArticleHistoryAction(id: string) {
  await requireAdminPermission('articles');
  return fetchDocumentHistory(id);
}

export async function restoreArticleRevisionAction(formData: FormData) {
  await requireAdminPermission('articles');
  const id = String(formData.get('id'));
  const revisionId = String(formData.get('revisionId'));
  await restoreRevision(id, revisionId);
  revalidateTag('articles', { expire: 0 });
  redirect(`/admin/articles/${id}`);
}
