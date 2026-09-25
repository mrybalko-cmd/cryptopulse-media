'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireAdminPermission } from '@/lib/admin/auth';
import {
  setSubscriberActive, deleteSubscriber, createSubscriber, updateSubscriber,
  type SubscriberInput,
} from '@/lib/admin/data';
import { logActivity } from '@/lib/admin/activityLog';

function parseInput(formData: FormData): SubscriberInput {
  return {
    email: String(formData.get('email') || '').trim().toLowerCase(),
    locale: formData.get('locale') === 'ru' ? 'ru' : 'en',
    active: formData.get('active') !== 'off' && formData.get('active') !== null,
    source: String(formData.get('source') || '').trim() || undefined,
  };
}

/** Публичной страницы у списка нет, поэтому сбрасываем только админку. */
function publishSubscribers() {
  revalidatePath('/admin/subscribers');
}

export async function toggleSubscriberAction(formData: FormData) {
  await requireAdminPermission('subscribers');
  const id = String(formData.get('id'));
  const active = formData.get('active') === 'true';
  await setSubscriberActive(id, active);
  publishSubscribers();
}

export async function deleteSubscriberAction(formData: FormData) {
  const session = await requireAdminPermission('subscribers');
  const id = String(formData.get('id'));
  const email = String(formData.get('email') || id);
  await deleteSubscriber(id);
  await logActivity(session, { action: 'delete', entityType: 'subscriber', entityTitle: email, entityId: id });
  publishSubscribers();
}

/**
 * Ошибка возвращается через адрес, а не исключением.
 *
 * Действие без формы состояния не имеет куда положить сообщение, а
 * непойманное исключение в проде показывает пустой экран ошибки Next и
 * человек теряет введённое. Занятый адрес — обычный рабочий случай, а не
 * поломка, и сообщать о нём надо строкой над формой.
 */
export async function createSubscriberAction(formData: FormData) {
  await requireAdminPermission('subscribers');
  const input = parseInput(formData);
  if (!input.email.includes('@')) redirect('/admin/subscribers?error=email');
  try {
    await createSubscriber(input);
  } catch (e) {
    redirect(`/admin/subscribers?error=${encodeURIComponent((e as Error).message)}`);
  }
  publishSubscribers();
  redirect('/admin/subscribers?saved=1');
}

export async function updateSubscriberAction(formData: FormData) {
  await requireAdminPermission('subscribers');
  const id = String(formData.get('id'));
  const input = parseInput(formData);
  if (!input.email.includes('@')) redirect('/admin/subscribers?error=email');
  try {
    await updateSubscriber(id, input);
  } catch (e) {
    redirect(`/admin/subscribers?error=${encodeURIComponent((e as Error).message)}`);
  }
  publishSubscribers();
  redirect('/admin/subscribers?saved=1');
}
