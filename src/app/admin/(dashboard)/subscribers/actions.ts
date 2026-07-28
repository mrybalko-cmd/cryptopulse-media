'use server';

import { revalidatePath } from 'next/cache';
import { requireAdminPermission } from '@/lib/admin/auth';
import { setSubscriberActive, deleteSubscriber } from '@/lib/admin/data';

export async function toggleSubscriberAction(formData: FormData) {
  await requireAdminPermission('subscribers');
  const id = String(formData.get('id'));
  const active = formData.get('active') === 'true';
  await setSubscriberActive(id, active);
  revalidatePath('/admin/subscribers');
}

export async function deleteSubscriberAction(formData: FormData) {
  await requireAdminPermission('subscribers');
  await deleteSubscriber(String(formData.get('id')));
  revalidatePath('/admin/subscribers');
}
