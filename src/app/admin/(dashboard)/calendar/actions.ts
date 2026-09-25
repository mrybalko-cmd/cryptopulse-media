'use server';

import { redirect } from 'next/navigation';
import { revalidatePath, revalidateTag } from 'next/cache';
import { requireAdminPermission } from '@/lib/admin/auth';
import { createCalendarEvent, updateCalendarEvent, deleteCalendarEvent, fetchAdminCalendarEventById, uploadImageAsset, type CalendarEventInput } from '@/lib/admin/data';
import { logActivity } from '@/lib/admin/activityLog';

function parseInput(formData: FormData): CalendarEventInput {
  return {
    titleRu: String(formData.get('titleRu') || ''),
    titleEn: String(formData.get('titleEn') || ''),
    slug: String(formData.get('slug') || ''),
    descriptionRu: String(formData.get('descriptionRu') || ''),
    descriptionEn: String(formData.get('descriptionEn') || ''),
    date: String(formData.get('date') || ''),
    category: String(formData.get('category') || 'other'),
    importance: (String(formData.get('importance') || 'medium') as CalendarEventInput['importance']),
    sourceUrl: String(formData.get('sourceUrl') || ''),
  };
}

/**
 * Сбросить всё, где видно календарь.
 *
 * Без этого добавленное событие появлялось на сайте только по истечении
 * кэша. Та же дыра, что закрыли в авторах и баннерах: действие в админке
 * обязано сбрасывать кэш, иначе правка доезжает до часа.
 *
 * Календарь показывается не только на своей странице, но и каруселью на
 * главной, поэтому сбрасываются обе.
 */
function publishCalendar() {
  revalidateTag('calendar', { expire: 0 });
  for (const locale of ['ru', 'en']) {
    revalidatePath(`/${locale}/calendar`);
    revalidatePath(`/${locale}`);
  }
}

export async function createCalendarEventAction(formData: FormData) {
  await requireAdminPermission('calendar');
  const input = parseInput(formData);
  const iconFile = formData.get('icon') as File | null;
  const iconAssetId = iconFile && iconFile.size > 0 ? await uploadImageAsset(iconFile) : undefined;
  const doc = await createCalendarEvent(input, iconAssetId);
  publishCalendar();
  redirect(`/admin/calendar/${doc._id}?saved=1`);
}

export async function updateCalendarEventAction(id: string, formData: FormData) {
  await requireAdminPermission('calendar');
  const input = parseInput(formData);
  const iconFile = formData.get('icon') as File | null;
  const iconAssetId = iconFile && iconFile.size > 0 ? await uploadImageAsset(iconFile) : undefined;
  await updateCalendarEvent(id, input, iconAssetId);
  publishCalendar();
  redirect(`/admin/calendar/${id}?saved=1`);
}

export async function deleteCalendarEventAction(id: string) {
  const session = await requireAdminPermission('calendar');
  const doc = await fetchAdminCalendarEventById(id);
  await deleteCalendarEvent(id);
  await logActivity(session, { action: 'delete', entityType: 'calendarEvent', entityTitle: doc?.titleRu ?? id, entityId: id });
  publishCalendar();
  redirect('/admin/calendar');
}
