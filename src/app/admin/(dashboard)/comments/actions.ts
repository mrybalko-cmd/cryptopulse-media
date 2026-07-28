'use server';

import { revalidatePath } from 'next/cache';
import { requireAdminPermission } from '@/lib/admin/auth';
import { setCommentApproved, updateCommentText, deleteComment } from '@/lib/admin/data';
import { logActivity } from '@/lib/admin/activityLog';

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
  const session = await requireAdminPermission('comments');
  const id = String(formData.get('id'));
  const authorName = String(formData.get('authorName') || '');
  const text = String(formData.get('text') || '');
  await deleteComment(id);
  await logActivity(session, {
    action: 'delete',
    entityType: 'comment',
    entityTitle: `${authorName}: ${text.slice(0, 60)}`,
    entityId: id,
  });
  revalidatePath('/admin/comments');
}

export async function editCommentAction(formData: FormData) {
  await requireAdminPermission('comments');
  const id = String(formData.get('id'));
  const text = String(formData.get('text') || '').trim();
  if (text) await updateCommentText(id, text);
  revalidatePath('/admin/comments');
}
