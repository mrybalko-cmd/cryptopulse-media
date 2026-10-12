'use server';

import { redirect } from 'next/navigation';
import { requireOwner } from '@/lib/admin/auth';
import { createDeal, updateDeal, deleteDeal, fetchDealById, type DealInput, type PlacementKind, type DealCurrency, type DealSource, type DealStatus } from '@/lib/admin/deals';
import { logActivity } from '@/lib/admin/activityLog';

/**
 * Размещения приходят пятью параллельными списками — так их отдаёт форма,
 * где у каждой строки одинаковые имена полей. Собираем обратно по индексу.
 *
 * Строка без суммы отбрасывается молча: это пустая строка, которую добавили
 * и не заполнили, и падать из-за неё формой с потерей всего введённого
 * нельзя.
 */
function parse(formData: FormData): DealInput {
  const kinds = formData.getAll('kind').map(String) as PlacementKind[];
  const customKinds = formData.getAll('customKind').map(String);
  const amounts = formData.getAll('amount').map(String);
  const urls = formData.getAll('url').map(String);
  const notes = formData.getAll('note').map(String);

  const placements = kinds
    .map((kind, i) => ({
      kind,
      customKind: customKinds[i] ?? '',
      amount: Number(String(amounts[i] ?? '').replace(',', '.')),
      url: urls[i] ?? '',
      note: notes[i] ?? '',
    }))
    .filter(p => Number.isFinite(p.amount));

  const num = (name: string, fallback: number) => {
    const v = Number(String(formData.get(name) ?? '').replace(',', '.'));
    return Number.isFinite(v) ? v : fallback;
  };

  return {
    client: String(formData.get('client') || ''),
    dealDate: String(formData.get('dealDate') || ''),
    source: String(formData.get('source') || 'direct') as DealSource,
    partner: String(formData.get('partner') || ''),
    status: String(formData.get('status') || 'invoiced') as DealStatus,
    paidAt: String(formData.get('paidAt') || ''),
    invoiceNo: String(formData.get('invoiceNo') || ''),
    currency: String(formData.get('currency') || 'EUR') as DealCurrency,
    fxToEur: num('fxToEur', 1),
    commissionPct: num('commissionPct', 0),
    placements,
    notes: String(formData.get('notes') || ''),
  };
}

/**
 * Сброса кэша здесь нет, и это не забытый шаг: сделки нигде на сайте не
 * показываются. Появится виджет «нас рекламируют» — сброс добавится вместе
 * с ним.
 *
 * В журнал действий пишется только удаление — как у остального раздела.
 * Журнал нужен, чтобы восстановить картину после пропажи, а не чтобы вести
 * второй экземпляр базы: создание и правка видны в самой сделке.
 */
export async function createDealAction(formData: FormData) {
  await requireOwner();
  const doc = await createDeal(parse(formData));
  redirect(`/admin/deals/${doc._id}?saved=1`);
}

export async function updateDealAction(id: string, formData: FormData) {
  await requireOwner();
  await updateDeal(id, parse(formData));
  redirect(`/admin/deals/${id}?saved=1`);
}

export async function deleteDealAction(id: string) {
  const session = await requireOwner();
  const doc = await fetchDealById(id);
  await deleteDeal(id);
  await logActivity(session, { action: 'delete', entityType: 'adDeal', entityTitle: doc?.client ?? id, entityId: id });
  redirect('/admin/deals');
}
