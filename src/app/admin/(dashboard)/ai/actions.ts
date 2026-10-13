'use server';

import { redirect } from 'next/navigation';
import { revalidatePath, revalidateTag } from 'next/cache';
import { requireAdminPermission } from '@/lib/admin/auth';
import { uploadImageAsset } from '@/lib/admin/data';
import { logActivity } from '@/lib/admin/activityLog';
import {
  createAiService, updateAiService, deleteAiService, fetchAdminAiServiceById,
  createAiJob, updateAiJob, deleteAiJob, fetchAdminAiJobById, findDuplicate,
  type AiServiceInput, type AiJobInput, type AdminPlan, type AdminFacetGroup,
} from '@/lib/admin/aiData';
import type { PlanUnit } from '@/lib/ai';

/**
 * Сброс кэша каталога.
 *
 * Без него правка доезжает до сайта через час: страницы раздела живут на
 * часовом ISR, а данные — на теге `ai`. Двигать надо оба слоя, иначе
 * пересборок больше, а свежести ноль.
 */
function publishAi(slug?: string) {
  revalidateTag('ai', { expire: 0 });
  revalidateTag('ai-jobs', { expire: 0 });
  revalidateTag('ai-services', { expire: 0 });
  for (const locale of ['ru', 'en']) {
    revalidatePath(`/${locale}/ai/tools`);
    revalidatePath(`/${locale}/ai/tools/[slug]`, 'page');
    if (slug) revalidatePath(`/${locale}/ai/tools/${slug}`);
    // Ряд логотипов стоит на главной — её тоже.
    revalidatePath(`/${locale}`);
  }
  revalidatePath('/sitemap.xml');
}

const str = (f: FormData, k: string) => String(f.get(k) ?? '').trim();
const bool = (f: FormData, k: string) => f.get(k) === 'on';
const num = (f: FormData, k: string): number | null => {
  const raw = String(f.get(k) ?? '').replace(',', '.').trim();
  if (!raw) return null;
  const v = Number(raw);
  return Number.isFinite(v) ? v : null;
};
/** Многострочное поле — список: по строке на пункт, пустые отбрасываются. */
const lines = (f: FormData, k: string) =>
  String(f.get(k) ?? '').split('\n').map(s => s.trim()).filter(Boolean);

function parseService(f: FormData): AiServiceInput {
  const plans: AdminPlan[] = [];
  const names = f.getAll('plan_name').map(String);
  const prices = f.getAll('plan_price').map(String);
  const currencies = f.getAll('plan_currency').map(String);
  const units = f.getAll('plan_unit').map(String);
  const incRu = f.getAll('plan_inc_ru').map(String);
  const incEn = f.getAll('plan_inc_en').map(String);
  const recommended = String(f.get('plan_recommended') ?? '');

  names.forEach((name, i) => {
    if (!name.trim()) return;
    const raw = (prices[i] ?? '').replace(',', '.').trim();
    const price = raw === '' ? null : Number.isFinite(Number(raw)) ? Number(raw) : null;
    plans.push({
      name: name.trim(),
      price,
      currency: (currencies[i] === 'EUR' ? 'EUR' : 'USD'),
      unit: (units[i] ?? 'month') as PlanUnit,
      includes: { ru: incRu[i] ?? '', en: incEn[i] ?? '' },
      recommended: recommended === String(i),
    });
  });

  return {
    name: str(f, 'name'),
    slug: str(f, 'slug'),
    logoOnDark: bool(f, 'logoOnDark'),
    monogram: str(f, 'monogram'),
    brandColor: str(f, 'brandColor') || '#111827',
    jobId: str(f, 'jobId') || null,
    rank: num(f, 'rank'),
    website: str(f, 'website'),
    pricingUrl: str(f, 'pricingUrl'),
    foundedYear: num(f, 'foundedYear'),
    plans,
    facets: f.getAll('facets').map(String),
    tagline: { ru: str(f, 'tagline_ru'), en: str(f, 'tagline_en') },
    badgeText: { ru: str(f, 'badgeText_ru'), en: str(f, 'badgeText_en') },
    badgeColor: str(f, 'badgeColor') || 'yellow',
    highlight: { ru: str(f, 'highlight_ru'), en: str(f, 'highlight_en') },
    features: { ru: lines(f, 'features_ru'), en: lines(f, 'features_en') },
    about: { ru: str(f, 'about_ru'), en: str(f, 'about_en') },
    pros: { ru: lines(f, 'pros_ru'), en: lines(f, 'pros_en') },
    cons: { ru: lines(f, 'cons_ru'), en: lines(f, 'cons_en') },
    seoTitle: { ru: str(f, 'seoTitle_ru'), en: str(f, 'seoTitle_en') },
    seoDescription: { ru: str(f, 'seoDescription_ru'), en: str(f, 'seoDescription_en') },
    priceCheckedAt: str(f, 'priceCheckedAt') || null,
    sources: lines(f, 'sources'),
    sponsored: bool(f, 'sponsored'),
    pinned: bool(f, 'pinned'),
    hidden: bool(f, 'hidden'),
  };
}

