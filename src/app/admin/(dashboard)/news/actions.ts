'use server';

import { redirect } from 'next/navigation';
import { revalidateTag } from 'next/cache';
import { requireAdminPermission } from '@/lib/admin/auth';
import { createNews, updateNews, deleteNews, uploadImageAsset, type NewsInput } from '@/lib/admin/data';
import { textToBlocks, type PortableTextBlock } from '@/lib/admin/portableText';

function parseNewsInput(formData: FormData, originalBody: PortableTextBlock[] | undefined): NewsInput {
  const publishedAtRaw = String(formData.get('publishedAt') || '');
  const pinnedUntilRaw = String(formData.get('pinnedUntil') || '');
  return {
    language: (formData.get('language') as 'ru' | 'en') || 'ru',
    title: String(formData.get('title') || ''),
    slug: String(formData.get('slug') || ''),
    excerpt: String(formData.get('excerpt') || ''),
    coverImageAlt: String(formData.get('coverImageAlt') || ''),
    publishTiming: (formData.get('publishTiming') as 'now' | 'scheduled') || 'now',
    publishedAt: publishedAtRaw ? new Date(publishedAtRaw).toISOString() : undefined,
    body: textToBlocks(String(formData.get('body') || ''), originalBody),
    sourceName: String(formData.get('sourceName') || ''),
    sourceUrl: String(formData.get('sourceUrl') || ''),
    seoFocusKeyphrase: String(formData.get('seoFocusKeyphrase') || ''),
    seoMetaTitle: String(formData.get('seoMetaTitle') || ''),
    seoMetaDescription: String(formData.get('seoMetaDescription') || ''),
    seoKeywords: String(formData.get('seoKeywords') || '').split(',').map(s => s.trim()).filter(Boolean),
    seoCanonicalUrl: String(formData.get('seoCanonicalUrl') || ''),
    seoNoIndex: formData.get('seoNoIndex') === 'on',
    topic: String(formData.get('topic') || ''),
    ownBadge: formData.get('ownBadge') === 'on',
    badge: (formData.get('badge') as 'none' | 'promo' | 'companyNews') || 'none',
    breaking: formData.get('breaking') === 'on',
    pinnedUntil: pinnedUntilRaw ? new Date(pinnedUntilRaw).toISOString() : undefined,
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

export async function createNewsAction(formData: FormData) {
  await requireAdminPermission('news');
  const input = parseNewsInput(formData, undefined);
  const coverImageAssetId = await uploadIfPresent(formData, 'coverImage');
  const ogImageAssetId = await uploadIfPresent(formData, 'seoOgImage');
  const doc = await createNews(input, coverImageAssetId, ogImageAssetId);
  revalidateTag('news', { expire: 0 });
  redirect(`/admin/news/${doc._id}`);
}

export async function updateNewsAction(id: string, originalBody: PortableTextBlock[] | undefined, formData: FormData) {
  await requireAdminPermission('news');
  const input = parseNewsInput(formData, originalBody);
  const coverImageAssetId = await uploadIfPresent(formData, 'coverImage');
  const ogImageAssetId = await uploadIfPresent(formData, 'seoOgImage');
  await updateNews(id, input, coverImageAssetId, ogImageAssetId);
  revalidateTag('news', { expire: 0 });
  redirect(`/admin/news/${id}`);
}

export async function deleteNewsAction(id: string) {
  await requireAdminPermission('news');
  await deleteNews(id);
  revalidateTag('news', { expire: 0 });
  redirect('/admin/news');
}
