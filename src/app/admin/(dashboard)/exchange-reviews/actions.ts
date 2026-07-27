'use server';

import { revalidatePath } from 'next/cache';
import { requireAdminPermission } from '@/lib/admin/auth';
import { setExchangeReviewApproved, updateExchangeReviewText, deleteExchangeReview } from '@/lib/admin/data';

export async function approveExchangeReviewAction(formData: FormData) {
  await requireAdminPermission('exchanges');
  await setExchangeReviewApproved(String(formData.get('id')), true);
  revalidatePath('/admin/exchange-reviews');
}

export async function rejectExchangeReviewAction(formData: FormData) {
  await requireAdminPermission('exchanges');
  await setExchangeReviewApproved(String(formData.get('id')), false);
  revalidatePath('/admin/exchange-reviews');
}

export async function deleteExchangeReviewAction(formData: FormData) {
  await requireAdminPermission('exchanges');
  await deleteExchangeReview(String(formData.get('id')));
  revalidatePath('/admin/exchange-reviews');
}

export async function editExchangeReviewAction(formData: FormData) {
  await requireAdminPermission('exchanges');
  const id = String(formData.get('id'));
  const text = String(formData.get('text') || '').trim();
  if (text) await updateExchangeReviewText(id, text);
  revalidatePath('/admin/exchange-reviews');
}
