'use server';

import { revalidatePath } from 'next/cache';
import { requireAdminPermission } from '@/lib/admin/auth';
import { setCommentApproved, updateCommentText, deleteComment } from '@/lib/admin/data';

export async function approveCommentAction(formData: FormData) {
  await requireAdminPermission('comments');
  await setCommentApproved(String(formData.get('id')), true);
  revalidatePath('/admin/comments');
}

export async function rejectCommentAction(formData: FormData) {
  await requireAdminPermission('comments');
  await setCommentApproved(String(formData.get('id')), false);
  revalidatePath('/admin/comments');
}

export async function deleteCommentAction(formData: FormData) {
  await requireAdminPermission('comments');
  await deleteComment(String(formData.get('id')));
  revalidatePath('/admin/comments');
}

export async function editCommentAction(formData: FormData) {
  await requireAdminPermission('comments');
  const id = String(formData.get('id'));
  const text = String(formData.get('text') || '').trim();
  if (text) await updateCommentText(id, text);
  revalidatePath('/admin/comments');
}
