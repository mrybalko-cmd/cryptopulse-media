'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { requireAdminPermission } from '@/lib/admin/auth';
import {
  setExchangeReviewApproved, setExchangeReviewRejected, updateExchangeReviewText,
  deleteExchangeReview, fetchExchangeReviewTarget,
} from '@/lib/admin/data';
import { logActivity } from '@/lib/admin/activityLog';

/**
 * Сбросить страницу биржи, к которой относится отзыв.
 *
 * Та же история, что с комментариями: действие обновляло только админку,
 * страница биржи пересобирается раз в час, а чтение отзывов жило без тега.
 * Модератор одобрял отзыв и не видел его на сайте.
 *
 * Цель читается ДО мутации: после удаления ссылки на биржу не останется.
 */
async function publishReview(target: Awaited<ReturnType<typeof fetchExchangeReviewTarget>>) {
  // В try по той же причине, что у комментариев: запись в базу уже прошла,
  // и сорвавшийся сброс кэша не должен показывать модератору ошибку.
  try {
    revalidateTag('exchange-reviews', { expire: 0 });
    revalidatePath('/admin/exchange-reviews');
    if (!target) return;
    // У биржи свой slug на каждом языке, и совпадают они не всегда.
    if (target.slugRu) revalidatePath(`/ru/exchanges/${target.slugRu}`);
    if (target.slugEn) revalidatePath(`/en/exchanges/${target.slugEn}`);
    // Средняя оценка печатается и в общем списке бирж.
    revalidatePath('/ru/exchanges');
    revalidatePath('/en/exchanges');
  } catch (e) {
    console.error('Не удалось сбросить кэш после модерации отзыва:', e);
  }
}

export async function approveExchangeReviewAction(formData: FormData) {
  await requireAdminPermission('exchanges');
  const id = String(formData.get('id'));
  const target = await fetchExchangeReviewTarget(id);
  await setExchangeReviewApproved(id, true);
  await publishReview(target);
}

/** Отклонить: уходит из очереди в «Отклонённые», решение обратимо. */
export async function rejectExchangeReviewAction(formData: FormData) {
  await requireAdminPermission('exchanges');
  const id = String(formData.get('id'));
  const target = await fetchExchangeReviewTarget(id);
  await setExchangeReviewRejected(id, true);
  await publishReview(target);
}

/** Снять с публикации: возвращает в очередь на модерацию. */
export async function unpublishExchangeReviewAction(formData: FormData) {
  await requireAdminPermission('exchanges');
  const id = String(formData.get('id'));
  const target = await fetchExchangeReviewTarget(id);
  await setExchangeReviewApproved(id, false);
  await publishReview(target);
}

/** Вернуть отклонённое обратно в очередь. */
export async function restoreExchangeReviewAction(formData: FormData) {
  await requireAdminPermission('exchanges');
  const id = String(formData.get('id'));
  const target = await fetchExchangeReviewTarget(id);
  await setExchangeReviewRejected(id, false);
  await publishReview(target);
}

export async function deleteExchangeReviewAction(formData: FormData) {
  const session = await requireAdminPermission('exchanges');
  const id = String(formData.get('id'));
  const authorName = String(formData.get('authorName') || '');
  const text = String(formData.get('text') || '');
  const target = await fetchExchangeReviewTarget(id);
  await deleteExchangeReview(id);
  await logActivity(session, {
    action: 'delete',
    entityType: 'exchangeReview',
    entityTitle: `${authorName}: ${text.slice(0, 60)}`,
    entityId: id,
  });
  await publishReview(target);
}

export async function editExchangeReviewAction(formData: FormData) {
  await requireAdminPermission('exchanges');
  const id = String(formData.get('id'));
  const text = String(formData.get('text') || '').trim();
  if (!text) return;
  const target = await fetchExchangeReviewTarget(id);
  await updateExchangeReviewText(id, text);
  await publishReview(target);
}
