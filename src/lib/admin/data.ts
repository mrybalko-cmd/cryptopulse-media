import { unstable_cache } from 'next/cache';
import { client, writeClient } from '@/lib/sanity';
import type { Permission } from './permissions';
import type { PortableTextBlock } from './portableText';
import { pragueDateKey, pragueDateKeyToUTCDate } from './timezone';

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

export async function fetchAdminUserPasswordHash(id: string): Promise<string | null> {
  const doc = await client.fetch<{ passwordHash?: string } | null>(
    `*[_type == "adminUser" && _id == $id][0]{ passwordHash }`,
    { id }
  );
  return doc?.passwordHash ?? null;
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

function imageField(assetId: string) {
  return { _type: 'image' as const, asset: { _type: 'reference' as const, _ref: assetId } };
}

// ---------------- Authors ----------------

export interface AdminAuthorOption {
  _id: string;
  name: string;
  photo: string | null;
  roleRu?: string;
  roleEn?: string;
}

export async function fetchAuthorOptions(): Promise<AdminAuthorOption[]> {
  return client.fetch(`*[_type == "author"] | order(name asc){ _id, name, "photo": photo.asset->url, roleRu, roleEn }`);
}

export interface AdminAuthorDoc {
  _id: string;
  name: string;
  slug: string;
  photo: string | null;
  roleRu?: string;
  roleEn?: string;
  bioRu?: string;
  bioEn?: string;
  telegram?: string;
  linkedin?: string;
  facebook?: string;
  twitter?: string;
  email?: string;
}

const AUTHOR_DOC_PROJECTION = `
  _id, name, "slug": slug.current, "photo": photo.asset->url,
  roleRu, roleEn, bioRu, bioEn, telegram, linkedin, facebook, twitter, email
`;

export async function fetchAdminAuthors(): Promise<AdminAuthorDoc[]> {
  return client.fetch(`*[_type == "author"] | order(name asc){ ${AUTHOR_DOC_PROJECTION} }`);
}

export async function fetchAdminAuthorById(id: string): Promise<AdminAuthorDoc | null> {
  return client.fetch(`*[_type == "author" && _id == $id][0]{ ${AUTHOR_DOC_PROJECTION} }`, { id });
}

export interface AuthorInput {
  name: string;
  slug: string;
  roleRu?: string;
  roleEn?: string;
  bioRu?: string;
  bioEn?: string;
  telegram?: string;
  linkedin?: string;
  facebook?: string;
  twitter?: string;
  email?: string;
}

function authorSetFields(input: AuthorInput) {
  return {
    name: input.name,
    slug: { _type: 'slug' as const, current: input.slug },
    roleRu: input.roleRu || undefined,
    roleEn: input.roleEn || undefined,
    bioRu: input.bioRu || undefined,
    bioEn: input.bioEn || undefined,
    telegram: input.telegram || undefined,
    linkedin: input.linkedin || undefined,
    facebook: input.facebook || undefined,
    twitter: input.twitter || undefined,
    email: input.email || undefined,
  };
}

export async function createAuthor(input: AuthorInput, photoAssetId?: string) {
  const fields = authorSetFields(input);
  return writeClient.create({
    _type: 'author',
    ...fields,
    ...(photoAssetId ? { photo: imageField(photoAssetId) } : {}),
  });
}

export async function updateAuthor(id: string, input: AuthorInput, photoAssetId?: string) {
  const fields = authorSetFields(input);
  const patch = writeClient.patch(id).set(fields);
  if (photoAssetId) patch.set({ photo: imageField(photoAssetId) });
  await patch.commit({ autoGenerateArrayKeys: false });
}

export async function deleteAuthor(id: string) {
  await writeClient.delete(id);
}

export async function fetchTranslationCandidates(
  type: 'news' | 'article',
  language: 'ru' | 'en'
): Promise<{ _id: string; title: string; coverImage: string | null }[]> {
  return client.fetch(
    `*[_type == $type && language == $language] | order(title asc){ _id, title, "coverImage": coverImage.asset->url }`,
    { type, language }
  );
}

// ---------------- Calendar events ----------------

export interface AdminCalendarEventDoc {
  _id: string;
  titleRu: string;
  titleEn: string;
  slug: string;
  descriptionRu?: string;
  descriptionEn?: string;
  date: string;
  category: string;
  importance: 'low' | 'medium' | 'high';
  icon: string | null;
  sourceUrl?: string;
  likes: number;
  dislikes: number;
}

const CALENDAR_EVENT_PROJECTION = `
  _id, "titleRu": title.ru, "titleEn": title.en, "slug": slug.current,
  "descriptionRu": description.ru, "descriptionEn": description.en,
  date, category, importance, "icon": icon.asset->url, sourceUrl,
  "likes": coalesce(likes, 0), "dislikes": coalesce(dislikes, 0)
`;

export async function fetchAdminCalendarEvents(): Promise<AdminCalendarEventDoc[]> {
  return client.fetch(`*[_type == "calendarEvent"] | order(date asc){ ${CALENDAR_EVENT_PROJECTION} }`);
}

export async function fetchAdminCalendarEventById(id: string): Promise<AdminCalendarEventDoc | null> {
  return client.fetch(`*[_type == "calendarEvent" && _id == $id][0]{ ${CALENDAR_EVENT_PROJECTION} }`, { id });
}

export interface CalendarEventInput {
  titleRu: string;
  titleEn: string;
  slug: string;
  descriptionRu?: string;
  descriptionEn?: string;
  date: string;
  category: string;
  importance: 'low' | 'medium' | 'high';
  sourceUrl?: string;
}

function calendarEventSetFields(input: CalendarEventInput) {
  return {
    title: { _type: 'object' as const, ru: input.titleRu, en: input.titleEn },
    slug: { _type: 'slug' as const, current: input.slug },
    description: { _type: 'object' as const, ru: input.descriptionRu || undefined, en: input.descriptionEn || undefined },
    date: input.date,
    category: input.category,
    importance: input.importance,
    sourceUrl: input.sourceUrl || undefined,
  };
}

export async function createCalendarEvent(input: CalendarEventInput, iconAssetId?: string) {
  const fields = calendarEventSetFields(input);
  return writeClient.create({
    _type: 'calendarEvent',
    ...fields,
    likes: 0,
    dislikes: 0,
    ...(iconAssetId ? { icon: imageField(iconAssetId) } : {}),
  });
}

export async function updateCalendarEvent(id: string, input: CalendarEventInput, iconAssetId?: string) {
  const fields = calendarEventSetFields(input);
  const patch = writeClient.patch(id).set(fields);
  if (iconAssetId) patch.set({ icon: imageField(iconAssetId) });
  await patch.commit({ autoGenerateArrayKeys: false });
}

export async function deleteCalendarEvent(id: string) {
  await writeClient.delete(id);
}

// ---------------- News ----------------

export interface AdminNewsListItem {
  _id: string;
  title: string;
  language: 'ru' | 'en';
  slug: string;
  coverImage: string | null;
  publishTiming: 'now' | 'scheduled' | 'draft';
  publishedAt?: string;
  topic?: string;
  breaking: boolean;
}

const NEWS_LIST_PROJECTION = `
  _id, title, language, "slug": slug.current, "coverImage": coverImage.asset->url,
  publishTiming, publishedAt, topic, "breaking": coalesce(breaking, false)
`;

export async function fetchAdminNewsList(): Promise<AdminNewsListItem[]> {
  return client.fetch(`*[_type == "news"] | order(select(publishTiming == "scheduled" && defined(publishedAt) && publishedAt > now() => _createdAt, coalesce(publishedAt, _createdAt)) desc){ ${NEWS_LIST_PROJECTION} }`);
}

export const ADMIN_LIST_PAGE_SIZE = 40;

export type AdminListStatusFilter = 'all' | 'published' | 'draft' | 'scheduled';

// Was: fetch every doc of the type (unbounded — 750+ news docs with an image
// join each) and filter/paginate in JS. That's the single biggest admin
// perf offender: filters/search now run in GROQ so only a page's worth of
// docs (with their image joins) ever crosses the wire, and status counts
// come from count() queries instead of scanning the full fetched array.
function statusFilterClause(filter: AdminListStatusFilter): string {
  if (filter === 'draft') return '&& publishTiming == "draft"';
  if (filter === 'scheduled') return '&& publishTiming == "scheduled" && defined(publishedAt) && publishedAt > now()';
  if (filter === 'published') return '&& publishTiming != "draft" && !(publishTiming == "scheduled" && defined(publishedAt) && publishedAt > now())';
  return '';
}

export interface AdminListPage<T> {
  items: T[];
  filteredTotal: number;
  counts: { all: number; published: number; draft: number; scheduled: number };
}

export async function fetchAdminNewsListPage(opts: {
  filter: AdminListStatusFilter;
  lang?: 'ru' | 'en';
  q?: string;
  page: number;
}): Promise<AdminListPage<AdminNewsListItem>> {
  const langClause = opts.lang ? `&& language == $lang` : '';
  const qClause = opts.q ? `&& (title match $q || pt::text(body) match $q)` : '';
  const params = { lang: opts.lang, q: opts.q ? `*${opts.q}*` : undefined };
  const filterClause = statusFilterClause(opts.filter);
  const start = Math.max(0, (opts.page - 1) * ADMIN_LIST_PAGE_SIZE);
  const end = start + ADMIN_LIST_PAGE_SIZE;

  const [items, filteredTotal, countAll, countDraft, countScheduled] = await Promise.all([
    client.fetch<AdminNewsListItem[]>(
      `*[_type == "news" ${langClause} ${qClause} ${filterClause}] | order(select(publishTiming == "scheduled" && defined(publishedAt) && publishedAt > now() => _createdAt, coalesce(publishedAt, _createdAt)) desc) [${start}...${end}]{ ${NEWS_LIST_PROJECTION} }`,
      params
    ),
    client.fetch<number>(`count(*[_type == "news" ${langClause} ${qClause} ${filterClause}])`, params),
    client.fetch<number>(`count(*[_type == "news"])`),
    client.fetch<number>(`count(*[_type == "news" && publishTiming == "draft"])`),
    client.fetch<number>(`count(*[_type == "news" && publishTiming == "scheduled" && defined(publishedAt) && publishedAt > now()])`),
  ]);

  return {
    items,
    filteredTotal,
    counts: { all: countAll, draft: countDraft, scheduled: countScheduled, published: countAll - countDraft - countScheduled },
  };
}

export interface AdminNewsDoc {
  _id: string;
  language: 'ru' | 'en';
  title: string;
  slug: string;
  excerpt?: string;
  coverImage: string | null;
  coverImageAlt?: string;
  publishTiming: 'now' | 'scheduled' | 'draft';
  publishedAt?: string;
  body: PortableTextBlock[];
  sourceName?: string;
  sourceUrl?: string;
  seoFocusKeyphrase?: string;
  seoMetaTitle?: string;
  seoMetaDescription?: string;
  seoKeywords?: string;
  seoOgImage: string | null;
  seoCanonicalUrl?: string;
  seoNoIndex: boolean;
  topic?: string;
  ownBadge: boolean;
  badge: 'none' | 'promo' | 'companyNews';
  breaking: boolean;
  pinnedUntil?: string;
  authorId?: string;
  commentsEnabled: boolean;
  translationRefId?: string;
  views: number;
  likes: number;
}

const NEWS_DOC_PROJECTION = `
  _id, language, title, "slug": slug.current, excerpt,
  "coverImage": coverImage.asset->url, "coverImageAlt": coverImage.alt,
  publishTiming, publishedAt, body, sourceName, sourceUrl,
  "seoFocusKeyphrase": seo.focusKeyphrase, "seoMetaTitle": seo.metaTitle,
  "seoMetaDescription": seo.metaDescription, "seoKeywords": array::join(seo.keywords, ", "),
  "seoOgImage": seo.ogImage.asset->url, "seoCanonicalUrl": seo.canonicalUrl,
  "seoNoIndex": coalesce(seo.noIndex, false),
  topic, "ownBadge": coalesce(ownBadge, false), "badge": coalesce(badge, "none"),
  "breaking": coalesce(breaking, false), pinnedUntil,
  "authorId": author._ref, "commentsEnabled": coalesce(commentsEnabled, true),
  "translationRefId": translationRef._ref,
  "views": coalesce(views, 0), "likes": coalesce(likes, 0)
`;

export async function fetchAdminNewsById(id: string): Promise<AdminNewsDoc | null> {
  return client.fetch(`*[_type == "news" && _id == $id][0]{ ${NEWS_DOC_PROJECTION} }`, { id });
}

export interface NewsInput {
  language: 'ru' | 'en';
  title: string;
  slug: string;
  excerpt?: string;
  coverImageAssetId?: string;
  coverImageAlt?: string;
  publishTiming: 'now' | 'scheduled' | 'draft';
  publishedAt?: string;
  body: PortableTextBlock[];
  sourceName?: string;
  sourceUrl?: string;
  seoFocusKeyphrase?: string;
  seoMetaTitle?: string;
  seoMetaDescription?: string;
  seoKeywords?: string[];
  seoOgImageAssetId?: string;
  seoCanonicalUrl?: string;
  seoNoIndex: boolean;
  topic?: string;
  ownBadge: boolean;
  badge: 'none' | 'promo' | 'companyNews';
  breaking: boolean;
  pinnedUntil?: string;
  authorId?: string;
  commentsEnabled: boolean;
  translationRefId?: string;
}

function newsSetFields(input: NewsInput) {
  return {
    language: input.language,
    title: input.title,
    slug: { _type: 'slug', current: input.slug },
    excerpt: input.excerpt || undefined,
    publishTiming: input.publishTiming,
    ...(input.publishTiming === 'scheduled' && input.publishedAt ? { publishedAt: input.publishedAt } : {}),
    ...(input.publishTiming === 'now' ? { publishedAt: new Date().toISOString() } : {}),
    body: input.body,
    sourceName: input.sourceName || undefined,
    sourceUrl: input.sourceUrl || undefined,
    seo: {
      _type: 'object',
      focusKeyphrase: input.seoFocusKeyphrase || undefined,
      metaTitle: input.seoMetaTitle || undefined,
      metaDescription: input.seoMetaDescription || undefined,
      keywords: input.seoKeywords?.length ? input.seoKeywords : undefined,
      canonicalUrl: input.seoCanonicalUrl || undefined,
      noIndex: input.seoNoIndex,
    },
    topic: input.topic || undefined,
    ownBadge: input.ownBadge,
    badge: input.badge,
    breaking: input.breaking,
    pinnedUntil: input.pinnedUntil || undefined,
    commentsEnabled: input.commentsEnabled,
    ...(input.authorId ? { author: { _type: 'reference', _ref: input.authorId } } : {}),
    ...(input.translationRefId ? { translationRef: { _type: 'reference', _ref: input.translationRefId } } : {}),
  };
}

export async function createNews(input: NewsInput, coverImageAssetId?: string, ogImageAssetId?: string) {
  const fields = newsSetFields(input);
  return writeClient.create({
    _type: 'news',
    ...fields,
    ...(coverImageAssetId ? { coverImage: { ...imageField(coverImageAssetId), alt: input.coverImageAlt || undefined } } : {}),
    seo: {
      ...fields.seo,
      ...(ogImageAssetId ? { ogImage: imageField(ogImageAssetId) } : {}),
    },
    views: 0,
    likes: 0,
  });
}

export async function updateNews(id: string, input: NewsInput, coverImageAssetId?: string, ogImageAssetId?: string) {
  const fields = newsSetFields(input);
  const patch = writeClient.patch(id).set(fields);
  if (coverImageAssetId) {
    patch.set({ coverImage: { ...imageField(coverImageAssetId), alt: input.coverImageAlt || undefined } });
  } else if (input.coverImageAlt !== undefined) {
    patch.set({ 'coverImage.alt': input.coverImageAlt });
  }
  if (ogImageAssetId) patch.set({ 'seo.ogImage': imageField(ogImageAssetId) });
  if (!input.authorId) patch.unset(['author']);
  if (!input.translationRefId) patch.unset(['translationRef']);
  if (input.publishTiming === 'draft') patch.unset(['publishedAt']);
  await patch.commit({ autoGenerateArrayKeys: false });
}

export async function deleteNews(id: string) {
  await writeClient.delete(id);
}

// ---------------- Taking material off the site (news + articles) ----------------
// Every public query filters on `publishedAt <= now()` and never looks at
// publishTiming, so the only thing that actually hides a material is clearing
// publishedAt. That would lose the original date, so it is parked in
// `unpublishedFrom` and put back verbatim when the material returns — a
// restored article keeps its real publication date instead of jumping to today.

export async function unpublishDocument(id: string): Promise<void> {
  const current = await client.fetch<{ publishedAt?: string } | null>(
    `*[_id == $id][0]{ publishedAt }`,
    { id }
  );
  const patch = writeClient.patch(id).set({ publishTiming: 'draft' }).unset(['publishedAt']);
  if (current?.publishedAt) patch.set({ unpublishedFrom: current.publishedAt });
  await patch.commit();
}

export async function republishDocument(id: string): Promise<void> {
  const current = await client.fetch<{ unpublishedFrom?: string } | null>(
    `*[_id == $id][0]{ unpublishedFrom }`,
    { id }
  );
  // No parked date means it never had one (a draft that was never live), so it
  // goes out now — publishTiming 'now' must never be left without a real
  // timestamp or the material is invisible to every listing query.
  await writeClient
    .patch(id)
    .set({ publishTiming: 'now', publishedAt: current?.unpublishedFrom ?? new Date().toISOString() })
    .unset(['unpublishedFrom'])
    .commit();
}

// Clones the raw document as-is (keeps images/body/SEO intact) rather than
// routing through NewsInput/newsSetFields — that pipeline is built for
// form submissions, not for cloning a document Sanity already has in full.
export async function duplicateNews(id: string): Promise<string> {
  const original = await client.fetch<Record<string, unknown> | null>(`*[_id == $id][0]`, { id });
  if (!original) throw new Error('News item not found');
  const { _id: _o, _rev: _r, _createdAt: _c, _updatedAt: _u, slug, title, publishedAt: _p, ...rest } = original;
  const originalSlug = (slug as { current?: string } | undefined)?.current ?? 'copy';
  const newSlug = `${originalSlug}-copy-${Math.random().toString(36).slice(2, 7)}`;
  const doc = await writeClient.create({
    ...rest,
    title: `(Копия) ${String(title ?? '')}`,
    slug: { _type: 'slug', current: newSlug },
    publishTiming: 'draft',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any);
  return doc._id;
}

// ---------------- Articles ----------------

export interface AdminArticleListItem {
  _id: string;
  title: string;
  language: 'ru' | 'en';
  slug: string;
  coverImage: string | null;
  publishTiming: 'now' | 'scheduled' | 'draft';
  publishedAt?: string;
  topic?: string;
  badge: string;
}

const ARTICLE_LIST_PROJECTION = `
  _id, title, language, "slug": slug.current, "coverImage": coverImage.asset->url,
  publishTiming, publishedAt, topic, "badge": coalesce(badge, "none")
`;

export async function fetchAdminArticlesList(): Promise<AdminArticleListItem[]> {
  return client.fetch(`*[_type == "article"] | order(select(publishTiming == "scheduled" && defined(publishedAt) && publishedAt > now() => _createdAt, coalesce(publishedAt, _createdAt)) desc){ ${ARTICLE_LIST_PROJECTION} }`);
}

export async function fetchAdminArticlesListPage(opts: {
  filter: AdminListStatusFilter;
  lang?: 'ru' | 'en';
  q?: string;
  page: number;
}): Promise<AdminListPage<AdminArticleListItem>> {
  const langClause = opts.lang ? `&& language == $lang` : '';
  const qClause = opts.q ? `&& (title match $q || pt::text(body) match $q)` : '';
  const params = { lang: opts.lang, q: opts.q ? `*${opts.q}*` : undefined };
  const filterClause = statusFilterClause(opts.filter);
  const start = Math.max(0, (opts.page - 1) * ADMIN_LIST_PAGE_SIZE);
  const end = start + ADMIN_LIST_PAGE_SIZE;

  const [items, filteredTotal, countAll, countDraft, countScheduled] = await Promise.all([
    client.fetch<AdminArticleListItem[]>(
      `*[_type == "article" ${langClause} ${qClause} ${filterClause}] | order(select(publishTiming == "scheduled" && defined(publishedAt) && publishedAt > now() => _createdAt, coalesce(publishedAt, _createdAt)) desc) [${start}...${end}]{ ${ARTICLE_LIST_PROJECTION} }`,
      params
    ),
    client.fetch<number>(`count(*[_type == "article" ${langClause} ${qClause} ${filterClause}])`, params),
    client.fetch<number>(`count(*[_type == "article"])`),
    client.fetch<number>(`count(*[_type == "article" && publishTiming == "draft"])`),
    client.fetch<number>(`count(*[_type == "article" && publishTiming == "scheduled" && defined(publishedAt) && publishedAt > now()])`),
  ]);

  return {
    items,
    filteredTotal,
    counts: { all: countAll, draft: countDraft, scheduled: countScheduled, published: countAll - countDraft - countScheduled },
  };
}

export interface AdminArticleDoc {
  _id: string;
  language: 'ru' | 'en';
  title: string;
  slug: string;
  excerpt?: string;
  coverImage: string | null;
  coverImageAlt?: string;
  publishTiming: 'now' | 'scheduled' | 'draft';
  publishedAt?: string;
  readingTime?: number;
  topic?: string;
  badge: string;
  ownBadge: boolean;
  body: PortableTextBlock[];
  seoFocusKeyphrase?: string;
  seoMetaTitle?: string;
  seoMetaDescription?: string;
  seoKeywords?: string;
  seoOgImage: string | null;
  seoSchemaType: string;
  seoCanonicalUrl?: string;
  seoNoIndex: boolean;
  authorId?: string;
  commentsEnabled: boolean;
  translationRefId?: string;
  views: number;
  likes: number;
}

const ARTICLE_DOC_PROJECTION = `
  _id, language, title, "slug": slug.current, excerpt,
  "coverImage": coverImage.asset->url, "coverImageAlt": coverImage.alt,
  publishTiming, publishedAt, readingTime, topic, "badge": coalesce(badge, "none"), "ownBadge": coalesce(ownBadge, false), body,
  "seoFocusKeyphrase": seo.focusKeyphrase, "seoMetaTitle": seo.metaTitle,
  "seoMetaDescription": seo.metaDescription, "seoKeywords": array::join(seo.keywords, ", "),
  "seoOgImage": seo.ogImage.asset->url, "seoSchemaType": coalesce(seo.schemaType, "BlogPosting"),
  "seoCanonicalUrl": seo.canonicalUrl, "seoNoIndex": coalesce(seo.noIndex, false),
  "authorId": author._ref, "commentsEnabled": coalesce(commentsEnabled, true),
  "translationRefId": translationRef._ref,
  "views": coalesce(views, 0), "likes": coalesce(likes, 0)
`;

export async function fetchAdminArticleById(id: string): Promise<AdminArticleDoc | null> {
  return client.fetch(`*[_type == "article" && _id == $id][0]{ ${ARTICLE_DOC_PROJECTION} }`, { id });
}

export interface ArticleInput {
  language: 'ru' | 'en';
  title: string;
  slug: string;
  excerpt?: string;
  coverImageAlt?: string;
  publishTiming: 'now' | 'scheduled' | 'draft';
  publishedAt?: string;
  readingTime?: number;
  topic?: string;
  badge: string;
  ownBadge: boolean;
  body: PortableTextBlock[];
  seoFocusKeyphrase?: string;
  seoMetaTitle?: string;
  seoMetaDescription?: string;
  seoKeywords?: string[];
  seoSchemaType: string;
  seoCanonicalUrl?: string;
  seoNoIndex: boolean;
  authorId?: string;
  commentsEnabled: boolean;
  translationRefId?: string;
}

function articleSetFields(input: ArticleInput) {
  return {
    language: input.language,
    title: input.title,
    slug: { _type: 'slug', current: input.slug },
    excerpt: input.excerpt || undefined,
    publishTiming: input.publishTiming,
    ...(input.publishTiming === 'scheduled' && input.publishedAt ? { publishedAt: input.publishedAt } : {}),
    ...(input.publishTiming === 'now' ? { publishedAt: new Date().toISOString() } : {}),
    readingTime: input.readingTime || undefined,
    topic: input.topic || undefined,
    badge: input.badge,
    ownBadge: input.ownBadge,
    body: input.body,
    seo: {
      _type: 'object',
      focusKeyphrase: input.seoFocusKeyphrase || undefined,
      metaTitle: input.seoMetaTitle || undefined,
      metaDescription: input.seoMetaDescription || undefined,
      keywords: input.seoKeywords?.length ? input.seoKeywords : undefined,
      schemaType: input.seoSchemaType,
      canonicalUrl: input.seoCanonicalUrl || undefined,
      noIndex: input.seoNoIndex,
    },
    commentsEnabled: input.commentsEnabled,
    ...(input.authorId ? { author: { _type: 'reference', _ref: input.authorId } } : {}),
    ...(input.translationRefId ? { translationRef: { _type: 'reference', _ref: input.translationRefId } } : {}),
  };
}

export async function createArticle(input: ArticleInput, coverImageAssetId?: string, ogImageAssetId?: string) {
  const fields = articleSetFields(input);
  return writeClient.create({
    _type: 'article',
    ...fields,
    ...(coverImageAssetId ? { coverImage: { ...imageField(coverImageAssetId), alt: input.coverImageAlt || undefined } } : {}),
    seo: {
      ...fields.seo,
      ...(ogImageAssetId ? { ogImage: imageField(ogImageAssetId) } : {}),
    },
    views: 0,
    likes: 0,
  });
}

export async function updateArticle(id: string, input: ArticleInput, coverImageAssetId?: string, ogImageAssetId?: string) {
  const fields = articleSetFields(input);
  const patch = writeClient.patch(id).set(fields);
  if (coverImageAssetId) {
    patch.set({ coverImage: { ...imageField(coverImageAssetId), alt: input.coverImageAlt || undefined } });
  } else if (input.coverImageAlt !== undefined) {
    patch.set({ 'coverImage.alt': input.coverImageAlt });
  }
  if (ogImageAssetId) patch.set({ 'seo.ogImage': imageField(ogImageAssetId) });
  if (!input.authorId) patch.unset(['author']);
  if (!input.translationRefId) patch.unset(['translationRef']);
  if (input.publishTiming === 'draft') patch.unset(['publishedAt']);
  await patch.commit({ autoGenerateArrayKeys: false });
}

export async function deleteArticle(id: string) {
  await writeClient.delete(id);
}

export async function duplicateArticle(id: string): Promise<string> {
  const original = await client.fetch<Record<string, unknown> | null>(`*[_id == $id][0]`, { id });
  if (!original) throw new Error('Article not found');
  const { _id: _o, _rev: _r, _createdAt: _c, _updatedAt: _u, slug, title, publishedAt: _p, ...rest } = original;
  const originalSlug = (slug as { current?: string } | undefined)?.current ?? 'copy';
  const newSlug = `${originalSlug}-copy-${Math.random().toString(36).slice(2, 7)}`;
  const doc = await writeClient.create({
    ...rest,
    title: `(Копия) ${String(title ?? '')}`,
    slug: { _type: 'slug', current: newSlug },
    publishTiming: 'draft',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any);
  return doc._id;
}

// ---------------- Exchanges ----------------

export interface AdminExchangeListItem {
  _id: string;
  name: string;
  logo: string | null;
  pinned: boolean;
  pinPosition?: number;
  volume24h?: number;
  type: string[];
  foundedYear?: number;
  regionTones: string[];
}

export async function fetchAdminExchangesList(): Promise<AdminExchangeListItem[]> {
  const list = await client.fetch<AdminExchangeListItem[]>(
    `*[_type == "exchange"] | order(name asc){
      _id, name, "logo": logo.asset->url, "pinned": coalesce(pinned, false), pinPosition, volume24h,
      "type": coalesce(type, []), foundedYear, "regionTones": regions[].tone
    }`
  );
  // Pinned exchanges rise to the top (ordered by their pin position), matching
  // how they're elevated on the public site; everything else stays name-sorted.
  return list.sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    if (a.pinned && b.pinned) return (a.pinPosition ?? 99) - (b.pinPosition ?? 99);
    return 0;
  });
}

export interface ExchangeBadgeItem { textRu: string; textEn: string; tone: string; link?: string }
export interface ExchangeRegionItem { regionRu: string; regionEn: string; tone: string; noteRu?: string; noteEn?: string }
export interface ExchangeProductItem {
  image: string | null;
  imageAssetRef: string | null;
  nameRu: string;
  nameEn: string;
  shortRu?: string;
  shortEn?: string;
  longRu?: string;
  longEn?: string;
}

export interface AdminExchangeDoc {
  _id: string;
  name: string;
  logo: string | null;
  logoBg?: string;
  slugRu: string;
  slugEn: string;
  foundedYear?: number;
  website: string;
  linkLabel?: string;
  trackingUrl?: string;
  tradeUrl?: string;
  coingeckoId?: string;
  type: string[];
  taglineRu?: string;
  taglineEn?: string;
  descriptionRu: PortableTextBlock[];
  descriptionEn: PortableTextBlock[];
  products: ExchangeProductItem[];
  badges: ExchangeBadgeItem[];
  regions: ExchangeRegionItem[];
  pinned: boolean;
  pinPosition?: number;
  pinUntil?: string;
  reviewsEnabled: boolean;
  seoMetaTitleRu?: string;
  seoMetaTitleEn?: string;
  seoMetaDescriptionRu?: string;
  seoMetaDescriptionEn?: string;
  seoNoIndex: boolean;
}

const EXCHANGE_DOC_PROJECTION = `
  _id, name, "logo": logo.asset->url, logoBg, "slugRu": slugRu.current, "slugEn": slugEn.current,
  foundedYear, website, linkLabel, trackingUrl, tradeUrl, coingeckoId, type, taglineRu, taglineEn,
  descriptionRu, descriptionEn,
  "products": products[]{ "image": image.asset->url, "imageAssetRef": image.asset._ref, nameRu, nameEn, shortRu, shortEn, longRu, longEn },
  "badges": badges[]{ textRu, textEn, tone, link },
  "regions": regions[]{ regionRu, regionEn, tone, noteRu, noteEn },
  "pinned": coalesce(pinned, false), pinPosition, pinUntil, "reviewsEnabled": coalesce(reviewsEnabled, true),
  "seoMetaTitleRu": seo.metaTitleRu, "seoMetaTitleEn": seo.metaTitleEn,
  "seoMetaDescriptionRu": seo.metaDescriptionRu, "seoMetaDescriptionEn": seo.metaDescriptionEn,
  "seoNoIndex": coalesce(seo.noIndex, false)
`;

export async function fetchAdminExchangeById(id: string): Promise<AdminExchangeDoc | null> {
  return client.fetch(`*[_type == "exchange" && _id == $id][0]{ ${EXCHANGE_DOC_PROJECTION} }`, { id });
}

export interface ExchangeInput {
  name: string;
  logoBg?: string;
  slugRu: string;
  slugEn: string;
  foundedYear?: number;
  website: string;
  linkLabel?: string;
  trackingUrl?: string;
  tradeUrl?: string;
  coingeckoId?: string;
  type: string[];
  taglineRu?: string;
  taglineEn?: string;
  descriptionRu: PortableTextBlock[];
  descriptionEn: PortableTextBlock[];
  products: (ExchangeProductItem & { imageAssetId?: string })[];
  badges: ExchangeBadgeItem[];
  regions: ExchangeRegionItem[];
  pinned: boolean;
  pinPosition?: number;
  pinUntil?: string;
  reviewsEnabled: boolean;
  seoMetaTitleRu?: string;
  seoMetaTitleEn?: string;
  seoMetaDescriptionRu?: string;
  seoMetaDescriptionEn?: string;
  seoNoIndex: boolean;
}

function exchangeSetFields(input: ExchangeInput) {
  return {
    name: input.name,
    logoBg: input.logoBg || undefined,
    slugRu: { _type: 'slug', current: input.slugRu },
    slugEn: { _type: 'slug', current: input.slugEn },
    foundedYear: input.foundedYear || undefined,
    website: input.website,
    linkLabel: input.linkLabel || undefined,
    trackingUrl: input.trackingUrl || undefined,
    tradeUrl: input.tradeUrl || undefined,
    coingeckoId: input.coingeckoId || undefined,
    type: input.type,
    taglineRu: input.taglineRu || undefined,
    taglineEn: input.taglineEn || undefined,
    descriptionRu: input.descriptionRu,
    descriptionEn: input.descriptionEn,
    products: input.products.map((p, i) => ({
      _type: 'exchangeProduct',
      _key: `product-${i}-${Math.random().toString(36).slice(2, 8)}`,
      nameRu: p.nameRu,
      nameEn: p.nameEn,
      shortRu: p.shortRu || undefined,
      shortEn: p.shortEn || undefined,
      longRu: p.longRu || undefined,
      longEn: p.longEn || undefined,
      ...(p.imageAssetId ? { image: imageField(p.imageAssetId) } : {}),
    })),
    badges: input.badges.map((b, i) => ({
      _type: 'exchangeBadge',
      _key: `badge-${i}-${Math.random().toString(36).slice(2, 8)}`,
      textRu: b.textRu,
      textEn: b.textEn,
      tone: b.tone,
      link: b.link || undefined,
    })),
    regions: input.regions.map((r, i) => ({
      _type: 'exchangeRegion',
      _key: `region-${i}-${Math.random().toString(36).slice(2, 8)}`,
      regionRu: r.regionRu,
      regionEn: r.regionEn,
      tone: r.tone,
      noteRu: r.noteRu || undefined,
      noteEn: r.noteEn || undefined,
    })),
    pinned: input.pinned,
    pinPosition: input.pinned ? input.pinPosition : undefined,
    pinUntil: input.pinned ? (input.pinUntil || undefined) : undefined,
    reviewsEnabled: input.reviewsEnabled,
    seo: {
      _type: 'object',
      metaTitleRu: input.seoMetaTitleRu || undefined,
      metaTitleEn: input.seoMetaTitleEn || undefined,
      metaDescriptionRu: input.seoMetaDescriptionRu || undefined,
      metaDescriptionEn: input.seoMetaDescriptionEn || undefined,
      noIndex: input.seoNoIndex,
    },
  };
}

export async function createExchange(input: ExchangeInput, logoAssetId?: string) {
  const fields = exchangeSetFields(input);
  return writeClient.create({
    _type: 'exchange',
    ...fields,
    ...(logoAssetId ? { logo: imageField(logoAssetId) } : {}),
    volume24h: 0,
  });
}

export async function updateExchange(id: string, input: ExchangeInput, logoAssetId?: string) {
  const fields = exchangeSetFields(input);
  const patch = writeClient.patch(id).set(fields);
  if (logoAssetId) patch.set({ logo: imageField(logoAssetId) });
  await patch.commit({ autoGenerateArrayKeys: false });
}

export async function deleteExchange(id: string) {
  await writeClient.delete(id);
}

// ---------------- Homepage settings ----------------

export interface AdminFeaturedAuthorSlot {
  authorId: string;
  authorName?: string;
  materialRuId: string;
  materialRuTitle?: string;
  materialEnId: string;
  materialEnTitle?: string;
}

export interface AdminHomeSettings {
  showNews: boolean;
  showArticles: boolean;
  showAuthorColumns: boolean;
  featuredAuthors: AdminFeaturedAuthorSlot[];
}

const HOME_SETTINGS_ID = 'homeSettings';

export async function fetchAdminHomeSettings(): Promise<AdminHomeSettings> {
  const doc = await client.fetch<AdminHomeSettings | null>(
    `*[_type == "homeSettings" && _id == "${HOME_SETTINGS_ID}"][0]{
      "showNews": coalesce(showNews, true), "showArticles": coalesce(showArticles, true),
      "showAuthorColumns": coalesce(showAuthorColumns, true),
      "featuredAuthors": featuredAuthors[]{
        "authorId": author._ref, "authorName": author->name,
        "materialRuId": materialRu._ref, "materialRuTitle": materialRu->title,
        "materialEnId": materialEn._ref, "materialEnTitle": materialEn->title
      }
    }`
  );
  return doc ?? { showNews: true, showArticles: true, showAuthorColumns: true, featuredAuthors: [] };
}

export interface MaterialOption {
  _id: string;
  title: string;
  authorId?: string;
  authorName?: string;
  coverImage: string | null;
  publishedAt?: string;
}

// Feeds the homepage author-column material pickers, which need the whole
// set client-side for per-author filtering (see HomeAuthorColumnsEditor) —
// hundreds of docs either way, so a few minutes of staleness here is a much
// better trade than an 800+ row unbounded fetch on every /admin/homepage view.
// Ordered by recency (not title) so the picker's default "recent 3" view
// needs no extra client-side sort.
export const fetchAllMaterialOptions = unstable_cache(
  async (language: 'ru' | 'en'): Promise<MaterialOption[]> => {
    return client.fetch(
      `*[(_type == "article" || _type == "news") && language == $language] | order(publishedAt desc){ _id, title, "authorId": author._ref, "authorName": author->name, "coverImage": coverImage.asset->url, publishedAt }`,
      { language }
    );
  },
  ['admin-all-material-options'],
  { revalidate: 180 }
);

export interface HomeSettingsInput {
  showNews: boolean;
  showArticles: boolean;
  showAuthorColumns: boolean;
  featuredAuthors: { authorId: string; materialRuId: string; materialEnId: string }[];
}

export async function updateAdminHomeSettings(input: HomeSettingsInput) {
  const fields = {
    _type: 'homeSettings',
    showNews: input.showNews,
    showArticles: input.showArticles,
    showAuthorColumns: input.showAuthorColumns,
    featuredAuthors: input.featuredAuthors.map((slot, i) => ({
      _type: 'featuredAuthorSlot',
      _key: `slot-${i}-${Math.random().toString(36).slice(2, 8)}`,
      author: { _type: 'reference', _ref: slot.authorId },
      materialRu: { _type: 'reference', _ref: slot.materialRuId },
      materialEn: { _type: 'reference', _ref: slot.materialEnId },
    })),
  };
  await writeClient.createOrReplace({ _id: HOME_SETTINGS_ID, ...fields });
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

// ---------------- Exchange reviews ----------------

export interface AdminExchangeReviewDoc {
  _id: string;
  authorName: string;
  rating: number;
  text: string;
  approved: boolean;
  createdAt: string;
  exchangeId: string | null;
  exchangeName: string | null;
  exchangeSlugRu: string | null;
}

const EXCHANGE_REVIEW_PROJECTION = `
  _id, authorName, rating, text, approved, createdAt,
  "exchangeId": exchange->_id, "exchangeName": exchange->name, "exchangeSlugRu": exchange->slugRu.current
`;

export async function fetchAdminExchangeReviews(filter: 'pending' | 'approved' | 'all' = 'pending'): Promise<AdminExchangeReviewDoc[]> {
  const clause = filter === 'pending' ? '&& approved == false' : filter === 'approved' ? '&& approved == true' : '';
  return client.fetch(`*[_type == "exchangeReview" ${clause}] | order(createdAt desc){ ${EXCHANGE_REVIEW_PROJECTION} }`);
}

export async function countPendingExchangeReviews(): Promise<number> {
  return client.fetch(`count(*[_type == "exchangeReview" && approved == false])`);
}

export async function setExchangeReviewApproved(id: string, approved: boolean) {
  await writeClient.patch(id).set({ approved }).commit({ autoGenerateArrayKeys: false });
}

export async function updateExchangeReviewText(id: string, text: string) {
  await writeClient.patch(id).set({ text }).commit({ autoGenerateArrayKeys: false });
}

export async function deleteExchangeReview(id: string) {
  await writeClient.delete(id);
}

// ---------------- Dashboard counts ----------------

export interface ScheduleItem {
  type: 'news' | 'article' | 'banner-start' | 'banner-end' | 'exchange-pin';
  id: string;
  title: string;
  at: string;
  href: string;
  permission: Permission;
  /** null = not language-specific (banners/exchanges); 'all' = banner shown in both languages */
  language: 'ru' | 'en' | 'all' | null;
  /** true once `at` is in the past — i.e. already happened/published, not merely planned */
  realized: boolean;
}

export interface ScheduleBannerWindow {
  _id: string;
  title: string;
  startAt?: string;
  endAt?: string;
  language: 'ru' | 'en' | 'all';
}

/** windowStart/windowEnd are ISO strings bounding which items are fetched. */
export async function fetchScheduleItems(
  windowStart: string,
  windowEnd: string
): Promise<{ items: ScheduleItem[]; banners: ScheduleBannerWindow[] }> {
  const [news, articles, banners, exchanges] = await Promise.all([
    client.fetch<{ _id: string; title: string; publishedAt: string; language: 'ru' | 'en' }[]>(
      `*[_type == "news" && defined(publishedAt) && publishedAt >= $windowStart && publishedAt <= $windowEnd]{ _id, title, publishedAt, language }`,
      { windowStart, windowEnd }
    ),
    client.fetch<{ _id: string; title: string; publishedAt: string; language: 'ru' | 'en' }[]>(
      `*[_type == "article" && defined(publishedAt) && publishedAt >= $windowStart && publishedAt <= $windowEnd]{ _id, title, publishedAt, language }`,
      { windowStart, windowEnd }
    ),
    client.fetch<ScheduleBannerWindow[]>(
      `*[_type == "sidebarBanner" && (defined(startAt) || defined(endAt))]{ _id, title, startAt, endAt, "language": coalesce(language, "all") }`
    ),
    client.fetch<{ _id: string; name: string; pinUntil: string }[]>(
      `*[_type == "exchange" && pinned == true && defined(pinUntil) && pinUntil >= $windowStart && pinUntil <= $windowEnd]{ _id, name, pinUntil }`,
      { windowStart, windowEnd }
    ),
  ]);

  const items: ScheduleItem[] = [];
  const now = Date.now();
  const startMs = new Date(windowStart).getTime();
  const endMs = new Date(windowEnd).getTime();
  const inWindow = (iso: string) => {
    const t = new Date(iso).getTime();
    return t >= startMs && t <= endMs;
  };

  for (const n of news) {
    items.push({ type: 'news', id: n._id, title: n.title, at: n.publishedAt, href: `/admin/news/${n._id}`, permission: 'news', language: n.language, realized: new Date(n.publishedAt).getTime() <= now });
  }
  for (const a of articles) {
    items.push({ type: 'article', id: a._id, title: a.title, at: a.publishedAt, href: `/admin/articles/${a._id}`, permission: 'articles', language: a.language, realized: new Date(a.publishedAt).getTime() <= now });
  }
  for (const b of banners) {
    if (b.startAt && inWindow(b.startAt)) {
      items.push({ type: 'banner-start', id: b._id, title: b.title, at: b.startAt, href: `/admin/banners/${b._id}`, permission: 'banners', language: b.language, realized: new Date(b.startAt).getTime() <= now });
    }
    if (b.endAt && inWindow(b.endAt)) {
      items.push({ type: 'banner-end', id: b._id, title: b.title, at: b.endAt, href: `/admin/banners/${b._id}`, permission: 'banners', language: b.language, realized: new Date(b.endAt).getTime() <= now });
    }
  }
  for (const e of exchanges) {
    items.push({ type: 'exchange-pin', id: e._id, title: e.name, at: e.pinUntil, href: `/admin/exchanges/${e._id}`, permission: 'exchanges', language: null, realized: new Date(e.pinUntil).getTime() <= now });
  }

  return { items: items.sort((x, y) => new Date(x.at).getTime() - new Date(y.at).getTime()), banners };
}

export async function fetchDashboardCounts() {
  const weekFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  const [draftNews, draftArticles, activeBanners, exchangeCount, pendingComments, pendingReviews, scheduleThisWeek, activeSubscribers] = await Promise.all([
    client.fetch(`count(*[_type == "news" && publishTiming == "draft"])`),
    client.fetch(`count(*[_type == "article" && publishTiming == "draft"])`),
    client.fetch(`count(*[_type == "sidebarBanner" && active == true])`),
    client.fetch(`count(*[_type == "exchange"])`),
    client.fetch(`count(*[_type == "comment" && approved == false])`),
    client.fetch(`count(*[_type == "exchangeReview" && approved == false])`),
    client.fetch(
      `count(*[
        (_type == "news" && publishTiming == "scheduled" && publishedAt > now() && publishedAt < $weekFromNow) ||
        (_type == "article" && publishTiming == "scheduled" && publishedAt > now() && publishedAt < $weekFromNow) ||
        (_type == "sidebarBanner" && ((defined(startAt) && startAt > now() && startAt < $weekFromNow) || (defined(endAt) && endAt > now() && endAt < $weekFromNow))) ||
        (_type == "exchange" && pinned == true && defined(pinUntil) && pinUntil > now() && pinUntil < $weekFromNow)
      ])`,
      { weekFromNow }
    ),
    client.fetch(`count(*[_type == "emailSubscriber" && active != false])`),
  ]);
  return { draftNews, draftArticles, activeBanners, exchangeCount, pendingComments, pendingReviews, scheduleThisWeek, activeSubscribers };
}

// ---------------- Schedule analytics ----------------

export interface DailyPublicationCount {
  date: string; // YYYY-MM-DD
  count: number;
}

// These three stats queries don't need per-request freshness (a few minutes
// of staleness is fine for "top liked"/"trend"/"by author" widgets) but were
// each scanning hundreds of docs with no bound on every /admin/schedule view
// — fetchAuthorLikesLeaderboard alone measured ~800ms unbounded. Caching them
// for a few minutes turns that into a one-time cost instead of a per-visit one.
export const fetchPublicationTrend = unstable_cache(
  async (days: number): Promise<{ counts: DailyPublicationCount[]; total: number; average: number }> => {
  const todayKey = pragueDateKey(new Date());
  const todayUTC = pragueDateKeyToUTCDate(todayKey);
  const startUTC = new Date(todayUTC);
  startUTC.setUTCDate(startUTC.getUTCDate() - (days - 1));
  // Fetch a day of buffer on each side — CEST is UTC+2, so the Prague day
  // boundary sits a couple of hours before/after the UTC one — then bucket
  // precisely by Prague day key below rather than trusting this window edge.
  const fetchStart = new Date(startUTC);
  fetchStart.setUTCDate(fetchStart.getUTCDate() - 1);
  const fetchEnd = new Date(todayUTC);
  fetchEnd.setUTCDate(fetchEnd.getUTCDate() + 1);

  const rows = await client.fetch<{ publishedAt: string }[]>(
    `*[_type in ["news", "article"] && defined(publishedAt) && publishedAt >= $start && publishedAt <= $end]{ publishedAt }`,
    { start: fetchStart.toISOString(), end: fetchEnd.toISOString() }
  );

  const countByDay = new Map<string, number>();
  for (const row of rows) {
    const key = pragueDateKey(row.publishedAt);
    countByDay.set(key, (countByDay.get(key) ?? 0) + 1);
  }

  const counts: DailyPublicationCount[] = Array.from({ length: days }, (_, i) => {
    const d = new Date(startUTC);
    d.setUTCDate(startUTC.getUTCDate() + i);
    const key = pragueDateKey(d);
    return { date: key, count: countByDay.get(key) ?? 0 };
  });

  const total = counts.reduce((sum, c) => sum + c.count, 0);
  const average = days > 0 ? total / days : 0;
  return { counts, total, average };
  },
  ['admin-publication-trend'],
  { revalidate: 180 }
);

export interface TopLikedItem {
  id: string;
  type: 'news' | 'article';
  title: string;
  language: 'ru' | 'en';
  likes: number;
  href: string;
}

export const fetchTopLikedContent = unstable_cache(
  async (limit: number): Promise<TopLikedItem[]> => {
  const rows = await client.fetch<{ _id: string; _type: 'news' | 'article'; title: string; language: 'ru' | 'en'; likes: number }[]>(
    `*[_type in ["news", "article"] && coalesce(likes, 0) > 0] | order(likes desc)[0...${limit}]{ _id, _type, title, language, "likes": coalesce(likes, 0) }`
  );
  return rows.map(r => ({
    id: r._id,
    type: r._type,
    title: r.title,
    language: r.language,
    likes: r.likes,
    href: r._type === 'news' ? `/admin/news/${r._id}` : `/admin/articles/${r._id}`,
  }));
  },
  ['admin-top-liked'],
  { revalidate: 180 }
);

export interface AuthorLikesLeaderboardItem {
  id: string;
  name: string;
  totalLikes: number;
}

export const fetchAuthorLikesLeaderboard = unstable_cache(
  async (): Promise<AuthorLikesLeaderboardItem[]> => {
  const [rows, authors] = await Promise.all([
    client.fetch<{ authorId: string | null; likes: number }[]>(
      `*[_type in ["news", "article"] && defined(author)]{ "authorId": author._ref, "likes": coalesce(likes, 0) }`
    ),
    fetchAuthorOptions(),
  ]);

  const totals = new Map<string, number>();
  for (const row of rows) {
    if (!row.authorId) continue;
    totals.set(row.authorId, (totals.get(row.authorId) ?? 0) + row.likes);
  }

  return authors
    .map(a => ({ id: a._id, name: a.name, totalLikes: totals.get(a._id) ?? 0 }))
    .filter(a => a.totalLikes > 0)
    .sort((a, b) => b.totalLikes - a.totalLikes);
  },
  ['admin-author-likes-leaderboard'],
  { revalidate: 180 }
);

export interface AuthorPublicationCountItem {
  id: string;
  name: string;
  count: number;
}

export const fetchAuthorPublicationCounts = unstable_cache(
  async (): Promise<AuthorPublicationCountItem[]> => {
  const [rows, authors] = await Promise.all([
    client.fetch<{ authorId: string | null }[]>(
      `*[_type in ["news", "article"] && defined(author)]{ "authorId": author._ref }`
    ),
    fetchAuthorOptions(),
  ]);

  const totals = new Map<string, number>();
  for (const row of rows) {
    if (!row.authorId) continue;
    totals.set(row.authorId, (totals.get(row.authorId) ?? 0) + 1);
  }

  return authors
    .map(a => ({ id: a._id, name: a.name, count: totals.get(a._id) ?? 0 }))
    .filter(a => a.count > 0)
    .sort((a, b) => b.count - a.count);
  },
  ['admin-author-publication-counts'],
  { revalidate: 180 }
);

// ---------------- Pulse (read-only snapshot log) ----------------
//
// marketSnapshot is written once a day by /api/cron/pulse-snapshot — every
// field is readOnly in the schema, so this admin section is a history log
// plus a preview of what the share card looks like today, not an editor.

export interface PulseSnapshot {
  _id: string;
  date: string;
  totalVolume24h: number;
  fearGreedValue: number;
  altSeasonValue: number;
  /** Weekday-adjusted — what the score uses. */
  volumeChangePct: number;
  /** Unadjusted, vs a plain 7-day mean. What we published before 11.08.2026;
   *  kept so the two methods stay comparable in the log. */
  volumeChangePctRaw?: number;
  weekdayFactor?: number;
  pulseScore: number;
  pulseClassification: string;
  computedAt: string;
}

export async function fetchPulseHistory(limit: number): Promise<PulseSnapshot[]> {
  return client.fetch(
    `*[_type == "marketSnapshot"] | order(date desc) [0...${limit}]{
      _id, date, totalVolume24h, fearGreedValue, altSeasonValue,
      volumeChangePct, volumeChangePctRaw, weekdayFactor,
      pulseScore, pulseClassification, computedAt
    }`
  );
}

// ---------------- Email Subscribers ----------------

export interface AdminSubscriber {
  _id: string;
  email: string;
  locale: 'ru' | 'en';
  source?: string;
  subscribedAt: string;
  active: boolean;
}

export interface AdminSubscribersPage {
  items: AdminSubscriber[];
  filteredTotal: number;
  counts: { all: number; active: number; inactive: number };
}

export async function fetchAdminSubscribersPage(opts: {
  q?: string;
  locale?: 'ru' | 'en';
  status?: 'all' | 'active' | 'inactive';
  page: number;
}): Promise<AdminSubscribersPage> {
  const localeClause = opts.locale ? `&& locale == $locale` : '';
  const qClause = opts.q ? `&& email match $q` : '';
  const statusClause = opts.status === 'active' ? `&& active != false` : opts.status === 'inactive' ? `&& active == false` : '';
  const params = { locale: opts.locale, q: opts.q ? `*${opts.q}*` : undefined };
  const start = Math.max(0, (opts.page - 1) * ADMIN_LIST_PAGE_SIZE);
  const end = start + ADMIN_LIST_PAGE_SIZE;

  const [items, filteredTotal, countAll, countInactive] = await Promise.all([
    client.fetch<AdminSubscriber[]>(
      `*[_type == "emailSubscriber" ${localeClause} ${qClause} ${statusClause}] | order(subscribedAt desc) [${start}...${end}]{
        _id, email, locale, source, subscribedAt, "active": coalesce(active, true)
      }`,
      params
    ),
    client.fetch<number>(`count(*[_type == "emailSubscriber" ${localeClause} ${qClause} ${statusClause}])`, params),
    client.fetch<number>(`count(*[_type == "emailSubscriber"])`),
    client.fetch<number>(`count(*[_type == "emailSubscriber" && active == false])`),
  ]);

  return {
    items,
    filteredTotal,
    counts: { all: countAll, inactive: countInactive, active: countAll - countInactive },
  };
}

export async function fetchAllSubscriberEmails(status: 'all' | 'active' | 'inactive', locale?: 'ru' | 'en'): Promise<AdminSubscriber[]> {
  const localeClause = locale ? `&& locale == $locale` : '';
  const statusClause = status === 'active' ? `&& active != false` : status === 'inactive' ? `&& active == false` : '';
  return client.fetch<AdminSubscriber[]>(
    `*[_type == "emailSubscriber" ${localeClause} ${statusClause}] | order(subscribedAt desc) {
      _id, email, locale, source, subscribedAt, "active": coalesce(active, true)
    }`,
    { locale }
  );
}

export async function setSubscriberActive(id: string, active: boolean): Promise<void> {
  await writeClient.patch(id).set({ active }).commit({ autoGenerateArrayKeys: false });
}

export async function deleteSubscriber(id: string): Promise<void> {
  await writeClient.delete(id);
}