async function logo(f: FormData): Promise<string | undefined> {
  const file = f.get('logo') as File | null;
  return file && file.size > 0 ? uploadImageAsset(file) : undefined;
}

export async function createAiServiceAction(formData: FormData) {
  await requireAdminPermission('ai');
  const input = parseService(formData);

  // Дубль не заводим: та же компания второй раз — это не новая карточка, а
  // расхождение, которое потом придётся сводить руками. Редактора уводим на
  // уже существующую запись, а не показываем ошибку без выхода.
  const dup = await findDuplicate(input.website, input.slug);
  if (dup) {
    redirect(`/admin/ai/${dup._id}?dup=${dup.reason}`);
  }

  const doc = await createAiService(input, await logo(formData));
  publishAi(input.slug);
  redirect(`/admin/ai/${doc._id}?saved=1`);
}

export async function updateAiServiceAction(id: string, formData: FormData) {
  await requireAdminPermission('ai');
  const input = parseService(formData);

  // При правке проверка та же, но своя карточка из поиска исключается.
  const dup = await findDuplicate(input.website, input.slug, id);
  if (dup) {
    redirect(`/admin/ai/${id}?clash=${dup.reason}&with=${encodeURIComponent(dup.name)}`);
  }

  await updateAiService(id, input, await logo(formData));
  publishAi(input.slug);
  redirect(`/admin/ai/${id}?saved=1`);
}

export async function deleteAiServiceAction(id: string) {
  const session = await requireAdminPermission('ai');
  const doc = await fetchAdminAiServiceById(id);
  await deleteAiService(id);
  await logActivity(session, { action: 'delete', entityType: 'aiService', entityTitle: doc?.name ?? id, entityId: id });
  publishAi(doc?.slug);
  redirect('/admin/ai');
}

/* ── Задачи и фильтр ──────────────────────────────────────────────── */

function parseJob(f: FormData): AiJobInput {
  const groups: AdminFacetGroup[] = [];
  const gTitleRu = f.getAll('g_title_ru').map(String);
  const gTitleEn = f.getAll('g_title_en').map(String);
  const gScope = f.getAll('g_scope').map(String);
  const gOpen = f.getAll('g_open').map(String);
  // Пункты приходят одним списком с номером группы в имени поля: вложенные
  // повторители в одной форме иначе не собрать обратно по индексу.
  const itemGroup = f.getAll('i_group').map(String);
  const itemKey = f.getAll('i_key').map(String);
  const itemRu = f.getAll('i_ru').map(String);
  const itemEn = f.getAll('i_en').map(String);

  gTitleRu.forEach((titleRu, gi) => {
    const items = itemKey
      .map((key, i) => ({ key: key.trim(), gi: itemGroup[i], labelRu: itemRu[i] ?? '', labelEn: itemEn[i] ?? '' }))
      .filter(x => x.gi === String(gi) && x.key)
      .map(({ key, labelRu, labelEn }) => ({ key, labelRu, labelEn }));
    if (!titleRu.trim() && items.length === 0) return;
    groups.push({
      titleRu,
      titleEn: gTitleEn[gi] ?? '',
      scope: gScope[gi] === 'global' ? 'global' : 'task',
      openByDefault: gOpen.includes(String(gi)),
      items,
    });
  });

  return {
    slug: str(f, 'slug'),
    nameRu: str(f, 'name_ru'),
    nameEn: str(f, 'name_en'),
    icon: str(f, 'icon') || 'grid',
    order: num(f, 'order') ?? 100,
    introRu: str(f, 'intro_ru'),
    introEn: str(f, 'intro_en'),
    sortedByRu: str(f, 'sorted_ru'),
    sortedByEn: str(f, 'sorted_en'),
    hidden: bool(f, 'hidden'),
    facetGroups: groups,
  };
}

export async function createAiJobAction(formData: FormData) {
  await requireAdminPermission('ai');
  const doc = await createAiJob(parseJob(formData));
  publishAi();
  redirect(`/admin/ai/filters/${doc._id}?saved=1`);
}

export async function updateAiJobAction(id: string, formData: FormData) {
  await requireAdminPermission('ai');
  await updateAiJob(id, parseJob(formData));
  publishAi();
  redirect(`/admin/ai/filters/${id}?saved=1`);
}

export async function deleteAiJobAction(id: string) {
  const session = await requireAdminPermission('ai');
  const doc = await fetchAdminAiJobById(id);
  const res = await deleteAiJob(id);
  if (!res.ok) {
    // Задачу с карточками не удаляем молча: редактор должен сначала
    // переложить их, иначе они пропали бы из раздела без следа.
    redirect(`/admin/ai/filters/${id}?used=${res.used}`);
  }
  await logActivity(session, { action: 'delete', entityType: 'aiJob', entityTitle: doc?.nameRu ?? id, entityId: id });
  publishAi();
  redirect('/admin/ai/filters');
}
