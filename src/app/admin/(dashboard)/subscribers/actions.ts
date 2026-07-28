'use server';

import { revalidatePath } from 'next/cache';
import { requireAdminPermission } from '@/lib/admin/auth';
import { setSubscriberActive, deleteSubscriber } from '@/lib/admin/data';
import { logActivity } from '@/lib/admin/activityLog';

export async function toggleSubscriberAction(formData: FormData) {
  await requireAdminPermission('subscribers');
  const id = String(formData.get('id'));
  const active = formData.get('active') === 'true';
  await setSubscriberActive(id, active);
  revalidatePath('/admin/subscribers');
}

export async function deleteSubscriberAction(formData: FormData) {
  const session = await requireAdminPermission('subscribers');
  const id = String(formData.get('id'));
  const email = String(formData.get('email') || id);
  await deleteSubscriber(id);
  await logActivity(session, { action: 'delete', entityType: 'subscriber', entityTitle: email, entityId: id });
  revalidatePath('/admin/subscribers');
}
