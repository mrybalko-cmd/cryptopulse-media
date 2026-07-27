import { client, writeClient } from '@/lib/sanity';
import type { Permission } from './permissions';
import type { PortableTextBlock } from './portableText';

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
}

export async function fetchAuthorOptions(): Promise<AdminAuthorOption[]> {
  return client.fetch(`*[_type == "author"] | order(name asc){ _id, name }`);
}

export async function fetchTranslationCandidates(
  type: 'news' | 'article',
  language: 'ru' | 'en'
): Promise<{ _id: string; title: string }[]> {
  return client.fetch(`*[_type == $type && language == $language] | order(title asc){ _id, title }`, { type, language });
}

// ---------------- News ----------------

export interface AdminNewsListItem {
  _id: string;
  title: string;
  language: 'ru' | 'en';
  slug: string;
  publishTiming: 'now' | 'scheduled';
  publishedAt?: string;
  topic?: string;
  breaking: boolean;
}

const NEWS_LIST_PROJECTION = `
  _id, title, language, "slug": slug.current, publishTiming, publishedAt, topic,
  "breaking": coalesce(breaking, false)
`;

export async function fetchAdminNewsList(): Promise<AdminNewsListItem[]> {
  return client.fetch(`*[_type == "news"] | order(coalesce(publishedAt, _createdAt) desc){ ${NEWS_LIST_PROJECTION} }`);
}

export interface AdminNewsDoc {
  _id: string;
  language: 'ru' | 'en';
  title: string;
  slug: string;
  excerpt?: string;
  coverImage: string | null;
  coverImageAlt?: string;
  publishTiming: 'now' | 'scheduled';
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
}

const NEWS_DOC_PROJECTION = `
  _id, language, title, "slug": slug.current, excerpt,
  "coverImage": coverImage.asset->url, "coverImageAlt": coverImage.alt,
  publishTiming, publishedAt, body, sourceName, sourceUrl,
  "seoFocusKeyphrase": seo.focusKeyphrase, "seoMetaTitle": seo.metaTitle,
  "seoMetaDescription": seo.metaDescription, "seoKeywords": array::join(seo.keywords, ", "),
  "seoOgImage": seo.ogImage.asset->url, "seoCanonicalUrl": seo.canonicalUrl,
  "seoNoIndex": coalesce(seo.noIndex, false),
  topic, "ownBadge": coalesce(ownBadge, true), "badge": coalesce(badge, "none"),
  "breaking": coalesce(breaking, false), pinnedUntil,
  "authorId": author._ref, "commentsEnabled": coalesce(commentsEnabled, true),
  "translationRefId": translationRef._ref
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
  publishTiming: 'now' | 'scheduled';
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
  await patch.commit({ autoGenerateArrayKeys: false });
}

export async function deleteNews(id: string) {
  await writeClient.delete(id);
}

// ---------------- Articles ----------------

export interface AdminArticleListItem {
  _id: string;
  title: string;
  language: 'ru' | 'en';
  slug: string;
  publishTiming: 'now' | 'scheduled';
  publishedAt?: string;
  topic?: string;
  badge: string;
}

const ARTICLE_LIST_PROJECTION = `
  _id, title, language, "slug": slug.current, publishTiming, publishedAt, topic,
  "badge": coalesce(badge, "none")
`;

export async function fetchAdminArticlesList(): Promise<AdminArticleListItem[]> {
  return client.fetch(`*[_type == "article"] | order(coalesce(publishedAt, _createdAt) desc){ ${ARTICLE_LIST_PROJECTION} }`);
}

export interface AdminArticleDoc {
  _id: string;
  language: 'ru' | 'en';
  title: string;
  slug: string;
  excerpt?: string;
  coverImage: string | null;
  coverImageAlt?: string;
  publishTiming: 'now' | 'scheduled';
  publishedAt?: string;
  readingTime?: number;
  topic?: string;
  badge: string;
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
}

const ARTICLE_DOC_PROJECTION = `
  _id, language, title, "slug": slug.current, excerpt,
  "coverImage": coverImage.asset->url, "coverImageAlt": coverImage.alt,
  publishTiming, publishedAt, readingTime, topic, "badge": coalesce(badge, "none"), body,
  "seoFocusKeyphrase": seo.focusKeyphrase, "seoMetaTitle": seo.metaTitle,
  "seoMetaDescription": seo.metaDescription, "seoKeywords": array::join(seo.keywords, ", "),
  "seoOgImage": seo.ogImage.asset->url, "seoSchemaType": coalesce(seo.schemaType, "BlogPosting"),
  "seoCanonicalUrl": seo.canonicalUrl, "seoNoIndex": coalesce(seo.noIndex, false),
  "authorId": author._ref, "commentsEnabled": coalesce(commentsEnabled, true),
  "translationRefId": translationRef._ref
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
  publishTiming: 'now' | 'scheduled';
  publishedAt?: string;
  readingTime?: number;
  topic?: string;
  badge: string;
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
  await patch.commit({ autoGenerateArrayKeys: false });
}

export async function deleteArticle(id: string) {
  await writeClient.delete(id);
}

// ---------------- Exchanges ----------------

export interface AdminExchangeListItem {
  _id: string;
  name: string;
  logo: string | null;
  pinned: boolean;
  volume24h?: number;
}

export async function fetchAdminExchangesList(): Promise<AdminExchangeListItem[]> {
  return client.fetch(
    `*[_type == "exchange"] | order(name asc){ _id, name, "logo": logo.asset->url, "pinned": coalesce(pinned, false), volume24h }`
  );
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
  authorName?: string;
}

export async function fetchAllMaterialOptions(language: 'ru' | 'en'): Promise<MaterialOption[]> {
  return client.fetch(
    `*[(_type == "article" || _type == "news") && language == $language] | order(title asc){ _id, title, "authorName": author->name }`,
    { language }
  );
}

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
