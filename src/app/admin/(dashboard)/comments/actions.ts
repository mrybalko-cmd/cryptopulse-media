'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { requireAdminPermission } from '@/lib/admin/auth';
import {
  setCommentApproved, setCommentRejected, updateCommentText, deleteComment, fetchCommentTarget,
} from '@/lib/admin/data';
import { logActivity } from '@/lib/admin/activityLog';

export async function approveCommentAction(formData: FormData) {
  await requireAdminPermission('comments');
  const id = String(formData.get('id'));
  const target = await fetchCommentTarget(id);
  await setCommentApproved(id, true);
  await publishTarget(target);
}

/** Отклонить: уходит из очереди в «Отклонённые», решение обратимо. */
export async function rejectCommentAction(formData: FormData) {
  await requireAdminPermission('comments');
  const id = String(formData.get('id'));
  const target = await fetchCommentTarget(id);
  await setCommentRejected(id, true);
  await publishTarget(target);
}

/** Снять с публикации: возвращает в очередь на модерацию. */
export async function unpublishCommentAction(formData: FormData) {
  await requireAdminPermission('comments');
  const id = String(formData.get('id'));
  const target = await fetchCommentTarget(id);
  await setCommentApproved(id, false);
  await publishTarget(target);
}

/** Вернуть отклонённое обратно в очередь. */
export async function restoreCommentAction(formData: FormData) {
  await requireAdminPermission('comments');
  const id = String(formData.get('id'));
  const target = await fetchCommentTarget(id);
  await setCommentRejected(id, false);
  await publishTarget(target);
}

export async function deleteCommentAction(formData: FormData) {
  const session = await requireAdminPermission('comments');
  const id = String(formData.get('id'));
  const authorName = String(formData.get('authorName') || '');
  const text = String(formData.get('text') || '');
  const target = await fetchCommentTarget(id);
  await deleteComment(id);
  await logActivity(session, {
    action: 'delete',
    entityType: 'comment',
    entityTitle: `${authorName}: ${text.slice(0, 60)}`,
    entityId: id,
  });
  await publishTarget(target);
}

export async function editCommentAction(formData: FormData) {
  await requireAdminPermission('comments');
  const id = String(formData.get('id'));
  const text = String(formData.get('text') || '').trim();
  if (!text) return;
  const target = await fetchCommentTarget(id);
  await updateCommentText(id, text);
  await publishTarget(target);
}

/**
 * Сбросить кэш там, где этот комментарий показывается.
 *
 * Сами комментарии подтягивает браузер через /api/comments, а не разметка
 * страницы, поэтому главное здесь — тег: чтение висело в кэше на пять минут
 * и без тега сбросить его было нечем. Модератор жал «Одобрить», комментарий
 * уходил из очереди, а на материале появлялся не сразу — со стороны это
 * читается как неработающая кнопка, хотя в базе всё проставлялось верно.
 *
 * Путь материала сбрасывается заодно: подпись с числом комментариев
 * попадает в саму страницу.
 *
 * Цель читается ДО мутации, в самих действиях: после удаления ссылки на
 * материал уже не будет.
 */
async function publishTarget(target: Awaited<ReturnType<typeof fetchCommentTarget>>) {
  // В try: запись в базу уже прошла, и сорвавшийся сброс кэша не должен
  // превращать удачное действие в ошибку на экране. Хуже задержки в
  // несколько минут только модератор, который не понимает, сработало ли.
  try {
    revalidateTag('comments', { expire: 0 });
    revalidatePath('/admin/comments');
    if (!target?.slug) return;
    const section = target.type === 'news' ? 'news' : 'articles';
    for (const locale of target.locale ? [target.locale] : ['ru', 'en']) {
      revalidatePath(`/${locale}/${section}/${target.slug}`);
    }
  } catch (e) {
    console.error('Не удалось сбросить кэш после модерации комментария:', e);
  }
}
