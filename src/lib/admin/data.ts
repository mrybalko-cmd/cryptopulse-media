import { client, writeClient } from '@/lib/sanity';
import type { Permission } from './permissions';

// ---------------- Admin users ----------------

export interface AdminUserDoc {
  _id: string;
  name: string;
  email: string;
  passwordHash?: string;
  isOwner: boolean;
  permissions: Permission[];
  active: boolean;
  createdAt: string;
}

export async function fetchAdminUserByEmail(email: string): Promise<AdminUserDoc | null> {
  return client.fetch(
    `*[_type == "adminUser" && email == $email][0]{ _id, name, email, passwordHash, isOwner, permissions, active, createdAt }`,
    { email: email.toLowerCase().trim() }
  );
}

export async function fetchAdminUsers(): Promise<AdminUserDoc[]> {
  return client.fetch(
    `*[_type == "adminUser"] | order(createdAt asc){ _id, name, email, isOwner, permissions, active, createdAt }`
  );
}

export async function fetchAdminUserById(id: string): Promise<AdminUserDoc | null> {
  return client.fetch(`*[_type == "adminUser" && _id == $id][0]{ _id, name, email, isOwner, permissions, active, createdAt }`, { id });
}

export async function countAdminUsers(): Promise<number> {
  return client.fetch(`count(*[_type == "adminUser"])`);
}

export async function createAdminUser(input: {
  name: string;
  email: string;
  passwordHash: string;
  isOwner: boolean;
  permissions: Permission[];
}) {
  return writeClient.create({
    _type: 'adminUser',
    name: input.name,
    email: input.email.toLowerCase().trim(),
    passwordHash: input.passwordHash,
    isOwner: input.isOwner,
    permissions: input.isOwner ? [] : input.permissions,
    active: true,
    createdAt: new Date().toISOString(),
  });
}

export async function updateAdminUser(id: string, input: {
  name: string;
  isOwner: boolean;
  permissions: Permission[];
  active: boolean;
}) {
  await writeClient
    .patch(id)
    .set({
      name: input.name,
      isOwner: input.isOwner,
      permissions: input.isOwner ? [] : input.permissions,
      active: input.active,
    })
    .commit({ autoGenerateArrayKeys: false });
}

export async function updateAdminUserPassword(id: string, passwordHash: string) {
  await writeClient.patch(id).set({ passwordHash }).commit({ autoGenerateArrayKeys: false });
}

// ---------------- Banners ----------------

export interface AdminBannerDoc {
  _id: string;
  title: string;
  image: string | null;
  altText: string;
  link: string;
  language: 'all' | 'ru' | 'en';
  weight: number;
  startAt?: string;
  endAt?: string;
  active: boolean;
  impressions: number;
  clicks: number;
}

const BANNER_PROJECTION = `
  _id, title, "image": image.asset->url, altText, link, language, weight, startAt, endAt, active,
  "impressions": coalesce(impressions, 0), "clicks": coalesce(clicks, 0)
`;

export async function fetchAdminBanners(): Promise<AdminBannerDoc[]> {
  return client.fetch(`*[_type == "sidebarBanner"] | order(_createdAt desc){ ${BANNER_PROJECTION} }`);
}

export async function fetchAdminBannerById(id: string): Promise<AdminBannerDoc | null> {
  return client.fetch(`*[_type == "sidebarBanner" && _id == $id][0]{ ${BANNER_PROJECTION} }`, { id });
}

export interface BannerInput {
  title: string;
  altText: string;
  link: string;
  language: 'all' | 'ru' | 'en';
  weight: number;
  startAt?: string;
  endAt?: string;
  active: boolean;
  imageAssetId?: string;
}

export async function createBanner(input: BannerInput) {
  return writeClient.create({
    _type: 'sidebarBanner',
    title: input.title,
    altText: input.altText,
    link: input.link,
    language: input.language,
    weight: input.weight,
    ...(input.startAt ? { startAt: input.startAt } : {}),
    ...(input.endAt ? { endAt: input.endAt } : {}),
    active: input.active,
    impressions: 0,
    clicks: 0,
    ...(input.imageAssetId ? { image: { _type: 'image', asset: { _type: 'reference', _ref: input.imageAssetId } } } : {}),
  });
}

export async function updateBanner(id: string, input: BannerInput) {
  const patch = writeClient.patch(id).set({
    title: input.title,
    altText: input.altText,
    link: input.link,
    language: input.language,
    weight: input.weight,
    active: input.active,
  });
  if (input.startAt) patch.set({ startAt: input.startAt }); else patch.unset(['startAt']);
  if (input.endAt) patch.set({ endAt: input.endAt }); else patch.unset(['endAt']);
  if (input.imageAssetId) patch.set({ image: { _type: 'image', asset: { _type: 'reference', _ref: input.imageAssetId } } });
  await patch.commit({ autoGenerateArrayKeys: false });
}

export async function uploadImageAsset(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const asset = await writeClient.assets.upload('image', buffer, { filename: file.name });
  return asset._id;
}

// ---------------- Comments moderation ----------------

export interface AdminCommentDoc {
  _id: string;
  authorName: string;
  text: string;
  approved: boolean;
  createdAt: string;
  targetTitle: string | null;
  targetType: 'article' | 'news' | null;
  targetSlug: string | null;
  targetLocale: string | null;
}

const COMMENT_PROJECTION = `
  _id, authorName, text, approved, createdAt,
  "targetTitle": target->title,
  "targetType": target->_type,
  "targetSlug": target->slug.current,
  "targetLocale": target->language
`;

export async function fetchAdminComments(filter: 'pending' | 'approved' | 'all' = 'pending'): Promise<AdminCommentDoc[]> {
  const clause = filter === 'pending' ? '&& approved == false' : filter === 'approved' ? '&& approved == true' : '';
  return client.fetch(`*[_type == "comment" ${clause}] | order(createdAt desc){ ${COMMENT_PROJECTION} }`);
}

export async function countPendingComments(): Promise<number> {
  return client.fetch(`count(*[_type == "comment" && approved == false])`);
}

export async function setCommentApproved(id: string, approved: boolean) {
  await writeClient.patch(id).set({ approved }).commit({ autoGenerateArrayKeys: false });
}

export async function updateCommentText(id: string, text: string) {
  await writeClient.patch(id).set({ text }).commit({ autoGenerateArrayKeys: false });
}

export async function deleteComment(id: string) {
  await writeClient.delete(id);
}

// ---------------- Dashboard counts ----------------

export async function fetchDashboardCounts() {
  // "Draft" in Sanity's own sense (an unpublished `drafts.*` revision) isn't
  // visible to the standard published-content read client — the closest
  // meaningful signal we can query is "scheduled but not live yet".
  const [scheduledNews, scheduledArticles, activeBanners, exchangeCount, pendingComments, pendingReviews] = await Promise.all([
    client.fetch(`count(*[_type == "news" && publishTiming == "scheduled" && publishedAt > now()])`),
    client.fetch(`count(*[_type == "article" && publishTiming == "scheduled" && publishedAt > now()])`),
    client.fetch(`count(*[_type == "sidebarBanner" && active == true])`),
    client.fetch(`count(*[_type == "exchange"])`),
    client.fetch(`count(*[_type == "comment" && approved == false])`),
    client.fetch(`count(*[_type == "exchangeReview" && approved == false])`),
  ]);
  return { scheduledNews, scheduledArticles, activeBanners, exchangeCount, pendingComments, pendingReviews };
}
