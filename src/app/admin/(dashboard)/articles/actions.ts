'use server';

import { redirect } from 'next/navigation';
import { revalidateTag } from 'next/cache';
import { requireAdminPermission } from '@/lib/admin/auth';
import { createArticle, updateArticle, deleteArticle, uploadImageAsset, type ArticleInput } from '@/lib/admin/data';
import { textToBlocks, type PortableTextBlock } from '@/lib/admin/portableText';

function parseArticleInput(formData: FormData, originalBody: PortableTextBlock[] | undefined): ArticleInput {
  const publishedAtRaw = String(formData.get('publishedAt') || '');
  const readingTimeRaw = String(formData.get('readingTime') || '');
  return {
    language: (formData.get('language') as 'ru' | 'en') || 'ru',
    title: String(formData.get('title') || ''),
    slug: String(formData.get('slug') || ''),
    excerpt: String(formData.get('excerpt') || ''),
    coverImageAlt: String(formData.get('coverImageAlt') || ''),
    publishTiming: (formData.get('publishTiming') as 'now' | 'scheduled') || 'now',
    publishedAt: publishedAtRaw ? new Date(publishedAtRaw).toISOString() : undefined,
    readingTime: readingTimeRaw ? Number(readingTimeRaw) : undefined,
    topic: String(formData.get('topic') || ''),
    badge: String(formData.get('badge') || 'none'),
    body: textToBlocks(String(formData.get('body') || ''), originalBody),
    seoFocusKeyphrase: String(formData.get('seoFocusKeyphrase') || ''),
    seoMetaTitle: String(formData.get('seoMetaTitle') || ''),
    seoMetaDescription: String(formData.get('seoMetaDescription') || ''),
    seoKeywords: String(formData.get('seoKeywords') || '').split(',').map(s => s.trim()).filter(Boolean),
    seoSchemaType: String(formData.get('seoSchemaType') || 'BlogPosting'),
    seoCanonicalUrl: String(formData.get('seoCanonicalUrl') || ''),
    seoNoIndex: formData.get('seoNoIndex') === 'on',
    authorId: String(formData.get('authorId') || ''),
    commentsEnabled: formData.get('commentsEnabled') === 'on',
    translationRefId: String(formData.get('translationRefId') || ''),
  };
}

async function uploadIfPresent(formData: FormData, field: string): Promise<string | undefined> {
  const file = formData.get(field) as File | null;
  if (file && file.size > 0) return uploadImageAsset(file);
  return undefined;
}

export async function createArticleAction(formData: FormData) {
  await requireAdminPermission('articles');
  const input = parseArticleInput(formData, undefined);
  const coverImageAssetId = await uploadIfPresent(formData, 'coverImage');
  const ogImageAssetId = await uploadIfPresent(formData, 'seoOgImage');
  const doc = await createArticle(input, coverImageAssetId, ogImageAssetId);
  revalidateTag('articles', { expire: 0 });
  redirect(`/admin/articles/${doc._id}`);
}

export async function updateArticleAction(id: string, originalBody: PortableTextBlock[] | undefined, formData: FormData) {
  await requireAdminPermission('articles');
  const input = parseArticleInput(formData, originalBody);
  const coverImageAssetId = await uploadIfPresent(formData, 'coverImage');
  const ogImageAssetId = await uploadIfPresent(formData, 'seoOgImage');
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
