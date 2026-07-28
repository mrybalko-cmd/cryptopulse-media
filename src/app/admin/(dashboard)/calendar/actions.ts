'use server';

import { redirect } from 'next/navigation';
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

export async function createCalendarEventAction(formData: FormData) {
  await requireAdminPermission('calendar');
  const input = parseInput(formData);
  const iconFile = formData.get('icon') as File | null;
  const iconAssetId = iconFile && iconFile.size > 0 ? await uploadImageAsset(iconFile) : undefined;
  const doc = await createCalendarEvent(input, iconAssetId);
  redirect(`/admin/calendar/${doc._id}`);
}

export async function updateCalendarEventAction(id: string, formData: FormData) {
  await requireAdminPermission('calendar');
  const input = parseInput(formData);
  const iconFile = formData.get('icon') as File | null;
  const iconAssetId = iconFile && iconFile.size > 0 ? await uploadImageAsset(iconFile) : undefined;
  await updateCalendarEvent(id, input, iconAssetId);
  redirect(`/admin/calendar/${id}`);
}

export async function deleteCalendarEventAction(id: string) {
  const session = await requireAdminPermission('calendar');
  const doc = await fetchAdminCalendarEventById(id);
  await deleteCalendarEvent(id);
  await logActivity(session, { action: 'delete', entityType: 'calendarEvent', entityTitle: doc?.titleRu ?? id, entityId: id });
  redirect('/admin/calendar');
}
